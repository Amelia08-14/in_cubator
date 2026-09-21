# Adoption Prisma Migrate sur la base existante

Le projet historique utilisait Prisma sans dossier de migrations. Le backend contient donc deux migrations distinctes :

- `00000000000000_baseline` décrit les tables historiques, sans les recréer sur une base existante ;
- `20260819001000_refresh_sessions` ajoute la table nécessaire à la rotation des sessions.

## Base locale ou de production déjà existante

Ne pas lancer directement `migrate deploy` tant que la baseline n'a pas été marquée comme appliquée.

1. Produire et vérifier une sauvegarde.
2. Comparer la base au schéma historique depuis la racine du dépôt :

   ```bash
   npx prisma migrate diff \
     --from-url "$DATABASE_URL" \
     --to-schema-datamodel prisma/schema.prisma \
     --exit-code
   ```

   Le code de sortie `0` signifie que la structure correspond. Un code `2` indique une dérive à examiner avant de continuer.

3. Depuis `backend/`, enregistrer la baseline sans exécuter son SQL :

   ```bash
   npx prisma migrate resolve --applied 00000000000000_baseline
   ```

4. Appliquer ensuite uniquement les migrations nouvelles :

   ```bash
   npm run db:migrate:deploy
   npm run db:migrate:status
   ```

Cette opération modifie l'historique Prisma et la base ; elle doit être faite une seule fois par environnement, après sauvegarde.

## Base vide

Sur une base neuve, ne pas marquer la baseline manuellement. `npm run db:migrate:deploy` crée le schéma historique puis la table `refresh_sessions` dans l'ordre.

`prisma migrate dev` reste réservé au développement. `prisma db push` n'est pas utilisé pour les environnements partagés ou de production.
