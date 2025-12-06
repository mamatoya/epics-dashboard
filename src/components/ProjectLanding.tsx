import { useState, useRef } from 'react';
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

type SectionId = 'description' | 'feed' | 'journey' | 'mentoring';

// Feed types
interface FeedMedia {
  type: 'image' | 'video' | 'gif';
  url: string;
}

interface FeedReaction {
  emoji: string;
  count: number;
}

interface FeedPost {
  id: string;
  content: string;
  media?: FeedMedia[];
  reactions: FeedReaction[];
  timestamp: string;
}

export function ProjectLanding() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProjectById(projectId) : undefined;
  const [activeSection, setActiveSection] = useState<SectionId | null>('description');

  // Editable description state
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(project?.description || '');

  // Feed state
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([
    {
      id: '1',
      content: 'Just finished the first prototype iteration! Check out the new design.',
      media: [{ type: 'image', url: '' }],
      reactions: [
        { emoji: '🔥', count: 2 },
        { emoji: '👏', count: 1 }
      ],
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      content: 'Great progress team! Remember to document the safety considerations before the review next week.',
      reactions: [{ emoji: '👍', count: 2 }],
      timestamp: '1 day ago'
    },
    {
      id: '3',
      content: 'Updated the budget spreadsheet with the new component costs.',
      reactions: [],
      timestamp: '2 days ago'
    }
  ]);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostMedia, setNewPostMedia] = useState<FeedMedia[]>([]);
  const feedFileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: SectionId) => {
    setActiveSection(activeSection === section ? null : section);
  };

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

  // Feed handlers
  const handleFeedMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const isImage = file.type.startsWith('image/');
      const isGif = file.type === 'image/gif';

      if (isImage || isVideo) {
        const url = URL.createObjectURL(file);
        const media: FeedMedia = {
          type: isGif ? 'gif' : isVideo ? 'video' : 'image',
          url
        };
        setNewPostMedia(prev => [...prev, media]);
      }
    });

    if (feedFileInputRef.current) {
      feedFileInputRef.current.value = '';
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim() && newPostMedia.length === 0) return;

    const newPost: FeedPost = {
      id: Date.now().toString(),
      content: newPostContent.trim(),
      media: newPostMedia.length > 0 ? newPostMedia : undefined,
      reactions: [],
      timestamp: 'Just now'
    };

    setFeedPosts(prev => [newPost, ...prev]);
    setNewPostContent('');
    setNewPostMedia([]);
  };

  const handleAddReaction = (postId: string, emoji: string) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;

      const existingReaction = post.reactions.find(r => r.emoji === emoji);
      if (existingReaction) {
        // Toggle - increment or decrement
        const newCount = existingReaction.count + 1;
        return {
          ...post,
          reactions: post.reactions.map(r =>
            r.emoji === emoji ? { ...r, count: newCount } : r
          )
        };
      } else {
        // New reaction
        return {
          ...post,
          reactions: [...post.reactions, { emoji, count: 1 }]
        };
      }
    }));
  };

  const handleRemovePostMedia = (index: number) => {
    setNewPostMedia(prev => prev.filter((_, i) => i !== index));
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
      activeSection={activeSection}
      toggleSection={toggleSection}
      isEditingDescription={isEditingDescription}
      setIsEditingDescription={setIsEditingDescription}
      editedDescription={editedDescription}
      setEditedDescription={setEditedDescription}
      handleSaveDescription={handleSaveDescription}
      handleCancelEdit={handleCancelEdit}
      feedPosts={feedPosts}
      newPostContent={newPostContent}
      setNewPostContent={setNewPostContent}
      newPostMedia={newPostMedia}
      feedFileInputRef={feedFileInputRef}
      handleFeedMediaUpload={handleFeedMediaUpload}
      handleCreatePost={handleCreatePost}
      handleAddReaction={handleAddReaction}
      handleRemovePostMedia={handleRemovePostMedia}
    />
  );
}

// Mentoring Section Component
interface MentoringSectionProps {
  project: Project;
}

interface DeliverableReview {
  id: string;
  name: string;
  status: 'pending' | 'reviewed' | 'approved' | 'needs-revision';
  feedback?: string;
  reviewedDate?: string;
}

// Kanban task type
interface KanbanTask {
  id: string;
  title: string;
  column: 'backlog' | 'in-progress' | 'blocked' | 'done';
}

function MentoringSection({ project: _project }: MentoringSectionProps) {
  // Weekly progress report link (set by students)
  const [progressReportLink, setProgressReportLink] = useState('');
  const [savedProgressLink, setSavedProgressLink] = useState('');
  const [isEditingLink, setIsEditingLink] = useState(false);

  // Key deliverables to review
  const [deliverableReviews, setDeliverableReviews] = useState<DeliverableReview[]>([
    { id: 'sow', name: 'Statement of Work', status: 'approved', reviewedDate: '2025-09-15' },
    { id: 'semester-plan', name: 'Semester Plan', status: 'approved', reviewedDate: '2025-09-20' },
    { id: 'user-needs', name: 'User Needs & Requirements', status: 'reviewed', reviewedDate: '2025-10-05', feedback: 'Good start, consider adding accessibility requirements' },
    { id: 'design-doc', name: 'Design Document', status: 'needs-revision', feedback: 'Missing safety considerations section' },
    { id: 'budget', name: 'Budget & Testing Plan', status: 'pending' },
  ]);


  // Kanban board state
  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>([
    { id: '1', title: 'Review budget proposal', column: 'in-progress' },
    { id: '2', title: 'Schedule CP meeting', column: 'done' },
    { id: '3', title: 'Get safety approval', column: 'blocked' },
    { id: '4', title: 'Update design doc', column: 'backlog' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  // Mentor task adding
  const [newMentorTaskName, setNewMentorTaskName] = useState('');
  const [addingMentorTask, setAddingMentorTask] = useState(false);

  const handleAddMentorTask = () => {
    if (!newMentorTaskName.trim()) return;
    const newTask: DeliverableReview = {
      id: Date.now().toString(),
      name: newMentorTaskName.trim(),
      status: 'pending'
    };
    setDeliverableReviews(prev => [...prev, newTask]);
    setNewMentorTaskName('');
    setAddingMentorTask(false);
  };

  const handleDeleteMentorTask = (id: string) => {
    setDeliverableReviews(prev => prev.filter(d => d.id !== id));
  };

  const handleDeliverableAction = (id: string, action: 'approve' | 'needs-revision') => {
    setDeliverableReviews(prev => prev.map(d =>
      d.id === id ? { ...d, status: action === 'approve' ? 'approved' : 'needs-revision', reviewedDate: new Date().toISOString().split('T')[0] } : d
    ));
  };

  const handleSaveProgressLink = () => {
    setSavedProgressLink(progressReportLink);
    setIsEditingLink(false);
  };

  // Kanban functions
  const handleAddTask = (column: KanbanTask['column']) => {
    if (!newTaskTitle.trim()) return;
    const newTask: KanbanTask = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      column
    };
    setKanbanTasks(prev => [...prev, newTask]);
    setNewTaskTitle('');
    setAddingToColumn(null);
  };

  const handleMoveTask = (taskId: string, newColumn: KanbanTask['column']) => {
    setKanbanTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, column: newColumn } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setKanbanTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksByColumn = (column: KanbanTask['column']) => {
    return kanbanTasks.filter(task => task.column === column);
  };

  const monthlyCheckInFormUrl = 'https://forms.office.com/Pages/ResponsePage.aspx?id=y474QWPKTUCX3asKFp_ROMFH0WBZkddBg6kD0lM8dhxUNEFVS0pGSEdWQ09ZNFA0NVQwWU1ERUVXUSQlQCN0PWcu';

  return (
    <div className="mentoring-section">
      <div className="mentoring-header">
        <h2>Mentor Corner</h2>
        <p className="mentoring-intro">
          As an Academic Associate (AA), you oversee project management and ensure deliverables meet industry standards.
          The team is responsible for completing work; your role is to guide, review, and sign off.
        </p>
      </div>

      {/* Quick Access Links */}
      <div className="quick-links-bar">
        <div className="quick-link-item">
          <span className="quick-link-label">Monthly Check-in Form:</span>
          <a
            href={monthlyCheckInFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="quick-link-btn"
          >
            Open Form
          </a>
        </div>
        <div className="quick-link-item">
          <span className="quick-link-label">Weekly Progress Report:</span>
          {savedProgressLink ? (
            <div className="progress-link-display">
              <a
                href={savedProgressLink}
                target="_blank"
                rel="noopener noreferrer"
                className="quick-link-btn"
              >
                View Report
              </a>
              <button
                className="edit-link-btn"
                onClick={() => {
                  setProgressReportLink(savedProgressLink);
                  setIsEditingLink(true);
                }}
              >
                Edit
              </button>
            </div>
          ) : isEditingLink ? (
            <div className="link-input-group">
              <input
                type="url"
                value={progressReportLink}
                onChange={(e) => setProgressReportLink(e.target.value)}
                placeholder="Paste report URL..."
                className="link-input"
              />
              <button className="save-link-btn" onClick={handleSaveProgressLink}>Save</button>
              <button className="cancel-link-btn" onClick={() => setIsEditingLink(false)}>Cancel</button>
            </div>
          ) : (
            <button
              className="add-link-btn"
              onClick={() => setIsEditingLink(true)}
            >
              + Add Link (Students)
            </button>
          )}
        </div>
      </div>

      <div className="mentoring-grid">
        {/* Top row: Mentor Tasks + Student Tasks */}
        <div className="mentoring-top-row">
          {/* Mentor Tasks */}
          <div className="mentoring-card">
            <div className="card-header-with-action">
              <h3>Mentor Tasks</h3>
              {!addingMentorTask && (
                <button
                  className="add-task-header-btn"
                  onClick={() => setAddingMentorTask(true)}
                >
                  + Add
                </button>
              )}
            </div>

            {addingMentorTask && (
              <div className="add-mentor-task-form">
                <input
                  type="text"
                  value={newMentorTaskName}
                  onChange={(e) => setNewMentorTaskName(e.target.value)}
                  placeholder="Task name..."
                  className="task-input-compact"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddMentorTask();
                    if (e.key === 'Escape') setAddingMentorTask(false);
                  }}
                />
                <button className="add-task-confirm-compact" onClick={handleAddMentorTask}>+</button>
                <button className="add-task-cancel-compact" onClick={() => setAddingMentorTask(false)}>×</button>
              </div>
            )}

            <div className="mentor-tasks-vertical">
              {(['pending', 'reviewed', 'approved'] as const).map(status => {
                const statusLabels = {
                  pending: 'Not Reviewed',
                  reviewed: 'Reviewing',
                  approved: 'Approved'
                };
                const deliverablesByStatus = deliverableReviews.filter(d =>
                  status === 'reviewed' ? (d.status === 'reviewed' || d.status === 'needs-revision') : d.status === status
                );

                return (
                  <div key={status} className={`mentor-lane lane-${status}`}>
                    <div className="kanban-lane-header">
                      <span className="lane-title">{statusLabels[status]}</span>
                      <span className="lane-count">{deliverablesByStatus.length}</span>
                    </div>
                    <div className="kanban-lane-tasks">
                      {deliverablesByStatus.map(deliverable => (
                        <div key={deliverable.id} className={`mentor-task-compact status-${deliverable.status}`}>
                          <span className="task-title">{deliverable.name}</span>
                          <div className="task-actions">
                            {status !== 'approved' && (
                              <button
                                className="task-move-btn approve-btn"
                                onClick={() => handleDeliverableAction(deliverable.id, 'approve')}
                                title="Approve"
                              >
                                ✓
                              </button>
                            )}
                            {status === 'approved' && (
                              <button
                                className="task-move-btn unapprove-btn"
                                onClick={() => handleDeliverableAction(deliverable.id, 'needs-revision')}
                                title="Move back"
                              >
                                ↑
                              </button>
                            )}
                            <button
                              className="task-delete-btn"
                              onClick={() => handleDeleteMentorTask(deliverable.id)}
                              title="Delete"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Board - Vertical Layout */}
          <div className="mentoring-card kanban-section">
            <h3>Student Tasks</h3>

            <div className="kanban-board-vertical">
              {(['backlog', 'in-progress', 'blocked', 'done'] as const).map(column => (
                <div key={column} className={`kanban-lane lane-${column}`}>
                  <div className="kanban-lane-header">
                    <span className="lane-title">
                      {column === 'backlog' && 'Backlog'}
                      {column === 'in-progress' && 'In Progress'}
                      {column === 'blocked' && 'Blocked'}
                      {column === 'done' && 'Done'}
                    </span>
                    <span className="lane-count">{getTasksByColumn(column).length}</span>
                  </div>

                  <div className="kanban-lane-tasks">
                    {getTasksByColumn(column).map(task => (
                      <div key={task.id} className="kanban-task-compact">
                        <span className="task-title">{task.title}</span>
                        <div className="task-actions">
                          {column !== 'backlog' && (
                            <button
                              className="task-move-btn"
                              onClick={() => handleMoveTask(task.id, column === 'in-progress' ? 'backlog' : column === 'blocked' ? 'in-progress' : 'blocked')}
                              title="Move up"
                            >
                              ↑
                            </button>
                          )}
                          {column !== 'done' && (
                            <button
                              className="task-move-btn"
                              onClick={() => handleMoveTask(task.id, column === 'backlog' ? 'in-progress' : column === 'in-progress' ? 'blocked' : 'done')}
                              title="Move down"
                            >
                              ↓
                            </button>
                          )}
                          <button
                            className="task-delete-btn"
                            onClick={() => handleDeleteTask(task.id)}
                            title="Delete"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                    {addingToColumn === column ? (
                      <div className="add-task-form-compact">
                        <input
                          type="text"
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          placeholder="Task..."
                          className="task-input-compact"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddTask(column);
                            if (e.key === 'Escape') setAddingToColumn(null);
                          }}
                        />
                        <button className="add-task-confirm-compact" onClick={() => handleAddTask(column)}>+</button>
                      </div>
                    ) : (
                      <button
                        className="add-task-btn-compact"
                        onClick={() => {
                          setAddingToColumn(column);
                          setNewTaskTitle('');
                        }}
                      >
                        +
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main content component to avoid conditional hook calls
interface ProjectLandingContentProps {
  project: Project;
  activeSection: SectionId | null;
  toggleSection: (section: SectionId) => void;
  isEditingDescription: boolean;
  setIsEditingDescription: (val: boolean) => void;
  editedDescription: string;
  setEditedDescription: (val: string) => void;
  handleSaveDescription: () => void;
  handleCancelEdit: () => void;
  feedPosts: FeedPost[];
  newPostContent: string;
  setNewPostContent: (val: string) => void;
  newPostMedia: FeedMedia[];
  feedFileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFeedMediaUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreatePost: () => void;
  handleAddReaction: (postId: string, emoji: string) => void;
  handleRemovePostMedia: (index: number) => void;
}

function ProjectLandingContent({
  project,
  activeSection,
  toggleSection,
  isEditingDescription,
  setIsEditingDescription,
  editedDescription,
  setEditedDescription,
  handleSaveDescription,
  handleCancelEdit,
  feedPosts,
  newPostContent,
  setNewPostContent,
  newPostMedia,
  feedFileInputRef,
  handleFeedMediaUpload,
  handleCreatePost,
  handleAddReaction,
  handleRemovePostMedia,
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
          {/* Section Tiles */}
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

          {/* Expandable Sections */}
          <div className={`expandable-section ${activeSection === 'description' ? 'expanded' : ''}`}>
            {activeSection === 'description' && (
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
            )}
          </div>

          <div className={`expandable-section ${activeSection === 'feed' ? 'expanded' : ''}`}>
            {activeSection === 'feed' && (
              <div className="section-card feed-section">
                <h2>Team Feed</h2>

                {/* New Post Composer */}
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

                {/* Feed Posts */}
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

          <div className={`expandable-section ${activeSection === 'journey' ? 'expanded' : ''}`}>
            {activeSection === 'journey' && (
              <DeliverableTimeline project={project} />
            )}
          </div>

          <div className={`expandable-section ${activeSection === 'mentoring' ? 'expanded' : ''}`}>
            {activeSection === 'mentoring' && (
              <MentoringSection project={project} />
            )}
          </div>
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
