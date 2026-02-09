@echo off
echo ============================================
echo  INSTALADOR AVANZADO - LAVID SUPER AGENT
echo ============================================
echo.

REM 1. Instalar dependencias
echo Instalando dependencias...
pip install fastapi uvicorn sqlmodel requests feedparser pydantic

REM 2. Crear archivo del agente
echo Creando archivo lavid_super_agent.py...
type lavid_super_agent.py >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: No se encontró lavid_super_agent.py
    echo Debes ejecutar primero el instalador básico.
    pause
    exit /b
)

REM 3. Crear servicio de Windows
echo Creando servicio de Windows LavidAgentService...
sc create LavidAgentService binPath= "python.exe D:\MACAPA_ENTERPRISE\backend\lavid_super_agent.py" start= auto

echo Servicio creado correctamente.

echo.
echo Instalación avanzada completada.
pause
