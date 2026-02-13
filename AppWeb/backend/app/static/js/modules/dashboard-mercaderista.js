//js/modules/dashboard-mercaderista.js

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-VE', {
        timeZone: 'America/Caracas',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Función para cargar información del mercaderista
function loadMerchandiserInfo() {
    const cedula       = sessionStorage.getItem('merchandiser_cedula');
    const nombre       = sessionStorage.getItem('merchandiser_name');
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');

    if (nombre) {
        $('#merchandiserName').text(nombre);
        $('#infoNombre').text(nombre);
    }

    if (cedula) {
        $('#infoCedula').text(cedula);
    }

    if (fechaIngreso) {
        $('#infoFechaIngreso').text(formatDate(fechaIngreso));
    }

    if (cedula) {
        loadPendingVisitsCount(cedula);
    }
}

// Función para cargar el conteo de visitas pendientes
function loadPendingVisitsCount(cedula) {
    $.getJSON('/api/merchandiser-pending-visits/' + cedula)
        .done(function(visits) {
            const count = Array.isArray(visits) ? visits.length : 0;
            $('#infoVisitasPendientes').text(count);
        })
        .fail(function() {
            $('#infoVisitasPendientes').text('Error al cargar');
        });
}

function seleccionarOpcion(tipo) {
    switch (tipo) {
        case 'fotos':
            window.location.href = '/carga-fotos-mercaderista';
            break;
        case 'data':
            window.location.href = '/carga-mercaderista';
            break;
        default:
            console.warn('Tipo de opción no reconocido:', tipo);
    }
}

// Función para cerrar sesión
function logout() {
    if (typeof logoutMercaderista === 'function') {
        logoutMercaderista();
    } else {
        if (confirm('¿Estás seguro de que deseas salir del sistema?')) {
            sessionStorage.clear();
            window.location.href = '/login-mercaderista';
        }
    }
}

// ── Inicialización cuando el DOM está listo ────────────────────────────────
$(document).ready(function() {

    // Verificar sesión del mercaderista
    if (!checkMercaderistaSession()) {
        return;
    }

    // Cargar información del mercaderista
    loadMerchandiserInfo();

    // Efecto de click en tarjetas
    $('.option-card').on('click', function() {
        $(this).addClass('active');
        setTimeout(() => { $(this).removeClass('active'); }, 200);
    });

    // Accesibilidad teclado
    $('.option-card').on('keypress', function(e) {
        if (e.which === 13 || e.which === 32) {
            $(this).click();
        }
    });

    $('.option-card').attr('tabindex', '0');

    // ── Chat: inicializar ──────────────────────────────────────────────────
    initChatAnalistas();

    // Enviar mensaje con Enter
    $(document).on('keypress', '#chatMessageInput', function(e) {
        if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            enviarMensajeChat();
        }
    });

    // Botón enviar
    $(document).on('click', '#btnSendMessage', function() {
        enviarMensajeChat();
    });

    // Filtros en tiempo real
    $(document).on('input change', '#filterFecha, #filterCliente, #filterPuntoVenta', function() {
        filtrarChats();
    });

});

// Manejar la tecla Escape para logout
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        logout();
    }
});

// ============================================================================
// 💬 SISTEMA DE CHAT CON ANALISTAS - MERCADERISTA
// Variables con prefijo merc_ para no colisionar con chat.js
// ============================================================================

let mercChatSocket   = null;
let mercChatVisitId  = null;
let mercAllChatsData = [];

// ── Inicializar y verificar mensajes nuevos ────────────────────────────────
function initChatAnalistas() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) return;

    // Obtener y cachear id_usuario para el socket
    if (!sessionStorage.getItem('merchandiser_userid')) {
        $.getJSON('/api/merchandiser-userid/' + cedula)
            .done(function(data) {
                if (data.success) {
                    sessionStorage.setItem('merchandiser_userid', data.id_usuario);
                }
            });
    }

    checkUnreadMessages(cedula);
    setInterval(() => checkUnreadMessages(cedula), 30000);
}

// ── Verificar mensajes no leídos ──────────────────────────────────────────
function checkUnreadMessages(cedula) {
    $.getJSON('/api/merchandiser-unread-count/' + cedula)
        .done(function(data) {
            const count  = parseInt(data.unread_count || 0);
            const $btn   = $('#btnChatAnalistas');
            const $badge = $('#chatNotificationBadge');

            if (count > 0) {
                $btn.removeClass('btn-outline-primary btn-primary')
                    .addClass('btn-success')
                    .html('<i class="bi bi-envelope me-1"></i>' + count +
                          ' nuevo' + (count > 1 ? 's' : ''));
                $badge.text(count).show();
            } else {
                $btn.removeClass('btn-success')
                    .addClass('btn-outline-primary')
                    .html('<i class="bi bi-envelope-open me-1"></i>Abrir Chats');
                $badge.hide();
            }
        });
    // fallo silencioso, no interrumpe el dashboard
}

// ── Abrir modal lista de chats ─────────────────────────────────────────────
function abrirChatsAnalistas() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) return;

    $('#filterFecha').val('');
    $('#filterCliente').val('');
    $('#filterPuntoVenta').val('');
    $('#chatsListModal').modal('show');
    cargarListaChats(cedula);
}

// ── Cargar lista desde backend ─────────────────────────────────────────────
function cargarListaChats(cedula) {
    $('#chatsListContainer').html(
        '<div class="text-center py-5">' +
        '<div class="spinner-border text-primary"></div>' +
        '<p class="mt-2">Cargando chats...</p></div>'
    );

    $.getJSON('/api/merchandiser-chats/' + cedula)
        .done(function(data) {
            if (!data.success) {
                mercMostrarError('No se pudieron cargar los chats');
                return;
            }
            mercAllChatsData = data.chats || [];
            mercRenderLista(mercAllChatsData);
        })
        .fail(function() {
            mercMostrarError('Error al conectar con el servidor');
        });
}

// ── Renderizar lista ───────────────────────────────────────────────────────
function mercRenderLista(chats) {
    if (!chats || chats.length === 0) {
        $('#chatsListContainer').html(
            '<div class="text-center py-5 text-muted">' +
            '<i class="bi bi-chat-square fs-1"></i>' +
            '<p class="mt-3">No tienes chats aún.<br>' +
            '<small>Los chats aparecen cuando tienes visitas con fotos.</small>' +
            '</p></div>'
        );
        return;
    }

    let html = '<div class="list-group">';
    chats.forEach(function(chat) {
        const nuevos    = chat.mensajes_no_leidos > 0;
        const fecha     = chat.fecha_visita
            ? new Date(chat.fecha_visita).toLocaleDateString('es-VE',
                { day: '2-digit', month: '2-digit', year: 'numeric' })
            : 'Sin fecha';
        const ultimoMsg = chat.ultimo_mensaje
            ? (chat.ultimo_mensaje.length > 60
                ? chat.ultimo_mensaje.substring(0, 60) + '...'
                : chat.ultimo_mensaje)
            : 'Sin mensajes aún';

        html +=
            '<div class="list-group-item list-group-item-action py-3 ' +
                (nuevos ? 'border-start border-success border-3' : '') + '" ' +
                'style="cursor:pointer;" ' +
                'onclick="mercAbrirChat(' + chat.id_visita + ',' +
                    '\'' + mercEscape(chat.cliente) + '\',' +
                    '\'' + mercEscape(chat.punto_venta) + '\')">' +

                '<div class="d-flex justify-content-between align-items-start">' +
                    '<div class="flex-grow-1">' +
                        '<div class="d-flex align-items-center gap-2 mb-1">' +
                            '<strong>' +
                                '<i class="bi bi-building me-1 text-primary"></i>' +
                                mercEscape(chat.cliente) +
                            '</strong>' +
                            (nuevos
                                ? '<span class="badge bg-success rounded-pill">' +
                                  chat.mensajes_no_leidos +
                                  ' nuevo' + (chat.mensajes_no_leidos > 1 ? 's' : '') +
                                  '</span>'
                                : '') +
                        '</div>' +
                        '<div class="text-muted small mb-1">' +
                            '<i class="bi bi-geo-alt me-1"></i>' +
                            mercEscape(chat.punto_venta) +
                        '</div>' +
                        '<div class="text-muted small text-truncate">' +
                            '<i class="bi bi-chat-left me-1"></i>' +
                            mercEscape(ultimoMsg) +
                        '</div>' +
                    '</div>' +
                    '<div class="text-end ms-3 flex-shrink-0">' +
                        '<div class="small text-muted">' +
                            '<i class="bi bi-calendar2 me-1"></i>' + fecha +
                        '</div>' +
                        '<div class="mt-1">' +
                            '<span class="badge ' +
                                (chat.estado === 'Revisado'
                                    ? 'bg-success'
                                    : 'bg-warning text-dark') +
                            '">' + (chat.estado || 'Pendiente') + '</span>' +
                        '</div>' +
                        '<div class="small text-muted mt-1">' +
                            '<i class="bi bi-chat-dots me-1"></i>' +
                            chat.total_mensajes + ' msg' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    });
    html += '</div>';
    $('#chatsListContainer').html(html);
}

// ── Filtrar chats en tiempo real ───────────────────────────────────────────
function filtrarChats() {
    const fecha   = $('#filterFecha').val();
    const cliente = $('#filterCliente').val().toLowerCase().trim();
    const punto   = $('#filterPuntoVenta').val().toLowerCase().trim();

    const filtrados = mercAllChatsData.filter(function(chat) {
        if (fecha   && (chat.fecha_visita || '').substring(0, 10) !== fecha) return false;
        if (cliente && !chat.cliente.toLowerCase().includes(cliente))         return false;
        if (punto   && !chat.punto_venta.toLowerCase().includes(punto))       return false;
        return true;
    });
    mercRenderLista(filtrados);
}

// ── Abrir chat individual ──────────────────────────────────────────────────
function mercAbrirChat(visitId, clienteNombre, puntoVenta) {
    mercChatVisitId = visitId;

    $('#chatIndividualTitle').html(
        '<i class="bi bi-chat-left-text me-2"></i>' +
        mercEscape(clienteNombre) + ' - ' + mercEscape(puntoVenta)
    );

    $('#chatMessagesContainer').html(
        '<div class="text-center text-muted py-4">' +
        '<div class="spinner-border text-primary"></div>' +
        '<p class="mt-2">Cargando mensajes...</p></div>'
    );
    $('#chatMessageInput').val('');

    $('#chatsListModal').modal('hide');
    setTimeout(function() {
        $('#chatIndividualModal').modal('show');
        mercConectarSocket(visitId);
    }, 350);
}

// ── WebSocket ──────────────────────────────────────────────────────────────
function mercConectarSocket(visitId) {
    if (mercChatSocket) {
        try { mercChatSocket.disconnect(); } catch(e) {}
        mercChatSocket = null;
    }

    mercChatSocket = io('/chat', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
    });

    mercChatSocket.on('connect', function() {
        mercChatSocket.emit('join_chat', { visit_id: visitId });
    });

    // socket_chat.py emite con key 'mensajes'
    mercChatSocket.on('chat_history', function(data) {
    const msgs = data.mensajes || data.messages || [];
    mercRenderHistorial(msgs);

    // Marcar todos los mensajes de esta visita como leídos
    msgs.forEach(function(msg) {
        if (msg.id_mensaje && msg.tipo_mensaje !== 'sistema') {
            mercChatSocket.emit('mark_message_read', {
                message_id: msg.id_mensaje,
                visit_id: mercChatVisitId
            });
        }
    });

    // Actualizar badge después de marcar como leídos
    setTimeout(function() {
        const ced = sessionStorage.getItem('merchandiser_cedula');
        if (ced) checkUnreadMessages(ced);
    }, 1000);
});

    mercChatSocket.on('new_message', function(msg) {
        if (parseInt(msg.id_visita) === parseInt(mercChatVisitId)) {
            mercAppendMensaje(msg);
            mercScrollAbajo();
            if (msg.id_mensaje) {
                mercChatSocket.emit('mark_message_read', {
                    id_mensaje: msg.id_mensaje,
                    visit_id: mercChatVisitId
                });
                // Actualizar badge
                setTimeout(function() {
                    const ced = sessionStorage.getItem('merchandiser_cedula');
                    if (ced) checkUnreadMessages(ced);
                }, 500);
            }
        }
    });

    mercChatSocket.on('chat_error', function(data) {
        console.error('❌ chat_error:', data.error);
    });
}

// ── Renderizar historial ───────────────────────────────────────────────────
function mercRenderHistorial(messages) {
    if (!messages || messages.length === 0) {
        $('#chatMessagesContainer').html(
            '<div class="text-center text-muted py-4">' +
            '<i class="bi bi-chat-square-dots fs-1"></i>' +
            '<p class="mt-2">No hay mensajes aún.<br>' +
            '<small>Puedes escribir un mensaje al analista.</small></p></div>'
        );
        return;
    }
    $('#chatMessagesContainer').empty();
    messages.forEach(function(msg) { mercAppendMensaje(msg); });
    mercScrollAbajo();
}

// ── Agregar mensaje al chat ────────────────────────────────────────────────
function mercAppendMensaje(msg) {
    const nombre = sessionStorage.getItem('merchandiser_name') || '';
    const cedula = sessionStorage.getItem('merchandiser_cedula') || '';

    // Es mío si el username guardado en BD coincide con mi cédula
    // (enviarMensajeChat envía la cédula como username)
    const esMio       = (msg.username === cedula) || (msg.username === nombre);
    const displayName = esMio ? (nombre || cedula) : (msg.username || 'Analista');
    const hora        = mercFormatHora(msg.fecha_envio);

    let html = '';

    if (msg.tipo_mensaje === 'sistema') {
        // ── Mensaje automático del sistema ──────────────────────────────
        html =
            '<div class="d-flex justify-content-center mb-3" data-id="' + msg.id_mensaje + '">' +
                '<div class="px-3 py-2 rounded text-center" ' +
                     'style="background:#fff3cd;border-left:4px solid #ffc107;max-width:80%;">' +
                    '<small class="d-block mb-1 text-warning fw-bold">' +
                        '<i class="bi bi-exclamation-triangle me-1"></i>Sistema' +
                    '</small>' +
                    '<span style="white-space:pre-line;font-size:0.88rem;">' +
                        mercEscape(msg.mensaje) +
                    '</span>' +
                    '<small class="d-block mt-1 text-muted">' + hora + '</small>' +
                '</div>' +
            '</div>';

    } else if (esMio) {
        // ── Mis mensajes (mercaderista) ──────────────────────────────────
        html =
            '<div class="d-flex justify-content-end mb-3" data-id="' + msg.id_mensaje + '">' +
                '<div class="px-3 py-2 rounded" ' +
                     'style="max-width:70%;background:linear-gradient(135deg,#667eea,#764ba2);' +
                            'color:#fff;border-bottom-right-radius:4px;">' +
                    '<small class="d-block fw-bold mb-1 opacity-75">' +
                        '<i class="bi bi-person-fill me-1"></i>' +
                        mercEscape(displayName) +
                    '</small>' +
                    '<span style="white-space:pre-line;">' +
                        mercEscape(msg.mensaje) +
                    '</span>' +
                    '<small class="d-block mt-1 opacity-75 text-end">' + hora + '</small>' +
                '</div>' +
            '</div>';

    } else {
        // ── Mensajes del analista/admin ──────────────────────────────────
        html =
            '<div class="d-flex justify-content-start mb-3" data-id="' + msg.id_mensaje + '">' +
                '<div class="px-3 py-2 rounded" ' +
                     'style="max-width:70%;background:#fff;border:1px solid #e2e8f0;' +
                            'border-bottom-left-radius:4px;">' +
                    '<small class="d-block fw-bold mb-1 text-primary">' +
                        '<i class="bi bi-person-badge me-1"></i>' +
                        mercEscape(displayName) +
                    '</small>' +
                    '<span style="white-space:pre-line;">' +
                        mercEscape(msg.mensaje) +
                    '</span>' +
                    '<small class="d-block mt-1 text-muted">' + hora + '</small>' +
                '</div>' +
            '</div>';
    }

    const $c = $('#chatMessagesContainer');
    // Si solo hay el placeholder vacío, limpiarlo
    if ($c.find('.spinner-border').length || $c.find('.bi-chat-square-dots').length) {
        $c.empty();
    }
    $c.append(html);
}

// ── Enviar mensaje ─────────────────────────────────────────────────────────
function enviarMensajeChat() {
    if (!mercChatSocket || !mercChatVisitId) return;

    const mensaje = $('#chatMessageInput').val().trim();
    if (!mensaje) return;

    const cedula     = sessionStorage.getItem('merchandiser_cedula');
    const idUsuario  = sessionStorage.getItem('merchandiser_userid');

    if (!idUsuario) {
        // id_usuario aún no cargado, obtenerlo ahora y reintentar
        $.getJSON('/api/merchandiser-userid/' + cedula)
            .done(function(data) {
                if (data.success) {
                    sessionStorage.setItem('merchandiser_userid', data.id_usuario);
                    enviarMensajeChat(); // reintentar
                }
            });
        return;
    }

    mercChatSocket.emit('send_message', {
    visit_id: mercChatVisitId,
    username: cedula,
    mensaje:  mensaje
});

$('#chatMessageInput').val('');

// Al enviar un mensaje, los "nuevos" de esa visita quedan leídos
// Actualizar badge inmediatamente
setTimeout(function() {
    const ced = sessionStorage.getItem('merchandiser_cedula');
    if (ced) checkUnreadMessages(ced);
}, 800);
}
// ── Helpers ────────────────────────────────────────────────────────────────
function mercScrollAbajo() {
    const $c = $('#chatMessagesContainer');
    if ($c.length) $c.scrollTop($c[0].scrollHeight);
}

function mercFormatHora(fechaStr) {
    if (!fechaStr) return '';
    const f       = new Date(fechaStr);
    const ahora   = new Date();
    const diffMin = Math.floor((ahora - f) / 60000);
    if (diffMin < 1)  return 'Ahora';
    if (diffMin < 60) return 'Hace ' + diffMin + ' min';
    return f.toLocaleDateString('es-VE', {
        day: '2-digit', month: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
}

function mercEscape(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#39;');
}

function mercMostrarError(msg) {
    $('#chatsListContainer').html(
        '<div class="alert alert-danger text-center">' +
        '<i class="bi bi-exclamation-triangle me-2"></i>' + msg + '</div>'
    );
}

// ── Cerrar modal chat → volver a lista ────────────────────────────────────
$(document).on('hidden.bs.modal', '#chatIndividualModal', function() {
    if (mercChatSocket) {
        try {
            mercChatSocket.emit('leave_chat', { visit_id: mercChatVisitId });
            mercChatSocket.disconnect();
        } catch(e) {}
        mercChatSocket = null;
    }
    mercChatVisitId = null;

    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (cedula) checkUnreadMessages(cedula);

    setTimeout(function() {
        const cedula2 = sessionStorage.getItem('merchandiser_cedula');
        if (cedula2) cargarListaChats(cedula2);
        $('#chatsListModal').modal('show');
    }, 350);
});

// ============================================================================
// 🔌 PLACEHOLDER NOTIFICACIONES EXTERNAS (Telegram / Correo)
// ============================================================================
// TODO: cuando llegue un mensaje nuevo al mercaderista, disparar notificación
// function mercNotificarExterno(visitId, mensaje, cedula) {
//     fetch('/api/notify-mercaderista', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ visit_id: visitId, mensaje, cedula })
//     });
// }
// ============================================================================