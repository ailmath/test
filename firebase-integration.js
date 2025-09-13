// ===========================================
// تحسين تكامل Firebase مع الكود الموجود
// ===========================================

// انتظار تحميل Firebase config
let integrationReady = false;

// ===========================================
// وظائف تحسين التكامل مع الوظائف الموجودة
// ===========================================

// تحسين وظائف الحفظ للعمل مع Firebase
function enhanceExistingFunctions() {
  // قائمة الوظائف التي نريد تحسينها
  const functionsToEnhance = [
    'uploadWorksheet',
    'uploadWeeklyPlan', 
    'uploadPhotoAchievement',
    'saveReminder',
    'saveStudent',
    'finishExam',
    'deleteExam',
    'deleteStudent',
    'deleteWorksheet',
    'deleteWeeklyPlan',
    'deletePhotoAchievement',
    'deleteAchievementFile',
    'deleteReminder'
  ];

  functionsToEnhance.forEach(funcName => {
    if (window[funcName] && typeof window[funcName] === 'function') {
      const originalFunction = window[funcName];
      
      window[funcName] = function() {
        // تنفيذ الوظيفة الأصلية
        const result = originalFunction.apply(this, arguments);
        
        // مزامنة فورية مع Firebase
        if (window.isFirebaseConnected && window.isFirebaseConnected()) {
          setTimeout(() => {
            window.syncAllDataToFirebase();
            console.log(`🔥 تم مزامنة البيانات بعد تنفيذ ${funcName}`);
          }, 500);
        }
        
        return result;
      };
      
      console.log(`✅ تم تحسين وظيفة ${funcName} للعمل مع Firebase`);
    }
  });
}

// مراقبة تغييرات البيانات المهمة
function watchDataChanges() {
  const dataKeys = [
    'exams', 'students', 'worksheets', 'weeklyPlans', 
    'photoAchievements', 'achievementFiles', 'reminders',
    'studentErrors', 'examHistory', 'studentTracking', 'studentUploadCounts'
  ];

  // حفظ القيم الحالية
  const currentValues = {};
  dataKeys.forEach(key => {
    currentValues[key] = JSON.stringify(window[key] || null);
  });

  // مراقبة التغييرات كل 3 ثواني
  setInterval(() => {
    if (!window.isFirebaseConnected || !window.isFirebaseConnected()) return;

    let hasChanges = false;
    dataKeys.forEach(key => {
      const newValue = JSON.stringify(window[key] || null);
      if (currentValues[key] !== newValue) {
        currentValues[key] = newValue;
        hasChanges = true;
      }
    });

    // إذا كان هناك تغييرات، قم بالمزامنة
    if (hasChanges) {
      window.syncAllDataToFirebase();
      console.log('🔄 تم اكتشاف تغييرات وتم بدء المزامنة التلقائية');
    }
  }, 3000);
}

// تحسين عملية تحميل البيانات
function enhanceDataLoading() {
  // تحسين وظائف التحميل
  const loadFunctions = [
    'loadExams', 'loadStudents', 'loadWorksheets', 'loadWeeklyPlans',
    'loadPhotoAchievements', 'loadAchievementFiles', 'loadReminders'
  ];

  loadFunctions.forEach(funcName => {
    if (window[funcName] && typeof window[funcName] === 'function') {
      const originalFunction = window[funcName];
      
      window[funcName] = function() {
        // تنفيذ الوظيفة الأصلية
        const result = originalFunction.apply(this, arguments);
        
        // تحديث الإحصائيات
        if (typeof updateStats === 'function') {
          updateStats();
        }
        
        return result;
      };
    }
  });
}

// إضافة أزرار Firebase للمعلم
function addFirebaseControls() {
  // انتظار ظهور أزرار المعلم
  const checkForAdminControls = setInterval(() => {
    const adminControls = document.querySelectorAll('.admin-controls');
    
    if (adminControls.length > 0 && window.isAdmin) {
      adminControls.forEach(controlPanel => {
        // تحقق من عدم وجود زر Firebase مسبقاً
        if (!controlPanel.querySelector('.firebase-control-btn')) {
          const firebaseBtn = document.createElement('button');
          firebaseBtn.className = 'firebase-control-btn bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center mr-3';
          firebaseBtn.innerHTML = `
            <span class="ml-2">🔥</span>
            قاعدة البيانات
          `;
          firebaseBtn.onclick = () => {
            if (window.showFirebasePanel) {
              window.showFirebasePanel();
            }
          };
          
          // إضافة الزر في بداية لوحة التحكم
          controlPanel.insertBefore(firebaseBtn, controlPanel.firstChild);
        }
      });
      
      clearInterval(checkForAdminControls);
      console.log('🔥 تم إضافة أزرار Firebase لجميع لوحات التحكم');
    }
  }, 1000);

  // توقف عن المحاولة بعد 15 ثانية
  setTimeout(() => clearInterval(checkForAdminControls), 15000);
}

// إضافة مؤشر حالة Firebase محسن
function addEnhancedStatusIndicator() {
  // إضافة أزرار سريعة للمعلم
  if (window.isAdmin) {
    const quickControls = document.createElement('div');
    quickControls.id = 'firebaseQuickControls';
    quickControls.className = 'fixed bottom-4 left-4 space-y-2 z-40';
    quickControls.innerHTML = `
      <div class="bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
        <div class="flex items-center space-x-3 space-x-reverse">
          <div id="quickStatusIndicator" class="w-3 h-3 bg-gray-500 rounded-full animate-pulse"></div>
          <span id="quickStatusText" class="text-sm font-medium text-gray-700">جاري التحميل...</span>
        </div>
        
        <div class="flex space-x-2 space-x-reverse mt-3">
          <button onclick="window.syncAllDataToFirebase()" 
                  class="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  title="مزامنة فورية">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          
          <button onclick="window.createBackup()" 
                  class="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  title="نسخة احتياطية">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </button>
          
          <button onclick="window.showFirebasePanel()" 
                  class="bg-purple-500 hover:bg-purple-600 text-white p-2 rounded-lg transition-all duration-300 transform hover:scale-105"
                  title="لوحة التحكم">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(quickControls);
  }
}

// تحديث مؤشرات الحالة
function updateStatusIndicators() {
  const indicators = [
    { id: 'statusIndicator', textId: 'statusText' },
    { id: 'quickStatusIndicator', textId: 'quickStatusText' }
  ];

  indicators.forEach(({ id, textId }) => {
    const indicator = document.getElementById(id);
    const text = document.getElementById(textId);
    
    if (indicator && text) {
      if (window.isFirebaseConnected && window.isFirebaseConnected()) {
        indicator.className = 'w-3 h-3 bg-green-500 rounded-full animate-pulse';
        text.textContent = 'متصل';
      } else {
        indicator.className = 'w-3 h-3 bg-red-500 rounded-full';
        text.textContent = 'غير متصل';
      }
    }
  });
}

// مراقبة حالة الاتصال وتحديث المؤشرات
function monitorConnectionStatus() {
  setInterval(() => {
    updateStatusIndicators();
  }, 2000);
}

// تحسين عملية المزامنة التلقائية
function enhanceAutoSync() {
  let lastSyncTime = 0;
  const SYNC_INTERVAL = 30000; // 30 ثانية

  setInterval(() => {
    if (window.isFirebaseConnected && window.isFirebaseConnected()) {
      const now = Date.now();
      if (now - lastSyncTime >= SYNC_INTERVAL) {
        window.syncAllDataToFirebase();
        lastSyncTime = now;
        console.log('🔄 مزامنة تلقائية مجدولة');
      }
    }
  }, SYNC_INTERVAL);
}

// إضافة إشعارات محسنة للمزامنة
function addSyncNotifications() {
  // مراقبة عمليات المزامنة
  const originalSyncFunction = window.syncAllDataToFirebase;
  
  if (originalSyncFunction) {
    window.syncAllDataToFirebase = async function() {
      try {
        // إظهار إشعار بدء المزامنة
        showSyncNotification('جاري المزامنة...', 'info');
        
        // تنفيذ المزامنة
        await originalSyncFunction.apply(this, arguments);
        
        // إظهار إشعار نجاح المزامنة
        showSyncNotification('تم حفظ البيانات بنجاح', 'success');
      } catch (error) {
        // إظهار إشعار خطأ
        showSyncNotification('خطأ في حفظ البيانات', 'error');
        console.error('خطأ في المزامنة:', error);
      }
    };
  }
}

// إشعارات مزامنة مبسطة
function showSyncNotification(message, type) {
  // إزالة الإشعارات السابقة
  const existingNotifications = document.querySelectorAll('.sync-notification');
  existingNotifications.forEach(notification => notification.remove());

  const notification = document.createElement('div');
  notification.className = 'sync-notification fixed top-4 right-4 z-50 p-3 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full';
  
  const colors = {
    success: 'bg-green-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
    warning: 'bg-yellow-500 text-white'
  };
  
  notification.className += ` ${colors[type] || colors.info}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // إظهار الإشعار
  setTimeout(() => notification.classList.remove('translate-x-full'), 100);
  
  // إخفاء الإشعار
  setTimeout(() => {
    notification.classList.add('translate-x-full');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 2000);
}

// ===========================================
// تهيئة التكامل المحسن
// ===========================================

function initializeEnhancedIntegration() {
  console.log('🔥 بدء تهيئة التكامل المحسن مع Firebase...');
  
  // انتظار تحميل Firebase
  const waitForFirebase = setInterval(() => {
    if (window.isFirebaseConnected) {
      clearInterval(waitForFirebase);
      
      // تحسين الوظائف الموجودة
      enhanceExistingFunctions();
      
      // تحسين عملية تحميل البيانات
      enhanceDataLoading();
      
      // بدء مراقبة التغييرات
      watchDataChanges();
      
      // إضافة أزرار Firebase
      addFirebaseControls();
      
      // إضافة مؤشر الحالة المحسن
      addEnhancedStatusIndicator();
      
      // مراقبة حالة الاتصال
      monitorConnectionStatus();
      
      // تحسين المزامنة التلقائية
      enhanceAutoSync();
      
      // إضافة إشعارات المزامنة
      addSyncNotifications();
      
      integrationReady = true;
      console.log('✅ تم تفعيل التكامل المحسن مع Firebase بنجاح');
    }
  }, 1000);
  
  // توقف عن المحاولة بعد 30 ثانية
  setTimeout(() => {
    clearInterval(waitForFirebase);
    if (!integrationReady) {
      console.warn('⚠️ انتهت مهلة انتظار Firebase');
    }
  }, 30000);
}

// بدء التهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
  // انتظار تحميل الكود الأساسي
  setTimeout(initializeEnhancedIntegration, 3000);
});

// ===========================================
// وظائف مساعدة إضافية
// ===========================================

// فحص سلامة البيانات
function checkDataIntegrity() {
  const dataKeys = ['exams', 'students', 'worksheets', 'weeklyPlans', 'photoAchievements', 'achievementFiles', 'reminders'];
  const report = {};
  
  dataKeys.forEach(key => {
    const data = window[key];
    report[key] = {
      exists: !!data,
      type: Array.isArray(data) ? 'array' : typeof data,
      count: Array.isArray(data) ? data.length : (data && typeof data === 'object' ? Object.keys(data).length : 0)
    };
  });
  
  console.table(report);
  return report;
}

// تصدير سريع للبيانات
function quickExportData() {
  const data = {
    exams: window.exams || [],
    students: window.students || {},
    worksheets: window.worksheets || [],
    weeklyPlans: window.weeklyPlans || [],
    photoAchievements: window.photoAchievements || [],
    achievementFiles: window.achievementFiles || [],
    reminders: window.reminders || [],
    exportDate: new Date().toISOString()
  };
  
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  showSyncNotification('تم تصدير البيانات بنجاح', 'success');
}

// إضافة الوظائف للنافذة العامة
window.checkDataIntegrity = checkDataIntegrity;
window.quickExportData = quickExportData;

// ===========================================
// معالجة الأخطاء المحسنة
// ===========================================

// معالج الأخطاء العام
window.addEventListener('error', function(event) {
  console.error('خطأ في التطبيق:', event.error);
  
  // إذا كان الخطأ متعلق بـ Firebase
  if (event.error && event.error.message && event.error.message.includes('Firebase')) {
    showSyncNotification('خطأ في الاتصال بقاعدة البيانات', 'error');
  }
});

// معالج الأخطاء غير المعالجة
window.addEventListener('unhandledrejection', function(event) {
  console.error('خطأ غير معالج:', event.reason);
  
  // إذا كان الخطأ متعلق بـ Firebase
  if (event.reason && event.reason.message && event.reason.message.includes('Firebase')) {
    showSyncNotification('خطأ في عملية قاعدة البيانات', 'error');
  }
});

console.log('🔥 Firebase Enhanced Integration Loaded - تم تحميل التكامل المحسن مع Firebase');
}

// تحديث وظيفة saveReminder لتستخدم Firebase
function updateSaveReminder() {
  if (window.saveReminder) {
    const originalSaveReminder = window.saveReminder;

    window.saveReminder = function () {
      const result = originalSaveReminder.apply(this, arguments);

      if (window.isFirebaseConnected && window.isFirebaseConnected()) {
        setTimeout(() => {
          window.database.ref("reminders").set(window.reminders);
          console.log("🔥 تم حفظ التذكيرات في Firebase");
        }, 500);
      }

      return result;
    };
  }
}

// تحديث وظيفة saveStudent لتستخدم Firebase
function updateSaveStudent() {
  if (window.saveStudent) {
    const originalSaveStudent = window.saveStudent;

    window.saveStudent = function () {
      const result = originalSaveStudent.apply(this, arguments);

      if (window.isFirebaseConnected && window.isFirebaseConnected()) {
        setTimeout(() => {
          window.database.ref("students").set(window.students);
          console.log("🔥 تم حفظ الطلاب المتميزين في Firebase");
        }, 500);
      }

      return result;
    };
  }
}

// تحديث وظيفة finishExam لتستخدم Firebase
function updateFinishExam() {
  if (window.finishExam) {
    const originalFinishExam = window.finishExam;

    window.finishExam = function () {
      const result = originalFinishExam.apply(this, arguments);

      if (window.isFirebaseConnected && window.isFirebaseConnected()) {
        setTimeout(() => {
          window.database.ref("examHistory").set(window.examHistory);
          window.database.ref("studentErrors").set(window.studentErrors);
          console.log("🔥 تم حفظ نتائج الاختبار في Firebase");
        }, 500);
      }

      return result;
    };
  }
}

// ===========================================
// وظائف مساعدة للتكامل
// ===========================================

// مراقبة تغييرات البيانات وحفظها في Firebase
function watchDataChanges() {
  // مراقبة تغييرات المتغيرات العامة
  const dataWatchers = {
    exams: () => window.exams,
    students: () => window.students,
    worksheets: () => window.worksheets,
    weeklyPlans: () => window.weeklyPlans,
    photoAchievements: () => window.photoAchievements,
    achievementFiles: () => window.achievementFiles,
    reminders: () => window.reminders,
    studentErrors: () => window.studentErrors,
    examHistory: () => window.examHistory,
    studentTracking: () => window.studentTracking,
    studentUploadCounts: () => window.studentUploadCounts,
  };

  // حفظ القيم الحالية
  const currentValues = {};
  Object.keys(dataWatchers).forEach((key) => {
    currentValues[key] = JSON.stringify(dataWatchers[key]());
  });

  // مراقبة التغييرات كل ثانيتين
  setInterval(() => {
    if (!window.isFirebaseConnected || !window.isFirebaseConnected()) return;

    Object.keys(dataWatchers).forEach((key) => {
      const newValue = JSON.stringify(dataWatchers[key]());
      if (currentValues[key] !== newValue) {
        currentValues[key] = newValue;

        // حفظ التغيير في Firebase
        window.database
          .ref(key)
          .set(dataWatchers[key]())
          .then(() => {
            console.log(`🔥 تم تحديث ${key} في Firebase تلقائياً`);
          })
          .catch((error) => {
            console.error(`❌ خطأ في تحديث ${key}:`, error);
          });
      }
    });
  }, 2000);
}

// إضافة زر Firebase للمعلم
function addFirebaseButton() {
  // انتظار تحميل واجهة المعلم
  const checkForAdminUI = setInterval(() => {
    const adminPanel = document.getElementById("adminPanelBtn");

    if (
      adminPanel &&
      !adminPanel.classList.contains("hidden") &&
      window.isAdmin
    ) {
      // إضافة زر إدارة Firebase
      const firebaseBtn = document.createElement("button");
      firebaseBtn.onclick = () => window.showFirebasePanel();
      firebaseBtn.className =
        "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center mr-3";
      firebaseBtn.innerHTML = `
          <span class="ml-2">🔥</span>
          قاعدة البيانات
        `;

      // إضافة الزر بجانب زر لوحة التحكم
      adminPanel.parentNode.insertBefore(firebaseBtn, adminPanel.nextSibling);

      clearInterval(checkForAdminUI);
      console.log("🔥 تم إضافة زر إدارة Firebase");
    }
  }, 1000);

  // توقف عن المحاولة بعد 10 ثواني
  setTimeout(() => clearInterval(checkForAdminUI), 10000);
}

// ===========================================
// تهيئة التكامل
// ===========================================

// تهيئة التكامل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  // انتظار تحميل الكود الأصلي
  setTimeout(() => {
    updateStorageFunctions();
    updateGetStorageFunctions();

    // تحديث الوظائف الموجودة
    setTimeout(() => {
      updateUploadWorksheet();
      updateUploadWeeklyPlan();
      updateUploadPhotoAchievement();
      updateSaveReminder();
      updateSaveStudent();
      updateFinishExam();

      // بدء مراقبة التغييرات
      watchDataChanges();

      // إضافة زر Firebase
      addFirebaseButton();

      console.log("🔥 تم تفعيل تكامل Firebase مع جميع وظائف الموقع");
    }, 2000);
  }, 1000);
});

// ===========================================
// وظائف خاصة للنسخ الاحتياطي السريع
// ===========================================

// نسخة احتياطية سريعة من localStorage إلى Firebase
window.quickBackupToFirebase = async function () {
  if (!window.isAdmin) {
    alert("هذه الميزة متاحة للمعلم فقط");
    return;
  }

  if (!window.isFirebaseConnected || !window.isFirebaseConnected()) {
    alert("Firebase غير متصل");
    return;
  }

  try {
    console.log("📤 بدء النسخ الاحتياطي السريع...");

    const backupData = {
      exams: JSON.parse(localStorage.getItem("exams") || "[]"),
      students: JSON.parse(localStorage.getItem("students") || "{}"),
      worksheets: JSON.parse(localStorage.getItem("worksheets") || "[]"),
      weeklyPlans: JSON.parse(localStorage.getItem("weeklyPlans") || "[]"),
      photoAchievements: JSON.parse(
        localStorage.getItem("photoAchievements") || "[]"
      ),
      achievementFiles: JSON.parse(
        localStorage.getItem("achievementFiles") || "[]"
      ),
      reminders: JSON.parse(localStorage.getItem("reminders") || "[]"),
      studentErrors: JSON.parse(localStorage.getItem("studentErrors") || "{}"),
      examHistory: JSON.parse(localStorage.getItem("examHistory") || "[]"),
      studentTracking: JSON.parse(
        localStorage.getItem("studentTracking") || "{}"
      ),
      studentUploadCounts: JSON.parse(
        localStorage.getItem("studentUploadCounts") || "{}"
      ),
      timestamp: new Date().toISOString(),
    };

    // حفظ البيانات
    await Promise.all([
      window.database.ref("exams").set(backupData.exams),
      window.database.ref("students").set(backupData.students),
      window.database.ref("worksheets").set(backupData.worksheets),
      window.database.ref("weeklyPlans").set(backupData.weeklyPlans),
      window.database
        .ref("photoAchievements")
        .set(backupData.photoAchievements),
      window.database.ref("achievementFiles").set(backupData.achievementFiles),
      window.database.ref("reminders").set(backupData.reminders),
      window.database.ref("studentErrors").set(backupData.studentErrors),
      window.database.ref("examHistory").set(backupData.examHistory),
      window.database.ref("studentTracking").set(backupData.studentTracking),
      window.database
        .ref("studentUploadCounts")
        .set(backupData.studentUploadCounts),
    ]);

    // حفظ نسخة احتياطية بالتاريخ
    await window.database.ref(`backups/${Date.now()}`).set(backupData);

    alert("✅ تم حفظ جميع البيانات في Firebase بنجاح!");
    console.log("✅ تم إكمال النسخ الاحتياطي السريع");
  } catch (error) {
    console.error("❌ خطأ في النسخ الاحتياطي:", error);
    alert("❌ حدث خطأ في حفظ البيانات");
  }
};

// استرجاع سريع من Firebase إلى localStorage
window.quickRestoreFromFirebase = async function () {
  if (!window.isAdmin) {
    alert("هذه الميزة متاحة للمعلم فقط");
    return;
  }

  if (!window.isFirebaseConnected || !window.isFirebaseConnected()) {
    alert("Firebase غير متصل");
    return;
  }

  if (
    !confirm(
      "هل تريد استرجاع البيانات من Firebase؟ سيتم استبدال البيانات المحلية."
    )
  ) {
    return;
  }

  try {
    console.log("📥 بدء الاسترجاع السريع...");

    // تحميل البيانات من Firebase
    const [
      exams,
      students,
      worksheets,
      weeklyPlans,
      photoAchievements,
      achievementFiles,
      reminders,
      studentErrors,
      examHistory,
      studentTracking,
      studentUploadCounts,
    ] = await Promise.all([
      window.database
        .ref("exams")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("students")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("worksheets")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("weeklyPlans")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("photoAchievements")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("achievementFiles")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("reminders")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("studentErrors")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("examHistory")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("studentTracking")
        .once("value")
        .then((snap) => snap.val()),
      window.database
        .ref("studentUploadCounts")
        .once("value")
        .then((snap) => snap.val()),
    ]);

    // تحديث المتغيرات العامة
    if (exams) window.exams = exams;
    if (students) window.students = students;
    if (worksheets) window.worksheets = worksheets;
    if (weeklyPlans) window.weeklyPlans = weeklyPlans;
    if (photoAchievements) window.photoAchievements = photoAchievements;
    if (achievementFiles) window.achievementFiles = achievementFiles;
    if (reminders) window.reminders = reminders;
    if (studentErrors) window.studentErrors = studentErrors;
    if (examHistory) window.examHistory = examHistory;
    if (studentTracking) window.studentTracking = studentTracking;
    if (studentUploadCounts) window.studentUploadCounts = studentUploadCounts;

    // تحديث localStorage
    const originalSetItem = localStorage.setItem.bind(localStorage);
    originalSetItem("exams", JSON.stringify(window.exams));
    originalSetItem("students", JSON.stringify(window.students));
    originalSetItem("worksheets", JSON.stringify(window.worksheets));
    originalSetItem("weeklyPlans", JSON.stringify(window.weeklyPlans));
    originalSetItem(
      "photoAchievements",
      JSON.stringify(window.photoAchievements)
    );
    originalSetItem(
      "achievementFiles",
      JSON.stringify(window.achievementFiles)
    );
    originalSetItem("reminders", JSON.stringify(window.reminders));
    originalSetItem("studentErrors", JSON.stringify(window.studentErrors));
    originalSetItem("examHistory", JSON.stringify(window.examHistory));
    originalSetItem("studentTracking", JSON.stringify(window.studentTracking));
    originalSetItem(
      "studentUploadCounts",
      JSON.stringify(window.studentUploadCounts)
    );

    // إعادة تحميل الواجهات
    if (typeof loadExams === "function") loadExams();
    if (typeof loadStudents === "function") loadStudents();
    if (typeof loadWorksheets === "function") loadWorksheets();
    if (typeof loadWeeklyPlans === "function") loadWeeklyPlans();
    if (typeof loadPhotoAchievements === "function") loadPhotoAchievements();
    if (typeof loadAchievementFiles === "function") loadAchievementFiles();
    if (typeof loadReminders === "function") loadReminders();
    if (typeof loadLatestReminders === "function") loadLatestReminders();

    alert("✅ تم استرجاع جميع البيانات من Firebase بنجاح!");
    console.log("✅ تم إكمال الاسترجاع السريع");
  } catch (error) {
    console.error("❌ خطأ في الاسترجاع:", error);
    alert("❌ حدث خطأ في استرجاع البيانات");
  }
};

// ===========================================
// تهيئة التكامل
// ===========================================

// بدء التكامل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    updateStorageFunctions();
    updateGetStorageFunctions();

    console.log("🔥 تم تفعيل تكامل Firebase مع الكود الموجود");

    // إضافة أزرار سريعة للاختبار (للمعلم فقط)
    if (window.isAdmin) {
      addQuickFirebaseButtons();
    }
  }, 2000);
});

// إضافة أزرار سريعة للاختبار
function addQuickFirebaseButtons() {
  const quickButtons = document.createElement("div");
  quickButtons.id = "firebaseQuickButtons";
  quickButtons.className = "fixed bottom-4 left-4 space-y-2 z-40";
  quickButtons.innerHTML = `
      <button onclick="window.quickBackupToFirebase()" 
              class="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              title="نسخ احتياطي سريع إلى Firebase">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
        </svg>
      </button>
      
      <button onclick="window.quickRestoreFromFirebase()" 
              class="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
              title="استرجاع سريع من Firebase">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </button>
      
      <div class="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
        <div id="firebaseStatus" class="w-3 h-3 rounded-full ${
          window.isFirebaseConnected && window.isFirebaseConnected()
            ? "bg-green-500 animate-pulse"
            : "bg-red-500"
        }"></div>
      </div>
    `;

  document.body.appendChild(quickButtons);
}

// تحديث حالة Firebase كل 5 ثواني
setInterval(() => {
  const statusIndicator = document.getElementById("firebaseStatus");
  if (statusIndicator) {
    if (window.isFirebaseConnected && window.isFirebaseConnected()) {
      statusIndicator.className =
        "w-3 h-3 rounded-full bg-green-500 animate-pulse";
    } else {
      statusIndicator.className = "w-3 h-3 rounded-full bg-red-500";
    }
  }
}, 5000);

console.log("🔥 Firebase Integration Script Loaded - تم تحميل سكربت Firebase");
