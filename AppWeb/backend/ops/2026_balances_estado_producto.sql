-- ════════════════════════════════════════════════════════════════════
--  ops/2026_balances_estado_producto.sql
--  FASE 1 — Columna de estado observado por producto en la carga de data.
--
--  Hoy BALANCES_TOTALES no distingue, cuando un producto queda vacío, entre:
--    · 'quiebre'   → el producto DEBERÍA estar en el PDV pero está agotado
--    · 'no_existe' → el producto NO se maneja en ese PDV (no debería haber)
--    · 'normal'    → hay stock / se relevó con cantidades
--  La nueva visual de carga (tabla precargada) escribe este campo por fila.
--
--  PRODUCTS.inagotable se mantiene como el default GLOBAL ("must-have en
--  todos lados"). La configuración fina por PDV es la FASE 2 (abajo).
--
--  Correr UNA vez en `epran`. Bajo riesgo: columna nueva NULL-able, no toca
--  filas existentes (legacy = NULL = sin clasificar).
-- ════════════════════════════════════════════════════════════════════

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.BALANCES_TOTALES')
      AND name = 'estado_producto'
)
BEGIN
    ALTER TABLE dbo.BALANCES_TOTALES
        ADD estado_producto VARCHAR(20) NULL;   -- 'normal' | 'quiebre' | 'no_existe'
    PRINT 'OK: columna BALANCES_TOTALES.estado_producto creada.';
END
ELSE
    PRINT 'BALANCES_TOTALES.estado_producto ya existe — nada que hacer.';
GO


-- ════════════════════════════════════════════════════════════════════
--  FASE 2 (PROPUESTA — NO ejecutar todavía) — Configuración por PDV.
--
--  Tabla maestra: qué productos llegan y/o son inagotables EN CADA PDV.
--  Con esto, en la carga de data el sistema puede AUTODETECTAR el estado de
--  un vacío en vez de depender solo de la marca manual del mercaderista:
--    · producto en PRODUCTOS_PDV con debe_estar=1 y vacío → 'quiebre'
--    · producto NO en PRODUCTOS_PDV (o debe_estar=0) y vacío → 'no_existe'
--
--  Se deja comentada para que la revises/poblés con calma.
-- ════════════════════════════════════════════════════════════════════
--
-- CREATE TABLE dbo.PRODUCTOS_PDV (
--     id_producto_pdv    INT IDENTITY(1,1) PRIMARY KEY,
--     id_product         INT NOT NULL,                 -- FK PRODUCTS.ID_PRODUCT
--     identificador_pdv  VARCHAR(50) NOT NULL,         -- FK PUNTOS_INTERES1.identificador
--     llega_al_pdv       BIT NOT NULL DEFAULT 1,       -- el producto se distribuye a este PDV
--     inagotable_en_pdv  BIT NOT NULL DEFAULT 0,       -- debe estar SIEMPRE (must-have) en este PDV
--     debe_estar         AS (CASE WHEN llega_al_pdv = 1 THEN 1 ELSE 0 END), -- helper
--     fecha_registro     DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
--     CONSTRAINT UQ_PRODUCTOS_PDV UNIQUE (id_product, identificador_pdv)
-- );
-- CREATE INDEX IX_PRODUCTOS_PDV_pdv ON dbo.PRODUCTOS_PDV (identificador_pdv);
