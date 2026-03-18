// static/js/modules/client_photos.js
let current_user_is_coordinador_exclusivo = false;

$(document).ready(function () {
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

// Estado de la aplicación
const state = {
    selectedClienteId: null,
    selectedClienteNombre: null
};

// Inicialización
init();

// ✅ REEMPLAZAR POR:
function init() {
    $.ajax({
        url: '/api/current-user',
        method: 'GET',
        dataType: 'json',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }).done(function(userData) {
        console.log('🔍 Datos del usuario actual:', userData);
        if (userData.id_rol == 3 || userData.id_rol == "3") {
            current_user_is_coordinador_exclusivo = true;
            console.log('✅ ES COORDINADOR EXCLUSIVO - Cargando lista de clientes');
            loadExclusiveClients();
        } else {
            console.log('👤 ES CLIENTE NORMAL - Cargando regiones directamente');
            loadRegions();
        }
        setupEventListeners();
        setupDashboardButton();
    }).fail(function(jqXHR) {
        if (jqXHR.status === 401 || jqXHR.status === 0) {
            // Sesión expirada o sin autorización — redirigir a login
            window.location.href = '/login';
            return;
        }
        console.error('❌ Error al obtener datos del usuario:', jqXHR.status);
        loadRegions();
        setupEventListeners();
        setupDashboardButton();
    });
}

function setupDashboardButton() {
    $('#dataBtn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        console.log('🎯 Dashboard button clicked');
        console.log('   selectedClienteId:', state.selectedClienteId);
        console.log('   selectedClienteNombre:', state.selectedClienteNombre);

        let clienteId = null;
        let clienteNombre = null;

        if (state.selectedClienteId) {
            console.log('✅ Coordinador con cliente seleccionado');
            clienteId = state.selectedClienteId;
            clienteNombre = state.selectedClienteNombre;

            if (!clienteId || isNaN(clienteId)) {
                console.error('❌ Cliente ID inválido:', clienteId);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'ID de cliente inválido. Por favor, selecciona un cliente nuevamente.',
                    confirmButtonColor: '#667eea'
                });
                return;
            }

            console.log(`✅ Cargando dashboard para cliente ID: ${clienteId} (${clienteNombre})`);
            loadDashboardModal(clienteId, clienteNombre);
            return;
        }

        console.log('🔄 Obteniendo datos del usuario actual...');
        $.getJSON('/api/current-user').done(function(userData) {
            console.log('✅ Datos del usuario recibidos:', userData);

            if (current_user_is_coordinador_exclusivo && !userData.cliente_id) {
                console.warn('⚠️ Coordinador sin cliente seleccionado');
                $('#dashboardClientName').text('Seleccione un cliente primero');
                const modal = new bootstrap.Modal(document.getElementById('dashboardModal'));
                modal.show();

                $('#dashboardContainer').html(`
                    <div class="alert alert-warning text-center m-3">
                        <i class="bi bi-exclamation-triangle fs-1 mb-3"></i>
                        <h5>Selecciona un cliente primero</h5>
                        <p class="mb-0">Como coordinador exclusivo, debes seleccionar un cliente para ver su dashboard.</p>
                        <button class="btn btn-primary mt-3" onclick="location.reload()">
                            <i class="bi bi-arrow-clockwise me-1"></i> Volver a seleccionar
                        </button>
                    </div>
                `);
                return;
            }

            if (!userData.cliente_id) {
                console.error('❌ Usuario sin cliente_id asociado');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No tienes un cliente asociado. Contacta al administrador.',
                    confirmButtonColor: '#667eea'
                });
                return;
            }

            clienteId = userData.cliente_id;
            clienteNombre = userData.cliente_nombre || 'Cliente';

            console.log(`✅ Cargando dashboard para cliente ID: ${clienteId} (${clienteNombre})`);
            loadDashboardModal(clienteId, clienteNombre);

        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('❌ Error al obtener datos del usuario:', textStatus, errorThrown);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar tus datos. Intenta nuevamente.',
                confirmButtonColor: '#667eea'
            });
        });
    });
}

function loadDashboardModal(clienteId, clienteNombre) {
    console.log(`Loading dashboard for client: ${clienteNombre} (ID: ${clienteId})`);
    $('#dashboardClientName').text(clienteNombre || 'Dashboard');
    const modal = new bootstrap.Modal(document.getElementById('dashboardModal'));
    modal.show();
    loadDashboardIframe(clienteId);
}

function loadDashboardIframe(clienteId) {
    $('#dashboardContainer').html(`
        <div class="d-flex justify-content-center align-items-center h-100">
            <div class="text-center">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando dashboard...</span>
                </div>
                <p class="mt-2">Cargando dashboard...</p>
            </div>
        </div>
    `);

    let url = `/api/client-dashboard`;
    if (clienteId) {
        url += `?cliente_id=${clienteId}`;
    }

    console.log('Loading dashboard from:', url);

    $.getJSON(url)
        .done(function(response) {
            if (response.success) {
                $('#dashboardContainer').html(response.html);
            } else {
                $('#dashboardContainer').html(`
                    <div class="alert alert-info m-3">
                        <i class="bi bi-info-circle me-2"></i>
                        ${response.message || 'No hay dashboard configurado para este cliente.'}
                    </div>
                `);
            }
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Error loading dashboard:', textStatus, errorThrown);
            $('#dashboardContainer').html(`
                <div class="alert alert-danger m-3">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar el dashboard. Por favor, intenta de nuevo.
                </div>
            `);
        });
}

function setupEventListeners() {
    $('#regions-list').on('click', '.region-card', function () {
        const region = $(this).data('region');
        if (region) {
            loadChainsAccordion(region);
        }
    });

    $('#regions-list').on('click', '.client-card, .client-button', function(e) {
        e.stopPropagation();
        const $card = $(this).closest('.client-card');
        const clienteId = $card.data('cliente-id');
        const clienteNombre = $card.data('cliente-nombre');
        if (clienteId) {
            selectExclusiveClient(clienteId, clienteNombre);
        }
    });

    $('#regions-list').on('keydown', '.region-card, .client-card', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });
}

function loadExclusiveClients() {
    showLoading('#regions-list', 'Cargando clientes exclusivos...');

    const timeoutId = setTimeout(() => {
        showError('#regions-list', 'La carga está tardando más de lo esperado...');
    }, CONFIG.loadingTimeout);

    $.getJSON('/api/client-exclusive-clients')
    .done(function(clients) {
        clearTimeout(timeoutId);
        renderExclusiveClients(clients);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        clearTimeout(timeoutId);
        console.error('Error al cargar clientes exclusivos:', textStatus, errorThrown);
        showError('#regions-list', 'Error al cargar clientes. Por favor, intenta de nuevo.');
    });
}

function renderExclusiveClients(clients) {
    const $container = $('#regions-list');
    $container.empty();

    $('.client-count-alert').remove();
    $('.section-title').text('👥 Selecciona un Cliente Exclusivo');

    if (!clients || !clients.length) {
        $container.html(`
        <div class="alert alert-info text-center w-100" role="alert">
            <i class="bi bi-info-circle fs-1" aria-hidden="true"></i>
            <p class="mt-2 mb-0">No hay clientes exclusivos disponibles</p>
        </div>
        `);
        return;
    }

    $('#regions-list').before(`
    <div class="alert alert-primary text-center client-count-alert">
        <strong>${clients.length}</strong> clientes exclusivos disponibles
    </div>
    `);

    clients.forEach((client, index) => {
        const delay = index * CONFIG.animationDelay;
        const $card = $(`
        <div class="client-card"
            data-cliente-id="${escapeHtml(client.id_cliente)}"
            data-cliente-nombre="${escapeHtml(client.cliente)}"
            role="listitem"
            tabindex="0"
            aria-label="Cliente ${escapeHtml(client.cliente)}"
            style="animation-delay: ${delay}ms;">
            <div class="client-card-content">
                <span class="client-icon" aria-hidden="true">🏢</span>
                <h3 class="client-title">${escapeHtml(client.cliente)}</h3>
                <button class="client-button"
                    type="button"
                    aria-label="Ver regiones de ${escapeHtml(client.cliente)}">
                    Ver Regiones
                    <span class="arrow-icon" aria-hidden="true"></span>
                </button>
            </div>
        </div>
        `);
        $container.append($card);
    });

    addClientCardStyles();
}

function selectExclusiveClient(clienteId, clienteNombre) {
    console.log('🎯 selectExclusiveClient llamado');
    console.log('   Cliente ID (antes):', clienteId, '(Tipo:', typeof clienteId, ')');

    clienteId = parseInt(clienteId);

    console.log('   Cliente ID (después):', clienteId, '(Tipo:', typeof clienteId, ')');
    console.log('   Cliente Nombre:', clienteNombre);

    state.selectedClienteId = clienteId;
    state.selectedClienteNombre = clienteNombre;

    showClientBreadcrumb(clienteNombre);

    console.log('🔄 Llamando a loadRegionsForClient con ID:', clienteId);
    loadRegionsForClient(clienteId);
}

function showClientBreadcrumb(clienteNombre) {
    const breadcrumbHtml = `
    <div class="alert alert-success d-flex align-items-center justify-content-between" role="alert">
        <div>
            <i class="bi bi-building me-2"></i>
            <strong>Cliente seleccionado:</strong> ${escapeHtml(clienteNombre)}
        </div>
        <button class="btn btn-sm btn-outline-light" onclick="clearClientSelection()">
            <i class="bi bi-x-circle me-1"></i> Cambiar cliente
        </button>
    </div>
    `;

    $('.section-title').parent().before(breadcrumbHtml);
    $('.section-title').text('📍 Selecciona una Región');
}

window.clearClientSelection = function() {
    state.selectedClienteId = null;
    state.selectedClienteNombre = null;
    $('.alert.alert-success').remove();
    $('.client-count-alert').remove();
    loadExclusiveClients();
};

function loadRegionsForClient(clienteId) {
    console.log('📡 loadRegionsForClient - Iniciando carga');
    console.log('   Cliente ID recibido:', clienteId);
    console.log('   Tipo de clienteId:', typeof clienteId);

    if (!clienteId || clienteId === 'null' || clienteId === 'undefined') {
        console.error('❌ Cliente ID inválido:', clienteId);
        showError('#regions-list', 'ID de cliente inválido');
        return;
    }

    const url = `/api/client-regions?cliente_id=${clienteId}`;
    console.log('🌐 URL de solicitud:', url);

    showLoading('#regions-list', 'Cargando regiones...');

    const timeoutId = setTimeout(() => {
        console.warn('⚠️ Timeout: La carga está tardando más de lo esperado');
        showError('#regions-list', 'La carga está tardando más de lo esperado...');
    }, CONFIG.loadingTimeout);

    $.getJSON(url)
    .done(function(regions) {
        clearTimeout(timeoutId);
        console.log('✅ Respuesta recibida del backend:', regions);
        renderRegions(regions);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        clearTimeout(timeoutId);
        console.error('❌ Error en la solicitud AJAX:', textStatus, errorThrown);
        showError('#regions-list', 'Error al cargar regiones. Por favor, intenta de nuevo.');
    });
}

function loadRegions() {
    if (state.selectedClienteId) {
        loadRegionsForClient(state.selectedClienteId);
        return;
    }

    if (current_user_is_coordinador_exclusivo) {
        $('#regions-list').html(`
            <div class="alert alert-warning text-center w-100" role="alert">
                <i class="bi bi-exclamation-triangle fs-1" aria-hidden="true"></i>
                <p class="mt-2 mb-0">Por favor, selecciona un cliente exclusivo primero</p>
            </div>
        `);
        return;
    }

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
}

function renderRegions(regions) {
    const $container = $('#regions-list');
    $container.empty();

    if (!regions || !regions.length) {
        $container.html(`
        <div class="alert alert-info text-center w-100" role="alert">
            <i class="bi bi-info-circle fs-1" aria-hidden="true"></i>
            <p class="mt-2 mb-0">No hay regiones disponibles</p>
        </div>
        `);
        return;
    }

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
    });
}

function loadChainsAccordion(region) {
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

        let url = `/api/client-chains-by-region/${encodeURIComponent(region)}`;
        if (state.selectedClienteId) {
            url += `?cliente_id=${state.selectedClienteId}`;
        }

        $.getJSON(url)
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
}

function renderChainsAccordion(chains, region) {
    const $container = $('#chainsAccordion');

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
                    </div>
                    <div class="points-list-${cIndex}"></div>
                </div>
            </div>
        </div>
        `);

        $item.find(`#${chainId}`).on('shown.bs.collapse', function () {
            loadPointsByChainAndRegion(chain.cadena, region, cIndex);
        });

        $accordionWrapper.append($item);
    });

    $container.append($accordionWrapper);
}

function loadPointsByChainAndRegion(cadena, region, cIndex) {
    const $loading = $(`.loading-points-${cIndex}`);
    const $list = $(`.points-list-${cIndex}`);

    if ($list.data('loaded')) {
        return;
    }

    let url = `/api/client-points-by-region/${encodeURIComponent(region)}`;
    if (state.selectedClienteId) {
        url += `?cliente_id=${state.selectedClienteId}`;
    }

    $.getJSON(url)
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
    });
}

// ============================================================
// RENDER PUNTOS — Grid ordenado con filtro (única función modificada)
// ============================================================
function renderPointsButtons(points, $container) {
    if (!points || !points.length) {
        $container.html(`
        <div class="alert alert-info" role="alert">
            <i class="bi bi-info-circle" aria-hidden="true"></i>
            No hay puntos en esta cadena
        </div>
        `);
        return;
    }

    // Ordenar A-Z
    points.sort((a, b) => (a.punto_de_interes || '').localeCompare(b.punto_de_interes || ''));

    // ID único para este bloque (soporta múltiples cadenas abiertas)
    const uid = 'pts-' + Math.random().toString(36).slice(2, 8);

    let cardsHtml = '';
    points.forEach(function(point, i) {
        cardsHtml += `
            <a href="javascript:void(0)"
               class="cp-point-card"
               data-point-id="${escapeHtml(String(point.identificador))}"
               data-nombre="${escapeHtml((point.punto_de_interes || '').toLowerCase())}"
               title="${escapeHtml(point.punto_de_interes || '')}"
               style="animation-delay:${i * 25}ms;">
                <div class="cp-point-icon">
                    <i class="bi bi-geo-alt-fill"></i>
                </div>
                <span class="cp-point-name">${escapeHtml(point.punto_de_interes || '')}</span>
                <i class="bi bi-chevron-right cp-point-arrow"></i>
            </a>
        `;
    });

    $container.html(`
        <div class="cp-wrapper">
            <div class="cp-filter-wrap">
                <i class="bi bi-search cp-filter-icon"></i>
                <input type="search"
                       class="cp-filter-input"
                       id="${uid}-input"
                       placeholder="Buscar entre ${points.length} punto${points.length !== 1 ? 's' : ''}..."
                       autocomplete="off"
                       spellcheck="false">
                <button class="cp-filter-clear" id="${uid}-clear" title="Limpiar búsqueda">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <p class="cp-count" id="${uid}-count"></p>
            <div class="cp-grid" id="${uid}-grid">
                ${cardsHtml}
            </div>
            <div class="cp-nores" id="${uid}-nores">
                <i class="bi bi-search"></i>
                Sin resultados para tu búsqueda
            </div>
        </div>
    `);

    // Inyectar estilos una sola vez
    injectPointGridStyles();

    const $input = $(`#${uid}-input`);
    const $clear = $(`#${uid}-clear`);
    const $grid  = $(`#${uid}-grid`);
    const $nores = $(`#${uid}-nores`);
    const $count = $(`#${uid}-count`);

    $input.on('input', function() {
        const term = $(this).val().trim().toLowerCase();
        $clear.toggleClass('visible', term.length > 0);

        let visible = 0;
        $grid.find('.cp-point-card').each(function() {
            const nombre = $(this).data('nombre') || '';
            const show   = !term || nombre.includes(term);
            $(this).toggleClass('cp-hidden', !show);
            if (show) visible++;
        });

        const total = $grid.find('.cp-point-card').length;
        $nores.toggleClass('visible', visible === 0 && term.length > 0);

        if (term) {
            $count.text(`${visible} de ${total} punto${total !== 1 ? 's' : ''}`).addClass('visible');
        } else {
            $count.text('').removeClass('visible');
        }
    });

    $clear.on('click', function() {
        $input.val('').trigger('input').focus();
    });

    $grid.on('click', '.cp-point-card', function() {
        goToPointPhotos($(this).data('point-id'));
    });
}

function injectPointGridStyles() {
    if ($('#cp-grid-styles').length) return;

    const css = `
        .cp-wrapper { padding: 4px 2px 8px; }

        .cp-filter-wrap { position: relative; margin-bottom: 6px; }
        .cp-filter-icon {
            position: absolute; left: 11px; top: 50%;
            transform: translateY(-50%);
            color: #adb5bd; font-size: 0.82rem; pointer-events: none;
        }
        .cp-filter-input {
            width: 100%; height: 38px; padding: 0 34px 0 32px;
            border: 1.5px solid #dee2e6; border-radius: 10px;
            background: #f8f9fa; font-size: 0.84rem;
            color: #343a40; font-family: inherit; outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .cp-filter-input:focus {
            border-color: #667eea; background: #fff;
            box-shadow: 0 0 0 3px rgba(102,126,234,0.12);
        }
        .cp-filter-input::placeholder { color: #adb5bd; }
        .cp-filter-clear {
            position: absolute; right: 9px; top: 50%;
            transform: translateY(-50%);
            background: none; border: none; color: #adb5bd;
            cursor: pointer; font-size: 0.78rem;
            padding: 3px 5px; border-radius: 4px;
            line-height: 1; display: none; transition: color 0.15s;
        }
        .cp-filter-clear.visible { display: flex; align-items: center; }
        .cp-filter-clear:hover { color: #6c757d; }

        .cp-count {
            font-size: 0.74rem; color: #6c757d; font-weight: 500;
            margin: 0 0 8px; display: none;
        }
        .cp-count.visible { display: block; }

        .cp-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
            gap: 7px;
        }

        .cp-point-card {
            display: flex; align-items: center; gap: 9px;
            padding: 9px 12px;
            background: #fff; border: 1.5px solid #e9ecef; border-radius: 10px;
            text-decoration: none; color: #2c3e50; cursor: pointer; min-width: 0;
            transition: border-color 0.18s, box-shadow 0.18s, transform 0.15s;
            animation: cpFadeUp 0.3s ease both;
        }
        @keyframes cpFadeUp {
            from { opacity: 0; transform: translateY(5px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        .cp-point-card:hover {
            border-color: #667eea;
            box-shadow: 0 4px 12px rgba(102,126,234,0.15);
            transform: translateY(-1px);
            text-decoration: none; color: #2c3e50;
        }
        .cp-point-card.cp-hidden { display: none; }

        .cp-point-icon {
            width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex; align-items: center; justify-content: center;
            color: #fff; font-size: 0.8rem;
        }

        .cp-point-name {
            flex: 1; font-size: 0.82rem; font-weight: 600; line-height: 1.3;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            color: #2c3e50; transition: color 0.15s;
        }
        .cp-point-card:hover .cp-point-name { color: #667eea; }

        .cp-point-arrow {
            font-size: 0.68rem; color: #ced4da; flex-shrink: 0;
            transition: color 0.15s, transform 0.15s;
        }
        .cp-point-card:hover .cp-point-arrow { color: #667eea; transform: translateX(2px); }

        .cp-nores {
            display: none; padding: 18px; text-align: center;
            color: #adb5bd; font-size: 0.84rem;
            border: 1.5px dashed #dee2e6; border-radius: 10px; margin-top: 6px;
        }
        .cp-nores i { display: block; font-size: 1.3rem; margin-bottom: 6px; }
        .cp-nores.visible { display: block; }

        @media (max-width: 768px) {
            .cp-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 6px; }
        }
        @media (max-width: 480px) {
            .cp-grid { grid-template-columns: 1fr 1fr; gap: 6px; }
        }
        @media (max-width: 360px) {
            .cp-grid { grid-template-columns: 1fr; }
        }
    `;

    $('<style id="cp-grid-styles"></style>').text(css).appendTo('head');
}

// ============================================================
// Funciones globales
// ============================================================
window.goBackToRegions = function () {
    $('#chainsAccordion').fadeOut(300, function() {
        $(this).hide();
        $('#regions-list').fadeIn(300);
    });
};

window.goToPointPhotos = function (pointId) {
    let url = `/punto/${encodeURIComponent(pointId)}`;
    if (state.selectedClienteId) {
        url += `?cliente_id=${state.selectedClienteId}`;
    }

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

    window.location.href = url;
};

window.refreshDashboard = function() {
    const $iframe = $('#dashboardContainer iframe');
    if ($iframe.length) $iframe[0].src = $iframe[0].src;
};

// ============================================================
// Utilidades
// ============================================================
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

function addClientCardStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .client-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px; padding: 2rem; margin: 1rem;
            cursor: pointer; transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            color: white; min-width: 280px; flex: 1;
        }
        .client-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }
        .client-card:focus { outline: 3px solid #fff; outline-offset: 2px; }
        .client-card-content { text-align: center; }
        .client-icon { font-size: 3rem; margin-bottom: 1rem; display: block; }
        .client-title {
            font-size: 1.3rem; font-weight: 600; margin-bottom: 1.5rem;
            color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .client-button {
            background: rgba(255, 255, 255, 0.2); border: 2px solid white;
            color: white; padding: 0.75rem 1.5rem; border-radius: 50px;
            font-weight: 600; transition: all 0.3s ease;
        }
        .client-button:hover { background: rgba(255, 255, 255, 0.3); transform: translateX(5px); }
        .client-grid {
            display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem; padding: 1rem;
        }
        @media (max-width: 768px) {
            .client-card { min-width: 100%; margin: 0.5rem 0; }
            .client-grid { grid-template-columns: 1fr; }
        }
    `;

    $('#client-card-styles').remove();
    style.id = 'client-card-styles';
    document.head.appendChild(style);

    $('#regions-list').addClass('client-grid');
}

}); // fin document.ready