#!/bin/sh
# Builds and starts everything, or passes any other docker compose command through.
#   ./deploy.sh                  pull the latest code, build, start
#   ./deploy.sh logs -f web      any docker compose command
set -eu
cd "$(dirname "$0")"

[ -f .env ] || {
	echo "No .env here yet. Copy env.example to .env and fill it in." >&2
	exit 1
}

STAGE=$(sed -n 's/^STAGE=//p' .env | tr -d "\"' \r" | tail -1)
case "$STAGE" in
beta | live) ;;
*)
	echo "Set STAGE=beta or STAGE=live in .env." >&2
	exit 1
	;;
esac

compose() {
	docker compose --env-file .env --env-file "stage-$STAGE.env" "$@"
}

# Made here, by the login that runs the provider test: left to Docker, the folder would belong to root.
mkdir -p status-data

if [ "$#" -gt 0 ]; then
	compose "$@"
	exit
fi

git -C .. pull --ff-only
compose build
compose up -d --remove-orphans
docker image prune -f >/dev/null
compose ps
