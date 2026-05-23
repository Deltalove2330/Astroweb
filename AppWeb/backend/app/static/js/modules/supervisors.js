// /static/js/modules/supervisors.js

/**
 * Módulo de Supervisor — Gestión de Fotos
 * ✅ Filtro de fecha (hoy por defecto)
 * ✅ Cache de imágenes y deduplicación de requests
 * ✅ Colores blancos/claros para fondos oscuros
 */
document.addEventListener('DOMContentLoaded', function () {

    // ─────────────────────────────────────────────
    // ESTADO GLOBAL
    // ─────────────────────────────────────────────
    const imageCache   = new Map();
    const loadedTabs   = new Set();
    const requestQueue = new Map();

    let currentPhotoDetails = null;
    let selectedPhotoFile   = null;
    let currentPhotoId      = null;
    let currentPointName    = null;
    let currentClientName   = null;

    // ─────────────────────────────────────────────
    // UTILIDADES DE FECHA
    // ─────────────────────────────────────────────
    function todayISO() {
        return new Date().toISOString().slice(0, 10);   // YYYY-MM-DD
    }

    function getFechas() {
        const fi = document.getElementById('fecha_inicio')?.value || todayISO();
        const ff = document.getElementById('fecha_fin')?.value    || todayISO();
        return { fecha_inicio: fi, fecha_fin: ff };
    }

    function initFechas() {
        const hoy = todayISO();
        const fi  = document.getElementById('fecha_inicio');
        const ff  = document.getElementById('fecha_fin');
        if (fi) fi.value = hoy;
        if (ff) ff.value = hoy;
    }

    initFechas();

    // ─────────────────────────────────────────────
    // BOTONES DE FILTRO
    // ─────────────────────────────────────────────
    document.getElementById('btnHoy')?.addEventListener('click', function () {
        initFechas();
        reloadAllTabs();
    });

    document.getElementById('btnFiltrar')?.addEventListener('click', function () {
        reloadAllTabs();
    });

    function reloadAllTabs() {
        // Limpiar caché y sets de tabs cargadas
        window._supervisorCache = {};
        loadedTabs.clear();

        // Recargar la pestaña activa
        const activeTab = document.querySelector('.nav-link.active[data-bs-target]');
        if (activeTab) activeTab.click();
    }

    // ─────────────────────────────────────────────
    // FETCH CON DEDUPLICACIÓN
    // ─────────────────────────────────────────────
    async function fetchWithDedupe(url, options = {}) {
        const key = `${url}_${JSON.stringify(options)}`;
        if (requestQueue.has(key)) {
            return requestQueue.get(key);
        }
        const promise = fetch(url, options).finally(() => requestQueue.delete(key));
        requestQueue.set(key, promise);
        return promise;
    }

    // ─────────────────────────────────────────────
    // HELPERS DE BADGE
    // ─────────────────────────────────────────────
    function getEstadoBadgeClass(estado) {
        const map = {
            'Rechazada':   'bg-danger',
            'Aprobada':    'bg-success',
            'Pendiente':   'bg-warning text-dark',
            'No Revisado': 'bg-secondary',
        };
        return map[estado] || 'bg-secondary';
    }

    // ─────────────────────────────────────────────
    // ACTUALIZAR CONTADORES DE PESTAÑAS
    // ─────────────────────────────────────────────
    function updateTabCount(estado, count) {
        const tabMap = {
            'rechazadas':  'count-rejected',
            'aprobada':    'count-approved',
            'pendiente':   'count-pending',
            'no revisado': 'count-noreview',
        };
        const el = document.getElementById(tabMap[estado]);
        if (!el) return;
        el.textContent = count;
        el.style.display = count > 0 ? 'inline-block' : 'none';
        el.style.color           = '#ffffff';
        el.style.backgroundColor = 'rgba(255,255,255,0.2)';
    }

    // ─────────────────────────────────────────────
    // RENDERIZAR CARD DE FOTO
    // ─────────────────────────────────────────────
    function renderPhotoCard(photo, estado) {
        const imageUrl  = window.getImageUrl(photo.file_path);
        const isAntes   = photo.file_path?.toLowerCase().includes('antes');
        const photoType = isAntes ? 'Antes' : 'Después';
        const safePoint = (photo.punto_de_interes || '').replace(/'/g, "\\'");
        const safeClient = (photo.cliente || '').replace(/'/g, "\\'");

        return `
        <div class="col">
            <div class="card h-100 shadow-sm">
                <img src="/static/images/placeholder.png"
                     data-src="${imageUrl}"
                     class="card-img-top photo-thumbnail lazy-img"
                     alt="Foto ${photoType} - ${photo.punto_de_interes}"
                     style="height:220px;object-fit:cover;cursor:pointer;"
                     data-bs-toggle="tooltip"
                     title="${photo.punto_de_interes}"
                     data-photo='${JSON.stringify(photo).replace(/'/g, "\\'")}'>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-title fw-bold mb-2 text-truncate" title="${photo.punto_de_interes}">
                        ${photo.punto_de_interes}
                    </h6>
                    ${photo.direccion
                        ? `<small class="d-block mb-2 text-muted"><i class="bi bi-geo-alt me-1"></i>${photo.direccion}</small>`
                        : ''}
                    <div class="small flex-grow-1" style="line-height:1.7;">
                        <div><strong>Cliente:</strong> ${photo.cliente}</div>
                        <div><strong>Ruta:</strong> ${photo.ruta}</div>
                        <div><strong>Fecha:</strong> ${photo.fecha_visita}</div>
                        <div><strong>Mercaderista:</strong> ${photo.mercaderista}</div>
                    </div>
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                        <span class="badge ${getEstadoBadgeClass(photo.estado)}">
                            ${photo.estado || estado}
                        </span>
                        ${estado === 'rechazadas'
                            ? `<button class="btn btn-sm btn-success"
                                       onclick="openPhotoReplacementModal(${photo.id_foto}, '${safePoint}', '${safeClient}')">
                                   <i class="bi bi-pencil-square"></i>
                               </button>`
                            : ''}
                    </div>
                </div>
            </div>
        </div>`;
    }

    function renderEmpty(estado) {
        return `
        <div class="col-12">
            <div class="empty-state text-center py-5">
                <i class="bi bi-folder-x d-block mb-3" style="font-size:3rem;"></i>
                <h5 class="fw-bold mb-2">No hay fotos</h5>
                <p class="mb-0">No se encontraron fotos en estado "${estado}" para el rango seleccionado.</p>
            </div>
        </div>`;
    }

    function renderError(error, estado, containerId) {
        return `
        <div class="col-12">
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Error:</strong> ${error.message}
                <button class="btn btn-sm btn-outline-danger ms-3"
                        onclick="loadSupervisorPhotos('${estado}', '${containerId}')">
                    <i class="bi bi-arrow-repeat"></i> Reintentar
                </button>
            </div>
        </div>`;
    }

    // ─────────────────────────────────────────────
    // LAZY LOADING + TOOLTIPS + DELEGACIÓN DE CLICK
    // ─────────────────────────────────────────────
    function attachContainerBehaviors(container, data, estado) {
        // Lazy loading
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        }, { rootMargin: '150px' });

        container.querySelectorAll('.lazy-img[data-src]').forEach(img => observer.observe(img));

        // Tooltips
        container.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            new bootstrap.Tooltip(el, { trigger: 'hover' });
        });

        // Click en foto → modal
        container.addEventListener('click', function (e) {
            const img = e.target.closest('.photo-thumbnail');
            if (img) {
                try {
                    const photoData = JSON.parse(img.getAttribute('data-photo'));
                    viewPhotoModal(photoData);
                } catch (err) {
                    console.error('Error parsing photo data:', err);
                }
            }
        }, { once: true });
    }

    // ─────────────────────────────────────────────
    // FUNCIÓN PRINCIPAL: CARGAR FOTOS
    // ─────────────────────────────────────────────
    const { fecha_inicio, fecha_fin } = getFechas();   // solo para construir la cacheKey inicial

    window.loadSupervisorPhotos = function (estado, containerId) {
        const { fecha_inicio, fecha_fin } = getFechas();
        const tabKey = `${estado}_${containerId}_${fecha_inicio}_${fecha_fin}`;

        if (loadedTabs.has(tabKey)) {
            console.log(`✅ Ya cargado: ${tabKey}`);
            return;
        }

        const container = document.querySelector(containerId);
        if (!container) {
            console.error(`❌ Contenedor no encontrado: ${containerId}`);
            return;
        }

        loadedTabs.add(tabKey);

        // Mostrar spinner
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary" role="status" style="width:3rem;height:3rem;"></div>
                <p class="mt-3 text-muted">Cargando...</p>
            </div>`;

        // ── Cache en memoria ──
        window._supervisorCache = window._supervisorCache || {};
        if (window._supervisorCache[tabKey]) {
            const cached = window._supervisorCache[tabKey];
            updateTabCount(estado, cached.length);
            container.innerHTML = cached.length
                ? cached.map(p => renderPhotoCard(p, estado)).join('')
                : renderEmpty(estado);
            attachContainerBehaviors(container, cached, estado);
            return;
        }

        // ── Fetch al backend ──
        const params = new URLSearchParams({ fecha_inicio, fecha_fin });
        const url    = `/supervisor/api/supervisor-photos/${encodeURIComponent(estado)}?${params}`;

        fetchWithDedupe(url)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                const c = document.querySelector(containerId);
                if (!c) return;

                updateTabCount(estado, data?.length || 0);
                window._supervisorCache[tabKey] = data;

                c.innerHTML = (!data || data.length === 0)
                    ? renderEmpty(estado)
                    : data.map(p => renderPhotoCard(p, estado)).join('');

                attachContainerBehaviors(c, data, estado);
            })
            .catch(error => {
                console.error('❌ Error cargando fotos:', error);
                const c = document.querySelector(containerId);
                if (c) c.innerHTML = renderError(error, estado, containerId);
            });
    };

    // ─────────────────────────────────────────────
    // MODAL VISTA AMPLIADA
    // ─────────────────────────────────────────────
    window.viewPhotoModal = function (photo) {
        try {
            currentPhotoDetails = photo;
            document.getElementById('modalPhoto').src    = window.getImageUrl(photo.file_path);
            document.getElementById('modalPhoto').alt    = `Foto de ${photo.punto_de_interes}`;

            document.getElementById('photoDetails').innerHTML = `
                <div class="card border-0 shadow-sm" style="background:rgba(255,255,255,0.15);backdrop-filter:blur(10px);">
                    <div class="card-body">
                        <h6 class="card-title fw-bold mb-3" style="color:#ffffff;">
                            <i class="bi bi-geo-alt-fill me-2"></i>${photo.punto_de_interes}
                        </h6>
                        ${photo.direccion
                            ? `<p class="text-white-50 small mb-3"><i class="bi bi-map me-1"></i>${photo.direccion}</p>`
                            : ''}
                        <div class="row g-2 small">
                            <div class="col-md-6">
                                <p class="mb-1" style="color:#f8f9fa;"><strong style="color:#fff;">Cliente:</strong> ${photo.cliente}</p>
                                <p class="mb-1" style="color:#f8f9fa;"><strong style="color:#fff;">Ruta:</strong> ${photo.ruta}</p>
                                <p class="mb-1" style="color:#f8f9fa;"><strong style="color:#fff;">Fecha visita:</strong> ${photo.fecha_visita}</p>
                            </div>
                            <div class="col-md-6">
                                <p class="mb-1" style="color:#f8f9fa;"><strong style="color:#fff;">Categoría:</strong> ${photo.categoria || 'Sin categoría'}</p>
                                <p class="mb-1" style="color:#f8f9fa;"><strong style="color:#fff;">Mercaderista:</strong> ${photo.mercaderista}</p>
                                <p class="mb-1">
                                    <strong style="color:#fff;">Estado:</strong>
                                    <span class="badge ${getEstadoBadgeClass(photo.estado)}">${photo.estado || 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                        ${photo.razon_rechazo
                            ? `<div class="alert alert-warning mt-3 mb-0 small"
                                    style="background:rgba(255,193,7,0.2);border-color:#ffc107;">
                                   <i class="bi bi-exclamation-triangle me-1"></i>
                                   <strong style="color:#fff3cd;">Razón:</strong>
                                   <span style="color:#fff;">${photo.razon_rechazo}</span>
                               </div>`
                            : ''}
                    </div>
                </div>`;

            bootstrap.Modal.getOrCreateInstance(document.getElementById('photoModal')).show();

        } catch (error) {
            console.error('❌ Error en viewPhotoModal:', error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo mostrar la foto' });
        }
    };

    // ─────────────────────────────────────────────
    // MODAL REEMPLAZO DE FOTO
    // ─────────────────────────────────────────────
    window.openPhotoReplacementModal = function (photoId, pointName, clientName) {
        currentPhotoId    = photoId;
        currentPointName  = pointName;
        currentClientName = clientName;

        document.getElementById('currentPhotoId').value    = photoId;
        document.getElementById('currentPointName').value  = pointName;
        document.getElementById('currentClientName').value = clientName;
        document.getElementById('photoPreviewContainer').classList.add('d-none');
        document.getElementById('photoPlaceholder').classList.remove('d-none');
        document.getElementById('confirmationMessage').classList.add('d-none');
        selectedPhotoFile = null;

        bootstrap.Modal.getOrCreateInstance(document.getElementById('photoReplacementModal')).show();
    };

    document.getElementById('cameraBtn')?.addEventListener('click', () =>
        document.getElementById('cameraInput').click());

    document.getElementById('galleryBtn')?.addEventListener('click', () =>
        document.getElementById('galleryInput').click());

    document.getElementById('cameraInput')?.addEventListener('change', e =>
        handlePhotoSelection(e));

    document.getElementById('galleryInput')?.addEventListener('change', e =>
        handlePhotoSelection(e));

    function handlePhotoSelection(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.match('image.*')) {
            Swal.fire({ icon: 'error', title: 'Archivo inválido', text: 'Por favor seleccione una imagen válida (JPG, PNG, GIF)' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'Archivo muy grande', text: 'La imagen no debe superar los 10 MB' });
            return;
        }

        selectedPhotoFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('photoPreview').src = e.target.result;
            document.getElementById('photoPreviewContainer').classList.remove('d-none');
            document.getElementById('photoPlaceholder').classList.add('d-none');
            document.getElementById('confirmationMessage').classList.remove('d-none');
        };
        reader.readAsDataURL(file);
        event.target.value = '';
    }

    document.getElementById('confirmReplacementBtn')?.addEventListener('click', function () {
        if (!selectedPhotoFile || !currentPhotoId) return;

        Swal.fire({
            title: '🔄 Subiendo foto...',
            html: 'Por favor espere mientras se procesa la imagen',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        const formData = new FormData();
        formData.append('photo',        selectedPhotoFile);
        formData.append('photo_id',     currentPhotoId);
        formData.append('point_name',   currentPointName);
        formData.append('client_name',  currentClientName);

        fetchWithDedupe('/supervisor/api/replace-rejected-photo', { method: 'POST', body: formData })
            .then(r => r.json())
            .then(data => {
                Swal.close();
                if (data.success) {
                    Swal.fire({ icon: 'success', title: '✅ ¡Éxito!', text: 'La foto ha sido reemplazada correctamente.', timer: 2000, showConfirmButton: false });
                    bootstrap.Modal.getInstance(document.getElementById('photoReplacementModal'))?.hide();

                    // ✅ Limpiar caché y recargar pestaña activa
                    window._supervisorCache = {};
                    loadedTabs.clear();
                    setTimeout(() => {
                        document.querySelector('.nav-link.active[data-bs-target]')?.click();
                    }, 1500);
                } else {
                    Swal.fire({ icon: 'error', title: '❌ Error', text: data.message || 'No se pudo reemplazar la foto' });
                }
            })
            .catch(error => {
                Swal.close();
                console.error('❌ Error en reemplazo:', error);
                Swal.fire({ icon: 'error', title: 'Error de conexión', text: 'No se pudo comunicar con el servidor' });
            });
    });

    // ─────────────────────────────────────────────
    // CONFIGURAR PESTAÑAS
    // ─────────────────────────────────────────────
    const estadoMap = {
        'rejected':  'rechazadas',
        'approved':  'aprobada',
        'pending':   'pendiente',
        'noreview':  'no revisado',
    };

    function setupTabs() {
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
            // Clonar para eliminar listeners anteriores
            const newTab = tab.cloneNode(true);
            tab.parentNode?.replaceChild(newTab, tab);

            newTab.addEventListener('shown.bs.tab', function (e) {
                const target = e.target.getAttribute('data-bs-target');
                if (!target) return;

                const slug        = target.replace('#', '').replace('-photos', '');
                const estadoParam = estadoMap[slug];
                const containerId = `#${slug}-photos-container`;

                if (!estadoParam) return;

                const { fecha_inicio, fecha_fin } = getFechas();
                const tabKey = `${estadoParam}_${containerId}_${fecha_inicio}_${fecha_fin}`;

                if (!loadedTabs.has(tabKey)) {
                    loadSupervisorPhotos(estadoParam, containerId);
                }
            });
        });
    }

    // ─────────────────────────────────────────────
    // INICIALIZACIÓN
    // ─────────────────────────────────────────────
    setupTabs();

    // Cargar la pestaña de rechazadas al inicio
    loadSupervisorPhotos('rechazadas', '#rejected-photos-container');

    // Limpiar recursos al salir
    window.addEventListener('beforeunload', function () {
        imageCache.clear();
        loadedTabs.clear();
        requestQueue.clear();
    });
});