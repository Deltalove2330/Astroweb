document.addEventListener('DOMContentLoaded', function() {
    let productos = [];
    let categorias = [];   // [{id, nombre}]
    let fabricantes = [];  // [{id, nombre}] (PRODUCTORAS)
    let tipoActual = ''; // Para saber qué catálogo estamos agregando ('categoria' | 'fabricante')

    // Cargar datos iniciales
    cargarProductos();
    cargarListasDesplegables();

    // Event listeners
    document.getElementById('btnNuevoProducto').addEventListener('click', abrirModalNuevo);
    document.getElementById('btnGuardarProducto').addEventListener('click', guardarProducto);
    document.getElementById('btnNuevaCategoria').addEventListener('click', () => abrirModalNuevoValor('categoria'));
    document.getElementById('btnNuevoFabricante').addEventListener('click', () => abrirModalNuevoValor('fabricante'));
    document.getElementById('btnAgregarNuevoValor').addEventListener('click', agregarNuevoValor);

    // Filtros
    document.getElementById('filtroCategoria').addEventListener('change', filtrarProductos);
    document.getElementById('filtroFabricante').addEventListener('change', filtrarProductos);
    document.getElementById('buscarProducto').addEventListener('input', filtrarProductos);

    function cargarProductos() {
        fetch('/atencion-cliente/api/productos')
            .then(response => response.json())
            .then(data => {
                productos = data;
                renderizarProductos(productos);
            })
            .catch(error => {
                console.error('Error cargando productos:', error);
                Swal.fire('Error', 'No se pudieron cargar los productos', 'error');
            });
    }

    function cargarListasDesplegables() {
        fetch('/atencion-cliente/api/productos/categorias')
            .then(response => response.json())
            .then(data => {
                categorias = data;
                actualizarSelect('filtroCategoria', categorias);
                actualizarSelect('categoria', categorias);
            });

        fetch('/atencion-cliente/api/productos/fabricantes')
            .then(response => response.json())
            .then(data => {
                fabricantes = data;
                actualizarSelect('filtroFabricante', fabricantes);
                actualizarSelect('fabricante', fabricantes);
            });
    }

    // opciones: [{id, nombre}]
    function actualizarSelect(selectId, opciones) {
        const select = document.getElementById(selectId);
        const valorActual = select.value;

        const primeraOpcion = select.options[0];
        select.innerHTML = '';
        select.appendChild(primeraOpcion);

        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.id;
            option.textContent = opcion.nombre;
            select.appendChild(option);
        });

        if (valorActual && opciones.some(o => String(o.id) === String(valorActual))) {
            select.value = valorActual;
        }
    }

    function filaHtml(producto) {
        return `
            <td>${producto.id_product}</td>
            <td>${producto.producto || '-'}</td>
            <td>${producto.categoria || '-'}</td>
            <td>${producto.productora || '-'}</td>
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
    }

    function renderizarProductos(lista) {
        const tbody = document.getElementById('tbodyProductos');
        tbody.innerHTML = '';

        if (lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos</td></tr>';
            return;
        }

        lista.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = filaHtml(producto);
            tbody.appendChild(row);
        });
    }

    function filtrarProductos() {
        const filtroCategoria = document.getElementById('filtroCategoria').value;
        const filtroFabricante = document.getElementById('filtroFabricante').value;
        const buscar = document.getElementById('buscarProducto').value.toLowerCase();

        const productosFiltrados = productos.filter(producto => {
            const cumpleCategoria = !filtroCategoria || String(producto.id_categoria) === filtroCategoria;
            const cumpleFabricante = !filtroFabricante || String(producto.id_productora) === filtroFabricante;
            const cumpleBusqueda = !buscar ||
                (producto.producto && producto.producto.toLowerCase().includes(buscar)) ||
                (producto.categoria && producto.categoria.toLowerCase().includes(buscar)) ||
                (producto.productora && producto.productora.toLowerCase().includes(buscar));

            return cumpleCategoria && cumpleFabricante && cumpleBusqueda;
        });

        renderizarProductos(productosFiltrados);
    }

    window.editarProducto = function(id) {
        fetch(`/atencion-cliente/api/productos/${id}`)
        .then(response => response.json())
        .then(producto => {
            document.getElementById('productoId').value = producto.id_product;
            document.getElementById('sku').value = producto.producto || '';
            document.getElementById('categoria').value = producto.id_categoria || '';
            document.getElementById('fabricante').value = producto.id_productora || '';
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

    let guardandoProducto = false; // guardia anti-doble-tap → evita productos duplicados

    function guardarProducto() {
        if (guardandoProducto) return;
        const id = document.getElementById('productoId').value;
        const nombreProducto = document.getElementById('sku').value.trim();
        if (!nombreProducto) {
            Swal.fire('Error', 'El nombre del producto es requerido', 'error');
            return;
        }
        const data = {
            producto: nombreProducto,
            id_categoria: document.getElementById('categoria').value || null,
            id_productora: document.getElementById('fabricante').value || null,
            cod_bar: document.getElementById('codBar').value,
            inagotable: document.getElementById('inagotable').checked
        };

        const url = id ? `/atencion-cliente/api/productos/${id}` : '/atencion-cliente/api/productos';
        const method = id ? 'PUT' : 'POST';

        guardandoProducto = true;
        const btnGuardar = document.getElementById('btnGuardarProducto');
        if (btnGuardar) btnGuardar.disabled = true;

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
        })
        .finally(() => {
            guardandoProducto = false;
            if (btnGuardar) btnGuardar.disabled = false;
        });
    }

    function abrirModalNuevoValor(tipo) {
        tipoActual = tipo;
        const titulo = tipo === 'categoria' ? 'Nueva Categoría' : 'Nueva Productora';
        const label = tipo === 'categoria' ? 'Categoría' : 'Productora';

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

        const endpoint = tipoActual === 'categoria'
            ? '/atencion-cliente/api/productos/categorias'
            : '/atencion-cliente/api/productos/fabricantes';
        const selectId = tipoActual === 'categoria' ? 'categoria' : 'fabricante';
        const arrayDestino = tipoActual === 'categoria' ? categorias : fabricantes;

        fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: valor })
        })
        .then(response => response.json())
        .then(result => {
            if (!result.success) {
                Swal.fire('Error', result.message || result.error || 'No se pudo agregar', 'error');
                return;
            }
            if (!arrayDestino.some(v => v.id === result.id)) {
                arrayDestino.push({ id: result.id, nombre: result.nombre });
                arrayDestino.sort((a, b) => a.nombre.localeCompare(b.nombre));
            }
            actualizarSelect(selectId, arrayDestino);
            document.getElementById(selectId).value = result.id;
            actualizarSelect(tipoActual === 'categoria' ? 'filtroCategoria' : 'filtroFabricante', arrayDestino);

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalNuevoValor'));
            modal.hide();
            Swal.fire('Éxito', 'Valor agregado correctamente', 'success');
        })
        .catch(error => {
            console.error('Error agregando valor:', error);
            Swal.fire('Error', 'Error al agregar el valor', 'error');
        });
    }
});
