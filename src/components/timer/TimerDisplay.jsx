import React from 'react';
import './TimerDisplay.css';

const TimerDisplay = ({ time, timerState, formatTime }) => {
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
        </div>
    );
};

export default TimerDisplay;
