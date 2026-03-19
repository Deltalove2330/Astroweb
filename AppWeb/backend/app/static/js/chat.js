// app/static/js/chat.js
// Sistema de Chat en Tiempo Real por Visita

let currentChatVisitId = null;
let typingTimer = null;
let isTyping = false;
let chatEventsRegistered = false;
let chatSocket = null;
let connectionTimeout = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;


function getChatSocket() {
    if (chatSocket && chatSocket.connected) {
        return chatSocket;
    }
    
    console.log('🔌 Creando nueva conexión a /chat');
    
    chatSocket = io.connect(window.location.origin + '/chat', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
        timeout: 10000,
        forceNew: false
    });
    
    return chatSocket;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 [CHAT] Inicializando...');
    
    let attempts = 0;
    const waitForSocket = setInterval(() => {
        attempts++;
        const socket = getChatSocket();
        if (socket) {
            console.log('✅ [CHAT] Socket encontrado');
            clearInterval(waitForSocket);
            registerChatEvents(socket);
            setupChatUI();
        } else if (attempts >= 50) {
            clearInterval(waitForSocket);
        }
    }, 100);
});

function registerChatEvents(socket) {
    if (chatEventsRegistered) return;
    
    console.log('📝 [CHAT] Registrando eventos...');
    chatEventsRegistered = true;
    chatSocket = socket;

    // ✅ EVENTOS DE CONEXIÓN
    socket.off('connect');
    socket.on('connect', function() {
        console.log('🟢 [CHAT] Conectado a /chat - SID:', socket.id);
        reconnectAttempts = 0;
        
        // Si había una sala abierta, reconectar
        if (currentChatVisitId) {
            console.log('🔄 [CHAT] Reconectando a visita:', currentChatVisitId);
            joinChatRoom(currentChatVisitId);
        }
    });
    
    socket.off('disconnect');
    socket.on('disconnect', function(reason) {
        console.log('🔴 [CHAT] Desconectado de /chat. Razón:', reason);
        chatEventsRegistered = false;
    });
    
    socket.off('connect_error');
    socket.on('connect_error', function(error) {
        console.error('❌ [CHAT] Error de conexión:', error);
        reconnectAttempts++;
        
        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.error('❌ [CHAT] Máximo de intentos alcanzado');
            showChatError('No se pudo conectar al chat. Por favor, recarga la página.');
        }
    });
    
    socket.off('connection_status');
    socket.on('connection_status', function(data) {
        console.log('📡 [CHAT] Estado de conexión:', data);
    });
    
    socket.off('chat_history');
    socket.on('chat_history', function(data) {
        console.log('📨 [CHAT] Historial:', data);
        if (data.success) {
            renderChatHistory(data.mensajes);
        }
    });
    
    // ✅ USAR id_visita (snake_case como envía el backend)
    socket.off('new_message');
    socket.on('new_message', function(msg) {
        console.log('💬 [CHAT] NUEVO MENSAJE:');
        console.log('   - ID mensaje:', msg.id_mensaje);
        console.log('   - ID visita (backend):', msg.id_visita, typeof msg.id_visita);
        console.log('   - Visit ID actual:', currentChatVisitId, typeof currentChatVisitId);
        console.log('   - Username:', msg.username);
        console.log('   - Tipo:', msg.tipo_mensaje);
        
        // ✅ COMPARAR USANDO id_visita (con underscore)
        if (parseInt(msg.id_visita) === parseInt(currentChatVisitId)) {
            console.log('✅ [CHAT] Agregando mensaje...');
            appendMessageToChat(msg, true);
            scrollChatToBottom();

            // Guardar id_foto del último rechazo recibido
    if (msg.tipo_mensaje === 'sistema' && msg.metadata) {
        try {
            const meta = typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata;
            if (meta && meta.id_foto) {
                window.lastRejectedPhotoId = meta.id_foto;
                console.log('📌 [CHAT] ID foto rechazada guardada:', window.lastRejectedPhotoId);
            }
        } catch(e) {}
    }
            
            if (msg.id_usuario !== window.currentUserId) {
                markMessageAsRead(msg.id_mensaje);
            }
        } else {
            console.log('⚠️ [CHAT] Visita diferente:', parseInt(msg.id_visita), 'vs', parseInt(currentChatVisitId));
        }
    });
    
    socket.off('user_joined_chat');
    socket.on('user_joined_chat', function(data) {
        // ✅ USAR visit_id aquí (como viene del backend en este evento)
        if (parseInt(data.visit_id) === parseInt(currentChatVisitId)) {
            showChatNotification(`${data.username} se unió`);
        }
    });
    
    socket.off('user_left_chat');
    socket.on('user_left_chat', function(data) {
        if (parseInt(data.visit_id) === parseInt(currentChatVisitId)) {
            showChatNotification(`${data.username} salió`);
        }
    });
    
    socket.off('message_read');
    socket.on('message_read', function(data) {
        updateMessageReadStatus(data.id_mensaje);
    });
    
    socket.off('user_typing');
    socket.on('user_typing', function(data) {
        if (parseInt(data.visit_id) === parseInt(currentChatVisitId)) {
            showTypingIndicator(data.username, data.is_typing);
        }
    });
    
    socket.off('chat_error');
    socket.on('chat_error', function(data) {
        console.error('❌ [CHAT] Error:', data.error);
        showChatError(data.error);
    });
    
    console.log('✅ [CHAT] Eventos registrados');
}

function setupChatUI() {
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    
    if (!chatInput || !chatSendBtn) {
        setTimeout(setupChatUI, 200);
        return;
    }
    
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        if (!isTyping && this.value.trim().length > 0) {
            isTyping = true;
            sendTypingIndicator(true);
        }
        
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            isTyping = false;
            sendTypingIndicator(false);
        }, 1000);
    });
    
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    
    chatSendBtn.addEventListener('click', sendChatMessage);
    
    $('#chatModal').on('hidden.bs.modal', function() {
        leaveChatRoom();
    });
}

function openChatModal(visitId) {
    console.log('🔓 [CHAT] Abriendo modal:', visitId);
    currentChatVisitId = parseInt(visitId);
    
    document.getElementById('chatVisitId').textContent = visitId;
    
    const container = document.getElementById('chatMessages');
    container.innerHTML = '<div class="chat-loading"><div class="spinner-border text-primary"></div><p class="mt-2">Cargando...</p></div>';
    
    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
    
    // ✅ TIMEOUT DE SEGURIDAD
    connectionTimeout = setTimeout(() => {
        console.warn('⏱️ [CHAT] Timeout de conexión');
        const container = document.getElementById('chatMessages');
        if (container && container.innerHTML.includes('spinner')) {
            container.innerHTML = '<div class="chat-empty"><i class="bi bi-exclamation-triangle"></i><p>Error al conectar</p><small>Intenta recargar la página</small></div>';
        }
    }, 10000);
    
    // Esperar un poco para que el socket se conecte
    setTimeout(() => {
        const socket = getChatSocket();
        if (socket && socket.connected) {
            joinChatRoom(visitId);
        } else {
            console.warn('⚠️ [CHAT] Socket no conectado, reintentando...');
            setTimeout(() => {
                const socket2 = getChatSocket();
                if (socket2 && socket2.connected) {
                    joinChatRoom(visitId);
                } else {
                    showChatError('No se pudo conectar al chat');
                }
            }, 2000);
        }
    }, 500);
}

function joinChatRoom(visitId) {
    const socket = getChatSocket();
    if (!socket || !socket.connected) {
        console.error('❌ [CHAT] Socket no conectado');
        showChatError('Socket no conectado');
        return;
    }
    
    // Intentar obtener username de todas las fuentes posibles
    const metaUsername = document.querySelector('meta[name="username"]')?.content;
    const username = (metaUsername && metaUsername.trim() !== '')
        ? metaUsername
        : (window.currentUsername || window.currentUserName || window.userName || '');

    console.log('🚪 [CHAT] Uniéndose con username:', username);
    
    socket.emit('join_chat', {
        visit_id: parseInt(visitId),
        username: username
    });
}
function leaveChatRoom() {
    if (!currentChatVisitId) return;
    
    const socket = getChatSocket();
    if (socket) {
        const username = window.currentUsername || window.currentUserName || 'Usuario';
        socket.emit('leave_chat', {
            visit_id: currentChatVisitId,
            username: username
        });
    }
    
    currentChatVisitId = null;

    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
}

function renderChatHistory(mensajes) {
    console.log('📋 [CHAT] Renderizando', mensajes.length, 'mensajes');

    if (connectionTimeout) {
        clearTimeout(connectionTimeout);
        connectionTimeout = null;
    }
    
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    if (!mensajes || mensajes.length === 0) {
        container.innerHTML = '<div class="chat-empty"><i class="bi bi-chat-text"></i><p>No hay mensajes aún.</p></div>';
        return;
    }
    
    mensajes.forEach(msg => appendMessageToChat(msg, false));
    scrollChatToBottom();
}

function appendMessageToChat(msg, animate = true) {
    console.log('➕ [CHAT] Agregando mensaje:');
    console.log('   - Texto:', msg.mensaje);
    console.log('   - Username:', msg.username);
    console.log('   - Tipo:', msg.tipo_mensaje);
    
    const container = document.getElementById('chatMessages');
    if (!container) {
        console.error('❌ Container no encontrado');
        return;
    }
    
    const toRemove = container.querySelector('.chat-empty, .chat-loading');
    if (toRemove) {
        toRemove.remove();
    }
    
    const messageDiv = document.createElement('div');
    
    if (msg.tipo_mensaje === 'sistema') {
        messageDiv.className = 'chat-message-system';
        
        // Construir URL de imagen si existe file_path en metadata
        let imgHtml = '';
        if (msg.metadata) {
            try {
                const meta = typeof msg.metadata === 'string'
                    ? JSON.parse(msg.metadata)
                    : msg.metadata;
                if (meta && meta.file_path) {
                    const imgUrl = '/api/image/' + encodeURIComponent(meta.file_path);
                    imgHtml = `
                        <div class="chat-rejected-photo" style="margin:0.75rem 0;">
                            <img 
                                src="${imgUrl}" 
                                alt="Foto rechazada"
                                style="
                                    max-width:100%;
                                    max-height:220px;
                                    border-radius:8px;
                                    cursor:pointer;
                                    border:2px solid #ffc107;
                                    display:block;
                                    margin:0 auto;
                                    object-fit:cover;
                                "
                                onclick="chatOpenPhotoLightbox('${imgUrl}')"
                                onerror="this.style.display='none'"
                                loading="lazy"
                            />
                            <small style="display:block;text-align:center;margin-top:0.3rem;color:#856404;font-size:0.75rem;">
                                <i class="bi bi-zoom-in"></i> Click para ver en grande
                            </small>
                        </div>`;
                }
            } catch(e) {
                console.warn('[CHAT] Error parseando metadata para imagen:', e);
            }
        }

        messageDiv.innerHTML = `
            <div class="system-message-content">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div class="system-message-text">${escapeHtml(msg.mensaje).replace(/\n/g, '<br>')}</div>
                ${imgHtml}
                <small class="text-muted">${formatChatTime(msg.fecha_envio)}</small>
            </div>
        `;
    } else {
        const isMine = msg.id_usuario === window.currentUserId;
        
        messageDiv.className = `chat-message ${isMine ? 'chat-message-mine' : 'chat-message-other'}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                <div class="message-username">${escapeHtml(msg.username)}</div>
                <div class="message-text">${escapeHtml(msg.mensaje)}</div>
                <div class="message-footer">
                    <small class="message-time">${formatChatTime(msg.fecha_envio)}</small>
                    ${isMine ? `<span class="message-status" data-msg-id="${msg.id_mensaje}">
                        <i class="bi bi-check${msg.visto ? '-all text-primary' : ''}"></i>
                    </span>` : ''}
                </div>
            </div>
        `;
    }
    
    if (animate) {
        messageDiv.style.opacity = '0';
        messageDiv.style.transform = 'translateY(10px)';
    }
    
    container.appendChild(messageDiv);
    console.log('✅ [CHAT] Mensaje agregado');
    
    if (animate) {
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();
    
    if (!mensaje || !currentChatVisitId) return;
    
    const socket = getChatSocket();
    if (!socket) {
        showChatError('Socket no conectado');
        return;
    }
    
    const metaUsername = document.querySelector('meta[name="username"]')?.content;
    const username = (metaUsername && metaUsername.trim() !== '')
        ? metaUsername
        : (window.currentUsername || window.currentUserName || '');

    console.log('📤 [CHAT] Enviando con username:', username);
    
    socket.emit('send_message', {
        visit_id: currentChatVisitId,
        username: username,
        mensaje: mensaje
    });
    
    input.value = '';
    input.style.height = 'auto';
    isTyping = false;
    sendTypingIndicator(false);
}

function markMessageAsRead(messageId) {
    const socket = getChatSocket();
    if (!socket || !currentChatVisitId) return;

    // Leer username del analista desde el meta tag (igual que joinChatRoom)
    const metaUsername = document.querySelector('meta[name="username"]')?.content;

    socket.emit('mark_message_read', {
        id_mensaje: messageId,
        visit_id:   currentChatVisitId,
        username:   metaUsername || ''   // ← el analista envía su username
    });
}

function updateMessageReadStatus(messageId) {
    const el = document.querySelector(`[data-msg-id="${messageId}"]`);
    if (el) {
        el.innerHTML = '<i class="bi bi-check-all text-primary"></i>';
    }
}

function sendTypingIndicator(typing) {
    const socket = getChatSocket();
    if (!socket || !currentChatVisitId) return;
    
    const username = window.currentUsername || window.currentUserName || 'Usuario';
    socket.emit('typing_indicator', {
        visit_id: currentChatVisitId,
        username: username,
        is_typing: typing
    });
}

function showTypingIndicator(username, typing) {
    const indicator = document.getElementById('typingIndicator');
    if (!indicator) return;
    
    const span = indicator.querySelector('.typing-username');
    if (typing) {
        span.textContent = username;
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

function scrollChatToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }
}

function showChatNotification(msg) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-notification';
    div.innerHTML = `<small>${msg}</small>`;
    container.appendChild(div);
    scrollChatToBottom();
}

function showChatError(error) {
    console.error('[CHAT] Error:', error);
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error,
            toast: true,
            position: 'top-end',
            timer: 3000,
            showConfirmButton: false
        });
    }
}

function formatChatTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Ahora';
    if (diff < 3600000) return `Hace ${Math.floor(diff/60000)} min`;
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
    }
    
    return date.toLocaleDateString('es-ES', {day: '2-digit', month: '2-digit'}) + ' ' +
           date.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'});
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.openChatModal = openChatModal;


// ── Lightbox para foto rechazada en chat ──────────────────────────────────
function chatOpenPhotoLightbox(imgUrl) {
    // Reusar overlay existente o crear uno nuevo
    let overlay = document.getElementById('chatPhotoLightbox');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'chatPhotoLightbox';
        overlay.style.cssText = `
            position:fixed; top:0; left:0; width:100%; height:100%;
            background:rgba(0,0,0,0.92); z-index:99999;
            display:flex; align-items:center; justify-content:center;
            cursor:zoom-out; animation: fadeIn 0.2s ease;
        `;
        overlay.innerHTML = `
            <button onclick="document.getElementById('chatPhotoLightbox').remove()"
                style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,0.15);
                       border:none;color:white;font-size:1.8rem;line-height:1;padding:0.3rem 0.7rem;
                       border-radius:50%;cursor:pointer;z-index:1;">
                &times;
            </button>
            <img id="chatPhotoLightboxImg"
                style="max-width:92vw;max-height:88vh;border-radius:10px;
                       box-shadow:0 8px 40px rgba(0,0,0,0.7);object-fit:contain;" />
        `;
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
    }
    document.getElementById('chatPhotoLightboxImg').src = imgUrl;
}

window.chatOpenPhotoLightbox = chatOpenPhotoLightbox;

console.log('✅ [CHAT] Módulo cargado');