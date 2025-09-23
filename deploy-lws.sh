#!/bin/bash

# Script de déploiement automatique pour LWS
# Usage: ./deploy-lws.sh

set -e

echo "🇫🇷 CIPFARO E-Learning - Déploiement LWS"
echo "========================================="

# Configuration
DOMAIN="cipfaro.fr"
EMAIL="admin@cipfaro.fr"
APP_DIR="/opt/cipfaro"
BACKUP_DIR="/opt/cipfaro/backups"

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Vérifications préliminaires
check_prerequisites() {
    log "Vérification des prérequis..."
    
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé!"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose n'est pas installé!"
    fi
    
    if ! command -v git &> /dev/null; then
        error "Git n'est pas installé!"
    fi
    
    if ! command -v nginx &> /dev/null; then
        warn "Nginx n'est pas installé globalement (utilisation via Docker)"
    fi
    
    log "✅ Tous les prérequis sont satisfaits"
}

# Installation des dépendances système
install_dependencies() {
    log "Installation des dépendances système..."
    
    # Mise à jour du système
    sudo apt update && sudo apt upgrade -y
    
    # Installation des outils nécessaires
    sudo apt install -y \
        curl \
        wget \
        git \
        unzip \
        certbot \
        python3-certbot-nginx \
        htop \
        fail2ban
    
    # Installation de Docker si nécessaire
    if ! command -v docker &> /dev/null; then
        log "Installation de Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
    fi
    
    # Installation de Docker Compose si nécessaire
    if ! command -v docker-compose &> /dev/null; then
        log "Installation de Docker Compose..."
        sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    log "✅ Dépendances installées"
}

# Configuration des répertoires
setup_directories() {
    log "Configuration des répertoires..."
    
    sudo mkdir -p $APP_DIR
    sudo mkdir -p $BACKUP_DIR
    sudo mkdir -p /opt/cipfaro/nginx/ssl
    sudo mkdir -p /opt/cipfaro/postgres/init
    
    # Permissions
    sudo chown -R $USER:$USER $APP_DIR
    
    log "✅ Répertoires configurés"
}

# Clonage du repository
clone_repository() {
    log "Clonage du repository..."
    
    if [ -d "$APP_DIR/.git" ]; then
        log "Repository déjà cloné, mise à jour..."
        cd $APP_DIR
        git pull origin main
    else
        log "Clonage du repository..."
        git clone https://github.com/cipfarorudy/cipfaro-elearning.git $APP_DIR
        cd $APP_DIR
    fi
    
    log "✅ Repository cloné/mis à jour"
}

# Configuration des certificats SSL
setup_ssl() {
    log "Configuration SSL Let's Encrypt..."
    
    # Arrêt temporaire de nginx si il est en cours d'exécution
    sudo systemctl stop nginx 2>/dev/null || true
    
    # Génération du certificat
    sudo certbot certonly \
        --standalone \
        --email $EMAIL \
        --agree-tos \
        --no-eff-email \
        -d $DOMAIN \
        -d www.$DOMAIN
    
    # Copie des certificats vers le répertoire Docker
    sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $APP_DIR/nginx/ssl/
    sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $APP_DIR/nginx/ssl/
    sudo chown -R $USER:$USER $APP_DIR/nginx/ssl/
    
    # Configuration du renouvellement automatique
    echo "0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/$DOMAIN/*.pem $APP_DIR/nginx/ssl/ && docker-compose -f $APP_DIR/docker-compose.prod.yml restart nginx" | sudo crontab -
    
    log "✅ SSL configuré"
}

# Configuration des variables d'environnement
setup_environment() {
    log "Configuration des variables d'environnement..."
    
    if [ ! -f "$APP_DIR/.env.production" ]; then
        cp $APP_DIR/.env.lws.example $APP_DIR/.env.production
        
        # Génération automatique des secrets
        JWT_SECRET=$(openssl rand -hex 32)
        DB_PASSWORD=$(openssl rand -base64 32)
        
        # Remplacement des valeurs
        sed -i "s/CHANGEZ_MOI_AVEC_UN_MOT_DE_PASSE_SECURISE/$DB_PASSWORD/g" $APP_DIR/.env.production
        sed -i "s/CHANGEZ_MOI_AVEC_UNE_CLE_JWT_SECURISEE_DE_64_CARACTERES/$JWT_SECRET/g" $APP_DIR/.env.production
        
        warn "⚠️  Fichier .env.production créé avec des valeurs par défaut"
        warn "⚠️  Veuillez éditer $APP_DIR/.env.production pour configurer :"
        warn "   - SMTP_USER et SMTP_PASSWORD pour les emails"
        warn "   - Autres paramètres spécifiques à votre installation"
    else
        log "✅ Fichier .env.production déjà présent"
    fi
}

# Construction et déploiement des containers
deploy_containers() {
    log "Construction et déploiement des containers..."
    
    cd $APP_DIR
    
    # Arrêt des containers existants
    docker-compose -f docker-compose.prod.yml down || true
    
    # Construction des images
    docker-compose -f docker-compose.prod.yml build
    
    # Démarrage des services
    docker-compose -f docker-compose.prod.yml up -d
    
    # Attendre que la base de données soit prête
    log "Attente de la base de données..."
    sleep 30
    
    # Migration de la base de données
    docker-compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy
    
    log "✅ Containers déployés"
}

# Configuration du monitoring
setup_monitoring() {
    log "Configuration du monitoring..."
    
    # Script de monitoring simple
    cat > /opt/cipfaro/monitor.sh << 'EOF'
#!/bin/bash
# Monitoring simple pour CIPFARO

check_container() {
    if ! docker ps | grep -q $1; then
        echo "$(date): Container $1 n'est pas en cours d'exécution" >> /var/log/cipfaro-monitor.log
        docker-compose -f /opt/cipfaro/docker-compose.prod.yml restart $1
    fi
}

check_container "cipfaro-nginx"
check_container "cipfaro-web"
check_container "cipfaro-api"
check_container "cipfaro-db"
EOF
    
    chmod +x /opt/cipfaro/monitor.sh
    
    # Cron job pour le monitoring
    echo "*/5 * * * * /opt/cipfaro/monitor.sh" | crontab -
    
    log "✅ Monitoring configuré"
}

# Configuration des sauvegardes
setup_backups() {
    log "Configuration des sauvegardes..."
    
    # Script de sauvegarde
    cat > /opt/cipfaro/backup.sh << 'EOF'
#!/bin/bash
# Script de sauvegarde pour CIPFARO

BACKUP_DIR="/opt/cipfaro/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Sauvegarde de la base de données
docker exec cipfaro-db pg_dump -U cipfaro cipfaro > $BACKUP_DIR/db_backup_$DATE.sql

# Sauvegarde des uploads
tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C /var/lib/docker/volumes/cipfaro_api_uploads/_data .

# Nettoyage des anciennes sauvegardes (garder 7 jours)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Sauvegarde terminée" >> /var/log/cipfaro-backup.log
EOF
    
    chmod +x /opt/cipfaro/backup.sh
    
    # Cron job pour les sauvegardes quotidiennes
    echo "0 2 * * * /opt/cipfaro/backup.sh" | crontab -
    
    log "✅ Sauvegardes configurées"
}

# Fonction principale
main() {
    log "🇫🇷 Début du déploiement CIPFARO sur LWS"
    
    check_prerequisites
    install_dependencies
    setup_directories
    clone_repository
    setup_environment
    setup_ssl
    deploy_containers
    setup_monitoring
    setup_backups
    
    log "🎉 Déploiement terminé avec succès!"
    log ""
    log "🌐 Votre application est accessible sur : https://$DOMAIN"
    log "📊 Monitoring des containers : docker-compose -f $APP_DIR/docker-compose.prod.yml ps"
    log "📝 Logs de l'application : docker-compose -f $APP_DIR/docker-compose.prod.yml logs -f"
    log "🔧 Configuration : $APP_DIR/.env.production"
    log ""
    log "⚠️  N'oubliez pas de :"
    log "   1. Configurer vos paramètres SMTP dans .env.production"
    log "   2. Tester l'application complète"
    log "   3. Configurer les DNS pour pointer vers ce serveur"
}

# Exécution du script principal
main "$@"