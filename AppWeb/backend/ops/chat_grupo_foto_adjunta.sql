-- ════════════════════════════════════════════════════════════════════
--  ops/chat_grupo_foto_adjunta.sql
--  Agrega foto_adjunta a los mensajes de grupo (chat general y sub-hilo
--  por visita), para que cuando se rechaza una foto el mensaje de sistema
--  que se postea al chat también muestre la foto rechazada, no solo texto.
--
--  Mismo patrón que CHAT_MENSAJES.foto_adjunta (chat 1-a-1, ya existente
--  y en uso — ver app/static/js/chat.js). Guarda el file_path limpio
--  (sin "X:/"), igual que el resto del código.
--
--  Idempotente: re-ejecutable sin error. Correr UNA vez en la base `epran`.
-- ════════════════════════════════════════════════════════════════════

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.CHAT_GRUPO_MENSAJES') AND name = 'foto_adjunta'
)
BEGIN
    ALTER TABLE dbo.CHAT_GRUPO_MENSAJES ADD foto_adjunta NVARCHAR(500) NULL;
    PRINT 'Columna foto_adjunta agregada a CHAT_GRUPO_MENSAJES.';
END
ELSE
    PRINT 'CHAT_GRUPO_MENSAJES.foto_adjunta ya existe — nada que hacer.';
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.columns
    WHERE object_id = OBJECT_ID('dbo.CHAT_MENSAJES_GRUPO_VISITA') AND name = 'foto_adjunta'
)
BEGIN
    ALTER TABLE dbo.CHAT_MENSAJES_GRUPO_VISITA ADD foto_adjunta NVARCHAR(500) NULL;
    PRINT 'Columna foto_adjunta agregada a CHAT_MENSAJES_GRUPO_VISITA.';
END
ELSE
    PRINT 'CHAT_MENSAJES_GRUPO_VISITA.foto_adjunta ya existe — nada que hacer.';
GO
