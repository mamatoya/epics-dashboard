import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../data/projects';
import type { HealthStatus, Project } from '../types/project';
import { DeliverableTimeline } from './DeliverableTimeline';
import './ProjectLanding.css';

const statusConfig: Record<HealthStatus, { label: string; className: string; icon: string }> = {
  'no-pulse': { label: 'No Pulse', className: 'status-no-pulse', icon: '◌' },
  'on-track': { label: 'On Track', className: 'status-on-track', icon: '♥' },
  'at-risk': { label: 'At Risk', className: 'status-at-risk', icon: '♡' },
  'blocked': { label: 'Blocked', className: 'status-blocked', icon: '✕' },
  'completed': { label: 'Completed', className: 'status-completed', icon: '✓' }
};

export function ProjectLanding() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;

  // Editable description state
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(project?.description || '');

  const handleSaveDescription = () => {
    // In a real app, this would save to a backend
    console.log('Saving description:', editedDescription);
    setIsEditingDescription(false);
    // TODO: Update project data
  };

  const handleCancelEdit = () => {
    setEditedDescription(project?.description || '');
    setIsEditingDescription(false);
  };

  if (!project) {
    return (
      <div className="project-landing">
        <div className="not-found">
          <h2>Project Not Found</h2>
          <p>The project you're looking for doesn't exist.</p>
          <Link to="/portfolio" className="back-link">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <ProjectLandingContent
      project={project}
      isEditingDescription={isEditingDescription}
      setIsEditingDescription={setIsEditingDescription}
      editedDescription={editedDescription}
      setEditedDescription={setEditedDescription}
      handleSaveDescription={handleSaveDescription}
      handleCancelEdit={handleCancelEdit}
    />
  );
}

// Main content component to avoid conditional hook calls
interface ProjectLandingContentProps {
  project: Project;
  isEditingDescription: boolean;
  setIsEditingDescription: (val: boolean) => void;
  editedDescription: string;
  setEditedDescription: (val: string) => void;
  handleSaveDescription: () => void;
  handleCancelEdit: () => void;
}

function ProjectLandingContent({
  project,
  isEditingDescription,
  setIsEditingDescription,
  editedDescription,
  setEditedDescription,
  handleSaveDescription,
  handleCancelEdit,
}: ProjectLandingContentProps) {
  const status = statusConfig[project.healthStatus];

  return (
    <div className="project-landing">
      <nav className="breadcrumb">
        <Link to="/portfolio">EPICS Projects</Link>
        <span className="separator">/</span>
        <span>{project.name}</span>
      </nav>

      <div className="project-content">
        <section className="main-content">
          {/* Section Tiles - Commented out for MVP scope
          <div className="section-tiles">
            <button
              className={`section-tile ${activeSection === 'description' ? 'active' : ''}`}
              onClick={() => toggleSection('description')}
            >
              <span className="tile-icon">📋</span>
              <span className="tile-label">Description</span>
            </button>
            <button
              className={`section-tile ${activeSection === 'feed' ? 'active' : ''}`}
              onClick={() => toggleSection('feed')}
            >
              <span className="tile-icon">💬</span>
              <span className="tile-label">Feed</span>
            </button>
            <button
              className={`section-tile ${activeSection === 'journey' ? 'active' : ''}`}
              onClick={() => toggleSection('journey')}
            >
              <span className="tile-icon">🗺️</span>
              <span className="tile-label">Journey</span>
            </button>
            <button
              className={`section-tile ${activeSection === 'mentoring' ? 'active' : ''}`}
              onClick={() => toggleSection('mentoring')}
            >
              <span className="tile-icon">🧭</span>
              <span className="tile-label">Mentoring</span>
            </button>
          </div>
          */}

          {/* Description Section - Always visible */}
          <div className="section-card">
            <div className="section-header">
              <h2>Description</h2>
              {!isEditingDescription && (
                <button
                  className="edit-btn"
                  onClick={() => setIsEditingDescription(true)}
                >
                  Edit
                </button>
              )}
            </div>
            {isEditingDescription ? (
              <div className="edit-description">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={6}
                  placeholder="Enter project description..."
                />
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSaveDescription}>Save</button>
                  <button className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            ) : (
              <p>{editedDescription || project.description}</p>
            )}
          </div>

          {/* Journey Section - Always visible */}
          <DeliverableTimeline project={project} />

          {/* Feed and Mentoring sections - Commented out for MVP scope
          <div className={`expandable-section ${activeSection === 'feed' ? 'expanded' : ''}`}>
            {activeSection === 'feed' && (
              <div className="section-card feed-section">
                <h2>Team Feed</h2>

                <div className="feed-composer">
                  <div className="composer-input-area">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share an update, ask a question, or post media..."
                      rows={2}
                    />
                    {newPostMedia.length > 0 && (
                      <div className="composer-media-preview">
                        {newPostMedia.map((media, index) => (
                          <div key={index} className="preview-item">
                            {media.type === 'video' ? (
                              <video src={media.url} className="preview-video" />
                            ) : (
                              <img src={media.url} alt="" className="preview-image" />
                            )}
                            <button
                              className="remove-preview-btn"
                              onClick={() => handleRemovePostMedia(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="composer-actions">
                    <button
                      className="composer-media-btn"
                      onClick={() => feedFileInputRef.current?.click()}
                      title="Add media"
                    >
                      📷
                    </button>
                    <input
                      ref={feedFileInputRef}
                      type="file"
                      accept="image/*,video/*,.gif"
                      multiple
                      onChange={handleFeedMediaUpload}
                      style={{ display: 'none' }}
                    />
                    <button
                      className="composer-post-btn"
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() && newPostMedia.length === 0}
                    >
                      Post
                    </button>
                  </div>
                </div>

                <div className="feed-posts">
                  {feedPosts.map(post => (
                    <div key={post.id} className="feed-post">
                      <div className="post-header">
                        <span className="post-timestamp">{post.timestamp}</span>
                      </div>
                      {post.content && <p className="post-content">{post.content}</p>}
                      {post.media && post.media.length > 0 && (
                        <div className="post-media">
                          {post.media.map((media, idx) => (
                            <div key={idx} className="post-media-item">
                              {media.type === 'video' ? (
                                media.url ? (
                                  <video src={media.url} controls className="post-video" />
                                ) : (
                                  <div className="media-placeholder">Video attached</div>
                                )
                              ) : (
                                media.url ? (
                                  <img src={media.url} alt="" className="post-image" />
                                ) : (
                                  <div className="media-placeholder">Image attached</div>
                                )
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="post-reactions">
                        {post.reactions.map((reaction, idx) => (
                          <button
                            key={idx}
                            className="reaction-btn"
                            onClick={() => handleAddReaction(post.id, reaction.emoji)}
                          >
                            {reaction.emoji} {reaction.count}
                          </button>
                        ))}
                        <div className="add-reaction-group">
                          {['👍', '❤️', '🔥', '👏', '🎉', '💡'].map(emoji => (
                            <button
                              key={emoji}
                              className="add-reaction-btn"
                              onClick={() => handleAddReaction(post.id, emoji)}
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={`expandable-section ${activeSection === 'mentoring' ? 'expanded' : ''}`}>
            {activeSection === 'mentoring' && (
              <MentoringSection project={project} />
            )}
          </div>
          */}
        </section>

        {/* Slide-out sidebar */}
        <div className="sidebar-container">
          <div className="sidebar-trigger">
            <span className="trigger-icon">‹</span>
          </div>
          <aside className="sidebar-slideout">
          <div className="sidebar-content">
            {/* Project Info */}
            <div className="sidebar-section">
              <h3>Project Info</h3>
              <dl className="info-list">
                <dt>Last Updated</dt>
                <dd>{project.lastUpdated}</dd>
                <dt>Semester</dt>
                <dd>{project.semester}</dd>
                <dt>Category</dt>
                <dd>{project.category}</dd>
              </dl>
            </div>

            <div className="sidebar-divider" />

            {/* Project Leadership */}
            <div className="sidebar-section">
              <h3>Project Leadership</h3>
              <dl className="info-list">
                <dt>Community Partner</dt>
                <dd>{project.communityPartner}</dd>
                <dt>Portfolio Manager</dt>
                <dd>{project.portfolioManager || 'TBD'}</dd>
                <dt>Industry Mentor</dt>
                <dd>{project.industryMentor || 'TBD'}</dd>
              </dl>
            </div>

            <div className="sidebar-divider" />

            {/* Health Status */}
            <div className="sidebar-section">
              <h3>Project Health</h3>
              <div className="sidebar-health-status">
                <span className={`health-badge ${status.className}`}>
                  <span className="health-icon">{status.icon}</span>
                  <span>{status.label}</span>
                </span>
              </div>
            </div>

            {/* Design Review Score */}
            {project.designReviewScore !== undefined && (
              <>
                <div className="sidebar-divider" />
                <div className="sidebar-section">
                  <h3>Design Review</h3>
                  <div className="sidebar-score">
                    <span className="sidebar-score-value">{(project.designReviewScore * 100).toFixed(0)}%</span>
                    <span className="sidebar-score-label">
                      {project.designReviewScore >= 0.9 ? 'Excellent' :
                       project.designReviewScore >= 0.7 ? 'Good' :
                       project.designReviewScore >= 0.5 ? 'Adequate' : 'Needs Work'}
                    </span>
                  </div>
                  <div className="sidebar-score-bar">
                    <div
                      className={`sidebar-score-fill ${
                        project.designReviewScore >= 0.9 ? 'score-excellent' :
                        project.designReviewScore >= 0.7 ? 'score-good' :
                        project.designReviewScore >= 0.5 ? 'score-adequate' : 'score-needs-improvement'
                      }`}
                      style={{ width: `${project.designReviewScore * 100}%` }}
                    />
                  </div>
                  <p className="sidebar-score-note">Fall 2025 median score</p>
                </div>
              </>
            )}

            {/* Project Resources */}
            {project.oneDriveUrl && (
              <>
                <div className="sidebar-divider" />
                <div className="sidebar-section">
                  <h3>Resources</h3>
                  <a
                    href={project.oneDriveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sidebar-resource-link"
                  >
                    <span className="link-icon">📁</span>
                    Open OneDrive
                  </a>
                </div>
              </>
            )}

            {/* Team Members */}
            {project.teamMembers.length > 0 && (
              <>
                <div className="sidebar-divider" />
                <div className="sidebar-section">
                  <h3>Student Team</h3>
                  <p className="team-count">{project.teamMembers.length} members</p>
                </div>
              </>
            )}

            {/* Blockers */}
            {project.blockers.length > 0 && (
              <>
                <div className="sidebar-divider" />
                <div className="sidebar-section blockers">
                  <h3>Blockers ({project.blockers.length})</h3>
                  <ul className="sidebar-blockers-list">
                    {project.blockers.map(blocker => (
                      <li key={blocker.id} className={`severity-${blocker.severity}`}>
                        <span className="blocker-badge">{blocker.severity}</span>
                        <span className="blocker-text">{blocker.description}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
