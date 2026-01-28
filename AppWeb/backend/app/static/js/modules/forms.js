// /static/js/modules/forms.js
import { showAlert } from './utils.js';

export function setupFormHandlers() {
    $(document).on('click', '#add-merchandiser-btn', function(e) {
  e.preventDefault();
  showAddMerchandiserForm();
  if ($(window).width() < 768) closeSidebar();
});
    
    $(document).on('click', '#remove-merchandiser-btn', function(e) {
  e.preventDefault();
  showRemoveMerchandiserForm();
  if ($(window).width() < 768) closeSidebar();
});
    
    $(document).on('click', '#add-analyst-btn', function(e) {
        e.preventDefault();
        showAddAnalystForm();
        if ($(window).width() < 768) closeSidebar();
    });
    
    $(document).on('click', '#remove-analyst-btn', function(e) {
        e.preventDefault();
        showRemoveAnalystForm();
        if ($(window).width() < 768) closeSidebar();
    });
}

export function showAddAnalystForm() {
    if (window.currentUserRole !== 'admin') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para realizar esta acción',
        });
        return;
    }
    
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-person-plus me-2"></i>Agregar Nuevo Usuario</h3>
            <form id="add-analyst-form">
                <div class="analyst-form-group">
                    <label for="analyst-username">Nombre de Usuario</label>
                    <input type="text" id="analyst-username" class="analyst-form-control" required
                           placeholder="Ingrese un nombre de usuario único">
                </div>
                <div class="analyst-form-group">
                    <label for="analyst-email">Correo Electrónico</label>
                    <input type="email" id="analyst-email" class="analyst-form-control" required
                           placeholder="Ingrese un correo electrónico válido">
                </div>
                <div class="analyst-form-group">
                    <label for="analyst-password">Contraseña</label>
                    <input type="password" id="analyst-password" class="analyst-form-control" required
                           placeholder="Mínimo 6 caracteres">
                </div>
                <div class="analyst-form-group">
                    <label for="analyst-confirm-password">Confirmar Contraseña</label>
                    <input type="password" id="analyst-confirm-password" class="analyst-form-control" required
                           placeholder="Repita la contraseña">
                </div>
                <div class="analyst-form-group">
                    <label>Tipo de usuario</label>
                    <div class="analyst-radio-group">
                        <div class="analyst-radio-option">
                            <input type="radio" id="analyst-type-admin" name="analyst-type" value="admin">
                            <label for="analyst-type-admin">Administrador</label>
                        </div>
                        <div class="analyst-radio-option">
                            <input type="radio" id="analyst-type-analyst" name="analyst-type" value="analyst">
                            <label for="analyst-type-analyst">Analista</label>
                        </div>
                        <div class="analyst-radio-option">
                            <input type="radio" id="analyst-type-supervisor" name="analyst-type" value="supervisor">
                            <label for="analyst-type-supervisor">Supervisor</label>
                        </div>
                        <div class="analyst-radio-option">
                            <input type="radio" id="analyst-type-client" name="analyst-type" value="client">
                            <label for="analyst-type-client">Cliente</label>
                        </div>
                    </div>
                </div>
                <!-- Campo select para clientes (inicialmente oculto) -->
                <div class="analyst-form-group" id="client-select-group" style="display: none;">
                    <label for="client-select">Seleccionar Cliente Existente</label>
                    <select id="client-select" class="analyst-form-control">
                        <option value="">Cargando clientes...</option>
                    </select>
                    <small class="form-text text-muted">Seleccione un cliente existente para asociar con este usuario</small>
                </div>
                <!-- Campo select para analistas (inicialmente oculto) -->
                <div class="analyst-form-group" id="analyst-select-group" style="display: none;">
                    <label for="analyst-select">Seleccionar Analista Existente</label>
                    <select id="analyst-select" class="analyst-form-control">
                        <option value="">Cargando analistas...</option>
                    </select>
                    <small class="form-text text-muted">Seleccione un analista existente para asociar con este usuario</small>
                </div>
                <!-- Campo select para supervisores (inicialmente oculto) -->
                <div class="analyst-form-group" id="supervisor-select-group" style="display: none;">
                    <label for="supervisor-select">Seleccionar Supervisor Existente</label>
                    <select id="supervisor-select" class="analyst-form-control">
                        <option value="">Cargando supervisores...</option>
                    </select>
                    <small class="form-text text-muted">Seleccione un supervisor existente para asociar con este usuario</small>
                </div>
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-add-analyst">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-primary">Crear Usuario</button>
                </div>
            </form>
        </div>
    `;
    
    $('#content-area').html(formHTML);
    
    // Asegurar que ningún radio button esté seleccionado inicialmente
    $('input[name="analyst-type"]').prop('checked', false);
    
    // Ocultar todos los selects inicialmente
    $('#client-select-group, #analyst-select-group, #supervisor-select-group').hide();
    
    // Event listener para mostrar/ocultar los selects según el rol
    $('input[name="analyst-type"]').change(function() {
        const role = $(this).val();
        $('#client-select-group, #analyst-select-group, #supervisor-select-group').hide();
        
        if (role === 'client') {
            $('#client-select-group').show();
            if ($('#client-select option').length <= 1) {
                loadClientsForSelect();
            }
        } else if (role === 'analyst') {
            $('#analyst-select-group').show();
            if ($('#analyst-select option').length <= 1) {
                loadAnalystsForSelect();
            }
        } else if (role === 'supervisor') {
            $('#supervisor-select-group').show();
            if ($('#supervisor-select option').length <= 1) {
                loadSupervisorsForSelect();
            }
        }
    });
    
    $('#add-analyst-form').on('submit', function(e) {
        e.preventDefault();
        addAnalyst();
    });
    
    $('#cancel-add-analyst').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

// Función para cargar supervisores en el select
function loadSupervisorsForSelect() {
    $.ajax({
        url: '/api/all-supervisors',
        method: 'GET',
        success: function(response) {
            // Verificar si la respuesta es exitosa y tiene datos
            if (response && response.success && response.supervisors && response.supervisors.length > 0) {
                const select = $('#supervisor-select');
                select.empty();
                select.append('<option value="">Seleccione un supervisor</option>');
                response.supervisors.forEach(supervisor => {
                    select.append(`<option value="${supervisor.id_supervisor}">${supervisor.id_supervisor} - ${supervisor.nombre_supervisor}</option>`);
                });
            } else {
                $('#supervisor-select').html('<option value="">No hay supervisores disponibles</option>');
            }
        },
        error: function() {
            $('#supervisor-select').html('<option value="">Error al cargar supervisores</option>');
        }
    });
}

// Función para cargar analistas en el select
function loadAnalystsForSelect() {
    $.ajax({
        url: '/api/all-analysts',
        method: 'GET',
        success: function(response) {
            // Verificar si la respuesta es exitosa y tiene datos
            if (response && response.success && response.analysts && response.analysts.length > 0) {
                const select = $('#analyst-select');
                select.empty();
                select.append('<option value="">Seleccione un analista</option>');
                response.analysts.forEach(analyst => {
                    select.append(`<option value="${analyst.id_analista}">${analyst.id_analista} - ${analyst.nombre_analista}</option>`);
                });
            } else {
                $('#analyst-select').html('<option value="">No hay analistas disponibles</option>');
            }
        },
        error: function() {
            $('#analyst-select').html('<option value="">Error al cargar analistas</option>');
        }
    });
}

// Función para cargar clientes en el select
function loadClientsForSelect() {
    $.ajax({
        url: '/api/all-clients',
        method: 'GET',
        success: function(response) {
            if (response && response.length > 0) {
                const select = $('#client-select');
                select.empty();
                select.append('<option value="">Seleccione un cliente</option>');
                
                response.forEach(client => {
                    select.append(`<option value="${client.id}">${client.nombre}</option>`);
                });
            } else {
                $('#client-select').html('<option value="">No hay clientes disponibles</option>');
            }
        },
        error: function() {
            $('#client-select').html('<option value="">Error al cargar clientes</option>');
        }
    });
}

export function showRemoveAnalystForm() {
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-person-x me-2"></i>Eliminar Analista</h3>
            <form id="remove-analyst-form">
                <div class="analyst-form-group">
                    <label for="analyst-username-to-delete">Nombre de usuario</label>
                    <input type="text" id="analyst-username-to-delete" class="analyst-form-control" required>
                </div>
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-remove-analyst">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-primary">Eliminar</button>
                </div>
            </form>
        </div>
    `;
    $('#content-area').html(formHTML);
    
    $('#remove-analyst-form').on('submit', function(e) {
        e.preventDefault();
        removeAnalyst();
    });
    
    $('#cancel-remove-analyst').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

export function addAnalyst() {
    const username = $('#analyst-username').val();
    const email = $('#analyst-email').val();
    const password = $('#analyst-password').val();
    const confirmPassword = $('#analyst-confirm-password').val();
    const role = $('input[name="analyst-type"]:checked').val();
    const clientId = role === 'client' ? $('#client-select').val() : null;
    const analystId = role === 'analyst' ? $('#analyst-select').val() : null;
    const supervisorId = role === 'supervisor' ? $('#supervisor-select').val() : null;
    
    // Validación de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        Swal.fire('Correo inválido', 'Por favor ingrese un correo electrónico válido', 'error');
        return;
    }
    
    if (!username || !password || !confirmPassword) {
        Swal.fire('Campos incompletos', 'Por favor completa todos los campos', 'error');
        return;
    }
    if (password.length < 6) {
        Swal.fire('Contraseña insegura', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    if (password !== confirmPassword) {
        Swal.fire('Contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden', 'error');
        return;
    }
    // Validación adicional para clientes
    if (role === 'client' && !clientId) {
        Swal.fire('Cliente requerido', 'Debe seleccionar un cliente existente', 'error');
        return;
    }
    // Validación adicional para analistas
    if (role === 'analyst' && !analystId) {
        Swal.fire('Analista requerido', 'Debe seleccionar un analista existente', 'error');
        return;
    }
    // Validación adicional para supervisores
    if (role === 'supervisor' && !supervisorId) {
        Swal.fire('Supervisor requerido', 'Debe seleccionar un supervisor existente', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Creando usuario...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    // Preparar datos para enviar
    const requestData = {
        username: username,
        email: email,
        password: password,
        role: role
    };
    
    // Solo agregar client_id si el rol es cliente
    if (role === 'client') {
        requestData.client_id = clientId;
    }
    // Solo agregar analyst_id si el rol es analyst
    if (role === 'analyst') {
        requestData.analyst_id = analystId;
    }
    // Solo agregar supervisor_id si el rol es supervisor
    if (role === 'supervisor') {
        requestData.supervisor_id = supervisorId;
    }
    
    $.ajax({
        url: '/api/add-user',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function(response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario creado',
                    html: `El usuario <b>${username}</b> ha sido registrado como <b>${role}</b>`,
                    timer: 2500,
                    showConfirmButton: false
                });
                $('#add-analyst-form')[0].reset();
                // Ocultar los selects después de crear el usuario
                $('#client-select-group, #analyst-select-group, #supervisor-select-group').hide();
            } else {
                let errorMessage = 'Error al crear el usuario';
                if (response.message === "El nombre de usuario ya existe") {
                    errorMessage = "¡Este nombre de usuario ya está en uso!";
                } else if (response.message === "El correo electrónico ya está en uso") {
                    errorMessage = "¡Este correo electrónico ya está en uso!";
                }
                Swal.fire('Error', errorMessage, 'error');
            }
        },
        error: function(xhr) {
            Swal.close();
            let errorMessage = 'No se pudo conectar con el servidor';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            Swal.fire('Error', errorMessage, 'error');
            console.error('Error en la llamada AJAX:', xhr.responseText);
        }
    });
}

export function removeAnalyst() {
    const username = $('#analyst-username-to-delete').val();
    
    if (!username) {
        Swal.fire({
            icon: 'error',
            title: 'Usuario requerido',
            text: 'Por favor ingresa un nombre de usuario',
        });
        return;
    }
    
    Swal.fire({
        title: '¿Eliminar usuario?',
        html: `¿Estás seguro de eliminar al usuario <b>${username}</b>?<br>Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando usuario...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            
            $.ajax({
                url: '/api/remove-user',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    username: username
                }),
                success: function(response) {
                    Swal.close();
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario eliminado',
                            html: response.message,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        $('#analyst-username-to-delete').val('');
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message
                        });
                    }
                },
                error: function(xhr) {
                    Swal.close();
                    let errorMessage = 'Error de conexión';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    }
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage
                    });
                    console.error('Error en la llamada AJAX:', xhr.responseText);
                }
            });
        }
    });
    
    $('#remove-analyst-form')[0].reset();
}

export function showAddMerchandiserForm() {
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-person-plus me-2"></i>Agregar Mercaderista</h3>
            <form id="add-merchandiser-form">
                <div class="analyst-form-group">
                    <label for="merchandiser-name">Nombre del Mercaderista</label>
                    <input type="text" id="merchandiser-name" class="analyst-form-control" required>
                </div>
                <div class="analyst-form-group">
                    <label for="merchandiser-id">Cédula</label>
                    <input type="text" id="merchandiser-id" class="analyst-form-control" required>
                </div>
                <div class="analyst-form-group">
                    <label for="merchandiser-phone">Teléfono</label>
                    <input type="text" id="merchandiser-phone" class="analyst-form-control" required>
                </div>
                <div class="analyst-form-group">
                    <label>Tipo de Mercaderista</label>
                    <div class="analyst-radio-group">
                        <div class="analyst-radio-option">
                            <input type="radio" id="merchandiser-type-mercaderista" name="merchandiser-type" value="Mercaderista" checked>
                            <label for="merchandiser-type-mercaderista">Mercaderista</label>
                        </div>
                        <div class="analyst-radio-option">
                            <input type="radio" id="merchandiser-type-auditor" name="merchandiser-type" value="Auditor">
                            <label for="merchandiser-type-auditor">Auditor</label>
                        </div>
                    </div>
                </div>
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-add-merchandiser">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-primary">Agregar</button>
                </div>
            </form>
        </div>
    `;
    $('#content-area').html(formHTML);
    
    $('#add-merchandiser-form').on('submit', function(e) {
        e.preventDefault();
        addMerchandiser();
    });
    
    $('#cancel-add-merchandiser').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

export function showRemoveMerchandiserForm() {
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-person-x me-2"></i>Eliminar Mercaderista</h3>
            <form id="remove-merchandiser-form">
                <div class="analyst-form-group">
                    <label for="merchandiser-id-to-delete">Cédula del Mercaderista</label>
                    <input type="text" id="merchandiser-id-to-delete" class="analyst-form-control" required>
                </div>
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-remove-merchandiser">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-primary">Eliminar</button>
                </div>
            </form>
        </div>
    `;
    $('#content-area').html(formHTML);
    
    $('#remove-merchandiser-form').on('submit', function(e) {
        e.preventDefault();
        removeMerchandiser();
    });
    
    $('#cancel-remove-merchandiser').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

export function addMerchandiser() {
    const name = $('#merchandiser-name').val();
    const id = $('#merchandiser-id').val();
    const phone = $('#merchandiser-phone').val();
    const type = $('input[name="merchandiser-type"]:checked').val();
    
    if (!name || !id || !phone) {
        Swal.fire({
            icon: 'error',
            title: 'Campos incompletos',
            text: 'Por favor completa todos los campos',
        });
        return;
    }
    
    if (isNaN(id)) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula inválida',
            text: 'La cédula debe ser un valor numérico',
        });
        return;
    }
    
    // Validar teléfono internacional (mínimo 9 dígitos)
    const phoneRegex = /^(\+\d{1,3})?[\d\s\-\(\)]{9,}$/;
    const cleanPhone = phone.replace(/\s|-|\(|\)/g, '');

    if (cleanPhone.length < 9 || !/^\+?\d+$/.test(cleanPhone)) {
        Swal.fire({
            icon: 'error',
            title: 'Teléfono inválido',
            text: 'El teléfono debe contener al menos 9 dígitos numéricos',
        });
        return;
    }
    
    Swal.fire({
        title: 'Registrando mercaderista...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
    
    $.ajax({
        url: window.currentUserRole === 'admin' ? '/api/add-merchandiser' : '/api/request-add-merchandiser',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            nombre: name,
            cedula: id,
            telefono: phone,
            tipo: type
        }),
        success: function(response) {
            Swal.close();
            if (response.success) {
                const message = window.currentUserRole === 'admin'
                    ? `El mercaderista ${name} ha sido registrado y activado`
                    : `Solicitud de creación de mercaderista enviada. Espera aprobación del administrador.`;
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: message,
                    timer: 2500,
                    showConfirmButton: false
                });
                $('#add-merchandiser-form')[0].reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al registrar el mercaderista'
                });
            }
        },
        error: function(xhr) {
            Swal.close();
            let errorMessage = 'No se pudo conectar con el servidor';
    
            // Extraer mensaje específico del servidor
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    if (response.message) {
                        errorMessage = response.message;
                    }
                } catch (e) {
                    errorMessage = 'Error en la respuesta del servidor';
                }
            }
    
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage // Aquí va el mensaje específico
            });
            console.error('Error en la llamada AJAX:', xhr.responseText);
        }
    });
}

export function removeMerchandiser() {
    const id = $('#merchandiser-id-to-delete').val();
    
    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula requerida',
            text: 'Por favor ingresa la cédula del mercaderista',
        });
        return;
    }
    
    if (isNaN(id)) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula inválida',
            text: 'La cédula debe ser un valor numérico',
        });
        return;
    }
    
Swal.fire({
    title: '¿Eliminar mercaderista?',
    text: window.currentUserRole === 'admin'
        ? `¿Estás seguro de eliminar al mercaderista con cédula ${id}?`
        : `¿Estás seguro de solicitar la eliminación del mercaderista con cédula ${id}? Esta acción requerirá aprobación del administrador.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando mercaderista...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            $.ajax({
                url: window.currentUserRole === 'admin' ? '/api/remove-merchandiser' : '/api/request-remove-merchandiser',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    cedula: id
                }),
                success: function(response) {
                    Swal.close();
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Mercaderista eliminado',
                            text: `Solicitud de eliminar el mercaderista con cédula ${id} creada. Espera aprobacion del administrador.`,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        $('#remove-merchandiser-form')[0].reset();
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || 'No se pudo eliminar el mercaderista'
                        });
                    }
                },
                error: function(xhr) {
                    Swal.close();
                    let errorMessage = 'No se pudo conectar con el servidor';
    
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        errorMessage = xhr.responseJSON.message;
                    } else if (xhr.responseText) {
                        try {
                            const response = JSON.parse(xhr.responseText);
                            errorMessage = response.message || errorMessage;
                        } catch (e) {
                            errorMessage = 'Error en la respuesta del servidor';
                        }
                    }
    
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage
                    });
                }
            });
        }
    });
}

export function showMerchandiserStatusForm() {
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-person-slash me-2"></i>Estado del Mercaderista</h3>
            <form id="merchandiser-status-form-content">
                <div class="analyst-form-group">
                    <label for="merchandiser-status-id">Cédula del Mercaderista</label>
                    <input type="text" id="merchandiser-status-id" class="analyst-form-control" required>
                </div>
                
                <div class="analyst-form-group">
                    <label>Acción:</label>
                    <div class="d-flex gap-3">
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="merchandiserStatus" 
                                   id="enableMerchandiser" value="enable" checked>
                            <label class="form-check-label text-success" for="enableMerchandiser">
                                <i class="bi bi-person-check me-1"></i> Habilitar
                            </label>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="merchandiserStatus" 
                                   id="disableMerchandiser" value="disable">
                            <label class="form-check-label text-danger" for="disableMerchandiser">
                                <i class="bi bi-person-x me-1"></i> Deshabilitar
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-merchandiser-status">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-primary">Aplicar</button>
                </div>
            </form>
        </div>
    `;
    
    $('#content-area').html(formHTML);
    
    // Configurar manejadores de eventos
    $('#merchandiser-status-form-content').on('submit', function(e) {
        e.preventDefault();
        updateMerchandiserStatus();
    });
    
    $('#cancel-merchandiser-status').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

function updateMerchandiserStatus() {
    const cedula = $('#merchandiser-status-id').val().trim();
    const status = $('input[name="merchandiserStatus"]:checked').val();
    
    if (!cedula) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula requerida',
            text: 'Por favor ingresa la cédula del mercaderista',
        });
        return;
    }
    
    if (isNaN(cedula)) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula inválida',
            text: 'La cédula debe ser un valor numérico',
        });
        return;
    }
    
    const actionText = (status === 'enable') ? 'habilita' : 'deshabilita';
    const actionTitle = (status === 'enable') ? 'Habilita' : 'Deshabilita';
    const btnColor = (status === 'enable') ? '#28a745' : '#dc3545';
    
    Swal.fire({
        title: `¿${actionTitle}r mercaderista?`,
        text: `¿Estás seguro de ${actionText}r al mercaderista con cédula ${cedula}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: btnColor,
        cancelButtonColor: '#6c757d',
        confirmButtonText: `Sí, ${actionText}r`,
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: `${actionTitle}...`,
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            
            const url = window.currentUserRole === 'admin'
                ? (status === 'enable' ? '/api/enable-merchandiser' : '/api/disable-merchandiser')
                : '/api/request-toggle-merchandiser-status';
            const payload = window.currentUserRole === 'admin'
                ? { cedula: cedula }
                : { cedula: cedula, action: status }; // 'enable' o 'disable'
            
            $.ajax({
                url: url,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(payload),
                success: function(response) {
                    Swal.close();
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: `Mercaderista ${actionText}do`,
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        // Limpiar el formulario
                        $('#merchandiser-status-id').val('');
                        $('#enableMerchandiser').prop('checked', true);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || `No se pudo ${actionText}r el mercaderista`
                        });
                    }
                },
                error: function(xhr) {
                    Swal.close();
                    const errorMessage = xhr.responseJSON?.message || 'Error en el servidor';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage
                    });
                }
            });
        }
    });
}


export function showDeleteMerchandiserForm() {
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-trash me-2"></i>Eliminar Mercaderista</h3>
            <form id="delete-merchandiser-form">
                <div class="analyst-form-group">
                    <label for="merchandiser-id-to-delete">Cédula del Mercaderista</label>
                    <input type="text" id="merchandiser-id-to-delete" class="analyst-form-control" required>
                </div>
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-delete-merchandiser">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-danger">Eliminar</button>
                </div>
            </form>
        </div>
    `;
    $('#content-area').html(formHTML);
    
    $('#delete-merchandiser-form').on('submit', function(e) {
        e.preventDefault();
        deleteMerchandiser();
    });
    
    $('#cancel-delete-merchandiser').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

function deleteMerchandiser() {
    const id = $('#merchandiser-id-to-delete').val();
    
    if (!id) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula requerida',
            text: 'Por favor ingresa la cédula del mercaderista',
        });
        return;
    }
    
    if (isNaN(id)) {
        Swal.fire({
            icon: 'error',
            title: 'Cédula inválida',
            text: 'La cédula debe ser un valor numérico',
        });
        return;
    }
    
    Swal.fire({
        title: '¿Eliminar mercaderista?',
        html: `¿Estás seguro de eliminar permanentemente al mercaderista con cédula ${id}?<br>Esta acción no se puede deshacer.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Eliminando mercaderista...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            });
            
            $.ajax({
                url: window.currentUserRole === 'admin' ? '/api/delete-merchandiser' : '/api/request-remove-merchandiser',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ cedula: id }),
                success: function(response) {
                    Swal.close();
                    if (response.success) {
                        Swal.fire({
                            icon: 'success',
                            title: 'Mercaderista eliminado',
                            text: response.message,
                            timer: 2000,
                            showConfirmButton: false
                        });
                        $('#delete-merchandiser-form')[0].reset();
                    } else {
                        // Mostrar mensaje de error con posibilidad de redirigir a deshabilitar
                        Swal.fire({
                            icon: 'error',
                            title: 'No se puede eliminar',
                            text: response.message,
                            showCancelButton: true,
                            confirmButtonText: 'Deshabilitar',
                            cancelButtonText: 'Entendido',
                            showConfirmButton: response.message.includes('deshabilitarlo')
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Redirigir al formulario de estado
                                showMerchandiserStatusForm();
                                // Prellenar la cédula y seleccionar deshabilitar
                                $('#merchandiser-status-id').val(id);
                                $('#disableMerchandiser').prop('checked', true);
                            }
                        });
                    }
                },
                error: function(xhr) {
                    Swal.close();
                    const errorMessage = xhr.responseJSON?.message || 'Error en el servidor';
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: errorMessage
                    });
                }
            });
        }
    });
}

// modules/forms.js (agregar después de las funciones existentes)
export function showAddClientForm() {
    if (window.currentUserRole !== 'admin') {
        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para realizar esta acción',
        });
        return;
    }
    const formHTML = `
        <div class="analyst-form-container">
            <h3><i class="bi bi-person-plus me-2"></i>Agregar Nuevo Cliente</h3>
            <form id="add-client-form">
                <div class="analyst-form-group">
                    <label for="client-username">Nombre de Usuario</label>
                    <input type="text" id="client-username" class="analyst-form-control" required
                           placeholder="Ingrese un nombre de usuario único">
                </div>
                <div class="analyst-form-group">
                    <label for="client-password">Contraseña</label>
                    <input type="password" id="client-password" class="analyst-form-control" required
                           placeholder="Mínimo 6 caracteres">
                </div>
                <div class="analyst-form-group">
                    <label for="client-confirm-password">Confirmar Contraseña</label>
                    <input type="password" id="client-confirm-password" class="analyst-form-control" required
                           placeholder="Repita la contraseña">
                </div>
                <div class="analyst-form-actions">
                    <button type="button" class="analyst-btn analyst-btn-secondary" id="cancel-add-client">Cancelar</button>
                    <button type="submit" class="analyst-btn analyst-btn-primary">Crear Cliente</button>
                </div>
            </form>
        </div>
    `;
    $('#content-area').html(formHTML);
    
    $('#add-client-form').on('submit', function(e) {
        e.preventDefault();
        addClient();
    });
    
    $('#cancel-add-client').on('click', function() {
        $('#content-area').html('<div class="alert alert-info">Selecciona una opción del menú para comenzar</div>');
    });
}

export function addClient() {
    const username = $('#client-username').val();
    const password = $('#client-password').val();
    const confirmPassword = $('#client-confirm-password').val();
    
    if (!username || !password || !confirmPassword) {
        Swal.fire('Campos incompletos', 'Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password.length < 6) {
        Swal.fire('Contraseña insegura', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        Swal.fire('Contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden', 'error');
        return;
    }
    
    Swal.fire({
        title: 'Creando cliente...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    $.ajax({
        url: '/api/add-client',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            username: username,
            password: password
        }),
        success: function(response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Cliente creado',
                    html: `El cliente <b>${username}</b> ha sido registrado exitosamente`,
                    timer: 2500,
                    showConfirmButton: false
                });
                $('#add-client-form')[0].reset();
            } else {
                let errorMessage = 'Error al crear el cliente';
                if (response.message === "El nombre de usuario ya existe") {
                    errorMessage = "¡Este nombre de usuario ya está en uso!";
                }
                Swal.fire('Error', errorMessage, 'error');
            }
        },
        error: function(xhr) {
            Swal.close();
            let errorMessage = 'No se pudo conectar con el servidor';
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            }
            Swal.fire('Error', errorMessage, 'error');
        }
    });
}