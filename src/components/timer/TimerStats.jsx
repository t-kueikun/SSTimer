import React from 'react';
import { calculateAvg } from '../../utils/stats';
import './TimerStats.css';

const TimerStats = ({ solves, formatTime }) => {
    const mo3 = calculateAvg(solves, 3);
    const ao5 = calculateAvg(solves, 5);
    const ao12 = calculateAvg(solves, 12);

    const formatValue = (val) => val === null ? '-' : formatTime(val);

    return (
        <div className="timer-stats">
            <div className="stat-item">
                <span className="stat-label">mo3</span>
                <span className="stat-value">{formatValue(mo3)}</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">ao5</span>
                <span className="stat-value">{formatValue(ao5)}</span>
            </div>
            <div className="stat-item">
                <span className="stat-label">ao12</span>
                <span className="stat-value">{formatValue(ao12)}</span>
            </div>
        </div>
    );
};

export default TimerStats;
