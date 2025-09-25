# Guide de Mise en Production - CIPFARO E-Learning

## 📋 Vue d'ensemble

Ce guide détaille le processus complet de mise en production de la plateforme CIPFARO E-Learning, incluant l'installation des prérequis, la configuration et le déploiement.

## 🚀 Prérequis Système

### Installation Docker (Windows)
1. **Télécharger Docker Desktop** depuis [docker.com](https://www.docker.com/products/docker-desktop/)
2. **Installer Docker Desktop** avec les options WSL 2
3. **Redémarrer le système** après installation
4. **Vérifier l'installation** :
   ```powershell
   docker --version
   docker-compose --version
   ```

### Installation Docker (Linux)
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

## 📁 Structure des Fichiers de Production

```
cipfaro-elearning/
├── .env.production                    # Variables d'environnement production
├── docker-compose.production.yml      # Configuration Docker production
├── apps/
│   ├── api/Dockerfile.production      # Dockerfile API optimisé
│   └── web/Dockerfile.production      # Dockerfile Web optimisé
├── infra/
│   └── nginx/
│       ├── nginx.prod.conf           # Configuration Nginx production
│       └── ssl/                      # Certificats SSL
└── scripts/
    ├── deploy-production.sh          # Script déploiement Linux/Mac
    └── deploy-production.ps1         # Script déploiement Windows
```

## ⚙️ Configuration Production

### 1. Variables d'Environnement

Copiez et configurez le fichier `.env.production` :

```bash
# === Configuration Base de Données ===
DB_HOST=db
DB_PORT=5432
DB_NAME=cipfaro_production
DB_USER=cipfaro
DB_PASSWORD=VotreMotDePasseSecurise123!
DATABASE_URL=postgresql://cipfaro:VotreMotDePasseSecurise123!@db:5432/cipfaro_production

# === Configuration Redis ===
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=VotreRedisPassword123!
REDIS_URL=redis://:VotreRedisPassword123!@redis:6379

# === Sécurité ===
JWT_SECRET=VotreCleSecretJWT_SuperSecurisee_2024!
NEXTAUTH_SECRET=VotreCleNextAuth_TresSecurisee_2024!
NEXTAUTH_URL=https://votre-domaine.com

# === Configuration Email ===
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=VotreMotDePasseEmail
EMAIL_FROM=noreply@votre-domaine.com

# === Stockage S3/MinIO ===
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=VotreMinioPassword123!
S3_BUCKET_NAME=cipfaro-files
S3_REGION=eu-west-1

# === Configuration Monitoring ===
GRAFANA_PASSWORD=VotreGrafanaPassword123!
```

### 2. Certificats SSL

Placez vos certificats SSL dans `infra/nginx/ssl/` :
- `fullchain.pem` : Certificat complet
- `privkey.pem` : Clé privée

## 🐳 Déploiement avec Docker

### Déploiement Automatique (Recommandé)

**Windows PowerShell :**
```powershell
# Déploiement complet
.\scripts\deploy-production.ps1

# Actions spécifiques
.\scripts\deploy-production.ps1 start    # Démarrer les services
.\scripts\deploy-production.ps1 stop     # Arrêter les services
.\scripts\deploy-production.ps1 restart  # Redémarrer les services
.\scripts\deploy-production.ps1 backup   # Sauvegarder la base
.\scripts\deploy-production.ps1 health   # Vérifier la santé
.\scripts\deploy-production.ps1 logs api # Voir les logs d'un service
```

**Linux/Mac :**
```bash
# Rendre le script exécutable
chmod +x scripts/deploy-production.sh

# Déploiement complet
./scripts/deploy-production.sh

# Actions spécifiques
./scripts/deploy-production.sh start
./scripts/deploy-production.sh stop
./scripts/deploy-production.sh restart
./scripts/deploy-production.sh backup
./scripts/deploy-production.sh health
./scripts/deploy-production.sh logs api
```

### Déploiement Manuel

Si vous préférez un déploiement étape par étape :

```bash
# 1. Validation de la configuration
docker-compose -f docker-compose.production.yml config

# 2. Construction des images
docker-compose -f docker-compose.production.yml build --no-cache

# 3. Démarrage des services de base
docker-compose -f docker-compose.production.yml up -d db redis minio

# 4. Attendre que les services soient prêts (30 secondes)
sleep 30

# 5. Démarrage des services applicatifs
docker-compose -f docker-compose.production.yml up -d api web

# 6. Exécution des migrations
docker-compose -f docker-compose.production.yml exec api pnpm prisma migrate deploy

# 7. Démarrage des services de monitoring
docker-compose -f docker-compose.production.yml up -d nginx grafana prometheus

# 8. Vérification de la santé
curl http://localhost:3001/health
curl http://localhost:3000
```

## 🔍 Validation du Déploiement

### URLs de Vérification
- **Application Web** : http://localhost:3000
- **API Backend** : http://localhost:3001/health
- **Monitoring Grafana** : http://localhost:3001 (monitoring.votre-domaine.com)
- **Prometheus** : http://localhost:9090
- **MinIO Console** : http://localhost:9001

### Commandes de Diagnostic

```bash
# Statut des conteneurs
docker-compose -f docker-compose.production.yml ps

# Logs des services
docker-compose -f docker-compose.production.yml logs -f api
docker-compose -f docker-compose.production.yml logs -f web

# Utilisation des ressources
docker stats

# Espace disque
docker system df
```

## 📊 Monitoring et Maintenance

### Surveillance Continue

1. **Grafana Dashboard** : Accédez à `monitoring.votre-domaine.com`
2. **Logs Centralisés** : Vérifiez le dossier `./logs/`
3. **Métriques Prometheus** : Consultez `http://localhost:9090`

### Sauvegardes Automatiques

Le script de déploiement crée automatiquement des sauvegardes :
- **Base de données** : `./backups/database-backup-YYYYMMDD-HHMMSS.sql`
- **Logs de déploiement** : `./logs/deployment-YYYYMMDD-HHMMSS.log`

### Mise à Jour

```bash
# 1. Sauvegarder la base de données
./scripts/deploy-production.sh backup

# 2. Arrêter les services
./scripts/deploy-production.sh stop

# 3. Mettre à jour le code
git pull origin main

# 4. Redéployer
./scripts/deploy-production.sh
```

## 🔒 Sécurité Production

### Recommandations Critiques

1. **Changez tous les mots de passe par défaut**
2. **Utilisez des certificats SSL valides**
3. **Configurez un firewall approprié**
4. **Activez les logs de sécurité**
5. **Surveillez les métriques de sécurité**

### Configuration Firewall (UFW - Ubuntu)

```bash
# Autoriser les ports nécessaires
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 22/tcp   # SSH (si nécessaire)

# Activer le firewall
sudo ufw enable
```

## 🚨 Dépannage

### Problèmes Courants

#### Services ne démarrent pas
```bash
# Vérifier les logs
docker-compose -f docker-compose.production.yml logs

# Vérifier l'état des conteneurs
docker-compose -f docker-compose.production.yml ps

# Reconstruire les images
docker-compose -f docker-compose.production.yml build --no-cache
```

#### Base de données inaccessible
```bash
# Vérifier la connexion à la base
docker-compose -f docker-compose.production.yml exec db pg_isready -U cipfaro

# Redémarrer la base de données
docker-compose -f docker-compose.production.yml restart db
```

#### Problèmes de certificats SSL
1. Vérifiez que les fichiers sont dans `infra/nginx/ssl/`
2. Vérifiez les permissions des fichiers de certificats
3. Redémarrez Nginx : `docker-compose -f docker-compose.production.yml restart nginx`

## 📞 Support

En cas de problème :

1. **Vérifiez les logs** : `./logs/deployment-*.log`
2. **Consultez la documentation** : `docs/DEPLOIEMENT.md`
3. **Exécutez le diagnostic** : `./scripts/deploy-production.sh health`

## ✅ Checklist de Mise en Production

- [ ] Docker et Docker Compose installés
- [ ] Fichier `.env.production` configuré
- [ ] Certificats SSL en place
- [ ] Firewall configuré
- [ ] Sauvegardes testées
- [ ] Monitoring fonctionnel
- [ ] Tests E2E validés
- [ ] Plan de maintenance établi

---

🎉 **Félicitations !** Votre plateforme CIPFARO E-Learning est maintenant en production !