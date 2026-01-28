# handlers/ruta_handlers.py
from telegram import Update, KeyboardButton, ReplyKeyboardMarkup
from telegram.ext import ContextTypes
from database import DatabaseManager
from states import SELECTING_MAIN_MENU, SELECTING_RUTA_VARIABLE, SELECTING_RUTA, FINAL_CONFIRMATION,SELECTING_PUNTO_INTERES_RUTA, SELECTING_CLIENTE_RUTA, SELECTING_MULTIPLE_CLIENTES
from handlers.auxiliary import show_main_menu
from handlers.photo_handler import show_final_message
from handlers.start_handler import start_rutas_variables
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# Opciones iniciales para rutas
async def start_rutas(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra opciones para rutas"""
    buttons = [
        [KeyboardButton("🛣️ Realizar Rutas")],
        [KeyboardButton("✏️ PDV Nuevo")],
        [KeyboardButton("🏠 Inicio")]
    ]
    await update.message.reply_text(
        "🛣️ *SELECCIONA UNA OPCIÓN DE RUTAS:*",
        parse_mode="Markdown",
        reply_markup=ReplyKeyboardMarkup(buttons, resize_keyboard=True, one_time_keyboard=False)
    )
    return SELECTING_RUTA

# Maneja la selección de "Realizar Rutas"
async def handle_realizar_rutas(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra las rutas asignadas al mercaderista"""
    # Primero verificar si es el comando de inicio
    if update.message.text == "🏠 Inicio":
        from handlers.auxiliary import show_main_menu
        return await show_main_menu(update, context)
    
    try:
        # Obtener cédula del contexto
        cedula = context.user_data.get('cedula')
        if not cedula:
            await update.message.reply_text(
                "❌ No se encontró tu cédula. Usa /start para reiniciar."
            )
            return SELECTING_MAIN_MENU
            
        # Buscar el id_mercaderista basado en la cédula
        db = DatabaseManager()
        mercaderista = db.execute_query(
            'SELECT id_mercaderista FROM dbo.MERCADERISTAS WHERE cedula = ?', 
            (cedula,)
        )
        
        if not mercaderista:
            await update.message.reply_text(
                "❌ No se encontró tu información de mercaderista."
            )
            return SELECTING_MAIN_MENU
            
        id_mercaderista = mercaderista[0][0]
        context.user_data['id_mercaderista'] = id_mercaderista
        
        # Obtener rutas asignadas al mercaderista
        rutas = db.execute_query(
            """SELECT r.id_ruta, r.ruta 
               FROM dbo.RUTAS_NUEVAS r
               INNER JOIN dbo.MERCADERISTAS_RUTAS mr ON r.id_ruta = mr.id_ruta
               WHERE mr.id_mercaderista = ? AND tipo_ruta ='Fija'""",
            (id_mercaderista,)
        )
        
        if not rutas:
            await update.message.reply_text(
                "ℹ️ No tienes rutas asignadas."
            )
            # Volver al menú principal
            from handlers.auxiliary import show_main_menu
            return await show_main_menu(update, context)
            
        # Crear botones para las rutas
        botones = []
        for i in range(0, len(rutas), 2):
            fila = [KeyboardButton(ruta[1]) for ruta in rutas[i:i+2]]
            botones.append(fila)
            
        botones.append(["⬅️ Volver al Menú Principal"])
        
        context.user_data['rutas_asignadas'] = {str(ruta[1]): ruta[0] for ruta in rutas}
        
        await update.message.reply_text(
            "🛣️ *SELECCIONA UNA RUTA:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
        )
        return SELECTING_RUTA
        
    except Exception as e:
        logger.error(f"Error al cargar rutas asignadas: {str(e)}")
        await update.message.reply_text(
            "⚠️ Error al cargar rutas. Usa /start para reiniciar."
        )
        return SELECTING_MAIN_MENU

# Maneja la selección de una ruta específica
async def handle_ruta_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra los puntos de interés para la ruta seleccionada y registra su activación"""
    if update.message.text == "⬅️ Volver al Menú Principal" or update.message.text == "🏠 Inicio":
        return await show_main_menu(update, context)
    
    ruta_nombre = update.message.text
    rutas_asignadas = context.user_data.get('rutas_asignadas', {})
    
    if ruta_nombre not in rutas_asignadas:
        await update.message.reply_text(
            "❌ Ruta no válida. Por favor selecciona una ruta de la lista."
        )
        return SELECTING_RUTA
    
    id_ruta = rutas_asignadas[ruta_nombre]
    context.user_data['id_ruta'] = id_ruta
    context.user_data['ruta_nombre'] = ruta_nombre
    
    try:
        # Obtener el id_mercaderista del contexto (ya debería estar disponible)
        id_mercaderista = context.user_data.get('id_mercaderista')
        if not id_mercaderista:
            await update.message.reply_text(
                "❌ Error: No se encontró tu información. Usa /start para reiniciar."
            )
            return SELECTING_MAIN_MENU
        
        # Registrar la activación de la ruta - USANDO CONEXIÓN EXPLÍCITA CON COMMIT
        db = DatabaseManager()
        fecha_hora_activacion = datetime.now()
        
        try:
            # Usar conexión explícita para asegurar el COMMIT
            conn = db.get_connection()
            cursor = conn.cursor()
            
            # Ejecutar la inserción
            cursor.execute(
                '''INSERT INTO dbo.RUTAS_ACTIVADAS (id_ruta, id_mercaderista, fecha_hora_activacion, estado)
                   VALUES (?, ?, ?, 'En progreso')''',
                (id_ruta, id_mercaderista, fecha_hora_activacion)
            )
            
            # ¡IMPORTANTE! Hacer COMMIT para guardar los cambios
            conn.commit()
            conn.close()
            
            # Mostrar confirmación al usuario
            fecha_formateada = fecha_hora_activacion.strftime("%d/%m/%Y %H:%M")
            await update.message.reply_text(
                f"✅ Ruta activada correctamente a las {fecha_formateada}\n"
                "Ahora puedes comenzar con los puntos de interés.",
                parse_mode="Markdown"
            )
            
        except Exception as insert_error:
            # Registrar el error específico de inserción
            logger.error(f"Error al insertar en RUTAS_ACTIVADAS: {str(insert_error)}", exc_info=True)
            
            # Si hay conexión abierta, hacer ROLLBACK
            if 'conn' in locals() and conn:
                conn.rollback()
                conn.close()
                
            # Mostrar mensaje de error detallado (solo para desarrollo)
            await update.message.reply_text(
                f"❌ Error crítico al activar ruta: {str(insert_error)[:100]}\n"
                "Contacta al administrador inmediatamente.",
                parse_mode="Markdown"
            )
            return SELECTING_RUTA
        
        # Ahora cargamos los puntos de interés
        puntos_interes = db.execute_query(
            '''SELECT rp.punto_interes, rp.id_punto_interes, rp.id_cliente, rp.dia, rp.prioridad
            FROM dbo.RUTA_PROGRAMACION rp
            WHERE rp.id_ruta = ? AND rp.activa = 1''',
            (id_ruta,)
        )
        
        if not puntos_interes:
            await update.message.reply_text(
                f"ℹ️ No hay puntos de interés programados para la ruta {ruta_nombre}."
            )
            return SELECTING_RUTA
            
        # Crear botones para los puntos de interés
        puntos_unicos = list(set([p[0] for p in puntos_interes]))  # Eliminar duplicados
        botones = []
        for i in range(0, len(puntos_unicos), 2):
            fila = [KeyboardButton(punto) for punto in puntos_unicos[i:i+2]]
            botones.append(fila)
            
        botones.append(["🏠 Inicio", "⬅️ Volver a Rutas"])

        # PASO 1: Crear estructura para almacenar múltiples clientes por punto de interés
        puntos_interes_dict = {}
        for p in puntos_interes:
            punto_interes = p[0]
            if punto_interes not in puntos_interes_dict:
                puntos_interes_dict[punto_interes] = {
                    'id_punto_interes': p[1],
                    'clientes': [{'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]}]
                }
            else:
                puntos_interes_dict[punto_interes]['clientes'].append({
                    'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]
                })

        context.user_data['puntos_interes_ruta'] = puntos_interes_dict

        # Simplificar la estructura para fácil acceso
        context.user_data['puntos_interes_nombres'] = {p[0]: p[0] for p in puntos_interes}

        await update.message.reply_text(
            f"📍 *PUNTOS DE INTERÉS PARA {ruta_nombre}:*",
            parse_mode="Markdown",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
        )
        return SELECTING_PUNTO_INTERES_RUTA
        
    except Exception as e:
        logger.error(f"Error FATAL al procesar ruta: {str(e)}", exc_info=True)
        await update.message.reply_text(
            "⚠️ Error crítico al procesar la ruta. Usa /start para reiniciar.\n"
            f"Detalle: {str(e)[:100]}",
            parse_mode="Markdown"
        )
        return SELECTING_RUTA

async def handle_punto_interes_ruta(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Muestra los clientes para el punto de interés seleccionado"""
    user_input = update.message.text
    
    # Manejar botones especiales PRIMERO
    if user_input == "🏠 Inicio":
        # Limpiar datos específicos de rutas pero mantener cédula
        context.user_data.pop('id_ruta', None)
        context.user_data.pop('ruta_nombre', None)
        context.user_data.pop('puntos_interes_ruta', None)
        context.user_data.pop('puntos_interes_nombres', None)
        context.user_data.pop('id_punto_interes', None)
        context.user_data.pop('punto_interes', None)
        
        # Mostrar menú principal
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
    
    # CORRECCIÓN: Manejar específicamente "⬅️ Volver a Rutas Variables"
    elif user_input == "⬅️ Volver a Rutas Variables":
        return await start_rutas_variables(update, context)
    
    elif user_input == "⬅️ Volver a Rutas":
        return await handle_realizar_rutas(update, context)
    
    elif user_input == "⬅️ Volver a Puntos de Interés":
        # Volver a mostrar los puntos de interés para la ruta actual
        id_ruta = context.user_data.get('id_ruta')
        ruta_nombre = context.user_data.get('ruta_nombre')
        
        if id_ruta is None or ruta_nombre is None:
            await update.message.reply_text(
                "❌ Error: No se encontró información de la ruta. Usa /start para reiniciar."
            )
            return SELECTING_MAIN_MENU
            
        try:
            db = DatabaseManager()
            # Cargar puntos de interés para la ruta
            puntos_interes = db.execute_query(
                '''SELECT rp.punto_interes, rp.id_punto_interes, rp.id_cliente, rp.dia, rp.prioridad
                FROM dbo.RUTA_PROGRAMACION rp
                WHERE rp.id_ruta = ? AND rp.activa = 1''',
                (id_ruta,)
            )
            
            if not puntos_interes:
                await update.message.reply_text(
                    f"ℹ️ No hay puntos de interés programados para la ruta {ruta_nombre}."
                )
                return SELECTING_RUTA
                
            # Crear botones para los puntos de interés
            puntos_unicos = list(set([p[0] for p in puntos_interes]))
            botones = []
            for i in range(0, len(puntos_unicos), 2):
                fila = [KeyboardButton(punto) for punto in puntos_unicos[i:i+2]]
                botones.append(fila)
            
            # CORRECCIÓN: Mostrar botones correctos según el tipo de ruta
            if 'rutas_variables_asignadas' in context.user_data:
                botones.append(["🏠 Inicio", "⬅️ Volver a Rutas Variables"])
            else:
                botones.append(["🏠 Inicio", "⬅️ Volver a Rutas"])
            
            # Actualizar datos en el contexto
            puntos_interes_dict = {}
            for p in puntos_interes:
                punto_interes = p[0]
                if punto_interes not in puntos_interes_dict:
                    puntos_interes_dict[punto_interes] = {
                        'id_punto_interes': p[1],
                        'clientes': [{'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]}]
                    }
                else:
                    puntos_interes_dict[punto_interes]['clientes'].append({
                        'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]
                    })
            context.user_data['puntos_interes_ruta'] = puntos_interes_dict
            context.user_data['puntos_interes_nombres'] = {p[0]: p[0] for p in puntos_interes}
            
            await update.message.reply_text(
                f"📍 *PUNTOS DE INTERÉS PARA {ruta_nombre}:*",
                parse_mode="Markdown",
                reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
            )
            return SELECTING_PUNTO_INTERES_RUTA
            
        except Exception as e:
            logger.error(f"Error al mostrar puntos de interés: {str(e)}", exc_info=True)
            await update.message.reply_text(
                "⚠️ Error al mostrar puntos de interés. Usa /start para reiniciar."
            )
            return SELECTING_RUTA
    
    # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    # CORRECCIÓN: Manejar el caso cuando venimos de una confirmación "No"
    # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    punto_interes = context.user_data.pop('_reselect_punto_interes', None)
    
    # Si no hay _reselect_punto_interes, usar el texto del mensaje
    if not punto_interes:
        punto_interes = update.message.text
    
    puntos_interes_ruta = context.user_data.get('puntos_interes_ruta', {})
    
    if punto_interes not in puntos_interes_ruta:
        await update.message.reply_text(
            "❌ Punto de interés no válido. Por favor selecciona uno de la lista."
        )
        return SELECTING_PUNTO_INTERES_RUTA
        
    # Guardar punto de interés seleccionado
    context.user_data['punto_interes'] = punto_interes
    clientes = puntos_interes_ruta[punto_interes]['clientes']
    
    try:
        # Si solo hay un cliente, proceder directamente
        if len(clientes) == 1:
            id_cliente = clientes[0]['id_cliente']
            prioridad = clientes[0]['prioridad']
            
            # Obtener información detallada del punto de interés
            db = DatabaseManager()
            id_punto_interes = puntos_interes_ruta[punto_interes]['id_punto_interes']
            punto_info = db.execute_query(
                '''SELECT departamento, ciudad, Direccion
                FROM dbo.PUNTOS_INTERES1
                WHERE identificador = ?''',
                (id_punto_interes,)
            )
            
            if punto_info:
                departamento, ciudad, direccion = punto_info[0]
                context.user_data['departamento'] = departamento
                context.user_data['ciudad'] = ciudad
                context.user_data['direccion'] = direccion
                
                # Obtener nombre del cliente
                cliente_info = db.execute_query(
                    'SELECT cliente FROM dbo.CLIENTES WHERE id_cliente = ?',
                    (id_cliente,)
                )
                
                if cliente_info:
                    cliente_nombre = cliente_info[0][0]
                    context.user_data['cliente'] = cliente_nombre
                    context.user_data['prioridad'] = prioridad
                    
                    # Mostrar resumen y confirmar
                    buttons = [
                        [KeyboardButton("✅ Sí")],
                        [KeyboardButton("❌ No")]
                    ]
                    
                    await update.message.reply_text(
                        f"📄 *Resumen de la selección:*"
                        f"\n📍 Punto de Interés: {punto_interes}"
                        f"\n🏢 Departamento: {departamento}"
                        f"\n🏙️ Ciudad: {ciudad}"
                        f"\n👥 Cliente: {cliente_nombre}"
                        f"\n\n¿Deseas continuar con esta selección?",
                        parse_mode="Markdown",
                        reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
                    )
                    return FINAL_CONFIRMATION
                else:
                    await update.message.reply_text(
                        "❌ No se encontró información del cliente."
                    )
                    return SELECTING_PUNTO_INTERES_RUTA
            else:
                await update.message.reply_text(
                    "❌ No se encontró información detallada del punto de interés."
                )
                return SELECTING_PUNTO_INTERES_RUTA
        
        # Si hay múltiples clientes, mostrar lista para seleccionar
        else:
            # Obtener nombres de todos los clientes (SIN DUPLICADOS)
            db = DatabaseManager()
            clientes_unicos = set()  # Usamos un set para evitar duplicados
            clientes_info = {}  # Para mapear nombre a id_cliente
            
            for cliente in clientes:
                cliente_info = db.execute_query(
                    'SELECT cliente FROM dbo.CLIENTES WHERE id_cliente = ?',
                    (cliente['id_cliente'],)
                )
                if cliente_info:
                    cliente_nombre = cliente_info[0][0]
                    clientes_unicos.add(cliente_nombre)
                    # Si hay múltiples IDs para el mismo nombre, guardamos el primero
                    if cliente_nombre not in clientes_info:
                        clientes_info[cliente_nombre] = cliente['id_cliente']
            
            # Convertir el set a lista para mostrar
            cliente_nombres = list(clientes_unicos)
            
            # Crear botones para los clientes
            botones = []
            for i in range(0, len(cliente_nombres), 2):
                fila = [KeyboardButton(cliente) for cliente in cliente_nombres[i:i+2]]
                botones.append(fila)
                
            botones.append(["⬅️ Volver a Puntos de Interés"])
            
            # Guardar los clientes disponibles para la selección (con nombres únicos)
            context.user_data['clientes_disponibles'] = clientes_info
            
            await update.message.reply_text(
                f"👥 *SELECCIONA UN CLIENTE PARA {punto_interes}:*",
                parse_mode="Markdown",
                reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
            )
            return SELECTING_MULTIPLE_CLIENTES
            
    except Exception as e:
        logger.error(f"Error al obtener información del punto de interés: {str(e)}")
        await update.message.reply_text(
            "⚠️ Error al obtener información. Usa /start para reiniciar."
        )
        return SELECTING_PUNTO_INTERES_RUTA


async def handle_cliente_multiple_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja exclusivamente la selección de cliente desde la lista"""
    user_input = update.message.text
    
    # Manejar botón de volver a puntos de interés
    if user_input == "⬅️ Volver a Puntos de Interés":
        id_ruta = context.user_data.get('id_ruta')
        ruta_nombre = context.user_data.get('ruta_nombre')
        
        if id_ruta is None or ruta_nombre is None:
            await update.message.reply_text(
                "❌ Error: No se encontró información de la ruta. Usa /start para reiniciar."
            )
            return SELECTING_MAIN_MENU
            
        # MOSTRAR DIRECTAMENTE LOS PUNTOS DE INTERÉS PARA LA RUTA ACTUAL
        try:
            db = DatabaseManager()
            # Cargar puntos de interés para la ruta
            puntos_interes = db.execute_query(
                '''SELECT rp.punto_interes, rp.id_punto_interes, rp.id_cliente, rp.dia, rp.prioridad
                FROM dbo.RUTA_PROGRAMACION rp
                WHERE rp.id_ruta = ? AND rp.activa = 1''',
                (id_ruta,)
            )
            
            if not puntos_interes:
                await update.message.reply_text(
                    f"ℹ️ No hay puntos de interés programados para la ruta {ruta_nombre}."
                )
                return SELECTING_RUTA
                
            # Crear botones para los puntos de interés
            puntos_unicos = list(set([p[0] for p in puntos_interes]))
            botones = []
            for i in range(0, len(puntos_unicos), 2):
                fila = [KeyboardButton(punto) for punto in puntos_unicos[i:i+2]]
                botones.append(fila)
            
            # CORRECCIÓN: Mostrar botones correctos según el tipo de ruta
            if 'rutas_variables_asignadas' in context.user_data:
                botones.append(["🏠 Inicio", "⬅️ Volver a Rutas Variables"])
            else:
                botones.append(["🏠 Inicio", "⬅️ Volver a Rutas"])
            
            # Actualizar datos en el contexto
            puntos_interes_dict = {}
            for p in puntos_interes:
                punto_interes = p[0]
                if punto_interes not in puntos_interes_dict:
                    puntos_interes_dict[punto_interes] = {
                        'id_punto_interes': p[1],
                        'clientes': [{'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]}]
                    }
                else:
                    puntos_interes_dict[punto_interes]['clientes'].append({
                        'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]
                    })
            context.user_data['puntos_interes_ruta'] = puntos_interes_dict
            context.user_data['puntos_interes_nombres'] = {p[0]: p[0] for p in puntos_interes}
            
            await update.message.reply_text(
                f"📍 *PUNTOS DE INTERÉS PARA {ruta_nombre}:*",
                parse_mode="Markdown",
                reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
            )
            return SELECTING_PUNTO_INTERES_RUTA
            
        except Exception as e:
            logger.error(f"Error al mostrar puntos de interés: {str(e)}", exc_info=True)
            await update.message.reply_text(
                "⚠️ Error al mostrar puntos de interés. Usa /start para reiniciar."
            )
            return SELECTING_RUTA
    
    # CORRECCIÓN: Manejar específicamente "⬅️ Volver a Rutas Variables"
    elif user_input == "⬅️ Volver a Rutas Variables":
        return await start_rutas_variables(update, context)
    
    # Manejar botón de inicio
    elif user_input == "🏠 Inicio":
        # Limpiar datos específicos de rutas pero mantener cédula
        context.user_data.pop('id_ruta', None)
        context.user_data.pop('ruta_nombre', None)
        context.user_data.pop('puntos_interes_ruta', None)
        context.user_data.pop('puntos_interes_nombres', None)
        context.user_data.pop('id_punto_interes', None)
        context.user_data.pop('punto_interes', None)
        
        # Mostrar menú principal
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
            
            
    # Verificar si es un cliente válido
    clientes_disponibles = context.user_data.get('clientes_disponibles', {})
    if user_input not in clientes_disponibles:
        await update.message.reply_text("❌ Cliente no válido. Selecciona uno de la lista.")
        return SELECTING_MULTIPLE_CLIENTES

    # Guardar el cliente seleccionado
    id_cliente = clientes_disponibles[user_input]
    context.user_data['cliente'] = user_input
    context.user_data['id_cliente'] = id_cliente

    # Obtener información del punto de interés para el resumen
    punto_interes = context.user_data.get('punto_interes')
    puntos_interes_ruta = context.user_data.get('puntos_interes_ruta', {})

    # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    # VERIFICAR ANTES DE BUSCAR LA PRIORIDAD
    # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    if punto_interes not in puntos_interes_ruta:
        await update.message.reply_text("❌ Error en la selección. Por favor intenta nuevamente.")
        return await handle_ruta_selection(update, context)

    # Buscar la prioridad para este cliente específico
    clientes = puntos_interes_ruta[punto_interes]['clientes']
    prioridad = None
    for cliente in clientes:
        if cliente['id_cliente'] == id_cliente:
            prioridad = cliente['prioridad']
            break
    context.user_data['prioridad'] = prioridad  # Almacenar la prioridad
    
    try:
        db = DatabaseManager()
        id_punto_interes = puntos_interes_ruta[punto_interes]['id_punto_interes']
        punto_info = db.execute_query(
            '''SELECT departamento, ciudad, Direccion
               FROM dbo.PUNTOS_INTERES1
               WHERE identificador = ?''',
            (id_punto_interes,)
        )

        if punto_info:
            departamento, ciudad, direccion = punto_info[0]
            context.user_data['departamento'] = departamento
            context.user_data['ciudad'] = ciudad
            context.user_data['direccion'] = direccion

            # Mostrar resumen para confirmación - ¡USAR LOS MISMOS BOTONES!
            buttons = [
                [KeyboardButton("✅ Sí")],
                [KeyboardButton("❌ No")]
            ]

            await update.message.reply_text(
                f"📄 *Resumen de la selección:*\n"
                f"📍 Punto de Interés: {punto_interes}\n"
                f"🏢 Departamento: {departamento}\n"
                f"🏙️ Ciudad: {ciudad}\n"
                f"👥 Cliente: {user_input}\n\n"
                f"¿Deseas continuar con esta selección?",
                parse_mode="Markdown",
                reply_markup=ReplyKeyboardMarkup(buttons, one_time_keyboard=True)
            )
            return FINAL_CONFIRMATION  # ¡MISMO ESTADO QUE EL FLUJO DE UN SOLO CLIENTE!
        else:
            await update.message.reply_text("❌ No se encontró información del punto de interés.")
            return SELECTING_MULTIPLE_CLIENTES
            
    except Exception as e:
        logger.error(f"Error al obtener info del punto: {str(e)}")
        await update.message.reply_text("⚠️ Error al obtener información. Intenta nuevamente.")
        return SELECTING_MULTIPLE_CLIENTES
    
    
async def handle_ruta_variable_selection(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Maneja la selección de una ruta variable (similar a handle_ruta_selection pero para variables)"""
    if update.message.text == "⬅️ Volver al Menú Principal" or update.message.text == "🏠 Inicio":
        return await show_main_menu(update, context)
    
    ruta_nombre = update.message.text
    rutas_variables_asignadas = context.user_data.get('rutas_variables_asignadas', {})
    
    if ruta_nombre not in rutas_variables_asignadas:
        await update.message.reply_text(
            "❌ Ruta variable no válida. Por favor selecciona una ruta de la lista."
        )
        return SELECTING_RUTA_VARIABLE
    
    id_ruta = rutas_variables_asignadas[ruta_nombre]
    context.user_data['id_ruta'] = id_ruta
    context.user_data['ruta_nombre'] = ruta_nombre
    
    try:
        # Obtener el id_mercaderista del contexto
        id_mercaderista = context.user_data.get('id_mercaderista')
        if not id_mercaderista:
            await update.message.reply_text(
                "❌ Error: No se encontró tu información. Usa /start para reiniciar."
            )
            return SELECTING_MAIN_MENU
        
        # Registrar la activación de la ruta variable
        db = DatabaseManager()
        fecha_hora_activacion = datetime.now()
        
        try:
            conn = db.get_connection()
            cursor = conn.cursor()
            
            # CORRECCIÓN: Eliminar la columna 'tipo_ruta' que no existe
            cursor.execute(
                '''INSERT INTO dbo.RUTAS_ACTIVADAS (id_ruta, id_mercaderista, fecha_hora_activacion, estado)
                   VALUES (?, ?, ?, 'En progreso')''',
                (id_ruta, id_mercaderista, fecha_hora_activacion)
            )
            
            conn.commit()
            conn.close()
            
            fecha_formateada = fecha_hora_activacion.strftime("%d/%m/%Y %H:%M")
            await update.message.reply_text(
                f"✅ Ruta variable activada correctamente a las {fecha_formateada}\n"
                "Ahora puedes comenzar con los puntos de interés.",
                parse_mode="Markdown"
            )
            
        except Exception as insert_error:
            logger.error(f"Error al insertar ruta variable en RUTAS_ACTIVADAS: {str(insert_error)}", exc_info=True)
            
            if 'conn' in locals() and conn:
                conn.rollback()
                conn.close()
                
            # CORRECCIÓN: Mensaje de error sin formato Markdown problemático
            await update.message.reply_text(
                f"❌ Error al activar ruta variable. Contacta al administrador.\n"
                f"Código: {str(insert_error)[:50]}"
            )
            return SELECTING_RUTA_VARIABLE
        
        # Cargar puntos de interés para la ruta variable
        puntos_interes = db.execute_query(
            '''SELECT rp.punto_interes, rp.id_punto_interes, rp.id_cliente, rp.dia, rp.prioridad
            FROM dbo.RUTA_PROGRAMACION rp
            WHERE rp.id_ruta = ? AND rp.activa = 1''',
            (id_ruta,)
        )
        
        if not puntos_interes:
            await update.message.reply_text(
                f"ℹ️ No hay puntos de interés programados para la ruta variable {ruta_nombre}."
            )
            return SELECTING_RUTA_VARIABLE
            
        # Crear botones para los puntos de interés
        puntos_unicos = list(set([p[0] for p in puntos_interes]))
        botones = []
        for i in range(0, len(puntos_unicos), 2):
            fila = [KeyboardButton(punto) for punto in puntos_unicos[i:i+2]]
            botones.append(fila)
            
        botones.append(["🏠 Inicio", "⬅️ Volver a Rutas Variables"])

        # Almacenar información de puntos de interés
        puntos_interes_dict = {}
        for p in puntos_interes:
            punto_interes = p[0]
            if punto_interes not in puntos_interes_dict:
                puntos_interes_dict[punto_interes] = {
                    'id_punto_interes': p[1],
                    'clientes': [{'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]}]
                }
            else:
                puntos_interes_dict[punto_interes]['clientes'].append({
                    'id_cliente': p[2], 'dia': p[3], 'prioridad': p[4]
                })

        context.user_data['puntos_interes_ruta'] = puntos_interes_dict
        context.user_data['puntos_interes_nombres'] = {p[0]: p[0] for p in puntos_interes}

        await update.message.reply_text(
            f"📍 PUNTOS DE INTERÉS PARA {ruta_nombre}:",
            reply_markup=ReplyKeyboardMarkup(botones, resize_keyboard=True)
        )
        return SELECTING_PUNTO_INTERES_RUTA
        
    except Exception as e:
        logger.error(f"Error FATAL al procesar ruta variable: {str(e)}", exc_info=True)
        # CORRECCIÓN: Mensaje de error sin formato Markdown problemático
        await update.message.reply_text(
            "⚠️ Error crítico al procesar la ruta variable. Usa /start para reiniciar."
        )
        return SELECTING_RUTA_VARIABLE