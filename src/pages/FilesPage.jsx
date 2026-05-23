import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, FolderOpen, FileText, Headphones, BookOpen, Download, ExternalLink, Lock } from 'lucide-react';
import { getTranslation } from '../utils/translations';
import './FilesPage.css';

// Mock files database
const MOCK_FILES = [
  {
    id: 1,
    title: "Cambridge IELTS 19 Academic",
    category: "cambridge",
    type: "pdf",
    size: "14.2 MB",
    isPremium: false,
    icon: BookOpen,
    color: "#8b5cf6",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 2,
    title: "Cambridge IELTS 19 Audio Tracks",
    category: "audio",
    type: "mp3",
    size: "145.8 MB",
    isPremium: false,
    icon: Headphones,
    color: "#f59e0b",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 3,
    title: "Official Mock Test 2026 (Reading & Writing)",
    category: "mockTests",
    type: "pdf",
    size: "5.1 MB",
    isPremium: false,
    icon: FileText,
    color: "#10b981",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 4,
    title: "Advanced Vocabulary Collocations",
    category: "cambridge",
    type: "pdf",
    size: "8.4 MB",
    isPremium: true,
    icon: BookOpen,
    color: "#ec4899",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  },
  {
    id: 5,
    title: "IELTS Speaking Band 9 Samples",
    category: "audio",
    type: "audio",
    size: "42.3 MB",
    isPremium: true,
    icon: Headphones,
    color: "#3b82f6",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 6,
    title: "Recent Actual Tests Vol 8",
    category: "mockTests",
    type: "pdf",
    size: "11.2 MB",
    isPremium: true,
    icon: FileText,
    color: "#6366f1",
    url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
  }
];

const FilesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('allFiles');
  const tabsRef = useRef(null);

  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, []);

  // Filter logic
  const filteredFiles = useMemo(() => {
    return MOCK_FILES.filter(file => {
      const matchesSearch = file.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === 'allFiles' || file.category === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  const handleDownload = (file) => {
    // Haqiqiy ishlaydigan download
    const link = document.createElement('a');
    link.href = file.url;
    link.target = '_blank';
    link.download = `${file.title}.${file.type}`; // Browser will try to download or open
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpen = (file) => {
    // Haqiqiy faylni yangi oynada ochish
    window.open(file.url, '_blank');
  };

  return (
    <div className="files-page-container animate-fade-in">
      {/* Header Area */}
      <div className="files-header glass-panel">
        <div className="files-header-content">
          <div className="files-header-title-box">
            <div className="files-icon-wrap">
              <FolderOpen size={28} color="#fff" />
            </div>
            <div>
              <h1 className="files-title">{getTranslation('filesPage', 'title')}</h1>
              <p className="files-subtitle">{getTranslation('filesPage', 'subtitle')}</p>
            </div>
          </div>
          
          <div className="files-search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              className="files-search-input"
              placeholder={getTranslation('filesPage', 'searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="files-tabs-scroll-area" ref={tabsRef}>
          <button 
            className={`file-tab-btn ${activeTab === 'allFiles' ? 'active' : ''}`}
            onClick={() => setActiveTab('allFiles')}
          >
            {getTranslation('filesPage', 'allFiles')}
          </button>
          <button 
            className={`file-tab-btn ${activeTab === 'cambridge' ? 'active' : ''}`}
            onClick={() => setActiveTab('cambridge')}
          >
            {getTranslation('filesPage', 'cambridge')}
          </button>
          <button 
            className={`file-tab-btn ${activeTab === 'mockTests' ? 'active' : ''}`}
            onClick={() => setActiveTab('mockTests')}
          >
            {getTranslation('filesPage', 'mockTests')}
          </button>
          <button 
            className={`file-tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            {getTranslation('filesPage', 'audio')}
          </button>
        </div>
      </div>

      {/* Files Grid */}
      <div className="files-grid">
        {filteredFiles.length > 0 ? (
          filteredFiles.map((file) => {
            const FileIcon = file.icon;
            return (
              <div key={file.id} className="file-card glass-panel">
                <div className="file-card-header">
                  <div className="file-type-icon" style={{ backgroundColor: file.color + '20', color: file.color }}>
                    <FileIcon size={24} />
                  </div>
                  {file.isPremium && (
                    <div className="file-premium-badge">
                      <Lock size={12} />
                      <span>PRO</span>
                    </div>
                  )}
                </div>
                
                <div className="file-card-body">
                  <h3 className="file-card-title">{file.title}</h3>
                  <div className="file-card-meta">
                    <span className="file-format">{file.type.toUpperCase()}</span>
                    <span className="file-dot">•</span>
                    <span className="file-size">{file.size}</span>
                  </div>
                </div>

                <div className="file-card-actions">
                  <button className="file-action-btn primary" onClick={() => handleDownload(file)}>
                    <Download size={16} />
                    <span>{getTranslation('filesPage', 'download')}</span>
                  </button>
                  <button className="file-action-btn secondary" onClick={() => handleOpen(file)}>
                    <ExternalLink size={16} />
                    <span>{getTranslation('filesPage', 'open')}</span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="files-empty-state">
            <FolderOpen size={48} color="var(--text-muted)" />
            <h3>Topilmadi</h3>
            <p>Qidiruv so'ziga mos fayllar topilmadi.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesPage;
