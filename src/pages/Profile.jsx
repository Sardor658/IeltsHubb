import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Save, User, Mail, Calendar, Lock, Award, Flame, Clock, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { getTranslation } from '../utils/translations';
import './Profile.css';

const presetAvatars = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Molly',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Caleb',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Tigger',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Abby'
];

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // User identifiers
  const initialEmail = localStorage.getItem('ielts_current_user_email') || 'alex@example.com';

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

  // Form states
  const [fullName, setFullName] = useState(localStorage.getItem('ielts_current_user_name') || 'Alex (Siz)');
  const [username, setUsername] = useState(localStorage.getItem('ielts_current_user_username') || 'alex_siz');
  const [email, setEmail] = useState(initialEmail);
  const [dob, setDob] = useState(localStorage.getItem('ielts_current_user_dob') || '1998-05-15');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(localStorage.getItem('ielts_current_user_avatar') || 'https://i.pravatar.cc/150?img=11');
  const [isSaving, setIsSaving] = useState(false);

  // Stats for left panel
  const [stats, setStats] = useState({
    targetBand: "7.5",
    averageScore: "68%",
    daysToExam: "45",
    streak: 5,
    totalPracticeTime: 86400 // 24 hours in seconds
  });

  // Pull additional user record data if available from simulated DB on mount
  useEffect(() => {
    const dbStr = localStorage.getItem('ielts_users_db');
    if (dbStr) {
      try {
        const db = JSON.parse(dbStr);
        const user = db.find(u => u.email.toLowerCase() === initialEmail.toLowerCase());
        if (user) {
          if (user.username) setUsername(user.username);
          if (user.dob) setDob(user.dob);
          if (user.avatar) setAvatar(user.avatar);
          // Set password placeholder or keep blank
        }
      } catch (e) {
        console.error("Failed to parse user database:", e);
      }
    }

    // Load active dashboard stats
    const statsStr = localStorage.getItem('ielts_user_stats_precise');
    if (statsStr) {
      try {
        const parsedStats = JSON.parse(statsStr);
        const totalSecs = (parsedStats.listeningTime || 0) + 
                          (parsedStats.readingTime || 0) + 
                          (parsedStats.writingTime || 0) + 
                          (parsedStats.speakingTime || 0);

        setStats({
          targetBand: parsedStats.targetBand || "7.0",
          averageScore: parsedStats.averageScore || "0%",
          daysToExam: parsedStats.daysToExam || "30",
          streak: parsedStats.streak || 0,
          totalPracticeTime: totalSecs || 0
        });
      } catch (e) {
        console.error("Failed to parse user stats:", e);
      }
    }
  }, [initialEmail]);

  // Format second to hour/minute format
  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "0s";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    let res = "";
    if (hrs > 0) res += `${hrs}h `;
    res += `${mins}m`;
    return res;
  };

  // Preset avatar click
  const handleSelectPreset = (url) => {
    setAvatar(url);
    toast.success(getTranslation('profilePage', 'avatarTitle') + " tanlandi!");
  };

  // Custom photo upload selector
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Convert uploaded image to base64
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Rasm hajmi juda katta! Maksimal: 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setAvatar(reader.result);
        toast.success("Rasm muvaffaqiyatli yuklandi!");
      }
    };
    reader.readAsDataURL(file);
  };

  // Form submit handler
  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !username.trim()) {
      toast.error(getTranslation('profilePage', 'errorFillAll'));
      return;
    }

    setIsSaving(true);

    // Simulate network save
    setTimeout(() => {
      // 1. Update current local storage keys
      localStorage.setItem('ielts_current_user_name', fullName);
      localStorage.setItem('ielts_current_user_email', email.toLowerCase());
      localStorage.setItem('ielts_current_user_avatar', avatar);
      localStorage.setItem('ielts_current_user_dob', dob);
      localStorage.setItem('ielts_current_user_username', username);

      // 2. Sync inside simulated users database
      const dbStr = localStorage.getItem('ielts_users_db');
      if (dbStr) {
        try {
          const db = JSON.parse(dbStr);
          // Find matching user with old email address
          const userIdx = db.findIndex(u => u.email.toLowerCase() === initialEmail.toLowerCase());
          
          if (userIdx !== -1) {
            // Update fields
            db[userIdx].name = fullName;
            db[userIdx].email = email.toLowerCase();
            db[userIdx].username = username;
            db[userIdx].dob = dob;
            db[userIdx].avatar = avatar;
            if (password.trim() !== '') {
              db[userIdx].password = password;
            }
            
            localStorage.setItem('ielts_users_db', JSON.stringify(db));
          }
        } catch (e) {
          console.error("Failed to sync profile changes with users database:", e);
        }
      }

      // 3. Dispatch update event to let all components know to refresh their local state
      const updateEvent = new CustomEvent('ielts_profile_update');
      window.dispatchEvent(updateEvent);

      setIsSaving(false);
      toast.success(getTranslation('profilePage', 'savedSuccess'));
      setPassword(''); // clear password field
    }, 800);
  };

  const getPlanLabel = () => {
    if (plan === 'pro_plus') return '👑 PRO+';
    if (plan === 'pro') return '🚀 PRO';
    if (plan.endsWith('_promo')) return '🎁 FREE + 1 BONUS';
    return '🎁 FREE';
  };

  return (
    <div className="profile-container-main animate-fade-in">
      <div className="profile-grid-wrapper">
        
        {/* Left Side: Summary Card */}
        <div className="profile-summary-card glass-panel">
          <div className="profile-badge-overlay">{getPlanLabel()}</div>
          
          <div className="profile-main-photo-sec">
            <div className="profile-image-ring">
              <img src={avatar} alt="User Avatar" className="profile-circle-image" />
              <button className="photo-camera-btn-overlay" onClick={handleUploadClick} title={getTranslation('profilePage', 'uploadCustom')}>
                <Camera size={16} />
              </button>
            </div>
            <h2 className="summary-full-name">{fullName}</h2>
            <p className="summary-username">@{username}</p>
            <p className="summary-email">{email}</p>
          </div>

          <div className="summary-divider"></div>

          {/* Quick Stats Grid */}
          <div className="profile-quick-stats-grid">
            <div className="quick-stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#ede9fe' }}>
                <Award size={18} color="#8b5cf6" />
              </div>
              <div className="stat-details">
                <span className="stat-lbl">{getTranslation('profilePage', 'targetBand')}</span>
                <span className="stat-val">Band {stats.targetBand}</span>
              </div>
            </div>
            
            <div className="quick-stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#d1fae5' }}>
                <Calendar size={18} color="#10b981" />
              </div>
              <div className="stat-details">
                <span className="stat-lbl">{getTranslation('profilePage', 'daysToExam')}</span>
                <span className="stat-val">{stats.daysToExam} {getTranslation('dashboard', 'days')}</span>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#ffe4e6' }}>
                <Flame size={18} color="#f43f5e" />
              </div>
              <div className="stat-details">
                <span className="stat-lbl">{getTranslation('profilePage', 'streak')}</span>
                <span className="stat-val">{stats.streak} {getTranslation('dashboard', 'days')}</span>
              </div>
            </div>

            <div className="quick-stat-item">
              <div className="stat-icon-wrapper" style={{ background: '#e0f2fe' }}>
                <Clock size={18} color="#0284c7" />
              </div>
              <div className="stat-details">
                <span className="stat-lbl">{getTranslation('profilePage', 'practiceTime')}</span>
                <span className="stat-val">{formatTime(stats.totalPracticeTime)}</span>
              </div>
            </div>
          </div>

          <div className="summary-divider"></div>

          {/* Additional details */}
          <div className="profile-extra-details">
            <div className="extra-detail-row">
              <span className="detail-lbl">{getTranslation('profilePage', 'planBadge')}:</span>
              <span className={`detail-val plan-text-badge ${plan.endsWith('_promo') ? 'free' : plan.replace('_promo', '')}`}>
                {plan.endsWith('_promo') ? 'FREE + 1 BONUS' : plan.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="extra-detail-row">
              <span className="detail-lbl">{getTranslation('profilePage', 'sessionStatus')}:</span>
              <span className="detail-val active-status">ONLINE ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right Side: Edit Form and Settings */}
        <div className="profile-edit-form-card glass-panel">
          <h3 className="section-title-label">
            <User size={20} color="var(--primary-color)" />
            <span>{getTranslation('profilePage', 'personalInfo')}</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="profile-edit-form-actual">
            <div className="form-fields-grid">
              
              <div className="profile-form-group">
                <label className="profile-field-label">{getTranslation('profilePage', 'fullName')} *</label>
                <div className="profile-input-wrapper">
                  <User size={16} className="input-icon-left" />
                  <input 
                    type="text" 
                    className="profile-styled-input" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-field-label">{getTranslation('profilePage', 'username')} *</label>
                <div className="profile-input-wrapper">
                  <span className="input-icon-left username-at">@</span>
                  <input 
                    type="text" 
                    className="profile-styled-input username-field" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-field-label">{getTranslation('profilePage', 'email')} *</label>
                <div className="profile-input-wrapper">
                  <Mail size={16} className="input-icon-left" />
                  <input 
                    type="email" 
                    className="profile-styled-input" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="profile-form-group">
                <label className="profile-field-label">{getTranslation('profilePage', 'dob')}</label>
                <div className="profile-input-wrapper">
                  <Calendar size={16} className="input-icon-left" />
                  <input 
                    type="date" 
                    className="profile-styled-input" 
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
              </div>

              <div className="profile-form-group full-width-field">
                <label className="profile-field-label">{getTranslation('profilePage', 'password')}</label>
                <div className="profile-input-wrapper">
                  <Lock size={16} className="input-icon-left" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="profile-styled-input" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="summary-divider" style={{ margin: '1.5rem 0' }}></div>

            {/* Avatar picker section */}
            <div className="avatar-picker-section-wrapper">
              <h4 className="avatar-selection-label">
                <Shield size={18} color="var(--primary-color)" />
                <span>{getTranslation('profilePage', 'avatarSettings')}</span>
              </h4>

              <div className="avatar-presets-grid">
                {presetAvatars.map((presetUrl, idx) => (
                  <div 
                    key={idx} 
                    className={`avatar-preset-item ${avatar === presetUrl ? 'selected' : ''}`}
                    onClick={() => handleSelectPreset(presetUrl)}
                  >
                    <img src={presetUrl} alt={`Preset ${idx + 1}`} />
                    <div className="preset-selected-check">✓</div>
                  </div>
                ))}
              </div>

              {/* Upload custom option */}
              <div className="custom-photo-upload-row">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
                <button type="button" className="upload-styled-btn" onClick={handleUploadClick}>
                  <Upload size={16} />
                  <span>{getTranslation('profilePage', 'uploadCustom')}</span>
                </button>
              </div>
            </div>

            <div className="summary-divider" style={{ margin: '1.5rem 0' }}></div>

            {/* Form actions */}
            <div className="form-submit-row">
              <button type="submit" className="profile-save-btn" disabled={isSaving}>
                <Save size={18} />
                <span>{isSaving ? getTranslation('profilePage', 'saving') : getTranslation('profilePage', 'saveBtn')}</span>
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
