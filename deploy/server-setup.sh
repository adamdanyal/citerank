#!/bin/sh
# One-time setup of a fresh Debian server: Docker, automatic security updates,
# swap for the builds, a cap on log size, and the nightly database backup.
#   sudo ./deploy/server-setup.sh
set -eu

[ "$(id -u)" -eq 0 ] || {
	echo "Run this with sudo." >&2
	exit 1
}
OWNER=${SUDO_USER:?run this with sudo from your own login}
REPO=$(cd "$(dirname "$0")/.." && pwd)

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y -qq curl cron unattended-upgrades >/dev/null

if ! command -v docker >/dev/null 2>&1; then
	curl -fsSL https://get.docker.com | sh
fi
usermod -aG docker "$OWNER"

if [ ! -f /etc/docker/daemon.json ]; then
	mkdir -p /etc/docker
	printf '{\n  "log-driver": "json-file",\n  "log-opts": { "max-size": "10m", "max-file": "5" }\n}\n' >/etc/docker/daemon.json
	systemctl restart docker
fi

printf 'APT::Periodic::Update-Package-Lists "1";\nAPT::Periodic::Unattended-Upgrade "1";\n' >/etc/apt/apt.conf.d/20auto-upgrades

if [ ! -f /swapfile ]; then
	fallocate -l 4G /swapfile
	chmod 600 /swapfile
	mkswap /swapfile >/dev/null
	swapon /swapfile
	echo "/swapfile none swap sw 0 0" >>/etc/fstab
fi

LOG=/var/log/citerank-backup.log
touch "$LOG"
chown "$OWNER" "$LOG"
printf 'PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\n15 3 * * * %s %s/deploy/backup.sh >>%s 2>&1\n' "$OWNER" "$REPO" "$LOG" >/etc/cron.d/citerank
chmod 644 /etc/cron.d/citerank

echo
echo "Done. Close this SSH window and open a new one, so your login can use Docker."
