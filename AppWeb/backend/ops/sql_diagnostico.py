#!/usr/bin/env python3
# ops/sql_diagnostico.py
# ════════════════════════════════════════════════════════════════════
#  Diagnóstico automatizado del SQL Server usando la MISMA cadena de
#  conexión de la app (config.SQLALCHEMY_DATABASE_URI). Imprime un
#  resumen legible de límites, conexiones, memoria, CPU y waits.
#
#  USO (desde AppWeb/backend/):
#      python ops/sql_diagnostico.py
#
#  Lee credenciales del .env igual que la app (DB_SERVER, DB_NAME, etc.).
# ════════════════════════════════════════════════════════════════════
import os
import sys

# Consola Windows (cp1252) no traga emojis → forzar UTF-8 en stdout.
try:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception:
    pass

# Permitir importar config.py desde la raíz de backend/
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    import pyodbc
except ImportError:
    sys.exit("Falta pyodbc. Instala con: pip install pyodbc")

from config import config


CONSULTAS = [
    ("LÍMITES DE CONFIGURACIÓN", """
        SELECT name, CAST(value_in_use AS BIGINT) AS value_in_use
        FROM sys.configurations
        WHERE name IN ('user connections','max worker threads',
                       'max server memory (MB)','min server memory (MB)');
    """),
    ("MAX CONNECTIONS TEÓRICO", "SELECT @@MAX_CONNECTIONS AS max_connections;"),
    ("CONEXIONES ACTIVAS (por login/host/programa)", """
        SELECT TOP 25
            s.login_name, s.host_name, s.program_name,
            DB_NAME(s.database_id) AS base_datos,
            COUNT(*) AS num_sesiones
        FROM sys.dm_exec_sessions s
        WHERE s.is_user_process = 1
        GROUP BY s.login_name, s.host_name, s.program_name, s.database_id
        ORDER BY num_sesiones DESC;
    """),
    ("CONEXIONES DE RED TOTALES", "SELECT COUNT(*) AS conexiones FROM sys.dm_exec_connections;"),
    ("MEMORIA DEL SISTEMA (MB)", """
        SELECT total_physical_memory_kb/1024 AS ram_fisica_mb,
               available_physical_memory_kb/1024 AS ram_disponible_mb,
               system_memory_state_desc AS estado
        FROM sys.dm_os_sys_memory;
    """),
    ("MEMORIA USADA POR SQL SERVER (MB)", """
        SELECT physical_memory_in_use_kb/1024 AS sqlserver_usa_mb,
               process_physical_memory_low AS memoria_baja_flag
        FROM sys.dm_os_process_memory;
    """),
    ("PAGE LIFE EXPECTANCY (seg; >300 sano)", """
        SELECT cntr_value AS page_life_expectancy_seg
        FROM sys.dm_os_performance_counters
        WHERE counter_name = 'Page life expectancy'
          AND object_name LIKE '%Buffer Manager%';
    """),
    ("CPU RECIENTE (snapshots, % SQL vs idle)", """
        SELECT TOP 8
            record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]','int') AS cpu_sqlserver_pct,
            record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]','int') AS cpu_idle_pct
        FROM (
            SELECT CONVERT(xml, record) AS record
            FROM sys.dm_os_ring_buffers
            WHERE ring_buffer_type = 'RING_BUFFER_SCHEDULER_MONITOR'
              AND record LIKE '%<SystemHealth>%'
        ) x
        ORDER BY 1 DESC;
    """),
    ("TOP WAITS (THREADPOOL/RESOURCE_SEMAPHORE = alarma)", """
        SELECT TOP 12 wait_type, waiting_tasks_count, wait_time_ms
        FROM sys.dm_os_wait_stats
        WHERE wait_type NOT IN (
            'CLR_SEMAPHORE','LAZYWRITER_SLEEP','RESOURCE_QUEUE','SLEEP_TASK',
            'SLEEP_SYSTEMTASK','SQLTRACE_BUFFER_FLUSH','WAITFOR','LOGMGR_QUEUE',
            'CHECKPOINT_QUEUE','REQUEST_FOR_DEADLOCK_SEARCH','XE_TIMER_EVENT',
            'BROKER_TO_FLUSH','BROKER_TASK_STOP','CLR_MANUAL_EVENT','CLR_AUTO_EVENT',
            'DISPATCHER_QUEUE_SEMAPHORE','FT_IFTS_SCHEDULER_IDLE_WAIT','XE_DISPATCHER_WAIT',
            'XE_DISPATCHER_JOIN','SQLTRACE_INCREMENTAL_FLUSH_SLEEP','BROKER_EVENTHANDLER',
            'TRACEWRITE','DIRTY_PAGE_POLL','SP_SERVER_DIAGNOSTICS_SLEEP')
        ORDER BY wait_time_ms DESC;
    """),
]


def imprimir_tabla(cursor):
    cols = [d[0] for d in cursor.description]
    filas = cursor.fetchall()
    if not filas:
        print("  (sin filas)")
        return
    anchos = [len(c) for c in cols]
    for fila in filas:
        for i, val in enumerate(fila):
            anchos[i] = max(anchos[i], len(str(val)))
    print("  " + " | ".join(c.ljust(anchos[i]) for i, c in enumerate(cols)))
    print("  " + "-+-".join("-" * anchos[i] for i in range(len(cols))))
    for fila in filas:
        print("  " + " | ".join(str(v).ljust(anchos[i]) for i, v in enumerate(fila)))


def main():
    print("=" * 64)
    print(f"🔎 Diagnóstico SQL Server — {config.DB_SERVER} / {config.DB_NAME}")
    print("=" * 64)
    try:
        conn = pyodbc.connect(config.SQLALCHEMY_DATABASE_URI, timeout=10)
    except Exception as e:
        sys.exit(f"❌ No se pudo conectar: {e}")

    cur = conn.cursor()
    for titulo, sql in CONSULTAS:
        print(f"\n── {titulo} ──")
        try:
            cur.execute(sql)
            imprimir_tabla(cur)
        except Exception as e:
            print(f"  ⚠️  Error: {e}")

    cur.close()
    conn.close()

    print("\n" + "=" * 64)
    print("Cómo leerlo:")
    print("  • 'user connections' = 0 → sin límite (bien). Si es bajo, ese es el techo.")
    print("  • RAM disponible muy baja o Page Life Expectancy < 300 → presión de memoria.")
    print("  • Wait THREADPOOL alto → faltan worker threads (techo efectivo de conexiones).")
    print("  • Wait RESOURCE_SEMAPHORE alto → presión de memoria en queries.")
    print("=" * 64)


if __name__ == "__main__":
    main()
