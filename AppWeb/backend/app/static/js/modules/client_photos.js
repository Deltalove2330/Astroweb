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
    selectedClienteId: null,  // ✅ NUEVO: Cliente seleccionado por coordinador
    selectedClienteNombre: null  // ✅ NUEVO: Nombre del cliente seleccionado
};

// Inicialización
init();

function init() {
    // ✅ Verificar si es coordinador exclusivo - CORREGIDO CON DEBUG
    $.getJSON('/api/current-user').done(function(userData) {
        console.log('🔍 Datos del usuario actual:', userData); // ¡DEBUG IMPORTANTE!
        // ✅ USAR == EN LUGAR DE === PARA EVITAR PROBLEMAS DE TIPO
        // A veces JSON devuelve números como strings
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
    }).fail(function() {
        console.error('❌ Error al obtener datos del usuario');
        // Si falla, cargar como cliente normal
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
        
        // Determinar qué cliente mostrar
        let clienteId = null;
        let clienteNombre = null;
        
        // ✅ CASO 1: Coordinador exclusivo CON cliente seleccionado
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
            return; // Salir inmediatamente después de cargar
        }
        
        // ✅ CASO 2: Cliente normal o Coordinador SIN selección
        console.log('🔄 Obteniendo datos del usuario actual...');
        $.getJSON('/api/current-user').done(function(userData) {
            console.log('✅ Datos del usuario recibidos:', userData);
            
            // Verificar si es coordinador SIN cliente seleccionado
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
            
            // Verificar si es cliente normal SIN cliente_id
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
            
            // ✅ Cliente normal: usar su propio cliente_id
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
    
    // Actualizar nombre en el modal
    $('#dashboardClientName').text(clienteNombre || 'Dashboard');
    
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('dashboardModal'));
    modal.show();
    
    // Cargar el iframe del dashboard
    loadDashboardIframe(clienteId);
}

function loadDashboardIframe(clienteId) {
    // Mostrar loading
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
    
    // Construir URL para el dashboard
    let url = `/api/client-dashboard`;
    
    // Agregar parámetro de cliente si es necesario
    if (clienteId) {
        url += `?cliente_id=${clienteId}`;
    }
    
    console.log('Loading dashboard from:', url);
    
    // Hacer la petición AJAX
    $.getJSON(url)
        .done(function(response) {
            if (response.success) {
                // Insertar el iframe HTML
                $('#dashboardContainer').html(response.html);
            } else {
                // Mostrar mensaje de error
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
    // Event delegation para las tarjetas de región (clientes normales)
    $('#regions-list').on('click', '.region-card', function () {
        const region = $(this).data('region');
        if (region) {
            loadChainsAccordion(region);
        }
    });

    // ✅ CORREGIDO: Event delegation para tarjetas de cliente Y botones
    $('#regions-list').on('click', '.client-card, .client-button', function(e) {
        // Evitar propagación doble si se hace clic en el botón
        e.stopPropagation();
        
        // Obtener el cliente-card padre (funciona tanto para .client-card como para .client-button)
        const $card = $(this).closest('.client-card');
        const clienteId = $card.data('cliente-id');
        const clienteNombre = $card.data('cliente-nombre');
        
        if (clienteId) {
            selectExclusiveClient(clienteId, clienteNombre);
        }
    });

    // Soporte para teclado (accesibilidad)
    $('#regions-list').on('keydown', '.region-card, .client-card', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });
}

// ✅ NUEVA FUNCIÓN: Cargar clientes exclusivos
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

// ✅ NUEVA FUNCIÓN: Renderizar clientes exclusivos
function renderExclusiveClients(clients) {
    const $container = $('#regions-list');
    $container.empty();
    
    // ✅ ELIMINAR ALERTA ANTERIOR ANTES DE AGREGAR LA NUEVA
    $('.client-count-alert').remove(); // <-- ¡CRUCIAL!
    
    // ✅ Cambiar título para coordinadores
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
    
    // ✅ Mostrar contador de clientes CON CLASE ESPECÍFICA
    $('#regions-list').before(`
    <div class="alert alert-primary text-center client-count-alert"> <!-- ✅ CLASE ÚNICA -->
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
    
    // ✅ Agregar estilos para las tarjetas de cliente
    addClientCardStyles();
}

// ✅ NUEVA FUNCIÓN: Seleccionar cliente exclusivo
// static/js/modules/client_photos.js

function selectExclusiveClient(clienteId, clienteNombre) {
    console.log('🎯 selectExclusiveClient llamado');
    console.log('   Cliente ID (antes):', clienteId, '(Tipo:', typeof clienteId, ')');
    
    // ✅ CONVERTIR A NÚMERO
    clienteId = parseInt(clienteId);
    
    console.log('   Cliente ID (después):', clienteId, '(Tipo:', typeof clienteId, ')');
    console.log('   Cliente Nombre:', clienteNombre);
    
    state.selectedClienteId = clienteId;
    state.selectedClienteNombre = clienteNombre;
    
    showClientBreadcrumb(clienteNombre);
    
    console.log('🔄 Llamando a loadRegionsForClient con ID:', clienteId);
    loadRegionsForClient(clienteId);
}

// ✅ NUEVA FUNCIÓN: Mostrar breadcrumb del cliente seleccionado
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
    
    // Insertar antes del título de regiones
    $('.section-title').parent().before(breadcrumbHtml);
    
    // ✅ Cambiar título
    $('.section-title').text('📍 Selecciona una Región');
}

// ✅ NUEVA FUNCIÓN: Limpiar selección de cliente
window.clearClientSelection = function() {
    state.selectedClienteId = null;
    state.selectedClienteNombre = null;
    
    // ✅ Remover breadcrumb
    $('.alert.alert-success').remove();
    
    // ✅ ELIMINAR ALERTA DE CONTADOR ANTES DE RECARGAR
    $('.client-count-alert').remove(); // <-- ¡EVITA DUPLICADOS!
    
    // ✅ Recargar lista de clientes
    loadExclusiveClients();
};

// ✅ NUEVA FUNCIÓN: Cargar regiones para un cliente específico
function loadRegionsForClient(clienteId) {
    console.log('📡 loadRegionsForClient - Iniciando carga');
    console.log('   Cliente ID recibido:', clienteId);
    console.log('   Tipo de clienteId:', typeof clienteId);
    
    // ✅ Validar que el ID sea válido
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
        console.log('   Tipo de respuesta:', typeof regions);
        console.log('   Número de regiones:', Array.isArray(regions) ? regions.length : 'No es array');
        
        if (Array.isArray(regions)) {
            console.log('📊 Regiones recibidas:', regions);
        } else {
            console.warn('⚠️ Respuesta no es un array:', regions);
        }
        
        renderRegions(regions);
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        clearTimeout(timeoutId);
        console.error('❌ Error en la solicitud AJAX:');
        console.error('   Status:', textStatus);
        console.error('   Error:', errorThrown);
        console.error('   Response:', jqXHR.responseText);
        
        showError('#regions-list', 'Error al cargar regiones. Por favor, intenta de nuevo.');
    });
}

function loadRegions() {
    // ✅ Si es coordinador y ya seleccionó cliente, usar esa función
    if (state.selectedClienteId) {
        loadRegionsForClient(state.selectedClienteId);
        return;
    }
    
    // ✅ Si es coordinador pero no ha seleccionado cliente, mostrar mensaje
    if (current_user_is_coordinador_exclusivo) {
        $('#regions-list').html(`
            <div class="alert alert-warning text-center w-100" role="alert">
                <i class="bi bi-exclamation-triangle fs-1" aria-hidden="true"></i>
                <p class="mt-2 mb-0">Por favor, selecciona un cliente exclusivo primero</p>
            </div>
        `);
        return;
    }
    
    // Cliente normal
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
        
        // ✅ Construir URL con filtro de cliente si es coordinador
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
        
        // Cargar puntos al abrir el acordeón
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
    
    // Evitar cargar múltiples veces
    if ($list.data('loaded')) {
        return;
    }
    
    // ✅ Construir URL con filtro de cliente si es coordinador
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
    // ✅ Si es coordinador, pasar el cliente_id como parámetro
    let url = `/punto/${encodeURIComponent(pointId)}`;
    if (state.selectedClienteId) {
        url += `?cliente_id=${state.selectedClienteId}`;
    }
    
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
 
    window.location.href = url;
};

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

// ✅ NUEVA FUNCIÓN: Agregar estilos para tarjetas de cliente
function addClientCardStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .client-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 16px;
            padding: 2rem;
            margin: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            color: white;
            min-width: 280px;
            flex: 1;
        }
        
        .client-card:hover {
            transform: translateY(-5px) scale(1.02);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
        }
        
        .client-card:focus {
            outline: 3px solid #fff;
            outline-offset: 2px;
        }
        
        .client-card-content {
            text-align: center;
        }
        
        .client-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
        }
        
        .client-title {
            font-size: 1.3rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: white;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .client-button {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid white;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .client-button:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateX(5px);
        }
        
        .client-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            padding: 1rem;
        }
        
        @media (max-width: 768px) {
            .client-card {
                min-width: 100%;
                margin: 0.5rem 0;
            }
            
            .client-grid {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    // Remover estilos anteriores si existen
    $('#client-card-styles').remove();
    
    style.id = 'client-card-styles';
    document.head.appendChild(style);
    
    // ✅ Aplicar clase grid al contenedor
    $('#regions-list').addClass('client-grid');
}
}); // ✅ LLAVE DE CIERRE AÑADIDA AQUÍ