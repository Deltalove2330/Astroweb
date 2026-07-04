/* ============================================================
   MIGRACIÓN — Alertas a supervisores por mercaderistas
   "olvidadizos" (>3 auto-cierres de PDV en 7 días)
   Fecha: 2026-05-30
   ============================================================ */

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'ALERTAS_SUPERVISOR_PDV')
BEGIN
    CREATE TABLE ALERTAS_SUPERVISOR_PDV (
        id_alerta             INT IDENTITY(1,1) PRIMARY KEY,

        id_supervisor         INT          NOT NULL,
        nombre_supervisor     VARCHAR(255) NULL,        -- denormalizado
        cedula_supervisor     VARCHAR(20)  NULL,        -- denormalizado para push

        id_mercaderista       INT          NOT NULL,
        nombre_mercaderista   VARCHAR(255) NULL,        -- denormalizado
        cedula_mercaderista   VARCHAR(20)  NULL,

        cantidad_auto_cierres INT          NOT NULL,    -- en la ventana (7d)
        ventana_dias          INT          NOT NULL DEFAULT 7,

        motivo                VARCHAR(500) NOT NULL DEFAULT 'Mercaderista superó umbral de auto-cierres',
        fecha_alerta          DATETIME2    NOT NULL DEFAULT GETDATE(),

        leida                 BIT          NOT NULL DEFAULT 0,
        fecha_leida           DATETIME2    NULL,

        push_enviado          BIT          NOT NULL DEFAULT 0
    );

    CREATE INDEX idx_alertas_sup_supervisor   ON ALERTAS_SUPERVISOR_PDV(id_supervisor);
    CREATE INDEX idx_alertas_sup_fecha        ON ALERTAS_SUPERVISOR_PDV(fecha_alerta);
    CREATE INDEX idx_alertas_sup_leida        ON ALERTAS_SUPERVISOR_PDV(leida);
END
GO

PRINT '✅ Migración ALERTAS_SUPERVISOR_PDV aplicada.';
