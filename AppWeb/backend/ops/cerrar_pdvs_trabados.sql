-- ════════════════════════════════════════════════════════════════════
--  ops/cerrar_pdvs_trabados.sql
--  Cierra PDVs "trabados activos": pares (punto, mercaderista, cliente) que
--  tienen una foto de ACTIVACIÓN (id_tipo_foto=5 Aprobada) SIN una de
--  DESACTIVACIÓN (id_tipo_foto=6) posterior → el punto queda activo para siempre
--  (caso típico de activaciones abandonadas de inducciones / pruebas).
--
--  Inserta una foto tipo-6 'Aprobada' (marcador, sin blob real — el cierre
--  depende solo de la existencia de la fila) en la visita de la ÚLTIMA
--  activación de cada par trabado.
--
--  ⚠️ OJO: cierra TODOS los pares activos. Si se corre durante la jornada,
--  cerraría también los que están EN PROGRESO hoy. Para evitarlo, filtrar por
--  fecha (ej. AND ult_act < CAST(GETDATE() AS DATE) para cerrar solo lo viejo).
--  Ejecutado 2026-06-15: 14 pares (todos viejos abril/mayo, 0 de hoy) → cerrados.
--
--  Idempotente (NOT EXISTS) y transaccional.
-- ════════════════════════════════════════════════════════════════════

SET XACT_ABORT ON;
BEGIN TRANSACTION;

;WITH active_pairs AS (
    SELECT vm.identificador_punto_interes AS pdv, vm.id_mercaderista AS merc, vm.id_cliente AS cli
    FROM VISITAS_MERCADERISTA vm
    JOIN FOTOS_TOTALES ft ON ft.id_visita = vm.id_visita
    GROUP BY vm.identificador_punto_interes, vm.id_mercaderista, vm.id_cliente
    HAVING MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN ft.fecha_registro END) IS NOT NULL
       AND (MAX(CASE WHEN ft.id_tipo_foto=6 THEN ft.fecha_registro END) IS NULL
            OR MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN ft.fecha_registro END)
             > MAX(CASE WHEN ft.id_tipo_foto=6 THEN ft.fecha_registro END))
    -- Para cerrar solo lo VIEJO (no lo de hoy), descomentar:
    -- AND MAX(CASE WHEN ft.id_tipo_foto=5 AND ft.Estado='Aprobada' THEN ft.fecha_registro END) < CAST(GETDATE() AS DATE)
),
latest_visita AS (
    SELECT (SELECT TOP 1 vm2.id_visita
            FROM VISITAS_MERCADERISTA vm2 JOIN FOTOS_TOTALES f2 ON f2.id_visita = vm2.id_visita
            WHERE vm2.identificador_punto_interes = ap.pdv AND vm2.id_mercaderista = ap.merc AND vm2.id_cliente = ap.cli
              AND f2.id_tipo_foto=5 AND f2.Estado='Aprobada'
            ORDER BY f2.fecha_registro DESC) AS id_visita
    FROM active_pairs ap
)
INSERT INTO FOTOS_TOTALES (id_visita, categoria, file_path, fecha_registro, id_tipo_foto, Estado, fecha_disparo)
SELECT lv.id_visita, NULL,
       'desactivacion/manual/cleanup_' + CAST(lv.id_visita AS VARCHAR(12)) + '.jpg',
       GETDATE(), 6, 'Aprobada', GETDATE()
FROM latest_visita lv
WHERE lv.id_visita IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM FOTOS_TOTALES f WHERE f.id_visita = lv.id_visita AND f.id_tipo_foto = 6);

PRINT 'Desactivaciones insertadas: ' + CAST(@@ROWCOUNT AS VARCHAR(10));

COMMIT TRANSACTION;
