import re

path = r"c:\Users\Yoel Abreu\Documents\epran\Astroweb\AppWeb_v2\backend\app\routes\centro_mando.py"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Base query for activaciones
content = content.replace(
    """                ISNULL(ruta_pre.ruta,   'Sin ruta') AS ruta,
                ISNULL(ruta_pre.id_ruta, 0)         AS id_ruta,
                ISNULL(ruta_pre.analista,'')         AS nombre_analista,""",
    """                ISNULL(ruta_pre.ruta,   'Sin ruta') AS ruta,
                ISNULL(ruta_pre.id_ruta, 0)         AS id_ruta,
                ISNULL(ruta_pre.analista,'')         AS nombre_analista,
                ISNULL(ruta_pre.cuadrante,'')        AS cuadrante,"""
)

# 2. ruta_pre
content = content.replace(
    """                SELECT rp2.id_punto_interes,
                       rn2.ruta,
                       rn2.id_ruta,
                       a2.nombre_analista AS analista,""",
    """                SELECT rp2.id_punto_interes,
                       rn2.ruta,
                       rn2.id_ruta,
                       a2.nombre_analista AS analista,
                       rn2.cuadrante,"""
)

# 3. pend_query
content = content.replace(
    """                    ISNULL(pin.departamento,'') AS departamento, ISNULL(rp.prioridad,'') AS prioridad
                FROM MERCADERISTAS m""",
    """                    ISNULL(pin.departamento,'') AS departamento, ISNULL(rp.prioridad,'') AS prioridad,
                    ISNULL(rn.cuadrante,'') AS cuadrante
                FROM MERCADERISTAS m"""
)

# 4. pend_rows unpacking
content = content.replace(
    """            for r in (pend_rows or []):
                mid, mnom, idp, pnom, idc, cli, ciu, ruta, depto, prio = r""",
    """            for r in (pend_rows or []):
                mid, mnom, idp, pnom, idc, cli, ciu, ruta, depto, prio, cuad = r"""
)

# 5. pendientes.append
content = content.replace(
    """                    "departamento": depto, "prioridad": prio
                })""",
    """                    "departamento": depto, "prioridad": prio, "cuadrante": cuad
                })"""
)

# 6. sets initialization
content = content.replace(
    """        merc_rutas_set: dict = {}
        merc_deptos_set: dict = {}""",
    """        merc_rutas_set: dict = {}
        merc_deptos_set: dict = {}
        merc_cuads_set: dict = {}"""
)

# 7. for v in activaciones
content = content.replace(
    """            if v.get("ruta") and v["ruta"] != "Sin ruta": merc_rutas_set.setdefault(mid, set()).add(v["ruta"])
            if v.get("departamento"): merc_deptos_set.setdefault(mid, set()).add(v["departamento"])""",
    """            if v.get("ruta") and v["ruta"] != "Sin ruta": merc_rutas_set.setdefault(mid, set()).add(v["ruta"])
            if v.get("departamento"): merc_deptos_set.setdefault(mid, set()).add(v["departamento"])
            if v.get("cuadrante"): merc_cuads_set.setdefault(mid, set()).add(v["cuadrante"])"""
)

# 8. for p in pendientes
content = content.replace(
    """            if p.get("ruta") and p["ruta"] != "Sin ruta": merc_rutas_set.setdefault(mid, set()).add(p["ruta"])
            if p.get("departamento"): merc_deptos_set.setdefault(mid, set()).add(p["departamento"])""",
    """            if p.get("ruta") and p["ruta"] != "Sin ruta": merc_rutas_set.setdefault(mid, set()).add(p["ruta"])
            if p.get("departamento"): merc_deptos_set.setdefault(mid, set()).add(p["departamento"])
            if p.get("cuadrante"): merc_cuads_set.setdefault(mid, set()).add(p["cuadrante"])"""
)

# 9. por_mercaderista.append (before it)
content = content.replace(
    """            rutas_str = ", ".join(list(merc_rutas_set.get(mid, set())))
            if not rutas_str: rutas_str = "Sin ruta"

            por_mercaderista.append({""",
    """            rutas_str = ", ".join(list(merc_rutas_set.get(mid, set())))
            if not rutas_str: rutas_str = "Sin ruta"
            
            cuads_str = ", ".join(list(merc_cuads_set.get(mid, set())))
            if not cuads_str: cuads_str = "Sin cuadrante"

            por_mercaderista.append({"""
)

# 10. por_mercaderista.append (inside)
content = content.replace(
    """                "departamentos_str": deptos_str,
                "rutas_str": rutas_str,
            })""",
    """                "departamentos_str": deptos_str,
                "rutas_str": rutas_str,
                "cuadrantes_str": cuads_str,
            })"""
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Backend updated")
