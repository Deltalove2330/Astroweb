/* ============================================================================
   Crear un AUDITOR (MERCADERISTAS + USUARIOS) + una RUTA DE AUDITORÍA asignada
   ----------------------------------------------------------------------------
   Objetivo: dejar un auditor que pueda loguearse y ver su ruta asignada.

   Notas:
   - id_mercaderista / id_usuario / id_ruta / id_mercaderista_ruta son IDENTITY
     (no se especifican; se capturan con SCOPE_IDENTITY()).
   - USUARIOS.username = cédula (así lo resuelve el login del auditor, que busca
     el MERCADERISTAS por cédula).
   - Se setean USUARIOS.id_mercaderista e id_perfil al id del mercaderista nuevo
     (a diferencia de la fila 165 de Diaz Cesar, que los tiene en 1; esa es la
     causa probable de que su lista "Mis Rutas Asignadas" salga vacía).
   - Contraseña del nuevo usuario: **Auditor2026***  (hash bcrypt ya calculado).
     Cámbiala luego si quieres (re-hashea con bcrypt $2b$, cost 10).

   👉 EDITA los DECLARE de abajo (cédula, nombre, email) antes de ejecutar.
   Motor: SQL Server (T-SQL).
   ============================================================================ */

USE [epran];
GO

SET XACT_ABORT ON;
BEGIN TRAN;

    /* ----- PARÁMETROS A EDITAR ----- */
    DECLARE @cedula        VARCHAR(20)  = '00000000';                 -- <-- cédula real del auditor
    DECLARE @nombre        VARCHAR(200) = 'Auditor Prueba';           -- <-- nombre real
    DECLARE @email         VARCHAR(200) = 'auditor.prueba@email.com'; -- opcional
    DECLARE @ruta_nombre   VARCHAR(200) = 'Ruta AUD-1';               -- nombre de la ruta de auditoría
    DECLARE @cuadrante     VARCHAR(200) = 'CARACAS';
    -- Hash bcrypt de la contraseña 'Auditor2026*' (cost 10):
    DECLARE @password_hash VARCHAR(255) = '$2b$10$zJtUrUxv/bH7g5MFeN1JL.lMiLW8YlQ2QNe.Cc0THcacxEUOK5gtS';

    /* Evitar duplicar la cédula */
    IF EXISTS (SELECT 1 FROM MERCADERISTAS WHERE cedula = @cedula)
        OR EXISTS (SELECT 1 FROM USUARIOS WHERE username = @cedula)
    BEGIN
        ROLLBACK;
        RAISERROR('Ya existe un mercaderista o usuario con esa cédula. Cambia @cedula.', 16, 1);
        RETURN;
    END

    /* 1) MERCADERISTAS (auditor) */
    INSERT INTO MERCADERISTAS (nombre, cedula, telefono, tipo, activo, email)
    VALUES (@nombre, @cedula, NULL, 'Auditor', 1, @email);
    DECLARE @id_merc INT = SCOPE_IDENTITY();

    /* 2) USUARIOS (login = cédula). id_mercaderista e id_perfil = mercaderista nuevo */
    INSERT INTO USUARIOS (username, password_hash, rol, email, id_rol, id_perfil, activo, id_mercaderista)
    VALUES (@cedula, @password_hash, 'Auditor', @email, 7, @id_merc, 1, @id_merc);

    /* 3) RUTAS_NUEVAS (ruta de auditoría) */
    INSERT INTO RUTAS_NUEVAS (servicio, ruta, cuadrante, fecha_creacion, creado_por, tipo_ruta)
    VALUES ('Auditoría', @ruta_nombre, @cuadrante, GETDATE(), 'script', 'fija');
    DECLARE @id_ruta INT = SCOPE_IDENTITY();

    /* 4) Asignar la ruta al auditor */
    INSERT INTO MERCADERISTAS_RUTAS (id_mercaderista, id_ruta, tipo_ruta)
    VALUES (@id_merc, @id_ruta, 'Variable');

    /* Verificación */
    SELECT @id_merc AS id_mercaderista_nuevo, @id_ruta AS id_ruta_nueva, @cedula AS login_username;
    SELECT * FROM MERCADERISTAS      WHERE id_mercaderista = @id_merc;
    SELECT * FROM USUARIOS           WHERE id_mercaderista = @id_merc;
    SELECT * FROM RUTAS_NUEVAS       WHERE id_ruta = @id_ruta;
    SELECT * FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = @id_merc;

COMMIT;
GO


/* ----------------------------------------------------------------------------
   OPCIONAL — Arreglar la visibilidad de Diaz Cesar (usuario 165 -> mercaderista 170)
   Si la lista usa USUARIOS.id_mercaderista, esto haría que SUS rutas aparezcan.
   Descomenta para aplicarlo.
---------------------------------------------------------------------------- */
-- UPDATE USUARIOS SET id_mercaderista = 170, id_perfil = 170 WHERE id_usuario = 165;
-- GO
