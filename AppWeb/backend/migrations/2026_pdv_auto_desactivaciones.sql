/* ============================================================
   MIGRACIÓN — Auto-desactivación de PDVs al final del día
   Fecha: 2026-05-30
   ============================================================
   PROBLEMA: Mercaderistas dejan PDVs "activados" sin enviar la
   foto de desactivación. Al día siguiente esos PDVs siguen activos
   y bloquean al mercaderista (Web View Android termina mostrando
   "memoria insuficiente" al intentar cargar el estado inválido).

   SOLUCIÓN: Job programado a las 19:00 cierra los PDVs activados
   insertando una foto type=6 con categoría 'Auto-cierre 7PM' y deja
   rastro completo en PDV_AUTO_DESACTIVACIONES.
   ============================================================ */

IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'PDV_AUTO_DESACTIVACIONES')
BEGIN
    CREATE TABLE PDV_AUTO_DESACTIVACIONES (
        id_auto_desact          INT IDENTITY(1,1) PRIMARY KEY,

        -- Quién y qué se cerró automáticamente
        id_punto_interes        VARCHAR(50)  NOT NULL,
        punto_de_interes        VARCHAR(255) NULL,        -- denormalizado para reportes rápidos
        id_mercaderista         INT          NOT NULL,
        mercaderista_nombre     VARCHAR(255) NULL,        -- denormalizado
        cedula_mercaderista     VARCHAR(20)  NULL,
        id_ruta                 INT          NULL,
        ruta_nombre             VARCHAR(255) NULL,        -- denormalizado
        id_cliente              INT          NULL,
        cliente_nombre          VARCHAR(255) NULL,

        -- Cuándo se hizo y por qué
        fecha_activacion_original DATETIME2  NOT NULL,   -- cuándo se activó (foto type=5)
        fecha_auto_desactivacion  DATETIME2  NOT NULL DEFAULT GETDATE(),
        dia_programado          VARCHAR(20)  NULL,        -- 'Lunes', 'Martes', etc. (rp.dia)
        motivo                  VARCHAR(255) NOT NULL DEFAULT 'Auto-cierre 7PM — sin foto de desactivación del mercaderista',

        -- IDs de fotos involucradas
        id_visita               INT          NULL,
        id_foto_activacion      INT          NULL,        -- la foto original que dejó activado
        id_foto_desactivacion_auto INT       NULL,        -- la foto type=6 que insertó el sistema

        creado_en               DATETIME2 NOT NULL DEFAULT GETDATE()
    );

    CREATE INDEX idx_pdv_auto_desact_fecha       ON PDV_AUTO_DESACTIVACIONES(fecha_auto_desactivacion);
    CREATE INDEX idx_pdv_auto_desact_mercaderista ON PDV_AUTO_DESACTIVACIONES(id_mercaderista);
    CREATE INDEX idx_pdv_auto_desact_ruta        ON PDV_AUTO_DESACTIVACIONES(id_ruta);
    CREATE INDEX idx_pdv_auto_desact_punto       ON PDV_AUTO_DESACTIVACIONES(id_punto_interes);
END
GO

PRINT '✅ Migración PDV_AUTO_DESACTIVACIONES aplicada.';
