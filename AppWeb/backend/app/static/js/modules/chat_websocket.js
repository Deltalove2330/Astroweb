// static/js/modules/chat_websocket.js
console.log('📦 Módulo chat_websocket.js cargado');

const ChatWebSocket = {
    name: 'ChatWebSocket',
    data() {
        return {
            messages: [],
            newMessage: '',
            visitId: null,
            currentUserId: null,
            userType: 'analista',
            socket: null,
            connected: false,
            isLoading: true
        };
    },
    mounted() {
        console.log('🎬 Componente Chat montado');
        
        const chatElement = document.getElementById('chat-app');
        if (chatElement) {
            this.visitId = parseInt(chatElement.dataset.visitId);
            console.log('✅ Visit ID obtenido:', this.visitId);
        } else {
            console.error('❌ No se encontró elemento #chat-app');
        }
        
        this.currentUserId = parseInt(window.currentUserId || 0);
        this.userType = window.currentUserRole || 'analista';
        
        console.log('📋 Datos iniciales:', {
            visitId: this.visitId,
            currentUserId: this.currentUserId,
            userType: this.userType
        });
        
        if (!this.visitId || !this.currentUserId) {
            console.error('❌ Faltan datos necesarios para el chat');
            Swal.fire('Error', 'No se pudo inicializar el chat. Faltan datos de sesión.', 'error');
            return;
        }
        
        this.initSocket();
        this.loadMessages();
    },
    methods: {
        initSocket() {
            console.log('🔌 Inicializando Socket.IO...');

            if (this.socket) {
        console.log('⚠️ Desconectando socket anterior...');
        this.socket.disconnect();
        this.socket = null;
    }

            
            this.socket = io({
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
                timeout: 10000,
                forceNew: true 
            });
            
            this.socket.on('connect', () => {
                console.log('✅ Socket conectado:', this.socket.id);
                this.connected = true;
                
                this.socket.emit('join_visit_chat', {
                    visit_id: this.visitId,
                    user_id: this.currentUserId
                });
            });
            
            this.socket.on('disconnect', () => {
                console.log('❌ Socket desconectado');
                this.connected = false;
            });
            
            this.socket.on('joined_room', (data) => {
                console.log('✅ Unido a sala:', data);
            });
            
            this.socket.on('new_message', (data) => {
                console.log('📨 Nuevo mensaje recibido:', data);
                this.messages.push(data);
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            });
            
            this.socket.on('messages_read', (data) => {
                console.log('✅ Mensajes marcados como leídos:', data);
                this.messages.forEach(msg => {
                    if (msg.id_mensaje <= data.last_message_id && msg.id_usuario !== this.currentUserId) {
                        msg.leido = true;
                    }
                });
            });
            
            this.socket.on('error', (data) => {
                console.error('❌ Error del servidor:', data);
                Swal.fire('Error', data.message || 'Error en el chat', 'error');
            });
            
            this.socket.on('connect_error', (error) => {
                console.error('❌ Error de conexión:', error);
                this.connected = false;
            });
        },
        
        loadMessages() {
            console.log('📥 Cargando mensajes de visita:', this.visitId);
            this.isLoading = true;
            
            fetch(`/api/chat-visit/messages-with-photos/${this.visitId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    this.isLoading = false;
                    
                    if (data.success) {
                        console.log('✅ Mensajes cargados:', data.messages.length);
                        this.messages = data.messages || [];
                        
                        if (data.rejected_photos && data.rejected_photos.length > 0) {
                            this.messages.unshift(this.createRejectedPhotosInfoMessage(data.rejected_photos));
                        }
                        
                        if (this.messages.length === 0) {
                            console.log('ℹ️ No hay mensajes en el historial');
                        }
                        
                        this.$nextTick(() => {
                            this.scrollToBottom();
                            this.markMessagesAsRead();
                        });
                    } else {
                        console.error('❌ Error al cargar mensajes:', data.message);
                        Swal.fire('Error', 'No se pudieron cargar los mensajes', 'error');
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    console.error('❌ Error al cargar mensajes:', error);
                    Swal.fire('Error', `No se pudo conectar con el servidor: ${error.message}`, 'error');
                });
        },
        
        sendMessage() {
            const message = this.newMessage.trim();
            
            if (!message) {
                console.warn('⚠️ Mensaje vacío, no se enviará');
                return;
            }
            
            if (!this.connected) {
                Swal.fire('Error', 'No estás conectado al chat. Intenta recargar la página.', 'error');
                return;
            }
            
            console.log('📤 Enviando mensaje:', {
                visit_id: this.visitId,
                user_id: this.currentUserId,
                user_type: this.userType,
                message: message
            });
            
            if (!this.visitId || !this.currentUserId) {
                console.error('❌ Faltan datos para enviar el mensaje');
                Swal.fire('Error', 'No se puede enviar el mensaje. Faltan datos de sesión.', 'error');
                return;
            }
            
            this.socket.emit('send_message', {
                visit_id: parseInt(this.visitId),
                user_id: parseInt(this.currentUserId),
                user_type: this.userType,
                message: message
            });
            
            this.newMessage = '';
        },
        
        markMessagesAsRead() {
            if (this.messages.length === 0) return;
            
            const unreadMessages = this.messages.filter(msg => 
                !msg.leido && msg.id_usuario !== this.currentUserId
            );
            
            if (unreadMessages.length === 0) return;
            
            console.log('📖 Marcando mensajes como leídos...');
            
            if (this.socket && this.connected) {
                this.socket.emit('mark_messages_read', {
                    visit_id: this.visitId,
                    user_id: this.currentUserId
                });
            }
        },
        
        scrollToBottom() {
            const container = this.$refs.messagesContainer;
            if (container) {
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight;
                }, 100);
            }
        },
        
        formatMessage(msg) {
            if (!msg.fecha_mensaje) return '';
            const date = new Date(msg.fecha_mensaje);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        
        getImageUrl(filePath) {
            if (!filePath) return '';
            const cleanPath = filePath.replace('X://', '').replace('X:/', '').replace(/\\\\/g, '/');
            return `/api/image/${encodeURIComponent(cleanPath)}`;
        },
        
        isRejectionMessage(msg) {
            return msg.mensaje && (
                msg.mensaje.includes('**Foto') && 
                msg.mensaje.includes('Rechazada**')
            );
        },
        
        parseRejectionMessage(mensaje) {
            const lines = mensaje.split('\n');
            let tipoFoto = '';
            let razon = '';
            let comentario = '';
            
            for (let line of lines) {
                if (line.includes('**Foto') && line.includes('Rechazada**')) {
                    const match = line.match(/Foto\s+(ANTES|DESPUES)\s+Rechazada/i);
                    if (match) {
                        tipoFoto = match[1].toLowerCase();
                    }
                } else if (line.includes('**Razón:**')) {
                    razon = line.replace('**Razón:**', '').trim();
                } else if (line.includes('**Razones:**')) {
                    razon = line.replace('**Razones:**', '').trim();
                } else if (line.includes('**Comentario adicional:**')) {
                    comentario = line.replace('**Comentario adicional:**', '').trim();
                }
            }
            
            return { tipoFoto, razon, comentario };
        },
        
        createRejectedPhotosInfoMessage(rejectedPhotos) {
            let message = '🚫 **Fotos Rechazadas en esta visita:**\n\n';
            rejectedPhotos.forEach((photo, index) => {
                message += `${index + 1}. **Foto ${photo.tipo.toUpperCase()}**\n`;
                message += `   📋 Razón: ${photo.razon || 'No especificada'}\n`;
                if (photo.descripcion) {
                    message += `   💬 Comentario: ${photo.descripcion}\n`;
                }
                message += '\n';
            });
            
            return {
                id_mensaje: 0,
                tipo_usuario: 'sistema',
                mensaje: message,
                fecha_mensaje: new Date().toISOString(),
                leido: true
            };
        }
    },
    template: `
        <div class="chat-container-full">
            <div class="chat-header-full">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">
                        <i class="bi bi-chat-dots-fill me-2"></i>
                        Chat de Visita #<span v-text="visitId"></span>
                    </h5>
                    <div>
                        <span v-if="connected" class="badge bg-success">
                            <i class="bi bi-circle-fill"></i> Conectado
                        </span>
                        <span v-else class="badge bg-danger">
                            <i class="bi bi-circle-fill"></i> Desconectado
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="chat-messages-full" ref="messagesContainer">
                <div v-if="isLoading" class="text-center text-muted py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2">Cargando mensajes...</p>
                </div>
                
                <div v-else-if="messages.length === 0" class="text-center text-muted py-5">
                    <i class="bi bi-chat-left-text fs-1"></i>
                    <p class="mt-2">No hay mensajes aún. ¡Inicia la conversación!</p>
                </div>
                
                <div v-for="msg in messages" :key="msg.id_mensaje" 
                     :class="['message-bubble', msg.tipo_usuario === 'sistema' ? 'message-system' : (msg.id_usuario === currentUserId ? 'message-right' : 'message-left')]">
                    
                    <!-- Mensaje del sistema -->
                    <div v-if="msg.tipo_usuario === 'sistema'" class="message-content-system">
                        <div v-html="msg.mensaje.replace(/\\n/g, '<br>')"></div>
                    </div>
                    
                    <!-- Mensaje de rechazo con foto -->
                    <div v-else-if="isRejectionMessage(msg)" class="message-content-rejection">
                        <div class="rejection-header">
                            <i class="bi bi-x-circle-fill text-danger me-2"></i>
                            <strong>Foto Rechazada</strong>
                        </div>
                        
                        <div class="rejection-photo" v-if="msg.file_path">
                            <img :src="getImageUrl(msg.file_path)" 
                                 alt="Foto rechazada" 
                                 class="rejection-image"
                                 @error="$event.target.style.display='none'">
                        </div>
                        
                        <div class="rejection-details">
                            <div class="rejection-type">
                                <i class="bi bi-image me-2"></i>
                                <span v-text="'Tipo: ' + parseRejectionMessage(msg.mensaje).tipoFoto.toUpperCase()"></span>
                            </div>
                            
                            <div class="rejection-reason" v-if="parseRejectionMessage(msg.mensaje).razon">
                                <i class="bi bi-exclamation-triangle me-2"></i>
                                <strong>Razón:</strong>
                                <span v-text="parseRejectionMessage(msg.mensaje).razon"></span>
                            </div>
                            
                            <div class="rejection-comment" v-if="parseRejectionMessage(msg.mensaje).comentario">
                                <i class="bi bi-chat-left-quote me-2"></i>
                                <strong>Comentario:</strong>
                                <span v-text="parseRejectionMessage(msg.mensaje).comentario"></span>
                            </div>
                        </div>
                        
                        <div class="message-time-rejection" v-text="formatMessage(msg)"></div>
                    </div>
                    
                    <!-- Mensaje normal -->
                    <div v-else class="message-content">
                        <div class="message-header">
                            <span class="message-sender">
                                <i :class="msg.tipo_usuario === 'cliente' ? 'bi bi-person-fill' : 'bi bi-person-badge'"></i>
                                <span v-text="msg.tipo_usuario === 'cliente' ? 'Cliente' : 'Analista'"></span>
                            </span>
                            <span class="message-time" v-text="formatMessage(msg)"></span>
                        </div>
                        <div class="message-text" v-text="msg.mensaje"></div>
                        <div v-if="msg.id_usuario === currentUserId" class="message-status">
                            <i v-if="msg.leido" class="bi bi-check-all text-primary" title="Leído"></i>
                            <i v-else class="bi bi-check" title="Enviado"></i>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input-full">
                <div class="input-group">
                    <input 
                        v-model="newMessage" 
                        @keyup.enter="sendMessage"
                        type="text" 
                        class="form-control" 
                        placeholder="Escribe tu mensaje..."
                        :disabled="!connected">
                    <button 
                        @click="sendMessage" 
                        class="btn btn-primary"
                        :disabled="!connected || !newMessage.trim()">
                        <i class="bi bi-send-fill"></i> Enviar
                    </button>
                </div>
            </div>
        </div>
    `
};

window.initChatWebSocket = function(visitId) {
    console.log('🚀 Inicializando chat para visita:', visitId);
    
    const { createApp } = Vue;
    const app = createApp(ChatWebSocket);
    
    const chatElement = document.getElementById('chat-app');
    if (chatElement) {
        chatElement.dataset.visitId = visitId;
        app.mount('#chat-app');
        console.log('✅ Chat montado correctamente');
    } else {
        console.error('❌ No se encontró el elemento #chat-app');
    }
};

console.log('✅ Módulo chat_websocket.js cargado');