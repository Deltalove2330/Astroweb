#!/bin/bash
# stop.sh
if [ -f gunicorn.pid ]; then
    PID=$(cat gunicorn.pid)
    echo "Deteniendo Gunicorn PID=$PID..."
    kill -TERM $PID
    rm -f gunicorn.pid
    echo "✅ Detenido"
else
    echo "⚠️  No se encontró gunicorn.pid"
    pkill -f "gunicorn.*wsgi:app" && echo "✅ Proceso terminado" || echo "No había proceso activo"
fi