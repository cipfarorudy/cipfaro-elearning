#!/bin/bash

# 🚀 Script de démarrage CIPFARO E-Learning Stack Docker
# Usage: ./start-stack.sh [dev|prod|stop|logs]

set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage avec couleurs
log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifier que Docker est installé et en marche
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker n'est pas installé"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker n'est pas en marche"
        exit 1
    fi
    
    success "Docker est prêt"
}

# Vérifier les ports
check_ports() {
    ports=(80 3000 4000 5432 6379 9000 9001 9090 3001)
    occupied_ports=()
    
    for port in "${ports[@]}"; do
        if lsof -i :$port &> /dev/null; then
            occupied_ports+=($port)
        fi
    done
    
    if [ ${#occupied_ports[@]} -ne 0 ]; then
        warning "Ports occupés : ${occupied_ports[*]}"
        echo "Voulez-vous continuer ? (y/N)"
        read -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Démarrage mode développement
start_dev() {
    log "Démarrage en mode développement..."
    
    # Override pour développement
    export NODE_ENV=development
    export DATABASE_URL="postgresql://cipfaro:changeme@localhost:5432/cipfaro?schema=public"
    
    docker compose up -d postgres redis minio minio-setup prometheus grafana
    
    success "Services infrastructure démarrés"
    log "Démarrez api et web manuellement avec 'pnpm dev'"
}

# Démarrage mode production
start_prod() {
    log "Démarrage en mode production..."
    
    # Vérifier le fichier .env
    if [ ! -f .env ]; then
        warning "Fichier .env manquant, utilisation des valeurs par défaut"
    fi
    
    # Build et démarrage de tous les services
    log "Building images Docker..."
    docker compose build --no-cache
    
    log "Démarrage des services..."
    docker compose up -d
    
    # Attendre que PostgreSQL soit prêt
    log "Attente de PostgreSQL..."
    timeout=60
    while ! docker compose exec postgres pg_isready -U cipfaro -d cipfaro &> /dev/null; do
        sleep 2
        timeout=$((timeout-2))
        if [ $timeout -le 0 ]; then
            error "PostgreSQL n'a pas démarré dans les temps"
            exit 1
        fi
    done
    
    # Initialiser la base de données
    log "Initialisation de la base de données..."
    docker compose exec api pnpm prisma:generate || true
    docker compose exec api pnpm prisma:migrate || true
    docker compose exec api pnpm prisma:seed || true
    
    success "Stack démarrée avec succès !"
    
    # Afficher les URLs
    echo
    echo "🌐 Services disponibles :"
    echo "   Application :  http://localhost"
    echo "   API :          http://localhost/api"
    echo "   MinIO Console: http://localhost:9001"
    echo "   Prometheus :   http://localhost:9090"
    echo "   Grafana :      http://localhost:3001"
    echo
    echo "🔐 Comptes de test :"
    echo "   Admin :     admin@cipfaro.fr / admin123"
    echo "   Formateur : formateur@cipfaro.fr / formateur123"
    echo "   Stagiaire : stagiaire@cipfaro.fr / stagiaire123"
}

# Arrêt des services
stop_services() {
    log "Arrêt des services..."
    docker compose down
    success "Services arrêtés"
}

# Arrêt complet avec suppression des volumes
stop_all() {
    warning "Arrêt complet avec suppression des données"
    echo "Êtes-vous sûr ? Toutes les données seront perdues (y/N)"
    read -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker compose down -v
        docker system prune -f
        success "Nettoyage complet effectué"
    fi
}

# Affichage des logs
show_logs() {
    if [ -n "$2" ]; then
        docker compose logs -f "$2"
    else
        docker compose logs -f
    fi
}

# Affichage de l'aide
show_help() {
    echo "Usage: $0 [COMMAND]"
    echo
    echo "Commands:"
    echo "  dev      Démarrer en mode développement (infra seulement)"
    echo "  prod     Démarrer en mode production (stack complète)"
    echo "  stop     Arrêter les services"
    echo "  clean    Arrêt complet avec suppression des données"
    echo "  logs     Afficher les logs (optionnel: nom du service)"
    echo "  status   Afficher l'état des services"
    echo "  help     Afficher cette aide"
    echo
    echo "Examples:"
    echo "  $0 prod                # Démarrage production"
    echo "  $0 logs api           # Logs du service API"
    echo "  $0 stop               # Arrêt des services"
}

# Fonction principale
main() {
    check_docker
    
    case "${1:-help}" in
        "dev")
            check_ports
            start_dev
            ;;
        "prod")
            check_ports
            start_prod
            ;;
        "stop")
            stop_services
            ;;
        "clean")
            stop_all
            ;;
        "logs")
            show_logs "$@"
            ;;
        "status")
            docker compose ps
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

main "$@"