# Exploitation VPS d'IN-CUBATOR

## Cible retenue

La cible finale repose sur un VPS Linux classique, sans Docker :

- Nginx expose un domaine unique en HTTPS ;
- `/api/` est transmis a Express sur `127.0.0.1:4000` sans reecriture du chemin ;
- toutes les autres routes sont transmises a Next.js sur `127.0.0.1:3000` ;
- PM2 maintient une instance de chaque service et leur transmet les signaux d'arret gracieux ;
- Prisma et MySQL/MariaDB restent la couche de persistance du backend.

Les deux ports applicatifs ecoutent uniquement sur l'interface locale. Nginx est le seul service expose sur les ports 80 et 443.

Pendant la migration, la topologie publique est volontairement differente : Nginx envoie tout le trafic a Next.js ; Next conserve les Route Handlers historiques sous `/api/*` et relaie seulement le namespace navigateur `/api/v2/*` vers Express interne sous `/api/*`. Il ne faut pas exposer directement tout `/api/*` a Express avant que les handlers historiques aient tous ete remplaces.

## Prerequis

Installer sur une distribution Debian/Ubuntu maintenue :

- Node.js `>= 20.19.0` et npm ;
- PM2, installe globalement pour l'utilisateur applicatif ;
- Nginx ;
- Certbot et son integration systemd ;
- le client MariaDB/MySQL, `gzip` et `sha256sum` ;
- `flock`, fourni habituellement par `util-linux`.

Le chemin conventionnel est `/var/www/in-cubator/current`. Le depot contient le frontend a sa racine et le backend dans `backend/`. L'utilisateur applicatif illustre dans ce document est `incubator` ; il faut l'adapter si le VPS emploie un autre compte non privilegie.

## Variables et secrets

Les secrets ne doivent jamais etre places dans `deploy/ecosystem.config.cjs` ni commites. Le backend charge `backend/.env` depuis son repertoire de travail. Ce fichier doit appartenir a l'utilisateur applicatif avec le mode `0600`.

En production, verifier au minimum :

- `DATABASE_URL` ;
- deux valeurs distinctes et longues pour `JWT_ACCESS_SECRET` et `JWT_REFRESH_SECRET` ;
- `CORS_ORIGINS=https://in-cubator.example.com` en remplacant le domaine d'exemple ;
- `COOKIE_SECURE=true`, `COOKIE_SAME_SITE=lax` et, si necessaire, `COOKIE_DOMAIN` ;
- `REFRESH_COOKIE_PATH=/` pour permettre la validation SSR et le renouvellement client ;
- `ADMIN_ACCESS_COOKIE_NAME` et `ADMIN_REFRESH_COOKIE_NAME` : cookies de la session de l'administration, distincts de ceux des membres (voir « Sessions séparées ») ;
- `TRUST_PROXY=1`, car Nginx constitue l'unique proxy de confiance ;
- `JSON_BODY_LIMIT=1mb`, a augmenter seulement pour un besoin metier mesure.

Next utilise `API_INTERNAL_URL=http://127.0.0.1:4000` pour ses appels serveur et son rewrite transitoire. Cette URL reste strictement interne et ne doit pas porter le prefixe `NEXT_PUBLIC_`. Les variables Next.js prefixees `NEXT_PUBLIC_` sont figees pendant `npm run build`.

Pendant la transition du stockage documentaire, définir `PRIVATE_STORAGE_DIR=/var/lib/in-cubator/documents` dans l'environnement Next, créer ce répertoire avec l'utilisateur applicatif et le mode `0700`, puis l'inclure dans les sauvegardes hors VPS. Ne pas placer ces documents sous `public/`. La cible définitive reste un stockage objet privé avec URLs signées et antivirus.

Durant la migration, les nouveaux appels navigateur emploient `/api/v2/*`; les appels historiques restent sous `/api/*`. Apres le cutover complet, le contrat public convergera vers `/api/*` directement servi par Express.

## Sessions separees : administration et espace membre

L'administration (`/admin`) et l'espace membre (startups, mentors, investisseurs) ont chacun leur session, avec leurs propres cookies (`in_cubator_admin_*` et `in_cubator_*`). On peut donc etre connecte aux deux dans le meme navigateur sans qu'ils se melangent.

- La connexion de l'equipe passe par `POST /api/auth/admin/login` (page `/admin/connexion`) et n'accepte que les roles `ADMIN` et `GESTIONNAIRE`. La connexion membre (`/api/auth/login`) refuse ces roles.
- Le client indique l'espace par l'en-tete `X-Auth-Realm: admin` ; sans lui, l'API lit la session membre. L'API verifie en plus que le role du compte appartient a l'espace demande : un jeton ne franchit jamais la frontiere.
- Le proxy Next (`src/proxy.ts`) n'examine que les cookies de l'espace concerne.
- Aucun lien vers `/admin` n'est expose sur le site public : l'acces se fait par l'URL directe. Pour aller plus loin, on peut restreindre `/admin` par IP ou l'exposer sur un sous-domaine dans Nginx sans modifier l'application.
- Apres ce changement, les administrateurs deja connectes doivent se reconnecter une fois.

## Premier demarrage PM2

Depuis la racine de l'application :

```bash
IN_CUBATOR_ROOT=/var/www/in-cubator/current \
  pm2 start deploy/ecosystem.config.cjs --env production
pm2 save
pm2 status
```

Activer ensuite le redemarrage au boot pour l'utilisateur `incubator` :

```bash
sudo env PATH="$PATH" pm2 startup systemd -u incubator --hp /home/incubator
```

PM2 affiche une commande finale a executer avec les privileges demandes. L'executer, puis refaire `pm2 save`. Les processus sont volontairement limites a une instance chacun : cela evite d'introduire trop tot une coordination de cache ISR et de Server Actions entre plusieurs instances Next.js.

## Nginx et HTTPS

Quatre modeles sont fournis, mais un seul doit etre active a la fois :

- `in-cubator-transition-http.conf` : amorcage HTTP a utiliser maintenant ;
- `in-cubator-transition.conf` : HTTPS a utiliser pendant la migration ;
- `in-cubator-http.conf` : amorcage HTTP pour une installation faite apres le cutover ;
- `in-cubator.conf` : cible HTTPS finale, ou `/api/*` va directement a Express.

### Installation pendant la migration

1. Remplacer toutes les occurrences de `in-cubator.example.com` dans `deploy/nginx/in-cubator-transition-http.conf` par le domaine reel.
2. Creer le webroot ACME :

   ```bash
   sudo install -d -o www-data -g www-data -m 0755 /var/www/letsencrypt
   ```

3. Installer la configuration HTTP dans `/etc/nginx/sites-available/in-cubator`, creer son lien dans `sites-enabled`, puis verifier avant rechargement :

   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Une fois le DNS en place, obtenir le certificat :

   ```bash
   sudo certbot certonly --webroot \
     --webroot-path /var/www/letsencrypt \
     -d in-cubator.example.com
   ```

5. Remplacer le domaine d'exemple dans `deploy/nginx/in-cubator-transition.conf`, puis remplacer la configuration HTTP installee par cette configuration HTTPS. Executer de nouveau `sudo nginx -t` avant `sudo systemctl reload nginx`.
6. Verifier le renouvellement :

   ```bash
   sudo certbot renew --dry-run
   systemctl list-timers | grep certbot
   ```

Avec le mode `webroot`, ajouter un hook de deploiement Certbot qui execute `systemctl reload nginx` apres un renouvellement reussi. Le fichier doit etre place dans `/etc/letsencrypt/renewal-hooks/deploy/`, appartenir a `root` et etre executable.

Le profil transitoire fait passer `/api/v2/*` par Next, afin que son rewrite atteigne Express sous `/api/*`. Les autres routes `/api/*` continuent d'atteindre les Route Handlers Next existants. Le refresh cookie reste `httpOnly`, mais son `Path=/` permet aux Server Components de valider une session expiree sans effectuer de rotation.

### Cutover final de l'API

Ne remplacer `in-cubator-transition.conf` par `in-cubator.conf` qu'une fois ces conditions reunies :

1. chaque Route Handler historique necessaire a un equivalent Express teste ;
2. aucun appel encore actif ne depend d'un handler Next sous `/api/*` ;
3. les appels navigateur transitoires `/api/v2/*` ont ete bascules vers le contrat public final `/api/*` ;
4. login, refresh, logout, uploads et parcours par role sont valides en preproduction ;
5. une sauvegarde MySQL verifiee vient d'etre produite.

Remplacer alors le fichier Nginx actif par `deploy/nginx/in-cubator.conf`, apres substitution du domaine, puis executer `sudo nginx -t` avant le rechargement. Ce profil transmet `/api/*` directement a Express sans reecrire le chemin et envoie le reste a Next.js.

La limite Nginx est fixee a 25 Mio. Elle protege les deux processus tout en laissant une marge aux futurs formulaires. La limite JSON Express reste plus basse. Les documents lourds de Deal Room devront etre envoyes directement vers le stockage objet via des URLs signees, pas faire transiter des centaines de megaoctets par Node.js.

Le buffering est desactive sur le proxy Next.js afin de conserver le streaming de l'App Router. Il n'y a pas de cache Nginx devant les pages applicatives, pour ne pas mettre en cache des donnees personnalisees.

## Sauvegardes MySQL/MariaDB

Creer un compte SQL reserve aux sauvegardes, avec les privileges minimaux compatibles avec les routines et evenements utilises. Stocker ses identifiants hors du depot :

```ini
# /etc/in-cubator/mysql-backup.cnf
[client]
host=127.0.0.1
port=3306
user=backup_user
password=CHANGE_ME
```

Installer ce fichier avec le proprietaire `incubator` et le mode `0600`, puis preparer le repertoire :

```bash
sudo install -d -o incubator -g incubator -m 0700 /etc/in-cubator
sudo install -o incubator -g incubator -m 0600 \
  mysql-backup.cnf /etc/in-cubator/mysql-backup.cnf
sudo install -d -o incubator -g incubator -m 0700 \
  /var/backups/in-cubator/mysql
```

Test manuel :

```bash
IN_CUBATOR_DB_NAME=in_cubator \
  bash deploy/scripts/backup-mysql.sh
```

Chaque archive est compressee, testee par `gzip -t`, accompagnee d'un SHA-256 et conservee 14 jours par defaut. Copier regulierement les archives vers un stockage hors VPS chiffre. Une sauvegarde restant sur le meme disque ne protege pas d'une panne du serveur.

Pour l'automatisation, adapter `deploy/cron/in-cubator-mysql-backup`, l'installer sous `/etc/cron.d/in-cubator-mysql-backup` avec le mode `0644`, puis verifier les executions via le journal systeme :

```bash
journalctl -t in-cubator-mysql-backup
```

Tester periodiquement une restauration dans une base temporaire, jamais directement dans la base de production. Employer pour cela un fichier d'identifiants de restauration distinct, autorise a ecrire dans cette base temporaire :

```bash
sha256sum --check sauvegarde.sql.gz.sha256
gzip --test sauvegarde.sql.gz
gzip --decompress --stdout sauvegarde.sql.gz | \
  mariadb --defaults-extra-file=/etc/in-cubator/mysql-restore.cnf base_temporaire
```

## Procedure de deploiement

Le code de la nouvelle revision doit deja etre present dans le repertoire cible. Le script ne fait volontairement ni `git pull`, ni modification de branche.

Avant le tout premier déploiement sur une base déjà existante, suivre impérativement la procédure de baseline dans `docs/operations/baseline-prisma.md`. Les déploiements suivants utilisent normalement `migrate deploy`.

Lancer :

```bash
cd /var/www/in-cubator/current
IN_CUBATOR_DB_NAME=in_cubator \
PUBLIC_BASE_URL=https://in-cubator.example.com \
  bash deploy/scripts/deploy.sh
```

L'ordre applique est intentionnel :

1. installation reproductible avec `npm ci` pour les deux applications ;
2. validation Prisma et construction du backend ;
3. construction Next.js ;
4. sauvegarde verifiee de MySQL ;
5. `prisma migrate deploy` uniquement sur les migrations versionnees ;
6. rechargement PM2, sauvegarde de la liste des processus et controles HTTP.

Les builds sont termines avant de modifier la base : une erreur de compilation ne laisse donc pas l'ancien service face a un schema deja migre. Les migrations doivent rester retrocompatibles avec la version encore active pendant les quelques secondes precedant le rechargement. Ne jamais utiliser `prisma migrate dev` ou `db push` en production.

`SKIP_DB_BACKUP=1` existe uniquement pour une urgence explicitement assumee. Son emploi est signale dans la sortie du script. Prisma ne fournit pas de rollback automatique fiable : en cas d'incident, privilegier une migration corrective ; une restauration exige une decision operatoire et une fenetre d'indisponibilite.

## Controles et diagnostic

Le script `deploy/scripts/health-check.sh` controle :

- `http://127.0.0.1:4000/api/health` pour Express ;
- `http://127.0.0.1:3000/` pour Next.js ;
- `https://<domaine>/healthz` via Nginx lorsque `PUBLIC_BASE_URL` est fourni.

Commandes utiles :

```bash
pm2 status
pm2 logs in-cubator-api --lines 100
pm2 logs in-cubator-web --lines 100
curl --fail --silent --show-error http://127.0.0.1:4000/api/health
curl --fail --silent --show-error https://in-cubator.example.com/healthz
sudo nginx -t
```

Configurer egalement une rotation des journaux PM2 (par exemple avec le module `pm2-logrotate` ou la politique `logrotate` du VPS) et une alerte externe sur les echecs de sauvegarde et de health check. Sans rotation, les fichiers de log peuvent finir par remplir le disque.

Le health check API confirme que le processus repond ; il ne remplace pas encore un controle de disponibilite MySQL. Un futur endpoint de readiness pourra verifier la base sans exposer d'information sensible, tandis que `/healthz` restera un controle de vivacite leger.
