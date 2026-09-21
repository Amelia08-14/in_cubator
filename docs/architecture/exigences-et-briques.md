# Traçabilité exigences → briques techniques

| Exigence métier | Brique retenue | Garantie attendue |
| --- | --- | --- |
| Questionnaire dynamique | React Hook Form, Zod, versions de questionnaire en base | Les anciennes candidatures restent interprétables après modification du formulaire |
| Scoring automatique | Service de règles pondérées et critères versionnés | Score explicable, reproductible et modifiable par décision humaine tracée |
| Organisations et équipes | `User`, `Organization`, `Membership`, permissions contextuelles | Un utilisateur peut exercer plusieurs fonctions sans dupliquer son compte |
| Mentorat individuel ou collectif | Sessions, participants, disponibilités et transactions SQL | Durée minimale d’une heure et capacité maximale de 20 participants |
| Open Innovation | Audits, challenges, appels à projets, invitations, candidatures et pilotes | Appels publics ou ciblés avec critères spécifiques |
| Dashboard startup | Objectifs, jalons, KPI historisés, tâches et feedbacks | Progression calculée depuis des données métier, pas depuis des mocks UI |
| Vitrine publique | Projection publique dédiée | Aucun champ interne ou confidentiel n’est exposé par défaut |
| Deal Room | Stockage privé, grants par ressource, liens signés et audit | Accès temporaire et révocable, consultation/téléchargement traçables |
| Portail investisseur | Préférences, recherche, recommandations, watchlist et portefeuille | Recommandations explicables et accès contrôlé aux dossiers |
| PDF de candidature | Job asynchrone idempotent et artefact versionné | Génération fiable sans bloquer la requête utilisateur |
| Notifications | Outbox/jobs puis adaptateurs email et in-app | Relance réessayable, état de livraison observable |
| IN ACADEMY / CAPITAL / PAY / COM | Adaptateurs d’intégration et webhooks versionnés | Source de vérité explicite avant toute synchronisation |
| Administration | API Express avec RBAC/ABAC et journal d’audit | Aucun endpoint sensible ne dépend uniquement d’un contrôle frontend |

## Exigences à clarifier avant implémentation

- Définition exacte du MVP parmi les neuf services IN-OS.
- Source de vérité et contrats d’intégration avec les autres produits IN.
- Règles finales de la Deal Room : NDA, durée, téléchargement et validation.
- Champs et règles conditionnelles définitifs des questionnaires.
- KPI, calculs, fréquences et restitutions attendues.
- Paiement, commissions, remboursements, devises et fiscalité.
- Langues, territoires, conformité et politique de conservation.
- Gouvernance future des antennes et franchises.
