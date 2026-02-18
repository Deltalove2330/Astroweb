// static/js/modules/dashboard-auditor.js

// Inicialización al cargar la página
$(document).ready(function() {
    // Cargar estadísticas del auditor - ✅ CORREGIDO: Usar endpoint del blueprint
    const cedula = sessionStorage.getItem('auditor_cedula');
    if (cedula) {
        loadAuditorStats(cedula);
    }
});

// Cargar estadísticas del auditor - ✅ CORREGIDO: Usar endpoint del blueprint
function loadAuditorStats(cedula) {
    fetch(`/auditor/api/stats/${cedula}`, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar estadísticas');
        }
        return response.json();
    })
    .then(data => {
        $('#infoRutasAsignadas').text(data.rutasAsignadas || 0);
        $('#infoRutasPendientes').text(data.rutasPendientes || 0);
        $('#infoRutasCompletadas').text(data.rutasCompletadas || 0);
        $('#infoAvance').text(`${data.avance || 0}%`);
    })
    .catch(error => {
        console.error('Error al cargar estadísticas:', error);
    });
}

// Seleccionar opción del dashboard
function seleccionarOpcion(opcion) {
    switch(opcion) {
        case 'data':
            window.location.href = '/auditor/carga-data';
            break;
        default:
            Swal.fire({
                icon: 'info',
                title: 'Función en desarrollo',
                text: 'Esta función estará disponible pronto'
            });
    }
}

// Logout del auditor
function logout() {
    // ✅ Verificar que Swal esté disponible
    if (typeof Swal === 'undefined') {
        if (confirm('¿Estás seguro que deseas cerrar sesión?')) {
            sessionStorage.clear();
            window.location.href = '/logout';  // ✅ Usar el endpoint de logout de Flask
        }
        return;
    }

    Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro que deseas cerrar sesión?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.clear();
            window.location.href = '/logout';  // ✅ CORREGIDO: usar /logout de Flask, no /login
        }
    });
}