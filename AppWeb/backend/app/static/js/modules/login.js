// /static/js/modules/login.js - VERSIÓN COMPLETA CORREGIDA
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando login...');
    
    // Elementos del DOM
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
    const rememberCheckbox = document.getElementById('remember');
    
    // Inicializar tema
    function initTheme() {
        if (themeToggle) {
            console.log('Inicializando tema...');
            const savedTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
            
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                console.log('Cambiando tema de', currentTheme, 'a', newTheme);
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
            });
        } else {
            console.warn('themeToggle no encontrado');
        }
    }
    
    function updateThemeIcon(theme) {
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                // CORRECCIÓN: iconos correctos para cada tema
                if (theme === 'light') {
                    icon.className = 'fas fa-moon';
                } else {
                    icon.className = 'fas fa-sun';
                }
            }
        }
    }
    
    // Toggle password visibility - CORREGIDO PARA CHROME
    function initPasswordToggle() {
        console.log('Inicializando toggle de contraseña...');
        
        // Para el password principal
        if (togglePassword && password) {
            togglePassword.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Toggle password clickeado');
                const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
                password.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                if (icon) {
                    // CORRECCIÓN DEFINITIVA: iconos correctos
                    if (type === 'password') {
                        icon.className = 'fas fa-eye';
                    } else {
                        icon.className = 'fas fa-eye-slash';
                    }
                }
                
                // Enfocar el input para mejor UX
                setTimeout(() => {
                    password.focus();
                }, 10);
            });
            
            // También manejar el evento touch para dispositivos móviles
            togglePassword.addEventListener('touchstart', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.click();
            }, { passive: false });
        } else {
            console.warn('togglePassword o password no encontrados');
        }
        
        // Para el nuevo password en reset
        const toggleNewPassword = document.querySelector('.toggle-new-password');
        const toggleConfirmPassword = document.querySelector('.toggle-confirm-password');
        const newPasswordInput = document.getElementById('new-password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        if (toggleNewPassword && newPasswordInput) {
            toggleNewPassword.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                newPasswordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        }
        
        if (toggleConfirmPassword && confirmPasswordInput) {
            toggleConfirmPassword.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                confirmPasswordInput.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
                }
            });
        }
    }
    
    // Animación de ojos
    function initEyeAnimation() {
        if (character && leftPupil && rightPupil) {
            console.log('Inicializando animación de ojos...');
            
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
                
                if (leftPupil) {
                    leftPupil.style.transform = `translate(calc(-50% + ${leftX}px), calc(-50% + ${leftY}px))`;
                }
                if (rightPupil) {
                    rightPupil.style.transform = `translate(calc(-50% + ${rightX}px), calc(-50% + ${rightY}px))`;
                }
            }
            
            // Event listeners para animación de ojos
            document.addEventListener('mousemove', movePupils);
            window.addEventListener('resize', updateCharacterPosition);
            window.addEventListener('scroll', updateCharacterPosition);
            
            // Inicializar posición
            updateCharacterPosition();
        } else {
            console.warn('Elementos de animación no encontrados');
        }
    }
    
    // Expresiones faciales
    function setExpression(type) {
        if (!mouth || !character) return;
        
        console.log('Cambiando expresión a:', type);
        
        switch(type) {
            case 'happy':
                mouth.style.borderRadius = '0 0 30px 30px';
                mouth.style.height = '15px';
                character.style.transform = 'scale(1.05)';
                break;
            case 'sad':
                mouth.style.borderRadius = '30px 30px 0 0';
                mouth.style.height = '15px';
                character.style.transform = 'scale(0.95)';
                break;
            case 'neutral':
                mouth.style.borderRadius = '0';
                mouth.style.height = '2px';
                character.style.transform = 'scale(1)';
                break;
            case 'surprised':
                mouth.style.borderRadius = '50%';
                mouth.style.height = '10px';
                mouth.style.width = '40px';
                break;
            default:
                mouth.style.borderRadius = '0';
                mouth.style.height = '2px';
                character.style.transform = 'scale(1)';
        }
    }
    
    // Validación visual
    function validateInput(input) {
        if (!input) return;
        
        const value = input.value.trim();
        const validationIcon = input.parentElement.querySelector('.validation-icon');
        
        if (!validationIcon) return;
        
        if (input.type === 'text' && value.length >= 3) {
            validationIcon.classList.add('show');
            setExpression('happy');
        } else if (input.type === 'password' && value.length >= 6) {
            validationIcon.classList.add('show');
            setExpression('neutral');
        } else {
            validationIcon.classList.remove('show');
            if (input.type === 'text' && value.length > 0) {
                setExpression('sad');
            }
        }
    }
    
    // Eventos de foco
    function initFocusEvents() {
        console.log('Inicializando eventos de foco...');
        
        if (username) {
            username.addEventListener('focus', () => {
                console.log('Username enfocado');
                if (leftPupil && rightPupil) {
                    leftPupil.style.transform = 'translate(calc(-50% - 5px), -50%)';
                    rightPupil.style.transform = 'translate(calc(-50% - 5px), -50%)';
                }
                setExpression('happy');
            });
            
            username.addEventListener('input', () => {
                validateInput(username);
            });
            
            username.addEventListener('keyup', () => {
                validateInput(username);
            });
        } else {
            console.warn('username no encontrado');
        }
        
        if (password) {
            password.addEventListener('focus', () => {
                console.log('Password enfocado');
                if (leftPupil && rightPupil) {
                    leftPupil.style.transform = 'translate(calc(-50% + 5px), -50%)';
                    rightPupil.style.transform = 'translate(calc(-50% + 5px), -50%)';
                }
                setExpression('surprised');
                
                // Parpadeo
                document.querySelectorAll('.eyelid').forEach(lid => {
                    if (lid) {
                        lid.style.top = '0';
                        setTimeout(() => {
                            lid.style.top = '-100%';
                        }, 200);
                    }
                });
            });
            
            password.addEventListener('input', () => {
                validateInput(password);
            });
            
            password.addEventListener('keyup', () => {
                validateInput(password);
            });
        } else {
            console.warn('password no encontrado');
        }
        
        // Resetear expresión cuando no hay foco
        [username, password].forEach(input => {
            if (input) {
                input.addEventListener('blur', () => {
                    console.log(input.id, 'perdió el foco');
                    setTimeout(() => {
                        // Solo resetear si ningún input está enfocado
                        if (document.activeElement !== username && document.activeElement !== password) {
                            setExpression('neutral');
                            if (leftPupil && rightPupil) {
                                leftPupil.style.transform = 'translate(-50%, -50%)';
                                rightPupil.style.transform = 'translate(-50%, -50%)';
                            }
                        }
                    }, 100);
                });
            }
        });
    }
    
    // Remember me functionality
    function initRememberMe() {
        console.log('Inicializando remember me...');
        
        if (rememberCheckbox && username) {
            const savedUsername = localStorage.getItem('rememberMe');
            if (savedUsername) {
                username.value = savedUsername;
                rememberCheckbox.checked = true;
                validateInput(username); // Validar inicialmente
            }
            
            if (loginForm) {
                loginForm.addEventListener('submit', function() {
                    if (rememberCheckbox.checked && username.value.trim()) {
                        localStorage.setItem('rememberMe', username.value.trim());
                        console.log('Usuario guardado:', username.value.trim());
                    } else {
                        localStorage.removeItem('rememberMe');
                        console.log('Usuario eliminado de localStorage');
                    }
                });
            }
        } else {
            console.warn('rememberCheckbox o username no encontrados');
        }
    }
    
    // Form submission
        function initFormSubmission() {
            if (loginForm && loginBtn) {
                console.log('Inicializando envío de formulario...');
                
                loginForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    console.log('Formulario enviado');
                    
                    // Validar campos
                    if (!username.value.trim()) {
                        showError('Por favor ingresa tu usuario');
                        username.focus();
                        return;
                    }
                    
                    if (!password.value) {
                        showError('Por favor ingresa tu contraseña');
                        password.focus();
                        return;
                    }
                    
                    // Mostrar loading
                    loginBtn.classList.add('loading');
                    setExpression('happy');
                    
                    const formData = new FormData(loginForm);
                    
                    try {
                        console.log('Enviando solicitud a /login...');
                        
                        // IMPORTANTE: Añadir headers correctos para AJAX
                        const response = await fetch('/login', {
                            method: 'POST',
                            body: formData,
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            }
                        });
                        
                        console.log('Respuesta recibida, status:', response.status);
                        
                        // Verificar si es JSON
                        const contentType = response.headers.get('content-type');
                        
                        if (contentType && contentType.includes('application/json')) {
                            const data = await response.json();
                            console.log('Datos JSON recibidos:', data);
                            
                            if (data.success === false || data.error) {
                                throw new Error(data.error || 'Error en el login');
                            }
                            
                            if (data.redirect) {
                                console.log('Redirigiendo a:', data.redirect);
                                window.location.href = data.redirect;
                                return;
                            }
                        } else {
                            // Si no es JSON, es HTML (fallback)
                            console.warn('Respuesta no es JSON, es:', contentType);
                            const text = await response.text();
                            
                            if (response.ok) {
                                // Redirección implícita
                                console.log('Login exitoso (HTML response)');
                                window.location.href = '/';
                                return;
                            } else {
                                throw new Error('Error de autenticación');
                            }
                        }
                        
                    } catch (error) {
                        console.error('Error en login:', error);
                        setExpression('sad');
                        
                        if (typeof Swal !== 'undefined') {
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: error.message || 'Error de conexión con el servidor',
                                confirmButtonColor: '#4a6cf7',
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdrop: 'rgba(0, 0, 0, 0.4)'
                            });
                        } else {
                            alert('Error: ' + (error.message || 'Error de conexión'));
                        }
                    } finally {
                        loginBtn.classList.remove('loading');
                        console.log('Login completado');
                    }
                });
            } else {
                console.warn('loginForm o loginBtn no encontrados');
            }
        }
    
    // Helper para mostrar errores
    function showError(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: message,
                confirmButtonColor: '#4a6cf7'
            });
        } else {
            alert(message);
        }
    }
    
    // Función para mostrar éxito
    function showSuccess(message) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: message,
                confirmButtonColor: '#4a6cf7'
            });
        }
    }
    
    // Inicializar todo
    function init() {
        console.log('=== INICIANDO SISTEMA DE LOGIN ===');
        
        try {
            initTheme();
            initPasswordToggle();
            initEyeAnimation();
            initFocusEvents();
            initRememberMe();
            initFormSubmission();
            
            // Inicializar expresión neutral
            setExpression('neutral');
            
            // Posicionar ojos al centro
            if (leftPupil) leftPupil.style.transform = 'translate(-50%, -50%)';
            if (rightPupil) rightPupil.style.transform = 'translate(-50%, -50%)';
            
            console.log('=== SISTEMA DE LOGIN INICIALIZADO CORRECTAMENTE ===');
            
            // Verificar elementos críticos
            const criticalElements = [
                { name: 'username', element: username },
                { name: 'password', element: password },
                { name: 'loginForm', element: loginForm },
                { name: 'loginBtn', element: loginBtn }
            ];
            
            criticalElements.forEach(item => {
                if (!item.element) {
                    console.error(`Elemento crítico no encontrado: ${item.name}`);
                }
            });
            
        } catch (error) {
            console.error('Error durante la inicialización:', error);
        }
    }
    
    // Esperar un poco para asegurar que todo el DOM esté listo
    setTimeout(() => {
        init();
    }, 100);
    
    // También inicializar cuando la página esté completamente cargada
    window.addEventListener('load', function() {
        console.log('Página completamente cargada');
        // Re-inicializar posición del personaje
        if (character) {
            const rect = character.getBoundingClientRect();
            console.log('Posición del personaje:', rect);
        }
    });
    
    // Manejar errores no capturados
    window.addEventListener('error', function(e) {
        console.error('Error global capturado:', e.error);
    });
});