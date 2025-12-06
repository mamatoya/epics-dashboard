import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Feed } from './components/Feed';
import { Overview } from './components/Overview';
import { Dashboard } from './components/Dashboard';
import { ProjectLanding } from './components/ProjectLanding';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Feed />} />
          <Route path="overview" element={<Overview />} />
          <Route path="portfolio" element={<Dashboard />} />
          <Route path="project/:projectId" element={<ProjectLanding />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
