// Variables globales actualizadas
let currentRoute = null;
let currentPoint = null;
let selectedPhotoFile = null;
let currentPhotoType = null;
let stream = null;
let currentCamera = 'environment';
let isCameraReady = false;

// Inicialización
$(document).ready(function () {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name');

    if (!cedula) {
        window.location.href = '/login-mercaderista';
        return;
    }

    $('#merchandiserName').text(nombre);
    loadFixedRoutes(cedula);
    
    // Configurar eventos del modal de activación
    setupActivationModal();
});

// Configurar eventos del modal de activación
function setupActivationModal() {
    // Configurar botón de subir foto
    document.getElementById('confirmUploadBtn')?.addEventListener('click', function() {
        uploadActivationPhoto();
    });
    
    // Detener la cámara cuando se cierra el modal
    $('#activacionModal').on('hidden.bs.modal', function () {
        stopCamera();
        resetActivationModal();
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

    $.getJSON(`/api/route-points1/${routeId}?cedula=${cedula}`)
        .done(renderRoutePoints)
        .fail(() => {
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
                    <button class="btn ${isActivated ? 'btn-outline-success' : 'btn-primary'} btn-sm"
                            onclick="activarPunto('${point.id}', '${point.nombre.replace(/'/g, "\\'")}', '${point.cliente_nombre ? point.cliente_nombre.replace(/'/g, "\\'") : 'Cliente'}')"
                            ${isActivated ? 'disabled' : ''}>
                        <i class="bi bi-camera me-1"></i>${isActivated ? 'Activado' : 'Activar'}
                    </button>
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

  // Rellenar info en el modal
  $('#modalPuntoNombre').text(pointName);
  $('#modalClientePunto').text(clientName);
  if (currentRoute) {
    $('#modalRutaActiva').text(currentRoute.name);
  }

  // Mostrar modal y abrir cámara
  $('#activacionModal').modal('show');
  setTimeout(() => {
    startCamera();
  }, 500);
}

// Resetear el modal de activación
function resetActivationModal() {
    // Ocultar vista previa y mostrar cámara
    $('#photoPreviewContainer').hide();
    $('#confirmationMessage').hide();
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
    .then(function (mediaStream) {
      stream = mediaStream;
      video.srcObject = mediaStream;

      video.onloadedmetadata = function () {
        video.play()
          .then(() => {
            $('#cameraLoading').hide();
            $('#cameraLive').show();
            $('#cameraControls').show();
            isCameraReady = true;
            $('#btnTakePhoto').prop('disabled', false).html('<i class="bi bi-camera"></i> Tomar Foto');
          })
          .catch(err => {
            console.error("Error al reproducir video:", err);
            showCameraError();
          });
      };
    })
    .catch(function (err) {
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

  canvas.toBlob(function (blob) {
    if (blob) {
      selectedPhotoFile = new File([blob], `activacion_${Date.now()}.jpg`, { type: 'image/jpeg' });

      const imageUrl = URL.createObjectURL(blob);
      $('#previewImage').attr('src', imageUrl);
      $('#cameraControls').hide();
      $('#photoPreviewContainer').show();
    }
  }, 'image/jpeg', 0.95);
}

// Cambiar entre cámaras
function switchCamera() {
    currentCamera = currentCamera === 'environment' ? 'user' : 'environment';
    
    // Actualizar texto del botón
    $('#btnSwitchCamera').html(
        currentCamera === 'environment' 
            ? '<i class="bi bi-camera-video"></i> Cambiar a Frontal' 
            : '<i class="bi bi-camera-video"></i> Cambiar a Trasera'
    );
    
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

// Subir foto
function uploadActivationPhoto() {
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
  const formData = new FormData();
  formData.append('photo', selectedPhotoFile);
  formData.append('point_id', currentPoint.id);
  formData.append('cedula', cedula);
  if (currentRoute) {
    formData.append('route_id', currentRoute.id);
  }

  fetch('/api/upload-activation-photo', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      Swal.close();
      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: data.message,
          timer: 2000,
          showConfirmButton: false
        });
        $('#activacionModal').modal('hide');
        if (currentRoute) {
          loadRoutePoints(currentRoute.id);
        }
        setTimeout(() => {
          $('#fotosAdicionalesModal').modal('show');
        }, 1500);
      } else {
        Swal.fire('Error', data.message, 'error');
      }
    })
    .catch(err => {
      Swal.close();
      Swal.fire('Error', 'Error al subir la foto', 'error');
    });
}

// Eventos del modal
$('#activacionModal').on('hidden.bs.modal', function () {
  stopCamera();
  resetCameraModal();
});

// Botón confirmar subida
document.getElementById('confirmUploadBtn')?.addEventListener('click', uploadActivationPhoto);


// Abrir modal para subir fotos adicionales
function openPhotoUpload(photoType) {
    currentPhotoType = photoType;
    
    // Configurar el modal según el tipo de foto
    const titles = {
        'precios': 'Subir Foto de Precios',
        'gestion': 'Subir Foto de Gestión',
        'exhibiciones': 'Subir Foto de Exhibiciones'
    };
    
    $('#photoUploadTitle').text(titles[photoType] || 'Subir Foto');
    $('#photoUploadHeader').removeClass().addClass(`modal-header bg-${photoType === 'precios' ? 'primary' : photoType === 'gestion' ? 'warning' : 'info'} text-white`);
    
    $('#photoUploadModal').modal('show');
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

// Mostrar botón de cambiar cámara
$('#btnSwitchCamera').show();

$('#activacionModal').modal('show');

// 🔥 Fuerza pantalla completa
$('#activacionModal').addClass('fullscreen-camera');