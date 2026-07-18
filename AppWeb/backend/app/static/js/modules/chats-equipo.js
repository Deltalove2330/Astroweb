// ╔══════════════════════════════════════════════════════════════════════╗
// ║  /static/js/modules/chats-equipo.js                                 ║
// ║  Vista de pantalla completa (sidebar "Chats de Equipo"): lista de   ║
// ║  clientes por pestaña (Equipo + Cliente / Equipo Operativo) y, al   ║
// ║  seleccionar uno, su chat general + los chats por visita ya         ║
// ║  iniciados. Reutiliza los mismos endpoints REST y el namespace      ║
// ║  socket /chat_grupo que ya usa el widget flotante (chat-grupos.js), ║
// ║  con su propia conexión y estado — son dos vistas independientes.   ║
// ╚══════════════════════════════════════════════════════════════════════╝

const API = '/api/chat-grupos';

let ceGrupos = [];             // [{id_grupo, id_cliente, tipo_grupo, nombre, no_leidos, ultimo_mensaje}]
let ceTab = 'operativo_cliente';
let ceGrupoActivo = null;      // grupo seleccionado en la lista de clientes
let ceVista = 'clientes';      // 'clientes' | 'detalle' | 'chat-general' | 'chat-visita'
let ceVisitas = [];            // chats por visita del grupo activo
let ceVisitaActiva = null;
let ceSocket = null;
let ceUsername = 'Usuario';
let ceTypingTimer = null;
let ceMensajeEls = {}; // id_mensaje -> { tickEl, leidoPor } — para actualizar ticks en vivo

function esc(s) {
    return (s ?? '').toString().replace(/[&<>"']/g, (c) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
}
function fmtHora(iso) {
    if (!iso) return '';
    try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }
    catch (_) { return ''; }
}
async function jget(url) {
    const r = await fetch(url, { credentials: 'same-origin' });
    return r.json();
}
async function jpost(url) {
    const r = await fetch(url, { method: 'POST', credentials: 'same-origin' });
    return r.json();
}
function ceMostrarLectores(leidoPor) {
    const html = (leidoPor && leidoPor.length)
        ? leidoPor.map((l) => `
            <div style="text-align:left;padding:6px 0;border-bottom:1px solid #eee;">
                <b>${esc(l.username || 'Usuario')}</b><br>
                <small style="color:#667781;">${fmtHora(l.fecha_lectura)}</small>
            </div>`).join('')
        : '<div style="text-align:center;color:#667781;padding:12px;">Nadie ha leído este mensaje todavía.</div>';
    if (typeof Swal !== 'undefined') {
        Swal.fire({ title: 'Visto por', html: `<div style="max-height:260px;overflow-y:auto;">${html}</div>`, confirmButtonText: 'Cerrar' });
    } else {
        alert((leidoPor || []).map((l) => `${l.username} · ${fmtHora(l.fecha_lectura)}`).join('\n') || 'Nadie ha leído este mensaje todavía.');
    }
}
function ceActualizarLecturas(idMensajes, idUsuario, username, fechaLectura) {
    (idMensajes || []).forEach((id) => {
        const entry = ceMensajeEls[id];
        if (!entry) return;
        if (!entry.leidoPor.some((l) => l.id_usuario === idUsuario)) {
            entry.leidoPor.push({ id_usuario: idUsuario, username, fecha_lectura: fechaLectura });
        }
        entry.tickEl.classList.add('read');
        entry.tickEl.textContent = '✓✓';
        entry.tickEl.title = 'Visto — toca para ver quién';
    });
}

function ensureSocketLib() {
    return new Promise((resolve) => {
        if (typeof io !== 'undefined') return resolve();
        const s = document.createElement('script');
        s.src = 'https://cdn.socket.io/4.5.4/socket.io.min.js';
        s.onload = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
    });
}

async function ceConnectSocket() {
    if (ceSocket) return ceSocket;
    await ensureSocketLib();
    if (typeof io === 'undefined') return null;
    ceSocket = io('/chat_grupo', { transports: ['websocket', 'polling'] });

    ceSocket.on('new_message_grupo', (m) => {
        if (ceVista === 'chat-general' && ceGrupoActivo && m.id_grupo === ceGrupoActivo.id_grupo) {
            ceAppendMensaje(m);
            jpost(`${API}/${ceGrupoActivo.id_grupo}/marcar-leido`);
        } else {
            const g = ceGrupos.find((x) => x.id_grupo === m.id_grupo);
            if (g) { g.no_leidos = (g.no_leidos || 0) + 1; g.ultimo_mensaje = m; }
            if (ceVista === 'clientes') ceRenderClientes();
        }
    });
    ceSocket.on('new_message_grupo_visita', (m) => {
        if (ceVista === 'chat-visita' && ceVisitaActiva && m.id_visita === ceVisitaActiva.id_visita) {
            ceAppendMensaje(m);
            if (ceGrupoActivo) ceMarcarLeidoVisita(ceGrupoActivo, ceVisitaActiva.id_visita);
        } else if (ceVista === 'detalle' && ceGrupoActivo) {
            // Refresca la lista de visitas para que aparezca/actualice su preview
            ceCargarVisitas(ceGrupoActivo);
        }
    });
    ceSocket.on('grupo_mensajes_leidos', (d) => {
        if (ceVista !== 'chat-general' || !ceGrupoActivo || d.id_grupo !== ceGrupoActivo.id_grupo) return;
        ceActualizarLecturas(d.id_mensajes, d.id_usuario, d.username, d.fecha_lectura);
    });
    ceSocket.on('grupo_visita_mensajes_leidos', (d) => {
        if (ceVista !== 'chat-visita' || !ceVisitaActiva || d.id_visita !== ceVisitaActiva.id_visita) return;
        ceActualizarLecturas(d.id_mensajes, d.id_usuario, d.username, d.fecha_lectura);
    });
    ceSocket.on('user_typing_grupo', (d) => {
        const el = document.getElementById('ce-typing');
        if (el) el.textContent = d.is_typing ? `${d.username || ''} está escribiendo…` : '';
    });
    return ceSocket;
}

async function ceMarcarLeidoVisita(g, id_visita) {
    try {
        await jpost(`${API}/visita-marcar-leido/${g.id_cliente}/${g.tipo_grupo}/${id_visita}`);
        if (ceSocket) ceSocket.emit('mark_read_grupo_visita', {
            id_cliente: g.id_cliente, tipo_grupo: g.tipo_grupo, id_visita, username: ceUsername,
        });
    } catch (_) { /* no crítico */ }
}

function ceAppendMensaje(m) {
    const cont = document.getElementById('ce-messages');
    if (!cont) return;
    const mine = m.es_mio;
    const wrap = document.createElement('div');
    wrap.className = 'ce-msg ' + (m.tipo_mensaje === 'sistema' ? 'sys' : (mine ? 'out' : 'in'));
    if (m.tipo_mensaje !== 'sistema' && !mine) {
        const a = document.createElement('div');
        a.className = 'ce-msg-author';
        a.textContent = m.username || '';
        wrap.appendChild(a);
    }
    const t = document.createElement('div');
    t.textContent = m.mensaje || '';
    wrap.appendChild(t);

    // Foto adjunta (ej. rechazo de foto posteado como mensaje de sistema).
    if (m.foto_adjunta && String(m.foto_adjunta).length > 5) {
        const imgUrl = '/api/image/' + encodeURIComponent(m.foto_adjunta);
        const img = document.createElement('img');
        img.className = 'ce-msg-foto';
        img.src = imgUrl;
        img.alt = 'Foto adjunta';
        img.loading = 'lazy';
        img.addEventListener('click', () => window.open(imgUrl, '_blank'));
        img.addEventListener('error', () => { img.style.display = 'none'; });
        wrap.appendChild(img);
    }

    const meta = document.createElement('div');
    meta.className = 'ce-msg-meta';
    const h = document.createElement('span');
    h.className = 'ce-msg-time';
    h.textContent = fmtHora(m.fecha_envio);
    meta.appendChild(h);

    // Ticks de lectura estilo WhatsApp — solo en mensajes propios.
    if (mine && m.tipo_mensaje !== 'sistema' && m.id_mensaje) {
        const leidoPor = m.leido_por || [];
        const tick = document.createElement('span');
        tick.className = 'ce-msg-ticks' + (leidoPor.length ? ' read' : '');
        tick.textContent = leidoPor.length ? '✓✓' : '✓';
        tick.title = leidoPor.length ? 'Visto — toca para ver quién' : 'Enviado';
        tick.addEventListener('click', (e) => {
            e.stopPropagation();
            const entry = ceMensajeEls[m.id_mensaje];
            ceMostrarLectores(entry ? entry.leidoPor : leidoPor);
        });
        meta.appendChild(tick);
        ceMensajeEls[m.id_mensaje] = { tickEl: tick, leidoPor };
    }
    wrap.appendChild(meta);

    cont.appendChild(wrap);
    cont.scrollTop = cont.scrollHeight;
}

// ════════════════════════════════════════════════════════════════
// CARGA PRINCIPAL
// ════════════════════════════════════════════════════════════════
export async function loadChatsEquipo() {
    $('#content-area').html(`
        <div class="ce-container">
            <div class="ce-col-lista">
                <div class="ce-lista-header">
                    <h5><i class="bi bi-people-fill me-2"></i>Chats de Equipo</h5>
                </div>
                <div class="ce-tabs">
                    <button class="ce-tab-btn ${ceTab === 'operativo_cliente' ? 'active' : ''}" data-tab="operativo_cliente">
                        <i class="bi bi-building"></i> Equipo + Cliente
                    </button>
                    <button class="ce-tab-btn ${ceTab === 'operativo' ? 'active' : ''}" data-tab="operativo">
                        <i class="bi bi-people"></i> Equipo Operativo
                    </button>
                </div>
                <div class="ce-clientes-list" id="ce-clientes-list"></div>
            </div>
            <div class="ce-col-detalle" id="ce-col-detalle">
                <div class="ce-empty-state">
                    <i class="bi bi-chat-square-text" style="font-size:2.5rem;opacity:.25;"></i>
                    <p>Seleccioná un cliente para ver sus chats.</p>
                </div>
            </div>
        </div>
    `);

    try {
        const cu = await jget('/api/current-user');
        if (cu && cu.username) ceUsername = cu.username;
    } catch (_) { /* fallback */ }

    let res;
    try {
        res = await jget(`${API}/mis-grupos`);
    } catch (_) {
        $('#ce-clientes-list').html('<div class="ce-empty-inline">No se pudo cargar la lista de chats.</div>');
        return;
    }
    ceGrupos = (res && res.success && Array.isArray(res.grupos)) ? res.grupos : [];

    _bindTabs();
    ceRenderClientes();
    await ceConnectSocket();
}

function _bindTabs() {
    $(document).off('click.ce-tab', '.ce-tab-btn').on('click.ce-tab', '.ce-tab-btn', function () {
        ceTab = $(this).data('tab');
        ceRenderClientes();
    });
}

// ════════════════════════════════════════════════════════════════
// COLUMNA IZQUIERDA — lista de clientes por pestaña
// ════════════════════════════════════════════════════════════════
function ceRenderClientes() {
    $('.ce-tab-btn').removeClass('active');
    $(`.ce-tab-btn[data-tab="${ceTab}"]`).addClass('active');

    const filtrados = ceGrupos.filter((g) => g.tipo_grupo === ceTab);
    const $list = $('#ce-clientes-list');

    if (!filtrados.length) {
        $list.html('<div class="ce-empty-inline">No tenés clientes en esta sección todavía.</div>');
        return;
    }

    $list.html(filtrados.map((g) => {
        const nombreCliente = (g.nombre || '').replace(/\s*·\s*Equipo.*$/i, '').replace(/^Equipo operativo\s*·\s*/i, '');
        const last = g.ultimo_mensaje
            ? `${esc(g.ultimo_mensaje.username || '')}: ${esc(g.ultimo_mensaje.mensaje || '')}`
            : 'Sin mensajes aún';
        const activo = ceGrupoActivo && ceGrupoActivo.id_grupo === g.id_grupo ? 'active' : '';
        return `
        <div class="ce-cliente-item ${activo}" data-id-grupo="${g.id_grupo}">
            <div class="ce-cliente-avatar">${g.tipo_grupo === 'operativo_cliente' ? '🏢' : '👥'}</div>
            <div class="ce-cliente-main">
                <div class="ce-cliente-nombre">${esc(nombreCliente)}</div>
                <div class="ce-cliente-last">${last}</div>
            </div>
            ${g.no_leidos > 0 ? `<div class="ce-cliente-badge">${g.no_leidos > 99 ? '99+' : g.no_leidos}</div>` : ''}
        </div>`;
    }).join(''));

    $list.off('click.ce-cli', '.ce-cliente-item').on('click.ce-cli', '.ce-cliente-item', function () {
        const idGrupo = parseInt($(this).data('id-grupo'), 10);
        const g = ceGrupos.find((x) => x.id_grupo === idGrupo);
        if (g) ceSeleccionarCliente(g);
    });
}

// ════════════════════════════════════════════════════════════════
// COLUMNA DERECHA — detalle del cliente: chat general + visitas
// ════════════════════════════════════════════════════════════════
async function ceSeleccionarCliente(g) {
    ceGrupoActivo = g;
    ceVista = 'detalle';
    ceRenderClientes();

    const nombreCliente = (g.nombre || '').replace(/\s*·\s*Equipo.*$/i, '').replace(/^Equipo operativo\s*·\s*/i, '');
    $('#ce-col-detalle').html(`
        <div class="ce-detalle-header">
            <div>
                <h6>${esc(nombreCliente)}</h6>
                <small>${g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo'}</small>
            </div>
        </div>
        <div class="ce-detalle-body">
            <div class="ce-section-title">Chat general</div>
            <div class="ce-cliente-item" id="ce-chat-general-row">
                <div class="ce-cliente-avatar">💬</div>
                <div class="ce-cliente-main">
                    <div class="ce-cliente-nombre">Chat general del grupo</div>
                    <div class="ce-cliente-last">${g.ultimo_mensaje ? esc(g.ultimo_mensaje.mensaje || '') : 'Sin mensajes aún'}</div>
                </div>
            </div>
            <div class="ce-section-title">Visitas</div>
            <div id="ce-visitas-list"><div class="ce-empty-inline">Cargando…</div></div>
        </div>
    `);

    document.getElementById('ce-chat-general-row').addEventListener('click', () => ceAbrirChatGeneral(g));
    await ceCargarVisitas(g);
}

async function ceCargarVisitas(g) {
    let visitas = [];
    try {
        const res = await jget(`${API}/visitas-chat/${g.id_cliente}/${g.tipo_grupo}`);
        if (res && res.success) visitas = res.visitas || [];
    } catch (_) { /* deja vacío */ }
    ceVisitas = visitas;

    const $el = document.getElementById('ce-visitas-list');
    if (!$el) return; // el usuario ya navegó a otra vista

    if (!visitas.length) {
        $el.innerHTML = '<div class="ce-empty-inline">Todavía no hay chats de visita en este grupo.</div>';
        return;
    }
    $el.innerHTML = visitas.map((v) => `
        <div class="ce-cliente-item" data-id-visita="${v.id_visita}">
            <div class="ce-cliente-avatar">📍</div>
            <div class="ce-cliente-main">
                <div class="ce-cliente-nombre">Visita #${v.id_visita}${v.punto ? ' — ' + esc(v.punto) : ''}</div>
                <div class="ce-cliente-last">${esc(v.ultimo_mensaje || 'Sin mensajes aún')}</div>
            </div>
        </div>
    `).join('');
    $el.querySelectorAll('[data-id-visita]').forEach((row) => {
        row.addEventListener('click', () => {
            const idVisita = parseInt(row.getAttribute('data-id-visita'), 10);
            const v = visitas.find((x) => x.id_visita === idVisita);
            if (v) ceAbrirChatVisita(g, v);
        });
    });
}

// ════════════════════════════════════════════════════════════════
// VISTA DE CHAT (general o de visita) — comparten el mismo layout
// ════════════════════════════════════════════════════════════════
function ceChatShell(titulo, subtitulo, onBack) {
    $('#ce-col-detalle').html(`
        <div class="ce-detalle-header">
            <span class="ce-back-btn" id="ce-back-btn"><i class="bi bi-arrow-left"></i></span>
            <div>
                <h6>${esc(titulo)}</h6>
                <small>${esc(subtitulo)}</small>
            </div>
        </div>
        <div class="ce-messages" id="ce-messages"></div>
        <div class="ce-typing" id="ce-typing"></div>
        <div class="ce-footer">
            <input type="text" class="ce-input" id="ce-input" placeholder="Escribe un mensaje…">
            <button class="ce-send" id="ce-send"><i class="bi bi-send-fill"></i></button>
        </div>
    `);
    document.getElementById('ce-back-btn').addEventListener('click', onBack);
    document.getElementById('ce-send').addEventListener('click', ceEnviar);
    document.getElementById('ce-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); ceEnviar(); }
    });
    document.getElementById('ce-input').addEventListener('input', () => {
        if (!ceSocket || ceVista !== 'chat-general' || !ceGrupoActivo) return;
        ceSocket.emit('typing_grupo', { id_grupo: ceGrupoActivo.id_grupo, username: ceUsername, is_typing: true });
        clearTimeout(ceTypingTimer);
        ceTypingTimer = setTimeout(() => {
            ceSocket.emit('typing_grupo', { id_grupo: ceGrupoActivo.id_grupo, username: ceUsername, is_typing: false });
        }, 1200);
    });
}

async function ceAbrirChatGeneral(g) {
    ceVista = 'chat-general';
    ceVisitaActiva = null;
    ceMensajeEls = {};
    ceChatShell(
        (g.nombre || '').replace(/\s*·\s*Equipo.*$/i, '').replace(/^Equipo operativo\s*·\s*/i, ''),
        'Chat general · ' + (g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo'),
        () => ceSeleccionarCliente(g),
    );

    const sock = await ceConnectSocket();
    if (sock) sock.emit('join_grupo', { id_grupo: g.id_grupo, username: ceUsername });

    const res = await jget(`${API}/${g.id_grupo}/mensajes?limit=50`);
    if (res && res.success) (res.mensajes || []).forEach(ceAppendMensaje);
    await jpost(`${API}/${g.id_grupo}/marcar-leido`);
    g.no_leidos = 0;
}

async function ceAbrirChatVisita(g, v) {
    ceVista = 'chat-visita';
    ceVisitaActiva = v;
    ceMensajeEls = {};
    ceChatShell(
        `Visita #${v.id_visita}`,
        (g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo') + (v.punto ? ' — ' + v.punto : ''),
        () => ceSeleccionarCliente(g),
    );

    const sock = await ceConnectSocket();
    if (sock) sock.emit('join_grupo_visita', {
        id_cliente: g.id_cliente, tipo_grupo: g.tipo_grupo, id_visita: v.id_visita, username: ceUsername,
    });

    try {
        const res = await jget(`${API}/visita-mensajes/${g.id_cliente}/${g.tipo_grupo}/${v.id_visita}`);
        if (res && res.success) (res.mensajes || []).forEach(ceAppendMensaje);
    } catch (_) { /* el usuario puede igual escribir */ }
    await ceMarcarLeidoVisita(g, v.id_visita);
}

function ceEnviar() {
    const input = document.getElementById('ce-input');
    const txt = (input.value || '').trim();
    if (!txt || !ceSocket) return;
    if (ceVista === 'chat-visita' && ceGrupoActivo && ceVisitaActiva) {
        ceSocket.emit('send_message_grupo_visita', {
            id_cliente: ceGrupoActivo.id_cliente,
            tipo_grupo: ceGrupoActivo.tipo_grupo,
            id_visita: ceVisitaActiva.id_visita,
            mensaje: txt,
            username: ceUsername,
        });
    } else if (ceVista === 'chat-general' && ceGrupoActivo) {
        ceSocket.emit('send_message_grupo', { id_grupo: ceGrupoActivo.id_grupo, mensaje: txt, username: ceUsername });
    } else {
        return;
    }
    input.value = '';
}
