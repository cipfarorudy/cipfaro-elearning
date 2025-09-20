<<<<<<< HEAD
# cipfaro-elearning
Plate-forme
=======
# CIPFARO — E‑learning (Fullstack + API + SCORM/xAPI)

Monorepo prêt à l'emploi pour démarrer ta plateforme e-learning conforme (Qualiopi/RNCP) :
- API Node/Express + Prisma + Postgres
- Lecteur SCORM 1.2 minimal (objet `window.API`)
- Endpoint xAPI (LRS light)
- Pages Next.js (lecteur / démo)

## ⚙️ Prérequis
- Node 20+, pnpm 9+
- Docker + Docker Compose

## 🚀 Démarrage
1. `cp .env.example .env` et adapte si besoin
2. `docker compose up -d`
3. Dans un autre terminal :
   ```bash
   pnpm i
   pnpm --filter @cipfaro/api prisma:generate
   pnpm --filter @cipfaro/api db:push
   pnpm --filter @cipfaro/api db:seed
   pnpm dev
   ```
4. Front : http://localhost:3000 — API : http://localhost:3001/health

## 🔐 Connexion
- Utilisateur seed: `admin@cipfaro.local` / `admin1234` (à changer)

## 🧪 Tester le SCORM
- Place un mini contenu SCORM dans `apps/web/public/scorm/demo/index_lms.html` (crée les dossiers)
- Ouvre http://localhost:3000/learn/demo
- Le contenu SCORM appellera `window.API.*` et le `LMSCommit` persistera côté API.

## 📚 Étapes suivantes
- Auth réelle côté front (login, stockage du JWT, fetch API)
- Upload de ZIP SCORM sur MinIO + job d'import + résolution `launchUrl`
- Émargements OTP/Signature + exports CSV/PDF
- Rapports progression/satisfaction/évaluations
- RGPD: mentions, consentements, export/suppression des données

## 🧾 Exports & Attestations (nouveau)
- **Présences CSV** : `GET /reports/attendance.csv?sessionId=...` (en-tête `X-Data-Hash` + ligne `# sha256=...`)
- **Présences PDF signé** : `GET /reports/attendance.pdf?sessionId=...` (QR + empreinte SHA-256)
- **Attestation PDF** : `GET /reports/attestation/:enrollmentId.pdf` (progression, RNCP, QR/hash)

Pages front:
- `/admin/reports` : liens directs pour CSV/PDF (sélectionne une session)

## 🗂️ Nouveaux exports
- **Audit CSV** : `GET /reports/audit.csv?sessionId=...&from=YYYY-MM-DD&to=YYYY-MM-DD` (empreinte via en-tête `X-Data-Hash` + ligne `# sha256=...`)
- **Attestations en lot (ZIP)** : `GET /reports/attestations.zip?sessionId=...`

## 🧾 Audit automatique
Événements tracés : `LOGIN_SUCCESS`, `MODULE_CREATE`, `SCORM_COMMIT`, `XAPI_STORE`, `ATTENDANCE_SIGN`, `SCORM_IMPORT`.
>>>>>>> 6593849 (Initial commit)
