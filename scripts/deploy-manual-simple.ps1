# Script de deploiement manuel pour CIPFARO E-Learning
# Version sans Docker pour Windows

param(
    [switch]$Health = $false
)

# Configuration
$LOG_DIR = "./logs"
$LOG_FILE = "$LOG_DIR/deployment-manual-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

# Fonction pour ecrire les logs
function Write-ColorLog {
    param(
        [string]$Level,
        [string]$Message
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Creer le dossier logs s'il n'existe pas
    if (-not (Test-Path $LOG_DIR)) {
        New-Item -ItemType Directory -Path $LOG_DIR -Force | Out-Null
    }
    
    # Ecrire dans le fichier de log
    $logMessage | Out-File -FilePath $LOG_FILE -Append -Encoding UTF8
    
    # Afficher a l'ecran avec couleur
    switch ($Level) {
        "INFO"    { Write-Host "[$Level] $Message" -ForegroundColor Green }
        "WARN"    { Write-Host "[$Level] $Message" -ForegroundColor Yellow }
        "ERROR"   { Write-Host "[$Level] $Message" -ForegroundColor Red }
        "SUCCESS" { Write-Host "[$Level] $Message" -ForegroundColor Green }
        default   { Write-Host "[$Level] $Message" }
    }
}

# Fonction pour verifier la sante des services
function Check-ServiceHealth {
    Write-ColorLog -Level "INFO" -Message "Verification de la sante des services..."
    
    # Test API
    try {
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 10
        if ($apiResponse.StatusCode -eq 200) {
            Write-ColorLog -Level "SUCCESS" -Message "API: Service actif (port 3001)"
        }
    } catch {
        Write-ColorLog -Level "ERROR" -Message "API: Service inactif (port 3001)"
    }
    
    # Test Frontend
    try {
        $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 10
        if ($webResponse.StatusCode -eq 200) {
            Write-ColorLog -Level "SUCCESS" -Message "Frontend: Service actif (port 3000)"
        }
    } catch {
        Write-ColorLog -Level "ERROR" -Message "Frontend: Service inactif (port 3000)"
    }
}

# Si l'option Health est specifiee, verifier seulement la sante
if ($Health) {
    Check-ServiceHealth
    exit 0
}

# Debut du deploiement
Write-ColorLog -Level "INFO" -Message "=== DEPLOIEMENT MANUEL CIPFARO E-LEARNING ==="
Write-ColorLog -Level "INFO" -Message "Mode : Deploiement sans Docker"
Write-Host ""

# Verification des prerequis
Write-ColorLog -Level "INFO" -Message "Verification des prerequis pour deploiement manuel..."

# Verifier Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-ColorLog -Level "SUCCESS" -Message "Node.js detecte : $nodeVersion"
} else {
    Write-ColorLog -Level "ERROR" -Message "Node.js non trouve. Installer depuis https://nodejs.org/"
    exit 1
}

# Verifier pnpm
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $pnpmVersion = pnpm --version
    Write-ColorLog -Level "SUCCESS" -Message "PNPM detecte : $pnpmVersion"
} else {
    Write-ColorLog -Level "ERROR" -Message "PNPM non trouve. Installer avec : npm install -g pnpm"
    exit 1
}

# Installation des dependances
Write-ColorLog -Level "INFO" -Message "Installation des dependances..."
try {
    & pnpm install --frozen-lockfile 2>&1 | Tee-Object -FilePath $LOG_FILE -Append
    Write-ColorLog -Level "SUCCESS" -Message "Dependances installees avec succes"
} catch {
    Write-ColorLog -Level "ERROR" -Message "Erreur lors de l'installation des dependances"
    exit 1
}

# Construction du projet
Write-ColorLog -Level "INFO" -Message "Construction du projet..."
try {
    & pnpm build 2>&1 | Tee-Object -FilePath $LOG_FILE -Append
    Write-ColorLog -Level "SUCCESS" -Message "Projet construit avec succes"
} catch {
    Write-ColorLog -Level "ERROR" -Message "Erreur lors de la construction"
    exit 1
}

# Instructions de demarrage manuel
Write-ColorLog -Level "INFO" -Message "Demarrage des services en mode manuel..."
Write-ColorLog -Level "INFO" -Message "=== INSTRUCTIONS DE DEMARRAGE MANUEL ==="

Write-Host ""
Write-Host "SERVICES A DEMARRER MANUELLEMENT :" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. BASE DE DONNEES PostgreSQL :" -ForegroundColor Cyan
Write-Host "   - Installer PostgreSQL depuis https://www.postgresql.org/download/"
Write-Host "   - Creer une base de donnees 'cipfaro_production'"
Write-Host "   - Configurer l'utilisateur et le mot de passe"
Write-Host ""

Write-Host "2. CACHE Redis (optionnel mais recommande) :" -ForegroundColor Cyan
Write-Host "   - Installer Redis depuis https://redis.io/download"
Write-Host "   - Ou utiliser Redis Cloud (recommande pour Windows)"
Write-Host "   - Demarrer : redis-server"
Write-Host ""

Write-Host "3. API BACKEND :" -ForegroundColor Cyan
Write-Host "   Dans un terminal PowerShell :"
Write-Host "   cd d:\cipfaro-elearning\apps\api"
Write-Host "   pnpm start:prod"
Write-Host ""

Write-Host "4. FRONTEND WEB :" -ForegroundColor Cyan
Write-Host "   Dans un autre terminal PowerShell :"
Write-Host "   cd d:\cipfaro-elearning\apps\web"
Write-Host "   pnpm start"
Write-Host ""

Write-Host "5. CONFIGURATION :" -ForegroundColor Cyan
Write-Host "   - Copier .env.production vers .env.local dans apps/web/"
Write-Host "   - Copier .env.production vers .env dans apps/api/"
Write-Host "   - Ajuster les URLs de connexion dans ces fichiers"
Write-Host ""

Write-Host "ACCES AUX SERVICES :" -ForegroundColor Green
Write-Host "   - Frontend: http://localhost:3000"
Write-Host "   - API: http://localhost:3001"
Write-Host ""

Write-ColorLog -Level "SUCCESS" -Message "Instructions affichees. Suivez les etapes ci-dessus."
Write-Host ""

Write-ColorLog -Level "SUCCESS" -Message "=== DEPLOIEMENT MANUEL PREPARE ==="
Write-ColorLog -Level "INFO" -Message "Suivez les instructions ci-dessus pour demarrer les services."
Write-ColorLog -Level "INFO" -Message "Utilisez 'health' pour verifier l'etat des services."
Write-Host ""
Write-Host "Pour verifier la sante des services :" -ForegroundColor Yellow
Write-Host ".\scripts\deploy-manual-simple.ps1 -Health" -ForegroundColor White