# MM Smart Attendance – working demo (POC)

A working mobile app and web portal for the Muscat Municipality Smart Attendance technical demo.
It follows the 12 POC screens and the live demo flow in the Technical Guide. Both apps share one live
database, so anything done on the phone shows in the portal straight away, and the other way round.

## Start it (Windows, nothing to install)

1. Double-click **`Start-Demo.bat`**.
   - It starts a small local server (`serve.ps1`, plain PowerShell) and opens the **demo console**.
   - The first time, Windows Firewall may ask about PowerShell. Click **Allow** so a phone on the same Wi-Fi can connect.
2. The demo console (`http://localhost:8080/`) shows the **phone on the left** and the **portal on the right**,
   with the 12-step demo script underneath the phone.
3. To use a **real phone**, connect it to the same Wi-Fi as the laptop and open the address printed in the
   server window, for example `http://192.168.1.25:8080/mobile.html`. Then use "Add to Home Screen"
   to get an app icon.

No server? You can also open `index1.html` (demo console) directly from the folder. Everything still works, but only inside that one browser.

| Page | URL |
|---|---|
| Demo console (phone + portal side by side) | `/index1.html` |
| Mobile app | `/mobile.html` |
| Web portal | `/` (index.html) |

## Demo on a real phone (real GPS)

Phones only allow GPS and camera on a secure link, and check-in stays locked until the phone is inside the work-zone geofence. See **PHONE-DEMO.md** for the 5-minute setup (Android Chrome setting or an https tunnel), how to move the geofence to the venue, and the demo script.

## Branding and maps
- The portal follows the Muscat Municipality screen designs (green theme, banners, skyline art).
- The logo, banners and login scene are SVG drawings. To use the official artwork, drop these files into `assets/` and they replace the drawings automatically:
  `mm-logo.png` (official logo, transparent PNG), `login-hero.jpg` (login page photo), `banner.jpg` (page banner photo).
- Maps use the Esri ArcGIS basemap (no API key needed) and need internet access. Offline, a simple drawn map is shown instead.

## Sample data
- 2,000 employees, as in the proposal: 19 named people plus generated staff across 11 departments and 6 sites.
- Every count on every screen comes from these records: KPIs, charts, map bubbles, approvals and site staff numbers.
- Today's attendance, about 175 field tasks, about 30 pending requests and a few blocked check-in attempts are generated on each new day.

## Demo logins (sample data)
- **Mobile:** employee **104582 – Ahmed Al Amri** (prefilled). Any password works, or tap **Sign in with Face ID**.
  The demo phone is registered to Ahmed.
- **Portal:** the login page is prefilled for **Ahmed Al Busaidi (H & Operations Director)**. Click **Sign In** or **Sign in with SSO**.
  The user menu at the top right switches to **Fatma Al Balushi (HR Admin)** or **Salim Al Hinai (Supervisor)**, or signs out.

## Demo controls (the ⚙ button on the phone)
| Control | What it shows |
|---|---|
| Location: inside / 1.2 km outside / at the task site / real GPS | Geofence check-in, blocked check-in, task proximity |
| Fake-GPS app, weak GPS (48 m), rooted, developer mode | Anti-fraud checks, each with its own reason code |
| Phone clock +47 min | Server time is used, logged as `TIME_SKEW` |
| Unregistered phone | Device binding: sign-in blocked, logged as `DEVICE_UNBOUND` |
| Airplane mode | Offline queue. Turn it off and the queue syncs; the server re-checks every record |
| Demo clock: morning (07:28) / real time | Keeps the "on time / late" story the same whatever time you present |

Turning on real airplane mode on a real phone also works while the app is open: the server can't be
reached, so actions are queued until the connection comes back.

**Reset demo data:** use the button in the demo console, the ⚙ sheet on the phone, or the portal user menu.

## Live demo flow (as in the Technical Guide)
1. Login with Face ID → switch EN / عربي
2. Check in inside the fence → confirmation with server time
3. ⚙ → 1.2 km outside → Check in → blocked, with reasons and reference `FR-…`
4. ⚙ → inside + Fake-GPS → blocked `LOC_MOCK`
5. Requests → Missed punch → Submit → Portal › Approvals → Approve → phone shows **Approved**
6. ⚙ → Airplane mode → punch → turn it off → syncs and the server re-checks
7. Portal › Field dispatch › + Create task (Ahmed) → appears on the phone
8. Phone: Accept → ⚙ at the task site → On-site check-in → Start → Add photo → Complete
9. Portal: card "Awaiting your sign-off" → review photos and location → Sign off
10. Shifts & roster (drag a shift) · Geofences (drag polygon corners → Save)
11. Dashboard KPIs and live activity → Export Excel / PDF / CSV
12. Approvals & audit → anti-fraud log with reason codes → Export to CSV

## What is real and what is simulated
- **Real:** both user interfaces, English/Arabic RTL, the geofence maths (point-in-polygon, buffer, distance),
  the server-side rule engine (geofence, mock GPS, accuracy, integrity, server time, task proximity),
  the offline queue with unique IDs and duplicate protection, approvals and their effects (a corrected
  punch, leave on the roster), roster editing, payroll locks, geofence editing, the camera with
  time/GPS-stamped photos, the exports (Excel/CSV files, PDF through the print dialog), and live sync
  between the phone and the portal.
- **Simulated for the demo:** Face ID (an animation), device integrity and fake-GPS signals (set from the
  ⚙ sheet), and the Oracle HRMS / Payroll / AD / ArcGIS / SMS calls (the "Run now" buttons update their
  status and the sync log). The rules engine runs in shared JavaScript (`js/core.js`). In the proposed
  solution this lives in the .NET services, with Oracle, Flutter and Angular.

Notes:
- The camera needs HTTPS or `localhost`. On a phone opened over `http://<IP>`, **Add photo → Open camera**
  uses the phone's camera app instead, and **Use sample photo** always works.
- Real GPS on a phone also needs HTTPS. Over plain Wi-Fi HTTP, use the ⚙ location presets.
- Sample data only: Muscat sites and Arabic employee names, as recommended in the guide.

## Files
```
Start-Demo.bat      one-click start
serve.ps1           static server + shared demo database (data/db.json)
index.html          web portal (opens at the site root)
index1.html         demo console (phone + portal + demo script)
mobile.html         employee / field worker app (installable PWA)
js/core.js          data, sync, rules engine, Arabic translations, icons
js/mobile.js        mobile app
js/portal.js        portal
css/base.css        shared design tokens
```
