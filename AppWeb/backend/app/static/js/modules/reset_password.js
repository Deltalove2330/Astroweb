// static/js/modules/reset_password.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const loginCard = document.querySelector('.login-card');
    const resetCard = document.querySelector('.reset-card');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const backToLoginBtn = document.getElementById('back-to-login');
    const backToStep1Btn = document.getElementById('back-to-step1');
    const requestResetBtn = document.getElementById('request-reset-code');
    
    // Mostrar formulario de recuperación
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        loginCard.classList.remove('active');
        resetCard.classList.add('active');
        document.getElementById('reset-step1').style.display = 'block';
        document.getElementById('reset-step2').style.display = 'none';
    });
    
    // Volver al login desde el paso 1
    backToLoginBtn.addEventListener('click', function() {
        resetCard.classList.remove('active');
        loginCard.classList.add('active');
    });
    
    // Volver al paso 1 desde el paso 2
    backToStep1Btn.addEventListener('click', function() {
        document.getElementById('reset-step2').style.display = 'none';
        document.getElementById('reset-step1').style.display = 'block';
    });
    
    // Solicitar código de verificación (transición al paso 2)
requestResetBtn.addEventListener('click', function() {
    const username = document.getElementById('reset-username').value;
    if (!username) {
        Swal.fire('Error', 'Por favor ingresa tu usuario', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    const originalText = this.innerHTML;
    this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
    this.disabled = true;
    
    // Enviar solicitud al servidor
    fetch('/api/request-reset-code', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Mostrar paso 2
            document.getElementById('reset-step1').style.display = 'none';
            document.getElementById('reset-step2').style.display = 'block';
            Swal.fire('Código enviado', 'Revisa tu correo electrónico', 'success');
        } else {
            Swal.fire('Error', data.message || 'No se pudo enviar el código', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión con el servidor: ' + error.message, 'error');
    })
    .finally(() => {
        // Restaurar el botón
        this.innerHTML = originalText;
        this.disabled = false;
    });
});
    
    // Confirmar restablecimiento de contraseña
    document.getElementById('confirm-reset').addEventListener('click', function() {
    const code = document.getElementById('reset-code').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (!code || !newPassword || !confirmPassword) {
        Swal.fire('Error', 'Por favor completa todos los campos', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        Swal.fire('Error', 'Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    const originalText = this.innerHTML;
    this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Actualizando...';
    this.disabled = true;
    
    // ENVIAR LA SOLICITUD AL SERVIDOR
    fetch('/api/reset-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            code: code,
            new_password: newPassword
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error en la red');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            Swal.fire('Éxito', 'Contraseña restablecida correctamente', 'success').then(() => {
                resetCard.classList.remove('active');
                loginCard.classList.add('active');
            });
        } else {
            Swal.fire('Error', data.message || 'No se pudo restablecer la contraseña', 'error');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire('Error', 'Error de conexión con el servidor: ' + error.message, 'error');
    })
    .finally(() => {
        // Restaurar el botón
        this.innerHTML = originalText;
        this.disabled = false;
    });
});
});
