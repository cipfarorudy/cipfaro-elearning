# CIPFARO E-Learning Stack Docker - Script PowerShell simplifie
param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Write-Info($message) {
    Write-Host "[INFO] $message" -ForegroundColor Blue
}

function Write-Success($message) {
    Write-Host "[SUCCESS] $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "[WARNING] $message" -ForegroundColor Yellow
}

function Start-Dev {
    Write-Info "Demarrage infrastructure seulement..."
    docker compose up -d postgres redis minio minio-setup prometheus grafana
    Write-Success "Infrastructure demarree - Lancez 'pnpm dev' pour api et web"
}

function Start-Prod {
    Write-Info "Demarrage stack complete..."
    docker compose up -d --build
    Write-Success "Stack complete demarree !"
    Write-Host ""
    Write-Host "URLs disponibles:" -ForegroundColor Cyan
    Write-Host "  Application : http://localhost"
    Write-Host "  API direct  : http://localhost:4000"
    Write-Host "  MinIO       : http://localhost:9001"
    Write-Host "  Prometheus  : http://localhost:9090"
    Write-Host "  Grafana     : http://localhost:3001"
}

function Stop-Services {
    Write-Info "Arret des services..."
    docker compose down
    Write-Success "Services arretes"
}

function Show-Status {
    docker compose ps
}

function Show-Logs {
    docker compose logs -f
}

function Show-Help {
    Write-Host "Usage: .\docker-start.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  dev      Infrastructure seulement"
    Write-Host "  prod     Stack complete"
    Write-Host "  stop     Arreter services"
    Write-Host "  status   Etat des services"
    Write-Host "  logs     Afficher logs"
    Write-Host "  help     Cette aide"
}

# Execution
switch ($Command.ToLower()) {
    "dev" { Start-Dev }
    "prod" { Start-Prod }
    "stop" { Stop-Services }
    "status" { Show-Status }
    "logs" { Show-Logs }
    default { Show-Help }
}