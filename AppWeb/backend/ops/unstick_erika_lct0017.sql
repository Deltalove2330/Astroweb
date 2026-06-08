-- ════════════════════════════════════════════════════════════════════
--  ops/unstick_erika_lct0017.sql
--  Destrabar el PDV "Locatel Casa Matriz" (LCT0017) de Erika Luque.
--
--  Contexto (validado en BD 2026-06-08):
--    Mercaderista : Erika Luque (id_mercaderista=2, cédula 27322682)
--    PDV          : LCT0017 "Locatel Casa Matriz"
--    Visita       : 3502 (2026-05-22)
--    Problema     : la visita NO tiene foto de desactivación (id_tipo_foto=6),
--                   por eso el punto sigue "activo" desde hace 2 semanas.
--                   La desactivación que intentó Erika nunca persistió.
--
--  Un punto se considera ACTIVO si tiene foto de activación (tipo 5 Aprobada)
--  y NO tiene una desactivación (tipo 6 Aprobada) con fecha posterior
--  (ver merchandisers.py, query de puntos activos). Insertar una foto tipo-6
--  Aprobada con fecha = ahora cierra el punto.
--
--  Es IDEMPOTENTE: solo inserta si aún no existe la foto de desactivación.
--  NOTA: file_path es un marcador (no hay imagen real en Azure). El cierre del
--  punto depende SOLO de la existencia de la fila tipo-6, no del blob.
--
--  Correr UNA vez en la base `epran` (revísalo antes de ejecutar).
-- ════════════════════════════════════════════════════════════════════

SET XACT_ABORT ON;
BEGIN TRANSACTION;

DECLARE @id_visita INT = 3502;

IF NOT EXISTS (
    SELECT 1 FROM FOTOS_TOTALES
    WHERE id_visita = @id_visita AND id_tipo_foto = 6
)
BEGIN
    INSERT INTO FOTOS_TOTALES
        (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado,
         latitud, longitud, altitud, fecha_disparo,
         fabricante_camara, modelo_camara, iso, apertura,
         tiempo_exposicion, orientacion)
    VALUES
        (@id_visita, NULL,
         'desactivacion/manual/LCT0017_visita3502_unstick_2026-06-08.jpg',
         GETDATE(), 6, 'Aprobada',
         NULL, NULL, NULL, GETDATE(),
         NULL, NULL, NULL, NULL,
         NULL, NULL);

    PRINT 'OK: insertada foto de desactivación tipo-6 para la visita 3502. PDV LCT0017 destrabado.';
END
ELSE
    PRINT 'Nada que hacer: la visita 3502 ya tiene foto de desactivación.';

COMMIT TRANSACTION;
