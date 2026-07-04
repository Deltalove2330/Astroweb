/* ═══════════════════════════════════════════════════════════════════════
 * coordinador-photo-viewers.js
 * ───────────────────────────────────────────────────────────────────────
 * Visores de fotos SOLO LECTURA para el Centro de Mando del Coordinador
 * (centro_mando_cliente.html).
 *
 * Problema que resuelve:
 *   Las tarjetas de unified-visits.js llaman a viewVisitPhotos(),
 *   viewVisitPrice(), viewVisitExhibitions(), viewVisitPop() y
 *   viewVisitActivations(), pero esas funciones viven en main.js, que NO se
 *   carga en la página del coordinador. Por eso el coordinador no podía ver
 *   las fotos de gestiones ni de activaciones.
 *
 * Este módulo provee versiones autónomas y de solo lectura (sin
 * aprobar/rechazar; eso es trabajo del analista). Usa jQuery, Bootstrap,
 * SweetAlert2 y window.getImageUrl, todos ya presentes en la página.
 *
 * Se define solo si main.js no proveyó ya estas funciones (defensivo).
 * ═══════════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    function _img(fp) {
        return (window.getImageUrl ? window.getImageUrl(fp) : (fp || '/static/images/placeholder.png'));
    }

    function _estadoBadge(estado, foto_actualizada) {
        var e = estado || 'Pendiente';
        if (e === 'Rechazada' && foto_actualizada) e = 'Rechazada-Actualizada';
        var cls = 'bg-secondary';
        if (e === 'Aprobada') cls = 'bg-success';
        else if (e === 'Rechazada' || e === 'Rechazada-Actualizada') cls = 'bg-danger';
        else if (e === 'Pendiente') cls = 'bg-warning text-dark';
        return '<span class="badge ' + cls + '">' + e + '</span>';
    }

    /* Construye y muestra un modal dinámico limpiando cualquier instancia previa. */
    function _showModal(html) {
        var $prev = $('#cpvModal');
        if ($prev.length) {
            var existing = bootstrap.Modal.getInstance($prev[0]);
            if (existing) existing.dispose();
            $prev.remove();
        }
        $('.modal-backdrop').remove();
        $('body').removeClass('modal-open').css('overflow', '');

        var $m = $('<div class="modal fade" id="cpvModal" tabindex="-1" aria-hidden="true"></div>');
        $m.html(html);
        $('body').append($m);
        new bootstrap.Modal($m[0], { backdrop: true, keyboard: true }).show();
    }

    /* Visor genérico de solo lectura para categorías de FOTOS_TOTALES
       (gestión / precio / exhibición / pop). */
    function _showGallery(visitId, categoria, titulo, icono) {
        $.getJSON('/api/fotos-with-status/' + visitId + '/' + categoria)
            .done(function (photos) {
                if (!photos || photos.length === 0) {
                    Swal.fire('Información', 'No hay fotos de ' + titulo.toLowerCase() + ' para esta visita', 'info');
                    return;
                }

                // Orden estable: "antes" primero, luego "después".
                var orden = { antes: 0, despues: 1 };
                photos = photos.slice().sort(function (a, b) {
                    var oa = (a.orden_par !== undefined) ? a.orden_par : (a.id_foto || 0);
                    var ob = (b.orden_par !== undefined) ? b.orden_par : (b.id_foto || 0);
                    var ta = orden[a.type] !== undefined ? orden[a.type] : 9;
                    var tb = orden[b.type] !== undefined ? orden[b.type] : 9;
                    return (ta - tb) || (oa - ob);
                });

                var cards = photos.map(function (p) {
                    var url = _img(p.file_path);
                    var label = p.type === 'antes' ? '📷 Antes'
                              : p.type === 'despues' ? '✅ Después' : '';
                    return '' +
                        '<div class="col-6 col-md-4 col-lg-3 mb-3">' +
                          '<div class="border rounded p-2 h-100 text-center">' +
                            (label ? '<div class="small text-muted mb-1">' + label + '</div>' : '') +
                            '<img src="' + url + '" loading="lazy" class="img-fluid rounded mb-2" ' +
                                 'style="max-height:200px;object-fit:contain;cursor:pointer;" ' +
                                 'onclick="window.open(\'' + url + '\',\'_blank\')">' +
                            '<div>' + _estadoBadge(p.estado, p.foto_actualizada) + '</div>' +
                          '</div>' +
                        '</div>';
                }).join('');

                _showModal(
                    '<div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">' +
                      '<div class="modal-content">' +
                        '<div class="modal-header">' +
                          '<h5 class="modal-title"><i class="bi ' + icono + ' me-2"></i>' + titulo +
                          ' — Visita #' + visitId + '</h5>' +
                          '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>' +
                        '</div>' +
                        '<div class="modal-body"><div class="row g-2">' + cards + '</div></div>' +
                        '<div class="modal-footer">' +
                          '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>' +
                        '</div>' +
                      '</div>' +
                    '</div>'
                );
            })
            .fail(function () {
                Swal.fire('Error', 'No se pudieron cargar las fotos de ' + titulo.toLowerCase(), 'error');
            });
    }

    if (typeof window.viewVisitPhotos !== 'function') {
        window.viewVisitPhotos = function (visitId) {
            _showGallery(visitId, 'gestion', 'Gestión', 'bi-images');
        };
    }
    if (typeof window.viewVisitPrice !== 'function') {
        window.viewVisitPrice = function (visitId) {
            _showGallery(visitId, 'precio', 'Precios', 'bi-currency-dollar');
        };
    }
    if (typeof window.viewVisitExhibitions !== 'function') {
        window.viewVisitExhibitions = function (visitId) {
            _showGallery(visitId, 'exhibicion', 'Exhibiciones', 'bi-collection');
        };
    }
    if (typeof window.viewVisitPop !== 'function') {
        window.viewVisitPop = function (visitId) {
            _showGallery(visitId, 'pop', 'Material POP', 'bi-box-seam');
        };
    }

    if (typeof window.viewVisitActivations !== 'function') {
        window.viewVisitActivations = function (visitId) {
            $.getJSON('/api/visit-activation-photos/' + visitId)
                .done(function (photos) {
                    if (!photos || photos.length === 0) {
                        Swal.fire('Información', 'No hay fotos de activación/desactivación para esta visita', 'info');
                        return;
                    }
                    var act = photos.find(function (p) { return p.id_tipo_foto === 5; }) || null;
                    var des = photos.find(function (p) { return p.id_tipo_foto === 6; }) || null;

                    function panel(foto, label, icon) {
                        if (!foto) {
                            return '<div class="text-center p-4" style="border:2px dashed var(--bs-border-color);border-radius:12px;opacity:.5;">' +
                                   '<i class="bi ' + icon + ' fs-1 d-block mb-2"></i>' +
                                   '<p class="mb-0 text-muted">Sin foto de ' + label.toLowerCase() + '</p></div>';
                        }
                        var url = _img(foto.file_path);
                        return '<div class="text-center">' +
                               '<img src="' + url + '" class="img-fluid rounded shadow-sm" ' +
                               'style="max-height:380px;max-width:100%;object-fit:contain;cursor:pointer;" ' +
                               'onclick="window.open(\'' + url + '\',\'_blank\')">' +
                               '<div class="mt-2">' + _estadoBadge(foto.estado, foto.foto_actualizada) +
                               (foto.fecha_registro ? '<small class="d-block text-muted mt-1">' +
                                  new Date(foto.fecha_registro).toLocaleString('es-VE') + '</small>' : '') +
                               '</div></div>';
                    }

                    var ref = act || des;
                    _showModal(
                        '<div class="modal-dialog modal-xl modal-dialog-centered">' +
                          '<div class="modal-content">' +
                            '<div class="modal-header">' +
                              '<h5 class="modal-title"><i class="bi bi-lightning-charge-fill text-warning me-2"></i>' +
                              'Activación / Desactivación — Visita #' + visitId + '</h5>' +
                              '<button type="button" class="btn-close" data-bs-dismiss="modal"></button>' +
                            '</div>' +
                            '<div class="modal-body">' +
                              (ref ? '<p class="text-muted small mb-3"><i class="bi bi-person me-1"></i>' +
                                     (ref.mercaderista || '') + ' &nbsp;•&nbsp; <i class="bi bi-building me-1"></i>' +
                                     (ref.cliente || '') + '</p>' : '') +
                              '<div class="row g-4">' +
                                '<div class="col-md-6"><h6 class="mb-3"><span class="badge bg-success me-2">' +
                                  '<i class="bi bi-play-circle-fill"></i></span>Entrada (Activación)</h6>' +
                                  panel(act, 'Activación', 'bi-play-circle') + '</div>' +
                                '<div class="col-md-6"><h6 class="mb-3"><span class="badge bg-danger me-2">' +
                                  '<i class="bi bi-stop-circle-fill"></i></span>Salida (Desactivación)</h6>' +
                                  panel(des, 'Desactivación', 'bi-stop-circle') + '</div>' +
                              '</div>' +
                            '</div>' +
                            '<div class="modal-footer">' +
                              '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>' +
                            '</div>' +
                          '</div>' +
                        '</div>'
                    );
                })
                .fail(function () {
                    Swal.fire('Error', 'No se pudieron cargar las fotos de activación', 'error');
                });
        };
    }
})();
