# 📅 JOUR 1 - Guide Complet d'Implémentation

> **Objectif**: À la fin du Jour 1, tu auras un environnement Power Platform fonctionnel avec un premier dashboard et des alertes automatiques.

## ⏱️ Durée Estimée: 4-6 heures

## 🎯 Résultat Attendu

✅ Environnement Power Platform configuré  
✅ Tables Dataverse créées avec données de test  
✅ Dashboard Power BI publié (valeur & allocation)  
✅ 2 alertes automatiques actives  
✅ Canal Teams configuré pour notifications

---

## 📋 ÉTAPE A - Choix de la Niche (30-60 min)

### 🤔 Décision Stratégique

**Choisis UNE seule niche pour démarrer rapidement** (tu pourras élargir plus tard):

#### Option A: 🏠 Particuliers (Actions + Crypto)
**Avantages**:
- Données publiques gratuites (Yahoo Finance, CoinGecko)
- Marché large
- Besoins simples à adresser

**Inconvénients**:
- Ticket moyen plus faible (200-400€/mois)
- Volume clients nécessaire

**Données requises**:
- Tickers actions (AAPL, MSFT, GOOGL...)
- Prix crypto (BTC, ETH, SOL...)
- APIs gratuites disponibles

#### Option B: 🏢 PME/Associations (Trésorerie)
**Avantages**:
- Besoins urgents et clairs
- Budget disponible (formation, outils)
- Accès direct via réseaux locaux

**Inconvénients**:
- Données moins standardisées
- Besoin accompagnement

**Données requises**:
- Comptes bancaires
- Placements (livrets, OPCVM)
- Factures/créances

#### Option C: 💼 Conseillers/Gestionnaires Locaux
**Avantages**:
- Ticket élevé (1-3k€/mois)
- Multi-clients (effet levier)
- Prescripteurs potentiels

**Inconvénients**:
- Vente plus complexe
- Exigences plus élevées

**Données requises**:
- Multi-portefeuilles
- Multi-actifs (actions, obligations, fonds)
- Reporting réglementaire

### ✍️ DÉCISION

**Ma niche choisie**: __________________ (A, B ou C)

**Raison du choix**: ___________________________________

**Premier prospect identifié**: _______________________

---

## 📋 ÉTAPE B - Préparer l'Environnement Microsoft 365 (30 min)

### 1️⃣ Vérifier les Licences

**Licences nécessaires**:
- Microsoft 365 Business Premium OU E3/E5
- Power BI Pro (inclus dans M365 ou séparé)
- Power Apps per app OU per user
- Power Automate premium (pour certains connecteurs)

**Actions**:
```
□ Connexion au Centre d'administration M365: https://admin.microsoft.com
□ Vérifier "Licences" → "Vos produits"
□ Si manquant: Activer essai gratuit 30 jours:
  - Power Apps: https://powerapps.microsoft.com/trial
  - Power BI: https://powerbi.microsoft.com/trial
  - Power Automate: https://flow.microsoft.com/trial
```

### 2️⃣ Créer un Environnement Power Platform

**Pourquoi**: Isoler ce projet dans son propre espace

**Actions**:
```
□ Aller sur: https://admin.powerplatform.microsoft.com
□ "Environnements" → "+ Nouveau"
□ Nom: "Mini-Aladdin-Production" (ou "Dev" pour tests)
□ Type: Production
□ Région: Europe (pour performance)
□ Créer une base de données: OUI
□ Langue: Français
□ Devise: EUR
□ Activer Dynamics 365 apps: NON (sauf besoin)
□ Créer
```

**⏱️ Temps de création**: ~5-10 minutes

### 3️⃣ Configurer Teams

**Actions**:
```
□ Ouvrir Microsoft Teams
□ Créer une équipe: "Mini-Aladdin"
□ Type: Privée
□ Ajouter canal: "Alertes"
□ Ajouter canal: "Rapports"
□ Ajouter canal: "Support"
□ Noter l'ID de l'équipe (sera utilisé dans Power Automate)
```

**🔍 Trouver l'ID de l'équipe**:
- Teams → Équipe "Mini-Aladdin" → ⋯ → "Obtenir le lien vers l'équipe"
- L'ID est dans l'URL: `groupId=XXXXX-XXXX-XXXX`

---

## 📋 ÉTAPE C - Structure de Données Dataverse (45 min)

### 🗂️ Tables à Créer

#### Table 1: **Portefeuilles**

**Navigation**: Power Apps → Tables → + Nouvelle table

**Configuration**:
```
Nom d'affichage: Portefeuille
Nom pluriel: Portefeuilles
Nom de schéma: cip_portfolio
Activer pièces jointes: Non
```

**Colonnes à ajouter**:

| Nom d'affichage | Nom technique | Type | Obligatoire | Description |
|-----------------|---------------|------|-------------|-------------|
| Nom | cip_name | Texte (100) | ✅ | Nom du portefeuille |
| Propriétaire Email | cip_owner_email | Email | ✅ | Contact principal |
| Devise de Base | cip_base_currency | Choix | ✅ | EUR, USD, GBP |
| Valeur Objectif | cip_target_value | Nombre décimal | ❌ | Objectif de valeur |
| Type | cip_type | Choix | ✅ | Conservateur, Équilibré, Dynamique |
| Date de Création | createdon | Date/Heure | ✅ | Auto |
| Statut | statecode | Choix | ✅ | Actif, Inactif |

**Valeurs de choix**:
- **Devise**: EUR, USD, GBP, CHF
- **Type**: Conservateur, Équilibré, Dynamique, Agressif

#### Table 2: **Positions**

**Configuration**:
```
Nom d'affichage: Position
Nom pluriel: Positions
Nom de schéma: cip_position
```

**Colonnes**:

| Nom d'affichage | Nom technique | Type | Obligatoire | Description |
|-----------------|---------------|------|-------------|-------------|
| Portefeuille | cip_portfolio | Recherche (Portefeuille) | ✅ | Lien vers portefeuille |
| Ticker/Symbol | cip_ticker | Texte (20) | ✅ | AAPL, BTC-USD |
| Nom de l'Actif | cip_asset_name | Texte (200) | ❌ | Apple Inc. |
| Quantité | cip_quantity | Nombre décimal | ✅ | Nombre d'unités |
| Prix d'Achat | cip_purchase_price | Devise | ✅ | Prix unitaire |
| Date d'Achat | cip_purchase_date | Date | ✅ | Date de l'achat |
| Classe d'Actif | cip_asset_class | Choix | ✅ | Type d'actif |
| Secteur | cip_sector | Texte (100) | ❌ | Technologie, Finance... |

**Valeurs de choix Classe d'Actif**:
- Actions
- Obligations
- Crypto-monnaies
- Fonds (OPCVM)
- Matières premières
- Cash/Liquidités
- Immobilier
- Autres

#### Table 3: **Prix_Jour**

**Configuration**:
```
Nom d'affichage: Prix Journalier
Nom pluriel: Prix Journaliers
Nom de schéma: cip_daily_price
```

**Colonnes**:

| Nom d'affichage | Nom technique | Type | Obligatoire | Description |
|-----------------|---------------|------|-------------|-------------|
| Ticker | cip_ticker | Texte (20) | ✅ | Identifiant actif |
| Date | cip_date | Date | ✅ | Date du prix |
| Prix de Clôture | cip_close_price | Devise | ✅ | Prix de fin de journée |
| Prix d'Ouverture | cip_open_price | Devise | ❌ | Prix d'ouverture |
| Plus Haut | cip_high_price | Devise | ❌ | Plus haut du jour |
| Plus Bas | cip_low_price | Devise | ❌ | Plus bas du jour |
| Volume | cip_volume | Nombre entier | ❌ | Volume échangé |
| Source | cip_data_source | Texte (50) | ❌ | API utilisée |

**Index**: Créer un index sur (cip_ticker, cip_date) pour performance

#### Table 4: **Seuils_Alerte**

**Configuration**:
```
Nom d'affichage: Seuil d'Alerte
Nom pluriel: Seuils d'Alerte
Nom de schéma: cip_alert_threshold
```

**Colonnes**:

| Nom d'affichage | Nom technique | Type | Obligatoire | Description |
|-----------------|---------------|------|-------------|-------------|
| Nom de la Règle | cip_rule_name | Texte (200) | ✅ | Nom descriptif |
| Portefeuille | cip_portfolio | Recherche (Portefeuille) | ✅ | Portefeuille concerné |
| Type d'Alerte | cip_alert_type | Choix | ✅ | Type de déclencheur |
| Ticker | cip_ticker | Texte (20) | ❌ | Si alerte sur actif spécifique |
| Classe d'Actif | cip_asset_class | Choix | ❌ | Si alerte sur classe |
| Valeur Seuil | cip_threshold_value | Nombre décimal | ✅ | Valeur de déclenchement (%) |
| Direction | cip_direction | Choix | ✅ | Au-dessus, En-dessous |
| Actif | cip_is_active | Oui/Non | ✅ | Alerte activée |
| Email de Notification | cip_notification_email | Email | ✅ | Destinataire |

**Valeurs de choix Type d'Alerte**:
- Concentration Position
- Drawdown Portefeuille
- Volatilité Excessive
- Changement Allocation
- Prix Franchit Niveau

**Valeurs de choix Direction**:
- Au-dessus du seuil
- En-dessous du seuil

### ✅ Validation

Une fois les tables créées:
```
□ Vérifier que les 4 tables apparaissent dans "Tables"
□ Tester la création d'un enregistrement dans chaque table
□ Vérifier que les relations sont bien créées (Position → Portefeuille)
```

---

## 📋 ÉTAPE D - Importer les Premières Données (30 min)

### 1️⃣ Créer les Fichiers CSV de Test

#### Fichier 1: `portefeuilles.csv`

```csv
Nom,Propriétaire Email,Devise de Base,Valeur Objectif,Type
Portefeuille Croissance,admin@votredomaine.com,EUR,100000,Dynamique
Portefeuille Retraite,user@votredomaine.com,EUR,50000,Conservateur
```

#### Fichier 2: `positions.csv`

```csv
Portefeuille,Ticker,Nom de l'Actif,Quantité,Prix d'Achat,Date d'Achat,Classe d'Actif,Secteur
Portefeuille Croissance,AAPL,Apple Inc.,50,150.00,2024-01-15,Actions,Technologie
Portefeuille Croissance,MSFT,Microsoft Corp.,30,380.00,2024-01-15,Actions,Technologie
Portefeuille Croissance,BTC-USD,Bitcoin,0.5,45000.00,2024-02-01,Crypto-monnaies,Crypto
Portefeuille Retraite,BND,Vanguard Bond ETF,100,75.00,2024-01-10,Obligations,Obligations
Portefeuille Retraite,AAPL,Apple Inc.,20,145.00,2024-01-20,Actions,Technologie
```

#### Fichier 3: `prix_jour.csv`

```csv
Ticker,Date,Prix de Clôture,Prix d'Ouverture,Plus Haut,Plus Bas,Volume,Source
AAPL,2024-01-15,150.00,148.50,151.20,148.00,85000000,Manual
AAPL,2024-01-16,152.30,150.50,153.00,150.00,92000000,Manual
MSFT,2024-01-15,380.00,378.00,382.50,377.50,45000000,Manual
MSFT,2024-01-16,385.20,381.00,386.00,380.50,48000000,Manual
BTC-USD,2024-02-01,45000.00,44500.00,45500.00,44200.00,0,Manual
BTC-USD,2024-02-02,46200.00,45100.00,46800.00,44900.00,0,Manual
BND,2024-01-10,75.00,74.80,75.20,74.70,5000000,Manual
BND,2024-01-11,74.85,75.00,75.10,74.60,4800000,Manual
```

#### Fichier 4: `seuils_alerte.csv`

```csv
Nom de la Règle,Portefeuille,Type d'Alerte,Ticker,Classe d'Actif,Valeur Seuil,Direction,Actif,Email de Notification
Concentration AAPL,Portefeuille Croissance,Concentration Position,AAPL,,30,Au-dessus du seuil,Oui,admin@votredomaine.com
Drawdown Global,Portefeuille Croissance,Drawdown Portefeuille,,,10,Au-dessus du seuil,Oui,admin@votredomaine.com
```

### 2️⃣ Importer dans Dataverse

**Méthode 1: Interface Power Apps**

```
□ Power Apps → Tables → "Portefeuilles"
□ "Importer" → "Importer des données"
□ Sélectionner portefeuilles.csv
□ Mapper les colonnes automatiquement
□ Importer
□ Répéter pour positions.csv, prix_jour.csv, seuils_alerte.csv
```

**Méthode 2: Power Automate (recommandé pour automation)**

Créer un flow "Import CSV" (voir ÉTAPE E ci-dessous pour détails)

### ✅ Validation

```
□ Vérifier que les données apparaissent dans chaque table
□ Compter les enregistrements:
  - Portefeuilles: 2
  - Positions: 5
  - Prix_Jour: 8
  - Seuils_Alerte: 2
```

---

## 📋 ÉTAPE E - Premier Dashboard Power BI (60-90 min)

### 1️⃣ Connexion à Dataverse

**Actions**:
```
□ Ouvrir Power BI Desktop (télécharger si nécessaire)
□ "Obtenir des données" → "Dataverse"
□ URL de l'environnement: https://[votre-env].crm.dynamics.com
□ Se connecter avec compte M365
□ Sélectionner les 4 tables créées
□ Charger les données
```

### 2️⃣ Modèle de Données

**Relations à créer**:
```
Positions.cip_portfolio → Portefeuilles.cip_portfolioid
Positions.cip_ticker → Prix_Jour.cip_ticker
Seuils_Alerte.cip_portfolio → Portefeuilles.cip_portfolioid
```

**Mesures DAX à créer**:

#### Mesure 1: Valeur Actuelle Position
```dax
Valeur Position = 
VAR DernierPrix = 
    CALCULATE(
        MAX('Prix_Jour'[cip_close_price]),
        FILTER(
            'Prix_Jour',
            'Prix_Jour'[cip_ticker] = EARLIER('Positions'[cip_ticker])
        )
    )
RETURN
    'Positions'[cip_quantity] * DernierPrix
```

#### Mesure 2: Valeur Totale Portefeuille
```dax
Valeur Totale = 
SUMX(
    'Positions',
    [Valeur Position]
)
```

#### Mesure 3: P&L Total
```dax
PnL Total = 
SUMX(
    'Positions',
    [Valeur Position] - ('Positions'[cip_quantity] * 'Positions'[cip_purchase_price])
)
```

#### Mesure 4: P&L %
```dax
PnL % = 
DIVIDE(
    [PnL Total],
    SUMX('Positions', 'Positions'[cip_quantity] * 'Positions'[cip_purchase_price]),
    0
) * 100
```

### 3️⃣ Créer les Visuels

**Page 1: Vue d'Ensemble**

#### Visual 1: Carte - Valeur Totale
```
Type: Carte
Champ: [Valeur Totale]
Format: Devise (€)
Taille police: Grande
```

#### Visual 2: Carte - P&L
```
Type: Carte
Champ: [PnL Total]
Format: Devise (€)
Mise en forme conditionnelle: Vert si > 0, Rouge si < 0
```

#### Visual 3: Carte - P&L %
```
Type: Carte
Champ: [PnL %]
Format: Pourcentage
Mise en forme conditionnelle: Vert si > 0, Rouge si < 0
```

#### Visual 4: Graphique en Secteurs - Allocation par Classe
```
Type: Graphique en secteurs
Légende: Positions[cip_asset_class]
Valeurs: [Valeur Position]
Étiquettes de données: Pourcentage + Valeur
Couleurs: Personnalisées par classe
```

#### Visual 5: Graphique en Barres - Top 5 Positions
```
Type: Graphique en barres horizontales
Axe Y: Positions[cip_ticker]
Axe X: [Valeur Position]
Tri: Décroissant
Limite: Top 5
```

#### Visual 6: Graphique en Courbes - Évolution Valeur
```
Type: Graphique en courbes
Axe X: Prix_Jour[cip_date]
Axe Y: [Valeur Totale]
Filtre: 30 derniers jours
```

**Page 2: Détail Positions**

#### Visual 7: Table Détaillée
```
Type: Table
Colonnes:
  - Positions[cip_ticker]
  - Positions[cip_asset_name]
  - Positions[cip_quantity]
  - Positions[cip_purchase_price]
  - [Valeur Position]
  - [PnL Total]
  - [PnL %]
Format: Mise en forme conditionnelle sur P&L %
```

### 4️⃣ Publier le Rapport

**Actions**:
```
□ Power BI Desktop → "Publier"
□ Destination: "Mon espace de travail" (ou créer "Mini-Aladdin")
□ Attendre la publication
□ "Ouvrir dans Power BI"
□ Navigateur web s'ouvre avec le rapport
```

### 5️⃣ Intégrer dans Teams

**Actions**:
```
□ Teams → Équipe "Mini-Aladdin"
□ Ajouter un onglet → "Power BI"
□ Sélectionner le rapport publié
□ Enregistrer
```

### ✅ Validation

```
□ Dashboard visible dans Teams
□ Toutes les cartes affichent des valeurs
□ Allocation par classe = 100%
□ Graphique évolution montre tendance
□ Table positions affiche toutes les lignes
```

---

## 📋 ÉTAPE F - Alertes Automatiques (45-60 min)

### 🚨 Alerte 1: Concentration de Position

**Objectif**: Avertir si une position dépasse X% du portefeuille

**Configuration Power Automate**:

```
Nom du Flow: "Alerte Concentration Position"
Type: Récurrence planifiée
```

**Étapes**:

1. **Déclencheur**:
   ```
   Type: Récurrence
   Intervalle: 1 jour
   Heure: 09:00 (après mise à jour prix)
   ```

2. **Action 1**: Lister les portefeuilles actifs
   ```
   Action: Dataverse - Lister les lignes
   Table: Portefeuilles
   Filtre: statecode eq 0 (Actif)
   ```

3. **Action 2**: Pour chaque portefeuille
   ```
   Action: Appliquer à chaque
   Sortie de: Lister les portefeuilles
   ```

4. **Action 3**: Obtenir les positions du portefeuille
   ```
   Action: Dataverse - Lister les lignes
   Table: Positions
   Filtre: _cip_portfolio_value eq [ID Portefeuille]
   ```

5. **Action 4**: Obtenir les prix actuels
   ```
   Action: Dataverse - Lister les lignes
   Table: Prix_Jour
   Filtre: cip_date eq [Date du jour]
   ```

6. **Action 5**: Calculer valeur totale et % par position
   ```
   Action: Composer (JSON)
   Expression: 
   {
     "totalValue": [Somme des (Quantité * Prix)],
     "positions": [
       {
         "ticker": "[Ticker]",
         "value": [Quantité * Prix],
         "percentage": ([Quantité * Prix] / totalValue) * 100
       }
     ]
   }
   ```

7. **Action 6**: Condition - Position > Seuil
   ```
   Action: Condition
   Si: percentage > 30 (ou valeur du seuil)
   ```

8. **Action 7a**: Envoyer notification Teams
   ```
   Action: Teams - Publier message
   Canal: Alertes
   Message: 
   "🚨 ALERTE CONCENTRATION
   
   Portefeuille: [Nom]
   Position: [Ticker] ([Nom])
   Pourcentage: [%]
   Seuil: 30%
   
   Valeur position: [Valeur] €
   Valeur totale: [Total] €
   
   Action recommandée: Examiner diversification"
   ```

9. **Action 7b**: Envoyer email
   ```
   Action: Office 365 - Envoyer un email
   À: [Email du propriétaire]
   Objet: "⚠️ Alerte Concentration - [Portefeuille]"
   Corps: [Même message que Teams]
   Importance: Haute
   ```

### 🚨 Alerte 2: Drawdown Portefeuille

**Objectif**: Avertir si le portefeuille a perdu X% depuis le plus haut

**Configuration Power Automate**:

```
Nom du Flow: "Alerte Drawdown Portefeuille"
Type: Récurrence planifiée
```

**Étapes**:

1. **Déclencheur**:
   ```
   Type: Récurrence
   Intervalle: 1 jour
   Heure: 18:00 (fin de journée)
   ```

2. **Action 1**: Lister les portefeuilles
   ```
   [Même que Alerte 1]
   ```

3. **Action 2**: Pour chaque portefeuille
   ```
   [Même que Alerte 1]
   ```

4. **Action 3**: Obtenir historique valeurs (7 derniers jours)
   ```
   Action: Dataverse - Lister les lignes
   Table: Prix_Jour
   Filtre: cip_date ge [Date - 7 jours]
   Tri: Date décroissant
   ```

5. **Action 4**: Calculer valeurs journalières
   ```
   Action: Appliquer à chaque jour
   Pour chaque: Prix historiques
   Calculer: Valeur portefeuille du jour
   ```

6. **Action 5**: Identifier pic et creux
   ```
   Action: Composer
   Variables:
   - maxValue: MAX(valeurs historiques)
   - currentValue: Valeur du jour
   - drawdown: ((maxValue - currentValue) / maxValue) * 100
   ```

7. **Action 6**: Condition - Drawdown > Seuil
   ```
   Action: Condition
   Si: drawdown > 10 (ou valeur du seuil)
   ```

8. **Action 7**: Notification
   ```
   Action: Teams - Publier message
   Canal: Alertes
   Message:
   "📉 ALERTE DRAWDOWN
   
   Portefeuille: [Nom]
   Drawdown: -[%] depuis le pic
   
   Valeur pic (7j): [Max] €
   Valeur actuelle: [Actuel] €
   Perte: [Différence] €
   
   Date du pic: [Date]
   
   Action recommandée: Examiner stratégie de protection"
   
   Boutons:
   - Voir Dashboard
   - Analyser Positions
   - Ignorer
   ```

### 📧 Template Email HTML (optionnel, pour plus pro)

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .alert-box { 
            background: #fff3cd; 
            border-left: 4px solid #ffc107;
            padding: 20px;
            margin: 20px 0;
        }
        .metric { 
            font-size: 24px; 
            font-weight: bold;
            color: #dc3545;
        }
        .button {
            background: #007bff;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="alert-box">
        <h2>🚨 Alerte Mini-Aladdin</h2>
        <p><strong>Type:</strong> [Type d'alerte]</p>
        <p><strong>Portefeuille:</strong> [Nom]</p>
        <p class="metric">[Métrique principale]</p>
        <p>[Message détaillé]</p>
        <a href="[Lien dashboard]" class="button">Voir le Dashboard</a>
    </div>
</body>
</html>
```

### ✅ Validation

**Tests à effectuer**:

```
□ Flow "Alerte Concentration":
  - Déclencher manuellement
  - Vérifier message Teams reçu
  - Vérifier email reçu
  - Valider calculs de pourcentage

□ Flow "Alerte Drawdown":
  - Déclencher manuellement
  - Vérifier calcul drawdown
  - Vérifier notification
  - Tester avec différentes valeurs

□ Historique des exécutions:
  - Vérifier aucune erreur
  - Vérifier temps d'exécution < 30s
```

---

## ✅ CHECKLIST FINALE JOUR 1

### Environnement
- [ ] Licence M365 ou essais activés
- [ ] Environnement Power Platform créé
- [ ] Dataverse activé et accessible
- [ ] Équipe Teams créée avec canaux

### Données
- [ ] 4 tables Dataverse créées
- [ ] Colonnes et relations configurées
- [ ] Données de test importées
- [ ] Validation des enregistrements

### Dashboard
- [ ] Power BI Desktop installé
- [ ] Connexion à Dataverse établie
- [ ] Modèle de données configuré
- [ ] 6+ visuels créés
- [ ] Rapport publié sur service Power BI
- [ ] Intégration Teams réussie

### Alertes
- [ ] Flow "Concentration Position" créé et testé
- [ ] Flow "Drawdown Portefeuille" créé et testé
- [ ] Notifications Teams fonctionnelles
- [ ] Emails reçus correctement

### Documentation
- [ ] Captures d'écran du dashboard sauvegardées
- [ ] Notes sur choix techniques pris
- [ ] Questions/blocages documentés pour support

---

## 🐛 Troubleshooting

### Problème 1: "Impossible de se connecter à Dataverse"

**Causes possibles**:
- Licence insuffisante
- Environnement pas complètement créé
- Problème de permissions

**Solutions**:
```
1. Vérifier que l'environnement est "Prêt" (pas "En préparation")
2. Vérifier rôle "Administrateur système" sur l'environnement
3. Essayer avec URL complète: https://[org].crm.dynamics.com
4. Vérifier pare-feu/proxy d'entreprise
```

### Problème 2: "Mesures DAX retournent erreur"

**Causes possibles**:
- Relations incorrectes
- Noms de colonnes erronés
- Données manquantes

**Solutions**:
```
1. Vérifier modèle de données dans Power BI
2. Tester mesure sur une seule table d'abord
3. Utiliser DAX Studio pour debugging
4. Vérifier qu'il y a des prix pour chaque ticker
```

### Problème 3: "Flow Power Automate échoue"

**Causes possibles**:
- Timeout (> 5 min)
- Permissions Dataverse
- Trop de données

**Solutions**:
```
1. Vérifier historique d'exécution pour erreur exacte
2. Ajouter délais entre actions (attendre 1s)
3. Limiter nombre d'enregistrements retournés (Top 100)
4. Diviser flow complexe en plusieurs flows
```

### Problème 4: "Pas de notifications Teams"

**Causes possibles**:
- ID d'équipe incorrect
- Permissions du connecteur
- Canal archivé

**Solutions**:
```
1. Re-vérifier ID de l'équipe
2. Tester avec "Publier dans un canal" au lieu de "Poster message"
3. Vérifier que le compte du flow a accès à l'équipe
4. Essayer notification utilisateur direct d'abord
```

---

## 🎯 Résultat Final Jour 1

À ce stade, tu dois avoir:

### ✨ Fonctionnel
1. **Dashboard Power BI** accessible dans Teams montrant:
   - Valeur totale du portefeuille
   - P&L et P&L %
   - Allocation par classe d'actifs
   - Top positions
   - Évolution sur 30 jours

2. **2 Alertes automatiques** configurées et testées:
   - Concentration de position (> 30%)
   - Drawdown portefeuille (> 10%)

3. **Base de données** Dataverse avec structure propre et données de test

### 📸 Livrables
- Captures d'écran du dashboard
- Exemple de notifications Teams reçues
- Export CSV des données de test
- Documentation des choix (niche, seuils, etc.)

---

## 🚀 Prochaine Étape: JOUR 2

**Focus**: Affiner les métriques de risque

Preview:
- Calcul de la volatilité (écart-type sur 30j)
- VaR simple (Value at Risk à 95%)
- Matrice de corrélation entre actifs
- Scénarios de stress test basiques
- Dashboard "Risques" dédié

**Prérequis**: Avoir complété Jour 1 avec succès

---

## 📞 Besoin d'Aide?

**Si bloqué**:
1. Consulter [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Vérifier forums Microsoft Power Platform Community
3. Consulter documentation officielle Microsoft Learn

**Contact Support**:
- Email: support@mini-aladdin.com
- Teams: Canal "Support"

---

**Version**: 1.0  
**Date**: Janvier 2026  
**Durée estimée Jour 1**: 4-6 heures  
**Statut**: ✅ Prêt pour implémentation
