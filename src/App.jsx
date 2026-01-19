import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import VideoManager from './pages/VideoManager';
import ClientManager from './pages/ClientManager';
import DriverManager from './pages/DriverManager';
import VideoPlayer from './pages/VideoPlayer';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public/Display Route */}
          <Route path="/display" element={<VideoPlayer />} />

          {/* Admin Routes with Sidebar */}
          <Route path="/admin/*" element={
            <div style={{ display: 'flex', width: '100%' }}>
              <Sidebar />
              <main className="content">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="videos" element={<VideoManager />} />
                  <Route path="clients" element={<ClientManager />} />
                  <Route path="drivers" element={<DriverManager />} />
                  <Route path="*" element={<Navigate to="dashboard" replace />} />
                </Routes>
              </main>
            </div>
          } />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
