// static/js/components/PhotoChat.js
const PhotoChat = {
    props: {
        photoId: {
            type: Number,
            required: true
        },
        currentUserId: {
            type: Number,
            default: null
        },
        height: {
            type: String,
            default: '400px'
        },
        pollInterval: {
            type: Number,
            default: 3000
        },
        showHeader: {
            type: Boolean,
            default: true
        }
    },
    
    data() {
        return {
            messages: [],
            newMessage: '',
            loading: false,
            pollTimer: null
        }
    },
    
    template: `
        <div class="photo-chat-component" :style="{height: height}">
            <div v-if="showHeader" class="chat-header">
                <i class="bi bi-chat-dots"></i> Chat de la foto
            </div>
            
            <div class="chat-messages" ref="messagesContainer">
                <div v-if="loading && messages.length === 0" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm"></div>
                    <span class="ms-2">Cargando...</span>
                </div>
                
                <div v-else-if="messages.length === 0" class="text-center text-muted py-4">
                    <i class="bi bi-chat-dots fs-3"></i>
                    <p class="mt-2 mb-0">No hay mensajes</p>
                </div>
                
                <div v-else>
                    <div v-for="msg in messages" :key="msg.id_mensaje" 
                         :class="['message-bubble', msg.es_mio ? 'my-message' : 'other-message']">
                        
                        <div v-if="msg.file_path" class="message-photo mb-2">
                            <img :src="getImageUrl(msg.file_path)" alt="Foto" 
                                 class="img-thumbnail" 
                                 style="max-width: 200px; cursor: pointer;"
                                 @click="openImage(msg.file_path)">
                        </div>
                        
                        <div class="message-content" v-html="formatMessage(msg.mensaje)"></div>
                        
                        <div class="message-info">
                            <small :class="msg.es_mio ? 'text-white-50' : 'text-muted'">
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
                const url = '/api/chat/messages/' + this.photoId;
                const response = await fetch(url);
                const data = await response.json();
                
                if (data.success) {
                    this.messages = data.messages;
                    this.$emit('messages-loaded', this.messages);
                }
            } catch (error) {
                console.error('Error:', error);
                this.$emit('error', 'Error al cargar mensajes');
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
                    this.$emit('message-sent', data);
                } else {
                    this.newMessage = mensaje;
                    this.$emit('error', data.error || 'No se pudo enviar');
                }
            } catch (error) {
                this.newMessage = mensaje;
                this.$emit('error', 'Error de conexión');
            } finally {
                this.loading = false;
            }
        },
        
        formatMessage(msg) {
            return msg.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        },
        
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            const now = new Date();
            const diff = now - date;
            
            if (diff < 60000) return 'Ahora';
            if (diff < 3600000) {
                const minutes = Math.floor(diff / 60000);
                return minutes + 'm';
            }
            if (diff < 86400000) {
                const hours = Math.floor(diff / 3600000);
                return hours + 'h';
            }
            
            return date.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short', 
                hour: '2-digit', 
                minute: '2-digit'
            });
        },
        
        getImageUrl(path) {
            return window.getImageUrl ? window.getImageUrl(path) : '/fotos/' + path;
        },
        
        openImage(path) {
            window.open(this.getImageUrl(path), '_blank');
        },
        
        startPolling() {
            const self = this;
            this.pollTimer = setInterval(function() {
                self.loadMessages();
            }, this.pollInterval);
        },
        
        stopPolling() {
            if (this.pollTimer) {
                clearInterval(this.pollTimer);
                this.pollTimer = null;
            }
        },
        
        refresh() {
            this.loadMessages();
        }
    },
    
    mounted() {
        this.loadMessages();
        this.startPolling();
    },
    
    beforeUnmount() {
        this.stopPolling();
    },
    
    watch: {
        photoId: function(newId) {
            if (newId) {
                this.messages = [];
                this.loadMessages();
            }
        }
    }
};

if (typeof window !== 'undefined') {
    window.PhotoChat = PhotoChat;
}