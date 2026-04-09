// reporteria.js

// Función para alternar la visibilidad de los reportes
function toggleReporte(reporteId) {
    const content = document.getElementById(`${reporteId}-content`);
    const header = content.previousElementSibling;
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        header.classList.remove('expanded');
    } else {
        // Cerrar otros reportes abiertos (opcional)
        document.querySelectorAll('.reporte-content.active').forEach(el => {
            el.classList.remove('active');
            el.previousElementSibling.classList.remove('expanded');
        });
        
        content.classList.add('active');
        header.classList.add('expanded');
        
        // Cargar gráfico solo la primera vez
        if (!content.dataset.loaded) {
            cargarGrafico(reporteId);
            content.dataset.loaded = true;
        }
    }
}

// Función para cargar gráficos con AJAX
function cargarGrafico(reporteId) {
    // Mapear IDs frontend a IDs backend
    const tipoMap = {
        'top-analistas': 'analistas',
        'top-puntos': 'puntos_interes',
        'top-personas': 'personas_interes',
        'top-mercaderistas': 'mercaderistas',
        'otros-tops': 'otros_tops'
    };
    
    const tipo = tipoMap[reporteId] || 'otros_tops';
    const contenedor = document.getElementById(`grafico-${reporteId}`);
    
    // Mostrar spinner mientras se carga
    contenedor.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
        </div>
    `;
    
    // Obtener datos del backend
    fetch(`/reporteria/api/grafico?tipo=${tipo}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(fig => {
            // Configurar responsive
            const config = {
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['lasso2d', 'select2d']
            };
            
            Plotly.newPlot(contenedor, fig.data, fig.layout, config);
            
            // Hacer el gráfico responsive al redimensionar
            window.addEventListener('resize', () => {
                Plotly.Plots.resize(contenedor);
            });
        })
        .catch(error => {
            console.error('Error cargando gráfico:', error);
            contenedor.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Error al cargar el gráfico: ${error.message}
                </div>
            `;
        });
}

// Inicializar fechas en los filtros
document.addEventListener('DOMContentLoaded', function() {
    const hoy = new Date();
    const hace30Dias = new Date();
    hace30Dias.setDate(hoy.getDate() - 30);
    
    document.getElementById('fecha-inicio').valueAsDate = hace30Dias;
    document.getElementById('fecha-fin').valueAsDate = hoy;
    
    // Manejar clic en aplicar filtros
    document.getElementById('aplicar-filtros').addEventListener('click', function() {
        const fechaInicio = document.getElementById('fecha-inicio').value;
        const fechaFin = document.getElementById('fecha-fin').value;
        const cliente = document.getElementById('cliente-filtro').value;
        const region = document.getElementById('region-filtro').value;
        
        // Recargar todos los gráficos con los nuevos filtros
        document.querySelectorAll('.reporte-content.loaded').forEach(el => {
            el.dataset.loaded = false;
        });
        
        // Mostrar notificación
        Swal.fire({
            icon: 'success',
            title: 'Filtros Aplicados',
            text: `Periodo: ${fechaInicio} al ${fechaFin}`,
            timer: 2000,
            showConfirmButton: false,
            background: '#1a2a49',
            color: '#E6F1FF'
        });
        
        // Aquí puedes agregar lógica para pasar los filtros al backend
        // recargarGraficosConFiltros({ fechaInicio, fechaFin, cliente, region });
    });
    
    // Auto-expandir el primer reporte (Top 4 Analistas)
    setTimeout(() => {
        toggleReporte('top-analistas');
    }, 500);
});

// Función opcional para recargar con filtros
function recargarGraficosConFiltros(filtros) {
    document.querySelectorAll('.reporte-content').forEach(content => {
        if (content.dataset.loaded === 'true') {
            const reporteId = content.id.replace('-content', '');
            content.dataset.loaded = false;
            cargarGrafico(reporteId);
        }
    });
}