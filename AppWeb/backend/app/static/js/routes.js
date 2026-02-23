// /static/js/routes.js
// ============================================================================
// GESTIÓN DE RUTAS - Módulo completo con CRUD completo de rutas
// ============================================================================

// Variables globales
let currentRoute = null;
let isBulkEditing = false;
let originalPointsData = [];
let pointsOfInterestCache = [];
let clientsCache = [];
let servicesCache = [];
let routeOptionsCache = { servicios: [] };

// Días disponibles para seleccionar
const availableDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Prioridades disponibles
const priorities = ['Baja', 'Media', 'Alta'];

// Tipos de ruta
const routeTypes = [
    { value: 'E', label: 'Exclusiva', prefix: 'Ruta E' },
    { value: 'A', label: 'Auditor', prefix: 'Ruta A' },
    { value: 'T', label: 'Tradex', prefix: 'Ruta T' }
];

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
$(document).ready(function() {
    // Cargar rutas y selects al iniciar
    loadRoutes();
    loadPointsOfInterest();
    loadClients();
    loadServices();
    
    // Asignar eventos estáticos
    $('#create-route-btn').on('click', showCreateRouteModal);

    // Delegación de eventos para elementos dinámicos
    $(document).on('click', '.view-route-btn', function() {
        const routeName = $(this).data('route-name');
        viewRouteDetails(routeName);
    });

    $(document).on('click', '.edit-route-btn', function(e) {
        e.stopPropagation();
        const routeName = $(this).data('route-name');
        showEditRouteModal(routeName);
    });

    $(document).on('click', '.delete-route-btn', function(e) {
        e.stopPropagation();
        const routeName = $(this).data('route-name');
        confirmDeleteRoute(routeName);
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

    // Auto-completado departamento/ciudad al seleccionar punto
    $(document).on('change', '#new-point-select', function() {
        const selectedPoint = pointsOfInterestCache.find(p => 
            p.identificador == $(this).val()
        );
        if (selectedPoint) {
            $('#auto-departamento').val(selectedPoint.departamento || '');
            $('#auto-ciudad').val(selectedPoint.ciudad || '');
        } else {
            $('#auto-departamento').val('');
            $('#auto-ciudad').val('');
        }
    });

    // Submit del formulario para agregar punto
    $(document).on('submit', '#add-point-form', function(e) {
        e.preventDefault();
        addPointToCurrentRoute();
    });

    // Eliminar punto individual
    $(document).on('click', '.remove-point-btn', function() {
        const programacionId = $(this).data('programacion-id');
        const pointName = $(this).data('point-name');
        confirmRemovePoint(programacionId, pointName);
    });

    // Botón actualizar ruta
    $(document).on('click', '#refresh-route-btn', function() {
        if (currentRoute) viewRouteDetails(currentRoute);
    });

    // Editar punto/cliente inline en tabla
    $(document).on('click', '.edit-point-inline-btn', function() {
        const $row = $(this).closest('tr');
        openInlineEditModal($row);
    });

    // Programar cambio futuro
    $(document).on('click', '.schedule-future-btn', function() {
        const programacionId = $(this).data('programacion-id');
        const pointName = $(this).data('point-name');
        const clientName = $(this).data('client-name');
        const day = $(this).data('day');
        const priority = $(this).data('priority');
        const active = $(this).data('active');
        
        showScheduleFutureModal(programacionId, pointName, clientName, day, priority, active);
    });

    // Cancelar cambio futuro
    $(document).on('click', '.cancel-future-btn', function() {
        const cambioId = $(this).data('cambio-id');
        confirmCancelFutureChange(cambioId);
    });

    // Agregar nuevo servicio desde el modal
    $(document).on('click', '#add-new-service-btn', function() {
        showAddServiceModal();
    });

    // Cambiar tipo de ruta - actualizar número correlativo
    $(document).on('change', '#route-tipo', function() {
        updateRouteNumberPreview();
    });
});

// ============================================================================
// CARGAR SELECTS DINÁMICOS
// ============================================================================
function loadPointsOfInterest() {
    const $select = $('#new-point-select');
    $select.html('<option value="">Cargando puntos...</option>');
    
    fetch('/rutas/api/points-of-interest')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('✅ Puntos cargados:', data.length, 'registros');
            pointsOfInterestCache = data;
            renderPointsSelect();
        })
        .catch(error => {
            console.error('❌ Error cargando puntos:', error);
            $select.html('<option value="">Error al cargar</option>');
            Swal.fire('Error', 'No se pudieron cargar los puntos de interés', 'error');
        });
}

function loadClients() {
    const $select = $('#new-client-select');
    $select.html('<option value="">Cargando clientes...</option>');
    
    fetch('/rutas/api/clients')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            console.log('✅ Clientes cargados:', data.length, 'registros');
            clientsCache = data;
            renderClientsSelect();
        })
        .catch(error => {
            console.error('❌ Error cargando clientes:', error);
            $select.html('<option value="">Error al cargar</option>');
            Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
        });
}

function loadServices() {
    fetch('/rutas/api/route-options')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            servicesCache = data.servicios || [];
            routeOptionsCache = data;
            console.log('✅ Servicios cargados:', servicesCache.length);
        })
        .catch(error => {
            console.error('❌ Error cargando servicios:', error);
            servicesCache = [];
        });
}

function renderPointsSelect() {
    const $select = $('#new-point-select');
    $select.empty().append('<option value="">Seleccione un punto...</option>');
    
    if (!pointsOfInterestCache || pointsOfInterestCache.length === 0) {
        $select.append('<option value="" disabled>Sin datos disponibles</option>');
        return;
    }

    pointsOfInterestCache.forEach(point => {
        $select.append(`
            <option value="${point.identificador}" 
                    data-departamento="${point.departamento || ''}" 
                    data-ciudad="${point.ciudad || ''}">
                ${point.punto_de_interes}
            </option>
        `);
    });
}

function renderClientsSelect() {
    const $select = $('#new-client-select');
    $select.empty().append('<option value="">Seleccione un cliente...</option>');
    
    if (!clientsCache || clientsCache.length === 0) {
        $select.append('<option value="" disabled>Sin datos disponibles</option>');
        return;
    }

    clientsCache.forEach(client => {
        $select.append(`
            <option value="${client.id_cliente}">
                ${client.cliente}
            </option>
        `);
    });
}

// ============================================================================
// CREAR NUEVA RUTA - MODAL COMPLETO
// ============================================================================
function showCreateRouteModal() {
    // Primero obtener el siguiente número para cada tipo
    Promise.all([
        fetch('/rutas/api/routes/next-number?tipo=E').then(r => r.json()),
        fetch('/rutas/api/routes/next-number?tipo=A').then(r => r.json()),
        fetch('/rutas/api/routes/next-number?tipo=T').then(r => r.json())
    ]).then(([eData, aData, tData]) => {
        const servicesOptions = servicesCache.map(s => 
            `<option value="${s}">${s}</option>`
        ).join('');

        Swal.fire({
            title: '🛣️ Crear Nueva Ruta',
            html: `
                <div class="text-start">
                    <div class="alert alert-info py-2 mb-3 small">
                        <i class="bi bi-info-circle me-1"></i>
                        El nombre de la ruta se generará automáticamente según el tipo seleccionado
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Tipo de Ruta <span class="text-danger">*</span></label>
                        <select id="route-tipo" class="form-select" required>
                            <option value="">Seleccione...</option>
                            <option value="E">Exclusiva (Ruta E#)</option>
                            <option value="A">Auditor (Ruta A#)</option>
                            <option value="T">Tradex (Ruta T#)</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Nombre Previsto</label>
                        <input type="text" id="route-name-preview" class="form-control" readonly 
                               placeholder="Se generará automáticamente">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Servicio <span class="text-danger">*</span></label>
                        <div class="input-group">
                            <select id="route-servicio" class="form-select" required>
                                <option value="">Seleccione...</option>
                                ${servicesOptions}
                            </select>
                            <button class="btn btn-outline-primary" type="button" id="add-new-service-btn" 
                                    title="Agregar nuevo servicio">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Coordinador 1 <span class="text-danger">*</span></label>
                        <input type="text" id="route-coord1" class="form-control" required 
                               placeholder="Nombre del coordinador principal">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Coordinador 2</label>
                        <input type="text" id="route-coord2" class="form-control" 
                               placeholder="Nombre del coordinador secundario (opcional)">
                    </div>
                    
                    <div class="mb-3">
                        <label class="form-label fw-bold">Cuadrante <span class="text-danger">*</span></label>
                        <input type="text" id="route-cuadrante" class="form-control" required 
                               placeholder="Ej: Norte, Sur, Centro, etc.">
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '✅ Crear Ruta',
            cancelButtonText: '❌ Cancelar',
            confirmButtonColor: '#0d6efd',
            width: '600px',
            didOpen: () => {
                // Actualizar vista previa cuando se selecciona el tipo
                document.getElementById('route-tipo').addEventListener('change', updateRouteNumberPreview);
            },
            preConfirm: () => {
                const tipo = document.getElementById('route-tipo').value;
                const servicio = document.getElementById('route-servicio').value;
                const coordinador_1 = document.getElementById('route-coord1').value.trim();
                const coordinador_2 = document.getElementById('route-coord2').value.trim();
                const cuadrante = document.getElementById('route-cuadrante').value.trim();
                
                if (!tipo) {
                    Swal.showValidationMessage('⚠️ Seleccione un tipo de ruta');
                    return false;
                }
                if (!servicio) {
                    Swal.showValidationMessage('⚠️ Seleccione un servicio');
                    return false;
                }
                if (!coordinador_1) {
                    Swal.showValidationMessage('⚠️ Ingrese el coordinador 1');
                    return false;
                }
                if (!cuadrante) {
                    Swal.showValidationMessage('⚠️ Ingrese el cuadrante');
                    return false;
                }
                
                return {
                    tipo,
                    servicio,
                    coordinador_1,
                    coordinador_2: coordinador_2 || null,
                    cuadrante
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                createRoute(result.value);
            }
        });
    }).catch(error => {
        console.error('Error obteniendo números correlativos:', error);
        Swal.fire('Error', 'No se pudo obtener la información para crear la ruta', 'error');
    });
}

function updateRouteNumberPreview() {
    const tipo = document.getElementById('route-tipo').value;
    if (!tipo) {
        document.getElementById('route-name-preview').value = '';
        return;
    }
    
    fetch(`/rutas/api/routes/next-number?tipo=${tipo}`)
        .then(r => r.json())
        .then(data => {
            const prefix = `Ruta ${tipo}`;
            const nextNum = data.next_number || 1;
            document.getElementById('route-name-preview').value = `${prefix}${nextNum}`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function showAddServiceModal() {
    Swal.fire({
        title: '➕ Agregar Nuevo Servicio',
        input: 'text',
        inputLabel: 'Nombre del servicio:',
        inputPlaceholder: 'Ej: Servicio Especial',
        showCancelButton: true,
        confirmButtonText: 'Agregar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value || value.trim().length < 3) {
                return 'El nombre debe tener al menos 3 caracteres';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            addNewService(result.value.trim());
        }
    });
}

function addNewService(serviceName) {
    // Aquí deberías tener un endpoint para agregar servicios
    // Por ahora lo agregamos al cache local
    if (!servicesCache.includes(serviceName)) {
        servicesCache.push(serviceName);
        Swal.fire('✅ Agregado', `Servicio "${serviceName}" agregado`, 'success');
        
        // Actualizar el select en el modal
        const $select = $('#route-servicio');
        $select.append(`<option value="${serviceName}" selected>${serviceName}</option>`);
    } else {
        Swal.fire('⚠️ Existe', 'Este servicio ya existe en la lista', 'warning');
    }
}

function createRoute(data) {
    $.ajax({
        url: '/rutas/api/routes/create',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(resp) {
            if (resp.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Ruta Creada',
                    text: resp.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                loadRoutes();
            } else {
                Swal.fire('❌ Error', resp.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al crear la ruta';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) errorMessage = response.message;
            } catch (e) {}
            Swal.fire('❌ Error', errorMessage, 'error');
        }
    });
}

// ============================================================================
// EDITAR RUTA EXISTENTE
// ============================================================================
function showEditRouteModal(routeName) {
    // Primero obtener los datos actuales de la ruta
    fetch(`/rutas/api/routes/${encodeURIComponent(routeName)}/details`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(points => {
            // Obtener información de la ruta desde un endpoint específico
            return fetch(`/rutas/api/routes/${encodeURIComponent(routeName)}/info`)
                .then(r => r.json())
                .then(routeInfo => ({ routeInfo, points }));
        })
        .then(({ routeInfo, points }) => {
            const tipo = routeInfo.ruta.match(/^Ruta ([EAT])/)?.[1] || 'E';
            const servicesOptions = servicesCache.map(s => 
                `<option value="${s}" ${s === routeInfo.servicio ? 'selected' : ''}>${s}</option>`
            ).join('');

            Swal.fire({
                title: '✏️ Editar Ruta',
                html: `
                    <div class="text-start">
                        <div class="alert alert-warning py-2 mb-3 small">
                            <i class="bi bi-exclamation-triangle me-1"></i>
                            El nombre de la ruta no se puede modificar
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Nombre de Ruta</label>
                            <input type="text" class="form-control" value="${routeInfo.ruta}" readonly>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Tipo de Ruta</label>
                            <select id="edit-route-tipo" class="form-select">
                                <option value="E" ${tipo === 'E' ? 'selected' : ''}>Exclusiva</option>
                                <option value="A" ${tipo === 'A' ? 'selected' : ''}>Auditor</option>
                                <option value="T" ${tipo === 'T' ? 'selected' : ''}>Tradex</option>
                            </select>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Servicio <span class="text-danger">*</span></label>
                            <div class="input-group">
                                <select id="edit-route-servicio" class="form-select" required>
                                    ${servicesOptions}
                                </select>
                                <button class="btn btn-outline-primary" type="button" id="edit-add-service-btn">
                                    <i class="bi bi-plus-lg"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Coordinador 1 <span class="text-danger">*</span></label>
                            <input type="text" id="edit-route-coord1" class="form-control" required 
                                   value="${routeInfo.coordinador_1 || ''}">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Coordinador 2</label>
                            <input type="text" id="edit-route-coord2" class="form-control" 
                                   value="${routeInfo.coordinador_2 || ''}">
                        </div>
                        
                        <div class="mb-3">
                            <label class="form-label fw-bold">Cuadrante <span class="text-danger">*</span></label>
                            <input type="text" id="edit-route-cuadrante" class="form-control" required 
                                   value="${routeInfo.cuadrante || ''}">
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: '💾 Guardar Cambios',
                cancelButtonText: '❌ Cancelar',
                confirmButtonColor: '#0d6efd',
                width: '600px',
                didOpen: () => {
                    document.getElementById('edit-add-service-btn').addEventListener('click', showAddServiceModal);
                },
                preConfirm: () => {
                    const tipo = document.getElementById('edit-route-tipo').value;
                    const servicio = document.getElementById('edit-route-servicio').value;
                    const coordinador_1 = document.getElementById('edit-route-coord1').value.trim();
                    const coordinador_2 = document.getElementById('edit-route-coord2').value.trim();
                    const cuadrante = document.getElementById('edit-route-cuadrante').value.trim();
                    
                    if (!servicio) {
                        Swal.showValidationMessage('⚠️ Seleccione un servicio');
                        return false;
                    }
                    if (!coordinador_1) {
                        Swal.showValidationMessage('⚠️ Ingrese el coordinador 1');
                        return false;
                    }
                    if (!cuadrante) {
                        Swal.showValidationMessage('⚠️ Ingrese el cuadrante');
                        return false;
                    }
                    
                    return {
                        route_name: routeName,
                        tipo,
                        servicio,
                        coordinador_1,
                        coordinador_2: coordinador_2 || null,
                        cuadrante
                    };
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    updateRoute(result.value);
                }
            });
        })
        .catch(error => {
            console.error('Error cargando datos de ruta:', error);
            Swal.fire('❌ Error', 'No se pudo cargar la información de la ruta', 'error');
        });
}

function updateRoute(data) {
    $.ajax({
        url: '/rutas/api/routes/update',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(resp) {
            if (resp.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Ruta Actualizada',
                    text: resp.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                loadRoutes();
            } else {
                Swal.fire('❌ Error', resp.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al actualizar la ruta';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) errorMessage = response.message;
            } catch (e) {}
            Swal.fire('❌ Error', errorMessage, 'error');
        }
    });
}

// ============================================================================
// ELIMINAR RUTA
// ============================================================================
function confirmDeleteRoute(routeName) {
    Swal.fire({
        title: '🗑️ ¿Eliminar Ruta?',
        html: `
            <div class="text-start">
                <p class="fw-bold">¿Está seguro de eliminar la ruta <strong>${routeName}</strong>?</p>
                <div class="alert alert-danger small">
                    <i class="bi bi-exclamation-triangle me-1"></i>
                    <strong>Advertencia:</strong> Esta acción eliminará todos los puntos programados asociados a esta ruta.
                </div>
                <div class="mb-3">
                    <label class="form-label small">Escriba el nombre de la ruta para confirmar:</label>
                    <input type="text" id="confirm-delete-route-name" class="form-control form-control-sm" 
                           placeholder="${routeName}">
                </div>
            </div>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        preConfirm: () => {
            const confirmName = document.getElementById('confirm-delete-route-name').value;
            if (confirmName !== routeName) {
                Swal.showValidationMessage('⚠️ El nombre no coincide. Escriba exactamente: ' + routeName);
                return false;
            }
            return true;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            deleteRoute(routeName);
        }
    });
}

function deleteRoute(routeName) {
    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(routeName)}`,
        method: 'DELETE',
        contentType: 'application/json',
        success: function(resp) {
            if (resp.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Ruta Eliminada',
                    text: resp.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                loadRoutes();
            } else {
                Swal.fire('❌ Error', resp.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al eliminar la ruta';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) errorMessage = response.message;
            } catch (e) {}
            Swal.fire('❌ Error', errorMessage, 'error');
        }
    });
}

// ============================================================================
// CARGAR Y RENDERIZAR RUTAS
// ============================================================================
function loadRoutes() {
    const $routesList = $('#routes-list');
    $routesList.html(`
        <div class="col-12">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando rutas...</p>
            </div>
        </div>
    `);

    fetch('/rutas/api/routes')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(routes => {
            renderRoutes(routes);
        })
        .catch(error => {
            console.error('Error cargando rutas:', error);
            $routesList.html(`
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Error al cargar las rutas: ${error.message}
                        <br><small>Verifica la conexión y los permisos</small>
                    </div>
                </div>
            `);
        });
}

function renderRoutes(routes) {
    let html = '';
    
    if (routes.length === 0) {
        html = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle fs-1"></i>
                    <p class="mt-2 mb-0">No hay rutas configuradas</p>
                    <button class="btn btn-primary mt-3" id="create-route-btn">
                        <i class="bi bi-plus-circle me-1"></i>Crear Primera Ruta
                    </button>
                </div>
            </div>
        `;
    } else {
        routes.forEach(route => {
            const tipoBadge = route.nombre_ruta.includes('Ruta E') ? 'bg-success' :
                             route.nombre_ruta.includes('Ruta A') ? 'bg-warning text-dark' :
                             route.nombre_ruta.includes('Ruta T') ? 'bg-info text-dark' : 'bg-secondary';
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card route-card h-100">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">${route.nombre_ruta}</h5>
                            <span class="badge ${tipoBadge}">${route.nombre_ruta.charAt(5)}</span>
                        </div>
                        <div class="card-body">
                            <p class="card-text">
                                <i class="bi bi-geo-alt me-1"></i> 
                                ${route.total_puntos} punto${route.total_puntos !== 1 ? 's' : ''}
                            </p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-outline-primary btn-sm view-route-btn" 
                                        data-route-name="${route.nombre_ruta}">
                                    <i class="bi bi-eye me-1"></i>Ver Detalles
                                </button>
                                <div class="btn-group">
                                    <button class="btn btn-outline-warning btn-sm edit-route-btn" 
                                            data-route-name="${route.nombre_ruta}"
                                            title="Editar ruta">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-outline-danger btn-sm delete-route-btn" 
                                            data-route-name="${route.nombre_ruta}"
                                            title="Eliminar ruta">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    $('#routes-list').html(html);
}

// ============================================================================
// VER DETALLES DE RUTA
// ============================================================================
function viewRouteDetails(routeName) {
    currentRoute = routeName;
    $('#routeModalTitle').text(`Detalles de: ${routeName}`);
    
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
            console.error("Error al cargar detalles de ruta:", xhr.responseText);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `No se pudieron cargar los detalles: ${xhr.responseText || error}`
            });
        });
}

// ============================================================================
// RENDERIZAR DETALLES CON FORMULARIO Y TABLA
// ============================================================================
function renderRouteDetails(points, routeName) {
    originalPointsData = points.map(point => ({...point}));
    
    let html = `
        <div class="card mb-4 border-primary">
            <div class="card-header bg-primary text-white">
                <h6 class="mb-0">
                    <i class="bi bi-plus-circle me-2"></i>
                    Agregar Nuevo Punto a "${routeName}"
                </h6>
            </div>
            <div class="card-body">
                <form id="add-point-form" class="row g-3 align-items-end">
                    <div class="col-md-3 col-lg-2">
                        <label class="form-label small fw-bold mb-1">
                            Punto de Interés <span class="text-danger">*</span>
                        </label>
                        <select class="form-select form-select-sm" id="new-point-select" required>
                            <option value="">Seleccione...</option>
                        </select>
                    </div>
                    <div class="col-md-3 col-lg-2">
                        <label class="form-label small fw-bold mb-1">
                            Cliente <span class="text-danger">*</span>
                        </label>
                        <select class="form-select form-select-sm" id="new-client-select" required>
                            <option value="">Seleccione...</option>
                        </select>
                    </div>
                    <div class="col-md-2 col-lg-2">
                        <label class="form-label small fw-bold mb-1">
                            Día <span class="text-danger">*</span>
                        </label>
                        <select class="form-select form-select-sm" id="new-day-select" required>
                            <option value="">Seleccione...</option>
                            ${availableDays.map(day => `<option value="${day}">${day}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-2 col-lg-2">
                        <label class="form-label small fw-bold mb-1">
                            Prioridad <span class="text-danger">*</span>
                        </label>
                        <select class="form-select form-select-sm" id="new-priority-select" required>
                            <option value="">Seleccione...</option>
                            ${priorities.map(p => `<option value="${p}">${p}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-md-2 col-lg-2">
                        <label class="form-label small fw-bold mb-1">Departamento</label>
                        <input type="text" class="form-control form-control-sm" id="auto-departamento" 
                               readonly placeholder="Auto">
                    </div>
                    <div class="col-md-2 col-lg-2">
                        <label class="form-label small fw-bold mb-1">Ciudad</label>
                        <input type="text" class="form-control form-control-sm" id="auto-ciudad" 
                               readonly placeholder="Auto">
                    </div>
                    <div class="col-12 col-lg-2">
                        <button type="submit" class="btn btn-success btn-sm w-100">
                            <i class="bi bi-plus-lg me-1"></i>Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h6 class="mb-0 fw-bold">
                <i class="bi bi-list-check me-2"></i>Puntos Actuales de la Ruta
            </h6>
            <div class="btn-group">
                <button class="btn btn-sm btn-outline-secondary" id="refresh-route-btn">
                    <i class="bi bi-arrow-clockwise me-1"></i>Actualizar
                </button>
                <button class="btn btn-sm btn-outline-primary" id="toggle-bulk-edit-btn">
                    <i class="bi bi-pencil-square me-1"></i>Editar Todo
                </button>
            </div>
        </div>
    `;

    if (points.length === 0) {
        html += `
            <div class="alert alert-info text-center mb-0">
                <i class="bi bi-info-circle fs-3"></i>
                <p class="mt-2 mb-0">No hay puntos en esta ruta</p>
                <small class="text-muted">Agrega puntos usando el formulario superior</small>
            </div>
        `;
    } else {
        html += `
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-light">
                        <tr>
                            <th style="width: 80px;">Activa</th>
                            <th>Punto de Interés</th>
                            <th>Cliente</th>
                            <th style="width: 120px;">Día</th>
                            <th style="width: 120px;">Prioridad</th>
                            <th>Departamento</th>
                            <th>Ciudad</th>
                            <th style="width: 120px;" class="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        points.forEach(point => {
            html += `
                <tr data-point-id="${point.identificador}" 
                    data-client-id="${point.id_cliente}" 
                    data-programacion-id="${point.id_programacion}">
                    <td class="active-cell">
                        <span class="active-text">${point.activa ? '✅ Sí' : '❌ No'}</span>
                        <input type="checkbox" class="form-check-input active-checkbox d-none" 
                               ${point.activa ? 'checked' : ''}>
                    </td>
                    <td><strong>${point.punto_interes || 'N/A'}</strong></td>
                    <td>${point.cliente || 'N/A'}</td>
                    <td class="day-cell">
                        <span class="day-text">${point.dia || 'No asignado'}</span>
                        <select class="form-select form-select-sm day-select d-none">
                            <option value="">Día...</option>
                            ${availableDays.map(day => 
                                `<option value="${day}" ${point.dia === day ? 'selected' : ''}>${day}</option>`
                            ).join('')}
                        </select>
                    </td>
                    <td class="priority-cell">
                        <span class="priority-text ${getPriorityClass(point.prioridad)}">
                            ${point.prioridad || 'No asignado'}
                        </span>
                        <select class="form-select form-select-sm priority-select d-none">
                            <option value="">Prioridad...</option>
                            ${priorities.map(priority => 
                                `<option value="${priority}" ${point.prioridad === priority ? 'selected' : ''}>${priority}</option>`
                            ).join('')}
                        </select>
                    </td>
                    <td>${point.departamento || 'N/A'}</td>
                    <td>${point.ciudad || 'N/A'}</td>
                    <td class="text-end">
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-warning schedule-future-btn" 
                                    data-programacion-id="${point.id_programacion}"
                                    data-point-name="${point.punto_interes || 'Este punto'}"
                                    data-client-name="${point.cliente || 'N/A'}"
                                    data-day="${point.dia || ''}"
                                    data-priority="${point.prioridad || ''}"
                                    data-active="${point.activa}"
                                    title="Programar cambio futuro">
                                <i class="bi bi-calendar-event"></i>
                            </button>
                            <button class="btn btn-outline-primary edit-point-inline-btn" 
                                    data-programacion-id="${point.id_programacion}"
                                    title="Editar punto/cliente">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger remove-point-btn" 
                                    data-programacion-id="${point.id_programacion}"
                                    data-point-name="${point.punto_interes || 'Este punto'}"
                                    title="Eliminar de la ruta">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
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
    loadFutureChanges(routeName);
    updateModalFooter();
    renderPointsSelect();
    renderClientsSelect();
}

function getPriorityClass(priority) {
    const classes = {
        'Alta': 'text-danger fw-bold',
        'Media': 'text-warning fw-bold',
        'Baja': 'text-success'
    };
    return classes[priority] || 'text-muted';
}

function updateModalFooter() {
    const footerHtml = `
        <button type="button" class="btn btn-secondary d-none" id="cancel-edit-btn">
            <i class="bi bi-x-circle me-1"></i>Cancelar Edición
        </button>
        <button type="button" class="btn btn-primary d-none" id="save-all-btn">
            <i class="bi bi-save me-1"></i>Guardar Todos los Cambios
        </button>
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `;
    
    if ($('#routeModal .modal-footer').length) {
        $('#routeModal .modal-footer').html(footerHtml);
    } else {
        $('#routeModal .modal-content').append(`<div class="modal-footer">${footerHtml}</div>`);
    }
}

// ============================================================================
// EDICIÓN MASIVA DE PUNTOS
// ============================================================================
function enableBulkEditing() {
    isBulkEditing = true;
    
    $('.day-text').addClass('d-none');
    $('.day-select').removeClass('d-none');
    $('.priority-text').addClass('d-none');
    $('.priority-select').removeClass('d-none');
    $('.active-text').addClass('d-none');
    $('.active-checkbox').removeClass('d-none');

    $('#toggle-bulk-edit-btn').html('<i class="bi bi-x-circle me-1"></i>Cancelar Edición');
    $('#cancel-edit-btn').removeClass('d-none');
    $('#save-all-btn').removeClass('d-none');
}

function cancelBulkEditing() {
    isBulkEditing = false;
    
    $('tr[data-point-id]').each(function() {
        const pointId = $(this).data('point-id');
        const clientId = $(this).data('client-id');
        const programacionId = $(this).data('programacion-id');
        
        const originalPoint = originalPointsData.find(p => 
            p.identificador === pointId && p.id_cliente == clientId && p.id_programacion == programacionId
        );
        
        if (originalPoint) {
            $(this).find('.day-text').text(originalPoint.dia || 'No asignado');
            $(this).find('.priority-text')
                .text(originalPoint.prioridad || 'No asignado')
                .attr('class', `priority-text ${getPriorityClass(originalPoint.prioridad)}`);
            $(this).find('.active-text').text(originalPoint.activa ? '✅ Sí' : '❌ No');
            $(this).find('.day-select').val(originalPoint.dia);
            $(this).find('.priority-select').val(originalPoint.prioridad);
            $(this).find('.active-checkbox').prop('checked', originalPoint.activa);
        }
    });

    $('.day-select').addClass('d-none');
    $('.day-text').removeClass('d-none');
    $('.priority-select').addClass('d-none');
    $('.priority-text').removeClass('d-none');
    $('.active-checkbox').addClass('d-none');
    $('.active-text').removeClass('d-none');

    $('#toggle-bulk-edit-btn').html('<i class="bi bi-pencil-square me-1"></i>Editar Todo');
    $('#cancel-edit-btn').addClass('d-none');
    $('#save-all-btn').addClass('d-none');
}

function saveAllChanges(routeName) {
    const updates = [];
    
    $('tr[data-point-id]').each(function() {
        const programacionId = $(this).data('programacion-id');
        const newDay = $(this).find('.day-select').val();
        const newPriority = $(this).find('.priority-select').val();
        const newActive = $(this).find('.active-checkbox').is(':checked');
        
        updates.push({
            programacion_id: programacionId,
            day: newDay,
            priority: newPriority,
            active: newActive
        });
    });

    if (updates.length === 0) {
        Swal.fire('Información', 'No se han realizado cambios', 'info');
        cancelBulkEditing();
        return;
    }

    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(routeName)}/update-points`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(updates),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                viewRouteDetails(routeName);
            } else {
                Swal.fire('Error', response.message || 'Error al actualizar los puntos', 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al guardar los cambios';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) errorMessage = response.message;
            } catch (e) {}
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}

// ============================================================================
// AGREGAR PUNTO A RUTA
// ============================================================================
function addPointToCurrentRoute() {
    const pointId = $('#new-point-select').val();
    const clientIdRaw = $('#new-client-select').val();
    const dayVal = $('#new-day-select').val();
    const priorityVal = $('#new-priority-select').val();

    let missing = [];
    if (!pointId || pointId.trim() === '') missing.push('Punto de Interés');
    if (!clientIdRaw || clientIdRaw.trim() === '') missing.push('Cliente');
    if (!dayVal || dayVal.trim() === '') missing.push('Día');
    if (!priorityVal || priorityVal.trim() === '') missing.push('Prioridad');

    if (missing.length > 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Campos incompletos',
            html: `Falta seleccionar: <br><strong>${missing.join(', ')}</strong>`
        });
        return;
    }

    const clientId = parseInt(clientIdRaw);
    if (isNaN(clientId) || clientId <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'ID de cliente inválido',
            text: `El valor "${clientIdRaw}" no es un número válido`
        });
        return;
    }

    const exists = originalPointsData.some(p => 
        p.identificador === pointId && p.id_cliente == clientId
    );

    if (exists) {
        Swal.fire({
            icon: 'warning',
            title: 'Punto duplicado',
            text: 'Este punto ya está asignado a esta ruta'
        });
        return;
    }

    const payload = { 
        point_id: pointId,
        client_id: clientId,
        day: dayVal,
        priority: priorityVal
    };

    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(currentRoute)}/add-point`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                $('#add-point-form')[0].reset();
                $('#auto-departamento').val('');
                $('#auto-ciudad').val('');
                viewRouteDetails(currentRoute);
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error de conexión';
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.message) errorMessage = res.message;
            } catch(e) {}
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}

// ============================================================================
// ELIMINAR PUNTO DE RUTA
// ============================================================================
function confirmRemovePoint(programacionId, pointName) {
    Swal.fire({
        title: '¿Eliminar punto?',
        text: `¿Está seguro de eliminar "${pointName}" de esta ruta?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            removePoint(programacionId);
        }
    });
}

function removePoint(programacionId) {
    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(currentRoute)}/remove-point`,
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify({ programacion_id: programacionId }),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Eliminado',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                });
                viewRouteDetails(currentRoute);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'No se pudo eliminar el punto'
                });
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error de conexión al eliminar';
            try {
                const response = JSON.parse(xhr.responseText);
                if (response.message) errorMessage = response.message;
            } catch (e) {}
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        }
    });
}

// ============================================================================
// EDITAR PUNTO/CLIENTE INLINE
// ============================================================================
function openInlineEditModal($row) {
    const programacionId = $row.data('programacion-id');
    const currentPointId = $row.data('point-id');
    const currentClientId = $row.data('client-id');
    const currentPointName = $row.find('td:nth-child(2)').text().trim();
    const currentClientName = $row.find('td:nth-child(3)').text().trim();

    Swal.fire({
        title: '✏️ Editar Punto/Cliente',
        html: `
            <div class="text-start">
                <label class="form-label small fw-bold">Punto de Interés</label>
                <select id="edit-point-select" class="form-select form-select-sm mb-3">
                    <option value="">↪ Mantener actual</option>
                    ${pointsOfInterestCache.map(p => 
                        `<option value="${p.identificador}" ${p.identificador == currentPointId ? 'selected' : ''}>
                            ${p.punto_de_interes}
                        </option>`
                    ).join('')}
                </select>
                
                <label class="form-label small fw-bold">Cliente</label>
                <select id="edit-client-select" class="form-select form-select-sm mb-3">
                    <option value="">↪ Mantener actual</option>
                    ${clientsCache.map(c => 
                        `<option value="${c.id_cliente}" ${c.id_cliente == currentClientId ? 'selected' : ''}>
                            ${c.cliente}
                        </option>`
                    ).join('')}
                </select>
                
                <div class="alert alert-info py-2 mb-0 small">
                    <i class="bi bi-info-circle me-1"></i>
                    Actual: <strong>${currentPointName}</strong> / <strong>${currentClientName}</strong>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '💾 Actualizar',
        cancelButtonText: '❌ Cancelar',
        confirmButtonColor: '#0d6efd',
        width: '500px',
        preConfirm: () => {
            const newPointId = document.getElementById('edit-point-select').value;
            const newClientId = document.getElementById('edit-client-select').value;
            
            if (!newPointId && !newClientId) {
                Swal.showValidationMessage('⚠️ Seleccione al menos un nuevo valor para actualizar');
                return false;
            }
            
            return { 
                programacion_id: programacionId,
                point_id: newPointId || null,
                client_id: newClientId ? parseInt(newClientId) : null
            };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            saveInlineEdit(result.value);
        }
    });
}

function saveInlineEdit(editData) {
    const payload = {
        point_id: editData.point_id,
        client_id: editData.client_id
    };

    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(currentRoute)}/update-point/${editData.programacion_id}`,
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Actualizado',
                    text: response.message,
                    timer: 1500,
                    showConfirmButton: false
                });
                updateTableRow(editData.programacion_id, response.data);
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            console.error('❌ Error edit:', xhr.responseText);
            Swal.fire('Error', 'No se pudo actualizar', 'error');
        }
    });
}

function updateTableRow(programacionId, newData) {
    const $row = $(`tr[data-programacion-id="${programacionId}"]`);
    if ($row.length) {
        $row.attr('data-point-id', newData.identificador);
        $row.attr('data-client-id', newData.id_cliente);
        $row.find('td:nth-child(2)').html(`<strong>${newData.punto_interes || 'N/A'}</strong>`);
        $row.find('td:nth-child(3)').text(newData.cliente || 'N/A');
        $row.find('td:nth-child(6)').text(newData.departamento || 'N/A');
        $row.find('td:nth-child(7)').text(newData.ciudad || 'N/A');
        
        const idx = originalPointsData.findIndex(p => p.id_programacion == programacionId);
        if (idx !== -1) {
            originalPointsData[idx] = {
                ...originalPointsData[idx],
                identificador: newData.identificador,
                punto_interes: newData.punto_interes,
                departamento: newData.departamento,
                ciudad: newData.ciudad,
                cliente: newData.cliente,
                id_cliente: newData.id_cliente
            };
        }
    }
}

// ============================================================================
// CAMBIOS FUTUROS
// ============================================================================
let futureChangesCache = [];

function loadFutureChanges(routeName) {
    fetch(`/rutas/api/routes/${encodeURIComponent(routeName)}/future-changes`)
        .then(response => response.json())
        .then(changes => {
            futureChangesCache = changes;
            renderFutureChanges(changes);
        })
        .catch(error => {
            console.error('Error cargando cambios futuros:', error);
        });
}

function renderFutureChanges(changes) {
    let html = '';
    
    if (changes.length === 0) {
        html = `
            <div class="alert alert-info text-center mb-0">
                <i class="bi bi-info-circle fs-3"></i>
                <p class="mt-2 mb-0">No hay cambios futuros programados</p>
                <small class="text-muted">Los cambios programados aparecerán aquí</small>
            </div>
        `;
    } else {
        html = `
            <div class="table-responsive">
                <table class="table table-hover align-middle table-sm">
                    <thead class="table-light">
                        <tr>
                            <th>Fecha Ejecución</th>
                            <th>Tipo</th>
                            <th>Punto</th>
                            <th>Cliente</th>
                            <th>Día</th>
                            <th>Prioridad</th>
                            <th>Estado</th>
                            <th>Creado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        changes.forEach(change => {
            const tipoClass = {
                'INSERT': 'bg-success text-white',
                'UPDATE': 'bg-warning text-dark',
                'DELETE': 'bg-danger text-white'
            }[change.tipo_cambio] || 'bg-secondary';
            
            const estadoClass = {
                'PENDIENTE': 'text-warning',
                'EJECUTADO': 'text-success',
                'CANCELADO': 'text-muted'
            }[change.estado] || 'text-secondary';
            
            const canCancel = change.estado === 'PENDIENTE';
            
            html += `
                <tr>
                    <td><strong>${change.fecha_ejecucion}</strong></td>
                    <td><span class="badge ${tipoClass}">${change.tipo_cambio}</span></td>
                    <td>${change.punto_interes_nombre}</td>
                    <td>${change.cliente_nombre}</td>
                    <td>${change.dia || '-'}</td>
                    <td>${change.prioridad || '-'}</td>
                    <td class="${estadoClass}"><strong>${change.estado}</strong></td>
                    <td><small>${change.fecha_creacion}<br>por ${change.creado_por}</small></td>
                    <td>
                        ${canCancel ? `
                            <button class="btn btn-sm btn-outline-danger cancel-future-btn" 
                                    data-cambio-id="${change.id_cambio_futuro}"
                                    title="Cancelar programación">
                                <i class="bi bi-x-circle"></i>
                            </button>
                        ` : '<span class="text-muted">-</span>'}
                    </td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
    }

    $('#future-changes-container').html(html);
}

function showScheduleFutureModal(programacionId, pointName, clientName, currentDay, currentPriority, currentActive) {
    const minDate = new Date().toISOString().split('T')[0];
    
    Swal.fire({
        title: '📅 Programar Cambio Futuro',
        html: `
            <div class="text-start">
                <div class="alert alert-info py-2 mb-3 small">
                    <i class="bi bi-calendar-event me-1"></i>
                    <strong>Punto:</strong> ${pointName} | <strong>Cliente:</strong> ${clientName}
                </div>
                
                <label class="form-label small fw-bold">Fecha de Ejecución <span class="text-danger">*</span></label>
                <input type="date" id="future-exec-date" class="form-control mb-3" min="${minDate}" required>
                
                <label class="form-label small fw-bold">Tipo de Cambio</label>
                <select id="future-change-type" class="form-select mb-3" onchange="toggleFutureChangeFields()">
                    <option value="UPDATE">Actualizar (Día/Prioridad/Estado)</option>
                    <option value="DELETE">Eliminar de la ruta</option>
                </select>
                
                <div id="future-update-fields">
                    <label class="form-label small fw-bold">Día de Visita</label>
                    <select id="future-day-select" class="form-select form-select-sm mb-3">
                        <option value="">Sin cambio</option>
                        ${availableDays.map(day => 
                            `<option value="${day}" ${currentDay === day ? 'selected' : ''}>${day}</option>`
                        ).join('')}
                    </select>
                    
                    <label class="form-label small fw-bold">Prioridad</label>
                    <select id="future-priority-select" class="form-select form-select-sm mb-3">
                        <option value="">Sin cambio</option>
                        ${priorities.map(p => 
                            `<option value="${p}" ${currentPriority === p ? 'selected' : ''}>${p}</option>`
                        ).join('')}
                    </select>
                    
                    <label class="form-label small fw-bold">Estado Activo</label>
                    <select id="future-active-select" class="form-select form-select-sm mb-3">
                        <option value="">Sin cambio</option>
                        <option value="1" ${currentActive ? 'selected' : ''}>✅ Activo</option>
                        <option value="0" ${!currentActive ? 'selected' : ''}>❌ Inactivo</option>
                    </select>
                </div>
                
                <label class="form-label small fw-bold">Observaciones</label>
                <textarea id="future-observations" class="form-control form-control-sm mb-2" rows="2" 
                          placeholder="Opcional"></textarea>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '💾 Programar',
        cancelButtonText: '❌ Cancelar',
        confirmButtonColor: '#0d6efd',
        width: '550px',
        preConfirm: () => {
            const fechaEjecucion = document.getElementById('future-exec-date').value;
            const tipoCambio = document.getElementById('future-change-type').value;
            const observaciones = document.getElementById('future-observations').value;
            
            if (!fechaEjecucion) {
                Swal.showValidationMessage('⚠️ Seleccione una fecha de ejecución');
                return false;
            }
            
            return {
                programacion_id: programacionId,
                tipo_cambio: tipoCambio,
                fecha_ejecucion: fechaEjecucion,
                dia: tipoCambio === 'UPDATE' ? document.getElementById('future-day-select').value : null,
                prioridad: tipoCambio === 'UPDATE' ? document.getElementById('future-priority-select').value : null,
                activa: tipoCambio === 'UPDATE' ? document.getElementById('future-active-select').value : null,
                observaciones: observaciones
            };
        }
    }).then((result) => {
        if (result.isConfirmed && result.value) {
            scheduleFutureChange(result.value);
        }
    });
}

function toggleFutureChangeFields() {
    const tipoCambio = document.getElementById('future-change-type').value;
    const updateFields = document.getElementById('future-update-fields');
    if (tipoCambio === 'DELETE') {
        updateFields.style.display = 'none';
    } else {
        updateFields.style.display = 'block';
    }
}

function scheduleFutureChange(changeData) {
    const payload = {
        tipo_cambio: changeData.tipo_cambio,
        fecha_ejecucion: changeData.fecha_ejecucion,
        id_programacion: changeData.programacion_id,
        dia: changeData.dia || null,
        prioridad: changeData.prioridad || null,
        activa: changeData.activa !== null ? (changeData.activa === '1' ? true : false) : null,
        observaciones: changeData.observaciones || ''
    };

    $.ajax({
        url: `/rutas/api/routes/${encodeURIComponent(currentRoute)}/schedule-change`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Programado',
                    html: `Cambio <strong>${response.tipo_cambio}</strong> programado para <strong>${response.fecha_ejecucion}</strong>`,
                    timer: 2000,
                    showConfirmButton: false
                });
                loadFutureChanges(currentRoute);
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al programar';
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.message) errorMessage = res.message;
            } catch(e) {}
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}

function confirmCancelFutureChange(cambioId) {
    Swal.fire({
        title: '¿Cancelar programación?',
        text: '¿Está seguro de cancelar este cambio futuro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No, mantener'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: `/rutas/api/routes/future-change/${cambioId}/cancel`,
                method: 'POST',
                success: function(response) {
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Cancelado',
                            text: response.message,
                            timer: 1500,
                            showConfirmButton: false
                        });
                        loadFutureChanges(currentRoute);
                    } else {
                        Swal.fire('Error', response.message, 'error');
                    }
                },
                error: function(xhr) {
                    Swal.fire('Error', 'No se pudo cancelar', 'error');
                }
            });
        }
    });
}