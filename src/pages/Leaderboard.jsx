import { useState, useEffect } from 'react';
import { Star, Clock, Flame, Coins } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import './Leaderboard.css';

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('Stars');
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentUserEmail = localStorage.getItem('ielts_current_user_email') || '';
  const usersDb = JSON.parse(localStorage.getItem('ielts_users_db') || '[]');
  const currentUser = usersDb.find(u => u.email === currentUserEmail) || null;
  const currentName = currentUser?.name || localStorage.getItem('ielts_user_name') || 'User';

  const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : '';

  useEffect(() => {
    // 1. Sync current user's stats from ielts_user_stats_precise to local ielts_users_db
    const syncStatsToLocalDb = () => {
      if (!currentUserEmail) return;
      try {
        const localStats = JSON.parse(localStorage.getItem('ielts_user_stats_precise') || '{}');
        const dbStr = localStorage.getItem('ielts_users_db');
        if (dbStr) {
          const db = JSON.parse(dbStr);
          const userIdx = db.findIndex(u => u.email.toLowerCase() === currentUserEmail.toLowerCase());
          if (userIdx !== -1) {
            db[userIdx].stars = localStats.stars || 0;
            db[userIdx].coins = localStats.coins || 0;
            db[userIdx].streak = localStats.streak || 0;
            
            const activeTimeMins = Math.round(((localStats.listeningTime || 0) + (localStats.readingTime || 0) + (localStats.writingTime || 0) + (localStats.speakingTime || 0)) / 60);
            db[userIdx].time = activeTimeMins || 0;
            
            localStorage.setItem('ielts_users_db', JSON.stringify(db));
          }
        }
      } catch (e) {
        console.error("Failed to sync stats to local db:", e);
      }
    };
    
    syncStatsToLocalDb();

    const registerAndFetch = async () => {
      try {
        setLoading(true);

        // Step 1: Register current user in backend so they always appear
        if (currentUserEmail) {
          const localStats = JSON.parse(localStorage.getItem('ielts_user_stats_precise') || '{}');
          const currentAvatar = localStorage.getItem('ielts_current_user_avatar') || null;
          await fetch(`${API_BASE}/api/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: currentUserEmail,
              name: currentName,
              avatar: currentAvatar,
              stars: localStats.stars || 0,
              time: localStats.practiceTimeMinutes || 0,
              coins: localStats.coins || 0,
              streak: localStats.streak || 0,
              practices: localStats.completedTests || 0
            })
          });
        }

        // Step 2: Fetch leaderboard
        const response = await fetch(`${API_BASE}/api/leaderboard`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard data');
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        console.error('Error fetching backend, loading local DB users:', err);
        
        // Local formatting functions
        const formatTimeLocal = (minutes) => {
          if (minutes === 0) return '0m';
          if (minutes < 60) return `${minutes}m`;
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          return m > 0 ? `${h}h ${m}m` : `${h}h`;
        };

        const localStats = JSON.parse(localStorage.getItem('ielts_user_stats_precise') || '{}');
        
        // Load real users from local DB instead of mock/random users
        const dbStr = localStorage.getItem('ielts_users_db') || '[]';
        let dbUsers = [];
        try {
          dbUsers = JSON.parse(dbStr);
        } catch (e) {
          dbUsers = [];
        }

        const realUsers = dbUsers.map(u => {
          if (u.email.toLowerCase() === (currentUserEmail || '').toLowerCase()) {
            const activeTimeMins = Math.round(((localStats.listeningTime || 0) + (localStats.readingTime || 0) + (localStats.writingTime || 0) + (localStats.speakingTime || 0)) / 60);
            return {
              name: u.name,
              email: u.email,
              avatar: u.avatar || localStorage.getItem('ielts_current_user_avatar') || null,
              stars: localStats.stars || 0,
              time: activeTimeMins || 0,
              streak: localStats.streak || 0,
              coins: localStats.coins || 0
            };
          }
          return {
            name: u.name,
            email: u.email,
            avatar: u.avatar || null,
            stars: u.stars || 0,
            time: u.time || 0,
            streak: u.streak || 0,
            coins: u.coins || 0
          };
        });

        const colorMap = { 1: 'gold', 2: 'silver', 3: 'bronze' };
        const typeMap  = { 1: 'first', 2: 'second', 3: 'third' };

        const getTopData = (sortKey) => {
          const sorted = [...realUsers].sort((a, b) => (b[sortKey] || 0) - (a[sortKey] || 0));

          const formatScore = (u) => {
            let score = u[sortKey] || 0;
            if (sortKey === 'time') return formatTimeLocal(score);
            if (sortKey === 'streak') return `${score} days`;
            return score;
          };

          const topPlayers = sorted
            .slice(0, 3)
            .map((u, index) => {
              const rank = index + 1;
              return {
                rank,
                name: u.name,
                email: u.email,
                avatar: u.avatar || null,
                score: formatScore(u),
                color: colorMap[rank],
                type: typeMap[rank],
                hasCrown: rank === 1
              };
            });

          const listPlayers = sorted.slice(0, 15).map((u, index) => ({
            rank: index + 1,
            name: u.name,
            email: u.email,
            avatar: u.avatar || null,
            score: formatScore(u)
          }));

          return { topPlayers, listPlayers };
        };

        setLeaderboardData({
          Stars:  getTopData('stars'),
          Time:   getTopData('time'),
          Streak: getTopData('streak'),
          Coins:  getTopData('coins')
        });
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    registerAndFetch();
  }, []);

  const icons = {
    Stars: <Star size={16} fill="#fbbf24" color="#fbbf24" />,
    Time: <Clock size={16} color="#3b82f6" />,
    Streak: <Flame size={16} color="#ef4444" />,
    Coins: <Coins size={16} color="#eab308" />
  };

  const currentData = leaderboardData ? leaderboardData[activeTab] : null;

  const formatScore = (score) => {
    if (typeof score === 'string') {
      if (score.endsWith('h')) {
        return score.replace('h', ' ' + getTranslation('leaderboard', 'hours'));
      }
      if (score.endsWith('m')) {
        return score.replace('m', ' ' + getTranslation('leaderboard', 'minutes'));
      }
      if (score.endsWith(' days')) {
        return score.replace(' days', ' ' + getTranslation('leaderboard', 'days'));
      }
    }
    return score;
  };

  if (loading) {
    return <div className="leaderboard-container"><p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>Loading...</p></div>;
  }

  if (error) {
    return <div className="leaderboard-container"><p style={{ color: '#ef4444', textAlign: 'center', marginTop: '2rem' }}>{error}</p></div>;
  }

  return (
    <div className="leaderboard-container">
      <div className="vocab-xp">
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>XP</span>
        <div className="xp-bar"></div>
      </div>

      <h2 className="leaderboard-title">{getTranslation('leaderboard', 'title')}</h2>

      {/* Podium — always shows 3 slots; fills with real data when available */}
      <div className="podium-container">
        {/* Static 3-slot podium in order: 2nd, 1st, 3rd */}
        {[2, 1, 3].map((rank) => {
          const colorMap = { 1: 'gold', 2: 'silver', 3: 'bronze' };
          const typeMap  = { 1: 'first', 2: 'second', 3: 'third' };
          const medalMap = { 1: '🥇', 2: '🥈', 3: '🥉' };
          const player   = currentData?.topPlayers?.find(p => p.rank === rank);
          return (
            <div key={rank} className="podium-place">
              {rank === 1 && <div className="crown">👑</div>}
              <div className={`avatar-ring ${colorMap[rank]} ${!player ? 'avatar-ring-empty' : ''}`}>
                {player?.avatar
                  ? <img src={player.avatar} alt={player.name} className="podium-avatar-img" />
                  : !player
                    ? <span className="empty-rank-label">{rank}</span>
                    : <span className="empty-rank-label">{player.name?.[0]?.toUpperCase()}</span>
                }
              </div>
              <div className={`podium-cylinder ${typeMap[rank]}`}>
                <div className="podium-rank-badge">{medalMap[rank]}</div>
                {player ? (
                  <div className="podium-name">
                    {player.name}
                    <div className="podium-score">⭐ {formatScore(player.score)}</div>
                  </div>
                ) : (
                  <div className="podium-name podium-name-empty">
                    — — —
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="leaderboard-tabs">
        {Object.keys(icons).map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'Stars' && getTranslation('leaderboard', 'stars')}
            {tab === 'Time' && getTranslation('leaderboard', 'time')}
            {tab === 'Streak' && getTranslation('leaderboard', 'streak')}
            {tab === 'Coins' && getTranslation('leaderboard', 'coins')}
          </button>
        ))}
      </div>

      <div className="leaderboard-list">
        {!currentData?.listPlayers?.length ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
            {getTranslation('leaderboard', 'noPlayers') || 'Hali hech kim yo\'q'}
          </p>
        ) : (
          currentData.listPlayers.map((player) => {
            const isCurrent = player.email === currentUserEmail;
            const initials = player.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            return (
              <div key={player.rank} className={`list-item ${isCurrent ? 'current-user' : ''}`}>
                <div className="rank-number">{player.rank}</div>
                <div className="user-avatar">
                  {player.avatar
                    ? <img src={player.avatar} alt={player.name} className="avatar-img" />
                    : <span className="avatar-initials">{initials}</span>
                  }
                </div>
                <div className="user-name">
                  {player.name}
                  {isCurrent && <span className="you-badge">{getTranslation('leaderboard', 'you')}</span>}
                </div>
                <div className="user-score">
                  {icons[activeTab]} {formatScore(player.score)}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
