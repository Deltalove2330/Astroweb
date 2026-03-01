#!/bin/bash
# start.sh — Arrancar HJASSTA con Gunicorn + Celery + RabbitMQ + Redis
# chmod +x start.sh && ./start.sh

set -e

echo "======================================"
echo "  HJASSTA — Iniciando con Gunicorn"
echo "======================================"

# Crear directorio de logs
mkdir -p logs

# ── 1. RabbitMQ ────────────────────────────────────────────
echo "📨 Verificando RabbitMQ..."
if sudo service rabbitmq-server status > /dev/null 2>&1; then
    echo "✅ RabbitMQ ya está corriendo"
else
    echo "   Iniciando RabbitMQ..."
    sudo service rabbitmq-server start
    sleep 3
    sudo service rabbitmq-server status > /dev/null 2>&1 && echo "✅ RabbitMQ OK" || echo "❌ RabbitMQ falló"
fi

# ── 2. Redis ───────────────────────────────────────────────
echo "🔴 Verificando Redis..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis ya está corriendo"
else
    echo "   Iniciando Redis..."
    sudo service redis-server start
    sleep 1
    redis-cli ping > /dev/null 2>&1 && echo "✅ Redis OK" || echo "❌ Redis falló"
fi

# ── 3. Celery Worker ───────────────────────────────────────
echo "⚙️  Verificando Celery worker..."
if [ -f celery.pid ] && kill -0 $(cat celery.pid) 2>/dev/null; then
    echo "✅ Celery ya está corriendo (PID: $(cat celery.pid))"
else
    echo "   Iniciando Celery..."
    if [ -f celery.pid ]; then
        kill $(cat celery.pid) 2>/dev/null || true
        rm -f celery.pid
    fi
    celery -A app.tasks worker \
      --loglevel=warning \
      --concurrency=8 \
      --detach \
      --pidfile=celery.pid \
      --logfile=logs/celery.log
    sleep 2
    celery -A app.tasks status 2>/dev/null && echo "✅ Celery OK" || echo "⚠️  Celery iniciando..."
fi

# ── 4. Gunicorn ────────────────────────────────────────────
echo "======================================"
echo "✅ Iniciando Gunicorn..."
echo "======================================"

if ! command -v gunicorn &> /dev/null; then
    echo "❌ gunicorn no encontrado. Instalando..."
    pip install gunicorn eventlet
fi

if [ -f gunicorn.pid ]; then
    echo "⚠️  Deteniendo instancia anterior..."
    kill -9 $(cat gunicorn.pid) 2>/dev/null || true
    rm -f gunicorn.pid
fi

exec gunicorn \
    --config gunicorn.conf.py \
    --pid gunicorn.pid \
    wsgi:app