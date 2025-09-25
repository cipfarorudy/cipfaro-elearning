# 🚀 Script de démarrage CIPFARO E-Learning Stack Docker (Windows)
# Usage: .\start-stack.ps1 [dev|prod|stop|logs]

param(
    [Parameter(Position=0)]
    [ValidateSet("dev", "prod", "stop", "clean", "logs", "status", "help")]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$ServiceName = ""
)

# Fonction d'affichage avec couleurs
function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "[ERROR] $message" -ForegroundColor Red
}

# Vérifier que Docker est installé et en marche
function Test-Docker {
    try {
        $null = Get-Command docker -ErrorAction Stop
        $null = docker info 2>$null
        Write-Success "Docker est prêt"
        return $true
    }
    catch {
        Write-Error "Docker n'est pas installé ou n'est pas en marche"
        return $false
    }
}

# Vérifier les ports
function Test-Ports {
    $ports = @(80, 3000, 4000, 5432, 6379, 9000, 9001, 9090, 3001)
    $occupiedPorts = @()
    
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            $occupiedPorts += $port
        }
    }
    
    if ($occupiedPorts.Count -gt 0) {
        Write-Warning "Ports occupés : $($occupiedPorts -join ', ')"
        $response = Read-Host "Voulez-vous continuer ? (y/N)"
        if ($response -ne "y" -and $response -ne "Y") {
            exit 1
        }
    }
}

# Démarrage mode développement
function Start-Dev {
    Write-Info "Démarrage en mode développement..."
    
    # Override pour développement
    $env:NODE_ENV = "development"
    $env:DATABASE_URL = "postgresql://cipfaro:changeme@localhost:5432/cipfaro?schema=public"
    
    docker compose up -d postgres redis minio minio-setup prometheus grafana
    
    Write-Success "Services infrastructure démarrés"
    Write-Info "Démarrez api et web manuellement avec 'pnpm dev'"
}

# Démarrage mode production
function Start-Prod {
    Write-Info "Démarrage en mode production..."
    
    # Vérifier le fichier .env
    if (-not (Test-Path .env)) {
        Write-Warning "Fichier .env manquant, utilisation des valeurs par défaut"
    }
    
    # Build et démarrage de tous les services
    Write-Info "Building images Docker..."
    docker compose build --no-cache
    
    Write-Info "Démarrage des services..."
    docker compose up -d
    
    # Attendre que PostgreSQL soit prêt
    Write-Info "Attente de PostgreSQL..."
    $timeout = 60
    while ($timeout -gt 0) {
        $result = docker compose exec postgres pg_isready -U cipfaro -d cipfaro 2>$null
        if ($LASTEXITCODE -eq 0) {
            break
        }
        Start-Sleep 2
        $timeout -= 2
    }
    
    if ($timeout -le 0) {
        Write-Error "PostgreSQL n'a pas démarré dans les temps"
        exit 1
    }
    
    # Initialiser la base de données
    Write-Info "Initialisation de la base de données..."
    docker compose exec api pnpm prisma:generate
    docker compose exec api pnpm prisma:migrate
    docker compose exec api pnpm prisma:seed
    
    Write-Success "Stack démarrée avec succès !"
    
    # Afficher les URLs
    Write-Host ""
    Write-Host "🌐 Services disponibles :" -ForegroundColor Cyan
    Write-Host "   Application :  http://localhost"
    Write-Host "   API :          http://localhost/api"
    Write-Host "   MinIO Console: http://localhost:9001"
    Write-Host "   Prometheus :   http://localhost:9090"
    Write-Host "   Grafana :      http://localhost:3001"
    Write-Host ""
    Write-Host "🔐 Comptes de test :" -ForegroundColor Cyan
    Write-Host "   Admin :     admin@cipfaro.fr / admin123"
    Write-Host "   Formateur : formateur@cipfaro.fr / formateur123"
    Write-Host "   Stagiaire : stagiaire@cipfaro.fr / stagiaire123"
}

# Arrêt des services
function Stop-Services {
    Write-Info "Arrêt des services..."
    docker compose down
    Write-Success "Services arrêtés"
}

# Arrêt complet avec suppression des volumes
function Stop-All {
    Write-Warning "Arrêt complet avec suppression des données"
    $response = Read-Host "Êtes-vous sûr ? Toutes les données seront perdues (y/N)"
    if ($response -eq "y" -or $response -eq "Y") {
        docker compose down -v
        docker system prune -f
        Write-Success "Nettoyage complet effectué"
    }
}

# Affichage des logs
function Show-Logs($serviceName) {
    if ($serviceName) {
        docker compose logs -f $serviceName
    } else {
        docker compose logs -f
    }
}

# Affichage de l'aide
function Show-Help {
    Write-Host "Usage: .\start-stack.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  dev      Démarrer en mode développement (infra seulement)"
    Write-Host "  prod     Démarrer en mode production (stack complète)"
    Write-Host "  stop     Arrêter les services"
    Write-Host "  clean    Arrêt complet avec suppression des données"
    Write-Host "  logs     Afficher les logs (optionnel: nom du service)"
    Write-Host "  status   Afficher l'etat des services"
    Write-Host "  help     Afficher cette aide"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\start-stack.ps1 prod         # Démarrage production"
    Write-Host "  .\start-stack.ps1 logs api     # Logs du service API"
    Write-Host "  .\start-stack.ps1 stop         # Arrêt des services"
}

# Fonction principale
if (-not (Test-Docker)) {
    exit 1
}

switch ($Command) {
    "dev" {
        Test-Ports
        Start-Dev
    }
    "prod" {
        Test-Ports
        Start-Prod
    }
    "stop" {
        Stop-Services
    }
    "clean" {
        Stop-All
    }
    "logs" {
        Show-Logs $ServiceName
    }
    "status" {
        docker compose ps
    }
    default {
        Show-Help
    }
}