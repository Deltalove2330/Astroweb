# handlers/start_handler.py
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup, ReplyKeyboardRemove 
import pyodbc
from telegram.ext import ContextTypes, ConversationHandler
from states import ASK_CEDULA, SELECTING_DEPTO, SELECTING_MAIN_MENU
from database import DatabaseManager
import logging

# Configurar logger específico para este módulo
logger = logging.getLogger(__name__)

#===========================================================================================================================================================================
# ================================================================ FLUJO PRINCIPAL: INICIO Y PREGUNTAR CÉDULA =============================================================
#===========================================================================================================================================================================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Inicia el bot y pasa a preguntar la cédula"""
    context.user_data.clear()
    return await ask_cedula(update, context)

async def ask_cedula(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Pregunta la cédula del usuario al inicio"""
    await update.message.reply_text(
        "🔢 Por favor, ingresa tu número de cédula:",
        reply_markup=ReplyKeyboardRemove()
    )
    return ASK_CEDULA

async def handle_cedula(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    # Manejar diferentes tipos de contenido no válidos
    if update.message.photo:
        await update.message.reply_text(
            "❌ Por favor, ingresa tu cédula como texto. No envíes fotos.\n"
            "Ejemplo: 12345678"
        )
        return ASK_CEDULA
    
    if update.message.document or update.message.audio or update.message.video:
        await update.message.reply_text(
            "❌ Formato no válido. Por favor, ingresa tu cédula como texto.\n"
            "Ejemplo: 12345678"
        )
        return ASK_CEDULA
    
    # Validar que sea mensaje de texto
    if not update.message.text:
        await update.message.reply_text(
            "❌ Solo se permiten mensajes de texto. Por favor, ingresa tu cédula como números.\n"
            "Ejemplo: 12345678"
        )
        return ASK_CEDULA
    
    cedula = update.message.text.strip()
    
    # Validación de formato (solo números y longitud correcta)
    if not cedula.isdigit():
        await update.message.reply_text(
            "❌ La cédula debe contener solo números. Ejemplo: 12345678"
        )
        return ASK_CEDULA

    if len(cedula) < 7 or len(cedula) > 8:  # Ajusta según tu formato
        await update.message.reply_text(
            "❌ La cédula debe tener entre 7 y 8 dígitos. Ejemplo: 12345678"
        )
        return ASK_CEDULA

    try:
        db = DatabaseManager()
        resultados = db.execute_query(
            'SELECT nombre FROM dbo.MERCADERISTAS WHERE cedula = ?', 
            (cedula,)
        )
        
        if resultados:
            nombre = resultados[0][0]
            context.user_data.update({'cedula': cedula, 'nombre': nombre})

        # - MENÚ PRINCIPAL -
            buttons = [
        [KeyboardButton("🛣️ Realizar Rutas")],
        [KeyboardButton("✏️ PDV Nuevo")],
        [KeyboardButton("🏠 Inicio")]
    ]
        await update.message.reply_text(
            f"👋 ¡Hola, {nombre}! ¿Qué acción deseas realizar?",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True)
        )
        return SELECTING_MAIN_MENU
        
        await update.message.reply_text(
            "❌ No se encontró un mercaderista con esta cédula.\n"
            "Verifica que el número sea correcto e inténtalo nuevamente."
        )
        return ASK_CEDULA

    except pyodbc.Error as e:  # Excepción específica para tu base de datos
        logger.error(f"Error de base de datos: {str(e)}")
        await update.message.reply_text(
            "⚠️ Error técnico al verificar tu cédula. Por favor, inténtalo nuevamente."
        )
        return ASK_CEDULA

    except Exception as e:
        logger.error(f"Error inesperado: {str(e)}", exc_info=True)
        await update.message.reply_text(
            "⚠️ Ocurrió un error inesperado. Por favor, inténtalo nuevamente."
        )
        return ASK_CEDULA

async def handle_non_text_in_cedula(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja mensajes no-texto durante la solicitud de cédula"""
    if update.message.photo:
        error_msg = "❌ Por favor, ingresa tu cédula como texto. No envíes fotos."
    elif update.message.document:
        error_msg = "❌ Por favor, ingresa tu cédula como texto. No envíes documentos."
    elif update.message.audio:
        error_msg = "❌ Por favor, ingresa tu cédula como texto. No envíes audios."
    elif update.message.video:
        error_msg = "❌ Por favor, ingresa tu cédula como texto. No envíes videos."
    else:
        error_msg = "❌ Formato no válido. Por favor, ingresa tu cédula como texto."
    
    await update.message.reply_text(
        f"{error_msg}\n\nEjemplo: 12345678",
        reply_markup=ReplyKeyboardRemove()
    )
    return ASK_CEDULA

#============================================================================================================================================================================
# ======================================================================== SELECCIÓN DE DEPARTAMENTO ========================================================================
#============================================================================================================================================================================
async def start_departamentos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Empieza con la selección de departamentos o rutas"""
    try:
        # Verificar que tenemos la cédula
        if 'cedula' not in context.user_data:
            return await ask_cedula(update, context)
            
        db = DatabaseManager()
        departamentos = [depto[0] for depto in db.execute_query('SELECT DISTINCT departamento FROM dbo.PUNTOS_INTERES1 ORDER BY departamento')]
        if not departamentos:
            await update.message.reply_text("ℹ️ No hay departamentos registrados.")
            return ConversationHandler.END
        
        # Crear botones de 3 en 3
        botones = []
        for i in range(0, len(departamentos), 3):
            fila = departamentos[i:i + 3]
            botones.append([KeyboardButton(depto) for depto in fila])
        
        # Añadir botón para volver al menú principal
        botones.append(["⬅️ Volver al Menú Principal"])
        
        await update.message.reply_text("🏢 *SELECCIONA UN DEPARTAMENTO:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True, one_time_keyboard=False))
        return SELECTING_DEPTO
    except Exception as e:
        logger.error(f"Error al cargar departamentos: {str(e)}")
        await update.message.reply_text("⚠️ Error al cargar departamentos. Usa /start para reiniciar.")
        return SELECTING_MAIN_MENU