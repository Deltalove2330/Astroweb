# handlers/photo_handler.py
from telegram import Update, ReplyKeyboardRemove, KeyboardButton, ReplyKeyboardMarkup  
from telegram.ext import ContextTypes, ConversationHandler
from states import SELECTING_BEFORE_PHOTOS, SELECTING_AFTER_PHOTOS, FINISH_MESSAGE
from utils import generate_photo_path
from database import DatabaseManager  
from handlers.auxiliary import go_back_to_deptos
from handlers.start_handler import start
from datetime import datetime  
from utils import calculate_photo_hash
import logging  
import os
import hashlib  # Importar para calcular el hash
from handlers.client_handler import handle_cliente_selection
from states import (
    FINISH_MESSAGE,
    FINAL_CONFIRMATION,
    SELECTING_MAIN_MENU,
    SELECTING_PUNTO_INTERES_RUTA
)
logger = logging.getLogger(__name__)


async def show_final_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Inicia el proceso de carga de fotos del ANTES con botones"""
    response = update.message.text
    if response == "✅ Sí":
        context.user_data['fotos_antes'] = {}
        context.user_data['fotos_despues'] = {}
        
        # Inicialmente no mostrar botón para pasar a después
        buttons = []
        
        await update.message.reply_text(
            "📷 *FASE 1: Fotos del ANTES de la gestión*\n"
            "Envía las fotos del estado inicial del punto.\n"
            "Puedes enviar varias en un mismo mensaje.\n"
            "⚠️ Debes enviar al menos una foto para poder continuar.",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True)
        )
        return SELECTING_BEFORE_PHOTOS
    elif response == "❌ No":
        # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        # CORRECCIÓN: Verificar si estamos en el flujo de rutas
        # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        if 'id_ruta' in context.user_data or 'ruta_nombre' in context.user_data:
            # Obtener punto de interés actual
            punto_interes = context.user_data.get('punto_interes')
            if punto_interes:
                # Almacenar temporalmente el punto de interés para que el manejador lo use
                context.user_data['_reselect_punto_interes'] = punto_interes
                
                # MOSTRAR DIRECTAMENTE LOS CLIENTES PARA EL PUNTO DE INTERÉS
                from handlers.ruta_handlers import handle_punto_interes_ruta
                return await handle_punto_interes_ruta(update, context)
            else:
                await update.message.reply_text(
                    "❌ Error: No se encontró el punto de interés. Usa /start para reiniciar."
                )
                return SELECTING_MAIN_MENU
        else:
            # Limpiar datos de ubicación pero mantener nombre y cédula
            context.user_data.pop('departamento', None)
            context.user_data.pop('ciudad', None)
            context.user_data.pop('punto_interes', None)
            context.user_data.pop('cliente', None)
            
            # Volver a selección de departamentos
            return await go_back_to_deptos(update, context)
    else:
        await update.message.reply_text("Por favor, selecciona '✅ Sí' o '❌ No'.")
        return FINAL_CONFIRMATION

async def handle_before_photos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja fotos del ANTES de la gestión"""
    return await handle_photos(update, context, 'fotos_antes', SELECTING_BEFORE_PHOTOS, "antes")

async def handle_after_photos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja fotos del DESPUÉS de la gestión"""
    return await handle_photos(update, context, 'fotos_despues', SELECTING_AFTER_PHOTOS, "despues")


async def handle_photos(update: Update, context: ContextTypes.DEFAULT_TYPE, 
                       key: str, next_state: int, tipo: str) -> int:
    """Función genérica para manejar fotos de cualquier fase (solo la de mayor resolución)"""
    if not update.message.photo:
        await update.message.reply_text(f"Por favor, envía una o más fotos del {tipo}.")
        return next_state
    
    if key not in context.user_data:
        context.user_data[key] = {}
    
    # Determinar la otra fase
    other_key = 'fotos_despues' if key == 'fotos_antes' else 'fotos_antes'
    other_tipo = "después" if tipo == "antes" else "antes"
    
    # Tomamos la foto de mayor resolución (la última en la lista)
    photo = update.message.photo[-1]
    unique_id = photo.file_unique_id

    new_photo_added = False
    is_duplicate = False
    duplicate_in_other_phase = False
    duplicate_phase = ""

    # Si ya fue guardada en la fase actual, marcamos como duplicada
    if unique_id in context.user_data[key]:
        is_duplicate = True
        duplicate_phase = tipo
    # Si no está en la fase actual, verificar si está en la otra fase
    elif other_key in context.user_data and unique_id in context.user_data[other_key]:
        is_duplicate = True
        duplicate_in_other_phase = True
        duplicate_phase = other_tipo

    if not is_duplicate:
        try:
            photo_dir = generate_photo_path(context, tipo)
        except Exception as e:
            logger.error(f"Error al generar ruta para fotos {tipo}: {str(e)}")
            await update.message.reply_text("⚠️ Error al preparar carpeta destino. Usa /start")
            return next_state

        try:
            file = await context.bot.get_file(photo.file_id)
            file_name = f"{tipo}_{unique_id}.jpg"
            file_path = os.path.join(photo_dir, file_name)

            await file.download_to_drive(file_path)
            
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            # CALCULAR EL HASH DE LA FOTO
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            photo_hash = calculate_photo_hash(file_path)
            
            if not photo_hash:
                await update.message.reply_text(
                    "⚠️ Error procesando la foto. Intenta nuevamente."
                )
                return next_state
            
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            # VERIFICAR SI EL HASH YA EXISTE EN LA BASE DE DATOS
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            db = DatabaseManager()
            existing_photo = db.execute_query(
                "SELECT id_foto FROM dbo.FOTOS_TOTALES WHERE hash_foto = ?",
                (photo_hash,)
            )
            
            if existing_photo:
                # Eliminar la foto descargada ya que es un duplicado
                os.remove(file_path)
                await update.message.reply_text(
                    "⚠️ Esta foto ya fue procesada anteriormente. Por favor, envía una foto diferente."
                )
                return next_state

            context.user_data[key][unique_id] = {
                "file_id": photo.file_id,
                "file_path": file_path,
                "tipo": tipo,
                "hash": photo_hash  # Guardar el hash
            }
            new_photo_added = True
        except Exception as e:
            logger.error(f"Error al descargar foto {tipo} {unique_id}: {str(e)}")

    # Mostrar botones después de procesar la foto
    return await show_buttons_after_photo(
        update, context, tipo, key, next_state, 
        new_photo_added, is_duplicate, duplicate_in_other_phase, duplicate_phase
    )


async def show_buttons_after_photo(update: Update, context: ContextTypes.DEFAULT_TYPE, 
                                  tipo: str, key: str, next_state: int, 
                                  new_photo_added: bool, is_duplicate: bool,
                                  duplicate_in_other_phase: bool = False,
                                  duplicate_phase: str = "") -> int:
    """Muestra los botones después de procesar una foto"""
    total = len(context.user_data[key])
    
    # Preparar botones según la fase
    if tipo == "antes":
        # Solo mostrar botón para pasar a después si hay al menos una foto
        buttons = []
        if total > 0:
            buttons.append([KeyboardButton("➡️ PASAR A FOTOS DEL DESPUÉS")])
    else:  # tipo == "despues"
        # Solo mostrar botón para finalizar si hay al menos una foto
        buttons = []
        if total > 0:
            buttons.append([KeyboardButton("💾 FINALIZAR Y GUARDAR")])
        buttons.append([KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")])
    
    # Mensaje personalizado según el caso
    if is_duplicate:
        if duplicate_in_other_phase:
            msg = f"ℹ️ Esta foto ya fue procesada en el {duplicate_phase}. Total actual: {total}"
        else:
            msg = f"ℹ️ Esta foto del {tipo} ya fue procesada. Total actual: {total}"
    elif new_photo_added:
        msg = f"📸 1 foto del {tipo} descargada correctamente.\n✅ Total en esta fase: {total}"
    else:
        msg = f"ℹ️ No se añadieron nuevas fotos del {tipo}. Total actual: {total}"
    
    await update.message.reply_text(
        msg,
        reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True) if buttons else None
    )
    
    return next_state


async def request_after_photos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Solicita fotos del DESPUÉS con botones para volver o finalizar"""
    # Verificar que hay al menos una foto del antes
    if 'fotos_antes' not in context.user_data or len(context.user_data['fotos_antes']) == 0:
        # Volver a fotos del antes si no hay fotos
        buttons = []
        await update.message.reply_text(
            "⚠️ Debes subir al menos una foto del ANTES antes de pasar al DESPUÉS.",
            reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True)
        )
        return SELECTING_BEFORE_PHOTOS

    # Botones para la fase de fotos del después
    total_despues = len(context.user_data.get('fotos_despues', {}))
    total_antes = len(context.user_data['fotos_antes'])
    buttons = []
    
    # Solo mostrar botón para finalizar si hay al menos una foto y las cantidades coinciden
    if total_despues > 0 and total_despues == total_antes:
        buttons.append([KeyboardButton("💾 FINALIZAR Y GUARDAR")])
    
    # Si hay más fotos del después que del antes, mostrar advertencia
    if total_despues > total_antes:
        await update.message.reply_text(
            f"⚠️ Tienes {total_despues} fotos del DESPUÉS pero solo {total_antes} del ANTES.\n"
            f"Debes tener el mismo número de fotos en ambas fases.",
            parse_mode="Markdown"
        )
    
    buttons.append([KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")])
    
    message = (
        f"📷 *FASE 2: Fotos del DESPUÉS de la gestión* (ANTES: {total_antes} foto{'s' if total_antes != 1 else ''})\n"
        "Envía las fotos del resultado final de tu gestión."
    )
    
    await update.message.reply_text(
        message,
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True)
    )
    return SELECTING_AFTER_PHOTOS

async def show_final_summary(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra el resumen final con opciones para guardar"""
    total_antes = len(context.user_data.get('fotos_antes', {}))
    total_despues = len(context.user_data.get('fotos_despues', {}))
    
    summary = (
        "📷 *Resumen de fotos subidas:*\n"
        f"🟢 Fotos del ANTES: {total_antes}\n"
        f"🟡 Fotos del DESPUÉS: {total_despues}"
    )
    
    # Si no hay fotos del antes, mostrar error
    if total_antes == 0:
        summary += "\n\n⚠️ *ERROR: Debes enviar al menos una foto del ANTES para continuar.*"
        buttons = [
            [KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")]
        ]
    # Si no hay fotos del después, mostrar advertencia
    elif total_despues == 0:
        summary += "\n\n⚠️ *ADVERTENCIA: Debes enviar al menos una foto del DESPUÉS para guardar.*"
        buttons = [
            [KeyboardButton("➡️ PASAR A FOTOS DEL DESPUÉS")],
            [KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")]
        ]
    # Si las cantidades no coinciden, mostrar advertencia específica
    elif total_antes != total_despues:
        diferencia = abs(total_antes - total_despues)
        fase_faltante = "ANTES" if total_antes < total_despues else "DESPUÉS"
        
        summary += f"\n\n⚠️ *ADVERTENCIA: El número de fotos no coincide.*\n"
        summary += f"• Necesitas {diferencia} foto{'s' if diferencia > 1 else ''} más del {fase_faltante} para igualar.\n"
        summary += f"• Debes tener {max(total_antes, total_despues)} foto{'s' if max(total_antes, total_despues) > 1 else ''} en ambas fases."
        
        # Determinar a qué fase redirigir
        if total_antes < total_despues:
            buttons = [
                [KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")]
            ]
        else:
            buttons = [
                [KeyboardButton("➡️ PASAR A FOTOS DEL DESPUÉS")]
            ]
    # Si hay fotos en ambas fases y las cantidades coinciden, mostrar opciones completas
    else:
        summary += f"\n\n¿Deseas guardar el registro completo? ({total_antes} par{'es' if total_antes > 1 else ''} de fotos)"
        buttons = [
            [KeyboardButton("💾 Guardar y finalizar")],
            [KeyboardButton("❌ Cancelar todo")]
        ]
    
    await update.message.reply_text(
        summary,
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
    )
    return FINISH_MESSAGE


async def finish_gestion(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Finaliza el proceso guardando fotos de ambas fases y registrando la visita"""
    response = update.message.text
    total_antes = len(context.user_data.get('fotos_antes', {}))
    total_despues = len(context.user_data.get('fotos_despues', {}))

    # Añadir manejo específico para los botones de navegación
    if response == "⬅️ VOLVER A FOTOS DEL ANTES":
        return await go_back_to_before_photos(update, context)
    elif response == "➡️ PASAR A FOTOS DEL DESPUÉS":
        return await request_after_photos(update, context)
    
    # Continuar con el resto de la lógica
    if response == "💾 Guardar y finalizar":
        # Validación 1: deben haber fotos en ambas fases
        if total_antes == 0 or total_despues == 0:
            error_msg = "⚠️ *No se puede guardar el registro porque:*\n"
            if total_antes == 0:
                error_msg += "• Faltan fotos del *ANTES*\n"
            if total_despues == 0:
                error_msg += "• Faltan fotos del *DESPUÉS*\n"
            error_msg += "\n*Debes enviar al menos una foto en cada fase.*"
            
            # Configurar botones según qué fotos faltan
            if total_antes == 0:
                buttons = [
                    [KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")]
                ]
            else:  # total_antes > 0 pero total_despues == 0
                buttons = [
                    [KeyboardButton("➡️ PASAR A FOTOS DEL DESPUÉS")]
                ]
                
            await update.message.reply_text(
                error_msg,
                parse_mode="Markdown",
                reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
            )
            return FINISH_MESSAGE
        
        # Validación 2: las cantidades deben coincidir
        if total_antes != total_despues:
            error_msg = f"⚠️ *No se puede guardar el registro porque:*\n"
            error_msg += f"• Fotos del *ANTES*: {total_antes}\n"
            error_msg += f"• Fotos del *DESPUÉS*: {total_despues}\n"
            error_msg += "\n*El número de fotos debe coincidir en ambas fases.*"
            
            # Configurar botones según qué fase tiene menos fotos
            if total_antes < total_despues:
                error_msg += f"\n\n*Debes añadir {total_despues - total_antes} foto{'s' if total_despues - total_antes > 1 else ''} más del ANTES.*"
                buttons = [
                    [KeyboardButton("⬅️ VOLVER A FOTOS DEL ANTES")]
                ]
            else:
                error_msg += f"\n\n*Debes añadir {total_antes - total_despues} foto{'s' if total_antes - total_despues > 1 else ''} más del DESPUÉS.*"
                buttons = [
                    [KeyboardButton("➡️ PASAR A FOTOS DEL DESPUÉS")]
                ]
                
            await update.message.reply_text(
                error_msg,
                parse_mode="Markdown",
                reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
            )
            return FINISH_MESSAGE
            
        try:
            db = DatabaseManager()
            conn = db.get_connection()
            cursor = conn.cursor()

            # Obtener datos necesarios para la inserción
            cedula = context.user_data.get('cedula')
            cliente = context.user_data.get('cliente')
            punto_interes = context.user_data.get('punto_interes')
            fecha_visita = datetime.now()

            # Verificar que tenemos todos los datos necesarios
            if not all([cedula, cliente, punto_interes]):
                await update.message.reply_text(
                    "⚠️ Faltan datos esenciales para guardar el registro. Por favor inicia una nueva gestión con /start"
                )
                return FINISH_MESSAGE

            # Obtener id_mercaderista con manejo de errores
            cursor.execute(
                "SELECT id_mercaderista FROM dbo.MERCADERISTAS WHERE cedula = ?", 
                (cedula,)
            )
            mercaderista_row = cursor.fetchone()
            if not mercaderista_row:
                await update.message.reply_text(
                    f"❌ No se encontró un mercaderista con la cédula {cedula}. Contacta al administrador."
                )
                return FINISH_MESSAGE
            id_mercaderista = mercaderista_row[0]

            # Obtener id_cliente con manejo de errores
            cursor.execute(
                "SELECT id_cliente FROM dbo.CLIENTES WHERE cliente = ?", 
                (cliente,)
            )
            cliente_row = cursor.fetchone()
            if not cliente_row:
                await update.message.reply_text(
                    f"❌ No se encontró el cliente '{cliente}'. Verifica el nombre e intenta nuevamente."
                )
                return FINISH_MESSAGE
            id_cliente = cliente_row[0]

            # Obtener identificador_punto_interes con manejo de errores
            cursor.execute(
                "SELECT identificador FROM dbo.PUNTOS_INTERES1 WHERE punto_de_interes = ?", 
                (punto_interes,)
            )
            poi_row = cursor.fetchone()
            if not poi_row:
                await update.message.reply_text(
                    f"❌ No se encontró el punto de interés '{punto_interes}'. Verifica el nombre e intenta nuevamente."
                )
                return FINISH_MESSAGE
            identificador_punto_interes = poi_row[0]
            
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            # CORRECCIÓN: Determinar estado basado en prioridad
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
            prioridad = context.user_data.get('prioridad', 'Baja').lower()
            estado_visita = "No Revisado" if prioridad == 'baja' else "Pendiente"
            # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

            # Insertar en VISITAS_MERCADERISTA con el estado determinado
            cursor.execute("""
                INSERT INTO dbo.VISITAS_MERCADERISTA 
                (id_mercaderista, fecha_visita, estado, id_cliente, identificador_punto_interes)
                OUTPUT INSERTED.id_visita
                VALUES (?, ?, ?, ?, ?)
            """, (id_mercaderista, fecha_visita, estado_visita, id_cliente, identificador_punto_interes))
            
            # Obtener el id_visita recién creado
            visita_row = cursor.fetchone()
            if not visita_row:
                await update.message.reply_text("❌ Error al crear el registro de visita. Contacta al administrador.")
                return FINISH_MESSAGE
            id_visita = visita_row[0]

            # Guardar fotos del ANTES con el estado determinado y el hash
            fotos_antes = context.user_data.get('fotos_antes', {})
            for data in fotos_antes.values():
                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                # INSERTAR CON EL HASH DE LA FOTO
                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                cursor.execute("""
                    INSERT INTO FOTOS_TOTALES (id_visita, FILE_PATH, id_tipo_foto, FECHA_REGISTRO, Estado, hash_foto)
                    VALUES (?, ?, 1, ?, ?, ?)
                """, (id_visita, data["file_path"], datetime.now(), estado_visita, data["hash"]))

            # Guardar fotos del DESPUÉS con el estado determinado y el hash
            fotos_despues = context.user_data.get('fotos_despues', {})
            for data in fotos_despues.values():
                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                # INSERTAR CON EL HASH DE LA FOTO
                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                cursor.execute("""
                    INSERT INTO FOTOS_TOTALES (id_visita, FILE_PATH, id_tipo_foto, FECHA_REGISTRO, Estado, hash_foto)
                    VALUES (?, ?, 2, ?, ?, ?)
                """, (id_visita, data["file_path"], datetime.now(), estado_visita, data["hash"]))
                
            conn.commit()
            conn.close()

            # Mensaje de éxito
            await update.message.reply_text(
                "✅ Registro completo guardado exitosamente.\n"
                f"📸 Fotos del ANTES: {len(fotos_antes)}\n"
                f"📸 Fotos del DESPUÉS: {len(fotos_despues)}",
                reply_markup=ReplyKeyboardRemove()
            )

            # Opciones finales
            buttons = [
                [KeyboardButton("🔄 Iniciar nueva gestión")],
                [KeyboardButton("🔚 Finalizar Punto de Interes")]
            ]
            await update.message.reply_text(
                "📌 ¿Qué deseas hacer ahora?",
                reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
            )
            return FINISH_MESSAGE

        except Exception as e:
            logger.error(f"Error al guardar registro: {str(e)}", exc_info=True)
            # Hacer rollback si ocurre un error
            if 'conn' in locals() and conn:
                conn.rollback()
                conn.close()
                
            buttons = [[KeyboardButton("🔄 Reintentar"), KeyboardButton("❌ Cancelar")]]
            await update.message.reply_text(
                "⚠️ Ocurrió un error al guardar el registro.\n"
                f"Detalle: {str(e)[:100]}\n\n"
                "¿Qué deseas hacer ahora?",
                reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
            )
            return FINISH_MESSAGE

    elif response == "🔄 Iniciar nueva gestión":
        # Conservar cédula, departamento, ciudad y punto de interés
        cedula = context.user_data.get('cedula')
        departamento = context.user_data.get('departamento')
        ciudad = context.user_data.get('ciudad')
        punto_interes = context.user_data.get('punto_interes')
        
        # Limpiar solo datos específicos
        context.user_data.clear()
        
        # Restaurar datos esenciales
        if cedula:
            context.user_data['cedula'] = cedula
        if departamento:
            context.user_data['departamento'] = departamento
        if ciudad:
            context.user_data['ciudad'] = ciudad
        if punto_interes:
            context.user_data['punto_interes'] = punto_interes
        
        # Volver a selección de cliente, manteniendo el punto de interés
        return await handle_cliente_selection(update, context)
    
    elif response == "🔚 Finalizar Punto de Interes":
        await update.message.reply_text(
            "✅ Proceso finalizado. Usa /start cuando necesites comenzar de nuevo.",
            reply_markup=ReplyKeyboardRemove()
        )
        return ConversationHandler.END

    elif response == "❌ Cancelar todo":
        await update.message.reply_text(
            "❌ Gestión cancelada. No se ha guardado ningún registro.\n"
            "Usa /start para comenzar de nuevo.",
            reply_markup=ReplyKeyboardRemove()
        )
        return ConversationHandler.END

    elif response == "🔄 Reintentar":
        # Mostrar resumen final nuevamente
        return await show_final_summary(update, context)
        
    else:
        await update.message.reply_text("Por favor, selecciona una opción válida.")
        return FINISH_MESSAGE

async def go_back_to_before_photos(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Vuelve a la fase de fotos del ANTES"""
    total_antes = len(context.user_data.get('fotos_antes', {}))
    total_despues = len(context.user_data.get('fotos_despues', {}))
    
    # Mostrar botones para fotos del ANTES
    buttons = [
        [KeyboardButton("➡️ PASAR A FOTOS DEL DESPUÉS")]
    ]
    
    # Si hay más fotos del antes que del después, mostrar advertencia
    if total_antes > total_despues:
        await update.message.reply_text(
            f"⚠️ Tienes {total_antes} fotos del ANTES pero solo {total_despues} del DESPUÉS.\n"
            f"Debes tener el mismo número de fotos en ambas fases.",
            parse_mode="Markdown"
        )
    
    await update.message.reply_text(
        "🔄 Volviendo a Fotos del ANTES...\n"
        f"📷 *FASE 1: Fotos del ANTES de la gestión* (Total actual: {total_antes})\n"
        "Puedes enviar más fotos del estado inicial del punto.\n"
        "Usa los botones para continuar:",
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True)
    )
    return SELECTING_BEFORE_PHOTOS