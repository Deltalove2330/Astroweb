// /static/js/main.js
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

// ✅ Variables globales para carruseles y decisiones
let currentPriceIndex = 0;
let pricePhotos = [];
let priceDecisions = {};
let currentRejectingPricePhoto = null;

let currentExhibitionIndex = 0;
let exhibitionPhotos = [];
let exhibitionDecisions = {};
let currentRejectingExhibitionPhoto = null;

// Variables globales para fotos gestión
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
        console.log(`Aceptar visita ${visitId}`);
    };

    window.rejectVisit = function(visitId) {
        console.log(`Rechazar visita ${visitId}`);
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
        console.log(`Cargar datos de visita ${visitId}`);
    };

    // ✅ FUNCIÓN PARA VER PRECIOS - CARGA LAZY DE RAZONES
    window.viewVisitPrice = function(visitId) {
        window.currentVisitId = visitId;
        
        $.getJSON(`/api/visit-price-photos/${visitId}`)
            .done(function(photos) {
                if (photos && photos.length > 0) {
                    renderPriceGalleryWithDecisions(photos);
                } else {
                    Swal.fire('Información', 'No hay fotos de precios para esta visita', 'info');
                }
            })
            .fail(function() {
                Swal.fire('Error', 'No se pudieron cargar las fotos de precios', 'error');
            });
    };

    // ✅ FUNCIÓN PARA VER EXHIBICIONES - CARGA LAZY DE RAZONES
    window.viewVisitExhibitions = function(visitId) {
        window.currentVisitId = visitId;
        
        $.getJSON(`/api/visit-exhibition-photos/${visitId}`)
            .done(function(photos) {
                if (photos && photos.length > 0) {
                    renderExhibitionGalleryWithDecisions(photos);
                } else {
                    Swal.fire('Información', 'No hay fotos de exhibiciones para esta visita', 'info');
                }
            })
            .fail(function() {
                Swal.fire('Error', 'No se pudieron cargar las fotos de exhibiciones', 'error');
            });
    };

    window.viewPointPhotos = function(pointId) {
        console.log(`Ver fotos punto ${pointId}`);
    };

    window.viewPointPrice = function(pointId) {
        console.log(`Ver precio punto ${pointId}`);
    };

    window.viewPointExhibitions = function(pointId) {
        console.log(`Ver exhibiciones punto ${pointId}`);
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

// ========================================
// FUNCIONES DE FOTOS ANTES/DESPUÉS (GESTIÓN)
// ========================================

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
    currentRejectingPricePhoto = null;
    currentRejectingExhibitionPhoto = null;
    
    $('input[name="rejectionReason"]').prop('checked', false);
    $('#otherReasonContainer').hide();
    $('#otherReasonText').val('');
    $('#rejectionModal').modal('show');
}

// ✅ CONFIRMACIÓN DE RECHAZO - MANEJA TODOS LOS TIPOS
$('#confirmRejectionBtn').click(function() {
    const selectedReason = $('input[name="rejectionReason"]:checked');
    if (selectedReason.length === 0) {
        Swal.fire('Atención', 'Debe seleccionar una razón de rechazo', 'warning');
        return;
    }
    
    const reasonValue = selectedReason.val();
    let reasonId = null;
    let description = '';
    let razones = [];
    
    if (reasonValue === 'other') {
        description = $('#otherReasonText').val().trim();
        if (!description) {
            Swal.fire('Atención', 'Debe proporcionar una descripción', 'warning');
            return;
        }
        razones = ['Otra'];
    } else {
        reasonId = parseInt(reasonValue);
        const reasonText = $(`label[for="reason-${reasonValue}"]`).text().trim();
        razones = [reasonText];
        description = "";
    }
    
    // ✅ MANEJAR RECHAZO DE FOTO DE EXHIBICIÓN
    if (currentRejectingExhibitionPhoto) {
        exhibitionDecisions[currentRejectingExhibitionPhoto.id_foto] = {
            status: 'rejected',
            razones: razones,
            descripcion: description
        };
        
        updateExhibitionStatusDisplay();
        
        if (currentExhibitionIndex < exhibitionPhotos.length - 1) {
            setTimeout(() => {
                currentExhibitionIndex++;
                updateExhibitionDisplay();
            }, 500);
        }
        
        currentRejectingExhibitionPhoto = null;
    }
    // ✅ MANEJAR RECHAZO DE FOTO DE PRECIO
    else if (currentRejectingPricePhoto) {
        priceDecisions[currentRejectingPricePhoto.id_foto] = {
            status: 'rejected',
            razones: razones,
            descripcion: description
        };
        
        updatePriceStatusDisplay();
        
        if (currentPriceIndex < pricePhotos.length - 1) {
            setTimeout(() => {
                currentPriceIndex++;
                updatePriceDisplay();
            }, 500);
        }
        
        currentRejectingPricePhoto = null;
    }
    // ✅ MANEJAR RECHAZO DE FOTO NORMAL (GESTIÓN)
    else if (currentRejectingPhotoId) {
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
        
        currentRejectingPhotoId = null;
    }
    
    $('#rejectionModal').modal('hide');
    
    // ✅ REABRIR MODAL DE PRECIOS SI ESTABA ABIERTO
    if (currentRejectingPricePhoto || window.currentPriceModalOpen) {
        setTimeout(function() {
            $('#priceModal').modal('show');
        }, 300);
    }
    
    // ✅ REABRIR MODAL DE EXHIBICIONES SI ESTABA ABIERTO
    if (currentRejectingExhibitionPhoto || window.currentExhibitionModalOpen) {
        setTimeout(function() {
            $('#exhibitionModal').modal('show');
        }, 300);
    }
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
        Swal.fire('Información', 'No hay decisiones que guardar', 'info');
        return;
    }
    
    Swal.fire({
        title: 'Guardando...',
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
        error: function() {
            Swal.close();
            Swal.fire('Error', 'Error al guardar', 'error');
        }
    });
});

// ========================================
// CARRUSEL DE FOTOS DE PRECIOS
// ========================================

function renderPriceGalleryWithDecisions(photos) {
    pricePhotos = photos;
    currentPriceIndex = 0;
    priceDecisions = {};
    
    photos.forEach(photo => {
        priceDecisions[photo.id_foto] = {
            status: 'pending',
            razones: [],
            descripcion: ''
        };
    });

    const modalContent = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Fotos de Precios - Visita #${window.currentVisitId}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${photos.length > 0 ? `
                    <div class="price-gallery-container">
                        <div class="text-center mb-3">
                            <span class="badge bg-primary">Foto ${currentPriceIndex + 1} de ${photos.length}</span>
                        </div>
                        
                        <div class="price-carousel">
                            <div class="carousel-navigation d-flex justify-content-between align-items-center mb-3">
                                <button class="btn btn-outline-primary" id="prev-price-btn" ${currentPriceIndex === 0 ? 'disabled' : ''}>
                                    <i class="bi bi-chevron-left"></i> Anterior
                                </button>
                                
                                <div class="current-photo-container text-center">
                                    <img id="current-price-image" 
                                         src="${window.getImageUrl(photos[0].file_path)}" 
                                         class="img-fluid rounded shadow" 
                                         style="max-height: 400px; max-width: 100%; object-fit: contain;">
                                </div>
                                
                                <button class="btn btn-outline-primary" id="next-price-btn" ${currentPriceIndex === photos.length - 1 ? 'disabled' : ''}>
                                    Siguiente <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                            
                            <div class="price-controls text-center mt-4">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-success btn-lg" id="approve-price-btn">
                                        <i class="bi bi-check-circle"></i> Aprobar
                                    </button>
                                    <button type="button" class="btn btn-danger btn-lg" id="reject-price-btn">
                                        <i class="bi bi-x-circle"></i> Rechazar
                                    </button>
                                </div>
                                
                                <div class="mt-3">
                                    <span id="current-price-status" class="badge bg-secondary fs-6">Pendiente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : 
                    '<div class="alert alert-info text-center">No hay fotos de precios</div>'
                    }
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="save-all-price-decisions">Guardar decisiones</button>
                </div>
            </div>
        </div>
    `;
    
    let $modal = $('#priceModal');
    if ($modal.length === 0) {
        $modal = $(`<div class="modal fade" id="priceModal" tabindex="-1"></div>`);
        $('body').append($modal);
    }
    
    $modal.html(modalContent);
    const priceModal = new bootstrap.Modal($modal[0], {
        backdrop: 'static',
        keyboard: false
    });
    priceModal.show();
    
    setupPriceGalleryEvents();
    updatePriceStatusDisplay();
}

function setupPriceGalleryEvents() {
    const $modal = $('#priceModal');
    window.currentPriceModalOpen = true;
    
    $modal.on('hidden.bs.modal', function() {
        window.currentPriceModalOpen = false;
    });
    
    $modal.on('click', '#prev-price-btn', function() {
        if (currentPriceIndex > 0) {
            currentPriceIndex--;
            updatePriceDisplay();
        }
    });
    
    $modal.on('click', '#next-price-btn', function() {
        if (currentPriceIndex < pricePhotos.length - 1) {
            currentPriceIndex++;
            updatePriceDisplay();
        }
    });
    
    $modal.on('click', '#approve-price-btn', function() {
        const currentPhoto = pricePhotos[currentPriceIndex];
        priceDecisions[currentPhoto.id_foto] = {
            status: 'approved',
            razones: [],
            descripcion: ''
        };
        updatePriceStatusDisplay();
        
        if (currentPriceIndex < pricePhotos.length - 1) {
            setTimeout(() => {
                currentPriceIndex++;
                updatePriceDisplay();
            }, 500);
        }
    });
    
    $modal.on('click', '#reject-price-btn', function() {
        const currentPhoto = pricePhotos[currentPriceIndex];
        currentRejectingPricePhoto = currentPhoto;
        currentRejectingPhotoId = null;
        currentRejectingExhibitionPhoto = null;
        
        // ✅ RESETEAR FORMULARIO
        $('input[name="rejectionReason"]').prop('checked', false);
        $('#otherReasonContainer').hide();
        $('#otherReasonText').val('');
        
        // ✅ OCULTAR EL MODAL DE PRECIOS TEMPORALMENTE
        const $priceModal = $('#priceModal');
        $priceModal.modal('hide');
        
        // ✅ CARGAR RAZONES Y MOSTRAR MODAL
        if (!currentRejectionReasons || currentRejectionReasons.length === 0) {
            $.getJSON("/api/rejection-reasons")
                .done(function(reasons) {
                    currentRejectionReasons = reasons;
                    renderRejectionReasons(reasons);
                    
                    setTimeout(function() {
                        $('#rejectionModal').modal('show');
                    }, 300);
                })
                .fail(function() {
                    Swal.fire('Error', 'No se pudieron cargar las razones', 'error');
                    $priceModal.modal('show');
                });
        } else {
            setTimeout(function() {
                $('#rejectionModal').modal('show');
            }, 300);
        }
    });
    
    $modal.on('click', '#save-all-price-decisions', function() {
        saveAllPriceDecisions();
    });
}

function updatePriceDisplay() {
    const currentPhoto = pricePhotos[currentPriceIndex];
    const $modal = $('#priceModal');
    
    $modal.find('#current-price-image').attr('src', window.getImageUrl(currentPhoto.file_path));
    $modal.find('.badge.bg-primary').text(`Foto ${currentPriceIndex + 1} de ${pricePhotos.length}`);
    $modal.find('#prev-price-btn').prop('disabled', currentPriceIndex === 0);
    $modal.find('#next-price-btn').prop('disabled', currentPriceIndex === pricePhotos.length - 1);
    
    updatePriceStatusDisplay();
}

function updatePriceStatusDisplay() {
    const currentPhoto = pricePhotos[currentPriceIndex];
    const decision = priceDecisions[currentPhoto.id_foto];
    const $statusBadge = $('#current-price-status');
    
    if (decision && decision.status === 'approved') {
        $statusBadge.removeClass('bg-secondary bg-danger').addClass('bg-success').text('Aprobada');
    } else if (decision && decision.status === 'rejected') {
        $statusBadge.removeClass('bg-secondary bg-success').addClass('bg-danger').text('Rechazada');
    } else {
        $statusBadge.removeClass('bg-success bg-danger').addClass('bg-secondary').text('Pendiente');
    }
}

function saveAllPriceDecisions() {
    const decisions = [];
    
    pricePhotos.forEach(photo => {
        const decision = priceDecisions[photo.id_foto];
        if (decision && decision.status !== 'pending') {
            decisions.push({
                id_foto: photo.id_foto,
                status: decision.status,
                razones: decision.razones,
                descripcion: decision.descripcion
            });
        }
    });
    
    if (decisions.length === 0) {
        Swal.fire('Información', 'No hay decisiones que guardar', 'info');
        return;
    }
    
    Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    $.ajax({
        url: '/api/save-price-decisions',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            visit_id: window.currentVisitId,
            decisions: decisions
        }),
        success: function(response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: `Guardadas ${decisions.length} decisiones`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance($('#priceModal')[0]);
                    modal.hide();
                });
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function() {
            Swal.close();
            Swal.fire('Error', 'Error al guardar', 'error');
        }
    });
}

// ========================================
// CARRUSEL DE EXHIBICIONES CON DECISIONES
// ========================================

function renderExhibitionGalleryWithDecisions(photos) {
    currentExhibitionIndex = 0;
    exhibitionPhotos = photos;
    exhibitionDecisions = {};
    
    photos.forEach(photo => {
        exhibitionDecisions[photo.id_foto] = {
            status: 'pending',
            razones: [],
            descripcion: ''
        };
    });
    
    const modalContent = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Fotos de Exhibiciones - Visita #${window.currentVisitId}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${photos.length > 0 ? `
                    <div class="exhibition-gallery-container">
                        <div class="text-center mb-3">
                            <span class="badge bg-primary">Foto ${currentExhibitionIndex + 1} de ${photos.length}</span>
                        </div>
                        
                        <div class="exhibition-carousel">
                            <div class="carousel-navigation d-flex justify-content-between align-items-center mb-3">
                                <button class="btn btn-outline-primary" id="prev-exhibition-btn" ${currentExhibitionIndex === 0 ? 'disabled' : ''}>
                                    <i class="bi bi-chevron-left"></i> Anterior
                                </button>
                                
                                <div class="current-photo-container text-center">
                                    <img id="current-exhibition-image" 
                                         src="${window.getImageUrl(photos[0].file_path)}" 
                                         class="img-fluid rounded shadow" 
                                         style="max-height: 400px; max-width: 100%; object-fit: contain;">
                                </div>
                                
                                <button class="btn btn-outline-primary" id="next-exhibition-btn" ${currentExhibitionIndex === photos.length - 1 ? 'disabled' : ''}>
                                    Siguiente <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                            
                            <div class="exhibition-controls text-center mt-4">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-success btn-lg" id="approve-exhibition-btn">
                                        <i class="bi bi-check-circle"></i> Aprobar
                                    </button>
                                    <button type="button" class="btn btn-danger btn-lg" id="reject-exhibition-btn">
                                        <i class="bi bi-x-circle"></i> Rechazar
                                    </button>
                                </div>
                                
                                <div class="mt-3">
                                    <span id="current-exhibition-status" class="badge bg-secondary fs-6">Pendiente</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : 
                    '<div class="alert alert-info text-center">No hay fotos de exhibiciones</div>'
                    }
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="save-all-exhibition-decisions">Guardar decisiones</button>
                </div>
            </div>
        </div>
    `;
    
    let $modal = $('#exhibitionModal');
    if ($modal.length === 0) {
        $modal = $(`<div class="modal fade" id="exhibitionModal" tabindex="-1"></div>`);
        $('body').append($modal);
    }
    
    $modal.html(modalContent);
    const exhibitionModal = new bootstrap.Modal($modal[0], {
        backdrop: 'static',
        keyboard: false
    });
    exhibitionModal.show();
    
    setupExhibitionGalleryEvents();
    updateExhibitionStatusDisplay();
}

function setupExhibitionGalleryEvents() {
    const $modal = $('#exhibitionModal');
    window.currentExhibitionModalOpen = true;
    
    $modal.on('hidden.bs.modal', function() {
        window.currentExhibitionModalOpen = false;
    });
    
    $modal.on('click', '#prev-exhibition-btn', function() {
        if (currentExhibitionIndex > 0) {
            currentExhibitionIndex--;
            updateExhibitionDisplay();
        }
    });
    
    $modal.on('click', '#next-exhibition-btn', function() {
        if (currentExhibitionIndex < exhibitionPhotos.length - 1) {
            currentExhibitionIndex++;
            updateExhibitionDisplay();
        }
    });
    
    $modal.on('click', '#approve-exhibition-btn', function() {
        const currentPhoto = exhibitionPhotos[currentExhibitionIndex];
        exhibitionDecisions[currentPhoto.id_foto] = {
            status: 'approved',
            razones: [],
            descripcion: ''
        };
        updateExhibitionStatusDisplay();
        
        if (currentExhibitionIndex < exhibitionPhotos.length - 1) {
            setTimeout(() => {
                currentExhibitionIndex++;
                updateExhibitionDisplay();
            }, 500);
        }
    });
    
    $modal.on('click', '#reject-exhibition-btn', function() {
        const currentPhoto = exhibitionPhotos[currentExhibitionIndex];
        currentRejectingExhibitionPhoto = currentPhoto;
        currentRejectingPhotoId = null;
        currentRejectingPricePhoto = null;
        
        // ✅ RESETEAR FORMULARIO
        $('input[name="rejectionReason"]').prop('checked', false);
        $('#otherReasonContainer').hide();
        $('#otherReasonText').val('');
        
        // ✅ OCULTAR EL MODAL DE EXHIBICIONES TEMPORALMENTE
        const $exhibitionModal = $('#exhibitionModal');
        $exhibitionModal.modal('hide');
        
        // ✅ CARGAR RAZONES Y MOSTRAR MODAL
        if (!currentRejectionReasons || currentRejectionReasons.length === 0) {
            $.getJSON("/api/rejection-reasons")
                .done(function(reasons) {
                    currentRejectionReasons = reasons;
                    renderRejectionReasons(reasons);
                    
                    setTimeout(function() {
                        $('#rejectionModal').modal('show');
                    }, 300);
                })
                .fail(function() {
                    Swal.fire('Error', 'No se pudieron cargar las razones', 'error');
                    $exhibitionModal.modal('show');
                });
        } else {
            setTimeout(function() {
                $('#rejectionModal').modal('show');
            }, 300);
        }
    });
    
    $modal.on('click', '#save-all-exhibition-decisions', function() {
        saveAllExhibitionDecisions();
    });
    
    $(document).on('keydown', function(e) {
        if ($('#exhibitionModal').is(':visible')) {
            if (e.key === 'ArrowLeft') {
                $('#prev-exhibition-btn').click();
            } else if (e.key === 'ArrowRight') {
                $('#next-exhibition-btn').click();
            }
        }
    });
}

function updateExhibitionDisplay() {
    const currentPhoto = exhibitionPhotos[currentExhibitionIndex];
    const $modal = $('#exhibitionModal');
    
    $modal.find('#current-exhibition-image').attr('src', window.getImageUrl(currentPhoto.file_path));
    $modal.find('.badge.bg-primary').text(`Foto ${currentExhibitionIndex + 1} de ${exhibitionPhotos.length}`);
    $modal.find('#prev-exhibition-btn').prop('disabled', currentExhibitionIndex === 0);
    $modal.find('#next-exhibition-btn').prop('disabled', currentExhibitionIndex === exhibitionPhotos.length - 1);
    
    updateExhibitionStatusDisplay();
}

function updateExhibitionStatusDisplay() {
    const currentPhoto = exhibitionPhotos[currentExhibitionIndex];
    const decision = exhibitionDecisions[currentPhoto.id_foto];
    const $statusBadge = $('#current-exhibition-status');
    
    if (decision && decision.status === 'approved') {
        $statusBadge.removeClass('bg-secondary bg-danger').addClass('bg-success').text('Aprobada');
    } else if (decision && decision.status === 'rejected') {
        $statusBadge.removeClass('bg-secondary bg-success').addClass('bg-danger').text('Rechazada');
    } else {
        $statusBadge.removeClass('bg-success bg-danger').addClass('bg-secondary').text('Pendiente');
    }
}

function saveAllExhibitionDecisions() {
    const decisions = [];
    
    exhibitionPhotos.forEach(photo => {
        const decision = exhibitionDecisions[photo.id_foto];
        if (decision && decision.status !== 'pending') {
            decisions.push({
                id_foto: photo.id_foto,
                status: decision.status,
                razones: decision.razones,
                descripcion: decision.descripcion
            });
        }
    });
    
    if (decisions.length === 0) {
        Swal.fire('Información', 'No hay decisiones que guardar', 'info');
        return;
    }
    
    Swal.fire({
        title: 'Guardando...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });
    
    $.ajax({
        url: '/api/save-exhibition-decisions',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            visit_id: window.currentVisitId,
            decisions: decisions
        }),
        success: function(response) {
            Swal.close();
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: `Guardadas ${decisions.length} decisiones`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance($('#exhibitionModal')[0]);
                    modal.hide();
                });
            } else {
                Swal.fire('Error', response.message, 'error');
            }
        },
        error: function() {
            Swal.close();
            Swal.fire('Error', 'Error al guardar', 'error');
        }
    });
}

$('#add-client-btn').on('click', function(e) {
    e.preventDefault();
    showAddClientForm();
    if ($(window).width() < 768) closeSidebar();
});

// ========================================
// FUNCIONES DE ACTIVACIONES - VERSIÓN PUNTO
// ========================================
// ========================================
// FUNCIONES DE ACTIVACIONES - VERSIÓN MÚLTIPLE
// ========================================

// Variables globales para activaciones
let currentActivationPointId = null;
let currentActivationPointName = null;

/**
 * Función principal para abrir el modal de activaciones de un punto
 */
window.viewPointActivations = function(pointId, pointName) {
    currentActivationPointId = pointId;
    currentActivationPointName = pointName;
    
    // Actualizar nombre del punto en el header
    $('#activationPointName').html(`<i class="bi bi-geo-alt-fill"></i> ${pointName}`);
    
    // Cargar estadísticas del día actual
    loadActivationStats(pointId);
    
    // Cargar fechas disponibles
    $.getJSON(`/api/point-activation-dates/${pointId}`)
        .done(function(fechas) {
            const $selector = $('#activationDateSelector');
            $selector.empty();
            
            if (fechas && fechas.length > 0) {
                const today = new Date().toISOString().split('T')[0];
                let todayExists = false;
                
                // Poblar selector de fechas
                fechas.forEach((fecha) => {
                    const isToday = fecha === today;
                    const displayText = isToday ? 
                        `📅 ${formatDateSpanish(fecha)} (HOY)` : 
                        `📅 ${formatDateSpanish(fecha)}`;
                    
                    $selector.append(`<option value="${fecha}">${displayText}</option>`);
                    if (isToday) todayExists = true;
                });
                
                // Seleccionar fecha actual si existe, sino la primera
                if (todayExists) {
                    $selector.val(today);
                } else {
                    $selector.val(fechas[0]);
                }
                
                // Cargar activaciones de la fecha seleccionada
                loadActivationPhotosByDate(pointId, $selector.val());
            } else {
                $selector.append('<option value="">No hay fechas disponibles</option>');
                showNoActivations();
            }
            
            // Event listener para cambio de fecha
            $selector.off('change').on('change', function() {
                const selectedDate = $(this).val();
                if (selectedDate) {
                    loadActivationPhotosByDate(pointId, selectedDate);
                }
            });
            
            // Mostrar modal
            $('#activationModal').modal('show');
        })
        .fail(function() {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las fechas de activaciones',
                confirmButtonColor: '#667eea'
            });
        });
};

/**
 * Carga las estadísticas de activaciones del día actual
 */
function loadActivationStats(pointId) {
    // Mostrar loading
    $('#statActivaciones').html('<div class="spinner-border spinner-border-sm"></div>');
    $('#statDesactivaciones').html('<div class="spinner-border spinner-border-sm"></div>');
    
    $.getJSON(`/api/point-activation-count/${pointId}`)
        .done(function(data) {
            $('#statActivaciones').text(data.activaciones || 0);
            $('#statDesactivaciones').text(data.desactivaciones || 0);
        })
        .fail(function() {
            $('#statActivaciones').text('0');
            $('#statDesactivaciones').text('0');
        });
}

/**
 * Formatea una fecha en español
 * Ejemplo: "Lunes, 20 de enero de 2025"
 */
function formatDateSpanish(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    const options = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const formatted = date.toLocaleDateString('es-VE', options);
    // Capitalizar primera letra
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Formatea fecha y hora completa en español
 * Ejemplo: "Lunes, 20 de enero de 2025 a las 08:45:30 AM"
 */
function formatDateTime(dateTimeString) {
    if (!dateTimeString) return 'No disponible';
    
    const date = new Date(dateTimeString);
    
    // Formato de fecha
    const dateOptions = { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    // Formato de hora
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const dateStr = date.toLocaleDateString('es-VE', dateOptions);
    const timeStr = date.toLocaleTimeString('es-VE', timeOptions);
    
    // Capitalizar primera letra de la fecha
    const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    
    return `${formattedDate} a las ${timeStr}`;
}

/**
 * Carga todas las activaciones de un punto en una fecha específica
 */
function loadActivationPhotosByDate(pointId, fecha) {
    // Mostrar loading
    $('#allActivationsContainer').html(`
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-3">Cargando todas las activaciones del punto...</p>
        </div>
    `);
    
    $.getJSON(`/api/point-activation-photos/${pointId}/${fecha}`)
        .done(function(activaciones) {
            renderAllActivations(activaciones);
        })
        .fail(function() {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las activaciones',
                confirmButtonColor: '#667eea'
            });
            showNoActivations();
        });
}

/**
 * Renderiza todas las activaciones en el modal
 */
function renderAllActivations(activaciones) {
    const container = $('#allActivationsContainer');
    container.empty();
    
    // Validar si hay activaciones
    if (!activaciones || activaciones.length === 0) {
        showNoActivations();
        $('#activationCounterBanner').html(`
            <i class="bi bi-info-circle"></i>
            <span>No hay activaciones registradas para esta fecha</span>
        `);
        return;
    }
    
    // Actualizar banner con contador
    const totalActivaciones = activaciones.length;
    $('#activationCounterBanner').html(`
        <i class="bi bi-people-fill"></i>
        <span>Se encontraron <strong>${totalActivaciones}</strong> activación${totalActivaciones !== 1 ? 'es' : ''} en este punto</span>
    `);
    
    // Renderizar cada par de activación/desactivación
    activaciones.forEach((activacion, index) => {
        container.append(createActivationPairCard(activacion, index + 1));
    });
}

/**
 * Crea una tarjeta para un par de activación/desactivación
 */
function createActivationPairCard(activacion, numero) {
    const hasActivacion = activacion.activacion !== null;
    const hasDesactivacion = activacion.desactivacion !== null;
    
    return `
        <div class="activation-pair-card" data-numero="${numero}">
            <!-- Header de la Tarjeta -->
            <div class="activation-pair-header">
                <div class="activation-pair-info">
                    <div class="activation-pair-title">
                        <div class="mercaderista-icon">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        <h6>Activación #${numero}</h6>
                    </div>
                    <div class="activation-pair-meta">
                        <div class="meta-item">
                            <i class="bi bi-person-badge-fill"></i>
                            <span><strong>Mercaderista:</strong> ${activacion.mercaderista}</span>
                        </div>
                        <div class="meta-item">
                            <i class="bi bi-building-fill"></i>
                            <span><strong>Cliente:</strong> ${activacion.cliente}</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Grid de Fotos (Entrada | Separador | Salida) -->
            <div class="activation-photos-grid">
                <!-- Columna Entrada (Activación) -->
                <div class="compact-photo-section">
                    <div class="compact-photo-header activation-header">
                        <div class="compact-header-icon">
                            <i class="bi bi-play-circle-fill"></i>
                        </div>
                        <div class="compact-header-text">
                            <span>Entrada</span>
                            <small>Activación</small>
                        </div>
                    </div>
                    <div class="compact-photo-display">
                        ${hasActivacion ? 
                            createCompactPhotoItem(activacion.activacion, 'entrada') :
                            `<div class="compact-no-photo">
                                <i class="bi bi-door-open"></i>
                                <p>Sin foto de entrada</p>
                            </div>`
                        }
                    </div>
                </div>
                
                <!-- Separador Central -->
                <div class="compact-separator">
                    <div class="compact-separator-line"></div>
                    <div class="compact-separator-icon">
                        <i class="bi bi-arrow-left-right"></i>
                    </div>
                    <div class="compact-separator-line"></div>
                </div>
                
                <!-- Columna Salida (Desactivación) -->
                <div class="compact-photo-section">
                    <div class="compact-photo-header deactivation-header">
                        <div class="compact-header-icon">
                            <i class="bi bi-stop-circle-fill"></i>
                        </div>
                        <div class="compact-header-text">
                            <span>Salida</span>
                            <small>Desactivación</small>
                        </div>
                    </div>
                    <div class="compact-photo-display">
                        ${hasDesactivacion ? 
                            createCompactPhotoItem(activacion.desactivacion, 'salida') :
                            `<div class="compact-no-photo">
                                <i class="bi bi-door-closed"></i>
                                <p>Aún no ha salido del punto</p>
                            </div>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Crea el HTML de una foto compacta (entrada o salida)
 */
function createCompactPhotoItem(foto, action) {
    if (!foto) return '';
    
    // Generar badge de estado
    let estadoBadge = '';
    if (foto.estado) {
        const estadoLower = foto.estado.toLowerCase();
        let estadoClass = 'status-no-revisado';
        let estadoIcon = 'bi-clock-history';
        
        if (estadoLower === 'aprobada') {
            estadoClass = 'status-aprobada';
            estadoIcon = 'bi-check-circle-fill';
        } else if (estadoLower === 'rechazada') {
            estadoClass = 'status-rechazada';
            estadoIcon = 'bi-x-circle-fill';
        }
        
        estadoBadge = `
            <div class="compact-status-badge ${estadoClass}">
                <i class="bi ${estadoIcon}"></i>
                ${foto.estado}
            </div>
        `;
    }
    
    return `
        <div class="compact-photo-item">
            <!-- Imagen -->
            <div class="compact-photo-image">
                <img src="${window.getImageUrl(foto.file_path)}" 
                     alt="Foto de ${action}"
                     loading="lazy">
            </div>
            
            <!-- Información de la Foto -->
            <div class="compact-photo-info">
                <!-- Timestamp Destacado -->
                <div class="compact-timestamp-row compact-info-row">
                    <i class="bi bi-clock-fill"></i>
                    <div style="flex: 1;">
                        <div class="compact-info-label">Hora de ${action}:</div>
                        <div class="compact-timestamp">
                            ${formatDateTime(foto.fecha_registro)}
                        </div>
                    </div>
                </div>
                
                <!-- Badge de Estado -->
                ${estadoBadge}
            </div>
        </div>
    `;
}

/**
 * Muestra mensaje cuando no hay activaciones
 */
function showNoActivations() {
    $('#allActivationsContainer').html(`
        <div class="no-activations-message">
            <i class="bi bi-inbox"></i>
            <h5>No hay activaciones registradas</h5>
            <p>No se encontraron entradas ni salidas para esta fecha</p>
        </div>
    `);
}





// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/js/service-worker.js')
            .then(registration => console.log('ServiceWorker registrado'))
            .catch(error => console.log('Error ServiceWorker:', error));
    });
}