import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ss-timer-solves-v2';

export const useSolves = (currentEventId) => {
    const [allSolves, setAllSolves] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    // Get list for current event
    const solves = allSolves[currentEventId] || [];

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allSolves));
    }, [allSolves]);

    const addSolve = (time) => {
        const newSolve = {
            id: Date.now(),
            time,
            date: new Date().toISOString()
        };

        setAllSolves(prev => ({
            ...prev,
            [currentEventId]: [newSolve, ...(prev[currentEventId] || [])]
        }));
    };

    const clearSession = () => {
        if (confirm(`Clear all solves for ${currentEventId}?`)) {
            setAllSolves(prev => ({
                ...prev,
                [currentEventId]: []
            }));
        }
    };

    const removeSolve = (id) => {
        setAllSolves(prev => ({
            ...prev,
            [currentEventId]: (prev[currentEventId] || []).filter(s => s.id !== id)
        }));
    };

    return { solves, addSolve, clearSession, removeSolve };
};
