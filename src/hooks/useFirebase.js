import { useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { googleProvider } from '../lib/firebase';
import { ref, set, onValue, serverTimestamp, onDisconnect, push } from "firebase/database";
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
                uid: user.uid,
                name: state.player.name,
                depth: state.player.depth,
                maxDepth: state.player.maxDepth || 0,
                gold: state.resources.gold || 0,
                level: state.player.level,
                hp: state.player.hp,
                maxHp: state.player.maxHp,
                hunger: state.player.hunger,
                maxHunger: state.player.maxHunger,
                lastSeen: serverTimestamp()
            });
        }
    }, [state, user]);

    // Duo Listener (Haku System)
    useEffect(() => {
        if (state.player.duoId) {
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
        }
    }, [state.player.duoId, dispatch]);

    // Inbox Listener (Lifeline Mechanics)
    useEffect(() => {
        if (!user) return;
        const inboxRef = ref(db, `public/players/${user.uid}/inbox`);

        // Listen for new child added
        const unsub = onValue(inboxRef, (snap) => {
            const data = snap.val();
            if (data) {
                Object.entries(data).forEach(([key, msg]) => {
                    // Dispatch to GameContext
                    dispatch({ type: 'PROCESS_INBOX', payload: msg });
                    // Delete message after processing to prevent loops
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
            setDeathSent(false); // Reset on respawn
        }
    }, [state.status.isDead, state.player.duoId, deathSent]);

    const sendToDuo = async (action, data = {}) => {
        if (!state.player.duoId) return;
        try {
            // Push to partner's inbox
            const inboxRef = ref(db, `public/players/${state.player.duoId}/inbox`);
            // Use push to generate unique ID
            await set(push(inboxRef), {
                type: action,
                sender: user.uid,
                timestamp: serverTimestamp(),
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
            price: price,
            timestamp: serverTimestamp()
        });
    };

    const buyMarketItem = async (listingId, listing) => {
        if (!user) return;
        // 1. Remove Listing (First come first serve)
        // Using a transaction would be better but simple set(null) is okay for prototype
        try {
            await set(ref(db, `public/market/${listingId}`), null);

            // 2. Send Geld to Seller Inbox
            const inboxRef = ref(db, `public/players/${listing.sellerId}/inbox`);
            await set(push(inboxRef), {
                type: 'MARKET_SALE',
                item: listing.item,
                price: listing.price,
                buyer: state.player.name,
                timestamp: serverTimestamp()
            });

            // 3. Dispatch local BUY (Must be handled by caller or here?)
            // Caller (UI) handles local state (deduct gold, add item)
            // But we should confirm success first.
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
