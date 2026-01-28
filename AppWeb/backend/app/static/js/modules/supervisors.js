// /static/js/modules/supervisors.js
document.addEventListener('DOMContentLoaded', function() {
    // Función auxiliar para convertir rutas de archivo a URLs de imagen
    window.getImageUrl = function(filePath) {
        if (!filePath) return '';
        
        let cleanPath = filePath
            .replace(/\\/g, '/')  // Reemplazar barras invertidas por normales
            .replace("X://", "X:/")  // Asegurar formato consistente
            .replace(/\/+/g, '/');  // Eliminar barras dobles
        
        const encodedPath = encodeURIComponent(cleanPath)
            .replace(/%2F/g, '/');  // Mantener las barras como barras, no como %2F
        
        return `/api/image/${encodedPath}`;
    };

    // Variable para almacenar los detalles de la foto actual
    let currentPhotoDetails = null;
    
    // Variables globales para manejar la foto seleccionada
    let selectedPhotoFile = null;
    let currentPhotoId = null;
    let currentPointName = null;
    let currentClientName = null;
    
    // Función para mostrar foto en modal
    window.viewPhotoModal = function(photo) {
        currentPhotoDetails = photo;
        
        const modalPhoto = document.getElementById('modalPhoto');
        const photoDetails = document.getElementById('photoDetails');
        
        // Usar la función auxiliar para obtener la URL correcta
        modalPhoto.src = window.getImageUrl(photo.file_path);
        
        // Crear detalles de la foto
        let detailsHTML = `
            <h6>${photo.punto_de_interes}</h6>
            <p>
                <strong>Cliente:</strong> ${photo.cliente}<br>
                <strong>Ruta:</strong> ${photo.ruta}<br>
                <strong>Fecha:</strong> ${photo.fecha_visita}<br>
                <strong>Categoría:</strong> ${photo.categoria}<br>
                <strong>Mercaderista:</strong> ${photo.mercaderista}<br>
                <strong>Analista que revisó:</strong> ${photo.analista_rechazo || 'N/A'}<br>
                <strong>Razón:</strong> ${photo.razon_rechazo || 'N/A'}<br>
                <strong>Fecha registro:</strong> ${photo.fecha_registro}<br>
                <strong>Fecha rechazo:</strong> ${photo.fecha_rechazo || 'N/A'}
            </p>
        `;
        
        photoDetails.innerHTML = detailsHTML;
        
        // Mostrar el modal
        const photoModal = new bootstrap.Modal(document.getElementById('photoModal'));
        photoModal.show();
    };

    // Función para abrir el modal de reemplazo de foto
    window.openPhotoReplacementModal = function(photoId, pointName, clientName) {
        currentPhotoId = photoId;
        currentPointName = pointName;
        currentClientName = clientName;
        
        // Resetear el modal
        document.getElementById('currentPhotoId').value = photoId;
        document.getElementById('currentPointName').value = pointName;
        document.getElementById('currentClientName').value = clientName;
        document.getElementById('photoPreviewContainer').style.display = 'none';
        document.getElementById('confirmationMessage').style.display = 'none';
        selectedPhotoFile = null;
        
        // Mostrar el modal
        const replacementModal = new bootstrap.Modal(document.getElementById('photoReplacementModal'));
        replacementModal.show();
    };

    // Configurar botón de cámara
    document.getElementById('cameraBtn')?.addEventListener('click', function() {
        document.getElementById('cameraInput').click();
    });
    
    // Configurar botón de galería
    document.getElementById('galleryBtn')?.addEventListener('click', function() {
        document.getElementById('galleryInput').click();
    });
    
    // Manejar selección de foto desde cámara
    document.getElementById('cameraInput')?.addEventListener('change', function(e) {
        handlePhotoSelection(e, 'camera');
    });
    
    // Manejar selección de foto desde galería
    document.getElementById('galleryInput')?.addEventListener('change', function(e) {
        handlePhotoSelection(e, 'gallery');
    });
    
    // Manejar confirmación de reemplazo
    document.getElementById('confirmReplacementBtn')?.addEventListener('click', function() {
        if (!selectedPhotoFile) return;
        
        // Mostrar loading
        Swal.fire({
            title: 'Subiendo foto...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Subir la foto al servidor
        const formData = new FormData();
        formData.append('photo', selectedPhotoFile);
        formData.append('photo_id', currentPhotoId);
        formData.append('point_name', currentPointName);
        formData.append('client_name', currentClientName);
        
        fetch('/supervisor/api/replace-rejected-photo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Éxito!',
                    text: 'La foto ha sido reemplazada correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // Cerrar el modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('photoReplacementModal'));
                modal.hide();
                
                // Recargar la página para ver los cambios
                setTimeout(() => {
                    location.reload();
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'No se pudo reemplazar la foto'
                });
            }
        })
        .catch(error => {
            Swal.close();
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al comunicarse con el servidor'
            });
        });
    });
    
    // Función para manejar la selección de foto
    function handlePhotoSelection(event, source) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Verificar que es una imagen
        if (!file.type.match('image.*')) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor seleccione un archivo de imagen válido'
            });
            return;
        }
        
        // Guardar la foto seleccionada
        selectedPhotoFile = file;
        
        // Mostrar vista previa
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').src = e.target.result;
            document.getElementById('photoPreviewContainer').style.display = 'block';
            document.getElementById('confirmationMessage').style.display = 'block';
        };
        reader.readAsDataURL(file);
        
        // Resetear los inputs para permitir seleccionar la misma foto nuevamente
        if (source === 'camera') {
            document.getElementById('cameraInput').value = '';
        } else {
            document.getElementById('galleryInput').value = '';
        }
    }

    // Función para cargar fotos según estado
    window.loadSupervisorPhotos = function(estado, containerId) {
    // Mostrar indicador de carga
    const container = document.querySelector(containerId);
    if (!container) {
        console.error(`Contenedor no encontrado: ${containerId}`);
        return;
    }
    
    container.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div></div>';
    
    // Normalizar el estado para coincidir con la API
    let estadoApi = estado;
    if (estado === 'rechazadas') estadoApi = 'rechazadas';
    if (estado === 'aprobada') estadoApi = 'aprobada';
    if (estado === 'pendiente') estadoApi = 'pendiente';
    if (estado === 'no revisado') estadoApi = 'no revisado';
    
    // CORRECCIÓN AQUÍ: Agregar /supervisor al inicio de la URL
    fetch(`/supervisor/api/supervisor-photos/${encodeURIComponent(estadoApi)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
            .then(data => {
                const container = document.querySelector(containerId);
                if (!container) return;
                
                container.innerHTML = '';
                
                if (!data || data.length === 0) {
                    container.innerHTML = '<div class="col-12"><p class="alert alert-info">No hay fotos en este estado.</p></div>';
                    return;
                }
                
                // Renderizar las fotos
                data.forEach(photo => {
                    // Limpiar y formatear la ruta de la foto
                    const cleanPath = photo.file_path
                        .replace(/\\/g, '/')
                        .replace("X://", "X:/")
                        .replace(/\/+/g, '/');
                    
                    const imageUrl = `/api/image/${encodeURIComponent(cleanPath)}`;
                    
                    // Dirección adicional si existe
                    let direccionHTML = '';
                    if (photo.Direccion && photo.Direccion.trim()) {
                        direccionHTML = `<br><small class="text-muted"><i class="bi bi-geo-alt"></i> ${photo.Direccion}</small>`;
                    }
                    
                    // Determinar si es foto "antes" o "después"
                    const isAntes = photo.file_path.toLowerCase().includes('antes');
                    const photoType = isAntes ? 'Antes' : 'Después';
                    
                    const photoCard = `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${imageUrl}" class="card-img-top photo-thumbnail" 
                                 alt="Foto ${photoType}" 
                                 style="height: 200px; object-fit: cover; cursor: pointer;"
                                 data-photo='${JSON.stringify(photo).replace(/'/g, "\\'")}'>
                            <div class="card-body">
                                <h5 class="card-title">${photo.punto_de_interes}</h5>
                                ${direccionHTML}
                                <p class="card-text mt-2">
                                    <strong>Tipo:</strong> ${photoType}<br>
                                    <strong>Cliente:</strong> ${photo.cliente}<br>
                                    <strong>Ruta:</strong> ${photo.ruta}<br>
                                    <strong>Fecha visita:</strong> ${photo.fecha_visita}<br>
                                    <strong>Categoría:</strong> ${photo.categoria || 'Sin categoría'}<br>
                                    <strong>Mercaderista:</strong> ${photo.mercaderista}<br>
                                    ${photo.razon_rechazo ? `<strong>Razón rechazo:</strong> ${photo.razon_rechazo}<br>` : ''}
                                    <strong>Estado:</strong> ${photo.estado || estado}
                                </p>
                                ${estado === 'rechazadas' ? `
                                <button class="btn btn-success w-100" 
                                        onclick="openPhotoReplacementModal(${photo.id_foto}, '${photo.punto_de_interes.replace(/'/g, "\\'")}', '${photo.cliente.replace(/'/g, "\\'")}')">
                                    <i class="bi bi-pencil-square me-1"></i> Modificar
                                </button>` : ''}
                            </div>
                        </div>
                    </div>
                    `;
                    
                    container.innerHTML += photoCard;
                });
                
                // Añadir eventos de clic a las imágenes
                document.querySelectorAll('.photo-thumbnail').forEach(img => {
                    img.addEventListener('click', function() {
                        const photoData = JSON.parse(this.getAttribute('data-photo'));
                        viewPhotoModal(photoData);
                    });
                });
            })
            .catch(error => {
                console.error('Error cargando fotos:', error);
                const container = document.querySelector(containerId);
                if (container) {
                    container.innerHTML = `
                        <div class="col-12">
                            <div class="alert alert-danger">
                                <strong>Error:</strong> ${error.message}
                                <button class="btn btn-sm btn-danger ms-2" onclick="loadSupervisorPhotos('${estado}', '${containerId}')">
                                    <i class="bi bi-arrow-repeat"></i> Reintentar
                                </button>
                            </div>
                        </div>`;
                }
            });
    };

    // Configuración inicial de las pestañas
    const tabs = document.querySelector('#rejected-tab');
    if (tabs) {
        tabs.addEventListener('shown.bs.tab', function() {
            loadSupervisorPhotos('rechazadas', '#rejected-photos-container');
        });
    }
    
    const approvedTab = document.querySelector('#approved-tab');
    if (approvedTab) {
        approvedTab.addEventListener('shown.bs.tab', function() {
            loadSupervisorPhotos('aprobada', '#approved-photos-container');
        });
    }
    
    const pendingTab = document.querySelector('#pending-tab');
    if (pendingTab) {
        pendingTab.addEventListener('shown.bs.tab', function() {
            loadSupervisorPhotos('pendiente', '#pending-photos-container');
        });
    }
    
    const noreviewTab = document.querySelector('#noreview-tab');
    if (noreviewTab) {
        noreviewTab.addEventListener('shown.bs.tab', function() {
            loadSupervisorPhotos('no revisado', '#noreview-photos-container');
        });
    }
    
    // Cargar rechazadas por defecto si estamos en la página de supervisor
    if (document.getElementById('rejected-photos-container')) {
        loadSupervisorPhotos('rechazadas', '#rejected-photos-container');
    }
});