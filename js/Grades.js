/* ============================================
   EduFlow - grades.js
   Grades page: table, editing, GPA display
   ============================================ */

'use strict';

const GRADES_DATA = [
  { student: 'Sarah Johnson', id: 'STU-001', course: 'CS301', semester: 'Spring 2025', score: 96, grade: 'A' },
  { student: 'Sarah Johnson', id: 'STU-001', course: 'MTH201', semester: 'Spring 2025', score: 91, grade: 'A' },
  { student: 'Marcus Williams', id: 'STU-002', course: 'MTH201', semester: 'Spring 2025', score: 88, grade: 'B' },
  { student: 'Marcus Williams', id: 'STU-002', course: 'MTH301', semester: 'Spring 2025', score: 92, grade: 'A' },
  { student: 'Lena Fischer', id: 'STU-003', course: 'PHY201', semester: 'Spring 2025', score: 84, grade: 'B' },
  { student: 'Omar Khalil', id: 'STU-004', course: 'BUS301', semester: 'Spring 2025', score: 75, grade: 'C' },
  { student: 'Aisha Patel', id: 'STU-005', course: 'ENG401', semester: 'Spring 2025', score: 90, grade: 'A' },
  { student: 'Jake Donovan', id: 'STU-006', course: 'LIT101', semester: 'Spring 2025', score: 52, grade: 'F' },
  { student: 'Mei Lin', id: 'STU-007', course: 'CS301', semester: 'Spring 2025', score: 87, grade: 'B' },
  { student: 'Carlos Ruiz', id: 'STU-008', course: 'BUS301', semester: 'Spring 2025', score: 68, grade: 'D' },
  { student: 'Emma Clarke', id: 'STU-009', course: 'CS301', semester: 'Spring 2025', score: 95, grade: 'A' },
  { student: 'David Kim', id: 'STU-010', course: 'MTH201', semester: 'Spring 2025', score: 78, grade: 'C' },
  { student: 'Fatima Hassan', id: 'STU-011', course: 'ENG401', semester: 'Spring 2025', score: 83, grade: 'B' },
  { student: 'Ryan O\'Brien', id: 'STU-012', course: 'PHY201', semester: 'Spring 2025', score: 71, grade: 'C' },
];

let editingGradeIndex = null;

function scoreToGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

function gradeToPassFail(grade) {
  return grade !== 'F' ? 'pass' : 'fail';
}

function renderGrades(container) {
  let filteredGrades = [...GRADES_DATA];
  let searchTerm = '';
  let gradeFilter = '';
  let courseFilter = '';

  // Summary counts
  const summary = { A: 0, B: 0, C: 0, F: 0 };
  GRADES_DATA.forEach(g => {
    if (g.grade === 'A') summary.A++;
    else if (g.grade === 'B') summary.B++;
    else if (g.grade === 'C' || g.grade === 'D') summary.C++;
    else summary.F++;
  });

  function render() {
    filteredGrades = GRADES_DATA.filter(g => {
      const matchSearch = !searchTerm || g.student.toLowerCase().includes(searchTerm) || g.id.toLowerCase().includes(searchTerm) || g.course.toLowerCase().includes(searchTerm);
      const matchGrade = !gradeFilter || g.grade === gradeFilter;
      const matchCourse = !courseFilter || g.course === courseFilter;
      return matchSearch && matchGrade && matchCourse;
    });

    document.getElementById('gradesTableBody').innerHTML = filteredGrades.map((g, i) => {
      const actualIdx = GRADES_DATA.indexOf(g);
      const pf = gradeToPassFail(g.grade);
      const barClass = g.score >= 80 ? 'high' : g.score >= 60 ? 'mid' : 'low';
      return `
        <tr>
          <td>
            <div class="cell-user">
              <div class="cell-avatar" style="background:${randomColor(g.student)}">${getInitials(g.student)}</div>
              <div>
                <span class="cell-user-name">${g.student}</span>
                <span class="cell-user-id">${g.id}</span>
              </div>
            </div>
          </td>
          <td><span style="font-size:13px;font-weight:600;color:var(--text-200);">${g.course}</span></td>
          <td class="hide-mobile"><span class="cell-semester">${g.semester}</span></td>
          <td>
            <div class="score-bar-wrap">
              <div class="score-bar"><div class="score-bar-fill ${barClass}" style="width:${g.score}%"></div></div>
              <span class="score-text">${g.score}</span>
            </div>
          </td>
          <td><div class="grade-badge ${g.grade}">${g.grade}</div></td>
          <td><span class="pass-fail ${pf}">${pf === 'pass' ? 'Pass' : 'Fail'}</span></td>
          <td>
            <div class="cell-actions">
              <button class="action-btn edit" title="Edit grade" onclick="openEditGrade(${actualIdx})">✏️</button>
            </div>
          </td>
        </tr>
      `;
    }).join('') || `<tr><td colspan="7"><div class="empty-state" style="padding:var(--space-10);"><div class="empty-icon">🔍</div><div class="empty-title">No grades found</div><div class="empty-text">Adjust your search or filters.</div></div></td></tr>`;
  }

  // Unique courses for filter
  const courses = [...new Set(GRADES_DATA.map(g => g.course))];

  container.innerHTML = `
    <div class="page-header animate-slideUp">
      <h1 class="page-title">Grades</h1>
      <p class="page-subtitle">Spring 2025 — ${GRADES_DATA.length} grade records</p>
    </div>

    <div class="grades-summary animate-slideUp">
      <div class="grade-summary-card grade-a">
        <div class="grade-summary-letter">A</div>
        <div class="grade-summary-count">${summary.A}</div>
        <div class="grade-summary-label">students</div>
      </div>
      <div class="grade-summary-card grade-b">
        <div class="grade-summary-letter">B</div>
        <div class="grade-summary-count">${summary.B}</div>
        <div class="grade-summary-label">students</div>
      </div>
      <div class="grade-summary-card grade-c">
        <div class="grade-summary-letter">C–D</div>
        <div class="grade-summary-count">${summary.C}</div>
        <div class="grade-summary-label">students</div>
      </div>
      <div class="grade-summary-card grade-f">
        <div class="grade-summary-letter">F</div>
        <div class="grade-summary-count">${summary.F}</div>
        <div class="grade-summary-label">students</div>
      </div>
    </div>

    <div class="data-toolbar animate-slideUp">
      <div class="search-box">
        <span class="search-box-icon">🔍</span>
        <input type="text" id="gradeSearch" placeholder="Search by student, ID or course…" />
      </div>
      <select class="filter-select" id="gradeFilter">
        <option value="">All grades</option>
        <option>A</option><option>B</option><option>C</option><option>D</option><option>F</option>
      </select>
      <select class="filter-select" id="courseFilter">
        <option value="">All courses</option>
        ${courses.map(c => `<option>${c}</option>`).join('')}
      </select>
    </div>

    <div class="data-table-wrapper animate-slideUp">
      <table class="data-table">
        <thead>
          <tr>
            <th>Student</th>
            <th>Course</th>
            <th class="hide-mobile">Semester</th>
            <th>Score</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="gradesTableBody"></tbody>
      </table>
    </div>
  `;

  render();

  document.getElementById('gradeSearch').addEventListener('input', debounce(e => {
    searchTerm = e.target.value.toLowerCase().trim();
    render();
  }));

  document.getElementById('gradeFilter').addEventListener('change', e => {
    gradeFilter = e.target.value;
    render();
  });

  document.getElementById('courseFilter').addEventListener('change', e => {
    courseFilter = e.target.value;
    render();
  });
}

function openEditGrade(index) {
  editingGradeIndex = index;
  const g = GRADES_DATA[index];
  document.getElementById('gradeModalSubtitle').textContent = `${g.student} — ${g.course}`;
  document.getElementById('gradeScoreInput').value = g.score;
  document.getElementById('gradeSemester').value = g.semester;
  document.getElementById('gradeNotes').value = '';
  updateGradePreview(g.score);
  openModal('gradeModal');
}

function updateGradePreview(score) {
  const grade = scoreToGrade(parseInt(score) || 0);
  const preview = document.getElementById('gradePreview');
  if (!preview) return;
  preview.textContent = grade;

  const styles = {
    A: { bg: 'var(--success-bg)', color: 'var(--success)' },
    B: { bg: 'var(--info-bg)', color: 'var(--info)' },
    C: { bg: 'var(--warning-bg)', color: 'var(--warning)' },
    D: { bg: 'rgba(249,115,22,0.1)', color: '#f97316' },
    F: { bg: 'var(--danger-bg)', color: 'var(--danger)' },
  };
  const s = styles[grade];
  preview.style.background = s.bg;
  preview.style.color = s.color;
}

function saveGrade() {
  if (editingGradeIndex === null) return;
  const score = parseInt(document.getElementById('gradeScoreInput').value);
  if (isNaN(score) || score < 0 || score > 100) {
    showToast('error', 'Invalid score', 'Enter a number between 0 and 100.');
    return;
  }

  GRADES_DATA[editingGradeIndex].score = score;
  GRADES_DATA[editingGradeIndex].grade = scoreToGrade(score);
  GRADES_DATA[editingGradeIndex].semester = document.getElementById('gradeSemester').value;

  closeModal('gradeModal');
  showToast('success', 'Grade saved', `Score updated to ${score}/100 (${scoreToGrade(score)}).`);
  if (currentPage === 'grades') renderPage('grades');
}