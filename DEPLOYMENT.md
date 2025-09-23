# 🚀 Guide de Déploiement Azure - CIPFARO E-Learning

Ce guide détaille le processus de déploiement de la plateforme CIPFARO E-Learning sur Azure.

## 📋 Prérequis

### Outils Requis
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Azure Developer CLI (azd)](https://docs.microsoft.com/en-us/azure/developer/azure-developer-cli/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Node.js 18+](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

### Comptes et Permissions
- Compte Azure avec permissions Contributor
- Abonnement Azure actif
- Domaine cipfaro.fr configuré (optionnel)

## 🏗️ Architecture de Déploiement

```
┌─────────────────┐    ┌─────────────────┐
│   Azure App     │    │   Azure App     │
│   Service       │    │   Service       │
│   (Frontend)    │    │   (API)         │
│   Next.js       │    │   Express.js    │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
    ┌────────────────┴────────────────┐
    │        App Service Plan         │
    │         (P1V3 Premium)          │
    └─────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ PostgreSQL  │ │   Storage   │ │  Key Vault  │
│ Flexible    │ │   Account   │ │  (Secrets)  │
│ Server      │ │  (SCORM)    │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
```

## 🚀 Étapes de Déploiement

### 1. Authentification Azure

```powershell
# Connexion à Azure
az login

# Vérifier l'abonnement actif
az account show

# Changer d'abonnement si nécessaire
az account set --subscription "votre-subscription-id"
```

### 2. Initialisation du Projet Azure

```powershell
# Dans le répertoire racine du projet
cd d:\Azure-bungalows\cipfaro-elearning

# Initialiser Azure Developer CLI
azd init

# Sélectionner "Use code in the current directory"
# Confirmer le nom du projet : cipfaro-elearning
```

### 3. Configuration de l'Environnement

```powershell
# Définir les variables d'environnement
azd env set AZURE_LOCATION francecentral
azd env set AZURE_ENV_NAME cipfaro-prod

# Optionnel: Définir un Resource Group personnalisé
azd env set AZURE_RESOURCE_GROUP rg-cipfaro-prod
```

### 4. Déploiement de l'Infrastructure

```powershell
# Provision des ressources Azure (Bicep)
azd provision

# Si c'est la première fois, choisir :
# - Location: France Central
# - Subscription: votre abonnement
# - Resource Group: rg-cipfaro-prod (ou nouveau)
```

### 5. Déploiement des Applications

```powershell
# Construction et déploiement des applications
azd deploy

# Ou tout en une fois (provision + deploy)
azd up
```

## 🔧 Configuration Post-Déploiement

### 1. Mise à Jour des Secrets

```powershell
# Connexion à Azure
az login

# Obtenir le nom du Key Vault
$keyVaultName = azd env get-values | Select-String "KEY_VAULT_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }

# Générer un mot de passe sécurisé pour PostgreSQL
$newPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 20 | ForEach-Object {[char]$_})

# Mettre à jour le mot de passe de la base de données
az keyvault secret set --vault-name $keyVaultName --name "database-url" --value "postgresql://cipfaro_admin:$newPassword@$(azd env get-values | Select-String "POSTGRESQL_SERVER_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }).postgres.database.azure.com:5432/cipfaro?sslmode=require"

# Mettre à jour le mot de passe sur le serveur PostgreSQL
az postgres flexible-server update --resource-group $(azd env get-values | Select-String "RESOURCE_GROUP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --name $(azd env get-values | Select-String "POSTGRESQL_SERVER_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --admin-password $newPassword
```

### 2. Configuration du Domaine Personnalisé

```powershell
# Obtenir l'URL de l'application web
$webAppUrl = azd env get-values | Select-String "WEB_APP_URL" | ForEach-Object { $_.ToString().Split('=')[1] }
Write-Host "Application déployée sur : $webAppUrl"

# Pour configurer cipfaro.fr :
# 1. Aller dans Azure Portal > App Services > votre-web-app > Custom domains
# 2. Ajouter cipfaro.fr
# 3. Configurer les enregistrements DNS :
#    - CNAME: www.cipfaro.fr -> votre-web-app.azurewebsites.net
#    - A: cipfaro.fr -> IP de l'App Service
```

### 3. Configuration SSL

```powershell
# Après avoir ajouté le domaine personnalisé :
# 1. Aller dans Azure Portal > App Services > votre-web-app > TLS/SSL settings
# 2. Cliquer sur "Add certificate"
# 3. Choisir "App Service Managed Certificate" (gratuit)
# 4. Sélectionner cipfaro.fr
# 5. Activer "HTTPS Only"
```

## 📊 Monitoring et Logs

### Application Insights

Les applications sont configurées avec Application Insights pour le monitoring :

```powershell
# Obtenir les métriques de performance
az monitor app-insights query --app $(azd env get-values | Select-String "APPLICATION_INSIGHTS_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --analytics-query "requests | summarize count() by bin(timestamp, 1h)"
```

### Logs des Applications

```powershell
# Logs de l'application web
az webapp log tail --name $(azd env get-values | Select-String "WEB_APP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --resource-group $(azd env get-values | Select-String "RESOURCE_GROUP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] })

# Logs de l'API
az webapp log tail --name $(azd env get-values | Select-String "API_APP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --resource-group $(azd env get-values | Select-String "RESOURCE_GROUP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] })
```

## 🔄 Mises à Jour

### Déploiement d'une Nouvelle Version

```powershell
# Depuis le répertoire du projet
git pull origin main

# Redéployer les applications
azd deploy

# Ou mise à jour complète (infra + apps)
azd up
```

### Rollback en Cas de Problème

```powershell
# Lister les déploiements
az webapp deployment list --name $(azd env get-values | Select-String "WEB_APP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --resource-group $(azd env get-values | Select-String "RESOURCE_GROUP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] })

# Rollback vers une version précédente
az webapp deployment source show --name $(azd env get-values | Select-String "WEB_APP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] }) --resource-group $(azd env get-values | Select-String "RESOURCE_GROUP_NAME" | ForEach-Object { $_.ToString().Split('=')[1] })
```

## 💰 Coûts Estimés

### Configuration de Production (P1V3)
- **App Service Plan P1V3** : ~€145/mois
- **PostgreSQL Flexible Server B2s** : ~€35/mois  
- **Storage Account Standard LRS** : ~€5/mois
- **Application Insights** : ~€10/mois
- **Key Vault** : ~€2/mois

**Total estimé : ~€200/mois**

### Configuration de Développement (B1)
- **App Service Plan B1** : ~€15/mois
- **PostgreSQL Flexible Server B1ms** : ~€12/mois
- **Autres services** : ~€17/mois

**Total estimé : ~€45/mois**

## 🆘 Dépannage

### Problèmes Courants

1. **Erreur de déploiement Docker**
   ```powershell
   # Vérifier les logs de construction
   az webapp log tail --name votre-app-name --resource-group votre-rg
   ```

2. **Problème de connexion à la base de données**
   ```powershell
   # Vérifier la chaîne de connexion
   az keyvault secret show --vault-name votre-keyvault --name database-url
   ```

3. **Erreur 500 sur l'application**
   ```powershell
   # Activer les logs détaillés
   az webapp config appsettings set --name votre-app-name --resource-group votre-rg --settings WEBSITE_HTTPLOGGING_RETENTION_DAYS=7
   ```

### Support

- Documentation Azure : https://docs.microsoft.com/azure/
- Support Azure : https://azure.microsoft.com/support/
- Issues GitHub : Créer une issue dans le repository

## 🔐 Sécurité

### Bonnes Pratiques Appliquées

- ✅ Managed Identity pour l'authentification inter-services
- ✅ Key Vault pour la gestion des secrets
- ✅ HTTPS obligatoire sur tous les endpoints
- ✅ Storage Account avec accès privé uniquement
- ✅ PostgreSQL avec chiffrement en transit
- ✅ Network Security Groups restrictifs
- ✅ Monitoring et alertes configurés

### Checklist Sécurité

- [ ] Changer le mot de passe PostgreSQL par défaut
- [ ] Configurer les alertes de sécurité
- [ ] Réviser les permissions d'accès
- [ ] Activer les audits de sécurité
- [ ] Configurer la sauvegarde automatique
- [ ] Tester la récupération d'urgence

---

*Ce guide a été généré automatiquement pour le déploiement Azure de CIPFARO E-Learning Platform.*