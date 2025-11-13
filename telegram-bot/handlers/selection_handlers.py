# handlers/selection_handlers.py
from telegram import Update, ReplyKeyboardRemove, ReplyKeyboardMarkup, KeyboardButton
from telegram.ext import ContextTypes
from database import DatabaseManager
from states import SELECTING_DEPTO, SELECTING_CIUDAD, SELECTING_POI, CONFIRM_SELECTION, SELECTING_MAIN_MENU
from handlers.auxiliary import go_back_to_deptos, confirm_poi_selection, go_back_to_ciudad, load_and_show_pois
from handlers.ruta_handlers import handle_realizar_rutas
from handlers.start_handler import start_departamentos, ask_cedula
from datetime import datetime
import logging

# Configurar logger específico para este módulo
logger = logging.getLogger(__name__)

# --- FUNCIÓN AUXILIAR PARA TECLADO DE DEPTOS ---
def get_deptos_keyboard():
    """Devuelve teclado con departamentos válidos (función síncrona)"""
    try:
        db = DatabaseManager()
        departamentos = [depto[0] for depto in db.execute_query(
            'SELECT DISTINCT departamento FROM dbo.PUNTOS_INTERES1 ORDER BY departamento')]
        
        botones = []
        for i in range(0, len(departamentos), 3):
            fila = departamentos[i:i + 3]
            botones.append([KeyboardButton(depto) for depto in fila])
        
        return ReplyKeyboardMarkup(botones, resize_keyboard=True, one_time_keyboard=False)
    except Exception as e:
        logger.error(f"Error al obtener departamentos: {str(e)}")
        return None

# --- MANEJADOR DE SELECCIÓN DE DEPARTAMENTO ---
async def handle_depto_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja la selección de departamento y muestra ciudades, o inicia el flujo de rutas"""
    departamento = update.message.text
    try:
        # Manejar botón de volver al menú principal
        if departamento == "⬅️ Volver al Menú Principal":
            from handlers.auxiliary import show_main_menu
            return await show_main_menu(update, context)
        
        # Verificar si el usuario seleccionó "RUTAS"
        db = DatabaseManager()
        departamentos_validos = [row[0] for row in db.execute_query('SELECT DISTINCT departamento FROM dbo.PUNTOS_INTERES1 ORDER BY departamento')]
        
        # Verificar si el departamento es válido
        if departamento not in departamentos_validos:
            keyboard = get_deptos_keyboard()  # Llamada sincrónica
            if keyboard:
                await update.message.reply_text("❌ Departamento no válido. Por favor selecciona uno de la lista.",
                    reply_markup=keyboard)
            else:
                await update.message.reply_text("❌ Departamento no válido. Usa /start para ver las opciones.")
            return SELECTING_DEPTO
        
        context.user_data['departamento'] = departamento
        
        # Consulta corregida: paréntesis cerrados correctamente
        ciudades = [ciudad[0] for ciudad in db.execute_query(
            'SELECT DISTINCT ciudad FROM dbo.PUNTOS_INTERES1 WHERE departamento = ? ORDER BY ciudad', 
            departamento)]
        
        if not ciudades:
            await update.message.reply_text(f"ℹ️ No hay ciudades en {departamento}")
            return SELECTING_DEPTO
        
        # Crear botones para ciudades
        botones = []
        for i in range(0, len(ciudades), 3):
            fila = ciudades[i:i + 3]
            botones.append([KeyboardButton(ciudad) for ciudad in fila])
        
        botones.append(["🏢 CAMBIAR DEPARTAMENTO"])
        
        await update.message.reply_text(f"🏙️ *CIUDADES EN {departamento.upper()}:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True))
        return SELECTING_CIUDAD
    except Exception as e:
        logger.error(f"Error al manejar departamento: {str(e)}")
        await update.message.reply_text("⚠️ Error al cargar ciudades. Usa /start si necesitas reiniciar.")
        return SELECTING_DEPTO

# --- MANEJADOR DE CONTENIDO NO TEXTO EN DEPARTAMENTOS ---
async def handle_non_text_in_depto(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja mensajes no-texto durante la selección de departamento"""
    # Mensajes de error específicos por tipo de contenido
    content_type_errors = {
        'photo': "❌ Por favor, selecciona un departamento de la lista. No envíes fotos.",
        'document': "❌ Por favor, selecciona un departamento de la lista. No envíes documentos.",
        'audio': "❌ Por favor, selecciona un departamento de la lista. No envíes audios.",
        'voice': "❌ Por favor, selecciona un departamento de la lista. No envíes notas de voz.",
        'video': "❌ Por favor, selecciona un departamento de la lista. No envíes videos.",
        'location': "❌ Por favor, selecciona un departamento de la lista. No envíes ubicaciones.",
        'contact': "❌ Por favor, selecciona un departamento de la lista. No envíes contactos."
    }
    
    # Determinar tipo de contenido
    error_msg = "❌ Formato no válido. Por favor, selecciona un departamento de la lista."
    for content_type, msg in content_type_errors.items():
        if getattr(update.message, content_type, None):
            error_msg = msg
            break
    
    try:
        keyboard = get_deptos_keyboard()  # Llamada sincrónica
        if keyboard:
            await update.message.reply_text(
                f"{error_msg}\n\n🏢 *SELECCIONA UN DEPARTAMENTO:*",
                parse_mode="Markdown",
                reply_markup=keyboard
            )
        else:
            await update.message.reply_text(
                f"{error_msg}\n\n⚠️ Error al cargar departamentos. Usa /start para reiniciar."
            )
    except Exception as e:
        logger.error(f"Error al recargar departamentos: {str(e)}")
        await update.message.reply_text(
            f"{error_msg}\n\n⚠️ Error técnico. Usa /start para reiniciar."
        )
    
    return SELECTING_DEPTO

# --- MANEJADOR DE CONTENIDO NO TEXTO EN CIUDADES ---
async def handle_non_text_in_ciudad(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja mensajes no-texto durante la selección de ciudad"""
    if update.message.photo:
        error_msg = "❌ Por favor, selecciona una ciudad de la lista. No envíes fotos."
    elif update.message.document:
        error_msg = "❌ Por favor, selecciona una ciudad de la lista. No envíes documentos."
    elif update.message.audio:
        error_msg = "❌ Por favor, selecciona una ciudad de la lista. No envíes audios."
    elif update.message.video:
        error_msg = "❌ Por favor, selecciona una ciudad de la lista. No envíes videos."
    elif update.message.location:
        error_msg = "❌ Por favor, selecciona una ciudad de la lista. No envíes ubicaciones."
    else:
        error_msg = "❌ Formato no válido. Por favor, selecciona una ciudad de la lista."
    
    departamento = context.user_data.get('departamento')
    
    try:
        db = DatabaseManager()
        ciudades = [ciudad[0] for ciudad in db.execute_query(
            'SELECT DISTINCT ciudad FROM dbo.PUNTOS_INTERES1 WHERE departamento = ? ORDER BY ciudad', departamento)]
        
        if not ciudades:
            await update.message.reply_text(f"ℹ️ No hay ciudades en {departamento}")
            return SELECTING_DEPTO
        
        botones = []
        for i in range(0, len(ciudades), 3):
            fila = ciudades[i:i + 3]
            botones.append([KeyboardButton(ciudad) for ciudad in fila])
        botones.append(["🏢 CAMBIAR DEPARTAMENTO"])
        
        await update.message.reply_text(
            f"{error_msg}\n\n🏙️ *CIUDADES EN {departamento.upper()}:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
        )
    except Exception as e:
        logger.error(f"Error al recargar ciudades: {str(e)}", exc_info=True)
        await update.message.reply_text(
            f"{error_msg}\n\n⚠️ Error al cargar ciudades. Usa /start para reiniciar."
        )
    
    return SELECTING_CIUDAD

# --- RESTA DEL CÓDIGO IGUAL ---
# Constantes para botones de paginación
PREV_PAGE = "◀️ Anterior"
NEXT_PAGE = "▶️ Siguiente"
ITEMS_PER_PAGE = 100  # Número de POIs por página

async def handle_ciudad_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja selección de ciudad y carga POIs"""
    ciudad = update.message.text
    if ciudad == "🏢 CAMBIAR DEPARTAMENTO":
        return await go_back_to_deptos(update, context)
    
    context.user_data['ciudad'] = ciudad
    return await load_and_show_pois(update, context)
    
    
async def show_poi_page(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra una página de POIs con botones de navegación"""
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

async def handle_poi_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja selección de POI y paginación"""
    user_input = update.message.text
    
    # Manejar navegación entre páginas
    if user_input == PREV_PAGE:
        context.user_data['current_poi_page'] -= 1
        return await show_poi_page(update, context)
    elif user_input == NEXT_PAGE:
        context.user_data['current_poi_page'] += 1
        return await show_poi_page(update, context)
    
    # Manejar botones de navegación
    if user_input == "🏢 CAMBIAR DEPARTAMENTO":
        return await go_back_to_deptos(update, context)
    elif user_input == "🏙️ CAMBIAR CIUDAD":
        return await go_back_to_ciudad(update, context)
    
    # Manejar selección de POI
    ciudad = context.user_data.get('ciudad', 'desconocida')
    try:
        # Verificar si el POI está en la lista
        all_pois = context.user_data.get('all_pois', [])
        if user_input in all_pois:
            context.user_data['punto_interes'] = user_input
            return await confirm_poi_selection(update, context)
        
        # Búsqueda si no coincide exactamente
        db = DatabaseManager()
        resultados = [row[0] for row in db.execute_query(
            'SELECT DISTINCT punto_de_interes FROM dbo.PUNTOS_INTERES1 '
            'WHERE ciudad = ? AND punto_de_interes LIKE ?',
            (ciudad, f'%{user_input}%'))]
        
        if not resultados:
            await update.message.reply_text("🔍 No se encontraron coincidencias.")
            return SELECTING_POI
        
        # Actualizar y mostrar resultados
        context.user_data['all_pois'] = resultados
        context.user_data['current_poi_page'] = 0
        return await show_poi_page(update, context)
        
    except Exception as e:
        logger.error(f"Error al filtrar POIs: {str(e)}")
        await update.message.reply_text("⚠️ Error al filtrar. Usa /start si necesitas reiniciar.")
        return SELECTING_POI

async def confirm_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra el resumen y pregunta si desea continuar o cambiar el POI"""
    # Obtén los datos del usuario
    nombre = context.user_data.get('nombre', 'No proporcionado')
    depto = context.user_data.get('departamento', 'No seleccionado')
    ciudad = context.user_data.get('ciudad', 'No seleccionada')
    poi = context.user_data.get('punto_interes', 'No seleccionado')
    now = datetime.now().strftime("📅 %d/%m/%Y - ⏰ %H:%M")

    # Construye el resumen explícitamente
    summary = (
        "📄 *Resumen de tu selección:*\n"
        f"👤 Nombre: {nombre}\n"
        f"🏢 Departamento: {depto}\n"
        f"🏙️ Ciudad: {ciudad}\n"
        f"📍 Punto de Interés: {poi}\n"
        f"{now}\n"
        "¿Deseas continuar?"
    )

    # Botones de confirmación
    buttons = [
        [KeyboardButton("✅ Sí"), KeyboardButton("📍 CAMBIAR PUNTO DE INTERÉS")]
    ]
    
    await update.message.reply_text(
        summary,
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
    )
    return CONFIRM_SELECTION


async def handle_main_menu_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    txt = update.message.text
    if txt == "🛣️ Realizar Rutas":
        from handlers.ruta_handlers import handle_realizar_rutas
        return await handle_realizar_rutas(update, context)
    if txt == "✏️ PDV Nuevo":
        from handlers.start_handler import start_departamentos
        return await start_departamentos(update, context)
    if txt == "🏠 Inicio":  # CORREGIDO: Ahora usa "🏠 Inicio"
        from handlers.start_handler import ask_cedula
        return await ask_cedula(update, context)
    await update.message.reply_text("❌ Opción no válida.")
    return SELECTING_MAIN_MENU