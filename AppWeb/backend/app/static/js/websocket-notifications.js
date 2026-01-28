// ===================================================================
// WEBSOCKET NOTIFICATIONS - VERSIÓN FINAL CORREGIDA
// ===================================================================

console.log('🔧 Cargando módulo de notificaciones...');

var notifSocket = null;
var notifList = [];
var notifCount = 0;
var isLoading = false;
var lastLoadTime = 0;
var isInitialized = false;
var LOAD_COOLDOWN = 2000;
var currentUserRole = null;

// ✅ GUARDAR id_cliente globalmente
window.currentUserClientId = null;

// ===================================================================
// INICIALIZAR AL CARGAR PÁGINA
// ===================================================================

$(document).ready(function() {
    if (isInitialized) {
        console.log('⚠️ Ya inicializado, ignorando...');
        return;
    }
    isInitialized = true;
    
    console.log('🚀 Inicializando sistema de notificaciones...');
    
    // ✅ PRIMERO: Obtener rol Y cliente_id del usuario
    $.getJSON('/api/current-user')
        .done(function(user) {
            console.log('👤 Usuario actual:', user.username);
            console.log('🎭 Rol:', user.rol);
            console.log('🏢 Cliente ID:', user.cliente_id || 'N/A');
            
            // ✅ GUARDAR GLOBALMENTE
            currentUserRole = user.rol;
            window.currentUserClientId = user.cliente_id || null;
            
            if (user.rol === 'client') {
                console.log('📋 MODO CLIENTE: Solo verás rechazos de tu cliente específico');
                $('#viewAllNotifications').attr('href', '/notificaciones');
            } else if (user.rol === 'analyst') {
                console.log('📋 MODO ANALISTA: Verás todos los rechazos');
                $('#viewAllNotifications').attr('href', '/notificaciones-admin');
            } else if (user.rol === 'admin') {
                console.log('📋 MODO ADMIN: Verás todos los rechazos');
                $('#viewAllNotifications').attr('href', '/notificaciones-admin');
            } else if (user.rol === 'supervisor') {
                // ✅ NUEVO: Caso para supervisor
                console.log('📋 MODO SUPERVISOR: Verás todos los rechazos');
                $('#viewAllNotifications').attr('href', '/supervisor/notificaciones');
            }
            
            // ✅ DESPUÉS: Iniciar WebSocket
            initWebSocket();
            setupButtons();
        })
        .fail(function() {
            console.error('❌ Error obteniendo usuario actual');
            initWebSocket();
            setupButtons();
        });
});

// ===================================================================
// CONECTAR WEBSOCKET
// ===================================================================

function initWebSocket() {
    if (notifSocket && notifSocket.connected) {
        console.log('⚠️ Socket ya conectado, ignorando...');
        return;
    }
    
    console.log('🔌 Conectando a Socket.IO...');
    
    if (typeof io === 'undefined') {
        console.error('❌ Socket.IO no está cargado! Usando HTTP...');
        loadNotificationsHTTP();
        return;
    }
    
    if (notifSocket) {
        notifSocket.removeAllListeners();
        notifSocket.disconnect();
    }
    
    notifSocket = io('/', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
        forceNew: false
    });
    
    notifSocket.on('connect', function() {
        console.log('✅ WEBSOCKET CONECTADO - SID:', notifSocket.id);
        
        var now = Date.now();
        if (now - lastLoadTime > LOAD_COOLDOWN) {
            loadNotifications();
        }
    });
    
    notifSocket.on('disconnect', function(reason) {
        console.log('❌ WebSocket desconectado:', reason);
        if (reason === 'io server disconnect' || reason === 'transport close') {
            console.log('⚠️ WebSocket rechazado, cambiando a HTTP');
            loadNotificationsHTTP();
        }
    });
    
    notifSocket.on('connect_error', function(error) {
        console.error('❌ Error de conexión WebSocket:', error);
        console.log('⚠️ Usando HTTP como fallback');
        loadNotificationsHTTP();
    });
    
    // ✅ EVENTO CRÍTICO: NUEVA NOTIFICACIÓN EN TIEMPO REAL
    notifSocket.on('new_notification', function(data) {
        console.log('🔔 ¡NUEVA NOTIFICACIÓN RECIBIDA EN TIEMPO REAL!', data);
        
        if (data && data.notification) {
            var notif = data.notification;
            
            console.log('📋 Datos de notificación:');
            console.log('   - ID:', notif.id_notificacion);
            console.log('   - Rechazado por:', notif.rechazado_por);
            console.log('   - ID Cliente:', notif.id_cliente);
            console.log('   - Nombre Cliente:', notif.nombre_cliente);
            
            var shouldShow = false;
            
            if (currentUserRole === 'client') {
                // ✅ Clientes: SOLO ven rechazos de clientes Y de su mismo id_cliente
                console.log('🔍 Modo Cliente - Verificando filtros...');
                console.log('   - Rechazado por:', notif.rechazado_por);
                console.log('   - ID Cliente notif:', notif.id_cliente);
                console.log('   - ID Cliente usuario:', window.currentUserClientId);
                
                if (notif.rechazado_por === 'cliente') {
                    if (window.currentUserClientId && 
                        notif.id_cliente && 
                        parseInt(notif.id_cliente) === parseInt(window.currentUserClientId)) {
                        shouldShow = true;
                        console.log('✅ MOSTRAR - Es del mismo cliente');
                    } else {
                        console.log('❌ OCULTAR - Cliente diferente');
                    }
                } else {
                    console.log('❌ OCULTAR - Rechazado por:', notif.rechazado_por);
                }
                
            } else if (currentUserRole === 'analyst' || currentUserRole === 'admin' || currentUserRole === 'supervisor') {
                // ✅ Analistas/Admins/Supervisores: VEN TODO
                shouldShow = true;
                console.log('✅ MOSTRAR - Analista/Admin/Supervisor ve todas');
                
            } else {
                console.warn('⚠️ Rol desconocido:', currentUserRole);
            }
            
            if (shouldShow) {
                console.log('➕ Agregando notificación...');
                addNotification(notif);
                console.log('✅ Notificación agregada');
            } else {
                console.log('⛔ Notificación filtrada');
            }
        }
    });
    
    notifSocket.on('notifications_update', function(data) {
        console.log('📬 Actualización recibida:', data);
        
        isLoading = false;
        
        if (data && !data.success && data.error && data.error.includes('autenticado')) {
            console.log('⚠️ WebSocket sin autenticación, usando HTTP');
            loadNotificationsHTTP();
            return;
        }
        
        if (data && data.notificaciones) {
            notifList = data.notificaciones;
            notifCount = data.no_leidas || 0;
            renderNotifications();
        }
    });
    
    notifSocket.on('mark_read_response', function(data) {
        console.log('✅ Respuesta marcar leída:', data);
        
        if (data && data.success) {
            notifCount = data.no_leidas || 0;
            updateBadge();
        }
    });
    
    setTimeout(function() {
        if (!notifSocket || !notifSocket.connected) {
            console.log('⏰ Timeout WebSocket, usando HTTP');
            loadNotificationsHTTP();
        }
    }, 3000);
    
    console.log('✅ Listeners WebSocket registrados');
}

// ===================================================================
// CARGAR NOTIFICACIONES
// ===================================================================

function loadNotifications() {
    var now = Date.now();
    
    if (now - lastLoadTime < LOAD_COOLDOWN) {
        console.log('⏳ Cooldown activo');
        return;
    }
    
    if (isLoading) {
        console.log('⏳ Ya cargando...');
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
        
        setTimeout(function() {
            if (isLoading) {
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
    
    var exists = notifList.some(function(n) {
        return n.id_notificacion === notification.id_notificacion;
    });
    
    if (exists) {
        console.log('⚠️ Notificación ya existe');
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
    
    updateBadge();
    
    if (notifList.length === 0) {
        $list.html('<div class="notification-empty"><i class="bi bi-bell-slash"></i><p>No hay notificaciones</p></div>');
        return;
    }
    
    $list.empty();
    
    notifList.forEach(function(notif) {
        $list.append(createNotificationHTML(notif));
    });
}

function updateBadge() {
    var $badge = $('#notificationCount');
    
    if (notifCount > 0) {
        $badge.text(notifCount).show();
    } else {
        $badge.hide();
    }
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
        'Exhibiciones': '🖼️'
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
    
    updateBadge();
}

// ===================================================================
// MARCAR TODAS
// ===================================================================

function markAllAsRead() {
    console.log('✅ Marcando todas...');
    
    $.ajax({
        url: '/api/marcar-todas-leidas',
        method: 'POST',
        success: function(response) {
            if (response.success) {
                notifList = [];
                notifCount = 0;
                renderNotifications();
                
                if (typeof Swal !== 'undefined') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Todas marcadas',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            }
        },
        error: function() {
            console.error('Error marcando todas');
        }
    });
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
            html: '<strong>' + (notif.nombre_cliente || 'Cliente') + '</strong><br>' + (notif.punto_venta || 'Punto'),
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true
        });
    }
}

// ===================================================================
// BOTONES
// ===================================================================

function setupButtons() {
    $('#markAllAsRead').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('🔘 Marcar todas');
        markAllAsRead();
    });
    
    console.log('✅ Botones configurados');
}

// ===================================================================
// FUNCIONES GLOBALES
// ===================================================================

window.markAsRead = markAsRead;
window.markAllAsRead = markAllAsRead;
window.reloadNotifications = function() {
    lastLoadTime = 0;
    loadNotifications();
};

<<<<<<< HEAD
console.log('✅ Módulo de notificaciones cargado');
=======
console.log('✅ Módulo de notificaciones cargado');

window.socket = notifSocket;
>>>>>>> dev
