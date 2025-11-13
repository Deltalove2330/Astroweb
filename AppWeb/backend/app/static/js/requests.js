// static/js/requests.js
export function loadRequests() {
    Swal.fire({
        title: 'Cargando solicitudes...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    $.ajax({
        url: '/requests/api/pending-requests',
        method: 'GET',
        success: function(response) {
            Swal.close();
            if (response.success) {
                let requestsHTML = `
                    <div class="container-fluid mt-4">
                        <h2><i class="bi bi-clipboard-check me-2"></i>Solicitudes Pendientes</h2>
                        <div class="row mt-3">
                `;
                
                if (response.requests.length === 0) {
                    requestsHTML += `
                        <div class="col-12">
                            <div class="alert alert-info">No hay solicitudes pendientes</div>
                        </div>
                    `;
                } else {
                    response.requests.forEach(req => {
                        let actionText = '';
                        let detailsHTML = '';
                        const data = req.data || {};
                        const requester = req.requester || {};
                        
                        switch(req.type) {
                            case 'creacion_usuario':
                                actionText = `Solicitud para crear usuario <strong>${data.username || 'Desconocido'}</strong>`;
                                detailsHTML = `
                                    <p><strong>Rol:</strong> ${data.role || 'No especificado'}</p>
                                    <p><strong>Email:</strong> ${data.email || 'No proporcionado'}</p>
                                `;
                                break;
                            case 'eliminacion_usuario':
                                actionText = `Solicitud para eliminar usuario <strong>${data.username || 'Desconocido'}</strong>`;
                                break;
                            case 'creacion_mercaderista':
                                actionText = `Solicitud para crear mercaderista <strong>${data.nombre || 'Desconocido'}</strong>`;
                                detailsHTML = `
                                    <p><strong>Cédula:</strong> ${data.cedula || 'No especificada'}</p>
                                `;
                                break;
                            case 'eliminacion_mercaderista':
                                actionText = `Solicitud para desactivar mercaderista <strong>${data.nombre || 'Desconocido'}</strong>`;
                                detailsHTML = `
                                    <p><strong>Cédula:</strong> ${data.cedula || 'No especificada'}</p>
                                `;
                                break;
                            case 'cambio_estado_mercaderista':
                                const actionTextStatus = data.action === 'enable' ? 'habilitar' : 'deshabilitar';
                                actionText = `Solicitud para ${actionTextStatus} mercaderista <strong>${data.nombre || 'Desconocido'}</strong>`;
                                detailsHTML = `
                                    <p><strong>Cédula:</strong> ${data.cedula || 'No especificada'}</p>
                                `;
                                break;
                            default:
                                actionText = `Solicitud desconocida (${req.type})`;
                                break;
                        }
                        
                        requestsHTML += `
                            <div class="col-md-6 mb-4">
                                <div class="card h-100">
                                    <div class="card-header bg-primary text-white">
                                        <h5 class="card-title mb-0">${actionText}</h5>
                                    </div>
                                    <div class="card-body">
                                        ${detailsHTML}
                                        <p><strong>Solicitado por:</strong> ${requester.username || 'Desconocido'} (${requester.role || 'Desconocido'})</p>
                                        <p><strong>Fecha:</strong> ${req.date ? new Date(req.date).toLocaleString() : 'No especificada'}</p>
                                    </div>
                                    <div class="card-footer d-flex justify-content-between">
                                        <button class="btn btn-success approve-request" data-id="${req.id}">
                                            <i class="bi bi-check-circle me-1"></i>Aprobar
                                        </button>
                                        <button class="btn btn-danger reject-request" data-id="${req.id}">
                                            <i class="bi bi-x-circle me-1"></i>Rechazar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                }
                
                requestsHTML += `
                        </div>
                    </div>
                `;
                
                $('#content-area').html(requestsHTML);
                
                // Manejar botones de aprobar/rechazar
                $('.approve-request').click(function() {
                    const requestId = $(this).data('id');
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¿Quieres aprobar esta solicitud?",
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, aprobar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $.ajax({
                                url: `/requests/api/approve-request/${requestId}`,
                                method: 'POST',
                                success: function(response) {
                                    if (response.success) {
                                        Swal.fire(
                                            'Aprobada!',
                                            'La solicitud ha sido aprobada.',
                                            'success'
                                        ).then(() => {
                                            loadRequests();
                                        });
                                    } else {
                                        Swal.fire(
                                            'Error!',
                                            response.message || 'No se pudo aprobar la solicitud.',
                                            'error'
                                        );
                                    }
                                },
                                error: function(xhr) {
                                    let errorMessage = 'Hubo un error al aprobar la solicitud.';
                                    if (xhr.responseJSON && xhr.responseJSON.message) {
                                        errorMessage = xhr.responseJSON.message;
                                    } else if (xhr.responseText) {
                                        try {
                                            const response = JSON.parse(xhr.responseText);
                                            errorMessage = response.message || errorMessage;
                                        } catch (e) {
                                            // Mantener mensaje genérico
                                        }
                                    }
                                    Swal.fire('Error!', errorMessage, 'error');
                                }
                            });
                        }
                    });
                });
                
                $('.reject-request').click(function() {
                    const requestId = $(this).data('id');
                    Swal.fire({
                        title: '¿Estás seguro?',
                        text: "¿Quieres rechazar esta solicitud?",
                        icon: 'warning',
                        input: 'text',
                        inputLabel: 'Motivo del rechazo (opcional)',
                        inputPlaceholder: 'Escribe el motivo aquí...',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, rechazar',
                        cancelButtonText: 'Cancelar'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            $.ajax({
                                url: `/requests/api/reject-request/${requestId}`,
                                method: 'POST',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    comment: result.value
                                }),
                                success: function(response) {
                                    if (response.success) {
                                        Swal.fire(
                                            'Rechazada!',
                                            'La solicitud ha sido rechazada.',
                                            'success'
                                        ).then(() => {
                                            loadRequests();
                                        });
                                    } else {
                                        Swal.fire(
                                            'Error!',
                                            response.message || 'No se pudo rechazar la solicitud.',
                                            'error'
                                        );
                                    }
                                },
                                error: function(xhr) {
                                    let errorMessage = 'Hubo un error al rechazar la solicitud.';
                                    if (xhr.responseJSON && xhr.responseJSON.message) {
                                        errorMessage = xhr.responseJSON.message;
                                    } else if (xhr.responseText) {
                                        try {
                                            const response = JSON.parse(xhr.responseText);
                                            errorMessage = response.message || errorMessage;
                                        } catch (e) {
                                            // Mantener mensaje genérico
                                        }
                                    }
                                    Swal.fire('Error!', errorMessage, 'error');
                                }
                            });
                        }
                    });
                });
            } else {
                Swal.fire(
                    'Error!',
                    response.message || 'No se pudieron cargar las solicitudes.',
                    'error'
                );
            }
        },
        error: function(xhr) {
            Swal.close();
            let errorMessage = 'Hubo un problema al cargar las solicitudes.';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    errorMessage = response.message || errorMessage;
                } catch (e) {
                    // Mantener mensaje genérico
                }
            }
            Swal.fire('Error!', errorMessage, 'error');
        }
    });
}

export function initRequestsSidebar() {
    $(document).on('click', '#requests-toggle', function(e) {
        e.preventDefault();
        if ($(window).width() < 768 && typeof window.closeSidebar === 'function') {
            window.closeSidebar();
        }
        loadRequests();
    });
}