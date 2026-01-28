// /static/js/modules/auth.js //
import { showAlert } from './utils.js';

export function loadUserInfo() {
    return new Promise((resolve, reject) => {
        $.get('/api/current-user').done(function(data) {
            $('#username-display').text(data.username);
            window.currentUserRole = data.rol;
            window.currentUserId = data.id;
            window.currentClientId = data.cliente_id;
            
            // ✅ Mostrar módulo "Solicitudes" solo si es admin
            if (window.currentUserRole === 'admin') {
                $('#requests-module').show();
            }
            // Llamar a la función para configurar la interfaz según el rol
            configureInterfaceByRole(data.rol);
            
            // Verificar si es supervisor y necesita redirección
            if (data.rol === 'supervisor' && data.redirect_to_supervisor && 
                window.location.pathname === '/' && !window.location.href.includes('/supervisor')) {
                window.location.href = '/supervisor';
                return;
            }
            
            // Actualizar badge según rol
            const $badge = $('#user-role-badge');
            if (data.rol === 'admin') {
                $badge.text(data.rol.toUpperCase()).addClass('bg-success').removeClass('d-none');
            } else if (data.rol === 'client') {
                $badge.text(data.rol.toUpperCase()).addClass('bg-info').removeClass('d-none');
            } else if (data.rol === 'supervisor') {
                $badge.text(data.rol.toUpperCase()).addClass('bg-warning').removeClass('d-none');
            } else if (data.rol === 'analyst') {
                $badge.text(data.rol.toUpperCase()).addClass('bg-primary').removeClass('d-none');
            }
            
            resolve(data);
        }).fail(function() {
            reject();
        });
    });
}

// Función para configurar la interfaz según el rol
export function configureInterfaceByRole(role) {
    // Asegurarse de que los elementos existan
    if ($('.sidebar-module').length === 0) {
        console.warn("No se encontraron módulos en la barra lateral. La función se ejecutará cuando estén disponibles.");
        setTimeout(() => configureInterfaceByRole(role), 100);
        return;
    }
    
    if (role === 'client') {
        // Configuración para clientes (mantén lo existente)
        $('.sidebar-module').each(function() {
            const $module = $(this);
            const moduleTitle = $module.find('.module-title').text().trim().toLowerCase();
            if (moduleTitle !== 'fotos totales') {
                $module.hide();
            }
        });
        
        // Actualizar título del módulo para clientes
        $('.sidebar-module').has('.module-title:contains("Fotos Totales")').find('.module-title').text('Mis Fotos');
    } else if (role === 'analyst') {
    // Configuración específica para analistas
    $('.sidebar-module').each(function() {
        const $module = $(this);
        // Normalizamos el título para comparación (minúsculas, sin espacios extras)
        const moduleTitle = $module.find('.module-title').text().trim().toLowerCase().replace(/\s+/g, '');
        
        // Ocultar módulos específicos para analistas
        if (moduleTitle === 'fotostotales' || 
            moduleTitle === 'reportes' || 
            moduleTitle === 'rutas') {
            $module.hide();
        } 
        else if (moduleTitle === 'fotospendientes') {
            // Renombrar a "Fotos Pendientes" PERO MANTENER LA ESTRUCTURA
            $module.find('.module-title').text('Fotos Pendientes');
            // Mantener las opciones de estado pero configurar para que al hacer clic
            // en el módulo, se carguen directamente las rutas pendientes
            const $content = $module.find('.module-content ul');
            // Si ya tiene contenido, asegurar que tenga la opción "Pendiente"
            if ($content.find('li').length === 0) {
                $content.html(`<li class="nav-item"><a class="nav-link cliente-link" href="#" data-status="Pendiente"><i class="bi bi-clock text-warning me-2"></i>Pendientes</a></li>`);
            } else {
                // Asegurar que el enlace tenga data-status="Pendiente"
                $content.find('.cliente-link').attr('data-status', 'Pendiente');
            }
        } 
        else if (moduleTitle === 'personas') {
            // Configurar módulo de Personas para mostrar solo opciones de mercaderistas
            const $content = $module.find('.module-content ul');
            $content.html(`
                <li class="nav-item">
                    <a class="nav-link" href="#" id="add-merchandiser-btn">
                        <i class="bi bi-person-plus me-2"></i>Agregar Mercaderista
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="remove-merchandiser-btn">
                        <i class="bi bi-trash me-2"></i>Eliminar Mercaderista
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#" id="merchandiser-status-toggle">
                        <i class="bi bi-person-slash me-2"></i>Estado Mercaderista
                    </a>
                </li>
            `);
        } 
        else if (moduleTitle === 'data') {
            // Configurar módulo de Data para mostrar solo "Modificar visita"
            const $content = $module.find('.module-content ul');
            $content.html(`
                <li class="nav-item">
                    <a class="nav-link cliente-link" href="#" id="modify-visit-btn">
                        <i class="bi bi-pencil-square"></i>
                        <span class="client-name">Modificar visita</span>
                    </a>
                </li>
            `);
        } 
        else {
            // Ocultar cualquier otro módulo adicional
            $module.hide();
        }
    });
} else {
        // Configuración para administradores (mantén lo existente)
        $('.sidebar-module').show();
        
        // Para admin, asegurar que el módulo "Fotos Totales" tenga las opciones de estado
        $('.sidebar-module').each(function() {
            const $module = $(this);
            const moduleTitle = $module.find('.module-title').text().trim().toLowerCase();
            if (moduleTitle === 'fotos totales') {
                const $content = $module.find('.module-content ul');
                
                // Solo reemplazar si está vacío o no tiene las opciones correctas
                if ($content.find('li').length === 0 || !$content.find('[data-status="Aprobada"]').length) {
                    $content.html(`
                        <li class="nav-item">
                            <a class="nav-link cliente-link" href="#" data-status="Aprobada">
                                <i class="bi bi-check-circle text-success me-2"></i>Aprobada
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link cliente-link" href="#" data-status="Rechazada">
                                <i class="bi bi-x-circle text-danger me-2"></i>Rechazada
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link cliente-link" href="#" data-status="No revisadas">
                                <i class="bi bi-clock text-warning me-2"></i>No revisadas
                            </a>
                        </li>
                    `);
                }
            }
            // Añadir esta sección para el módulo de Persona
        });
    }
}

export function setupLogout() {
    $('#logout-btn').on('click', function(e) {
        e.preventDefault();
        Swal.fire({
            title: '¿Cerrar sesión?',
            text: "¿Estás seguro de que deseas salir del sistema?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: '/logout',
                    method: 'GET',
                    success: function() {
                        window.location.href = '/login';
                    },
                    error: function() {
                        Swal.fire('Error', 'No se pudo cerrar sesión', 'error');
                    }
                });
            }
        });
    });
}


// ✅ Correcto: delegación de eventos
$(document).on('submit', '#forgot-password-form', function (e) {
  e.preventDefault();
  const username = $('#username-input').val();

    // ✅ Así sí
    $.ajax({
    url: '/api/request-reset-code',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({ username: username })
    })
    .done(function (res) {
    if (res.success) {
        $('#forgotPasswordModal').modal('hide');
        $('#resetPasswordModal').modal('show');
        Swal.fire('Código enviado', 'Revisa tu correo electrónico.', 'success');
    } else {
        Swal.fire('Error', res.message, 'error');
    }
    })
    .fail(function () {
    Swal.fire('Error', 'No se pudo enviar el código.', 'error');
    });
});

// Restablecer contraseña con código
$('#reset-password-form').on('submit', function (e) {
  e.preventDefault();
  const code = $('#code-input').val();
  const newPassword = $('#new-password-input').val();
  const confirmPassword = $('#confirm-password-input').val();

  if (newPassword !== confirmPassword) {
    Swal.fire('Error', 'Las contraseñas no coinciden.', 'warning');
    return;
  }

  $.post('/api/reset-password', {
    code: code,
    new_password: newPassword
  })
    .done(function (res) {
      if (res.success) {
        $('#resetPasswordModal').modal('hide');
        Swal.fire('Éxito', 'Contraseña restablecida correctamente.', 'success');
      } else {
        Swal.fire('Error', res.message, 'error');
      }
    })
    .fail(function () {
      Swal.fire('Error', 'Error al restablecer contraseña.', 'error');
    });
});