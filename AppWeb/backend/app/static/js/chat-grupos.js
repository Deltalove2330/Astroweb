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
    let socket = null;
    let grupos = [];           // [{id_grupo, nombre, tipo_grupo, no_leidos, ultimo_mensaje}]
    let grupoActivo = null;    // id_grupo abierto
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
        if (!grupoActivo) renderLista();
    }
    function renderLista() {
        dom.header.classList.remove('in-chat');
        dom.title.textContent = 'Grupos';
        dom.sub.textContent = '';
        dom.footer.classList.remove('show');
        dom.body.innerHTML = '';
        if (!grupos.length) {
            dom.body.appendChild(el('div', 'cg-empty', 'No perteneces a ningún grupo todavía.'));
            return;
        }
        grupos.forEach(g => {
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
        dom.header.classList.add('in-chat');
        dom.title.textContent = g.nombre || `Grupo ${g.id_grupo}`;
        dom.sub.textContent = g.tipo_grupo === 'operativo_cliente' ? 'Equipo + Cliente' : 'Equipo operativo';
        dom.body.innerHTML = '';
        const cont = el('div', 'cg-messages');
        dom.body.appendChild(cont);
        dom.footer.classList.add('show');

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

    function enviar() {
        const txt = (dom.input.value || '').trim();
        if (!txt || !grupoActivo || !socket) return;
        socket.emit('send_message_grupo', { id_grupo: grupoActivo, mensaje: txt, username });
        dom.input.value = '';
    }

    function volverLista() {
        grupoActivo = null;
        renderLista();
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
        const close = el('span', 'cg-close');
        close.innerHTML = '<i class="bi bi-x-lg"></i>';
        close.style.cssText = 'cursor:pointer;';
        header.appendChild(back);
        header.appendChild(titleWrap);
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

        dom = { fab, fabBadge, panel, header, title, sub, body, footer, input, send, typing };

        // Eventos
        fab.addEventListener('click', () => {
            panel.classList.toggle('open');
            if (panel.classList.contains('open') && !grupoActivo) renderLista();
        });
        close.addEventListener('click', () => panel.classList.remove('open'));
        back.addEventListener('click', volverLista);
        send.addEventListener('click', enviar);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); enviar(); }
        });
        input.addEventListener('input', () => {
            if (!socket || !grupoActivo) return;
            socket.emit('typing_grupo', { id_grupo: grupoActivo, username, is_typing: true });
            clearTimeout(typingTimer);
            typingTimer = setTimeout(() => {
                socket.emit('typing_grupo', { id_grupo: grupoActivo, username, is_typing: false });
            }, 1200);
        });
    }

    // ── Arranque ────────────────────────────────────────────────
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
