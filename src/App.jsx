import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import VideoManager from './pages/VideoManager';
import ClientManager from './pages/ClientManager';
import DriverManager from './pages/DriverManager';
import VideoPlayer from './pages/VideoPlayer';

// Mock ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Player Route - Protected */}
          <Route path="/display" element={
            <ProtectedRoute>
              <VideoPlayer />
            </ProtectedRoute>
          } />

          {/* Admin Routes with Sidebar - Protected */}
          <Route path="/admin/*" element={
            <ProtectedRoute>
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
            </ProtectedRoute>
          } />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
