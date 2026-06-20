#!/bin/bash
set -e

echo "🚀 Iniciando servicios HJASSTA..."

mkdir -p logs

# 1. RabbitMQ
echo "📨 Iniciando RabbitMQ..."
rabbitmq-server -detached 2>/dev/null || true
sleep 2

# 2. Redis
echo "🔴 Iniciando Redis..."
redis-server --daemonize yes
sleep 1
redis-cli ping > /dev/null 2>&1 && echo "✅ Redis OK" || echo "❌ Redis FALLÓ"

# 3. Celery Worker
echo "⚙️  Iniciando Celery worker..."
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
echo "✅ Celery OK"

# 4. Gunicorn
echo "🌐 Iniciando Gunicorn..."
gunicorn --config gunicorn.conf.py wsgi:app