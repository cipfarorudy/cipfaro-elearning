# 🎓 CIPFARO E-Learning Platform# CIPFARO — E‑learning (Fullstack + API + SCORM/xAPI)<<<<<<< HEAD



[![CI/CD Pipeline](https://github.com/cipfarorudy/cipfaro-elearning/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/cipfarorudy/cipfaro-elearning/actions/workflows/ci-cd.yml)# cipfaro-elearning

[![Tests](https://github.com/cipfarorudy/cipfaro-elearning/actions/workflows/tests.yml/badge.svg)](https://github.com/cipfarorudy/cipfaro-elearning/actions/workflows/tests.yml)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)> 🎓 **Monorepo prêt à l'emploi pour démarrer votre plateforme e-learning conforme (Qualiopi/RNCP)**Plate-forme

[![Node.js Version](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)=======



> Plateforme d'apprentissage en ligne moderne avec support SCORM complet, interface d'administration avancée et pipeline CI/CD automatisé.[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)# CIPFARO — E‑learning (Fullstack + API + SCORM/xAPI)



## ✨ Nouvelles Fonctionnalités[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)



### 🏢 Dashboard Administrateur par Rôle[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)Monorepo prêt à l'emploi pour démarrer ta plateforme e-learning conforme (Qualiopi/RNCP) :

- **Interface moderne** avec statistiques en temps réel

- **Gestion des utilisateurs** et monitoring système  [![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)- API Node/Express + Prisma + Postgres

- **Vue d'ensemble** de la plateforme e-learning

- **Design responsive** avec composants réutilisables[![SCORM](https://img.shields.io/badge/SCORM-1.2-orange.svg)](https://scorm.com/)- Lecteur SCORM 1.2 minimal (objet `window.API`)



### 📤 Interface Upload SCORM Drag & Drop- Endpoint xAPI (LRS light)

- **Interface intuitive** de glisser-déposer

- **Validation automatique** des packages SCORM## 🚀 **Stack technique**- Pages Next.js (lecteur / démo)

- **Support multiple formats** : SCORM 1.2, 2004, xAPI, AICC

- **Feedback visuel** avec progression en temps réel



### 📅 Planning & Calendrier des Sessions- **🔧 Backend** : API Node.js/Express + Prisma ORM + PostgreSQL## ⚙️ Prérequis

- **Calendrier interactif** pour la planification

- **Gestion des événements** : formations, réunions, évaluations- **🎯 Frontend** : Next.js 14 + TypeScript + TailwindCSS- Node 20+, pnpm 9+

- **Interface modale** pour créer des sessions

- **Vue mensuelle** avec navigation fluide- **📦 SCORM** : Lecteur SCORM 1.2 avec objet `window.API` complet- Docker + Docker Compose



### 🚀 Pipeline CI/CD GitHub Actions- **📊 xAPI** : Endpoint xAPI (Learning Record Store léger)

- **Tests automatisés** : unité, intégration, E2E, sécurité

- **Déploiement automatique** staging et production- **🗂️ Monorepo** : pnpm workspaces + architecture modulaire## 🚀 Démarrage

- **Monitoring post-déploiement** avec health checks

- **Déploiement manuel** avec validation des entrées- **🐳 DevOps** : Docker Compose + variables d'environnement1. `cp .env.example .env` et adapte si besoin



## 🛠️ Stack Technologique2. `docker compose up -d`



### Frontend## 📋 **Fonctionnalités principales**3. Dans un autre terminal :

- **Next.js 14** - Framework React avec App Router

- **TypeScript** - Typage statique pour la robustesse   ```bash

- **React 18** - Interface utilisateur moderne

- **CSS Modules** - Styling modulaire et maintenable### 🎓 **Gestion pédagogique**   pnpm i



### Backend- ✅ Catalogue de formations avec codes RNCP/Blocs   pnpm --filter @cipfaro/api prisma:generate

- **Node.js & Express** - API REST performante

- **Prisma ORM** - Gestion de base de données type-safe- ✅ Sessions de formation avec planning et capacités   pnpm --filter @cipfaro/api db:push

- **PostgreSQL** - Base de données relationnelle robuste

- **AWS S3** - Stockage des fichiers SCORM- ✅ Inscriptions et suivi des apprenants   pnpm --filter @cipfaro/api db:seed



### E-Learning- ✅ Modules multi-formats (SCORM, vidéo, H5P, quiz, docs)   pnpm dev

- **SCORM Runtime** - Support complet SCORM 1.2 & 2004

- **xAPI/Tin Can** - Tracking d'apprentissage avancé- ✅ Progression et scoring automatisés   ```

- **AICC** - Compatibilité legacy

- **Package SCORM** custom avec API intégrée4. Front : http://localhost:3000 — API : http://localhost:3001/health



### DevOps & Infrastructure### 🔐 **Authentification & Rôles**

- **Docker** - Containerisation des applications

- **GitHub Actions** - CI/CD automatisé- ✅ Système utilisateurs avec rôles (Admin, Formateur, Stagiaire, OPCO)## 🔐 Connexion

- **pnpm Workspaces** - Gestion monorepo efficace

- **ESLint & Prettier** - Qualité de code automatisée- ✅ Authentification JWT avec refresh tokens- Utilisateur seed: `admin@cipfaro.local` / `admin1234` (à changer)



## 🚀 Installation et Démarrage- ✅ Permissions granulaires par rôle



### Prérequis## 🧪 Tester le SCORM

```bash

# Node.js 18+ et pnpm### 📊 **Conformité & Reporting**- Place un mini contenu SCORM dans `apps/web/public/scorm/demo/index_lms.html` (crée les dossiers)

node --version  # >= 18.0.0

npm install -g pnpm- ✅ **Émargements digitaux** (signature, OTP, webhook, biométrie)- Ouvre http://localhost:3000/learn/demo

```

- ✅ **Exports CSV/PDF** avec hash SHA-256 et QR codes- Le contenu SCORM appellera `window.API.*` et le `LMSCommit` persistera côté API.

### Installation

```bash- ✅ **Attestations RNCP** générées automatiquement

# Cloner le repository

git clone https://github.com/cipfarorudy/cipfaro-elearning.git- ✅ **Audit trail** complet (connexions, actions, progression)## 📚 Étapes suivantes

cd cipfaro-elearning

- ✅ **Rapports de présence** horodatés et sécurisés- Auth réelle côté front (login, stockage du JWT, fetch API)

# Installer les dépendances

pnpm install- Upload de ZIP SCORM sur MinIO + job d'import + résolution `launchUrl`



# Configuration de la base de données### 🎯 **SCORM & xAPI**- Émargements OTP/Signature + exports CSV/PDF

cd infra

cp .env.example .env- ✅ Import automatique de packages SCORM ZIP- Rapports progression/satisfaction/évaluations

# Modifier les variables d'environnement dans .env

- ✅ Runtime SCORM 1.2 complet avec sauvegarde CMI- RGPD: mentions, consentements, export/suppression des données

# Migrations Prisma

pnpm prisma migrate dev- ✅ xAPI Learning Record Store (LRS) intégré

pnpm prisma generate

```- ✅ Tracking des interactions et durées## 🧾 Exports & Attestations (nouveau)



### Démarrage en développement- **Présences CSV** : `GET /reports/attendance.csv?sessionId=...` (en-tête `X-Data-Hash` + ligne `# sha256=...`)

```bash

# API (port 3001)## ⚙️ **Prérequis**- **Présences PDF signé** : `GET /reports/attendance.pdf?sessionId=...` (QR + empreinte SHA-256)

cd apps/api

pnpm dev- **Attestation PDF** : `GET /reports/attestation/:enrollmentId.pdf` (progression, RNCP, QR/hash)



# Interface web (port 3000)- **Node.js** 20+ ([installer](https://nodejs.org/))

cd apps/web  

pnpm dev- **pnpm** 9+ (`npm install -g pnpm`)Pages front:



# Accéder à l'application- **Docker** + Docker Compose ([installer](https://docs.docker.com/get-docker/))- `/admin/reports` : liens directs pour CSV/PDF (sélectionne une session)

open http://localhost:3000

```



## 📂 Structure du Projet## 🚀 **Installation & Démarrage**## 🗂️ Nouveaux exports



```- **Audit CSV** : `GET /reports/audit.csv?sessionId=...&from=YYYY-MM-DD&to=YYYY-MM-DD` (empreinte via en-tête `X-Data-Hash` + ligne `# sha256=...`)

cipfaro-elearning/

├── 📁 apps/### 1️⃣ **Configuration**- **Attestations en lot (ZIP)** : `GET /reports/attestations.zip?sessionId=...`

│   ├── 📁 api/                    # API Express + TypeScript

│   │   ├── 📁 src/```bash

│   │   │   ├── 📄 server.ts       # Serveur Express principal

│   │   │   ├── 📁 routes/         # Routes API (auth, SCORM, xAPI)# Cloner le projet## 🧾 Audit automatique

│   │   │   └── 📁 lib/            # Utilitaires (auth, pdf, s3)

│   │   └── 🐳 Dockerfile          # Container APIgit clone https://github.com/cipfarorudy/cipfaro-elearning.gitÉvénements tracés : `LOGIN_SUCCESS`, `MODULE_CREATE`, `SCORM_COMMIT`, `XAPI_STORE`, `ATTENDANCE_SIGN`, `SCORM_IMPORT`.

│   │

│   └── 📁 web/                    # Application Next.jscd cipfaro-elearning>>>>>>> 6593849 (Initial commit)

│       ├── 📁 app/                # App Router Next.js 14

│       │   ├── 📁 dashboard/      # Dashboard administrateur

│       │   ├── 📁 learn/          # Interface apprentissage# Copier et adapter la configuration

│       │   └── 📁 admin/          # Gestion admincp .env.example .env

│       ├── 📁 public/             # Assets statiques# Éditer .env selon vos besoins

│       │   ├── 📄 index.html      # Page d'accueil principale```

│       │   ├── 📄 upload-scorm.html  # Interface upload SCORM

│       │   ├── 📄 planning.html   # Calendrier des sessions### 2️⃣ **Base de données**

│       │   └── 📁 scorm/demo/     # Demo SCORM interactif```bash

│       └── 🐳 Dockerfile          # Container Web# Démarrer PostgreSQL via Docker

│docker compose up -d

├── 📁 packages/

│   └── 📁 scorm-runtime/          # Package SCORM custom# Attendre que la DB soit prête (quelques secondes)

│       └── 📁 src/```

│           └── 📄 Api12.ts        # Implémentation SCORM 1.2

│### 3️⃣ **Installation des dépendances**

├── 📁 infra/```bash

│   └── 📁 prisma/# Installer toutes les dépendances du monorepo

│       ├── 📄 schema.prisma       # Schéma base de donnéespnpm install

│       └── 📄 seed.ts             # Données d'initialisation

│# Générer le client Prisma

├── 📁 .github/workflows/          # GitHub Actions CI/CDpnpm --filter @cipfaro/api prisma:generate

│   ├── 📄 ci-cd.yml              # Pipeline principal

│   ├── 📄 manual-deploy.yml      # Déploiement manuel# Créer les tables

│   └── 📄 tests.yml              # Tests automatiséspnpm --filter @cipfaro/api db:push

│

├── 📁 docs/# Injecter les données de test

│   └── 📄 architecture.md         # Documentation techniquepnpm --filter @cipfaro/api db:seed

│```

├── 🐳 docker-compose.yml          # Orchestration locale

├── 📄 pnpm-workspace.yaml         # Configuration monorepo### 4️⃣ **Démarrage en développement**

└── 📄 README.md                   # Ce fichier```bash

```# Démarrer tous les services

pnpm dev

## 🎮 Démonstrations```



### 🏢 Dashboard Administrateur🎉 **Accès aux services :**

```bash- **🌐 Frontend** : http://localhost:3000

# Accéder au dashboard- **🔧 API** : http://localhost:3001

http://localhost:3000/dashboard- **❤️ Health Check** : http://localhost:3001/health

```

**Fonctionnalités** :## 🔐 **Connexion par défaut**

- Statistiques en temps réel

- Actions rapides (création session, upload SCORM)| Rôle | Email | Mot de passe |

- Activité récente|------|-------|--------------|

- État du système| **Admin** | `admin@cipfaro.local` | `admin1234` |



### 📤 Upload SCORM> ⚠️ **Important** : Changez ces identifiants en production !

```bash

# Interface d'upload## 🧪 **Test du lecteur SCORM**

http://localhost:3000/upload-scorm.html

```1. **Page de démonstration** : http://localhost:3000/learn/demo

**Fonctionnalités** :2. La démo inclut :

- Drag & drop de fichiers ZIP   - Interface moderne responsive

- Validation des packages SCORM   - Simulation de cours en 5 étapes

- Progression de téléchargement   - Quiz interactif avec scoring

- Support formats multiples   - Tracking temps réel

   - Console de débogage SCORM

### 📅 Planning des Sessions

```bash## 📁 **Architecture du projet**

# Calendrier interactif

http://localhost:3000/planning.html```

```cipfaro-elearning/

**Fonctionnalités** :├── apps/

- Vue calendrier mensuelle│   ├── api/                    # API Node.js/Express

- Création d'événements│   │   ├── src/

- Types de sessions (formation, réunion, évaluation)│   │   │   ├── lib/           # Utilitaires (auth, prisma, s3, pdf)

- Navigation temporelle│   │   │   ├── routes/        # Endpoints API

│   │   │   └── templates/     # Templates EJS (PDF)

### 📚 SCORM Player Demo│   │   └── package.json

```bash│   └── web/                   # Frontend Next.js

# Démonstration SCORM│       ├── app/               # App Router Next.js 14

http://localhost:3000/scorm/demo/index_lms.html│       │   ├── admin/         # Interface admin

```│       │   ├── learn/         # Lecteur de contenu

**Fonctionnalités** :│       │   └── login/         # Authentification

- Lecteur SCORM complet│       └── package.json

- Suivi de progression├── packages/

- Quiz interactif│   └── scorm-runtime/         # Bibliothèque SCORM 1.2

- Débogage en temps réel├── infra/

│   └── prisma/               # Schéma DB + seeds

## 🔧 API Endpoints└── docker-compose.yml        # PostgreSQL + MinIO

```

### Authentication

```http## 🛠️ **Scripts disponibles**

POST   /api/auth/login          # Connexion utilisateur

POST   /api/auth/logout         # Déconnexion```bash

GET    /api/auth/profile        # Profil utilisateur# Développement

```pnpm dev                      # Démarrer tous les services

pnpm build                    # Builder pour production

### SCORM Managementpnpm start                    # Démarrer en production

```http

GET    /api/scorm              # Liste des modules SCORM# Base de données

POST   /api/scorm              # Upload nouveau modulepnpm db:push                  # Sync schema sans migration

GET    /api/scorm/:id          # Détails d'un modulepnpm db:migrate              # Appliquer les migrations

PUT    /api/scorm/:id          # Mise à jour modulepnpm db:seed                 # Injecter données de test

DELETE /api/scorm/:id          # Suppression module

```# API spécifique

pnpm --filter @cipfaro/api prisma:generate  # Générer client Prisma

### Learning Trackingpnpm --filter @cipfaro/api dev              # API seule

```http```

POST   /api/xapi/statements    # Envoi statements xAPI

GET    /api/attendance         # Gestion des présences## 📊 **Endpoints API principaux**

POST   /api/reports            # Génération de rapports

```### 🔐 **Authentification**

- `POST /auth/login` - Connexion utilisateur

### System- `POST /auth/refresh` - Renouveler le token

```http- `POST /auth/logout` - Déconnexion

GET    /api/health             # Health check système

GET    /api/catalog            # Catalogue des formations### 🎓 **Gestion pédagogique**

```- `GET /catalog` - Catalogue des formations

- `GET /modules/:id` - Détails d'un module

## 🚀 Déploiement- `POST /scorm-import` - Import package SCORM ZIP



### 🐳 Docker Compose (Développement)### 📋 **SCORM & xAPI**

```bash- `POST /scorm/api` - API SCORM 1.2 (LMSInitialize, LMSCommit, etc.)

# Démarrage complet- `POST /xapi/statements` - Enregistrer des statements xAPI

docker-compose up -d- `GET /xapi/statements` - Récupérer l'historique xAPI



# Logs en temps réel### 📄 **Exports & Rapports**

docker-compose logs -f- `GET /reports/attendance.csv` - Export présences CSV

- `GET /reports/attendance.pdf` - Présences PDF signées

# Arrêt- `GET /reports/attestation/:id.pdf` - Attestation individuelle

docker-compose down- `GET /reports/audit.csv` - Journal d'audit complet

```

## 🎯 **Conformité Qualiopi/RNCP**

### ☁️ Production (GitHub Actions)

```bash### ✅ **Exigences couvertes**

# Déploiement automatique- [x] **Émargements horodatés** avec preuves cryptographiques

git push origin main  # → Production- [x] **Traçabilité complète** des actions (audit trail)

git push origin develop  # → Staging- [x] **Attestations RNCP** avec QR codes de vérification

- [x] **Exports sécurisés** (hash SHA-256, signatures)

# Déploiement manuel- [x] **Suivi progression** détaillé par apprenant

# Aller dans Actions → Manual Deployment- [x] **Codes formations** RNCP/Blocs de compétences

# Sélectionner environnement et version

```### 📋 **À compléter selon besoins**

- [ ] **RGPD** : Consentements, export/suppression données

### 🔧 Variables d'Environnement- [ ] **Evaluations** : Questionnaires satisfaction

```bash- [ ] **Certifications** : Workflow validation compétences

# Base de données

DATABASE_URL="postgresql://user:password@localhost:5432/cipfaro"## 🚀 **Étapes suivantes recommandées**



# AWS S3### 🔧 **Développement**

AWS_ACCESS_KEY_ID="your-access-key"1. **Authentification frontend** complète (login, JWT storage)

AWS_SECRET_ACCESS_KEY="your-secret-key"2. **Upload SCORM** avec interface drag & drop

AWS_S3_BUCKET="cipfaro-scorm-packages"3. **Planning** : calendrier sessions avec Fullcalendar

AWS_REGION="eu-west-1"4. **Notifications** : emails automatiques (bienvenue, rappels)



# JWT### 🎨 **Interface utilisateur**

JWT_SECRET="your-super-secret-key"1. **Dashboard** : tableaux de bord par rôle

JWT_EXPIRES_IN="7d"2. **Responsive design** : optimisation mobile/tablette

3. **Thèmes** : personnalisation couleurs/logo

# Application4. **Accessibilité** : conformité RGAA/WCAG

NODE_ENV="production"

PORT="3001"### 🔒 **Production**

CORS_ORIGIN="https://your-domain.com"1. **CI/CD** : GitHub Actions ou GitLab CI

```2. **Monitoring** : logs structurés + alertes

3. **Backup** : stratégie sauvegarde DB + fichiers

## 🧪 Tests4. **Performance** : cache Redis + CDN



### Tests Automatisés## 📚 **Documentation technique**

```bash

# Tests unitaires- **[API Documentation](docs/api.md)** - Endpoints détaillés

pnpm test- **[SCORM Integration](docs/scorm.md)** - Guide d'intégration

- **[Deployment Guide](docs/deployment.md)** - Mise en production

# Tests d'intégration- **[Contributing](docs/contributing.md)** - Guide de contribution

pnpm test:integration

## 🤝 **Support & Contribution**

# Tests E2E

pnpm test:e2e- **Issues** : [GitHub Issues](https://github.com/cipfarorudy/cipfaro-elearning/issues)

- **Documentation** : [Wiki du projet](https://github.com/cipfarorudy/cipfaro-elearning/wiki)

# Coverage- **Discussions** : [GitHub Discussions](https://github.com/cipfarorudy/cipfaro-elearning/discussions)

pnpm test:coverage

```---



### Tests Manuels**🏢 CIPFARO** - *Votre partenaire pour l'innovation pédagogique*
```bash
# Health check API
curl http://localhost:3001/api/health

# Test SCORM player
open http://localhost:3000/scorm/demo/index_lms.html

# Vérification uploads
curl -X POST http://localhost:3001/api/scorm
```

## 📊 Monitoring & Analytics

### Health Checks
- **API** : `/api/health` - Status des services
- **Base de données** : Vérification connexion Prisma  
- **Stockage S3** : Test d'accès aux buckets
- **SCORM Runtime** : Validation des API

### Métriques Clés
- **Performance** : Temps de réponse < 100ms
- **Disponibilité** : Uptime > 99.9%
- **Chargement SCORM** : < 2 secondes
- **Upload fichiers** : Progression temps réel

## 🛡️ Sécurité

### Mesures Implémentées
- **Authentication JWT** avec refresh tokens
- **Validation des entrées** avec sanitisation
- **CORS** configuré pour domaines autorisés
- **Rate limiting** sur les API endpoints
- **Scan de vulnérabilités** automatisé (Trivy)
- **Headers de sécurité** (HTTPS, CSP, HSTS)

### Audit de Sécurité
```bash
# Scan des dépendances
pnpm audit

# Analyse statique
pnpm lint:security

# Tests de pénétration
pnpm test:security
```

## 🤝 Contribution

### Workflow de Développement
1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commiter** les changements (`git commit -m 'Add amazing feature'`)
4. **Pousser** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### Standards de Code
```bash
# Linting automatique
pnpm lint

# Formatage du code
pnpm format

# Vérification des types
pnpm type-check
```

## 📋 Roadmap

### ✅ Version 1.0 (Actuelle)
- Dashboard administrateur complet
- Interface upload SCORM drag & drop
- Calendrier de planification des sessions
- Pipeline CI/CD GitHub Actions
- Support SCORM 1.2 & 2004

### 🔄 Version 1.1 (En cours)
- [ ] Interface utilisateur apprenant
- [ ] Système de notifications en temps réel
- [ ] Rapports analytiques avancés
- [ ] API mobile React Native
- [ ] Tests automatisés E2E complets

### 🚀 Version 2.0 (Futur)
- [ ] Intelligence artificielle pour recommandations
- [ ] Intégration LTI (Learning Tools Interoperability)
- [ ] Support multilingue complet
- [ ] Gamification et badges
- [ ] Classe virtuelle intégrée

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour les détails.

## 🏆 Crédits

**Développement** : CIPFARO E-Learning Team  
**Architecture** : Architecture moderne et scalable  
**Technologies** : Stack JavaScript/TypeScript full-stack  
**Inspiration** : Standards e-learning modernes (SCORM, xAPI)

## 📞 Support

Pour toute question ou support :
- 📧 **Email** : [support@cipfaro.com](mailto:support@cipfaro.com)
- 🐛 **Issues** : [GitHub Issues](https://github.com/cipfarorudy/cipfaro-elearning/issues)
- 📖 **Documentation** : [docs/architecture.md](docs/architecture.md)
- 💬 **Discussions** : [GitHub Discussions](https://github.com/cipfarorudy/cipfaro-elearning/discussions)

---

<div align="center">

**🚀 Développé avec ❤️ pour l'éducation moderne**

[![GitHub stars](https://img.shields.io/github/stars/cipfarorudy/cipfaro-elearning?style=social)](https://github.com/cipfarorudy/cipfaro-elearning/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/cipfarorudy/cipfaro-elearning?style=social)](https://github.com/cipfarorudy/cipfaro-elearning/network/members)

</div>