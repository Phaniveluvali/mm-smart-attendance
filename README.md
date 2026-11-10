# MM Smart Attendance – GitOps Static Deployment with Local PV Live Editing

Static web deployment of the **Muscat Municipality Smart Attendance** demo (Demo console, Mobile PWA, and Operations Web Portal) served via Nginx on Kubernetes, backed by the cluster's Rancher `local-path` subdirectory provisioner for zero-restart temporary hot-edits, exposed over HTTPS via Ingress-Nginx, and managed continuously by ArgoCD.

---

## Live Public Endpoints

- **Demo Console (Mobile + Portal side-by-side):** `https://tecnics-internal.online/mmsmartattendance/`
- **Mobile App (PWA):** `https://tecnics-internal.online/mmsmartattendance/mobile.html`
- **Operations Web Portal:** `https://tecnics-internal.online/mmsmartattendance/portal.html`

> Opening `https://tecnics-internal.online/mmsmartattendance` (without trailing slash) issues a `301` redirect to `/mmsmartattendance/` while preserving HTTPS.

---

## Architecture & Repository Layout

- **GitOps Controller:** ArgoCD (`argocd/application.yaml`, automated sync, `prune: true`, `selfHeal: true`)
- **Namespace:** `mm-smart-attendance`
- **Container Image:** `krishnaveluvali/mm-smart-attendance:v1.0.2` (`nginx:1.27-alpine`)
- **StorageClass / Provisioner:** `local-path` (`rancher.io/local-path`), dynamically provisioning host subdirectory storage under `/k8s-storage/pvc-<uid>_mm-smart-attendance_mm-smart-attendance-pvc`
- **Ingress Routing:** Subpath `/mmsmartattendance` (`Prefix`) on `tecnics-internal.online` with TLS secret `ca-vmx-tls-cert`, keeping existing apps (`bas` `/`, `eauction` `/seller-buyer`, `argocd`, `monitoring`, `voltmx`) unaffected.

```
mm-smart-attendance/
├── src/                         # Static web assets copied into /opt/mm-static & web root
│   ├── index.html               # Split demo console (mobile + portal iframes)
│   ├── mobile.html              # Employee mobile PWA
│   ├── portal.html              # Operations & HR web portal
│   ├── manifest.webmanifest     # PWA manifest
│   ├── assets/                  # Icons, Muscat Municipality logo, banners
│   ├── css/                     # Stylesheets (base.css, portal.css)
│   └── js/                      # Client-side demo engine, charts, branding, UI
├── docs/                        # Original application & phone demo guides
├── nginx/
│   └── default.conf             # /mmsmartattendance subpath rewrite, gzip, cache, dotfile deny, /healthz
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

1. Place clean web assets inside `src/` (excluding local helper scripts such as `serve.ps1` and `Start-Demo.bat`).
2. `Dockerfile` copies `src/` into `/opt/mm-static/` (used by Kubernetes `initContainer` to seed the PVC) and `/usr/share/nginx/html/` (so standalone `docker run` also works without mounting a PVC).
3. Build and locally verify the Nginx image:

```bash
docker build -t krishnaveluvali/mm-smart-attendance:v1.0.2 -t krishnaveluvali/mm-smart-attendance:latest .
docker run -d -p 18089:80 --name mm-test krishnaveluvali/mm-smart-attendance:v1.0.2
curl -i http://localhost:18089/healthz
curl -i http://localhost:18089/mmsmartattendance/
docker rm -f mm-test
```

### Step 2: Push Image & Git Repository

1. Push the versioned image to Docker Hub:

```bash
docker login -u krishnaveluvali
docker push krishnaveluvali/mm-smart-attendance:v1.0.2
docker push krishnaveluvali/mm-smart-attendance:latest
```

2. Commit and push manifests (`k8s/`, `nginx/`, `Dockerfile`, `argocd/`, `src/`) to `https://github.com/Phaniveluvali/mm-smart-attendance.git` (`main`).

### Step 3: Onboard Repository, TLS Secret & ArgoCD Application

1. Register the GitHub repository secret in `argocd` namespace (`repo-github-mm-attendance`).
2. Ensure namespace `mm-smart-attendance` exists and copy the wildcard/SAN TLS secret `ca-vmx-tls-cert` from `argocd` namespace (stripping cluster metadata so ArgoCD does not adopt or prune it):

```bash
kubectl create namespace mm-smart-attendance --dry-run=client -o yaml | kubectl apply -f -
kubectl get secret ca-vmx-tls-cert -n argocd -o json | python3 -c "
import sys, json
s = json.load(sys.stdin)
print(json.dumps({
  'apiVersion': 'v1', 'kind': 'Secret',
  'metadata': {'name': 'ca-vmx-tls-cert', 'namespace': 'mm-smart-attendance'},
  'type': s.get('type', 'kubernetes.io/tls'), 'data': s['data']
}))" | kubectl apply -f -
```

3. Apply the ArgoCD Application and verify sync + PVC binding:

```bash
kubectl apply -f argocd/application.yaml
kubectl get application mm-smart-attendance -n argocd
kubectl get pvc,pv,deploy,pods,svc,ing -n mm-smart-attendance -o wide
```

---

## Temporary Live Edits via PersistentVolume (No Pod Restart)

The Deployment mounts `PersistentVolumeClaim/mm-smart-attendance-pvc` (StorageClass `local-path`, provisioner `rancher.io/local-path`) at `/usr/share/nginx/html`. An `initContainer` (`seed-static-assets`) automatically populates `/usr/share/nginx/html` from `/opt/mm-static` when the PV is empty or when the image `APP_VERSION` changes, while preserving manual PV edits across restarts on the same image tag.

### 1. Locate the Dynamic PV Subdirectory on the Node (`backend.test.com`)

```bash
PV_NAME=$(kubectl get pvc mm-smart-attendance-pvc -n mm-smart-attendance -o jsonpath='{.spec.volumeName}')
PV_HOST_DIR=$(kubectl get pv "$PV_NAME" -o jsonpath='{.spec.hostPath.path}')
echo "Host PV directory: $PV_HOST_DIR"
ls -la "$PV_HOST_DIR"
```

*(By default under Rancher `local-path-provisioner`, this resolves to `/k8s-storage/<pv-name>_mm-smart-attendance_mm-smart-attendance-pvc`.)*

### 2. Apply Temporary Changes Without Restarting the Pod

**Option A — Edit directly on the Kubernetes node host path:**

```bash
# Example: edit HTML/CSS/JS inside the host PV subdirectory
sudo vi "$PV_HOST_DIR/index.html"
# Ensure files remain world-readable for the container's nginx worker user (UID 101)
sudo chmod -R a+rX "$PV_HOST_DIR"
```

**Option B — Copy updated files from your workstation via `kubectl cp`:**

```bash
POD=$(kubectl get pod -n mm-smart-attendance -l app=mm-smart-attendance -o jsonpath='{.items[0].metadata.name}')
kubectl cp ./src/index.html mm-smart-attendance/"$POD":/usr/share/nginx/html/index.html
```

Nginx reads directly from the mounted PV directory, so changes take effect **immediately on the next HTTP request without restarting the pod**.

### 3. Revert Temporary PV Edits Back to GitOps Image Defaults

To discard temporary host changes and re-seed from the active container image:

```bash
sudo rm -f "$PV_HOST_DIR/.image-version"
kubectl rollout restart deployment/mm-smart-attendance -n mm-smart-attendance
```

### 4. Promote Temporary Changes Permanently (GitOps)

1. Copy/apply the tested changes back into `src/` in this Git repository.
2. Bump the version tag (e.g., `v1.0.2` -> `v1.0.3`) in `Dockerfile` and `k8s/deployment.yaml` (`image:` and `APP_VERSION` env var).
3. Build & push the new Docker image (`v1.0.3`), then `git commit` and `git push origin main`.
4. ArgoCD detects the new revision, recreates the pod, sees `.image-version != v1.0.3`, refreshes the PV automatically, and brings the new version live.
