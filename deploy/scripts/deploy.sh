#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
APP_ROOT="$(cd -- "$SCRIPT_DIR/../.." && pwd -P)"
LOCK_FILE="${DEPLOY_LOCK_FILE:-${TMPDIR:-/tmp}/in-cubator-deploy.lock}"

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Commande requise introuvable: $1" >&2
    exit 1
  }
}

require_command flock
require_command npm
require_command node
require_command pm2

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  echo 'Un autre deploiement IN-CUBATOR est deja en cours.' >&2
  exit 1
fi

[[ -f "$APP_ROOT/package-lock.json" ]] || {
  echo "package-lock.json absent dans $APP_ROOT" >&2
  exit 1
}
[[ -f "$APP_ROOT/backend/package-lock.json" ]] || {
  echo "backend/package-lock.json absent dans $APP_ROOT" >&2
  exit 1
}
[[ -f "$APP_ROOT/backend/.env" ]] || {
  echo 'backend/.env de production est absent.' >&2
  exit 1
}

# Les dependances ne sont reinstallees que si package-lock.json (ou, a la racine,
# le schema Prisma qui sert a generer le client) a change depuis le dernier
# deploiement. Sinon on garde node_modules : la mise a jour est bien plus rapide.
install_if_changed() {
  local dir="$1" label="$2"
  shift 2
  local marker="$dir/node_modules/.deploy-inputs-hash"
  local current
  current="$(cat "$dir/package-lock.json" "$@" 2>/dev/null | sha256sum | cut -d' ' -f1)"

  if [[ -f "$marker" && "$(cat "$marker")" == "$current" ]]; then
    echo "  $label : dependances inchangees, installation ignoree"
    return
  fi

  echo "  $label : installation des dependances"
  npm --prefix "$dir" ci --no-audit --no-fund
  echo "$current" > "$marker"
}

echo '1/6 Dependances (installees seulement si elles ont change)'
install_if_changed "$APP_ROOT" 'site' "$APP_ROOT/prisma/schema.prisma"
install_if_changed "$APP_ROOT/backend" 'api'

echo '2/6 Validation et construction du backend'
npm --prefix "$APP_ROOT/backend" run prisma:validate
npm --prefix "$APP_ROOT/backend" run build

echo '3/6 Construction du frontend Next.js'
npm --prefix "$APP_ROOT" run build

echo '4/6 Sauvegarde MySQL avant migration'
if [[ "${SKIP_DB_BACKUP:-0}" == '1' ]]; then
  echo 'ATTENTION: sauvegarde ignoree explicitement avec SKIP_DB_BACKUP=1.' >&2
else
  : "${IN_CUBATOR_DB_NAME:?IN_CUBATOR_DB_NAME est requis pour la sauvegarde pre-migration.}"
  /usr/bin/env bash "$SCRIPT_DIR/backup-mysql.sh"
fi

echo '5/6 Application des migrations Prisma deja versionnees'
npm --prefix "$APP_ROOT/backend" run db:migrate:deploy

echo '6/6 Redemarrage PM2 et controles de sante'
IN_CUBATOR_ROOT="$APP_ROOT" pm2 startOrRestart \
  "$APP_ROOT/deploy/ecosystem.config.cjs" \
  --env production \
  --update-env
pm2 save

/usr/bin/env bash "$SCRIPT_DIR/health-check.sh"

echo "Deploiement termine depuis $APP_ROOT"
