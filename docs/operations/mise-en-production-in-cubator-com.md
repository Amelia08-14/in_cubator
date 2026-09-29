# Mise en production d'IN-CUBATOR sur `in-cubator.com`

VPS cible : `31.97.52.249` (héberge déjà d'autres sites). Domaine : `in-cubator.com`, dont la zone DNS est aujourd'hui servie par un hébergement cPanel (`91.121.51.179`) avec la messagerie.

Principe directeur : **on n'ajoute rien qui puisse toucher aux autres sites du VPS** (ports dédiés, utilisateur dédié, démon PM2 dédié, un seul nouveau fichier Nginx) et **on ne casse pas la messagerie** du domaine.

Ce document complète `deploiement-vps.md` (référence technique) : il donne l'ordre exact des opérations pour ce cas précis.

---

## Partie A — DNS de `in-cubator.com`

### Ce que montre la zone actuelle

| Enregistrement | Valeur actuelle | Conséquence |
| --- | --- | --- |
| `A in-cubator.com` | `91.121.51.179` (cPanel) | C'est celui qu'on veut envoyer vers le VPS |
| `MX in-cubator.com` | `0 in-cubator.com` | **Piège** : le serveur de mail est désigné par le nom racine lui-même. Repointer le `A` racine ferait partir le courrier vers le VPS |
| `A mail.in-cubator.com` | `91.121.51.179` | Existe déjà : c'est la bonne cible pour le MX |
| `TXT in-cubator.com` (SPF) | `v=spf1 +a +mx +ip4:162.19.98.77 +ip4:188.165.51.53 ~all` | `+a` désigne aujourd'hui l'IP cPanel ; après bascule il désignerait le VPS |
| `CNAME www` | `in-cubator.com` | Suit automatiquement le `A` racine : rien à faire |
| tous les autres (`webmail`, `cpanel`, `whm`, `ftp`, `webdisk`, `autoconfig`, `autodiscover`, `cpcontacts`, `cpcalendars`, DKIM, DMARC, `_cpanel-dcv-test-record`, `_acme-challenge`, SRV/TXT `_caldav*` `_carddav*`) | `91.121.51.179` ou valeurs texte | **À ne pas toucher** |
| tout ce qui finit par `.wajed` | `91.121.51.179` | Sous-domaine `wajed.in-cubator.com` : a ses propres enregistrements, **non affecté** |

### Les seules modifications à faire (dans cet ordre)

**Étape 0 — 4 à 5 heures avant la bascule : baisser le TTL**
Le TTL actuel est de 14400 s (4 h). Sur les lignes `A in-cubator.com` et `MX in-cubator.com`, le passer à **300** s. Ainsi la bascule (et un éventuel retour arrière) prend 5 minutes au lieu de 4 heures.

**Étape 1 — Protéger la messagerie (sans effet visible, à faire en premier)**

| Ligne | Avant | Après |
| --- | --- | --- |
| `MX in-cubator.com` | `0 in-cubator.com` | `0 mail.in-cubator.com` |
| `TXT in-cubator.com` (SPF) | `v=spf1 +a +mx +ip4:162.19.98.77 +ip4:188.165.51.53 ~all` | `v=spf1 +a +mx +ip4:91.121.51.179 +ip4:162.19.98.77 +ip4:188.165.51.53 ~all` |

Contrôle : `dig +short MX in-cubator.com` doit renvoyer `0 mail.in-cubator.com.` ; envoyez-vous un mail de test vers une adresse `@in-cubator.com` et vérifiez qu'il arrive toujours.

**Étape 2 — Au moment de la mise en ligne (VPS prêt, voir partie B) : basculer le site**

| Ligne | Avant | Après |
| --- | --- | --- |
| `A in-cubator.com` | `91.121.51.179` | `31.97.52.249` |

Ne touchez pas à `www` (CNAME vers `in-cubator.com`).

**Étape 3 (facultative) — CalDAV / CardDAV**
Les quatre SRV `_caldav._tcp`, `_caldavs._tcp`, `_carddav._tcp`, `_carddavs._tcp` visent `in-cubator.com` (ports 2079/2080). Après bascule, ce nom pointera sur le VPS. Si vous utilisez agendas/contacts cPanel, remplacez leur cible par `mail.in-cubator.com`. Sinon, ignorez.

### Avertissements
- **Le site actuellement servi par cPanel sur `in-cubator.com` sera remplacé.** S'il y a du contenu à conserver, sauvegardez-le dans cPanel avant l'étape 2. `wajed.in-cubator.com` continue de fonctionner (autre `A`).
- L'`AutoSSL` de cPanel échouera pour `in-cubator.com` après la bascule : c'est normal.
- Vérifier la propagation : `dig +short A in-cubator.com @1.1.1.1` doit afficher `31.97.52.249`.

### Retour arrière
Remettre `A in-cubator.com` sur `91.121.51.179` (5 minutes grâce au TTL bas). Rien d'autre n'a changé.

---

## Partie B — Le VPS (`31.97.52.249`), phase par phase

Remplacez `WEB_PORT` et `API_PORT` par les ports libres retenus à la phase 1 (ex. `3011` et `4011`). Toutes les commandes sont pour un compte avec `sudo`.

### Phase 0 — Filet de sécurité
1. Faire un **snapshot du VPS** depuis le panneau de l'hébergeur.
2. Sauvegarder l'existant :
   ```bash
   sudo tar czf ~/nginx-avant-incubator-$(date +%F).tgz /etc/nginx
   pm2 list && cp ~/.pm2/dump.pm2 ~/dump.pm2.avant-incubator 2>/dev/null || true
   ```

### Phase 1 — Inspecter (lecture seule)
```bash
pm2 list                          # applications déjà lancées (et par quel utilisateur)
ss -tlnp | sort -k4               # ports déjà pris
ls -l /etc/nginx/sites-enabled/   # sites déjà configurés
sudo nginx -t                     # la configuration actuelle est-elle valide ?
node -v; mysql --version; df -h /; free -m
ss -tln | grep -E ':(WEB_PORT|API_PORT)\b' || echo "ports libres"
```
Choisissez deux ports libres, 127.0.0.1 uniquement. Notez aussi la version de Node : IN-CUBATOR exige **Node ≥ 20.19**.

### Phase 2 — Utilisateur et dossiers dédiés
```bash
sudo adduser --disabled-password --gecos "" incubator
sudo install -d -o incubator -g incubator -m 0755 /var/www/in-cubator
sudo install -d -o incubator -g incubator -m 0700 /var/lib/in-cubator/documents
sudo install -d -o www-data -g www-data -m 0755 /var/www/letsencrypt
```
Node pour cet utilisateur **sans toucher au Node global** des autres sites :
```bash
sudo -iu incubator
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.nvm/nvm.sh && nvm install 22 && npm i -g pm2
```
PM2 lancé par `incubator` a son **propre démon** : il n'interfère pas avec le PM2 de vos autres sites.

### Phase 3 — Le code
Prérequis : le code doit être **commité et poussé** sur GitHub (`Amelia08-14/in_cubator`).
```bash
sudo -iu incubator
ssh-keygen -t ed25519 -f ~/.ssh/in_cubator_deploy -N "" -C "deploy in-cubator"
cat ~/.ssh/in_cubator_deploy.pub     # à ajouter dans GitHub > Settings > Deploy keys (lecture seule)
GIT_SSH_COMMAND="ssh -i ~/.ssh/in_cubator_deploy" \
  git clone git@github.com:Amelia08-14/in_cubator.git /var/www/in-cubator/current
```

### Phase 4 — Base de données (MySQL/MariaDB déjà présent)
```sql
CREATE DATABASE in_cubator CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'in_cubator_app'@'localhost' IDENTIFIED BY '<MOT_DE_PASSE_LONG_ALEATOIRE>';
GRANT ALL PRIVILEGES ON in_cubator.* TO 'in_cubator_app'@'localhost';
FLUSH PRIVILEGES;
```
Un compte dédié, limité à cette seule base : un incident ici ne touche pas vos autres bases.

### Phase 5 — Secrets et configuration
Générer les secrets : `openssl rand -base64 48` (deux valeurs différentes pour les JWT).

`/var/www/in-cubator/current/backend/.env` (mode `0600`, propriétaire `incubator`) :
```ini
NODE_ENV=production
HOST=127.0.0.1
PORT=API_PORT
API_PREFIX=/api
TRUST_PROXY=1
DATABASE_URL=mysql://in_cubator_app:<MOT_DE_PASSE>@127.0.0.1:3306/in_cubator
CORS_ORIGINS=https://in-cubator.com,https://www.in-cubator.com
JWT_ACCESS_SECRET=<48 octets aléatoires>
JWT_REFRESH_SECRET=<48 octets aléatoires, différents>
JWT_ISSUER=in-cubator-api
JWT_AUDIENCE=in-cubator-web
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
REFRESH_COOKIE_PATH=/
```
(les noms de cookies `in_cubator_*` et `in_cubator_admin_*` gardent leurs valeurs par défaut.)

`/var/www/in-cubator/current/.env.production` (Next lit la base directement pour certaines pages ; mode `0600`) :
```ini
DATABASE_URL=mysql://in_cubator_app:<MOT_DE_PASSE>@127.0.0.1:3306/in_cubator
PRIVATE_STORAGE_DIR=/var/lib/in-cubator/documents
```

### Phase 6 — Premier déploiement
```bash
sudo -iu incubator
cd /var/www/in-cubator/current
export IN_CUBATOR_WEB_PORT=WEB_PORT IN_CUBATOR_API_PORT=API_PORT
SKIP_DB_BACKUP=1 IN_CUBATOR_DB_NAME=in_cubator bash deploy/scripts/deploy.sh
```
`SKIP_DB_BACKUP=1` n'est acceptable que pour ce tout premier passage, la base étant vide. Le script installe les dépendances, compile, applique les migrations (la baseline crée toutes les tables sur une base vierge), démarre PM2 et lance les contrôles de santé.

**Ne jamais lancer `prisma/seed.ts` en production** : il crée des comptes de démonstration aux mots de passe connus.

Puis, pour que le redémarrage survive à un reboot du VPS :
```bash
pm2 save
sudo env PATH=$PATH:/home/incubator/.nvm/versions/node/$(node -v)/bin \
  pm2 startup systemd -u incubator --hp /home/incubator
```

### Phase 7 — Premier compte administrateur
```bash
cd /var/www/in-cubator/current/backend
read -rsp "Mot de passe admin : " ADMIN_PASSWORD; echo
ADMIN_EMAIL=votre@email.com ADMIN_PASSWORD="$ADMIN_PASSWORD" npm run admin:create
unset ADMIN_PASSWORD
```
(12 caractères minimum, une majuscule, une minuscule, un chiffre.) Connectez-vous ensuite sur `/admin/connexion`, puis **créez la première cohorte** dans « Cohortes » : tant qu'aucune cohorte n'a ses candidatures ouvertes, le site refuse les candidatures.

### Phase 8 — Nginx (un seul nouveau fichier)
```bash
cd /var/www/in-cubator/current/deploy/nginx
sed -e 's/server_name in-cubator\.example\.com;/server_name in-cubator.com www.in-cubator.com;/' \
    -e 's/in-cubator\.example\.com/in-cubator.com/g' \
    -e 's/127\.0\.0\.1:3000/127.0.0.1:WEB_PORT/' \
    -e 's/127\.0\.0\.1:4000/127.0.0.1:API_PORT/' \
    in-cubator-transition-http.conf | sudo tee /etc/nginx/sites-available/in-cubator >/dev/null
sudo ln -s /etc/nginx/sites-available/in-cubator /etc/nginx/sites-enabled/in-cubator
sudo nginx -t && sudo systemctl reload nginx
```
`nginx -t` **avant** le rechargement : en cas d'erreur, rien n'est rechargé et vos autres sites ne sont pas touchés. Le `server_name` inclut `www.in-cubator.com` : c'est nécessaire pour que Certbot puisse valider ce nom (phase 10).

**Test avant de toucher au DNS** (sans HTTPS pour l'instant) :
```bash
curl -sI --resolve in-cubator.com:80:31.97.52.249 http://in-cubator.com/ | head -3
curl -s  --resolve in-cubator.com:80:31.97.52.249 http://in-cubator.com/healthz
```

### Phase 9 — Bascule DNS
Faire l'**étape 2 de la partie A** (`A in-cubator.com` → `31.97.52.249`). Attendre `dig +short A in-cubator.com @1.1.1.1` = `31.97.52.249`.

### Phase 10 — Certificat HTTPS
```bash
sudo certbot certonly --webroot -w /var/www/letsencrypt -d in-cubator.com -d www.in-cubator.com
sed -e 's/server_name in-cubator\.example\.com;/server_name in-cubator.com www.in-cubator.com;/' \
    -e 's/in-cubator\.example\.com/in-cubator.com/g' \
    -e 's/127\.0\.0\.1:3000/127.0.0.1:WEB_PORT/' \
    -e 's/127\.0\.0\.1:4000/127.0.0.1:API_PORT/' \
    /var/www/in-cubator/current/deploy/nginx/in-cubator-transition.conf | sudo tee /etc/nginx/sites-available/in-cubator >/dev/null
sudo nginx -t && sudo systemctl reload nginx
sudo certbot renew --dry-run
```
Ajoutez le hook de rechargement Nginx décrit dans `deploiement-vps.md` (`renewal-hooks/deploy`).

### Phase 11 — Vérifications finales
- [ ] `curl -sI https://in-cubator.com/` → `200`, `curl -s https://in-cubator.com/healthz` → ok
- [ ] Connexion `/admin/connexion`, puis création d'un lead depuis le formulaire du site, visible dans `/admin/crm`
- [ ] Les cookies de session sont `Secure` et `HttpOnly` (outils du navigateur)
- [ ] **Vos autres sites répondent toujours** (un `curl -sI` sur chacun) et `pm2 list` de leur utilisateur est inchangé
- [ ] Le courrier `@in-cubator.com` : envoyer et recevoir un message de test
- [ ] `sudo nginx -t` propre ; `pm2 status` (utilisateur `incubator`) : deux processus `online`

### Phase 12 — Exploitation
- Sauvegardes MySQL quotidiennes (`deploy/scripts/backup-mysql.sh` + cron, voir `deploiement-vps.md`), copiées **hors du VPS**.
- Rotation des logs PM2 (`pm2 install pm2-logrotate`).
- Parefeu : seuls 22, 80, 443 ouverts vers l'extérieur ; les ports `WEB_PORT` et `API_PORT` n'écoutent que sur `127.0.0.1`.
- Mises à jour ultérieures : `git pull` puis `bash deploy/scripts/deploy.sh` (avec les deux variables de ports).
- Si des secrets ont transité en clair dans un terminal partagé, les régénérer.

### Retour arrière complet
```bash
sudo rm /etc/nginx/sites-enabled/in-cubator && sudo nginx -t && sudo systemctl reload nginx
sudo -iu incubator pm2 delete in-cubator-web in-cubator-api && sudo -iu incubator pm2 save
```
Puis remettre le `A in-cubator.com` sur `91.121.51.179`. La base `in_cubator` peut rester en place.
