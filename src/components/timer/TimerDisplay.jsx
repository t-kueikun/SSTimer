import React from 'react';
import './TimerDisplay.css';

const TimerDisplay = ({ time, timerState, formatTime, timeDiff }) => {
    let colorClass = '';
    switch (timerState) {
        case 'HOLDING': colorClass = 'timer-red'; break;
        case 'READY': colorClass = 'timer-green'; break;
        case 'RUNNING': colorClass = 'timer-running'; break;
        default: colorClass = 'timer-neutral';
    }

    // csTimer hides controls while running usually, but we just change color for now

    return (
        <div className={`timer-display ${colorClass}`}>
            {formatTime(time)}
            {/* Show diff only when not running or holding */}
            {timeDiff !== null && timerState === 'IDLE' && time > 0 && (
                <div style={{
                    fontSize: '0.3em',
                    marginTop: '10px',
                    color: timeDiff < 0 ? '#4ade80' : '#f87171',
                    fontWeight: 'bold',
                    opacity: 0.8
                }}>
                    {timeDiff > 0 ? '+' : ''}{formatTime(timeDiff)}
                </div>
            )}
        </div>
    );
};

export default TimerDisplay;
