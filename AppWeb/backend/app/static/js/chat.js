// app/static/js/chat.js
// Sistema de Chat en Tiempo Real por Visita

let currentChatVisitId = null;
let typingTimer = null;
let isTyping = false;
let chatEventsRegistered = false;
let chatSocket = null;

/**
 * Obtener el socket (con reintentos hasta que esté disponible)
 */
function getChatSocket() {
    if (chatSocket && chatSocket.connected) {
        return chatSocket;
    }
    
    // Intentar obtener socket global
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

/**
 * Inicializar chat cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 [CHAT] Inicializando módulo de chat...');
    
    // Esperar a que el socket esté disponible
    let attempts = 0;
    const maxAttempts = 50;
    
    const waitForSocket = setInterval(() => {
        attempts++;
        const socket = getChatSocket();
        
        if (socket) {
            console.log('✅ [CHAT] Socket encontrado, registrando eventos...');
            clearInterval(waitForSocket);
            registerChatEvents(socket);
            setupChatUI();
        } else if (attempts >= maxAttempts) {
            console.error('❌ [CHAT] Socket no disponible después de 50 intentos');
            clearInterval(waitForSocket);
        } else {
            console.log(`⏳ [CHAT] Esperando socket... (intento ${attempts}/${maxAttempts})`);
        }
    }, 100);
});

/**
 * Registrar eventos del chat
 */
function registerChatEvents(socket) {
    if (chatEventsRegistered) {
        console.log('⚠️ [CHAT] Eventos ya registrados');
        return;
    }
    
    console.log('📝 [CHAT] Registrando event listeners...');
    chatEventsRegistered = true;
    chatSocket = socket;
    
    // ========================================
    // EVENTO 1: Historial de mensajes
    // ========================================
    socket.off('chat_history'); // Remover listeners anteriores
    socket.on('chat_history', function(data) {
        console.log('📨 [CHAT] Historial recibido:', data);
        if (data.success) {
            renderChatHistory(data.mensajes);
        } else {
            showChatError('Error al cargar el historial');
        }
    });
    
    // ========================================
    // EVENTO 2: Nuevo mensaje (CRÍTICO)
    // ========================================
    socket.off('new_message'); // Remover listeners anteriores
    socket.on('new_message', function(msg) {
        console.log('💬 [CHAT] NUEVO MENSAJE RECIBIDO:');
        console.log('   📍 ID mensaje:', msg.id_mensaje);
        console.log('   📍 Visit ID mensaje:', msg.visit_id);
        console.log('   📍 Visit ID actual:', currentChatVisitId);
        console.log('   📍 Usuario mensaje:', msg.username);
        console.log('   📍 Texto:', msg.mensaje);
        
        if (msg.visit_id === currentChatVisitId) {
            console.log('✅ [CHAT] Agregando mensaje al DOM...');
            appendMessageToChat(msg, true);
            scrollChatToBottom();
            
            // Marcar como leído si no es mío
            if (msg.id_usuario !== window.currentUserId) {
                console.log('👁️ [CHAT] Marcando mensaje como leído');
                markMessageAsRead(msg.id_mensaje);
            }
        } else {
            console.log('⚠️ [CHAT] Mensaje ignorado (visita diferente)');
        }
    });
    
    // ========================================
    // EVENTO 3: Usuario se unió
    // ========================================
    socket.off('user_joined_chat');
    socket.on('user_joined_chat', function(data) {
        console.log('👋 [CHAT] Usuario se unió:', data.username);
        if (data.visit_id === currentChatVisitId) {
            showChatNotification(`${data.username} se unió al chat`);
        }
    });
    
    // ========================================
    // EVENTO 4: Usuario salió
    // ========================================
    socket.off('user_left_chat');
    socket.on('user_left_chat', function(data) {
        console.log('🚪 [CHAT] Usuario salió:', data.username);
        if (data.visit_id === currentChatVisitId) {
            showChatNotification(`${data.username} salió del chat`);
        }
    });
    
    // ========================================
    // EVENTO 5: Mensaje leído
    // ========================================
    socket.off('message_read');
    socket.on('message_read', function(data) {
        console.log('✓✓ [CHAT] Mensaje leído:', data.id_mensaje);
        updateMessageReadStatus(data.id_mensaje, data.leido_por);
    });
    
    // ========================================
    // EVENTO 6: Usuario escribiendo
    // ========================================
    socket.off('user_typing');
    socket.on('user_typing', function(data) {
        if (data.visit_id === currentChatVisitId) {
            showTypingIndicator(data.username, data.is_typing);
        }
    });
    
    // ========================================
    // EVENTO 7: Error
    // ========================================
    socket.off('chat_error');
    socket.on('chat_error', function(data) {
        console.error('❌ [CHAT] Error:', data.error);
        showChatError(data.error);
    });
    
    console.log('✅ [CHAT] Todos los eventos registrados correctamente');
}

/**
 * Configurar UI del chat
 */
function setupChatUI() {
    console.log('🎨 [CHAT] Configurando UI...');
    
    const chatInput = document.getElementById('chatInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    
    if (!chatInput || !chatSendBtn) {
        console.warn('⚠️ [CHAT] Elementos no encontrados, reintentando...');
        setTimeout(setupChatUI, 200);
        return;
    }
    
    // Auto-resize del textarea
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
    
    // Enter para enviar
    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
    
    // Botón enviar
    chatSendBtn.addEventListener('click', sendChatMessage);
    
    // Limpiar al cerrar
    $('#chatModal').on('hidden.bs.modal', function() {
        leaveChatRoom();
    });
    
    console.log('✅ [CHAT] UI configurada');
}

/**
 * Abrir modal del chat
 */
function openChatModal(visitId) {
    console.log('🔓 [CHAT] Abriendo modal para visita:', visitId);
    currentChatVisitId = visitId;
    
    document.getElementById('chatVisitId').textContent = visitId;
    
    const container = document.getElementById('chatMessages');
    container.innerHTML = '<div class="chat-loading"><div class="spinner-border text-primary"></div><p class="mt-2">Cargando mensajes...</p></div>';
    
    const chatModal = new bootstrap.Modal(document.getElementById('chatModal'));
    chatModal.show();
    
    setTimeout(() => joinChatRoom(visitId), 150);
}

/**
 * Unirse a la sala
 */
function joinChatRoom(visitId) {
    const socket = getChatSocket();
    if (!socket) {
        showChatError('WebSocket no conectado');
        return;
    }
    
    console.log('🚪 [CHAT] Uniéndose a sala:', visitId);
    socket.emit('join_chat', {
        visit_id: visitId,
        username: window.currentUsername || 'Usuario'
    });
}

/**
 * Salir de la sala
 */
function leaveChatRoom() {
    if (!currentChatVisitId) return;
    
    const socket = getChatSocket();
    if (socket) {
        console.log('👋 [CHAT] Saliendo de sala:', currentChatVisitId);
        socket.emit('leave_chat', {
            visit_id: currentChatVisitId,
            username: window.currentUsername || 'Usuario'
        });
    }
    
    currentChatVisitId = null;
}

/**
 * Renderizar historial
 */
function renderChatHistory(mensajes) {
    console.log('📋 [CHAT] Renderizando', mensajes.length, 'mensajes');
    
    const container = document.getElementById('chatMessages');
    container.innerHTML = '';
    
    if (!mensajes || mensajes.length === 0) {
        container.innerHTML = '<div class="chat-empty"><i class="bi bi-chat-text"></i><p>No hay mensajes aún. ¡Sé el primero en escribir!</p></div>';
        return;
    }
    
    mensajes.forEach(msg => appendMessageToChat(msg, false));
    scrollChatToBottom();
}

/**
 * Agregar mensaje al DOM
 */
function appendMessageToChat(msg, animate = true) {
    console.log('➕ [CHAT] Agregando mensaje al DOM:');
    console.log('   - Mensaje:', msg.mensaje);
    console.log('   - Usuario:', msg.username);
    console.log('   - Tipo:', msg.tipo_mensaje);
    
    const container = document.getElementById('chatMessages');
    if (!container) {
        console.error('❌ [CHAT] Container no encontrado!');
        return;
    }
    
    // Remover loading/empty
    const toRemove = container.querySelector('.chat-empty, .chat-loading');
    if (toRemove) {
        toRemove.remove();
        console.log('✓ [CHAT] Removido placeholder');
    }
    
    const messageDiv = document.createElement('div');
    
    if (msg.tipo_mensaje === 'sistema') {
        messageDiv.className = 'chat-message-system';
        messageDiv.innerHTML = `
            <div class="system-message-content">
                <i class="bi bi-exclamation-triangle-fill"></i>
                <div class="system-message-text">${escapeHtml(msg.mensaje)}</div>
                <small class="text-muted">${formatChatTime(msg.fecha_envio)}</small>
            </div>
        `;
    } else {
        const isMine = msg.id_usuario === window.currentUserId;
        console.log('   - Es mío?:', isMine, '(', msg.id_usuario, 'vs', window.currentUserId, ')');
        
        messageDiv.className = `chat-message ${isMine ? 'chat-message-mine' : 'chat-message-other'}`;
        messageDiv.innerHTML = `
            <div class="message-bubble">
                ${!isMine ? `<div class="message-username">${escapeHtml(msg.username)}</div>` : ''}
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
    console.log('✅ [CHAT] Mensaje agregado al DOM');
    
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
    
    if (!mensaje || !currentChatVisitId) return;
    
    const socket = getChatSocket();
    if (!socket) {
        showChatError('Socket no conectado');
        return;
    }
    
    console.log('📤 [CHAT] Enviando:', mensaje);
    socket.emit('send_message', {
        visit_id: currentChatVisitId,
        username: window.currentUsername || 'Usuario',
        mensaje: mensaje
    });
    
    input.value = '';
    input.style.height = 'auto';
    isTyping = false;
    sendTypingIndicator(false);
}

/**
 * Marcar como leído
 */
function markMessageAsRead(messageId) {
    const socket = getChatSocket();
    if (!socket || !currentChatVisitId) return;
    
    socket.emit('mark_message_read', {
        id_mensaje: messageId,
        visit_id: currentChatVisitId
    });
}

/**
 * Actualizar estado leído
 */
function updateMessageReadStatus(messageId) {
    const el = document.querySelector(`[data-msg-id="${messageId}"]`);
    if (el) {
        el.innerHTML = '<i class="bi bi-check-all text-primary"></i>';
    }
}

/**
 * Indicador de escritura
 */
function sendTypingIndicator(typing) {
    const socket = getChatSocket();
    if (!socket || !currentChatVisitId) return;
    
    socket.emit('typing_indicator', {
        visit_id: currentChatVisitId,
        username: window.currentUsername || 'Usuario',
        is_typing: typing
    });
}

/**
 * Mostrar typing
 */
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

/**
 * Scroll al final
 */
function scrollChatToBottom() {
    const container = document.getElementById('chatMessages');
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }
}

/**
 * Notificación
 */
function showChatNotification(msg) {
    const container = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-notification';
    div.innerHTML = `<small>${msg}</small>`;
    container.appendChild(div);
    scrollChatToBottom();
}

/**
 * Error
 */
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

/**
 * Formatear tiempo
 */
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

/**
 * Escapar HTML
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Exponer globalmente
window.openChatModal = openChatModal;

console.log('✅ [CHAT] Módulo cargado');
