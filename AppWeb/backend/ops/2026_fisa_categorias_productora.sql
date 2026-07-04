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

/* --- Limpieza de duplicados (aplicada después del refresh) ---
   El refresh dejó los ids viejos 1..22 como categorías HUÉRFANAS (sin productos)
   que duplicaban el nombre de las correctas (p.ej. CAFÉ id14 vs id36). Se limpió:
     1) Re-apuntar las 49 SUBCATEGORIAS que colgaban de cats 1..22 a la categoría
        real de sus productos (UPDATE SUBCATEGORIAS.id_categoria = id_cat dominante
        en PRODUCTS por id_subcategoria).
     2) CLIENTES.id_categoria (vestigial, era 1; NOT NULL) -> 23 (categoría válida).
     3) DELETE FROM CATEGORIAS WHERE id_categoria BETWEEN 1 AND 22.
   Resultado: 94 categorías, 0 nombres duplicados, 0 huérfanas.
   Respaldos: CATEGORIAS_bak_20260628, SUBCATEGORIAS_bak_20260628, CLIENTES_bak_20260628.
*/

-- (Reversión: restaurar las 3 tablas desde sus _bak_20260628 respectivos.)
