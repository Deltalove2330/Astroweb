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

    // ── Arranque ──────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', function () {
        $('btnActivarJornada').addEventListener('click', activarJornada);
        $('btnFinalizarJornada').addEventListener('click', finalizarJornada);
        $('btnVerVisitas').addEventListener('click', verVisitas);
        $('btnVolverPDVs').addEventListener('click', function () { showSubView('pdvs'); });
        $('buscarPDV').addEventListener('input', renderPDVs);
        $('buscarCliente').addEventListener('input', renderClientes);
        init();
    });
})();
