// ===================================================================
// SISTEMA DE NOTIFICACIONES CON WEBSOCKET
// ===================================================================

// Configuración
const WS_NOTIFICATION_CONFIG = {
    maxNotifications: 5,
    soundEnabled: true,
    reconnectDelay: 3000
};

// Estado global
let wsNotificationState = {
    socket: null,
    connected: false,
    unreadCount: 0,
    notifications: [],
    reconnectTimer: null
};

// ===================================================================
// INICIALIZACIÓN
// ===================================================================

$(document).ready(function() {
    console.log('🔔 Inicializando sistema de notificaciones WebSocket');
    
    // Conectar WebSocket
    connectWebSocket();
    
    // Solicitar notificaciones iniciales
    setTimeout(() => {
        requestNotifications();
    }, 1000);
    
    // Event listeners
    initEventListeners();
});

// ===================================================================
// WEBSOCKET CONNECTION
// ===================================================================

function connectWebSocket() {
    try {
        // Conectar a Socket.IO
        wsNotificationState.socket = io({
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: WS_NOTIFICATION_CONFIG.reconnectDelay,
            reconnectionAttempts: Infinity
        });

        // Event: Conectado
        wsNotificationState.socket.on('connect', function() {
            console.log('✅ WebSocket conectado');
            wsNotificationState.connected = true;
            
            // Solicitar notificaciones
            requestNotifications();
        });

        // Event: Desconectado
        wsNotificationState.socket.on('disconnect', function() {
            console.log('❌ WebSocket desconectado');
            wsNotificationState.connected = false;
        });

        // Event: Nueva notificación
        wsNotificationState.socket.on('new_notification', function(data) {
            console.log('🔔 NUEVA NOTIFICACIÓN recibida:', data);
            handleNewNotification(data.notification);
        });

        // Event: Actualización de notificaciones
        wsNotificationState.socket.on('notifications_update', function(data) {
            console.log('📬 Actualización de notificaciones:', data);
            wsNotificationState.notifications = data.notificaciones || [];
            wsNotificationState.unreadCount = data.no_leidas || 0;
            renderNotifications();
        });

        // Event: Notificación marcada
        wsNotificationState.socket.on('notification_marked', function(data) {
            console.log('✅ Notificación marcada:', data);
            if (data.success) {
                removeNotificationFromUI(data.notification_id);
            }
        });

        // Event: Error
        wsNotificationState.socket.on('error', function(error) {
            console.error('❌ Error WebSocket:', error);
        });

    } catch (error) {
        console.error('❌ Error conectando WebSocket:', error);
    }
}

// ===================================================================
// SOLICITAR NOTIFICACIONES
// ===================================================================

function requestNotifications() {
    if (!wsNotificationState.socket || !wsNotificationState.connected) {
        console.log('⚠️ Socket no conectado, usando fallback HTTP');
        loadNotificationsHTTP();
        return;
    }

    console.log('📡 Solicitando notificaciones vía WebSocket');
    wsNotificationState.socket.emit('request_notifications', {
        leido: 0,
        limit: WS_NOTIFICATION_CONFIG.maxNotifications
    });
}

// Fallback HTTP si WebSocket falla
function loadNotificationsHTTP() {
    $.ajax({
        url: '/api/notificaciones-rechazo',
        method: 'GET',
        data: { leido: 0, limit: WS_NOTIFICATION_CONFIG.maxNotifications },
        success: function(response) {
            if (response.success) {
                wsNotificationState.notifications = response.notificaciones || [];
                wsNotificationState.unreadCount = response.no_leidas || 0;
                renderNotifications();
            }
        },
        error: function(xhr, status, error) {
            console.error('❌ Error cargando notificaciones HTTP:', error);
        }
    });
}

// ===================================================================
// MANEJAR NUEVA NOTIFICACIÓN
// ===================================================================

function handleNewNotification(notification) {
    // Agregar al inicio del array
    wsNotificationState.notifications.unshift(notification);
    
    // Mantener solo las últimas N notificaciones
    if (wsNotificationState.notifications.length > WS_NOTIFICATION_CONFIG.maxNotifications) {
        wsNotificationState.notifications.pop();
    }
    
    // Incrementar contador
    wsNotificationState.unreadCount++;
    
    // Actualizar UI
    renderNotifications();
    
    // Reproducir sonido
    if (WS_NOTIFICATION_CONFIG.soundEnabled) {
        playNotificationSound();
    }
    
    // Mostrar toast
    showNotificationToast(notification);
}

// ===================================================================
// RENDERIZAR NOTIFICACIONES
// ===================================================================

function renderNotifications() {
    const $container = $('#notificationList');
    const $badge = $('#notificationCount');
    
    // Actualizar badge
    if (wsNotificationState.unreadCount > 0) {
        $badge.text(wsNotificationState.unreadCount).show();
    } else {
        $badge.hide();
    }
    
    // Si no hay notificaciones
    if (wsNotificationState.notifications.length === 0) {
        $container.html(`
            <div class="notification-empty">
                <i class="bi bi-bell-slash"></i>
                <p>No tienes notificaciones</p>
            </div>
        `);
        return;
    }
    
    // Renderizar notificaciones
    $container.empty();
    wsNotificationState.notifications.forEach(notif => {
        $container.append(createNotificationHTML(notif));
    });
}

function createNotificationHTML(notif) {
    const leidoNumero = parseInt(notif.leido);
    const esLeida = leidoNumero === 1;
    const claseLeidaCard = esLeida ? 'leida' : 'no-leida';
    const badgeText = esLeida ? 'LEÍDA' : 'NUEVA';
    const badgeClass = esLeida ? 'leida' : 'nueva';
    
    // Determinar tipo de foto por descripción o ID
    let tipoFoto = 'Foto';
    let iconoTipo = '📸';
    
    if (notif.tipo_foto) {
        tipoFoto = notif.tipo_foto;
    } else if (notif.descripcion) {
        const desc = notif.descripcion.toLowerCase();
        if (desc.includes('gestión') || desc.includes('gestion')) {
            tipoFoto = 'Gestión';
            iconoTipo = '🔄';
        } else if (desc.includes('precio')) {
            tipoFoto = 'Precio';
            iconoTipo = '💰';
        } else if (desc.includes('exhibic') || desc.includes('pop')) {
            tipoFoto = 'Exhibiciones';
            iconoTipo = '🖼️';
        } else if (desc.includes('pdv') || desc.includes('activación')) {
            tipoFoto = 'PDV';
            iconoTipo = '🏪';
        }
    }
    
    const fecha = notif.fecha_notificacion ? 
        new Date(notif.fecha_notificacion).toLocaleString('es-VE', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Fecha desconocida';
    
    return `
        <div class="notif-card ${claseLeidaCard}" 
             data-id="${notif.id_notificacion}" 
             data-leido="${leidoNumero}"
             onclick="handleNotificationClick(${notif.id_notificacion}, ${notif.id_visita})">
            <span class="notif-badge ${badgeClass}">${badgeText}</span>
            <div class="notif-content">
                <h6>${iconoTipo} Rechazo de ${tipoFoto}</h6>
                <p>
                    <strong>${notif.nombre_cliente || 'Cliente'}</strong><br>
                    ${notif.punto_venta || 'Punto de venta'}
                </p>
                <small>
                    <i class="bi bi-clock"></i> ${fecha}
                    <i class="bi bi-geo-alt ms-2"></i> Visita #${notif.id_visita}
                </small>
            </div>
        </div>
    `;
}

// ===================================================================
// MANEJAR CLICK EN NOTIFICACIÓN
// ===================================================================

function handleNotificationClick(notificationId, visitaId) {
    console.log(`🖱️ Click en notificación #${notificationId}`);
    
    // Marcar como leída vía WebSocket
    if (wsNotificationState.socket && wsNotificationState.connected) {
        wsNotificationState.socket.emit('mark_as_read', {
            notification_id: notificationId
        });
    } else {
        // Fallback HTTP
        markAsReadHTTP(notificationId);
    }
    
    // Redirigir a la visita (opcional)
    // window.location.href = `/punto/visita/${visitaId}`;
}

function markAsReadHTTP(notificationId) {
    $.ajax({
        url: `/api/marcar-notificacion-leida/${notificationId}`,
        method: 'POST',
        success: function(response) {
            if (response.success) {
                removeNotificationFromUI(notificationId);
            }
        },
        error: function(xhr, status, error) {
            console.error('❌ Error marcando como leída:', error);
        }
    });
}

function removeNotificationFromUI(notificationId) {
    // Remover del array
    const index = wsNotificationState.notifications.findIndex(n => n.id_notificacion === notificationId);
    if (index !== -1) {
        wsNotificationState.notifications.splice(index, 1);
        wsNotificationState.unreadCount = Math.max(0, wsNotificationState.unreadCount - 1);
    }
    
    // Remover del DOM con animación
    $(`.notif-card[data-id="${notificationId}"]`).fadeOut(300, function() {
        $(this).remove();
        
        // Si no quedan notificaciones, mostrar mensaje vacío
        if (wsNotificationState.notifications.length === 0) {
            renderNotifications();
        }
    });
    
    // Actualizar badge
    const $badge = $('#notificationCount');
    if (wsNotificationState.unreadCount > 0) {
        $badge.text(wsNotificationState.unreadCount);
    } else {
        $badge.hide();
    }
}

// ===================================================================
// MARCAR TODAS COMO LEÍDAS
// ===================================================================

function markAllAsRead() {
    if (wsNotificationState.notifications.length === 0) {
        return;
    }
    
    console.log('✅ Marcando todas las notificaciones como leídas');
    
    const notificationsToMark = [...wsNotificationState.notifications];
    
    notificationsToMark.forEach(notif => {
        if (wsNotificationState.socket && wsNotificationState.connected) {
            wsNotificationState.socket.emit('mark_as_read', {
                notification_id: notif.id_notificacion
            });
        } else {
            markAsReadHTTP(notif.id_notificacion);
        }
    });
    
    // Limpiar estado local
    wsNotificationState.notifications = [];
    wsNotificationState.unreadCount = 0;
    renderNotifications();
}

// ===================================================================
// SONIDO Y TOAST
// ===================================================================

function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBCt9y/DVgjMGHm7A7+OZRQ0PVavk7a5aFwxJouHxwmwhBSuAy+/TgjMGHm7A7+OZRQ0PVavk7a5aFwxJouHxwmwhBSuAy+/TgjMGHm7A7+OZRQ0PVavk7a5aFwxJouHxwmwhBSuAy+/TgjMGHm7A7+OZRQ0PVavk7a5aFwxJouHxwmwhBSuAy+/TgjMGHm7A7+OZRQ0PVavk7a5aFwxJouHxwmwhBSuAy+/TgjMGHm7A7+OZ');
        audio.volume = 0.3;
        audio.play().catch(e => console.log('No se pudo reproducir sonido:', e));
    } catch (e) {
        console.log('Error reproduciendo sonido:', e);
    }
}

function showNotificationToast(notification) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Nueva notificación',
            text: `${notification.nombre_cliente} - ${notification.punto_venta}`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });
    }
}

// ===================================================================
// EVENT LISTENERS
// ===================================================================

function initEventListeners() {
    // Marcar todas como leídas
    $('#markAllAsRead').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        markAllAsRead();
    });
    
    // Ver todas las notificaciones
    $('#viewAllNotifications').on('click', function(e) {
        e.preventDefault();
        window.location.href = '/notificaciones';
    });
    
    // Reabrir dropdown para refrescar
    $('#notificationBell').on('click', function() {
        if ($('#notificationDropdown').hasClass('show')) {
            requestNotifications();
        }
    });
}

// ===================================================================
// EXPORTAR FUNCIONES GLOBALES
// ===================================================================

window.wsNotifications = {
    request: requestNotifications,
    markAllAsRead: markAllAsRead,
    getState: () => wsNotificationState
};