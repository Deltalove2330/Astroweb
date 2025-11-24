# telegram-bot/main.py
import logging
import sys
from filelock import FileLock
import os
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ConversationHandler, ContextTypes
from config import TOKEN, LOG_FORMAT, LOG_LEVEL, PHOTO_DIR

from handlers.start_handler import start, handle_cedula, handle_non_text_in_cedula, ask_cedula, start_rutas_variables
from handlers.client_handler import handle_client_confirmation
from handlers.auxiliary import go_back_to_ciudad, go_back_to_poi
from handlers.ruta_handlers import start_rutas, handle_realizar_rutas, handle_ruta_selection, handle_punto_interes_ruta, handle_cliente_multiple_selection, handle_ruta_variable_selection

from handlers.selection_handlers import (
    handle_depto_selection,
    handle_ciudad_selection,
    handle_poi_selection, handle_non_text_in_depto, handle_non_text_in_ciudad, handle_main_menu_selection
)
from handlers.client_handler import handle_cliente_selection, handle_cliente_selected
from handlers.photo_handler import (
    finish_gestion, show_extended_final_summary,show_complete_summary, handle_price_photos, handle_exhibiciones_photos,
    show_final_summary, show_final_message, handle_before_photos, request_after_photos, handle_after_photos, go_back_to_before_photos
)
from handlers.auxiliary import go_back_to_deptos, cancel, help_command, error_handler
from states import (
    ASK_CEDULA,
    SELECTING_DEPTO,
    SELECTING_CIUDAD,
    SELECTING_POI,
    CONFIRM_POI_SELECTION,
    SELECTING_CLIENTE,
    CONFIRM_CLIENT_SELECTION,
    FINISH_MESSAGE,
    FINAL_CONFIRMATION, SELECTING_EXHIBICIONES_PHOTOS,
    SELECTING_BEFORE_PHOTOS, SELECTING_PRICE_PHOTOS, 
    SELECTING_AFTER_PHOTOS, SELECTING_RUTA, SELECTING_PUNTO_INTERES_RUTA, SELECTING_CLIENTE_RUTA, SELECTING_MAIN_MENU, SELECTING_MULTIPLE_CLIENTES, SELECTING_RUTA_VARIABLE
)

try:
    from mount_azure_storage import mount_azure_storage
except ImportError:
    def mount_azure_storage():
        print("⚠️ Script de montaje no disponible. Asegúrate de tener mount_azure_storage.py")
        return False

# Configurar logging
logging.basicConfig(format=LOG_FORMAT, level=LOG_LEVEL)
logger = logging.getLogger(__name__)

def main() -> None:
    # Montar Azure Storage al inicio
    if not mount_azure_storage():
        # Si falla, intentar usar el fallback configurado en config.py
        print(f"⚠️ Usando directorio de fotos: {PHOTO_DIR} (puede ser local)")

    # Construir la aplicación con timeouts extendidos (usando paréntesis)
    application = (
        Application.builder()
        .token(TOKEN)
        .connect_timeout(20)  # 30 segundos para conectar
        .read_timeout(20)     # 30 segundos para lectura
        .pool_timeout(20)     # 30 segundos para pool
        .build()
    )
    
    conv_handler = ConversationHandler(
        entry_points=[CommandHandler('start', start)],
        states={
            ASK_CEDULA: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_cedula),
                MessageHandler(~filters.TEXT, handle_non_text_in_cedula)
            ],
            
            SELECTING_MAIN_MENU: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_main_menu_selection),
            ],  
            
            SELECTING_RUTA: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_ruta_selection),
            ],
            SELECTING_PUNTO_INTERES_RUTA: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_punto_interes_ruta),
            ],
            SELECTING_MULTIPLE_CLIENTES: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_cliente_multiple_selection),
            ],
            SELECTING_RUTA_VARIABLE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_ruta_variable_selection),
            ],
            SELECTING_DEPTO: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_depto_selection),
                MessageHandler(filters.ALL & ~filters.TEXT & ~filters.COMMAND, handle_non_text_in_depto)
            ],
            SELECTING_CIUDAD: [
                MessageHandler(filters.Regex(r'^🏢 CAMBIAR DEPARTAMENTO$'), go_back_to_deptos),
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_ciudad_selection),
                MessageHandler(filters.ALL & ~filters.TEXT & ~filters.COMMAND, handle_non_text_in_ciudad)
            ],
            SELECTING_POI: [
                MessageHandler(filters.Regex(r'^🏢 CAMBIAR DEPARTAMENTO$'), go_back_to_deptos),
                MessageHandler(filters.Regex(r'^🏙️ CAMBIAR CIUDAD$'), go_back_to_ciudad),  
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_poi_selection),
            ],
            CONFIRM_POI_SELECTION: [  
                MessageHandler(filters.Regex(r'^✅ Sí$'), handle_cliente_selection),
                MessageHandler(filters.Regex(r'^📍 CAMBIAR PUNTO DE INTERÉS$'), go_back_to_poi),
            ],
            SELECTING_CLIENTE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_cliente_selected),
            ],
            CONFIRM_CLIENT_SELECTION: [ 
                MessageHandler(filters.TEXT & ~filters.COMMAND, handle_client_confirmation),
            ],
            FINAL_CONFIRMATION: [
                MessageHandler(filters.Regex(r'^(✅ Sí|❌ No)$'), show_final_message),
                MessageHandler(filters.Regex(r'^📍 CAMBIAR PUNTO DE INTERÉS$'), go_back_to_poi),
            ],
            SELECTING_BEFORE_PHOTOS: [
                MessageHandler(filters.PHOTO, handle_before_photos),
                MessageHandler(filters.Regex(r'^➡️ PASAR A FOTOS DEL DESPUÉS$'), request_after_photos),
            ],
            SELECTING_AFTER_PHOTOS: [
                MessageHandler(filters.PHOTO, handle_after_photos),
                MessageHandler(filters.Regex(r'^(💾 FINALIZAR Y GUARDAR|💾 FINALIZAR Y GUARDAR TODO)$'), show_extended_final_summary),
                MessageHandler(filters.Regex(r'^⬅️ VOLVER A FOTOS DEL ANTES$'), go_back_to_before_photos),
            ],
            SELECTING_EXHIBICIONES_PHOTOS: [
                MessageHandler(filters.PHOTO, handle_exhibiciones_photos),
                MessageHandler(filters.Regex(r'^(💾 FINALIZAR Y GUARDAR TODO|💾 GUARDAR Y FINALIZAR TODO)$'), show_complete_summary),
                MessageHandler(filters.Regex(r'^⬅️ VOLVER AL RESUMEN$'), show_extended_final_summary),
            ],
            SELECTING_PRICE_PHOTOS: [
                MessageHandler(filters.PHOTO, handle_price_photos),
                MessageHandler(filters.Regex(r'^(💾 FINALIZAR Y GUARDAR TODO|💾 GUARDAR Y FINALIZAR TODO)$'), show_complete_summary),
                MessageHandler(filters.Regex(r'^⬅️ VOLVER AL RESUMEN$'), show_extended_final_summary),
            ],
            FINISH_MESSAGE: [MessageHandler(filters.TEXT & ~filters.COMMAND, finish_gestion)]
        },
        fallbacks=[CommandHandler('cancel', cancel)],
        allow_reentry=True
    )
    application.add_handler(conv_handler)
    application.add_handler(CommandHandler('help', help_command))
    application.add_error_handler(error_handler)
    print("✅ Bot activo. Usa /start para iniciar.")
    
    # Ejecutar el polling con un timeout más largo para getUpdates
    application.run_polling(
        poll_interval=1.0,   # Intervalo entre solicitudes de getUpdates
        timeout=30           # Tiempo de espera para getUpdates
    )

if __name__ == '__main__':
    # Evitar múltiples instancias
    lock = FileLock("bot.lock", timeout=1)
    try:
        with lock:
            main()
    except TimeoutError:
        print("⚠️ Another instance is already running. Exiting.")
        sys.exit(1)