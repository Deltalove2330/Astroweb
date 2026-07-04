// /static/js/modules/carga-mercaderista.js //
// Visual de carga de data: TABLA PRECARGADA con todos los productos del cliente.
// Cada fila tiene un estado (Normal / Quiebre / No existe) que se persiste en
// BALANCES_TOTALES.estado_producto, resolviendo la ambigüedad del producto vacío:
//   · normal    → hay stock / se relevó con cantidades
//   · quiebre   → el producto DEBERÍA estar en el PDV pero está agotado
//   · no_existe → el producto NO se maneja en este PDV
// Las filas que quedan en 'normal' SIN datos se consideran no relevadas y no se envían.

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-VE', {
        timeZone: 'America/Caracas',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Función para cargar las visitas del mercaderista
function loadMerchandiserVisits(cedula) {
    $.getJSON(`/api/merchandiser-pending-visits/${cedula}`)
        .done(function(visits) {
            renderVisitsCards(visits);
        })
        .fail(function() {
            $('#visitasContainer').html(`
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle"></i>
                    Error al cargar las visitas pendientes
                </div>
            `);
        });
}

// Función para renderizar las tarjetas de visitas
function renderVisitsCards(visits) {
    if (!visits || visits.length === 0) {
        $('#visitasContainer').html(`
            <div class="alert alert-info text-center">
                <i class="bi bi-calendar-check fs-1"></i>
                <p class="mt-3 mb-0">No tienes visitas pendientes por cargar</p>
            </div>
        `);
        return;
    }

    let html = '<div class="row">';
    visits.forEach((visit) => {
        const safe = (s) => String(s || '').replace(/'/g, "\\'");
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0"><i class="bi bi-calendar-event me-2"></i>Visita #${visit.id}</h6>
                    </div>
                    <div class="card-body">
                        <p class="mb-2"><strong><i class="bi bi-building me-1"></i>Cliente:</strong><br>${visit.cliente}</p>
                        <p class="mb-2"><strong><i class="bi bi-geo-alt me-1"></i>Punto:</strong><br>${visit.punto_interes}</p>
                        <p class="mb-2"><strong><i class="bi bi-person-badge me-1"></i>Mercaderista:</strong><br>${visit.mercaderista}</p>
                        <p class="mb-2"><strong><i class="bi bi-calendar-date me-1"></i>Fecha:</strong><br>${formatDate(visit.fecha)}</p>
                        <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-success" onclick="cargarVisita(${visit.id}, '${safe(visit.punto_interes)}', '${safe(visit.cliente)}', '${safe(visit.mercaderista)}', '${safe(visit.fecha)}')">
                                <i class="bi bi-upload me-2"></i>Cargar Datos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    $('#visitasContainer').html(html);
}

// ── Tabla precargada ────────────────────────────────────────────────────────
function escapeHtml(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function renderTablaProductos(productos) {
    const $body = $('#cargaProductosBody');
    $body.empty();

    if (!Array.isArray(productos) || productos.length === 0) {
        $body.html('<tr><td colspan="8" class="text-center text-muted py-4">Este cliente no tiene productos cargados.</td></tr>');
        actualizarContador();
        return;
    }

    // Agrupar por categoría preservando el orden (la API ya ordena por Categoria).
    // Primero se muestran SOLO las categorías (colapsadas); al hacer clic en una
    // se despliegan los productos de esa categoría para hacer el llenado.
    const grupos = [];
    const indexByCat = {};
    productos.forEach((p) => {
        const cat = p.categoria || 'Sin categoría';
        if (!(cat in indexByCat)) { indexByCat[cat] = grupos.length; grupos.push({ cat, items: [] }); }
        grupos[indexByCat[cat]].items.push(p);
    });

    let html = '';
    let idx = 0;
    grupos.forEach((g, gi) => {
        html += `
            <tr class="table-secondary cat-header" data-group="${gi}" style="cursor:pointer;">
                <td colspan="8" class="fw-bold">
                    <i class="bi bi-chevron-right cat-chevron me-1"></i>
                    <i class="bi bi-tag me-1"></i>${escapeHtml(g.cat)}
                    <span class="badge bg-light text-dark border ms-2">${g.items.length} producto${g.items.length === 1 ? '' : 's'}</span>
                    <span class="badge bg-success ms-1 cat-relevados">0</span>
                </td>
            </tr>`;
        g.items.forEach((p) => {
            const cat = g.cat;
            html += `
            <tr class="carga-row" data-group="${gi}" data-id="${p.id}" data-sku="${escapeHtml(p.sku)}"
                data-fabricante="${escapeHtml(p.fabricante || '')}" data-cat="${escapeHtml(cat)}" style="display:none;">
                <td>
                    <div class="fw-semibold">${escapeHtml(p.sku)}</div>
                    <small class="text-muted">${escapeHtml(p.fabricante || '')}</small>
                </td>
                <td>
                    <div class="btn-group btn-group-sm estado-group w-100" role="group">
                        <input type="radio" class="btn-check estado-radio" name="estado-${idx}" id="est-n-${idx}" value="normal" autocomplete="off" checked>
                        <label class="btn btn-outline-success" for="est-n-${idx}">Normal</label>
                        <input type="radio" class="btn-check estado-radio" name="estado-${idx}" id="est-q-${idx}" value="quiebre" autocomplete="off">
                        <label class="btn btn-outline-warning" for="est-q-${idx}">Quiebre</label>
                        <input type="radio" class="btn-check estado-radio" name="estado-${idx}" id="est-x-${idx}" value="no_existe" autocomplete="off">
                        <label class="btn btn-outline-secondary" for="est-x-${idx}">No existe</label>
                    </div>
                </td>
                <td><input type="number" class="form-control form-control-sm inventario-inicial" min="0"></td>
                <td><input type="number" class="form-control form-control-sm inventario-final" min="0"></td>
                <td><input type="number" class="form-control form-control-sm inventario-deposito" min="0"></td>
                <td><input type="number" class="form-control form-control-sm caras-input" min="0"></td>
                <td><input type="text" class="form-control form-control-sm precio-bs decimal-input" data-max="35500" data-moneda="Bs" placeholder="0,00"></td>
                <td><input type="text" class="form-control form-control-sm precio-usd decimal-input" data-max="100" data-moneda="USD" placeholder="0,00"></td>
            </tr>
        `;
            idx++;
        });
    });
    $body.html(html);
    actualizarContador();
}

// Habilitar/limpiar inputs de cantidad según el estado de la fila
function aplicarEstadoFila($row) {
    const estado = $row.find('.estado-radio:checked').val() || 'normal';
    const $inputs = $row.find('.inventario-inicial, .inventario-final, .inventario-deposito, .caras-input, .precio-bs, .precio-usd');
    if (estado === 'normal') {
        $inputs.prop('disabled', false);
    } else {
        // Quiebre / No existe → no aplica cantidad, se limpia y deshabilita
        $inputs.val('').prop('disabled', true).removeClass('is-invalid');
    }
}

function filaTieneDatos($row) {
    let hasData = false;
    $row.find('.inventario-inicial, .inventario-final, .inventario-deposito, .caras-input, .precio-bs, .precio-usd')
        .each(function () { if ($(this).val() !== '' && $(this).val() != null) hasData = true; });
    return hasData;
}

// Una fila "cuenta" como relevada si está marcada quiebre/no_existe, o normal con datos
function filaRelevada($row) {
    const estado = $row.find('.estado-radio:checked').val() || 'normal';
    if (estado !== 'normal') return true;
    return filaTieneDatos($row);
}

function actualizarContador() {
    let n = 0;
    $('.carga-row').each(function () { if (filaRelevada($(this))) n++; });
    $('#contadorRelevados').text(n + (n === 1 ? ' relevado' : ' relevados'));
    actualizarContadoresCategoria();
}

// Cuenta de productos relevados por categoría (badge en cada cabecera)
function actualizarContadoresCategoria() {
    $('#cargaProductosBody .cat-header').each(function () {
        const gi = $(this).data('group');
        let n = 0;
        $(`#cargaProductosBody .carga-row[data-group="${gi}"]`).each(function () {
            if (filaRelevada($(this))) n++;
        });
        $(this).find('.cat-relevados').text(n);
    });
}

// Expandir / colapsar una categoría al hacer clic en su cabecera
function toggleCategoria($header, forzarExpandir) {
    const gi = $header.data('group');
    const expandir = (forzarExpandir !== undefined) ? forzarExpandir : !$header.hasClass('expanded');
    $header.toggleClass('expanded', expandir);
    $header.find('.cat-chevron')
        .toggleClass('bi-chevron-down', expandir)
        .toggleClass('bi-chevron-right', !expandir);

    const q = ($('#filtroProductoCarga').val() || '').toLowerCase();
    $(`#cargaProductosBody .carga-row[data-group="${gi}"]`).each(function () {
        if (!expandir) { $(this).hide(); return; }
        const sku = ($(this).data('sku') || '').toString().toLowerCase();
        const fab = ($(this).data('fabricante') || '').toString().toLowerCase();
        $(this).toggle(!q || sku.includes(q) || fab.includes(q));
    });
}

// Filtro por texto: con búsqueda se expanden las categorías que tienen
// coincidencias y se ocultan las demás; sin búsqueda todas vuelven a quedar
// colapsadas (solo se ven las categorías).
function filtrarTablaCarga() {
    const q = ($('#filtroProductoCarga').val() || '').toLowerCase();
    $('#cargaProductosBody .cat-header').each(function () {
        const $header = $(this);
        const gi = $header.data('group');
        const $rows = $(`#cargaProductosBody .carga-row[data-group="${gi}"]`);
        let anyMatch = false;

        $rows.each(function () {
            const sku = ($(this).data('sku') || '').toString().toLowerCase();
            const fab = ($(this).data('fabricante') || '').toString().toLowerCase();
            const match = !q || sku.includes(q) || fab.includes(q);
            if (match) anyMatch = true;
            if (q) $(this).toggle(match);
        });

        if (q) {
            $header.toggle(anyMatch);
            toggleCategoria($header, anyMatch);
        } else {
            $header.show();
            toggleCategoria($header, false);
        }
    });
}

// Función para abrir el modal con datos
async function cargarVisita(visitId, puntoNombre, clienteNombre, mercaderistaNombre, fecha) {
    try {
        const fechaCarga = new Date().toISOString();
        sessionStorage.setItem(`fechaCarga_${visitId}`, fechaCarga);

        $('#modalVisitId').text(`#${visitId}`);
        $('#modalCliente').text(clienteNombre);
        $('#modalPunto').text(puntoNombre);
        $('#modalMercaderista').text(mercaderistaNombre);
        $('#modalFecha').text(formatDate(fecha));

        $('#visitId').val(visitId);
        $('#clienteNombre').val(clienteNombre);
        $('#puntoInteresNombre').val(puntoNombre);
        $('#fechaVisita').val(formatDate(fecha));
        const mercaderista = sessionStorage.getItem('merchandiser_name') || mercaderistaNombre;
        $('#mercaderistaNombre').val(mercaderista);

        $('#filtroProductoCarga').val('');
        $('#cargaProductosBody').html('<tr><td colspan="8" class="text-center text-muted py-4"><span class="spinner-border spinner-border-sm me-2"></span>Cargando productos...</td></tr>');
        $('#cargaModal').modal('show');

        // Cliente de esta visita → productos precargados
        const response = await fetch(`/api/client-from-visit/${visitId}`);
        const clienteData = await response.json();

        if (clienteData && clienteData.id) {
            const prodResp = await fetch(`/api/client-products/${clienteData.id}`);
            const productos = await prodResp.json();
            if (Array.isArray(productos)) {
                renderTablaProductos(productos);
            } else {
                $('#cargaProductosBody').html('<tr><td colspan="8" class="text-center text-danger py-4">No se pudieron cargar los productos.</td></tr>');
            }
        } else {
            $('#cargaProductosBody').html('<tr><td colspan="8" class="text-center text-danger py-4">No se pudo identificar el cliente de la visita.</td></tr>');
        }
    } catch (error) {
        console.error("Error en cargarVisita:", error);
        $('#cargaProductosBody').html('<tr><td colspan="8" class="text-center text-danger py-4">Error al cargar la visita.</td></tr>');
    }
}

function showError(message) {
    $('#visitasContainer').html(`
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i> ${message}
            <button class="btn btn-sm btn-outline-secondary mt-2" onclick="location.reload()">
                <i class="bi bi-arrow-repeat"></i> Recargar
            </button>
        </div>
    `);
}

// ── Submit ──────────────────────────────────────────────────────────────────
$(document).on('submit', '#formCargaDatos', async function (e) {
    e.preventDefault();

    if (!validateAllPrices()) {
        Swal.fire({ icon: 'error', title: 'Error en precios', text: 'Algunos precios superan los límites permitidos. Corrígelos.', confirmButtonColor: '#3085d6' });
        return;
    }

    const visitId = $('#visitId').val();
    const fechaFinalCarga = new Date().toISOString();
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    const fechaCarga = sessionStorage.getItem(`fechaCarga_${visitId}`);
    const productos = [];

    $('.carga-row').each(function () {
        const $r = $(this);
        if (!filaRelevada($r)) return; // fila no relevada → no se envía

        const estado = $r.find('.estado-radio:checked').val() || 'normal';
        const precioBs = convertDecimalForBackend($r.find('.precio-bs').val());
        const precioUSD = convertDecimalForBackend($r.find('.precio-usd').val());

        productos.push({
            id: $r.data('id'),
            sku: $r.data('sku'),
            fabricante: $r.data('fabricante'),
            estado: estado,
            inventarioInicial: $r.find('.inventario-inicial').val() || 0,
            inventarioFinal: $r.find('.inventario-final').val() || 0,
            inventarioDeposito: $r.find('.inventario-deposito').val() || 0,
            caras: $r.find('.caras-input').val() || 0,
            precioBs: precioBs,
            precioUSD: precioUSD
        });
    });

    if (productos.length === 0) {
        Swal.fire({ icon: 'warning', title: 'Sin productos', text: 'Releva al menos un producto (ingresa datos o marca Quiebre / No existe).', confirmButtonColor: '#3085d6' });
        return;
    }

    const submitBtn = $(this).find('button[type="submit"]');
    const originalText = submitBtn.html();
    submitBtn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Guardando...');

    const payload = { visitId, productos, fechaIngreso, fechaCarga, fechaFinalCarga };
    const onSuccess = function (nProd) {
        Swal.fire({ icon: 'success', title: '¡Éxito!', text: `Datos guardados (${nProd} productos)`, confirmButtonColor: '#3085d6', timer: 2000, timerProgressBar: true });
        $(`[onclick*="cargarVisita(${visitId},"]`).closest('.col-md-6, .col-lg-4').fadeOut(300, function () {
            $(this).remove();
            const cedula = sessionStorage.getItem('merchandiser_cedula');
            if ($('.col-md-6, .col-lg-4').length === 0) loadMerchandiserVisits(cedula);
        });
        $('#cargaModal').modal('hide');
    };

    // Envío resiliente al túnel intermitente: reintentos con backoff + timeout.
    let guardado = false;
    for (let intento = 1; intento <= 3 && !guardado; intento++) {
        try {
            const ctrl = new AbortController();
            const to = setTimeout(() => ctrl.abort(), 45000);
            const response = await fetch('/api/cargar-datos-visita', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload), signal: ctrl.signal
            });
            clearTimeout(to);
            const result = await response.json();
            if (result.success) {
                guardado = true;
                submitBtn.prop('disabled', false).html(originalText);
                onSuccess(productos.length);
            } else {
                // Error real del backend (no de conexión) → no reintentar.
                submitBtn.prop('disabled', false).html(originalText);
                Swal.fire({ icon: 'error', title: 'Error', text: 'Error al guardar: ' + (result.message || 'Error desconocido'), confirmButtonColor: '#3085d6' });
                return;
            }
        } catch (error) {
            console.warn(`[Carga] intento ${intento} falló:`, error && error.message);
            if (intento < 3) await new Promise(r => setTimeout(r, 1500 * intento));
        }
    }

    // Si tras los reintentos no se pudo enviar → guardar offline y sincronizar luego.
    if (!guardado) {
        submitBtn.prop('disabled', false).html(originalText);
        guardarCargaPendiente(payload);
        $('#cargaModal').modal('hide');
        $(`[onclick*="cargarVisita(${visitId},"]`).closest('.col-md-6, .col-lg-4').addClass('carga-pendiente-offline');
        Swal.fire({
            icon: 'info', title: 'Guardado sin conexión',
            html: 'No se pudo enviar ahora (conexión intermitente por el túnel).<br>Los datos quedaron <b>guardados en el dispositivo</b> y se enviarán <b>automáticamente</b> al recuperar la señal.',
            confirmButtonColor: '#3085d6'
        });
    }
});

// ── Cola offline de CARGAS de datos (JSON pequeño, no consume memoria) ────────
const CARGAS_KEY = 'cargasPendientes';
function guardarCargaPendiente(payload) {
    try {
        const q = JSON.parse(localStorage.getItem(CARGAS_KEY) || '[]');
        // Evitar duplicados por visita: reemplaza la carga previa de la misma visita.
        const filtrada = q.filter(it => String(it.payload.visitId) !== String(payload.visitId));
        filtrada.push({ payload, ts: Date.now() });
        localStorage.setItem(CARGAS_KEY, JSON.stringify(filtrada));
        actualizarIndicadorCargasPendientes();
    } catch (e) { console.error('[Carga] no se pudo guardar offline:', e); }
}
let _sincronizandoCargas = false;
async function sincronizarCargasPendientes(silencioso) {
    if (_sincronizandoCargas) return;
    let q;
    try { q = JSON.parse(localStorage.getItem(CARGAS_KEY) || '[]'); } catch (e) { q = []; }
    if (!q.length) { actualizarIndicadorCargasPendientes(); return; }
    _sincronizandoCargas = true;
    const pendientes = [];
    let enviadas = 0;
    for (const item of q) {
        try {
            const ctrl = new AbortController();
            const to = setTimeout(() => ctrl.abort(), 45000);
            const r = await fetch('/api/cargar-datos-visita', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.payload), signal: ctrl.signal
            });
            clearTimeout(to);
            const j = await r.json();
            if (j.success) enviadas++;
            else pendientes.push(item); // el backend la rechazó → conservar para revisar
        } catch (e) {
            pendientes.push(item); // sigue sin conexión → conservar
        }
    }
    localStorage.setItem(CARGAS_KEY, JSON.stringify(pendientes));
    _sincronizandoCargas = false;
    actualizarIndicadorCargasPendientes();
    if (enviadas > 0) {
        if (!silencioso && typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'success', title: 'Sincronizado', text: `Se enviaron ${enviadas} carga(s) que estaban pendientes.`, timer: 2500, timerProgressBar: true, confirmButtonColor: '#3085d6' });
        }
        const cedula = sessionStorage.getItem('merchandiser_cedula');
        if (cedula && typeof loadMerchandiserVisits === 'function') loadMerchandiserVisits(cedula);
    }
}
function actualizarIndicadorCargasPendientes() {
    let n = 0;
    try { n = (JSON.parse(localStorage.getItem(CARGAS_KEY) || '[]')).length; } catch (e) {}
    let $b = $('#cargasPendientesBadge');
    if (n > 0) {
        if (!$b.length) {
            $('body').append('<div id="cargasPendientesBadge" style="position:fixed;bottom:14px;left:14px;z-index:9999;background:#f59e0b;color:#111;font-weight:700;border-radius:999px;padding:8px 14px;box-shadow:0 4px 12px rgba(0,0,0,.25);cursor:pointer;font-size:13px" onclick="sincronizarCargasPendientes(false)"></div>');
            $b = $('#cargasPendientesBadge');
        }
        $b.html('⏳ ' + n + ' carga(s) por enviar · toca para reintentar').show();
    } else if ($b.length) { $b.hide(); }
}
// Disparadores de sincronización: al reconectar, al cargar la página y cada 60s.
window.addEventListener('online', function () { sincronizarCargasPendientes(true); });
document.addEventListener('DOMContentLoaded', function () {
    actualizarIndicadorCargasPendientes();
    setTimeout(function () { sincronizarCargasPendientes(true); }, 3000);
    setInterval(function () { if (navigator.onLine) sincronizarCargasPendientes(true); }, 60000);
});

// ── Eventos delegados de la tabla ───────────────────────────────────────────
$(document).on('change', '.estado-radio', function () {
    aplicarEstadoFila($(this).closest('.carga-row'));
    actualizarContador();
});
$(document).on('input', '.carga-row input', function () { actualizarContador(); });
$(document).on('input', '#filtroProductoCarga', filtrarTablaCarga);
// Expandir / colapsar la categoría al hacer clic en su cabecera
$(document).on('click', '.cat-header', function () { toggleCategoria($(this)); });

// ── Inicialización ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    if (typeof checkMercaderistaSession === 'function' && !checkMercaderistaSession()) return;

    const cedula = sessionStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name');
    $('#merchandiserName').text(nombre);
    loadMerchandiserVisits(cedula);
    configurarInputsDecimales();

    $('button[type="submit"]').each(function () { $(this).data('original-text', $(this).html()); });
});

function logout() {
    if (typeof logoutMercaderista === 'function') {
        logoutMercaderista();
    } else if (confirm('¿Estás seguro de que deseas salir del sistema?')) {
        sessionStorage.clear();
        window.location.href = '/login-mercaderista';
    }
}

// ── Helpers de precios decimales (coma como separador) ──────────────────────
function formatDecimalInput(input) {
    let value = input.value;
    value = value.replace(/\./g, ',');
    const regex = /^\d*[,]?\d{0,2}$/;
    if (value !== '' && !regex.test(value)) {
        input.value = input.getAttribute('data-last-valid') || '';
        return;
    }
    input.setAttribute('data-last-valid', value);

    const max = parseFloat(input.getAttribute('data-max'));
    const numericValue = parseFloat(value.replace(',', '.'));
    const feedback = input.parentElement ? input.parentElement.querySelector('.invalid-feedback') : null;

    if (!isNaN(numericValue) && !isNaN(max) && numericValue > max) {
        input.classList.add('is-invalid');
        if (feedback) feedback.style.display = 'block';
        input.value = max.toFixed(2).replace('.', ',');
        input.setAttribute('data-last-valid', input.value);
    } else {
        input.classList.remove('is-invalid');
        if (feedback) feedback.style.display = 'none';
    }
}

function convertDecimalForBackend(value) {
    if (!value) return "0";
    return value.replace(',', '.');
}

function validateAllPrices() {
    let isValid = true;
    $('.decimal-input').each(function () {
        if (this.disabled) return;
        const value = $(this).val();
        const max = parseFloat($(this).data('max'));
        const numericValue = parseFloat((value || '').replace(',', '.'));
        if (!isNaN(numericValue) && !isNaN(max) && numericValue > max) {
            $(this).addClass('is-invalid');
            isValid = false;
        } else {
            $(this).removeClass('is-invalid');
        }
    });
    return isValid;
}

function formatDecimalOnBlur(input) {
    let value = input.value;
    if (value === '') return;
    if (value.endsWith(',')) value = value + '00';
    if (!value.includes(',')) value = value + ',00';
    const parts = value.split(',');
    if (parts.length === 2) {
        if (parts[1].length === 0) parts[1] = '00';
        else if (parts[1].length === 1) parts[1] = parts[1] + '0';
        else if (parts[1].length > 2) parts[1] = parts[1].substring(0, 2);
        value = parts[0] + ',' + parts[1];
    }
    input.value = value;
    formatDecimalInput(input);
}

function configurarInputsDecimales() {
    $(document).on('input', '.decimal-input', function (e) {
        if (e.originalEvent && (e.originalEvent.inputType === 'deleteContentBackward' || e.originalEvent.inputType === 'deleteContentForward')) return;
        formatDecimalInput(this);
    });
    $(document).on('blur', '.decimal-input', function () { formatDecimalOnBlur(this); });
    $(document).on('keydown', '.decimal-input', function (e) {
        if (e.key === '.') {
            e.preventDefault();
            const input = this, start = input.selectionStart, end = input.selectionEnd, value = input.value;
            input.value = value.substring(0, start) + ',' + value.substring(end);
            input.setSelectionRange(start + 1, start + 1);
            formatDecimalInput(input);
        }
    });
    $(document).on('keypress', '.decimal-input', function (e) {
        if (e.which === 8 || e.which === 46 || e.which === 9 || e.which === 13 || (e.which >= 37 && e.which <= 40)) return;
        const char = String.fromCharCode(e.which);
        if (!/[0-9,]/.test(char)) { e.preventDefault(); return false; }
        if (char === ',' && $(this).val().includes(',')) { e.preventDefault(); return false; }
    });
}
