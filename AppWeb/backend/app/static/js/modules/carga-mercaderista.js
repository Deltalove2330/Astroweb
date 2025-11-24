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
                    <select class="form-select producto-select" required>
                        <option value="">Seleccione un producto</option>
                    </select>
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
            
            <div class="row">
                <div class="col-md-4">
                    <label class="form-label">Precio en Bs</label>
                    <input type="number" class="form-control precio-bs" min="0" step="0.01" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Precio en USD</label>
                    <input type="number" class="form-control precio-usd" min="0" step="0.01" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label">Inventario en Depósito</label>
                    <input type="number" class="form-control inventario-deposito" min="0">
                </div>
            </div>
        </div>
    `;
}

// Función para agregar un nuevo producto
async function agregarProducto() {
    const html = crearPlantillaProducto(productoIndex);
    $('#productosContainer').append(html);
    
    const visitId = $('#visitId').val();
    if (visitId) {
        try {
            // Obtener productos ya seleccionados (incluyendo el primer producto)
            const selectedIds = getSelectedProductIds();
            
            const response = await fetch(`/api/client-from-visit/${visitId}`);
            const clienteData = await response.json();
            
            if (clienteData && clienteData.id) {
                const newSelect = $('#productosContainer .producto-item:last .producto-select');
                await loadProductosEnSelect(newSelect, clienteData.id, selectedIds);
            }
        } catch (error) {
            console.error("Error al cargar productos para nuevo elemento:", error);
        }
    }
    
    actualizarBotonesEliminar();
    reenumerarProductos();
    productoIndex++;
}

// Obtener IDs de productos ya seleccionados
function getSelectedProductIds() {
    const ids = [];
    $('.producto-select').each(function() {
        const id = $(this).val();
        if (id) ids.push(id);
    });
    return ids;
}

function eliminarProducto(button) {
    const $productoItem = $(button).closest('.producto-item');
    const $select = $productoItem.find('.producto-select');
    const selectedId = $select.val();
    const selectedSku = $select.find('option:selected').text();
    
    $productoItem.remove();
    
    // Si había un producto seleccionado, restaurarlo en otros selects
    if (selectedId) {
        $('.producto-select').each(function() {
            const $currentSelect = $(this);
            
            // Verificar si la opción ya existe o no
            const optionExists = $currentSelect.find(`option[value="${selectedId}"]`).length > 0;
            
            if (!optionExists) {
                // Agregar la opción eliminada al final de la lista
                $currentSelect.append(`<option value="${selectedId}">${selectedSku}</option>`);
                
                // Ordenar las opciones alfabéticamente
                const options = $currentSelect.find('option').sort((a, b) => {
                    if (a.text === 'Seleccione un producto') return -1;
                    if (b.text === 'Seleccione un producto') return 1;
                    return a.text.localeCompare(b.text);
                });
                
                $currentSelect.empty().append(options);
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
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name');
    
    if (!cedula) {
        window.location.href = '/login-mercaderista';
        return;
    }
    
    $('#merchandiserName').text(nombre);
    loadMerchandiserVisits(cedula);
    
    // Evento para agregar productos
    $('#btnAgregarProducto').on('click', agregarProducto);
});

function logout() {
    sessionStorage.clear();
    window.location.href = '/login-mercaderista';
}


$('#formCargaDatos').on('submit', async function (e) {
    e.preventDefault();

    const visitId = $('#visitId').val();
    const fechaFinalCarga = new Date().toISOString(); // Fecha de guardado
    
    // Obtener las otras fechas de sessionStorage
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    const fechaCarga = sessionStorage.getItem(`fechaCarga_${visitId}`);
    const productos = [];

    // Recorrer todos los productos añadidos
    $('.producto-item').each(function () {
        const productoSelect = $(this).find('.producto-select');
        const productoId = productoSelect.val();
        const productoSku = productoSelect.find('option:selected').text();

        const producto = {
            id: productoId,
            sku: productoSku,
            fabricante: $(this).find('.fabricante-input').val(),
            inventarioInicial: $(this).find('.inventario-inicial').val(),
            inventarioFinal: $(this).find('.inventario-final').val(),
            caras: $(this).find('.caras-input').val(),
            precioBs: $(this).find('.precio-bs').val(),
            precioUSD: $(this).find('.precio-usd').val(),
            inventarioDeposito: $(this).find('.inventario-deposito').val() || 0
        };
        productos.push(producto);
    });

    try {
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
        if (result.success) {
            alert('Datos guardados exitosamente');

            // Ocultar la tarjeta con animación
            const card = document.querySelector(`.visit-card[data-visit-id="${visitId}"]`);
            if (card) {
                card.style.transition = 'opacity 0.3s ease';
                card.style.opacity = '0';
                setTimeout(() => card.remove(), 300);
            }

            // Recargar solo si no quedan más tarjetas
            const cedula = sessionStorage.getItem('merchandiser_cedula');
            const remainingCards = document.querySelectorAll('.visit-card').length;
            if (remainingCards === 0) {
                loadMerchandiserVisits(cedula);
            }

            $('#cargaModal').modal('hide');
        } else {
            alert('Error al guardar: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al enviar los datos');
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