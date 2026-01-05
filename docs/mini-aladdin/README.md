# 🚀 Mini-Aladdin M365 - Documentation Complète

> Plateforme de gestion de portefeuille et d'analyse de risque inspirée d'Aladdin (BlackRock), construite sur Microsoft Power Platform.

## 📚 Table des Matières

### 📖 Documentation Principale

1. **[Vision & Stratégie](./MINI-ALADDIN-VISION.md)**
   - Vue d'ensemble du projet
   - Comparaison avec Aladdin (BlackRock)
   - Les 4 briques essentielles du MVP
   - Stack technique
   - Positionnement pédagogique

2. **[Guide Jour 1 - Implémentation Complète](./JOUR-1-GUIDE-COMPLET.md)**
   - Checklist détaillée étape par étape
   - Configuration environnement Microsoft 365
   - Structure de données Dataverse
   - Dashboard Power BI
   - Alertes automatiques
   - Troubleshooting

3. **[Modèle Business](./MODELE-BUSINESS.md)**
   - Proposition de valeur
   - Stratégie de prix (3 niveaux)
   - Projections de revenus
   - Stratégie d'acquisition client
   - Métriques SaaS clés

4. **[Roadmap 5 Jours](./ROADMAP-5-JOURS.md)**
   - Planning détaillé Jour 1 à 5
   - Objectifs et livrables quotidiens
   - Semaine 2-3 (Go-to-Market)
   - Métriques de succès

### 📁 Templates & Données

- **[templates/](./templates/)**
  - `portefeuilles.csv` - Données exemple portefeuilles
  - `positions.csv` - Positions de test
  - `prix_jour.csv` - Historique de prix
  - `seuils_alerte.csv` - Configuration alertes

## 🎯 Quick Start

### Prérequis
- Licence Microsoft 365 (Business Premium, E3 ou E5)
- Accès Power Platform (Power Apps, Power BI Pro, Power Automate)
- Compte administrateur pour créer environnement

### Démarrage Rapide (30 minutes)

1. **Lire la Vision** (10 min)
   ```bash
   Ouvrir: MINI-ALADDIN-VISION.md
   Comprendre: Les 4 piliers et le positionnement
   ```

2. **Suivre le Guide Jour 1** (3-4 heures)
   ```bash
   Ouvrir: JOUR-1-GUIDE-COMPLET.md
   Exécuter: Étapes A à F
   Résultat: Dashboard opérationnel + alertes
   ```

3. **Importer les Templates** (10 min)
   ```bash
   Utiliser: templates/*.csv
   Importer dans: Dataverse
   Valider: Données visibles dans dashboard
   ```

4. **Tester** (10 min)
   ```bash
   Vérifier: Dashboard affiche valeurs
   Déclencher: Alertes manuellement
   Valider: Notifications Teams reçues
   ```

## 🏗️ Architecture

```
Mini-Aladdin M365
├── Power Apps (Interface utilisateur)
│   ├── Dashboard Home
│   ├── Gestion Portefeuilles
│   ├── Gestion Positions
│   └── Configuration Alertes
│
├── Dataverse (Base de données)
│   ├── Portefeuilles
│   ├── Positions
│   ├── Prix_Jour
│   └── Seuils_Alerte
│
├── Power BI (Analytics)
│   ├── Dashboard Vue d'Ensemble
│   ├── Dashboard Risques
│   └── Rapports Automatiques
│
├── Power Automate (Automatisation)
│   ├── Mise à jour prix quotidienne
│   ├── Alertes (Concentration, Drawdown, Volatilité)
│   ├── Rapports hebdomadaires
│   └── Data Quality Checks
│
└── Teams / Outlook (Notifications)
    ├── Canal Alertes
    ├── Canal Rapports
    └── Emails automatiques
```

## 📊 Structure de Données

### Table: Portefeuilles
| Champ | Type | Description |
|-------|------|-------------|
| Nom | Texte | Nom du portefeuille |
| Propriétaire Email | Email | Contact principal |
| Devise de Base | Choix | EUR, USD, GBP... |
| Valeur Objectif | Nombre | Objectif de valeur |
| Type | Choix | Conservateur, Équilibré, Dynamique |

### Table: Positions
| Champ | Type | Description |
|-------|------|-------------|
| Portefeuille | Recherche | Lien vers portefeuille |
| Ticker | Texte | AAPL, BTC-USD, etc. |
| Quantité | Nombre | Nombre d'unités |
| Prix d'Achat | Devise | Prix unitaire |
| Classe d'Actif | Choix | Actions, Crypto, Obligations... |

### Table: Prix_Jour
| Champ | Type | Description |
|-------|------|-------------|
| Ticker | Texte | Identifiant actif |
| Date | Date | Date du prix |
| Prix de Clôture | Devise | Prix de fin de journée |
| Volume | Nombre | Volume échangé |
| Source | Texte | YahooFinance, CoinGecko... |

### Table: Seuils_Alerte
| Champ | Type | Description |
|-------|------|-------------|
| Nom de la Règle | Texte | Nom descriptif |
| Type d'Alerte | Choix | Concentration, Drawdown, Volatilité |
| Valeur Seuil | Nombre | Valeur de déclenchement (%) |
| Email Notification | Email | Destinataire |

## 🎨 Dashboard Power BI

### Page 1: Vue d'Ensemble
- 💰 Carte: Valeur Totale
- 📈 Carte: P&L Total
- 📊 Carte: P&L %
- 🥧 Graphique: Allocation par Classe d'Actifs
- 📊 Graphique: Top 5 Positions
- 📉 Courbe: Évolution Valeur (30 jours)

### Page 2: Détail Positions
- 📋 Table: Toutes les positions avec P&L
- 🔍 Filtres: Par portefeuille, classe, secteur
- 📊 Graphiques: Distribution des gains/pertes

### Page 3: Risques (Jour 2+)
- ⚡ Gauge: Volatilité
- 💥 Carte: VaR à 95%
- 📊 Histogramme: Distribution rendements
- 🔥 Heat Map: Corrélations
- 📈 Timeline: Sharpe Ratio

## 🤖 Alertes Automatiques

### 1. Concentration Position
**Déclencheur**: Position > X% du portefeuille  
**Action**: Notification Teams + Email  
**Fréquence**: Quotidien (après mise à jour prix)

### 2. Drawdown Portefeuille
**Déclencheur**: Perte > X% depuis pic  
**Action**: Alerte critique avec analyse  
**Fréquence**: Quotidien (fin de journée)

### 3. Volatilité Excessive (Jour 2+)
**Déclencheur**: Volatilité > moyenne + 2σ  
**Action**: Notification avec recommandations  
**Fréquence**: Quotidien

### 4. Changement Allocation (Jour 2+)
**Déclencheur**: Allocation classe change > X% en 1 jour  
**Action**: Alerte avec détail mouvements  
**Fréquence**: Quotidien

### 5. Prix Franchit Niveau (Jour 3+)
**Déclencheur**: Prix actif franchit seuil défini  
**Action**: Notification instantanée  
**Fréquence**: Temps réel (si premium connectors)

## 💼 Modèle Business

### Niveaux de Prix

| Niveau | Prix/mois | Cible | Portefeuilles | Support |
|--------|-----------|-------|---------------|---------|
| **Starter** | 299€ | Particuliers | 1 | Email 48h |
| **Professional** | 999€ | Conseillers | 5 | Prioritaire 24h |
| **Enterprise** | 2,999€ | Family Offices | Illimité | Dédié 4h |

### Projection Revenus (Conservateur)

- **Année 1**: ~60,000€
- **Année 2**: ~480,000€
- **Année 3**: ~1,077,000€

Voir [MODELE-BUSINESS.md](./MODELE-BUSINESS.md) pour détails complets.

## 🗓️ Planning

### Semaine 1 (Jours 1-5)
- **Jour 1**: Foundation (Dashboard + Alertes) ✅
- **Jour 2**: Métriques risque avancées
- **Jour 3**: Power App mobile
- **Jour 4**: Reporting automatique
- **Jour 5**: Intégrations data + 1er client

### Semaine 2
- Optimisation & tests
- Features premium (stress tests, optimisation)
- Site web & marketing

### Semaine 3
- Go-to-Market
- 3 clients pilotes signés

## 📞 Support & Ressources

### Documentation Microsoft
- [Power Platform Docs](https://learn.microsoft.com/power-platform/)
- [Dataverse Guide](https://learn.microsoft.com/power-apps/maker/data-platform/)
- [Power BI Documentation](https://learn.microsoft.com/power-bi/)
- [Power Automate Docs](https://learn.microsoft.com/power-automate/)

### Inspiration Aladdin
- [BlackRock Aladdin](https://www.blackrock.com/aladdin)
- [Aladdin Wikipedia](https://en.wikipedia.org/wiki/Aladdin_%28BlackRock%29)

### Communauté
- [Power Platform Community](https://powerusers.microsoft.com/)
- [Power BI Community](https://community.powerbi.com/)
- [r/PowerPlatform](https://reddit.com/r/PowerPlatform)

## 🐛 Troubleshooting

### Problème: Connexion Dataverse échoue
**Solutions**:
- Vérifier licence Power Apps
- Vérifier rôle "Administrateur système"
- Attendre que l'environnement soit "Prêt"
- Essayer URL complète: `https://[org].crm.dynamics.com`

### Problème: Mesures DAX retournent erreur
**Solutions**:
- Vérifier relations entre tables
- Tester mesure simple d'abord
- Utiliser DAX Studio pour debugging
- Vérifier données de test présentes

### Problème: Flow Power Automate échoue
**Solutions**:
- Consulter historique d'exécution
- Ajouter délais entre actions
- Limiter nombre d'enregistrements (Top 100)
- Diviser en plusieurs flows si complexe

### Problème: Pas de notifications Teams
**Solutions**:
- Re-vérifier ID de l'équipe
- Tester "Publier dans un canal"
- Vérifier permissions du connecteur
- Essayer notification utilisateur direct

## 🎓 Intégration CIPFARO E-Learning

Ce projet s'intègre naturellement avec la plateforme CIPFARO:

### Synergies Pédagogiques
- **Module Formation**: "Gestion de Portefeuille avec Power Platform" (20h, 1,500€)
- **Certification**: "Mini-Aladdin Certified Analyst" (500€)
- **Cas d'usage**: Démonstrations pour formations fintech
- **Projets**: Stages et projets professionnels étudiants

### Clients Croisés
- Étudiants CIPFARO → utilisateurs Mini-Aladdin
- Clients Mini-Aladdin → formations CIPFARO
- Formateurs CIPFARO → ambassadeurs Mini-Aladdin

## ✅ Checklist de Validation

### MVP Technique ✓
- [ ] 4 tables Dataverse créées et peuplées
- [ ] Dashboard Power BI publié et accessible
- [ ] 2 alertes automatiques fonctionnelles
- [ ] Power App pour gestion (Jour 3+)
- [ ] Rapports automatisés (Jour 4+)
- [ ] Intégrations data (Jour 5+)

### Business ✓
- [ ] Modèle de prix défini
- [ ] 1er client pilote identifié
- [ ] Process onboarding documenté
- [ ] Support configuré
- [ ] Contrat type préparé

### Documentation ✓
- [ ] Guide complet Jour 1 validé
- [ ] Templates CSV disponibles
- [ ] Troubleshooting documenté
- [ ] Roadmap 5 jours claire
- [ ] Business model détaillé

## 🚀 Prochaines Étapes

1. **Lire** MINI-ALADDIN-VISION.md (15 min)
2. **Suivre** JOUR-1-GUIDE-COMPLET.md (4-6h)
3. **Importer** templates/*.csv (15 min)
4. **Valider** Dashboard + Alertes (30 min)
5. **Planifier** Jours 2-5 (voir ROADMAP-5-JOURS.md)

## 📄 Licence & Copyright

**Auteur**: CIPFARO - DG Rudy  
**Date**: Janvier 2026  
**Version**: 1.0  
**Licence**: Propriétaire - Usage interne CIPFARO

---

## 🎯 Objectif Final

Créer une plateforme accessible et professionnelle de gestion de portefeuille, inspirée d'Aladdin (BlackRock), permettant aux PME, conseillers financiers et family offices de bénéficier d'outils institutionnels à prix abordable.

**Vision**: Démocratiser l'accès aux outils de gestion de portefeuille professionnels via Microsoft Power Platform.

---

**🚀 Prêt à démarrer? Ouvre [JOUR-1-GUIDE-COMPLET.md](./JOUR-1-GUIDE-COMPLET.md) et commence l'implémentation!**
