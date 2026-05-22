document.addEventListener('DOMContentLoaded', function() {
    let solicitudIdParaRechazar = null;
    
    // Cargar solicitudes al iniciar
    cargarSolicitudes();
    
    // Event listeners
    document.getElementById('btnActualizarSolicitudes').addEventListener('click', cargarSolicitudes);
    document.getElementById('btnConfirmarRechazo').addEventListener('click', confirmarRechazo);
    
    function cargarSolicitudes() {
        Swal.fire({
            title: 'Cargando solicitudes...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        fetch('/atencion-cliente/api/solicitudes-pendientes')
            .then(response => response.json())
            .then(data => {
                Swal.close();
                if (data.success) {
                    renderizarSolicitudes(data.requests);
                } else {
                    Swal.fire('Error', data.message || 'No se pudieron cargar las solicitudes', 'error');
                    renderizarError(data.message);
                }
            })
            .catch(error => {
                Swal.close();
                console.error('Error cargando solicitudes:', error);
                Swal.fire('Error', 'Error al cargar las solicitudes', 'error');
                renderizarError('Error de conexión con el servidor');
            });
    }
    
    function renderizarSolicitudes(solicitudes) {
        const container = document.getElementById('solicitudesContainer');
        
        if (solicitudes.length === 0) {
            container.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="bi bi-check-circle-fill" style="font-size: 3rem;"></i>
                    <h4 class="mt-3">¡No hay solicitudes pendientes!</h4>
                    <p class="mb-0">Todas las solicitudes han sido procesadas.</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="row">
                ${solicitudes.map(req => generarCardSolicitud(req)).join('')}
            </div>
        `;
        
        container.innerHTML = html;
        
        // Agregar event listeners a los botones
        document.querySelectorAll('.btn-aprobar').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                aprobarSolicitud(id);
            });
        });
        
        document.querySelectorAll('.btn-rechazar').forEach(btn => {
            btn.addEventListener('click', function() {
                solicitudIdParaRechazar = this.dataset.id;
                const modal = new bootstrap.Modal(document.getElementById('modalRechazarSolicitud'));
                document.getElementById('motivoRechazo').value = '';
                modal.show();
            });
        });
    }
    
    function generarCardSolicitud(req) {
        let actionText = '';
        let detailsHTML = '';
        const data = req.data || {};
        const requester = req.requester || {};
        
        switch(req.type) {
            case 'creacion_usuario':
                actionText = `Solicitud para crear usuario <strong>${data.username || 'Desconocido'}</strong>`;
                detailsHTML = `
                    <p class="mb-1"><strong>Rol:</strong> ${data.role || 'No especificado'}</p>
                    <p class="mb-1"><strong>Email:</strong> ${data.email || 'No proporcionado'}</p>
                `;
                break;
            case 'eliminacion_usuario':
                actionText = `Solicitud para eliminar usuario <strong>${data.username || 'Desconocido'}</strong>`;
                break;
            case 'creacion_mercaderista':
                actionText = `Solicitud para crear mercaderista <strong>${data.nombre || 'Desconocido'}</strong>`;
                detailsHTML = `
                    <p class="mb-1"><strong>Cédula:</strong> ${data.cedula || 'No especificada'}</p>
                `;
                break;
            case 'eliminacion_mercaderista':
                actionText = `Solicitud para desactivar mercaderista <strong>${data.nombre || 'Desconocido'}</strong>`;
                detailsHTML = `
                    <p class="mb-1"><strong>Cédula:</strong> ${data.cedula || 'No especificada'}</p>
                `;
                break;
            case 'cambio_estado_mercaderista':
                const actionTextStatus = data.action === 'enable' ? 'habilitar' : 'deshabilitar';
                actionText = `Solicitud para ${actionTextStatus} mercaderista <strong>${data.nombre || 'Desconocido'}</strong>`;
                detailsHTML = `
                    <p class="mb-1"><strong>Cédula:</strong> ${data.cedula || 'No especificada'}</p>
                `;
                break;
            default:
                actionText = `Solicitud desconocida (${req.type})`;
                break;
        }
        
        return `
            <div class="col-md-6 mb-4">
                <div class="card h-100 shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h5 class="card-title mb-0">${actionText}</h5>
                    </div>
                    <div class="card-body">
                        ${detailsHTML}
                        <p class="mb-1"><strong>Solicitado por:</strong> ${requester.username || 'Desconocido'} (${requester.role || 'Desconocido'})</p>
                        <p class="mb-0"><strong>Fecha:</strong> ${req.date ? new Date(req.date).toLocaleString('es-ES') : 'No especificada'}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-success btn-aprobar" data-id="${req.id}">
                            <i class="bi bi-check-circle me-1"></i>Aprobar
                        </button>
                        <button class="btn btn-danger btn-rechazar" data-id="${req.id}">
                            <i class="bi bi-x-circle me-1"></i>Rechazar
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    function renderizarError(mensaje) {
        const container = document.getElementById('solicitudesContainer');
        container.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-exclamation-triangle-fill" style="font-size: 3rem;"></i>
                <h4 class="mt-3">Error</h4>
                <p class="mb-0">${mensaje || 'No se pudieron cargar las solicitudes'}</p>
            </div>
        `;
    }
    
    function aprobarSolicitud(id) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres aprobar esta solicitud?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, aprobar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#28a745'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/atencion-cliente/api/solicitudes-aprobar/${id}`, {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Aprobada!',
                            text: 'La solicitud ha sido aprobada exitosamente',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            cargarSolicitudes();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo aprobar la solicitud', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error aprobando solicitud:', error);
                    Swal.fire('Error', 'Error al aprobar la solicitud', 'error');
                });
            }
        });
    }
    
    function confirmarRechazo() {
        if (!solicitudIdParaRechazar) return;
        
        const motivo = document.getElementById('motivoRechazo').value.trim();
        
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Quieres rechazar esta solicitud?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, rechazar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/atencion-cliente/api/solicitudes-rechazar/${solicitudIdParaRechazar}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        comment: motivo
                    })
                })
                .then(response => response.json())
                .then(data => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('modalRechazarSolicitud'));
                    modal.hide();
                    
                    if (data.success) {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Rechazada!',
                            text: 'La solicitud ha sido rechazada',
                            timer: 2000,
                            showConfirmButton: false
                        }).then(() => {
                            cargarSolicitudes();
                        });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo rechazar la solicitud', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error rechazando solicitud:', error);
                    Swal.fire('Error', 'Error al rechazar la solicitud', 'error');
                });
            }
        });
    }
});