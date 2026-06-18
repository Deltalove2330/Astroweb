/* ============================================================
   MIGRACIÓN — Razón de no activación de ruta (Auditor)
   Fecha: 2026-06-18
   ============================================================
   El auditor puede decidir NO activar una ruta hoy. En ese caso
   se registra el motivo. Se reutiliza RUTAS_ACTIVADAS con
   estado = 'No Activada' y una columna nueva razon_no_activacion.
   Las consultas de activación existentes filtran por
   estado IN ('En Progreso','Finalizado'), así que estas filas no
   las afectan.
   ============================================================ */

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('RUTAS_ACTIVADAS') AND name = 'razon_no_activacion'
)
BEGIN
    ALTER TABLE RUTAS_ACTIVADAS ADD razon_no_activacion NVARCHAR(500) NULL;
END
GO

PRINT '✅ Migración razon_no_activacion (RUTAS_ACTIVADAS) aplicada.';
