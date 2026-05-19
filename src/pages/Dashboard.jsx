import { Target, BarChart2, Calendar as CalIcon, Clock, Flame } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { useState, useEffect } from 'react';
import { getTranslation } from '../utils/translations';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    targetBand: "0",
    averageScore: "0%",
    daysToExam: "0",
    streak: 0,
    listeningTime: 0,
    readingTime: 0,
    writingTime: 0,
    speakingTime: 0,
    weeklyProgress: { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 },
    radarSkills: { Listening: 0, Reading: 0, Writing: 0, Speaking: 0, Mock: 0 }
  });

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeInfo, setUpgradeInfo] = useState(null);

  useEffect(() => {
    const localData = localStorage.getItem('ielts_user_stats_precise');
    if (localData) {
      setStats(JSON.parse(localData));
    } else {
      localStorage.setItem('ielts_user_stats_precise', JSON.stringify(stats));
    }

    // Pro yoki Pro+ upgrade bo'lganini tekshirish va tabriklash modali
    const userEmail = localStorage.getItem('ielts_current_user_email');
    if (userEmail) {
      const pendingNotification = localStorage.getItem(`ielts_plan_notify_${userEmail}`);
      if (pendingNotification) {
        try {
          const parsed = JSON.parse(pendingNotification);
          setUpgradeInfo(parsed);
          setShowUpgradeModal(true);
          localStorage.removeItem(`ielts_plan_notify_${userEmail}`);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const updateStatField = (field, promptMessage) => {
    const currentValue = stats[field];
    const newValue = prompt(promptMessage, currentValue);
    if (newValue !== null && newValue.trim() !== "") {
      const updatedStats = { ...stats, [field]: newValue };
      setStats(updatedStats);
      localStorage.setItem('ielts_user_stats_precise', JSON.stringify(updatedStats));
    }
  };

  const formatTime = (totalSeconds) => {
    if (!totalSeconds) return "0s";
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    let res = "";
    if (hrs > 0) res += `${hrs}h `;
    if (mins > 0) res += `${mins}m `;
    res += `${secs}s`;
    return res;
  };

  const totalPracticeTime = stats.listeningTime + stats.readingTime + stats.writingTime + stats.speakingTime;

  const statCards = [
    { label: getTranslation('dashboard', 'targetBand'), value: stats.targetBand, icon: <Target size={18} color="#8b5cf6" />, bg: 'var(--primary-light)', editable: true, field: 'targetBand', prompt: getTranslation('dashboard', 'editTarget') },
    { label: getTranslation('dashboard', 'avgScore'), value: stats.averageScore, icon: <BarChart2 size={18} color="#3b82f6" />, bg: '#dbeafe' },
    { label: getTranslation('dashboard', 'daysToExam'), value: stats.daysToExam, icon: <CalIcon size={18} color="#10b981" />, bg: '#d1fae5', editable: true, field: 'daysToExam', prompt: getTranslation('dashboard', 'editDays') },
    { label: getTranslation('dashboard', 'practiceTime'), value: formatTime(totalPracticeTime), icon: <Clock size={18} color="#8b5cf6" />, bg: '#ede9fe' },
    { label: getTranslation('dashboard', 'streak'), value: `${stats.streak} ${getTranslation('dashboard', 'days')}`, icon: <Flame size={18} color="#f43f5e" />, bg: '#ffe4e6' },
  ];

  const areaData = [
    { name: 'Sun', score: stats.weeklyProgress.Sun || 0 }, 
    { name: 'Mon', score: stats.weeklyProgress.Mon || 0 }, 
    { name: 'Tue', score: stats.weeklyProgress.Tue || 0 },
    { name: 'Wed', score: stats.weeklyProgress.Wed || 0 }, 
    { name: 'Thu', score: stats.weeklyProgress.Thu || 0 }, 
    { name: 'Fri', score: stats.weeklyProgress.Fri || 0 }, 
    { name: 'Sat', score: stats.weeklyProgress.Sat || 0 }
  ];

  const radarData = [
    { subject: 'Speaking', A: stats.radarSkills.Speaking || 0, fullMark: 100 },
    { subject: 'Reading', A: stats.radarSkills.Reading || 0, fullMark: 100 },
    { subject: 'Writing', A: stats.radarSkills.Writing || 0, fullMark: 100 },
    { subject: 'Listening', A: stats.radarSkills.Listening || 0, fullMark: 100 },
    { subject: 'Mock', A: stats.radarSkills.Mock || 0, fullMark: 100 },
  ];

  const skillTimes = [
    { label: getTranslation('dashboard', 'listening'), time: formatTime(stats.listeningTime), color: '#0284c7', bg: '#e0f2fe' },
    { label: getTranslation('dashboard', 'reading'), time: formatTime(stats.readingTime), color: '#16a34a', bg: '#dcfce7' },
    { label: getTranslation('dashboard', 'writing'), time: formatTime(stats.writingTime), color: '#9333ea', bg: '#f3e8ff' },
    { label: getTranslation('dashboard', 'speaking'), time: formatTime(stats.speakingTime), color: '#ea580c', bg: '#ffedd5' },
  ];

  const [viewDate, setViewDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const currentMonth = viewDate.toLocaleString('default', { month: 'long' });
  const currentYear = viewDate.getFullYear();
  
  // Real today for highlighting
  const isCurrentMonthAndYear = now.getMonth() === viewDate.getMonth() && now.getFullYear() === viewDate.getFullYear();
  const currentDay = isCurrentMonthAndYear ? now.getDate() : null;
  
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="dashboard">
      <div className="dashboard-top">
        <div>
          <div className="welcome-banner">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 style={{ margin: 0 }}>{getTranslation('dashboard', 'welcome', { name: localStorage.getItem('ielts_current_user_name') || 'Foydalanuvchi' })}</h2>
                  {(localStorage.getItem('ielts_user_membership_precise') || 'free') === 'pro' && (
                    <span style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: 'var(--primary-color)',
                      border: '1px solid rgba(139, 92, 246, 0.25)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em'
                    }}>
                      🚀 PRO
                    </span>
                  )}
                  {(localStorage.getItem('ielts_user_membership_precise') || 'free') === 'pro_plus' && (
                    <span style={{
                      backgroundColor: 'rgba(217, 119, 6, 0.1)',
                      color: '#d97706',
                      border: '1px solid rgba(217, 119, 6, 0.2)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      boxShadow: '0 0 10px rgba(217, 119, 6, 0.2)'
                    }}>
                      👑 PRO+
                    </span>
                  )}
                </div>
                <p style={{ margin: '0.25rem 0 0 0' }}>{getTranslation('dashboard', 'conquer')}</p>
              </div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#6366f1' }}>
                {now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            </div>
          </div>
          <div className="stats-container">
            {statCards.map((stat, idx) => (
              <div 
                key={idx} 
                className="stat-card"
                style={stat.editable ? { cursor: 'pointer' } : {}}
                onClick={() => stat.editable && updateStatField(stat.field, stat.prompt)}
              >
                <div className="stat-icon" style={{ backgroundColor: stat.bg }}>{stat.icon}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="stats-container" style={{ marginTop: '1rem', gap: '1rem' }}>
            {skillTimes.map((skill, idx) => (
              <div key={idx} className="stat-card" style={{ padding: '0.75rem', flexDirection: 'row', alignItems: 'center' }}>
                <div className="stat-icon" style={{ backgroundColor: skill.bg, width: '24px', height: '24px' }}>
                  <Clock size={14} color={skill.color} />
                </div>
                <div>
                  <div className="stat-value" style={{ fontSize: '1.1rem' }}>{skill.time}</div>
                  <div className="stat-label" style={{ fontSize: '0.7rem' }}>{skill.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="calendar-widget">
          <div className="calendar-header">
            <span className="calendar-title">{currentMonth} {currentYear}</span>
            <div style={{ display: 'flex', gap: '10px', userSelect: 'none' }}>
              <span onClick={handlePrevMonth} style={{ cursor: 'pointer', fontWeight: 'bold' }}>{'<'}</span>
              <span onClick={handleNextMonth} style={{ cursor: 'pointer', fontWeight: 'bold' }}>{'>'}</span>
            </div>
          </div>
          <div className="calendar-grid">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className="day-name">{d}</div>)}
            {emptyDays.map((_, idx) => <div key={`empty-${idx}`} />)}
            {calendarDays.map(day => (
              <div key={day} className={`day-number ${day === currentDay ? 'active' : ''}`}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-bottom">
        <div className="chart-card">
          <div className="chart-title">
            <span>{getTranslation('dashboard', 'weeklyTitle')}</span>
            <select style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px 8px' }}><option>Actives</option></select>
          </div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">{getTranslation('dashboard', 'skillsWeb')}</div>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={70} data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <Radar dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">{getTranslation('dashboard', 'badgesTitle')}</div>
          <div className="badges-showcase">
            <div className="badge-item" style={{ background: 'linear-gradient(135deg, #818cf8, #4f46e5)' }}>EI</div>
            <div className="badge-item" style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}>GH</div>
            <div className="badge-item" style={{ background: 'linear-gradient(135deg, #c084fc, #9333ea)' }}>LM</div>
            <div className="badge-item" style={{ background: 'linear-gradient(135deg, #60a5fa, #2563eb)' }}>SC</div>
            <div className="badge-item" style={{ background: 'linear-gradient(135deg, #f472b6, #db2777)' }}>VL</div>
          </div>
        </div>
      </div>

      {showUpgradeModal && upgradeInfo && (
        <div className="congrats-modal-backdrop" onClick={() => setShowUpgradeModal(false)}>
          <div className="congrats-modal-card" onClick={e => e.stopPropagation()}>
            <div className="congrats-icon-ring">
              👑
            </div>
            <h2 className="congrats-title">{getTranslation('dashboard', 'congratsTitle')}</h2>
            <p className="congrats-text">
              {getTranslation('dashboard', 'congratsText', { name: upgradeInfo.name, plan: upgradeInfo.planLabel })}
            </p>
            <p className="congrats-subtext">
              {getTranslation('dashboard', 'congratsSub')}
            </p>
            <button className="congrats-close-btn" onClick={() => setShowUpgradeModal(false)}>
              {getTranslation('dashboard', 'congratsBtn')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
