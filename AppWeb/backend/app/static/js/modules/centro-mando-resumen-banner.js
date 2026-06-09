// ╔══════════════════════════════════════════════════════════════════════╗
// ║  centro-mando-resumen-banner.js                                      ║
// ║  Banner compartido "Resumen del Día" para Centro de Mando.           ║
// ║  Usado por unified-activaciones y unified-visits.                    ║
// ║                                                                      ║
// ║  API:                                                                ║
// ║    • cmrbHtmlSlot(elementId='cm-resumen-dia-slot')                  ║
// ║        → devuelve el <div> placeholder para insertar en el HTML.     ║
// ║    • cmrbInit()                                                      ║
// ║        → tras inyectar el HTML llama esto. Hace el primer fetch,     ║
// ║          ata los eventos y se auto-recupera si quedó en idle.        ║
// ║                                                                      ║
// ║  Fuente de cliente_id (prioridad):                                   ║
// ║    1) selección manual del <select> del banner                       ║
// ║    2) window.UV_CLIENTE_FILTRO (coordinador exclusivo)               ║
// ║    3) null → modo "Todos los clientes"                               ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ── Estado global del banner ─────────────────────────────────────
let cmrbData       = null;
let cmrbFecha      = '';
let cmrbEstado     = 'idle';   // idle | loading | ok | empty | error
let cmrbError      = '';
let cmrbClienteId  = null;     // null = Todos los clientes
let cmrbClientes   = null;     // cache lista de clientes
let cmrbSlotId     = 'cm-resumen-dia-slot';

const cmrbEsc = s => { if (!s) return ''; const d=document.createElement('div'); d.textContent=s; return d.innerHTML; };
const cmrbToday = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
};

// ── API pública ───────────────────────────────────────────────────
export function cmrbHtmlSlot(slotId) {
    if (slotId) cmrbSlotId = slotId;
    return _renderBanner();
}

export function cmrbInit(slotId) {
    if (slotId) cmrbSlotId = slotId;
    _bindEvents();
}

// ── Fetch principal ───────────────────────────────────────────────
function _fetch() {
    const cid = cmrbClienteId != null ? cmrbClienteId : (window.UV_CLIENTE_FILTRO || null);
    if (!cmrbFecha) cmrbFecha = cmrbToday();

    cmrbEstado = 'loading';
    cmrbError  = '';
    _redraw();

    if (!cmrbClientes) _fetchClientes();

    const url = `/api/centro-mando/resumen-dia?fecha=${cmrbFecha}` + (cid ? `&cliente_id=${cid}` : '');
    $.ajax({
        url: url, type: 'GET', dataType: 'json', timeout: 25000
    })
    .done(function(r) {
        if (!r || !r.success) {
            cmrbEstado = 'error';
            cmrbError  = (r && (r.message || r.error)) || 'Respuesta inválida del servidor';
        } else {
            cmrbData = r;
            const tieneData = (r.mercaderistas && r.mercaderistas.total_asignados > 0) ||
                              (r.rutas && r.rutas.planificadas > 0);
            cmrbEstado = tieneData ? 'ok' : 'empty';
        }
        _redraw();
    })
    .fail(function(xhr, textStatus) {
        cmrbEstado = 'error';
        cmrbError  = textStatus === 'timeout'
            ? 'La consulta tardó demasiado (timeout). La base de datos puede estar lenta.'
            : `Error ${xhr.status || 'desconocido'}: no se pudo cargar el resumen.`;
        _redraw();
    });
}

function _fetchClientes() {
    $.getJSON('/api/centro-mando/clientes').done(function(r) {
        if (r && r.success) {
            cmrbClientes = r.clientes || [];
            _redraw();
        }
    });
}

function _redraw() {
    const slot = document.getElementById(cmrbSlotId);
    if (slot) slot.outerHTML = _renderBanner();
    _bindEvents();
}

// ── Render ───────────────────────────────────────────────────────
function _header() {
    const fecha = cmrbFecha || cmrbToday();
    const titulo = (cmrbEstado === 'ok' && cmrbData)
        ? `${cmrbData.dia_semana} ${cmrbData.fecha}`
        : fecha;
    const cliente = (cmrbData && cmrbData.cliente_nombre) || (window.UV_CLIENTE_NOMBRE || '');

    let clienteSelector = '';
    if (!window.UV_CLIENTE_FILTRO) {
        const opts = (cmrbClientes || []).map(c =>
            `<option value="${c.id_cliente}" ${String(cmrbClienteId) === String(c.id_cliente) ? 'selected' : ''}>${cmrbEsc(c.cliente)}</option>`
        ).join('');
        const loadingTxt = cmrbClientes ? '' : '<option disabled>Cargando clientes…</option>';
        clienteSelector = `
            <select class="ua-rd-cli" id="cmrb-cli" title="Filtrar por cliente">
                <option value="">🏢 Todos los clientes</option>
                ${loadingTxt}
                ${opts}
            </select>`;
    }

    return `
    <div class="ua-rd-head">
        <div>
            <h4 class="ua-rd-title">
                <i class="bi bi-calendar2-check-fill"></i>
                Resumen del Día · ${titulo}
            </h4>
            <div class="ua-rd-sub">${cmrbEsc(cliente)}</div>
        </div>
        <div class="ua-rd-controls">
            ${clienteSelector}
            <button class="ua-rd-day-btn" id="cmrb-prev" title="Día anterior"><i class="bi bi-chevron-left"></i></button>
            <input type="date" class="ua-rd-date" id="cmrb-date" value="${fecha}" max="${cmrbToday()}">
            <button class="ua-rd-day-btn" id="cmrb-next" title="Día siguiente" ${fecha >= cmrbToday() ? 'disabled' : ''}><i class="bi bi-chevron-right"></i></button>
            <button class="ua-rd-day-btn ua-rd-day-today" id="cmrb-today" title="Hoy">Hoy</button>
            <button class="btn btn-sm uv-refresh-btn" id="cmrb-refresh"><i class="bi bi-arrow-clockwise"></i> Actualizar</button>
        </div>
    </div>`;
}

function _renderBanner() {
    if (cmrbEstado === 'idle') {
        return `<div id="${cmrbSlotId}" class="ua-rd-wrap">
            ${_header()}
            <div class="ua-rd-state-loading">
                <span class="ua-spinner-ring" style="width:18px;height:18px;"></span>
                <span style="margin-left:8px;">Preparando consulta...</span>
            </div>
        </div>`;
    }
    if (cmrbEstado === 'loading') {
        return `<div id="${cmrbSlotId}" class="ua-rd-wrap">
            ${_header()}
            <div class="ua-rd-state-loading">
                <span class="ua-spinner-ring" style="width:18px;height:18px;"></span>
                <span style="margin-left:8px;">Cargando resumen del día...</span>
            </div>
        </div>`;
    }
    if (cmrbEstado === 'error') {
        return `<div id="${cmrbSlotId}" class="ua-rd-wrap">
            ${_header()}
            <div class="ua-rd-state-error">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div>
                    <strong>No se pudo cargar el resumen</strong>
                    <div class="ua-rd-mini" style="margin-top:.2rem;">${cmrbEsc(cmrbError)}</div>
                </div>
                <button class="btn btn-sm uv-refresh-btn" id="cmrb-retry"><i class="bi bi-arrow-clockwise"></i> Reintentar</button>
            </div>
        </div>`;
    }
    if (cmrbEstado === 'empty') {
        return `<div id="${cmrbSlotId}" class="ua-rd-wrap">
            ${_header()}
            <div class="ua-rd-state-empty">
                <i class="bi bi-calendar-x"></i>
                <div>
                    <strong>Sin actividad ni programación para este día</strong>
                    <div class="ua-rd-mini" style="margin-top:.2rem;">
                        No hay rutas, mercaderistas ni puntos de interés planificados para ${cmrbFecha}.
                        Prueba otra fecha con el selector ↑.
                    </div>
                </div>
            </div>
        </div>`;
    }

    // OK
    const r = cmrbData;
    const m = r.mercaderistas, ru = r.rutas, pi = r.puntos_interes, ct = r.clientes_tradex;
    const pct = (a, b) => b ? Math.round(a*100/b) : 0;
    const pctClass = p => p >= 80 ? 'rd-good' : (p >= 50 ? 'rd-warn' : 'rd-bad');
    const faltantes = (m.faltantes || []).slice(0, 12);

    return `
    <div id="${cmrbSlotId}" class="ua-rd-wrap">
        ${_header()}
        <div class="ua-rd-row">
            <div class="ua-rd-card rd-total">
                <div class="ua-rd-icon"><i class="bi bi-people-fill"></i></div>
                <div class="ua-rd-num">${m.total_asignados||0}</div>
                <div class="ua-rd-lbl">Mercaderistas asignados</div>
                <div class="ua-rd-mini">${m.exclusivos||0} Excl · ${m.tradex||0} Tradex</div>
            </div>
            <div class="ua-rd-card rd-plan">
                <div class="ua-rd-icon"><i class="bi bi-clipboard-check"></i></div>
                <div class="ua-rd-num">${m.planificados_hoy||0}</div>
                <div class="ua-rd-lbl">Planificados hoy</div>
            </div>
            <div class="ua-rd-card rd-good">
                <div class="ua-rd-icon"><i class="bi bi-person-fill-check"></i></div>
                <div class="ua-rd-num">${m.activos_hoy||0}</div>
                <div class="ua-rd-lbl">Activaron hoy</div>
                <div class="ua-rd-bar"><div class="ua-rd-bar-i" style="width:${pct(m.activos_hoy,m.planificados_hoy)}%"></div></div>
            </div>
            <div class="ua-rd-card rd-bad ${faltantes.length ? 'rd-clickable' : ''}" id="cmrb-faltantes-card">
                <div class="ua-rd-icon"><i class="bi bi-person-fill-exclamation"></i></div>
                <div class="ua-rd-num">${m.faltantes_hoy||0}</div>
                <div class="ua-rd-lbl">Faltaron hoy</div>
                ${faltantes.length ? '<div class="ua-rd-mini ua-rd-link">Ver detalle ▾</div>' : ''}
            </div>
        </div>

        <div class="ua-rd-row">
            ${_triple('Rutas',  'signpost-split', ru.planificadas, ru.activas, ru.completadas, pctClass)}
            ${_triple('Puntos', 'geo-alt-fill',   pi.planificados, pi.activos, pi.completados, pctClass, 'cmrb-puntos-triple')}
            ${ct.aplica
                ? _triple('Clientes (Tradex)', 'building', ct.planificados, ct.activos, ct.completados, pctClass)
                : `<div class="ua-rd-triple rd-disabled">
                     <div class="ua-rd-triple-head"><i class="bi bi-building"></i> Clientes (Tradex)</div>
                     <div class="rd-empty">Sin mercaderistas Tradex en este cliente.</div>
                   </div>`}
        </div>

        <div id="cmrb-faltantes-panel" class="ua-rd-faltantes" style="display:none;">
            <div class="ua-rd-faltantes-head">
                <strong><i class="bi bi-x-octagon"></i> Mercaderistas que no activaron</strong>
                <span class="ua-rd-mini">${faltantes.length} de ${m.faltantes_hoy||0}</span>
            </div>
            <div class="ua-rd-faltantes-grid">
                ${faltantes.map(f => `
                    <div class="ua-rd-fcard">
                        <div class="ua-rd-fname"><i class="bi bi-person-circle"></i> ${cmrbEsc(f.nombre)}</div>
                        <div class="ua-rd-fsub">
                            ${(f.rutas_nombres||[]).map(cmrbEsc).join(', ') || '— sin ruta —'}
                        </div>
                        <div class="ua-rd-fchips">
                            <span class="rd-chip">${f.pois_planificados||0} POIs</span>
                            <span class="rd-chip">${f.rutas_planificadas||0} rutas</span>
                            <span class="rd-chip ${f.tipo_servicio==='Tradex'?'rd-chip-tradex':'rd-chip-excl'}">${f.tipo_servicio||'Exclusivo'}</span>
                        </div>
                    </div>`).join('')}
            </div>
        </div>
    </div>`;
}

function _triple(label, icon, plan, act, com, pctClass, clickId) {
    const pAct = plan ? Math.round(act*100/plan) : 0;
    const pCom = plan ? Math.round(com*100/plan) : 0;
    const idAttr = clickId ? ` id="${clickId}"` : '';
    const clickCls = clickId ? ' rd-clickable' : '';
    const hint = clickId ? '<div class="ua-rd-mini ua-rd-link">Ver PDVs ▾</div>' : '';
    return `
    <div class="ua-rd-triple${clickCls}"${idAttr}>
        <div class="ua-rd-triple-head"><i class="bi bi-${icon}"></i> ${label}</div>
        <div class="ua-rd-triple-row">
            <div class="rd-cell"><div class="rd-cell-n">${plan||0}</div><div class="rd-cell-l">Plan.</div></div>
            <div class="rd-cell"><div class="rd-cell-n ${pctClass(pAct)}">${act||0}</div><div class="rd-cell-l">Activos · ${pAct}%</div></div>
            <div class="rd-cell"><div class="rd-cell-n ${pctClass(pCom)}">${com||0}</div><div class="rd-cell-l">Comp. · ${pCom}%</div></div>
        </div>
        <div class="ua-rd-bar"><div class="ua-rd-bar-i" style="width:${pCom}%"></div></div>
        ${hint}
    </div>`;
}

// ── Drill-down: lista de PDVs por estado (pendiente/activo/completado) ──────
function _showPuntosModal() {
    if (typeof Swal === 'undefined') return;
    const cid = cmrbClienteId != null ? cmrbClienteId : (window.UV_CLIENTE_FILTRO || null);
    const fecha = cmrbFecha || cmrbToday();
    const url = `/api/centro-mando/resumen-dia/puntos?fecha=${fecha}` + (cid ? `&cliente_id=${cid}` : '');

    Swal.fire({ title: 'Cargando PDVs…', didOpen: () => Swal.showLoading(), allowOutsideClick: false });

    $.ajax({ url: url, type: 'GET', dataType: 'json', timeout: 25000 })
    .done(function (r) {
        if (!r || !r.success) {
            Swal.fire('Error', (r && (r.message || r.error)) || 'No se pudo cargar', 'error');
            return;
        }
        const sec = (titulo, icon, color, items) => {
            items = items || [];
            const filas = items.length
                ? items.map(p => `<tr><td><b>${cmrbEsc(p.ruta)}</b></td><td>${cmrbEsc(p.punto_de_interes)}</td><td class="text-muted">${cmrbEsc(p.mercaderista)}</td></tr>`).join('')
                : '<tr><td colspan="3" class="text-center text-muted py-2">— ninguno —</td></tr>';
            return `
            <details ${items.length ? 'open' : ''} style="margin-bottom:10px;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                <summary style="cursor:pointer;padding:10px 14px;background:${color};color:#fff;font-weight:700;list-style:none;">
                    <i class="bi bi-${icon} me-1"></i>${titulo}<span style="float:right;">${items.length}</span>
                </summary>
                <div style="max-height:38vh;overflow:auto;">
                    <table class="table table-sm table-striped mb-0" style="font-size:.85rem;">
                        <thead><tr><th>Ruta</th><th>PDV</th><th>Mercaderista</th></tr></thead>
                        <tbody>${filas}</tbody>
                    </table>
                </div>
            </details>`;
        };
        const html = `
            <div style="text-align:left;">
                <div class="text-muted mb-2" style="font-size:.85rem;">
                    ${cmrbEsc(r.dia)} · ${cmrbEsc(r.fecha)} · ${cid ? 'Cliente ' + cid : 'Todos los clientes'}
                </div>
                ${sec('Pendientes', 'hourglass-split', '#6b7280', r.pendientes)}
                ${sec('Activos', 'play-circle-fill', '#0d6efd', r.activos)}
                ${sec('Completados', 'check-circle-fill', '#16a34a', r.completados)}
            </div>`;
        Swal.fire({ title: 'PDVs del día', html: html, width: '820px', confirmButtonText: 'Cerrar' });
    })
    .fail(function (xhr, textStatus) {
        Swal.fire('Error', textStatus === 'timeout' ? 'La consulta tardó demasiado.' : 'Error al cargar los PDVs', 'error');
    });
}

// ── Events ───────────────────────────────────────────────────────
function _bindEvents() {
    // Auto-disparo si quedó en idle
    if (cmrbEstado === 'idle') {
        setTimeout(_fetch, 0);
    }

    $('#cmrb-refresh, #cmrb-retry').off('click').on('click', function() { _fetch(); });

    $('#cmrb-date').off('change').on('change', function() {
        const v = $(this).val();
        if (!v) return;
        cmrbFecha = v;
        _fetch();
    });

    $('#cmrb-cli').off('change').on('change', function() {
        const v = $(this).val();
        cmrbClienteId = v ? parseInt(v) : null;
        _fetch();
    });

    $('#cmrb-today').off('click').on('click', function() {
        cmrbFecha = cmrbToday();
        _fetch();
    });

    function shift(days) {
        const d = new Date(cmrbFecha + 'T00:00:00');
        d.setDate(d.getDate() + days);
        const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        if (iso > cmrbToday()) return;
        cmrbFecha = iso;
        _fetch();
    }
    $('#cmrb-prev').off('click').on('click', function() { shift(-1); });
    $('#cmrb-next').off('click').on('click', function() { shift(+1); });

    $('#cmrb-faltantes-card').off('click').on('click', function() {
        const p = document.getElementById('cmrb-faltantes-panel');
        if (p) p.style.display = (p.style.display === 'none' ? 'block' : 'none');
    });

    $('#cmrb-puntos-triple').off('click').on('click', _showPuntosModal);
}
