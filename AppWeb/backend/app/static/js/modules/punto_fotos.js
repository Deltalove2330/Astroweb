<<<<<<< HEAD
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
=======
// static/js/modules/punto_fotos.js

$(document).ready(function () {
    'use strict';
    
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
        visitasData: {}
    };

    console.log('🚀 Iniciando módulo punto_fotos');
    console.log('📍 Punto ID:', state.pointId);

    // Inicialización
    init();

    function init() {
        testData();
        loadVisitasList();
        loadPhotos();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Filtros
        $('#applyFiltersBtn').on('click', loadPhotos);
        $('#clearFiltersBtn').on('click', clearFilters);

        // Acciones de foto
        $('#approvePhotoBtn').on('click', approvePhoto);
        $('#showRejectionModal').on('click', showRejectionModal);
        $('#rejectPhotoBtn').on('click', rejectPhoto);
    }

    // Prueba de datos
    function testData() {
        console.log('🔍 Iniciando prueba de datos...');
        $.getJSON(`/api/test-point-photos/${state.pointId}`)
            .done(function(data) {
                console.log('✅ Datos de prueba recibidos:', data);
                if (data.total_fotos > 0) {
                    console.log(`✅ Hay ${data.total_fotos} fotos disponibles`);
>>>>>>> dev
                } else {
                    console.log('⚠️ No hay datos en la prueba');
                }
            })
            .fail(function(err) {
                console.error('❌ Error en prueba:', err);
            });
    }

<<<<<<< HEAD
    // Ejecutar prueba
    testData();

    // Cargar lista de visitas para el filtro
    function loadVisitasList() {
        console.log('Cargando lista de visitas...');
        $.getJSON(`/api/point-visitas/${pointId}`)
=======
    // Cargar lista de visitas para el filtro
    function loadVisitasList() {
        console.log('📋 Cargando lista de visitas...');
        $.getJSON(`/api/point-visitas/${state.pointId}`)
>>>>>>> dev
            .done(function(visitas) {
                console.log('✅ Lista de visitas recibida:', visitas);
                const $select = $('#filter-visita');
                $select.empty();
                $select.append('<option value="">Todas las visitas</option>');
                
<<<<<<< HEAD
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

=======
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

>>>>>>> dev
    function loadPhotos() {
        const params = {
            fecha_inicio: $('#filter-fecha-inicio').val(),
            fecha_fin: $('#filter-fecha-fin').val(),
            prioridad: $('#filter-prioridad').val(),
            id_visita: $('#filter-visita').val()
        };

<<<<<<< HEAD
        console.log('🔍 Parámetros de filtro:', params);

        const query = new URLSearchParams(params).toString();
        const url = `/api/client-point-photos/${pointId}${query ? '?' + query : ''}`;
=======
        // Limpiar parámetros vacíos
        Object.keys(params).forEach(key => {
            if (!params[key]) delete params[key];
        });

        console.log('🔍 Parámetros de filtro:', params);

        const query = new URLSearchParams(params).toString();
        const url = `/api/client-point-photos/${state.pointId}${query ? '?' + query : ''}`;
>>>>>>> dev
        
        console.log('🌐 URL de solicitud:', url);

        showLoading('#photos-list', 'Cargando visitas y fotos...');

<<<<<<< HEAD
        $.getJSON(url)
            .done(function(visitas) {
                console.log('✅ Datos recibidos del backend:', visitas);
                if (visitas && Array.isArray(visitas)) {
                    console.log(`📊 Total de visitas recibidas: ${visitas.length}`);
                    visitas.forEach((visita, idx) => {
                        console.log(`Visita ${idx}: #${visita.id_visita}, Fotos: ${visita.total_fotos || 0}`);
=======
        const timeoutId = setTimeout(() => {
            console.warn('⚠️ La carga está tardando más de lo esperado');
        }, CONFIG.loadingTimeout);

        $.getJSON(url)
            .done(function(visitas) {
                clearTimeout(timeoutId);
                console.log('✅ Datos recibidos del backend:', visitas);
                
                if (visitas && Array.isArray(visitas)) {
                    console.log(`📊 Total de visitas recibidas: ${visitas.length}`);
                    visitas.forEach((visita, idx) => {
                        console.log(`  Visita ${idx}: #${visita.id_visita}, Fotos: ${visita.total_fotos || 0}`);
>>>>>>> dev
                    });
                    renderVisitas(visitas);
                } else {
                    console.error('❌ Datos no son un array:', visitas);
                    showError('#photos-list', 'Error en el formato de datos recibidos');
                }
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
<<<<<<< HEAD
                console.error('❌ Error cargando fotos:', textStatus, errorThrown);
                console.error('Detalles de error:', jqXHR.responseText);
                showError('#photos-list', 'Error al cargar fotos. Revisa la consola para más detalles.');
            });
    }

=======
                clearTimeout(timeoutId);
                console.error('❌ Error cargando fotos:', textStatus, errorThrown);
                console.error('Detalles de error:', jqXHR.responseText);
                showError('#photos-list', 'Error al cargar fotos. Por favor, intenta de nuevo.');
            });
    }

    function clearFilters() {
        $('#filter-fecha-inicio, #filter-fecha-fin').val('');
        $('#filter-prioridad, #filter-visita').val('');
        loadPhotos();
    }

>>>>>>> dev
    function renderVisitas(visitas) {
        const $container = $('#photos-list');
        $container.empty();

        console.log('🎨 Renderizando visitas:', visitas.length);

        if (!visitas || visitas.length === 0) {
            console.log('ℹ️ No hay visitas para mostrar');
            $container.html(`
<<<<<<< HEAD
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle"></i> No hay visitas disponibles para este punto
=======
                <div class="alert alert-info text-center w-100" role="alert">
                    <i class="bi bi-info-circle fs-1" aria-hidden="true"></i>
                    <p class="mt-2 mb-0">No hay visitas disponibles para este punto</p>
                    <button class="btn btn-outline-primary btn-sm mt-3" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Recargar
                    </button>
>>>>>>> dev
                </div>
            `);
            return;
        }

        visitas.forEach((visita, index) => {
            console.log(`🔄 Procesando visita ${index}:`, visita);
            
            const fechaFormateada = formatDate(visita.fecha_visita);
            const totalFotos = visita.total_fotos || 0;
            const mercaderista = visita.mercaderista || 'Sin nombre';
            
<<<<<<< HEAD
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
=======
            // Guardar datos de visita
            state.visitasData[`visita_${index}`] = visita;
            
            const visitaCard = `
                <div class="card mb-3 shadow-sm border-0 visita-card"
                     id="visita-${index}"
                     style="animation: fadeIn 0.4s ease ${index * CONFIG.animationDelay}ms both;">
                    <div class="card-header bg-primary text-white d-flex flex-wrap justify-content-between align-items-center py-3 gap-2"
                         onclick="toggleVisita(${index})"
                         role="button"
                         tabindex="0"
                         aria-expanded="false"
                         aria-controls="visita-content-${index}"
                         style="cursor: pointer;">
                        <div class="flex-grow-1">
                            <h5 class="mb-0 d-flex align-items-center flex-wrap gap-2">
                                <i class="bi bi-calendar-check" aria-hidden="true"></i>
                                <span>Visita #${escapeHtml(visita.id_visita)}</span>
                                <!-- BOTÓN DE CHAT -->
                                <button class="btn-chat-visita" 
                                        onclick="openChatModal(${visita.id_visita}, event)"
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
                            <i class="bi bi-chevron-down toggle-icon fs-4" id="toggle-icon-${index}" aria-hidden="true"></i>
>>>>>>> dev
                        </div>
                    </div>
                    <div class="card-body p-0" id="visita-content-${index}" style="display: none;">
                        <div class="text-center py-4">
<<<<<<< HEAD
                            <div class="spinner-border text-primary spinner-border-sm"></div>
                            <p class="mt-2">Cargando fotos...</p>
=======
                            <div class="spinner-border text-primary spinner-border-sm" role="status">
                                <span class="visually-hidden">Cargando fotos...</span>
                            </div>
                            <p class="mt-2 mb-0 small">Cargando fotos...</p>
>>>>>>> dev
                        </div>
                    </div>
                </div>
            `;
            
            $container.append(visitaCard);
<<<<<<< HEAD
            window[`visitaData_${index}`] = visita; // Guardar datos en variable global
=======
        });

        // Añadir soporte de teclado
        $('.visita-card .card-header').on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
>>>>>>> dev
        });

        console.log('✅ Todas las visitas renderizadas');
    }

    // Función global para toggle de visita
    window.toggleVisita = function(index) {
        console.log(`🔄 Toggle visita ${index}`);
        const $content = $(`#visita-content-${index}`);
        const $icon = $(`#toggle-icon-${index}`);
<<<<<<< HEAD
        const visitaData = window[`visitaData_${index}`];
        
        if ($content.find('.categoria-section').length === 0) {
=======
        const $header = $content.prev('.card-header');
        const visitaData = state.visitasData[`visita_${index}`];
        
        if ($content.find('.categoria-section').length === 0 && visitaData) {
>>>>>>> dev
            console.log(`📷 Cargando fotos para visita ${index}:`, visitaData);
            renderCategorias(index, visitaData);
        }
        
        $content.slideToggle(300);
        $icon.toggleClass('bi-chevron-down bi-chevron-up');
<<<<<<< HEAD
=======
        $header.attr('aria-expanded', $content.is(':visible') ? 'true' : 'false');
>>>>>>> dev
    };

    function renderCategorias(visitaIndex, visita) {
        const $content = $(`#visita-content-${visitaIndex}`);
<<<<<<< HEAD
=======

>>>>>>> dev
        console.log(`🎨 Renderizando categorías para visita ${visitaIndex}:`, visita);
        
        if (!visita || !visita.fotos_por_categoria) {
            console.error(`❌ No hay datos de categorías para visita ${visitaIndex}`);
            $content.html(`
<<<<<<< HEAD
                <div class="alert alert-warning m-3">
                    <i class="bi bi-exclamation-triangle"></i> No hay fotos disponibles en esta visita
=======
                <div class="alert alert-warning m-3" role="alert">
                    <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
                    No hay fotos disponibles en esta visita
>>>>>>> dev
                </div>
            `);
            return;
        }
        
        let html = '';
        let totalCategorias = 0;
        let totalFotosEnCategorias = 0;
        
<<<<<<< HEAD
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
=======
        // Orden de categorías con configuración (SIN PDV)
        const categoriasConfig = [
            { nombre: 'Gestión', icon: 'bi-clipboard-check', color: '#3b82f6' },
            { nombre: 'Precio', icon: 'bi-tag', color: '#f59e0b' },
            { nombre: 'Exhibiciones Adicionales', icon: 'bi-grid-3x3', color: '#06b6d4' },
            { nombre: 'Otros', icon: 'bi-three-dots', color: '#6b7280' }
        ];
        
        categoriasConfig.forEach((catConfig, catIndex) => {
            const fotos = visita.fotos_por_categoria[catConfig.nombre] || [];
            if (fotos.length > 0) {
                totalCategorias++;
                totalFotosEnCategorias += fotos.length;
                const categoriaId = `categoria-${visitaIndex}-${catConfig.nombre.replace(/\s+/g, '-').toLowerCase()}`;
                
                console.log(`   → Categoría "${catConfig.nombre}": ${fotos.length} fotos`);
                
                html += `
                    <div class="categoria-section border-bottom" style="animation: fadeIn 0.3s ease ${catIndex * 50}ms both;">
                        <div class="categoria-header bg-light p-3 d-flex flex-wrap justify-content-between align-items-center gap-2"
                             onclick="toggleCategoria('${categoriaId}')"
                             role="button"
                             tabindex="0"
                             aria-expanded="false"
                             aria-controls="${categoriaId}"
                             style="cursor: pointer; border-left-color: ${catConfig.color};">
                            <div>
                                <h6 class="mb-0 d-flex align-items-center flex-wrap gap-2">
                                    <i class="bi ${catConfig.icon}" style="color: ${catConfig.color};" aria-hidden="true"></i>
                                    <span>${escapeHtml(catConfig.nombre)}</span>
                                    <span class="badge bg-secondary">${fotos.length}</span>
                                </h6>
                                <small class="text-muted d-none d-md-block">
                                    ${getCategoriaDescription(catConfig.nombre)}
                                </small>
                            </div>
                            <div>
                                <i class="bi bi-chevron-right toggle-categoria-icon"
                                   id="toggle-cat-icon-${categoriaId}"
                                   aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="categoria-content p-3" id="${categoriaId}" style="display: none;">
                            <div class="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
                                ${fotos.map((foto, fotoIndex) => renderPhotoCard(foto, fotoIndex)).join('')}
>>>>>>> dev
                            </div>
                        </div>
                    </div>
                `;
            }
        });
        
        console.log(`✅ Categorías renderizadas: ${totalCategorias}, Total fotos: ${totalFotosEnCategorias}`);
        
        if (totalCategorias === 0) {
            html = `
<<<<<<< HEAD
                <div class="alert alert-warning m-3">
                    <i class="bi bi-exclamation-triangle"></i> No hay fotos disponibles en esta visita
=======
                <div class="alert alert-warning m-3" role="alert">
                    <i class="bi bi-exclamation-triangle" aria-hidden="true"></i>
                    No hay fotos disponibles en esta visita
>>>>>>> dev
                </div>
            `;
        }
        
        $content.html(html);
<<<<<<< HEAD
=======

        // Añadir soporte de teclado para categorías
        $content.find('.categoria-header').on('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                $(this).click();
            }
        });
    }

    function renderPhotoCard(foto, fotoIndex) {
        const estadoBadge = foto.estado === 'Rechazada'
            ? '<span class="badge bg-danger position-absolute top-0 start-0 m-1">Rechazada</span>'
            : '';
        
        return `
            <div class="col" style="animation: fadeIn 0.3s ease ${fotoIndex * 30}ms both;">
                <div class="photo-card h-100"
                     onclick="viewPhotoModal(${foto.id_foto})"
                     role="button"
                     tabindex="0"
                     aria-label="Ver foto ${foto.id_foto}">
                    <div class="photo-preview position-relative">
                        <img src="${window.getImageUrl(foto.file_path)}"
                             alt="Foto ${foto.id_foto}"
                             class="img-fluid rounded"
                             loading="lazy"
                             onerror="this.src='/static/images/placeholder.png'">
                        ${estadoBadge}
                        <span class="badge bg-info position-absolute bottom-0 end-0 m-1">
                            ${escapeHtml(foto.tipo_desc || `Tipo ${foto.id_tipo_foto}`)}
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
>>>>>>> dev
    }

    function getCategoriaDescription(categoria) {
        const descripciones = {
            'Gestión': 'Fotos de gestión de mercadería (antes/después)',
            'Precio': 'Fotos de precios y etiquetado',
            'Exhibiciones Adicionales': 'Fotos de exhibiciones y material POP',
<<<<<<< HEAD
            'PDV': 'Fotos de activación y desactivación de PDV',
=======
>>>>>>> dev
            'Otros': 'Otras fotos del punto'
        };
        return descripciones[categoria] || '';
    }

<<<<<<< HEAD
    // Función para toggle de categorías
=======
    // Función global para toggle de categorías
>>>>>>> dev
    window.toggleCategoria = function(categoriaId) {
        console.log(`🔄 Toggle categoría: ${categoriaId}`);
        const $content = $(`#${categoriaId}`);
        const $icon = $(`#toggle-cat-icon-${categoriaId}`);
<<<<<<< HEAD
        
        $content.slideToggle(300);
        $icon.toggleClass('bi-chevron-right bi-chevron-down');
=======
        const $header = $content.prev('.categoria-header');
        
        $content.slideToggle(300);
        $icon.toggleClass('bi-chevron-right bi-chevron-down');
        $header.attr('aria-expanded', $content.is(':visible') ? 'true' : 'false');
>>>>>>> dev
    };

    // Función global para abrir el modal de foto
    window.viewPhotoModal = function (photoId) {
        console.log(`🖼️ Abriendo modal para foto #${photoId}`);
<<<<<<< HEAD
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
=======
        state.currentPhotoId = photoId;
        
        // Mostrar loading en el modal
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

    // Soporte de teclado para tarjetas de foto
    $(document).on('keydown', '.photo-card', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
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
            .fail(function(err) {
                console.error('Error al cargar razones:', err);
                $container.html('<p class="text-danger small">Error al cargar razones</p>');
            });
    }

    function rejectPhoto() {
        if (!state.currentPhotoId) return;
>>>>>>> dev
        
        const razonesSeleccionadas = [];
        $('#rejectionReasons input:checked').each(function() {
            razonesSeleccionadas.push(parseInt($(this).val()));
        });
        
        const comentario = $('#rejectionComment').val().trim();
        
        if (razonesSeleccionadas.length === 0 && !comentario) {
<<<<<<< HEAD
            Swal.fire('Advertencia', 'Selecciona al menos una razón de rechazo o escribe un comentario', 'warning');
            return;
        }
        
        // Mostrar confirmación
=======
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'Selecciona al menos una razón de rechazo o escribe un comentario',
                confirmButtonColor: '#667eea'
            });
            return;
        }
        
>>>>>>> dev
        Swal.fire({
            title: '¿Rechazar foto?',
            html: `
                <p>Esta acción registrará el rechazo de la foto.</p>
                <p><strong>Razones seleccionadas:</strong> ${razonesSeleccionadas.length}</p>
<<<<<<< HEAD
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
=======
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
>>>>>>> dev
                
                $.ajax({
                    url: '/api/reject-photo',
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
<<<<<<< HEAD
                        photo_id: currentPhotoId,
=======
                        photo_id: state.currentPhotoId,
>>>>>>> dev
                        razones_ids: razonesSeleccionadas,
                        comentario: comentario
                    }),
                    success: function(response) {
                        if (response.success) {
<<<<<<< HEAD
                            Swal.fire('Éxito', 'Foto rechazada correctamente', 'success');
=======
                            Swal.fire({
                                icon: 'success',
                                title: 'Éxito',
                                text: 'Foto rechazada correctamente',
                                confirmButtonColor: '#667eea'
                            });
>>>>>>> dev
                            $('#rejectionModal').modal('hide');
                            $('#photoModal').modal('hide');
                            loadPhotos();
                        } else {
<<<<<<< HEAD
                            Swal.fire('Error', response.error || 'Error al rechazar la foto', 'error');
=======
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: response.error || 'Error al rechazar la foto',
                                confirmButtonColor: '#667eea'
                            });
>>>>>>> dev
                        }
                    },
                    error: function(xhr) {
                        const errorMsg = xhr.responseJSON?.error || 'Error al rechazar la foto';
<<<<<<< HEAD
                        Swal.fire('Error', errorMsg, 'error');
                    },
                    complete: function() {
                        rejectBtn.prop('disabled', false).html('<i class="bi bi-x-circle"></i> Rechazar Foto');
=======
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: errorMsg,
                            confirmButtonColor: '#667eea'
                        });
                    },
                    complete: function() {
                        $btn.prop('disabled', false).html('<i class="bi bi-x-circle"></i> Rechazar Foto');
>>>>>>> dev
                    }
                });
            }
        });
<<<<<<< HEAD
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
=======
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
>>>>>>> dev
            </div>
        `);
    }

    function showError(selector, message) {
        $(selector).html(`
<<<<<<< HEAD
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle"></i> ${message}
=======
            <div class="alert alert-danger d-flex align-items-center w-100" role="alert">
                <i class="bi bi-exclamation-triangle-fill fs-4 me-3" aria-hidden="true"></i>
                <div class="flex-grow-1">
                    <strong>Error:</strong> ${escapeHtml(message)}
                </div>
                <button class="btn btn-outline-danger btn-sm ms-3" onclick="location.reload()">
                    <i class="bi bi-arrow-clockwise" aria-hidden="true"></i> Reintentar
                </button>
>>>>>>> dev
            </div>
        `);
    }

    function formatDate(dateString) {
        if (!dateString) return 'Sin fecha';
<<<<<<< HEAD
        const date = new Date(dateString);
        return date.toLocaleDateString('es-VE');
    }
});

window.getImageUrl = function(imagePath) {
=======
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

// Función global para obtener URL de imagen
window.getImageUrl = function(imagePath) {
    if (!imagePath) return '/static/images/placeholder.png';
    
>>>>>>> dev
    let cleanPath = imagePath
        .replace("X://", "")
        .replace("X:/", "")
        .replace(/\\/g, "/")
        .replace(/^\//, "");
    
    return `/api/image/${encodeURIComponent(cleanPath)}`;
};