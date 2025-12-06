import { projects, getCategoryCounts, getStatusCounts } from '../data/projects';
import type { ProjectCategory } from '../types/project';
import { OrgChartTile } from './OrgChart';
import './Overview.css';

const categoryColors: Record<ProjectCategory, string> = {
  'Community Development': 'var(--asu-orange)',
  'Education': 'var(--asu-blue)',
  'Health': 'var(--asu-maroon)',
  'Sustainability': 'var(--asu-green)',
};

// Calculate spring status counts
function getSpringStatusCounts() {
  let continuing = 0;
  let delivering = 0;
  let notContinuing = 0;
  let revivalNeeded = 0;
  let unknown = 0;

  projects.forEach(p => {
    const status = (p.springStatus || '').toLowerCase();
    if (status.includes('delivering')) {
      delivering++;
    } else if (status.includes('not continuing')) {
      if (status.includes('revival')) {
        revivalNeeded++;
      } else {
        notContinuing++;
      }
    } else if (status.includes('monday') || status.includes('tuesday') || status.includes('wednesday') || status.includes('thursday')) {
      continuing++;
    } else {
      unknown++;
    }
  });

  return { continuing, delivering, notContinuing, revivalNeeded, unknown };
}

// Calculate design review stats
function getDesignReviewStats() {
  const projectsWithScores = projects.filter(p => p.designReviewScore !== undefined);
  if (projectsWithScores.length === 0) return null;

  const scores = projectsWithScores.map(p => p.designReviewScore!);
  const average = scores.reduce((a, b) => a + b, 0) / scores.length;
  const excellent = scores.filter(s => s >= 0.9).length;
  const good = scores.filter(s => s >= 0.7 && s < 0.9).length;
  const adequate = scores.filter(s => s >= 0.5 && s < 0.7).length;
  const needsImprovement = scores.filter(s => s < 0.5).length;

  return { average, excellent, good, adequate, needsImprovement, total: projectsWithScores.length };
}

export function Overview() {
  const categoryCounts = getCategoryCounts();
  const statusCounts = getStatusCounts();
  const springCounts = getSpringStatusCounts();
  const designStats = getDesignReviewStats();
  const maxCategoryCount = Math.max(...Object.values(categoryCounts));

  // Program stats from the planning doc
  const programStats = {
    totalStudents: 505,
    instructors: 7,
    industryMentors: 23,
    sections: 13,
    minutesPerWeek: 100,
    weeksPerSemester: 13,
  };

  // Calculate hands-on hours
  const hoursPerStudentPerSemester = (programStats.minutesPerWeek * programStats.weeksPerSemester) / 60;
  const totalProgramHours = hoursPerStudentPerSemester * programStats.totalStudents;

  return (
    <div className="overview">
      <section className="stats-grid">
        <div className="stat-card spring-continuing">
          <span className="stat-value">{springCounts.continuing}</span>
          <span className="stat-label">Continuing</span>
        </div>
        <div className="stat-card spring-delivering">
          <span className="stat-value">{springCounts.delivering}</span>
          <span className="stat-label">Delivering</span>
        </div>
        <div className="stat-card spring-not-continuing">
          <span className="stat-value">{springCounts.notContinuing}</span>
          <span className="stat-label">Not Continuing</span>
        </div>
        <div className="stat-card spring-revival">
          <span className="stat-value">{springCounts.revivalNeeded}</span>
          <span className="stat-label">Revival Needed</span>
        </div>
        {springCounts.unknown > 0 && (
          <div className="stat-card spring-unknown">
            <span className="stat-value">{springCounts.unknown}</span>
            <span className="stat-label">TBD</span>
          </div>
        )}
      </section>

      <div className="charts-row">
        <section className="chart-section">
          <h2>Impact</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <span className="impact-value">{hoursPerStudentPerSemester.toFixed(0)}</span>
              <span className="impact-label">Hours/Student</span>
              <span className="impact-detail">{programStats.minutesPerWeek} min/week × {programStats.weeksPerSemester} weeks</span>
            </div>
            <div className="impact-multiply">×</div>
            <div className="impact-card">
              <span className="impact-value">{programStats.totalStudents.toLocaleString()}</span>
              <span className="impact-label">Students</span>
              <span className="impact-detail">Enrolled this semester</span>
            </div>
            <div className="impact-multiply">=</div>
            <div className="impact-card impact-total">
              <span className="impact-value">{Math.round(totalProgramHours).toLocaleString()}</span>
              <span className="impact-label">Total Program Hours</span>
              <span className="impact-detail">Hands-on industry work</span>
            </div>
          </div>
          <div className="bar-chart">
            {(Object.entries(categoryCounts) as [ProjectCategory, number][]).map(([category, count]) => (
              <div key={category} className="bar-row">
                <span className="bar-label">{category}</span>
                <div className="bar-container">
                  <div
                    className="bar"
                    style={{
                      width: `${(count / maxCategoryCount) * 100}%`,
                      backgroundColor: categoryColors[category]
                    }}
                  />
                  <span className="bar-value">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="chart-section">
          <h2>Program Health</h2>
          <div className="status-grid">
            <div className="status-card status-no-pulse">
              <span className="status-value">◌ {statusCounts['no-pulse']}</span>
              <span className="status-label">No Pulse</span>
            </div>
            <div className="status-card status-on-track">
              <span className="status-value">♥ {statusCounts['on-track']}</span>
              <span className="status-label">On Track</span>
            </div>
            <div className="status-card status-at-risk">
              <span className="status-value">♡ {statusCounts['at-risk']}</span>
              <span className="status-label">At Risk</span>
            </div>
            <div className="status-card status-blocked">
              <span className="status-value">✕ {statusCounts.blocked}</span>
              <span className="status-label">Blocked</span>
            </div>
            <div className="status-card status-completed">
              <span className="status-value">✓ {statusCounts.completed}</span>
              <span className="status-label">Completed</span>
            </div>
          </div>
          {designStats && (
            <div className="design-review-inline">
              <div className="average-score-inline">
                <span className="average-value-inline">{(designStats.average * 100).toFixed(0)}%</span>
                <span className="average-label-inline">Design Review Avg</span>
              </div>
              <div className="score-breakdown-inline">
                <div className="score-item-inline score-excellent-bg">
                  <span className="score-count-inline">{designStats.excellent}</span>
                  <span className="score-label-inline">Excellent</span>
                </div>
                <div className="score-item-inline score-good-bg">
                  <span className="score-count-inline">{designStats.good}</span>
                  <span className="score-label-inline">Good</span>
                </div>
                <div className="score-item-inline score-adequate-bg">
                  <span className="score-count-inline">{designStats.adequate}</span>
                  <span className="score-label-inline">Adequate</span>
                </div>
                <div className="score-item-inline score-needs-bg">
                  <span className="score-count-inline">{designStats.needsImprovement}</span>
                  <span className="score-label-inline">Needs Work</span>
                </div>
              </div>
            </div>
          )}
          <div className="program-stats-grid">
            <div className="program-stat-card">
              <span className="program-stat-value">{projects.length}</span>
              <span className="program-stat-label">Active Projects</span>
            </div>
            <div className="program-stat-card">
              <span className="program-stat-value">{programStats.totalStudents}</span>
              <span className="program-stat-label">Students Enrolled</span>
            </div>
            <div className="program-stat-card">
              <span className="program-stat-value">{programStats.instructors}</span>
              <span className="program-stat-label">Portfolio Managers</span>
            </div>
            <div className="program-stat-card">
              <span className="program-stat-value">{programStats.industryMentors}</span>
              <span className="program-stat-label">Industry Mentors</span>
            </div>
          </div>
        </section>
      </div>

      <section className="info-section">
        <h2>Program Team</h2>
        <div className="team-grid">
          <OrgChartTile />
          <div className="team-card">
            <h3>Faculty & Instructors</h3>
            <ul>
              <li>Jared Schoepf</li>
              <li>Jenny Wong</li>
              <li>Amanda Minutello</li>
              <li>Daniel Frank</li>
              <li>Adwith Malpe</li>
              <li>Michael King</li>
            </ul>
          </div>
          <div className="team-card">
            <h3>Course Offerings</h3>
            <ul>
              <li><strong>FSE 104:</strong> EPICS Gold Feasibility and Planning (1 credit)</li>
              <li><strong>FSE 404:</strong> EPICS Gold: EPICS in Action (1-2 credits)</li>
              <li><strong>FSE 492:</strong> EPICS Accelerator (1-6 credits)</li>
            </ul>
          </div>
          <div className="team-card">
            <h3>Campuses</h3>
            <ul>
              <li>Tempe Campus</li>
              <li>Polytechnic Campus</li>
              <li>West Valley Campus</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
