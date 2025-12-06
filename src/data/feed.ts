import type { FeedPost } from '../types/feed';

export const feedPosts: FeedPost[] = [
  {
    id: 'post-1',
    author: {
      name: 'Dr. James Collofello',
      role: 'director',
    },
    content: `Welcome to the Fall 2025 semester! I'm excited to see all the amazing projects taking shape this year. Remember, EPICS is about making a real difference in our community while developing your engineering skills.

Key dates to remember:
- Design Reviews: Week 7-8
- Final Showcase: Week 15

Let's make this semester count!`,
    tags: ['announcement', 'welcome'],
    pinned: true,
    createdAt: '2025-08-19T09:00:00Z',
  },
  {
    id: 'post-2',
    author: {
      name: 'Sarah Mitchell',
      role: 'instructor',
    },
    content: `Heads up teams! The Statement of Work deadline is approaching. Make sure you've met with your community partner at least once before submitting.

Pro tip: Use the meeting minutes template in the OneDrive to keep your documentation organized.`,
    tags: ['heads-up', 'deliverable'],
    createdAt: '2025-09-10T14:30:00Z',
  },
  {
    id: 'post-3',
    author: {
      name: 'Michael Chen',
      role: 'mentor',
    },
    content: `Just visited the Solar Panels for Community Centers team - incredible progress on their prototype! The engineering approach they're taking to optimize panel placement is impressive.

This is what EPICS is all about - real solutions for real communities.`,
    media: [
      {
        type: 'image',
        url: '/images/feed/solar-team.jpg',
        caption: 'Team presenting their solar panel placement optimization algorithm'
      }
    ],
    tags: ['shoutout'],
    createdAt: '2025-10-05T11:00:00Z',
  },
  {
    id: 'post-4',
    author: {
      name: 'Jessica Park',
      role: 'ta',
    },
    content: `Reminder: Peer Evaluation #2 is due this Friday! Please be thoughtful and constructive in your feedback - it helps your teammates grow.

If you're having any issues with your team dynamics, please reach out to your PM or instructor before the evaluation.`,
    tags: ['heads-up', 'deliverable'],
    createdAt: '2025-10-28T08:00:00Z',
  },
  {
    id: 'post-5',
    author: {
      name: 'Dr. James Collofello',
      role: 'director',
    },
    content: `Exciting news! We've been featured in ASU News for our community impact this semester. Special shoutout to all teams working on accessibility projects.

Check out the full article for highlights of what EPICS students are accomplishing.`,
    media: [
      {
        type: 'link',
        url: 'https://news.asu.edu',
        thumbnail: '/images/feed/asu-news-thumb.jpg',
        caption: 'ASU News: EPICS Students Making Community Impact'
      }
    ],
    tags: ['announcement', 'news'],
    createdAt: '2025-11-01T10:00:00Z',
  },
  {
    id: 'post-6',
    author: {
      name: 'David Rodriguez',
      role: 'mentor',
    },
    content: `Design Review week is here! A few tips from my industry experience:

1. Know your audience - explain technical concepts clearly
2. Be prepared for tough questions - they help you improve
3. Show your process, not just results
4. Practice your timing - respect the schedule

Good luck to all teams!`,
    tags: ['tip', 'design-review'],
    createdAt: '2025-10-14T09:30:00Z',
  },
];

export function getFeedPosts(): FeedPost[] {
  // Sort by pinned first, then by date (newest first)
  return [...feedPosts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

export function getFeedPostsByTag(tag: string): FeedPost[] {
  return getFeedPosts().filter(post => post.tags?.includes(tag));
}

export function getFeedPostsByRole(role: string): FeedPost[] {
  return getFeedPosts().filter(post => post.author.role === role);
}
