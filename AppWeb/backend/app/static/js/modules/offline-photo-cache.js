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
    function _showOfflineBanner(count) {
        var existing = document.getElementById('offlineCacheBanner');
        if (existing) {
            existing.querySelector('#offlineCacheCount').textContent = count;
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
            'background:#ff9800',
            'color:#fff',
            'font-weight:600',
            'padding:10px 16px',
            'display:flex',
            'align-items:center',
            'gap:10px',
            'box-shadow:0 -2px 8px rgba(0,0,0,.25)'
        ].join(';');
        banner.innerHTML = [
            '<i class="bi bi-wifi-off" style="font-size:1.2rem"></i>',
            '<span>Sin conexión — ',
            '<span id="offlineCacheCount">' + count + '</span>',
            ' foto(s) guardada(s) en el dispositivo.</span>',
            '<span style="margin-left:auto;font-size:.85rem;opacity:.85">',
            'Se subirán automáticamente cuando haya internet.',
            '</span>'
        ].join('');
        document.body.appendChild(banner);
    }

    function _hideOfflineBanner() {
        var banner = document.getElementById('offlineCacheBanner');
        if (banner) banner.remove();
    }

    function _updateOfflineBanner() {
        OfflineCache.getPendingCount().then(function (count) {
            if (count > 0) {
                _showOfflineBanner(count);
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
                // Serializar el FormData en un objeto plano con ArrayBuffers
                // para que IndexedDB lo pueda almacenar.
                var serializing = [];
                var entries = {};

                formData.forEach(function (value, key) {
                    if (value instanceof File || value instanceof Blob) {
                        var p = new Promise(function (res, rej) {
                            var reader = new FileReader();
                            reader.onload  = function (ev) {
                                res({ key: key, buffer: ev.target.result, name: value.name || key, type: value.type });
                            };
                            reader.onerror = rej;
                            reader.readAsArrayBuffer(value);
                        });
                        serializing.push(p);
                    } else {
                        if (!entries[key]) entries[key] = [];
                        entries[key].push({ key: key, value: value });
                    }
                });

                Promise.all(serializing).then(function (fileEntries) {
                    var record = {
                        endpoint:  endpoint,
                        entries:   entries,         // campos texto/número
                        files:     fileEntries,     // campos de archivo (ArrayBuffer)
                        meta:      meta || {},
                        status:    'pending',        // 'pending' | 'uploading' | 'done' | 'error'
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
                }).catch(reject);
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

        // Campos de archivo
        record.files.forEach(function (f) {
            var blob = new Blob([f.buffer], { type: f.type });
            var file = new File([blob], f.name, { type: f.type });
            fd.append(f.key, file, f.name);
        });

        return fd;
    }

    // -------------------------------------------------------------------------
    // Sincronización
    // -------------------------------------------------------------------------
    function _syncOne(record) {
        var fd = _rebuildFormData(record);

        return _updateRecord(record.id, { status: 'uploading', lastTryAt: Date.now() })
            .then(function () {
                return fetch(record.endpoint, {
                    method: 'POST',
                    body:   fd,
                    credentials: 'include'
                });
            })
            .then(function (res) {
                if (!res.ok) {
                    throw new Error('HTTP ' + res.status);
                }
                return res.json();
            })
            .then(function (data) {
                if (data && data.success === false) {
                    throw new Error(data.message || 'Servidor rechazó la solicitud');
                }
                // Éxito: eliminar de la cola
                return _deleteRecord(record.id).then(function () {
                    console.log('[OfflineCache] ✅ Foto sincronizada id=' + record.id);
                    return { ok: true, data: data, meta: record.meta };
                });
            })
            .catch(function (err) {
                console.warn('[OfflineCache] ⚠️ Fallo al sincronizar id=' + record.id + ':', err.message);
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
        if (_syncing || !navigator.onLine) return Promise.resolve();
        _syncing = true;

        return _getPendingRecords().then(function (records) {
            if (records.length === 0) {
                _syncing = false;
                _updateOfflineBanner();
                return;
            }

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

            if (!navigator.onLine) {
                // Sin conexión — guardar directamente
                return _saveRequest(endpoint, formData, meta).then(function (id) {
                    console.log('[OfflineCache] 📦 Sin conexión. Foto guardada localmente id=' + id);
                    _updateOfflineBanner();
                    return { success: true, cached: true, localId: id };
                });
            }

            // Con conexión — intentar subir
            return fetch(endpoint, {
                method: 'POST',
                body:   formData,
                credentials: 'include'
            })
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (data) {
                if (data && data.success === false) {
                    throw new Error(data.message || 'Servidor rechazó la solicitud');
                }
                console.log('[OfflineCache] ✅ Foto subida directamente al servidor.');
                return { success: true, cached: false, data: data };
            })
            .catch(function (err) {
                // Fallo con conexión (timeout, error 5xx, etc.) — guardar en caché
                console.warn('[OfflineCache] ⚠️ Fallo al subir (' + err.message + '). Guardando en caché...');
                return _saveRequest(endpoint, formData, meta).then(function (id) {
                    _updateOfflineBanner();
                    _scheduleSync(); // intentar de nuevo pronto
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
        }
    };

    // -------------------------------------------------------------------------
    // Inicialización automática al cargar el script
    // -------------------------------------------------------------------------
    _openDB().then(function () {
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
