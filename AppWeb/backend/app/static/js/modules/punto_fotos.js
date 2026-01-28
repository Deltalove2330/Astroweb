// static/js/modules/punto_fotos.js 
$(document).ready(function () {
    const pointId = window.location.pathname.split('/').pop();
    let currentPhotoId = null;
    let currentPhotoDetails = null;

    console.log('Punto ID:', pointId);

    // PRIMERO: Hacer prueba para ver si hay datos
    function testData() {
        console.log('Iniciando prueba de datos...');
        $.getJSON(`/api/test-point-photos/${pointId}`)
            .done(function(data) {
                console.log('✅ Datos de prueba recibidos:', data);
                if (data.total_fotos > 0) {
                    console.log('✅ Hay datos disponibles');
                } else {
                    console.log('⚠️ No hay datos en la prueba');
                }
            })
            .fail(function(err) {
                console.error('❌ Error en prueba:', err);
            });
    }

    // Ejecutar prueba
    testData();

    // Cargar lista de visitas para el filtro
    function loadVisitasList() {
        console.log('Cargando lista de visitas...');
        $.getJSON(`/api/point-visitas/${pointId}`)
            .done(function(visitas) {
                console.log('✅ Lista de visitas recibida:', visitas);
                const $select = $('#filter-visita');
                $select.empty();
                $select.append('<option value="">Todas las visitas</option>');
                
                visitas.forEach(visita => {
                    const fecha = formatDate(visita.fecha_visita);
                    $select.append(
                        `<option value="${visita.id_visita}">Visita #${visita.id_visita} - ${fecha}</option>`
                    );
                });
            })
            .fail(function(err) {
                console.error('❌ Error cargando visitas:', err);
                $('#filter-visita').html('<option value="">No se pudieron cargar las visitas</option>');
            });
    }

    loadVisitasList();
    loadPhotos();

    function loadPhotos() {
        const params = {
            fecha_inicio: $('#filter-fecha-inicio').val(),
            fecha_fin: $('#filter-fecha-fin').val(),
            prioridad: $('#filter-prioridad').val(),
            id_visita: $('#filter-visita').val()
        };

        console.log('🔍 Parámetros de filtro:', params);

        const query = new URLSearchParams(params).toString();
        const url = `/api/client-point-photos/${pointId}${query ? '?' + query : ''}`;
        
        console.log('🌐 URL de solicitud:', url);

        showLoading('#photos-list', 'Cargando visitas y fotos...');

        $.getJSON(url)
            .done(function(visitas) {
                console.log('✅ Datos recibidos del backend:', visitas);
                if (visitas && Array.isArray(visitas)) {
                    console.log(`📊 Total de visitas recibidas: ${visitas.length}`);
                    visitas.forEach((visita, idx) => {
                        console.log(`Visita ${idx}: #${visita.id_visita}, Fotos: ${visita.total_fotos || 0}`);
                    });
                    renderVisitas(visitas);
                } else {
                    console.error('❌ Datos no son un array:', visitas);
                    showError('#photos-list', 'Error en el formato de datos recibidos');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('❌ Error cargando fotos:', textStatus, errorThrown);
                console.error('Detalles de error:', jqXHR.responseText);
                showError('#photos-list', 'Error al cargar fotos. Revisa la consola para más detalles.');
            });
    }

    function renderVisitas(visitas) {
        const $container = $('#photos-list');
        $container.empty();

        console.log('🎨 Renderizando visitas:', visitas.length);

        if (!visitas || visitas.length === 0) {
            console.log('ℹ️ No hay visitas para mostrar');
            $container.html(`
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> No hay visitas disponibles para este punto
                </div>
            `);
            return;
        }

        visitas.forEach((visita, index) => {
            console.log(`🔄 Procesando visita ${index}:`, visita);
            
            const fechaFormateada = formatDate(visita.fecha_visita);
            const totalFotos = visita.total_fotos || 0;
            const mercaderista = visita.mercaderista || 'Sin nombre';
            
            console.log(`   → Visita #${visita.id_visita}, ${totalFotos} fotos, ${mercaderista}`);
            
            const visitaCard = `
                <div class="card mb-3 shadow-sm border-0 visita-card" id="visita-${index}">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center py-3" 
                         onclick="toggleVisita(${index})"
                         style="cursor: pointer;">
                        <div>
                            <h5 class="mb-0">
                                <i class="bi bi-calendar-check me-2"></i> Visita #${visita.id_visita}
                            </h5>
                            <small class="d-block mt-1">
                                <i class="bi bi-person"></i> ${mercaderista} 
                                • <i class="bi bi-clock"></i> ${fechaFormateada}
                                • <i class="bi bi-images"></i> ${totalFotos} ${totalFotos === 1 ? 'foto' : 'fotos'}
                            </small>
                        </div>
                        <div>
                            <i class="bi bi-chevron-down toggle-icon" id="toggle-icon-${index}"></i>
                        </div>
                    </div>
                    <div class="card-body p-0" id="visita-content-${index}" style="display: none;">
                        <div class="text-center py-4">
                            <div class="spinner-border text-primary spinner-border-sm"></div>
                            <p class="mt-2">Cargando fotos...</p>
                        </div>
                    </div>
                </div>
            `;
            
            $container.append(visitaCard);
            window[`visitaData_${index}`] = visita; // Guardar datos en variable global
        });

        console.log('✅ Todas las visitas renderizadas');
    }

    // Función global para toggle de visita
    window.toggleVisita = function(index) {
        console.log(`🔄 Toggle visita ${index}`);
        const $content = $(`#visita-content-${index}`);
        const $icon = $(`#toggle-icon-${index}`);
        const visitaData = window[`visitaData_${index}`];
        
        if ($content.find('.categoria-section').length === 0) {
            console.log(`📷 Cargando fotos para visita ${index}:`, visitaData);
            renderCategorias(index, visitaData);
        }
        
        $content.slideToggle(300);
        $icon.toggleClass('bi-chevron-down bi-chevron-up');
    };

    function renderCategorias(visitaIndex, visita) {
        const $content = $(`#visita-content-${visitaIndex}`);
        console.log(`🎨 Renderizando categorías para visita ${visitaIndex}:`, visita);
        
        if (!visita || !visita.fotos_por_categoria) {
            console.error(`❌ No hay datos de categorías para visita ${visitaIndex}`);
            $content.html(`
                <div class="alert alert-warning m-3">
                    <i class="bi bi-exclamation-triangle"></i> No hay fotos disponibles en esta visita
                </div>
            `);
            return;
        }
        
        let html = '';
        let totalCategorias = 0;
        let totalFotosEnCategorias = 0;
        
        // Orden de categorías
        const categoriasOrden = [
            'Gestión',
            'Precio', 
            'Exhibiciones Adicionales',
            'PDV',
            'Otros'
        ];
        
        categoriasOrden.forEach(categoria => {
            const fotos = visita.fotos_por_categoria[categoria] || [];
            if (fotos.length > 0) {
                totalCategorias++;
                totalFotosEnCategorias += fotos.length;
                const categoriaId = `categoria-${visitaIndex}-${categoria.replace(/\s+/g, '-').toLowerCase()}`;
                
                console.log(`   → Categoría "${categoria}": ${fotos.length} fotos`);
                
                html += `
                    <div class="categoria-section border-bottom">
                        <div class="categoria-header bg-light p-3 d-flex justify-content-between align-items-center"
                             onclick="toggleCategoria('${categoriaId}')"
                             style="cursor: pointer;">
                            <div>
                                <h6 class="mb-0">
                                    <i class="bi bi-folder me-2"></i>
                                    ${categoria}
                                    <span class="badge bg-secondary ms-2">${fotos.length}</span>
                                </h6>
                                <small class="text-muted">
                                    ${getCategoriaDescription(categoria)}
                                </small>
                            </div>
                            <div>
                                <i class="bi bi-chevron-right toggle-categoria-icon" id="toggle-cat-icon-${categoriaId}"></i>
                            </div>
                        </div>
                        <div class="categoria-content p-3" id="${categoriaId}" style="display: none;">
                            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                                ${fotos.map((foto, fotoIndex) => {
                                    console.log(`     → Foto ${fotoIndex}: #${foto.id_foto}, Tipo: ${foto.tipo_desc}`);
                                    return `
                                        <div class="col">
                                            <div class="photo-card h-100" onclick="viewPhotoModal(${foto.id_foto})">
                                                <div class="photo-preview position-relative">
                                                    <img src="${window.getImageUrl(foto.file_path)}" 
                                                         alt="Foto ${foto.id_foto}" 
                                                         class="img-fluid rounded"
                                                         loading="lazy"
                                                         style="height: 150px; width: 100%; object-fit: cover;">
                                                    ${foto.estado === 'Rechazada' ? 
                                                        '<span class="badge bg-danger position-absolute top-0 start-0 m-1">Rechazada</span>' : ''}
                                                    <span class="badge bg-info position-absolute bottom-0 end-0 m-1">
                                                        ${foto.tipo_desc || `Tipo ${foto.id_tipo_foto}`}
                                                    </span>
                                                </div>
                                                <div class="photo-info p-2">
                                                    <small class="d-block text-truncate">
                                                        <strong>ID:</strong> #${foto.id_foto}
                                                    </small>
                                                    <small class="d-block text-muted">
                                                        ${formatDateTime(foto.fecha)}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        console.log(`✅ Categorías renderizadas: ${totalCategorias}, Total fotos: ${totalFotosEnCategorias}`);
        
        if (totalCategorias === 0) {
            html = `
                <div class="alert alert-warning m-3">
                    <i class="bi bi-exclamation-triangle"></i> No hay fotos disponibles en esta visita
                </div>
            `;
        }
        
        $content.html(html);
    }

    function getCategoriaDescription(categoria) {
        const descripciones = {
            'Gestión': 'Fotos de gestión de mercadería (antes/después)',
            'Precio': 'Fotos de precios y etiquetado',
            'Exhibiciones Adicionales': 'Fotos de exhibiciones y material POP',
            'PDV': 'Fotos de activación y desactivación de PDV',
            'Otros': 'Otras fotos del punto'
        };
        return descripciones[categoria] || '';
    }

    // Función para toggle de categorías
    window.toggleCategoria = function(categoriaId) {
        console.log(`🔄 Toggle categoría: ${categoriaId}`);
        const $content = $(`#${categoriaId}`);
        const $icon = $(`#toggle-cat-icon-${categoriaId}`);
        
        $content.slideToggle(300);
        $icon.toggleClass('bi-chevron-right bi-chevron-down');
    };

    // Función global para abrir el modal de foto
    window.viewPhotoModal = function (photoId) {
        console.log(`🖼️ Abriendo modal para foto #${photoId}`);
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
                
                loadPhotoChat(photoId);
                
                $('#photoModal').modal('show');
                console.log('✅ Modal abierto correctamente');
            })
            .fail(function() {
                console.error('❌ Error cargando detalles de foto');
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

    // Filtros
    $('#applyFiltersBtn').click(loadPhotos);
    $('#clearFiltersBtn').click(function () {
        $('#filter-fecha-inicio, #filter-fecha-fin, #filter-prioridad, #filter-visita').val('');
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
        const date = new Date(dateString);
        return date.toLocaleDateString('es-VE');
    }
});

window.getImageUrl = function(imagePath) {
    let cleanPath = imagePath
        .replace("X://", "")
        .replace("X:/", "")
        .replace(/\\/g, "/")
        .replace(/^\//, "");
    
    return `/api/image/${encodeURIComponent(cleanPath)}`;
};