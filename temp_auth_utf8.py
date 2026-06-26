def api_mis_visitas():
    """
    Retorna todas las visitas del cliente con sus fotos agrupadas por categor├¡a.
    Filtros: fecha (YYYY-MM-DD), region, cadena, punto_id
    Si no se pasa fecha, devuelve las de HOY.
    """
    if current_user.rol != 'client' and not current_user.is_coordinador_exclusivo():
        return jsonify({'error': 'No autorizado'}), 403

    # ÔöÇÔöÇ Par├ímetros ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    fecha_param  = request.args.get('fecha', '')        # YYYY-MM-DD  (vac├¡o = hoy)
    region_param = request.args.get('region', '')
    cadena_param = request.args.get('cadena', '')
    punto_param  = request.args.get('punto_id', '')
    cliente_id_param = request.args.get('cliente_id', type=int)

    # ÔöÇÔöÇ Determinar cliente_id ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    if current_user.is_coordinador_exclusivo():
        if not cliente_id_param:
            return jsonify({'error': 'cliente_id requerido para coordinador'}), 400
        target_cliente_id = cliente_id_param
    else:
        target_cliente_id = current_user.cliente_id
        if not target_cliente_id:
            return jsonify({'error': 'Cliente no asociado'}), 400

    # ÔöÇÔöÇ Fecha ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
    if fecha_param:
        try:
            datetime.strptime(fecha_param, '%Y-%m-%d')
            fecha_sql = fecha_param
        except ValueError:
            return jsonify({'error': 'Formato de fecha inv├ílido (YYYY-MM-DD)'}), 400
    else:
        fecha_sql = datetime.now().strftime('%Y-%m-%d')   # HOY por defecto

    try:
        # ÔöÇÔöÇ Query principal ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
        query = """
            SELECT
                vm.id_visita,
                vm.fecha_visita,
                m.nombre                        AS mercaderista,
                pin.identificador               AS punto_id,
                pin.punto_de_interes            AS punto_nombre,
                pin.departamento,
                pin.ciudad,
                rn.cuadrante                    AS region,
                pin.jerarquia_nivel_2_2         AS cadena,
                ft.id_foto,
                ft.file_path,
                ft.id_tipo_foto,
                ft.estado                       AS foto_estado,
                c.cliente                       AS cliente_nombre
            FROM VISITAS_MERCADERISTA vm WITH (NOLOCK)
            JOIN MERCADERISTAS m         WITH (NOLOCK) ON vm.id_mercaderista = m.id_mercaderista
            JOIN PUNTOS_INTERES1 pin     WITH (NOLOCK) ON vm.identificador_punto_interes = pin.identificador
            JOIN CLIENTES c              WITH (NOLOCK) ON vm.id_cliente = c.id_cliente
            LEFT JOIN FOTOS_TOTALES ft   WITH (NOLOCK) ON ft.id_visita = vm.id_visita
                                                       AND ft.estado = 'Aprobada'
            LEFT JOIN RUTA_PROGRAMACION rp WITH (NOLOCK)
                ON rp.id_punto_interes = pin.identificador
               AND rp.id_cliente = vm.id_cliente
            LEFT JOIN RUTAS_NUEVAS rn    WITH (NOLOCK) ON rn.id_ruta = rp.id_ruta
            WHERE vm.id_cliente = ?
              AND CAST(vm.fecha_visita AS DATE) = ?
              AND vm.estado = 'Revisado'
        """
        params = [target_cliente_id, fecha_sql]

        if region_param:
            query += " AND rn.cuadrante = ?"
            params.append(region_param)

        if cadena_param:
            query += " AND pin.jerarquia_nivel_2_2 = ?"
            params.append(cadena_param)

        if punto_param:
            query += " AND pin.identificador = ?"
            params.append(punto_param)

        query += " ORDER BY vm.id_visita DESC, ft.id_tipo_foto, ft.id_foto DESC"

        rows = execute_query(query, tuple(params))

        # ÔöÇÔöÇ Agrupar por visita ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
        CATEGORIAS_CONFIG = {
            1: ('Gesti├│n',                 'Gesti├│n'),
            2: ('Gesti├│n',                 'Gesti├│n'),
            3: ('Precio',                  'Precio'),
            4: ('Exhibiciones',            'Exhibiciones Adicionales'),
            8: ('Material POP Antes',      'Material POP Antes'),
            9: ('Material POP Despues',    'Material POP Despues'),
        }

        visitas = {}
        for row in (rows or []):
            vid = row[0]
            if vid not in visitas:
                visitas[vid] = {
                    'id_visita':      vid,
                    'fecha_visita':   row[1].isoformat() if row[1] else None,
                    'mercaderista':   row[2] or '',
                    'punto_id':       row[3],
                    'punto_nombre':   row[4] or '',
                    'departamento':   row[5] or '',
                    'ciudad':         row[6] or '',
                    'region':         row[7] or '',
                    'cadena':         row[8] or '',
                    'cliente_nombre': row[13] or '',
                    'total_fotos':    0,
                    'preview_foto':   None,
                    'fotos_por_categoria': {
                        'Gesti├│n':             [],
                        'Precio':              [],
                        'Exhibiciones Adicionales': [],
                        'Material POP Antes':  [],
                        'Material POP Despues':[],
                    }
                }

            # ÔöÇÔöÇ Foto ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
            if row[9]:   # id_foto no nulo
                id_tipo = row[11]
                cat_key, cat_label = CATEGORIAS_CONFIG.get(id_tipo, (f'Tipo {id_tipo}', f'Tipo {id_tipo}'))

                tipo_desc_map = {
                    1: 'Antes', 2: 'Despu├®s', 3: 'Precio',
                    4: 'Exhibiciones', 8: 'Material POP Antes', 9: 'Material POP Despu├®s'
                }

                cleaned = row[10].replace("X://","").replace("X:/","").replace("\\","/").lstrip("/") if row[10] else ''

                foto = {
                    'id_foto':     row[9],
                    'file_path':   cleaned,
                    'id_tipo_foto': id_tipo,
                    'tipo_desc':   tipo_desc_map.get(id_tipo, f'Tipo {id_tipo}'),
                    'categoria':   cat_label,
                    'estado':      row[12],
                    'fecha':       row[1].isoformat() if row[1] else None,
                    'id_visita':   vid,
                }

                cat_bucket = visitas[vid]['fotos_por_categoria']
                if cat_label in cat_bucket:
                    cat_bucket[cat_label].append(foto)
                    visitas[vid]['total_fotos'] += 1
                    if not visitas[vid]['preview_foto']:
                        visitas[vid]['preview_foto'] = cleaned

        # ÔöÇÔöÇ Filtros disponibles (para poblar los <select>) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
        filtros_query = """
            SELECT DISTINCT
                rn.cuadrante                AS region,
                pin.jerarquia_nivel_2_2     AS cadena,
                pin.identificador           AS punto_id,
                pin.punto_de_interes        AS punto_nombre
            FROM VISITAS_MERCADERISTA vm WITH (NOLOCK)
            JOIN PUNTOS_INTERES1 pin     WITH (NOLOCK) ON vm.identificador_punto_interes = pin.identificador
            LEFT JOIN RUTA_PROGRAMACION rp WITH (NOLOCK)
                ON rp.id_punto_interes = pin.identificador
               AND rp.id_cliente = vm.id_cliente
            LEFT JOIN RUTAS_NUEVAS rn    WITH (NOLOCK) ON rn.id_ruta = rp.id_ruta
            WHERE vm.id_cliente = ?
              AND CAST(vm.fecha_visita AS DATE) = ?
              AND vm.estado = 'Revisado'
            ORDER BY rn.cuadrante, pin.jerarquia_nivel_2_2, pin.punto_de_interes
        """
        filtros_rows = execute_query(filtros_query, (target_cliente_id, fecha_sql))

        regiones = sorted({r[0] for r in (filtros_rows or []) if r[0]})
        cadenas  = sorted({r[1] for r in (filtros_rows or []) if r[1]})
        puntos   = [{'id': r[2], 'nombre': r[3]} for r in (filtros_rows or []) if r[2]]
        # deduplicar puntos
        seen = set()
        puntos_uniq = []
        for p in puntos:
