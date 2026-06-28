/* ============================================================================
   CLIENTES_RUTAS — visibilidad segmentada de rutas por USUARIO cliente
   ----------------------------------------------------------------------------
   Permite que un usuario con rol Cliente (ROLES: id_rol=1) vea SOLO las rutas
   que se le asignen aquí. Útil cuando un cliente (p.ej. Coca Cola) tiene
   personal por estados/regiones: cada usuario cliente ve solo sus rutas.

   Relación: id_usuario (USUARIOS) ↔ id_ruta (RUTAS_NUEVAS).
   El id_cliente para filtrar la programación se DERIVA de USUARIOS.id_perfil
   (cuando el rol es Cliente, id_perfil = CLIENTES.id_cliente). No se guarda aquí.

   Motor: SQL Server. Cambia el USE para apuntar a epran (prod) o epran-qa.
   Idempotente.
   ============================================================================ */

USE [epran-qa];   -- <-- para PROD: cambiar a  USE [epran];
GO

IF OBJECT_ID('dbo.CLIENTES_RUTAS', 'U') IS NULL
BEGIN
    CREATE TABLE dbo.CLIENTES_RUTAS (
        id_cliente_ruta INT IDENTITY(1,1) NOT NULL
            CONSTRAINT PK_CLIENTES_RUTAS PRIMARY KEY,
        id_usuario      INT NOT NULL,           -- USUARIOS.id_usuario (rol Cliente)
        id_ruta         INT NOT NULL,           -- RUTAS_NUEVAS.id_ruta
        activo          BIT NOT NULL
            CONSTRAINT DF_CLIENTES_RUTAS_activo DEFAULT 1,
        fecha_creacion  DATETIME NOT NULL
            CONSTRAINT DF_CLIENTES_RUTAS_fecha DEFAULT GETDATE(),
        CONSTRAINT UQ_CLIENTES_RUTAS UNIQUE (id_usuario, id_ruta)
    );

    ALTER TABLE dbo.CLIENTES_RUTAS WITH CHECK
        ADD CONSTRAINT FK_CLIENTES_RUTAS_usuario
        FOREIGN KEY (id_usuario) REFERENCES dbo.USUARIOS(id_usuario);

    ALTER TABLE dbo.CLIENTES_RUTAS WITH CHECK
        ADD CONSTRAINT FK_CLIENTES_RUTAS_ruta
        FOREIGN KEY (id_ruta) REFERENCES dbo.RUTAS_NUEVAS(id_ruta);

    PRINT 'CLIENTES_RUTAS creada.';
END
ELSE
    PRINT 'CLIENTES_RUTAS ya existe.';
GO

/* ----------------------------------------------------------------------------
   Cómo asignar rutas a un usuario cliente (ejemplo):
       INSERT INTO CLIENTES_RUTAS (id_usuario, id_ruta) VALUES (<id_usuario>, <id_ruta>);

   Consulta de VISIBILIDAD SEGMENTADA (lo que vería ese usuario cliente):
   solo sus rutas asignadas, y dentro de ellas, solo la programación de SU cliente
   (id_cliente = USUARIOS.id_perfil del usuario logueado).

       SELECT rp.*
       FROM   RUTA_PROGRAMACION rp
       JOIN   CLIENTES_RUTAS cr ON cr.id_ruta = rp.id_ruta
       JOIN   USUARIOS u        ON u.id_usuario = cr.id_usuario
       WHERE  cr.id_usuario = :id_usuario_logueado
         AND  cr.activo = 1
         AND  rp.activa = 1
         AND  rp.id_cliente = u.id_perfil;   -- id_perfil = id_cliente del usuario cliente
---------------------------------------------------------------------------- */
