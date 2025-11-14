// static/js/modules/punto_fotos.js 
$(document).ready(function () {
    const pointId = window.location.pathname.split('/').pop();
    let currentPhotoId = null;
    let currentPhotoDetails = null;
    let chatApp = null;

    loadPhotos();

    function initChatApp() {
        if (!chatApp) {
            chatApp = Vue.createApp(ChatModule).mount('#chatApp');
        }
    }

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
            
            // Inicializar Vue Chat
            initChatApp();
            
            $.getJSON('/api/current-user').done(function(user) {
                chatApp.initChat(photoId, user.id);
                
                // Marcar mensajes como leídos inmediatamente al abrir el modal
                setTimeout(() => {
                    if (chatApp.markMessagesAsRead) {
                        chatApp.markMessagesAsRead();
                    }
                }, 1000);
                
            }).fail(function() {
                console.error('No se pudo obtener el usuario actual');
                chatApp.initChat(photoId, null);
            });
            
            // Cargar razones de rechazo
            loadRejectionReasons();
            
            $('#photoModal').modal('show');
        })
        .fail(function() {
            Swal.fire('Error', 'No se pudo cargar la foto', 'error');
        });
};

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
                            Swal.fire('Éxito', 'Foto rechazada correctamente. El chat se ha iniciado.', 'success');
                            $('#rejectionModal').modal('hide');
                            
                            // Recargar el chat para mostrar el mensaje inicial
                            if (chatApp) {
                                chatApp.loadMessages();
                            }
                            
                            // Limpiar formulario
                            $('#rejectionComment').val('');
                            $('#rejectionReasons input:checked').prop('checked', false);
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

    // Cerrar modal y destruir chat
    $('#photoModal').on('hidden.bs.modal', function () {
        if (chatApp) {
            chatApp.destroy();
        }
        currentPhotoId = null;
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