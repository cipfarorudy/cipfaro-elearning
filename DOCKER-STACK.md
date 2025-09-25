# 🐳 CIPFARO E-Learning - Stack Docker Production

Cette stack Docker fournit une infrastructure complète pour la plateforme CIPFARO E-Learning avec tous les services nécessaires.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Nginx       │    │   Next.js Web   │    │  Express API    │
│   (Port 80)     │────│   (Port 3000)   │────│   (Port 4000)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
    ┌─────────────────┬──────────┼──────────┬─────────────────┐
    │                 │          │          │                 │
┌───▼───┐    ┌────▼────┐    ┌───▼───┐    ┌──▼──┐    ┌───▼────┐
│ Redis │    │ Postgres│    │ MinIO │    │ ... │    │ Grafana│
│:6379  │    │  :5432  │    │ :9000 │    │     │    │ :3001  │
└───────┘    └─────────┘    └───────┘    └─────┘    └────────┘
```

## 🚀 Services Inclus

| Service | Port | Description |
|---------|------|-------------|
| **nginx** | 80 | Reverse proxy principal |
| **web** | 3000 | Application Next.js |
| **api** | 4000 | API Express/Prisma |
| **postgres** | 5432 | Base de données principale |
| **redis** | 6379 | Cache et sessions |
| **minio** | 9000/9001 | Stockage S3 (SCORM) |
| **prometheus** | 9090 | Collecte de métriques |
| **grafana** | 3001 | Tableaux de bord |

## 📋 Prérequis

- Docker 24+ avec Docker Compose
- 4GB RAM minimum
- Ports 80, 3000, 4000, 5432, 6379, 9000, 9001, 9090, 3001 libres

## 🎯 Démarrage Rapide

### 1. Configuration initiale
```bash
# Cloner le projet
git clone <repo-url>
cd cipfaro-elearning

# Vérifier le fichier .env
cp .env.example .env  # Si nécessaire
```

### 2. Lancer tous les services
```bash
docker compose up -d
```

### 3. Initialiser la base de données
```bash
# Attendre que PostgreSQL soit prêt (30s)
docker compose exec api pnpm prisma:migrate
docker compose exec api pnpm prisma:seed
```

## 🌐 Accès aux Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Application** | http://localhost | Voir comptes test |
| **API directe** | http://localhost/api | - |
| **MinIO Console** | http://localhost:9001 | admin / adminadmin |
| **Prometheus** | http://localhost:9090 | - |
| **Grafana** | http://localhost:3001 | admin / admin123 |

### 🔐 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@cipfaro.fr | admin123 |
| **Formateur** | formateur@cipfaro.fr | formateur123 |
| **Stagiaire** | stagiaire@cipfaro.fr | stagiaire123 |
| **OPCO** | opco@cipfaro.fr | opco123 |

## 🛠️ Commandes Utiles

### Gestion des services
```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs
docker compose logs -f

# Voir les logs d'un service spécifique
docker compose logs -f api

# Redémarrer un service
docker compose restart api

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes
docker compose down -v
```

### Base de données
```bash
# Accéder à PostgreSQL
docker compose exec postgres psql -U cipfaro -d cipfaro

# Reset complet de la DB
docker compose exec api pnpm prisma:reset

# Migrer la DB
docker compose exec api pnpm prisma:migrate

# Seed avec données de test
docker compose exec api pnpm prisma:seed
```

### Stockage SCORM
```bash
# Accéder au client MinIO
docker compose exec minio-setup mc ls minio/scorm

# Voir la configuration des buckets
docker compose exec minio-setup mc policy list minio/scorm
```

## 🔧 Configuration Avancée

### Variables d'environnement clés
```env
# Base de données
DATABASE_URL=postgresql://cipfaro:changeme@postgres:5432/cipfaro
POSTGRES_PASSWORD=changeme

# MinIO/S3
MINIO_ROOT_PASSWORD=adminadmin
S3_BUCKET=scorm

# API
JWT_SECRET=your-super-secret-jwt-key
API_URL=http://localhost:4000
```

### Personnalisation Nginx
Modifier `deploy/nginx.conf` pour :
- Ajouter HTTPS/SSL
- Configurer la mise en cache
- Limiter les taux de requêtes

### Métriques personnalisées
L'API expose des métriques Prometheus sur `/metrics` :
- Durée des requêtes HTTP
- Nombre total de requêtes
- Utilisateurs actifs
- Modules SCORM

## 📊 Monitoring

### Grafana Dashboard
- URL : http://localhost:3001
- Login : admin / admin123
- Source de données Prometheus préconfigurée

### Métriques disponibles
- Performance de l'API
- Utilisation de la base de données
- Métriques système (CPU, RAM)
- Santé des services

## 🔍 Troubleshooting

### Services qui ne démarrent pas
```bash
# Vérifier l'état des services
docker compose ps

# Voir les logs d'erreur
docker compose logs

# Vérifier l'utilisation des ports
netstat -tulpn | grep -E ':(80|3000|4000|5432|6379|9000|9001|9090|3001)'
```

### Problèmes de base de données
```bash
# Vérifier la connectivité PostgreSQL
docker compose exec postgres pg_isready -U cipfaro

# Reset complet si nécessaire
docker compose down -v
docker compose up -d postgres
# Attendre 30s puis
docker compose up -d
```

### Problèmes de stockage SCORM
```bash
# Recréer le bucket MinIO
docker compose exec minio-setup mc mb --ignore-existing minio/scorm
docker compose exec minio-setup mc policy set public minio/scorm
```

## 🚀 Production

### Sécurité
- [ ] Changer tous les mots de passe par défaut
- [ ] Configurer HTTPS/SSL avec certificats
- [ ] Limiter l'accès aux ports internes
- [ ] Activer les logs d'audit

### Performance
- [ ] Optimiser les configurations PostgreSQL
- [ ] Activer la mise en cache Redis
- [ ] Configurer la compression gzip/brotli
- [ ] Monitorer avec Grafana/Prometheus

### Sauvegarde
```bash
# Backup PostgreSQL
docker compose exec postgres pg_dump -U cipfaro cipfaro > backup.sql

# Backup MinIO
docker compose exec minio mc mirror minio/scorm ./backup-scorm/
```

---

## 📝 Notes

- **Réseau** : Tous les services communiquent via le réseau Docker `cipfaro`
- **Persistance** : Les données sont stockées dans des volumes Docker nommés
- **Health Checks** : Tous les services incluent des vérifications de santé
- **Logs** : Centralisés via Docker Compose

Pour plus d'informations, consulter la documentation complète dans `/docs/`.