@echo off
REM Script para actualizar el inventario de fotos automáticamente
REM Haz doble click en este archivo después de agregar fotos nuevas

cd /d "%~dp0"

echo.
echo ==================================================
echo Escaneando carpetas de fotografías...
echo ==================================================
echo.

python3 generate-inventory.py

echo.
echo ==================================================
echo Presiona cualquier tecla para cerrar...
echo ==================================================

pause
