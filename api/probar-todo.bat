@echo off
echo ==========================================
echo PRUEBA COMPLETA API CON USUARIOS REALES
echo ==========================================
echo.

echo 📋 USUARIOS DISPONIBLES EN TU BD:
echo   1. admin@escom.mx (Admin Sistema - ADMIN)
echo   2. enfermera@escom.mx (Enfermera General - ENFERMERO)
echo   3. medico@escom.mx (Juan Pérez - MEDICO)
echo   4. maria.garcia@escom.ipn.mx (María García - ENFERMERO)
echo   5. carlos.lopez@escom.ipn.mx (Carlos López - AUXILIAR)
echo.

echo 1. Health Check:
curl http://localhost:8080/api/auth/health
echo.
echo.

echo 2. Test API:
curl http://localhost:8080/api/auth/test
echo.
echo.

echo 3. Listar usuarios:
curl http://localhost:8080/api/auth/usuarios
echo.
echo.

echo 4. Probar login (admin):
curl -X POST http://localhost:8080/api/auth/login-dev ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"admin@escom.mx\",\"password\":\"cualquier-password\"}"
echo.
echo.

echo 5. Probar login (enfermera):
curl -X POST http://localhost:8080/api/auth/login-dev ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"enfermera@escom.mx\",\"password\":\"123\"}"
echo.
echo.

echo 6. Check usuario específico:
curl http://localhost:8080/api/auth/check-user/medico@escom.mx
echo.
echo.

echo ==========================================
echo ✅ Pruebas listas para Angular
echo ==========================================
