# Script de verification Docker apres installation
# A executer apres l'installation de Docker Desktop

Write-Host "=== VERIFICATION INSTALLATION DOCKER ===" -ForegroundColor Green
Write-Host ""

# Test 1: Version Docker
Write-Host "1. Verification de la version Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "   Docker non detecte ou non demarre" -ForegroundColor Red
    Write-Host "   Verifiez que Docker Desktop est demarre" -ForegroundColor Yellow
    exit 1
}

# Test 2: Version Docker Compose
Write-Host "2. Verification de Docker Compose..." -ForegroundColor Yellow
try {
    $composeVersion = docker-compose --version
    Write-Host "   $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "   Docker Compose non detecte" -ForegroundColor Red
    exit 1
}

# Test 3: Daemon Docker
Write-Host "3. Test du daemon Docker..." -ForegroundColor Yellow
try {
    docker info | Out-Null
    Write-Host "   Daemon Docker actif" -ForegroundColor Green
} catch {
    Write-Host "   Daemon Docker non actif" -ForegroundColor Red
    Write-Host "   Demarrez Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Test 4: Hello World
Write-Host "4. Test Hello World..." -ForegroundColor Yellow
try {
    $helloOutput = docker run --rm hello-world 2>&1
    if ($helloOutput -match "Hello from Docker") {
        Write-Host "   Test Hello World reussi" -ForegroundColor Green
    } else {
        Write-Host "   Test Hello World echoue" -ForegroundColor Red
    }
} catch {
    Write-Host "   Erreur lors du test Hello World" -ForegroundColor Red
}

# Test 5: Configuration du projet
Write-Host "5. Test de la configuration du projet..." -ForegroundColor Yellow
try {
    Set-Location "D:\cipfaro-elearning"
    docker-compose -f docker-compose.production.yml config | Out-Null
    Write-Host "   Configuration Docker Compose valide" -ForegroundColor Green
} catch {
    Write-Host "   Erreur dans la configuration Docker Compose" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== DOCKER PRET POUR LE DEPLOIEMENT ===" -ForegroundColor Green
Write-Host ""
Write-Host "Pour deployer CIPFARO E-Learning:" -ForegroundColor Cyan
Write-Host "cd D:\cipfaro-elearning" -ForegroundColor White
Write-Host ".\scripts\deploy-production.ps1" -ForegroundColor White