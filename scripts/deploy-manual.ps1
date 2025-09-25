# ===================================================================
# Script de déploiement sans Docker - CIPFARO E-Learning (PowerShell)
# ===================================================================

param(
    [Parameter(Position=0)]
    [ValidateSet("", "start", "stop", "restart", "health", "logs")]
    [string]$Action = "",
    
    [Parameter(Position=1)]
    [string]$Service = ""
)

# Configuration
$LOG_FILE = "./logs/deployment-manual-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"
$BACKUP_DIR = "./backups"

# Couleurs pour la console
function Write-ColorLog {
    param(
        [Parameter(Mandatory=$true)]
        [ValidateSet("INFO", "SUCCESS", "WARNING", "ERROR")]
        [string]$Level,
        
        [Parameter(Mandatory=$true)]
        [string]$Message
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    # Écrire dans le fichier de log
    $logMessage | Out-File -FilePath $LOG_FILE -Append -Encoding UTF8
    
    # Afficher dans la console avec couleurs
    switch ($Level) {
        "INFO"    { Write-Host "[$Level] $Message" -ForegroundColor Blue }
        "SUCCESS" { Write-Host "[$Level] $Message" -ForegroundColor Green }
        "WARNING" { Write-Host "[$Level] $Message" -ForegroundColor Yellow }
        "ERROR"   { Write-Host "[$Level] $Message" -ForegroundColor Red }
    }
}

# Fonction pour vérifier les prérequis
function Test-Prerequisites {
    Write-ColorLog -Level "INFO" -Message "Vérification des prérequis pour déploiement manuel..."
    
    # Vérifier Node.js
    try {
        $nodeVersion = node --version
        Write-ColorLog -Level "SUCCESS" -Message "Node.js détecté : $nodeVersion"
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Node.js n'est pas installé. Téléchargez depuis https://nodejs.org"
        return $false
    }
    
    # Vérifier pnpm
    try {
        $pnpmVersion = pnpm --version
        Write-ColorLog -Level "SUCCESS" -Message "pnpm détecté : $pnpmVersion"
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "pnpm non détecté. Installation..."
        npm install -g pnpm
    }
    
    # Vérifier les fichiers du projet
    if (-not (Test-Path "package.json")) {
        Write-ColorLog -Level "ERROR" -Message "package.json non trouvé. Êtes-vous dans le bon répertoire ?"
        return $false
    }
    
    return $true
}

# Fonction pour installer les dépendances
function Install-Dependencies {
    Write-ColorLog -Level "INFO" -Message "Installation des dépendances..."
    
    try {
        pnpm install
        Write-ColorLog -Level "SUCCESS" -Message "Dépendances installées avec succès"
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Erreur lors de l'installation des dépendances : $_"
        return $false
    }
    
    return $true
}

# Fonction pour construire le projet
function Build-Project {
    Write-ColorLog -Level "INFO" -Message "Construction du projet..."
    
    try {
        # Build de l'API
        Write-ColorLog -Level "INFO" -Message "Construction de l'API..."
        pnpm --filter api build
        
        # Build du frontend
        Write-ColorLog -Level "INFO" -Message "Construction du frontend..."
        pnpm --filter web build
        
        Write-ColorLog -Level "SUCCESS" -Message "Projet construit avec succès"
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Erreur lors de la construction : $_"
        return $false
    }
    
    return $true
}

# Fonction pour démarrer les services
function Start-Services {
    Write-ColorLog -Level "INFO" -Message "Démarrage des services en mode manuel..."
    
    # Créer les répertoires nécessaires
    if (-not (Test-Path $BACKUP_DIR)) {
        New-Item -ItemType Directory -Path $BACKUP_DIR -Force | Out-Null
    }
    if (-not (Test-Path "./logs")) {
        New-Item -ItemType Directory -Path "./logs" -Force | Out-Null
    }
    
    Write-ColorLog -Level "INFO" -Message "=== INSTRUCTIONS DE DÉMARRAGE MANUEL ==="
    Write-Host ""
    Write-Host "🔥 SERVICES À DÉMARRER MANUELLEMENT :" -ForegroundColor Yellow
    Write-Host ""
    
    Write-Host "1. 📊 BASE DE DONNÉES PostgreSQL :" -ForegroundColor Cyan
    Write-Host "   - Installer PostgreSQL depuis https://www.postgresql.org/download/"
    Write-Host "   - Créer une base de données 'cipfaro_production'"
    Write-Host "   - Configurer l'utilisateur et le mot de passe"
    Write-Host ""
    
    Write-Host "2. 🔴 REDIS :" -ForegroundColor Cyan
    Write-Host "   - Installer Redis depuis https://redis.io/download"
    Write-Host "   - Ou utiliser Redis Cloud (recommandé pour Windows)"
    Write-Host ""
    
    Write-Host "3. 🚀 API BACKEND :" -ForegroundColor Cyan
    Write-Host "   Dans un terminal PowerShell :"
    Write-Host "   cd D:\cipfaro-elearning"
    Write-Host "   pnpm --filter api start:prod"
    Write-Host ""
    
    Write-Host "4. 🌐 FRONTEND WEB :" -ForegroundColor Cyan
    Write-Host "   Dans un autre terminal PowerShell :"
    Write-Host "   cd D:\cipfaro-elearning"
    Write-Host "   pnpm --filter web start"
    Write-Host ""
    
    Write-Host "📝 CONFIGURATION REQUISE :" -ForegroundColor Yellow
    Write-Host "   - Copier .env.production vers .env.local dans apps/web/"
    Write-Host "   - Copier .env.production vers .env dans apps/api/"
    Write-Host "   - Ajuster les URLs de connexion dans ces fichiers"
    Write-Host ""
    
    Write-Host "🌟 ACCÈS AUX SERVICES :" -ForegroundColor Green
    Write-Host "   - Frontend: http://localhost:3000"
    Write-Host "   - API: http://localhost:3001"
    Write-Host ""
    
    Write-ColorLog -Level "SUCCESS" -Message "Instructions affichées. Suivez les étapes ci-dessus."
}

# Fonction pour vérifier la santé des services
function Test-ServicesHealth {
    Write-ColorLog -Level "INFO" -Message "Vérification de la santé des services..."
    
    $healthStatus = @{
        "Frontend" = $false
        "API" = $false
    }
    
    # Vérifier le frontend
    try {
        $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        if ($webResponse.StatusCode -eq 200) {
            $healthStatus["Frontend"] = $true
            Write-ColorLog -Level "SUCCESS" -Message "✅ Frontend est accessible sur http://localhost:3000"
        }
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "❌ Frontend non accessible sur http://localhost:3000"
    }
    
    # Vérifier l'API
    try {
        $apiResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
        if ($apiResponse.StatusCode -eq 200) {
            $healthStatus["API"] = $true
            Write-ColorLog -Level "SUCCESS" -Message "✅ API est accessible sur http://localhost:3001"
        }
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "❌ API non accessible sur http://localhost:3001/health"
    }
    
    # Afficher le résumé
    Write-Host ""
    Write-Host "ETAT DES SERVICES :" -ForegroundColor Yellow
    foreach ($service in $healthStatus.Keys) {
        $status = if ($healthStatus[$service]) { "ACTIF" } else { "INACTIF" }
        $color = if ($healthStatus[$service]) { "Green" } else { "Red" }
        Write-Host "   $service : $status" -ForegroundColor $color
    }
    
    return $healthStatus
}

# Fonction pour arrêter les services
function Stop-Services {
    Write-ColorLog -Level "INFO" -Message "Arrêt des services manuels..."
    
    try {
        # Tenter d'arrêter les processus Node.js
        $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            Write-ColorLog -Level "INFO" -Message "Arrêt des processus Node.js en cours..."
            $nodeProcesses | Stop-Process -Force
            Write-ColorLog -Level "SUCCESS" -Message "Processus Node.js arrêtés"
        }
        else {
            Write-ColorLog -Level "INFO" -Message "Aucun processus Node.js trouvé"
        }
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "Erreur lors de l'arrêt : $_"
    }
    
    Write-Host ""
    Write-Host "ARRET MANUEL REQUIS :" -ForegroundColor Yellow
    Write-Host "   - Fermez manuellement les terminaux des services"
    Write-Host "   - Arretez PostgreSQL et Redis si necessaire"
}

# Fonction principale
function Invoke-ManualDeployment {
    Write-ColorLog -Level "INFO" -Message "=== DÉPLOIEMENT MANUEL CIPFARO E-LEARNING ==="
    Write-ColorLog -Level "INFO" -Message "Mode : Déploiement sans Docker"
    
    if (-not (Test-Prerequisites)) {
        Write-ColorLog -Level "ERROR" -Message "Prérequis non satisfaits. Arrêt du déploiement."
        return $false
    }
    
    if (-not (Install-Dependencies)) {
        Write-ColorLog -Level "ERROR" -Message "Échec de l'installation des dépendances."
        return $false
    }
    
    if (-not (Build-Project)) {
        Write-ColorLog -Level "ERROR" -Message "Échec de la construction du projet."
        return $false
    }
    
    Start-Services
    
    Write-Host ""
    Write-ColorLog -Level "SUCCESS" -Message "=== DÉPLOIEMENT MANUEL PRÉPARÉ ==="
    Write-ColorLog -Level "INFO" -Message "Suivez les instructions ci-dessus pour démarrer les services."
    Write-ColorLog -Level "INFO" -Message "Utilisez 'health' pour vérifier l'état des services."
    
    return $true
}

# Fonction pour afficher l'aide
function Show-Help {
    Write-Host ""
    Write-Host "SCRIPT DE DEPLOIEMENT MANUEL - CIPFARO E-Learning" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "UTILISATION :" -ForegroundColor Yellow
    Write-Host "  .\scripts\deploy-manual.ps1 [ACTION]"
    Write-Host ""
    Write-Host "ACTIONS DISPONIBLES :" -ForegroundColor Yellow
    Write-Host "  (vide)    - Deploiement complet manuel"
    Write-Host "  start     - Afficher les instructions de demarrage"
    Write-Host "  stop      - Arreter les services Node.js"
    Write-Host "  health    - Verifier l'etat des services"
    Write-Host "  logs      - Afficher les logs"
    Write-Host ""
    Write-Host "EXEMPLES :" -ForegroundColor Yellow
    Write-Host "  .\scripts\deploy-manual.ps1"
    Write-Host "  .\scripts\deploy-manual.ps1 health"
    Write-Host "  .\scripts\deploy-manual.ps1 stop"
    Write-Host ""
}

# Gestion des actions
switch ($Action) {
    "start" {
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "health" {
        Test-ServicesHealth
    }
    "logs" {
        if (Test-Path $LOG_FILE) {
            Get-Content $LOG_FILE -Tail 50
        }
        else {
            Write-ColorLog -Level "WARNING" -Message "Aucun fichier de log trouvé."
        }
    }
    "help" {
        Show-Help
    }
    default {
        if ($Action -eq "") {
            Invoke-ManualDeployment
        }
        else {
            Write-ColorLog -Level "ERROR" -Message "Action inconnue : $Action"
            Show-Help
        }
    }
}