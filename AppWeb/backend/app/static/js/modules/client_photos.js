// static/js/modules/client_photos.js
$(document).ready(function () {
    loadRegions();

    function loadRegions() {
        showLoading('#regions-list', 'Cargando regiones...');
        $.getJSON('/api/client-regions')
            .done(renderRegions)
            .fail(() => showError('#regions-list', 'Error al cargar regiones'));
    }

    function renderRegions(regions) {
        const $container = $('#regions-list');
        $container.empty();

        if (!regions.length) {
            $container.html(`
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle fs-1"></i>
                    <p class="mt-2 mb-0">No hay regiones disponibles</p>
                </div>
            `);
            return;
        }

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
        });
    }

    function loadChainsAccordion(region) {
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
    }

    function renderChainsAccordion(chains, region) {
        const $container = $('#chainsAccordion');
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
                            </div>
                            <div class="points-list-${cIndex}"></div>
                        </div>
                    </div>
                </div>
            `);

            $(`#${chainId}`).on('shown.bs.collapse', function () {
                loadPointsByChainAndRegion(chain.cadena, region, cIndex);
            });
        });
    }

    function loadPointsByChainAndRegion(cadena, region, cIndex) {
        const $loading = $(`.loading-points-${cIndex}`);
        const $list = $(`.points-list-${cIndex}`);

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
            });
    }

    function renderPointsButtons(points, $container) {
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
});