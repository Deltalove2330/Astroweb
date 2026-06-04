-- ════════════════════════════════════════════════════════════════════
--  ops/limpiar_sesiones.sql
--  Cierra sesiones "pegadas": filas activa=1 abandonadas.
--
--  Por qué pasa: los mercaderistas usan la app móvil y casi nunca tocan
--  "Cerrar sesión" (cierran la app). El endpoint /logout marca activa=0,
--  pero si no se llama, la fila queda activa=1 para siempre aunque su clave
--  en Redis ya expiró (TTL 8h). No bloquea el login (register_session cierra
--  la del usuario en su próximo ingreso), pero ensucia el panel de "sesiones
--  activas" y la tabla.
--
--  Esta limpieza cierra toda activa=1 cuyo ultimo_acceso sea > 12h (más que
--  el TTL de Redis → con seguridad ya no hay sesión real viva).
--  Seguro de correr en cualquier momento.
-- ════════════════════════════════════════════════════════════════════

UPDATE SESIONES_ACTIVAS
SET activa = 0,
    fecha_cierre = GETDATE(),
    motivo_cierre = 'limpieza_inactividad'
WHERE activa = 1
  AND ultimo_acceso < DATEADD(hour, -12, GETDATE());

PRINT CONCAT(@@ROWCOUNT, ' sesiones abandonadas cerradas.');

-- (Opcional) Recorte de histórico muy viejo para que la tabla no crezca sin
-- límite. Descomentar si quieres conservar solo los últimos ~90 días:
-- DELETE FROM SESIONES_ACTIVAS
-- WHERE activa = 0 AND fecha_inicio < DATEADD(day, -90, GETDATE());
-- PRINT CONCAT(@@ROWCOUNT, ' filas históricas (>90 días) eliminadas.');
