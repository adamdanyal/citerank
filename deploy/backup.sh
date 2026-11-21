#!/bin/sh
# Dumps the database and copies the file to the bucket named by BACKUP_BUCKET in .env.
# server-setup.sh schedules it nightly. To restore a dump:
#   ./deploy.sh exec -T postgres pg_restore -U postgres -d citerank --clean --if-exists < file.dump
set -eu
cd "$(dirname "$0")"

BUCKET=$(sed -n 's/^BACKUP_BUCKET=//p' .env | tr -d "\"' \r" | tail -1)
[ -n "$BUCKET" ] || {
	echo "BACKUP_BUCKET is not set in .env." >&2
	exit 1
}

FILE="/tmp/citerank-$(date -u +%Y-%m-%dT%H%M).dump"
trap 'rm -f "$FILE"' EXIT

./deploy.sh exec -T postgres pg_dump -U postgres -Fc citerank >"$FILE"
gcloud storage cp "$FILE" "gs://$BUCKET/$(basename "$FILE")"
echo "Backed up to gs://$BUCKET/$(basename "$FILE")"
