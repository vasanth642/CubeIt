import React from 'react';

const formatTime = (timeMs) => {
  const totalSeconds = Math.floor(timeMs / 1000);
  const ms = Math.floor((timeMs % 1000) / 10);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  }
  return `${seconds}.${ms.toString().padStart(2, '0')}`;
};

export default function TimerUI({ appState, timeMs, scrambleText }) {
  let timerColor = 'white';
  if (appState === 'READYING_RED') timerColor = '#FF1744';
  if (appState === 'READYING_GREEN') timerColor = '#00E676';

  const isIdle = appState === 'IDLE' || appState === 'STOPPED';

  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', flexDirection: 'column', zIndex: 10,
      fontFamily: '"Inter", sans-serif'
    }}>
      <div style={{ flex: '0 0 auto', textAlign: 'center', paddingTop: '30px', transition: 'opacity 0.2s', opacity: isIdle ? 1 : 0 }}>
        <div style={{ 
          fontSize: '1.2rem', color: 'white', maxWidth: '70%', margin: '0 auto', 
          fontWeight: 'bold', letterSpacing: '2px', textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {scrambleText.join(' ')}
        </div>
      </div>
      
      <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!isIdle && (
          <div style={{ 
            fontSize: '15vw', fontWeight: 'bold', color: timerColor,
            fontVariantNumeric: 'tabular-nums', textShadow: `0 0 40px ${timerColor}66`
          }}>
            {formatTime(timeMs)}
          </div>
        )}
      </div>

      <div style={{ flex: '0 0 auto', textAlign: 'center', paddingBottom: '30px', transition: 'opacity 0.2s', opacity: isIdle ? 1 : 0 }}>
        {isIdle && (
          <div style={{ 
            fontSize: '5rem', fontWeight: 'bold', color: 'white',
            fontVariantNumeric: 'tabular-nums', textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {formatTime(timeMs)}
          </div>
        )}
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1rem', marginTop: '10px' }}>
          Hold Spacebar to run
        </div>
      </div>
    </div>
  );
}
