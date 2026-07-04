/* js/modules/vendedor.js
 * Flujo del Vendedor:
 *   Activación de Ruta (jornada) → PDVs → Clientes → ¿vendió? → monto / razón.
 */
(function () {
    'use strict';

    // ── Estado ────────────────────────────────────────────────
    var jornada = null;          // { id_jornada, fecha_inicio, visitas }
    var pdvs = [];
    var clientes = [];
    var clientesCargados = false;
    var pdvSeleccionado = null;

    // ── Utilidades ────────────────────────────────────────────
    function $(id) { return document.getElementById(id); }

    function escapeHtml(s) {
        if (s == null) return '';
        return String(s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function fmtHora(iso) {
        if (!iso) return '';
        try {
            var d = new Date(iso);
            return d.toLocaleString('es-VE', {
                day: '2-digit', month: '2-digit',
                hour: '2-digit', minute: '2-digit'
            });
        } catch (e) { return iso; }
    }

    function showView(name) {
        ['view-loading', 'view-jornada-inactiva', 'view-jornada-activa'].forEach(function (v) {
            var el = $(v);
            if (el) el.classList.toggle('d-none', v !== 'view-' + name);
        });
    }

    function showSubView(name) {
        $('view-pdvs').classList.toggle('d-none', name !== 'pdvs');
        $('view-clientes').classList.toggle('d-none', name !== 'clientes');
    }

    function actualizarBadge(n) {
        if (jornada) jornada.visitas = n;
        $('badgeVisitas').textContent = n != null ? n : 0;
    }

    // ── Jornada ───────────────────────────────────────────────
    function init() {
        showView('loading');
        fetch('/vendedor/api/jornada-activa', { credentials: 'include' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success && data.activa) {
                    jornada = {
                        id_jornada: data.id_jornada,
                        fecha_inicio: data.fecha_inicio,
                        visitas: data.visitas || 0
                    };
                    entrarJornadaActiva();
                } else {
                    showView('jornada-inactiva');
                }
            })
            .catch(function () {
                showView('jornada-inactiva');
            });
    }

    function entrarJornadaActiva() {
        showView('jornada-activa');
        showSubView('pdvs');
        $('jornadaInicioTxt').textContent = 'Iniciada: ' + fmtHora(jornada.fecha_inicio);
        actualizarBadge(jornada.visitas);
        cargarPDVs();
    }

    function activarJornada() {
        Swal.fire({ title: 'Activando ruta...', allowOutsideClick: false, didOpen: function () { Swal.showLoading(); } });
        fetch('/vendedor/api/activar-jornada', { method: 'POST', credentials: 'include' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                Swal.close();
                if (data.success) {
                    jornada = { id_jornada: data.id_jornada, fecha_inicio: data.fecha_inicio, visitas: 0 };
                    Swal.fire({
                        icon: 'success', title: '¡Ruta activada!',
                        text: 'Ya puedes registrar tus visitas.',
                        timer: 1400, showConfirmButton: false
                    });
                    entrarJornadaActiva();
                } else {
                    Swal.fire('Error', data.message || 'No se pudo activar la ruta', 'error');
                }
            })
            .catch(function () {
                Swal.close();
                Swal.fire('Error', 'Error de conexión al activar la ruta', 'error');
            });
    }

    function finalizarJornada() {
        Swal.fire({
            title: '¿Finalizar jornada?',
            text: 'Se cerrará tu ruta de hoy. Podrás activar una nueva cuando quieras.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, finalizar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc2626'
        }).then(function (r) {
            if (!r.isConfirmed) return;
            Swal.fire({ title: 'Finalizando...', allowOutsideClick: false, didOpen: function () { Swal.showLoading(); } });
            fetch('/vendedor/api/finalizar-jornada', { method: 'POST', credentials: 'include' })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                    Swal.close();
                    if (data.success) {
                        jornada = null;
                        pdvSeleccionado = null;
                        Swal.fire({
                            icon: 'success', title: 'Jornada finalizada',
                            timer: 1400, showConfirmButton: false
                        });
                        showView('jornada-inactiva');
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo finalizar', 'error');
                    }
                })
                .catch(function () {
                    Swal.close();
                    Swal.fire('Error', 'Error de conexión al finalizar la jornada', 'error');
                });
        });
    }

    // ── PDVs ──────────────────────────────────────────────────
    function cargarPDVs() {
        var cont = $('listaPDVs');
        cont.innerHTML = '<div class="vd-spinner"><div class="spinner-border text-primary"></div></div>';
        fetch('/vendedor/api/pdvs', { credentials: 'include' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                pdvs = Array.isArray(data) ? data : [];
                renderPDVs();
            })
            .catch(function () {
                cont.innerHTML = '<div class="vd-empty">Error al cargar los PDV</div>';
            });
    }

    function renderPDVs() {
        var filtro = ($('buscarPDV').value || '').toLowerCase().trim();
        var cont = $('listaPDVs');
        var lista = pdvs.filter(function (p) {
            if (!filtro) return true;
            return (p.nombre && p.nombre.toLowerCase().indexOf(filtro) !== -1) ||
                   (p.identificador && p.identificador.toLowerCase().indexOf(filtro) !== -1) ||
                   (p.ciudad && p.ciudad.toLowerCase().indexOf(filtro) !== -1) ||
                   (p.localidad && p.localidad.toLowerCase().indexOf(filtro) !== -1) ||
                   (p.direccion && p.direccion.toLowerCase().indexOf(filtro) !== -1);
        });

        if (lista.length === 0) {
            cont.innerHTML = '<div class="vd-empty">No se encontraron puntos de venta</div>';
            return;
        }

        cont.innerHTML = lista.map(function (p, i) {
            var sub = [p.ciudad, p.localidad].filter(Boolean).join(' · ') || (p.direccion || '');
            return '<div class="vd-item" data-idx="' + pdvs.indexOf(p) + '">' +
                '<i class="bi bi-shop vd-item-icon"></i>' +
                '<div class="vd-item-body">' +
                '<div class="vd-item-title">' + escapeHtml(p.nombre || p.identificador) + '</div>' +
                '<div class="vd-item-sub">' + escapeHtml(sub) + '</div>' +
                '</div>' +
                '<i class="bi bi-chevron-right"></i>' +
                '</div>';
        }).join('');

        Array.prototype.forEach.call(cont.querySelectorAll('.vd-item'), function (el) {
            el.addEventListener('click', function () {
                seleccionarPDV(pdvs[parseInt(el.getAttribute('data-idx'), 10)]);
            });
        });
    }

    function seleccionarPDV(pdv) {
        if (!pdv) return;
        pdvSeleccionado = pdv;
        $('pdvSeleccionadoTxt').textContent = pdv.nombre || pdv.identificador;
        $('buscarCliente').value = '';
        showSubView('clientes');
        cargarClientes();
    }

    // ── Clientes ──────────────────────────────────────────────
    function cargarClientes() {
        if (clientesCargados) {
            renderClientes();
            return;
        }
        var cont = $('listaClientes');
        cont.innerHTML = '<div class="vd-spinner"><div class="spinner-border text-primary"></div></div>';
        fetch('/vendedor/api/clientes', { credentials: 'include' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                clientes = Array.isArray(data) ? data : [];
                clientesCargados = true;
                renderClientes();
            })
            .catch(function () {
                cont.innerHTML = '<div class="vd-empty">Error al cargar los clientes</div>';
            });
    }

    function renderClientes() {
        var filtro = ($('buscarCliente').value || '').toLowerCase().trim();
        var cont = $('listaClientes');
        var lista = clientes.filter(function (c) {
            if (!filtro) return true;
            return c.nombre && c.nombre.toLowerCase().indexOf(filtro) !== -1;
        });

        if (lista.length === 0) {
            cont.innerHTML = '<div class="vd-empty">No se encontraron clientes</div>';
            return;
        }

        cont.innerHTML = lista.map(function (c) {
            return '<div class="vd-item" data-idx="' + clientes.indexOf(c) + '">' +
                '<i class="bi bi-person-circle vd-item-icon"></i>' +
                '<div class="vd-item-body">' +
                '<div class="vd-item-title">' + escapeHtml(c.nombre) + '</div>' +
                '</div>' +
                '<i class="bi bi-chevron-right"></i>' +
                '</div>';
        }).join('');

        Array.prototype.forEach.call(cont.querySelectorAll('.vd-item'), function (el) {
            el.addEventListener('click', function () {
                registrarVenta(clientes[parseInt(el.getAttribute('data-idx'), 10)]);
            });
        });
    }

    // ── Registro de venta / no venta ──────────────────────────
    function registrarVenta(cliente) {
        if (!cliente || !pdvSeleccionado) return;

        Swal.fire({
            title: escapeHtml(cliente.nombre),
            text: '¿Vendiste en este cliente?',
            icon: 'question',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: '<i class="bi bi-check-lg"></i> Sí, vendí',
            denyButtonText: '<i class="bi bi-x-lg"></i> No vendí',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#16a34a',
            denyButtonColor: '#dc2626'
        }).then(function (r1) {
            if (r1.isConfirmed) {
                // Vendió → pedir monto
                return Swal.fire({
                    title: 'Monto de la venta',
                    input: 'number',
                    inputLabel: 'Monto vendido a ' + cliente.nombre,
                    inputPlaceholder: '0.00',
                    inputAttributes: { min: '0', step: '0.01', inputmode: 'decimal' },
                    showCancelButton: true,
                    confirmButtonText: 'Registrar venta',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#16a34a',
                    inputValidator: function (value) {
                        if (!value || parseFloat(value) <= 0) {
                            return 'Ingresa un monto válido mayor que cero';
                        }
                    }
                }).then(function (r2) {
                    if (!r2.isConfirmed) return;
                    enviarVisita({
                        id_punto_interes: pdvSeleccionado.identificador,
                        id_cliente: cliente.id_cliente,
                        vendio: true,
                        monto: parseFloat(r2.value)
                    });
                });
            } else if (r1.isDenied) {
                // No vendió → pedir razón
                return Swal.fire({
                    title: 'Motivo de la no venta',
                    input: 'textarea',
                    inputLabel: '¿Por qué no se vendió a ' + cliente.nombre + '?',
                    inputPlaceholder: 'Escribe la razón...',
                    inputAttributes: { 'aria-label': 'Razón de la no venta' },
                    showCancelButton: true,
                    confirmButtonText: 'Registrar',
                    cancelButtonText: 'Cancelar',
                    inputValidator: function (value) {
                        if (!value || !value.trim()) {
                            return 'La razón de la no venta es obligatoria';
                        }
                    }
                }).then(function (r2) {
                    if (!r2.isConfirmed) return;
                    enviarVisita({
                        id_punto_interes: pdvSeleccionado.identificador,
                        id_cliente: cliente.id_cliente,
                        vendio: false,
                        razon_no_venta: r2.value.trim()
                    });
                });
            }
            // Cancelado → no hacer nada
        });
    }

    function enviarVisita(payload) {
        Swal.fire({ title: 'Registrando...', allowOutsideClick: false, didOpen: function () { Swal.showLoading(); } });
        fetch('/vendedor/api/registrar-visita', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
        })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                if (data.success) {
                    if (typeof data.visitas === 'number') actualizarBadge(data.visitas);
                    Swal.fire({
                        icon: 'success',
                        title: payload.vendio ? '¡Venta registrada!' : 'No venta registrada',
                        timer: 1500, showConfirmButton: false
                    });
                } else {
                    Swal.fire('Error', data.message || 'No se pudo registrar la visita', 'error');
                }
            })
            .catch(function () {
                Swal.fire('Error', 'Error de conexión al registrar la visita', 'error');
            });
    }

    // ── Ver visitas de la jornada ─────────────────────────────
    function verVisitas() {
        Swal.fire({ title: 'Cargando...', allowOutsideClick: false, didOpen: function () { Swal.showLoading(); } });
        fetch('/vendedor/api/visitas-hoy', { credentials: 'include' })
            .then(function (r) { return r.json(); })
            .then(function (data) {
                Swal.close();
                var visitas = (data && data.visitas) || [];
                if (visitas.length === 0) {
                    Swal.fire({ icon: 'info', title: 'Sin visitas', text: 'Aún no has registrado visitas en esta jornada.' });
                    return;
                }
                var html = '<div style="text-align:left;max-height:60vh;overflow-y:auto;">';
                visitas.forEach(function (v) {
                    var color = v.vendio ? '#16a34a' : '#dc2626';
                    var detalle = v.vendio
                        ? ('Vendió: <strong>' + (v.monto != null ? v.monto.toFixed(2) : '-') + '</strong>')
                        : ('No vendió: ' + escapeHtml(v.razon_no_venta || ''));
                    html += '<div style="border-left:4px solid ' + color + ';padding:6px 10px;margin-bottom:8px;background:#f8fafc;border-radius:6px;">' +
                        '<div style="font-weight:600;font-size:.9rem;">' + escapeHtml(v.cliente || 'Cliente') + '</div>' +
                        '<div style="font-size:.8rem;color:#64748b;">' + escapeHtml(v.pdv || '') + ' · ' + fmtHora(v.fecha_hora) + '</div>' +
                        '<div style="font-size:.85rem;">' + detalle + '</div>' +
                        '</div>';
                });
                html += '</div>';
                Swal.fire({ title: 'Visitas de la jornada (' + visitas.length + ')', html: html, confirmButtonText: 'Cerrar' });
            })
            .catch(function () {
                Swal.close();
                Swal.fire('Error', 'No se pudieron cargar las visitas', 'error');
            });
    }

    // ── Solicitar creación de PDV (registro de cliente único) ──
    // Comprime una imagen a data URL base64 para no enviar archivos enormes.
    function fileToCompressedDataURL(file, maxDim, quality) {
        return new Promise(function (resolve, reject) {
            if (!file) { resolve(null); return; }
            var reader = new FileReader();
            reader.onload = function (e) {
                var img = new Image();
                img.onload = function () {
                    var w = img.width, h = img.height;
                    if (w > h && w > maxDim) { h = Math.round(h * maxDim / w); w = maxDim; }
                    else if (h >= w && h > maxDim) { w = Math.round(w * maxDim / h); h = maxDim; }
                    var canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', quality));
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function obtenerGPS() {
        return new Promise(function (resolve) {
            if (!navigator.geolocation) { resolve({ latitud: null, longitud: null }); return; }
            navigator.geolocation.getCurrentPosition(
                function (pos) { resolve({ latitud: pos.coords.latitude, longitud: pos.coords.longitude }); },
                function () { resolve({ latitud: null, longitud: null }); },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        });
    }

    function solicitarPDV() {
        var gps = { latitud: null, longitud: null };
        Swal.fire({
            title: 'Solicitar nuevo PDV',
            html:
                '<div style="text-align:left;">' +
                '<label class="form-label small fw-bold mb-1">Nombre del PDV *</label>' +
                '<input id="spdv-nombre" class="form-control form-control-sm mb-2" placeholder="Nombre de la tienda">' +
                '<label class="form-label small fw-bold mb-1">RIF *</label>' +
                '<input id="spdv-rif" class="form-control form-control-sm mb-2" placeholder="J-12345678-9">' +
                '<label class="form-label small fw-bold mb-1">Dirección *</label>' +
                '<textarea id="spdv-direccion" class="form-control form-control-sm mb-2" rows="2" placeholder="Dirección completa"></textarea>' +
                '<label class="form-label small fw-bold mb-1">Foto de la tienda *</label>' +
                '<input type="file" id="spdv-foto-tienda" accept="image/*" capture="environment" class="form-control form-control-sm mb-2">' +
                '<label class="form-label small fw-bold mb-1">Foto del RIF *</label>' +
                '<input type="file" id="spdv-foto-rif" accept="image/*" capture="environment" class="form-control form-control-sm mb-2">' +
                '<div id="spdv-gps" class="small text-muted"><i class="bi bi-geo-alt"></i> Obteniendo ubicación...</div>' +
                '</div>',
            width: 480,
            showCancelButton: true,
            confirmButtonText: 'Enviar solicitud',
            cancelButtonText: 'Cancelar',
            didOpen: function () {
                obtenerGPS().then(function (g) {
                    gps = g;
                    var el = document.getElementById('spdv-gps');
                    if (el) el.innerHTML = (g.latitud != null)
                        ? '<i class="bi bi-geo-alt-fill text-success"></i> Ubicación capturada'
                        : '<i class="bi bi-geo-alt"></i> Sin ubicación (ATC podrá ajustarla)';
                });
            },
            preConfirm: function () {
                var nombre = (document.getElementById('spdv-nombre').value || '').trim();
                var rif = (document.getElementById('spdv-rif').value || '').trim();
                var direccion = (document.getElementById('spdv-direccion').value || '').trim();
                var ftFile = document.getElementById('spdv-foto-tienda').files[0];
                var frFile = document.getElementById('spdv-foto-rif').files[0];
                if (!nombre || !rif || !direccion || !ftFile || !frFile) {
                    Swal.showValidationMessage('Completa nombre, RIF, dirección y ambas fotos');
                    return false;
                }
                Swal.showLoading();
                return Promise.all([
                    fileToCompressedDataURL(ftFile, 1000, 0.6),
                    fileToCompressedDataURL(frFile, 1000, 0.6)
                ]).then(function (fotos) {
                    return {
                        punto_de_interes: nombre, rif: rif, direccion: direccion,
                        latitud: gps.latitud, longitud: gps.longitud,
                        foto_tienda: fotos[0], foto_rif: fotos[1]
                    };
                }).catch(function () {
                    Swal.showValidationMessage('No se pudieron procesar las fotos');
                    return false;
                });
            }
        }).then(function (result) {
            if (!result.isConfirmed || !result.value) return;
            Swal.fire({ title: 'Enviando...', allowOutsideClick: false, didOpen: function () { Swal.showLoading(); } });
            fetch('/vendedor/api/solicitar-pdv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(result.value)
            })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    if (data.success) {
                        Swal.fire({ icon: 'success', title: 'Solicitud enviada', text: data.message, timer: 2800, showConfirmButton: false });
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo enviar la solicitud', 'error');
                    }
                })
                .catch(function () { Swal.fire('Error', 'Error de conexión al enviar la solicitud', 'error'); });
        });
    }

    // ── Arranque ──────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        $('btnActivarJornada').addEventListener('click', activarJornada);
        $('btnFinalizarJornada').addEventListener('click', finalizarJornada);
        $('btnVerVisitas').addEventListener('click', verVisitas);
        $('btnVolverPDVs').addEventListener('click', function () { showSubView('pdvs'); });
        $('buscarPDV').addEventListener('input', renderPDVs);
        $('buscarCliente').addEventListener('input', renderClientes);
        var btnSolicitar = $('btnSolicitarPDV');
        if (btnSolicitar) btnSolicitar.addEventListener('click', solicitarPDV);
        init();
    });
})();
