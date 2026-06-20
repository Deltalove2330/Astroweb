// static/js/modules/mis_visitas.js
// Módulo: Vista global de visitas del día para el cliente

$(document).ready(function () {
    'use strict';

    // ── Estado ───────────────────────────────────────────────────
    const state = {
        fecha: getTodayStr(),
        region: '',
        cadena: '',
        puntoId: '',
        clienteId: null,
        carFotos: [],
        carIndex: 0,
        filtrosIniciales: false,   // para saber si ya se cargaron los selects con info real
    };

    // ── Init ─────────────────────────────────────────────────────
    init();

    function init() {
        // Capturar cliente_id desde URL por si es coordinador
        const urlParams = new URLSearchParams(window.location.search);
        state.clienteId = urlParams.get('cliente_id') || null;

        setFechaInput(state.fecha);
        updateBanner(state.fecha, 0, 0);
        setupListeners();
        cargarVisitas();
    }

    // ── Helpers de fecha ─────────────────────────────────────────
    function getTodayStr() {
        const d = new Date();
        return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0')
        ].join('-');
    }

    function setFechaInput(fechaStr) {
        $('#filtFecha').val(fechaStr);
    }

    function formatDateHuman(fechaStr) {
        if (!fechaStr) return '';
        try {
            const d = new Date(fechaStr + 'T00:00:00');
            return d.toLocaleDateString('es-VE', {
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
            });
        } catch (e) { return fechaStr; }
    }

    function formatDateShort(fechaStr) {
        if (!fechaStr) return '';
        try {
            const d = new Date(fechaStr + 'T00:00:00');
            return d.toLocaleDateString('es-VE', {
                day: 'numeric', month: 'short', year: 'numeric'
            });
        } catch (e) { return fechaStr; }
    }

    function isToday(fechaStr) {
        return fechaStr === getTodayStr();
    }

    // ── Banner ───────────────────────────────────────────────────
    function updateBanner(fecha, totalVisitas, totalFotos) {
        const esHoy = isToday(fecha);
        $('#bannerFecha').text(esHoy ? '📅 Visitas de hoy' : '📅 Visitas del ' + formatDateShort(fecha));
        $('#bannerFechaSub').text(formatDateHuman(fecha));
        $('#statVisitas').text(totalVisitas);
        $('#statFotos').text(totalFotos);
    }

    // ── Event Listeners ──────────────────────────────────────────
    function setupListeners() {
        $('#btnAplicar').on('click', aplicarFiltros);
        $('#btnHoy').on('click', volverAHoy);

        // Tecla Enter en el input de fecha
        $('#filtFecha').on('keydown', function (e) {
            if (e.key === 'Enter') aplicarFiltros();
        });

        // Cascada de filtros en selects: re-filtra sin nueva petición al server
        // (los datos de filtros ya vinieron con la respuesta)
        $('#filtRegion').on('change', function () {
            const region = $(this).val();
            state.region = region;
            // Si cambia región, limpiar cadena y punto
            state.cadena = '';
            state.puntoId = '';
            $('#filtCadena').val('');
            $('#filtPunto').val('');
            aplicarFiltros();
        });

        $('#filtCadena').on('change', function () {
            state.cadena = $(this).val();
            state.puntoId = '';
            $('#filtPunto').val('');
            aplicarFiltros();
        });

        $('#filtPunto').on('change', function () {
            state.puntoId = $(this).val();
            aplicarFiltros();
        });

        // Carousel listeners
        setupCarouselListeners();
    }

    function aplicarFiltros() {
        state.fecha   = $('#filtFecha').val() || getTodayStr();
        state.region  = $('#filtRegion').val() || '';
        state.cadena  = $('#filtCadena').val() || '';
        state.puntoId = $('#filtPunto').val()  || '';
        setFechaInput(state.fecha);
        cargarVisitas();
    }

    function volverAHoy() {
        state.fecha   = getTodayStr();
        state.region  = '';
        state.cadena  = '';
        state.puntoId = '';
        setFechaInput(state.fecha);
        $('#filtRegion, #filtCadena, #filtPunto').val('');
        cargarVisitas();
    }

    // ── Carga de datos ───────────────────────────────────────────
    function cargarVisitas() {
        mostrarSkeleton();

        const params = { fecha: state.fecha };
        if (state.region)   params.region   = state.region;
        if (state.cadena)   params.cadena   = state.cadena;
        if (state.puntoId)  params.punto_id = state.puntoId;
        if (state.clienteId) params.cliente_id = state.clienteId;

        $.getJSON('/api/mis-visitas', params)
            .done(function (data) {
                if (!data.success) {
                    mostrarError(data.error || 'Error al cargar visitas');
                    return;
                }
                poblarFiltros(data.filtros);
                updateBanner(data.fecha, data.total, contarFotos(data.visitas));
                renderVisitas(data.visitas);
            })
            .fail(function (jqXHR) {
                if (jqXHR.status === 401) {
                    window.location.href = '/login';
                    return;
                }
                mostrarError('No se pudo conectar con el servidor. Intenta de nuevo.');
            });
    }

    function contarFotos(visitas) {
        return (visitas || []).reduce((sum, v) => sum + (v.total_fotos || 0), 0);
    }

    // ── Filtros (select) ─────────────────────────────────────────
    function poblarFiltros(filtros) {
        if (!filtros) return;

        // Guardar valores actuales para restaurarlos
        const curRegion = state.region;
        const curCadena = state.cadena;
        const curPunto  = state.puntoId;

        poblarSelect('#filtRegion', filtros.regiones || [], v => v, v => v, curRegion);
        poblarSelect('#filtCadena', filtros.cadenas  || [], v => v, v => v, curCadena);
        poblarSelect('#filtPunto',  filtros.puntos   || [], v => v.id, v => v.nombre, curPunto);
    }

    function poblarSelect(selector, items, valFn, txtFn, selectedVal) {
        const $sel = $(selector);
        const first = $sel.find('option:first').clone();
        $sel.empty().append(first);
        items.forEach(item => {
            const $opt = $('<option>').val(valFn(item)).text(txtFn(item));
            if (String(valFn(item)) === String(selectedVal)) $opt.attr('selected', true);
            $sel.append($opt);
        });
    }

    // ── Render de visitas ────────────────────────────────────────
    const CATEGORIAS = [
        { nombre: 'Gestión',                 emoji: '📋', color: '#3b82f6' },
        { nombre: 'Precio',                  emoji: '🏷️', color: '#f59e0b' },
        { nombre: 'Exhibiciones Adicionales',emoji: '🖼️', color: '#06b6d4' },
        { nombre: 'Material POP Antes',      emoji: '📦', color: '#8b5cf6' },
        { nombre: 'Material POP Despues',    emoji: '🎁', color: '#ec4899' },
    ];

    function renderVisitas(visitas) {
        const $container = $('#mvListContainer');
        $container.empty();

        if (!visitas || visitas.length === 0) {
            $container.html(`
                <div class="mv-empty">
                    <span class="mv-empty-icon">🔍</span>
                    <p class="mv-empty-title">Sin visitas para este día</p>
                    <p class="mv-empty-sub">No se encontraron visitas con los filtros aplicados.<br>Prueba cambiando la fecha o limpiando los filtros.</p>
                </div>
            `);
            return;
        }

        const $list = $('<div class="mv-visita-list"></div>');

        visitas.forEach((visita, idx) => {
            const $card = buildCard(visita, idx);
            $list.append($card);
        });

        $container.append($list);
    }

    function buildCard(visita, idx) {
        const previewUrl = visita.preview_foto
            ? window.getImageUrl(visita.preview_foto)
            : null;

        const thumbHtml = previewUrl
            ? `<img src="${esc(previewUrl)}" alt="Preview" loading="lazy">`
            : `<div class="mv-card-thumb-placeholder">📷</div>`;

        const regionTag  = visita.region  ? `<span class="mv-tag mv-tag-region">📍 ${esc(visita.region)}</span>` : '';
        const cadenaTag  = visita.cadena  ? `<span class="mv-tag mv-tag-cadena">🏪 ${esc(visita.cadena)}</span>` : '';
        const ciudadTag  = visita.ciudad  ? `<span class="mv-tag mv-tag-ciudad">🌆 ${esc(visita.ciudad)}</span>` : '';
        const fotosTag   = `<span class="mv-tag mv-tag-fotos">🖼 ${visita.total_fotos} foto${visita.total_fotos !== 1 ? 's' : ''}</span>`;

        const hora = visita.fecha_visita
            ? new Date(visita.fecha_visita).toLocaleTimeString('es-VE', { hour: '2-digit', minute: '2-digit' })
            : '';

        const $card = $(`
            <div class="mv-card" data-visita-id="${visita.id_visita}" style="animation-delay:${idx * 40}ms">
                <div class="mv-card-inner">
                    <div class="mv-card-thumb">
                        ${thumbHtml}
                        ${visita.total_fotos > 0 ? `<span class="mv-thumb-count">${visita.total_fotos} 📸</span>` : ''}
                    </div>
                    <div class="mv-card-body">
                        <div>
                            <div class="mv-card-top">
                                <span class="mv-card-punto">${esc(visita.punto_nombre)}</span>
                                <span class="mv-card-visita-id">#${visita.id_visita}</span>
                            </div>
                            <div class="mv-card-meta">
                                <span class="mv-card-meta-item">
                                    <i class="bi bi-person-fill"></i>
                                    ${esc(visita.mercaderista || 'Sin asignar')}
                                </span>
                                ${hora ? `<span class="mv-card-meta-item">
                                    <i class="bi bi-clock"></i> ${hora}
                                </span>` : ''}
                                <span class="mv-card-meta-item">
                                    <i class="bi bi-building"></i>
                                    ${esc(visita.cliente_nombre || '')}
                                </span>
                            </div>
                            <div class="mv-card-tags">
                                ${regionTag}${cadenaTag}${ciudadTag}${fotosTag}
                            </div>
                        </div>
                    </div>
                    <div class="mv-card-arrow">
                        <i class="bi bi-chevron-down" id="arr-${visita.id_visita}"></i>
                    </div>
                </div>
                <!-- Categorías expandibles -->
                <div class="mv-cat-expand" id="expand-${visita.id_visita}">
                    ${buildCatGrid(visita)}
                </div>
            </div>
        `);

        // Toggle expand al hacer clic en la card
        $card.on('click', function (e) {
            // Evitar doble trigger si el clic fue en una cat-item
            if ($(e.target).closest('.mv-cat-item').length) return;
            toggleCard(visita.id_visita);
        });

        // Clic en tarjeta de categoría → carousel
        $card.on('click', '.mv-cat-item.has-fotos', function (e) {
            e.stopPropagation();
            const catNombre = $(this).data('cat');
            const fotos = visita.fotos_por_categoria[catNombre] || [];
            if (fotos.length) openCarousel(catNombre, fotos);
        });

        return $card;
    }

    function buildCatGrid(visita) {
        let html = '<div class="mv-cat-grid-inner">';

        CATEGORIAS.forEach(cfg => {
            const fotos = (visita.fotos_por_categoria || {})[cfg.nombre] || [];
            const hasFotos = fotos.length > 0;
            const previewUrl = hasFotos ? window.getImageUrl(fotos[0].file_path) : null;

            const previewHtml = previewUrl
                ? `<div class="mv-cat-preview">
                       <img src="${esc(previewUrl)}" alt="${esc(cfg.nombre)}" loading="lazy">
                       <div class="mv-cat-overlay">
                           <span class="mv-cat-overlay-count">${fotos.length}</span>
                       </div>
                   </div>`
                : `<div class="mv-cat-preview">
                       <div class="mv-cat-preview-icon" style="color:${cfg.color}20; background:${cfg.color}12;">${cfg.emoji}</div>
                   </div>`;

            html += `
                <div class="mv-cat-item ${hasFotos ? 'has-fotos' : 'empty'}"
                     data-cat="${esc(cfg.nombre)}"
                     ${hasFotos ? `role="button" tabindex="0" aria-label="Ver fotos de ${esc(cfg.nombre)}"` : ''}>
                    ${previewHtml}
                    <div class="mv-cat-info">
                        <p class="mv-cat-name">${esc(cfg.nombre)}</p>
                        <p class="mv-cat-count ${hasFotos ? 'has-fotos' : ''}">
                            ${hasFotos ? `${fotos.length} foto${fotos.length !== 1 ? 's' : ''}` : 'Sin fotos'}
                        </p>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    function toggleCard(visitaId) {
        const $expand = $(`#expand-${visitaId}`);
        const $arrow  = $(`#arr-${visitaId}`);
        const isOpen  = $expand.hasClass('open');

        if (isOpen) {
            $expand.removeClass('open').slideUp(220);
            $arrow.removeClass('bi-chevron-up').addClass('bi-chevron-down');
        } else {
            $expand.addClass('open').hide().slideDown(280);
            $arrow.removeClass('bi-chevron-down').addClass('bi-chevron-up');
        }
    }

    // ── Carousel ─────────────────────────────────────────────────
    function openCarousel(catNombre, fotos) {
        state.carFotos = fotos;
        state.carIndex = 0;

        // Dots
        const maxDots = Math.min(fotos.length, 12);
        let dotsHtml = '';
        for (let i = 0; i < maxDots; i++) {
            dotsHtml += `<span class="mv-dot${i === 0 ? ' active' : ''}" data-i="${i}"></span>`;
        }
        $('#mvCarDots').html(dotsHtml);
        $('#mvCarTitle').text(catNombre);

        renderCarSlide(0);
        showCarousel();
    }

    function renderCarSlide(idx) {
        const fotos = state.carFotos;
        const foto  = fotos[idx];
        if (!foto) return;

        state.carIndex = idx;

        $('#mvCarImg')
            .css('opacity', .5)
            .attr('src', window.getImageUrl(foto.file_path))
            .attr('alt', `Foto ${foto.id_foto}`)
            .off('load error')
            .on('load',  function () { $(this).css('opacity', 1); })
            .on('error', function () { $(this).css('opacity', 1); });

        $('#mvCarCounter').text(`${idx + 1} / ${fotos.length}`);
        $('#mvCarId').text(`#${foto.id_foto}`);
        $('#mvCarTipo').text(foto.tipo_desc || '');
        $('#mvCarFecha').text(formatDateShort(foto.fecha ? foto.fecha.split('T')[0] : ''));

        $('#mvCarPrev').toggleClass('disabled', idx === 0);
        $('#mvCarNext').toggleClass('disabled', idx === fotos.length - 1);

        $('#mvCarDots .mv-dot').removeClass('active');
        $(`#mvCarDots .mv-dot[data-i="${idx}"]`).addClass('active');

        // Precarga siguiente
        if (idx + 1 < fotos.length) {
            (new Image()).src = window.getImageUrl(fotos[idx + 1].file_path);
        }
    }

    function showCarousel() {
        if ($('#mvCarouselBackdrop').length === 0) {
            $('body').append('<div id="mvCarouselBackdrop" style="position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:10049;"></div>');
        }
        $('#mvCarouselModal').addClass('show').css('display', 'flex');
        $('body').addClass('modal-open');
        $(document).on('keydown.mvcar', carKeyHandler);
    }

    function closeCarousel() {
        $('#mvCarouselModal').removeClass('show').css('display', 'none');
        $('#mvCarouselBackdrop').remove();
        if ($('.modal.show').length === 0) $('body').removeClass('modal-open');
        $(document).off('keydown.mvcar');
    }

    function setupCarouselListeners() {
        $('#mvCarClose').on('click', closeCarousel);
        $('#mvCarouselBackdrop').on('click', closeCarousel);

        // Backdrop click (modal overlay)
        $('#mvCarouselModal').on('click', function (e) {
            if ($(e.target).is('#mvCarouselModal')) closeCarousel();
        });

        $('#mvCarPrev').on('click', function () {
            if (state.carIndex > 0) renderCarSlide(state.carIndex - 1);
        });

        $('#mvCarNext').on('click', function () {
            if (state.carIndex < state.carFotos.length - 1) renderCarSlide(state.carIndex + 1);
        });

        $('#mvCarDots').on('click', '.mv-dot', function () {
            renderCarSlide(parseInt($(this).data('i')));
        });
    }

    function carKeyHandler(e) {
        if ($('#mvCarouselModal').css('display') === 'none') return;
        if (e.key === 'ArrowLeft'  && state.carIndex > 0) renderCarSlide(state.carIndex - 1);
        if (e.key === 'ArrowRight' && state.carIndex < state.carFotos.length - 1) renderCarSlide(state.carIndex + 1);
        if (e.key === 'Escape') closeCarousel();
    }

    // ── Loading / Error states ───────────────────────────────────
    function mostrarSkeleton() {
        $('#mvListContainer').html(`
            <div class="mv-skeleton">
                <div class="mv-skeleton-card"></div>
                <div class="mv-skeleton-card"></div>
                <div class="mv-skeleton-card"></div>
            </div>
        `);
    }

    function mostrarError(msg) {
        $('#mvListContainer').html(`
            <div class="mv-empty">
                <span class="mv-empty-icon">⚠️</span>
                <p class="mv-empty-title">Ocurrió un error</p>
                <p class="mv-empty-sub">${esc(msg)}</p>
                <button class="btn btn-outline-primary mt-3" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise"></i> Reintentar
                </button>
            </div>
        `);
    }

    // ── Escape HTML ──────────────────────────────────────────────
    function esc(text) {
        if (typeof text !== 'string') return String(text ?? '');
        const d = document.createElement('div');
        d.textContent = text;
        return d.innerHTML;
    }

}); // fin document.ready