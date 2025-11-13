# handlers/client_handler.py
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ContextTypes, ConversationHandler
from handlers.start_handler import start  
from database import DatabaseManager  
from states import SELECTING_CLIENTE, FINAL_CONFIRMATION, CONFIRM_CLIENT_SELECTION
from handlers.auxiliary import go_back_to_poi
from datetime import datetime  
import logging  

# Configurar logger
logger = logging.getLogger(__name__)

#=================================================================================================================================================================================
# =========================================================================== SELECCIÓN DE CLIENTE ==============================================================================
#================================================================================================================================================================================

async def handle_cliente_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Selecciona un cliente desde la tabla CLIENTES"""
    try:
        db = DatabaseManager()
        clientes = [row[0] for row in db.execute_query(
            'SELECT DISTINCT cliente FROM dbo.CLIENTES ORDER BY cliente')]
        if not clientes:
            await update.message.reply_text("ℹ️ No hay clientes registrados.")
            return ConversationHandler.END
        
        # Crear botones organizados en filas de 3
        botones = []
        for i in range(0, len(clientes), 3):
            fila = clientes[i:i + 3]
            botones.append([KeyboardButton(c) for c in fila])
        
        # Agregar botones de acción
        botones.append(["🏠 INICIO", "🔙 VOLVER A PUNTO DE INTERÉS"])
        
        # Mensaje único para selección de cliente
        await update.message.reply_text(
            "👥 *SELECCIONA UN CLIENTE:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
        )
        return SELECTING_CLIENTE
    except Exception as e:
        logger.error(f"Error al cargar clientes: {str(e)}")
        await update.message.reply_text("⚠️ Error al cargar clientes. Usa /start para reiniciar.")
        return SELECTING_CLIENTE

#=================================================================================================================================================================================
# ========================================================================== CONFIRMACIÓN FINAL ANTES DE FOTOS ===================================================================
#=================================================================================================================================================================================

async def handle_cliente_selected(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Guarda el cliente seleccionado y pide confirmación"""
    cliente = update.message.text
    
    # Manejar botones especiales
    if cliente == "🏠 INICIO":
        return await start(update, context)
    elif cliente == "🔙 VOLVER A PUNTO DE INTERÉS":
        return await go_back_to_poi(update, context)
    
    # Guardar cliente y pedir confirmación
    context.user_data['cliente'] = cliente
    
    buttons = [
        [KeyboardButton("✅ Confirmar cliente")],
        [KeyboardButton("🔁 Cambiar cliente")]
    ]
    
    await update.message.reply_text(
        f"👥 ¿Confirmar cliente: *{cliente}*?",
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
    )
    return CONFIRM_CLIENT_SELECTION


async def handle_client_confirmation(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja la confirmación del cliente seleccionado"""
    response = update.message.text
    
    if response == "✅ Confirmar cliente":
        # Mostrar resumen completo antes de continuar
        nombre = context.user_data.get('nombre', 'No proporcionado')
        depto = context.user_data.get('departamento', 'No seleccionado')
        ciudad = context.user_data.get('ciudad', 'No seleccionada')
        poi = context.user_data.get('punto_interes', 'No seleccionado')
        cliente = context.user_data.get('cliente', 'No seleccionado')
        
        now = datetime.now().strftime("📅 %d/%m/%Y - ⏰ %H:%M")
        summary = (
            "📄 *Resumen FINAL de tu selección:*\n"
            f"👤 Nombre: {nombre}\n"
            f"🏢 Departamento: {depto}\n"
            f"🏙️ Ciudad: {ciudad}\n"
            f"📍 Punto de Interés: {poi}\n"
            f"👥 Cliente: {cliente}\n"
            f"{now}\n"
            "¿Deseas continuar definitivamente?"
        )
        buttons = [[KeyboardButton("✅ Sí"), KeyboardButton("❌ No")]]
        await update.message.reply_text(
            summary,
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
        )
        return FINAL_CONFIRMATION
    
    elif response == "🔁 Cambiar cliente":
        # Volver a seleccionar cliente
        context.user_data.pop('cliente', None)
        return await handle_cliente_selection(update, context)
    
    else:
        await update.message.reply_text("Por favor, selecciona una opción válida.")
        return CONFIRM_CLIENT_SELECTION