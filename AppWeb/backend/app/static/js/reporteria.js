// reporteria.js

// Función para alternar la visibilidad de los reportes
function toggleReporte(reporteId) {
    const content = document.getElementById(`${reporteId}-content`);
    const header = content.previousElementSibling;
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        header.classList.add('expanded');
        
        // Cargar gráfico solo la primera vez
        if (!content.dataset.loaded) {
            cargarGrafico(reporteId);
            content.dataset.loaded = true;
        }
    } else {
        content.style.display = 'none';
        header.classList.remove('expanded');
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
        <div class="d-flex justify-content-center align-items-center h-100">
            <div class="spinner-border text-primary" role="status">
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
            Plotly.newPlot(contenedor, fig.data, fig.layout);
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
        // Aquí implementarías la lógica para aplicar los filtros
        alert('Filtros aplicados. En producción, esto recargaría los datos.');
    });
});