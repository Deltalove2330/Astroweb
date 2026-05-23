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
        const esChatNuevo = chat.total_mensajes === 0;
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
                (nuevos ? 'border-start border-success border-3' : esChatNuevo ? 'border-start border-info border-3' : '') + '" ' +
                'style="cursor:pointer;" ' +
                'onclick="mercAbrirChat(' + chat.id_visita + ',' +
                    '\'' + mercEscape(chat.cliente) + '\',' +
                    '\'' + mercEscape(chat.punto_venta) + '\')">' +

                '<div class="d-flex justify-content-between align-items-start flex-wrap gap-2">' +
                    '<div class="flex-grow-1" style="min-width: 0;">' +
                        '<div class="d-flex align-items-center gap-2 mb-1 flex-wrap">' +
                            '<strong class="text-truncate">' +
                                '<i class="bi bi-building me-1 text-primary"></i>' +
                                mercEscape(chat.cliente) +
                            '</strong>' +
                            (nuevos
                                ? '<span class="badge bg-success rounded-pill flex-shrink-0">' +
                                  chat.mensajes_no_leidos +
                                  ' nuevo' + (chat.mensajes_no_leidos > 1 ? 's' : '') +
                                  '</span>'
                                : esChatNuevo
                                    ? '<span class="badge bg-info rounded-pill flex-shrink-0">Chat Nuevo</span>'
                                    : '') +
                        '</div>' +
                        '<div class="text-muted small mb-1 text-truncate">' +
                            '<i class="bi bi-geo-alt me-1"></i>' +
                            mercEscape(chat.punto_venta) +
                        '</div>' +
                        '<div class="text-muted small text-truncate">' +
                            '<i class="bi bi-chat-left me-1"></i>' +
                            mercEscape(ultimoMsg) +
                        '</div>' +
                    '</div>' +
                    '<div class="text-end flex-shrink-0">' +
                        '<div class="small text-muted text-nowrap">' +
                            '<i class="bi bi-calendar2 me-1"></i>' + fecha +
                        '</div>' +
                        '<div class="mt-1">' +
                            '<span class="badge ' +
                                (chat.estado === 'Revisado'
                                    ? 'bg-success'
                                    : 'bg-warning text-dark') +
                            '">' + (chat.estado || 'Pendiente') + '</span>' +
                        '</div>' +
                        '<div class="small text-muted mt-1 text-nowrap">' +
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

    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (cedula) {
        $.ajax({
            url: '/api/mark-messages-read',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ id_visita: visitId, cedula: cedula }),
            success: function() {
                // Badge se actualiza cuando se cierra el modal
            }
        });
    }

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
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    msgs.forEach(function(msg) {
        if (msg.id_mensaje && msg.tipo_mensaje !== 'sistema') {
            mercChatSocket.emit('mark_message_read', {
                id_mensaje:  msg.id_mensaje,
                visit_id:    mercChatVisitId,
                username:    cedula
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
                const ced = sessionStorage.getItem('merchandiser_cedula');
                mercChatSocket.emit('mark_message_read', {
                    id_mensaje: msg.id_mensaje,
                    visit_id:   mercChatVisitId,
                    username:   ced
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
        // Intentar extraer id_foto del metadata o del texto del mensaje
        let idFotoSistema = null;
        if (msg.metadata) {
            try {
                const meta = typeof msg.metadata === 'string' ? JSON.parse(msg.metadata) : msg.metadata;
                if (meta && meta.id_foto) idFotoSistema = meta.id_foto;
            } catch(e) {}
        }
        // Fallback: extraer del texto "ID Foto: 330"
        if (!idFotoSistema) {
            const match = msg.mensaje.match(/ID Foto:\s*(\d+)/);
            if (match) idFotoSistema = parseInt(match[1]);
        }

        const clickAttr = idFotoSistema
            ? `style="background:#fff3cd;border-left:4px solid #ffc107;max-width:80%;cursor:pointer;" onclick="mercAbrirModalReemplazo(${idFotoSistema})"`
            : `style="background:#fff3cd;border-left:4px solid #ffc107;max-width:80%;"`;

        const clickHint = idFotoSistema
            ? '<small class="d-block mt-2 text-primary"><i class="bi bi-camera me-1"></i><u>Toca aquí para reemplazar la foto</u></small>'
            : '';

        // ✅ IMAGEN DE LA FOTO RECHAZADA
        let mercImgHtml = '';
        if (msg.metadata) {
            try {
                const meta = typeof msg.metadata === 'string'
                    ? JSON.parse(msg.metadata)
                    : msg.metadata;
                if (meta && meta.file_path && meta.file_path.length > 5) {
                    const imgUrl = '/api/image/' + encodeURIComponent(meta.file_path);
                    mercImgHtml =
                        '<div style="margin:0.75rem 0;">' +
                            '<img src="' + imgUrl + '" ' +
                                'alt="Foto rechazada" ' +
                                'style="max-width:100%;max-height:200px;border-radius:8px;' +
                                       'border:2px solid #ffc107;display:block;margin:0 auto;' +
                                       'object-fit:cover;cursor:pointer;" ' +
                                'onclick="mercAbrirLightbox(\'' + imgUrl + '\')" ' +
                                'onerror="this.style.display=\'none\'" ' +
                                'loading="lazy" />' +
                            '<small style="display:block;text-align:center;margin-top:0.3rem;' +
                                          'color:#856404;font-size:0.75rem;">' +
                                '<i class="bi bi-zoom-in"></i> Toca para ver en grande' +
                            '</small>' +
                        '</div>';
                }
            } catch(e) {}
        }

        html =
            '<div class="d-flex justify-content-center mb-3" data-id="' + msg.id_mensaje + '">' +
                '<div class="px-3 py-2 rounded text-center" ' + clickAttr + '>' +
                    '<small class="d-block mb-1 text-warning fw-bold">' +
                        '<i class="bi bi-exclamation-triangle me-1"></i>Sistema' +
                    '</small>' +
                    '<span style="white-space:pre-line;font-size:0.88rem;">' +
                        mercEscape(msg.mensaje) +
                    '</span>' +
                    mercImgHtml +
                    clickHint +
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
    // Actualizar badge después de un pequeño delay para que el HTTP ya haya procesado
    if (cedula) {
        setTimeout(function() { checkUnreadMessages(cedula); }, 300);
        setTimeout(function() { checkUnreadMessages(cedula); }, 1500);
    }

    setTimeout(function() {
        const cedula2 = sessionStorage.getItem('merchandiser_cedula');
        if (cedula2) cargarListaChats(cedula2);
        $('#chatsListModal').modal('show');
    }, 350);
});

// ============================================================================
// 💬 SISTEMA DE CHAT CON CLIENTES - MERCADERISTA
// ============================================================================

let mercChatSocketClientes = null;
let mercChatVisitIdClientes = null;
let mercChatClienteId = null;
let mercAllChatsDataClientes = [];

// ── Inicializar y verificar mensajes nuevos de clientes ────────────────────
function initChatClientes() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) return;

    checkUnreadMessagesClientes(cedula);
    setInterval(() => checkUnreadMessagesClientes(cedula), 30000);
}

// ── Verificar mensajes no leídos de clientes ───────────────────────────────
function checkUnreadMessagesClientes(cedula) {
    $.getJSON('/api/merchandiser-unread-count-clientes/' + cedula)
        .done(function(data) {
            const count  = parseInt(data.unread_count || 0);
            const $btn   = $('#btnChatClientes');
            const $badge = $('#chatClientesNotificationBadge');

            if (count > 0) {
                $btn.removeClass('btn-outline-warning btn-warning')
                    .addClass('btn-warning')
                    .html('<i class="bi bi-chat-left-dots me-1"></i>' + count +
                          ' nuevo' + (count > 1 ? 's' : ''));
                $badge.text(count).show();
            } else {
                $btn.removeClass('btn-warning')
                    .addClass('btn-outline-warning')
                    .html('<i class="bi bi-chat-left-dots-fill me-1"></i>Abrir Chats');
                $badge.hide();
            }
        });
}

// ── Abrir modal lista de chats con clientes ────────────────────────────────
function abrirChatsClientes() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) return;

    $('#filterFechaClientes').val('');
    $('#filterClienteClientes').val('');
    $('#filterPuntoVentaClientes').val('');
    $('#chatsListModalClientes').modal('show');
    cargarListaChatsClientes(cedula);
}

// ── Cargar lista de chats con clientes ─────────────────────────────────────
function cargarListaChatsClientes(cedula) {
    $('#chatsListContainerClientes').html(
        '<div class="text-center py-5">' +
        '<div class="spinner-border text-warning"></div>' +
        '<p class="mt-2">Cargando chats...</p></div>'
    );

    $.getJSON('/api/merchandiser-chats-clientes/' + cedula)
        .done(function(data) {
            if (!data.success) {
                mercMostrarErrorClientes('No se pudieron cargar los chats');
                return;
            }
            mercAllChatsDataClientes = data.chats || [];
            mercRenderListaClientes(mercAllChatsDataClientes);
        })
        .fail(function() {
            mercMostrarErrorClientes('Error al conectar con el servidor');
        });
}

// ── Renderizar lista de chats con clientes ─────────────────────────────────
function mercRenderListaClientes(chats) {
    if (!chats || chats.length === 0) {
        $('#chatsListContainerClientes').html(
            '<div class="text-center py-5 text-muted">' +
            '<i class="bi bi-person-lines-fill fs-1"></i>' +
            '<p class="mt-3">No tienes chats con clientes aún.<br>' +
            '<small>Los chats aparecen cuando los clientes te envían mensajes.</small>' +
            '</p></div>'
        );
        return;
    }

    let html = '<div class="list-group">';
    chats.forEach(function(chat) {
        const nuevos      = chat.mensajes_no_leidos > 0;
        const esChatNuevo = chat.total_mensajes === 0;
        const fecha       = chat.fecha_visita
            ? new Date(chat.fecha_visita).toLocaleDateString('es-VE',
                { day: '2-digit', month: '2-digit', year: 'numeric' })
            : 'Sin fecha';
        const ultimoMsg   = chat.ultimo_mensaje
            ? (chat.ultimo_mensaje.length > 60
                ? chat.ultimo_mensaje.substring(0, 60) + '...'
                : chat.ultimo_mensaje)
            : 'Sin mensajes aún';

        html +=
            '<div class="list-group-item list-group-item-action py-3 ' +
                (nuevos ? 'border-start border-warning border-3' : esChatNuevo ? 'border-start border-info border-3' : '') + '" ' +
                'style="cursor:pointer;" ' +
                'onclick="mercAbrirChatCliente(' + chat.id_visita + ',' + chat.id_cliente + ',' +
                    '\'' + mercEscape(chat.cliente) + '\',' +
                    '\'' + mercEscape(chat.punto_venta) + '\')">' +

                '<div class="d-flex justify-content-between align-items-start">' +
                    '<div class="flex-grow-1">' +
                        '<div class="d-flex align-items-center gap-2 mb-1">' +
                            '<strong>' +
                                '<i class="bi bi-building me-1 text-warning"></i>' +
                                mercEscape(chat.cliente) +
                            '</strong>' +
                            (nuevos
                                ? '<span class="badge bg-warning text-dark rounded-pill">' +
                                  chat.mensajes_no_leidos +
                                  ' nuevo' + (chat.mensajes_no_leidos > 1 ? 's' : '') +
                                  '</span>'
                                : esChatNuevo
                                    ? '<span class="badge bg-info rounded-pill">Chat Nuevo</span>'
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
                                    : 'bg-secondary') +
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
    $('#chatsListContainerClientes').html(html);
}

// ── Filtrar chats de clientes ──────────────────────────────────────────────
function filtrarChatsClientes() {
    const fecha   = $('#filterFechaClientes').val();
    const cliente = $('#filterClienteClientes').val().toLowerCase().trim();
    const punto   = $('#filterPuntoVentaClientes').val().toLowerCase().trim();

    const filtrados = mercAllChatsDataClientes.filter(function(chat) {
        if (fecha   && (chat.fecha_visita || '').substring(0, 10) !== fecha) return false;
        if (cliente && !chat.cliente.toLowerCase().includes(cliente))         return false;
        if (punto   && !chat.punto_venta.toLowerCase().includes(punto))       return false;
        return true;
    });
    mercRenderListaClientes(filtrados);
}

// ── Abrir chat individual con cliente ──────────────────────────────────────
function mercAbrirChatCliente(visitId, clienteId, clienteNombre, puntoVenta) {
    mercChatVisitIdClientes = visitId;
    mercChatClienteId       = clienteId;

    // Marcar como leídos via HTTP inmediatamente al abrir
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (cedula) {
        $.ajax({
            url: '/api/mark-messages-read-clientes',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                id_visita: visitId, 
                id_cliente: clienteId,
                cedula: cedula 
            })
        });
    }

    $('#chatIndividualTitleClientes').html(
        '<i class="bi bi-person-lines-fill me-2"></i>' +
        mercEscape(clienteNombre) + ' - ' + mercEscape(puntoVenta)
    );

    $('#chatMessagesContainerClientes').html(
        '<div class="text-center text-muted py-4">' +
        '<div class="spinner-border text-warning"></div>' +
        '<p class="mt-2">Cargando mensajes...</p></div>'
    );
    $('#chatMessageInputClientes').val('');

    $('#chatsListModalClientes').modal('hide');
    setTimeout(function() {
        $('#chatIndividualModalClientes').modal('show');
        mercConectarSocketClientes(visitId, clienteId);
    }, 350);
}

// ── WebSocket para chat con clientes ───────────────────────────────────────
function mercConectarSocketClientes(visitId, clienteId) {
    if (mercChatSocketClientes) {
        try { mercChatSocketClientes.disconnect(); } catch(e) {}
        mercChatSocketClientes = null;
    }

    mercChatSocketClientes = io('/chat_cliente', {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5
    });

    const cedula = sessionStorage.getItem('merchandiser_cedula');

    mercChatSocketClientes.on('connect', function() {
        mercChatSocketClientes.emit('join_chat_cliente', {
            visit_id:   visitId,
            cliente_id: clienteId,
            username:   cedula
        });
    });

    mercChatSocketClientes.on('chat_history_cliente', function(data) {
        const msgs = data.mensajes || [];
        mercRenderHistorialClientes(msgs);

        // Marcar todos como leídos
        msgs.forEach(function(msg) {
            if (msg.id_mensaje && msg.tipo_mensaje !== 'sistema') {
                mercChatSocketClientes.emit('mark_messages_read_cliente', {
                    visit_id:   mercChatVisitIdClientes,
                    cliente_id: mercChatClienteId,
                    username:   cedula
                });
            }
        });

        setTimeout(function() {
            if (cedula) checkUnreadMessagesClientes(cedula);
        }, 800);
    });

    mercChatSocketClientes.on('new_message_cliente', function(msg) {
        if (parseInt(msg.id_visita) === parseInt(mercChatVisitIdClientes) &&
            parseInt(msg.id_cliente) === parseInt(mercChatClienteId)) {
            mercAppendMensajeCliente(msg);
            mercScrollAbajoClientes();

            if (msg.id_mensaje) {
                mercChatSocketClientes.emit('mark_messages_read_cliente', {
                    visit_id:   mercChatVisitIdClientes,
                    cliente_id: mercChatClienteId,
                    username:   cedula
                });
                setTimeout(function() {
                    if (cedula) checkUnreadMessagesClientes(cedula);
                }, 500);
            }
        }
    });

    mercChatSocketClientes.on('chat_error_cliente', function(data) {
        console.error('❌ chat_error_cliente:', data.error);
    });
}

// ── Renderizar historial de mensajes con clientes ──────────────────────────
function mercRenderHistorialClientes(messages) {
    if (!messages || messages.length === 0) {
        $('#chatMessagesContainerClientes').html(
            '<div class="text-center text-muted py-4">' +
            '<i class="bi bi-chat-square-dots fs-1"></i>' +
            '<p class="mt-2">No hay mensajes aún.<br>' +
            '<small>Escribe al cliente.</small></p></div>'
        );
        return;
    }
    $('#chatMessagesContainerClientes').empty();
    messages.forEach(function(msg) { mercAppendMensajeCliente(msg); });
    mercScrollAbajoClientes();
}

// ── Agregar mensaje al chat con cliente ────────────────────────────────────
function mercAppendMensajeCliente(msg) {
    const cedula = sessionStorage.getItem('merchandiser_cedula') || '';
    const esMio  = (msg.username === cedula);
    const hora   = mercFormatHora(msg.fecha_envio);

    let html = '';

    if (msg.tipo_mensaje === 'sistema') {
        // Mensaje de sistema (rechazo de foto) - CLICKEABLE para reemplazar
        const metadata = msg.metadata || {};
        const tipoFoto = metadata.tipo_foto || 'N/A';
        const cliente  = metadata.cliente || '';
        const punto    = metadata.punto || '';
        const fecha    = metadata.fecha || '';
        const razon    = metadata.razon_completa || metadata.comentario || 'Sin especificar';

        // Obtener id_foto de metadata o del texto del mensaje
        let idFotoSistema = null;
        if (metadata.id_foto) {
            idFotoSistema = metadata.id_foto;
        }
        if (!idFotoSistema) {
            const match = (msg.mensaje || '').match(/ID Foto:\s*(\d+)/);
            if (match) idFotoSistema = parseInt(match[1]);
        }

        let bodyHTML = '';
        if (idFotoSistema) {
            bodyHTML += '<div class="system-info-row"><i class="bi bi-hash"></i><span class="info-label">ID Foto:</span><span class="info-value">' + idFotoSistema + '</span></div>';
        }
        bodyHTML += '<div class="system-info-row"><i class="bi bi-camera"></i><span class="info-label">Tipo:</span><span class="info-value">' + mercEscape(tipoFoto) + '</span></div>';
        if (cliente) {
            bodyHTML += '<div class="system-info-row"><i class="bi bi-building"></i><span class="info-label">Cliente:</span><span class="info-value">' + mercEscape(cliente) + '</span></div>';
        }
        if (punto) {
            bodyHTML += '<div class="system-info-row"><i class="bi bi-geo-alt"></i><span class="info-label">Punto:</span><span class="info-value">' + mercEscape(punto) + '</span></div>';
        }
        if (fecha) {
            bodyHTML += '<div class="system-info-row"><i class="bi bi-calendar"></i><span class="info-label">Fecha:</span><span class="info-value">' + mercEscape(fecha) + '</span></div>';
        }
        bodyHTML += '<div class="system-info-row"><i class="bi bi-chat-left-text"></i><span class="info-label">Razón:</span><span class="info-value">' + mercEscape(razon) + '</span></div>';

        const clickAttr = idFotoSistema
            ? 'style="background:#fff3cd;border-left:4px solid #ffc107;max-width:80%;cursor:pointer;" onclick="mercAbrirModalReemplazoCliente(' + idFotoSistema + ')"'
            : 'style="background:#fff3cd;border-left:4px solid #ffc107;max-width:80%;"';

        const clickHint = idFotoSistema
            ? '<small class="d-block mt-2 text-primary"><i class="bi bi-camera me-1"></i><u>Toca aquí para reemplazar la foto</u></small>'
            : '';

        html =
            '<div class="d-flex justify-content-center mb-3">' +
                '<div class="px-3 py-2 rounded text-center" ' + clickAttr + '>' +
                    '<small class="d-block mb-1 text-warning fw-bold">' +
                        '<i class="bi bi-exclamation-triangle me-1"></i>Foto Rechazada' +
                    '</small>' +
                    '<div>' + bodyHTML + '</div>' +
                    clickHint +
                    '<small class="d-block mt-1 text-muted">' + hora + '</small>' +
                '</div>' +
            '</div>';

    } else if (esMio) {
        // Mis mensajes (mercaderista)
        html =
            '<div class="d-flex justify-content-end mb-3">' +
                '<div class="px-3 py-2 rounded" ' +
                     'style="max-width:70%;background:linear-gradient(135deg,#667eea,#764ba2);' +
                            'color:#fff;border-bottom-right-radius:4px;">' +
                    '<small class="d-block fw-bold mb-1 opacity-75">' +
                        '<i class="bi bi-person-fill me-1"></i>Tú' +
                    '</small>' +
                    '<span style="white-space:pre-line;">' +
                        mercEscape(msg.mensaje) +
                    '</span>' +
                    '<small class="d-block mt-1 opacity-75 text-end">' + hora + '</small>' +
                '</div>' +
            '</div>';

    } else {
        // Mensajes del cliente
        html =
            '<div class="d-flex justify-content-start mb-3">' +
                '<div class="px-3 py-2 rounded" ' +
                     'style="max-width:70%;background:#fff;border:1px solid #e2e8f0;' +
                            'border-bottom-left-radius:4px;">' +
                    '<small class="d-block fw-bold mb-1 text-warning">' +
                        '<i class="bi bi-person-badge me-1"></i>' +
                        mercEscape(msg.username) +
                    '</small>' +
                    '<span style="white-space:pre-line;">' +
                        mercEscape(msg.mensaje) +
                    '</span>' +
                    '<small class="d-block mt-1 text-muted">' + hora + '</small>' +
                '</div>' +
            '</div>';
    }

    const $c = $('#chatMessagesContainerClientes');
    if ($c.find('.spinner-border').length || $c.find('.bi-chat-square-dots').length) {
        $c.empty();
    }
    $c.append(html);
}

// ── Enviar mensaje a cliente ───────────────────────────────────────────────
function enviarMensajeChatCliente() {
    if (!mercChatSocketClientes || !mercChatVisitIdClientes || !mercChatClienteId) return;

    const mensaje = $('#chatMessageInputClientes').val().trim();
    if (!mensaje) return;

    const cedula = sessionStorage.getItem('merchandiser_cedula');

    mercChatSocketClientes.emit('send_message_cliente', {
        visit_id:   mercChatVisitIdClientes,
        cliente_id: mercChatClienteId,
        username:   cedula,
        mensaje:    mensaje
    });

    $('#chatMessageInputClientes').val('');

    setTimeout(function() {
        if (cedula) checkUnreadMessagesClientes(cedula);
    }, 800);
}

function mercScrollAbajoClientes() {
    const $c = $('#chatMessagesContainerClientes');
    if ($c.length) $c.scrollTop($c[0].scrollHeight);
}

function mercMostrarErrorClientes(msg) {
    $('#chatsListContainerClientes').html(
        '<div class="alert alert-danger text-center">' +
        '<i class="bi bi-exclamation-triangle me-2"></i>' + msg + '</div>'
    );
}

// ── Cerrar modal chat con cliente ──────────────────────────────────────────
$(document).on('hidden.bs.modal', '#chatIndividualModalClientes', function() {
    if (mercChatSocketClientes) {
        try {
            mercChatSocketClientes.emit('leave_chat_cliente', { 
                visit_id:   mercChatVisitIdClientes,
                cliente_id: mercChatClienteId
            });
            mercChatSocketClientes.disconnect();
        } catch(e) {}
        mercChatSocketClientes = null;
    }
    mercChatVisitIdClientes = null;
    mercChatClienteId       = null;

    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (cedula) {
        setTimeout(function() { checkUnreadMessagesClientes(cedula); }, 300);
        setTimeout(function() { checkUnreadMessagesClientes(cedula); }, 1500);
    }

    setTimeout(function() {
        if (cedula) cargarListaChatsClientes(cedula);
        $('#chatsListModalClientes').modal('show');
    }, 350);
});

// Filtros en tiempo real
$(document).on('input change', '#filterFechaClientes, #filterClienteClientes, #filterPuntoVentaClientes', function() {
    filtrarChatsClientes();
});

// Botón enviar
$(document).on('click', '#btnSendMessageClientes', function() {
    enviarMensajeChatCliente();
});

// Enter para enviar
$(document).on('keypress', '#chatMessageInputClientes', function(e) {
    if (e.which === 13 && !e.shiftKey) {
        e.preventDefault();
        enviarMensajeChatCliente();
    }
});

// Inicializar al cargar
$(document).ready(function() {
    initChatClientes();
});

// ============================================================================
// 📸 REEMPLAZO DE FOTO RECHAZADA DESDE CHAT - MERCADERISTA
// ============================================================================

function mercAbrirModalReemplazo(idFoto) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) return;

    // Guardar el id para usarlo al confirmar
    sessionStorage.setItem('reemplazo_id_foto', idFoto);

    const modalHTML = `
    <div class="modal fade" id="modalReemplazoFoto" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title">
                        <i class="bi bi-camera me-2"></i>Reemplazar Foto #${idFoto}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted mb-3">Selecciona una nueva foto para reemplazar la rechazada.</p>
                    
                    <div id="previewReemplazo" class="text-center mb-3" style="display:none;">
                        <img id="imgPreviewReemplazo" class="img-fluid rounded" style="max-height:250px;">
                        <p class="mt-1 text-muted small">Vista previa</p>
                    </div>

                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="document.getElementById('inputCamaraReemplazo').click()">
                            <i class="bi bi-camera-fill me-2"></i>Tomar foto (cámara trasera)
                        </button>
                        <button class="btn btn-secondary" onclick="document.getElementById('inputArchivoReemplazo').click()">
                            <i class="bi bi-folder2-open me-2"></i>Seleccionar archivo
                        </button>
                    </div>

                    <!-- Cámara trasera en móvil, archivos en PC -->
                    <input type="file" id="inputCamaraReemplazo" accept="image/*" capture="environment" style="display:none;">
                    <input type="file" id="inputArchivoReemplazo" accept="image/*" style="display:none;">

                    <div id="btnConfirmarReemplazoContainer" class="mt-3" style="display:none;">
                        <button class="btn btn-success w-100" onclick="mercConfirmarReemplazo(${idFoto})">
                            <i class="bi bi-check-circle me-2"></i>Confirmar reemplazo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    // Eliminar modal previo si existe
    const prevModal = document.getElementById('modalReemplazoFoto');
    if (prevModal) prevModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Manejar selección de archivo (ambos inputs)
    ['inputCamaraReemplazo', 'inputArchivoReemplazo'].forEach(function(inputId) {
        document.getElementById(inputId).addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            window._reemplazoFile = file;
            const reader = new FileReader();
            reader.onload = function(ev) {
                document.getElementById('imgPreviewReemplazo').src = ev.target.result;
                document.getElementById('previewReemplazo').style.display = 'block';
                document.getElementById('btnConfirmarReemplazoContainer').style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    });

    new bootstrap.Modal(document.getElementById('modalReemplazoFoto')).show();
}

function mercConfirmarReemplazo(idFoto) {
    const file = window._reemplazoFile;
    if (!file) return;

    Swal.fire({ title: 'Subiendo foto...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photo_id', idFoto);
    formData.append('point_name', '');
    formData.append('client_name', '');

    fetch('/api/mercaderista/replace-photo', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        Swal.close();
        if (data.success) {
            // Cerrar modal
            const m = bootstrap.Modal.getInstance(document.getElementById('modalReemplazoFoto'));
            if (m) m.hide();
            window._reemplazoFile = null;

            // Construir mensaje con datos del chat actual
            if (mercChatSocket && mercChatVisitId) {
                const cedula = sessionStorage.getItem('merchandiser_cedula');

                // Obtener cliente y punto del título del modal de chat
                const titleEl = document.getElementById('chatIndividualTitle');
                let clientePunto = '';
                if (titleEl) {
                    // El título tiene formato "Chat ► Cliente - Punto"
                    const titleText = titleEl.innerText || titleEl.textContent;
                    clientePunto = titleText.replace(/^.*?►?\s*/, '').trim();
                }

                const mensaje = `✅ Foto #${idFoto} reemplazada correctamente.\n` +
                                `🆔 Visita: #${mercChatVisitId}\n` +
                                `📍 ${clientePunto}`;

                mercChatSocket.emit('send_message', {
                    visit_id: mercChatVisitId,
                    username: cedula,
                    mensaje: mensaje
                });
            }

            Swal.fire({ icon: 'success', title: '¡Listo!', text: 'Foto reemplazada correctamente.', timer: 2000, showConfirmButton: false });
        } else {
            Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'No se pudo reemplazar la foto' });
        }
    })
}


// ============================================================================
// 📸 REEMPLAZO DE FOTO RECHAZADA DESDE CHAT CON CLIENTE - MERCADERISTA
// ============================================================================

function mercAbrirModalReemplazoCliente(idFoto) {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    if (!cedula) return;

    const modalHTML = `
    <div class="modal fade" id="modalReemplazoFotoCliente" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-warning text-dark">
                    <h5 class="modal-title">
                        <i class="bi bi-camera me-2"></i>Reemplazar Foto #${idFoto}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted mb-3">Selecciona una nueva foto para reemplazar la rechazada.</p>
                    
                    <div id="previewReemplazoCliente" class="text-center mb-3" style="display:none;">
                        <img id="imgPreviewReemplazoCliente" class="img-fluid rounded" style="max-height:250px;">
                        <p class="mt-1 text-muted small">Vista previa</p>
                    </div>

                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="document.getElementById('inputCamaraReemplazoCliente').click()">
                            <i class="bi bi-camera-fill me-2"></i>Tomar foto (cámara trasera)
                        </button>
                        <button class="btn btn-secondary" onclick="document.getElementById('inputArchivoReemplazoCliente').click()">
                            <i class="bi bi-folder2-open me-2"></i>Seleccionar archivo
                        </button>
                    </div>

                    <input type="file" id="inputCamaraReemplazoCliente" accept="image/*" capture="environment" style="display:none;">
                    <input type="file" id="inputArchivoReemplazoCliente" accept="image/*" style="display:none;">

                    <div id="btnConfirmarReemplazoClienteContainer" class="mt-3" style="display:none;">
                        <button class="btn btn-success w-100" onclick="mercConfirmarReemplazoCliente(${idFoto})">
                            <i class="bi bi-check-circle me-2"></i>Confirmar reemplazo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

    const prevModal = document.getElementById('modalReemplazoFotoCliente');
    if (prevModal) prevModal.remove();

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    ['inputCamaraReemplazoCliente', 'inputArchivoReemplazoCliente'].forEach(function(inputId) {
        document.getElementById(inputId).addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            window._reemplazoFileCliente = file;
            const reader = new FileReader();
            reader.onload = function(ev) {
                document.getElementById('imgPreviewReemplazoCliente').src = ev.target.result;
                document.getElementById('previewReemplazoCliente').style.display = 'block';
                document.getElementById('btnConfirmarReemplazoClienteContainer').style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    });

    new bootstrap.Modal(document.getElementById('modalReemplazoFotoCliente')).show();
}

function mercConfirmarReemplazoCliente(idFoto) {
    const file = window._reemplazoFileCliente;
    if (!file) return;

    Swal.fire({ title: 'Subiendo foto...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('photo_id', idFoto);
    formData.append('point_name', '');
    formData.append('client_name', '');

    fetch('/api/mercaderista/replace-photo', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(data => {
        Swal.close();
        if (data.success) {
            const m = bootstrap.Modal.getInstance(document.getElementById('modalReemplazoFotoCliente'));
            if (m) m.hide();
            window._reemplazoFileCliente = null;

            // Enviar mensaje al chat de clientes (sin mencionar el cliente porque ya se sabe)
            // Enviar mensaje al chat de clientes
            if (mercChatSocketClientes && mercChatVisitIdClientes && mercChatClienteId) {
                const cedula = sessionStorage.getItem('merchandiser_cedula');

                // Extraer cliente y punto del título del modal
                const titleEl = document.getElementById('chatIndividualTitleClientes');
                let clientePunto = '';
                if (titleEl) {
                    const titleText = titleEl.innerText || titleEl.textContent;
                    // El título tiene formato "Chat con Cliente ► Cliente - Punto"
                    // o simplemente "Cliente - Punto"
                    clientePunto = titleText.replace(/^.*?►?\s*/, '').trim();
                    // Quitar el ícono del principio si quedó
                    clientePunto = clientePunto.replace(/^[\s\S]*?(?:Cliente|person-lines-fill)\s*/i, '').trim();
                }

                const mensaje = `✅ Foto #${idFoto} reemplazada correctamente.\n` +
                                `🆔 Visita: #${mercChatVisitIdClientes}\n` +
                                `📍 ${clientePunto}`;

                mercChatSocketClientes.emit('send_message_cliente', {
                    visit_id:   mercChatVisitIdClientes,
                    cliente_id: mercChatClienteId,
                    username:   cedula,
                    mensaje:    mensaje
                });
            }

            Swal.fire({ icon: 'success', title: '¡Listo!', text: 'Foto reemplazada correctamente.', timer: 2000, showConfirmButton: false });
        } else {
            Swal.fire({ icon: 'error', title: 'Error', text: data.message || 'No se pudo reemplazar la foto' });
        }
    })
    .catch(() => {
        Swal.close();
        Swal.fire({ icon: 'error', title: 'Error', text: 'Error al conectar con el servidor' });
    });
}

// ── Lightbox para foto rechazada - mercaderista ────────────────────────────
function mercAbrirLightbox(imgUrl) {
    let overlay = document.getElementById('mercPhotoLightbox');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'mercPhotoLightbox';
        overlay.style.cssText =
            'position:fixed;top:0;left:0;width:100%;height:100%;' +
            'background:rgba(0,0,0,0.92);z-index:99999;' +
            'display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
        overlay.innerHTML =
            '<button onclick="document.getElementById(\'mercPhotoLightbox\').remove()" ' +
                'style="position:absolute;top:1rem;right:1rem;background:rgba(255,255,255,0.15);' +
                       'border:none;color:white;font-size:1.8rem;line-height:1;' +
                       'padding:0.3rem 0.7rem;border-radius:50%;cursor:pointer;z-index:1;">&times;</button>' +
            '<img id="mercPhotoLightboxImg" ' +
                'style="max-width:92vw;max-height:88vh;border-radius:10px;' +
                       'box-shadow:0 8px 40px rgba(0,0,0,0.7);object-fit:contain;" />';
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) overlay.remove();
        });
        document.body.appendChild(overlay);
    }
    document.getElementById('mercPhotoLightboxImg').src = imgUrl;
}


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