// ╔══════════════════════════════════════════════════════════════╗
// ║  /static/js/modules/unified-visits.js  v4                  ║
// ║  REEMPLAZAR el archivo anterior completo con este.         ║
// ╚══════════════════════════════════════════════════════════════╝

let allUnifiedVisits = [];
let filteredUnifiedVisits = [];
let unifiedSearchTimeout = null;
let uvStats = {};
let uvShowRevisadas = false;

/**
 * Función principal: carga y muestra el Centro de Mando
 */
export function loadUnifiedVisits() {
    const $content = $('#content-area');
    
    $content.html(`
        <div class="uv-container">
            <div class="uv-header-bar">
                <div class="d-flex align-items-center gap-3">
                    <div class="uv-icon-pulse">
                        <i class="bi bi-lightning-charge-fill"></i>
                    </div>
                    <div>
                        <h3 class="mb-0" style="color: var(--text-primary);">Centro de Mando</h3>
                        <small style="color: var(--text-muted);">Cargando visitas de la semana...</small>
                    </div>
                </div>
            </div>
            <div class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3" style="color: var(--text-muted);">Obteniendo todas las visitas...</p>
            </div>
        </div>
    `);
    
    const incluir = uvShowRevisadas ? '1' : '0';
    
    $.getJSON('/api/unified-pending-visits?incluir_revisadas=' + incluir)
        .done(function(response) {
            if (response.success) {
                allUnifiedVisits = response.visits || [];
                uvStats = response.stats || {};
                filteredUnifiedVisits = [...allUnifiedVisits];
                renderUnifiedView();
            } else {
                showUvError(response.error || 'Error desconocido');
            }
        })
        .fail(function() {
            showUvError('No se pudo conectar con el servidor');
        });
}

/**
 * Renderiza toda la vista
 */
function renderUnifiedView() {
    const $content = $('#content-area');
    
    // Usar stats que vienen del backend (calculados sin duplicados)
    const s = uvStats;
    
    // Extraer valores únicos para los selects de filtro
    const rutas = [...new Set(allUnifiedVisits.map(v => v.ruta).filter(Boolean))].sort();
    const puntos = [...new Set(allUnifiedVisits.map(v => v.punto_de_interes).filter(Boolean))].sort();
    const clientes = [...new Set(allUnifiedVisits.map(v => v.cliente).filter(Boolean))].sort();
    const mercaderistas = [...new Set(allUnifiedVisits.map(v => v.mercaderista).filter(Boolean))].sort();
    
    $content.html(`
        <div class="uv-container">
            <!-- HEADER -->
            <div class="uv-header-bar">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="uv-icon-pulse">
                            <i class="bi bi-lightning-charge-fill"></i>
                        </div>
                        <div>
                            <h3 class="mb-0" style="color: var(--text-primary);">Centro de Mando</h3>
                            <small style="color: var(--text-muted);">
                                ${s.total_visitas || 0} visita${(s.total_visitas || 0) !== 1 ? 's' : ''} pendiente${(s.total_visitas || 0) !== 1 ? 's' : ''} esta semana
                            </small>
                        </div>
                    </div>
                    <div class="d-flex gap-2 align-items-center">
                        <label class="uv-toggle-label" title="Incluir visitas ya revisadas">
                            <input type="checkbox" id="uv-toggle-revisadas" ${uvShowRevisadas ? 'checked' : ''}>
                            <span>Mostrar revisadas</span>
                        </label>
                        <button class="btn btn-sm uv-refresh-btn" id="uv-refresh-btn">
                            <i class="bi bi-arrow-clockwise"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
            
            <!-- STATS (datos del backend, sin duplicados) -->
            <div class="uv-stats-row">
                <div class="uv-stat-card">
                    <div class="uv-stat-number">${s.total_visitas || 0}</div>
                    <div class="uv-stat-label">Visitas</div>
                </div>
                <div class="uv-stat-card uv-stat-fotos">
                    <div class="uv-stat-number">${s.total_fotos || 0}</div>
                    <div class="uv-stat-label">Fotos totales</div>
                </div>
                <div class="uv-stat-card uv-stat-aprobadas">
                    <div class="uv-stat-number">${s.fotos_aprobadas || 0}</div>
                    <div class="uv-stat-label">Aprobadas</div>
                </div>
                <div class="uv-stat-card uv-stat-pendientes">
                    <div class="uv-stat-number">${s.sin_revisar || 0}</div>
                    <div class="uv-stat-label">Sin revisar</div>
                </div>
                <div class="uv-stat-card uv-stat-rechazadas">
                    <div class="uv-stat-number">${s.fotos_rechazadas || 0}</div>
                    <div class="uv-stat-label">Rechazadas</div>
                </div>
                <div class="uv-stat-card uv-stat-progreso">
                    <div class="uv-stat-number">${s.progreso_general || 0}%</div>
                    <div class="uv-stat-label">Progreso semanal</div>
                </div>
            </div>
            
            <!-- BÚSQUEDA + FILTROS -->
            <div class="uv-search-bar">
                <div class="uv-search-wrapper">
                    <i class="bi bi-search uv-search-icon"></i>
                    <input type="text" 
                           class="uv-search-input" 
                           id="uv-search" 
                           placeholder="Buscar visita, cliente, punto, mercaderista, ruta..."
                           autocomplete="off">
                    <span class="uv-search-count" id="uv-search-count">${filteredUnifiedVisits.length} resultados</span>
                </div>
                
                <div class="uv-filters-row">
                    <select class="uv-filter-select" id="uv-filter-ruta">
                        <option value="">Todas las rutas</option>
                        ${rutas.map(r => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="uv-filter-punto">
                        <option value="">Todos los puntos</option>
                        ${puntos.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="uv-filter-cliente">
                        <option value="">Todos los clientes</option>
                        ${clientes.map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}
                    </select>
                    <select class="uv-filter-select" id="uv-filter-mercaderista">
                        <option value="">Todos los mercaderistas</option>
                        ${mercaderistas.map(m => `<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('')}
                    </select>
                    <button class="uv-clear-btn" id="uv-clear-filters" title="Limpiar filtros">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
            
            <!-- LISTA DE VISITAS -->
            <div class="uv-visits-list" id="uv-visits-list">
                ${buildVisitCards(filteredUnifiedVisits)}
            </div>
            
            ${allUnifiedVisits.length === 0 ? `
            <div class="uv-empty-state">
                <i class="bi bi-check-circle"></i>
                <h4>¡Todo al día!</h4>
                <p>No hay visitas pendientes para revisar esta semana</p>
            </div>` : ''}
        </div>
    `);
    
    bindUvEvents();
}

/**
 * Construye el HTML de las tarjetas de visitas
 */
function buildVisitCards(visits) {
    if (visits.length === 0) {
        return `
            <div class="uv-no-results">
                <i class="bi bi-search" style="font-size: 3rem; opacity: 0.3;"></i>
                <p style="color: var(--text-muted); margin-top: 1rem;">No se encontraron visitas con esos filtros</p>
            </div>
        `;
    }
    
    let html = '';
    visits.forEach(function(v) {
        const progreso = v.progreso || 0;
        const pClass = progreso === 0 ? 'uv-prog-none' : 
                       progreso < 50 ? 'uv-prog-low' : 
                       progreso < 100 ? 'uv-prog-mid' : 'uv-prog-done';
        
        const hasChat = (v.mensajes_no_leidos || 0) > 0;
        const estaRevisada = v.revisada || false;
        
        // Badges de fotos
        let badges = '';
        if (v.fotos_gestion > 0) badges += `<span class="uv-foto-badge uv-fb-gestion" title="Gestión">${v.fotos_gestion} <i class="bi bi-images"></i></span>`;
        if (v.fotos_precio > 0) badges += `<span class="uv-foto-badge uv-fb-precio" title="Precios">${v.fotos_precio} <i class="bi bi-currency-dollar"></i></span>`;
        if (v.fotos_exhibicion > 0) badges += `<span class="uv-foto-badge uv-fb-exhibicion" title="Exhibiciones">${v.fotos_exhibicion} <i class="bi bi-collection"></i></span>`;
        if (v.fotos_pop > 0) badges += `<span class="uv-foto-badge uv-fb-pop" title="Material POP">${v.fotos_pop} <i class="bi bi-box-seam"></i></span>`;
        if (!badges) badges = '<span class="uv-foto-badge uv-fb-none">Sin fotos</span>';
        
        // Botones de acción
        let actions = '';
        if (v.fotos_gestion > 0) {
            actions += `<button class="uv-action-btn uv-act-gestion" onclick="event.stopPropagation(); viewVisitPhotos(${v.id_visita})" title="Fotos Gestión"><i class="bi bi-images"></i></button>`;
        }
        if (v.fotos_precio > 0) {
            actions += `<button class="uv-action-btn uv-act-precio" onclick="event.stopPropagation(); viewVisitPrice(${v.id_visita})" title="Precios"><i class="bi bi-currency-dollar"></i></button>`;
        }
        if (v.fotos_exhibicion > 0) {
            actions += `<button class="uv-action-btn uv-act-exhibicion" onclick="event.stopPropagation(); viewVisitExhibitions(${v.id_visita})" title="Exhibiciones"><i class="bi bi-collection"></i></button>`;
        }
        if (v.fotos_pop > 0) {
            actions += `<button class="uv-action-btn uv-act-pop" onclick="event.stopPropagation(); viewVisitPop(${v.id_visita})" title="Material POP"><i class="bi bi-box-seam"></i></button>`;
        }
        actions += `<button class="uv-action-btn uv-act-chat ${hasChat ? 'uv-has-msgs' : ''}" onclick="event.stopPropagation(); openChatModal(${v.id_visita})" title="Chat"><i class="bi bi-chat-dots"></i>${hasChat ? `<span class="uv-chat-dot">${v.mensajes_no_leidos}</span>` : ''}</button>`;
        
        // Botón de marcar/desmarcar revisada
        if (estaRevisada) {
            actions += `<button class="uv-action-btn uv-act-unmark" onclick="event.stopPropagation(); window.uvUnmarkReviewed(${v.id_visita})" title="Desmarcar revisada"><i class="bi bi-arrow-counterclockwise"></i></button>`;
        } else {
            actions += `<button class="uv-action-btn uv-act-mark" onclick="event.stopPropagation(); window.uvMarkReviewed(${v.id_visita})" title="Marcar como revisada"><i class="bi bi-check-circle"></i></button>`;
        }
        
        // Info de progreso: aprobadas vs total
        const progresoText = `${v.fotos_aprobadas || 0}/${v.total_fotos || 0} aprobadas (${progreso}%)`;
        const rechazadasText = (v.fotos_rechazadas || 0) > 0 ? ` · ${v.fotos_rechazadas} rechazadas` : '';
        
        html += `
        <div class="uv-visit-card ${pClass} ${estaRevisada ? 'uv-revisada' : ''}">
            <div class="uv-visit-main">
                <div class="uv-visit-id">#${v.id_visita}</div>
                <div class="uv-visit-details">
                    <div class="uv-visit-primary">
                        <span class="uv-client-name">${escapeHtml(v.cliente)}</span>
                        <span class="uv-sep">•</span>
                        <span class="uv-point-name">${escapeHtml(v.punto_de_interes)}</span>
                        ${estaRevisada ? '<span class="uv-badge-revisada"><i class="bi bi-check-circle-fill"></i> Revisada</span>' : ''}
                    </div>
                    <div class="uv-visit-secondary">
                        <span><i class="bi bi-signpost-2"></i> ${escapeHtml(v.ruta)}</span>
                        <span><i class="bi bi-person"></i> ${escapeHtml(v.mercaderista)}</span>
                        <span><i class="bi bi-clock"></i> ${fmtTime(v.fecha_visita)}</span>
                        ${v.ciudad ? `<span><i class="bi bi-geo-alt"></i> ${escapeHtml(v.ciudad)}</span>` : ''}
                    </div>
                </div>
            </div>
            
            <div class="uv-visit-photos">
                <div class="uv-badges-row">${badges}</div>
                <div class="uv-progress-bar">
                    <div class="uv-progress-fill ${pClass}" style="width: ${progreso}%"></div>
                </div>
                <small class="uv-progress-text">${progresoText}${rechazadasText}</small>
            </div>
            
            <div class="uv-visit-actions">${actions}</div>
        </div>`;
    });
    
    return html;
}

/**
 * Formatea hora compacta
 */
function fmtTime(dateStr) {
    if (!dateStr) return 'Sin fecha';
    try {
        const d = new Date(dateStr);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        return d.toLocaleDateString('es-VE', { day: '2-digit', month: '2-digit' }) + ' ' +
               d.toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit', hour12: false });
    } catch(e) {
        return dateStr;
    }
}

/**
 * Escape HTML para seguridad
 */
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Aplica búsqueda y filtros
 */
function applyUvFilters() {
    const term = ($('#uv-search').val() || '').toLowerCase().trim();
    const fRuta = $('#uv-filter-ruta').val();
    const fPunto = $('#uv-filter-punto').val();
    const fCliente = $('#uv-filter-cliente').val();
    const fMerc = $('#uv-filter-mercaderista').val();
    
    filteredUnifiedVisits = allUnifiedVisits.filter(function(v) {
        if (term) {
            const searchable = [
                v.id_visita.toString(),
                v.cliente,
                v.punto_de_interes,
                v.mercaderista,
                v.ruta,
                v.ciudad,
                v.departamento,
                v.analista
            ].join(' ').toLowerCase();
            if (searchable.indexOf(term) === -1) return false;
        }
        if (fRuta && v.ruta !== fRuta) return false;
        if (fPunto && v.punto_de_interes !== fPunto) return false;
        if (fCliente && v.cliente !== fCliente) return false;
        if (fMerc && v.mercaderista !== fMerc) return false;
        return true;
    });
    
    $('#uv-visits-list').html(buildVisitCards(filteredUnifiedVisits));
    $('#uv-search-count').text(filteredUnifiedVisits.length + ' resultado' + (filteredUnifiedVisits.length !== 1 ? 's' : ''));
}

/**
 * Bindea todos los eventos
 */
function bindUvEvents() {
    $('#uv-search').off('input').on('input', function() {
        clearTimeout(unifiedSearchTimeout);
        unifiedSearchTimeout = setTimeout(applyUvFilters, 250);
    });
    
    $('#uv-filter-ruta, #uv-filter-punto, #uv-filter-cliente, #uv-filter-mercaderista')
        .off('change').on('change', applyUvFilters);
    
    $('#uv-clear-filters').off('click').on('click', function() {
        $('#uv-search').val('');
        $('#uv-filter-ruta').val('');
        $('#uv-filter-punto').val('');
        $('#uv-filter-cliente').val('');
        $('#uv-filter-mercaderista').val('');
        applyUvFilters();
    });
    
    $('#uv-refresh-btn').off('click').on('click', function() {
        loadUnifiedVisits();
    });
    
    // Toggle mostrar revisadas
    $('#uv-toggle-revisadas').off('change').on('change', function() {
        uvShowRevisadas = this.checked;
        loadUnifiedVisits();
    });
    
    // Ctrl+K
    $(document).off('keydown.uvSearch').on('keydown.uvSearch', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            $('#uv-search').focus();
        }
    });
}

/**
 * Marcar visita como revisada
 */
window.uvMarkReviewed = function(visitId) {
    if (!confirm(`¿Marcar visita #${visitId} como revisada?`)) return;
    
    $.post('/api/mark-visit-reviewed/' + visitId)
        .done(function(res) {
            if (res.success) {
                loadUnifiedVisits();
            } else {
                alert('Error: ' + (res.error || 'Desconocido'));
            }
        })
        .fail(function() {
            alert('Error de conexión al marcar visita');
        });
};

/**
 * Desmarcar visita revisada
 */
window.uvUnmarkReviewed = function(visitId) {
    if (!confirm(`¿Desmarcar visita #${visitId}? Volverá a la lista pendiente.`)) return;
    
    $.post('/api/unmark-visit-reviewed/' + visitId)
        .done(function(res) {
            if (res.success) {
                loadUnifiedVisits();
            } else {
                alert('Error: ' + (res.error || 'Desconocido'));
            }
        })
        .fail(function() {
            alert('Error de conexión al desmarcar visita');
        });
};

/**
 * Muestra error
 */
function showUvError(msg) {
    $('#content-area').html(`
        <div class="uv-container">
            <div class="uv-empty-state">
                <i class="bi bi-exclamation-triangle" style="color: #ff6b6b; font-size: 4rem; opacity: 0.5;"></i>
                <h4 style="color: var(--text-primary); margin-top: 1rem;">Error al cargar visitas</h4>
                <p style="color: var(--text-muted);">${msg}</p>
                <button class="btn btn-primary mt-3" id="uv-retry-btn">
                    <i class="bi bi-arrow-clockwise"></i> Reintentar
                </button>
            </div>
        </div>
    `);
    $('#uv-retry-btn').on('click', loadUnifiedVisits);
}