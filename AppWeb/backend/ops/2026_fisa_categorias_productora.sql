/* ============================================================================
   2026 - Carga de visita: corrección de la tabla CATEGORIAS
   BD: epran (producción)
   ----------------------------------------------------------------------------
   Contexto:
   - La tabla CATEGORIAS quedó descuadrada (sus id_categoria/nombre no coincidían
     con los que usan PRODUCTS.id_categoria). Ej.: id 36 decía "DOLOR MUSCULAR Y
     ARTICULAR" pero sus productos son CAFÉ; id 77 decía "MODIFICADORES DE LECHE"
     pero sus productos son CAPILAR (Laboratorios Fisa).
   - Se validó contra la hoja MATRIZ de fisa.xlsx (producto -> categoría correcta,
     100% de pureza por id_categoria) y se refrescó CATEGORIAS:
       * 73 renombres (ids 23..95) + 21 inserts (ids 96..116)
       * nombre, nombre_bi e id_departamento corregidos.
   - Respaldo previo: tabla CATEGORIAS_bak_20260628 (SELECT * INTO antes del cambio).
   - PRODUCTS y CATEGORIAS_CLIENTES NO se tocaron (ya eran consistentes).

   Nota: el refresh de CATEGORIAS fue data-driven (desde el Excel MATRIZ) y se
   aplicó vía script Python; este archivo solo documenta el cambio.

   Flujo de la carga de visita (get_client_products):
     cliente -> CATEGORIAS_CLIENTES (sus categorías) -> TODOS los productos de
     esas categorías (PRODUCTS.id_categoria), sin filtrar por productora.
   ============================================================================ */

USE [epran];
GO

-- (No hay cambios de esquema. Para revertir el refresh de nombres de categoría:
--   UPDATE c SET c.nombre=b.nombre, c.nombre_bi=b.nombre_bi, c.id_departamento=b.id_departamento
--   FROM CATEGORIAS c JOIN CATEGORIAS_bak_20260628 b ON b.id_categoria=c.id_categoria;
--   DELETE FROM CATEGORIAS WHERE id_categoria NOT IN (SELECT id_categoria FROM CATEGORIAS_bak_20260628);
-- )
