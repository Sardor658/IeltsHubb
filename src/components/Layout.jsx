import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  const [lang, setLang] = useState(localStorage.getItem('ielts_lang') || 'UZ');

  useEffect(() => {
    const handleLangChange = (e) => {
      setLang(e.detail);
    };
    window.addEventListener('ielts_lang_change', handleLangChange);
    return () => {
      window.removeEventListener('ielts_lang_change', handleLangChange);
    };
  }, []);

  return (
    <div className="app-container" key={lang}>
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
