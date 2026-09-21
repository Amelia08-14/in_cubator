#!/usr/bin/env bash
set -Eeuo pipefail

BACKEND_HEALTH_URL="${BACKEND_HEALTH_URL:-http://127.0.0.1:4000/api/health/ready}"
FRONTEND_HEALTH_URL="${FRONTEND_HEALTH_URL:-http://127.0.0.1:3000/}"
HEALTH_ATTEMPTS="${HEALTH_ATTEMPTS:-20}"
HEALTH_RETRY_DELAY_SECONDS="${HEALTH_RETRY_DELAY_SECONDS:-2}"

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Commande requise introuvable: $1" >&2
    exit 1
  }
}

check_url() {
  local service_name="$1"
  local url="$2"
  local attempt

  for ((attempt = 1; attempt <= HEALTH_ATTEMPTS; attempt += 1)); do
    if curl \
      --fail \
      --location \
      --silent \
      --show-error \
      --max-time 5 \
      --output /dev/null \
      "$url"; then
      echo "$service_name: OK ($url)"
      return 0
    fi

    if ((attempt < HEALTH_ATTEMPTS)); then
      sleep "$HEALTH_RETRY_DELAY_SECONDS"
    fi
  done

  echo "$service_name: ECHEC apres $HEALTH_ATTEMPTS tentatives ($url)" >&2
  return 1
}

require_command curl

[[ "$HEALTH_ATTEMPTS" =~ ^[1-9][0-9]*$ ]] || {
  echo 'HEALTH_ATTEMPTS doit etre un entier strictement positif.' >&2
  exit 1
}
[[ "$HEALTH_RETRY_DELAY_SECONDS" =~ ^[0-9]+([.][0-9]+)?$ ]] || {
  echo 'HEALTH_RETRY_DELAY_SECONDS doit etre un nombre positif.' >&2
  exit 1
}

check_url "API Express" "$BACKEND_HEALTH_URL"
check_url "Frontend Next.js" "$FRONTEND_HEALTH_URL"

if [[ -n "${PUBLIC_BASE_URL:-}" ]]; then
  check_url "Reverse proxy public" "${PUBLIC_BASE_URL%/}/healthz"
fi
