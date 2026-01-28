FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias del sistema y controlador ODBC
RUN apt-get update && \
    apt-get install -y gcc gnupg2 curl && \
    # Agregar repositorio de Microsoft
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/11/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    # Forzar instalación de msodbcsql17 ignorando conflictos
    ACCEPT_EULA=Y apt-get install -y --allow-downgrades --allow-remove-essential \
        --allow-change-held-packages msodbcsql17 && \
    # Instalar dependencias de desarrollo
    apt-get install -y unixodbc-dev && \
    # Limpiar
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000
CMD ["python", "run.py"]
