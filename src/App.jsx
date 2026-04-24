import { useEffect, useState, useRef } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

/* ──────────────────────────────────────
   ADMIN EMAIL WHITELIST
   ⚠️  ONLY EMAILS IN THIS LIST GET ADMIN ACCESS
   ⚠️  NEW ADMINS ADDED TO DB WON'T GET ACCESS
   ⚠️  EXPLICITLY ADD EMAIL HERE TO GRANT ADMIN RIGHTS
   ────────────────────────────────────── */
const ADMIN_EMAILS = [
  'aruneshownsty1@gmail.com',
  'harinisrim27@gmail.com',
];

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function isAdminEmail(email) {
  const e = normalizeEmail(email);
  return ADMIN_EMAILS.some(a => normalizeEmail(a) === e);
}

/* ── Theme presets for event cards ── */
const THEMES = [
  { themeClass: 'card-theme-0', nameColor: '#7eb8f7', categoryStyle: { background: 'rgba(66,133,244,0.15)', color: '#7eb8f7', border: '1px solid rgba(66,133,244,0.3)' }, deadlineClass: 'deadline-red' },
  { themeClass: 'card-theme-1', nameColor: 'var(--neon-green)', categoryStyle: { background: 'rgba(57,255,20,0.1)', color: 'var(--neon-green)', border: '1px solid rgba(57,255,20,0.3)' }, deadlineClass: 'deadline-green' },
  { themeClass: 'card-theme-2', nameColor: '#e690b0', categoryStyle: { background: 'rgba(198,59,116,0.15)', color: '#e690b0', border: '1px solid rgba(198,59,116,0.3)' }, deadlineClass: 'deadline-orange' },
  { themeClass: 'card-theme-3', nameColor: 'var(--neon-orange)', categoryStyle: { background: 'rgba(255,149,0,0.1)', color: 'var(--neon-orange)', border: '1px solid rgba(255,149,0,0.3)' }, deadlineClass: 'deadline-purple' },
];

/* ── Default Event Data ── */
const DEFAULT_EVENTS = [
  {
    id: 1, icon: '🌐', name: 'GOOGLE SOLUTION CHALLENGE',
    category: 'GLOBAL HACKATHON · SDG · GOOGLE TECH', deadline: '⚠ SUBMISSION: MAY 2025',
    deadlineClass: 'deadline-red', themeClass: 'card-theme-0', nameColor: '#7eb8f7',
    categoryStyle: { background: 'rgba(66,133,244,0.15)', color: '#7eb8f7', border: '1px solid rgba(66,133,244,0.3)' },
    teams: [
      { label: '▶ TEAM ALPHA', isCaptain: true, members: [
        { name: 'ARUNESHWARAN K', num: '01', isLead: true },
        { name: 'HARINISRI', num: '02' }, { name: 'SHARANESH', num: '03' },
      ]},
      { label: '▶ TEAM BRAVO', members: [
        { name: 'HEMAVARTHINI', num: '01', isLead: true },
        { name: 'GOKUL KANNAN', num: '02' }, { name: 'VETHAYOGESH', num: '03' }, { name: 'NIKHILESH', num: '04' },
      ]},
    ],
    meta: [
      { color: '#4285f4', text: 'USE GOOGLE TECHNOLOGIES' }, { color: '#34a853', text: 'ADDRESS UN SDGs' },
      { color: '#fbbc05', text: 'PRIZE: ₹8,00,000 POOL' }, { color: '#ea4335', text: 'GLOBAL COMPETITION' },
    ],
  },
  {
    id: 2, icon: '🛡️', name: 'CYBER NEXUS',
    category: 'CTF · CYBERSECURITY · CAPTURE THE FLAG', deadline: '● DEADLINE: TBD',
    deadlineClass: 'deadline-green', themeClass: 'card-theme-1', nameColor: 'var(--neon-green)',
    categoryStyle: { background: 'rgba(57,255,20,0.1)', color: 'var(--neon-green)', border: '1px solid rgba(57,255,20,0.3)' },
    teams: [
      { label: '▶ TEAM ALPHA', isCaptain: true, members: [
        { name: 'ARUNESHWARAN K', num: '01', isLead: true }, { name: 'HARISH', num: '02' },
      ]},
      { label: '▶ TEAM BRAVO', members: [
        { name: 'VARUNRAJ', num: '01', isLead: true }, { name: 'HARINISRI', num: '02' },
        { name: 'SHARANESH', num: '03' }, { name: 'HEMAVARTHINI', num: '04' },
      ]},
    ],
    meta: [
      { color: 'var(--neon-green)', text: 'WEB RECON · FORENSICS · PWNING' },
      { color: 'var(--neon-cyan)', text: 'JEOPARDY FORMAT' }, { color: '#7fffd4', text: 'ACTIVE CTF PREPARATION' },
    ],
  },
  {
    id: 3, icon: '⚙️', name: 'ODOO HACKATHON',
    category: 'ERP · BUSINESS TECH · FULL STACK', deadline: '📌 SUBMISSION: JUL 13, 2025',
    deadlineClass: 'deadline-orange', themeClass: 'card-theme-2', nameColor: '#e690b0',
    categoryStyle: { background: 'rgba(198,59,116,0.15)', color: '#e690b0', border: '1px solid rgba(198,59,116,0.3)' },
    teams: [
      { label: '▶ TEAM GAMMA — SINGLE SQUAD', isCaptain: true, members: [
        { name: 'ARUNESHWARAN K', num: '01', isLead: true }, { name: 'VARUNRAJ', num: '02' }, { name: 'HARINISRI', num: '03' },
      ]},
    ],
    meta: [
      { color: '#714b67', text: 'BUILD ON ODOO PLATFORM' }, { color: '#c63b74', text: 'VIRTUAL → ON-SITE AT GANDHINAGAR' },
      { color: 'var(--neon-pink)', text: 'JOB OFFER UP TO 8 LPA' }, { color: '#ffaad4', text: '8HR ONLINE + 24HR ON-SITE' },
    ],
  },
  {
    id: 4, icon: '🤖', name: 'EL AI HACKATHON',
    category: 'ARTIFICIAL INTELLIGENCE · ML · INNOVATION', deadline: '⟳ TEAM: NOT DECIDED',
    deadlineClass: 'deadline-purple blink', themeClass: 'card-theme-3', nameColor: 'var(--neon-orange)',
    categoryStyle: { background: 'rgba(255,149,0,0.1)', color: 'var(--neon-orange)', border: '1px solid rgba(255,149,0,0.3)' },
    teams: [], isTBD: true,
    meta: [
      { color: 'var(--neon-orange)', text: 'ARUNESHWARAN — CONFIRMED ENTRY' },
      { color: 'var(--neon-purple)', text: 'TEAM ASSEMBLY PENDING' },
    ],
  },
];

/* ── Helper: get badge text ── */
function getBadge(event) {
  if (event.isTBD) return '? MEMBERS · FORMING';
  let memberCount = 0;
  event.teams.forEach(t => memberCount += t.members.length);
  return `${memberCount} MEMBERS · ${event.teams.length} TEAM${event.teams.length > 1 ? 'S' : ''}`;
}

/* ── Helper: count all unique members ── */
function countAllMembers(events) {
  const names = new Set();
  events.forEach(e => e.teams.forEach(t => t.members.forEach(m => names.add(m.name))));
  return names.size;
}

/* ── Persist helpers (localStorage + Database) ── */
function loadEvents() {
  try {
    const saved = localStorage.getItem('event_data');
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return DEFAULT_EVENTS;
}
function saveEvents(events) {
  localStorage.setItem('event_data', JSON.stringify(events));
}

/* ── Database sync functions ── */
async function fetchEventsFromDB() {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    // Convert database format back to app format
    if (data && data.length > 0) {
      return data.map(evt => ({
        id: evt.id,
        icon: evt.icon || '🏆',
        name: evt.title,
        category: evt.category || '',
        deadline: evt.deadline || 'TBD',
        themeClass: evt.theme_class,
        nameColor: evt.name_color,
        categoryStyle: evt.category_style ? JSON.parse(evt.category_style) : {},
        deadlineClass: evt.deadline_class,
        teams: evt.teams_data ? JSON.parse(evt.teams_data) : [],
        isTBD: evt.is_tbd || false,
        meta: evt.meta_data ? JSON.parse(evt.meta_data) : [],
      }));
    }
  } catch (err) {
    console.error('Error fetching events from DB:', err);
  }
  return null;
}

async function syncEventToDB(event) {
  try {
    const { error } = await supabase
      .from('events')
      .upsert({
        id: String(event.id),
        title: event.name,
        category: event.category,
        deadline: event.deadline,
        icon: event.icon,
        theme_class: event.themeClass,
        name_color: event.nameColor,
        category_style: JSON.stringify(event.categoryStyle),
        deadline_class: event.deadlineClass,
        teams_data: JSON.stringify(event.teams),
        is_tbd: event.isTBD,
        meta_data: JSON.stringify(event.meta),
        created_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      });
    
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error syncing event to DB:', err);
    return false;
  }
}

/* ═══════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════ */

/* ── Login Page Component ── */
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailPasswordLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });
      
      if (signInError) {
        setError(signInError.message || 'Login failed');
      } else if (data?.user) {
        onLogin(data.user);
      }
    } catch (error) {
      const msg = error?.message || 'An error occurred';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    } catch {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1635 100%)',
      fontFamily: '"Orbitron", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background stars */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(2px 2px at 20% 30%, rgba(180,220,255,0.3), rgba(0,0,0,0))',
        backgroundSize: '200px 200px',
        zIndex: 0,
      }} />

      <div style={{
        maxWidth: '420px',
        width: '100%',
        margin: '0 16px',
        zIndex: 1,
      }}>
        {/* Card Container */}
        <div style={{
          background: 'rgba(10,14,39,0.95)',
          border: '2px solid rgba(0,245,255,0.4)',
          borderRadius: '8px',
          padding: '48px 32px',
          boxShadow: '0 0 40px rgba(0,245,255,0.1), inset 0 0 40px rgba(0,245,255,0.02)',
          backdropFilter: 'blur(10px)',
        }}>
          {/* Logo/Title */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              fontSize: '36px',
              marginBottom: '12px',
              animation: 'pulse 2s infinite',
            }}>
              ◆
            </div>
            <h1 style={{
              fontSize: '24px',
              color: 'var(--neon-cyan)',
              margin: '0 0 8px 0',
              letterSpacing: '2px',
              textShadow: '0 0 10px rgba(0,245,255,0.3)',
            }}>
              EVENT MANAGER
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'rgba(0,245,255,0.6)',
              letterSpacing: '1px',
              margin: 0,
            }}>
              Sign in to view events (admins can edit)
            </p>
          </div>

          {/* Welcome Message */}
          <div style={{
            textAlign: 'center',
            marginBottom: '32px',
            padding: '16px',
            background: 'rgba(0,245,255,0.05)',
            border: '1px solid rgba(0,245,255,0.2)',
            borderRadius: '4px',
          }}>
            <p style={{
              color: 'var(--neon-cyan)',
              fontSize: '14px',
              margin: 0,
              letterSpacing: '0.5px',
            }}>
              Hi, Welcome Back!
            </p>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12px',
              marginBottom: '6px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              onKeyDown={e => e.key === 'Enter' && handleEmailPasswordLogin()}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,245,255,0.05)',
                border: '1px solid rgba(0,245,255,0.3)',
                borderRadius: '4px',
                color: 'var(--neon-cyan)',
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--neon-cyan)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,245,255,0.3)'}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '12px',
              marginBottom: '6px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              onKeyDown={e => e.key === 'Enter' && handleEmailPasswordLogin()}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px 14px',
                background: 'rgba(0,245,255,0.05)',
                border: '1px solid rgba(0,245,255,0.3)',
                borderRadius: '4px',
                color: 'var(--neon-cyan)',
                fontSize: '13px',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'all 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--neon-cyan)'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,245,255,0.3)'}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '16px',
              padding: '10px 12px',
              background: 'rgba(255,107,107,0.1)',
              border: '1px solid rgba(255,107,107,0.4)',
              borderRadius: '4px',
              color: 'rgb(255,107,107)',
              fontSize: '12px',
              lineHeight: '1.4',
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            onClick={handleEmailPasswordLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'var(--neon-cyan)',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              fontSize: '14px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.3s',
              marginBottom: '16px',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => !loading && (e.target.style.boxShadow = '0 0 20px var(--neon-cyan)')}
            onMouseLeave={e => (e.target.style.boxShadow = 'none')}
          >
            {loading ? 'LOGGING IN...' : 'LOGIN'}
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: '12px',
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(0,245,255,0.2)',
            }} />
            <span style={{
              color: 'rgba(0,245,255,0.5)',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}>
              Or
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'rgba(0,245,255,0.2)',
            }} />
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '4px',
              color: 'rgba(255,255,255,0.8)',
              fontSize: '13px',
              fontWeight: '600',
              letterSpacing: '0.5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              opacity: loading ? 0.6 : 1,
            }}
            onMouseEnter={e => !loading && (e.target.style.background = 'rgba(255,255,255,0.1)')}
            onMouseLeave={e => (e.target.style.background = 'rgba(255,255,255,0.05)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" style={{marginTop: '2px'}}>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09a7.04 7.04 0 010-4.18V7.07H2.18A11.96 11.96 0 001 12c0 1.94.47 3.77 1.18 5.43l3.66-2.84.81-.5z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            SIGN IN WITH GOOGLE
          </button>

          {/* Admin Info */}
          <div style={{
            marginTop: '24px',
            padding: '12px',
            background: 'rgba(255,255,100,0.05)',
            border: '1px solid rgba(255,255,100,0.2)',
            borderRadius: '4px',
            fontSize: '11px',
            color: 'rgba(255,255,200,0.6)',
            lineHeight: '1.5',
            textAlign: 'center',
          }}>
            Edit access is restricted
            <br />
            Admin emails:
            <br />
            {ADMIN_EMAILS.map((email, idx) => (
              <div key={idx} style={{ color: 'rgba(0,245,255,0.6)', marginTop: '4px' }}>
                • {email}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

/* ── Non-Admin View (logged in but no edit rights) ── */
function NonAdminView({ session, events, totalMembers, totalTeams, onLogout }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [], animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const init = () => { stars = []; for (let i = 0; i < 180; i++) stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2, o: Math.random() * 0.5 + 0.1, speed: Math.random() * 0.15 + 0.03 }); };
    const draw = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,220,255,${s.o})`; ctx.fill(); s.y -= s.speed; if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; } }); animId = requestAnimationFrame(draw); };
    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <div className="scanline"></div>
      <div className="wrapper">
        <header className="header">
          <div className="corner-tl"></div>
          <div className="corner-tr"></div>
          <div className="header-badge">◆ EVENT MANAGEMENT SYSTEM ◆</div>
          <h1>UPCOMING EVENTS<br/>DASHBOARD</h1>
          <div className="header-sub">Event Management Portal &nbsp;|&nbsp; View Only</div>
          <div className="header-line"></div>
          <div className="corner-bl"></div>
          <div className="corner-br"></div>
        </header>

        <div className="auth-bar">
          <span className="auth-badge auth-badge-blue">
            ✓ {session.user.email}
            <span className="user-tag">USER</span>
          </span>
          <button className="btn-small btn-pink" onClick={onLogout}>LOGOUT</button>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">{String(events.length).padStart(2, '0')}</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{totalMembers}</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{String(totalTeams).padStart(2, '0')}</span>
            <span className="stat-label">Teams Formed</span>
          </div>
        </div>

        <div className="section-title">◈ &nbsp;EVENT DOSSIERS</div>

        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={false}
            onAddMember={() => {}}
            onRemoveMember={() => {}}
            onEditEvent={() => {}}
            onDeleteEvent={() => {}}
            onAddTeam={() => {}}
          />
        ))}

        <div className="footer">
          <div>◈ EVENT MANAGEMENT SYSTEM ◈</div>
          <div style={{ marginTop: '6px' }}>Manage competitions, teams, and events efficiently &nbsp;|&nbsp; Last Updated: APRIL 24, 2025</div>
        </div>
      </div>
    </>
  );
}

// Public (non-auth) view removed: app requires login to view content.

/* ── Modal Overlay ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span>{title}</span>
          <button className="btn-small btn-pink" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ── Event Card ── */
function EventCard({ event, isAdmin, onAddMember, onRemoveMember, onEditEvent, onDeleteEvent, onAddTeam }) {
  return (
    <div className={`event-card ${event.themeClass}`}>
      <div className="card-header">
        <div className="event-title-block">
          <div className="event-icon">{event.icon}</div>
          <div>
            <div className="event-name" style={{ color: event.nameColor }}>{event.name}</div>
            <div className="event-category" style={event.categoryStyle}>{event.category}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className={`deadline-chip ${event.deadlineClass}`}>{event.deadline}</div>
          {isAdmin && (
            <>
              <button className="btn-small btn-cyan" onClick={() => onEditEvent(event)}>✎ EDIT</button>
              <button className="btn-small btn-pink" onClick={() => onDeleteEvent(event.id)}>✕</button>
            </>
          )}
        </div>
      </div>
      <div className="card-body">
        {event.isTBD ? (
          <div className="tbd-block">
            <div style={{ fontSize: '36px', marginBottom: '14px', animation: 'float 3s ease infinite' }}>🔮</div>
            <div className="tbd-text">[ TEAM FORMATION IN PROGRESS ]</div>
            <div className="tbd-sub">Members yet to be selected — Stay tuned for roster update</div>
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="tag-chip tag-purple">AI / ML DOMAIN</span>
              <span className="tag-chip tag-orange">HACKATHON FORMAT</span>
              <span className="tag-chip tag-cyan">DEADLINE: TBD</span>
            </div>
            {isAdmin && (
              <button className="btn-small btn-cyan" style={{ marginTop: '16px' }} onClick={() => onAddTeam(event.id)}>+ ADD TEAM</button>
            )}
          </div>
        ) : (
          <>
            <div className={`teams-grid ${event.teams.length > 1 ? 'two-col' : 'one-col'}`}>
              {event.teams.map((team, ti) => (
                <div className="team-block" key={ti}>
                  <div className={`team-label ${team.isCaptain ? 'captain-tag' : ''}`}>{team.label}</div>
                  {team.members.map((m, mi) => (
                    <div className="member-row" key={mi}>
                      <span className="member-num">{m.num}</span>
                      {m.name}
                      {m.isLead && <span className="captain-star">★ LEAD</span>}
                      {isAdmin && (
                        <button
                          className="btn-remove"
                          title="Remove member"
                          onClick={() => onRemoveMember(event.id, ti, mi)}
                        >✕</button>
                      )}
                    </div>
                  ))}
                  {isAdmin && (
                    <button className="btn-add-member" onClick={() => onAddMember(event.id, ti)}>+ Add Member</button>
                  )}
                </div>
              ))}
            </div>
            {isAdmin && (
              <button className="btn-small btn-cyan" style={{ marginTop: '12px' }} onClick={() => onAddTeam(event.id)}>+ ADD TEAM</button>
            )}
          </>
        )}

        <div className="event-meta">
          {event.meta.map((m, i) => (
            <div className="meta-item" key={i}>
              <div className="meta-dot" style={{ background: m.color }}></div>
              {m.text}
            </div>
          ))}
          <span className="number-badge">{getBadge(event)}</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════ */
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState(loadEvents);

  // Scraper
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapeResult, setScrapeResult] = useState(null);
  const [scraping, setScraping] = useState(false);

  // Modals
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [addMemberTarget, setAddMemberTarget] = useState(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberIsLead, setNewMemberIsLead] = useState(false);

  // Add Event form
  const [newEvent, setNewEvent] = useState({ icon: '🏆', name: '', category: '', deadline: '' });

  // Visitor tracking
  const [visitors, setVisitors] = useState([]);
  const [showVisitors, setShowVisitors] = useState(false);

  const canvasRef = useRef(null);
  const isAdmin = Boolean(session?.user?.email && isAdminEmail(session.user.email));

  /* ── Persist events on change (localStorage + Database) ── */
  useEffect(() => { 
    saveEvents(events);
    if (!isAdmin) return;
    // Sync each event to database (admins only)
    events.forEach(event => { syncEventToDB(event); });
  }, [events, isAdmin]);

  /* ── Fetch events from database on load ── */
  useEffect(() => {
    const loadFromDB = async () => {
      const dbEvents = await fetchEventsFromDB();
      if (dbEvents && dbEvents.length > 0) {
        setEvents(dbEvents);
      }
    };
    // Any authenticated user can view current DB events
    if (session?.user?.id) {
      loadFromDB();
    }
  }, [session?.user?.id]);

  /* ── Auth ── */
  useEffect(() => {
    let cancelled = false;

    const initAuth = async () => {
      try {
        // Supabase OAuth (PKCE) returns ?code=... and needs an exchange step.
        const url = new URL(window.location.href);
        const hasCode = url.searchParams.get('code');
        if (hasCode) {
          await supabase.auth.exchangeCodeForSession(window.location.href);
          window.history.replaceState(null, '', window.location.origin + window.location.pathname);
        }

        const { data: { session: s } } = await supabase.auth.getSession();
        if (!cancelled) setSession(s);
      } finally {
        if (!cancelled) setLoading(false);

        // Back-compat cleanup (older implicit flow hash tokens)
        if (window.location.hash && window.location.hash.includes('access_token')) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  /* ── Log visitor on page load ── */
  useEffect(() => {
    const logVisit = async () => {
      try {
        await supabase.from('visitors').insert({
          email: session?.user?.email || 'anonymous',
          user_agent: navigator.userAgent,
          page_url: window.location.href,
        });
      } catch { /* silently fail */ }
    };
    logVisit();
  }, [session]);

  /* ── Fetch visitors for admin ── */
  useEffect(() => {
    if (!isAdmin) return;
    const fetchVisitors = async () => {
      const { data } = await supabase
        .from('visitors')
        .select('*')
        .order('visited_at', { ascending: false })
        .limit(50);
      if (data) setVisitors(data);
    };
    fetchVisitors();
  }, [isAdmin]);

  /* ── Starfield ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [], animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const init = () => { stars = []; for (let i = 0; i < 180; i++) stars.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.2, o: Math.random() * 0.5 + 0.1, speed: Math.random() * 0.15 + 0.03 }); };
    const draw = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(180,220,255,${s.o})`; ctx.fill(); s.y -= s.speed; if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; } }); animId = requestAnimationFrame(draw); };
    resize(); init(); draw();
    const onResize = () => { resize(); init(); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize); };
  }, []);

  /* ── Auth actions ── */
  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    // Force reload to clear all state and go back to login view
    window.location.reload();
  };

  /* ── Event CRUD ── */
  const handleAddEvent = () => {
    if (!isAdmin) return;
    if (!newEvent.name.trim()) return;
    const themeIdx = events.length % THEMES.length;
    const theme = THEMES[themeIdx];
    const evt = {
      id: Date.now(),
      icon: newEvent.icon || '🏆',
      name: newEvent.name.toUpperCase(),
      category: newEvent.category.toUpperCase(),
      deadline: newEvent.deadline || 'TBD',
      ...theme,
      teams: [],
      isTBD: true,
      meta: [],
    };
    setEvents(prev => [...prev, evt]);
    setNewEvent({ icon: '🏆', name: '', category: '', deadline: '' });
    setShowAddEvent(false);
  };

  const handleDeleteEvent = (id) => {
    if (!isAdmin) return;
    if (confirm('Delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleEditEvent = (event) => {
    if (!isAdmin) return;
    setEditingEvent({ ...event });
  };

  const handleSaveEdit = () => {
    if (!isAdmin) return;
    setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...editingEvent, name: editingEvent.name.toUpperCase(), category: editingEvent.category.toUpperCase() } : e));
    setEditingEvent(null);
  };

  /* ── Team CRUD ── */
  const handleAddTeam = (eventId) => {
    if (!isAdmin) return;
    const teamName = prompt('Enter team name (e.g. TEAM DELTA):');
    if (!teamName) return;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const updated = { ...e, teams: [...e.teams, { label: `▶ ${teamName.toUpperCase()}`, members: [] }] };
      if (updated.isTBD && updated.teams.length > 0) updated.isTBD = false;
      return updated;
    }));
  };

  /* ── Member CRUD ── */
  const handleAddMember = (eventId, teamIdx) => {
    if (!isAdmin) return;
    setAddMemberTarget({ eventId, teamIdx });
    setNewMemberName('');
    setNewMemberIsLead(false);
  };

  const confirmAddMember = () => {
    if (!isAdmin) return;
    if (!newMemberName.trim() || !addMemberTarget) return;
    const { eventId, teamIdx } = addMemberTarget;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const teams = e.teams.map((t, ti) => {
        if (ti !== teamIdx) return t;
        const newNum = String(t.members.length + 1).padStart(2, '0');
        return { ...t, members: [...t.members, { name: newMemberName.toUpperCase(), num: newNum, isLead: newMemberIsLead }] };
      });
      return { ...e, teams };
    }));
    setAddMemberTarget(null);
    setNewMemberName('');
  };

  const handleRemoveMember = (eventId, teamIdx, memberIdx) => {
    if (!isAdmin) return;
    setEvents(prev => prev.map(e => {
      if (e.id !== eventId) return e;
      const teams = e.teams.map((t, ti) => {
        if (ti !== teamIdx) return t;
        const members = t.members.filter((_, mi) => mi !== memberIdx).map((m, i) => ({ ...m, num: String(i + 1).padStart(2, '0') }));
        return { ...t, members };
      });
      return { ...e, teams };
    }));
  };

  /* ── Scraper ── */
  const handleScrape = async () => {
    if (!isAdmin) return;
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    setScrapeResult(null);
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: scrapeUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scraping failed');
      setScrapeResult(data);
    } catch (err) {
      setScrapeResult({ error: err.message || 'Scraping failed' });
    }
    setScraping(false);
  };

  const handleImportScraped = () => {
    if (!isAdmin) return;
    if (!scrapeResult || scrapeResult.error) return;
    const themeIdx = events.length % THEMES.length;
    const theme = THEMES[themeIdx];
    const evt = {
      id: Date.now(),
      icon: '📋',
      name: (scrapeResult.title || 'IMPORTED EVENT').toUpperCase(),
      category: (scrapeResult.category || 'COMPETITION').toUpperCase(),
      deadline: scrapeResult.deadline || 'TBD',
      ...theme,
      teams: [],
      isTBD: true,
      meta: scrapeResult.description ? [{ color: 'var(--neon-cyan)', text: scrapeResult.description.substring(0, 80) }] : [],
    };
    setEvents(prev => [...prev, evt]);
    setScrapeResult(null);
    setScrapeUrl('');
  };

  /* ── Stats ── */
  const totalMembers = countAllMembers(events);
  const totalTeams = events.reduce((sum, e) => sum + e.teams.length, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--neon-cyan)', fontFamily: '"Orbitron", sans-serif', fontSize: '14px', letterSpacing: '4px' }}>
        INITIALIZING SYSTEM...
      </div>
    );
  }

  // Show login page if not authenticated
  if (!session) {
    return <LoginPage onLogin={() => {}} />;
  }

  // Non-admin users see events but without edit controls
  if (!isAdmin) {
    return (
      <NonAdminView session={session} events={events} totalMembers={totalMembers} totalTeams={totalTeams} onLogout={logout} />
    );
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <div className="scanline"></div>

      <div className="wrapper">

        {/* ── HEADER ── */}
        <header className="header">
          <div className="corner-tl"></div>
          <div className="corner-tr"></div>
          <div className="header-badge">◆ EVENT MANAGEMENT SYSTEM ◆</div>
          <h1>UPCOMING EVENTS<br/>DASHBOARD</h1>
          <div className="header-sub">
            Event Management Portal &nbsp;|&nbsp; Admin Dashboard
          </div>
          <div className="header-line"></div>
          <div className="corner-bl"></div>
          <div className="corner-br"></div>
        </header>

        {/* ── AUTH BAR ── */}
        <div className="auth-bar">
          <span className="auth-badge auth-badge-green">
            ✓ {session.user.email}
            <span className="admin-tag">ADMIN</span>
          </span>
          <button className="btn-small btn-pink" onClick={logout}>LOGOUT</button>
        </div>

        {/* ── STATS BAR ── */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">{String(events.length).padStart(2, '0')}</span>
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{totalMembers}</span>
            <span className="stat-label">Team Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-num">{String(totalTeams).padStart(2, '0')}</span>
            <span className="stat-label">Teams Formed</span>
          </div>
          <div className="stat-item">
            <span className="stat-num" style={{ color: 'var(--neon-pink)' }}>
              {String(events.filter(e => e.isTBD).length).padStart(2, '0')}
            </span>
            <span className="stat-label">TBD Teams</span>
          </div>
        </div>

        {/* ── EVENT CARDS ── */}
        <div className="section-title">
          ◈ &nbsp;EVENT DOSSIERS
          {isAdmin && (
            <button className="btn-small btn-cyan" style={{ marginLeft: 'auto' }} onClick={() => setShowAddEvent(true)}>+ ADD EVENT</button>
          )}
        </div>

        {events.map(event => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={isAdmin}
            onAddMember={handleAddMember}
            onRemoveMember={handleRemoveMember}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onAddTeam={handleAddTeam}
          />
        ))}

        {/* ── ADMIN: UNSTOP SCRAPER ── */}
        {isAdmin && (
          <div className="admin-panel">
            <div className="section-title" style={{ marginTop: 0 }}>◈ &nbsp;ADMIN: UNSTOP SCRAPER</div>
            <p className="admin-hint">Paste an Unstop competition URL below to automatically extract event details.</p>
            <div className="scraper-input-row">
              <input
                type="text"
                placeholder="https://unstop.com/hackathons/..."
                value={scrapeUrl}
                onChange={e => setScrapeUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleScrape()}
              />
              <button onClick={handleScrape} disabled={scraping}>
                {scraping ? 'SCANNING...' : 'SCAN & IMPORT'}
              </button>
            </div>
            {scrapeResult && (
              <div className="scrape-result">
                {scrapeResult.error ? (
                  <p style={{ color: 'var(--neon-pink)' }}>⚠ {scrapeResult.error}</p>
                ) : (
                  <div>
                    <p style={{ color: 'var(--neon-green)', marginBottom: '8px' }}>✓ Event Found</p>
                    <p><strong>Title:</strong> {scrapeResult.title}</p>
                    {scrapeResult.description && <p><strong>Description:</strong> {scrapeResult.description.substring(0, 200)}...</p>}
                    {scrapeResult.deadline && <p><strong>Deadline:</strong> {scrapeResult.deadline}</p>}
                    <button className="btn-small btn-cyan" style={{ marginTop: '12px' }} onClick={handleImportScraped}>
                      ✓ IMPORT AS NEW EVENT
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── ADMIN: VISITOR LOG ── */}
        {isAdmin && (
          <div className="admin-panel" style={{ marginTop: '24px', borderColor: 'rgba(0,245,255,0.3)', background: 'rgba(0,245,255,0.02)' }}>
            <div className="section-title" style={{ marginTop: 0, cursor: 'pointer' }} onClick={() => setShowVisitors(!showVisitors)}>
              ◈ &nbsp;VISITOR LOG ({visitors.length})
              <span style={{ marginLeft: 'auto', fontSize: '16px' }}>{showVisitors ? '▾' : '▸'}</span>
            </div>
            {showVisitors && (
              <div style={{ overflowX: 'auto' }}>
                <table className="visitor-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>EMAIL</th>
                      <th>TIME (IST)</th>
                      <th>BROWSER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.map((v, i) => {
                      const ist = new Date(v.visited_at).toLocaleString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        day: '2-digit', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
                      });
                      // Parse short browser name from user agent
                      const ua = v.user_agent || '';
                      let browser = 'Unknown';
                      if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
                      else if (ua.includes('Firefox')) browser = 'Firefox';
                      else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
                      else if (ua.includes('Edg')) browser = 'Edge';

                      return (
                        <tr key={v.id || i}>
                          <td>{i + 1}</td>
                          <td style={{ color: v.email === 'anonymous' ? 'rgba(255,255,255,0.3)' : 'var(--neon-cyan)' }}>
                            {v.email}
                          </td>
                          <td>{ist}</td>
                          <td>{browser}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {visitors.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '16px', fontFamily: '"Share Tech Mono", monospace', fontSize: '12px' }}>
                    No visitors logged yet. Run the schema.sql in Supabase first.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="footer">
          <div>◈ EVENT MANAGEMENT SYSTEM ◈</div>
          <div style={{ marginTop: '6px' }}>Manage competitions, teams, and events efficiently &nbsp;|&nbsp; Last Updated: APRIL 24, 2025</div>
        </div>
      </div>

      {/* ═══ MODALS ═══ */}

      {/* Add Event Modal */}
      {showAddEvent && (
        <Modal title="◈ ADD NEW EVENT" onClose={() => setShowAddEvent(false)}>
          <div className="modal-form">
            <label>Icon (emoji)</label>
            <input value={newEvent.icon} onChange={e => setNewEvent(p => ({ ...p, icon: e.target.value }))} placeholder="🏆" />
            <label>Event Name</label>
            <input value={newEvent.name} onChange={e => setNewEvent(p => ({ ...p, name: e.target.value }))} placeholder="HACKATHON NAME" />
            <label>Category</label>
            <input value={newEvent.category} onChange={e => setNewEvent(p => ({ ...p, category: e.target.value }))} placeholder="AI · ML · INNOVATION" />
            <label>Deadline</label>
            <input value={newEvent.deadline} onChange={e => setNewEvent(p => ({ ...p, deadline: e.target.value }))} placeholder="MAY 2025" />
            <button className="btn-full btn-cyan" onClick={handleAddEvent}>CREATE EVENT</button>
          </div>
        </Modal>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <Modal title="◈ EDIT EVENT" onClose={() => setEditingEvent(null)}>
          <div className="modal-form">
            <label>Icon (emoji)</label>
            <input value={editingEvent.icon} onChange={e => setEditingEvent(p => ({ ...p, icon: e.target.value }))} />
            <label>Event Name</label>
            <input value={editingEvent.name} onChange={e => setEditingEvent(p => ({ ...p, name: e.target.value }))} />
            <label>Category</label>
            <input value={editingEvent.category} onChange={e => setEditingEvent(p => ({ ...p, category: e.target.value }))} />
            <label>Deadline</label>
            <input value={editingEvent.deadline} onChange={e => setEditingEvent(p => ({ ...p, deadline: e.target.value }))} />
            <button className="btn-full btn-cyan" onClick={handleSaveEdit}>SAVE CHANGES</button>
          </div>
        </Modal>
      )}

      {/* Add Member Modal */}
      {addMemberTarget && (
        <Modal title="◈ ADD MEMBER" onClose={() => setAddMemberTarget(null)}>
          <div className="modal-form">
            <label>Member Name</label>
            <input
              value={newMemberName}
              onChange={e => setNewMemberName(e.target.value)}
              placeholder="MEMBER NAME"
              onKeyDown={e => e.key === 'Enter' && confirmAddMember()}
              autoFocus
            />
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input type="checkbox" checked={newMemberIsLead} onChange={e => setNewMemberIsLead(e.target.checked)} />
              Team Lead
            </label>
            <button className="btn-full btn-cyan" onClick={confirmAddMember}>ADD MEMBER</button>
          </div>
        </Modal>
      )}
    </>
  );
}

export default App;
