import React, { useState } from 'react';
import Logo from './components/common/Logo';
import MainLayout from './components/layout/MainLayout';
import TimerDisplay from './components/timer/TimerDisplay';
import SessionStats from './components/stats/SessionStats';
import TimerStats from './components/timer/TimerStats';
import EventSelector from './components/events/EventSelector';
import { useTimer } from './hooks/useTimer';
import { useSolves } from './hooks/useSolves';
import { useAuth } from './contexts/AuthContext';
import './components/stats/SessionStats.css';
import './App.css';

function App() {
  const [currentEvent, setCurrentEvent] = useState('cycle');
  const [currentSession, setCurrentSession] = useState(1);
  const { solves, addSolve, removeSolve, clearSession } = useSolves(currentEvent, currentSession);
  const { currentUser, login, logout } = useAuth();

  const handleSolveComplete = (time) => {
    addSolve(time);
  };

  const handleSwipeDown = () => {
    if (solves.length > 0) {
      const lastSolve = solves[0]; // Assumes solves are sorted desc (newest first)
      if (confirm(`Delete last solve (${useTimer.formatTime ? formatTime(lastSolve.time) : lastSolve.time})?`)) { // access formatTime tricky here before decl. 
        // Wait, formatTime is returned by useTimer. 
        // We can just ask for confirm generic or use simple math, or capture formatTime reference differently.
        // Simpler: Just delete with generic message or no confirm if "gesture" implies speed.
        // User asked "slide to delete", usually implies quick action. 
        // But deletion is destructive. A confirm is safer.
        removeSolve(lastSolve.id);
      }
    }
  };

  // We need formatTime inside handleSwipe, but useTimer returns it. Circular dependency in definition order?
  // No, useTimer is a hook.
  // We can't access 'formatTime' returned by useTimer inside the arguments TO useTimer.
  // We'll define the callback without using formatTime or just use a helper.

  // Actually, let's just make the callback call removeSolve.
  // We can use a ref or just simple logic.

  const { time, timerState, formatTime, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp } = useTimer(handleSolveComplete, () => {
    // onSwipeDown inline
    if (solves.length > 0) {
      // Haptic feedback (already resulted in useTimer? maybe doubled)
      if (window.confirm("Delete last solve?")) {
        removeSolve(solves[0].id);
      }
    }
  });

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
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ height: '100vh', width: '100vw' }}
    >
      <MainLayout
        isFocused={isFocused}
        topBar={
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Logo size={42} />
              <span style={{ fontWeight: '800', fontSize: '1.4em', background: 'linear-gradient(to right, #00d2ff, #3a7bd5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '1px' }}>SS TIMER</span>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <EventSelector currentEvent={currentEvent} onEventChange={setCurrentEvent} />
            </div>
            <div style={{ width: '100px', display: 'flex', justifyContent: 'flex-end' }}>
              {currentUser ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {currentUser.photoURL &&
                    <img src={currentUser.photoURL} alt="user" style={{ width: 32, height: 32, borderRadius: '50%' }} />
                  }
                  <button
                    onClick={logout}
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: '#aaa',
                      cursor: 'pointer',
                      padding: '5px 10px',
                      borderRadius: '4px'
                    }}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  style={{
                    background: '#3a7bd5',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    fontWeight: 'bold'
                  }}
                >
                  Log In
                </button>
              )}
            </div>
          </div>
        }
        leftPanel={
          <SessionStats
            solves={solves}
            formatTime={formatTime}
            onRemove={removeSolve}
            currentSession={currentSession}
            onSessionChange={setCurrentSession}
          />
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
