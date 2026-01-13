// app/static/js/chat.js
// Sistema de Chat en Tiempo Real por Visita

let currentChatVisitId = null;
let typingTimer = null;
let isTyping = false;

// ✅ USAR EL SOCKET GLOBAL (no crear uno nuevo)
function getChatSocket() {
    // Intentar obtener el socket de notificaciones si existe
    if (window.socket && window.socket.connected) {
        return window.socket;
    }
    // Si no existe, crear uno nuevo
    if (typeof io !== 'undefined') {
        const newSocket = io.connect(window.location.origin, {
            transports: ['websocket', 'polling']
        });
        window.socket = newSocket;
        return newSocket;
    }
    return null;
}

/**
 * Inicializar chat cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    setupChatSocketEvents();
    setupChatUI();
});

/**
 * Configurar eventos del WebSocket para el chat
 */
function setupChatSocketEvents() {
    // Esperar a que el socket esté disponible
    const interval = setInterval(() => {
        const chatSocket = getChatSocket();
        if (chatSocket) {
            clearInterval(interval);
            console.log('✅ Socket del chat conectado');
            
            // Recibir historial de mensajes
            chatSocket.on('chat_history', function(data) {
                console.log('📨 Historial recibido:', data);
                if (data.success) {
                    renderChatHistory(data.mensajes);
                } else {
                    showChatError('Error al cargar el historial');
                }
            });
            
            // Recibir nuevo mensaje en tiempo real
            chatSocket.on('new_message', function(msg) {
                console.log('💬 Nuevo mensaje recibido:', msg);
                if (msg.visit_id === currentChatVisitId) {
                    appendMessageToChat(msg);
                    scrollChatToBottom();
                    
                    // Si no es mi mensaje, marcarlo como leído
                    if (msg.id_usuario !== window.currentUserId) {
                        markMessageAsRead(msg.id_mensaje);
                    }
                }
            });
            
            // Alguien se unió al chat
            chatSocket.on('user_joined_chat', function(data) {
                if (data.visit_id === currentChatVisitId) {
                    showChatNotification(`${data.username} se unió al chat`);
                }
            });
            
            // Alguien salió del chat
            chatSocket.on('user_left_chat', function(data) {
                if (data.visit_id === currentChatVisitId) {
                    showChatNotification(`${data.username} salió del chat`);
                }
            });
            
            // Mensaje fue leído
            chatSocket.on('message_read', function(data) {
                updateMessageReadStatus(data.id_mensaje, data.leido_por);
            });
            
            // Indicador de escritura
            chatSocket.on('user_typing', function(data) {
                showTypingIndicator(data.username, data.is_typing);
            });
            
            // Error en el chat
            chatSocket.on('chat_error', function(data) {
                console.error('❌ Chat error:', data.error);
                showChatError(data.error);
            });
        }
    }, 100);
}

/**
 * Configurar UI del chat
 */
function setupChatUI() {
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    
    if (!chatInput || !chatSendBtn) return;
    
    // Auto-resize del textarea
    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        
        // Indicador de escritura
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
    
    // Enviar con Enter (Shift+Enter para nueva línea)
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    
    // Enviar con botón
    chatSendBtn.addEventListener('click', sendChatMessage);
    
    // Limpiar al cerrar modal
    $('#chatModal').on('hidden.bs.modal', function() {
        leaveChatRoom();
    });
}

/**
 * Abrir modal del chat para una visita
 */
function openChatModal(visitId) {
    console.log('🔓 Abriendo chat para visita:', visitId);
    currentChatVisitId = visitId;
    
    // Actualizar header del modal
    document.getElementById('chatVisitId').textContent = visitId;
    
    // Limpiar mensajes anteriores
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.innerHTML = '<div class="chat-loading" id="chatLoading"><div class="spinner-border text-primary"></div><p class="mt-2">Cargando mensajes...</p></div>';
    
    // Mostrar modal
    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
    
    // Unirse a la sala del chat
    joinChatRoom(visitId);
}

/**
 * Unirse a la sala de chat de una visita
 */
function joinChatRoom(visitId) {
    const chatSocket = getChatSocket();
    if (!chatSocket) {
        showChatError('WebSocket no está conectado');
        return;
    }
    
    console.log('🚪 Uniéndose a la sala de chat:', visitId);
    chatSocket.emit('join_chat', {
        visit_id: visitId,
        username: window.currentUsername || 'Usuario'
    });
}

/**
 * Salir de la sala de chat
 */
function leaveChatRoom() {
    const chatSocket = getChatSocket();
    if (!chatSocket || !currentChatVisitId) return;
    
    console.log('👋 Saliendo de la sala de chat:', currentChatVisitId);
    chatSocket.emit('leave_chat', {
        visit_id: currentChatVisitId,
        username: window.currentUsername || 'Usuario'
    });
    
    currentChatVisitId = null;
}

/**
 * Renderizar historial de mensajes
 */
function renderChatHistory(mensajes) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    if (!mensajes || mensajes.length === 0) {
        container.innerHTML = '<div class="chat-empty"><i class="bi bi-chat-text"></i><p>No hay mensajes aún. ¡Sé el primero en escribir!</p></div>';
        return;
    }
    
    mensajes.forEach(msg => {
        appendMessageToChat(msg, false);
    });
    
    scrollChatToBottom();
}

/**
 * Agregar mensaje al chat
 */
function appendMessageToChat(msg, animate = true) {
    const container = document.getElementById('chatMessages');
    
    // Remover "chat-empty" si existe
    const emptyDiv = container.querySelector('.chat-empty');
    if (emptyDiv) {
        emptyDiv.remove();
    }
    
    const messageDiv = document.createElement('div');
    
    if (msg.tipo_mensaje === 'sistema') {
        // Mensaje del sistema (rechazo de foto)
        messageDiv.className = 'chat-message-system';
        messageDiv.innerHTML = `
            <div class="system-message-content">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div class="system-message-text">${formatMessageText(msg.mensaje)}</div>
                <small class="text-muted">${formatChatTime(msg.fecha_envio)}</small>
            </div>
        `;
    } else {
        // Mensaje de usuario
        const isMine = msg.id_usuario === window.currentUserId;
        messageDiv.className = `chat-message ${isMine ? 'chat-message-mine' : 'chat-message-other'}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${!isMine ? `<div class="message-username">${msg.username}</div>` : ''}
                <div class="message-text">${escapeHtml(msg.mensaje)}</div>
                <div class="message-footer">
                    <small class="message-time">${formatChatTime(msg.fecha_envio)}</small>
                    ${isMine ? `<span class="message-status" data-msg-id="${msg.id_mensaje}">
                        ${msg.visto ? 
                            '<i class="bi bi-check-all text-primary"></i>' : 
                            '<i class="bi bi-check"></i>'}
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
    
    if (animate) {
        setTimeout(() => {
            messageDiv.style.transition = 'all 0.3s ease';
            messageDiv.style.opacity = '1';
            messageDiv.style.transform = 'translateY(0)';
        }, 10);
    }
}

/**
 * Enviar mensaje
 */
function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const mensaje = input.value.trim();
    
    if (!mensaje || !currentChatVisitId) {
        console.warn('⚠️ No hay mensaje o visit_id');
        return;
    }
    
    const chatSocket = getChatSocket();
    if (!chatSocket) {
        showChatError('WebSocket no está conectado');
        return;
    }
    
    console.log('📤 Enviando mensaje:', mensaje);
    chatSocket.emit('send_message', {
        visit_id: currentChatVisitId,
        username: window.currentUsername || 'Usuario',
        mensaje: mensaje
    });
    
    // Limpiar input
    input.value = '';
    input.style.height = 'auto';
    
    // Detener indicador de escritura
    isTyping = false;
    sendTypingIndicator(false);
}

/**
 * Marcar mensaje como leído
 */
function markMessageAsRead(messageId) {
    const chatSocket = getChatSocket();
    if (!chatSocket || !currentChatVisitId) return;
    
    chatSocket.emit('mark_message_read', {
        id_mensaje: messageId,
        visit_id: currentChatVisitId
    });
}

/**
 * Actualizar estado de lectura de mensaje
 */
function updateMessageReadStatus(messageId, leidoPor) {
    const statusElement = document.querySelector(`[data-msg-id="${messageId}"]`);
    if (statusElement) {
        statusElement.innerHTML = '<i class="bi bi-check-all text-primary"></i>';
    }
}

/**
 * Enviar indicador de escritura
 */
function sendTypingIndicator(isTyping) {
    const chatSocket = getChatSocket();
    if (!chatSocket || !currentChatVisitId) return;
    
    chatSocket.emit('typing_indicator', {
        visit_id: currentChatVisitId,
        username: window.currentUsername || 'Usuario',
        is_typing: isTyping
    });
}

/**
 * Mostrar indicador de que alguien está escribiendo
 */
function showTypingIndicator(username, isTyping) {
    const indicator = document.getElementById('typingIndicator');
    const usernameSpan = indicator.querySelector('.typing-username');
    
    if (isTyping) {
        usernameSpan.textContent = username;
        indicator.style.display = 'block';
    } else {
        indicator.style.display = 'none';
    }
}

/**
 * Scroll al final del chat
 */
function scrollChatToBottom() {
    const container = document.getElementById('chatMessages');
    setTimeout(() => {
        container.scrollTop = container.scrollHeight;
    }, 100);
}

/**
 * Mostrar notificación en el chat
 */
function showChatNotification(message) {
    const container = document.getElementById('chatMessages');
    const notifDiv = document.createElement('div');
    notifDiv.className = 'chat-notification';
    notifDiv.innerHTML = `<small>${message}</small>`;
    container.appendChild(notifDiv);
    scrollChatToBottom();
}

/**
 * Mostrar error en el chat
 */
function showChatError(error) {
    Swal.fire({
        icon: 'error',
        title: 'Error en el chat',
        text: error,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
}

/**
 * Formatear tiempo para el chat
 */
function formatChatTime(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Menos de 1 minuto
    if (diff < 60000) {
        return 'Ahora';
    }
    
    // Menos de 1 hora
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `Hace ${minutes} min`;
    }
    
    // Hoy
    if (date.toDateString() === now.toDateString()) {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otra fecha
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }) + ' ' +
           date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatear texto de mensaje (convertir saltos de línea)
 */
function formatMessageText(text) {
    return text.replace(/\n/g, '<br>');
}

/**
 * Escapar HTML para prevenir XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exponer funciones globales
window.openChatModal = openChatModal;