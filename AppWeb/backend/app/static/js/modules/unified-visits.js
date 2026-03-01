// ╔══════════════════════════════════════════════════════════════╗
// ║  /static/js/modules/unified-visits.js  v4.3 FINAL          ║
// ║  REEMPLAZAR el archivo completo con este.                   ║
// ║                                                              ║
// ║  FIXES v4.3:                                                 ║
// ║  1. Badge chat: se actualiza en TIEMPO REAL via WebSocket    ║
// ║     - Listener se registra con reintentos cada 2s            ║
// ║     - Si WebSocket no está listo, usa polling cada 30s       ║
// ║  2. Al abrir chat: POST /api/mark-chat-read marca todo leído║
// ║  3. Toggle revisadas: ON=solo revisadas, OFF=solo pendientes ║
// ╚══════════════════════════════════════════════════════════════╝

let allUnifiedVisits = [];
let filteredUnifiedVisits = [];
let unifiedSearchTimeout = null;
let uvStats = {};
let uvShowRevisadas = false;
let uvChatListenerReady = false;
let uvPollingInterval = null;
let uvHasUnreadMessages = false;
let uvAudioCtx = null;
let uvShowHistorico = false;
let uvFechaDesde = '';
let uvFechaHasta = '';

// ════════════════════════════════════════════════════════════════
// CARGA PRINCIPAL
// ════════════════════════════════════════════════════════════════

export function loadUnifiedVisits() {
    const $content = $('#content-area');

    // ✅ Limpiar socket anterior si existe (evita listeners duplicados al recargar)
    if (window._uvNotifSocket) {
        try { window._uvNotifSocket.disconnect(); } catch(e) {}
        window._uvNotifSocket = null;
    }
    uvChatListenerReady = false;
    
    $content.html(`
        <div class="uv-container">
            <div class="uv-header-bar">
                <div class="d-flex align-items-center gap-3">
                    <div class="uv-icon-pulse"><i class="bi bi-lightning-charge-fill"></i></div>
                    <div>
                        <h3 class="mb-0" style="color: var(--text-primary);">Centro de Mando</h3>
                        <small style="color: var(--text-muted);">Cargando visitas de la semana...</small>
                    </div>
                </div>
            </div>
            <div class="text-center py-5">
                <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3" style="color: var(--text-muted);">Obteniendo visitas...</p>
            </div>
        </div>
    `);
    
    const incluir = uvShowRevisadas ? '1' : '0';

    let apiUrl;
    if (uvShowHistorico) {
        apiUrl = `/api/unified-all-visits?incluir_revisadas=${incluir}`;
        if (uvFechaDesde) apiUrl += `&fecha_desde=${uvFechaDesde}`;
        if (uvFechaHasta) apiUrl += `&fecha_hasta=${uvFechaHasta}`;
    } else {
        apiUrl = `/api/unified-pending-visits?incluir_revisadas=${incluir}`;
    }

    $.getJSON(apiUrl)
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

// ════════════════════════════════════════════════════════════════
// RENDER
// ════════════════════════════════════════════════════════════════

function renderUnifiedView() {
    const $content = $('#content-area');
    const s = uvStats;
    
    const rutas = [...new Set(allUnifiedVisits.map(v => v.ruta).filter(Boolean))].sort();
    const puntos = [...new Set(allUnifiedVisits.map(v => v.punto_de_interes).filter(Boolean))].sort();
    const clientes = [...new Set(allUnifiedVisits.map(v => v.cliente).filter(Boolean))].sort();
    const mercaderistas = [...new Set(allUnifiedVisits.map(v => v.mercaderista).filter(Boolean))].sort();
    
    let emptyMsg = '';
    if (allUnifiedVisits.length === 0) {
        emptyMsg = uvShowRevisadas
            ? `<div class="uv-no-results"><i class="bi bi-inbox" style="font-size:3rem;opacity:0.3;"></i><p style="color:var(--text-muted);margin-top:1rem;">No hay visitas revisadas esta semana</p></div>`
            : `<div class="uv-no-results"><i class="bi bi-check-circle" style="font-size:3rem;opacity:0.3;color:#28a745;"></i><p style="color:var(--text-muted);margin-top:1rem;">¡Todo al día! No hay visitas pendientes esta semana</p></div>`;
    }
    
    $content.html(`
        <div class="uv-container">
            <div class="uv-header-bar">
                <div class="d-flex align-items-center justify-content-between flex-wrap gap-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="uv-icon-pulse"><i class="bi bi-lightning-charge-fill"></i></div>
                        <div>
                             <h3 class="mb-0" style="color: var(--text-primary); display:flex; align-items:center; gap:0.5rem;">
                                Centro de Mando
                                <span id="uv-status-dot" title="Estado mensajes" style="
                                    width:12px; height:12px; border-radius:50%; flex-shrink:0;
                                    display:inline-block; margin-left:4px;
                                    background: #3a86ff;
                                    box-shadow: 0 0 0 0 rgba(58,134,255,0.4);
                                    transition: background 0.4s ease, box-shadow 0.4s ease;
                                "></span>
                            </h3>
                            <small style="color: var(--text-muted);">
                                ${uvShowRevisadas
                                    ? (s.total_visitas || 0) + ' visita' + ((s.total_visitas||0)!==1?'s':'') + ' revisada' + ((s.total_visitas||0)!==1?'s':'')
                                    : (s.total_visitas || 0) + ' visita' + ((s.total_visitas||0)!==1?'s':'') + ' pendiente' + ((s.total_visitas||0)!==1?'s':'') + ' esta semana'
                                }
                            </small>
                        </div>
                    </div>
                    <div class="d-flex gap-2 align-items-center flex-wrap">
                        <label class="uv-toggle-label">
                            <input type="checkbox" id="uv-toggle-revisadas" ${uvShowRevisadas ? 'checked' : ''}>
                            <span>Mostrar revisadas</span>
                        </label>
                        <label class="uv-toggle-label">
                            <input type="checkbox" id="uv-toggle-historico" ${uvShowHistorico ? 'checked' : ''}>
                            <span>Ver histórico</span>
                        </label>
                        <div id="uv-date-range" style="display:${uvShowHistorico ? 'flex' : 'none'}; gap:0.4rem; align-items:center;">
                            <input type="date" id="uv-fecha-desde" class="form-control form-control-sm" style="width:140px;" value="${uvFechaDesde}">
                            <span>→</span>
                            <input type="date" id="uv-fecha-hasta" class="form-control form-control-sm" style="width:140px;" value="${uvFechaHasta}">
                            <button class="btn btn-sm uv-refresh-btn" id="uv-apply-dates">Ir</button>
                        </div>
                        <button class="btn btn-sm uv-refresh-btn" id="uv-refresh-btn">
                            <i class="bi bi-arrow-clockwise"></i> Actualizar
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="uv-stats-row">
                <div class="uv-stat-card"><div class="uv-stat-number">${s.total_visitas||0}</div><div class="uv-stat-label">Visitas</div></div>
                <div class="uv-stat-card uv-stat-fotos"><div class="uv-stat-number">${s.total_fotos||0}</div><div class="uv-stat-label">Fotos totales</div></div>
                <div class="uv-stat-card uv-stat-aprobadas"><div class="uv-stat-number">${s.fotos_aprobadas||0}</div><div class="uv-stat-label">Aprobadas</div></div>
                <div class="uv-stat-card uv-stat-pendientes"><div class="uv-stat-number">${s.sin_revisar||0}</div><div class="uv-stat-label">Sin revisar</div></div>
                <div class="uv-stat-card uv-stat-rechazadas"><div class="uv-stat-number">${s.fotos_rechazadas||0}</div><div class="uv-stat-label">Rechazadas</div></div>
                <div class="uv-stat-card uv-stat-progreso"><div class="uv-stat-number">${s.progreso_general||0}%</div><div class="uv-stat-label">Progreso semanal</div></div>
            </div>
            
            <div class="uv-search-bar">
                <div class="uv-search-wrapper">
                    <i class="bi bi-search uv-search-icon"></i>
                    <input type="text" class="uv-search-input" id="uv-search" placeholder="Buscar visita, cliente, punto, mercaderista, ruta..." autocomplete="off">
                    <span class="uv-search-count" id="uv-search-count">${filteredUnifiedVisits.length} resultados</span>
                </div>
                <div class="uv-filters-row">
                    <select class="uv-filter-select" id="uv-filter-ruta"><option value="">Todas las rutas</option>${rutas.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join('')}</select>
                    <select class="uv-filter-select" id="uv-filter-punto"><option value="">Todos los puntos</option>${puntos.map(p=>`<option value="${esc(p)}">${esc(p)}</option>`).join('')}</select>
                    <select class="uv-filter-select" id="uv-filter-cliente"><option value="">Todos los clientes</option>${clientes.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select>
                    <select class="uv-filter-select" id="uv-filter-mercaderista"><option value="">Todos los mercaderistas</option>${mercaderistas.map(m=>`<option value="${esc(m)}">${esc(m)}</option>`).join('')}</select>
                     <select class="uv-filter-select" id="uv-filter-unread" style="min-width:160px;" title="Filtrar mensajes">
                        <option value="">Todos los chats</option>
                        <option value="unread">💬 Con mensajes nuevos</option>
                    </select>
                    <button class="uv-clear-btn" id="uv-clear-filters" title="Limpiar filtros"><i class="bi bi-x-lg"></i></button>
                </div>
            </div>
            
            <div class="uv-visits-list" id="uv-visits-list">
                ${allUnifiedVisits.length === 0 ? emptyMsg : buildVisitCards(filteredUnifiedVisits)}
            </div>
        </div>
    `);
    
    bindUvEvents();

    // Actualizar indicador según estado actual de los datos
    const hayNoLeidos = allUnifiedVisits.some(x => (x.mensajes_no_leidos || 0) > 0);
    uvHasUnreadMessages = hayNoLeidos;
    // Pequeño delay para que el DOM esté listo
    setTimeout(() => uvUpdateStatusIndicator(hayNoLeidos), 100);
}

// ════════════════════════════════════════════════════════════════
// TARJETAS DE VISITA
// ════════════════════════════════════════════════════════════════

function buildVisitCards(visits) {
    if (visits.length === 0) {
        return `<div class="uv-no-results"><i class="bi bi-search" style="font-size:3rem;opacity:0.3;"></i><p style="color:var(--text-muted);margin-top:1rem;">No se encontraron visitas con esos filtros</p></div>`;
    }
    
    let html = '';
    visits.forEach(function(v) {
        const progreso = v.progreso || 0;
        const pClass = progreso === 0 ? 'uv-prog-none' : progreso < 50 ? 'uv-prog-low' : progreso < 100 ? 'uv-prog-mid' : 'uv-prog-done';
        const unread = v.mensajes_no_leidos || 0;
        const hasUnread = unread > 0;
        const revisada = v.revisada || false;
        
        let badges = '';
        if (v.fotos_gestion > 0) badges += `<span class="uv-foto-badge uv-fb-gestion" title="Gestión">${v.fotos_gestion} <i class="bi bi-images"></i></span>`;
        if (v.fotos_precio > 0) badges += `<span class="uv-foto-badge uv-fb-precio" title="Precios">${v.fotos_precio} <i class="bi bi-currency-dollar"></i></span>`;
        if (v.fotos_exhibicion > 0) badges += `<span class="uv-foto-badge uv-fb-exhibicion" title="Exhibiciones">${v.fotos_exhibicion} <i class="bi bi-collection"></i></span>`;
        if (v.fotos_pop > 0) badges += `<span class="uv-foto-badge uv-fb-pop" title="Material POP">${v.fotos_pop} <i class="bi bi-box-seam"></i></span>`;
        if (!badges) badges = '<span class="uv-foto-badge uv-fb-none">Sin fotos</span>';
        
        let actions = '';
        if (v.fotos_gestion > 0) actions += `<button class="uv-action-btn uv-act-gestion" onclick="event.stopPropagation();viewVisitPhotos(${v.id_visita})" title="Gestión"><i class="bi bi-images"></i></button>`;
        if (v.fotos_precio > 0) actions += `<button class="uv-action-btn uv-act-precio" onclick="event.stopPropagation();viewVisitPrice(${v.id_visita})" title="Precios"><i class="bi bi-currency-dollar"></i></button>`;
        if (v.fotos_exhibicion > 0) actions += `<button class="uv-action-btn uv-act-exhibicion" onclick="event.stopPropagation();viewVisitExhibitions(${v.id_visita})" title="Exhibiciones"><i class="bi bi-collection"></i></button>`;
        if (v.fotos_pop > 0) actions += `<button class="uv-action-btn uv-act-pop" onclick="event.stopPropagation();viewVisitPop(${v.id_visita})" title="Material POP"><i class="bi bi-box-seam"></i></button>`;
        
        // Chat button con badge
        actions += `<button class="uv-action-btn uv-act-chat ${hasUnread?'uv-has-msgs':''}" 
                        data-uv-chat-visit="${v.id_visita}"
                        onclick="event.stopPropagation();window.uvOpenChat(${v.id_visita})" 
                        title="Chat${hasUnread?' ('+unread+' nuevos)':''}">
                        <i class="bi bi-chat-dots"></i>
                        ${hasUnread ? `<span class="uv-chat-dot" data-uv-badge="${v.id_visita}">${unread}</span>` : ''}
                    </button>`;
        
        if (revisada) {
            actions += `<button class="uv-action-btn uv-act-unmark" onclick="event.stopPropagation();window.uvUnmarkReviewed(${v.id_visita})" title="Desmarcar revisada"><i class="bi bi-arrow-counterclockwise"></i></button>`;
        } else {
            actions += `<button class="uv-action-btn uv-act-mark" onclick="event.stopPropagation();window.uvMarkReviewed(${v.id_visita})" title="Marcar revisada"><i class="bi bi-check-circle"></i></button>`;
        }
        
        const sinRevisar = (v.total_fotos||0) - (v.fotos_aprobadas||0) - (v.fotos_rechazadas||0);
        const progresoText = `${v.fotos_aprobadas||0}/${v.total_fotos||0} aprobadas (${progreso}%)`;
        const rechText = (v.fotos_rechazadas||0) > 0 ? ` · ${v.fotos_rechazadas} pendientes revisita` : '';
        const sinRevText = sinRevisar > 0 ? ` · ${sinRevisar} sin revisar` : '';
        
        html += `
        <div class="uv-visit-card ${pClass} ${revisada?'uv-revisada':''}" data-visit-card="${v.id_visita}">
            <div class="uv-visit-main">
                <div class="uv-visit-id">#${v.id_visita}</div>
                <div class="uv-visit-details">
                    <div class="uv-visit-primary">
                        <span class="uv-client-name">${esc(v.cliente)}</span>
                        <span class="uv-sep">•</span>
                        <span class="uv-point-name">${esc(v.punto_de_interes)}</span>
                        ${revisada?'<span class="uv-badge-revisada"><i class="bi bi-check-circle-fill"></i> Revisada</span>':''}
                    </div>
                    <div class="uv-visit-secondary">
                        <span><i class="bi bi-signpost-2"></i> ${esc(v.ruta)}</span>
                        <span><i class="bi bi-person"></i> ${esc(v.mercaderista)}</span>
                        <span><i class="bi bi-clock"></i> ${fmtTime(v.fecha_visita)}</span>
                        ${v.ciudad?`<span><i class="bi bi-geo-alt"></i> ${esc(v.ciudad)}</span>`:''}
                    </div>
                </div>
            </div>
            <div class="uv-visit-photos">
                <div class="uv-badges-row">${badges}</div>
                <div class="uv-progress-bar"><div class="uv-progress-fill ${pClass}" style="width:${progreso}%"></div></div>
                 <small class="uv-progress-text">${progresoText}${rechText}${sinRevText}</small>
            </div>
            <div class="uv-visit-actions">${actions}</div>
        </div>`;
    });
    
    return html;
}

// ════════════════════════════════════════════════════════════════
// CHAT: Abrir + marcar leído + badge en tiempo real
// ════════════════════════════════════════════════════════════════

/**
 * Abre el chat modal y marca TODOS los mensajes como leídos (global).
 */
window.uvOpenChat = function(visitId) {
    // 1. Abrir modal
    if (typeof openChatModal === 'function') {
        openChatModal(visitId);
    }
    
    // 2. Marcar TODO como leído en backend (global, visto=1)
    $.post('/api/mark-chat-read/' + visitId).done(function() {
        console.log('✅ [UV] Chat ' + visitId + ' marcado leído');
    });
    
    // 3. Limpiar badge inmediatamente en la UI
    uvSetBadge(visitId, 0);
    
    // 4. Actualizar dato en memoria
    const v = allUnifiedVisits.find(x => x.id_visita === visitId);
    if (v) v.mensajes_no_leidos = 0;
    
    // 5. Si ya no quedan mensajes sin leer en ninguna visita, apagar indicador
    const quedan = allUnifiedVisits.some(x => (x.mensajes_no_leidos || 0) > 0);
    if (!quedan) {
        uvHasUnreadMessages = false;
        uvUpdateStatusIndicator(false);
    }
};

/**
 * Establece el badge de un chat: 0 lo quita, >0 lo muestra
 */
function uvSetBadge(visitId, count) {
    const btn = document.querySelector(`[data-uv-chat-visit="${visitId}"]`);
    if (!btn) return;
    
    // Quitar badge existente
    const oldDot = btn.querySelector('.uv-chat-dot');
    if (oldDot) oldDot.remove();
    
    if (count > 0) {
        btn.classList.add('uv-has-msgs');
        btn.title = `Chat (${count} nuevos)`;
        const dot = document.createElement('span');
        dot.className = 'uv-chat-dot';
        dot.setAttribute('data-uv-badge', visitId);
        dot.textContent = count;
        btn.appendChild(dot);
    } else {
        btn.classList.remove('uv-has-msgs');
        btn.title = 'Chat';
    }
}

/**
 * Configura el listener de WebSocket para actualizar badges en tiempo real.
 * Reintenta cada 2 segundos hasta que el socket esté conectado.
 */

function setupChatBadgeListener() {
    if (uvChatListenerReady) return;
    
    console.log('🔌 [UV] Creando socket independiente para notificaciones...');
    
    // ✅ Socket PROPIO de UV - independiente del de chat.js
    // Así chat.js nunca puede hacer .off() y romper nuestro listener
    const uvSocket = io.connect(window.location.origin + '/chat', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 99,
        forceNew: true  // ← CLAVE: conexión separada, no comparte con chat.js
    });
    
    uvSocket.on('connect', function() {
        console.log('✅ [UV] Socket notificaciones conectado SID:', uvSocket.id);
        console.log('✅ [UV] Socket notificaciones conectado SID:', uvSocket.id);
        uvChatListenerReady = true;


        // ← AGREGAR ESTO: unirse a TODAS las salas de las visitas cargadas
    allUnifiedVisits.forEach(function(v) {
        uvSocket.emit('join_chat', {
            visit_id: v.id_visita,
            username: document.querySelector('meta[name="username"]')?.content || 'analista'
        });
        console.log('🚪 [UV] Uniéndose a sala chat_visit_' + v.id_visita);
    });
        if (uvPollingInterval) {
            clearInterval(uvPollingInterval);
            uvPollingInterval = null;
        }
    });
    
    uvSocket.on('new_message', uvHandleNewMessage);
    
    uvSocket.on('disconnect', function(reason) {
        console.log('🔴 [UV] Socket notificaciones desconectado:', reason);
        uvChatListenerReady = false;
    });
    
    uvSocket.on('connect_error', function(e) {
        console.error('❌ [UV] Error socket notificaciones:', e.message);
    });
    
    uvSocket.on('reconnect', function() {
        console.log('🔄 [UV] Socket notificaciones reconectado');
        uvChatListenerReady = true;
    });
    
    // Guardar referencia para limpieza si sale del Centro de Mando
    window._uvNotifSocket = uvSocket;
    
    // Timeout de seguridad: si en 8s no conecta, activar polling
    setTimeout(function() {
        if (!uvChatListenerReady && document.querySelector('.uv-container')) {
            console.log('⚠️ [UV] Socket lento, activando polling de respaldo');
            startBadgePolling();
        }
    }, 8000);
}



/**
 * Handler para mensajes nuevos del WebSocket.
 * Se ejecuta cada vez que llega un 'new_message' al namespace /chat.
 */
function uvHandleNewMessage(msg) {
    console.log('🔥 [UV] uvHandleNewMessage EJECUTADO:', msg);
    if (!document.querySelector('.uv-container')) return;
    
    const msgVisitId = parseInt(msg.id_visita);
    
    const openChat = typeof currentChatVisitId !== 'undefined' ? parseInt(currentChatVisitId) : null;
    if (msgVisitId === openChat) {
        $.post('/api/mark-chat-read/' + msgVisitId);
        return;
    }
    
    if (msg.tipo_mensaje === 'sistema') return;
    if (msg.id_usuario === window.currentUserId) return;
    
    console.log('📨 [UV] Mensaje nuevo en visita ' + msgVisitId + ' de ' + msg.username);
    
    // Incrementar badge en memoria y UI
    const v = allUnifiedVisits.find(x => x.id_visita === msgVisitId);
    if (v) {
        v.mensajes_no_leidos = (v.mensajes_no_leidos || 0) + 1;
        uvSetBadge(msgVisitId, v.mensajes_no_leidos);
    } else {
        const btn = document.querySelector(`[data-uv-chat-visit="${msgVisitId}"]`);
        if (btn) {
            const dot = btn.querySelector('.uv-chat-dot');
            const cur = dot ? (parseInt(dot.textContent) || 0) : 0;
            uvSetBadge(msgVisitId, cur + 1);
        }
    }
    
    // ✅ SONIDO + INDICADOR VERDE
    uvPlayNotificationSound();
    uvHasUnreadMessages = true;
    uvUpdateStatusIndicator(true);
}
/**
 * Polling de respaldo: cada 30 segundos recarga los conteos de mensajes.
 * Solo se usa si WebSocket no está disponible.
 */

/**
 * Toca un sonido de notificación suave usando Web Audio API (sin archivos externos)
 */
function uvPlayNotificationSound() {
    try {
        if (!uvAudioCtx) {
            uvAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Reanudar si estaba suspendido (política autoplay del navegador)
        if (uvAudioCtx.state === 'suspended') {
            uvAudioCtx.resume();
        }
        
        const now = uvAudioCtx.currentTime;
        
        // Nota 1: Do5 (523 Hz) - tono corto
        const osc1 = uvAudioCtx.createOscillator();
        const gain1 = uvAudioCtx.createGain();
        osc1.connect(gain1);
        gain1.connect(uvAudioCtx.destination);
        osc1.frequency.setValueAtTime(523, now);
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.15, now + 0.01);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc1.start(now);
        osc1.stop(now + 0.25);
        
        // Nota 2: Mi5 (659 Hz) - ligeramente después
        const osc2 = uvAudioCtx.createOscillator();
        const gain2 = uvAudioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(uvAudioCtx.destination);
        osc2.frequency.setValueAtTime(659, now + 0.12);
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0, now + 0.12);
        gain2.gain.linearRampToValueAtTime(0.12, now + 0.13);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.4);
        
        console.log('🔔 [UV] Sonido de notificación reproducido');
    } catch(e) {
        console.log('⚠️ [UV] No se pudo reproducir sonido:', e.message);
    }
}

/**
 * Actualiza el indicador de estado (bombillito) al lado del título:
 * Verde pulsante = hay mensajes nuevos
 * Azul = sin mensajes nuevos
 */
function uvUpdateStatusIndicator(hasNew) {
    const dot = document.getElementById('uv-status-dot');
    if (!dot) return;
    
    if (hasNew) {
        dot.style.background = '#28a745';
        dot.style.boxShadow = '0 0 0 0 rgba(40,167,69,0.5)';
        dot.style.animation = 'uvDotPulse 1.5s ease-in-out infinite';
        dot.title = '● Hay mensajes nuevos sin leer';
    } else {
        dot.style.background = '#3a86ff';
        dot.style.boxShadow = '0 0 0 0 rgba(58,134,255,0)';
        dot.style.animation = 'none';
        dot.title = '● Sin mensajes nuevos';
    }
}

function startBadgePolling() {
    if (uvPollingInterval) return;
    
    uvPollingInterval = setInterval(function() {
        if (!document.querySelector('.uv-container')) {
            clearInterval(uvPollingInterval);
            uvPollingInterval = null;
            return;
        }
        
        const incluir = uvShowRevisadas ? '1' : '0';
        $.getJSON(`/api/unified-pending-visits?incluir_revisadas=${incluir}`)
            .done(function(res) {
                if (!res.success) return;
                (res.visits || []).forEach(function(v) {
                    const old = allUnifiedVisits.find(x => x.id_visita === v.id_visita);
                    if (old && old.mensajes_no_leidos !== v.mensajes_no_leidos) {
                        old.mensajes_no_leidos = v.mensajes_no_leidos;
                        uvSetBadge(v.id_visita, v.mensajes_no_leidos);
                    }
                });
            });
    }, 30000);
}

// ════════════════════════════════════════════════════════════════
// UTILIDADES
// ════════════════════════════════════════════════════════════════

function fmtTime(dateStr) {
    if (!dateStr) return 'Sin fecha';
    try {
        const d = new Date(dateStr);
        const now = new Date();
        if (d.toDateString() === now.toDateString()) {
            return d.toLocaleTimeString('es-VE', {hour:'2-digit',minute:'2-digit',hour12:false});
        }
        return d.toLocaleDateString('es-VE', {day:'2-digit',month:'2-digit'}) + ' ' +
               d.toLocaleTimeString('es-VE', {hour:'2-digit',minute:'2-digit',hour12:false});
    } catch(e) { return dateStr; }
}

function esc(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function applyUvFilters() {
    const term = ($('#uv-search').val()||'').toLowerCase().trim();
    const fR = $('#uv-filter-ruta').val();
    const fP = $('#uv-filter-punto').val();
    const fC = $('#uv-filter-cliente').val();
    const fM = $('#uv-filter-mercaderista').val();
    const fU = $('#uv-filter-unread').val();
    
    filteredUnifiedVisits = allUnifiedVisits.filter(function(v) {
        if (term) {
            const s = [v.id_visita+'',v.cliente,v.punto_de_interes,v.mercaderista,v.ruta,v.ciudad,v.departamento,v.analista].join(' ').toLowerCase();
            if (s.indexOf(term) === -1) return false;
        }
        if (fR && v.ruta !== fR) return false;
        if (fP && v.punto_de_interes !== fP) return false;
        if (fC && v.cliente !== fC) return false;
        if (fM && v.mercaderista !== fM) return false;
        if (fU === 'unread' && !(v.mensajes_no_leidos > 0)) return false;
        return true;
    });

    // ← ESTAS DOS LÍNEAS FALTABAN:
    $('#uv-visits-list').html(buildVisitCards(filteredUnifiedVisits));
    $('#uv-search-count').text(filteredUnifiedVisits.length + ' resultados');
}


function bindUvEvents() {
    $('#uv-search').off('input').on('input', function() {
        clearTimeout(unifiedSearchTimeout);
        unifiedSearchTimeout = setTimeout(applyUvFilters, 250);
    });
    
    $('#uv-filter-ruta,#uv-filter-punto,#uv-filter-cliente,#uv-filter-mercaderista').off('change').on('change', applyUvFilters);
    
    $('#uv-clear-filters').off('click').on('click', function() {
        $('#uv-search,#uv-filter-ruta,#uv-filter-punto,#uv-filter-cliente,#uv-filter-mercaderista,#uv-filter-unread').val('');
        applyUvFilters();
    });
    
    $('#uv-filter-unread').off('change').on('change', applyUvFilters);
    
    $('#uv-refresh-btn').off('click').on('click', loadUnifiedVisits);
    
    $('#uv-toggle-revisadas').off('change').on('change', function() {
        uvShowRevisadas = this.checked;
        loadUnifiedVisits();
    });

    $('#uv-toggle-historico').off('change').on('change', function() {
        uvShowHistorico = this.checked;
        $('#uv-date-range').css('display', uvShowHistorico ? 'flex' : 'none');
        if (!uvShowHistorico) {
            uvFechaDesde = '';
            uvFechaHasta = '';
        }
        loadUnifiedVisits();
    });

    $('#uv-apply-dates').off('click').on('click', function() {
        uvFechaDesde = $('#uv-fecha-desde').val();
        uvFechaHasta = $('#uv-fecha-hasta').val();
        loadUnifiedVisits();
    });
    
    $(document).off('keydown.uvSearch').on('keydown.uvSearch', function(e) {
        if ((e.ctrlKey||e.metaKey) && e.key==='k') { e.preventDefault(); $('#uv-search').focus(); }
    });
    
    // Configurar listener WebSocket con reintentos
    uvChatListenerReady = false;
    setupChatBadgeListener();
}

// ════════════════════════════════════════════════════════════════
// MARCAR/DESMARCAR REVISADA
// ════════════════════════════════════════════════════════════════

window.uvMarkReviewed = function(visitId) {
    if (!confirm('¿Marcar visita #' + visitId + ' como revisada?')) return;
    $.post('/api/mark-visit-reviewed/' + visitId).done(function(r) {
        if (r.success) loadUnifiedVisits(); else alert('Error: ' + (r.error||'Desconocido'));
    }).fail(function() { alert('Error de conexión'); });
};

window.uvUnmarkReviewed = function(visitId) {
    if (!confirm('¿Desmarcar visita #' + visitId + '?')) return;
    $.post('/api/unmark-visit-reviewed/' + visitId).done(function(r) {
        if (r.success) loadUnifiedVisits(); else alert('Error: ' + (r.error||'Desconocido'));
    }).fail(function() { alert('Error de conexión'); });
};

function showUvError(msg) {
    $('#content-area').html(`
        <div class="uv-container">
            <div class="uv-empty-state">
                <i class="bi bi-exclamation-triangle" style="color:#ff6b6b;font-size:4rem;opacity:0.5;"></i>
                <h4 style="color:var(--text-primary);margin-top:1rem;">Error al cargar visitas</h4>
                <p style="color:var(--text-muted);">${msg}</p>
                <button class="btn btn-primary mt-3" id="uv-retry-btn"><i class="bi bi-arrow-clockwise"></i> Reintentar</button>
            </div>
        </div>
    `);
    $('#uv-retry-btn').on('click', loadUnifiedVisits);
}