# Script d'installation WSL 2 pour Docker
# Doit etre execute en tant qu'Administrateur

Write-Host "=== INSTALLATION WSL 2 POUR DOCKER ===" -ForegroundColor Green
Write-Host ""

# Verification des privileges administrateur
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERREUR: Ce script doit etre execute en tant qu'Administrateur" -ForegroundColor Red
    Write-Host "Clic droit sur PowerShell > Executer en tant qu'administrateur" -ForegroundColor Yellow
    exit 1
}

Write-Host "Privileges administrateur detectes" -ForegroundColor Green
Write-Host ""

# Etape 1: Activer WSL
Write-Host "1. Activation de Windows Subsystem for Linux..." -ForegroundColor Yellow
try {
    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
    Write-Host "   WSL active avec succes" -ForegroundColor Green
} catch {
    Write-Host "   Erreur lors de l'activation de WSL" -ForegroundColor Red
    exit 1
}

# Etape 2: Activer Virtual Machine Platform
Write-Host "2. Activation de Virtual Machine Platform..." -ForegroundColor Yellow
try {
    dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
    Write-Host "   Virtual Machine Platform active avec succes" -ForegroundColor Green
} catch {
    Write-Host "   Erreur lors de l'activation de Virtual Machine Platform" -ForegroundColor Red
    exit 1
}

# Etape 3: Information sur le redemarrage
Write-Host ""
Write-Host "=== REDEMARRAGE REQUIS ===" -ForegroundColor Yellow
Write-Host "WSL 2 a ete configure avec succes !" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Un redemarrage est OBLIGATOIRE avant de continuer" -ForegroundColor Red
Write-Host ""
Write-Host "Apres le redemarrage, executer:" -ForegroundColor Cyan
Write-Host "1. .\scripts\configure-wsl2.ps1 (en tant qu'administrateur)" -ForegroundColor White
Write-Host "2. Puis installer Docker Desktop" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Voulez-vous redemarrer maintenant? (o/n)"
if ($choice -eq "o" -or $choice -eq "O" -or $choice -eq "oui") {
    Write-Host "Redemarrage en cours..." -ForegroundColor Green
    Restart-Computer -Force
} else {
    Write-Host "Redemarrage reporte. N'oubliez pas de redemarrer avant de continuer !" -ForegroundColor Yellow
}