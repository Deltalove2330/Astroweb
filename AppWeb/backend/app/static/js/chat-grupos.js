/* chat-grupos.js — widget flotante de Grupos de Chat por cliente.
 *
 * Autocontenido: se inyecta solo si el usuario pertenece a algún grupo.
 * Historial inicial por REST (/api/chat-grupos/...) y tiempo real por el
 * namespace socket /chat_grupo. Sin dependencias salvo socket.io (lo carga
 * bajo demanda si la página no lo trae).
 */
(function () {
    'use strict';

    const API = '/api/chat-grupos';
    let username = 'Usuario';
    let socket = null;             // namespace /chat_grupo — grupo general y sub-hilos de visita comparten conexion
    let grupos = [];                // [{id_grupo, nombre, tipo_grupo, no_leidos, ultimo_mensaje}]
    let grupoActivo = null;         // id_grupo abierto (vista chat_grupo)
    let grupoParaVisitas = null;    // {id_grupo, id_cliente, tipo_grupo, nombre} — contexto al listar/abrir visitas
    let visitaActiva = null;        // id_visita abierto (vista chat_visita)
    let tabActivo = 'operativo_cliente'; // pestaña de la lista: 'operativo_cliente' | 'operativo'
    let dom = {};
    let typingTimer = null;

    // ── Utilidades ──────────────────────────────────────────────
    function el(tag, cls, txt) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        if (txt != null) e.textContent = txt;
        return e;
    }
    function fmtHora(iso) {
        if (!iso) return '';
        try {
            const d = new Date(iso);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (_) { return ''; }
    }
    async function jget(url) {
        const r = await fetch(url, { credentials: 'same-origin' });
        return r.json();
    }
    async function jpost(url) {
        const r = await fetch(url, { method: 'POST', credentials: 'same-origin' });
        return r.json();
    }

    // ── Carga de socket.io si falta ─────────────────────────────
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

    async function connectSocket() {
        if (socket) return socket;
        await ensureSocketLib();
        if (typeof io === 'undefined') return null;
        socket = io('/chat_grupo', { transports: ['websocket', 'polling'] });

        socket.on('new_message_grupo', (m) => {
            if (m.id_grupo === grupoActivo) {
                appendMensaje(m);
                marcarLeido(grupoActivo);
            } else {
                const g = grupos.find(x => x.id_grupo === m.id_grupo);
                if (g) { g.no_leidos = (g.no_leidos || 0) + 1; g.ultimo_mensaje = m; }
                actualizarBadges();
            }
        });
        socket.on('user_typing_grupo', (d) => {
            if (!dom.typing) return;
            dom.typing.textContent = d.is_typing ? `${d.username || ''} está escribiendo…` : '';
        });
        socket.on('grupo_error', (d) => console.warn('[chat-grupos]', d && d.error));

        // ── Sub-hilo por visita (mismo namespace, eventos propios) ──
        socket.on('new_message_grupo_visita', (m) => {
            if (visitaActiva && m.id_visita === visitaActiva) {
                appendMensaje(m);
            }
        });
        return socket;
    }

    // ── Render de la lista de grupos ────────────────────────────
    function totalNoLeidos() {
        return grupos.reduce((a, g) => a + (g.no_leidos || 0), 0);
    }
    function actualizarBadges() {
        const total = totalNoLeidos();
        dom.fabBadge.textContent = total > 99 ? '99+' : String(total);
        dom.fabBadge.classList.toggle('show', total > 0);
        // No pisar la vista si el usuario está mirando visitas de un grupo o
        // un sub-hilo de visita (grupoActivo queda null en esos casos, pero
        // no significa que esté en la lista de grupos).
        if (!grupoActivo && !grupoParaVisitas) renderLista();
    }
    function renderLista() {
        grupoParaVisitas = null;
        visitaActiva = null;
        dom.header.classList.remove('in-chat');
        dom.title.textContent = 'Grupos';
        dom.sub.textContent = '';
        dom.footer.classList.remove('show');
        if (dom.visitasBtn) dom.visitasBtn.style.display = 'none';
        dom.body.innerHTML = '';

        if (!grupos.length) {
            dom.body.appendChild(el('div', 'cg-empty', 'No perteneces a ningún grupo todavía.'));
            return;
        }

        // Pestañas Equipo+Cliente / Solo Equipo — mismo listado de grupos,
        // filtrado por tipo_grupo (cada cliente tiene un grupo de cada tipo).
        const tabs = el('div', 'cg-tabs');
        [
            { key: 'operativo_cliente', label: '🏢 Equipo + Cliente' },
            { key: 'operativo',         label: '👥 Solo Equipo' },
        ].forEach(t => {
            const btn = el('button', 'cg-tab-btn' + (tabActivo === t.key ? ' active' : ''), t.label);
            btn.addEventListener('click', () => { tabActivo = t.key; renderLista(); });
            tabs.appendChild(btn);
        });
        dom.body.appendChild(tabs);

        const filtrados = grupos.filter(g => g.tipo_grupo === tabActivo);
        if (!filtrados.length) {
            dom.body.appendChild(el('div', 'cg-empty', 'No tenés clientes en esta sección todavía.'));
            return;
        }
        filtrados.forEach(g => {
            const item = el('div', 'cg-list-item');
            const av = el('div', 'cg-list-avatar');
            av.textContent = g.tipo_grupo === 'operativo_cliente' ? '🏢' : '👥';
            const main = el('div', 'cg-list-main');
            main.appendChild(el('div', 'cg-list-name', g.nombre || `Grupo ${g.id_grupo}`));
            const last = g.ultimo_mensaje
                ? `${g.ultimo_mensaje.username || ''}: ${g.ultimo_mensaje.mensaje || ''}`
                : 'Sin mensajes aún';
            main.appendChild(el('div', 'cg-list-last', last));
            const badge = el('div', 'cg-list-badge');
            badge.textContent = g.no_leidos > 99 ? '99+' : String(g.no_leidos || 0);
            badge.classList.toggle('show', (g.no_leidos || 0) > 0);
            item.appendChild(av);
            item.appendChild(main);
            item.appendChild(badge);
            item.addEventListener('click', () => abrirGrupo(g));
            dom.body.appendChild(item);
        });
    }

    // ── Vista de chat de un grupo ───────────────────────────────
    function appendMensaje(m) {
        const cont = dom.body.querySelector('.cg-messages');
        if (!cont) return;
        const wrap = el('div', 'cg-msg ' + (m.tipo_mensaje === 'sistema' ? 'sys' : (m.es_mio ? 'out' : 'in')));
        if (m.tipo_mensaje !== 'sistema' && !m.es_mio) {
            wrap.appendChild(el('div', 'cg-msg-author', m.username || ''));
        }
        wrap.appendChild(el('div', 'cg-msg-text', m.mensaje || ''));
        wrap.appendChild(el('div', 'cg-msg-time', fmtHora(m.fecha_envio)));
        cont.appendChild(wrap);
        dom.body.scrollTop = dom.body.scrollHeight;
    }

    async function abrirGrupo(g) {
        grupoActivo = g.id_grupo;
        grupoParaVisitas = null;
        visitaActiva = null;
        dom.header.classList.add('in-chat');
        dom.title.textContent = g.nombre || `Grupo ${g.id_grupo}`;
        dom.sub.textContent = g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo';
        dom.body.innerHTML = '';
        const cont = el('div', 'cg-messages');
        dom.body.appendChild(cont);
        dom.footer.classList.add('show');
        if (dom.visitasBtn) dom.visitasBtn.style.display = 'inline';

        const sock = await connectSocket();
        if (sock) sock.emit('join_grupo', { id_grupo: g.id_grupo, username });

        const res = await jget(`${API}/${g.id_grupo}/mensajes?limit=50`);
        if (res && res.success) {
            (res.mensajes || []).forEach(appendMensaje);
        }
        await marcarLeido(g.id_grupo);
        g.no_leidos = 0;
        actualizarBadges();
    }

    async function marcarLeido(id_grupo) {
        try {
            await jpost(`${API}/${id_grupo}/marcar-leido`);
            if (socket) socket.emit('mark_read_grupo', { id_grupo, username });
        } catch (_) { /* no crítico */ }
    }

    // ── Vista: lista de visitas con chat ya iniciado, para un grupo ─────
    async function mostrarVisitasDelGrupo(g) {
        grupoParaVisitas = g;
        grupoActivo = null;
        visitaActiva = null;
        dom.header.classList.add('in-chat');
        dom.title.textContent = 'Chats por visita';
        dom.sub.textContent = g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo';
        dom.footer.classList.remove('show');
        if (dom.visitasBtn) dom.visitasBtn.style.display = 'none';
        dom.body.innerHTML = '';

        let visitas = [];
        try {
            const res = await jget(`${API}/visitas-chat/${g.id_cliente}/${g.tipo_grupo}`);
            if (res && res.success) visitas = res.visitas || [];
        } catch (_) { /* deja la lista vacía */ }

        if (!visitas.length) {
            dom.body.appendChild(el('div', 'cg-empty', 'Todavía no hay chats de visita en este grupo.'));
            return;
        }
        visitas.forEach(v => {
            const item = el('div', 'cg-list-item');
            const av = el('div', 'cg-list-avatar');
            av.textContent = '📍';
            const main = el('div', 'cg-list-main');
            main.appendChild(el('div', 'cg-list-name', `Visita #${v.id_visita}` + (v.punto ? ' — ' + v.punto : '')));
            main.appendChild(el('div', 'cg-list-last', v.ultimo_mensaje || 'Sin mensajes aún'));
            item.appendChild(av);
            item.appendChild(main);
            item.addEventListener('click', () => abrirVisitaChat(g, v));
            dom.body.appendChild(item);
        });
    }

    // ── Vista: sub-hilo de chat de UNA visita dentro del grupo ──────────
    async function abrirVisitaChat(g, v) {
        grupoParaVisitas = g;
        grupoActivo = null;
        visitaActiva = v.id_visita;
        dom.header.classList.add('in-chat');
        dom.title.textContent = `Visita #${v.id_visita}`;
        dom.sub.textContent = (g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo') + (v.punto ? ' — ' + v.punto : '');
        dom.body.innerHTML = '';
        const cont = el('div', 'cg-messages');
        dom.body.appendChild(cont);
        dom.footer.classList.add('show');
        if (dom.visitasBtn) dom.visitasBtn.style.display = 'none';

        const sock = await connectSocket();
        if (sock) sock.emit('join_grupo_visita', {
            id_cliente: g.id_cliente, tipo_grupo: g.tipo_grupo, id_visita: v.id_visita, username,
        });

        try {
            const res = await jget(`${API}/visita-mensajes/${g.id_cliente}/${g.tipo_grupo}/${v.id_visita}`);
            if (res && res.success) (res.mensajes || []).forEach(appendMensaje);
        } catch (_) { /* chat queda vacío, el usuario puede igual escribir */ }
    }

    function enviar() {
        const txt = (dom.input.value || '').trim();
        if (!txt || !socket) return;
        if (visitaActiva !== null && grupoParaVisitas) {
            socket.emit('send_message_grupo_visita', {
                id_cliente: grupoParaVisitas.id_cliente,
                tipo_grupo: grupoParaVisitas.tipo_grupo,
                id_visita: visitaActiva,
                mensaje: txt,
                username,
            });
        } else if (grupoActivo) {
            socket.emit('send_message_grupo', { id_grupo: grupoActivo, mensaje: txt, username });
        } else {
            return;
        }
        dom.input.value = '';
    }

    // Navegación jerárquica: chat de visita → lista de visitas → chat del
    // grupo → lista de grupos, un nivel por click en "atrás".
    function volver() {
        if (visitaActiva !== null) {
            if (socket && grupoParaVisitas) {
                socket.emit('leave_grupo_visita', {
                    id_cliente: grupoParaVisitas.id_cliente,
                    tipo_grupo: grupoParaVisitas.tipo_grupo,
                    id_visita: visitaActiva,
                });
            }
            visitaActiva = null;
            mostrarVisitasDelGrupo(grupoParaVisitas);
        } else if (grupoParaVisitas !== null) {
            const g = grupoParaVisitas;
            grupoParaVisitas = null;
            abrirGrupo(g);
        } else if (grupoActivo !== null) {
            grupoActivo = null;
            renderLista();
        }
    }

    // ── Construcción del DOM del widget ─────────────────────────
    function construirWidget() {
        // CSS
        if (!document.getElementById('cg-css')) {
            const link = document.createElement('link');
            link.id = 'cg-css';
            link.rel = 'stylesheet';
            link.href = '/static/css/chat-grupos.css';
            document.head.appendChild(link);
        }

        const fab = el('button', 'cg-fab');
        fab.innerHTML = '<i class="bi bi-people-fill"></i>';
        fab.setAttribute('aria-label', 'Grupos de chat');
        const fabBadge = el('span', 'cg-fab-badge');
        fab.appendChild(fabBadge);

        const panel = el('div', 'cg-panel');
        const header = el('div', 'cg-header');
        const back = el('span', 'cg-back');
        back.innerHTML = '<i class="bi bi-arrow-left"></i>';
        const titleWrap = el('div', '', '');
        titleWrap.style.cssText = 'flex:1;min-width:0;';
        const title = el('div', 'cg-title', 'Grupos');
        const sub = el('div', 'cg-sub', '');
        titleWrap.appendChild(title);
        titleWrap.appendChild(sub);
        const visitasBtn = el('span', 'cg-visitas-btn');
        visitasBtn.innerHTML = '<i class="bi bi-signpost-split"></i>';
        visitasBtn.title = 'Chats por visita';
        visitasBtn.style.cssText = 'cursor:pointer; margin-right:10px; display:none;';
        const close = el('span', 'cg-close');
        close.innerHTML = '<i class="bi bi-x-lg"></i>';
        close.style.cssText = 'cursor:pointer;';
        header.appendChild(back);
        header.appendChild(titleWrap);
        header.appendChild(visitasBtn);
        header.appendChild(close);

        const body = el('div', 'cg-body');
        const typing = el('div', 'cg-typing');

        const footer = el('div', 'cg-footer');
        const input = el('input', 'cg-input');
        input.type = 'text';
        input.placeholder = 'Escribe un mensaje…';
        const send = el('button', 'cg-send');
        send.innerHTML = '<i class="bi bi-send-fill"></i>';
        footer.appendChild(input);
        footer.appendChild(send);

        panel.appendChild(header);
        panel.appendChild(body);
        panel.appendChild(typing);
        panel.appendChild(footer);

        document.body.appendChild(fab);
        document.body.appendChild(panel);

        dom = { fab, fabBadge, panel, header, title, sub, body, footer, input, send, typing, visitasBtn };

        // Eventos
        fab.addEventListener('click', () => {
            panel.classList.toggle('open');
            if (panel.classList.contains('open') && !grupoActivo && !grupoParaVisitas) renderLista();
        });
        close.addEventListener('click', () => panel.classList.remove('open'));
        back.addEventListener('click', volver);
        visitasBtn.addEventListener('click', () => {
            const g = grupos.find(x => x.id_grupo === grupoActivo);
            if (g) mostrarVisitasDelGrupo(g);
        });
        send.addEventListener('click', enviar);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); enviar(); }
        });
        input.addEventListener('input', () => {
            // El indicador de "escribiendo" solo aplica al chat general del
            // grupo por ahora (no crítico para el sub-hilo de visita).
            if (!socket || !grupoActivo) return;
            socket.emit('typing_grupo', { id_grupo: grupoActivo, username, is_typing: true });
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                socket.emit('typing_grupo', { id_grupo: grupoActivo, username, is_typing: false });
            }, 1200);
        });
    }

    // ── Arranque ────────────────────────────────────────────────
    
    // Exponer globalmente para abrir chats directamente desde el dashboard (ej: dropdown Equipo+Cliente)
    window.openChatGrupoForClient = async function(id_cliente, tipo_grupo) {
        if (!id_cliente) return;
        
        let g = grupos.find(x => x.id_cliente == id_cliente && x.tipo_grupo === tipo_grupo);
        if (!g) {
            try {
                // Fetch group info directly if not in our initial list (useful for admins)
                const res = await jget(`${API}/info-cliente/${id_cliente}/${tipo_grupo}`);
                if (res && res.success && res.grupo) {
                    g = res.grupo;
                    grupos.push(g);
                } else {
                    Swal.fire('Error', 'No se encontró un grupo de chat activo para este cliente.', 'error');
                    return;
                }
            } catch (e) {
                console.error("Error fetching group:", e);
                return;
            }
        }
        
        if (!dom.panel) {
            construirWidget();
            // Since we are forcing it open without the default FAB click, we might need to hide the FAB if it shouldn't show, but usually building it is fine.
            dom.fab.style.display = 'flex'; // Ensure FAB exists
        }
        
        dom.panel.classList.add('open');
        abrirGrupo(g);
    };

    // Exponer globalmente para abrir/crear el sub-hilo de chat de UNA visita
    // directamente — ej. desde el ícono de chat de "Todas las Activaciones"
    // en Centro de Mando. meta es opcional: { punto }.
    window.openVisitaChatWidget = async function(id_cliente, tipo_grupo, id_visita, meta) {
        if (!id_cliente || !tipo_grupo || !id_visita) return;

        let g = grupos.find(x => x.id_cliente == id_cliente && x.tipo_grupo === tipo_grupo);
        if (!g) {
            try {
                const res = await jget(`${API}/info-cliente/${id_cliente}/${tipo_grupo}`);
                if (res && res.success && res.grupo) {
                    g = res.grupo;
                    grupos.push(g);
                } else {
                    Swal.fire('Error', 'No se encontró un grupo de chat activo para este cliente.', 'error');
                    return;
                }
            } catch (e) {
                console.error('Error fetching group:', e);
                return;
            }
        }

        if (!dom.panel) {
            construirWidget();
            dom.fab.style.display = 'flex';
        }

        dom.panel.classList.add('open');
        abrirVisitaChat(g, { id_visita, punto: meta && meta.punto });
    };

    // Exponer globalmente para abrir el panel de grupos desde un link del
    // sidebar (en vez de solo el FAB flotante) — ej. "Chats de Equipo".
    window.openChatGruposSidebar = async function() {
        if (!grupos.length) {
            try {
                const res = await jget(`${API}/mis-grupos`);
                if (res && res.success && Array.isArray(res.grupos)) grupos = res.grupos;
            } catch (_) { /* deja grupos como estaba */ }
        }
        if (!dom.panel) {
            construirWidget();
            dom.fab.style.display = 'flex';
        }
        dom.panel.classList.add('open');
        grupoActivo = null;
        renderLista();
    };

    async function init() {
        try {
            const cu = await jget('/api/current-user');
            if (cu && cu.username) username = cu.username;
        } catch (_) { /* sigue con fallback */ }

        let res;
        try {
            res = await jget(`${API}/mis-grupos`);
        } catch (_) { return; }
        if (!res || !res.success || !Array.isArray(res.grupos) || !res.grupos.length) {
            return; // sin grupos → no se muestra el widget
        }
        grupos = res.grupos;
        construirWidget();
        actualizarBadges();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
