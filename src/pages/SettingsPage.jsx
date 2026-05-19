import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Globe, Sun, Moon, Award, Calendar, Bell, Shield, Sparkles, Check, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getTranslation } from '../utils/translations';
import './SettingsPage.css';

const SettingsPage = () => {
  const navigate = useNavigate();

  // Load preferences on mount
  const currentLang = localStorage.getItem('ielts_lang') || 'UZ';
  const currentTheme = localStorage.getItem('ielts_theme') || 'light';

  // React state for reactive plan updates
  const [plan, setPlan] = useState(localStorage.getItem('ielts_user_membership_precise') || 'free');

  useEffect(() => {
    const handleProfileUpdate = () => {
      setPlan(localStorage.getItem('ielts_user_membership_precise') || 'free');
    };
    window.addEventListener('ielts_profile_update', handleProfileUpdate);
    return () => {
      window.removeEventListener('ielts_profile_update', handleProfileUpdate);
    };
  }, []);

  // Stats loading
  const getInitialStats = () => {
    const statsStr = localStorage.getItem('ielts_user_stats_precise');
    if (statsStr) {
      try {
        const stats = JSON.parse(statsStr);
        return {
          targetBand: stats.targetBand || "7.5",
          daysToExam: stats.daysToExam || "45"
        };
      } catch (e) {
        console.error("Failed to parse user stats:", e);
      }
    }
    return { targetBand: "7.5", daysToExam: "45" };
  };

  const initialStats = getInitialStats();

  // State configurations
  const [lang, setLang] = useState(currentLang);
  const [theme, setTheme] = useState(currentTheme);
  const [targetBand, setTargetBand] = useState(initialStats.targetBand);
  const [daysToExam, setDaysToExam] = useState(initialStats.daysToExam);
  
  // Notification states (simulated toggles)
  const [pushReminders, setPushReminders] = useState(
    localStorage.getItem('ielts_settings_push_reminders') !== 'false'
  );
  const [leaderboardAlerts, setLeaderboardAlerts] = useState(
    localStorage.getItem('ielts_settings_leaderboard_alerts') !== 'false'
  );
  const [newsletter, setNewsletter] = useState(
    localStorage.getItem('ielts_settings_newsletter') === 'true'
  );

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Instant language selection
  const handleLangSelect = (selectedLang) => {
    setLang(selectedLang);
    localStorage.setItem('ielts_lang', selectedLang);
    
    // Dispatch events instantly so the app translates immediately
    const langEvent = new CustomEvent('ielts_lang_change', { detail: selectedLang });
    window.dispatchEvent(langEvent);
    
    const updateEvent = new CustomEvent('ielts_profile_update');
    window.dispatchEvent(updateEvent);
  };

  // Instant theme selection
  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('ielts_theme', selectedTheme);
    document.documentElement.setAttribute('data-theme', selectedTheme);
    
    // Dispatch update event so Topbar, Sidebar, and layouts reload instantly
    const updateEvent = new CustomEvent('ielts_profile_update');
    window.dispatchEvent(updateEvent);
  };

  // Save Settings handler
  const handleSaveSettings = (e) => {
    e.preventDefault();

    // 1. Save study stats
    const statsStr = localStorage.getItem('ielts_user_stats_precise');
    let currentStats = {};
    if (statsStr) {
      try {
        currentStats = JSON.parse(statsStr);
      } catch (e) {
        console.error(e);
      }
    }
    const updatedStats = {
      ...currentStats,
      targetBand: targetBand,
      daysToExam: daysToExam
    };
    localStorage.setItem('ielts_user_stats_precise', JSON.stringify(updatedStats));

    // 2. Save notification toggles
    localStorage.setItem('ielts_settings_push_reminders', pushReminders ? 'true' : 'false');
    localStorage.setItem('ielts_settings_leaderboard_alerts', leaderboardAlerts ? 'true' : 'false');
    localStorage.setItem('ielts_settings_newsletter', newsletter ? 'true' : 'false');

    // 3. Fire Profile Update Event (so all page components sync stats/details immediately)
    const updateEvent = new CustomEvent('ielts_profile_update');
    window.dispatchEvent(updateEvent);

    toast.success(getTranslation('settingsPage', 'savedSuccess'));
  };

  // Promo Redemption
  const handleRedeemPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setIsRedeeming(true);

    setTimeout(() => {
      const code = promoCode.trim().toUpperCase();
      const currentEmail = localStorage.getItem('ielts_current_user_email') || 'alex@example.com';
      
      if (code === 'IELTS77') {
        // Upgrade to PRO_PLUS_PROMO
        localStorage.setItem('ielts_user_membership_precise', 'pro_plus_promo');
        
        // Sync database records
        const dbStr = localStorage.getItem('ielts_users_db');
        if (dbStr) {
          try {
            const db = JSON.parse(dbStr);
            const idx = db.findIndex(u => u.email.toLowerCase() === currentEmail.toLowerCase());
            if (idx !== -1) {
              db[idx].membership = 'pro_plus_promo';
              localStorage.setItem('ielts_users_db', JSON.stringify(db));
            }
          } catch (e) {
            console.error(e);
          }
        }
        
        // Emit refresh event
        const updateEvent = new CustomEvent('ielts_profile_update');
        window.dispatchEvent(updateEvent);

        toast.success(getTranslation('settingsPage', 'promoSuccessProPlus'), {
          duration: 4000,
          icon: '👑'
        });
        setPromoCode('');
      } else if (code === 'PRO99') {
        // Upgrade to PRO_PROMO
        localStorage.setItem('ielts_user_membership_precise', 'pro_promo');
        
        // Sync database records
        const dbStr = localStorage.getItem('ielts_users_db');
        if (dbStr) {
          try {
            const db = JSON.parse(dbStr);
            const idx = db.findIndex(u => u.email.toLowerCase() === currentEmail.toLowerCase());
            if (idx !== -1) {
              db[idx].membership = 'pro_promo';
              localStorage.setItem('ielts_users_db', JSON.stringify(db));
            }
          } catch (e) {
            console.error(e);
          }
        }

        // Emit refresh event
        const updateEvent = new CustomEvent('ielts_profile_update');
        window.dispatchEvent(updateEvent);

        toast.success(getTranslation('settingsPage', 'promoSuccessPro'), {
          duration: 4000,
          icon: '🚀'
        });
        setPromoCode('');
      } else {
        toast.error(getTranslation('settingsPage', 'promoInvalid'));
      }
      setIsRedeeming(false);
    }, 700);
  };

  const getPlanLabel = () => {
    if (plan === 'pro_plus') return '👑 PRO+ LIFE';
    if (plan === 'pro') return '🚀 PRO ACTIVE';
    if (plan === 'pro_plus_promo') return '👑 PRO+ (PROMO)';
    if (plan === 'pro_promo') return '🚀 PRO (PROMO)';
    return '🎁 FREE';
  };

  return (
    <div className="settings-container-main animate-fade-in">
      
      {/* Back button */}
      <button className="settings-back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <div className="settings-grid-wrapper">
        
        {/* Main Settings Panel */}
        <div className="settings-main-panel glass-panel">
          <form onSubmit={handleSaveSettings}>
            
            {/* General Preference section */}
            <h3 className="settings-section-lbl">
              <Globe size={18} color="var(--primary-color)" />
              <span>{getTranslation('settingsPage', 'generalTitle')}</span>
            </h3>

            <div className="settings-preferences-grid">
              
              {/* Language Preference */}
              <div className="settings-field-group">
                <label className="settings-input-lbl">{getTranslation('settingsPage', 'langLabel')}</label>
                <div className="language-selector-box">
                  <button 
                    type="button"
                    className={`lang-option-btn ${lang === 'UZ' ? 'active' : ''}`}
                    onClick={() => handleLangSelect('UZ')}
                  >
                    🇺🇿 UZ
                  </button>
                  <button 
                    type="button"
                    className={`lang-option-btn ${lang === 'EN' ? 'active' : ''}`}
                    onClick={() => handleLangSelect('EN')}
                  >
                    🇬🇧 EN
                  </button>
                  <button 
                    type="button"
                    className={`lang-option-btn ${lang === 'RU' ? 'active' : ''}`}
                    onClick={() => handleLangSelect('RU')}
                  >
                    🇷🇺 RU
                  </button>
                </div>
              </div>

              {/* Theme Preference */}
              <div className="settings-field-group">
                <label className="settings-input-lbl">{getTranslation('settingsPage', 'themeLabel')}</label>
                <div className="theme-selector-box">
                  <button 
                    type="button"
                    className={`theme-option-btn ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeSelect('light')}
                  >
                    <Sun size={16} />
                    <span>{getTranslation('settingsPage', 'lightTheme')}</span>
                  </button>
                  <button 
                    type="button"
                    className={`theme-option-btn ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeSelect('dark')}
                  >
                    <Moon size={16} />
                    <span>{getTranslation('settingsPage', 'darkTheme')}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-divider"></div>

            {/* IELTS Study Preferences */}
            <h3 className="settings-section-lbl">
              <Award size={18} color="var(--primary-color)" />
              <span>{getTranslation('settingsPage', 'goalsTitle')}</span>
            </h3>

            <div className="settings-preferences-grid">
              
              {/* Target score */}
              <div className="settings-field-group">
                <label className="settings-input-lbl">{getTranslation('settingsPage', 'targetScore')}</label>
                <div className="settings-input-wrapper">
                  <Award size={16} className="settings-icon-left" />
                  <select 
                    value={targetBand} 
                    onChange={(e) => setTargetBand(e.target.value)} 
                    className="settings-styled-select"
                  >
                    <option value="5.5">Band 5.5</option>
                    <option value="6.0">Band 6.0</option>
                    <option value="6.5">Band 6.5</option>
                    <option value="7.0">Band 7.0</option>
                    <option value="7.5">Band 7.5</option>
                    <option value="8.0">Band 8.0</option>
                    <option value="8.5">Band 8.5</option>
                    <option value="9.0">Band 9.0</option>
                  </select>
                </div>
              </div>

              {/* Days to Exam */}
              <div className="settings-field-group">
                <label className="settings-input-lbl">{getTranslation('settingsPage', 'daysCountdown')}</label>
                <div className="settings-input-wrapper">
                  <Calendar size={16} className="settings-icon-left" />
                  <input 
                    type="number" 
                    min="1" 
                    max="365"
                    className="settings-styled-input" 
                    value={daysToExam}
                    onChange={(e) => setDaysToExam(e.target.value)}
                  />
                </div>
              </div>

            </div>

            <div className="settings-divider"></div>

            {/* Push Notifications Toggles */}
            <h3 className="settings-section-lbl">
              <Bell size={18} color="var(--primary-color)" />
              <span>{getTranslation('settingsPage', 'notifTitle')}</span>
            </h3>

            <div className="notifications-toggle-list">
              
              {/* Push Toggles */}
              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <span className="toggle-title-label">{getTranslation('settingsPage', 'reminderLabel')}</span>
                </div>
                <label className="switch-control-btn">
                  <input 
                    type="checkbox" 
                    checked={pushReminders}
                    onChange={(e) => setPushReminders(e.target.checked)} 
                  />
                  <span className="switch-slider-round"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <span className="toggle-title-label">{getTranslation('settingsPage', 'leaderboardLabel')}</span>
                </div>
                <label className="switch-control-btn">
                  <input 
                    type="checkbox" 
                    checked={leaderboardAlerts}
                    onChange={(e) => setLeaderboardAlerts(e.target.checked)} 
                  />
                  <span className="switch-slider-round"></span>
                </label>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <span className="toggle-title-label">{getTranslation('settingsPage', 'newsLabel')}</span>
                </div>
                <label className="switch-control-btn">
                  <input 
                    type="checkbox" 
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)} 
                  />
                  <span className="switch-slider-round"></span>
                </label>
              </div>

            </div>

            <div className="settings-divider"></div>

            {/* Submit button */}
            <div className="settings-save-row">
              <button type="submit" className="settings-save-btn">
                <span>{getTranslation('settingsPage', 'saveBtn')}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Right Side Card: Promo coupon voucher */}
        <div className="settings-side-card-wrapper">
          
          {/* Active plan status */}
          <div className="active-membership-status-card glass-panel">
            <span className="membership-title-lbl">CURRENT MEMBERSHIP PLAN</span>
            <h2 className={`membership-plan-val ${plan.replace('_promo', '')}`}>{getPlanLabel()}</h2>
            <p className="membership-subtext">Unlock unlimited IELTS speaking prompts, listening modules, and writing evaluations.</p>
          </div>

          {/* Promo code redemption card */}
          <div className="promo-voucher-redeem-card glass-panel">
            <h4 className="promo-title-label">
              <Sparkles size={16} color="#d97706" />
              <span>{getTranslation('settingsPage', 'promoTitle')}</span>
            </h4>
            
            <p className="promo-instruction-subtext">Got a promo voucher code? Enter it below to unlock premium access levels immediately.</p>
            
            <form onSubmit={handleRedeemPromo} className="promo-redeem-form-actual">
              <input 
                type="text" 
                className="promo-input-styled" 
                placeholder={getTranslation('settingsPage', 'promoPlaceholder')}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={isRedeeming}
              />
              <button type="submit" className="promo-redeem-submit-btn" disabled={isRedeeming || !promoCode.trim()}>
                {isRedeeming ? 'Validating...' : getTranslation('settingsPage', 'promoBtn')}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
