# ADR 0001 — Stack cible IN-CUBATOR

- Statut : accepté
- Date : 2026-08-18
- Sources métier : cahier de compréhension IN-CUBATOR et réponses aux besoins IN DEV

## Décision

IN-CUBATOR adopte un monolithe modulaire composé de deux applications Node.js :

- un frontend Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 ;
- une API REST Express 5 / TypeScript / Zod ;
- une base MySQL ou MariaDB pilotée par Prisma ORM 7 ;
- une authentification par cookies `httpOnly` avec jetons d’accès courts et jetons de renouvellement révocables ;
- TanStack Query pour l’état serveur, React Hook Form pour les formulaires et Zustand uniquement pour l’état local complexe ;
- Nginx et PM2 pour la cible VPS, avec des processus distincts pour le frontend et l’API.

Le produit reste un monolithe métier. Les domaines sont séparés dans le code, pas déployés en microservices.

## Structure cible

```text
in_cubator/
  src/                  # Next.js actuel, UI publique et espaces authentifiés
  backend/              # Express, domaines métier, Prisma et jobs
  deploy/               # PM2, Nginx et procédures d'exploitation
  docs/                 # décisions et traçabilité des exigences
```

## Domaines backend

```text
identity-organizations
applications-evaluation
programs-incubation
startups-roadmaps-kpis
mentoring-scheduling
investors-deal-room
open-innovation
content-learning
notifications-reports
admin-audit
integrations
```

Chaque domaine expose ses routes, schémas Zod, services et accès Prisma. Les contrôleurs HTTP ne contiennent pas de logique métier durable.

## Sécurité

- Les jetons ne sont jamais stockés dans `localStorage`.
- Les cookies d’authentification sont `httpOnly`, `SameSite=Lax` et `Secure` en production.
- Le backend reste l’autorité pour toutes les autorisations ; le proxy Next ne réalise que des redirections optimistes.
- Les permissions sont évaluées selon l’utilisateur, l’organisation, la ressource et l’action demandée.
- Les changements de statut, scores, décisions et accès aux documents sont journalisés.
- Les documents confidentiels utilisent un stockage privé et des liens temporaires ; `public/` est réservé aux médias réellement publics.

## Données et Prisma

- Prisma Client est généré dans `backend/src/generated/prisma` avec le générateur `prisma-client`.
- La connexion SQL utilise `@prisma/adapter-mariadb` et le driver `mariadb`, tous deux dépendances de production.
- `DATABASE_URL` est chargé explicitement dans `backend/prisma.config.ts`.
- Toute évolution de schéma doit produire une migration relue et versionnée.
- Les opérations de capacité, de réservation et d’accès utilisent des transactions afin d’éviter les doubles réservations et dépassements de capacité.

## Choix fonctionnels structurants

- Le matching V1 repose sur des règles pondérées, versionnées et explicables.
- Le scoring automatique assiste une décision humaine et conserve la version des critères utilisée.
- Les secteurs et les axes de programme sont deux taxonomies distinctes ; l’entrepreneuriat féminin est un axe transversal.
- Mentorat, workshop, bootcamp, hackathon, programme et événement sont des concepts distincts.
- Les données publiques, privées, internes et confidentielles sont classifiées explicitement.

## Hors périmètre tant que non cadré

- rendez-vous patient et données médicales ;
- wallet et logique financière ;
- paiement, facturation et commissions ;
- export générique des dashboards ;
- synchronisation calendrier ou visioconférence avec un fournisseur précis ;
- LLM, base vectorielle ou décision automatisée opaque.

## Migration depuis le prototype

1. Stabiliser Git et conserver le design existant.
2. Créer l’API Express et migrer Prisma vers le backend.
3. Exposer l’authentification sécurisée et les gardes de permissions.
4. Migrer les Route Handlers Next domaine par domaine derrière `/api`.
5. Remplacer les accès Prisma directs des Server Components par des services API.
6. Retirer Prisma et NextAuth du frontend une fois le dernier consommateur migré.
7. Ajouter tests, CI, sauvegardes, monitoring et configuration VPS avant production.

Cette migration est incrémentale : une route ne bascule vers Express qu’après validation de son contrat et de ses autorisations.
