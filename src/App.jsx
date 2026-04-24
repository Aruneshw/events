import { useEffect, useState } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

function LiveClock() {
  const [time, setTime] = useState('--:--:-- --');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTime(`${h}:${m}:${s}.${ms}`);
    };
    const interval = setInterval(updateClock, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="live-ticker">
      <div className="ticker-label">◈ SYSTEM TIME — MISSION CLOCK ◈</div>
      <div className="ticker-time">{time}</div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <>
      {/* Background elements */}
      <div className="scanline"></div>
      
      <div className="wrapper">
        <header className="header">
          <div className="header-badge">◆ CLASSIFIED: COMPETITION INTEL ◆</div>
          <h1>UPCOMING EVENT<br/>BATTLE REPORT</h1>
          <div className="header-sub">
            {session ? (
              <>USER: {session.user.email} <button onClick={logout} style={{marginLeft: 10}}>LOGOUT</button></>
            ) : (
              <button onClick={login}>ADMIN LOGIN</button>
            )}
          </div>
          <div className="header-line"></div>
        </header>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">--</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">--</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">--</span>
            <span className="stat-label">Teams Formed</span>
          </div>
        </div>

        <LiveClock />

        <div className="section-title">◈ &nbsp;EVENT DOSSIERS</div>
        
        {/* Placeholder for Events */}
        <p style={{textAlign: 'center', opacity: 0.5}}>No events loaded from database yet.</p>
        
        {session && (
          <div style={{ marginTop: '40px', padding: '20px', border: '1px dashed var(--neon-cyan)', borderRadius: '8px' }}>
            <h3 className="section-title" style={{ marginTop: 0 }}>◈ ADMIN: UNSTOP SCRAPER</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" placeholder="Paste Unstop URL..." style={{ flex: 1 }} />
              <button>SCAN & IMPORT</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default App;
