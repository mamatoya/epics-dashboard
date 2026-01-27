import { useState, useRef } from 'react';
import './Update.css';

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
          <h3>Expected CSV Format</h3>
          <p>Your CSV file should include the following columns:</p>
          <ul className="format-list">
            <li><strong>Project Name</strong> - Name of the project</li>
            <li><strong>Description</strong> - Project description</li>
            <li><strong>Category</strong> - Community Development, Education, Health, or Sustainability</li>
            <li><strong>Community Partner</strong> - Partner organization name</li>
            <li><strong>Portfolio Manager</strong> - Assigned instructor</li>
            <li><strong>Industry Mentor</strong> - Industry mentor name</li>
            <li><strong>Health Status</strong> - no-pulse, on-track, at-risk, blocked, or completed</li>
            <li><strong>Spring Status</strong> - Status for spring semester</li>
            <li><strong>Team Members</strong> - Comma-separated list of team members</li>
          </ul>

          <div className="template-download">
            <p>Need a template?</p>
            <button className="template-btn" onClick={() => alert('Template download coming soon!')}>
              Download CSV Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
