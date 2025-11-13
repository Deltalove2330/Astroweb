let savedReports = [];

$(document).ready(function() {
    loadSavedReports();
    loadFilters();
});

function loadSavedReports() {
    $.get('/reporte-personalizado/api/custom-reports')
        .done(function(reports) {
            savedReports = reports;
            displaySavedReports(reports);
        });
}

function displaySavedReports(reports) {
    const container = $('#savedReportsList');
    container.empty();
    
    reports.forEach(report => {
        const item = `
            <div class="card mb-2">
                <div class="card-body">
                    <h6 class="card-title">${report.nombre}</h6>
                    <p class="card-text small">${report.descripcion || ''}</p>
                    <small class="text-muted">${report.fecha_creacion}</small>
                    <div class="mt-2">
                        <button class="btn btn-sm btn-primary" onclick="cargarReporte(${report.id})">
                            <i class="bi bi-play"></i> Usar
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="eliminarReporte(${report.id})">
                            <i class="bi bi-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.append(item);
    });
}

function guardarReporte() {
    const nombre = $('#reportName').val();
    const descripcion = $('#reportDescription').val();
    const filtros = obtenerFiltrosActuales();
    
    if (!nombre) {
        alert('Por favor ingresa un nombre para el reporte');
        return;
    }
    
    $.ajax({
        url: '/reporte-personalizado/api/custom-reports',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            nombre: nombre,
            descripcion: descripcion,
            filtros: filtros
        }),
        success: function(response) {
            alert('Reporte guardado exitosamente');
            loadSavedReports();
        },
        error: function(xhr) {
            alert('Error al guardar reporte');
        }
    });
}

function obtenerFiltrosActuales() {
    return {
        fecha_inicio: $('#fechaInicio').val(),
        fecha_fin: $('#fechaFin').val(),
        cliente: $('#clienteSelect').val(),
        puntos: $('#puntoSelect').val() || [],
        tipo: $('#tipoSelect').val()
    };
}

function generarReporte() {
    const filtros = obtenerFiltrosActuales();
    
    if (!filtros.fecha_inicio || !filtros.fecha_fin) {
        alert('Por favor selecciona ambas fechas');
        return;
    }
    
    $('#loadingModal').modal('show');
    
    $.ajax({
        url: '/reporte-personalizado/api/generate-custom-report',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            filtros: filtros,
            report_title: $('#reportName').val() || 'Reporte Personalizado'
        }),
        success: function(response) {
            $('#loadingModal').modal('hide');
            alert('Reporte generado exitosamente');
        },
        error: function(xhr) {
            $('#loadingModal').modal('hide');
            alert('Error al generar reporte');
        }
    });
}