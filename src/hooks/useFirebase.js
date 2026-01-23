import { useEffect, useState, useRef, useCallback } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { googleProvider } from '../lib/firebase';
import { ref, set, get, onValue, serverTimestamp, onDisconnect, push } from "firebase/database";
import { useGameState } from '../context/GameContext';

export function useFirebase() {
    const { state, dispatch } = useGameState();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Auth and Load from Firebase
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            if (u) {
                setUser(u);

                // Load save from Firebase
                try {
                    const saveRef = ref(db, `players/${u.uid}/save`);
                    const snap = await get(saveRef);
                    if (snap.exists()) {
                        const data = snap.val();
                        dispatch({ type: 'LOAD_SAVE', payload: data });
                        console.log("Save loaded from Firebase");
                    }
                } catch (e) {
                    console.error("Error loading save:", e);
                }

                setLoading(false);

                // Set presence ONCE on login
                const userStatusRef = ref(db, `/status/${u.uid}`);
                onDisconnect(userStatusRef).remove();
                set(userStatusRef, {
                    state: 'online',
                    lastSeen: serverTimestamp()
                });
            } else {
                setUser(null);
                setLoading(false);
            }
        });
        return () => unsub();
    }, [dispatch]); // Added dispatch dependency

    // Throttled Sync - INTERVAL BASED, not state-based
    const SYNC_INTERVAL = 15000; // 15 seconds
    const intervalRef = useRef(null);
    const stateRef = useRef(state);

    // Keep stateRef updated
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Single interval for syncing
    useEffect(() => {
        if (!user) return;

        const syncToFirebase = () => {
            const currentState = stateRef.current;
            if (!currentState.player) return;

            // Save game state
            const saveRef = ref(db, `players/${user.uid}/save`);
            set(saveRef, {
                player: currentState.player,
                resources: currentState.resources,
                machines: currentState.machines,
                stats: currentState.stats,
                inventory: currentState.inventory,
                equipment: currentState.equipment,
                outposts: currentState.outposts || {}
            });

            // Update Public Status (includes HP/Hunger for Duo sync)
            const statusRef = ref(db, `public/players/${user.uid}`);
            set(statusRef, {
                uid: user.uid,
                name: currentState.player.name,
                depth: currentState.player.depth,
                maxDepth: currentState.player.maxDepth || 0,
                gold: currentState.resources.gold || 0,
                level: currentState.player.level,
                hp: currentState.player.hp,
                maxHp: currentState.player.maxHp,
                hunger: currentState.player.hunger,
                maxHunger: currentState.player.maxHunger
            });
        };

        // Sync immediately on login
        syncToFirebase();

        // Then sync every 15 seconds
        intervalRef.current = setInterval(syncToFirebase, SYNC_INTERVAL);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [user]); // Only depends on user, not state

    // Also sync when depth changes significantly (every 100m)
    const lastDepthSync = useRef(0);
    useEffect(() => {
        if (!user) return;
        const currentDepth = state.player.depth;
        if (Math.abs(currentDepth - lastDepthSync.current) >= 100) {
            lastDepthSync.current = currentDepth;
            // Trigger immediate sync
            const saveRef = ref(db, `players/${user.uid}/save`);
            set(saveRef, {
                player: stateRef.current.player,
                resources: stateRef.current.resources,
                machines: stateRef.current.machines,
                stats: stateRef.current.stats,
                inventory: stateRef.current.inventory,
                equipment: stateRef.current.equipment,
                outposts: stateRef.current.outposts || {}
            });
        }
    }, [state.player.depth, user]);

    // Save on page unload (beforeunload)
    useEffect(() => {
        const handleUnload = () => {
            if (user && stateRef.current.player) {
                const saveRef = ref(db, `players/${user.uid}/save`);
                // Using navigator.sendBeacon would be better but set works for now
                set(saveRef, {
                    player: stateRef.current.player,
                    resources: stateRef.current.resources,
                    machines: stateRef.current.machines,
                    stats: stateRef.current.stats,
                    inventory: stateRef.current.inventory,
                    equipment: stateRef.current.equipment,
                    outposts: stateRef.current.outposts || {}
                });
            }
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, [user]);

    // Duo Listener - only when duo is active
    useEffect(() => {
        if (!state.player.duoId) return;

        const duoRef = ref(db, `public/players/${state.player.duoId}`);
        const unsub = onValue(duoRef, (snap) => {
            const data = snap.val();
            if (data) {
                dispatch({
                    type: 'SYNC_DUO',
                    payload: {
                        hp: (data.hp / data.maxHp) * 100,
                        hunger: (data.hunger / data.maxHunger) * 100,
                        depth: data.depth
                    }
                });
            }
        });
        return () => unsub();
    }, [state.player.duoId, dispatch]);

    // Inbox Listener
    useEffect(() => {
        if (!user) return;
        const inboxRef = ref(db, `public/players/${user.uid}/inbox`);

        const unsub = onValue(inboxRef, (snap) => {
            const data = snap.val();
            if (data) {
                Object.entries(data).forEach(([key, msg]) => {
                    dispatch({ type: 'PROCESS_INBOX', payload: msg });
                    set(ref(db, `public/players/${user.uid}/inbox/${key}`), null);
                });
            }
        });
        return () => unsub();
    }, [user, dispatch]);

    // Send Death Signal
    const [deathSent, setDeathSent] = useState(false);
    useEffect(() => {
        if (state.status.isDead && !deathSent && state.player.duoId) {
            sendToDuo('DIED');
            setDeathSent(true);
        }
        if (!state.status.isDead && deathSent) {
            setDeathSent(false);
        }
    }, [state.status.isDead, state.player.duoId, deathSent]);

    const sendToDuo = async (action, data = {}) => {
        if (!state.player.duoId || !user) return;
        try {
            const inboxRef = ref(db, `public/players/${state.player.duoId}/inbox`);
            await set(push(inboxRef), {
                type: action,
                sender: user.uid,
                ...data
            });
        } catch (e) {
            console.error("Duo Send Error:", e);
        }
    };

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Google Login Error:", error);
        }
    };

    const logout = () => signOut(auth);

    const listMarketItem = async (item, price) => {
        if (!user) return;
        const marketRef = ref(db, 'public/market');
        await set(push(marketRef), {
            sellerId: user.uid,
            sellerName: state.player.name,
            item: item,
            price: price
        });
    };

    const buyMarketItem = async (listingId, listing) => {
        if (!user) return;
        try {
            await set(ref(db, `public/market/${listingId}`), null);
            const inboxRef = ref(db, `public/players/${listing.sellerId}/inbox`);
            await set(push(inboxRef), {
                type: 'MARKET_SALE',
                item: listing.item,
                price: listing.price,
                buyer: state.player.name
            });
            return true;
        } catch (e) {
            console.error("Buy Error:", e);
            return false;
        }
    };

    const cancelMarketListing = async (listingId) => {
        if (!user) return;
        try {
            await set(ref(db, `public/market/${listingId}`), null);
            return true;
        } catch (e) {
            console.error("Cancel Listing Error:", e);
            return false;
        }
    };

    return { user, loading, loginWithGoogle, logout, sendToDuo, listMarketItem, buyMarketItem, cancelMarketListing };
}
