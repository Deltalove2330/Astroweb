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
let currentActivationData = null;  // Para guardar datos de la activación
let currentMeta = {}; // global dentro del módulo
let photoPreview = {
    precios: [],
    gestion: {
        antes: [],    // ✅ Array separado para fotos del ANTES
        despues: []   // ✅ Array separado para fotos del DESPUÉS
    },
    exhibiciones: []
};
let currentPhotoGallery = [];
let gestionMode = 'despues'; // 'antes', 'despues', 'mixto'
let gestionStep = 'despues'; // Para modo mixto
let photoTypeBeforeAfter = 'despues'; // Tipo actual seleccionado (antes/despues)


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
    
    // Cargar ambas secciones: rutas fijas y puntos activos
    loadFixedRoutes(cedula);
    loadActivePoints();
    
    // Configurar eventos del modal de activación
    setupActivationModal();
    
    // Botones de Precios
    $('#btnPrecios_camara').click(function () {
        currentPhotoType = 'precios';
        $('#cameraInputPrecios').attr('capture', 'environment').click();
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
    $('#btnGestion_camara').click(function() {
        currentPhotoType = 'gestion';
        photoTypeBeforeAfter = gestionMode === 'mixto' ? gestionStep : gestionMode;
        $('#cameraInputPrecios').attr('capture', 'environment').click();
    });

    $('#btnGestion_gallery').click(function() {
        currentPhotoType = 'gestion';
        photoTypeBeforeAfter = gestionMode === 'mixto' ? gestionStep : gestionMode;
        $('#galleryInputGestion').click();
    });
        
    // Botones de Exhibiciones
    $('#btnExhibiciones_camara').click(function () {
        currentPhotoType = 'exhibiciones';
        $('#cameraInputPrecios').attr('capture', 'environment').click();
    });

    $('#btnExhibiciones_gallery').click(function () {
        currentPhotoType = 'exhibiciones';
        $('#galleryInputExhibiciones').click(); // Abre galería sin cámara
    });

    // Agregar evento para el botón de actualizar puntos activos
    $('#refreshActivePointsBtn').click(function() {
        loadActivePoints();
    });
    
$('#additionalPhotosModal').on('hidden.bs.modal', function() {
    // Solo limpiar si realmente vamos a terminar, no durante el flujo normal
    if (!sessionStorage.getItem('continuingVisit')) {
        // Limpiar selección de cliente actual
        currentClientVisit = null;
        currentVisitaId = null;
        // También limpiar activation data por si acaso
        currentActivationData = null;
        // Limpiar todos los previews
        Object.keys(photoPreview).forEach(type => {
            // Liberar todas las URLs
            photoPreview[type]?.forEach(photo => {
                if (photo.url && photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });
            photoPreview[type] = [];
        });
        // Limpiar contenedores
        $('.photo-preview-container').remove();
    }
    // Recargar puntos activos para actualizar el estado
    loadActivePoints();
});
    // Configurar el evento para cuando se cierra el modal de cámara
    $('#photoTypeModal').on('hidden.bs.modal', function() {
        stopPhotoTypeCamera();
        resetPhotoTypeCamera();
    });
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
        .done(renderRoutesCards)
        .fail(() => {
            $('#rutasContainer').html(`
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle"></i> Error al cargar las rutas asignadas
                </div>
            `);
        });
}

// Renderizar tarjetas de rutas
function renderRoutesCards(routes) {
    if (!routes || routes.length === 0) {
        $('#rutasContainer').html(`
            <div class="alert alert-info text-center">
                <i class="bi bi-signpost fs-1"></i>
                <p class="mt-3 mb-0">No tienes rutas fijas asignadas</p>
            </div>
        `);
        return;
    }
    
    let html = '<div class="row">';
    routes.forEach(route => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card route-card h-100">
                    <div class="card-header route-header text-white">
                        <h6 class="mb-0"><i class="bi bi-signpost me-2"></i>${route.nombre}</h6>
                    </div>
                    <div class="card-body">
                        <p class="mb-2"><strong>ID Ruta:</strong> ${route.id}</p>
                        <p class="mb-2"><strong>Puntos:</strong> ${route.total_puntos || 'N/A'}</p>
                        <div class="d-grid gap-2">
                            <button class="btn btn-outline-primary btn-sm" onclick="verPuntosRuta(${route.id}, '${route.nombre.replace(/'/g, "\\'")}')">
                                <i class="bi bi-pin-map me-2"></i>Ver Puntos
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
function verPuntosRuta(routeId, routeName) {
    currentRoute = { id: routeId, name: routeName };
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
    }, 'image/jpeg', 0.95);
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
    
    fetch('/api/upload-activation-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include'
    })
    .then(res => {
        console.log("📥 Respuesta HTTP recibida:", res.status, res.statusText);
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log("📦 Datos recibidos del servidor:", data);
        Swal.close();
        if (data.success) {
            // 🔴 CORRECCIÓN IMPORTANTE: Asegurar que id_foto está presente
            if (!data.id_foto) {
                console.error("❌ ERROR: data.id_foto es undefined o null", data);
                Swal.fire('Error', 'No se recibió ID de la foto del servidor. Datos: ' + JSON.stringify(data), 'error');
                return;
            }
            
            // Guardar TODOS los datos de la activación INCLUYENDO id_foto
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
            
            // Cerrar modal de activación
            $('#activacionModal').modal('hide');
            
            // Mostrar modal para seleccionar clientes
            setTimeout(() => {
                showClientSelectionModal();
            }, 1600);
        } else {
            console.error("❌ El servidor respondió con success=false:", data);
            Swal.fire('Error', data.message || 'Error desconocido', 'error');
        }
    })
    .catch(err => {
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
    }, 'image/jpeg', 0.95);
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

$('#additionalPhotosModal').on('hidden.bs.modal', function() {
    // Limpiar selección de cliente actual
    currentClientVisit = null;
    currentVisitaId = null;
    // También limpiar activation data por si acaso
    currentActivationData = null;
});

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
async function uploadAllPhotos(type) {
    const photos = photoPreview[type];
    if (!photos || photos.length === 0) {
        Swal.fire('Error', 'No hay fotos para subir', 'error');
        return;
    }
    
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
        const response = await fetch('/api/upload-multiple-additional-photos', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Limpiar el preview
            photoPreview[type] = [];
            // También liberar las URLs
            photos.forEach(photo => {
                if (photo.url && photo.url.startsWith('blob:')) {
                    URL.revokeObjectURL(photo.url);
                }
            });
            
            // Actualizar la vista
            renderPhotoPreview(type);
            
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                html: `
                    <p>${data.message}</p>
                    <p class="text-success">
                        <i class="bi bi-check-circle me-1"></i>
                        ${data.total_successful} fotos subidas correctamente
                    </p>
                    ${data.total_failed > 0 ? 
                        `<p class="text-warning">
                            <i class="bi bi-exclamation-triangle me-1"></i>
                            ${data.total_failed} fotos no se pudieron subir
                        </p>` : ''
                    }
                `,
                timer: 3000,
                showConfirmButton: false
            });
            
            // Limpiar preview de gestión
photoPreview['gestion'] = {
    antes: [],
    despues: []
};

// Eliminar el contenedor de preview
$('#gestion-preview-container').remove();

// No cerrar el modal, en su lugar preguntar si quiere más fotos
setTimeout(() => {
    // Mostrar mensaje de éxito pero mantener el modal abierto
    Swal.fire({
        icon: 'success',
        title: '¡Fotos subidas!',
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
        timer: 2500,
        showConfirmButton: false
    });
    
    // Preguntar consistentemente si quiere más fotos
    setTimeout(() => {
        askAnotherPhotoTypeForGestion();
    }, 2600);
}, 1000);
            
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
function loadActivePoints() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) {
        console.error("No hay cédula en sesión");
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
                    <div class="mt-3 text-end">
                        <button class="btn btn-outline-danger btn-sm" 
                                onclick="deactivatePointFromActive('${point.point_id}', '${point.point_name.replace(/'/g, "\\'")}')">
                            <i class="bi bi-power me-1"></i>Desactivar Punto
                        </button>
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
    Swal.fire({
        title: 'Desactivar punto',
        text: `¿Estás seguro de desactivar el punto ${pointName}? Esto finalizará todas las visitas pendientes.`,
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
        }
    });
}

// Función para abrir galería y seleccionar múltiples fotos
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
function renderPhotoPreview(type) {
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
    
    // Liberar el objeto URL
    URL.revokeObjectURL(photoPreview[type][index].url);
    
    // Eliminar del array
    photoPreview[type].splice(index, 1);
    
    // Re-renderizar
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
    
    const despuesPhotos = getGestionPhotos('despues');
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

// Renderizar tarjeta de foto para gestión
function renderGestionPhotoCard(photo, index, type) {
    return `
    <div class="col-4 mb-3 position-relative">
        <div class="card h-100 ${type === 'antes' ? 'border-primary' : 'border-success'}">
            <img src="${photo.url}" class="card-img-top" style="height: 120px; object-fit: cover;">
            <div class="card-body p-2">
                <small class="text-muted d-block">
                    <i class="bi bi-clock me-1"></i> ${new Date(photo.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </small>
                <span class="badge ${type === 'antes' ? 'bg-primary' : 'bg-success'} mt-1">
                    ${type === 'antes' ? 'ANTES' : 'DESPUÉS'}
                </span>
                <small class="text-muted d-block mt-1">
                    <i class="bi bi-${photo.source === 'camera_native' ? 'camera' : 'images'} me-1"></i> ${photo.source === 'camera_native' ? 'Cámara' : 'Galería'}
                </small>
            </div>
            <button class="btn btn-danger btn-sm position-absolute top-0 end-0 m-1" 
                    onclick="removeGestionPhoto(${index}, '${type}')"
                    style="width: 30px; height: 30px; padding: 0; border-radius: 50%;">
                <i class="bi bi-x"></i>
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
    
    // Liberar el objeto URL
    const photo = photos[index];
    if (photo.url && photo.url.startsWith('blob:')) {
        URL.revokeObjectURL(photo.url);
    }
    
    // Eliminar del array
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
        
        const response = await fetch('/api/upload-gestion-photos', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        const data = await response.json();
        Swal.close();
        if (data.success) {
            // ✅ NO CERRAR EL MODAL AQUÍ - Mantenerlo abierto para preguntar por más fotos
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
                    ${data.total_successful || getTotalGestionCount()} fotos subidas correctamente
                </p>
                `,
                timer: 2000,
                showConfirmButton: false
            });
            
            // ✅ Mantener el modal abierto y actualizar el preview
            setTimeout(() => {
                renderGestionPreview();
                // ✅ Preguntar si quiere más fotos del mismo tipo o de otro tipo
                askMorePhotosForSameClient();
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
        
        const response = await fetch('/api/upload-gestion-photos', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const data = await response.json();
        Swal.close();
        
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
// ✅ MANEJADOR ÚNICO Y COMPLETO - ELIMINA EL SEGUNDO HANDLER
$(document).on('change', '#cameraInputPrecios, #galleryInputPrecios, #galleryInputGestion, #galleryInputExhibiciones', async function(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Obtener GPS del dispositivo para usar si las fotos no tienen EXIF
    const deviceGPS = await captureMetadata();
    console.log("📍 GPS obtenido del dispositivo:", deviceGPS);

    // Procesar cada archivo (por si selecciona múltiples)
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const inputId = $(this).attr('id'); // Obtener el ID del input que disparó el evento
        
        // Identificar si es cámara nativa o galería
        const isCameraNative = inputId === 'cameraInputPrecios';
        const sourceType = isCameraNative ? 'camera_native' : 'gallery';
        
        // ✅ ACTIVACIÓN
        if (currentPhotoType === 'activacion') {
            selectedPhotoFile = file;
            await uploadActivationPhoto();
            continue; // Siguiente archivo
        }

        // ✅ DESACTIVACIÓN
        if (currentPhotoType === 'desactivacion') {
            Swal.fire({
                title: 'Subiendo foto de desactivación...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });

            const formData = new FormData();
            formData.append('photo', file);
            formData.append('point_id', currentPoint.id);
            formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
            formData.append('photo_type', 'desactivacion');
            if (currentRoute) formData.append('route_id', currentRoute.id);

            // ✅ Agregar GPS del dispositivo
            formData.append('lat', deviceGPS.lat || '');
            formData.append('lon', deviceGPS.lon || '');
            formData.append('alt', deviceGPS.alt || '');

            try {
                const response = await fetch('/api/upload-route-photos', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include'
                });
                const data = await response.json();
                
                Swal.close();
                if (data.success) {
                    Swal.fire({
                        icon: 'success',
                        title: '¡Punto desactivado!',
                        text: 'La foto de desactivación fue subida correctamente.'
                    });
                    if (currentRoute) loadRoutePoints(currentRoute.id);
                } else {
                    Swal.fire('Error', data.message || 'No se pudo desactivar', 'error');
                }
            } catch (err) {
                Swal.close();
                Swal.fire('Error', 'Error al subir la foto', 'error');
            }
            continue; // Siguiente archivo
        }

        // ✅ GESTIÓN CON SOPORTE PARA ANTES/DESPUÉS
// Dentro del manejador de cambio de archivos, en la sección de GESTIÓN:
        if (currentPhotoType === 'gestion') {
            // Determinar el tipo de foto (antes/después) según el modo actual
            let currentStep = photoTypeBeforeAfter || 'despues';
            
            console.log(`📸 Procesando foto de gestión. Modo: ${gestionMode}, Step: ${currentStep}`);
            
            // Si estamos en modo mixto y ya hay fotos, preguntar al usuario
            if (gestionMode === 'mixto' && hasBothGestionTypes()) {
                currentStep = await askGestionStep();
                if (!currentStep) {
                    console.log("❌ Usuario canceló la selección");
                    continue; // Usuario canceló la selección
                }
            }
            
            // Crear objeto URL para preview
            const objectUrl = URL.createObjectURL(file);
            
            // Crear objeto de foto CORREGIDO
            const photoObj = {
                file: file,
                url: objectUrl,
                type: 'gestion',
                gestionType: currentStep, // 'antes' o 'despues'
                timestamp: new Date().toISOString(),
                deviceGPS: deviceGPS,
                source: sourceType // 'camera_native' o 'gallery'
            };
            
            console.log(`✅ Foto de gestión creada:`, {
                gestionType: currentStep,
                timestamp: photoObj.timestamp,
                source: sourceType
            });
            
            // Inicializar el objeto si no existe
            if (!photoPreview['gestion']) {
                photoPreview['gestion'] = {
                    antes: [],
                    despues: []
                };
            }
            
            // Agregar al array correspondiente
            photoPreview['gestion'][currentStep].push(photoObj);
            
            // Si estamos en modo mixto, cambiar al siguiente paso
            if (gestionMode === 'mixto') {
                gestionStep = currentStep === 'antes' ? 'despues' : 'antes';
                photoTypeBeforeAfter = gestionStep;
                updateGestionStatusIndicator();
            }
            
            // Mostrar preview de gestión
            renderGestionPreview();
            
            continue; // Siguiente archivo
        }
        // ✅ Fotos adicionales (precios, exhibiciones) → PREVIEW
        // Crear objeto URL para preview
        const objectUrl = URL.createObjectURL(file);
        
        // Crear objeto de foto con timestamp actual
        const photoObj = {
            file: file,
            url: objectUrl,
            type: currentPhotoType,
            timestamp: new Date().toISOString(),
            deviceGPS: deviceGPS,
            source: sourceType // ✅ CORREGIDO: Usa la variable sourceType
        };
        
        // Agregar al preview
        if (!photoPreview[currentPhotoType]) {
            photoPreview[currentPhotoType] = [];
        }
        photoPreview[currentPhotoType].push(photoObj);
    }
    
    // Mostrar preview después de procesar todos los archivos
    if (currentPhotoType === 'gestion') {
        renderGestionPreview();
    } else if (currentPhotoType && currentPhotoType !== 'activacion' && currentPhotoType !== 'desactivacion') {
        renderPhotoPreview(currentPhotoType);
    }
    
    // Limpiar input para permitir nuevas capturas
    $(this).val('');
});

// En la sección de inicialización $(document).ready(), agrega:
// Configurar eventos para los botones de gestión
$(document).on('click', '#btnUploadGestion', function() {
    uploadGestionPhotos();
});

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
            currentClientVisit = null;
            currentVisitaId = null;
            // Limpiar todos los previews
            Object.keys(photoPreview).forEach(type => {
                if (type === 'gestion') {
                    photoPreview['gestion'] = { antes: [], despues: [] };
                } else {
                    photoPreview[type] = [];
                }
            });
            
            // Cerrar el modal de fotos adicionales
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
            currentClientVisit = null;
            currentVisitaId = null;
            
            // Limpiar todos los previews
            Object.keys(photoPreview).forEach(type => {
                if (type === 'gestion') {
                    photoPreview['gestion'] = { antes: [], despues: [] };
                } else {
                    photoPreview[type] = [];
                }
            });
            
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