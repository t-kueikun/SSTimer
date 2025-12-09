import React, { useState, useEffect } from 'react';
import Logo from './components/common/Logo';
import MainLayout from './components/layout/MainLayout';
import TimerDisplay from './components/timer/TimerDisplay';
import SessionStats from './components/stats/SessionStats';
import TimerStats from './components/timer/TimerStats';
import EventSelector from './components/events/EventSelector';
import Settings from './components/settings/Settings'; // Changed from SettingsModal to Settings
import LanguageSelector from './components/common/LanguageSelector';
import { useTimer } from './hooks/useTimer';
import { useSolves } from './hooks/useSolves';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import './components/stats/SessionStats.css';
import './App.css';

function App() {
  const [currentEvent, setCurrentEvent] = useState('cycle');
  const [currentSession, setCurrentSession] = useState(1);
  const [maxSession, setMaxSession] = useState(() => {
    return Number(localStorage.getItem('maxSession')) || 3;
  });
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { solves, addSolve, removeSolve, clearSession } = useSolves(currentEvent, currentSession);
  const { currentUser, login, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    localStorage.setItem('maxSession', maxSession);
  }, [maxSession]);

  const handleSolveComplete = (time) => {
    addSolve(time);
  };

  const handleCreateSession = () => {
    const newSession = maxSession + 1;
    setMaxSession(newSession);
    setCurrentSession(newSession);
  };

  // Time Difference Calculation
  let timeDiff = null;
  if (solves.length >= 2) {
    const current = solves[0].time;
    const prev = solves[1].time;
    timeDiff = current - prev;
  }

  const { time, timerState, formatTime, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp } = useTimer(handleSolveComplete, () => {
    // onSwipeDown inline
    if (solves.length > 0) {
      if (window.confirm(t('confirmDelete'))) {
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
          justifyContent: 'center',
          cursor: 'pointer'
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
        showLeftPanel={showSidebar}
        topBar={
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setShowSidebar(prev => !prev)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  fontSize: '1.2em',
                  cursor: 'pointer',
                  padding: '5px'
                }}
              >
                {showSidebar ? '◀' : '▶'}
              </button>
              <div
                onClick={() => {
                  console.log("Logo Clicked");
                  setShowSettings(true);
                }}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', pointerEvents: 'auto', padding: '5px' }}
                title="Settings"
              >
                <Logo size={42} />
              </div>
              <span
                onClick={() => setShowSettings(true)}
                style={{
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '1.4em',
                  background: 'linear-gradient(to right, #00d2ff, #3a7bd5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '1px'
                }}
              >
                SS TIMER
              </span>
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
              <EventSelector currentEvent={currentEvent} onEventChange={setCurrentEvent} />
            </div>
            <div style={{ width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '15px' }}>
              <LanguageSelector />
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
                    {t('logout')}
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
                  {t('login')}
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
            maxSession={maxSession}
            onCreateSession={handleCreateSession}
          />
        }
        centerPanel={
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: '20px',
            width: '100%'
          }}>
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
              <TimerDisplay time={time} timerState={timerState} formatTime={formatTime} timeDiff={timeDiff} />

              <div style={{
                opacity: isFocused ? 0 : 1,
                transition: 'opacity 0.2s',
                pointerEvents: isFocused ? 'none' : 'auto',
                marginTop: '10px'
              }}>
                <TimerStats solves={solves} formatTime={formatTime} />
              </div>
            </div>

            {timerState === 'IDLE' && (
              <p style={{
                position: 'fixed',
                bottom: '10vh',
                opacity: 0.4,
                fontSize: '0.9em',
                letterSpacing: '1px'
              }}>
                {t('holdToStart')}
              </p>
            )}
          </div>
        }
        rightPanel={renderTools()}
      />
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default App;
