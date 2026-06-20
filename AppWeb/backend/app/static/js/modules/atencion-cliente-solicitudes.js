document.addEventListener('DOMContentLoaded', function() {
    let solicitudIdParaRechazar = null;
    let solicitudesActuales = [];   // para poder mirar el tipo/datos al aprobar
    let catalogosPdvCache = null;   // catálogos para completar PDV al aprobar
    
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
        solicitudesActuales = solicitudes || [];

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
                const req = solicitudesActuales.find(r => String(r.id) === String(id));
                if (req && req.type === 'creacion_pdv') {
                    aprobarPDV(req);          // ATC completa los datos del PDV
                } else {
                    aprobarSolicitud(id);
                }
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
            case 'creacion_pdv': {
                actionText = `Solicitud para crear PDV <strong>${data.punto_de_interes || 'Sin nombre'}</strong>`;
                const gps = (data.latitud != null && data.longitud != null)
                    ? `${Number(data.latitud).toFixed(5)}, ${Number(data.longitud).toFixed(5)}`
                    : 'Sin ubicación';
                const fotoT = data.foto_tienda
                    ? `<a href="${data.foto_tienda}" target="_blank"><img src="${data.foto_tienda}" alt="Tienda" style="height:90px;width:90px;object-fit:cover;border-radius:8px;border:1px solid #ddd;"></a>`
                    : '<span class="text-muted small">Sin foto</span>';
                const fotoR = data.foto_rif
                    ? `<a href="${data.foto_rif}" target="_blank"><img src="${data.foto_rif}" alt="RIF" style="height:90px;width:90px;object-fit:cover;border-radius:8px;border:1px solid #ddd;"></a>`
                    : '<span class="text-muted small">Sin foto</span>';
                detailsHTML = `
                    <p class="mb-1"><strong>RIF:</strong> ${data.rif || 'No especificado'}</p>
                    <p class="mb-1"><strong>Dirección:</strong> ${data.direccion || 'No especificada'}</p>
                    <p class="mb-2"><strong>Ubicación:</strong> ${gps}</p>
                    <div class="d-flex gap-3">
                        <div class="text-center"><div class="small text-muted mb-1">Tienda</div>${fotoT}</div>
                        <div class="text-center"><div class="small text-muted mb-1">RIF</div>${fotoR}</div>
                    </div>
                `;
                break;
            }
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
    
    // ── Aprobación de solicitudes de PDV (ATC completa los datos) ──
    function cargarCatalogosPdv() {
        if (catalogosPdvCache) return Promise.resolve(catalogosPdvCache);
        const base = '/atencion-cliente/api/pdv/';
        const eps = {
            jerarquia_nivel_2_2: 'jerarquias-n2-2',
            jerarquia_nivel_2: 'jerarquias-n2',
            clasificacion_de_canal: 'canales',
            nivel_de_alcance: 'alcances',
            departamento: 'departamentos',
            ciudad: 'ciudades',
            localidad: 'localidades'
        };
        const keys = Object.keys(eps);
        return Promise.all(keys.map(k =>
            fetch(base + eps[k]).then(r => r.ok ? r.json() : []).catch(() => [])
        )).then(results => {
            const cat = {};
            keys.forEach((k, i) => { cat[k] = Array.isArray(results[i]) ? results[i] : []; });
            catalogosPdvCache = cat;
            return cat;
        });
    }

    function opcionesSelect(lista) {
        return ['<option value=""></option>'].concat(
            (lista || []).map(v => `<option value="${String(v).replace(/"/g, '&quot;')}">${v}</option>`)
        ).join('');
    }

    function aprobarPDV(req) {
        const data = req.data || {};
        Swal.fire({ title: 'Cargando catálogos...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        cargarCatalogosPdv().then(cat => {
            Swal.fire({
                title: 'Completar y aprobar PDV',
                width: 600,
                html: `
                    <div style="text-align:left;">
                        <p class="mb-1"><strong>${data.punto_de_interes || ''}</strong> · RIF: ${data.rif || '-'}</p>
                        <p class="small text-muted mb-3">${data.direccion || ''}</p>
                        <label class="form-label small fw-bold mb-1">Jerarquía nivel 2_2 * <span class="text-muted">(genera el identificador)</span></label>
                        <select id="pdv-j22" class="form-select form-select-sm mb-2">${opcionesSelect(cat.jerarquia_nivel_2_2)}</select>
                        <label class="form-label small fw-bold mb-1">Jerarquía nivel 2</label>
                        <select id="pdv-j2" class="form-select form-select-sm mb-2">${opcionesSelect(cat.jerarquia_nivel_2)}</select>
                        <label class="form-label small fw-bold mb-1">Clasificación de canal</label>
                        <select id="pdv-canal" class="form-select form-select-sm mb-2">${opcionesSelect(cat.clasificacion_de_canal)}</select>
                        <label class="form-label small fw-bold mb-1">Nivel de alcance</label>
                        <select id="pdv-alcance" class="form-select form-select-sm mb-2">${opcionesSelect(cat.nivel_de_alcance)}</select>
                        <label class="form-label small fw-bold mb-1">Departamento</label>
                        <select id="pdv-depto" class="form-select form-select-sm mb-2">${opcionesSelect(cat.departamento)}</select>
                        <label class="form-label small fw-bold mb-1">Ciudad</label>
                        <select id="pdv-ciudad" class="form-select form-select-sm mb-2">${opcionesSelect(cat.ciudad)}</select>
                        <label class="form-label small fw-bold mb-1">Localidad</label>
                        <select id="pdv-localidad" class="form-select form-select-sm mb-2">${opcionesSelect(cat.localidad)}</select>
                        <div class="row g-2">
                            <div class="col-4"><label class="form-label small fw-bold mb-1">Radio (m)</label>
                                <input id="pdv-radio" type="number" class="form-control form-control-sm" value="100"></div>
                            <div class="col-4"><label class="form-label small fw-bold mb-1">Latitud *</label>
                                <input id="pdv-lat" type="number" step="any" class="form-control form-control-sm" value="${data.latitud != null ? data.latitud : ''}"></div>
                            <div class="col-4"><label class="form-label small fw-bold mb-1">Longitud *</label>
                                <input id="pdv-lon" type="number" step="any" class="form-control form-control-sm" value="${data.longitud != null ? data.longitud : ''}"></div>
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'Aprobar y crear PDV',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745',
                preConfirm: () => {
                    const j22 = document.getElementById('pdv-j22').value;
                    const lat = document.getElementById('pdv-lat').value;
                    const lon = document.getElementById('pdv-lon').value;
                    if (!j22) { Swal.showValidationMessage('La jerarquía nivel 2_2 es obligatoria'); return false; }
                    if (!lat || !lon) { Swal.showValidationMessage('Latitud y longitud son obligatorias'); return false; }
                    return {
                        jerarquia_nivel_2_2: j22,
                        jerarquia_nivel_2: document.getElementById('pdv-j2').value || null,
                        clasificacion_de_canal: document.getElementById('pdv-canal').value || null,
                        nivel_de_alcance: document.getElementById('pdv-alcance').value || null,
                        departamento: document.getElementById('pdv-depto').value || null,
                        ciudad: document.getElementById('pdv-ciudad').value || null,
                        localidad: document.getElementById('pdv-localidad').value || null,
                        radio: parseInt(document.getElementById('pdv-radio').value, 10) || 100,
                        latitud: lat,
                        longitud: lon
                    };
                }
            }).then(result => {
                if (!result.isConfirmed || !result.value) return;
                Swal.fire({ title: 'Creando PDV...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                fetch(`/atencion-cliente/api/solicitudes-aprobar/${req.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.value)
                })
                    .then(r => r.json())
                    .then(d => {
                        if (d.success) {
                            Swal.fire({ icon: 'success', title: '¡PDV creado!', text: 'La solicitud fue aprobada y el PDV creado.', timer: 2200, showConfirmButton: false })
                                .then(() => cargarSolicitudes());
                        } else {
                            Swal.fire('Error', d.message || 'No se pudo crear el PDV', 'error');
                        }
                    })
                    .catch(() => Swal.fire('Error', 'Error al aprobar la solicitud', 'error'));
            });
        }).catch(() => Swal.fire('Error', 'No se pudieron cargar los catálogos', 'error'));
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