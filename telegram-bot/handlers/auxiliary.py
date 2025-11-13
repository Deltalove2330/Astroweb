# handlers/auxiliary.py
from telegram import Update, ReplyKeyboardRemove, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler
from database import DatabaseManager
from handlers.start_handler import  start_departamentos
from states import SELECTING_CIUDAD, SELECTING_POI, CONFIRM_POI_SELECTION, SELECTING_MAIN_MENU
import logging

# Configura el logger
logger = logging.getLogger(__name__)

async def go_back_to_deptos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Vuelve a selección de departamentos manteniendo datos básicos"""
    # Limpiar solo datos de ubicación
    context.user_data.pop('departamento', None)
    context.user_data.pop('ciudad', None)
    context.user_data.pop('punto_interes', None)
    context.user_data.pop('cliente', None)
    
    await update.message.reply_text("🔄 Volviendo a seleccionar departamento...")
    return await start_departamentos(update, context)

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.message.reply_text("❌ Operación cancelada.")
    return ConversationHandler.END

# === Función: help_command ===
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Muestra ayuda sobre cómo usar el bot"""
    help_text = """
🤖 *Bot de Registro de Visitas* 🤖
Comandos disponibles:
/start - Inicia el proceso de registro
/cancel - Cancela el proceso actual
/help - Muestra esta ayuda
Flujo del bot:
1. Ingresa tu nombre
2. Selecciona departamento, ciudad y punto de interés
3. Confirma los datos
4. Selecciona un cliente
5. Envía fotos (todas las que necesites)
6. Confirma para finalizar
Durante el proceso puedes usar:
/continuar - Para pasar a la siguiente etapa
"""
    await update.message.reply_text(help_text, parse_mode="Markdown")

async def go_back_to_ciudad(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Vuelve a seleccionar la ciudad manteniendo el departamento"""
    context.user_data.pop('ciudad', None)
    context.user_data.pop('punto_interes', None)
    
    departamento = context.user_data.get('departamento')
    try:
        db = DatabaseManager()
        ciudades = [row[0] for row in db.execute_query(
            'SELECT DISTINCT ciudad FROM dbo.PUNTOS_INTERES1 WHERE departamento = ? ORDER BY ciudad', departamento)]
        
        botones = []
        for i in range(0, len(ciudades), 3):
            fila = ciudades[i:i + 3]
            botones.append([KeyboardButton(c) for c in fila])
        
        # Añadir opción para cambiar departamento
        botones.append(["🏢 CAMBIAR DEPARTAMENTO"])
        
        await update.message.reply_text(
            f"🏙️ *CIUDADES EN {departamento.upper()}:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
        )
        return SELECTING_CIUDAD
    except Exception as e:
        logger.error(f"Error al cargar ciudades: {str(e)}")
        await update.message.reply_text("⚠️ Error al cargar ciudades. Usa /start si necesitas reiniciar.")
        return SELECTING_CIUDAD


async def go_back_to_poi(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Vuelve a selección de POI manteniendo ubicación"""
    context.user_data.pop('punto_interes', None)
    context.user_data.pop('cliente', None)
    return await load_and_show_pois(update, context)
    

PREV_PAGE = "◀️ Anterior"
NEXT_PAGE = "▶️ Siguiente"
ITEMS_PER_PAGE = 100  # Número de POIs por página
async def show_poi_page(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra una página de POIs con botones de navegación (versión centralizada)"""
    all_pois = context.user_data.get('all_pois', [])
    current_page = context.user_data.get('current_poi_page', 0)
    total_pages = (len(all_pois) + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE
    
    # Calcular rango de POIs a mostrar
    start_idx = current_page * ITEMS_PER_PAGE
    end_idx = start_idx + ITEMS_PER_PAGE
    page_pois = all_pois[start_idx:end_idx]
    
    # Crear botones para los POIs de la página actual
    botones = []
    for i in range(0, len(page_pois), 3):
        fila = page_pois[i:i + 3]
        botones.append([KeyboardButton(p) for p in fila])
    
    # Añadir botones de navegación
    nav_buttons = []
    if current_page > 0:
        nav_buttons.append(PREV_PAGE)
    if current_page < total_pages - 1:
        nav_buttons.append(NEXT_PAGE)
    
    if nav_buttons:
        botones.append(nav_buttons)
    
    # Añadir opciones de navegación (siempre visibles)
    botones.append(["🏢 CAMBIAR DEPARTAMENTO", "🏙️ CAMBIAR CIUDAD"])
    
    ciudad = context.user_data.get('ciudad', 'desconocida')
    await update.message.reply_text(
        f"📍 *PUNTOS DE INTERÉS EN {ciudad.upper()} (Página {current_page + 1}/{total_pages}):*",
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
    )
    return SELECTING_POI



async def load_and_show_pois(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Carga POIs para una ciudad y muestra la primera página"""
    ciudad = context.user_data.get('ciudad')
    try:
        db = DatabaseManager()
        all_pois = [row[0] for row in db.execute_query(
            'SELECT DISTINCT punto_de_interes FROM dbo.PUNTOS_INTERES1 WHERE ciudad = ?', ciudad)]
        
        if not all_pois:
            await update.message.reply_text(f"ℹ️ No hay puntos de interés en {ciudad}")
            return SELECTING_POI
        
        # Guardar y mostrar
        context.user_data['all_pois'] = all_pois
        context.user_data['current_poi_page'] = 0
        return await show_poi_page(update, context)
        
    except Exception as e:
        logger.error(f"Error al cargar POIs: {str(e)}", exc_info=True)
        await update.message.reply_text("⚠️ Error al cargar puntos de interés. Usa /start")
        return SELECTING_POI

async def error_handler(update: object, context: ContextTypes.DEFAULT_TYPE) -> None:
    logger.error("Exception while handling an update:", exc_info=context.error)
    
    # Solo intentar enviar mensaje si tenemos un chat_id
    chat_id = None
    if update and isinstance(update, Update):
        if update.message:
            chat_id = update.message.chat_id
        elif update.callback_query and update.callback_query.message:
            chat_id = update.callback_query.message.chat_id
    
    if chat_id:
        try:
            # Intentar enviar con timeout reducido
            await context.bot.send_message(
                chat_id=chat_id,
                text="⚠️ Error temporal. Por favor intenta de nuevo en un momento.",
                timeout=10  # Timeout más corto
            )
        except Exception as e:
            logger.error(f"Failed to send error message: {e}")

async def confirm_poi_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Confirma el POI antes de mostrar el resumen final"""
    poi = context.user_data.get('punto_interes', 'No seleccionado')
    
    buttons = [[KeyboardButton("✅ Sí"), KeyboardButton("📍 CAMBIAR PUNTO DE INTERÉS")]]
    await update.message.reply_text(
        f"📍 ¿Confirmar Punto de Interés: *{poi}*?",
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
    )
    return CONFIRM_POI_SELECTION  

async def show_main_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra el menú principal con opciones de rutas"""
    # Limpiar datos específicos de rutas pero mantener cédula
    context.user_data.pop('id_ruta', None)
    context.user_data.pop('ruta_nombre', None)
    context.user_data.pop('puntos_interes_ruta', None)
    context.user_data.pop('puntos_interes_nombres', None)
    context.user_data.pop('id_punto_interes', None)
    context.user_data.pop('punto_interes', None)
    
    buttons = [
        [KeyboardButton("🛣️ Realizar Rutas")],
        [KeyboardButton("✏️ PDV Nuevo")],
        [KeyboardButton("🏠 Inicio")]
    ]
    await update.message.reply_text(
        "🏠 *MENÚ PRINCIPAL:*",
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True, one_time_keyboard=False)
    )
    return SELECTING_MAIN_MENU