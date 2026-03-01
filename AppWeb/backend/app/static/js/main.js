
//main.js

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
import { loadUnifiedVisits } from './modules/unified-visits.js';


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
    $('#unified-visits-btn').on('click', function(e) {
    e.preventDefault();
    loadUnifiedVisits();
    if ($(window).width() < 768) closeSidebar();
});
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
    

    // Manejador para el nuevo formulario de estado del mercaderista
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

    // En el evento de clic para Generar reportes
    $(document).on('click', '#generate-reports-btn', function(e) {
        e.preventDefault();
        // Redirigir a la página de reportería

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
        
        $.getJSON(`/api/fotos-with-status/${visitId}/precio`)
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
        
        $.getJSON(`/api/fotos-with-status/${visitId}/exhibicion`)
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
    
    //window.openReviewModal = openReviewModal;
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


    // Ocultar todos los formularios al inicio
    $('.form-container').removeClass('active');
    $('#default-message').show();

    // Manejar clic en "Agregar mercaderista"

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
            

            $.getJSON(`/api/fotos-with-status/${visitId}/gestion`)
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


    // Guardar fotos para filtrado
    window._allGalleryPhotos = photos;

    // Filtros de estado
    if ($('#gallery-filter-container').length === 0) {
        $('.modal-body .alert-info').after(`
            <div id="gallery-filter-container" class="mb-3 d-flex gap-2 align-items-center flex-wrap">
                <label class="fw-bold me-1">Filtrar:</label>
                <button class="btn btn-sm btn-outline-secondary active" data-filter="all">Todas</button>
                <button class="btn btn-sm btn-outline-warning" data-filter="pending">Pendientes</button>
                <button class="btn btn-sm btn-outline-success" data-filter="approved">Aprobadas</button>
                <button class="btn btn-sm btn-outline-danger" data-filter="rejected">Rechazadas</button>
                <button class="btn btn-sm btn-outline-info" data-filter="updated">Actualizada</button>
            </div>
        `);
    } else {
        // Resetear a "Todas" al reabrir
        $('#gallery-filter-container button').removeClass('active');
        $('#gallery-filter-container button[data-filter="all"]').addClass('active');
    }

    $(document).off('click', '#gallery-filter-container button').on('click', '#gallery-filter-container button', function() {
        $('#gallery-filter-container button').removeClass('active');
        $(this).addClass('active');
        applyGalleryFilter($(this).data('filter'));
    });
    

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


function applyGalleryFilter(filter) {
    if (!window._allGalleryPhotos) return;
    let filtered = window._allGalleryPhotos;

    if (filter === 'pending') {
        filtered = filtered.filter(p => {
            const d = photoDecisions[p.id_foto];
            return !d || (d.status === 'pending' && !d.isActualizada && !p.foto_actualizada);
        });
    } else if (filter === 'approved') {
        filtered = filtered.filter(p => photoDecisions[p.id_foto]?.status === 'approved');
    } else if (filter === 'rejected') {
        filtered = filtered.filter(p => 
            photoDecisions[p.id_foto]?.status === 'rejected' && 
            !photoDecisions[p.id_foto]?.isActualizada && 
            !p.foto_actualizada
        );
    } else if (filter === 'updated') {
        filtered = filtered.filter(p => 
            (photoDecisions[p.id_foto]?.status === 'rejected' || photoDecisions[p.id_foto]?.status === 'pending') &&
            (photoDecisions[p.id_foto]?.isActualizada || p.foto_actualizada)
        );
    }

    const antesPhotos = filtered.filter(p => p.type === 'antes');
    const despuesPhotos = filtered.filter(p => p.type === 'despues');

    const antesContainer = $('#gallery-antes');
    const despuesContainer = $('#gallery-despues');
    antesContainer.empty();
    despuesContainer.empty();

    if (antesPhotos.length > 0) {
        antesPhotos.forEach(photo => antesContainer.append(createPhotoItem(photo)));
    } else {
        antesContainer.append('<p class="text-muted text-center py-2">Sin resultados</p>');
    }
    if (despuesPhotos.length > 0) {
        despuesPhotos.forEach(photo => despuesContainer.append(createPhotoItem(photo)));
    } else {
        despuesContainer.append('<p class="text-muted text-center py-2">Sin resultados</p>');
    }

    // Re-bind botones approve/reject
    $('.approve-btn').off('click').on('click', function() {
        approvePhoto($(this).closest('.photo-item').data('id'));
    });
    $('.reject-btn').off('click').on('click', function() {
        openRejectionModal($(this).closest('.photo-item').data('id'));
    });
}


function createPhotoItem(photo) {

    const estadoReal = photo.estado || photo.Estado || 'Pendiente';
    const esActualizada = photo.foto_actualizada || false;

    if (!photoDecisions[photo.id_foto]) {
        let initStatus = 'pending';
        if (estadoReal === 'Aprobada') initStatus = 'approved';
        else if (estadoReal === 'Rechazada' || estadoReal === 'Rechazada-Actualizada') initStatus = 'rejected';
        else if (estadoReal === 'Pendiente' && esActualizada) initStatus = 'rejected';

        photoDecisions[photo.id_foto] = {
            status: initStatus,
            reasonId: null,
            description: '',
            isActualizada: esActualizada
        };
    }
    
    const decision = photoDecisions[photo.id_foto];
    const statusClass = decision.status === 'approved' ? 'approved' : 
                       decision.status === 'rejected' ? 'rejected' : 'pending';
    let statusText = decision.status === 'approved' ? 'Aprobada' : 
                     decision.status === 'rejected' ? 'Rechazada' : 'Pendiente';
    if (decision.status === 'rejected' && (decision.isActualizada || photo.foto_actualizada)) {
        statusText = 'Rechazada-Actualizada';
    }
    
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
        reasonId = null;
        razones = ['Otra'];
    } else {
        reasonId = parseInt(reasonValue);
        const reasonText = $(`label[for="reason-${reasonValue}"]`).text().trim();
        razones = [reasonText];
        description = reasonText; // Guardar texto en descripción también
    }
    
    // ✅ MANEJAR RECHAZO DE FOTO DE EXHIBICIÓN
    // ✅ MANEJAR RECHAZO DE FOTO DE EXHIBICIÓN
    if (currentRejectingExhibitionPhoto) {
        exhibitionDecisions[currentRejectingExhibitionPhoto.id_foto] = {
            status: 'rejected',
            reasonId: reasonId,
            razones: razones,
            descripcion: description
        };
        
        // ✅ CERRAR MODAL DE RAZONES PRIMERO
        $('#rejectionModal').modal('hide');
        
        // ✅ ACTUALIZAR DISPLAY DESPUÉS DE CERRAR
        setTimeout(() => {
            updateExhibitionStatusDisplay();
            
            if (currentExhibitionIndex < exhibitionPhotos.length - 1) {
                currentExhibitionIndex++;
                updateExhibitionDisplay();
            }
        }, 200);
        
        currentRejectingExhibitionPhoto = null;
        return;
    }
    
    // ✅ MANEJAR RECHAZO DE FOTO DE PRECIO
    if (currentRejectingPricePhoto) {
        priceDecisions[currentRejectingPricePhoto.id_foto] = {
            status: 'rejected',
            reasonId: reasonId,
            razones: razones,
            descripcion: description
        };
        
        // ✅ CERRAR MODAL DE RAZONES PRIMERO
        $('#rejectionModal').modal('hide');
        
        // ✅ ACTUALIZAR DISPLAY DESPUÉS DE CERRAR
        setTimeout(() => {
            updatePriceStatusDisplay();
            
            if (currentPriceIndex < pricePhotos.length - 1) {
                currentPriceIndex++;
                updatePriceDisplay();
            }
        }, 200);
        
        currentRejectingPricePhoto = null;
        return;
    }
    
    // ✅ MANEJAR RECHAZO DE FOTO NORMAL (GESTIÓN)
    if (currentRejectingPhotoId) {
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
    priceFilteredPhotos = null;
    priceFilteredIndex = 0;
    
    photos.forEach(photo => {
        const estadoReal = photo.estado || 'Pendiente';
        const fotoAct = photo.foto_actualizada || false;
        let initStatus = 'pending';
        if (estadoReal === 'Aprobada') initStatus = 'approved';
        else if (estadoReal === 'Rechazada' || estadoReal === 'Rechazada-Actualizada') initStatus = 'rejected';
        else if (estadoReal === 'Pendiente' && fotoAct) initStatus = 'rejected';
        priceDecisions[photo.id_foto] = {
            status: initStatus,
            razones: [],
            descripcion: '',
            isActualizada: fotoAct
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
                        <span class="badge bg-primary" id="price-counter">Foto ${currentPriceIndex + 1} de ${photos.length}</span>
                        <div class="btn-group btn-group-sm ms-2" id="price-filter-btns">
                            <button class="btn btn-outline-secondary active" data-pfilter="all">Todas</button>
                            <button class="btn btn-outline-warning" data-pfilter="pending">Pendientes</button>
                            <button class="btn btn-outline-success" data-pfilter="approved">Aprobadas</button>
                            <button class="btn btn-outline-danger" data-pfilter="rejected">Rechazadas</button>
                            <button class="btn btn-outline-info" data-pfilter="updated">Actualizada</button>
                        </div>
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
    if ($modal.length > 0) {
        const existingModal = bootstrap.Modal.getInstance($modal[0]);
        if (existingModal) {
            existingModal.dispose();
        }
        $modal.remove();
    }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open').css('overflow', '');
    
    $modal = $(`<div class="modal fade" id="priceModal" tabindex="-1" aria-hidden="true"></div>`);
    $('body').append($modal);
    
    $modal.html(modalContent);
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    
    const priceModal = new bootstrap.Modal($modal[0], {
        backdrop: true,
        keyboard: true
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
        const list = priceFilteredPhotos || pricePhotos;
        const idx = priceFilteredPhotos ? priceFilteredIndex : currentPriceIndex;
        if (idx > 0) {
            if (priceFilteredPhotos) { priceFilteredIndex--; updatePriceCarouselFromFilter(); }
            else { currentPriceIndex--; updatePriceDisplay(); }
        }
    });
    
    $modal.on('click', '#next-price-btn', function() {
        const list = priceFilteredPhotos || pricePhotos;
        const idx = priceFilteredPhotos ? priceFilteredIndex : currentPriceIndex;
        if (idx < list.length - 1) {
            if (priceFilteredPhotos) { priceFilteredIndex++; updatePriceCarouselFromFilter(); }
            else { currentPriceIndex++; updatePriceDisplay(); }
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
            const list = priceFilteredPhotos || pricePhotos;
            const idx = priceFilteredPhotos ? priceFilteredIndex : currentPriceIndex;
            if (idx < list.length - 1) {
                if (priceFilteredPhotos) { priceFilteredIndex++; updatePriceCarouselFromFilter(); }
                else { currentPriceIndex++; updatePriceDisplay(); }
            }
        }, 500);
        }
    });

    $modal.on('click', '[data-pfilter]', function() {
        $modal.find('[data-pfilter]').removeClass('active');
        $(this).addClass('active');
        applyCarouselFilter('price', $(this).data('pfilter'));
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
        
        // ✅ NO OCULTAR EL MODAL DE PRECIOS - MOSTRAR RAZONES ENCIMA
        if (!currentRejectionReasons || currentRejectionReasons.length === 0) {
            $.getJSON("/api/rejection-reasons")
                .done(function(reasons) {
                    currentRejectionReasons = reasons;
                    renderRejectionReasons(reasons);
                    $('#rejectionModal').modal('show');
                })
                .fail(function() {
                    Swal.fire('Error', 'No se pudieron cargar las razones', 'error');
                });
        } else {
            $('#rejectionModal').modal('show');
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
    const $modal = $('#priceModal');
    const decision = priceDecisions[currentPhoto.id_foto];
    
    // Remover clases previas
    $modal.find('#approve-price-btn').removeClass('btn-success btn-outline-success').addClass('btn-outline-success');
    $modal.find('#reject-price-btn').removeClass('btn-danger btn-outline-danger').addClass('btn-outline-danger');
    
    // Actualizar indicador de estado
    let statusHtml = '';
    if (decision.status === 'approved') {
        statusHtml = '<span class="badge bg-success fs-6">✓ APROBADA</span>';
        $modal.find('#approve-price-btn').removeClass('btn-outline-success').addClass('btn-success');
    } else if (decision.status === 'rejected') {
        const isAct = decision.isActualizada || currentPhoto.foto_actualizada;
        statusHtml = isAct
            ? '<span class="badge bg-warning text-dark fs-6">↺ RECHAZADA-ACTUALIZADA</span>'
            : '<span class="badge bg-danger fs-6">✗ RECHAZADA</span>';
        $modal.find('#reject-price-btn').removeClass('btn-outline-danger').addClass('btn-danger');
    } else if (currentPhoto.foto_actualizada) {
        statusHtml = '<span class="badge bg-warning text-dark fs-6">↺ RECHAZADA-ACTUALIZADA</span>';
    } else {
        statusHtml = '<span class="badge bg-secondary fs-6">PENDIENTE</span>';
    }
    
    // Actualizar el indicador visual
    $modal.find('.photo-decision-status').html(statusHtml);
    
    // Actualizar contador de progreso
    let approved = 0, rejected = 0, pending = 0;
    Object.values(priceDecisions).forEach(d => {
        if (d.status === 'approved') approved++;
        else if (d.status === 'rejected') rejected++;
        else pending++;
    });
    
    $modal.find('.progress-info').html(`
        <span class="badge bg-success me-1">${approved} ✓</span>
        <span class="badge bg-danger me-1">${rejected} ✗</span>
        <span class="badge bg-secondary">${pending} pendientes</span>
    `);
}


function saveAllPriceDecisions() {
    const decisions = [];
    
    pricePhotos.forEach(photo => {
        const decision = priceDecisions[photo.id_foto];
        if (decision && decision.status !== 'pending') {
            decisions.push({
                id_foto: photo.id_foto,
                status: decision.status,
                rejection_reason_id: decision.reasonId || null,
                razones: decision.razones || [],
                descripcion: decision.descripcion || ''
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
                    text: response.message || `Guardadas ${decisions.length} decisiones`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance($('#priceModal')[0]);
                    if (modal) modal.hide();
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open').css('overflow', '');
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

    exhibitionFilteredPhotos = null;
    exhibitionFilteredIndex = 0;
    
     photos.forEach(photo => {
        const estadoReal = photo.estado || 'Pendiente';
        const fotoAct = photo.foto_actualizada || false;
        let initStatus = 'pending';
        if (estadoReal === 'Aprobada') initStatus = 'approved';
        else if (estadoReal === 'Rechazada' || estadoReal === 'Rechazada-Actualizada') initStatus = 'rejected';
        else if (estadoReal === 'Pendiente' && fotoAct) initStatus = 'rejected';
        exhibitionDecisions[photo.id_foto] = {
            status: initStatus,
            razones: [],
            descripcion: '',
            isActualizada: fotoAct
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
                            <span class="badge bg-primary" id="exhibition-counter">Foto ${currentExhibitionIndex + 1} de ${photos.length}</span>
                        <div class="btn-group btn-group-sm ms-2" id="exhibition-filter-btns">
                            <button class="btn btn-outline-secondary active" data-efilter="all">Todas</button>
                            <button class="btn btn-outline-warning" data-efilter="pending">Pendientes</button>
                            <button class="btn btn-outline-success" data-efilter="approved">Aprobadas</button>
                            <button class="btn btn-outline-danger" data-efilter="rejected">Rechazadas</button>
                            <button class="btn btn-outline-info" data-efilter="updated">Actualizada</button>
                        </div>
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
    
    // ✅ SIEMPRE DESTRUIR Y RECREAR EL MODAL LIMPIO
    let $modal = $('#exhibitionModal');
    if ($modal.length > 0) {
        const existingModal = bootstrap.Modal.getInstance($modal[0]);
        if (existingModal) {
            existingModal.dispose();
        }
        $modal.remove();
    }
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open').css('overflow', '');
    
    $modal = $(`<div class="modal fade" id="exhibitionModal" tabindex="-1" aria-hidden="true"></div>`);
    $('body').append($modal);
    
    $modal.html(modalContent);
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open');
    
    const exhibitionModal = new bootstrap.Modal($modal[0], {
        backdrop: true,
        keyboard: true
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
        const list = exhibitionFilteredPhotos || exhibitionPhotos;
        const idx = exhibitionFilteredPhotos ? exhibitionFilteredIndex : currentExhibitionIndex;
        if (idx > 0) {
            if (exhibitionFilteredPhotos) { exhibitionFilteredIndex--; updateExhibitionCarouselFromFilter(); }
            else { currentExhibitionIndex--; updateExhibitionDisplay(); }
        }
    });
    
    $modal.on('click', '#next-exhibition-btn', function() {
        const list = exhibitionFilteredPhotos || exhibitionPhotos;
        const idx = exhibitionFilteredPhotos ? exhibitionFilteredIndex : currentExhibitionIndex;
        if (idx < list.length - 1) {
            if (exhibitionFilteredPhotos) { exhibitionFilteredIndex++; updateExhibitionCarouselFromFilter(); }
            else { currentExhibitionIndex++; updateExhibitionDisplay(); }
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
            const list = exhibitionFilteredPhotos || exhibitionPhotos;
            const idx = exhibitionFilteredPhotos ? exhibitionFilteredIndex : currentExhibitionIndex;
            if (idx < list.length - 1) {
                if (exhibitionFilteredPhotos) { exhibitionFilteredIndex++; updateExhibitionCarouselFromFilter(); }
                else { currentExhibitionIndex++; updateExhibitionDisplay(); }
            }
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
        
        // ✅ NO OCULTAR EL MODAL DE EXHIBICIONES - MOSTRAR RAZONES ENCIMA
        if (!currentRejectionReasons || currentRejectionReasons.length === 0) {
            $.getJSON("/api/rejection-reasons")
                .done(function(reasons) {
                    currentRejectionReasons = reasons;
                    renderRejectionReasons(reasons);
                    $('#rejectionModal').modal('show');
                })
                .fail(function() {
                    Swal.fire('Error', 'No se pudieron cargar las razones', 'error');
                });
        } else {
            $('#rejectionModal').modal('show');
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

    $modal.on('click', '[data-efilter]', function() {
        $modal.find('[data-efilter]').removeClass('active');
        $(this).addClass('active');
        applyCarouselFilter('exhibition', $(this).data('efilter'));
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
    const $modal = $('#exhibitionModal');
    const decision = exhibitionDecisions[currentPhoto.id_foto];
    
    // Remover clases previas
    $modal.find('#approve-exhibition-btn').removeClass('btn-success btn-outline-success').addClass('btn-outline-success');
    $modal.find('#reject-exhibition-btn').removeClass('btn-danger btn-outline-danger').addClass('btn-outline-danger');
    
    // Actualizar indicador de estado
    let statusHtml = '';
    if (decision.status === 'approved') {
        statusHtml = '<span class="badge bg-success fs-6">✓ APROBADA</span>';
        $modal.find('#approve-exhibition-btn').removeClass('btn-outline-success').addClass('btn-success');
    } else if (decision.status === 'rejected') {
        const isAct = decision.isActualizada || currentPhoto.foto_actualizada;
        statusHtml = isAct
            ? '<span class="badge bg-warning text-dark fs-6">↺ RECHAZADA-ACTUALIZADA</span>'
            : '<span class="badge bg-danger fs-6">✗ RECHAZADA</span>';
        $modal.find('#reject-exhibition-btn').removeClass('btn-outline-danger').addClass('btn-danger');
    } else if (currentPhoto.foto_actualizada) {
        statusHtml = '<span class="badge bg-warning text-dark fs-6">↺ RECHAZADA-ACTUALIZADA</span>';
    } else {
        statusHtml = '<span class="badge bg-secondary fs-6">PENDIENTE</span>';
    }
    
    // Actualizar el indicador visual
    $modal.find('.photo-decision-status').html(statusHtml);
    
    // Actualizar contador de progreso
    let approved = 0, rejected = 0, pending = 0;
    Object.values(exhibitionDecisions).forEach(d => {
        if (d.status === 'approved') approved++;
        else if (d.status === 'rejected') rejected++;
        else pending++;
    });
    
    $modal.find('.progress-info').html(`
        <span class="badge bg-success me-1">${approved} ✓</span>
        <span class="badge bg-danger me-1">${rejected} ✗</span>
        <span class="badge bg-secondary">${pending} pendientes</span>
    `);
}



function saveAllExhibitionDecisions() {
    const decisions = [];
    
    exhibitionPhotos.forEach(photo => {
        const decision = exhibitionDecisions[photo.id_foto];
        if (decision && decision.status !== 'pending') {
            decisions.push({
                id_foto: photo.id_foto,
                status: decision.status,
                rejection_reason_id: decision.reasonId || null,
                razones: decision.razones || [],
                descripcion: decision.descripcion || ''
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
                    text: response.message || `Guardadas ${decisions.length} decisiones`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance($('#exhibitionModal')[0]);
                    if (modal) modal.hide();
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open').css('overflow', '');
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


// ========================================
// MATERIAL POP - TODO EL SISTEMA
// ========================================

let currentPopIndex = 0;
let popPhotos = [];
let popDecisions = {};
let currentRejectingPopPhoto = null;
let currentPopModalOpen = false;

/**
 * Abre el carrusel de Material POP para una visita
 * @param {number} visitId - ID de la visita
 */
window.viewVisitPop = function(visitId) {
    window.currentVisitId = visitId;
    
    $.getJSON(`/api/fotos-with-status/${visitId}/pop`)
        .done(function(photos) {
            if (photos && photos.length > 0) {
                renderPopGalleryWithDecisions(photos);
            } else {
                Swal.fire('Información', 'No hay fotos de Material POP para esta visita', 'info');
            }
        })
        .fail(function() {
            Swal.fire('Error', 'No se pudieron cargar las fotos de Material POP', 'error');
        });
};

/**
 * Renderiza el carrusel de Material POP con sistema de decisiones
 * @param {Array} photos - Array de fotos POP (tipo 8 y 10)
 */
function renderPopGalleryWithDecisions(photos) {
    currentPopIndex = 0;
    popPhotos = photos;
    popDecisions = {};
    popFilteredPhotos = null;
    popFilteredIndex = 0;
    // Inicializar decisiones pendientes
    photos.forEach(photo => {
        const estadoReal = photo.estado || 'Pendiente';
        const fotoAct = photo.foto_actualizada || false;
        let initStatus = 'pending';
        if (estadoReal === 'Aprobada') initStatus = 'approved';
        else if (estadoReal === 'Rechazada' || estadoReal === 'Rechazada-Actualizada') initStatus = 'rejected';
        else if (estadoReal === 'Pendiente' && fotoAct) initStatus = 'rejected';
        popDecisions[photo.id_foto] = {
            status: initStatus,
            razones: [],
            descripcion: '',
            isActualizada: fotoAct
        };
    });
    
    const modalContent = `
        <div class="modal-dialog modal-xl">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Material POP - Visita #${window.currentVisitId}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${photos.length > 0 ? `
                    <div class="pop-gallery-container">
                        <div class="text-center mb-3">
                            <span class="badge bg-primary" id="pop-counter">Foto ${currentPopIndex + 1} de ${photos.length}</span>
                        <span class="badge bg-info ms-2" id="pop-photo-type-badge">Material POP Antes</span>
                        <div class="btn-group btn-group-sm ms-2" id="pop-filter-btns">
                            <button class="btn btn-outline-secondary active" data-popfilter="all">Todas</button>
                            <button class="btn btn-outline-warning" data-popfilter="pending">Pendientes</button>
                            <button class="btn btn-outline-success" data-popfilter="approved">Aprobadas</button>
                            <button class="btn btn-outline-danger" data-popfilter="rejected">Rechazadas</button>
                            <button class="btn btn-outline-info" data-popfilter="updated">Actualizada</button>
                        </div>
                        </div>
                        
                        <div class="pop-carousel">
                            <div class="carousel-navigation d-flex justify-content-between align-items-center mb-3">
                                <button class="btn btn-outline-primary" id="prev-pop-btn" ${currentPopIndex === 0 ? 'disabled' : ''}>
                                    <i class="bi bi-chevron-left"></i> Anterior
                                </button>
                                
                                <div class="current-photo-container text-center">
                                    <img id="current-pop-image"
                                         src="${window.getImageUrl(photos[0].file_path)}"
                                         class="img-fluid rounded shadow"
                                         style="max-height: 400px; max-width: 100%; object-fit: contain;">
                                </div>
                                
                                <button class="btn btn-outline-primary" id="next-pop-btn" ${currentPopIndex === photos.length - 1 ? 'disabled' : ''}>
                                    Siguiente <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                            
                            <div class="pop-controls text-center mt-4">
                                <div class="btn-group" role="group">
                                    <button type="button" class="btn btn-success btn-lg" id="approve-pop-btn">
                                        <i class="bi bi-check-circle"></i> Aprobar
                                    </button>
                                    <button type="button" class="btn btn-danger btn-lg" id="reject-pop-btn">
                                        <i class="bi bi-x-circle"></i> Rechazar
                                    </button>
                                </div>
                                
                                <div class="mt-3">
                                    <span id="current-pop-status" class="badge bg-secondary fs-6">Pendiente</span>
                                </div>
                                
                                <div class="progress-info mt-2">
                                    <span class="badge bg-success me-1">0 ✓</span>
                                    <span class="badge bg-danger me-1">0 ✗</span>
                                    <span class="badge bg-secondary">${photos.length} pendientes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` : '<div class="alert alert-info text-center">No hay fotos de Material POP</div>'}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" class="btn btn-primary" id="save-all-pop-decisions">Guardar decisiones</button>
                </div>
            </div>
        </div>
    `;
    
    // Destruir modal anterior si existe
    let $modal = $('#popModal');
    if ($modal.length > 0) {
        const existingModal = bootstrap.Modal.getInstance($modal[0]);
        if (existingModal) {
            existingModal.dispose();
        }
        $modal.remove();
    }
    
    // Limpiar backdrops residuales
    $('.modal-backdrop').remove();
    $('body').removeClass('modal-open').css('overflow', '');
    
    // Crear nuevo modal
    $modal = $(`<div class="modal fade" id="popModal" tabindex="-1" aria-hidden="true"></div>`);
    $('body').append($modal);
    
    $modal.html(modalContent);
    
    // Inicializar Bootstrap Modal
    const popModal = new bootstrap.Modal($modal[0], {
        backdrop: true,
        keyboard: true
    });
    popModal.show();
    
    // Configurar eventos
    setupPopGalleryEvents();
    updatePopStatusDisplay();
}

/**
 * Configura los eventos del carrusel de Material POP
 */
function setupPopGalleryEvents() {
    const $modal = $('#popModal');
    currentPopModalOpen = true;
    
    // Evento al cerrar
    $modal.on('hidden.bs.modal', function() {
        currentPopModalOpen = false;
    });
    
   $modal.on('click', '#prev-pop-btn', function() {
        const list = popFilteredPhotos || popPhotos;
        const idx = popFilteredPhotos ? popFilteredIndex : currentPopIndex;
        if (idx > 0) {
            if (popFilteredPhotos) { popFilteredIndex--; updatePopCarouselFromFilter(); }
            else { currentPopIndex--; updatePopDisplay(); }
        }
    });
    
    $modal.on('click', '#next-pop-btn', function() {
        const list = popFilteredPhotos || popPhotos;
        const idx = popFilteredPhotos ? popFilteredIndex : currentPopIndex;
        if (idx < list.length - 1) {
            if (popFilteredPhotos) { popFilteredIndex++; updatePopCarouselFromFilter(); }
            else { currentPopIndex++; updatePopDisplay(); }
        }
    });
    // Aprobar foto
    $modal.on('click', '#approve-pop-btn', function() {
        const currentPhoto = popPhotos[currentPopIndex];
        popDecisions[currentPhoto.id_foto] = {
            status: 'approved',
            razones: [],
            descripcion: ''
        };
        updatePopStatusDisplay();
        
        // Auto-avanzar si no es la última
        if (currentPopIndex < popPhotos.length - 1) {
            setTimeout(() => {
            const list = popFilteredPhotos || popPhotos;
            const idx = popFilteredPhotos ? popFilteredIndex : currentPopIndex;
            if (idx < list.length - 1) {
                if (popFilteredPhotos) { popFilteredIndex++; updatePopCarouselFromFilter(); }
                else { currentPopIndex++; updatePopDisplay(); }
            }
        }, 500);
        }
    });
    
    // Rechazar foto
    $modal.on('click', '#reject-pop-btn', function() {
        const currentPhoto = popPhotos[currentPopIndex];
        currentRejectingPopPhoto = currentPhoto;
        currentRejectingPhotoId = null;
        currentRejectingPricePhoto = null;
        currentRejectingExhibitionPhoto = null;
        
        // Resetear formulario de rechazo
        $('input[name="rejectionReason"]').prop('checked', false);
        $('#otherReasonContainer').hide();
        $('#otherReasonText').val('');
        
        // Cargar razones si no están cargadas
        if (!currentRejectionReasons || currentRejectionReasons.length === 0) {
            $.getJSON("/api/rejection-reasons")
                .done(function(reasons) {
                    currentRejectionReasons = reasons;
                    renderRejectionReasons(reasons);
                    $('#rejectionModal').modal('show');
                })
                .fail(function() {
                    Swal.fire('Error', 'No se pudieron cargar las razones', 'error');
                });
        } else {
            $('#rejectionModal').modal('show');
        }
    });
    
    // Guardar todas las decisiones
    $modal.on('click', '#save-all-pop-decisions', function() {
        saveAllPopDecisions();
    });
    
    // Navegación con teclado
    $(document).off('keydown.popModal').on('keydown.popModal', function(e) {
        if ($('#popModal').is(':visible')) {
            if (e.key === 'ArrowLeft') {
                $('#prev-pop-btn').click();
            } else if (e.key === 'ArrowRight') {
                $('#next-pop-btn').click();
            }
        }
    });

    $modal.on('click', '[data-popfilter]', function() {
        $modal.find('[data-popfilter]').removeClass('active');
        $(this).addClass('active');
        applyCarouselFilter('pop', $(this).data('popfilter'));
    });
}

/**
 * Actualiza la visualización del carrusel POP
 */
function updatePopDisplay() {
    const currentPhoto = popPhotos[currentPopIndex];
    const $modal = $('#popModal');
    
    // Actualizar imagen
    $modal.find('#current-pop-image').attr('src', window.getImageUrl(currentPhoto.file_path));
    
    // Actualizar contador
    $modal.find('.badge.bg-primary').text(`Foto ${currentPopIndex + 1} de ${popPhotos.length}`);
    
    // Actualizar tipo de foto
    let tipoTexto = 'Material POP';
if (currentPhoto.type === 'pop_antes' || currentPhoto.id_tipo_foto === 8) {
    tipoTexto = 'Material POP Antes';
} else if (currentPhoto.type === 'pop_despues' || currentPhoto.id_tipo_foto === 9) {
    tipoTexto = 'Material POP Después';
}
    $modal.find('#pop-photo-type-badge').text(tipoTexto);
    
    // Actualizar botones de navegación
    $modal.find('#prev-pop-btn').prop('disabled', currentPopIndex === 0);
    $modal.find('#next-pop-btn').prop('disabled', currentPopIndex === popPhotos.length - 1);
    
    updatePopStatusDisplay();
}

/**
 * Actualiza el indicador de estado visual
 */
function updatePopStatusDisplay() {
    const currentPhoto = popPhotos[currentPopIndex];
    const $modal = $('#popModal');
    const decision = popDecisions[currentPhoto.id_foto];
    
    // Resetear botones
    $modal.find('#approve-pop-btn').removeClass('btn-success btn-outline-success').addClass('btn-outline-success');
    $modal.find('#reject-pop-btn').removeClass('btn-danger btn-outline-danger').addClass('btn-outline-danger');
    
    // Actualizar indicador
    let statusHtml = '';
    if (decision.status === 'approved') {
        statusHtml = '<span class="badge bg-success fs-6">✓ APROBADA</span>';
        $modal.find('#approve-pop-btn').removeClass('btn-outline-success').addClass('btn-success');
    } else if (decision.status === 'rejected') {
        const isAct = decision.isActualizada || currentPhoto.foto_actualizada;
        statusHtml = isAct
            ? '<span class="badge bg-warning text-dark fs-6">↺ RECHAZADA-ACTUALIZADA</span>'
            : '<span class="badge bg-danger fs-6">✗ RECHAZADA</span>';
        $modal.find('#reject-pop-btn').removeClass('btn-outline-danger').addClass('btn-danger');
    } else if (currentPhoto.foto_actualizada) {
        statusHtml = '<span class="badge bg-warning text-dark fs-6">↺ RECHAZADA-ACTUALIZADA</span>';
    } else {
        statusHtml = '<span class="badge bg-secondary fs-6">PENDIENTE</span>';
    }
    
    $modal.find('#current-pop-status').html(statusHtml);
    
    // Actualizar progreso
    let approved = 0, rejected = 0, pending = 0;
    Object.values(popDecisions).forEach(d => {
        if (d.status === 'approved') approved++;
        else if (d.status === 'rejected') rejected++;
        else pending++;
    });
    
    $modal.find('.progress-info').html(`
        <span class="badge bg-success me-1">${approved} ✓</span>
        <span class="badge bg-danger me-1">${rejected} ✗</span>
        <span class="badge bg-secondary">${pending} pendientes</span>
    `);
}

//Listas filtradas activas para cada carrusel
let priceFilteredPhotos = null;
let exhibitionFilteredPhotos = null;
let popFilteredPhotos = null;
let priceFilteredIndex = 0;
let exhibitionFilteredIndex = 0;
let popFilteredIndex = 0;

function getFilteredList(photos, decisions, filter) {
    if (filter === 'all') return [...photos];
    return photos.filter(function(p) {
        const d = decisions[p.id_foto];
        const status = d ? d.status : 'pending';
        const isAct = d ? (d.isActualizada || p.foto_actualizada) : (p.foto_actualizada || false);
        if (filter === 'pending') return status === 'pending' && !isAct;
        if (filter === 'approved') return status === 'approved';
        if (filter === 'rejected') return status === 'rejected' && !isAct;
        if (filter === 'updated') return isAct && (status === 'rejected' || status === 'pending');
        return true;
    });
}

function applyCarouselFilter(type, filter) {
    if (type === 'price') {
        priceFilteredPhotos = getFilteredList(pricePhotos, priceDecisions, filter);
        priceFilteredIndex = 0;
        if (priceFilteredPhotos.length === 0) {
            Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No hay fotos con ese estado', timer: 1500, showConfirmButton: false });
            return;
        }
        updatePriceCarouselFromFilter();
    } else if (type === 'exhibition') {
        exhibitionFilteredPhotos = getFilteredList(exhibitionPhotos, exhibitionDecisions, filter);
        exhibitionFilteredIndex = 0;
        if (exhibitionFilteredPhotos.length === 0) {
            Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No hay fotos con ese estado', timer: 1500, showConfirmButton: false });
            return;
        }
        updateExhibitionCarouselFromFilter();
    } else if (type === 'pop') {
        popFilteredPhotos = getFilteredList(popPhotos, popDecisions, filter);
        popFilteredIndex = 0;
        if (popFilteredPhotos.length === 0) {
            Swal.fire({ icon: 'info', title: 'Sin resultados', text: 'No hay fotos con ese estado', timer: 1500, showConfirmButton: false });
            return;
        }
        updatePopCarouselFromFilter();
    }
}

function updatePriceCarouselFromFilter() {
    const list = priceFilteredPhotos || pricePhotos;
    const photo = list[priceFilteredIndex];
    if (!photo) return;
    // Sincronizar índice global
    currentPriceIndex = pricePhotos.indexOf(photo);
    const $modal = $('#priceModal');
    $modal.find('#current-price-image').attr('src', window.getImageUrl(photo.file_path));
    $modal.find('#price-counter').text(`Foto ${priceFilteredIndex + 1} de ${list.length}`);
    $modal.find('#prev-price-btn').prop('disabled', priceFilteredIndex === 0);
    $modal.find('#next-price-btn').prop('disabled', priceFilteredIndex === list.length - 1);
    updatePriceStatusDisplay();
}

function updateExhibitionCarouselFromFilter() {
    const list = exhibitionFilteredPhotos || exhibitionPhotos;
    const photo = list[exhibitionFilteredIndex];
    if (!photo) return;
    currentExhibitionIndex = exhibitionPhotos.indexOf(photo);
    const $modal = $('#exhibitionModal');
    $modal.find('#current-exhibition-image').attr('src', window.getImageUrl(photo.file_path));
    $modal.find('#exhibition-counter').text(`Foto ${exhibitionFilteredIndex + 1} de ${list.length}`);
    $modal.find('#prev-exhibition-btn').prop('disabled', exhibitionFilteredIndex === 0);
    $modal.find('#next-exhibition-btn').prop('disabled', exhibitionFilteredIndex === list.length - 1);
    updateExhibitionStatusDisplay();
}

function updatePopCarouselFromFilter() {
    const list = popFilteredPhotos || popPhotos;
    const photo = list[popFilteredIndex];
    if (!photo) return;
    currentPopIndex = popPhotos.indexOf(photo);
    const $modal = $('#popModal');
    $modal.find('#current-pop-image').attr('src', window.getImageUrl(photo.file_path));
    $modal.find('#pop-counter').text(`Foto ${popFilteredIndex + 1} de ${list.length}`);
    $modal.find('#prev-pop-btn').prop('disabled', popFilteredIndex === 0);
    $modal.find('#next-pop-btn').prop('disabled', popFilteredIndex === list.length - 1);

    // Badge tipo
    const curPhoto = popPhotos[currentPopIndex];
    let tipoTexto = 'Material POP';
    if (curPhoto.type === 'pop_antes' || curPhoto.id_tipo_foto === 8) tipoTexto = 'Material POP Antes';
    else if (curPhoto.type === 'pop_despues' || curPhoto.id_tipo_foto === 9) tipoTexto = 'Material POP Después';
    $modal.find('#pop-photo-type-badge').text(tipoTexto);

    updatePopStatusDisplay();
}



/**
 * Guarda todas las decisiones de Material POP
 */
function saveAllPopDecisions() {
    const decisions = [];
    
    popPhotos.forEach(photo => {
        const decision = popDecisions[photo.id_foto];
        if (decision && decision.status !== 'pending') {
            decisions.push({
                id_foto: photo.id_foto,
                status: decision.status,
                rejection_reason_id: decision.reasonId || null,
                razones: decision.razones || [],
                descripcion: decision.descripcion || ''
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
        url: '/api/save-pop-decisions',
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
                    text: response.message || `Guardadas ${decisions.length} decisiones`,
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    const modal = bootstrap.Modal.getInstance($('#popModal')[0]);
                    if (modal) modal.hide();
                    $('.modal-backdrop').remove();
                    $('body').removeClass('modal-open').css('overflow', '');
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
// INTEGRACIÓN CON MODAL DE RECHAZO EXISTENTE
// ========================================

$(document).ready(function() {
    // Reemplazar el handler de confirmación de rechazo para incluir Material POP
    $('#confirmRejectionBtn').off('click').on('click', function() {
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
            reasonId = null;
            razones = ['Otra'];
        } else {
            reasonId = parseInt(reasonValue);
            const reasonText = $(`label[for="reason-${reasonValue}"]`).text().trim();
            razones = [reasonText];
            description = reasonText;
        }
        
        // MANEJAR RECHAZO DE MATERIAL POP
        if (currentRejectingPopPhoto) {
            popDecisions[currentRejectingPopPhoto.id_foto] = {
                status: 'rejected',
                reasonId: reasonId,
                razones: razones,
                descripcion: description
            };
            
            $('#rejectionModal').modal('hide');
            
            setTimeout(() => {
                updatePopStatusDisplay();
                const popList = popFilteredPhotos || popPhotos;
                const popIdx = popFilteredPhotos ? popFilteredIndex : currentPopIndex;
                if (popIdx < popList.length - 1) {
                    if (popFilteredPhotos) { popFilteredIndex++; updatePopCarouselFromFilter(); }
                    else { currentPopIndex++; updatePopDisplay(); }
                }
            }, 200);
            
            currentRejectingPopPhoto = null;
            return;
        }
        
        // MANEJAR RECHAZO DE EXHIBICIONES (código original)
        if (typeof currentRejectingExhibitionPhoto !== 'undefined' && currentRejectingExhibitionPhoto) {
            exhibitionDecisions[currentRejectingExhibitionPhoto.id_foto] = {
                status: 'rejected',
                reasonId: reasonId,
                razones: razones,
                descripcion: description
            };
            
            $('#rejectionModal').modal('hide');
            
            setTimeout(() => {
                if (typeof updateExhibitionStatusDisplay === 'function') {
                    updateExhibitionStatusDisplay();
                }
                
                const exhList = exhibitionFilteredPhotos || exhibitionPhotos;
            const exhIdx = exhibitionFilteredPhotos ? exhibitionFilteredIndex : currentExhibitionIndex;
            if (exhIdx < exhList.length - 1) {
                if (exhibitionFilteredPhotos) { exhibitionFilteredIndex++; updateExhibitionCarouselFromFilter(); }
                else { currentExhibitionIndex++; updateExhibitionDisplay(); }
            }
            }, 200);
            
            currentRejectingExhibitionPhoto = null;
            return;
        }
        
        // MANEJAR RECHAZO DE PRECIOS (código original)
        if (typeof currentRejectingPricePhoto !== 'undefined' && currentRejectingPricePhoto) {
            priceDecisions[currentRejectingPricePhoto.id_foto] = {
                status: 'rejected',
                reasonId: reasonId,
                razones: razones,
                descripcion: description
            };
            
            $('#rejectionModal').modal('hide');
            
            setTimeout(() => {
                if (typeof updatePriceStatusDisplay === 'function') {
                    updatePriceStatusDisplay();
                }
                
                const priceList = priceFilteredPhotos || pricePhotos;
            const priceIdx = priceFilteredPhotos ? priceFilteredIndex : currentPriceIndex;
            if (priceIdx < priceList.length - 1) {
                if (priceFilteredPhotos) { priceFilteredIndex++; updatePriceCarouselFromFilter(); }
                else { currentPriceIndex++; updatePriceDisplay(); }
            }
            }, 200);
            
            currentRejectingPricePhoto = null;
            return;
        }
        
        // MANEJAR RECHAZO DE GESTIÓN (código original)
        if (typeof currentRejectingPhotoId !== 'undefined' && currentRejectingPhotoId) {
            if (typeof photoDecisions !== 'undefined') {
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
            }
            
            currentRejectingPhotoId = null;
        }
        
        $('#rejectionModal').modal('hide');
    });
});


// Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/js/service-worker.js')
            .then(registration => console.log('ServiceWorker registrado'))
            .catch(error => console.log('Error ServiceWorker:', error));
    });
}

