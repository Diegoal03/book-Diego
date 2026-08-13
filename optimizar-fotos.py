#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Optimizador de fotos para carga rápida en la web.
Reduce el peso de las imágenes (redimensiona + comprime) sin que se note
la pérdida de calidad, para que la página cargue mucho más rápido.

Uso: python3 optimizar-fotos.py
Requiere: pip install Pillow

Qué hace:
- Redimensiona las fotos que sean más anchas de 1600px (más que suficiente
  para verse nítidas en cualquier pantalla, incluida la vista ampliada).
- Recomprime los JPG a calidad 78 (visualmente casi idéntica, mucho más liviana).
- Antes de tocar cada foto, guarda una copia del original sin modificar en
  la carpeta fotografias-originales-respaldo/ (por si alguna vez quieres
  recuperar la versión original).
- Ignora archivos basura como ".DS_Store" o "._foto.jpg" (y los elimina si
  los encuentra, porque no son fotos reales y pueden romper la galería).
- Es seguro ejecutarlo varias veces: las fotos que ya fueron optimizadas
  antes (tienen respaldo) se saltan, así que solo procesa fotos nuevas.
"""

import os
import shutil
from pathlib import Path

try:
    from PIL import Image, ImageOps
except ImportError:
    print("❌ Falta instalar Pillow. Ejecuta primero:  pip install Pillow")
    raise SystemExit(1)

ANCHO_MAXIMO = 1600
CALIDAD_JPEG = 78
CARPETA_FOTOS = Path(__file__).parent / 'fotografias'
CARPETA_RESPALDO = Path(__file__).parent / 'fotografias-originales-respaldo'
EXTENSIONES_VALIDAS = {'.jpg', '.jpeg', '.png'}


def es_basura(nombre):
    return nombre.startswith('.') or nombre.lower() == 'thumbs.db'


def limpiar_basura(carpeta):
    eliminados = 0
    for archivo in list(carpeta.iterdir()):
        if archivo.is_file() and es_basura(archivo.name):
            try:
                archivo.unlink()
                eliminados += 1
                print(f"🗑️  Eliminado archivo basura: {archivo.relative_to(CARPETA_FOTOS.parent)}")
            except Exception as e:
                print(f"⚠️  No se pudo eliminar {archivo.name}: {e}")
    return eliminados


def optimizar_archivo(archivo, respaldo_path):
    peso_antes = archivo.stat().st_size

    # Guardar copia intacta del original la primera vez
    respaldo_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(archivo, respaldo_path)

    with Image.open(archivo) as img:
        img = ImageOps.exif_transpose(img)  # respeta la orientación original de la cámara
        formato = 'JPEG' if archivo.suffix.lower() in {'.jpg', '.jpeg'} else 'PNG'

        if formato == 'JPEG' and img.mode in ('RGBA', 'P'):
            img = img.convert('RGB')

        if img.width > ANCHO_MAXIMO:
            nueva_altura = round(img.height * (ANCHO_MAXIMO / img.width))
            img = img.resize((ANCHO_MAXIMO, nueva_altura), Image.LANCZOS)

        if formato == 'JPEG':
            img.save(archivo, 'JPEG', quality=CALIDAD_JPEG, optimize=True)
        else:
            img.save(archivo, 'PNG', optimize=True)

    peso_despues = archivo.stat().st_size
    return peso_antes, peso_despues


def optimizar():
    if not CARPETA_FOTOS.exists():
        print(f"❌ No se encontró la carpeta: {CARPETA_FOTOS}")
        return

    total_antes = 0
    total_despues = 0
    procesadas = 0
    omitidas = 0
    basura_eliminada = 0

    # Archivos sueltos directamente en fotografias/ (ej. fondo-hero.png, perfil-diego.jpg)
    basura_eliminada += limpiar_basura(CARPETA_FOTOS)
    carpetas_a_revisar = [CARPETA_FOTOS] + [c for c in sorted(CARPETA_FOTOS.iterdir()) if c.is_dir()]

    for carpeta in carpetas_a_revisar:
        if carpeta != CARPETA_FOTOS:
            basura_eliminada += limpiar_basura(carpeta)

        for archivo in sorted(carpeta.iterdir()):
            if not archivo.is_file():
                continue
            if es_basura(archivo.name):
                continue
            if archivo.suffix.lower() not in EXTENSIONES_VALIDAS:
                continue

            ruta_relativa = archivo.relative_to(CARPETA_FOTOS)
            respaldo_path = CARPETA_RESPALDO / ruta_relativa

            if respaldo_path.exists():
                omitidas += 1
                continue

            try:
                peso_antes, peso_despues = optimizar_archivo(archivo, respaldo_path)
                total_antes += peso_antes
                total_despues += peso_despues
                procesadas += 1
                print(f"✅ {ruta_relativa}: {peso_antes // 1024}KB → {peso_despues // 1024}KB")
            except Exception as e:
                print(f"⚠️  Error optimizando {ruta_relativa}: {e}")

    print("\n" + "=" * 55)
    if basura_eliminada:
        print(f"🗑️  Archivos basura eliminados: {basura_eliminada}")
    if procesadas:
        ahorro = (1 - total_despues / total_antes) * 100 if total_antes else 0
        print(f"📊 Fotos optimizadas ahora: {procesadas}")
        print(f"   Peso total: {total_antes // 1024}KB → {total_despues // 1024}KB  ({ahorro:.0f}% menos)")
        print(f"🗂️  Copias de los originales guardadas en: {CARPETA_RESPALDO.name}/")
    else:
        print("✅ No había fotos nuevas por optimizar (todas ya tenían respaldo).")
    if omitidas:
        print(f"⏭️  Fotos ya optimizadas anteriormente (sin tocar de nuevo): {omitidas}")
    print("=" * 55)


if __name__ == '__main__':
    optimizar()
