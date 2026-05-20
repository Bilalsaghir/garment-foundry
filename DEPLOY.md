# Garment Foundry — Deploy guide

Two halves. Run **Part A on your Windows machine** to push the work to GitHub. Run **Part B on the Hostinger VPS** to pull it down and serve it.

---

## Part A — Push from your Windows machine

I can't push from the Cowork sandbox because:
- The repo is private (returns 404 to anonymous requests)
- This sandbox has no GitHub credentials

So this part runs on your computer.

### A1 · Prerequisites (one-time)

1. **Git installed.** Run in PowerShell or Command Prompt:
   ```powershell
   git --version
   ```
   If it errors, install Git for Windows: https://git-scm.com/download/win

2. **Git is signed in to GitHub.** Easiest way is to install **GitHub CLI**:
   ```powershell
   winget install --id GitHub.cli
   gh auth login
   ```
   Pick *HTTPS* → *Login with web browser* → finish in the browser. After this, any `git push` to your repo will just work.

   *(Alternative: use Git Credential Manager — bundled with Git for Windows. First push will pop up a browser auth window.)*

### A2 · Push the changes

Open PowerShell. Pick **one of these two paths** depending on whether you already have the repo cloned locally.

#### Option 1 — you already have the repo cloned somewhere on disk

Replace `<your-local-clone-path>` with where you have the existing clone.

```powershell
# 1. Stop the local dev server if it's running (Ctrl-C in that window).

# 2. Copy the updated tree from this folder over your local clone
$src = "C:\Users\User\OneDrive\Desktop\Garment Foundry\garment-foundry-website"
$dst = "<your-local-clone-path>"           # e.g. C:\dev\garment-foundry
robocopy "$src" "$dst" /MIR /XD node_modules .git /XF *.log

# 3. Review what's about to be committed
cd "$dst"
git status

# 4. Commit + push
git add -A
git commit -m "Hero slider, full Atelier nav, capabilities grid, lazy loading, 17 tearsheets (WebP)"
git push origin main
```

`robocopy /MIR` makes the destination an exact mirror of the source while preserving your `.git` directory (it's in the `/XD` excludes). If you have local-only files in your existing clone that aren't in the new folder, they'll be deleted — review with `git status` before committing.

#### Option 2 — push the `garment-foundry-website` folder directly as a fresh main

Use this if you'd rather have the remote main become exactly this snapshot, without preserving the older local working tree.

```powershell
cd "C:\Users\User\OneDrive\Desktop\Garment Foundry\garment-foundry-website"

# initialise + commit
git init -b main
git add -A
git commit -m "Garment Foundry rebuild — Atelier hero, 17 tech-pack slider, lazy loading"

# point at your repo + force-push (this REPLACES remote main)
git remote add origin https://github.com/Bilalsaghir/garment-foundry.git
git push -u origin main --force
```

**Warning:** `--force` rewrites the remote main. Make sure no one else is committing to it. If you have a backup branch, push to that instead first.

### A3 · Verify

Open `https://github.com/Bilalsaghir/garment-foundry` in a browser. The latest commit should be the one you just pushed. The `frontend/src/components/Navbar.jsx`, `HeroSlider.jsx`, `pages/Capabilities.jsx`, `pages/Home.jsx` and `public/tearsheets/*.webp` files should all be present.

---

## Part B — Deploy on the Hostinger VPS

You'll SSH into your VPS, clone the repo, run a one-line deploy script, and reload nginx. First-time setup takes about 10 minutes; subsequent deploys take 30 – 60 seconds.

### B1 · SSH in

From PowerShell on Windows:

```powershell
ssh root@<your-vps-ip>
```

You can find the VPS IP and the root password in your Hostinger panel under **VPS → Manage → SSH Access**. If you've already set up an SSH key, use that.

> Throughout the rest of Part B you're running commands **on the VPS**, not on Windows.

### B2 · One-time setup (skip if you've already done this)

Run these on the VPS as root (or with `sudo`). The commands assume **Ubuntu 22.04 or 24.04** — Hostinger's default OS choice. Adjust package names if you picked Debian or AlmaLinux.

#### Install Node 20 (or higher) + git + nginx

```bash
# Node 20.x via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git nginx
node --version    # expect v20.x
npm  --version    # expect 10.x
```

#### Clone the repo into `/var/www/garmentfoundry`

```bash
sudo mkdir -p /var/www
sudo chown -R $USER:$USER /var/www
cd /var/www
git clone https://github.com/Bilalsaghir/garment-foundry.git garmentfoundry
cd garmentfoundry
```

If the repo is still private, GitHub will prompt for credentials. Easiest way to authenticate from a server is a **deploy key**:

```bash
ssh-keygen -t ed25519 -C "garmentfoundry-vps" -f ~/.ssh/garmentfoundry_deploy -N ""
cat ~/.ssh/garmentfoundry_deploy.pub
```

Copy the printed `ssh-ed25519 …` line, then on GitHub go to **Settings → Deploy keys → Add deploy key** for the `garment-foundry` repo. Paste, give it a name like "Hostinger VPS", leave "Allow write access" unchecked, save.

Now tell git to use that key:

```bash
echo 'Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/garmentfoundry_deploy
  IdentitiesOnly yes' >> ~/.ssh/config

# switch the remote to SSH
cd /var/www/garmentfoundry
git remote set-url origin git@github.com:Bilalsaghir/garment-foundry.git
git pull
```

#### Set up nginx

A working nginx config template is already in the repo at `docs/nginx.conf.example`. Drop it in place:

```bash
sudo cp /var/www/garmentfoundry/docs/nginx.conf.example /etc/nginx/sites-available/garmentfoundry.conf
sudo ln -sf /etc/nginx/sites-available/garmentfoundry.conf /etc/nginx/sites-enabled/garmentfoundry.conf
sudo rm -f /etc/nginx/sites-enabled/default
```

Open it and check the TLS / `server_name` lines:

```bash
sudo nano /etc/nginx/sites-available/garmentfoundry.conf
```

- `server_name` should be `garmentfoundry.com www.garmentfoundry.com` (or whatever your domain is).
- The two `ssl_certificate*` lines are commented out. Leave them commented for now — we'll uncomment after we set up SSL with certbot.
- The `root` should point at `/var/www/garmentfoundry/frontend/build`.

Save (`Ctrl-O`, `Enter`, `Ctrl-X`).

If you don't yet have SSL certificates, temporarily switch the first `listen 443 ssl http2;` line to `listen 80;` and drop the bottom `listen 80 → 301` block — that lets you bring the site up on plain HTTP first, then issue certificates.

```bash
sudo nginx -t      # must say "test is successful"
sudo systemctl reload nginx
```

#### Point your domain at the VPS

In Hostinger DNS settings, set **A records** for `@` and `www` to your VPS's public IP. DNS propagation usually takes 5 – 30 minutes.

#### Get an SSL certificate (after DNS has propagated)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d garmentfoundry.com -d www.garmentfoundry.com
```

Certbot will edit the nginx config to install the certificate paths and switch to HTTPS automatically. After it finishes:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### B3 · Build + go live

The repo includes a `deploy.sh` script at the root.

```bash
cd /var/www/garmentfoundry
chmod +x deploy.sh        # one-time
./deploy.sh
```

What it does:
1. Pulls the latest `main` from GitHub (`git fetch --depth=1` + `git reset --hard`)
2. Runs `npm ci --legacy-peer-deps` (or `npm install` if the lockfile drifts)
3. Builds the production bundle with `DISABLE_ESLINT_PLUGIN=true` so a stray ESLint warning doesn't fail the build
4. Runs `nginx -t` to validate the config
5. Reloads nginx so the new bundle is served immediately

Expected output ends with:
```
[HH:MM:SS] Deploy complete.
[HH:MM:SS]   Build output:  /var/www/garmentfoundry/frontend/build
[HH:MM:SS]   Bundle hash:   main.<8-hex>.js
```

Open `https://garmentfoundry.com` in your browser. You should see the Atelier slider with all 17 pieces.

### B4 · Re-deploy in one command

For every future change, the flow is just:

```powershell
# on Windows
git push origin main
```

```bash
# on the VPS (SSH back in)
cd /var/www/garmentfoundry && ./deploy.sh
```

Optionally automate the second step with **a Git webhook**: a small listener on the VPS that runs `deploy.sh` whenever GitHub fires a push event. That's a follow-up project — not needed for the first launch.

---

## Troubleshooting

### `npm install` fails with `403 Forbidden — @emergentbase/visual-edits`

That's the Emergent.sh-private package. The repo already has it removed from `package.json`. If you ever see this error again it means somebody added it back. Remove it from `devDependencies` and from `package-lock.json` (or just delete `package-lock.json` and run `npm install --legacy-peer-deps` again).

### Site comes up but `/capabilities` shows a 404

That's nginx not knowing about SPA routes. Make sure your config has the block listed in `docs/nginx.conf.example`:

```nginx
location ~ ^/(about|capabilities|categories|process|sourcing|quality|quote|faqs|contact|blog|case-studies|unsubscribe|admin)(/.*)?$ {
    try_files $uri /index.html;
}
```

Then `sudo nginx -t && sudo systemctl reload nginx`.

### Site is blank with a JS console error about missing `/static/js/main.<hash>.js`

Stale browser cache. Hard-refresh with `Ctrl-Shift-R`. If that doesn't fix it, the build folder might be stale — re-run `./deploy.sh` and check the printed bundle hash matches what `index.html` references.

### Tearsheets don't load

The 17 WebP tearsheets live at `/var/www/garmentfoundry/frontend/build/tearsheets/`. Check they're there:

```bash
ls /var/www/garmentfoundry/frontend/build/tearsheets/ | wc -l
# should print 17
```

If they're missing, run `./deploy.sh` again — the build copies `public/tearsheets/*.webp` into `build/tearsheets/`.

### "Permission denied (publickey)" from `git pull` on the VPS

Your deploy key isn't set up. Re-run the deploy-key section in B2.

---

## What lives where, after deployment

| Where | What |
|---|---|
| **GitHub repo** | The source of truth. Push from Windows → triggers nothing automatically — you run `./deploy.sh` on the VPS. |
| `/var/www/garmentfoundry/` | The clone on the VPS. Owned by your VPS user, not root, so `git pull` doesn't need sudo. |
| `/var/www/garmentfoundry/frontend/build/` | Where nginx reads from. Regenerated every time `deploy.sh` runs. |
| `/etc/nginx/sites-available/garmentfoundry.conf` | The nginx config. **Not in the repo** — only the example template is. Edit on the VPS. |
| `/etc/letsencrypt/live/garmentfoundry.com/` | Your SSL certificate, managed automatically by certbot. |

---

## After it's live

A few suggested follow-ups (not blocking launch):

- **Strip remaining certification claims.** I flagged earlier that `Capabilities.jsx`, `Quality.jsx`, `Sourcing.jsx`, and `content.js` still mention GOTS / OEKO-TEX / SMETA / BCI / AQL 2.5. The marquee + slider production cards are clean; these pages aren't. Say the word and I'll strip them in one pass.
- **Pre-render with react-snap.** The current site is client-rendered. Adding `react-snap` to `package.json` pre-builds each route as a static HTML file at deploy time, giving you proper meta tags and SEO without a full SSR move. The nginx config already mentions this as Phase 3 work.
- **Git webhook for auto-deploy.** Five minutes of setup, removes the manual `./deploy.sh` step.

Ping me when each of those becomes the priority.

— *Cowork · 2026-05-20*
