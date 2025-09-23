# Configuration du Domaine cipfaro.fr sur LWS

## 📋 Prérequis
- ✅ Accès au panneau LWS (https://panel.lws.fr)
- ✅ Configuration de déploiement LWS prête
- ✅ Domaine cipfaro.fr disponible

## 🔧 Étapes de Configuration

### 1. Commander le VPS Cloud LWS

Dans votre panneau LWS :

1. **Accédez à "VPS Cloud"**
   - Cliquez sur "VPS Cloud" dans le menu principal

2. **Sélectionnez l'offre recommandée :**
   - **VPS Cloud 2** : 2 vCPU, 4GB RAM, 80GB SSD
   - **Prix** : 19,99€/mois (au lieu de 23€ - promotion actuelle)
   - **OS** : Ubuntu 22.04 LTS

3. **Configuration réseau :**
   - Choisissez un nom pour votre VPS (ex: `cipfaro-production`)
   - Notez l'adresse IP qui sera attribuée

### 2. Enregistrer le Domaine cipfaro.fr

1. **Dans le panneau LWS :**
   - Allez dans "Domaines" > "Enregistrer un domaine"
   - Recherchez `cipfaro.fr`
   - Procédez à l'enregistrement (environ 12€/an)

2. **Ou si le domaine est déjà enregistré ailleurs :**
   - Allez dans "Domaines" > "Transférer un domaine"
   - Suivez la procédure de transfert

### 3. Configuration DNS

Une fois le VPS créé et l'IP attribuée :

1. **Accédez à la gestion DNS :**
   - Dans le panneau LWS, allez dans "Domaines"
   - Cliquez sur `cipfaro.fr`
   - Allez dans "Zone DNS"

2. **Configurez les enregistrements DNS :**
   ```
   Type    Nom             Valeur                  TTL
   A       @               [IP_VPS_LWS]           3600
   A       www             [IP_VPS_LWS]           3600
   A       api             [IP_VPS_LWS]           3600
   CNAME   admin           cipfaro.fr             3600
   CNAME   dashboard       cipfaro.fr             3600
   ```

   Remplacez `[IP_VPS_LWS]` par l'IP réelle de votre VPS.

### 4. Connexion au VPS

1. **Récupérez les informations de connexion :**
   - Nom d'utilisateur : `root`
   - Mot de passe : fourni par LWS
   - IP : celle attribuée à votre VPS

2. **Connectez-vous via SSH :**
   ```bash
   ssh root@[IP_VPS_LWS]
   ```

### 5. Déploiement de l'Application

1. **Clonez le repository :**
   ```bash
   git clone https://github.com/cipfarorudy/cipfaro-elearning.git
   cd cipfaro-elearning
   git checkout deployment/lws
   ```

2. **Exécutez le script de déploiement :**
   ```bash
   chmod +x deploy-lws.sh
   ./deploy-lws.sh
   ```

3. **Configurez les variables d'environnement :**
   ```bash
   cp .env.lws.example .env.production
   nano .env.production
   ```

   Modifiez ces valeurs :
   ```env
   # Domaine
   NEXT_PUBLIC_DOMAIN=cipfaro.fr
   NEXT_PUBLIC_API_URL=https://api.cipfaro.fr

   # Base de données PostgreSQL
   DATABASE_URL="postgresql://cipfaro:VOTRE_MOT_DE_PASSE@postgres:5432/cipfaro_db"

   # JWT Secret (générez une clé aléatoire)
   JWT_SECRET=VOTRE_CLE_JWT_SECRETE

   # Email pour Let's Encrypt
   SSL_EMAIL=admin@cipfaro.fr
   ```

### 6. Configuration SSL avec Let's Encrypt

Le script de déploiement configure automatiquement SSL. Vérifiez que :

1. **Les certificats sont générés :**
   ```bash
   docker exec nginx ls -la /etc/letsencrypt/live/cipfaro.fr/
   ```

2. **Le renouvellement automatique est actif :**
   ```bash
   docker exec nginx crontab -l
   ```

### 7. Démarrage des Services

```bash
# Démarrer tous les services
docker-compose -f docker-compose.prod.yml up -d

# Vérifier le statut
docker-compose -f docker-compose.prod.yml ps

# Voir les logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 🔍 Vérification

### Tests de Fonctionnement

1. **Site principal :**
   - https://cipfaro.fr ✅
   - https://www.cipfaro.fr ✅

2. **API :**
   - https://api.cipfaro.fr/health ✅
   - https://api.cipfaro.fr/api/auth/status ✅

3. **Dashboard :**
   - https://cipfaro.fr/dashboard ✅

### Commandes de Diagnostic

```bash
# Statut des conteneurs
docker ps

# Logs du serveur web
docker logs cipfaro-web

# Logs de l'API
docker logs cipfaro-api

# Logs de la base de données
docker logs cipfaro-postgres

# Test de connectivité
curl -I https://cipfaro.fr
curl -I https://api.cipfaro.fr/health
```

## 📊 Monitoring et Maintenance

### Sauvegarde Automatique

Les sauvegardes sont configurées automatiquement :
- **Base de données** : sauvegarde quotidienne à 2h du matin
- **Fichiers** : sauvegarde hebdomadaire le dimanche
- **Rétention** : 30 jours

### Logs et Monitoring

```bash
# Consulter les métriques
docker stats

# Espace disque
df -h

# Mémoire
free -h

# Logs centralisés
docker-compose -f docker-compose.prod.yml logs --tail=100 -f
```

## 🚨 Dépannage

### Problèmes Courants

1. **DNS ne se propage pas :**
   - Attendre jusqu'à 24h pour la propagation complète
   - Tester avec : `nslookup cipfaro.fr`

2. **Certificat SSL non généré :**
   ```bash
   docker exec nginx certbot --nginx -d cipfaro.fr -d www.cipfaro.fr
   ```

3. **Base de données non accessible :**
   ```bash
   docker exec -it cipfaro-postgres psql -U cipfaro -d cipfaro_db
   ```

4. **Services ne démarrent pas :**
   ```bash
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d
   ```

## 💰 Coûts Mensuels

- **VPS Cloud 2** : 19,99€/mois
- **Domaine .fr** : 1€/mois (12€/an)
- **Total** : ~21€/mois

**Avantages LWS vs autres hébergeurs :**
- DigitalOcean : 56$/mois (~52€)
- Azure : 200€/mois
- **Économie** : 80% moins cher que Azure !

## 📞 Support

- **LWS Support** : Français, chat 24/7
- **Documentation** : https://aide.lws.fr
- **Status Page** : https://status.lws.fr

---

**✅ Configuration complète pour cipfaro.fr sur LWS !**