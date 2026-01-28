//js/modules/dashboard-mercaderista.js
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
    
    // Cargar número de visitas pendientes
    if (cedula) {
        loadPendingVisitsCount(cedula);
    }
}

// Función para cargar el conteo de visitas pendientes
function loadPendingVisitsCount(cedula) {
    $.getJSON(`/api/merchandiser-pending-visits/${cedula}`)
        .done(function(visits) {
            const count = Array.isArray(visits) ? visits.length : 0;
            $('#infoVisitasPendientes').text(count);
        })
        .fail(function() {
            $('#infoVisitasPendientes').text('Error al cargar');
        });
}

function seleccionarOpcion(tipo) {
    switch(tipo) {
        case 'fotos':
            // Redirigir a la carga de fotos
            window.location.href = '/carga-fotos-mercaderista';
            break;
            
        case 'data':
            // Redirigir a la carga de data existente
            window.location.href = '/carga-mercaderista';
            break;
            
        default:
            console.warn('Tipo de opción no reconocido:', tipo);
    }
}

// Función para cerrar sesión
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

// Manejar la tecla Escape para logout
$(document).on('keydown', function(e) {
    if (e.key === 'Escape') {
        logout();
    }
});