// /static/js/reporteria.js

// Variables globales
let datosActuales = null;

// Función para cargar clientes desde la API
function cargarClientes() {
    fetch('/reporteria/api/clientes')
        .then(response => response.json())
        .then(clientes => {
            const selectCliente = document.getElementById('cliente');
            // Mantener la opción "Todos"
            const opcionesActuales = selectCliente.innerHTML;
            
            // Agregar clientes dinámicamente
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.id;
                option.textContent = cliente.nombre;
                selectCliente.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando clientes:', error);
        });
}

// Función para cargar regiones desde la API
function cargarRegiones() {
    fetch('/reporteria/api/regiones')
        .then(response => response.json())
        .then(regiones => {
            const selectRegion = document.getElementById('region');
            // Mantener la opción "Todas"
            const opcionesActuales = selectRegion.innerHTML;
            
            // Agregar regiones dinámicamente
            regiones.forEach(region => {
                const option = document.createElement('option');
                option.value = region.id;
                option.textContent = region.nombre;
                selectRegion.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error cargando regiones:', error);
        });
}

// Función para cargar el gráfico principal
function cargarGrafico() {
    const contenedor = document.getElementById('grafico-principal');
    
    // Obtener valores de los filtros
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;
    const cliente = document.getElementById('cliente').value;
    const region = document.getElementById('region').value;
    
    // Validar fechas
    if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
        alert('La fecha de inicio no puede ser mayor a la fecha de fin');
        return;
    }
    
    // Mostrar spinner
    contenedor.innerHTML = `
        <div class="d-flex justify-content-center align-items-center h-100">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando gráfico...</span>
            </div>
        </div>
    `;
    
    // Construir URL con parámetros
    let url = `/reporteria/api/grafico?cliente=${cliente}&region=${region}`;
    if (fechaInicio) url += `&fecha_inicio=${fechaInicio}`;
    if (fechaFin) url += `&fecha_fin=${fechaFin}`;
    
    // Obtener datos del backend
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(fig => {
            // Almacenar datos actuales
            datosActuales = fig;
            
            // Renderizar gráfico
            Plotly.newPlot(contenedor, fig.data, fig.layout, {
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['sendDataToCloud', 'autoScale2d', 'resetScale2d'],
                modeBarButtonsToAdd: [{
                    name: 'Descargar PNG',
                    icon: Plotly.Icons.camera,
                    click: function(gd) {
                        Plotly.downloadImage(gd, {
                            format: 'png',
                            filename: 'grafico_activaciones',
                            height: 600,
                            width: 800
                        });
                    }
                }]
            });
            
            // Actualizar resumen
            actualizarResumen(fig);
        })
        .catch(error => {
            console.error('Error cargando gráfico:', error);
            contenedor.innerHTML = `
                <div class="alert alert-danger text-center h-100 d-flex flex-column justify-content-center">
                    <i class="bi bi-exclamation-triangle me-2 fs-1"></i>
                    <h5>Error al cargar el gráfico</h5>
                    <p class="mb-0">${error.message}</p>
                    <button class="btn btn-sm btn-outline-light mt-3" onclick="cargarGrafico()">
                        Reintentar
                    </button>
                </div>
            `;
        });
}

// Función para actualizar el resumen de datos
function actualizarResumen(fig) {
    const tabla = document.getElementById('tabla-resumen');
    const totalElement = document.getElementById('total-activaciones');
    
    // Limpiar tabla
    tabla.innerHTML = '';
    
    if (!fig.data || fig.data.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="4" class="text-center">No hay datos para mostrar</td>
            </tr>
        `;
        totalElement.textContent = 'Total: 0';
        return;
    }
    
    // Calcular totales
    let totalGeneral = 0;
    const datosResumen = {};
    
    // Procesar datos del gráfico
    fig.data.forEach(serie => {
        const estado = serie.name;
        serie.y.forEach((cantidad, index) => {
            const tipoActivacion = serie.x[index];
            
            if (!datosResumen[tipoActivacion]) {
                datosResumen[tipoActivacion] = {};
            }
            
            datosResumen[tipoActivacion][estado] = cantidad;
            totalGeneral += cantidad;
        });
    });
    
    // Llenar tabla
    Object.keys(datosResumen).forEach(tipo => {
        Object.keys(datosResumen[tipo]).forEach(estado => {
            const cantidad = datosResumen[tipo][estado];
            const porcentaje = ((cantidad / totalGeneral) * 100).toFixed(2);
            
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${tipo}</td>
                <td>${estado}</td>
                <td>${cantidad}</td>
                <td>${porcentaje}%</td>
            `;
            tabla.appendChild(fila);
        });
    });
    
    // Actualizar total
    totalElement.textContent = `Total: ${totalGeneral}`;
}

// Función para limpiar filtros
function limpiarFiltros() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    document.getElementById('fecha-inicio').valueAsDate = hace30Dias;
    document.getElementById('fecha-fin').valueAsDate = hoy;
    document.getElementById('cliente').value = 'todos';
    document.getElementById('region').value = 'todas';
    
    cargarGrafico();
}

// Función para exportar datos
function exportarDatos() {
    if (!datosActuales) {
        alert('No hay datos para exportar');
        return;
    }
    
    // Crear CSV
    let csv = 'Tipo Activación,Estado,Cantidad\n';
    
    datosActuales.data.forEach(serie => {
        const estado = serie.name;
        serie.y.forEach((cantidad, index) => {
            const tipoActivacion = serie.x[index];
            csv += `${tipoActivacion},${estado},${cantidad}\n`;
        });
    });
    
    // Crear enlace de descarga
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activaciones_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Configurar fechas por defecto (últimos 30 días)
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    document.getElementById('fecha-inicio').valueAsDate = hace30Dias;
    document.getElementById('fecha-fin').valueAsDate = hoy;
    
    // Cargar datos iniciales
    cargarClientes();
    cargarRegiones();
    
    // Cargar gráfico inicial
    setTimeout(() => cargarGrafico(), 500);
    
    // Configurar eventos
    document.getElementById('aplicar-filtros').addEventListener('click', cargarGrafico);
    document.getElementById('limpiar-filtros').addEventListener('click', limpiarFiltros);
    document.getElementById('descargar-datos').addEventListener('click', exportarDatos);
    
    // Cargar gráfico al cambiar filtros (opcional)
    ['fecha-inicio', 'fecha-fin', 'cliente', 'region'].forEach(id => {
        document.getElementById(id).addEventListener('change', cargarGrafico);
    });
});