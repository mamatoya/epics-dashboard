import { useState } from 'react';
import './OrgChart.css';

interface OrgChartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OrgChartModal({ isOpen, onClose }: OrgChartProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content org-chart-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <h2>EPICS Organization</h2>

        {/* Visual Org Chart */}
        <div className="org-chart">
          <div className="org-level org-top">
            <div className="org-node director-node">
              <div className="node-icon">👔</div>
              <div className="node-title">Director</div>
            </div>
          </div>

          <div className="org-connector vertical"></div>

          <div className="org-level org-middle">
            <div className="org-node instructor-node">
              <div className="node-icon">📚</div>
              <div className="node-title">Instructor</div>
              <div className="node-subtitle">Portfolio Manager</div>
            </div>
          </div>

          <div className="org-connector vertical"></div>

          <div className="org-level org-bottom">
            <div className="org-node aa-node">
              <div className="node-icon">🎯</div>
              <div className="node-title">AA</div>
              <div className="node-subtitle">Industry Mentor</div>
            </div>
            <div className="org-node ta-node">
              <div className="node-icon">🤝</div>
              <div className="node-title">UGTA</div>
              <div className="node-subtitle">Teaching Assistant</div>
            </div>
          </div>

          <div className="org-connector vertical"></div>

          <div className="org-level org-base">
            <div className="org-node project-node">
              <div className="node-icon">🚀</div>
              <div className="node-title">Project Team</div>
              <div className="node-subtitle">Students + Community Partner</div>
            </div>
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="role-descriptions">
          <div className="role-card director-card">
            <h3>👔 Director</h3>
            <p>
              Set up Semester (CP, AA, UGTA, Grader, Canvas, team formation, key documentation: peer evals, DR questionnaire, etc.).
              Once the semester is in motion, the Director focuses on their class and the <strong>top 10% teams</strong> (Venture Devils, High Profile, Ready to Deliver etc.).
            </p>
          </div>

          <div className="role-card instructor-card">
            <h3>📚 Instructor</h3>
            <p>
              Community Partner assistance, team dynamic issues, barriers (storage, materials, lack of skill set), connect to ASU resources.
              <strong>Portfolio managers</strong> who review all forms to identify barriers and provide teams insight on how to address them.
            </p>
          </div>

          <div className="role-card aa-card">
            <h3>🎯 Academic Associate (AA)</h3>
            <p>
              Project Management (SOW, Semester Project Timeline, Weekly Progress), aids in large project issues students might be unaware of
              (regulations, maintenance, safety, feasibility type issues). Helps confirm importance of specific design documents
              (user needs, design requirements, problem statement, etc.). <strong>SME's and Project Management Aide</strong>.
            </p>
          </div>

          <div className="role-card ta-card">
            <h3>🤝 UGTA (Teaching Assistant)</h3>
            <p>
              Reviews weekly class assignments to provide feedback / address EPICS systematic issues (budget, not knowing how to do an assignment, etc.).
              <strong>Work colleagues</strong> who support students day-to-day.
            </p>
          </div>
        </div>

        {/* Framework */}
        <div className="framework-section">
          <h3>How It Works Together</h3>
          <div className="framework-diagram">
            <div className="framework-item">
              <span className="framework-icon">👤</span>
              <span className="framework-text">A student is on a project</span>
            </div>
            <div className="framework-arrow">→</div>
            <div className="framework-item">
              <span className="framework-icon">📋</span>
              <span className="framework-text">Each project has 1 TA, 1 AA, 1 Instructor</span>
            </div>
            <div className="framework-arrow">→</div>
            <div className="framework-item">
              <span className="framework-icon">📊</span>
              <span className="framework-text">1 Instructor manages many projects</span>
            </div>
            <div className="framework-arrow">→</div>
            <div className="framework-item">
              <span className="framework-icon">👁️</span>
              <span className="framework-text">Director oversees all instructors & projects</span>
            </div>
          </div>
        </div>

        {/* Check-in Timeline */}
        <div className="checkin-section">
          <h3>Check-in Timeline</h3>
          <div className="checkin-timeline">
            <div className="checkin-item">
              <div className="checkin-week">Week 4</div>
              <div className="checkin-badge ta-badge">TA Form</div>
            </div>
            <div className="checkin-item">
              <div className="checkin-week">Week 6</div>
              <div className="checkin-badge aa-badge">AA Form</div>
            </div>
            <div className="checkin-item">
              <div className="checkin-week">Week 8</div>
              <div className="checkin-badge ta-badge">TA Form</div>
            </div>
            <div className="checkin-item highlight">
              <div className="checkin-week">Week 10-11</div>
              <div className="checkin-badge dr-badge">Design Review</div>
              <div className="checkin-note">Outside comments</div>
            </div>
            <div className="checkin-item">
              <div className="checkin-week">Week 12</div>
              <div className="checkin-badges">
                <div className="checkin-badge ta-badge">TA Form</div>
                <div className="checkin-badge aa-badge">AA Form</div>
              </div>
            </div>
          </div>
          <p className="checkin-summary">
            <strong>Flow:</strong> TA completes monthly check-in → AA reviews TA form & completes their own →
            Instructor reviews all forms to identify barriers (storage, materials, skill gaps) and guides teams on solutions.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OrgChartTile() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="team-card org-chart-tile" onClick={() => setIsModalOpen(true)}>
        <h3>Organization</h3>
        <div className="org-preview">
          <div className="preview-hierarchy">
            <div className="preview-node preview-director">Director</div>
            <div className="preview-line"></div>
            <div className="preview-node preview-instructor">Instructor</div>
            <div className="preview-line"></div>
            <div className="preview-row">
              <div className="preview-node preview-aa">AA</div>
              <div className="preview-node preview-ta">TA</div>
            </div>
          </div>
        </div>
        <p className="tile-hint">Click to view org chart & roles</p>
      </div>

      <OrgChartModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
