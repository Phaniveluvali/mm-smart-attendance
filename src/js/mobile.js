/* MM Smart Attendance – mobile app (employee / field worker) */
(function () {
  'use strict';
  const { t, esc, icon: I } = MM;
  if (new URLSearchParams(location.search).has('embed')) document.body.classList.add('embed');

  /* ---------- device-local state (secure storage on a real phone) ---------- */
  const DEVKEY = 'mmsa.device.v1';
  const dev = Object.assign({
    deviceId: 'DEV-AHMED-IPHONE', session: null, queue: [], lastSync: null, seen: {}, read: {}, lastTaskId: 'TSK-2291',
    demo: { loc: 'inside', mock: false, weak: false, rooted: false, devMode: false, skew: false, offline: false, unreg: false },
  }, safeParse(localStorage.getItem(DEVKEY)));
  function safeParse(s) { try { return JSON.parse(s) || {}; } catch (e) { return {}; } }
  function saveDev() { try { localStorage.setItem(DEVKEY, JSON.stringify(dev)); } catch (e) { toast(t('Storage full'), '', 'bad'); } }

  const ui = { screen: dev.session ? 'home' : 'login', stack: [], busy: false, overlay: null, taskTab: 'active', form: null, taskErr: null, blockRes: null, loginErr: null, syncing: false, reqFilter: 'all', nFilter: 'all', hMonth: 0, hDay: null, tsFilter: 'pending' };
  let realPos = null, pendingRender = false;

  MM.addAR({
    'Storage full': 'التخزين ممتلئ', 'Services': 'الخدمات', 'Smart Attendance & Field Operations': 'الحضور الذكي والعمليات الميدانية', 'Check in at your work site, receive field tasks and submit requests from your phone.': 'سجّل حضورك في موقع عملك، واستلم المهام الميدانية، وقدّم طلباتك من هاتفك.', 'Welcome Back': 'مرحباً بعودتك', 'Sign in to record attendance and field work': 'سجّل الدخول لتسجيل الحضور والعمل الميداني', 'A Greener, Smarter Muscat Together': 'معاً نحو مسقط أكثر خضرة وذكاءً', 'This system is for authorized Muscat Municipality users only. All activities are monitored and logged.': 'هذا النظام مخصص لمستخدمي بلدية مسقط المصرح لهم فقط. جميع الأنشطة مراقبة ومسجلة.', 'Location cannot be verified': 'لا يمكن التحقق من الموقع', 'Outside zone': 'خارج النطاق', 'from': 'من', 'security checks failed at': 'فحوصات أمان فشلت في',
    'Online · synced': 'متصل · متزامن', 'actions queued': 'إجراءات بالانتظار', 'Tap to view sync status': 'اضغط لعرض حالة المزامنة',
    'Open camera': 'فتح الكاميرا', 'Waiting for camera…': 'بانتظار الكاميرا…', 'Camera not available in this browser': 'الكاميرا غير متاحة في هذا المتصفح',
    'Pending · HR': 'قيد الانتظار · الموارد البشرية', 'Request saved offline': 'حُفظ الطلب دون اتصال', 'Signed in': 'تم تسجيل الدخول',
    'Task updates': 'تحديثات المهام', 'Punches': 'البصمات', 'Account': 'الحساب', 'Registered phone': 'الهاتف المسجل', 'Sync log': 'سجل المزامنة',
    'Check-in and check-out': 'الحضور والانصراف', 'accepted': 'مقبول', 'blocked': 'محظور', 'Real GPS unavailable – using demo location': 'GPS غير متاح – يتم استخدام موقع العرض',
    'Notes saved': 'تم حفظ الملاحظات', 'Task closed – sent for sign-off': 'تم إغلاق المهمة – أُرسلت للاعتماد', 'Photo added': 'تمت إضافة الصورة',
    'Sign out?': 'تسجيل الخروج؟', 'Your phone stays registered to you.': 'يبقى هاتفك مسجلاً باسمك.', 'Demo: simulate conditions on this phone': 'العرض: محاكاة ظروف هذا الهاتف',
    'Security': 'الأمان', 'Network': 'الشبكة', 'Clock': 'الساعة', 'Reset all demo data?': 'إعادة ضبط جميع بيانات العرض؟', 'Status': 'الحالة',
    'Late': 'متأخر', 'min late': 'دقيقة تأخير', 'Remote work request': 'طلب عمل عن بعد', 'Check-in outside work zone': 'تسجيل حضور خارج نطاق العمل',
    // home / check-in
    'Attendance': 'الحضور', 'Open check-in': 'فتح شاشة الحضور', 'In zone': 'داخل النطاق', 'Out of zone': 'خارج النطاق', 'Location unverified': 'الموقع غير موثق', "TODAY'S ATTENDANCE": 'حضور اليوم',
    'Day off today': 'يوم راحة اليوم', 'Checked in at': 'سجّلت الحضور الساعة', 'Checked out at': 'سجّلت الانصراف الساعة', 'Not checked in yet': 'لم تسجّل الحضور بعد', 'Worked': 'ساعات العمل',
    'Pending approval': 'بانتظار الموافقة', 'Open tasks': 'مهام مفتوحة', 'Unread': 'غير مقروءة', 'Latest from HR & manager': 'آخر الرسائل من الموارد البشرية والمدير', 'View all': 'عرض الكل',
    'New request': 'طلب جديد', 'My attendance': 'سجل حضوري', 'Notifications': 'الإشعارات', 'Check in / Check out': 'الحضور / الانصراف', 'Grace': 'سماح', 'Geofence': 'النطاق', 'Device': 'الجهاز', 'Server time': 'وقت الخادم',
    'TODAY': 'اليوم', 'Shift starts': 'تبدأ الوردية', 'Shift ends': 'تنتهي الوردية', 'Worked today': 'ساعات العمل اليوم', 'so far': 'حتى الآن', 'Forgot to punch? Request a correction': 'نسيت التسجيل؟ اطلب تصحيحاً',
    'just now': 'الآن', 'min ago': 'د مضت', 'h ago': 'س مضت', 'Just submitted': 'أُرسل للتو', 'Waiting': 'بانتظار',
    // requests
    'My requests': 'طلباتي', 'requests': 'طلبات', 'awaiting approval': 'بانتظار الموافقة', 'New': 'جديد', 'requests pending approval': 'طلبات بانتظار الموافقة', 'request pending approval': 'طلب بانتظار الموافقة', 'Track where each one is': 'تابع مرحلة كل طلب',
    'on hold': 'محجوزة', 'All': 'الكل', 'No requests here': 'لا توجد طلبات', 'Leave': 'إجازة', 'Short permission': 'استئذان', 'Remote work': 'عمل عن بعد', 'Missed punch': 'بصمة فائتة', 'Overtime': 'عمل إضافي', 'Shift change': 'تغيير وردية',
    'Annual, sick or emergency': 'سنوية أو مرضية أو طارئة', 'Leave early or come late': 'خروج مبكر أو حضور متأخر', 'Work outside your zone': 'العمل خارج نطاقك', 'Fix a missing check-in/out': 'تصحيح حضور أو انصراف فائت',
    'REQUEST TYPE': 'نوع الطلب', 'Punch': 'البصمة', 'Actual time': 'الوقت الفعلي', 'Balance': 'الرصيد', 'day': 'يوم', 'Briefly explain the reason': 'اشرح السبب باختصار', 'Attach medical certificate': 'إرفاق شهادة طبية', 'Attach file (optional)': 'إرفاق ملف (اختياري)',
    'APPROVAL ROUTE': 'مسار الموافقة', 'You': 'أنت', 'Final approval': 'الموافقة النهائية', 'With HR': 'لدى الموارد البشرية', 'With supervisor': 'لدى المشرف', 'Waiting to sync': 'بانتظار المزامنة', 'Saved on this phone': 'محفوظ على هذا الهاتف',
    'Submitted': 'أُرسل', 'Supervisor review': 'مراجعة المشرف', 'Endorsed': 'تمت التزكية', 'HR approval': 'موافقة الموارد البشرية', 'After supervisor review': 'بعد مراجعة المشرف', 'Decision': 'القرار', 'You will get a notification': 'سيصلك إشعار',
    'Sends automatically when you are back online': 'يُرسل تلقائياً عند عودة الاتصال', 'request awaiting a decision': 'طلب بانتظار القرار', 'requests awaiting a decision': 'طلبات بانتظار القرار', 'Reminder sent': 'تم إرسال التذكير', 'Send reminder': 'إرسال تذكير', 'Details': 'التفاصيل',
    'Nothing waiting for approval': 'لا شيء بانتظار الموافقة', 'Requests you submit will show here until they are decided.': 'تظهر طلباتك هنا حتى يتم البت فيها.', 'Reference': 'المرجع', 'Type': 'النوع', 'When': 'التاريخ', 'Attachment': 'المرفق', 'Assigned when synced': 'يُحدد عند المزامنة',
    'Saved on this phone – sends when you are back online': 'محفوظ على الهاتف – يُرسل عند عودة الاتصال', 'Endorsed by your supervisor · waiting for HR': 'زكّاه المشرف · بانتظار الموارد البشرية', 'Waiting for': 'بانتظار', 'by': 'من', 'Track approval': 'تتبع الموافقة',
    'You are offline': 'أنت غير متصل', 'Try again when you have signal': 'حاول مجدداً عند توفر الإشارة',
    // notifications & history
    'Announcement': 'إعلان', 'unread': 'غير مقروءة', 'All caught up': 'لا جديد', 'Mark all read': 'تعليم الكل كمقروء', 'Manager': 'المدير', 'System': 'النظام', 'HR': 'الموارد البشرية', 'Yesterday': 'أمس', 'Earlier': 'سابقاً', 'No notifications': 'لا توجد إشعارات',
    'In': 'دخول', 'Out': 'خروج', 'No camera on this device – use a demo photo': 'لا توجد كاميرا في هذا الجهاز – استخدم صورة تجريبية', 'Photos are taken live with the camera and stamped with time and GPS. Uploads are not allowed.': 'تُلتقط الصور مباشرة بالكاميرا وتُختم بالوقت والموقع. لا يُسمح بالرفع.', 'Location is turned off on this device – switch on Location (on Windows: Settings → Privacy → Location) and try again': 'الموقع مغلق على هذا الجهاز – شغّل خدمة الموقع (في ويندوز: الإعدادات ← الخصوصية ← الموقع) ثم حاول مجدداً', 'Still waiting for your location – allow location for this site and make sure Location is switched on for the device': 'ما زلنا ننتظر موقعك – اسمح بالوصول إلى الموقع لهذا الموقع الإلكتروني وتأكد من تشغيل خدمة الموقع في الجهاز', 'Allow location access when the browser asks': 'اسمح بالوصول إلى الموقع عندما يطلب المتصفح', 'You are offline – this check-in was not added to the offline queue.': 'أنت غير متصل – لم تُضف هذه البصمة إلى قائمة الانتظار.', 'Offline check-ins are only saved when you are inside your work zone. They then wait in the queue and sync when the signal returns.': 'تُحفظ بصمات الحضور دون اتصال فقط عندما تكون داخل نطاق عملك، ثم تنتظر في القائمة وتُزامن عند عودة الإشارة.', 'You are offline. Check-ins and check-outs you make now are saved on this phone and listed here until they sync.': 'أنت غير متصل. تُحفظ بصمات الحضور والانصراف على هذا الهاتف وتظهر هنا حتى تتم مزامنتها.', 'Offline queue': 'قائمة الانتظار دون اتصال', 'time entry': 'سجل وقت', 'time entries': 'سجلات وقت', 'Details': 'التفاصيل', 'saved on this phone': 'محفوظ على الهاتف', 'Queued': 'بالانتظار', 'Syncing…': 'جارٍ المزامنة…', 'other action waiting (tasks / requests)': 'إجراء آخر بالانتظار (مهام / طلبات)', 'other actions waiting (tasks / requests)': 'إجراءات أخرى بالانتظار (مهام / طلبات)', 'Sent in this order when the signal returns. The server re-checks the location and time of each entry, then it goes to your supervisor for approval.': 'تُرسل بهذا الترتيب عند عودة الإشارة. يعيد الخادم التحقق من الموقع والوقت لكل سجل، ثم يُرسل إلى مشرفك للاعتماد.', 'Waiting to sync': 'بانتظار المزامنة', 'Saved on this phone – sent for approval when you are back online': 'محفوظ على الهاتف – يُرسل للاعتماد عند عودة الاتصال', 'OTHER ACTIONS WAITING': 'إجراءات أخرى بالانتظار', 'No other actions waiting': 'لا توجد إجراءات أخرى بالانتظار', 'Good Morning': 'صباح الخير', 'Good Afternoon': 'مساء الخير', 'Good Evening': 'مساء الخير', 'Day off': 'يوم راحة', 'Work Zone': 'نطاق العمل', 'Start your day – Check In': 'ابدأ يومك – سجّل الحضور', 'Records your working hours at your work zone.': 'يسجّل ساعات عملك في نطاق عملك.', 'Day complete': 'اكتمل اليوم', 'No attendance needed today': 'لا حاجة لتسجيل الحضور اليوم', 'Worked': 'ساعات العمل', "Today's Tasks": 'مهام اليوم', 'Done': 'منجزة', 'View All': 'عرض الكل', 'Show less': 'عرض أقل', 'Pending Approval': 'بانتظار الموافقة', 'Unread Messages': 'رسائل غير مقروءة', 'New Request': 'طلب جديد', 'My Attendance': 'حضوري', 'Messages': 'الرسائل', 'My Requests': 'طلباتي', 'Finish the task in progress first': 'أنهِ المهمة الجارية أولاً', 'One task at a time.': 'مهمة واحدة في كل مرة.', 'is in progress.': 'قيد التنفيذ.', 'You are at the location of': 'أنت في موقع', 'do that task first.': 'نفّذ تلك المهمة أولاً.', 'Earlier task skipped for now': 'تم تخطي مهمة سابقة مؤقتاً', 'you are not at its location': 'لست في موقعها', 'It stays in your To do list. Go back to it when you reach its location.': 'تبقى في قائمة المهام. عد إليها عند وصولك إلى موقعها.', "Using this phone's GPS": 'يستخدم GPS هذا الهاتف', 'Demo location': 'موقع تجريبي', 'simulated': 'محاكى', 'not your real position': 'ليس موقعك الحقيقي', 'Use my real GPS': 'استخدم موقعي الحقيقي', 'Go to the task location to start': 'اذهب إلى موقع المهمة للبدء', 'unlocks automatically within': 'يُفتح تلقائياً ضمن', 'Location verified': 'تم التحقق من الموقع', 'm from the task location': 'م من موقع المهمة', 'LIVE': 'مباشر', 'You are at the task location': 'أنت في موقع المهمة', 'You are not at the task location': 'أنت لست في موقع المهمة', 'Allow location access to continue': 'اسمح بالوصول إلى الموقع للمتابعة', 'zone': 'النطاق', 'You are': 'أنت على بعد', 'from the task location': 'من موقع المهمة', 'Fake-GPS app detected – location cannot be trusted': 'تم اكتشاف تطبيق موقع وهمي – لا يمكن الوثوق بالموقع', 'No GPS location yet. ': 'لا يوجد موقع GPS بعد. ', 'Move to open sky and try again.': 'انتقل إلى مكان مفتوح وحاول مجدداً.', 'Check out': 'تسجيل الانصراف', 'Next': 'التالية', 'Starts after': 'تبدأ بعد', 'Finish the previous task first': 'أنهِ المهمة السابقة أولاً', 'Tasks are done in order. Next you need to complete': 'تُنفّذ المهام بالترتيب. عليك أولاً إنهاء', 'Complete': 'أكمل', 'first – tasks are done in order.': 'أولاً – تُنفّذ المهام بالترتيب.', 'Start': 'ابدأ', 'Start task': 'ابدأ المهمة', 'My day': 'يومي', 'Start your day – check in': 'ابدأ يومك – سجّل الحضور', 'When you reach your work zone': 'عند وصولك إلى نطاق عملك', 'This records your working hours.': 'يسجّل هذا ساعات عملك.', "Do today's tasks": 'نفّذ مهام اليوم', 'done': 'منجزة', 'Go to each location at its time and tap “Start task” when you arrive.': 'اذهب إلى كل موقع في وقته واضغط «بدء المهمة» عند وصولك.', 'Check in first – then start each task when you reach its location.': 'سجّل الحضور أولاً، ثم ابدأ كل مهمة عند وصولك إلى موقعها.', 'No tasks assigned for today': 'لا توجد مهام لليوم', 'See all tasks': 'عرض كل المهام', 'End your day – check out': 'أنهِ يومك – سجّل الانصراف', 'worked': 'عملت', 'When your work is finished': 'عند انتهاء عملك', 'shift ends': 'تنتهي الوردية', 'After your tasks are done': 'بعد إنجاز مهامك', 'Starts': 'تبدأ', 'Starts in': 'تبدأ خلال', 'Now': 'الآن', 'until': 'حتى', 'Overdue': 'متأخرة', 'past due': 'تجاوزت الموعد', 'Signed off': 'معتمدة', 'Check in for your shift first': 'سجّل حضور الوردية أولاً', 'Tasks are started after you check in for the day.': 'تبدأ المهام بعد تسجيل حضورك لليوم.', 'Available from': 'متاحة من', 'This task is scheduled for': 'موعد هذه المهمة', "I'm at the site – Start task": 'وصلت إلى الموقع – ابدأ المهمة', 'Works only when you are inside the task location': 'يعمل فقط عندما تكون داخل موقع المهمة', 'Report delay': 'الإبلاغ عن تأخير', 'Complete task': 'إنهاء المهمة', 'Resume task': 'استئناف المهمة', 'Scheduled': 'الموعد', 'Started at site': 'بدأت في الموقع', 'Each task has its own place and time': 'لكل مهمة مكانها ووقتها', 'To do': 'قيد التنفيذ', 'priority': 'أولوية', 'Task started': 'بدأت المهمة', 'You are at the site': 'أنت في الموقع', 'Locked': 'مقفل', 'Outside work zone': 'خارج نطاق العمل', 'GPS signal too weak': 'إشارة GPS ضعيفة', 'Getting your GPS location…': 'جارٍ تحديد موقعك…', 'Locating…': 'جارٍ التحديد…', 'Location not available': 'الموقع غير متاح', 'Location needs a secure (https) link on phones': 'يتطلب الموقع رابطاً آمناً (https) على الهواتف', 'This browser has no GPS access': 'لا يملك هذا المتصفح وصولاً إلى GPS', 'Location permission is off – allow it in the browser': 'إذن الموقع مغلق – اسمح به في المتصفح', 'No GPS fix yet – move near a window or outdoors': 'لا توجد إشارة GPS بعد – اقترب من نافذة أو اخرج', 'Check-in unlocks automatically when you are inside your work zone.': 'يُفتح تسجيل الحضور تلقائياً عند دخولك نطاق عملك.', 'Check-in photo': 'صورة الحضور', 'Take a photo of your work location to check in. Your supervisor sees it when approving your time.': 'التقط صورة لموقع عملك لتسجيل الحضور. يراها المشرف عند اعتماد وقتك.', 'm from site': 'م من الموقع', 'Returned': 'مُعاد', 'In progress': 'قيد التنفيذ', 'Your time entries': 'سجلات وقتك', 'approver': 'المعتمد', 'of worked time is waiting for approval. Approved days go to payroll.': 'من ساعات العمل بانتظار الموافقة. الأيام المعتمدة تُرسل للرواتب.', 'entries need your action': 'سجلات تحتاج إجراءً منك', 'entry needs your action': 'سجل يحتاج إجراءً منك', 'Returned by your supervisor': 'أعادها المشرف', 'Approved by': 'اعتمده', 'Returned by': 'أعاده', 'note': 'ملاحظة', 'Sent for approval after check-out': 'يُرسل للاعتماد بعد الانصراف', 'submitted': 'أُرسل', 'Correction submitted – waiting for review': 'تم إرسال التصحيح – بانتظار المراجعة', 'Corrected – waiting for re-approval': 'تم التصحيح – بانتظار إعادة الاعتماد', 'Nothing returned': 'لا توجد سجلات معادة', 'No time entries': 'لا توجد سجلات', 'Your daily check-in and check-out times are reviewed by your supervisor.': 'يراجع المشرف أوقات حضورك وانصرافك اليومية.', 'Supervisor approval': 'اعتماد المشرف', 'Starts after you check out': 'يبدأ بعد تسجيل الانصراف', 'Recorded on your phone': 'سُجّل على هاتفك', 'Geofence and device checks passed': 'اجتازت فحوصات النطاق والجهاز', 'Submitted for approval': 'أُرسل للاعتماد', 'After check-out': 'بعد الانصراف', 'Payroll': 'الرواتب', 'Included in this month’s payroll': 'مُدرج في رواتب هذا الشهر', 'Approved days are sent to Oracle Payroll': 'تُرسل الأيام المعتمدة إلى نظام الرواتب', 'Submit correction': 'إرسال تصحيح', 'Remind my supervisor': 'تذكير المشرف', 'Not started': 'لم يبدأ', 'Check in to start today’s entry': 'سجّل الحضور لبدء سجل اليوم', 'On leave': 'في إجازة', 'Absent': 'غائب', 'Missing check-out': 'انصراف غير مسجل', 'Days present': 'أيام الحضور', 'Absent / missing': 'غياب / نقص', 'Off': 'راحة', 'Request correction': 'طلب تصحيح', 'Punch history': 'سجل البصمات', 'No records this month': 'لا توجد سجلات هذا الشهر',
  });

  /* ---------- helpers ---------- */
  const db = () => MM.db();
  const me = () => dev.session && MM.empById(dev.session.empId);
  const mySite = () => me() && MM.siteById(me().siteId);
  const online = () => !dev.demo.offline && navigator.onLine !== false && MM.S.reachable;
  const FIXED_INSIDE = { muttrah: { lat: 23.61721, lng: 58.56505 } };
  const myTasks = () => db().tasks.filter(x => x.assignee === dev.session.empId);
  const taskById = id => db().tasks.find(x => x.id === id);
  const today0 = () => MM.dayStart();
  const myPunches = () => db().punches.filter(p => p.empId === dev.session.empId).sort((a, b) => a.time - b.time);
  const lastPunch = () => { const p = myPunches(); return p[p.length - 1]; };
  const checkedIn = () => { const p = lastPunch(); return p && p.type === 'IN' && p.time >= today0(); };

  function getPos() {
    const d = dev.demo; let p;
    if (d.loc === 'real') { if (realPos) p = Object.assign({}, realPos); else { const c = MM.siteCenter(mySite()); return { lat: c.lat, lng: c.lng, acc: 9999, nofix: true }; } }
    else if (d.loc === 'outside') { const c = FIXED_INSIDE[me().siteId] || MM.siteCenter(mySite()); p = { lat: c.lat - 0.0085, lng: c.lng - 0.0085, acc: 11 }; }
    else if (d.loc === 'task') { const tk = taskById(dev.lastTaskId) || myTasks()[0]; p = tk ? { lat: tk.lat + 0.000317, lng: tk.lng, acc: 7 } : { lat: 0, lng: 0, acc: 7 }; }
    else { const c = FIXED_INSIDE[me().siteId] || MM.siteCenter(mySite()); p = { lat: c.lat + 0.00011, lng: c.lng + 0.00009, acc: 6 }; }
    if (d.weak) p.acc = 48;
    return p;
  }
  let gpsErr = null, gpsWatch = null;
  let gpsStall = null;
  function startRealGps() {
    gpsErr = null;
    if (!window.isSecureContext) { gpsErr = t('Location needs a secure (https) link on phones'); toast(t('Location not available'), gpsErr, 'bad'); render(); return; }
    if (!navigator.geolocation) { gpsErr = t('This browser has no GPS access'); toast(t('Location not available'), gpsErr, 'bad'); render(); return; }
    if (gpsWatch != null) navigator.geolocation.clearWatch(gpsWatch);
    const take = g => { gpsErr = null; clearTimeout(gpsStall); realPos = { lat: g.coords.latitude, lng: g.coords.longitude, acc: Math.round(g.coords.accuracy) }; scheduleRender(); };
    const fail = e => {
      if (realPos && e.code !== 1) return; // keep the last good fix while the next one is on its way
      gpsErr = e.code === 1 ? t('Location permission is off – allow it in the browser')
        : e.code === 2 ? t('Location is turned off on this device – switch on Location (on Windows: Settings → Privacy → Location) and try again')
        : t('No GPS fix yet – move near a window or outdoors');
      if (e.code === 1) toast(t('Location not available'), gpsErr, 'bad');
      scheduleRender();
    };
    // 1) a quick first fix from Wi-Fi / mobile network (usually under a second), 2) then precise GPS updates
    navigator.geolocation.getCurrentPosition(g => { if (!realPos || g.coords.accuracy < realPos.acc) take(g); }, fail, { enableHighAccuracy: false, maximumAge: 60000, timeout: 10000 });
    gpsWatch = navigator.geolocation.watchPosition(take, fail, { enableHighAccuracy: true, maximumAge: 3000, timeout: 30000 });
    // explain a long wait instead of showing "Getting your GPS location…" forever
    clearTimeout(gpsStall);
    gpsStall = setTimeout(() => { if (!realPos && !gpsErr) { gpsErr = t('Still waiting for your location – allow location for this site and make sure Location is switched on for the device'); scheduleRender(); } }, 12000);
    if (navigator.permissions && navigator.permissions.query) navigator.permissions.query({ name: 'geolocation' }).then(p => {
      const upd = () => { if (realPos) return; if (p.state === 'prompt') { gpsErr = t('Allow location access when the browser asks'); scheduleRender(); } else if (p.state === 'denied') { gpsErr = t('Location permission is off – allow it in the browser'); scheduleRender(); } else if (p.state === 'granted' && gpsErr) { startRealGps(); } };
      upd(); p.onchange = upd;
    }).catch(() => { });
  }

  function toast(title, body, kind) {
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || 'ok');
    el.innerHTML = I(kind === 'bad' ? 'ban' : kind === 'warn' ? 'alert' : kind === 'info' ? 'bell' : 'check', 20) + '<div><b>' + esc(title) + '</b>' + (body ? '<span>' + esc(body) + '</span>' : '') + '</div>';
    document.getElementById('toasts').appendChild(el);
    MM.arabizeDigits(el);
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 3800);
  }

  function go(screen, opts) { if (ui.screen !== screen) ui.stack.push(ui.screen); ui.screen = screen; Object.assign(ui, opts || {}); ui.taskErr = null; render(); scrollTop(); }
  function back() { ui.screen = ui.stack.pop() || 'home'; ui.taskErr = null; render(); scrollTop(); }
  function tab(screen) { ui.stack = []; ui.screen = screen; ui.taskErr = null; render(); scrollTop(); }
  function scrollTop() { const s = document.querySelector('.screen'); if (s) s.scrollTop = 0; }

  /* ---------- labels ---------- */
  const STATUS = { assigned: ['Assigned', 'gray'], ontheway: ['On the way', 'blue'], onsite: ['On site', 'info'], inprogress: ['In progress', 'info'], delayed: ['Delayed', 'warn'], done: ['Awaiting sign-off', 'ok'], signed: ['Signed off', 'ok'] };
  function reqTitle(r) {
    const ar = MM.lang === 'ar';
    switch (r.type) {
      case 'short': return t('Short permission') + ' · ' + r.hours + ' ' + t('h');
      case 'leave': return t(r.leaveType || 'Annual leave') + ' · ' + r.days + ' ' + t(r.days === 1 ? 'day' : 'days');
      case 'remote': return t('Remote work');
      case 'missed': return t('Missed punch') + ' · ' + t(r.punchType === 'IN' ? 'Check-in' : 'Check-out') + ' ' + r.time;
      case 'overtime': return t('Overtime');
    }
    return r.type;
  }
  function reqSub(r) {
    if (r.type === 'leave') return r.from === r.to ? r.from : r.from.replace(/ \w+ \d+$/, '') + ' – ' + r.to;
    return MM.fmtDate(r.date || r.created);
  }
  function reqBadge(r) {
    if (r.status === 'approved') return '<span class="badge ok">' + t('Approved') + '</span>';
    if (r.status === 'rejected') return '<span class="badge bad">' + t('Rejected') + '</span>';
    if (r.queued) return '<span class="badge warn">' + t('Queued') + '</span>';
    return '<span class="badge warn">' + t(r.stage === 'hr' ? 'Pending' : 'Pending') + '</span>';
  }
  const initials = e => MM.lang === 'ar' ? e.nameAr.charAt(0) : e.name.split(' ').filter(w => w.length > 2 || w === 'Al').map(w => w[0]).filter((c, i, a) => i === 0 || i === a.length - 1).join('');
  function greeting() { const h = new Date(MM.now()).getHours(); return t(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'); }

  /* ---------- render ---------- */
  function scheduleRender() {
    const a = document.activeElement;
    if (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && document.getElementById('app').contains(a)) { pendingRender = true; return; }
    render();
  }
  let lastHtml = null;
  // minimal DOM patcher: walks old and new trees side by side and changes only what differs
  function morph(from, to) {
    const a = from.childNodes, b = to.childNodes;
    for (let i = 0; i < b.length; i++) {
      const nb = b[i], na = a[i];
      if (!na) { from.appendChild(nb.cloneNode(true)); continue; }
      if (na.nodeType !== nb.nodeType || na.nodeName !== nb.nodeName || (na.nodeType === 1 && na.id !== nb.id)) { from.replaceChild(nb.cloneNode(true), na); continue; }
      if (na.nodeType === 3 || na.nodeType === 8) { if (na.nodeValue !== nb.nodeValue) na.nodeValue = nb.nodeValue; continue; }
      if (na.nodeType !== 1) continue;
      // a map slot must never reuse an element that held other content (its children are skipped below)
      const slotNew = nb.hasAttribute('data-mmap') || nb.hasAttribute('data-tmap'), slotOld = na.hasAttribute('data-mmap') || na.hasAttribute('data-tmap');
      if (slotNew !== slotOld || (slotNew && na.getAttribute('data-tmap') !== nb.getAttribute('data-tmap'))) { from.replaceChild(nb.cloneNode(true), na); continue; }
      // attributes
      for (const at of [...na.attributes]) if (!nb.hasAttribute(at.name)) na.removeAttribute(at.name);
      for (const at of [...nb.attributes]) if (na.getAttribute(at.name) !== at.value) na.setAttribute(at.name, at.value);
      // live form values (never overwrite a field the user is typing in)
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(na.nodeName) && na !== document.activeElement) {
        if (na.type === 'checkbox' || na.type === 'radio') na.checked = nb.hasAttribute('checked');
        else if (na.type !== 'file') { const v = na.nodeName === 'TEXTAREA' ? nb.textContent : nb.getAttribute('value') || ''; if (na.nodeName !== 'SELECT' && na.value !== v) na.value = v; }
      }
      // map slots hold a live Leaflet map that isn't part of the template – leave their children alone
      if (na.hasAttribute('data-mmap') || na.hasAttribute('data-tmap')) continue;
      if (na.nodeName === 'SELECT') { if (na.innerHTML !== nb.innerHTML) { na.innerHTML = nb.innerHTML; } const s = nb.querySelector('option[selected]'); if (s && na !== document.activeElement) na.value = s.value; continue; }
      morph(na, nb);
    }
    while (a.length > b.length) from.removeChild(from.lastChild);
  }
  function render() {
    pendingRender = false;
    const app = document.getElementById('app');
    const sc = document.querySelector('.screen'); const st = sc ? sc.scrollTop : 0;
    let html;
    if (!dev.session || !me()) html = vLogin();
    else html = ({ home: vHome, attend: vAttend, blocked: vBlocked, tasks: vTasks, task: vTask, requests: vRequests, newreq: vNewReq, pending: vPending, notifs: vNotifs, history: vHistory, sync: vSync }[ui.screen] || vHome)();
    html += vOverlay();
    if (dev.session) html += '<button class="demo-fab" data-act="demo" title="Demo controls">' + I('sliders', 19) + '</button>';
    else html += '<button class="demo-fab low" data-act="demo" title="Demo controls">' + I('sliders', 19) + '</button>';
    // Patch the page in place instead of replacing it: only text/attributes that changed are touched,
    // so images, the bottom bar, open sheets and the camera don't redraw (no flicker on every GPS fix / sync)
    if (html !== lastHtml) {
      lastHtml = html;
      const tpl = document.createElement('div'); tpl.innerHTML = html; MM.arabizeDigits(tpl);
      if (!app.firstChild) { while (tpl.firstChild) app.appendChild(tpl.firstChild); } else morph(app, tpl);
    }
    const sc2 = document.querySelector('.screen'); if (sc2 && sc === null) sc2.scrollTop = 0; else if (sc2 && sc2 !== sc) sc2.scrollTop = st;
    mountMap();
    mountTaskMap();
    if (ui.overlay && ui.overlay.type === 'camera') attachCamera();
  }

  /* ---------- live check: is the phone inside the task's location? (re-evaluated on every GPS update) ---------- */
  const DEMO_LOC_NAME = { inside: 'Inside Muttrah office', outside: '1.2 km outside the fence', task: 'At the task site (35 m)' };
  function taskGeo(x) {
    const pos = getPos(), r = x.radius || 100, maxAcc = Math.max(r, 50);
    if (pos.nofix) return { pos, nofix: true, inside: false, why: gpsErr || t('Getting your GPS location…') };
    const dist = Math.round(MM.haversine(pos, { lat: x.lat, lng: x.lng }));
    const why = dev.demo.mock ? t('Fake-GPS app detected – location cannot be trusted') : dist - pos.acc > r ? t('You are') + ' ' + MM.fmtDist(dist) + ' ' + t('from the task location') : pos.acc > maxAcc ? t('GPS signal too weak') + ' (±' + Math.round(pos.acc) + ' ' + t('m') + ')' : dist > r ? t('You are') + ' ' + MM.fmtDist(dist) + ' ' + t('from the task location') : '';
    return { pos, dist, r, inside: !why, why };
  }
  let taskMap = null;
  function mountTaskMap() {
    const slot = document.querySelector('[data-tmap]'); if (!slot) return;
    const x = taskById(slot.dataset.tmap); if (!x || !window.L) return;
    const tg = taskGeo(x), col = tg.inside ? '#0E6B3E' : '#D92D20';
    if (!taskMap) {
      const el = document.createElement('div'); el.className = 'lmap'; slot.appendChild(el);
      const map = L.map(el, { zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: false });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' }).addTo(map);
      taskMap = { el, map, layer: L.layerGroup().addTo(map), key: null };
    } else slot.appendChild(taskMap.el);
    const m = taskMap; m.map.invalidateSize(false); m.layer.clearLayers();
    L.circle([x.lat, x.lng], { radius: x.radius || 100, color: '#0E6B3E', weight: 2.5, fillOpacity: .18 }).addTo(m.layer);
    L.marker([x.lat, x.lng], { icon: L.divIcon({ html: '<div class="mk-task">' + I('pin', 16, 2.4) + '</div>', className: '', iconSize: [28, 28], iconAnchor: [14, 26] }) }).addTo(m.layer);
    if (!tg.nofix) {
      if (!tg.inside) L.polyline([[tg.pos.lat, tg.pos.lng], [x.lat, x.lng]], { color: col, weight: 2, dashArray: '5 6' }).addTo(m.layer);
      L.circle([tg.pos.lat, tg.pos.lng], { radius: Math.min(tg.pos.acc || 10, 200), color: col, weight: 1, fillOpacity: .08 }).addTo(m.layer);
      L.marker([tg.pos.lat, tg.pos.lng], { icon: L.divIcon({ html: '<div class="mk-me' + (tg.inside ? '' : ' bad') + '"></div>', className: '', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(m.layer);
    }
    const key = x.id + '|' + (tg.nofix ? 'nofix' : tg.inside ? 'in' : 'out') + '|' + (tg.nofix ? '' : tg.pos.lat.toFixed(4) + tg.pos.lng.toFixed(4));
    if (m.key !== key) { m.key = key; const pts = [[x.lat, x.lng]].concat(tg.nofix ? [] : [[tg.pos.lat, tg.pos.lng]]); if (pts.length > 1) m.map.fitBounds(pts, { padding: [36, 36], maxZoom: 17 }); else m.map.setView(pts[0], 16); }
  }

  /* real map in the geofence card (Esri basemap, offline fallback = drawing) */
  let homeMap = null;
  function mountMap() {
    const slot = document.querySelector('[data-mmap]'); if (!slot) return;
    const g = geoState(); const inside = g.inside && !dev.demo.mock;
    if (!window.L) { slot.innerHTML = geoMap(g); return; }
    if (!homeMap) {
      const el = document.createElement('div'); el.className = 'lmap'; slot.appendChild(el);
      const map = L.map(el, { zoomControl: false, attributionControl: true, scrollWheelZoom: false, tap: false });
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' }).addTo(map);
      homeMap = { el, map, layer: L.layerGroup().addTo(map), key: null };
    } else slot.appendChild(homeMap.el);
    const m = homeMap, s = g.site, c = MM.siteCenter(s);
    m.map.invalidateSize(false); m.layer.clearLayers();
    const col = '#0E6B3E';
    if (s.shape === 'circle') { L.circle([c.lat, c.lng], { radius: s.radius + s.buffer, color: col, weight: 1.5, dashArray: '5 5', fill: false }).addTo(m.layer); L.circle([c.lat, c.lng], { radius: s.radius, color: col, weight: 2.5, fillOpacity: .22 }).addTo(m.layer); }
    else L.polygon(s.polygon.map(p => [p.lat, p.lng]), { color: col, weight: 2.5, dashArray: '6 5', fillOpacity: .22 }).addTo(m.layer);
    if (!inside) L.polyline([[g.pos.lat, g.pos.lng], [c.lat, c.lng]], { color: '#D92D20', weight: 2, dashArray: '5 6' }).addTo(m.layer);
    L.marker([g.pos.lat, g.pos.lng], { icon: L.divIcon({ html: '<div class="mk-me' + (inside ? '' : ' bad') + '"></div>', className: '', iconSize: [18, 18], iconAnchor: [9, 9] }) }).addTo(m.layer);
    const key = s.id + '|' + (inside ? 'in' : 'out') + '|' + g.pos.lat.toFixed(4) + g.pos.lng.toFixed(4);
    if (m.key !== key) { m.key = key; const pts = (s.shape === 'circle' ? [[c.lat, c.lng]] : s.polygon.map(p => [p.lat, p.lng])).concat([[g.pos.lat, g.pos.lng]]); m.map.fitBounds(pts, { padding: [28, 28], maxZoom: 17 }); }
  }

  function vNav(active) {
    const n = myTasks().filter(x => !['done', 'signed'].includes(x.status)).length;
    const b = (k, ic, label, cnt) => '<button class="' + (active === k ? 'on' : '') + '" data-act="tab" data-arg="' + k + '"><span class="ni">' + I(ic, 21) + '</span>' + (cnt ? '<span class="cnt">' + cnt + '</span>' : '') + t(label) + '</button>';
    return '<nav class="nav">' + b('home', 'home', 'Home') + b('attend', 'fingerprint', 'Attendance') + b('tasks', 'list', 'Tasks', n) + b('requests', 'file', 'Requests', myPending().length) + b('history', 'history', 'History') + '</nav>';
  }
  /* ---------- notifications, requests, history data ---------- */
  const myNotifs = () => db().notifications.filter(n => n.to === dev.session.empId || n.to === 'all').sort((a, b) => b.time - a.time);
  const isUnread = n => !dev.read[n.id] && n.time >= MM.dayStart() - 864e5;
  const unreadCount = () => myNotifs().filter(isUnread).length;
  const myRequests = () => db().requests.filter(r => r.empId === dev.session.empId).concat(dev.queue.filter(q => q.kind === 'request').map(q => Object.assign({ queued: true, id: q.uuid }, q.req))).sort((a, b) => b.created - a.created);
  const myPending = () => myRequests().filter(r => r.status === 'pending');
  const SENDER = {
    hr: { name: 'HR Department', ar: 'إدارة الموارد البشرية', icon: 'building', cls: 'hr' },
    manager: { name: 'Salim Al Hinai', ar: 'سالم الهنائي', role: 'Supervisor', icon: 'user', cls: 'mg', init: 'SH' },
    system: { name: 'Smart Attendance', ar: 'الحضور الذكي', icon: 'bell', cls: 'sy' },
  };
  const nTitle = n => MM.lang === 'ar' ? (n.titleAr || n.textAr || n.text) : (n.title || n.text);
  const nText = n => n.title ? (MM.lang === 'ar' ? n.textAr || n.text : n.text) : '';
  const REQ_ICON = { leave: 'plane', short: 'clock', remote: 'home2', missed: 'fingerprint', overtime: 'clock', shift: 'swap' };
  const REQ_LBL = { leave: 'Leave', short: 'Short permission', remote: 'Remote work', missed: 'Missed punch', overtime: 'Overtime', shift: 'Shift change' };
  const waited = ms => { const m = Math.round((MM.now() - ms) / 60000); return m < 2 ? t('Just submitted') : t('Waiting') + ' ' + (m < 60 ? m + ' ' + t('min') : Math.round(m / 60) + ' ' + t('h')); };
  function ago(ms) { const m = Math.max(0, Math.round((MM.now() - ms) / 60000)); if (m < 1) return t('just now'); if (m < 60) return m + ' ' + t('min ago'); const h = Math.round(m / 60); if (h < 24) return h + ' ' + t('h ago'); return MM.relDay(ms); }
  function workedMs(i, o) { return i ? Math.max(0, (o ? o.time : MM.now()) - i.time) : 0; }
  const hm = ms => Math.floor(ms / 3600e3) + t('h') + ' ' + MM.pad(Math.floor(ms % 3600e3 / 60000)) + t('m');
  function todayPunches() { const d0 = MM.dayStart(); const ps = myPunches().filter(p => p.time >= d0); return { i: ps.find(p => p.type === 'IN'), o: ps.filter(p => p.type === 'OUT').pop() }; }
  function shiftInfo() {
    const e = me(), d0 = db(); const code = MM.shiftToday(d0, e.id), sh = d0.shifts[code] || d0.shifts.M;
    return { code, sh, label: (MM.lang === 'ar' ? sh.ar : sh.name), time: sh.from ? sh.from + ' – ' + sh.to : '' };
  }
  function langSeg() { return '<div class="langseg"><button class="' + (MM.lang === 'en' ? 'on' : '') + '" data-act="lang" data-arg="en">' + I('globe', 16) + 'English</button><i></i><button class="' + (MM.lang === 'ar' ? 'on' : '') + '" data-act="lang" data-arg="ar">العربية</button></div>'; }
  function topbar(title, sub, right) {
    return '<div class="topbar"><button class="iconbtn" data-act="back" aria-label="' + t('Back') + '"><span class="flip">' + I('back', 22) + '</span></button><div style="flex:1;min-width:0">' + (sub ? '<div class="sub">' + sub + '</div>' : '') + '<h1>' + title + '</h1></div>' + (right || '') + '</div>';
  }

  /* LOGIN */
  function vLogin() {
    const unreg = dev.demo.unreg, ar = MM.lang === 'ar';
    return '<div class="screen mlogin"><div class="ml-hero"><div class="ml-bg" style="background-image:url(assets/login-bg.webp)"></div><div class="ml-veil"></div>' +
      '<div class="ml-top">' + (window.MMB ? MMB.logo(.62) : '') + langSeg() + '</div>' +
      '<div class="ml-txt"><h1>' + (ar ? esc(t('Smart Attendance & Field Operations')) : 'Smart Attendance <em>&amp;</em><br>Field Operations') + '</h1><span class="ml-bar"></span>' +
      '<p>' + t('Check in at your work site, receive field tasks and submit requests from your phone.') + '</p>' +
      '</div></div>' +
      '<div class="ml-card"><h3>' + t('Welcome Back') + '</h3><p class="d">' + t('Sign in to record attendance and field work') + '</p>' +
      (ui.loginErr ? '<div class="errbox">' + I('ban', 18) + '<div><b>' + t('Sign-in blocked') + '</b><br>' + esc(ui.loginErr) + '</div></div>' : '') +
      '<label class="fld"><span>' + I('user', 14) + t('Employee ID or AD username') + '</span><div class="fi">' + I('user', 18) + '<input class="keep-ltr" id="lgId" value="104582" autocomplete="username" inputmode="numeric"></div></label>' +
      '<label class="fld"><span>' + I('lock', 14) + t('Password') + '</span><div class="fi">' + I('lock', 18) + '<input id="lgPw" type="password" value="demo-pass" autocomplete="current-password"></div></label>' +
      '<button class="ml-signin" data-act="login">' + (ui.busy ? '<span class="spin"></span>' : t('Sign in') + ' <span class="flip">' + I('arrow', 18) + '</span>') + '</button>' +
      '<div class="ml-or"><span></span>' + t('or') + '<span></span></div>' +
      '<button class="ml-face" data-act="faceid">' + I('faceid', 21) + t('Sign in with Face ID') + '</button>' +
      // no disclaimers on the login screen – only a warning when a device check fails (device-binding demo)
      (unreg || dev.demo.rooted || dev.demo.devMode ? '<div class="trust">' + (unreg ? '<span class="bad">' + I('x', 14, 2.5) + t('Unregistered phone') + '</span>' : '') + (dev.demo.rooted || dev.demo.devMode ? '<span class="bad">' + I('x', 14, 2.5) + t('Device check failed') + '</span>' : '') + '</div>' : '') + '</div></div>';
  }

  /* HOME */
  function geoState() {
    const pos = getPos(), site = mySite();
    const out = pos.nofix ? Infinity : MM.distOutside(site, pos);
    const inside = !pos.nofix && out <= site.buffer, devOk = !dev.demo.rooted && !dev.demo.devMode;
    // check-in / check-out stays locked until every location condition is met
    const lockWhy = pos.nofix ? (gpsErr || t('Getting your GPS location…')) : dev.demo.mock ? t('Location cannot be verified') : !inside ? t('Outside work zone') + ' · ' + MM.fmtDist(out) : !devOk ? t('Device check failed') : !MM.accOk(site, pos) ? t('GPS signal too weak') + ' (±' + Math.round(pos.acc) + ' m)' : '';
    return { pos, site, out, inside, devOk, locked: !!lockWhy, lockWhy };
  }
  function geoMap(g) {
    // stylised map: roads, dashed fence, position dot
    const inside = g.inside && !dev.demo.mock;
    const dx = inside ? 200 : 62, dy = inside ? 62 : 96;
    return '<svg viewBox="0 0 400 112" preserveAspectRatio="xMidYMid slice"><rect width="400" height="112" fill="#E8EDEE"/>' +
      '<path d="M0 34 L400 46" stroke="#fff" stroke-width="13"/><path d="M140 0 L172 112" stroke="#fff" stroke-width="11"/><path d="M276 0 L258 112" stroke="#fff" stroke-width="11"/>' +
      '<path d="M152 26 L268 34 L250 102 L166 98 Z" fill="' + (inside ? '#BFDCC9' : '#D4DED8') + '" fill-opacity=".85" stroke="#0E6B3E" stroke-width="2.4" stroke-dasharray="7 5"/>' +
      (inside ? '' : '<path d="M' + (dx + 8) + ' ' + (dy - 6) + ' L160 70" stroke="#D92D20" stroke-width="1.6" stroke-dasharray="4 4"/>') +
      '<circle cx="' + dx + '" cy="' + dy + '" r="15" fill="' + (inside ? '#0E6B3E' : '#D92D20') + '" fill-opacity=".22"/><circle cx="' + dx + '" cy="' + dy + '" r="7.5" fill="' + (inside ? '#0E6B3E' : '#D92D20') + '" stroke="#fff" stroke-width="2.5"/></svg>';
  }
  /* ---------- the employee's day: 1 check in · 2 tasks at their locations and times · 3 check out ---------- */
  const SLOT_MIN = 60, EARLY_MIN = 30;
  const minsTxt = m => m < 60 ? m + ' ' + t('min') : Math.floor(m / 60) + ' ' + t('h') + (m % 60 ? ' ' + (m % 60) + ' ' + t('min') : '');
  const taskWin = x => ({ start: x.start && x.start < x.due ? x.start : x.due - SLOT_MIN * 60000, end: x.due });
  const taskStep = x => ['done', 'signed'].includes(x.status) ? 2 : ['onsite', 'inprogress', 'delayed'].includes(x.status) ? 1 : 0;
  const canStartTask = x => MM.now() >= taskWin(x).start - EARLY_MIN * 60000;
  // where a task stands against the clock (system time)
  function taskTime(x) {
    const n = MM.now(), w = taskWin(x), mins = ms => Math.max(1, Math.round(ms / 60000));
    const dur = ms => { const m = mins(ms); return m < 60 ? m + ' ' + t('min') : Math.floor(m / 60) + ' ' + t('h') + (m % 60 ? ' ' + (m % 60) + ' ' + t('min') : ''); };
    if (taskStep(x) === 2) return { k: 'done', cls: 'ok', label: t(x.status === 'signed' ? 'Signed off' : 'Completed') + (x.completedAt ? ' ' + MM.fmtTime(x.completedAt) : '') };
    if (x.status === 'delayed') return { k: 'active', cls: 'warn', label: t('Delayed') + (x.delayReason ? ' · ' + t(x.delayReason) : '') };
    if (taskStep(x) === 1) return { k: 'active', cls: n > w.end ? 'bad' : 'info', label: t('In progress') + (n > w.end ? ' · ' + t('past due') : '') };
    if (n < w.start - EARLY_MIN * 60000) return { k: 'later', cls: 'gray', label: t('Starts') + ' ' + MM.fmtTime(w.start) };
    if (n < w.start) return { k: 'soon', cls: 'info', label: t('Starts in') + ' ' + dur(w.start - n) };
    if (n <= w.end) return { k: 'now', cls: 'ok', label: t('Now') + ' · ' + t('until') + ' ' + MM.fmtTime(w.end) };
    return { k: 'overdue', cls: 'bad', label: t('Overdue') + ' · ' + dur(n - w.end) };
  }
  const slotTxt = x => { const w = taskWin(x); return MM.fmtTime(w.start) + ' – ' + MM.fmtTime(w.end); };
  const todaysTasks = () => myTasks().filter(x => MM.dayStart(x.due) === MM.dayStart() || taskStep(x) < 2).sort((a, b) => a.due - b.due || (a.id < b.id ? -1 : 1));
  // tasks are done in order: the earlier unfinished task (if any) that must be completed first
  // task order (same rule as the server): one task at a time, in order – but an earlier task that has not been started
  // does not hold up the next one while the employee is not at its location (it is skipped for now and stays in To do)
  const earlierOpen = x => myTasks().filter(y => y.id !== x.id && MM.dayStart(y.due) === MM.dayStart(x.due) && (y.due < x.due || (y.due === x.due && y.id < x.id)) && taskStep(y) < 2).sort((a, b) => a.due - b.due);
  const busyTask = x => myTasks().find(y => y.id !== x.id && taskStep(y) === 1) || null;
  const blockedBy = x => { if (taskStep(x) > 0) return null; const b = busyTask(x); if (b) return b; const pos = getPos(), e = earlierOpen(x); if (pos.nofix || dev.demo.mock) return e[0] || null; return e.find(y => MM.haversine(pos, { lat: y.lat, lng: y.lng }) <= (y.radius || 100)) || null; };
  const skippedFor = x => taskStep(x) > 0 || blockedBy(x) ? [] : earlierOpen(x);
  const tName = x => esc(MM.lang === 'ar' ? x.titleAr : x.title);

  // icon for a task row: food → cutlery, shops / licences / bakeries → shopfront, else the task type's icon
  const taskIcon = x => { const s = (x.title + ' ' + x.type).toLowerCase(); return /food|meal|kitchen|cater/.test(s) ? 'utensils' : /restaurant|bakery|shop|store|outlet|licen|market|souq|mall/.test(s) ? 'store' : (MM.TASK_TYPES[x.type] || 'clipboard'); };
  function greeting() { const h = new Date(MM.now()).getHours(); return t(h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening'); }

  function vHome() {
    const e = me(), g = geoState(), ar = MM.lang === 'ar';
    const { code, sh } = shiftInfo();
    const isIn = checkedIn(), tp = todayPunches(), site = ar ? mySite().nameAr : mySite().name;
    const out = tp.o && tp.i && tp.o.time > tp.i.time ? tp.o : null;
    const un = unreadCount(), pend = timeEntries().filter(x => x.st === 'pending' || x.st === 'returned');
    const tasks = todaysTasks(), done = tasks.filter(x => taskStep(x) === 2).length;
    const dt = new Date(MM.now());
    const night = sh.from && +sh.from.slice(0, 2) >= 17;
    const shiftName = code === 'O' ? t('Day off') : ar ? 'الوردية ' + sh.ar : sh.name + ' Shift';

    // attendance card: check in → check out → day complete
    const s1 = !!tp.i, s3 = !!out;
    const cardIcon = s3 ? 'check' : s1 ? 'clock' : 'pin';
    const cardTitle = code === 'O' ? t('Day off today') : s3 ? t('Day complete') : s1 ? t('Checked in at') + ' <span dir="ltr">' + MM.fmtTime(tp.i.time) + '</span>' : t('Start your day – Check In');
    const cardSub = code === 'O' ? t('No attendance needed today') : s3 ? t('Checked out at') + ' ' + MM.fmtTime(out.time) + ' · ' + t('worked') + ' ' + hm(out.time - tp.i.time)
      : s1 ? t('Worked') + ' ' + hm(workedMs(tp.i)) + (sh.to ? ' · ' + t('shift ends') + ' <span dir="ltr">' + sh.to + '</span>' : '') + (tp.i.late ? ' · <span class="warn-text">' + t('Late') + ' ' + minsTxt(tp.i.late) + '</span>' : '')
      : t('Records your working hours at your work zone.');
    const qd = (tp.i && tp.i.status === 'queued') || (out && out.status === 'queued');
    const showBtn = code !== 'O' && !s3;
    const punchBtn = showBtn ? '<button class="h2-punch' + (g.locked ? ' locked' : isIn ? ' out' : '') + '" data-act="punch"' + (ui.busy ? ' disabled' : '') + '>' + (ui.busy ? '<span class="spin"></span>' : I(g.locked ? 'lock' : isIn ? 'logout' : 'fingerprint', 18)) + '<span>' + t(isIn ? 'Check Out' : 'Check In') + '</span></button><button class="h2-map" data-act="tab" data-arg="attend" aria-label="' + t('Open check-in') + '">' + I('map', 20) + '</button>' : '';

    const taskRow = x => {
      const tt = taskTime(x), st = taskStep(x), blk = st === 0 && blockedBy(x);
      const act = st === 0 ? (blk ? '<span class="h2-next">' + I('lock', 16) + t('Next') + '</span>' : '<button class="h2-start" data-act="tstart" data-arg="' + x.id + '">' + I('play', 15) + t('Start') + '</button>') : '<span class="h2-go flip">' + I('fwd', 18) + '</span>';
      return '<div class="h2-task ' + tt.k + '" role="button" tabindex="0" data-act="open" data-arg="' + x.id + '"><span class="h2-ti">' + I(taskIcon(x), 22) + '</span><span class="h2-tm keep-ltr">' + MM.fmtTime(taskWin(x).start) + '</span><span class="h2-tx"><b>' + esc(ar ? x.titleAr : x.title) + '</b><span class="h2-badge ' + tt.cls + '"><i></i>' + esc(tt.label) + '</span></span>' + act + '</div>';
    };
    const svc = (act, arg, ic, label, cnt) => '<button class="h2-svc" data-act="' + act + '" data-arg="' + arg + '"><span>' + I(ic, 24) + (cnt ? '<b>' + cnt + '</b>' : '') + '</span>' + label + '</button>';

    return '<div class="screen with-nav h2">' + appbar() +
      // greeting + photo of Muscat
      '<div class="h2-hero"><div class="h2-photo" style="background-image:url(assets/home-hero.jpg)"></div><div class="h2-in">' +
      '<div class="h2-greet">' + greeting() + '</div><div class="h2-name">' + esc(ar ? e.nameAr : e.name) + '</div>' +
      '<div class="h2-role">' + I('user', 16) + '<span>' + esc(ar ? e.roleAr : e.role) + ' · <span class="keep-ltr">' + e.id + '</span></span></div>' +
      '<div class="h2-date">' + I('calendar', 15) + '<span>' + MM.fmtDay(MM.now()).slice(0, ar ? 9 : 3) + ', ' + dt.getDate() + ' ' + (ar ? MM.MON_AR : MM.MON)[dt.getMonth()] + ' · <span data-clock class="keep-ltr">' + MM.fmtTimeS(MM.now()) + '</span></span></div></div></div>' +
      // shift + work zone
      '<div class="h2-card h2-shift"><div>' + I(night ? 'moon' : 'sun', 30, 1.6) + '<span><b>' + esc(shiftName) + '</b><small dir="ltr">' + (sh.from && code !== 'O' ? sh.from + ' – ' + sh.to : '—') + '</small></span></div><i></i><div>' + I('pin', 26, 1.7) + '<span><b>' + t('Work Zone') + '</b><small>' + esc(site) + '</small></span></div></div>' +
      offBar() +
      // check in / check out
      '<div class="h2-card h2-att' + (s3 ? ' done' : s1 ? ' in' : '') + '"><div class="h2-attrow"><span class="h2-ai">' + I(cardIcon, 24) + '</span><span class="h2-at"><b>' + cardTitle + '</b><small>' + cardSub + (qd ? ' · <span class="warn-text">' + t('Waiting to sync') + '</span>' : '') + '</small></span>' + (showBtn ? '<span class="h2-ab">' + punchBtn + '</span>' : '') + '</div>' +
      (showBtn && g.locked ? '<div class="h2-lock">' + I('lock', 14) + '<span>' + esc(g.lockWhy) + '</span></div>' : '') + '</div>' +
      queueCard({ link: true }) +
      // today's tasks
      '<div class="h2-sec">' + I('clipcheck', 22) + '<b>' + t("Today's Tasks") + '</b>' + (tasks.length ? '<span class="h2-pill keep-ltr">' + done + ' / ' + tasks.length + ' ' + t('Done') + '</span>' : '') + '<button class="h2-all" data-act="tab" data-arg="tasks">' + t('View All') + ' <span class="flip">' + I('arrow', 16) + '</span></button></div>' +
      (tasks.length ? '<div class="h2-card h2-tasks">' + tasks.slice(0, 5).map(taskRow).join('') + '</div>' : '<div class="h2-card h2-empty">' + t('No tasks assigned for today') + '</div>') +
      // approvals + messages
      '<div class="h2-stats"><button class="amber" data-act="go" data-arg="pending"><span>' + I('clock', 22) + '</span><div><b>' + pend.length + '</b><small>' + t('Pending Approval') + '</small></div><i class="flip">' + I('fwd', 18) + '</i></button>' +
      '<button class="blue" data-act="go" data-arg="notifs"><span>' + I('bell', 22) + '</span><div><b>' + un + '</b><small>' + t('Unread Messages') + '</small></div><i class="flip">' + I('fwd', 18) + '</i></button></div>' +
      // services
      '<div class="h2-sec">' + I('grid', 22) + '<b>' + t('Services') + '</b><button class="h2-all" data-act="svcall">' + t(ui.allSvc ? 'Show less' : 'View All') + ' <span class="flip">' + I('arrow', 16) + '</span></button></div>' +
      '<div class="h2-svcs' + (ui.allSvc ? ' all' : '') + '">' + svc('go', 'newreq', 'fileplus', t('New Request')) + svc('go', 'pending', 'clock', t('Pending Approval'), pend.length) + svc('tab', 'history', 'calendar', t('My Attendance')) +
      db().tiles.filter(x => x.on).map(x => svc('tileinfo', x.key, x.icon, esc(ar ? x.ar : x.label))).join('') + svc('go', 'notifs', 'bell', t('Messages'), un) + svc('tab', 'requests', 'file', t('My Requests')) + '</div>' +
      '</div>' + vNav('home');
  }
  function appbar() {
    const e = me(), ar = MM.lang === 'ar', un = unreadCount();
    return '<div class="appbar h2-bar"><div class="h2-brand">' + (window.MMB ? MMB.logo(.42) : '') + '</div><span class="grow"></span>' +
      '<button class="h2-lang" data-act="lang" data-arg="' + (ar ? 'en' : 'ar') + '">' + I('globe', 17) + '<span class="lg-f">' + (ar ? 'English' : 'العربية') + '</span><span class="lg-s">' + (ar ? 'EN' : 'ع') + '</span><span class="lg-d">' + I('down', 14) + '</span></button>' +
      '<button class="h2-bell" data-act="go" data-arg="notifs" aria-label="' + t('Notifications') + '">' + I('bell', 23) + (un ? '<span>' + Math.min(un, 9) + '</span>' : '') + '</button>' +
      '<button class="h2-av" data-act="profile">' + esc(initials(e)) + '</button></div>';
  }
  function offBar() {
    const qn = dev.queue.length;
    return !online() || qn ? '<button class="offbar' + (online() ? ' sync' : '') + '" data-act="go" data-arg="sync">' + I(online() ? 'refresh' : 'wifioff', 20) + '<span style="flex:1"><b>' + (online() ? t('Online') : t('Offline')) + '</b> · ' + qn + ' ' + t('actions queued') + '</span><span class="flip">' + I('fwd', 18) + '</span></button>' : '';
  }

  /* CHECK-IN / CHECK-OUT */
  function vAttend() {
    const g = geoState(), db0 = db(), ar = MM.lang === 'ar';
    const { code, sh, label, time } = shiftInfo();
    const isIn = checkedIn(), tp = todayPunches(), lp = lastPunch();
    const siteName = ar ? g.site.nameAr : g.site.name;
    const geoOk = g.inside && !dev.demo.mock;
    const status = g.pos.nofix ? ['warn', g.lockWhy] : dev.demo.mock ? ['warn', t('Location cannot be verified')] : g.inside ? ['', t('Inside geofence') + ' · ' + siteName] : ['bad', t('Outside geofence') + ' · ' + MM.fmtDist(g.out) + ' ' + t('from') + ' ' + siteName];
    let late = null;
    if (sh.from && /^\d\d:\d\d$/.test(sh.from)) { const [h, m] = sh.from.split(':').map(Number); const st = new Date(MM.now()); st.setHours(h, m, 0, 0); late = Math.round(((tp.i ? tp.i.time : MM.now()) - st.getTime()) / 60000); }
    const inBadge = code === 'O' ? '<span class="badge gray">' + t('Day off') + '</span>' : tp.i ? (tp.i.late ? '<span class="badge warn">' + t('Late') + ' ' + tp.i.late + ' ' + t('min') + '</span>' : '<span class="badge ok">' + t('On time') + '</span>') : late != null ? (late <= db0.rules.grace ? '<span class="badge ok">' + t('On time') + '</span>' : '<span class="badge warn">' + t('Late') + ' · ' + late + ' ' + t('min') + '</span>') : '';
    const out = tp.o && tp.i && tp.o.time > tp.i.time ? tp.o : null;
    const chk = (ok, l, warn) => '<span class="' + (ok ? 'ok' : warn ? 'warn' : 'bad') + '">' + I(ok ? 'check' : warn ? 'alert' : 'x', 13, 2.6) + l + '</span>';
    return '<div class="screen with-nav"><div class="topbar"><div style="flex:1;min-width:0"><div class="sub">' + MM.fmtDay(MM.now()) + ', ' + MM.fmtDate(MM.now()) + '</div><h1>' + t('Check in / Check out') + '</h1></div><button class="abtn" data-act="go" data-arg="sync" aria-label="Sync">' + I(online() ? 'wifi' : 'wifioff', 20) + '</button></div>' +
      offBar() +
      '<div class="clockcard"><div class="big keep-ltr" data-clock>' + MM.fmtTimeS(MM.now()) + '</div><div class="tzl keep-ltr">' + I('globe', 13) + esc(MM.tz().label) + (db().settings.clock === 'morning' ? ' · ' + t('demo morning clock') : '') + '</div><div class="sh">' + I(code === 'E' || code === 'N' ? 'moon' : 'sun', 15) + esc(label) + (time ? ' · <span dir="ltr">' + time + '</span>' : '') + ' · ' + t('Grace') + ' ' + db0.rules.grace + ' ' + t('min') + '</div></div>' +
      '<div class="card geo"><div class="mapslot" data-mmap></div><div class="info"><div class="st"><span class="dot ' + status[0] + '"></span>' + esc(status[1]) + '</div>' +
      '<div class="chks">' + chk(geoOk, t('Geofence'), dev.demo.mock) + chk(MM.accOk(g.site, g.pos), t('GPS') + ' ±' + Math.round(g.pos.acc) + ' ' + t('m'), true) + chk(g.devOk, t('Device')) + chk(!dev.demo.skew, t('Server time'), true) + '</div></div></div>' +
      '<div class="punch-wrap"><button class="punch ' + (g.locked ? 'locked' : isIn ? 'out' : '') + '" data-act="punch" ' + (ui.busy ? 'disabled' : '') + '>' + (ui.busy ? '<span class="spin" style="width:34px;height:34px;border-width:3.5px"></span><span style="font-size:15px">' + t('Verifying…') + '</span>' : I(g.locked ? 'lock' : 'fingerprint', g.locked ? 34 : 40, 1.8) + '<span>' + t(isIn ? 'Check Out' : 'Check In') + '</span>' + (g.locked ? '<small>' + t('Locked') + '</small>' : '')) + '</button>' + (g.locked ? '<div class="lockmsg">' + I('alert', 16) + '<span>' + esc(g.lockWhy) + '<br><small>' + t('Check-in unlocks automatically when you are inside your work zone.') + '</small></span></div>' : '') +
      '<div class="last">' + (lp ? t('Last punch') + ': ' + MM.relDay(lp.time) + ' ' + MM.fmtTime(lp.time) + ' · ' + t(lp.type === 'IN' ? 'Check-in' : 'Check-out') + (lp.status === 'queued' ? ' · ' + t('queued') : '') : '') + '</div></div>' +
      '<div class="card daytl"><div class="eyebrow" style="margin-bottom:8px">' + t('TODAY') + '</div>' +
      '<div class="tli ' + (tp.i ? 'done' : 'cur') + '"><span class="c">' + I('logout', 15) + '</span><div><b>' + t('Check in') + '</b><small>' + (tp.i ? MM.fmtTime(tp.i.time) + ' · ' + esc(siteName) + (tp.i.offline ? ' · ' + t('offline') : '') : t('Shift starts') + ' ' + (sh.from || '—')) + '</small></div>' + inBadge + (tp.i && tp.i.photo ? thumb(tp.i) : '') + '</div>' +
      '<div class="tli ' + (out ? 'done' : tp.i ? 'cur' : '') + '"><span class="c">' + I('clock', 15) + '</span><div><b>' + t('Check out') + '</b><small>' + (out ? MM.fmtTime(out.time) : t('Shift ends') + ' ' + (sh.to || '—')) + '</small></div>' + (out ? '<span class="badge ok">' + t('Done') + '</span>' : '') + '</div>' +
      '<div class="tli total"><span class="c">' + I('chart', 15) + '</span><div><b>' + t('Worked today') + '</b><small>' + (tp.i ? hm(workedMs(tp.i, out)) + (out ? '' : ' ' + t('so far')) : '—') + '</small></div></div></div>' +
      '<button class="linkrow" data-act="go" data-arg="newreq" data-type="missed">' + I('fingerprint', 18) + '<span>' + t('Forgot to punch? Request a correction') + '</span><span class="flip">' + I('fwd', 16) + '</span></button>' +
      '</div>' + vNav('attend');
  }

  /* CHECK-IN BLOCKED */
  function vBlocked() {
    const r = ui.blockRes; if (!r) return vHome();
    const ar = MM.lang === 'ar';
    const site = ar ? r.site.nameAr : r.site.name;
    const nf = r.checks.filter(c => !c.ok && !c.warn).length || r.checks.filter(c => !c.ok).length;
    const geoFail = !r.checks[0].ok;
    const others = nf - (geoFail ? 1 : 0);
    let msg;
    if (geoFail) msg = t('You are') + ' <b>' + MM.fmtDist(r.outside) + ' ' + t('outside') + '</b> ' + t('your work zone') + ', ' + esc(site) + (others ? (ar ? '، ' : ', ') + t('and') + ' ' + nf + ' ' + t(nf > 1 ? 'security checks failed' : 'security check failed') + '.' : '.');
    else msg = '<b>' + nf + '</b> ' + t(nf > 1 ? 'security checks failed' : 'security check failed') + ' — ' + esc(site) + '.';
    const label = { geo: 'Location inside geofence', mock: 'Real GPS (no mock location)', acc: 'GPS accuracy under', integrity: 'Device integrity', time: 'Server time (NTP)' };
    return '<div class="screen">' + topbar(t('Check in')) +
      '<div class="blockhero"><div class="b">' + I('ban', 34, 2.4) + '</div><h2>' + t('Check-in blocked') + '</h2><p>' + msg + '</p></div>' +
      (!online() ? '<div class="oq-blk">' + I('wifioff', 16) + '<span><b>' + t('You are offline – this check-in was not added to the offline queue.') + '</b> ' + t('Offline check-ins are only saved when you are inside your work zone. They then wait in the queue and sync when the signal returns.') + '</span></div>' : '') +
      '<div class="card checks" style="margin-top:14px"><div class="eyebrow" style="margin-bottom:6px">' + t('SECURITY CHECKS') + '</div>' +
      r.checks.map(c => {
        const s = c.ok ? 'ok' : c.warn ? 'warn' : 'bad';
        return '<div class="chk"><span class="s ' + s + '">' + I(c.ok ? 'check' : c.warn ? 'alert' : 'x', 16, 3) + '</span><div><b>' + t(label[c.k]) + (c.k === 'acc' ? ' ' + r.site.minAcc + ' ' + t('m') : '') + '</b><small>' + esc(ar ? c.detail.ar : c.detail.en) + '</small></div></div>';
      }).join('') + '</div>' +
      '<div class="card refbox" style="margin-top:14px">' + I('shield', 20) + '<span>' + t('This attempt was recorded (ref') + ' <b class="keep-ltr">' + r.ref + '</b>' + t(') and sent to your supervisor for review.') + '</span></div>' +
      '<div style="margin-top:22px;display:grid;gap:10px"><button class="btn primary lg block" data-act="retry">' + t('Retry location') + '</button><button class="btn outline lg block" data-act="remote">' + t('Request remote work') + '</button></div></div>';
  }

  /* SYNC / OFFLINE */
  function vSync() {
    const on = online(), q = dev.queue;
    const ls = dev.lastSync || { time: MM.at(7, 2), rows: 14 };
    const ico = { punch: 'clock', task: 'pin', photo: 'camera', request: 'file' };
    return '<div class="screen">' + topbar(t('Sync status')) +
      '<div class="darkhero' + (on ? ' on' : '') + '">' + I(on ? 'wifi' : 'wifioff', 28, 2) + '<div><b>' + t(on ? "You're online" : "You're offline") + '</b><p>' + (on ? (q.length ? q.length + ' ' + t('actions queued') + '.' : t('All actions are synced with the server.')) : t('Keep working as normal.') + ' ' + q.length + ' ' + t('actions are saved securely on this phone and will sync automatically when the signal returns.')) + '</p></div></div>' +
      queueCard() +
      '<div class="card rows" style="margin-top:14px"><div class="eyebrow" style="margin-bottom:6px">' + t(queuedPunches().length ? 'OTHER ACTIONS WAITING' : 'WAITING TO SYNC') + '</div>' +
      (q.filter(it => it.kind !== 'punch').length ? q.filter(it => it.kind !== 'punch').map(it => '<div class="row"><span class="ri">' + I(ico[it.kind] || 'clock', 20) + '</span><div class="rt"><b>' + esc(qTitle(it)) + '</b><small>' + esc(qSub(it)) + '</small></div><span class="badge warn">' + t('Queued') + '</span></div>').join('') :
        '<div class="row"><span class="ri" style="background:var(--green-50);color:var(--green)">' + I('check', 20, 2.5) + '</span><div class="rt"><b>' + t(queuedPunches().length ? 'No other actions waiting' : 'Nothing waiting — all synced') + '</b></div></div>') + '</div>' +
      '<div class="card protect" style="margin-top:14px"><div class="eyebrow">' + t('HOW YOUR DATA IS PROTECTED') + '</div><ul>' +
      ['Encrypted on the phone (AES-256)', 'Time taken from last server sync, not the phone clock', 'Each record has a unique ID — never counted twice', 'Server re-checks geofence and rules on sync'].map(s => '<li>' + I('check', 17, 2.6) + '<span>' + t(s) + '</span></li>').join('') + '</ul></div>' +
      '<p class="note" style="margin:14px 0">' + t('Last successful sync') + ': ' + MM.relDay(ls.time) + ' ' + MM.fmtTime(ls.time) + ' · ' + ls.rows + ' ' + t('records') + '</p>' +
      '<button class="btn lg block ' + (on ? 'primary' : '') + '" ' + (on && !ui.syncing ? 'data-act="syncnow"' : 'disabled') + '>' + (ui.syncing ? '<span class="spin"></span>' + t('Syncing…') : on ? I('refresh', 19) + t('Sync now') : t('Sync now') + ' · ' + t('waiting for network')) + '</button></div>';
  }
  function qTitle(it) {
    if (it.kind === 'punch') return t(it.ev.type === 'IN' ? 'Check-in' : 'Check-out') + ' · ' + MM.fmtTime(it.at);
    if (it.kind === 'request') return reqTitle(it.req);
    if (it.a.action === 'photo') return '1 ' + t('photo') + ' · ' + t('evidence');
    return it.a.taskId + ' · ' + t(STATUS[{ accept: 'ontheway', arrive: 'onsite', start: 'inprogress', complete: 'done', delay: 'delayed', resume: 'inprogress', notes: 'inprogress' }[it.a.action]][0]);
  }
  function qSub(it) {
    if (it.kind === 'punch') return (MM.lang === 'ar' ? mySite().nameAr : mySite().name) + ' · GPS ' + Math.round(it.ev.pos.acc) + ' m';
    if (it.kind === 'request') return t('Requests') + ' · ' + MM.fmtTime(it.at);
    if (it.a.action === 'photo') return t('Geo-tagged') + ' · ' + MM.fmtTime(it.at);
    return t('Status update') + ' · ' + MM.fmtTime(it.at);
  }

  /* TASKS */
  function vTasks() {
    const all = myTasks(), ar = MM.lang === 'ar';
    const act = all.filter(x => taskStep(x) < 2), don = all.filter(x => taskStep(x) === 2);
    const list = (ui.taskTab === 'active' ? act : don).slice().sort((a, b) => a.due - b.due);
    const isIn = checkedIn();
    return '<div class="screen with-nav"><div class="topbar"><div style="flex:1"><h1>' + t('My tasks') + '</h1><div class="sub">' + t('Each task has its own place and time') + '</div></div></div>' +
      (!isIn && act.length ? '<button class="lockmsg sm infob" data-act="tab" data-arg="home">' + I('info', 15) + '<span>' + t('Check in for your shift first – then start each task when you reach its location.') + '</span></button>' : '') +
      '<div class="seg"><button class="' + (ui.taskTab === 'active' ? 'on' : '') + '" data-act="ttab" data-arg="active">' + t('To do') + ' · ' + act.length + '</button><button class="' + (ui.taskTab === 'done' ? 'on' : '') + '" data-act="ttab" data-arg="done">' + t('Completed') + ' · ' + don.length + '</button></div>' +
      (list.length ? list.map(x => { const tt = taskTime(x); return '<div class="tcard ' + tt.k + '" role="button" tabindex="0" data-act="open" data-arg="' + x.id + '"><span class="ti' + (x.priority === 'High' ? ' hi' : '') + '">' + I(MM.TASK_TYPES[x.type] || 'clipboard', 21) + '</span><div class="b"><div class="id"><span class="keep-ltr">' + slotTxt(x) + '</span><span class="badge ' + tt.cls + '">' + esc(tt.label) + '</span></div><h3>' + esc(ar ? x.titleAr : x.title) + '</h3><div class="loc">' + I('pin', 14) + esc(ar ? x.locAr : x.loc) + '</div><div class="loc" style="margin-top:3px"><span class="keep-ltr">' + x.id + '</span> · ' + t(x.priority) + ' ' + t('priority') + '</div>' + (taskStep(x) === 0 ? (blockedBy(x) ? '<span class="tlock lg">' + I('lock', 13) + t('Starts after') + ' “' + tName(blockedBy(x)) + '”</span>' : '<button class="tgo lg" data-act="tstart" data-arg="' + x.id + '">' + I('play', 15) + t('Start task') + '</button>') : '') + '</div></div>'; }).join('') : '<div class="card" style="padding:28px;text-align:center;color:var(--muted)">' + t('No tasks here') + '</div>') +
      '</div>' + vNav('tasks');
  }

  const punchSrc = p => p.photo && (p.photo.src || MM.samplePhotoSVG(p.photo.sample || 1));
  const thumb = p => '<button class="pthumb" data-act="viewphoto" data-arg="' + p.id + '" style="background-image:url(\'' + punchSrc(p) + '\')" aria-label="' + t('Check-in photo') + '"></button>';
  function photoCard(p) {
    if (!p || !p.photo) return '';
    const ph = p.photo;
    return '<div class="pcap"><button class="pimg" data-act="viewphoto" data-arg="' + p.id + '" style="background-image:url(\'' + punchSrc(p) + '\')"><span class="stamp">' + MM.fmtTime(ph.time || p.time) + ' · ' + (+ph.lat).toFixed(4) + ', ' + (+ph.lng).toFixed(4) + '</span></button><div class="pmeta2"><b>' + I('camera', 14) + t('Check-in photo') + '</b><small>' + MM.fmtTime(ph.time || p.time) + ' · GPS ±' + (ph.acc || p.acc || 7) + ' ' + t('m') + (p.dist != null ? ' · ' + p.dist + ' ' + t('m from site') : '') + '</small></div></div>';
  }
  function photoHTML(p) {
    const src = p.src || MM.samplePhotoSVG(p.sample || 1);
    return '<div class="ph" style="background-image:url(\'' + src + '\')"><span class="stamp">' + MM.fmtTime(p.time) + ' · ' + p.lat.toFixed(3) + ', ' + p.lng.toFixed(3) + '</span></div>';
  }
  function vTask() {
    const x = taskById(ui.taskId); if (!x) return vTasks();
    const ar = MM.lang === 'ar';
    const st = taskStep(x), tt = taskTime(x), w = taskWin(x), isIn = checkedIn(), tg = taskGeo(x);
    const pr = { High: 'bad', Normal: 'gray', Low: 'gray' };
    const pos = getPos(); const dist = MM.haversine(pos, { lat: x.lat, lng: x.lng });
    const editable = ['onsite', 'inprogress'].includes(x.status);
    let actions = '', hint = '';
    if (st === 0) {
      // a task can only be started once the working day has started (attendance check-in) and close to its scheduled time
      const prev = blockedBy(x);
      if (prev && taskStep(prev) === 1) { actions = '<button class="btn lg locked" data-act="open" data-arg="' + prev.id + '">' + I('lock', 18) + t('Finish the task in progress first') + '</button>'; hint = t('One task at a time.') + ' “' + tName(prev) + '” ' + t('is in progress.'); }
      else if (prev) { actions = '<button class="btn lg locked" data-act="open" data-arg="' + prev.id + '">' + I('lock', 18) + t('Finish the previous task first') + '</button>'; hint = t('You are at the location of') + ' “' + tName(prev) + '” (' + slotTxt(prev) + ') – ' + t('do that task first.'); }
      else if (!isIn) { actions = '<button class="btn lg locked" data-act="tab" data-arg="home">' + I('lock', 18) + t('Check in for your shift first') + '</button>'; hint = t('Tasks are started after you check in for the day.'); }
      else if (!canStartTask(x)) { actions = '<button class="btn lg locked" disabled>' + I('clock', 18) + t('Available from') + ' ' + MM.fmtTime(w.start - EARLY_MIN * 60000) + '</button>'; hint = t('This task is scheduled for') + ' ' + slotTxt(x) + '.'; }
      // mandatory live location check: the job can only start when the phone is inside the task's location
      else if (!tg.inside) { actions = '<button class="btn lg locked" data-act="ta" data-arg="begin">' + I('lock', 18) + t('Go to the task location to start') + '</button>'; hint = (tg.why || '') + ' · ' + t('unlocks automatically within') + ' ' + x.radius + ' ' + t('m'); }
      else { actions = '<button class="btn primary lg" data-act="ta" data-arg="begin">' + I('pin', 19) + t("I'm at the site – Start task") + '</button>'; hint = t('Location verified') + ' · ' + tg.dist + ' ' + t('m from the task location'); }
    }
    else if (x.status === 'onsite') actions = tg.inside ? '<button class="btn primary lg" data-act="ta" data-arg="begin">' + I('pin', 19) + t("I'm at the site – Start task") + '</button>' : '<button class="btn lg locked" data-act="ta" data-arg="begin">' + I('lock', 18) + t('Go to the task location to start') + '</button>';
    else if (x.status === 'inprogress') actions = '<button class="btn warn-outline lg" data-act="delay">' + t('Report delay') + '</button><button class="btn primary lg" style="flex:1.35" data-act="ta" data-arg="complete">' + I('check', 18) + t('Complete task') + '</button>';
    else if (x.status === 'delayed') actions = '<button class="btn primary lg" data-act="ta" data-arg="resume">' + t('Resume task') + '</button>';
    // earlier tasks that are skipped for now because the employee is not at their location
    const skip = st === 0 ? skippedFor(x) : [];
    const skipNote = skip.length ? '<div class="skipnote">' + I('info', 16) + '<div><b>' + t('Earlier task skipped for now') + '</b>' + skip.map(y => '<span>“' + esc(tName(y)) + '” (' + slotTxt(y) + ') – ' + t('you are not at its location') + ' (' + MM.fmtDist(MM.haversine(getPos(), { lat: y.lat, lng: y.lng })) + ').</span>').join('') + '<small>' + t('It stays in your To do list. Go back to it when you reach its location.') + '</small></div></div>' : '';
    const err = ui.taskErr;
    return '<div class="screen">' +
      '<div class="topbar" style="align-items:flex-start"><button class="iconbtn" data-act="back"><span class="flip">' + I('back', 22) + '</span></button><div style="flex:1;min-width:0"><div class="sub"><span class="keep-ltr">' + x.id + '</span> · ' + t('assigned by') + ' ' + esc(ar ? db().people.supervisor.nameAr : x.createdBy) + '</div><h1 style="font-size:21px">' + esc(ar ? x.titleAr : x.title) + '</h1></div><span class="badge ' + pr[x.priority] + '" style="margin-top:8px">' + t(x.priority) + '</span></div>' +
      (err ? '<div class="errbox" style="margin-bottom:14px">' + I('ban', 19) + '<div><b>' + t('Update blocked') + '</b><br>' + (err.code === 'TASK_BUSY' ? t('One task at a time.') + ' “' + tName(err.prev) + '” ' + t('is in progress.') : err.code === 'TASK_ORDER' ? t('You are at the location of') + ' “' + tName(err.prev) + '” – ' + t('do that task first.') : err.code === 'LOC_MOCK' ? t('Fake-GPS app detected on device') : err.code === 'GPS_LOW_ACC' ? (err.acc ? t('GPS signal too weak') + ' (±' + err.acc + ' ' + t('m') + '). ' : t('No GPS location yet. ')) + t('Move to open sky and try again.') : (ar ? 'أنت على بعد ' : 'You are ') + MM.fmtDist(err.dist) + (ar ? ' من موقع المهمة. ' : ' from the task site. ') + t('Task updates are only accepted inside the task site radius') + ' (' + x.radius + ' ' + t('m') + ').') + (err.ref ? '<br><span class="keep-ltr" style="font-size:12.5px">Ref ' + err.ref + '</span>' : '') + '</div></div>' : '') + skipNote +
      (x.returned && x.supNote ? '<div class="feedback" style="margin-bottom:14px"><b>' + t('Supervisor feedback') + ':</b> ' + esc(x.supNote) + '</div>' : '') +
      '<div class="card tinfo"><div class="tr2">' + I('clock', 18) + '<div><small>' + t('Scheduled') + '</small><b class="keep-ltr">' + slotTxt(x) + '</b></div><span class="badge ' + tt.cls + '">' + esc(tt.label) + '</span></div>' +
      '<div class="tr2">' + I('pin', 18) + '<div><small>' + t('Location') + '</small><b>' + esc(ar ? x.locAr : x.loc) + '</b>' +
      (x.arrivedAt ? '<span class="ok-text" style="font-weight:600;font-size:13px">' + I('check', 14, 2.6) + ' ' + t('Arrived') + ' ' + MM.fmtTime(x.arrivedAt) + ' · ' + x.distance + ' ' + t('m') + ' ' + t('from site') + '</span>' : '') + '</div></div></div>' +
      // live location panel: map of the task zone + where the phone is right now (updates with every GPS fix)
      (st < 2 ? '<div class="card tgeo ' + (tg.nofix ? 'wait' : tg.inside ? 'in' : 'out') + '"><div class="tg-h"><span class="live"><i></i>' + t('LIVE') + '</span><b>' + (tg.nofix ? esc(tg.why) : tg.inside ? t('You are at the task location') : t('You are not at the task location')) + '</b></div>' +
        '<div class="tg-src ' + (dev.demo.loc === 'real' ? 'real' : 'demo') + '">' + (dev.demo.loc === 'real' ? I('pin', 13) + t("Using this phone's GPS") : I('alert', 13) + t('Demo location') + ' (' + t(DEMO_LOC_NAME[dev.demo.loc] || 'simulated') + ') – ' + t('not your real position') + ' <button data-act="usegps">' + t('Use my real GPS') + '</button>') + '</div>' +
        '<div class="tg-sub">' + (tg.nofix ? t('Allow location access to continue') : (tg.inside ? tg.dist + ' ' + t('m from the task location') : esc(tg.why)) + ' · GPS ±' + Math.round(tg.pos.acc) + ' ' + t('m') + ' · ' + t('zone') + ' ' + x.radius + ' ' + t('m')) + '</div>' +
        '<div class="mapslot tmap" data-tmap="' + x.id + '"></div></div>' : '') +
      '<div class="card" style="padding:16px;margin-top:12px"><div class="eyebrow">' + t('PROGRESS') + '</div><div class="steps s3">' +
      [['Assigned', MM.fmtTime(w.start)], [x.status === 'delayed' ? 'Delayed' : 'Started at site', x.arrivedAt ? MM.fmtTime(x.arrivedAt) : ''], [x.status === 'signed' ? 'Signed off' : 'Completed', x.completedAt ? MM.fmtTime(x.completedAt) : '']].map(([s, tm], i) => { const dn = i < st || (i === 2 && st === 2); return '<div class="' + (dn ? 'done' : i === st ? 'cur' + (x.status === 'delayed' ? ' delayed' : '') : '') + '"><div class="c">' + (dn ? I('check', 16, 3) : i + 1) + '</div>' + t(s) + (tm ? '<small class="keep-ltr">' + tm + '</small>' : '') + '</div>'; }).join('') + '</div></div>' +
      (st >= 1 ? '<div class="card" style="padding:16px;margin-top:14px"><div class="evh"><span class="eyebrow">' + t('EVIDENCE') + '</span>' + (x.photos.length ? '<span class="ok-text" style="font-weight:600;font-size:14px">' + t('Location + time verified') + '</span>' : '') + '</div>' +
        '<div class="photos">' + x.photos.map(photoHTML).join('') + (editable ? '<button class="addph" data-act="camera">' + I('camera', 24) + t('Add photo') + '</button>' : '') + '</div>' +
        '<div style="font-weight:600;margin:14px 0 8px;color:var(--ink-2)">' + t('Site notes') + '</div>' +
        (editable ? '<textarea class="input" id="tNotes" rows="3">' + esc(x.notes) + '</textarea>' : '<div class="muted">' + (esc(x.notes) || '—') + '</div>') + '</div>' : '') +
      (x.status === 'done' ? '<div class="card" style="padding:14px 16px;margin-top:14px;display:flex;gap:10px;align-items:center">' + I('clock', 20) + '<span>' + t('Completed — waiting for supervisor sign-off') + '</span></div>' : '') +
      (x.status === 'signed' ? '<div class="card" style="padding:14px 16px;margin-top:14px;display:flex;gap:10px;align-items:center;color:var(--green)">' + I('shield', 22) + '<span><b>' + t('Signed off by') + ' ' + esc(ar ? db().people.supervisor.nameAr : x.signedBy || 'Salim Al Hinai') + '</b>' + (x.signedAt ? ' · ' + MM.fmtTime(x.signedAt) : '') + '</span></div>' : '') +
      '</div>' + (actions ? '<div class="bottombar' + (hint ? ' withhint' : '') + '">' + (hint ? '<div class="bhint">' + I('info', 14) + esc(hint) + '</div>' : '') + actions + '</div>' : '');
  }

  /* REQUESTS */
  function defaultForm(type) {
    const y = new Date(MM.now() - 864e5), iso = d => d.getFullYear() + '-' + MM.pad(d.getMonth() + 1) + '-' + MM.pad(d.getDate());
    const td = new Date(MM.now());
    const ar = MM.lang === 'ar';
    return {
      type, date: type === 'missed' ? iso(y) : iso(td), punchType: 'OUT', time: '14:35',
      reason: type === 'missed' ? (ar ? 'نفدت بطارية الهاتف في نهاية الوردية. يمكن للمشرف سالم تأكيد مغادرتي الساعة ١٤:٣٥.' : 'Phone battery died at end of shift. Supervisor Salim can confirm I left at 14:35.') : type === 'remote' ? (ar ? 'زيارة ميدانية خارج نطاق المكتب' : 'Field visit outside my office zone today.') : '',
      from: iso(td), to: iso(td), fromTime: '10:00', toTime: '12:00', leaveType: 'Annual leave', file: '',
    };
  }
  function reqWhen(r) {
    if (r.type === 'leave') return r.from === r.to ? r.from : r.from.replace(/ \d{4}$/, '') + ' – ' + r.to;
    if (r.type === 'short') return MM.fmtDate(r.date || r.created) + ' · ' + r.from + ' – ' + r.to;
    if (r.type === 'missed') return MM.fmtDay(r.date) + ', ' + MM.fmtDate(r.date);
    return MM.fmtDate(r.date || r.created);
  }
  const ar_ = () => MM.lang === 'ar';
  const supName = () => ar_() ? db().people.supervisor.nameAr : db().people.supervisor.name;
  function reqStage(r) { if (r.status !== 'pending') return r.status; if (r.queued) return 'queued'; return r.stage === 'hr' ? 'hr' : 'sup'; }
  function reqCard(r) {
    const st = reqStage(r);
    const badge = st === 'approved' ? '<span class="badge ok">' + t('Approved') + '</span>' : st === 'rejected' ? '<span class="badge bad">' + t('Rejected') + '</span>' : st === 'queued' ? '<span class="badge gray">' + t('Waiting to sync') + '</span>' : '<span class="badge warn">' + t(st === 'hr' ? 'With HR' : 'With supervisor') + '</span>';
    return '<button class="rqc" data-act="reqopen" data-arg="' + r.id + '"><span class="ri t-' + r.type + '">' + I(REQ_ICON[r.type] || 'file', 19) + '</span><div class="b"><div class="tp"><b>' + esc(reqTitle(r)) + '</b>' + badge + '</div><small>' + esc(reqWhen(r)) + '</small><small class="mt">' + (r.queued ? t('Saved on this phone') : '<span class="keep-ltr">' + r.id + '</span> · ' + t('Submitted') + ' ' + MM.relDay(r.created)) + '</small></div></button>';
  }
  function leaveBal() {
    const used = type => myRequests().filter(r => r.type === 'leave' && r.leaveType === type && r.status === 'approved').reduce((s, r) => s + (r.days || 0), 0);
    const held = myRequests().filter(r => r.type === 'leave' && r.leaveType === 'Annual leave' && r.status === 'pending').reduce((s, r) => s + (r.days || 0), 0);
    return [['Annual leave', 30 - used('Annual leave'), held], ['Sick leave', 10 - used('Sick leave'), 0], ['Emergency leave', 6 - used('Emergency leave'), 0]];
  }

  /* REQUESTS – list */
  function vRequests() {
    const all = myRequests(), f = ui.reqFilter;
    const n = s => all.filter(r => s === 'all' || r.status === s).length;
    const list = all.filter(r => f === 'all' || r.status === f);
    const bal = leaveBal();
    return '<div class="screen with-nav"><div class="topbar"><div style="flex:1"><h1>' + t('My requests') + '</h1><div class="sub">' + all.length + ' ' + t('requests') + ' · ' + n('pending') + ' ' + t('awaiting approval') + '</div></div><button class="btn primary sm" data-act="go" data-arg="newreq">' + I('plus', 16) + t('New') + '</button></div>' +
      (n('pending') && f !== 'pending' ? '<button class="pendbar" data-act="rfilter" data-arg="pending"><span class="pi">' + I('clock', 19) + '</span><span style="flex:1"><b>' + n('pending') + ' ' + t(n('pending') > 1 ? 'requests pending approval' : 'request pending approval') + '</b><small>' + t('Track where each one is') + '</small></span><span class="flip">' + I('fwd', 18) + '</span></button>' : '') +
      '<div class="bal">' + bal.map(([l, v, h]) => '<div><b>' + v + '</b><small>' + t(l) + '</small>' + (h ? '<em>' + h + ' ' + t('on hold') + '</em>' : '') + '</div>').join('') + '</div>' +
      '<div class="chips">' + [['all', 'All'], ['pending', 'Pending'], ['approved', 'Approved'], ['rejected', 'Rejected']].map(([k, l]) => '<button class="' + (f === k ? 'on' : '') + '" data-act="rfilter" data-arg="' + k + '">' + t(l) + ' <span>' + n(k) + '</span></button>').join('') + '</div>' +
      (list.length ? '<div class="rqlist">' + list.map(reqCard).join('') + '</div>' : '<div class="empty">' + I('file', 30) + '<b>' + t('No requests here') + '</b><button class="btn primary" data-act="go" data-arg="newreq">' + I('plus', 16) + t('New request') + '</button></div>') +
      '</div>' + vNav('requests');
  }

  /* REQUESTS – new */
  function vNewReq() {
    if (!ui.form) ui.form = defaultForm('leave');
    const f = ui.form, ar = ar_();
    const types = [['leave', 'Leave', 'Annual, sick or emergency'], ['short', 'Short permission', 'Leave early or come late'], ['remote', 'Remote work', 'Work outside your zone'], ['missed', 'Missed punch', 'Fix a missing check-in/out']];
    let fields = '';
    if (f.type === 'missed') fields = '<div class="two"><label class="field"><span>' + t('Date') + '</span><input class="input" type="date" data-f="date" value="' + f.date + '"></label><label class="field"><span>' + t('Punch') + '</span><select class="input" data-f="punchType"><option value="OUT"' + (f.punchType === 'OUT' ? ' selected' : '') + '>' + t('Check-out') + '</option><option value="IN"' + (f.punchType === 'IN' ? ' selected' : '') + '>' + t('Check-in') + '</option></select></label></div><label class="field"><span>' + t('Actual time') + '</span><input class="input" type="time" data-f="time" value="' + f.time + '"></label>';
    else if (f.type === 'leave') { const b = leaveBal().find(x => x[0] === f.leaveType); fields = '<label class="field"><span>' + t('Leave type') + '</span><select class="input" data-f="leaveType" data-rerender="1">' + ['Annual leave', 'Sick leave', 'Emergency leave'].map(x => '<option value="' + x + '"' + (f.leaveType === x ? ' selected' : '') + '>' + t(x) + '</option>').join('') + '</select></label>' + (b ? '<div class="hint2">' + I('info', 15) + t('Balance') + ': <b>' + b[1] + ' ' + t('days') + '</b></div>' : '') + '<div class="two"><label class="field"><span>' + t('From') + '</span><input class="input" type="date" data-f="from" value="' + f.from + '"></label><label class="field"><span>' + t('To') + '</span><input class="input" type="date" data-f="to" value="' + f.to + '"></label></div>'; }
    else if (f.type === 'short') fields = '<label class="field"><span>' + t('Date') + '</span><input class="input" type="date" data-f="date" value="' + f.date + '"></label><div class="two"><label class="field"><span>' + t('From') + '</span><input class="input" type="time" data-f="fromTime" value="' + f.fromTime + '"></label><label class="field"><span>' + t('To') + '</span><input class="input" type="time" data-f="toTime" value="' + f.toTime + '"></label></div>';
    else fields = '<label class="field"><span>' + t('Date') + '</span><input class="input" type="date" data-f="date" value="' + f.date + '"></label>';
    return '<div class="screen">' + topbar(t('New request')) +
      '<div class="eyebrow" style="margin:0 0 8px">' + t('REQUEST TYPE') + '</div>' +
      '<div class="rtypes">' + types.map(([k, l, d]) => '<button class="' + (f.type === k ? 'on' : '') + '" data-act="rtype" data-arg="' + k + '"><span class="ri t-' + k + '">' + I(REQ_ICON[k], 19) + '</span><b>' + t(l) + '</b><small>' + t(d) + '</small></button>').join('') + '</div>' +
      '<div class="card form" style="margin-top:12px">' + fields +
      '<label class="field"><span>' + t('Reason') + '</span><textarea class="input" data-f="reason" rows="3" placeholder="' + t('Briefly explain the reason') + '">' + esc(f.reason) + '</textarea></label>' +
      '<label class="attach">' + I('clip', 20) + (f.file ? esc(f.file) : t(f.type === 'leave' && f.leaveType === 'Sick leave' ? 'Attach medical certificate' : 'Attach file (optional)')) + '<input type="file" id="rfile" hidden></label></div>' +
      '<div class="card flow"><div class="eyebrow" style="margin-bottom:10px">' + t('APPROVAL ROUTE') + '</div><div class="fl"><span class="on">' + I('user', 15) + t('You') + '</span><i></i><span>' + I('users', 15) + esc(supName()) + '<small>' + t('Supervisor') + '</small></span><i></i><span>' + I('building', 15) + t('HR') + '<small>' + t('Final approval') + '</small></span></div></div>' +
      '</div><div class="bottombar"><button class="btn primary lg" data-act="submitreq">' + I('send', 18) + t('Submit request') + '</button></div>';
  }

  /* request approval route (shown in the request details sheet) */
  function reqStepper(r) {
    const st = reqStage(r), hr = st === 'hr', done = r.status !== 'pending';
    const s = (cls, ic, l, sub) => '<div class="ps ' + cls + '"><span class="c">' + I(ic, 14, 2.6) + '</span><div><b>' + l + '</b><small>' + sub + '</small></div></div>';
    if (done) return '';
    return '<div class="psteps" style="margin:0 0 12px">' +
      s('done', 'check', t('Submitted'), MM.relDay(r.created) + ' ' + MM.fmtTime(r.created)) +
      (st === 'queued' ? s('cur', 'wifioff', t('Waiting to sync'), t('Sends automatically when you are back online')) :
        s(hr ? 'done' : 'cur', hr ? 'check' : 'clock', t('Supervisor review') + ' · ' + esc(supName()), hr ? t('Endorsed') + ' ' + (r.supAt ? MM.relDay(r.supAt) + ' ' + MM.fmtTime(r.supAt) : '') : waited(r.created)) +
        s(hr ? 'cur' : '', hr ? 'clock' : 'building', t('HR approval'), hr ? waited(r.supAt || r.created) : t('After supervisor review'))) +
      s('', 'check', t('Decision'), t('You will get a notification')) + '</div>';
  }

  /* ---------- offline queue of time entries (check-ins / check-outs saved on the phone while offline) ---------- */
  const queuedPunches = () => dev.queue.filter(it => it.kind === 'punch').sort((a, b) => a.at - b.at);
  function queueCard(opts) {
    opts = opts || {};
    const qp = queuedPunches(), other = dev.queue.length - qp.length, on = online();
    if (!qp.length && !(opts.all && other)) return opts.link && !on ? '<div class="oq"><div class="oq-h">' + I('wifioff', 18) + '<b>' + t('Offline queue') + '</b><span class="oq-c">0 ' + t('time entries') + '</span></div><div class="oq-f" style="margin-top:2px">' + I('info', 14) + '<span>' + t('You are offline. Check-ins and check-outs you make now are saved on this phone and listed here until they sync.') + '</span></div></div>' : '';
    const row = (it, i) => '<div class="oq-row"><span class="oq-n">' + (i + 1) + '</span><span class="oq-i ' + (it.ev.type === 'IN' ? 'in' : 'out') + '">' + I(it.ev.type === 'IN' ? 'fingerprint' : 'logout', 18) + '</span>' +
      '<div class="oq-t"><b>' + t(it.ev.type === 'IN' ? 'Check-in' : 'Check-out') + ' · <span class="keep-ltr">' + MM.fmtTime(it.at) + '</span></b><small>' + MM.relDay(it.at) + ' · ' + t('saved on this phone') + ' · ' + ago(it.at) + ' · GPS ±' + Math.round(it.ev.pos.acc) + ' ' + t('m') + '</small></div>' +
      '<span class="oq-b' + (ui.syncing ? ' sync' : '') + '">' + (ui.syncing ? '<span class="spin dark"></span>' + t('Syncing…') : I('wifioff', 13) + t('Queued')) + '</span></div>';
    return '<div class="oq' + (on ? ' on' : '') + '"><div class="oq-h">' + I(on ? 'refresh' : 'wifioff', 18) + '<b>' + t('Offline queue') + '</b><span class="oq-c">' + qp.length + ' ' + t(qp.length === 1 ? 'time entry' : 'time entries') + '</span>' +
      (opts.link ? '<button class="oq-l" data-act="go" data-arg="sync">' + t('Details') + ' <span class="flip">' + I('fwd', 14) + '</span></button>' : '') + '</div>' +
      qp.map(row).join('') +
      (other ? '<button class="oq-more" data-act="go" data-arg="sync">+ ' + other + ' ' + t(other === 1 ? 'other action waiting (tasks / requests)' : 'other actions waiting (tasks / requests)') + '</button>' : '') +
      '<div class="oq-f">' + (on ? '<button class="btn primary block" data-act="syncnow"' + (ui.syncing ? ' disabled' : '') + '>' + (ui.syncing ? '<span class="spin"></span>' + t('Syncing…') : I('refresh', 17) + t('Sync now')) + '</button>'
        : I('info', 14) + '<span>' + t('Sent in this order when the signal returns. The server re-checks the location and time of each entry, then it goes to your supervisor for approval.') + '</span>') + '</div></div>';
  }
  /* PENDING APPROVAL – the employee's daily time entries and whether the supervisor approved them */
  function timeEntries() {
    const now0 = new Date(MM.now()), from = new Date(now0.getFullYear(), now0.getMonth() - 1, 1).getTime(), today = MM.dayStart();
    const ts = db().tsApprovals || {}, out = [];
    for (let k = today; k >= from; k = MM.dayStart(k - 12 * 3600e3)) {
      const r = dayRecord(k); if (!r.i && k !== today) continue;
      const a = ts[dev.session.empId + '|' + MM.ymd(k)] || null;
      const fixReq = myRequests().find(q => q.type === 'missed' && q.status === 'pending' && MM.dayStart(q.date) === k);
      let st = a ? a.status : k === today ? 'open' : 'pending', note = a && a.note || '';
      if ((r.i && r.i.status === 'queued') || (r.o && r.o.status === 'queued')) { st = 'queued'; note = t('Saved on this phone – sent for approval when you are back online'); }
      if (st === 'returned' && (r.corrected || fixReq)) { st = 'pending'; note = t(fixReq ? 'Correction submitted – waiting for review' : 'Corrected – waiting for re-approval'); }
      out.push({ k, r, a, st, note, hours: r.i && r.o ? r.o.time - r.i.time : 0, fixReq });
    }
    return out;
  }
  const TS_ST = { queued: ['Waiting to sync', 'warn'], pending: ['Pending', 'warn'], approved: ['Approved', 'ok'], returned: ['Returned', 'bad'], open: ['In progress', 'info'], notstarted: ['Not started', 'gray'] };
  const tsKey = e => e.st === 'open' && !e.r.i ? 'notstarted' : e.st;
  function tsLine(e) {
    if (e.st === 'approved') return t('Approved by') + ' ' + esc(e.a.by) + ' · ' + MM.relDay(e.a.at) + (e.note ? ' · ' + t('note') : '');
    if (e.st === 'returned' || e.st === 'queued') return esc(e.note);
    if (e.st === 'open') return e.r.i ? t('Sent for approval after check-out') : t('Check in to start today’s entry');
    return e.note ? esc(e.note) : t('Waiting for') + ' ' + esc(supName()) + ' · ' + t('submitted') + ' ' + MM.relDay(e.a && e.a.submittedAt || e.k);
  }
  function vPending() {
    const all = timeEntries(), f = ui.tsFilter;
    const c = s => all.filter(e => e.st === s).length;
    const pendH = all.filter(e => e.st === 'pending').reduce((s, e) => s + e.hours, 0);
    const list = all.filter(e => f === 'all' ? true : f === 'pending' ? e.st === 'pending' || e.st === 'open' || e.st === 'queued' : e.st === f);
    const weeks = []; list.forEach(e => { const ws = MM.weekStart(e.k); let w = weeks.find(x => x.ws === ws); if (!w) weeks.push(w = { ws, items: [] }); w.items.push(e); });
    const ar = ar_();
    return '<div class="screen">' + topbar(t('Pending approval'), t('Your time entries') + ' · ' + t('approver') + ': ' + esc(supName())) +
      queueCard() +
      '<div class="tsum">' + [['pending', 'Pending', 'warn'], ['approved', 'Approved', 'ok'], ['returned', 'Returned', 'bad']].map(([k, l, cl]) => '<button class="' + cl + (f === k ? ' on' : '') + '" data-act="tsfilter" data-arg="' + k + '"><b>' + c(k) + '</b><small>' + t(l) + '</small></button>').join('') + '</div>' +
      (c('pending') ? '<div class="tsinfo">' + I('clock', 16) + '<span><b>' + hm(pendH) + '</b> ' + t('of worked time is waiting for approval. Approved days go to payroll.') + '</span></div>' : '') +
      (c('returned') && f !== 'returned' ? '<button class="retbar" data-act="tsfilter" data-arg="returned">' + I('alert', 18) + '<span style="flex:1"><b>' + c('returned') + ' ' + t(c('returned') > 1 ? 'entries need your action' : 'entry needs your action') + '</b><small>' + t('Returned by your supervisor') + '</small></span><span class="flip">' + I('fwd', 16) + '</span></button>' : '') +
      '<div class="chips">' + [['pending', 'Pending'], ['returned', 'Returned'], ['approved', 'Approved'], ['all', 'All']].map(([k, l]) => '<button class="' + (f === k ? 'on' : '') + '" data-act="tsfilter" data-arg="' + k + '">' + t(l) + '</button>').join('') + '</div>' +
      (weeks.length ? weeks.map(w => { const tot = w.items.reduce((s, e) => s + e.hours, 0); return '<div class="wkh"><span>' + MM.fmtDateShort(w.ws) + ' – ' + MM.fmtDateShort(w.ws + 6 * 864e5) + '</span><span>' + w.items.length + ' ' + t(w.items.length === 1 ? 'day' : 'days') + ' · ' + hm(tot) + '</span></div><div class="card tslist">' +
        w.items.map(e => '<button class="tsr" data-act="tsopen" data-arg="' + e.k + '"><span class="dd"><b>' + new Date(e.k).getDate() + '</b><small>' + MM.fmtDay(e.k).slice(0, ar ? 9 : 3) + '</small></span><div class="tb"><div class="tt"><span class="keep-ltr">' + (e.r.i ? MM.fmtTime(e.r.i.time) : '—') + ' → ' + (e.r.o ? MM.fmtTime(e.r.o.time) : '<span class="bad-text">—</span>') + '</span>' + (e.hours ? '<em>' + hm(e.hours) + '</em>' : '') + '</div><small class="' + (e.st === 'returned' ? 'bad-text' : '') + '">' + tsLine(e) + '</small></div><span class="badge ' + TS_ST[tsKey(e)][1] + '">' + t(TS_ST[tsKey(e)][0]) + '</span></button>').join('') + '</div>'; }).join('')
        : '<div class="empty">' + I('check', 30) + '<b>' + t(f === 'returned' ? 'Nothing returned' : f === 'pending' ? 'Nothing waiting for approval' : 'No time entries') + '</b><p>' + t('Your daily check-in and check-out times are reviewed by your supervisor.') + '</p></div>') +
      '</div>';
  }
  function vTsSheet(k) {
    const e = timeEntries().find(x => x.k === k); if (!e) return '';
    const r = e.r, site = ar_() ? mySite().nameAr : mySite().name;
    const s = (cls, ic, l, sub) => '<div class="ps ' + cls + '"><span class="c">' + I(ic, 14, 2.6) + '</span><div><b>' + l + '</b><small>' + sub + '</small></div></div>';
    const dec = e.st === 'approved' ? s('done', 'check', t('Approved by') + ' ' + esc(e.a.by), MM.relDay(e.a.at) + ' ' + MM.fmtTime(e.a.at))
      : e.st === 'returned' ? s('bad', 'x', t('Returned by') + ' ' + esc(e.a.by), MM.relDay(e.a.at) + ' ' + MM.fmtTime(e.a.at))
        : e.st === 'open' ? s('', 'users', t('Supervisor approval'), t('Starts after you check out')) : s('cur', 'clock', t('Supervisor approval') + ' · ' + esc(supName()), waited(e.a && e.a.submittedAt || e.k));
    return '<div class="ov scrim2" data-act="closeov-bg"><div class="sheet"><div class="grab"></div><h3 style="justify-content:space-between">' + MM.fmtDay(k) + ', ' + MM.fmtDate(k) + '<span class="badge ' + TS_ST[tsKey(e)][1] + '">' + t(TS_ST[tsKey(e)][0]) + '</span></h3>' +
      '<div class="tl3" style="margin-top:0"><div><small>' + t('Check in') + '</small><b>' + (r.i ? MM.fmtTime(r.i.time) : '—') + '</b></div><div><small>' + t('Check out') + '</small><b>' + (r.o ? MM.fmtTime(r.o.time) : '—') + '</b></div><div><small>' + t('Worked') + '</small><b>' + (e.hours ? hm(e.hours) : e.st === 'open' && r.i ? hm(workedMs(r.i)) : '—') + '</b></div></div>' +
      '<div class="dl" style="margin:0 0 12px">' + I('pin', 16) + '<span>' + esc(site) + ' · GPS ±' + Math.round(r.i && r.i.acc || 7) + ' ' + t('m') + (r.i && r.i.late ? ' · ' + t('Late') + ' ' + r.i.late + ' ' + t('min') : '') + (r.corrected ? ' · ' + t('corrected') : '') + '</span></div>' +
      photoCard(r.i) + (e.note ? '<div class="decbox ' + (e.st === 'returned' ? 'bad' : e.st === 'approved' ? 'ok' : 'warn') + '">' + I(e.st === 'returned' ? 'alert' : 'chat', 17) + '<span>' + (e.a && e.a.note && e.note === e.a.note ? '<b>' + esc(e.a.by) + ':</b> ' : '') + esc(e.note) + '</span></div>' : '') +
      '<div class="psteps">' + s('done', 'fingerprint', t('Recorded on your phone'), t('Geofence and device checks passed')) + s(e.st === 'open' ? 'cur' : 'done', e.st === 'open' ? 'clock' : 'check', t('Submitted for approval'), e.st === 'open' ? t('After check-out') : MM.relDay(e.a && e.a.submittedAt || r.o && r.o.time || k)) + dec +
      s(e.st === 'approved' ? 'done' : '', 'card', t('Payroll'), t(e.st === 'approved' ? 'Included in this month’s payroll' : 'Approved days are sent to Oracle Payroll')) + '</div>' +
      (e.st === 'returned' ? '<button class="btn primary lg block" style="margin-top:14px" data-act="fixday" data-arg="' + k + '">' + I('fingerprint', 18) + t('Submit correction') + '</button>' : '') +
      (e.st === 'pending' && !e.fixReq ? (e.a && e.a.remindedAt ? '<p class="muted2" style="margin:12px 0 0">' + I('check', 14) + t('Reminder sent') + ' ' + MM.fmtTime(e.a.remindedAt) + '</p>' : '<button class="btn outline lg block" style="margin-top:14px" data-act="tsremind" data-arg="' + k + '">' + I('bell', 18) + t('Remind my supervisor') + '</button>') : '') +
      '<button class="btn ' + (e.st === 'returned' ? 'ghost' : 'primary') + ' lg block" style="margin-top:10px" data-act="closeov">' + t('Close') + '</button></div></div>';
  }

  /* NOTIFICATIONS */
  function nItem(n) {
    const s = n.byName ? { name: n.byName, ar: n.byName === 'Ahmed Al Busaidi' ? 'أحمد البوسعيدي' : n.byName, cls: 'mg', init: n.byName.split(' ').filter(w => w.length > 2).map(w => w[0]).filter((c, i, a) => i === 0 || i === a.length - 1).join('') } : n.title ? SENDER[n.from] || SENDER.system : n.from === 'manager' ? { name: 'Manager', ar: 'المدير', icon: 'user', cls: 'mg' } : SENDER.system, un = isUnread(n);
    const tag = n.kind === 'announcement' ? '<span class="ntag">' + t('Announcement') + '</span>' : n.kind === 'approved' ? '<span class="ntag ok">' + t('Approved') + '</span>' : n.kind === 'rejected' ? '<span class="ntag bad">' + t('Rejected') + '</span>' : n.kind === 'returned' ? '<span class="ntag bad">' + t('Returned') + '</span>' : '';
    return '<button class="ni2' + (un ? ' un' : '') + '" data-act="nopen" data-arg="' + n.id + '"><span class="na ' + s.cls + '">' + (s.init ? s.init : I(s.icon, 18)) + '</span><div class="nb"><div class="nh"><span>' + esc(ar_() ? s.ar : s.name) + (s.role ? ' · ' + t(s.role) : '') + '</span><time>' + ago(n.time) + '</time></div><b>' + esc(nTitle(n)) + '</b>' + (nText(n) ? '<p>' + esc(nText(n)) + '</p>' : '') + tag + '</div>' + (un ? '<i class="ud"></i>' : '') + '</button>';
  }
  function vNotifs() {
    const all = myNotifs(), f = ui.nFilter;
    const cnt = k => all.filter(n => k === 'all' || (n.from || 'system') === k).length;
    const list = all.filter(n => f === 'all' || (n.from || 'system') === f);
    const d0 = MM.dayStart(), groups = [['Today', list.filter(n => n.time >= d0)], ['Yesterday', list.filter(n => n.time < d0 && n.time >= d0 - 864e5)], ['Earlier', list.filter(n => n.time < d0 - 864e5)]];
    const un = unreadCount();
    return '<div class="screen">' + topbar(t('Notifications'), un ? un + ' ' + t('unread') : t('All caught up'), un ? '<button class="link" data-act="readall">' + t('Mark all read') + '</button>' : '') +
      '<div class="chips">' + [['all', 'All'], ['hr', 'HR'], ['manager', 'Manager'], ['system', 'System']].map(([k, l]) => '<button class="' + (f === k ? 'on' : '') + '" data-act="nfilter" data-arg="' + k + '">' + t(l) + ' <span>' + cnt(k) + '</span></button>').join('') + '</div>' +
      (list.length ? groups.filter(g => g[1].length).map(([l, ns]) => '<div class="eyebrow" style="margin:14px 2px 8px">' + t(l) + '</div><div class="card nlist">' + ns.map(nItem).join('') + '</div>').join('') : '<div class="empty">' + I('bell', 30) + '<b>' + t('No notifications') + '</b></div>') +
      '</div>';
  }

  /* HISTORY */
  function dayRecord(k) {
    const e = me(), d0 = MM.dayStart();
    const ps = myPunches().filter(p => MM.dayStart(p.time) === k);
    const i = ps.find(p => p.type === 'IN'), o = ps.filter(p => p.type === 'OUT').pop();
    const lv = myRequests().find(r => r.type === 'leave' && r.status === 'approved' && k >= MM.dayStart(new Date(r.from).getTime()) && k <= MM.dayStart(new Date(r.to).getTime()));
    let st;
    if (k > d0) st = 'future';
    else if (lv) st = 'leave';
    else if (!i) st = k === d0 ? 'today' : new Date(k).getDay() === 5 ? 'off' : 'absent';
    else if (!o || o.time < i.time) st = k === d0 ? 'today' : 'missing';
    else st = i.late ? 'late' : 'present';
    return { k, i, o: o && i && o.time > i.time ? o : null, st, lv, corrected: ps.some(p => p.status === 'corrected'), offline: ps.some(p => p.offline) };
  }
  const H_ST = { present: ['On time', 'ok'], late: ['Late', 'warn'], leave: ['On leave', 'pur'], absent: ['Absent', 'bad'], missing: ['Missing check-out', 'bad'], off: ['Day off', 'gray'], today: ['Today', 'info'], future: ['', ''] };
  function vHistory() {
    const now0 = new Date(MM.now()), m0 = new Date(now0.getFullYear(), now0.getMonth() + ui.hMonth, 1);
    const y = m0.getFullYear(), mo = m0.getMonth(), nDays = new Date(y, mo + 1, 0).getDate();
    const days = []; for (let d = 1; d <= nDays; d++) days.push(dayRecord(new Date(y, mo, d).getTime()));
    const past = days.filter(r => !['future'].includes(r.st));
    const c = s => past.filter(r => r.st === s).length;
    const worked = past.reduce((s, r) => s + (r.i && r.o ? r.o.time - r.i.time : 0), 0);
    const present = c('present') + c('late') + c('missing') + (past.some(r => r.st === 'today' && r.i) ? 1 : 0);
    const onTime = present ? Math.round(c('present') / Math.max(1, present - c('missing') - (past.some(r => r.st === 'today' && r.i) ? 1 : 0)) * 100) : 0;
    const sel = ui.hDay && MM.dayStart(ui.hDay) >= m0.getTime() && ui.hDay < new Date(y, mo + 1, 1).getTime() ? days.find(r => r.k === ui.hDay) : (days.find(r => r.k === MM.dayStart()) || [...past].reverse().find(r => r.i) || days[0]);
    const lead = new Date(y, mo, 1).getDay();
    const ar = ar_();
    const wd = ar ? ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'] : ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const canPrev = ui.hMonth > -1, canNext = ui.hMonth < 0;
    const lst = past.filter(r => r.st !== 'off' && r.st !== 'future').reverse();
    return '<div class="screen with-nav"><div class="topbar"><h1 style="flex:1">' + t('My attendance') + '</h1><div class="mnav"><button data-act="hmonth" data-arg="-1"' + (canPrev ? '' : ' disabled') + '><span class="flip">' + I('back', 17) + '</span></button><b>' + MM.monthName(mo, y) + '</b><button data-act="hmonth" data-arg="1"' + (canNext ? '' : ' disabled') + '><span class="flip">' + I('fwd', 17) + '</span></button></div></div>' +
      '<div class="hk"><div><b>' + present + '</b><small>' + t('Days present') + '</small></div><div><b>' + onTime + '%</b><small>' + t('On time') + '</small></div><div><b class="w">' + c('late') + '</b><small>' + t('Late') + '</small></div><div><b>' + Math.round(worked / 3600e3) + t('h') + '</b><small>' + t('Worked') + '</small></div></div>' +
      '<div class="card cal"><div class="wd">' + wd.map(x => '<span>' + x + '</span>').join('') + '</div><div class="gd">' + '<span></span>'.repeat(lead) +
      days.map(r => '<button class="dc s-' + r.st + (sel && sel.k === r.k ? ' sel' : '') + (r.k === MM.dayStart() ? ' tdy' : '') + '"' + (r.st === 'future' ? ' disabled' : ' data-act="hday" data-arg="' + r.k + '"') + '>' + new Date(r.k).getDate() + '<i></i></button>').join('') + '</div>' +
      '<div class="lg">' + [['present', 'On time'], ['late', 'Late'], ['leave', 'Leave'], ['absent', 'Absent'], ['off', 'Off']].map(([k, l]) => '<span><i class="s-' + k + '"></i>' + t(l) + '</span>').join('') + '</div></div>' +
      (sel ? '<div class="card dsel"><div class="dh2"><div><b>' + MM.fmtDay(sel.k) + '</b><small>' + MM.fmtDate(sel.k) + '</small></div>' + (H_ST[sel.st][0] ? '<span class="badge ' + ({ pur: 'info', bad: 'bad', warn: 'warn', ok: 'ok', gray: 'gray', info: 'info' }[H_ST[sel.st][1]]) + '">' + t(H_ST[sel.st][0]) + (sel.st === 'late' && sel.i ? ' · ' + sel.i.late + ' ' + t('min') : '') + '</span>' : '') + '</div>' +
        (sel.lv ? '<div class="dl">' + I('plane', 17) + '<span>' + t(sel.lv.leaveType) + ' · <span class="keep-ltr">' + sel.lv.id + '</span></span></div>' :
          '<div class="tl3"><div><small>' + t('Check in') + '</small><b>' + (sel.i ? MM.fmtTime(sel.i.time) : '—') + '</b></div><div><small>' + t('Check out') + '</small><b>' + (sel.o ? MM.fmtTime(sel.o.time) : '—') + '</b></div><div><small>' + t('Worked') + '</small><b>' + (sel.i && sel.o ? hm(sel.o.time - sel.i.time) : sel.i && sel.st === 'today' ? hm(workedMs(sel.i)) : '—') + '</b></div></div>' +
          (sel.i ? '<div class="dl">' + I('pin', 16) + '<span>' + esc(ar ? mySite().nameAr : mySite().name) + ' · GPS ±' + Math.round(sel.i.acc || 7) + ' ' + t('m') + (sel.offline ? ' · ' + t('offline') : '') + (sel.corrected ? ' · ' + t('corrected') : '') + '</span></div>' : '') +
          photoCard(sel.i) + (sel.st === 'missing' || sel.st === 'absent' ? '<button class="btn sm outline" style="margin-top:10px" data-act="fixday" data-arg="' + sel.k + '">' + I('fingerprint', 15) + t('Request correction') + '</button>' : '')) + '</div>' : '') +
      '<div class="sech" style="margin-top:16px">' + I('history', 18) + t('Punch history') + '</div><div class="card hlist">' + (lst.length ? '<div class="hhead"><span>' + t('Date') + '</span><span>' + t('Status') + '</span><span>' + t('In') + '</span><span>' + t('Out') + '</span></div>' : '') +
      (lst.length ? lst.slice(0, 12).map(r => '<button class="hrow" data-act="hday" data-arg="' + r.k + '"><div class="d"><b>' + MM.fmtDay(r.k).slice(0, ar ? 9 : 3) + ', ' + MM.fmtDateShort(r.k) + '</b>' + (H_ST[r.st][0] ? '<span class="badge ' + ({ pur: 'info', bad: 'bad', warn: 'warn', ok: 'ok', gray: 'gray', info: 'info' }[H_ST[r.st][1]]) + ' sm2">' + t(H_ST[r.st][0]) + '</span>' : '') + '</div><span class="tm">' + (r.i ? MM.fmtTime(r.i.time) : '—') + '</span><span class="tm muted">' + (r.o ? MM.fmtTime(r.o.time) : '—') + '</span></button>').join('') : '<p class="muted" style="padding:14px;margin:0">' + t('No records this month') + '</p>') + '</div>' +
      '</div>' + vNav('history');
  }

  /* OVERLAYS */
  function vOverlay() {
    const o = ui.overlay; if (!o) return '';
    if (o.type === 'success') {
      const r = o.res; const ar = MM.lang === 'ar';
      if (o.offline) return '<div class="ov success offline"><div class="big">' + I('wifioff', 50, 2) + '</div><h2>' + t('Saved offline') + '</h2><div class="time">' + MM.fmtTime(o.at) + '</div><p class="muted" style="max-width:280px;line-height:1.5">' + t('Will sync automatically when the signal returns. The server re-checks it.') + '</p><button class="btn primary lg" style="min-width:200px;margin-top:20px" data-act="closeov">' + t('Done') + '</button></div>';
      return '<div class="ov success"><div class="big">' + I('check', 56, 2.6) + '</div><h2>' + t(r.type === 'IN' ? 'Checked in successfully' : 'Checked out successfully') + '</h2><div class="muted">' + esc(ar ? r.site.nameAr : r.site.name) + '</div><div class="time">' + MM.fmtTimeS(r.serverTime) + '</div><div class="muted" style="margin-bottom:14px">' + t('Recorded with server time') + '</div>' +
        (r.type === 'IN' ? (r.late ? '<span class="badge warn">' + t('Late') + ' · ' + r.late + ' ' + t('min') + '</span>' : '<span class="badge ok">' + t('On time') + '</span>') : '') +
        '<button class="btn primary lg" style="min-width:200px;margin-top:26px" data-act="closeov">' + t('Done') + '</button></div>';
    }
    if (o.type === 'face') return '<div class="ov faceov' + (o.ok ? ' ok' : '') + '"><div class="fi2">' + I(o.ok ? 'check' : 'faceid', 58, 1.6) + '</div><div style="font-size:18px;font-weight:600">' + t(o.ok ? 'Face ID verified' : 'Look at your phone') + '</div></div>';
    if (o.type === 'delay') return '<div class="ov scrim2" data-act="closeov-bg"><div class="sheet"><div class="grab"></div><h3>' + t('Reason for delay') + '</h3>' + ['Vehicle breakdown', 'Site closed', 'Owner not available', 'Waiting for equipment'].map(r => '<button class="opt" style="width:100%;background:none;border-left:0;border-right:0;border-bottom:0;text-align:start" data-act="delayr" data-arg="' + r + '"><span>' + t(r) + '</span><span class="flip">' + I('fwd', 18) + '</span></button>').join('') + '</div></div>';
    if (o.type === 'tile') { const tl = db().tiles.find(x => x.key === o.key); return '<div class="ov scrim2" data-act="closeov-bg"><div class="sheet"><div class="grab"></div><h3>' + I(tl.icon, 22) + esc(MM.lang === 'ar' ? tl.ar : tl.label) + '</h3><p class="muted" style="line-height:1.5">' + t('This service is switched on from the server. It will be delivered in Phase 2.') + '</p><button class="btn primary lg block" data-act="closeov">' + t('Close') + '</button></div></div>'; }
    if (o.type === 'profile') { const e = me(); return '<div class="ov scrim2" data-act="closeov-bg"><div class="sheet"><div class="grab"></div><h3>' + esc(MM.lang === 'ar' ? e.nameAr : e.name) + '</h3><p class="muted" style="margin-top:-6px">' + esc(MM.lang === 'ar' ? e.roleAr : e.role) + ' · <span class="keep-ltr">' + e.id + '</span></p><div class="opt"><span>' + t('Registered phone') + '</span><b class="keep-ltr">' + esc(e.device) + '</b></div><button class="opt" style="width:100%;background:none;border-left:0;border-right:0;border-bottom:0;text-align:start" data-act="gosync"><span>' + t('Sync status') + '</span><b>' + (online() ? t('Online') : t('Offline')) + ' · ' + dev.queue.length + ' ' + t('queued') + '</b><span class="flip">' + I('fwd', 16) + '</span></button><div class="opt"><span>' + t('Sign out?') + '</span></div><p class="muted" style="font-size:14px;margin-top:0">' + t('Your phone stays registered to you.') + '</p><button class="btn danger lg block" data-act="logout">' + I('logout', 19) + t('Sign out') + '</button></div></div>'; }
    if (o.type === 'camera') return '<div class="ov cam"><div style="display:flex;align-items:center;gap:10px;padding:14px 16px"><button class="iconbtn" style="background:#222;border-color:#333;color:#fff" data-act="closecam">' + I('x', 20) + '</button><div style="flex:1;min-width:0"><b>' + t(o.purpose === 'punch' ? 'Check-in photo' : 'Camera') + '</b>' + (o.purpose === 'punch' ? '<div style="font-size:12px;color:#9CA3AF">' + esc(MM.lang === 'ar' ? mySite().nameAr : mySite().name) + '</div>' : '') + '</div><span class="keep-ltr" style="font-size:13px;color:#9CA3AF" data-clock>' + MM.fmtTimeS(MM.now()) + '</span></div>' +
      (o.purpose === 'punch' ? '<div class="camtip">' + I('camera', 16) + '<span>' + t('Take a photo of your work location to check in. Your supervisor sees it when approving your time.') + '</span></div>' : '') +
      '<video id="camv" playsinline autoplay muted></video><div class="bar"><div class="hint" id="camhint">' + t('Waiting for camera…') + '</div><button class="shutter" data-act="shoot" aria-label="' + t('Take photo') + '"></button>' + (camFail ? '<button class="btn sm" style="width:100%;background:#222;border-color:#333;color:#fff" data-act="samplephoto">' + I('camera', 16) + t('No camera on this device – use a demo photo') + '</button>' : '') + '<div class="hint">' + t('Photos are taken live with the camera and stamped with time and GPS. Uploads are not allowed.') + '</div></div></div>';
    if (o.type === 'demo') return vDemo();
    if (o.type === 'ts') return vTsSheet(o.k);
    if (o.type === 'photo') { const p = myPunches().find(x => x.id === o.id); if (!p || !p.photo) return ''; return '<div class="ov photov" data-act="closeov-bg"><button class="iconbtn" data-act="closeov" style="position:absolute;top:14px;inset-inline-end:14px;background:#222;border-color:#333;color:#fff">' + I('x', 20) + '</button><img src="' + punchSrc(p) + '" alt=""><div class="cap"><b>' + t('Check-in photo') + ' · ' + MM.fmtDate(p.time) + ' ' + MM.fmtTime(p.photo.time || p.time) + '</b><span class="keep-ltr">' + (+p.photo.lat).toFixed(5) + ', ' + (+p.photo.lng).toFixed(5) + ' · ±' + (p.photo.acc || p.acc || 7) + ' m' + (p.dist != null ? ' · ' + p.dist + ' m ' + t('from site') : '') + '</span></div></div>'; }
    if (o.type === 'req') {
      const r = myRequests().find(x => x.id === o.id); if (!r) return '';
      const st = reqStage(r), ar = ar_();
      const rows = [['Reference', r.queued ? t('Assigned when synced') : '<span class="keep-ltr">' + r.id + '</span>'], ['Type', esc(t(REQ_LBL[r.type] || r.type)) + (r.leaveType ? ' · ' + t(r.leaveType) : '')], ['When', esc(reqWhen(r))], ['Reason', esc(r.reason || '—')]].concat(r.file ? [['Attachment', I('clip', 14) + ' ' + esc(r.file)]] : []).concat([['Submitted', MM.fmtDate(r.created) + ' ' + MM.fmtTime(r.created)]]);
      const dec = r.status === 'pending' ? '<div class="decbox warn">' + I('clock', 18) + '<span>' + (st === 'queued' ? t('Saved on this phone – sends when you are back online') : st === 'hr' ? t('Endorsed by your supervisor · waiting for HR') : t('Waiting for') + ' ' + esc(supName())) + '</span></div>'
        : '<div class="decbox ' + (r.status === 'approved' ? 'ok' : 'bad') + '">' + I(r.status === 'approved' ? 'check' : 'x', 18, 2.4) + '<span><b>' + t(r.status === 'approved' ? 'Approved' : 'Rejected') + '</b> ' + t('by') + ' ' + esc(r.decidedBy || supName()) + (r.decidedAt ? ' · ' + MM.fmtDate(r.decidedAt) : '') + (r.note ? '<br>“' + esc(r.note) + '”' : '') + '</span></div>';
      return '<div class="ov scrim2" data-act="closeov-bg"><div class="sheet"><div class="grab"></div><h3><span class="ri t-' + r.type + '" style="width:34px;height:34px">' + I(REQ_ICON[r.type] || 'file', 17) + '</span>' + esc(reqTitle(r)) + '</h3>' + dec +
        '<div class="kv2">' + rows.map(([k, v]) => '<span>' + t(k) + '</span><b>' + v + '</b>').join('') + '</div>' +
        (r.status === 'pending' ? '<div class="eyebrow" style="margin:14px 0 8px">' + t('APPROVAL ROUTE') + '</div>' + reqStepper(r) : '') +
        (r.status === 'pending' && !r.queued ? (r.remindedAt ? '<p class="muted2" style="margin:0">' + I('check', 14) + t('Reminder sent') + ' ' + MM.fmtTime(r.remindedAt) + '</p>' : '<button class="btn outline lg block" data-act="remind" data-arg="' + r.id + '">' + I('bell', 18) + t('Send reminder') + '</button>') : '') +
        '<button class="btn primary lg block" style="margin-top:10px" data-act="closeov">' + t('Close') + '</button></div></div>';
    }
    return '';
  }
  function vDemo() {
    const d = dev.demo, clock = db().settings.clock;
    const radio = (v, l) => '<label class="opt"><span>' + t(l) + '</span><input type="radio" name="loc" data-demo-loc="' + v + '"' + (d.loc === v ? ' checked' : '') + '></label>';
    const sw = (k, l) => '<label class="opt"><span>' + t(l) + '</span><span class="switch"><input type="checkbox" data-demo="' + k + '"' + (d[k] ? ' checked' : '') + '><i></i></span></label>';
    return '<div class="ov scrim2" data-act="closeov-bg"><div class="sheet"><div class="grab"></div><h3>' + I('sliders', 20) + t('Demo controls') + '</h3><p class="muted" style="margin:-6px 0 8px;font-size:13.5px">' + t('Demo: simulate conditions on this phone') + '</p>' +
      '<div class="eyebrow" style="margin-top:6px">' + t('Location') + '</div>' + radio('inside', 'Inside Muttrah office') + radio('outside', '1.2 km outside the fence') + radio('task', 'At the task site (35 m)') + radio('real', 'Real device GPS') +
      '<div class="eyebrow" style="margin-top:10px">' + t('Security') + '</div>' + sw('mock', 'Fake-GPS app running') + sw('weak', 'Weak GPS (48 m)') + sw('rooted', 'Rooted / jailbroken') + sw('devMode', 'Developer mode on') + sw('skew', 'Phone clock +47 min') + sw('unreg', 'Unregistered phone (for login demo)') +
      '<div class="eyebrow" style="margin-top:10px">' + t('Network') + '</div>' + sw('offline', 'Airplane mode (offline)') +
      '<div class="eyebrow" style="margin-top:10px">' + t('Demo clock') + '</div><label class="opt"><span>' + t('Real time') + ' <small class="muted keep-ltr">(' + esc(MM.tz().utc) + ')</small></span><input type="radio" name="clk" data-clock-mode="real"' + (clock !== 'morning' ? ' checked' : '') + '></label><label class="opt"><span>' + t('Morning scenario (07:28)') + '</span><input type="radio" name="clk" data-clock-mode="morning"' + (clock === 'morning' ? ' checked' : '') + '></label>' +
      '<div style="display:flex;gap:10px;margin-top:14px"><button class="btn block" data-act="resetdemo">' + I('refresh', 17) + t('Reset demo data') + '</button><button class="btn primary block" data-act="closeov">' + t('Done') + '</button></div></div></div>';
  }

  /* ---------- actions ---------- */
  function punchEvidence(type, photo) {
    return { empId: dev.session.empId, type, photo: photo || null, pos: getPos(), mock: dev.demo.mock, rooted: dev.demo.rooted, devMode: dev.demo.devMode, clientTime: MM.now() + (dev.demo.skew ? 47 * 60000 : 0), deviceId: dev.deviceId, uuid: MM.uid('PU-') };
  }
  function doPunch(photo) {
    if (ui.busy) return;
    const type = checkedIn() ? 'OUT' : 'IN';
    const g = geoState();
    // no GPS fix yet: nothing to check against, so don't record anything
    if (g.pos.nofix) { toast(t('Location not available'), g.lockWhy, 'warn'); if (dev.demo.loc === 'real' && !gpsErr) startRealGps(); return; }
    // check-in needs a photo of the work location – but only once the location checks pass (outside the fence it is blocked straight away)
    if (type === 'IN' && !photo && !g.locked) { ui.overlay = { type: 'camera', purpose: 'punch' }; render(); return; }
    const ev = punchEvidence(type, photo);
    // offline and the fence check fails on the phone: block here too (recorded and re-sent with the audit trail)
    if (!online() && g.locked) { const res = MM.localApply(d => MM.evalPunch(d, ev)); if (!res.ok) { ui.blockRes = res; go('blocked'); return; } }
    if (!online()) {
      const at = MM.now();
      dev.queue.push({ kind: 'punch', uuid: ev.uuid, ev, at }); saveDev();
      MM.localApply(d => d.punches.push({ id: ev.uuid, empId: ev.empId, type, time: at, siteId: me().siteId, status: 'queued', offline: true, photo: photo || undefined }));
      ui.overlay = { type: 'success', offline: true, at }; render(); return;
    }
    ui.busy = true; render();
    setTimeout(() => {
      let res;
      try { res = MM.tx(d => MM.evalPunch(d, ev)); } catch (e) {
        ui.busy = false;
        if (g.locked) { toast(e.message, '', 'bad'); render(); return; }
        // no connection to the server: keep the entry in the offline queue (the server re-checks it on sync)
        const at = MM.now(); MM.S.reachable = false; dev.queue.push({ kind: 'punch', uuid: ev.uuid, ev, at }); saveDev();
        MM.localApply(d => d.punches.push({ id: ev.uuid, empId: ev.empId, type, time: at, siteId: me().siteId, status: 'queued', offline: true, photo: photo || undefined }));
        ui.overlay = { type: 'success', offline: true, at }; render(); return;
      }
      ui.busy = false; markSynced(1);
      if (res.ok) { ui.overlay = { type: 'success', res }; render(); setTimeout(() => { if (ui.overlay && ui.overlay.res === res) { ui.overlay = null; render(); } }, 6000); }
      else { ui.blockRes = res; go('blocked'); }
    }, 750);
  }
  function markSynced(rows) { dev.lastSync = { time: MM.now(), rows: rows || 1 }; saveDev(); }

  function taskAction(action, extra) {
    const x = taskById(ui.taskId); if (!x) return;
    if (action === 'complete') {
      const n = document.getElementById('tNotes'); extra = Object.assign({ notes: n ? n.value : x.notes }, extra);
      if (!x.photos.length) { toast(t('Add at least one photo before closing the task.'), '', 'warn'); return; }
    }
    const a = Object.assign({ taskId: x.id, action, pos: getPos(), mock: dev.demo.mock, uuid: MM.uid('TA-') }, extra || {});
    let r;
    if (!online()) {
      r = MM.localApply(d => MM.evalTask(d, a));
      if (r.ok) { dev.queue.push({ kind: 'task', uuid: a.uuid, a, at: MM.now() }); saveDev(); toast(t('Saved offline'), t('Will sync automatically when the signal returns. The server re-checks it.'), 'warn'); }
    } else {
      try { r = MM.tx(d => MM.evalTask(d, a)); markSynced(1); } catch (e) { toast(e.message, '', 'bad'); return; }
    }
    ui.taskErr = r.ok ? null : r;
    if (r.ok && action === 'begin') toast(t('Task started'), t('You are at the site') + ' · ' + MM.fmtTime(MM.now()), 'ok');
    if (r.ok && action === 'complete') toast(t('Task closed – sent for sign-off'), x.id, 'ok');
    if (r.ok && action === 'photo') toast(t('Photo added'), '', 'ok');
    if (r.ok && action === 'notes') toast(t('Notes saved'), '', 'ok');
    render();
  }

  function submitRequest() {
    const f = ui.form;
    if (!f.reason.trim()) { toast(t('Please enter a reason.'), '', 'warn'); return; }
    const fmt = iso => { const [y, m, d] = iso.split('-').map(Number); return MM.pad(d) + ' ' + MM.MON[m - 1] + ' ' + y; };
    const ms = iso => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
    const req = { id: 'REQ-' + Math.floor(5200 + Math.random() * 700), empId: dev.session.empId, type: f.type, status: 'pending', created: MM.now(), reason: f.reason.trim(), file: f.file || '' };
    if (f.type === 'missed') Object.assign(req, { date: ms(f.date), punchType: f.punchType, time: f.time });
    if (f.type === 'leave') { const days = Math.max(1, Math.round((ms(f.to) - ms(f.from)) / 864e5) + 1); Object.assign(req, { leaveType: f.leaveType, from: fmt(f.from), to: fmt(f.to), days }); }
    if (f.type === 'short') { const [a1, a2] = f.fromTime.split(':').map(Number), [b1, b2] = f.toTime.split(':').map(Number); Object.assign(req, { date: ms(f.date), from: f.fromTime, to: f.toTime, hours: Math.max(0.5, Math.round(((b1 * 60 + b2) - (a1 * 60 + a2)) / 30) / 2) }); }
    if (f.type === 'remote') Object.assign(req, { date: ms(f.date) });
    if (!online()) { dev.queue.push({ kind: 'request', uuid: MM.uid('RQ-'), req, at: MM.now() }); saveDev(); toast(t('Request saved offline'), '', 'warn'); }
    else {
      MM.tx(d => { d.counters.req++; req.id = 'REQ-' + d.counters.req; d.requests.push(req); MM.notify(d, 'supervisor', 'New ' + req.type + ' request from ' + me().name, 'طلب جديد من ' + me().nameAr, 'request'); MM.addActivity(d, { empId: req.empId, text: 'Submitted ' + req.type + ' request', kind: 'request' }); });
      markSynced(1); toast(t('Request submitted'), (MM.lang === 'ar' ? 'إلى ' + db().people.supervisor.nameAr : 'To ' + db().people.supervisor.name), 'ok');
    }
    ui.form = null; ui.reqFilter = 'pending'; ui.stack = []; ui.screen = 'requests'; render(); scrollTop();
  }

  function syncNow(silent) {
    if (!online() || !dev.queue.length || ui.syncing) return;
    ui.syncing = true; render();
    setTimeout(() => {
      const q = dev.queue.slice(); let ok = 0, dup = 0, blk = 0;
      try {
        MM.tx(d => {
          q.forEach(it => {
            if (d.processed[it.uuid]) { dup++; return; }
            d.processed[it.uuid] = 1;
            if (it.kind === 'punch') { const r = MM.evalPunch(d, Object.assign({}, it.ev, { time: it.at, offline: true, queuedFor: MM.now() - it.at })); r.ok ? ok++ : blk++; }
            else if (it.kind === 'task') { const r = MM.evalTask(d, Object.assign({}, it.a, { time: it.at, offline: true })); r.ok ? ok++ : blk++; }
            else if (it.kind === 'request') { d.counters.req++; it.req.id = 'REQ-' + d.counters.req; d.requests.push(it.req); MM.notify(d, 'supervisor', 'New ' + it.req.type + ' request from ' + me().name, '', 'request'); ok++; }
          });
          d.syncLog.unshift({ id: MM.uid('SL'), time: MM.now(), device: dev.deviceId, empId: dev.session.empId, type: 'offline queue', rows: q.length, result: blk ? blk + ' blocked on re-check' : dup ? dup + ' duplicate ignored' : 'ok' });
        });
      } catch (e) { ui.syncing = false; toast(e.message, '', 'bad'); render(); return; }
      dev.queue = dev.queue.filter(it => !q.includes(it)); markSynced(q.length); ui.syncing = false;
      toast(t('Synced') + ' ' + q.length + ' ' + t('records'), t('server re-checked each one') + (blk ? ' · ' + blk + ' ' + t('blocked on re-check') : '') + (dup ? ' · ' + dup + ' ' + t('duplicate ignored') : ''), blk ? 'warn' : 'ok');
      render();
    }, 1100);
  }

  function login(face) {
    const id = face ? null : (document.getElementById('lgId').value || '').trim();
    const pw = face ? 'x' : document.getElementById('lgPw').value;
    if (!face && (!id || !pw)) { ui.loginErr = t('Unknown employee ID'); render(); return; }
    const deviceId = dev.demo.unreg ? 'DEV-UNREG-' + (dev.deviceId.slice(-4)) : dev.deviceId;
    let r;
    try {
      r = MM.tx(d => {
        let e = face ? d.employees.find(x => x.device === deviceId) : d.employees.find(x => x.id === id);
        const eid = e ? e.id : (id || 'unknown');
        if (!e || (e.device && e.device !== deviceId)) {
          MM.addAudit(d, { empId: eid, what: 'Login from an unregistered phone', whatAr: 'تسجيل دخول من هاتف غير مسجل', code: 'DEVICE_UNBOUND', decision: 'blocked', device: deviceId });
          MM.notify(d, 'supervisor', 'Login blocked: unregistered phone (' + eid + ')', '', 'fraud');
          return { ok: false, msg: !e && face ? t('Unregistered phone') : t('This phone is not registered to employee') + ' ' + eid + '.' };
        }
        if (e.adStatus === 'blocked') { MM.addAudit(d, { empId: e.id, what: 'Login by a disabled AD account', whatAr: 'محاولة دخول بحساب معطل', code: 'AD_DISABLED', decision: 'blocked' }); return { ok: false, msg: t('Account disabled in Active Directory') }; }
        if (dev.demo.rooted || dev.demo.devMode) { MM.addAudit(d, { empId: e.id, what: dev.demo.rooted ? 'Login from a rooted / jailbroken phone' : 'Login with developer mode on', whatAr: 'محاولة دخول من جهاز غير آمن', code: dev.demo.rooted ? 'DEVICE_ROOTED' : 'DEV_MODE', decision: 'blocked' }); return { ok: false, msg: t('Device check failed') }; }
        if (!e.device) { e.device = deviceId; MM.addAudit(d, { empId: e.id, what: 'Phone registered to employee after HR reset', whatAr: 'تم تسجيل الهاتف للموظف', code: 'DEVICE_BOUND', decision: 'accepted' }); }
        MM.addActivity(d, { empId: e.id, text: 'Signed in on registered phone' + (face ? ' (Face ID)' : ''), kind: 'login' });
        return { ok: true, empId: e.id };
      });
    } catch (e) { ui.loginErr = e.message; render(); return; }
    if (!r.ok) { ui.loginErr = r.msg; ui.overlay = null; render(); return; }
    dev.session = { empId: r.empId, at: Date.now() }; ui.loginErr = null; ui.overlay = null;
    db().notifications.forEach(n => { dev.seen[n.id] = 1; }); saveDev();
    ui.stack = []; ui.screen = 'home'; render(); markSynced(14);
  }

  /* camera */
  let stream = null, camFail = false; // camFail: the device has no usable camera (only then a demo photo is offered)
  async function attachCamera() {
    const v = document.getElementById('camv'), hint = document.getElementById('camhint');
    if (!v) return;
    if (stream) { v.srcObject = stream; hint.textContent = ''; return; }
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('x');
      stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 } }, audio: false });
      const v2 = document.getElementById('camv'); if (v2) { v2.srcObject = stream; document.getElementById('camhint').textContent = ''; }
    } catch (e) { if (hint) hint.textContent = t('Camera not available in this browser'); if (!camFail) { camFail = true; render(); } }
  }
  function stopCamera() { if (stream) { stream.getTracks().forEach(tr => tr.stop()); stream = null; } }
  function finishPhoto(source) {
    const pos = getPos();
    const w0 = source.videoWidth || source.naturalWidth || source.width, h0 = source.videoHeight || source.naturalHeight || source.height;
    const sc = Math.min(1, 640 / w0); const c = document.createElement('canvas'); c.width = Math.round(w0 * sc); c.height = Math.round(h0 * sc);
    const g = c.getContext('2d'); g.drawImage(source, 0, 0, c.width, c.height);
    const label = MM.fmtTimeS(MM.now()) + ' · ' + pos.lat.toFixed(5) + ', ' + pos.lng.toFixed(5) + ' · ±' + Math.round(pos.acc) + 'm';
    g.font = 'bold ' + Math.max(12, Math.round(c.width / 34)) + 'px Inter, Arial'; const tw = g.measureText(label).width;
    g.fillStyle = 'rgba(17,24,39,.75)'; g.fillRect(10, c.height - 42, tw + 20, 32); g.fillStyle = '#fff'; g.fillText(label, 20, c.height - 20);
    const src = c.toDataURL('image/jpeg', 0.6);
    if (ui.overlay && ui.overlay.purpose === 'punch') { stopCamera(); ui.overlay = null; doPunch({ src, lat: pos.lat, lng: pos.lng, acc: Math.round(pos.acc), time: MM.now() }); return; }
    stopCamera(); ui.overlay = null;
    taskAction('photo', { photo: { lat: pos.lat, lng: pos.lng, src } });
  }

  /* ---------- events ---------- */
  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act]'); if (!el) return;
    const act = el.dataset.act, arg = el.dataset.arg;
    if (act === 'closeov-bg') { if (ev.target === el) { ui.overlay = ui.overlay && ui.overlay.back || null; render(); } return; }
    switch (act) {
      case 'tab': tab(arg); break;
      case 'go': if (arg === 'pending') ui.tsFilter = 'pending'; if (arg === 'newreq') ui.form = defaultForm(el.dataset.type || (ui.form && ui.screen === 'newreq' ? ui.form.type : 'leave')); go(arg); break;
      case 'back': back(); break;
      case 'lang': MM.setLang('m', arg); render(); break;
      case 'login': ui.busy = false; login(false); break;
      case 'faceid': ui.overlay = { type: 'face' }; render(); setTimeout(() => { ui.overlay = { type: 'face', ok: true }; render(); setTimeout(() => login(true), 650); }, 1300); break;
      case 'punch': doPunch(); break;
      case 'retry': ui.screen = 'attend'; ui.stack = []; render(); setTimeout(doPunch, 250); break;
      case 'remote': ui.stack = []; ui.screen = 'requests'; ui.form = defaultForm('remote'); go('newreq'); break;
      case 'closeov': ui.overlay = ui.overlay && ui.overlay.back || null; render(); break;
      case 'tileinfo': ui.overlay = { type: 'tile', key: arg }; render(); break;
      case 'profile': ui.overlay = { type: 'profile' }; render(); break;
      case 'logout': dev.session = null; saveDev(); ui.overlay = null; ui.screen = 'login'; ui.stack = []; render(); break;
      case 'ttab': ui.taskTab = arg; render(); break;
      case 'open': dev.lastTaskId = arg; saveDev(); go('task', { taskId: arg }); break;
      case 'usegps': dev.demo.loc = 'real'; dev.demo.locSet = 1; saveDev(); startRealGps(); render(); break;
      case 'svcall': ui.allSvc = !ui.allSvc; render(); break;
      // "Start" on a list only opens the task – the employee starts the job themselves on the task screen
      case 'tstart': { dev.lastTaskId = arg; saveDev(); go('task', { taskId: arg }); break; }
      case 'ta': taskAction(arg); break;
      case 'delay': ui.overlay = { type: 'delay' }; render(); break;
      case 'delayr': { ui.overlay = null; const n = document.getElementById('tNotes'); taskAction('delay', n ? { reason: arg, notes: n.value } : { reason: arg }); break; }
      case 'camera': ui.overlay = { type: 'camera' }; render(); break;
      case 'closecam': stopCamera(); ui.overlay = null; render(); break;
      case 'shoot': { const v = document.getElementById('camv'); if (stream && v && v.videoWidth) finishPhoto(v); else toast(t(camFail ? 'Camera not available in this browser' : 'Waiting for camera…'), '', 'warn'); break; }
      case 'samplephoto': { const pos = getPos(); if (ui.overlay && ui.overlay.purpose === 'punch') { stopCamera(); ui.overlay = null; doPunch({ sample: 1 + (Date.now() % 3), lat: pos.lat, lng: pos.lng, acc: Math.round(pos.acc), time: MM.now() }); break; } stopCamera(); ui.overlay = null; taskAction('photo', { photo: { lat: pos.lat, lng: pos.lng, sample: 1 + (Date.now() % 3) } }); break; }
      case 'rtype': { const keep = ui.form && ui.form.type !== 'missed' && arg !== 'missed' && ui.form.reason && ui.form.reason !== defaultForm(ui.form.type).reason ? ui.form.reason : null; ui.form = defaultForm(arg); if (keep) ui.form.reason = keep; render(); break; }
      case 'submitreq': submitRequest(); break;
      case 'syncnow': syncNow(); break;
      case 'rfilter': ui.reqFilter = arg; render(); break;
      case 'nfilter': ui.nFilter = arg; render(); break;
      case 'readall': myNotifs().forEach(n => dev.read[n.id] = 1); saveDev(); render(); break;
      case 'nopen': {
        const n = myNotifs().find(x => x.id === arg); if (!n) break;
        dev.read[n.id] = 1; saveDev();
        const l = n.link || (n.kind === 'approved' || n.kind === 'rejected' ? 'requests' : '');
        if (l.startsWith('task:') && taskById(l.slice(5))) { dev.lastTaskId = l.slice(5); saveDev(); go('task', { taskId: l.slice(5) }); }
        else if (l === 'pending' || l === 'attend' || l === 'requests') { if (l === 'requests') ui.reqFilter = 'all'; if (l === 'pending') ui.tsFilter = n.kind === 'returned' ? 'returned' : n.kind === 'approved' ? 'approved' : 'pending'; go(l); }
        else render();
        break;
      }
      case 'reqopen': ui.overlay = { type: 'req', id: arg }; render(); break;
      case 'viewphoto': ui.overlay = { type: 'photo', id: arg, back: ui.overlay }; render(); break;
      case 'tsfilter': ui.tsFilter = arg; render(); break;
      case 'tsopen': ui.overlay = { type: 'ts', k: +arg }; render(); break;
      case 'tsremind': { if (!online()) { toast(t('You are offline'), t('Try again when you have signal'), 'warn'); break; } const key = dev.session.empId + '|' + MM.ymd(+arg); MM.tx(d => { d.tsApprovals = d.tsApprovals || {}; const a = d.tsApprovals[key] = d.tsApprovals[key] || { status: 'pending', submittedAt: +arg }; a.remindedAt = MM.now(); MM.notify(d, 'supervisor', 'Reminder: ' + me().name + ' is waiting for approval of the time entry for ' + MM.fmtDate(+arg), '', 'request'); }); toast(t('Reminder sent'), (MM.lang === 'ar' ? 'إلى ' : 'To ') + supName(), 'ok'); render(); break; }
      case 'gosync': ui.overlay = null; go('sync'); break;
      case 'remind': {
        if (!online()) { toast(t('You are offline'), t('Try again when you have signal'), 'warn'); break; }
        MM.tx(d => { const r = d.requests.find(x => x.id === arg); if (!r) return; r.remindedAt = MM.now(); MM.notify(d, 'supervisor', 'Reminder: ' + me().name + ' is waiting for a decision on ' + r.id, 'تذكير: ' + me().nameAr + ' بانتظار قرار على ' + r.id, 'request'); });
        toast(t('Reminder sent'), (MM.lang === 'ar' ? 'إلى ' : 'To ') + supName(), 'ok'); render(); break;
      }
      case 'hmonth': ui.hMonth = Math.max(-1, Math.min(0, ui.hMonth + +arg)); ui.hDay = null; render(); break;
      case 'hday': ui.hDay = +arg; render(); break;
      case 'fixday': { ui.overlay = null; const d = new Date(+arg); ui.form = defaultForm('missed'); ui.form.date = d.getFullYear() + '-' + MM.pad(d.getMonth() + 1) + '-' + MM.pad(d.getDate()); ui.form.punchType = myPunches().some(p => p.type === 'IN' && MM.dayStart(p.time) === +arg) ? 'OUT' : 'IN'; ui.form.time = ui.form.punchType === 'OUT' ? '14:30' : '07:30'; go('newreq'); break; }
      case 'demo': ui.overlay = { type: 'demo' }; render(); break;
      case 'resetdemo': if (confirm(t('Reset all demo data?'))) { MM.reset(); dev.queue = []; dev.seen = {}; dev.demo = { loc: 'inside', mock: false, weak: false, rooted: false, devMode: false, skew: false, offline: false, unreg: false }; MM.setPaused(false); saveDev(); ui.overlay = null; ui.form = null; db().notifications.forEach(n => dev.seen[n.id] = 1); saveDev(); render(); } break;
    }
  });
  document.addEventListener('change', ev => {
    const el = ev.target;
    if (el.dataset.demo) {
      dev.demo[el.dataset.demo] = el.checked; saveDev();
      if (el.dataset.demo === 'offline') { MM.setPaused(el.checked); if (!el.checked) { MM.S.reachable = true; MM.poll().then(() => syncNow()); } }
      render();
    } else if (el.dataset.demoLoc) { dev.demo.loc = el.dataset.demoLoc; dev.demo.locSet = 1; saveDev(); if (dev.demo.loc === 'real') startRealGps(); render(); }
    else if (el.dataset.clockMode) { MM.tx(d => { d.settings.clock = el.dataset.clockMode; d.settings.clockStart = Date.now(); }); render(); }
    else if (el.dataset.f && ui.form) { ui.form[el.dataset.f] = el.value; if (el.dataset.rerender) render(); }
    else if (el.id === 'rfile' && el.files[0]) { ui.form.file = el.files[0].name; render(); }
  });
  document.addEventListener('input', ev => { const el = ev.target; if (el.dataset.f && ui.form) ui.form[el.dataset.f] = el.value; });
  document.addEventListener('focusout', ev => {
    if (ev.target.id === 'tNotes' && !(ev.relatedTarget && ev.relatedTarget.closest('[data-act]'))) { const x = taskById(ui.taskId); if (x && ev.target.value !== x.notes) taskAction('notes', { notes: ev.target.value }); }
    setTimeout(() => { if (pendingRender) scheduleRender(); }, 0);
  });
  window.addEventListener('online', () => { scheduleRender(); syncNow(); });
  window.addEventListener('offline', () => scheduleRender());

  /* notifications for this employee (push simulation) */
  function checkNotifications() {
    if (!dev.session) return;
    let any = false;
    db().notifications.forEach(n => {
      if (dev.seen[n.id]) return; dev.seen[n.id] = 1; any = true;
      if (n.to === dev.session.empId || n.to === 'all') toast(nTitle(n), nText(n), n.kind === 'approved' ? 'ok' : n.kind === 'rejected' ? 'bad' : 'info');
    });
    if (any) saveDev();
  }

  /* ---------- boot ---------- */
  MM.init({ app: 'm' }).then(() => {
    MM.setLang('m', MM.lang);
    if (dev.demo.offline) MM.setPaused(true);
    if (dev.session && !MM.empById(dev.session.empId)) dev.session = null;
    if (!Object.keys(dev.seen).length) db().notifications.forEach(n => dev.seen[n.id] = 1);
    saveDev();
    // the app uses the device's real GPS by default; demo locations are used only when the presenter picks one in the settings
    if (!dev.demo.locSet && window.isSecureContext && navigator.geolocation) dev.demo.loc = 'real';
    if (dev.demo.loc === 'real') startRealGps();
    render();
    MM.onChange(() => { checkNotifications(); scheduleRender(); if (dev.queue.length && online() && !ui.syncing) syncNow(true); }); // server reachable again → send the offline queue
    if (window.MMB) MMB.onload = () => scheduleRender(); // the logo image can arrive after the first draw on a phone
    setInterval(() => { document.querySelectorAll('[data-clock]').forEach(el => { el.textContent = MM.fmtTimeS(MM.now()); MM.arabizeDigits(el); }); }, 1000);
    setInterval(() => syncNow(true), 5 * 60 * 1000);
    syncNow(true);
  });
})();
