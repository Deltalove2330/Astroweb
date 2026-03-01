//js/modules/carga-fotos-mercaderista.js
// Función para formatear fecha
function formatDate(dateString) {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-VE', {
        timeZone: 'America/Caracas',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

// Función para cargar información del mercaderista
function loadMerchandiserInfo() {
    const cedula = sessionStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name');
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    
    if (nombre) {
        $('#merchandiserName').text(nombre);
        $('#infoNombre').text(nombre);
    }
    
    if (cedula) {
        $('#infoCedula').text(cedula);
    }
    
    if (fechaIngreso) {
        $('#infoFechaIngreso').text(formatDate(fechaIngreso));
    }
    
    // Cargar número de rutas asignadas
    if (cedula) {
        loadAssignedRoutesCount(cedula);
    }
}

// Función para cargar el conteo de rutas asignadas
function loadAssignedRoutesCount(cedula) {
    $.getJSON('/api/merchandiser-fixed-routes/${cedula}')
        .done(function(routes) {
            const count = Array.isArray(routes) ? routes.length : 0;
            $('#infoRutasAsignadas').text(count);
        })
        .fail(function() {
            $('#infoRutasAsignadas').text('Error al cargar');
        });
}

// Función para seleccionar opción
function seleccionarOpcion(tipo) {
    switch(tipo) {
        case 'ruta':
            // Redirigir a la pantalla de rutas fijas
            window.location.href = '/realizar-ruta-mercaderista?tipo=fija';
            break;
            
        case 'pdv':
            // Redirigir a la pantalla de rutas variables
            window.location.href = '/realizar-ruta-mercaderista?tipo=variable';
            break;
            
        default:
            console.warn('Tipo de opción no reconocido:', tipo);
    }
}

// Función para volver al dashboard
function goToDashboard() {
    window.location.href = '/dashboard-mercaderista';
}

// Inicialización cuando el DOM está listo
$(document).ready(function() {
    // Verificar sesión del mercaderista
    if (!checkMercaderistaSession()) {
        return;
    }
    
    // Cargar información del mercaderista
    loadMerchandiserInfo();
    
    // Agregar efecto de click a las tarjetas
    $('.option-card').on('click', function() {
        $(this).addClass('active');
        setTimeout(() => {
            $(this).removeClass('active');
        }, 200);
    });
    
    // Manejar teclado (accesibilidad)
    $('.option-card').on('keypress', function(e) {
        if (e.which === 13 || e.which === 32) { // Enter o Space
            $(this).click();
        }
    });
    
    // Hacer las tarjetas enfocables para accesibilidad
    $('.option-card').attr('tabindex', '0');
});

// Manejar la tecla Escape para volver al dashboard
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        goToDashboard();
    }
});