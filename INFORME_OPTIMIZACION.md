# Informe de Optimización — Sistema de Carga (AppWeb)
### Estabilización para soportar 300–400 mercaderistas concurrentes
**Fecha:** 4 de junio de 2026 · **Alcance:** backend Flask + base de datos SQL Server + frontend

---

## 1. Resumen ejecutivo (para todos)

**El problema:** la aplicación funcionaba bien con ~30 mercaderistas, pero al crecer a 300–400 usuarios entrando al mismo tiempo (inducciones, inicio de jornada) empezó a dar **"Tiempo de espera agotado"**: los usuarios no podían iniciar sesión ni usar la app durante el pico de la mañana.

**La causa (en una frase):** la app estaba haciendo **demasiado trabajo innecesario contra la base de datos**, y cada operación contra esa base de datos es **lenta porque la base de datos está en la nube y la app en la oficina** (viajan por internet). Al juntarse muchos usuarios, ese trabajo se acumulaba y todo se trababa.

**Lo que se hizo:** se corrigieron **varios cuellos de botella** (bloqueos del programa, trabajo duplicado, consultas innecesarias que se repetían cientos de veces por minuto) y se **eliminó casi toda la carga de fondo**. Resultado medido:

| Métrica | Antes | Después |
|---|---|---|
| Logins que el sistema procesa por segundo | ~6,5 | **~108** (17× más) |
| Tiempo de un login bajo carga | se colgaba (>60 s) | **~1,3 s** |
| Carga constante de fondo contra la BD | ~300 consultas/s | **≈ 0** |
| 400 logins de prueba | se trababa | **6,5 s, sin errores** |

**Lo que falta (de fondo):** la base de datos está en la nube y la app en la oficina. Acercarlas (ponerlas juntas) es la mejora definitiva, pero ya no es urgente porque la app quedó muy liviana.

---

## 2. Glosario sencillo (para entender el resto)

- **Consulta / query:** una pregunta que la app le hace a la base de datos ("dame los mensajes de Juan"). Cada consulta tiene un costo de tiempo.
- **Base de datos (BD):** donde se guarda toda la información (usuarios, visitas, fotos, mensajes). Está en un servidor **Windows en la nube**.
- **RTT (Round-Trip Time):** el tiempo que tarda un mensaje en **ir y volver** entre la app y la base de datos. Como la app está en la oficina y la BD en la nube, viajan por internet: medimos **~449 milisegundos (casi medio segundo) por cada consulta**. Si estuvieran en la misma red sería **menos de 1 milisegundo** (450 veces más rápido). *Analogía: es como pedir un dato por carta postal en vez de gritarlo en la misma sala.*
- **Servidor de aplicación:** el programa que atiende a los usuarios. Corre en un **servidor Ubuntu local en la oficina**.
- **Worker:** el proceso que atiende las peticiones. Esta app usa **un solo worker** que maneja todo mediante "hilos cooperativos".
- **Event loop (bucle de eventos):** el "cerebro" del worker. Atiende a todos los usuarios por turnos muy rápidos. Si una sola tarea lo **bloquea** (lo monopoliza), **todos** los usuarios esperan. Esto fue una de las causas.
- **tpool (thread pool / pool de hilos):** un grupo de "trabajadores" que ejecutan las consultas a la BD **en paralelo** sin bloquear el event loop. Es el **número máximo de consultas a la BD que pueden correr al mismo tiempo**. Estaba en 20; lo subimos a 100.
- **Pool de conexiones:** un conjunto de "líneas telefónicas" ya abiertas hacia la base de datos, listas para reusar. Abrir una línea nueva es lento; reusarla es rápido. Estaba en 30; lo subimos a 120.
- **Redis:** una memoria ultrarrápida que vive **en la misma oficina, junto a la app** (no en la nube). Leer de Redis es ~1000 veces más rápido que consultar la BD en la nube. La usamos para **guardar respuestas y no preguntarle a la BD una y otra vez**.
- **Polling:** cuando la app del celular le pregunta al servidor "¿hay novedades?" **cada X segundos, automáticamente**. Si 400 celulares preguntan cada 8 segundos, son **cientos de preguntas por segundo** todo el día.
- **bcrypt:** el algoritmo que verifica las contraseñas. Es **deliberadamente lento** (por seguridad). Hacerlo mal bloquea todo.
- **Throughput:** cuántas operaciones por segundo aguanta el sistema. Es el "ancho" de la tubería.
- **Techo (de capacidad):** el máximo de consultas/segundo que el sistema puede hacer. Se calcula aproximadamente: `techo = tpool ÷ RTT`. Con tpool=100 y RTT=0,449 s → **~220 consultas/s**.

---

## 3. El problema, en detalle

Durante el pico de la mañana, los mercaderistas recibían **"Tiempo de espera agotado"** al intentar entrar. La app no estaba "caída" técnicamente, pero respondía tan lento que los celulares se rendían (cada uno espera un máximo y luego muestra el error).

Lo engañoso: con **30 usuarios funcionaba perfecto**. El problema solo aparecía con **muchos a la vez**, porque el trabajo se **acumulaba** más rápido de lo que el sistema podía procesarlo.

---

## 4. El diagnóstico — cómo llegamos a la causa (cronología de pruebas)

No se adivinó: se **midió** en cada paso. Resumen del proceso de investigación:

1. **Revisión del login.** Se encontró que la verificación de contraseña (bcrypt) corría de forma que **bloqueaba el event loop**: mientras se verificaba una contraseña, todos los demás usuarios esperaban. Además el sistema solo permitía **20 consultas simultáneas** (tpool=20) y **30 conexiones** a la BD.

2. **Diagnóstico de la base de datos** (script `ops/sql_diagnostico.py`). Resultado clave: la BD **no tiene límite de conexiones** y estaba **descansada** (CPU casi 0%). Conclusión: **la base de datos NO era el problema**; el cuello estaba en la app.

3. **Análisis de las contraseñas** (script `ops/check_bcrypt_rounds.py`). Hallazgo: **772 de 773 usuarios** tenían las contraseñas con un parámetro de seguridad (cost=12) **4 veces más lento** de lo necesario.

4. **Prueba de carga** (script `ops/loadtest_login.py`, simula cientos de logins simultáneos). Reveló dos cosas: (a) **producción estaba corriendo código viejo** y (b) el login **se colgaba** incluso con pocas peticiones.

5. **Tras desplegar los primeros arreglos**, la prueba de carga destapó un **bloqueo profundo (deadlock)**: con 100 logins simultáneos, **todos** se colgaban. Se identificó que el pool de conexiones usaba un tipo de "candado" incompatible con los hilos paralelos.

6. **Tras arreglar el deadlock**, el sistema completaba los logins pero **lento** (~6,5/s). Una herramienta de medición aislada (`ops/bench_db_concurrency.py`) demostró que las consultas se **serializaban** (corrían de a una). Se halló que el pool ejecutaba una operación lenta **mientras tenía el candado tomado**, frenando a todos.

7. **Tras corregir eso**, el login subió a **61/s**. Pero en la **tormenta real** se vio que un usuario administrativo (login general) seguía sin entrar: el sistema estaba **saturado por la carga combinada** (logins + visitas + fotos + chat).

8. **Auditoría exhaustiva de toda la app.** Hallazgo mayor: la app del celular hacía **polling cada 8 segundos** de dos endpoints "pesados" → con 400 celulares = **~300 consultas/segundo CONSTANTES**, todo el día. Eso solo ya **rebasaba el techo** del sistema, sin contar el pico de login.

9. **Verificación final en vivo** (en el servidor) y prueba de la base de datos en horario sin carga: todo confirmado funcionando.

---

## 5. Los cambios realizados (qué, por qué y para qué)

Se hicieron **13 cambios**, agrupados por área. Cada uno con su justificación.

### A) Login y seguridad

**A1. bcrypt fuera del "cerebro" (event loop).**
*Qué:* la verificación de contraseña ahora corre en un hilo aparte (tpool).
*Por qué:* antes bloqueaba a todos los usuarios mientras verificaba una sola contraseña. *Commit: 6054666ac.*

**A2. Contraseñas más rápidas (cost 12 → 10) + migración automática.**
*Qué:* las contraseñas nuevas usan un parámetro de seguridad más eficiente; las viejas se actualizan **solas** cuando el usuario entra, **en segundo plano** (sin demorar el login).
*Por qué:* cada login era 4× más lento de lo necesario. El parámetro 10 sigue siendo seguro (mínimo recomendado por estándares OWASP). *Commits: 6054666ac, 3e4390daf.*

**A3. Consulta de login optimizada (de lenta a instantánea).**
*Qué:* se reescribió la consulta del login y se creó un **índice** en la columna de cédula.
*Por qué:* la consulta hacía un "barrido" de toda la tabla (312 ms); con el índice es una "búsqueda directa" (~5–88 ms). *Commit: 058c150ab + `ops/optimizar_login.sql`.*

**A4. Login general en 1 sola consulta (antes 2).**
*Qué:* el login de administradores/clientes/supervisores hacía dos consultas que leían **el mismo registro dos veces**; ahora es una.
*Por qué:* a 449 ms por consulta, ahorrar una por login importa en el pico. *Commit: a4e235e1e.*

### B) Motor de base de datos (el corazón del problema)

**B1. Candado nativo en el pool (arregla el bloqueo total / deadlock).**
*Qué:* el pool de conexiones usaba un "candado" del tipo equivocado, incompatible con los hilos paralelos.
*Por qué:* causaba que con muchos usuarios **todo se congelara** (1 login funcionaba, 100 se colgaban todos). *Commit: ceb8c7634.* **Este fue el arreglo más crítico.**

**B2. Operaciones lentas FUERA del candado (elimina la serialización).**
*Qué:* el pool hacía una operación de red (~100 ms) **mientras retenía el candado**, obligando a todos a esperar en fila.
*Por qué:* limitaba todo el sistema a ~10 consultas/s sin importar cuántos hilos hubiera. Tras el arreglo, la latencia quedó **plana** y el throughput escaló. *Commit: 0f8e68dbb.*

**B3. Más capacidad: tpool 20→100 y pool 30→120.**
*Qué:* se permite que **más consultas corran en paralelo** y que haya **más líneas abiertas** a la BD.
*Por qué:* con la latencia alta de la nube (449 ms), la única forma de subir el throughput es tener más operaciones en vuelo a la vez. Subió el techo de ~89 a ~220 consultas/s. *Commit: a4e235e1e.*

**B4. Validación de conexión inteligente.**
*Qué:* el pool ya no verifica con un "ping" extra las conexiones usadas hace pocos segundos.
*Por qué:* ese ping era un viaje extra a la nube en cada reúso. *Commit: 33ffeb8d7.*

**B5. Pre-calentamiento del pool (arranque frío).**
*Qué:* al arrancar, el sistema abre 40 conexiones **de a una, gradualmente, en segundo plano**.
*Por qué:* en una prueba se vio que abrir 40 conexiones **de golpe** por internet causaba fallos. De noche las conexiones expiran, así que el pico de la mañana las abriría todas de golpe. Pre-abrirlas evita el "atasco de arranque". *Commit: 32f1da708.*

### C) Eliminar carga de fondo (el hallazgo mayor)

**C1. Polling de cada 8 s → cada 60 s.**
*Qué:* la app del celular preguntaba "¿mensajes nuevos?" cada 8 segundos a dos endpoints. Se subió a 60 s.
*Por qué:* con 400 celulares eran ~300 consultas/segundo **constantes**, que por sí solas saturaban el sistema. Los mensajes igual llegan **al instante** por otra vía (WebSocket en tiempo real); el polling es solo respaldo. *Commit: 732fcca27.*

**C2. Conteo de mensajes guardado en Redis (0 consultas a la BD).**
*Qué:* el número de "mensajes no leídos" ahora se guarda en Redis (memoria local rápida) y se recalcula solo cuando llega o se lee un mensaje.
*Por qué:* convierte cada chequeo de badge de **una consulta lenta a la nube** en una **lectura instantánea local**. *Commit: 87d12b5b3.*

**C3. Caché del usuario por petición (load_user).**
*Qué:* en **cada** acción de cualquier usuario, el sistema volvía a consultar a la BD "¿quién es este usuario?". Ahora se guarda en su sesión.
*Por qué:* era 1 consulta lenta extra en **cada clic de toda la app**. Quitarla aligera **todo**, no solo el login. *Commit: 87d12b5b3.*

**C4. Dos endpoints de badges combinados en uno.**
*Qué:* la app pedía mensajes-de-analistas y mensajes-de-clientes por separado; ahora en una sola petición.
*Por qué:* mitad de peticiones por chequeo. *Commit: 87d12b5b3.*

**C5. Caché de cédula→id (dato que nunca cambia).**
*Qué:* una búsqueda que se repetía 2 veces por carga del dashboard ahora se guarda en Redis.
*Por qué:* ~800 consultas menos en el pico de la mañana. *Commit: 802658dfd.*

### D) Frontend (la app en el celular/navegador) y estabilidad

**D1. Bloqueo anti doble-envío en el login.**
*Qué:* el botón de login ahora se deshabilita mientras procesa; los clics/Enter extra se ignoran.
*Por qué:* en la tormenta se vio a un usuario enviar **5 logins en 1 segundo**. Cada reintento **empeoraba** el atasco. *Commit: 68f6c9a29.*

**D2. Tiempos de espera del frontend ajustados (10s/5s → 20s) y mensajes claros.**
*Por qué:* dar más margen antes de mostrar error en el pico, y evitar reintentos en cascada. *Commit: 68f6c9a29.*

**D3. "Cache-busting" automático de los archivos JS.**
*Qué:* cuando se actualiza un archivo de la app, el navegador descarga la versión nueva automáticamente (antes servía la vieja en caché).
*Por qué:* asegura que las mejoras lleguen a los dispositivos sin pedirle a cada usuario que limpie el caché. *Commit: 03fd9121d.*

**D4. No reciclar el worker en medio del pico.**
*Qué:* el worker se reiniciaba automáticamente cada 3000 peticiones; se desactivó.
*Por qué:* ese reinicio cortaba todas las conexiones de chat y dejaba un hueco sin servicio justo en el pico. *Commit: a4e235e1e.*

**D5. Limpieza de sesiones "pegadas".**
*Qué:* script para cerrar sesiones que quedaron marcadas como activas (los celulares cierran la app sin "cerrar sesión").
*Por qué:* higiene; no afectaba el rendimiento pero ensuciaba el panel de sesiones. *Commit: 03fd9121d + `ops/limpiar_sesiones.sql`.*

---

## 6. Herramientas creadas (carpeta `AppWeb/backend/ops/`)

Quedan como **herramientas permanentes de diagnóstico** para el futuro:

| Archivo | Para qué sirve |
|---|---|
| **`sql_diagnostico.py`** | Radiografía de la base de datos: CPU, memoria, conexiones activas, esperas, límites. Para saber si la BD está saturada. |
| **`bench_db_concurrency.py`** | Mide cuántas consultas/segundo aguanta la capa de base de datos y si se serializan. Clave para detectar cuellos de botella internos. |
| **`loadtest_login.py`** | Simula cientos de logins simultáneos y mide latencia + si el "cerebro" sigue respondiendo. Para validar el sistema antes de un pico. |
| **`check_bcrypt_rounds.py`** | Revisa qué tan rápidas/lentas están las contraseñas en la BD. |
| **`sql_diagnostico.sql`** | La versión SQL del diagnóstico (para ejecutar en SSMS). |
| **`optimizar_login.sql`** | Crea el índice que acelera el login. |
| **`limpiar_sesiones.sql`** | Cierra sesiones abandonadas. |

**Cómo usarlas durante un pico** (en el servidor):
```bash
/home/pc/Escritorio/Astroweb/env/bin/python ops/sql_diagnostico.py        # ¿BD saturada?
/home/pc/Escritorio/Astroweb/env/bin/python ops/bench_db_concurrency.py   # ¿capa DB lenta?
```

---

## 7. Resultados medidos (antes / después)

- **Login bajo carga:** de **colgarse (>60 s)** a **~1,3 s** (p50).
- **Capacidad de login:** de **6,5/s** → **108/s** (17×).
- **400 logins de prueba:** de **trabarse** → **6,5 segundos, 0 errores**.
- **Carga constante de fondo:** de **~300 consultas/s** → **≈ 0** en reposo.
- **Consulta del login:** de **312 ms** → **~88 ms** (con índice).
- **"Cerebro" (event loop) bajo tormenta:** se mantiene respondiendo en **~2 ms** (sano) — antes se bloqueaba.
- **Base de datos:** confirmada **holgada** (CPU ~0%, sin límites, sin presión de memoria).

---

## 8. Lo que falta por hacer

### 8.1. (Fundamental, no urgente) Acercar la app y la base de datos
**El problema de fondo:** la app está en la oficina (Ubuntu) y la base de datos en la nube (Windows). Cada consulta viaja por internet → **449 ms**. Eso es el límite real de velocidad de **toda** la app.

**Por qué ya no es urgente:** con todos los arreglos, la app casi no consulta la BD en reposo, así que el sistema tiene mucho margen. Pero si se quiere el **máximo rendimiento** (la app 100–450× más rápida en cada operación), hay que **co-ubicarlas**.

**Dos caminos (a decidir):**
- **Recomendado — mover la app a la nube** (junto a la BD): la base de datos no se toca (cero riesgo de datos), se elimina el túnel inestable, y la oficina deja de ser punto único de falla. Costo: un servidor en la nube.
- **Alternativa — traer la BD a la oficina** (restaurar el backup diario en el Ubuntu local): usa el hardware existente (sin costo nuevo), pero la oficina pasa a ser crítica para los datos (requiere UPS y respaldos externos). *Dato importante: el servidor SQL también hospeda otra base (`SynchronizationService`) que es independiente — migrar `epran` no la afecta.*

### 8.2. (Mejoras opcionales de menor prioridad)
- Optimizar la consulta de "chats" del dashboard (única consulta moderadamente pesada que queda en la carga inicial).
- Programar el pre-calentamiento del pool automáticamente (vía tarea programada a las 7:45am) en vez de depender del reinicio manual.
- Evaluar a futuro migrar fuera de "eventlet" (la librería del worker está marcada como obsoleta por sus autores; no es urgente).

---

## 9. Recomendaciones operativas para el día del pico

1. **Reiniciar el servicio ~10–15 minutos antes del pico** (ej. 7:45am) para que el pool de conexiones quede "caliente":
   ```bash
   cd /home/pc/Escritorio/Astroweb
   git fetch origin && git merge origin/fix/concurrencia-login-bcrypt-pool
   sudo systemctl restart hjassta-gunicorn
   ```
   En el log debe aparecer `[DB] Pool pre-calentado: 40 conexiones idle`.

2. **Durante el pico**, si se quiere monitorear en vivo, correr `bench_db_concurrency.py` y `sql_diagnostico.py`. Si la BD no muestra esperas de tipo `THREADPOOL`/`RESOURCE_SEMAPHORE`, está aguantando.

3. **Una vez al día / semana**, ejecutar `limpiar_sesiones.sql` para mantener limpio el registro de sesiones.

---

## 10. Conclusión

El sistema pasó de **trabarse con la carga de 300–400 mercaderistas** a tener **capacidad de sobra en toda la app** (no solo en el login). Se atacaron las causas reales —bloqueos del programa, trabajo duplicado y carga de fondo innecesaria— con cambios medidos y verificados en producción. La única mejora de fondo restante es de **infraestructura** (acercar app y base de datos), que se puede planificar con calma porque ya no es un riesgo inmediato.

*Todos los cambios están versionados en Git (rama `fix/concurrencia-login-bcrypt-pool`, 13 commits) y desplegados/verificados en producción.*
