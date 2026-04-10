#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador automático de inventario de fotos
Escanea las carpetas de fotografías y genera inventario-auto.js
Uso: python3 generate-inventory.py
"""

import os
import json
import re
from pathlib import Path

def obtener_archivos_fotos(ruta_carpeta):
    """Obtiene lista de archivos de foto en una carpeta"""
    extensiones_validas = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    
    try:
        archivos = os.listdir(ruta_carpeta)
        fotos = sorted([
            f for f in archivos 
            if os.path.isfile(os.path.join(ruta_carpeta, f)) 
            and os.path.splitext(f)[1].lower() in extensiones_validas
        ], key=lambda x: [int(n) if n.isdigit() else n for n in re.findall(r'\d+|\D+', x)])
        return fotos
    except Exception as e:
        print(f"⚠️ Error leyendo {ruta_carpeta}: {e}")
        return []

def generar_inventario():
    """Genera el inventario automático"""
    ruta_fotos = Path(__file__).parent / 'fotografias'
    categorias_activas = []
    
    if not ruta_fotos.exists():
        print(f"❌ No se encontró la carpeta: {ruta_fotos}")
        return
    
    # Escanear todas las subcarpetas
    for item in sorted(os.listdir(ruta_fotos)):
        ruta_categoria = ruta_fotos / item
        
        # Solo procesar si es carpeta
        if os.path.isdir(ruta_categoria):
            archivos = obtener_archivos_fotos(str(ruta_categoria))
            
            # Solo agregar categorías que tengan fotos
            if archivos:
                categorias_activas.append({
                    "cat": item,
                    "archivos": archivos
                })
                print(f"✅ {item}: {len(archivos)} imágenes")
    
    if not categorias_activas:
        print("⚠️ No se encontraron imágenes en las carpetas")
        return
    
    # Generar el archivo JavaScript
    contenido = f"""// Auto-generado por generate-inventory.py
// NO EDITAR MANUALMENTE - ejecuta: python3 generate-inventory.py

const CATEGORIAS_ACTIVAS = {json.dumps(categorias_activas, indent=4, ensure_ascii=False)};

console.log('✅ Inventario cargado:', CATEGORIAS_ACTIVAS.length, 'categorías activas');
"""
    
    # Escribir el archivo
    ruta_salida = Path(__file__).parent / 'inventario-auto.js'
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        f.write(contenido)
    
    print(f"\n✅ Archivo generado: {ruta_salida}")
    print(f"📊 Total de categorías: {len(categorias_activas)}")

if __name__ == '__main__':
    generar_inventario()
