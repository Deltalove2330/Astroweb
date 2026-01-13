// app/static/js/chat.js
// Sistema de Chat en Tiempo Real por Visita

let currentChatVisitId = null;
let typingTimer = null;
let isTyping = false;
let chatEventsRegistered = false;
let chatSocket = null;

function getChatSocket() {
    if (chatSocket && chatSocket.connected) return chatSocket;
    if (window.socket && window.socket.connected) {
        chatSocket = window.socket;
        return chatSocket;
    }
    if (window.notifSocket && window.notifSocket.connected) {
        chatSocket = window.notifSocket;
        return chatSocket;
    }
    return null;
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
    
    setTimeout(() => joinChatRoom(visitId), 150);
}

function joinChatRoom(visitId) {
    const socket = getChatSocket();
    if (!socket) {
        showChatError('Socket no conectado');
        return;
    }
    
    const username = window.currentUsername || window.currentUserName || 'Usuario';
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
}

function renderChatHistory(mensajes) {
    console.log('📋 [CHAT] Renderizando', mensajes.length, 'mensajes');
    
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
        messageDiv.innerHTML = `
            <div class="system-message-content">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div class="system-message-text">${escapeHtml(msg.mensaje).replace(/\n/g, '<br>')}</div>
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
    
    const username = window.currentUsername || window.currentUserName || 'Usuario';
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
    
    socket.emit('mark_message_read', {
        id_mensaje: messageId,
        visit_id: currentChatVisitId
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

console.log('✅ [CHAT] Módulo cargado');