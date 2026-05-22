document.addEventListener('DOMContentLoaded', function() {
    let productos = [];
    let categorias = [];
    let fabricantes = [];
    let tiposServicio = [];
    let tiposFabricante = [];
    let tipoActual = ''; // Para saber qué tipo de valor estamos agregando
    
    // Cargar datos iniciales
    cargarProductos();
    cargarListasDesplegables();
    
    // Event listeners
    document.getElementById('btnNuevoProducto').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnGuardarProducto').addEventListener('click', guardarProducto);
    document.getElementById('btnNuevaCategoria').addEventListener('click', () => abrirModalNuevoValor('categoria'));
    document.getElementById('btnNuevoTipoServicio').addEventListener('click', () => abrirModalNuevoValor('tipoServicio'));
    document.getElementById('btnNuevoTipoFabricante').addEventListener('click', () => abrirModalNuevoValor('tipoFabricante'));
    document.getElementById('btnAgregarNuevoValor').addEventListener('click', agregarNuevoValor);
    
    // Filtros
    document.getElementById('filtroCategoria').addEventListener('change', filtrarProductos);
    document.getElementById('filtroFabricante').addEventListener('change', filtrarProductos);
    document.getElementById('filtroTipoServicio').addEventListener('change', filtrarProductos);
    document.getElementById('buscarProducto').addEventListener('input', filtrarProductos);
    
    function cargarProductos() {
        fetch('/atencion-cliente/api/productos')
            .then(response => response.json())
            .then(data => {
                productos = data;
                renderizarProductos();
            })
            .catch(error => {
                console.error('Error cargando productos:', error);
                Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
            });
    }
    
    function cargarListasDesplegables() {
        // Cargar categorías
        fetch('/atencion-cliente/api/productos/categorias')
            .then(response => response.json())
            .then(data => {
                categorias = data;
                actualizarSelect('filtroCategoria', data);
                actualizarSelect('categoria', data);
            });
        
        // Cargar fabricantes
        fetch('/atencion-cliente/api/productos/fabricantes')
            .then(response => response.json())
            .then(data => {
                fabricantes = data;
                actualizarSelect('filtroFabricante', data);
                actualizarSelect('fabricante', data);
            });
        
        // Cargar tipos de servicio
        fetch('/atencion-cliente/api/productos/tipos-servicio')
            .then(response => response.json())
            .then(data => {
                tiposServicio = data;
                actualizarSelect('filtroTipoServicio', data);
                actualizarSelect('tipoServicio', data);
            });
        
        // Cargar tipos de fabricante
        fetch('/atencion-cliente/api/productos/tipos-fabricante')
            .then(response => response.json())
            .then(data => {
                tiposFabricante = data;
                actualizarSelect('tipoFabricante', data);
            });
    }
    
    function actualizarSelect(selectId, opciones) {
        const select = document.getElementById(selectId);
        const valorActual = select.value;
        
        // Guardar la primera opción (vacía)
        const primeraOpcion = select.options[0];
        
        // Limpiar el select
        select.innerHTML = '';
        select.appendChild(primeraOpcion);
        
        // Agregar las nuevas opciones
        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion;
            option.textContent = opcion;
            select.appendChild(option);
        });
        
        // Restaurar el valor actual si existe
        if (valorActual && opciones.includes(valorActual)) {
            select.value = valorActual;
        }
    }
    
    function renderizarProductos() {
        const tbody = document.getElementById('tbodyProductos');
        tbody.innerHTML = '';
        
        if (productos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay productos</td></tr>';
            return;
        }
        
        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id_product}</td>
                <td>${producto.skus}</td>
                <td>${producto.categoria || '-'}</td>
                <td>${producto.fabricante || '-'}</td>
                <td>${producto.tipo_de_servicio || '-'}</td>
                <td>${producto.tipo_de_fabricante || '-'}</td>
                <td>${producto.cod_bar || '-'}</td>
                <td>
                    <span class="badge ${producto.inagotable ? 'bg-success' : 'bg-secondary'}">
                        ${producto.inagotable ? 'Sí' : 'No'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${producto.id_product})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id_product})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    function filtrarProductos() {
        const filtroCategoria = document.getElementById('filtroCategoria').value.toLowerCase();
        const filtroFabricante = document.getElementById('filtroFabricante').value.toLowerCase();
        const filtroTipoServicio = document.getElementById('filtroTipoServicio').value.toLowerCase();
        const buscar = document.getElementById('buscarProducto').value.toLowerCase();
        
        const productosFiltrados = productos.filter(producto => {
            const cumpleCategoria = !filtroCategoria || (producto.categoria && producto.categoria.toLowerCase().includes(filtroCategoria));
            const cumpleFabricante = !filtroFabricante || (producto.fabricante && producto.fabricante.toLowerCase().includes(filtroFabricante));
            const cumpleTipoServicio = !filtroTipoServicio || (producto.tipo_de_servicio && producto.tipo_de_servicio.toLowerCase().includes(filtroTipoServicio));
            const cumpleBusqueda = !buscar || 
                (producto.skus && producto.skus.toLowerCase().includes(buscar)) ||
                (producto.categoria && producto.categoria.toLowerCase().includes(buscar)) ||
                (producto.fabricante && producto.fabricante.toLowerCase().includes(buscar));
            
            return cumpleCategoria && cumpleFabricante && cumpleTipoServicio && cumpleBusqueda;
        });
        
        const tbody = document.getElementById('tbodyProductos');
        tbody.innerHTML = '';
        
        if (productosFiltrados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No se encontraron productos</td></tr>';
            return;
        }
        
        productosFiltrados.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${producto.id_product}</td>
                <td>${producto.skus}</td>
                <td>${producto.categoria || '-'}</td>
                <td>${producto.fabricante || '-'}</td>
                <td>${producto.tipo_de_servicio || '-'}</td>
                <td>${producto.tipo_de_fabricante || '-'}</td>
                <td>${producto.cod_bar || '-'}</td>
                <td>
                    <span class="badge ${producto.inagotable ? 'bg-success' : 'bg-secondary'}">
                        ${producto.inagotable ? 'Sí' : 'No'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${producto.id_product})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id_product})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }
    
    window.editarProducto = function(id) {
        fetch(`/atencion-cliente/api/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            document.getElementById('productoId').value = producto.id_product;
            document.getElementById('sku').value = producto.skus;
            document.getElementById('categoria').value = producto.categoria || '';
            document.getElementById('fabricante').value = producto.fabricante || '';
            document.getElementById('tipoServicio').value = producto.tipo_de_servicio || '';
            document.getElementById('tipoFabricante').value = producto.tipo_de_fabricante || '';
            document.getElementById('codBar').value = producto.cod_bar || '';
            document.getElementById('inagotable').checked = producto.inagotable;
            document.getElementById('modalProductoTitulo').textContent = 'Editar Producto';
            const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
            modal.show();
        })
        .catch(error => {
            console.error('Error obteniendo producto:', error);
            Swal.fire('Error', 'No se pudo obtener el producto', 'error');
        });
    };
    
    window.eliminarProducto = function(id) {
        Swal.fire({
            title: '¿Está seguro?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch(`/atencion-cliente/api/productos/${id}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Éxito', 'Producto eliminado correctamente', 'success');
                        cargarProductos();
                    } else {
                        Swal.fire('Error', data.message || 'No se pudo eliminar el producto', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error eliminando producto:', error);
                    Swal.fire('Error', 'Error al eliminar el producto', 'error');
                });
            }
        });
    };
    
    function abrirModalNuevo() {
        document.getElementById('formProducto').reset();
        document.getElementById('productoId').value = '';
        document.getElementById('modalProductoTitulo').textContent = 'Nuevo Producto';
        const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
        modal.show();
    }
    
    function guardarProducto() {
        const id = document.getElementById('productoId').value;
        const sku = document.getElementById('sku').value.trim();
        if (!sku) {
            Swal.fire('Error', 'El SKU es requerido', 'error');
            return;
        }
        const data = {
            skus: sku,
            categoria: document.getElementById('categoria').value,
            fabricante: document.getElementById('fabricante').value,
            tipo_de_servicio: document.getElementById('tipoServicio').value,
            tipo_de_fabricante: document.getElementById('tipoFabricante').value,
            cod_bar: document.getElementById('codBar').value,
            inagotable: document.getElementById('inagotable').checked
        };
        
        const url = id ? `/atencion-cliente/api/productos/${id}` : '/atencion-cliente/api/productos';
        const method = id ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                Swal.fire('Éxito', result.message, 'success');
                const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
                modal.hide();
                cargarProductos();
            } else {
                Swal.fire('Error', result.message || 'Error al guardar el producto', 'error');
            }
        })
        .catch(error => {
            console.error('Error guardando producto:', error);
            Swal.fire('Error', 'Error al guardar el producto', 'error');
        });
    }
    
    function abrirModalNuevoValor(tipo) {
        tipoActual = tipo;
        let titulo = '';
        let label = '';
        
        switch(tipo) {
            case 'categoria':
                titulo = 'Nueva Categoría';
                label = 'Categoría';
                break;
            case 'tipoServicio':
                titulo = 'Nuevo Tipo de Servicio';
                label = 'Tipo de Servicio';
                break;
            case 'tipoFabricante':
                titulo = 'Nuevo Tipo de Fabricante';
                label = 'Tipo de Fabricante';
                break;
        }
        
        document.getElementById('modalNuevoValorTitulo').textContent = titulo;
        document.getElementById('labelNuevoValor').textContent = label;
        document.getElementById('nuevoValor').value = '';
        
        const modal = new bootstrap.Modal(document.getElementById('modalNuevoValor'));
        modal.show();
    }
    
    function agregarNuevoValor() {
        const valor = document.getElementById('nuevoValor').value.trim();
        
        if (!valor) {
            Swal.fire('Error', 'El valor es requerido', 'error');
            return;
        }
        
        let selectId = '';
        let arrayDestino = '';
        
        switch(tipoActual) {
            case 'categoria':
                selectId = 'categoria';
                arrayDestino = 'categorias';
                break;
            case 'tipoServicio':
                selectId = 'tipoServicio';
                arrayDestino = 'tiposServicio';
                break;
            case 'tipoFabricante':
                selectId = 'tipoFabricante';
                arrayDestino = 'tiposFabricante';
                break;
        }
        
        // Agregar a la lista correspondiente
        window[arrayDestino].push(valor);
        window[arrayDestino].sort();
        
        // Actualizar el select
        actualizarSelect(selectId, window[arrayDestino]);
        
        // Seleccionar el nuevo valor
        document.getElementById(selectId).value = valor;
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoValor'));
        modal.hide();
        
        Swal.fire('Éxito', 'Valor agregado correctamente', 'success');
    }
});