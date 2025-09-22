# 🚀 Scripts de Démarrage Automatique - CIPFARO E-Learning

# Script PowerShell pour Windows
function Start-CipfaroDevEnvironment {
    Write-Host "🚀 Démarrage de l'environnement de développement CIPFARO..." -ForegroundColor Green
    
    # Vérifier que nous sommes dans le bon répertoire
    if (!(Test-Path "package.json")) {
        Write-Host "❌ Veuillez exécuter ce script depuis le répertoire racine du projet" -ForegroundColor Red
        return
    }

    Write-Host "1️⃣ Démarrage PostgreSQL..." -ForegroundColor Yellow
    docker-compose up -d postgres
    Start-Sleep -Seconds 5

    Write-Host "2️⃣ Installation des dépendances..." -ForegroundColor Yellow
    pnpm install

    Write-Host "3️⃣ Configuration Prisma..." -ForegroundColor Yellow
    Set-Location infra
    pnpm prisma generate
    pnpm prisma migrate dev --name "init"

    Write-Host "4️⃣ Seed de la base de données..." -ForegroundColor Yellow
    pnpm run db:seed-simple
    Set-Location ..

    Write-Host "✅ Environnement prêt ! Démarrer les services :" -ForegroundColor Green
    Write-Host "Terminal 1: cd apps\api && pnpm dev" -ForegroundColor Cyan
    Write-Host "Terminal 2: cd apps\web && pnpm dev" -ForegroundColor Cyan
    Write-Host "Test suite: node test-suite.js" -ForegroundColor Cyan
}

# Script Bash pour Linux/Mac
function start_cipfaro_dev() {
    echo "🚀 Démarrage de l'environnement de développement CIPFARO..."
    
    # Vérifier que nous sommes dans le bon répertoire
    if [ ! -f "package.json" ]; then
        echo "❌ Veuillez exécuter ce script depuis le répertoire racine du projet"
        return 1
    fi

    echo "1️⃣ Démarrage PostgreSQL..."
    docker-compose up -d postgres
    sleep 5

    echo "2️⃣ Installation des dépendances..."
    pnpm install

    echo "3️⃣ Configuration Prisma..."
    cd infra
    pnpm prisma generate
    pnpm prisma migrate dev --name "init"

    echo "4️⃣ Seed de la base de données..."
    pnpm run db:seed-simple
    cd ..

    echo "✅ Environnement prêt ! Démarrer les services :"
    echo "Terminal 1: cd apps/api && pnpm dev"
    echo "Terminal 2: cd apps/web && pnpm dev"
    echo "Test suite: node test-suite.js"
}

# Pour utiliser ces scripts :

## PowerShell (Windows)
# 1. Ouvrir PowerShell en tant qu'administrateur
# 2. Set-ExecutionPolicy RemoteSigned (si nécessaire)
# 3. Copier la fonction Start-CipfaroDevEnvironment dans PowerShell
# 4. Exécuter : Start-CipfaroDevEnvironment

## Bash (Linux/Mac)  
# 1. Copier la fonction start_cipfaro_dev dans ~/.bashrc ou ~/.zshrc
# 2. source ~/.bashrc (ou ~/.zshrc)
# 3. Exécuter : start_cipfaro_dev

# Alternative simple : script batch Windows
# start-dev.bat :
@echo off
echo 🚀 Démarrage CIPFARO E-Learning...
docker-compose up -d postgres
timeout /t 5
pnpm install
cd infra
pnpm prisma generate
pnpm prisma migrate dev --name "init"
pnpm run db:seed-simple
cd ..
echo ✅ Prêt ! Démarrer : 
echo Terminal 1: cd apps\api ^&^& pnpm dev
echo Terminal 2: cd apps\web ^&^& pnpm dev

# Alternative simple : script bash Linux/Mac
# start-dev.sh :
#!/bin/bash
echo "🚀 Démarrage CIPFARO E-Learning..."
docker-compose up -d postgres
sleep 5
pnpm install
cd infra
pnpm prisma generate  
pnpm prisma migrate dev --name "init"
pnpm run db:seed-simple
cd ..
echo "✅ Prêt ! Démarrer :"
echo "Terminal 1: cd apps/api && pnpm dev"
echo "Terminal 2: cd apps/web && pnpm dev"