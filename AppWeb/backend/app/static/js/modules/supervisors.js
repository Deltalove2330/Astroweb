// /static/js/modules/supervisors.js
/**
 * Módulo de Supervisor - Gestión de Fotos
 * ✅ CORRECCIONES: Cache de imágenes, prevención de bucles infinitos, colores blancos para contraste
 */

document.addEventListener('DOMContentLoaded', function() {
    // ✅ CACHE GLOBAL para evitar solicitudes repetidas de la misma imagen
    const imageCache = new Map();
    const loadedTabs = new Set();
    const requestQueue = new Map();

    // ✅ Función auxiliar optimizada para URLs de imágenes con caché
    // window.getImageUrl = function(filePath) {
    //     if (!filePath) return '';
        
    //     if (imageCache.has(filePath)) {
    //         return imageCache.get(filePath);
    //     }
        
    //     let cleanPath = filePath
    //         .replace(/\\/g, '/')
    //         .replace("X://", "X:/")
    //         .replace(/\/+/g, '/')
    //         .replace(/^\//, '');
        
    //     const encodedPath = encodeURIComponent(cleanPath).replace(/%2F/g, '/');
    //     const url = `/api/image/${encodedPath}`;
        
    //     imageCache.set(filePath, url);
    //     return url;
    // };

    // ✅ Función para hacer fetch con deduplicación
    async function fetchWithDedupe(url, options = {}) {
        const key = `${url}_${JSON.stringify(options)}`;
        
        if (requestQueue.has(key)) {
            console.log(`⏭️ Request en cola: ${url}`);
            return requestQueue.get(key);
        }
        
        const promise = fetch(url, options)
            .finally(() => requestQueue.delete(key));
        
        requestQueue.set(key, promise);
        return promise;
    }

    // Variables de estado
    let currentPhotoDetails = null;
    let selectedPhotoFile = null;
    let currentPhotoId = null;
    let currentPointName = null;
    let currentClientName = null;

    // ✅ Mostrar foto en modal - COLORES CLAROS
    window.viewPhotoModal = function(photo) {
        try {
            currentPhotoDetails = photo;
            const modalPhoto = document.getElementById('modalPhoto');
            const photoDetails = document.getElementById('photoDetails');
            
            modalPhoto.src = window.getImageUrl(photo.file_path);
            modalPhoto.alt = `Foto de ${photo.punto_de_interes}`;
            
            // ✅ HTML con colores blancos/claros para fondo oscuro
            let detailsHTML = `
                <div class="card border-0 shadow-sm" style="background: rgba(255,255,255,0.15); backdrop-filter: blur(10px);">
                    <div class="card-body">
                        <h6 class="card-title fw-bold mb-3" style="color: #ffffff;">
                            <i class="bi bi-geo-alt-fill me-2"></i>${photo.punto_de_interes}
                        </h6>
                        ${photo.direccion ? `<p class="text-white-50 small mb-3"><i class="bi bi-map me-1"></i>${photo.direccion}</p>` : ''}
                        
                        <div class="row g-2 small">
                            <div class="col-md-6">
                                <p class="mb-1" style="color: #f8f9fa;"><strong style="color: #ffffff;">Cliente:</strong> ${photo.cliente}</p>
                                <p class="mb-1" style="color: #f8f9fa;"><strong style="color: #ffffff;">Ruta:</strong> ${photo.ruta}</p>
                                <p class="mb-1" style="color: #f8f9fa;"><strong style="color: #ffffff;">Fecha visita:</strong> ${photo.fecha_visita}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1" style="color: #f8f9fa;"><strong style="color: #ffffff;">Categoría:</strong> ${photo.categoria || 'Sin categoría'}</p>
                                <p class="mb-1" style="color: #f8f9fa;"><strong style="color: #ffffff;">Mercaderista:</strong> ${photo.mercaderista}</p>
                                <p class="mb-1">
                                    <strong style="color: #ffffff;">Estado:</strong> 
                                    <span class="badge ${getEstadoBadgeClass(photo.estado)}">${photo.estado || 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                        
                        ${photo.razon_rechazo ? `
                            <div class="alert alert-warning mt-3 mb-0 small" style="background: rgba(255,193,7,0.2); border-color: #ffc107;">
                                <i class="bi bi-exclamation-triangle me-1"></i>
                                <strong style="color: #fff3cd;">Razón:</strong> <span style="color: #ffffff;">${photo.razon_rechazo}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            photoDetails.innerHTML = detailsHTML;
            
            const photoModal = bootstrap.Modal.getOrCreateInstance(
                document.getElementById('photoModal')
            );
            photoModal.show();
            
        } catch (error) {
            console.error('❌ Error en viewPhotoModal:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo mostrar la foto'
            });
        }
    };

    // ✅ Helper para clase de badge según estado
    function getEstadoBadgeClass(estado) {
        const classes = {
            'Rechazada': 'bg-danger',
            'Aprobada': 'bg-success',
            'Pendiente': 'bg-warning text-dark',
            'No Revisado': 'bg-secondary'
        };
        return classes[estado] || 'bg-secondary';
    }

    // ✅ Abrir modal de reemplazo
    window.openPhotoReplacementModal = function(photoId, pointName, clientName) {
        currentPhotoId = photoId;
        currentPointName = pointName;
        currentClientName = clientName;
        
        document.getElementById('currentPhotoId').value = photoId;
        document.getElementById('currentPointName').value = pointName;
        document.getElementById('currentClientName').value = clientName;
        document.getElementById('photoPreviewContainer').classList.add('d-none');
        document.getElementById('photoPlaceholder').classList.remove('d-none');
        document.getElementById('confirmationMessage').classList.add('d-none');
        selectedPhotoFile = null;
        
        const replacementModal = bootstrap.Modal.getOrCreateInstance(
            document.getElementById('photoReplacementModal')
        );
        replacementModal.show();
    };

    // ✅ Event listeners para botones de cámara/galería
    document.getElementById('cameraBtn')?.addEventListener('click', () => {
        document.getElementById('cameraInput').click();
    });

    document.getElementById('galleryBtn')?.addEventListener('click', () => {
        document.getElementById('galleryInput').click();
    });

    document.getElementById('cameraInput')?.addEventListener('change', (e) => {
        handlePhotoSelection(e, 'camera');
    });

    document.getElementById('galleryInput')?.addEventListener('change', (e) => {
        handlePhotoSelection(e, 'gallery');
    });

    // ✅ Confirmar reemplazo de foto
    document.getElementById('confirmReplacementBtn')?.addEventListener('click', function() {
        if (!selectedPhotoFile || !currentPhotoId) return;
        
        Swal.fire({
            title: '🔄 Subiendo foto...',
            html: 'Por favor espere mientras se procesa la imagen',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        const formData = new FormData();
        formData.append('photo', selectedPhotoFile);
        formData.append('photo_id', currentPhotoId);
        formData.append('point_name', currentPointName);
        formData.append('client_name', currentClientName);
        
        fetchWithDedupe('/supervisor/api/replace-rejected-photo', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            Swal.close();
            if (data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ ¡Éxito!',
                    text: 'La foto ha sido reemplazada correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                const modal = bootstrap.Modal.getInstance(
                    document.getElementById('photoReplacementModal')
                );
                modal?.hide();
                            // ✅ LIMPIAR CACHÉ Y RECARGAR TAB EN LUGAR DE PÁGINA COMPLETA
                window._supervisorCache = {};
                loadedTabs.clear();
                setTimeout(function() {
                    var activeTab = document.querySelector('.nav-link.active[data-bs-target]');
                    if (activeTab) activeTab.click();
                }, 1500);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '❌ Error',
                    text: data.message || 'No se pudo reemplazar la foto'
                });
            }
        })
        .catch(error => {
            Swal.close();
            console.error('❌ Error en reemplazo:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo comunicar con el servidor'
            });
        });
    });

    // ✅ Manejar selección de archivo
    function handlePhotoSelection(event, source) {
        const file = event.target.files?.[0];
        if (!file) return;
        
        if (!file.type.match('image.*')) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo inválido',
                text: 'Por favor seleccione una imagen válida (JPG, PNG, GIF)'
            });
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            Swal.fire({
                icon: 'error',
                title: 'Archivo muy grande',
                text: 'La imagen no debe superar los 10MB'
            });
            return;
        }
        
        selectedPhotoFile = file;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').src = e.target.result;
            document.getElementById('photoPreviewContainer').classList.remove('d-none');
            document.getElementById('photoPlaceholder').classList.add('d-none');
            document.getElementById('confirmationMessage').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
        
        event.target.value = '';
    }

    // ✅ FUNCIÓN PRINCIPAL - Cargar fotos con colores blancos para contraste
    // ✅ FUNCIÓN PRINCIPAL - SIN estilos inline conflictivos
window.loadSupervisorPhotos = function(estado, containerId) {
    const tabKey = `${estado}_${containerId}`;
    if (loadedTabs.has(tabKey)) {
        console.log(`✅ Ya cargado: ${tabKey}`);
        return;
    }
    
    const container = document.querySelector(containerId);
    if (!container) {
        console.error(`❌ Contenedor no encontrado: ${containerId}`);
        return;
    }
    
        loadedTabs.add(tabKey);
    
    // ✅ CACHE EN MEMORIA - Verificar si ya tenemos datos
    window._supervisorCache = window._supervisorCache || {};
    if (window._supervisorCache[tabKey]) {
        var _cached = window._supervisorCache[tabKey];
        updateTabCount(estado, _cached.length);
        
        // Renderizar desde caché
        container.innerHTML = _cached.map(photo => {
            const imageUrl = window.getImageUrl(photo.file_path);
            const isAntes = photo.file_path?.toLowerCase().includes('antes');
            const photoType = isAntes ? 'Antes' : 'Después';
            
            return `
                <div class="col">
                    <div class="card h-100">
                        <img src="/static/images/placeholder.png" 
                             data-src="${imageUrl}"
                             class="card-img-top photo-thumbnail lazy-img"
                             alt="Foto ${photoType} - ${photo.punto_de_interes}"
                             style="height: 220px; object-fit: cover; cursor: pointer;"
                             data-bs-toggle="tooltip"
                             title="${photo.punto_de_interes}"
                             data-photo='${JSON.stringify(photo).replace(/'/g, "\\'")}'>
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title fw-bold mb-2 text-truncate" 
                                title="${photo.punto_de_interes}">
                                ${photo.punto_de_interes}
                            </h6>
                            ${photo.direccion ? `<small class="d-block mb-2"><i class="bi bi-geo-alt me-1"></i> ${photo.direccion}</small>` : ''}
                            
                            <div class="small flex-grow-1" style="line-height: 1.6;">
                                <div><strong>Cliente:</strong> ${photo.cliente}</div>
                                <div><strong>Ruta:</strong> ${photo.ruta}</div>
                                <div><strong>Fecha:</strong> ${photo.fecha_visita}</div>
                                <div><strong>Mercaderista:</strong> ${photo.mercaderista}</div>
                            </div>
                            
                            <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                <span class="badge ${getEstadoBadgeClass(photo.estado)}">
                                    ${photo.estado || estado}
                                </span>
                                ${estado === 'rechazadas' ? `
                                    <button class="btn btn-sm btn-success"
                                        onclick="openPhotoReplacementModal(${photo.id_foto}, '${photo.punto_de_interes.replace(/'/g, "\\'")}', '${photo.cliente.replace(/'/g, "\\'")}')">
                                        <i class="bi bi-pencil-square"></i>
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        // Inicializar lazy loading para imágenes en caché
        var _lazyObs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        _lazyObs.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '150px' });
        
        container.querySelectorAll('.lazy-img[data-src]').forEach(function(img) {
            _lazyObs.observe(img);
        });
        
        // Inicializar tooltips
        container.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            new bootstrap.Tooltip(el, { trigger: 'hover' });
        });
        
        // Delegación de eventos
        container.addEventListener('click', function(e) {
            const img = e.target.closest('.photo-thumbnail');
            if (img) {
                try {
                    const photoData = JSON.parse(img.getAttribute('data-photo'));
                    viewPhotoModal(photoData);
                } catch (err) {
                    console.error('Error parsing photo ', err);
                }
            }
        }, { once: true });
        
        return; // ✅ SALIR - No hacer fetch
    }
    
    const estadoMap = {
        'rechazadas': 'rechazadas',
        'aprobada': 'aprobada', 
        'pendiente': 'pendiente',
        'no revisado': 'no revisado'
    };
    const estadoApi = estadoMap[estado] || estado;
    
    fetchWithDedupe(`/supervisor/api/supervisor-photos/${encodeURIComponent(estadoApi)}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            const container = document.querySelector(containerId);
            if (!container) return;
            
            updateTabCount(estado, data?.length || 0);

            window._supervisorCache = window._supervisorCache || {};
            window._supervisorCache[tabKey] = data;
            
            if (!data || data.length === 0) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state text-center py-5">
                            <i class="bi bi-folder-x d-block mb-3" style="font-size: 3rem;"></i>
                            <h5 class="fw-bold mb-2">No hay fotos</h5>
                            <p class="mb-0">No se encontraron fotos en estado "${estado}"</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            // ✅ Renderizar cards SIN estilos inline de color
            container.innerHTML = data.map(photo => {
                const imageUrl = window.getImageUrl(photo.file_path);
                const isAntes = photo.file_path?.toLowerCase().includes('antes');
                const photoType = isAntes ? 'Antes' : 'Después';
                
                return `
                    <div class="col">
                        <div class="card h-100">
                            <img src="${imageUrl}" 
                                 class="card-img-top photo-thumbnail"
                                 alt="Foto ${photoType} - ${photo.punto_de_interes}"
                                 loading="lazy"
                                 style="height: 220px; object-fit: cover; cursor: pointer;"
                                 data-bs-toggle="tooltip"
                                 title="${photo.punto_de_interes}"
                                 data-photo='${JSON.stringify(photo).replace(/'/g, "\\'")}'>
                            <div class="card-body d-flex flex-column">
                                <h6 class="card-title fw-bold mb-2 text-truncate" 
                                    title="${photo.punto_de_interes}">
                                    ${photo.punto_de_interes}
                                </h6>
                                ${photo.direccion ? `<small class="d-block mb-2"><i class="bi bi-geo-alt me-1"></i> ${photo.direccion}</small>` : ''}
                                
                                <div class="small flex-grow-1" style="line-height: 1.6;">
                                    <div><strong>Cliente:</strong> ${photo.cliente}</div>
                                    <div><strong>Ruta:</strong> ${photo.ruta}</div>
                                    <div><strong>Fecha:</strong> ${photo.fecha_visita}</div>
                                    <div><strong>Mercaderista:</strong> ${photo.mercaderista}</div>
                                </div>
                                
                                <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                                    <span class="badge ${getEstadoBadgeClass(photo.estado)}">
                                        ${photo.estado || estado}
                                    </span>
                                    ${estado === 'rechazadas' ? `
                                        <button class="btn btn-sm btn-success"
                                            onclick="openPhotoReplacementModal(${photo.id_foto}, '${photo.punto_de_interes.replace(/'/g, "\\'")}', '${photo.cliente.replace(/'/g, "\\'")}')">
                                            <i class="bi bi-pencil-square"></i>
                                        </button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            // ✅ Inicializar tooltips
            container.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
                new bootstrap.Tooltip(el, { trigger: 'hover' });
            });
            
            // ✅ Delegación de eventos
            container.addEventListener('click', function(e) {
                const img = e.target.closest('.photo-thumbnail');
                if (img) {
                    try {
                        const photoData = JSON.parse(img.getAttribute('data-photo'));
                        viewPhotoModal(photoData);
                    } catch (err) {
                        console.error('Error parsing photo ', err);
                    }
                }
            }, { once: true });
            
        })
        .catch(error => {
            console.error('❌ Error cargando fotos:', error);
            const container = document.querySelector(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger">
                            <i class="bi bi-exclamation-triangle me-2"></i>
                            <strong>Error:</strong> ${error.message}
                            <button class="btn btn-sm btn-outline-danger ms-3" 
                                    onclick="loadSupervisorPhotos('${estado}', '${containerId}')">
                                <i class="bi bi-arrow-repeat"></i> Reintentar
                            </button>
                        </div>
                    </div>
                `;
            }
        });
};

    // ✅ Helper para actualizar contadores de pestañas
    function updateTabCount(estado, count) {
        const tabMap = {
            'rechazadas': 'count-rejected',
            'aprobada': 'count-approved',
            'pendiente': 'count-pending',
            'no revisado': 'count-noreview'
        };
        const element = document.getElementById(tabMap[estado]);
        if (element) {
            element.textContent = count;
            element.style.display = count > 0 ? 'inline-block' : 'none';
            // ✅ Asegurar que el contador sea visible sobre fondo oscuro
            element.style.color = '#ffffff';
            element.style.backgroundColor = 'rgba(255,255,255,0.2)';
        }
    }

    // ✅ Configurar pestañas con prevención de múltiples triggers
    function setupTabs() {
        const tabButtons = document.querySelectorAll('[data-bs-toggle="tab"]');
        
        tabButtons.forEach(tab => {
            const newTab = tab.cloneNode(true);
            tab.parentNode?.replaceChild(newTab, tab);
            
            newTab.addEventListener('shown.bs.tab', function(e) {
                const target = e.target.getAttribute('data-bs-target');
                if (!target) return;
                
                const estado = target.replace('#', '').replace('-photos', '');
                const containerId = `#${estado}-photos-container`;
                
                const estadoMap = {
                    'rejected': 'rechazadas',
                    'approved': 'aprobada',
                    'pending': 'pendiente',
                    'noreview': 'no revisado'
                };
                
                const estadoParam = estadoMap[estado];
                if (estadoParam && !loadedTabs.has(`${estadoParam}_${containerId}`)) {
                    loadSupervisorPhotos(estadoParam, containerId);
                }
            });
        });
    }

    // ✅ Inicialización
    setupTabs();
    
    if (document.getElementById('rejected-photos-container') && !loadedTabs.has('rechazadas_#rejected-photos-container')) {
        loadSupervisorPhotos('rechazadas', '#rejected-photos-container');
    }
    
    // ✅ Cleanup al cerrar página
    window.addEventListener('beforeunload', function() {
        imageCache.clear();
        loadedTabs.clear();
        requestQueue.clear();
    });
});