#!/bin/bash

# ===================================================================
# Script de déploiement production - CIPFARO E-Learning
# ===================================================================

set -euo pipefail

# Configuration des couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Variables par défaut
ENVIRONMENT=${ENVIRONMENT:-production}
COMPOSE_FILE="docker-compose.production.yml"
ENV_FILE=".env.production"
BACKUP_DIR="./backups"
LOG_FILE="./logs/deployment-$(date +%Y%m%d-%H%M%S).log"

# Fonction pour afficher des messages colorés
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case $level in
        INFO)  echo -e "${BLUE}[INFO]${NC} $message" | tee -a "$LOG_FILE" ;;
        SUCCESS) echo -e "${GREEN}[SUCCESS]${NC} $message" | tee -a "$LOG_FILE" ;;
        WARNING) echo -e "${YELLOW}[WARNING]${NC} $message" | tee -a "$LOG_FILE" ;;
        ERROR) echo -e "${RED}[ERROR]${NC} $message" | tee -a "$LOG_FILE" ;;
    esac
}

# Fonction pour vérifier les prérequis
check_prerequisites() {
    log INFO "Vérification des prérequis..."
    
    # Vérifier Docker
    if ! command -v docker &> /dev/null; then
        log ERROR "Docker n'est pas installé ou n'est pas dans le PATH"
        exit 1
    fi
    
    # Vérifier Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log ERROR "Docker Compose n'est pas installé ou n'est pas dans le PATH"
        exit 1
    fi
    
    # Vérifier le fichier de configuration
    if [[ ! -f "$ENV_FILE" ]]; then
        log ERROR "Fichier de configuration manquant: $ENV_FILE"
        log INFO "Créez ce fichier avec les variables d'environnement nécessaires"
        exit 1
    fi
    
    # Vérifier le fichier docker-compose
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        log ERROR "Fichier Docker Compose manquant: $COMPOSE_FILE"
        exit 1
    fi
    
    log SUCCESS "Tous les prérequis sont satisfaits"
}

# Fonction pour créer les répertoires nécessaires
create_directories() {
    log INFO "Création des répertoires nécessaires..."
    
    mkdir -p "$BACKUP_DIR"
    mkdir -p "./logs"
    mkdir -p "./infra/nginx/ssl"
    mkdir -p "./infra/grafana"
    mkdir -p "./infra/prometheus"
    
    log SUCCESS "Répertoires créés avec succès"
}

# Fonction pour effectuer une sauvegarde
backup_database() {
    log INFO "Sauvegarde de la base de données..."
    
    local backup_file="$BACKUP_DIR/database-backup-$(date +%Y%m%d-%H%M%S).sql"
    
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "db.*Up"; then
        docker-compose -f "$COMPOSE_FILE" exec -T db pg_dump -U cipfaro cipfaro_production > "$backup_file"
        log SUCCESS "Sauvegarde créée: $backup_file"
    else
        log WARNING "Base de données non disponible pour la sauvegarde"
    fi
}

# Fonction pour valider la configuration
validate_configuration() {
    log INFO "Validation de la configuration..."
    
    # Validation du fichier docker-compose
    if ! docker-compose -f "$COMPOSE_FILE" config &> /dev/null; then
        log ERROR "Configuration Docker Compose invalide"
        exit 1
    fi
    
    # Vérification des variables d'environnement critiques
    source "$ENV_FILE"
    
    local required_vars=(
        "DB_PASSWORD"
        "REDIS_PASSWORD"
        "JWT_SECRET"
        "NEXTAUTH_SECRET"
    )
    
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var:-}" ]]; then
            log ERROR "Variable d'environnement manquante: $var"
            exit 1
        fi
    done
    
    log SUCCESS "Configuration validée avec succès"
}

# Fonction pour construire les images
build_images() {
    log INFO "Construction des images Docker..."
    
    docker-compose -f "$COMPOSE_FILE" build --no-cache --parallel
    
    log SUCCESS "Images construites avec succès"
}

# Fonction pour arrêter les services existants
stop_services() {
    log INFO "Arrêt des services existants..."
    
    if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
        docker-compose -f "$COMPOSE_FILE" down --remove-orphans
    fi
    
    log SUCCESS "Services arrêtés"
}

# Fonction pour démarrer les services
start_services() {
    log INFO "Démarrage des services de production..."
    
    # Démarrage des services de base d'abord
    docker-compose -f "$COMPOSE_FILE" up -d db redis minio
    
    # Attendre que les services de base soient prêts
    log INFO "Attente de la disponibilité des services de base..."
    sleep 30
    
    # Démarrage des services applicatifs
    docker-compose -f "$COMPOSE_FILE" up -d api web
    
    # Attendre que les services applicatifs soient prêts
    log INFO "Attente de la disponibilité des services applicatifs..."
    sleep 20
    
    # Démarrage des services de monitoring et proxy
    docker-compose -f "$COMPOSE_FILE" up -d nginx grafana prometheus
    
    log SUCCESS "Services démarrés avec succès"
}

# Fonction pour vérifier la santé des services
health_check() {
    log INFO "Vérification de la santé des services..."
    
    local max_attempts=30
    local attempt=1
    
    while [[ $attempt -le $max_attempts ]]; do
        log INFO "Tentative $attempt/$max_attempts..."
        
        # Vérifier l'API
        if curl -f http://localhost:3001/health &> /dev/null; then
            log SUCCESS "API est opérationnelle"
            break
        fi
        
        if [[ $attempt -eq $max_attempts ]]; then
            log ERROR "L'API n'est pas opérationnelle après $max_attempts tentatives"
            return 1
        fi
        
        ((attempt++))
        sleep 10
    done
    
    # Vérifier le frontend
    if curl -f http://localhost:3000 &> /dev/null; then
        log SUCCESS "Frontend est opérationnel"
    else
        log WARNING "Frontend n'est pas accessible"
    fi
    
    log SUCCESS "Vérification de santé terminée"
}

# Fonction pour exécuter les migrations
run_migrations() {
    log INFO "Exécution des migrations de base de données..."
    
    docker-compose -f "$COMPOSE_FILE" exec -T api pnpm prisma migrate deploy
    
    log SUCCESS "Migrations exécutées avec succès"
}

# Fonction pour afficher les informations de déploiement
show_deployment_info() {
    log INFO "=== INFORMATIONS DE DÉPLOIEMENT ==="
    echo ""
    echo "🌐 Application Web: http://localhost:3000"
    echo "🔧 API Backend: http://localhost:3001"
    echo "📊 Monitoring Grafana: http://localhost:3001"
    echo "📈 Prometheus: http://localhost:9090"
    echo "💾 MinIO Console: http://localhost:9001"
    echo ""
    echo "📋 Statut des conteneurs:"
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    echo "💿 Utilisation du disque:"
    docker system df
    echo ""
    echo "📝 Logs de déploiement: $LOG_FILE"
    echo ""
    log SUCCESS "Déploiement terminé avec succès!"
}

# Fonction pour nettoyer en cas d'erreur
cleanup_on_error() {
    log ERROR "Erreur détectée, nettoyage en cours..."
    docker-compose -f "$COMPOSE_FILE" down --remove-orphans
    log INFO "Nettoyage terminé"
    exit 1
}

# Fonction principale
main() {
    trap cleanup_on_error ERR
    
    log INFO "=== DÉBUT DU DÉPLOIEMENT PRODUCTION CIPFARO E-LEARNING ==="
    log INFO "Environnement: $ENVIRONMENT"
    log INFO "Fichier de configuration: $ENV_FILE"
    log INFO "Fichier Docker Compose: $COMPOSE_FILE"
    
    check_prerequisites
    create_directories
    validate_configuration
    backup_database
    stop_services
    build_images
    start_services
    run_migrations
    health_check
    show_deployment_info
    
    log SUCCESS "=== DÉPLOIEMENT TERMINÉ AVEC SUCCÈS ==="
}

# Gestion des arguments de ligne de commande
case "${1:-}" in
    "start")
        start_services
        ;;
    "stop")
        stop_services
        ;;
    "restart")
        stop_services
        start_services
        ;;
    "backup")
        backup_database
        ;;
    "health")
        health_check
        ;;
    "logs")
        docker-compose -f "$COMPOSE_FILE" logs -f "${2:-}"
        ;;
    "")
        main
        ;;
    *)
        echo "Usage: $0 [start|stop|restart|backup|health|logs [service]]"
        exit 1
        ;;
esac