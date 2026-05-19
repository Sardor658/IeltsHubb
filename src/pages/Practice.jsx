import { Headphones, BookOpen, PenTool, Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getTranslation } from '../utils/translations';
import './Practice.css';

const Practice = () => {
  const navigate = useNavigate();
  const modules = [
    {
      id: 'listening',
      title: getTranslation('practice', 'listening'),
      subtitle: getTranslation('practice', 'listeningSub'),
      lessons: 12,
      icon: <Headphones size={48} color="#0284c7" />,
      colorClass: 'module-listening'
    },
    {
      id: 'reading',
      title: getTranslation('practice', 'reading'),
      subtitle: getTranslation('practice', 'readingSub'),
      lessons: 12,
      icon: <BookOpen size={48} color="#16a34a" />,
      colorClass: 'module-reading'
    },
    {
      id: 'writing',
      title: getTranslation('practice', 'writing'),
      subtitle: getTranslation('practice', 'writingSub'),
      lessons: 12,
      icon: <PenTool size={48} color="#9333ea" />,
      colorClass: 'module-writing'
    },
    {
      id: 'speaking',
      title: getTranslation('practice', 'speaking'),
      subtitle: getTranslation('practice', 'speakingSub'),
      lessons: 13,
      icon: <Mic size={48} color="#ea580c" />,
      colorClass: 'module-speaking'
    }
  ];

  return (
    <div className="practice-container">
      <div className="practice-header">
        <h2 className="practice-main-title">{getTranslation('practice', 'title')}</h2>
        <p className="practice-main-subtitle">{getTranslation('practice', 'subtitle')}</p>
      </div>

      <div className="practice-grid">
        {modules.map((mod) => (
          <div key={mod.id} className={`module-card ${mod.colorClass}`} onClick={() => navigate(`/practice/${mod.id}`)}>
            <div className="module-image">
              {mod.icon}
            </div>
            <div className="module-content">
              <div className="lessons-badge">
                <ClockIcon /> {mod.lessons} {getTranslation('practice', 'lessons')}
              </div>
              <h3 className="module-title">{mod.title}</h3>
              <p className="module-subtitle">{mod.subtitle}</p>
              <button className="start-btn" onClick={(e) => {
                e.stopPropagation();
                navigate(`/practice/${mod.id}`);
              }}>
                {getTranslation('practice', 'startBtn')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

export default Practice;
