// /static/js/mercaderista_rutas.js
// ============================================================================
// GESTIÓN DE ASIGNACIÓN DE RUTAS A MERCADERISTAS
// ============================================================================

// Variables globales
let currentMercaderista = null;
let mercaderistasCache = [];
let routesCache = [];
let currentAssignments = [];
let originalAssignments = [];

// ============================================================================
// INICIALIZACIÓN
// ============================================================================
$(document).ready(function() {
    loadMercaderistas();
    loadRoutes();
    
    // Eventos de filtro
    $('#filter-btn').on('click', filterMercaderistas);
    
    $('#search-mercaderista').on('keypress', function(e) {
        if (e.which === 13) filterMercaderistas();
    });
    
    // Delegación de eventos
    $(document).on('click', '.select-mercaderista-btn', function() {
        const mercaderistaId = $(this).data('mercaderista-id');
        openRouteAssignmentModal(mercaderistaId);
    });
    
    $(document).on('click', '#save-assignments-btn', function() {
        saveRouteAssignments();
    });
    
    $(document).on('change', '.route-type-select', function() {
        const $row = $(this).closest('tr');
        const routeId = $row.data('route-id');
        const newType = $(this).val();
        updateAssignmentType(routeId, newType);
    });
    
    $(document).on('click', '.remove-route-assignment-btn', function() {
        const $row = $(this).closest('tr');
        const routeId = $row.data('route-id');
        const routeName = $row.data('route-name');
        confirmRemoveAssignment(routeId, routeName);
    });
    
    $(document).on('click', '.add-route-checkbox', function() {
        const routeId = $(this).val();
        const routeName = $(this).data('route-name');
        toggleRouteSelection(routeId, routeName);
    });
});

// ============================================================================
// CARGAR DATOS
// ============================================================================
function loadMercaderistas() {
    const $list = $('#mercaderistas-list');
    $list.html(`
        <div class="col-12">
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
                <p class="mt-3 text-muted">Cargando mercaderistas...</p>
            </div>
        </div>
    `);
    
    fetch('/mercaderista-rutas/api/mercaderistas')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        })
        .then(data => {
            mercaderistasCache = data;
            renderMercaderistas(data);
        })
        .catch(error => {
            console.error('❌ Error cargando mercaderistas:', error);
            $list.html(`
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        Error al cargar mercaderistas: ${error.message}
                    </div>
                </div>
            `);
        });
}

function loadRoutes() {
    fetch('/mercaderista-rutas/api/routes')
        .then(response => response.json())
        .then(data => {
            routesCache = data;
        })
        .catch(error => {
            console.error('❌ Error cargando rutas:', error);
        });
}

function renderMercaderistas(mercaderistas) {
    let html = '';
    
    if (mercaderistas.length === 0) {
        html = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle fs-1"></i>
                    <p class="mt-2 mb-0">No se encontraron mercaderistas</p>
                </div>
            </div>
        `;
    } else {
        mercaderistas.forEach(m => {
            const activoClass = m.activo ? 'border-success' : 'border-secondary';
            const activoBadge = m.activo 
                ? '<span class="badge bg-success">Activo</span>' 
                : '<span class="badge bg-secondary">Inactivo</span>';
            
            const tipoClass = m.tipo === 'Fijo' ? 'tipo-fija' : 'tipo-variable';
            const tipoBadge = `<span class="badge ${tipoClass}">${m.tipo || 'Variable'}</span>`;
            
            const rutasCount = m.rutas_asignadas || 0;
            
            html += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card mercaderista-card h-100 ${activoClass}">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">${m.nombre}</h5>
                            ${activoBadge}
                        </div>
                        <div class="card-body">
                            <p class="mb-2">
                                <i class="bi bi-card-text me-1"></i>
                                <strong>Cédula:</strong> ${m.cedula || 'N/A'}
                            </p>
                            <p class="mb-2">
                                <i class="bi bi-telephone me-1"></i>
                                <strong>Teléfono:</strong> ${m.telefono || 'N/A'}
                            </p>
                            <p class="mb-2">
                                <i class="bi bi-envelope me-1"></i>
                                <strong>Email:</strong> ${m.email || 'N/A'}
                            </p>
                            <p class="mb-3">
                                <i class="bi bi-map me-1"></i>
                                <strong>Tipo:</strong> ${tipoBadge}
                            </p>
                            <div class="alert alert-light border mb-3">
                                <i class="bi bi-geo-alt me-1"></i>
                                <strong>Rutas Asignadas:</strong> ${rutasCount}
                            </div>
                            <button class="btn btn-primary w-100 select-mercaderista-btn" 
                                    data-mercaderista-id="${m.id_mercaderista}">
                                <i class="bi bi-pencil-square me-1"></i>Administrar Rutas
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    $('#mercaderistas-list').html(html);
}

function filterMercaderistas() {
    const searchTerm = $('#search-mercaderista').val().toLowerCase();
    const activoFilter = $('#filter-activo').val();
    const tipoFilter = $('#filter-tipo').val();
    
    let filtered = mercaderistasCache.filter(m => {
        const matchSearch = !searchTerm || 
            (m.nombre && m.nombre.toLowerCase().includes(searchTerm)) ||
            (m.cedula && m.cedula.includes(searchTerm)) ||
            (m.email && m.email.toLowerCase().includes(searchTerm));
        
        const matchActivo = !activoFilter || 
            (activoFilter === '1' && m.activo) ||
            (activoFilter === '0' && !m.activo);
        
        const matchTipo = !tipoFilter || m.tipo === tipoFilter;
        
        return matchSearch && matchActivo && matchTipo;
    });
    
    renderMercaderistas(filtered);
}

// ============================================================================
// MODAL DE ASIGNACIÓN DE RUTAS
// ============================================================================
function openRouteAssignmentModal(mercaderistaId) {
    currentMercaderista = mercaderistaId;
    currentAssignments = [];
    originalAssignments = [];
    
    const mercaderista = mercaderistasCache.find(m => m.id_mercaderista == mercaderistaId);
    if (!mercaderista) {
        Swal.fire('Error', 'Mercaderista no encontrado', 'error');
        return;
    }
    
    $('#modalMercaderistaTitle').html(`
        <i class="bi bi-person-badge me-2"></i>
        ${mercaderista.nombre} - Asignar Rutas
    `);
    
    $('#route-assignment-content').html(`
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando asignaciones...</p>
        </div>
    `);
    
    $('#routeAssignmentModal').modal('show');
    
    // Cargar asignaciones actuales
    fetch(`/mercaderista-rutas/api/mercaderista/${mercaderistaId}/routes`)
        .then(response => response.json())
        .then(assignments => {
            originalAssignments = [...assignments];
            currentAssignments = [...assignments];
            renderRouteAssignmentContent(mercaderista, assignments);
        })
        .catch(error => {
            console.error('Error cargando asignaciones:', error);
            Swal.fire('Error', 'No se pudieron cargar las asignaciones', 'error');
        });
}

function renderRouteAssignmentContent(mercaderista, assignments) {
    const assignedRouteIds = assignments.map(a => a.id_ruta);
    
    let html = `
        <div class="row">
            <!-- Columna Izquierda: Rutas Asignadas -->
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0">
                            <i class="bi bi-check-circle me-2"></i>Rutas Asignadas (${assignments.length})
                        </h6>
                    </div>
                    <div class="card-body">
    `;
    
    if (assignments.length === 0) {
        html += `
            <div class="alert alert-info text-center mb-0">
                <i class="bi bi-info-circle fs-3"></i>
                <p class="mt-2 mb-0">No tiene rutas asignadas</p>
                <small class="text-muted">Seleccione rutas de la lista derecha</small>
            </div>
        `;
    } else {
        html += `
            <div class="table-responsive">
                <table class="table table-hover align-middle table-sm">
                    <thead class="table-light">
                        <tr>
                            <th>Ruta</th>
                            <th style="width: 120px;">Tipo</th>
                            <th style="width: 50px;"></th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        assignments.forEach(a => {
            const tipoClass = a.tipo_ruta === 'Fijo' ? 'tipo-fija' : 'tipo-variable';
            
            html += `
                <tr data-route-id="${a.id_ruta}">
                    <td>
                        <strong>${a.ruta_nombre || 'Ruta ' + a.id_ruta}</strong>
                        <br><small class="text-muted">${a.servicio || ''}</small>
                    </td>
                    <td>
                        <select class="form-select form-select-sm route-type-select">
                            <option value="Fijo" ${a.tipo_ruta === 'Fijo' ? 'selected' : ''}>Fija</option>
                            <option value="Variable" ${a.tipo_ruta === 'Variable' ? 'selected' : ''}>Variable</option>
                        </select>
                    </td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger remove-route-assignment-btn" 
                                data-route-id="${a.id_ruta}"
                                data-route-name="${a.ruta_nombre || 'Ruta ' + a.id_ruta}"
                                title="Eliminar asignación">
                            <i class="bi bi-trash"></i>
                        </button>
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
    
    html += `
                    </div>
                </div>
            </div>
            
            <!-- Columna Derecha: Rutas Disponibles -->
            <div class="col-md-6">
                <div class="card mb-3">
                    <div class="card-header bg-success text-white">
                        <h6 class="mb-0">
                            <i class="bi bi-plus-circle me-2"></i>Rutas Disponibles
                        </h6>
                    </div>
                    <div class="card-body">
                        <div class="mb-3">
                            <input type="text" id="search-available-routes" class="form-control form-control-sm" 
                                   placeholder="Buscar ruta...">
                        </div>
                        <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                            <table class="table table-hover align-middle table-sm">
                                <thead class="table-light">
                                    <tr>
                                        <th style="width: 40px;">Sel.</th>
                                        <th>Ruta</th>
                                        <th>Servicio</th>
                                    </tr>
                                </thead>
                                <tbody id="available-routes-body">
        `;
        
        routesCache.forEach(r => {
            const isAssigned = assignedRouteIds.includes(r.id_ruta);
            const disabled = isAssigned ? 'disabled checked' : '';
            const rowClass = isAssigned ? 'table-secondary' : '';
            
            html += `
                <tr class="${rowClass}" data-route-id="${r.id_ruta}">
                    <td>
                        <input type="checkbox" class="form-check-input add-route-checkbox" 
                               value="${r.id_ruta}" 
                               data-route-name="${r.ruta}"
                               ${disabled}>
                    </td>
                    <td><strong>${r.ruta}</strong></td>
                    <td><small>${r.servicio || 'N/A'}</small></td>
                </tr>
            `;
        });
        
        html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Información del Mercaderista -->
        <div class="card mt-3">
            <div class="card-header bg-light">
                <h6 class="mb-0">
                    <i class="bi bi-info-circle me-2"></i>Información del Mercaderista
                </h6>
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-md-3">
                        <strong>Cédula:</strong><br>${mercaderista.cedula || 'N/A'}
                    </div>
                    <div class="col-md-3">
                        <strong>Teléfono:</strong><br>${mercaderista.telefono || 'N/A'}
                    </div>
                    <div class="col-md-3">
                        <strong>Email:</strong><br>${mercaderista.email || 'N/A'}
                    </div>
                    <div class="col-md-3">
                        <strong>Tipo:</strong><br>
                        <span class="badge ${mercaderista.tipo === 'Fijo' ? 'tipo-fija' : 'tipo-variable'}">
                            ${mercaderista.tipo || 'Variable'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#route-assignment-content').html(html);
    
    // Evento de búsqueda en rutas disponibles
    $('#search-available-routes').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('#available-routes-body tr').each(function() {
            const routeName = $(this).find('td:nth-child(2)').text().toLowerCase();
            const servicio = $(this).find('td:nth-child(3)').text().toLowerCase();
            const show = routeName.includes(searchTerm) || servicio.includes(searchTerm);
            $(this).toggle(show);
        });
    });
}

function toggleRouteSelection(routeId, routeName) {
    const $checkbox = $(`.add-route-checkbox[value="${routeId}"]`);
    const isChecked = $checkbox.is(':checked');
    
    if (isChecked) {
        // Agregar a asignaciones
        if (!currentAssignments.find(a => a.id_ruta == routeId)) {
            currentAssignments.push({
                id_ruta: routeId,
                ruta_nombre: routeName,
                tipo_ruta: 'Variable' // Default
            });
        }
        $checkbox.closest('tr').removeClass('table-secondary');
    } else {
        // Remover de asignaciones
        currentAssignments = currentAssignments.filter(a => a.id_ruta != routeId);
        $checkbox.closest('tr').addClass('table-secondary');
    }
    
    console.log('📋 Asignaciones actuales:', currentAssignments);
}

function updateAssignmentType(routeId, newType) {
    const assignment = currentAssignments.find(a => a.id_ruta == routeId);
    if (assignment) {
        assignment.tipo_ruta = newType;
        console.log(`🔄 Tipo actualizado para ruta ${routeId}: ${newType}`);
    }
}

function confirmRemoveAssignment(routeId, routeName) {
    Swal.fire({
        title: '¿Eliminar Asignación?',
        html: `¿Está seguro de eliminar la ruta <strong>${routeName}</strong> de este mercaderista?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545'
    }).then((result) => {
        if (result.isConfirmed) {
            currentAssignments = currentAssignments.filter(a => a.id_ruta != routeId);
            $(`.add-route-checkbox[value="${routeId}"]`).prop('checked', false);
            $(`.add-route-checkbox[value="${routeId}"]`).closest('tr').addClass('table-secondary');
            $(`tr[data-route-id="${routeId}"]`).remove();
            
            // Actualizar contador
            const count = currentAssignments.length;
            $('.card-header.bg-primary h6').html(`
                <i class="bi bi-check-circle me-2"></i>Rutas Asignadas (${count})
            `);
            
            Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Asignación eliminada',
                timer: 1500,
                showConfirmButton: false
            });
        }
    });
}

function saveRouteAssignments() {
    if (currentAssignments.length === 0) {
        Swal.fire({
            icon: 'warning',
            title: 'Sin asignaciones',
            text: 'No hay rutas asignadas. ¿Desea continuar?',
            showCancelButton: true,
            confirmButtonText: 'Sí, guardar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                submitAssignments();
            }
        });
    } else {
        submitAssignments();
    }
}

function submitAssignments() {
    const payload = {
        id_mercaderista: currentMercaderista,
        rutas: currentAssignments.map(a => ({
            id_ruta: a.id_ruta,
            tipo_ruta: a.tipo_ruta || 'Variable'
        }))
    };
    
    console.log('📤 Enviando asignaciones:', payload);
    
    $.ajax({
        url: '/mercaderista-rutas/api/assignments/save',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function(response) {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '✅ Guardado',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                });
                $('#routeAssignmentModal').modal('hide');
                loadMercaderistas(); // Recargar lista
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            let errorMessage = 'Error al guardar';
            try {
                const res = JSON.parse(xhr.responseText);
                if (res.message) errorMessage = res.message;
            } catch(e) {}
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}