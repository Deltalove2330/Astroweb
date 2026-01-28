// static/js/modules/client_photos.js
$(document).ready(function () {
<<<<<<< HEAD
    loadRegions();

    function loadRegions() {
        showLoading('#regions-list', 'Cargando regiones...');
        $.getJSON('/api/client-regions')
            .done(renderRegions)
            .fail(() => showError('#regions-list', 'Error al cargar regiones'));
=======
    'use strict';
    
    // Configuración
    const CONFIG = {
        animationDelay: 100,
        loadingTimeout: 10000,
        regionEmojis: {
            'andes': '🏔️',
            'capital': '🏛️',
            'centro': '🌆',
            'insular': '🏝️',
            'occidente': '🌅',
            'oriente': '🌄',
            'llanos': '🌾',
            'zulia': '🌴',
            'default': '📍'
        }
    };

    // Inicialización
    init();

    function init() {
        loadRegions();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Event delegation para las tarjetas de región
        $('#regions-list').on('click', '.region-card', function () {
            const region = $(this).data('region');
            if (region) {
                loadChainsAccordion(region);
            }
        });

        // Soporte para teclado (accesibilidad)
        $('#regions-list').on('keydown', '.region-card', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });
    }

    function loadRegions() {
        showLoading('#regions-list', 'Cargando regiones...');
        
        const timeoutId = setTimeout(() => {
            showError('#regions-list', 'La carga está tardando más de lo esperado...');
        }, CONFIG.loadingTimeout);

        $.getJSON('/api/client-regions')
            .done(function(regions) {
                clearTimeout(timeoutId);
                renderRegions(regions);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                clearTimeout(timeoutId);
                console.error('Error al cargar regiones:', textStatus, errorThrown);
                showError('#regions-list', 'Error al cargar regiones. Por favor, intenta de nuevo.');
            });
    }

    function getRegionEmoji(regionName) {
        const normalized = regionName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        for (const [key, emoji] of Object.entries(CONFIG.regionEmojis)) {
            if (normalized.includes(key)) {
                return emoji;
            }
        }
        return CONFIG.regionEmojis.default;
    }

    function getRegionClass(regionName) {
        const normalized = regionName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const classes = ['andes', 'capital', 'centro', 'insular', 'occidente', 'oriente'];
        
        for (const cls of classes) {
            if (normalized.includes(cls)) {
                return cls;
            }
        }
        return '';
>>>>>>> dev
    }

    function renderRegions(regions) {
        const $container = $('#regions-list');
        $container.empty();

<<<<<<< HEAD
        if (!regions.length) {
            $container.html(`
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle fs-1"></i>
=======
        if (!regions || !regions.length) {
            $container.html(`
                <div class="alert alert-info text-center w-100" role="alert">
                    <i class="bi bi-info-circle fs-1" aria-hidden="true"></i>
>>>>>>> dev
                    <p class="mt-2 mb-0">No hay regiones disponibles</p>
                </div>
            `);
            return;
        }

<<<<<<< HEAD
        regions.forEach((region, rIndex) => {
           $container.append(`
    <div class="region-card" data-region="${region.region}">
        <h5 class="card-title">${region.region}</h5>
    </div>
`);
        });

        $('.region-card').on('click', function () {
            const region = $(this).data('region');
            loadChainsAccordion(region);
=======
        regions.forEach((region, index) => {
            const emoji = getRegionEmoji(region.region);
            const regionClass = getRegionClass(region.region);
            const delay = index * CONFIG.animationDelay;
            
            const $card = $(`
                <div class="region-card ${regionClass}" 
                     data-region="${escapeHtml(region.region)}"
                     role="listitem"
                     tabindex="0"
                     aria-label="Región ${escapeHtml(region.region)}"
                     style="animation-delay: ${delay}ms;">
                    <div class="region-card-content">
                        <span class="region-emoji" aria-hidden="true">${emoji}</span>
                        <h3 class="region-title">${escapeHtml(region.region)}</h3>
                        <button class="region-button" 
                                type="button"
                                aria-label="Ver cadenas de ${escapeHtml(region.region)}">
                            Ver Cadenas
                            <span class="arrow-icon" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            `);
            
            $container.append($card);
>>>>>>> dev
        });
    }

    function loadChainsAccordion(region) {
<<<<<<< HEAD
        $('#regions-list').hide();
        $('#chainsAccordion').show().empty().html(`
            <div class="d-flex align-items-center mb-3">
                <button class="btn btn-outline-secondary btn-sm me-3" onclick="goBackToRegions()">
                    <i class="bi bi-arrow-left"></i> Regresar
                </button>
                <h4>Cadenas de ${region}</h4>
            </div>
            <div class="loading-chains text-center py-2">
                <div class="spinner-border spinner-border-sm text-primary"></div>
                <span>Cargando cadenas...</span>
            </div>
        `);

        $.getJSON(`/api/client-chains-by-region/${encodeURIComponent(region)}`)
            .done(chains => {
                $('.loading-chains').hide();
                renderChainsAccordion(chains, region);
            })
            .fail(() => {
                $('.loading-chains').hide();
                $('#chainsAccordion').append('<div class="alert alert-danger">Error al cargar cadenas</div>');
            });
=======
        // Ocultar regiones con transición
        $('#regions-list').fadeOut(300, function() {
            const $accordion = $('#chainsAccordion');
            
            $accordion.empty().html(`
                <div class="d-flex flex-wrap align-items-center mb-3 gap-2">
                    <button class="btn btn-outline-secondary btn-sm" 
                            type="button"
                            onclick="goBackToRegions()"
                            aria-label="Volver a la lista de regiones">
                        <i class="bi bi-arrow-left" aria-hidden="true"></i> Regresar
                    </button>
                    <h4 class="mb-0 flex-grow-1">
                        <i class="bi bi-link-45deg" aria-hidden="true"></i> 
                        Cadenas de <strong>${escapeHtml(region)}</strong>
                    </h4>
                </div>
                <div class="loading-chains text-center py-4">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando cadenas...</span>
                    </div>
                    <p class="mt-2 mb-0">Cargando cadenas...</p>
                </div>
            `).fadeIn(300);

            $.getJSON(`/api/client-chains-by-region/${encodeURIComponent(region)}`)
                .done(function(chains) {
                    $('.loading-chains').fadeOut(200, function() {
                        $(this).remove();
                        renderChainsAccordion(chains, region);
                    });
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error('Error al cargar cadenas:', textStatus, errorThrown);
                    $('.loading-chains').fadeOut(200, function() {
                        $(this).remove();
                        $accordion.append(`
                            <div class="alert alert-danger" role="alert">
                                <i class="bi bi-exclamation-triangle" aria-hidden="true"></i> 
                                Error al cargar cadenas. 
                                <button class="btn btn-link p-0 ms-2" onclick="goBackToRegions()">Volver</button>
                            </div>
                        `);
                    });
                });
        });
>>>>>>> dev
    }

    function renderChainsAccordion(chains, region) {
        const $container = $('#chainsAccordion');
<<<<<<< HEAD
        if (!chains.length) {
            $container.append('<div class="alert alert-info">No hay cadenas en esta región</div>');
            return;
        }

        chains.forEach((chain, cIndex) => {
            const chainId = `chain-${cIndex}`;
            $container.append(`
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-${chainId}">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#${chainId}" aria-expanded="false" aria-controls="${chainId}">
                            ${chain.cadena}
                        </button>
                    </h2>
                    <div id="${chainId}" class="accordion-collapse collapse">
                        <div class="accordion-body">
                            <div class="loading-points-${cIndex} text-center py-2">
                                <div class="spinner-border spinner-border-sm text-primary"></div>
                                <span>Cargando puntos...</span>
=======
        
        if (!chains || !chains.length) {
            $container.append(`
                <div class="alert alert-info" role="alert">
                    <i class="bi bi-info-circle" aria-hidden="true"></i> 
                    No hay cadenas en esta región
                </div>
            `);
            return;
        }

        const accordionId = 'chainsAccordionContent';
        const $accordionWrapper = $(`<div class="accordion" id="${accordionId}"></div>`);

        chains.forEach((chain, cIndex) => {
            const chainId = `chain-${cIndex}`;
            const headingId = `heading-${chainId}`;
            
            const $item = $(`
                <div class="accordion-item">
                    <h2 class="accordion-header" id="${headingId}">
                        <button class="accordion-button collapsed" 
                                type="button" 
                                data-bs-toggle="collapse"
                                data-bs-target="#${chainId}" 
                                aria-expanded="false" 
                                aria-controls="${chainId}">
                            <i class="bi bi-shop me-2" aria-hidden="true"></i>
                            ${escapeHtml(chain.cadena)}
                        </button>
                    </h2>
                    <div id="${chainId}" 
                         class="accordion-collapse collapse"
                         aria-labelledby="${headingId}"
                         data-bs-parent="#${accordionId}">
                        <div class="accordion-body">
                            <div class="loading-points-${cIndex} text-center py-3">
                                <div class="spinner-border spinner-border-sm text-primary" role="status">
                                    <span class="visually-hidden">Cargando puntos...</span>
                                </div>
                                <span class="ms-2">Cargando puntos...</span>
>>>>>>> dev
                            </div>
                            <div class="points-list-${cIndex}"></div>
                        </div>
                    </div>
                </div>
            `);

<<<<<<< HEAD
            $(`#${chainId}`).on('shown.bs.collapse', function () {
                loadPointsByChainAndRegion(chain.cadena, region, cIndex);
            });
        });
=======
            // Cargar puntos al abrir el acordeón
            $item.find(`#${chainId}`).on('shown.bs.collapse', function () {
                loadPointsByChainAndRegion(chain.cadena, region, cIndex);
            });

            $accordionWrapper.append($item);
        });

        $container.append($accordionWrapper);
>>>>>>> dev
    }

    function loadPointsByChainAndRegion(cadena, region, cIndex) {
        const $loading = $(`.loading-points-${cIndex}`);
        const $list = $(`.points-list-${cIndex}`);

<<<<<<< HEAD
        if ($list.data('loaded')) return;

        $.getJSON(`/api/client-points-by-region/${encodeURIComponent(region)}`)
            .done(points => {
                const filtered = points.filter(p => p.cadena === cadena);
                $loading.hide();
                $list.data('loaded', true);
                renderPointsButtons(filtered, $list);
            })
            .fail(() => {
                $loading.hide();
                $list.html('<div class="alert alert-danger">Error al cargar puntos</div>');
=======
        // Evitar cargar múltiples veces
        if ($list.data('loaded')) {
            return;
        }

        $.getJSON(`/api/client-points-by-region/${encodeURIComponent(region)}`)
            .done(function(points) {
                const filtered = points.filter(p => p.cadena === cadena);
                $loading.fadeOut(200, function() {
                    $(this).remove();
                    $list.data('loaded', true);
                    renderPointsButtons(filtered, $list);
                });
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error('Error al cargar puntos:', textStatus, errorThrown);
                $loading.fadeOut(200, function() {
                    $(this).remove();
                    $list.html(`
                        <div class="alert alert-danger" role="alert">
                            <i class="bi bi-exclamation-triangle" aria-hidden="true"></i> 
                            Error al cargar puntos
                        </div>
                    `);
                });
>>>>>>> dev
            });
    }

    function renderPointsButtons(points, $container) {
<<<<<<< HEAD
        if (!points.length) {
            $container.html('<div class="alert alert-info"><i class="bi bi-info-circle"></i> No hay puntos en esta cadena</div>');
            return;
        }

        points.forEach(point => {
            $container.append(`
                <button class="btn btn-outline-primary mb-2 me-2"
                        onclick="goToPointPhotos('${point.identificador}')">
                    ${point.punto_de_interes}
                </button>
            `);
        });
    }

    window.goBackToRegions = function () {
        $('#chainsAccordion').hide();
        $('#regions-list').show();
    };

    window.goToPointPhotos = function (pointId) {
        window.location.href = `/punto/${pointId}`;
    };

    function showLoading(selector, message) {
        $(selector).html(`
            <div class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2">${message}</p>
=======
        if (!points || !points.length) {
            $container.html(`
                <div class="alert alert-info" role="alert">
                    <i class="bi bi-info-circle" aria-hidden="true"></i> 
                    No hay puntos en esta cadena
                </div>
            `);
            return;
        }

        const $wrapper = $('<div class="d-flex flex-wrap gap-2"></div>');

        points.forEach((point, index) => {
            const $btn = $(`
                <button class="btn btn-outline-primary" 
                        type="button"
                        data-point-id="${escapeHtml(point.identificador)}"
                        style="animation: fadeIn 0.3s ease ${index * 50}ms both;">
                    <i class="bi bi-geo-alt-fill me-1" aria-hidden="true"></i>
                    ${escapeHtml(point.punto_de_interes)}
                </button>
            `);

            $btn.on('click', function() {
                const pointId = $(this).data('point-id');
                goToPointPhotos(pointId);
            });

            $wrapper.append($btn);
        });

        $container.html($wrapper);
    }

    // Funciones globales
    window.goBackToRegions = function () {
        $('#chainsAccordion').fadeOut(300, function() {
            $(this).hide();
            $('#regions-list').fadeIn(300);
        });
    };

    window.goToPointPhotos = function (pointId) {
        // Mostrar loading antes de navegar
        $('body').append(`
            <div id="pageTransition" class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                 style="background: rgba(255,255,255,0.9); z-index: 9999;">
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    <p class="mt-2 mb-0">Cargando fotos...</p>
                </div>
            </div>
        `);
        
        window.location.href = `/punto/${encodeURIComponent(pointId)}`;
    };

    // Utilidades
    function showLoading(selector, message) {
        $(selector).html(`
            <div class="text-center py-5 w-100">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">${escapeHtml(message)}</span>
                </div>
                <p class="mt-3 mb-0 text-muted">${escapeHtml(message)}</p>
>>>>>>> dev
            </div>
        `);
    }

    function showError(selector, message) {
        $(selector).html(`
<<<<<<< HEAD
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> ${message}
            </div>
        `);
    }
=======
            <div class="alert alert-danger d-flex align-items-center w-100" role="alert">
                <i class="bi bi-exclamation-triangle-fill fs-4 me-3" aria-hidden="true"></i>
                <div>
                    <strong>Error:</strong> ${escapeHtml(message)}
                    <button class="btn btn-outline-danger btn-sm ms-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Reintentar
                    </button>
                </div>
            </div>
        `);
    }

    function escapeHtml(text) {
        if (typeof text !== 'string') return text;
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
>>>>>>> dev
});