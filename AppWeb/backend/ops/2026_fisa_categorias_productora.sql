/* ============================================================================
   2026 - Carga de visita: corrección categorías + filtro por productora
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
   aplicó vía script Python. Este archivo documenta el CAMBIO DE ESQUEMA y el
   vínculo cliente->productora, que es lo que el código nuevo necesita.
   ============================================================================ */

USE [epran];
GO

/* --- Vínculo cliente -> productora (para traer SOLO los productos de la
       productora del cliente en la carga de visita) --- */
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'CLIENTES' AND COLUMN_NAME = 'id_productora'
)
    ALTER TABLE CLIENTES ADD id_productora INT NULL;
GO

-- Clientes mercaderista configurados (ajustar/añadir según se vayan habilitando):
UPDATE CLIENTES SET id_productora = 348 WHERE id_cliente = 43;  -- Laboratorios Fisa -> LABORATORIOS FISA, C.A.
UPDATE CLIENTES SET id_productora = 87  WHERE id_cliente = 62;  -- Cafare -> CAFARE
GO

/* La carga de visita (get_client_products) ahora filtra:
     productos en CATEGORIAS_CLIENTES del cliente
     AND (si CLIENTES.id_productora no es NULL) p.id_productora = ese valor.
   Si id_productora es NULL, cae a filtro solo por categoría. */
