#!/bin/sh
# Builds and starts the demo, or passes any other docker compose command through.
#   ./deploy.sh                                 pull the latest code, build, start, refill the sample data
#   ./deploy.sh --profile seed run --rm seed    refill the sample data only
#   ./deploy.sh logs -f web                     any docker compose command
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
	docker compose --env-file .env --env-file "../stage-$STAGE.env" "$@"
}

if [ "$#" -gt 0 ]; then
	compose "$@"
	exit
fi

git -C ../.. pull --ff-only
compose --profile seed build
compose up -d --remove-orphans
compose --profile seed run --rm seed
docker image prune -f >/dev/null
compose ps
