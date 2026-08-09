@echo off
echo ==========================================
echo   MediVault - Android APK Builder
echo ==========================================
echo.
echo 1. Building Production Web Assets...
call npm run build

echo.
echo 2. Syncing Capacitor Android Project...
call npx cap sync android

echo.
echo 3. Compiling Android APK...
cd android
call gradlew assembleDebug

echo.
echo ==========================================
echo   Build Complete!
echo   APK File: android\app\build\outputs\apk\debug\app-debug.apk
echo ==========================================
pause
