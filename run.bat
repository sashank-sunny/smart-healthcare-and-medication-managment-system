@echo off
title MediGuide - Your Health, Our Reminder.
cls
cd /d "%~dp0"
echo [1/3] Compiling MediGuide Java Backend & Server...
javac MediGuide.java
if %ERRORLEVEL% NEQ 0 ( start "" "login.html" & pause & exit /b )
echo [2/3] Starting MediGuide Server on Port 3000...
start /B java MediGuide --server-only
ping -n 3 127.0.0.1 >nul
echo [3/3] Opening Public Production Web Portal...
start https://sept-synthesis-tries-allocation.trycloudflare.com/login.html
echo MediGuide Live: https://sept-synthesis-tries-allocation.trycloudflare.com/
echo Local: http://localhost:3000/ -- Admin: Protected Access
java MediGuide
pause
