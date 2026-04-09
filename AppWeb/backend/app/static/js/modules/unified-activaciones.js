// ╔══════════════════════════════════════════════════════════════════════╗
// ║  /static/js/modules/unified-activaciones.js  v5.1  BUGFIX          ║
// ║  Fix: pendientes, lentitud, modal 360°, colores modal              ║
// ╚══════════════════════════════════════════════════════════════════════╝

// ── Estado global ────────────────────────────────────────────────
let allActivaciones     = [];
let uaStats             = {};
let uaMesesDisponibles  = [];
let uaSemanasDisponibles = [];
let uaPorMercaderista   = [];
let uaPendientes        = [];
let uaGestionPorDia     = {};
let uaVistaActiva       = 'dashboard';
let uaPeriodoGlobal     = 'hoy';

// Caché de datos por período para evitar refetches innecesarios
const uaCache = {};

// Estado por tab
const uaTabState = {
    dashboard:     { periodo: 'hoy', q: '', fMerc: '', fCliente: '', fPdv: '', tabPunto: 'act', tabCliente: 'act' },
    mercaderistas: { periodo: 'hoy', q: '', fMerc: '', fCliente: '', fPdv: '' },
    gestion:       { periodo: 'hoy', q: '', fMerc: '', fCliente: '', fPdv: '' },
    pendientes:    { periodo: 'hoy', q: '', fMerc: '', fCliente: '', fPdv: '' },
    lista:         { periodo: 'hoy', q: '', fMerc: '', fCliente: '', fPdv: '', fEstado: '' },
};

let uaSearchTimeout = null;

// ════════════════════════════════════════════════════════════════
// CARGA PRINCIPAL
// ════════════════════════════════════════════════════════════════
export function loadUnifiedActivaciones() {
    // Limpiar caché al cargar desde cero
    Object.keys(uaCache).forEach(k => delete uaCache[k]);

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
            <div class="text-center py-5"><div class="ua-spinner-ring"></div></div>
        </div>`);
    _fetchAndStore(uaPeriodoGlobal, function(res) {
        _applyGlobalData(res);
        _render();
    });
}

// Fetch con caché — evita refetch del mismo período
function _fetchAndStore(periodo, callback) {
    const ckey = periodo;
    if (uaCache[ckey]) {
        callback(uaCache[ckey]);
        return;
    }
    $.getJSON(_buildUrl(periodo))
        .done(function(res) {
            if (res.success) {
                uaCache[ckey] = res;
                callback(res);
            } else {
                _showError(res.error || 'Error desconocido');
            }
        })
        .fail(function() { _showError('No se pudo conectar'); });
}

function _applyGlobalData(res) {
    allActivaciones      = res.activaciones      || [];
    uaStats              = res.stats             || {};
    uaMesesDisponibles   = res.meses_disponibles || [];
    uaSemanasDisponibles = res.semanas_disponibles || [];
    uaPorMercaderista    = res.por_mercaderista  || [];
    // Pendientes vienen del servidor (query real que incluye visitas sin fotos)
    // Fallback a cálculo JS si el servidor no los trae
    uaPendientes = res.pendientes && res.pendientes.length >= 0
        ? res.pendientes
        : _calcPendientes(allActivaciones);
    uaGestionPorDia      = res.gestion_por_dia   || {};
}

// FIX BUG 1: Pendientes = visitas SIN foto de activación (id_foto_activacion === null)
function _calcPendientes(activaciones) {
    const seen = new Set();
    const result = [];
    for (const v of activaciones) {
        if (v.id_foto_activacion !== null) continue; // tiene activación → no pendiente
        const key = v.id_punto + '_' + v.id_cliente;
        if (seen.has(key)) continue;
        seen.add(key);
        result.push({
            id_punto:         v.id_punto,
            punto_de_interes: v.punto_de_interes,
            cliente:          v.cliente,
            id_cliente:       v.id_cliente,
            mercaderista:     v.mercaderista,
            id_mercaderista:  v.id_mercaderista,
            ciudad:           v.ciudad,
            ruta:             v.ruta,
        });
    }
    return result.sort((a, b) => a.mercaderista.localeCompare(b.mercaderista) || a.cliente.localeCompare(b.cliente));
}

function _buildUrl(periodo) {
    if (periodo === 'hoy')           return '/api/unified-activaciones?solo_hoy=1';
    if (periodo === 'semana')        return '/api/unified-activaciones?solo_hoy=0&semana=' + _currentISOWeek();
    if (periodo === 'mes')           return '/api/unified-activaciones?solo_hoy=0&mes=' + _currentYearMonth();
    if (periodo === 'anio')          return '/api/unified-activaciones?solo_hoy=0&anio=' + new Date().getFullYear();
    if (periodo.startsWith('sem:'))  return '/api/unified-activaciones?solo_hoy=0&semana=' + periodo.slice(4);
    if (periodo.startsWith('mes:'))  return '/api/unified-activaciones?solo_hoy=0&mes='    + periodo.slice(4);
    if (periodo.startsWith('anio:')) return '/api/unified-activaciones?solo_hoy=0&anio='   + periodo.slice(5);
    return '/api/unified-activaciones?solo_hoy=1';
}

// ════════════════════════════════════════════════════════════════
// RENDER PRINCIPAL
// ════════════════════════════════════════════════════════════════
function _render() {
    const s = uaStats;
    // FIX BUG 1: usar uaPendientes (calculados correctamente)
    const pendCount = uaPendientes.length;

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
                                <span style="width:10px;height:10px;border-radius:50%;background:#3a86ff;display:inline-block;margin-left:4px;"></span>
                            </h3>
                            <small style="color:var(--text-muted);">${s.total_registros||0} registros · ${_labelFor(uaPeriodoGlobal)}</small>
                        </div>
                    </div>
                    <button class="btn btn-sm uv-refresh-btn" id="ua-refresh-btn">
                        <i class="bi bi-arrow-clockwise"></i> Actualizar
                    </button>
                </div>
            </div>

            <!-- SELECTOR PERÍODO GLOBAL -->
            <div class="ua-periodo-bar">
                <span class="ua-periodo-label"><i class="bi bi-calendar3"></i> Período global:</span>
                <div class="ua-periodo-btns">${_buildGlobalPeriodoBtns()}</div>
            </div>

            <!-- HERO STATS -->
            <div class="ua-hero-stats">
                <div class="ua-hero-card ua-hero-plan">
                    <div class="ua-hero-num">${_fmt(s.total_planificadas||0)}</div>
                    <div class="ua-hero-label">Total Planificadas</div>
                </div>
                <div class="ua-hero-card ua-hero-exec">
                    <div class="ua-hero-num">${_fmt(s.con_activacion||0)}</div>
                    <div class="ua-hero-label">Total Ejecutadas</div>
                </div>
                <div class="ua-hero-card ua-hero-pend">
                    <div class="ua-hero-num">${_fmt(pendCount)}</div>
                    <div class="ua-hero-label">PDVs Pendientes</div>
                </div>
                <div class="ua-hero-card ua-hero-pct">
                    <div class="ua-hero-num ua-hero-pct-num">${s.pct_cumplimiento||0}%</div>
                    <div class="ua-hero-label">% Cumplimiento</div>
                    <div class="ua-hero-bar-outer">
                        <div class="ua-hero-bar-inner" style="width:${Math.min(s.pct_cumplimiento||0,100)}%"></div>
                    </div>
                </div>
            </div>

            <!-- STATS SECUNDARIOS -->
            <div class="ua-stats-row">
                <div class="ua-stat-card ua-sc-total"><div class="ua-stat-icon"><i class="bi bi-collection-fill"></i></div><div class="ua-stat-number">${s.total_registros||0}</div><div class="ua-stat-label">Registros</div></div>
                <div class="ua-stat-card ua-sc-completa"><div class="ua-stat-icon"><i class="bi bi-check-circle-fill"></i></div><div class="ua-stat-number">${s.completas||0}</div><div class="ua-stat-label">Completas</div></div>
                <div class="ua-stat-card ua-sc-activo"><div class="ua-stat-icon"><i class="bi bi-person-fill-up"></i></div><div class="ua-stat-number">${s.activos_ahora||0}</div><div class="ua-stat-label">Activos ahora</div></div>
                <div class="ua-stat-card ua-sc-rutas"><div class="ua-stat-icon"><i class="bi bi-signpost-split-fill"></i></div><div class="ua-stat-number">${s.rutas_ejecutadas||0}<span class="ua-stat-denom"> / ${s.total_rutas||0}</span></div><div class="ua-stat-label">Rutas ejecutadas</div></div>
                <div class="ua-stat-card ua-sc-progreso-act">
                    <div class="ua-prog-mini-label">Activaciones</div>
                    <div class="ua-prog-mini-num">${s.progreso_activaciones||0}%</div>
                    <div class="ua-prog-bar-outer"><div class="ua-prog-bar-inner ua-prog-act" style="width:${s.progreso_activaciones||0}%"></div></div>
                    <div class="ua-prog-mini-sub">${s.con_activacion||0} / ${s.total_planificadas||0}</div>
                </div>
                <div class="ua-stat-card ua-sc-progreso-com">
                    <div class="ua-prog-mini-label">Completas</div>
                    <div class="ua-prog-mini-num">${s.progreso_completas||0}%</div>
                    <div class="ua-prog-bar-outer"><div class="ua-prog-bar-inner ua-prog-com" style="width:${s.progreso_completas||0}%"></div></div>
                    <div class="ua-prog-mini-sub">${s.completas||0} / ${s.total_planificadas||0}</div>
                </div>
            </div>

            <!-- TABS DE VISTA -->
            <div class="ua-view-tabs">
                <button class="ua-view-tab ${uaVistaActiva==='dashboard'?'ua-view-tab-active':''}" data-vista="dashboard"><i class="bi bi-grid-3x3-gap-fill"></i> Dashboard</button>
                <button class="ua-view-tab ${uaVistaActiva==='mercaderistas'?'ua-view-tab-active':''}" data-vista="mercaderistas"><i class="bi bi-people-fill"></i> Por Mercaderista <span class="ua-view-badge">${uaPorMercaderista.length}</span></button>
                <button class="ua-view-tab ${uaVistaActiva==='gestion'?'ua-view-tab-active':''}" data-vista="gestion"><i class="bi bi-table"></i> Gestión por Día</button>
                <button class="ua-view-tab ${uaVistaActiva==='pendientes'?'ua-view-tab-active':''}" data-vista="pendientes"><i class="bi bi-exclamation-circle-fill"></i> Pendientes <span class="ua-view-badge ua-badge-danger">${pendCount}</span></button>
                <button class="ua-view-tab ${uaVistaActiva==='lista'?'ua-view-tab-active':''}" data-vista="lista"><i class="bi bi-list-ul"></i> Todas las visitas <span class="ua-view-badge">${allActivaciones.length}</span></button>
            </div>

            <!-- CONTENIDO -->
            <div id="ua-view-content">${_renderTab()}</div>

        </div>`);

    _bindEvents();
}

// ════════════════════════════════════════════════════════════════
// PERÍODO GLOBAL
// ════════════════════════════════════════════════════════════════
function _buildGlobalPeriodoBtns() {
    const ps = [
        { v:'hoy',    l:'<i class="bi bi-sun"></i> Hoy' },
        { v:'semana', l:'<i class="bi bi-calendar-week"></i> Esta semana' },
        { v:'mes',    l:'<i class="bi bi-calendar-month"></i> Este mes' },
        { v:'anio',   l:'<i class="bi bi-calendar2"></i> Este año' },
    ];
    let html = ps.map(p =>
        `<button class="ua-periodo-btn ${uaPeriodoGlobal===p.v?'ua-periodo-active':''}" data-gperiodo="${p.v}">${p.l}</button>`
    ).join('');
    const anios = {};
    uaMesesDisponibles.forEach(m => { if (!anios[m.anio]) anios[m.anio] = []; anios[m.anio].push(m); });
    Object.keys(anios).sort((a,b)=>b-a).forEach(function(anio) {
        const meses = anios[anio];
        const activeInYear = meses.some(m => uaPeriodoGlobal === 'mes:' + m.value);
        html += `<select class="ua-periodo-select ${activeInYear?'ua-periodo-select-active':''}" data-gperiodo-sel>
            <option value="">📅 ${anio}</option>
            ${meses.map(m => `<option value="mes:${m.value}" ${uaPeriodoGlobal==='mes:'+m.value?'selected':''}>${m.label}</option>`).join('')}
        </select>`;
    });
    return html;
}

// ════════════════════════════════════════════════════════════════
// TOOLBAR POR TAB
// ════════════════════════════════════════════════════════════════
function _tabToolbar(tabName, opts) {
    const st = uaTabState[tabName];
    const ps = [
        { v:'hoy', l:'Hoy' }, { v:'semana', l:'Semana' },
        { v:'mes',  l:'Mes'  }, { v:'anio',   l:'Año'    },
    ];
    const periodoHtml = ps.map(p =>
        `<button class="ua-tab-periodo-btn ${st.periodo===p.v?'ua-tab-periodo-active':''}" data-tab="${tabName}" data-tperiodo="${p.v}">${p.l}</button>`
    ).join('');

    // Datos del tab actual (según su período activo)
    const tabData = uaCache[st.periodo] ? (uaCache[st.periodo].activaciones || []) : allActivaciones;
    const mercs    = [...new Set(tabData.map(v=>v.mercaderista).filter(Boolean))].sort();
    const clientes = [...new Set(tabData.map(v=>v.cliente).filter(Boolean))].sort();
    const pdvs     = [...new Set(tabData.map(v=>v.punto_de_interes).filter(Boolean))].sort();

    return `
    <div class="ua-tab-toolbar" data-toolbar="${tabName}">
        <div class="ua-tab-periodo-row">
            ${periodoHtml}
            <span class="ua-tab-loading" id="ua-tload-${tabName}" style="display:none;">
                <span class="ua-tab-loading-dot"></span> Cargando...
            </span>
        </div>
        <div class="ua-tab-filters-row">
            <div class="ua-tab-search-wrap">
                <i class="bi bi-search ua-tab-search-icon"></i>
                <input type="text" class="ua-tab-search" data-tab="${tabName}" placeholder="Buscar..." value="${_esc(st.q)}" autocomplete="off">
            </div>
            <select class="ua-tab-filter" data-tab="${tabName}" data-field="fMerc">
                <option value="">Todos los mercaderistas</option>
                ${mercs.map(m=>`<option value="${_esc(m)}" ${st.fMerc===m?'selected':''}>${_esc(m)}</option>`).join('')}
            </select>
            <select class="ua-tab-filter" data-tab="${tabName}" data-field="fCliente">
                <option value="">Todos los clientes</option>
                ${clientes.map(c=>`<option value="${_esc(c)}" ${st.fCliente===c?'selected':''}>${_esc(c)}</option>`).join('')}
            </select>
            <select class="ua-tab-filter" data-tab="${tabName}" data-field="fPdv">
                <option value="">Todos los PDVs</option>
                ${pdvs.map(p=>`<option value="${_esc(p)}" ${st.fPdv===p?'selected':''}>${_esc(p)}</option>`).join('')}
            </select>
            ${opts && opts.showEstado ? `
            <select class="ua-tab-filter" data-tab="${tabName}" data-field="fEstado">
                <option value="">Todos los estados</option>
                <option value="activo" ${st.fEstado==='activo'?'selected':''}>⚡ Activo ahora</option>
                <option value="completa" ${st.fEstado==='completa'?'selected':''}>✅ Completa</option>
                <option value="solo_salida" ${st.fEstado==='solo_salida'?'selected':''}>⚠️ Solo salida</option>
            </select>` : ''}
            <button class="ua-tab-clear" data-tab="${tabName}" title="Limpiar filtros"><i class="bi bi-x-lg"></i></button>
        </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════════
// RENDER TABS
// ════════════════════════════════════════════════════════════════
function _renderTab() {
    switch (uaVistaActiva) {
        case 'dashboard':     return _tabDashboard();
        case 'mercaderistas': return _tabMercaderistas();
        case 'gestion':       return _tabGestion();
        case 'pendientes':    return _tabPendientes();
        case 'lista':         return _tabLista();
        default:              return _tabDashboard();
    }
}

// ── Obtener datos del tab según su período activo ────────────────
function _getTabActivaciones(tabName) {
    const p = uaTabState[tabName].periodo;
    const cached = uaCache[p];
    return cached ? (cached.activaciones || []) : allActivaciones;
}

function _applyTabFilters(data, st) {
    const q = (st.q||'').toLowerCase().trim();
    return data.filter(function(v) {
        if (q) {
            const s = [v.id_visita+'',v.mercaderista,v.cliente,v.punto_de_interes,v.ruta,v.ciudad].join(' ').toLowerCase();
            if (s.indexOf(q) === -1) return false;
        }
        if (st.fMerc    && v.mercaderista     !== st.fMerc)    return false;
        if (st.fCliente && v.cliente          !== st.fCliente) return false;
        if (st.fPdv     && v.punto_de_interes !== st.fPdv)     return false;
        if (st.fEstado  && v.estado_presencia !== st.fEstado)  return false;
        return true;
    });
}

// ── Dashboard ────────────────────────────────────────────────────
function _tabDashboard() {
    const st = uaTabState['dashboard'];
    const s  = uaStats;
    return `
    ${_tabToolbar('dashboard', {})}
    <div class="ua-desglose-grid">
        <div class="ua-desglose-panel">
            <div class="ua-dp-header">
                <div class="ua-dp-title"><i class="bi bi-geo-alt-fill"></i> Por Punto</div>
                <div class="ua-dp-tabs">
                    <button class="ua-dp-tab ${st.tabPunto==='act'?'ua-dp-tab-active':''}" id="ua-tab-punto-act"><i class="bi bi-play-circle"></i> Act.</button>
                    <button class="ua-dp-tab ${st.tabPunto==='com'?'ua-dp-tab-active':''}" id="ua-tab-punto-com"><i class="bi bi-check2-all"></i> Comp.</button>
                </div>
            </div>
            <div class="ua-dp-body" id="ua-dp-puntos">
                ${_buildBars(st.tabPunto==='act' ? (s.pp_activaciones||[]) : (s.pp_completas||[]))}
            </div>
        </div>
        <div class="ua-desglose-panel">
            <div class="ua-dp-header">
                <div class="ua-dp-title"><i class="bi bi-building-fill"></i> Por Cliente</div>
                <div class="ua-dp-tabs">
                    <button class="ua-dp-tab ${st.tabCliente==='act'?'ua-dp-tab-active':''}" id="ua-tab-cliente-act"><i class="bi bi-play-circle"></i> Act.</button>
                    <button class="ua-dp-tab ${st.tabCliente==='com'?'ua-dp-tab-active':''}" id="ua-tab-cliente-com"><i class="bi bi-check2-all"></i> Comp.</button>
                </div>
            </div>
            <div class="ua-dp-body" id="ua-dp-clientes">
                ${_buildBars(st.tabCliente==='act' ? (s.pc_activaciones||[]) : (s.pc_completas||[]))}
            </div>
        </div>
    </div>`;
}

// ── Mercaderistas ────────────────────────────────────────────────
function _tabMercaderistas() {
    const st  = uaTabState['mercaderistas'];
    const tabActs = _getTabActivaciones('mercaderistas');
    // Recalcular por_mercaderista con los datos del período del tab
    const mercMap = {};
    tabActs.forEach(function(v) {
        const k = v.mercaderista;
        if (!mercMap[k]) mercMap[k] = { nombre:k, id_mercaderista:v.id_mercaderista, total:0, activaciones:0, completas:0, activo_ahora:false, puntos:new Set(), clientes:new Set(), duraciones:[] };
        const d = mercMap[k];
        d.total++;
        if (v.id_foto_activacion)            d.activaciones++;
        if (v.estado_presencia === 'completa') d.completas++;
        if (v.estado_presencia === 'activo')   d.activo_ahora = true;
        d.puntos.add(v.punto_de_interes);
        d.clientes.add(v.cliente);
        if (v.duracion_minutos != null) d.duraciones.push(v.duracion_minutos);
    });
    const lista = Object.values(mercMap).map(d => ({
        nombre:d.nombre, id_mercaderista:d.id_mercaderista,
        total:d.total, activaciones:d.activaciones, completas:d.completas,
        pct_activacion: d.total ? Math.round(d.activaciones/d.total*100) : 0,
        pct_completas:  d.total ? Math.round(d.completas/d.total*100)    : 0,
        activo_ahora:d.activo_ahora,
        total_puntos:d.puntos.size, total_clientes:d.clientes.size,
        duracion_prom: d.duraciones.length ? Math.round(d.duraciones.reduce((a,b)=>a+b,0)/d.duraciones.length) : null,
    })).sort((a,b) => b.pct_activacion - a.pct_activacion);

    // Aplicar filtros del tab
    const q = (st.q||'').toLowerCase().trim();
    const filtered = lista.filter(function(m) {
        if (q && m.nombre.toLowerCase().indexOf(q) === -1) return false;
        if (st.fMerc && m.nombre !== st.fMerc) return false;
        if (st.fCliente) { if (!tabActs.some(v => v.id_mercaderista === m.id_mercaderista && v.cliente === st.fCliente)) return false; }
        if (st.fPdv)     { if (!tabActs.some(v => v.id_mercaderista === m.id_mercaderista && v.punto_de_interes === st.fPdv)) return false; }
        return true;
    });

    return `
    ${_tabToolbar('mercaderistas', {})}
    <div id="ua-merc-content">${_buildMercCards(filtered)}</div>`;
}

function _buildMercCards(list) {
    if (!list || !list.length) return `<div class="ua-dp-empty"><i class="bi bi-people"></i><span>Sin resultados</span></div>`;
    return `<div class="ua-merc-grid">${list.map(_mercCard).join('')}</div>`;
}

function _mercCard(m) {
    const actPct = m.pct_activacion, comPct = m.pct_completas;
    const actCls = actPct===100?'ua-bar-full':actPct>=60?'ua-bar-mid':actPct>=30?'ua-bar-low':'ua-bar-zero';
    const comCls = comPct===100?'ua-bar-full':comPct>=60?'ua-bar-mid':comPct>=30?'ua-bar-low':'ua-bar-zero';
    const actClr = actPct===100?'#28a745':actPct>=60?'#3a86ff':actPct>=30?'#e6a800':'#ff6b6b';
    const comClr = comPct===100?'#28a745':comPct>=60?'#3a86ff':comPct>=30?'#e6a800':'#ff6b6b';
    const durStr = m.duracion_prom ? _fmtDuracion(m.duracion_prom) : '—';
    const pend   = m.total - m.activaciones;
    return `
    <div class="ua-merc-card" data-merc-id="${m.id_mercaderista}" data-merc-nombre="${_esc(m.nombre)}">
        <div class="ua-merc-header">
            <div class="ua-merc-avatar">${m.nombre.charAt(0).toUpperCase()}</div>
            <div class="ua-merc-info">
                <div class="ua-merc-nombre">${_esc(m.nombre)} ${m.activo_ahora?'<span class="ua-merc-activo-badge"><span class="ua-pulse-dot-inline"></span> En punto</span>':''}</div>
                <div class="ua-merc-meta">
                    <span><i class="bi bi-geo-alt"></i> ${m.total_puntos} puntos</span>
                    <span><i class="bi bi-building"></i> ${m.total_clientes} cliente${m.total_clientes!==1?'s':''}</span>
                    <span><i class="bi bi-hourglass-split"></i> ${durStr}</span>
                </div>
            </div>
            <div class="ua-merc-nums">
                <div class="ua-merc-stat"><span class="ua-merc-big ua-color-act">${m.activaciones}</span><small>activó</small></div>
                <div class="ua-merc-stat"><span class="ua-merc-big ua-color-com">${m.completas}</span><small>completó</small></div>
                <div class="ua-merc-stat"><span class="ua-merc-big ua-color-pend">${pend}</span><small>pendiente</small></div>
            </div>
            <button class="ua-merc-ver-btn" data-merc-id="${m.id_mercaderista}" data-merc-nombre="${_esc(m.nombre)}" title="Ver 360°">
                <i class="bi bi-person-lines-fill"></i>
            </button>
        </div>
        <div class="ua-merc-bars">
            <div class="ua-merc-bar-row">
                <span class="ua-merc-bar-label">Activaciones</span>
                <div class="ua-dp-bar-wrap"><div class="ua-dp-bar ${actCls}" style="width:${actPct}%"></div></div>
                <span class="ua-merc-bar-pct" style="color:${actClr}">${actPct}%</span>
                <span class="ua-dp-cnt">${m.activaciones}/${m.total}</span>
            </div>
            <div class="ua-merc-bar-row">
                <span class="ua-merc-bar-label">Completas</span>
                <div class="ua-dp-bar-wrap"><div class="ua-dp-bar ${comCls}" style="width:${comPct}%"></div></div>
                <span class="ua-merc-bar-pct" style="color:${comClr}">${comPct}%</span>
                <span class="ua-dp-cnt">${m.completas}/${m.total}</span>
            </div>
        </div>
    </div>`;
}

// ── Gestión por Día ──────────────────────────────────────────────
function _tabGestion() {
    const gpd     = uaGestionPorDia;
    const toolbar = _tabToolbar('gestion', {});
    if (!gpd.fechas || !gpd.fechas.length) return toolbar + `<div class="ua-dp-empty"><i class="bi bi-table"></i><span>Sin datos</span></div>`;

    const st      = uaTabState['gestion'];
    const fechas  = gpd.fechas;
    const clientes = (gpd.clientes||[]).filter(r => !st.fCliente || r.cliente === st.fCliente);
    const headerCols = fechas.map(f => {
        const d = new Date(f+'T00:00:00');
        const dias = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
        return `<th class="ua-gpd-th">${dias[d.getDay()]}<br><small>${d.getDate()}/${d.getMonth()+1}</small></th>`;
    }).join('');
    const bodyRows = clientes.map(function(row) {
        const celdas = fechas.map(function(f) {
            const d = row.dias[f];
            if (!d) return `<td class="ua-gpd-td ua-gpd-empty">—</td>`;
            const cls = d.pct===100?'ua-gpd-full':d.pct>=60?'ua-gpd-mid':d.pct>=30?'ua-gpd-low':'ua-gpd-zero';
            return `<td class="ua-gpd-td ${cls}" title="${d.pct}%">${d.label}</td>`;
        }).join('');
        return `<tr><td class="ua-gpd-cliente">${_esc(row.cliente)}</td>${celdas}</tr>`;
    }).join('');
    const totalCeldas = fechas.map(function(f) {
        let tot=0,eje=0;
        clientes.forEach(r=>{const d=r.dias[f];if(d){tot+=d.total;eje+=d.ejecutadas;}});
        if (!tot) return `<td class="ua-gpd-td ua-gpd-total">—</td>`;
        const pct=Math.round(eje/tot*100);
        const cls=pct===100?'ua-gpd-full':pct>=60?'ua-gpd-mid':pct>=30?'ua-gpd-low':'ua-gpd-zero';
        return `<td class="ua-gpd-td ua-gpd-total ${cls}">${eje}/${tot}</td>`;
    }).join('');
    return `
    ${toolbar}
    <div class="ua-gpd-wrap">
        <div class="ua-gpd-title"><i class="bi bi-table"></i> Gestión por Día — últimos 7 días</div>
        <div class="ua-gpd-scroll">
            <table class="ua-gpd-table">
                <thead><tr><th class="ua-gpd-th ua-gpd-th-cliente">Cliente</th>${headerCols}</tr></thead>
                <tbody>${bodyRows}<tr class="ua-gpd-total-row"><td class="ua-gpd-cliente ua-gpd-total"><strong>Total</strong></td>${totalCeldas}</tr></tbody>
            </table>
        </div>
    </div>`;
}

// ── Pendientes ────────────────────────────────────────────────────
function _tabPendientes() {
    const st      = uaTabState['pendientes'];
    const tabPeriodo = st.periodo;
    // Usar pendientes del servidor si están en caché, sino calcular desde activaciones
    const cachedRes = uaCache[tabPeriodo];
    const tabPend = cachedRes && cachedRes.pendientes
        ? cachedRes.pendientes
        : _calcPendientes(_getTabActivaciones('pendientes'));

    const q = (st.q||'').toLowerCase();
    const data = tabPend.filter(function(p) {
        if (q && [p.mercaderista,p.cliente,p.punto_de_interes,p.ciudad].join(' ').toLowerCase().indexOf(q)===-1) return false;
        if (st.fMerc    && p.mercaderista     !== st.fMerc)    return false;
        if (st.fCliente && p.cliente          !== st.fCliente) return false;
        if (st.fPdv     && p.punto_de_interes !== st.fPdv)     return false;
        return true;
    });

    const toolbar = _tabToolbar('pendientes', {});
    if (!data.length) {
        return toolbar + `<div class="ua-dp-empty" style="padding:3rem;">
            <i class="bi bi-check-circle-fill" style="color:#28a745;font-size:3rem;opacity:.5;"></i>
            <span style="margin-top:.75rem;font-size:1rem;font-weight:600;color:#28a745;">¡Todo ejecutado!</span>
        </div>`;
    }

    const porMerc = {};
    data.forEach(p => { if (!porMerc[p.mercaderista]) porMerc[p.mercaderista]=[]; porMerc[p.mercaderista].push(p); });
    const bloques = Object.keys(porMerc).sort().map(function(merc) {
        const items = porMerc[merc];
        const filas = items.map(p => `
            <tr>
                <td class="ua-pend-td">${_esc(p.cliente)}</td>
                <td class="ua-pend-td">${_esc(p.punto_de_interes)}</td>
                <td class="ua-pend-td ua-pend-city">${_esc(p.ciudad)}</td>
                <td class="ua-pend-td ua-pend-ruta">${_esc(p.ruta)}</td>
            </tr>`).join('');
        const mId = items[0].id_mercaderista;
        return `
        <div class="ua-pend-grupo">
            <div class="ua-pend-merc-header">
                <div class="ua-merc-avatar ua-pend-avatar">${merc.charAt(0).toUpperCase()}</div>
                <span>${_esc(merc)}</span>
                <span class="ua-pend-count">${items.length} pendiente${items.length!==1?'s':''}</span>
                <button class="ua-pend-ver-merc ua-merc-ver-btn" data-merc-id="${mId}" data-merc-nombre="${_esc(merc)}" title="Ver 360°"><i class="bi bi-person-lines-fill"></i></button>
            </div>
            <table class="ua-pend-table">
                <thead><tr><th>Cliente</th><th>Punto</th><th>Ciudad</th><th>Ruta</th></tr></thead>
                <tbody>${filas}</tbody>
            </table>
        </div>`;
    }).join('');
    return `
    ${toolbar}
    <div class="ua-pend-header-bar">
        <i class="bi bi-exclamation-circle-fill" style="color:#ff6b6b;"></i>
        <strong>${data.length}</strong> PDVs sin activar
    </div>
    <div class="ua-pend-container">${bloques}</div>`;
}

// ── Lista ────────────────────────────────────────────────────────
function _tabLista() {
    const st   = uaTabState['lista'];
    const data = _applyTabFilters(_getTabActivaciones('lista'), st);
    return `
    ${_tabToolbar('lista', { showEstado: true })}
    <div class="ua-list" id="ua-list">${_buildCards(data)}</div>`;
}

// ════════════════════════════════════════════════════════════════
// MODAL MERCADERISTA 360°  — FIX BUG 3
// ════════════════════════════════════════════════════════════════
window.uaAbrirMercaderista = function(mercId, mercNombre, periodoInicial) {
    mercId   = parseInt(mercId);
    const nombre = mercNombre || 'Mercaderista';
    let periodo360 = periodoInicial || 'hoy';
    // Datos que usa el modal — se actualizan según período
    let modal360Data = uaCache[uaPeriodoGlobal] || { activaciones: allActivaciones };

    function _renderInner() {
        const visitas = (modal360Data.activaciones || []).filter(v => v.id_mercaderista === mercId);
        const total    = visitas.length;
        const conAct   = visitas.filter(v => v.id_foto_activacion).length;
        const completas = visitas.filter(v => v.estado_presencia === 'completa').length;
        const activoAhora = visitas.some(v => v.estado_presencia === 'activo');
        const durs     = visitas.filter(v => v.duracion_minutos != null).map(v => v.duracion_minutos);
        const durProm  = durs.length ? Math.round(durs.reduce((a,b)=>a+b)/durs.length) : null;
        const pctAct   = total ? Math.round(conAct/total*100) : 0;
        const pctCom   = total ? Math.round(completas/total*100) : 0;
        // Pendientes del servidor para este mercaderista (incluye visitas sin fotos)
        const pendData  = (modal360Data.pendientes || []).filter(p => p.id_mercaderista === mercId);
        const pend      = pendData.length || (total - conAct);
        const actClr   = pctAct===100?'#28a745':pctAct>=60?'#3a86ff':pctAct>=30?'#e6a800':'#ff6b6b';
        const comClr   = pctCom===100?'#28a745':pctCom>=60?'#3a86ff':pctCom>=30?'#e6a800':'#ff6b6b';

        // Agrupar por cliente + punto
        const grupos = {};
        visitas.forEach(function(v) {
            const k = v.cliente + '||' + v.punto_de_interes;
            if (!grupos[k]) grupos[k] = { cliente:v.cliente, punto:v.punto_de_interes, ciudad:v.ciudad, visitas:[] };
            grupos[k].visitas.push(v);
        });

        const gruposHtml = Object.values(grupos).map(function(g) {
            const u = g.visitas[0];
            const tieneAct = !!u.id_foto_activacion, tieneDes = !!u.id_foto_desactivacion;
            const pClass = u.estado_presencia==='completa'?'ua-p-completa':u.estado_presencia==='activo'?'ua-p-activo':'ua-p-solo_salida';
            const horaAct = u.fecha_activacion    ? _fmtHora(u.fecha_activacion)    : '—';
            const horaDes = u.fecha_desactivacion ? _fmtHora(u.fecha_desactivacion) : '—';
            const durStr  = u.duracion_minutos != null ? _fmtDuracion(u.duracion_minutos) : '—';
            const thumbAct = tieneAct
                ? `<div class="ua-360-thumb" onclick="window.uaVerFoto(${u.id_visita},5)"><img src="${window.getImageUrl(u.file_path_activacion)}" loading="lazy"><div class="ua-360-thumb-label">Entrada ${horaAct}</div></div>`
                : `<div class="ua-360-thumb ua-360-thumb-empty"><i class="bi bi-play-circle"></i><span>Sin entrada</span></div>`;
            const thumbDes = tieneDes
                ? `<div class="ua-360-thumb" onclick="window.uaVerFoto(${u.id_visita},6)"><img src="${window.getImageUrl(u.file_path_desactivacion)}" loading="lazy"><div class="ua-360-thumb-label">Salida ${horaDes}</div></div>`
                : `<div class="ua-360-thumb ua-360-thumb-empty"><i class="bi bi-stop-circle"></i><span>${u.estado_presencia==='activo'?'En punto':'Sin salida'}</span></div>`;
            return `
            <div class="ua-360-grupo ${pClass}">
                <div class="ua-360-grupo-header">
                    <div class="ua-360-grupo-info">
                        <div class="ua-360-grupo-cliente"><i class="bi bi-building"></i> ${_esc(g.cliente)}</div>
                        <div class="ua-360-grupo-punto"><i class="bi bi-geo-alt"></i> ${_esc(g.punto)} ${g.ciudad?`<span class="ua-360-city">· ${_esc(g.ciudad)}</span>`:''}</div>
                    </div>
                    <div class="ua-360-grupo-dur"><i class="bi bi-hourglass-split"></i> ${durStr}</div>
                    <span class="ua-badge-presencia ${pClass}" style="font-size:.65rem;">${u.estado_presencia==='completa'?'✅ Completa':u.estado_presencia==='activo'?'⚡ Activo':'⚠️ Solo salida'}</span>
                    <button class="uv-action-btn uv-act-chat ${u.mensajes_no_leidos>0?'uv-has-msgs':''}" onclick="window.uvOpenChat(${u.id_visita})" title="Chat" style="width:32px;height:32px;"><i class="bi bi-chat-dots" style="font-size:.8rem;"></i>${u.mensajes_no_leidos>0?`<span class="uv-chat-dot">${u.mensajes_no_leidos}</span>`:''}</button>
                </div>
                <div class="ua-360-thumbs">
                    ${thumbAct}
                    <div class="ua-thumb-arrow"><i class="bi bi-arrow-right"></i></div>
                    ${thumbDes}
                </div>
            </div>`;
        }).join('');

        const periodosBtns = [
            {v:'hoy',l:'Hoy'},{v:'semana',l:'Semana'},{v:'mes',l:'Mes'},{v:'anio',l:'Año'},
        ].map(p => `<button class="ua-360-periodo-btn ${periodo360===p.v?'ua-360-periodo-active':''}" data-p360="${p.v}">${p.l}</button>`).join('');

        return `
        <div class="ua-360-header d-flex align-items-center gap-3 p-4">
            <div class="ua-merc-avatar ua-360-avatar">${nombre.charAt(0).toUpperCase()}</div>
            <div class="flex-1">
                <h5 class="mb-0" style="color:#fff;">${_esc(nombre)} ${activoAhora?'<span class="ua-merc-activo-badge ms-2"><span class="ua-pulse-dot-inline"></span> En punto</span>':''}</h5>
                <small style="color:rgba(255,255,255,.6);">${total} visitas · ${_labelFor(periodo360)}</small>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="ua-360-periodo-bar">
            <span style="font-size:.75rem;font-weight:700;color:var(--text-muted);">Ver período:</span>
            ${periodosBtns}
            <span id="ua-360-loading" style="display:none;font-size:.75rem;color:var(--text-muted);"><span class="ua-tab-loading-dot"></span> Cargando...</span>
        </div>
        <div class="ua-360-stats">
            <div class="ua-360-stat"><div class="ua-360-stat-num">${total}</div><div class="ua-360-stat-label">Visitas</div></div>
            <div class="ua-360-stat"><div class="ua-360-stat-num ua-color-act">${conAct}</div><div class="ua-360-stat-label">Activó</div></div>
            <div class="ua-360-stat"><div class="ua-360-stat-num ua-color-com">${completas}</div><div class="ua-360-stat-label">Completó</div></div>
            <div class="ua-360-stat"><div class="ua-360-stat-num ua-color-pend">${pend}</div><div class="ua-360-stat-label">Pendiente</div></div>
            <div class="ua-360-stat">
                <div class="ua-360-stat-num" style="color:${actClr}">${pctAct}%</div>
                <div class="ua-prog-bar-outer" style="width:80px;"><div class="ua-prog-bar-inner ua-prog-act" style="width:${pctAct}%"></div></div>
                <div class="ua-360-stat-label">Activación</div>
            </div>
            <div class="ua-360-stat">
                <div class="ua-360-stat-num" style="color:${comClr}">${pctCom}%</div>
                <div class="ua-prog-bar-outer" style="width:80px;"><div class="ua-prog-bar-inner ua-prog-com" style="width:${pctCom}%"></div></div>
                <div class="ua-360-stat-label">Completas</div>
            </div>
            <div class="ua-360-stat"><div class="ua-360-stat-num">${durProm?_fmtDuracion(durProm):'—'}</div><div class="ua-360-stat-label">Prom.</div></div>
        </div>
        <div class="ua-360-grupos" id="ua-360-grupos">
            ${gruposHtml || `<div class="ua-dp-empty"><i class="bi bi-inbox"></i><span>Sin visitas ejecutadas en este período</span></div>`}
            ${pendData.length > 0 ? `
            <div class="ua-360-pend-section">
                <div class="ua-360-pend-title"><i class="bi bi-exclamation-circle-fill" style="color:#ff6b6b;"></i> ${pendData.length} PDV${pendData.length!==1?'s':''} pendiente${pendData.length!==1?'s':''}</div>
                ${pendData.map(p => `
                <div class="ua-360-pend-row">
                    <div><span class="ua-360-pend-cliente">${_esc(p.cliente)}</span> · <span class="ua-360-pend-punto">${_esc(p.punto_de_interes)}</span></div>
                    <span class="ua-360-pend-city">${_esc(p.ciudad)}</span>
                </div>`).join('')}
            </div>` : ''}
        </div>`;
    }

    // Crear modal
    let $m = $('#ua360Modal');
    if ($m.length) { try { bootstrap.Modal.getInstance($m[0])?.dispose(); } catch(e){} $m.remove(); }
    $('.modal-backdrop').remove(); $('body').removeClass('modal-open').css('overflow','');

    $m = $(`<div class="modal fade" id="ua360Modal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content ua-modal-content" id="ua360Inner"></div>
        </div>
    </div>`);
    $('body').append($m);
    $('#ua360Inner').html(_renderInner());

    // FIX: handler nombrado para poder re-usarlo sin arguments.callee
    function _on360Periodo() {
        const p = $(this).data('p360');
        if (p === periodo360) return;
        periodo360 = p;
        // Mostrar spinner inmediato
        $(this).closest('.ua-360-periodo-bar').find('[data-p360]').removeClass('ua-360-periodo-active');
        $(this).addClass('ua-360-periodo-active');
        $('#ua-360-loading').show();
        _fetchAndStore(p, function(res) {
            modal360Data = res;
            $('#ua360Inner').html(_renderInner());
            // Re-bind después de re-render (el DOM cambió)
            $('#ua360Inner').off('click', '[data-p360]').on('click', '[data-p360]', _on360Periodo);
        });
    }
    // Usar delegación en #ua360Inner para sobrevivir al re-render
    $('#ua360Inner').on('click', '[data-p360]', _on360Periodo);

    new bootstrap.Modal($m[0], { backdrop: true, keyboard: true }).show();
};

// ════════════════════════════════════════════════════════════════
// BARRAS + TARJETAS
// ════════════════════════════════════════════════════════════════
function _buildBars(items) {
    if (!items || !items.length) return `<div class="ua-dp-empty"><i class="bi bi-inbox"></i><span>Sin datos</span></div>`;
    return items.map(function(item) {
        const pct = item.porcentaje || 0;
        const cls = pct===100?'ua-bar-full':pct>=60?'ua-bar-mid':pct>=30?'ua-bar-low':'ua-bar-zero';
        const clr = pct===100?'#28a745':pct>=60?'#3a86ff':pct>=30?'#e6a800':'#ff6b6b';
        return `<div class="ua-dp-row">
            <div class="ua-dp-name" title="${_esc(item.nombre)}">${_esc(item.nombre)}</div>
            <div class="ua-dp-bar-wrap"><div class="ua-dp-bar ${cls}" style="width:${pct}%"></div></div>
            <div class="ua-dp-pct" style="color:${clr}">${pct}%</div>
            <div class="ua-dp-cnt">${item.con}/${item.total}</div>
        </div>`;
    }).join('');
}

function _buildCards(list) {
    if (!list||!list.length) return `<div class="uv-no-results"><i class="bi bi-lightning-charge" style="font-size:3rem;opacity:.25;"></i><p style="color:var(--text-muted);margin-top:1rem;">Sin activaciones</p></div>`;
    return list.map(_card).join('');
}

function _card(v) {
    const tieneAct = v.id_foto_activacion   != null;
    const tieneDes = v.id_foto_desactivacion != null;
    const activo   = tieneAct && !tieneDes;
    const pClass   = v.estado_presencia==='completa'?'ua-p-completa':v.estado_presencia==='activo'?'ua-p-activo':'ua-p-solo_salida';
    const pLabel   = v.estado_presencia==='completa'?'<i class="bi bi-check-circle-fill"></i> Completa':v.estado_presencia==='activo'?'<i class="bi bi-person-fill-up"></i> Activo':'<i class="bi bi-exclamation-circle-fill"></i> Solo salida';
    const durStr   = v.duracion_minutos!=null?_fmtDuracion(v.duracion_minutos):null;
    const horaAct  = v.fecha_activacion    ?_fmtHora(v.fecha_activacion):null;
    const horaDes  = v.fecha_desactivacion ?_fmtHora(v.fecha_desactivacion):null;
    const thumbAct = tieneAct
        ?`<div class="ua-thumb ua-thumb-act" onclick="window.uaVerFoto(${v.id_visita},5)"><img src="${window.getImageUrl(v.file_path_activacion)}" loading="lazy"><div class="ua-thumb-label"><i class="bi bi-play-circle-fill"></i>${horaAct||''}</div></div>`
        :`<div class="ua-thumb ua-thumb-empty"><i class="bi bi-play-circle"></i><span>Sin entrada</span></div>`;
    const thumbDes = tieneDes
        ?`<div class="ua-thumb ua-thumb-des" onclick="window.uaVerFoto(${v.id_visita},6)"><img src="${window.getImageUrl(v.file_path_desactivacion)}" loading="lazy"><div class="ua-thumb-label"><i class="bi bi-stop-circle-fill"></i>${horaDes||''}</div></div>`
        :`<div class="ua-thumb ua-thumb-empty">${activo?'<i class="bi bi-door-open" style="color:#ffc107;"></i><span style="color:#ffc107;">En punto</span>':'<i class="bi bi-stop-circle"></i><span>Sin salida</span>'}</div>`;
    return `
    <div class="ua-card ${pClass}">
        <div class="ua-card-estado"><span class="ua-badge-presencia ${pClass}">${pLabel}</span>${activo?'<span class="ua-pulse-dot"></span>':''}</div>
        <div class="ua-card-info">
            <div class="ua-card-primary">
                <span class="ua-merc-name ua-merc-clickable-inline" data-merc-id="${v.id_mercaderista}" data-merc-nombre="${_esc(v.mercaderista)}">${_esc(v.mercaderista)}</span>
                <span class="uv-sep">·</span>
                <span class="ua-client-name">${_esc(v.cliente)}</span>
            </div>
            <div class="ua-card-secondary">
                <span><i class="bi bi-geo-alt-fill"></i> ${_esc(v.punto_de_interes)}</span>
                <span><i class="bi bi-signpost-2"></i> ${_esc(v.ruta)}</span>
                ${v.ciudad?`<span><i class="bi bi-building"></i> ${_esc(v.ciudad)}</span>`:''}
                ${durStr?`<span class="ua-duracion"><i class="bi bi-hourglass-split"></i> ${durStr}</span>`:''}
            </div>
        </div>
        <div class="ua-card-thumbs">${thumbAct}<div class="ua-thumb-arrow"><i class="bi bi-arrow-right"></i></div>${thumbDes}</div>
        <div class="ua-card-actions">
            <button class="uv-action-btn uv-act-chat ${v.mensajes_no_leidos>0?'uv-has-msgs':''}" onclick="window.uvOpenChat(${v.id_visita})" title="Chat"><i class="bi bi-chat-dots"></i>${v.mensajes_no_leidos>0?`<span class="uv-chat-dot">${v.mensajes_no_leidos}</span>`:''}</button>
            <button class="uv-action-btn ua-act-detail" onclick="window.uaVerDetalle(${v.id_visita})" title="Detalle"><i class="bi bi-eye"></i></button>
        </div>
    </div>`;
}

// ════════════════════════════════════════════════════════════════
// EVENTOS
// ════════════════════════════════════════════════════════════════
function _bindEvents() {
    // Refresh
    $('#ua-refresh-btn').off('click').on('click', function() {
        Object.keys(uaCache).forEach(k => delete uaCache[k]);
        loadUnifiedActivaciones();
    });

    // Cambio de vista
    $(document).off('click.ua-vista','[data-vista]').on('click.ua-vista','[data-vista]', function() {
        uaVistaActiva = $(this).data('vista');
        _render();
    });

    // Período global — botones
    $(document).off('click.ua-gp','[data-gperiodo]').on('click.ua-gp','[data-gperiodo]', function() {
        const p = $(this).data('gperiodo');
        if (p === uaPeriodoGlobal) return;
        uaPeriodoGlobal = p;
        // FIX BUG 2: spinner en hero mientras carga, sin bloquear toda la UI
        $('#content-area .ua-hero-stats').css('opacity','0.5');
        _fetchAndStore(p, function(res) {
            _applyGlobalData(res);
            _render();
        });
    });

    // Período global — selects
    $(document).off('change.ua-gs','[data-gperiodo-sel]').on('change.ua-gs','[data-gperiodo-sel]', function() {
        const val = $(this).val(); if (!val) return;
        uaPeriodoGlobal = val;
        _fetchAndStore(val, function(res) { _applyGlobalData(res); _render(); });
    });

    // Período por tab — con caché FIX BUG 2
    $(document).off('click.ua-tp','[data-tperiodo]').on('click.ua-tp','[data-tperiodo]', function(e) {
        e.stopPropagation();
        const tab = $(this).data('tab'), p = $(this).data('tperiodo');
        if (uaTabState[tab].periodo === p) return;
        uaTabState[tab].periodo = p;
        $(`[data-toolbar="${tab}"] [data-tperiodo]`).removeClass('ua-tab-periodo-active');
        $(this).addClass('ua-tab-periodo-active');
        $('#ua-tload-'+tab).show();
        _fetchAndStore(p, function() {
            $('#ua-tload-'+tab).hide();
            // Limpiar filtros dependientes del período
            uaTabState[tab].fMerc = '';
            uaTabState[tab].fCliente = '';
            uaTabState[tab].fPdv = '';
            if (uaVistaActiva === tab) {
                $('#ua-view-content').html(_renderTab());
                _bindTabEvents();
            }
        });
    });

    _bindTabEvents();
}

function _bindTabEvents() {
    // Búsqueda
    $(document).off('input.ua-ts','.ua-tab-search').on('input.ua-ts','.ua-tab-search', function() {
        const tab = $(this).data('tab');
        uaTabState[tab].q = $(this).val();
        clearTimeout(uaSearchTimeout);
        uaSearchTimeout = setTimeout(function() { if (uaVistaActiva === tab) { $('#ua-view-content').html(_renderTab()); _bindTabEvents(); } }, 300);
    });

    // Filtros
    $(document).off('change.ua-tf','.ua-tab-filter').on('change.ua-tf','.ua-tab-filter', function() {
        const tab = $(this).data('tab'), field = $(this).data('field');
        uaTabState[tab][field] = $(this).val();
        if (uaVistaActiva === tab) { $('#ua-view-content').html(_renderTab()); _bindTabEvents(); }
    });

    // Limpiar
    $(document).off('click.ua-tc','.ua-tab-clear').on('click.ua-tc','.ua-tab-clear', function() {
        const tab = $(this).data('tab');
        Object.assign(uaTabState[tab], { q:'', fMerc:'', fCliente:'', fPdv:'', fEstado:'' });
        if (uaVistaActiva === tab) { $('#ua-view-content').html(_renderTab()); _bindTabEvents(); }
    });

    // Dashboard — subtabs punto/cliente
    $(document).off('click.ua-dp','#ua-tab-punto-act,#ua-tab-punto-com').on('click.ua-dp','#ua-tab-punto-act,#ua-tab-punto-com', function() {
        const t = this.id==='ua-tab-punto-act'?'act':'com';
        uaTabState['dashboard'].tabPunto = t;
        $('#ua-tab-punto-act,#ua-tab-punto-com').removeClass('ua-dp-tab-active'); $(this).addClass('ua-dp-tab-active');
        $('#ua-dp-puntos').html(_buildBars(t==='act'?(uaStats.pp_activaciones||[]):(uaStats.pp_completas||[])));
    });
    $(document).off('click.ua-dc','#ua-tab-cliente-act,#ua-tab-cliente-com').on('click.ua-dc','#ua-tab-cliente-act,#ua-tab-cliente-com', function() {
        const t = this.id==='ua-tab-cliente-act'?'act':'com';
        uaTabState['dashboard'].tabCliente = t;
        $('#ua-tab-cliente-act,#ua-tab-cliente-com').removeClass('ua-dp-tab-active'); $(this).addClass('ua-dp-tab-active');
        $('#ua-dp-clientes').html(_buildBars(t==='act'?(uaStats.pc_activaciones||[]):(uaStats.pc_completas||[])));
    });

    // Click en mercaderista (tarjeta, botón, nombre en lista, pendientes)
    $(document).off('click.ua-m','.ua-merc-ver-btn,.ua-merc-clickable-inline').on('click.ua-m','.ua-merc-ver-btn,.ua-merc-clickable-inline', function(e) {
        e.stopPropagation();
        window.uaAbrirMercaderista($(this).data('merc-id'), $(this).data('merc-nombre'), 'hoy');
    });
}

// ════════════════════════════════════════════════════════════════
// MODAL DETALLE VISITA
// ════════════════════════════════════════════════════════════════
window.uaVerDetalle = function(visitId) {
    const v = allActivaciones.find(x => x.id_visita === visitId);
    if (!v) return;
    const tieneAct = !!v.id_foto_activacion, tieneDes = !!v.id_foto_desactivacion;
    const durStr = v.duracion_minutos!=null?_fmtDuracion(v.duracion_minutos):'—';
    function panelFoto(tiene,fp,fecha,tipo) {
        const icon=tipo==='entrada'?'bi-play-circle-fill':'bi-stop-circle-fill';
        const color=tipo==='entrada'?'#28a745':'#dc3545';
        if (!tiene) return `<div class="ua-detail-nofoto"><i class="bi ${icon}" style="font-size:2.5rem;opacity:.3;color:${color};"></i><p>Sin foto de ${tipo}</p>${tipo==='salida'&&tieneAct?'<p class="ua-activo-label">⚡ Aún en punto</p>':''}</div>`;
        return `<div class="ua-detail-foto"><img src="${window.getImageUrl(fp)}" class="img-fluid rounded shadow-sm" style="max-height:320px;object-fit:contain;cursor:pointer;" onclick="window.open('${window.getImageUrl(fp)}','_blank')">${fecha?`<div class="ua-foto-ts"><i class="bi bi-clock"></i> ${_fmtFechaHora(fecha)}</div>`:''}</div>`;
    }
    const presLabels = {completa:'✅ Completa',activo:'⚡ Activo ahora',solo_salida:'⚠️ Solo salida'};
    const html = `<div class="modal-dialog modal-xl modal-dialog-centered"><div class="modal-content ua-modal-content">
        <div class="modal-header ua-360-header">
            <div>
                <h5 class="modal-title mb-1" style="color:#fff;"><i class="bi bi-lightning-charge-fill text-warning me-2"></i>Visita #${v.id_visita}</h5>
                <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.35rem;">
                    <span class="badge bg-light text-dark">${_esc(v.mercaderista)}</span>
                    <span class="badge bg-primary">${_esc(v.cliente)}</span>
                    <span class="badge bg-secondary">${_esc(v.punto_de_interes)}</span>
                    <span class="badge ${v.estado_presencia==='activo'?'bg-warning text-dark':v.estado_presencia==='completa'?'bg-success':'bg-danger'}">${presLabels[v.estado_presencia]||''}</span>
                </div>
            </div>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body p-4">
            <div class="ua-detail-meta row g-3 mb-4">
                <div class="col-6 col-md-3"><div class="ua-meta-chip"><i class="bi bi-signpost-2"></i><div><small>Ruta</small><strong>${_esc(v.ruta)}</strong></div></div></div>
                <div class="col-6 col-md-3"><div class="ua-meta-chip"><i class="bi bi-geo-alt"></i><div><small>Ciudad</small><strong>${_esc(v.ciudad||'N/A')}</strong></div></div></div>
                <div class="col-6 col-md-3"><div class="ua-meta-chip"><i class="bi bi-hourglass-split"></i><div><small>Duración</small><strong>${durStr}</strong></div></div></div>
                <div class="col-6 col-md-3"><div class="ua-meta-chip"><i class="bi bi-person-lines-fill"></i><div><small>Analista</small><strong>${_esc(v.analista||'N/A')}</strong></div></div></div>
            </div>
            ${tieneAct&&tieneDes?`<div class="ua-timeline mb-4"><div class="ua-tl-node ua-tl-entrada"><div class="ua-tl-dot"></div><div class="ua-tl-content"><span class="ua-tl-label">Entrada</span><span class="ua-tl-time">${_fmtHora(v.fecha_activacion)}</span></div></div><div class="ua-tl-line"></div><div class="ua-tl-center"><i class="bi bi-hourglass-split"></i><span>${durStr}</span></div><div class="ua-tl-line"></div><div class="ua-tl-node ua-tl-salida"><div class="ua-tl-dot"></div><div class="ua-tl-content"><span class="ua-tl-label">Salida</span><span class="ua-tl-time">${_fmtHora(v.fecha_desactivacion)}</span></div></div></div>`:''}
            <div class="row g-4">
                <div class="col-md-6"><h6 class="mb-3"><span class="badge bg-success me-2"><i class="bi bi-play-circle-fill"></i></span>Entrada</h6>${panelFoto(tieneAct,v.file_path_activacion,v.fecha_activacion,'entrada')}</div>
                <div class="col-md-6"><h6 class="mb-3"><span class="badge bg-danger me-2"><i class="bi bi-stop-circle-fill"></i></span>Salida</h6>${panelFoto(tieneDes,v.file_path_desactivacion,v.fecha_desactivacion,'salida')}</div>
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline-secondary btn-sm" onclick="window.uvOpenChat(${v.id_visita})"><i class="bi bi-chat-dots"></i> Chat ${v.mensajes_no_leidos>0?`<span class="badge bg-danger ms-1">${v.mensajes_no_leidos}</span>`:''}</button>
            <button class="btn btn-outline-primary btn-sm" onclick="window.uaAbrirMercaderista(${v.id_mercaderista},'${_esc(v.mercaderista)}','hoy')"><i class="bi bi-person-lines-fill"></i> Ver mercaderista</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
        </div>
    </div></div>`;
    let $m=$('#uaDetalleModal'); if($m.length){try{bootstrap.Modal.getInstance($m[0])?.dispose();}catch(e){}$m.remove();}
    $('.modal-backdrop').remove();$('body').removeClass('modal-open').css('overflow','');
    $m=$('<div class="modal fade" id="uaDetalleModal" tabindex="-1" aria-hidden="true"></div>');
    $('body').append($m);$m.html(html);
    new bootstrap.Modal($m[0],{backdrop:true,keyboard:true}).show();
};

window.uaVerFoto = function(visitId, tipo) {
    const allData = Object.values(uaCache).flatMap(r => r.activaciones||[]);
    const v = allData.find(x=>x.id_visita===visitId) || allActivaciones.find(x=>x.id_visita===visitId);
    if (!v) return;
    const fp=tipo===5?v.file_path_activacion:v.file_path_desactivacion;
    const fecha=tipo===5?v.fecha_activacion:v.fecha_desactivacion;
    if (!fp) return;
    Swal.fire({
        title:tipo===5?'Entrada':'Salida',
        html:`<img src="${window.getImageUrl(fp)}" style="max-width:100%;max-height:70vh;object-fit:contain;border-radius:8px;">${fecha?`<p class="mt-2 text-muted small"><i class="bi bi-clock"></i> ${_fmtFechaHora(fecha)}</p>`:''}<p class="text-muted small">${_esc(v.mercaderista)} · ${_esc(v.cliente)}</p>`,
        showConfirmButton:false,showCloseButton:true,width:'80vw',
        background:'var(--card-bg)',color:'var(--text-primary)',
    });
};

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════
function _labelFor(p) {
    if (p==='hoy')    { const h=new Date().toLocaleDateString('es-VE',{weekday:'long',day:'numeric',month:'long'}); return 'Hoy · '+h.charAt(0).toUpperCase()+h.slice(1); }
    if (p==='semana') return 'Esta semana';
    if (p==='mes')    return 'Este mes';
    if (p==='anio')   return 'Este año';
    if (p.startsWith('mes:')) { const f=uaMesesDisponibles.find(x=>x.value===p.slice(4)); return f?f.label:p.slice(4); }
    if (p.startsWith('sem:')) { const f=uaSemanasDisponibles.find(x=>x.value===p.slice(4)); return f?f.label:p.slice(4); }
    return p;
}
function _currentISOWeek() {
    const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+4-(d.getDay()||7));
    const y=d.getFullYear(),w=Math.ceil(((d-new Date(y,0,1))/86400000+1)/7);
    return `${y}-W${String(w).padStart(2,'0')}`;
}
function _currentYearMonth() { const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }
function _fmt(n) { return n>=1000?(n/1000).toFixed(1).replace('.0','')+'mil':n; }
function _esc(str) { if(!str)return''; const d=document.createElement('div');d.textContent=str;return d.innerHTML; }
function _fmtHora(iso) { if(!iso)return''; try{return new Date(iso).toLocaleTimeString('es-VE',{hour:'2-digit',minute:'2-digit',hour12:false});}catch(e){return iso;} }
function _fmtFechaHora(iso) { if(!iso)return''; try{const d=new Date(iso);return d.toLocaleDateString('es-VE',{day:'2-digit',month:'2-digit',year:'numeric'})+' '+d.toLocaleTimeString('es-VE',{hour:'2-digit',minute:'2-digit',hour12:false});}catch(e){return iso;} }
function _fmtDuracion(min) { if(min<60)return`${min}min`;const h=Math.floor(min/60),m=min%60;return m>0?`${h}h${m}m`:`${h}h`; }
function _showError(msg) {
    $('#content-area').html(`<div class="ua-container"><div class="uv-empty-state">
        <i class="bi bi-exclamation-triangle" style="color:#ff6b6b;font-size:4rem;opacity:.5;"></i>
        <h4 style="color:var(--text-primary);margin-top:1rem;">Error</h4>
        <p style="color:var(--text-muted);">${msg}</p>
        <button class="btn btn-primary mt-3" id="ua-retry-btn"><i class="bi bi-arrow-clockwise"></i> Reintentar</button>
    </div></div>`);
    $('#ua-retry-btn').on('click', loadUnifiedActivaciones);
}