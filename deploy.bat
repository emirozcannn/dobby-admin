@echo off
setlocal EnableDelayedExpansion

:: Production Deployment Script for Dobby Cafe (Windows)
:: Usage: deploy.bat [environment]

set "ENVIRONMENT=%1"
if "%ENVIRONMENT%"=="" set "ENVIRONMENT=production"
set "ENV_FILE=.env.prod"

echo.
echo 🚀 Dobby Cafe Deployment Script
echo Environment: %ENVIRONMENT%
echo.

:: Check if environment file exists
if not exist "%ENV_FILE%" (
    echo ❌ Environment file %ENV_FILE% not found!
    echo 💡 Please copy .env.prod.template to %ENV_FILE% and configure it
    exit /b 1
)

:: Load environment variables
for /f "usebackq tokens=1,2 delims==" %%A in ("%ENV_FILE%") do (
    if not "%%A"=="" if not "%%A:~0,1%"=="#" (
        set "%%A=%%B"
    )
)

echo 📋 Pre-deployment checks...

:: Check Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed
    exit /b 1
)

:: Check Docker Compose
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed
    exit /b 1
)

:: Check required environment variables
if "%DB_PASSWORD%"=="" (
    echo ❌ Required environment variable DB_PASSWORD is not set
    exit /b 1
)

if "%JWT_SECRET%"=="" (
    echo ❌ Required environment variable JWT_SECRET is not set
    exit /b 1
)

if "%DOMAIN%"=="" (
    echo ❌ Required environment variable DOMAIN is not set
    exit /b 1
)

echo ✅ All pre-deployment checks passed
echo.

:: Create backup directory if it doesn't exist
if not exist "backups" mkdir backups

:: Backup existing data (if exists)
if "%ENVIRONMENT%"=="production" (
    echo 💾 Creating backup...
    
    docker-compose -f docker-compose.prod.yml ps | findstr "Up" | findstr "db" >nul
    if not errorlevel 1 (
        for /f "tokens=2 delims= " %%i in ('date /t') do set "today=%%i"
        for /f "tokens=1 delims= " %%i in ('time /t') do set "now=%%i"
        set "timestamp=!today:/=-!_!now::=-!"
        set "backup_file=backups/backup_!timestamp!.sql"
        
        docker-compose -f docker-compose.prod.yml exec -T db pg_dump -U %DB_USER% %DB_NAME% > "!backup_file!"
        
        if not errorlevel 1 (
            echo ✅ Backup created: !backup_file!
        ) else (
            echo ❌ Backup failed
            exit /b 1
        )
    )
)

:: Pull latest images
echo 📥 Pulling latest Docker images...
docker-compose -f docker-compose.prod.yml pull

:: Stop existing services
echo 🛑 Stopping existing services...
docker-compose -f docker-compose.prod.yml down

:: Start services
echo 🚀 Starting services...
docker-compose -f docker-compose.prod.yml up -d

:: Wait for services to be healthy
echo ⏳ Waiting for services to be healthy...
set /a "counter=0"
set /a "max_wait=24"

:wait_loop
docker-compose -f docker-compose.prod.yml ps | findstr "healthy" | find /c "healthy" > temp_count.txt
set /p healthy_count=<temp_count.txt
del temp_count.txt

if !healthy_count! geq 2 goto services_ready

set /a "counter+=1"
if !counter! geq !max_wait! (
    echo.
    echo ❌ Services failed to start properly within timeout
    echo 📋 Service status:
    docker-compose -f docker-compose.prod.yml ps
    exit /b 1
)

echo .
timeout /t 5 /nobreak >nul
goto wait_loop

:services_ready
echo.
echo ✅ All services are healthy

:: Run database migrations
echo 🔄 Running database migrations...
docker-compose -f docker-compose.prod.yml exec backend npm run migrate

:: Display deployment summary
echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📊 Service Status:
docker-compose -f docker-compose.prod.yml ps

echo.
echo 🌐 Application URLs:
echo   Frontend: https://%DOMAIN%
echo   API:      https://%DOMAIN%/api
echo   Health:   https://%DOMAIN%/api/health

echo.
echo 📝 Post-deployment tasks:
echo   • Monitor logs: docker-compose -f docker-compose.prod.yml logs -f
echo   • Check health: curl https://%DOMAIN%/api/health
echo   • View services: docker-compose -f docker-compose.prod.yml ps

echo.
echo 🚀 Dobby Cafe is now running in %ENVIRONMENT% mode!

pause
