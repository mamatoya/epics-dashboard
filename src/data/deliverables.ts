import type { Deliverable } from '../types/project';

// Master list of deliverables for Fall 2025
// Dates should be updated each semester
export const deliverables: Deliverable[] = [
  // Week 1-2
  {
    id: 'syllabus-quiz',
    name: 'Syllabus Quiz',
    dueDate: '2025-08-31',
    isTeamDeliverable: false,
  },
  {
    id: 'project-sort-survey',
    name: 'Project Sort Survey',
    dueDate: '2025-08-28',
    isTeamDeliverable: false,
  },
  {
    id: 'team-summary-operating-agreement',
    name: 'Team Summary Document & Team Operating Agreement',
    dueDate: '2025-09-07',
    dueDateAlt: '2025-09-08', // Monday teams
    isTeamDeliverable: true,
  },
  {
    id: 'email-community-partner-week3',
    name: 'Email Community Partner to setup meeting (Week 3)',
    dueDate: '2025-09-07',
    dueDateAlt: '2025-09-08',
    isTeamDeliverable: true,
  },
  {
    id: 'interview-questions-agenda',
    name: 'Interview Questions / Meeting Agenda for Community Partner',
    dueDate: '2025-09-07',
    dueDateAlt: '2025-09-08',
    isTeamDeliverable: true,
  },
  {
    id: 'meeting-minutes-cp-1',
    name: 'Meeting Minutes with Community Partner',
    dueDate: '2025-09-14',
    isTeamDeliverable: true,
  },
  {
    id: 'draft-sow-semester-plan',
    name: 'Draft of Statement of Work and Semester Plan',
    dueDate: '2025-09-14',
    isTeamDeliverable: true,
  },

  // Indonesia Week 3
  {
    id: 'indo-email-cp',
    name: 'Email Community Partner to setup meeting',
    dueDate: '2025-09-14',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 4
  {
    id: 'statement-of-work',
    name: 'Statement of Work',
    dueDate: '2025-09-21',
    isTeamDeliverable: true,
  },
  {
    id: 'semester-plan',
    name: 'Semester Plan',
    dueDate: '2025-09-21',
    isTeamDeliverable: true,
  },

  // Indonesia Week 4
  {
    id: 'indo-team-operating-agreement',
    name: 'Team Operating Agreement',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-team-summary',
    name: 'Team Summary Document',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-interview-questions',
    name: 'Interview Questions for Community Partner',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 5
  {
    id: 'user-needs-design-requirements',
    name: 'User Need and Design Requirement Table',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
  },
  {
    id: 'stage1-design-doc-update-1',
    name: 'Design Document Update #1',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    stages: [1],
  },
  {
    id: 'stage23-project-checkin-1',
    name: 'Project Check-in with Instructor (Review SOW, Design Update, Budget/Testing Plan)',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    stages: [2, 3],
  },
  {
    id: 'stage23-design-update-budget-testing',
    name: 'Design Update, Budget and/or Testing Plan',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    stages: [2, 3],
  },

  // Indonesia Week 5
  {
    id: 'indo-meeting-minutes-cp',
    name: 'Meeting Minutes with Community Partner',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-draft-sow-semester-plan',
    name: 'Draft of Statement of Work and Semester Plan',
    dueDate: '2025-09-28',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 6
  {
    id: 'stage1-project-checkin',
    name: 'Project Check-in with Instructor (Review SOW, User Needs, Design Requirements, Research)',
    dueDate: '2025-10-05',
    isTeamDeliverable: true,
    stages: [1],
  },
  {
    id: 'stage23-design-doc-update-1',
    name: 'Design Document Update #1',
    dueDate: '2025-10-05',
    isTeamDeliverable: true,
    stages: [2, 3],
  },
  {
    id: 'peer-eval-1',
    name: 'TeamMates Peer Evaluation #1',
    dueDate: '2025-10-05',
    isTeamDeliverable: false,
  },

  // Indonesia Week 6
  {
    id: 'indo-sow-key-contacts',
    name: 'Statement of Work and Key Contacts',
    dueDate: '2025-10-05',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-semester-plan',
    name: 'Semester Plan',
    dueDate: '2025-10-05',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 7
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis/Benchmarking Table',
    dueDate: '2025-10-12',
    isTeamDeliverable: true,
  },

  // Indonesia Week 7
  {
    id: 'indo-user-needs-design-req',
    name: 'User Needs and Design Requirements Table',
    dueDate: '2025-10-12',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-design-update-budget-testing',
    name: 'Design Update, Budget and Testing Plan',
    dueDate: '2025-10-12',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-design-doc-update-1',
    name: 'Design Document Update #1',
    dueDate: '2025-10-12',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-project-checkin',
    name: 'Project Check-in with Instructor',
    dueDate: '2025-10-12',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 8
  {
    id: 'decision-matrix',
    name: 'Decision Matrix',
    dueDate: '2025-10-19',
    isTeamDeliverable: true,
  },
  {
    id: 'design-review-draft',
    name: 'Design Review Presentation (initial draft)',
    dueDate: '2025-10-19',
    isTeamDeliverable: true,
  },
  {
    id: 'stage1-design-update-budget-testing',
    name: 'Design Update, Budget Submission and/or Testing Plan',
    dueDate: '2025-10-19',
    isTeamDeliverable: true,
    stages: [1],
  },

  // Week 8 - Design Review
  {
    id: 'design-review-presentation',
    name: 'Design Review Presentation',
    dueDate: '2025-10-23',
    isTeamDeliverable: true,
  },

  // Week 9
  {
    id: 'peer-eval-2',
    name: 'TeamMates Peer Evaluation #2',
    dueDate: '2025-10-26',
    isTeamDeliverable: false,
  },

  // Indonesia Week 9
  {
    id: 'indo-benchmarking',
    name: 'Benchmarking and Competitor Analysis',
    dueDate: '2025-10-26',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 10
  {
    id: 'design-review-feedback-impl',
    name: 'Complete implementation of Design Review Feedback',
    dueDate: '2025-11-02',
    isTeamDeliverable: true,
  },
  {
    id: 'fse104-cardboard-prototype',
    name: 'FSE104 Cardboard Prototyping Activity',
    dueDate: '2025-11-02',
    isTeamDeliverable: false,
    isFSE104: true,
  },

  // Indonesia Week 10
  {
    id: 'indo-decision-matrix',
    name: 'Decision Matrix',
    dueDate: '2025-11-02',
    isTeamDeliverable: true,
    isIndonesia: true,
  },
  {
    id: 'indo-design-review-draft',
    name: 'Draft of Design Review Presentation',
    dueDate: '2025-11-02',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 11
  {
    id: 'stage3-fmea',
    name: 'FMEA (Failure Mode and Effects Analysis)',
    dueDate: '2025-11-09',
    isTeamDeliverable: true,
    stages: [3],
  },
  {
    id: 'epics-elite-pitch-optional',
    name: 'EPICS Elite Pitch Competition (Optional)',
    dueDate: '2025-11-09',
    isTeamDeliverable: true,
  },
  {
    id: 'team-continuation-survey',
    name: 'Team Continuation Survey',
    dueDate: '2025-11-09',
    isTeamDeliverable: false,
  },

  // Indonesia Week 11
  {
    id: 'indo-design-review',
    name: 'Design Review Presentation',
    dueDate: '2025-11-09',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Week 12
  {
    id: 'design-doc-update-2',
    name: 'Design Document Update #2',
    dueDate: '2025-11-16',
    isTeamDeliverable: true,
  },
  {
    id: 'stage3-verification-validation',
    name: 'Verification and Validation',
    dueDate: '2025-11-16',
    isTeamDeliverable: true,
    stages: [3],
  },

  // Week 12 - EPICS Elite
  {
    id: 'epics-elite-competition',
    name: 'EPICS Elite Pitch Competition',
    dueDate: '2025-11-18',
    isTeamDeliverable: true,
  },

  // Week 13
  {
    id: 'fse104-cad-3d-printing',
    name: 'FSE104 CAD and 3D Printing Assignment',
    dueDate: '2025-11-23',
    isTeamDeliverable: false,
    isFSE104: true,
  },
  {
    id: 'fse104-laser-cutting',
    name: 'FSE104 Laser Cutting Assignment',
    dueDate: '2025-11-23',
    isTeamDeliverable: false,
    isFSE104: true,
  },
  {
    id: 'stage3-user-service-manual',
    name: 'User and Service Manual',
    dueDate: '2025-11-23',
    isTeamDeliverable: true,
    stages: [3],
  },

  // Week 14
  {
    id: 'continuation-survey',
    name: 'Continuation Survey',
    dueDate: '2025-11-30',
    isTeamDeliverable: false,
  },
  {
    id: 'customer-satisfaction-questionnaire',
    name: 'Customer Satisfaction Questionnaire',
    dueDate: '2025-11-30',
    isTeamDeliverable: true,
  },
  {
    id: 'stage3-record-project-delivery',
    name: 'Record of Project Delivery',
    dueDate: '2025-11-30',
    isTeamDeliverable: true,
    stages: [3],
  },

  // Indonesia Week 14
  {
    id: 'indo-design-doc-update-2',
    name: 'Design Document #2 Update',
    dueDate: '2025-11-30',
    isTeamDeliverable: true,
    isIndonesia: true,
  },

  // Finals Week
  {
    id: 'final-design-document',
    name: 'Final Design Document Submission',
    dueDate: '2025-12-05',
    isTeamDeliverable: true,
  },
  {
    id: 'peer-eval-3',
    name: 'TeamMates Peer Evaluation #3',
    dueDate: '2025-12-05',
    isTeamDeliverable: false,
  },
  {
    id: 'team-eval-cp',
    name: 'Team Evaluation of Community Partner',
    dueDate: '2025-12-05',
    isTeamDeliverable: true,
  },
  {
    id: 'transition-video',
    name: 'Transition Video',
    dueDate: '2025-12-05',
    isTeamDeliverable: true,
  },
  {
    id: 'final-showcase',
    name: 'Final Showcase',
    dueDate: '2025-12-05',
    isTeamDeliverable: true,
  },
];

// Get deliverables applicable to a project
export function getProjectDeliverables(
  stage?: number,
  isIndonesia?: boolean,
  isFSE104?: boolean
): Deliverable[] {
  return deliverables.filter(d => {
    // Filter out Indonesia-specific deliverables for non-Indonesia projects
    if (d.isIndonesia && !isIndonesia) return false;

    // Filter out non-Indonesia deliverables for Indonesia projects (except shared ones)
    if (isIndonesia && !d.isIndonesia && d.id.startsWith('indo-')) return false;

    // Filter out FSE104-specific deliverables for non-FSE104 students
    if (d.isFSE104 && !isFSE104) return false;

    // Filter by stage if specified
    if (d.stages && stage && !d.stages.includes(stage as 1 | 2 | 3)) return false;

    return true;
  });
}

// Format date for display
export function formatDeliverableDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}
