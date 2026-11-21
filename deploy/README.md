# Deploying CiteRank.com on Google Cloud

One Debian server runs everything with Docker Compose: the database, the app, the worker, the marketing site, and Caddy, which gets the certificates.

| Address | What answers | When |
| --- | --- | --- |
| `app.citerank.com` | the app | from the first day |
| `beta.citerank.com` | the marketing site, hidden from search engines | while testing |
| `citerank.com` | the marketing site | from launch day |

The demo (`demo.citerank.com`) gets its own server in its own project and is not covered here yet.

## Have these ready

- Access to the DNS records of `citerank.com`.
- Stripe test keys. Add a webhook to `https://app.citerank.com/api/auth/stripe/webhook` with the events `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated` and `customer.subscription.deleted`, and keep its signing secret.
- A Resend API key, with the sender's domain verified.
- A Google sign-in client, with the redirect address `https://app.citerank.com/api/auth/callback/google`.
- The keys of the providers that will fetch the AI answers, and a TypeSafe key.

## 1. Create the server

In the Google Cloud console, pick the project and open Cloud Shell (the terminal icon, top right). Set your project ID on the first line, then paste the rest.

```
PROJECT=your-project-id
REGION=europe-west2
ZONE=europe-west2-a
gcloud config set project $PROJECT
gcloud services enable compute.googleapis.com storage.googleapis.com
gcloud compute addresses create citerank-ip --region=$REGION
gcloud compute firewall-rules create citerank-web --allow=tcp:80,tcp:443 --target-tags=citerank-web
gcloud compute instances create citerank --zone=$ZONE --machine-type=e2-standard-2 \
  --image-family=debian-12 --image-project=debian-cloud \
  --boot-disk-size=50GB --boot-disk-type=pd-balanced \
  --address=citerank-ip --tags=citerank-web \
  --scopes=storage-rw,logging-write,monitoring-write
```

Backups: a bucket for the nightly database dump, and a daily snapshot of the disk kept for a week.

```
gcloud storage buckets create gs://citerank-backups-$PROJECT --location=$REGION
gcloud storage buckets add-iam-policy-binding gs://citerank-backups-$PROJECT \
  --member="serviceAccount:$(gcloud compute instances describe citerank --zone=$ZONE --format='value(serviceAccounts[0].email)')" \
  --role=roles/storage.objectAdmin
gcloud compute resource-policies create snapshot-schedule citerank-daily --region=$REGION \
  --start-time=04:00 --daily-schedule --max-retention-days=7
gcloud compute disks add-resource-policies citerank --zone=$ZONE --resource-policies=citerank-daily
```

Print the server's address:

```
gcloud compute addresses describe citerank-ip --region=$REGION --format='value(address)'
```

## 2. Point the test addresses at it

At the DNS provider for `citerank.com`, add two A records with that address: `beta` and `app`. Leave the records for `citerank.com` and `www` alone until launch day.

## 3. Set up the server

Connect from Cloud Shell. Press Enter if it asks for a passphrase.

```
gcloud compute ssh citerank --zone=$ZONE
```

On the server:

```
sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/adamdanyal/citerank.git
sudo ./citerank/deploy/server-setup.sh
exit
```

## 4. Fill in the settings and start

Connect again, then create the settings file:

```
gcloud compute ssh citerank --zone=$ZONE
cd citerank/deploy
cp env.example .env
openssl rand -hex 24
openssl rand -base64 32
openssl rand -base64 32
nano .env
```

The three `openssl` lines print the database password, `BETTER_AUTH_SECRET` and `ELMO_ENCRYPTION_KEY`, in that order. In `nano`, fill in every line that applies, with `STAGE=beta`, your own email in `CLOUD_SIGNUP_ALLOWLIST`, and `BACKUP_BUCKET` set to `citerank-backups-` followed by your project ID. Save with Ctrl+O then Enter, and leave with Ctrl+X.

Build and start everything. The first run takes about 15 minutes.

```
./deploy.sh
```

Create the plans and prices in Stripe:

```
./deploy.sh --profile tools run --rm stripe-bootstrap
```

## 5. Test

- `https://beta.citerank.com` shows the marketing site, and `https://app.citerank.com` the sign-in page.
- Sign up with the email on the list, confirm it from the email, choose a plan and pay with a Stripe test card.
- Add a brand and wait for the first answers to arrive.

To make your account an admin:

```
./deploy.sh exec postgres psql -U postgres -d citerank -c "update \"user\" set role = 'admin' where email = 'you@example.com';"
```

If something is wrong, these show what each part is doing:

```
./deploy.sh ps
./deploy.sh logs --tail=100 web
./deploy.sh logs --tail=100 worker
```

## Launch day

1. In DNS, point the A records for `citerank.com` and `www` at the server's address.
2. In `.env`, set `STAGE=live` and `CLOUD_SIGNUP_ALLOWLIST=*`, and swap in the live Stripe keys and the live webhook's signing secret.
3. Run `./deploy.sh`, then `./deploy.sh --profile tools run --rm stripe-bootstrap` for the live Stripe account.

From then on `www.citerank.com` and `beta.citerank.com` redirect to `citerank.com`, and search engines are allowed in.

## Afterwards

- Update to the latest code: `cd citerank/deploy && ./deploy.sh`.
- Run a backup by hand: `./backup.sh`. The nightly one logs to `/var/log/citerank-backup.log`.
- Restore a dump: `./deploy.sh exec -T postgres pg_restore -U postgres -d citerank --clean --if-exists < file.dump`.
