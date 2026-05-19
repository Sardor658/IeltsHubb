import { Clock, Users, Check, Star, Gem, Zap, Award } from 'lucide-react';
import { useState } from 'react';
import { getTranslation } from '../utils/translations';
import { toast } from 'react-hot-toast';
import './Packs.css';

const Packs = () => {
  const [activeSection, setActiveSection] = useState('premium'); // 'premium' | 'courses'
  const [filter, setFilter] = useState('All');
  const [userMembership, setUserMembership] = useState(localStorage.getItem('ielts_user_membership_precise') || 'free');

  const packsData = [
    {
      id: 'writing',
      title: 'Writing Pack',
      origPrice: '$300',
      salePrice: '$5',
      desc: 'Creative strategies for perfect essay and letter compositions in writing module.',
      duration: '10 Minutes',
      lessons: '12 Lessons',
      imgClass: 'img-writing',
      tag: 'Best Seller',
      btnText: 'Enroll Now',
      status: 'unstarted'
    },
    {
      id: 'reading',
      title: 'Reading Pack',
      origPrice: '$500',
      salePrice: '$10',
      desc: 'Advanced comprehension techniques and full academic passage readings.',
      duration: '10 Duration',
      lessons: '12 Lessons',
      imgClass: 'img-reading',
      tag: 'Best Seller',
      btnText: 'View Pack',
      status: 'in-progress'
    },
    {
      id: 'listening',
      title: 'Listening Pack',
      origPrice: '$450',
      salePrice: '$7',
      desc: 'High-score strategies for general and academic listening test sessions.',
      duration: '10 Duration',
      lessons: '13 Lessons',
      imgClass: 'img-listening',
      tag: 'New',
      btnText: 'View Pack',
      status: 'completed'
    }
  ];

  const filteredPacks = packsData.filter(pack => {
    if (filter === 'All') return true;
    if (filter === 'In Progress') return pack.status === 'in-progress';
    if (filter === 'Completed') return pack.status === 'completed';
    return true;
  });

  const handleUpgrade = (planType, planName) => {
    const confirmRedirect = window.confirm(
      `Siz ${planName} tarifini xarid qilmoqchisiz! 💎\n\nUshbu tarifni to'lov orqali faollashtirish uchun administrator Sardor (@the_sardor_official) ning Telegram sahifasiga yo'naltirilasiz. U yerda to'lovni amalga oshirasiz va admin sizga tarifni ochib beradi.\n\nTelegramga o'tishni tasdiqlaysizmi?`
    );
    if (confirmRedirect) {
      window.open('https://t.me/the_sardor_official', '_blank');
    }
  };

  const handleDowngrade = () => {
    localStorage.setItem('ielts_user_membership_precise', 'free');
    setUserMembership('free');
    toast.success("Tarifingiz muvaffaqiyatli bepul (Free) rejimiga qaytarildi. 🎁");
  };

  return (
    <div className="packs-container">
      <h2 className="packs-title">{getTranslation('packs', 'title')}</h2>

      {/* Main Section Navigation Tabs */}
      <div className="packs-section-tabs">
        <button 
          className={`sec-tab-btn ${activeSection === 'premium' ? 'active' : ''}`}
          onClick={() => setActiveSection('premium')}
        >
          <Gem size={18} /> Premium
        </button>
        <button 
          className={`sec-tab-btn ${activeSection === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveSection('courses')}
        >
          <Award size={18} /> Packs
        </button>
      </div>

      {activeSection === 'premium' ? (
        <div className="premium-dashboard">
          {/* Current Membership Banner */}
          <div className="membership-banner">
            <div className="banner-left">
              <span className="banner-label">{getTranslation('packs', 'currentPlan')}:</span>
              <span className={`banner-value val-${userMembership}`}>
                {userMembership === 'free' && `🎁 ${getTranslation('packs', 'freeTitle')}`}
                {userMembership === 'pro' && `🚀 ${getTranslation('packs', 'proTitle')}`}
                {userMembership === 'pro_plus' && `👑 ${getTranslation('packs', 'proPlusTitle')}`}
              </span>
            </div>
            {userMembership !== 'free' && (
              <button className="downgrade-btn" onClick={handleDowngrade}>
                Reset to Free Plan
              </button>
            )}
          </div>

          <div className="plans-grid">
            {/* PRO PLAN */}
            <div className={`plan-card card-pro ${userMembership === 'pro' ? 'active-plan' : ''}`}>
              <div className="plan-badge">POPULAR</div>
              <div className="plan-icon-wrapper bg-pro">
                <Zap size={32} color="#8b5cf6" />
              </div>
              <h3 className="plan-name">{getTranslation('packs', 'proTitle')}</h3>
              <p className="plan-subtitle">{getTranslation('packs', 'subtitle')}</p>
              
              <div className="plan-price-row">
                <span className="plan-price">15 000</span>
                <span className="plan-currency">so'm / oy</span>
              </div>

              <ul className="plan-features">
                <li>
                  <Check size={16} className="feat-check" />
                  <span>{getTranslation('packs', 'proFeature1')}</span>
                </li>
                <li>
                  <Check size={16} className="feat-check" />
                  <span>{getTranslation('packs', 'proFeature2')}</span>
                </li>
                <li>
                  <Check size={16} className="feat-check" />
                  <span>{getTranslation('packs', 'proFeature3')}</span>
                </li>
              </ul>

              <button 
                className={`plan-buy-btn btn-upgrade-pro ${userMembership === 'pro' ? 'current-active' : ''}`}
                onClick={() => handleUpgrade('pro', 'PRO')}
                disabled={userMembership === 'pro'}
              >
                {userMembership === 'pro' ? getTranslation('packs', 'currentPlan') : getTranslation('packs', 'upgradeBtn') + ' (PRO)'}
              </button>
            </div>

            {/* PRO+ PLAN */}
            <div className={`plan-card card-pro-plus ${userMembership === 'pro_plus' ? 'active-plan' : ''}`}>
              <div className="plan-badge bg-gold">ULTIMATE</div>
              <div className="plan-icon-wrapper bg-pro-plus">
                <Star size={32} color="#d97706" />
              </div>
              <h3 className="plan-name">{getTranslation('packs', 'proPlusTitle')}</h3>
              <p className="plan-subtitle">{getTranslation('packs', 'subtitle')}</p>
              
              <div className="plan-price-row">
                <span className="plan-price">45 000</span>
                <span className="plan-currency text-gold">so'm / oy</span>
              </div>

              <ul className="plan-features">
                <li className="premium-li">
                  <Check size={16} className="feat-check check-gold" />
                  <span className="text-gold-strong">{getTranslation('packs', 'proPlusFeature1')}</span>
                </li>
                <li>
                  <Check size={16} className="feat-check" />
                  <span>{getTranslation('packs', 'proPlusFeature2')}</span>
                </li>
                <li>
                  <Check size={16} className="feat-check" />
                  <span>{getTranslation('packs', 'proPlusFeature3')}</span>
                </li>
              </ul>

              <button 
                className={`plan-buy-btn btn-upgrade-pro-plus ${userMembership === 'pro_plus' ? 'current-active' : ''}`}
                onClick={() => handleUpgrade('pro_plus', 'PRO+ ULTIMATE')}
                disabled={userMembership === 'pro_plus'}
              >
                {userMembership === 'pro_plus' ? getTranslation('packs', 'currentPlan') : getTranslation('packs', 'upgradeBtn') + ' (PRO+)'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="packs-filters">
            <button 
              className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
              onClick={() => setFilter('All')}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'In Progress' ? 'active' : ''}`}
              onClick={() => setFilter('In Progress')}
            >
              In Progress
            </button>
            <button 
              className={`filter-btn ${filter === 'Completed' ? 'active' : ''}`}
              onClick={() => setFilter('Completed')}
            >
              Completed
            </button>
          </div>
          
          <div className="packs-grid">
            {filteredPacks.map((pack) => (
              <div key={pack.id} className="pack-card">
                <div className="ribbon-discount">
                  25%<br/>OFF
                </div>
                <div className="ribbon-tag">{pack.tag}</div>
                
                <div className={`pack-image ${pack.imgClass}`}></div>
                
                <div className="pack-header">
                  <div className="pack-name">{pack.title}</div>
                  <div className="pack-price-container">
                    <div className="price-original">{pack.origPrice}</div>
                    <div className="price-sale-label">Sale price</div>
                    <div className="price-sale">{pack.salePrice}</div>
                  </div>
                </div>
                
                <p className="pack-desc">{pack.desc}</p>
                
                <div className="pack-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{pack.duration}</span>
                  </div>
                  <div className="meta-item">
                    <Users size={16} />
                    <span>{pack.lessons}</span>
                  </div>
                </div>
                
                <button className={`pack-btn btn-${pack.id}`}>{pack.btnText}</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Packs;
