import { useState, useEffect, useRef } from 'react';
import { Shield, User, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import './Admin.css';

const Admin = () => {
  const [isAdminLogged, setIsAdminLogged] = useState(sessionStorage.getItem('ielts_admin_logged') === 'true');
  const tableRef = useRef(null);

  useEffect(() => {
    const el = tableRef.current;
    if (!el) return;
    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [isAdminLogged, users]);
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const [users, setUsers] = useState([]);
  
  // Search states
  const [searchEmail, setSearchEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    if (isAdminLogged) {
      loadUsers();
    }
  }, [isAdminLogged]);

  const loadUsers = () => {
    let db = localStorage.getItem('ielts_users_db');
    if (db) {
      setUsers(JSON.parse(db));
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUser === 'sardoradmin' && adminPass === 'sardoradmin123') {
      sessionStorage.setItem('ielts_admin_logged', 'true');
      setIsAdminLogged(true);
      toast.success("Hush kelibsiz, Sardor Admin! 🛡️");
    } else {
      toast.error("Xatolik: Login yoki parol noto'g'ri!");
    }
  };

  const handleUpdatePlan = (userId, newPlan) => {
    let db = JSON.parse(localStorage.getItem('ielts_users_db')) || [];
    let updatedDb = db.map(u => u.id === userId ? { ...u, plan: newPlan } : u);
    localStorage.setItem('ielts_users_db', JSON.stringify(updatedDb));
    setUsers(updatedDb);

    const targetUser = updatedDb.find(u => u.id === userId);
    
    // Auto sync current session if admin edits the active logged-in user
    if (targetUser && targetUser.email === localStorage.getItem('ielts_current_user_email')) {
      localStorage.setItem('ielts_user_membership_precise', newPlan);
    }

    if (searchedUser && searchedUser.id === userId) {
      setSearchedUser({ ...searchedUser, plan: newPlan });
    }

    // Pro yoki Pro+ bo'lsa, foydalanuvchiga tabriq bildirish uchun belgi qo'yish
    if (newPlan === 'pro' || newPlan === 'pro_plus') {
      const planLabel = newPlan === 'pro' ? 'PRO 🚀' : 'PRO+ 👑';
      localStorage.setItem(
        `ielts_plan_notify_${targetUser.email}`,
        JSON.stringify({ plan: newPlan, planLabel, name: targetUser.name, ts: Date.now() })
      );
    } else {
      // Free ga qaytarilsa notificationni tozalash
      localStorage.removeItem(`ielts_plan_notify_${targetUser.email}`);
    }

    toast.success(`Muvaffaqiyatli! 🛡️ ${targetUser.name} uchun tarif [${newPlan.toUpperCase()}] ga o'zgartirildi.`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchError('');
    setSearchedUser(null);
    let db = JSON.parse(localStorage.getItem('ielts_users_db')) || [];
    const found = db.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());
    
    if (found) {
      setSearchedUser(found);
    } else {
      setSearchError("Bunday emailga ega foydalanuvchi topilmadi!");
    }
  };

  if (!isAdminLogged) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '80vh', background: '#f8fafc', borderRadius: '1rem' }}>
        <form onSubmit={handleAdminLogin} style={{ background: 'white', padding: '3.5rem', borderRadius: '1.5rem', width: '420px', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <div style={{ width: '80px', height: '80px', background: '#f3e8ff', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' }}>
              <Shield size={40} color="#8b5cf6" />
            </div>
            <h2 style={{ color: '#0f172a', margin: 0, fontFamily: 'Outfit', fontSize: '1.8rem', fontWeight: 800 }}>Admin Login</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.5rem' }}>Tizimga kirish uchun maxfiy kalitlarni kiriting</p>
          </div>
          <input 
            type="text" 
            placeholder="Admin Login (sardoradmin)" 
            value={adminUser} 
            onChange={e => setAdminUser(e.target.value)} 
            style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="Parol (sardoradmin123)" 
            value={adminPass} 
            onChange={e => setAdminPass(e.target.value)} 
            style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1', fontSize: '0.95rem', outline: 'none' }} 
            required 
          />
          <button type="submit" style={{ background: '#8b5cf6', color: 'white', padding: '1rem', borderRadius: '0.75rem', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '0.5rem' }}>
            Kirish
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header-card">
        <div className="shield-icon-wrapper">
          <Shield size={36} color="#8b5cf6" />
        </div>
        <div className="header-text-block">
          <h2 className="admin-title">Sardor's Admin CRM</h2>
          <p className="admin-subtitle">Foydalanuvchilarni izlash va Ularning ta'riflarini (PRO / PRO+) faollashtirish</p>
        </div>
      </div>

      <div className="admin-grid">
        {/* Left Side: Search & Verify Tool */}
        <div className="admin-card">
          <div className="card-header" style={{ marginBottom: '1.5rem' }}>
            <h3>Foydalanuvchini Qidirish va Tasdiqlash</h3>
          </div>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <input 
              type="email" 
              placeholder="Foydalanuvchi emailini kiriting..." 
              value={searchEmail} 
              onChange={e => setSearchEmail(e.target.value)} 
              style={{ flex: 1, padding: '0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }}
              required
            />
            <button type="submit" style={{ background: '#8b5cf6', color: 'white', padding: '0 1.5rem', borderRadius: '0.5rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Search size={18} /> Izlash
            </button>
          </form>

          {searchError && (
            <div style={{ padding: '1rem', background: '#fee2e2', color: '#ef4444', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <AlertCircle size={18} /> {searchError}
            </div>
          )}

          {searchedUser && (
            <div className="searched-user-box">
              <h4 style={{ margin: '0 0 1rem 0' }}>Topilgan Foydalanuvchi:</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <strong>{searchedUser.name}</strong> <br/>
                  <span style={{ color: '#64748b', fontSize: '0.9rem' }}>{searchedUser.email}</span>
                </div>
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b', marginRight: '0.5rem' }}>Joriy Tarif:</span>
                  <span className={`plan-pill plan-${searchedUser.plan}`}>
                    {searchedUser.plan === 'free' && '🎁 Free'}
                    {searchedUser.plan === 'pro' && '🚀 Pro'}
                    {searchedUser.plan === 'pro_plus' && '👑 Pro+'}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <button className="act-btn act-free" onClick={() => handleUpdatePlan(searchedUser.id, 'free')}>Free qilish</button>
                <button className="act-btn act-pro" onClick={() => handleUpdatePlan(searchedUser.id, 'pro')}>PRO (15K) och</button>
                <button className="act-btn act-pro-plus" onClick={() => handleUpdatePlan(searchedUser.id, 'pro_plus')}>PRO+ (45K) och</button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Users CRM Table List */}
        <div className="admin-card users-crm-card">
          <div className="card-header">
            <h3>Barcha A'zolar Bazasi</h3>
            <span className="user-count-badge">{users.length} ta a'zo</span>
          </div>

          <div className="users-table-wrapper" ref={tableRef}>
            <table className="users-table">
              <thead>
                <tr>
                  <th>Foydalanuvchi</th>
                  <th>Email / Login</th>
                  <th>Parol (Maxfiy)</th>
                  <th>Joriy Tarif</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="user-info-td">
                      <div className="user-avatar-small">
                        <User size={16} />
                      </div>
                      <div>
                        <strong>{u.name}</strong>
                      </div>
                    </td>
                    <td><span className="tg-username" style={{ color: '#64748b' }}>{u.email}</span></td>
                    <td><span className="user-password-badge">{u.password}</span></td>
                    <td>
                      <span className={`plan-pill plan-${u.plan}`}>
                        {u.plan === 'free' && '🎁 Free'}
                        {u.plan === 'pro' && '🚀 Pro'}
                        {u.plan === 'pro_plus' && '👑 Pro+'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
