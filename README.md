# MM Smart Attendance – GitOps Managed Static Deployment

Static web deployment of the **Muscat Municipality Smart Attendance** demo (Demo console, Mobile PWA, and Operations Web Portal) served via Nginx on Kubernetes, exposed over HTTPS via Ingress-Nginx, and managed continuously by ArgoCD.

## Architecture & Live Endpoints

- **Engine**: ArgoCD GitOps Operator (`prune: true`, `selfHeal: true`)
- **Target Namespace**: `mm-smart-attendance`
- **Container Image**: `krishnaveluvali/mm-smart-attendance:v1.0.1` (`nginx:1.27-alpine`)
- **Public URLs** (TLS via `ca-vmx-tls-cert`):
  - Demo console (Mobile + Portal side-by-side): `https://tecnics-internal.online/mm-smartattendance/`
  - Mobile app (PWA): `https://tecnics-internal.online/mm-smartattendance/mobile.html`
  - Operations Web Portal: `https://tecnics-internal.online/mm-smartattendance/portal.html`
- **Ingress Routing**: Subpath `/mm-smartattendance` (`Prefix`) on `tecnics-internal.online` so `bas` (`/`), `eauction` (`/seller-buyer`, `/api`, `/auth`, `/ws`), `argocd`, `monitoring`, and `voltmx` remain unaffected.

## Repository Layout

```
mm-smart-attendance/
├── src/                         # Static web root copied into Nginx
│   ├── index.html               # Split demo console (mobile + portal iframes)
│   ├── mobile.html              # Employee mobile PWA
│   ├── portal.html              # Operations & HR web portal
│   ├── manifest.webmanifest     # PWA manifest
│   ├── assets/                  # Icons, Muscat Municipality logo, banners
│   ├── css/                     # Stylesheets (base.css, portal.css)
│   └── js/                      # Client-side demo engine, charts, branding, UI
├── docs/                        # Original application & phone demo guides
├── nginx/
│   └── default.conf             # Subpath rewrite, gzip, caching, security headers, /healthz
├── Dockerfile                   # Stateless nginx:1.27-alpine container image
├── k8s/                         # Declarative Kubernetes Kustomize manifests (no Helm)
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   └── kustomization.yaml
└── argocd/
    └── application.yaml         # ArgoCD Application manifest
```

## Build & Local Test

```bash
docker build -t krishnaveluvali/mm-smart-attendance:v1.0.1 -t krishnaveluvali/mm-smart-attendance:latest .
docker run -d -p 18089:80 --name mm-test krishnaveluvali/mm-smart-attendance:v1.0.1
curl -i http://localhost:18089/healthz
curl -i http://localhost:18089/mm-smartattendance/
docker rm -f mm-test
```
