# app/utils/azure_file_storage.py
import os
import logging
from pathlib import Path
from datetime import datetime

logger = logging.getLogger(__name__)

class AzureFileStorage:
    def __init__(self, base_path='X:'):
        # Asegurar que la ruta base termine con backslash
        self.base_path = base_path.rstrip('\\') + '\\'
    
    def save_file(self, file_obj, relative_path):
        """
        
        
        Args:
            file_obj: FileStorage de Flask
            relative_path: Ruta relativa desde la unidad base (ej: "Miranda/Caracas/punto/cliente/fecha/tipo/archivo.jpg")
        
        Returns:
            tuple: (success, file_path_for_fs, file_path_for_db, error_message)
        """
        try:
            # Asegurar que relative_path use separadores correctos
            relative_path = relative_path.replace('/', '\\')
            
            # Construir ruta completa para sistema de archivos
            file_path_for_fs = os.path.join(self.base_path, relative_path)
            
            # Normalizar la ruta (quitar dobles barras, etc.)
            file_path_for_fs = os.path.normpath(file_path_for_fs)
            
            # Construir ruta para base de datos (con doble barra invertida)
            file_path_for_db = file_path_for_fs.replace('\\', '\\\\')
            
            # Asegurar que los directorios existan
            fs_path = Path(file_path_for_fs)
            fs_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Guardar el archivo
            file_obj.save(str(fs_path))
            
            # Verificar que se guardó
            if fs_path.exists() and fs_path.stat().st_size > 0:
                logger.info(f"✅ Archivo guardado exitosamente: {file_path_for_fs}")
                return True, file_path_for_fs, file_path_for_db, None
            else:
                logger.error(f"❌ Archivo no se guardó correctamente: {file_path_for_fs}")
                return False, None, None, "No se pudo guardar el archivo"
                
        except Exception as e:
            logger.error(f"❌ Error al guardar archivo: {str(e)}")
            return False, None, None, str(e)
    
    def construct_path(self, *parts):
        """
        Construye una ruta para Azure File Storage
        
        Args:
            *parts: Partes de la ruta
        
        Returns:
            tuple: (file_path_for_fs, file_path_for_db)
        """
        # Limpiar partes
        cleaned_parts = []
        for part in parts:
            if part:
                # Reemplazar caracteres inválidos en rutas de Windows
                invalid_chars = '<>:"|?*'
                for char in invalid_chars:
                    part = part.replace(char, '_')
                # Reemplazar barras por guiones bajos
                part = part.replace('\\', '_').replace('/', '_')
                cleaned_parts.append(part)
        
        # Unir partes para ruta relativa
        relative_path = "\\".join(cleaned_parts)
        
        # Ruta completa para sistema de archivos
        file_path_for_fs = os.path.join(self.base_path, relative_path)
        
        # Ruta para base de datos (doble barra invertida)
        file_path_for_db = file_path_for_fs.replace('\\', '\\\\')
        
        return file_path_for_fs, file_path_for_db

# Instancia global
azure_storage = AzureFileStorage()