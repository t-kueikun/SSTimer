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

export const useTimer = (onSolveComplete, onSwipeDown) => {
    const [time, setTime] = useState(0);
    const [timerState, setTimerState] = useState(TIMER_STATE.IDLE);

    // Refs to access latest state in stable event listeners
    const stateRef = useRef(TIMER_STATE.IDLE);
    const startRef = useRef(null);
    const frameRef = useRef(null);
    const holdTimeoutRef = useRef(null);
    const onSolveCompleteRef = useRef(onSolveComplete);
    const onSwipeDownRef = useRef(onSwipeDown);

    // Swipe detection refs
    const touchStartRef = useRef(null);
    const isSwipeRef = useRef(false);

    // Keep callback refs updated
    useEffect(() => {
        onSolveCompleteRef.current = onSolveComplete;
        onSwipeDownRef.current = onSwipeDown;
    }, [onSolveComplete, onSwipeDown]);

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
                // Prevent accidental stops under 300ms (debounce)
                if (performance.now() - startRef.current < 300) return;
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
                if (performance.now() - startRef.current < 300) return;
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
        const touch = e.touches[0];
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
        isSwipeRef.current = false;

        initAudio();

        if (currentState === TIMER_STATE.RUNNING) {
            if (performance.now() - startRef.current < 300) return;
            stopTimer();
        } else if (currentState === TIMER_STATE.IDLE || currentState === TIMER_STATE.STOPPED) {
            setTime(0);
            setTimerState(TIMER_STATE.HOLDING);
            holdTimeoutRef.current = setTimeout(() => {
                // If it became a swipe, don't go to READY
                if (!isSwipeRef.current) {
                    setTimerState(TIMER_STATE.READY);
                    playBeep();
                }
            }, 500);
        }
    }, [playBeep, stopTimer]);

    // ... omit handleTouchMove/End - need to match start/end lines to preserve existing code if I am not replacing it.
    // I will replace handleKeyDown through handleMouseDown to cover all 3.

    const handleTouchMove = useCallback((e) => {
        if (!touchStartRef.current) return;

        const touch = e.touches[0];
        const dy = touch.clientY - touchStartRef.current.y;
        const dx = touch.clientX - touchStartRef.current.x;

        // Debug log
        console.log("Touch move:", dx, dy);

        // Detect Downward Swipe (Relaxed: > 50px vertical, < 80px horizontal deviation)
        // Ensure effective swipe is downwards
        if (dy > 50 && Math.abs(dx) < 80) {
            if (!isSwipeRef.current) {
                isSwipeRef.current = true;
                console.log("Swipe Down Detected!");

                // Cancel dragging/holding logic
                if (stateRef.current === TIMER_STATE.HOLDING) {
                    clearTimeout(holdTimeoutRef.current);
                    setTimerState(TIMER_STATE.IDLE);
                }
                // Trigger callback
                if (onSwipeDownRef.current) {
                    if (navigator.vibrate) navigator.vibrate(50);
                    onSwipeDownRef.current();
                }
            }
        }
    }, []); // No dependencies needed as it uses refs

    const handleTouchEnd = useCallback((e) => {
        const currentState = stateRef.current;

        if (isSwipeRef.current) {
            touchStartRef.current = null;
            isSwipeRef.current = false;
            return;
        }

        if (currentState === TIMER_STATE.READY) {
            startRef.current = performance.now();
            setTimerState(TIMER_STATE.RUNNING);
            frameRef.current = requestAnimationFrame(update);
        } else if (currentState === TIMER_STATE.HOLDING) {
            clearTimeout(holdTimeoutRef.current);
            setTimerState(TIMER_STATE.IDLE);
        }

        touchStartRef.current = null;
    }, [update]);

    // Mouse handlers (same logic as touch)
    const handleMouseDown = useCallback((e) => {
        const currentState = stateRef.current;
        if (e.target.tagName === 'BUTTON') return;
        // Ignore interactions with UI elements
        if (e.target.closest('button, input, select, a, [role="button"], .settings-modal, .interactive, .header-bar, .left-panel, .right-panel')) return;
        if (e.button !== 0) return; // Only left click

        initAudio();

        // Capture start position for drag detection
        touchStartRef.current = { x: e.clientX, y: e.clientY };
        isSwipeRef.current = false;

        if (currentState === TIMER_STATE.RUNNING) {
            if (performance.now() - startRef.current < 300) return;
            stopTimer();
        } else if (currentState === TIMER_STATE.IDLE || currentState === TIMER_STATE.STOPPED) {
            setTime(0);
            setTimerState(TIMER_STATE.HOLDING);
            holdTimeoutRef.current = setTimeout(() => {
                if (!isSwipeRef.current) {
                    setTimerState(TIMER_STATE.READY);
                    playBeep();
                }
            }, 500);
        }
    }, [playBeep, stopTimer]);

    const handleMouseMove = useCallback((e) => {
        // Only process if mouse is down (we have a start pos)
        if (!touchStartRef.current) return;

        // If left button is not held, clear ref (safety for mouse up outside window)
        if ((e.buttons & 1) === 0) {
            touchStartRef.current = null;
            return;
        }

        const dy = e.clientY - touchStartRef.current.y;
        const dx = e.clientX - touchStartRef.current.x;

        // Same threshold as touch
        if (dy > 50 && Math.abs(dx) < 80) {
            if (!isSwipeRef.current) {
                isSwipeRef.current = true;
                console.log("Mouse Swipe Down Detected!");

                if (stateRef.current === TIMER_STATE.HOLDING) {
                    clearTimeout(holdTimeoutRef.current);
                    setTimerState(TIMER_STATE.IDLE);
                }
                if (onSwipeDownRef.current) {
                    onSwipeDownRef.current();
                }
            }
        }
    }, []);

    const handleMouseUp = useCallback((e) => {
        const currentState = stateRef.current;

        if (isSwipeRef.current) {
            touchStartRef.current = null;
            isSwipeRef.current = false;
            return;
        }

        if (currentState === TIMER_STATE.READY) {
            startRef.current = performance.now();
            setTimerState(TIMER_STATE.RUNNING);
            frameRef.current = requestAnimationFrame(update);
        } else if (currentState === TIMER_STATE.HOLDING) {
            clearTimeout(holdTimeoutRef.current);
            setTimerState(TIMER_STATE.IDLE);
        }

        touchStartRef.current = null;
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
            // Cleanup manual touch listeners if any (removed)
            const cleanupTouch = () => {
                window.removeEventListener('touchstart', handleTouchStart);
                window.removeEventListener('touchmove', handleTouchMove);
                window.removeEventListener('touchend', handleTouchEnd);
            };
            cleanupTouch();
        };
    }, [handleKeyDown, handleKeyUp]);

    return { time, timerState, formatTime, handleKeyDown, handleKeyUp, handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp };
};
