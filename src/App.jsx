import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Packs from './pages/Packs';
import Vocabulary from './pages/Vocabulary';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import ModulePractice from './pages/ModulePractice';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

import FilesPage from './pages/FilesPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('ielts_user_logged_in') === 'true');

  const handleLogin = () => {
    localStorage.setItem('ielts_user_logged_in', 'true');
    setIsLoggedIn(true);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "274855913473-jjplfab676lvddt3vlvgrfbf9td0rjr3.apps.googleusercontent.com"}>
      <Router>
        <Routes>
        {isLoggedIn ? (
          // Logged In (Protected) Routes
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="practice" element={<Practice />} />
            <Route path="practice/:moduleId" element={<ModulePractice />} />
            <Route path="packs" element={<Packs />} />
            <Route path="vocabulary" element={<Vocabulary />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="files" element={<FilesPage />} />
            <Route path="admin" element={<Admin />} />
            {/* Catch-all to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        ) : (
          // Logged Out (Public) Routes
          <>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Auth onLogin={handleLogin} />} />
            {/* Catch-all to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
    <Toaster 
      position="top-right" 
      toastOptions={{
        className: 'ielts-toast',
        duration: 4000,
        style: {
          background: 'var(--toast-bg, #ffffff)',
          color: 'var(--toast-color, #1f2937)',
          borderRadius: '0.75rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid var(--toast-border, #e5e7eb)',
          fontFamily: "'Outfit', 'Inter', sans-serif",
          fontWeight: 500,
        }
      }} 
    />
    </GoogleOAuthProvider>
  );
}

export default App;
