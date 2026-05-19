import { getTranslation } from '../utils/translations';
import './Achievements.css';

const Achievements = () => {
  const coreBadges = [
    { id: 1, title: 'STREAK MASTER', subtitle: 'Streak stresters', icon: '🔥', maxHex: 5, filledHex: 3, completed: false },
    { id: 2, title: 'PRACTICE TIME', subtitle: 'Animed time in-progress', icon: '⏳', maxHex: 5, filledHex: 4, completed: false },
    { id: 3, title: 'VOCABULARY MASTER', subtitle: 'Vocabulary team', icon: '📖', maxHex: 5, filledHex: 2, completed: false },
    { id: 4, title: 'VOCABULAY TIME', subtitle: 'Fowards toition', icon: '🏅', maxHex: 5, filledHex: 5, completed: true },
    { id: 5, title: 'PREAL RATING', subtitle: 'Completed badges', icon: '🏅', maxHex: 5, filledHex: 5, completed: true },
  ];

  const specialBadges = [
    { id: 6, title: 'KING OF READING', subtitle: 'Read 100 articles', icon: '📖', maxHex: 1, filledHex: 0, completed: false },
    { id: 7, title: 'GRAMMAR HERO', subtitle: 'Perfect score', icon: '🏅', maxHex: 1, filledHex: 1, completed: true },
    { id: 8, title: 'LISTENING PRO', subtitle: 'Listen 50 hours', icon: '🛡️', maxHex: 1, filledHex: 0, completed: false },
    { id: 9, title: 'SPEED WRITER', subtitle: 'Fast writing', icon: '🏅', maxHex: 1, filledHex: 1, completed: true },
    { id: 10, title: 'PERFECT SCORE', subtitle: 'Band 9.0 Mock', icon: '🏅', maxHex: 1, filledHex: 1, completed: true },
  ];

  const renderHexes = (max, filled) => {
    return Array.from({ length: max }).map((_, i) => (
      <div key={i} className={`hex ${i < filled ? 'filled' : ''}`}></div>
    ));
  };

  const renderBadge = (badge) => (
    <div key={badge.id} className={`badge-card ${badge.completed ? 'completed' : ''}`}>
      <div className="badge-icon-wrapper">{badge.icon}</div>
      <div>
        <div className="badge-title">{badge.title}</div>
        <div className="badge-subtitle">{badge.subtitle}</div>
        <div className="hex-progress">
          {renderHexes(badge.maxHex, badge.filledHex)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="achievements-container">
      <div className="vocab-xp">
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-secondary)' }}>XP</span>
        <div className="xp-bar" style={{ width: '150px' }}></div>
      </div>

      <h2 className="achievements-title">{getTranslation('achievements', 'explore')}</h2>

      <div className="progress-section">
        <div className="progress-labels">
          <span>{getTranslation('achievements', 'complete', { percent: 68 })}</span>
          <span>68%</span>
          <span>{getTranslation('achievements', 'badgesCount', { count: 14 })}</span>
        </div>
        <div className="main-progress-bar">
          <div className="main-progress-fill" style={{ width: '68%' }}></div>
        </div>
      </div>

      <div className="achievement-tabs">
        <button className="ach-tab-btn active">{getTranslation('achievements', 'all')}</button>
        <button className="ach-tab-btn">{getTranslation('achievements', 'inProgress')}</button>
        <button className="ach-tab-btn">{getTranslation('achievements', 'completed')}</button>
      </div>

      <div className="achievement-section">
        <div className="section-divider">{getTranslation('achievements', 'coreProgress')}</div>
        <div className="achievements-grid">
          {coreBadges.map(renderBadge)}
        </div>
      </div>

      <div className="achievement-section">
        <div className="section-divider">{getTranslation('achievements', 'specialAchievements')}</div>
        <div className="achievements-grid">
          {specialBadges.map(renderBadge)}
        </div>
      </div>
    </div>
  );
};

export default Achievements;
