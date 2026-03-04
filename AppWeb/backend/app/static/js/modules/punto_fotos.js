// static/js/modules/punto_fotos.js
$(document).ready(function () {
    'use strict';

    let _loadPhotosController = null;
    
    // Configuración
    const CONFIG = {
        animationDelay: 50,
        loadingTimeout: 15000,
        maxMessageLength: 500,
        dateLocale: 'es-VE'
    };

    // Estado de la aplicación
    const state = {
        pointId: window.location.pathname.split('/').pop(),
        currentPhotoId: null,
        currentPhotoDetails: null,
        visitasData: {},
        openVisitas: new Set(),
        openCategorias: new Set(),
        clienteId: null
    };

    console.log('🚀 Iniciando módulo punto_fotos');
    console.log('📍 Punto ID:', state.pointId);

    init();

    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        state.clienteId = urlParams.get('cliente_id');
        if (state.clienteId) {
            console.log('✅ Cliente ID capturado del query string:', state.clienteId);
        }
        testData();
        loadVisitasList();
        loadPhotos();
        setupEventListeners();
    }

    // ============================================================
    // CAROUSEL MODAL - Manejo completamente manual, sin Bootstrap
    // ============================================================

    window.closePfCarousel = function() {
        $('#pfCarouselModal').removeClass('show').css('display', 'none');
        $('#pfCarouselBackdrop').remove();
        if ($('.modal.show').length === 0) {
            $('body').removeClass('modal-open');
        }
        $(document).off('keydown.carousel');
    };

    window.openCarouselModal = function(catNombre, fotos) {
        if (!fotos || !fotos.length) return;

        let currentIndex = 0;

        function renderCarouselSlide(index) {
            const foto = fotos[index];
            const imgUrl = window.getImageUrl(foto.file_path);
            const estado = foto.estado === 'Rechazada'
                ? '<span class="pf-carousel-estado pf-carousel-estado-rechazada"><i class="bi bi-x-circle-fill"></i> Rechazada</span>'
                : '';

            $('#pfCarouselImg').attr('src', imgUrl).attr('alt', `Foto ${foto.id_foto}`);
            // Precarga la siguiente
if (typeof fotos !== 'undefined' && index + 1 < fotos.length) {
    (new Image()).src = window.getImageUrl(fotos[index + 1].file_path);
}

            $('#pfCarouselEstado').html(estado);
            $('#pfCarouselCounter').text(`${index + 1} / ${fotos.length}`);
            $('#pfCarouselFotoId').text(`#${foto.id_foto}`);
            $('#pfCarouselTipo').text(foto.tipo_desc || `Tipo ${foto.id_tipo_foto}`);
            $('#pfCarouselFecha').text(formatDate(foto.fecha));
            $('#pfCarouselVerDetalle').data('foto-id', foto.id_foto);

            $('#pfCarouselPrev').toggleClass('pf-carousel-nav-disabled', index === 0);
            $('#pfCarouselNext').toggleClass('pf-carousel-nav-disabled', index === fotos.length - 1);

            $('#pfCarouselDots .pf-carousel-dot').removeClass('active');
            $(`#pfCarouselDots .pf-carousel-dot[data-index="${index}"]`).addClass('active');
        }

        // Construir dots
        const maxDots = Math.min(fotos.length, 10);
        let dotsHtml = '';
        for (let i = 0; i < maxDots; i++) {
            dotsHtml += `<span class="pf-carousel-dot${i === 0 ? ' active' : ''}" data-index="${i}"></span>`;
        }
        $('#pfCarouselDots').html(dotsHtml);
        $('#pfCarouselTitle').text(catNombre);
        renderCarouselSlide(0);

        // Navegación prev/next
        $('#pfCarouselPrev').off('click').on('click', function() {
            if (currentIndex > 0) { currentIndex--; renderCarouselSlide(currentIndex); }
        });
        $('#pfCarouselNext').off('click').on('click', function() {
            if (currentIndex < fotos.length - 1) { currentIndex++; renderCarouselSlide(currentIndex); }
        });

        // Dots click
        $('#pfCarouselDots').off('click', '.pf-carousel-dot').on('click', '.pf-carousel-dot', function() {
            currentIndex = parseInt($(this).data('index'));
            renderCarouselSlide(currentIndex);
        });

        // Ver detalle completo — carrusel QUEDA ABIERTO, photoModal abre encima
        $('#pfCarouselVerDetalle').off('click').on('click', function() {
            const fotoId = $(this).data('foto-id');
            window.viewPhotoModal(fotoId);
        });

        // Botón X del carousel
        $('#pfCarouselCloseBtn').off('click').on('click', function() {
            window.closePfCarousel();
        });

        // Click en el backdrop (fuera del dialog)
        $('#pfCarouselModal').off('click.pfclose').on('click.pfclose', function(e) {
            if ($(e.target).is('#pfCarouselModal')) {
                window.closePfCarousel();
            }
        });

        // Teclado
        $(document).off('keydown.carousel').on('keydown.carousel', function(e) {
            if ($('#pfCarouselModal').css('display') === 'none') return;
            if (e.key === 'ArrowLeft' && currentIndex > 0) { currentIndex--; renderCarouselSlide(currentIndex); }
            if (e.key === 'ArrowRight' && currentIndex < fotos.length - 1) { currentIndex++; renderCarouselSlide(currentIndex); }
            if (e.key === 'Escape') window.closePfCarousel();
        });

        // Mostrar carousel manualmente (sin Bootstrap)
        $('#pfCarouselModal').addClass('show').css('display', 'flex');
        if ($('#pfCarouselBackdrop').length === 0) {
            $('body').append('<div id="pfCarouselBackdrop" style="position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:10049;"></div>');
        }
        $('body').addClass('modal-open');
    };

    // ============================================================
    // EVENT LISTENERS
    // ============================================================

    function setupEventListeners() {
        $('#applyFiltersBtn').on('click', loadPhotos);
        $('#clearFiltersBtn').on('click', clearFilters);
        $('#approvePhotoBtn').on('click', approvePhoto);
        $('#showRejectionModal').on('click', showRejectionModal);
        $('#rejectPhotoBtn').on('click', rejectPhoto);
    }

    function testData() {
        console.log('🔍 Iniciando prueba de datos...');
        $.getJSON(`/api/test-point-photos/${state.pointId}`)
            .done(function(data) {
                console.log('✅ Datos de prueba recibidos:', data);
            })
            .fail(function(err) {
                console.error('❌ Error en prueba:', err);
            });
    }

    function loadVisitasList() {
        console.log('📋 Cargando lista de visitas...');
        $.getJSON(`/api/point-visitas/${state.pointId}`)
            .done(function(visitas) {
                const $select = $('#filter-visita');
                $select.empty();
                $select.append('<option value="">Todas las visitas</option>');
                if (visitas && visitas.length) {
                    visitas.forEach(visita => {
                        const fecha = formatDate(visita.fecha_visita);
                        $select.append(
                            `<option value="${escapeHtml(visita.id_visita)}">
                                Visita #${escapeHtml(visita.id_visita)} - ${fecha}
                            </option>`
                        );
                    });
                }
            })
            .fail(function(err) {
                console.error('❌ Error cargando visitas:', err);
                $('#filter-visita').html('<option value="">Error al cargar</option>');
            });
    }

    function loadPhotos() {
        const params = {
            fecha_inicio: $('#filter-fecha-inicio').val(),
            fecha_fin: $('#filter-fecha-fin').val(),
            prioridad: $('#filter-prioridad').val(),
            id_visita: $('#filter-visita').val()
        };
        if (state.clienteId) {
            params.cliente_id = state.clienteId;
        }
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });

        const query = new URLSearchParams(params).toString();
        const url = `/api/client-point-photos/${state.pointId}${query ? '?' + query : ''}`;

        showLoading('#photos-list', 'Cargando visitas y fotos...');

        if (_loadPhotosController) _loadPhotosController.abort();
        _loadPhotosController = new AbortController();

        const timeoutId = setTimeout(() => {
            console.warn('⚠️ La carga está tardando más de lo esperado');
        }, CONFIG.loadingTimeout);

        fetch(url, { signal: _loadPhotosController.signal })
    .then(function(r) { return r.json(); })
    .then(function(visitas) {
        if (visitas && Array.isArray(visitas)) {
            renderVisitas(visitas);
        }
    })
    .catch(function(err) {
        if (err.name === 'AbortError') return;
        showError('#photos-list', 'Error al cargar fotos.');
    });
    }

    function clearFilters() {
        $('#filter-fecha-inicio, #filter-fecha-fin').val('');
        $('#filter-prioridad, #filter-visita').val('');
        loadPhotos();
    }

    function renderVisitas(visitas) {
        const $container = $('#photos-list');
        $container.empty();

        const CATEGORIAS_VISIBLES = ['Gestión', 'Precio', 'Exhibiciones Adicionales', 'Material POP Antes', 'Material POP Despues'];

        const visitasFiltradas = visitas.filter(v => {
            let total = 0;
            if (v.fotos_por_categoria) {
                CATEGORIAS_VISIBLES.forEach(cat => {
                    total += (v.fotos_por_categoria[cat] || []).length;
                });
            }
            return total > 0;
        });

        if (!visitasFiltradas || visitasFiltradas.length === 0) {
            $container.html(`
                <div class="alert alert-info text-center w-100" role="alert">
                    <i class="bi bi-info-circle fs-1" aria-hidden="true"></i>
                    <p class="mt-2 mb-0">No hay visitas con fotos disponibles para este punto</p>
                    <button class="btn btn-outline-primary btn-sm mt-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Recargar
                    </button>
                </div>
            `);
            return;
        }

        const _frag = document.createDocumentFragment();

visitasFiltradas.forEach((visita, index) => {
    const fechaFormateada = formatDate(visita.fecha_visita);

    let totalFotos = 0;
    if (visita.fotos_por_categoria) {
        CATEGORIAS_VISIBLES.forEach(cat => {
            totalFotos += (visita.fotos_por_categoria[cat] || []).length;
        });
    }

    const mercaderista = visita.mercaderista || 'Sin nombre';
    const visitaId = visita.id_visita;

    state.visitasData[`visita_${visitaId}`] = visita;

    const _tmp = document.createElement('div');
    _tmp.innerHTML = `
        <div class="card mb-3 shadow-sm border-0 visita-card"
             id="visita-card-${visitaId}"
             data-visita-id="${visitaId}"
             style="animation: fadeIn 0.4s ease ${index * CONFIG.animationDelay}ms both;">
            <div class="card-header bg-primary text-white d-flex flex-wrap justify-content-between align-items-center py-3 gap-2"
                 id="visita-header-${visitaId}"
                 role="button"
                 tabindex="0"
                 aria-expanded="false"
                 aria-controls="visita-content-${visitaId}"
                 style="cursor: pointer;">
                <div class="flex-grow-1">
                    <h5 class="mb-0 d-flex align-items-center flex-wrap gap-2">
                        <i class="bi bi-calendar-check" aria-hidden="true"></i>
                        <span>Visita #${escapeHtml(String(visitaId))}</span>
                        <button class="btn-chat-visita"
                                data-visita-id="${visitaId}"
                                aria-label="Abrir chat de la visita">
                            <i class="bi bi-chat-dots-fill"></i>
                            <span class="hide-mobile">Chat</span>
                        </button>
                    </h5>
                    <small class="d-flex flex-wrap gap-2 mt-1 opacity-75">
                        <span><i class="bi bi-person" aria-hidden="true"></i> ${escapeHtml(mercaderista)}</span>
                        <span><i class="bi bi-clock" aria-hidden="true"></i> ${fechaFormateada}</span>
                        <span><i class="bi bi-images" aria-hidden="true"></i> ${totalFotos} ${totalFotos === 1 ? 'foto' : 'fotos'}</span>
                    </small>
                </div>
                <div>
                    <i class="bi bi-chevron-down toggle-icon fs-4" id="toggle-icon-${visitaId}" aria-hidden="true"></i>
                </div>
            </div>
            <div class="card-body p-0" id="visita-content-${visitaId}" style="display: none;">
                <div class="text-center py-4">
                    <div class="spinner-border text-primary spinner-border-sm" role="status">
                        <span class="visually-hidden">Cargando fotos...</span>
                    </div>
                    <p class="mt-2 mb-0 small">Cargando fotos...</p>
                </div>
            </div>
        </div>
    `;
    
    if (_tmp.firstElementChild) {
        _frag.appendChild(_tmp.firstElementChild);
    }
});

$container[0].appendChild(_frag);

        // Event delegation para headers de visita
        $container.off('click.visita');
        $container.on('click.visita', '.card-header', function(e) {
            if ($(e.target).closest('.btn-chat-visita').length > 0) return;
            e.preventDefault();
            e.stopPropagation();
            const visitaId = $(this).closest('.visita-card').data('visita-id');
            if (visitaId) toggleVisitaById(visitaId);
        });

        // Event delegation para botón de chat
        $container.off('click', '.btn-chat-visita').on('click', '.btn-chat-visita', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const visitaId = $(this).data('visita-id');
            if (typeof window.openChatModal === 'function') {
                window.openChatModal(visitaId, e);
            }
        });

        // Soporte de teclado para headers de visita
        $container.off('keydown', '.visita-card .card-header').on('keydown', '.visita-card .card-header', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).trigger('click');
            }
        });
    }

    function toggleVisitaById(visitaId) {
        const $content = $(`#visita-content-${visitaId}`);
        const $icon    = $(`#toggle-icon-${visitaId}`);
        const $header  = $(`#visita-header-${visitaId}`);
        const visitaData = state.visitasData[`visita_${visitaId}`];

        if (!$content.length) return;

        const isOpen = $content.is(':visible');

        if (!isOpen) {
            if ($content.find('.pf-cat-grid').length === 0 && visitaData) {
                renderCategorias(visitaId, visitaData);
            }
            $content.stop(true, true).slideDown(280);
            $icon.addClass('rotated');
            $header.attr('aria-expanded', 'true');
            state.openVisitas.add(visitaId);
        } else {
            $content.stop(true, true).slideUp(280);
            $icon.removeClass('rotated');
            $header.attr('aria-expanded', 'false');
            state.openVisitas.delete(visitaId);
        }
    }

    window.toggleVisita = function(index) {
        const visitaKeys = Object.keys(state.visitasData);
        if (visitaKeys[index]) {
            const visitaId = state.visitasData[visitaKeys[index]].id_visita;
            toggleVisitaById(visitaId);
        }
    };

    function renderCategorias(visitaId, visita) {
        const $content = $(`#visita-content-${visitaId}`);

        if (!visita || !visita.fotos_por_categoria) {
            $content.html(`
                <div class="alert alert-warning m-3">
                    <i class="bi bi-exclamation-triangle"></i> No hay fotos disponibles
                </div>
            `);
            return;
        }

        const categoriasConfig = [
            { nombre: 'Gestión',                  icon: 'bi-clipboard-check', color: '#3b82f6', emoji: '📋' },
            { nombre: 'Precio',                   icon: 'bi-tag',             color: '#f59e0b', emoji: '🏷️' },
            { nombre: 'Exhibiciones Adicionales', icon: 'bi-grid-3x3',        color: '#06b6d4', emoji: '🖼️' },
            { nombre: 'Material POP Antes',       icon: 'bi-box-seam',        color: '#8b5cf6', emoji: '📦' },
            { nombre: 'Material POP Despues',     icon: 'bi-box-seam-fill',   color: '#ec4899', emoji: '🎁' }
        ];

        let html = '<div class="pf-cat-grid">';

        categoriasConfig.forEach((catConfig) => {
            const fotos = visita.fotos_por_categoria[catConfig.nombre] || [];
            const hasFotos = fotos.length > 0;
            const categoriaId = `categoria-${visitaId}-${catConfig.nombre.replace(/\s+/g, '-').toLowerCase()}`;

            const previewBg = hasFotos
                ? `background-image: url('${window.getImageUrl(fotos[0].file_path)}'); background-size: cover; background-position: center;`
                : '';

            html += `
                <div class="pf-cat-card ${hasFotos ? 'pf-cat-has-fotos' : 'pf-cat-empty'}"
                     data-categoria-id="${categoriaId}"
                     data-visita-id="${visitaId}"
                     data-categoria-nombre="${escapeHtml(catConfig.nombre)}"
                     ${hasFotos ? `role="button" tabindex="0" aria-label="Ver fotos de ${catConfig.nombre}"` : ''}>
                    
                    ${hasFotos ? `
                        <div class="pf-cat-thumb" style="${previewBg}">
                            <div class="pf-cat-thumb-overlay">
                                <span class="pf-cat-thumb-count">${fotos.length}</span>
                                <span class="pf-cat-thumb-label">fotos</span>
                            </div>
                        </div>
                    ` : `
                        <div class="pf-cat-icon-wrap" style="color: ${catConfig.color}; background: ${catConfig.color}18;">
                            <i class="bi ${catConfig.icon}"></i>
                        </div>
                    `}

                    <div class="pf-cat-info">
                        <p class="pf-cat-name">${escapeHtml(catConfig.nombre)}</p>
                        <p class="pf-cat-sub ${hasFotos ? 'pf-cat-sub-has' : ''}">
                            ${hasFotos ? `<i class="bi bi-images"></i> ${fotos.length} foto${fotos.length !== 1 ? 's' : ''}` : 'Sin fotos'}
                        </p>
                    </div>

                    ${hasFotos ? '<div class="pf-cat-arrow"><i class="bi bi-chevron-right"></i></div>' : ''}
                </div>
            `;
        });

        html += '</div>';
        $content.html(html);

        // Click en tarjeta de categoría con fotos → abrir carousel modal
        $content.on('click keydown', '.pf-cat-has-fotos', function(e) {
            if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            e.stopPropagation();

            const visitaId  = $(this).data('visita-id');
            const catNombre = $(this).data('categoria-nombre');
            const catData   = state.visitasData[`visita_${visitaId}`];
            const fotos     = catData?.fotos_por_categoria?.[catNombre] || [];

            if (typeof window.openCarouselModal === 'function') {
                window.openCarouselModal(catNombre, fotos);
            }
        });
    }

    window.toggleCategoria = function(categoriaId) {
        const $content = $(`#${categoriaId}`);
        const $icon = $(`#toggle-cat-icon-${categoriaId}`);
        const $header = $(`#categoria-header-${categoriaId}`);

        if (!$content.length) return;

        const isCurrentlyOpen = $content.is(':visible');
        if (!isCurrentlyOpen) {
            $content.slideDown(300);
            $icon.removeClass('bi-chevron-right').addClass('bi-chevron-down rotated');
            $header.attr('aria-expanded', 'true');
            state.openCategorias.add(categoriaId);
        } else {
            $content.slideUp(300);
            $icon.removeClass('bi-chevron-down rotated').addClass('bi-chevron-right');
            $header.attr('aria-expanded', 'false');
            state.openCategorias.delete(categoriaId);
        }
    };

    // Función global para abrir el modal de foto
    window.viewPhotoModal = function(photoId) {
        console.log(`🖼️ Abriendo modal para foto #${photoId}`);
        state.currentPhotoId = photoId;

        $('#modalPhoto').attr('src', '').addClass('opacity-50');

        $.getJSON(`/api/photo-details/${photoId}`)
            .done(function(photo) {
                state.currentPhotoDetails = photo;

                $('#modalPhoto')
                    .attr('src', window.getImageUrl(photo.file_path))
                    .removeClass('opacity-50')
                    .attr('alt', `Foto del punto ${photo.punto_de_interes}`);

                $('#modalCliente').text(photo.cliente || '-');
                $('#modalPunto').text(photo.punto_de_interes || '-');
                $('#modalMercaderista').text(photo.mercaderista || '-');
                $('#modalFecha').text(formatDate(photo.fecha));
                $('#modalTipo').text(photo.tipo === 'antes' ? 'Antes' : 'Después');

                $('#photoModal').modal('show');
                console.log('✅ Modal abierto correctamente');
            })
            .fail(function(err) {
                console.error('❌ Error cargando detalles de foto:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudo cargar la foto',
                    confirmButtonColor: '#667eea'
                });
            });
    };

    // Event delegation para tarjetas de foto
    $(document).on('click', '.photo-card', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const photoId = $(this).data('foto-id');
        if (photoId) window.viewPhotoModal(photoId);
    });

    $(document).on('keydown', '.photo-card', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('click');
        }
    });

    function showRejectionModal() {
        loadRejectionReasons();
        $('#rejectionComment').val('');
        $('#rejectionReasons input:checked').prop('checked', false);
        $('#rejectionModal').modal('show');
    }

    function loadRejectionReasons() {
        const $container = $('#rejectionReasons');
        $container.html(`
            <div class="text-center py-2">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `);

        $.getJSON('/api/photo-rejection-reasons')
            .done(function(razones) {
                $container.empty();
                if (razones && razones.length) {
                    razones.forEach(razon => {
                        $container.append(`
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox"
                                       value="${razon.id}" id="razon-${razon.id}">
                                <label class="form-check-label" for="razon-${razon.id}">
                                    ${escapeHtml(razon.razon)}
                                </label>
                            </div>
                        `);
                    });
                } else {
                    $container.html('<p class="text-muted small">No hay razones predefinidas</p>');
                }
            })
            .fail(function() {
                $container.html('<p class="text-danger small">Error al cargar razones</p>');
            });
    }

    function rejectPhoto() {
        if (!state.currentPhotoId) return;

        const razonesSeleccionadas = [];
        $('#rejectionReasons input:checked').each(function() {
            razonesSeleccionadas.push(parseInt($(this).val()));
        });

        const comentario = $('#rejectionComment').val().trim();

        if (razonesSeleccionadas.length === 0 && !comentario) {
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Selecciona al menos una razón de rechazo o escribe un comentario',
                confirmButtonColor: '#667eea'
            });
            return;
        }

        Swal.fire({
            title: '¿Rechazar foto?',
            html: `
                <p>Esta acción registrará el rechazo de la foto.</p>
                <p><strong>Razones seleccionadas:</strong> ${razonesSeleccionadas.length}</p>
                ${comentario ? `<p><strong>Comentario:</strong> ${escapeHtml(comentario)}</p>` : ''}
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="bi bi-x-circle"></i> Sí, rechazar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const $btn = $('#rejectPhotoBtn');
                $btn.prop('disabled', true).html('<span class="spinner-border spinner-border-sm"></span> Procesando...');

                $.ajax({
                    url: '/api/reject-photo',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        photo_id: state.currentPhotoId,
                        razones_ids: razonesSeleccionadas,
                        comentario: comentario
                    }),
                    success: function(response) {
                        if (response.success) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: 'Foto rechazada correctamente',
                                confirmButtonColor: '#667eea'
                            });
                            $('#rejectionModal').modal('hide');
                            $('#photoModal').modal('hide');
                            loadPhotos();
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.error || 'Error al rechazar la foto',
                                confirmButtonColor: '#667eea'
                            });
                        }
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON?.error || 'Error al rechazar la foto';
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errorMsg,
                            confirmButtonColor: '#667eea'
                        });
                    },
                    complete: function() {
                        $btn.prop('disabled', false).html('<i class="bi bi-x-circle"></i> Rechazar Foto');
                    }
                });
            }
        });
    }

    function approvePhoto() {
        if (!state.currentPhotoId) return;

        Swal.fire({
            icon: 'success',
            title: 'Aprobada',
            text: 'La foto ha sido marcada como aprobada',
            confirmButtonColor: '#667eea'
        });
        $('#photoModal').modal('hide');
    }

    // Utilidades
    function showLoading(selector, message) {
        $(selector).html(`
            <div class="text-center py-5 w-100">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">${escapeHtml(message)}</span>
                </div>
                <p class="mt-3 mb-0 text-muted">${escapeHtml(message)}</p>
            </div>
        `);
    }

    function showError(selector, message) {
        $(selector).html(`
            <div class="alert alert-danger d-flex align-items-center w-100" role="alert">
                <i class="bi bi-exclamation-triangle-fill fs-4 me-3" aria-hidden="true"></i>
                <div class="flex-grow-1">
                    <strong>Error:</strong> ${escapeHtml(message)}
                </div>
                <button class="btn btn-outline-danger btn-sm ms-3" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Reintentar
                </button>
            </div>
        `);
    }

    function formatDate(dateString) {
        if (!dateString) return 'Sin fecha';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString(CONFIG.dateLocale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return 'Sin fecha';
        }
    }

    function formatDateTime(dateString) {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleString(CONFIG.dateLocale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return '';
        }
    }

    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});

// ============================================================
// GLOBALES (fuera del document.ready)
// ============================================================

// window.getImageUrl = function(imagePath) {
//     if (!imagePath) return '/static/images/placeholder.png';
//     let cleanPath = imagePath
//         .replace("X://", "")
//         .replace("X:/", "")
//         .replace(/\\/g, "/")
//         .replace(/^\//, "");
//     return `/api/image/${encodeURIComponent(cleanPath)}`;
// };

window.openChatModal = window.openChatModal || function(visitaId, event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    console.log(`📨 Abriendo chat para visita ${visitaId}`);
    if (typeof window.initChatCliente === 'function') {
        window.initChatCliente(visitaId);
    }
    $('#chatClientModal').modal('show');
};