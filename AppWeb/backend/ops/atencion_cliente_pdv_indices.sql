-- ════════════════════════════════════════════════════════════════════
--  ops/atencion_cliente_pdv_indices.sql
--  Índices para acelerar la creación de PDV en el módulo ATC.
--
--  Problema: al crear un PDV se genera el identificador buscando el mayor
--  existente de la categoría:
--      SELECT TOP 1 identificador FROM PUNTOS_INTERES1
--      WHERE jerarquia_nivel_2_2 = ? ORDER BY identificador DESC
--  Sin índice esto es un table scan + sort. En rubros con muchos PDV
--  (ferretería, carnicería) eso tardaba mucho. El código ya usa TOP 1;
--  este índice lo vuelve un SEEK instantáneo.
--
--  Correr UNA vez en la base `epran`. Idempotente.
-- ════════════════════════════════════════════════════════════════════

-- ── 1) Identificador por jerarquía (genera el correlativo del PDV) ──
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_PI1_jerarquia22_identificador'
      AND object_id = OBJECT_ID('dbo.PUNTOS_INTERES1')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_PI1_jerarquia22_identificador
        ON dbo.PUNTOS_INTERES1 (jerarquia_nivel_2_2, identificador DESC);
    PRINT 'Índice IX_PI1_jerarquia22_identificador creado.';
END
ELSE
    PRINT 'IX_PI1_jerarquia22_identificador ya existe — nada que hacer.';
GO

-- ── 2) Prefijo de identificador (ruta alterna de generación) ──
--  Acelera:  WHERE identificador LIKE 'XXX%' ORDER BY identificador DESC
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_PI1_identificador'
      AND object_id = OBJECT_ID('dbo.PUNTOS_INTERES1')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_PI1_identificador
        ON dbo.PUNTOS_INTERES1 (identificador);
    PRINT 'Índice IX_PI1_identificador creado.';
END
ELSE
    PRINT 'IX_PI1_identificador ya existe — nada que hacer.';
GO

-- ────────────────────────────────────────────────────────────────────
--  OPCIONAL (recomendado a futuro): índice espacial para la verificación
--  de PDV cercano. Hoy esa consulta hace TRY_CAST(latitud/longitud) sobre
--  toda la tabla (scan). La columna coordenadas_geography ya se llena en
--  los PDV nuevos; si se rellena en los históricos, se puede reescribir la
--  consulta con STDistance y este índice la vuelve casi instantánea.
--
--  OJO: crear un índice espacial sobre una tabla grande puede tardar y
--  bloquear; correrlo en ventana de bajo tráfico.
-- ────────────────────────────────────────────────────────────────────
-- IF NOT EXISTS (
--     SELECT 1 FROM sys.indexes
--     WHERE name = 'SIX_PI1_coordenadas_geography'
--       AND object_id = OBJECT_ID('dbo.PUNTOS_INTERES1')
-- )
-- BEGIN
--     CREATE SPATIAL INDEX SIX_PI1_coordenadas_geography
--         ON dbo.PUNTOS_INTERES1 (coordenadas_geography)
--         USING GEOGRAPHY_AUTO_GRID;
--     PRINT 'Índice espacial SIX_PI1_coordenadas_geography creado.';
-- END
-- GO
