/* ============================================
   EduFlow - dashboard.js
   Main controller: navigation, page rendering, sidebar
   ============================================ */

'use strict';

// ---- Auth guard ----
(function() {
  if (!sessionStorage.getItem('eduflow_user')) {
    // Allow demo access without login for convenience
    sessionStorage.setItem('eduflow_user', JSON.stringify({
      name: 'Admin User', email: 'admin@eduflow.io',
      role: 'Super Administrator', initials: 'AD'
    }));
  }
})();

// ---- Sidebar ----
let sidebarCollapsed = false;

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
  document.getElementById('mainContent').classList.toggle('expanded', sidebarCollapsed);
}

function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('mobile-open');
  document.getElementById('sidebarOverlay').style.display = 'block';
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarOverlay').style.display = 'none';
}

// ---- Navigation ----
const PAGE_TITLES = {
  overview: 'Overview',
  students: 'Students',
  teachers: 'Teachers',
  courses: 'Courses',
  grades: 'Grades',
  attendance: 'Attendance',
  schedule: 'Schedule',
  reports: 'Reports',
  settings: 'Settings'
};

let currentPage = 'overview';

function navigateTo(page) {
  currentPage = page;

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  // Update breadcrumb
  document.getElementById('breadcrumbCurrent').textContent = PAGE_TITLES[page] || page;

  // Update page title
  document.title = `${PAGE_TITLES[page]} — EduFlow`;

  // Close mobile sidebar
  closeMobileSidebar();

  // Render page
  renderPage(page);
}

function renderPage(page) {
  const container = document.getElementById('pageContent');
  container.innerHTML = '';
  container.style.opacity = '0';

  const pageMap = {
    overview: renderOverview,
    students: renderStudents,
    teachers: renderTeachers,
    courses: renderCourses,
    grades: renderGrades,
    attendance: renderAttendance,
    schedule: renderSchedule,
    reports: renderReports,
    settings: renderSettings
  };

  if (pageMap[page]) pageMap[page](container);
  else container.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><div class="empty-title">Coming soon</div><div class="empty-text">This section is under development.</div></div>`;

  setTimeout(() => {
    container.style.transition = 'opacity 0.3s ease';
    container.style.opacity = '1';
  }, 20);
}

// ---- OVERVIEW PAGE ----
function renderOverview(container) {
  container.innerHTML = `
    <div class="welcome-banner animate-slideUp">
      <div class="welcome-text">
        <h2>Good morning, Admin 👋</h2>
        <p>Here's what's happening at your institution today — ${new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
      </div>
      <div class="welcome-actions">
        <button class="btn btn-secondary btn-sm" onclick="navigateTo('reports')">📤 Export report</button>
        <button class="btn btn-primary btn-sm" onclick="openModal('studentModal')">+ Add student</button>
      </div>
    </div>

    <div class="kpi-grid">
      ${kpiCard('purple','🎓','Total Students','2,483','+12%','up','91%')}
      ${kpiCard('blue','👨‍🏫','Teachers','87','+3%','up','78%')}
      ${kpiCard('green','📚','Active Courses','142','+8%','up','65%')}
      ${kpiCard('orange','📅','Attendance Rate','94.2%','-0.8%','down','94%')}
    </div>

    <div class="charts-grid">
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Enrollment Trends</div>
            <div class="chart-subtitle">Monthly student registrations this year</div>
          </div>
          <div class="chart-actions">
            <button class="chart-period-btn active">6M</button>
            <button class="chart-period-btn">1Y</button>
          </div>
        </div>
        <div class="chart-canvas-wrapper">
          <canvas id="enrollmentChart"></canvas>
        </div>
      </div>
      <div class="chart-card">
        <div class="chart-header">
          <div>
            <div class="chart-title">Grade Distribution</div>
            <div class="chart-subtitle">Current semester</div>
          </div>
        </div>
        <div class="chart-canvas-wrapper" style="position:relative;">
          <canvas id="gradeDonutChart"></canvas>
          <div class="donut-center">
            <div class="donut-center-value">3.4</div>
            <div class="donut-center-label">Avg GPA</div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-grid">
      <div class="activity-card">
        <div class="section-head" style="padding:0 0 var(--space-4);border-bottom:1px solid var(--glass-border);margin-bottom:0;">
          <div>
            <div class="section-head-title">Recent Activity</div>
            <div class="section-head-subtitle">Latest actions across the platform</div>
          </div>
        </div>
        <div class="activity-list">
          ${activityItem('🎓','rgba(124,58,237,0.15)','New student enrolled','Emma Clarke added to Computer Science','2 min ago')}
          ${activityItem('📝','rgba(16,185,129,0.15)','Grades published','Prof. Martinez submitted CS301 grades','18 min ago')}
          ${activityItem('📅','rgba(37,99,235,0.15)','Attendance marked','Physics 201 — 28/30 present','45 min ago')}
          ${activityItem('👨‍🏫','rgba(245,158,11,0.15)','New teacher added','Dr. Sarah Park joined the faculty','2h ago')}
          ${activityItem('📚','rgba(6,182,212,0.15)','Course created','Advanced Machine Learning (CS501) added','3h ago')}
          ${activityItem('⚠️','rgba(239,68,68,0.15)','Low attendance alert','Student Jake Donovan below 75%','5h ago')}
        </div>
      </div>
      <div class="quick-stats">
        <div class="section-head" style="padding:0 0 var(--space-4);border-bottom:1px solid var(--glass-border);margin-bottom:0;">
          <div>
            <div class="section-head-title">Top Performers</div>
            <div class="section-head-subtitle">This semester's leaders</div>
          </div>
        </div>
        <div class="performers-list">
          ${performer(1,'Sarah Johnson','CS — Year 3','4.0','#7c3aed',true)}
          ${performer(2,'Marcus Williams','Math — Year 4','3.9','#2563eb',true)}
          ${performer(3,'Lena Fischer','Physics — Year 2','3.85','#059669',true)}
          ${performer(4,'Omar Khalil','Business — Year 3','3.8','#d97706',false)}
          ${performer(5,'Aisha Patel','Engineering — Year 4','3.75','#db2777',false)}
        </div>
      </div>
    </div>
  `;

  // Init charts after render
  setTimeout(() => {
    initEnrollmentChart();
    initGradeDonut();
    animateKPIBars();
  }, 100);
}

function kpiCard(color, icon, label, value, trend, dir, pct) {
  return `
    <div class="kpi-card ${color} animate-slideUp">
      <div class="kpi-top">
        <div class="kpi-icon">${icon}</div>
        <div class="kpi-trend ${dir}">${dir==='up'?'↑':'↓'} ${trend}</div>
      </div>
      <div class="kpi-number">${value}</div>
      <div class="kpi-label">${label}</div>
      <div class="kpi-progress"><div class="kpi-progress-fill" style="width:0%" data-width="${pct}"></div></div>
    </div>
  `;
}

function activityItem(icon, bg, text, meta, time) {
  return `
    <div class="activity-item">
      <div class="activity-icon" style="background:${bg}">${icon}</div>
      <div class="activity-info">
        <div class="activity-text">${text}</div>
        <div class="activity-meta">${meta}</div>
      </div>
      <div class="activity-time">${time}</div>
    </div>
  `;
}

function performer(rank, name, info, score, color, top) {
  return `
    <div class="performer-item">
      <div class="performer-rank ${top?'top':'normal'}">${rank}</div>
      <div class="performer-avatar" style="background:${color}">${getInitials(name)}</div>
      <div class="performer-info">
        <div class="performer-name">${name}</div>
        <div class="performer-course">${info}</div>
      </div>
      <div class="performer-score">${score}</div>
    </div>
  `;
}

function animateKPIBars() {
  document.querySelectorAll('.kpi-progress-fill').forEach(bar => {
    const target = bar.dataset.width;
    setTimeout(() => { bar.style.width = target; }, 200);
  });
}

// ---- LOGOUT ----
function handleLogout() {
  showToast('info', 'Signing out…', '');
  setTimeout(() => {
    sessionStorage.removeItem('eduflow_user');
    window.location.href = 'login.html';
  }, 1000);
}

// ---- SCHEDULE PAGE ----
function renderSchedule(container) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const slots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];
  const classes = [
    { day: 0, slot: 0, name: 'Calculus I', room: 'A101', color: '#7c3aed' },
    { day: 0, slot: 2, name: 'Physics 201', room: 'B203', color: '#2563eb' },
    { day: 1, slot: 1, name: 'CS301', room: 'Lab 1', color: '#059669' },
    { day: 1, slot: 4, name: 'Literature', room: 'C105', color: '#d97706' },
    { day: 2, slot: 0, name: 'Calculus I', room: 'A101', color: '#7c3aed' },
    { day: 2, slot: 3, name: 'Machine Learning', room: 'Lab 2', color: '#0891b2' },
    { day: 3, slot: 2, name: 'CS301', room: 'Lab 1', color: '#059669' },
    { day: 3, slot: 5, name: 'Business Ethics', room: 'D201', color: '#db2777' },
    { day: 4, slot: 1, name: 'Physics 201', room: 'B203', color: '#2563eb' },
    { day: 4, slot: 3, name: 'Machine Learning', room: 'Lab 2', color: '#0891b2' },
  ];

  const grid = days.map((day, di) => {
    const cells = slots.map((slot, si) => {
      const cls = classes.find(c => c.day === di && c.slot === si);
      if (cls) {
        return `<td style="padding:4px;">
          <div style="background:${cls.color}22;border:1px solid ${cls.color}55;border-radius:8px;padding:8px 10px;border-left:3px solid ${cls.color};">
            <div style="font-size:12px;font-weight:700;color:var(--text-100);">${cls.name}</div>
            <div style="font-size:10px;color:var(--text-500);">${cls.room}</div>
          </div>
        </td>`;
      }
      return `<td style="padding:4px;"><div style="height:56px;"></div></td>`;
    }).join('');
    return `<tr><td style="padding:8px 16px;font-size:13px;font-weight:600;color:var(--text-300);white-space:nowrap;">${day}</td>${cells}</tr>`;
  }).join('');

  const headers = slots.map(s => `<th style="padding:8px;font-size:11px;color:var(--text-500);font-weight:600;text-align:center;">${s}</th>`).join('');

  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Schedule</h1>
      <p class="page-subtitle">Weekly timetable for Spring 2025</p>
    </div>
    <div class="section">
      <div class="section-head">
        <div><div class="section-head-title">Weekly Timetable</div></div>
        <button class="btn btn-primary btn-sm">+ Add class</button>
      </div>
      <div style="overflow-x:auto;padding:var(--space-4);">
        <table style="width:100%;border-collapse:collapse;">
          <thead><tr><th style="width:100px;"></th>${headers}</tr></thead>
          <tbody>${grid}</tbody>
        </table>
      </div>
    </div>
  `;
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('overview');

  // Global search
  const search = document.getElementById('globalSearch');
  if (search) {
    search.addEventListener('keydown', e => {
      if (e.key === 'Enter' && search.value.trim()) {
        showToast('info', 'Search', `Searching for "${search.value.trim()}"…`);
      }
    });
  }

  // Chart period toggles (delegated)
  document.addEventListener('click', e => {
    if (e.target.classList.contains('chart-period-btn')) {
      e.target.closest('.chart-actions')?.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
    }
  });
});