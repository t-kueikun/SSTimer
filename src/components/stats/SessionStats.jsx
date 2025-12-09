import React from 'react';
import { calculateAvg, calculateBest } from '../../utils/stats';
import './SessionStats.css';

const SessionStats = ({ solves, formatTime, onRemove }) => {
    const ao5 = calculateAvg(solves, 5);
    const ao12 = calculateAvg(solves, 12);
    const best = calculateBest(solves);

    return (
        <div className="session-stats">
            <div className="stats-header">
                <h3>Session 1</h3>
                <span>({solves.length})</span>
            </div>

            <div className="stats-summary" style={{ padding: '10px', background: 'rgba(0,0,0,0.1)', marginBottom: '10px', fontSize: '0.9em' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Best:</span> <span>{best !== null ? formatTime(best) : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ao5:</span> <span>{ao5 !== null ? formatTime(ao5) : '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Ao12:</span> <span>{ao12 !== null ? formatTime(ao12) : '-'}</span>
                </div>
            </div>

            <div className="solves-list">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {solves.map((solve, index) => (
                            <tr key={solve.id}>
                                <td>{solves.length - index}</td>
                                <td className="time-val">{formatTime(solve.time)}</td>
                                <td>
                                    <button className="del-btn" onClick={() => onRemove(solve.id)}>×</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SessionStats;
