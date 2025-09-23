# Script de deploiement LWS pour CIPFARO E-Learning depuis Windows

Write-Host "=== CIPFARO E-Learning - Deploiement LWS ===" -ForegroundColor Cyan
Write-Host ""

# Verification des prerequis
Write-Host "Verification des prerequis..." -ForegroundColor Yellow

# Verifier Git
try {
    $gitVersion = git --version
    Write-Host "Git installe: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "Git non installe! Telechargez-le sur https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Verifier SSH
try {
    ssh -V 2>&1 | Out-Null
    Write-Host "SSH client disponible" -ForegroundColor Green
} catch {
    Write-Host "SSH client non trouve! Utilisez Git Bash ou installez OpenSSH" -ForegroundColor Red
}

Write-Host ""
Write-Host "Informations importantes pour le deploiement LWS:" -ForegroundColor Cyan
Write-Host ""

# Avantages LWS
Write-Host "Avantages LWS:" -ForegroundColor Yellow
Write-Host "   - Hebergeur francais avec support en francais" -ForegroundColor Green
Write-Host "   - Conformite RGPD native" -ForegroundColor Green
Write-Host "   - Prix tres competitif: 23 euros/mois" -ForegroundColor Green
Write-Host "   - Datacenters en France" -ForegroundColor Green
Write-Host "   - SSL gratuit avec Let's Encrypt" -ForegroundColor Green
Write-Host "   - Sauvegardes automatiques" -ForegroundColor Green
Write-Host ""

# Configuration recommandee
Write-Host "Configuration recommandee:" -ForegroundColor Yellow
Write-Host "   - VPS Cloud 2: 2 vCPU, 4GB RAM, 80GB SSD" -ForegroundColor Gray
Write-Host "   - OS: Ubuntu 22.04 LTS" -ForegroundColor Gray
Write-Host "   - Prix: 19,99 euros/mois" -ForegroundColor Gray
Write-Host "   - Domaine .fr: 8,99 euros/an premiere annee gratuite" -ForegroundColor Gray
Write-Host ""

# Etapes de deploiement
Write-Host "Etapes de deploiement:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Commander votre VPS LWS:"
Write-Host "   https://www.lws.fr/serveur_dedie_linux.php" -ForegroundColor Blue
Write-Host ""
Write-Host "2. Une fois le VPS active, connectez-vous en SSH:"
Write-Host "   ssh root@VOTRE_IP_VPS" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Creer un utilisateur non-root:"
Write-Host "   adduser cipfaro" -ForegroundColor Gray
Write-Host "   usermod -aG sudo cipfaro" -ForegroundColor Gray
Write-Host "   su - cipfaro" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Executer le script de deploiement automatique:"
Write-Host "   wget https://raw.githubusercontent.com/cipfarorudy/cipfaro-elearning/main/deploy-lws.sh" -ForegroundColor Gray
Write-Host "   chmod +x deploy-lws.sh" -ForegroundColor Gray
Write-Host "   ./deploy-lws.sh" -ForegroundColor Gray
Write-Host ""

# Comparaison des couts
Write-Host "Comparaison des couts:" -ForegroundColor Yellow
Write-Host "   - LWS: 23 euros/mois" -ForegroundColor Green
Write-Host "   - DigitalOcean: 56 dollars/mois" -ForegroundColor Gray
Write-Host "   - Azure: 200 euros/mois" -ForegroundColor Gray
Write-Host ""

# Architecture
Write-Host "Architecture deployee:" -ForegroundColor Yellow
Write-Host "   - Frontend Next.js dans un container Docker" -ForegroundColor Gray
Write-Host "   - API Express.js dans un container Docker" -ForegroundColor Gray
Write-Host "   - Base de donnees PostgreSQL 15" -ForegroundColor Gray
Write-Host "   - Reverse proxy Nginx avec SSL" -ForegroundColor Gray
Write-Host "   - Monitoring et sauvegardes automatiques" -ForegroundColor Gray
Write-Host ""

# Fichiers crees
Write-Host "Fichiers de configuration crees:" -ForegroundColor Cyan
Write-Host "   - docker-compose.prod.yml - Orchestration Docker" -ForegroundColor Green
Write-Host "   - nginx/nginx.conf - Configuration Nginx" -ForegroundColor Green
Write-Host "   - .env.lws.example - Variables d'environnement" -ForegroundColor Green
Write-Host "   - deploy-lws.sh - Script de deploiement automatique" -ForegroundColor Green
Write-Host "   - DEPLOYMENT_LWS.md - Guide complet" -ForegroundColor Green
Write-Host ""

# Apres deploiement
Write-Host "Apres le deploiement:" -ForegroundColor Yellow
Write-Host "   1. Configurer les DNS pour pointer vers votre VPS" -ForegroundColor Gray
Write-Host "   2. Editer les variables d'environnement dans .env.production" -ForegroundColor Gray
Write-Host "   3. Configurer SMTP pour les emails" -ForegroundColor Gray
Write-Host "   4. Tester l'application complete" -ForegroundColor Gray
Write-Host ""

Write-Host "Tout est pret pour le deploiement sur LWS!" -ForegroundColor Green
Write-Host ""
Write-Host "Consultez DEPLOYMENT_LWS.md pour le guide detaille" -ForegroundColor Blue
Write-Host ""

# Pousser les changements sur GitHub
Write-Host "Voulez-vous pousser les modifications sur GitHub maintenant?" -ForegroundColor Yellow
$response = Read-Host "Cela permettra d'avoir les derniers fichiers LWS disponibles (o/n)"

if ($response -eq "o" -or $response -eq "O") {
    try {
        Write-Host "Ajout des fichiers..." -ForegroundColor Gray
        git add .
        
        Write-Host "Commit des modifications..." -ForegroundColor Gray
        git commit -m "feat: configuration deploiement LWS avec Docker Compose"
        
        Write-Host "Push vers GitHub..." -ForegroundColor Gray
        git push origin main
        
        Write-Host "Modifications poussees avec succes!" -ForegroundColor Green
    }
    catch {
        Write-Host "Erreur lors du push vers GitHub:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        Write-Host "Executez manuellement:" -ForegroundColor Yellow
        Write-Host "git add ." -ForegroundColor Gray
        Write-Host "git commit -m 'feat: configuration LWS'" -ForegroundColor Gray
        Write-Host "git push origin main" -ForegroundColor Gray
    }
}

# Demander si l'utilisateur veut ouvrir LWS
Write-Host ""
$response = Read-Host "Voulez-vous ouvrir le site LWS dans votre navigateur? (o/n)"
if ($response -eq "o" -or $response -eq "O") {
    Start-Process "https://www.lws.fr/serveur_dedie_linux.php"
    Write-Host "Site LWS VPS ouvert dans votre navigateur!" -ForegroundColor Green
}