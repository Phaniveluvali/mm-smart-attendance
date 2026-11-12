# MM Smart Attendance – GitOps Static Deployment with Local PV Live Editing

Static web deployment of the **Muscat Municipality Smart Attendance** application (Operations Web Portal, Mobile PWA, and Split Demo Console) served via Nginx on Kubernetes, backed by the cluster's Rancher `local-path` subdirectory provisioner for zero-restart temporary hot-edits, exposed over HTTPS via Ingress-Nginx, and managed continuously by ArgoCD.

---

## Live Public Endpoints

- **Operations Web Portal (Default Entry):** `https://tecnics-internal.online/mmsmartattendance/` (`index.html`)
- **Split Demo Console (Mobile + Portal side-by-side):** `https://tecnics-internal.online/mmsmartattendance/index1.html`
- **Mobile App (PWA):** `https://tecnics-internal.online/mmsmartattendance/mobile.html`
- **Legacy Portal Bookmark Redirect:** `https://tecnics-internal.online/mmsmartattendance/portal.html` -> `301` redirect to `/mmsmartattendance/`

> Opening `https://tecnics-internal.online/mmsmartattendance` (without trailing slash) issues a `301` redirect to `/mmsmartattendance/` while preserving HTTPS.

---

## Architecture & Repository Layout

- **GitOps Controller:** ArgoCD (`argocd/application.yaml`, automated sync, `prune: true`, `selfHeal: true`)
- **Namespace:** `mm-smart-attendance`
- **Active Container Image:** `krishnaveluvali/mm-smart-attendance:v1.0.4` (`nginx:1.27-alpine`)
- **Rollback Image Versions Retained on Docker Hub & Git Tags:**
  - `v1.0.4` — Client `mm-smart-attendanc-v4.zip` release (updated `css/portal.css`, `js/mobile.js`, `js/portal.js`)
  - `v1.0.3` — `mm-smart-attendanc-v1.zip` release (`index.html` Web Portal, `index1.html` Split Demo Console, `/portal.html` redirect)
  - `v1.0.2` — Previous code release with `/mmsmartattendance` context root & `local-path` PV (`index.html` console + `portal.html`)
  - `v1.0.1` — Context root `/mm-smartattendance` (stateless)
  - `v1.0.0` — Initial release under `/mm-smart-attendance`
- **StorageClass / Provisioner:** `local-path` (`rancher.io/local-path`), dynamically provisioning host subdirectory storage under `/k8s-storage/pvc-<uid>_mm-smart-attendance_mm-smart-attendance-pvc`
- **Ingress Routing:** Subpath `/mmsmartattendance` (`Prefix`) on `tecnics-internal.online` with TLS secret `ca-vmx-tls-cert`, keeping existing apps (`bas` `/`, `eauction` `/seller-buyer`, `argocd`, `monitoring`, `voltmx`) unaffected.

```
mm-smart-attendance/
├── src/                         # Static web assets copied into /opt/mm-static & web root
│   ├── index.html               # Operations & HR Web Portal (default entry)
│   ├── index1.html              # Split Demo Console (mobile + portal iframes)
│   ├── mobile.html              # Employee mobile PWA
│   ├── manifest.webmanifest     # PWA manifest
│   ├── assets/                  # Icons, Muscat Municipality logo, banners
│   ├── css/                     # Stylesheets (base.css, portal.css)
│   └── js/                      # Client-side demo engine, charts, branding, UI
├── docs/                        # Original application, phone demo, and speaker notes guides
├── nginx/
│   └── default.conf             # /mmsmartattendance subpath rewrite, portal.html redirect, gzip, cache, dotfile deny, /healthz
├── Dockerfile                   # Bundles static assets in /opt/mm-static for PVC seeding
├── k8s/                         # Declarative Kubernetes Kustomize manifests (no Helm)
│   ├── namespace.yaml
│   ├── pvc.yaml                 # 2Gi RWO PersistentVolumeClaim (local-path)
│   ├── deployment.yaml          # initContainer seeds PVC on boot/version change + Nginx pod
│   ├── service.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
└── argocd/
    └── application.yaml         # ArgoCD Application manifest
```

---

## Step-by-Step Deployment Procedure

### Step 1: Prepare & Build the Container Image

1. Place clean web assets inside `src/` (excluding local helper scripts such as `serve.ps1`, `Start-Demo.bat`, and `data/`).
2. `Dockerfile` copies `src/` into `/opt/mm-static/` (used by Kubernetes `initContainer` to seed the PVC) and `/usr/share/nginx/html/` (so standalone `docker run` also works without mounting a PVC).
3. Build and locally verify the Nginx image:

```bash
docker build -t krishnaveluvali/mm-smart-attendance:v1.0.4 -t krishnaveluvali/mm-smart-attendance:latest .
docker run -d -p 18089:80 --name mm-test krishnaveluvali/mm-smart-attendance:v1.0.4
curl -i http://localhost:18089/healthz
curl -i http://localhost:18089/mmsmartattendance/
curl -i http://localhost:18089/mmsmartattendance/index1.html
docker rm -f mm-test
```

### Step 2: Push Image & Git Repository

1. Push the immutable versioned image tag to Docker Hub (never overwriting previous tags like `v1.0.3`):

```bash
docker login -u krishnaveluvali
docker push krishnaveluvali/mm-smart-attendance:v1.0.4
docker push krishnaveluvali/mm-smart-attendance:latest
```

2. Commit, tag, and push to `https://github.com/Phaniveluvali/mm-smart-attendance.git` (`main`):

```bash
git add -A
git commit -m "feat(app): deploy v1.0.4 client release (mm-smart-attendanc-v4.zip)"
git tag v1.0.4
git push origin main --tags
```

### Step 3: Onboard Repository, TLS Secret & ArgoCD Application (Initial Setup)

1. Register the GitHub repository secret in `argocd` namespace (`repo-github-mm-attendance`).
2. Copy TLS secret `ca-vmx-tls-cert` cleanly into `mm-smart-attendance` namespace (without ArgoCD tracking annotations).
3. Apply `argocd/application.yaml` and verify sync + PVC binding:

```bash
kubectl apply -f argocd/application.yaml
kubectl get application mm-smart-attendance -n argocd
kubectl get pvc,pv,deploy,pods,svc,ing -n mm-smart-attendance -o wide
```

---

## Fast Rollback Procedure (Using Retained Image Versions)

Every release keeps an immutable Docker Hub tag (`v1.0.0`, `v1.0.1`, `v1.0.2`, `v1.0.3`, `v1.0.4`) and matching Git tag. Because `initContainer` (`seed-static-assets`) checks `[ "$(cat .image-version)" != "$APP_VERSION" ]`, switching back to an earlier image tag automatically restores both the Nginx config AND the older static files inside the PV:

```bash
# 1. Revert the deployment change in Git (or set image + APP_VERSION in k8s/deployment.yaml back to v1.0.3)
git revert HEAD --no-edit
git push origin main

# 2. Force ArgoCD refresh (or wait for 3-minute poll)
kubectl annotate application mm-smart-attendance -n argocd argocd.argoproj.io/refresh=hard --overwrite
```

---

## Temporary Live Edits via PersistentVolume (No Pod Restart)

The Deployment mounts `PersistentVolumeClaim/mm-smart-attendance-pvc` (StorageClass `local-path`, provisioner `rancher.io/local-path`) at `/usr/share/nginx/html`.

### 1. Locate the Dynamic PV Subdirectory on `backend.test.com`

```bash
PV_NAME=$(kubectl get pvc mm-smart-attendance-pvc -n mm-smart-attendance -o jsonpath='{.spec.volumeName}')
PV_HOST_DIR=$(kubectl get pv "$PV_NAME" -o jsonpath='{.spec.hostPath.path}')
echo "Host PV directory: $PV_HOST_DIR"
```

### 2. Edit Files Live Without Restarting the Pod

```bash
sudo vi "$PV_HOST_DIR/index.html"
sudo chmod -R a+rX "$PV_HOST_DIR"
```

*(Or copy via `kubectl cp ./src/index.html mm-smart-attendance/$(kubectl get pod -n mm-smart-attendance -l app=mm-smart-attendance -o jsonpath='{.items[0].metadata.name}'):/usr/share/nginx/html/index.html`.)*

### 3. Revert Temporary PV Edits Back to Active Image (`v1.0.4`)

```bash
sudo rm -f "$PV_HOST_DIR/.image-version"
kubectl rollout restart deployment/mm-smart-attendance -n mm-smart-attendance
```
