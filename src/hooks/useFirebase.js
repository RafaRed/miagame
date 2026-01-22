import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { googleProvider } from '../lib/firebase';
import { ref, set, onValue, serverTimestamp, onDisconnect } from "firebase/database";
import { useGameState } from '../context/GameContext';

export function useFirebase() {
    const { state, dispatch } = useGameState();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auth & Presence
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) {
                setUser(u);
                setLoading(false);
                // Presence System
                const userStatusRef = ref(db, `/status/${u.uid}`);
                const connectedRef = ref(db, '.info/connected');

                onValue(connectedRef, (snap) => {
                    if (snap.val() === true) {
                        onDisconnect(userStatusRef).remove();
                        set(userStatusRef, {
                            name: state.player.name,
                            depth: state.player.depth,
                            lastSeen: serverTimestamp(),
                            state: 'online'
                        });
                    }
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsub();
    }, [state.player.name, state.player.depth]);

    // Sync / Save & Public Status
    useEffect(() => {
        if (user && state.player) {
            // Save game state
            const saveRef = ref(db, `players/${user.uid}/save`);
            set(saveRef, {
                player: state.player,
                resources: state.resources,
                machines: state.machines,
                stats: state.stats,
                inventory: state.inventory,
                timestamp: serverTimestamp()
            });

            // Update Public Status (Position for Co-op)
            const statusRef = ref(db, `public/players/${user.uid}`);
            set(statusRef, {
                name: state.player.name,
                depth: state.player.depth,
                level: state.player.level,
                lastSeen: serverTimestamp()
            });
        }
    }, [state, user]);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Login Error:", error);
        }
    };

    const logout = () => signOut(auth);

    return { user, loading, loginWithGoogle, logout };
}
