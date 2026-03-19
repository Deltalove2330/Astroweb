// /static/js/modules/carga-mercaderista.js //
let productoIndex = 0;

// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-VE', {
        timeZone: 'America/Caracas',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);
}

// Función para cargar las visitas del mercaderista
function loadMerchandiserVisits(cedula) {
    $.getJSON(`/api/merchandiser-pending-visits/${cedula}`)
        .done(function(visits) {
            renderVisitsCards(visits);
        })
        .fail(function() {
            $('#visitasContainer').html(`
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle"></i>
                    Error al cargar las visitas pendientes
                </div>
            `);
        });
}

// Función para renderizar las tarjetas de visitas
function renderVisitsCards(visits) {
    if (!visits || visits.length === 0) {
        $('#visitasContainer').html(`
            <div class="alert alert-info text-center">
                <i class="bi bi-calendar-check fs-1"></i>
                <p class="mt-3 mb-0">No tienes visitas pendientes por cargar</p>
            </div>
        `);
        return;
    }

    let html = '<div class="row">';
    visits.forEach((visit, index) => {
        html += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="card shadow-sm h-100">
                    <div class="card-header bg-primary text-white">
                        <h6 class="mb-0">
                            <i class="bi bi-calendar-event me-2"></i>
                            Visita #${visit.id}
                        </h6>
                    </div>
                    <div class="card-body">
                        <p class="mb-2"><strong><i class="bi bi-building me-1"></i>Cliente:</strong><br>${visit.cliente}</p>
                        <p class="mb-2"><strong><i class="bi bi-geo-alt me-1"></i>Punto:</strong><br>${visit.punto_interes}</p>
                        <p class="mb-2"><strong><i class="bi bi-person-badge me-1"></i>Mercaderista:</strong><br>${visit.mercaderista}</p>
                        <p class="mb-2"><strong><i class="bi bi-calendar-date me-1"></i>Fecha:</strong><br>${formatDate(visit.fecha)}</p>
                        
                        <div class="d-grid gap-2 mt-3">
                            <button class="btn btn-success" onclick="cargarVisita(${visit.id}, '${visit.punto_interes}', '${visit.cliente}', '${visit.mercaderista}', '${visit.fecha}')">
                                <i class="bi bi-upload me-2"></i>Cargar Datos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    $('#visitasContainer').html(html);
}

// Función para crear plantilla de producto
function crearPlantillaProducto(index) {
    return `
        <div class="producto-item border rounded p-3 mb-3" data-producto-index="${index}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="mb-0">
                    <i class="bi bi-box-seam me-1"></i>Producto <span class="producto-numero">${index + 1}</span>
                </h6>
                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar-producto" onclick="eliminarProducto(this)" style="${index === 0 ? 'display:none;' : ''}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
            
            <div class="row mb-2">
                <div class="col-md-6">
                    <label class="form-label">Producto</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-search"></i>
                        </span>
                        <input type="text" 
                               class="form-control producto-search" 
                               placeholder="Buscar producto..."
                               data-bs-toggle="dropdown"
                               aria-haspopup="true"
                               aria-expanded="false"
                               autocomplete="off">
                        <input type="hidden" class="producto-id" value="">
                        <div class="dropdown-menu w-100 p-0" id="dropdown-productos-${index}">
                            <div class="p-2 border-bottom">
                                <input type="text" 
                                       class="form-control form-control-sm search-filter" 
                                       placeholder="Filtrar productos..."
                                       autocomplete="off">
                            </div>
                            <div class="dropdown-productos-list" style="max-height: 200px; overflow-y: auto;">
                                <!-- Las opciones se cargarán aquí -->
                            </div>
                        </div>
                    </div>
                    <div class="form-text">
                        <small>Escribe para buscar o despliega para ver todos</small>
                    </div>
                </div>
                <div class="col-md-6">
                    <label class="form-label">Fabricante</label>
                    <input type="text" class="form-control fabricante-input" readonly>
                </div>
            </div>
            
            <div class="row mb-2">
                <div class="col-md-4">
                    <label class="form-label">Inventario Inicial</label>
                    <input type="number" class="form-control inventario-inicial" min="0" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Inventario Final</label>
                    <input type="number" class="form-control inventario-final" min="0" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Caras</label>
                    <input type="number" class="form-control caras-input" min="0" required>
                </div>
            </div>
            
            <div class="row mb-2">
                <div class="col-md-4">
                    <label class="form-label">Precio en Bs</label>
                    <div class="input-group">
                        <span class="input-group-text">Bs</span>
                        <input type="text" 
                               class="form-control precio-bs decimal-input" 
                               placeholder="0,00"
                               max="35500"
                               data-max="35500"
                               data-moneda="Bs">
                        <div class="invalid-feedback" style="display: none;">
                            El precio máximo es 35.500 Bs
                        </div>
                    </div>
                    <div class="form-text">
                        <small>Máximo: 35.500 Bs. Usa coma para decimales</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Precio en USD</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="text" 
                               class="form-control precio-usd decimal-input" 
                               placeholder="0,00"
                               max="100"
                               data-max="100"
                               data-moneda="USD">
                        <div class="invalid-feedback" style="display: none;">
                            El precio máximo es 100 USD
                        </div>
                    </div>
                    <div class="form-text">
                        <small>Máximo: 100 USD. Usa coma para decimales</small>
                    </div>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Inventario en Depósito</label>
                    <input type="number" class="form-control inventario-deposito" min="0">
                </div>
            </div>

            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">
                        <i class="bi bi-calendar-event me-1"></i>FEFO
                        <small class="text-muted ms-1">(Fecha de vencimiento más próxima)</small>
                    </label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-calendar3"></i>
                        </span>
                        <input type="date"
                               class="form-control fefo-input"
                               placeholder="dd/mm/aaaa">
                    </div>
                    <div class="form-text">
                        <small>Opcional. Selecciona la fecha más próxima a vencer</small>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Función para cargar productos en el dropdown
async function loadProductosEnDropdown(dropdownElement, clienteId, excludeIds = []) {
    try {
        const response = await fetch(`/api/client-products/${clienteId}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productos = await response.json();
        const $dropdownList = dropdownElement.find('.dropdown-productos-list');
        $dropdownList.empty();
        
        if (Array.isArray(productos)) {
            // Almacenar productos para búsqueda
            dropdownElement.data('productos', productos);
            
            // Mostrar todos los productos inicialmente
            renderProductosEnDropdown(dropdownElement, productos, excludeIds);
            
            // Configurar evento de búsqueda en tiempo real
            const $searchInput = dropdownElement.find('.search-filter');
            $searchInput.off('keyup').on('keyup', function() {
                const searchTerm = $(this).val().toLowerCase();
                const productos = dropdownElement.data('productos') || [];
                
                if (searchTerm.length > 0) {
                    const filtered = productos.filter(p => 
                        p.sku.toLowerCase().includes(searchTerm)
                    );
                    renderProductosEnDropdown(dropdownElement, filtered, excludeIds);
                } else {
                    renderProductosEnDropdown(dropdownElement, productos, excludeIds);
                }
            });
        }
    } catch (error) {
        console.error("Error al cargar productos en dropdown:", error);
        $dropdownList.html(`
            <div class="dropdown-item text-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                Error al cargar productos
            </div>
        `);
    }
}

// Función para renderizar productos en el dropdown
function renderProductosEnDropdown(dropdownElement, productos, excludeIds = []) {
    const $dropdownList = dropdownElement.find('.dropdown-productos-list');
    $dropdownList.empty();
    
    if (productos.length === 0) {
        $dropdownList.html(`
            <div class="dropdown-item text-muted">
                <i class="bi bi-search me-2"></i>
                No se encontraron productos
            </div>
        `);
        return;
    }
    
    productos.forEach(producto => {
        if (!excludeIds.includes(producto.id.toString())) {
            const item = $(`
                <button type="button" class="dropdown-item d-flex justify-content-between align-items-center" 
                        data-id="${producto.id}" 
                        data-sku="${producto.sku}" 
                        data-fabricante="${producto.fabricante || ''}">
                    <div>
                        <strong>${producto.sku}</strong><br>
                        <small class="text-muted">${producto.fabricante || 'Sin fabricante'}</small>
                    </div>
                    <i class="bi bi-chevron-right"></i>
                </button>
            `);
            
            item.on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const $productoItem = dropdownElement.closest('.producto-item');
                const productoId = $(this).data('id');
                const sku = $(this).data('sku');
                const fabricante = $(this).data('fabricante');
                
                // Establecer valores
                $productoItem.find('.producto-search').val(sku);
                $productoItem.find('.producto-id').val(productoId);
                $productoItem.find('.fabricante-input').val(fabricante);
                
                // Cerrar dropdown
                dropdownElement.removeClass('show');
                
                // Remover producto seleccionado de otros dropdowns
                removerProductoDeOtrosDropdowns(productoId, $productoItem.index());
            });
            
            $dropdownList.append(item);
        }
    });
}

// Función para remover producto seleccionado de otros dropdowns
function removerProductoDeOtrosDropdowns(productoId, currentIndex) {
    $('.producto-item').each(function(index) {
        if (index !== currentIndex) {
            const $dropdown = $(this).find('.dropdown-menu');
            const productos = $dropdown.data('productos') || [];
            const filtered = productos.filter(p => p.id.toString() !== productoId.toString());
            $dropdown.data('productos', filtered);
            
            // Actualizar dropdown si está abierto
            if ($dropdown.hasClass('show')) {
                const $searchInput = $dropdown.find('.search-filter');
                const searchTerm = $searchInput.val().toLowerCase();
                
                if (searchTerm.length > 0) {
                    const searchFiltered = filtered.filter(p => 
                        p.sku.toLowerCase().includes(searchTerm)
                    );
                    renderProductosEnDropdown($dropdown, searchFiltered, []);
                } else {
                    renderProductosEnDropdown($dropdown, filtered, []);
                }
            }
        }
    });
}

// Configurar eventos para los dropdowns
function configurarDropdowns() {
    // Evento para mostrar/ocultar dropdown
    $(document).on('click focus', '.producto-search', function() {
        const $dropdown = $(this).siblings('.dropdown-menu');
        $dropdown.toggleClass('show');
    });
    
    // Cerrar dropdown al hacer clic fuera
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.input-group').length) {
            $('.dropdown-menu').removeClass('show');
        }
    });
    
    // Prevenir cierre al hacer clic dentro del dropdown
    $(document).on('click', '.dropdown-menu', function(e) {
        e.stopPropagation();
    });
}

// Modificar la función agregarProducto para usar dropdowns
async function agregarProducto() {
    const html = crearPlantillaProducto(productoIndex);
    $('#productosContainer').append(html);
    
    const visitId = $('#visitId').val();
    if (visitId) {
        try {
            const response = await fetch(`/api/client-from-visit/${visitId}`);
            const clienteData = await response.json();
            
            if (clienteData && clienteData.id) {
                const $productoItem = $('#productosContainer .producto-item:last');
                const $dropdown = $productoItem.find('.dropdown-menu');
                
                // Obtener IDs de productos ya seleccionados
                const selectedIds = getSelectedProductIds();
                
                await loadProductosEnDropdown($dropdown, clienteData.id, selectedIds);
            }
        } catch (error) {
            console.error("Error al cargar productos para nuevo elemento:", error);
        }
    }
    
    actualizarBotonesEliminar();
    reenumerarProductos();
    productoIndex++;
}

// Modificar getSelectedProductIds para el nuevo formato
function getSelectedProductIds() {
    const ids = [];
    $('.producto-id').each(function() {
        const id = $(this).val();
        if (id) ids.push(id);
    });
    return ids;
}

// Modificar la función eliminarProducto
function eliminarProducto(button) {
    const $productoItem = $(button).closest('.producto-item');
    const productoId = $productoItem.find('.producto-id').val();
    const sku = $productoItem.find('.producto-search').val();
    
    $productoItem.remove();
    
    // Si había un producto seleccionado, restaurarlo en otros dropdowns
    if (productoId) {
        $('.producto-item').each(function() {
            const $dropdown = $(this).find('.dropdown-menu');
            const productos = $dropdown.data('productos') || [];
            
            // Verificar si el producto ya existe
            const productoExistente = productos.find(p => p.id.toString() === productoId.toString());
            
            if (!productoExistente) {
                // Agregar el producto eliminado
                const productoRestaurado = {
                    id: productoId,
                    sku: sku,
                    fabricante: $productoItem.find('.fabricante-input').val()
                };
                
                productos.push(productoRestaurado);
                $dropdown.data('productos', productos);
                
                // Si el dropdown está abierto, actualizar
                if ($dropdown.hasClass('show')) {
                    const $searchInput = $dropdown.find('.search-filter');
                    const searchTerm = $searchInput.val().toLowerCase();
                    
                    if (searchTerm.length > 0) {
                        const filtered = productos.filter(p => 
                            p.sku.toLowerCase().includes(searchTerm)
                        );
                        renderProductosEnDropdown($dropdown, filtered, []);
                    } else {
                        renderProductosEnDropdown($dropdown, productos, []);
                    }
                }
            }
        });
    }
    
    actualizarBotonesEliminar();
    reenumerarProductos();
}
// Función para actualizar la visibilidad de botones eliminar
function actualizarBotonesEliminar() {
    const totalProductos = $('.producto-item').length;
    $('.btn-eliminar-producto').toggle(totalProductos > 1);
}

// Función para reenumerar los productos
function reenumerarProductos() {
    $('.producto-item').each(function(index) {
        $(this).find('.producto-numero').text(index + 1);
        $(this).attr('data-producto-index', index);
    });
    productoIndex = $('.producto-item').length;
}

async function loadProductosEnSelect(selectElement, clienteId, excludeIds = []) {
    try {
        const response = await fetch(`/api/client-products/${clienteId}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const productos = await response.json();
        selectElement.empty().append('<option value="">Seleccione un producto</option>');
        
        if (Array.isArray(productos)) {
            productos.forEach(producto => {
                if (!excludeIds.includes(producto.id.toString())) {
                    // Añadir atributo data-fabricante para uso futuro
                    selectElement.append(
                        `<option value="${producto.id}" data-fabricante="${producto.fabricante || ''}">
                            ${producto.sku}
                        </option>`
                    );
                }
            });
        } else {
            throw new Error("Formato de respuesta inválido");
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
        selectElement.empty().append(`<option value="">Error: ${error.message}</option>`);
    }
}

// Función para limpiar y configurar el formulario
function limpiarFormularioProductos() {
    $('#productosContainer').empty();
    productoIndex = 0;
}

// Función para configurar el formulario inicial
function configurarFormularioInicial() {
    limpiarFormularioProductos();
    agregarProducto();
}

// Función para abrir el modal con datos
async function cargarVisita(visitId, puntoNombre, clienteNombre, mercaderistaNombre, fecha) {
    try {
        const fechaCarga = new Date().toISOString();
        sessionStorage.setItem(`fechaCarga_${visitId}`, fechaCarga);
        // Mostrar datos de la visita
        $('#modalVisitId').text(`#${visitId}`);
        $('#modalCliente').text(clienteNombre);
        $('#modalPunto').text(puntoNombre);
        $('#modalMercaderista').text(mercaderistaNombre);
        $('#modalFecha').text(formatDate(fecha));
        
        // Guardar datos en campos ocultos
        $('#visitId').val(visitId);
        $('#clienteNombre').val(clienteNombre);
        $('#puntoInteresNombre').val(puntoNombre);
        $('#fechaVisita').val(formatDate(fecha));
        
        const mercaderista = sessionStorage.getItem('merchandiser_name') || mercaderistaNombre;
        $('#mercaderistaNombre').val(mercaderista);
        
        // Configurar formulario
        limpiarFormularioProductos();
        agregarProducto();
        
        // Obtener información del cliente para esta visita
        const response = await fetch(`/api/client-from-visit/${visitId}`);
        const clienteData = await response.json();
        
        if (clienteData.success && clienteData.id) {
            // Obtener TODOS los productos seleccionados (inicialmente vacío)
            const selectedIds = getSelectedProductIds();
            
            // Cargar productos para todos los selects
            await Promise.all(
                $('.producto-select').map(async function() {
                    await loadProductosEnSelect($(this), clienteData.id, selectedIds);
                }).get()
            );
        }
        else {
            console.error("Error al obtener cliente:", clienteData.message);
            showError("No se pudieron cargar los productos: " + (clienteData.message || "Error desconocido"));
        }
        
        // Abrir el modal
        $('#cargaModal').modal('show');
        
    } catch (error) {
        console.error("Error en cargarVisita:", error);
        showError("Error al cargar la visita: " + error.message);
    }
}

// Función para mostrar errores
function showError(message) {
    $('#visitasContainer').html(`
        <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i>
            ${message}
            <button class="btn btn-sm btn-outline-secondary mt-2" onclick="location.reload()">
                <i class="bi bi-arrow-repeat"></i> Recargar
            </button>
        </div>
    `);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión del mercaderista
    if (!checkMercaderistaSession()) {
        return;
    }
    
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name');
    
    $('#merchandiserName').text(nombre);
    loadMerchandiserVisits(cedula);
    
    // Configurar eventos de dropdown
    configurarDropdowns();
    
    // Configurar eventos de inputs decimales
    configurarInputsDecimales();
    
    // Guardar texto original del botón submit
    $('button[type="submit"]').each(function() {
        $(this).data('original-text', $(this).html());
    });
    
    // Evento para agregar productos
    $('#btnAgregarProducto').on('click', agregarProducto);
});

// Función de logout
function logout() {
    if (typeof logoutMercaderista === 'function') {
        logoutMercaderista();
    } else {
        // Fallback básico
        if (confirm('¿Estás seguro de que deseas salir del sistema?')) {
            sessionStorage.clear();
            window.location.href = '/login-mercaderista';
        }
    }
}

$('#formCargaDatos').on('submit', async function (e) {
    e.preventDefault();

    // Validar precios antes de enviar
    if (!validateAllPrices()) {
        Swal.fire({
            icon: 'error',
            title: 'Error en precios',
            text: 'Algunos precios superan los límites permitidos. Por favor, corrígelos.',
            confirmButtonColor: '#3085d6',
        });
        return;
    }

    const visitId = $('#visitId').val();
    const fechaFinalCarga = new Date().toISOString(); // Fecha de guardado
    
    // Obtener las otras fechas de sessionStorage
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    const fechaCarga = sessionStorage.getItem(`fechaCarga_${visitId}`);
    const productos = [];

    // Recorrer todos los productos añadidos
    $('.producto-item').each(function () {
        const productoId = $(this).find('.producto-id').val();
        const productoSku = $(this).find('.producto-search').val();

        // Convertir precios con comas a formato decimal para el backend
        const precioBs = convertDecimalForBackend($(this).find('.precio-bs').val());
        const precioUSD = convertDecimalForBackend($(this).find('.precio-usd').val());

        // Convertir fecha FEFO de yyyy-mm-dd (input type=date) a dd/mm/yyyy para el backend
        const fefoRaw = $(this).find('.fefo-input').val();
        let fefoFormatted = null;
        if (fefoRaw) {
            const [y, m, d] = fefoRaw.split('-');
            fefoFormatted = `${d}/${m}/${y}`;
        }

        const producto = {
            id: productoId,
            sku: productoSku,
            fabricante: $(this).find('.fabricante-input').val(),
            inventarioInicial: $(this).find('.inventario-inicial').val(),
            inventarioFinal: $(this).find('.inventario-final').val(),
            caras: $(this).find('.caras-input').val(),
            precioBs: precioBs,
            precioUSD: precioUSD,
            inventarioDeposito: $(this).find('.inventario-deposito').val() || 0,
            fefo: fefoFormatted
        };
        
        // Validar que los precios convertidos sean números válidos
        if (isNaN(parseFloat(producto.precioBs)) || isNaN(parseFloat(producto.precioUSD))) {
            Swal.fire({
                icon: 'error',
                title: 'Error en formato',
                text: 'Los precios deben tener un formato válido (ej: 10,50)',
                confirmButtonColor: '#3085d6',
            });
            throw new Error('Formato de precio inválido');
        }
        
        productos.push(producto);
    });

    try {
        // Mostrar loading
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true).html(`
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Guardando...
        `);

        const response = await fetch('/api/cargar-datos-visita', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                visitId: visitId,
                productos: productos,
                fechaIngreso: fechaIngreso,
                fechaCarga: fechaCarga,
                fechaFinalCarga: fechaFinalCarga
            })
        });

        const result = await response.json();
        
        // Restaurar botón
        submitBtn.prop('disabled', false).html(originalText);
        
        if (result.success) {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: 'Datos guardados exitosamente',
                confirmButtonColor: '#3085d6',
                timer: 2000,
                timerProgressBar: true
            });

            // Ocultar la tarjeta con animación
            $(`[onclick*="cargarVisita(${visitId}"]`).closest('.col-md-6, .col-lg-4').fadeOut(300, function() {
                $(this).remove();
                
                // Recargar solo si no quedan más tarjetas
                const cedula = sessionStorage.getItem('merchandiser_cedula');
                const remainingCards = $('.col-md-6, .col-lg-4').length;
                if (remainingCards === 0) {
                    loadMerchandiserVisits(cedula);
                }
            });

            $('#cargaModal').modal('hide');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al guardar: ' + (result.message || 'Error desconocido'),
                confirmButtonColor: '#3085d6',
            });
        }
    } catch (error) {
        console.error('Error:', error);
        
        // Restaurar botón
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.data('original-text') || '<i class="bi bi-check-circle me-1"></i>Guardar Productos';
        submitBtn.prop('disabled', false).html(originalText);
        
        Swal.fire({
            icon: 'error',
            title: 'Error de conexión',
            text: 'Error al enviar los datos. Verifica tu conexión e intenta nuevamente.',
            confirmButtonColor: '#3085d6',
        });
    }
});

$(document).on('change', '.producto-select', async function() {
    const selectedId = $(this).val();
    if (!selectedId) {
        // Limpiar fabricante si no hay selección
        $(this).closest('.producto-item').find('.fabricante-input').val('');
        return;
    }

    try {
        // Obtener y establecer el fabricante
        const fabricante = await getFabricantePorId(selectedId);
        $(this).closest('.producto-item').find('.fabricante-input').val(fabricante);
        
        // Quitar el producto seleccionado de otros selects
        const otherSelects = $('.producto-select').not(this);
        otherSelects.each(function() {
            $(this).find(`option[value="${selectedId}"]`).remove();
        });
    } catch (error) {
        console.error("Error al cargar fabricante:", error);
        $(this).closest('.producto-item').find('.fabricante-input').val('Error al cargar');
    }
});

async function getFabricantePorId(productoId) {
    try {
        const response = await fetch(`/api/product-fabricante/${productoId}`);
        const data = await response.json();
        
        if (data.success && data.fabricante) {
            return data.fabricante;
        } else {
            console.error("Fabricante no encontrado para el producto:", productoId);
            return "Desconocido";
        }
    } catch (error) {
        console.error("Error al obtener fabricante:", error);
        return "Error al cargar";
    }
}


// Función para formatear entrada decimal con comas
function formatDecimalInput(input) {
    let value = input.value;
    
    // Reemplazar punto por coma
    value = value.replace(/\./g, ',');
    
    // Validar que solo tenga números, una coma y hasta 2 decimales
    const regex = /^\d*[,]?\d{0,2}$/;
    if (value !== '' && !regex.test(value)) {
        // Si no cumple, revertir al último valor válido
        input.value = input.getAttribute('data-last-valid') || '';
        return;
    }
    
    // Guardar como último valor válido
    input.setAttribute('data-last-valid', value);
    
    // Aplicar límite de máximo
    const max = parseFloat(input.getAttribute('data-max'));
    const numericValue = parseFloat(value.replace(',', '.'));
    
    if (!isNaN(numericValue) && numericValue > max) {
        input.classList.add('is-invalid');
        input.nextElementSibling.style.display = 'block';
        
        // Si supera el límite, establecer el valor máximo
        input.value = max.toFixed(2).replace('.', ',');
        input.setAttribute('data-last-valid', input.value);
    } else {
        input.classList.remove('is-invalid');
        input.nextElementSibling.style.display = 'none';
    }
}

// Función para convertir comas a puntos para el backend
function convertDecimalForBackend(value) {
    if (!value) return "0";
    return value.replace(',', '.');
}

// Función para validar todos los precios antes de enviar
function validateAllPrices() {
    let isValid = true;
    
    $('.decimal-input').each(function() {
        const value = $(this).val();
        const max = parseFloat($(this).data('max'));
        const numericValue = parseFloat(value.replace(',', '.'));
        
        if (!isNaN(numericValue) && numericValue > max) {
            $(this).addClass('is-invalid');
            $(this).siblings('.invalid-feedback').show();
            isValid = false;
        } else {
            $(this).removeClass('is-invalid');
            $(this).siblings('.invalid-feedback').hide();
        }
    });
    
    return isValid;
}

// Función para formatear al perder foco (blur)
function formatDecimalOnBlur(input) {
    let value = input.value;
    
    if (value === '') return;
    
    // Si termina con coma, agregar "00"
    if (value.endsWith(',')) {
        value = value + '00';
    }
    
    // Si no tiene coma, agregar ",00"
    if (!value.includes(',')) {
        value = value + ',00';
    }
    
    // Asegurar 2 decimales
    const parts = value.split(',');
    if (parts.length === 2) {
        if (parts[1].length === 0) {
            parts[1] = '00';
        } else if (parts[1].length === 1) {
            parts[1] = parts[1] + '0';
        } else if (parts[1].length > 2) {
            parts[1] = parts[1].substring(0, 2);
        }
        value = parts[0] + ',' + parts[1];
    }
    
    // Aplicar límite nuevamente
    input.value = value;
    formatDecimalInput(input);
}

// Configurar eventos para inputs decimales
function configurarInputsDecimales() {
    // Evento para formatear en tiempo real
    $(document).on('input', '.decimal-input', function(e) {
        // Permitir borrar
        if (e.originalEvent.inputType === 'deleteContentBackward' || 
            e.originalEvent.inputType === 'deleteContentForward') {
            return;
        }
        
        formatDecimalInput(this);
    });
    
    // Evento para formatear al perder foco
    $(document).on('blur', '.decimal-input', function() {
        formatDecimalOnBlur(this);
    });
    
    // Evento para capturar punto y convertirlo a coma
    $(document).on('keydown', '.decimal-input', function(e) {
        // Si presiona punto, convertirlo a coma
        if (e.key === '.') {
            e.preventDefault();
            
            const input = this;
            const start = input.selectionStart;
            const end = input.selectionEnd;
            const value = input.value;
            
            // Insertar coma en la posición del cursor
            input.value = value.substring(0, start) + ',' + value.substring(end);
            
            // Mover cursor después de la coma
            input.setSelectionRange(start + 1, start + 1);
            
            // Formatear
            formatDecimalInput(input);
        }
    });
    
    // Prevenir entrada de caracteres no numéricos
    $(document).on('keypress', '.decimal-input', function(e) {
        const char = String.fromCharCode(e.which);
        
        // Permitir: números, coma, backspace, delete, tab, enter, flechas
        if (e.which === 8 || e.which === 46 || e.which === 9 || 
            e.which === 13 || (e.which >= 37 && e.which <= 40)) {
            return;
        }
        
        // Validar que sea número o coma
        const regex = /[0-9,]/;
        if (!regex.test(char)) {
            e.preventDefault();
            return false;
        }
        
        // Validar que solo haya una coma
        const currentValue = $(this).val();
        if (char === ',' && currentValue.includes(',')) {
            e.preventDefault();
            return false;
        }
    });
}