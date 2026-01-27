import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
// import { Feed } from './components/Feed';  // Commented out for MVP scope
import { Overview } from './components/Overview';
import { Dashboard } from './components/Dashboard';
import { ProjectLanding } from './components/ProjectLanding';
import { Update } from './components/Update';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/overview" replace />} />
          {/* <Route path="feed" element={<Feed />} /> */}
          <Route path="overview" element={<Overview />} />
          <Route path="portfolio" element={<Dashboard />} />
          <Route path="project/:projectId" element={<ProjectLanding />} />
          <Route path="update" element={<Update />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
