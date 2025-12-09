import React, { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import TimerDisplay from './components/timer/TimerDisplay';
import SessionStats from './components/stats/SessionStats';
import TimerStats from './components/timer/TimerStats';
import EventSelector from './components/events/EventSelector';
import { useTimer } from './hooks/useTimer';
import { useSolves } from './hooks/useSolves';
import './components/stats/SessionStats.css';
import './App.css';

function App() {
  const [currentEvent, setCurrentEvent] = useState('3-3-3');
  const { solves, addSolve, removeSolve, clearSession } = useSolves(currentEvent);

  const handleSolveComplete = (time) => {
    addSolve(time);
  };

  const { time, timerState, formatTime, handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp } = useTimer(handleSolveComplete);

  // Immersive mode: active when holding, ready, or running
  const isFocused = timerState === 'HOLDING' || timerState === 'READY' || timerState === 'RUNNING';

  // Tools panel content (Right side)
  const renderTools = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%', alignItems: 'center' }}>
      <button
        onClick={clearSession}
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-secondary)',
          padding: '8px',
          borderRadius: '8px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Clear Session"
      >
        🗑️
      </button>
    </div>
  );

  return (
    <div
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ height: '100vh', width: '100vw' }}
    >
      <MainLayout
        isFocused={isFocused}
        topBar={
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: '800', fontSize: '1.4em', background: 'linear-gradient(to right, #00d2ff, #3a7bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SS TIMER</span>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <EventSelector currentEvent={currentEvent} onEventChange={setCurrentEvent} />
            </div>
            <div style={{ width: '100px' }}></div> {/* Spacer balance */}
          </div>
        }
        leftPanel={
          <SessionStats solves={solves} formatTime={formatTime} onRemove={removeSolve} />
        }
        centerPanel={
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100%', gap: '20px',
            width: '100%'
          }}>
            {/* Event specific visual or icon could go here */}
            <h2 style={{
              opacity: isFocused ? 0 : 0.3,
              transition: 'opacity 0.3s',
              fontSize: '2em',
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '5px',
              pointerEvents: 'none'
            }}>
              {currentEvent}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <TimerDisplay time={time} timerState={timerState} formatTime={formatTime} />
              <TimerStats solves={solves} formatTime={formatTime} />
            </div>

            {timerState === 'IDLE' && (
              <p style={{
                position: 'absolute',
                bottom: '10vh',
                opacity: 0.4,
                fontSize: '0.9em',
                letterSpacing: '1px'
              }}>
                HOLD SPACE TO START
              </p>
            )}
          </div>
        }
        rightPanel={renderTools()}
      />
    </div>
  );
}

export default App;
