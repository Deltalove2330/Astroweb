// ===================================================================
// WEBSOCKET NOTIFICATIONS - VERSIÓN ULTRA SIMPLIFICADA
// ===================================================================

console.log('🔧 Cargando módulo de notificaciones...');

var notifSocket = null;
var notifList = [];
var notifCount = 0;

// ===================================================================
// INICIALIZAR AL CARGAR PÁGINA
// ===================================================================

$(document).ready(function() {
    console.log('🚀 Inicializando WebSocket...');
    initWebSocket();
    setupButtons();
});

// ===================================================================
// CONECTAR WEBSOCKET
// ===================================================================

function initWebSocket() {
    console.log('🔌 Conectando a Socket.IO...');
    
    // Verificar que Socket.IO está disponible
    if (typeof io === 'undefined') {
        console.error('❌ Socket.IO no está cargado!');
        return;
    }
    
    // Conectar
    notifSocket = io('/', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10
    });
    
    // ========================================
    // EVENTO: CONECTADO
    // ========================================
    notifSocket.on('connect', function() {
        console.log('✅✅✅ WEBSOCKET CONECTADO ✅✅✅');
        console.log('Socket ID:', notifSocket.id);
        
        // Cargar notificaciones iniciales
        loadNotifications();
    });
    
    // ========================================
    // EVENTO: DESCONECTADO
    // ========================================
    notifSocket.on('disconnect', function() {
        console.log('❌ WebSocket desconectado');
    });
    
    // ========================================
    // ⭐⭐⭐ EVENTO CRÍTICO: NUEVA NOTIFICACIÓN ⭐⭐⭐
    // ========================================
    notifSocket.on('new_notification', function(data) {
        console.log('🔔🔔🔔 ¡¡¡NUEVA NOTIFICACIÓN RECIBIDA!!!');
        console.log('Datos completos:', data);
        console.log('Notificación:', data.notification);
        
        // Mostrar ALERT para confirmar
        alert('🔔 NOTIFICACIÓN RECIBIDA EN TIEMPO REAL!\n\n' + 
              'Cliente: ' + data.notification.nombre_cliente + '\n' +
              'Punto: ' + data.notification.punto_venta);
        
        // Agregar a la lista
        if (data && data.notification) {
            addNotification(data.notification);
        }
    });
    
    // ========================================
    // EVENTO: ACTUALIZACIÓN DE LISTA
    // ========================================
    notifSocket.on('notifications_update', function(data) {
        console.log('📬 Lista de notificaciones actualizada:', data);
        
        if (data && data.notificaciones) {
            notifList = data.notificaciones;
            notifCount = data.no_leidas || 0;
            renderNotifications();
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
    
    console.log('✅ Listeners registrados correctamente');
}

// ===================================================================
// CARGAR NOTIFICACIONES INICIALES
// ===================================================================

function loadNotifications() {
    console.log('📡 Pidiendo notificaciones al servidor...');
    
    if (notifSocket && notifSocket.connected) {
        notifSocket.emit('request_notifications', {
            leido: 0,
            limit: 5
        });
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
            console.log('✅ Notificaciones cargadas por HTTP:', response);
            
            if (response.success) {
                notifList = response.notificaciones || [];
                notifCount = response.no_leidas || 0;
                renderNotifications();
            }
        },
        error: function(err) {
            console.error('❌ Error HTTP:', err);
        }
    });
}

// ===================================================================
// AGREGAR NUEVA NOTIFICACIÓN
// ===================================================================

function addNotification(notification) {
    console.log('➕ Agregando notificación a la lista:', notification);
    
    // Agregar al inicio
    notifList.unshift(notification);
    
    // Limitar a 5
    if (notifList.length > 5) {
        notifList.pop();
    }
    
    // Incrementar contador
    notifCount++;
    
    // Renderizar
    renderNotifications();
    
    // Sonido
    playBeep();
    
    // Toast
    showToast(notification);
    
    console.log('✅ Notificación agregada y renderizada');
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
    
    // Si está vacío
    if (notifList.length === 0) {
        $list.html('<div class="notification-empty"><i class="bi bi-bell-slash"></i><p>No hay notificaciones</p></div>');
        return;
    }
    
    // Renderizar lista
    $list.empty();
    
    notifList.forEach(function(notif) {
        var html = createNotificationHTML(notif);
        $list.append(html);
    });
    
    console.log('✅ Renderizado completo');
}

function createNotificationHTML(notif) {
    var isRead = parseInt(notif.leido) === 1;
    var cardClass = isRead ? 'leida' : 'no-leida';
    var badge = isRead ? 'LEÍDA' : 'NUEVA';
    var badgeClass = isRead ? 'leida' : 'nueva';
    
    var icon = '📸';
    if (notif.tipo_foto === 'Gestión') icon = '🔄';
    else if (notif.tipo_foto === 'Precio') icon = '💰';
    else if (notif.tipo_foto === 'Exhibiciones') icon = '🖼️';
    else if (notif.tipo_foto === 'PDV') icon = '🏪';
    
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
    
    return `
        <div class="notif-card ${cardClass}" data-id="${notif.id_notificacion}" onclick="markAsRead(${notif.id_notificacion})">
            <span class="notif-badge ${badgeClass}">${badge}</span>
            <div class="notif-content">
                <h6>${icon} ${notif.tipo_foto || 'Rechazo'}</h6>
                <p><strong>${notif.nombre_cliente || 'Cliente'}</strong><br>${notif.punto_venta || 'Punto'}</p>
                <small><i class="bi bi-clock"></i> ${fecha} <i class="bi bi-geo-alt ms-2"></i> Visita #${notif.id_visita}</small>
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
        notifSocket.emit('mark_as_read', {
            notification_id: notifId
        });
    } else {
        $.post('/api/marcar-notificacion-leida/' + notifId, function(response) {
            if (response.success) {
                removeNotification(notifId);
            }
        });
    }
}

function removeNotification(notifId) {
    console.log('🗑️ Removiendo notificación:', notifId);
    
    // Remover del array
    var index = notifList.findIndex(function(n) {
        return n.id_notificacion === notifId;
    });
    
    if (index !== -1) {
        notifList.splice(index, 1);
        notifCount = Math.max(0, notifCount - 1);
    }
    
    // Remover del DOM
    $('[data-id="' + notifId + '"]').fadeOut(300, function() {
        $(this).remove();
        
        if (notifList.length === 0) {
            renderNotifications();
        }
    });
    
    // Actualizar badge
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
            notifSocket.emit('mark_as_read', {
                notification_id: notif.id_notificacion
            });
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
        
        console.log('🔊 Beep!');
    } catch(e) {
        console.log('⚠️ No se pudo reproducir sonido');
    }
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
        
        console.log('📱 Toast mostrado');
    }
}

// ===================================================================
// BOTONES
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
    
    $('#notificationBell').click(function() {
        loadNotifications();
    });
}

// ===================================================================
// FUNCIONES GLOBALES
// ===================================================================

window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.reloadNotifications = loadNotifications;

console.log('✅ Módulo de notificaciones cargado');