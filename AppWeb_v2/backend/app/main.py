import logging
import os

# Configuración de logging (DEBE IR ANTES DE IMPORTAR RUTAS)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("app")

# Asegurar que el log se guarde en un archivo
log_handler = logging.FileHandler("backend_debug.log")
log_handler.setLevel(logging.INFO)
logger.addHandler(log_handler)

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from contextlib import asynccontextmanager
from app.core.config import settings
import app.db.all_models  # noqa: F401 — registers all SQLAlchemy models
from app.routes import auth, users, merchandisers, visits, rutas, points, supervisors, auditors, reporteria, chat, admin_sessions, atencion_cliente, mercaderista_rutas, push, notifications, clients, audit, catalogos


@asynccontextmanager
async def lifespan(app: FastAPI):
    from app.services.scheduler_service import start_scheduler, stop_scheduler
    from app.services.catalogos_init import ensure_catalog_tables
    try:
        ensure_catalog_tables()
    except Exception as e:
        logger.exception(f"Fallo inicializando catálogos: {e}")
    start_scheduler()
    yield
    stop_scheduler()


app = FastAPI(
    title="EPRAN API",
    description="Sistema de gestión de visitas y merchandising",
    version="2.0.0",
    lifespan=lifespan,
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(f"!!! VALIDATION ERROR: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://localhost:4200/",
        "http://127.0.0.1:4200/",
        "http://localhost",
        "http://127.0.0.1",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

from fastapi.exceptions import RequestValidationError, ResponseValidationError

@app.exception_handler(ResponseValidationError)
async def validation_exception_handler(request: Request, exc: ResponseValidationError):
    print(f"RESPONSE VALIDATION ERROR: {exc.errors()}", flush=True)
    return JSONResponse(status_code=500, content={"detail": "Response validation error", "errors": exc.errors()})

@app.exception_handler(Exception)

async def global_exception_handler(request: Request, exc: Exception):
    import sys
    import traceback
    try:
        print(f"CRASH DETECTED in {request.url.path}: {exc}", file=sys.stderr)
        traceback.print_exc(file=sys.stderr)
        logger.error(f"Error no manejado en {request.url.path}: {str(exc)}", exc_info=True)
    except Exception as e:
        print(f"Error in exception handler: {e}", file=sys.stderr)
        
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Error interno del servidor",
            "message": str(exc)
        }
    )

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(merchandisers.router)
app.include_router(visits.router)
app.include_router(rutas.router)
app.include_router(points.router)
app.include_router(supervisors.router)
app.include_router(auditors.router)
app.include_router(reporteria.router)
app.include_router(chat.router)
app.include_router(admin_sessions.router)
app.include_router(atencion_cliente.router)
app.include_router(mercaderista_rutas.router)
app.include_router(push.router)
app.include_router(notifications.router)
app.include_router(clients.router)
app.include_router(audit.router)
app.include_router(catalogos.router)
from app.routes import analysts
app.include_router(analysts.router)
from app.routes import client_photos
app.include_router(client_photos.router)
from app.routes import client_data
app.include_router(client_data.router)
from app.routes import mercaderista_portal
app.include_router(mercaderista_portal.router)
from app.routes import centro_mando_dia
app.include_router(centro_mando_dia.router)
from app.routes import encuestador
app.include_router(encuestador.router)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "2.0.0"}

@app.get("/favicon.ico", include_in_schema=False)
async def favicon():
    # Intenta servir el favicon si existe, si no retorna 204
    favicon_path = "app/static/favicon.ico"
    if os.path.exists(favicon_path):
        return FileResponse(favicon_path)
    return JSONResponse(status_code=204, content=None)
