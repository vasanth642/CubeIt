import React from 'react';
import { formatTime, calculateAoN, calculateMoN, getSessionAvg, getBest, getWorst } from './utils/stats';

function SolveItem({ solve, index, onPenalty, onDelete, isPB }) {
  const displayTime = formatTime(solve.timeMs + (solve.penalty === 2 ? 2000 : 0));
  const isDNF = solve.penalty === -1;
  const isPlus2 = solve.penalty === 2;

  const btnStyle = (active) => ({
    background: active ? '#7B1FA2' : '#2A0B4D',
    color: active ? 'white' : '#A276CD',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem', padding: '4px 8px',
    fontWeight: 'bold', transition: 'all 0.2s ease'
  });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isPB ? 'rgba(0, 230, 118, 0.1)' : '#190336', borderLeft: isPB ? '4px solid #00E676' : '4px solid transparent', padding: '10px', borderRadius: '8px', transition: 'all 0.2s ease' }}>
      <div style={{ flex: 1, display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ color: '#6A4A9A', fontSize: '0.8rem', width:'20px' }}>{index}</span>
        <span style={{ fontWeight: 'bold', color: isDNF ? '#FF1744' : isPB ? '#00E676' : 'white', textDecoration: isDNF ? 'line-through' : 'none', fontSize: '1rem' }}>
          {isPlus2 ? `${displayTime}+` : isDNF ? 'DNF' : displayTime}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        <button onClick={(e) => { e.currentTarget.blur(); onPenalty(0); }} style={btnStyle(solve.penalty === 0)}>OK</button>
        <button onClick={(e) => { e.currentTarget.blur(); onPenalty(2); }} style={btnStyle(isPlus2)}>+2</button>
        <button onClick={(e) => { e.currentTarget.blur(); onPenalty(-1); }} style={btnStyle(isDNF)}>DNF</button>
        <button onClick={(e) => { e.currentTarget.blur(); onDelete(); }} style={{...btnStyle(false), background: '#5C081A', color: '#FF1744'}}>✕</button>
      </div>
    </div>
  )
}

const panelStyle = {
  background: '#0B001A', 
  borderRadius: '16px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
  color: 'white',
  padding: '20px',
  fontFamily: '"Inter", sans-serif',
  zIndex: 20,
  pointerEvents: 'auto'
}

export default function SidebarUI({ 
  data, onSessionChange, onAddSession, onClearSession, onPenalty, onDeleteSolve, onExport, appState 
}) {
  const isSolving = appState === 'READYING_RED' || appState === 'READYING_GREEN' || appState === 'RUNNING';
  if (isSolving) return null;

  const activeSession = data.sessions.find(s => s.id === data.activeSessionId) || data.sessions[0];
  const solves = activeSession.solves;

  const best = getBest(solves);
  const worst = getWorst(solves);
  const sessionAvg = getSessionAvg(solves);
  const ao5 = calculateAoN(solves, 5);
  const ao12 = calculateAoN(solves, 12);

  return (
    <>
      <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 20, display: 'flex', gap: '10px', pointerEvents: 'auto' }}>
        <select value={data.activeSessionId} onChange={(e) => { e.currentTarget.blur(); onSessionChange(e.target.value); }}
          style={{ background: '#0B001A', color: 'white', border: '1px solid #2A0B4D', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', outline: 'none', fontWeight: 'bold' }}>
          {data.sessions.map(s => <option key={s.id} value={s.id}>{s.name} ({s.solves.length})</option>)}
        </select>
        <button onClick={(e) => { e.currentTarget.blur(); onAddSession(); }} style={{ background: '#2A0B4D', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>+ New Session</button>
        <button onClick={(e) => { e.currentTarget.blur(); onExport(data); }} style={{ background: '#10529A', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Export</button>
      </div>

      <div style={{ ...panelStyle, position: 'absolute', bottom: '20px', left: '20px', width: '340px', height: '350px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
           <h3 style={{margin:0, fontSize:'1.1rem'}}>History</h3>
           <button onClick={(e) => { e.currentTarget.blur(); onClearSession(); }} style={{ background: '#FF1744', color: 'white', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 'bold' }}>Clear All</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, paddingRight: '5px' }}>
          {[...solves].reverse().map((solve, i) => (
             <SolveItem key={solve.id} index={solves.length - i} solve={solve} isPB={solve.timeMs + (solve.penalty === 2 ? 2000 : 0) === best && solve.penalty !== -1} onPenalty={(v) => onPenalty(solve.id, v)} onDelete={() => onDeleteSolve(solve.id)} />
          ))}
          {solves.length === 0 && <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6A4A9A'}}><p>No solves yet.</p></div>}
        </div>
      </div>

      <div style={{ ...panelStyle, position: 'absolute', bottom: '20px', right: '20px', width: '380px' }}>
        <h3 style={{margin: '0 0 15px 0', fontSize:'1.1rem'}}>Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[{l: 'PB', v: best, c: '#00E676'}, {l: 'Worst', v: worst, c: '#FF1744'}, {l: 'Avg', v: sessionAvg}, {l: 'Ao5', v: ao5}, {l: 'Ao12', v: ao12}, {l: 'Solves', v: solves.length, text: true}].map(st => (
                <div key={st.l} style={{ background: '#190336', padding: '15px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#A276CD', fontSize: '0.85rem', fontWeight: 'bold' }}>{st.l}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.05rem', color: st.c || 'white' }}>
                        {st.text ? st.v : (st.v ? formatTime(st.v) : '-')}
                    </span>
                </div>
            ))}
        </div>
      </div>
    </>
  )
}
