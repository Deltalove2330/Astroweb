// /static/js/modules/login-mercaderista.js

$(document).ready(function() {
    // Verificar estado de login al cargar la página
    verifyMerchandiserLogin();
    
    // Auto-focus en el campo cédula
    $('#cedula').focus();
    
    // Validación en tiempo real para cédula (solo números)
    $('#cedula').on('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        clearMessages();
    });
    
    // Limpiar mensajes al escribir en password
    $('#password').on('input', function() {
        clearMessages();
    });
    
    // Toggle password visibility
    $('#togglePassword').on('click', function() {
        const input = $('#password');
        const icon = $(this).find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('bi-eye').addClass('bi-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('bi-eye-slash').addClass('bi-eye');
        }
    });
    
    // Manejo del formulario
    $('#loginForm').on('submit', function(e) {
        e.preventDefault();
        
        const cedula = $('#cedula').val().trim();
        const password = $('#password').val();
        
        // Validación
        if (!cedula) {
            showError('Por favor ingresa tu cédula');
            return;
        }
        
        if (cedula.length < 6) {
            showError('La cédula debe tener al menos 6 dígitos');
            return;
        }
        
        if (!password) {
            showError('Por favor ingresa tu contraseña');
            return;
        }
        
        // Mostrar loading
        showLoading();
        
        // Verificar mercaderista con cédula Y contraseña
        $.ajax({
            url: '/api/verify-merchandiser',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                cedula: cedula,
                password: password
            }),
            timeout: 10000,
            success: function(response) {
                console.log("Respuesta del servidor:", response);
                if (response.success) {
                    // Guardar en sessionStorage
                    sessionStorage.setItem('merchandiser_cedula', cedula);
                    sessionStorage.setItem('merchandiser_name', response.nombre);
                    sessionStorage.setItem('merchandiser_tipo', response.tipo);
                    
                    // Guardar fecha de ingreso
                    const fechaIngreso = new Date().toISOString();
                    sessionStorage.setItem('fechaIngreso', fechaIngreso);
                    
                    showSuccess(`Bienvenido, ${response.nombre}`);
                    
                    // Redirigir según el tipo
                    let redirectUrl = '/dashboard-mercaderista';
                    if (response.tipo === 'Auditor') {
                        redirectUrl = '/dashboard-auditor';
                    }
                    
                    setTimeout(() => {
                        window.location.href = redirectUrl;
                    }, 1000);
                } else {
                    showError(response.message || 'Credenciales incorrectas');
                }
            },
            error: function(xhr, status, error) {
                console.log("Error completo:", xhr.responseText);
                console.log("Status:", status);
                console.log("Error:", error);
                
                if (status === 'timeout') {
                    showError('Tiempo de espera agotado. Por favor intenta de nuevo.');
                } else {
                    const msg = xhr.responseJSON?.message || 'Error al conectar con el servidor';
                    showError(msg);
                }
            },
            complete: function() {
                hideLoading();
            }
        });
    });
    
    // Prevenir envío con Enter en campos vacíos
    $('#cedula, #password').on('keypress', function(e) {
        if (e.which === 13) {
            if (!$('#cedula').val().trim()) {
                e.preventDefault();
                showError('Por favor ingresa tu cédula');
                return;
            }
            if (!$('#password').val()) {
                e.preventDefault();
                showError('Por favor ingresa tu contraseña');
                return;
            }
        }
    });
});

// ========== FUNCIONES AUXILIARES (QUE FALTABAN) ==========

function showLoading() {
    $('.btn-text').hide();
    $('.loading').show();
    $('#loginForm button[type="submit"]').prop('disabled', true);
    clearMessages();
}

function hideLoading() {
    $('.loading').hide();
    $('.btn-text').show();
    $('#loginForm button[type="submit"]').prop('disabled', false);
}

function showError(message) {
    $('#errorText').text(message);
    $('.error-message').show();
    $('.success-message').hide();
    $('#cedula').addClass('is-invalid');
    $('#password').addClass('is-invalid');
}

function showSuccess(message) {
    $('#successText').text(message);
    $('.success-message').show();
    $('.error-message').hide();
    $('#cedula').removeClass('is-invalid').addClass('is-valid');
    $('#password').removeClass('is-invalid').addClass('is-valid');
}

function clearMessages() {
    $('.error-message').hide();
    $('.success-message').hide();
    $('#cedula').removeClass('is-invalid is-valid');
    $('#password').removeClass('is-invalid is-valid');
}

// Función para verificar si el mercaderista ya está logueado
function verifyMerchandiserLogin() {
    // Mostrar un indicador de carga
    $('#loading-indicator').show();
    $('#loginForm').hide();
    
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