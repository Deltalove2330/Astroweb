//app/static/js/main.js
import { initTheme } from './modules/theme.js';
import { initSidebar, initModules, toggleSidebar, closeSidebar, updateTogglePosition, updateAriaState } from './modules/sidebar.js';
import { loadUserInfo, setupLogout } from './modules/auth.js';
import { loadClients, loadPendingPoints, selectClient, selectPoint } from './modules/clients.js';
import { 
    setupFormHandlers,
    showAddAnalystForm,
    showRemoveAnalystForm,
    showAddMerchandiserForm,
    showDeleteMerchandiserForm,
    showMerchandiserStatusForm
} from './modules/forms.js';
import { showAlert, showLoading, showError } from './modules/utils.js';
import { loadRequests, initRequestsSidebar } from './requests.js';

// ✅ Variables globales para el chat
window.currentUserId = null;
window.currentUsername = null;

// Variables globales
let currentRejectionReasons = [];
let photoDecisions = {};
let currentRejectingPhotoId = null;

document.addEventListener('DOMContentLoaded', () => {
    let sidebarCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    loadUserInfo();
    initTheme();
    initRequestsSidebar();
    initSidebar(sidebarCollapsed);
    
    initModules();
    loadClients();
    loadPendingPoints();
    setupFormHandlers();
    setupLogout();

    // Manejadores para el menú de Personas
    $('#add-analyst-btn').on('click', function(e) {
        e.preventDefault();
        showAddAnalystForm();
        if ($(window).width() < 768) closeSidebar();
    });
    
    $('#remove-analyst-btn').on('click', function(e) {
        e.preventDefault();
        showRemoveAnalystForm();
        if ($(window).width() < 768) closeSidebar();
    });
    
    $('#add-merchandiser-btn').on('click', function(e) {
        e.preventDefault();
        showAddMerchandiserForm();
        if ($(window).width() < 768) closeSidebar();
    });
    
    $(document).on('click', '#merchandiser-status-toggle', function(e) {
        e.preventDefault();
        showMerchandiserStatusForm();
        if ($(window).width() < 768) closeSidebar();
    });

    $('#toggleSidebar').on('click', () => {
        const $sidebar = $('.sidebar');
        const isMobile = $(window).width() < 768;

        if (isMobile) {
            $sidebar.toggleClass('active');
        } else {
            sidebarCollapsed = !$sidebar.hasClass('collapsed');
            $sidebar.toggleClass('collapsed', sidebarCollapsed);
            localStorage.setItem('sidebarCollapsed', sidebarCollapsed);
        }

        updateTogglePosition();
        updateAriaState();
    });

    $(document).on('click', function (e) {
        if ($(window).width() < 768 &&
            !$(e.target).closest('.sidebar').length &&
            !$(e.target).is('#toggleSidebar') &&
            $('.sidebar').hasClass('active')) {
            closeSidebar();
        }
    });

    $(document).on('click', '#generate-reports-btn', function(e) {
        e.preventDefault();
        window.location.href = '/reporteria/';
        if ($(window).width() < 768) {
            closeSidebar();
        }
    });

    $(document).on('keyup', function (e) {
        if (e.key === "Escape") closeSidebar();
    });

    $(window).on('resize', function () {
        if ($(window).width() >= 768) {
            $('.sidebar').removeClass('active');
        }
        updateTogglePosition();
    });

    $(document).on('click', '#modify-visit-btn', function(e) {
        e.preventDefault();
        loadAllPendingVisits();
        if ($(window).width() < 768) {
            closeSidebar();
        }
    });
    
    window.selectClient = selectClient;
    
    window.formatDate = function(dateString) {
        if (!dateString) return 'Sin fecha';
        
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-VE', {
            timeZone: 'America/Caracas',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(date);
    };

    window.acceptVisit = function(visitId) {
        alert(`Función para aceptar visita #${visitId} - Por implementar`);
    };

    window.rejectVisit = function(visitId) {
        alert(`Función para rechazar visita #${visitId} - Por implementar`);
    };

    window.loadAllPendingVisits = function() {
        showLoading('#content-area', 'Cargando visitas pendientes...');
        
        $.getJSON("/api/all-pending-visits")
            .done(function(visits) {
                renderLoadDataVisits(visits);
            })
            .fail(function() {
                showError('#content-area', 'Error al cargar visitas pendientes');
            });
    };

    window.renderLoadDataVisits = function(visits) {
        let html = `<h4 class="mb-4">Revisión de Datos Cargados</h4>`;

        if (!visits || visits.length === 0) {
            html += `
                <div class="alert alert-info text-center">
                    <i class="bi bi-check-circle fs-1"></i>
                    <p class="mt-2 mb-0">No hay visitas con datos cargados</p>
                </div>
            `;
        } else {
            html += `<div class="visit-grid">`;
            visits.forEach(v => {
                html += `
                    <div class="visit-card" data-visit-id="${v.id}">
                        <h6>Visita #${v.id}</h6>
                        <p><strong>Cliente:</strong> ${v.cliente}</p>
                        <p><strong>Punto:</strong> ${v.punto_interes}</p>
                        <p><strong>Mercaderista:</strong> ${v.mercaderista}</p>
                        <p><strong>Fecha:</strong> ${formatDate(v.fecha)}</p>
                        <a href="/revisar/${v.id}" class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-pencil-square"></i> Revisar datos
                        </a>
                    </div>
                `;
            });
            html += `</div>`;
        }

        $('#content-area').html(html);
    };

    window.loadVisitData = function(visitId) {
        alert(`Función para cargar datos de la visita #${visitId} - Por implementar`);
    };

    window.viewVisitPrice = function(visitId) {
        $.getJSON(`/api/visit-price/${visitId}`)
            .done(data => alert(`Precio: $${data.precio}`))
            .fail(() => alert('Error al cargar precio'));
    };

    window.viewVisitExhibitions = function(visitId) {
        $.getJSON(`/api/visit-exhibitions/${visitId}`)
            .done(data => alert(`Exhibiciones: ${data.join(', ')}`))
            .fail(() => alert('Error al cargar exhibiciones'));
    };

    window.viewPointPhotos = function(pointId) {
        alert(`Aquí irían las fotos del punto ID: ${pointId}`);
    };

    window.viewPointPrice = function(pointId) {
        alert(`Precio del punto ID: ${pointId}`);
    };

    window.viewPointExhibitions = function(pointId) {
        alert(`Exhibiciones del punto ID: ${pointId}`);
    };
    
    window.openReviewModal = openReviewModal;
});

function mostrarDiaActual() {
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date();
    const diaSemana = dias[hoy.getDay()];
}

$(document).ready(function() {
    mostrarDiaActual();

    $('#delete-merchandiser-btn').on('click', function(e) {
        e.preventDefault();
        showDeleteMerchandiserForm();
        if ($(window).width() < 768) closeSidebar();
    });

    $('#merchandiser-status-form').on('submit', function(e) {
        e.preventDefault();
        updateMerchandiserStatus();
    });
    
    $('#cancel-merchandiser-status').click(function() {
        $('#merchandiser-status-form')[0].reset();
        $('#enableMerchandiser').prop('checked', true);
    });

    $('.form-container').removeClass('active');
    $('#default-message').show();

    $('#add-merchandiser-btn').click(function(e) {
        e.preventDefault();
        showForm('add-merchandiser-form');
    });

    $('#merchandiser-status-toggle').click(function(e) {
        e.preventDefault();
        showForm('merchandiser-status-form');
    });

    function showForm(formId) {
        $('.form-container').removeClass('active');
        $('#default-message').hide();
        $('#' + formId).addClass('active');
        $('html, body').animate({
            scrollTop: $('#' + formId).offset().top - 20
        }, 300);
    }

    $('#merchandiser-status-form-content').on('submit', function(e) {
        e.preventDefault();
        updateMerchandiserStatus();
    });
    
    $('#cancel-merchandiser-status').click(function() {
        $('#merchandiser-status-form-content')[0].reset();
        $('#enableMerchandiser').prop('checked', true);
    });
});

window.getImageUrl = function(imagePath) {
    let cleanPath = imagePath
        .replace("X://", "")
        .replace("X:/", "")
        .replace(/\\/g, "/")
        .replace(/^\//, "");
    
    return `/api/image/${encodeURIComponent(cleanPath)}`;
};

window.savePhotoSelection = function () {
    const visitId = window.currentVisitId;
    if (!visitId) {
        Swal.fire('Error', 'No hay visita activa seleccionada', 'error');
        return;
    }

    const decisions = [];

    function processSection(selector, sectionName) {
        $(`${selector} .photo-item`).each(function () {
            const photoItem = $(this);
            const photoId = photoItem.data('id-foto');
            const selectedRadio = photoItem.find('.photo-decision:checked');

            if (!photoId) {
                console.warn(`⚠️ ${sectionName}: Sin id_foto`);
                return;
            }

            if (selectedRadio.length === 0) {
                console.info(`ℹ️ ${sectionName}: Sin selección para ID ${photoId}`);
                return;
            }

            decisions.push({
                id_foto: photoId,
                status: selectedRadio.val()
            });
        });
    }

    processSection('#gallery-antes', 'ANTES');
    processSection('#gallery-despues', 'DESPUÉS');

    if (decisions.length === 0) {
        Swal.fire('Atención', 'No se seleccionó ninguna foto o faltan IDs', 'warning');
        return;
    }

    Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    $.ajax({
        url: '/api/photos/save-decisions',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ visit_id: visitId, decisions }),
        success: function (response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Guardado',
                    text: response.message,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    $('#galleryModal').modal('hide');
                });
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function (xhr) {
            Swal.close();
            Swal.fire('Error', xhr.responseJSON?.message || 'Error al guardar', 'error');
        }
    });
};

window.viewVisitPhotos = function(visitId) {
    window.currentVisitId = visitId;
    photoDecisions = {};
    
    $.getJSON("/api/rejection-reasons")
        .done(function(reasons) {
            currentRejectionReasons = reasons;
            renderRejectionReasons(reasons);
            
            $.getJSON(`/api/visit-photos-with-ids/${visitId}`)
                .done(function(photos) {
                    renderPhotoGallery(photos);
                    $('#galleryModal').modal('show');
                })
                .fail(function() {
                    Swal.fire('Error', 'No se pudieron cargar las fotos', 'error');
                });
        })
        .fail(function() {
            Swal.fire('Error', 'No se pudieron cargar las razones de rechazo', 'error');
        });
};

function renderRejectionReasons(reasons) {
    const container = $('#rejectionReasonsList');
    container.empty();
    
    reasons.forEach(reason => {
        container.append(`
            <div class="form-check reason-option">
                <input class="form-check-input" type="radio" name="rejectionReason" 
                       id="reason-${reason.id}" value="${reason.id}" data-reason="${reason.razon}">
                <label class="form-check-label" for="reason-${reason.id}">
                    ${reason.razon}
                </label>
            </div>
        `);
    });
    
    container.append(`
        <div class="form-check reason-option">
            <input class="form-check-input" type="radio" name="rejectionReason" 
                   id="reason-other" value="other">
            <label class="form-check-label" for="reason-other">
                Otra
            </label>
        </div>
    `);
    
    $('input[name="rejectionReason"]').change(function() {
        const value = $(this).val();
        if (value === 'other') {
            $('#otherReasonContainer').show();
        } else {
            $('#otherReasonContainer').hide();
        }
    });
}

function renderPhotoGallery(photos) {
    const antesContainer = $('#gallery-antes');
    const despuesContainer = $('#gallery-despues');
    
    antesContainer.empty();
    despuesContainer.empty();
    
    const antesPhotos = photos.filter(p => p.type === "antes");
    if (antesPhotos.length > 0) {
        antesPhotos.forEach(photo => {
            antesContainer.append(createPhotoItem(photo));
        });
    } else {
        antesContainer.append('<p class="text-muted text-center">No hay fotos del antes</p>');
    }
    
    const despuesPhotos = photos.filter(p => p.type === "despues");
    if (despuesPhotos.length > 0) {
        despuesPhotos.forEach(photo => {
            despuesContainer.append(createPhotoItem(photo));
        });
    } else {
        despuesContainer.append('<p class="text-muted text-center">No hay fotos del después</p>');
    }
    
    $('.approve-btn').click(function() {
        const photoId = $(this).closest('.photo-item').data('id');
        approvePhoto(photoId);
    });
    
    $('.reject-btn').click(function() {
        const photoId = $(this).closest('.photo-item').data('id');
        openRejectionModal(photoId);
    });
}

function createPhotoItem(photo) {
    if (!photoDecisions[photo.id_foto]) {
        photoDecisions[photo.id_foto] = {
            status: photo.Estado === 'Aprobada' ? 'approved' : 
                   photo.Estado === 'Rechazada' ? 'rejected' : 'pending',
            reasonId: null,
            description: ''
        };
    }
    
    const decision = photoDecisions[photo.id_foto];
    const statusClass = decision.status === 'approved' ? 'approved' : 
                       decision.status === 'rejected' ? 'rejected' : 'pending';
    const statusText = decision.status === 'approved' ? 'Aprobada' : 
                      decision.status === 'rejected' ? 'Rechazada' : 'Pendiente';
    
    return `
        <div class="photo-item ${statusClass}" data-id="${photo.id_foto}">
            <span class="photo-status status-${decision.status}">${statusText}</span>
            <img src="${window.getImageUrl(photo.file_path)}" class="img-fluid" alt="${photo.type}">
            <div class="photo-controls">
                <button class="btn btn-sm btn-success approve-btn">
                    <i class="bi bi-check-circle"></i> Aprobar
                </button>
                <button class="btn btn-sm btn-danger reject-btn">
                    <i class="bi bi-x-circle"></i> Rechazar
                </button>
            </div>
        </div>
    `;
}

function approvePhoto(photoId) {
    photoDecisions[photoId] = {
        status: 'approved',
        reasonId: null,
        description: ''
    };
    
    $(`.photo-item[data-id="${photoId}"]`)
        .removeClass('pending rejected')
        .addClass('approved')
        .find('.photo-status')
        .removeClass('status-pending status-rejected')
        .addClass('status-approved')
        .text('Aprobada');
}

function openRejectionModal(photoId) {
    currentRejectingPhotoId = photoId;
    $('input[name="rejectionReason"]').prop('checked', false);
    $('#otherReasonContainer').hide();
    $('#otherReasonText').val('');
    $('#rejectionModal').modal('show');
}

$('#confirmRejectionBtn').click(function() {
    if (!currentRejectingPhotoId) return;
    
    const selectedReason = $('input[name="rejectionReason"]:checked');
    if (selectedReason.length === 0) {
        Swal.fire('Atención', 'Debe seleccionar una razón de rechazo', 'warning');
        return;
    }
    
    const reasonValue = selectedReason.val();
    let reasonId = null;
    let description = '';
    
    if (reasonValue === 'other') {
        description = $('#otherReasonText').val().trim();
        if (!description) {
            Swal.fire('Atención', 'Debe proporcionar una descripción para la razón "Otra"', 'warning');
            return;
        }
    } else {
        reasonId = parseInt(reasonValue);
        description = "";
    }
    
    photoDecisions[currentRejectingPhotoId] = {
        status: 'rejected',
        reasonId: reasonId,
        description: description
    };
    
    $(`.photo-item[data-id="${currentRejectingPhotoId}"]`)
        .removeClass('pending approved')
        .addClass('rejected')
        .find('.photo-status')
        .removeClass('status-pending status-approved')
        .addClass('status-rejected')
        .text('Rechazada');
    
    $('#rejectionModal').modal('hide');
    currentRejectingPhotoId = null;
});

$('#saveDecisionsBtn').click(function() {
    const approvedPhotos = [];
    const rejectedPhotos = [];
    
    Object.keys(photoDecisions).forEach(photoId => {
        const decision = photoDecisions[photoId];
        
        if (decision.status === 'approved') {
            approvedPhotos.push(parseInt(photoId));
        } else if (decision.status === 'rejected') {
            rejectedPhotos.push({
                id_foto: parseInt(photoId),
                rejection_reason_id: decision.reasonId,
                rejection_description: decision.description
            });
        }
    });
    
    if (approvedPhotos.length === 0 && rejectedPhotos.length === 0) {
        Swal.fire('Información', 'No hay decisiones que guardar. Todas las fotos permanecerán sin revisar.', 'info');
        return;
    }
    
    Swal.fire({
        title: 'Guardando decisiones...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    $.ajax({
        url: '/api/save-photo-decisions',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            visit_id: window.currentVisitId,
            approved_photos: approvedPhotos,
            rejected_photos: rejectedPhotos
        }),
        success: function(response) {
            Swal.close();
            if (response.success) {
                Swal.fire('Éxito', response.message, 'success').then(() => {
                    $('#galleryModal').modal('hide');
                });
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function(xhr) {
            Swal.close();
            Swal.fire('Error', 'Error al guardar las decisiones', 'error');
        }
    });
});

$('#add-client-btn').on('click', function(e) {
    e.preventDefault();
    showAddClientForm();
    if ($(window).width() < 768) closeSidebar();
});