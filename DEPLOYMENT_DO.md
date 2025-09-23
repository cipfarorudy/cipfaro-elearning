# 🌊 Guide de Déploiement DigitalOcean - CIPFARO E-Learning

Ce guide détaille le processus de déploiement de la plateforme CIPFARO E-Learning sur DigitalOcean.

## 🎯 Pourquoi DigitalOcean ?

✅ **3x moins cher qu'Azure** (~$56/mois vs ~€200/mois)  
✅ **Interface simple** et intuitive  
✅ **Déploiement rapide** depuis GitHub  
✅ **SSL gratuit** avec Let's Encrypt  
✅ **Scaling automatique**  
✅ **Monitoring intégré**  

## 📋 Prérequis

### Comptes Requis
- [Compte DigitalOcean](https://www.digitalocean.com/)
- Repository GitHub public ou privé
- Domaine cipfaro.fr (optionnel)

### Outils Locaux (optionnels)
- [DigitalOcean CLI (doctl)](https://docs.digitalocean.com/reference/doctl/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (pour tests locaux)

## 🏗️ Architecture de Déploiement

```
🌐 cipfaro.fr
    ↓
🔒 DigitalOcean Load Balancer (SSL)
    ↓
┌─────────────────┐    ┌─────────────────┐
│   App Platform  │    │   App Platform  │
│   Service       │    │   Service       │
│   (Frontend)    │    │   (API)         │
│   Next.js       │    │   Express.js    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
    ┌────────────────┴────────────────┐
    │       Managed PostgreSQL        │
    │         (1GB RAM)               │
    └─────────────────────────────────┘
                     │
                     │
           ┌─────────────────┐
           │  Spaces Storage │
           │   (SCORM CDN)   │
           └─────────────────┘
```

## 🚀 Étapes de Déploiement

### 1. Préparation du Repository

```bash
# Cloner le repository (si pas déjà fait)
git clone https://github.com/cipfarorudy/cipfaro-elearning.git
cd cipfaro-elearning

# Vérifier que tous les fichiers sont présents
ls -la .do/
# Devrait contenir: app.yaml, DEPLOYMENT_PLAN.md
```

### 2. Création du Compte DigitalOcean

1. **Inscription** : https://www.digitalocean.com/
2. **Vérification** : Confirmer l'email et ajouter un moyen de paiement
3. **Bonus** : Utiliser le code promo pour $200 de crédit gratuit

### 3. Déploiement via App Platform

#### 3.1 Créer une Nouvelle App

1. **Connectez-vous** à DigitalOcean
2. **Allez dans** "App Platform" dans le menu
3. **Cliquez** "Create App"
4. **Sélectionnez** "GitHub" comme source
5. **Autorisez** DigitalOcean à accéder à votre repository

#### 3.2 Configuration du Repository

1. **Repository** : `cipfarorudy/cipfaro-elearning`
2. **Branch** : `main`
3. **Auto-deploy** : ✅ Activé
4. **Import existing spec** : Importez le fichier `.do/app.yaml`

#### 3.3 Configuration des Services

Les services sont automatiquement configurés via `app.yaml` :

- **Frontend (web)** : Next.js sur port 8080
- **API (api)** : Express.js sur port 8080
- **Database (db)** : PostgreSQL 15, 1GB RAM
- **Job (db-migrate)** : Migration automatique de la DB

#### 3.4 Variables d'Environnement

Les variables sont configurées automatiquement, mais vous devez ajouter :

```
# Variables secrètes à ajouter manuellement
cipfaro_jwt_secret = "votre-secret-jwt-très-sécurisé"
```

### 4. Configuration de la Base de Données

La base PostgreSQL est créée automatiquement avec :
- **Version** : PostgreSQL 15
- **Taille** : 1 vCPU, 1GB RAM, 10GB SSD
- **Connexions** : 25 simultanées
- **Backups** : Automatiques (7 jours)

### 5. Configuration du Stockage (Spaces)

#### 5.1 Créer un Space

1. **Allez dans** "Spaces Object Storage"
2. **Cliquez** "Create Space"
3. **Configuration** :
   - Name: `cipfaro-scorm`
   - Region: `fra1` (Frankfurt - plus proche de la France)
   - CDN: ✅ Activé
   - Access: Private

#### 5.2 Créer les Clés d'Accès

1. **API** → "Tokens/Keys"
2. **Spaces Keys** → "Generate New Key"
3. **Name** : `cipfaro-app-access`
4. **Copier** les clés et les ajouter aux variables d'environnement

### 6. Finalisation du Déploiement

#### 6.1 Lancer le Déploiement

1. **Review** : Vérifier toute la configuration
2. **Pricing** : Confirmer les coûts (~$56/mois)
3. **Create App** : Lancer le déploiement

#### 6.2 Suivre le Déploiement

```
⏳ Building... (5-10 minutes)
   ├── 📦 Building web service
   ├── 📦 Building api service
   ├── 🗄️ Creating database
   └── 🚀 Deploying services

✅ Deployment successful!
   ├── 🌐 Frontend: https://web-xxx.ondigitalocean.app
   ├── 📡 API: https://api-xxx.ondigitalocean.app
   └── 🗄️ Database: Connected
```

### 7. Configuration du Domaine Personnalisé

#### 7.1 Ajouter le Domaine

1. **App Platform** → Votre app → "Settings"
2. **Domains** → "Add Domain"
3. **Domain** : `cipfaro.fr`
4. **Type** : Primary

#### 7.2 Configuration DNS

Chez votre registraire de domaine (ex: OVH, Gandi) :

```dns
# Enregistrements DNS à configurer
Type    Name    Value
CNAME   www     your-app.ondigitalocean.app
ALIAS   @       your-app.ondigitalocean.app
```

#### 7.3 SSL Automatique

- ✅ Let's Encrypt se configure automatiquement
- ✅ Redirection HTTP → HTTPS activée
- ✅ Certificat renouvelé automatiquement

### 8. Validation du Déploiement

#### 8.1 Tests de Base

```bash
# Test de l'API
curl https://cipfaro.fr/api/health

# Test du frontend
curl https://cipfaro.fr/

# Test de la base de données
curl https://cipfaro.fr/api/users
```

#### 8.2 Tests Fonctionnels

1. **Authentification** : Créer un compte utilisateur
2. **SCORM** : Uploader un package de test
3. **Dashboard** : Accéder aux modules
4. **API** : Tester les endpoints protégés

## 📊 Monitoring et Maintenance

### Métriques Disponibles

- **CPU/RAM** : Utilisation des ressources
- **Requêtes** : Nombre et temps de réponse
- **Erreurs** : Logs d'erreurs automatiques
- **Base de données** : Connexions et performances

### Alertes Configurées

- ✅ CPU > 85%
- ✅ RAM > 85%
- ✅ Redémarrages > 5
- ✅ Erreurs HTTP 5xx

### Logs

```bash
# Via l'interface DigitalOcean
App Platform → Votre app → Runtime Logs

# Via CLI (optionnel)
doctl apps logs <app-id> --follow
```

## 💰 Coûts Détaillés

| Service | Configuration | Prix/mois |
|---------|---------------|-----------|
| **App Platform Web** | 512MB RAM, 1 vCPU | $12 |
| **App Platform API** | 512MB RAM, 1 vCPU | $12 |
| **PostgreSQL** | 1GB RAM, 1 vCPU, 10GB | $15 |
| **Spaces** | 250GB + CDN | $5 |
| **Load Balancer** | SSL + HA | $12 |
| **Bandwidth** | 1TB inclus | $0 |
| **Total** | | **$56** |

### Comparaison Azure vs DigitalOcean

| Aspect | DigitalOcean | Azure |
|--------|-------------|-------|
| **Prix** | $56/mois | €200/mois |
| **Setup** | 15 minutes | 2 heures |
| **Complexité** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Documentation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🔧 Dépannage

### Problèmes Courants

#### Build Failed
```bash
# Vérifier les logs de build
App Platform → Build & Deploy → Build Logs

# Solutions communes :
# - Vérifier package.json
# - Nettoyer node_modules
# - Vérifier les Dockerfiles
```

#### Database Connection Error
```bash
# Vérifier la chaîne de connexion
App Platform → Settings → Environment Variables
DATABASE_URL should be: postgresql://user:pass@host:port/db

# Tester la connexion
doctl databases connection get <db-id>
```

#### 502 Bad Gateway
```bash
# Vérifier que les apps écoutent sur le bon port
PORT=8080 (pas 3000 ou 3001)

# Vérifier les health checks
/api/health pour l'API
/ pour le frontend
```

### Support

- **Documentation** : https://docs.digitalocean.com/
- **Community** : https://www.digitalocean.com/community
- **Support** : Tickets via l'interface DigitalOcean

## 🔄 Mises à Jour

### Auto-Deploy

✅ **Configuré automatiquement** : Chaque push sur `main` redéploie l'application

### Déploiement Manuel

```bash
# Via l'interface
App Platform → Deployments → Create Deployment

# Via CLI
doctl apps create-deployment <app-id>
```

### Rollback

```bash
# Via l'interface
App Platform → Deployments → Sélectionner version précédente → Redeploy

# Via CLI
doctl apps get-deployment <app-id> <deployment-id>
```

## 🔐 Sécurité

### Mesures Appliquées

- ✅ **HTTPS obligatoire** avec certificats auto-renouvelés
- ✅ **Variables d'environnement** chiffrées
- ✅ **Base de données** isolée (VPC privé)
- ✅ **Spaces** avec accès privé uniquement
- ✅ **Scanning** automatique des vulnérabilités
- ✅ **Backups** automatiques de la DB

### Bonnes Pratiques

1. **Secrets** : Jamais dans le code, toujours en variables d'env
2. **Accès DB** : Via VPC privé uniquement
3. **API Keys** : Rotation régulière recommandée
4. **Monitoring** : Surveiller les tentatives d'intrusion
5. **Updates** : Maintenir les dépendances à jour

## 📈 Scaling

### Scaling Automatique

- ✅ **App Platform** : Auto-scale de 1 à 3 instances
- ✅ **Database** : Scale manuel si nécessaire
- ✅ **CDN** : Scaling automatique global

### Scaling Manuel

```bash
# Upgrade de la base de données
App Platform → Database → Resize

# Upgrade des services
App Platform → Settings → Plan → Upgrade
```

---

## 🎉 Félicitations !

Votre plateforme CIPFARO E-Learning est maintenant déployée sur DigitalOcean ! 

🌐 **URL** : https://cipfaro.fr  
📱 **Interface** : Simple et moderne  
💰 **Coût** : 3x moins cher qu'Azure  
🚀 **Performance** : Optimale avec CDN global  

*DigitalOcean App Platform est parfait pour les applications modernes !*