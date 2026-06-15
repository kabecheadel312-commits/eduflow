/* ============================================
   EduFlow - charts.js
   Chart initializers using Chart.js
   ============================================ */

'use strict';

// Shared Chart.js defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';
Chart.defaults.font.family = "'Inter', sans-serif";

// Gradient helper
function createGradient(ctx, color1, color2) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  return gradient;
}

// ---- Enrollment Chart (bar + line) ----
let enrollmentChartInstance = null;

function initEnrollmentChart() {
  const canvas = document.getElementById('enrollmentChart');
  if (!canvas) return;
  if (enrollmentChartInstance) { enrollmentChartInstance.destroy(); }

  const ctx = canvas.getContext('2d');
  const barGrad = createGradient(ctx, 'rgba(124,58,237,0.8)', 'rgba(124,58,237,0.1)');

  enrollmentChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'New Enrollments',
          data: [38, 52, 45, 61, 73, 58],
          backgroundColor: barGrad,
          borderColor: 'rgba(124,58,237,0.8)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
          order: 2,
        },
        {
          label: 'Cumulative',
          data: [380, 432, 477, 538, 611, 669],
          type: 'line',
          borderColor: '#a78bfa',
          backgroundColor: 'transparent',
          borderWidth: 2,
          pointBackgroundColor: '#a78bfa',
          pointRadius: 4,
          pointHoverRadius: 6,
          tension: 0.4,
          yAxisID: 'y1',
          order: 1,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { usePointStyle: true, pointStyle: 'circle', padding: 16, font: { size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(30,30,53,0.95)',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 12,
          titleFont: { size: 13, weight: 'bold' },
          bodyFont: { size: 12 },
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { font: { size: 12 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: { font: { size: 12 } },
          title: { display: true, text: 'New students', font: { size: 11 } }
        },
        y1: {
          position: 'right',
          grid: { display: false },
          ticks: { font: { size: 12 } },
          title: { display: true, text: 'Cumulative', font: { size: 11 } }
        }
      }
    }
  });
}

// ---- Grade Donut Chart ----
let gradeDonutInstance = null;

function initGradeDonut() {
  const canvas = document.getElementById('gradeDonutChart');
  if (!canvas) return;
  if (gradeDonutInstance) { gradeDonutInstance.destroy(); }

  const ctx = canvas.getContext('2d');

  gradeDonutInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['A (90–100)', 'B (80–89)', 'C (70–79)', 'D (60–69)', 'F (<60)'],
      datasets: [{
        data: [35, 30, 20, 10, 5],
        backgroundColor: [
          'rgba(16,185,129,0.8)',
          'rgba(6,182,212,0.8)',
          'rgba(245,158,11,0.8)',
          'rgba(249,115,22,0.8)',
          'rgba(239,68,68,0.8)',
        ],
        borderColor: 'rgba(15,15,26,0.5)',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '72%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            padding: 12,
            font: { size: 11 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(30,30,53,0.95)',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
          }
        }
      }
    }
  });
}

// ---- Attendance Line Chart (used on Reports) ----
let attendanceChartInstance = null;

function initAttendanceChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  if (attendanceChartInstance) { attendanceChartInstance.destroy(); }

  const ctx = canvas.getContext('2d');
  const grad = createGradient(ctx, 'rgba(16,185,129,0.3)', 'rgba(16,185,129,0)');

  attendanceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1','Week 2','Week 3','Week 4','Week 5','Week 6','Week 7','Week 8'],
      datasets: [{
        label: 'Attendance %',
        data: [96, 94, 97, 91, 93, 95, 94, 96],
        borderColor: '#10b981',
        backgroundColor: grad,
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointRadius: 4,
        pointHoverRadius: 7,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(30,30,53,0.95)',
          borderColor: 'rgba(255,255,255,0.08)',
          borderWidth: 1,
          padding: 10,
        }
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          min: 80,
          max: 100,
          ticks: { callback: v => v + '%' }
        }
      }
    }
  });
}

// Destroy all charts when navigating away (prevents canvas reuse errors)
function destroyAllCharts() {
  [enrollmentChartInstance, gradeDonutInstance, attendanceChartInstance].forEach(c => {
    if (c) c.destroy();
  });
  enrollmentChartInstance = null;
  gradeDonutInstance = null;
  attendanceChartInstance = null;
}

// Hook into navigation
const _originalNavigateTo = window.navigateTo;
window.navigateTo = function(page) {
  destroyAllCharts();
  if (_originalNavigateTo) _originalNavigateTo(page);
};