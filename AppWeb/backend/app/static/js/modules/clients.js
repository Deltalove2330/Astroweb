//js/modules/client.js
import { formatDate, showLoading, showError } from './utils.js';

let currentClientId = null;
let currentClientName = null;
let currentSection = null;

export function loadClients() {
    $.getJSON("/api/clients")
        .done(function(rutas) {
            renderClientList(rutas);
            
            // Si no hay rutas para el día actual, mostrar mensaje
            if (rutas.length === 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin rutas programadas',
                    text: 'No hay rutas programadas para hoy',
                    showConfirmButton: false,
                    timer: 2000
                });
                
                // Opcional: actualizar el mensaje en el sidebar
                $('#client-list').html(`
                    <li class="text-muted p-3">
                        <small><i class="bi bi-info-circle"></i> No hay rutas programadas para hoy</small>
                    </li>
                `);
            }
        })
        .fail(function() {
            showError('#client-list', 'Error al cargar rutas');
        });
}

// versión completa con la nueva propiedad has_high_priority
export function renderClientList(rutas) {
    const $pointList = $('#client-list').empty();
    
    if (rutas.length > 0) {
        $pointList.append(`
            <li class="text-muted small px-3 py-1 border-bottom">
                <i class="bi bi-info-circle"></i> ${rutas.length} rutas disponibles
            </li>
        `);
    }
    
    rutas.forEach((ruta, index) => {
        // Usar la nueva propiedad has_high_priority
        const hasHighPriority = ruta.has_high_priority || ruta.alta_count > 0;
        
        const $rutaItem = $(`
            <li class="nav-item">
                <div class="cliente-link d-flex justify-content-between align-items-center" 
                     data-id="${ruta.id}" 
                     data-name="${ruta.nombre}"
                     title="${ruta.nombre}">
                    <div class="flex-grow-1 text-truncate">
                        <i class="bi bi-geo-alt me-2"></i>
                        <span class="client-name">${ruta.nombre}</span>
                        ${hasHighPriority ? '<i class="bi bi-exclamation-triangle-fill text-danger ms-2" title="Contiene puntos de prioridad alta"></i>' : ''}
                    </div>
                    <i class="bi bi-chevron-down toggle-points ms-2 flex-shrink-0"></i>
                </div>
                <ul class="nav flex-column route-points" style="display: none;">
                    <li class="text-muted loading-points py-2 px-3">
                        <small><i class="bi bi-hourglass-split"></i> Cargando...</small>
                    </li>
                </ul>
            </li>
        `);
        
        $rutaItem.find('.cliente-link').on('click', function(e) {
            e.preventDefault();
            const rutaId = $(this).data('id');
            const rutaName = $(this).data('name');
            
            const $pointsList = $(this).next('.route-points');
            const $toggleIcon = $(this).find('.toggle-points');
            
            if ($pointsList.is(':visible')) {
                $pointsList.slideUp(200);
                $toggleIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
            } else {
                $pointsList.slideDown(200); // Corregido: era slideUp
                $toggleIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
                loadRoutePoints(rutaId, $pointsList);
            }
            
            selectClient($(this), rutaId, rutaName, 'clients');
            
            // Asegurar compatibilidad con closeSidebar
            if ($(window).width() < 768 && window.closeSidebar) {
                window.closeSidebar();
            }
        });
        
        $pointList.append($rutaItem);
    });
}

// Asegurar compatibilidad con closeSidebar
window.closeSidebar = window.closeSidebar || function() {
    const $sidebar = $('.sidebar');
    if ($(window).width() < 768) {
        $sidebar.removeClass('active');
    } else {
        $sidebar.addClass('collapsed');
        localStorage.setItem('sidebarCollapsed', true);
    }
};
// Reemplazar la función loadRoutePoints completa
// Reemplazar la función loadRoutePoints completa
function loadRoutePoints(rutaId, $container) {
    $.getJSON(`/api/route-points/${rutaId}`)
        .done(function(points) {
            $container.empty();
            
            if (points && points.length > 0) {
                points.forEach(point => {
                    // Solo mostrar ícono para prioridad alta
                    let priorityIcon = '';
                    let priorityClass = '';
                    
                    if (point.prioridad === 'Alta') {
                        priorityIcon = '<i class="bi bi-exclamation-triangle-fill text-danger me-1" title="Prioridad Alta"></i>';
                        priorityClass = 'text-danger';
                    }
                    
                    const $pointItem = $(`
                        <li class="nav-item">
                            <a class="nav-link cliente-link" href="#" 
                               data-id="${point.id}" 
                               data-name="${point.nombre}"
                               data-prioridad="${point.prioridad}">
                                <i class="bi bi-pin-map me-1"></i>
                                <span class="client-name ${priorityClass}">${point.nombre}</span>
                                ${priorityIcon}
                            </a>
                        </li>
                    `);

                    $pointItem.find('.cliente-link').on('click', function(e) {
                        e.preventDefault();
                        const pointId = $(this).data('id');
                        const pointName = $(this).data('name');
                        const prioridad = $(this).data('prioridad');
                        
                        // Pasar la prioridad a la función
                        loadPointVisits(pointId, pointName, prioridad);
                        
                        if ($(window).width() < 768) {
                            window.closeSidebar();
                        }
                    });

                    $container.append($pointItem);
                });
            } else {
                // Mensaje mejorado cuando no hay puntos programados para hoy
                $container.html(`
                    <li class="text-muted p-2">
                        <small><i class="bi bi-info-circle"></i> No hay puntos programados para hoy en esta ruta</small>
                    </li>
                `);
                // Opcional: mostrar notificación Swal también
                Swal.fire({
                    icon: 'info',
                    title: 'Información',
                    text: 'No hay puntos programados para hoy en esta ruta',
                    showConfirmButton: false,
                    timer: 2000
                });
            }
        })
        .fail(function() {
            $container.html(`
                <li class="text-danger p-2">
                    <small><i class="bi bi-exclamation-triangle"></i> Error al cargar puntos de la ruta</small>
                </li>
            `);
            Swal.fire('Error', 'No se pudieron cargar los puntos de la ruta', 'error');
        });
}
function renderPointVisitsByRoute(routeId, pointName, visits) {
    let html = `<h4 class="mb-4">${pointName} – Visitas Pendientes</h4>
                <p class="text-muted">Ruta: ${routeId}</p>`;

    if (!visits || visits.length === 0) {
        html += `
            <div class="alert alert-info text-center">
                <i class="bi bi-calendar-check fs-1"></i>
                <p class="mt-2 mb-0">No hay visitas pendientes en este punto</p>
            </div>
        `;
    } else {
        html += `<div class="visit-grid">`;
        visits.forEach((visit, index) => {
            html += `
                <div class="visit-card" data-visit-id="${visit.id}">
                    <h6>Visita #${visit.id}</h6>
                    <p><strong>Cliente:</strong> ${visit.cliente}</p>
                    <p><strong>Mercaderista:</strong> ${visit.mercaderista}</p>
                    <p><strong>Fecha:</strong> ${formatDate(visit.fecha)}</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewVisitPhotos(${visit.id})">
                            <i class="bi bi-images"></i> Fotos
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="viewVisitPrice(${visit.id})">
                            <i class="bi bi-currency-dollar"></i> Precio
                        </button>
                        <button class="btn btn-outline-warning btn-sm" onclick="viewVisitExhibitions(${visit.id})">
                            <i class="bi bi-collection"></i> Exhibiciones
                        </button>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    $('#content-area').html(html);
}
function loadPointVisits(pointId, pointName, prioridad) {
    showLoading('#content-area', `Cargando clientes con visitas en ${pointName}...`);
    
    // Determinar clase CSS según prioridad
    let priorityClass = '';
    let priorityIcon = '';
    
    switch(prioridad) {
        case 'Alta':
            priorityClass = 'bg-danger';
            priorityIcon = '<i class="bi bi-exclamation-triangle-fill me-1"></i>';
            break;
        case 'Media':
            priorityClass = 'bg-warning';
            priorityIcon = '<i class="bi bi-dash-circle me-1"></i>';
            break;
        case 'Baja':
            priorityClass = 'bg-success';
            priorityIcon = '<i class="bi bi-check-circle me-1"></i>';
            break;
        default:
            priorityClass = 'bg-secondary';
            priorityIcon = '<i class="bi bi-question-circle me-1"></i>';
    }
    
    // Obtener todos los clientes del punto (no solo los con visitas)
    $.getJSON(`/api/point-all-clients/${pointId}`)
        .done(function(allClients) {
            // Mostrar prioridad en el título
            let html = `
                <div class="d-flex align-items-center mb-3">
                    <h4 class="mb-0">${pointName} – Clientes</h4>
                    <span class="badge ${priorityClass} ms-3">${priorityIcon} Prioridad ${prioridad}</span>
                </div>
            `;
            
            if (!allClients || allClients.length === 0) {
                html += `
                    <div class="alert alert-info text-center">
                        <i class="bi bi-calendar-check fs-1"></i>
                        <p class="mt-2 mb-0">No hay clientes asociados a este punto</p>
                    </div>
                `;
                $('#content-area').html(html);
            } else {
                // Construir la lista de clientes
                html += `<div class="client-modules-container">`;
                
                allClients.forEach(client => {
                    const pendientes = client.pendientes || 0;
                    html += `
                        <div class="client-module" data-client-id="${client.id}" data-point-id="${pointId}">
                            <div class="client-module-header d-flex justify-content-between align-items-center p-3 mb-3" 
                                 style="background-color: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; cursor: pointer;">
                                <h5 class="mb-0">
                                    <i class="bi bi-building me-2"></i>
                                    ${client.nombre}
                                </h5>
                                <div class="d-flex align-items-center">
                                    <span class="badge ${pendientes > 0 ? 'bg-primary' : 'bg-secondary'} me-2">
                                        ${pendientes} visita${pendientes !== 1 ? 's' : ''} pendiente${pendientes !== 1 ? 's' : ''}
                                    </span>
                                    <i class="bi bi-chevron-down toggle-visits"></i>
                                </div>
                            </div>
                            <div class="client-visits-container" style="display: none;">
                                <div class="text-center py-3">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                    <p class="mt-2">Cargando visitas...</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
                $('#content-area').html(html);
                
                // Agregar event listeners para expandir/colapsar
                $('.client-module-header').on('click', function() {
                    const $module = $(this).closest('.client-module');
                    const clientId = $module.data('client-id');
                    const pointId = $module.data('point-id');
                    const $visitsContainer = $module.find('.client-visits-container');
                    const $toggleIcon = $(this).find('.toggle-visits');
                    
                    if ($visitsContainer.is(':visible')) {
                        $visitsContainer.slideUp(200);
                        $toggleIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
                    } else {
                        $visitsContainer.slideDown(200);
                        $toggleIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
                        loadClientPointVisits(clientId, pointId, $visitsContainer);
                    }
                });
            }
        })
        .fail(function() {
            showError('#content-area', 'Error al cargar clientes del punto');
        });
}

function renderPointClients(pointId, pointName, clients) {
    let html = `<h4 class="mb-4">${pointName} – Clientes con Visitas Pendientes</h4>`;

    // Siempre mostrar los clientes, incluso si no hay visitas
    html += `<div class="client-modules-container">`;
    
    // Obtener todos los clientes del punto (no solo los con visitas)
    $.getJSON(`/api/point-all-clients/${pointId}`)
        .done(function(allClients) {
            if (!allClients || allClients.length === 0) {
                html += `
                    <div class="alert alert-info text-center">
                        <i class="bi bi-calendar-check fs-1"></i>
                        <p class="mt-2 mb-0">No hay clientes asociados a este punto</p>
                    </div>
                `;
            } else {
                allClients.forEach(client => {
                    const pendientes = client.pendientes || 0;
                    html += `
                        <div class="client-module" data-client-id="${client.id}" data-point-id="${pointId}">
                            <div class="client-module-header d-flex justify-content-between align-items-center p-3 mb-3" 
                                 style="background-color: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; cursor: pointer;">
                                <h5 class="mb-0">
                                    <i class="bi bi-building me-2"></i>
                                    ${client.nombre}
                                </h5>
                                <div class="d-flex align-items-center">
                                    <span class="badge ${pendientes > 0 ? 'bg-primary' : 'bg-secondary'} me-2">
                                        ${pendientes} visita${pendientes !== 1 ? 's' : ''}
                                    </span>
                                    <i class="bi bi-chevron-down toggle-visits"></i>
                                </div>
                            </div>
                            <div class="client-visits-container" style="display: none;">
                                <div class="text-center py-3">
                                    <div class="spinner-border text-primary" role="status">
                                        <span class="visually-hidden">Cargando...</span>
                                    </div>
                                    <p class="mt-2">Cargando visitas...</p>
                                </div>
                            </div>
                        </div>
                    `;
                });
            }
            
            html += `</div>`;
            $('#content-area').html(html);
            
            // Agregar event listeners
            $('.client-module-header').on('click', function() {
                const $module = $(this).closest('.client-module');
                const clientId = $module.data('client-id');
                const pointId = $module.data('point-id');
                const $visitsContainer = $module.find('.client-visits-container');
                const $toggleIcon = $(this).find('.toggle-visits');
                
                if ($visitsContainer.is(':visible')) {
                    $visitsContainer.slideUp(200);
                    $toggleIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
                } else {
                    $visitsContainer.slideDown(200);
                    $toggleIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
                    loadClientPointVisits(clientId, pointId, $visitsContainer);
                }
            });
        })
        .fail(function() {
            showError('#content-area', 'Error al cargar clientes del punto');
        });
}
function loadClientPointVisits(clientId, pointId, $container) {
    $.getJSON(`/api/client-point-visits/${clientId}/${pointId}`)
        .done(function(visits) {
            renderClientPointVisits(visits, $container);
        })
        .fail(function() {
            $container.html(`
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle"></i> Error al cargar visitas
                </div>
            `);
        });
}

function renderClientPointVisits(visits, $container) {
    if (!visits || visits.length === 0) {
        $container.html(`
            <div class="alert alert-info text-center">
                <i class="bi bi-calendar-check"></i> No hay visitas pendientes para este cliente
            </div>
        `);
        return;
    }

    let html = `<div class="visit-grid">`;
    visits.forEach(visit => {
        html += `
            <div class="visit-card" data-visit-id="${visit.id}">
                <h6>Visita #${visit.id}</h6>
                <p><strong>Mercaderista:</strong> ${visit.mercaderista}</p>
                <p><strong>Fecha:</strong> ${formatDate(visit.fecha)}</p>
                <div class="d-grid gap-2">
                    <button class="btn btn-outline-primary btn-sm" onclick="viewVisitPhotos(${visit.id})">
                        <i class="bi bi-images"></i> Fotos
                    </button>
                    <button class="btn btn-outline-success btn-sm" onclick="viewVisitPrice(${visit.id})">
                        <i class="bi bi-currency-dollar"></i> Precio
                    </button>
                    <button class="btn btn-outline-warning btn-sm" onclick="viewVisitExhibitions(${visit.id})">
                        <i class="bi bi-collection"></i> Exhibiciones
                    </button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    
    $container.html(html);
}


export function renderPendingPointsList(points) {
    const $list = $('#total-photos-list').empty();
    points.forEach(point => {
        const $pointItem = $(`
            <li class="nav-item">
                <a class="nav-link cliente-link" href="#" 
                   data-id="${point.id}" 
                   data-name="${point.nombre}"
                   data-cliente="${point.cliente}"
                   data-section="total-photos">
                    <i class="bi bi-geo-alt"></i>
                    <span class="client-name">${point.nombre}</span>
                    <small class="text-muted d-block">(${point.cliente})</small>
                    ${point.pendientes > 0 ? `<span class="badge bg-primary rounded-pill">${point.pendientes}</span>` : ''}
                </a>
            </li>
        `);
        $pointItem.on('click', function(e) {
            e.preventDefault();
            selectPoint($(this), point.id, point.nombre, point.cliente);
        });
        $list.append($pointItem);
    });
}

export function selectClient($element, clientId, clientName, section) {
    currentClientId = clientId;
    currentClientName = clientName;
    currentSection = section;

    $(`.cliente-link[data-section="${section}"]`).removeClass('active');
    $element.addClass('active');
    
    if ($(window).width() < 768) {
        window.closeSidebar();
    }
}
export function selectPoint($element, pointId, pointName, clienteName) {
    $(`.cliente-link[data-section="total-photos"]`).removeClass('active');
    $element.addClass('active');

    loadPointVisits(pointId, pointName, clienteName);

    if ($(window).width() < 768) {
        window.closeSidebar();
    }
}
function loadClientVisits(clientId, clientName) {
    showLoading('#content-area', `Cargando visitas de ${clientName}...`);
    $.getJSON(`/api/visits/${clientId}`)
        .done(function (visits) {
            renderClientVisits(clientId, clientName, visits);
        })
        .fail(function () {
            showError('#content-area', 'Error al cargar visitas');
        });
}
export function renderClientVisits(pointId, pointName, visits) {
    let html = `<h4 class="mb-4">${pointName} – Clientes con Visitas Pendientes</h4>`;

    if (!visits || visits.length === 0) {
        html += `
            <div class="alert alert-info text-center">
                <i class="bi bi-calendar-check fs-1"></i>
                <p class="mt-2 mb-0">No hay clientes con visitas pendientes</p>
            </div>
        `;
    } else {
        html += `<div class="visit-grid">`;
        visits.forEach((visit, index) => {
            html += `
                <div class="visit-card" data-visit-id="${visit.id}">
                    <h6>Visita #${visit.id}</h6>
                    <p><strong>Cliente:</strong> ${visit.cliente}</p>
                    <p><strong>Mercaderista:</strong> ${visit.mercaderista}</p>
                    <p><strong>Fecha:</strong> ${(visit.fecha)}</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewVisitPhotos(${visit.id})">
                            <i class="bi bi-images"></i> Fotos antes y después
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="viewVisitPrice(${visit.id})">
                            <i class="bi bi-currency-dollar"></i> Precio
                        </button>
                        <button class="btn btn-outline-warning btn-sm" onclick="viewVisitExhibitions(${visit.id})">
                            <i class="bi bi-collection"></i> Exhibiciones Adicionales
                        </button>
                        
                        <div class="form-check mt-2">
                            <input type="checkbox" class="form-check-input visit-reviewed-checkbox" 
                                   id="review-${visit.id}" 
                                   data-visit-id="${visit.id}">
                            <label class="form-check-label" for="review-${visit.id}">
                                <i class="bi bi-check-square"></i> Marcar como revisada
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    $('#content-area').html(html);
    
    setTimeout(() => {
        $('.visit-reviewed-checkbox').on('change', function() {
            const visitId = $(this).data('visit-id');
            const isChecked = $(this).is(':checked');
            marcarComoRevisada(visitId, isChecked, $(this));
        });
    }, 100);
}
export function loadPendingPoints() {
    showLoading('#total-photos-list', 'Cargando puntos con visitas pendientes...');
    
    // Determinar la URL correcta según el rol
    let apiUrl;
    if (window.currentUserRole === 'analyst') {
        apiUrl = "/api/analyst-pending-points";  // Nueva API para analistas
    } else {
        apiUrl = "/api/pending-points";  // API existente
    }
    
    $.getJSON(apiUrl).done(function(data) {
        if (data && data.length > 0) {
            renderPendingPointsList(data);
        } else {
            $('#total-photos-list').html('<li class="text-muted p-3">No hay puntos con visitas pendientes para hoy</li>');
        }
    }).fail(function() {
        showError('#total-photos-list', 'Error al cargar puntos pendientes');
    });
}
export function renderPointVisits(pointId, pointName, clienteName, visits) {
    let html = `<h4 class="mb-4">${pointName} – Visitas Pendientes</h4>
                <p class="text-muted">Cliente: ${clienteName}</p>`;

    if (!visits || visits.length === 0) {
        html += `
            <div class="alert alert-info text-center">
                <i class="bi bi-calendar-check fs-1"></i>
                <p class="mt-2 mb-0">No hay visitas pendientes en este punto</p>
            </div>
        `;
    } else {
        html += `<div class="visit-grid">`;
        visits.forEach((visit, index) => {
            html += `
                <div class="visit-card" data-visit-id="${visit.id}">
                    <h6>Visita #${visit.id}</h6>
                    <p><strong>Cliente:</strong> ${visit.cliente}</p>
                    <p><strong>Mercaderista:</strong> ${visit.mercaderista}</p>
                    <p><strong>Fecha:</strong> ${formatearFecha(visit.fecha)}</p>
                    <div class="d-grid gap-2">
                        <button class="btn btn-outline-primary btn-sm" onclick="viewVisitPhotos(${visit.id})">
                            <i class="bi bi-images"></i> Fotos antes y después
                        </button>
                        <button class="btn btn-outline-success btn-sm" onclick="viewVisitPrice(${visit.id})">
                            <i class="bi bi-currency-dollar"></i> Precio
                        </button>
                        <button class="btn btn-outline-warning btn-sm" onclick="viewVisitExhibitions(${visit.id})">
                            <i class="bi bi-collection"></i> Exhibiciones Adicionales
                        </button>
                        
                        <div class="form-check mt-2">
                            <input type="checkbox" class="form-check-input visit-reviewed-checkbox" 
                                   id="review-${visit.id}" 
                                   data-visit-id="${visit.id}">
                            <label class="form-check-label" for="review-${visit.id}">
                                <i class="bi bi-check-square"></i> Marcar como revisada
                            </label>
                        </div>
                    </div>
                </div>
            `;
        });
        html += `</div>`;
    }

    $('#content-area').html(html);
}
function marcarComoRevisada(visitId, isChecked, checkboxElement) {
    if (!isChecked) {
        // Si el usuario desmarca, no necesita confirmación
        actualizarEstadoRevisada(visitId, false, checkboxElement);
        return;
    }

    // Obtener nombre del mercaderista
    $.getJSON(`/api/visit-merchandiser/${visitId}`)
        .done(function(data) {
            const mercaderista = data.nombre || "Desconocido";
            const username = $('#username-display').text();

            Swal.fire({
                title: 'Confirmación requerida',
                html: `
                    <p class="text-start">
                        Comprendo que al marcar esta visita como revisada, yo <strong>${username}</strong> 
                        soy totalmente responsable de la gestión efectuada por el mercaderista 
                        <strong>${mercaderista}</strong> en este punto de venta.
                    </p>
                `,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#28a745',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sí, confirmar',
                cancelButtonText: 'No, cancelar',
                reverseButtons: true
            }).then((result) => {
                if (result.isConfirmed) {
                    actualizarEstadoRevisada(visitId, true, checkboxElement);
                } else {
                    // Revertir checkbox sin cambios
                    checkboxElement.prop('checked', false);
                }
            });
        })
        .fail(function() {
            Swal.fire('Error', 'No se pudo obtener la información del mercaderista', 'error');
            checkboxElement.prop('checked', false);
        });
}
function actualizarEstadoRevisada(visitId, revisada, checkboxElement) {
    checkboxElement.prop('disabled', true);

    $.ajax({
        url: '/api/update-visit-review',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            visitId: visitId,
            revisada: revisada
        }),
        success: function(response) {
            checkboxElement.prop('disabled', false);

            if (response.success) {
                const visitCard = checkboxElement.closest('.visit-card');
                if (revisada) {
                    visitCard.addClass('visit-reviewed');
                    visitCard.css('opacity', '0.7');
                } else {
                    visitCard.removeClass('visit-reviewed');
                    visitCard.css('opacity', '1');
                }

                Swal.fire({
                    icon: 'success',
                    title: revisada ? 'Visita marcada' : 'Visita desmarcada',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                checkboxElement.prop('checked', !revisada);
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function() {
            checkboxElement.prop('disabled', false);
            checkboxElement.prop('checked', !revisada);
            Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
        }
    });
}
// En clients.js - Reemplazar las funciones existentes
function renderPointsWithPhotos(status, points) {
    let html = `<h4 class="mb-4">Puntos con fotos ${status.toLowerCase()}</h4>`;
    
    if (!points || points.length === 0) {
        html += `
            <div class="alert alert-info text-center">
                <i class="bi bi-info-circle fs-1"></i>
                <p class="mt-2 mb-0">No hay puntos con fotos ${status.toLowerCase()}</p>
            </div>
        `;
    } else {
        html += `<div class="points-photos-container">`;
        
        // Usar un Set para evitar duplicados por si acaso
        const uniquePoints = new Map();
        points.forEach(point => {
            if (!uniquePoints.has(point.identificador)) {
                uniquePoints.set(point.identificador, point);
            }
        });
        
        Array.from(uniquePoints.values()).forEach(point => {
            html += `
                <div class="point-photo-module" data-point-id="${point.identificador}">
                    <div class="point-header" onclick="togglePointPhotos('${point.identificador}')">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5><i class="bi bi-geo-alt me-2"></i>${point.punto_de_interes}</h5>
                                <small class="text-muted">${point.clientes}</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="badge ${getStatusBadgeClass(status)} me-2">${point.total_fotos} fotos</span>
                                <i class="bi bi-chevron-down toggle-icon" id="toggle-${point.identificador}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="photos-grid" id="photos-${point.identificador}" style="display: none;">
                        <div class="text-center py-3">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="mt-2">Cargando fotos...</p>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `</div>`;
    }
    
    $('#content-area').html(html);
}
// Función para toggle de fotos por punto
window.togglePointPhotos = function(pointId) {
    const $photosGrid = $(`#photos-${pointId}`);
    const $toggleIcon = $(`#toggle-${pointId}`);
    
    if ($photosGrid.is(':visible')) {
        $photosGrid.slideUp(200);
        $toggleIcon.removeClass('bi-chevron-up').addClass('bi-chevron-down');
    } else {
        $photosGrid.slideDown(200);
        $toggleIcon.removeClass('bi-chevron-down').addClass('bi-chevron-up');
        loadPointPhotos(pointId);
    }
};



// Función para renderizar las fotos en cuadros
function renderPointPhotos(pointId, photos) {
    if (!photos || photos.length === 0) {
        $(`#photos-${pointId}`).html(`
            <div class="alert alert-info text-center">
                <i class="bi bi-info-circle"></i> No hay fotos en este punto
            </div>
        `);
        return;
    }
    
    let html = `<div class="photo-grid">`;
    
    photos.forEach(photo => {
        // Determinar la clase del badge según el estado
        const badgeClass = getStatusBadgeClass(photo.estado);
        
        html += `
            <div class="photo-card" onclick="viewPhotoModal(${photo.id_foto})">
                <div class="photo-preview">
                    <img src="${window.getImageUrl(photo.file_path)}" 
                         alt="Foto ${photo.id_foto}" 
                         loading="lazy">
                </div>
                <div class="photo-info">
                    <h6>Foto #${photo.id_foto}</h6>
                    <p><strong>Cliente:</strong> ${photo.cliente}</p>
                    <p><strong>Mercaderista:</strong> ${photo.mercaderista}</p>
                    <p><strong>Fecha:</strong> ${formatDate(photo.fecha)}</p>
                    <p><strong>Tipo:</strong> ${photo.tipo === 'antes' ? 'Antes' : 'Después'}</p>
                    <span class="badge ${badgeClass}">${photo.estado}</span>
                </div>
            </div>
        `;
    });
    
    html += `</div>`;
    $(`#photos-${pointId}`).html(html);
}

// Función para ver foto en modal
window.viewPhotoModal = function(photoId) {
    let apiUrl = `/api/photo-details/${photoId}`;
    
    $.getJSON(apiUrl)
        .done(function(photo) {
            showPhotoModal(photo);
        })
        .fail(function() {
            Swal.fire('Error', 'No se pudo cargar la foto', 'error');
        });
};

function showPhotoModal(photo) {
    const modalHtml = `
        <div class="photo-modal-content">
            <img src="${window.getImageUrl(photo.file_path)}" class="img-fluid" alt="Foto">
            <div class="photo-modal-info mt-3">
                <h5>Foto #${photo.id_foto}</h5>
                <p><strong>Cliente:</strong> ${photo.cliente}</p>
                <p><strong>Punto de interés:</strong> ${photo.punto_de_interes}</p>
                <p><strong>Mercaderista:</strong> ${photo.mercaderista}</p>
                <p><strong>Fecha:</strong> ${formatDate(photo.fecha)}</p>
                <p><strong>Tipo:</strong> ${photo.tipo === 'antes' ? 'Antes' : 'Después'}</p>
                <p><strong>Estado:</strong> <span class="badge ${getStatusBadgeClass(photo.estado)}">${photo.estado}</span></p>
            </div>
        </div>
    `;
    
    Swal.fire({
        title: `Detalles de la foto`,
        html: modalHtml,
        width: '80%',
        showCloseButton: true,
        showConfirmButton: false,
        customClass: {
            popup: 'photo-detail-popup'
        }
    });
}

// Actualizar el event listener
$(document).on('click', '.cliente-link[data-status]', function(e) {
    e.preventDefault();
    const status = $(this).data('status');
    
    $('.cliente-link[data-status]').removeClass('active');
    $(this).addClass('active');
    
    loadPhotosByStatus(status);
    
    if ($(window).width() < 768) {
        closeSidebar();
    }
});
function getStatusBadgeClass(status) {
    switch(status) {
        case 'Aprobadas': return 'bg-success';
        case 'Rechazadas': return 'bg-danger';
        case 'No revisadas': return 'bg-warning';
        case 'Todos los Estatus': return 'bg-info'; // Nuevo color para "Todos los Estatus"
        default: return 'bg-secondary';
    }
}
// Variable global para almacenar filtros actuales
let allFilterOptions = {};
let currentFilters = {
    status: '',
    departamento: '',
    ciudad: '',
    cliente: '',
    analista: '',
    fecha_inicio: '',
    fecha_fin: '',
    search_point: '',
    tipo_pdv: '' 
};
function createFilterBar(status) {
    const filterBar = document.createElement('div');
    filterBar.className = 'filter-bar mb-4';
    filterBar.innerHTML = `
        <div class="row g-3">
            <div class="col-md-2">
                <label class="form-label">Estado</label>
                <select class="form-select" id="filter-departamento">
                    <option value="">Todos los estados</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Ciudad</label>
                <select class="form-select" id="filter-ciudad" disabled>
                    <option value="">Todas las ciudades</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Cliente</label>
                <select class="form-select" id="filter-cliente">
                    <option value="">Todos los clientes</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Analista</label>
                <select class="form-select" id="filter-analista">
                    <option value="">Todos los analistas</option>
                </select>
            </div>
            <!-- NUEVO: Filtro de Tipo de PDV -->
            <div class="col-md-2">
                <label class="form-label">Tipo de PDV</label>
                <select class="form-select" id="filter-tipo-pdv">
                    <option value="">Todos los tipos</option>
                </select>
            </div>
            <div class="col-md-2">
                <label class="form-label">Fecha Inicio</label>
                <input type="date" class="form-control" id="filter-fecha-inicio">
            </div>
            <div class="col-md-2">
                <label class="form-label">Fecha Fin</label>
                <input type="date" class="form-control" id="filter-fecha-fin">
            </div>
            <!-- NEW: Search input for points of interest -->
        <div class="col-md-4">
            <label class="form-label">Buscar punto de interés</label>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" id="search-point" 
                       placeholder="Buscar por nombre del punto...">
            </div>
        </div>
            <div class="col-md-12 d-flex justify-content-end mt-3">
                <button class="btn btn-primary me-2" onclick="applyFilters()">
                    <i class="bi bi-funnel"></i> Aplicar Filtros
                </button>
                <button class="btn btn-secondary" onclick="clearFilters()">
                    <i class="bi bi-x-circle"></i> Limpiar Filtros
                </button>
            </div>
        </div>
    `;
    
    return filterBar;
}

function loadFilterOptions(status) {
    console.log('Cargando opciones de filtro...');
    let apiUrl;
    if (window.currentUserRole === 'client') {
        apiUrl = "/api/client-filter-options";
    } else {
        apiUrl = "/api/filter-options";
    }
    
    $.getJSON(apiUrl)
        .done(function(options) {
            console.log('Opciones recibidas:', options);
            allFilterOptions = options;
            populateFilterOptions(options);
            loadFilteredPoints(status);
        })
        .fail(function(xhr, status, error) {
            console.error('Error al cargar opciones:', error);
            // Use empty options as fallback
            allFilterOptions = {
                departamentos: [],
                ciudades: [],
                clientes: [],
                analistas: []
            };
            populateFilterOptions(allFilterOptions);
            loadFilteredPoints(status);
        });
}
// Update the populateFilterOptions function
function populateFilterOptions(options) {
    console.log('Populando filtros:', options);
    allFilterOptions = options;
    
    // Esperar a que existan los elementos
    const waitForElements = setInterval(() => {
        const $deptSelect = $('#filter-departamento');
        const $citySelect = $('#filter-ciudad');
        const $clientSelect = $('#filter-cliente');
        const $analystSelect = $('#filter-analista');
        const $tipoPdvSelect = $('#filter-tipo-pdv'); 
        
        if ($deptSelect.length > 0 && $citySelect.length > 0 && 
            $clientSelect.length > 0 && $analystSelect.length > 0) {
            clearInterval(waitForElements);
            
            // Limpiar y agregar opciones
            $deptSelect.empty().append('<option value="">Todos los estados</option>');
            $citySelect.empty().append('<option value="">Todas las ciudades</option>');
            $clientSelect.empty().append('<option value="">Todos los clientes</option>');
            $analystSelect.empty().append('<option value="">Todos los analistas</option>');
            $tipoPdvSelect.empty().append('<option value="">Todos los tipos</option>'); 
            
            // Poblar departamentos
            if (options.departamentos && options.departamentos.length > 0) {
                options.departamentos.forEach(dept => {
                    if (dept && dept.trim()) {
                        $deptSelect.append(`<option value="${dept}">${dept}</option>`);
                    }
                });
            }
            
            // Poblar analistas
            if (options.analistas && options.analistas.length > 0) {
                options.analistas.forEach(analyst => {
                    if (analyst && analyst.trim()) {
                        $analystSelect.append(`<option value="${analyst}">${analyst}</option>`);
                    }
                });
            }
            
            // Poblar clientes (todos inicialmente)
            if (options.clientes && options.clientes.length > 0) {
                const uniqueClients = [...new Set(options.clientes.map(c => c.nombre))];
                uniqueClients.forEach(client => {
                    if (client && client.trim()) {
                        $clientSelect.append(`<option value="${client}">${client}</option>`);
                    }
                });
            }

            // NUEVO: Poblar tipos de PDV
            if (options.tiposPdv && options.tiposPdv.length > 0) {
                options.tiposPdv.forEach(tipo => {
                    if (tipo && tipo.trim()) {
                        $tipoPdvSelect.append(`<option value="${tipo}">${tipo}</option>`);
                    }
                });
            }
            
            // Agregar event listeners para dropdowns dependientes
            $deptSelect.on('change', function() {
                const selectedDept = $(this).val();
                updateCitiesByDepartment(selectedDept);
            });
            
            $citySelect.on('change', function() {
                const selectedCity = $(this).val();
                updateClientsByCity(selectedCity);
            });
            
            console.log('Filtros poblados exitosamente');
        }
    }, 50);
}

function loadFilteredPoints(status) {
    showLoading('#content-area', 'Cargando puntos con filtros aplicados...');
    
    let baseUrl;
    if (window.currentUserRole === 'client') {
        baseUrl = `/api/client-filtered-points?status=${status}`;
    } else {
        baseUrl = `/api/points-with-filters?status=${status}`;
    }
    
    // Construir URL con parámetros (incluyendo el nuevo tipo_pdv)
    let url = baseUrl;
    if (currentFilters.departamento) url += `&departamento=${currentFilters.departamento}`;
    if (currentFilters.ciudad) url += `&ciudad=${currentFilters.ciudad}`;
    if (currentFilters.cliente) url += `&cliente=${currentFilters.cliente}`;
    if (currentFilters.analista) url += `&analista=${currentFilters.analista}`;
    if (currentFilters.fecha_inicio) url += `&fecha_inicio=${currentFilters.fecha_inicio}`;
    if (currentFilters.fecha_fin) url += `&fecha_fin=${currentFilters.fecha_fin}`;
    if (currentFilters.search_point) url += `&search_point=${encodeURIComponent(currentFilters.search_point)}`;
    if (currentFilters.tipo_pdv) url += `&tipo_pdv=${encodeURIComponent(currentFilters.tipo_pdv)}`; // NUEVO
    
    console.log('Loading filtered points with URL:', url);
    $.getJSON(url)
        .done(function(data) {
            console.log('Data received:', data);
            renderPointsWithFilters(status, data);
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading filtered points:', textStatus, errorThrown);
            showError('#content-area', 'Error al cargar puntos con filtros');
        });
}

function renderPointsWithFilters(status, points) {
    // Actualizar el título según el estatus
    let title = '';
    if (status === 'Todos los Estatus') {
        title = 'Puntos con fotos (Todos los estatus)';
    } else {
        title = `Puntos con fotos ${status.toLowerCase()}`;
    }
    
    let html = `<h4 class="mb-4">${title}</h4>`;
    
    $('#content-area').empty();
    const filterBarElement = createFilterBar(status);
    $('#content-area').append(filterBarElement);
    
    // Resto del código permanece igual...
    if (Object.keys(allFilterOptions).length > 0) {
        populateFilterOptions(allFilterOptions);
        
        // Set current filter values if they exist
        if (currentFilters.departamento) {
            $('#filter-departamento').val(currentFilters.departamento);
            updateCitiesByDepartment(currentFilters.departamento);
            
            setTimeout(() => {
                if (currentFilters.ciudad) {
                    $('#filter-ciudad').val(currentFilters.ciudad);
                    updateClientsByCity(currentFilters.ciudad);
                }
            }, 500);
        }
        
        if (currentFilters.cliente) $('#filter-cliente').val(currentFilters.cliente);
        if (currentFilters.analista) $('#filter-analista').val(currentFilters.analista);
        if (currentFilters.fecha_inicio) $('#filter-fecha-inicio').val(currentFilters.fecha_inicio);
        if (currentFilters.fecha_fin) $('#filter-fecha-fin').val(currentFilters.fecha_fin);
        if (currentFilters.tipo_pdv) $('#filter-tipo-pdv').val(currentFilters.tipo_pdv);
    }
    
    if (!points || points.length === 0) {
        $('#content-area').append(`
            <div class="alert alert-info text-center mt-3">
                <i class="bi bi-info-circle fs-1"></i>
                <p class="mt-2 mb-0">No hay puntos que coincidan con los filtros seleccionados</p>
            </div>
        `);
    } else {
        const container = $('<div class="points-photos-container mt-3"></div>');
        
        points.forEach(point => {
            const module = $(`
                <div class="point-photo-module" data-point-id="${point.identificador}">
                    <div class="point-header" onclick="togglePointPhotos('${point.identificador}')">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <h5><i class="bi bi-geo-alt me-2"></i>${point.punto_de_interes}</h5>
                                <small class="text-muted">
                                    <i class="bi bi-building"></i> ${point.clientes}<br>
                                    <i class="bi bi-map"></i> ${point.departamento}, ${point.ciudad}<br>
                                    <i class="bi bi-person"></i> Analista: ${point.analista || 'No asignado'}
                                </small>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="badge ${getStatusBadgeClass(status)} me-2">${point.total_fotos} fotos</span>
                                <i class="bi bi-chevron-down toggle-icon" id="toggle-${point.identificador}"></i>
                            </div>
                        </div>
                    </div>
                    <div class="photos-grid" id="photos-${point.identificador}" style="display: none;">
                        <div class="text-center py-3">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Cargando...</span>
                            </div>
                            <p class="mt-2">Cargando fotos...</p>
                        </div>
                    </div>
                </div>
            `);
            container.append(module);
        });
        
        $('#content-area').append(container);
    }
}

// Funciones de filtros
window.applyFilters = function() {
    const status = $('.cliente-link[data-status].active').data('status');
    currentFilters = {
        departamento: $('#filter-departamento').val(),
        ciudad: $('#filter-ciudad').val(),
        cliente: $('#filter-cliente').val(),
        analista: $('#filter-analista').val(),
        fecha_inicio: $('#filter-fecha-inicio').val(),
        fecha_fin: $('#filter-fecha-fin').val(),
        search_point: $('#search-point').val(), 
        tipo_pdv: $('#filter-tipo-pdv').val() 
    };
    
    loadFilteredPoints(status);
};

// Update clearFilters function
window.clearFilters = function() {
    $('#filter-departamento').val('');
    $('#filter-ciudad').val('').prop('disabled', true);
    $('#filter-cliente').val('');
    $('#filter-tipo-pdv').val('');
    $('#filter-analista').val('');
    $('#filter-fecha-inicio').val('');
    $('#filter-fecha-fin').val('');
    $('#search-point').val(''); 
    
    currentFilters = {
        departamento: '',
        ciudad: '',
        cliente: '',
        analista: '',
        fecha_inicio: '',
        fecha_fin: '',
        search_point: '',
        tipo_pdv: ''
    };
    
    const status = $('.cliente-link[data-status].active').data('status');
    loadFilteredPoints(status);
};

// Actualizar la función loadPhotosByStatus para usar filtros
export function loadPhotosByStatus(status) {
    currentFilters.status = status;
    loadFilterOptions(status);
}

// Actualizar loadPointPhotos para incluir filtros
window.loadPointPhotos = function(pointId) {
    const status = $('.cliente-link[data-status].active').data('status');
    
    let apiUrl;
    if (window.currentUserRole === 'client') {
        apiUrl = `/api/client-point-photos/${pointId}/${status}`;
    } else {
        apiUrl = `/api/point-photos/${pointId}/${status}`;
    }
    
    $.getJSON(apiUrl)
        .done(function(photos) {
            renderPointPhotos(pointId, photos);
        })
        .fail(function() {
            $(`#photos-${pointId}`).html(`
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle"></i> Error al cargar fotos
                </div>
            `);
        });
};

// Function to update cities based on selected department
function updateCitiesByDepartment(departamento) {
    const $citySelect = $('#filter-ciudad');
    
    if (!departamento) {
        $citySelect.empty().append('<option value="">Todas las ciudades</option>');
        $citySelect.prop('disabled', true);
        return;
    }
    
    // Mostrar loading
    $citySelect.empty().append('<option value="">Cargando ciudades...</option>');
    $citySelect.prop('disabled', true);
    
    $.getJSON(`/api/cities-by-department/${encodeURIComponent(departamento)}`)
        .done(function(cities) {
            $citySelect.empty().append('<option value="">Todas las ciudades</option>');
            
            if (cities && cities.length > 0) {
                cities.forEach(city => {
                    if (city && city.trim()) {
                        $citySelect.append(`<option value="${city}">${city}</option>`);
                    }
                });
                $citySelect.prop('disabled', false);
            } else {
                $citySelect.append('<option value="">No hay ciudades</option>');
            }
        })
        .fail(function() {
            $citySelect.empty().append('<option value="">Error al cargar</option>');
        });
}


// Function to update clients based on selected city
function updateClientsByCity(ciudad) {
    const $clientSelect = $('#filter-cliente');
    
    if (!ciudad) {
        // Si no hay ciudad seleccionada, mostrar todos los clientes
        $clientSelect.empty().append('<option value="">Todos los clientes</option>');
        
        if (allFilterOptions.clientes && allFilterOptions.clientes.length > 0) {
            const uniqueClients = [...new Set(allFilterOptions.clientes.map(c => c.nombre))];
            uniqueClients.forEach(client => {
                if (client && client.trim()) {
                    $clientSelect.append(`<option value="${client}">${client}</option>`);
                }
            });
        }
        return;
    }
    
    // Mostrar loading
    $clientSelect.empty().append('<option value="">Cargando clientes...</option>');
    
    $.getJSON(`/api/clients-by-city/${encodeURIComponent(ciudad)}`)
        .done(function(clients) {
            $clientSelect.empty().append('<option value="">Todos los clientes</option>');
            
            if (clients && clients.length > 0) {
                clients.forEach(client => {
                    if (client && client.trim()) {
                        $clientSelect.append(`<option value="${client}">${client}</option>`);
                    }
                });
            } else {
                $clientSelect.append('<option value="">No hay clientes</option>');
            }
        })
        .fail(function() {
            $clientSelect.empty().append('<option value="">Error al cargar</option>');
        });
}

// Función para obtener la URL base según el rol
function getBaseUrl() {
    if (window.currentUserRole === 'client') {
        return '/api/client';
    } else {
        return '/api';
    }
}

$(document).ready(function() {
    // Cargar opciones de filtro
    $.get('/api/client-filter-options', function(options) {
        // Poblar departamentos y ciudades
        options.departamentos.forEach(dept => {
            $('#filter-departamento').append(`<option value="${dept}">${dept}</option>`);
        });
        options.ciudades.forEach(city => {
            $('#filter-ciudad').append(`<option value="${city}">${city}</option>`);
        });
    });

    // Search on Enter key press
    $('#search-point').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            loadPoints();
        }
    });

    let searchTimeout;
    $('#search-point').on('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function() {
            loadPoints();
        }, 500); // Wait 500ms after user stops typing
    });

    // Inicial carga
    loadPoints();

    // Filtros
    $('#applyFiltersBtn').click(loadPoints);
    $('#clearFiltersBtn').click(function() {
        $('#filter-departamento').val('');
        $('#filter-ciudad').val('');
        $('#filter-fecha-inicio').val('');
        $('#filter-fecha-fin').val('');
        $('#search-point').val(''); // Limpiar también la búsqueda
        loadPoints();
    });

    // Abrir/cerrar módulos y cargar fotos
    $(document).on('click', '.point-header', function() {
        const $module = $(this).closest('.point-module');
        const $photos = $module.find('.photos-container');
        const pointId = $module.data('point-id');
        if ($photos.is(':visible')) {
            $photos.slideUp();
            $(this).find('.toggle-point').removeClass('bi-chevron-up').addClass('bi-chevron-down');
        } else {
            $photos.slideDown();
            $(this).find('.toggle-point').removeClass('bi-chevron-down').addClass('bi-chevron-up');
            // Cargar fotos solo si no están ya cargadas
            if ($photos.is(':empty')) {
                $.get(`/api/client-point-photos/${pointId}/Aprobada`, function(fotos) {
                    let fotosHtml = '<div class="row">';
                    fotos.forEach(foto => {
                        fotosHtml += `
                            <div class="col-md-3 mb-3">
                                <div class="photo-card">
                                    <img src="/api/image/${encodeURIComponent(foto.file_path)}" class="img-fluid" alt="Foto">
                                    <div class="photo-info mt-2">
                                        <span class="badge bg-success">${foto.estado}</span>
                                        <div><strong>Fecha:</strong> ${foto.fecha ? foto.fecha.split('T')[0] : ''}</div>
                                        <div><strong>Mercaderista:</strong> ${foto.mercaderista}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    fotosHtml += '</div>';
                    $photos.html(fotosHtml);
                });
            }
        }
    });
});

// MOVER loadPoints FUERA de $(document).ready para que sea accesible globalmente
function loadPoints() {
    // Obtener filtros INCLUYENDO la búsqueda
    const params = {
        status: 'Aprobada',
        departamento: $('#filter-departamento').val(),
        ciudad: $('#filter-ciudad').val(),
        fecha_inicio: $('#filter-fecha-inicio').val(),
        fecha_fin: $('#filter-fecha-fin').val(),
        search_point: $('#search-point').val() // AGREGAR el parámetro de búsqueda
    };
    
    $.get('/api/client-filtered-points', params, function(points) {
        let html = '';
        points.forEach(point => {
            html += `
                <div class="point-module mb-3" data-point-id="${point.identificador}">
                    <div class="point-header d-flex justify-content-between align-items-center" style="cursor:pointer;">
                        <span><i class="bi bi-geo-alt me-2"></i>${point.punto_de_interes}</span>
                        <span class="badge bg-success">${point.total_fotos} fotos</span>
                        <i class="bi bi-chevron-down toggle-point"></i>
                    </div>
                    <div class="photos-container" style="display:none;"></div>
                </div>
            `;
        });
        $('#points-list').html(html);
    });
}