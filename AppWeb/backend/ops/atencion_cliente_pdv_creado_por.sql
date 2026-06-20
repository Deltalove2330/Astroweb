-- ════════════════════════════════════════════════════════════════════
--  ops/atencion_cliente_pdv_creado_por.sql
--  Agrega la columna creado_por a PUNTOS_INTERES1 para registrar QUÉ
--  usuario (ATC) creó cada PDV. La fecha ya se guarda en fecha_creado.
--
--  Solo aplica a PDV nuevos: los históricos quedan en NULL (no hay forma
--  fiable de saber quién los creó).
--
--  Idempotente. Correr UNA vez en la base `epran`.
-- ════════════════════════════════════════════════════════════════════

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.PUNTOS_INTERES1')
      AND name = 'creado_por'
)
BEGIN
    ALTER TABLE dbo.PUNTOS_INTERES1 ADD creado_por NVARCHAR(150) NULL;
    PRINT 'Columna PUNTOS_INTERES1.creado_por creada.';
END
ELSE
    PRINT 'PUNTOS_INTERES1.creado_por ya existe — nada que hacer.';
GO
