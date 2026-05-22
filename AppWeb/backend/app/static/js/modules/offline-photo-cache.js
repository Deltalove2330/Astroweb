// ===========================================================================
// offline-photo-cache.js
// Sistema de caché offline para fotos — IndexedDB + sincronización automática
//
// CÓMO INTEGRAR:
//   1. Incluir este archivo ANTES de realizar-ruta-mercaderista.js
//      <script src="/js/modules/offline-photo-cache.js"></script>
//      <script src="/js/modules/realizar-ruta-mercaderista.js"></script>
//
//   2. En realizar-ruta-mercaderista.js reemplazar cada fetch de subida por el
//      wrapper correspondiente (ver sección "PUNTOS DE INTEGRACIÓN" al final).
// ===========================================================================

(function (window) {
    'use strict';

    // -------------------------------------------------------------------------
    // Configuración
    // -------------------------------------------------------------------------
    var DB_NAME    = 'mercaderista_offline';
    var DB_VERSION = 1;
    var STORE_NAME = 'pending_photos';

    // Cuántos ms esperar entre reintentos de sincronización (backoff exponencial)
    var RETRY_BASE_MS = 5000;   // 5 segundos la primera vez
    var RETRY_MAX_MS  = 120000; // máximo 2 minutos

    // Timeout por subida. Se calcula según la cantidad de archivos: subir 10
    // fotos por red móvil tarda mucho más que una sola, y un timeout fijo de
    // 45s las dejaba en "Tiempo de espera agotado" para siempre.
    var UPLOAD_TIMEOUT_BASE_MS     = 60000;   // 60s base
    var UPLOAD_TIMEOUT_PER_FILE_MS = 12000;   // +12s por cada archivo
    var UPLOAD_TIMEOUT_MAX_MS      = 300000;  // tope 5 minutos

    function _computeTimeout(fileCount) {
        var n = (fileCount && fileCount > 0) ? fileCount : 1;
        return Math.min(
            UPLOAD_TIMEOUT_BASE_MS + n * UPLOAD_TIMEOUT_PER_FILE_MS,
            UPLOAD_TIMEOUT_MAX_MS
        );
    }

    // -------------------------------------------------------------------------
    // Estado interno
    // -------------------------------------------------------------------------
    var _db           = null;   // Instancia de IDBDatabase
    var _syncTimer    = null;   // Timer del polling de red
    var _syncing      = false;  // Guard para evitar sincronizaciones simultáneas
    var _retryCount   = 0;      // Intentos fallidos consecutivos
    var _onlineNow    = navigator.onLine;

    // -------------------------------------------------------------------------
    // Utilidades de UI
    // -------------------------------------------------------------------------
    function _renderBanner(count) {
        var existing = document.getElementById('offlineCacheBanner');
        var isOnline = navigator.onLine;
        var bg       = isOnline ? '#0d6efd' : '#ff9800';
        var icon     = isOnline ? 'bi-cloud-upload' : 'bi-wifi-off';
        var msg      = isOnline
            ? 'fotos pendientes por subir.'
            : 'fotos guardadas en el dispositivo (sin conexión).';
        var actionTxt = isOnline
            ? 'Toca para subir / gestionar.'
            : 'Se subirán automáticamente al recuperar internet.';

        if (existing) {
            existing.style.background = bg;
            existing.querySelector('.banner-icon').className = 'bi ' + icon + ' banner-icon';
            existing.querySelector('#offlineCacheCount').textContent = count;
            existing.querySelector('.banner-msg').textContent = msg;
            existing.querySelector('.banner-action').textContent = actionTxt;
            return;
        }
        var banner = document.createElement('div');
        banner.id = 'offlineCacheBanner';
        banner.style.cssText = [
            'position:fixed',
            'bottom:0',
            'left:0',
            'right:0',
            'z-index:9999',
            'background:' + bg,
            'color:#fff',
            'font-weight:600',
            'padding:10px 16px',
            'display:flex',
            'align-items:center',
            'gap:10px',
            'box-shadow:0 -2px 8px rgba(0,0,0,.25)',
            'cursor:pointer'
        ].join(';');
        banner.innerHTML = [
            '<i class="bi ' + icon + ' banner-icon" style="font-size:1.2rem"></i>',
            '<span><span id="offlineCacheCount">' + count + '</span> ',
            '<span class="banner-msg">' + msg + '</span></span>',
            '<span class="banner-action" style="margin-left:auto;font-size:.85rem;opacity:.85;text-decoration:underline">',
            actionTxt,
            '</span>'
        ].join('');
        banner.addEventListener('click', function () {
            OfflineCache.openQueueManager();
        });
        document.body.appendChild(banner);
    }

    function _hideOfflineBanner() {
        var banner = document.getElementById('offlineCacheBanner');
        if (banner) banner.remove();
    }

    function _updateOfflineBanner() {
        OfflineCache.getPendingCount().then(function (count) {
            if (count > 0) {
                _renderBanner(count);
            } else {
                _hideOfflineBanner();
            }
        });
    }

    function _showSyncToast(msg, type) {
        // Usa SweetAlert2 si está disponible, si no solo console
        if (window.Swal) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: type || 'info',
                title: msg,
                showConfirmButton: false,
                timer: 3500,
                timerProgressBar: true
            });
        } else {
            console.info('[OfflineCache]', msg);
        }
    }

    // -------------------------------------------------------------------------
    // fetch con timeout — crítico para no colgar la UI cuando hay señal débil
    // -------------------------------------------------------------------------
    function _fetchWithTimeout(url, options, timeoutMs) {
        timeoutMs = timeoutMs || UPLOAD_TIMEOUT_BASE_MS;
        options = options || {};

        return new Promise(function (resolve, reject) {
            var controller, timeoutId;
            if (typeof AbortController !== 'undefined') {
                controller = new AbortController();
                options.signal = controller.signal;
            }
            timeoutId = setTimeout(function () {
                if (controller) controller.abort();
                reject(new Error('Tiempo de espera agotado (' + Math.round(timeoutMs / 1000) + 's)'));
            }, timeoutMs);

            fetch(url, options).then(function (res) {
                clearTimeout(timeoutId);
                resolve(res);
            }).catch(function (err) {
                clearTimeout(timeoutId);
                if (err && err.name === 'AbortError') {
                    reject(new Error('Tiempo de espera agotado'));
                } else {
                    reject(err);
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // IndexedDB — apertura y esquema
    // -------------------------------------------------------------------------
    function _openDB() {
        return new Promise(function (resolve, reject) {
            if (_db) { resolve(_db); return; }

            var req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = function (e) {
                var db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    var store = db.createObjectStore(STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    // Índices para consultas rápidas
                    store.createIndex('status',    'status',    { unique: false });
                    store.createIndex('endpoint',  'endpoint',  { unique: false });
                    store.createIndex('createdAt', 'createdAt', { unique: false });
                }
            };

            req.onsuccess = function (e) {
                _db = e.target.result;
                console.log('[OfflineCache] IndexedDB abierta');
                resolve(_db);
            };

            req.onerror = function (e) {
                console.error('[OfflineCache] Error abriendo DB:', e.target.error);
                reject(e.target.error);
            };
        });
    }

    // -------------------------------------------------------------------------
    // Operaciones sobre el store
    // -------------------------------------------------------------------------

    /**
     * Guarda una solicitud pendiente en IndexedDB.
     *
     * @param {string}   endpoint  - URL del fetch (p.ej. '/api/upload-activation-photo')
     * @param {FormData} formData  - FormData que se enviará
     * @param {object}   meta      - Metadatos adicionales para mostrar en la UI
     *                               { photoType, pointId, visitaId, cedula, label }
     * @returns {Promise<number>}  - ID asignado por la BD
     */
    function _saveRequest(endpoint, formData, meta) {
        return _openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                // IndexedDB almacena Blob/File de forma nativa. Guardamos los
                // archivos tal cual — convertirlos a ArrayBuffer con FileReader
                // duplicaba la memoria y, con 26-36 fotos leídas a la vez,
                // causaba "memoria insuficiente" en teléfonos de gama baja.
                var entries = {};
                var files   = [];

                formData.forEach(function (value, key) {
                    if (value instanceof File || value instanceof Blob) {
                        files.push({
                            key:  key,
                            blob: value,
                            name: value.name || key,
                            type: value.type || 'image/jpeg'
                        });
                    } else {
                        if (!entries[key]) entries[key] = [];
                        entries[key].push({ key: key, value: value });
                    }
                });

                var record = {
                    endpoint:  endpoint,
                    entries:   entries,     // campos texto/número
                    files:     files,       // campos de archivo (Blob nativo)
                    meta:      meta || {},
                    status:    'pending',   // 'pending' | 'uploading' | 'done' | 'error'
                    attempts:  0,
                    createdAt: Date.now(),
                    lastTryAt: null,
                    error:     null
                };

                var tx    = db.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                var req   = store.add(record);

                req.onsuccess = function (e) {
                    console.log('[OfflineCache] Registro guardado id=' + e.target.result);
                    resolve(e.target.result);
                };
                req.onerror = function (e) {
                    reject(e.target.error);
                };
            });
        });
    }

    function _getPendingRecords() {
        return _openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx      = db.transaction(STORE_NAME, 'readonly');
                var store   = tx.objectStore(STORE_NAME);
                var index   = store.index('status');
                var req     = index.getAll('pending');
                req.onsuccess = function (e) { resolve(e.target.result); };
                req.onerror   = function (e) { reject(e.target.error); };
            });
        });
    }

    function _updateRecord(id, changes) {
        return _openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx    = db.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                var req   = store.get(id);
                req.onsuccess = function (e) {
                    var record = e.target.result;
                    if (!record) { resolve(); return; }
                    Object.assign(record, changes);
                    var put = store.put(record);
                    put.onsuccess = function () { resolve(); };
                    put.onerror   = function (ev) { reject(ev.target.error); };
                };
                req.onerror = function (e) { reject(e.target.error); };
            });
        });
    }

    function _deleteRecord(id) {
        return _openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx    = db.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                var req   = store.delete(id);
                req.onsuccess = function () { resolve(); };
                req.onerror   = function (e) { reject(e.target.error); };
            });
        });
    }

    function _getAllRecords() {
        return _openDB().then(function (db) {
            return new Promise(function (resolve, reject) {
                var tx      = db.transaction(STORE_NAME, 'readonly');
                var store   = tx.objectStore(STORE_NAME);
                var req     = store.getAll();
                req.onsuccess = function (e) { resolve(e.target.result); };
                req.onerror   = function (e) { reject(e.target.error); };
            });
        });
    }

    /**
     * Devuelve a 'pending' los registros que quedaron en 'uploading'.
     * Si la app se cierra/recarga a mitad de una subida, el registro queda
     * marcado 'uploading' para siempre: _getPendingRecords() solo busca
     * 'pending', así que nunca se reintenta y se ve eternamente como
     * "Subiendo...". Esto se llama una vez al arrancar.
     */
    function _resetStuckUploading() {
        return _openDB().then(function (db) {
            return new Promise(function (resolve) {
                var tx    = db.transaction(STORE_NAME, 'readwrite');
                var store = tx.objectStore(STORE_NAME);
                var index = store.index('status');
                var req   = index.openCursor(IDBKeyRange.only('uploading'));
                var fixed = 0;
                req.onsuccess = function (e) {
                    var cursor = e.target.result;
                    if (cursor) {
                        var rec = cursor.value;
                        rec.status = 'pending';
                        cursor.update(rec);
                        fixed++;
                        cursor.continue();
                    } else {
                        if (fixed > 0) {
                            console.log('[OfflineCache] ♻️ ' + fixed +
                                ' registro(s) "uploading" huérfanos devueltos a la cola');
                        }
                        resolve();
                    }
                };
                req.onerror = function () { resolve(); };
            });
        });
    }

    // -------------------------------------------------------------------------
    // Reconstruir FormData desde un registro guardado
    // -------------------------------------------------------------------------
    function _rebuildFormData(record) {
        var fd = new FormData();

        // Campos de texto
        Object.values(record.entries).forEach(function (arr) {
            arr.forEach(function (item) {
                fd.append(item.key, item.value);
            });
        });

        // Campos de archivo. Los registros nuevos guardan un Blob nativo en
        // f.blob; los registros antiguos (formato previo) traían un ArrayBuffer
        // en f.buffer — se siguen soportando para no perder fotos en cola.
        record.files.forEach(function (f) {
            var blob = f.blob;
            if (!blob && f.buffer) {
                blob = new Blob([f.buffer], { type: f.type || 'image/jpeg' });
            }
            var file = (blob instanceof File)
                ? blob
                : new File([blob], f.name, { type: f.type || 'image/jpeg' });
            fd.append(f.key, file, f.name);
        });

        return fd;
    }

    // -------------------------------------------------------------------------
    // Sincronización
    // -------------------------------------------------------------------------
    
    function _syncOne(record) {
    var fd = _rebuildFormData(record);

    // Errores permanentes: no tiene sentido reintentar
    var PERMANENT_ERRORS = [400, 401, 403, 404, 422];

    return _updateRecord(record.id, { status: 'uploading', lastTryAt: Date.now() })
        .then(function () {
            return _fetchWithTimeout(record.endpoint, {
                method: 'POST',
                body:   fd,
                credentials: 'include'
            }, _computeTimeout((record.files || []).length));
        })
        .then(function (res) {
            // ── Error PERMANENTE: descartar, jamás reintentar ─────────
            if (PERMANENT_ERRORS.indexOf(res.status) !== -1) {
                console.warn(
                    '[OfflineCache] ❌ Error permanente HTTP ' + res.status +
                    ' en id=' + record.id + ' endpoint=' + record.endpoint +
                    ' — descartando (no se reintentará)'
                );
                return _deleteRecord(record.id).then(function () {
                    return { ok: false, permanent: true, status: res.status, meta: record.meta };
                });
            }
            // ── Error TEMPORAL (5xx, red): lanzar para que catch reintente
            if (!res.ok) {
                throw new Error('HTTP ' + res.status);
            }
            return res.json();
        })
        .then(function (data) {
            // Viene del bloque de error permanente — propagar sin tocar
            if (data && data.permanent === true) {
                return data;
            }
            if (data && data.success === false) {
                // El servidor respondió 200 pero con success:false
                // Tratar como permanente también (datos inválidos)
                console.warn(
                    '[OfflineCache] ❌ Servidor rechazó id=' + record.id +
                    ': ' + (data.message || 'sin mensaje') + ' — descartando'
                );
                return _deleteRecord(record.id).then(function () {
                    return { ok: false, permanent: true, message: data.message, meta: record.meta };
                });
            }
            // ── Éxito real ────────────────────────────────────────────
            return _deleteRecord(record.id).then(function () {
                console.log('[OfflineCache] ✅ Foto sincronizada id=' + record.id);
                return { ok: true, data: data, meta: record.meta };
            });
        })
        .catch(function (err) {
            // Solo errores TEMPORALES llegan aquí (5xx, timeout, red caída)
            console.warn(
                '[OfflineCache] ⚠️ Fallo temporal id=' + record.id + ': ' + err.message +
                ' — se reintentará'
            );
            return _updateRecord(record.id, {
                status:   'pending',
                attempts: (record.attempts || 0) + 1,
                error:    err.message
            }).then(function () {
                return { ok: false, error: err.message, meta: record.meta };
            });
        });
}

    function _syncAll() {
        // navigator.onLine NO es fiable (da falsos negativos con 4G en Android/
        // iOS). Intentamos siempre: si de verdad no hay red, el fetch falla
        // rápido y el registro queda 'pending' para el próximo ciclo.
        if (_syncing) return Promise.resolve();
        _syncing = true;

        return _getPendingRecords().then(function (records) {
            if (records.length === 0) {
                _syncing = false;
                _updateOfflineBanner();
                return;
            }

            // Priorizar registros con menos intentos fallidos: si uno falla
            // siempre (p.ej. 502 perpetuo) no debe bloquear a los demás.
            records.sort(function (a, b) {
                return (a.attempts || 0) - (b.attempts || 0) ||
                       (a.createdAt || 0) - (b.createdAt || 0);
            });

            console.log('[OfflineCache] 🔄 Sincronizando ' + records.length + ' foto(s) pendiente(s)...');

            // Subir secuencialmente para no saturar la conexión móvil
            var chain = Promise.resolve({ successCount: 0, failCount: 0 });

            records.forEach(function (record) {
                chain = chain.then(function (acc) {
                    return _syncOne(record).then(function (result) {
                        if (result.ok) {
                            acc.successCount++;
                            // Disparar evento para que la UI pueda reaccionar
                            window.dispatchEvent(new CustomEvent('offlinePhotoSynced', {
                                detail: { meta: result.meta, data: result.data }
                            }));
                        } else {
                            acc.failCount++;
                        }
                        return acc;
                    });
                });
            });

            return chain.then(function (totals) {
                _syncing = false;
                _updateOfflineBanner();

                if (totals.successCount > 0) {
                    _retryCount = 0;
                    _showSyncToast(
                        '✅ ' + totals.successCount + ' foto(s) sincronizada(s) con el servidor.',
                        'success'
                    );
                }
                if (totals.failCount > 0) {
                    _retryCount++;
                    console.warn('[OfflineCache] ' + totals.failCount + ' foto(s) no pudieron sincronizarse.');
                }
            });
        }).catch(function (err) {
            _syncing = false;
            console.error('[OfflineCache] Error en syncAll:', err);
        });
    }

    // -------------------------------------------------------------------------
    // Scheduler de sincronización (polling adaptativo)
    // -------------------------------------------------------------------------
    function _scheduleSync() {
        if (_syncTimer) clearTimeout(_syncTimer);

        var delay = Math.min(
            RETRY_BASE_MS * Math.pow(2, _retryCount),
            RETRY_MAX_MS
        );

        _syncTimer = setTimeout(function () {
            _syncAll().then(function () {
                _scheduleSync(); // reprogramar siempre
            });
        }, delay);
    }

    // -------------------------------------------------------------------------
    // Listeners de conectividad
    // -------------------------------------------------------------------------
    window.addEventListener('online', function () {
        if (!_onlineNow) {
            _onlineNow = true;
            console.log('[OfflineCache] 🌐 Conexión restaurada — iniciando sincronización');
            _retryCount = 0;
            _syncAll().then(_scheduleSync);
        }
    });

    window.addEventListener('offline', function () {
        _onlineNow = false;
        console.log('[OfflineCache] 📵 Sin conexión');
        _updateOfflineBanner();
    });

    // -------------------------------------------------------------------------
    // API pública: OfflineCache
    // -------------------------------------------------------------------------
    var OfflineCache = {

        /**
         * Intenta enviar el FormData al endpoint.
         * - Si hay conexión: lo envía directamente; si falla, lo guarda en caché.
         * - Si no hay conexión: lo guarda en caché inmediatamente.
         *
         * @param {string}   endpoint
         * @param {FormData} formData
         * @param {object}   meta       - { photoType, pointId, visitaId, cedula, label }
         * @returns {Promise<object>}   - { success, cached, data? }
         */
        submitWithCache: function (endpoint, formData, meta) {
            meta = meta || {};

            // navigator.onLine NO es fiable: con 4G bueno a veces reporta
            // "sin conexión", lo que mandaba todo directo a caché y mostraba
            // "Sin conexión" sin intentar siquiera. Ahora SIEMPRE se intenta
            // subir; solo si el fetch falla de verdad se guarda en caché.
var PERMANENT_ERRORS = [400, 401, 403, 404, 422];

var _fileCount = 0;
try {
    formData.forEach(function (v) {
        if (v instanceof File || v instanceof Blob) _fileCount++;
    });
} catch (e) { _fileCount = 1; }

return _fetchWithTimeout(endpoint, {
    method: 'POST',
    body:   formData,
    credentials: 'include'
}, _computeTimeout(_fileCount))
.then(function (res) {
    // ── Error PERMANENTE: devolver directo, NO cachear ────────────
    // Cachear un 400 solo causaría reintentos infinitos fallidos
    if (PERMANENT_ERRORS.indexOf(res.status) !== -1) {
        return res.json().catch(function () {
            return { success: false, message: 'HTTP ' + res.status };
        }).then(function (body) {
            console.warn(
                '[OfflineCache] ❌ Error permanente HTTP ' + res.status +
                ' en ' + endpoint + ' — NO se cachea'
            );
            return { _isPermanentError: true, success: false, data: body };
        });
    }
    // ── Error TEMPORAL: lanzar para que catch lo cachee ──────────
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
})
.then(function (data) {
    // Viene del bloque de error permanente — devolver sin cachear
    if (data && data._isPermanentError === true) {
        return { success: false, cached: false, data: data.data };
    }
    if (data && data.success === false) {
        // 200 OK pero el servidor dice success:false — tampoco cachear
        console.warn('[OfflineCache] ❌ Servidor rechazó la solicitud: ' +
                     (data.message || 'sin mensaje') + ' — NO se cachea');
        return { success: false, cached: false, data: data };
    }
    console.log('[OfflineCache] ✅ Foto subida directamente al servidor.');
    return { success: true, cached: false, data: data };
})
.catch(function (err) {
    // Solo errores TEMPORALES (5xx, timeout, red caída) se cachean
    console.warn('[OfflineCache] ⚠️ Fallo temporal (' + err.message +
                 '). Guardando en caché...');
    return _saveRequest(endpoint, formData, meta).then(function (id) {
        _updateOfflineBanner();
        _scheduleSync();
        return { success: true, cached: true, localId: id, originalError: err.message };
    });
});
        },

        /**
         * Fuerza una sincronización inmediata de todas las fotos pendientes.
         * Útil para llamarlo desde un botón "Reintentar".
         */
        forceSync: function () {
            _retryCount = 0;
            return _syncAll();
        },

        /**
         * Devuelve la cantidad de fotos pendientes de subir.
         * @returns {Promise<number>}
         */
        getPendingCount: function () {
            return _getPendingRecords().then(function (r) { return r.length; });
        },

        /**
         * Devuelve todos los registros de la cola (para debug o UI avanzada).
         * @returns {Promise<Array>}
         */
        getAll: function () {
            return _getAllRecords();
        },

        /**
         * Sube manualmente UNA foto cacheada por su id.
         */
        uploadOne: function (id) {
            return _openDB().then(function (db) {
                return new Promise(function (resolve, reject) {
                    var tx    = db.transaction(STORE_NAME, 'readonly');
                    var store = tx.objectStore(STORE_NAME);
                    var req   = store.get(id);
                    req.onsuccess = function (e) {
                        var record = e.target.result;
                        if (!record) { resolve({ ok: false, error: 'no encontrado' }); return; }
                        _syncOne(record).then(resolve, reject);
                    };
                    req.onerror = function (e) { reject(e.target.error); };
                });
            }).then(function (result) {
                _updateOfflineBanner();
                return result;
            });
        },

        /**
         * Descarta UNA foto cacheada por su id (sin subirla).
         */
        discardOne: function (id) {
            return _deleteRecord(id).then(function () {
                _updateOfflineBanner();
            });
        },

        /**
         * Descarta TODAS las fotos cacheadas pendientes.
         */
        discardAll: function () {
            return _getAllRecords().then(function (records) {
                return Promise.all(records.map(function (r) { return _deleteRecord(r.id); }));
            }).then(function () {
                _updateOfflineBanner();
            });
        },

        /**
         * Abre el modal de gestión de cola (Swal) con la lista de fotos pendientes
         * y botones para subir/descartar individualmente o en masa.
         */
        openQueueManager: function () {
            return _renderQueueManager();
        }
    };

    // -------------------------------------------------------------------------
    // UI del gestor de cola — SweetAlert2
    // -------------------------------------------------------------------------
    function _formatDate(ts) {
        try {
            return new Date(ts).toLocaleString();
        } catch (e) {
            return '';
        }
    }

    function _photoTypeLabel(t) {
        var map = {
            'activacion':   'Foto de Activación',
            'desactivacion':'Foto de Desactivación',
            'precios':      'Foto de Precios',
            'gestion':      'Foto de Gestión',
            'exhibiciones': 'Foto de Exhibición',
            'materialPOP':  'Material POP'
        };
        return map[t] || (t || 'Foto');
    }

    function _statusBadge(record) {
        if (record.status === 'uploading') return '<span class="badge bg-info text-white">Subiendo...</span>';
        if (record.status === 'error')     return '<span class="badge bg-danger">Error</span>';
        if (record.attempts > 0)           return '<span class="badge bg-warning text-dark">' + record.attempts + ' intento(s) fallido(s)</span>';
        return '<span class="badge bg-secondary">En cola</span>';
    }

    function _renderQueueManager() {
        if (!window.Swal) {
            alert('SweetAlert2 no está disponible. No se puede abrir el gestor.');
            return Promise.resolve();
        }

        return _getAllRecords().then(function (records) {
            if (!records || records.length === 0) {
                return Swal.fire({
                    icon: 'success',
                    title: 'No hay fotos pendientes',
                    text: 'Todas las fotos están sincronizadas.',
                    timer: 2200,
                    showConfirmButton: false
                });
            }

            // Orden: por fecha de creación descendente
            records.sort(function (a, b) { return b.createdAt - a.createdAt; });

            var listHtml = '<div style="text-align:left;max-height:55vh;overflow-y:auto">';
            records.forEach(function (r) {
                var label    = (r.meta && r.meta.label) || _photoTypeLabel(r.meta && r.meta.photoType);
                var pointTxt = (r.meta && r.meta.pointName) ? ('<small class="text-muted d-block">📍 ' + r.meta.pointName + '</small>') : '';
                var dateTxt  = _formatDate(r.createdAt);
                var badge    = _statusBadge(r);
                var errTxt   = r.error ? '<small class="text-danger d-block">' + r.error + '</small>' : '';

                listHtml += '' +
                    '<div class="border rounded p-2 mb-2 d-flex justify-content-between align-items-start gap-2">' +
                        '<div style="flex:1;min-width:0">' +
                            '<div class="fw-bold" style="font-size:.95rem">' + label + '</div>' +
                            pointTxt +
                            '<small class="text-muted">' + dateTxt + '</small> ' + badge +
                            errTxt +
                        '</div>' +
                        '<div class="d-flex flex-column gap-1" style="flex-shrink:0">' +
                            '<button class="btn btn-sm btn-success queue-upload-one" data-id="' + r.id + '" title="Subir esta foto">' +
                                '<i class="bi bi-cloud-arrow-up"></i>' +
                            '</button>' +
                            '<button class="btn btn-sm btn-outline-danger queue-discard-one" data-id="' + r.id + '" title="Descartar esta foto">' +
                                '<i class="bi bi-trash"></i>' +
                            '</button>' +
                        '</div>' +
                    '</div>';
            });
            listHtml += '</div>';

            var footerHtml = '<small class="text-muted">' +
                'Total: ' + records.length + ' foto(s) en cola. ' +
                (navigator.onLine ? 'Hay conexión disponible.' : 'Sin conexión.') +
                '</small>';

            return Swal.fire({
                title: '📤 Fotos pendientes',
                html: listHtml + footerHtml,
                width: '600px',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: '<i class="bi bi-cloud-arrow-up me-1"></i>Subir todas',
                denyButtonText: '<i class="bi bi-trash me-1"></i>Borrar todas',
                cancelButtonText: 'Cerrar',
                confirmButtonColor: '#198754',
                denyButtonColor:    '#dc3545',
                cancelButtonColor:  '#6c757d',
                didOpen: function () {
                    document.querySelectorAll('.queue-upload-one').forEach(function (btn) {
                        btn.addEventListener('click', function () {
                            var id = parseInt(btn.getAttribute('data-id'), 10);
                            btn.disabled = true;
                            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span>';
                            OfflineCache.uploadOne(id).then(function (res) {
                                if (res && res.ok) {
                                    _showSyncToast('✅ Foto subida correctamente.', 'success');
                                } else if (res && res.permanent) {
                                    _showSyncToast('La foto fue descartada (rechazo del servidor).', 'warning');
                                } else {
                                    _showSyncToast('No se pudo subir. Se reintentará luego.', 'error');
                                }
                                _renderQueueManager();
                            });
                        });
                    });
                    document.querySelectorAll('.queue-discard-one').forEach(function (btn) {
                        btn.addEventListener('click', function () {
                            var id = parseInt(btn.getAttribute('data-id'), 10);
                            Swal.fire({
                                title: '¿Descartar esta foto?',
                                text: 'No se podrá recuperar.',
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Sí, descartar',
                                cancelButtonText: 'Cancelar',
                                confirmButtonColor: '#dc3545'
                            }).then(function (r) {
                                if (r.isConfirmed) {
                                    OfflineCache.discardOne(id).then(function () {
                                        _renderQueueManager();
                                    });
                                }
                            });
                        });
                    });
                }
            }).then(function (result) {
                if (result.isConfirmed) {
                    // Subir todas
                    if (!navigator.onLine) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Sin conexión',
                            text: 'Conéctate a internet para subir las fotos.'
                        });
                        return;
                    }
                    Swal.fire({
                        title: 'Subiendo todas...',
                        allowOutsideClick: false,
                        didOpen: function () { Swal.showLoading(); }
                    });
                    return OfflineCache.forceSync().then(function () {
                        Swal.close();
                        _renderQueueManager();
                    });
                } else if (result.isDenied) {
                    // Borrar todas
                    Swal.fire({
                        title: '¿Borrar todas las fotos pendientes?',
                        text: 'Esta acción es irreversible.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, borrar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#dc3545'
                    }).then(function (r) {
                        if (r.isConfirmed) {
                            return OfflineCache.discardAll().then(function () {
                                _showSyncToast('Cola vaciada.', 'info');
                            });
                        }
                    });
                }
            });
        });
    }

    // -------------------------------------------------------------------------
    // Inicialización automática al cargar el script
    // -------------------------------------------------------------------------
    _openDB().then(function () {
        // Rescatar registros que quedaron pegados en "Subiendo..." porque la
        // app se cerró/recargó a mitad de una subida.
        return _resetStuckUploading();
    }).then(function () {
        _updateOfflineBanner();
        _scheduleSync();
        console.log('[OfflineCache] 🚀 Módulo listo. onLine=' + navigator.onLine);
    }).catch(function (err) {
        console.error('[OfflineCache] No se pudo inicializar IndexedDB:', err);
    });

    // Exportar al scope global
    window.OfflineCache = OfflineCache;

}(window));


// =============================================================================
// PUNTOS DE INTEGRACIÓN EN realizar-ruta-mercaderista.js
// =============================================================================
//
// ── 1. uploadActivationPhoto() ──────────────────────────────────────────────
//
//  ANTES (línea ~723):
//    fetch('/api/upload-activation-photo', { method: 'POST', body: formData, credentials: 'include' })
//    .then(res => { ... })
//    .catch(err => { Swal.fire('Error', ...) });
//
//  DESPUÉS:
//    OfflineCache.submitWithCache(
//        '/api/upload-activation-photo',
//        formData,
//        { photoType: 'activacion', pointId: currentPoint.id,
//          cedula: sessionStorage.getItem('merchandiser_cedula'), label: currentPoint.name }
//    ).then(function(result) {
//        Swal.close();
//        if (result.cached) {
//            // La foto se guardó localmente; el flujo de activación
//            // no puede continuar hasta que se sincronice.
//            Swal.fire({
//                icon: 'warning',
//                title: 'Sin conexión',
//                html: 'La foto de activación se guardó en tu dispositivo.<br>'
//                    + 'Se subirá automáticamente cuando tengas internet.',
//                confirmButtonText: 'Entendido'
//            });
//            return; // No continuar con showClientSelectionModal()
//        }
//        // Flujo normal con result.data
//        var data = result.data;
//        if (!data.success) { Swal.fire('Error', data.message, 'error'); return; }
//        currentActivationData = { id_foto: data.id_foto, ... };
//        $('#activacionModal').modal('hide');
//        setTimeout(() => showClientSelectionModal(), 1600);
//    });
//
//
// ── 2. uploadAllPhotos(type)  — fetch normal (línea ~1476) ──────────────────
//
//  ANTES:
//    const response = await fetch('/api/upload-multiple-additional-photos', {
//        method: 'POST', body: formData, credentials: 'include' });
//    const data = await response.json();
//
//  DESPUÉS:
//    const result = await OfflineCache.submitWithCache(
//        '/api/upload-multiple-additional-photos',
//        formData,
//        { photoType: type, pointId: currentPoint.id,
//          visitaId: currentVisitaId,
//          cedula: sessionStorage.getItem('merchandiser_cedula') }
//    );
//    if (result.cached) {
//        Swal.fire({
//            icon: 'warning', title: 'Guardado localmente',
//            text: 'Las fotos se guardarán cuando haya conexión.',
//            timer: 2500, showConfirmButton: false
//        });
//        photoPreview[type] = [];
//        renderPhotoPreview(type);
//        return;
//    }
//    const data = result.data;
//    // ... resto del flujo normal ...
//
//
// ── 3. uploadMaterialPOPPhotos() — fetch normal (línea ~3817) ───────────────
//
//  Mismo patrón que el punto 2, sustituyendo:
//    fetch('/api/upload-materialpop-photos', { ... })
//  por:
//    OfflineCache.submitWithCache('/api/upload-materialpop-photos', formData,
//        { photoType: 'materialPOP', pointId: currentPoint.id,
//          visitaId: currentVisitaId,
//          cedula: sessionStorage.getItem('merchandiser_cedula') })
//
//
// ── 4. Chunk upload en uploadAllPhotos() (línea ~1403) ──────────────────────
//
//  Reemplazar cada fetch del loop de chunks por:
//    return OfflineCache.submitWithCache('/api/upload-multiple-additional-photos', form,
//        { photoType: type, chunk: true })
//      .then(function(r) { return r.cached ? { total_successful: 0 } : r.data; })
//      .catch(function(e) { console.error('Error chunk:', e); return { total_successful: 0 }; });
//
//
// ── 5. Escuchar evento de sincronización (opcional) ─────────────────────────
//
//  window.addEventListener('offlinePhotoSynced', function(e) {
//      console.log('Foto sincronizada:', e.detail);
//      // p.ej. recargar puntos activos si la foto era de activación
//      if (e.detail.meta.photoType === 'activacion') {
//          loadActivePoints(true);
//      }
//  });
//
// ── 6. Botón manual "Sincronizar ahora" (opcional) ──────────────────────────
//
//  <button onclick="OfflineCache.forceSync()">
//      <i class="bi bi-cloud-upload"></i> Sincronizar fotos pendientes
//  </button>
// =============================================================================
