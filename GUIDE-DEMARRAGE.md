# 🚀 Guide de Démarrage Rapide - CIPFARO E-Learning Enhanced

## 🎯 Test des Nouvelles Fonctionnalités

Ce guide vous permet de tester rapidement toutes les améliorations apportées à la plateforme.

---

## 📋 Prérequis

1. **Docker Desktop** installé et démarré
2. **Node.js 18+** et **pnpm** installés
3. **PostgreSQL** (via Docker ou local)

---

## 🚀 Démarrage Express (5 minutes)

### 1. Démarrer la Base de Données
```bash
# Dans le répertoire du projet
cd d:\cipfaro-elearning

# Démarrer PostgreSQL avec Docker
docker-compose up -d postgres

# Ou via Docker directement
docker run --name cipfaro-postgres -e POSTGRES_PASSWORD=cipfaro123 -e POSTGRES_DB=cipfaro -p 5432:5432 -d postgres:15
```

### 2. Installer les Dépendances
```bash
# Installation des packages
pnpm install

# Configuration Prisma
cd infra
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### 3. Peupler la Base avec les Données de Test
```bash
# Seed simplifié avec les 4 comptes utilisateurs
pnpm run db:seed-simple
```

### 4. Démarrer les Services
```bash
# Terminal 1 : API Backend
cd apps/api
pnpm dev

# Terminal 2 : Interface Web
cd apps/web  
pnpm dev
```

---

## 🧪 Scénarios de Test

### 🔐 Test 1 : Authentification JWT

**URL :** http://localhost:3000/login/v2

**Comptes de test :**
```
👨‍💼 admin@cipfaro.fr / admin123
👨‍🏫 formateur@cipfaro.fr / formateur123
🎓 stagiaire@cipfaro.fr / stagiaire123
💼 opco@cipfaro.fr / opco123
```

**Actions à tester :**
1. Connexion avec un compte → Vérifier redirection dashboard
2. Actualiser la page → Vérifier persistence de session
3. Attendre 15 min → Tester refresh automatique des tokens
4. Se déconnecter → Vérifier suppression des tokens

### 📊 Test 2 : Dashboard Dynamique par Rôle

**URL :** http://localhost:3000/dashboard/enhanced

**Tests par rôle :**

**🏢 ADMIN :**
- Voir : Tous utilisateurs, tous modules, activité globale
- Statistiques : 4 utilisateurs, modules totaux
- Cartes d'action : Gestion utilisateurs, modules, rapports

**👨‍🏫 FORMATEUR :**  
- Voir : Mes modules, mes étudiants
- Statistiques : Modules créés, inscriptions
- Cartes d'action : Créer module, voir étudiants

**🎓 STAGIAIRE :**
- Voir : Mes formations, ma progression
- Statistiques : Modules inscrits, terminés
- Cartes d'action : Continuer formation, certificats

**💼 OPCO :**
- Voir : Formations financées, ROI
- Statistiques : Apprenants, completion
- Cartes d'action : Rapports financiers, validation

### 🔄 Test 3 : API Endpoints

**Base URL :** http://localhost:5000

**Avec Postman/curl :**

```bash
# 1. Login
curl -X POST http://localhost:5000/auth/v2/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@cipfaro.fr","password":"admin123"}'

# 2. Dashboard Stats (avec token obtenu)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/dashboard/stats

# 3. Profil utilisateur
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/auth/v2/me

# 4. Refresh token
curl -X POST http://localhost:5000/auth/v2/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

---

## 🔍 Points de Validation

### ✅ Authentification
- [ ] Login successful avec redirection
- [ ] Tokens stockés dans localStorage
- [ ] Auto-refresh tokens avant expiration
- [ ] Logout complet (suppression tokens)
- [ ] Protection routes sans auth

### ✅ Dashboard
- [ ] Statistiques différentes par rôle
- [ ] Activité récente pertinente
- [ ] Navigation adaptée au rôle
- [ ] Performance < 500ms

### ✅ Sécurité
- [ ] Mots de passe hashés en base
- [ ] JWT valides avec payload correct
- [ ] Validation Zod active sur API
- [ ] Logs d'audit créés

### ✅ Interface
- [ ] Design responsive mobile/desktop
- [ ] Loading states pendant API calls
- [ ] Gestion d'erreurs utilisateur
- [ ] Expérience fluide

---

## 🐛 Debugging

### Logs à Surveiller

**Backend (port 5000) :**
```bash
# Connexions réussies
POST /auth/v2/login 200

# Erreurs d'authentification  
POST /auth/v2/login 401 - Invalid credentials

# Dashboard access
GET /dashboard/stats 200

# Token refresh
POST /auth/v2/refresh 200
```

**Frontend (port 3000) :**
```bash
# Routes chargées
GET /dashboard/enhanced 200
GET /login/v2 200

# API Proxy
POST /api/auth/v2/login → http://localhost:5000/auth/v2/login
```

### Problèmes Fréquents

**🔴 Base de données inaccessible**
```bash
# Vérifier PostgreSQL
docker ps | grep postgres
# Redémarrer si nécessaire  
docker-compose restart postgres
```

**🔴 Ports déjà utilisés**
```bash
# Changer ports dans package.json si conflit
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

**🔴 Tokens expirés**
```bash
# Effacer localStorage du navigateur
localStorage.clear()
# Ou utiliser DevTools → Application → Local Storage
```

---

## 📊 Métriques de Performance

### Targets à Respecter
- **Login API :** < 200ms
- **Dashboard load :** < 500ms  
- **Page transition :** < 100ms
- **Token refresh :** < 100ms

### Outils de Mesure
- **DevTools Network** pour APIs
- **DevTools Performance** pour rendu
- **Console logs** pour debug timing

---

## 🎉 Test Complet Réussi

Si tous les tests passent, vous avez :

✅ **Système d'authentification JWT professionnel**
✅ **Dashboard adaptatif par rôle utilisateur**  
✅ **API sécurisée avec validation complète**
✅ **Interface moderne et responsive**
✅ **Architecture évolutive et maintenable**

**Prêt pour déploiement en production !** 🚀

---

## 📞 Support

Pour questions ou problèmes :
1. Vérifier les logs backend/frontend
2. Tester l'API directement avec curl
3. Vérifier la base de données avec Prisma Studio : `pnpm prisma studio`