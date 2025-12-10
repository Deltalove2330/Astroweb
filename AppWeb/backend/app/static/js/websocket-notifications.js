// ===================================================================
// WEBSOCKET NOTIFICATIONS - VERSIÓN CORREGIDA
// ===================================================================

console.log('🔧 Cargando módulo de notificaciones...');

var notifSocket = null;
var notifList = [];
var notifCount = 0;
var isLoading = false;          // ⭐ Flag para evitar cargas múltiples
var lastLoadTime = 0;           // ⭐ Timestamp de última carga
var isInitialized = false;      // ⭐ Evitar inicialización múltiple
var LOAD_COOLDOWN = 2000;       // ⭐ 2 segundos mínimo entre cargas

// ===================================================================
// INICIALIZAR AL CARGAR PÁGINA
// ===================================================================

$(document).ready(function() {
    if (isInitialized) {
        console.log('⚠️ Ya inicializado, ignorando...');
        return;
    }
    isInitialized = true;
    
    console.log('🚀 Inicializando WebSocket...');
    initWebSocket();
    setupButtons();
});

// ===================================================================
// CONECTAR WEBSOCKET
// ===================================================================

function initWebSocket() {
    // ⭐ Si ya existe conexión, no crear otra
    if (notifSocket && notifSocket.connected) {
        console.log('⚠️ Socket ya conectado, ignorando...');
        return;
    }
    
    console.log('🔌 Conectando a Socket.IO...');
    
    if (typeof io === 'undefined') {
        console.error('❌ Socket.IO no está cargado!');
        return;
    }
    
    // ⭐ Desconectar socket anterior si existe
    if (notifSocket) {
        notifSocket.removeAllListeners();
        notifSocket.disconnect();
    }
    
    notifSocket = io('/', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
        forceNew: false  // ⭐ Reutilizar conexión existente
    });
    
    // ========================================
    // EVENTO: CONECTADO
    // ========================================
    notifSocket.on('connect', function() {
        console.log('✅ WEBSOCKET CONECTADO - SID:', notifSocket.id);
        
        // ⭐ Solo cargar si pasó el cooldown (evita recargas en reconexiones rápidas)
        var now = Date.now();
        if (now - lastLoadTime > LOAD_COOLDOWN) {
            loadNotifications();
        } else {
            console.log('⏳ Cooldown activo, no se recargan notificaciones');
        }
    });
    
    // ========================================
    // EVENTO: DESCONECTADO
    // ========================================
    notifSocket.on('disconnect', function(reason) {
        console.log('❌ WebSocket desconectado:', reason);
    });
    
    // ========================================
    // ⭐ EVENTO: NUEVA NOTIFICACIÓN
    // ========================================
    notifSocket.on('new_notification', function(data) {
        console.log('🔔 ¡NUEVA NOTIFICACIÓN!', data);
        
        if (data && data.notification) {
            addNotification(data.notification);
        }
    });
    
    // ========================================
    // EVENTO: ACTUALIZACIÓN DE LISTA
    // ========================================
    notifSocket.on('notifications_update', function(data) {
        console.log('📬 Actualización recibida:', data.notificaciones?.length, 'notificaciones');
        
        // ⭐ Resetear flag de carga
        isLoading = false;
        
        if (data && data.notificaciones) {
            // ⭐ Solo actualizar si hay cambios reales
            var newIds = data.notificaciones.map(n => n.id_notificacion).join(',');
            var oldIds = notifList.map(n => n.id_notificacion).join(',');
            
            if (newIds !== oldIds || data.no_leidas !== notifCount) {
                notifList = data.notificaciones;
                notifCount = data.no_leidas || 0;
                renderNotifications();
            } else {
                console.log('📋 Sin cambios, no se re-renderiza');
            }
        }
    });
    
    // ========================================
    // EVENTO: MARCADA COMO LEÍDA
    // ========================================
    notifSocket.on('notification_marked', function(data) {
        console.log('✅ Notificación marcada:', data);
        
        if (data && data.success) {
            removeNotification(data.notification_id);
        }
    });
    
    console.log('✅ Listeners registrados');
}

// ===================================================================
// CARGAR NOTIFICACIONES (CON PROTECCIÓN)
// ===================================================================

function loadNotifications() {
    var now = Date.now();
    
    // ⭐ Verificar cooldown
    if (now - lastLoadTime < LOAD_COOLDOWN) {
        console.log('⏳ Cooldown activo, quedan', Math.round((LOAD_COOLDOWN - (now - lastLoadTime)) / 1000), 's');
        return;
    }
    
    // ⭐ Verificar si ya está cargando
    if (isLoading) {
        console.log('⏳ Ya hay una carga en progreso...');
        return;
    }
    
    isLoading = true;
    lastLoadTime = now;
    
    console.log('📡 Solicitando notificaciones...');
    
    if (notifSocket && notifSocket.connected) {
        notifSocket.emit('request_notifications', {
            leido: 0,
            limit: 5
        });
        
        // ⭐ Timeout por si no responde
        setTimeout(function() {
            if (isLoading) {
                console.log('⚠️ Timeout, reseteando flag');
                isLoading = false;
            }
        }, 5000);
    } else {
        console.log('⚠️ Socket no conectado, usando HTTP...');
        loadNotificationsHTTP();
    }
}

function loadNotificationsHTTP() {
    $.ajax({
        url: '/api/notificaciones-rechazo',
        method: 'GET',
        data: { leido: 0, limit: 5 },
        success: function(response) {
            isLoading = false;
            console.log('✅ Notificaciones HTTP:', response);
            
            if (response.success) {
                notifList = response.notificaciones || [];
                notifCount = response.no_leidas || 0;
                renderNotifications();
            }
        },
        error: function(err) {
            isLoading = false;
            console.error('❌ Error HTTP:', err);
        }
    });
}

// ===================================================================
// AGREGAR NUEVA NOTIFICACIÓN
// ===================================================================

function addNotification(notification) {
    console.log('➕ Agregando notificación:', notification.id_notificacion);
    
    // ⭐ Verificar que no exista ya
    var exists = notifList.some(function(n) {
        return n.id_notificacion === notification.id_notificacion;
    });
    
    if (exists) {
        console.log('⚠️ Notificación ya existe, ignorando');
        return;
    }
    
    notifList.unshift(notification);
    
    if (notifList.length > 5) {
        notifList.pop();
    }
    
    notifCount++;
    renderNotifications();
    playBeep();
    showToast(notification);
}

// ===================================================================
// RENDERIZAR NOTIFICACIONES
// ===================================================================

function renderNotifications() {
    console.log('🎨 Renderizando', notifList.length, 'notificaciones');
    
    var $list = $('#notificationList');
    var $badge = $('#notificationCount');
    
    // Actualizar badge
    if (notifCount > 0) {
        $badge.text(notifCount).show();
    } else {
        $badge.hide();
    }
    
    if (notifList.length === 0) {
        $list.html('<div class="notification-empty"><i class="bi bi-bell-slash"></i><p>No hay notificaciones</p></div>');
        return;
    }
    
    $list.empty();
    
    notifList.forEach(function(notif) {
        $list.append(createNotificationHTML(notif));
    });
}

function createNotificationHTML(notif) {
    var isRead = parseInt(notif.leido) === 1;
    var cardClass = isRead ? 'leida' : 'no-leida';
    var badge = isRead ? 'LEÍDA' : 'NUEVA';
    var badgeClass = isRead ? 'leida' : 'nueva';
    
    var iconMap = {
        'Gestion - Antes': '🔄',
        'Gestion - Despues': '🔄',
        'Precio': '💰',
        'Exhibiciones': '🖼️',
        'PDV': '🏪'
    };
    var icon = iconMap[notif.tipo_foto] || '📸';
    
    var fecha = 'Ahora';
    if (notif.fecha_notificacion) {
        try {
            fecha = new Date(notif.fecha_notificacion).toLocaleString('es-VE', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch(e) {
            fecha = 'Reciente';
        }
    }

    var fotoId = notif.id_foto_original || notif.id_foto || 'N/A';
    
    return `
        <div class="notif-card ${cardClass}" data-id="${notif.id_notificacion}" onclick="markAsRead(${notif.id_notificacion})">
            <span class="notif-badge ${badgeClass}">${badge}</span>
            <div class="notif-content">
                <h6>${icon} ${notif.tipo_foto || 'Rechazo'}</h6>
                <p><strong>${notif.nombre_cliente || 'Cliente'}</strong><br>${notif.punto_venta || 'Punto'}</p>
                <small>
                    <i class="bi bi-image"></i> Foto #${fotoId}
                    <i class="bi bi-clock ms-2"></i> ${fecha} 
                    <i class="bi bi-geo-alt ms-2"></i> Visita #${notif.id_visita}
                </small>
            </div>
        </div>
    `;
}

// ===================================================================
// MARCAR COMO LEÍDA
// ===================================================================

function markAsRead(notifId) {
    console.log('👆 Marcando como leída:', notifId);
    
    if (notifSocket && notifSocket.connected) {
        notifSocket.emit('mark_as_read', { notification_id: notifId });
    } else {
        $.post('/api/marcar-notificacion-leida/' + notifId, function(response) {
            if (response.success) {
                removeNotification(notifId);
            }
        });
    }
}

function removeNotification(notifId) {
    var index = notifList.findIndex(function(n) {
        return n.id_notificacion === notifId;
    });
    
    if (index !== -1) {
        notifList.splice(index, 1);
        notifCount = Math.max(0, notifCount - 1);
    }
    
    $('[data-id="' + notifId + '"]').fadeOut(300, function() {
        $(this).remove();
        if (notifList.length === 0) {
            renderNotifications();
        }
    });
    
    if (notifCount > 0) {
        $('#notificationCount').text(notifCount);
    } else {
        $('#notificationCount').hide();
    }
}

// ===================================================================
// MARCAR TODAS
// ===================================================================

function markAllAsRead() {
    console.log('✅ Marcando todas...');
    
    notifList.forEach(function(notif) {
        if (notifSocket && notifSocket.connected) {
            notifSocket.emit('mark_as_read', { notification_id: notif.id_notificacion });
        }
    });
    
    notifList = [];
    notifCount = 0;
    renderNotifications();
}

// ===================================================================
// SONIDO Y TOAST
// ===================================================================

function playBeep() {
    try {
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.value = 0.3;
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch(e) {}
}

function showToast(notif) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'warning',
            title: '🔔 Nueva Notificación',
            html: '<strong>' + notif.nombre_cliente + '</strong><br>' + notif.punto_venta,
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true
        });
    }
}

// ===================================================================
// BOTONES - ⭐ CORREGIDO
// ===================================================================

function setupButtons() {
    $('#markAllAsRead').click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        markAllAsRead();
    });
    
    $('#viewAllNotifications').click(function(e) {
        e.preventDefault();
        window.location.href = '/notificaciones';
    });
    
    // ⭐ REMOVIDO: Ya no recarga al hacer click en la campana
    // El dropdown solo muestra las notificaciones ya cargadas
}

// ===================================================================
// FUNCIONES GLOBALES
// ===================================================================

window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.reloadNotifications = function() {
    // ⭐ Forzar recarga (resetea cooldown)
    lastLoadTime = 0;
    loadNotifications();
};

console.log('✅ Módulo de notificaciones cargado');