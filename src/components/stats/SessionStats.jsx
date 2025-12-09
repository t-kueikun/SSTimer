import React, { useMemo } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { calculateAvg } from '../../utils/stats';
import './SessionStats.css';

const SessionStats = ({ solves, formatTime, onRemove, currentSession = 1, onSessionChange, maxSession = 3, onCreateSession }) => {
    const { t } = useLanguage();

    const stats = useMemo(() => {
        const count = solves.length;
        if (count === 0) return {
            current: { time: '-', mo3: '-', ao5: '-', ao12: '-' },
            best: { time: '-', mo3: '-', ao5: '-', ao12: '-' },
            mean: '-',
            rows: [],
            count: 0
        };

        const fmt = (val) => val ? formatTime(val) : '-';

        // 1. Calculate all values to find Best
        let bestTime = Infinity;
        let bestMo3 = Infinity;
        let bestAo5 = Infinity;
        let bestAo12 = Infinity;

        // First pass: Calculate and find bests
        const richSolves = solves.map((s, i) => {
            const subset = solves.slice(i);
            const ao5 = calculateAvg(subset, 5);
            const ao12 = calculateAvg(subset, 12);
            const mo3 = calculateAvg(subset, 3);

            if (s.time < bestTime) bestTime = s.time;
            if (mo3 && mo3 < bestMo3) bestMo3 = mo3;
            if (ao5 && ao5 < bestAo5) bestAo5 = ao5;
            if (ao12 && ao12 < bestAo12) bestAo12 = ao12;

            return { ...s, ao5, ao12, mo3 };
        });

        // Current Stats (Index 0)
        const current = richSolves[0];

        // Second pass: Mark bests
        const rows = richSolves.map((s, i) => ({
            ...s,
            index: count - i,
            isBestTime: s.time === bestTime,
            isBestAo5: s.ao5 === bestAo5,
            isBestAo12: s.ao12 === bestAo12
        }));

        // Calculate Mean
        const totalSum = solves.reduce((a, b) => a + b.time, 0);
        const mean = totalSum / count;

        return {
            current: {
                time: fmt(current.time),
                mo3: fmt(current.mo3),
                ao5: fmt(current.ao5),
                ao12: fmt(current.ao12)
            },
            best: {
                time: bestTime !== Infinity ? fmt(bestTime) : '-',
                mo3: bestMo3 !== Infinity ? fmt(bestMo3) : '-',
                ao5: bestAo5 !== Infinity ? fmt(bestAo5) : '-',
                ao12: bestAo12 !== Infinity ? fmt(bestAo12) : '-'
            },
            mean: fmt(mean),
            rows,
            count
        };
    }, [solves, formatTime]);

    // Generate array of session numbers [1, 2, ..., maxSession]
    const sessions = Array.from({ length: maxSession }, (_, i) => i + 1);

    return (
        <div className="session-stats">
            <div className="session-header">
                <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, marginRight: '8px' }}>{t('session')}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', padding: '2px' }}>
                            <button
                                onClick={() => onSessionChange(Math.max(1, currentSession - 1))}
                                disabled={currentSession === 1}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: currentSession === 1 ? 'rgba(255,255,255,0.2)' : 'white',
                                    cursor: currentSession === 1 ? 'default' : 'pointer',
                                    fontSize: '0.9em',
                                    padding: '2px 6px'
                                }}
                            >
                                ◀
                            </button>
                            <select
                                value={currentSession}
                                onChange={(e) => onSessionChange(Number(e.target.value))}
                                style={{
                                    background: 'transparent',
                                    color: 'white',
                                    border: 'none',
                                    fontSize: '1em',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    appearance: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                {sessions.map(num => (
                                    <option key={num} value={num} style={{ color: 'black' }}>{num}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    if (currentSession < maxSession) {
                                        onSessionChange(currentSession + 1);
                                    } else {
                                        onCreateSession();
                                    }
                                }}
                                style={{
                                    marginLeft: '2px',
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '0.9em',
                                    padding: '2px 6px'
                                }}
                            >
                                ▶
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (window.confirm(t('clearSession') + '?')) {
                                solves.forEach(s => onRemove(s.id));
                            }
                        }}
                        style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.1em' }}
                        title="Delete Session"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Dashed Border Container */}
            <div className="stats-container-dashed">
                {/* Top Grid: Current vs Best */}
                <div className="stats-grid-detailed">
                    <div className="stats-col-header"></div>
                    <div className="stats-col-header">{t('current')}</div>
                    <div className="stats-col-header">{t('best')}</div>

                    <div className="stats-label">{t('time')}</div>
                    <div className="stats-val value-blue">{stats.current.time}</div>
                    <div className="stats-val value-blue">{stats.best.time}</div>

                    <div className="stats-label">mo3</div>
                    <div className="stats-val value-blue">{stats.current.mo3}</div>
                    <div className="stats-val value-blue">{stats.best.mo3}</div>

                    <div className="stats-label">ao5</div>
                    <div className="stats-val value-blue">{stats.current.ao5}</div>
                    <div className="stats-val value-blue">{stats.best.ao5}</div>

                    <div className="stats-label">ao12</div>
                    <div className="stats-val value-blue">{stats.current.ao12}</div>
                    <div className="stats-val value-blue">{stats.best.ao12}</div>
                </div>
            </div>

            {/* Summary Box */}
            <div className="stats-total-summary">
                <div>{t('solves')}: {stats.count}/{stats.count}</div>
                <div>Mean: {stats.mean}</div>
            </div>

            {/* History Table */}
            <div className="solves-list">
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('time')}</th>
                            <th>ao5</th>
                            <th>ao12</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.rows.map((row) => (
                            <tr key={row.id}>
                                <td>{row.index}</td>
                                <td className={row.isBestTime ? "value-best" : "value-blue"}>{formatTime(row.time)}</td>
                                <td className={row.ao5 ? (row.isBestAo5 ? "value-best stat-val-sm" : "stat-val-sm") : "stat-val-sm"}>{row.ao5 ? formatTime(row.ao5) : '-'}</td>
                                <td className={row.ao12 ? (row.isBestAo12 ? "value-best stat-val-sm" : "stat-val-sm") : "stat-val-sm"}>{row.ao12 ? formatTime(row.ao12) : '-'}</td>
                                <td>
                                    <button className="del-btn" onClick={() => onRemove(row.id)}>×</button>
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
