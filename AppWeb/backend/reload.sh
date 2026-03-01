#!/bin/bash
# reload.sh — Recarga código sin cortar conexiones activas
if [ -f gunicorn.pid ]; then
    kill -HUP $(cat gunicorn.pid)
    echo "✅ Recarga enviada (zero-downtime)"
else
    echo "❌ gunicorn.pid no encontrado. ¿Está corriendo?"
fi