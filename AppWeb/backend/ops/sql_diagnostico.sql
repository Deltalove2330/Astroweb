-- ════════════════════════════════════════════════════════════════════
--  ops/sql_diagnostico.sql
--  Diagnóstico de capacidad del SQL Server (172.174.41.110)
--  para soportar el pool de 50 conexiones × 300-400 mercaderistas.
--
--  Correr en SSMS / Azure Data Studio conectado al server.
--  El equivalente automatizado está en ops/sql_diagnostico.py
-- ════════════════════════════════════════════════════════════════════

-- ── 1. Límites configurados ─────────────────────────────────────────
-- 'user connections' = 0 significa SIN límite (máx 32767). Si está en un
-- número bajo, AHÍ tienes un techo que ningún ajuste de la app supera.
PRINT '=== 1. LÍMITES ===';
SELECT name, value, value_in_use, [description]
FROM sys.configurations
WHERE name IN ('user connections', 'max worker threads', 'max server memory (MB)',
               'min server memory (MB)');
SELECT @@MAX_CONNECTIONS AS max_connections_teorico;

-- ── 2. Conexiones / sesiones ACTUALES ───────────────────────────────
PRINT '=== 2. CONEXIONES ACTIVAS AHORA ===';
SELECT
    s.login_name,
    s.host_name,
    s.program_name,
    DB_NAME(s.database_id)        AS base_datos,
    COUNT(*)                      AS num_sesiones,
    SUM(CASE WHEN s.status = 'running' THEN 1 ELSE 0 END) AS corriendo
FROM sys.dm_exec_sessions s
WHERE s.is_user_process = 1
GROUP BY s.login_name, s.host_name, s.program_name, s.database_id
ORDER BY num_sesiones DESC;

-- Total de conexiones a nivel red
SELECT COUNT(*) AS conexiones_red_totales
FROM sys.dm_exec_connections;

-- ── 3. Memoria del servidor ─────────────────────────────────────────
PRINT '=== 3. MEMORIA ===';
SELECT
    total_physical_memory_kb / 1024            AS ram_fisica_mb,
    available_physical_memory_kb / 1024        AS ram_disponible_mb,
    system_memory_state_desc                   AS estado_memoria
FROM sys.dm_os_sys_memory;

SELECT
    physical_memory_in_use_kb / 1024           AS sqlserver_usa_mb,
    process_physical_memory_low                AS memoria_baja_flag
FROM sys.dm_os_process_memory;

-- Page Life Expectancy (>300s sano; muy bajo = presión de memoria)
SELECT object_name, counter_name, cntr_value AS page_life_expectancy_seg
FROM sys.dm_os_performance_counters
WHERE counter_name = 'Page life expectancy'
  AND object_name LIKE '%Buffer Manager%';

-- ── 4. CPU del proceso SQL (últimos minutos del ring buffer) ────────
PRINT '=== 4. CPU (snapshots recientes) ===';
SELECT TOP 10
    record_id,
    SQLProcessUtilization      AS cpu_sqlserver_pct,
    100 - SystemIdle - SQLProcessUtilization AS cpu_otros_pct,
    SystemIdle                 AS cpu_idle_pct
FROM (
    SELECT
        record.value('(./Record/@id)[1]', 'int') AS record_id,
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/SystemIdle)[1]', 'int') AS SystemIdle,
        record.value('(./Record/SchedulerMonitorEvent/SystemHealth/ProcessUtilization)[1]', 'int') AS SQLProcessUtilization
    FROM (
        SELECT CONVERT(xml, record) AS record
        FROM sys.dm_os_ring_buffers
        WHERE ring_buffer_type = 'RING_BUFFER_SCHEDULER_MONITOR'
          AND record LIKE '%<SystemHealth>%'
    ) AS x
) AS y
ORDER BY record_id DESC;

-- ── 5. Esperas (waits) dominantes ───────────────────────────────────
-- Si ves THREADPOOL alto → el server se queda sin worker threads (techo de
-- conexiones efectivo). RESOURCE_SEMAPHORE alto → presión de memoria.
PRINT '=== 5. TOP WAITS ===';
SELECT TOP 12
    wait_type,
    waiting_tasks_count,
    wait_time_ms,
    wait_time_ms / NULLIF(waiting_tasks_count, 0) AS avg_wait_ms
FROM sys.dm_os_wait_stats
WHERE wait_type NOT IN (
    'CLR_SEMAPHORE','LAZYWRITER_SLEEP','RESOURCE_QUEUE','SLEEP_TASK',
    'SLEEP_SYSTEMTASK','SQLTRACE_BUFFER_FLUSH','WAITFOR','LOGMGR_QUEUE',
    'CHECKPOINT_QUEUE','REQUEST_FOR_DEADLOCK_SEARCH','XE_TIMER_EVENT',
    'BROKER_TO_FLUSH','BROKER_TASK_STOP','CLR_MANUAL_EVENT','CLR_AUTO_EVENT',
    'DISPATCHER_QUEUE_SEMAPHORE','FT_IFTS_SCHEDULER_IDLE_WAIT','XE_DISPATCHER_WAIT',
    'XE_DISPATCHER_JOIN','SQLTRACE_INCREMENTAL_FLUSH_SLEEP','BROKER_EVENTHANDLER',
    'TRACEWRITE','HADR_FILESTREAM_IOMGR_IOCOMPLETION','DIRTY_PAGE_POLL',
    'SP_SERVER_DIAGNOSTICS_SLEEP','SLEEP_DBSTARTUP','SLEEP_DCOMSTARTUP'
)
ORDER BY wait_time_ms DESC;
