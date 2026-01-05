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
    loadActivePoints(); // <-- NUEVA LÍNEA - Cargar puntos activos al iniciar
    
    // Configurar eventos del modal de activación
    setupActivationModal();
    
    // Botones de Precios
    $('#btnPrecios').click(function () {
        currentPhotoType = 'precios';
        $('#cameraInputPrecios').click(); // Abre cámara
    });

    $('#btnPrecios1').click(function () {
        currentPhotoType = 'precios';
        $('#galleryInputPrecios').click(); // Abre galería
    });
        
    // Botones de Gestión
    $('#btnGestion').click(function () {
        currentPhotoType = 'gestion';
        $('#cameraInputPrecios').click();
    });

    $('#btnGestion1').click(function () {
        currentPhotoType = 'gestion';
        $('#galleryInputPrecios').click();
    });
        
    // Botones de Exhibiciones
    $('#btnExhibiciones').click(function () {
        currentPhotoType = 'exhibiciones';
        $('#cameraInputPrecios').click();
    });

    $('#btnExhibiciones1').click(function () {
        currentPhotoType = 'exhibiciones';
        $('#galleryInputPrecios').click();
    });

    // Agregar evento para el botón de actualizar puntos activos
    $('#refreshActivePointsBtn').click(function() {
        loadActivePoints();
    });
    
    // Modificar el evento de cierre del modal de fotos adicionales
    $('#additionalPhotosModal').on('hidden.bs.modal', function() {
        // Limpiar selección de cliente actual
        currentClientVisit = null;
        currentVisitaId = null;
        // También limpiar activation data por si acaso
        currentActivationData = null;
        
        // Recargar puntos activos para actualizar el estado
        loadActivePoints();
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

// Tomar foto desde la cámara
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
    
    canvas.toBlob(function(blob) {
        if (blob) {
                        // Array para guardar fotos por tipo
            if (!window.photosPreview) window.photosPreview = {};
            if (!window.photosPreview[currentPhotoType]) window.photosPreview[currentPhotoType] = [];

            const file = new File([blob], `${currentPhotoType}_${Date.now()}.jpg`, { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);

            window.photosPreview[currentPhotoType].push({
                file: file,
                url: imageUrl
            });

            renderPhotosPreview(currentPhotoType);
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
function selectClient(clientId, clientName) {
    // 🔴 VERIFICACIÓN CRÍTICA
    if (!currentActivationData || !currentActivationData.id_foto) {
        Swal.fire({
            icon: 'error',
            title: 'Error en los datos',
            text: 'No hay datos de activación válidos. Por favor, toma la foto de activación nuevamente.',
            confirmButtonText: 'Reintentar'
        }).then(() => {
            $('#clientSelectionModal').modal('hide');
            setTimeout(() => {
                $('#activacionModal').modal('show');
            }, 500);
        });
        return;
    }
    
    Swal.fire({
        title: 'Asignando cliente...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    console.log("📤 Enviando datos para asignar cliente:", {
        client_id: clientId,
        point_id: currentActivationData.point_id,
        mercaderista_id: currentActivationData.mercaderista_id,
        id_foto: currentActivationData.id_foto
    });
    
    fetch('/api/create-visit-from-activation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            client_id: clientId,
            point_id: currentActivationData.point_id,
            mercaderista_id: currentActivationData.mercaderista_id,
            id_foto: currentActivationData.id_foto
        }),
        credentials: 'include'
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error HTTP: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        Swal.close();
        if (data.success) {
            console.log("✅ Cliente asignado exitosamente:", data);
            
            // Guardar el id_visita
            currentClientVisit = {
                id: data.visita_id,
                client_id: clientId,
                client_name: clientName,
                point_id: currentActivationData.point_id,
                id_foto: currentActivationData.id_foto
            };
            
            // Limpiar los datos de activación
            currentActivationData = null;
            
            // Cerrar modal de selección
            $('#clientSelectionModal').modal('hide');
            
            // Mostrar modal para fotos adicionales por cliente
            setTimeout(() => {
                showAdditionalPhotosModal();
            }, 500);
        } else {
            Swal.fire('Error', data.message, 'error');
        }
    })
    .catch(err => {
        Swal.close();
        console.error('Error al asignar cliente:', err);
        Swal.fire('Error', `Error al asignar cliente: ${err.message}`, 'error');
    });
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

// Tomar foto para tipo específico
function takePhotoType() {
    const video = document.getElementById('photoCameraLive');
    const canvas = document.getElementById('photoCanvas');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(function(blob) {
        if (blob) {
            selectedPhotoFile = new File([blob], `${currentPhotoType}_${Date.now()}.jpg`, { type: 'image/jpeg' });

            const imageUrl = URL.createObjectURL(blob);
            $('#photoPreviewImage').attr('src', imageUrl);
            $('#photoCameraControls').hide();
            $('#photoPreviewContainer').show();
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
            Swal.fire({
                title: '¿Otra foto?',
                text: `¿Quieres tomar otra foto de ${currentPhotoType}?`,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, otra foto',
                cancelButtonText: 'No, finalizar',
                reverseButtons: true
            }).then((result) => {
                if (!result.isConfirmed) {
                    // Preguntar si quiere hacer otro tipo de foto para el mismo cliente
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
            // Volver a mostrar el modal de fotos adicionales
            $('#photoTypeModal').modal('hide');
            setTimeout(() => {
                showAdditionalPhotosModal();
            }, 500);
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
            
            // Volver a mostrar el modal de selección de clientes
            $('#photoTypeModal').modal('hide');
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
            
            $('#photoTypeModal').modal('hide');
            
            // Resetear las variables de visita
            currentClientVisit = null;
            currentVisitaId = null;
            
            // Recargar los puntos de la ruta actual
            if (currentRoute) {
                setTimeout(() => {
                    loadRoutePoints(currentRoute.id);
                }, 1600);
            }
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


// Cámara o galería para fotos adicionales
$(document).on('change', '#cameraInputPrecios', async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    selectedPhotoFile = file;

    // ✅ ACTIVACIÓN
    if (currentPhotoType === 'activacion') {
        await uploadActivationPhoto();   // ← ahora también es async
        $(this).val('');                 // limpia input
        return;
    }

    // ✅ DESACTIVACIÓN
    if (currentPhotoType === 'desactivacion') {
        Swal.fire({
            title: 'Subiendo foto de desactivación...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // ✅ Obtener GPS del dispositivo
        const gpsData = await captureMetadata();
        console.log("📍 GPS obtenido para desactivación:", gpsData);

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('point_id', currentPoint.id);
        formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
        formData.append('photo_type', 'desactivacion');
        if (currentRoute) formData.append('route_id', currentRoute.id);

        // ✅ Agregar GPS del dispositivo
        formData.append('lat', gpsData.lat || '');
        formData.append('lon', gpsData.lon || '');
        formData.append('alt', gpsData.alt || '');

        fetch('/api/upload-route-photos', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
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
        })
        .catch(err => {
            Swal.close();
            Swal.fire('Error', 'Error al subir la foto', 'error');
        });
        $(this).val('');
        return;
    }

    // ✅ Fotos adicionales (precios, gestión, exhibiciones) → preview
    const reader = new FileReader();
    reader.onload = function (event) {
        $('#photoPreviewImage').attr('src', event.target.result);
        $('#photoPreviewContainer').show();
        $('#photoCameraContainer').hide();
    };
    reader.readAsDataURL(file);
    $(this).val('');
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

function uploadAllPhotos(type) {
    const photos = window.photosPreview[type];
    if (!photos || photos.length === 0) return;

    Swal.fire({
        title: 'Subiendo fotos...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    let uploaded = 0;
    const total = photos.length;

    photos.forEach(photo => {
        const formData = new FormData();
        formData.append('photo', photo.file);
        formData.append('point_id', currentPoint.id);
        formData.append('cedula', sessionStorage.getItem('merchandiser_cedula'));
        formData.append('photo_type', type);
        formData.append('visita_id', currentVisitaId);

        fetch('/api/upload-additional-photo', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            uploaded++;
            if (data.success && uploaded === total) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Listo!',
                    text: `Se subieron ${total} foto(s) de ${type}`
                });

                // Limpiar preview
                window.photosPreview[type] = [];
                renderPhotosPreview(type);

                // Preguntar si quiere otro tipo
                askAnotherPhotoType();
            }
        })
        .catch(err => {
            uploaded++;
            if (uploaded === total) {
                Swal.fire('Error', 'Algunas fotos no se pudieron subir', 'error');
            }
        });
    });
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

let currentMeta = {}; // global dentro del módulo

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
function createVisitForActivePoint(pointId, routeId, clientId, clientName) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    
    Swal.fire({
        title: 'Creando visita...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    // Primero, obtener información del mercaderista
    fetch(`/api/merchandiser/${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(mercaderista => {
        if (!mercaderista || !mercaderista.id_mercaderista) {
            throw new Error('Mercaderista no encontrado');
        }
        
        const mercaderistaId = mercaderista.id_mercaderista;
        
        // Crear la visita
        fetch('/api/create-client-visit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                client_id: clientId,
                point_id: pointId,
                mercaderista_id: mercaderistaId,
                route_id: routeId
            }),
            credentials: 'include'
        })
        .then(response => response.json())
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
    })
    .catch(error => {
        Swal.close();
        console.error('Error al obtener mercaderista:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo obtener información del mercaderista'
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