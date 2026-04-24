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
            ARUNESHWARAN K &nbsp;|&nbsp; B.TECH AIML · 1ST YEAR &nbsp;|&nbsp; APRIL 2025
          </div>
          <div className="header-line"></div>
        </header>

        {/* ── AUTHENTICATION GATE ── */}
        {!session ? (
          <div style={{
            background: 'var(--card-bg)',
            border: '1px solid rgba(0, 245, 255, 0.4)',
            borderRadius: '8px',
            padding: '40px',
            textAlign: 'center',
            margin: '40px auto',
            maxWidth: '500px',
            boxShadow: '0 0 30px rgba(0, 245, 255, 0.15)',
            animation: 'fadeInUp 0.8s ease both'
          }}>
            <div style={{fontSize: '48px', marginBottom: '20px'}}>🛡️</div>
            <h2 className="section-title" style={{justifyContent: 'center', margin: '0 0 20px 0'}}>◈ RESTRICTED ACCESS ◈</h2>
            <p style={{color: 'rgba(255,255,255,0.6)', marginBottom: '30px', fontSize: '15px'}}>
              Admin clearance required to modify mission rosters and event parameters.
            </p>
            <button 
              onClick={login}
              style={{
                background: 'linear-gradient(90deg, rgba(0,245,255,0.1), rgba(0,245,255,0.2))',
                border: '1px solid var(--neon-cyan)',
                padding: '14px 28px',
                fontSize: '16px',
                color: 'var(--neon-cyan)',
                fontWeight: 'bold',
                letterSpacing: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                width: '100%'
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              AUTHENTICATE WITH GOOGLE
            </button>
          </div>
        ) : (
          <div style={{textAlign: 'center', marginBottom: '30px', animation: 'fadeIn 0.5s ease'}}>
            <span style={{color: 'var(--neon-green)', fontFamily: '"Share Tech Mono", monospace', fontSize: '13px', border: '1px solid rgba(57,255,20,0.3)', padding: '6px 16px', borderRadius: '4px', background: 'rgba(57,255,20,0.05)'}}>
              ✓ CLEARANCE GRANTED: {session.user.email}
            </span>
            <button onClick={logout} style={{marginLeft: '15px', padding: '6px 16px', fontSize: '11px', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)'}}>TERMINATE SESSION</button>
          </div>
        )}

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
