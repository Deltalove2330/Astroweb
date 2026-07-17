-- ════════════════════════════════════════════════════════════════════
--  ops/chat_grupo_lecturas_mensaje.sql
--  Recibo de lectura POR MENSAJE (quién lo leyó y a qué hora), para los
--  dos chats de grupo:
--    • CHAT_GRUPO_MENSAJES        (chat general del grupo del cliente)
--    • CHAT_MENSAJES_GRUPO_VISITA (sub-hilo por visita dentro del grupo)
--
--  A diferencia de CHAT_GRUPO_LECTURAS (que solo guarda "hasta qué
--  id_mensaje leyó cada uno" — un puntero, para el badge de no-leídos),
--  estas tablas guardan una fila POR mensaje Y usuario que lo leyó, con
--  fecha_lectura, igual que ya existe para el chat 1-a-1 (CHAT_LECTURAS,
--  ver socket_chat.py). Eso permite mostrar "leído por Fulano a las
--  3:15pm" en cada mensaje, estilo WhatsApp (ticks + lista de quién leyó).
--
--  CHAT_GRUPO_LECTURAS NO se reemplaza: se sigue usando tal cual para el
--  conteo de no-leídos (mis-grupos). Estas tablas son un registro
--  adicional, más detallado, solo para la UI de "visto por".
--
--  Idempotente: re-ejecutable sin error. Correr UNA vez en la base `epran`.
-- ════════════════════════════════════════════════════════════════════

-- ───────────────── 1) CHAT_GRUPO_MENSAJE_LECTURAS ─────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'CHAT_GRUPO_MENSAJE_LECTURAS')
BEGIN
    CREATE TABLE dbo.CHAT_GRUPO_MENSAJE_LECTURAS (
        id_mensaje     INT           NOT NULL,
        id_usuario     INT           NOT NULL,
        username       NVARCHAR(150) NULL,        -- cache del nombre a la hora de leer
        fecha_lectura  DATETIME      NOT NULL CONSTRAINT DF_CGML_fecha DEFAULT (GETDATE()),
        CONSTRAINT PK_CHAT_GRUPO_MENSAJE_LECTURAS PRIMARY KEY CLUSTERED (id_mensaje, id_usuario),
        CONSTRAINT FK_CGML_mensaje FOREIGN KEY (id_mensaje) REFERENCES dbo.CHAT_GRUPO_MENSAJES (id_mensaje)
    );
    CREATE NONCLUSTERED INDEX IX_CGML_mensaje ON dbo.CHAT_GRUPO_MENSAJE_LECTURAS (id_mensaje);
    PRINT 'Tabla CHAT_GRUPO_MENSAJE_LECTURAS creada.';
END
ELSE
    PRINT 'CHAT_GRUPO_MENSAJE_LECTURAS ya existe — nada que hacer.';
GO

-- ───────────────── 2) CHAT_GRUPO_VISITA_LECTURAS ─────────────────
--  Comparte tabla con epran_backend (el backend móvil) — es la misma
--  fila la que consulta AppWeb v1 y la APK del mercaderista, igual que ya
--  pasa con CHAT_MENSAJES_GRUPO_VISITA. id_lectura (IDENTITY) existe para
--  que el watcher de epran_backend pueda hacer polling por "lecturas
--  nuevas desde el último id visto", igual que ya hace con mensajes.
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'CHAT_GRUPO_VISITA_LECTURAS')
BEGIN
    CREATE TABLE dbo.CHAT_GRUPO_VISITA_LECTURAS (
        id_lectura     INT IDENTITY(1,1) NOT NULL,
        id_mensaje     INT           NOT NULL,
        id_usuario     INT           NOT NULL,
        username       NVARCHAR(150) NULL,
        fecha_lectura  DATETIME      NOT NULL CONSTRAINT DF_CGVL_fecha DEFAULT (GETDATE()),
        CONSTRAINT PK_CHAT_GRUPO_VISITA_LECTURAS PRIMARY KEY CLUSTERED (id_lectura),
        CONSTRAINT UQ_CGVL_mensaje_usuario UNIQUE (id_mensaje, id_usuario),
        CONSTRAINT FK_CGVL_mensaje FOREIGN KEY (id_mensaje) REFERENCES dbo.CHAT_MENSAJES_GRUPO_VISITA (id_mensaje)
    );
    CREATE NONCLUSTERED INDEX IX_CGVL_mensaje ON dbo.CHAT_GRUPO_VISITA_LECTURAS (id_mensaje);
    PRINT 'Tabla CHAT_GRUPO_VISITA_LECTURAS creada.';
END
ELSE
    PRINT 'CHAT_GRUPO_VISITA_LECTURAS ya existe — nada que hacer.';
GO
