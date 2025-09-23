# 🇫🇷 Guide de Déploiement LWS - CIPFARO E-Learning

Ce guide détaille le processus de déploiement de la plateforme CIPFARO E-Learning sur LWS (Ligne Web Services).

## 🎯 Pourquoi LWS ?

✅ **Hébergeur français** : Conformité RGPD native et support en français  
✅ **Prix imbattable** : ~23€/mois (vs 56$/mois DigitalOcean, 200€/mois Azure)  
✅ **Performance** : Datacenters en France, latence optimale  
✅ **Simplicité** : Interface française intuitive  
✅ **Sécurité** : Sauvegardes automatiques et monitoring 24/7  

## 📋 Prérequis

### Comptes Requis
- [Compte LWS](https://www.lws.fr/) avec VPS Cloud
- Repository GitHub `cipfarorudy/cipfaro-elearning`
- Domaine cipfaro.fr (peut être acheté chez LWS)

### Services LWS Recommandés
- **VPS Cloud 2** : 2 vCPU, 4GB RAM, 80GB SSD - 19,99€/mois
- **Domaine .fr** : 8,99€/an (première année gratuite)
- **Backup Pro** : 2,99€/mois (optionnel mais recommandé)

## 🏗️ Architecture de Déploiement

```
🌐 cipfaro.fr
    ↓
🔒 Let's Encrypt SSL
    ↓
🖥️ VPS Cloud LWS (Ubuntu 22.04)
    ├── 🐳 Docker Compose
    │   ├── 🔄 Nginx Reverse Proxy
    │   ├── 📱 Next.js Frontend
    │   ├── 📡 Express.js API
    │   ├── 🗄️ PostgreSQL 15
    │   └── 🚀 Redis (sessions)
    └── 🛡️ Monitoring + Backups
```

## 🚀 Déploiement Rapide (Option Automatique)

### 1. Commander votre VPS LWS

1. **Allez sur** [LWS VPS Cloud](https://www.lws.fr/serveur_dedie_linux.php)
2. **Choisissez** VPS Cloud 2 (2 vCPU, 4GB RAM, 80GB SSD)
3. **OS** : Ubuntu 22.04 LTS
4. **Commandez** et attendez l'activation (quelques minutes)

### 2. Configuration Initiale du VPS

```bash
# Connexion SSH (remplacez l'IP par celle de votre VPS)
ssh root@VOTRE_IP_VPS

# Mise à jour du système
apt update && apt upgrade -y

# Création d'un utilisateur non-root
adduser cipfaro
usermod -aG sudo cipfaro
su - cipfaro
```

### 3. Déploiement Automatique

```bash
# Téléchargement du script de déploiement
wget https://raw.githubusercontent.com/cipfarorudy/cipfaro-elearning/main/deploy-lws.sh

# Rendre le script exécutable
chmod +x deploy-lws.sh

# Exécution du déploiement automatique
./deploy-lws.sh
```

Le script va automatiquement :
- ✅ Installer Docker et Docker Compose
- ✅ Cloner le repository
- ✅ Configurer SSL avec Let's Encrypt
- ✅ Déployer tous les containers
- ✅ Configurer le monitoring et les sauvegardes

## 📝 Déploiement Manuel (Option Avancée)

### 1. Installation des Dépendances

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation des outils nécessaires
sudo apt install -y curl wget git unzip certbot python3-certbot-nginx htop fail2ban

# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Redémarrage pour appliquer les permissions
sudo reboot
```

### 2. Configuration du Projet

```bash
# Création des répertoires
sudo mkdir -p /opt/cipfaro
sudo chown -R $USER:$USER /opt/cipfaro

# Clonage du repository
git clone https://github.com/cipfarorudy/cipfaro-elearning.git /opt/cipfaro
cd /opt/cipfaro

# Configuration des variables d'environnement
cp .env.lws.example .env.production

# Édition des variables (utilisez nano ou vi)
nano .env.production
```

### 3. Configuration SSL

```bash
# Génération du certificat Let's Encrypt
sudo certbot certonly --standalone --email admin@cipfaro.fr --agree-tos --no-eff-email -d cipfaro.fr -d www.cipfaro.fr

# Copie des certificats
sudo cp /etc/letsencrypt/live/cipfaro.fr/fullchain.pem /opt/cipfaro/nginx/ssl/
sudo cp /etc/letsencrypt/live/cipfaro.fr/privkey.pem /opt/cipfaro/nginx/ssl/
sudo chown -R $USER:$USER /opt/cipfaro/nginx/ssl/
```

### 4. Déploiement des Containers

```bash
cd /opt/cipfaro

# Construction et démarrage
docker-compose -f docker-compose.prod.yml up -d --build

# Vérification du statut
docker-compose -f docker-compose.prod.yml ps

# Migration de la base de données
sleep 30  # Attendre que PostgreSQL soit prêt
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

## 🔧 Configuration des Variables d'Environnement

Éditez le fichier `.env.production` :

```bash
# Base de données
POSTGRES_DB=cipfaro
POSTGRES_USER=cipfaro
POSTGRES_PASSWORD=VotreMotDePasseSécurisé123!

# JWT Secret (générez une clé aléatoire)
JWT_SECRET=VotreCléJWTSécuriséeDe64Caractères123456789

# Configuration email (exemple avec Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
SMTP_FROM=noreply@cipfaro.fr
```

## 🌐 Configuration DNS

### Chez votre Registraire de Domaine

Configurez les enregistrements DNS pour pointer vers votre VPS LWS :

```dns
Type    Name    Value
A       @       VOTRE_IP_VPS_LWS
A       www     VOTRE_IP_VPS_LWS
CNAME   *       cipfaro.fr
```

### Vérification DNS

```bash
# Vérification de la propagation DNS
nslookup cipfaro.fr
nslookup www.cipfaro.fr

# Test de connectivité
curl -I https://cipfaro.fr
```

## 📊 Monitoring et Maintenance

### Surveillance des Containers

```bash
# État des containers
docker-compose -f /opt/cipfaro/docker-compose.prod.yml ps

# Logs en temps réel
docker-compose -f /opt/cipfaro/docker-compose.prod.yml logs -f

# Logs d'un service spécifique
docker-compose -f /opt/cipfaro/docker-compose.prod.yml logs -f web
docker-compose -f /opt/cipfaro/docker-compose.prod.yml logs -f api
```

### Métriques du Système

```bash
# Utilisation du CPU et RAM
htop

# Espace disque
df -h

# Utilisation Docker
docker system df
```

### Sauvegardes Automatiques

Le script configure automatiquement :
- ✅ **Sauvegarde quotidienne** de la base de données
- ✅ **Sauvegarde des uploads** (packages SCORM)
- ✅ **Rétention de 7 jours**
- ✅ **Monitoring des containers**

## 🔄 Mises à Jour

### Mise à Jour de l'Application

```bash
cd /opt/cipfaro

# Arrêt des services
docker-compose -f docker-compose.prod.yml down

# Mise à jour du code
git pull origin main

# Reconstruction et redémarrage
docker-compose -f docker-compose.prod.yml up -d --build

# Migration de la base de données si nécessaire
docker-compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Renouvellement SSL

```bash
# Test du renouvellement
sudo certbot renew --dry-run

# Le renouvellement automatique est configuré via cron
sudo crontab -l
```

## 💰 Coûts Détaillés LWS

| Service | Configuration | Prix/mois |
|---------|---------------|-----------|
| **VPS Cloud 2** | 2 vCPU, 4GB RAM, 80GB SSD | 19,99€ |
| **Domaine .fr** | cipfaro.fr (8,99€/an) | 0,75€ |
| **Backup Pro** | Sauvegardes automatiques | 2,99€ |
| **Support** | Inclus | 0€ |
| **SSL** | Let's Encrypt gratuit | 0€ |
| **Total** | | **~23€** |

### Comparaison des Coûts

| Plateforme | Coût mensuel | Support | Datacenters |
|------------|-------------|---------|-------------|
| **LWS** | 23€ | 🇫🇷 Français | 🇫🇷 France |
| DigitalOcean | 56$ | 🇬🇧 Anglais | 🌍 Global |
| Azure | 200€ | 🇬🇧 Anglais | 🌍 Global |

## 🔐 Sécurité

### Mesures Appliquées

- ✅ **SSL/TLS** : Certificats Let's Encrypt automatiques
- ✅ **Firewall** : iptables configuré
- ✅ **Fail2ban** : Protection contre les attaques par force brute
- ✅ **Rate limiting** : Protection API via Nginx
- ✅ **Headers sécurisés** : XSS, CSRF, etc.
- ✅ **Containers isolés** : Réseau Docker privé
- ✅ **Sauvegardes** : Protection des données

### Hardening Supplémentaire

```bash
# Configuration du firewall
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# Configuration fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Mise à jour automatique des paquets de sécurité
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

## 🆘 Dépannage

### Problèmes Courants

#### 1. Container qui ne démarre pas
```bash
# Vérifier les logs
docker-compose -f docker-compose.prod.yml logs nom_du_service

# Redémarrer un service spécifique
docker-compose -f docker-compose.prod.yml restart nom_du_service
```

#### 2. Erreur 502 Bad Gateway
```bash
# Vérifier que les containers API/Web sont up
docker-compose -f docker-compose.prod.yml ps

# Redémarrer Nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

#### 3. Problème de base de données
```bash
# Accéder à la base de données
docker-compose -f docker-compose.prod.yml exec postgres psql -U cipfaro -d cipfaro

# Vérifier les logs PostgreSQL
docker-compose -f docker-compose.prod.yml logs postgres
```

#### 4. Certificat SSL expiré
```bash
# Renouveler manuellement
sudo certbot renew
sudo cp /etc/letsencrypt/live/cipfaro.fr/*.pem /opt/cipfaro/nginx/ssl/
docker-compose -f docker-compose.prod.yml restart nginx
```

### Support LWS

- **Documentation** : https://aide.lws.fr/
- **Ticket Support** : Interface client LWS
- **Téléphone** : +33 1 77 62 30 03
- **Chat** : Disponible sur le site LWS

## 🎉 Validation du Déploiement

### Tests de Base

```bash
# Test de connectivité
curl -I https://cipfaro.fr

# Test de l'API
curl https://cipfaro.fr/api/health

# Test du frontend
curl https://cipfaro.fr
```

### Tests Fonctionnels

1. **Accès à l'application** : https://cipfaro.fr
2. **Création de compte** : Interface d'inscription
3. **Connexion** : Authentification JWT
4. **Upload SCORM** : Test des modules
5. **Dashboard** : Accès aux fonctionnalités

### Métriques de Performance

- ✅ **Temps de réponse** : < 200ms depuis la France
- ✅ **Disponibilité** : 99.9% (SLA LWS)
- ✅ **SSL Grade** : A+ (test SSL Labs)
- ✅ **Lighthouse Score** : > 90

---

## 🌟 Félicitations !

Votre plateforme **CIPFARO E-Learning** est maintenant déployée sur **LWS** !

🇫🇷 **Hébergement français** : Conformité RGPD complète  
💰 **Coût optimisé** : 23€/mois seulement  
🚀 **Performance** : Latence minimale en France  
🛡️ **Sécurité** : SSL automatique et monitoring 24/7  

*LWS, l'hébergeur français de confiance pour vos projets professionnels !*