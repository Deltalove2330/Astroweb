/* ============================================================================
   Limpieza de valores basura en PUNTOS_INTERES1
   ----------------------------------------------------------------------------
   Objetivo:
     - Quitar ciertos valores de "Clasificación de canal" (clasificacion_de_canal)
       y de "Nivel de Alcance" (nivel_de_alcance) que están mal cargados.
     - Los PDV que los tengan NO se borran: solo se les pone el campo en NULL.
     - Si existen las tablas-catálogo de la app v2 (CAT_CANAL_VENTA / CAT_ALCANCE),
       se eliminan también esas filas para que desaparezcan de los dropdowns.

   Motor: SQL Server (T-SQL). Ejecutar en SSMS / Azure Data Studio.

   Reversibilidad: los UPDATE ponen el valor anterior en NULL; NO hay backup
   automático del valor previo. Si quieres poder revertir, ejecuta primero la
   SECCIÓN 0 (backup) y guarda esa tabla.

   Uso recomendado:
     1) Ejecuta SECCIÓN 1 (PREVIEW) y revisa los conteos.
     2) (Opcional) Ejecuta SECCIÓN 0 para respaldar.
     3) Ejecuta SECCIÓN 2 (APLICAR). Revisa la verificación final (debe dar 0).
   ============================================================================ */


/* ----------------------------------------------------------------------------
   SECCIÓN 0 (OPCIONAL) — Backup de los PDV afectados antes de tocar nada.
   Guarda identificador + valores actuales para poder revertir manualmente.
---------------------------------------------------------------------------- */
-- SELECT identificador, clasificacion_de_canal, nivel_de_alcance
-- INTO   PUNTOS_INTERES1_backup_canal_alcance_20260623
-- FROM   PUNTOS_INTERES1
-- WHERE  LTRIM(RTRIM(clasificacion_de_canal)) IN
--           ('Cadena de automercados','Centro Comercial','Cooperativa','Farmacia',
--            'Oficina','Restaurante','Supermercado','Tienda')
--    OR  LTRIM(RTRIM(nivel_de_alcance)) IN ('1','2','213388');
-- GO


/* ----------------------------------------------------------------------------
   SECCIÓN 1 — PREVIEW (solo lectura). Revisa cuántos PDV se afectan.
---------------------------------------------------------------------------- */
PRINT '== PDV por valor de Clasificación de canal a limpiar ==';
SELECT  LTRIM(RTRIM(clasificacion_de_canal)) AS valor,
        COUNT(*)                              AS pdv_afectados
FROM    PUNTOS_INTERES1
WHERE   LTRIM(RTRIM(clasificacion_de_canal)) IN
          ('Cadena de automercados','Centro Comercial','Cooperativa','Farmacia',
           'Oficina','Restaurante','Supermercado','Tienda')
GROUP BY LTRIM(RTRIM(clasificacion_de_canal))
ORDER BY valor;

PRINT '== PDV por valor de Nivel de Alcance a limpiar ==';
SELECT  LTRIM(RTRIM(nivel_de_alcance)) AS valor,
        COUNT(*)                        AS pdv_afectados
FROM    PUNTOS_INTERES1
WHERE   LTRIM(RTRIM(nivel_de_alcance)) IN ('1','2','213388')
GROUP BY LTRIM(RTRIM(nivel_de_alcance))
ORDER BY valor;
GO


/* ----------------------------------------------------------------------------
   SECCIÓN 2 — APLICAR (transacción). Pone en NULL los PDV y borra las filas
   de catálogo v2 si existen. Hace COMMIT al final.
---------------------------------------------------------------------------- */
SET XACT_ABORT ON;
BEGIN TRAN;

    /* 2.1  Clasificación de canal -> NULL en los PDV (no se borra el PDV) */
    UPDATE PUNTOS_INTERES1
    SET    clasificacion_de_canal = NULL
    WHERE  LTRIM(RTRIM(clasificacion_de_canal)) IN
             ('Cadena de automercados','Centro Comercial','Cooperativa','Farmacia',
              'Oficina','Restaurante','Supermercado','Tienda');
    PRINT CONCAT('PDV con clasificacion_de_canal puesta en NULL: ', @@ROWCOUNT);

    /* 2.2  Nivel de Alcance -> NULL en los PDV (no se borra el PDV) */
    UPDATE PUNTOS_INTERES1
    SET    nivel_de_alcance = NULL
    WHERE  LTRIM(RTRIM(nivel_de_alcance)) IN ('1','2','213388');
    PRINT CONCAT('PDV con nivel_de_alcance puesto en NULL: ', @@ROWCOUNT);

    /* 2.3  Borrar filas de catálogo v2 (solo si esas tablas existen) */
    IF OBJECT_ID('dbo.CAT_CANAL_VENTA', 'U') IS NOT NULL
    BEGIN
        DELETE FROM CAT_CANAL_VENTA
        WHERE LTRIM(RTRIM(nombre)) IN
              ('Cadena de automercados','Centro Comercial','Cooperativa','Farmacia',
               'Oficina','Restaurante','Supermercado','Tienda');
        PRINT CONCAT('Filas borradas de CAT_CANAL_VENTA: ', @@ROWCOUNT);
    END

    IF OBJECT_ID('dbo.CAT_ALCANCE', 'U') IS NOT NULL
    BEGIN
        DELETE FROM CAT_ALCANCE
        WHERE LTRIM(RTRIM(nombre)) IN ('1','2','213388');
        PRINT CONCAT('Filas borradas de CAT_ALCANCE: ', @@ROWCOUNT);
    END

COMMIT;
GO


/* ----------------------------------------------------------------------------
   SECCIÓN 3 — VERIFICACIÓN. Ambos conteos deben dar 0.
---------------------------------------------------------------------------- */
SELECT COUNT(*) AS canal_restantes
FROM   PUNTOS_INTERES1
WHERE  LTRIM(RTRIM(clasificacion_de_canal)) IN
         ('Cadena de automercados','Centro Comercial','Cooperativa','Farmacia',
          'Oficina','Restaurante','Supermercado','Tienda');

SELECT COUNT(*) AS alcance_restantes
FROM   PUNTOS_INTERES1
WHERE  LTRIM(RTRIM(nivel_de_alcance)) IN ('1','2','213388');
GO
