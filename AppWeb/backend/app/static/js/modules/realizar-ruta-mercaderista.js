//js/modules/realizar-ruta-mercaderista.js
// Variables globales
let currentRoute = null;
let currentPoint = null;
let selectedPhotoFile = null;
let currentPhotoType = null;
let stream = null;
let currentCamera = 'environment';
let isCameraReady = false;
let currentClientVisit = null;
let currentVisitaId = null;
let photoTypeCameraStream = null;
let photoTypeCurrentCamera = 'environment';
let currentRouteType = 'fija'; // 'fija' o 'variable'
let currentActivationData = null;  // Para guardar datos de la activación
let currentMeta = {}; // global dentro del módulo
let photoPreview = {
    precios: [],
    gestion: { antes: [], despues: [] },
    exhibiciones: { antes: [], despues: [] },
    materialPOP: { antes: [], despues: [] }
};
let currentPhotoGallery = [];
let gestionMode = 'despues'; // 'antes', 'despues', 'mixto'
let gestionStep = 'despues'; // Para modo mixto
let photoTypeBeforeAfter = 'despues'; // Tipo actual seleccionado (antes/despues)
let materialPOPMode = 'despues'; // 'antes', 'despues', 'mixto'
let materialPOPStep = 'despues'; // Para modo mixto
let photoTypeMaterialPOPBeforeAfter = 'despues'; // Tipo actual seleccionado
var _lastGPS = null;
var _lastGPSTime = 0;
var GPS_CACHE_TTL = 30000; // 30 segundos

var _activePointsCache = null;
var _activePointsCacheTime = 0;

var _renderPreviewTimer = {};
// Variables para el modal guiado de DESPUÉS
var _guidedCurrentAntesIndex = null;
var _guidedCurrentType       = 'gestion';
var _guidedCurrentInputMode  = 'camara';


// ─────────────────────────────────────────────────────────────
// HELPERS IndexedDB
// ─────────────────────────────────────────────────────────────
function getSessionKey() {
    var cedula = sessionStorage.getItem('merchandiser_cedula') || 'anon';
    var vid = currentVisitaId || 'novisita';
    return cedula + '_' + vid;
}

async function persistPhotoToDB(type, subtype, blob, meta) {
    if (typeof PhotoPreviewStore === 'undefined') return null;
    try {
        return await PhotoPreviewStore.savePhoto(getSessionKey(), type, subtype || 'default', blob, meta);
    } catch (e) {
        console.warn('[IDB] No se pudo guardar foto:', e);
        return null;
    }
}

async function deletePhotoFromDB(idbId) {
    if (typeof PhotoPreviewStore === 'undefined' || idbId == null) return;
    try { await PhotoPreviewStore.deletePhoto(idbId); } catch (e) {}
}

async function clearTypeFromDB(type, subtype) {
    if (typeof PhotoPreviewStore === 'undefined') return;
    try {
        await PhotoPreviewStore.clearByTypeAndSubtype(getSessionKey(), type, subtype || 'default');
    } catch (e) {}
}

async function restorePreviewsFromDB() {
    if (typeof PhotoPreviewStore === 'undefined') return 0;
    var entries;
    try { entries = await PhotoPreviewStore.getAllForSession(getSessionKey()); }
    catch (e) { return 0; }
    if (!entries || entries.length === 0) return 0;
    console.log('[IDB] Restaurando', entries.length, 'fotos...');
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var url = URL.createObjectURL(entry.blob);
        var photoObj = {
            _idbId: entry.id,
            file: new File([entry.blob], entry.filename || ('foto_' + entry.id + '.jpg'), { type: 'image/jpeg', lastModified: Date.now() }),
            url: url,
            type: entry.type,
            subtype: entry.subtype,
            timestamp: entry.timestamp,
            deviceGPS: entry.deviceGPS,
            source: entry.source || 'restored'
        };
        var t = entry.type, s = entry.subtype;
        if (t === 'gestion' || t === 'materialPOP' || t === 'exhibiciones') {
            if (!photoPreview[t]) photoPreview[t] = { antes: [], despues: [] };
            if (s === 'antes') photoPreview[t].antes.push(photoObj);
            else photoPreview[t].despues.push(photoObj);
        } else {
            if (!Array.isArray(photoPreview[t])) photoPreview[t] = [];
            photoPreview[t].push(photoObj);
        }
    }
    return entries.length;
}

// ─────────────────────────────────────────────────────────────
// MÓDULO MULTICÁMARA
// ─────────────────────────────────────────────────────────────
var MultiCamera = (function () {
    var _stream = null;
    var _facingMode = 'environment';
    var _onPhotos = null;
    var _modal = null;
    var _videoEl = null;
    var _canvasEl = null;
    var _pendingPhotos = [];
    var _deviceGPS = null;

    function _buildModal() {
        if (document.getElementById('multiCameraModal')) return;
        var html = [
            '<div class="modal fade" id="multiCameraModal" tabindex="-1" aria-hidden="true">',
            '  <div class="modal-dialog modal-fullscreen">',
            '    <div class="modal-content bg-black">',
            '      <div class="modal-body p-0 d-flex flex-column" style="height:100vh;">',
            '        <div class="flex-grow-1 position-relative overflow-hidden">',
            '          <video id="mcVideo" autoplay playsinline style="width:100%;height:100%;object-fit:cover;"></video>',
            '          <div id="mcCounter" style="position:absolute;top:12px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.6);color:#fff;padding:4px 16px;border-radius:20px;font-size:14px;font-weight:600;">0 fotos tomadas</div>',
            '          <div id="mcThumbs" style="position:absolute;bottom:110px;left:0;right:0;display:flex;gap:6px;padding:0 10px;overflow-x:auto;-webkit-overflow-scrolling:touch;"></div>',
            '        </div>',
            '        <div style="background:#111;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:12px;">',
            '          <button id="mcBtnCancel" class="btn btn-outline-light btn-sm" style="min-width:80px;"><i class="bi bi-x-circle me-1"></i>Cancelar</button>',
            '          <button id="mcBtnCapture" style="width:72px;height:72px;border-radius:50%;border:4px solid #fff;background:rgba(255,255,255,.2);cursor:pointer;display:flex;align-items:center;justify-content:center;">',
            '            <i class="bi bi-camera-fill text-white" style="font-size:28px;"></i>',
            '          </button>',
            '          <div class="d-flex flex-column gap-2" style="min-width:80px;">',
            '            <button id="mcBtnFlip" class="btn btn-outline-light btn-sm"><i class="bi bi-arrow-repeat me-1"></i>Voltear</button>',
            '            <button id="mcBtnDone" class="btn btn-success btn-sm" disabled><i class="bi bi-check-circle me-1"></i>Listo</button>',
            '          </div>',
            '        </div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ].join('');
        document.body.insertAdjacentHTML('beforeend', html);
        _modal = new bootstrap.Modal(document.getElementById('multiCameraModal'), { backdrop: 'static', keyboard: false });
        _videoEl = document.getElementById('mcVideo');
        _canvasEl = document.createElement('canvas');
        document.getElementById('mcBtnCapture').addEventListener('click', _captureFrame);
        document.getElementById('mcBtnFlip').addEventListener('click', _flipCamera);
        document.getElementById('mcBtnDone').addEventListener('click', _done);
        document.getElementById('mcBtnCancel').addEventListener('click', _cancel);
        document.getElementById('multiCameraModal').addEventListener('hidden.bs.modal', function () { _stopStream(); });
    }

    function _stopStream() {
        if (_stream) { _stream.getTracks().forEach(function (t) { t.stop(); }); _stream = null; }
        if (_videoEl) _videoEl.srcObject = null;
    }

    function _startStream() {
        _stopStream();
        navigator.mediaDevices.getUserMedia({
            video: { facingMode: _facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
            audio: false
        }).then(function (s) {
            _stream = s;
            _videoEl.srcObject = s;
            _videoEl.play();
        }).catch(function (err) {
            console.error('[MultiCamera]', err);
            Swal.fire({ icon: 'error', title: 'Sin acceso a cámara', text: 'Verifica los permisos de cámara.', confirmButtonText: 'Entendido' });
        });
    }

    function _captureFrame() {
        if (!_stream) return;
        _canvasEl.width = _videoEl.videoWidth;
        _canvasEl.height = _videoEl.videoHeight;
        _canvasEl.getContext('2d').drawImage(_videoEl, 0, 0);
        _canvasEl.toBlob(function (blob) {
            if (!blob) return;
            var url = URL.createObjectURL(blob);
            _pendingPhotos.push({ blob: blob, url: url, timestamp: new Date().toISOString(), deviceGPS: _deviceGPS });
            _updateUI();
            var flash = document.createElement('div');
            flash.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:.55;z-index:9999;pointer-events:none;';
            document.body.appendChild(flash);
            setTimeout(function () { if (flash.parentNode) flash.parentNode.removeChild(flash); }, 120);
        }, 'image/jpeg', 0.82);
    }

    function _flipCamera() {
        _facingMode = _facingMode === 'environment' ? 'user' : 'environment';
        _startStream();
    }

    function _updateUI() {
        var n = _pendingPhotos.length;
        document.getElementById('mcCounter').textContent = n + (n === 1 ? ' foto tomada' : ' fotos tomadas');
        document.getElementById('mcBtnDone').disabled = n === 0;
        var container = document.getElementById('mcThumbs');
        container.innerHTML = '';
        _pendingPhotos.forEach(function (p, i) {
            var img = document.createElement('img');
            img.src = p.url;
            img.style.cssText = 'height:64px;width:64px;object-fit:cover;border-radius:6px;border:2px solid #4ecdc4;flex-shrink:0;cursor:pointer;';
            img.title = 'Toca para eliminar';
            (function(idx, photoRef) {
                img.addEventListener('click', function () {
                    URL.revokeObjectURL(photoRef.url);
                    _pendingPhotos.splice(idx, 1);
                    _updateUI();
                });
            })(i, p);
            container.appendChild(img);
        });
    }

    function _done() {
        if (_pendingPhotos.length === 0) { _cancel(); return; }
        var photos = _pendingPhotos.slice();
        _pendingPhotos = [];
        _modal.hide();
        if (typeof _onPhotos === 'function') _onPhotos(photos);
    }

    function _cancel() {
        _pendingPhotos.forEach(function (p) { URL.revokeObjectURL(p.url); });
        _pendingPhotos = [];
        _modal.hide();
    }

    function open(onPhotos, gpsData) {
        _buildModal();
        _pendingPhotos = [];
        _onPhotos = onPhotos;
        _deviceGPS = gpsData || null;
        _updateUI();
        _modal.show();
        _startStream();
    }

    return { open: open };
})();


// ============================================================================
// 🚀 COMPRESIÓN DE IMÁGENES — Reduce 3-8MB → 150-400KB por foto
// ============================================================================
var COMPRESS_MAX_WIDTH = 1600;
var COMPRESS_MAX_HEIGHT = 1600;
var COMPRESS_QUALITY = 0.70;

function compressImage(file) {
    return new Promise(function(resolve) {
        // Si ya es pequeña (< 500KB), no comprimir
        if (file.size < 500 * 1024) {
            resolve(file);
            return;
        }

        var img = new Image();
        var url = URL.createObjectURL(file);

        img.onload = function() {
            URL.revokeObjectURL(url);

            var w = img.width;
            var h = img.height;

            // Calcular nuevo tamaño manteniendo aspecto
            if (w > COMPRESS_MAX_WIDTH || h > COMPRESS_MAX_HEIGHT) {
                var ratio = Math.min(COMPRESS_MAX_WIDTH / w, COMPRESS_MAX_HEIGHT / h);
                w = Math.round(w * ratio);
                h = Math.round(h * ratio);
            }

            var canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);

            canvas.toBlob(function(blob) {
                if (blob && blob.size < file.size) {
                    var compressed = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    });
                    console.log('🗜️ Comprimido: ' + (file.size/1024).toFixed(0) + 'KB → ' + (compressed.size/1024).toFixed(0) + 'KB');
                    resolve(compressed);
                } else {
                    resolve(file); // Si la compresión no ayudó, usar original
                }
            }, 'image/jpeg', COMPRESS_QUALITY);
        };

        img.onerror = function() {
            URL.revokeObjectURL(url);
            resolve(file); // Si falla, usar original
        };

        img.src = url;
    });
}

// Comprimir array de fotos en paralelo (máx 4 simultáneas)
async function compressBatch(files) {
    var results = [];
    var PARALLEL = 4;
    for (var i = 0; i < files.length; i += PARALLEL) {
        var batch = files.slice(i, i + PARALLEL).map(function(f) {
            return compressImage(f);
        });
        var compressed = await Promise.all(batch);
        results = results.concat(compressed);
    }
    return results;
}

// Función para debug: mostrar datos de sesión
function debugSessionData() {
    console.log("=== DEBUG SESSION STORAGE ===");
    console.log("merchandiser_cedula:", sessionStorage.getItem('merchandiser_cedula'));
    console.log("merchandiser_name:", sessionStorage.getItem('merchandiser_name'));
    console.log("currentActivationData:", currentActivationData);
    console.log("currentClientVisit:", currentClientVisit);
    console.log("currentRoute:", currentRoute);
    console.log("currentPoint:", currentPoint);
    console.log("=== FIN DEBUG ===");
}

// Inicialización
$(document).ready(function() {
    // Configurar jQuery para enviar cookies en todas las peticiones
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    });

    // Verificar sesión del mercaderista
    if (!checkMercaderistaSession()) {
        return;
    }
    
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name');
    
    $('#merchandiserName').text(nombre);
    
    // Obtener el tipo de ruta de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const tipo = urlParams.get('tipo') || 'fija';
    
    // Cargar rutas según el tipo
    loadRoutes(tipo);
    
    // Configurar eventos del modal de activación
    setupActivationModal();


    // Botones de Material POP
$('#btnMaterialPOPAntes').click(function() {
    setMaterialPOPType('antes');
});

$('#btnMaterialPOPDespues').click(function() {
    setMaterialPOPType('despues');
});

$('#btnMaterialPOPMixto').click(function() {
    setMaterialPOPType('mixto');
});

// Material POP ANTES — cámara
    $('#btnMaterialPOPAntes_camara').click(async function() {
        currentPhotoType = 'materialPOP';
        photoTypeMaterialPOPBeforeAfter = 'antes';
        var gps = await captureMetadata();
        MultiCamera.open(async function(photos) {
            if (!photoPreview['materialPOP']) photoPreview['materialPOP'] = { antes: [], despues: [] };
            for (var i = 0; i < photos.length; i++) {
                var p = photos[i];
                var fname = 'materialpop_antes_' + Date.now() + '_' + i + '.jpg';
                var idbId = await persistPhotoToDB('materialPOP', 'antes', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
                photoPreview['materialPOP']['antes'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'materialPOP', subtype: 'antes', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
            }
            renderMaterialPOPPreview();
        }, gps);
    });

    // Material POP ANTES — galería
    $('#btnMaterialPOPAntes_gallery').click(function() {
        currentPhotoType = 'materialPOP';
        photoTypeMaterialPOPBeforeAfter = 'antes';
        $('#galleryInputMaterialPOP').click();
    });

    // Material POP DESPUÉS — cámara
    // Material POP DESPUÉS — cámara
    $('#btnMaterialPOPDespues_camara').click(function() {
        if (getMaterialPOPPhotos('antes').length > 0) {
            abrirModalGuiado('materialPOP', 'camara');
        } else {
            currentPhotoType              = 'materialPOP';
            photoTypeMaterialPOPBeforeAfter = 'despues';
            captureMetadata().then(function(gps) {
                MultiCamera.open(async function(photos) {
                    if (!photoPreview['materialPOP']) photoPreview['materialPOP'] = { antes: [], despues: [] };
                    for (var i = 0; i < photos.length; i++) {
                        var p = photos[i];
                        var fname = 'materialpop_despues_' + Date.now() + '_' + i + '.jpg';
                        var idbId = await persistPhotoToDB('materialPOP', 'despues', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
                        photoPreview['materialPOP']['despues'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'materialPOP', subtype: 'despues', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
                    }
                    renderMaterialPOPPreview();
                }, gps);
            });
        }
    });

    // Material POP DESPUÉS — galería
    $('#btnMaterialPOPDespues_gallery').click(function() {
        if (getMaterialPOPPhotos('antes').length > 0) {
            abrirModalGuiado('materialPOP', 'galeria');
        } else {
            currentPhotoType              = 'materialPOP';
            photoTypeMaterialPOPBeforeAfter = 'despues';
            $('#galleryInputMaterialPOP').click();
        }
    }); 

// $('#btnMaterialPOP_gallery').click(function() {
//     currentPhotoType = 'materialPOP';
//     photoTypeMaterialPOPBeforeAfter = materialPOPMode === 'mixto' ? materialPOPStep : materialPOPMode;
//     $('#galleryInputMaterialPOP').click();
// });
    
    // Botones de Precios
    $('#btnPrecios_camara').click(async function () {
    currentPhotoType = 'precios';
    var gps = await captureMetadata();
    MultiCamera.open(async function(photos) {
        if (!photoPreview['precios']) photoPreview['precios'] = [];
        for (var i = 0; i < photos.length; i++) {
            var p = photos[i];
            var fname = 'precios_' + Date.now() + '_' + i + '.jpg';
            var idbId = await persistPhotoToDB('precios', 'default', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
            photoPreview['precios'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'precios', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
        }
        renderPhotoPreview('precios');
    }, gps);
});

    $('#btnPrecios_gallery').click(function () {
        currentPhotoType = 'precios';
        $('#galleryInputPrecios').click();
    });
        
    // Configurar nuevos botones de tipo de foto para gestión
    $('#btnGestionAntes').click(function() {
        setGestionType('antes');
    });
    
    $('#btnGestionDespues').click(function() {
        setGestionType('despues');
    });
    
    $('#btnGestionMixto').click(function() {
        setGestionType('mixto');
    });

    // Mantener los botones originales de cámara y galería
    
    // Gestión ANTES — cámara
    $('#btnGestionAntes_camara').click(async function() {
        currentPhotoType = 'gestion';
        photoTypeBeforeAfter = 'antes';
        var gps = await captureMetadata();
        MultiCamera.open(async function(photos) {
            if (!photoPreview['gestion']) photoPreview['gestion'] = { antes: [], despues: [] };
            for (var i = 0; i < photos.length; i++) {
                var p = photos[i];
                var fname = 'gestion_antes_' + Date.now() + '_' + i + '.jpg';
                var idbId = await persistPhotoToDB('gestion', 'antes', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
                photoPreview['gestion']['antes'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'gestion', gestionType: 'antes', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
            }
            renderGestionPreview();
        }, gps);
    });

    // Gestión ANTES — galería
    $('#btnGestionAntes_gallery').click(function() {
        currentPhotoType = 'gestion';
        photoTypeBeforeAfter = 'antes';
        $('#galleryInputGestion').click();
    });

    // Gestión DESPUÉS — cámara
    // Gestión DESPUÉS — cámara
    $('#btnGestionDespues_camara').click(function() {
        if (getGestionPhotos('antes').length > 0) {
            abrirModalGuiado('gestion', 'camara');
        } else {
            currentPhotoType     = 'gestion';
            photoTypeBeforeAfter = 'despues';
            captureMetadata().then(function(gps) {
                MultiCamera.open(async function(photos) {
                    if (!photoPreview['gestion']) photoPreview['gestion'] = { antes: [], despues: [] };
                    for (var i = 0; i < photos.length; i++) {
                        var p = photos[i];
                        var fname = 'gestion_despues_' + Date.now() + '_' + i + '.jpg';
                        var idbId = await persistPhotoToDB('gestion', 'despues', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
                        photoPreview['gestion']['despues'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'gestion', gestionType: 'despues', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
                    }
                    renderGestionPreview();
                }, gps);
            });
        }
    });

    // Gestión DESPUÉS — galería
    // Gestión DESPUÉS — galería
    $('#btnGestionDespues_gallery').click(function() {
        if (getGestionPhotos('antes').length > 0) {
            abrirModalGuiado('gestion', 'galeria');
        } else {
            currentPhotoType     = 'gestion';
            photoTypeBeforeAfter = 'despues';
            $('#galleryInputGestion').click();
        }
    });
        
    // Botones de Exhibiciones
    // Exhibiciones ANTES — cámara
    $('#btnExhibicionesAntes_camara').click(async function () {
        currentPhotoType = 'exhibiciones';
        photoTypeBeforeAfter = 'antes';
        var gps = await captureMetadata();
        MultiCamera.open(async function(photos) {
            if (!photoPreview['exhibiciones']) photoPreview['exhibiciones'] = { antes: [], despues: [] };
            for (var i = 0; i < photos.length; i++) {
                var p = photos[i];
                var fname = 'exhibiciones_antes_' + Date.now() + '_' + i + '.jpg';
                var idbId = await persistPhotoToDB('exhibiciones', 'antes', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
                photoPreview['exhibiciones']['antes'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'exhibiciones', subtype: 'antes', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
            }
            renderExhibicionesPreview();
        }, gps);
    });

    // Exhibiciones ANTES — galería
    $('#btnExhibicionesAntes_gallery').click(function () {
        currentPhotoType = 'exhibiciones';
        photoTypeBeforeAfter = 'antes';
        $('#galleryInputExhibiciones').click();
    });

    // Exhibiciones DESPUÉS — cámara
    // Exhibiciones DESPUÉS — cámara
    $('#btnExhibicionesDespues_camara').click(function() {
        if (getExhibicionesPhotos('antes').length > 0) {
            abrirModalGuiado('exhibiciones', 'camara');
        } else {
            currentPhotoType     = 'exhibiciones';
            photoTypeBeforeAfter = 'despues';
            captureMetadata().then(function(gps) {
                MultiCamera.open(async function(photos) {
                    if (!photoPreview['exhibiciones']) photoPreview['exhibiciones'] = { antes: [], despues: [] };
                    for (var i = 0; i < photos.length; i++) {
                        var p = photos[i];
                        var fname = 'exhibiciones_despues_' + Date.now() + '_' + i + '.jpg';
                        var idbId = await persistPhotoToDB('exhibiciones', 'despues', p.blob, { deviceGPS: p.deviceGPS, source: 'camera', timestamp: p.timestamp, filename: fname });
                        photoPreview['exhibiciones']['despues'].push({ _idbId: idbId, file: new File([p.blob], fname, { type: 'image/jpeg', lastModified: Date.now() }), url: p.url, type: 'exhibiciones', subtype: 'despues', timestamp: p.timestamp, deviceGPS: p.deviceGPS, source: 'camera' });
                    }
                    renderExhibicionesPreview();
                }, gps);
            });
        }
    });

    // Exhibiciones DESPUÉS — galería
    // Exhibiciones DESPUÉS — galería
    $('#btnExhibicionesDespues_gallery').click(function() {
        if (getExhibicionesPhotos('antes').length > 0) {
            abrirModalGuiado('exhibiciones', 'galeria');
        } else {
            currentPhotoType     = 'exhibiciones';
            photoTypeBeforeAfter = 'despues';
            $('#galleryInputExhibiciones').click();
        }
    });

    // $('#btnExhibiciones_gallery').click(function () {
    //     currentPhotoType = 'exhibiciones';
    //     $('#galleryInputExhibiciones').click(); // Abre galería sin cámara
    // });

    // Agregar evento para el botón de actualizar puntos activos
    $('#refreshActivePointsBtn').click(function() {
        loadActivePoints();
    });
    
    $('#additionalPhotosModal').on('hidden.bs.modal', function() {
        // NO limpiar previews al cerrar — se preservan hasta subida exitosa o cancelación explícita
        loadActivePoints();
    });
    
    // Configurar el evento para cuando se cierra el modal de cámara
    $('#photoTypeModal').on('hidden.bs.modal', function() {
        stopPhotoTypeCamera();
        resetPhotoTypeCamera();
    });
    
    // Agregar evento para refrescar el estado al hacer focus en la ventana
    $(window).on('focus', function() {
        loadFixedRoutes(cedula);
        loadActivePoints();
    });

    // Restaurar fotos previsualzadas si se recargó la página durante una sesión activa
    var savedVisitaId = sessionStorage.getItem('currentVisitaId') || localStorage.getItem('currentVisitaId');
    var savedClientName = sessionStorage.getItem('currentClientName') || localStorage.getItem('currentClientName');
    if (savedVisitaId && savedClientName) {
        currentVisitaId = savedVisitaId;
        // Restaurar sessionStorage por si vino de localStorage
        sessionStorage.setItem('currentVisitaId', savedVisitaId);
        sessionStorage.setItem('currentClientName', savedClientName);
        // ✅ Restaurar contexto de punto para que createVisitForActivePoint detecte visita existente
        var savedPointId = localStorage.getItem('currentPointId');
        var savedClientId = localStorage.getItem('currentClientId');
        if (savedPointId) {
            currentPoint = currentPoint || { id: savedPointId, name: '' };
        }
        restorePreviewsFromDB().then(function(n) {
            if (n > 0) {
                Swal.fire({
                    icon: 'info',
                    title: '¡Fotos recuperadas!',
                    html: '<p>Se encontraron <strong>' + n + '</strong> fotos del cliente <strong>' + savedClientName + '</strong> que no fueron subidas todavía.</p><p class="text-muted">Puedes seguir agregando o subirlas ahora.</p>',
                    confirmButtonText: 'Ver mis fotos'
                }).then(function() {
                    currentClientVisit = { client_name: savedClientName };
                    $('#additionalPhotosTitle').html('<i class="bi bi-images me-2"></i>Fotos Adicionales - ' + savedClientName);
                    if (photoPreview['precios'] && photoPreview['precios'].length > 0) renderPhotoPreview('precios');
                    if (photoPreview['exhibiciones'] && photoPreview['exhibiciones'].length > 0) renderPhotoPreview('exhibiciones');
                    if (photoPreview['gestion'] && (photoPreview['gestion'].antes.length > 0 || photoPreview['gestion'].despues.length > 0)) renderGestionPreview();
                    if (photoPreview['materialPOP'] && (photoPreview['materialPOP'].antes.length > 0 || photoPreview['materialPOP'].despues.length > 0)) renderMaterialPOPPreview();
                    $('#additionalPhotosModal').modal('show');
                });
            }
        });
    }
});

// Configurar jQuery para enviar cookies en todas las peticiones AJAX
$.ajaxSetup({
    xhrFields: {
        withCredentials: true
    },
    crossDomain: true
});

// Configurar eventos del modal de activación
function setupActivationModal() {
    // Configurar botón de subir foto
    document.getElementById('confirmUploadBtn')?.addEventListener('click', function() {
        uploadActivationPhoto();
    });
    
    // Configurar botón de cambiar cámara
    document.getElementById('btnSwitchCamera')?.addEventListener('click', function() {
        switchCamera();
    });
    
    // Detener la cámara cuando se cierra el modal
    $('#activacionModal').on('hidden.bs.modal', function() {
        stopCamera();
        resetActivationModal();
    });
    
    // Configurar botón de tomar foto
    document.getElementById('btnTakePhoto')?.addEventListener('click', function() {
        takeCameraPhoto();
    });
}


// Cargar rutas fijas
function loadFixedRoutes(cedula) {
    $.getJSON(`/api/merchandiser-fixed-routes/${cedula}`)
    .done(routes => {
        renderRoutesCards(routes);
        // También recargar puntos activos para mantener el estado consistente
        loadActivePoints();
    })
    .fail(() => {
        $('#rutasContainer').html(`
        <div class="alert alert-danger text-center">
            <i class="bi bi-exclamation-triangle"></i> Error al cargar las rutas asignadas
        </div>
        `);
    });
}

function renderRoutesCards(routes, tipo = 'fija') {
    if (!routes || routes.length === 0) {
        $('#rutasContainer').html(`
        <div class="alert alert-info text-center">
            <i class="bi bi-signpost fs-1"></i>
            <p class="mt-3 mb-0">No tienes rutas ${tipo === 'fija' ? 'fijas' : 'variables'} asignadas</p>
        </div>
        `);
        return;
    }

    let html = '<div class="row">';
    routes.forEach(route => {
        // Determinar qué botones mostrar según el estado de la ruta
        const mostrarBotonActivar = !route.esta_activa;
        const mostrarBotonVer = route.esta_activa;
        const mostrarBotonDesactivar = route.esta_activa;

        // Determinar colores según el tipo
        const headerColor = tipo === 'fija' ? 'bg-primary' : 'bg-success';
        const buttonColor = tipo === 'fija' ? 'btn-primary' : 'btn-success';
        const buttonText = tipo === 'fija' ? 'Ejecutar' : 'Iniciar PDV Nuevo';
        const desactivarText = tipo === 'fija' ? 'Ejecutado' : 'Finalizar PDV';
        const typeBadge = tipo === 'fija' ? 'Ruta Fija' : 'Ruta Variable';

        html += `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card route-card h-100">
                <div class="card-header route-header text-white ${headerColor}">
                    <h6 class="mb-0"><i class="bi bi-signpost me-2"></i>${route.nombre}</h6>
                    <small class="badge bg-light text-dark mt-1">${typeBadge}</small>
                </div>
                <div class="card-body">
                    <p class="mb-2"><strong>ID Ruta:</strong> ${route.id}</p>
                    <p class="mb-2"><strong>Puntos:</strong> ${route.total_puntos || 'N/A'}</p>
                    <p class="mb-2"><strong>Estado:</strong> 
                        <span class="badge ${route.esta_activa ? 'bg-success' : 'bg-secondary'}">
                            ${route.esta_activa ? 'En Progreso' : 'Inactiva'}
                        </span>
                    </p>
                    <div class="d-grid gap-2">
                        <!-- Botón Activar Ruta (visible por defecto) -->
                        <button id="btn-activar-${route.id}" class="btn ${buttonColor} btn-sm ${mostrarBotonActivar ? '' : 'd-none'}" onclick="activarRuta(${route.id}, '${route.nombre.replace(/'/g, "\\'")}', '${tipo}')">
                            <i class="bi bi-power me-2"></i>${buttonText}
                        </button>
                        
                        <!-- Botón Ver Puntos (oculto por defecto) -->
                        <button id="btn-ver-${route.id}" class="btn btn-outline-primary btn-sm ${mostrarBotonVer ? '' : 'd-none'}" onclick="verPuntosRuta(${route.id}, '${route.nombre.replace(/'/g, "\\'")}', '${tipo}')">
                            <i class="bi bi-pin-map me-2"></i>Ver Puntos
                        </button>
                        
                        <!-- Botón Desactivar Ruta (oculto por defecto) -->
                        <button id="btn-desactivar-${route.id}" class="btn btn-danger btn-sm ${mostrarBotonDesactivar ? '' : 'd-none'}" onclick="desactivarRuta(${route.id}, '${tipo}')">
                            <i class="bi bi-stop-circle me-2"></i>${desactivarText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });
    html += '</div>';
    $('#rutasContainer').html(html);
}

// Ver puntos de una ruta
function verPuntosRuta(routeId, routeName, tipo) {
    currentRoute = { id: routeId, name: routeName };
    currentRouteType = tipo; // Guardar el tipo actual
    $('#modalRutaNombre').text(routeName);
    $('#puntosModal').modal('show');
    loadRoutePoints(routeId);
}

// Cargar puntos de la ruta
function loadRoutePoints(routeId) {
    $('#puntosContainer').html(`
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando puntos...</p>
        </div>
    `);

    const cedula = sessionStorage.getItem('merchandiser_cedula');

    fetch(`/api/route-points1/${routeId}?cedula=${cedula}`, {
        method: 'GET',
        headers: {
            'Cache-Control': 'no-cache'
        },
        credentials: 'include'
    })
    .then(res => res.json())
    .then(renderRoutePoints)
    .catch(() => {
        $('#puntosContainer').html(`
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle"></i> Error al cargar los puntos
            </div>
        `);
    });
}

// Renderizar puntos
function renderRoutePoints(points) {
    if (!points || points.length === 0) {
        $('#puntosContainer').html(`
            <div class="alert alert-info text-center">
                <i class="bi bi-pin-map fs-1"></i>
                <p class="mt-2 mb-0">No hay puntos en esta ruta</p>
            </div>
        `);
        return;
    }

    let html = '<div class="list-group">';
    points.forEach(point => {
        const isActivated = point.activado || false;
        html += `
            <div class="list-group-item point-card ${isActivated ? 'point-activated' : 'point-pending'}">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1"><i class="bi bi-geo-alt me-2"></i>${point.nombre}</h6>
                        <span class="badge ${isActivated ? 'bg-success' : 'bg-warning'}">${isActivated ? 'Activado' : 'Pendiente'}</span>
                    </div>
                    ${isActivated ? `
                        <button class="btn btn-outline-danger btn-sm" onclick="desactivarPunto('${point.id}', '${point.nombre.replace(/'/g, "\\'")}', '${point.cliente_nombre ? point.cliente_nombre.replace(/'/g, "\\'") : 'Cliente'}')">
                            <i class="bi bi-camera me-1"></i>Desactivar
                        </button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="activarPunto('${point.id}', '${point.nombre.replace(/'/g, "\\'")}', '${point.cliente_nombre ? point.cliente_nombre.replace(/'/g, "\\'") : 'Cliente'}')">
                            <i class="bi bi-camera me-1"></i>Activar
                        </button>
                    `}
                </div>
            </div>
        `;
    });
    html += '</div>';
    $('#puntosContainer').html(html);
}

// Función para abrir modal y activar cámara
function activarPunto(pointId, pointName, clientName) {
    currentPoint = { id: pointId, name: pointName, client: clientName };
    currentPhotoType = 'activacion';

    // Mostrar confirmación
    Swal.fire({
        title: 'Activar punto',
        text: `¿Estás seguro de activar ${pointName}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Abrir cámara nativa
            $('#cameraInputPrecios').attr('capture', 'environment').click();
        }
    });
}

// Resetear el modal de activación
function resetActivationModal() {
    // Ocultar vista previa y mostrar cámara
    $('#photoPreviewContainer').hide();
    $('#cameraLiveContainer').show();
    $('#cameraControls').show();
    
    // Resetear archivo seleccionado
    selectedPhotoFile = null;
    
    // Limpiar vista previa
    $('#previewImage').attr('src', '');
    
    // Resetear estado de la cámara
    isCameraReady = false;
    
    // Mostrar indicador de carga
    $('#cameraLoading').show();
    $('#cameraLive').hide();
    $('#btnTakePhoto').prop('disabled', true).html('<i class="bi bi-hourglass me-1"></i> Inicializando cámara...');
    $('#btnSwitchCamera').show();
}

// Iniciar cámara
function startCamera() {
    resetCameraModal();
    
    const constraints = {
        video: {
            facingMode: currentCamera,
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };
    
    const video = document.getElementById('cameraLive');
    
    if (stream) {
        stopCamera();
    }
    
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream) {
            stream = mediaStream;
            video.srcObject = mediaStream;
            
            video.onloadedmetadata = function() {
                video.play()
                    .then(() => {
                        $('#cameraLoading').hide();
                        $('#cameraLive').show();
                        $('#cameraControls').show();
                        
                        // Mostrar botón de cambiar cámara si hay múltiples cámaras
                        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                            navigator.mediaDevices.enumerateDevices()
                                .then(devices => {
                                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                                    if (videoDevices.length > 1) {
                                        $('#btnSwitchCamera').show();
                                    }
                                });
                        }
                        
                        isCameraReady = true;
                        $('#btnTakePhoto').prop('disabled', false).html('<i class="bi bi-camera"></i> Tomar Foto');
                    })
                    .catch(err => {
                        console.error("Error al reproducir video:", err);
                        showCameraError();
                    });
            };
        })
        .catch(function(err) {
            console.error("Error al acceder a la cámara:", err);
            showCameraError();
        });
}

// Mostrar error de cámara
function showCameraError() {
    $('#cameraLoading').hide();
    $('#cameraLive').hide();
    $('#cameraError').show();
    $('#btnTakePhoto').prop('disabled', true).html('<i class="bi bi-exclamation-triangle"></i> Error de cámara');
    Swal.fire({
        icon: 'error',
        title: 'Error de cámara',
        text: 'No se pudo acceder a la cámara. Verifica los permisos y recarga la página.',
        confirmButtonText: 'Entendido'
    });
}

// Resetear modal
function resetCameraModal() {
    $('#photoPreviewContainer').hide();
    $('#cameraLiveContainer').show();
    $('#cameraControls').show();
    selectedPhotoFile = null;
    $('#previewImage').attr('src', '');
    isCameraReady = false;
    $('#cameraLoading').show();
    $('#cameraLive').hide();
    $('#btnTakePhoto').prop('disabled', true).html('<i class="bi bi-hourglass"></i> Inicializando...');
}

// Detener cámara
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    const video = document.getElementById('cameraLive');
    if (video) video.srcObject = null;
    isCameraReady = false;
}

// Modificar la función para tomar fotos con cámara
function takeCameraPhoto() {
    if (!isCameraReady) {
        Swal.fire({
            icon: 'warning',
            title: 'Cámara no lista',
            text: 'Por favor espera a que la cámara se inicialice.'
        });
        return;
    }
    
    const video = document.getElementById('cameraLive');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob(async function(blob) {
        if (blob) {
            // Capturar GPS del dispositivo en el momento de la toma
            const deviceGPS = await captureMetadata();
            console.log("📍 GPS capturado en el momento de la foto:", deviceGPS);
            
            const timestamp = new Date().toISOString();
            const filename = `${currentPhotoType}_${Date.now()}.jpg`;
            const file = new File([blob], filename, { 
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            
            // Crear objeto URL para preview
            const objectUrl = URL.createObjectURL(blob);
            
            // Crear objeto de foto
            const photoObj = {
                file: file,
                url: objectUrl,
                type: currentPhotoType,
                timestamp: timestamp,
                deviceGPS: deviceGPS, // GPS capturado en el momento
                source: 'camera'
            };
            
            // Agregar al preview
            if (!photoPreview[currentPhotoType]) {
                photoPreview[currentPhotoType] = [];
            }
            photoPreview[currentPhotoType].push(photoObj);
            
            // Mostrar preview
            renderPhotoPreview(currentPhotoType);
            
            // Cerrar la cámara después de tomar la foto
            stopPhotoTypeCamera();
            $('#photoTypeModal').modal('hide');
        }
    }, 'image/jpeg', 0.75);
}


// Cambiar entre cámaras
function switchCamera() {
    currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
    
    // Actualizar texto del botón
    if (currentCamera === 'environment') {
        $('#btnSwitchCamera').html('<i class="bi bi-camera-video"></i> Cambiar a Frontal');
    } else {
        $('#btnSwitchCamera').html('<i class="bi bi-camera-video"></i> Cambiar a Trasera');
    }
    
    // Reiniciar cámara
    startCamera();
}

// Volver a tomar foto
function retakePhoto() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage.src);
    }
    
    $('#photoPreviewContainer').hide();
    startCamera();
}

// Subir foto de activación - FUNCIÓN ACTUALIZADA
async function uploadActivationPhoto() {
    if (!selectedPhotoFile) {
        Swal.fire('Error', 'No hay foto seleccionada', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Subiendo foto...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    
    // ✅ Usar buildFormDataActivation para incluir GPS
    const formData = await buildFormDataActivation(selectedPhotoFile);
    
    console.log("📤 Enviando formulario con datos:");
    for (let [k, v] of formData.entries()) {
        console.log(k, v);
    }
    
    OfflineCache.submitWithCache(
        '/api/upload-activation-photo',
        formData,
        {
            photoType: 'activacion',
            pointId: currentPoint ? currentPoint.id : '',
            pointName: currentPoint ? currentPoint.name : '',
            cedula: sessionStorage.getItem('merchandiser_cedula'),
            label: 'Activación: ' + (currentPoint ? currentPoint.name : '')
        }
    ).then(function(result) {
        Swal.close();

        if (result.cached) {
            // La foto quedó guardada localmente — no podemos continuar el flujo
            // hasta que se sincronice, porque necesitamos el id_foto del servidor.
            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión',
                html: `
                    <p>La foto de activación se guardó en tu dispositivo.</p>
                    <p class="text-muted">Se subirá automáticamente cuando tengas internet.</p>
                    <div class="alert alert-warning mt-2">
                        <i class="bi bi-info-circle me-2"></i>
                        Una vez que se sincronice, podrás continuar con la selección de cliente.
                    </div>
                `,
                confirmButtonText: 'Entendido'
            });
            $('#activacionModal').modal('hide');
            return;
        }

        const data = result.data;
        console.log("📦 Datos recibidos del servidor:", data);

        if (data.success) {
            if (!data.id_foto) {
                console.error("❌ ERROR: data.id_foto es undefined o null", data);
                Swal.fire('Error', 'No se recibió ID de la foto del servidor. Datos: ' + JSON.stringify(data), 'error');
                return;
            }

            currentActivationData = {
                id_foto: data.id_foto,
                mercaderista_id: data.mercaderista_id,
                point_id: data.point_id,
                file_path: data.file_path,
                punto_nombre: data.punto_nombre
            };

            console.log("✅ Foto subida exitosamente. currentActivationData:", currentActivationData);

            Swal.fire({
                icon: 'success',
                title: '¡Foto subida!',
                text: 'Ahora selecciona el cliente para esta visita',
                timer: 1500,
                showConfirmButton: false
            });

            $('#activacionModal').modal('hide');

            setTimeout(() => {
                showClientSelectionModal();
            }, 1600);
        } else {
            console.error("❌ El servidor respondió con success=false:", data);
            Swal.fire('Error', data.message || 'Error desconocido', 'error');
        }
    }).catch(function(err) {
        Swal.close();
        console.error('❌ Error al subir foto:', err);
        Swal.fire('Error', `Error al subir la foto: ${err.message}`, 'error');
    });
}

// Mostrar modal de selección de clientes - Solo clientes únicos por punto
function showClientSelectionModal() {
    Swal.fire({
        title: 'Cargando clientes...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    const cedula = sessionStorage.getItem('merchandiser_cedula');

    fetch(`/api/point-clients1/${currentPoint.id}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Merchandiser-Cedula': cedula
        },
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Sesión no válida');
        }
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(clients => {
        Swal.close();

        if (!clients || clients.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin clientes',
                text: 'No hay clientes asignados a este punto de interés'
            });
            return;
        }

        // Construir HTML para el modal
        let clientsHtml = '<div class="list-group">';
        clients.forEach(client => {
            clientsHtml += `
                <div class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${client.nombre || 'Cliente sin nombre'}</h6>
                        <small class="text-muted">${client.prioridad || 'Sin prioridad'}</small>
                    </div>
                    <button class="btn btn-primary btn-sm" 
                            onclick="selectClient(${client.id}, '${client.nombre.replace(/'/g, "\\'")}')">
                        <i class="bi bi-check-circle"></i> Seleccionar
                    </button>
                </div>
            `;
        });
        clientsHtml += '</div>';

        $('#clientSelectionContent').html(clientsHtml);
        $('#clientSelectionModal').modal('show');
    })
    .catch(error => {
        Swal.close();
        console.error('Error al cargar clientes:', error);

        Swal.fire({
            icon: 'error',
            title: 'Error de sesión',
            text: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            confirmButtonText: 'Iniciar Sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                window.location.href = '/login-mercaderista';
            }
        });
    });
}

// Seleccionar cliente y crear visita
// Seleccionar cliente y crear visita - FUNCIÓN ACTUALIZADA
function selectClient(clientId, clientName) {
    // 🔴 ELIMINADA: La verificación de currentActivationData ya no es necesaria
    // porque ahora obtenemos la foto de activación automáticamente
    
    Swal.fire({
        title: 'Asignando cliente...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    console.log("📤 Creando visita para cliente:", {
        client_id: clientId,
        point_id: currentPoint.id,
        route_id: currentRoute.id
    });
    
    // 🔴 MODIFICADO: Ahora usamos la función actualizada que obtiene la foto automáticamente
    createVisitForActivePoint(currentPoint.id, currentRoute.id, clientId, clientName);
}

// Mostrar modal para fotos adicionales por cliente
function showAdditionalPhotosModal() {
    if (!currentClientVisit) {
        Swal.fire('Error', 'No hay cliente seleccionado', 'error');
        return;
    }
    
    // Actualizar el título con el nombre del cliente
    $('#additionalPhotosTitle').html(`
        <i class="bi bi-images me-2"></i>Fotos Adicionales - ${currentClientVisit.client_name}
    `);
    
    // Mostrar el modal
    $('#additionalPhotosModal').modal('show');
}

// Abrir cámara para tipo específico de foto
function openPhotoType(photoType, visitaId) {
    currentPhotoType = photoType;
    currentVisitaId = visitaId;  // Asegúrate de que esto se esté seteando correctamente
    
    // Configurar el modal según el tipo de foto
    const titles = {
        'precios': 'Fotos de Precios',
        'gestion': 'Fotos de Gestión',
        'exhibiciones': 'Fotos de Exhibiciones'
    };
    
    $('#photoTypeTitle').text(titles[photoType] || 'Fotos Adicionales');
    
    // Actualizar el nombre del cliente y punto
    $('#clientNameForPhotos').text(currentClientVisit.client_name);
    $('#pointNameForPhotos').text(currentPoint.name);
    
    // Actualizar colores según tipo
    let bgColor = '';
    switch(photoType) {
        case 'precios':
            bgColor = 'bg-primary';
            break;
        case 'gestion':
            bgColor = 'bg-warning';
            break;
        case 'exhibiciones':
            bgColor = 'bg-info';
            break;
        default:
            bgColor = 'bg-primary';
    }
    
    $('#photoTypeModal .modal-header').removeClass().addClass(`modal-header ${bgColor} text-white`);
    
    // Mostrar modal con cámara
    $('#photoTypeModal').modal('show');
    setTimeout(() => {
        startPhotoTypeCamera();
    }, 500);
}

// Iniciar cámara para tipo específico de foto
function startPhotoTypeCamera() {
    resetPhotoTypeCamera();

    const constraints = {
        video: {
            facingMode: photoTypeCurrentCamera,
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false
    };

    const video = document.getElementById('photoCameraLive');

    if (photoTypeCameraStream) {
        stopPhotoTypeCamera();
    }

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function(mediaStream) {
            photoTypeCameraStream = mediaStream;
            video.srcObject = mediaStream;

            video.onloadedmetadata = function() {
                video.play()
                    .then(() => {
                        $('#photoCameraLoading').hide();
                        $('#photoCameraLive').show();
                        $('#photoCameraControls').show();
                        
                        // Mostrar botón de cambiar cámara si hay múltiples cámaras
                        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
                            navigator.mediaDevices.enumerateDevices()
                                .then(devices => {
                                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                                    if (videoDevices.length > 1) {
                                        $('#btnSwitchPhotoCamera').show();
                                    }
                                });
                        }
                    })
                    .catch(err => {
                        console.error("Error al reproducir video:", err);
                        showPhotoTypeCameraError();
                    });
            };
        })
        .catch(function(err) {
            console.error("Error al acceder a la cámara:", err);
            showPhotoTypeCameraError();
        });
}

// Cambiar cámara en el modal de fotos adicionales
function switchPhotoCamera() {
    photoTypeCurrentCamera = photoTypeCurrentCamera === 'environment' ? 'user' : 'environment';
    
    // Actualizar texto del botón
    if (photoTypeCurrentCamera === 'environment') {
        $('#btnSwitchPhotoCamera').html('<i class="bi bi-camera-video"></i> Cambiar a Frontal');
    } else {
        $('#btnSwitchPhotoCamera').html('<i class="bi bi-camera-video"></i> Cambiar a Trasera');
    }
    
    // Reiniciar cámara
    startPhotoTypeCamera();
}

// Mostrar error de cámara para fotos adicionales
function showPhotoTypeCameraError() {
    $('#photoCameraLoading').hide();
    $('#photoCameraLive').hide();
    Swal.fire({
        icon: 'error',
        title: 'Error de cámara',
        text: 'No se pudo acceder a la cámara. Verifica los permisos y recarga la página.',
        confirmButtonText: 'Entendido'
    });
}

// Resetear cámara para fotos adicionales
function resetPhotoTypeCamera() {
    $('#photoPreviewContainer').hide();
    $('#photoCameraContainer').show();
    $('#photoCameraControls').show();
    selectedPhotoFile = null;
    $('#photoPreviewImage').attr('src', '');
    $('#photoCameraLoading').show();
    $('#photoCameraLive').hide();
    $('#btnTakePhotoType').prop('disabled', false).html('<i class="bi bi-camera"></i> Tomar Foto');
}

// Detener cámara para fotos adicionales
function stopPhotoTypeCamera() {
    if (photoTypeCameraStream) {
        photoTypeCameraStream.getTracks().forEach(track => track.stop());
        photoTypeCameraStream = null;
    }
    const video = document.getElementById('photoCameraLive');
    if (video) video.srcObject = null;
}

// Tomar foto para tipo específico (desde el modal photoTypeModal)
async function takePhotoType() {
    const video = document.getElementById('photoCameraLive');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async function(blob) {
        if (blob) {
            // Capturar GPS del dispositivo en el momento de la toma
            const deviceGPS = await captureMetadata();
            console.log("📍 GPS capturado en el momento de la foto:", deviceGPS);
            
            const timestamp = new Date().toISOString();
            const filename = `${currentPhotoType}_${Date.now()}.jpg`;
            const file = new File([blob], filename, { 
                type: 'image/jpeg',
                lastModified: Date.now()
            });
            
            // Crear objeto URL para preview
            const objectUrl = URL.createObjectURL(blob);
            
            // Crear objeto de foto
            const photoObj = {
                file: file,
                url: objectUrl,
                type: currentPhotoType,
                timestamp: timestamp,
                deviceGPS: deviceGPS,
                source: 'camera'
            };
            
            // Agregar al preview
            if (!photoPreview[currentPhotoType]) {
                photoPreview[currentPhotoType] = [];
            }
            photoPreview[currentPhotoType].push(photoObj);
            
            // Mostrar preview
            renderPhotoPreview(currentPhotoType);
            
            // Cerrar el modal de cámara
            $('#photoTypeModal').modal('hide');
            stopPhotoTypeCamera();
        }
    }, 'image/jpeg', 0.75);
}

// Volver a tomar foto para tipo específico
function retakePhotoType() {
    const previewImage = document.getElementById('photoPreviewImage');
    if (previewImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage.src);
    }

    $('#photoPreviewContainer').hide();
    startPhotoTypeCamera();
}

// Subir foto adicional
function uploadAdditionalPhoto() {
    if (!selectedPhotoFile || !currentVisitaId) {
        Swal.fire('Error', 'Faltan datos para subir la foto', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Subiendo foto...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    const formData = new FormData();
    formData.append('photo', selectedPhotoFile);
    formData.append('point_id', currentPoint.id);
    formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
    formData.append('photo_type', currentPhotoType);
    formData.append('visita_id', currentVisitaId);
    
    fetch('/api/upload-additional-photo', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        Swal.close();
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Foto subida!',
                text: `Foto de ${currentPhotoType} subida exitosamente`,
                timer: 1500,
                showConfirmButton: false
            });
            
            // Resetear para nueva foto
            selectedPhotoFile = null;
            $('#photoPreviewImage').attr('src', '');
            $('#photoPreviewContainer').hide();
            $('#photoCameraContainer').show();
            
            // Preguntar si quiere tomar otra foto del mismo tipo
// Preguntar si quiere tomar otra foto del mismo tipo
            Swal.fire({
                title: '¿Otra foto?',
                text: `¿Quieres tomar otra foto de ${currentPhotoType}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, otra foto',
                cancelButtonText: 'No, otro tipo',
                reverseButtons: true
            }).then((result) => {
                if (!result.isConfirmed) {
                    // Preguntar si quiere hacer otro tipo de foto para el mismo cliente
                    // IMPORTANTE: No cerrar el modal aquí
                    askAnotherPhotoType();
                }
            });
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(err => {
        Swal.close();
        Swal.fire('Error', 'Error al subir la foto', 'error');
    });
}

// Preguntar si quiere hacer otro tipo de foto para el mismo cliente
// Preguntar si quiere hacer otro tipo de foto para el mismo cliente
function askAnotherPhotoType() {
    Swal.fire({
        title: '¿Otro tipo de foto?',
        text: '¿Quieres tomar fotos de otro tipo para este mismo cliente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, otro tipo',
        cancelButtonText: 'No, otro cliente',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // No cerrar el modal, solo limpiar el preview
            $('.photo-preview-container').remove();
            
            // Mostrar mensaje para seleccionar otro tipo de foto
            Swal.fire({
                title: 'Selecciona tipo de foto',
                html: `
                <div class="alert alert-info">
                    <p>Selecciona el tipo de foto que deseas tomar a continuación:</p>
                    <ul>
                        <li><strong>Precios:</strong> Para capturar precios de productos</li>
                        <li><strong>Gestión:</strong> Para capturar antes y después de la gestión</li>
                        <li><strong>Exhibiciones:</strong> Para registrar exhibiciones adicionales</li>
                    </ul>
                </div>
                `,
                timer: 3000,
                showConfirmButton: false
            });
            
            // El modal permanece abierto para que el usuario seleccione el nuevo tipo
        } else {
            // Preguntar si quiere seleccionar otro cliente del mismo punto
            askAnotherClient();
        }
    });
}

// Preguntar si quiere seleccionar otro cliente del mismo punto
function askAnotherClient() {
    Swal.fire({
        title: '¿Otro cliente?',
        text: '¿Quieres seleccionar otro cliente de este mismo punto de interés?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, otro cliente',
        cancelButtonText: 'No, terminar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // IMPORTANTE: Resetear la visita actual para empezar de nuevo
            currentClientVisit = null;
            currentVisitaId = null;
            
            // Cerrar el modal de fotos adicionales
            $('#additionalPhotosModal').modal('hide');
            
            // Mostrar modal para seleccionar clientes
            setTimeout(() => {
                showClientSelectionModal();
            }, 500);
        } else {
            // Volver a la lista de puntos pero mantener los clientes visibles
            Swal.fire({
                icon: 'success',
                title: '¡Listo!',
                html: `
                <p>Has completado las fotos para este cliente.</p>
                <p class="text-muted">Puedes seleccionar otro cliente o terminar.</p>
                `,
                timer: 1500,
                showConfirmButton: false
            });
            
            // No cerrar el modal completamente, mantenerlo para continuar
            setTimeout(() => {
                // Recargar los puntos activos (manteniendo los clientes visibles)
                loadActivePoints();
                
                // Mostrar mensaje para continuar
                Swal.fire({
                    title: 'Continuar',
                    html: `
                    <div class="alert alert-info">
                        <p>Selecciona otro cliente de la lista para continuar con más visitas.</p>
                        <p class="text-muted">O cierra el modal para terminar.</p>
                    </div>
                    `,
                    timer: 3000,
                    showConfirmButton: false
                });
            }, 1600);
        }
    });
}


// Volver a la página de carga de fotos
function goToCargaFotos() {
    window.location.href = '/carga-fotos-mercaderista';
}

// Actualizar rutas
function refreshRoutes() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    loadFixedRoutes(cedula);
}

// Manejar el cierre de modales
$('#photoTypeModal').on('hidden.bs.modal', function() {
    stopPhotoTypeCamera();
    resetPhotoTypeCamera();
});

// $('#additionalPhotosModal').on('hidden.bs.modal', function() {
//     // Limpiar selección de cliente actual
//     currentClientVisit = null;
//     currentVisitaId = null;
//     // También limpiar activation data por si acaso
//     currentActivationData = null;
// });

function renderPhotosPreview(type) {
    const $container = $(`#${type}-preview-container`);
    if ($container.length === 0) {
        // Crear contenedor si no existe
        const html = `
            <div id="${type}-preview-container" class="row g-2 mb-3">
                <h6 class="text-muted">Fotos de ${type}:</h6>
            </div>
        `;
        $('#photoTypeModal .modal-body').append(html);
    }

    const $preview = $(`#${type}-preview-container`);
    $preview.empty();
    $preview.append(`<h6 class="text-muted">Fotos de ${type}:</h6>`);

    window.photosPreview[type].forEach((photo, index) => {
        $preview.append(`
            <div class="col-4 position-relative">
                <img src="${photo.url}" class="img-fluid rounded border" style="height: 100px; object-fit: cover;">
                <button class="btn btn-danger btn-sm position-absolute top-0 end-0" onclick="removePhoto('${type}', ${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `);
    });

    // Mostrar botón de subir todas
    if (window.photosPreview[type].length > 0) {
        if ($(`#upload-all-${type}`).length === 0) {
            $preview.append(`
                <div class="col-12 mt-2">
                    <button class="btn btn-success" id="upload-all-${type}" onclick="uploadAllPhotos('${type}')">
                        <i class="bi bi-cloud-upload"></i> Subir ${window.photosPreview[type].length} foto(s)
                    </button>
                </div>
            `);
        } else {
            $(`#upload-all-${type}`).text(`Subir ${window.photosPreview[type].length} foto(s)`);
        }
    }
}

function removePhoto(type, index) {
    const photo = window.photosPreview[type][index];
    if (photo.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
    }
    window.photosPreview[type].splice(index, 1);
    renderPhotosPreview(type);
}

// Función para subir todas las fotos de un tipo
// ✅ ACTUALIZADA: Función para subir todas las fotos de un tipo (precios, exhibiciones)
// ✅ ACTUALIZADA: Función para subir todas las fotos de un tipo (precios, exhibiciones) con soporte para chunks
async function uploadAllPhotos(type) {
    const photos = photoPreview[type];
    if (!photos || photos.length === 0) {
        Swal.fire('Error', 'No hay fotos para subir', 'error');
        return;
    }

    // 🔁 CHUNK UPLOAD: Si hay muchas fotos, subir en bloques de 10
    var CHUNK_SIZE = 10;
    if (photos.length > CHUNK_SIZE) {
        Swal.fire({
            title: 'Subiendo fotos...',
            html: `Subiendo ${photos.length} fotos en bloques de ${CHUNK_SIZE}`,
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        (async function() {
            var totalOk = 0;
            var CONCURRENT = 3; // 🚀 3 chunks en paralelo

            // Crear todos los FormData primero
            var allChunks = [];
            for (var ci = 0; ci < photos.length; ci += CHUNK_SIZE) {
                var chunk = photos.slice(ci, ci + CHUNK_SIZE);
                var chunkForm = new FormData();
                chunkForm.append('point_id', currentPoint ? currentPoint.id : '');
                chunkForm.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
                chunkForm.append('photo_type', type || '');
                chunkForm.append('visita_id', currentVisitaId || '');

                chunk.forEach(function(p, idx) {
                    chunkForm.append('photos', p.file || p);
                    if (p.deviceGPS && p.deviceGPS.lat) {
                        chunkForm.append('lat_' + idx, p.deviceGPS.lat);
                        chunkForm.append('lon_' + idx, p.deviceGPS.lon);
                        chunkForm.append('alt_' + idx, p.deviceGPS.alt || '');
                    }
                });
                allChunks.push(chunkForm);
            }

            // 🚀 Enviar en lotes de CONCURRENT simultáneos
            for (var bi = 0; bi < allChunks.length; bi += CONCURRENT) {
                var batchPromises = allChunks.slice(bi, bi + CONCURRENT).map(function(form) {
                    return OfflineCache.submitWithCache(
                        '/api/upload-multiple-additional-photos',
                        form,
                        {
                            photoType: type,
                            pointId: currentPoint ? currentPoint.id : '',
                            visitaId: currentVisitaId,
                            cedula: sessionStorage.getItem('merchandiser_cedula'),
                            label: type + ' (chunk)'
                        }
                    ).then(function(r) {
                        if (r.cached) return { total_successful: 0, cached: true };
                        return r.data || { total_successful: 0 };
                    }).catch(function(e) { console.error('Error chunk:', e); return { total_successful: 0 }; });
                });

                var batchResults = await Promise.all(batchPromises);
                batchResults.forEach(function(d) { totalOk += d.total_successful || 0; });

                // Actualizar progreso
                var processed = Math.min((bi + CONCURRENT) * CHUNK_SIZE, photos.length);
                Swal.update({ html: 'Subiendo... ' + processed + '/' + photos.length + ' fotos' });
            }

            Swal.close();
            photos.forEach(photo => { if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url); });
            photoPreview[type] = [];
            clearTypeFromDB(type, 'default');
            renderPhotoPreview(type);
            Swal.fire({
                icon: 'success',
                title: '¡Fotos subidas!',
                html: `<p class="text-success"><i class="bi bi-check-circle me-1"></i>${totalOk} fotos de <strong>${type}</strong> subidas correctamente</p>`,
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => { askAnotherPhotoTypeAfterUpload(); }, 2100);

            // (Opcional) Preguntar si quiere más fotos del mismo tipo o de otro
            // Se puede descomentar si se desea similar al flujo normal
            // setTimeout(() => {
            //     askAnotherPhotoTypeAfterUpload();
            // }, 2100);
        })();

        return; // Sale, no continúa al fetch normal
    }

    // Si no aplica chunking, se ejecuta el flujo original
    Swal.fire({
        title: 'Subiendo fotos...',
        html: `Preparando ${photos.length} fotos de ${type}`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        // Crear FormData
        const formData = new FormData();
        formData.append('point_id', currentPoint.id);
        formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
        formData.append('photo_type', type);
        formData.append('visita_id', currentVisitaId);

        // Agregar cada foto
        photos.forEach((photo, index) => {
            formData.append('photos', photo.file);

            // Agregar GPS del dispositivo para cada foto (por si no tiene EXIF)
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`lat_${index}`, photo.deviceGPS.lat);
                formData.append(`lon_${index}`, photo.deviceGPS.lon);
                formData.append(`alt_${index}`, photo.deviceGPS.alt || '');
            }
        });

        // Enviar al endpoint de múltiples fotos
        const result = await OfflineCache.submitWithCache(
            '/api/upload-multiple-additional-photos',
            formData,
            {
                photoType: type,
                pointId: currentPoint ? currentPoint.id : '',
                visitaId: currentVisitaId,
                cedula: sessionStorage.getItem('merchandiser_cedula'),
                label: type + ' — ' + photos.length + ' fotos'
            }
        );

        if (result.cached) {
            // Limpiar el preview localmente
            photoPreview[type] = [];
            photos.forEach(photo => {
                if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
            });
            renderPhotoPreview(type);

            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión — fotos guardadas',
                html: `
                    <p>Las fotos de <strong>${type}</strong> se guardaron en tu dispositivo.</p>
                    <p class="text-muted">Se subirán automáticamente cuando tengas internet.</p>
                `,
                timer: 3000,
                showConfirmButton: false
            });

            setTimeout(() => {
                askAnotherPhotoTypeAfterUpload();
            }, 3100);
            return;
        }

        const data = result.data;

        if (data.success) {
            // Limpiar SOLO este tipo — los demás previews NO se tocan
            photos.forEach(photo => { if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url); });
            photoPreview[type] = [];
            clearTypeFromDB(type, 'default');
            renderPhotoPreview(type);
            Swal.fire({
                icon: 'success',
                title: '¡Fotos subidas!',
                html: `<p class="text-success"><i class="bi bi-check-circle me-1"></i>${data.total_successful || 0} fotos de <strong>${type}</strong> subidas correctamente</p>`,
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => { askAnotherPhotoTypeAfterUpload(); }, 2100);
        } else {
            Swal.fire('Error', data.message || 'Error al subir las fotos', 'error');
        }

    } catch (error) {
        Swal.close();
        console.error('Error al subir fotos:', error);
        Swal.fire('Error', 'Error de conexión al subir las fotos', 'error');
    }
}
// En la función que maneja la desactivación
function desactivarPunto(pointId, pointName, clientName) {
    currentPoint = { id: pointId, name: pointName, client: clientName };
    currentPhotoType = 'desactivacion';
    
    // Mostrar confirmación
    Swal.fire({
        title: 'Desactivar punto',
        text: `¿Estás seguro de desactivar ${pointName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Abrir el selector de cámara
            $('#cameraInputPrecios').attr('capture', 'environment').click();
        }
    });
}




async function captureMetadata() {
    if (_lastGPS && (Date.now() - _lastGPSTime) < GPS_CACHE_TTL) {
    return Promise.resolve(_lastGPS);
}
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn("⚠️ Geolocation API no soportada");
            resolve({});
            return;
        }
        
        console.log("🎯 Solicitando ubicación...");
        
        navigator.geolocation.getCurrentPosition(
            pos => {
                currentMeta = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    alt: pos.coords.altitude || null,
                    accuracy: pos.coords.accuracy,
                    timestamp: pos.timestamp
                };
                _lastGPS = currentMeta;
                _lastGPSTime = Date.now();  
                console.log("✅ Ubicación obtenida:", currentMeta);
                resolve(currentMeta);
            },
            err => {
                console.warn('❌ Error obteniendo GPS:', err.message, err.code);
                
                // Códigos de error comunes:
                // 1: PERMISSION_DENIED
                // 2: POSITION_UNAVAILABLE
                // 3: TIMEOUT
                
                // Intentar con configuración menos exigente como fallback
                navigator.geolocation.getCurrentPosition(
                    pos => {
                        currentMeta = {
                            lat: pos.coords.latitude,
                            lon: pos.coords.longitude,
                            alt: pos.coords.altitude || null,
                            accuracy: pos.coords.accuracy,
                            timestamp: pos.timestamp
                        };
                        console.log("✅ Ubicación obtenida (fallback):", currentMeta);
                        resolve(currentMeta);
                    },
                    err2 => {
                        console.warn('❌ Fallback también falló:', err2.message);
                        resolve({});
                    },
                    { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
                );
            },
            { 
                enableHighAccuracy: true, 
                timeout: 15000,  // Aumentar timeout a 15 segundos
                maximumAge: 0    // Siempre obtener ubicación fresca
            }
        );
    });
}

async function buildFormDataActivation(file) {
  console.log("🛰️ Obteniendo GPS del dispositivo...");
  
  // Obtener GPS del dispositivo
  const gpsData = await captureMetadata();
  console.log("📍 GPS obtenido del dispositivo:", gpsData);
  
  const fd = new FormData();
  fd.append('photo', file);
  fd.append('point_id', currentPoint.id);
  fd.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
  fd.append('route_id', currentRoute?.id || '');

  // ✅ Siempre enviamos GPS del dispositivo
  fd.append('lat', gpsData.lat || '');
  fd.append('lon', gpsData.lon || '');
  fd.append('alt', gpsData.alt || '');
  
  console.log("📤 Datos que se enviarán al backend:", {
    lat: gpsData.lat || 'No disponible',
    lon: gpsData.lon || 'No disponible',
    alt: gpsData.alt || 'No disponible'
  });

  return fd;
}

// Variables globales para puntos activos
let activePointsData = [];

// Cargar puntos activos con clientes
// Cargar puntos activos con clientes (con caché de 10 segundos)
function loadActivePoints(forceRefresh) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) {
        console.error("No hay cédula en sesión");
        return;
    }

    // Usar caché si no se fuerza refresco y el caché es reciente (< 10 seg)
    if (!forceRefresh && _activePointsCache && (Date.now() - _activePointsCacheTime) < 10000) {
        activePointsData = _activePointsCache;
        renderActivePoints();
        return;
    }

    $('#activePointsContainer').html(`
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando puntos activos...</p>
        </div>
    `);

    fetch('/api/active-points-with-clients', {
        method: 'GET',
        headers: {
            'X-Merchandiser-Cedula': cedula
        },
        credentials: 'include'
    })
    .then(response => {
        if (response.status === 401) {
            throw new Error('Sesión no válida');
        }
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // Guardar en caché
        _activePointsCache = data;
        _activePointsCacheTime = Date.now();
        activePointsData = data;
        renderActivePoints();
    })
    .catch(error => {
        console.error('Error al cargar puntos activos:', error);
        $('#activePointsContainer').html(`
            <div class="alert alert-warning text-center">
                <i class="bi bi-info-circle me-2"></i>No hay puntos activos con visitas pendientes
            </div>
        `);
    });
}

// Renderizar puntos activos
function renderActivePoints() {
    if (!activePointsData || activePointsData.length === 0) {
        $('#activePointsSection').hide();
        return;
    }
    $('#activePointsSection').show();
    let html = '<div class="row">';
    
    // Agrupar por ruta primero
    const routes = {};
    activePointsData.forEach(point => {
        if (!routes[point.route_id]) {
            routes[point.route_id] = {
                route_id: point.route_id,
                route_name: point.route_name,
                points: []
            };
        }
        routes[point.route_id].points.push(point);
    });
    
    // Renderizar cada ruta con sus puntos
    Object.values(routes).forEach(route => {
        html += `
        <div class="col-12 mb-4">
            <div class="card border-primary">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-signpost me-2"></i>${route.route_name}</h5>
                </div>
                <div class="card-body">
        `;
        route.points.forEach(point => {
            const pointIdSafe = point.point_id.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitizar ID
            
            html += `
            <div class="card mb-3 border-success">
                <div class="card-header bg-success text-white d-flex justify-content-between align-items-center">
                    <h6 class="mb-0"><i class="bi bi-geo-alt me-2"></i>${point.point_name}</h6>
                    <span class="badge bg-light text-dark">Punto Activo</span>
                </div>
                <div class="card-body">
                    <h6 class="card-title text-muted mb-3"><i class="bi bi-people me-2"></i>Clientes disponibles:</h6>
                    <div class="list-group">
            `;
            
            if (point.clients && point.clients.length > 0) {
                point.clients.forEach(client => {
                    html += `
                    <button class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        onclick="continueVisit('${point.point_id}', '${point.point_name.replace(/'/g, "\\'")}', '${point.route_id}', '${point.route_name.replace(/'/g, "\\'")}', '${client.client_id}', '${client.client_name.replace(/'/g, "\\'")}')">
                        <div>
                            <h6 class="mb-0">${client.client_name}</h6>
                            <small class="text-muted">Prioridad: ${client.priority}</small>
                        </div>
                        <span class="badge bg-info rounded-pill"><i class="bi bi-arrow-right-circle"></i> Continuar</span>
                    </button>
                    `;
                });
            } else {
                html += `
                <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>No hay clientes asignados a este punto
                </div>
                `;
            }
            
            html += `
                    </div>
                    <div class="mt-3">
                        <div class="alert alert-warning">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Requisitos para desactivar:</strong> Debes marcar ambas tareas
                        </div>
                        <div class="form-check mb-2">
                            <input class="form-check-input" type="checkbox" id="limpieza_${pointIdSafe}" onchange="checkDesactivarButton('${point.point_id}')">
                            <label class="form-check-label" for="limpieza_${pointIdSafe}">
                                <strong>Limpieza de PDV</strong> - Se realizó limpieza completa del punto de venta
                            </label>
                        </div>
                        <div class="form-check mb-3">
                            <input class="form-check-input" type="checkbox" id="fifo_${pointIdSafe}" onchange="checkDesactivarButton('${point.point_id}')">
                            <label class="form-check-label" for="fifo_${pointIdSafe}">
                                <strong>Realizar FIFO</strong> - Se realizó rotación de inventario (FIFO)
                            </label>
                        </div>
                        <div class="text-end">
                            <button class="btn btn-outline-danger btn-sm" 
                                id="btnDesactivar_${pointIdSafe}" 
                                onclick="deactivatePointFromActive('${point.point_id}', '${point.point_name.replace(/'/g, "\\'")}')"
                                disabled>
                                <i class="bi bi-power me-1"></i>Desactivar Punto
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
        });
        
        html += `
                </div>
            </div>
        </div>
        `;
    });
    
    html += '</div>';
    $('#activePointsContainer').html(html);
}

// Continuar visita para un cliente en un punto activo
function continueVisit(pointId, pointName, routeId, routeName, clientId, clientName) {
    // Establecer variables globales como si estuviéramos en el flujo normal
    currentPoint = { id: pointId, name: pointName };
    currentRoute = { id: parseInt(routeId), name: routeName };
    
    // Mostrar confirmación
    Swal.fire({
        title: 'Continuar visita',
        html: `
            <p><strong>Punto:</strong> ${pointName}</p>
            <p><strong>Ruta:</strong> ${routeName}</p>
            <p><strong>Cliente:</strong> ${clientName}</p>
            <p class="text-warning mt-2"><i class="bi bi-info-circle me-1"></i> 
            Se creará una nueva visita para este cliente en el punto activo
            </p>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#28a745'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí necesitamos crear la visita directamente
            createVisitForActivePoint(pointId, routeId, clientId, clientName);
        }
    });
}

// Crear visita para un punto activo existente
// Crear visita para un punto activo existente - FUNCIÓN ACTUALIZADA
// Crear visita para un punto activo existente - VERSIÓN CORREGIDA
function createVisitForActivePoint(pointId, routeId, clientId, clientName) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) {
        Swal.fire('Error', 'Sesión no válida', 'error');
        return;
    }

    // ✅ Si ya existe una visita guardada para este mismo punto+cliente, usarla directamente
    var savedVisitaId = localStorage.getItem('currentVisitaId');
    var savedPointId  = localStorage.getItem('currentPointId');
    var savedClientId = localStorage.getItem('currentClientId');
    if (savedVisitaId && savedPointId === String(pointId) && savedClientId === String(clientId)) {
        console.log('[Recuperar] Visita existente detectada:', savedVisitaId, '— reutilizando');
        currentVisitaId = savedVisitaId;
        currentClientVisit = {
            id: savedVisitaId,
            client_id: clientId,
            client_name: clientName,
            point_id: pointId
        };
        sessionStorage.setItem('currentVisitaId', savedVisitaId);
        sessionStorage.setItem('currentClientName', clientName);
        showAdditionalPhotosModal();
        return;
    }

    Swal.fire({
        title: 'Creando visita...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    // 🔴 CORREGIDO: Llamar al endpoint correcto que acabamos de crear
    fetch(`/api/merchandiser/${cedula}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'  // Para asegurar respuesta JSON
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos del mercaderista');
        }
        return response.json();
    })
    .then(mercaderista => {
        if (!mercaderista.success || !mercaderista.id_mercaderista) {
            throw new Error('Mercaderista no encontrado o inactivo');
        }
        const mercaderistaId = mercaderista.id_mercaderista;

        // Obtener la foto de activación
        return fetch(`/api/latest-activation-photo/${pointId}`, {
            method: 'GET',
            headers: {
                'X-Merchandiser-Cedula': cedula,
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener foto de activación');
            }
            return response.json();
        })
        .then(activationData => {
            if (!activationData.success) {
                throw new Error('No se encontró foto de activación para este punto');
            }

            let idFotoParaAsignar = activationData.id_foto;
            
            // Crear la visita
            return fetch('/api/create-client-visit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    client_id: clientId,
                    point_id: pointId,
                    mercaderista_id: mercaderistaId,
                    route_id: routeId,
                    id_foto: idFotoParaAsignar
                }),
                credentials: 'include'
            });
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        Swal.close();
        if (data.success) {
            console.log("✅ Visita creada exitosamente:", data);
            // Guardar la visita actual
            currentClientVisit = {
                id: data.visita_id,
                client_id: clientId,
                client_name: clientName,
                point_id: pointId,
                id_foto: data.id_foto || null
            };
            currentVisitaId = data.visita_id;
            sessionStorage.setItem('currentVisitaId', data.visita_id);
            sessionStorage.setItem('currentClientName', clientName);
            localStorage.setItem('currentVisitaId', data.visita_id);
            localStorage.setItem('currentClientName', clientName);
            localStorage.setItem('currentPointId', pointId);
            localStorage.setItem('currentClientId', String(clientId));
            
            // Mostrar éxito y luego abrir el modal de fotos adicionales
            Swal.fire({
                icon: 'success',
                title: '¡Visita creada!',
                text: `Se ha creado la visita para ${clientName}`,
                timer: 1500,
                showConfirmButton: false
            });
            
            // Esperar un poco y luego mostrar el modal de fotos adicionales
            setTimeout(() => {
                showAdditionalPhotosModal();
            }, 1600);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error al crear visita',
                text: data.message || 'No se pudo crear la visita'
            });
        }
    })
    .catch(error => {
        Swal.close();
        console.error('Error al crear visita:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al crear la visita: ' + error.message
        });
    });
}

// Desactivar punto desde la sección de puntos activos
function deactivatePointFromActive(pointId, pointName) {
    const pointIdSafe = pointId.replace(/[^a-zA-Z0-9]/g, '_');
    
    // Verificar que ambos checkboxes estén marcados
    const limpiezaChecked = document.getElementById(`limpieza_${pointIdSafe}`)?.checked || false;
    const fifoChecked = document.getElementById(`fifo_${pointIdSafe}`)?.checked || false;
    
    if (!limpiezaChecked || !fifoChecked) {
        Swal.fire({
            icon: 'warning',
            title: 'Tareas pendientes',
            html: `
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-octagon me-2"></i>
                    <strong>¡Atención!</strong><br>
                    Debes completar y marcar ambas tareas antes de desactivar el punto:
                    <ul class="mt-2 mb-0">
                        <li>${!limpiezaChecked ? '<i class="bi bi-x-circle text-danger"></i>' : '<i class="bi bi-check-circle text-success"></i>'} Limpieza de PDV</li>
                        <li>${!fifoChecked ? '<i class="bi bi-x-circle text-danger"></i>' : '<i class="bi bi-check-circle text-success"></i>'} Realizar FIFO</li>
                    </ul>
                </div>
            `,
            confirmButtonText: 'Entendido'
        });
        return;
    }
    
    Swal.fire({
        title: 'Desactivar punto',
        html: `
            <p><strong>Punto:</strong> ${pointName}</p>
            <div class="alert alert-success mt-3">
                <i class="bi bi-check-circle me-2"></i>
                <strong>Tareas completadas:</strong>
                <ul class="mb-0 mt-2">
                    <li><i class="bi bi-check-circle-fill text-success"></i> Limpieza de PDV ✅</li>
                    <li><i class="bi bi-check-circle-fill text-success"></i> Realizar FIFO ✅</li>
                </ul>
            </div>
            <p class="text-warning mt-2">
                <i class="bi bi-info-circle me-1"></i>
                Se tomará una foto de desactivación y se finalizarán todas las visitas pendientes.
            </p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
    }).then((result) => {
        if (result.isConfirmed) {
            currentPoint = { id: pointId, name: pointName };
            currentPhotoType = 'desactivacion';
            // Abrir cámara para foto de desactivación
            $('#cameraInputPrecios').attr('capture', 'environment').click();
            
            // Resetear checkboxes después de iniciar el proceso
            setTimeout(() => {
                const limpiezaCheckbox = document.getElementById(`limpieza_${pointIdSafe}`);
                const fifoCheckbox = document.getElementById(`fifo_${pointIdSafe}`);
                if (limpiezaCheckbox) limpiezaCheckbox.checked = false;
                if (fifoCheckbox) fifoCheckbox.checked = false;
                checkDesactivarButton(pointId);
            }, 500);
        }
    });
}
// Función para abrir la galería y seleccionar múltiples fotos
function openGalleryForPhotoType(type) {
    currentPhotoType = type;
    
    // Crear input de archivo dinámicamente
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.capture = null; // Sin cámara, solo galería
    
    input.onchange = async function(e) {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        // Obtener GPS actual del dispositivo para usar si las fotos no tienen EXIF
        const deviceGPS = await captureMetadata();
        console.log("📍 GPS del dispositivo para fotos de galería:", deviceGPS);
        
        // Procesar cada foto
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Crear objeto URL para preview
            const objectUrl = URL.createObjectURL(file);
            
            // Crear objeto de foto con metadatos
            const photoObj = {
                file: file,
                url: objectUrl,
                type: type,
                timestamp: new Date().toISOString(),
                deviceGPS: deviceGPS, // Guardar GPS del dispositivo
                index: i
            };
            
            // Agregar al array correspondiente
            if (!photoPreview[type]) photoPreview[type] = [];
            photoPreview[type].push(photoObj);
        }
        
        // Mostrar preview
        renderPhotoPreview(type);
    };
    
    input.click();
}

// Función para renderizar el preview de fotos
    // Wrapper con temporizador para evitar renderizados excesivos
function renderPhotoPreview(type) {
    clearTimeout(_renderPreviewTimer[type]);
    _renderPreviewTimer[type] = setTimeout(function() {
        _doRenderPhotoPreview(type);
    }, 50);
}

// Contenido original de renderPhotoPreview, renombrado
function _doRenderPhotoPreview(type) {
    const containerId = `${type}-preview-container`;
    let $container = $(`#${containerId}`);
    
    // Si no existe el contenedor, crearlo
    if ($container.length === 0) {
        const html = `
            <div class="row mt-3">
                <div class="col-12">
                    <div id="${containerId}" class="photo-preview-container">
                        <h6 class="text-muted mb-3">
                            <i class="bi bi-images me-2"></i>Fotos de ${type} (${photoPreview[type]?.length || 0})
                        </h6>
                        <div class="row" id="${type}-preview-grid"></div>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar después del modal-body o en el lugar apropiado
        $('#additionalPhotosModal .modal-body').append(html);
        $container = $(`#${containerId}`);
    }
    
    // Actualizar el grid de fotos
    const $grid = $(`#${type}-preview-grid`);
    $grid.empty();
    
    if (!photoPreview[type] || photoPreview[type].length === 0) {
        $grid.html(`
            <div class="col-12 text-center py-4">
                <i class="bi bi-image text-muted" style="font-size: 3rem;"></i>
                <p class="text-muted mt-2">No hay fotos seleccionadas</p>
            </div>
        `);
        return;
    }
    
    // Renderizar cada foto
    photoPreview[type].forEach((photo, index) => {
        const photoHtml = `
            <div class="col-4 mb-3 position-relative photo-thumbnail" data-index="${index}" data-type="${type}">
                <div class="card h-100">
                    <img src="${photo.url}" 
                         class="card-img-top" 
                         style="height: 120px; object-fit: cover;"
                         alt="Foto ${index + 1}">
                    <div class="card-body p-2">
                        <small class="text-muted d-block">
                            <i class="bi bi-clock me-1"></i>
                            ${new Date(photo.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                    </div>
                    <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                            onclick="removePhotoFromPreview('${type}', ${index})"
                            style="width: 30px; height: 30px; padding: 0; border-radius: 50%;">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
        `;
        $grid.append(photoHtml);
    });
    
    // Actualizar contador
    $(`#${containerId} h6`).html(`
        <i class="bi bi-images me-2"></i>Fotos de ${type} (${photoPreview[type].length})
    `);
    
    // Mostrar/ocultar botón de subir todas
    updateUploadButton(type);
}
    
   

// Función para actualizar el botón de subir todas las fotos
function updateUploadButton(type) {
    const hasPhotos = photoPreview[type] && photoPreview[type].length > 0;
    
    // Buscar o crear el botón
    let $uploadBtn = $(`#upload-all-${type}`);
    
    if ($uploadBtn.length === 0) {
        const btnHtml = `
            <div class="col-12 mt-3">
                <button class="btn btn-success w-100" id="upload-all-${type}" onclick="uploadAllPhotos('${type}')">
                    <i class="bi bi-cloud-upload me-2"></i>
                    Subir todas las fotos (${photoPreview[type]?.length || 0})
                </button>
            </div>
        `;
        $(`#${type}-preview-grid`).after(btnHtml);
        $uploadBtn = $(`#upload-all-${type}`);
    }
    
    // Actualizar texto y estado
    if (hasPhotos) {
        $uploadBtn
            .prop('disabled', false)
            .html(`<i class="bi bi-cloud-upload me-2"></i>Subir todas las fotos (${photoPreview[type].length})`);
    } else {
        $uploadBtn
            .prop('disabled', true)
            .html(`<i class="bi bi-cloud-upload me-2"></i>No hay fotos para subir`);
    }
}



// Función para eliminar una foto del preview
function removePhotoFromPreview(type, index) {
    if (!photoPreview[type] || !photoPreview[type][index]) return;
    var photo = photoPreview[type][index];
    if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
    deletePhotoFromDB(photo._idbId);
    photoPreview[type].splice(index, 1);
    renderPhotoPreview(type);
}


// Asegúrate de que el botón del modal de cámara llame a takePhotoType
$(document).on('click', '#btnTakePhotoType', function() {
    takePhotoType();
});

// Y el botón de cambiar cámara
$(document).on('click', '#btnSwitchPhotoCamera', function() {
    switchPhotoCamera();
});

// Función para establecer el tipo de foto de gestión
// Función para establecer el tipo de foto de gestión - FUNCIÓN MEJORADA
function setGestionType(type) {
    gestionMode = type;
    
    // Actualizar visualmente los botones
    $('.btn-group button').removeClass('active');
    if (type === 'antes') {
        $('#btnGestionAntes').addClass('active');
        gestionStep = 'antes';
        photoTypeBeforeAfter = 'antes'; // ✅ ACTUALIZAR VARIABLE GLOBAL
    } else if (type === 'despues') {
        $('#btnGestionDespues').addClass('active');
        gestionStep = 'despues';
        photoTypeBeforeAfter = 'despues'; // ✅ ACTUALIZAR VARIABLE GLOBAL
    } else {
        $('#btnGestionMixto').addClass('active');
        gestionStep = 'antes'; // Comenzar con antes en modo mixto
        photoTypeBeforeAfter = 'antes'; // ✅ ACTUALIZAR VARIABLE GLOBAL
    }
    
    // Actualizar indicador
    updateGestionStatusIndicator();
    
    // Mostrar instrucciones según el modo
    if (type !== 'mixto') {
        showGestionInstructions(type);
    } else {
        showGestionInstructions('antes'); // Comenzar con antes
    }
    
    console.log(`📋 Modo gestión cambiado a: ${type}, step actual: ${gestionStep}, photoTypeBeforeAfter: ${photoTypeBeforeAfter}`);
}

// Actualizar indicador de estado
// ✅ MEJORADA: Actualizar indicador de estado
function updateGestionStatusIndicator() {
    const indicator = $('#gestionStatusIndicator');
    let text = '';
    let icon = '';
    
    if (gestionMode === 'mixto') {
        text = `Modo Mixto - Próxima: ${gestionStep === 'antes' ? 'ANTES' : 'DESPUÉS'}`;
        icon = gestionStep === 'antes' ? 'bi-arrow-up-right-square text-primary' : 'bi-arrow-down-left-square text-success';
    } else {
        text = `Modo ${gestionMode === 'antes' ? 'Solo ANTES' : 'Solo DESPUÉS'}`;
        icon = gestionMode === 'antes' ? 'bi-arrow-up-right-square text-primary' : 'bi-arrow-down-left-square text-success';
    }
    
    indicator.html(`
        <small>
            <i class="bi ${icon} me-1"></i> ${text}
        </small>
    `);
}

// Mostrar instrucciones para gestión
function showGestionInstructions(step) {
    let title = step === 'antes' ? '📸 Fotos del ANTES de la gestión' : '📸 Fotos del DESPUÉS de la gestión';
    let message = step === 'antes' 
        ? 'Toma fotos del estado actual del punto de venta ANTES de realizar la gestión'
        : 'Toma fotos del estado del punto de venta DESPUÉS de realizar la gestión';
    
    Swal.fire({
        title: title,
        html: `<div class="alert alert-info mb-3">${message}</div>
               <small class="text-muted">• Asegúrate de capturar todos los ángulos relevantes<br>
               • Las fotos deben ser claras y bien iluminadas<br>
               • Se recomienda tomar la misma cantidad de fotos para antes y después</small>`,
        icon: step === 'antes' ? 'info' : 'success',
        confirmButtonText: 'Entendido',
        allowOutsideClick: false
    });
}


// Renderizar preview especial para gestión
// ✅ NUEVA: Función para mostrar el preview de fotos de gestión
function renderGestionPreview() {
    const containerId = 'gestion-preview-container';
    let $container = $(`#${containerId}`);
    
    // Si no existe el contenedor, crearlo
    if ($container.length === 0) {
        const html = `
            <div class="row mt-3">
                <div class="col-12">
                    <div id="${containerId}" class="photo-preview-container">
                        <h6 class="text-muted mb-3">
                            <i class="bi bi-images me-2"></i>Fotos de Gestión
                        </h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-primary text-white">
                                        <h6 class="mb-0">
                                            <i class="bi bi-arrow-up-right-square me-1"></i> 
                                            Fotos del ANTES (${getGestionCount('antes')})
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row" id="gestion-antes-grid"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-success text-white">
                                        <h6 class="mb-0">
                                            <i class="bi bi-arrow-down-left-square me-1"></i> 
                                            Fotos del DESPUÉS (${getGestionCount('despues')})
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row" id="gestion-despues-grid"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Alerta de balance -->
                        <div class="alert alert-warning mb-3" id="gestion-balance-alert" style="display: none;">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <span id="gestion-balance-message"></span>
                        </div>
                        
                        <!-- Botones de acción -->
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" id="btnAddMasAntes" onclick="addMoreGestionPhotos('antes')">
                                <i class="bi bi-plus-circle me-1"></i> Agregar más fotos del ANTES
                            </button>
                            <button class="btn btn-success" id="btnAddMasDespues" onclick="addMoreGestionPhotos('despues')">
                                <i class="bi bi-plus-circle me-1"></i> Agregar más fotos del DESPUÉS
                            </button>
                            <button class="btn btn-warning" id="btnToggleGestionMode" onclick="toggleGestionMode()">
                                <i class="bi bi-shuffle me-1"></i> Cambiar modo: <span id="currentGestionMode">${gestionMode === 'mixto' ? 'Mixto' : gestionMode === 'antes' ? 'Solo ANTES' : 'Solo DESPUÉS'}</span>
                            </button>
                            <button class="btn btn-success" id="btnUploadGestion" onclick="uploadGestionPhotos()" ${(getGestionCount('antes') > 0 && getGestionCount('despues') > 0) ? '' : 'disabled'}>
                                <i class="bi bi-cloud-upload me-2"></i> Subir todas las fotos (${getTotalGestionCount()})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#additionalPhotosModal .modal-body').append(html);
        $container = $(`#${containerId}`);
    }
    
    // Renderizar fotos del antes
    const $antesGrid = $('#gestion-antes-grid');
    $antesGrid.empty();
    
    const antesPhotos = getGestionPhotos('antes');
    if (antesPhotos.length === 0) {
        $antesGrid.html(`
            <div class="col-12 text-center py-4">
                <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                <p class="text-muted mt-2">No hay fotos del ANTES</p>
            </div>
        `);
    } else {
        antesPhotos.forEach((photo, index) => {
            $antesGrid.append(renderGestionPhotoCard(photo, index, 'antes'));
        });
    }
    
    // Renderizar fotos del después
    const $despuesGrid = $('#gestion-despues-grid');
    $despuesGrid.empty();
    
    const despuesPhotos = getGestionPhotos('despues').slice().sort(function(a, b) {
            var ia = (a._pairedWithAntesIndex !== undefined) ? a._pairedWithAntesIndex : 999;
            var ib = (b._pairedWithAntesIndex !== undefined) ? b._pairedWithAntesIndex : 999;
            return ia - ib;
        });
    if (despuesPhotos.length === 0) {
        $despuesGrid.html(`
            <div class="col-12 text-center py-4">
                <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                <p class="text-muted mt-2">No hay fotos del DESPUÉS</p>
            </div>
        `);
    } else {
        despuesPhotos.forEach((photo, index) => {
            $despuesGrid.append(renderGestionPhotoCard(photo, index, 'despues'));
        });
    }
    
    // Actualizar alerta de balance
    updateGestionBalanceAlert();
    
    // Actualizar botón de subir
    updateUploadGestionButton();
}

// ✅ NUEVA: Función para renderizar tarjeta de foto de gestión
function renderGestionPhotoCard(photo, index, type) {
    return `
    <div class="col-6 col-md-4 mb-3 position-relative">
        <div class="card h-100 ${type === 'antes' ? 'border-primary' : 'border-success'}">
            <img src="${photo.url}" 
                 class="card-img-top" 
                 style="height: 100px; object-fit: cover;"
                 alt="Foto ${type} ${index + 1}">
            <div class="card-body p-2">
                <small class="text-muted d-block">
                    <i class="bi bi-clock me-1"></i>
                    ${new Date(photo.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </small>
                <span class="badge ${type === 'antes' ? 'bg-primary' : 'bg-success'} mt-1">
                    ${type === 'antes' ? 'ANTES' : 'DESPUÉS'}
                </span>
                <small class="text-muted d-block mt-1">
                    <i class="bi bi-${photo.source === 'camera_native' ? 'camera' : 'images'} me-1"></i> 
                    ${photo.source === 'camera_native' ? 'Cámara' : 'Galería'}
                </small>
            </div>
            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                    onclick="removeGestionPhoto(${index}, '${type}')"
                    style="width: 25px; height: 25px; padding: 0; border-radius: 50%;">
                <i class="bi bi-x" style="font-size: 0.8rem;"></i>
            </button>
        </div>
    </div>
    `;
}

// Funciones auxiliares para gestión
function getGestionPhotos(type) {
    return photoPreview['gestion'] && photoPreview['gestion'][type] ? photoPreview['gestion'][type] : [];
}

function getGestionCount(type) {
    return getGestionPhotos(type).length;
}

function getTotalGestionCount() {
    return getGestionCount('antes') + getGestionCount('despues');
}

function hasBothGestionTypes() {
    return getGestionCount('antes') > 0 && getGestionCount('despues') > 0;
}

function updateGestionBalanceAlert() {
    const antesCount = getGestionCount('antes');
    const despuesCount = getGestionCount('despues');
    const $alert = $('#gestion-balance-alert');
    const $message = $('#gestion-balance-message');
    
    if (antesCount === 0 && despuesCount === 0) {
        $alert.hide();
        return;
    }
    
    if (antesCount === despuesCount) {
        $alert.removeClass('alert-warning alert-danger').addClass('alert-success');
        $message.html(`<i class="bi bi-check-circle me-2"></i>¡Perfecto! Tienes la misma cantidad de fotos para antes y después.`);
        $alert.show();
    } else if (Math.abs(antesCount - despuesCount) === 1) {
        $alert.removeClass('alert-danger alert-success').addClass('alert-warning');
        if (antesCount > despuesCount) {
            $message.html(`<i class="bi bi-exclamation-triangle me-2"></i>Te falta 1 foto del DESPUÉS para igualar las fotos del ANTES.`);
        } else {
            $message.html(`<i class="bi bi-exclamation-triangle me-2"></i>Te falta 1 foto del ANTES para igualar las fotos del DESPUÉS.`);
        }
        $alert.show();
    } else {
        $alert.removeClass('alert-warning alert-success').addClass('alert-danger');
        const diff = Math.abs(antesCount - despuesCount);
        if (antesCount > despuesCount) {
            $message.html(`<i class="bi bi-exclamation-octagon me-2"></i>¡Atención! Te faltan ${diff} fotos del DESPUÉS para igualar las fotos del ANTES.`);
        } else {
            $message.html(`<i class="bi bi-exclamation-octagon me-2"></i>¡Atención! Te faltan ${diff} fotos del ANTES para igualar las fotos del DESPUÉS.`);
        }
        $alert.show();
    }
}

function updateUploadGestionButton() {
    const antesCount = getGestionCount('antes');
    const despuesCount = getGestionCount('despues');
    const $btn = $('#btnUploadGestion');
    
    if (antesCount === 0 || despuesCount === 0) {
        $btn.prop('disabled', true);
        $btn.html(`<i class="bi bi-cloud-upload me-2"></i> Necesitas fotos de ambos tipos`);
    } else if (antesCount !== despuesCount) {
        $btn.prop('disabled', true);
        const diff = Math.abs(antesCount - despuesCount);
        $btn.html(`<i class="bi bi-exclamation-triangle me-2"></i> ¡Faltan ${diff} fotos para igualar!`);
    } else {
        $btn.prop('disabled', false);
        $btn.html(`<i class="bi bi-cloud-upload me-2"></i> Subir todas las fotos (${antesCount + despuesCount})`);
    }
}

// Eliminar foto de gestión
function removeGestionPhoto(index, type) {
    console.log(`🗑️ Eliminando foto de gestión ${type} en índice ${index}`);
    
    const photos = getGestionPhotos(type);
    if (!photos || !photos[index]) {
        console.error(`❌ No se encontró la foto en índice ${index} del tipo ${type}`);
        return;
    }
    
    const photo = photos[index];
    if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
    deletePhotoFromDB(photo._idbId);
    photoPreview['gestion'][type].splice(index, 1);
    
    // Volver a renderizar
    renderGestionPreview();
    
    console.log(`✅ Foto eliminada. Nuevo conteo: ${getGestionCount('antes')} antes, ${getGestionCount('despues')} después`);
}

// Agregar más fotos de un tipo específico
function addMoreGestionPhotos(type) {
    console.log(`➕ Agregando más fotos del ${type}`);
    photoTypeBeforeAfter = type;
    currentPhotoType = 'gestion';
    
    // Abrir selector según el tipo
    if (type === 'antes') {
        $('#cameraInputPrecios').attr('capture', 'environment').click();
    } else {
        $('#galleryInputGestion').click();
    }
}


// Cambiar modo de gestión
function toggleGestionMode() {
    const modes = ['antes', 'despues', 'mixto'];
    const currentIdx = modes.indexOf(gestionMode);
    const newMode = modes[(currentIdx + 1) % modes.length];
    
    setGestionType(newMode);
    
    // Actualizar el texto del botón
    $('#currentGestionMode').text(
        newMode === 'antes' ? 'Solo ANTES' : 
        newMode === 'despues' ? 'Solo DESPUÉS' : 'Mixto'
    );
    
    console.log(`🔄 Modo de gestión cambiado a: ${newMode}`);
}

// Subir todas las fotos de gestión
// ✅ NUEVA: Subir todas las fotos de gestión
// ✅ ACTUALIZADA: Función principal para subir fotos de gestión
// ✅ CORREGIDO: Subir todas las fotos de gestión
async function uploadGestionPhotos() {
    if (getGestionCount('antes') === 0 || getGestionCount('despues') === 0) {
        Swal.fire('Error', 'Necesitas al menos una foto de antes y una de después', 'error');
        return;
    }
    if (getGestionCount('antes') !== getGestionCount('despues')) {
        Swal.fire('Error', 'Debes tener la misma cantidad de fotos para antes y después', 'error');
        return;
    }
    Swal.fire({
        title: 'Subiendo fotos de gestión...',
        html: `Preparando ${getTotalGestionCount()} fotos (${getGestionCount('antes')} antes + ${getGestionCount('despues')} después)`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    try {
        const formData = new FormData();
        formData.append('point_id', currentPoint.id);
        formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
        formData.append('visita_id', currentVisitaId);
        
        const antesPhotos = getGestionPhotos('antes');
        const despuesPhotos = getGestionPhotos('despues');
        
        antesPhotos.forEach((photo, index) => {
            formData.append(`antes_photos[]`, photo.file);
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`antes_lat_${index}`, photo.deviceGPS.lat);
                formData.append(`antes_lon_${index}`, photo.deviceGPS.lon);
                formData.append(`antes_alt_${index}`, photo.deviceGPS.alt || '');
            }
        });
        
        despuesPhotos.forEach((photo, index) => {
            formData.append(`despues_photos[]`, photo.file);
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`despues_lat_${index}`, photo.deviceGPS.lat);
                formData.append(`despues_lon_${index}`, photo.deviceGPS.lon);
                formData.append(`despues_alt_${index}`, photo.deviceGPS.alt || '');
            }
        });
        
        const result = await OfflineCache.submitWithCache(
            '/api/upload-gestion-photos',
            formData,
            {
                photoType: 'gestion',
                pointId: currentPoint ? currentPoint.id : '',
                visitaId: currentVisitaId,
                cedula: sessionStorage.getItem('merchandiser_cedula'),
                label: 'Gestión — ' + getTotalGestionCount() + ' fotos'
            }
        );
        Swal.close();

        if (result.cached) {
            photoPreview['gestion'] = { antes: [], despues: [] };
            $('#gestion-preview-container').remove();
            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión — fotos guardadas',
                html: `
                    <p>Las fotos de gestión se guardaron en tu dispositivo.</p>
                    <p class="text-muted">Se subirán automáticamente cuando tengas internet.</p>
                `,
                timer: 3000,
                showConfirmButton: false
            });
            setTimeout(() => { askMorePhotosForSameClient(); }, 3100);
            return;
        }

        const data = result.data;
       if (data.success) {
            // Limpiar SOLO gestión — NO tocar otros tipos
            getGestionPhotos('antes').forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            getGestionPhotos('despues').forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            photoPreview['gestion'] = { antes: [], despues: [] };
            clearTypeFromDB('gestion', 'antes');
            clearTypeFromDB('gestion', 'despues');
            Swal.fire({
                icon: 'success',
                title: '¡Fotos de gestión subidas!',
                html: `<p class="text-success"><i class="bi bi-check-circle me-1"></i>${data.total_successful || 0} fotos subidas correctamente</p>`,
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => {
                renderGestionPreview();
                askAnotherPhotoTypeAfterUpload();
            }, 2100);
        } else {
            Swal.fire('Error', data.message || 'Error al subir las fotos', 'error');
        }
    } catch (error) {
        Swal.close();
        console.error('Error al subir fotos:', error);
        Swal.fire('Error', 'Error de conexión al subir las fotos', 'error');
    }
}

// ✅ FUNCIÓN ACTUALIZADA: Subir fotos de gestión
async function proceedWithGestionUpload() {
    const antesCount = getGestionCount('antes');
    const despuesCount = getGestionCount('despues');
    const total = antesCount + despuesCount;
    
    Swal.fire({
        title: 'Subiendo fotos de gestión...',
        html: `Preparando ${total} fotos (${antesCount} antes + ${despuesCount} después)`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    try {
        const formData = new FormData();
        formData.append('point_id', currentPoint.id);
        formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
        formData.append('visita_id', currentVisitaId);
        
        // Agregar fotos del antes
        const antesPhotos = getGestionPhotos('antes');
        antesPhotos.forEach((photo, index) => {
            formData.append(`antes_photos[]`, photo.file);
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`antes_lat_${index}`, photo.deviceGPS.lat);
                formData.append(`antes_lon_${index}`, photo.deviceGPS.lon);
                formData.append(`antes_alt_${index}`, photo.deviceGPS.alt || '');
            }
        });
        
        // Agregar fotos del después
        const despuesPhotos = getGestionPhotos('despues');
        despuesPhotos.forEach((photo, index) => {
            formData.append(`despues_photos[]`, photo.file);
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`despues_lat_${index}`, photo.deviceGPS.lat);
                formData.append(`despues_lon_${index}`, photo.deviceGPS.lon);
                formData.append(`despues_alt_${index}`, photo.deviceGPS.alt || '');
            }
        });
        
        const result = await OfflineCache.submitWithCache(
            '/api/upload-gestion-photos',
            formData,
            {
                photoType: 'gestion',
                pointId: currentPoint ? currentPoint.id : '',
                visitaId: currentVisitaId,
                cedula: sessionStorage.getItem('merchandiser_cedula'),
                label: 'Gestión (proceed) — ' + total + ' fotos'
            }
        );
        Swal.close();

        if (result.cached) {
            antesPhotos.forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            despuesPhotos.forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            photoPreview['gestion'] = { antes: [], despues: [] };
            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión — fotos guardadas',
                html: `
                    <p>Las fotos de gestión se guardaron en tu dispositivo.</p>
                    <p class="text-muted">Se subirán automáticamente cuando tengas internet.</p>
                `,
                timer: 3000,
                showConfirmButton: false
            });
            setTimeout(() => {
                $('#gestion-preview-container').remove();
                askAnotherPhotoTypeAfterUpload();
            }, 3200);
            return;
        }

        const data = result.data;
        
        if (data.success) {
            // Liberar todas las URLs
            antesPhotos.forEach(photo => {
                if (photo.url && photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });
            despuesPhotos.forEach(photo => {
                if (photo.url && photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });
            
            // Limpiar preview
            photoPreview['gestion'] = {
                antes: [],
                despues: []
            };
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                html: `
                <p>${data.message}</p>
                <p class="text-success">
                    <i class="bi bi-check-circle me-1"></i>
                    ${data.total_successful || total} fotos subidas correctamente
                </p>
                ${data.antes_count ? `
                    <p class="text-info">
                        <i class="bi bi-arrow-up-right-square me-1"></i>
                        ANTES: ${data.antes_count} fotos
                    </p>
                ` : ''}
                ${data.despues_count ? `
                    <p class="text-success">
                        <i class="bi bi-arrow-down-left-square me-1"></i>
                        DESPUÉS: ${data.despues_count} fotos
                    </p>
                ` : ''}
                `,
                timer: 3000,
                showConfirmButton: false
            });
            
            // ✅ IMPORTANTE: NO cerrar el modal inmediatamente
            // En su lugar, después del éxito, preguntar si quiere otro tipo de foto
            setTimeout(() => {
                // Eliminar solo el contenedor de gestión
                if ($('#gestion-preview-container').length) {
                    $('#gestion-preview-container').remove();
                }
                
                // ✅ MOSTRAR LA MISMA PREGUNTA QUE PARA PRECIOS Y EXHIBICIONES
                askAnotherPhotoTypeAfterUpload();
            }, 3200);
            
        } else {
            Swal.fire('Error', data.message || 'Error al subir las fotos', 'error');
        }
    } catch (error) {
        Swal.close();
        console.error('Error al subir fotos:', error);
        Swal.fire('Error', 'Error de conexión al subir las fotos', 'error');
    }
}

// Preguntar al usuario qué tipo de foto quiere tomar (modo mixto)
// ✅ NUEVA: Preguntar al usuario qué tipo de foto quiere tomar (modo mixto)
function askGestionStep() {
    return new Promise((resolve) => {
        Swal.fire({
            title: '¿Qué tipo de foto quieres tomar?',
            html: `
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-primary btn-block" id="btnStepAntes">
                    <i class="bi bi-arrow-up-right-square me-2"></i>Fotos del ANTES
                </button>
                <button class="btn btn-success btn-block" id="btnStepDespues">
                    <i class="bi bi-arrow-down-left-square me-2"></i>Fotos del DESPUÉS
                </button>
                <button class="btn btn-secondary btn-block" id="btnStepCancelar">
                    <i class="bi bi-x-circle me-2"></i>Cancelar
                </button>
            </div>
            <small class="text-muted mt-3">Actualmente tienes: 
                ${getGestionCount('antes')} fotos del ANTES y 
                ${getGestionCount('despues')} fotos del DESPUÉS
            </small>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                $('#btnStepAntes').click(() => {
                    Swal.close();
                    resolve('antes');
                });
                $('#btnStepDespues').click(() => {
                    Swal.close();
                    resolve('despues');
                });
                $('#btnStepCancelar').click(() => {
                    Swal.close();
                    resolve(null);
                });
            }
        });
    });
}

async function askMaterialPOPStep() {
    return new Promise((resolve) => {
        Swal.fire({
            title: '¿Qué tipo de foto quieres tomar?',
            html: `
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-primary btn-block" id="btnStepAntesMP">
                    <i class="bi bi-arrow-up-right-square me-2"></i>Fotos del ANTES (opcional)
                </button>
                <button class="btn btn-success btn-block" id="btnStepDespuesMP">
                    <i class="bi bi-arrow-down-left-square me-2"></i>Fotos del DESPUÉS (obligatorio)
                </button>
                <button class="btn btn-secondary btn-block" id="btnStepCancelarMP">
                    <i class="bi bi-x-circle me-2"></i>Cancelar
                </button>
            </div>
            <small class="text-muted mt-3">Actualmente tienes: 
                ${getMaterialPOPCount('antes')} fotos del ANTES y 
                ${getMaterialPOPCount('despues')} fotos del DESPUÉS
            </small>
            `,
            showConfirmButton: false,
            allowOutsideClick: false,
            didOpen: () => {
                $('#btnStepAntesMP').click(() => {
                    Swal.close();
                    resolve('antes');
                });
                $('#btnStepDespuesMP').click(() => {
                    Swal.close();
                    resolve('despues');
                });
                $('#btnStepCancelarMP').click(() => {
                    Swal.close();
                    resolve(null);
                });
            }
        });
    });
}

// Handler para los inputs del modal guiado
$(document).on('change', '#guidedDespuesCamara, #guidedDespuesGaleria',
async function(e) {
    var file = e.target.files[0];
    if (!file || _guidedCurrentAntesIndex === null) return;

    var tipo      = _guidedCurrentType;
    var antesIdx  = _guidedCurrentAntesIndex;
    var deviceGPS = await captureMetadata();
    var ts        = new Date().toISOString();
    var fname     = tipo + '_despues_par' + antesIdx + '_' + Date.now() + '.jpg';

    var idbId = await persistPhotoToDB(
        tipo, 'despues', file,
        { deviceGPS: deviceGPS, source: 'guided', timestamp: ts, filename: fname }
    );

    var photoObj = {
        _idbId:                idbId,
        _pairedWithAntesIndex: antesIdx,
        file:                  file,
        url:                   URL.createObjectURL(file),
        type:                  tipo,
        subtype:               'despues',
        timestamp:             ts,
        deviceGPS:             deviceGPS,
        source:                'guided'
    };

    if (!photoPreview[tipo]) photoPreview[tipo] = { antes: [], despues: [] };

    // Si ya existía un después para este antes, reemplazarlo
    var existente = -1;
    for (var i = 0; i < photoPreview[tipo].despues.length; i++) {
        if (photoPreview[tipo].despues[i]._pairedWithAntesIndex === antesIdx) {
            existente = i; break;
        }
    }
    if (existente !== -1) {
        var vieja = photoPreview[tipo].despues[existente];
        if (vieja.url && vieja.url.startsWith('blob:')) URL.revokeObjectURL(vieja.url);
        deletePhotoFromDB(vieja._idbId);
        photoPreview[tipo].despues[existente] = photoObj;
    } else {
        photoPreview[tipo].despues.push(photoObj);
    }

    $(this).val('');
    _refreshGuidedModal();
});

// ✅ MANEJADOR ÚNICO Y COMPLETO - ELIMINA EL SEGUNDO HANDLER
$(document).on('change', '#cameraInputPrecios, #galleryInputPrecios, #galleryInputGestion, #galleryInputExhibiciones, #cameraInputMaterialPOP, #galleryInputMaterialPOP', async function(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const deviceGPS = await captureMetadata();
    const inputId = $(this).attr('id');
    const isCameraNative = inputId === 'cameraInputPrecios' || inputId === 'cameraInputMaterialPOP';
    const sourceType = isCameraNative ? 'camera_native' : 'gallery';

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // ── ACTIVACIÓN ───────────────────────────────────────────────
        if (currentPhotoType === 'activacion') {
            selectedPhotoFile = file;
            await uploadActivationPhoto();
            $(this).val('');
            return;
        }

        // ── DESACTIVACIÓN ────────────────────────────────────────────
        if (currentPhotoType === 'desactivacion') {
            Swal.fire({ title: 'Subiendo foto de desactivación...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
            const formData = new FormData();
            formData.append('photo', file);
            formData.append('point_id', currentPoint.id);
            formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
            formData.append('photo_type', 'desactivacion');
            if (currentRoute) formData.append('route_id', currentRoute.id);
            formData.append('lat', deviceGPS.lat || '');
            formData.append('lon', deviceGPS.lon || '');
            formData.append('alt', deviceGPS.alt || '');
            try {
    const result = await OfflineCache.submitWithCache('/api/upload-route-photos', formData, {
        photoType: 'desactivacion',
        pointId: currentPoint ? currentPoint.id : '',
        pointName: currentPoint ? currentPoint.name : '',
        cedula: sessionStorage.getItem('merchandiser_cedula'),
        label: 'Desactivación: ' + (currentPoint ? currentPoint.name : '')
    });
    Swal.close();

    if (result.cached) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin conexión',
            html: '<p>La foto se guardó localmente y se subirá automáticamente.</p>',
            confirmButtonText: 'Entendido'
        });
    } else if (!result.success) {
        // ── Error permanente del servidor (400, 404, etc.) ────────────
        const msg = (result.data && result.data.message) || 'No se pudo desactivar';
        
        // Si ya existe foto de desactivación, el punto ya está desactivado
        // Simplemente marcar como completado en el frontend
        if (msg.includes('Ya existe una foto de desactivación')) {
            Swal.fire({
                icon: 'info',
                title: 'Punto ya desactivado',
                text: 'Este punto ya tenía una foto de desactivación registrada.',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Error', msg, 'error');
        }
    } else {
        const data = result.data;
        if (data && data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Punto desactivado!',
                text: 'La foto fue subida correctamente.',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            Swal.fire('Error', (data && data.message) || 'No se pudo desactivar', 'error');
        }
    }
    if (currentRoute) loadRoutePoints(currentRoute.id);
    loadActivePoints(true);
} catch (err) {
    Swal.close();
    Swal.fire('Error', 'Error al subir la foto', 'error');
}
$(this).val('');
return;
        }

        // ── GESTIÓN ──────────────────────────────────────────────────
        if (currentPhotoType === 'gestion') {
            const currentStep = photoTypeBeforeAfter || 'despues';
            const compressedFile = await compressImage(file);
            const objectUrl = URL.createObjectURL(compressedFile);
            const fname = 'gestion_' + currentStep + '_' + Date.now() + '_' + i + '.jpg';
            const idbId = await persistPhotoToDB('gestion', currentStep, compressedFile, { deviceGPS, source: sourceType, timestamp: new Date().toISOString(), filename: fname });
            const photoObj = { _idbId: idbId, file: compressedFile, url: objectUrl, type: 'gestion', gestionType: currentStep, timestamp: new Date().toISOString(), deviceGPS, source: sourceType };
            if (!photoPreview['gestion']) photoPreview['gestion'] = { antes: [], despues: [] };
            photoPreview['gestion'][currentStep].push(photoObj);
            continue;
        }

        // ── MATERIAL POP ─────────────────────────────────────────────
        if (currentPhotoType === 'materialPOP') {
            const currentStep = photoTypeMaterialPOPBeforeAfter || 'despues';
            const objectUrl = URL.createObjectURL(file);
            const fname = 'materialpop_' + currentStep + '_' + Date.now() + '_' + i + '.jpg';
            const idbId = await persistPhotoToDB('materialPOP', currentStep, file, { deviceGPS, source: sourceType, timestamp: new Date().toISOString(), filename: fname });
            const photoObj = { _idbId: idbId, file, url: objectUrl, type: 'materialPOP', materialPOPType: currentStep, timestamp: new Date().toISOString(), deviceGPS, source: sourceType };
            if (!photoPreview['materialPOP']) photoPreview['materialPOP'] = { antes: [], despues: [] };
            photoPreview['materialPOP'][currentStep].push(photoObj);
            continue;
        }

        // ── PRECIOS / EXHIBICIONES ────────────────────────────────────
        // ── PRECIOS ───────────────────────────────────────────────────
        if (currentPhotoType === 'precios') {
            const objectUrl = URL.createObjectURL(file);
            const fname = 'precios_' + Date.now() + '_' + i + '.jpg';
            const idbId = await persistPhotoToDB('precios', 'default', file, { deviceGPS, source: sourceType, timestamp: new Date().toISOString(), filename: fname });
            if (!photoPreview['precios']) photoPreview['precios'] = [];
            photoPreview['precios'].push({ _idbId: idbId, file, url: objectUrl, type: 'precios', timestamp: new Date().toISOString(), deviceGPS, source: sourceType });
            continue;
        }

        // ── EXHIBICIONES ──────────────────────────────────────────────
        if (currentPhotoType === 'exhibiciones') {
            const currentStep = photoTypeBeforeAfter || 'despues';
            const objectUrl = URL.createObjectURL(file);
            const fname = 'exhibiciones_' + currentStep + '_' + Date.now() + '_' + i + '.jpg';
            const idbId = await persistPhotoToDB('exhibiciones', currentStep, file, { deviceGPS, source: sourceType, timestamp: new Date().toISOString(), filename: fname });
            if (!photoPreview['exhibiciones']) photoPreview['exhibiciones'] = { antes: [], despues: [] };
            photoPreview['exhibiciones'][currentStep].push({ _idbId: idbId, file, url: objectUrl, type: 'exhibiciones', subtype: currentStep, timestamp: new Date().toISOString(), deviceGPS, source: sourceType });
        }
    }

    // Renderizar al final del loop
    if (currentPhotoType === 'gestion') {
        renderGestionPreview();
    } else if (currentPhotoType === 'materialPOP') {
        renderMaterialPOPPreview();
    } else if (currentPhotoType === 'exhibiciones') {
        renderExhibicionesPreview();
    } else if (currentPhotoType === 'precios') {
        renderPhotoPreview('precios');
    }

    $(this).val('');
});

// En la sección de inicialización $(document).ready(), agrega:
// Configurar eventos para los botones de gestión
// $(document).on('click', '#btnUploadGestion', function() {
//     uploadGestionPhotos();
// });

$(document).on('click', '#btnToggleGestionMode', function() {
    toggleGestionMode();
});

function askAnotherPhotoTypeAfterUpload() {
    Swal.fire({
        title: '¿Otro tipo de foto?',
        text: '¿Quieres tomar fotos de otro tipo para este mismo cliente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, otro tipo',
        cancelButtonText: 'No, otro cliente',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // No es necesario hacer nada, el modal ya está abierto
            // El usuario puede seleccionar otro tipo de foto desde el modal
        } else {
            // Preguntar si quiere seleccionar otro cliente del mismo punto
            askAnotherClientAfterUpload();
        }
    });
}

// ✅ NUEVA: Función para preguntar si quiere seleccionar otro cliente
function askAnotherClientAfterUpload() {
    Swal.fire({
        title: '¿Otro cliente?',
        text: '¿Quieres seleccionar otro cliente de este mismo punto de interés?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, otro cliente',
        cancelButtonText: 'No, terminar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // IMPORTANTE: Resetear la visita actual para empezar de nuevo
            if (typeof PhotoPreviewStore !== 'undefined') PhotoPreviewStore.clearSession(getSessionKey()).catch(function(){});
            localStorage.removeItem('currentVisitaId');
            localStorage.removeItem('currentClientName');
            localStorage.removeItem('currentPointId');
            localStorage.removeItem('currentClientId');
            currentClientVisit = null;
            currentVisitaId = null;
            Object.keys(photoPreview).forEach(type => {
                if (type === 'gestion' || type === 'materialPOP' || type === 'exhibiciones') {
                    photoPreview[type] = { antes: [], despues: [] };
                } else {
                    photoPreview[type] = [];
                }
            });
            
            $('#additionalPhotosModal').modal('hide');
            
            // Volver a mostrar el modal de selección de clientes después de un breve retraso
            setTimeout(() => {
                showClientSelectionModal();
            }, 500);
        } else {
            // Volver a la lista de puntos
            Swal.fire({
                icon: 'success',
                title: '¡Listo!',
                text: 'Has completado todas las fotos para este punto',
                timer: 1500,
                showConfirmButton: false
            });
            
            // Cerrar el modal
            $('#additionalPhotosModal').modal('hide');
            
            // Resetear las variables de visita
            if (typeof PhotoPreviewStore !== 'undefined') PhotoPreviewStore.clearSession(getSessionKey()).catch(function(){});
            localStorage.removeItem('currentVisitaId');
            localStorage.removeItem('currentClientName');
            localStorage.removeItem('currentPointId');
            localStorage.removeItem('currentClientId');
            currentClientVisit = null;
            currentVisitaId = null;
            Object.keys(photoPreview).forEach(type => {
                if (type === 'gestion' || type === 'materialPOP' || type === 'exhibiciones') {
                    photoPreview[type] = { antes: [], despues: [] };
                } else {
                    photoPreview[type] = [];
                }
            });
            
            // Recargar los puntos de la ruta actual
            
            // Recargar los puntos de la ruta actual
            if (currentRoute) {
                setTimeout(() => {
                    loadRoutePoints(currentRoute.id);
                }, 1600);
            }
        }
    });
}


// Función específica para gestionar el flujo después de subir fotos de gestión
function askAnotherPhotoTypeForGestion() {
    Swal.fire({
        title: '¿Más fotos de gestión?',
        text: '¿Quieres tomar más fotos de gestión (antes y después) para este cliente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, más fotos de gestión',
        cancelButtonText: 'No, otro tipo de foto',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Volver a mostrar las opciones de gestión
            showGestionInstructions(gestionMode);
            renderGestionPreview();
        } else {
            // Preguntar si quiere hacer otro tipo de foto para el mismo cliente
            askAnotherPhotoType();
        }
    });
}

// Activar ruta (ya modificaste esta función)
function activarRuta(routeId, routeName, tipo) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) {
        Swal.fire('Error', 'Sesión no válida', 'error');
        return;
    }

    Swal.fire({
        title: tipo === 'fija' ? '¿Activar ruta?' : '¿Iniciar PDV Nuevo?',
        text: tipo === 'fija' ? `Estás a punto de activar la ruta: ${routeName}` : `Estás a punto de iniciar el registro de PDV nuevo en: ${routeName}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: tipo === 'fija' ? 'Sí, activar' : 'Sí, iniciar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: tipo === 'fija' ? 'Activando ruta...' : 'Iniciando PDV nuevo...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            fetch('/api/activar-ruta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Merchandiser-Cedula': cedula
                },
                body: JSON.stringify({
                    id_ruta: routeId,
                    tipo_activacion: tipo === 'fija' ? 'Mercaderista' : 'PDV Nuevo'
                }),
                credentials: 'include'
            })
            .then(res => res.json())
            .then(data => {
                Swal.close();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: tipo === 'fija' ? 'Ruta activada' : 'PDV Nuevo iniciado',
                        text: tipo === 'fija' ? 'Ahora puedes ver los puntos de la ruta' : 'Ahora puedes ver los puntos del PDV nuevo',
                        timer: 1500,
                        showConfirmButton: false
                    });

                    // Mostrar/ocultar botones
                    $(`#btn-activar-${routeId}`).addClass('d-none');
                    $(`#btn-ver-${routeId}`).removeClass('d-none');
                    $(`#btn-desactivar-${routeId}`).removeClass('d-none');
                } else {
                    Swal.fire('Error', data.message || 'No se pudo activar la ruta', 'error');
                }
            })
            .catch(err => {
                Swal.close();
                Swal.fire('Error', 'Error al activar la ruta', 'error');
            });
        }
    });
}

// Desactivar ruta (ya modificaste esta función)
function desactivarRuta(routeId, tipo) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) {
        Swal.fire('Error', 'Sesión no válida', 'error');
        return;
    }
    
    // Primero verificar si hay puntos activos
    Swal.fire({
        title: 'Verificando puntos...',
        text: 'Comprobando si hay puntos activos pendientes',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    fetch(`/api/route-active-points/${routeId}`, {
        method: 'GET',
        headers: {
            'X-Merchandiser-Cedula': cedula
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        Swal.close();
        
        if (!data.success) {
            Swal.fire('Error', data.error || 'Error al verificar puntos', 'error');
            return;
        }
        
        // Si hay puntos activos, mostrar advertencia
        if (data.puntos_activos > 0) {
            Swal.fire({
                title: '⚠️ Puntos activos pendientes',
                html: `
                    <div class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        <strong>No puedes ${tipo === 'fija' ? 'desactivar esta ruta' : 'finalizar el PDV'}</strong>
                        <p class="mt-2 mb-0">Tienes <strong>${data.puntos_activos} punto(s)</strong> activo(s) sin desactivar:</p>
                    </div>
                    <div class="alert alert-info mt-3">
                        <i class="bi bi-info-circle me-2"></i>
                        <p class="mb-0">Para ${tipo === 'fija' ? 'desactivar la ruta' : 'finalizar el PDV'}, primero debes:</p>
                        <ol class="mb-0 mt-2">
                            <li>Ir a la sección de "Puntos Activos"</li>
                            <li>Desactivar cada punto completando las tareas requeridas</li>
                            <li>Luego podrás ${tipo === 'fija' ? 'desactivar la ruta' : 'finalizar el PDV'}</li>
                        </ol>
                    </div>
                `,
                icon: 'warning',
                confirmButtonText: 'Entendido',
                confirmButtonColor: '#ffc107'
            });
            return;
        }
        
        // Si no hay puntos activos, proceder con la desactivación
        Swal.fire({
            title: tipo === 'fija' ? '¿Desactivar ruta?' : '¿Finalizar PDV?',
            text: tipo === 'fija' ? 'Esta acción finalizará el progreso de la ruta' : 'Esta acción finalizará el registro del PDV nuevo',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: tipo === 'fija' ? 'Sí, desactivar' : 'Sí, finalizar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: tipo === 'fija' ? 'Desactivando ruta...' : 'Finalizando PDV...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
                
                fetch('/api/desactivar-ruta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Merchandiser-Cedula': cedula
                    },
                    body: JSON.stringify({
                        id_ruta: routeId
                    }),
                    credentials: 'include'
                })
                .then(res => res.json())
                .then(data => {
                    Swal.close();
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: tipo === 'fija' ? 'Ruta desactivada' : 'PDV finalizado',
                            text: tipo === 'fija' ? 'El estado de la ruta ha sido actualizado' : 'El registro del PDV nuevo ha sido finalizado',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        // Volver al estado inicial
                        $(`#btn-activar-${routeId}`).removeClass('d-none');
                        $(`#btn-ver-${routeId}`).addClass('d-none');
                        $(`#btn-desactivar-${routeId}`).addClass('d-none');
                        
                        // Recargar rutas según el tipo actual
                        const cedulaReload = sessionStorage.getItem('merchandiser_cedula');
                        if (currentRouteType === 'fija') {
                            loadFixedRoutes(cedulaReload);
                        } else {
                            loadVariableRoutes(cedulaReload);
                        }
                        loadActivePoints();
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo desactivar la ruta', 'error');
                    }
                })
                .catch(err => {
                    Swal.close();
                    Swal.fire('Error', 'Error al desactivar la ruta', 'error');
                });
            }
        });
    })
    .catch(err => {
        Swal.close();
        console.error('Error al verificar puntos activos:', err);
        Swal.fire('Error', 'Error al verificar puntos activos', 'error');
    });
}

// ============================================================================
// 📡 INTEGRACIÓN CON OFFLINE CACHE — Reaccionar a sincronizaciones automáticas
// ============================================================================
window.addEventListener('offlinePhotoSynced', function(e) {
    var meta = e.detail && e.detail.meta ? e.detail.meta : {};
    console.log('[App] Foto sincronizada:', meta);

    // Si era una activación, recargar puntos activos por si quedaron pendientes
    if (meta.photoType === 'activacion') {
        loadActivePoints(true);
    }

    // Si era una desactivación, recargar la lista de puntos de la ruta
    if (meta.photoType === 'desactivacion' && currentRoute) {
        loadRoutePoints(currentRoute.id);
    }

    // Recargar puntos activos para todos los tipos (mantener UI consistente)
    loadActivePoints(true);
});

// ════════════════════════════════════════════════════════════
// MODAL GUIADO — Vincula cada foto ANTES con su DESPUÉS
// ════════════════════════════════════════════════════════════

function _getAntesByTipo(tipo) {
    if (tipo === 'gestion')      return getGestionPhotos('antes');
    if (tipo === 'exhibiciones') return getExhibicionesPhotos('antes');
    if (tipo === 'materialPOP')  return getMaterialPOPPhotos('antes');
    return [];
}

function _getDesuesByTipo(tipo) {
    if (tipo === 'gestion')      return getGestionPhotos('despues');
    if (tipo === 'exhibiciones') return getExhibicionesPhotos('despues');
    if (tipo === 'materialPOP')  return getMaterialPOPPhotos('despues');
    return [];
}

function abrirModalGuiado(tipo, modo) {
    _guidedCurrentType      = tipo;
    _guidedCurrentInputMode = modo;

    var $prev = $('#guidedModal');
    if ($prev.length) {
        var inst = bootstrap.Modal.getInstance($prev[0]);
        if (inst) inst.dispose();
        $prev.remove();
    }

    $('body').append(_buildGuidedModalHtml(tipo));

    var modal = new bootstrap.Modal(document.getElementById('guidedModal'), {
        backdrop: 'static',
        keyboard: false
    });
    modal.show();
}

function _buildGuidedModalHtml(tipo) {
    var antesPhotos   = _getAntesByTipo(tipo);
    var despuesPhotos = _getDesuesByTipo(tipo);

    var pairedMap = {};
    despuesPhotos.forEach(function(p) {
        if (p._pairedWithAntesIndex !== undefined) {
            pairedMap[p._pairedWithAntesIndex] = p;
        }
    });

    var completadas = Object.keys(pairedMap).length;
    var total       = antesPhotos.length;
    var pct         = total > 0 ? Math.round(completadas / total * 100) : 0;

    var titulos = { gestion: 'Gestión', exhibiciones: 'Exhibiciones', materialPOP: 'Material POP' };

    var cardsHtml = antesPhotos.map(function(antes, idx) {
        var paired    = pairedMap[idx];
        var tienePar  = !!paired;
        var borderCls = tienePar ? 'border-success' : 'border-warning';

        return (
            '<div class="col-6 col-md-4 mb-3">' +
            '<div class="card h-100 ' + borderCls + '">' +
            '<div class="position-relative">' +
            '<img src="' + antes.url + '" class="card-img-top" style="height:130px;object-fit:cover;">' +
            '<span class="badge bg-primary position-absolute top-0 start-0 m-1">Antes ' + (idx + 1) + '</span>' +
            (tienePar ? '<span class="badge bg-success position-absolute top-0 end-0 m-1"><i class="bi bi-check-circle-fill"></i></span>' : '') +
            '</div>' +
            (tienePar
                ? '<div class="p-1"><img src="' + paired.url + '" style="width:100%;height:65px;object-fit:cover;border-radius:4px;border:2px solid #28a745;"></div>'
                : '<div style="height:67px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.04);"><span class="text-muted small opacity-50">Sin después aún</span></div>') +
            '<div class="card-body p-2 d-grid gap-1">' +
            (tienePar
                ? '<button class="btn btn-outline-success btn-sm" onclick="guidedRetomar(' + idx + ')"><i class="bi bi-arrow-repeat me-1"></i>Retomar</button>'
                : '<button class="btn btn-success btn-sm" onclick="guidedTomarFoto(' + idx + ')"><i class="bi bi-camera me-1"></i>Tomar DESPUÉS</button>') +
            '</div>' +
            '</div></div>'
        );
    }).join('');

    return (
        '<div class="modal fade" id="guidedModal" tabindex="-1">' +
        '<div class="modal-dialog modal-xl modal-dialog-scrollable">' +
        '<div class="modal-content">' +
        '<div class="modal-header bg-success text-white">' +
        '<h5 class="modal-title"><i class="bi bi-camera me-2"></i>Fotos del DESPUÉS — ' + titulos[tipo] + '</h5>' +
        '<button type="button" class="btn-close btn-close-white" onclick="cerrarModalGuiado()"></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="alert alert-info py-2 mb-3"><i class="bi bi-hand-index me-2"></i>' +
        'Toca cada foto del ANTES para tomar su DESPUÉS. ' +
        '<strong>' + completadas + ' de ' + total + ' listas.</strong></div>' +
        '<div class="progress mb-3" style="height:10px;">' +
        '<div class="progress-bar bg-success" style="width:' + pct + '%;transition:width .3s;"></div>' +
        '</div>' +
        '<div class="row">' + cardsHtml + '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button class="btn btn-secondary" onclick="cerrarModalGuiado()"><i class="bi bi-x-circle me-1"></i>Cerrar</button>' +
        (completadas === total && total > 0
            ? '<button class="btn btn-success" onclick="cerrarModalGuiado()"><i class="bi bi-check-circle me-1"></i>¡Listo!</button>'
            : '') +
        '</div>' +
        '</div></div></div>'
    );
}

function guidedTomarFoto(antesIndex) {
    _guidedCurrentAntesIndex = antesIndex;
    if (_guidedCurrentInputMode === 'camara') {
        $('#guidedDespuesCamara').val('').click();
    } else {
        $('#guidedDespuesGaleria').val('').click();
    }
}

function guidedRetomar(antesIndex) {
    var despuesPhotos = _getDesuesByTipo(_guidedCurrentType);
    for (var i = 0; i < despuesPhotos.length; i++) {
        if (despuesPhotos[i]._pairedWithAntesIndex === antesIndex) {
            var p = despuesPhotos[i];
            if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
            deletePhotoFromDB(p._idbId);
            photoPreview[_guidedCurrentType].despues.splice(i, 1);
            break;
        }
    }
    guidedTomarFoto(antesIndex);
}

function cerrarModalGuiado() {
    var $m   = $('#guidedModal');
    var inst = bootstrap.Modal.getInstance($m[0]);
    if (inst) inst.hide();
    setTimeout(function() {
        $m.remove();
        if (_guidedCurrentType === 'gestion')      renderGestionPreview();
        if (_guidedCurrentType === 'exhibiciones') renderExhibicionesPreview();
        if (_guidedCurrentType === 'materialPOP')  renderMaterialPOPPreview();
    }, 300);
}

function _refreshGuidedModal() {
    var $m = $('#guidedModal');
    if (!$m.length) return;
    var newHtml = $(_buildGuidedModalHtml(_guidedCurrentType));
    $m.find('.modal-body').html(newHtml.find('.modal-body').html());
    $m.find('.modal-footer').html(newHtml.find('.modal-footer').html());
}// ════════════════════════════════════════════════════════════
// MODAL GUIADO — Vincula cada foto ANTES con su DESPUÉS
// ════════════════════════════════════════════════════════════

function _getAntesByTipo(tipo) {
    if (tipo === 'gestion')      return getGestionPhotos('antes');
    if (tipo === 'exhibiciones') return getExhibicionesPhotos('antes');
    if (tipo === 'materialPOP')  return getMaterialPOPPhotos('antes');
    return [];
}

function _getDesuesByTipo(tipo) {
    if (tipo === 'gestion')      return getGestionPhotos('despues');
    if (tipo === 'exhibiciones') return getExhibicionesPhotos('despues');
    if (tipo === 'materialPOP')  return getMaterialPOPPhotos('despues');
    return [];
}

function abrirModalGuiado(tipo, modo) {
    _guidedCurrentType      = tipo;
    _guidedCurrentInputMode = modo;

    var $prev = $('#guidedModal');
    if ($prev.length) {
        var inst = bootstrap.Modal.getInstance($prev[0]);
        if (inst) inst.dispose();
        $prev.remove();
    }

    $('body').append(_buildGuidedModalHtml(tipo));

    var modal = new bootstrap.Modal(document.getElementById('guidedModal'), {
        backdrop: 'static',
        keyboard: false
    });
    modal.show();
}

function _buildGuidedModalHtml(tipo) {
    var antesPhotos   = _getAntesByTipo(tipo);
    var despuesPhotos = _getDesuesByTipo(tipo);

    var pairedMap = {};
    despuesPhotos.forEach(function(p) {
        if (p._pairedWithAntesIndex !== undefined) {
            pairedMap[p._pairedWithAntesIndex] = p;
        }
    });

    var completadas = Object.keys(pairedMap).length;
    var total       = antesPhotos.length;
    var pct         = total > 0 ? Math.round(completadas / total * 100) : 0;

    var titulos = { gestion: 'Gestión', exhibiciones: 'Exhibiciones', materialPOP: 'Material POP' };

    var cardsHtml = antesPhotos.map(function(antes, idx) {
        var paired    = pairedMap[idx];
        var tienePar  = !!paired;
        var borderCls = tienePar ? 'border-success' : 'border-warning';

        return (
            '<div class="col-6 col-md-4 mb-3">' +
            '<div class="card h-100 ' + borderCls + '">' +
            '<div class="position-relative">' +
            '<img src="' + antes.url + '" class="card-img-top" style="height:130px;object-fit:cover;">' +
            '<span class="badge bg-primary position-absolute top-0 start-0 m-1">Antes ' + (idx + 1) + '</span>' +
            (tienePar ? '<span class="badge bg-success position-absolute top-0 end-0 m-1"><i class="bi bi-check-circle-fill"></i></span>' : '') +
            '</div>' +
            (tienePar
                ? '<div class="p-1"><img src="' + paired.url + '" style="width:100%;height:65px;object-fit:cover;border-radius:4px;border:2px solid #28a745;"></div>'
                : '<div style="height:67px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.04);"><span class="text-muted small opacity-50">Sin después aún</span></div>') +
            '<div class="card-body p-2 d-grid gap-1">' +
            (tienePar
                ? '<button class="btn btn-outline-success btn-sm" onclick="guidedRetomar(' + idx + ')"><i class="bi bi-arrow-repeat me-1"></i>Retomar</button>'
                : '<button class="btn btn-success btn-sm" onclick="guidedTomarFoto(' + idx + ')"><i class="bi bi-camera me-1"></i>Tomar DESPUÉS</button>') +
            '</div>' +
            '</div></div>'
        );
    }).join('');

    return (
        '<div class="modal fade" id="guidedModal" tabindex="-1">' +
        '<div class="modal-dialog modal-xl modal-dialog-scrollable">' +
        '<div class="modal-content">' +
        '<div class="modal-header bg-success text-white">' +
        '<h5 class="modal-title"><i class="bi bi-camera me-2"></i>Fotos del DESPUÉS — ' + titulos[tipo] + '</h5>' +
        '<button type="button" class="btn-close btn-close-white" onclick="cerrarModalGuiado()"></button>' +
        '</div>' +
        '<div class="modal-body">' +
        '<div class="alert alert-info py-2 mb-3"><i class="bi bi-hand-index me-2"></i>' +
        'Toca cada foto del ANTES para tomar su DESPUÉS. ' +
        '<strong>' + completadas + ' de ' + total + ' listas.</strong></div>' +
        '<div class="progress mb-3" style="height:10px;">' +
        '<div class="progress-bar bg-success" style="width:' + pct + '%;transition:width .3s;"></div>' +
        '</div>' +
        '<div class="row">' + cardsHtml + '</div>' +
        '</div>' +
        '<div class="modal-footer">' +
        '<button class="btn btn-secondary" onclick="cerrarModalGuiado()"><i class="bi bi-x-circle me-1"></i>Cerrar</button>' +
        (completadas === total && total > 0
            ? '<button class="btn btn-success" onclick="cerrarModalGuiado()"><i class="bi bi-check-circle me-1"></i>¡Listo!</button>'
            : '') +
        '</div>' +
        '</div></div></div>'
    );
}

function guidedTomarFoto(antesIndex) {
    _guidedCurrentAntesIndex = antesIndex;
    if (_guidedCurrentInputMode === 'camara') {
        $('#guidedDespuesCamara').val('').click();
    } else {
        $('#guidedDespuesGaleria').val('').click();
    }
}

function guidedRetomar(antesIndex) {
    var despuesPhotos = _getDesuesByTipo(_guidedCurrentType);
    for (var i = 0; i < despuesPhotos.length; i++) {
        if (despuesPhotos[i]._pairedWithAntesIndex === antesIndex) {
            var p = despuesPhotos[i];
            if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url);
            deletePhotoFromDB(p._idbId);
            photoPreview[_guidedCurrentType].despues.splice(i, 1);
            break;
        }
    }
    guidedTomarFoto(antesIndex);
}

function cerrarModalGuiado() {
    var $m   = $('#guidedModal');
    var inst = bootstrap.Modal.getInstance($m[0]);
    if (inst) inst.hide();
    setTimeout(function() {
        $m.remove();
        if (_guidedCurrentType === 'gestion')      renderGestionPreview();
        if (_guidedCurrentType === 'exhibiciones') renderExhibicionesPreview();
        if (_guidedCurrentType === 'materialPOP')  renderMaterialPOPPreview();
    }, 300);
}

function _refreshGuidedModal() {
    var $m = $('#guidedModal');
    if (!$m.length) return;
    var newHtml = $(_buildGuidedModalHtml(_guidedCurrentType));
    $m.find('.modal-body').html(newHtml.find('.modal-body').html());
    $m.find('.modal-footer').html(newHtml.find('.modal-footer').html());
}

function checkDesactivarButton(pointId) {
    const pointIdSafe = pointId.replace(/[^a-zA-Z0-9]/g, '_');
    const limpiezaChecked = document.getElementById(`limpieza_${pointIdSafe}`)?.checked || false;
    const fifoChecked = document.getElementById(`fifo_${pointIdSafe}`)?.checked || false;
    
    const btnDesactivar = document.getElementById(`btnDesactivar_${pointIdSafe}`);
    if (btnDesactivar) {
        // Habilitar solo si ambos están marcados
        btnDesactivar.disabled = !(limpiezaChecked && fifoChecked);
        
        // Cambiar estilo según el estado
        if (limpiezaChecked && fifoChecked) {
            btnDesactivar.classList.remove('btn-outline-danger');
            btnDesactivar.classList.add('btn-danger');
        } else {
            btnDesactivar.classList.remove('btn-danger');
            btnDesactivar.classList.add('btn-outline-danger');
        }
    }
}

// Función para cargar rutas según el tipo
function loadRoutes(tipo) {
    currentRouteType = tipo;
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    
    // Actualizar título de la página según el tipo
    if (tipo === 'fija') {
        document.title = 'Realizar Ruta - Mercaderista';
        $('.navbar-brand h1').html('<i class="bi bi-signpost me-2"></i>Realizar Ruta - <span id="merchandiserName">Cargando...</span>');
    } else {
        document.title = 'PDV Nuevo - Mercaderista';
        $('.navbar-brand h1').html('<i class="bi bi-plus-circle me-2"></i>PDV Nuevo - <span id="merchandiserName">Cargando...</span>');
    }
    
    // Cargar rutas según el tipo
    if (tipo === 'fija') {
        loadFixedRoutes(cedula);
    } else {
        loadVariableRoutes(cedula);
    }
    
    // También recargar puntos activos para mantener el estado consistente
    loadActivePoints();
}

// Cargar rutas variables
function loadVariableRoutes(cedula) {
    $.getJSON(`/api/merchandiser-variable-routes/${cedula}`)
    .done(routes => {
        renderRoutesCards(routes, 'variable');
        // También recargar puntos activos para mantener el estado consistente
        loadActivePoints();
    })
    .fail(() => {
        $('#rutasContainer').html(`
        <div class="alert alert-danger text-center">
            <i class="bi bi-exclamation-triangle"></i> Error al cargar las rutas variables
        </div>
        `);
    });
}


// ============================================================================
// FUNCIONES PARA MATERIAL POP
// ============================================================================

function setMaterialPOPType(type) {
    materialPOPMode = type;
    
    // Actualizar visualmente los botones
    $('#btnMaterialPOPAntes, #btnMaterialPOPDespues, #btnMaterialPOPMixto').removeClass('active');
    
    if (type === 'antes') {
        $('#btnMaterialPOPAntes').addClass('active');
        materialPOPStep = 'antes';
        photoTypeMaterialPOPBeforeAfter = 'antes';
    } else if (type === 'despues') {
        $('#btnMaterialPOPDespues').addClass('active');
        materialPOPStep = 'despues';
        photoTypeMaterialPOPBeforeAfter = 'despues';
    } else {
        $('#btnMaterialPOPMixto').addClass('active');
        materialPOPStep = 'despues'; // Comenzar con después en modo mixto
        photoTypeMaterialPOPBeforeAfter = 'despues';
    }
    
    updateMaterialPOPStatusIndicator();
    showMaterialPOPInstructions(type);
    
    console.log(`📋 Modo Material POP cambiado a: ${type}, step actual: ${materialPOPStep}`);
}

function updateMaterialPOPStatusIndicator() {
    const indicator = $('#materialPOPStatusIndicator');
    let text = '';
    let icon = '';
    
    if (materialPOPMode === 'mixto') {
        text = `Modo Mixto - Próxima: ${materialPOPStep === 'antes' ? 'ANTES' : 'DESPUÉS'}`;
        icon = materialPOPStep === 'antes' ? 'bi-arrow-up-right-square text-primary' : 'bi-arrow-down-left-square text-success';
    } else {
        text = `Modo ${materialPOPMode === 'antes' ? 'Solo ANTES' : 'Solo DESPUÉS'}`;
        icon = materialPOPMode === 'antes' ? 'bi-arrow-up-right-square text-primary' : 'bi-arrow-down-left-square text-success';
    }
    
    indicator.html(`<small><i class="bi ${icon} me-1"></i> ${text}</small>`);
}

function showMaterialPOPInstructions(step) {
    let title = step === 'antes' ? '📸 Fotos del ANTES del Material POP' : '📸 Fotos del DESPUÉS del Material POP';
    let message = step === 'antes' 
        ? 'Toma fotos del estado del Material POP ANTES de realizar cambios'
        : 'Toma fotos del estado del Material POP DESPUÉS de realizar cambios';
    
    Swal.fire({
        title: title,
        html: `<div class="alert alert-info mb-3">${message}</div>
               <small class="text-muted">• Asegúrate de capturar todos los ángulos relevantes<br>
               • Las fotos deben ser claras y bien iluminadas</small>`,
        icon: step === 'antes' ? 'info' : 'success',
        confirmButtonText: 'Entendido',
        allowOutsideClick: false
    });
}

function getMaterialPOPPhotos(type) {
    return photoPreview['materialPOP'] && photoPreview['materialPOP'][type] ? photoPreview['materialPOP'][type] : [];
}

function getMaterialPOPCount(type) {
    return getMaterialPOPPhotos(type).length;
}

function getTotalMaterialPOPCount() {
    return getMaterialPOPCount('antes') + getMaterialPOPCount('despues');
}

function renderMaterialPOPPreview() {
    const containerId = 'materialPOP-preview-container';
    let $container = $(`#${containerId}`);
    
    // Crear contenedor si no existe
    if ($container.length === 0) {
        const html = `
            <div class="row mt-3">
                <div class="col-12">
                    <div id="${containerId}" class="photo-preview-container">
                        <h6 class="text-muted mb-3">
                            <i class="bi bi-images me-2"></i>Fotos de Material POP
                        </h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-primary text-white">
                                        <h6 class="mb-0">
                                            <i class="bi bi-arrow-up-right-square me-1"></i> 
                                            Fotos del ANTES (${getMaterialPOPCount('antes')}) - OPCIONAL
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row" id="materialPOP-antes-grid"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header bg-success text-white">
                                        <h6 class="mb-0">
                                            <i class="bi bi-arrow-down-left-square me-1"></i> 
                                            Fotos del DESPUÉS (${getMaterialPOPCount('despues')}) - OBLIGATORIO
                                        </h6>
                                    </div>
                                    <div class="card-body">
                                        <div class="row" id="materialPOP-despues-grid"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Alerta informativa -->
                        <div class="alert alert-info mb-3">
                            <i class="bi bi-info-circle me-2"></i>
                            <span>Las fotos del ANTES son opcionales, pero las del DESPUÉS son obligatorias</span>
                        </div>
                        
                        <!-- Botones de acción -->
                        <div class="d-grid gap-2">
                            <button class="btn btn-primary" id="btnAddMasAntesMP" onclick="addMoreMaterialPOPPhotos('antes')">
                                <i class="bi bi-plus-circle me-1"></i> Agregar más fotos del ANTES (opcional)
                            </button>
                            <button class="btn btn-success" id="btnAddMasDespuesMP" onclick="addMoreMaterialPOPPhotos('despues')">
                                <i class="bi bi-plus-circle me-1"></i> Agregar más fotos del DESPUÉS
                            </button>
                            <button class="btn btn-warning" id="btnToggleMaterialPOPMode" onclick="toggleMaterialPOPMode()">
                                <i class="bi bi-shuffle me-1"></i> Cambiar modo: <span id="currentMaterialPOPMode">${materialPOPMode === 'mixto' ? 'Mixto' : materialPOPMode === 'antes' ? 'Solo ANTES' : 'Solo DESPUÉS'}</span>
                            </button>
                            <button class="btn btn-success" id="btnUploadMaterialPOP" onclick="uploadMaterialPOPPhotos()" ${getMaterialPOPCount('despues') > 0 ? '' : 'disabled'}>
                                <i class="bi bi-cloud-upload me-2"></i> Subir todas las fotos (${getTotalMaterialPOPCount()})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        $('#additionalPhotosModal .modal-body').append(html);
        $container = $(`#${containerId}`);
    }
    
    // Renderizar fotos del antes
    const $antesGrid = $('#materialPOP-antes-grid');
    $antesGrid.empty();
    
    const antesPhotos = getMaterialPOPPhotos('antes');
    if (antesPhotos.length === 0) {
        $antesGrid.html(`
            <div class="col-12 text-center py-4">
                <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                <p class="text-muted mt-2">No hay fotos del ANTES (opcional)</p>
            </div>
        `);
    } else {
        antesPhotos.forEach((photo, index) => {
            $antesGrid.append(renderMaterialPOPPhotoCard(photo, index, 'antes'));
        });
    }
    
    // Renderizar fotos del después
    const $despuesGrid = $('#materialPOP-despues-grid');
    $despuesGrid.empty();
    
    const despuesPhotos = getMaterialPOPPhotos('despues');
    if (despuesPhotos.length === 0) {
        $despuesGrid.html(`
            <div class="col-12 text-center py-4">
                <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
                <p class="text-muted mt-2">No hay fotos del DESPUÉS</p>
            </div>
        `);
    } else {
        despuesPhotos.forEach((photo, index) => {
            $despuesGrid.append(renderMaterialPOPPhotoCard(photo, index, 'despues'));
        });
    }
    
    updateUploadMaterialPOPButton();
}

function renderMaterialPOPPhotoCard(photo, index, type) {
    return `
    <div class="col-6 col-md-4 mb-3 position-relative">
        <div class="card h-100 ${type === 'antes' ? 'border-primary' : 'border-success'}">
            <img src="${photo.url}" 
                 class="card-img-top" 
                 style="height: 100px; object-fit: cover;"
                 alt="Foto ${type} ${index + 1}">
            <div class="card-body p-2">
                <small class="text-muted d-block">
                    <i class="bi bi-clock me-1"></i>
                    ${new Date(photo.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </small>
                <span class="badge ${type === 'antes' ? 'bg-primary' : 'bg-success'} mt-1">
                    ${type === 'antes' ? 'ANTES' : 'DESPUÉS'}
                </span>
            </div>
            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                    onclick="removeMaterialPOPPhoto(${index}, '${type}')"
                    style="width: 25px; height: 25px; padding: 0; border-radius: 50%;">
                <i class="bi bi-x" style="font-size: 0.8rem;"></i>
            </button>
        </div>
    </div>
    `;
}

function removeMaterialPOPPhoto(index, type) {
    const photos = getMaterialPOPPhotos(type);
    if (!photos || !photos[index]) return;
    
    const photo = photos[index];
    if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
    deletePhotoFromDB(photo._idbId);
    photoPreview['materialPOP'][type].splice(index, 1);
    renderMaterialPOPPreview();
}

function addMoreMaterialPOPPhotos(type) {
    photoTypeMaterialPOPBeforeAfter = type;
    currentPhotoType = 'materialPOP';
    
    if (type === 'antes') {
        $('#cameraInputMaterialPOP').attr('capture', 'environment').click();
    } else {
        $('#galleryInputMaterialPOP').click();
    }
}

function toggleMaterialPOPMode() {
    const modes = ['antes', 'despues', 'mixto'];
    const currentIdx = modes.indexOf(materialPOPMode);
    const newMode = modes[(currentIdx + 1) % modes.length];
    
    setMaterialPOPType(newMode);
    
    $('#currentMaterialPOPMode').text(
        newMode === 'antes' ? 'Solo ANTES' : 
        newMode === 'despues' ? 'Solo DESPUÉS' : 'Mixto'
    );
}

function updateUploadMaterialPOPButton() {
    const despuesCount = getMaterialPOPCount('despues');
    const $btn = $('#btnUploadMaterialPOP');
    
    if (despuesCount === 0) {
        $btn.prop('disabled', true);
        $btn.html(`<i class="bi bi-exclamation-triangle me-2"></i> Necesitas fotos del DESPUÉS`);
    } else {
        $btn.prop('disabled', false);
        $btn.html(`<i class="bi bi-cloud-upload me-2"></i> Subir todas las fotos (${getTotalMaterialPOPCount()})`);
    }
}

async function uploadMaterialPOPPhotos() {
    if (getMaterialPOPCount('despues') === 0) {
        Swal.fire('Error', 'Necesitas al menos una foto del DESPUÉS', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Subiendo fotos de Material POP...',
        html: `Preparando ${getTotalMaterialPOPCount()} fotos`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    try {
        const formData = new FormData();
        formData.append('point_id', currentPoint.id);
        formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
        formData.append('visita_id', currentVisitaId);
        
        const antesPhotos = getMaterialPOPPhotos('antes');
        const despuesPhotos = getMaterialPOPPhotos('despues');
        
        antesPhotos.forEach((photo, index) => {
            formData.append(`antes_photos[]`, photo.file);
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`antes_lat_${index}`, photo.deviceGPS.lat);
                formData.append(`antes_lon_${index}`, photo.deviceGPS.lon);
                formData.append(`antes_alt_${index}`, photo.deviceGPS.alt || '');
            }
        });
        
        despuesPhotos.forEach((photo, index) => {
            formData.append(`despues_photos[]`, photo.file);
            if (photo.deviceGPS && photo.deviceGPS.lat) {
                formData.append(`despues_lat_${index}`, photo.deviceGPS.lat);
                formData.append(`despues_lon_${index}`, photo.deviceGPS.lon);
                formData.append(`despues_alt_${index}`, photo.deviceGPS.alt || '');
            }
        });
        
        const result = await OfflineCache.submitWithCache(
            '/api/upload-materialpop-photos',
            formData,
            {
                photoType: 'materialPOP',
                pointId: currentPoint ? currentPoint.id : '',
                visitaId: currentVisitaId,
                cedula: sessionStorage.getItem('merchandiser_cedula'),
                label: 'Material POP — ' + getTotalMaterialPOPCount() + ' fotos'
            }
        );
        Swal.close();

        if (result.cached) {
            photoPreview['materialPOP'] = { antes: [], despues: [] };
            Swal.fire({
                icon: 'warning',
                title: 'Sin conexión — fotos guardadas',
                html: `
                    <p>Las fotos de Material POP se guardaron en tu dispositivo.</p>
                    <p class="text-muted">Se subirán automáticamente cuando tengas internet.</p>
                `,
                timer: 3000,
                showConfirmButton: false
            });
            setTimeout(() => {
                renderMaterialPOPPreview();
                askMorePhotosForSameClient();
            }, 3100);
            return;
        }

        const data = result.data;
        
        if (data.success) {
            // Limpiar SOLO materialPOP — NO tocar otros tipos
            getMaterialPOPPhotos('antes').forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            getMaterialPOPPhotos('despues').forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            photoPreview['materialPOP'] = { antes: [], despues: [] };
            clearTypeFromDB('materialPOP', 'antes');
            clearTypeFromDB('materialPOP', 'despues');
            Swal.fire({
                icon: 'success',
                title: '¡Fotos de Material POP subidas!',
                html: `<p class="text-success"><i class="bi bi-check-circle me-1"></i>${data.total_successful || 0} fotos subidas correctamente</p>`,
                timer: 2000,
                showConfirmButton: false
            });
            setTimeout(() => {
                renderMaterialPOPPreview();
                askAnotherPhotoTypeAfterUpload();
            }, 2100);
        } else {
            Swal.fire('Error', data.message || 'Error al subir las fotos', 'error');
        }
    } catch (error) {
        Swal.close();
        console.error('Error al subir fotos:', error);
        Swal.fire('Error', 'Error de conexión', 'error');
    }
}

// ============================================================================
// FUNCIONES PARA EXHIBICIONES (mismo patrón que Gestión)
// ============================================================================
function getExhibicionesPhotos(type) {
    return photoPreview['exhibiciones'] && photoPreview['exhibiciones'][type] ? photoPreview['exhibiciones'][type] : [];
}
function getExhibicionesCount(type) { return getExhibicionesPhotos(type).length; }
function getTotalExhibicionesCount() { return getExhibicionesCount('antes') + getExhibicionesCount('despues'); }

function renderExhibicionesPreview() {
    const containerId = 'exhibiciones-preview-container';
    let $container = $(`#${containerId}`);

    if ($container.length === 0) {
        const html = `
        <div class="row mt-3"><div class="col-12">
        <div id="${containerId}" class="photo-preview-container">
            <h6 class="text-muted mb-3"><i class="bi bi-images me-2"></i>Fotos de Exhibiciones</h6>
            <div class="row mb-3">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-primary text-white">
                            <h6 class="mb-0"><i class="bi bi-arrow-up-right-square me-1"></i> ANTES (<span id="exhib-antes-count">0</span>)</h6>
                        </div>
                        <div class="card-body"><div class="row" id="exhib-antes-grid"></div></div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h6 class="mb-0"><i class="bi bi-arrow-down-left-square me-1"></i> DESPUÉS (<span id="exhib-despues-count">0</span>)</h6>
                        </div>
                        <div class="card-body"><div class="row" id="exhib-despues-grid"></div></div>
                    </div>
                </div>
            </div>
            <div class="d-grid gap-2">
                <button class="btn btn-warning" id="btnUploadExhibiciones" onclick="uploadExhibicionesPhotos()" disabled>
                    <i class="bi bi-cloud-upload me-2"></i>Subir fotos de Exhibiciones (<span id="exhib-total-count">0</span>)
                </button>
            </div>
        </div></div></div>`;
        $('#additionalPhotosModal .modal-body').append(html);
    }

    const $antesGrid = $('#exhib-antes-grid');
    $antesGrid.empty();
    const antesPhotos = getExhibicionesPhotos('antes');
    if (antesPhotos.length === 0) {
        $antesGrid.html('<div class="col-12 text-center py-3"><p class="text-muted">Sin fotos del ANTES</p></div>');
    } else {
        antesPhotos.forEach((photo, index) => {
            $antesGrid.append(`
                <div class="col-6 col-md-4 mb-3 position-relative">
                    <div class="card h-100 border-primary">
                        <img src="${photo.url}" class="card-img-top" style="height:100px;object-fit:cover;">
                        <div class="card-body p-2">
                            <span class="badge bg-primary">ANTES</span>
                            <small class="text-muted d-block">${new Date(photo.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small>
                        </div>
                        <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" onclick="removeExhibicionesPhoto(${index},'antes')" style="width:25px;height:25px;padding:0;border-radius:50%;">
                            <i class="bi bi-x" style="font-size:.8rem;"></i>
                        </button>
                    </div>
                </div>`);
        });
    }

    const $despuesGrid = $('#exhib-despues-grid');
    $despuesGrid.empty();
    const despuesPhotos = getExhibicionesPhotos('despues');
    if (despuesPhotos.length === 0) {
        $despuesGrid.html('<div class="col-12 text-center py-3"><p class="text-muted">Sin fotos del DESPUÉS</p></div>');
    } else {
        despuesPhotos.forEach((photo, index) => {
            $despuesGrid.append(`
                <div class="col-6 col-md-4 mb-3 position-relative">
                    <div class="card h-100 border-success">
                        <img src="${photo.url}" class="card-img-top" style="height:100px;object-fit:cover;">
                        <div class="card-body p-2">
                            <span class="badge bg-success">DESPUÉS</span>
                            <small class="text-muted d-block">${new Date(photo.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small>
                        </div>
                        <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" onclick="removeExhibicionesPhoto(${index},'despues')" style="width:25px;height:25px;padding:0;border-radius:50%;">
                            <i class="bi bi-x" style="font-size:.8rem;"></i>
                        </button>
                    </div>
                </div>`);
        });
    }

    $('#exhib-antes-count').text(antesPhotos.length);
    $('#exhib-despues-count').text(despuesPhotos.length);
    $('#exhib-total-count').text(getTotalExhibicionesCount());
    $('#btnUploadExhibiciones').prop('disabled', getTotalExhibicionesCount() === 0);
}

function removeExhibicionesPhoto(index, type) {
    const photos = getExhibicionesPhotos(type);
    if (!photos || !photos[index]) return;
    const photo = photos[index];
    if (photo.url && photo.url.startsWith('blob:')) URL.revokeObjectURL(photo.url);
    deletePhotoFromDB(photo._idbId);
    photoPreview['exhibiciones'][type].splice(index, 1);
    renderExhibicionesPreview();
}

async function uploadExhibicionesPhotos() {
    if (getTotalExhibicionesCount() === 0) { Swal.fire('Error', 'No hay fotos para subir', 'error'); return; }

    Swal.fire({ title: 'Subiendo fotos de Exhibiciones...', html: `Preparando ${getTotalExhibicionesCount()} fotos`, allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('point_id', currentPoint.id);
    formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
    formData.append('visita_id', currentVisitaId);
    formData.append('photo_type', 'exhibiciones');

    const antesPhotos = getExhibicionesPhotos('antes');
    const despuesPhotos = getExhibicionesPhotos('despues');
    const allPhotos = antesPhotos.concat(despuesPhotos);

    allPhotos.forEach((photo, index) => {
        formData.append('photos', photo.file);
        if (photo.deviceGPS && photo.deviceGPS.lat) {
            formData.append(`lat_${index}`, photo.deviceGPS.lat);
            formData.append(`lon_${index}`, photo.deviceGPS.lon);
            formData.append(`alt_${index}`, photo.deviceGPS.alt || '');
        }
    });

    try {
        const result = await OfflineCache.submitWithCache('/api/upload-multiple-additional-photos', formData, {
            photoType: 'exhibiciones', pointId: currentPoint ? currentPoint.id : '',
            visitaId: currentVisitaId, cedula: sessionStorage.getItem('merchandiser_cedula'),
            label: 'Exhibiciones — ' + getTotalExhibicionesCount() + ' fotos'
        });
        Swal.close();

        if (result.cached) {
            antesPhotos.concat(despuesPhotos).forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            photoPreview['exhibiciones'] = { antes: [], despues: [] };
            clearTypeFromDB('exhibiciones', 'antes');
            clearTypeFromDB('exhibiciones', 'despues');
            Swal.fire({ icon: 'warning', title: 'Sin conexión — fotos guardadas', html: '<p>Se subirán automáticamente con internet.</p>', timer: 3000, showConfirmButton: false });
            setTimeout(() => { renderExhibicionesPreview(); askAnotherPhotoTypeAfterUpload(); }, 3100);
            return;
        }

        const data = result.data;
        if (data.success) {
            antesPhotos.concat(despuesPhotos).forEach(p => { if (p.url && p.url.startsWith('blob:')) URL.revokeObjectURL(p.url); });
            photoPreview['exhibiciones'] = { antes: [], despues: [] };
            clearTypeFromDB('exhibiciones', 'antes');
            clearTypeFromDB('exhibiciones', 'despues');
            Swal.fire({
                icon: 'success', title: '¡Fotos de Exhibiciones subidas!',
                html: `<p class="text-success"><i class="bi bi-check-circle me-1"></i>${data.total_successful || 0} fotos subidas correctamente</p>`,
                timer: 2000, showConfirmButton: false
            });
            setTimeout(() => { renderExhibicionesPreview(); askAnotherPhotoTypeAfterUpload(); }, 2100);
        } else {
            Swal.fire('Error', data.message || 'Error al subir', 'error');
        }
    } catch (e) {
        Swal.close();
        Swal.fire('Error', 'Error de conexión', 'error');
    }
}

