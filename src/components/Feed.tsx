import { useState, useMemo } from 'react';
import { getFeedPosts } from '../data/feed';
import type { FeedPost, FeedAuthorRole, FeedMedia } from '../types/feed';
import './Feed.css';

const roleConfig: Record<FeedAuthorRole, { label: string; className: string }> = {
  director: { label: 'Director', className: 'role-director' },
  mentor: { label: 'Industry Mentor', className: 'role-mentor' },
  instructor: { label: 'Instructor', className: 'role-instructor' },
  ta: { label: 'TA', className: 'role-ta' },
};

const tagConfig: Record<string, { label: string; className: string }> = {
  announcement: { label: 'Announcement', className: 'tag-announcement' },
  'heads-up': { label: 'Heads Up', className: 'tag-headsup' },
  shoutout: { label: 'Shoutout', className: 'tag-shoutout' },
  news: { label: 'News', className: 'tag-news' },
  deliverable: { label: 'Deliverable', className: 'tag-deliverable' },
};

// Tags to hide from the filter (still displayed on posts if used)
const hiddenFilterTags = ['tip', 'welcome', 'design-review', 'milestone', 'project-highlight'];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
    }
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  }
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function MediaItem({ media }: { media: FeedMedia }) {
  if (media.type === 'image') {
    return (
      <div className="media-item media-image">
        <img src={media.url} alt={media.caption || 'Post image'} />
        {media.caption && <p className="media-caption">{media.caption}</p>}
      </div>
    );
  }

  if (media.type === 'video') {
    return (
      <div className="media-item media-video">
        <video controls poster={media.thumbnail}>
          <source src={media.url} />
          Your browser does not support video playback.
        </video>
        {media.caption && <p className="media-caption">{media.caption}</p>}
      </div>
    );
  }

  if (media.type === 'youtube') {
    // Extract video ID from YouTube URL
    const videoId = media.url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/)?.[1];
    return (
      <div className="media-item media-youtube">
        <div className="video-wrapper">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={media.caption || 'YouTube video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        {media.caption && <p className="media-caption">{media.caption}</p>}
      </div>
    );
  }

  if (media.type === 'link') {
    return (
      <a href={media.url} target="_blank" rel="noopener noreferrer" className="media-item media-link">
        {media.thumbnail && (
          <div className="link-thumbnail">
            <img src={media.thumbnail} alt="" />
          </div>
        )}
        <div className="link-info">
          <span className="link-caption">{media.caption || media.url}</span>
          <span className="link-url">{new URL(media.url).hostname}</span>
        </div>
      </a>
    );
  }

  return null;
}

function PostCard({ post }: { post: FeedPost }) {
  const role = roleConfig[post.author.role];

  return (
    <article className={`feed-post ${post.pinned ? 'pinned' : ''}`}>
      {post.pinned && (
        <div className="pinned-indicator">
          <span className="pin-icon">📌</span> Pinned
        </div>
      )}

      <header className="post-header">
        <div className="author-avatar">
          {post.author.avatar ? (
            <img src={post.author.avatar} alt={post.author.name} />
          ) : (
            <span className="avatar-placeholder">
              {post.author.name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <div className="author-info">
          <span className="author-name">{post.author.name}</span>
          <span className={`author-role ${role.className}`}>{role.label}</span>
        </div>
        <time className="post-date" dateTime={post.createdAt}>
          {formatDate(post.createdAt)}
        </time>
      </header>

      {post.tags && post.tags.length > 0 && (
        <div className="post-tags">
          {post.tags.map(tag => {
            const config = tagConfig[tag] || { label: tag, className: 'tag-default' };
            return (
              <span key={tag} className={`post-tag ${config.className}`}>
                {config.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="post-content">
        {post.content.split('\n').map((paragraph, idx) => (
          paragraph.trim() ? <p key={idx}>{paragraph}</p> : <br key={idx} />
        ))}
      </div>

      {post.media && post.media.length > 0 && (
        <div className={`post-media media-count-${post.media.length}`}>
          {post.media.map((media, idx) => (
            <MediaItem key={idx} media={media} />
          ))}
        </div>
      )}
    </article>
  );
}

export function Feed() {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');

  const posts = useMemo(() => {
    let filtered = getFeedPosts();

    if (roleFilter !== 'all') {
      filtered = filtered.filter(post => post.author.role === roleFilter);
    }

    if (tagFilter !== 'all') {
      filtered = filtered.filter(post => post.tags?.includes(tagFilter));
    }

    return filtered;
  }, [roleFilter, tagFilter]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    getFeedPosts().forEach(post => post.tags?.forEach(tag => tags.add(tag)));
    // Filter out hidden tags from the filter list
    return Array.from(tags)
      .filter(tag => !hiddenFilterTags.includes(tag))
      .sort();
  }, []);

  return (
    <div className="feed-page">
      <div className="feed-filters">
        <div className="filter-group">
          <span className="filter-label">Role:</span>
          <div className="filter-chips">
            <button
              className={`filter-chip ${roleFilter === 'all' ? 'active' : ''}`}
              onClick={() => setRoleFilter('all')}
            >
              All
            </button>
            {Object.entries(roleConfig).map(([key, config]) => (
              <button
                key={key}
                className={`filter-chip ${roleFilter === key ? 'active' : ''}`}
                onClick={() => setRoleFilter(key)}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <span className="filter-label">Topic:</span>
          <div className="filter-chips">
            <button
              className={`filter-chip ${tagFilter === 'all' ? 'active' : ''}`}
              onClick={() => setTagFilter('all')}
            >
              All
            </button>
            {allTags.map(tag => {
              const config = tagConfig[tag] || { label: tag, className: 'tag-default' };
              return (
                <button
                  key={tag}
                  className={`filter-chip ${tagFilter === tag ? 'active' : ''}`}
                  onClick={() => setTagFilter(tag)}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="feed-main">
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts match your filters.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
