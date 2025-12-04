// /static/js/modules/login-mercaderista.js

$(document).ready(function() {
    // Auto-focus en el campo cédula
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
                    // Guardar en sesión
                    sessionStorage.setItem('merchandiser_cedula', cedula);
                    sessionStorage.setItem('merchandiser_name', response.nombre);
                    sessionStorage.setItem('merchandiser_id', response.id);
        
                    // Guardar fecha de ingreso
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