import React, { useState, useEffect } from 'react';
import { formatTime, calculateAoN, getSessionAvg, getBest } from './utils/stats';

function SolveItem({ solve, index, onPenalty, onDelete, isPB }) {
  const displayTime = formatTime(solve.timeMs + (solve.penalty === 2 ? 2000 : 0));
  const isDNF = solve.penalty === -1;
  const isPlus2 = solve.penalty === 2;

  const btnStyle = (active, color) => ({
    background: 'none', border: 'none',
    color: active ? color : 'rgba(255,255,255,0.25)',
    cursor: 'pointer', fontSize: '0.72rem', fontWeight: active ? '700' : '500',
    padding: '0 3px', transition: 'all 0.2s',
    minWidth: '32px', minHeight: '32px',
  });

  return (
    <div className="ghost-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', width: '24px', textAlign: 'right', fontFamily: 'monospace' }}>{index}.</span>
        <span style={{
          color: isPB && !isDNF ? '#00ff88' : isDNF ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.85)',
          fontWeight: isPB && !isDNF ? '700' : '400',
          fontFamily: 'monospace', fontSize: '0.95rem',
          textDecoration: isDNF ? 'line-through' : 'none'
        }}>
          {displayTime}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
        <button onClick={(e) => { e.currentTarget.blur(); onPenalty(2); }} style={btnStyle(isPlus2, '#f59e0b')}>+2</button>
        <button onClick={(e) => { e.currentTarget.blur(); onPenalty(-1); }} style={btnStyle(isDNF, '#ef4444')}>DNF</button>
        <button onClick={(e) => { e.currentTarget.blur(); onDelete(); }} style={{ ...btnStyle(false, 'white'), fontSize: '0.85rem' }}>✕</button>
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>,
    label: 'Learn CFOP', sub: 'Master the Fridrich method'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" /><path d="M2 13h6M5 10l3 3-3 3" /></svg>,
    label: 'Latest News', sub: 'WCA results & community updates'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    label: 'Blogs', sub: 'Tips, guides & speedsolving'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    label: 'About Us', sub: 'The team behind Vantage',
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    label: 'Star on GitHub', sub: 'Support the open-source project', href: 'https://github.com'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>,
    label: 'Contribute', sub: 'Help build CubeIt', href: 'https://github.com'
  },
  {
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>,
    label: 'Settings', sub: 'Customize your experience'
  }
];

// History panel content (shared between desktop sidebar and mobile drawer)
function HistoryPanel({ data, onSessionChange, onAddSession, onClearSession, onPenalty, onDeleteSolve, solves, best }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Session selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
        <select
          value={data.activeSessionId}
          onChange={(e) => { e.currentTarget.blur(); onSessionChange(e.target.value); }}
          style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: 'white', border: '0.5px solid rgba(255,255,255,0.15)', padding: '9px 12px', borderRadius: '10px', cursor: 'pointer', outline: 'none', fontWeight: '500', fontSize: '0.85rem', appearance: 'none' }}
        >
          {data.sessions.map(s => <option key={s.id} value={s.id} style={{ background: '#0e0a1a' }}>{s.name} ({s.solves.length})</option>)}
        </select>
        <button
          onClick={(e) => { e.currentTarget.blur(); onAddSession(); }}
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '0.5px solid rgba(255,255,255,0.15)', padding: '9px 14px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', transition: 'background 0.2s', whiteSpace: 'nowrap' }}
        >+ New</button>
      </div>

      {/* History header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, fontSize: '0.7rem', fontWeight: '700', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>History</h3>
        <button
          onClick={(e) => { e.currentTarget.blur(); onClearSession(); }}
          style={{ background: 'transparent', color: 'rgba(255,255,255,0.35)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '6px', padding: '3px 9px', fontSize: '0.7rem', cursor: 'pointer', fontWeight: '600', transition: 'all 0.2s' }}
        >Clear</button>
      </div>

      {/* Solve list */}
      <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flex: 1, paddingRight: '4px', scrollbarWidth: 'none' }}>
        {[...solves].reverse().map((solve, i) => (
          <SolveItem
            key={solve.id}
            index={solves.length - i}
            solve={solve}
            isPB={solve.timeMs + (solve.penalty === 2 ? 2000 : 0) === best && solve.penalty !== -1}
            onPenalty={(v) => onPenalty(solve.id, v)}
            onDelete={() => onDeleteSolve(solve.id)}
          />
        ))}
        {solves.length === 0 && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.85rem' }}>
            No solves yet.
          </div>
        )}
      </div>
    </div>
  );
}

export default function SidebarUI({
  data, onSessionChange, onAddSession, onClearSession, onPenalty, onDeleteSolve, appState, isFocusMode, activeView, setActiveView
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close drawers when focus mode activates
  useEffect(() => {
    if (isFocusMode) {
      setMenuOpen(false);
      setHistoryOpen(false);
    }
  }, [isFocusMode]);

  const activeSession = data.sessions.find(s => s.id === data.activeSessionId) || data.sessions[0];
  const solves = activeSession.solves;
  const best = getBest(solves);
  const sessionAvg = getSessionAvg(solves);
  const ao5 = calculateAoN(solves, 5);
  const ao12 = calculateAoN(solves, 12);

  const panelFade = {
    opacity: isFocusMode ? 0 : 1,
    transition: 'opacity 0.6s ease-in-out',
    pointerEvents: isFocusMode ? 'none' : 'auto',
  };

  const STATS = [
    { l: 'PB', v: best, isSpecial: true },
    { l: 'Session', v: sessionAvg },
    { l: 'Ao5', v: ao5 },
    { l: 'Ao12', v: ao12 },
    { l: 'Solves', v: solves.length, text: true }
  ];

  return (
    <>
      <style>{`
        .ghost-item {
          padding: 7px 10px;
          margin: 0 -10px;
          border-radius: 8px;
          transition: background 0.15s;
        }
        .ghost-item:hover { background: rgba(255,255,255,0.05); }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 13px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: background 0.15s;
          text-decoration: none;
          color: inherit;
        }
        .nav-item:hover { background: rgba(255,255,255,0.06); }
        .nav-item:hover .nav-arrow { opacity: 1; transform: translateX(0); }
        .nav-arrow {
          margin-left: auto;
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
          color: rgba(255,255,255,0.3);
        }

        /* Left slide-in panel for history (Desktop) / Bottom drawer (Mobile) */
        .history-panel {
          position: fixed; top: 0; left: 0; bottom: 0;
          width: min(340px, 85vw); z-index: 100;
          background: rgba(6, 4, 14, 0.96);
          border-right: 0.5px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          box-shadow: 20px 0 60px rgba(0,0,0,0.6);
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column;
          overflow: hidden;
          padding: 24px 20px 20px;
        }
        .history-panel.open { transform: translateX(0); }

        /* Right slide-in panel for Settings/Nav */
        .menu-panel {
          position: fixed; top: 0; right: 0; bottom: 0;
          width: min(340px, 85vw); z-index: 100;
          background: rgba(6, 4, 14, 0.96);
          border-left: 0.5px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          box-shadow: -20px 0 60px rgba(0,0,0,0.6);
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column;
          overflow: hidden;
        }
        .menu-panel.open { transform: translateX(0); }

        .menu-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 90;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* History button hover effect */
        .history-btn {
          position: fixed; top: 16px; left: 16px; z-index: 95;
          background: rgba(255,255,255,0.07); border: 0.5px solid rgba(255,255,255,0.18);
          color: rgba(255,255,255,0.75); cursor: pointer;
          padding: 8px 14px; border-radius: 20px;
          display: flex; align-items: center; gap: 6px;
          backdrop-filter: blur(10px); 
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 0.72rem; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; font-family: "Inter", sans-serif;
        }
        @media (hover: hover) {
          .history-btn:hover {
            background: rgba(255,255,255,0.12);
            border-color: rgba(255,255,255,0.3);
            color: white;
            transform: scale(1.04);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          .history-btn:active {
            transform: scale(0.98);
          }
        }

        /* Stats bar responsive */
        .stats-bar-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 36px;
          width: 100%;
          padding: 0 16px;
          box-sizing: border-box;
        }
        .stat-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-shrink: 0;
        }
        .stat-label {
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          font-family: monospace;
        }

        @media (max-width: 768px) {
          .stats-bar-inner {
            gap: 0;
            justify-content: space-around;
          }
          .stat-item {
            flex-direction: column;
            align-items: center;
            gap: 2px;
          }
          .stat-label { font-size: 0.6rem; letter-spacing: 0.5px; }
          .stat-value { font-size: 0.95rem; }

          .history-panel {
            top: auto; left: 0; right: 0; bottom: 0;
            width: 100%; height: 75vh;
            border-right: none;
            border-top: 0.5px solid rgba(255,255,255,0.12);
            border-radius: 24px 24px 0 0;
            transform: translateY(100%);
          }
          .history-panel.open { transform: translateY(0); }
        }
        @media (max-width: 400px) {
          .stat-label { font-size: 0.55rem; }
          .stat-value { font-size: 0.85rem; }
        }
      `}</style>

      {/* ── Unified: History text pill button (top-left) ── */}
      <button
        className="history-btn"
        onClick={(e) => { e.currentTarget.blur(); setHistoryOpen(true); }}
        style={panelFade}
        aria-label="Open history"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        History
      </button>

      {/* ── Hamburger Button (top-right) ── */}
      <button
        onClick={(e) => { e.currentTarget.blur(); setMenuOpen(true); }}
        style={{
          position: 'fixed', top: '16px', right: '16px', zIndex: 95,
          background: 'none', border: 'none',
          color: 'rgba(255,255,255,0.75)', cursor: 'pointer',
          padding: '8px 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.2s',
          ...panelFade
        }}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* ── Overlays ── */}
      {(menuOpen || historyOpen) && (
        <div className="menu-overlay" onClick={() => { setMenuOpen(false); setHistoryOpen(false); }} />
      )}

      {/* ── Right: Slide-in Nav Panel ── */}
      <div className={`menu-panel ${menuOpen ? 'open' : ''}`}>
        {/* Panel header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 20px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div>
            <div style={{ fontSize: '1.3rem', fontFamily: '"Cormorant Garamond", serif', fontWeight: '700', color: 'white', letterSpacing: '4px' }}>CUBEIT</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1.5px', marginTop: '3px' }}>The Speedcubing Suite</div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px', borderRadius: '10px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Nav items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 8px', scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map((item, idx) => {
            const isExternal = !!item.href;
            const Tag = isExternal ? 'a' : 'div';
            const extra = isExternal ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {
              onClick: () => {
                if (item.label === 'About Us') setActiveView('about');
                setMenuOpen(false);
              }
            };
            return (
              <Tag key={idx} className="nav-item" {...extra}>
                <div style={{ color: 'rgba(255,255,255,0.45)', flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'rgba(255,255,255,0.9)' }}>{item.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{item.sub}</div>
                </div>
                <span className="nav-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </span>
              </Tag>
            );
          })}
        </div>

        {/* Panel footer */}
        <div style={{ padding: '16px 20px', borderTop: '0.5px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
          <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>CubeIt v1.0 — Open Source</span>
        </div>
      </div>

      {/* ── Unified: History Slide-in Drawer (Left side) ── */}
      <div className={`history-panel ${historyOpen ? 'open' : ''}`}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: 'rgba(255,255,255,0.9)', letterSpacing: '1px' }}>Solve History</h2>
          <button
            onClick={() => setHistoryOpen(false)}
            style={{ background: 'rgba(255,255,255,0.07)', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: '8px', borderRadius: '10px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <HistoryPanel
            data={data}
            onSessionChange={onSessionChange}
            onAddSession={onAddSession}
            onClearSession={onClearSession}
            onPenalty={onPenalty}
            onDeleteSolve={onDeleteSolve}
            solves={solves}
            best={best}
          />
        </div>
      </div>

      {/* ── Bottom: Stats Bar ── */}
      <div className="glass-panel" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none',
        height: '60px',
        display: 'flex', alignItems: 'center',
        zIndex: 20, fontFamily: '"Inter", sans-serif',
        ...panelFade
      }}>
        <div className="stats-bar-inner">
          {STATS.map(st => (
            <div key={st.l} className="stat-item">
              <span className="stat-label">{st.l}</span>
              <span className="stat-value" style={{ color: st.isSpecial ? '#00ff88' : 'rgba(255,255,255,0.9)' }}>
                {st.text ? st.v : (st.v ? formatTime(st.v) : '—')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
