// /static/js/modules/login.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const leftPupil = document.getElementById('left-pupil');
    const rightPupil = document.getElementById('right-pupil');
    const character = document.getElementById('character');
    const mouth = document.getElementById('mouth');
    const loginBtn = document.getElementById('loginBtn');
    const loginForm = document.getElementById('loginForm');
    const themeToggle = document.getElementById('themeToggle');
    const togglePassword = document.getElementById('togglePassword');
    
    // Tema oscuro/claro
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        const icon = themeToggle.querySelector('i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
    
    // Animación de ojos
    let characterRect = character.getBoundingClientRect();
    let characterCenterX = characterRect.left + characterRect.width / 2;
    let characterCenterY = characterRect.top + characterRect.height / 2;
    
    function updateCharacterPosition() {
        characterRect = character.getBoundingClientRect();
        characterCenterX = characterRect.left + characterRect.width / 2;
        characterCenterY = characterRect.top + characterRect.height / 2;
    }
    
    function movePupils(event) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        const dx = mouseX - characterCenterX;
        const dy = mouseY - characterCenterY;
        const distance = Math.min(Math.sqrt(dx * dx + dy * dy), 100);
        
        const angle = Math.atan2(dy, dx);
        const maxMove = 6;
        const moveDistance = Math.min(distance / 15, maxMove);
        
        const leftX = Math.cos(angle) * moveDistance;
        const leftY = Math.sin(angle) * moveDistance;
        const rightX = Math.cos(angle) * moveDistance;
        const rightY = Math.sin(angle) * moveDistance;
        
        leftPupil.style.transform = `translate(calc(-50% + ${leftX}px), calc(-50% + ${leftY}px))`;
        rightPupil.style.transform = `translate(calc(-50% + ${rightX}px), calc(-50% + ${rightY}px))`;
    }
    
    // Expresiones faciales
    function setExpression(type) {
        switch(type) {
            case 'happy':
                mouth.style.borderRadius = '0 0 30px 30px';
                mouth.style.height = '15px';
                character.style.transform = 'scale(1.1)';
                break;
            case 'sad':
                mouth.style.borderRadius = '30px 30px 0 0';
                mouth.style.height = '15px';
                character.style.transform = 'scale(0.9)';
                break;
            case 'neutral':
                mouth.style.borderRadius = '0';
                mouth.style.height = '2px';
                character.style.transform = 'scale(1)';
                break;
        }
    }
    
    // Eventos de foco
    username.addEventListener('focus', () => {
        leftPupil.style.transform = 'translate(calc(-50% - 5px), -50%)';
        rightPupil.style.transform = 'translate(calc(-50% - 5px), -50%)';
        setExpression('happy');
    });
    
    password.addEventListener('focus', () => {
        leftPupil.style.transform = 'translate(calc(-50% + 5px), -50%)';
        rightPupil.style.transform = 'translate(calc(-50% + 5px), -50%)';
        setExpression('sad');
        
        // Parpadeo
        document.querySelectorAll('.eyelid').forEach(lid => {
            lid.style.top = '0';
            setTimeout(() => {
                lid.style.top = '-100%';
            }, 300);
        });
    });
    
    // Validación visual
    function validateInput(input) {
        const value = input.value.trim();
        const validationIcon = input.parentElement.nextElementSibling;
        
        if (input.type === 'text' && value.length >= 3) {
            validationIcon.classList.add('show');
            setExpression('happy');
        } else if (input.type === 'password' && value.length >= 6) {
            validationIcon.classList.add('show');
            setExpression('neutral');
        } else {
            validationIcon.classList.remove('show');
        }
    }
    
    username.addEventListener('input', () => validateInput(username));
    password.addEventListener('input', () => validateInput(password));
    
    // Toggle password visibility
togglePassword.addEventListener('click', () => {
    const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
    password.setAttribute('type', type);
    
    const icon = togglePassword.querySelector('i');
    // La lógica estaba invertida - corregimos:
    icon.className = type === 'password' ? 'fas fa-eye-slash' : 'fas fa-eye';
});
    
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Importante: prevenir el envío tradicional
    
    loginBtn.classList.add('loading');
    setExpression('happy');
    
    const formData = new FormData(loginForm);
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.redirect) {
            window.location.href = data.redirect; // Redirigir al cliente
        } else {
            // Para otros roles (admin/analyst)
            window.location.href = '/';
        }
        
    } catch (error) {
        console.error('Error:', error);
        // Manejar error de conexión
        Swal.fire('Error', 'Error de conexión con el servidor', 'error');
    } finally {
        loginBtn.classList.remove('loading');
    }
});
    // Event listeners globales
    document.addEventListener('mousemove', movePupils);
    window.addEventListener('resize', updateCharacterPosition);
    window.addEventListener('scroll', updateCharacterPosition);
    
    // Resetear expresión cuando no hay foco
    [username, password].forEach(input => {
        input.addEventListener('blur', () => {
            setExpression('neutral');
            leftPupil.style.transform = 'translate(-50%, -50%)';
            rightPupil.style.transform = 'translate(-50%, -50%)';
        });
    });
    
    // Inicializar
    setExpression('neutral');
});
document.addEventListener('DOMContentLoaded', function() {
    const rememberMe = localStorage.getItem('rememberMe');
    if (rememberMe) {
        username.value = rememberMe;
        document.getElementById('remember').checked = true;
    }
});

loginForm.addEventListener('submit', function() {
    if (document.getElementById('remember').checked) {
        localStorage.setItem('rememberMe', username.value);
    } else {
        localStorage.removeItem('rememberMe');
    }
});

$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    $.ajax({
        url: '/login',
        type: 'POST',
        data: $(this).serialize(),
        dataType: 'json',
        success: function(response) {
            if (response.redirect) {
                window.location.href = response.redirect;
            } else {
                // Aquí puedes mostrar un mensaje de error si lo deseas
            }
        },
        error: function() {
            // Aquí puedes mostrar un mensaje de error si lo deseas
        }
    });
});
