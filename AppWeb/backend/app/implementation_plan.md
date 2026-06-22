# Migración a Nuevo Modelo de Productos y Backup

Se propone migrar el esquema actual de productos a un modelo de "copo de nieve" (snowflake schema) para integrar correctamente los nuevos datos subidos en la tabla `Sheet1$`. Además, se realizarán los respaldos solicitados.

## User Review Required

> [!IMPORTANT]
> **Aprobación de la estructura del esquema:**
> Revisa la lista de tablas propuestas en la sección de "Cambios Propuestos". Si el modelo de copo de nieve con estas entidades es correcto, por favor indícalo para proceder a crear los scripts SQL.
>
> **Lógica en el código Backend:**
> Modificar la estructura de la tabla `PRODUCTS` (eliminando columnas como `Fabricante` y `Tipo_de_servicio` y agregando nuevas llaves foráneas) requerirá **necesariamente** actualizar las consultas SQL en tu backend (`atencion_cliente.py`, `merchandisers.py`, `auditor_routes.py`, etc.). Una vez aplicados los cambios en la BD, también deberemos actualizar el código.

## Open Questions

> [!WARNING]
> **Relación `CATEGORIAS_CLIENTES`:**
> Actualmente la tabla `CATEGORIAS_CLIENTES` vincula clientes con categorías para saber qué productos deben revisar los mercaderistas. Con el nuevo esquema, la tabla `Sheet1$` trae un nivel superior (`Departamento`) y un nivel más bajo (`SubCategoria`). 
> **¿Deseas mantener la asignación a nivel de `Categoria` o te gustaría que los clientes se asignen a un `Departamento` entero o a una `Marca` específica?** Mi recomendación es mantener la asignación a nivel de `Categoria` por ahora, rellenando la tabla `CATEGORIAS` con las categorías únicas provenientes de `Sheet1$`, para minimizar el impacto en la lógica de las rutas del mercaderista.
>
> **Tabla `CATEGORIAS` existente:**
> Actualmente tienes una tabla `CATEGORIAS` (con registros como Víveres, Café, Coloración...). ¿Deseas que mezclemos las nuevas categorías del excel en esta misma tabla, o borramos/recreamos todo desde cero basándonos *únicamente* en el archivo nuevo?
>
> **`id_fabricante`:**
> La tabla anterior `PRODUCTS` tenía `id_fabricante` pero el nuevo diseño pide `id_productora`. Asumiré que `id_productora` sustituirá a `id_fabricante` y que la lógica del cliente (que a veces se relacionaba con el fabricante) se adaptará al nuevo campo. ¿Es esto correcto?

## Cambios Propuestos

### 1. Respaldos Iniciales

Ejecutaremos sentencias SQL para crear tablas de respaldo exactas a las actuales antes de hacer cualquier cambio:
- `SELECT * INTO PRODUCTS_BKP_20260622 FROM PRODUCTS;`
- `SELECT * INTO BALANCES_TOTALES_BKP_20260622 FROM BALANCES_TOTALES;`

### 2. Creación del Modelo Copo de Nieve (Snowflake)

Se crearán las siguientes tablas maestras (dimensiones) para normalizar la información extraída de `Sheet1$`:
- **`DEPARTAMENTOS`**: `id_departamento` (PK), `departamento`
- **`CATEGORIAS`** *(actualización)*: `id_categoria` (PK), `categoria`, `id_departamento` (FK) *(opcional, para mantener estricto el copo de nieve)*
- **`SUBCATEGORIAS`**: `id_subcategoria` (PK), `subcategoria`, `id_categoria` (FK)
- **`CATEGORIAS_BI`**: `id_categoriaBI` (PK), `categoriaBI`
- **`SUBCATEGORIAS_BI`**: `id_subcategoriaBI` (PK), `subcategoriaBI`, `id_categoriaBI` (FK)
- **`PRESENTACIONES`**: `id_presentacion` (PK), `presentacion`
- **`CLASIFICACION_TAMANOS`**: `id_clasificacion_tamaño` (PK), `clasificacion`
- **`MARCAS`**: `id_marca` (PK), `marca`
- **`PRODUCTORAS`**: `id_productora` (PK), `productora`

### 3. Modificación/Re-creación de la tabla `PRODUCTS`

La nueva tabla `PRODUCTS` tendrá la siguiente estructura, enlazando con las tablas anteriores:

```sql
CREATE TABLE PRODUCTS_NUEVA (
    id_product INT IDENTITY(1,1) PRIMARY KEY,
    producto_gutrade VARCHAR(255),
    descripcionbi VARCHAR(255),
    id_departamento INT FOREIGN KEY REFERENCES DEPARTAMENTOS(id_departamento),
    id_categoria INT FOREIGN KEY REFERENCES CATEGORIAS(id_categoria),
    id_subcategoria INT FOREIGN KEY REFERENCES SUBCATEGORIAS(id_subcategoria),
    id_presentacion INT FOREIGN KEY REFERENCES PRESENTACIONES(id_presentacion),
    id_categoriaBI INT FOREIGN KEY REFERENCES CATEGORIAS_BI(id_categoriaBI),
    id_subcategoriaBI INT FOREIGN KEY REFERENCES SUBCATEGORIAS_BI(id_subcategoriaBI),
    gramos FLOAT,
    id_clasificacion_tamaño INT FOREIGN KEY REFERENCES CLASIFICACION_TAMANOS(id_clasificacion_tamaño),
    id_marca INT FOREIGN KEY REFERENCES MARCAS(id_marca),
    id_productora INT FOREIGN KEY REFERENCES PRODUCTORAS(id_productora),
    cod_bar VARCHAR(100),
    inagotable BIT,
    comentario TEXT
);
```

### 4. Proceso de Migración (ETL)

1. Leer los datos distintos de `Sheet1$` e insertarlos en las tablas maestras correspondientes para obtener sus IDs.
2. Hacer un cruce (`JOIN`) entre los registros de `Sheet1$` y las nuevas tablas maestras para armar la nueva tabla `PRODUCTS`.
3. Renombrar la vieja tabla `PRODUCTS` a `PRODUCTS_OLD` (además del backup) y la nueva a `PRODUCTS`.
4. Una vez validada la base de datos, procederemos a identificar y actualizar las rutas del backend en Python que hacían `SELECT` a columnas que ya no existen (ej. `Fabricante`, `SKUs`).

## Verification Plan

### Manual Verification
- Te pediré que ejecutes una consulta `SELECT TOP 10 * FROM PRODUCTS` para verificar visualmente que todos los FK están correctamente mapeados.
- Probaremos las vistas y la API en backend para ver dónde "rompe" y así actualizar los endpoints (como los del mercaderista y atencion_cliente) para que utilicen la nueva estructura de joins.
