import { useState, useEffect, useRef, useCallback } from 'react';

const TIMER_STATE = {
    IDLE: 'IDLE',
    HOLDING: 'HOLDING',
    READY: 'READY',
    RUNNING: 'RUNNING',
    STOPPED: 'STOPPED'
};

const formatTime = (ms) => {
    // Ensure integer logic for display
    const totalMs = Math.floor(ms);
    if (totalMs === 0) return "0.000";

    let seconds = Math.floor(totalMs / 1000);
    let milliseconds = totalMs % 1000;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    // 3 decimal places for precision
    let msStr = milliseconds.toString().padStart(3, '0');

    if (totalMs >= 1000 * 60) {
        let sStr = seconds.toString().padStart(2, '0');
        return `${minutes}:${sStr}.${msStr}`;
    } else {
        return `${seconds}.${msStr}`;
    }
};

export const useTimer = (onSolveComplete) => {
    const [time, setTime] = useState(0);
    const [timerState, setTimerState] = useState(TIMER_STATE.IDLE);

    // Refs to access latest state in stable event listeners
    const stateRef = useRef(TIMER_STATE.IDLE);
    const startRef = useRef(null);
    const frameRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const onSolveCompleteRef = useRef(onSolveComplete);

    // Keep callback ref updated
    useEffect(() => {
        onSolveCompleteRef.current = onSolveComplete;
    }, [onSolveComplete]);

    // Keep state ref updated
    useEffect(() => {
        stateRef.current = timerState;
    }, [timerState]);

    // Audio Context
    const audioContextRef = useRef(null);

    const initAudio = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume().catch(() => { });
        }
    };

    const playBeep = useCallback(() => {
        try {
            if (!audioContextRef.current) return;
            const ctx = audioContextRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.frequency.value = 880;
            osc.type = 'sine';

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);

            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (err) {
            console.warn("Audio play failed", err);
        }
    }, []);

    const update = useCallback(() => {
        const now = performance.now();
        setTime(now - (startRef.current || now));
        frameRef.current = requestAnimationFrame(update);
    }, []);

    const stopTimer = useCallback(() => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
        const finalTime = performance.now() - (startRef.current || 0);
        setTime(finalTime);
        setTimerState(TIMER_STATE.STOPPED);
        if (onSolveCompleteRef.current) onSolveCompleteRef.current(finalTime);
    }, []);

    const handleKeyDown = useCallback((e) => {
        const currentState = stateRef.current;

        // Spacebar logic
        if (e.code === 'Space') {
            e.preventDefault();
            if (e.repeat) return;

            initAudio();

            if (currentState === TIMER_STATE.RUNNING) {
                stopTimer();
            } else if (currentState === TIMER_STATE.IDLE || currentState === TIMER_STATE.STOPPED) {
                setTime(0);
                setTimerState(TIMER_STATE.HOLDING);
                // 0.5s hold time
                holdTimeoutRef.current = setTimeout(() => {
                    setTimerState(TIMER_STATE.READY);
                    playBeep();
                }, 500);
            }
        } else {
            // Any other key stops it
            if (currentState === TIMER_STATE.RUNNING) {
                stopTimer();
            }
        }
    }, [stopTimer, playBeep]);

    const handleKeyUp = useCallback((e) => {
        const currentState = stateRef.current;

        if (e.code === 'Space') {
            if (currentState === TIMER_STATE.READY) {
                startRef.current = performance.now();
                setTimerState(TIMER_STATE.RUNNING);
                frameRef.current = requestAnimationFrame(update);
            } else if (currentState === TIMER_STATE.HOLDING) {
                clearTimeout(holdTimeoutRef.current);
                setTimerState(TIMER_STATE.IDLE);
            }
        }
    }, [update]);

    // Touch handlers
    const handleTouchStart = useCallback((e) => {
        const currentState = stateRef.current;
        if (e.target.tagName === 'BUTTON') return;

        initAudio();

        if (currentState === TIMER_STATE.RUNNING) {
            stopTimer();
        } else if (currentState === TIMER_STATE.IDLE || currentState === TIMER_STATE.STOPPED) {
            setTime(0);
            setTimerState(TIMER_STATE.HOLDING);
            holdTimeoutRef.current = setTimeout(() => {
                setTimerState(TIMER_STATE.READY);
                playBeep();
            }, 500);
        }
    }, [playBeep, stopTimer]); // warning: dep array mixed, cleaning up to []

    const handleTouchEnd = useCallback((e) => {
        const currentState = stateRef.current;
        if (currentState === TIMER_STATE.READY) {
            startRef.current = performance.now();
            setTimerState(TIMER_STATE.RUNNING);
            frameRef.current = requestAnimationFrame(update);
        } else if (currentState === TIMER_STATE.HOLDING) {
            clearTimeout(holdTimeoutRef.current);
            setTimerState(TIMER_STATE.IDLE);
        }
    }, [update]);

    // Mouse handlers (same logic as touch)
    const handleMouseDown = useCallback((e) => {
        const currentState = stateRef.current;
        if (e.target.tagName === 'BUTTON') return;
        if (e.button !== 0) return; // Only left click

        initAudio();

        if (currentState === TIMER_STATE.RUNNING) {
            stopTimer();
        } else if (currentState === TIMER_STATE.IDLE || currentState === TIMER_STATE.STOPPED) {
            setTime(0);
            setTimerState(TIMER_STATE.HOLDING);
            holdTimeoutRef.current = setTimeout(() => {
                setTimerState(TIMER_STATE.READY);
                playBeep();
            }, 500);
        }
    }, [playBeep, stopTimer]);

    const handleMouseUp = useCallback((e) => {
        const currentState = stateRef.current;
        if (currentState === TIMER_STATE.READY) {
            startRef.current = performance.now();
            setTimerState(TIMER_STATE.RUNNING);
            frameRef.current = requestAnimationFrame(update);
        } else if (currentState === TIMER_STATE.HOLDING) {
            clearTimeout(holdTimeoutRef.current);
            setTimerState(TIMER_STATE.IDLE);
        }
    }, [update]);

    // Stable listeners
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
            if (holdTimeoutRef.current) clearTimeout(holdTimeoutRef.current);
        };
    }, [handleKeyDown, handleKeyUp]);

    return { time, timerState, formatTime, handleTouchStart, handleTouchEnd, handleMouseDown, handleMouseUp };
};
