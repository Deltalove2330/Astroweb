// static/js/modules/logout-mercaderista.js

/**
 * Función para cerrar sesión de mercaderista
 * Se puede usar en todas las páginas de mercaderistas
 */
function logoutMercaderista() {
    // Mostrar confirmación
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: "¿Estás seguro de que deseas salir del sistema?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            // Limpiar sessionStorage
            sessionStorage.removeItem('merchandiser_cedula');
            sessionStorage.removeItem('merchandiser_name');
            sessionStorage.removeItem('fechaIngreso');
            
            // Limpiar localStorage si es necesario
            localStorage.removeItem('merchandiser_cedula');
            localStorage.removeItem('merchandiser_name');
            
            // Redirigir al logout del servidor
            window.location.href = '/logout';
        }
    });
}

/**
 * Función para verificar sesión de mercaderista en cada página
 */
function checkMercaderistaSession() {
    // Obtener cédula del sessionStorage o localStorage
    const cedula = sessionStorage.getItem('merchandiser_cedula') || localStorage.getItem('merchandiser_cedula');
    const nombre = sessionStorage.getItem('merchandiser_name') || localStorage.getItem('merchandiser_name');
    
    // Si no hay cédula, redirigir al login
    if (!cedula) {
        window.location.href = '/login-mercaderista';
        return false;
    }
    
    // Actualizar el nombre en la interfaz si existe el elemento
    const nameElement = document.getElementById('merchandiserName');
    if (nameElement && nombre) {
        nameElement.textContent = nombre;
    }
    
    // También actualizar en otros lugares si existen
    const infoNombre = document.getElementById('infoNombre');
    const infoCedula = document.getElementById('infoCedula');
    
    if (infoNombre && nombre) {
        infoNombre.textContent = nombre;
    }
    if (infoCedula && cedula) {
        infoCedula.textContent = cedula;
    }
    
    // Actualizar fecha de ingreso si existe
    const fechaIngreso = sessionStorage.getItem('fechaIngreso');
    const infoFechaIngreso = document.getElementById('infoFechaIngreso');
    if (infoFechaIngreso && fechaIngreso) {
        const fecha = new Date(fechaIngreso);
        infoFechaIngreso.textContent = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    return true;
}

/**
 * Función para inicializar la sesión en cada página
 */
function initMercaderistaPage() {
    // Verificar sesión al cargar la página
    if (!checkMercaderistaSession()) {
        return;
    }
    
    // Configurar evento para cerrar sesión automáticamente al cerrar la pestaña
    window.addEventListener('beforeunload', function(e) {
        // Guardar en localStorage para persistencia
        const cedula = sessionStorage.getItem('merchandiser_cedula');
        const nombre = sessionStorage.getItem('merchandiser_name');
        
        if (cedula) {
            localStorage.setItem('merchandiser_cedula', cedula);
        }
        if (nombre) {
            localStorage.setItem('merchandiser_name', nombre);
        }
    });
}