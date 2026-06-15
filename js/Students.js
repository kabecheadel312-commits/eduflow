/* ============================================
   EduFlow - students.js
   Students, Teachers, Courses, Attendance,
   Reports, Settings pages & data
   ============================================ */

'use strict';

// ---- Sample Data ----
const STUDENTS_DATA = [
  { id: 'STU-001', name: 'Sarah Johnson', email: 'sarah.j@uni.edu', dept: 'Computer Science', year: 'Year 3', status: 'Active', gpa: 4.0, attendance: 98 },
  { id: 'STU-002', name: 'Marcus Williams', email: 'm.williams@uni.edu', dept: 'Mathematics', year: 'Year 4', status: 'Active', gpa: 3.9, attendance: 95 },
  { id: 'STU-003', name: 'Lena Fischer', email: 'l.fischer@uni.edu', dept: 'Physics', year: 'Year 2', status: 'Active', gpa: 3.85, attendance: 92 },
  { id: 'STU-004', name: 'Omar Khalil', email: 'o.khalil@uni.edu', dept: 'Business', year: 'Year 3', status: 'Active', gpa: 3.8, attendance: 89 },
  { id: 'STU-005', name: 'Aisha Patel', email: 'a.patel@uni.edu', dept: 'Engineering', year: 'Year 4', status: 'Active', gpa: 3.75, attendance: 97 },
  { id: 'STU-006', name: 'Jake Donovan', email: 'j.donovan@uni.edu', dept: 'Literature', year: 'Year 1', status: 'Active', gpa: 2.4, attendance: 72 },
  { id: 'STU-007', name: 'Mei Lin', email: 'm.lin@uni.edu', dept: 'Computer Science', year: 'Year 2', status: 'Active', gpa: 3.6, attendance: 94 },
  { id: 'STU-008', name: 'Carlos Ruiz', email: 'c.ruiz@uni.edu', dept: 'Business', year: 'Year 3', status: 'On Leave', gpa: 3.2, attendance: 61 },
  { id: 'STU-009', name: 'Emma Clarke', email: 'e.clarke@uni.edu', dept: 'Computer Science', year: 'Year 1', status: 'Active', gpa: 3.9, attendance: 100 },
  { id: 'STU-010', name: 'David Kim', email: 'd.kim@uni.edu', dept: 'Mathematics', year: 'Year 2', status: 'Active', gpa: 3.5, attendance: 88 },
  { id: 'STU-011', name: 'Fatima Hassan', email: 'f.hassan@uni.edu', dept: 'Engineering', year: 'Year 3', status: 'Active', gpa: 3.7, attendance: 93 },
  { id: 'STU-012', name: 'Ryan O\'Brien', email: 'r.obrien@uni.edu', dept: 'Physics', year: 'Year 4', status: 'Graduated', gpa: 3.3, attendance: 85 },
];

const TEACHERS_DATA = [
  { id: 'TCH-001', name: 'Dr. Rachel Thompson', dept: 'Computer Science', courses: 3, students: 124, rating: 4.8, email: 'r.thompson@uni.edu', joined: 'Sep 2019' },
  { id: 'TCH-002', name: 'Prof. Marcus Patel', dept: 'Mathematics', courses: 4, students: 96, rating: 4.7, email: 'm.patel@uni.edu', joined: 'Jan 2017' },
  { id: 'TCH-003', name: 'Dr. Sarah Park', dept: 'Physics', courses: 2, students: 58, rating: 4.9, email: 's.park@uni.edu', joined: 'Aug 2022' },
  { id: 'TCH-004', name: 'Prof. James Liu', dept: 'Business', courses: 3, students: 110, rating: 4.5, email: 'j.liu@uni.edu', joined: 'Mar 2018' },
  { id: 'TCH-005', name: 'Dr. Ana Martinez', dept: 'Literature', courses: 2, students: 44, rating: 4.6, email: 'a.martinez@uni.edu', joined: 'Sep 2020' },
  { id: 'TCH-006', name: 'Prof. Ali Hassan', dept: 'Engineering', courses: 5, students: 150, rating: 4.4, email: 'a.hassan@uni.edu', joined: 'Jan 2015' },
];

const COURSES_DATA = [
  { code: 'CS301', title: 'Algorithms & Data Structures', dept: 'Computer Science', teacher: 'Dr. Thompson', students: 45, credits: 4, progress: 72, icon: '💻' },
  { code: 'CS501', title: 'Machine Learning', dept: 'Computer Science', teacher: 'Dr. Thompson', students: 32, credits: 3, progress: 45, icon: '🤖' },
  { code: 'MTH201', title: 'Calculus II', dept: 'Mathematics', teacher: 'Prof. Patel', students: 60, credits: 4, progress: 88, icon: '📐' },
  { code: 'PHY201', title: 'Classical Mechanics', dept: 'Physics', teacher: 'Dr. Park', students: 28, credits: 3, progress: 60, icon: '⚛️' },
  { code: 'BUS301', title: 'Business Ethics', dept: 'Business', teacher: 'Prof. Liu', students: 55, credits: 2, progress: 35, icon: '📊' },
  { code: 'LIT101', title: 'World Literature', dept: 'Literature', teacher: 'Dr. Martinez', students: 22, credits: 3, progress: 90, icon: '📖' },
  { code: 'ENG401', title: 'Structural Engineering', dept: 'Engineering', teacher: 'Prof. Hassan', students: 38, credits: 4, progress: 55, icon: '🏗️' },
  { code: 'MTH301', title: 'Linear Algebra', dept: 'Mathematics', teacher: 'Prof. Patel', students: 36, credits: 3, progress: 67, icon: '🔢' },
];

let editingStudentIndex = null;
let deleteCallback = null;

// ---- STUDENTS PAGE ----
function renderStudents(container) {
  let filteredStudents = [...STUDENTS_DATA];
  let searchTerm = '';
  let statusFilter = '';
  let deptFilter = '';
  let currentPage = 1;
  const perPage = 8;

  function render() {
    filteredStudents = STUDENTS_DATA.filter(s => {
      const matchSearch = !searchTerm || s.name.toLowerCase().includes(searchTerm) || s.email.toLowerCase().includes(searchTerm) || s.id.toLowerCase().includes(searchTerm);
      const matchStatus = !statusFilter || s.status === statusFilter;
      const matchDept = !deptFilter || s.dept === deptFilter;
      return matchSearch && matchStatus && matchDept;
    });

    const total = filteredStudents.length;
    const pages = Math.ceil(total / perPage);
    currentPage = Math.min(currentPage, pages || 1);
    const paginated = filteredStudents.slice((currentPage - 1) * perPage, currentPage * perPage);

    const tableBody = paginated.map((s, i) => `
      <tr>
        <td>
          <div class="cell-user">
            <div class="cell-avatar" style="background:${randomColor(s.name)}">${getInitials(s.name)}</div>
            <div>
              <span class="cell-user-name">${s.name}</span>
              <span class="cell-user-id">${s.id}</span>
            </div>
          </div>
        </td>
        <td>${s.email}</td>
        <td class="hide-mobile">${s.dept}</td>
        <td class="hide-mobile">${s.year}</td>
        <td><span class="badge ${statusBadgeClass(s.status)}">${s.status}</span></td>
        <td class="hide-mobile">${s.gpa.toFixed(2)}</td>
        <td class="hide-mobile">
          <div class="score-bar-wrap">
            <div class="score-bar"><div class="score-bar-fill ${s.attendance >= 90 ? 'high' : s.attendance >= 75 ? 'mid' : 'low'}" style="width:${s.attendance}%"></div></div>
            <span class="score-text">${s.attendance}%</span>
          </div>
        </td>
        <td>
          <div class="cell-actions">
            <button class="action-btn view" title="View profile" onclick="viewStudent(${STUDENTS_DATA.indexOf(s)})">👁</button>
            <button class="action-btn edit" title="Edit student" onclick="editStudent(${STUDENTS_DATA.indexOf(s)})">✏️</button>
            <button class="action-btn delete" title="Remove student" onclick="deleteStudentConfirm(${STUDENTS_DATA.indexOf(s)})">🗑</button>
          </div>
        </td>
      </tr>
    `).join('');

    const pageButtons = Array.from({length: pages}, (_, i) => `
      <button class="page-btn ${i+1===currentPage?'active':''}" onclick="studentsGoPage(${i+1})">${i+1}</button>
    `).join('');

    document.getElementById('studentsTableBody').innerHTML = tableBody || `<tr><td colspan="8"><div class="empty-state" style="padding:var(--space-10);"><div class="empty-icon">🔍</div><div class="empty-title">No students found</div><div class="empty-text">Try adjusting your filters.</div></div></td></tr>`;
    document.getElementById('paginationInfo').textContent = `Showing ${Math.min((currentPage-1)*perPage+1, total)}–${Math.min(currentPage*perPage, total)} of ${total} students`;
    document.getElementById('paginationControls').innerHTML = `
      <button class="page-btn" onclick="studentsGoPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹</button>
      ${pageButtons}
      <button class="page-btn" onclick="studentsGoPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>›</button>
    `;
  }

  window.studentsGoPage = (p) => { currentPage = p; render(); };

  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Students</h1>
      <p class="page-subtitle">${STUDENTS_DATA.length} students enrolled this semester</p>
    </div>
    <div class="data-toolbar animate-slideUp">
      <div class="search-box">
        <span class="search-box-icon">🔍</span>
        <input type="text" id="studentSearch" placeholder="Search by name, email or ID…" />
      </div>
      <select class="filter-select" id="statusFilter">
        <option value="">All statuses</option>
        <option>Active</option>
        <option>Inactive</option>
        <option>On Leave</option>
        <option>Graduated</option>
      </select>
      <select class="filter-select" id="deptFilter">
        <option value="">All departments</option>
        <option>Computer Science</option>
        <option>Mathematics</option>
        <option>Physics</option>
        <option>Business</option>
        <option>Literature</option>
        <option>Engineering</option>
      </select>
      <div class="toolbar-right">
        <button class="btn btn-primary btn-sm" onclick="openAddStudentModal()">+ Add student</button>
      </div>
    </div>
    <div class="data-table-wrapper animate-slideUp">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Email</th>
            <th class="hide-mobile">Department</th>
            <th class="hide-mobile">Year</th>
            <th>Status</th>
            <th class="hide-mobile">GPA</th>
            <th class="hide-mobile">Attendance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="studentsTableBody"></tbody>
      </table>
      <div class="pagination">
        <div class="pagination-info" id="paginationInfo"></div>
        <div class="pagination-controls" id="paginationControls"></div>
      </div>
    </div>
  `;

  render();

  document.getElementById('studentSearch').addEventListener('input', debounce(e => {
    searchTerm = e.target.value.toLowerCase().trim();
    currentPage = 1;
    render();
  }));

  document.getElementById('statusFilter').addEventListener('change', e => {
    statusFilter = e.target.value;
    currentPage = 1;
    render();
  });

  document.getElementById('deptFilter').addEventListener('change', e => {
    deptFilter = e.target.value;
    currentPage = 1;
    render();
  });
}

function statusBadgeClass(status) {
  const map = { Active: 'badge-success', Inactive: 'badge-danger', 'On Leave': 'badge-warning', Graduated: 'badge-info' };
  return map[status] || 'badge-primary';
}

function openAddStudentModal() {
  editingStudentIndex = null;
  document.getElementById('studentModalTitle').textContent = 'Add Student';
  ['studentFirstName','studentLastName','studentEmail','studentId','studentDept','studentYear'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('studentStatus').value = 'Active';
  openModal('studentModal');
}

function editStudent(index) {
  editingStudentIndex = index;
  const s = STUDENTS_DATA[index];
  document.getElementById('studentModalTitle').textContent = 'Edit Student';
  const parts = s.name.split(' ');
  document.getElementById('studentFirstName').value = parts[0] || '';
  document.getElementById('studentLastName').value = parts.slice(1).join(' ') || '';
  document.getElementById('studentEmail').value = s.email;
  document.getElementById('studentId').value = s.id;
  document.getElementById('studentDept').value = s.dept;
  document.getElementById('studentYear').value = s.year;
  document.getElementById('studentStatus').value = s.status;
  openModal('studentModal');
}

function viewStudent(index) {
  const s = STUDENTS_DATA[index];
  showToast('info', s.name, `GPA: ${s.gpa} | Attendance: ${s.attendance}% | ${s.dept}, ${s.year}`);
}

function saveStudent() {
  const first = document.getElementById('studentFirstName').value.trim();
  const last = document.getElementById('studentLastName').value.trim();
  const email = document.getElementById('studentEmail').value.trim();
  const dept = document.getElementById('studentDept').value;

  if (!first || !last || !email || !dept) {
    showToast('error', 'Missing fields', 'Please fill in all required fields.');
    return;
  }

  if (editingStudentIndex !== null) {
    STUDENTS_DATA[editingStudentIndex].name = `${first} ${last}`;
    STUDENTS_DATA[editingStudentIndex].email = email;
    STUDENTS_DATA[editingStudentIndex].dept = dept;
    STUDENTS_DATA[editingStudentIndex].year = document.getElementById('studentYear').value;
    STUDENTS_DATA[editingStudentIndex].status = document.getElementById('studentStatus').value;
    showToast('success', 'Student updated', `${first} ${last}'s record has been saved.`);
  } else {
    const newId = `STU-${String(STUDENTS_DATA.length + 1).padStart(3, '0')}`;
    STUDENTS_DATA.push({
      id: document.getElementById('studentId').value || newId,
      name: `${first} ${last}`,
      email,
      dept,
      year: document.getElementById('studentYear').value,
      status: document.getElementById('studentStatus').value,
      gpa: 0,
      attendance: 0
    });
    showToast('success', 'Student added', `${first} ${last} has been enrolled.`);
  }

  closeModal('studentModal');
  if (currentPage === 'students') renderPage('students');
}

function deleteStudentConfirm(index) {
  const s = STUDENTS_DATA[index];
  document.getElementById('deleteModalText').textContent = `Delete ${s.name} (${s.id})? All associated records will be removed.`;
  deleteCallback = () => {
    STUDENTS_DATA.splice(index, 1);
    closeModal('deleteModal');
    showToast('success', 'Student removed', `${s.name} has been deleted.`);
    if (currentPage === 'students') renderPage('students');
  };
  document.getElementById('deleteConfirmBtn').onclick = deleteCallback;
  openModal('deleteModal');
}

// ---- TEACHERS PAGE ----
function renderTeachers(container) {
  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Teachers</h1>
      <p class="page-subtitle">${TEACHERS_DATA.length} faculty members on staff</p>
    </div>
    <div class="data-toolbar animate-slideUp">
      <div class="search-box">
        <span class="search-box-icon">🔍</span>
        <input type="text" id="teacherSearch" placeholder="Search faculty…" />
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary btn-sm" onclick="showToast('info','Coming soon','Add teacher form will open here.')">+ Add teacher</button>
      </div>
    </div>
    <div class="teacher-grid animate-slideUp" id="teacherGrid">
      ${TEACHERS_DATA.map(t => `
        <div class="teacher-card">
          <div class="teacher-avatar" style="background:${randomColor(t.name)}">${getInitials(t.name)}</div>
          <div class="teacher-name">${t.name}</div>
          <div class="teacher-dept">${t.dept}</div>
          <div class="teacher-stats">
            <div class="teacher-stat">
              <div class="teacher-stat-num">${t.courses}</div>
              <div class="teacher-stat-label">Courses</div>
            </div>
            <div class="teacher-stat">
              <div class="teacher-stat-num">${t.students}</div>
              <div class="teacher-stat-label">Students</div>
            </div>
          </div>
          <div style="margin-bottom:var(--space-4);text-align:center;">
            <span class="badge badge-success">⭐ ${t.rating}</span>
            <span style="font-size:11px;color:var(--text-500);margin-left:8px;">Since ${t.joined}</span>
          </div>
          <div class="teacher-actions">
            <button class="btn btn-secondary btn-sm" style="flex:1;justify-content:center;" onclick="showToast('info','${t.name}','${t.email}')">View profile</button>
            <button class="btn btn-primary btn-sm" style="flex:1;justify-content:center;" onclick="showToast('success','Assigned','Course assignment updated.')">Assign course</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('teacherSearch').addEventListener('input', debounce(e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.teacher-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  }));
}

// ---- COURSES PAGE ----
function renderCourses(container) {
  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Courses</h1>
      <p class="page-subtitle">${COURSES_DATA.length} courses running this semester</p>
    </div>
    <div class="data-toolbar animate-slideUp">
      <div class="search-box">
        <span class="search-box-icon">🔍</span>
        <input type="text" id="courseSearch" placeholder="Search courses…" />
      </div>
      <div class="toolbar-right">
        <button class="btn btn-primary btn-sm" onclick="showToast('info','Coming soon','Add course form will open here.')">+ Add course</button>
      </div>
    </div>
    <div class="course-grid animate-slideUp" id="courseGrid">
      ${COURSES_DATA.map(c => `
        <div class="course-card">
          <div class="course-header">
            <div class="course-icon">${c.icon}</div>
            <div class="course-title">${c.title}</div>
            <div class="course-code">${c.code}</div>
          </div>
          <div class="course-body">
            <div class="course-meta">
              <div class="course-meta-item">👥 ${c.students} students</div>
              <div class="course-meta-item">📚 ${c.credits} credits</div>
              <div class="course-meta-item">🏢 ${c.dept}</div>
              <div class="course-meta-item">👨‍🏫 ${c.teacher}</div>
            </div>
            <div class="course-progress-label">
              <span>Progress</span>
              <span>${c.progress}%</span>
            </div>
            <div class="course-progress">
              <div class="course-progress-fill" style="width:${c.progress}%"></div>
            </div>
            <div class="course-footer">
              <button class="btn btn-secondary btn-sm" style="flex:1;justify-content:center;" onclick="showToast('info','${c.title}','${c.students} students enrolled, ${c.credits} credit hours.')">Details</button>
              <button class="btn btn-primary btn-sm" style="flex:1;justify-content:center;" onclick="showToast('success','Teacher assigned','Instructor updated for ${c.code}.')">Assign teacher</button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  document.getElementById('courseSearch').addEventListener('input', debounce(e => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.course-card').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(term) ? '' : 'none';
    });
  }));
}

// ---- ATTENDANCE PAGE ----
function renderAttendance(container) {
  const today = new Date();
  let viewYear = today.getFullYear();
  let viewMonth = today.getMonth();

  function renderCalendar() {
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const todayDate = today.getDate();
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth();

    // Random attendance pattern
    const presentDays = new Set([1,2,3,5,6,8,9,10,12,13,15,16,17,19,20,22,23,24,26,27,29,30]);
    const absentDays = new Set([4,7,11,14,18,21,25,28]);

    let cells = '';
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) cells += '<div class="calendar-day empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayDate;
      const isWeekend = [0,6].includes(new Date(viewYear, viewMonth, d).getDay());
      let cls = 'calendar-day';
      if (isToday) cls += ' today';
      else if (isWeekend) cls += ' weekend';
      else if (presentDays.has(d)) cls += ' present';
      else if (absentDays.has(d)) cls += ' absent';
      cells += `<div class="${cls}" onclick="toggleAttendance(this,${d})" title="${d} ${monthNames[viewMonth]}">${d}</div>`;
    }

    document.getElementById('calendarGrid').innerHTML = cells;
    document.getElementById('calendarMonth').textContent = `${monthNames[viewMonth]} ${viewYear}`;

    // Summary
    const daysWorked = daysInMonth - Math.floor(daysInMonth * 2/7);
    document.getElementById('attendPresent').textContent = presentDays.size;
    document.getElementById('attendAbsent').textContent = absentDays.size;
    document.getElementById('attendRate').textContent = Math.round((presentDays.size / (presentDays.size + absentDays.size)) * 100) + '%';
  }

  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Attendance</h1>
      <p class="page-subtitle">Track and manage student attendance by month</p>
    </div>
    <div class="section animate-slideUp">
      <div class="section-head">
        <div class="attendance-header" style="width:100%;margin-bottom:0;">
          <div class="calendar-nav">
            <button class="btn btn-secondary btn-sm" onclick="changeMonth(-1)">‹ Prev</button>
            <div class="calendar-month" id="calendarMonth"></div>
            <button class="btn btn-secondary btn-sm" onclick="changeMonth(1)">Next ›</button>
          </div>
          <div style="display:flex;gap:var(--space-3);">
            <span class="badge badge-success">■ Present</span>
            <span class="badge badge-danger">■ Absent</span>
            <button class="btn btn-primary btn-sm" onclick="showToast('success','Attendance saved','Records updated for this month.')">Save changes</button>
          </div>
        </div>
      </div>
      <div class="section-body">
        <div class="calendar-grid">
          <div class="calendar-weekday">Mon</div>
          <div class="calendar-weekday">Tue</div>
          <div class="calendar-weekday">Wed</div>
          <div class="calendar-weekday">Thu</div>
          <div class="calendar-weekday">Fri</div>
          <div class="calendar-weekday">Sat</div>
          <div class="calendar-weekday">Sun</div>
          <div id="calendarGrid" style="display:contents;"></div>
        </div>
        <div class="attendance-summary">
          <div class="attend-stat present-stat">
            <div class="attend-stat-num" id="attendPresent">0</div>
            <div class="attend-stat-label">Days present</div>
          </div>
          <div class="attend-stat absent-stat">
            <div class="attend-stat-num" id="attendAbsent">0</div>
            <div class="attend-stat-label">Days absent</div>
          </div>
          <div class="attend-stat rate-stat">
            <div class="attend-stat-num" id="attendRate">0%</div>
            <div class="attend-stat-label">Attendance rate</div>
          </div>
        </div>
      </div>
    </div>
  `;

  window.changeMonth = (dir) => {
    viewMonth += dir;
    if (viewMonth > 11) { viewMonth = 0; viewYear++; }
    if (viewMonth < 0) { viewMonth = 11; viewYear--; }
    renderCalendar();
  };

  window.toggleAttendance = (el, day) => {
    if (el.classList.contains('weekend') || el.classList.contains('empty')) return;
    if (el.classList.contains('present')) {
      el.classList.remove('present');
      el.classList.add('absent');
      showToast('warning', 'Marked absent', `Day ${day} marked as absent.`);
    } else if (el.classList.contains('absent')) {
      el.classList.remove('absent');
      showToast('info', 'Cleared', `Day ${day} attendance cleared.`);
    } else {
      el.classList.add('present');
      showToast('success', 'Marked present', `Day ${day} marked as present.`);
    }
  };

  renderCalendar();
}

// ---- REPORTS PAGE ----
function renderReports(container) {
  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Reports</h1>
      <p class="page-subtitle">Analytics, summaries, and exportable documents</p>
    </div>
    <div class="analytics-grid animate-slideUp">
      ${analyticsCard('2,483','Total enrolled students','+12.4%','up')}
      ${analyticsCard('94.2%','Average attendance rate','-0.8%','down')}
      ${analyticsCard('3.42','Institution-wide GPA','+0.06','up')}
    </div>
    <div class="reports-grid animate-slideUp">
      ${reportCard('📊','Enrollment Report','Complete enrollment data by department, year, and semester.',() => showToast('success','Generating…','Enrollment report is being prepared.'))}
      ${reportCard('📝','Grade Transcript','Full grade summary with GPA for all students.',() => showToast('success','Generating…','Grade transcript is being prepared.'))}
      ${reportCard('📅','Attendance Audit','Monthly attendance records and absence patterns.',() => showToast('success','Generating…','Attendance audit is being prepared.'))}
      ${reportCard('👨‍🏫','Faculty Report','Teacher workload, course assignments, and ratings.',() => showToast('success','Generating…','Faculty report is being prepared.'))}
      ${reportCard('📚','Course Analytics','Enrollment, pass rates, and performance by course.',() => showToast('success','Generating…','Course analytics are being prepared.'))}
      ${reportCard('🏆','Top Performers','Rankings and academic achievement summary.',() => showToast('success','Generating…','Performance report is being prepared.'))}
    </div>
  `;
}

function analyticsCard(value, label, change, dir) {
  return `
    <div class="analytics-card">
      <div class="analytics-value">${value}</div>
      <div class="analytics-label">${label}</div>
      <div class="analytics-change ${dir}">${dir==='up'?'↑':'↓'} ${change} vs last semester</div>
    </div>
  `;
}

function reportCard(icon, title, desc, fn) {
  const fnName = `report_${Math.random().toString(36).substr(2,5)}`;
  window[fnName] = fn;
  return `
    <div class="report-card" onclick="${fnName}()">
      <div class="report-icon">${icon}</div>
      <div class="report-title">${title}</div>
      <div class="report-desc">${desc}</div>
      <button class="btn btn-secondary btn-sm" style="width:100%;justify-content:center;">📤 Export PDF</button>
    </div>
  `;
}

// ---- SETTINGS PAGE ----
function renderSettings(container) {
  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account and platform preferences</p>
    </div>
    <div class="settings-grid animate-slideUp">
      <div class="settings-nav">
        ${['Profile','Security','Notifications','Appearance','Institution','Billing'].map((item, i) => `
          <div class="settings-nav-item ${i===0?'active':''}" onclick="switchSettingsTab(this, '${item.toLowerCase()}')">${item}</div>
        `).join('')}
      </div>
      <div class="settings-panel" id="settingsPanel">
        ${renderProfileSettings()}
      </div>
    </div>
  `;

  window.switchSettingsTab = (el, tab) => {
    document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
    const panel = document.getElementById('settingsPanel');
    switch(tab) {
      case 'profile': panel.innerHTML = renderProfileSettings(); break;
      case 'security': panel.innerHTML = renderSecuritySettings(); break;
      case 'notifications': panel.innerHTML = renderNotifSettings(); break;
      case 'appearance': panel.innerHTML = renderAppearanceSettings(); break;
      default: panel.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><div class="empty-title">${tab.charAt(0).toUpperCase()+tab.slice(1)}</div><div class="empty-text">This settings section is coming soon.</div></div>`;
    }
  };
}

function renderProfileSettings() {
  return `
    <div class="settings-section">
      <div class="settings-section-title">Profile Information</div>
      <div class="settings-form">
        <div class="avatar-upload">
          <div class="avatar-preview">AD</div>
          <div>
            <button class="btn btn-secondary btn-sm" onclick="showToast('info','Upload','File picker would open here.')">Change photo</button>
            <div style="font-size:12px;color:var(--text-500);margin-top:var(--space-2);">JPG, PNG or GIF · Max 2MB</div>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group"><label class="form-label">First name</label><input type="text" class="form-input" value="Admin" /></div>
          <div class="form-group"><label class="form-label">Last name</label><input type="text" class="form-input" value="User" /></div>
        </div>
        <div class="form-group"><label class="form-label">Email</label><input type="email" class="form-input" value="admin@eduflow.io" /></div>
        <div class="form-group"><label class="form-label">Role</label><input type="text" class="form-input" value="Super Administrator" disabled style="opacity:0.6;" /></div>
        <div class="form-group"><label class="form-label">Institution</label><input type="text" class="form-input" value="EduFlow University" /></div>
        <div>
          <button class="btn btn-primary" onclick="showToast('success','Saved','Your profile has been updated.')">Save changes</button>
        </div>
      </div>
    </div>
  `;
}

function renderSecuritySettings() {
  return `
    <div class="settings-section">
      <div class="settings-section-title">Change Password</div>
      <div class="settings-form">
        <div class="form-group"><label class="form-label">Current password</label><input type="password" class="form-input" placeholder="Enter current password" /></div>
        <div class="form-group"><label class="form-label">New password</label><input type="password" class="form-input" placeholder="Enter new password" /></div>
        <div class="form-group"><label class="form-label">Confirm new password</label><input type="password" class="form-input" placeholder="Repeat new password" /></div>
        <button class="btn btn-primary" onclick="showToast('success','Password updated','Your password has been changed.')">Update password</button>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">Two-Factor Authentication</div>
      <div class="toggle-switch">
        <div class="toggle-info"><h4>Enable 2FA</h4><p>Add an extra layer of security to your account</p></div>
        <label class="toggle"><input type="checkbox" onchange="showToast('info','2FA','Two-factor authentication ' + (this.checked ? 'enabled' : 'disabled') + '.')"><span class="toggle-slider"></span></label>
      </div>
    </div>
  `;
}

function renderNotifSettings() {
  const items = [
    ['Email notifications', 'Receive updates via email', true],
    ['Grade alerts', 'Notify when grades are published', true],
    ['Attendance alerts', 'Alert on low attendance students', true],
    ['Weekly digest', 'Summary of weekly activity', false],
    ['System updates', 'Platform maintenance notices', false],
  ];
  return `
    <div class="settings-section">
      <div class="settings-section-title">Notification Preferences</div>
      ${items.map(([title, desc, checked]) => `
        <div class="toggle-switch">
          <div class="toggle-info"><h4>${title}</h4><p>${desc}</p></div>
          <label class="toggle"><input type="checkbox" ${checked?'checked':''} onchange="showToast('info','Preference saved','${title} ${checked?'disabled':'enabled'}.')"><span class="toggle-slider"></span></label>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAppearanceSettings() {
  return `
    <div class="settings-section">
      <div class="settings-section-title">Theme</div>
      <div class="toggle-switch">
        <div class="toggle-info"><h4>Dark mode</h4><p>Use dark theme across the dashboard (default)</p></div>
        <label class="toggle"><input type="checkbox" checked onchange="showToast('info','Theme','Dark mode is the recommended setting for EduFlow.')"><span class="toggle-slider"></span></label>
      </div>
      <div class="toggle-switch">
        <div class="toggle-info"><h4>Compact sidebar</h4><p>Collapse sidebar labels by default</p></div>
        <label class="toggle"><input type="checkbox" onchange="toggleSidebar()"><span class="toggle-slider"></span></label>
      </div>
      <div class="toggle-switch">
        <div class="toggle-info"><h4>Reduce motion</h4><p>Minimize animations and transitions</p></div>
        <label class="toggle"><input type="checkbox" onchange="showToast('info','Motion','Reduced motion preference saved.')"><span class="toggle-slider"></span></label>
      </div>
    </div>
  `;
}