/* MM Smart Attendance – web management portal (Muscat Municipality design) */
(function () {
  'use strict';
  // inside the demo console the portal is already scaled by the console – don't scale it twice
  try { if (window.top !== window) document.documentElement.classList.add('embed'); } catch (e) { document.documentElement.classList.add('embed'); }
  const { t, esc, icon: I } = MM;
  const db = () => MM.db();
  const AR = () => MM.lang === 'ar';
  const L = (en, ar) => AR() && ar ? ar : en;

  MM.addAR({
    'Smart Attendance & Field Operations Management System': 'نظام الحضور الذكي وإدارة العمليات الميدانية', 'Muscat Municipality': 'بلدية مسقط',
    'Dashboard': 'لوحة المعلومات', 'Attendance': 'الحضور', 'Field Operations': 'العمليات الميدانية', 'Tasks': 'المهام', 'Employees': 'الموظفون', 'Shifts & Rosters': 'الورديات والجداول',
    'Locations & Geofences': 'المواقع والنطاقات', 'filled in automatically': 'يُملأ تلقائياً', 'edited by hand': 'معدّل يدوياً', 'Inspection points': 'نقاط التفتيش', 'Approvals': 'الموافقات', 'Reports & Analytics': 'التقارير والتحليلات', 'Administration': 'الإدارة', 'Home': 'الرئيسية',
    'Search for employee, task, location, or document...': 'ابحث عن موظف أو مهمة أو موقع أو مستند...', 'Sign out': 'تسجيل الخروج', 'Switch user': 'تبديل المستخدم',
    'Good Morning,': 'صباح الخير،', 'Good Afternoon,': 'مساء الخير،', 'Good Evening,': 'مساء الخير،', 'Together for a cleaner, safer and more sustainable Muscat.': 'معاً من أجل مسقط أنظف وأكثر أماناً واستدامة.',
    'Clear Sky': 'سماء صافية', 'Sustainable Communities for a Brighter Tomorrow': 'مجتمعات مستدامة لغدٍ أكثر إشراقاً',
    'Total Employees': 'إجمالي الموظفين', 'Present Today': 'الحاضرون اليوم', 'Absent Today': 'الغائبون اليوم', 'Late Arrivals': 'المتأخرون', 'Field Staff Active': 'الكوادر الميدانية النشطة', 'On Leave': 'في إجازة',
    'vs last month': 'مقارنة بالشهر الماضي', 'vs yesterday': 'مقارنة بالأمس', 'Attendance Overview': 'نظرة عامة على الحضور', 'Staff & Roster Management': 'إدارة الموظفين والمناوبات', 'Last 30 Days': 'آخر ٣٠ يوماً', 'days so far': 'يوماً حتى الآن', 'avg': 'متوسط', 'present': 'حاضر', 'This Week': 'هذا الأسبوع', 'This Month': 'هذا الشهر', 'Present': 'حاضر', 'Expected': 'متوقع',
    'Field Operations Status': 'حالة العمليات الميدانية', 'Total Tasks': 'إجمالي المهام', 'On Site': 'في الموقع', 'In Progress': 'قيد التنفيذ', 'Completed': 'مكتملة', 'Delayed': 'متأخرة', 'Overdue': 'متجاوزة',
    'Pending Approvals': 'الموافقات المعلقة', 'View All': 'عرض الكل', 'Leave Requests': 'طلبات الإجازة', 'Awaiting manager approval': 'بانتظار موافقة المدير', 'Attendance Corrections': 'تصحيحات الحضور', 'Requires review': 'تتطلب مراجعة',
    'Field Task Completions': 'إنجاز المهام الميدانية', 'Pending verification': 'بانتظار التحقق', 'Shift Change Requests': 'طلبات تغيير الوردية', 'Requires approval': 'تتطلب موافقة',
    'Live Field Staff': 'الكوادر الميدانية المباشرة', 'View Map': 'عرض الخريطة', 'Recent Activity': 'النشاط الأخير', 'Announcements': 'الإعلانات',
    'ATTENDANCE MANAGEMENT': 'إدارة الحضور', 'Track Attendance, Build a Stronger Workforce': 'تتبع الحضور، لبناء قوة عمل أقوى', 'Accurate attendance for efficient operations and a better Muscat.': 'حضور دقيق لعمليات فعّالة ومسقط أفضل.',
    'People are the foundation of progress.': 'الإنسان أساس التقدم.', 'Working Hours': 'ساعات العمل', 'Office Hours': 'ساعات الدوام', 'Attendance Records': 'سجلات الحضور', 'Shift Management': 'إدارة الورديات', 'Add Attendance': 'إضافة حضور',
    'All Departments': 'جميع الإدارات', 'All Locations': 'جميع المواقع', 'All Status': 'جميع الحالات', 'All Statuses': 'جميع الحالات', 'All Roles': 'جميع الأدوار', 'Reset': 'إعادة تعيين', 'Employee': 'الموظف', 'Department': 'الإدارة', 'Location': 'الموقع',
    'Check In': 'الحضور', 'Check Out': 'الانصراف', 'Hours': 'الساعات', 'Geofence Status': 'حالة النطاق', 'Status': 'الحالة', 'Actions': 'الإجراءات', 'Within Geofence': 'داخل النطاق', 'Outside Geofence': 'خارج النطاق', 'Late': 'متأخر', 'Absent': 'غائب',
    'Geofence Login/Logout Activity': 'نشاط الدخول والخروج من النطاق', 'Attendance Summary': 'ملخص الحضور', 'View Details': 'عرض التفاصيل', 'Showing': 'عرض', 'of': 'من', 'employees': 'موظفين',
    'Record employee check-in/out with accurate location tracking': 'تسجيل حضور وانصراف الموظفين مع تتبع دقيق للموقع', 'Accurate attendance builds a stronger tomorrow.': 'الحضور الدقيق يبني غداً أقوى.',
    'Attendance Details': 'تفاصيل الحضور', 'Fields marked with * are required': 'الحقول المميزة بـ * مطلوبة', 'Date': 'التاريخ', 'Attendance Type': 'نوع الحضور', 'Time': 'الوقت', 'Auto-captured': 'التقاط تلقائي', 'Use Current Location': 'استخدام الموقع الحالي',
    'You are inside the allowed location': 'أنت داخل الموقع المسموح', 'Notes (Optional)': 'ملاحظات (اختياري)', 'Photo (Optional)': 'صورة (اختياري)', 'Upload Photo': 'رفع صورة', 'Save Attendance': 'حفظ الحضور', 'Live Location & Geofence': 'الموقع المباشر والنطاق',
    'Location Details': 'تفاصيل الموقع', 'Address': 'العنوان', 'Latitude': 'خط العرض', 'Longitude': 'خط الطول', 'Accuracy': 'الدقة', 'Geofence Radius': 'نصف قطر النطاق', "Today's Attendance": 'حضور اليوم', 'Checked In': 'سجلوا الحضور', 'Yet to Check In': 'لم يسجلوا بعد',
    'Quick Employee Status': 'حالة الموظفين السريعة', 'Checked Out': 'سجلوا الانصراف', 'Search employee...': 'ابحث عن موظف...',
    'FIELD OPERATIONS': 'العمليات الميدانية', 'Operations in the Field,': 'العمليات في الميدان،', 'A Cleaner, Greener Muscat': 'مسقط أنظف وأكثر خضرة', 'Monitor field teams, track tasks, and ensure timely completion across all locations.': 'راقب الفرق الميدانية وتابع المهام واضمن الإنجاز في الوقت المحدد في جميع المواقع.',
    'A cleaner city today, a brighter tomorrow.': 'مدينة أنظف اليوم، غدٌ أكثر إشراقاً.', 'Live View': 'العرض المباشر', 'Task List': 'قائمة المهام', 'Task Board': 'لوحة المهام', 'Assign Task': 'إسناد مهمة', 'Field Teams': 'الفرق الميدانية', 'Search team or employee...': 'ابحث عن فريق أو موظف...',
    'All': 'الكل', 'In Transit': 'في الطريق', 'Idle': 'خامل', 'Offline': 'غير متصل', 'Task Details': 'تفاصيل المهمة', 'Open in Maps': 'فتح في الخرائط', 'Scheduled Date': 'الموعد', 'Task Type': 'نوع المهمة', 'Priority': 'الأولوية', 'Assigned To': 'مسندة إلى', 'Progress': 'التقدم',
    'Photos': 'الصور', 'Add Photo': 'إضافة صورة', 'Activity Timeline': 'الخط الزمني للنشاط', 'Update Status': 'تحديث الحالة', 'Add Note': 'إضافة ملاحظة', 'Reassign': 'إعادة إسناد', 'Select a team member or task to see its details.': 'اختر عضواً أو مهمة لعرض التفاصيل.',
    'Active Tasks': 'المهام النشطة', 'Search by task, location or employee...': 'ابحث بالمهمة أو الموقع أو الموظف...', 'All Task Types': 'جميع أنواع المهام', 'Description': 'الوصف', 'Live Location': 'الموقع المباشر', 'Last updated': 'آخر تحديث',
    'Assigned': 'مسندة', 'Under Review': 'قيد المراجعة', 'Field Staff': 'الكوادر الميدانية', 'Create Task': 'إنشاء مهمة', 'Bulk Assign': 'إسناد جماعي', 'Export': 'تصدير', 'Live Sync': 'مزامنة مباشرة', 'Last synced': 'آخر مزامنة', 'Task Queue': 'قائمة المهام',
    'Today': 'اليوم', 'Unassigned': 'غير مسندة', 'Awaiting Review': 'بانتظار المراجعة', 'List': 'قائمة', 'Board': 'لوحة', 'Calendar': 'تقويم', 'selected': 'محدد', 'Assign': 'إسناد', 'Change Status': 'تغيير الحالة', 'Verify': 'تحقق',
    'Task ID': 'رقم المهمة', 'Task Name': 'اسم المهمة', 'Type': 'النوع', 'Schedule': 'الجدولة', 'Geofence': 'النطاق', 'Last Update': 'آخر تحديث', 'Inside': 'داخل', 'Outside': 'خارج', 'Checklist': 'قائمة التحقق', 'Notes': 'الملاحظات', 'Activity': 'النشاط', 'Details': 'التفاصيل',
    'Manage your workforce, assign roles, track activity and maintain employee information.': 'أدر القوى العاملة وأسند الأدوار وتابع النشاط وحافظ على بيانات الموظفين.', 'Empowered people build a cleaner, stronger Muscat.': 'الكوادر المُمكَّنة تبني مسقط أنظف وأقوى.',
    'All Employees': 'جميع الموظفين', 'Active': 'نشط', 'Inactive': 'غير نشط', 'Office Staff': 'الموظفون المكتبيون', 'Add Employee': 'إضافة موظف', 'Search by name, employee ID, phone, email...': 'ابحث بالاسم أو الرقم أو الهاتف أو البريد...',
    'Assign Role': 'إسناد دور', 'Assign Location': 'إسناد موقع', 'Employee ID': 'الرقم الوظيفي', 'Role': 'الدور', 'Last Active': 'آخر نشاط', 'Overview': 'نظرة عامة', 'Documents': 'المستندات', 'History': 'السجل', 'Basic Information': 'المعلومات الأساسية',
    'Full Name': 'الاسم الكامل', 'Email': 'البريد', 'Phone': 'الهاتف', 'Date of Birth': 'تاريخ الميلاد', 'Nationality': 'الجنسية', 'Gender': 'الجنس', 'Work Information': 'معلومات العمل', 'Reporting Manager': 'المدير المباشر', 'Joining Date': 'تاريخ الالتحاق',
    'Employment Type': 'نوع التوظيف', 'Shift': 'الوردية', 'Geofence Access': 'صلاحية النطاق', 'Enabled': 'مفعّل', 'Registered Device': 'الجهاز المسجل', 'AD Account': 'حساب الدليل النشط', 'View Location': 'عرض الموقع', 'Message': 'رسالة', 'More': 'المزيد',
    'Create and manage work schedules, assign employees, and ensure proper coverage across all locations.': 'أنشئ جداول العمل وأدرها وأسند الموظفين واضمن التغطية في جميع المواقع.', 'Well planned teams build a better Muscat.': 'الفرق المخطط لها جيداً تبني مسقط أفضل.',
    'Total Shifts': 'إجمالي الورديات', 'Scheduled Employees': 'الموظفون المجدولون', 'Filled Shifts': 'الورديات المملوءة', 'Unfilled Shifts': 'الورديات الشاغرة', 'Roster View': 'عرض الجدول', 'Shift Templates': 'قوالب الورديات', 'Rules & Locks': 'القواعد والأقفال',
    'Shift Details': 'تفاصيل الوردية', 'Unassigned Shifts': 'الورديات غير المسندة', 'Quick Actions': 'إجراءات سريعة', 'Download Roster': 'تنزيل الجدول', 'Publish Roster': 'نشر الجدول', 'Notify Team': 'إخطار الفريق', 'Import Schedule': 'استيراد جدول',
    'Off': 'راحة', 'Leave': 'إجازة', 'needed': 'مطلوب', 'Edit Shift': 'تعديل الوردية', 'Duplicate': 'نسخ',
    'Sign In': 'تسجيل الدخول', 'Welcome Back': 'مرحباً بعودتك', 'Sign in to access the Smart Attendance & Field Operations Management System': 'سجّل الدخول للوصول إلى نظام الحضور الذكي وإدارة العمليات الميدانية', 'Username / Email': 'اسم المستخدم / البريد',
    'Enter your username or email': 'أدخل اسم المستخدم أو البريد', 'Password': 'كلمة المرور', 'Enter your password': 'أدخل كلمة المرور', 'Forgot Password?': 'نسيت كلمة المرور؟', 'Sign in with SSO': 'الدخول الموحد (SSO)', 'or': 'أو',
    'This system is for authorized Muscat Municipality users only.': 'هذا النظام مخصص لمستخدمي بلدية مسقط المصرح لهم فقط.', 'All activities are monitored and logged.': 'جميع الأنشطة مراقبة ومسجلة.',
    'A Greener, Smarter Muscat Together': 'معاً نحو مسقط أكثر خضرة وذكاءً', 'Empowering people. Enhancing places.': 'تمكين الإنسان. تطوير المكان.', 'Building a sustainable future.': 'بناء مستقبل مستدام.', 'Sustainable City': 'مدينة مستدامة', 'People First': 'الإنسان أولاً', 'Efficient Services': 'خدمات فعّالة', 'Smart Attendance & Field Operations': 'الحضور الذكي والعمليات الميدانية', 'Geofenced check-in, live field task tracking and payroll-ready attendance': 'تسجيل حضور داخل النطاق الجغرافي، وتتبع مباشر للمهام الميدانية، وحضور جاهز للرواتب', 'in one secure platform for Muscat Municipality staff.': 'في منصة آمنة واحدة لموظفي بلدية مسقط.', 'Geofenced Check-in': 'حضور داخل النطاق', 'Field Task Tracking': 'تتبع المهام الميدانية', 'Payroll-ready Reports': 'تقارير جاهزة للرواتب',
    'Privacy Policy': 'سياسة الخصوصية', 'Terms of Use': 'شروط الاستخدام', 'Help': 'المساعدة', '© 2026 Muscat Municipality. All rights reserved.': '© ٢٠٢٦ بلدية مسقط. جميع الحقوق محفوظة.',
    'Approve': 'اعتماد', 'Reject': 'رفض', 'Return': 'إرجاع', 'Approved': 'معتمد', 'Rejected': 'مرفوض', 'Pending': 'قيد الانتظار', 'Cancel': 'إلغاء', 'Save': 'حفظ', 'Close': 'إغلاق', 'Evidence': 'الإثبات', 'Decision': 'القرار', 'Request': 'الطلب',
    'Anti-fraud audit log': 'سجل تدقيق مكافحة الاحتيال', 'Decision history': 'سجل القرارات', 'Waiting for approval': 'بانتظار الموافقة', 'Reason code': 'رمز السبب', 'Server decision': 'قرار الخادم', 'What happened': 'ماذا حدث', 'Export to CSV': 'تصدير CSV', 'Blocked': 'محظور', 'Accepted': 'مقبول',
    'Integrations': 'التكاملات', 'Users & Roles': 'المستخدمون والأدوار', 'Mobile App Services': 'خدمات التطبيق', 'Sync Log': 'سجل المزامنة', 'Run now': 'تشغيل الآن', 'Reset device': 'إعادة تعيين الجهاز', 'Block (leaver)': 'حظر (مغادر)', 'Unblock': 'إلغاء الحظر',
    'Missed punch': 'بصمة فائتة', 'Annual leave': 'إجازة سنوية', 'Overtime': 'عمل إضافي', 'Short permission': 'استئذان', 'Remote work': 'عمل عن بعد', 'Shift change': 'تغيير وردية', 'Task sign-off': 'اعتماد مهمة', 'Sign off': 'اعتماد',
    'Import from ArcGIS': 'استيراد من ArcGIS', 'New geofence': 'نطاق جديد', 'Polygon': 'مضلع', 'Circle': 'دائرة', 'Shape': 'الشكل', 'Buffer zone (m)': 'المنطقة العازلة (م)', 'Min GPS accuracy (m)': 'أدنى دقة للموقع (م)', 'Valid': 'الصلاحية', 'Permanent': 'دائم', 'Temporary': 'مؤقت', 'Radius (m)': 'نصف القطر (م)', 'Site name': 'اسم الموقع', 'Assigned to': 'مسند إلى', 'Add': 'إضافة',
    'New assignee': 'الموظف الجديد', 'Search by name, ID, area or role…': 'ابحث بالاسم أو الرقم أو المنطقة أو الوظيفة…', 'No employee matches your search': 'لا يوجد موظف يطابق البحث', 'Start time': 'وقت البدء', 'End time': 'وقت الانتهاء', 'open': 'مفتوحة', 'Choose the new assignee': 'اختر الموظف الجديد', 'Search by name and pick an employee from the list': 'ابحث بالاسم واختر موظفاً من القائمة', 'Check the time': 'تحقق من الوقت', 'End time must be after the start time': 'يجب أن يكون وقت الانتهاء بعد وقت البدء', 'Drag corners to reshape · drag a + to add a corner · double-click a corner to remove it': 'اسحب الزوايا لتعديل الشكل · اسحب + لإضافة زاوية · انقر مرتين على زاوية لحذفها', 'Drag to move this corner · double-click to remove it': 'اسحب لتحريك هذه الزاوية · انقر مرتين لحذفها', 'A polygon needs at least 3 corners': 'يحتاج المضلع إلى 3 زوايا على الأقل', 'Drag or click to add a corner here': 'اسحب أو انقر لإضافة زاوية هنا', 'corners': 'زوايا', 'Keep typing to search places…': 'تابع الكتابة للبحث عن الأماكن…', 'Oman': 'عُمان', 'Could not find that place on the map – try another result': 'تعذّر العثور على هذا المكان على الخريطة – جرّب نتيجة أخرى', 'Drag the corner points to adjust the boundary': 'اسحب النقاط لتعديل الحدود', 'Drag the circle to move it · drag the edge point to resize': 'اسحب الدائرة لتحريكها · اسحب نقطة الحافة لتغيير الحجم', 'Drag the shape to move it · drag the corner points to reshape': 'اسحب الشكل لتحريكه · اسحب النقاط لتعديل الحدود', 'Geofence saved – phones use it immediately': 'تم حفظ النطاق – تستخدمه الهواتف فوراً', 'Search a location, area or coordinates…': 'ابحث عن موقع أو منطقة أو إحداثيات…', 'Searching…': 'جارٍ البحث…', 'No places found – try another name, or type coordinates like 23.6139, 58.5922': 'لم يتم العثور على أماكن – جرّب اسماً آخر أو اكتب إحداثيات مثل 23.6139, 58.5922', 'Coordinates': 'إحداثيات', 'Map search needs an internet connection – saved sites and coordinates still work': 'البحث في الخريطة يحتاج اتصالاً بالإنترنت – المواقع المحفوظة والإحداثيات تعمل', 'Geofence moved to': 'تم نقل النطاق إلى', 'Adjust the shape if needed, then press Save': 'عدّل الشكل إن لزم ثم اضغط حفظ', 'Clear': 'مسح', 'staff': 'موظفاً', 'ends': 'ينتهي',
    'Attendance rules': 'قواعد الحضور', 'Attendance periods & payroll locks': 'فترات الحضور وأقفال الرواتب', 'Open': 'مفتوح', 'Soft lock': 'قفل مبدئي', 'Hard lock': 'قفل نهائي', 'Payroll-complete · permanent': 'اكتمل الراتب · دائم', 'Export to Oracle Payroll': 'تصدير إلى رواتب أوراكل', 'Re-open': 'إعادة فتح',
    'Greener, Smarter Muscat Together': 'معاً نحو مسقط أكثر خضرة وذكاءً', 'Open mobile app': 'فتح تطبيق الهاتف', 'Demo console': 'وحدة العرض', 'Reset demo data': 'إعادة ضبط البيانات', 'Notifications': 'الإشعارات', 'Sent to phone': 'أُرسل إلى الهاتف', 'Reports': 'التقارير', 'Live today': 'مباشر اليوم', 'staff in the field': 'موظفاً في الميدان', 'on site': 'في الموقع', 'open tasks': 'مهمة مفتوحة', 'delayed': 'متأخرة', 'Live records for today': 'سجلات اليوم المباشرة', 'Records for': 'سجلات', 'present of': 'حاضر من', 'rostered': 'مجدولين', 'On time': 'في الموعد', 'On leave': 'في إجازة', 'Clear filters': 'مسح الفلاتر', 'Search by name, ID or department...': 'ابحث بالاسم أو الرقم أو الإدارة...', 'Geofence activity': 'نشاط النطاق', 'Last 7 days': 'آخر ٧ أيام', 'Active Employees': 'الموظفون النشطون', 'Not Checked In': 'لم يسجلوا الحضور',
  });

  /* ---------------- state ---------------- */
  const LEGACY = { dispatch: 'fieldops', integrations: 'admin', users: 'admin', sync: 'admin', audit: 'approvals' };
  const hashPage = () => { const h = (location.hash || '#dashboard').slice(1); return LEGACY[h] || h || 'dashboard'; };
  const ui = {
    page: hashPage(), session: localStorage.getItem('mmsa.portal.session'), role: localStorage.getItem('mmsa.portal.role') || 'director',
    collapsed: false, mobileOpen: false, menu: null, modal: null, search: '', flash: {}, dragging: false, showPw: false,
    att: { tab: 'records', dept: 'all', site: 'all', status: 'all', q: '', page: 1 },
    add: null, quick: 'in',
    fo: { view: 'live', team: 'all', q: '', selEmp: '100124', selTask: 'TSK-1043', ltab: 'active', type: 'all' },
    tk: { view: 'list', group: 'today', sel: 'TSK-1043', checked: {}, loc: 'all', type: 'all', who: 'all', pri: 'all', q: '', date: null, page: 1 },
    emp: { tab: 'all', q: '', dept: 'all', site: 'all', role: 'all', status: 'all', sel: '100124', ptab: 'overview', checked: {}, page: 1 },
    sh: { tab: 'roster', week: 0, tpl: 'M', editRules: false },
    geo: { sel: 'muttrah', draft: null },
    dash: { att: 'week', fo: 'today' },
    ap: { tab: location.hash === '#audit' ? 'audit' : 'pending', filter: 'all', tf: 'pending' },
    adm: { tab: 'users', q: '', page: 1 }, running: null, ptab: 'details',
  };
  const user = () => db().people[ui.role] || db().people.director;
  const emp = id => MM.empById(id);
  const nameOf = e => e ? L(e.name, e.nameAr) : '—';
  const pill = (cls, txt, nodot) => '<span class="pill ' + cls + (nodot ? ' nodot' : '') + '">' + txt + '</span>';
  function initials(name) { const p = String(name).split(' ').filter(w => !/^al$/i.test(w)); return ((p[0] || '?')[0] + ((p.length > 1 ? p[p.length - 1] : '')[0] || '')).toUpperCase(); }
  function av(e, cls) { if (!e) return '<span class="av ' + (cls || '') + '">?</span>'; return '<span class="av ' + (e.gender === 'F' ? 'f ' : '') + (cls || '') + '">' + (AR() ? e.nameAr.charAt(0) : initials(e.name)) + '</span>'; }
  function person(e, sub) { return '<div class="person">' + av(e) + '<div style="min-width:0"><b>' + esc(nameOf(e)) + '</b><small>' + esc(sub != null ? sub : (e ? L(e.role, e.roleAr) : '')) + '</small></div></div>'; }
  const MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const fmtDateL = ms => { const d = new Date(ms); return MM.fmtDay(ms) + ', ' + d.getDate() + ' ' + (AR() ? MM.MON_AR : MONL)[d.getMonth()] + ' ' + d.getFullYear(); };
  const ampm = ms => { const d = new Date(ms); let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return MM.pad(h) + ':' + MM.pad(d.getMinutes()) + ' ' + ap; };
  function ago(ms) { const m = Math.round((MM.now() - ms) / 60000); if (m < 1) return 'just now'; if (m < 60) return m + 'm ago'; if (m < 1440) return Math.round(m / 60) + 'h ago'; return MM.fmtDateShort(ms); }

  function toast(title, body, kind) {
    const el = document.createElement('div');
    el.className = 'toast ' + (kind || 'ok');
    el.innerHTML = I(kind === 'bad' ? 'ban' : kind === 'warn' ? 'alert' : kind === 'info' ? 'bell' : 'check', 20) + '<div><b>' + esc(title) + '</b>' + (body ? '<span>' + esc(body) + '</span>' : '') + '</div>';
    document.getElementById('toasts').appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s'; el.style.opacity = 0; setTimeout(() => el.remove(), 300); }, 4200);
  }

  /* ---------------- task helpers ---------------- */
  const TS = { assigned: ['Assigned', 'p-blue'], ontheway: ['In Transit', 'p-blue'], onsite: ['On Site', 'p-green'], inprogress: ['In Progress', 'p-blue'], delayed: ['Delayed', 'p-red'], done: ['Under Review', 'p-purple'], signed: ['Completed', 'p-green'] };
  const isOverdue = x => !['done', 'signed'].includes(x.status) && (x.status === 'delayed' || MM.now() > x.due + 30 * 60000);
  function tStatus(x) { const s = TS[x.status]; return pill(s[1], t(x.status === 'delayed' && MM.now() > x.due ? 'Overdue' : s[0])); }
  function prio(x) { return pill({ High: 'p-red', Normal: 'p-amber', Low: 'p-green' }[x.priority] || 'p-gray', t(x.priority)); }
  function progress(x) { return { assigned: 0, ontheway: 10, onsite: 30, inprogress: Math.min(90, 45 + x.photos.length * 10), delayed: x.arrivedAt ? 40 : 20, done: 100, signed: 100 }[x.status]; }
  const CHECK = {
    'Inspection': ['Arrived on site', 'Premises inspected', 'Violations recorded', 'Photos captured', 'Owner briefed'],
    'Waste Management': ['Reached location', 'Started collection', 'Bins emptied', 'Photos captured', 'Area left clean'],
    'Tree Maintenance': ['Reached location', 'Pruning completed', 'Green waste removed', 'Photos captured', 'Area left clean'],
    'Maintenance': ['Reached location', 'Fault assessed', 'Repair completed', 'Photos captured', 'Facility tested'],
    default: ['Area swept and debris removed', 'Waste collected and disposed', 'Public bins emptied', 'Sidewalks washed', 'Photos captured'],
  };
  function checklist(x) { const items = CHECK[x.type] || CHECK.default; const n = Math.round(items.length * progress(x) / 100); return items.map((s, i) => ({ s, done: i < n || (s === 'Photos captured' && x.photos.length > 0) })); }
  const tIcon = x => MM.TASK_TYPES[x.type] || 'clipboard';
  const activeTasks = () => db().tasks.filter(x => !['done', 'signed'].includes(x.status));
  const lastUpd = x => x.history[x.history.length - 1][1];
  function sla(x) { const d = x.due - MM.now(); const neg = d < 0, a = Math.abs(d); const h = Math.floor(a / 3600e3), m = Math.floor(a % 3600e3 / 60000), s = Math.floor(a % 60000 / 1000); return (neg ? '-' : '') + MM.pad(h) + ':' + MM.pad(m) + ':' + MM.pad(s); }
  function taskGeo(x) { if (x.arrivedAt && !['assigned', 'ontheway'].includes(x.status)) return true; const c = db().crew[x.assignee]; return c ? MM.haversine(c, x) <= x.radius * 3 : false; }

  /* ---------------- attendance helpers ---------------- */
  function livePunchesToday() { const d0 = MM.dayStart(); return db().punches.filter(p => p.time >= d0 && (p.status === 'accepted' || p.status === 'corrected')); }
  let attCache = { d: null, k: '', v: null };
  function attRecords() {
    // indexed + cached per data version: 2,000 employees stay fast
    const D = db(), k = D.punches.length + '|' + D.employees.length + '|' + D.employees.reduce((a, e) => a + (e.status === 'active' ? 1 : e.status === 'leave' ? 2 : 3), 0);
    if (attCache.d === D && attCache.k === k) return attCache.v;
    const d0 = MM.dayStart(), byEmp = {};
    D.punches.forEach(p => { if (p.time >= d0 && (p.status === 'accepted' || p.status === 'corrected')) (byEmp[p.empId] = byEmp[p.empId] || []).push(p); });
    const v = D.employees.filter(e => e.status !== 'inactive').map(e => {
      const ps = (byEmp[e.id] || []).sort((a, b) => a.time - b.time);
      const i = ps.find(p => p.type === 'IN'), o = ps.filter(p => p.type === 'OUT').pop();
      const status = !i ? (e.status === 'leave' ? 'leave' : 'absent') : (i.late || i.late2) ? 'late' : 'present';
      const geo = !i ? null : i.manual ? 'na' : i.geo === 'outside' ? 'outside' : 'inside';
      return { e, i, o, status, geo, hours: i && o ? o.time - i.time : null };
    });
    attCache = { d: D, k, v };
    return v;
  }
  const ATT_PILL = { present: ['Present', 'p-green'], late: ['Late', 'p-amber'], absent: ['Absent', 'p-red'], leave: ['On Leave', 'p-purple'], off: ['Off', 'p-gray'] };
  // records for any of the last 7 days: today is live; earlier days come from the stored daily status codes
  const hsh = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  let pastCache = {};
  function attRecordsFor(day) {
    if (day == null || day === MM.dayStart()) return attRecords();
    const D = db(), h = (D.history || []).find(x => x.day === day); if (!h || !h.codes) return null;
    const key = day + '|' + D.punches.length + '|' + D.employees.length; if (pastCache.d === D && pastCache.k === key) return pastCache.v;
    const byEmp = {}; D.punches.forEach(p => { if (MM.dayStart(p.time) === day && (p.status === 'accepted' || p.status === 'corrected')) (byEmp[p.empId] = byEmp[p.empId] || []).push(p); });
    const v = [];
    D.employees.forEach((e, idx) => {
      const c = h.codes[idx]; if (!c || c === 'I') return;
      if (c === 'O' || c === 'A' || c === 'V') { v.push({ e, status: { O: 'off', A: 'absent', V: 'leave' }[c], geo: null }); return; }
      const ps = (byEmp[e.id] || []).sort((a, b) => a.time - b.time), x = hsh(e.id + ':' + day);
      const i = ps.find(p => p.type === 'IN') || { id: 'h' + e.id, time: day + (c === 'L' ? 7 * 60 + 47 + x % 25 : 6 * 60 + 25 + x % 60) * 60000, late: c === 'L' ? 17 + x % 20 : 0 };
      const o = ps.filter(p => p.type === 'OUT').pop() || { time: day + (14 * 60 + 30 + (x >>> 7) % 45) * 60000 };
      v.push({ e, i, o, status: c === 'L' ? 'late' : 'present', geo: i.manual ? 'na' : i.geo === 'outside' ? 'outside' : 'inside', hours: o.time - i.time });
    });
    pastCache = { d: D, k: key, v };
    return v;
  }
  function countsFrom(recs) {
    const n = st => recs.filter(r => st.includes(r.status)).length;
    return { total: db().employees.length, active: recs.length - n(['off']), present: n(['present', 'late']), late: n(['late']), absent: n(['absent']), leave: n(['leave']), off: n(['off']), inactive: db().employees.filter(e => e.status === 'inactive').length };
  }
  function fraudToday() { const d0 = MM.dayStart(); return db().audit.filter(a => a.time >= d0 && (a.decision === 'blocked' || a.decision === 'rejected')); }
  function liveCounts() {
    // single source of truth: every KPI on every screen is counted from the employee + punch records
    const recs = attRecords(), n = st => recs.filter(r => st.includes(r.status)).length;
    return { total: db().employees.length, active: recs.length, present: n(['present', 'late']), late: n(['late']), absent: n(['absent']), leave: n(['leave']), field: activeCrew().length };
  }
  // field staff currently sharing a live location (map markers, "Field Staff Active", field teams)
  function activeCrew() { return Object.entries(db().crew).filter(([id, c]) => c.status !== 'off' && emp(id)).map(([id, c]) => ({ id, c, e: emp(id) })); }
  // last 7 days: 6 days of nightly-batch totals + today live
  function weekSeries() {
    const c = liveCounts();
    return (db().history || []).concat([{ day: MM.dayStart(), rostered: c.active, present: c.present, late: c.late, absent: c.absent }]);
  }
  /* daily attendance totals for the dashboard period filter: the last 7 days are the stored records;
     earlier days follow the same weekday's pattern (deterministic, so the numbers never jump around) */
  function periodSeries(period) {
    const wk = weekSeries(), today = MM.dayStart();
    const nowD = new Date(MM.now());
    // this month = the whole calendar month (1st → last day); days still to come only carry the expected head-count
    const days = [];
    if (period === 'month') { const last = new Date(nowD.getFullYear(), nowD.getMonth() + 1, 0).getDate(); for (let d = 1; d <= last; d++) days.push(new Date(nowD.getFullYear(), nowD.getMonth(), d).getTime()); }
    else { const n = period === 'last30' ? 30 : 7; for (let i = n - 1; i >= 0; i--) days.push(MM.dayStart(today - i * 864e5 + 3600e3)); }
    const out = [];
    for (const day of days) {
      const real = wk.find(w => w.day === day);
      if (real) { out.push(real); continue; }
      const tpl = wk.find(w => new Date(w.day).getDay() === new Date(day).getDay()) || wk[0];
      if (day > today) { out.push({ day, rostered: tpl.rostered, present: null, late: null, absent: null, future: true }); continue; }
      const j = (hsh('d' + day) % 41 - 20) / 1000; // ±2%
      const present = Math.round(tpl.present * (1 + j)), late = Math.round(tpl.late * (1 + j * 3));
      out.push({ day, rostered: tpl.rostered, present: Math.min(present, tpl.rostered), late, absent: Math.max(0, tpl.rostered - present) });
    }
    return out;
  }
  /* field task statuses for Today / This week / This month (past days come from the daily task plans, all closed) */
  function foPeriodCounts(period) {
    const today = MM.dayStart(), tc = (list, sts) => list.filter(x => sts.includes(x.status)).length;
    const cur = db().tasks, acc = { assigned: tc(cur, ['assigned', 'ontheway']), onsite: tc(cur, ['onsite']), inprogress: tc(cur, ['inprogress']), done: tc(cur, ['done', 'signed']), delayed: tc(cur, ['delayed']) };
    if (period === 'today') return acc;
    const days = period === 'week' ? 6 : new Date(MM.now()).getDate() - 1;
    for (let i = 1; i <= days; i++) {
      const day = MM.dayStart(today - i * 864e5 + 3600e3);
      const list = i <= TK_PAST ? tasksFor(day) : null;
      acc.done += list ? tc(list, ['done', 'signed']) : Math.round(cur.length * (0.86 + (hsh('t' + day) % 9) / 100));
    }
    return acc;
  }

  /* ---------------- maps (Leaflet with offline fallback) ---------------- */
  const Maps = {}; let specs = {};
  const L2 = () => window.L;
  const mapSlot = (key, h, overlay) => '<div class="mapslot" data-map="' + key + '" style="height:' + h + 'px">' + (overlay || '') + '</div>';
  const dicon = (html, w, h) => L2().divIcon({ html, className: '', iconSize: [w, h || w], iconAnchor: [w / 2, (h || w) / 2] });
  const CREW_COL = { onsite: '#0E6B3E', office: '#0E6B3E', ontheway: '#2E6FD8', delayed: '#E89B22', off: '#E5322B' };
  function drawItems(layer, items) {
    const Lf = L2();
    items.forEach(it => {
      let m = null;
      if (it.k === 'crew') { const e = emp(it.id); if (!e) return; m = Lf.marker([it.lat, it.lng], { icon: dicon('<div class="mk-av ' + it.status + (e.gender === 'F' ? ' f' : '') + '"' + (it.sel ? ' style="box-shadow:0 0 0 6px rgba(14,107,62,.3)"' : '') + '>' + initials(e.name) + '</div>', 38), zIndexOffset: it.sel ? 900 : 0 }).bindTooltip(esc(e.name) + ' · ' + esc(it.label || it.status), { direction: 'top', offset: [0, -16] }); }
      else if (it.k === 'task') m = Lf.marker([it.lat, it.lng], { icon: dicon('<div class="mk-tk ' + it.prio + (it.sel ? ' sel' : '') + '">' + I(it.icon, 16, 2.2) + '</div>', 34), zIndexOffset: it.sel ? 800 : 0 }).bindTooltip(esc(it.title || ''), { direction: 'top', offset: [0, -14] });
      else if (it.k === 'cl') m = Lf.marker([it.lat, it.lng], { icon: dicon('<div class="mk-cl">' + it.n + '</div>', 34) });
      else if (it.k === 'me') m = Lf.marker([it.lat, it.lng], { icon: dicon('<div class="mk-me"></div>', 20) }).bindTooltip(esc(it.label || ''), { permanent: !!it.label, direction: 'top', offset: [0, -10] });
      else if (it.k === 'circle') m = Lf.circle([it.lat, it.lng], { radius: it.r, color: it.color || '#0E6B3E', weight: 2, fillOpacity: it.dash ? .06 : .18, dashArray: it.dash ? '6 6' : null });
      else if (it.k === 'poly') m = Lf.polygon(it.pts.map(p => [p.lat, p.lng]), { color: it.color || '#0E6B3E', weight: 2.5, fillOpacity: .2 });
      else if (it.k === 'route') m = Lf.polyline(it.pts, { color: it.color || '#2E6FD8', weight: 3, dashArray: '7 7' });
      if (m) { m.addTo(layer); if (it.click) m.on('click', it.click); }
    });
  }
  function fallbackMap(spec) {
    const span = 0.9 * Math.pow(2, 11 - spec.zoom), c = spec.center;
    const P = (lat, lng) => [400 + (lng - c[1]) / span * 800, 200 - (lat - c[0]) / (span * .5) * 400];
    let s = '<svg viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" style="position:absolute;inset:0;width:100%;height:100%"><rect width="800" height="400" fill="#E9ECE6"/><path d="M0 0H800V110C640 120 520 70 380 60 240 50 120 70 0 64Z" fill="#CFE3EA"/><path d="M0 250 800 290M300 0 340 400M620 30 590 400" stroke="#fff" stroke-width="9" fill="none"/>';
    (spec.items || []).forEach(it => {
      if (it.k === 'circle') { const [x, y] = P(it.lat, it.lng); s += '<circle cx="' + x + '" cy="' + y + '" r="' + Math.max(8, it.r / (span * 111000) * 800) + '" fill="#0E6B3E" fill-opacity=".15" stroke="#0E6B3E" stroke-width="2"/>'; }
      else if (it.k === 'poly') s += '<polygon points="' + it.pts.map(p => P(p.lat, p.lng).join(',')).join(' ') + '" fill="#0E6B3E" fill-opacity=".2" stroke="#0E6B3E" stroke-width="2.5"/>';
      else if (it.lat != null) { const [x, y] = P(it.lat, it.lng); const col = it.k === 'crew' ? (CREW_COL[it.status] || '#0E6B3E') : it.k === 'task' ? ({ High: '#E5322B', Low: '#2E6FD8' }[it.prio] || '#E89B22') : it.k === 'me' ? '#2E6FD8' : '#0E6B3E'; s += '<circle cx="' + x + '" cy="' + y + '" r="' + (it.k === 'cl' ? 14 : 9) + '" fill="' + col + '" stroke="#fff" stroke-width="3"/>' + (it.k === 'cl' ? '<text x="' + x + '" y="' + (y + 4) + '" font-size="11" fill="#fff" text-anchor="middle" font-weight="700">' + it.n + '</text>' : ''); }
    });
    return s + '</svg><div class="mapnote">Offline map – connect to the internet for street maps</div>';
  }
  function mountMaps() {
    document.querySelectorAll('[data-map]').forEach(slot => {
      const key = slot.dataset.map, spec = specs[key]; if (!spec) return;
      if (!L2()) { slot.insertAdjacentHTML('afterbegin', fallbackMap(spec)); return; }
      let m = Maps[key];
      if (!m) {
        const el = document.createElement('div'); el.className = 'lmap'; el.style.cssText = 'position:absolute;inset:0'; slot.prepend(el);
        const map = L2().map(el, { zoomControl: true, scrollWheelZoom: false, attributionControl: true });
        L2().tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles &copy; Esri' }).addTo(map);
        m = Maps[key] = { el, map, layer: L2().layerGroup().addTo(map), view: null };
      } else slot.prepend(m.el);
      m.map.invalidateSize(false);
      if (m.view !== spec.viewKey) { m.view = spec.viewKey; if (spec.bounds) m.map.fitBounds(spec.bounds, { padding: [40, 40], maxZoom: 17 }); else m.map.setView(spec.center, spec.zoom); }
      m.layer.clearLayers();
      if (spec.items) drawItems(m.layer, spec.items);
      if (spec.custom) spec.custom(m.layer, m.map);
    });
  }
  const openMaps = (lat, lng) => 'https://www.google.com/maps?q=' + lat + ',' + lng;

  /* ---------------- shell ---------------- */
  const NAV = [['dashboard', 'Dashboard', 'home2'], ['attendance', 'Attendance', 'calendar', 1], ['fieldops', 'Field Operations', 'pin', 1], ['tasks', 'Tasks', 'clipboard'], ['employees', 'Employees', 'users'], ['shifts', 'Shifts & Rosters', 'clock'], ['geofences', 'Locations & Geofences', 'target'], ['approvals', 'Approvals', 'fileplus'], ['reports', 'Reports & Analytics', 'chart'], ['admin', 'Administration', 'sliders']];
  const pendingCount = () => db().requests.filter(r => r.status === 'pending').length + db().tasks.filter(x => x.status === 'done').length + tePending().length;
  let pending = false;
  function scheduleRender() {
    const a = document.activeElement;
    if (ui.dragging) { pending = true; return; }
    if (a && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && a.id !== 'srch') {
      // search / filter boxes keep their value in the page state, so live data can redraw the page – keep the cursor where it was
      if (a.tagName === 'INPUT' && a.dataset.f && !a.dataset.f.startsWith('add.') && !a.closest('.modal')) { const f = a.dataset.f, s = a.selectionStart, e = a.selectionEnd; render(); const n = document.querySelector('[data-f="' + f + '"]'); if (n) { n.focus(); try { n.setSelectionRange(s, e); } catch (x) { } } return; }
      pending = true; return;
    }
    render();
  }
  function render() {
    pending = false; specs = {};
    const app = document.getElementById('app'); const y = window.scrollY;
    if (!ui.session) { document.title = 'Sign in – Smart Attendance'; app.innerHTML = loginPage(); MM.arabizeDigits(app); return; }
    document.title = 'Smart Attendance & Field Operations – Muscat Municipality';
    const P = { dashboard: pDashboard, attendance: pAttendance, 'add-attendance': pAttendance, fieldops: pFieldOps, tasks: pTasks, employees: pEmployees, shifts: pShifts, geofences: pGeofences, approvals: pApprovals, reports: pReports, admin: pAdmin }[ui.page] || pDashboard;
    let body; try { body = P(); } catch (e) { console.error(e); body = '<div class="card pad">Error: ' + esc(e.message) + '</div>'; }
    app.innerHTML = '<div class="shell' + (ui.collapsed ? ' collapsed' : '') + (ui.mobileOpen ? ' mobile-open' : '') + '">' + sidebar() + '<div class="main">' + header() + '<div class="page">' + body + '</div>' + footer() + '</div></div>' + modal();
    MM.arabizeDigits(app);
    mountMaps();
    window.scrollTo(0, y);
    ui.flash = {};
  }
  function sidebar() {
    const pc = pendingCount(); const act = ui.page === 'add-attendance' ? 'attendance' : ui.page;
    return '<aside class="side"><div class="logo">' + MMB.logo(1).replace(/ style="[^"]*"/, '') + '</div><nav>' + NAV.map(([k, l, ic, chev]) => '<button class="' + (act === k ? 'on' : '') + '" data-act="nav" data-arg="' + k + '" title="' + t(l) + '">' + I(ic, 21) + '<span class="lbl">' + t(l) + '</span>' + (k === 'approvals' && pc ? '<span class="cnt">' + pc + '</span>' : '') + '<span class="chev flip">' + I('fwd', 16) + '</span></button>').join('') + '</nav>' +
      '<div class="art">' + MMB.skyline(190) + '<div class="motto">OUR CITY<br>OUR PEOPLE<br>OUR FUTURE</div></div></aside>';
  }
  function header() {
    const u = user(); const res = ui.search.trim().length > 1 ? searchResults(ui.search.trim().toLowerCase()) : null;
    const notes = db().notifications.filter(n => n.to === 'supervisor').slice(-8).reverse();
    return '<header class="top"><button class="ham" data-act="ham" aria-label="Menu">' + I('menu', 24) + '</button><div class="ttl"><b><span class="full">' + t('Smart Attendance & Field Operations Management System') + '</span><span class="short">' + t('Smart Attendance') + '</span></b><span class="sub"><span class="short">' + t('Field Operations') + ' · </span>' + t('Muscat Municipality') + '</span></div><span class="grow"></span>' +
      '<div class="srch">' + I('search', 18) + '<input id="srch" placeholder="' + t('Search for employee, task, location, or document...') + '" value="' + esc(ui.search) + '" autocomplete="off"><kbd>⌘ K</kbd>' + (res ? '<div class="sres">' + (res.length ? res.join('') : '<div class="muted" style="padding:10px">—</div>') + '</div>' : '') + '</div>' +
      '<div class="rel"><button class="tbtn" data-act="menu" data-arg="bell" aria-label="' + t('Notifications') + '">' + I('bell', 22) + (notes.length ? '<span class="dot">' + Math.min(notes.length, 9) + '</span>' : '') + '</button>' +
      (ui.menu === 'bell' ? '<div class="pop" data-stop style="min-width:340px"><div class="eyebrow" style="padding:8px 11px">' + t('Notifications') + '</div>' + (notes.length ? notes.map(n => '<div class="nt">' + I(n.kind === 'fraud' ? 'shield' : n.kind === 'task' ? 'clipboard' : 'bell', 17) + '<div><b style="font-weight:600">' + esc(L(n.text, n.textAr)) + '</b><br><small class="muted">' + MM.fmtTime(n.time) + '</small></div></div>').join('') : '<div class="nt muted">—</div>') + '</div>' : '') + '</div>' +
      '<div class="rel"><button class="tbtn" data-act="menu" data-arg="apps" aria-label="Apps">' + I('apps', 22) + '</button>' + (ui.menu === 'apps' ? '<div class="pop" data-stop><button data-act="openmobile">' + I('phone', 18) + t('Open mobile app') + '</button><button data-act="console">' + I('monitor', 18) + t('Demo console') + '</button><button data-act="reset">' + I('refresh', 18) + t('Reset demo data') + '</button></div>' : '') + '</div>' +
      '<div class="rel"><button class="tbtn" data-act="menu" data-arg="lang">' + I('globe', 20) + (AR() ? 'العربية' : 'English') + ' ' + I('down', 15) + '</button>' + (ui.menu === 'lang' ? '<div class="pop" data-stop style="min-width:170px"><button data-act="lang" data-arg="en">' + (AR() ? '' : I('check', 16)) + 'English</button><button data-act="lang" data-arg="ar">' + (AR() ? I('check', 16) : '') + 'العربية</button></div>' : '') + '</div>' +
      '<div class="rel userbox"><button class="who" data-act="menu" data-arg="user"><span class="av">' + (AR() ? u.nameAr.charAt(0) : initials(u.name)) + '</span><div><b>' + esc(L(u.name, u.nameAr)) + '</b><small>' + esc(L(u.role, u.roleAr)) + '</small></div>' + I('down', 16) + '</button>' +
      (ui.menu === 'user' ? '<div class="pop" data-stop><div class="eyebrow" style="padding:8px 11px 4px">' + t('Switch user') + '</div>' + ['director', 'hr', 'supervisor'].map(r => { const p = db().people[r]; return '<button data-act="role" data-arg="' + r + '">' + I(ui.role === r ? 'check' : 'user', 17) + '<span><b>' + esc(L(p.name, p.nameAr)) + '</b><br><small class="muted">' + esc(L(p.role, p.roleAr)) + '</small></span></button>'; }).join('') + '<div class="sep"></div><button data-act="logout">' + I('logout', 17) + t('Sign out') + '</button></div>' : '') + '</div></header>';
  }
  function footer() {
    return '<footer class="foot"><span>' + t('© 2026 Muscat Municipality. All rights reserved.') + '</span><span class="sp">|</span><a href="#" data-act="noop">' + t('Privacy Policy') + '</a><span class="sp">|</span><a href="#" data-act="noop">' + t('Terms of Use') + '</a><span class="sp">|</span><a href="#" data-act="noop">' + t('Help') + '</a><span class="grow"></span><span class="tag">' + I('leaf', 18) + (AR() ? t('Greener, Smarter Muscat Together') : 'GREENER, SMARTER MUSCAT TOGETHER') + '</span></footer>';
  }
  function searchResults(q) {
    const out = [];
    db().employees.forEach(e => { if ((e.name + e.nameAr + e.id + e.code).toLowerCase().includes(q)) out.push('<button data-act="semp" data-arg="' + e.id + '">' + av(e, 'sm') + '<span>' + esc(nameOf(e)) + '<small>' + e.code + ' · ' + esc(e.dept) + '</small></span></button>'); });
    db().sites.forEach(s => { if ((s.name + s.nameAr).toLowerCase().includes(q)) out.push('<button data-act="sgeo" data-arg="' + s.id + '">' + I('target', 17) + '<span>' + esc(MM.nm(s)) + '<small>' + t('Locations & Geofences') + '</small></span></button>'); });
    db().tasks.forEach(x => { if ((x.id + x.title + x.titleAr + x.loc).toLowerCase().includes(q)) out.push('<button data-act="stask" data-arg="' + x.id + '">' + I(tIcon(x), 17) + '<span>' + x.id + ' · ' + esc(L(x.title, x.titleAr)) + '<small>' + esc(L(x.loc, x.locAr)) + '</small></span></button>'); });
    return out.slice(0, 10);
  }
  function crumbs(list) { return '<div class="crumbs">' + I('home2', 15) + list.map((c, i) => (i ? '<span class="flip">' + I('fwd', 14) + '</span>' : '') + (c[1] ? '<button data-act="nav" data-arg="' + c[1] + '">' + t(c[0]) + '</button>' : '<span>' + t(c[0]) + '</span>')).join('') + '</div>'; }
  function hero(o) {
    // compact page header (replaces the large illustrated banner)
    return '<section class="phead"><div class="tx">' + (o.crumbs ? crumbs(o.crumbs) : '') + '<h1>' + String(o.title).replace(/<br\s*\/?>/g, ' ') + '</h1>' + (o.sub ? '<p>' + o.sub + '</p>' : '') + '</div>' + (o.meta ? '<div class="pmeta">' + o.meta + '</div>' : '') + (o.right ? '<div class="pr">' + o.right + '</div>' : '') + '</section>';
  }
  /* stat tile: label · big number · plain-language breakdown · share bar (all from live data)
     o = { icon, label, value, note, pct, color, segs: [[value, color, label]], tone: green|red|amber|blue|purple|gray, go } */
  const TONE = { green: '#0E7A43', red: '#D92D20', amber: '#D98A00', blue: '#2E6FD8', purple: '#6A4DE0', gray: '#6B7A72' };
  function kpi(o) {
    const tone = o.tone || 'green', col = o.color || TONE[tone];
    let bar = '';
    if (o.segs) { const tot = o.segs.reduce((a, s) => a + s[0], 0) || 1; bar = '<div class="sbar" title="' + o.segs.map(s => s[2] + ': ' + MM.fmtNum(s[0])).join(' · ') + '">' + o.segs.map(s => '<i style="width:' + (s[0] / tot * 100).toFixed(2) + '%;background:' + s[1] + '"></i>').join('') + '</div>'; }
    else if (o.pct != null) bar = '<div class="sbar"><i style="width:' + Math.min(100, Math.max(o.pct, o.pct > 0 ? 1.5 : 0)).toFixed(1) + '%;background:' + col + '"></i></div>';
    return '<div class="card stat t-' + tone + '"' + (o.go ? ' data-act="nav" data-arg="' + o.go + '" role="link" tabindex="0"' : '') + '><div class="sh"><span class="si">' + I(o.icon, 18) + '</span><span class="sl">' + o.label + '</span>' + (o.go ? '<span class="sg flip">' + I('fwd', 15) + '</span>' : '') + '</div>' +
      '<div class="sv">' + o.value + (o.pct != null && !o.hidePct ? '<span class="sp" style="color:' + col + '">' + Math.round(o.pct) + '%</span>' : '') + '</div>' + (o.note ? '<div class="sn">' + o.note + '</div>' : '') + bar + '</div>';
  }
  const pctOf = (a, b) => b ? a / b * 100 : 0;
  /* ---------- KPI tile sets (every figure is computed from the records) ---------- */
  function crewSplit() { const s = { onsite: 0, ontheway: 0, delayed: 0 }; activeCrew().forEach(({ c }) => { const k = c.status === 'office' ? 'onsite' : c.status; if (k in s) s[k]++; }); return s; }
  function dashTiles(c) {
    const inactive = c.total - c.active, cs = crewSplit(), grace = db().rules.grace;
    return kpi({ icon: 'users', label: t('Total Employees'), value: MM.fmtNum(c.total), note: MM.fmtNum(c.active) + ' active · ' + inactive + ' inactive', segs: [[c.active, '#0E7A43', 'Active'], [inactive, '#D9E0DC', 'Inactive']], go: 'employees' }) +
      kpi({ icon: 'user', label: t('Present Today'), value: MM.fmtNum(c.present), pct: pctOf(c.present, c.active), note: 'of ' + MM.fmtNum(c.active) + ' active staff', go: 'attendance' }) +
      kpi({ icon: 'userx', label: t('Absent Today'), tone: 'red', value: MM.fmtNum(c.absent), pct: pctOf(c.absent, c.active), note: 'not checked in · ' + c.leave + ' more on leave', go: 'attendance' }) +
      kpi({ icon: 'clock', label: t('Late Arrivals'), tone: 'amber', value: MM.fmtNum(c.late), pct: pctOf(c.late, c.present), note: 'of those present · after ' + grace + '-min grace', go: 'attendance' }) +
      kpi({ icon: 'pin', label: t('Field Staff Active'), tone: 'blue', value: MM.fmtNum(c.field), note: cs.onsite + ' on site · ' + cs.ontheway + ' in transit · ' + cs.delayed + ' delayed', segs: [[cs.onsite, '#0E7A43', 'On site'], [cs.ontheway, '#2E6FD8', 'In transit'], [cs.delayed, '#E89B22', 'Delayed']], go: 'fieldops' });
  }
  function attTiles(c, day) {
    const today = day == null || day === MM.dayStart(), on = today ? t('Today') : MM.fmtDateShort(day);
    const inactive = c.inactive != null ? c.inactive : c.total - c.active;
    return kpi({ icon: 'users', label: t('Total Employees'), value: MM.fmtNum(c.total), note: (today ? MM.fmtNum(c.active) + ' active' : MM.fmtNum(c.active) + ' rostered' + (c.off ? ' · ' + c.off + ' off' : '')) + ' · ' + inactive + ' inactive', segs: [[c.present, '#0E7A43', 'Present'], [c.absent, '#D92D20', 'Absent'], [c.leave, '#9DB4F0', 'On leave'], [(c.off || 0) + inactive, '#D9E0DC', 'Off / inactive']] }) +
      kpi({ icon: 'user', label: t('Present') + ' · ' + on, value: MM.fmtNum(c.present), pct: pctOf(c.present, c.active), note: 'of ' + MM.fmtNum(c.active) + (today ? ' active staff' : ' rostered staff') }) +
      kpi({ icon: 'userx', label: t('Absent') + ' · ' + on, tone: 'red', value: MM.fmtNum(c.absent), pct: pctOf(c.absent, c.active), note: today ? 'active staff not checked in' : 'rostered, no check-in' }) +
      kpi({ icon: 'clock', label: t('Late Arrivals'), tone: 'amber', value: MM.fmtNum(c.late), pct: pctOf(c.late, c.present), note: 'of those present · ' + on }) +
      kpi({ icon: 'plane', label: t('On Leave'), tone: 'purple', value: MM.fmtNum(c.leave), pct: pctOf(c.leave, c.active), note: 'approved leave · ' + on });
  }
  const SEL = (key, val, opts, all) => '<select class="sel" data-f="' + key + '"><option value="all">' + t(all) + '</option>' + opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return '<option value="' + esc(v) + '"' + (val === v ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join('') + '</select>';
  const admList = () => { const q = (ui.adm.q || '').toLowerCase(); return q ? db().employees.filter(e => (e.name + e.nameAr + e.code + e.id).toLowerCase().includes(q)) : db().employees; };
  const admPg = () => Math.min(ui.adm.page || 1, Math.max(1, Math.ceil(admList().length / 10)));
  function pager(total, page, per, key, label) {
    const pages = Math.max(1, Math.ceil(total / per));
    return '<div class="pager"><span class="muted2">' + t('Showing') + ' ' + (total ? (page - 1) * per + 1 : 0) + ' – ' + Math.min(total, page * per) + ' ' + t('of') + ' ' + total + ' ' + (label || '') + '</span><span class="grow"></span><button class="pg" data-act="pg" data-arg="' + key + ':' + Math.max(1, page - 1) + '"><span class="flip">' + I('back', 16) + '</span></button>' +
      [...new Set([1, page - 2, page - 1, page, page + 1, page + 2, pages])].filter(n => n >= 1 && n <= pages).sort((a, b) => a - b).map((n, i, arr) => (i && n - arr[i - 1] > 1 ? '<span class="muted">…</span>' : '') + '<button class="pg ' + (n === page ? 'on' : '') + '" data-act="pg" data-arg="' + key + ':' + n + '">' + n + '</button>').join('') + '<button class="pg" data-act="pg" data-arg="' + key + ':' + Math.min(pages, page + 1) + '"><span class="flip">' + I('fwd', 16) + '</span></button></div>';
  }

  /* ---------------- LOGIN ---------------- */
  function loginPage() {
    const ar = AR();
    const feats = [['pin', 'Geofenced Check-in'], ['clipboard', 'Field Task Tracking'], ['chart', 'Payroll-ready Reports'], ['users', 'Staff & Roster Management']];
    const brk = s => { const w = t(s).split(' '); const h = Math.ceil(w.length / 2); return w.slice(0, h).join(' ') + '<br>' + w.slice(h).join(' '); };
    return '<div class="login2">' +
      '<div class="l2-bg" style="background-image:url(assets/login-bg.webp)"></div><div class="l2-veil"></div>' +
      '<div class="l2-lang"><button data-act="lang" data-arg="en" class="' + (ar ? '' : 'on') + '">' + I('globe', 19) + 'English ' + I('down', 14) + '</button><i></i><button data-act="lang" data-arg="ar" class="' + (ar ? 'on' : '') + '">العربية</button></div>' +
      '<section class="l2-left">' + MMB.logo(.85) +
      '<h1>' + (ar ? esc(t('Smart Attendance & Field Operations')) : 'Smart Attendance <em>&amp;</em> Field Operations') + '</h1><span class="l2-bar"></span>' +
      '<p>' + t('Geofenced check-in, live field task tracking and payroll-ready attendance') + ' ' + t('in one secure platform for Muscat Municipality staff.') + '</p>' +
      '<div class="l2-feats">' + feats.map(([ic, l]) => '<div><span>' + I(ic, 26, 2) + '</span><b>' + brk(l) + '</b></div>').join('<i></i>') + '</div></section>' +
      '<form class="l2-card" data-form="login">' + MMB.logo(.9) + '<h2>' + t('Welcome Back') + '</h2><p class="d">' + t('Sign in to access the Smart Attendance & Field Operations Management System') + '</p>' +
      '<label class="fld"><span>' + I('user', 15) + t('Username / Email') + '</span><div class="fi">' + I('user', 19) + '<input id="lgU" value="ahmed.busaidi@muscat.gov.om" placeholder="' + t('Enter your username or email') + '" autocomplete="username"></div></label>' +
      '<label class="fld"><span>' + I('lock', 15) + t('Password') + '</span><div class="fi">' + I('lock', 19) + '<input id="lgP" type="' + (ui.showPw ? 'text' : 'password') + '" value="demo-password" placeholder="' + t('Enter your password') + '" autocomplete="current-password"><button type="button" class="eye" data-act="showpw" aria-label="Show password">' + I('eye', 19) + '</button></div></label>' +
      '<div class="l2-forgot"><a href="#" data-act="forgot">' + t('Forgot Password?') + '</a></div>' +
      (ui.loginErr ? '<div class="l2-err">' + I('alert', 18) + '<span>' + esc(ui.loginErr) + '</span></div>' : '') +
      '<button class="l2-signin" type="submit">' + t('Sign In') + ' <span class="flip">' + I('arrow', 19) + '</span></button>' +
      '<div class="l2-or"><span></span>' + t('or') + '<span></span></div>' +
      '<button class="l2-sso" type="button" data-act="sso">' + I('logout', 20) + t('Sign in with SSO') + '</button>' +
      '</form>' +
      '<footer class="l2-foot"><span>' + t('© 2026 Muscat Municipality. All rights reserved.') + '</span><i></i><a>' + t('Privacy Policy') + '</a><i></i><a>' + t('Terms of Use') + '</a><i></i><a>' + t('Help') + '</a></footer></div>';
  }
  function signIn(sso) {
    // record the sign-in on the server first – if the demo server is not running, say so on the sign-in page
    try { MM.tx(d => MM.addActivity(d, { title: 'Portal sign-in', sub: d.people.director.name + (sso ? ' · Active Directory SSO' : ' · MFA verified'), kind: 'login' })); }
    catch (e) { ui.loginErr = e.message; render(); return; }
    ui.loginErr = null; ui.session = 'ok'; localStorage.setItem('mmsa.portal.session', 'ok');
    ui.role = 'director'; localStorage.setItem('mmsa.portal.role', 'director');
    if (!location.hash) history.replaceState(null, '', '#dashboard');
    render(); toast(sso ? 'Signed in with SSO' : t('Welcome Back'), user().name, 'ok');
  }

  /* ---------------- DASHBOARD ---------------- */
  function weekLabels() { return weekSeries().map(w => { const d = w.day; return [MM.fmtDay(d).slice(0, AR() ? 8 : 3), new Date(d).getDate() + ' ' + (AR() ? MM.MON_AR : MM.MON)[new Date(d).getMonth()]]; }); }
  function pDashboard() {
    const c = liveCounts(), u = db().people.director, wk = periodSeries(ui.dash.att);
    const h = new Date(MM.now()).getHours();
    const fc = foPeriodCounts(ui.dash.fo);
    const segs = [['Assigned', fc.assigned, '#B8C2BD'], ['On Site', fc.onsite, '#0E6B3E'], ['In Progress', fc.inprogress, '#3E9A68'], ['Completed', fc.done, '#8CC7A3'], ['Delayed', fc.delayed, '#E89B22']];
    const tot = segs.reduce((a, x) => a + x[1], 0) || 1;
    const today = wk.findIndex(w => w.day === MM.dayStart());
    const every = wk.length > 10 ? Math.ceil(wk.length / 7) : 1;
    // label every Nth day counted back from today, plus today itself; the rest of the axis stays readable
    const wkLabels = wk.map((w, i) => { const d = w.day, l = [MM.fmtDay(d).slice(0, AR() ? 8 : 3), new Date(d).getDate() + ' ' + (AR() ? MM.MON_AR : MM.MON)[new Date(d).getMonth()]]; const far = Math.abs(i - today); return (i === today || (far % every === 0 && far >= Math.ceil(every / 2))) ? l : ['', '']; });
    const periodSel = (key, val, opts) => '<select class="sel psel" data-f="dash.' + key + '">' + opts.map(([v, l]) => '<option value="' + v + '"' + (val === v ? ' selected' : '') + '>' + t(l) + '</option>').join('') + '</select>';
    const done = wk.filter(w => w.present != null);
    const attAvg = Math.round(done.reduce((s, w) => s + (w.rostered ? w.present / w.rostered : 0), 0) / (done.length || 1) * 100);
    const reqs = db().requests.filter(r => r.status === 'pending');
    const pa = [['Leave Requests', 'Awaiting manager approval', 'camera', reqs.filter(r => r.type === 'leave').length], ['Attendance Corrections', 'Requires review', 'clock', reqs.filter(r => ['missed', 'overtime', 'remote', 'short'].includes(r.type)).length], ['Field Task Completions', 'Pending verification', 'check', db().tasks.filter(x => x.status === 'done').length], ['Shift Change Requests', 'Requires approval', 'swap', reqs.filter(r => r.type === 'shift').length]];
    const acts = db().activity.slice(0, 5);
    const ACT_IC = { sync: 'check', task: 'clipboard', request: 'user', shift: 'swap', employee: 'user', punch: 'clock', approval: 'check', login: 'shield' };
    specs.dash = { viewKey: 'dash', center: [23.605, 58.42], zoom: 11, items: dashMapItems() };
    const sel = emp('100124'), selc = db().crew['100124'];
    return hero({
      art: 'mosque', title: t(h < 12 ? 'Good Morning,' : h < 17 ? 'Good Afternoon,' : 'Good Evening,') + ' ' + esc(L(u.name, u.nameAr)), sub: t('Together for a cleaner, safer and more sustainable Muscat.'),
      meta: '<span>' + I('calendar', 16) + fmtDateL(MM.now()) + '</span><span title="' + esc(MM.tz().label) + '">' + I('clock', 16) + '<span data-clock-ampm>' + ampm(MM.now()) + '</span><small class="tzs">' + MM.tz().utc + '</small></span><span>' + I('sun', 16) + '32°C · ' + t('Clear Sky') + '</span>',
      quote: t('Sustainable Communities for a Brighter Tomorrow'),
    }) +
      '<div class="grid g5">' +
      dashTiles(c) + '</div>' +
      '<div class="grid" style="grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr);margin-top:16px">' +
      '<div class="card pad"><div class="ch"><h3>' + I('chart', 20) + t('Attendance Overview') + '</h3><div class="r">' + periodSel('att', ui.dash.att, [['week', 'This Week'], ['month', 'This Month'], ['last30', 'Last 30 Days']]) + '</div></div><div class="chart">' + MMC.line(wkLabels, [{ name: t('Present'), vals: wk.map(w => w.present), color: '#0E6B3E', area: 1 }, { name: t('Expected'), vals: wk.map(w => w.rostered), color: '#B8C2BD', dashed: 1 }], { max: Math.ceil(c.active / 50) * 50, mark: today, markSide: today < wk.length * 0.6 ? 'right' : 'auto', markLabel: wkLabels[today].join(', ') }) + '</div><div class="legend2"><span><i style="background:#0E6B3E"></i>' + t('Present') + '</span><span><i style="background:#B8C2BD"></i>' + t('Expected') + '</span><span style="margin-inline-start:auto" class="muted">' + (ui.dash.att === 'month' ? done.length + ' ' + t('of') + ' ' + wk.length + ' ' + t('days so far') : wk.length + ' ' + t('days')) + ' · ' + t('avg') + ' ' + attAvg + '% ' + t('present') + '</span></div></div>' +
      '<div class="card pad"><div class="ch"><h3>' + I('chart', 20) + t('Field Operations Status') + '</h3><div class="r">' + periodSel('fo', ui.dash.fo, [['today', 'Today'], ['week', 'This Week'], ['month', 'This Month']]) + '</div></div><div class="flexr" style="gap:18px;flex-wrap:wrap;justify-content:center">' + MMC.donut(segs.map(x => ({ v: x[1], color: x[2] })), 170, 26, '<text x="50%" y="47%" text-anchor="middle" font-size="28" font-weight="800" fill="#111827">' + tot + '</text><text x="50%" y="61%" text-anchor="middle" font-size="12.5" fill="#374151">' + t('Total Tasks') + '</text>') +
      '<ul class="dlist" style="flex:1;min-width:170px">' + segs.map(x => '<li><i style="background:' + x[2] + '"></i>' + t(x[0]) + '<b>' + x[1] + ' (' + Math.round(x[1] / tot * 100) + '%)</b></li>').join('') + '</ul></div></div>' +
      '<div class="card pad"><div class="ch"><h3>' + I('sliders', 20) + t('Pending Approvals') + '</h3><div class="r"><button class="link" data-act="nav" data-arg="approvals">' + t('View All') + ' <span class="flip">›</span></button></div></div>' + pa.map(p => '<div class="li click" data-act="nav" data-arg="approvals"><span class="ii">' + I(p[2], 19) + '</span><div class="lt"><b>' + t(p[0]) + '</b><small>' + t(p[1]) + '</small></div><span class="cnt-pill">' + p[3] + '</span><span class="flip muted">' + I('fwd', 16) + '</span></div>').join('') + '</div></div>' +
      '<div class="grid" style="grid-template-columns:minmax(0,1.25fr) minmax(0,1fr) minmax(0,1fr);margin-top:16px">' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Live Field Staff') + '</h3><div class="r"><button class="link" data-act="nav" data-arg="fieldops">' + t('View Map') + ' <span class="flip">›</span></button></div></div>' +
      mapSlot('dash', 250, selc ? '<div class="mapcard">' + av(sel, 'lg') + '<div><b>' + esc(nameOf(sel)) + '</b><br><span class="ok-text" style="font-weight:600">' + t('On Site') + '</span><br><span class="muted">' + esc(sel.wilayat) + ' (Inspection)<br>' + ampm(selc.time) + '</span></div></div>' : '') + '</div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Recent Activity') + '</h3><div class="r"><button class="link" data-act="nav" data-arg="reports">' + t('View All') + ' <span class="flip">›</span></button></div></div>' +
      acts.map(a => '<div class="li ' + (ui.flash[a.id] ? 'flash' : '') + '"><span class="ii">' + I(ACT_IC[a.kind] || 'check', 18) + '</span><div class="lt"><b>' + esc(a.title || nameOf(emp(a.empId))) + '</b><small>' + esc(a.sub || a.text || '') + '</small></div><span class="tm">' + ampm(a.time) + '</span></div>').join('') + '</div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Announcements') + '</h3><div class="r"><button class="link" data-act="noop">' + t('View All') + ' <span class="flip">›</span></button></div></div>' +
      [['flag', 'National Day Holiday', '18 Nov 2026', 'Muscat Municipality offices will be closed on 18 November 2026.'], ['helmet', 'Field Safety Guidelines', '1 Nov 2026', 'Please follow the updated field safety guidelines for all site visits.'], ['sprout', 'Sustainability Initiative', '28 Oct 2026', 'Together for a greener Muscat. Let\'s conserve our environment.']].map(a => '<div class="li"><span class="thumb">' + MMB.thumb(a[0]) + '</span><div class="lt"><b>' + a[1] + '</b><small>' + a[2] + '<br>' + a[3] + '</small></div><span class="flip muted">' + I('fwd', 16) + '</span></div>').join('') + '</div></div>';
  }
  function dashMapItems() {
    // one bubble per wilayat; the bubbles add up to "Field Staff Active"
    const CEN = { Muttrah: [23.618, 58.556], Bousher: [23.588, 58.405], Seeb: [23.672, 58.195], Amerat: [23.523, 58.492], Qurayat: [23.265, 58.912], Muscat: [23.600, 58.455] };
    const groups = {};
    activeCrew().forEach(({ e }) => { const w = CEN[e.wilayat] ? e.wilayat : 'Muscat'; groups[w] = (groups[w] || 0) + 1; });
    return Object.entries(groups).map(([w, n]) => ({ k: 'cl', lat: CEN[w][0], lng: CEN[w][1], n, click: () => { ui.fo.view = 'live'; ui.fo.q = w; nav('fieldops'); } }));
  }

  /* ---------------- ATTENDANCE ---------------- */
  function pAttendance() {
    const a = ui.att; const today0 = MM.dayStart(); const day = a.date || today0; const isToday = day === today0; const dayRecs = attRecordsFor(day);
    const c = isToday ? liveCounts() : countsFrom(dayRecs || []);
    const iso = ms => { const d = new Date(ms); return d.getFullYear() + '-' + MM.pad(d.getMonth() + 1) + '-' + MM.pad(d.getDate()); };
    const reqs = db().requests;
    const tabTypes = { leave: ['leave'], corrections: ['missed', 'overtime', 'remote', 'short'], shiftmgmt: ['shift'] };
    const pend = k => reqs.filter(r => r.status === 'pending' && tabTypes[k].includes(r.type)).length;
    const tabs = [['records', 'Attendance Records', null], ['leave', 'Leave Requests', pend('leave')], ['corrections', 'Attendance Corrections', pend('corrections')], ['shiftmgmt', 'Shift Management', pend('shiftmgmt')]];
    let main = '', rowsForExport = [];
    if (a.tab === 'records') {
      const all = dayRecs || [];
      let rows = all;
      if (a.dept !== 'all') rows = rows.filter(r => r.e.dept === a.dept);
      if (a.site !== 'all') rows = rows.filter(r => r.e.siteId === a.site);
      if (a.q) rows = rows.filter(r => (r.e.name + r.e.nameAr + r.e.code + r.e.dept).toLowerCase().includes(a.q.toLowerCase()));
      // status chips: counts follow the department/location/search filters, and clicking one filters the table
      const cnt = st => rows.filter(r => r.status === st).length, rostered = rows.filter(r => r.status !== 'off').length;
      const chips = [['all', 'All', rostered, '#13201A'], ['present', 'On time', cnt('present'), '#0E7A43'], ['late', 'Late', cnt('late'), '#D98A00'], ['absent', 'Absent', cnt('absent'), '#D92D20'], ['leave', 'On leave', cnt('leave'), '#6A4DE0']].concat(cnt('off') ? [['off', 'Off', cnt('off'), '#8A968F']] : []);
      if (a.status !== 'all') rows = rows.filter(r => r.status === a.status);
      rowsForExport = rows;
      const filtersOn = a.dept !== 'all' || a.site !== 'all' || a.q || a.status !== 'all';
      const per = 10, pg = Math.min(a.page, Math.max(1, Math.ceil(rows.length / per)));
      main = '<div class="schips">' + chips.map(([k, l, n, col]) => '<button class="' + (a.status === k ? 'on' : '') + '" data-act="attstatus" data-arg="' + k + '"><i style="background:' + col + '"></i>' + t(l) + '<b>' + MM.fmtNum(n) + '</b>' + (k !== 'all' && k !== 'off' && rostered ? '<small>' + Math.round(n / rostered * 100) + '%</small>' : '') + '</button>').join('') + '</div>' +
        '<div class="fbar"><div class="inp-ic">' + I('search', 16) + '<input class="inp" data-f="att.q" value="' + esc(a.q) + '" placeholder="' + t('Search by name, ID or department...') + '"></div>' +
        SEL('att.dept', a.dept, [...new Set(db().employees.map(e => e.dept))].sort(), 'All Departments') + SEL('att.site', a.site, db().sites.map(s => [s.id, MM.nm(s)]), 'All Locations') +
        (filtersOn ? '<button class="btn ghost sm" data-act="attreset">' + I('x', 15) + t('Clear filters') + '</button>' : '') + '<span style="flex:1"></span><button class="btn sm" data-act="attexport">' + I('download', 15) + t('Export') + '</button></div>' +
        '<div class="tablewrap"><table class="tbl compact"><thead><tr><th>' + t('Employee') + '</th><th>ID</th><th>' + t('Department') + '</th><th>' + t('Location') + '</th><th>' + t('Check In') + '</th><th>' + t('Check Out') + '</th><th>' + t('Hours') + '</th><th>' + t('Geofence') + '</th><th>' + t('Status') + '</th></tr></thead><tbody>' +
        rows.slice((pg - 1) * per, pg * per).map(r => '<tr class="click ' + (r.i && ui.flash[r.i.id] ? 'new' : '') + '" data-act="semp" data-arg="' + r.e.id + '"><td>' + person(r.e) + '</td><td class="muted">' + r.e.code + '</td><td>' + esc(r.e.dept) + '</td><td>' + esc(r.e.wilayat) + '</td><td>' + (r.i ? ampm(r.i.time) : '<span class="muted">—</span>') + '</td><td>' + (r.o ? ampm(r.o.time) : '<span class="muted">—</span>') + '</td><td>' + (r.hours ? Math.floor(r.hours / 3600e3) + 'h ' + Math.round(r.hours % 3600e3 / 60000) + 'm' : '<span class="muted">—</span>') + '</td><td>' +
          (r.geo === 'inside' ? '<span class="tag in">' + I('pin', 13) + t('Inside') + '</span>' : r.geo === 'outside' ? '<span class="tag out">' + I('pin', 13) + t('Outside') + '</span>' : r.geo === 'na' ? '<span class="muted">Manual</span>' : '<span class="muted">—</span>') + '</td><td>' + pill(ATT_PILL[r.status][1], t(ATT_PILL[r.status][0])) + '</td></tr>').join('') +
        (!dayRecs ? '<tr><td colspan="9" class="muted" style="text-align:center;padding:24px">No records for this date – the demo keeps the last 7 days</td></tr>' : rows.length ? '' : '<tr><td colspan="9" class="muted" style="text-align:center;padding:24px">No employees match these filters</td></tr>') +
        '</tbody></table></div>' + pager(rows.length, pg, per, 'att', t('employees'));
    } else {
      main = requestTable(reqs.filter(r => tabTypes[a.tab].includes(r.type)), true) + (a.tab === 'shiftmgmt' ? '<div style="margin-top:12px"><button class="btn" data-act="nav" data-arg="shifts">' + I('calendar', 16) + t('Shifts & Rosters') + '</button></div>' : '');
    }
    ui.att.exportRows = rowsForExport;
    const ws = weekLabels(); const wk = weekSeries().map(w => [w.present - w.late, w.absent, w.late]);
    return hero({
      title: t('Attendance'), sub: (isToday ? t('Live records for today') : t('Records for') + ' ' + fmtDateL(day)) + ' · ' + MM.fmtNum(c.present) + ' ' + t('present of') + ' ' + MM.fmtNum(c.active) + ' ' + t('rostered') + ' (' + Math.round(pctOf(c.present, c.active)) + '%)',
      right: '<label class="datepick" title="Pick a date (last 7 days)">' + I('calendar', 16) + '<input type="date" data-f="att.date" value="' + iso(day) + '" min="' + iso(today0 - 6 * 864e5) + '" max="' + iso(today0) + '"></label>' + (isToday ? '' : '<button class="btn" data-act="atttoday">' + t('Today') + '</button>'),
    }) +
      '<div class="tabs" style="margin-bottom:14px">' + tabs.map(([k, l, n]) => '<button class="' + (a.tab === k ? 'on' : '') + '" data-act="atttab" data-arg="' + k + '">' + t(l) + (n != null ? ' <span class="n">' + n + '</span>' : '') + '</button>').join('') + '</div>' +
      '<div class="split attsplit"><div class="card pad">' + main + '</div>' +
      '<div class="grid attside"><div class="card pad"><div class="ch"><h3 style="color:var(--ink);font-size:15px">' + t('Geofence activity') + ' · ' + t('Today') + '</h3><div class="r"><button class="link" data-act="nav" data-arg="approvals">' + t('View All') + '</button></div></div>' + geoFeed() + '</div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink);font-size:15px">' + t('Last 7 days') + '</h3><div class="r"><button class="link" data-act="nav" data-arg="reports">' + t('Reports') + '</button></div></div><div class="chart">' + MMC.stack(ws, wk, ['#0E6B3E', '#D9E0DC', '#E89B22']) + '</div><div class="legend2"><span><i style="background:#0E6B3E;height:10px;width:10px;border-radius:50%"></i>' + t('On time') + '</span><span><i style="background:#D9E0DC;height:10px;width:10px;border-radius:50%"></i>' + t('Absent') + '</span><span><i style="background:#E89B22;height:10px;width:10px;border-radius:50%"></i>' + t('Late') + '</span></div></div></div></div>';
  }
  function geoFeed() {
    const d0 = MM.dayStart(); const items = [];
    db().punches.filter(p => p.time >= d0 && (p.status === 'accepted' || p.status === 'corrected')).forEach(p => { const s = MM.siteById(p.siteId); items.push({ time: p.time, id: p.id, e: emp(p.empId), ok: p.geo !== 'outside', text: (p.type === 'IN' ? 'Checked in from ' : 'Checked out from ') + (p.geo === 'outside' ? 'Outside Geofence' : (s ? s.wilayat : '') + ' (Within Geofence)') }); });
    db().audit.filter(a => a.time >= d0 && ['GEO_OUTSIDE', 'LOC_MOCK'].includes(a.code)).forEach(a => items.push({ time: a.time, id: a.id, e: emp(a.empId), ok: false, text: a.code === 'LOC_MOCK' ? 'Check-in blocked – mock location' : 'Check-in blocked – Outside Geofence' }));
    return items.sort((a, b) => b.time - a.time).slice(0, 6).map(it => '<div class="li ' + (ui.flash[it.id] ? 'flash' : '') + '">' + av(it.e) + '<span style="color:' + (it.ok ? 'var(--green)' : '#D92D20') + '">' + I('pin', 17) + '</span><div class="lt"><b>' + esc(nameOf(it.e)) + '</b><small>' + esc(it.text) + '</small></div><span class="tm">' + ampm(it.time) + '</span></div>').join('') || '<div class="muted">—</div>';
  }

  /* ---------------- ADD ATTENDANCE ---------------- */
  function addState() {
    if (!ui.add) { const d = new Date(MM.now()); ui.add = { empId: '100124', date: d.getFullYear() + '-' + MM.pad(d.getMonth() + 1) + '-' + MM.pad(d.getDate()), type: 'IN', time: MM.fmtTime(MM.now()), siteId: 'muttrah', notes: '', photo: null, pos: null, acc: 8 }; }
    return ui.add;
  }
  function addGeo(f) {
    const e = emp(f.empId), home = MM.siteById(e.siteId), loc = MM.siteById(f.siteId) || home;
    const pt = f.pos || MM.siteCenter(loc);
    const out = MM.distOutside(home, pt);
    return { e, home, loc, pt, out, inside: out <= home.buffer };
  }
  function pAddAttendance() {
    const f = addState(), g = addGeo(f);
    const recs = attRecords(); const inN = recs.filter(r => r.i).length, outN = recs.filter(r => r.o).length;
    const c = liveCounts();
    const qlist = recs.filter(r => ui.quick === 'in' ? r.i : ui.quick === 'out' ? r.o : r.geo === 'inside').slice(0, 6);
    const hc = MM.siteCenter(g.home);
    specs.add = { viewKey: 'add-' + g.home.id + '-' + (f.pos ? 'gps' : f.siteId), center: [g.pt.lat, g.pt.lng], zoom: 15, items: [g.home.shape === 'circle' ? { k: 'circle', lat: g.home.center.lat, lng: g.home.center.lng, r: g.home.radius + g.home.buffer } : { k: 'poly', pts: g.home.polygon }, { k: 'circle', lat: hc.lat, lng: hc.lng, r: 200, dash: 1 }, { k: 'me', lat: g.pt.lat, lng: g.pt.lng, label: (f.pos ? 'GPS position' : MM.nm(g.loc)) + ' · You are here' }] };
    return hero({ crumbs: [['Attendance', 'attendance'], ['Add Attendance']], title: t('Add Attendance'), sub: t('Record employee check-in/out with accurate location tracking'), quote: t('Accurate attendance builds a stronger tomorrow.'), art: 'mosque' }) +
      '<div class="split" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.95fr)">' +
      '<form class="card pad" data-form="addatt"><div class="ch"><h3 style="font-size:19px;color:var(--ink)">' + I('calendar', 22) + t('Attendance Details') + '</h3><div class="r muted2">' + t('Fields marked with * are required') + '</div></div>' +
      '<div class="grid g2" style="gap:12px"><div><span class="lbl">' + t('Employee') + ' <em>*</em></span><select class="sel" style="width:100%" data-f="add.empId">' + db().employees.filter(e => e.status !== 'inactive').map(e => '<option value="' + e.id + '"' + (e.id === f.empId ? ' selected' : '') + '>' + esc(nameOf(e)) + ' · ' + e.code + ' – ' + esc(e.role) + '</option>').join('') + '</select></div>' +
      '<div><span class="lbl">' + t('Date') + ' <em>*</em></span><input class="inp" style="width:100%" type="date" data-f="add.date" value="' + f.date + '"></div></div>' +
      '<div style="margin-top:14px"><span class="lbl">' + t('Attendance Type') + ' <em>*</em></span><div class="typeseg"><button type="button" class="' + (f.type === 'IN' ? 'on' : '') + '" data-act="addtype" data-arg="IN">' + I('logout', 19) + t('Check In') + '</button><button type="button" class="' + (f.type === 'OUT' ? 'on' : '') + '" data-act="addtype" data-arg="OUT"><span class="flip">' + I('logout', 19) + '</span>' + t('Check Out') + '</button></div></div>' +
      '<div style="margin-top:14px"><span class="lbl">' + t('Time') + '</span><div class="flexr"><input class="inp" type="time" data-f="add.time" value="' + f.time + '" style="flex:1"><span class="pill p-green nodot">' + I('refresh', 14) + t('Auto-captured') + '</span></div></div>' +
      '<div style="margin-top:14px"><span class="lbl">' + t('Location') + ' <em>*</em></span><div class="flexr"><select class="sel" style="flex:1;min-width:0" data-f="add.siteId">' + (f.pos ? '<option value="gps" selected>Current GPS position (±' + Math.round(f.acc) + ' m)</option>' : '') + db().sites.map(s => '<option value="' + s.id + '"' + (!f.pos && s.id === f.siteId ? ' selected' : '') + '>' + esc(MM.nm(s)) + '</option>').join('') + '</select><button type="button" class="btn" data-act="usegps">' + I('target', 17) + t('Use Current Location') + '</button></div></div>' +
      '<div style="margin-top:14px"><span class="lbl">' + t('Geofence Status') + '</span><div class="geook ' + (g.inside ? '' : 'bad') + '"><span class="c">' + I(g.inside ? 'check' : 'x', 17, 3) + '</span><div><b>' + t(g.inside ? 'Within Geofence' : 'Outside Geofence') + '</b><br><span class="muted2">' + (g.inside ? t('You are inside the allowed location') : MM.fmtDist(g.out) + ' from ' + esc(MM.nm(g.home)) + ' – will be flagged for review') + '</span></div></div></div>' +
      '<div class="grid" style="grid-template-columns:1.4fr 1fr;gap:12px;margin-top:14px"><div><span class="lbl">' + t('Notes (Optional)') + '</span><textarea class="inp" style="width:100%;min-height:104px" maxlength="250" data-f="add.notes" placeholder="Add any notes (e.g., site visit, task details, etc.)…">' + esc(f.notes) + '</textarea></div>' +
      '<div><span class="lbl">' + t('Photo (Optional)') + '</span><label class="upl" style="' + (f.photo ? 'background-image:url(' + f.photo + ');color:transparent' : '') + '">' + I('camera', 24) + t('Upload Photo') + '<small>JPG, PNG (Max 5MB)</small><input type="file" accept="image/*" id="addphoto" hidden></label></div></div>' +
      '<div class="grid" style="grid-template-columns:1.4fr 1fr;gap:12px;margin-top:18px"><button class="btn primary lg" type="submit" style="padding:13px">' + I('check', 19, 2.4) + t('Save Attendance') + '</button><button class="btn lg" type="button" data-act="addreset">' + I('refresh', 18) + t('Reset') + '</button></div></form>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + I('pin', 22) + t('Live Location & Geofence') + '</h3><div class="r">' + pill(g.inside ? 'p-green' : 'p-red', t(g.inside ? 'Within Geofence' : 'Outside Geofence')) + '</div></div>' + mapSlot('add', 330) +
      '<div style="background:#F5F8F6;border-radius:10px;padding:10px 12px;margin-top:12px;font-weight:600">' + t('Location Details') + '</div><div class="kv" style="padding:10px 4px;grid-template-columns:130px 1fr">' +
      '<span>' + t('Address') + '</span><b>' + esc(f.pos ? 'Current GPS position' : MM.nm(g.loc)) + ', Oman</b><span>' + t('Latitude') + '</span><b>' + g.pt.lat.toFixed(4) + '</b><span>' + t('Longitude') + '</span><b>' + g.pt.lng.toFixed(4) + '</b>' +
      '<span>' + t('Accuracy') + '</span><b>' + Math.round(f.acc) + ' meters</b><span>' + t('Geofence Radius') + '</span><b>' + (g.home.shape === 'circle' ? (g.home.radius + g.home.buffer) + ' meters' : 'Polygon + ' + g.home.buffer + ' m buffer') + '</b><span>' + t('Status') + '</span><b>' + pill(g.inside ? 'p-green' : 'p-red', t(g.inside ? 'Within Geofence' : 'Outside Geofence')) + '</b></div></div>' +
      '<div class="grid"><div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + I('users', 21) + t("Today's Attendance") + '</h3></div><div class="flexr" style="gap:18px;flex-wrap:wrap">' + MMC.donut([{ v: c.present, color: '#0E7A43' }, { v: c.leave, color: '#9DB4F0' }, { v: c.absent, color: '#D92D20' }], 150, 20) +
      '<div style="flex:1;min-width:160px"><b style="font-size:22px">' + MM.fmtNum(c.active) + '</b><div class="muted2" style="margin-bottom:6px">' + t('Active Employees') + '</div><ul class="dlist"><li><i style="background:#0E7A43"></i>' + t('Checked In') + '<b>' + MM.fmtNum(c.present) + ' (' + Math.round(c.present / c.active * 100) + '%)</b></li><li><i style="background:#9DB4F0"></i>' + t('On Leave') + '<b>' + c.leave + '</b></li><li><i style="background:#D92D20"></i>' + t('Not Checked In') + '<b>' + c.absent + '</b></li></ul></div></div></div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + I('user', 21) + t('Quick Employee Status') + '</h3><div class="r"><button class="link" data-act="nav" data-arg="attendance">' + t('View All') + '</button></div></div><div class="btabs round solid" style="margin-bottom:10px"><button class="' + (ui.quick === 'in' ? 'on' : '') + '" data-act="quick" data-arg="in">' + t('Checked In') + ' (' + inN + ')</button><button class="' + (ui.quick === 'out' ? 'on' : '') + '" data-act="quick" data-arg="out">' + t('Checked Out') + ' (' + outN + ')</button><button class="' + (ui.quick === 'geo' ? 'on' : '') + '" data-act="quick" data-arg="geo">' + t('Within Geofence') + '</button></div>' +
      (qlist.map(r => '<div class="li click" data-act="semp" data-arg="' + r.e.id + '">' + person(r.e) + '<span style="flex:1"></span><span class="tm">' + ampm((ui.quick === 'out' ? r.o : r.i).time) + '</span><span class="' + (r.geo === 'outside' ? 'bad-text' : 'ok-text') + '" style="font-size:12px;font-weight:600;display:flex;gap:3px;align-items:center">' + I('pin', 14) + t(r.geo === 'outside' ? 'Outside Geofence' : 'Within Geofence') + '</span></div>').join('') || '<p class="muted2">—</p>') + '</div></div></div>';
  }
  function saveAttendance() {
    const f = addState(), g = addGeo(f);
    const [y, mo, d] = f.date.split('-').map(Number); const [h, mi] = f.time.split(':').map(Number);
    const tm = new Date(y, mo - 1, d, h, mi).getTime();
    MM.tx(db0 => {
      db0.punches.push({ id: MM.uid('P'), empId: f.empId, type: f.type, time: tm, siteId: g.home.id, status: 'corrected', manual: true, by: user().name, geo: g.inside ? 'inside' : 'outside', note: f.notes, acc: f.acc, photo: !!f.photo });
      db0.decisions.unshift({ id: MM.uid('D'), time: MM.now(), by: user().name, what: 'Manual ' + (f.type === 'IN' ? 'check-in' : 'check-out') + ' recorded · ' + g.e.name + ' · ' + f.time, why: (f.notes || 'Recorded from the portal') + (g.inside ? '' : ' · outside geofence, flagged') });
      MM.addActivity(db0, { title: 'Attendance recorded', sub: g.e.name + ' · ' + (f.type === 'IN' ? 'Check-in' : 'Check-out') + ' ' + f.time, kind: 'punch' });
      MM.notify(db0, f.empId, 'Your ' + (f.type === 'IN' ? 'check-in' : 'check-out') + ' at ' + f.time + ' was recorded by ' + user().name, 'تم تسجيل ' + (f.type === 'IN' ? 'حضورك' : 'انصرافك') + ' بواسطة ' + user().nameAr, 'approved');
    });
    toast(t('Save Attendance'), g.e.name + ' · ' + f.time + (g.inside ? '' : ' · flagged: outside geofence'), g.inside ? 'ok' : 'warn');
    ui.add = null; render();
  }

  /* ---------------- FIELD OPERATIONS ---------------- */
  const TEAM = { onsite: 'onsite', office: 'onsite', ontheway: 'transit', delayed: 'idle', off: 'offline' };
  const TEAM_PILL = { onsite: ['On Site', 'p-green'], transit: ['In Transit', 'p-blue'], idle: ['Idle', 'p-amber'], offline: ['Offline', 'p-red'] };
  function teamList() { return Object.entries(db().crew).map(([id, c]) => ({ e: emp(id), c, st: TEAM[c.status] || 'onsite' })).filter(x => x.e); }
  function foMapSpec(key) {
    const fo = ui.fo; const items = [];
    const selT = db().tasks.find(x => x.id === fo.selTask);
    db().tasks.filter(x => x.status !== 'signed').forEach(x => items.push({ k: 'task', lat: x.lat, lng: x.lng, prio: x.priority, icon: tIcon(x), sel: x.id === fo.selTask, title: x.id + ' · ' + x.title, click: () => { fo.selTask = x.id; fo.selEmp = x.assignee; render(); } }));
    // individual markers for staff with an open task (or selected); everyone else is grouped per wilayat
    const withTask = new Set(activeTasks().map(x => x.assignee)); const CEN = { Muttrah: [23.618, 58.556], Bousher: [23.588, 58.405], Seeb: [23.672, 58.195], Amerat: [23.523, 58.492], Qurayat: [23.265, 58.912], Muscat: [23.600, 58.455] }; const grp = {};
    teamList().filter(({ e, c }) => { if (withTask.has(e.id) || e.id === fo.selEmp) return true; if (c.status !== 'off') { const w = CEN[e.wilayat] ? e.wilayat : 'Muscat'; grp[w] = (grp[w] || 0) + 1; } return false; }).forEach(({ e, c }) => { if (c.trail && c.status === 'ontheway') items.push({ k: 'route', pts: c.trail.concat([[c.lat, c.lng]]) }); items.push({ k: 'crew', id: e.id, lat: c.lat, lng: c.lng, status: c.status, sel: e.id === fo.selEmp, label: TEAM_PILL[TEAM[c.status] || 'onsite'][0], click: () => { fo.selEmp = e.id; fo.selTask = (activeTasks().find(x => x.assignee === e.id) || db().tasks.find(x => x.assignee === e.id) || {}).id || null; render(); } }); });
    Object.entries(grp).forEach(([w, n]) => items.push({ k: 'cl', lat: CEN[w][0] + .012, lng: CEN[w][1] - .02, n, click: () => { fo.q = w; fo.view = 'live'; render(); } }));
    if (selT) items.push({ k: 'circle', lat: selT.lat, lng: selT.lng, r: selT.radius * 3 });
    specs[key] ={ viewKey: key, center: [23.60, 58.45], zoom: 11, items };
  }
  function legend(counts) { return '<div class="maplegend"><span><i style="background:#0E6B3E"></i>' + t('On Site') + ' (' + counts.onsite + ')</span><span><i style="background:#2E6FD8"></i>' + t('In Transit') + ' (' + counts.transit + ')</span><span><i style="background:#E89B22"></i>' + t('Idle') + ' (' + counts.idle + ')</span><span><i style="background:#E5322B"></i>' + t('Offline') + ' (' + counts.offline + ')</span></div>'; }
  function pFieldOps() {
    const fo = ui.fo;
    const views = [['live', 'Live View', 'pin'], ['list', 'Task List', 'list'], ['board', 'Task Board', 'columns']];
    const tl = teamList(); const counts = { onsite: 0, transit: 0, idle: 0, offline: 0 }; tl.forEach(x => counts[x.st]++);
    let body = '';
    if (fo.view === 'live') {
      foMapSpec('fo');
      const list = tl.filter(x => fo.team === 'all' || x.st === fo.team).filter(x => !fo.q || (x.e.name + x.e.role + x.e.wilayat).toLowerCase().includes(fo.q.toLowerCase()));
      body = '<div class="split fo3 fo-live"><div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Field Teams') + ' (' + tl.length + ')</h3></div>' +
        '<div class="inp-ic" style="margin-bottom:10px">' + I('search', 16) + '<input class="inp" data-f="fo.q" value="' + esc(fo.q) + '" placeholder="' + t('Search team or employee...') + '"></div>' +
        '<div class="chipsel" style="margin-bottom:6px"><button class="' + (fo.team === 'all' ? 'on' : '') + '" data-act="foteam" data-arg="all">' + t('All') + ' (' + tl.length + ')</button>' + Object.keys(counts).map(k => '<button class="' + (fo.team === k ? 'on' : '') + '" data-act="foteam" data-arg="' + k + '">' + t(TEAM_PILL[k][0]) + ' (' + counts[k] + ')</button>').join('') + '</div>' +
        '<div style="max-height:520px;overflow-y:auto;margin-inline-end:-6px;padding-inline-end:6px">' + (list.length > 60 ? '<div class="muted2" style="padding:4px 0 8px">Showing 60 of ' + list.length + ' · search to find others</div>' : '') + list.slice(0, 60).map(({ e, c, st }) => '<div class="li click" data-act="foemp" data-arg="' + e.id + '" style="' + (fo.selEmp === e.id ? 'background:#F1F8F3;border-radius:10px;padding-inline:6px' : '') + '">' + person(e, st === 'offline' ? 'Last seen ' + ampm(c.time) : e.wilayat + ' · ' + ampm(c.time)) + pill(TEAM_PILL[st][1], t(TEAM_PILL[st][0])) + '<span class="flip muted">' + I('fwd', 16) + '</span></div>').join('') + '</div></div>' +
        '<div class="card" style="padding:0;overflow:hidden">' + mapSlot('fo', 640, legend(counts)) + '</div>' + taskPanel(db().tasks.find(x => x.id === fo.selTask), 'fo') + '</div>';
    } else if (fo.view === 'list') {
      foMapSpec('fol');
      const tabs = [['active', 'Active Tasks', activeTasks().length], ['completed', 'Completed', db().tasks.filter(x => ['done', 'signed'].includes(x.status)).length], ['overdue', 'Overdue', db().tasks.filter(isOverdue).length]];
      let list = fo.ltab === 'active' ? activeTasks() : fo.ltab === 'completed' ? db().tasks.filter(x => ['done', 'signed'].includes(x.status)) : db().tasks.filter(isOverdue);
      if (fo.type !== 'all') list = list.filter(x => x.type === fo.type);
      if (fo.q) list = list.filter(x => (x.title + x.loc + (emp(x.assignee) || {}).name).toLowerCase().includes(fo.q.toLowerCase()));
      body = '<div class="split fo3 fo-list"><div><div class="btabs round solid" style="margin-bottom:12px">' + tabs.map(([k, l, n]) => '<button class="' + (fo.ltab === k ? 'on' : '') + '" data-act="foltab" data-arg="' + k + '">' + t(l) + ' <span class="n' + (k === 'overdue' ? ' red' : '') + '">' + n + '</span></button>').join('') + '</div>' +
        '<div class="bar"><div class="inp-ic">' + I('search', 16) + '<input class="inp" data-f="fo.q" value="' + esc(fo.q) + '" placeholder="' + t('Search by task, location or employee...') + '"></div>' + SEL('fo.type', fo.type, Object.keys(MM.TASK_TYPES), 'All Task Types') + '</div>' +
        '<div style="max-height:640px;overflow-y:auto">' + (list.slice(0, 40).map(x => taskCard(x, fo.selTask === x.id, 'fosel')).join('') || '<p class="muted">—</p>') + (list.length > 40 ? '<div class="muted2" style="padding:6px 2px">Showing 40 of ' + list.length + ' · use search or the Tasks page for all</div>' : '') + '</div></div>' +
        '<div class="card" style="padding:0;overflow:hidden">' + mapSlot('fol', 680, legend(counts)) + '</div>' + taskPanel(db().tasks.find(x => x.id === fo.selTask), 'fo') + '</div>';
    } else {
      body = '<div class="split" style="grid-template-columns:minmax(0,1fr) 380px">' + '<div class="card pad">' + board('fo') + '</div>' + taskPanel(db().tasks.find(x => x.id === fo.selTask), 'fo') + '</div>';
    }
    const delayedN = db().tasks.filter(x => x.status === 'delayed').length;
    const tabN = { live: activeCrew().length, list: activeTasks().length, board: db().tasks.length };
    return hero({
      title: t('Field Operations'),
      sub: t('Live today') + ' · ' + MM.fmtNum(activeCrew().length) + ' ' + t('staff in the field') + ' · ' + counts.onsite + ' ' + t('on site') + ' · ' + activeTasks().length + ' ' + t('open tasks') + (delayedN ? ' · <span class="bad-text" style="font-weight:600">' + delayedN + ' ' + t('delayed') + '</span>' : ''),
      right: '<button class="btn primary" data-act="create">' + I('plus', 17) + t('Assign Task') + '</button>',
    }) +
      '<div class="tabs" style="margin-bottom:14px">' + views.map(([k, l, ic]) => '<button class="' + (fo.view === k ? 'on' : '') + '" data-act="foview" data-arg="' + k + '">' + I(ic, 16) + t(l) + ' <span class="n">' + MM.fmtNum(tabN[k]) + '</span></button>').join('') + '</div>' + body;
  }
  function taskCard(x, on, act) {
    const e = emp(x.assignee);
    return '<div class="tcard ' + (on ? 'on' : '') + (ui.flash[x.id] ? ' flash' : '') + '" data-act="' + act + '" data-arg="' + x.id + '"><span class="ti ' + (isOverdue(x) ? 'red' : '') + '">' + I(tIcon(x), 22) + '</span><div class="b"><b>' + esc(L(x.title, x.titleAr)) + '</b><div class="m">' + I('pin', 13) + esc(L(x.loc, x.locAr).split(',')[0]) + '</div><div class="m" style="margin-top:6px">' + av(e, 'sm') + esc(nameOf(e)) + '</div></div><div class="r">' + tStatus(x) + '<span class="muted2" style="white-space:nowrap">' + I('clock', 13) + ' ' + t('Today') + ', ' + ampm(x.due) + '</span></div></div>';
  }
  function board(ctx, src) {
    const cols = [['Assigned', ['assigned'], '', 22], ['In Transit', ['ontheway'], '', 6], ['On Site', ['onsite'], '', 24], ['In Progress', ['inprogress'], '', 28], ['Delayed', ['delayed'], 'dl', 12], ['Completed', ['done', 'signed'], 'cp', 58]];
    const sel = ctx === 'fo' ? ui.fo.selTask : ui.tk.sel;
    return '<div class="kb">' + cols.map(([l, sts, cls, more]) => { const list = (src || db().tasks).filter(x => sts.includes(x.status)); return '<div class="kcol ' + cls + '"><h5>' + t(l) + '<span>' + list.length + '</span></h5>' + list.slice().sort((a, b) => (b.id === sel) - (a.id === sel) || lastUpd(b) - lastUpd(a)).slice(0, 8).map(x => { const e = emp(x.assignee); const p = progress(x); return '<div class="kc ' + (sel === x.id ? 'on' : '') + (ui.flash[x.id] ? ' flash' : '') + '" data-act="' + (ctx === 'fo' ? 'fosel' : 'tksel') + '" data-arg="' + x.id + '"><div class="flexr" style="gap:6px;align-items:flex-start"><span style="color:' + (x.priority === 'High' ? '#E5322B' : '#E89B22') + '">' + I(tIcon(x), 16) + '</span><b>' + esc(L(x.title, x.titleAr)) + '</b></div><div class="m">' + esc(x.wilayat) + '</div><div class="m">' + x.id + '</div>' + (x.status === 'inprogress' ? '<div class="prog" style="margin-top:6px"><i style="width:' + p + '%"></i></div>' : '') + '<div class="f">' + av(e, 'sm') + (x.status === 'delayed' ? '<span class="bad-text" style="font-size:11.5px;font-weight:600">● SLA Overdue</span>' : x.status === 'onsite' ? '<span class="ok-text" style="font-size:11.5px;font-weight:600">● On-Site</span>' : x.status === 'done' ? '<span style="color:#6A4DE0;font-size:11.5px;font-weight:600">● Under Review</span>' : x.status === 'signed' ? '<span class="ok-text" style="font-size:11.5px;font-weight:600">● Completed</span>' : '<span class="muted2">' + ampm(x.due) + '</span>') + '</div></div>'; }).join('') + (list.length > 8 ? '<div class="kmore">+ ' + (list.length - 8) + ' more tasks</div>' : list.length ? '' : '<div class="kmore">—</div>') + '</div>'; }).join('') + '</div>';
  }
  function taskPanel(x, ctx) {
    if (!x) return '<div class="card dpanel"><div class="ch"><h3 style="color:var(--ink)">' + t('Task Details') + '</h3></div><p class="muted">' + t('Select a team member or task to see its details.') + '</p></div>';
    const e = emp(x.assignee), p = progress(x), inside = taskGeo(x), c = db().crew[x.assignee];
    const tabs = [['details', 'Details'], ['checklist', 'Checklist'], ['photos', 'Photos'], ['activity', 'Activity']];
    const pt = ui.ptab;
    const hist = x.history.slice().reverse();
    const STEP = { assigned: 'Task assigned', ontheway: 'Travelling to site', onsite: 'Checked in (within geofence)', inprogress: 'Work started', delayed: 'Marked delayed', done: 'Completed & checked out', signed: 'Signed off by supervisor' };
    const cl = checklist(x);
    let inner = '';
    if (pt === 'details') inner = '<div class="kv"><span>' + t('Location') + '</span><b>' + esc(L(x.loc, x.locAr)) + ' <a class="link" target="_blank" rel="noopener" href="' + openMaps(x.lat, x.lng) + '">' + t('Open in Maps') + ' ↗</a></b><span>' + t('Scheduled Date') + '</span><b>' + MM.fmtDate(x.due) + ', ' + ampm(x.start || x.created) + ' – ' + ampm(x.due) + '</b><span>' + t('Task Type') + '</span><b>' + esc(x.type) + '</b><span>' + t('Priority') + '</span><b>' + prio(x) + '</b><span>' + t('Assigned To') + '</span><div class="flexr kassign">' + person(e) + '<span style="flex:1"></span><button class="btn sm icon" data-act="call" data-arg="' + x.assignee + '" title="Call">' + I('call', 16) + '</button><button class="btn sm icon" data-act="msg" data-arg="' + x.assignee + '" title="Message">' + I('chat', 16) + '</button></div>' +
      (x.desc || x.instructions ? '<span>' + t('Description') + '</span><b class="kdesc">' + esc(x.desc || x.instructions) + '</b>' : '') + '</div>' +
      '<div class="sec"><h4>' + t('Live Location') + '<span style="flex:1"></span><a class="link" target="_blank" rel="noopener" href="' + openMaps(x.lat, x.lng) + '">' + I('route', 15) + 'View Route</a></h4><div class="' + (inside ? 'ok-text' : 'bad-text') + '" style="font-weight:600">● ' + t(inside ? 'Within Geofence' : 'Outside Geofence') + '</div><div class="muted2">' + t('Last updated') + ': ' + (c ? ago(c.time) : '—') + '</div></div>' +
      '<div class="sec"><h4>' + t('Activity Timeline') + '</h4><ul class="tl2">' + hist.slice(0, 4).map(([s, tm]) => '<li><span class="d"></span><span><b style="font-weight:600">' + STEP[s] + '</b></span><span class="t">' + ampm(tm) + '</span></li>').join('') + '</ul></div>';
    else if (pt === 'checklist') inner = cl.map(ci => '<label class="chk"><input type="checkbox" disabled' + (ci.done ? ' checked' : '') + '>' + esc(ci.s) + '</label>').join('') + (x.notes ? '<div class="sec"><h4>' + t('Notes') + '</h4><div>' + esc(x.notes) + '</div></div>' : '') + (x.supNote ? '<div class="sec"><h4>Supervisor note</h4><div class="warn-text">' + esc(x.supNote) + '</div></div>' : '');
    else if (pt === 'photos') inner = (x.photos.length ? '<div class="photos3">' + x.photos.map(ph => '<div style="background-image:url(\'' + (ph.src || MM.samplePhotoSVG(ph.sample || 1)) + '\')"><span>' + MM.fmtTime(ph.time) + ' · ' + ph.lat.toFixed(3) + ', ' + ph.lng.toFixed(3) + '</span></div>').join('') + '</div><div class="ok-text" style="font-size:13px;margin-top:8px;font-weight:600">' + I('shield', 14) + ' EXIF time + GPS verified against task site</div>' : '<p class="muted">No photos yet.</p>') + '<label class="btn sm" style="margin-top:10px">' + I('plus', 15) + t('Add Photo') + '<input type="file" accept="image/*" data-taskphoto="' + x.id + '" hidden></label>';
    else inner = '<ul class="tl2">' + hist.map(([s, tm]) => '<li><span class="d"></span><span><b style="font-weight:600">' + STEP[s] + '</b><small>' + esc(s === 'onsite' && x.distance != null ? x.distance + ' m from site' : s === 'assigned' ? 'by ' + x.createdBy : L(x.loc, x.locAr).split(',')[0]) + '</small></span><span class="t">' + ampm(tm) + '</span></li>').join('') + '</ul>';
    return '<div class="card dpanel"><div class="dh"><button class="btn ghost sm icon" data-act="' + (ctx === 'fo' ? 'fosel' : 'tksel') + '" data-arg=""><span class="flip">' + I('back', 18) + '</span></button><b class="dh-t" style="flex:1;align-self:center">' + t('Task Details') + '</b>' + tStatus(x) + '</div>' +
      '<div class="flexr" style="align-items:flex-start;margin-bottom:6px"><span style="width:44px;height:44px;border-radius:10px;background:#EEF5F0;color:var(--brand);display:grid;place-items:center;flex:none">' + I(tIcon(x), 22) + '</span><div style="flex:1;min-width:0"><h2>' + esc(L(x.title, x.titleAr)) + (x.title.includes('–') ? '' : ' – ' + esc(L(x.loc, x.locAr).split(',')[0])) + '</h2><span class="muted2">' + x.id + '</span></div></div>' +
      '<div style="margin:12px 0"><div class="flexr" style="justify-content:space-between;font-weight:600;margin-bottom:6px"><span>' + t('Progress') + '</span><span>' + p + '%</span></div><div class="prog" style="height:8px"><i style="width:' + p + '%"></i></div></div>' +
      '<div class="tabs" style="margin-bottom:12px">' + tabs.map(([k, l]) => '<button class="' + (pt === k ? 'on' : '') + '" data-act="ptab" data-arg="' + k + '">' + t(l) + (k === 'photos' ? ' (' + x.photos.length + ')' : k === 'checklist' ? ' ' + cl.filter(c2 => c2.done).length + '/' + cl.length : '') + '</button>').join('') + '</div>' + inner +
      '<div class="actions2"><button class="btn" data-act="addnote" data-arg="' + x.id + '">' + I('edit', 16) + t('Add Note') + '</button><button class="btn" data-act="reassign" data-arg="' + x.id + '">' + I('users', 16) + t('Reassign') + '</button></div></div>';
  }
  function statusMenu(x) {
    const opts = x.status === 'done' ? [['signoff', 'Sign off (approve)'], ['returntask', 'Return with note']] : [['assigned', 'Assigned'], ['ontheway', 'In Transit'], ['onsite', 'On Site'], ['inprogress', 'In Progress'], ['delayed', 'Delayed'], ['done', 'Completed – send for review']].filter(o => o[0] !== x.status);
    return '<div class="pop" data-stop style="inset-inline-start:0;inset-inline-end:auto;bottom:calc(100% + 6px);top:auto">' + opts.map(([k, l]) => '<button data-act="' + (k === 'signoff' || k === 'returntask' ? k : 'setstatus') + '" data-arg="' + x.id + (k === 'signoff' || k === 'returntask' ? '' : ':' + k) + '">' + esc(l) + '</button>').join('') + '</div>';
  }
  function setStatus(id, st) {
    MM.tx(d => { const x = d.tasks.find(z => z.id === id); x.status = st; x.history.push([st, MM.now()]); if (st === 'onsite' && !x.arrivedAt) { x.arrivedAt = MM.now(); x.distance = 20; } if (st === 'done') x.completedAt = MM.now(); MM.notify(d, x.assignee, x.id + ' status set to ' + TS[st][0] + ' by ' + user().name, 'تم تحديث حالة ' + x.id, 'info'); MM.addActivity(d, { title: 'Task status updated', sub: x.id + ' → ' + TS[st][0], kind: 'task' }); });
    ui.flash[id] = 1; ui.menu = null; render();
  }

  /* ---------------- TASKS ---------------- */
  /* Tasks for any day in the demo window: today = live records; past days = completed history; upcoming days = scheduled plan (both read-only, derived deterministically from today's plan) */
  const TK_PAST = 6, TK_AHEAD = 7, _tf = { d: null, m: {} };
  const isoD = ms => { const d = new Date(ms); return d.getFullYear() + '-' + MM.pad(d.getMonth() + 1) + '-' + MM.pad(d.getDate()); };
  const isVirtualTask = id => /^TSK-\d{4}-\d{4}$/.test(String(id || ''));
  function tasksFor(day) {
    const today = MM.dayStart(); if (day === today) return db().tasks;
    if (day < today - TK_PAST * 864e5 || day > today + TK_AHEAD * 864e5) return [];
    if (_tf.d !== db()) { _tf.d = db(); _tf.m = {}; }
    if (_tf.m[day]) return _tf.m[day];
    let s = Math.floor(day / 864e5) % 233280; const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const past = day < today, off = day - today, tag = MM.ymd(day).replace(/-/g, '').slice(4);
    const out = db().tasks.filter(() => rnd() < .9).map(x => {
      const due = x.due + off, created = x.created + off;
      const y = Object.assign({}, x, { id: x.id.replace('TSK-', 'TSK-' + tag + '-'), due, created, virtual: true, photos: [], history: [['assigned', created]], status: 'assigned' });
      ['delayReason', 'arrivedAt', 'distance', 'completedAt', 'signedAt', 'signedBy'].forEach(k => delete y[k]);
      if (past) {
        const arr = Math.max(created + 20 * 60000, due - (35 + Math.floor(rnd() * 60)) * 60000);
        y.arrivedAt = arr; y.distance = 10 + Math.floor(rnd() * 60); y.completedAt = arr + 25 * 60000; y.status = rnd() < .85 ? 'signed' : 'done';
        y.history.push(['ontheway', arr - 15 * 60000], ['onsite', arr], ['inprogress', arr + 3 * 60000], ['done', y.completedAt]);
        if (y.status === 'signed') { y.signedBy = 'Salim Al Hinai'; y.signedAt = y.completedAt + 5 * 60000; y.history.push(['signed', y.signedAt]); }
        const n = 1 + Math.floor(rnd() * 3); for (let k = 0; k < n; k++) y.photos.push({ id: y.id + 'p' + k, time: arr + (5 + k * 4) * 60000, lat: x.lat, lng: x.lng, sample: 1 + (k % 3) });
      }
      return y;
    });
    return (_tf.m[day] = out);
  }
  const findTask = id => db().tasks.find(x => x.id === id) || (isVirtualTask(id) ? tasksFor(ui.tk.date || MM.dayStart()).find(x => x.id === id) : null);
  function tkFilter(list) {
    const k = ui.tk;
    if (k.loc !== 'all') list = list.filter(x => x.wilayat === k.loc);
    if (k.type !== 'all') list = list.filter(x => x.type === k.type);
    if (k.who !== 'all') list = list.filter(x => x.assignee === k.who);
    if (k.pri !== 'all') list = list.filter(x => x.priority === k.pri);
    if (k.q) { const q = k.q.toLowerCase(); list = list.filter(x => (x.id + x.title + (x.titleAr || '') + x.wilayat + x.type + nameOf(emp(x.assignee))).toLowerCase().includes(q)); }
    return list;
  }
  function pTasks() {
    const k = ui.tk; const today = MM.dayStart(); const day = k.date || today; const isToday = day === today, past = day < today;
    const dayAll = tasksFor(day);
    const iso = isoD;
    const dayLbl = isToday ? t('Today') : fmtDateL(day);
    const groups = { today: dayAll, overdue: dayAll.filter(isOverdue), unassigned: dayAll.filter(x => !x.assignee), inprogress: dayAll.filter(x => ['inprogress', 'onsite'].includes(x.status)), review: dayAll.filter(x => x.status === 'done') };
    const base = groups[k.group] || dayAll;
    const list = tkFilter(base).slice().sort((a, b) => a.due - b.due || a.id.localeCompare(b.id));
    const per = 10, pg = Math.min(k.page, Math.max(1, Math.ceil(list.length / per)));
    const nSel = checkedTasks().length;
    if (!dayAll.some(x => x.id === k.sel)) k.sel = (list[0] || dayAll[0] || {}).id || null;
    const queue = dayAll.filter(x => !['done', 'signed'].includes(x.status)).sort((a, b) => a.due - b.due).slice(0, 4);
    const grp = [['overdue', 'Overdue', '#D92D20', '#FEF3F2'], ['unassigned', 'Unassigned', '#B54708', '#FFF7EC'], ['inprogress', 'In Progress', '#2E6FD8', '#F2F6FD'], ['review', 'Awaiting Review', '#6A4DE0', '#F5F3FE']];
    const filtersOn = k.loc !== 'all' || k.type !== 'all' || k.who !== 'all' || k.pri !== 'all' || k.q;
    ui.tk.exportList = list;
    const fbar = '<div class="fbar"><div class="inp-ic">' + I('search', 16) + '<input class="inp" data-f="tk.q" value="' + esc(k.q || '') + '" placeholder="' + t('Search task, ID, location or staff...') + '"></div>' +
      SEL('tk.loc', k.loc, [...new Set(db().tasks.map(x => x.wilayat))].sort(), 'All Locations') + SEL('tk.type', k.type, Object.keys(MM.TASK_TYPES), 'All Task Types') + SEL('tk.who', k.who, [...new Set(db().tasks.map(x => x.assignee).filter(Boolean))].map(id => [id, nameOf(emp(id))]).sort((a, b) => a[1].localeCompare(b[1])), 'All Assignees') + SEL('tk.pri', k.pri, ['High', 'Normal', 'Low'], 'All Priorities') +
      (filtersOn ? '<button class="btn ghost sm" data-act="tkreset">' + I('x', 15) + t('Clear filters') + '</button>' : '') + '<span style="flex:1"></span><button class="btn sm" data-act="tkexport">' + I('download', 15) + t('Export') + '</button></div>';
    let center;
    if (k.view === 'list') center = (isToday ? '<div class="bar tkbulk"><button class="sel" data-act="tkall" style="display:inline-flex;gap:8px;align-items:center"><input type="checkbox" ' + (nSel ? 'checked' : '') + ' tabindex="-1" style="pointer-events:none"> ' + nSel + ' ' + t('selected') + '</button><button class="btn sm" data-act="bulkassign">' + I('users', 15) + t('Assign') + '</button><div class="rel"><button class="btn sm" data-act="menu" data-arg="bulkstatus">' + t('Change Status') + ' ' + I('down', 14) + '</button>' + (ui.menu === 'bulkstatus' ? '<div class="pop" data-stop style="inset-inline-start:0;inset-inline-end:auto">' + ['assigned', 'ontheway', 'onsite', 'inprogress', 'delayed'].map(s => '<button data-act="bulkset" data-arg="' + s + '">' + t(TS[s][0]) + '</button>').join('') + '</div>' : '') + '</div><button class="btn sm" data-act="bulkverify">' + I('check', 15) + t('Verify') + '</button></div>'
        : '<div class="tknote">' + I(past ? 'clock' : 'calendar', 15) + (past ? t('Completed history for') : t('Scheduled plan for')) + ' ' + fmtDateL(day) + ' · ' + t('read-only') + '</div>') +
      '<div class="tablewrap"><table class="tbl compact tktbl ' + (isToday ? 'cb' : 'nocb') + '"><thead><tr>' + (isToday ? '<th></th>' : '') + '<th>' + t('Task ID') + '</th><th>' + t('Task Name') + '</th><th>' + t('Assigned To') + '</th><th>' + t('Schedule') + '</th><th>' + t('Geofence') + '</th><th>' + t('Progress') + '</th><th>' + t('Status') + '</th><th>' + t('Priority') + '</th><th>' + t('Last Update') + '</th></tr></thead><tbody>' +
      list.slice((pg - 1) * per, pg * per).map(x => { const e = emp(x.assignee), p = progress(x), g = x.virtual ? (past ? true : null) : taskGeo(x); return '<tr class="click ' + (k.sel === x.id ? 'sel' : '') + (ui.flash[x.id] ? ' new' : '') + '" data-act="tksel" data-arg="' + x.id + '">' + (isToday ? '<td><input type="checkbox" data-tkcheck="' + x.id + '"' + (k.checked[x.id] ? ' checked' : '') + '></td>' : '') + '<td class="muted" style="white-space:nowrap">' + x.id + '</td><td><b style="font-weight:600">' + esc(L(x.title, x.titleAr)) + '</b><br><small class="muted"><span class="tkid-s">' + x.id + ' · </span>' + esc(x.wilayat) + ' · ' + esc(x.type) + '</small></td><td>' + (e ? '<span class="flexr" style="gap:6px">' + av(e, 'sm') + esc(nameOf(e)) + '</span>' : '—') + '</td><td style="white-space:nowrap">' + ampm(x.due) + '</td><td>' + (g === null ? '<span class="muted">—</span>' : '<span class="tag ' + (g ? 'in' : 'out') + '">' + t(g ? 'Inside' : 'Outside') + '</span>') + '</td><td style="min-width:90px">' + p + '%<div class="prog" style="margin-top:4px"><i style="width:' + p + '%"></i></div></td><td>' + tStatus(x) + '</td><td>' + prio(x) + '</td><td class="muted" style="white-space:nowrap">' + (x.virtual ? ampm(lastUpd(x)) : ago(lastUpd(x))) + '</td></tr>'; }).join('') +
      (list.length ? '' : '<tr><td colspan="10" class="muted" style="text-align:center;padding:24px">' + (dayAll.length ? t('No tasks match these filters') : t('No tasks scheduled for this date')) + '</td></tr>') +
      '</tbody></table></div>' + pager(list.length, pg, per, 'tk', t('tasks'));
    else if (k.view === 'board') center = board('tk', list);
    else center = calendar(day);
    const nOpen = dayAll.filter(x => !['done', 'signed'].includes(x.status)).length, nDone = dayAll.length - nOpen;
    const sub = dayLbl + ' · ' + MM.fmtNum(dayAll.length) + ' ' + t('tasks') + (isToday ? ' · ' + groups.inprogress.length + ' ' + t('in progress') + ' · <span class="bad-text">' + groups.overdue.length + ' ' + t('overdue') + '</span> · ' + groups.unassigned.length + ' ' + t('unassigned') : past ? ' · ' + nDone + ' ' + t('completed') : ' · ' + t('scheduled'));
    return hero({
      crumbs: [['Home', 'dashboard'], ['Tasks']], title: t('Task Operations'), sub,
      meta: isToday ? '<span><span class="live-dot"></span>' + t('Live') + ' · ' + t('synced') + ' <span data-clock>' + MM.fmtTimeS(MM.now()) + '</span></span>' : '',
      right: '<label class="datepick" title="Pick a date">' + I('calendar', 16) + '<input type="date" data-f="tk.date" value="' + iso(day) + '" min="' + iso(today - TK_PAST * 864e5) + '" max="' + iso(today + TK_AHEAD * 864e5) + '"></label>' + (isToday ? '' : '<button class="btn" data-act="tktoday">' + t('Today') + '</button>') + '<button class="btn primary" data-act="create">' + I('plus', 17) + t('Create Task') + '</button>',
    }) +
      '<div class="card tkfilters">' + fbar + '</div><div class="split tksplit' + (k.view === 'cal' ? ' cal' : '') + '">' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Task Queue') + '</h3></div><button class="btn block" style="justify-content:space-between;background:' + (k.group === 'today' ? '#EFF7F2' : '#fff') + ';margin-bottom:10px" data-act="tkgroup" data-arg="today"><span>' + (isToday ? t('All today') : t('All tasks')) + ' <span class="cnt-pill">' + dayAll.length + '</span></span>' + (k.group === 'today' ? I('check', 15) : '') + '</button>' +
      (queue.length ? queue.map(x => { const e = emp(x.assignee); const over = isToday && x.due < MM.now(); return '<div class="tcard ' + (k.sel === x.id ? 'on' : '') + '" style="display:block" data-act="tksel" data-arg="' + x.id + '"><div class="flexr"><span class="live-dot" style="animation:none;background:' + (over ? '#D92D20' : '#0E7A43') + '"></span><b style="font-size:13px">' + x.id + '</b></div><b style="display:block;margin-top:4px;font-size:14px">' + esc(L(x.title, x.titleAr)) + '</b><div class="m">' + esc(x.wilayat) + ', Muscat</div><div class="flexr" style="margin-top:8px;font-size:12px;gap:6px">' + av(e, 'sm') + '<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(nameOf(e)) + '</span>' + (isToday ? '<span class="' + (over ? 'bad-text' : 'warn-text') + '" style="font-weight:600" data-sla="' + x.id + '">' + sla(x) + '</span>' : '<span class="muted">' + ampm(x.due) + '</span>') + '</div></div>'; }).join('') : '<p class="muted" style="font-size:13px;margin:4px 2px 6px">' + t('No open tasks for this day') + '</p>') +
      grp.map(([g, l, col, bg]) => '<button class="btn block" style="justify-content:space-between;margin-top:8px;color:' + col + ';background:' + bg + ';border-color:' + (k.group === g ? col : 'transparent') + '" data-act="tkgroup" data-arg="' + g + '"><span>' + t(l) + ' <span class="pill nodot" style="background:#fff;color:' + col + '">' + groups[g].length + '</span></span><span class="flip">' + I('fwd', 15) + '</span></button>').join('') + '</div>' +
      '<div class="card pad"><div class="tabs" style="margin-bottom:14px">' + [['list', 'List'], ['board', 'Board'], ['cal', 'Calendar']].map(([v, l]) => '<button class="' + (k.view === v ? 'on' : '') + '" data-act="tkview" data-arg="' + v + '">' + t(l) + (v === 'list' ? ' <span class="n">' + list.length + '</span>' : '') + '</button>').join('') + '</div>' + center + '</div>' +
      taskPanel(findTask(k.sel), 'tk') + '</div>';
  }
  function calendar(day) {
    const today = MM.dayStart(); const ws = MM.weekStart(day);
    const rec = [[1, 'Weekly market hygiene round', 'Seeb Souq'], [2, 'Slaughterhouse audit (monthly)', 'Qurayat'], [3, 'Water tank sampling round', 'Amerat'], [4, 'Restaurant licence spot checks', 'Bousher'], [0, 'Corniche deep clean', 'Muttrah']];
    return '<div class="tkcal-h"><button class="btn sm" data-act="tkweek" data-arg="-1" title="Previous week"><span class="flip">' + I('back', 15) + '</span></button><b>' + MM.fmtDateShort(ws) + ' – ' + MM.fmtDateShort(ws + 6 * 864e5) + '</b><button class="btn sm" data-act="tkweek" data-arg="1" title="Next week"><span class="flip">' + I('fwd', 15) + '</span></button><span class="muted2">' + t('Click a day to open its task list') + '</span></div>' +
      '<div class="tkcal">' + [0, 1, 2, 3, 4, 5, 6].map(i => {
        const d = ws + i * 864e5; const tk = tkFilter(tasksFor(d)).slice().sort((a, b) => a.due - b.due); const isT = d === today, isSel = d === day;
        const done = tk.filter(x => ['done', 'signed'].includes(x.status)).length;
        return '<div class="tkday' + (isT ? ' today' : '') + (isSel ? ' sel' : '') + '" data-act="tkday" data-arg="' + d + '"><div class="dh"><span>' + MM.fmtDay(d).slice(0, AR() ? 10 : 3) + ' <b>' + new Date(d).getDate() + '</b></span>' + (tk.length ? '<span class="cnt-pill">' + tk.length + '</span>' : '') + '</div>' +
          '<div class="dm">' + (tk.length ? (d < today ? done + ' ' + t('completed') : d === today ? (tk.length - done) + ' ' + t('open') : t('scheduled')) : t('No tasks')) + '</div>' +
          tk.slice(0, 3).map(x => '<div class="ev"><b>' + MM.fmtTime(x.due) + '</b> ' + esc(L(x.title, x.titleAr)) + '</div>').join('') + (tk.length > 3 ? '<div class="more">+' + (tk.length - 3) + ' ' + t('more') + '</div>' : '') +
          rec.filter(r => r[0] === i).map(r => '<div class="ev rc">↻ ' + esc(r[1]) + '<br><small>' + esc(r[2]) + '</small></div>').join('') + '</div>';
      }).join('') + '</div>';
  }

  /* ---------------- EMPLOYEES ---------------- */
  const EMP_PILL = { active: ['Active', 'p-green'], leave: ['On Leave', 'p-amber'], inactive: ['Inactive', 'p-red'] };
  function lastActive(e) { const ps = db().punches.filter(p => p.empId === e.id); const c = db().crew[e.id]; const tms = ps.map(p => p.time).concat(c ? [c.time] : []); if (!tms.length) return '—'; const m = Math.max(...tms); return (MM.dayStart(m) === MM.dayStart() ? t('Today') + ', ' : MM.fmtDateShort(m) + ', ') + ampm(m); }
  function pEmployees() {
    const k = ui.emp; const all = db().employees;
    const tabsDef = [['all', 'All Employees', all], ['active', 'Active', all.filter(e => e.status !== 'inactive')], ['inactive', 'Inactive', all.filter(e => e.status === 'inactive')], ['field', 'Field Staff', all.filter(e => e.field)], ['office', 'Office Staff', all.filter(e => !e.field)]];
    let list = (tabsDef.find(x => x[0] === k.tab) || tabsDef[0])[2];
    if (k.q) list = list.filter(e => (e.name + e.nameAr + e.code + e.email + e.phone).toLowerCase().includes(k.q.toLowerCase()));
    if (k.dept !== 'all') list = list.filter(e => e.dept === k.dept);
    if (k.site !== 'all') list = list.filter(e => e.wilayat === k.site);
    if (k.role !== 'all') list = list.filter(e => e.role === k.role);
    if (k.status !== 'all') list = list.filter(e => e.status === k.status);
    const per = 10, pg = Math.min(k.page, Math.max(1, Math.ceil(list.length / per)));
    const nSel = Object.values(k.checked).filter(Boolean).length;
    const n = x => (tabsDef.find(t2 => t2[0] === x) || [0, 0, []])[2].length;
    ui.emp.lastList = list;
    const onLeave = all.filter(e => e.status === 'leave').length, depts = new Set(all.map(e => e.dept)).size;
    const filtersOn = k.q || k.dept !== 'all' || k.site !== 'all' || k.role !== 'all' || k.status !== 'all';
    return hero({
      crumbs: [['Home', 'dashboard'], ['Employees']], title: t('Employees'),
      sub: MM.fmtNum(n('all')) + ' ' + t('employees') + ' · ' + MM.fmtNum(n('active')) + ' ' + t('active') + ' · ' + onLeave + ' ' + t('on leave today') + ' · ' + depts + ' ' + t('departments') + ' · ' + MM.fmtNum(activeCrew().length) + ' ' + t('sharing live location'),
      right: '<button class="btn primary" data-act="addemp">' + I('plus', 17) + t('Add Employee') + '</button>',
    }) +
      '<div class="tabs" style="margin-bottom:14px">' + tabsDef.map(([kk, l]) => '<button class="' + (k.tab === kk ? 'on' : '') + '" data-act="emptab" data-arg="' + kk + '">' + t(l) + ' <span class="n">' + MM.fmtNum(n(kk)) + '</span></button>').join('') + '</div>' +
      '<div class="split" style="grid-template-columns:minmax(0,1fr)' + (k.sel ? ' 370px' : '') + '"><div class="card pad">' +
      '<div class="fbar" style="border-top:0;padding-top:0"><div class="inp-ic">' + I('search', 16) + '<input class="inp" data-f="emp.q" value="' + esc(k.q) + '" placeholder="' + t('Search by name, ID, phone or email...') + '"></div>' + SEL('emp.dept', k.dept, [...new Set(all.map(e => e.dept))].sort(), 'All Departments') + SEL('emp.site', k.site, [...new Set(all.map(e => e.wilayat))].sort(), 'All Locations') + SEL('emp.role', k.role, [...new Set(all.map(e => e.role))].sort(), 'All Roles') + SEL('emp.status', k.status, Object.keys(EMP_PILL).map(s => [s, t(EMP_PILL[s][0])]), 'All Statuses') +
      (filtersOn ? '<button class="btn ghost sm" data-act="empreset">' + I('x', 15) + t('Clear filters') + '</button>' : '') + '<span style="flex:1"></span><button class="btn sm" data-act="empexport">' + I('download', 15) + t('Export') + '</button></div>' +
      (nSel ? '<div class="selbar"><b>' + nSel + ' ' + t('selected') + '</b><button class="btn sm" data-act="assignrole">' + I('user', 15) + t('Assign Role') + '</button><button class="btn sm" data-act="assignloc">' + I('pin', 15) + t('Assign Location') + '</button><div class="rel"><button class="btn sm" data-act="menu" data-arg="empstatus">' + I('refresh', 15) + t('Change Status') + ' ' + I('down', 14) + '</button>' + (ui.menu === 'empstatus' ? '<div class="pop" data-stop style="inset-inline-start:0;inset-inline-end:auto">' + Object.keys(EMP_PILL).map(s => '<button data-act="empset" data-arg="' + s + '">' + t(EMP_PILL[s][0]) + '</button>').join('') + '</div>' : '') + '</div><span style="flex:1"></span><button class="link" data-act="empall">' + t('Clear selection') + '</button></div>' : '') +
      '<div class="tablewrap"><table class="tbl compact emptbl"><thead><tr><th><input type="checkbox" data-act="empall" title="Select all"' + (nSel ? ' checked' : '') + '></th><th>' + t('Employee') + '</th><th>' + t('Employee ID') + '</th><th>' + t('Department') + '</th><th>' + t('Role') + '</th><th>' + t('Location') + '</th><th>' + t('Status') + '</th><th>' + t('Last Active') + '</th><th></th></tr></thead><tbody>' +
      list.slice((pg - 1) * per, pg * per).map(e => '<tr class="click ' + (k.sel === e.id ? 'sel' : '') + '" data-act="empsel" data-arg="' + e.id + '"><td><input type="checkbox" data-empcheck="' + e.id + '"' + (k.checked[e.id] ? ' checked' : '') + '></td><td>' + person(e, e.email) + '</td><td class="muted">' + e.code + '</td><td>' + esc(e.dept) + '</td><td>' + esc(L(e.role, e.roleAr)) + '</td><td style="white-space:nowrap">' + I('pin', 14) + ' ' + esc(e.wilayat) + '</td><td>' + pill(EMP_PILL[e.status][1], t(EMP_PILL[e.status][0])) + '</td><td class="muted">' + lastActive(e) + '</td><td>' + I('more', 18) + '</td></tr>').join('') + (list.length ? '' : '<tr><td colspan="9" class="muted" style="text-align:center;padding:24px">' + t('No employees match these filters') + '</td></tr>') + '</tbody></table></div>' + pager(list.length, pg, per, 'emp', t('employees')) + '</div>' +
      (k.sel ? empPanel(emp(k.sel)) : '') + '</div>';
  }
  function empPanel(e) {
    if (!e) return '';
    const k = ui.emp; const code = MM.shiftToday(db(), e.id); const sh = db().shifts[code] || db().shifts.M;
    let inner = '';
    if (k.ptab === 'overview') inner = '<div class="sec" style="border:0;margin:0;padding:0"><h4>' + t('Basic Information') + '</h4><div class="kv" style="grid-template-columns:120px 1fr"><span>' + t('Full Name') + '</span><b>' + esc(nameOf(e)) + '</b><span>' + t('Employee ID') + '</span><b>' + e.code + '</b><span>' + t('Email') + '</span><b style="word-break:break-all">' + esc(e.email) + '</b><span>' + t('Phone') + '</span><b dir="ltr" style="text-align:start">' + esc(e.phone) + '</b><span>' + t('Date of Birth') + '</span><b>' + e.dob + '</b><span>' + t('Nationality') + '</span><b>Omani</b><span>' + t('Gender') + '</span><b>' + (e.gender === 'F' ? 'Female' : 'Male') + '</b><span>' + t('Address') + '</span><b>' + esc(e.wilayat) + ', Muscat</b></div></div>' +
      '<div class="sec"><h4>' + t('Work Information') + '</h4><div class="kv" style="grid-template-columns:130px 1fr"><span>' + t('Department') + '</span><b>' + esc(e.dept) + '</b><span>' + t('Role') + '</span><b>' + esc(L(e.role, e.roleAr)) + '</b><span>' + t('Location') + '</span><b>' + esc(MM.nm(MM.siteById(e.siteId))) + '</b><span>' + t('Reporting Manager') + '</span><b>' + esc(L(db().people.director.name, db().people.director.nameAr)) + '</b><span>' + t('Joining Date') + '</span><b>' + e.joined + '</b><span>' + t('Employment Type') + '</span><b>' + (e.field ? t('Field Staff') : t('Office Staff')) + '</b><span>' + t('Shift') + '</span><b>' + esc(L(sh.name, sh.ar)) + (sh.from && code !== 'S' ? ' (' + sh.from + ' – ' + sh.to + ')' : '') + '</b><span>' + t('Geofence Access') + '</span><b class="ok-text">✓ ' + t('Enabled') + '</b>' +
      '<span>' + t('Registered Device') + '</span><b>' + (e.device ? '<span class="mono" style="font-size:12px">' + esc(e.device) + '</span> <button class="link" data-act="resetdev" data-arg="' + e.id + '">' + t('Reset device') + '</button>' : pill('p-amber', 'Not registered')) + '</b><span>' + t('AD Account') + '</span><b>' + (e.adStatus === 'blocked' ? pill('p-red', 'Disabled') : pill('p-green', t('Active'))) + ' <button class="link" data-act="adtoggle" data-arg="' + e.id + '">' + t(e.adStatus === 'blocked' ? 'Unblock' : 'Block (leaver)') + '</button></b></div></div>';
    else if (k.ptab === 'attendance') { const ps = db().punches.filter(p => p.empId === e.id).sort((a, b) => b.time - a.time).slice(0, 10); inner = ps.length ? ps.map(p => '<div class="li"><span class="ii">' + I(p.type === 'IN' ? 'logout' : 'clock', 17) + '</span><div class="lt"><b>' + (p.type === 'IN' ? t('Check In') : t('Check Out')) + '</b><small>' + MM.fmtDate(p.time) + ' · ' + esc((MM.siteById(p.siteId) || {}).name || '') + '</small></div><span class="tm">' + ampm(p.time) + '</span></div>').join('') : '<p class="muted">—</p>'; }
    else if (k.ptab === 'tasks') { const ts = db().tasks.filter(x => x.assignee === e.id); inner = ts.length ? ts.map(x => '<div class="li click" data-act="stask" data-arg="' + x.id + '"><span class="ii">' + I(tIcon(x), 17) + '</span><div class="lt"><b>' + esc(L(x.title, x.titleAr)) + '</b><small>' + x.id + ' · ' + esc(x.wilayat) + '</small></div>' + tStatus(x) + '</div>').join('') : '<p class="muted">—</p>'; }
    else if (k.ptab === 'documents') inner = ['Employment contract.pdf', 'Civil ID copy.pdf', 'Driving licence.pdf'].map(f => '<div class="li"><span class="ii">' + I('file', 17) + '</span><div class="lt"><b>' + f + '</b><small>Synced from Oracle HRMS</small></div></div>').join('');
    else { const h = db().decisions.filter(d => d.what.includes(e.name)).concat(db().audit.filter(a => a.empId === e.id).map(a => ({ time: a.time, by: 'Anti-fraud engine', what: a.what + ' (' + a.code + ')' }))).sort((a, b) => b.time - a.time).slice(0, 10); inner = h.length ? '<ul class="tl2">' + h.map(x => '<li><span class="d"></span><span><b style="font-weight:600">' + esc(x.what) + '</b><small>' + esc(x.by) + '</small></span><span class="t">' + MM.fmtDateShort(x.time) + '</span></li>').join('') + '</ul>' : '<p class="muted">—</p>'; }
    return '<div class="card dpanel"><div class="dh">' + av(e, 'xl') + '<div style="flex:1;min-width:0"><div class="flexr" style="flex-wrap:wrap"><h2>' + esc(nameOf(e)) + '</h2>' + pill(EMP_PILL[e.status][1], t(EMP_PILL[e.status][0])) + '</div><div class="muted2">' + e.code + '</div><div class="muted2">' + esc(L(e.role, e.roleAr)) + ' | ' + esc(e.dept) + '</div></div><button class="btn ghost sm icon" data-act="empsel" data-arg="">' + I('x', 18) + '</button></div>' +
      '<div class="tabs">' + [['overview', 'Overview'], ['attendance', 'Attendance'], ['tasks', 'Tasks'], ['documents', 'Documents'], ['history', 'History']].map(([kk, l]) => '<button class="' + (k.ptab === kk ? 'on' : '') + '" data-act="empptab" data-arg="' + kk + '" style="padding:10px 8px">' + t(l) + '</button>').join('') + '</div>' + inner +
      '<div class="qa" style="margin-top:16px"><button data-act="assigntask" data-arg="' + e.id + '">' + I('fileplus', 21) + t('Assign Task') + '</button><button data-act="viewloc" data-arg="' + e.id + '">' + I('pin', 21) + t('View Location') + '</button><button data-act="msg" data-arg="' + e.id + '">' + I('chat', 21) + t('Message') + '</button><button data-act="empptab" data-arg="history">' + I('more', 21) + t('More') + '</button></div></div>';
  }

  /* ---------------- SHIFTS & ROSTERS ---------------- */
  function weekStartMs() { return MM.weekStart(MM.now()) + ui.sh.week * 7 * 864e5; }
  const SH_ICON = { M: 'sun', E: 'moon', N: 'moon', S: 'swap', L: 'plane', O: 'x' };
  function pShifts() {
    const k = ui.sh; const ws = weekStartMs(); const r = MM.rosterFor(db(), ws); const sh = db().shifts;
    const ids = MM.ROSTER_ORDER.filter(id => r.rows[id]).concat(Object.keys(r.rows).filter(id => !MM.ROSTER_ORDER.includes(id)));
    let cells = 0, filled = 0; const empty = []; ids.forEach(id => r.rows[id].forEach((c, i) => { if (c !== 'O' && c !== 'L') { cells++; if (c) filled++; else empty.push([id, i]); } }));
    const todayIdx = MM.dayStart() >= ws && MM.dayStart() < ws + 7 * 864e5 ? new Date(MM.now()).getDay() : -1;
    let main = '';
    if (k.tab === 'roster') {
      main = '<div class="tablewrap"><table class="ros"><thead><tr><th class="emp" style="text-align:start">' + t('Employees') + ' (' + ids.length + ')</th>' + [0, 1, 2, 3, 4, 5, 6].map(i => { const d = ws + i * 864e5; return '<th class="' + (i === todayIdx ? 'today' : '') + '">' + MM.fmtDay(d).slice(0, AR() ? 10 : 3) + '<small>' + new Date(d).getDate() + ' ' + (AR() ? MM.MON_AR : MM.MON)[new Date(d).getMonth()] + '</small></th>'; }).join('') + '</tr></thead><tbody>' +
        ids.map(id => { const e = emp(id); if (!e) return ''; return '<tr><td class="emp">' + person(e, e.code + ' · ' + e.role) + '</td>' + r.rows[id].map((c, i) => { const s = sh[c]; const cls = c ? 'rc-' + c : 'rc-X'; const inner = !c ? '+ ' + t('Assign') : c === 'O' ? '—<br>' + t('Off') : c === 'L' ? '<b>' + I('plane', 13) + t('Leave') + '</b><small>Annual Leave</small>' : '<b>' + I(SH_ICON[c], 13) + esc(L(s.name, s.ar)) + '</b><small dir="ltr">' + (c === 'S' ? s.from + ' + ' + s.to : s.from + ' – ' + s.to) + '</small><small>' + esc(e.wilayat) + '</small>'; return '<td class="' + (i === todayIdx ? 'today' : '') + '"><button class="rc ' + cls + '" data-act="cell" data-emp="' + id + '" data-day="' + i + '">' + inner + '</button></td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
    } else if (k.tab === 'templates') {
      main = '<div class="grid g3">' + Object.entries(sh).filter(([c]) => c !== 'O').map(([c, s]) => '<div class="rc rc-' + c + '" style="min-height:auto;padding:14px"><b style="font-size:16px">' + I(SH_ICON[c], 18) + esc(L(s.name, s.ar)) + '</b><small style="font-size:13px;margin-top:6px" dir="ltr">' + (s.from ? (c === 'S' ? s.from + ' + ' + s.to : s.from + ' – ' + s.to) : 'All day') + '</small><small style="margin-top:4px">' + ids.filter(id => r.rows[id].includes(c)).length + ' employees this week</small></div>').join('') + '</div>';
    } else {
      const rules = db().rules; const locks = Object.entries(db().locks).sort((a, b) => b[0].localeCompare(a[0]));
      const lockBadge = s => ({ open: pill('p-green', t('Open')), soft: pill('p-amber', t('Soft lock')), hard: pill('p-red', t('Hard lock')), payroll: '<span class="badge dark">' + t('Payroll-complete · permanent') + '</span>' }[s]);
      const lockAct = (kk, s) => s === 'open' ? '<button class="btn sm" data-act="lock" data-arg="' + kk + ':soft">' + I('lock', 14) + t('Soft lock') + '</button>' : s === 'soft' ? '<button class="btn sm ghost" data-act="lock" data-arg="' + kk + ':open">' + t('Re-open') + '</button><button class="btn sm" data-act="lock" data-arg="' + kk + ':hard">' + I('lock', 14) + t('Hard lock') + '</button>' : s === 'hard' ? '<button class="btn sm primary" data-act="lock" data-arg="' + kk + ':payroll">' + I('upload', 14) + t('Export to Oracle Payroll') + '</button>' : '';
      const rule = (kk, l, unit) => '<div class="li"><div class="lt">' + l + '</div>' + (k.editRules ? '<input class="inp" style="width:80px" type="number" data-rule="' + kk + '" value="' + rules[kk] + '"> ' + unit : '<b>' + rules[kk] + ' ' + unit + '</b>') + '</div>';
      main = '<div class="grid g2"><div><div class="ch"><h3 style="color:var(--ink)">' + t('Attendance rules') + '</h3><div class="r">' + (k.editRules ? '<button class="btn sm" data-act="rulescancel">' + t('Cancel') + '</button><button class="btn sm primary" data-act="rulessave">' + t('Save') + '</button>' : '<button class="btn sm" data-act="rulesedit">' + I('edit', 14) + 'Edit</button>') + '</div></div>' + rule('grace', 'Grace period (late-in)', 'min') + rule('earlyOut', 'Early-out tolerance', 'min') + rule('otAfter', 'Overtime starts after', 'h per day') + rule('otAuto', 'Overtime auto-approve up to', 'h') + rule('missing', 'Missing punch flagged after shift +', 'h') + '</div>' +
        '<div><div class="ch"><h3 style="color:var(--ink)">' + t('Attendance periods & payroll locks') + '</h3></div>' + locks.map(([kk, s]) => { const [y, m] = kk.split('-').map(Number); return '<div class="li"><div class="lt"><b>' + MM.monthName(m - 1, y) + '</b></div><span class="flexr">' + lockBadge(s) + lockAct(kk, s) + '</span></div>'; }).join('') + '<p class="muted2" style="line-height:1.5">Auto-lock: soft lock on the 1st, hard lock on the 3rd, export to Oracle Payroll on the 4th at 02:00.</p></div></div>';
    }
    const tpl = sh[k.tpl] || sh.M;
    const isThisWeek = todayIdx >= 0;
    return hero({
      crumbs: [['Home', 'dashboard'], ['Shifts & Rosters']], title: t('Shifts & Rosters'),
      sub: t('Health Inspection roster') + ' · ' + ids.length + ' ' + t('employees') + ' · ' + cells + ' ' + t('shifts this week') + ' · ' + filled + ' ' + t('filled') + ' · ' + (empty.length ? '<span class="bad-text">' + empty.length + ' ' + t('unfilled') + '</span>' : '<span class="ok-text">' + t('all covered') + '</span>'),
      right: (r.published ? '<span class="stchip st-pub">' + I('check', 14) + t('Published') + ' ' + MM.fmtTime(r.publishedAt) + '</span>' : '<span class="stchip st-draft"><i></i>' + t('Draft') + '</span>') +
        '<div class="weeknav"><button data-act="week" data-arg="-1" title="Previous week"><span class="flip">' + I('back', 16) + '</span></button><span>' + I('calendar', 15) + MM.fmtDateShort(ws) + ' – ' + MM.fmtDate(ws + 6 * 864e5) + '</span><button data-act="week" data-arg="1" title="Next week"><span class="flip">' + I('fwd', 16) + '</span></button></div>' + (isThisWeek ? '' : '<button class="btn" data-act="week" data-arg="0">' + t('This week') + '</button>') +
        '<button class="btn primary" data-act="publish">' + I('send', 16) + t(r.published ? 'Re-publish' : 'Publish Roster') + '</button>',
    }) +
      '<div class="tabs" style="margin-bottom:14px">' + [['roster', 'Roster View', ids.length], ['templates', 'Shift Templates', Object.keys(sh).filter(c => c !== 'O').length], ['rules', 'Rules & Locks', null]].map(([kk, l, n]) => '<button class="' + (k.tab === kk ? 'on' : '') + '" data-act="shtab" data-arg="' + kk + '">' + t(l) + (n != null ? ' <span class="n">' + n + '</span>' : '') + '</button>').join('') + '</div>' +
      '<div class="split shsplit"><div>' +
      '<div class="card pad">' + main + '</div></div>' +
      '<div class="grid"><div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Shift Details') + '</h3></div><div class="flexr"><span class="rc rc-' + k.tpl + '" style="width:40px;min-height:40px;border-radius:50%;display:grid;place-items:center;border:0;padding:0">' + I(SH_ICON[k.tpl], 20) + '</span><div><b style="font-size:16px">' + esc(L(tpl.name, tpl.ar)) + ' Shift</b> ' + pill('p-green', t('Active')) + '<div class="muted2" dir="ltr" style="text-align:start">' + (tpl.from ? (k.tpl === 'S' ? tpl.from + ' + ' + tpl.to : tpl.from + ' – ' + tpl.to) : '—') + '</div></div></div>' +
      '<div class="kv" style="margin-top:12px;grid-template-columns:100px 1fr"><span>' + t('Location') + '</span><b>All sites</b><span>' + t('Department') + '</span><b>Field Operations</b><span>' + t('Assigned') + '</span><b>' + ids.filter(id => r.rows[id].includes(k.tpl)).length + ' ' + t('employees') + '</b><span>' + t('Description') + '</span><b>Standard field inspection shift</b></div><div class="actions2"><button class="btn sm" data-act="shtab" data-arg="templates">' + I('edit', 14) + t('Edit Shift') + '</button><button class="btn sm" data-act="noop">' + t('Duplicate') + '</button></div></div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Shift Templates') + '</h3><div class="r"><button class="link" data-act="shtab" data-arg="templates">' + t('View All') + '</button></div></div>' + ['M', 'E', 'N', 'S'].map(c => '<div class="tpl" draggable="true" data-code="' + c + '" data-act="shtpl" data-arg="' + c + '"><span class="ti rc-' + c + '" style="border:0;padding:0">' + I(SH_ICON[c], 18) + '</span><div style="flex:1"><b style="font-size:14px">' + esc(L(sh[c].name, sh[c].ar)) + ' Shift</b><div class="muted2" dir="ltr" style="text-align:start">' + (c === 'S' ? sh[c].from + ' + ' + sh[c].to : sh[c].from + ' – ' + sh[c].to) + '</div></div>' + I('more', 18) + '</div>').join('') + '<p class="muted2" style="margin:8px 0 0">Drag a template onto a roster cell</p></div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Unassigned Shifts') + ' (' + empty.length + ')</h3></div>' + (empty.length ? empty.slice(0, 4).map(([id, i]) => { const e = emp(id); return '<div class="li click" data-act="cell" data-emp="' + id + '" data-day="' + i + '"><span class="ii" style="background:#FDECEA;color:#D92D20">' + I('alert', 18) + '</span><div class="lt"><b>' + esc(e.role) + '</b><small>' + esc(e.wilayat) + ' | ' + MM.fmtDateShort(ws + i * 864e5) + '</small></div><span class="pill p-red nodot">1 ' + t('needed') + '</span></div>'; }).join('') : '<p class="muted2">All shifts are filled.</p>') + '</div>' +
      '<div class="card pad"><div class="ch"><h3 style="color:var(--ink)">' + t('Quick Actions') + '</h3></div><div class="qa"><button data-act="rosterdl">' + I('download', 20) + t('Download Roster') + '</button><button data-act="publish">' + I('send', 20) + t('Publish Roster') + '</button><button data-act="notifyteam">' + I('bell', 20) + t('Notify Team') + '</button><button data-act="importsched">' + I('upload', 20) + t('Import Schedule') + '</button></div></div></div></div>';
  }
  function setCell(empId, day, code) { const ws = weekStartMs(); const k = MM.weekKey(ws); MM.tx(d => { if (!d.roster[k]) d.roster[k] = { rows: MM.rosterFor(d, ws).rows, published: false }; d.roster[k].rows[empId][day] = code; d.roster[k].published = false; }); }

  /* ---------------- GEOFENCES ---------------- */
  function draft() { const g = ui.geo; if (!g.draft || g.draft.id !== g.sel) { const s = MM.siteById(g.sel) || db().sites[0]; g.sel = s.id; g.draft = MM.clone(s); } return g.draft; }
  function siteBounds(d) { if (d.shape === 'polygon') return d.polygon.map(p => [p.lat, p.lng]); const a = MM.fromXY(-(d.radius + d.buffer), -(d.radius + d.buffer), d.center), b = MM.fromXY(d.radius + d.buffer, d.radius + d.buffer, d.center); return [[a.lat, a.lng], [b.lat, b.lng]]; }
  function pGeofences() {
    const d = draft(); const sites = db().sites; const arc = db().integrations.find(x => x.key === 'arcgis');
    const allDepts = ['Health Inspection', 'Licensing', 'Muttrah Admin', 'Road Maintenance', 'Cleaning Services', 'Customer Service', 'Field Operations', 'Waste Management', 'Maintenance', 'Administration'];
    specs.geo = {
      viewKey: 'geo-' + d.id + '-' + d.shape, bounds: siteBounds(d), center: [MM.siteCenter(d).lat, MM.siteCenter(d).lng], zoom: 16,
      items: L2() ? null : (d.shape === 'circle' ? [{ k: 'circle', lat: d.center.lat, lng: d.center.lng, r: d.radius }] : [{ k: 'poly', pts: d.polygon }]),
      custom: L2() ? geoEditor : null,
    };
    const area = Math.round(MM.siteArea(d));
    return hero({ crumbs: [['Home', 'dashboard'], ['Locations & Geofences']], title: t('Locations & Geofences'), sub: sites.length + ' sites · boundaries imported from MM ArcGIS · last sync ' + MM.relDay(arc.last) + ' ' + MM.fmtTime(arc.last), quote: 'Every site, precisely mapped.', art: 'fort', right: '<div class="flexr" style="flex-direction:column;align-items:stretch"><button class="btn" data-act="arcgis">' + I('upload', 17) + t('Import from ArcGIS') + '</button><button class="btn primary" data-act="newgeo">' + I('plus', 17) + t('New geofence') + '</button></div>' }) +
      '<div class="split" style="grid-template-columns:290px minmax(0,1fr) 320px"><div class="card pad"><div class="eyebrow" style="margin-bottom:8px">Sites</div>' + sites.map(s => '<div class="li click" data-act="geosel" data-arg="' + s.id + '" style="padding:10px;border-radius:10px;' + (s.id === ui.geo.sel ? 'background:#EFF7F2' : '') + '"><span class="ii">' + I(s.shape === 'circle' ? 'target' : 'map', 18) + '</span><div class="lt"><b>' + esc(MM.nm(s)) + '</b><small' + (s.valid === 'temporary' ? ' class="warn-text"' : '') + '>' + (s.valid === 'temporary' ? t('Temporary') + ' · ' + t('ends') + ' ' + esc(s.until) : (s.shape === 'circle' ? t('Circle') + ' ' + s.radius + ' m' : t('Polygon')) + ' · ' + db().employees.filter(e => e.siteId === s.id).length + ' ' + t('staff')) + '</small></div></div>').join('') + '</div>' +
      '<div class="card" style="padding:0;overflow:hidden">' + mapSlot('geo', 560, geoSearchBox() + '<div class="mapnote" style="inset-inline-start:auto;inset-inline-end:10px;top:auto;bottom:10px">' + I('info', 13) + ' ' + (draft().shape === 'circle' ? t('Drag the circle to move it · drag the edge point to resize') : t('Drag corners to reshape · drag a + to add a corner · double-click a corner to remove it')) + '</div>') + '<div class="flexr" style="padding:12px 16px;flex-wrap:wrap;gap:6px 20px;font-size:13.5px"><span>Source: ArcGIS parcel <b>' + esc(d.parcel) + '</b></span>' + (d.shape === 'polygon' ? '<span>' + t('Polygon') + ' <b>' + d.polygon.length + ' ' + t('corners') + '</b></span>' : '') + '<span>Area <b>' + MM.fmtNum(area) + ' m²</b></span><span>Converted UTM 40N → WGS84</span></div></div>' +
      '<div class="card pad"><label style="display:block;margin-bottom:12px"><span class="lbl">' + t('Site name') + '</span><input class="inp" style="width:100%" data-g="name" value="' + esc(d.name) + '"></label>' +
      '<span class="lbl">' + t('Shape') + '</span><div class="typeseg" style="margin-bottom:12px"><button class="' + (d.shape === 'polygon' ? 'on' : '') + '" data-act="gshape" data-arg="polygon">' + t('Polygon') + '</button><button class="' + (d.shape === 'circle' ? 'on' : '') + '" data-act="gshape" data-arg="circle">' + t('Circle') + '</button></div><button class="btn block" style="margin-bottom:12px" data-act="geohere">' + I('target', 16) + t('Use my current location') + '</button>' +
      (d.shape === 'circle' ? '<label style="display:block;margin-bottom:12px"><span class="lbl">' + t('Radius (m)') + '</span><input class="inp" style="width:100%" type="number" data-g="radius" value="' + d.radius + '"></label>' : '') +
      '<label style="display:block;margin-bottom:12px"><span class="lbl">' + t('Buffer zone (m)') + '</span><input class="inp" style="width:100%" type="number" data-g="buffer" value="' + d.buffer + '"></label>' +
      '<label style="display:block;margin-bottom:12px"><span class="lbl">' + t('Min GPS accuracy (m)') + '</span><input class="inp" style="width:100%" type="number" data-g="minAcc" value="' + d.minAcc + '"></label>' +
      '<label style="display:block;margin-bottom:12px"><span class="lbl">' + t('Valid') + '</span><select class="sel" style="width:100%" data-g="valid"><option value="permanent"' + (d.valid === 'permanent' ? ' selected' : '') + '>' + t('Permanent') + '</option><option value="temporary"' + (d.valid === 'temporary' ? ' selected' : '') + '>' + t('Temporary') + (d.until ? ' · ' + t('ends') + ' ' + esc(d.until) : '') + '</option></select></label>' +
      '<span class="lbl">' + t('Assigned to') + '</span><div class="flexr" style="flex-wrap:wrap;gap:6px;margin-bottom:16px">' + d.depts.map(x => '<span class="pill p-gray nodot">' + esc(x) + ' <button style="border:0;background:none;padding:0;display:grid" data-act="gdel" data-arg="' + esc(x) + '">' + I('x', 13, 2.4) + '</button></span>').join('') + '<select class="sel" data-g="adddept" style="padding:4px 8px;font-size:13px;color:var(--brand);font-weight:600"><option value="">+ ' + t('Add') + '</option>' + allDepts.filter(x => !d.depts.includes(x)).map(x => '<option>' + esc(x) + '</option>').join('') + '</select></div>' +
      '<div class="grid g2" style="gap:10px"><button class="btn" data-act="gcancel">' + t('Cancel') + '</button><button class="btn primary" data-act="gsave">' + t('Save') + '</button></div></div></div>';
  }
  /* ---- location search on the geofence map: saved sites, typed coordinates and places from OpenStreetMap (Oman) ---- */
  function geoSearchBox() {
    const g = ui.geo;
    return '<div class="gsr" data-stop>' + I('search', 17) + '<input id="gsrq" placeholder="' + esc(t('Search a location, area or coordinates…')) + '" value="' + esc(g.q || '') + '" autocomplete="off">' +
      (g.q ? '<button class="gsr-x" data-act="gsrclear" title="' + esc(t('Clear')) + '">' + I('x', 15, 2.4) + '</button>' : '') +
      '<div class="gsr-res" id="gsrres"' + (g.open ? '' : ' hidden') + '>' + geoSearchList() + '</div></div>';
  }
  function geoSearchList() {
    const g = ui.geo, f = g.found || [];
    if (g.busy && !f.length) return '<div class="gsr-m"><span class="spin dark"></span>' + t('Searching…') + '</div>';
    if (!f.length) return '<div class="gsr-m">' + esc(g.err || t('No places found – try another name, or type coordinates like 23.6139, 58.5922')) + '</div>';
    return f.map((r, i) => '<button data-act="gsrpick" data-arg="' + i + '">' + I(r.kind === 'site' ? 'target' : r.kind === 'xy' ? 'pin' : 'map', 17) + '<span><b>' + esc(r.name) + '</b><small>' + esc(r.sub) + '</small></span></button>').join('') +
      (g.busy ? '<div class="gsr-m"><span class="spin dark"></span>' + t('Searching…') + '</div>' : '') + (g.err ? '<div class="gsr-m">' + esc(g.err) + '</div>' : '');
  }
  function geoSearchPaint() { const r = document.getElementById('gsrres'); if (!r) return; r.hidden = !ui.geo.open; r.innerHTML = geoSearchList(); }
  let gsrTimer = null, gsrSeq = 0;
  function geoSearch(q) {
    const g = ui.geo; g.q = q; clearTimeout(gsrTimer); const s = q.trim();
    if (!s) { g.found = []; g.open = false; g.busy = false; g.err = ''; geoSearchPaint(); return; }
    const out = [];
    const m = s.match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*[, ]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);
    if (m && Math.abs(+m[1]) <= 90 && Math.abs(+m[2]) <= 180) out.push({ kind: 'xy', name: (+m[1]).toFixed(5) + ', ' + (+m[2]).toFixed(5), sub: t('Coordinates'), lat: +m[1], lng: +m[2] });
    const lq = s.toLowerCase();
    db().sites.forEach(x => { if ((x.name + ' ' + (x.nameAr || '') + ' ' + (x.wilayat || '')).toLowerCase().includes(lq)) { const c = MM.siteCenter(x); out.push({ kind: 'site', name: MM.nm(x), sub: t('Locations & Geofences') + (x.wilayat ? ' · ' + x.wilayat : ''), lat: c.lat, lng: c.lng }); } });
    g.found = out; g.open = true; g.busy = !m && s.length >= 2;
    g.err = !m && s.length < 2 && !out.length ? t('Keep typing to search places…') : '';
    geoSearchPaint();
    if (!g.busy) return;
    const seq = ++gsrSeq;
    gsrTimer = setTimeout(async () => {
      // 1) Esri type-ahead suggestions (works from 2 letters, e.g. "so" → Sohar, Souq…)
      // 2) Esri World Geocoder full search   3) OpenStreetMap Nominatim as a last backup
      const lang = AR() ? 'ar' : 'en', places = [];
      try {
        const j = await geoJSON('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&maxSuggestions=8&countryCode=OMN&location=58.45,23.58&langCode=' + lang.toUpperCase() + '&text=' + encodeURIComponent(s));
        (j.suggestions || []).filter(x => !x.isCollection).forEach(x => { const parts = String(x.text || '').replace(/, OMN$/, ', ' + t('Oman')).split(', '); places.push({ kind: 'place', name: parts[0], sub: parts.slice(1).join(', ') || t('Oman'), magicKey: x.magicKey, text: x.text }); });
      } catch (e) { }
      if (!places.length) try {
        const j = await geoJSON('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&maxLocations=6&countryCode=OMN&outFields=PlaceName,Place_addr,City,Region&langCode=' + lang.toUpperCase() + '&location=58.45,23.58&singleLine=' + encodeURIComponent(s));
        (j.candidates || []).forEach(c => { const a = c.attributes || {}; const name = a.PlaceName || String(c.address || '').split(',')[0]; places.push({ kind: 'place', name, sub: a.Place_addr && a.Place_addr !== name ? a.Place_addr : [a.City, a.Region].filter(Boolean).join(', ') || c.address, lat: +c.location.y, lng: +c.location.x }); });
      } catch (e) { }
      if (!places.length) {
        try {
          const list = await geoJSON('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=om&accept-language=' + lang + '&q=' + encodeURIComponent(s));
          list.forEach(p => { const parts = String(p.display_name || '').split(', '); places.push({ kind: 'place', name: p.name || parts[0], sub: parts.slice(1, 4).join(', '), lat: +p.lat, lng: +p.lon }); });
        } catch (e) { }
      }
      if (seq !== gsrSeq) return;
      // drop near-duplicates (same name within ~100 m)
      places.forEach(p => { if (!out.some(o => o.name === p.name && (p.magicKey ? o.sub === p.sub : Math.abs(o.lat - p.lat) < .001 && Math.abs(o.lng - p.lng) < .001))) out.push(p); });
      g.found = out; g.busy = false;
      g.err = places.length ? '' : (navigator.onLine === false ? t('Map search needs an internet connection – saved sites and coordinates still work') : (out.length ? '' : t('No places found – try another name, or type coordinates like 23.6139, 58.5922')));
      geoSearchPaint();
    }, 350);
  }
  async function geoJSON(url) { const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 8000); try { const r = await fetch(url, { signal: ctl.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); } finally { clearTimeout(tm); } }
  async function geoSearchPick(i) {
    const g = ui.geo, r = (g.found || [])[i]; if (!r) return;
    // a type-ahead suggestion has no position yet – look it up once it is picked
    if (r.magicKey && r.lat == null) {
      g.busy = true; g.found = [r]; geoSearchPaint();
      try {
        const j = await geoJSON('https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&maxLocations=1&outFields=PlaceName&magicKey=' + encodeURIComponent(r.magicKey) + '&singleLine=' + encodeURIComponent(r.text));
        const c = (j.candidates || [])[0]; if (!c) throw new Error('none');
        r.lat = +c.location.y; r.lng = +c.location.x;
      } catch (e) { g.busy = false; g.err = t('Could not find that place on the map – try another result'); geoSearchPaint(); return; }
      g.busy = false;
    }
    const d = draft(), here = { lat: r.lat, lng: r.lng };
    if (d.shape === 'circle') d.center = here; else { const c = MM.centroid(d.polygon); d.polygon = d.polygon.map(p => ({ lat: p.lat + here.lat - c.lat, lng: p.lng + here.lng - c.lng })); }
    if (r.kind === 'place' && (!d.name || d.name === 'New site')) d.name = r.name;
    g.q = r.name; g.open = false; g.found = [];
    render();
    const M = Maps.geo; if (M && M.map) M.map.setView([here.lat, here.lng], 17);
    toast(t('Geofence moved to') + ' ' + r.name, t('Adjust the shape if needed, then press Save'), 'ok');
  }
  function geoEditor(layer) {
    const Lf = L2(), d = draft(), color = '#0E6B3E';
    const vx = () => dicon('<div class="mk-vx"></div>', 16);
    const mv = () => dicon('<div class="mk-mv" title="Drag to move the geofence"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20M12 2l-3 3M12 2l3 3M12 22l-3-3M12 22l3-3M2 12l3-3M2 12l3 3M22 12l-3-3M22 12l-3 3"/></svg></div>', 30);
    // Lets the user grab the shape body and drag it; onMove(dLat, dLng) receives the offset from where the drag started
    const bodyDrag = (shape, onStart, onMove) => {
      shape.on('mousedown', e => {
        const map = layer._map; if (!map) return; Lf.DomEvent.stop(e); map.dragging.disable(); ui.dragging = true; onStart();
        const s = e.latlng; const el = map.getContainer(); el.classList.add('geo-moving');
        const move = ev => onMove(ev.latlng.lat - s.lat, ev.latlng.lng - s.lng);
        const up = () => { map.off('mousemove', move); map.off('mouseup', up); document.removeEventListener('mouseup', up); map.dragging.enable(); el.classList.remove('geo-moving'); ui.dragging = false; render(); };
        map.on('mousemove', move); map.on('mouseup', up); document.addEventListener('mouseup', up);
      });
    };
    if (d.shape === 'polygon') {
      let c = MM.centroid(d.polygon);
      const bufPts = () => d.polygon.map(p => { const [x, y] = MM.toXY(p, c); const l = Math.hypot(x, y) || 1; const q = MM.fromXY(x + x / l * d.buffer * 1.3, y + y / l * d.buffer * 1.3, c); return [q.lat, q.lng]; });
      const buf = Lf.polygon(bufPts(), { color, weight: 1.6, dashArray: '6 6', fill: false, interactive: false }).addTo(layer);
      const poly = Lf.polygon(d.polygon.map(p => [p.lat, p.lng]), { color, weight: 3, fillOpacity: .25, className: 'geo-body' }).addTo(layer);
      // "+" handles in the middle of every side: drag (or click) one to add a new corner there
      const midOf = i => { const a = d.polygon[i], b = d.polygon[(i + 1) % d.polygon.length]; return [(a.lat + b.lat) / 2, (a.lng + b.lng) / 2]; };
      const syncMids = () => mids.forEach((m, i) => m.setLatLng(midOf(i)));
      const redraw = () => { c = MM.centroid(d.polygon); poly.setLatLngs(d.polygon.map(q => [q.lat, q.lng])); buf.setLatLngs(bufPts()); hub.setLatLng([c.lat, c.lng]); };
      const vxs = d.polygon.map((p, i) => {
        const mk = Lf.marker([p.lat, p.lng], { draggable: true, icon: vx(), title: t('Drag to move this corner · double-click to remove it') }).addTo(layer);
        mk.on('dragstart', () => { ui.dragging = true; }); mk.on('drag', e => { const ll = e.target.getLatLng(); d.polygon[i] = { lat: ll.lat, lng: ll.lng }; redraw(); syncMids(); }); mk.on('dragend', () => { ui.dragging = false; render(); });
        const del = e => { if (e && e.originalEvent) Lf.DomEvent.stop(e.originalEvent); if (d.polygon.length <= 3) { toast(t('A polygon needs at least 3 corners'), '', 'warn'); return; } d.polygon.splice(i, 1); render(); };
        mk.on('dblclick', del); mk.on('contextmenu', del);
        return mk;
      });
      const mids = d.polygon.map((p, i) => {
        const mk = Lf.marker(midOf(i), { draggable: true, icon: dicon('<div class="mk-mid" title="' + esc(t('Drag or click to add a corner here')) + '">+</div>', 18), zIndexOffset: 300 }).addTo(layer);
        let at = -1;
        mk.on('dragstart', () => { ui.dragging = true; const ll = mk.getLatLng(); at = i + 1; d.polygon.splice(at, 0, { lat: ll.lat, lng: ll.lng }); redraw(); });
        mk.on('drag', e => { const ll = e.target.getLatLng(); d.polygon[at] = { lat: ll.lat, lng: ll.lng }; redraw(); });
        mk.on('dragend', () => { ui.dragging = false; render(); });
        mk.on('click', () => { const ll = mk.getLatLng(); d.polygon.splice(i + 1, 0, { lat: ll.lat, lng: ll.lng }); render(); });
        return mk;
      });
      let base = null; const start = () => { base = d.polygon.map(p => ({ ...p })); };
      const shift = (dl, dg) => { d.polygon = base.map(p => ({ lat: p.lat + dl, lng: p.lng + dg })); c = MM.centroid(d.polygon); poly.setLatLngs(d.polygon.map(q => [q.lat, q.lng])); buf.setLatLngs(bufPts()); vxs.forEach((m, i) => m.setLatLng([d.polygon[i].lat, d.polygon[i].lng])); syncMids(); hub.setLatLng([c.lat, c.lng]); };
      const hub = Lf.marker([c.lat, c.lng], { draggable: true, icon: mv(), zIndexOffset: 500 }).addTo(layer);
      let h0 = null; hub.on('dragstart', () => { ui.dragging = true; start(); h0 = { ...c }; }); hub.on('drag', e => { const ll = e.target.getLatLng(); shift(ll.lat - h0.lat, ll.lng - h0.lng); }); hub.on('dragend', () => { ui.dragging = false; render(); });
      bodyDrag(poly, start, shift);
    } else {
      const ring = Lf.circle([d.center.lat, d.center.lng], { radius: d.radius + d.buffer, color, weight: 1.6, dashArray: '6 6', fill: false, interactive: false }).addTo(layer);
      const circ = Lf.circle([d.center.lat, d.center.lng], { radius: d.radius, color, weight: 3, fillOpacity: .25, className: 'geo-body' }).addTo(layer);
      const h = MM.fromXY(d.radius, 0, d.center);
      const mk = Lf.marker([h.lat, h.lng], { draggable: true, icon: vx(), zIndexOffset: 600 }).addTo(layer);
      mk.on('dragstart', () => { ui.dragging = true; }); mk.on('drag', e => { const ll = e.target.getLatLng(); d.radius = Math.max(20, Math.round(MM.haversine(d.center, { lat: ll.lat, lng: ll.lng }))); circ.setRadius(d.radius); ring.setRadius(d.radius + d.buffer); }); mk.on('dragend', () => { ui.dragging = false; render(); });
      let c0 = null; const start = () => { c0 = { ...d.center }; };
      const shift = (dl, dg) => { d.center = { lat: c0.lat + dl, lng: c0.lng + dg }; const ll = [d.center.lat, d.center.lng]; circ.setLatLng(ll); ring.setLatLng(ll); hub.setLatLng(ll); const q = MM.fromXY(d.radius, 0, d.center); mk.setLatLng([q.lat, q.lng]); };
      const hub = Lf.marker([d.center.lat, d.center.lng], { draggable: true, icon: mv(), zIndexOffset: 500 }).addTo(layer);
      hub.on('dragstart', () => { ui.dragging = true; start(); }); hub.on('drag', e => { const ll = e.target.getLatLng(); shift(ll.lat - c0.lat, ll.lng - c0.lng); }); hub.on('dragend', () => { ui.dragging = false; render(); });
      bodyDrag(circ, start, shift);
    }
    Object.entries(db().crew).forEach(([id, c]) => { if (MM.haversine(c, MM.siteCenter(d)) < 600) drawItems(layer, [{ k: 'crew', id, lat: c.lat, lng: c.lng, status: c.status }]); });
  }

  /* ---------------- APPROVALS ---------------- */
  const REQ_NAME = { missed: 'Missed punch', leave: 'Annual leave', short: 'Short permission', remote: 'Remote work', overtime: 'Overtime', shift: 'Shift change' };
  function reqDetails(r) {
    if (r.type === 'missed') return t(r.punchType === 'IN' ? 'Check In' : 'Check Out') + ' ' + MM.fmtDateShort(r.date) + ', ' + r.time + ' · ' + esc(r.reason.length > 44 ? r.reason.slice(0, 42) + '…' : r.reason);
    if (r.type === 'leave') return esc(r.from.replace(/ \d{4}$/, '')) + ' – ' + esc(r.to.replace(/ \d{4}$/, '')) + ' · ' + r.days + ' days · balance ' + (r.balance || 18) + ' days (Oracle HRMS)';
    if (r.type === 'short') return MM.fmtDateShort(r.date) + ' · ' + r.from + '–' + r.to + ' (' + r.hours + ' h)';
    if (r.type === 'remote') return MM.fmtDateShort(r.date) + ' · ' + esc(r.reason);
    if (r.type === 'overtime') return esc(r.detail.split(' · ')[0]) + ' · ' + MM.fmtDateShort(r.date) + ' · above auto-approve limit';
    if (r.type === 'shift') return MM.fmtDateShort(r.date) + ' · ' + esc(r.detail) + ' · ' + esc(r.reason);
    return '';
  }
  function reqEvidence(r) {
    if (r.type === 'missed') { const [h, m] = r.time.split(':').map(Number); return '<span class="ok-text" style="font-weight:600">Last GPS ' + MM.pad(h) + ':' + MM.pad(Math.max(0, m - 4)) + ' inside fence</span>'; }
    if (r.type === 'overtime') return '<span class="ok-text" style="font-weight:600">Punches inside fence</span>';
    if (r.type === 'remote') { const a = db().audit.find(x => x.empId === r.empId && x.code === 'GEO_OUTSIDE' && x.time >= MM.dayStart()); return a ? '<span class="warn-text" style="font-weight:600">Linked to blocked check-in ' + a.ref + '</span>' : '<span class="muted">—</span>'; }
    if (r.type === 'leave') return '<span class="muted">' + esc(r.evidence || 'Covered: roster updated') + '</span>';
    if (r.type === 'shift') return '<span class="muted">Cover available in team</span>';
    return '<span class="muted">' + (r.file ? esc(r.file) : '—') + '</span>';
  }
  function requestTable(reqs, withHistory) {
    const rows = reqs.filter(r => withHistory || r.status === 'pending').sort((a, b) => (a.status === 'pending' ? 0 : 1) - (b.status === 'pending' ? 0 : 1) || b.created - a.created);
    return '<div class="tablewrap"><table class="tbl"><thead><tr><th>' + t('Employee') + '</th><th>' + t('Request') + '</th><th>' + t('Details') + '</th><th>' + t('Evidence') + '</th><th>' + t('Decision') + '</th></tr></thead><tbody>' +
      rows.map(r => '<tr class="' + (ui.flash[r.id] ? 'new' : '') + '"><td><button class="plink" data-act="reqview" data-arg="' + r.id + '" title="View request details">' + person(emp(r.empId) || { name: 'Employee ' + r.empId, nameAr: r.empId, role: '' }) + '</button></td><td>' + t(r.type === 'leave' ? (r.leaveType || 'Annual leave') : REQ_NAME[r.type]) + (r.stage === 'hr' ? '<br><small class="muted">Supervisor ✓ → HR</small>' : '') + '</td><td>' + reqDetails(r) + '</td><td>' + reqEvidence(r) + '</td><td style="white-space:nowrap">' +
        (r.status === 'pending' ? '<button class="btn primary sm" data-act="approve" data-arg="' + r.id + '">' + t('Approve') + '</button> <button class="btn sm" data-act="reject" data-arg="' + r.id + '">' + t('Reject') + '</button>' : pill(r.status === 'approved' ? 'p-green' : 'p-red', t(r.status === 'approved' ? 'Approved' : 'Rejected')) + '<br><small class="muted">' + esc(r.decidedBy || '') + '</small>') + '</td></tr>').join('') +
      (rows.length ? '' : '<tr><td colspan="5" class="muted" style="text-align:center;padding:24px">Nothing waiting – all clear</td></tr>') + '</tbody></table></div>';
  }
  /* ---- daily time entries waiting for supervisor approval (same records the employee sees on the phone) ---- */
  let teCache = { d: null, v: null };
  function timeEntryList() {
    const D = db(); if (teCache.d === D) return teCache.v;
    const ts = D.tsApprovals || {}, byKey = {};
    D.punches.forEach(p => { const k = p.empId + '|' + MM.ymd(p.time); if (ts[k]) (byKey[k] = byKey[k] || []).push(p); });
    const v = Object.entries(ts).map(([key, a]) => {
      const [eid, ymd] = key.split('|'); const e = emp(eid); if (!e) return null;
      const day = new Date(+ymd.slice(0, 4), +ymd.slice(4, 6) - 1, +ymd.slice(6, 8)).getTime();
      const ps = (byKey[key] || []).sort((x, y) => x.time - y.time);
      let i = ps.find(p => p.type === 'IN'), o = ps.filter(p => p.type === 'OUT').pop();
      if (!i) { const rec = (attRecordsFor(day) || []).find(r => r.e.id === eid); if (rec) { i = rec.i; o = rec.o; } }
      if (o && i && o.time < i.time) o = null;
      const corrected = ps.some(p => p.status === 'corrected');
      const fix = D.requests.find(q => q.empId === eid && q.type === 'missed' && q.status === 'pending' && MM.dayStart(q.date) === day);
      const st = a.status === 'returned' && (corrected || fix) ? 'pending' : a.status;
      return { key, e, day, a, st, i, o, corrected, fix, hours: i && o ? o.time - i.time : 0, photo: tePhoto(key, e, i) };
    }).filter(Boolean);
    // today's check-ins made with the phone (photo attached) show up straight away; approvable after check-out
    const today = MM.dayStart();
    D.punches.forEach(p => {
      if (p.type !== 'IN' || !p.photo || p.time < today) return;
      const key = p.empId + '|' + MM.ymd(p.time); if (ts[key] || v.some(x => x.key === key)) return;
      const e = emp(p.empId); if (!e) return;
      v.push({ key, e, day: today, a: { status: 'open' }, st: 'open', i: p, o: null, corrected: false, fix: null, hours: 0, photo: tePhoto(key, e, p) });
    });
    v.sort((x, y) => y.day - x.day || x.e.name.localeCompare(y.e.name));
    teCache = { d: D, v }; return v;
  }
  const tePending = () => timeEntryList().filter(x => x.st === 'pending');
  // photo taken at check-in (phone) – sample team history gets a deterministic sample photo near the site
  function tePhoto(key, e, i) {
    if (!i) return null;
    if (i.photo) return { src: i.photo.src || MM.samplePhotoSVG(i.photo.sample || 1), lat: +i.photo.lat, lng: +i.photo.lng, acc: i.photo.acc || i.acc || 7, time: i.photo.time || i.time, dist: i.dist, live: !!i.photo.src };
    const h = hsh(key), c = MM.siteCenter(MM.siteById(e.siteId));
    return { src: MM.samplePhotoSVG(1 + h % 3), lat: c.lat + (h % 40 - 20) * 1e-5, lng: c.lng + ((h >>> 6) % 40 - 20) * 1e-5, acc: 4 + h % 9, time: i.time, dist: 8 + h % 45 };
  }
  function tsNotify(d, x, kind, note) {
    const dt = MM.fmtDate(x.day), by = user().name;
    d.notifications.push({ id: MM.uid('N'), to: x.e.id, from: 'manager', byName: by, kind, time: MM.now(), link: 'pending',
      title: kind === 'approved' ? 'Time entry approved' : 'Time entry returned', titleAr: kind === 'approved' ? 'تمت الموافقة على سجل الوقت' : 'تمت إعادة سجل الوقت',
      text: 'Your time entry for ' + dt + (kind === 'approved' ? ' was approved by ' + by + '.' : ' was returned by ' + by + ': ' + note), textAr: kind === 'approved' ? 'تمت الموافقة على سجل وقتك ليوم ' + dt + '.' : 'أُعيد سجل وقتك ليوم ' + dt + ': ' + note });
    d.notifications = d.notifications.slice(-80);
  }
  function approveTs(keys) {
    const list = timeEntryList().filter(x => keys.includes(x.key));
    MM.tx(d => list.forEach(x => { const a = d.tsApprovals[x.key]; if (!a) return; Object.assign(a, { status: 'approved', by: user().name, at: MM.now(), note: '' }); tsNotify(d, x, 'approved'); decide('Approved time entry · ' + x.e.name + ' · ' + MM.fmtDate(x.day), x.corrected ? 'Corrected punch verified' : 'Punches inside geofence')(d); }));
    list.forEach(x => ui.flash[x.key] = 1);
    toast(t('Approved'), list.length === 1 ? list[0].e.name + ' · ' + MM.fmtDate(list[0].day) + ' · employee notified' : list.length + ' time entries · employees notified', 'ok');
  }
  function teTable() {
    const f = ui.ap.tf, all = timeEntryList(), wk = MM.dayStart() - 7 * 864e5;
    const n = s => all.filter(x => (x.st === s || s === 'pending' && x.st === 'open') && (s !== 'approved' || x.day >= wk)).length;
    const rows = all.filter(x => (x.st === f || f === 'pending' && x.st === 'open') && (f !== 'approved' || x.day >= wk));
    const ready = rows.filter(x => f === 'pending' && x.o && !x.fix);
    const flags = x => [x.i && x.i.late ? pill('p-amber', 'Late ' + x.i.late + ' min') : '', x.corrected ? pill('p-blue', 'Corrected') : '', !x.o && x.st !== 'open' ? pill('p-red', 'Missing check-out') : '', x.fix ? '<small class="muted">Correction <span class="keep-ltr">' + x.fix.id + '</span> pending</small>' : '', x.i && !x.i.late && !x.corrected && x.photo ? '<span class="tag in">' + I('pin', 13) + t('Inside') + ' · ' + x.photo.dist + ' m</span>' : ''].filter(Boolean).join(' ');
    return '<div class="bar" style="margin-bottom:10px"><div class="chipsel">' + [['pending', 'Pending'], ['returned', 'Returned'], ['approved', 'Approved · last 7 days']].map(([k, l]) => '<button class="' + (f === k ? 'on' : '') + '" data-act="tefilter" data-arg="' + k + '">' + t(l) + ' (' + n(k) + ')</button>').join('') + '</div><span style="flex:1"></span>' +
      (ready.length ? '<button class="btn primary" data-act="teall">' + I('check', 16) + t('Approve all ready') + ' (' + ready.length + ')</button>' : '') + '</div>' +
      '<div class="tablewrap"><table class="tbl compact"><thead><tr><th>' + t('Employee') + '</th><th>' + t('Photo') + '</th><th>' + t('Date') + '</th><th>' + t('Check In') + '</th><th>' + t('Check Out') + '</th><th>' + t('Hours') + '</th><th>' + t('Checks') + '</th><th>' + t('Decision') + '</th></tr></thead><tbody>' +
      rows.map(x => '<tr class="' + (ui.flash[x.key] ? 'new' : '') + '"><td>' + person(x.e) + '</td><td>' + (x.photo ? '<button class="tethumb" data-act="teview" data-arg="' + x.key + '" title="' + t('Verify check-in photo') + '" style="background-image:url(\'' + x.photo.src + '\')">' + (x.photo.live ? '<i>' + t('Live') + '</i>' : '') + '</button>' : '<span class="muted">—</span>') + '</td><td style="white-space:nowrap">' + MM.fmtDay(x.day).slice(0, AR() ? 10 : 3) + ', ' + MM.fmtDateShort(x.day) + '</td><td>' + (x.i ? ampm(x.i.time) : '—') + '</td><td>' + (x.o ? ampm(x.o.time) : '<span class="bad-text">—</span>') + '</td><td style="white-space:nowrap">' + (x.hours ? Math.floor(x.hours / 3600e3) + 'h ' + Math.round(x.hours % 3600e3 / 60000) + 'm' : '—') + '</td><td>' + flags(x) + '</td><td style="white-space:nowrap">' +
        (x.st === 'open' ? pill('p-blue', t('In progress')) + '<br><small class="muted">Checked in · approve after check-out</small>' : x.st === 'pending' ? '<button class="btn primary sm" data-act="teapprove" data-arg="' + x.key + '"' + (x.o && !x.fix ? '' : ' disabled title="Waiting for the missed-punch correction"') + '>' + t('Approve') + '</button> <button class="btn sm" data-act="tereturn" data-arg="' + x.key + '">' + t('Return') + '</button>'
          : x.st === 'returned' ? pill('p-red', t('Returned')) + '<br><small class="muted" style="white-space:normal;display:block;max-width:220px">' + esc(x.a.note || '') + '</small>'
            : pill('p-green', t('Approved')) + '<br><small class="muted">' + esc(x.a.by || '') + (x.a.at ? ' · ' + MM.fmtDateShort(x.a.at) : '') + '</small>') + '</td></tr>').join('') +
      (rows.length ? '' : '<tr><td colspan="8" class="muted" style="text-align:center;padding:24px">' + (f === 'pending' ? 'No time entries waiting – all clear' : 'Nothing here') + '</td></tr>') + '</tbody></table></div>' +
      '<p class="muted2" style="margin:10px 0 0">Employees see each decision on their phone under <b>Pending approval</b>. Approved days are sent to Oracle Payroll when the month is locked.</p>';
  }
  function pApprovals() {
    const k = ui.ap; const reqs = db().requests.filter(r => r.status === 'pending'); const tasks = db().tasks.filter(x => x.status === 'done');
    const teN = tePending().length;
    const fl = k.filter; const audit = db().audit.filter(a => fl === 'all' || (fl === 'blocked' ? ['blocked', 'rejected', 'retry'].includes(a.decision) : a.decision === 'accepted')).sort((a, b) => b.time - a.time);
    const dec = a => a.decision === 'blocked' ? pill('p-red', t('Blocked')) : a.decision === 'retry' ? pill('p-amber', 'Rejected · ' + esc(a.note || '')) : a.decision === 'rejected' ? pill('p-amber', t('Rejected')) : a.code === 'TIME_SKEW' ? pill('p-green', 'Accepted · server time used') : pill('p-green', t('Accepted'));
    let main;
    if (k.tab === 'pending') main = (tasks.length ? '<div class="ch"><h3 style="color:var(--ink)">' + t('Task sign-off') + ' <span class="cnt-pill">' + tasks.length + '</span></h3></div><div class="tablewrap"><table class="tbl"><thead><tr><th>' + t('Employee') + '</th><th>Task</th><th>' + t('Evidence') + '</th><th>' + t('Decision') + '</th></tr></thead><tbody>' + tasks.map(x => { const mins = x.arrivedAt && x.completedAt ? Math.round((x.completedAt - x.arrivedAt) / 60000) : 0; return '<tr class="' + (ui.flash[x.id] ? 'new' : '') + '"><td><button class="plink" data-act="opentask" data-arg="' + x.id + '" title="View task details">' + person(emp(x.assignee)) + '</button></td><td>' + x.id + ' · ' + esc(L(x.title, x.titleAr)) + ', ' + esc(x.wilayat) + '</td><td><button class="link" data-act="opentask" data-arg="' + x.id + '">' + x.photos.length + ' photos · on site ' + mins + ' min</button></td><td style="white-space:nowrap"><button class="btn primary sm" data-act="signoff" data-arg="' + x.id + '">' + t('Approve') + '</button> <button class="btn sm" data-act="returntask" data-arg="' + x.id + '">' + t('Return') + '</button></td></tr>'; }).join('') + '</tbody></table></div>' : '') + '<div class="ch" style="margin-top:' + (tasks.length ? 24 : 0) + 'px"><h3 style="color:var(--ink)">' + t('Requests') + ' <span class="cnt-pill">' + reqs.length + '</span></h3></div>' + requestTable(reqs, false);
    else if (k.tab === 'time') main = teTable();
    else if (k.tab === 'audit') main = '<div class="bar"><div class="chipsel">' + ['all', 'blocked', 'accepted'].map(f => '<button class="' + (fl === f ? 'on' : '') + '" data-act="afilter" data-arg="' + f + '">' + t(f === 'all' ? 'All' : f === 'blocked' ? 'Blocked' : 'Accepted') + '</button>').join('') + '</div><span style="flex:1"></span><button class="btn" data-act="auditcsv">' + I('download', 16) + t('Export to CSV') + '</button></div><div class="tablewrap"><table class="tbl"><thead><tr><th>' + t('Time') + '</th><th>' + t('Employee') + '</th><th>' + t('What happened') + '</th><th>' + t('Reason code') + '</th><th>' + t('Server decision') + '</th></tr></thead><tbody>' +
      audit.slice(0, 40).map(a => '<tr class="' + (ui.flash[a.id] ? 'new' : '') + '"><td>' + MM.fmtTime(a.time) + '</td><td>' + esc(emp(a.empId) ? nameOf(emp(a.empId)) : 'Employee ' + a.empId) + '</td><td>' + esc(L(a.what, a.whatAr)) + (a.ref ? '<br><small class="muted keep-ltr">' + a.ref + (a.offline ? ' · offline, re-checked on sync' : '') + '</small>' : '') + '</td><td class="mono keep-ltr">' + a.code + '</td><td>' + dec(a) + '</td></tr>').join('') + '</tbody></table></div>';
    else main = db().decisions.length ? '<div class="tablewrap"><table class="tbl"><thead><tr><th>' + t('Time') + '</th><th>By</th><th>' + t('Decision') + '</th><th>Why</th></tr></thead><tbody>' + db().decisions.slice(0, 30).map(d => '<tr><td>' + MM.fmtTime(d.time) + '</td><td>' + esc(d.by) + '</td><td>' + esc(d.what) + '</td><td class="muted">' + esc(d.why || '—') + '</td></tr>').join('') + '</tbody></table></div>' : '<p class="muted">—</p>';
    return hero({ crumbs: [['Home', 'dashboard'], ['Approvals']], title: t('Approvals'), sub: (reqs.length + tasks.length + teN) + ' items waiting · every decision is recorded with who, when and why', quote: 'Fair decisions, fully traceable.', art: 'mosque' }) +
      '<div class="grid g4" style="margin-bottom:14px">' + kpi({ icon: 'fileplus', label: 'Pending requests', tone: 'blue', value: reqs.length, note: ['leave', 'missed', 'overtime', 'remote', 'shift'].map(ty => reqs.filter(r => r.type === ty).length + ' ' + ({ leave: 'leave', missed: 'missed punch', overtime: 'overtime', remote: 'remote', shift: 'shift' })[ty]).filter(s => s[0] !== '0').join(' · ') }) + kpi({ icon: 'check', label: t('Field Task Completions'), value: tasks.length, note: 'tasks done, waiting for sign-off' }) + kpi({ icon: 'shield', label: 'Fraud flags today', tone: 'red', value: fraudToday().length, note: 'attempts blocked by the server' }) + kpi({ icon: 'clipboard', label: 'Decisions today', tone: 'purple', value: db().decisions.filter(d => d.time >= MM.dayStart()).length, note: 'approvals, rejections and changes logged' }) + '</div>' +
      '<div class="btabs">' + [['pending', 'Waiting for approval', reqs.length + tasks.length], ['time', 'Time entries', teN], ['audit', 'Anti-fraud audit log', fraudToday().length], ['history', 'Decision history', db().decisions.length]].map(([kk, l, n]) => '<button class="' + (k.tab === kk ? 'on' : '') + '" data-act="aptab" data-arg="' + kk + '">' + t(l) + ' <span class="n">' + n + '</span></button>').join('') + '</div><div class="card pad" style="border-top-left-radius:0">' + main + '</div>';
  }
  function decide(what, why) { return d => { d.decisions.unshift({ id: MM.uid('D'), time: MM.now(), by: user().name + ' (' + user().role + ')', what, why }); }; }
  function approveReq(id) {
    let nm = '';
    MM.tx(d => {
      const r = d.requests.find(x => x.id === id); if (!r || r.status !== 'pending') return;
      r.status = 'approved'; r.decidedBy = user().name; r.decidedAt = MM.now();
      const e = d.employees.find(x => x.id === r.empId);
      if (r.type === 'missed') { const [h, m] = r.time.split(':').map(Number); const tm = new Date(r.date); tm.setHours(h, m, 0, 0); d.punches.push({ id: MM.uid('P'), empId: r.empId, type: r.punchType, time: tm.getTime(), siteId: e.siteId, status: 'corrected', ref: r.id }); }
      if (r.type === 'leave') { const a = new Date(r.from).getTime(), b = new Date(r.to).getTime(); for (let day = a; day <= b && !isNaN(a); day += 864e5) { const ws = MM.weekStart(day), k = MM.weekKey(ws); if (!d.roster[k]) d.roster[k] = { rows: MM.rosterFor(d, ws).rows, published: false }; if (d.roster[k].rows[r.empId]) d.roster[k].rows[r.empId][new Date(day).getDay()] = 'L'; } }
      MM.notify(d, r.empId, 'Your ' + (REQ_NAME[r.type] || r.type).toLowerCase() + ' request was approved by ' + user().name, 'تمت الموافقة على طلبك (' + MM.t(REQ_NAME[r.type]) + ')', 'approved');
      decide('Approved ' + (REQ_NAME[r.type] || r.type) + ' · ' + e.name + ' · ' + r.id, r.type === 'missed' ? 'Evidence: last GPS inside fence' : '')(d);
      MM.addActivity(d, { title: 'Request approved', sub: (REQ_NAME[r.type] || r.type) + ' · ' + e.name, kind: 'approval' });
      nm = e.name;
    });
    toast(t('Approved'), nm + ' · employee notified on phone', 'ok');
  }

  /* ---------------- REPORTS ---------------- */
  const REPORTS = [['daily', 'Daily check-ins', 'Every punch today with site, GPS accuracy and server decision', 'clock'], ['monthly', 'Monthly attendance summary', 'Days present, late, early-out and overtime per employee', 'calendar'], ['overtime', 'Overtime totals', 'Overtime hours by employee, auto-approved vs approved', 'chart'], ['leave', 'Leave and absence', 'Leave, permissions and remote work requests with status', 'file'], ['fraud', 'Geofence and fraud events', 'All rejected attempts with reason codes (audit)', 'shield'], ['tasks', 'Task completion', 'Field tasks, time on site, evidence count and sign-off', 'clipboard'], ['employees', 'Employee directory', 'All employees with department, site and device status', 'users']];
  function reportRows(k) {
    const D = db(); const nm = id => (emp(id) || { name: id }).name;
    if (k === 'daily') { const rows = [['Time', 'Employee ID', 'Employee', 'Type', 'Site', 'GPS accuracy (m)', 'Decision']]; D.punches.filter(p => p.time >= MM.dayStart()).sort((a, b) => b.time - a.time).forEach(p => rows.push([MM.fmtTime(p.time), p.empId, nm(p.empId), p.type, (MM.siteById(p.siteId) || {}).name, p.acc || '', p.status + (p.geo === 'outside' ? ' (outside geofence)' : '')])); D.audit.filter(a => a.time >= MM.dayStart()).forEach(a => rows.push([MM.fmtTime(a.time), a.empId, nm(a.empId), 'ATTEMPT', '', '', a.decision + ' · ' + a.code])); return rows; }
    if (k === 'monthly') return [['Employee ID', 'Employee', 'Department', 'Days present', 'Late', 'Early-out', 'Overtime (h)']].concat(D.employees.map((e, i) => [e.code, e.name, e.dept, 18 - (i % 3), i % 4, i % 2, (i * 1.7 % 6).toFixed(1)]));
    if (k === 'overtime') return [['Employee', 'Department', 'Auto-approved (h)', 'Approved (h)', 'Pending (h)']].concat(D.employees.map((e, i) => [e.name, e.dept, (i % 3) * 0.5 + 1, (i * 0.7 % 4).toFixed(1), e.id === '102877' ? '1.7' : '0']));
    if (k === 'leave') return [['Request', 'Employee', 'Type', 'Details', 'Status', 'Decided by']].concat(D.requests.map(r => [r.id, nm(r.empId), REQ_NAME[r.type], reqDetails(r).replace(/<[^>]+>/g, ''), r.status, r.decidedBy || '']));
    if (k === 'fraud') return [['Time', 'Employee', 'What happened', 'Reason code', 'Decision', 'Reference']].concat(D.audit.map(a => [MM.fmtDate(a.time) + ' ' + MM.fmtTime(a.time), nm(a.empId), a.what, a.code, a.decision, a.ref || '']));
    if (k === 'tasks') return [['Task', 'Title', 'Type', 'Location', 'Assignee', 'Status', 'Progress %', 'Photos', 'Signed off by']].concat(D.tasks.map(x => [x.id, x.title, x.type, x.loc, nm(x.assignee), TS[x.status][0], progress(x), x.photos.length, x.signedBy || '']));
    if (k === 'employees') return [['Employee ID', 'Name', 'Department', 'Role', 'Site', 'Status', 'Registered device', 'AD']].concat(D.employees.map(e => [e.code, e.name, e.dept, e.role, (MM.siteById(e.siteId) || {}).name, e.status, e.device || '', e.adStatus]));
    if (k === 'roster') { const ws = weekStartMs(); const r = MM.rosterFor(D, ws); return [['Employee'].concat([0, 1, 2, 3, 4, 5, 6].map(i => MM.fmtDateShort(ws + i * 864e5)))].concat(Object.keys(r.rows).map(id => [nm(id)].concat(r.rows[id].map(c => c ? D.shifts[c].name : '—')))); }
    return [['-']];
  }
  function exportReport(k, fmt) {
    const rep = REPORTS.find(r => r[0] === k) || [k, k === 'roster' ? 'Weekly roster' : k === 'dash' ? 'Executive dashboard' : 'Report'];
    const rows = k === 'dash' ? [['Metric', 'Value']].concat(Object.entries(liveCounts())) : reportRows(k);
    const name = 'MM-' + rep[1].replace(/\W+/g, '-') + '-' + MM.ymd(MM.now());
    if (fmt === 'csv') MM.download(name + '.csv', MM.toCSV(rows), 'text/csv;charset=utf-8');
    else if (fmt === 'xls') MM.download(name + '.xls', MM.toXLS(rep[1], rows), 'application/vnd.ms-excel');
    else MM.printPDF(rep[1], 'Muscat Municipality · ' + MM.fmtDate(MM.now()) + ' · generated by ' + user().name, rows);
  }
  function pReports() {
    const c = liveCounts(), wk = weekSeries();
    return hero({ crumbs: [['Home', 'dashboard'], ['Reports & Analytics']], title: t('Reports & Analytics'), sub: '20+ standard reports · export to Excel, PDF and CSV · scheduled email delivery', quote: 'Data that drives better decisions.', art: 'mosque' }) +
      '<div class="grid g2" style="margin-bottom:16px"><div class="card pad"><div class="ch"><h3>' + I('chart', 20) + t('Attendance Overview') + '</h3><div class="r"><button class="btn sm" data-act="rexp" data-arg="dash:xls">' + I('download', 14) + 'Excel</button></div></div><div class="chart">' + MMC.line(weekLabels(), [{ name: t('Present'), vals: wk.map(w => w.present), color: '#0E6B3E', area: 1 }, { name: t('Expected'), vals: wk.map(w => w.rostered), color: '#B8C2BD', dashed: 1 }], { max: Math.ceil(c.active / 50) * 50 }) + '</div></div>' +
      '<div class="card pad"><div class="ch"><h3>' + I('chart', 20) + t('Attendance Summary') + '</h3></div><div class="chart">' + MMC.stack(weekLabels(), wk.map(w => [w.present - w.late, w.absent, w.late]), ['#0E6B3E', '#D9E0DC', '#E89B22']) + '</div><div class="flexr" style="justify-content:space-around;margin-top:8px;flex-wrap:wrap"><span>' + t('Present Today') + ' <b>' + MM.fmtNum(c.present) + '</b></span><span>' + t('Late Arrivals') + ' <b>' + c.late + '</b></span><span>' + t('Absent Today') + ' <b>' + c.absent + '</b></span></div></div></div>' +
      '<div class="card pad">' + REPORTS.map(([k, l, dsc, ic]) => '<div class="li" style="flex-wrap:wrap"><span class="ii">' + I(ic, 19) + '</span><div class="lt" style="min-width:220px"><b>' + l + '</b><small>' + dsc + '</small></div><div class="flexr"><button class="btn sm" data-act="rexp" data-arg="' + k + ':xls">' + I('download', 14) + 'Excel</button><button class="btn sm" data-act="rexp" data-arg="' + k + ':pdf">' + I('download', 14) + 'PDF</button><button class="btn sm" data-act="rexp" data-arg="' + k + ':csv">' + I('download', 14) + 'CSV</button><label class="switch" title="Schedule email"><input type="checkbox" data-sched="' + k + '"' + ((db().settings.sched || {})[k] ? ' checked' : '') + '><i></i></label><small class="muted">Email weekly</small></div></div>').join('') + '</div>';
  }

  /* ---------------- ADMINISTRATION ---------------- */
  function pAdmin() {
    const k = ui.adm; let main = '';
    if (k.tab === 'integrations') main = '<div class="grid g3">' + db().integrations.map(x => '<div class="card pad"><div class="flexr" style="justify-content:space-between"><b style="font-size:15.5px">' + esc(x.name) + '</b>' + (x.status === 'ok' ? pill('p-green', 'Connected') : pill('p-amber', esc(x.msg))) + '</div><div class="muted2" style="margin:4px 0 8px">' + esc(x.detail) + '</div><div style="font-size:13.5px">Last run: <b>' + MM.relDay(x.last) + ' ' + MM.fmtTime(x.last) + '</b> · ' + esc(x.msg) + '</div><button class="btn sm" style="margin-top:10px" data-act="runint" data-arg="' + x.key + '">' + (ui.running === x.key ? '<span class="spin dark"></span>' : I('refresh', 14)) + t('Run now') + '</button></div>').join('') + '</div>' +
      '<div class="card pad" style="margin-top:14px"><div class="ch"><h3>' + I('link', 19) + 'Open APIs for future systems</h3></div><div class="mono" style="line-height:2;font-size:13.5px">GET  /api/v1/attendance/{empId}?from=&to=<br>GET  /api/v1/punches/live?site=<br>POST /api/v1/tasks · OAuth2 client-credentials<br>GET  /api/v1/geofences/{siteId}<br>GET  /api/v1/reports/{id}.{xlsx|pdf|csv}</div></div>';
    else if (k.tab === 'users') {
      const roles = [['Employee', '✓', '—', '—', '—', '—'], ['Supervisor', '✓', '✓', '✓ (team)', '—', '—'], ['HR Admin', '✓', '✓', '✓', '✓', '—'], ['Operations Director', '—', '✓', '✓', '✓', '—'], ['System Admin', '—', '—', '—', '✓', '✓']];
      main = '<div class="tablewrap"><table class="tbl"><thead><tr><th>Role</th><th>Punch & requests</th><th>Approve</th><th>Dispatch & reports</th><th>Shifts, locks & geofences</th><th>System config</th></tr></thead><tbody>' + roles.map(r => '<tr>' + r.map((c, i) => '<td' + (i ? '' : ' style="font-weight:600"') + '>' + c + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' +
        '<div class="ch" style="margin-top:20px"><h3 style="color:var(--ink)">Device binding & AD status</h3><div class="r"><div class="inp-ic" style="width:280px">' + I('search', 16) + '<input class="inp" data-f="adm.q" value="' + esc(k.q || '') + '" placeholder="Search name or employee ID..."></div></div></div><div class="tablewrap"><table class="tbl"><thead><tr><th>' + t('Employee') + '</th><th>' + t('Employee ID') + '</th><th>' + t('Registered Device') + '</th><th>' + t('AD Account') + '</th><th>' + t('Actions') + '</th></tr></thead><tbody>' +
        admList().slice((admPg() - 1) * 10, admPg() * 10).map(e => '<tr><td>' + person(e) + '</td><td class="muted">' + e.code + '</td><td>' + (e.device ? '<span class="mono">' + esc(e.device) + '</span>' : pill('p-amber', 'Not registered')) + '</td><td>' + (e.adStatus === 'blocked' ? pill('p-red', 'Disabled') : pill('p-green', t('Active'))) + '</td><td style="white-space:nowrap"><button class="btn sm" data-act="resetdev" data-arg="' + e.id + '"' + (e.device ? '' : ' disabled') + '>' + t('Reset device') + '</button> <button class="btn sm" data-act="adtoggle" data-arg="' + e.id + '">' + t(e.adStatus === 'blocked' ? 'Unblock' : 'Block (leaver)') + '</button></td></tr>').join('') + '</tbody></table></div>' + pager(admList().length, admPg(), 10, 'adm', t('employees'));
    } else main = '<p class="muted" style="margin-top:0">Switch a tile on and it appears on every phone – no app update.</p>' + db().tiles.map(x => '<div class="li"><span class="ii">' + I(x.icon, 19) + '</span><div class="lt"><b>' + esc(L(x.label, x.ar)) + '</b><small>Server-driven home screen tile</small></div><label class="switch"><input type="checkbox" data-tile="' + x.key + '"' + (x.on ? ' checked' : '') + '><i></i></label></div>').join('');
    return hero({ crumbs: [['Home', 'dashboard'], ['Administration']], title: t('Administration'), sub: 'Users, roles, devices and server-driven mobile services', quote: 'One platform, plugged into MM systems.', art: 'fort' }) +
      '<div class="btabs">' + [['users', 'Users & Roles'], ['tiles', 'Mobile App Services']].map(([kk, l]) => '<button class="' + (k.tab === kk ? 'on' : '') + '" data-act="admtab" data-arg="' + kk + '">' + t(l) + '</button>').join('') + '</div><div class="card pad" style="border-top-left-radius:0">' + main + '</div>';
  }
  function runIntegration(key) {
    ui.running = key; render();
    setTimeout(() => {
      MM.tx(d => { const x = d.integrations.find(i => i.key === key); x.last = MM.now(); x.status = 'ok'; const n = 3 + Math.floor(Math.random() * 25); x.msg = { hrms: n + ' changes', payroll: 'Sent', ad: 'Live · 3 leavers blocked', arcgis: d.sites.length + ' sites', sms: 'Test OTP delivered', smtp: (86 + n) + ' emails today', push: MM.fmtNum(1964 + n) + ' delivered' }[key]; d.syncLog.unshift({ id: MM.uid('SL'), time: MM.now(), device: 'server', empId: '', type: x.name + (key === 'hrms' ? ' delta' : ' run'), rows: key === 'hrms' ? n : key === 'arcgis' ? d.sites.length : 1, result: 'ok' }); decide('Ran integration · ' + x.name, 'Manual run from portal')(d); });
      ui.running = null; render(); toast(t('Run now'), (db().integrations.find(i => i.key === key) || {}).name + ' ✓', 'ok');
    }, 1200);
  }

  /* ---------------- modals ---------------- */
  function modal() {
    const m = ui.modal; if (!m) return '';
    const wrap = (title, body, foot, wide) => '<div class="scrim" data-act="closebg"><div class="modal" style="' + (wide ? 'width:min(820px,100%)' : '') + '"><div class="modal-h"><h3>' + title + '</h3><button class="btn ghost sm" data-act="close">' + I('x', 20) + '</button></div><div class="modal-b">' + body + '</div>' + (foot ? '<div class="modal-f">' + foot + '</div>' : '') + '</div></div>';
    if (m.type === 'reqview') {
      const r = db().requests.find(x => x.id === m.id); if (!r) { ui.modal = null; return ''; }
      const e = emp(r.empId) || { name: 'Employee ' + r.empId, nameAr: r.empId, role: '', code: r.empId, dept: '', wilayat: '', siteId: '' };
      const kv = (k, v) => v ? '<span>' + k + '</span><b>' + v + '</b>' : '';
      const typeName = r.type === 'leave' ? (r.leaveType || 'Annual leave') : REQ_NAME[r.type] || r.type;
      let when = '';
      if (r.type === 'leave') when = esc(r.from) + (r.to !== r.from ? ' – ' + esc(r.to) : '') + ' · ' + r.days + ' ' + (r.days === 1 ? 'day' : 'days');
      else if (r.type === 'missed') when = MM.fmtDay(r.date) + ', ' + MM.fmtDate(r.date) + ' · ' + t(r.punchType === 'IN' ? 'Check In' : 'Check Out') + ' at ' + r.time;
      else if (r.type === 'short') when = MM.fmtDate(r.date) + ' · ' + r.from + ' – ' + r.to + ' (' + r.hours + ' h)';
      else when = MM.fmtDate(r.date || r.created);
      const stage = r.status !== 'pending' ? pill(r.status === 'approved' ? 'p-green' : 'p-red', t(r.status === 'approved' ? 'Approved' : 'Rejected')) + (r.decidedBy ? ' <small class="muted">by ' + esc(r.decidedBy) + '</small>' : '') : r.stage === 'hr' ? pill('p-blue', 'Supervisor ✓ → waiting for HR') : pill('p-amber', 'Waiting for supervisor');
      // the employee's last 7 days of attendance, for context
      const days = []; for (let i = 1; i <= 7; i++) { const d = MM.dayStart() - i * 864e5; const rec = (attRecordsFor(d) || []).find(x => x.e.id === e.id); if (rec) days.push([d, rec]); }
      const others = db().requests.filter(x => x.empId === r.empId && x.id !== r.id).sort((a, b) => b.created - a.created).slice(0, 4);
      const ST = { present: ['On time', 'p-green'], late: ['Late', 'p-amber'], absent: ['Absent', 'p-red'], leave: ['On leave', 'p-blue'], off: ['Off', 'p-gray'] };
      const body = '<div class="rqv"><div>' + person(e, (e.code || '') + ' · ' + esc(e.role || '')) +
        '<div class="kv" style="grid-template-columns:120px 1fr;margin-top:14px">' + kv(t('Department'), esc(e.dept)) + kv(t('Location'), esc(e.wilayat)) + kv('Reference', '<span class="keep-ltr">' + r.id + '</span>') + kv(t('Request'), esc(typeName)) + kv('When', when) +
        (r.detail ? kv('Detail', esc(r.detail)) : '') + kv('Reason', esc(r.reason || '—')) + (r.file ? kv('Attachment', I('clip', 14) + ' ' + esc(r.file)) : '') + kv('Submitted', MM.fmtDate(r.created) + ' · ' + ampm(r.created) + ' <small class="muted">(' + ago(r.created) + ')</small>') +
        (r.type === 'leave' ? kv('Leave balance', (r.balance || 18) + ' days · Oracle HRMS') : '') + kv(t('Status'), stage) + '</div>' +
        '<div class="rqv-ev"><b>' + I('shield', 15) + t('Evidence') + '</b><div>' + reqEvidence(r) + '</div></div></div>' +
        '<div><h4 class="rqv-h">Attendance · last 7 days</h4>' + (days.length ? '<table class="tbl compact"><tbody>' + days.map(([d, rec]) => '<tr><td style="white-space:nowrap">' + MM.fmtDay(d).slice(0, 3) + ', ' + MM.fmtDateShort(d) + '</td><td>' + (rec.i ? ampm(rec.i.time) : '—') + '</td><td>' + (rec.o ? ampm(rec.o.time) : '—') + '</td><td>' + pill(ST[rec.status][1], t(ST[rec.status][0])) + '</td></tr>').join('') + '</tbody></table>' : '<p class="muted">No records</p>') +
        '<h4 class="rqv-h" style="margin-top:14px">Previous requests</h4>' + (others.length ? others.map(o => '<div class="rqv-o"><span>' + esc(o.type === 'leave' ? (o.leaveType || 'Annual leave') : REQ_NAME[o.type] || o.type) + ' <small class="muted keep-ltr">' + o.id + '</small></span>' + pill(o.status === 'approved' ? 'p-green' : o.status === 'rejected' ? 'p-red' : 'p-amber', t(o.status === 'approved' ? 'Approved' : o.status === 'rejected' ? 'Rejected' : 'Pending')) + '</div>').join('') : '<p class="muted" style="margin:0">None</p>') + '</div></div>';
      return wrap(esc(typeName) + ' · ' + esc(nameOf(e)), body, r.status === 'pending' ? '<button class="btn" data-act="reject" data-arg="' + r.id + '">' + t('Reject') + '</button><button class="btn primary" data-act="approve" data-arg="' + r.id + '">' + I('check', 16) + t('Approve') + '</button>' : '<button class="btn primary" data-act="close">' + t('Close') + '</button>', true);
    }
    if (m.type === 'tsphoto') {
      const x = timeEntryList().find(y => y.key === m.key); if (!x || !x.photo) { ui.modal = null; return ''; }
      const ph = x.photo, site = MM.siteById(x.e.siteId), lim = site.shape === 'circle' ? site.radius + site.buffer : 120;
      const inside = ph.dist <= lim, canApprove = x.st === 'pending' && x.o && !x.fix;
      const kv = (k, v) => '<span>' + k + '</span><b>' + v + '</b>';
      return wrap(t('Verify check-in') + ' · ' + esc(nameOf(x.e)) + ' · ' + MM.fmtDateShort(x.day),
        '<div class="tsv"><div class="tsv-img" style="background-image:url(\'' + ph.src + '\')"><span class="stamp keep-ltr">' + MM.fmtTimeS(ph.time) + ' · ' + ph.lat.toFixed(5) + ', ' + ph.lng.toFixed(5) + ' · ±' + ph.acc + 'm</span>' + (ph.live ? '<em>' + t('Taken in the app today') + '</em>' : '') + '</div>' +
        '<div class="tsv-info">' + person(x.e, x.e.code + ' · ' + esc(x.e.role)) +
        '<div class="kv" style="grid-template-columns:120px 1fr;margin-top:12px">' + kv(t('Work site'), esc(MM.nm(site))) + kv(t('Photo taken'), MM.fmtDate(ph.time) + ' · ' + ampm(ph.time)) + kv(t('Check in'), x.i ? ampm(x.i.time) + (x.i.late ? ' · <span class="warn-text">Late ' + x.i.late + ' min</span>' : '') : '—') + kv(t('Check out'), x.o ? ampm(x.o.time) : x.st === 'open' ? '<span class="muted">Still on shift</span>' : '<span class="bad-text">Missing</span>') +
        kv('GPS', '<span class="keep-ltr">' + ph.lat.toFixed(5) + ', ' + ph.lng.toFixed(5) + '</span> · ±' + ph.acc + ' m') + kv(t('Distance'), ph.dist + ' m ' + t('from site centre')) + '</div>' +
        '<div class="tsv-checks"><span class="' + (inside ? 'ok' : 'bad') + '">' + I(inside ? 'check' : 'x', 14, 2.6) + (inside ? 'Inside geofence' : 'Outside geofence') + '</span><span class="ok">' + I('check', 14, 2.6) + 'Taken in the app – no gallery upload</span><span class="ok">' + I('check', 14, 2.6) + 'Time from server, GPS stamped</span><span class="ok">' + I('check', 14, 2.6) + 'Registered phone</span></div>' +
        (x.a && x.a.note ? '<p class="muted2" style="margin:10px 0 0">' + esc(x.a.by || '') + ': ' + esc(x.a.note) + '</p>' : '') + '</div></div>',
        x.st === 'pending' ? '<button class="btn" data-act="tereturn" data-arg="' + x.key + '">' + t('Return') + '</button><button class="btn primary" data-act="teapprove" data-arg="' + x.key + '"' + (canApprove ? '' : ' disabled') + '>' + I('check', 16) + t('Approve') + '</button>' : '<button class="btn primary" data-act="close">' + t('Close') + '</button>', true);
    }
    if (m.type === 'create') {
      const field = db().employees.filter(e => e.field && e.status === 'active');
      return wrap(t('Create Task'), '<div class="grid g2" style="gap:12px"><label><span class="lbl">Title</span><input class="inp" style="width:100%" id="ctTitle" value="Food outlet hygiene inspection"></label><label><span class="lbl">' + t('Task Type') + '</span><select class="sel" style="width:100%" id="ctType">' + Object.keys(MM.TASK_TYPES).map(x => '<option>' + x + '</option>').join('') + '</select></label>' +
        '<label><span class="lbl">' + t('Location') + '</span><select class="sel" style="width:100%" id="ctLoc">' + taskLocOptions(m.loc) + '</select></label>' +
        '<label><span class="lbl">' + t('Assigned To') + '</span><select class="sel" style="width:100%" id="ctWho">' + field.map(e => '<option value="' + e.id + '"' + (e.id === (m.who || '104582') ? ' selected' : '') + '>' + esc(nameOf(e)) + ' · ' + esc(e.wilayat) + '</option>').join('') + '</select></label>' +
        '<label><span class="lbl">' + t('Priority') + '</span><select class="sel" style="width:100%" id="ctPri"><option value="High">High</option><option value="Normal">Normal</option><option value="Low">Low</option></select></label><label><span class="lbl">Due time</span><input class="inp" style="width:100%" id="ctDue" type="time" value="' + MM.fmtTime(MM.now() + 3 * 3600e3) + '"></label></div>' +
        '<label style="display:block;margin-top:12px"><span class="lbl">' + t('Description') + '</span><textarea class="inp" style="width:100%" id="ctNote" rows="2">Check food storage temperatures and staff health cards. Photograph any violations.</textarea></label>',
        '<button class="btn" data-act="close">' + t('Cancel') + '</button><button class="btn primary" data-act="createtask">' + I('send', 16) + 'Send to phone</button>');
    }
    if (m.type === 'task') { const x = db().tasks.find(z => z.id === m.id); return wrap(x.id + ' · ' + esc(L(x.title, x.titleAr)), '<div class="photos3">' + x.photos.map(ph => '<div style="background-image:url(\'' + (ph.src || MM.samplePhotoSVG(ph.sample || 1)) + '\')"><span>' + MM.fmtTime(ph.time) + ' · ' + ph.lat.toFixed(3) + ', ' + ph.lng.toFixed(3) + '</span></div>').join('') + '</div><div class="kv" style="margin-top:14px"><span>' + t('Assigned To') + '</span><b>' + esc(nameOf(emp(x.assignee))) + '</b><span>On site</span><b class="ok-text">' + (x.arrivedAt ? ampm(x.arrivedAt) + ' · ' + x.distance + ' m from site' : '—') + '</b><span>' + t('Notes') + '</span><b>' + (esc(x.notes) || '—') + '</b></div>', x.status === 'done' ? '<button class="btn" data-act="returntask" data-arg="' + x.id + '">' + t('Return') + '</button><button class="btn primary" data-act="signoff" data-arg="' + x.id + '">' + t('Sign off') + '</button>' : '<button class="btn" data-act="close">' + t('Close') + '</button>', true); }
    if (m.type === 'reassign') {
      const ids = m.ids; const x = db().tasks.find(z => z.id === ids[0]);
      // searchable list of active field staff (name in English/Arabic, ID, area, role)
      if (m.st == null) { m.st = MM.fmtTime(x.start || x.created); m.en = MM.fmtTime(x.due); m.st0 = m.st; m.en0 = m.en; }
      const staff = db().employees.filter(e => e.field && e.status === 'active' && !ids.every(id => (db().tasks.find(z => z.id === id) || {}).assignee === e.id));
      const busy = id => db().tasks.filter(z => z.assignee === id && !['done', 'signed'].includes(z.status) && z.due >= MM.dayStart()).length;
      const row = e => '<button type="button" class="ra-row' + (m.who === e.id ? ' on' : '') + '" data-act="rapick" data-arg="' + e.id + '" data-q="' + esc((e.name + ' ' + e.nameAr + ' ' + e.id + ' ' + e.wilayat + ' ' + e.role).toLowerCase()) + '"><span class="av">' + esc(MM.initials ? MM.initials(e) : e.name.split(' ').map(w => w[0]).slice(0, 2).join('')) + '</span><span class="ra-t"><b>' + esc(nameOf(e)) + '</b><small>' + esc(e.id) + ' · ' + esc(e.role) + ' · ' + esc(e.wilayat) + '</small></span><span class="ra-n">' + busy(e.id) + ' ' + t('open') + '</span><span class="ra-ck">' + I('check', 14, 3) + '</span></button>';
      const q = (m.q || '').toLowerCase();
      return wrap(t('Reassign') + ' · ' + ids.join(', '),
        '<span class="lbl">' + t('New assignee') + '</span><div class="inp-ic" style="margin-bottom:8px">' + I('search', 16) + '<input class="inp" id="raQ" placeholder="' + esc(t('Search by name, ID, area or role…')) + '" value="' + esc(m.q || '') + '" autocomplete="off"></div>' +
        '<div class="ra-list" id="raList">' + staff.map(e => row(e).replace('class="ra-row', (q && !(e.name + ' ' + e.nameAr + ' ' + e.id + ' ' + e.wilayat + ' ' + e.role).toLowerCase().includes(q) ? 'hidden class="ra-row' : 'class="ra-row'))).join('') + '<div class="ra-none muted" id="raNone" hidden>' + t('No employee matches your search') + '</div></div>' +
        '<div class="grid g2" style="gap:10px;margin:12px 0"><label><span class="lbl">' + t('Start time') + '</span><input class="inp" style="width:100%" type="time" id="raSt" value="' + m.st + '"></label><label><span class="lbl">' + t('End time') + '</span><input class="inp" style="width:100%" type="time" id="raEn" value="' + m.en + '"></label></div>' +
        '<label style="display:block"><span class="lbl">' + t('Reason') + '</span><select class="sel" style="width:100%" id="raWhy"><option>Original assignee delayed</option><option>Closer team member available</option><option>Workload balancing</option><option>Specialist skills needed</option></select></label>',
        '<button class="btn" data-act="close">' + t('Cancel') + '</button><button class="btn primary" data-act="doreassign">' + t('Reassign') + '</button>');
    }
    if (m.type === 'note') return wrap(m.title, '<label style="display:block"><span class="lbl">' + m.label + '</span><textarea class="inp" style="width:100%" id="noteTxt" rows="3">' + esc(m.def || '') + '</textarea></label>', '<button class="btn" data-act="close">' + t('Cancel') + '</button><button class="btn ' + (m.danger ? 'danger' : 'primary') + '" data-act="notedone">' + m.btn + '</button>');
    if (m.type === 'confirm') return wrap(m.title, '<p style="margin:0;line-height:1.55">' + m.body + '</p>', '<button class="btn" data-act="close">' + t('Cancel') + '</button><button class="btn ' + (m.danger ? 'danger' : 'primary') + '" data-act="confirmdo">' + m.btn + '</button>');
    if (m.type === 'select') return wrap(m.title, '<label style="display:block"><span class="lbl">' + m.label + '</span><select class="sel" style="width:100%" id="selVal">' + m.opts.map(([v, l]) => '<option value="' + esc(v) + '">' + esc(l) + '</option>').join('') + '</select></label>', '<button class="btn" data-act="close">' + t('Cancel') + '</button><button class="btn primary" data-act="selectdone">' + t('Save') + '</button>');
    if (m.type === 'addemp') return wrap(t('Add Employee'), '<div class="grid g2" style="gap:12px"><label><span class="lbl">Full name</span><input class="inp" style="width:100%" id="aeName" value="Hilal Al Wahaibi"></label><label><span class="lbl">Name (Arabic) <small class="muted" id="aeArHint">· ' + t('filled in automatically') + '</small></span><input class="inp" style="width:100%" id="aeAr" dir="rtl" value="' + esc(MM.toArabicName('Hilal Al Wahaibi')) + '"></label><label><span class="lbl">' + t('Department') + '</span><select class="sel" style="width:100%" id="aeDept">' + [...new Set(db().employees.map(e => e.dept))].sort().map(x => '<option>' + esc(x) + '</option>').join('') + '</select></label><label><span class="lbl">' + t('Role') + '</span><input class="inp" style="width:100%" id="aeRole" value="Field Inspector"></label><label><span class="lbl">' + t('Location') + '</span><select class="sel" style="width:100%" id="aeSite">' + db().sites.map(s => '<option value="' + s.id + '">' + esc(MM.nm(s)) + '</option>').join('') + '</select></label><label><span class="lbl">' + t('Employment Type') + '</span><select class="sel" style="width:100%" id="aeField"><option value="1">' + t('Field Staff') + '</option><option value="0">' + t('Office Staff') + '</option></select></label></div><p class="muted2" style="margin-bottom:0">In production employees come from the Oracle HRMS daily sync; the phone is registered on first sign-in.</p>', '<button class="btn" data-act="close">' + t('Cancel') + '</button><button class="btn primary" data-act="doaddemp">' + t('Add Employee') + '</button>');
    if (m.type === 'arcgis') {
      const steps = ['Connecting to ArcGIS Server 10.8.1 (MM_Parcels/FeatureServer/0)', 'Querying ' + db().sites.length + ' parcel boundaries changed since last sync', 'Converting UTM zone 40N → WGS84 (EPSG:32640 → 4326)', 'Validating polygons and storing in Oracle Spatial', 'Re-mapping departments and staff to sites'];
      return wrap(t('Import from ArcGIS'), '<ul style="list-style:none;padding:0;margin:0">' + steps.map((s, i) => '<li style="display:flex;gap:10px;align-items:center;padding:7px 0">' + (i < m.step ? '<span class="ok-text">' + I('check', 18, 2.6) + '</span>' : i === m.step ? '<span class="spin dark"></span>' : '<span class="muted">' + I('clock', 18) + '</span>') + s + '</li>').join('') + '</ul>' + (m.step >= steps.length ? '<div class="pill p-green" style="margin-top:12px">' + db().sites.length + ' sites · 0 errors</div>' : ''), m.step >= steps.length ? '<button class="btn primary" data-act="close">' + t('Close') + '</button>' : '');
    }
    if (m.type === 'cell') {
      const e = emp(m.emp); const day = weekStartMs() + m.day * 864e5;
      return wrap(t('Assign') + ' · ' + esc(nameOf(e)), '<p class="muted" style="margin-top:0">' + MM.fmtDay(day) + ' ' + MM.fmtDateShort(day) + '</p><div class="grid g3" style="gap:8px">' + Object.entries(db().shifts).map(([kk, s]) => '<button class="rc rc-' + kk + '" data-act="setcell" data-arg="' + kk + '"><b>' + I(SH_ICON[kk], 13) + esc(L(s.name, s.ar)) + '</b>' + (s.from ? '<small dir="ltr">' + s.from + '</small>' : '') + '</button>').join('') + '<button class="rc rc-X" data-act="setcell" data-arg="">— Clear</button></div>');
    }
    return '';
  }

  /* ---------------- task locations: geofence sites (live from Locations & geofences) + common inspection points ---------------- */
  function taskLoc(v) {
    if (v && v.startsWith('site:')) {
      const s = db().sites.find(x => x.id === v.slice(5)); if (!s) return MM.LOC.khuwairMall;
      const c = MM.siteCenter(s);
      // task zone = the site's own size: circle radius, or the farthest polygon corner from the centre
      const r = s.shape === 'circle' ? s.radius : Math.max.apply(null, s.polygon.map(p => MM.haversine(c, p)));
      return { name: s.name, ar: s.nameAr || s.name, lat: c.lat, lng: c.lng, wil: s.wilayat || '', radius: Math.max(50, Math.round(r)), siteId: s.id };
    }
    return MM.LOC[v] || MM.LOC.khuwairMall;
  }
  function taskLocOptions(sel) {
    sel = sel || 'khuwairMall';
    const sites = db().sites.slice().sort((a, b) => MM.nm(a).localeCompare(MM.nm(b)));
    return '<optgroup label="' + esc(t('Locations & Geofences')) + '">' + sites.map(s => '<option value="site:' + s.id + '"' + (sel === 'site:' + s.id ? ' selected' : '') + '>' + esc(MM.nm(s)) + (s.wilayat ? ' · ' + esc(s.wilayat) : '') + '</option>').join('') + '</optgroup>' +
      '<optgroup label="' + esc(t('Inspection points')) + '">' + Object.entries(MM.LOC).map(([kk, v]) => '<option value="' + kk + '"' + (kk === sel ? ' selected' : '') + '>' + esc(L(v.name, v.ar)) + '</option>').join('') + '</optgroup>';
  }

  /* ---------------- events ---------------- */
  let notePending = null, confirmPending = null, selectPending = null;
  function openNote(o, cb) { ui.modal = Object.assign({ type: 'note' }, o); notePending = cb; render(); setTimeout(() => { const n = document.getElementById('noteTxt'); if (n) n.focus(); }, 30); }
  function openConfirm(o, cb) { ui.modal = Object.assign({ type: 'confirm' }, o); confirmPending = cb; render(); }
  function openSelect(o, cb) { ui.modal = Object.assign({ type: 'select' }, o); selectPending = cb; render(); }
  function nav(p) { ui.page = LEGACY[p] || p; ui.menu = null; ui.modal = null; ui.mobileOpen = false; history.replaceState(null, '', '#' + ui.page); render(); window.scrollTo(0, 0); }
  const checkedTasks = () => Object.keys(ui.tk.checked).filter(id => ui.tk.checked[id]);
  function setF(path, val) { const [a, b] = path.split('.'); ui[a][b] = val; if ('page' in ui[a]) ui[a].page = 1; }
  function signOff(id) { MM.tx(d => { const x = d.tasks.find(z => z.id === id); if (!x || x.status !== 'done') return; x.status = 'signed'; x.signedBy = user().name; x.signedAt = MM.now(); x.history.push(['signed', MM.now()]); MM.notify(d, x.assignee, x.id + ' signed off by ' + user().name, 'تم اعتماد ' + x.id, 'approved'); MM.addActivity(d, { title: 'Field task signed off', sub: x.id + ' · ' + x.title, kind: 'task' }); decide('Signed off ' + x.id + ' · ' + x.title, x.photos.length + ' photos, location verified')(d); }); toast(t('Sign off'), id, 'ok'); }

  document.addEventListener('submit', ev => {
    const f = ev.target.dataset.form; if (!f) return; ev.preventDefault();
    if (f === 'login') signIn(false); else if (f === 'addatt') saveAttendance();
  });
  document.addEventListener('click', ev => {
    if (ev.target.matches('input[type=checkbox][data-tkcheck],input[type=checkbox][data-empcheck]')) return;
    const el = ev.target.closest('[data-act]');
    if (!el && ui.geo.open && !ev.target.closest('.gsr')) { ui.geo.open = false; geoSearchPaint(); }
    if (!el) { if (ui.menu && !ev.target.closest('[data-stop]')) { ui.menu = null; render(); } if (ui.search && !ev.target.closest('.srch')) { ui.search = ''; render(); } return; }
    const act = el.dataset.act, arg = el.dataset.arg;
    if (/TSK-\d{4}-\d{4}/.test(String(arg || '')) && !['tksel', 'ptab', 'tkday'].includes(act)) { toast(t('Read-only'), t('Past and upcoming days are shown for reference – switch to Today to act on tasks'), 'warn'); return; }
    if (act !== 'menu' && ui.menu && !el.closest('[data-stop]')) ui.menu = null;
    if (act === 'closebg') { if (ev.target === el) { ui.modal = null; render(); } return; }
    if (el.tagName === 'A' || act === 'noop' || act === 'forgot') ev.preventDefault();
    switch (act) {
      case 'noop': toast('Demo', 'Available in the full product', 'info'); break;
      case 'nav': nav(arg); break;
      case 'ham': if (window.innerWidth <= 860) ui.mobileOpen = !ui.mobileOpen; else ui.collapsed = !ui.collapsed; render(); setTimeout(() => Object.values(Maps).forEach(m => m.map.invalidateSize()), 250); break;
      case 'menu': ui.menu = ui.menu === arg ? null : arg; render(); break;
      case 'lang': MM.setLang('p', arg || (AR() ? 'en' : 'ar')); ui.menu = null; render(); break;
      case 'role': ui.role = arg; localStorage.setItem('mmsa.portal.role', arg); render(); toast(L(user().name, user().nameAr), L(user().role, user().roleAr), 'info'); break;
      case 'logout': ui.session = null; localStorage.removeItem('mmsa.portal.session'); ui.menu = null; render(); break;
      case 'showpw': ui.showPw = !ui.showPw; render(); break;
      case 'forgot': toast(t('Forgot Password?'), 'A reset link is sent through Active Directory self-service.', 'info'); break;
      case 'sso': signIn(true); break;
      case 'openmobile': window.open('mobile.html', '_blank'); break;
      case 'console': location.href = 'index1.html'; break;
      case 'reset': openConfirm({ title: t('Reset demo data'), body: 'All demo changes return to the starting sample data on every connected screen.', btn: t('Reset demo data'), danger: true }, () => { MM.reset(); ui.geo.draft = null; toast(t('Reset demo data'), '✓', 'ok'); }); break;
      case 'close': ui.modal = null; render(); break;
      case 'semp': ui.search = ''; ui.emp.sel = arg; ui.emp.ptab = 'overview'; nav('employees'); break;
      case 'sgeo': ui.search = ''; ui.geo.sel = arg; ui.geo.draft = null; nav('geofences'); break;
      case 'stask': ui.search = ''; ui.tk.sel = arg; ui.ptab = 'details'; nav('tasks'); break;
      case 'pg': { const [k, p] = arg.split(':'); ui[k].page = +p; render(); break; }
      case 'atttab': ui.att.tab = arg; render(); break;
      case 'attreset': Object.assign(ui.att, { dept: 'all', site: 'all', status: 'all', q: '', page: 1 }); render(); break;
      case 'atttoday': ui.att.date = null; ui.att.page = 1; render(); break;
      case 'attstatus': ui.att.status = arg; ui.att.page = 1; render(); break;
      case 'attexport': { const rs = ui.att.exportRows || []; MM.download('MM-attendance-' + MM.ymd(ui.att.date || MM.now()) + '.csv', MM.toCSV([['Employee ID', 'Employee', 'Department', 'Location', 'Check in', 'Check out', 'Hours', 'Geofence', 'Status']].concat(rs.map(r => [r.e.code, r.e.name, r.e.dept, r.e.wilayat, r.i ? MM.fmtTime(r.i.time) : '', r.o ? MM.fmtTime(r.o.time) : '', r.hours ? (r.hours / 3600e3).toFixed(2) : '', r.geo || '', r.status]))), 'text/csv;charset=utf-8'); break; }
      case 'addtype': addState().type = arg; render(); break;
      case 'addreset': ui.add = null; render(); break;
      case 'quick': ui.quick = arg; render(); break;
      case 'usegps': {
        const f = addState();
        const fallback = () => { const s = MM.siteCenter(MM.siteById(emp(f.empId).siteId)); f.pos = { lat: s.lat + 0.0002, lng: s.lng + 0.0001 }; f.acc = 8; render(); toast('Location', 'Browser location unavailable – using the employee\'s site', 'warn'); };
        if (!navigator.geolocation) { fallback(); break; }
        navigator.geolocation.getCurrentPosition(p => { f.pos = { lat: p.coords.latitude, lng: p.coords.longitude }; f.acc = p.coords.accuracy; render(); }, fallback, { enableHighAccuracy: true, timeout: 8000 });
        break;
      }
      case 'foview': ui.fo.view = arg; render(); break;
      case 'foteam': ui.fo.team = arg; render(); break;
      case 'foltab': ui.fo.ltab = arg; render(); break;
      case 'foemp': ui.fo.selEmp = arg; ui.fo.selTask = (activeTasks().find(x => x.assignee === arg) || db().tasks.find(x => x.assignee === arg) || {}).id || null; render(); break;
      case 'fosel': ui.fo.selTask = arg || null; if (arg) ui.fo.selEmp = db().tasks.find(x => x.id === arg).assignee; render(); break;
      case 'tksel': ui.tk.sel = arg || null; render(); break;
      case 'tkview': ui.tk.view = arg; render(); break;
      case 'tkgroup': ui.tk.group = arg; ui.tk.page = 1; render(); break;
      case 'tkall': { const any = checkedTasks().length; ui.tk.checked = {}; if (!any) db().tasks.forEach(x => ui.tk.checked[x.id] = true); render(); break; }
      case 'ptab': ui.ptab = arg; render(); break;
      case 'setstatus': { const [id, st] = arg.split(':'); setStatus(id, st); break; }
      case 'bulkset': { const ids = checkedTasks(); if (!ids.length) { toast('Select tasks first', '', 'warn'); break; } ids.forEach(id => setStatus(id, arg)); break; }
      case 'bulkverify': { const ids = checkedTasks().filter(id => db().tasks.find(x => x.id === id).status === 'done'); if (!ids.length) { toast('Nothing to verify', 'Select tasks that are Under Review', 'warn'); break; } ids.forEach(signOff); render(); break; }
      case 'bulkassign': { const ids = checkedTasks().length ? checkedTasks() : (ui.tk.sel ? [ui.tk.sel] : []); if (!ids.length) { toast('Select tasks first', '', 'warn'); break; } ui.modal = { type: 'reassign', ids }; render(); break; }
      case 'tkexport': { const ls = ui.tk.exportList || db().tasks; MM.download('MM-tasks-' + MM.ymd(ui.tk.date || MM.now()) + '.csv', MM.toCSV([['Task ID', 'Task', 'Type', 'Location', 'Assigned to', 'Due', 'Status', 'Priority']].concat(ls.map(x => [x.id, x.title, x.type, x.loc, x.assignee ? emp(x.assignee).name : '', isoD(x.due) + ' ' + MM.fmtTime(x.due), x.status, x.priority]))), 'text/csv;charset=utf-8'); break; }
      case 'tktoday': ui.tk.date = null; ui.tk.page = 1; render(); break;
      case 'tkreset': Object.assign(ui.tk, { loc: 'all', type: 'all', who: 'all', pri: 'all', q: '', page: 1 }); render(); break;
      case 'tkday': { const d = +arg; ui.tk.date = d === MM.dayStart() ? null : d; ui.tk.view = 'list'; ui.tk.page = 1; ui.tk.group = 'today'; render(); break; }
      case 'tkweek': { const tdy = MM.dayStart(); let d = (ui.tk.date || tdy) + (+arg) * 7 * 864e5; d = Math.max(tdy - TK_PAST * 864e5, Math.min(tdy + TK_AHEAD * 864e5, d)); ui.tk.date = d === tdy ? null : d; render(); break; }
      case 'create': ui.modal = { type: 'create' }; render(); break;
      case 'assigntask': ui.modal = { type: 'create', who: arg }; render(); break;
      case 'createtask': {
        const g = id => document.getElementById(id).value; const Lc = taskLoc(g('ctLoc'));
        const [h, mi] = g('ctDue').split(':').map(Number); const due = new Date(MM.now()); due.setHours(h, mi, 0, 0);
        let id;
        MM.tx(d => { d.counters.tsk++; id = 'TSK-' + d.counters.tsk; d.tasks.push({ id, type: g('ctType'), title: g('ctTitle') || 'Inspection', titleAr: 'مهمة ' + Lc.ar, loc: Lc.name, locAr: Lc.ar, wilayat: Lc.wil, lat: Lc.lat, lng: Lc.lng, radius: Lc.radius || 100, siteId: Lc.siteId || null, priority: g('ctPri'), assignee: g('ctWho'), status: 'assigned', due: due.getTime(), createdBy: user().name, created: MM.now(), photos: [], notes: '', desc: g('ctNote'), history: [['assigned', MM.now()]] }); MM.notify(d, g('ctWho'), 'New task assigned: ' + id + ' · ' + (g('ctTitle') || 'Inspection'), 'مهمة جديدة: ' + id + ' · ' + Lc.ar, 'task'); MM.addActivity(d, { title: 'New field task assigned', sub: (g('ctTitle') || 'Inspection') + ' – ' + Lc.name.split(',')[0], kind: 'task' }); });
        ui.modal = null; ui.flash[id] = 1; ui.tk.sel = id; ui.fo.selTask = id; render(); toast('Task created and sent to phone', id + ' → ' + emp(db().tasks.find(x => x.id === id).assignee).name, 'ok'); break;
      }
      case 'opentask': ui.modal = { type: 'task', id: arg }; render(); break;
      case 'reassign': ui.modal = { type: 'reassign', ids: [arg] }; render(); break;
      case 'doreassign': {
        const who = ui.modal.who, why = document.getElementById('raWhy').value; const ids = ui.modal.ids;
        if (!who) { toast(t('Choose the new assignee'), t('Search by name and pick an employee from the list'), 'warn'); break; }
        const st = document.getElementById('raSt').value, en = document.getElementById('raEn').value;
        if (!st || !en || st >= en) { toast(t('Check the time'), t('End time must be after the start time'), 'warn'); break; }
        const timeChanged = st !== ui.modal.st0 || en !== ui.modal.en0;
        const at = (base, hm) => { const [h, mi] = hm.split(':').map(Number); const dd = new Date(base); dd.setHours(h, mi, 0, 0); return dd.getTime(); };
        MM.tx(d => ids.forEach(tid => { const x = d.tasks.find(z => z.id === tid); const old = x.assignee; x.assignee = who;
          if (timeChanged) { x.start = at(x.due, st); x.due = at(x.due, en); } x.status = 'assigned'; x.arrivedAt = null; x.history.push(['assigned', MM.now()]); MM.notify(d, who, 'Task reassigned to you: ' + x.id + ' · ' + x.title, 'مهمة أعيد إسنادها إليك: ' + x.id, 'task'); MM.notify(d, old, x.id + ' was reassigned', x.id + ' أعيد إسنادها', 'info'); decide('Reassigned ' + x.id + ' to ' + emp(who).name, why)(d); }));
        ui.modal = null; ui.tk.checked = {}; ids.forEach(i => ui.flash[i] = 1); render(); toast(t('Reassign'), ids.join(', ') + ' → ' + emp(who).name + ' · ' + st + '–' + en, 'ok'); break;
      }
      case 'rapick': {
        ui.modal.who = arg;
        document.querySelectorAll('#raList .ra-row').forEach(b => b.classList.toggle('on', b.dataset.arg === arg));
        break;
      }
      case 'addnote': openNote({ title: t('Add Note') + ' · ' + arg, label: 'Note (visible to the worker on the phone)', def: '', btn: t('Save') }, txt => { MM.tx(d => { const x = d.tasks.find(z => z.id === arg); x.supNote = txt; x.returned = x.status === 'inprogress'; MM.notify(d, x.assignee, x.id + ' note: ' + txt, x.id + ': ' + txt, 'info'); }); toast(t('Add Note'), t('Sent to phone'), 'ok'); }); break;
      case 'call': toast('Calling ' + emp(arg).name, emp(arg).phone, 'info'); break;
      case 'msg': openNote({ title: t('Message') + ' · ' + emp(arg).name, label: 'Push message to the employee\'s phone', def: 'Please call the control room when you reach the site.', btn: 'Send' }, txt => { MM.tx(d => MM.notify(d, arg, 'Message from ' + user().name + ': ' + txt, 'رسالة من ' + user().nameAr + ': ' + txt, 'info')); toast(t('Sent to phone'), emp(arg).name, 'ok'); }); break;
      case 'viewloc': { const c = db().crew[arg]; ui.fo.view = 'live'; ui.fo.selEmp = arg; ui.fo.selTask = (activeTasks().find(x => x.assignee === arg) || {}).id || null; nav('fieldops'); if (c && Maps.fo) Maps.fo.map.setView([c.lat, c.lng], 14); if (!c) toast('No live location', 'Location sharing is only active during shift hours', 'info'); break; }
      case 'signoff': signOff(arg); ui.modal = null; render(); break;
      case 'returntask': openNote({ title: t('Return') + ' · ' + arg, label: 'Note to worker', def: 'Please add a close-up photo of the issue.', btn: t('Return') }, txt => { MM.tx(d => { const x = d.tasks.find(z => z.id === arg); x.status = 'inprogress'; x.returned = true; x.supNote = txt; x.history.push(['inprogress', MM.now()]); MM.notify(d, x.assignee, x.id + ' returned: ' + txt, x.id + ' أعيدت: ' + txt, 'rejected'); decide('Returned ' + x.id + ' to worker', txt)(d); }); toast(t('Return'), arg, 'warn'); }); break;
      case 'aptab': ui.ap.tab = arg; render(); break;
      case 'approve': if (ui.modal && ui.modal.type === 'reqview') ui.modal = null; approveReq(arg); break;
      case 'reqview': ui.modal = { type: 'reqview', id: arg }; render(); break;
      case 'reject': openNote({ title: t('Reject'), label: 'Reason', def: 'Not supported by the punch and GPS records.', btn: t('Reject'), danger: true }, txt => { MM.tx(d => { const r = d.requests.find(x => x.id === arg); r.status = 'rejected'; r.decidedBy = user().name; r.decidedAt = MM.now(); MM.notify(d, r.empId, 'Your ' + (REQ_NAME[r.type] || '').toLowerCase() + ' request was rejected: ' + txt, 'تم رفض طلبك: ' + txt, 'rejected'); decide('Rejected ' + (REQ_NAME[r.type] || r.type) + ' · ' + (emp(r.empId) || {}).name + ' · ' + r.id, txt)(d); }); toast(t('Rejected'), arg, 'warn'); }); break;
      case 'afilter': ui.ap.filter = arg; render(); break;
      case 'tefilter': ui.ap.tf = arg; render(); break;
      case 'teapprove': ui.modal = null; approveTs([arg]); break;
      case 'teview': ui.modal = { type: 'tsphoto', key: arg }; render(); break;
      case 'teall': approveTs(timeEntryList().filter(x => x.st === 'pending' && x.o && !x.fix).map(x => x.key)); break;
      case 'tereturn': { const x = timeEntryList().find(y => y.key === arg); if (!x) break; openNote({ title: t('Return time entry'), label: 'Reason (sent to the employee)', def: !x.o ? 'Check-out is missing. Please submit a missed-punch correction.' : 'Please check your times and submit a correction.', btn: t('Return'), danger: true }, txt => { MM.tx(d => { const a = d.tsApprovals[x.key]; Object.assign(a, { status: 'returned', by: user().name, at: MM.now(), note: txt }); tsNotify(d, x, 'returned', txt); decide('Returned time entry · ' + x.e.name + ' · ' + MM.fmtDate(x.day), txt)(d); }); ui.flash[x.key] = 1; toast(t('Returned'), x.e.name + ' · employee notified', 'warn'); }); break; }
      case 'auditcsv': MM.download('MM-antifraud-audit-' + MM.ymd(MM.now()) + '.csv', MM.toCSV(reportRows('fraud')), 'text/csv;charset=utf-8'); break;
      case 'notedone': { const v = document.getElementById('noteTxt').value.trim() || '—'; ui.modal = null; const cb = notePending; notePending = null; cb && cb(v); render(); break; }
      case 'confirmdo': { ui.modal = null; const cb = confirmPending; confirmPending = null; cb && cb(); render(); break; }
      case 'selectdone': { const v = document.getElementById('selVal').value; ui.modal = null; const cb = selectPending; selectPending = null; cb && cb(v); render(); break; }
      case 'emptab': ui.emp.tab = arg; ui.emp.page = 1; render(); break;
      case 'empsel': ui.emp.sel = arg || null; ui.emp.ptab = 'overview'; render(); break;
      case 'empptab': ui.emp.ptab = arg; render(); break;
      case 'empreset': Object.assign(ui.emp, { q: '', dept: 'all', site: 'all', role: 'all', status: 'all', page: 1 }); render(); break;
      case 'empall': { const any = Object.values(ui.emp.checked).some(Boolean); ui.emp.checked = {}; if (!any) (ui.emp.lastList || db().employees).forEach(e => ui.emp.checked[e.id] = true); render(); break; }
      case 'empset': { const ids = Object.keys(ui.emp.checked).filter(i => ui.emp.checked[i]); if (!ids.length) { toast('Select employees first', '', 'warn'); break; } MM.tx(d => { ids.forEach(i => { d.employees.find(e => e.id === i).status = arg; }); decide('Changed status to ' + arg + ' · ' + ids.length + ' employees', 'Bulk action')(d); }); ui.emp.checked = {}; render(); break; }
      case 'assignloc': { const ids = Object.keys(ui.emp.checked).filter(i => ui.emp.checked[i]); if (!ids.length) { toast('Select employees first', '', 'warn'); break; } openSelect({ title: t('Assign Location'), label: t('Location'), opts: db().sites.map(s => [s.id, MM.nm(s)]) }, v => { MM.tx(d => { ids.forEach(i => { d.employees.find(e => e.id === i).siteId = v; }); decide('Assigned ' + ids.length + ' employees to ' + MM.siteById(v).name, 'Bulk geofence mapping')(d); }); ui.emp.checked = {}; toast(t('Assign Location'), ids.length + ' employees', 'ok'); }); break; }
      case 'assignrole': { const ids = Object.keys(ui.emp.checked).filter(i => ui.emp.checked[i]); if (!ids.length) { toast('Select employees first', '', 'warn'); break; } openSelect({ title: t('Assign Role'), label: t('Role'), opts: ['Field Inspector', 'Inspector', 'Supervisor', 'Technician', 'Operator', 'Coordinator'].map(x => [x, x]) }, v => { MM.tx(d => { ids.forEach(i => { d.employees.find(e => e.id === i).role = v; }); decide('Assigned role ' + v + ' · ' + ids.length + ' employees', 'Bulk action')(d); }); ui.emp.checked = {}; }); break; }
      case 'empexport': MM.download('MM-employees-' + MM.ymd(MM.now()) + '.csv', MM.toCSV(reportRows('employees')), 'text/csv;charset=utf-8'); break;
      case 'addemp': ui.modal = { type: 'addemp' }; render(); break;
      case 'doaddemp': { const g = id => document.getElementById(id).value; const nmv = g('aeName'); let nid; MM.tx(d => { nid = '1' + String(300 + d.employees.length).padStart(5, '0'); const site = MM.siteById(g('aeSite')) || d.sites[0]; d.employees.push({ id: nid, code: 'MM' + nid.slice(1), name: nmv, nameAr: g('aeAr'), role: g('aeRole'), roleAr: g('aeRole'), wilayat: site.wilayat, dept: g('aeDept'), siteId: site.id, device: null, adStatus: 'active', status: 'active', gender: 'M', email: nmv.toLowerCase().replace(/ al /, '.').replace(/ /g, '.') + '@muscat.gov.om', phone: '+968 9' + nid.slice(2), joined: MM.fmtDate(MM.now()), dob: '—', field: g('aeField') === '1' }); MM.addActivity(d, { title: 'New employee added', sub: nmv, kind: 'employee' }); decide('Added employee · ' + nmv, 'Portal')(d); }); ui.modal = null; ui.emp.sel = nid; render(); toast(t('Add Employee'), nmv, 'ok'); break; }
      case 'resetdev': openConfirm({ title: t('Reset device'), body: 'The registered phone for <b>' + esc(emp(arg).name) + '</b> will be released. The next phone this employee signs in on becomes their registered device.', btn: t('Reset device') }, () => { MM.tx(d => { const e = d.employees.find(x => x.id === arg); const old = e.device; e.device = null; decide('Reset registered device · ' + e.name, 'Old device ' + old + ' released')(d); }); toast(t('Reset device'), emp(arg).name, 'ok'); }); break;
      case 'adtoggle': MM.tx(d => { const e = d.employees.find(x => x.id === arg); e.adStatus = e.adStatus === 'blocked' ? 'active' : 'blocked'; decide((e.adStatus === 'blocked' ? 'Blocked (AD leaver) · ' : 'Unblocked · ') + e.name, 'Active Directory sync')(d); }); break;
      case 'shtab': ui.sh.tab = arg; render(); break;
      case 'shtpl': ui.sh.tpl = arg; render(); break;
      case 'week': ui.sh.week = arg === '0' ? 0 : ui.sh.week + +arg; render(); break;
      case 'cell': ui.modal = { type: 'cell', emp: el.dataset.emp, day: +el.dataset.day }; render(); break;
      case 'setcell': setCell(ui.modal.emp, ui.modal.day, arg); ui.modal = null; render(); break;
      case 'publish': { const ws = weekStartMs(); const k = MM.weekKey(ws); MM.tx(d => { if (!d.roster[k]) d.roster[k] = { rows: MM.rosterFor(d, ws).rows }; d.roster[k].published = true; d.roster[k].publishedAt = MM.now(); Object.keys(d.roster[k].rows).forEach(id => MM.notify(d, id, 'Your roster for the week of ' + MM.fmtDate(ws) + ' is published', 'تم نشر جدول ورديات أسبوع ' + MM.fmtDate(ws), 'info')); MM.addActivity(d, { title: 'Roster published', sub: 'Week of ' + MM.fmtDate(ws), kind: 'shift' }); decide('Published roster · week of ' + MM.fmtDate(ws), '')(d); }); toast(t('Publish Roster'), 'Push notification sent to ' + Object.keys(MM.rosterFor(db(), ws).rows).length + ' employees', 'ok'); break; }
      case 'notifyteam': MM.tx(d => Object.keys(MM.rosterFor(d, weekStartMs()).rows).forEach(id => MM.notify(d, id, 'Reminder from ' + user().name + ': please check your roster for this week.', 'تذكير: يرجى مراجعة جدول ورديات هذا الأسبوع', 'info'))); toast(t('Notify Team'), t('Sent to phone'), 'ok'); break;
      case 'rosterdl': exportReport('roster', 'xls'); break;
      case 'importsched': toast(t('Import Schedule'), 'Upload an Excel roster template (available in the full product)', 'info'); break;
      case 'rulesedit': ui.sh.editRules = true; render(); break;
      case 'rulescancel': ui.sh.editRules = false; render(); break;
      case 'rulessave': { const vals = {}; document.querySelectorAll('[data-rule]').forEach(i => vals[i.dataset.rule] = +i.value); MM.tx(d => { Object.assign(d.rules, vals); decide('Changed attendance rules', JSON.stringify(vals))(d); }); ui.sh.editRules = false; render(); break; }
      case 'lock': {
        const [kk, to] = arg.split(':'); const [y, m] = kk.split('-').map(Number); const mn = MM.monthName(m - 1, y);
        const doIt = () => { MM.tx(d => { d.locks[kk] = to; decide((to === 'open' ? 'Re-opened ' : to === 'payroll' ? 'Exported to Oracle Payroll & locked permanently ' : 'Applied ' + to + ' lock ') + mn, to === 'payroll' ? 'Batch Element Entry (BEE)' : '')(d); if (to === 'payroll') { const x = d.integrations.find(i => i.key === 'payroll'); x.last = MM.now(); x.msg = 'Sent'; } }); toast(mn, to, 'ok'); };
        if (to === 'payroll') openConfirm({ title: t('Export to Oracle Payroll'), body: 'Approved attendance and overtime for <b>' + mn + '</b> will be sent to Oracle Payroll. After this the period is locked <b>permanently</b>.', btn: t('Export to Oracle Payroll') }, doIt); else doIt();
        break;
      }
      case 'geosel': ui.geo.sel = arg; ui.geo.draft = null; ui.geo.q = ''; ui.geo.open = false; render(); break;
      case 'gsrpick': geoSearchPick(+arg); break;
      case 'gsrclear': ui.geo.q = ''; ui.geo.found = []; ui.geo.open = false; render(); { const q = document.getElementById('gsrq'); if (q) q.focus(); } break;
      case 'gshape': { const d = draft(); if (d.shape === arg) break; if (arg === 'circle') { const c = MM.centroid(d.polygon); d.center = c; d.radius = Math.round(Math.max(...d.polygon.map(p => MM.haversine(p, c)))); } else { const c = d.center, r = d.radius; d.polygon = Array.from({ length: 8 }, (_, k) => MM.fromXY(r * Math.cos(Math.PI * 2 * k / 8), r * Math.sin(Math.PI * 2 * k / 8), c)); } d.shape = arg; render(); break; }
      case 'gdel': draft().depts = draft().depts.filter(x => x !== arg); render(); break;
      case 'gcancel': ui.geo.draft = null; render(); break;
      case 'gsave': { const d = draft(); const clean = MM.clone(d); MM.tx(db0 => { const i = db0.sites.findIndex(s => s.id === d.id); if (clean.shape === 'polygon') delete clean.center; db0.sites[i] = clean; decide('Updated geofence · ' + clean.name, (clean.shape === 'circle' ? 'Circle ' + clean.radius + ' m' : 'Polygon ' + clean.polygon.length + ' points') + ', buffer ' + clean.buffer + ' m')(db0); }); ui.geo.draft = null; render(); toast(t('Geofence saved – phones use it immediately'), d.name, 'ok'); break; }
      case 'newgeo': { const id = MM.uid('site-'); MM.tx(d => d.sites.push({ id, name: 'New site', nameAr: 'موقع جديد', shape: 'circle', center: { lat: 23.5985, lng: 58.5440 }, radius: 100, buffer: 20, minAcc: 20, valid: 'temporary', until: '30 Nov', depts: [], staff: 0, parcel: 'MANUAL', wilayat: 'Muttrah' })); ui.geo.sel = id; ui.geo.draft = null; render(); break; }
      case 'geohere': {
        if (!navigator.geolocation) { toast(t('Location not available'), 'This browser has no GPS access', 'warn'); break; }
        toast(t('Finding your location…'), '', 'info');
        navigator.geolocation.getCurrentPosition(g => {
          const d = draft(), here = { lat: g.coords.latitude, lng: g.coords.longitude };
          if (d.shape === 'circle') d.center = here; else { const c = MM.centroid(d.polygon); d.polygon = d.polygon.map(p => ({ lat: p.lat + here.lat - c.lat, lng: p.lng + here.lng - c.lng })); }
          const M = Maps.geo; if (M && M.map) M.map.setView([here.lat, here.lng], 17);
          render(); toast(t('Geofence moved to your location'), 'Accuracy ±' + Math.round(g.coords.accuracy) + ' m · press Save to apply it to phones', 'ok');
        }, e => toast(t('Location not available'), e.code === 1 ? 'Allow location access for this page in the browser' : 'Could not get a GPS fix', 'warn'), { enableHighAccuracy: true, timeout: 15000 });
        break;
      }
      case 'arcgis': { ui.modal = { type: 'arcgis', step: 0 }; render(); const tick = () => { if (!ui.modal || ui.modal.type !== 'arcgis') return; ui.modal.step++; if (ui.modal.step >= 5) { MM.tx(d => { const x = d.integrations.find(i => i.key === 'arcgis'); x.last = MM.now(); x.msg = d.sites.length + ' sites'; d.syncLog.unshift({ id: MM.uid('SL'), time: MM.now(), device: 'server', empId: '', type: 'ArcGIS parcel import', rows: d.sites.length, result: 'ok' }); }); render(); return; } render(); setTimeout(tick, 700); }; setTimeout(tick, 700); break; }
      case 'rexp': { const [kk, f] = arg.split(':'); exportReport(kk, f); break; }
      case 'admtab': ui.adm.tab = arg; render(); break;
      case 'runint': runIntegration(arg); break;
    }
  });

  document.addEventListener('change', ev => {
    const el = ev.target;
    if (el.dataset.f === 'tk.date') { if (el.value) { const [y, m, d] = el.value.split('-').map(Number); const v = new Date(y, m - 1, d).getTime(), tdy = MM.dayStart(); ui.tk.date = v === tdy ? null : Math.max(tdy - TK_PAST * 864e5, Math.min(tdy + TK_AHEAD * 864e5, v)); ui.tk.page = 1; ui.tk.checked = {}; } render(); return; }
    if (el.dataset.f === 'att.date') { if (el.value) { const [y, m, d] = el.value.split('-').map(Number); ui.att.date = new Date(y, m - 1, d).getTime(); ui.att.page = 1; } render(); return; }
    if (el.dataset.tkcheck) { ui.tk.checked[el.dataset.tkcheck] = el.checked; render(); return; }
    if (el.dataset.empcheck) { ui.emp.checked[el.dataset.empcheck] = el.checked; render(); return; }
    if (el.dataset.f) {
      if (el.dataset.f.startsWith('add.')) { const f = addState(); const k = el.dataset.f.slice(4); if (k === 'siteId') { if (el.value !== 'gps') { f.siteId = el.value; f.pos = null; f.acc = 8; } } else { f[k] = el.value; if (k === 'empId') { f.siteId = emp(el.value).siteId; f.pos = null; } } render(); return; }
      if (el.tagName === 'SELECT') { setF(el.dataset.f, el.value); render(); }
      return;
    }
    if (el.dataset.g) { const d = draft(); const k = el.dataset.g; if (k === 'adddept') { if (el.value) d.depts.push(el.value); } else if (k === 'name') d.name = el.value; else if (k === 'valid') { d.valid = el.value; if (el.value === 'temporary' && !d.until) d.until = '30 Nov'; } else d[k] = Math.max(0, +el.value || 0); render(); return; }
    if (el.dataset.tile) { MM.tx(d => { const x = d.tiles.find(z => z.key === el.dataset.tile); x.on = el.checked; decide((x.on ? 'Enabled' : 'Disabled') + ' mobile service · ' + x.label, 'Server-driven home screen')(d); }); return; }
    if (el.dataset.sched) { MM.tx(d => { d.settings.sched = d.settings.sched || {}; d.settings.sched[el.dataset.sched] = el.checked; }); return; }
    if (el.id === 'addphoto' && el.files[0]) { const rd = new FileReader(); rd.onload = () => { addState().photo = rd.result; render(); }; rd.readAsDataURL(el.files[0]); return; }
    if (el.dataset.taskphoto && el.files[0]) {
      const id = el.dataset.taskphoto; const img = new Image();
      img.onload = () => { const c = document.createElement('canvas'); const sc = Math.min(1, 640 / img.width); c.width = img.width * sc; c.height = img.height * sc; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); const src = c.toDataURL('image/jpeg', .6); MM.tx(d => { const x = d.tasks.find(z => z.id === id); x.photos.push({ id: MM.uid('PH'), time: MM.now(), lat: x.lat, lng: x.lng, src, by: user().name }); }); toast(t('Add Photo'), id, 'ok'); };
      img.src = URL.createObjectURL(el.files[0]);
    }
  });
  document.addEventListener('input', ev => {
    const el = ev.target;
    // Add Employee: the Arabic name follows the English name as it is typed, until the Arabic field is edited by hand
    if (el.id === 'aeName') { const a = document.getElementById('aeAr'); if (a && !a.dataset.manual) a.value = MM.toArabicName(el.value); return; }
    if (el.id === 'aeAr') { el.dataset.manual = el.value.trim() ? '1' : ''; const h = document.getElementById('aeArHint'); if (h) h.textContent = el.dataset.manual ? '· ' + t('edited by hand') : '· ' + t('filled in automatically'); return; }
    if (el.id === 'gsrq') { geoSearch(el.value); return; }
    if (el.id === 'raQ' && ui.modal) { ui.modal.q = el.value; const q = el.value.trim().toLowerCase(); let n = 0; document.querySelectorAll('#raList .ra-row').forEach(b => { const ok = !q || b.dataset.q.includes(q); b.hidden = !ok; if (ok) n++; }); const none = document.getElementById('raNone'); if (none) none.hidden = n > 0; return; }
    if ((el.id === 'raSt' || el.id === 'raEn') && ui.modal) { ui.modal[el.id === 'raSt' ? 'st' : 'en'] = el.value; return; }
    if (el.id === 'srch') { ui.search = el.value; const pos = el.selectionStart; render(); const s = document.getElementById('srch'); if (s) { s.focus(); s.setSelectionRange(pos, pos); } return; }
    if (el.dataset.f && el.tagName === 'INPUT' && el.type === 'text' || (el.dataset.f && el.tagName === 'INPUT' && !el.type)) { }
    if (el.dataset.f && el.tagName === 'INPUT' && !['date', 'time'].includes(el.type) && !el.dataset.f.startsWith('add.')) { setF(el.dataset.f, el.value); const pos = el.selectionStart, f = el.dataset.f; render(); const n = document.querySelector('[data-f="' + f + '"]'); if (n) { n.focus(); n.setSelectionRange(pos, pos); } }
    else if (el.dataset.f === 'add.notes') addState().notes = el.value;
  });
  document.addEventListener('focusout', () => setTimeout(() => { if (pending) scheduleRender(); }, 0));
  document.addEventListener('keydown', ev => {
    if (ev.target.id === 'gsrq') { if (ev.key === 'Enter' && (ui.geo.found || []).length) { ev.preventDefault(); geoSearchPick(0); return; } if (ev.key === 'Escape') { ui.geo.open = false; geoSearchPaint(); return; } }
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') { const s = document.getElementById('srch'); if (s) { ev.preventDefault(); s.focus(); } }
    if (ev.key === 'Escape' && (ui.modal || ui.menu)) { ui.modal = null; ui.menu = null; render(); }
  });
  document.addEventListener('dragstart', ev => { const c = ev.target.closest && ev.target.closest('[data-code]'); if (c) { ev.dataTransfer.setData('text/plain', c.dataset.code); ev.dataTransfer.effectAllowed = 'copy'; } });
  document.addEventListener('dragover', ev => { const c = ev.target.closest && ev.target.closest('.rc[data-emp]'); if (c) { ev.preventDefault(); c.classList.add('over'); } });
  document.addEventListener('dragleave', ev => { const c = ev.target.closest && ev.target.closest('.rc[data-emp]'); if (c) c.classList.remove('over'); });
  document.addEventListener('drop', ev => { const c = ev.target.closest && ev.target.closest('.rc[data-emp]'); if (!c) return; ev.preventDefault(); const code = ev.dataTransfer.getData('text/plain'); if (code) setCell(c.dataset.emp, +c.dataset.day, code); });
  window.addEventListener('hashchange', () => { const h = location.hash.slice(1), p = hashPage(); if (h === 'sync' || h === 'users') ui.adm.tab = 'users'; if (h === 'audit') ui.ap.tab = 'audit'; if (p !== ui.page || h === 'sync' || h === 'users' || h === 'audit') { ui.page = p; render(); } });

  /* ---------------- live updates from phones ---------------- */
  let known = null;
  function diffAndNotify() {
    const d = db();
    const snap = { req: new Set(d.requests.map(r => r.id + r.status)), aud: new Set(d.audit.map(a => a.id)), act: new Set(d.activity.map(a => a.id)), tk: {}, notif: new Set(d.notifications.map(n => n.id)), sl: new Set(d.syncLog.map(s => s.id)), p: new Set(d.punches.map(p => p.id)) };
    d.tasks.forEach(x => snap.tk[x.id] = x.status + x.photos.length);
    if (known) {
      d.requests.forEach(r => { if (!known.req.has(r.id + r.status)) ui.flash[r.id] = 1; });
      d.audit.forEach(a => { if (!known.aud.has(a.id)) ui.flash[a.id] = 1; });
      d.activity.forEach(a => { if (!known.act.has(a.id)) ui.flash[a.id] = 1; });
      d.syncLog.forEach(s => { if (!known.sl.has(s.id)) ui.flash[s.id] = 1; });
      d.punches.forEach(p => { if (known.p.has(p.id)) return; ui.flash[p.id] = 1; const e = emp(p.empId); if (ui.session && e && p.device && p.status === 'accepted') toast((AR() ? 'تحديث مباشر' : 'Live') + ' · ' + nameOf(e) + ' ' + (p.type === 'IN' ? (AR() ? 'سجّل الحضور' : 'checked in') : (AR() ? 'سجّل الانصراف' : 'checked out')), ampm(p.time) + ' · ' + MM.nm(MM.siteById(p.siteId)) + (p.photo ? ' · ' + (AR() ? 'مع صورة' : 'photo attached') : '') + (p.late ? ' · late ' + p.late + ' min' : ''), 'ok'); });
      d.tasks.forEach(x => { if (known.tk[x.id] !== snap.tk[x.id]) ui.flash[x.id] = 1; });
      if (ui.session) d.notifications.forEach(n => { if (!known.notif.has(n.id) && n.to === 'supervisor') toast(n.kind === 'fraud' ? (AR() ? 'تنبيه أمني' : 'Security alert') : (AR() ? 'تحديث مباشر' : 'Live update'), n.text, n.kind === 'fraud' ? 'bad' : 'info'); });
    }
    known = snap;
  }

  MMB.onload = () => { if (MM.db()) render(); };
  MM.init({ app: 'p' }).then(() => {
    MM.setLang('p', MM.lang);
    diffAndNotify(); render();
    MM.onChange(() => { diffAndNotify(); scheduleRender(); });
    setInterval(() => {
      document.querySelectorAll('[data-clock]').forEach(el => { el.textContent = MM.fmtTimeS(MM.now()); });
      document.querySelectorAll('[data-clock-ampm]').forEach(el => { el.textContent = ampm(MM.now()); });
      document.querySelectorAll('[data-sla]').forEach(el => { const x = db().tasks.find(z => z.id === el.dataset.sla); if (x) el.textContent = sla(x); });
    }, 1000);
  });
})();
