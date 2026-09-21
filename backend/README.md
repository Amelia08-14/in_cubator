# IN-CUBATOR API

Fondation backend séparée en Express 5, TypeScript ESM, Prisma 7 et MariaDB/MySQL.

## Prérequis

- Node.js 20.19 ou plus récent
- npm
- une base MariaDB ou MySQL accessible

## Démarrage local

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:validate
npm run typecheck
npm run dev
```

Sous PowerShell, remplacer la première commande par :

```powershell
Copy-Item .env.example .env
```

Le dossier `prisma/migrations` contient une baseline du schéma historique, puis la migration des sessions. Pour une base déjà existante, suivre `docs/operations/baseline-prisma.md` avant tout déploiement.

Ne jamais utiliser `migrate reset`, `db push --force-reset` ou `db push --accept-data-loss` sans consentement explicite et sauvegarde vérifiée.

## Endpoints initiaux

Tous les endpoints sont préfixés par `API_PREFIX`, `/api` par défaut.

- `GET /api/health`
- `/api/auth/*` : inscription, connexion, rotation, révocation et utilisateur courant ;
- `/api/applications/*` : candidature propriétaire et traitement gestionnaire ;
- `/api/startups/*` : catalogue public, profil propriétaire et roadmap ;
- `/api/mentors/*` et `/api/admin/mentors/*` : catalogue, profil et validation ;
- `/api/deal-room/*` : demandes, décisions et documents autorisés ;
- `/api/meetings/*` : liste contextuelle et réservation mentor atomique.

Les tokens access et refresh sont uniquement envoyés dans des cookies `httpOnly`. Le refresh token est renouvelé à chaque usage ; seule son empreinte SHA-256 est persistée dans `refresh_sessions`. Les rôles `ADMIN` et `GESTIONNAIRE` ne sont pas disponibles via l'inscription publique.

## Arborescence

```text
prisma/
  schema.prisma
src/
  config/       # environnement, cookies et connexion MariaDB
  errors/       # erreurs applicatives et handler Express
  generated/    # client Prisma généré, ignoré par Git
  lib/          # singleton Prisma
  middleware/   # authentification, rôles, rate limiting, 404
  modules/auth/ # schémas, tokens, service, contrôleurs et routes
  routes/       # health et routeur API
  app.ts
  server.ts
```
