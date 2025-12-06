import { Link } from 'react-router-dom';
import type { Project, HealthStatus } from '../types/project';
import './ProjectTile.css';

interface ProjectTileProps {
  project: Project;
}

const statusConfig: Record<HealthStatus, { label: string; className: string; icon: string }> = {
  'no-pulse': { label: 'No Pulse', className: 'status-no-pulse', icon: '◌' },
  'on-track': { label: 'On Track', className: 'status-on-track', icon: '♥' },
  'at-risk': { label: 'At Risk', className: 'status-at-risk', icon: '♡' },
  'blocked': { label: 'Blocked', className: 'status-blocked', icon: '✕' },
  'completed': { label: 'Completed', className: 'status-completed', icon: '✓' }
};

// Get spring status display info
function getSpringStatusInfo(springStatus?: string): { label: string; className: string } | null {
  if (!springStatus) return null;

  const status = springStatus.toLowerCase();
  if (status.includes('delivering')) {
    return { label: 'Delivering', className: 'spring-delivering' };
  } else if (status.includes('not continuing')) {
    if (status.includes('revival')) {
      return { label: 'Revival Needed', className: 'spring-revival' };
    }
    return { label: 'Not Continuing', className: 'spring-not-continuing' };
  } else if (status.includes('monday') || status.includes('tuesday') || status.includes('wednesday') || status.includes('thursday')) {
    return { label: 'Continuing', className: 'spring-continuing' };
  }
  return null;
}

export function ProjectTile({ project }: ProjectTileProps) {
  const status = statusConfig[project.healthStatus];
  const springInfo = getSpringStatusInfo(project.springStatus);

  return (
    <div className="project-tile">
      <Link to={`/project/${project.id}`} className="tile-link">
        <div className="tile-header">
          <span className={`status-badge ${status.className}`}>
            <span className="status-icon">{status.icon}</span> {status.label}
          </span>
          <span className="category-tag">{project.category}</span>
        </div>

        <h3 className="tile-title">{project.name}</h3>
        <p className="tile-partner">{project.communityPartner}</p>

        {springInfo && (
          <div className="tile-metrics">
            <div className={`spring-status-badge ${springInfo.className}`}>
              {springInfo.label}
            </div>
          </div>
        )}

        {project.blockers.length > 0 && (
          <div className="blockers-preview">
            <span className="blocker-icon">!</span>
            <span>{project.blockers.length} blocker{project.blockers.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </Link>

      <div className="tile-footer">
        <a
          href={project.oneDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="onedrive-link"
          onClick={(e) => e.stopPropagation()}
        >
          OneDrive
        </a>
      </div>
    </div>
  );
}
