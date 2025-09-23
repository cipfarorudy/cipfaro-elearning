#!/bin/bash

# =============================================================================
# Script de Déploiement CIPFARO E-Learning - Sous-domaine
# Déploie sur elearning.cipfaro.fr en préservant WordPress sur cipfaro.fr
# =============================================================================

set -e  # Arrêt du script en cas d'erreur

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DOMAIN="elearning.cipfaro.fr"
MAIN_DOMAIN="cipfaro.fr"
PROJECT_DIR="/opt/cipfaro-elearning"
COMPOSE_FILE="docker-compose.elearning.yml"
ENV_FILE=".env.production"

echo -e "${BLUE}🚀 Déploiement CIPFARO E-Learning sur sous-domaine ${DOMAIN}${NC}"
echo -e "${YELLOW}📋 Cette installation préserve le WordPress existant sur ${MAIN_DOMAIN}${NC}"
echo

# =============================================================================
# 1. Vérifications préliminaires
# =============================================================================

echo -e "${BLUE}🔍 Vérifications préliminaires...${NC}"

# Vérifier que nous sommes connectés en SSH
if [ -z "$SSH_CLIENT" ] && [ -z "$SSH_TTY" ]; then
    echo -e "${YELLOW}⚠️  Il est recommandé d'exécuter ce script via SSH${NC}"
fi

# Vérifier les prérequis système
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker non installé${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose non installé${NC}"; exit 1; }
command -v git >/dev/null 2>&1 || { echo -e "${RED}❌ Git non installé${NC}"; exit 1; }

# Vérifier que le site WordPress principal est accessible
echo "🔍 Vérification du site WordPress principal..."
if curl -s -o /dev/null -w "%{http_code}" "https://$MAIN_DOMAIN" | grep -q "200"; then
    echo -e "${GREEN}✅ WordPress sur $MAIN_DOMAIN est accessible${NC}"
else
    echo -e "${YELLOW}⚠️  WordPress sur $MAIN_DOMAIN n'est pas accessible${NC}"
    read -p "Voulez-vous continuer ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✅ Prérequis vérifiés${NC}"
echo

# =============================================================================
# 2. Préparation des répertoires
# =============================================================================

echo -e "${BLUE}📁 Préparation des répertoires...${NC}"

# Créer le répertoire projet
sudo mkdir -p $PROJECT_DIR
sudo chown -R $USER:$USER $PROJECT_DIR

# Créer les répertoires pour les données
mkdir -p $PROJECT_DIR/{uploads/elearning,backups/elearning,nginx/ssl,public/elearning/scorm}

echo -e "${GREEN}✅ Répertoires créés${NC}"
echo

# =============================================================================
# 3. Clonage du repository
# =============================================================================

echo -e "${BLUE}📥 Récupération du code...${NC}"

if [ -d "$PROJECT_DIR/.git" ]; then
    echo "📥 Mise à jour du repository existant..."
    cd $PROJECT_DIR
    git fetch origin
    git reset --hard origin/deployment/lws
    git pull origin deployment/lws
else
    echo "📥 Clonage du repository..."
    git clone -b deployment/lws https://github.com/cipfarorudy/cipfaro-elearning.git $PROJECT_DIR
    cd $PROJECT_DIR
fi

echo -e "${GREEN}✅ Code récupéré${NC}"
echo

# =============================================================================
# 4. Configuration des variables d'environnement
# =============================================================================

echo -e "${BLUE}⚙️  Configuration des variables d'environnement...${NC}"

# Copier le fichier d'exemple
cp .env.elearning.example $ENV_FILE

# Générer des clés sécurisées
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 16)
REDIS_PASSWORD=$(openssl rand -base64 16)

# Remplacer les valeurs dans le fichier .env
sed -i "s/VOTRE_MOT_DE_PASSE_POSTGRES/$POSTGRES_PASSWORD/g" $ENV_FILE
sed -i "s/VOTRE_CLE_JWT_SECRETE_ELEARNING_32_CARACTERES/$JWT_SECRET/g" $ENV_FILE
sed -i "s/VOTRE_CLE_CHIFFREMENT_ELEARNING_32_CARACTERES/$ENCRYPTION_KEY/g" $ENV_FILE

# Ajouter le mot de passe Redis
echo "REDIS_PASSWORD=$REDIS_PASSWORD" >> $ENV_FILE

echo -e "${GREEN}✅ Variables d'environnement configurées${NC}"
echo

# =============================================================================
# 5. Configuration du serveur web
# =============================================================================

echo -e "${BLUE}🌐 Configuration du serveur web...${NC}"

# Détecter le serveur web utilisé
if systemctl is-active --quiet apache2; then
    WEB_SERVER="apache2"
    echo "🔍 Apache détecté"
elif systemctl is-active --quiet nginx; then
    WEB_SERVER="nginx"
    echo "🔍 Nginx détecté"
else
    echo -e "${YELLOW}⚠️  Aucun serveur web détecté${NC}"
    echo "Quelle configuration souhaitez-vous ?"
    echo "1) Apache"
    echo "2) Nginx"
    read -p "Choix (1-2): " choice
    case $choice in
        1) WEB_SERVER="apache2" ;;
        2) WEB_SERVER="nginx" ;;
        *) echo -e "${RED}❌ Choix invalide${NC}"; exit 1 ;;
    esac
fi

# Configuration Apache
if [ "$WEB_SERVER" = "apache2" ]; then
    echo "⚙️  Configuration Apache pour $DOMAIN..."
    
    # Activer les modules nécessaires
    sudo a2enmod proxy proxy_http ssl rewrite
    
    # Créer le virtual host
    sudo tee /etc/apache2/sites-available/$DOMAIN.conf > /dev/null <<EOF
<VirtualHost *:80>
    ServerName $DOMAIN
    Redirect permanent / https://$DOMAIN/
</VirtualHost>

<VirtualHost *:443>
    ServerName $DOMAIN
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$MAIN_DOMAIN/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$MAIN_DOMAIN/privkey.pem
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:3001/
    ProxyPassReverse / http://localhost:3001/
    
    # Logs spécifiques
    ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_error.log
    CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_access.log combined
</VirtualHost>
EOF
    
    # Activer le site
    sudo a2ensite $DOMAIN.conf
    sudo systemctl reload apache2

# Configuration Nginx
elif [ "$WEB_SERVER" = "nginx" ]; then
    echo "⚙️  Configuration Nginx pour $DOMAIN..."
    
    # Créer le virtual host
    sudo tee /etc/nginx/sites-available/$DOMAIN > /dev/null <<EOF
server {
    listen 80;
    server_name $DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl;
    server_name $DOMAIN;
    
    ssl_certificate /etc/letsencrypt/live/$MAIN_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$MAIN_DOMAIN/privkey.pem;
    
    # Configuration SSL moderne
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Headers de sécurité
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Support WebSocket
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # Logs spécifiques
    access_log /var/log/nginx/${DOMAIN}_access.log;
    error_log /var/log/nginx/${DOMAIN}_error.log;
}
EOF
    
    # Activer le site
    sudo ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
fi

echo -e "${GREEN}✅ Configuration serveur web terminée${NC}"
echo

# =============================================================================
# 6. Déploiement Docker
# =============================================================================

echo -e "${BLUE}🐳 Déploiement des containers Docker...${NC}"

# Arrêter les containers existants s'ils existent
if [ -f "$COMPOSE_FILE" ]; then
    docker-compose -f $COMPOSE_FILE down 2>/dev/null || true
fi

# Construire et démarrer les containers
docker-compose -f $COMPOSE_FILE up -d --build

echo "⏳ Attente du démarrage des services..."
sleep 30

# Vérifier que les containers sont démarrés
docker-compose -f $COMPOSE_FILE ps

echo -e "${GREEN}✅ Containers déployés${NC}"
echo

# =============================================================================
# 7. Initialisation de la base de données
# =============================================================================

echo -e "${BLUE}🗄️  Initialisation de la base de données...${NC}"

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente de PostgreSQL..."
until docker-compose -f $COMPOSE_FILE exec -T postgres pg_isready -U elearning_user; do
    sleep 2
done

# Exécuter les migrations Prisma
echo "🔄 Exécution des migrations..."
docker-compose -f $COMPOSE_FILE exec -T api npx prisma migrate deploy

# Optionnel : Seed de données de test
read -p "Voulez-vous insérer des données de test ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose -f $COMPOSE_FILE exec -T api npx prisma db seed
fi

echo -e "${GREEN}✅ Base de données initialisée${NC}"
echo

# =============================================================================
# 8. Configuration des sauvegardes
# =============================================================================

echo -e "${BLUE}💾 Configuration des sauvegardes automatiques...${NC}"

# Script de sauvegarde
sudo tee /usr/local/bin/backup-elearning.sh > /dev/null <<EOF
#!/bin/bash
BACKUP_DIR="$PROJECT_DIR/backups/elearning"
DATE=\$(date +"%Y%m%d_%H%M%S")

# Sauvegarde base de données
docker-compose -f $PROJECT_DIR/$COMPOSE_FILE exec -T postgres pg_dump -U elearning_user elearning_cipfaro > "\$BACKUP_DIR/db_\$DATE.sql"

# Sauvegarde des uploads
tar -czf "\$BACKUP_DIR/uploads_\$DATE.tar.gz" -C "$PROJECT_DIR" uploads/elearning

# Nettoyage (garder 7 jours)
find "\$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
find "\$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Sauvegarde elearning terminée: \$DATE"
EOF

sudo chmod +x /usr/local/bin/backup-elearning.sh

# Cron job pour sauvegardes automatiques (3h du matin)
(crontab -l 2>/dev/null; echo "0 3 * * * /usr/local/bin/backup-elearning.sh >> /var/log/backup-elearning.log 2>&1") | crontab -

echo -e "${GREEN}✅ Sauvegardes automatiques configurées${NC}"
echo

# =============================================================================
# 9. Tests de validation
# =============================================================================

echo -e "${BLUE}🧪 Tests de validation...${NC}"

# Test des services
echo "🔍 Vérification des services..."

# Attendre que les services soient prêts
sleep 10

# Test health check API
echo "🔍 Test API health check..."
if curl -s -f "http://localhost:3001/health" > /dev/null; then
    echo -e "${GREEN}✅ API accessible${NC}"
else
    echo -e "${YELLOW}⚠️  API non accessible${NC}"
fi

# Test DNS du sous-domaine
echo "🔍 Test résolution DNS..."
if nslookup $DOMAIN | grep -q "193.37.145.82"; then
    echo -e "${GREEN}✅ DNS résolu correctement${NC}"
else
    echo -e "${YELLOW}⚠️  DNS non résolu ou incorrect${NC}"
fi

# Test du site principal (WordPress)
echo "🔍 Test site WordPress principal..."
if curl -s -o /dev/null -w "%{http_code}" "https://$MAIN_DOMAIN" | grep -q "200"; then
    echo -e "${GREEN}✅ WordPress principal accessible${NC}"
else
    echo -e "${YELLOW}⚠️  WordPress principal non accessible${NC}"
fi

echo -e "${GREEN}✅ Tests de validation terminés${NC}"
echo

# =============================================================================
# 10. Résumé et instructions finales
# =============================================================================

echo -e "${GREEN}🎉 Déploiement CIPFARO E-Learning terminé !${NC}"
echo
echo -e "${BLUE}📋 Résumé de l'installation :${NC}"
echo -e "  🌐 Site principal (WordPress) : https://$MAIN_DOMAIN"
echo -e "  🚀 Plateforme e-learning : https://$DOMAIN"
echo -e "  📁 Répertoire projet : $PROJECT_DIR"
echo -e "  🐳 Containers : $(docker-compose -f $COMPOSE_FILE ps --services | wc -l) services"
echo -e "  💾 Sauvegardes : Quotidiennes à 3h du matin"
echo
echo -e "${YELLOW}📋 Prochaines étapes :${NC}"
echo "1. Vérifiez que https://$DOMAIN est accessible"
echo "2. Vérifiez que https://$MAIN_DOMAIN fonctionne toujours"
echo "3. Configurez les utilisateurs administrateurs"
echo "4. Testez l'upload de modules SCORM"
echo "5. Configurez la sauvegarde externe (optionnel)"
echo
echo -e "${BLUE}🔧 Commandes utiles :${NC}"
echo "  📊 État des services : docker-compose -f $PROJECT_DIR/$COMPOSE_FILE ps"
echo "  📋 Logs temps réel : docker-compose -f $PROJECT_DIR/$COMPOSE_FILE logs -f"
echo "  🔄 Redémarrage : docker-compose -f $PROJECT_DIR/$COMPOSE_FILE restart"
echo "  🛑 Arrêt : docker-compose -f $PROJECT_DIR/$COMPOSE_FILE down"
echo "  💾 Sauvegarde manuelle : /usr/local/bin/backup-elearning.sh"
echo
echo -e "${GREEN}🇫🇷 Votre plateforme CIPFARO E-Learning est maintenant déployée sur LWS !${NC}"
echo -e "${BLUE}Support : https://aide.lws.fr/ | Email : admin@cipfaro.fr${NC}"