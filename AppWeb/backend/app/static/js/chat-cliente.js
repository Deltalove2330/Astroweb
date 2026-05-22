// static/js/chat-cliente.js
// Chat en tiempo real para módulo de clientes - CORREGIDO

(function() {
    'use strict';
    
    // Estado del chat
    let chatClienteSocket = null;
    let currentChatVisitId = null;
    let currentClienteId = null;
    let currentUsername = null;
    let typingTimer = null;
    let isTyping = false;
    let chatModalInstance = null;
    let isInitialized = false;  
    let connectionTimeout = null;
    
    /**
     * Inicializa el sistema de chat de cliente
     */
    window.initChatCliente = function() {
        if (isInitialized) {
            console.log('⚠️ Chat Cliente ya inicializado');
            return;
        }
        
        console.log('🚀 Iniciando Chat Cliente...');
        
        try {
            // Conectar Socket.IO solo si no existe conexión
            if (!chatClienteSocket || !chatClienteSocket.connected) {
                chatClienteSocket = io.connect(window.location.origin + '/chat_cliente', {
                    transports: ['websocket', 'polling'],
                    reconnection: true,
                    reconnectionDelay: 1000,
                    reconnectionAttempts: 5,
                    forceNew: false
                });
            }
            
            // Registrar eventos
            registerChatClienteEvents();
            setupChatClienteUI();
            
            isInitialized = true;
            console.log('✅ Chat Cliente inicializado');
        } catch (error) {
            console.error('❌ Error inicializando chat:', error);
        }
    };
    
    /**
     * Registra los eventos de Socket.IO para el chat
     */
    function registerChatClienteEvents() {
        if (!chatClienteSocket) return;
        
        // Remover listeners previos para evitar duplicados
        chatClienteSocket.off('connect');
        chatClienteSocket.off('disconnect');
        chatClienteSocket.off('connect_error');
        chatClienteSocket.off('chat_history_cliente');
        chatClienteSocket.off('new_message_cliente');
        chatClienteSocket.off('user_typing_cliente');
        chatClienteSocket.off('messages_read_cliente');
        chatClienteSocket.off('chat_error_cliente');
        
        // Conexión establecida
        chatClienteSocket.on('connect', function() {
            console.log('🟢 Socket Chat Cliente conectado');

            if (currentChatVisitId && currentClienteId) {
                console.log('🔄 Reconectando a chat cliente');
                chatClienteSocket.emit('join_chat_cliente', {
                    visit_id: currentChatVisitId,
                    cliente_id: currentClienteId,
                    username: currentUsername
                });
            }
        });
        
        // Desconexión
        chatClienteSocket.on('disconnect', function() {
            console.log('🔴 Socket Chat Cliente desconectado');
        });
        
        // Error de conexión
        chatClienteSocket.on('connect_error', function(error) {
            console.error('❌ Error de conexión Socket:', error);
        });
        
        // Recibir historial de chat
        chatClienteSocket.on('chat_history_cliente', function(data) {
            console.log('📜 Historial recibido:', data.mensajes?.length || 0, 'mensajes');
            
            // Limpiar timeout de conexión
            if (window.chatConnectionTimeout) {
                clearTimeout(window.chatConnectionTimeout);
                window.chatConnectionTimeout = null;
            }
            
            renderChatHistory(data.mensajes);
        });
        
        // Nuevo mensaje recibido
        chatClienteSocket.on('new_message_cliente', function(msg) {
            console.log('💬 Nuevo mensaje:', msg);
            
            if (parseInt(msg.id_visita) === parseInt(currentChatVisitId) &&
                parseInt(msg.id_cliente) === parseInt(currentClienteId)) {
                appendMessageToChat(msg, true);
                scrollChatToBottom();
                
                // Marcar como leído si no es propio
                if (msg.username !== currentUsername) {
                    markMessagesAsRead();
                }
            }
        });
        
        // Indicador de escritura
        chatClienteSocket.on('user_typing_cliente', function(data) {
            var $indicator = document.getElementById('typingIndicatorClient');
            if ($indicator) {
                var $span = $indicator.querySelector('span');
                if (data.is_typing) {
                    if ($span) $span.textContent = data.username + ' está escribiendo...';
                    $indicator.style.display = 'block';
                } else {
                    $indicator.style.display = 'none';
                }
            }
        });
        
        // Mensajes leídos
        chatClienteSocket.on('messages_read_cliente', function(data) {
            if (data.read_by !== currentUsername) {
                // Actualizar iconos de visto
                var statusIcons = document.querySelectorAll('.chat-message-mine .message-status');
                statusIcons.forEach(function(icon) {
                    icon.innerHTML = '<i class="bi bi-check-all text-info"></i>';
                });
            }
        });
        
        // Error del chat
        chatClienteSocket.on('chat_error_cliente', function(data) {
            console.error('❌ Error en chat:', data.error);
            if (typeof Swal !== 'undefined') {
                Swal.fire({
                    icon: 'error',
                    title: 'Error en el chat',
                    text: data.error,
                    confirmButtonColor: '#667eea'
                });
            }
        });
    }
    
    /**
     * Configura la interfaz de usuario del chat
     */
    function setupChatClienteUI() {
        // Usar event delegation para evitar múltiples listeners
        document.removeEventListener('click', handleChatClick);
        document.addEventListener('click', handleChatClick);
        
        document.removeEventListener('keypress', handleChatKeypress);
        document.addEventListener('keypress', handleChatKeypress);
        
        document.removeEventListener('input', handleChatInput);
        document.addEventListener('input', handleChatInput);
        
        // Evento al cerrar modal
        var chatModal = document.getElementById('chatClientModal');
        if (chatModal) {
            chatModal.removeEventListener('hidden.bs.modal', handleModalClose);
            chatModal.addEventListener('hidden.bs.modal', handleModalClose);
        }
    }
    
    function handleChatClick(e) {
        if (e.target.closest('#sendClientChatBtn')) {
            e.preventDefault();
            sendChatMessage();
        }
    }
    
    function handleChatKeypress(e) {
        if (e.target.id === 'chatClientInput' && e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    }
    
    function handleChatInput(e) {
        if (e.target.id === 'chatClientInput') {
            clearTimeout(typingTimer);
            
            if (!isTyping && currentChatVisitId) {
                isTyping = true;
                sendTypingIndicator(true);
            }
            
            typingTimer = setTimeout(function() {
                isTyping = false;
                sendTypingIndicator(false);
            }, 1000);
        }
    }
    
    function handleModalClose() {
        if (currentChatVisitId && currentClienteId && chatClienteSocket) {
            chatClienteSocket.emit('leave_chat_cliente', {
                visit_id: currentChatVisitId,
                cliente_id: currentClienteId,
                username: currentUsername
            });
        }
        
        // Limpiar estado
        currentChatVisitId = null;
        var messagesContainer = document.getElementById('chatClientMessages');
        if (messagesContainer) messagesContainer.innerHTML = '';
        var inputField = document.getElementById('chatClientInput');
        if (inputField) inputField.value = '';
        var typingIndicator = document.getElementById('typingIndicatorClient');
        if (typingIndicator) typingIndicator.style.display = 'none';
    }
    
    /**
     * Obtiene datos del usuario actual de forma segura
     */
    function getCurrentUserData() {
        return new Promise(function(resolve, reject) {
            // Primero intentar obtener de variables globales existentes
            if (window.currentUserData && window.currentUserData.username && window.currentUserData.cliente_id) {
                console.log('📌 Usando datos de usuario en caché');
                resolve(window.currentUserData);
                return;
            }
            
            // Intentar obtener del elemento del DOM (si existe)
            var userDataElement = document.getElementById('user-data');
            if (userDataElement) {
                try {
                    var userData = JSON.parse(userDataElement.textContent || userDataElement.innerText);
                    if (userData && userData.username && userData.cliente_id) {
                        window.currentUserData = userData;
                        resolve(userData);
                        return;
                    }
                } catch (e) {
                    console.warn('⚠️ Error parseando user-data del DOM');
                }
            }
            
            // Intentar obtener de la sesión Flask via cookie/meta
            var usernameMeta = document.querySelector('meta[name="username"]');
            var clienteIdMeta = document.querySelector('meta[name="cliente-id"]');
            if (usernameMeta && clienteIdMeta) {
                var userData = {
                    username: usernameMeta.content,
                    cliente_id: parseInt(clienteIdMeta.content)
                };
                window.currentUserData = userData;
                resolve(userData);
                return;
            }
            
            // Como último recurso, intentar el endpoint API
            fetch('/api/current-user', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                if (data && data.username && data.cliente_id) {
                    window.currentUserData = data;
                    resolve(data);
                } else {
                    reject(new Error('Datos de usuario incompletos'));
                }
            })
            .catch(function(error) {
                console.warn('⚠️ Error en /api/current-user:', error);
                
                // Intentar extraer de la página actual
                var sessionUsername = extractUsernameFromPage();
                var sessionClienteId = extractClienteIdFromPage();
                
                if (sessionUsername && sessionClienteId) {
                    var userData = {
                        username: sessionUsername,
                        cliente_id: parseInt(sessionClienteId)
                    };
                    window.currentUserData = userData;
                    resolve(userData);
                } else {
                    reject(new Error('No se pudo obtener datos del usuario'));
                }
            });
        });
    }
    
    /**
     * Extrae username de la página si está disponible
     */
    function extractUsernameFromPage() {
        // Buscar en elementos comunes
        var usernameEl = document.querySelector('[data-username]');
        if (usernameEl) return usernameEl.dataset.username;
        
        var navUser = document.querySelector('.navbar .username, .header .username, #username');
        if (navUser) return navUser.textContent.trim();
        
        // Buscar en scripts inline
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var content = scripts[i].textContent;
            var match = content.match(/username['":\s]+['"]([^'"]+)['"]/);
            if (match) return match[1];
        }
        
        return null;
    }
    
    /**
     * Extrae cliente_id de la página si está disponible
     */
    function extractClienteIdFromPage() {
        // Buscar en elementos comunes
        var clienteEl = document.querySelector('[data-cliente-id]');
        if (clienteEl) return clienteEl.dataset.clienteId;
        
        // Buscar en scripts inline
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var content = scripts[i].textContent;
            var match = content.match(/cliente_id['":\s]+(\d+)/);
            if (match) return match[1];
        }
        
        // Buscar en URL o formularios
        var urlMatch = window.location.search.match(/cliente[_-]?id=(\d+)/i);
        if (urlMatch) return urlMatch[1];
        
        return null;
    }
    
    /**
     * Abre el modal de chat para una visita específica
     */
    window.openChatModal = function(visitId, event) {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        
        console.log('🔓 Abriendo chat para visita:', visitId);
        
        // Mostrar loading
        var messagesContainer = document.getElementById('chatClientMessages');
        if (messagesContainer) {
            messagesContainer.innerHTML = 
                '<div class="text-center py-4">' +
                    '<div class="spinner-border text-primary" role="status">' +
                        '<span class="visually-hidden">Cargando...</span>' +
                    '</div>' +
                    '<p class="mt-2 mb-0 text-muted">Conectando al chat...</p>' +
                '</div>';
        }
        
        // Mostrar modal primero
        var modalElement = document.getElementById('chatClientModal');
        if (modalElement && typeof bootstrap !== 'undefined') {
            chatModalInstance = new bootstrap.Modal(modalElement);
            chatModalInstance.show();
        } else if (typeof $ !== 'undefined') {
            $('#chatClientModal').modal('show');
        }
        
        // Actualizar título del modal
        var modalTitle = document.getElementById('chatClientModalTitle');
        if (modalTitle) {
            modalTitle.innerHTML = '<i class="bi bi-chat-dots"></i> Chat - Visita #' + visitId;
        }
        
        // Obtener datos del usuario con timeout
        var timeoutId = setTimeout(function() {
            console.warn('⏱️ Timeout obteniendo usuario, usando datos del DOM');
            tryConnectWithDOMData(visitId, messagesContainer);
        }, 3000);
        
        getCurrentUserData()
            .then(function(user) {
                clearTimeout(timeoutId);
                console.log('👤 Usuario actual:', user);
                
                currentUsername = user.username;
                currentClienteId = user.cliente_id;
                currentChatVisitId = visitId;
                
                if (!currentClienteId) {
                    throw new Error('No se pudo obtener el ID del cliente');
                }
                
                connectToChat(visitId, messagesContainer);
            })
            .catch(function(error) {
                clearTimeout(timeoutId);
                console.error('❌ Error obteniendo usuario:', error);
                tryConnectWithDOMData(visitId, messagesContainer);
            });
    };
    
    /**
     * Intenta conectar usando datos del DOM
     */
    function tryConnectWithDOMData(visitId, messagesContainer) {
        // Intentar obtener de meta tags
        var usernameMeta = document.querySelector('meta[name="username"]');
        var clienteIdMeta = document.querySelector('meta[name="cliente-id"]');
        
        if (usernameMeta && clienteIdMeta && clienteIdMeta.content) {
            currentUsername = usernameMeta.content;
            currentClienteId = parseInt(clienteIdMeta.content);
            currentChatVisitId = visitId;
            
            console.log('📌 Usando datos de meta tags:', currentUsername, currentClienteId);
            connectToChat(visitId, messagesContainer);
        } else {
            if (messagesContainer) {
                messagesContainer.innerHTML = 
                    '<div class="text-center py-4 text-danger">' +
                        '<i class="bi bi-exclamation-circle fs-1"></i>' +
                        '<p class="mt-2 mb-0">Error al cargar el chat</p>' +
                        '<small>Por favor, recarga la página</small>' +
                    '</div>';
            }
        }
    }
    
    /**
     * Conecta al chat con timeout de seguridad
     */
    function connectToChat(visitId, messagesContainer) {
        // Verificar socket
        if (!chatClienteSocket || !chatClienteSocket.connected) {
            console.log('🔄 Reconectando socket...');
            initChatCliente();
        }
        
        // Timeout de seguridad para la conexión
         // ✅ TIMEOUT DE SEGURIDAD
        var connectionTimeout = setTimeout(function() {
            console.warn('⏱️ Timeout esperando historial del cliente');
            if (messagesContainer && messagesContainer.innerHTML.indexOf('spinner') !== -1) {
                messagesContainer.innerHTML =
                    '<div class="text-center text-muted py-5">' +
                        '<i class="bi bi-chat-dots fs-1 opacity-50"></i>' +
                        '<p class="mt-3 mb-0">Chat listo</p>' +
                        '<small>Escribe un mensaje para comenzar</small>' +
                    '</div>';
            }
        }, 10000);
        
        window.chatConnectionTimeout = connectionTimeout;
        
        // Esperar un momento para que el socket se conecte
        setTimeout(function() {
            if (chatClienteSocket && chatClienteSocket.connected) {
                console.log('📤 Enviando join_chat_cliente...');
                chatClienteSocket.emit('join_chat_cliente', {
                    visit_id: visitId,
                    cliente_id: currentClienteId,
                    username: currentUsername
                });
            } else {
                console.warn('⚠️ Socket aún no conectado, reintentando...');
                setTimeout(function() {
                    if (chatClienteSocket && chatClienteSocket.connected) {
                        chatClienteSocket.emit('join_chat_cliente', {
                            visit_id: visitId,
                            cliente_id: currentClienteId,
                            username: currentUsername
                        });
                    }
                }, 1000);
            }
        }, 500);
    }
    
    /**
     * Envía un mensaje al chat
     */
    function sendChatMessage() {
        var inputField = document.getElementById('chatClientInput');
        if (!inputField) return;
        
        var mensaje = inputField.value.trim();
        
        if (!mensaje || !currentChatVisitId || !currentClienteId) {
            return;
        }
        
        // Limpiar input inmediatamente
        inputField.value = '';
        
        // Detener indicador de escritura
        isTyping = false;
        sendTypingIndicator(false);
        
        // Enviar mensaje
        if (chatClienteSocket && chatClienteSocket.connected) {
            chatClienteSocket.emit('send_message_cliente', {
                visit_id: currentChatVisitId,
                cliente_id: currentClienteId,
                username: currentUsername,
                mensaje: mensaje
            });
            
            console.log('📤 Mensaje enviado:', mensaje.substring(0, 50) + '...');
        } else {
            console.error('❌ Socket no conectado');
        }
    }
    
    /**
     * Envía indicador de escritura
     */
    function sendTypingIndicator(typing) {
        if (!currentChatVisitId || !currentClienteId || !chatClienteSocket) return;
        
        chatClienteSocket.emit('typing_indicator_cliente', {
            visit_id: currentChatVisitId,
            cliente_id: currentClienteId,
            username: currentUsername,
            is_typing: typing
        });
    }
    
    /**
     * Marca mensajes como leídos
     */
    function markMessagesAsRead() {
        if (!currentChatVisitId || !currentClienteId || !chatClienteSocket) return;
        
        chatClienteSocket.emit('mark_messages_read_cliente', {
            visit_id: currentChatVisitId,
            cliente_id: currentClienteId,
            username: currentUsername
        });
    }
    
    /**
     * Renderiza el historial de mensajes
     */
    function renderChatHistory(mensajes) {
        var container = document.getElementById('chatClientMessages');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (!mensajes || mensajes.length === 0) {
            container.innerHTML = 
                '<div class="text-center text-muted py-5">' +
                    '<i class="bi bi-chat-dots fs-1 opacity-50"></i>' +
                    '<p class="mt-3 mb-0">No hay mensajes aún</p>' +
                    '<small>¡Sé el primero en escribir!</small>' +
                '</div>';
            return;
        }
        
        mensajes.forEach(function(msg) {
            appendMessageToChat(msg, false);
        });
        
        scrollChatToBottom();
    }
    
    /**
     * Agrega un mensaje al contenedor de chat
     */
    function appendMessageToChat(msg, animate) {
        var container = document.getElementById('chatClientMessages');
        if (!container) return;
        
        var isMine = msg.username === currentUsername;
        var isSystem = msg.tipo_mensaje === 'sistema';
        
        var messageDiv = document.createElement('div');
        var animationStyle = animate ? 'animation: chatMessageIn 0.3s ease-out;' : '';
        
        if (isSystem) {
            // Parsear metadata para obtener información detallada
            var metadata = {};
            if (msg.metadata) {
                try {
                    metadata = typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata;
                } catch (e) {
                    console.warn('Error parseando metadata:', e);
                }
            }
            
            // Si no hay metadata o está vacía, intentar parsear del mensaje de texto
            var tipoFoto = metadata.tipo_foto || '';
            var cliente = metadata.cliente || metadata.nombre_cliente || '';
            var punto = metadata.punto || metadata.punto_venta || '';
            var fecha = metadata.fecha || metadata.fecha_rechazo || '';
            var rechazadoPor = metadata.rechazado_por || '';
            var razones = metadata.razones || [];
            var comentario = metadata.comentario || '';
            var razonCompleta = metadata.razon_completa || '';
            
            // Si no hay metadata, parsear del mensaje de texto (para mensajes antiguos)
            if (!tipoFoto && msg.mensaje) {
                var mensajeTexto = msg.mensaje;
                
                // Extraer tipo de foto: "Tipo: Gestion - Antes" o similar
                var tipoMatch = mensajeTexto.match(/Tipo:\s*([^.]+)/i);
                if (tipoMatch) {
                    tipoFoto = tipoMatch[1].trim();
                }
                
                // Extraer razón/comentario
                var razonMatch = mensajeTexto.match(/Raz[oó]n:\s*(.+?)(?:\.|$)/i);
                if (razonMatch) {
                    razonCompleta = razonMatch[1].trim();
                }
                
                // Extraer razones si están en formato "Razones: X, Y. Comentario: Z"
                var razonesMatch = mensajeTexto.match(/Razones:\s*([^.]+)/i);
                if (razonesMatch) {
                    var razonesTexto = razonesMatch[1].trim();
                    razones = razonesTexto.split(',').map(function(r) { return r.trim(); });
                }
                
                // Extraer comentario si está separado
                var comentarioMatch = mensajeTexto.match(/Comentario:\s*(.+?)(?:\.|$)/i);
                if (comentarioMatch) {
                    comentario = comentarioMatch[1].trim();
                }
            }
            
            // Construir razón final para mostrar
            var razonTexto = razonCompleta;
            if (!razonTexto) {
                if (razones && razones.length > 0) {
                    razonTexto = razones.join(', ');
                }
                if (comentario) {
                    razonTexto = razonTexto ? razonTexto + '. ' + comentario : comentario;
                }
            }
            if (!razonTexto) {
                razonTexto = 'Sin especificar';
            }
            
            // Si no hay tipo, poner N/A
            if (!tipoFoto) {
                tipoFoto = 'N/A';
            }
            
            // Formatear fecha si existe
            var fechaFormateada = fecha;
            if (fecha) {
                try {
                    var fechaObj = new Date(fecha);
                    if (!isNaN(fechaObj.getTime())) {
                        fechaFormateada = fechaObj.toLocaleDateString('es-VE');
                    }
                } catch (e) {
                    fechaFormateada = fecha;
                }
            }
            
            // Construir HTML del mensaje - IGUAL QUE ANALISTA
            var bodyHTML = '';
            bodyHTML += '<div class="system-info-row"><i class="bi bi-camera"></i><span class="info-label">Tipo:</span><span class="info-value">' + escapeHtml(tipoFoto) + '</span></div>';
            
            if (cliente) {
                bodyHTML += '<div class="system-info-row"><i class="bi bi-building"></i><span class="info-label">Cliente:</span><span class="info-value">' + escapeHtml(cliente) + '</span></div>';
            }
            if (punto) {
                bodyHTML += '<div class="system-info-row"><i class="bi bi-geo-alt"></i><span class="info-label">Punto:</span><span class="info-value">' + escapeHtml(punto) + '</span></div>';
            }
            if (fechaFormateada) {
                bodyHTML += '<div class="system-info-row"><i class="bi bi-calendar"></i><span class="info-label">Fecha:</span><span class="info-value">' + escapeHtml(fechaFormateada) + '</span></div>';
            }
            if (rechazadoPor) {
                bodyHTML += '<div class="system-info-row"><i class="bi bi-person"></i><span class="info-label">Rechazado por:</span><span class="info-value">' + escapeHtml(rechazadoPor) + '</span></div>';
            }
            
            bodyHTML += '<div class="system-info-row"><i class="bi bi-chat-left-text"></i><span class="info-label">Razón:</span><span class="info-value">' + escapeHtml(razonTexto) + '</span></div>';
            
            messageDiv.className = 'chat-message-system my-2';
            messageDiv.style.cssText = animationStyle;
            messageDiv.innerHTML = 
                '<div class="system-message-card-analista">' +
                    '<div class="system-card-header">' +
                        '<i class="bi bi-exclamation-triangle-fill"></i>' +
                        '<span>Foto Rechazada</span>' +
                    '</div>' +
                    '<div class="system-card-body">' + bodyHTML + '</div>' +
                    '<div class="system-card-footer">' + formatChatTime(msg.fecha_envio) + '</div>' +
                '</div>';
        } else {
            // Mensaje de usuario
            var alignClass = isMine ? 'justify-content-end' : 'justify-content-start';
            var bubbleClass = isMine ? 'chat-bubble-mine' : 'chat-bubble-other';
            var mineClass = isMine ? 'chat-message-mine' : '';
            var statusIcon = msg.visto 
                ? '<i class="bi bi-check-all text-info"></i>' 
                : '<i class="bi bi-check"></i>';
            
            messageDiv.className = 'd-flex ' + alignClass + ' mb-2 ' + mineClass;
            messageDiv.id = 'msg-' + msg.id_mensaje;
            messageDiv.style.cssText = animationStyle;
            
            var usernameHTML = !isMine 
                ? '<small class="d-block fw-bold text-primary mb-1">' + escapeHtml(msg.username) + '</small>' 
                : '';
            var statusHTML = isMine 
                ? '<span class="message-status ms-2">' + statusIcon + '</span>' 
                : '';
            
            messageDiv.innerHTML = 
                '<div class="chat-bubble ' + bubbleClass + '">' +
                    usernameHTML +
                    '<div class="message-text">' + escapeHtml(msg.mensaje) + '</div>' +
                    '<div class="d-flex justify-content-between align-items-center mt-1 gap-2">' +
                        '<small class="message-time">' + formatChatTime(msg.fecha_envio) + '</small>' +
                        statusHTML +
                    '</div>' +
                '</div>';
        }
        
        container.appendChild(messageDiv);
    }
    
    /**
     * Hace scroll al final del chat
     */
    function scrollChatToBottom() {
        var container = document.getElementById('chatClientMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
    
    /**
     * Formatea la fecha/hora del mensaje
     */
    function formatChatTime(dateString) {
        if (!dateString) return '';
        
        try {
            var date = new Date(dateString);
            var now = new Date();
            var diffMs = now - date;
            var diffSecs = Math.floor(diffMs / 1000);
            var diffMins = Math.floor(diffSecs / 60);
            
            // Menos de 1 minuto
            if (diffSecs < 60) {
                return 'Ahora';
            }
            
            // Menos de 1 hora
            if (diffMins < 60) {
                return 'Hace ' + diffMins + ' min';
            }
            
            // Hoy
            if (date.toDateString() === now.toDateString()) {
                return date.toLocaleTimeString('es-VE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            // Ayer
            var yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            if (date.toDateString() === yesterday.toDateString()) {
                return 'Ayer ' + date.toLocaleTimeString('es-VE', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
            }
            
            // Más antiguo
            return date.toLocaleDateString('es-VE', { 
                day: '2-digit', 
                month: '2-digit',
                hour: '2-digit', 
                minute: '2-digit' 
            });
        } catch (e) {
            return '';
        }
    }
    
    /**
     * Escapa HTML para prevenir XSS
     */
    function escapeHtml(text) {
        if (typeof text !== 'string') return text || '';
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // Inicializar cuando el documento esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            if (document.getElementById('chatClientModal') || window.location.pathname.indexOf('/punto/') !== -1) {
                initChatCliente();
            }
        });
    } else {
        if (document.getElementById('chatClientModal') || window.location.pathname.indexOf('/punto/') !== -1) {
            initChatCliente();
        }
    }
    
})();