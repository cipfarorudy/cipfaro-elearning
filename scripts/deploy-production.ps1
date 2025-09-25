# ===================================================================
# Script de déploiement production - CIPFARO E-Learning (PowerShell)
# ===================================================================

param(
    [Parameter(Position=0)]
    [ValidateSet("", "start", "stop", "restart", "backup", "health", "logs")]
    [string]$Action = "",
    
    [Parameter(Position=1)]
    [string]$Service = ""
)

# Configuration
$ENVIRONMENT = if ($env:ENVIRONMENT) { $env:ENVIRONMENT } else { "production" }
$COMPOSE_FILE = "docker-compose.production.yml"
$ENV_FILE = ".env.production"
$BACKUP_DIR = "./backups"
$LOG_FILE = "./logs/deployment-$(Get-Date -Format 'yyyyMMdd-HHmmss').log"

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
    Write-ColorLog -Level "INFO" -Message "Vérification des prérequis..."
    
    # Vérifier Docker
    try {
        $dockerVersion = docker --version
        if (-not $dockerVersion) {
            throw "Docker n'est pas disponible"
        }
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Docker n'est pas installé ou n'est pas dans le PATH"
        exit 1
    }
    
    # Vérifier Docker Compose
    try {
        $composeVersion = docker-compose --version
        if (-not $composeVersion) {
            throw "Docker Compose n'est pas disponible"
        }
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Docker Compose n'est pas installé ou n'est pas dans le PATH"
        exit 1
    }
    
    # Vérifier le fichier de configuration
    if (-not (Test-Path $ENV_FILE)) {
        Write-ColorLog -Level "ERROR" -Message "Fichier de configuration manquant: $ENV_FILE"
        Write-ColorLog -Level "INFO" -Message "Créez ce fichier avec les variables d'environnement nécessaires"
        exit 1
    }
    
    # Vérifier le fichier docker-compose
    if (-not (Test-Path $COMPOSE_FILE)) {
        Write-ColorLog -Level "ERROR" -Message "Fichier Docker Compose manquant: $COMPOSE_FILE"
        exit 1
    }
    
    Write-ColorLog -Level "SUCCESS" -Message "Tous les prérequis sont satisfaits"
}

# Fonction pour créer les répertoires nécessaires
function New-RequiredDirectories {
    Write-ColorLog -Level "INFO" -Message "Création des répertoires nécessaires..."
    
    $directories = @(
        $BACKUP_DIR,
        "./logs",
        "./infra/nginx/ssl",
        "./infra/grafana",
        "./infra/prometheus"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-ColorLog -Level "SUCCESS" -Message "Répertoires créés avec succès"
}

# Fonction pour effectuer une sauvegarde
function Backup-Database {
    Write-ColorLog -Level "INFO" -Message "Sauvegarde de la base de données..."
    
    $backupFile = "$BACKUP_DIR/database-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss').sql"
    
    try {
        $dbStatus = docker-compose -f $COMPOSE_FILE ps | Select-String "db.*Up"
        if ($dbStatus) {
            docker-compose -f $COMPOSE_FILE exec -T db pg_dump -U cipfaro cipfaro_production | Out-File -FilePath $backupFile -Encoding UTF8
            Write-ColorLog -Level "SUCCESS" -Message "Sauvegarde créée: $backupFile"
        }
        else {
            Write-ColorLog -Level "WARNING" -Message "Base de données non disponible pour la sauvegarde"
        }
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "Erreur lors de la sauvegarde: $_"
    }
}

# Fonction pour valider la configuration
function Test-Configuration {
    Write-ColorLog -Level "INFO" -Message "Validation de la configuration..."
    
    # Validation du fichier docker-compose
    try {
        $configTest = docker-compose -f $COMPOSE_FILE config 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "Configuration Docker Compose invalide"
        }
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Configuration Docker Compose invalide: $_"
        exit 1
    }
    
    # Vérification des variables d'environnement critiques
    $envContent = Get-Content $ENV_FILE
    $requiredVars = @("DB_PASSWORD", "REDIS_PASSWORD", "JWT_SECRET", "NEXTAUTH_SECRET")
    
    foreach ($var in $requiredVars) {
        $varFound = $envContent | Where-Object { $_ -match "^$var=" }
        if (-not $varFound) {
            Write-ColorLog -Level "ERROR" -Message "Variable d'environnement manquante: $var"
            exit 1
        }
    }
    
    Write-ColorLog -Level "SUCCESS" -Message "Configuration validée avec succès"
}

# Fonction pour construire les images
function Build-Images {
    Write-ColorLog -Level "INFO" -Message "Construction des images Docker..."
    
    try {
        docker-compose -f $COMPOSE_FILE build --no-cache --parallel
        if ($LASTEXITCODE -ne 0) {
            throw "Erreur lors de la construction des images"
        }
        Write-ColorLog -Level "SUCCESS" -Message "Images construites avec succès"
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Erreur lors de la construction: $_"
        exit 1
    }
}

# Fonction pour arrêter les services
function Stop-Services {
    Write-ColorLog -Level "INFO" -Message "Arrêt des services existants..."
    
    try {
        $runningServices = docker-compose -f $COMPOSE_FILE ps | Select-String "Up"
        if ($runningServices) {
            docker-compose -f $COMPOSE_FILE down --remove-orphans
        }
        Write-ColorLog -Level "SUCCESS" -Message "Services arrêtés"
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "Erreur lors de l'arrêt: $_"
    }
}

# Fonction pour démarrer les services
function Start-Services {
    Write-ColorLog -Level "INFO" -Message "Démarrage des services de production..."
    
    try {
        # Démarrage des services de base
        docker-compose -f $COMPOSE_FILE up -d db redis minio
        
        # Attendre que les services de base soient prêts
        Write-ColorLog -Level "INFO" -Message "Attente de la disponibilité des services de base..."
        Start-Sleep -Seconds 30
        
        # Démarrage des services applicatifs
        docker-compose -f $COMPOSE_FILE up -d api web
        
        # Attendre que les services applicatifs soient prêts
        Write-ColorLog -Level "INFO" -Message "Attente de la disponibilité des services applicatifs..."
        Start-Sleep -Seconds 20
        
        # Démarrage des services de monitoring et proxy
        docker-compose -f $COMPOSE_FILE up -d nginx grafana prometheus
        
        Write-ColorLog -Level "SUCCESS" -Message "Services démarrés avec succès"
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Erreur lors du démarrage: $_"
        exit 1
    }
}

# Fonction pour vérifier la santé des services
function Test-ServicesHealth {
    Write-ColorLog -Level "INFO" -Message "Vérification de la santé des services..."
    
    $maxAttempts = 30
    $attempt = 1
    
    while ($attempt -le $maxAttempts) {
        Write-ColorLog -Level "INFO" -Message "Tentative $attempt/$maxAttempts..."
        
        try {
            # Vérifier l'API
            $apiResponse = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction Stop
            if ($apiResponse.StatusCode -eq 200) {
                Write-ColorLog -Level "SUCCESS" -Message "API est opérationnelle"
                break
            }
        }
        catch {
            if ($attempt -eq $maxAttempts) {
                Write-ColorLog -Level "ERROR" -Message "L'API n'est pas opérationnelle après $maxAttempts tentatives"
                return $false
            }
        }
        
        $attempt++
        Start-Sleep -Seconds 10
    }
    
    # Vérifier le frontend
    try {
        $webResponse = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
        if ($webResponse.StatusCode -eq 200) {
            Write-ColorLog -Level "SUCCESS" -Message "Frontend est opérationnel"
        }
    }
    catch {
        Write-ColorLog -Level "WARNING" -Message "Frontend n'est pas accessible"
    }
    
    Write-ColorLog -Level "SUCCESS" -Message "Vérification de santé terminée"
    return $true
}

# Fonction pour exécuter les migrations
function Invoke-Migrations {
    Write-ColorLog -Level "INFO" -Message "Exécution des migrations de base de données..."
    
    try {
        docker-compose -f $COMPOSE_FILE exec -T api pnpm prisma migrate deploy
        Write-ColorLog -Level "SUCCESS" -Message "Migrations exécutées avec succès"
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Erreur lors des migrations: $_"
        exit 1
    }
}

# Fonction pour afficher les informations de déploiement
function Show-DeploymentInfo {
    Write-ColorLog -Level "INFO" -Message "=== INFORMATIONS DE DÉPLOIEMENT ==="
    Write-Host ""
    Write-Host "🌐 Application Web: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 API Backend: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "📊 Monitoring Grafana: http://localhost:3001" -ForegroundColor Cyan
    Write-Host "📈 Prometheus: http://localhost:9090" -ForegroundColor Cyan
    Write-Host "💾 MinIO Console: http://localhost:9001" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Statut des conteneurs:" -ForegroundColor Yellow
    docker-compose -f $COMPOSE_FILE ps
    Write-Host ""
    Write-Host "💿 Utilisation du disque:" -ForegroundColor Yellow
    docker system df
    Write-Host ""
    Write-Host "📝 Logs de déploiement: $LOG_FILE" -ForegroundColor Yellow
    Write-Host ""
    Write-ColorLog -Level "SUCCESS" -Message "Déploiement terminé avec succès!"
}

# Fonction de nettoyage en cas d'erreur
function Invoke-CleanupOnError {
    Write-ColorLog -Level "ERROR" -Message "Erreur détectée, nettoyage en cours..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans
    Write-ColorLog -Level "INFO" -Message "Nettoyage terminé"
    exit 1
}

# Fonction principale
function Invoke-MainDeployment {
    try {
        Write-ColorLog -Level "INFO" -Message "=== DÉBUT DU DÉPLOIEMENT PRODUCTION CIPFARO E-LEARNING ==="
        Write-ColorLog -Level "INFO" -Message "Environnement: $ENVIRONMENT"
        Write-ColorLog -Level "INFO" -Message "Fichier de configuration: $ENV_FILE"
        Write-ColorLog -Level "INFO" -Message "Fichier Docker Compose: $COMPOSE_FILE"
        
        Test-Prerequisites
        New-RequiredDirectories
        Test-Configuration
        Backup-Database
        Stop-Services
        Build-Images
        Start-Services
        Invoke-Migrations
        $healthCheck = Test-ServicesHealth
        
        if ($healthCheck) {
            Show-DeploymentInfo
            Write-ColorLog -Level "SUCCESS" -Message "=== DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ==="
        }
        else {
            Invoke-CleanupOnError
        }
    }
    catch {
        Write-ColorLog -Level "ERROR" -Message "Erreur fatale: $_"
        Invoke-CleanupOnError
    }
}

# Gestion des actions
switch ($Action) {
    "start" {
        Start-Services
    }
    "stop" {
        Stop-Services
    }
    "restart" {
        Stop-Services
        Start-Services
    }
    "backup" {
        Backup-Database
    }
    "health" {
        Test-ServicesHealth
    }
    "logs" {
        if ($Service) {
            docker-compose -f $COMPOSE_FILE logs -f $Service
        }
        else {
            docker-compose -f $COMPOSE_FILE logs -f
        }
    }
    default {
        Invoke-MainDeployment
    }
}