# CIPFARO — E‑learning (Fullstack + API + SCORM/xAPI)<<<<<<< HEAD

# cipfaro-elearning

> 🎓 **Monorepo prêt à l'emploi pour démarrer votre plateforme e-learning conforme (Qualiopi/RNCP)**Plate-forme

=======

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)# CIPFARO — E‑learning (Fullstack + API + SCORM/xAPI)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748.svg)](https://www.prisma.io/)Monorepo prêt à l'emploi pour démarrer ta plateforme e-learning conforme (Qualiopi/RNCP) :

[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org/)- API Node/Express + Prisma + Postgres

[![SCORM](https://img.shields.io/badge/SCORM-1.2-orange.svg)](https://scorm.com/)- Lecteur SCORM 1.2 minimal (objet `window.API`)

- Endpoint xAPI (LRS light)

## 🚀 **Stack technique**- Pages Next.js (lecteur / démo)



- **🔧 Backend** : API Node.js/Express + Prisma ORM + PostgreSQL## ⚙️ Prérequis

- **🎯 Frontend** : Next.js 14 + TypeScript + TailwindCSS- Node 20+, pnpm 9+

- **📦 SCORM** : Lecteur SCORM 1.2 avec objet `window.API` complet- Docker + Docker Compose

- **📊 xAPI** : Endpoint xAPI (Learning Record Store léger)

- **🗂️ Monorepo** : pnpm workspaces + architecture modulaire## 🚀 Démarrage

- **🐳 DevOps** : Docker Compose + variables d'environnement1. `cp .env.example .env` et adapte si besoin

2. `docker compose up -d`

## 📋 **Fonctionnalités principales**3. Dans un autre terminal :

   ```bash

### 🎓 **Gestion pédagogique**   pnpm i

- ✅ Catalogue de formations avec codes RNCP/Blocs   pnpm --filter @cipfaro/api prisma:generate

- ✅ Sessions de formation avec planning et capacités   pnpm --filter @cipfaro/api db:push

- ✅ Inscriptions et suivi des apprenants   pnpm --filter @cipfaro/api db:seed

- ✅ Modules multi-formats (SCORM, vidéo, H5P, quiz, docs)   pnpm dev

- ✅ Progression et scoring automatisés   ```

4. Front : http://localhost:3000 — API : http://localhost:3001/health

### 🔐 **Authentification & Rôles**

- ✅ Système utilisateurs avec rôles (Admin, Formateur, Stagiaire, OPCO)## 🔐 Connexion

- ✅ Authentification JWT avec refresh tokens- Utilisateur seed: `admin@cipfaro.local` / `admin1234` (à changer)

- ✅ Permissions granulaires par rôle

## 🧪 Tester le SCORM

### 📊 **Conformité & Reporting**- Place un mini contenu SCORM dans `apps/web/public/scorm/demo/index_lms.html` (crée les dossiers)

- ✅ **Émargements digitaux** (signature, OTP, webhook, biométrie)- Ouvre http://localhost:3000/learn/demo

- ✅ **Exports CSV/PDF** avec hash SHA-256 et QR codes- Le contenu SCORM appellera `window.API.*` et le `LMSCommit` persistera côté API.

- ✅ **Attestations RNCP** générées automatiquement

- ✅ **Audit trail** complet (connexions, actions, progression)## 📚 Étapes suivantes

- ✅ **Rapports de présence** horodatés et sécurisés- Auth réelle côté front (login, stockage du JWT, fetch API)

- Upload de ZIP SCORM sur MinIO + job d'import + résolution `launchUrl`

### 🎯 **SCORM & xAPI**- Émargements OTP/Signature + exports CSV/PDF

- ✅ Import automatique de packages SCORM ZIP- Rapports progression/satisfaction/évaluations

- ✅ Runtime SCORM 1.2 complet avec sauvegarde CMI- RGPD: mentions, consentements, export/suppression des données

- ✅ xAPI Learning Record Store (LRS) intégré

- ✅ Tracking des interactions et durées## 🧾 Exports & Attestations (nouveau)

- **Présences CSV** : `GET /reports/attendance.csv?sessionId=...` (en-tête `X-Data-Hash` + ligne `# sha256=...`)

## ⚙️ **Prérequis**- **Présences PDF signé** : `GET /reports/attendance.pdf?sessionId=...` (QR + empreinte SHA-256)

- **Attestation PDF** : `GET /reports/attestation/:enrollmentId.pdf` (progression, RNCP, QR/hash)

- **Node.js** 20+ ([installer](https://nodejs.org/))

- **pnpm** 9+ (`npm install -g pnpm`)Pages front:

- **Docker** + Docker Compose ([installer](https://docs.docker.com/get-docker/))- `/admin/reports` : liens directs pour CSV/PDF (sélectionne une session)



## 🚀 **Installation & Démarrage**## 🗂️ Nouveaux exports

- **Audit CSV** : `GET /reports/audit.csv?sessionId=...&from=YYYY-MM-DD&to=YYYY-MM-DD` (empreinte via en-tête `X-Data-Hash` + ligne `# sha256=...`)

### 1️⃣ **Configuration**- **Attestations en lot (ZIP)** : `GET /reports/attestations.zip?sessionId=...`

```bash

# Cloner le projet## 🧾 Audit automatique

git clone https://github.com/cipfarorudy/cipfaro-elearning.gitÉvénements tracés : `LOGIN_SUCCESS`, `MODULE_CREATE`, `SCORM_COMMIT`, `XAPI_STORE`, `ATTENDANCE_SIGN`, `SCORM_IMPORT`.

cd cipfaro-elearning>>>>>>> 6593849 (Initial commit)


# Copier et adapter la configuration
cp .env.example .env
# Éditer .env selon vos besoins
```

### 2️⃣ **Base de données**
```bash
# Démarrer PostgreSQL via Docker
docker compose up -d

# Attendre que la DB soit prête (quelques secondes)
```

### 3️⃣ **Installation des dépendances**
```bash
# Installer toutes les dépendances du monorepo
pnpm install

# Générer le client Prisma
pnpm --filter @cipfaro/api prisma:generate

# Créer les tables
pnpm --filter @cipfaro/api db:push

# Injecter les données de test
pnpm --filter @cipfaro/api db:seed
```

### 4️⃣ **Démarrage en développement**
```bash
# Démarrer tous les services
pnpm dev
```

🎉 **Accès aux services :**
- **🌐 Frontend** : http://localhost:3000
- **🔧 API** : http://localhost:3001
- **❤️ Health Check** : http://localhost:3001/health

## 🔐 **Connexion par défaut**

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | `admin@cipfaro.local` | `admin1234` |

> ⚠️ **Important** : Changez ces identifiants en production !

## 🧪 **Test du lecteur SCORM**

1. **Page de démonstration** : http://localhost:3000/learn/demo
2. La démo inclut :
   - Interface moderne responsive
   - Simulation de cours en 5 étapes
   - Quiz interactif avec scoring
   - Tracking temps réel
   - Console de débogage SCORM

## 📁 **Architecture du projet**

```
cipfaro-elearning/
├── apps/
│   ├── api/                    # API Node.js/Express
│   │   ├── src/
│   │   │   ├── lib/           # Utilitaires (auth, prisma, s3, pdf)
│   │   │   ├── routes/        # Endpoints API
│   │   │   └── templates/     # Templates EJS (PDF)
│   │   └── package.json
│   └── web/                   # Frontend Next.js
│       ├── app/               # App Router Next.js 14
│       │   ├── admin/         # Interface admin
│       │   ├── learn/         # Lecteur de contenu
│       │   └── login/         # Authentification
│       └── package.json
├── packages/
│   └── scorm-runtime/         # Bibliothèque SCORM 1.2
├── infra/
│   └── prisma/               # Schéma DB + seeds
└── docker-compose.yml        # PostgreSQL + MinIO
```

## 🛠️ **Scripts disponibles**

```bash
# Développement
pnpm dev                      # Démarrer tous les services
pnpm build                    # Builder pour production
pnpm start                    # Démarrer en production

# Base de données
pnpm db:push                  # Sync schema sans migration
pnpm db:migrate              # Appliquer les migrations
pnpm db:seed                 # Injecter données de test

# API spécifique
pnpm --filter @cipfaro/api prisma:generate  # Générer client Prisma
pnpm --filter @cipfaro/api dev              # API seule
```

## 📊 **Endpoints API principaux**

### 🔐 **Authentification**
- `POST /auth/login` - Connexion utilisateur
- `POST /auth/refresh` - Renouveler le token
- `POST /auth/logout` - Déconnexion

### 🎓 **Gestion pédagogique**
- `GET /catalog` - Catalogue des formations
- `GET /modules/:id` - Détails d'un module
- `POST /scorm-import` - Import package SCORM ZIP

### 📋 **SCORM & xAPI**
- `POST /scorm/api` - API SCORM 1.2 (LMSInitialize, LMSCommit, etc.)
- `POST /xapi/statements` - Enregistrer des statements xAPI
- `GET /xapi/statements` - Récupérer l'historique xAPI

### 📄 **Exports & Rapports**
- `GET /reports/attendance.csv` - Export présences CSV
- `GET /reports/attendance.pdf` - Présences PDF signées
- `GET /reports/attestation/:id.pdf` - Attestation individuelle
- `GET /reports/audit.csv` - Journal d'audit complet

## 🎯 **Conformité Qualiopi/RNCP**

### ✅ **Exigences couvertes**
- [x] **Émargements horodatés** avec preuves cryptographiques
- [x] **Traçabilité complète** des actions (audit trail)
- [x] **Attestations RNCP** avec QR codes de vérification
- [x] **Exports sécurisés** (hash SHA-256, signatures)
- [x] **Suivi progression** détaillé par apprenant
- [x] **Codes formations** RNCP/Blocs de compétences

### 📋 **À compléter selon besoins**
- [ ] **RGPD** : Consentements, export/suppression données
- [ ] **Evaluations** : Questionnaires satisfaction
- [ ] **Certifications** : Workflow validation compétences

## 🚀 **Étapes suivantes recommandées**

### 🔧 **Développement**
1. **Authentification frontend** complète (login, JWT storage)
2. **Upload SCORM** avec interface drag & drop
3. **Planning** : calendrier sessions avec Fullcalendar
4. **Notifications** : emails automatiques (bienvenue, rappels)

### 🎨 **Interface utilisateur**
1. **Dashboard** : tableaux de bord par rôle
2. **Responsive design** : optimisation mobile/tablette
3. **Thèmes** : personnalisation couleurs/logo
4. **Accessibilité** : conformité RGAA/WCAG

### 🔒 **Production**
1. **CI/CD** : GitHub Actions ou GitLab CI
2. **Monitoring** : logs structurés + alertes
3. **Backup** : stratégie sauvegarde DB + fichiers
4. **Performance** : cache Redis + CDN

## 📚 **Documentation technique**

- **[API Documentation](docs/api.md)** - Endpoints détaillés
- **[SCORM Integration](docs/scorm.md)** - Guide d'intégration
- **[Deployment Guide](docs/deployment.md)** - Mise en production
- **[Contributing](docs/contributing.md)** - Guide de contribution

## 🤝 **Support & Contribution**

- **Issues** : [GitHub Issues](https://github.com/cipfarorudy/cipfaro-elearning/issues)
- **Documentation** : [Wiki du projet](https://github.com/cipfarorudy/cipfaro-elearning/wiki)
- **Discussions** : [GitHub Discussions](https://github.com/cipfarorudy/cipfaro-elearning/discussions)

---

**🏢 CIPFARO** - *Votre partenaire pour l'innovation pédagogique*