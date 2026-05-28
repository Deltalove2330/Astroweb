# app/routes/encuestador.py
"""
Encuestador Médico (id_rol = 12) — v2 FastAPI.

Port directo del Flask: AppWeb/backend/app/routes/encuestador.py.
Mismas mecánicas:
  1. login → /api/encuestador/jornada-activa
  2. activar jornada (JORNADAS_ENCUESTADOR)
  3. buscar/crear centro_salud → abrir encuesta_centro
  4. agregar n médicos (medicos + medico_centro_encuesta)
  5. cerrar encuesta del centro → repetir 3-4
  6. finalizar jornada al final del día

Catálogo de rangos fijos (valor de consulta, pacientes/semana, días,
fuentes de información) expuesto en /catalogos para el formulario.
"""
from typing import Optional, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.dependencies import get_current_user
from app.models.user import Usuario

router = APIRouter(prefix="/api/encuestador", tags=["Encuestador Médico"])


# ── Dependency: solo rol 12 (encuestador) ────────────────────────
def require_encuestador(current_user: Usuario = Depends(get_current_user)) -> Usuario:
    if getattr(current_user, 'id_rol', None) != 12:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso no autorizado. Solo Encuestadores Médicos.",
        )
    return current_user


# ── Helpers ──────────────────────────────────────────────────────
def _rows(db: Session, sql: str, params: dict | None = None) -> List[tuple]:
    return [tuple(r) for r in db.execute(text(sql), params or {}).fetchall()]


def _scalar(db: Session, sql: str, params: dict | None = None):
    r = db.execute(text(sql), params or {}).fetchone()
    return r[0] if r else None


def _get_jornada_activa(db: Session, id_usuario: int):
    return db.execute(text("""
        SELECT TOP 1 id_jornada, fecha_inicio, ciudad, estado_geo
        FROM JORNADAS_ENCUESTADOR
        WHERE id_usuario = :uid AND estado = 'En Progreso'
        ORDER BY id_jornada DESC
    """), {"uid": id_usuario}).fetchone()


def _get_encuesta_abierta(db: Session, id_jornada: int):
    return db.execute(text("""
        SELECT TOP 1 ec.id_encuesta, ec.id_centro, cs.nombre_centro, cs.ciudad,
                     cs.estado, ec.fecha_verificacion, ec.fuente_informacion
        FROM encuestas_centro ec
        JOIN centros_salud cs ON cs.id_centro = ec.id_centro
        WHERE ec.id_jornada = :jid AND ec.estado = 'Abierta'
        ORDER BY ec.id_encuesta DESC
    """), {"jid": id_jornada}).fetchone()


# ═════════════════════════════════════════════════════════════════
# Schemas (Pydantic)
# ═════════════════════════════════════════════════════════════════
class ActivarJornadaIn(BaseModel):
    latitud:    Optional[float] = None
    longitud:   Optional[float] = None
    ciudad:     Optional[str]   = None
    estado_geo: Optional[str]   = Field(None, description="Estado/departamento geográfico")


class CrearCentroIn(BaseModel):
    nombre_centro:      str
    direccion_completa: str
    ciudad: Optional[str] = None
    estado: Optional[str] = None


class CrearEncuestaIn(BaseModel):
    id_centro:           int
    fuente_informacion:  Optional[str] = "Visita presencial"
    notas_generales:     Optional[str] = None


class MedicoCentroIn(BaseModel):
    # Si id_medico viene, se usa; si no, los demás campos son requeridos para crear el médico
    id_medico: Optional[int] = None

    # Datos del médico (si es nuevo)
    id_medico_externo:      Optional[str] = None
    apellido1:              Optional[str] = None
    apellido2:              Optional[str] = None
    nombre1:                Optional[str] = None
    nombre2:                Optional[str] = None
    especialidad:           Optional[str] = None
    sub_especialidad:       Optional[str] = None
    universidad_graduacion: Optional[str] = None
    nro_MPPS:               Optional[str] = None
    nro_colegiado:          Optional[str] = None
    ciudad:                 Optional[str] = None
    estado:                 Optional[str] = None
    telefono:               Optional[str] = None
    whatsapp:               Optional[str] = None
    email:                  Optional[str] = None
    linkedin:               Optional[str] = None
    instagram:              Optional[str] = None

    # Datos del consultorio 1 (en este centro)
    piso_consultorio:     Optional[str] = None
    horarios_consulta:    Optional[str] = None
    dias_consulta:        Optional[str] = None
    direccion_especifica: Optional[str] = None

    # Consultorio 2 (opcional)
    clinica2_nombre:       Optional[str] = None
    piso_consultorio2:     Optional[str] = None
    horarios_consulta2:    Optional[str] = None
    dias_consulta2:        Optional[str] = None
    direccion_especifica2: Optional[str] = None

    # Económicos (obligatorios)
    valor_consulta_rango:             str
    promedio_pacientes_semanal_rango: str


# ═════════════════════════════════════════════════════════════════
# JORNADA
# ═════════════════════════════════════════════════════════════════
@router.get("/jornada-activa")
def jornada_activa(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    j = _get_jornada_activa(db, current_user.id)
    if not j:
        return {"success": True, "activa": False}

    medicos = _scalar(db, """
        SELECT COUNT(*) FROM medico_centro_encuesta mce
        JOIN encuestas_centro ec ON ec.id_encuesta = mce.id_encuesta
        WHERE ec.id_jornada = :jid
    """, {"jid": j[0]}) or 0
    centros = _scalar(db, """
        SELECT COUNT(DISTINCT id_centro) FROM encuestas_centro WHERE id_jornada = :jid
    """, {"jid": j[0]}) or 0

    return {
        "success":              True,
        "activa":               True,
        "id_jornada":           j[0],
        "fecha_inicio":         j[1].isoformat() if j[1] else None,
        "ciudad":               j[2],
        "estado_geo":           j[3],
        "medicos_registrados":  int(medicos),
        "centros_visitados":    int(centros),
    }


@router.post("/activar-jornada")
def activar_jornada(
    payload: ActivarJornadaIn = ActivarJornadaIn(),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    # Idempotente: si ya hay una, devolverla
    j = _get_jornada_activa(db, current_user.id)
    if j:
        return {
            "success":      True,
            "id_jornada":   j[0],
            "fecha_inicio": j[1].isoformat() if j[1] else None,
            "ya_activa":    True,
        }

    db.execute(text("""
        INSERT INTO JORNADAS_ENCUESTADOR
            (id_usuario, fecha_inicio, estado, latitud, longitud, ciudad, estado_geo)
        VALUES (:uid, GETDATE(), 'En Progreso', :lat, :lng, :ciudad, :estado_geo)
    """), {
        "uid":        current_user.id,
        "lat":        payload.latitud,
        "lng":        payload.longitud,
        "ciudad":     payload.ciudad or None,
        "estado_geo": payload.estado_geo or None,
    })
    db.commit()
    j = _get_jornada_activa(db, current_user.id)
    if not j:
        raise HTTPException(status_code=500, detail="No se pudo crear la jornada")
    return {"success": True, "id_jornada": j[0], "fecha_inicio": j[1].isoformat() if j[1] else None}


@router.post("/finalizar-jornada")
def finalizar_jornada(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    # Cerrar encuestas abiertas de la jornada actual y luego cerrar la jornada
    db.execute(text("""
        UPDATE encuestas_centro
        SET estado = 'Cerrada'
        WHERE estado = 'Abierta'
          AND id_jornada IN (SELECT id_jornada FROM JORNADAS_ENCUESTADOR
                             WHERE id_usuario = :uid AND estado = 'En Progreso')
    """), {"uid": current_user.id})

    db.execute(text("""
        UPDATE JORNADAS_ENCUESTADOR
        SET estado = 'Finalizada', fecha_fin = GETDATE()
        WHERE id_usuario = :uid AND estado = 'En Progreso'
    """), {"uid": current_user.id})

    db.commit()
    return {"success": True, "message": "Jornada finalizada"}


# ═════════════════════════════════════════════════════════════════
# CENTROS DE SALUD
# ═════════════════════════════════════════════════════════════════
@router.get("/centros")
def centros_list(
    q: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    q = (q or "").strip()
    if q:
        like = f"%{q}%"
        rows = _rows(db, """
            SELECT TOP 50 id_centro, nombre_centro, direccion_completa, ciudad, estado
            FROM centros_salud
            WHERE nombre_centro LIKE :q OR ciudad LIKE :q OR estado LIKE :q
            ORDER BY nombre_centro
        """, {"q": like})
    else:
        rows = _rows(db, """
            SELECT TOP 100 id_centro, nombre_centro, direccion_completa, ciudad, estado
            FROM centros_salud ORDER BY nombre_centro
        """)
    return {
        "success": True,
        "centros": [{
            "id_centro": r[0], "nombre_centro": r[1],
            "direccion_completa": r[2], "ciudad": r[3], "estado": r[4]
        } for r in rows]
    }


@router.post("/centros", status_code=201)
def centros_create(
    payload: CrearCentroIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    nombre = payload.nombre_centro.strip()
    direccion = payload.direccion_completa.strip()
    if not nombre or not direccion:
        raise HTTPException(status_code=400,
                            detail="nombre_centro y direccion_completa son requeridos")

    db.execute(text("""
        INSERT INTO centros_salud (nombre_centro, direccion_completa, ciudad, estado)
        VALUES (:nombre, :dir, :ciudad, :estado)
    """), {
        "nombre": nombre, "dir": direccion,
        "ciudad": (payload.ciudad or "").strip() or None,
        "estado": (payload.estado or "").strip() or None,
    })
    db.commit()

    new_id = _scalar(db, "SELECT TOP 1 id_centro FROM centros_salud ORDER BY id_centro DESC")
    return {
        "success": True,
        "id_centro": int(new_id) if new_id is not None else None,
        "nombre_centro": nombre,
        "ciudad": payload.ciudad,
        "estado": payload.estado,
        "direccion_completa": direccion,
    }


# ═════════════════════════════════════════════════════════════════
# ENCUESTAS DEL CENTRO
# ═════════════════════════════════════════════════════════════════
@router.get("/encuesta-abierta")
def encuesta_abierta(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    j = _get_jornada_activa(db, current_user.id)
    if not j:
        return {"success": True, "tiene_encuesta": False, "jornada_activa": False}

    e = _get_encuesta_abierta(db, j[0])
    if not e:
        return {"success": True, "tiene_encuesta": False, "jornada_activa": True,
                "id_jornada": j[0]}

    meds = _rows(db, """
        SELECT m.id_medico_externo, m.apellido1, m.apellido2, m.nombre1, m.nombre2,
               m.especialidad, mce.valor_consulta_rango,
               mce.promedio_pacientes_semanal_rango, mce.id_medico_centro
        FROM medico_centro_encuesta mce
        JOIN medicos m ON m.id_medico = mce.id_medico
        WHERE mce.id_encuesta = :eid
        ORDER BY mce.id_medico_centro DESC
    """, {"eid": e[0]})

    return {
        "success":            True,
        "tiene_encuesta":     True,
        "jornada_activa":     True,
        "id_jornada":         j[0],
        "id_encuesta":        e[0],
        "id_centro":          e[1],
        "nombre_centro":      e[2],
        "ciudad":             e[3],
        "estado":             e[4],
        "fecha_verificacion": e[5].isoformat() if e[5] else None,
        "fuente_informacion": e[6],
        "medicos": [{
            "id_medico_centro": m[8], "id_medico_externo": m[0],
            "apellido1": m[1], "apellido2": m[2], "nombre1": m[3], "nombre2": m[4],
            "especialidad": m[5], "valor_consulta_rango": m[6],
            "promedio_pacientes_semanal_rango": m[7]
        } for m in meds],
    }


@router.post("/encuestas", status_code=201)
def encuesta_crear(
    payload: CrearEncuestaIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    j = _get_jornada_activa(db, current_user.id)
    if not j:
        raise HTTPException(status_code=400, detail="Debes activar una jornada primero")

    existente = _get_encuesta_abierta(db, j[0])
    if existente:
        raise HTTPException(
            status_code=409,
            detail={"message": "Ya tienes una encuesta abierta. Ciérrala antes de iniciar otra.",
                    "id_encuesta": existente[0]},
        )

    db.execute(text("""
        INSERT INTO encuestas_centro
            (id_usuario, id_centro, id_jornada, fecha_verificacion, fuente_informacion,
             notas_generales, estado)
        VALUES (:uid, :cid, :jid, CAST(GETDATE() AS DATE), :fuente, :notas, 'Abierta')
    """), {
        "uid": current_user.id,
        "cid": payload.id_centro,
        "jid": j[0],
        "fuente": (payload.fuente_informacion or "Visita presencial").strip(),
        "notas": (payload.notas_generales or "").strip() or None,
    })
    db.commit()

    new_id = _scalar(db, "SELECT TOP 1 id_encuesta FROM encuestas_centro ORDER BY id_encuesta DESC")
    return {"success": True, "id_encuesta": int(new_id) if new_id else None, "id_jornada": j[0]}


@router.post("/encuestas/{id_encuesta}/cerrar")
def encuesta_cerrar(
    id_encuesta: int,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    db.execute(text("""
        UPDATE encuestas_centro SET estado = 'Cerrada'
        WHERE id_encuesta = :eid AND id_usuario = :uid
    """), {"eid": id_encuesta, "uid": current_user.id})
    db.commit()
    return {"success": True}


# ═════════════════════════════════════════════════════════════════
# MÉDICOS (catálogo) + REGISTRO EN ENCUESTA
# ═════════════════════════════════════════════════════════════════
@router.get("/medicos/buscar")
def medicos_buscar(
    q: str = Query(...),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    q = (q or "").strip()
    if not q:
        return {"success": True, "medicos": []}

    like = f"%{q}%"
    rows = _rows(db, """
        SELECT TOP 25 id_medico, id_medico_externo, apellido1, apellido2, nombre1, nombre2,
                      especialidad, sub_especialidad, universidad_graduacion,
                      nro_MPPS, nro_colegiado, ciudad, estado, telefono, whatsapp, email,
                      linkedin, instagram
        FROM medicos
        WHERE id_medico_externo LIKE :q
           OR apellido1 LIKE :q OR apellido2 LIKE :q
           OR nombre1 LIKE :q OR nombre2 LIKE :q
        ORDER BY apellido1, nombre1
    """, {"q": like})

    return {"success": True, "medicos": [{
        "id_medico": r[0], "id_medico_externo": r[1],
        "apellido1": r[2], "apellido2": r[3], "nombre1": r[4], "nombre2": r[5],
        "especialidad": r[6], "sub_especialidad": r[7],
        "universidad_graduacion": r[8], "nro_MPPS": r[9], "nro_colegiado": r[10],
        "ciudad": r[11], "estado": r[12], "telefono": r[13], "whatsapp": r[14],
        "email": r[15], "linkedin": r[16], "instagram": r[17],
    } for r in rows]}


@router.post("/medico-centro", status_code=201)
def medico_centro_save(
    payload: MedicoCentroIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(require_encuestador),
):
    """
    Agrega un médico a la encuesta abierta del centro.
    Si payload.id_medico viene, usa ese; si no, crea el médico primero.
    """
    # 1) Encuesta abierta
    j = _get_jornada_activa(db, current_user.id)
    if not j:
        raise HTTPException(status_code=400, detail="No tienes jornada activa")
    e = _get_encuesta_abierta(db, j[0])
    if not e:
        raise HTTPException(status_code=400, detail="No tienes encuesta abierta")
    id_encuesta = e[0]

    # 2) Resolver / crear médico
    id_medico = payload.id_medico
    if not id_medico:
        req = ['id_medico_externo', 'apellido1', 'nombre1', 'especialidad', 'ciudad', 'estado']
        for f in req:
            if not getattr(payload, f, None):
                raise HTTPException(status_code=400,
                                    detail=f"Campo de médico obligatorio: {f}")

        existing = _scalar(db,
            "SELECT id_medico FROM medicos WHERE id_medico_externo = :ext",
            {"ext": payload.id_medico_externo}
        )
        if existing:
            id_medico = int(existing)
        else:
            db.execute(text("""
                INSERT INTO medicos (
                    id_medico_externo, apellido1, apellido2, nombre1, nombre2,
                    especialidad, sub_especialidad, universidad_graduacion,
                    nro_MPPS, nro_colegiado, ciudad, estado,
                    telefono, whatsapp, email, linkedin, instagram
                ) VALUES (
                    :ext, :ap1, :ap2, :n1, :n2,
                    :esp, :sub, :uni, :mpps, :col, :ciudad, :estado,
                    :tel, :wa, :em, :li, :ig
                )
            """), {
                "ext": payload.id_medico_externo, "ap1": payload.apellido1,
                "ap2": payload.apellido2, "n1": payload.nombre1, "n2": payload.nombre2,
                "esp": payload.especialidad, "sub": payload.sub_especialidad,
                "uni": payload.universidad_graduacion,
                "mpps": payload.nro_MPPS, "col": payload.nro_colegiado,
                "ciudad": payload.ciudad, "estado": payload.estado,
                "tel": payload.telefono, "wa": payload.whatsapp, "em": payload.email,
                "li": payload.linkedin, "ig": payload.instagram,
            })
            db.commit()
            id_medico = int(_scalar(db,
                "SELECT TOP 1 id_medico FROM medicos ORDER BY id_medico DESC"))

    # 3) Evitar duplicado del mismo médico en la misma encuesta
    dup = _scalar(db,
        "SELECT id_medico_centro FROM medico_centro_encuesta WHERE id_encuesta = :eid AND id_medico = :mid",
        {"eid": id_encuesta, "mid": id_medico}
    )
    if dup:
        raise HTTPException(
            status_code=409,
            detail="Este médico ya fue registrado en esta encuesta del centro.",
        )

    # 4) Validar campos obligatorios del cruce
    valor    = (payload.valor_consulta_rango or "").strip()
    promedio = (payload.promedio_pacientes_semanal_rango or "").strip()
    if not valor or not promedio:
        raise HTTPException(status_code=400,
            detail="valor_consulta_rango y promedio_pacientes_semanal_rango son obligatorios")

    # 5) Insertar el cruce
    db.execute(text("""
        INSERT INTO medico_centro_encuesta (
            id_encuesta, id_medico,
            piso_consultorio, horarios_consulta, dias_consulta, direccion_especifica,
            clinica2_nombre, piso_consultorio2, horarios_consulta2, dias_consulta2,
            direccion_especifica2,
            valor_consulta_rango, promedio_pacientes_semanal_rango
        ) VALUES (
            :eid, :mid,
            :piso1, :hor1, :dias1, :dir1,
            :c2_nom, :piso2, :hor2, :dias2, :dir2,
            :valor, :prom
        )
    """), {
        "eid": id_encuesta, "mid": id_medico,
        "piso1": payload.piso_consultorio, "hor1": payload.horarios_consulta,
        "dias1": payload.dias_consulta, "dir1": payload.direccion_especifica,
        "c2_nom": payload.clinica2_nombre, "piso2": payload.piso_consultorio2,
        "hor2": payload.horarios_consulta2, "dias2": payload.dias_consulta2,
        "dir2": payload.direccion_especifica2,
        "valor": valor, "prom": promedio,
    })
    db.commit()

    cnt = _scalar(db,
        "SELECT COUNT(*) FROM medico_centro_encuesta WHERE id_encuesta = :eid",
        {"eid": id_encuesta}
    )
    return {
        "success": True,
        "id_medico": id_medico,
        "id_encuesta": id_encuesta,
        "medicos_en_centro": int(cnt) if cnt is not None else 0,
    }


# ═════════════════════════════════════════════════════════════════
# CATÁLOGOS (rangos y enums fijos del formulario)
# ═════════════════════════════════════════════════════════════════
@router.get("/catalogos")
def catalogos(
    current_user: Usuario = Depends(require_encuestador),
):
    return {
        "valor_consulta_rangos": [
            "Menos de 30$", "Entre 30$ a 50$", "Entre 50$ a 60$",
            "Entre 60$ a 100$", "Más de 100$",
        ],
        "promedio_pacientes_rangos": [
            "1 a 5 pacientes", "6 a 10 pacientes", "11 a 15 pacientes",
            "16 a 20 pacientes", "21 a 30 pacientes", "Más de 30 pacientes",
        ],
        "fuentes_informacion": [
            "Visita presencial", "Llamada telefónica", "Referencia",
            "Página web del centro", "Redes sociales", "Otra",
        ],
        "dias_consulta": ["Lunes", "Martes", "Miércoles", "Jueves",
                          "Viernes", "Sábado", "Domingo"],
    }
