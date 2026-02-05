# app/routes/auditor_routes.py - VERSIÓN CORREGIDA (SIN SQLALCHEMY)
from flask import Blueprint, render_template, jsonify, session, redirect, url_for, flash, current_app, request
from flask_login import login_required, current_user
from datetime import datetime
from app.utils.database import execute_query  # ✅ Usar tu función existente

auditor_bp = Blueprint('auditor', __name__)

@auditor_bp.route('/dashboard')
@login_required
def dashboard_auditor():
    """Dashboard para mercaderistas tipo Auditor"""
    if current_user.rol != 'mercaderista':
        flash('Acceso no autorizado', 'danger')
        return redirect(url_for('auth.login'))
    
    try:
        # ✅ Usar execute_query en lugar de SQLAlchemy
        result = execute_query(
            "SELECT nombre, cedula, tipo, fecha_ingreso FROM MERCADERISTAS WHERE cedula = ?",
            (current_user.cedula,),
            fetch_one=True
        )
        
        if not result:
            flash('Usuario no encontrado', 'danger')
            return redirect(url_for('auth.login'))
        
        # Verificar si es Auditor
        if result[2] != 'Auditor':  # tipo está en la posición 2
            flash('Solo los auditores pueden acceder a esta página', 'danger')
            return redirect(url_for('merchandisers.dashboard_mercaderista'))
        
        session['auditor_name'] = result[0]
        session['auditor_cedula'] = result[1]
        session['auditor_tipo'] = result[2]
        session['fechaIngreso'] = result[3].isoformat() if result[3] else None
        
        return render_template('auditor_dashboard.html', 
                             nombre=result[0],
                             tipo=result[2])
    
    except Exception as e:
        print(f"Error al cargar dashboard auditor: {e}")
        import traceback
        traceback.print_exc()
        flash('Error al cargar información del auditor', 'danger')
        return redirect(url_for('auth.login'))

@auditor_bp.route('/api/stats/<cedula>')
@login_required
def get_auditor_stats(cedula):
    """Obtener estadísticas del auditor usando execute_query"""
    try:
        # 1. Obtener ID del mercaderista
        mercaderista = execute_query(
            "SELECT id_mercaderista FROM MERCADERISTAS WHERE cedula = ? AND tipo = 'Auditor'",
            (cedula,),
            fetch_one=True
        )
        
        if not mercaderista:
            return jsonify({'error': 'Auditor no encontrado'}), 404
        
        mercaderista_id = mercaderista if isinstance(mercaderista, int) else mercaderista[0]
        
        # 2. Obtener rutas asignadas al auditor
        rutas_result = execute_query(
            "SELECT id_ruta FROM MERCADERISTAS_RUTAS WHERE id_mercaderista = ?",
            (mercaderista_id,)
        )
        
        if not rutas_result:
            rutas_ids = []
        else:
            rutas_ids = [r[0] if isinstance(r, (tuple, list)) else r for r in rutas_result]
        
        if not rutas_ids:
            return jsonify({
                'rutasAsignadas': 0,
                'rutasPendientes': 0,
                'rutasCompletadas': 0
            })
        
        # 3. Obtener programaciones activas para estas rutas (HOY)
        from datetime import datetime
        dia_semana = {
            0: 'Lunes', 1: 'Martes', 2: 'Miércoles', 
            3: 'Jueves', 4: 'Viernes', 5: 'Sábado', 6: 'Domingo'
        }
        today_dow = dia_semana[datetime.now().weekday()]
        
        # Construir query dinámicamente
        placeholders = ','.join('?' for _ in rutas_ids)
        query = f"""
            SELECT COUNT(*) 
            FROM RUTA_PROGRAMACION 
            WHERE id_ruta IN ({placeholders}) 
            AND dia = ? 
            AND activa = 1
        """
        params = rutas_ids + [today_dow]
        
        programaciones = execute_query(query, tuple(params), fetch_one=True)
        rutas_pendientes = programaciones[0] if isinstance(programaciones, (tuple, list)) else programaciones
        
        return jsonify({
            'rutasAsignadas': len(rutas_ids),
            'rutasPendientes': rutas_pendientes or 0,
            'rutasCompletadas': 0
        })
    
    except Exception as e:
        print(f"Error al obtener estadísticas del auditor: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Error al cargar estadísticas'}), 500

@auditor_bp.route('/carga-data')
@login_required
def carga_auditor():
    """Página de carga de data para auditores"""
    try:
        mercaderista = execute_query(
            "SELECT tipo FROM MERCADERISTAS WHERE cedula = ?",
            (current_user.cedula,),
            fetch_one=True
        )
        
        if not mercaderista or (isinstance(mercaderista, (tuple, list)) and mercaderista[0] != 'Auditor'):
            flash('Acceso no autorizado', 'danger')
            return redirect(url_for('auditor.dashboard_auditor'))
        
        return render_template('carga_auditor.html')
    
    except Exception as e:
        print(f"Error en carga-auditor: {e}")
        import traceback
        traceback.print_exc()
        flash('Error al cargar página de carga', 'danger')
        return redirect(url_for('auditor.dashboard_auditor'))