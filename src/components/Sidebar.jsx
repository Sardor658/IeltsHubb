import { NavLink } from 'react-router-dom';
import { Home, Target, Package, BookOpen, BarChart2, Trophy, Shield, LogOut, User } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import './Sidebar.css';

const Sidebar = () => {
  const isAdmin = sessionStorage.getItem('ielts_admin_logged') === 'true';

  const navItems = [
    { name: getTranslation('sidebar', 'home'), path: '/dashboard', icon: <Home size={20} /> },
    { name: getTranslation('sidebar', 'practice'), path: '/practice', icon: <Target size={20} /> },
    { name: getTranslation('sidebar', 'packs'), path: '/packs', icon: <Package size={20} /> },
    { name: getTranslation('sidebar', 'vocabulary'), path: '/vocabulary', icon: <BookOpen size={20} /> },
    { name: getTranslation('sidebar', 'leaderboard'), path: '/leaderboard', icon: <BarChart2 size={20} /> },
    { name: getTranslation('sidebar', 'achievements'), path: '/achievements', icon: <Trophy size={20} /> },
    { name: getTranslation('sidebar', 'profile'), path: '/profile', icon: <User size={20} /> },
    ...(isAdmin ? [{ name: getTranslation('sidebar', 'admin'), path: '/admin', icon: <Shield size={20} /> }] : []),
  ];

  const handleLogout = () => {
    localStorage.setItem('ielts_user_logged_in', 'false');
    localStorage.removeItem('ielts_current_user_email');
    localStorage.removeItem('ielts_current_user_name');
    localStorage.removeItem('ielts_user_membership_precise');
    sessionStorage.removeItem('ielts_admin_logged');
    window.location.reload();
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7l10 5 10-5-10-5z" fill="var(--primary-color)"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span className="logo-text">IELTS HUB</span>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
        <button 
          className="logout-btn" 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            width: '100%',
            background: 'transparent',
            border: 'none',
            padding: '0.85rem 1.25rem',
            borderRadius: '0.75rem',
            color: '#ef4444',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            fontSize: '0.95rem'
          }}
        >
          <LogOut size={20} color="#ef4444" />
          <span className="nav-text">{getTranslation('sidebar', 'logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
