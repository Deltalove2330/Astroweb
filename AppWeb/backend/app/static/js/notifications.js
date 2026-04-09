    // ===================================================================
    // SISTEMA DE NOTIFICACIONES EN TIEMPO REAL
    // ===================================================================

    // Configuración global
    const NOTIFICATION_CONFIG = {
        pollInterval: 20000, // 10 segundos
        maxNotifications: 5,
        soundEnabled: true
    };

    // Estado global de notificaciones
    let notificationState = {
        lastCheck: null,
        unreadCount: 0,
        notifications: [],
        isDropdownOpen: false,
        pollTimer: null
    };

    // ===================================================================
    // INICIALIZACIÓN
    // ===================================================================

    $(document).ready(function() {
        initNotificationSystem();
    });

    function initNotificationSystem() {
        console.log('🔔 Iniciando sistema de notificaciones...');
        
        // Cargar notificaciones iniciales
        loadNotifications();
        
        // Iniciar polling automático
        startNotificationPolling();
        
        // Event listeners
        setupNotificationEvents();
        
        console.log('✅ Sistema de notificaciones iniciado');
    }

    // ===================================================================
    // CARGA DE NOTIFICACIONES
    // ===================================================================

    function loadNotifications(showLoading = false) {
        if (showLoading) {
            showNotificationLoading();
        }
        
        $.ajax({
            url: '/api/notificaciones-rechazo',
            method: 'GET',
            data: {
                leido: 0,  // Solo NO leídas
                limit: 5,   // Solo 5 últimas
                offset: 0
            },
            success: function(response) {
                if (response.success) {
                    console.log(`📬 Notificaciones recibidas: ${response.notificaciones.length}`);
                    
                    // Detectar nuevas notificaciones
                    const oldCount = notificationState.unreadCount;
                    const newCount = response.no_leidas || 0;
                    
                    notificationState.notifications = response.notificaciones;
                    notificationState.unreadCount = newCount;
                    
                    // Actualizar UI
                    updateNotificationBadge(newCount);
                    renderNotifications(response.notificaciones);
                    
                    // Si hay nuevas notificaciones, mostrar animación
                    if (newCount > oldCount && oldCount !== 0) {
                        showNewNotificationAlert(newCount - oldCount);
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error('❌ Error cargando notificaciones:', error);
                showNotificationError();
            }
        });
    }

    // ===================================================================
    // RENDERIZADO DE NOTIFICACIONES
    // ===================================================================

    function renderNotifications(notifications) {
        const $container = $('#notificationList');
        $container.empty();
        
        if (!notifications || notifications.length === 0) {
            $container.html(getEmptyNotificationHTML());
            return;
        }
        
        // Ordenar por fecha (más recientes primero)
        notifications.sort((a, b) => {
            return new Date(b.fecha_notificacion) - new Date(a.fecha_notificacion);
        });
        
        // Renderizar cada notificación
        notifications.forEach((notif, index) => {
            const html = createNotificationHTML(notif, index);
            $container.append(html);
        });
        
        // Animar entrada
        $('.notification-item').each(function(index) {
            $(this).css('animation-delay', `${index * 0.05}s`);
        });
    }



    function createNotificationHTML(notif, index) {
        const isUnread = notif.leido === 0;
        const readClass = isUnread ? 'unread' : 'read';
        const timeAgo = getTimeAgo(notif.fecha_notificacion);
        
        // Determinar tipo de foto
        let tipoFoto = 'Desconocido';
        let categoriaColor = '#6c757d';
        let categoriaIcon = 'bi-image';
        
        const descripcion = notif.descripcion || '';
        const textoCompleto = descripcion.toLowerCase();
        
        if (textoCompleto.includes('gestion') || textoCompleto.includes('antes') || textoCompleto.includes('después')) {
            tipoFoto = 'Gestión';
            categoriaColor = '#0d6efd';
            categoriaIcon = 'bi-arrow-left-right';
        } else if (textoCompleto.includes('precio')) {
            tipoFoto = 'Precio';
            categoriaColor = '#ffc107';
            categoriaIcon = 'bi-tag';
        } else if (textoCompleto.includes('exhib') || textoCompleto.includes('pop')) {
            tipoFoto = 'Exhibiciones';
            categoriaColor = '#17a2b8';
            categoriaIcon = 'bi-image';
        } else if (textoCompleto.includes('pdv')) {
            tipoFoto = 'PDV';
            categoriaColor = '#20c997';
            categoriaIcon = 'bi-shop';
        }
        
        return `
            <div class="notification-item ${readClass}" 
                data-notification-id="${notif.id_notificacion}"
                data-leido="${notif.leido}"
                onclick="handleNotificationClick(${notif.id_notificacion}, ${notif.id_visita})">
                
                <div class="notification-icon">
                    <i class="bi bi-x-circle-fill"></i>
                </div>
                
                <div class="notification-content">
                    <div class="notification-title">
                        <span class="badge bg-danger me-2">NUEVA</span>
                        Foto Rechazada
                    </div>
                    
                    <div class="notification-message">
                        <strong>${notif.punto_venta || 'Punto desconocido'}</strong>
                    </div>
                    
                    <div class="notification-details">
                        <span class="notification-detail-badge" style="background: ${categoriaColor}20; color: ${categoriaColor};">
                            <i class="${categoriaIcon}"></i> ${tipoFoto}
                        </span>
                        <span class="notification-detail-badge">
                            <i class="bi bi-building"></i> ${notif.nombre_cliente || 'Cliente'}
                        </span>
                        <span class="notification-detail-badge">
                            <i class="bi bi-hash"></i> Visita ${notif.id_visita}
                        </span>
                    </div>
                    
                    ${notif.descripcion ? `
                        <div class="notification-message mt-2" style="font-size: 0.85rem; color: #64748b;">
                            <i class="bi bi-chat-quote"></i> "${truncateText(notif.descripcion, 50)}"
                        </div>
                    ` : ''}
                    
                    <div class="notification-time">
                        <i class="bi bi-clock"></i> ${timeAgo}
                    </div>
                </div>
            </div>
        `;
    }

    // ===================================================================
    // ACTUALIZACIÓN DE BADGE
    // ===================================================================

    function updateNotificationBadge(count) {
        const $badge = $('#notificationCount');
        const $bell = $('#notificationBell');
        
        if (count > 0) {
            $badge.text(count > 99 ? '99+' : count);
            $badge.fadeIn(300);
            
            // Agregar clase para animación
            $badge.addClass('new-notification');
            setTimeout(() => {
                $badge.removeClass('new-notification');
            }, 600);
            
            // Animar campana
            $bell.find('i').addClass('animate');
            setTimeout(() => {
                $bell.find('i').removeClass('animate');
            }, 500);
        } else {
            $badge.fadeOut(300);
        }
    }

    // ===================================================================
    // MANEJO DE CLICKS
    // ===================================================================

    function handleNotificationClick(notificationId, visitaId) {
        console.log(`🖱️ Click en notificación #${notificationId}`);
        
        // Marcar como leída
    markNotificationAsReadAndRemove(notificationId);
        
        // Cerrar dropdown
        $('#notificationBell').dropdown('hide');
        
        // Mostrar información
        Swal.fire({
            title: 'Foto Rechazada',
            html: `
                <p><strong>ID Notificación:</strong> ${notificationId}</p>
                <p><strong>ID Visita:</strong> ${visitaId}</p>
                <p class="text-muted mb-0">La notificación ha sido marcada como leída</p>
            `,
            icon: 'info',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#667eea'
        });
    }

    function markNotificationAsRead(notificationId) {
        $.ajax({
            url: `/api/marcar-notificacion-leida/${notificationId}`,
            method: 'POST',
            success: function(response) {
                if (response.success) {
                    console.log(`✅ Notificación #${notificationId} marcada como leída`);
                    
                    // Actualizar UI
                    const $item = $(`.notification-item[data-notification-id="${notificationId}"]`);
                    $item.removeClass('unread').addClass('read');
                    
                    // Actualizar contador
                    notificationState.unreadCount--;
                    if (notificationState.unreadCount < 0) notificationState.unreadCount = 0;
                    updateNotificationBadge(notificationState.unreadCount);
                }
            },
            error: function(xhr, status, error) {
                console.error(`❌ Error marcando notificación como leída:`, error);
            }
        });
    }

    function markNotificationAsReadAndRemove(notificationId) {
        $.ajax({
            url: `/api/marcar-notificacion-leida/${notificationId}`,
            method: 'POST',
            success: function(response) {
                if (response.success) {
                    console.log(`✅ Notificación #${notificationId} marcada como leída`);
                    
                    // REMOVER del dropdown con animación
                    const $item = $(`.notification-item[data-notification-id="${notificationId}"]`);
                    $item.fadeOut(300, function() {
                        $(this).remove();
                        
                        // Actualizar contador
                        notificationState.unreadCount--;
                        if (notificationState.unreadCount < 0) notificationState.unreadCount = 0;
                        updateNotificationBadge(notificationState.unreadCount);
                        
                        // Si no quedan notificaciones, mostrar mensaje vacío
                        if ($('.notification-item').length === 0) {
                            $('#notificationList').html(getEmptyNotificationHTML());
                        }
                    });
                    
                    // Cerrar dropdown
                    $('#notificationBell').dropdown('hide');
                    
                    // Mostrar info
                    Swal.fire({
                        title: 'Notificación vista',
                        html: `<p><strong>Visita ID:</strong> ${notificationId}</p>`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            },
            error: function(xhr, status, error) {
                console.error(`❌ Error marcando notificación:`, error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo marcar como leída',
                    timer: 2000
                });
            }
        });
    }



    // ===================================================================
    // MARCAR TODAS COMO LEÍDAS
    // ===================================================================

    $('#markAllAsRead').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const unreadCount = notificationState.unreadCount;
        
        if (unreadCount === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin notificaciones',
                text: 'No hay notificaciones sin leer',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        
        Swal.fire({
            title: '¿Marcar todas como leídas?',
            html: `<p>Se marcarán <strong>${unreadCount}</strong> notificaciones</p>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="bi bi-check-all"></i> Sí, marcar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Mostrar loading
                Swal.fire({
                    title: 'Marcando...',
                    html: 'Espera un momento',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Obtener IDs
                const unreadIds = notificationState.notifications
                    .filter(n => n.leido === 0)
                    .map(n => n.id_notificacion);
                
                // Crear promesas
                const promises = unreadIds.map(id => {
                    return $.ajax({
                        url: `/api/marcar-notificacion-leida/${id}`,
                        method: 'POST'
                    });
                });
                
                // Ejecutar todas
                Promise.all(promises)
                    .then(() => {
                        // Limpiar dropdown
                        $('#notificationList').html(getEmptyNotificationHTML());
                        notificationState.unreadCount = 0;
                        notificationState.notifications = [];
                        updateNotificationBadge(0);
                        
                        Swal.fire({
                            icon: 'success',
                            title: '✅ Todas marcadas',
                            timer: 2000,
                            showConfirmButton: false
                        });
                        
                        // Recargar después de 1 segundo
                        setTimeout(() => {
                            loadNotifications();
                        }, 1000);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Algunas notificaciones no se pudieron marcar',
                            timer: 2500
                        });
                        loadNotifications();
                    });
            }
        });
    });




    function markAllNotificationsAsRead() {
        // Mostrar loading
        Swal.fire({
            title: 'Marcando notificaciones...',
            html: 'Por favor espera un momento',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Obtener IDs de todas las notificaciones no leídas
        const unreadIds = notificationState.notifications
            .filter(n => n.leido === 0)
            .map(n => n.id_notificacion);
        
        if (unreadIds.length === 0) {
            Swal.close();
            Swal.fire({
                icon: 'info',
                title: 'Sin notificaciones',
                text: 'No hay notificaciones sin leer',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
        
        // Marcar todas usando Promise.all para esperar a que todas terminen
        const promises = unreadIds.map(id => {
            return $.ajax({
                url: `/api/marcar-notificacion-leida/${id}`,
                method: 'POST'
            });
        });
        
        Promise.all(promises)
            .then(() => {
                // Todas marcadas correctamente
                notificationState.unreadCount = 0;
                updateNotificationBadge(0);
                loadNotifications();
                
                Swal.fire({
                    icon: 'success',
                    title: '✅ Todas marcadas',
                    text: 'Todas las notificaciones fueron marcadas como leídas',
                    timer: 2500,
                    showConfirmButton: false
                });
            })
            .catch((error) => {
                // Hubo algún error
                console.error('Error marcando notificaciones:', error);
                loadNotifications(); // Recargar para ver el estado real
                
                Swal.fire({
                    icon: 'warning',
                    title: 'Completado con errores',
                    text: 'Algunas notificaciones no se pudieron marcar',
                    timer: 2500,
                    showConfirmButton: false
                });
            });
    }

    // ===================================================================
    // POLLING AUTOMÁTICO
    // ===================================================================

    function startNotificationPolling() {
        // Limpiar timer anterior si existe
        if (notificationState.pollTimer) {
            clearInterval(notificationState.pollTimer);
        }
        
        // Iniciar nuevo polling
        notificationState.pollTimer = setInterval(() => {
            console.log('🔄 Actualizando notificaciones...');
            loadNotifications(false);
        }, NOTIFICATION_CONFIG.pollInterval);
        
        console.log(`⏱️ Polling iniciado: cada ${NOTIFICATION_CONFIG.pollInterval / 1000}s`);
    }

    function stopNotificationPolling() {
        if (notificationState.pollTimer) {
            clearInterval(notificationState.pollTimer);
            notificationState.pollTimer = null;
            console.log('⏹️ Polling detenido');
        }
    }

    // ===================================================================
    // EVENT LISTENERS
    // ===================================================================

    function setupNotificationEvents() {
        // Detectar cuando se abre el dropdown
        $('#notificationBell').on('show.bs.dropdown', function() {
            notificationState.isDropdownOpen = true;
            console.log('📂 Dropdown abierto');
        });
        
        // Detectar cuando se cierra el dropdown
        $('#notificationBell').on('hide.bs.dropdown', function() {
            notificationState.isDropdownOpen = false;
            console.log('📁 Dropdown cerrado');
        });
        
        // Evento "Ver todas"
        $('#viewAllNotifications').on('click', function(e) {
            e.preventDefault();
            window.location.href = '/notificaciones';
        });
        
        // Detener polling cuando el usuario abandona la página
        $(window).on('beforeunload', function() {
            stopNotificationPolling();
        });
        
        // Reanudar polling cuando el usuario vuelve a la pestaña
        $(document).on('visibilitychange', function() {
            if (document.hidden) {
                console.log('👁️ Página oculta - manteniendo polling');
            } else {
                console.log('👁️ Página visible - actualizando notificaciones');
                loadNotifications();
            }
        });
    }

    // ===================================================================
    // UTILIDADES
    // ===================================================================

    function getTimeAgo(dateString) {
        if (!dateString) return 'Hace un momento';
        
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'Hace un momento';
        if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} min`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} h`;
        if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
        
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }

    function formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    // ===================================================================
    // ESTADOS DE UI
    // ===================================================================

    function showNotificationLoading() {
        $('#notificationList').html(`
            <div class="notification-loading">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 mb-0">Cargando notificaciones...</p>
            </div>
        `);
    }

    function showNotificationError() {
        $('#notificationList').html(`
            <div class="notification-empty">
                <i class="bi bi-exclamation-triangle"></i>
                <p>Error al cargar notificaciones</p>
                <small>Intenta recargar la página</small>
            </div>
        `);
    }

    function getEmptyNotificationHTML() {
        return `
            <div class="notification-empty">
                <i class="bi bi-bell-slash"></i>
                <p>No hay notificaciones</p>
                <small>Te avisaremos cuando haya algo nuevo</small>
            </div>
        `;
    }

    // ===================================================================
    // ALERTAS Y SONIDOS
    // ===================================================================

    function showNewNotificationAlert(count) {
        // Reproducir sonido
        playNotificationSound();
        
        // Toast de nueva notificación
        const toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
        
        toast.fire({
            icon: 'info',
            title: `🔔 ${count} nueva${count > 1 ? 's' : ''} notificación${count > 1 ? 'es' : ''}`
        });
    }

    function playNotificationSound() {
        // Solo reproducir si está habilitado
        if (!NOTIFICATION_CONFIG.soundEnabled) {
            console.log('🔇 Sonido desactivado');
            return;
        }
        
        try {
            // Crear sonido de notificación usando Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Crear oscilador para el tono
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Configurar el sonido (tono de campana)
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Frecuencia alta
            oscillator.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1); // Descenso
            
            // Configurar volumen
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            // Reproducir
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
            
            console.log('🔔 Sonido de notificación reproducido');
        } catch (e) {
            console.log('⚠️ No se pudo reproducir el sonido:', e);
            
            // Fallback: Usar sonido HTML5 simple
            try {
                const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2i68+ifTBEM');
                audio.volume = 0.3;
                audio.play();
                console.log('🔔 Sonido fallback reproducido');
            } catch (e2) {
                console.log('⚠️ Tampoco funciona el fallback:', e2);
            }
        }
    }

    // ===================================================================
    // FUNCIONES GLOBALES PARA ACCESO EXTERNO
    // ===================================================================

    // Exponer funciones para uso en otros scripts
    window.NotificationSystem = {
        refresh: loadNotifications,
        markAsRead: markNotificationAsRead,
        markAllAsRead: markAllNotificationsAsRead,
        getUnreadCount: () => notificationState.unreadCount,
        getNotifications: () => notificationState.notifications,
        toggleSound: () => {
            NOTIFICATION_CONFIG.soundEnabled = !NOTIFICATION_CONFIG.soundEnabled;
            console.log(`🔔 Sonido ${NOTIFICATION_CONFIG.soundEnabled ? 'activado' : 'desactivado'}`);
            return NOTIFICATION_CONFIG.soundEnabled;
        }
    };

    console.log('🔔 Sistema de notificaciones cargado');