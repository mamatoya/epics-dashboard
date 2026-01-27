import { useState, useMemo } from 'react';
import { projects } from '../data/projects';
import { ProjectTile } from './ProjectTile';
import './Dashboard.css';

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const filteredProjects = useMemo(() => {
    const filtered = projects.filter(project => {
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.communityPartner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPinned = !showPinnedOnly || project.pinned;

      return matchesSearch && matchesPinned;
    });
    // Sort pinned projects to the top
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  }, [searchQuery, showPinnedOnly]);

  return (
    <div className="dashboard">
      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <label className="pinned-toggle">
          <input
            type="checkbox"
            checked={showPinnedOnly}
            onChange={(e) => setShowPinnedOnly(e.target.checked)}
          />
          <span className="toggle-label">My Teams</span>
        </label>
      </div>

      <div className="projects-grid">
        {filteredProjects.map(project => (
          <ProjectTile key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="no-results">
          <p>No projects match your filters.</p>
        </div>
      )}
    </div>
  );
}
