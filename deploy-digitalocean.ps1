# 🌊 Script de Déploiement DigitalOcean
# Guide rapide pour déployer CIPFARO E-Learning

Write-Host "🌊 CIPFARO E-Learning - Déploiement DigitalOcean" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Vérification des prérequis
Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git n'est pas installé!" -ForegroundColor Red
    exit 1
}

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé!" -ForegroundColor Red
    exit 1
}

# Vérifier pnpm
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm n'est pas installé!" -ForegroundColor Red
    Write-Host "   Installez avec: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Prêt pour le déploiement!" -ForegroundColor Green
Write-Host ""

# Instructions de déploiement
Write-Host "📝 Instructions de déploiement:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🔐 Créer un compte DigitalOcean:"
Write-Host "   https://www.digitalocean.com/" -ForegroundColor Blue
Write-Host ""
Write-Host "2. 📦 Pousser le code sur GitHub:"
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'feat: configuration DigitalOcean App Platform'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 🌊 Créer une App sur DigitalOcean:"
Write-Host "   - Aller sur App Platform" -ForegroundColor Gray
Write-Host "   - Cliquer 'Create App'" -ForegroundColor Gray
Write-Host "   - Sélectionner GitHub: cipfarorudy/cipfaro-elearning" -ForegroundColor Gray
Write-Host "   - Importer le fichier .do/app.yaml" -ForegroundColor Gray
Write-Host ""
Write-Host "4. 🔧 Configurer les variables d'environnement:"
Write-Host "   - cipfaro_jwt_secret: GENERER UN SECRET SECURISE" -ForegroundColor Gray
Write-Host ""
Write-Host "5. 💾 Créer un Space pour le stockage:"
Write-Host "   - Nom: cipfaro-scorm" -ForegroundColor Gray
Write-Host "   - Région: fra1 Frankfurt" -ForegroundColor Gray
Write-Host "   - CDN: Activé" -ForegroundColor Gray
Write-Host ""
Write-Host "6. 🌐 Configurer le domaine cipfaro.fr:"
Write-Host "   - Ajouter le domaine dans App Platform" -ForegroundColor Gray
Write-Host "   - Configurer les DNS CNAME/ALIAS" -ForegroundColor Gray
Write-Host ""

# Informations sur les coûts
Write-Host "💰 Coûts estimés:" -ForegroundColor Yellow
Write-Host "   - App Platform 2 services: 24 dollars/mois" -ForegroundColor Gray
Write-Host "   - PostgreSQL 1GB: 15 dollars/mois" -ForegroundColor Gray
Write-Host "   - Spaces 250GB: 5 dollars/mois" -ForegroundColor Gray
Write-Host "   - Load Balancer: 12 dollars/mois" -ForegroundColor Gray
Write-Host "   - TOTAL: environ 56 dollars/mois vs 200 euros/mois Azure" -ForegroundColor Green
Write-Host ""

# Avantages DigitalOcean
Write-Host "✨ Avantages DigitalOcean:" -ForegroundColor Cyan
Write-Host "   ✅ 3x moins cher qu'Azure" -ForegroundColor Green
Write-Host "   ✅ Interface simple et intuitive" -ForegroundColor Green
Write-Host "   ✅ Déploiement en 15 minutes" -ForegroundColor Green
Write-Host "   ✅ SSL gratuit avec Let's Encrypt" -ForegroundColor Green
Write-Host "   ✅ Scaling automatique" -ForegroundColor Green
Write-Host "   ✅ Monitoring intégré" -ForegroundColor Green
Write-Host ""

# Fichiers importants
Write-Host "📁 Fichiers de configuration créés:" -ForegroundColor Cyan
Write-Host "   ✅ .do/app.yaml - Configuration App Platform" -ForegroundColor Green
Write-Host "   ✅ .env.production - Variables d'environnement" -ForegroundColor Green
Write-Host "   ✅ DEPLOYMENT_DO.md - Guide complet" -ForegroundColor Green
Write-Host "   ✅ Dockerfiles optimisés pour le port 8080" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Tout est prêt pour le déploiement sur DigitalOcean!" -ForegroundColor Green
Write-Host ""
Write-Host "📖 Consultez DEPLOYMENT_DO.md pour le guide complet" -ForegroundColor Blue
Write-Host ""

# Demander si l'utilisateur veut continuer
$response = Read-Host "Voulez-vous ouvrir DigitalOcean dans votre navigateur? o/n"
if ($response -eq "o" -or $response -eq "O" -or $response -eq "oui") {
    Start-Process "https://cloud.digitalocean.com/apps"
    Write-Host "🌐 DigitalOcean App Platform ouvert dans votre navigateur!" -ForegroundColor Green
}