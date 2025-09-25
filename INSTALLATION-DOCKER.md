# Guide d'Installation Docker sur Windows

## 🔧 Installation Docker Desktop pour Windows

### Prérequis Système
- **Windows 10/11** (version 1903 ou supérieure)
- **WSL 2** activé
- **Hyper-V** activé (pour Windows Pro/Enterprise)
- **4 GB RAM** minimum (8 GB recommandés)

### Étape 1 : Activer WSL 2

Ouvrir PowerShell en tant qu'administrateur et exécuter :

```powershell
# Activer WSL
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Activer Virtual Machine Platform
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Redémarrer le système
Restart-Computer
```

Après le redémarrage :

```powershell
# Définir WSL 2 comme version par défaut
wsl --set-default-version 2

# Installer une distribution Linux (Ubuntu recommandée)
wsl --install -d Ubuntu
```

### Étape 2 : Télécharger Docker Desktop

1. Aller sur [docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop/)
2. Télécharger **Docker Desktop for Windows**
3. Exécuter l'installateur `Docker Desktop Installer.exe`

### Étape 3 : Configuration Docker Desktop

1. **Lors de l'installation**, cocher :
   - ✅ Enable WSL 2 Windows Features
   - ✅ Add shortcut to desktop

2. **Après installation** :
   - Démarrer Docker Desktop
   - Attendre que le statut devienne "Docker Desktop is running"

3. **Vérifier l'installation** :
   ```powershell
   docker --version
   docker-compose --version
   ```

### Étape 4 : Configuration pour le Projet

```powershell
# Cloner et naviguer vers le projet
cd D:\cipfaro-elearning

# Vérifier la configuration Docker Compose
docker-compose -f docker-compose.production.yml config

# Tester le déploiement
.\scripts\deploy-production.ps1
```

## 🚀 Alternative : Déploiement sans Docker

Si vous ne pouvez pas installer Docker immédiatement, voici une solution de déploiement manuel :

### Installation Node.js et dépendances
```powershell
# Vérifier Node.js
node --version
npm --version

# Si Node.js n'est pas installé, télécharger depuis nodejs.org

# Installer pnpm
npm install -g pnpm

# Installer les dépendances
pnpm install
```

### Démarrage des services manuellement
```powershell
# Démarrer la base de données (PostgreSQL local requis)
# Démarrer Redis (Redis local requis)

# Démarrer l'API
pnpm --filter api dev

# Dans un autre terminal, démarrer le frontend
pnpm --filter web dev
```

## 🔍 Dépannage Docker

### Problème : "Docker daemon not running"
```powershell
# Redémarrer Docker Desktop
Get-Process "*docker*" | Stop-Process -Force
Start-Process "Docker Desktop"
```

### Problème : "WSL 2 not installed"
```powershell
# Télécharger et installer le kernel WSL 2
# https://docs.microsoft.com/en-us/windows/wsl/install-win10#step-4---download-the-linux-kernel-update-package
```

### Problème : "Hyper-V required"
```powershell
# Pour Windows Home, utiliser WSL 2 backend
# Pour Windows Pro/Enterprise, activer Hyper-V :
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

## 📞 Support

En cas de problème :
1. Vérifier les logs Docker Desktop
2. Redémarrer Docker Desktop
3. Redémarrer Windows si nécessaire
4. Consulter la documentation officielle Docker

## ✅ Validation de l'Installation

Après installation, tester :

```powershell
# Test basique Docker
docker run hello-world

# Test Docker Compose
docker-compose --version

# Test avec le projet
cd D:\cipfaro-elearning
docker-compose -f docker-compose.production.yml config
```

Si tous ces tests passent, Docker est correctement installé et vous pouvez procéder au déploiement de production ! 🎉