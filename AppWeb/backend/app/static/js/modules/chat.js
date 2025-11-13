// static/js/modules/chat.js
const ChatModule = {
    data() {
        return {
            messages: [],
            newMessage: '',
            photoId: null,
            currentUserId: null,
            loading: false,
            pollInterval: null
        }
    },
    
    template: `
        <div class="chat-container">
            <div class="chat-messages" ref="messagesContainer">
                <div v-if="loading" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm"></div>
                    <span class="ms-2">Cargando mensajes...</span>
                </div>
                
                <div v-else-if="messages.length === 0" class="text-center text-muted py-4">
                    <i class="bi bi-chat-dots fs-3"></i>
                    <p class="mt-2 mb-0">No hay mensajes aún</p>
                </div>
                
                <div v-else>
                    <div v-for="msg in messages" :key="msg.id_mensaje" 
                         :class="['message-bubble', msg.es_mio ? 'my-message' : 'other-message']">
                        
                        <!-- Foto adjunta (solo en mensaje de rechazo) -->
                        <div v-if="msg.file_path" class="message-photo mb-2">
                            <img :src="'/fotos/' + msg.file_path" alt="Foto rechazada" 
                                 class="img-thumbnail" style="max-width: 200px;">
                        </div>
                        
                        <!-- Contenido del mensaje -->
                        <div class="message-content" v-html="formatMessage(msg.mensaje)"></div>
                        
                        <!-- Info del mensaje -->
                        <div class="message-info">
                            <small class="text-muted">
                                <strong>{{ msg.nombre_display }}</strong> • 
                                {{ formatDate(msg.fecha_mensaje) }}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="chat-input">
                <div class="input-group">
                    <input 
                        type="text" 
                        class="form-control" 
                        v-model="newMessage"
                        @keyup.enter="sendMessage"
                        placeholder="Escribe un mensaje..."
                        :disabled="loading">
                    <button 
                        class="btn btn-primary" 
                        @click="sendMessage"
                        :disabled="!newMessage.trim() || loading">
                        <i class="bi bi-send"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    
    methods: {
        async loadMessages() {
            if (!this.photoId) return;
            
            try {
                const response = await fetch(`/api/chat/messages/${this.photoId}`);
                const data = await response.json();
                
                if (data.success) {
                    this.messages = data.messages;
                    this.$nextTick(() => this.scrollToBottom());
                }
            } catch (error) {
                console.error('Error al cargar mensajes:', error);
            }
        },
        
        async sendMessage() {
            if (!this.newMessage.trim()) return;
            
            const mensaje = this.newMessage.trim();
            this.newMessage = '';
            this.loading = true;
            
            try {
                const response = await fetch('/api/chat/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        photo_id: this.photoId,
                        mensaje: mensaje
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    await this.loadMessages();
                } else {
                    Swal.fire('Error', data.error || 'No se pudo enviar el mensaje', 'error');
                    this.newMessage = mensaje; // Restaurar mensaje
                }
            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                Swal.fire('Error', 'Error de conexión', 'error');
                this.newMessage = mensaje;
            } finally {
                this.loading = false;
            }
        },
        
        formatMessage(msg) {
            return msg
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\n/g, '<br>');
        },
        
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;
            
            if (diff < 60000) return 'Ahora';
            if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
            if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
            
            return date.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        scrollToBottom() {
            const container = this.$refs.messagesContainer;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        },
        
        startPolling() {
            this.pollInterval = setInterval(() => {
                this.loadMessages();
            }, 3000); // Actualizar cada 3 segundos
        },
        
        stopPolling() {
            if (this.pollInterval) {
                clearInterval(this.pollInterval);
                this.pollInterval = null;
            }
        },
        
        initChat(photoId, userId) {
            this.photoId = photoId;
            this.currentUserId = userId;
            this.loadMessages();
            this.startPolling();
        },
        
        destroy() {
            this.stopPolling();
        }
    },
    
    mounted() {
        // El chat se inicializa externamente
    },
    
    beforeUnmount() {
        this.destroy();
    }
};