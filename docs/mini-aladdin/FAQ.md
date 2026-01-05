# ❓ FAQ - Mini-Aladdin M365

## Questions Générales

### Qu'est-ce que Mini-Aladdin M365?
Mini-Aladdin M365 est une plateforme de gestion de portefeuille et d'analyse de risque inspirée d'Aladdin (BlackRock), mais construite sur Microsoft Power Platform pour être accessible aux PME, conseillers financiers indépendants et family offices locaux.

### Pourquoi "inspiré" d'Aladdin et pas une copie?
Aladdin de BlackRock est un système enterprise extrêmement complexe avec des décennies de développement. Notre approche est de **copier les concepts clés** (dashboard, risques, alertes, reporting) mais de les implémenter de façon **simple et accessible** avec des outils low-code.

### Combien coûte le déploiement?
**Coûts techniques**:
- Licences Microsoft 365: ~25-50€/utilisateur/mois
- Power BI Pro: ~10€/utilisateur/mois (ou inclus dans M365 E3)
- Développement initial: 0€ (suivez le guide Jour 1-5)

**Coûts commerciaux** (pour vendre):
- Niveau Starter: 299€/mois/client
- Niveau Professional: 999€/mois/client
- Niveau Enterprise: 2,999€/mois/client

### Ai-je besoin de compétences en développement?
**Non, mais vous devez être à l'aise avec**:
- Interface Microsoft 365
- Concepts de base de données (tables, relations)
- Logique de calcul simple (formules)
- Power BI Desktop (glisser-déposer)

**Niveau requis**: Utilisateur avancé Office 365, pas développeur.

### Combien de temps pour déployer le MVP?
- **Jour 1** (4-6h): Foundation (dashboard + alertes)
- **Jours 2-5** (12-16h): Features complètes
- **Total**: ~20h réparties sur 1 semaine

### Est-ce vraiment réaliste de viser 100k€/semaine?
**Honnêtement: C'est ambitieux**. Voici la réalité:
- **Année 1**: 5-10k€/mois réaliste
- **Année 2**: 30-50k€/mois possible
- **Année 3+**: 100k€/mois (≠ /semaine) avec volume clients

**Pour 100k€/SEMAINE (≈433k€/mois)**:
- Besoin de 50-100 clients actifs OU
- Quelques gros contrats enterprise OU
- Modèle white-label avec distributeurs

**Timeline réaliste**: Année 3-4 minimum avec exécution parfaite.

---

## Questions Techniques

### Quelle licence Microsoft 365 ai-je besoin?
**Options**:
1. **Microsoft 365 Business Premium** (~20€/user/mois)
   - ✅ Power Apps, Power Automate, Teams, Outlook
   - ✅ Dataverse (limité)
   - ❌ Power BI Pro séparé requis

2. **Microsoft 365 E3** (~35€/user/mois)
   - ✅ Tout inclus
   - ✅ Power BI Pro
   - ✅ Dataverse complet

3. **Microsoft 365 E5** (~55€/user/mois)
   - ✅ Tout E3 +
   - ✅ Power BI Premium
   - ✅ Fonctionnalités avancées

**Recommandation**: Commencer avec **Business Premium + Power BI Pro**, passer à E3 si scale.

### Puis-je utiliser un essai gratuit?
**Oui!** Microsoft offre:
- Power Apps: 30 jours gratuit
- Power BI: 60 jours gratuit
- Power Automate: 90 jours gratuit
- Microsoft 365: 30 jours gratuit

**Parfait pour tester le MVP sans investissement**.

### Où sont stockées les données?
**Dataverse** (base de données Microsoft):
- Hébergé dans le cloud Microsoft (Azure)
- Région choisie lors de la création (ex: Europe)
- Conforme RGPD
- Sauvegarde automatique
- Chiffrement au repos et en transit

### Les données sont-elles sécurisées?
**Oui**, Microsoft 365 offre:
- ✅ Certification ISO 27001, SOC 2
- ✅ Conformité RGPD
- ✅ Chiffrement AES-256
- ✅ Authentification multi-facteurs (MFA)
- ✅ Audit trail complet
- ✅ Backup automatique

### Puis-je gérer plusieurs clients avec une seule instance?
**Oui, 2 approches**:

**Approche 1: Multi-tenant (Recommandé)**
- 1 environnement par client
- Isolation totale des données
- Facturation séparée
- Plus sécurisé

**Approche 2: Single-tenant**
- 1 environnement pour tous
- Filtres de sécurité par client
- Gestion centralisée
- Moins cher mais moins isolé

### Puis-je intégrer d'autres sources de données?
**Oui!** Power Platform supporte 400+ connecteurs:

**Gratuits**:
- Excel, CSV, SharePoint
- Yahoo Finance (via HTTP)
- CoinGecko (crypto)
- Azure SQL Database

**Premium** (licence requise):
- Bloomberg
- Refinitiv
- Morningstar
- SQL Server on-premises

### Quelle est la limite de données dans Dataverse?
**Limites Business Premium**:
- 2 GB/environnement (base)
- +10 GB par licence utilisateur
- Exemple: 5 users = 2 + (5×10) = 52 GB

**Limites pratiques Mini-Aladdin**:
- 100 portefeuilles
- 10,000 positions
- 1 an d'historique prix quotidiens
= **~500 MB** (largement dans les limites)

**Si besoin plus**: Archiver anciennes données, passer à E3/E5.

### Puis-je exporter mes données?
**Oui**, plusieurs méthodes:
1. **Export manuel**: CSV depuis Power Apps
2. **Power Automate**: Export automatique vers OneDrive/SharePoint
3. **API**: Dataverse Web API (pour développeurs)
4. **Power BI**: Export rapports en Excel/PDF

---

## Questions Business

### À qui vendre Mini-Aladdin?
**Cibles idéales**:

1. **PME avec placements** (50-500 employés)
   - Trésorerie à optimiser
   - Fonds de pension employés
   - Budget: 300-1000€/mois

2. **Conseillers financiers indépendants**
   - Gèrent 10-50 clients
   - Besoin outils pro abordables
   - Budget: 1000-2000€/mois

3. **Family offices locaux**
   - Patrimoine familial à gérer
   - Multi-actifs complexe
   - Budget: 3000-5000€/mois

### Comment trouver mes premiers clients?
**Stratégies Day 1**:

1. **Réseau personnel**
   - Contacter directement vos contacts
   - Demander introductions
   - Offrir beta gratuit

2. **LinkedIn ciblé**
   - Chercher "CFO", "Gestionnaire de patrimoine"
   - Messages personnalisés (pas spam!)
   - Partager contenu de valeur

3. **Partenariats**
   - Experts-comptables (ils connaissent PME)
   - Banques régionales (co-branding)
   - Associations professionnelles

4. **Contenu**
   - Articles "Comment gérer son portefeuille"
   - Webinaires gratuits
   - Cas d'usage concrets

### Quelle est la différence vs Excel?
| Critère | Excel | Mini-Aladdin M365 |
|---------|-------|-------------------|
| **Prix** | Gratuit (inclus M365) | 300-3000€/mois |
| **Automatisation** | ❌ Manuelle | ✅ Automatique |
| **Alertes temps réel** | ❌ Non | ✅ Oui |
| **Scalabilité** | ❌ Fragile | ✅ Robuste |
| **Collaboration** | 🔶 Limité | ✅ Native |
| **Mobile** | ❌ Compliqué | ✅ Power Apps |
| **Sécurité** | ❌ Fichiers locaux | ✅ Cloud sécurisé |
| **Maintenance** | ❌ Manuelle | ✅ Auto |

**Excel est OK pour démarrer, Mini-Aladdin pour scaler**.

### Comment justifier le prix à un client?
**Arguments ROI**:

1. **Gain de temps**
   - Excel: 5h/semaine de mise à jour
   - Mini-Aladdin: 0h (automatique)
   - **Économie**: 20h/mois × 50€/h = **1000€/mois**

2. **Évitement de pertes**
   - Alertes détectent problèmes tôt
   - Exemple: Alerte concentration évite perte de 5-10%
   - **Valeur**: Sur 100k€ portefeuille = **5-10k€**

3. **Professionnalisme**
   - Dashboards impresses clients
   - Rapports automatiques crédibilité
   - **Valeur**: Acquisition/Rétention clients

4. **Conformité**
   - Audit trail automatique
   - Rapports réglementaires
   - **Valeur**: Évite amendes

**ROI typique**: 3-6 mois de payback.

### Dois-je avoir une structure juridique?
**Oui, options**:

1. **Micro-entreprise** (France)
   - Simple, rapide
   - Limites: 77k€ CA/an
   - OK pour démarrer

2. **SARL/SAS**
   - Plus professionnel
   - Pas de limite CA
   - Recommandé si scale

3. **Consulting indépendant**
   - Portage salarial
   - Simple fiscalement
   - Commission 5-10%

**Conseil**: Commencer micro-entreprise, passer SARL si dépasse 50k€ CA/an.

---

## Questions Stratégiques

### Par quelle niche commencer?
**Critères de choix**:

1. **Accès facilité**
   - Avez-vous des contacts directs?
   - Réseau existant dans ce secteur?

2. **Besoin urgent**
   - Problème douloureux actuel?
   - Budget disponible immédiat?

3. **Données disponibles**
   - Sources gratuites accessibles?
   - APIs simples à intégrer?

**Recommandation Jour 1**:
- **PME/Associations** (Option B) si réseau local fort
- **Particuliers** (Option A) si marketing digital maîtrisé
- **Conseillers** (Option C) si crédibilité financière établie

### Dois-je tout construire avant de vendre?
**Non! Approche Lean**:

**Semaine 1**: MVP technique (Jours 1-5)
**Semaine 2**: 3 démos client beta gratuit
**Semaine 3**: Feedback & ajustements
**Semaine 4**: Premier client payant

**Ne pas attendre la "perfection", itérer avec clients réels**.

### Comment gérer la concurrence?
**Concurrents principaux**:
- Bloomberg Terminal (2k€/mois)
- Morningstar Direct (1.5k€/mois)
- Aladdin (50k€+/mois)
- Excel (gratuit mais limité)

**Votre différenciation**:
1. **Prix**: 10x moins cher que pros
2. **Simplicité**: Pas besoin formation 6 mois
3. **Intégration M365**: Déjà utilisé par clients
4. **Support**: Personnalisé, pas call center
5. **Flexibilité**: Customisation rapide

### Et si ça ne marche pas?
**Plan B**:

1. **Pivot produit**
   - Outil interne pour cabinet conseil
   - Formation Power Platform
   - Templates vendus (99€/pièce)

2. **Skill développées**
   - Power Platform (compétence recherchée)
   - Finance quantitative
   - SaaS business
   → **Valeur sur CV / futur employeur**

3. **Réutilisation**
   - Intégrer à CIPFARO E-Learning
   - Cas d'usage pédagogique
   - Démonstration cours fintech

**Coût du "pire cas"**: 20-40h temps investi (formation Power Platform valorisable).

---

## Questions Jour 1

### Je n'ai pas de licence M365, puis-je quand même suivre?
**Oui**, 2 options:

1. **Essais gratuits** (recommandé)
   - 30 jours Power Apps + Power Automate
   - 60 jours Power BI
   - Parfait pour MVP

2. **Mode documentation**
   - Suivre guide théoriquement
   - Préparer specs techniques
   - Déployer quand licence obtenue

### Combien de temps prend vraiment le Jour 1?
**Estimation réaliste**:
- Lecture Vision + Guide: 1h
- Setup environnement M365: 1h
- Création tables Dataverse: 1h
- Dashboard Power BI: 2h
- Alertes Power Automate: 1.5h
- Tests & validation: 0.5h

**Total: 6-7h** (peut être réparti sur 2-3 jours)

### Puis-je sauter des étapes?
**Dépendances obligatoires**:
- ✅ Étape B (Environnement) → Requis pour tout
- ✅ Étape C (Tables) → Requis pour D, E, F
- 🔶 Étape D (Import données) → Recommandé mais pas bloquant
- ✅ Étape E (Dashboard) → Core valeur
- 🔶 Étape F (Alertes) → Peut être fait Jour 2

**Minimum viable Jour 1**: B + C + E (dashboard)

### J'ai un bug, où trouver de l'aide?
**Ressources**:

1. **Documentation**
   - Section Troubleshooting du guide
   - FAQ (ce document)

2. **Communauté Microsoft**
   - [Power Platform Community](https://powerusers.microsoft.com/)
   - [Power BI Community](https://community.powerbi.com/)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/powerapps)

3. **Support Microsoft**
   - Si licence payante: Support technique inclus
   - Documentation: [learn.microsoft.com](https://learn.microsoft.com/)

4. **Vidéos YouTube**
   - Rechercher: "Power Apps Dataverse tutorial"
   - Chaînes: Shane Young, April Dunnam, Reza Dorrani

---

## Prochaines Étapes

### Je termine Jour 1, que faire ensuite?
**Checklist validation**:
- [ ] Dashboard affiche valeurs correctes
- [ ] 2 alertes testées avec succès
- [ ] Données cohérentes dans Dataverse
- [ ] Teams intégration fonctionne

**Si OUI → Passer Jour 2** (métriques risque avancées)  
**Si NON → Debug et valider avant de continuer**

### Où trouver plus d'informations?
- **Vision**: [MINI-ALADDIN-VISION.md](./MINI-ALADDIN-VISION.md)
- **Guide Jour 1**: [JOUR-1-GUIDE-COMPLET.md](./JOUR-1-GUIDE-COMPLET.md)
- **Business**: [MODELE-BUSINESS.md](./MODELE-BUSINESS.md)
- **Roadmap**: [ROADMAP-5-JOURS.md](./ROADMAP-5-JOURS.md)

---

**Dernière mise à jour**: Janvier 2026  
**Version**: 1.0  
**Contributeurs**: CIPFARO - DG Rudy

**🚀 Prêt à démarrer? Ouvre [JOUR-1-GUIDE-COMPLET.md](./JOUR-1-GUIDE-COMPLET.md)!**
