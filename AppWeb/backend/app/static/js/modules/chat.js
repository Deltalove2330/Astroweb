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
        <div v-if="loading && messages.length === 0" class="text-center py-3">
            <div class="spinner-border spinner-border-sm"></div>
            <span class="ms-2">Cargando mensajes...</span>
        </div>
        
        <div v-else-if="messages.length === 0" class="text-center text-muted py-4">
            <i class="bi bi-chat-dots fs-3"></i>
            <p class="mt-2 mb-0">No hay mensajes aún</p>
        </div>
        
        <div v-else>
            <div v-for="msg in messages" :key="msg.id_mensaje"
                 :class="['message-wrapper', msg.es_mio ? 'message-right' : 'message-left']">
                
                <div class="message-bubble">
                    <!-- Foto adjunta (solo en mensaje de rechazo) -->
                    <div v-if="msg.file_path" class="message-photo mb-2">
                        <img :src="getImageUrl(msg.file_path)" alt="Foto rechazada"
                             class="img-thumbnail" style="max-width: 200px; cursor: pointer;"
                             @click="openImageModal(msg.file_path)">
                    </div>
                    
                    <!-- Contenido del mensaje -->
                    <div class="message-content" v-html="formatMessage(msg.mensaje)"></div>
                    
                    <!-- Info del mensaje: Usuario, fecha y estado de leído -->
                    <div class="message-footer">
                        <small class="message-author">
                            <i class="bi bi-person-circle me-1"></i>
                            <strong>{{ msg.nombre_display }}</strong>
                            <span class="badge bg-secondary ms-1">{{ msg.tipo_usuario }}</span>
                        </small>
                        <small class="message-time">
                            <i class="bi bi-clock me-1"></i>
                            {{ formatDateTime(msg.fecha_mensaje) }}
                        </small>
                        <small v-if="msg.es_mio" class="message-status ms-2">
                            <!-- Iconos de estado de lectura -->
                            <i v-if="msg.leido" class="bi bi-check-all text-primary" title="Visto"></i>
                            <i v-else class="bi bi-check text-muted" title="Enviado"></i>
                            {{ msg.leido ? 'Visto' : 'Enviado' }}
                        </small>
                    </div>
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


        async markMessagesAsRead() {
        if (!this.photoId) return;
        
        try {
            const response = await fetch(`/api/chat/mark-read/${this.photoId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            
            const data = await response.json();
            if (data.success) {
                // Actualizar localmente el estado de los mensajes
                this.messages.forEach(msg => {
                    if (!msg.es_mio) {
                        msg.leido = true;
                    }
                });
            }
        } catch (error) {
            console.error('Error al marcar mensajes como leídos:', error);
        }
    },

        async loadMessages() {
        if (!this.photoId) return;
        
        try {
            const response = await fetch(`/api/chat/messages/${this.photoId}`);
            const data = await response.json();
            
            if (data.success) {
                this.messages = data.messages;
                
                // Marcar mensajes como leídos después de cargarlos
                setTimeout(() => {
                    this.markMessagesAsRead();
                }, 500);
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
                
                // Marcar mensajes como leídos después de enviar
                setTimeout(() => {
                    this.markMessagesAsRead();
                }, 500);
            } else {
                Swal.fire('Error', data.error || 'No se pudo enviar el mensaje', 'error');
                this.newMessage = mensaje;
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

        formatDateTime(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    
    // Formato: "12 Nov, 14:35"
    return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: 'short'
    }) + ', ' + date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
},


        
        getImageUrl(path) {
            return window.getImageUrl ? window.getImageUrl(path) : '/fotos/' + path;
        },
        
        openImageModal(filePath) {
            const imageUrl = this.getImageUrl(filePath);
            window.open(imageUrl, '_blank');
        },
        
        startPolling() {
    this.pollInterval = setInterval(() => {
        this.loadMessages();
        
        this.markMessagesAsRead();// Esto también marcará mensajes como leídos
    }, 3000);
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
            this.messages = [];
            this.loadMessages();
            this.startPolling();
        },
        
        destroy() {
            this.stopPolling();
            this.messages = [];
            this.newMessage = '';
        }
    },
    
    mounted() {
        // El chat se inicializa externamente
    },
    
    beforeUnmount() {
        this.destroy();
    }
};