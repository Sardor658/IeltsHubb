import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Clock, CheckCircle, Award, Star, ArrowRight } from 'lucide-react';
import CLOUDS from 'vanta/dist/vanta.clouds.min';
import * as THREE from 'three';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [vantaEffect, setVantaEffect] = useState(null);
  const vantaRef = useRef(null);

  useEffect(() => {
    // Ensure THREE is globally available for Vanta under all circumstances
    if (typeof window !== 'undefined') {
      window.THREE = THREE;
    }

    const vantaEffectFunc = CLOUDS?.default || CLOUDS;

    if (!vantaEffect && typeof vantaEffectFunc === 'function' && vantaRef.current) {
      try {
        setVantaEffect(
          vantaEffectFunc({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            skyColor: 0xd8b4fe,         // Light purple sky
            cloudColor: 0xf3e8ff,       // Soft lavender clouds
            cloudShadowColor: 0x6b21a8, // Deep violet cloud shadows
            sunColor: 0x7c3aed,         // Vivid purple sun
            sunGlareColor: 0xc084fc,    // Violet sun glare
            sunlightColor: 0xa78bfa,    // Soft purple sunlight
            speed: 1.00
          })
        );
      } catch (error) {
        console.error("Vanta initialization error:", error);
      }
    }
    return () => {
      if (vantaEffect && typeof vantaEffect.destroy === 'function') {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  const handleNavigateToAuth = (mode) => {
    navigate('/login', { state: { mode } });
  };

  return (
    <div className="landing-page-container">
      {/* Vanta.js 3D Interactive Clouds Canvas container */}
      <div className="vanta-bg-container" ref={vantaRef}></div>

      {/* 1. Header Navigation Bar */}
      <header className="landing-header">
        <div className="landing-logo">
          <div className="logo-icon-circle">
            <Target size={24} color="#8b5cf6" />
          </div>
          <span className="logo-title">IELTS HUB</span>
        </div>

        <nav className="landing-nav">
          <a href="#about" className="nav-link active">About us</a>
          <a href="#features" className="nav-link">Features</a>
          <a href="#pricing" className="nav-link">Pricing</a>
        </nav>

        <div className="header-actions">
          <button className="landing-login-link" onClick={() => handleNavigateToAuth('login')}>
            Sign In
          </button>
          <button className="landing-signup-btn" onClick={() => handleNavigateToAuth('register')}>
            Sign Up
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="landing-hero-section">
        {/* Left Info Column */}
        <div className="hero-left">
          <div className="badge-announcement">
            <span className="badge-new">NEW</span>
            <span className="badge-text">AI Speaking Examiner 2.0 is live!</span>
          </div>

          <h1 className="hero-headline">
            Get The Full <span className="highlight-text">IELTS</span> <br />
            Exam Experience <br />
            At Home
          </h1>

          <p className="hero-subtext">
            Get real exam-like practice for Listening, Reading, Writing, and Speaking. 
            Improve your band score with our advanced AI-powered real-time stopwatch feedback system.
          </p>

          <div className="hero-cta-buttons">
            <button className="cta-btn-primary" onClick={() => handleNavigateToAuth('register')}>
              Start free test <ArrowRight size={18} />
            </button>
            <button className="cta-btn-secondary" onClick={() => handleNavigateToAuth('login')}>
              Get free trial
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hero-metrics">
            <div className="metric-item">
              <strong>10K+</strong>
              <span>Students</span>
            </div>
            <div className="metric-item">
              <strong>98.5%</strong>
              <span>Success Rate</span>
            </div>
            <div className="metric-item">
              <strong>4.9 <Star size={14} fill="#f59e0b" color="#f59e0b" style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '2px' }} /></strong>
              <span>App Rating</span>
            </div>
          </div>
        </div>

        {/* Right Student Image Circle with Floating Badges */}
        <div className="hero-right">
          <div className="orbit-circle orbit-outer"></div>
          <div className="orbit-circle orbit-middle"></div>
          <div className="orbit-circle orbit-inner"></div>

          <div className="student-circle-container">
            <div className="student-purple-bg"></div>
            <img 
              src="/student.png" 
              alt="IELTS Hub Student" 
              className="student-hero-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.classList.add('image-fallback');
              }}
            />
          </div>

          {/* Floating Glassmorphic Badge 1 */}
          <div className="floating-badge badge-tests animate-bounce-slow">
            <div className="badge-icon bg-green-badge">
              <CheckCircle size={18} color="#8b5cf6" />
            </div>
            <div className="badge-text-wrapper">
              <strong>100+</strong>
              <span>Practice tests</span>
            </div>
          </div>

          {/* Floating Glassmorphic Badge 2 */}
          <div className="floating-badge badge-interface animate-bounce-faster">
            <div className="badge-icon bg-purple-badge">
              <Clock size={18} color="#7c3aed" />
            </div>
            <div className="badge-text-wrapper">
              <strong>100%</strong>
              <span>Exam Interface</span>
            </div>
          </div>

          {/* Floating Glassmorphic Badge 3 (AI Feedback) */}
          <div className="floating-badge badge-ai animate-bounce-slowest">
            <div className="badge-icon bg-gold-badge">
              <Award size={18} color="#d97706" />
            </div>
            <div className="badge-text-wrapper">
              <strong>AI Score</strong>
              <span>Real-time feedback</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Features Section Preview */}
      <section className="features-preview-section" id="features">
        <h2 className="section-title">4 Ta Asosiy Ko'nikmani Qamrab Oling</h2>
        <p className="section-subtitle">Listening, Reading, Writing va Speaking bo'limlaridan real imtihon muhitida o'ting</p>
        
        <div className="features-grid">
          <div className="feat-preview-card bg-listening" onClick={() => handleNavigateToAuth('login')}>
            <div className="feat-icon-box">🎧</div>
            <h3>Listening Practice</h3>
            <p>Jonli audio, tezkor javoblar va audio tezligini boshqarish paneli.</p>
          </div>
          <div className="feat-preview-card bg-reading" onClick={() => handleNavigateToAuth('login')}>
            <div className="feat-icon-box">📖</div>
            <h3>Reading Practice</h3>
            <p>Yonma-yon o'qish (split screen) interfeysi, savollar va taymer bilan.</p>
          </div>
          <div className="feat-preview-card bg-writing" onClick={() => handleNavigateToAuth('login')}>
            <div className="feat-icon-box">✍️</div>
            <h3>Writing Practice</h3>
            <p>Haqiqiy matn muharriri, so'zlar hisoblagichi va tahliliy andozalar.</p>
          </div>
          <div className="feat-preview-card bg-speaking" onClick={() => handleNavigateToAuth('login')}>
            <div className="feat-icon-box">🎤</div>
            <h3>Speaking Practice</h3>
            <p>AI mikrofoni, Cambridge speaking full testlar va ovozli javob yozish.</p>
          </div>
        </div>
      </section>

      {/* 4. Footer */}
      <footer className="landing-footer">
        <p>© 2026 IELTS HUB. Barcha huquqlar himoyalangan. Sardor tomonidan taqdim etiladi.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
