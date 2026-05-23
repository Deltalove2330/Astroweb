/* ================================================
   HJASSTA - MÓDULO CLIENTE - SCRIPTS MEJORADOS
   Versión: 2.0 - Con Carruseles y Acordeones Corregidos
   ================================================ */

// === VARIABLES GLOBALES ===
let currentCarousel = null;
let currentPhotoIndex = 0;
let currentPhotosData = [];

// === INICIALIZACIÓN ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Módulo Cliente inicializado');
    
    initializeRegionToggles();
    initializeVisitToggles();
    initializePhotoGalleries();
    initializeModalHandlers();
    initializeChat();
    
    console.log('✅ Todos los componentes inicializados');
});

// === SISTEMA DE ACORDEONES MEJORADO ===
function initializeRegionToggles() {
    const regionHeaders = document.querySelectorAll('.region-card-header');
    
    regionHeaders.forEach((header, index) => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.toggle-icon');
        
        // Asignar IDs únicos si no existen
        if (!header.id) {
            header.id = `region-header-${index}`;
        }
        if (!content.id) {
            content.id = `region-content-${index}`;
        }
        
        header.addEventListener('click', function() {
            const isOpen = content.classList.contains('show');
            
            if (isOpen) {
                // Cerrar
                content.classList.remove('show');
                icon.classList.remove('rotated');
                content.style.maxHeight = '0';
            } else {
                // Abrir
                content.classList.add('show');
                icon.classList.add('rotated');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
    console.log(`✅ ${regionHeaders.length} regiones inicializadas`);
}

function initializeVisitToggles() {
    const visitHeaders = document.querySelectorAll('.visita-card-header');
    
    visitHeaders.forEach((header, index) => {
        const card = header.closest('.visita-card');
        const content = card.querySelector('.visita-card-content');
        const icon = header.querySelector('.toggle-icon');
        
        // Asignar IDs únicos
        if (!header.id) {
            header.id = `visit-header-${index}`;
        }
        if (!content.id) {
            content.id = `visit-content-${index}`;
        }
        
        header.addEventListener('click', function(e) {
            // Evitar propagación si se hace click en un badge
            if (e.target.classList.contains('badge')) {
                return;
            }
            
            const isOpen = content.classList.contains('show');
            
            if (isOpen) {
                content.classList.remove('show');
                icon.classList.remove('rotated');
                content.style.maxHeight = '0';
            } else {
                content.classList.add('show');
                icon.classList.add('rotated');
                // Usar scrollHeight para altura dinámica
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
    console.log(`✅ ${visitHeaders.length} visitas inicializadas`);
}

// === SISTEMA DE GALERÍAS DE FOTOS ===
function initializePhotoGalleries() {
    // Inicializar botones para ver fotos
    document.querySelectorAll('.btn-view-photos').forEach(button => {
        button.addEventListener('click', function() {
            const photoType = this.dataset.photoType;
            const visitId = this.dataset.visitId;
            const clienteId = this.dataset.clienteId;
            
            openPhotoCarousel(photoType, visitId, clienteId);
        });
    });
    
    // Inicializar clicks en fotos individuales
    document.querySelectorAll('.photo-card').forEach(card => {
        card.addEventListener('click', function() {
            const photoUrl = this.dataset.photoUrl;
            const photoInfo = {
                descripcion: this.dataset.photoDesc || 'Sin descripción',
                id_foto: this.dataset.photoId || 'N/A',
                fecha: this.dataset.photoDate || 'N/A'
            };
            
            openSinglePhotoModal(photoUrl, photoInfo);
        });
    });
}

// === ABRIR CARRUSEL DE FOTOS ===
function openPhotoCarousel(photoType, visitId, clienteId) {
    console.log(`📷 Abriendo carrusel: ${photoType} - Visita ${visitId} - Cliente ${clienteId}`);
    
    // Obtener fotos del tipo especificado
    const photoCards = document.querySelectorAll(
        `[data-visit-id="${visitId}"][data-cliente-id="${clienteId}"][data-photo-type="${photoType}"]`
    );
    
    if (photoCards.length === 0) {
        showNotification('No hay fotos disponibles', 'warning');
        return;
    }
    
    // Construir array de fotos
    currentPhotosData = Array.from(photoCards).map(card => ({
        url: card.dataset.photoUrl,
        descripcion: card.dataset.photoDesc || 'Sin descripción',
        id_foto: card.dataset.photoId || 'N/A',
        fecha: card.dataset.photoDate || 'N/A',
        tipo: photoType
    }));
    
    currentPhotoIndex = 0;
    
    // Crear y mostrar modal con carrusel
    createCarouselModal(photoType);
}

// === CREAR MODAL CON CARRUSEL ===
function createCarouselModal(photoType) {
    const modalHTML = `
        <div id="carouselModal" class="modal show">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>
                            <i class="bi bi-images"></i>
                            Fotos de ${getTitleByType(photoType)} (${currentPhotosData.length})
                        </h5>
                        <button class="btn-close-modal" onclick="closeCarouselModal()">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="carousel">
                            <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img id="carouselImage" class="carousel-image" src="" alt="Foto">
                                    <div class="carousel-caption">
                                        <h6 id="carouselDesc"></h6>
                                        <p><strong>ID:</strong> <span id="carouselId"></span></p>
                                        <p><strong>Fecha:</strong> <span id="carouselDate"></span></p>
                                        <p><strong>Tipo:</strong> <span id="carouselType"></span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="carousel-controls">
                                <button id="prevBtn" class="carousel-btn" onclick="previousPhoto()">
                                    <i class="bi bi-chevron-left"></i>
                                    Anterior
                                </button>
                                <span class="carousel-indicators">
                                    <span id="currentIndex">1</span> / <span id="totalPhotos">${currentPhotosData.length}</span>
                                </span>
                                <button id="nextBtn" class="carousel-btn" onclick="nextPhoto()">
                                    Siguiente
                                    <i class="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Eliminar modal anterior si existe
    const oldModal = document.getElementById('carouselModal');
    if (oldModal) {
        oldModal.remove();
    }
    
    // Insertar nuevo modal
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Mostrar primera foto
    updateCarouselPhoto();
    
    // Agregar listener para cerrar con ESC
    document.addEventListener('keydown', handleCarouselKeyboard);
    
    // Cerrar al hacer click fuera del modal
    const modal = document.getElementById('carouselModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCarouselModal();
        }
    });
}

// === ACTUALIZAR FOTO DEL CARRUSEL ===
function updateCarouselPhoto() {
    const photo = currentPhotosData[currentPhotoIndex];
    
    document.getElementById('carouselImage').src = photo.url;
    document.getElementById('carouselDesc').textContent = photo.descripcion;
    document.getElementById('carouselId').textContent = photo.id_foto;
    document.getElementById('carouselDate').textContent = formatDate(photo.fecha);
    document.getElementById('carouselType').textContent = getTitleByType(photo.tipo);
    document.getElementById('currentIndex').textContent = currentPhotoIndex + 1;
    
    // Actualizar botones
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    prevBtn.disabled = currentPhotoIndex === 0;
    nextBtn.disabled = currentPhotoIndex === currentPhotosData.length - 1;
}

// === NAVEGACIÓN DEL CARRUSEL ===
function nextPhoto() {
    if (currentPhotoIndex < currentPhotosData.length - 1) {
        currentPhotoIndex++;
        updateCarouselPhoto();
        animateCarousel('next');
    }
}

function previousPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updateCarouselPhoto();
        animateCarousel('prev');
    }
}

function animateCarousel(direction) {
    const image = document.getElementById('carouselImage');
    image.style.opacity = '0';
    setTimeout(() => {
        image.style.opacity = '1';
    }, 150);
}

// === MANEJO DE TECLADO ===
function handleCarouselKeyboard(e) {
    if (e.key === 'Escape') {
        closeCarouselModal();
    } else if (e.key === 'ArrowRight') {
        nextPhoto();
    } else if (e.key === 'ArrowLeft') {
        previousPhoto();
    }
}

// === CERRAR CARRUSEL ===
function closeCarouselModal() {
    const modal = document.getElementById('carouselModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    document.removeEventListener('keydown', handleCarouselKeyboard);
    currentPhotosData = [];
    currentPhotoIndex = 0;
}

// === ABRIR MODAL DE FOTO INDIVIDUAL ===
function openSinglePhotoModal(photoUrl, photoInfo) {
    const modalHTML = `
        <div id="singlePhotoModal" class="modal show">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>
                            <i class="bi bi-image"></i>
                            Detalle de Foto
                        </h5>
                        <button class="btn-close-modal" onclick="closeSinglePhotoModal()">
                            <i class="bi bi-x"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img src="${photoUrl}" alt="Foto" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;">
                        <div class="photo-details">
                            <h6 style="margin-bottom: 0.5rem; color: #202124;">${photoInfo.descripcion}</h6>
                            <p style="margin: 0.25rem 0; color: #5f6368;"><strong>ID:</strong> ${photoInfo.id_foto}</p>
                            <p style="margin: 0.25rem 0; color: #5f6368;"><strong>Fecha:</strong> ${formatDate(photoInfo.fecha)}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const oldModal = document.getElementById('singlePhotoModal');
    if (oldModal) {
        oldModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    const modal = document.getElementById('singlePhotoModal');
    
    // Cerrar con ESC
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            closeSinglePhotoModal();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
    
    // Cerrar al hacer click fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSinglePhotoModal();
        }
    });
}

function closeSinglePhotoModal() {
    const modal = document.getElementById('singlePhotoModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// === HANDLERS DE MODALES GENERALES ===
function initializeModalHandlers() {
    // Cerrar modales existentes
    document.querySelectorAll('.modal .btn-close, .modal .close').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
        });
    });
}

// === SISTEMA DE CHAT ===
function initializeChat() {
    // Aquí va la inicialización del chat si es necesario
    console.log('💬 Chat inicializado');
}

// === UTILIDADES ===
function getTitleByType(type) {
    const titles = {
        'gestion': 'Gestión',
        'precios': 'Precios',
        'exhibiciones': 'Exhibiciones',
        'antes': 'Antes',
        'despues': 'Después'
    };
    return titles[type] || type;
}

function formatDate(dateString) {
    if (!dateString || dateString === 'N/A') return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString('es-VE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

function showNotification(message, type = 'info') {
    const colors = {
        'success': '#34a853',
        'error': '#ea4335',
        'warning': '#fbbc04',
        'info': '#1a73e8'
    };
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// === LAZY LOADING DE IMÁGENES ===
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// === ANIMACIONES CSS ===
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Scripts del módulo cliente cargados completamente');