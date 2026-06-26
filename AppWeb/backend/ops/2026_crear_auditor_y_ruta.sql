/* ============================================================================
   Crear un AUDITOR (MERCADERISTAS + USUARIOS) + una RUTA DE AUDITORÍA asignada
   ----------------------------------------------------------------------------
   Objetivo: dejar un auditor que pueda loguearse y VER su ruta en
   "Mis Rutas Asignadas" (página /auditor/carga-data).

   CLAVE (causa de que la lista salga vacía):
   El endpoint /auditor/api/auditor-fixed-routes/<cedula>
   (auditor_routes.py:get_auditor_fixed_routes) filtra:
        WHERE m.cedula = ? AND rn.servicio = 'Auditor'
   => La ruta SOLO aparece si RUTAS_NUEVAS.servicio = 'Auditor' (string exacto,
      sin tilde). Las rutas Tradex/Exclusivo NO aparecen aqui. El stat
      "Rutas Asignadas" cuenta MERCADERISTAS_RUTAS sin filtrar por servicio,
      por eso puede decir 2 aunque la lista este vacia.
   El auditor se resuelve por CEDULA (USUARIOS.username = cedula = MERCADERISTAS.cedula).

   Notas:
   - id_mercaderista / id_usuario / id_ruta / id_mercaderista_ruta son IDENTITY.
   - Contraseña del nuevo usuario: **Auditor2026***  (hash bcrypt ya calculado).

   👉 EDITA los DECLARE (cédula, nombre, email) antes de ejecutar.
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

    /* 1) MERCADERISTAS (auditor) — tipo='Auditor' es lo que valida la pagina */
    INSERT INTO MERCADERISTAS (nombre, cedula, telefono, tipo, activo, email)
    VALUES (@nombre, @cedula, NULL, 'Auditor', 1, @email);
    DECLARE @id_merc INT = SCOPE_IDENTITY();

    /* 2) USUARIOS (login = cédula). Mismos campos que un auditor existente que funciona */
    INSERT INTO USUARIOS (username, password_hash, rol, email, id_rol, id_perfil, activo, id_mercaderista)
    VALUES (@cedula, @password_hash, 'Auditor', @email, 7, @id_merc, 1, @id_merc);

    /* 3) RUTAS_NUEVAS — servicio='Auditor' es OBLIGATORIO para que aparezca en la lista */
    INSERT INTO RUTAS_NUEVAS (servicio, ruta, cuadrante, fecha_creacion, creado_por, tipo_ruta)
    VALUES ('Auditor', @ruta_nombre, @cuadrante, GETDATE(), 'script', 'fija');
    DECLARE @id_ruta INT = SCOPE_IDENTITY();

    /* 4) Asignar la ruta al auditor */
    INSERT INTO MERCADERISTAS_RUTAS (id_mercaderista, id_ruta, tipo_ruta)
    VALUES (@id_merc, @id_ruta, 'Variable');

    /* ----- OPCIONAL: darle PUNTOS a la ruta para que se puedan auditar -----
       La ruta YA aparece en la lista con lo de arriba (total_puntos = 0).
       Para que tenga PDVs (get_auditor_route_points usa RUTA_PROGRAMACION
       activa=1 con PDV + cliente), copia la programación de una ruta existente.
       Descomenta y ajusta @ruta_origen. Copia solo las columnas que existan en tu
       RUTA_PROGRAMACION (ajusta la lista si hace falta). */
    -- DECLARE @ruta_origen INT = 1424;
    -- INSERT INTO RUTA_PROGRAMACION (id_ruta, id_punto_interes, id_cliente, dia, activa, prioridad)
    -- SELECT @id_ruta, id_punto_interes, id_cliente, dia, 1, prioridad
    -- FROM   RUTA_PROGRAMACION
    -- WHERE  id_ruta = @ruta_origen AND activa = 1;

    /* Verificación */
    SELECT @id_merc AS id_mercaderista_nuevo, @id_ruta AS id_ruta_nueva, @cedula AS login_username;
    SELECT * FROM MERCADERISTAS       WHERE id_mercaderista = @id_merc;
    SELECT * FROM USUARIOS            WHERE id_mercaderista = @id_merc;
    SELECT * FROM RUTAS_NUEVAS        WHERE id_ruta = @id_ruta;
    SELECT * FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = @id_merc;

COMMIT;
GO
