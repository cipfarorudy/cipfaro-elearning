targetScope = 'resourceGroup'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
param location string = resourceGroup().location

@description('Id of the user or app to assign application roles')
param principalId string = ''

// Generate unique resource token
var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)

// Resource naming conventions (az{prefix}{token} - max 32 chars)
var abbrs = {
  webSitesAppService: 'app'
  managedIdentityUserAssignedIdentities: 'id'
  storageStorageAccounts: 'st'
  dBforPostgreSQLFlexibleServers: 'psql'
  keyVaultVaults: 'kv'
  insightsComponents: 'ai'
  operationalInsightsWorkspaces: 'log'
}

// Tags
var tags = {
  'azd-env-name': environmentName
}

var serviceTags = {
  'azd-service-name': 'web'
}

var apiTags = {
  'azd-service-name': 'api'
}

// User Managed Identity (Required by AZD rules)
resource managedIdentity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: 'az${abbrs.managedIdentityUserAssignedIdentities}${resourceToken}'
  location: location
  tags: tags
}

// Log Analytics Workspace
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: 'az${abbrs.operationalInsightsWorkspaces}${resourceToken}'
  location: location
  tags: tags
  properties: {
    retentionInDays: 30
    sku: {
      name: 'PerGB2018'
    }
  }
}

// Application Insights
resource applicationInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: 'az${abbrs.insightsComponents}${resourceToken}'
  location: location
  tags: tags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalyticsWorkspace.id
  }
}

// Key Vault for secrets
resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: 'az${abbrs.keyVaultVaults}${resourceToken}'
  location: location
  tags: tags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
  }
}

// Storage Account for SCORM packages
resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'az${abbrs.storageStorageAccounts}${resourceToken}'
  location: location
  tags: tags
  kind: 'StorageV2'
  sku: {
    name: 'Standard_LRS'
  }
  properties: {
    allowBlobPublicAccess: false  // Disable public access as per rules
    allowSharedKeyAccess: false   // Disable key access as per rules
    supportsHttpsTrafficOnly: true
    minimumTlsVersion: 'TLS1_2'
  }
}

// Blob container for SCORM packages
resource scormContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  name: '${storageAccount.name}/default/scorm-packages'
  properties: {
    publicAccess: 'None'
  }
}

// PostgreSQL Flexible Server
resource postgreSqlServer 'Microsoft.DBforPostgreSQL/flexibleServers@2023-03-01-preview' = {
  name: 'az${abbrs.dBforPostgreSQLFlexibleServers}${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'Standard_B2s'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: 'cipfaro_admin'
    administratorLoginPassword: 'TempPassword123!' // Will be changed via Key Vault
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    version: '15'
    authConfig: {
      activeDirectoryAuth: 'Enabled'
      passwordAuth: 'Enabled'
    }
  }
}

// PostgreSQL database
resource postgreSqlDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2023-03-01-preview' = {
  name: 'cipfaro'
  parent: postgreSqlServer
  properties: {
    charset: 'UTF8'
    collation: 'en_US.UTF8'
  }
}

// App Service Plan for both web and api
resource appServicePlan 'Microsoft.Web/serverfarms@2023-01-01' = {
  name: 'asp-${environmentName}-${resourceToken}'
  location: location
  tags: tags
  sku: {
    name: 'P1V3'
    tier: 'Premium'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// Frontend Web App (Next.js)
resource webApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'az${abbrs.webSitesAppService}web${resourceToken}'
  location: location
  tags: union(tags, serviceTags)
  kind: 'app,linux,container'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: 'DOCKER|nginx:alpine'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'NEXT_PUBLIC_API_BASE_URL'
          value: 'https://${apiApp.properties.defaultHostName}'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
      ]
    }
  }
}

// Site Extension for Web App (Required by rules)
resource webAppSiteExtension 'Microsoft.Web/sites/siteextensions@2023-01-01' = {
  name: 'Microsoft.ApplicationInsights.AzureWebSites'
  parent: webApp
}

// API Web App (Express.js)
resource apiApp 'Microsoft.Web/sites@2023-01-01' = {
  name: 'az${abbrs.webSitesAppService}api${resourceToken}'
  location: location
  tags: union(tags, apiTags)
  kind: 'app,linux,container'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${managedIdentity.id}': {}
    }
  }
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: true
      linuxFxVersion: 'DOCKER|node:18-alpine'
      appSettings: [
        {
          name: 'WEBSITES_ENABLE_APP_SERVICE_STORAGE'
          value: 'false'
        }
        {
          name: 'DATABASE_URL'
          value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=database-url)'
        }
        {
          name: 'JWT_SECRET'
          value: '@Microsoft.KeyVault(VaultName=${keyVault.name};SecretName=jwt-secret)'
        }
        {
          name: 'S3_ENDPOINT'
          value: 'https://${storageAccount.name}.blob.core.windows.net'
        }
        {
          name: 'S3_BUCKET'
          value: 'scorm-packages'
        }
        {
          name: 'CORS_ORIGIN'
          value: 'https://${webApp.properties.defaultHostName}'
        }
        {
          name: 'NODE_ENV'
          value: 'production'
        }
        {
          name: 'PORT'
          value: '80'
        }
        {
          name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
          value: applicationInsights.properties.ConnectionString
        }
      ]
    }
  }
}

// Site Extension for API App (Required by rules)
resource apiAppSiteExtension 'Microsoft.Web/sites/siteextensions@2023-01-01' = {
  name: 'Microsoft.ApplicationInsights.AzureWebSites'
  parent: apiApp
}

// Role assignments for Managed Identity

// Key Vault Secrets User role
resource keyVaultSecretsUserRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: keyVault
  name: guid(keyVault.id, managedIdentity.id, '4633458b-17de-408a-b874-0445c86b69e6')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '4633458b-17de-408a-b874-0445c86b69e6')
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Storage Blob Data Contributor role
resource storageBlobDataContributorRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: storageAccount
  name: guid(storageAccount.id, managedIdentity.id, 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
    principalId: managedIdentity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// Store secrets in Key Vault
resource databaseUrlSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'database-url'
  parent: keyVault
  properties: {
    value: 'postgresql://cipfaro_admin:TempPassword123!@${postgreSqlServer.properties.fullyQualifiedDomainName}:5432/cipfaro?sslmode=require'
  }
}

resource jwtSecret 'Microsoft.KeyVault/vaults/secrets@2023-07-01' = {
  name: 'jwt-secret'
  parent: keyVault
  properties: {
    value: base64(guid(subscription().id, resourceGroup().id, environmentName))
  }
}

// Outputs (Required by AZD rules)
output RESOURCE_GROUP_ID string = resourceGroup().id
output WEB_APP_NAME string = webApp.name
output API_APP_NAME string = apiApp.name
output WEB_APP_URL string = 'https://${webApp.properties.defaultHostName}'
output API_APP_URL string = 'https://${apiApp.properties.defaultHostName}'
output POSTGRESQL_SERVER_NAME string = postgreSqlServer.name
output STORAGE_ACCOUNT_NAME string = storageAccount.name
output KEY_VAULT_NAME string = keyVault.name
output MANAGED_IDENTITY_ID string = managedIdentity.id
output APPLICATION_INSIGHTS_CONNECTION_STRING string = applicationInsights.properties.ConnectionString
