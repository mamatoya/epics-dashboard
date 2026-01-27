import { useState, useEffect } from 'react';
import type { Project } from '../types/project';
import './DeliverableTimeline.css';

interface DeliverableTimelineProps {
  project: Project;
}

// Type for tracking completed deliverables
type CompletedState = Record<string, boolean>;

// Design stages (director's framework)
const designStages = [
  { id: 'identification', name: 'Project Identification', phases: ['onboarding', 'discovery'] },
  { id: 'specification', name: 'Specification Development', phases: ['define'] },
  { id: 'conceptual', name: 'Conceptual Design', phases: ['ideate'] },
  { id: 'detailed', name: 'Detailed Design', phases: ['prototype'] },
  { id: 'service', name: 'Service & Maintenance', phases: ['validate'] },
  { id: 'delivery', name: 'Delivery', phases: ['deliver'] },
];

// Define phases with their deliverables in order
const phases = [
  {
    id: 'onboarding',
    name: 'Onboarding',
    week: '1-2',
    designStage: 'identification',
    description: 'Team formation & partner connection',
    deliverables: [
      { id: 'syllabus-quiz', name: 'Syllabus Quiz', isTeam: false },
      { id: 'project-sort-survey', name: 'Project Sort', isTeam: false },
      { id: 'team-summary-operating-agreement', name: 'Team Agreement', isTeam: true },
      { id: 'email-community-partner-week3', name: 'Email CP', isTeam: true },
    ]
  },
  {
    id: 'discovery',
    name: 'Discovery',
    week: '3-4',
    designStage: 'identification',
    description: 'Understand the problem & stakeholders',
    deliverables: [
      { id: 'interview-questions-agenda', name: 'Interview Questions', isTeam: true },
      { id: 'meeting-minutes-cp-1', name: 'Meeting Minutes', isTeam: true },
      { id: 'statement-of-work', name: 'Statement of Work', isTeam: true },
      { id: 'semester-plan', name: 'Semester Plan', isTeam: true },
    ]
  },
  {
    id: 'define',
    name: 'Define',
    week: '5-6',
    designStage: 'specification',
    description: 'Define requirements & research',
    deliverables: [
      { id: 'user-needs-design-requirements', name: 'User Needs & Requirements', isTeam: true },
      { id: 'stage1-design-doc-update-1', name: 'Design Doc #1', isTeam: true, stages: [1] },
      { id: 'stage23-design-update-budget-testing', name: 'Design/Budget/Testing', isTeam: true, stages: [2, 3] },
      { id: 'peer-eval-1', name: 'Peer Eval #1', isTeam: false },
    ]
  },
  {
    id: 'ideate',
    name: 'Ideate',
    week: '7-8',
    designStage: 'conceptual',
    description: 'Brainstorm & evaluate solutions',
    deliverables: [
      { id: 'competitor-analysis', name: 'Competitor Analysis', isTeam: true },
      { id: 'decision-matrix', name: 'Decision Matrix', isTeam: true },
      { id: 'design-review-draft', name: 'Design Review Draft', isTeam: true },
      { id: 'design-review-presentation', name: 'Design Review', isTeam: true },
    ]
  },
  {
    id: 'prototype',
    name: 'Prototype',
    week: '9-11',
    designStage: 'detailed',
    description: 'Build & test prototypes',
    deliverables: [
      { id: 'peer-eval-2', name: 'Peer Eval #2', isTeam: false },
      { id: 'design-review-feedback-impl', name: 'Implement Feedback', isTeam: true },
      { id: 'stage3-fmea', name: 'FMEA', isTeam: true, stages: [3] },
      { id: 'team-continuation-survey', name: 'Continuation Survey', isTeam: false },
    ]
  },
  {
    id: 'validate',
    name: 'Validate',
    week: '12-14',
    designStage: 'service',
    description: 'Test, verify & document',
    deliverables: [
      { id: 'design-doc-update-2', name: 'Design Doc #2', isTeam: true },
      { id: 'stage3-verification-validation', name: 'V&V', isTeam: true, stages: [3] },
      { id: 'stage3-user-service-manual', name: 'User Manual', isTeam: true, stages: [3] },
      { id: 'customer-satisfaction-questionnaire', name: 'Customer Survey', isTeam: true },
    ]
  },
  {
    id: 'deliver',
    name: 'Deliver',
    week: '15',
    designStage: 'delivery',
    description: 'Final deliverables & showcase',
    deliverables: [
      { id: 'final-design-document', name: 'Final Design Doc', isTeam: true },
      { id: 'transition-video', name: 'Transition Video', isTeam: true },
      { id: 'peer-eval-3', name: 'Peer Eval #3', isTeam: false },
      { id: 'final-showcase', name: 'Final Showcase', isTeam: true },
    ]
  }
];

// localStorage key for completed deliverables
const getStorageKey = (projectId: string) => `epics-deliverables-${projectId}`;

export function DeliverableTimeline({ project }: DeliverableTimelineProps) {
  // Initialize completed state from localStorage
  const initializeCompleted = (): CompletedState => {
    try {
      const stored = localStorage.getItem(getStorageKey(project.id));
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed to load deliverable state from localStorage', e);
    }
    return {};
  };

  const [completed, setCompleted] = useState<CompletedState>(initializeCompleted);

  // Save to localStorage whenever completed state changes
  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey(project.id), JSON.stringify(completed));
    } catch (e) {
      console.error('Failed to save deliverable state to localStorage', e);
    }
  }, [completed, project.id]);

  const toggleCompleted = (deliverableId: string) => {
    setCompleted(prev => ({
      ...prev,
      [deliverableId]: !prev[deliverableId]
    }));
  };

  const isDeliverableCompleted = (deliverableId: string): boolean => {
    return completed[deliverableId] || false;
  };

  // Calculate phase completion based on checked deliverables
  const getPhaseStatus = (phase: typeof phases[0]) => {
    const applicableDeliverables = phase.deliverables.filter(d => {
      if (d.stages && project.stage && !d.stages.includes(project.stage)) return false;
      return true;
    });

    if (applicableDeliverables.length === 0) return 'empty';

    const completedCount = applicableDeliverables.filter(d => isDeliverableCompleted(d.id)).length;
    const total = applicableDeliverables.length;

    if (completedCount === total) return 'complete';
    if (completedCount > 0) return 'in-progress';
    return 'pending';
  };

  // Calculate overall progress percentage
  const getOverallProgress = () => {
    const allDeliverables = phases.flatMap(phase =>
      phase.deliverables.filter(d => {
        if (d.stages && project.stage && !d.stages.includes(project.stage)) return false;
        return true;
      })
    );
    const completedCount = allDeliverables.filter(d => isDeliverableCompleted(d.id)).length;
    return Math.round((completedCount / allDeliverables.length) * 100);
  };

  // Check if a design stage is complete (all phases in it are complete)
  const isDesignStageComplete = (stageId: string) => {
    const stagePhasesIds = designStages.find(s => s.id === stageId)?.phases || [];
    const stagePhases = phases.filter(p => stagePhasesIds.includes(p.id));
    return stagePhases.every(p => getPhaseStatus(p) === 'complete' || getPhaseStatus(p) === 'empty');
  };

  // Check if gate is unlocked (previous stage complete)
  const isGateUnlocked = (currentStageId: string) => {
    const stageIndex = designStages.findIndex(s => s.id === currentStageId);
    if (stageIndex <= 0) return true; // First stage is always unlocked
    const prevStage = designStages[stageIndex - 1];
    return isDesignStageComplete(prevStage.id);
  };

  const overallProgress = getOverallProgress();

  return (
    <div className="deliverable-timeline">
      <div className="timeline-header">
        <h2>Project Journey</h2>
        <div className="progress-summary">
          <span className="progress-label">Semester Progress: {overallProgress}%</span>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <div className="progress-phases">
            {phases.map(phase => {
              const status = getPhaseStatus(phase);
              return (
                <div
                  key={phase.id}
                  className={`progress-segment ${status}`}
                  title={`${phase.name}: ${status}`}
                />
              );
            })}
          </div>
        </div>
        <div className="timeline-legend">
          <span className="legend-item"><span className="legend-dot status-none">○</span> Not Started</span>
          <span className="legend-item"><span className="legend-dot status-red">●</span> Needs Attention</span>
          <span className="legend-item"><span className="legend-dot status-yellow">●</span> In Progress</span>
          <span className="legend-item"><span className="legend-dot status-green">●</span> Complete</span>
        </div>
      </div>

      <div className="timeline-track">
        {phases.map((phase, index) => {
          const phaseStatus = getPhaseStatus(phase);
          const applicableDeliverables = phase.deliverables.filter(d => {
            if (d.stages && project.stage && !d.stages.includes(project.stage)) return false;
            return true;
          });

          if (applicableDeliverables.length === 0) return null;

          // Check if this is the first phase of a new design stage
          const prevPhase = index > 0 ? phases[index - 1] : null;
          const isNewDesignStage = !prevPhase || prevPhase.designStage !== phase.designStage;
          const designStage = designStages.find(s => s.id === phase.designStage);
          const gateUnlocked = designStage ? isGateUnlocked(designStage.id) : true;
          const stageComplete = designStage ? isDesignStageComplete(designStage.id) : false;

          return (
            <div key={phase.id} className={`timeline-phase phase-${phaseStatus}`}>
              {isNewDesignStage && designStage && (
                <div className="design-stage-header">
                  {index > 0 && (
                    <div className={`stage-gate ${gateUnlocked ? 'unlocked' : 'locked'}`}>
                      <span className="gate-icon">{gateUnlocked ? '◇' : '◆'}</span>
                      <span className="gate-label">Gate {designStages.findIndex(s => s.id === designStage.id)}</span>
                    </div>
                  )}
                  <span className={`design-stage-label ${stageComplete ? 'stage-complete' : ''}`}>
                    {designStage.name}
                    {stageComplete && <span className="stage-check">✓</span>}
                  </span>
                </div>
              )}
              <div className="phase-connector">
                {index > 0 && <div className="connector-line" />}
                <div className={`phase-node ${phaseStatus}`}>
                  {phaseStatus === 'complete' ? '✓' : index + 1}
                </div>
                {index < phases.length - 1 && <div className="connector-line" />}
              </div>

              <div className="phase-content">
                <div className="phase-header">
                  <h3>{phase.name}</h3>
                  <span className="phase-week">Week {phase.week}</span>
                </div>
                <p className="phase-description">{phase.description}</p>
                {index === 0 && project.id === 'food-web-food' && (
                  <a
                    href="https://www.youtube.com/watch?v=s88r_q7oufE"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="easter-egg"
                    title="🎵"
                  >
                    🌱
                  </a>
                )}

                <div className="phase-deliverables">
                  {applicableDeliverables.map(deliverable => {
                    const submission = project.deliverables?.[deliverable.id];
                    const isChecked = isDeliverableCompleted(deliverable.id);

                    return (
                      <div key={deliverable.id} className={`phase-deliverable ${isChecked ? 'status-green' : 'status-none'}`}>
                        <button
                          type="button"
                          className={`deliverable-checkbox ${isChecked ? 'checked' : ''}`}
                          onClick={() => toggleCompleted(deliverable.id)}
                          title={isChecked ? 'Mark as incomplete' : 'Mark as complete'}
                        >
                          {isChecked ? '✓' : '○'}
                        </button>
                        <span className={`deliverable-label ${isChecked ? 'completed' : ''}`}>
                          {submission?.url ? (
                            <a href={submission.url} target="_blank" rel="noopener noreferrer">
                              {deliverable.name}
                            </a>
                          ) : (
                            deliverable.name
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
