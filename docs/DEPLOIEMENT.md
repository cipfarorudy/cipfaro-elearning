# 🚀 Guide de Déploiement CIPFARO V2

## Vue d'ensemble

Ce guide couvre le système de déploiement complet de CIPFARO V2, incluant les tests automatisés, le contrôle de sécurité et le déploiement manuel contrôlé.

## 📋 Table des matières

1. [Tests et Validation](#tests-et-validation)
2. [Contrôle Manuel de Déploiement](#contrôle-manuel-de-déploiement)
3. [GitHub Actions (CI/CD)](#github-actions-cicd)
4. [Environnements](#environnements)
5. [Sécurité](#sécurité)
6. [Dépannage](#dépannage)

## 🧪 Tests et Validation

### Tests Unitaires
```bash
# Exécuter tous les tests
pnpm test

# Tests en mode watch
pnpm test:watch

# Tests avec couverture
pnpm test:coverage

# Tests pour CI/CD
pnpm test:ci
```

### Tests End-to-End (E2E)
```bash
# Installer Playwright
pnpm playwright:install

# Exécuter les tests E2E
pnpm test:e2e

# Interface graphique
pnpm test:e2e:ui

# Mode debug
pnpm test:e2e:debug
```

### Scan de Sécurité
```bash
# Scan complet de sécurité
pnpm security:scan

# Audit des dépendances
pnpm audit:fix
```

### Lint et Qualité du Code
```bash
# Analyser le code
pnpm lint

# Corriger automatiquement
pnpm lint:fix
```

## 🎯 Contrôle Manuel de Déploiement

Le système de contrôle manuel permet une gestion fine des déploiements avec validation à chaque étape.

### Utilisation
```bash
# Lancer le contrôleur de déploiement
pnpm deploy:control
```

### Processus Interactif

#### 1. Sélection d'Environnement
- **Development** : Local (http://localhost:3000)
- **Staging** : Test/Pré-production (https://staging.cipfaro.com)
- **Production** : Live (https://cipfaro.com) ⚠️

#### 2. Sélection de Version
- Version actuelle (depuis package.json)
- Version personnalisée (format x.y.z)
- Snapshot (commit actuel)
- Tag Git spécifique

#### 3. Vérifications Pré-déploiement
- ✅ Tests unitaires
- 🔒 Scan de sécurité
- 🔨 Build production
- 📝 Lint du code

#### 4. Confirmation
- Récapitulatif complet
- Confirmation spéciale pour la production
- Validation finale avant déploiement

### Fonctionnalités de Sécurité

#### Production
- Confirmation renforcée : tapez "CONFIRMER PRODUCTION"
- Validation double obligatoire
- Logs détaillés de déploiement

#### Tous Environnements
- Vérification Git (branche, commit, changements)
- Tests obligatoires avant déploiement
- Possibilité d'annuler à tout moment

## 🔄 GitHub Actions (CI/CD)

### Workflows Automatiques

#### Tests de Sécurité (`.github/workflows/tests-securite.yml`)
Se déclenche sur :
- Push vers `main`
- Pull Request vers `main`

Inclut :
- Tests unitaires parallèles
- Tests E2E
- Scan de sécurité
- Vérification qualité

#### Déploiement Contrôlé (`.github/workflows/deploiement-controle.yml`)
Déclenchement manuel avec paramètres :
- **Environnement** : development/staging/production
- **Version** : latest ou version spécifique
- **Tests** : Activer/désactiver
- **Sécurité** : Activer/désactiver

### Utilisation GitHub Actions

1. Aller dans l'onglet "Actions" du repository
2. Sélectionner "🚀 CIPFARO V2 - Déploiement Contrôlé"
3. Cliquer "Run workflow"
4. Configurer les paramètres
5. Lancer le workflow

### Approbation Production
Pour les déploiements production :
1. Le workflow s'arrête avant déploiement
2. Nécessite une approbation manuelle
3. Validation par un administrateur
4. Continuation automatique après approbation

## 🌍 Environnements

### Development
- **URL** : http://localhost:3000
- **Base de données** : SQLite locale
- **Logs** : Console
- **Sécurité** : Basique

### Staging
- **URL** : https://staging.cipfaro.com
- **Base de données** : PostgreSQL (staging)
- **Logs** : Fichiers + monitoring
- **Sécurité** : Standard
- **Tests E2E** : Activés

### Production
- **URL** : https://cipfaro.com
- **Base de données** : PostgreSQL (production)
- **Logs** : Centralisés + alertes
- **Sécurité** : Maximale
- **Tests E2E** : Obligatoires
- **Monitoring** : Complet

## 🔒 Sécurité

### Outils de Sécurité
- **ESLint Security Plugin** : Détection de vulnérabilités dans le code
- **Audit-CI** : Vérification des dépendances
- **Custom Scanner** : Analyse personnalisée
- **Dependency Check** : Packages obsolètes

### Vulnérabilités Couvertes
- Injection SQL
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Packages vulnérables
- Secrets hardcodés
- Configurations non sécurisées

### Rapport de Sécurité
Le scan génère un rapport JSON détaillé :
```bash
# Localisation du rapport
./security-report.json
```

### Niveaux de Sécurité
- **INFO** : Informations générales
- **WARNING** : Attention requise
- **ERROR** : Action immédiate nécessaire
- **CRITICAL** : Déploiement bloqué

## 🔧 Dépannage

### Problèmes Courants

#### Tests en Échec
```bash
# Vérifier les logs détaillés
pnpm test -- --verbose

# Tests spécifiques
pnpm test -- --testNamePattern="nom du test"
```

#### Problèmes E2E
```bash
# Réinstaller Playwright
pnpm playwright:install --force

# Vérifier les navigateurs
playwright --version
```

#### Erreurs de Build
```bash
# Nettoyer et reconstruire
pnpm clean
pnpm install
pnpm build
```

#### Problèmes de Sécurité
```bash
# Audit détaillé
pnpm audit

# Mise à jour forcée
pnpm update --latest
```

### Logs et Monitoring

#### Logs de Déploiement
- **Fichier** : `deployments.log`
- **Format** : JSON ligne par ligne
- **Contenu** : Configuration + status + timestamp

#### Logs d'Application
- **Development** : Console
- **Staging/Production** : Fichiers rotatifs

### Support et Assistance

#### Commandes Utiles
```bash
# État Git
git status
git log --oneline -10

# Informations système
node --version
pnpm --version

# Tests de connectivité
curl -I http://localhost:3000/health
```

#### Vérifications Pré-déploiement
1. ✅ Tous les tests passent
2. ✅ Aucune vulnérabilité critique
3. ✅ Build réussi
4. ✅ Base de données migrée
5. ✅ Variables d'environnement configurées

## 📞 Contacts

- **Équipe DevOps** : devops@cipfaro.com
- **Support Technique** : support@cipfaro.com
- **Urgences Production** : urgent@cipfaro.com

---

*Documentation mise à jour : ${new Date().toLocaleString('fr-FR')}*
*Version CIPFARO V2 : Tests Complets + Contrôle Manuel*