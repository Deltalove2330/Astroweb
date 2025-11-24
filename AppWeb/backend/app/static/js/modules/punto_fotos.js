// static/js/modules/punto_fotos.js 
$(document).ready(function () {
    const pointId = window.location.pathname.split('/').pop();
    let currentPhotoId = null;
    let currentPhotoDetails = null;

    loadPhotos();

    function loadPhotos() {
        const params = {
            fecha_inicio: $('#filter-fecha-inicio').val(),
            fecha_fin: $('#filter-fecha-fin').val(),
            prioridad: $('#filter-prioridad').val()
        };

        const query = new URLSearchParams(params).toString();
        const url = `/api/client-point-photos/${pointId}${query ? '?' + query : ''}`;

        showLoading('#photos-list', 'Cargando fotos...');

        $.getJSON(url)
            .done(renderPhotos)
            .fail(() => showError('#photos-list', 'Error al cargar fotos'));
    }

    function renderPhotos(photos) {
        const $container = $('#photos-list');
        $container.empty();

        if (!photos || photos.length === 0) {
            $container.html(`
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> No hay fotos disponibles
                </div>
            `);
            return;
        }

        photos.forEach(photo => {
            $container.append(`
                <div class="photo-card" onclick="viewPhotoModal(${photo.id_foto})">
                    <div class="photo-preview">
                        <img src="${window.getImageUrl(photo.file_path)}" alt="Foto ${photo.id_foto}" loading="lazy">
                    </div>
                    <div class="photo-info">
                        <h6>Foto #${photo.id_foto}</h6>
                        <p><strong>Fecha:</strong> ${formatDate(photo.fecha)}</p>
                        <p><strong>Mercaderista:</strong> ${photo.mercaderista}</p>
                        <p><strong>Tipo:</strong> ${photo.tipo}</p>
                        ${photo.estado === 'Rechazada' ? '<span class="badge bg-danger">Rechazada</span>' : ''}
                    </div>
                </div>
            `);
        });
    }

    // Función global para abrir el modal de foto
    window.viewPhotoModal = function (photoId) {
        currentPhotoId = photoId;
        
        $.getJSON(`/api/photo-details/${photoId}`)
            .done(function(photo) {
                currentPhotoDetails = photo;
                $('#modalPhoto').attr('src', window.getImageUrl(photo.file_path));
                $('#modalCliente').text(photo.cliente);
                $('#modalPunto').text(photo.punto_de_interes);
                $('#modalMercaderista').text(photo.mercaderista);
                $('#modalFecha').text(formatDate(photo.fecha));
                $('#modalTipo').text(photo.tipo === 'antes' ? 'Antes' : 'Después');
                
                // Cargar chat
                loadPhotoChat(photoId);
                
                $('#photoModal').modal('show');
            })
            .fail(function() {
                Swal.fire('Error', 'No se pudo cargar la foto', 'error');
            });
    };

    function loadPhotoChat(photoId) {
        $.getJSON(`/api/photo-chat/${photoId}`)
            .done(function(mensajes) {
                const $chatContainer = $('#chatMessages');
                $chatContainer.empty();
                
                if (mensajes.length === 0) {
                    $chatContainer.html(`
                        <div class="text-center text-muted py-3">
                            <i class="bi bi-chat-dots"></i><br>
                            No hay mensajes aún
                        </div>
                    `);
                } else {
                    mensajes.forEach(msg => {
                        const alignClass = msg.es_cliente ? 'text-end' : 'text-start';
                        const bgClass = msg.es_cliente ? 'bg-primary text-white' : 'bg-light';
                        
                        $chatContainer.append(`
                            <div class="mb-2 ${alignClass}">
                                <div class="d-inline-block p-2 rounded ${bgClass}" style="max-width: 70%;">
                                    <small class="d-block fw-bold">${msg.username}</small>
                                    <div class="message-content">${msg.mensaje}</div>
                                    <small class="opacity-75">${formatDateTime(msg.fecha_mensaje)}</small>
                                </div>
                            </div>
                        `);
                    });
                    $chatContainer.scrollTop($chatContainer[0].scrollHeight);
                }
            })
            .fail(function() {
                console.error('Error al cargar el chat');
            });
    }

    function formatDateTime(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString('es-VE');
    }

    // Función para cargar razones de rechazo
    function loadRejectionReasons() {
        $.getJSON('/api/photo-rejection-reasons')
            .done(function(razones) {
                const $container = $('#rejectionReasons');
                $container.empty();
                
                razones.forEach(razon => {
                    $container.append(`
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" value="${razon.id}" id="razon-${razon.id}">
                            <label class="form-check-label" for="razon-${razon.id}">
                                ${razon.razon}
                            </label>
                        </div>
                    `);
                });
            })
            .fail(function() {
                console.error('Error al cargar razones de rechazo');
            });
    }

    // Enviar mensaje de chat
    $('#sendChatMessage').on('click', function() {
        const mensaje = $('#chatInput').val().trim();
        if (!mensaje || !currentPhotoId) return;
        
        $.ajax({
            url: '/api/send-chat-message',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                photo_id: currentPhotoId,
                mensaje: mensaje
            }),
            success: function() {
                $('#chatInput').val('');
                loadPhotoChat(currentPhotoId);
            },
            error: function() {
                Swal.fire('Error', 'No se pudo enviar el mensaje', 'error');
            }
        });
    });

    // Rechazar foto
    // Rechazar foto
$('#rejectPhotoBtn').on('click', function() {
    if (!currentPhotoId) return;
    
    const razonesSeleccionadas = [];
    $('#rejectionReasons input:checked').each(function() {
        razonesSeleccionadas.push(parseInt($(this).val()));
    });
    
    const comentario = $('#rejectionComment').val().trim();
    
    if (razonesSeleccionadas.length === 0 && !comentario) {
        Swal.fire('Advertencia', 'Selecciona al menos una razón de rechazo o escribe un comentario', 'warning');
        return;
    }
    
    // Mostrar confirmación
    Swal.fire({
        title: '¿Rechazar foto?',
        html: `
            <p>Esta acción registrará el rechazo de la foto.</p>
            <p><strong>Razones seleccionadas:</strong> ${razonesSeleccionadas.length}</p>
            ${comentario ? `<p><strong>Comentario:</strong> ${comentario}</p>` : ''}
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, rechazar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Mostrar loading
            const rejectBtn = $('#rejectPhotoBtn');
            rejectBtn.prop('disabled', true).html('<i class="bi bi-hourglass-split"></i> Procesando...');
            
            $.ajax({
                url: '/api/reject-photo',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    photo_id: currentPhotoId,
                    razones_ids: razonesSeleccionadas,
                    comentario: comentario
                }),
                success: function(response) {
                    if (response.success) {
                        Swal.fire('Éxito', 'Foto rechazada correctamente', 'success');
                        $('#rejectionModal').modal('hide');
                        $('#photoModal').modal('hide');
                        // Recargar la lista de fotos
                        loadPhotos();
                    } else {
                        Swal.fire('Error', response.error || 'Error al rechazar la foto', 'error');
                    }
                },
                error: function(xhr) {
                    const errorMsg = xhr.responseJSON?.error || 'Error al rechazar la foto';
                    Swal.fire('Error', errorMsg, 'error');
                },
                complete: function() {
                    rejectBtn.prop('disabled', false).html('<i class="bi bi-x-circle"></i> Rechazar Foto');
                }
            });
        }
    });
});

    // Mostrar modal de rechazo
    $('#showRejectionModal').on('click', function() {
        loadRejectionReasons();
        $('#rejectionComment').val('');
        $('#rejectionReasons input:checked').prop('checked', false);
        $('#rejectionModal').modal('show');
    });

    // Aprobar foto (solo cierra el modal por ahora)
    $('#approvePhotoBtn').on('click', function() {
        Swal.fire('Aprobada', 'La foto ha sido marcada como aprobada', 'success');
        $('#photoModal').modal('hide');
    });

    // Enter para enviar mensaje
    $('#chatInput').on('keypress', function(e) {
        if (e.which === 13) {
            $('#sendChatMessage').click();
        }
    });

    // Filtros existentes
    $('#applyFiltersBtn').click(loadPhotos);
    $('#clearFiltersBtn').click(function () {
        $('#filter-fecha-inicio, #filter-fecha-fin, #filter-prioridad').val('');
        loadPhotos();
    });

    function showLoading(selector, message) {
        $(selector).html(`
            <div class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2">${message}</p>
            </div>
        `);
    }

    function showError(selector, message) {
        $(selector).html(`
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> ${message}
            </div>
        `);
    }

    function formatDate(dateString) {
        if (!dateString) return 'Sin fecha';
        return new Date(dateString).toLocaleDateString('es-VE');
    }
});

window.getImageUrl = function(imagePath) {
    // Limpiar la ruta para Azure Blob Storage
    let cleanPath = imagePath
        .replace("X://", "")
        .replace("X:/", "")
        .replace(/\\/g, "/")
        .replace(/^\//, ""); // Eliminar barra inicial
    
    // Construir URL correcta para Azure
    return `/api/image/${encodeURIComponent(cleanPath)}`;
};