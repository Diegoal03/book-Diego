@echo off
REM Optimiza el peso de las fotos para que la web cargue más rápido
REM Haz doble click en este archivo cada vez que agregues fotos nuevas

cd /d "%~dp0"

echo.
echo ==================================================
echo Optimizando fotografias (esto puede tardar un momento)...
echo ==================================================
echo.

python3 optimizar-fotos.py

echo.
echo ==================================================
echo Presiona cualquier tecla para cerrar...
echo ==================================================

pause
