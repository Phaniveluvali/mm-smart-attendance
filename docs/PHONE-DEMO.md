# Live geofence demo on a real phone

The phone app only lets the employee check in or out when **all** location checks pass:
inside the work-zone geofence, real GPS (no fake-GPS app), GPS accuracy good enough, and a trusted phone.
Until then the Check In button is grey and locked, and it says why (for example *Outside work zone · 1.2 km*).
Tapping it while locked shows the blocked screen with the reasons and a reference number, and the attempt
appears on the portal under **Approvals → Anti-fraud audit log**. The photo step only opens once the checks pass.

---

## 1. One thing to know first: phones only share GPS and camera over a secure (https) link

The demo server on the laptop is plain `http://`. A laptop browser on `localhost` is fine, but a **phone**
opening `http://192.168.x.x:8080` will refuse GPS and camera. Pick one of these:

**Option A – Android phone with Chrome (no installs, 2 minutes)**
1. On the phone, open Chrome and go to `chrome://flags`
2. Search for **Insecure origins treated as secure**
3. Enter the laptop address, e.g. `http://192.168.1.25:8080` (the server window prints it), set it to **Enabled**
4. Tap **Relaunch**. GPS and camera now work for that address.

**Option B – any phone, including iPhone (needs a small free tool on the laptop)**
1. Install Cloudflare's `cloudflared` on the laptop
2. With the demo running, open a terminal and run `cloudflared tunnel --url http://localhost:8080`
3. It prints an `https://….trycloudflare.com` link. Open `<that link>/mobile.html` on the phone.
   This also works over mobile data, not just the same Wi-Fi. (Only demo data passes through it.)

## 2. Open the app on the phone like a real app
- Laptop: double-click `Start-Demo.bat`. Phone and laptop on the same Wi-Fi (for Option A).
- Phone: open `http://<laptop-ip>:8080/mobile.html` (or the https link from Option B).
- **Add it to the home screen** so it opens full-screen with its own icon:
  Chrome → ⋮ → **Add to Home screen** / **Install app** · iPhone Safari → Share → **Add to Home Screen**.
- If the phone cannot reach the laptop, allow port 8080 through Windows Firewall for private networks.

## 3. At the venue: put the work zone where you are standing (before the client arrives)
1. Laptop → portal → **Locations & Geofences** → **Muttrah Municipal Office** (Ahmed's work site)
2. Click **Use my current location** – the geofence jumps to the laptop's position.
   (Laptop positions from Wi-Fi can be off by a few hundred metres – if so, simply **drag the shape** onto the building on the map.)
3. Indoors, GPS is often ±20–50 m: set **Min GPS accuracy** to **50 m** so the phone is not locked for a weak signal.
4. **Save** – phones use it immediately.

## 4. The demo
1. Phone: sign in (Ahmed, Face ID). Tap ⚙ → Location → **Real GPS**, allow location.
2. **Inside the zone** → *Inside geofence · Muttrah Municipal Office*, Check In is green → take the photo → *Checked in successfully*.
3. **Show the lock** – any of these:
   - **Live from the portal (best):** drag the geofence a few hundred metres away and **Save**. Within a second or two the phone
     switches to *Outside geofence · … from Muttrah Municipal Office* and the button locks. Drag it back → it unlocks again.
   - Walk out of the building (more than ~100 m).
   - No GPS available? ⚙ → **1.2 km outside the fence** simulates it.
4. Tap the locked button → **Check-in blocked** with the failed checks and reference → portal **Approvals → Anti-fraud audit log** shows the attempt.
5. Other checks you can switch on from ⚙: fake-GPS app, weak GPS, rooted phone, developer mode, unregistered phone.

## 5. About an APK
A real Android APK has to be built with the Android SDK, which is not on this laptop. Two ways to get one:
- **Quickest:** host the app on an https address (for example the Option B link), open it in **PWABuilder** (pwabuilder.com) and download the Android package it generates.
- **Full build:** wrap the app with Capacitor and build it in Android Studio (needs Android Studio + JDK, a few GB).

For the client demo, the home-screen app from step 2 looks and behaves like an installed app, with no store or sideloading needed.
