import { useState, useMemo } from 'react';
import { projects } from '../data/projects';
import { ProjectTile } from './ProjectTile';
import './Dashboard.css';

const statusFilters = [
  { value: 'all', label: 'All Projects' },
  { value: 'no-pulse', label: 'No Pulse' },
  { value: 'on-track', label: 'On Track' },
  { value: 'at-risk', label: 'At Risk' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'completed', label: 'Completed' }
];

const springStatusFilters = [
  { value: 'all', label: 'All Spring Status' },
  { value: 'continuing', label: 'Continuing' },
  { value: 'delivering', label: 'Delivering' },
  { value: 'not-continuing', label: 'Not Continuing' },
  { value: 'revival', label: 'Revival Needed' }
];

// Helper to determine spring status category
function getSpringStatusCategory(springStatus?: string): string {
  if (!springStatus) return 'unknown';
  const status = springStatus.toLowerCase();
  if (status.includes('delivering')) return 'delivering';
  if (status.includes('not continuing')) {
    if (status.includes('revival')) return 'revival';
    return 'not-continuing';
  }
  if (status.includes('monday') || status.includes('tuesday') || status.includes('wednesday') || status.includes('thursday')) {
    return 'continuing';
  }
  return 'unknown';
}

export function Dashboard() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [springFilter, setSpringFilter] = useState<string>('all');

  const categories = useMemo(() => {
    const cats = new Set(projects.map(p => p.category));
    return ['all', ...Array.from(cats).sort()];
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesStatus = statusFilter === 'all' || project.healthStatus === statusFilter;
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.communityPartner.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpring = springFilter === 'all' || getSpringStatusCategory(project.springStatus) === springFilter;

      return matchesStatus && matchesCategory && matchesSearch && matchesSpring;
    });
  }, [statusFilter, categoryFilter, searchQuery, springFilter]);

  const statusCounts = useMemo(() => {
    return {
      total: projects.length,
      'no-pulse': projects.filter(p => p.healthStatus === 'no-pulse').length,
      'on-track': projects.filter(p => p.healthStatus === 'on-track').length,
      'at-risk': projects.filter(p => p.healthStatus === 'at-risk').length,
      blocked: projects.filter(p => p.healthStatus === 'blocked').length,
      completed: projects.filter(p => p.healthStatus === 'completed').length
    };
  }, []);

  return (
    <div className="dashboard">
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-number">{statusCounts.total}</span>
          <span className="stat-label">Total Projects</span>
        </div>
        <div className="stat-item stat-no-pulse">
          <span className="stat-number">{statusCounts['no-pulse']}</span>
          <span className="stat-label">No Pulse</span>
        </div>
        <div className="stat-item stat-on-track">
          <span className="stat-number">{statusCounts['on-track']}</span>
          <span className="stat-label">On Track</span>
        </div>
        <div className="stat-item stat-at-risk">
          <span className="stat-number">{statusCounts['at-risk']}</span>
          <span className="stat-label">At Risk</span>
        </div>
        <div className="stat-item stat-blocked">
          <span className="stat-number">{statusCounts.blocked}</span>
          <span className="stat-label">Blocked</span>
        </div>
        <div className="stat-item stat-completed">
          <span className="stat-number">{statusCounts.completed}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          {statusFilters.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        <select
          value={springFilter}
          onChange={(e) => setSpringFilter(e.target.value)}
          className="filter-select"
        >
          {springStatusFilters.map(filter => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
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
