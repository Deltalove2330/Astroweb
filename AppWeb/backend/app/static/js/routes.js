// /static/js/routes.js
// Variables globales
let currentRoute = null;
let isBulkEditing = false;
let originalPointsData = [];

// Días disponibles para seleccionar
const availableDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Prioridades disponibles
const priorities = ['Baja', 'Media', 'Alta'];

// Inicialización
$(document).ready(function() {
    // Cargar rutas al iniciar
    loadRoutes();
    
    // Asignar eventos estáticos
    $('#create-route-btn').on('click', showCreateRouteModal);
    
    // Delegación de eventos para elementos dinámicos
    $(document).on('click', '.view-route-btn', function() {
        const routeName = $(this).data('route-name');
        viewRouteDetails(routeName);
    });
    
    $(document).on('click', '#save-all-btn', function() {
        saveAllChanges(currentRoute);
    });
    
    $(document).on('click', '#cancel-edit-btn', function() {
        cancelBulkEditing();
    });
    
    $(document).on('click', '#toggle-bulk-edit-btn', function() {
        if (isBulkEditing) {
            cancelBulkEditing();
        } else {
            enableBulkEditing();
        }
    });
});

// Cargar lista de rutas
function loadRoutes() {
    const $routesList = $('#routes-list');
    $routesList.html('<div class="text-center"><div class="spinner-border" role="status"></div></div>');
    
    let apiUrl;
    if (window.currentUserRole === 'analyst') {
        apiUrl = '/api/analyst-routes';  // Nueva API para analistas
    } else {
        apiUrl = '/api/routes';  // API existente para otros roles
    }
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(routes => {
            $routesList.empty();
            
            if (routes.length === 0) {
                $routesList.html('<div class="alert alert-info">No hay rutas asignadas para hoy</div>');
                return;
            }
            
            routes.forEach(route => {
                const routeElement = `
                    <div class="route-item" data-route-id="${route.id}">
                        <i class="bi bi-geo-alt me-2"></i>
                        ${route.nombre}
                        ${route.has_high_priority ? '<span class="badge bg-danger ms-2">Prioridad Alta</span>' : ''}
                        <div class="route-service">${route.servicio}</div>
                    </div>
                `;
                $routesList.append(routeElement);
            });
            
            // Agregar evento click a cada ruta
            $('.route-item').click(function() {
                const routeId = $(this).data('route-id');
                loadRoutePoints(routeId);
                // Actualizar la ruta seleccionada
                $('.route-item').removeClass('active');
                $(this).addClass('active');
            });
        })
        .catch(error => {
            console.error('Error cargando rutas:', error);
            $routesList.html('<div class="alert alert-danger">Error al cargar las rutas</div>');
        });
}

// Renderizar lista de rutas
function renderRoutes(routes) {
    let html = '';
    
    if (routes.length === 0) {
        html = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle fs-1"></i>
                    <p class="mt-2 mb-0">No hay rutas configuradas</p>
                </div>
            </div>
        `;
    } else {
        routes.forEach(route => {
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card route-card h-100">
                        <div class="card-header bg-primary text-white">
                            <h5 class="mb-0">${route.nombre_ruta}</h5>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                <i class="bi bi-geo-alt me-1"></i> 
                                ${route.total_puntos} punto${route.total_puntos !== 1 ? 's' : ''}
                            </p>
                            <button class="btn btn-outline-primary btn-sm w-100 view-route-btn" 
                                    data-route-name="${route.nombre_ruta}">
                                <i class="bi bi-eye me-1"></i> Ver Detalles
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    $('#routes-list').html(html);
}

// Ver detalles de una ruta
function viewRouteDetails(routeName) {
    currentRoute = routeName;
    $('#routeModalTitle').text(`Detalles de: ${routeName}`);
    
    // Mostrar spinner mientras carga
    $('#route-details').html(`
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando puntos de la ruta...</p>
        </div>
    `);
    
    $.getJSON(`/rutas/api/routes/${encodeURIComponent(routeName)}/details`)
        .done(function(points) {
            renderRouteDetails(points, routeName);
            $('#routeModal').modal('show');
        })
        .fail(function(xhr, status, error) {
            console.error("Error al cargar detalles de ruta:", status, error);
            Swal.fire('Error', `No se pudieron cargar los detalles: ${error}`, 'error');
        });
}

// Renderizar detalles de una ruta con opciones de edición masiva
function renderRouteDetails(points, routeName) {
    // Guardar datos originales para restaurar si se cancela
    originalPointsData = points.map(point => ({...point}));
    
    let html = `
        <div class="mb-3 d-flex justify-content-between align-items-center">
            <h6 class="mb-0">Puntos de la ruta "${routeName}":</h6>
            <button class="btn btn-sm btn-outline-primary" id="toggle-bulk-edit-btn">
                <i class="bi bi-pencil-square me-1"></i>Editar Todo
            </button>
        </div>
    `;
    
    if (points.length === 0) {
        html += `
            <div class="alert alert-info text-center mb-0">
                <i class="bi bi-info-circle fs-3"></i>
                <p class="mt-2 mb-0">No hay puntos en esta ruta</p>
            </div>
        `;
    } else {
        html += `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Activa</th>  <!-- Nueva columna -->
                        <th>Punto de Interés</th>
                        <th>Cliente</th>
                        <th>Día</th>
                        <th>Prioridad</th>
                        <th>Departamento</th>
                        <th>Ciudad</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        points.forEach(point => {
            html += `
                <tr data-point-id="${point.identificador}" data-client-id="${point.id_cliente}" data-programacion-id="${point.id_programacion}">
                    <td class="active-cell">
                        <span class="active-text">${point.activa ? 'Sí' : 'No'}</span>
                        <input type="checkbox" class="form-check-input active-checkbox d-none" ${point.activa ? 'checked' : ''}>
                    </td>
                    <td>${point.punto_interes || 'N/A'}</td>
                    <td>${point.cliente || 'N/A'}</td>
                    <td class="day-cell">
                        <span class="day-text">${point.dia || 'No asignado'}</span>
                        <select class="form-select form-select-sm day-select d-none">
                            <option value="">Seleccionar día</option>
                            ${availableDays.map(day => 
                                `<option value="${day}" ${point.dia === day ? 'selected' : ''}>${day}</option>`
                            ).join('')}
                        </select>
                    </td>
                    <td class="priority-cell">
                        <span class="priority-text">${point.prioridad || 'No asignado'}</span>
                        <select class="form-select form-select-sm priority-select d-none">
                            <option value="">Seleccionar prioridad</option>
                            ${priorities.map(priority => 
                                `<option value="${priority}" ${point.prioridad === priority ? 'selected' : ''}>${priority}</option>`
                            ).join('')}
                        </select>
                    </td>
                    <td>${point.departamento || 'N/A'}</td>
                    <td>${point.ciudad || 'N/A'}</td>
                </tr>
            `;
        });
        
        html += `
                </tbody>
            </table>
        </div>
        `;
    }
    
    $('#route-details').html(html);
    
    // Actualizar botones de acción
    let footerHtml = `
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary d-none" id="cancel-edit-btn">Cancelar</button>
            <button type="button" class="btn btn-primary d-none" id="save-all-btn">Guardar Todos los Cambios</button>
        </div>
    `;
    
    // Si ya existe un footer, reemplazarlo, si no, agregarlo
    if ($('#routeModal .modal-footer').length) {
        $('#routeModal .modal-footer').replaceWith(footerHtml);
    } else {
        $('#routeModal .modal-content').append(footerHtml);
    }
}

// Habilitar edición masiva
function enableBulkEditing() {
    isBulkEditing = true;
    
    // Mostrar selects y ocultar textos para todos los puntos
    $('.day-text').addClass('d-none');
    $('.day-select').removeClass('d-none');
    
    $('.priority-text').addClass('d-none');
    $('.priority-select').removeClass('d-none');
    
    // Mostrar checkboxes y ocultar textos para activa
    $('.active-text').addClass('d-none');
    $('.active-checkbox').removeClass('d-none');
    
    // Actualizar texto del botón
    $('#toggle-bulk-edit-btn').html('<i class="bi bi-x-circle me-1"></i>Cancelar Edición');
    
    // Mostrar botones de guardar/cancelar
    $('#cancel-edit-btn').removeClass('d-none');
    $('#save-all-btn').removeClass('d-none');
}

// Cancelar edición masiva
function cancelBulkEditing() {
    isBulkEditing = false;
    
    // Restaurar los valores originales
    $('tr[data-point-id]').each(function() {
        const pointId = $(this).data('point-id');
        const clientId = $(this).data('client-id');
        const programacionId = $(this).data('programacion-id');
        
        const originalPoint = originalPointsData.find(p => 
            p.identificador === pointId && p.id_cliente == clientId && p.id_programacion == programacionId
        );
        
        if (originalPoint) {
            $(this).find('.day-text').text(originalPoint.dia || 'No asignado');
            $(this).find('.priority-text').text(originalPoint.prioridad || 'No asignado');
            $(this).find('.active-text').text(originalPoint.activa ? 'Sí' : 'No');
            
            $(this).find('.day-select').val(originalPoint.dia);
            $(this).find('.priority-select').val(originalPoint.prioridad);
            $(this).find('.active-checkbox').prop('checked', originalPoint.activa);
        }
    });
    
    // Ocultar selects y mostrar textos para todos los puntos
    $('.day-select').addClass('d-none');
    $('.day-text').removeClass('d-none');
    
    $('.priority-select').addClass('d-none');
    $('.priority-text').removeClass('d-none');
    
    // Ocultar checkboxes y mostrar textos para activa
    $('.active-checkbox').addClass('d-none');
    $('.active-text').removeClass('d-none');
    
    // Actualizar texto del botón
    $('#toggle-bulk-edit-btn').html('<i class="bi bi-pencil-square me-1"></i>Editar Todo');
    
    // Ocultar botones de guardar/cancelar
    $('#cancel-edit-btn').addClass('d-none');
    $('#save-all-btn').addClass('d-none');
}

// Guardar todos los cambios
function saveAllChanges(routeName) {
    // Recopilar todos los cambios
    const updates = [];
    
    $('tr[data-point-id]').each(function() {
        const pointId = $(this).data('point-id');
        const clientId = $(this).data('client-id');
        const programacionId = $(this).data('programacion-id');
        
        const newDay = $(this).find('.day-select').val();
        const newPriority = $(this).find('.priority-select').val();
        const newActive = $(this).find('.active-checkbox').is(':checked');
        
        // Solo incluir puntos que hayan cambiado
        const originalPoint = originalPointsData.find(p => 
            p.identificador === pointId && p.id_cliente == clientId && p.id_programacion == programacionId
        );
        
        if (originalPoint && 
            (originalPoint.dia !== newDay || 
             originalPoint.prioridad !== newPriority ||
             originalPoint.activa !== newActive)) {
            updates.push({
                programacion_id: programacionId,  // Nuevo campo
                point_id: pointId,
                client_id: clientId,
                day: newDay,
                priority: newPriority,
                active: newActive  // Nuevo campo
            });
        }
    });
    
    if (updates.length === 0) {
        Swal.fire('Información', 'No se han realizado cambios', 'info');
        cancelBulkEditing();
        return;
    }
    
    // Enviar cambios al servidor
    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(routeName)}/update-points`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updates),
        success: function(response) {
            if (response.success) {
                Swal.fire('Éxito', response.message, 'success');
                // Actualizar los datos originales
                originalPointsData = originalPointsData.map(original => {
                    const update = updates.find(u => 
                        u.point_id === original.identificador && 
                        u.client_id == original.id_cliente
                    );
                    
                    if (update) {
                        return {
                            ...original,
                            dia: update.day,
                            prioridad: update.priority
                        };
                    }
                    return original;
                });
                
                // Actualizar la interfaz
                $('tr[data-point-id]').each(function() {
                    const pointId = $(this).data('point-id');
                    const clientId = $(this).data('client-id');
                    
                    const newValues = updates.find(u => 
                        u.point_id === pointId && u.client_id == clientId
                    );
                    
                    if (newValues) {
                        $(this).find('.day-text').text(newValues.day || 'No asignado');
                        $(this).find('.priority-text').text(newValues.priority || 'No asignado');
                    }
                });
                
                // Salir del modo edición
                cancelBulkEditing();
            } else {
                Swal.fire('Error', response.message || 'Error al actualizar los puntos', 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al guardar los cambios';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) {
                    errorMessage = response.message;
                }
            } catch (e) {
                errorMessage = xhr.statusText || errorMessage;
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}

// Mostrar modal para crear ruta
function showCreateRouteModal() {
    Swal.fire({
        title: 'Crear Nueva Ruta',
        input: 'text',
        inputLabel: 'Nombre de la ruta:',
        inputPlaceholder: 'Ej: Ruta Norte',
        showCancelButton: true,
        confirmButtonText: 'Crear',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes ingresar un nombre para la ruta';
            }
            if (value.length < 3) {
                return 'El nombre debe tener al menos 3 caracteres';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            createRoute(result.value);
        }
    });
}

// Crear una nueva ruta
function createRoute(routeName) {
    $.ajax({
        url: '/rutas/api/routes/create',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ route_name: routeName }),
        success: function(response) {
            if (response.success) {
                Swal.fire('Éxito', response.message, 'success');
                loadRoutes();
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al crear la ruta';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) {
                    errorMessage = response.message;
                }
            } catch (e) {
                errorMessage = xhr.statusText || errorMessage;
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}