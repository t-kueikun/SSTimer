import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, serverTimestamp, writeBatch, where } from 'firebase/firestore';

const STORAGE_KEY = 'ss-timer-solves-v2';

export const useSolves = (currentEventId, currentSessionId = 1) => {
    const { currentUser } = useAuth();
    const [localSolves, setLocalSolves] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    });

    const [firestoreSolves, setFirestoreSolves] = useState([]);

    // Local Storage Effect
    useEffect(() => {
        if (!currentUser) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localSolves));
        }
    }, [localSolves, currentUser]);

    // Firestore Subscription
    useEffect(() => {
        if (currentUser) {
            // Index-free query: Just filter by eventId and sessionId
            const q = query(
                collection(db, `users/${currentUser.uid}/solves`),
                where("eventId", "==", currentEventId),
                where("sessionId", "==", currentSessionId)
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const fetched = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    date: doc.data().date?.toDate ? doc.data().date.toDate().toISOString() : doc.data().date
                }));

                // Sort by date desc (newest first)
                fetched.sort((a, b) => new Date(b.date) - new Date(a.date));

                setFirestoreSolves(fetched);
            }, (error) => {
                console.error("Firestore Error:", error);
                // Alert user if it's a permission issue
                if (error.code === 'permission-denied') {
                    alert("Error: Firestore Permission Denied. Check your Firebase Rules.");
                } else {
                    alert(`Sync Error: ${error.message}`);
                }
            });

            return () => unsubscribe();
        } else {
            setFirestoreSolves([]);
        }
    }, [currentUser, currentEventId, currentSessionId]);

    // Unified solves list
    // Local storage key needs to be composite or structure changed.
    // To minimize breaking changes for local, we just filter local solves if they have sessionId (backward compat)
    // Or we stick to 1 session for local if simple.
    // Let's implement local filtering too.
    const allLocalCurrentEvent = localSolves[currentEventId] || [];
    const localFiltered = allLocalCurrentEvent.filter(s => (s.sessionId || 1) === currentSessionId);

    const solves = currentUser ? firestoreSolves : localFiltered;

    const addSolve = async (time) => {
        const newSolve = {
            time,
            date: new Date().toISOString(),
            eventId: currentEventId,
            sessionId: currentSessionId
        };

        if (currentUser) {
            // Save to Firestore
            try {
                // Use serverTimestamp for server consistency, but we also keep string for display simplicity for now
                await addDoc(collection(db, `users/${currentUser.uid}/solves`), {
                    ...newSolve,
                    date: new Date() // Firestore Date
                });
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        } else {
            // Save locally
            setLocalSolves(prev => ({
                ...prev,
                [currentEventId]: [{ ...newSolve, id: Date.now() }, ...(prev[currentEventId] || [])]
            }));
        }
    };

    const clearSession = async () => {
        if (!confirm(`Clear all solves for ${currentEventId} (Session ${currentSessionId})?`)) return;

        if (currentUser) {
            // Delete all for this event in Firestore (Batch delete)
            // Note: Batch limit is 500. For now simple loop or small batch.
            const batch = writeBatch(db);
            firestoreSolves.forEach(s => {
                const ref = doc(db, `users/${currentUser.uid}/solves`, s.id);
                batch.delete(ref);
            });
            await batch.commit();
        } else {
            setLocalSolves(prev => ({
                ...prev,
                [currentEventId]: []
            }));
        }
    };

    const removeSolve = async (id) => {
        if (currentUser) {
            await deleteDoc(doc(db, `users/${currentUser.uid}/solves`, id));
        } else {
            setLocalSolves(prev => ({
                ...prev,
                [currentEventId]: (prev[currentEventId] || []).filter(s => s.id !== id)
            }));
        }
    };

    return { solves, addSolve, clearSession, removeSolve };
};
