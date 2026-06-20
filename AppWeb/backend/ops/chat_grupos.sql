-- ════════════════════════════════════════════════════════════════════
--  ops/chat_grupos.sql
--  Esquema para los GRUPOS DE CHAT por cliente (estilo WhatsApp privado).
--
--  Concepto nuevo: a diferencia de CHAT_MENSAJES / CHAT_MENSAJES_CLIENTE
--  (que giran en torno a una VISITA), estos son grupos PERSISTENTES por
--  cliente para el equipo operativo.
--
--  Membresía DINÁMICA: NO se guarda lista de miembros. Se calcula en
--  tiempo de consulta desde RUTA_PROGRAMACION / ANALISTAS_CLIENTE /
--  SUPERVISORES_CLIENTE / USUARIOS (ver app/utils/chat_grupos_membresia).
--  Aquí solo persistimos: el grupo, los mensajes y el estado de lectura.
--
--  Dos grupos por cliente:
--    • 'operativo'          → personal epran (merc + analista + supervisor
--                              + coordinadores del tipo del cliente)
--    • 'operativo_cliente'  → lo anterior + usuarios rol 'client' del cliente
--
--  Idempotente: re-ejecutable sin error. Correr UNA vez en la base `epran`.
-- ════════════════════════════════════════════════════════════════════

-- ───────────────────── 1) CHAT_GRUPOS ─────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'CHAT_GRUPOS')
BEGIN
    CREATE TABLE dbo.CHAT_GRUPOS (
        id_grupo        INT IDENTITY(1,1) NOT NULL,
        id_cliente      INT            NOT NULL,
        tipo_grupo      VARCHAR(20)    NOT NULL,   -- 'operativo' | 'operativo_cliente'
        nombre          NVARCHAR(150)  NULL,
        activa          BIT            NOT NULL CONSTRAINT DF_CHAT_GRUPOS_activa DEFAULT (1),
        fecha_creacion  DATETIME       NOT NULL CONSTRAINT DF_CHAT_GRUPOS_fecha  DEFAULT (GETDATE()),
        CONSTRAINT PK_CHAT_GRUPOS PRIMARY KEY CLUSTERED (id_grupo),
        CONSTRAINT UQ_CHAT_GRUPOS_cliente_tipo UNIQUE (id_cliente, tipo_grupo)
    );
    PRINT 'Tabla CHAT_GRUPOS creada.';
END
ELSE
    PRINT 'CHAT_GRUPOS ya existe — nada que hacer.';
GO

-- ───────────────────── 2) CHAT_GRUPO_MENSAJES ─────────────────────
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'CHAT_GRUPO_MENSAJES')
BEGIN
    CREATE TABLE dbo.CHAT_GRUPO_MENSAJES (
        id_mensaje    INT IDENTITY(1,1) NOT NULL,
        id_grupo      INT            NOT NULL,
        id_usuario    INT            NULL,        -- autor (NULL para 'sistema')
        username      NVARCHAR(150)  NULL,        -- nombre mostrado (cache)
        mensaje       NVARCHAR(MAX)  NOT NULL,
        tipo_mensaje  VARCHAR(20)    NOT NULL CONSTRAINT DF_CGM_tipo  DEFAULT ('usuario'),  -- 'usuario' | 'sistema'
        fecha_envio   DATETIME       NOT NULL CONSTRAINT DF_CGM_fecha DEFAULT (GETDATE()),
        CONSTRAINT PK_CHAT_GRUPO_MENSAJES PRIMARY KEY CLUSTERED (id_mensaje),
        CONSTRAINT FK_CGM_grupo FOREIGN KEY (id_grupo) REFERENCES dbo.CHAT_GRUPOS (id_grupo)
    );
    -- Historial por grupo en orden cronológico
    CREATE NONCLUSTERED INDEX IX_CGM_grupo_fecha
        ON dbo.CHAT_GRUPO_MENSAJES (id_grupo, fecha_envio)
        INCLUDE (id_usuario, username, mensaje, tipo_mensaje);
    PRINT 'Tabla CHAT_GRUPO_MENSAJES creada.';
END
ELSE
    PRINT 'CHAT_GRUPO_MENSAJES ya existe — nada que hacer.';
GO

-- ───────────────────── 3) CHAT_GRUPO_LECTURAS ─────────────────────
--  Estado de lectura por (grupo, usuario) para el badge de no-leídos.
--  last_read_id_mensaje = el id_mensaje más alto que el usuario ya vio.
IF NOT EXISTS (SELECT 1 FROM sys.tables WHERE name = 'CHAT_GRUPO_LECTURAS')
BEGIN
    CREATE TABLE dbo.CHAT_GRUPO_LECTURAS (
        id_grupo              INT      NOT NULL,
        id_usuario            INT      NOT NULL,
        last_read_id_mensaje  INT      NOT NULL CONSTRAINT DF_CGL_lastread DEFAULT (0),
        fecha_actualizacion   DATETIME NOT NULL CONSTRAINT DF_CGL_fecha    DEFAULT (GETDATE()),
        CONSTRAINT PK_CHAT_GRUPO_LECTURAS PRIMARY KEY CLUSTERED (id_grupo, id_usuario),
        CONSTRAINT FK_CGL_grupo FOREIGN KEY (id_grupo) REFERENCES dbo.CHAT_GRUPOS (id_grupo)
    );
    PRINT 'Tabla CHAT_GRUPO_LECTURAS creada.';
END
ELSE
    PRINT 'CHAT_GRUPO_LECTURAS ya existe — nada que hacer.';
GO
