#!/bin/sh
# Sends one test request to every tracked platform and adds the results to the
# file the marketing site's /status page reads. Cron runs it every six hours.
set -eu
cd "$(dirname "$0")"

DATA=status-data/provider-status.json
RUN=status-data/latest-run.json
mkdir -p status-data

TARGETS=$(sed -n 's/^SCRAPE_TARGETS=//p' .env | tr -d "\"' \r" | tail -1)
# The test exits non-zero when any platform fails; its results are written either way.
./deploy.sh exec -T worker sh -c "./node_modules/.bin/tsx scripts/test-provider.ts --target '$TARGETS' --output-json /tmp/status-run.json >/dev/null 2>&1; cat /tmp/status-run.json" >"$RUN"

python3 - "$DATA" "$RUN" <<'MERGE'
import json
import os
import sys
from datetime import datetime, timezone

data_path, run_path = sys.argv[1], sys.argv[2]
with open(run_path) as file:
    results = json.load(file)
try:
    with open(data_path) as file:
        stored = json.load(file)
except FileNotFoundError:
    stored = {}

now = datetime.now(timezone.utc)
keep_after = now.timestamp() - 30 * 24 * 60 * 60


def seconds(stamp):
    return datetime.fromisoformat(stamp.replace("Z", "+00:00")).timestamp()


for result in results:
    stored.setdefault(result["target"], []).append(
        {
            "ts": result.get("timestamp") or now.isoformat().replace("+00:00", "Z"),
            "status": result["status"],
            "latency": result.get("latency") or 0,
            "retries": result.get("retries") or 0,
            "textLength": result.get("textLength") or 0,
            "rawOutputBytes": result.get("rawOutputBytes") or 0,
            "citations": result.get("citations") or 0,
            "webQueries": result.get("webQueries") or 0,
            "webSearch": bool(result.get("webSearch")),
            "error": (result.get("error") or None) and str(result["error"])[:500],
        }
    )

for target in list(stored):
    stored[target] = [entry for entry in stored[target] if seconds(entry["ts"]) >= keep_after]
    if not stored[target]:
        del stored[target]

with open(data_path + ".tmp", "w") as file:
    json.dump(stored, file)
os.replace(data_path + ".tmp", data_path)
passed = sum(result["status"] == "pass" for result in results)
print(f"{now:%Y-%m-%d %H:%M} UTC: {passed} of {len(results)} platforms passed")
MERGE
