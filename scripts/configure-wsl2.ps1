# Configuration post-redemarrage de WSL 2
# Doit etre execute APRES le redemarrage et en tant qu'Administrateur

Write-Host "=== CONFIGURATION WSL 2 POST-REDEMARRAGE ===" -ForegroundColor Green
Write-Host ""

# Verification des privileges administrateur
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "ERREUR: Ce script doit etre execute en tant qu'Administrateur" -ForegroundColor Red
    exit 1
}

# Verification de WSL
Write-Host "Verification de l'installation WSL..." -ForegroundColor Yellow
try {
    $wslStatus = wsl --status 2>&1
    Write-Host "WSL detecte" -ForegroundColor Green
} catch {
    Write-Host "WSL non detecte, configuration en cours..." -ForegroundColor Yellow
}

# Configuration WSL 2 comme version par defaut
Write-Host "Configuration de WSL 2 comme version par defaut..." -ForegroundColor Yellow
try {
    wsl --set-default-version 2
    Write-Host "WSL 2 configure comme version par defaut" -ForegroundColor Green
} catch {
    Write-Host "Erreur lors de la configuration WSL 2" -ForegroundColor Red
}

# Installation Ubuntu (optionnel)
Write-Host ""
$installUbuntu = Read-Host "Voulez-vous installer Ubuntu pour WSL? (recommande) (o/n)"
if ($installUbuntu -eq "o" -or $installUbuntu -eq "O" -or $installUbuntu -eq "oui") {
    Write-Host "Installation d'Ubuntu..." -ForegroundColor Yellow
    try {
        wsl --install -d Ubuntu
        Write-Host "Ubuntu installe avec succes" -ForegroundColor Green
    } catch {
        Write-Host "Erreur lors de l'installation d'Ubuntu" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== WSL 2 CONFIGURE AVEC SUCCES ===" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines etapes:" -ForegroundColor Cyan
Write-Host "1. Telecharger Docker Desktop: https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe" -ForegroundColor White
Write-Host "2. Executer l'installateur Docker Desktop" -ForegroundColor White
Write-Host "3. Cocher 'Enable WSL 2 Windows Features' lors de l'installation" -ForegroundColor White
Write-Host "4. Redemarrer si demande" -ForegroundColor White
Write-Host "5. Executer: .\scripts\verify-docker.ps1" -ForegroundColor White