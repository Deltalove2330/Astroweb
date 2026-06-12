-- ════════════════════════════════════════════════════════════════════
--  ops/2026_normalizar_categorias.sql
--  Normaliza el modelo de categorías para habilitar el flujo:
--    crear visita (elige cliente) → CATEGORIAS_CLIENTES (categorías del cliente)
--    → CATEGORIAS → PRODUCTS (por id_categoria).
--
--  Estado previo (verificado en BD 2026-06-12):
--    · CATEGORIAS solo tenía 1 fila (3='Viveres'). id_categoria es IDENTITY.
--    · PRODUCTS.Categoria (texto) tiene 18 categorías distintas (colación CI,
--      sin duplicados por mayúsculas), pero PRODUCTS.id_categoria valía 11
--      (inexistente en CATEGORIAS) o NULL → referencia colgada.
--    · Cafare: 9 productos con Categoria vacía e id_fabricante NULL. Hay DOS
--      clientes 'Cafare' (61 y 62); el ACTIVO es 62 (20 rutas; 61 sin rutas).
--    · El vínculo producto↔cliente es PRODUCTS.id_fabricante = CLIENTES.id_cliente
--      (hoy solo 43=Fisa y 54=Tequeños Las Tías tienen productos).
--
--  Es IDEMPOTENTE (re-ejecutable) y TRANSACCIONAL. Revísalo antes de correr.
--  Correr UNA vez en la base `epran`.
-- ════════════════════════════════════════════════════════════════════

SET XACT_ABORT ON;
BEGIN TRANSACTION;

-- 0) CAFARE: asignar categoría 'Café' a sus productos y vincularlos al cliente
--    Cafare ACTIVO (id 62). Antes estaban con categoría vacía y sin id_fabricante.
UPDATE PRODUCTS
   SET Categoria     = N'Café',
       id_fabricante = 62
 WHERE Fabricante = N'Cafare';

-- 1) Poblar CATEGORIAS con las categorías DISTINCT de PRODUCTS que aún no existan
--    (id_categoria IDENTITY autoincrementa). 'Viveres' ya existe; el resto se crean.
INSERT INTO CATEGORIAS (categoria)
SELECT DISTINCT LTRIM(RTRIM(p.Categoria))
  FROM PRODUCTS p
 WHERE p.Categoria IS NOT NULL
   AND LTRIM(RTRIM(p.Categoria)) <> N''
   AND NOT EXISTS (SELECT 1 FROM CATEGORIAS c
                   WHERE c.categoria = LTRIM(RTRIM(p.Categoria)));

-- 2) Remapear PRODUCTS.id_categoria a la fila correcta de CATEGORIAS (match por nombre)
UPDATE p
   SET p.id_categoria = c.id_categoria
  FROM PRODUCTS p
  JOIN CATEGORIAS c ON c.categoria = LTRIM(RTRIM(p.Categoria))
 WHERE p.Categoria IS NOT NULL
   AND LTRIM(RTRIM(p.Categoria)) <> N'';

-- 3) CATEGORIAS_CLIENTES: para cada cliente, sus categorías (derivadas de sus
--    productos: PRODUCTS.id_fabricante = CLIENTES.id_cliente). Tras el paso 0,
--    Cafare (62) queda incluido con la categoría 'Café'.
INSERT INTO CATEGORIAS_CLIENTES (id_categoria, id_cliente)
SELECT DISTINCT p.id_categoria, p.id_fabricante
  FROM PRODUCTS p
 WHERE p.id_fabricante IS NOT NULL
   AND p.id_categoria  IS NOT NULL
   AND NOT EXISTS (SELECT 1 FROM CATEGORIAS_CLIENTES cc
                   WHERE cc.id_categoria = p.id_categoria
                     AND cc.id_cliente   = p.id_fabricante);

-- Verificación
DECLARE @cats INT       = (SELECT COUNT(*) FROM CATEGORIAS);
DECLARE @sinmap INT     = (SELECT COUNT(*) FROM PRODUCTS WHERE Categoria IS NOT NULL
                            AND LTRIM(RTRIM(Categoria)) <> N'' AND id_categoria IS NULL);
DECLARE @catcli INT     = (SELECT COUNT(*) FROM CATEGORIAS_CLIENTES);
PRINT 'CATEGORIAS total: ' + CAST(@cats AS VARCHAR(10));
PRINT 'PRODUCTS con categoria pero SIN id_categoria (debe ser 0): ' + CAST(@sinmap AS VARCHAR(10));
PRINT 'CATEGORIAS_CLIENTES total: ' + CAST(@catcli AS VARCHAR(10));

COMMIT TRANSACTION;
