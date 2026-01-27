import { useState, useEffect } from 'react';
import './StandupTracker.css';

interface StandupTrackerProps {
  projectId: string;
}

interface StudentStandup {
  id: string;
  name: string;
  score: 0 | 1 | 2 | null;
}

// Fun creative name parts for generating placeholder names
const adjectives = [
  'Cosmic', 'Quantum', 'Electric', 'Turbo', 'Pixel', 'Neon', 'Cyber', 'Hyper',
  'Mega', 'Ultra', 'Super', 'Atomic', 'Solar', 'Lunar', 'Stellar', 'Galactic',
  'Swift', 'Blazing', 'Frozen', 'Thunder', 'Crystal', 'Shadow', 'Golden', 'Silver',
  'Mighty', 'Epic', 'Radical', 'Dynamic', 'Infinite', 'Phantom', 'Noble', 'Brave'
];

const nouns = [
  'Penguin', 'Phoenix', 'Dragon', 'Panda', 'Tiger', 'Falcon', 'Wolf', 'Bear',
  'Rocket', 'Comet', 'Ninja', 'Wizard', 'Knight', 'Ranger', 'Pioneer', 'Voyager',
  'Spark', 'Storm', 'Wave', 'Blaze', 'Frost', 'Thunder', 'Shadow', 'Echo',
  'Maverick', 'Ace', 'Scout', 'Captain', 'Legend', 'Hero', 'Genius', 'Prodigy'
];

const getStorageKey = (projectId: string) => `epics-standup-${projectId}`;

const generateFunName = (usedNames: Set<string>): string => {
  let name = '';
  let attempts = 0;
  do {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    name = `${adj} ${noun}`;
    attempts++;
  } while (usedNames.has(name) && attempts < 100);
  return name;
};

const generateStudents = (count: number): StudentStandup[] => {
  const usedNames = new Set<string>();
  return Array.from({ length: count }, (_, i) => {
    const name = generateFunName(usedNames);
    usedNames.add(name);
    return {
      id: `student-${i}-${Date.now()}`,
      name,
      score: null
    };
  });
};

export function StandupTracker({ projectId }: StandupTrackerProps) {
  const [studentCount, setStudentCount] = useState<number>(6);
  const [students, setStudents] = useState<StudentStandup[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(getStorageKey(projectId));
      if (stored) {
        const data = JSON.parse(stored);
        setStudents(data.students || []);
        setStudentCount(data.studentCount || 6);
        if (data.students?.length > 0) {
          setIsExpanded(true);
          // If all scored, show results
          const allScored = data.students.every((s: StudentStandup) => s.score !== null);
          if (allScored) {
            setShowResults(true);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load standup data', e);
    }
  }, [projectId]);

  // Save to localStorage whenever students change
  useEffect(() => {
    if (students.length > 0) {
      try {
        localStorage.setItem(getStorageKey(projectId), JSON.stringify({
          students,
          studentCount,
          lastUpdated: new Date().toISOString()
        }));
      } catch (e) {
        console.error('Failed to save standup data', e);
      }
    }
  }, [students, studentCount, projectId]);

  const handleGenerateStudents = () => {
    const newStudents = generateStudents(studentCount);
    setStudents(newStudents);
    setCurrentIndex(0);
    setShowResults(false);
    setIsExpanded(true);
  };

  const handleScore = (score: 0 | 1 | 2) => {
    setStudents(prev => prev.map((s, i) =>
      i === currentIndex ? { ...s, score } : s
    ));

    // Auto-advance to next student
    if (currentIndex < students.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      // All done, show results
      setTimeout(() => setShowResults(true), 300);
    }
  };

  const handleClearAll = () => {
    setStudents([]);
    setCurrentIndex(0);
    setShowResults(false);
    localStorage.removeItem(getStorageKey(projectId));
  };

  const handleStartOver = () => {
    setStudents(prev => prev.map(s => ({ ...s, score: null })));
    setCurrentIndex(0);
    setShowResults(false);
  };

  const handleNewNames = () => {
    const newStudents = generateStudents(students.length);
    setStudents(newStudents);
    setCurrentIndex(0);
    setShowResults(false);
  };

  // Calculate summary stats
  const scoredCount = students.filter(s => s.score !== null).length;
  const avgScore = scoredCount > 0
    ? (students.reduce((sum, s) => sum + (s.score ?? 0), 0) / scoredCount).toFixed(1)
    : '-';
  const scoreCounts = {
    red: students.filter(s => s.score === 0).length,
    yellow: students.filter(s => s.score === 1).length,
    green: students.filter(s => s.score === 2).length
  };

  const currentStudent = students[currentIndex];

  return (
    <div className="standup-tracker section-card">
      <div className="standup-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h2>Standup Tracker</h2>
        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
      </div>

      {isExpanded && (
        <div className="standup-content">
          {students.length === 0 ? (
            // Setup screen
            <div className="standup-setup">
              <p className="setup-label">How many students?</p>
              <div className="count-input-row">
                <button
                  className="count-btn"
                  onClick={() => setStudentCount(Math.max(1, studentCount - 1))}
                >
                  −
                </button>
                <input
                  type="number"
                  value={studentCount}
                  onChange={(e) => setStudentCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="count-input"
                  min={1}
                />
                <button
                  className="count-btn"
                  onClick={() => setStudentCount(studentCount + 1)}
                >
                  +
                </button>
              </div>
              <button className="generate-btn" onClick={handleGenerateStudents}>
                Start Standup
              </button>
            </div>
          ) : showResults ? (
            // Results screen
            <div className="standup-results">
              <div className="results-header">
                <h3>Standup Complete</h3>
                <p className="results-avg">Average: <strong>{avgScore}</strong></p>
              </div>

              <div className="results-summary">
                <div className="result-count red">
                  <span className="count-num">{scoreCounts.red}</span>
                  <span className="count-label">Red (0)</span>
                </div>
                <div className="result-count yellow">
                  <span className="count-num">{scoreCounts.yellow}</span>
                  <span className="count-label">Yellow (1)</span>
                </div>
                <div className="result-count green">
                  <span className="count-num">{scoreCounts.green}</span>
                  <span className="count-label">Green (2)</span>
                </div>
              </div>

              <div className="results-list">
                {students.map((student) => (
                  <div key={student.id} className={`result-row score-${student.score}`}>
                    <span className="result-name">{student.name}</span>
                    <span className={`result-score score-${student.score}`}>{student.score}</span>
                  </div>
                ))}
              </div>

              <div className="standup-actions">
                <button className="action-btn secondary" onClick={handleStartOver}>
                  Start Over
                </button>
                <button className="action-btn secondary" onClick={handleNewNames}>
                  New Names
                </button>
                <button className="action-btn danger" onClick={handleClearAll}>
                  Clear All
                </button>
              </div>
            </div>
          ) : (
            // One-by-one scoring screen
            <div className="standup-active">
              <div className="progress-indicator">
                <span className="progress-text">{currentIndex + 1} of {students.length}</span>
                <div className="progress-dots">
                  {students.map((s, i) => (
                    <span
                      key={s.id}
                      className={`dot ${i === currentIndex ? 'current' : ''} ${s.score !== null ? `scored score-${s.score}` : ''}`}
                      onClick={() => setCurrentIndex(i)}
                    />
                  ))}
                </div>
              </div>

              <div className="current-student">
                <h3 className="student-name">{currentStudent?.name}</h3>
              </div>

              <div className="score-buttons-large">
                <button
                  className={`score-btn-large red ${currentStudent?.score === 0 ? 'active' : ''}`}
                  onClick={() => handleScore(0)}
                >
                  <span className="score-num">0</span>
                  <span className="score-label">Red</span>
                </button>
                <button
                  className={`score-btn-large yellow ${currentStudent?.score === 1 ? 'active' : ''}`}
                  onClick={() => handleScore(1)}
                >
                  <span className="score-num">1</span>
                  <span className="score-label">Yellow</span>
                </button>
                <button
                  className={`score-btn-large green ${currentStudent?.score === 2 ? 'active' : ''}`}
                  onClick={() => handleScore(2)}
                >
                  <span className="score-num">2</span>
                  <span className="score-label">Green</span>
                </button>
              </div>

              <div className="nav-buttons">
                <button
                  className="nav-btn"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                >
                  ← Prev
                </button>
                <button
                  className="nav-btn"
                  onClick={() => {
                    if (currentIndex < students.length - 1) {
                      setCurrentIndex(currentIndex + 1);
                    } else {
                      setShowResults(true);
                    }
                  }}
                >
                  {currentIndex === students.length - 1 ? 'Done →' : 'Skip →'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
