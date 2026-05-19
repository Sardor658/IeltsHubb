import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Settings, Bell, Folder, Calendar as CalIcon, Sun, Moon, User, LogOut } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import './Topbar.css';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const [theme, setTheme] = useState(localStorage.getItem('ielts_theme') || 'light');
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('ielts_lang') || 'UZ');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  const [userInfo, setUserInfo] = useState({
    name: localStorage.getItem('ielts_current_user_name') || 'Alex (Siz)',
    email: localStorage.getItem('ielts_current_user_email') || 'alex@example.com',
    avatar: localStorage.getItem('ielts_current_user_avatar') || 'https://i.pravatar.cc/150?img=11',
    plan: localStorage.getItem('ielts_user_membership_precise') || 'free'
  });

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUserInfo({
        name: localStorage.getItem('ielts_current_user_name') || 'Alex (Siz)',
        email: localStorage.getItem('ielts_current_user_email') || 'alex@example.com',
        avatar: localStorage.getItem('ielts_current_user_avatar') || 'https://i.pravatar.cc/150?img=11',
        plan: localStorage.getItem('ielts_user_membership_precise') || 'free'
      });
      setTheme(localStorage.getItem('ielts_theme') || 'light');
      setCurrentLang(localStorage.getItem('ielts_lang') || 'UZ');
    };
    window.addEventListener('ielts_profile_update', handleProfileUpdate);
    
    const handleLangChange = (e) => {
      setCurrentLang(e.detail);
    };
    window.addEventListener('ielts_lang_change', handleLangChange);
    
    return () => {
      window.removeEventListener('ielts_profile_update', handleProfileUpdate);
      window.removeEventListener('ielts_lang_change', handleLangChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.setItem('ielts_user_logged_in', 'false');
    localStorage.removeItem('ielts_current_user_email');
    localStorage.removeItem('ielts_current_user_name');
    localStorage.removeItem('ielts_user_membership_precise');
    localStorage.removeItem('ielts_current_user_avatar');
    sessionStorage.removeItem('ielts_admin_logged');
    window.location.reload();
  };

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return getTranslation('sidebar', 'home');
    if (location.pathname === '/practice') return getTranslation('sidebar', 'practice');
    if (location.pathname === '/packs') return getTranslation('sidebar', 'packs');
    if (location.pathname === '/vocabulary') return getTranslation('sidebar', 'vocabulary');
    if (location.pathname === '/leaderboard') return getTranslation('sidebar', 'leaderboard');
    if (location.pathname === '/achievements') return getTranslation('sidebar', 'achievements');
    if (location.pathname === '/admin') return getTranslation('sidebar', 'admin');
    if (location.pathname === '/profile') return getTranslation('profilePage', 'title');
    if (location.pathname === '/settings') return getTranslation('settingsPage', 'title');
    
    if (location.pathname.startsWith('/practice/')) {
      const mod = location.pathname.split('/').pop()?.toLowerCase();
      if (mod === 'listening') return getTranslation('modulePractice', 'listening');
      if (mod === 'reading') return getTranslation('modulePractice', 'reading');
      if (mod === 'writing') return getTranslation('modulePractice', 'writing');
      if (mod === 'speaking') return getTranslation('modulePractice', 'speaking');
    }
    
    return 'Dashboard';
  };

  const title = getPageTitle();

  // Apply theme dynamically to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ielts_theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    localStorage.setItem('ielts_lang', lang);
    setIsLangOpen(false);
    
    // Dispatch custom event to notify Layout to update without window reload
    const event = new CustomEvent('ielts_lang_change', { detail: lang });
    window.dispatchEvent(event);
  };

  return (
    <header className="topbar">
      <h1 className="page-title">{title}</h1>
      
      <div className="topbar-actions">
        {/* Light/Dark Toggle */}
        <button className="icon-btn theme-toggle-btn" onClick={toggleTheme} title="Mavzuni o'zgartirish">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Language Selector */}
        <div className="language-selector" ref={langRef}>
          <button className="lang-btn" onClick={() => setIsLangOpen(!isLangOpen)} title="Tilni tanlash">
            <span>{currentLang === 'EN' ? '🇬🇧 EN' : currentLang === 'RU' ? '🇷🇺 RU' : '🇺🇿 UZ'}</span>
          </button>
          {isLangOpen && (
            <div className="lang-dropdown">
              <div className="lang-option" onClick={() => handleLangChange('UZ')}>🇺🇿 UZ</div>
              <div className="lang-option" onClick={() => handleLangChange('EN')}>🇬🇧 EN</div>
              <div className="lang-option" onClick={() => handleLangChange('RU')}>🇷🇺 RU</div>
            </div>
          )}
        </div>

        <button className="icon-btn topbar-folder-btn" onClick={() => navigate('/files')} title={getTranslation('topbar', 'files')}>
          <Folder size={20} />
        </button>
        <button className="icon-btn topbar-settings-btn" onClick={() => navigate('/settings')} title={getTranslation('sidebar', 'settings')}>
          <Settings size={20} />
        </button>
        <button className="icon-btn notification-btn">
          <Bell size={20} />
          <span className="badge"></span>
        </button>
        <div className="user-profile-container" ref={profileRef}>
          <div className="user-profile" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img src={userInfo.avatar} alt="User" />
          </div>

          {isProfileOpen && (
            <div className="profile-dropdown-sleek">
              <div className="dropdown-user-info">
                <div className="dropdown-avatar-wrapper">
                  <img src={userInfo.avatar} alt="Avatar" />
                  {userInfo.plan !== 'free' && (
                    <span className="premium-star-badge">👑</span>
                  )}
                </div>
                <div className="dropdown-user-details">
                  <h4 className="dropdown-user-name">{userInfo.name}</h4>
                  <p className="dropdown-user-email">{userInfo.email}</p>
                  <span className={`plan-badge-mini ${userInfo.plan.endsWith('_promo') ? 'free' : userInfo.plan.replace('_promo', '')}`}>
                    {userInfo.plan === 'pro_plus' ? 'PRO+' : 
                     userInfo.plan === 'pro' ? 'PRO' : 
                     userInfo.plan.endsWith('_promo') ? 'FREE + 1 BONUS' : 'FREE'}
                  </span>
                </div>
              </div>
              
              <div className="dropdown-menu-divider"></div>
              
              <div className="dropdown-menu-items">
                <button className="dropdown-item" onClick={() => { navigate('/profile'); setIsProfileOpen(false); }}>
                  <User size={16} />
                  <span>{getTranslation('profilePage', 'viewEdit')}</span>
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} color="#ef4444" />
                  <span style={{ color: '#ef4444' }}>{getTranslation('sidebar', 'logout')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
