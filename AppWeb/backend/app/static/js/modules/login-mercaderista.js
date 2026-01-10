// /static/js/modules/login-mercaderista.js

$(document).ready(function() {
    // Verificar estado de login al cargar la página
    verifyMerchandiserLogin();
    
    // Auto-focus en el campo cédula (si se muestra el formulario)
    $('#cedula').focus();
    
    // Validación en tiempo real
    $('#cedula').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        clearMessages();
    });
    
    // Manejo del formulario
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const cedula = $('#cedula').val().trim();
        
        // Validación
        if (!cedula) {
            showError('Por favor ingresa tu cédula');
            return;
        }
        
        if (cedula.length < 6) {
            showError('La cédula debe tener al menos 6 dígitos');
            return;
        }
        
        // Mostrar loading
        showLoading();
        
        // Verificar mercaderista
        $.ajax({
            url: '/api/verify-merchandiser',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ cedula: cedula }),
            timeout: 10000, // 10 segundos
            success: function(response) {
                if (response.success) {
                    // Guardar en sessionStorage para compatibilidad
                    sessionStorage.setItem('merchandiser_cedula', cedula);
                    sessionStorage.setItem('merchandiser_name', response.nombre);
                    
                    // Guardar fecha de ingreso (para carga de datos)
                    const fechaIngreso = new Date().toISOString();
                    sessionStorage.setItem('fechaIngreso', fechaIngreso);
                    
                    // Mostrar éxito brevemente antes de redirigir
                    showSuccess(`Bienvenido, ${response.nombre}`);
                    
                    setTimeout(() => {
                        window.location.href = '/dashboard-mercaderista';
                    }, 1000);
                    
                } else {
                    showError(response.message || 'Cédula no encontrada');
                }
            },
            error: function(xhr, status, error) {
                if (status === 'timeout') {
                    showError('Tiempo de espera agotado. Por favor intenta de nuevo.');
                } else {
                    showError('Error al conectar con el servidor');
                }
                console.error('Error:', error);
            },
            complete: function() {
                hideLoading();
            }
        });
    });
    
    // Funciones auxiliares
    function showLoading() {
        $('.btn-text').hide();
        $('.loading').show();
        $('#loginForm button').prop('disabled', true);
        clearMessages();
    }
    
    function hideLoading() {
        $('.loading').hide();
        $('.btn-text').show();
        $('#loginForm button').prop('disabled', false);
    }
    
    function showError(message) {
        $('#errorText').text(message);
        $('.error-message').show();
        $('.success-message').hide();
        $('#cedula').addClass('is-invalid');
    }
    
    function showSuccess(message) {
        $('#successText').text(message);
        $('.success-message').show();
        $('.error-message').hide();
        $('#cedula').removeClass('is-invalid').addClass('is-valid');
    }
    
    function clearMessages() {
        $('.error-message').hide();
        $('.success-message').hide();
        $('#cedula').removeClass('is-invalid is-valid');
    }
    
    // Prevenir envío con Enter en campo vacío
    $('#cedula').on('keypress', function(e) {
        if (e.which === 13 && !this.value.trim()) {
            e.preventDefault();
            showError('Por favor ingresa tu cédula');
        }
    });
});

// Función para verificar si el mercaderista ya está logueado
function verifyMerchandiserLogin() {
    // Mostrar un indicador de carga
    $('#loading-indicator').show();
    
    // Verificar si ya hay un usuario logueado
    $.ajax({
        url: '/api/current-user',
        method: 'GET',
        timeout: 5000,
        success: function(data) {
            if (data.rol === 'mercaderista') {
                // Ya está logueado como mercaderista, redirigir al dashboard
                sessionStorage.setItem('merchandiser_cedula', data.username);
                sessionStorage.setItem('merchandiser_name', data.mercaderista_nombre || data.username);
                
                // Mostrar mensaje y redirigir
                $('#loading-indicator').hide();
                showSuccess(`Ya estás logueado como ${data.mercaderista_nombre}. Redirigiendo...`);
                
                setTimeout(() => {
                    window.location.href = '/dashboard-mercaderista';
                }, 1500);
            } else if (data.rol) {
                // Es otro tipo de usuario (admin, client, etc.)
                $('#loading-indicator').hide();
                $('#loginForm').show();
                
                // Mostrar advertencia
                showError(`Ya estás logueado como ${data.rol}. Si eres mercaderista, primero cierra sesión desde el sistema principal.`);
            } else {
                // No hay usuario logueado, mostrar formulario
                $('#loading-indicator').hide();
                $('#loginForm').show();
            }
        },
        error: function(xhr, status, error) {
            // Error o no hay sesión activa, mostrar formulario normal
            $('#loading-indicator').hide();
            $('#loginForm').show();
        }
    });
}