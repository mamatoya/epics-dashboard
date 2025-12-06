export type HealthStatus = 'no-pulse' | 'on-track' | 'at-risk' | 'blocked' | 'completed';

export type Campus = 'Tempe' | 'Polytechnic' | 'West Valley';

export type DeliverableStatus = 'none' | 'red' | 'yellow' | 'green';

export type ProjectStage = 1 | 2 | 3;

export interface DeliverableApprovals {
  aa?: boolean;    // Academic Associate
  cp?: boolean;    // Community Partner
  ta?: boolean;    // Teaching Assistant (UGTA)
  instructor?: boolean;
}

export interface DeliverableSubmission {
  status: DeliverableStatus;
  url?: string;
  approvals?: DeliverableApprovals;
}

export interface Deliverable {
  id: string;
  name: string;
  dueDate: string;
  dueDateAlt?: string; // Alternative due date for Monday teams
  isTeamDeliverable: boolean;
  stages?: ProjectStage[]; // If specified, only applies to these stages
  isIndonesia?: boolean; // If true, only for Indonesia projects
  isFSE104?: boolean; // If true, only for FSE104 students
}

export interface Blocker {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  dateAdded: string;
}

export interface ProjectMedia {
  type: 'image' | 'video';
  url: string;
  caption?: string;
}

export type ProjectCategory = 'Community Development' | 'Education' | 'Health' | 'Sustainability';

export interface MeetingSchedule {
  day: string;
  time: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  communityPartner: string;
  teamMembers: string[];
  portfolioManager: string; // Instructor responsible for the project
  industryMentor: string; // Academic Associate providing industry guidance
  healthStatus: HealthStatus;
  blockers: Blocker[];
  oneDriveUrl: string;
  media: ProjectMedia[];
  lastUpdated: string;
  semester: string;
  category: ProjectCategory;
  campus?: Campus;
  meetingTime?: MeetingSchedule;
  springStatus?: string; // Spring 2026 continuation status
  designReviewScore?: number; // Median score from design reviews (0-1 scale)
  stage?: ProjectStage; // Project stage (1, 2, or 3)
  isIndonesia?: boolean; // Indonesia project flag
  deliverables?: Record<string, DeliverableSubmission>; // Deliverable submissions by deliverable ID
}
