// static/js/modules/auditor-carga-data.js
// Variables globales para auditor
let currentAuditorRoute = null;
let currentAuditorPoint = null;
let auditorSelectedPhotoFile = null;
let currentPhotoType = null;         // 'activacion' o 'desactivacion'
let currentAuditorCategory = null;
let auditorProductoIndex = 0;
const AUDITOR_PRODUCTOS_SELECCIONADOS = new Set();
// Inicialización
$(document).ready(function() {
    // Verificar sesión del auditor
    if (!checkAuditorSession()) {
        return;
    }
    
    const cedula = sessionStorage.getItem('auditor_cedula');
    const nombre = sessionStorage.getItem('auditor_name');
    
    // Actualizar información del header
    $('#auditorName').text(nombre);
    $('#auditorCedula').text(cedula);
    $('#userAvatar').text(nombre.substring(0, 2).toUpperCase());
    
    // Cargar estadísticas
    loadAuditorStats(cedula);
    
    // Cargar rutas asignadas
    loadAuditorRoutes(cedula);
    
    // Configurar eventos
    setupAuditorEvents();
});

// Verificar sesión del auditor
function checkAuditorSession() {
    const cedula = sessionStorage.getItem('auditor_cedula');
    const nombre = sessionStorage.getItem('auditor_name');
    
    if (!cedula || !nombre) {
        Swal.fire({
            icon: 'error',
            title: 'Sesión no válida',
            text: 'Por favor, inicia sesión nuevamente',
            confirmButtonText: 'Iniciar Sesión'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.clear();
                window.location.href = '/login';
            }
        });
        return false;
    }
    return true;
}

// Cargar estadísticas del auditor - ✅ CORREGIDO: Usar endpoint del blueprint
function loadAuditorStats(cedula) {
    fetch(`/auditor/api/stats/${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar estadísticas');
        }
        return response.json();
    })
    .then(data => {
        $('#infoRutasAsignadas').text(data.rutasAsignadas || 0);
        $('#infoRutasPendientes').text(data.rutasPendientes || 0);
        $('#infoRutasCompletadas').text(data.rutasCompletadas || 0);
        $('#infoAvance').text(`${data.avance || 0}%`);
    })
    .catch(error => {
        console.error('Error al cargar estadísticas:', error);
    });
}

// Cargar rutas asignadas al auditor - ✅ CORREGIDO: Usar endpoint del blueprint
function loadAuditorRoutes(cedula) {
    $('#rutasContainer').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando rutas asignadas...</p>
        </div>
    `);
    
    fetch(`/auditor/api/auditor-fixed-routes/${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar rutas');
        }
        return response.json();
    })
    .then(routes => {
        renderAuditorRoutesCards(routes);
    })
    .catch(error => {
        console.error('Error al cargar rutas:', error);
        $('#rutasContainer').html(`
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle"></i> Error al cargar las rutas asignadas
            </div>
        `);
    });
}

// Renderizar tarjetas de rutas para auditor
function renderAuditorRoutesCards(routes) {
    if (!routes || routes.length === 0) {
        $('#rutasContainer').html(`
            <div class="no-routes">
                <i class="fas fa-signpost"></i>
                <p class="mb-0">No tienes rutas asignadas</p>
            </div>
        `);
        return;
    }
    
    let html = '';
    
    routes.forEach(route => {
        const mostrarBotonActivar = !route.esta_activa;
        const mostrarBotonVer = route.esta_activa;
        const mostrarBotonDesactivar = route.esta_activa;
        
        html += `
        <div class="route-card">
            <div class="d-flex justify-content-between align-items-start">
                <div>
                    <h5><i class="fas fa-route me-2"></i>${route.nombre}</h5>
                    <span class="route-status ${route.esta_activa ? 'status-active' : 'status-inactive'}">
                        <i class="fas ${route.esta_activa ? 'fa-check-circle' : 'fa-times-circle'} me-1"></i>
                        ${route.esta_activa ? 'En Progreso' : 'Inactiva'}
                    </span>
                </div>
                <span class="badge bg-primary">ID: ${route.id}</span>
            </div>
            
            <div class="route-info">
                <div class="route-info-item">
                    <strong>Puntos Totales</strong>
                    <span>${route.total_puntos || 'N/A'}</span>
                </div>
            </div>
            
            <div class="btn-actions">
                <!-- Botón Activar Ruta -->
                <button id="btn-activar-${route.id}" class="btn-activar ${mostrarBotonActivar ? '' : 'd-none'}" 
                        onclick="activarRutaAuditor(${route.id}, '${route.nombre.replace(/'/g, "\\'")}')">
                    <i class="fas fa-power-off me-1"></i> Activar Ruta
                </button>
                
                <!-- Botón Ver Puntos -->
                <button id="btn-ver-${route.id}" class="btn-ver-puntos ${mostrarBotonVer ? '' : 'd-none'}" 
                        onclick="verPuntosRutaAuditor(${route.id}, '${route.nombre.replace(/'/g, "\\'")}')">
                    <i class="fas fa-map-marker-alt me-1"></i> Ver Puntos
                </button>
                
                <!-- Botón Desactivar Ruta -->
                <button id="btn-desactivar-${route.id}" class="btn-desactivar ${mostrarBotonDesactivar ? '' : 'd-none'}" 
                        onclick="desactivarRutaAuditor(${route.id})">
                    <i class="fas fa-stop-circle me-1"></i> Desactivar Ruta
                </button>
            </div>
        </div>
        `;
    });
    
    $('#rutasContainer').html(html);
}

// Configurar eventos
function setupAuditorEvents() {
    // Configurar botón de subir foto
    document.getElementById('confirmUploadBtn')?.addEventListener('click', function() {
        uploadActivationPhotoAuditor();
    });
}

// Activar ruta para auditor - ✅ CORREGIDO: Usar endpoint del blueprint
function activarRutaAuditor(routeId, routeName) {
    const cedula = sessionStorage.getItem('auditor_cedula');
    
    if (!cedula) {
        Swal.fire('Error', 'Sesión no válida', 'error');
        return;
    }
    
    Swal.fire({
        title: '¿Activar ruta?',
        text: `Estás a punto de activar la ruta: ${routeName}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, activar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Activando ruta...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            
            fetch('/auditor/api/activar-ruta-auditor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Auditor-Cedula': cedula
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
                        title: 'Ruta activada',
                        text: 'Ahora puedes ver los puntos de la ruta',
                        timer: 1500,
                        showConfirmButton: false
                    });
                    
                    // Mostrar/ocultar botones
                    $(`#btn-activar-${routeId}`).addClass('d-none');
                    $(`#btn-ver-${routeId}`).removeClass('d-none');
                    $(`#btn-desactivar-${routeId}`).removeClass('d-none');
                    
                    // Recargar rutas
                    loadAuditorRoutes(cedula);
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

// Ver puntos de una ruta para auditor
function verPuntosRutaAuditor(routeId, routeName) {
    currentAuditorRoute = { id: routeId, name: routeName };
    
    $('#modalRutaNombre').text(routeName);
    $('#puntosModal').modal('show');
    
    loadAuditorRoutePoints(routeId);
}

// Cargar puntos de la ruta para auditor - ✅ CORREGIDO: Usar endpoint del blueprint
function loadAuditorRoutePoints(routeId) {
    $('#puntosContainer').html(`
        <div class="text-center py-3">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-2">Cargando puntos...</p>
        </div>
    `);
    
    const cedula = sessionStorage.getItem('auditor_cedula');
    
    fetch(`/auditor/api/auditor-route-points/${routeId}?cedula=${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => res.json())
    .then(renderAuditorRoutePoints)
    .catch(() => {
        $('#puntosContainer').html(`
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle"></i> Error al cargar los puntos
            </div>
        `);
    });
}

// Renderizar puntos para auditor
function renderAuditorRoutePoints(points) {
    if (!points || points.length === 0) {
        $('#puntosContainer').html(`
            <div class="alert alert-info text-center">
                <i class="fas fa-map-marker-alt fs-1"></i>
                <p class="mt-2 mb-0">No hay puntos en esta ruta</p>
            </div>
        `);
        return;
    }
    
    let html = '<div class="list-group">';
    points.forEach(point => {
        const isActivated = point.activado || false;
        html += `
        <div class="list-group-item d-flex justify-content-between align-items-center ${isActivated ? 'list-group-item-success' : 'list-group-item-warning'}">
            <div>
                <h6 class="mb-1"><i class="fas fa-map-marker-alt me-2"></i>${point.nombre}</h6>
                <small class="text-muted">Prioridad: ${point.prioridad || 'Media'}</small>
            </div>
            ${isActivated ? `
                <button class="btn btn-danger btn-sm"
                    onclick="desactivarPuntoAuditor('${point.id}', '${point.nombre.replace(/'/g, "\\'")}')">
                    <i class="fas fa-camera me-1"></i> Desactivar
                </button>
            ` : `
                <button class="btn btn-primary btn-sm"
                    onclick="activarPuntoAuditor('${point.id}', '${point.nombre.replace(/'/g, "\\'")}')">
                    <i class="fas fa-camera me-1"></i> Activar
                </button>
            `}
        </div>
        `;
    });
    html += '</div>';
    $('#puntosContainer').html(html);
}

// Nueva función: Desactivar punto de interés
function desactivarPuntoAuditor(pointId, pointName) {
    currentAuditorPoint = { id: pointId, name: pointName };
    currentPhotoType = 'desactivacion'; // Indicar que es desactivación
    
    // Mostrar confirmación
    Swal.fire({
        title: 'Desactivar punto',
        html: `
            <p><strong>Punto:</strong> ${pointName}</p>
            <div class="alert alert-warning mt-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                <strong>Importante:</strong> Esta acción tomará una foto de desactivación 
                y finalizará todas las visitas pendientes en este punto.
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
    }).then((result) => {
        if (result.isConfirmed) {
            // Abrir cámara nativa para foto de desactivación
            $('#cameraInputAuditor').attr('capture', 'environment').click();
        }
    });
}

// Activar punto para auditor
function activarPuntoAuditor(pointId, pointName) {
    currentAuditorPoint = { id: pointId, name: pointName };
    currentPhotoType = 'activacion'; // 🔴 ¡CRÍTICO! Establecer el tipo de foto
    
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
            $('#cameraInputAuditor').attr('capture', 'environment').click();
        }
    });
}

// Volver a tomar foto para auditor
function retakeAuditorPhoto() {
    const previewImage = document.getElementById('previewImage');
    if (previewImage.src.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage.src);
    }
    
    $('#photoPreviewContainer').hide();
    // Volver a abrir cámara
    $('#cameraInputAuditor').attr('capture', 'environment').click();
}

// Capturar metadatos GPS para auditor
async function captureAuditorMetadata() {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn("⚠️ Geolocation API no soportada");
            resolve({});
            return;
        }
        
        console.log("🎯 Solicitando ubicación...");
        
        navigator.geolocation.getCurrentPosition(
            pos => {
                const meta = {
                    lat: pos.coords.latitude,
                    lon: pos.coords.longitude,
                    alt: pos.coords.altitude || null,
                    accuracy: pos.coords.accuracy,
                    timestamp: pos.timestamp
                };
                console.log("✅ Ubicación obtenida:", meta);
                resolve(meta);
            },
            err => {
                console.warn('❌ Error obteniendo GPS:', err.message, err.code);
                resolve({});
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }
        );
    });
}

// Subir foto de activación para auditor - ✅ MODIFICADO: Mostrar categorías después de activar
async function uploadActivationPhotoAuditor() {
    if (!auditorSelectedPhotoFile) {
        Swal.fire('Error', 'No hay foto seleccionada', 'error');
        return;
    }
    
    // ✅ Asegurar que currentAuditorRoute esté definido
    if (!currentAuditorRoute) {
        Swal.fire('Error', 'No hay ruta seleccionada', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Subiendo foto...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    const cedula = sessionStorage.getItem('auditor_cedula');
    const gpsData = await captureAuditorMetadata();
    console.log("📍 GPS obtenido del dispositivo:", gpsData);
    
    const formData = new FormData();
    formData.append('photo', auditorSelectedPhotoFile);
    formData.append('point_id', currentAuditorPoint.id);
    formData.append('cedula', cedula);
    formData.append('route_id', currentAuditorRoute.id); // ✅ Asegurar route_id
    formData.append('lat', gpsData.lat || '');
    formData.append('lon', gpsData.lon || '');
    formData.append('alt', gpsData.alt || '');
    
    try {
        const response = await fetch('/auditor/api/upload-activation-photo-auditor', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        const data = await response.json();
        Swal.close();
        
        if (data.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Punto activado!',
                text: 'Ahora puedes ver las categorías pendientes',
                timer: 1500,
                showConfirmButton: false
            });
            
            // ✅ Guardar routeId antes de cerrar el modal
            const routeId = currentAuditorRoute.id;
            
            // Cerrar modal de activación
            $('#activacionModal').modal('hide');
            
            // Mostrar categorías después de activar
            setTimeout(() => {
                showCategoriesModal(currentAuditorPoint.id, routeId, cedula);
            }, 1600);
        } else {
            Swal.fire('Error', data.message || 'Error desconocido', 'error');
        }
    } catch (err) {
        Swal.close();
        console.error('Error al subir foto:', err);
        Swal.fire('Error', `Error al subir la foto: ${err.message}`, 'error');
    }
}

// ✅ NUEVO: Mostrar modal de categorías después de activar punto
function showCategoriesModal(pointId, routeId, cedula) {
    // Guardar contexto global
    window.currentAuditorContext = {
        pointId: pointId,
        routeId: routeId,
        cedula: cedula,
        pointName: currentAuditorPoint?.name || 'Punto'
    };
    
    // Configurar título del modal
    $('#categoriesModalLabel').html(`
        <i class="fas fa-tags me-2"></i>Categorías Pendientes - ${window.currentAuditorContext.pointName}
    `);
    
    // Mostrar loading
    $('#categoriesModalBody').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando categorías...</p>
        </div>
    `);
    
    // Mostrar modal
    $('#categoriesModal').modal('show');
    
    // Cargar categorías
    fetch(`/auditor/api/point-categories/${pointId}/${routeId}?cedula=${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar categorías');
        return response.json();
    })
    .then(categories => {
        console.log('✅ Categorías cargadas:', categories); // ✅ DEBUG
        
        if (!categories || categories.length === 0) {
            $('#categoriesModalBody').html(`
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle fs-1"></i>
                    <p class="mt-3 mb-0">No hay categorías pendientes para este punto</p>
                </div>
            `);
            return;
        }
        
        // Renderizar categorías SIN onclick inline
        let html = '<div class="row" id="categoriesContainer">';
        categories.forEach(category => {
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card h-100 border-primary hover-shadow category-card" 
                         data-category-id="${category.id}" 
                         data-category-name="${encodeURIComponent(category.nombre)}">
                        <div class="card-body text-center">
                            <div class="mb-3">
                                <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                    style="width: 60px; height: 60px;">
                                    <i class="fas fa-cube fs-3"></i>
                                </div>
                            </div>
                            <h5 class="card-title">${category.nombre}</h5>
                            <p class="text-muted mb-1">
                                <i class="fas fa-users me-1"></i> ${category.total_clientes} cliente(s)
                            </p>
                            <span class="badge bg-primary mt-2">Ver productos</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        $('#categoriesModalBody').html(html);
        
        // ✅ Configurar evento DELEGADO (solución definitiva)
        $('#categoriesContainer').off('click', '.category-card').on('click', '.category-card', function() {
            const categoryId = $(this).data('category-id');
            const categoryName = decodeURIComponent($(this).data('category-name'));
            console.log('🎯 Categoría seleccionada:', categoryId, categoryName); // ✅ DEBUG
            
            showProductsForCategory(
                categoryId, 
                categoryName, 
                window.currentAuditorContext.pointId, 
                window.currentAuditorContext.routeId, 
                window.currentAuditorContext.cedula
            );
        });
    })
    .catch(error => {
        console.error('❌ Error al cargar categorías:', error); // ✅ DEBUG
        $('#categoriesModalBody').html(`
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle fs-1"></i>
                <p class="mt-3 mb-0">Error al cargar las categorías: ${error.message}</p>
            </div>
        `);
    });
}
// ✅ NUEVO: Mostrar productos de una categoría
// ✅ MODIFICADO: Mostrar formulario de carga de datos para auditor
// ✅ NUEVO: Mostrar formulario dinámico con dropdowns (igual que mercaderista)
function showProductsForCategory(categoryId, categoryName, pointId, routeId, cedula) {
    console.log('📦 showProductsForCategory llamado:', {categoryId, categoryName, pointId, routeId, cedula});
    
    // Guardar contexto global
    currentAuditorCategory = {
        id: categoryId,
        name: categoryName,
        pointId: pointId,
        routeId: routeId,
        cedula: cedula
    };

    // Actualizar título del modal
    $('#categoriesModalLabel').html(`
        <i class="fas fa-boxes me-2"></i>Cargar Data - ${categoryName}
        <button class="btn btn-sm btn-outline-secondary ms-3" id="btnVolverCategorias">
            <i class="fas fa-arrow-left me-1"></i>Volver a Categorías
        </button>
    `);

    // Mostrar loading
    $('#categoriesModalBody').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando productos...</p>
        </div>
    `);

    // Cargar productos de la categoría
    fetch(`/auditor/api/category-products/${categoryId}?cedula=${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(products => {
        console.log('✅ Productos recibidos:', products);
        if (!products || products.length === 0) {
            $('#categoriesModalBody').html(`
                <div class="alert alert-warning text-center">
                    <i class="fas fa-box-open fs-1"></i>
                    <p class="mt-3 mb-0">No hay productos en esta categoría</p>
                </div>
            `);
            return;
        }
        
        // ✅ RENDERIZAR FORMULARIO DINÁMICO (igual que mercaderista)
        renderAuditorDynamicForm(products, categoryId, categoryName, pointId, routeId, cedula);
        
        // Configurar botón volver
        $('#btnVolverCategorias').off('click').on('click', function() {
            showCategoriesModal(pointId, routeId, cedula);
        });
    })
    .catch(error => {
        console.error('❌ Error al cargar productos:', error);
        $('#categoriesModalBody').html(`
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle fs-1"></i>
                <p class="mt-3 mb-0">Error al cargar productos: ${error.message}</p>
            </div>
        `);
    });
}

// ✅ NUEVO: Renderizar formulario de carga de datos para auditor
function renderAuditorDataForm(products, categoryId, categoryName, pointId, routeId, cedula) {
    // Guardar fecha de carga
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    const fechaCarga = new Date().toISOString();
    
    let html = `
        <div class="alert alert-info mb-3">
            <i class="fas fa-info-circle me-2"></i>
            <strong>Nota:</strong> Puedes cargar datos de los productos que desees. 
            Los productos marcados como "Inagotable" son opcionales.
        </div>
        
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="bg-light">
                    <tr>
                        <th style="width: 50px;">#</th>
                        <th>Producto</th>
                        <th>Fabricante</th>
                        <th>Estado</th>
                        <th style="width: 40px;">
                            <i class="fas fa-check-circle text-success" title="Cargar"></i>
                        </th>
                    </tr>
                </thead>
                <tbody id="auditorProductsTableBody">
    `;
    
    products.forEach((product, index) => {
        const isDisabled = product.inagotable ? 'disabled' : '';
        const checkboxId = `product-check-${product.id}`;
        
        html += `
            <tr class="product-row" data-product-id="${product.id}" data-product-sku="${product.sku}" 
                data-fabricante="${product.fabricante}" data-inagotable="${product.inagotable}">
                <td><span class="badge bg-secondary">${index + 1}</span></td>
                <td>
                    <strong>${product.sku}</strong>
                    <input type="hidden" class="product-id" value="${product.id}">
                    <input type="hidden" class="product-sku" value="${product.sku}">
                </td>
                <td>${product.fabricante || 'N/A'}</td>
                <td>
                    ${product.inagotable 
                        ? '<span class="badge bg-success"><i class="fas fa-check me-1"></i>Inagotable</span>'
                        : '<span class="badge bg-warning"><i class="fas fa-exclamation-triangle me-1"></i>Pendiente</span>'
                    }
                </td>
                <td class="text-center">
                    <input type="checkbox" class="form-check-input product-checkbox" 
                           id="${checkboxId}" ${isDisabled}>
                </td>
            </tr>
        `;
    });
    
    html += `
                </tbody>
            </table>
        </div>
        
        <div class="alert alert-warning" id="noProductsSelectedAlert" style="display: none;">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Selecciona al menos un producto</strong> para continuar.
        </div>
        
        <div class="d-grid gap-2 mt-3">
            <button class="btn btn-primary btn-lg" id="btnLoadSelectedProducts">
                <i class="fas fa-upload me-2"></i>
                Cargar Datos de Productos Seleccionados
            </button>
        </div>
    `;
    
    $('#categoriesModalBody').html(html);
    
    // Configurar evento del botón
    $('#btnLoadSelectedProducts').on('click', function() {
        const selectedProducts = $('.product-checkbox:checked').closest('.product-row');
        
        if (selectedProducts.length === 0) {
            $('#noProductsSelectedAlert').show();
            return;
        }
        
        $('#noProductsSelectedAlert').hide();
        
        // Obtener productos seleccionados con sus datos
        const productosData = [];
        selectedProducts.each(function() {
            const $row = $(this);
            productosData.push({
                id: parseInt($row.data('product-id')),
                sku: $row.data('product-sku'),
                fabricante: $row.data('fabricante'),
                inagotable: $row.data('inagotable') === 'true'
            });
        });
        
        // Mostrar formulario detallado de carga
        showDetailedDataForm(productosData, categoryId, categoryName, pointId, routeId, cedula);
    });
}

// ✅ NUEVO: Mostrar formulario detallado para ingresar datos
function showDetailedDataForm(productosData, categoryId, categoryName, pointId, routeId, cedula) {
    let html = `
        <div class="alert alert-primary mb-3">
            <i class="fas fa-edit me-2"></i>
            <strong>Cargando datos para ${productosData.length} producto(s)</strong> de la categoría: ${categoryName}
        </div>
        
        <div id="auditorDataFormContainer">
            <form id="auditorDataForm">
                <input type="hidden" id="auditorCategoryId" value="${categoryId}">
                <input type="hidden" id="auditorPointId" value="${pointId}">
                <input type="hidden" id="auditorRouteId" value="${routeId}">
                <input type="hidden" id="auditorCedula" value="${cedula}">
                <input type="hidden" id="auditorFechaIngreso" value="${sessionStorage.getItem('fechaIngreso')}">
                <input type="hidden" id="auditorFechaCarga" value="${new Date().toISOString()}">
                
                <div class="row gy-3" id="auditorProductsContainer">
    `;
    
    // Agregar campos para cada producto seleccionado
    productosData.forEach((producto, index) => {
        html += `
            <div class="col-12 producto-item-auditor" data-product-index="${index}" data-product-id="${producto.id}">
                <div class="card border-primary">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0">
                            <i class="fas fa-box me-2"></i>
                            Producto ${index + 1}: ${producto.sku}
                            ${producto.inagotable ? '<span class="badge bg-success ms-2">Inagotable</span>' : ''}
                        </h6>
                    </div>
                    <div class="card-body">
                        <input type="hidden" class="form-product-id" value="${producto.id}">
                        <input type="hidden" class="form-product-sku" value="${producto.sku}">
                        <input type="hidden" class="form-fabricante" value="${producto.fabricante}">
                        
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Inventario Inicial</label>
                                <input type="number" class="form-control inventario-inicial" 
                                       name="inventario_inicial_${index}" min="0" required>
                            </div>
                            
                            <div class="col-md-3">
                                <label class="form-label">Inventario Final</label>
                                <input type="number" class="form-control inventario-final" 
                                       name="inventario_final_${index}" min="0" required>
                            </div>
                            
                            <div class="col-md-3">
                                <label class="form-label">Caras</label>
                                <input type="number" class="form-control caras-input" 
                                       name="caras_${index}" min="0" required>
                            </div>
                            
                            <div class="col-md-3">
                                <label class="form-label">Inventario en Depósito</label>
                                <input type="number" class="form-control inventario-deposito" 
                                       name="inventario_deposito_${index}" min="0" value="0">
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label">Precio en Bs</label>
                                <div class="input-group">
                                    <span class="input-group-text">Bs</span>
                                    <input type="text" class="form-control precio-bs decimal-input" 
                                           name="precio_bs_${index}" placeholder="0,00" 
                                           data-max="35500" data-moneda="Bs">
                                </div>
                                <div class="invalid-feedback">El precio máximo es 35.500 Bs</div>
                                <small class="form-text text-muted">Máximo: 35.500 Bs. Usa coma para decimales</small>
                            </div>
                            
                            <div class="col-md-6">
                                <label class="form-label">Precio en USD</label>
                                <div class="input-group">
                                    <span class="input-group-text">$</span>
                                    <input type="text" class="form-control precio-usd decimal-input" 
                                           name="precio_usd_${index}" placeholder="0,00" 
                                           data-max="100" data-moneda="USD">
                                </div>
                                <div class="invalid-feedback">El precio máximo es 100 USD</div>
                                <small class="form-text text-muted">Máximo: 100 USD. Usa coma para decimales</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += `
                </div>
                
                <div class="alert alert-info mt-3">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>Importante:</strong> Los datos se guardarán para todos los clientes que tienen estos productos en esta categoría.
                </div>
                
                <div class="d-grid gap-2 mt-3">
                    <button type="submit" class="btn btn-success btn-lg" id="btnSubmitAuditorData">
                        <i class="fas fa-save me-2"></i>
                        Guardar Datos
                    </button>
                    <button type="button" class="btn btn-secondary btn-lg" 
                            onclick="showProductsForCategory(${categoryId}, '${categoryName.replace(/'/g, "\\'")}', ${pointId}, ${routeId}, '${cedula}')">
                        <i class="fas fa-arrow-left me-2"></i>
                        Volver a Productos
                    </button>
                </div>
            </form>
        </div>
    `;
    
    $('#categoriesModalBody').html(html);
    
    // Configurar inputs decimales
    configurarInputsDecimalesAuditor();
    
    // Configurar submit del formulario
    $('#auditorDataForm').on('submit', function(e) {
        e.preventDefault();
        
        // Validar precios
        if (!validateAllPricesAuditor()) {
            Swal.fire({
                icon: 'error',
                title: 'Error en precios',
                text: 'Algunos precios superan los límites permitidos. Por favor, corrígelos.',
                confirmButtonColor: '#dc3545'
            });
            return;
        }
        
        // Recopilar datos
        const productos = [];
        $('.producto-item-auditor').each(function() {
            const $item = $(this);
            const index = $item.data('product-index');
            
            // Convertir precios con comas a formato decimal
            const precioBs = convertDecimalForBackend($item.find('.precio-bs').val());
            const precioUSD = convertDecimalForBackend($item.find('.precio-usd').val());
            
            productos.push({
                id: parseInt($item.find('.form-product-id').val()),
                sku: $item.find('.form-product-sku').val(),
                fabricante: $item.find('.form-fabricante').val(),
                inventarioInicial: $item.find('.inventario-inicial').val(),
                inventarioFinal: $item.find('.inventario-final').val(),
                caras: $item.find('.caras-input').val(),
                inventarioDeposito: $item.find('.inventario-deposito').val() || 0,
                precioBs: precioBs,
                precioUSD: precioUSD
            });
        });
        
        // Obtener datos adicionales
        const data = {
            route_id: $('#auditorRouteId').val(),
            point_id: $('#auditorPointId').val(),
            category_id: $('#auditorCategoryId').val(),
            cedula: $('#auditorCedula').val(), 
            fecha_ingreso: $('#auditorFechaIngreso').val(),
            fecha_carga: $('#auditorFechaCarga').val(),
            fecha_final_carga: new Date().toISOString(),
            productos: productos
        };
        
        // Enviar al backend
        submitAuditorData(data);
    });
}

// ✅ NUEVO: Configurar inputs decimales para auditor
function configurarInputsDecimalesAuditor() {
    // Evento para formatear en tiempo real
    $(document).on('input', '.decimal-input', function(e) {
        // Permitir borrar
        if (e.originalEvent.inputType === 'deleteContentBackward' ||
            e.originalEvent.inputType === 'deleteContentForward') {
            return;
        }
        
        formatDecimalInput(this);
    });
    
    // Evento para formatear al perder foco
    $(document).on('blur', '.decimal-input', function() {
        formatDecimalOnBlur(this);
    });
    
    // Evento para capturar punto y convertirlo a coma
    $(document).on('keydown', '.decimal-input', function(e) {
        // Si presiona punto, convertirlo a coma
        if (e.key === '.') {
            e.preventDefault();
            const input = this;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const value = input.value;
            
            // Insertar coma en la posición del cursor
            input.value = value.substring(0, start) + ',' + value.substring(end);
            
            // Mover cursor después de la coma
            input.setSelectionRange(start + 1, start + 1);
            
            // Formatear
            formatDecimalInput(input);
        }
    });
    
    // Prevenir entrada de caracteres no numéricos
    $(document).on('keypress', '.decimal-input', function(e) {
        const char = String.fromCharCode(e.which);
        
        // Permitir: números, coma, backspace, delete, tab, enter, flechas
        if (e.which === 8 || e.which === 46 || e.which === 9 ||
            e.which === 13 || (e.which >= 37 && e.which <= 40)) {
            return;
        }
        
        // Validar que sea número o coma
        const regex = /[0-9,]/;
        if (!regex.test(char)) {
            e.preventDefault();
            return false;
        }
        
        // Validar que solo haya una coma
        const currentValue = $(this).val();
        if (char === ',' && currentValue.includes(',')) {
            e.preventDefault();
            return false;
        }
    });
}

// Función para formatear entrada decimal con comas
function formatDecimalInput(input) {
    let value = input.value;
    
    // Reemplazar punto por coma
    value = value.replace(/\./g, ',');
    
    // Validar que solo tenga números, una coma y hasta 2 decimales
    const regex = /^\d*[,]?\d{0,2}$/;
    if (value !== '' && !regex.test(value)) {
        // Si no cumple, revertir al último valor válido
        input.value = input.getAttribute('data-last-valid') || '';
        return;
    }
    
    // Guardar como último valor válido
    input.setAttribute('data-last-valid', value);
    
    // Aplicar límite de máximo
    const max = parseFloat(input.getAttribute('data-max'));
    const numericValue = parseFloat(value.replace(',', '.'));
    
    if (!isNaN(numericValue) && numericValue > max) {
        input.classList.add('is-invalid');
        // Verificar que exista antes de manipular
        if (input.nextElementSibling && input.nextElementSibling.classList.contains('invalid-feedback')) {
            input.nextElementSibling.style.display = 'block';
        }
        input.value = max.toFixed(2).replace('.', ',');
        input.setAttribute('data-last-valid', input.value);
    } else {
        input.classList.remove('is-invalid');
        if (input.nextElementSibling && input.nextElementSibling.classList.contains('invalid-feedback')) {
            input.nextElementSibling.style.display = 'none';
        }
    }
}

// Función para formatear al perder foco (blur)
function formatDecimalOnBlur(input) {
    let value = input.value;
    if (value === '') return;
    
    // Si termina con coma, agregar "00"
    if (value.endsWith(',')) {
        value = value + '00';
    }
    
    // Si no tiene coma, agregar ",00"
    if (!value.includes(',')) {
        value = value + ',00';
    }
    
    // Asegurar 2 decimales
    const parts = value.split(',');
    if (parts.length === 2) {
        if (parts[1].length === 0) {
            parts[1] = '00';
        } else if (parts[1].length === 1) {
            parts[1] = parts[1] + '0';
        } else if (parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
        }
        value = parts[0] + ',' + parts[1];
    }
    
    // Aplicar límite nuevamente
    input.value = value;
    formatDecimalInput(input);
}

// Función para convertir comas a puntos para el backend
function convertDecimalForBackend(value) {
    if (!value) return "0";
    return value.replace(',', '.');
}

// Función para validar todos los precios antes de enviar
function validateAllPricesAuditor() {
    let isValid = true;
    
    $('.decimal-input').each(function() {
        const value = $(this).val();
        const max = parseFloat($(this).data('max'));
        const numericValue = parseFloat(value.replace(',', '.'));
        
        if (!isNaN(numericValue) && numericValue > max) {
            $(this).addClass('is-invalid');
            $(this).siblings('.invalid-feedback').show();
            isValid = false;
        } else {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').hide();
        }
    });
    
    return isValid;
}

// ✅ NUEVO: Enviar datos de auditor al backend
// ✅ CORREGIDA: NO cerrar modal después de guardar
async function submitAuditorData(data) {
    try {
        // Mostrar loading
        const submitBtn = $('#btnSubmitAuditorData');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Guardando...
        `);
        
        const response = await fetch('/auditor/api/save-auditor-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        
        const result = await response.json();
        
        // Restaurar botón
        submitBtn.prop('disabled', false).html(originalText);
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                html: `
                    <p>Datos guardados exitosamente</p>
                    <ul class="text-start">
                        <li><strong>Visitas creadas:</strong> ${result.visitas_creadas || 0}</li>
                        <li><strong>Productos guardados:</strong> ${result.productos_guardados || 0}</li>
                    </ul>
                `,
                confirmButtonColor: '#28a745',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false
            });
            
            // ✅ CRÍTICO: NO CERRAR MODAL - Esperar 2.1s y mostrar vista de punto activo
            setTimeout(() => {
                // Verificar que las variables globales estén definidas
                if (!currentAuditorPoint || !currentAuditorRoute || !currentAuditorCategory) {
                    console.error('❌ Variables globales no definidas:', {
                        currentAuditorPoint,
                        currentAuditorRoute,
                        currentAuditorCategory
                    });
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Contexto perdido. Por favor, vuelve a activar el punto.',
                        confirmButtonColor: '#dc3545'
                    });
                    $('#categoriesModal').modal('hide');
                    return;
                }
                
                // ✅ Mostrar vista de punto activo DENTRO del mismo modal
                showAuditorActivePointView(
                    currentAuditorPoint.id,
                    currentAuditorRoute.id,
                    currentAuditorCategory.cedula,
                    currentAuditorCategory.name
                );
            }, 2100);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar: ' + (result.message || 'Error desconocido'),
                confirmButtonColor: '#dc3545'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        
        // Restaurar botón
        const submitBtn = $('#btnSubmitAuditorData');
        submitBtn.prop('disabled', false).html(
            '<i class="fas fa-save me-2"></i>Guardar Datos'
        );
        
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Error al enviar los datos. Verifica tu conexión e intenta nuevamente.',
            confirmButtonColor: '#dc3545'
        });
    }
}


// Desactivar ruta para auditor - ✅ CORREGIDO: Usar endpoint del blueprint
function desactivarRutaAuditor(routeId) {
    const cedula = sessionStorage.getItem('auditor_cedula');
    
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
    
    fetch(`/auditor/api/route-active-points-auditor/${routeId}`, {
        method: 'GET',
        headers: {
            'X-Auditor-Cedula': cedula
        },
        credentials: 'include'
    })
    .then(response => response.json())
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
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong>No puedes desactivar esta ruta</strong>
                    <p class="mt-2 mb-0">Tienes <strong>${data.puntos_activos} punto(s)</strong> activo(s) sin desactivar:</p>
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
            title: '¿Desactivar ruta?',
            text: 'Esta acción finalizará el progreso de la ruta',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, desactivar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Desactivando ruta...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                });
                
                fetch('/auditor/api/desactivar-ruta-auditor', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Auditor-Cedula': cedula
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
                            title: 'Ruta desactivada',
                            text: 'El estado de la ruta ha sido actualizado',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        
                        // Volver al estado inicial
                        $(`#btn-activar-${routeId}`).removeClass('d-none');
                        $(`#btn-ver-${routeId}`).addClass('d-none');
                        $(`#btn-desactivar-${routeId}`).addClass('d-none');
                        
                        // Recargar rutas
                        const cedulaReload = sessionStorage.getItem('auditor_cedula');
                        loadAuditorRoutes(cedulaReload);
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

// Actualizar rutas
function refreshAuditorRoutes() {
    const cedula = sessionStorage.getItem('auditor_cedula');
    loadAuditorRoutes(cedula);
}

// Volver al dashboard - ✅ CORREGIDO: Usar URL correcta
function goBackToDashboard() {
    window.location.href = '/auditor/dashboard';
}

// Logout del auditor
function logoutAuditor() {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro que deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar sesión
            sessionStorage.clear();
            // Redirigir al login
            window.location.href = '/login';
        }
    });
}

// Reemplazar el handler existente de #cameraInputAuditor
$(document).on('change', '#cameraInputAuditor', async function(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const cedula = sessionStorage.getItem('auditor_cedula');
    
    // Obtener GPS del dispositivo
    const deviceGPS = await captureAuditorMetadata();
    console.log("📍 GPS obtenido del dispositivo:", deviceGPS);
    
    // Si es desactivación, subir directamente sin modal de preview
    if (currentPhotoType === 'desactivacion') {
        Swal.fire({
            title: 'Subiendo foto de desactivación...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        const formData = new FormData();
        formData.append('photo', file);
        formData.append('point_id', currentAuditorPoint.id);
        formData.append('cedula', cedula);
        formData.append('photo_type', 'desactivacion');
        formData.append('route_id', currentAuditorRoute?.id || '');
        formData.append('lat', deviceGPS.lat || '');
        formData.append('lon', deviceGPS.lon || '');
        formData.append('alt', deviceGPS.alt || '');
        
        try {
            // Usar el endpoint de mercaderistas (funciona para auditores también)
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
            text: 'La foto de desactivación fue subida correctamente',
            timer: 1500,
            showConfirmButton: false
        });
        
        // ✅ CERRAR MODAL y recargar puntos
        setTimeout(() => {
            $('#categoriesModal').modal('hide');
            if (currentAuditorRoute) {
                loadAuditorRoutePoints(currentAuditorRoute.id);
            }
        }, 1600);
    } else {
                Swal.fire('Error', data.message || 'No se pudo desactivar el punto', 'error');
            }
        } catch (err) {
            Swal.close();
            console.error('Error al subir foto de desactivación:', err);
            Swal.fire('Error', `Error al subir la foto: ${err.message}`, 'error');
        }
        
        // Limpiar input
        $(this).val('');
        return;
    }
    
    // Si es activación (flujo existente)
    $('#activacionModal').modal('show');
    const objectUrl = URL.createObjectURL(file);
    $('#previewImage').attr('src', objectUrl);
    $('#photoPreviewContainer').show();
    auditorSelectedPhotoFile = file;
    $(this).val('');
});

// Agregar al final de $(document).ready(function() { ... })
$('#categoriesModal').on('hidden.bs.modal', function () {
    // ✅ Cerrar también el modal de puntos
    $('#puntosModal').modal('hide');
    
    // ✅ Recargar las rutas para actualizar los botones
    const cedula = sessionStorage.getItem('auditor_cedula');
    if (cedula) {
        setTimeout(() => {
            loadAuditorRoutes(cedula);
        }, 300);
    }
});


// Agregar clase CSS para hover effect
$(document).ready(function() {
    $('<style>.hover-shadow:hover { box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; transform: translateY(-3px) !important; }</style>').appendTo('head');
});

// ✅ NUEVA: Mostrar vista de punto activo después de guardar categoría
function showAuditorActivePointView(pointId, routeId, cedula, savedCategoryName) {
    // Guardar contexto global
    if (!currentAuditorPoint) {
        currentAuditorPoint = { id: pointId, name: 'Punto' }; // Nombre se obtendrá después
    }
    if (!currentAuditorRoute) {
        currentAuditorRoute = { id: routeId };
    }
    
    // Obtener nombre del punto si no está definido
    if (!currentAuditorPoint.name || currentAuditorPoint.name === 'Punto') {
        fetch(`/auditor/api/point-name/${pointId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.name) {
                currentAuditorPoint.name = data.name;
                $('#categoriesModalLabel').html(`
                    <i class="fas fa-map-marker-alt me-2"></i>Punto Activo - ${data.name}
                    <button class="btn btn-sm btn-outline-secondary ms-3" onclick="closeAuditorActivePointView()">
                        <i class="fas fa-times me-1"></i> Finalizar y Volver a Rutas
                    </button>
                `);
            }
        })
        .catch(err => console.error('Error al obtener nombre del punto:', err));
    }
    
    // Actualizar título del modal
    $('#categoriesModalLabel').html(`
        <i class="fas fa-map-marker-alt me-2"></i>Punto Activo - ${currentAuditorPoint.name || pointId}
        <button class="btn btn-sm btn-outline-secondary ms-3" onclick="closeAuditorActivePointView()">
            <i class="fas fa-times me-1"></i> Finalizar y Volver a Rutas
        </button>
    `);
    
    // Mostrar loading
    $('#categoriesModalBody').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando opciones disponibles...</p>
        </div>
    `);
    
    // Cargar categorías restantes
    fetch(`/auditor/api/point-categories/${pointId}/${routeId}?cedula=${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar categorías');
        return response.json();
    })
    .then(categories => {
        let html = `
            <div class="alert alert-success mb-3">
                <i class="fas fa-check-circle me-2"></i>
                <strong>✅ Datos guardados:</strong> ${savedCategoryName}
            </div>
            <div class="alert alert-info mb-4">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Punto activo:</strong> Puedes cargar más categorías o desactivar el punto cuando termines.
            </div>
            
            <h5 class="mb-3"><i class="fas fa-tags me-2"></i>Categorías Disponibles</h5>
        `;
        
        // Mostrar categorías restantes
        if (!categories || categories.length === 0) {
            html += `
                <div class="alert alert-warning text-center">
                    <i class="fas fa-check-circle fs-1 text-success"></i>
                    <p class="mt-3 mb-0"><strong>¡Excelente!</strong> Has cargado todas las categorías de este punto.</p>
                </div>
            `;
        } else {
            html += '<div class="row" id="remainingCategoriesContainer">';
            categories.forEach(category => {
                html += `
                    <div class="col-md-6 mb-3">
                        <div class="card h-100 border-primary hover-shadow category-card"
                             data-category-id="${category.id}"
                             data-category-name="${encodeURIComponent(category.nombre)}"
                             style="cursor: pointer;">
                            <div class="card-body text-center">
                                <div class="mb-3">
                                    <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                                         style="width: 60px; height: 60px;">
                                        <i class="fas fa-cube fs-3"></i>
                                    </div>
                                </div>
                                <h5 class="card-title">${category.nombre}</h5>
                                <p class="text-muted mb-1">
                                    <i class="fas fa-users me-1"></i> ${category.total_clientes} cliente(s)
                                </p>
                                <span class="badge bg-primary mt-2">Cargar datos</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
        }
        
        // ✅ SECCIÓN DE DESACTIVACIÓN (igual que mercaderista)
        html += `
            <div class="card mt-4 border-danger">
                <div class="card-header bg-danger text-white">
                    <h5 class="mb-0"><i class="fas fa-power-off me-2"></i>Desactivar Punto</h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        <strong>Requisitos para desactivar:</strong> Debes marcar ambas tareas
                    </div>
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="checkbox" id="limpieza_auditor" onchange="checkAuditorDesactivarButton()">
                        <label class="form-check-label fw-bold" for="limpieza_auditor">
                            Limpieza de PDV
                        </label>
                        <p class="text-muted small mb-0">Se realizó limpieza completa del punto de venta</p>
                    </div>
                    <div class="form-check mb-3">
                        <input class="form-check-input" type="checkbox" id="fifo_auditor" onchange="checkAuditorDesactivarButton()">
                        <label class="form-check-label fw-bold" for="fifo_auditor">
                            Realizar FIFO
                        </label>
                        <p class="text-muted small mb-0">Se realizó rotación de inventario (First In, First Out)</p>
                    </div>
                    <div class="text-end">
                        <button class="btn btn-outline-danger" id="btnDesactivarAuditorPoint" disabled 
                                onclick="deactivateAuditorPoint('${pointId.replace(/'/g, "\\'")}', '${(currentAuditorPoint.name || pointId).replace(/'/g, "\\'")}')">
                            <i class="fas fa-power-off me-1"></i> Desactivar Punto
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        $('#categoriesModalBody').html(html);
        
        // Configurar eventos para categorías restantes
        $('#remainingCategoriesContainer').off('click', '.category-card')
            .on('click', '.category-card', function() {
                const categoryId = $(this).data('category-id');
                const categoryName = decodeURIComponent($(this).data('category-name'));
                console.log('🎯 Categoría seleccionada:', categoryId, categoryName);
                
                showProductsForCategory(categoryId, categoryName, pointId, routeId, cedula);
            });
        
        // Inicializar estado del botón de desactivación
        checkAuditorDesactivarButton();
    })
    .catch(error => {
        console.error('❌ Error al cargar categorías:', error);
        $('#categoriesModalBody').html(`
            <div class="alert alert-danger text-center">
                <i class="fas fa-exclamation-triangle fs-1"></i>
                <p class="mt-3 mb-0">Error al cargar las categorías: ${error.message}</p>
                <button class="btn btn-primary mt-3" onclick="showAuditorActivePointView('${pointId}', '${routeId}', '${cedula}', '${savedCategoryName}')">
                    <i class="fas fa-redo me-1"></i> Reintentar
                </button>
            </div>
        `);
    });
}

// ✅ NUEVA: Verificar checkboxes para desactivación
function checkAuditorDesactivarButton() {
    const limpiezaChecked = $('#limpieza_auditor').is(':checked');
    const fifoChecked = $('#fifo_auditor').is(':checked');
    const $btn = $('#btnDesactivarAuditorPoint');
    
    $btn.prop('disabled', !(limpiezaChecked && fifoChecked));
    if (limpiezaChecked && fifoChecked) {
        $btn.removeClass('btn-outline-danger').addClass('btn-danger');
        $btn.html('<i class="fas fa-power-off me-1"></i> Desactivar Punto');
    } else {
        $btn.removeClass('btn-danger').addClass('btn-outline-danger');
        $btn.html('<i class="fas fa-power-off me-1"></i> Desactivar Punto');
    }
}

// ✅ NUEVA: Desactivar punto desde vista de auditor
function deactivateAuditorPoint(pointId, pointName) {
    // Verificar checkboxes nuevamente
    if (!$('#limpieza_auditor').is(':checked') || !$('#fifo_auditor').is(':checked')) {
        Swal.fire({
            icon: 'warning',
            title: 'Tareas pendientes',
            html: `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-octagon me-2"></i>
                    <strong>¡Atención!</strong><br>
                    Debes completar y marcar ambas tareas antes de desactivar el punto.
                </div>
            `,
            confirmButtonText: 'Entendido'
        });
        return;
    }
    
    Swal.fire({
        title: '¿Desactivar punto?',
        html: `
            <p><strong>Punto:</strong> ${pointName}</p>
            <div class="alert alert-success mt-3">
                <i class="fas fa-check-circle me-2"></i>
                <strong>Tareas completadas:</strong>
                <ul class="mb-0 mt-2">
                    <li><i class="fas fa-check-circle-fill text-success"></i> Limpieza de PDV ✅</li>
                    <li><i class="fas fa-check-circle-fill text-success"></i> Realizar FIFO ✅</li>
                </ul>
            </div>
            <p class="text-warning mt-2">
                <i class="fas fa-info-circle me-1"></i>
                Se tomará una foto de desactivación para finalizar la visita.
            </p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-power-off me-1"></i> Sí, desactivar',
        cancelButtonText: '<i class="fas fa-times me-1"></i> Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            currentAuditorPoint = { id: pointId, name: pointName };
            currentPhotoType = 'desactivacion';
            
            // Abrir cámara para foto de desactivación
            $('#cameraInputAuditor').click();
            
            // Resetear checkboxes después de iniciar proceso
            setTimeout(() => {
                $('#limpieza_auditor, #fifo_auditor').prop('checked', false);
                checkAuditorDesactivarButton();
            }, 500);
        }
    });
}

// ✅ Cerrar vista de punto activo y volver a rutas
function closeAuditorActivePointView() {
    $('#categoriesModal').modal('hide');
    
    // Recargar puntos para actualizar estado
    if (currentAuditorRoute && currentAuditorRoute.id) {
        setTimeout(() => {
            loadAuditorRoutePoints(currentAuditorRoute.id);
        }, 300);
    }
}

// ✅ Subir foto de desactivación para auditor
async function uploadDeactivationPhotoAuditor() {
    if (!auditorSelectedPhotoFile) {
        Swal.fire('Error', 'No hay foto seleccionada', 'error');
        return;
    }
    
    if (!currentAuditorPoint || !currentAuditorRoute) {
        Swal.fire('Error', 'Contexto perdido. Por favor, vuelve a activar el punto.', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Subiendo foto de desactivación...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    const cedula = sessionStorage.getItem('auditor_cedula') || current_user_cedula;
    const gpsData = await captureAuditorMetadata();
    
    const formData = new FormData();
    formData.append('photo', auditorSelectedPhotoFile);
    formData.append('point_id', currentAuditorPoint.id);
    formData.append('cedula', cedula);
    formData.append('route_id', currentAuditorRoute.id);
    formData.append('lat', gpsData.lat || '');
    formData.append('lon', gpsData.lon || '');
    formData.append('alt', gpsData.alt || '');
    formData.append('photo_type', 'desactivacion'); // Tipo de foto
    
    try {
        const response = await fetch('/auditor/api/upload-deactivation-photo-auditor', {
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
                text: 'La foto de desactivación fue subida correctamente',
                timer: 1500,
                showConfirmButton: false
            });
            
            // ✅ Cerrar modal y recargar puntos
            setTimeout(() => {
                $('#categoriesModal').modal('hide');
                if (currentAuditorRoute && currentAuditorRoute.id) {
                    loadAuditorRoutePoints(currentAuditorRoute.id);
                }
            }, 1600);
        } else {
            Swal.fire('Error', data.message || 'Error al subir foto de desactivación', 'error');
        }
    } catch (err) {
        Swal.close();
        console.error('Error al subir foto de desactivación:', err);
        Swal.fire('Error', `Error de conexión: ${err.message}`, 'error');
    }
}

function crearPlantillaProductoAuditor(index) {
    return `
    <div class="producto-item border rounded p-3 mb-3" data-producto-index="${index}">
        <div class="d-flex justify-content-between align-items-center mb-2">
            <h6 class="mb-0">
                <i class="fas fa-box me-1"></i>Producto <span class="producto-numero">${index + 1}</span>
            </h6>
            <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-producto-auditor" 
                onclick="eliminarProductoAuditor(this)" style="${index === 0 ? 'display:none;' : ''}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="row mb-2">
            <div class="col-md-6">
                <label class="form-label">Producto</label>
                <div class="input-group">
                    <span class="input-group-text"><i class="fas fa-search"></i></span>
                    <input type="text" 
                        class="form-control producto-search-auditor"
                        placeholder="Buscar producto..."
                        data-index="${index}"
                        autocomplete="off">
                    <input type="hidden" class="producto-id" value="">
                    <input type="hidden" class="producto-sku" value="">
                </div>
                <div class="dropdown-menu w-100 mt-1 p-0 auditor-product-dropdown" id="dropdown-auditor-${index}" style="position: absolute; z-index: 1000; display: none;">
                    <div class="p-2 border-bottom">
                        <input type="text" 
                            class="form-control form-control-sm search-filter-auditor" 
                            placeholder="Filtrar productos..."
                            data-index="${index}"
                            autocomplete="off">
                    </div>
                    <div class="dropdown-productos-list" style="max-height: 250px; overflow-y: auto; padding: 0.5rem;">
                        <!-- Productos se cargarán aquí -->
                    </div>
                </div>
                <div class="form-text"><small>Escribe para buscar o haz clic para ver todos</small></div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Fabricante</label>
                <input type="text" class="form-control fabricante-input" readonly>
            </div>
        </div>
        <div class="row mb-2">
            <div class="col-md-4">
                <label class="form-label">Inventario Inicial</label>
                <input type="number" class="form-control inventario-inicial" min="0" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Inventario Final</label>
                <input type="number" class="form-control inventario-final" min="0" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Caras</label>
                <input type="number" class="form-control caras-input" min="0" required>
            </div>
        </div>
        <div class="row">
            <div class="col-md-4">
                <label class="form-label">Precio en Bs</label>
                <div class="input-group">
                    <span class="input-group-text">Bs</span>
                    <input type="text" class="form-control precio-bs decimal-input" 
                        placeholder="0,00" data-max="35500" data-moneda="Bs">
                </div>
                <div class="invalid-feedback">Máx: 35.500 Bs</div>
                <small class="form-text text-muted">Usa coma para decimales</small>
            </div>
            <div class="col-md-4">
                <label class="form-label">Precio en USD</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="text" class="form-control precio-usd decimal-input" 
                        placeholder="0,00" data-max="100" data-moneda="USD">
                </div>
                <div class="invalid-feedback">Máx: 100 USD</div>
                <small class="form-text text-muted">Usa coma para decimales</small>
            </div>
            <div class="col-md-4">
                <label class="form-label">Inventario en Depósito</label>
                <input type="number" class="form-control inventario-deposito" min="0" value="0">
            </div>
        </div>
    </div>
    `;
}

function renderAuditorDynamicForm(products, categoryId, categoryName, pointId, routeId, cedula) {
    // Guardar productos en memoria para búsquedas
    window.auditorProductosCache = products;
    
    let html = `
    <div class="alert alert-primary mb-3">
        <i class="fas fa-edit me-2"></i>
        <strong>Cargando datos para la categoría:</strong> ${categoryName}
    </div>
    <div id="auditorDataFormContainer">
        <form id="auditorDataForm">
            <input type="hidden" id="auditorCategoryId" value="${categoryId}">
            <input type="hidden" id="auditorPointId" value="${pointId}">
            <input type="hidden" id="auditorRouteId" value="${routeId}">
            <input type="hidden" id="auditorCedula" value="${cedula}">
            <input type="hidden" id="auditorFechaIngreso" value="${sessionStorage.getItem('fechaIngreso')}">
            <input type="hidden" id="auditorFechaCarga" value="${new Date().toISOString()}">
            
            <div id="auditorProductosContainer">
                ${crearPlantillaProductoAuditor(0)}
            </div>
            
            <div class="text-center mt-3">
                <button type="button" class="btn btn-outline-primary" id="btnAgregarProductoAuditor">
                    <i class="fas fa-plus-circle me-1"></i>Agregar Producto
                </button>
            </div>
            
            <div class="alert alert-info mt-3">
                <i class="fas fa-info-circle me-2"></i>
                <strong>Importante:</strong> Los datos se guardarán para todos los clientes que tienen estos productos en esta categoría.
            </div>
            
            <div class="d-grid gap-2 mt-3">
                <button type="submit" class="btn btn-success btn-lg" id="btnSubmitAuditorData">
                    <i class="fas fa-save me-2"></i>Guardar Datos
                </button>
                <button type="button" class="btn btn-secondary btn-lg"
                    onclick="showCategoriesModal(${pointId}, ${routeId}, '${cedula}')">
                    <i class="fas fa-arrow-left me-2"></i>Volver a Categorías
                </button>
            </div>
        </form>
    </div>
    `;
    
    $('#categoriesModalBody').html(html);
    auditorProductoIndex = 1;
    
    // Inicializar dropdowns con productos
    inicializarDropdownsAuditor(products);
    
    // Configurar eventos
    configurarEventosAuditorForm();
    configurarInputsDecimalesAuditor();
}

function inicializarDropdownsAuditor(products) {
    $('.auditor-product-dropdown').each(function(index, dropdown) {
        const $dropdown = $(dropdown);
        const $list = $dropdown.find('.dropdown-productos-list');
        $list.empty();
        
        products.forEach(producto => {
            if (!AUDITOR_PRODUCTOS_SELECCIONADOS.has(producto.id.toString())) {
                const item = $(`
                <button type="button" class="dropdown-item d-flex justify-content-between align-items-center auditor-product-option"
                    data-id="${producto.id}"
                    data-sku="${producto.sku}"
                    data-fabricante="${producto.fabricante || ''}">
                    <div>
                        <strong>${producto.sku}</strong><br>
                        <small class="text-muted">${producto.fabricante || 'Sin fabricante'}</small>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
                `);
                $list.append(item);
            }
        });
        
        if ($list.children().length === 0) {
            $list.html('<div class="dropdown-item text-muted"><i class="fas fa-search me-2"></i>No hay productos disponibles</div>');
        }
    });
}

function configurarEventosAuditorForm() {
    // Toggle dropdown al hacer clic en input de búsqueda
    $(document).off('click focus', '.producto-search-auditor')
        .on('click focus', '.producto-search-auditor', function() {
            const index = $(this).data('index');
            $(`.auditor-product-dropdown`).hide();
            $(`#dropdown-auditor-${index}`).show();
            $(this).select();
        });
    
    // Cerrar dropdowns al hacer clic fuera
    $(document).off('click.auditorDropdown').on('click.auditorDropdown', function(e) {
        if (!$(e.target).closest('.producto-search-auditor, .auditor-product-dropdown').length) {
            $('.auditor-product-dropdown').hide();
        }
    });
    
    // Selección de producto
    $(document).off('click', '.auditor-product-option')
        .on('click', '.auditor-product-option', function(e) {
            e.stopPropagation();
            const $item = $(this);
            const $row = $item.closest('.producto-item');
            const productId = $item.data('id');
            const sku = $item.data('sku');
            const fabricante = $item.data('fabricante');
            const index = $row.data('producto-index');
            
            // Establecer valores
            $row.find('.producto-search-auditor').val(sku);
            $row.find('.producto-id').val(productId);
            $row.find('.producto-sku').val(sku);
            $row.find('.fabricante-input').val(fabricante || 'N/A');
            
            // Marcar como seleccionado
            AUDITOR_PRODUCTOS_SELECCIONADOS.add(productId.toString());
            
            // Cerrar dropdown
            $(`#dropdown-auditor-${index}`).hide();
            
            // Actualizar otros dropdowns
            actualizarDropdownsAuditor();
        });
    
    // Búsqueda en tiempo real en dropdowns
    $(document).off('keyup', '.search-filter-auditor')
        .on('keyup', '.search-filter-auditor', function() {
            const searchTerm = $(this).val().toLowerCase();
            const index = $(this).data('index');
            const $list = $(`#dropdown-auditor-${index} .dropdown-productos-list`);
            const productos = window.auditorProductosCache || [];
            
            $list.empty();
            
            const filtered = productos.filter(p => 
                p.sku.toLowerCase().includes(searchTerm) && 
                !AUDITOR_PRODUCTOS_SELECCIONADOS.has(p.id.toString())
            );
            
            if (filtered.length === 0) {
                $list.html('<div class="dropdown-item text-muted"><i class="fas fa-search me-2"></i>No hay coincidencias</div>');
                return;
            }
            
            filtered.forEach(producto => {
                const item = $(`
                <button type="button" class="dropdown-item d-flex justify-content-between align-items-center auditor-product-option"
                    data-id="${producto.id}"
                    data-sku="${producto.sku}"
                    data-fabricante="${producto.fabricante || ''}">
                    <div>
                        <strong>${producto.sku}</strong><br>
                        <small class="text-muted">${producto.fabricante || 'Sin fabricante'}</small>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
                `);
                $list.append(item);
            });
        });
    
    // Agregar producto
    // ✅ AGREGAR PRODUCTO SIN LÍMITE (igual que mercaderista)
$('#btnAgregarProductoAuditor').off('click').on('click', function() {
    // Eliminado chequeo de límite de 10 productos
    $('#auditorProductosContainer').append(crearPlantillaProductoAuditor(auditorProductoIndex));
    inicializarDropdownsAuditor(window.auditorProductosCache);
    auditorProductoIndex++;
    actualizarBotonesEliminarAuditor();
    reenumerarProductosAuditor();
    
    // ✨ Opcional: Scroll suave al nuevo producto
    $('#auditorProductosContainer').scrollTop(
        $('#auditorProductosContainer')[0].scrollHeight
    );
});
    
    // Submit del formulario
    $('#auditorDataForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        if (!validateAllPricesAuditor()) {
            Swal.fire({
                icon: 'error',
                title: 'Error en precios',
                text: 'Corrige los precios que exceden los límites',
                confirmButtonColor: '#dc3545'
            });
            return;
        }
        
        // Recopilar datos
        const productos = [];
        $('.producto-item').each(function() {
            const $row = $(this);
            const productId = $row.find('.producto-id').val();
            if (!productId) return;
            
            productos.push({
                id: parseInt(productId),
                sku: $row.find('.producto-sku').val(),
                fabricante: $row.find('.fabricante-input').val(),
                inventarioInicial: $row.find('.inventario-inicial').val(),
                inventarioFinal: $row.find('.inventario-final').val(),
                caras: $row.find('.caras-input').val(),
                inventarioDeposito: $row.find('.inventario-deposito').val() || 0,
                precioBs: convertDecimalForBackend($row.find('.precio-bs').val()),
                precioUSD: convertDecimalForBackend($row.find('.precio-usd').val())
            });
        });
        
        if (productos.length === 0) {
            Swal.fire('Advertencia', 'Selecciona al menos un producto', 'warning');
            return;
        }
        
        const data = {
            route_id: $('#auditorRouteId').val(),
            point_id: $('#auditorPointId').val(),
            category_id: $('#auditorCategoryId').val(),
            cedula: $('#auditorCedula').val(),
            fecha_ingreso: $('#auditorFechaIngreso').val(),
            fecha_carga: $('#auditorFechaCarga').val(),
            fecha_final_carga: new Date().toISOString(),
            productos: productos
        };
        
        submitAuditorData(data);
    });
}


// Eliminar producto y liberar del pool
function eliminarProductoAuditor(button) {
    const $row = $(button).closest('.producto-item');
    const productId = $row.find('.producto-id').val();
    const index = $row.data('producto-index');
    
    // Liberar producto para otros dropdowns
    if (productId) {
        AUDITOR_PRODUCTOS_SELECCIONADOS.delete(productId.toString());
        actualizarDropdownsAuditor();
    }
    
    $row.remove();
    actualizarBotonesEliminarAuditor();
    reenumerarProductosAuditor();
    auditorProductoIndex = $('.producto-item').length;
}

// Actualizar dropdowns después de selección/eliminación
function actualizarDropdownsAuditor() {
    const productos = window.auditorProductosCache || [];
    $('.auditor-product-dropdown').each(function() {
        const $dropdown = $(this);
        const $list = $dropdown.find('.dropdown-productos-list');
        const currentIndex = $dropdown.attr('id').replace('dropdown-auditor-', '');
        
        $list.empty();
        
        productos.forEach(producto => {
            if (!AUDITOR_PRODUCTOS_SELECCIONADOS.has(producto.id.toString())) {
                const item = $(`
                <button type="button" class="dropdown-item d-flex justify-content-between align-items-center auditor-product-option"
                    data-id="${producto.id}"
                    data-sku="${producto.sku}"
                    data-fabricante="${producto.fabricante || ''}">
                    <div>
                        <strong>${producto.sku}</strong><br>
                        <small class="text-muted">${producto.fabricante || 'Sin fabricante'}</small>
                    </div>
                    <i class="fas fa-chevron-right"></i>
                </button>
                `);
                $list.append(item);
            }
        });
        
        if ($list.children().length === 0) {
            $list.html('<div class="dropdown-item text-muted"><i class="fas fa-check-circle text-success me-2"></i>Todos los productos seleccionados</div>');
        }
    });
}

// Actualizar visibilidad de botones eliminar
function actualizarBotonesEliminarAuditor() {
    const total = $('.producto-item').length;
    $('.btn-eliminar-producto-auditor').toggle(total > 1);
}

// Reenumerar productos
function reenumerarProductosAuditor() {
    $('.producto-item').each(function(index) {
        $(this).find('.producto-numero').text(index + 1);
        $(this).attr('data-producto-index', index);
        $(this).find('.producto-search-auditor').attr('data-index', index);
        $(this).find('.search-filter-auditor').attr('data-index', index);
    });
}