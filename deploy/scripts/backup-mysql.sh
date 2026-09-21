#!/usr/bin/env bash
set -Eeuo pipefail

umask 077

MYSQL_CONFIG="${MYSQL_CONFIG:-/etc/in-cubator/mysql-backup.cnf}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/in-cubator/mysql}"
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-14}"
DATABASE_NAME="${IN_CUBATOR_DB_NAME:-}"

temporary_backup=''

cleanup() {
  if [[ -n "$temporary_backup" && -f "$temporary_backup" ]]; then
    rm -f -- "$temporary_backup"
  fi
}
trap cleanup EXIT

fail() {
  echo "Sauvegarde MySQL impossible: $*" >&2
  exit 1
}

[[ "$DATABASE_NAME" =~ ^[A-Za-z0-9_]+$ ]] || \
  fail 'IN_CUBATOR_DB_NAME est requis et ne peut contenir que lettres, chiffres et underscore.'
[[ "$BACKUP_RETENTION_DAYS" =~ ^[0-9]+$ ]] || \
  fail 'BACKUP_RETENTION_DAYS doit etre un entier positif ou nul.'
[[ "$BACKUP_DIR" == /* && "$BACKUP_DIR" != '/' ]] || \
  fail 'BACKUP_DIR doit etre un chemin absolu dedie, different de /.'
[[ -r "$MYSQL_CONFIG" ]] || \
  fail "fichier de connexion absent ou illisible: $MYSQL_CONFIG"

config_mode="$(stat -c '%a' "$MYSQL_CONFIG")"
if (( (8#$config_mode & 077) != 0 )); then
  fail "$MYSQL_CONFIG doit etre prive (mode 600 ou plus restrictif)."
fi

if command -v mariadb-dump >/dev/null 2>&1; then
  dump_command='mariadb-dump'
elif command -v mysqldump >/dev/null 2>&1; then
  dump_command='mysqldump'
else
  fail 'mariadb-dump ou mysqldump est requis.'
fi

command -v gzip >/dev/null 2>&1 || fail 'gzip est requis.'
command -v sha256sum >/dev/null 2>&1 || fail 'sha256sum est requis.'

retention_days=$((10#$BACKUP_RETENTION_DAYS))

install -d -m 0700 "$BACKUP_DIR"

timestamp="$(date -u +'%Y%m%dT%H%M%SZ')"
final_backup="$BACKUP_DIR/in-cubator-${DATABASE_NAME}-${timestamp}.sql.gz"
temporary_backup="$(mktemp --tmpdir="$BACKUP_DIR" ".in-cubator-${timestamp}.XXXXXX.sql.gz")"

dump_options=(
  "--defaults-extra-file=$MYSQL_CONFIG"
  --single-transaction
  --quick
  --routines
  --events
  --triggers
  --hex-blob
  --no-tablespaces
)

# L'option evite d'embarquer l'etat GTID avec le client Oracle MySQL, mais
# n'existe pas sur mariadb-dump.
if ! "$dump_command" --version | grep -qi 'mariadb'; then
  dump_options+=(--set-gtid-purged=OFF)
fi

"$dump_command" "${dump_options[@]}" "$DATABASE_NAME" | gzip -9 > "$temporary_backup"

gzip -t "$temporary_backup"
chmod 0600 "$temporary_backup"
mv -- "$temporary_backup" "$final_backup"
temporary_backup=''

(
  cd -- "$BACKUP_DIR"
  sha256sum "$(basename -- "$final_backup")" > "$(basename -- "$final_backup").sha256"
)
chmod 0600 "$final_backup.sha256"

if (( retention_days > 0 )); then
  find "$BACKUP_DIR" \
    -maxdepth 1 \
    -type f \
    -name "in-cubator-${DATABASE_NAME}-*.sql.gz" \
    -mtime "+$retention_days" \
    -delete
  find "$BACKUP_DIR" \
    -maxdepth 1 \
    -type f \
    -name "in-cubator-${DATABASE_NAME}-*.sql.gz.sha256" \
    -mtime "+$retention_days" \
    -delete
fi

echo "Sauvegarde MySQL creee et verifiee: $final_backup"
