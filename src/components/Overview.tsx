import { useState } from 'react';
import { projects, getCategoryCounts, getStatusCounts } from '../data/projects';
import type { ProjectCategory } from '../types/project';
import { OrgChartTile } from './OrgChart';
import './Overview.css';

type OverviewTab = 'dashboard' | 'feed' | 'skills' | 'partnerships' | 'reports';

const categoryColors: Record<ProjectCategory, string> = {
  'Community Development': 'var(--asu-orange)',
  'Education': 'var(--asu-blue)',
  'Health': 'var(--asu-maroon)',
  'Sustainability': 'var(--asu-green)',
};

// Feed item types
interface FeedItem {
  id: string;
  type: 'news' | 'grant' | 'award' | 'event';
  title: string;
  description: string;
  date: string;
  link?: string;
}

// Skill session types
interface SkillSession {
  id: string;
  name: string;
  date: string;
  attendees: number;
  totalStudents: number;
  learningObjectives: string[];
  completed: boolean;
}

// Partnership types
interface Partnership {
  id: string;
  name: string;
  type: 'professional' | 'on-campus' | 'off-campus' | 'organization';
  description: string;
  projectCount: number;
}

// Sample feed data
const sampleFeedItems: FeedItem[] = [
  {
    id: '1',
    type: 'grant',
    title: 'NSF Grant Awarded for Community Tech Initiative',
    description: 'EPICS received a $150,000 NSF grant to expand technology access programs in underserved Phoenix communities.',
    date: '2024-12-01',
    link: 'https://epics.engineering.asu.edu'
  },
  {
    id: '2',
    type: 'award',
    title: 'Student Team Wins Regional Competition',
    description: 'The Solar Water Purification team took first place at the Southwest Engineering Challenge.',
    date: '2024-11-28'
  },
  {
    id: '3',
    type: 'event',
    title: 'Fall Design Review Showcase',
    description: 'Join us for the end-of-semester design review presentations. All teams will present their progress.',
    date: '2024-12-15'
  },
  {
    id: '4',
    type: 'news',
    title: 'New Partnership with Phoenix Children\'s Hospital',
    description: 'EPICS has formalized a partnership to develop assistive technology solutions for pediatric patients.',
    date: '2024-11-20'
  },
  {
    id: '5',
    type: 'event',
    title: 'Spring 2025 Project Fair',
    description: 'Students can explore and join EPICS projects for the upcoming semester.',
    date: '2025-01-18'
  }
];

// Sample skill sessions
const sampleSkillSessions: SkillSession[] = [
  {
    id: '1',
    name: 'Design Thinking Workshop',
    date: '2024-09-05',
    attendees: 342,
    totalStudents: 505,
    learningObjectives: ['Empathize with users', 'Define problem statements', 'Generate creative solutions'],
    completed: true
  },
  {
    id: '2',
    name: 'Technical Writing Fundamentals',
    date: '2024-09-19',
    attendees: 298,
    totalStudents: 505,
    learningObjectives: ['Write clear documentation', 'Create user manuals', 'Document technical processes'],
    completed: true
  },
  {
    id: '3',
    name: 'Project Management Basics',
    date: '2024-10-03',
    attendees: 315,
    totalStudents: 505,
    learningObjectives: ['Create project timelines', 'Manage team resources', 'Track deliverables'],
    completed: true
  },
  {
    id: '4',
    name: 'Prototyping & Testing',
    date: '2024-10-17',
    attendees: 287,
    totalStudents: 505,
    learningObjectives: ['Build rapid prototypes', 'Design test plans', 'Iterate based on feedback'],
    completed: true
  },
  {
    id: '5',
    name: 'Presentation Skills',
    date: '2024-11-07',
    attendees: 305,
    totalStudents: 505,
    learningObjectives: ['Structure presentations', 'Engage audiences', 'Handle Q&A sessions'],
    completed: true
  },
  {
    id: '6',
    name: 'Ethics in Engineering',
    date: '2024-11-21',
    attendees: 0,
    totalStudents: 505,
    learningObjectives: ['Identify ethical considerations', 'Apply ethical frameworks', 'Navigate complex decisions'],
    completed: false
  }
];

// Sample partnerships
const samplePartnerships: Partnership[] = [
  { id: '1', name: 'Phoenix Children\'s Hospital', type: 'professional', description: 'Healthcare technology solutions', projectCount: 3 },
  { id: '2', name: 'City of Phoenix Parks Dept', type: 'organization', description: 'Sustainability and park improvements', projectCount: 2 },
  { id: '3', name: 'ASU Mary Lou Fulton Teachers College', type: 'on-campus', description: 'Educational technology tools', projectCount: 4 },
  { id: '4', name: 'Habitat for Humanity', type: 'off-campus', description: 'Affordable housing solutions', projectCount: 2 },
  { id: '5', name: 'Banner Health', type: 'professional', description: 'Patient care innovations', projectCount: 3 },
  { id: '6', name: 'ASU Sustainability Office', type: 'on-campus', description: 'Campus sustainability projects', projectCount: 5 },
  { id: '7', name: 'Boys & Girls Club of Phoenix', type: 'off-campus', description: 'Youth development programs', projectCount: 2 },
  { id: '8', name: 'Intel Corporation', type: 'professional', description: 'Industry mentorship & technology', projectCount: 4 },
  { id: '9', name: 'Maricopa County', type: 'organization', description: 'Community development initiatives', projectCount: 3 },
  { id: '10', name: 'ASU Design School', type: 'on-campus', description: 'Human-centered design collaboration', projectCount: 2 }
];

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

// Tab configuration
const tabConfig: { id: OverviewTab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'feed', label: 'EPICS Feed', icon: '📰' },
  { id: 'skills', label: 'Skill Sessions', icon: '🎯' },
  { id: 'partnerships', label: 'Partnerships', icon: '🤝' },
  { id: 'reports', label: 'Reports', icon: '📋' },
];

const feedTypeConfig: Record<FeedItem['type'], { icon: string; color: string; label: string }> = {
  news: { icon: '📰', color: 'var(--asu-blue)', label: 'News' },
  grant: { icon: '💰', color: 'var(--asu-green)', label: 'Grant' },
  award: { icon: '🏆', color: 'var(--asu-gold)', label: 'Award' },
  event: { icon: '📅', color: 'var(--asu-maroon)', label: 'Event' },
};

const partnerTypeConfig: Record<Partnership['type'], { color: string; label: string }> = {
  professional: { color: 'var(--asu-maroon)', label: 'Professional' },
  'on-campus': { color: 'var(--asu-blue)', label: 'On-Campus' },
  'off-campus': { color: 'var(--asu-orange)', label: 'Off-Campus' },
  organization: { color: 'var(--asu-green)', label: 'Organization' },
};

export function Overview() {
  const [activeTab, setActiveTab] = useState<OverviewTab>('dashboard');
  const [feedFilter, setFeedFilter] = useState<FeedItem['type'] | 'all'>('all');
  const [partnerFilter, setPartnerFilter] = useState<Partnership['type'] | 'all'>('all');

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

  // Calculate skill session stats
  const completedSessions = sampleSkillSessions.filter(s => s.completed);
  const avgAttendance = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + s.attendees, 0) / completedSessions.length
    : 0;
  const avgAttendanceRate = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + (s.attendees / s.totalStudents), 0) / completedSessions.length * 100
    : 0;

  // Filter feed items
  const filteredFeed = feedFilter === 'all'
    ? sampleFeedItems
    : sampleFeedItems.filter(item => item.type === feedFilter);

  // Filter partnerships
  const filteredPartners = partnerFilter === 'all'
    ? samplePartnerships
    : samplePartnerships.filter(p => p.type === partnerFilter);

  // Partner counts by type
  const partnerCounts = samplePartnerships.reduce((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {} as Record<Partnership['type'], number>);

  const renderDashboard = () => (
    <>
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
    </>
  );

  const renderFeed = () => (
    <div className="feed-tab">
      <div className="feed-filters">
        <button
          className={`feed-filter-btn ${feedFilter === 'all' ? 'active' : ''}`}
          onClick={() => setFeedFilter('all')}
        >
          All
        </button>
        {(Object.entries(feedTypeConfig) as [FeedItem['type'], typeof feedTypeConfig['news']][]).map(([type, config]) => (
          <button
            key={type}
            className={`feed-filter-btn ${feedFilter === type ? 'active' : ''}`}
            onClick={() => setFeedFilter(type)}
            style={{ '--filter-color': config.color } as React.CSSProperties}
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      <div className="feed-list">
        {filteredFeed.map(item => {
          const typeConfig = feedTypeConfig[item.type];
          return (
            <div key={item.id} className="feed-item" style={{ '--item-color': typeConfig.color } as React.CSSProperties}>
              <div className="feed-item-icon">{typeConfig.icon}</div>
              <div className="feed-item-content">
                <div className="feed-item-header">
                  <span className="feed-item-type">{typeConfig.label}</span>
                  <span className="feed-item-date">{new Date(item.date).toLocaleDateString()}</span>
                </div>
                <h3 className="feed-item-title">
                  {item.link ? (
                    <a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a>
                  ) : item.title}
                </h3>
                <p className="feed-item-description">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderSkillSessions = () => (
    <div className="skills-tab">
      <div className="skills-summary">
        <div className="skills-stat">
          <span className="skills-stat-value">{completedSessions.length}/{sampleSkillSessions.length}</span>
          <span className="skills-stat-label">Sessions Completed</span>
        </div>
        <div className="skills-stat">
          <span className="skills-stat-value">{Math.round(avgAttendance)}</span>
          <span className="skills-stat-label">Avg Attendance</span>
        </div>
        <div className="skills-stat">
          <span className="skills-stat-value">{avgAttendanceRate.toFixed(0)}%</span>
          <span className="skills-stat-label">Attendance Rate</span>
        </div>
        <div className="skills-stat">
          <span className="skills-stat-value">{completedSessions.reduce((sum, s) => sum + s.learningObjectives.length, 0)}</span>
          <span className="skills-stat-label">Objectives Covered</span>
        </div>
      </div>

      <div className="skills-list">
        {sampleSkillSessions.map(session => (
          <div key={session.id} className={`skill-session-card ${session.completed ? 'completed' : 'upcoming'}`}>
            <div className="session-header">
              <div className="session-status">
                {session.completed ? '✓' : '○'}
              </div>
              <div className="session-info">
                <h3>{session.name}</h3>
                <span className="session-date">{new Date(session.date).toLocaleDateString()}</span>
              </div>
              {session.completed && (
                <div className="session-attendance">
                  <span className="attendance-value">{session.attendees}/{session.totalStudents}</span>
                  <span className="attendance-rate">({((session.attendees / session.totalStudents) * 100).toFixed(0)}%)</span>
                </div>
              )}
            </div>
            <div className="session-objectives">
              <span className="objectives-label">Learning Objectives:</span>
              <ul>
                {session.learningObjectives.map((obj, idx) => (
                  <li key={idx} className={session.completed ? 'completed' : ''}>
                    {session.completed ? '✓' : '○'} {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPartnerships = () => (
    <div className="partnerships-tab">
      <div className="partnerships-summary">
        <div className="partnership-stat total">
          <span className="partnership-stat-value">{samplePartnerships.length}</span>
          <span className="partnership-stat-label">Total Partners</span>
        </div>
        {(Object.entries(partnerTypeConfig) as [Partnership['type'], typeof partnerTypeConfig['professional']][]).map(([type, config]) => (
          <div
            key={type}
            className={`partnership-stat ${partnerFilter === type ? 'active' : ''}`}
            style={{ '--stat-color': config.color } as React.CSSProperties}
            onClick={() => setPartnerFilter(partnerFilter === type ? 'all' : type)}
          >
            <span className="partnership-stat-value">{partnerCounts[type] || 0}</span>
            <span className="partnership-stat-label">{config.label}</span>
          </div>
        ))}
      </div>

      <div className="partnerships-list">
        {filteredPartners.map(partner => {
          const typeConfig = partnerTypeConfig[partner.type];
          return (
            <div key={partner.id} className="partnership-card" style={{ '--partner-color': typeConfig.color } as React.CSSProperties}>
              <div className="partner-type-badge">{typeConfig.label}</div>
              <h3 className="partner-name">{partner.name}</h3>
              <p className="partner-description">{partner.description}</p>
              <div className="partner-projects">
                <span className="project-count">{partner.projectCount}</span>
                <span className="project-label">Active Projects</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderReports = () => {
    // Calculate people impacted (sum of project impact metrics)
    const totalPeopleImpacted = projects.reduce((sum, p) => sum + (p.peopleImpacted || 0), 0);
    const projectsWithImpact = projects.filter(p => p.peopleImpacted && p.peopleImpacted > 0);

    return (
      <div className="reports-tab">
        <div className="reports-grid">
          <div className="report-card">
            <h3>Program Summary</h3>
            <div className="report-metrics">
              <div className="report-metric">
                <span className="metric-value">{projects.length}</span>
                <span className="metric-label">Active Projects</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{programStats.totalStudents}</span>
                <span className="metric-label">Students Enrolled</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{samplePartnerships.length}</span>
                <span className="metric-label">Community Partners</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{Math.round(totalProgramHours).toLocaleString()}</span>
                <span className="metric-label">Total Hours</span>
              </div>
            </div>
          </div>

          <div className="report-card">
            <h3>Social Impact</h3>
            <div className="report-metrics">
              <div className="report-metric highlight">
                <span className="metric-value">{totalPeopleImpacted.toLocaleString()}</span>
                <span className="metric-label">People Impacted</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{projectsWithImpact.length}</span>
                <span className="metric-label">Projects Tracking Impact</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{Object.keys(categoryCounts).length}</span>
                <span className="metric-label">Impact Categories</span>
              </div>
            </div>
          </div>

          <div className="report-card">
            <h3>Student Outcomes</h3>
            <div className="report-metrics">
              <div className="report-metric">
                <span className="metric-value">{completedSessions.length}</span>
                <span className="metric-label">Skill Sessions</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{avgAttendanceRate.toFixed(0)}%</span>
                <span className="metric-label">Avg Attendance</span>
              </div>
              <div className="report-metric">
                <span className="metric-value">{completedSessions.reduce((sum, s) => sum + s.learningObjectives.length, 0)}</span>
                <span className="metric-label">Objectives Taught</span>
              </div>
            </div>
          </div>

          <div className="report-card">
            <h3>Project Health</h3>
            <div className="report-metrics">
              <div className="report-metric success">
                <span className="metric-value">{statusCounts['on-track']}</span>
                <span className="metric-label">On Track</span>
              </div>
              <div className="report-metric warning">
                <span className="metric-value">{statusCounts['at-risk']}</span>
                <span className="metric-label">At Risk</span>
              </div>
              <div className="report-metric danger">
                <span className="metric-value">{statusCounts.blocked}</span>
                <span className="metric-label">Blocked</span>
              </div>
              <div className="report-metric info">
                <span className="metric-value">{statusCounts.completed}</span>
                <span className="metric-label">Completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="export-actions">
          <button className="export-btn">Export PDF Report</button>
          <button className="export-btn secondary">Export CSV Data</button>
        </div>
      </div>
    );
  };

  return (
    <div className="overview">
      <div className="overview-tabs">
        {tabConfig.map(tab => (
          <button
            key={tab.id}
            className={`overview-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'skills' && renderSkillSessions()}
        {activeTab === 'partnerships' && renderPartnerships()}
        {activeTab === 'reports' && renderReports()}
      </div>
    </div>
  );
}
