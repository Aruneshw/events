import { useEffect, useState, useRef } from 'react';
import './App.css';
import { supabase } from './supabaseClient';

/* ── Admin email whitelist ── */
const ADMIN_EMAILS = [
  'aruneshownsty1@gmail.com',
  'harinisrim27@gmail.com',
];

/* ── Hardcoded Event Data (from original index.html) ── */
const EVENTS = [
  {
    id: 1,
    icon: '🌐',
    name: 'GOOGLE SOLUTION CHALLENGE',
    category: 'GLOBAL HACKATHON · SDG · GOOGLE TECH',
    deadline: '⚠ SUBMISSION: MAY 2025',
    deadlineClass: 'deadline-red',
    themeClass: 'card-theme-0',
    nameColor: '#7eb8f7',
    categoryStyle: { background: 'rgba(66,133,244,0.15)', color: '#7eb8f7', border: '1px solid rgba(66,133,244,0.3)' },
    teams: [
      {
        label: '▶ TEAM ALPHA', isCaptain: true,
        members: [
          { name: 'ARUNESHWARAN K', num: '01', isLead: true },
          { name: 'HARINISRI', num: '02' },
          { name: 'SHARANESH', num: '03' },
        ]
      },
      {
        label: '▶ TEAM BRAVO',
        members: [
          { name: 'HEMAVARTHINI', num: '01', isLead: true },
          { name: 'GOKUL KANNAN', num: '02' },
          { name: 'VETHAYOGESH', num: '03' },
          { name: 'NIKHILESH', num: '04' },
        ]
      },
    ],
    meta: [
      { color: '#4285f4', text: 'USE GOOGLE TECHNOLOGIES' },
      { color: '#34a853', text: 'ADDRESS UN SDGs' },
      { color: '#fbbc05', text: 'PRIZE: ₹8,00,000 POOL' },
      { color: '#ea4335', text: 'GLOBAL COMPETITION' },
    ],
    badge: '7 MEMBERS · 2 TEAMS',
  },
  {
    id: 2,
    icon: '🛡️',
    name: 'CYBER NEXUS',
    category: 'CTF · CYBERSECURITY · CAPTURE THE FLAG',
    deadline: '● DEADLINE: TBD',
    deadlineClass: 'deadline-green',
    themeClass: 'card-theme-1',
    nameColor: 'var(--neon-green)',
    categoryStyle: { background: 'rgba(57,255,20,0.1)', color: 'var(--neon-green)', border: '1px solid rgba(57,255,20,0.3)' },
    teams: [
      {
        label: '▶ TEAM ALPHA', isCaptain: true,
        members: [
          { name: 'ARUNESHWARAN K', num: '01', isLead: true },
          { name: 'HARISH', num: '02' },
        ]
      },
      {
        label: '▶ TEAM BRAVO',
        members: [
          { name: 'VARUNRAJ', num: '01', isLead: true },
          { name: 'HARINISRI', num: '02' },
          { name: 'SHARANESH', num: '03' },
          { name: 'HEMAVARTHINI', num: '04' },
        ]
      },
    ],
    meta: [
      { color: 'var(--neon-green)', text: 'WEB RECON · FORENSICS · PWNING' },
      { color: 'var(--neon-cyan)', text: 'JEOPARDY FORMAT' },
      { color: '#7fffd4', text: 'ACTIVE CTF PREPARATION' },
    ],
    badge: '6 MEMBERS · 2 TEAMS',
  },
  {
    id: 3,
    icon: '⚙️',
    name: 'ODOO HACKATHON',
    category: 'ERP · BUSINESS TECH · FULL STACK',
    deadline: '📌 SUBMISSION: JUL 13, 2025',
    deadlineClass: 'deadline-orange',
    themeClass: 'card-theme-2',
    nameColor: '#e690b0',
    categoryStyle: { background: 'rgba(198,59,116,0.15)', color: '#e690b0', border: '1px solid rgba(198,59,116,0.3)' },
    teams: [
      {
        label: '▶ TEAM GAMMA — SINGLE SQUAD', isCaptain: true,
        members: [
          { name: 'ARUNESHWARAN K', num: '01', isLead: true },
          { name: 'VARUNRAJ', num: '02' },
          { name: 'HARINISRI', num: '03' },
        ]
      },
    ],
    meta: [
      { color: '#714b67', text: 'BUILD ON ODOO PLATFORM' },
      { color: '#c63b74', text: 'VIRTUAL → ON-SITE AT GANDHINAGAR' },
      { color: 'var(--neon-pink)', text: 'JOB OFFER UP TO 8 LPA' },
      { color: '#ffaad4', text: '8HR ONLINE + 24HR ON-SITE' },
    ],
    badge: '3 MEMBERS · 1 TEAM',
  },
  {
    id: 4,
    icon: '🤖',
    name: 'EL AI HACKATHON',
    category: 'ARTIFICIAL INTELLIGENCE · ML · INNOVATION',
    deadline: '⟳ TEAM: NOT DECIDED',
    deadlineClass: 'deadline-purple blink',
    themeClass: 'card-theme-3',
    nameColor: 'var(--neon-orange)',
    categoryStyle: { background: 'rgba(255,149,0,0.1)', color: 'var(--neon-orange)', border: '1px solid rgba(255,149,0,0.3)' },
    teams: [],
    isTBD: true,
    meta: [
      { color: 'var(--neon-orange)', text: 'ARUNESHWARAN — CONFIRMED ENTRY' },
      { color: 'var(--neon-purple)', text: 'TEAM ASSEMBLY PENDING' },
    ],
    badge: '? MEMBERS · FORMING',
  },
];

/* ── Components ── */

function LiveClock() {
  const [time, setTime] = useState('--:--:--');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}.${String(Math.floor(now.getMilliseconds()/10)).padStart(2,'0')}`
      );
    };
    const id = setInterval(tick, 50);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="live-ticker">
      <div className="ticker-label">◈ SYSTEM TIME — MISSION CLOCK ◈</div>
      <div className="ticker-time">{time}</div>
    </div>
  );
}

function EventCard({ event, isAdmin }) {
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
        <div className={`deadline-chip ${event.deadlineClass}`}>{event.deadline}</div>
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
          </div>
        ) : (
          <div className={`teams-grid ${event.teams.length > 1 ? 'two-col' : 'one-col'}`}>
            {event.teams.map((team, ti) => (
              <div className="team-block" key={ti}>
                <div className={`team-label ${team.isCaptain ? 'captain-tag' : ''}`}>{team.label}</div>
                {team.members.map((m, mi) => (
                  <div className="member-row" key={mi}>
                    <span className="member-num">{m.num}</span>
                    {m.name}
                    {m.isLead && <span className="captain-star">★ LEAD</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="event-meta">
          {event.meta.map((m, i) => (
            <div className="meta-item" key={i}>
              <div className="meta-dot" style={{ background: m.color }}></div>
              {m.text}
            </div>
          ))}
          <span className="number-badge">{event.badge}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Main App ── */
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapeResult, setScrapeResult] = useState(null);
  const [scraping, setScraping] = useState(false);
  const canvasRef = useRef(null);

  const isAdmin = session && ADMIN_EMAILS.includes(session.user.email);

  /* ── Auth: handle hash token on page load + listen for changes ── */
  useEffect(() => {
    // This picks up the #access_token=... from the URL after Google redirect
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setLoading(false);
      // Clean the URL hash so it doesn't keep re-triggering
      if (window.location.hash && window.location.hash.includes('access_token')) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  /* ── Starfield Canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animId;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    const init = () => {
      stars = [];
      for (let i = 0; i < 180; i++) {
        stars.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          r: Math.random() * 1.2, o: Math.random() * 0.5 + 0.1, speed: Math.random() * 0.15 + 0.03,
        });
      }
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180,220,255,${s.o})`; ctx.fill();
        s.y -= s.speed;
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width; }
      });
      animId = requestAnimationFrame(draw);
    };

    resize(); init(); draw();
    window.addEventListener('resize', () => { resize(); init(); });
    return () => cancelAnimationFrame(animId);
  }, []);

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setScraping(true);
    setScrapeResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('unstop-scraper', {
        body: { url: scrapeUrl },
      });
      if (error) throw error;
      setScrapeResult(data);
    } catch (err) {
      setScrapeResult({ error: err.message || 'Scraping failed' });
    }
    setScraping(false);
  };

  const totalMembers = 14;
  const totalTeams = 5;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--neon-cyan)', fontFamily: '"Orbitron", sans-serif', fontSize: '14px', letterSpacing: '4px' }}>
        INITIALIZING SYSTEM...
      </div>
    );
  }

  return (
    <>
      {/* Background */}
      <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }} />
      <div className="scanline"></div>

      <div className="wrapper">

        {/* ── HEADER ── */}
        <header className="header">
          <div className="corner-tl"></div>
          <div className="corner-tr"></div>
          <div className="header-badge">◆ CLASSIFIED: COMPETITION INTEL ◆</div>
          <h1>UPCOMING EVENT<br/>BATTLE REPORT</h1>
          <div className="header-sub">
            ARUNESHWARAN K &nbsp;|&nbsp; B.TECH AIML · 1ST YEAR &nbsp;|&nbsp; APRIL 2025
          </div>
          <div className="header-line"></div>
          <div className="corner-bl"></div>
          <div className="corner-br"></div>
        </header>

        {/* ── AUTH BAR (small, top-right style) ── */}
        <div className="auth-bar">
          {session ? (
            <>
              <span className="auth-badge auth-badge-green">
                ✓ {session.user.email}
                {isAdmin && <span className="admin-tag">ADMIN</span>}
              </span>
              <button className="btn-small btn-pink" onClick={logout}>LOGOUT</button>
            </>
          ) : (
            <button className="btn-small btn-cyan" onClick={login}>
              <svg width="16" height="16" viewBox="0 0 24 24" style={{verticalAlign: 'middle', marginRight: '6px'}}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 01-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09a7.04 7.04 0 010-4.18V7.07H2.18A11.96 11.96 0 001 12c0 1.94.47 3.77 1.18 5.43l3.66-2.84.81-.5z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              ADMIN LOGIN
            </button>
          )}
        </div>

        {/* ── STATS BAR ── */}
        <div className="stats-bar">
          <div className="stat-item">
            <span className="stat-num">{String(EVENTS.length).padStart(2, '0')}</span>
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
            <span className="stat-num" style={{ color: 'var(--neon-pink)' }}>01</span>
            <span className="stat-label">TBD Team</span>
          </div>
        </div>

        <LiveClock />

        {/* ── EVENT CARDS (visible to EVERYONE) ── */}
        <div className="section-title">◈ &nbsp;EVENT DOSSIERS</div>
        {EVENTS.map((event, i) => (
          <EventCard key={event.id} event={event} isAdmin={isAdmin} />
        ))}

        {/* ── ADMIN ONLY: UNSTOP SCRAPER ── */}
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
                    <p style={{ color: 'var(--neon-green)' }}>✓ Event Found</p>
                    <p><strong>Title:</strong> {scrapeResult.title}</p>
                    {scrapeResult.description && <p><strong>Description:</strong> {scrapeResult.description.substring(0, 200)}...</p>}
                    {scrapeResult.deadline && <p><strong>Deadline:</strong> {scrapeResult.deadline}</p>}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="footer">
          <div>◈ CLASSIFIED INTEL — GENERATED FOR ARUNESHWARAN K ◈</div>
          <div style={{ marginTop: '6px' }}>B.TECH AIML · 1ST YEAR · BITS SATHY &nbsp;|&nbsp; REPORT DATE: APRIL 24, 2025</div>
        </div>
      </div>
    </>
  );
}

export default App;
