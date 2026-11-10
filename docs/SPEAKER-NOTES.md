# MM Smart Attendance – Demo Speaker Notes

Speaker notes for each screen of the mobile app and the web portal. Each screen has:

- **Say:** the talking points, written to be read aloud or paraphrased.
- **Show:** what to tap or click while you talk.
- **Key message:** the one thing the client should remember.

---

## Before you present

**Setup checklist**

1. Start the demo server with `Start-Demo.bat` and keep its window open. If it's closed, the phone and portal can't sign in.
2. Open `index.html` (the demo console). It shows the phone on the left and the portal on the right, both sharing one live database.
3. If you want clean data, click **Reset demo data**.
4. Presenting away from a Muscat site? On the phone, tap **⚙** and choose **Inside Muttrah office**. The app uses real GPS by default, so far from the site every check-in would be correctly blocked.
5. For a real phone, connect it to the same Wi-Fi and open `http://<laptop-IP>:8080/mobile.html`.

**Suggested order (about 25–30 minutes)**

| Time | Section |
|------|---------|
| 2 min | Mobile login, then the home screen |
| 6 min | Check-in: inside the zone, outside the zone, fake GPS |
| 3 min | Offline check-in and sync |
| 6 min | Field task: assign it in the portal, then do it on the phone |
| 3 min | Requests and approvals |
| 6 min | Portal tour: dashboard, attendance, geofences, shifts, reports, audit |
| 3 min | Questions |

**Tip:** the ⚙ button on the phone opens the demo controls (location, fake GPS, airplane mode, clock). Use it openly. It's a presenter tool, not part of the employee app.

---

# Part 1 – Mobile app (employee)

## 1. Login

**Say:** "This is the app every field and office employee installs. Staff sign in with Face ID or fingerprint, with no password to forget or share. The app is bound to the employee's registered phone, so a colleague can't check in for someone else from another device. It is fully bilingual. One tap switches the whole app to Arabic, right-to-left."

**Show:**
- Tap **Sign in with Face ID**.
- Switch **EN / عربي** and back.
- Optional: in ⚙, choose **Unregistered phone** to show the device-binding block.

**Key message:** one person, one registered phone. Buddy-punching is blocked from the very first screen.

## 2. Home

**Say:** "After sign-in, the employee lands on their day."
- "At the top is today's shift, with its start and end times."
- "Next is the attendance card: one button to check in or check out, showing worked hours so far."
- "Below that are today's tasks, each with its time and status."
- "At the bottom are services: requests, history, notifications."
- "The services shown here are controlled from the portal, so the municipality can switch features on or off for everyone without releasing a new app."

**Show:**
- Scroll from the shift card down to the task list.
- Point out the greeting, the Arabic/English pill and the notification bell.

**Key message:** everything the employee needs today is on one screen.

## 3. Check in / Check out

**Say:** "When the employee taps Check In, the app runs security checks in real time."
- **Inside the zone:** "Are they inside their work zone's geofence?"
- **Real location:** "Is the location genuine, with no fake-GPS app running?"
- **GPS accuracy:** "Is the reading accurate enough?"
- **Registered phone:** "Is this their registered phone?"

"The time comes from the server, not the phone, so changing the phone's clock achieves nothing."

"They also take a live photo of the work location. It's camera only, with no gallery upload, and it's stamped with the time and GPS."

**Show:**
- Tap **Check In** and take the photo.
- Show the green confirmation with **server time** and the passed security checks.
- Optional: switch to the portal (**Approvals → Time entries**) to show the same entry with its photo.

**Key message:** you can only check in from the right place, at the real time, from your own phone, with photo proof.

## 4. Check-in blocked

**Say:** "Now let's try to cheat. If I'm 1.2 km outside the zone, the check-in is refused. The employee sees exactly why, with a reference number. The attempt itself is recorded for the supervisor. If they run a fake-GPS app, the app detects the mock location and blocks it with the code LOC_MOCK. Employees aren't left stuck: from here they can request remote work or a correction, which goes to their supervisor."

**Show:**
- ⚙ → **1.2 km outside the fence**, then **Check In**: blocked, with reasons and a reference.
- ⚙ → back inside plus **Fake-GPS app running**, then **Check In**: blocked with **LOC_MOCK**.
- Point to **Request remote work** and **Request correction**.

**Key message:** every failed attempt is blocked, explained and logged. Nothing is silently lost.

## 5. Offline queue

**Say:** "Field staff often lose signal: basements, remote sites, desert roads. If the phone is offline, the check-in is still recorded on the phone with its GPS position and time, and joins this Offline queue. Entries are sent in order as soon as signal returns. The server then re-checks the location and time of each one, so going offline is not a loophole. The entry then goes to the supervisor for approval."

**Show:**
- ⚙ → **Inside Muttrah office** plus **Airplane mode**, then **Check In**. The entry appears in the **Offline queue** on Home, marked "Waiting to sync".
- Turn airplane mode off. It syncs automatically, or tap **Sync now**.
- Show it arriving in the portal under **Approvals → Time entries**.

**Key message:** it works without signal, but it never trusts the phone blindly.

## 6. Tasks (list)

**Say:** "Supervisors assign field work from the portal: inspections, cleaning, maintenance. It appears here instantly. Each task shows its location, priority and time: now, starts at, or overdue. Tapping **Start** only opens the task. Nothing starts automatically, and the employee must start the job themselves at the site."

**Show:**
- Open **Tasks**.
- Point out the time badges.
- Tap **Start** on a task to open it.

**Key message:** the day's field work in one ordered list, live from the supervisor.

## 7. Task screen (the geo-verified field visit)

**Say:** "This is the core of field operations. The task has a live map showing the employee's position and the task's geofence. The employee can only start the job when the phone is physically inside the task location. That check runs in real time, and it's mandatory. Outside the zone, the screen says how far away they are and the Start button stays locked.

"Tasks follow their order. If an earlier task is blocked because the employee can't reach it, the next task is allowed, and the skipped one is recorded for the supervisor. Only one task can be in progress at a time.

"During the job they complete the checklist and add photos. Like check-in, photos are camera only and stamped with time and GPS. Then they complete the task, and it goes to the supervisor for sign-off."

**Show:**
1. With real GPS away from the site, show the locked state and the distance message.
2. ⚙ → **At the task site**, and watch it change to "Location verified".
3. Tap **I'm at the site – Start task**.
4. **Add photo**, then **Complete task**.

**Key message:** proof of presence for every job. The work can't be started or completed away from the site.

## 8. Requests and New request

**Say:** "Employees handle their own HR requests from the phone:"
- "missed punch"
- "annual leave, which shows their balance from Oracle HRMS"
- "short permission"
- "remote work"
- "overtime"
- "shift change"

"Each request follows the approval route: supervisor, then HR where needed. A medical certificate can be attached as a document."

**Show:** **Requests → + New → Missed punch → Submit**. It opens in Pending approval.

**Key message:** no paper forms, and every request has a visible route and status.

## 9. Pending approval

**Say:** "Here the employee sees everything waiting for a decision. That includes requests, time entries and items still waiting to sync. Each one shows where it sits in the approval route, and the employee can send their supervisor a reminder. If something is returned, they see the supervisor's note and can correct it."

**Show:**
- Open the request you just submitted and show the **APPROVAL ROUTE**.
- Tap **Remind my supervisor**.

**Key message:** full transparency for the employee, with no chasing by phone.

## 10. Notifications

**Say:** "When the supervisor approves in the portal, the employee is notified within seconds. Announcements from the municipality also arrive here."

**Show:** approve the request in the portal, then show **Approved** arriving in Notifications on the phone.

**Key message:** the phone and the portal are one live system.

## 11. History (My attendance)

**Say:** "The employee's own record: days present, on-time days, and each punch with its check-in photo, location result and how it was recorded. It's the same data payroll uses, so there are no disputes at month end. From any day they can request a correction."

**Show:**
- Open **History**.
- Tap a day to see its punches and photo.

**Key message:** the employee sees the same truth as HR and payroll.

---

# Part 2 – Web portal (supervisors, HR, management)

## 1. Login

**Say:** "Supervisors, HR and management use the web portal. They sign in with their municipality account through single sign-on (Active Directory). What each person sees depends on their role."

**Show:** **Sign in with SSO**.

**Key message:** one login, role-based access.

## 2. Dashboard

**Say:** "The dashboard is the municipality at a glance."
- "Today's attendance: expected, present, on site, late, absent."
- "The status of field operations: assigned, in progress, completed, delayed."
- "Live field staff on the map."
- "Pending approvals."
- "A recent activity feed."

"It updates live: when the employee checks in on the phone, watch this number change."

**Show:** check in on the phone and watch **Present** and **Recent Activity** update.

**Key message:** real-time visibility, without waiting for end-of-day reports.

## 3. Attendance

**Say:** "This is the full attendance register, live for today or for any past date. For each employee it shows:"
- check in and check out
- hours worked
- whether they were inside the geofence
- status: on time, late, absent or on leave

"Supervisors can filter by department, location or status and export the register. On the side is the geofence activity feed, including blocked attempts."

**Show:**
- Filter by department.
- Click **Export**.
- Point to a **Check-in blocked – Outside Geofence** entry in the feed.

**Key message:** one accurate register, built automatically from verified punches.

## 4. Field Operations

**Say:** "This is the control room for field teams. The live view shows every team member on the map, with their status: in transit, on site or delayed. Selecting a task shows its activity timeline: assigned, travelling, checked in within the geofence, work started, completed. It also shows the live location, notes and photos."

**Show:**
- Open **Live View**.
- Select a task to show its **Activity Timeline**.
- Click **Open in Maps**.

**Key message:** supervisors know where the work is happening, as it happens.

## 5. Tasks (Field dispatch)

**Say:** "Here supervisors create and assign tasks. The location comes straight from the official sites in Locations & Geofences, or from common inspection points. The task appears on the employee's phone immediately.

"Completed tasks come back as **Awaiting your sign-off**. The supervisor reviews the photos and the verified location, then signs off or returns the task with a note. Past and upcoming days are shown read-only."

**Show:**
1. **+ Create task**, assigned to Ahmed, and point out the location list.
2. Show it appear on the phone.
3. Later, open the completed task and click **Sign off**.

**Key message:** dispatch to sign-off in one system, with photo and GPS evidence.

## 6. Employees

**Say:** "This is the employee directory. Profiles sync with HR; adding an employee is shown here for completeness. Type the name in English and the Arabic name fills in automatically. Each profile shows the employee's details, registered device, Active Directory account, shift, assigned location and attendance history. From here HR can reassign a location or role, register or unblock a device, or deactivate an account."

**Show:**
- Open a profile.
- **Add Employee**: type a name and show the Arabic name filling in.

**Key message:** one source of truth for who works where, on which shift, on which device.

## 7. Shifts & Rosters

**Say:** "Rosters are planned here, and changes are dragged and dropped. Shift templates define the working patterns. **Rules & Locks** holds the attendance rules: late tolerance, early-out, when overtime starts and the overtime auto-approve limit. It also holds the monthly locks. Once a month is approved and exported to Oracle Payroll, it's locked permanently so nobody can change the records afterwards."

**Show:**
- Drag a shift in **Roster View** and click **Publish Roster**.
- Open **Rules & Locks**.

**Key message:** the rules are set by the municipality and applied the same way to everyone.

## 8. Locations & Geofences

**Say:** "Every work site is mapped precisely. Site boundaries are imported from the municipality's ArcGIS parcels and converted to GPS coordinates. Admins can draw a polygon or a circle and drag the corners to adjust it. They can also set a buffer zone and the minimum GPS accuracy, and mark a site as permanent or temporary, such as an event site that expires.

"To set up a new site, search for the location by name or coordinates, or use your current location, then save. Phones use the new boundary immediately."

**Show:**
1. Search for "Muttrah Corniche" and pick a result.
2. Drag the shape and click **Save**.
3. Mention **Import from ArcGIS**.

**Key message:** the geofence is the foundation, and it's accurate, editable and live.

## 9. Approvals

**Say:** "Everything that needs a human decision comes here, in four tabs."
- **Waiting for approval:** employee requests and task sign-offs, with evidence next to each one (for example, 'Last GPS inside fence').
- **Time entries:** each employee's daily punches with the check-in photo, the geofence result and device checks. Supervisors approve them individually or in bulk.
- **Anti-fraud audit log:** every blocked or suspicious attempt with its reason code (outside geofence, mock location, low GPS accuracy) and reference number. It can be exported.
- **Decision history:** who decided what, and when. It's a complete audit trail.

**Show:**
1. Approve the missed-punch request.
2. Open **Time entries** to show the photo.
3. Open the audit log and point to **LOC_MOCK**.

**Key message:** every decision is evidence-based and recorded.

## 10. Reports & Analytics

**Say:** "Ready-made reports for every level: an executive dashboard, the monthly attendance summary, late arrivals, leave and absence, and geofence and fraud events. Each one exports to Excel, PDF or CSV and can be scheduled. The data is payroll-ready."

**Show:** open a report and click **Export → Excel**.

**Key message:** reporting takes minutes, not days of spreadsheet work.

## 11. Administration

**Say:** "System administrators manage several things here:"
- users and roles (employee, supervisor, HR admin, operations director, system admin)
- the services shown on the mobile home screen
- integrations with Oracle HRMS, Oracle Payroll, Active Directory and ArcGIS, each with its last sync time and a 'Run now' option

"There are also open APIs, so future municipal systems can connect."

**Show:**
- Show the roles table.
- Show the **Mobile App Services** switches.
- Show the integration status and click **Run now**.

**Key message:** built to integrate with the municipality's existing systems and grow with it.

---

# Closing and likely questions

**Closing line:** "Every check-in and every field visit is proven by location, time, device and photo. Supervisors approve with evidence, and payroll receives clean, locked data. It all happens in real time, in Arabic and English."

**Likely questions**

- **What if there's no signal at the site?** The offline queue records the punch with GPS and time on the phone, and the server re-checks it when it syncs.
- **Can someone fake their location?** Mock-location apps are detected and blocked (LOC_MOCK). GPS accuracy is checked, and every attempt is logged.
- **Can someone check in for a colleague?** No. Biometric sign-in plus device binding: one person, one registered phone.
- **Can photos be uploaded from the gallery?** No. Photos are camera only and stamped with time and GPS.
- **What about indoor or weak GPS?** Each site has a buffer zone and a minimum-accuracy setting. Check-in is allowed only when the whole accuracy circle is inside the zone.
- **How does it connect to payroll?** Approved attendance and overtime are exported to Oracle Payroll, and the month is then locked permanently.
- **Who maintains the site boundaries?** They're imported from ArcGIS and can be adjusted or added in the portal, including a location search. Changes go to phones immediately.
