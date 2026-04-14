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

export default function TimerUI({ appState, timeMs, scrambleText, inspectionTimeMs, onTouchStart, onTouchEnd, isMobile }) {
  const isIdle = appState === 'IDLE' || appState === 'STOPPED' || appState === 'READYING_INSPECT';
  const isInspecting = appState === 'INSPECTING';
  const isReadyRed = appState === 'READYING_RED';
  const isReadyGreen = appState === 'READYING_GREEN';
  const isRunning = appState === 'RUNNING';
  const isFocusMode = isInspecting || isReadyRed || isReadyGreen || isRunning;

  const cyberGlow = '0 0 20px rgba(0, 255, 136, 0.4)';
  let timerColor = '#ffffff';
  if (isReadyRed) timerColor = '#ff4d4d';
  if (isReadyGreen || isRunning) timerColor = '#00ff88';

  let timerGlow = 'none';
  if (isReadyRed) timerGlow = '0 0 20px rgba(255, 77, 77, 0.4)';
  if (isReadyGreen || isRunning) timerGlow = cyberGlow;

  const hintText = isMobile ? 'Tap & Hold to Inspect' : 'Tap Spacebar to Inspect';

  return (
    <>
      <style>{`
        @media (max-width: 600px) {
          .vantage-title { font-size: 2rem !important; letter-spacing: 0.3em !important; text-indent: 0.3em !important; padding-top: 24px !important; }
          .scramble-text { font-size: 0.78rem !important; max-width: 88vw !important; word-break: break-all; letter-spacing: 1.5px !important; }
          .idle-timer { font-size: 3.8rem !important; }
          .idle-timer-wrap { bottom: 72px !important; }
          .inspection-timer { font-size: 6rem !important; }
          .running-timer { font-size: 16vw !important; }
          .ready-timer { font-size: 3.5rem !important; }
        }
        @media (max-width: 380px) {
          .vantage-title { font-size: 1.6rem !important; }
          .idle-timer { font-size: 3rem !important; }
          .inspection-timer { font-size: 5rem !important; }
        }
        .touch-layer {
          position: absolute;
          inset: 0;
          z-index: 8;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          -webkit-user-select: none;
        }
      `}</style>

      {/* Full-screen touch layer for mobile timer control */}
      {isMobile && (
        <div
          className="touch-layer"
          onTouchStart={(e) => { e.preventDefault(); onTouchStart && onTouchStart(); }}
          onTouchEnd={(e) => { e.preventDefault(); onTouchEnd && onTouchEnd(); }}
        />
      )}

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10,
        fontFamily: '"Inter", sans-serif',
      }}>

        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          textAlign: 'center', paddingTop: '45px',
          opacity: isFocusMode ? 0 : 1,
          transition: 'opacity 0.6s ease-in-out',
          paddingLeft: '24px', paddingRight: '24px',
        }}>
          <div className="scramble-container" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px',
            maxWidth: '700px', margin: '0 auto'
          }}>
            <span style={{ 
              fontSize: '2.2rem', color: '#00ff88', fontWeight: '700', 
              fontFamily: '"Cormorant Garamond", serif', letterSpacing: '4px' 
            }}>C</span>
            
            <div className="scramble-text" style={{
              fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.88)', 
              fontFamily: 'monospace', letterSpacing: '2px', lineHeight: '1.7',
              wordBreak: 'break-word', flex: 1
            }}>
              {scrambleText.join(' ')}
            </div>

            <span style={{ 
              fontSize: '2.2rem', color: '#00ff88', fontWeight: '700', 
              fontFamily: '"Cormorant Garamond", serif', letterSpacing: '4px' 
            }}>I</span>
          </div>
        </div>

        {/* — IDLE: time display at bottom 1/3 — */}
        {isIdle && (
          <div className="idle-timer-wrap" style={{
            position: 'absolute', bottom: '120px', left: 0, right: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: 1, transition: 'opacity 0.6s ease-in-out',
            padding: '0 16px',
          }}>
            <div className="idle-timer" style={{
              fontSize: '5.5rem', fontWeight: '900', color: '#00ff88',
              fontVariantNumeric: 'tabular-nums', letterSpacing: '-2px',
              fontFamily: '"Inter", sans-serif',
            }}>
              {formatTime(timeMs)}
            </div>
            <div style={{
              color: '#ffffff', fontSize: '0.75rem', marginTop: '12px',
              textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '600',
              textAlign: 'center',
            }}>
              {hintText}
            </div>
          </div>
        )}

        {/* — FOCUS MODE: absolutely centered content — */}
        {isFocusMode && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: 1, transition: 'opacity 0.6s ease-in-out',
            padding: '0 16px',
          }}>

            {/* INSPECTION */}
            {isInspecting && (
              <div style={{ textAlign: 'center' }}>
                <div className="inspection-timer" style={{
                  fontSize: '10rem', fontWeight: '800', color: '#ff9f43',
                  fontVariantNumeric: 'tabular-nums', lineHeight: 1,
                }}>
                  {Math.ceil(inspectionTimeMs / 1000)}
                </div>
                <div style={{
                  color: 'rgba(255, 159, 67, 0.8)', fontSize: '0.8rem', marginTop: '16px',
                  textTransform: 'uppercase', letterSpacing: '5px', fontWeight: '700',
                }}>
                  Inspection Period
                </div>
              </div>
            )}

            {/* READYING_RED */}
            {isReadyRed && (
              <div style={{ textAlign: 'center' }}>
                <div className="ready-timer" style={{
                  fontSize: '5rem', fontWeight: '800', color: '#ff4d4d',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  0.00
                </div>
                <div style={{
                  color: 'rgba(255, 77, 77, 0.8)', fontSize: '0.8rem', marginTop: '12px',
                  textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '700',
                }}>
                  Wait...
                </div>
              </div>
            )}

            {/* READYING_GREEN */}
            {isReadyGreen && (
              <div style={{ textAlign: 'center' }}>
                <div className="ready-timer" style={{
                  fontSize: '5rem', fontWeight: '800', color: '#00ff88',
                  fontVariantNumeric: 'tabular-nums',
                  textShadow: '0 0 30px rgba(0, 255, 136, 0.6)',
                }}>
                  0.00
                </div>
                <div style={{
                  color: 'rgba(0, 255, 136, 0.8)', fontSize: '0.8rem', marginTop: '12px',
                  textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '700',
                }}>
                  {isMobile ? 'Release to Start!' : 'Release to Start!'}
                </div>
              </div>
            )}

            {/* RUNNING */}
            {isRunning && (
              <div className="running-timer" style={{
                fontSize: '12vw', fontWeight: '900', color: timerColor,
                fontVariantNumeric: 'tabular-nums', fontFamily: '"Inter", sans-serif',
                textShadow: timerGlow,
              }}>
                {formatTime(timeMs)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
