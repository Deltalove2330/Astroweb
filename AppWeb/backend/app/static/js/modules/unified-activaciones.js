// ╔══════════════════════════════════════════════════════════════════════╗
// ║  /static/js/modules/unified-activaciones.js  v3.0 FINAL            ║
// ╚══════════════════════════════════════════════════════════════════════╝

let allActivaciones      = [];
let filteredActivaciones = [];
let uaStats              = {};
let uaMesesDisponibles   = [];
let uaSearchTimeout      = null;
let uaFiltroEstado       = 'todos';

// Filtro de período activo
let uaPeriodo = 'hoy';   // 'hoy' | 'mes:2026-03' | 'anio:2026'

// Tab activo en paneles de progreso
let uaTabPunto   = 'act';  // 'act' | 'com'
let uaTabCliente = 'act';

// ════════════════════════════════════════════════════════════════
// CARGA PRINCIPAL
// ════════════════════════════════════════════════════════════════

export function loadUnifiedActivaciones() {
    $('#content-area').html(`
        <div class="ua-container">
            <div class="ua-header-bar">
                <div class="d-flex align-items-center gap-3">
                    <div class="ua-icon-pulse"><i class="bi bi-lightning-charge-fill"></i></div>
                    <div>
                        <h3 class="mb-0" style="color:var(--text-primary);">Centro de Mando · Activaciones</h3>
                        <small style="color:var(--text-muted);">Cargando...</small>
                    </div>
                </div>
            </div>
            <div class="text-center py-5">
                <div class="ua-spinner-ring"></div>
                <p class="mt-3" style="color:var(--text-muted);">Obteniendo activaciones...</p>
            </div>
        </div>`);
    _fetchActivaciones();
}

function _buildApiUrl() {
    if (uaPeriodo === 'hoy') return '/api/unified-activaciones?solo_hoy=1';
    if (uaPeriodo.startsWith('mes:'))  return '/api/unified-activaciones?solo_hoy=0&mes='  + uaPeriodo.slice(4);
    if (uaPeriodo.startsWith('anio:')) return '/api/unified-activaciones?solo_hoy=0&anio=' + uaPeriodo.slice(5);
    return '/api/unified-activaciones?solo_hoy=1';
}

function _fetchActivaciones() {
    $.getJSON(_buildApiUrl())
        .done(function(res) {
            if (res.success) {
                allActivaciones      = res.activaciones      || [];
                uaStats              = res.stats             || {};
                uaMesesDisponibles   = res.meses_disponibles || [];
                filteredActivaciones = [...allActivaciones];
                _renderView();
            } else {
                _showError(res.error || 'Error desconocido');
            }
        })
        .fail(() => _showError('No se pudo conectar con el servidor'));
}

// ════════════════════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════════════════════

function _renderView() {
    const s = uaStats;
    const mercaderistas = [...new Set(allActivaciones.map(v => v.mercaderista).filter(Boolean))].sort();
    const clientes      = [...new Set(allActivaciones.map(v => v.cliente).filter(Boolean))].sort();
    const puntos        = [...new Set(allActivaciones.map(v => v.punto_de_interes).filter(Boolean))].sort();
    const rutas         = [...new Set(allActivaciones.map(v => v.ruta).filter(Boolean))].sort();

    // Etiqueta período activo
    let periodoLabel = 'Hoy';
    if (uaPeriodo.startsWith('mes:')) {
        const found = uaMesesDisponibles.find(x => x.value === uaPeriodo.slice(4));
        periodoLabel = found ? found.label : uaPeriodo.slice(4);
    } else if (uaPeriodo.startsWith('anio:')) {
        periodoLabel = uaPeriodo.slice(5);
    }

    // Botones de mes/año
    const mesesHtml = _buildPeriodoBtns();

    $('#content-area').html(`
        <div class="ua-container">

            <!-- HEADER -->
            <div class="ua-header-bar">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="ua-icon-pulse"><i class="bi bi-lightning-charge-fill"></i></div>
                        <div>
                            <h3 class="mb-0" style="color:var(--text-primary);display:flex;align-items:center;gap:.5rem;">
                                Activaciones
                                <span id="ua-status-dot" style="width:10px;height:10px;border-radius:50%;background:#3a86ff;display:inline-block;margin-left:4px;"></span>
                            </h3>
                            <small style="color:var(--text-muted);">${s.total_registros||0} registros · ${periodoLabel}</small>
                        </div>
                    </div>
                    <button class="btn btn-sm uv-refresh-btn" id="ua-refresh-btn">
                        <i class="bi bi-arrow-clockwise"></i> Actualizar
                    </button>
                </div>
            </div>

            <!-- SELECTOR DE PERÍODO -->
            <div class="ua-periodo-bar">
                <span class="ua-periodo-label"><i class="bi bi-calendar3"></i> Período:</span>
                <div class="ua-periodo-btns" id="ua-periodo-btns">
                    ${mesesHtml}
                </div>
            </div>

            <!-- STATS: fila 1 (6 cards) -->
            <div class="ua-stats-row">
                <div class="ua-stat-card ua-sc-total" id="ua-btn-todos">
                    <div class="ua-stat-icon"><i class="bi bi-collection-fill"></i></div>
                    <div class="ua-stat-number">${s.total_registros||0}</div>
                    <div class="ua-stat-label">Total registros</div>
                </div>
                <div class="ua-stat-card ua-sc-entrada" id="ua-btn-entradas">
                    <div class="ua-stat-icon"><i class="bi bi-play-circle-fill"></i></div>
                    <div class="ua-stat-number">${s.con_activacion||0}</div>
                    <div class="ua-stat-label">Con entrada</div>
                </div>
                <div class="ua-stat-card ua-sc-salida" id="ua-btn-salidas">
                    <div class="ua-stat-icon"><i class="bi bi-stop-circle-fill"></i></div>
                    <div class="ua-stat-number">${s.con_desactivacion||0}</div>
                    <div class="ua-stat-label">Con salida</div>
                </div>
                <div class="ua-stat-card ua-sc-completa" id="ua-btn-completas">
                    <div class="ua-stat-icon"><i class="bi bi-check-circle-fill"></i></div>
                    <div class="ua-stat-number">${s.completas||0}</div>
                    <div class="ua-stat-label">Completas</div>
                </div>
                <div class="ua-stat-card ua-sc-activo" id="ua-btn-activos">
                    <div class="ua-stat-icon"><i class="bi bi-person-fill-up"></i></div>
                    <div class="ua-stat-number">${s.activos_ahora||0}</div>
                    <div class="ua-stat-label">Activos ahora</div>
                </div>
                <div class="ua-stat-card ua-sc-rutas">
                    <div class="ua-stat-icon"><i class="bi bi-signpost-split-fill"></i></div>
                    <div class="ua-stat-number">${s.rutas_ejecutadas||0} <span class="ua-stat-denom">/ ${s.total_rutas||0}</span></div>
                    <div class="ua-stat-label">Rutas ejecutadas</div>
                </div>
            </div>

            <!-- STATS: fila 2 (2 progreso) -->
            <div class="ua-stats-row ua-stats-progreso">
                <div class="ua-stat-card ua-sc-progreso-act">
                    <div class="ua-stat-icon"><i class="bi bi-play-fill"></i></div>
                    <div class="ua-prog-wrap">
                        <div class="ua-prog-number">${s.progreso_activaciones||0}%</div>
                        <div class="ua-prog-bar-outer">
                            <div class="ua-prog-bar-inner ua-prog-act" style="width:${s.progreso_activaciones||0}%"></div>
                        </div>
                    </div>
                    <div class="ua-stat-label">Progreso activaciones <small>(${s.con_activacion||0}/${s.total_registros||0})</small></div>
                </div>
                <div class="ua-stat-card ua-sc-progreso-com">
                    <div class="ua-stat-icon"><i class="bi bi-check2-all"></i></div>
                    <div class="ua-prog-wrap">
                        <div class="ua-prog-number">${s.progreso_completas||0}%</div>
                        <div class="ua-prog-bar-outer">
                            <div class="ua-prog-bar-inner ua-prog-com" style="width:${s.progreso_completas||0}%"></div>
                        </div>
                    </div>
                    <div class="ua-stat-label">Progreso completas <small>(${s.completas||0}/${s.total_registros||0})</small></div>
                </div>
            </div>

            <!-- PANELES DE DESGLOSE -->
            <div class="ua-desglose-grid">

                <!-- Panel Puntos -->
                <div class="ua-desglose-panel">
                    <div class="ua-dp-header">
                        <div class="ua-dp-title"><i class="bi bi-geo-alt-fill"></i> Progreso por Punto</div>
                        <div class="ua-dp-tabs">
                            <button class="ua-dp-tab ${uaTabPunto==='act'?'ua-dp-tab-active':''}" id="ua-tab-punto-act">
                                <i class="bi bi-play-circle"></i> Activaciones
                            </button>
                            <button class="ua-dp-tab ${uaTabPunto==='com'?'ua-dp-tab-active':''}" id="ua-tab-punto-com">
                                <i class="bi bi-check2-all"></i> Completas
                            </button>
                        </div>
                        <span class="ua-dp-periodo">${periodoLabel}</span>
                    </div>
                    <div class="ua-dp-body" id="ua-dp-puntos">
                        ${_buildBars(uaTabPunto === 'act' ? (s.pp_activaciones||[]) : (s.pp_completas||[]))}
                    </div>
                </div>

                <!-- Panel Clientes -->
                <div class="ua-desglose-panel">
                    <div class="ua-dp-header">
                        <div class="ua-dp-title"><i class="bi bi-building-fill"></i> Progreso por Cliente</div>
                        <div class="ua-dp-tabs">
                            <button class="ua-dp-tab ${uaTabCliente==='act'?'ua-dp-tab-active':''}" id="ua-tab-cliente-act">
                                <i class="bi bi-play-circle"></i> Activaciones
                            </button>
                            <button class="ua-dp-tab ${uaTabCliente==='com'?'ua-dp-tab-active':''}" id="ua-tab-cliente-com">
                                <i class="bi bi-check2-all"></i> Completas
                            </button>
                        </div>
                        <span class="ua-dp-periodo">${periodoLabel}</span>
                    </div>
                    <div class="ua-dp-body" id="ua-dp-clientes">
                        ${_buildBars(uaTabCliente === 'act' ? (s.pc_activaciones||[]) : (s.pc_completas||[]))}
                    </div>
                </div>

            </div>

            <!-- BÚSQUEDA + FILTROS -->
            <div class="uv-search-bar">
                <div class="uv-search-wrapper">
                    <i class="bi bi-search uv-search-icon"></i>
                    <input type="text" class="uv-search-input" id="ua-search"
                           placeholder="Buscar mercaderista, cliente, punto, ruta..." autocomplete="off">
                    <span class="uv-search-count" id="ua-search-count">${filteredActivaciones.length} resultados</span>
                </div>
                <div class="uv-filters-row">
                    <select class="uv-filter-select" id="ua-f-mercaderista">
                        <option value="">Todos los mercaderistas</option>
                        ${mercaderistas.map(m=>`<option value="${_esc(m)}">${_esc(m)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="ua-f-cliente">
                        <option value="">Todos los clientes</option>
                        ${clientes.map(c=>`<option value="${_esc(c)}">${_esc(c)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="ua-f-punto">
                        <option value="">Todos los puntos</option>
                        ${puntos.map(p=>`<option value="${_esc(p)}">${_esc(p)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="ua-f-ruta">
                        <option value="">Todas las rutas</option>
                        ${rutas.map(r=>`<option value="${_esc(r)}">${_esc(r)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="ua-f-estado">
                        <option value="">Todos los estados</option>
                        <option value="activo">⚡ Activo ahora</option>
                        <option value="completa">✅ Completa</option>
                        <option value="solo_salida">⚠️ Solo salida</option>
                    </select>
                    <button class="uv-clear-btn" id="ua-clear-filters" title="Limpiar filtros"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>

            <!-- LISTA -->
            <div class="ua-list" id="ua-list">
                ${_buildCards(filteredActivaciones)}
            </div>

        </div>`);

    _bindEvents();
    _highlightStatCard(uaFiltroEstado);
}

// ════════════════════════════════════════════════════════════════
// BOTONES DE PERÍODO
// ════════════════════════════════════════════════════════════════

function _buildPeriodoBtns() {
    // Agrupar meses por año para no llenar de botones
    const anios = {};
    uaMesesDisponibles.forEach(function(m) {
        if (!anios[m.anio]) anios[m.anio] = [];
        anios[m.anio].push(m);
    });

    let html = `<button class="ua-periodo-btn ${uaPeriodo==='hoy'?'ua-periodo-active':''}" data-periodo="hoy">
                    <i class="bi bi-sun"></i> Hoy
                </button>`;

    // Por cada año, un select de meses
    Object.keys(anios).sort((a,b)=>b-a).forEach(function(anio) {
        const meses = anios[anio];
        const activeInYear = meses.some(m => uaPeriodo === 'mes:' + m.value);
        const currentMes   = activeInYear ? meses.find(m => uaPeriodo === 'mes:' + m.value) : null;

        html += `<div class="ua-periodo-year-group">
            <select class="ua-periodo-select ${activeInYear?'ua-periodo-select-active':''}" data-anio="${anio}" id="ua-sel-${anio}">
                <option value="" ${!activeInYear?'selected':''}>📅 ${anio}</option>
                ${meses.map(m => `<option value="mes:${m.value}" ${uaPeriodo==='mes:'+m.value?'selected':''}>${m.label}</option>`).join('')}
            </select>
        </div>`;
    });

    return html;
}

// ════════════════════════════════════════════════════════════════
// BARRAS DE PROGRESO
// ════════════════════════════════════════════════════════════════

function _buildBars(items) {
    if (!items || items.length === 0) {
        return `<div class="ua-dp-empty"><i class="bi bi-inbox"></i><span>Sin datos para este período</span></div>`;
    }
    return items.map(function(item) {
        const pct = item.porcentaje || 0;
        const cls = pct === 100 ? 'ua-bar-full' : pct >= 60 ? 'ua-bar-mid' : pct >= 30 ? 'ua-bar-low' : 'ua-bar-zero';
        const clr = pct === 100 ? '#28a745' : pct >= 60 ? '#3a86ff' : pct >= 30 ? '#e6a800' : '#ff6b6b';
        return `
        <div class="ua-dp-row">
            <div class="ua-dp-name" title="${_esc(item.nombre)}">${_esc(item.nombre)}</div>
            <div class="ua-dp-bar-wrap"><div class="ua-dp-bar ${cls}" style="width:${pct}%"></div></div>
            <div class="ua-dp-pct" style="color:${clr}">${pct}%</div>
            <div class="ua-dp-cnt">${item.con}/${item.total}</div>
        </div>`;
    }).join('');
}

// ════════════════════════════════════════════════════════════════
// TARJETAS DE VISITA
// ════════════════════════════════════════════════════════════════

function _buildCards(list) {
    if (!list || list.length === 0) {
        return `<div class="uv-no-results">
                    <i class="bi bi-lightning-charge" style="font-size:3rem;opacity:.25;"></i>
                    <p style="color:var(--text-muted);margin-top:1rem;">Sin activaciones para este filtro</p>
                </div>`;
    }
    return list.map(_card).join('');
}

function _card(v) {
    const tieneAct  = v.id_foto_activacion   != null;
    const tieneDes  = v.id_foto_desactivacion != null;
    const activo    = tieneAct && !tieneDes;
    const pClass    = v.estado_presencia === 'completa' ? 'ua-p-completa'
                    : v.estado_presencia === 'activo'   ? 'ua-p-activo'
                    : 'ua-p-solo_salida';
    const pLabel    = v.estado_presencia === 'completa'
                    ? '<i class="bi bi-check-circle-fill"></i> Completa'
                    : v.estado_presencia === 'activo'
                    ? '<i class="bi bi-person-fill-up"></i> Activo ahora'
                    : '<i class="bi bi-exclamation-circle-fill"></i> Solo salida';
    const durStr    = v.duracion_minutos != null ? _fmtDuracion(v.duracion_minutos) : null;
    const horaAct   = v.fecha_activacion    ? _fmtHora(v.fecha_activacion)    : null;
    const horaDes   = v.fecha_desactivacion ? _fmtHora(v.fecha_desactivacion) : null;

    const thumbAct = tieneAct
        ? `<div class="ua-thumb ua-thumb-act" onclick="window.uaVerFoto(${v.id_visita},5)" title="Ver foto entrada">
               <img src="${window.getImageUrl(v.file_path_activacion)}" loading="lazy" alt="Entrada">
               <div class="ua-thumb-label"><i class="bi bi-play-circle-fill"></i>${horaAct||''}</div>
           </div>`
        : `<div class="ua-thumb ua-thumb-empty"><i class="bi bi-play-circle"></i><span>Sin entrada</span></div>`;

    const thumbDes = tieneDes
        ? `<div class="ua-thumb ua-thumb-des" onclick="window.uaVerFoto(${v.id_visita},6)" title="Ver foto salida">
               <img src="${window.getImageUrl(v.file_path_desactivacion)}" loading="lazy" alt="Salida">
               <div class="ua-thumb-label"><i class="bi bi-stop-circle-fill"></i>${horaDes||''}</div>
           </div>`
        : `<div class="ua-thumb ua-thumb-empty">
               ${activo
                   ? '<i class="bi bi-door-open" style="color:#ffc107;"></i><span style="color:#ffc107;">En punto</span>'
                   : '<i class="bi bi-stop-circle"></i><span>Sin salida</span>'}
           </div>`;

    return `
    <div class="ua-card ${pClass}" data-ua-card="${v.id_visita}">
        <div class="ua-card-estado">
            <span class="ua-badge-presencia ${pClass}">${pLabel}</span>
            ${activo ? '<span class="ua-pulse-dot"></span>' : ''}
        </div>
        <div class="ua-card-info">
            <div class="ua-card-primary">
                <span class="ua-merc-name">${_esc(v.mercaderista)}</span>
                <span class="uv-sep">·</span>
                <span class="ua-client-name">${_esc(v.cliente)}</span>
            </div>
            <div class="ua-card-secondary">
                <span><i class="bi bi-geo-alt-fill"></i> ${_esc(v.punto_de_interes)}</span>
                <span><i class="bi bi-signpost-2"></i> ${_esc(v.ruta)}</span>
                ${v.ciudad ? `<span><i class="bi bi-building"></i> ${_esc(v.ciudad)}</span>` : ''}
                ${durStr   ? `<span class="ua-duracion"><i class="bi bi-hourglass-split"></i> ${durStr}</span>` : ''}
            </div>
        </div>
        <div class="ua-card-thumbs">
            ${thumbAct}
            <div class="ua-thumb-arrow"><i class="bi bi-arrow-right"></i></div>
            ${thumbDes}
        </div>
        <div class="ua-card-actions">
            <button class="uv-action-btn uv-act-chat ${v.mensajes_no_leidos>0?'uv-has-msgs':''}"
                    onclick="window.uvOpenChat(${v.id_visita})" title="Chat">
                <i class="bi bi-chat-dots"></i>
                ${v.mensajes_no_leidos>0?`<span class="uv-chat-dot">${v.mensajes_no_leidos}</span>`:''}
            </button>
            <button class="uv-action-btn ua-act-detail" onclick="window.uaVerDetalle(${v.id_visita})" title="Ver detalle">
                <i class="bi bi-eye"></i>
            </button>
        </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════════
// FILTROS
// ════════════════════════════════════════════════════════════════

function _applyFilters() {
    const term = ($('#ua-search').val()||'').toLowerCase().trim();
    const fM   = $('#ua-f-mercaderista').val();
    const fC   = $('#ua-f-cliente').val();
    const fP   = $('#ua-f-punto').val();
    const fR   = $('#ua-f-ruta').val();
    const fE   = $('#ua-f-estado').val();

    filteredActivaciones = allActivaciones.filter(function(v) {
        if (term) {
            const s = [v.id_visita+'',v.mercaderista,v.cliente,
                       v.punto_de_interes,v.ruta,v.ciudad,v.analista].join(' ').toLowerCase();
            if (s.indexOf(term) === -1) return false;
        }
        if (fM && v.mercaderista    !== fM) return false;
        if (fC && v.cliente         !== fC) return false;
        if (fP && v.punto_de_interes !== fP) return false;
        if (fR && v.ruta            !== fR) return false;
        if (fE && v.estado_presencia !== fE) return false;
        return true;
    });

    $('#ua-list').html(_buildCards(filteredActivaciones));
    $('#ua-search-count').text(filteredActivaciones.length + ' resultados');
}

function _highlightStatCard(estado) {
    $('.ua-stat-card').removeClass('ua-sc-active');
    if (!estado || estado === 'todos') { $('#ua-btn-todos').addClass('ua-sc-active'); return; }
    const map = { activo:'#ua-btn-activos', completa:'#ua-btn-completas' };
    if (map[estado]) $(map[estado]).addClass('ua-sc-active');
}

// ════════════════════════════════════════════════════════════════
// EVENTOS
// ════════════════════════════════════════════════════════════════

function _bindEvents() {
    // Búsqueda
    $('#ua-search').off('input').on('input', function() {
        clearTimeout(uaSearchTimeout);
        uaSearchTimeout = setTimeout(_applyFilters, 250);
    });

    // Selectores filtro
    $('#ua-f-mercaderista,#ua-f-cliente,#ua-f-punto,#ua-f-ruta,#ua-f-estado')
        .off('change').on('change', _applyFilters);

    // Limpiar filtros
    $('#ua-clear-filters').off('click').on('click', function() {
        $('#ua-search,#ua-f-mercaderista,#ua-f-cliente,#ua-f-punto,#ua-f-ruta,#ua-f-estado').val('');
        uaFiltroEstado = 'todos';
        _applyFilters();
        _highlightStatCard('todos');
    });

    // Actualizar
    $('#ua-refresh-btn').off('click').on('click', loadUnifiedActivaciones);

    // Botón Hoy
    $(document).off('click.ua-periodo', '[data-periodo="hoy"]')
               .on('click.ua-periodo',  '[data-periodo="hoy"]', function() {
        uaPeriodo = 'hoy';
        loadUnifiedActivaciones();
    });

    // Selectores año/mes
    $(document).off('change.ua-sel', '.ua-periodo-select')
               .on('change.ua-sel',  '.ua-periodo-select', function() {
        const val = $(this).val();
        if (!val) return;
        uaPeriodo = val;   // ya viene como "mes:2026-03"
        loadUnifiedActivaciones();
    });

    // Stats → filtros rápidos
    $('#ua-btn-todos').off('click').on('click',     () => { uaFiltroEstado='todos';    $('#ua-f-estado').val('');          _applyFilters(); _highlightStatCard('todos'); });
    $('#ua-btn-completas').off('click').on('click', () => { uaFiltroEstado='completa'; $('#ua-f-estado').val('completa');  _applyFilters(); _highlightStatCard('completa'); });
    $('#ua-btn-activos').off('click').on('click',   () => { uaFiltroEstado='activo';   $('#ua-f-estado').val('activo');    _applyFilters(); _highlightStatCard('activo'); });
    $('#ua-btn-entradas').off('click').on('click',  () => {
        filteredActivaciones = allActivaciones.filter(v => !!v.id_foto_activacion);
        $('#ua-list').html(_buildCards(filteredActivaciones));
        $('#ua-search-count').text(filteredActivaciones.length + ' resultados');
        $('.ua-stat-card').removeClass('ua-sc-active');
        $('#ua-btn-entradas').addClass('ua-sc-active');
    });
    $('#ua-btn-salidas').off('click').on('click', () => {
        filteredActivaciones = allActivaciones.filter(v => !!v.id_foto_desactivacion);
        $('#ua-list').html(_buildCards(filteredActivaciones));
        $('#ua-search-count').text(filteredActivaciones.length + ' resultados');
        $('.ua-stat-card').removeClass('ua-sc-active');
        $('#ua-btn-salidas').addClass('ua-sc-active');
    });

    // Tabs paneles desglose
    $('#ua-tab-punto-act').off('click').on('click', function() {
        uaTabPunto = 'act';
        $('#ua-tab-punto-act').addClass('ua-dp-tab-active');
        $('#ua-tab-punto-com').removeClass('ua-dp-tab-active');
        $('#ua-dp-puntos').html(_buildBars(uaStats.pp_activaciones||[]));
    });
    $('#ua-tab-punto-com').off('click').on('click', function() {
        uaTabPunto = 'com';
        $('#ua-tab-punto-com').addClass('ua-dp-tab-active');
        $('#ua-tab-punto-act').removeClass('ua-dp-tab-active');
        $('#ua-dp-puntos').html(_buildBars(uaStats.pp_completas||[]));
    });
    $('#ua-tab-cliente-act').off('click').on('click', function() {
        uaTabCliente = 'act';
        $('#ua-tab-cliente-act').addClass('ua-dp-tab-active');
        $('#ua-tab-cliente-com').removeClass('ua-dp-tab-active');
        $('#ua-dp-clientes').html(_buildBars(uaStats.pc_activaciones||[]));
    });
    $('#ua-tab-cliente-com').off('click').on('click', function() {
        uaTabCliente = 'com';
        $('#ua-tab-cliente-com').addClass('ua-dp-tab-active');
        $('#ua-tab-cliente-act').removeClass('ua-dp-tab-active');
        $('#ua-dp-clientes').html(_buildBars(uaStats.pc_completas||[]));
    });
}

// ════════════════════════════════════════════════════════════════
// MODAL DETALLE
// ════════════════════════════════════════════════════════════════

window.uaVerDetalle = function(visitId) {
    const v = allActivaciones.find(x => x.id_visita === visitId);
    if (!v) return;

    const tieneAct = !!v.id_foto_activacion;
    const tieneDes = !!v.id_foto_desactivacion;
    const durStr   = v.duracion_minutos != null ? _fmtDuracion(v.duracion_minutos) : '—';

    function panelFoto(tiene, fp, fecha, tipo) {
        const icon  = tipo==='entrada' ? 'bi-play-circle-fill' : 'bi-stop-circle-fill';
        const color = tipo==='entrada' ? '#28a745' : '#dc3545';
        if (!tiene) return `
            <div class="ua-detail-nofoto">
                <i class="bi ${icon}" style="font-size:2.5rem;opacity:.3;color:${color};"></i>
                <p>Sin foto de ${tipo}</p>
                ${tipo==='salida'&&tieneAct?'<p class="ua-activo-label">⚡ Mercaderista aún en punto</p>':''}
            </div>`;
        return `
            <div class="ua-detail-foto">
                <img src="${window.getImageUrl(fp)}" class="img-fluid rounded shadow-sm"
                     style="max-height:320px;object-fit:contain;cursor:pointer;"
                     onclick="window.open('${window.getImageUrl(fp)}','_blank')">
                ${fecha?`<div class="ua-foto-ts"><i class="bi bi-clock"></i> ${_fmtFechaHora(fecha)}</div>`:''}
            </div>`;
    }

    const presLabels = { completa:'✅ Completa', activo:'⚡ Activo ahora', solo_salida:'⚠️ Solo salida' };
    const html = `
    <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header" style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:1px solid rgba(255,255,255,.1);">
                <div>
                    <h5 class="modal-title mb-1" style="color:#fff;">
                        <i class="bi bi-lightning-charge-fill text-warning me-2"></i>
                        Detalle · Visita #${v.id_visita}
                    </h5>
                    <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.35rem;">
                        <span class="badge bg-light text-dark"><i class="bi bi-person-badge me-1"></i>${_esc(v.mercaderista)}</span>
                        <span class="badge bg-primary"><i class="bi bi-building me-1"></i>${_esc(v.cliente)}</span>
                        <span class="badge bg-secondary"><i class="bi bi-geo-alt me-1"></i>${_esc(v.punto_de_interes)}</span>
                        <span class="badge ${v.estado_presencia==='activo'?'bg-warning text-dark':v.estado_presencia==='completa'?'bg-success':'bg-danger'}">${presLabels[v.estado_presencia]||''}</span>
                    </div>
                </div>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
                <div class="ua-detail-meta row g-3 mb-4">
                    <div class="col-6 col-md-3">
                        <div class="ua-meta-chip"><i class="bi bi-signpost-2"></i><div><small>Ruta</small><strong>${_esc(v.ruta)}</strong></div></div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="ua-meta-chip"><i class="bi bi-geo-alt"></i><div><small>Ciudad</small><strong>${_esc(v.ciudad||'N/A')}</strong></div></div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="ua-meta-chip"><i class="bi bi-hourglass-split"></i><div><small>Duración</small><strong>${durStr}</strong></div></div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="ua-meta-chip"><i class="bi bi-person-lines-fill"></i><div><small>Analista</small><strong>${_esc(v.analista||'N/A')}</strong></div></div>
                    </div>
                </div>
                ${tieneAct && tieneDes ? `
                <div class="ua-timeline mb-4">
                    <div class="ua-tl-node ua-tl-entrada">
                        <div class="ua-tl-dot"></div>
                        <div class="ua-tl-content"><span class="ua-tl-label">Entrada</span><span class="ua-tl-time">${_fmtHora(v.fecha_activacion)}</span></div>
                    </div>
                    <div class="ua-tl-line"></div>
                    <div class="ua-tl-center"><i class="bi bi-hourglass-split"></i><span>${durStr}</span></div>
                    <div class="ua-tl-line"></div>
                    <div class="ua-tl-node ua-tl-salida">
                        <div class="ua-tl-dot"></div>
                        <div class="ua-tl-content"><span class="ua-tl-label">Salida</span><span class="ua-tl-time">${_fmtHora(v.fecha_desactivacion)}</span></div>
                    </div>
                </div>` : ''}
                <div class="row g-4">
                    <div class="col-md-6">
                        <h6 class="mb-3"><span class="badge bg-success me-2"><i class="bi bi-play-circle-fill"></i></span>Entrada (Activación)</h6>
                        ${panelFoto(tieneAct, v.file_path_activacion, v.fecha_activacion, 'entrada')}
                    </div>
                    <div class="col-md-6">
                        <h6 class="mb-3"><span class="badge bg-danger me-2"><i class="bi bi-stop-circle-fill"></i></span>Salida (Desactivación)</h6>
                        ${panelFoto(tieneDes, v.file_path_desactivacion, v.fecha_desactivacion, 'salida')}
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline-secondary btn-sm" onclick="window.uvOpenChat(${v.id_visita})">
                    <i class="bi bi-chat-dots"></i> Chat
                    ${v.mensajes_no_leidos>0?`<span class="badge bg-danger ms-1">${v.mensajes_no_leidos}</span>`:''}
                </button>
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>`;

    let $m = $('#uaDetalleModal');
    if ($m.length) { try { bootstrap.Modal.getInstance($m[0])?.dispose(); } catch(e){} $m.remove(); }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open').css('overflow','');
    $m = $('<div class="modal fade" id="uaDetalleModal" tabindex="-1" aria-hidden="true"></div>');
    $('body').append($m);
    $m.html(html);
    new bootstrap.Modal($m[0], { backdrop:true, keyboard:true }).show();
};

// ════════════════════════════════════════════════════════════════
// VER FOTO AMPLIADA
// ════════════════════════════════════════════════════════════════

window.uaVerFoto = function(visitId, tipo) {
    const v = allActivaciones.find(x => x.id_visita === visitId);
    if (!v) return;
    const fp    = tipo === 5 ? v.file_path_activacion    : v.file_path_desactivacion;
    const fecha = tipo === 5 ? v.fecha_activacion         : v.fecha_desactivacion;
    if (!fp) return;
    Swal.fire({
        title: tipo === 5 ? 'Entrada (Activación)' : 'Salida (Desactivación)',
        html: `<img src="${window.getImageUrl(fp)}" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:8px;">
               ${fecha?`<p class="mt-2 text-muted small"><i class="bi bi-clock"></i> ${_fmtFechaHora(fecha)}</p>`:''}
               <p class="text-muted small"><i class="bi bi-person"></i> ${_esc(v.mercaderista)} · ${_esc(v.cliente)}</p>`,
        showConfirmButton: false, showCloseButton: true,
        width: '80vw', background: 'var(--card-bg)', color: 'var(--text-primary)',
    });
};

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

function _esc(str) {
    if (!str) return '';
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}
function _fmtHora(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleTimeString('es-VE',{hour:'2-digit',minute:'2-digit',hour12:false}); }
    catch(e){ return iso; }
}
function _fmtFechaHora(iso) {
    if (!iso) return '';
    try {
        const d = new Date(iso);
        return d.toLocaleDateString('es-VE',{day:'2-digit',month:'2-digit',year:'numeric'})
             + ' ' + d.toLocaleTimeString('es-VE',{hour:'2-digit',minute:'2-digit',hour12:false});
    } catch(e){ return iso; }
}
function _fmtDuracion(min) {
    if (min < 60) return `${min} min`;
    const h = Math.floor(min/60), m = min%60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
}
function _showError(msg) {
    $('#content-area').html(`
        <div class="ua-container">
            <div class="uv-empty-state">
                <i class="bi bi-exclamation-triangle" style="color:#ff6b6b;font-size:4rem;opacity:.5;"></i>
                <h4 style="color:var(--text-primary);margin-top:1rem;">Error al cargar activaciones</h4>
                <p style="color:var(--text-muted);">${msg}</p>
                <button class="btn btn-primary mt-3" id="ua-retry-btn"><i class="bi bi-arrow-clockwise"></i> Reintentar</button>
            </div>
        </div>`);
    $('#ua-retry-btn').on('click', loadUnifiedActivaciones);
}