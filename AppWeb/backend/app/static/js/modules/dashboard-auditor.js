// static/js/modules/dashboard-auditor.js
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

// Función para formatear nombre inicial
function getInitials(name) {
    if (!name) return 'AU';
    const names = name.split(' ');
    if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Función para cargar información del auditor
function loadAuditorInfo() {
    const cedula = sessionStorage.getItem('auditor_cedula');
    const nombre = sessionStorage.getItem('auditor_name');
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    const tipo = sessionStorage.getItem('auditor_tipo');
    
    if (nombre) {
        $('#auditorName').text(nombre);
        const initials = getInitials(nombre);
        $('#userAvatar').text(initials);
    }
    
    if (cedula) {
        $('#infoCedula').text(cedula);
    }
    
    if (fechaIngreso) {
        $('#infoFechaIngreso').text(formatDate(fechaIngreso));
    }
    
    // Cargar estadísticas del auditor
    if (cedula) {
        loadAuditorStats(cedula);
    }
}

// Función para cargar estadísticas del auditor - ✅ CORREGIDA
function loadAuditorStats(cedula) {
    $.getJSON(`/auditor/api/stats/${cedula}`)  // ✅ Ruta correcta
        .done(function(stats) {
            if (stats) {
                $('#infoRutasAsignadas').text(stats.rutasAsignadas || 0);
                $('#infoRutasPendientes').text(stats.rutasPendientes || 0);
                $('#infoRutasCompletadas').text(stats.rutasCompletadas || 0);
                
                // Calcular porcentaje de avance
                const total = stats.rutasAsignadas || 0;
                const completadas = stats.rutasCompletadas || 0;
                const avance = total > 0 ? Math.round((completadas / total) * 100) : 0;
                $('#infoAvance').text(`${avance}%`);
            }
        })
        .fail(function(xhr, status, error) {
            console.error('Error al cargar estadísticas del auditor:', error);
            console.error('Respuesta:', xhr.responseText);
            // Establecer valores por defecto
            $('#infoRutasAsignadas').text('0');
            $('#infoRutasPendientes').text('0');
            $('#infoRutasCompletadas').text('0');
            $('#infoAvance').text('0%');
        });
}

// Función para seleccionar opción - ✅ CORREGIDA
function seleccionarOpcion(tipo) {
    switch(tipo) {
        case 'data':
            // Redirigir a la carga de data para auditores - ✅ Ruta correcta
            window.location.href = '/auditor/carga-data';
            break;
            
        default:
            console.warn('Tipo de opción no reconocido:', tipo);
            alert('Opción no disponible');
    }
}

// Función para verificar sesión del auditor - ✅ CORREGIDA
function checkAuditorSession() {
    const auditorName = sessionStorage.getItem('auditor_name');
    const auditorCedula = sessionStorage.getItem('auditor_cedula');
    const auditorTipo = sessionStorage.getItem('auditor_tipo');
    
    if (!auditorName || !auditorCedula || !auditorTipo) {
        window.location.href = '/login';  // ✅ Ruta correcta
        return false;
    }
    
    // Verificar que sea tipo Auditor
    if (auditorTipo !== 'Auditor') {
        window.location.href = '/dashboard-mercaderista';
        return false;
    }
    
    return true;
}

// Función para cerrar sesión - ✅ CORREGIDA
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        // Limpiar sessionStorage
        sessionStorage.removeItem('auditor_name');
        sessionStorage.removeItem('auditor_cedula');
        sessionStorage.removeItem('auditor_tipo');
        sessionStorage.removeItem('fechaIngreso');
        sessionStorage.removeItem('user_tipo');
        sessionStorage.removeItem('user_nombre');
        sessionStorage.removeItem('user_cedula');
        
        // Redirigir al logout del servidor
        window.location.href = '/logout';
    }
}

// Inicialización cuando el DOM está listo
$(document).ready(function() {
    // Verificar sesión del auditor
    if (!checkAuditorSession()) {
        return;
    }
    
    // Cargar información del auditor
    loadAuditorInfo();
    
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