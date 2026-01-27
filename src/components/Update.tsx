import { useState, useRef } from 'react';
import './Update.css';

// CSV column headers - Excel-friendly names
const CSV_COLUMNS = [
  'Project Name',
  'Description',
  'Category',
  'Community Partner',
  'Campus',
  'Portfolio Manager',
  'Industry Mentor',
  'Health Status',
  'Spring Status',
  'Stage',
  'Meeting Day',
  'Meeting Time',
  'OneDrive URL',
  'Design Review Score',
  'People Impacted',
  'Is Indonesia Project',
  'My Team',
];

// Generate CSV template with headers and example rows
const generateTemplate = () => {
  const headers = CSV_COLUMNS.join(',');

  // Example rows showing different scenarios
  const examples = [
    [
      'Solar Powered Cold Chain',
      'Developing solar-powered cold chain solutions for preserving temperature-sensitive goods',
      'Sustainability',
      'Community Food Bank',
      'Tempe',
      'Dr. Smith',
      'Jane Doe',
      'on-track',
      'Monday 4:00-5:15pm',
      '2',
      'Monday',
      '4:00-5:15pm',
      'https://arizonastateu-my.sharepoint.com/...',
      '0.85',
      '250',
      'No',
      'Yes',
    ],
    [
      'Adaptive Snowboard',
      'Developing adaptive snowboard system with integrated suspension',
      'Health',
      'Zach Sherman',
      'Tempe',
      'Dr. Jones',
      '',
      'on-track',
      'Wednesday 4:35-5:25pm',
      '3',
      'Wednesday',
      '4:35-5:25pm',
      '',
      '1.0',
      '1',
      'No',
      'No',
    ],
    [
      'Indonesia Hand Solutions',
      'Developing adaptive hand prosthetic solutions for communities in Indonesia',
      'Health',
      'Indonesia Healthcare Partners',
      'Tempe',
      '',
      '',
      'no-pulse',
      'Not Continuing',
      '1',
      '',
      '',
      '',
      '',
      '500',
      'Yes',
      'No',
    ],
  ];

  const exampleRows = examples.map(row =>
    row.map(cell => {
      // Wrap cells containing commas in quotes
      if (cell.includes(',') || cell.includes('"')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    }).join(',')
  ).join('\n');

  return `${headers}\n${exampleRows}`;
};

const downloadTemplate = () => {
  const template = generateTemplate();
  const blob = new Blob([template], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'epics_project_template.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function Update() {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // Placeholder - will be implemented later
    alert('Upload functionality coming soon! This will update the project data from your CSV file.');
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="update-page">
      <div className="update-container">
        <h1>Update Project Data</h1>
        <p className="update-description">
          Upload a CSV or Excel file to update all project information. This allows directors and instructors
          to keep the dashboard current without developer assistance.
        </p>

        <div
          className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {file ? (
            <div className="file-info">
              <span className="file-icon">📄</span>
              <span className="file-name">{file.name}</span>
              <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
          ) : (
            <div className="upload-prompt">
              <span className="upload-icon">📁</span>
              <p className="upload-text">Drag and drop your CSV file here</p>
              <p className="upload-subtext">or click to browse</p>
            </div>
          )}
        </div>

        <div className="upload-actions">
          <button
            className="upload-btn primary"
            onClick={handleUpload}
            disabled={!file}
          >
            Upload & Update
          </button>
          {file && (
            <button className="upload-btn secondary" onClick={handleClear}>
              Clear
            </button>
          )}
        </div>

        <div className="upload-info">
          <h3>CSV Column Guide</h3>
          <p className="format-intro">
            Download the template below and fill it out in Excel. Save as CSV when done.
          </p>

          <div className="template-download">
            <button className="template-btn" onClick={downloadTemplate}>
              Download CSV Template
            </button>
          </div>

          <div className="format-sections">
            <div className="format-section">
              <h4>Required Fields</h4>
              <ul className="format-list">
                <li><strong>Project Name</strong> - Full name of the project</li>
                <li><strong>Category</strong> - One of: Community Development, Education, Health, Sustainability</li>
                <li><strong>Health Status</strong> - One of: no-pulse, on-track, at-risk, blocked, completed</li>
              </ul>
            </div>

            <div className="format-section">
              <h4>Project Details</h4>
              <ul className="format-list">
                <li><strong>Description</strong> - Brief project description</li>
                <li><strong>Community Partner</strong> - Partner organization name</li>
                <li><strong>Campus</strong> - One of: Tempe, Polytechnic, West Valley</li>
                <li><strong>Stage</strong> - Project stage: 1, 2, or 3</li>
                <li><strong>People Impacted</strong> - Estimated number (just the number)</li>
              </ul>
            </div>

            <div className="format-section">
              <h4>Team & Schedule</h4>
              <ul className="format-list">
                <li><strong>Portfolio Manager</strong> - Assigned instructor name</li>
                <li><strong>Industry Mentor</strong> - Industry mentor name</li>
                <li><strong>Meeting Day</strong> - Monday, Tuesday, Wednesday, etc.</li>
                <li><strong>Meeting Time</strong> - e.g., 4:00-5:15pm</li>
                <li><strong>Spring Status</strong> - e.g., "Monday 4:00-5:15pm" or "Not Continuing"</li>
              </ul>
            </div>

            <div className="format-section">
              <h4>Other Fields</h4>
              <ul className="format-list">
                <li><strong>OneDrive URL</strong> - Full URL to project folder</li>
                <li><strong>Design Review Score</strong> - Decimal 0 to 1 (e.g., 0.85 for 85%)</li>
                <li><strong>Is Indonesia Project</strong> - Yes or No</li>
                <li><strong>My Team</strong> - Yes or No (marks as your team)</li>
              </ul>
            </div>
          </div>

          <div className="format-tips">
            <h4>Tips for Excel Users</h4>
            <ul className="tips-list">
              <li>Open the template in Excel, make your changes, then File → Save As → CSV</li>
              <li>Leave cells empty if you don't have the data - don't put "N/A" or "-"</li>
              <li>For Yes/No fields, use exactly "Yes" or "No"</li>
              <li>Don't change the column headers in the first row</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
