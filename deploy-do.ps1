# Script de deploiement DigitalOcean pour CIPFARO E-Learning

Write-Host "=== CIPFARO E-Learning - Deploiement DigitalOcean ===" -ForegroundColor Cyan
Write-Host ""

# Verification des prerequis
Write-Host "Verification des prerequis..." -ForegroundColor Yellow

# Verifier Git
try {
    $gitVersion = git --version
    Write-Host "Git installe: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git non installe!" -ForegroundColor Red
    exit 1
}

# Verifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "Node.js installe: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Node.js non installe!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Tous les prerequis sont installes!" -ForegroundColor Green
Write-Host ""

# Instructions de deploiement
Write-Host "Instructions de deploiement:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Creer un compte DigitalOcean:"
Write-Host "   https://www.digitalocean.com/" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Pousser le code sur GitHub:"
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'feat: configuration DigitalOcean'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Creer une App sur DigitalOcean:"
Write-Host "   - Aller sur App Platform" -ForegroundColor Gray
Write-Host "   - Cliquer Create App" -ForegroundColor Gray
Write-Host "   - Selectionner GitHub: cipfarorudy/cipfaro-elearning" -ForegroundColor Gray
Write-Host "   - Importer le fichier .do/app.yaml" -ForegroundColor Gray
Write-Host ""

# Couts estimes
Write-Host "Couts estimes:" -ForegroundColor Yellow
Write-Host "   - App Platform 2 services: 24 dollars/mois" -ForegroundColor Gray
Write-Host "   - PostgreSQL 1GB: 15 dollars/mois" -ForegroundColor Gray
Write-Host "   - Spaces 250GB: 5 dollars/mois" -ForegroundColor Gray
Write-Host "   - Load Balancer: 12 dollars/mois" -ForegroundColor Gray
Write-Host "   - TOTAL: environ 56 dollars/mois" -ForegroundColor Green
Write-Host ""

# Avantages DigitalOcean
Write-Host "Avantages DigitalOcean:" -ForegroundColor Cyan
Write-Host "   - 3x moins cher qu'Azure" -ForegroundColor Green
Write-Host "   - Interface simple et intuitive" -ForegroundColor Green
Write-Host "   - Deploiement en 15 minutes" -ForegroundColor Green
Write-Host "   - SSL gratuit avec Let's Encrypt" -ForegroundColor Green
Write-Host "   - Scaling automatique" -ForegroundColor Green
Write-Host ""

# Fichiers crees
Write-Host "Fichiers de configuration crees:" -ForegroundColor Cyan
Write-Host "   - .do/app.yaml - Configuration App Platform" -ForegroundColor Green
Write-Host "   - .env.production - Variables d'environnement" -ForegroundColor Green
Write-Host "   - DEPLOYMENT_DO.md - Guide complet" -ForegroundColor Green
Write-Host "   - Dockerfiles optimises pour le port 8080" -ForegroundColor Green
Write-Host ""

Write-Host "Tout est pret pour le deploiement sur DigitalOcean!" -ForegroundColor Green
Write-Host ""
Write-Host "Consultez DEPLOYMENT_DO.md pour le guide complet" -ForegroundColor Blue
Write-Host ""

# Demander si l'utilisateur veut continuer
$response = Read-Host "Voulez-vous ouvrir DigitalOcean dans votre navigateur? (o/n)"
if ($response -eq "o" -or $response -eq "O") {
    Start-Process "https://cloud.digitalocean.com/apps"
    Write-Host "DigitalOcean App Platform ouvert!" -ForegroundColor Green
}