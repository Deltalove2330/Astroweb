-- ════════════════════════════════════════════════════════════════════
--  ops/optimizar_login.sql
--  Índice para acelerar la query del login de mercaderistas.
--
--  Problema: MERCADERISTAS.cedula es INT y NO tiene índice → la condición
--  `WHERE m.cedula = ?` hace un table scan en cada login. Con el doble CAST
--  del JOIN (ya corregido en código) la query tardaba ~312ms; bajo
--  concurrencia eso se multiplica.
--
--  Este índice cubre la búsqueda por cédula e incluye las columnas que el
--  login lee, de modo que el SEEK no necesita ir a la tabla base.
--  Tabla pequeña (~707 filas) → creación instantánea y de bajo riesgo.
--
--  Correr UNA vez en la base `epran`. Junto con la reescritura de la query
--  (u.username = CONVERT(nvarchar(50), m.cedula)) lleva la query a ~1-5ms.
-- ════════════════════════════════════════════════════════════════════

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name = 'IX_MERCADERISTAS_cedula'
      AND object_id = OBJECT_ID('dbo.MERCADERISTAS')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_MERCADERISTAS_cedula
        ON dbo.MERCADERISTAS (cedula)
        INCLUDE (nombre, tipo, activo);
    PRINT 'Índice IX_MERCADERISTAS_cedula creado.';
END
ELSE
    PRINT 'IX_MERCADERISTAS_cedula ya existe — nada que hacer.';
