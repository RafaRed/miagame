import { useEffect } from 'react';
import { useGameState } from '../context/GameContext';
import { ITEMS } from '../lib/constants';

export function useGameLoop() {
    const { state, dispatch } = useGameState();

    useEffect(() => {
        const loop = setInterval(() => {
            // Tycoon Logic
            const machines = state.machines;
            const multiplier = 1 + (machines.generator * 0.2);

            let goldGain = 0;
            let inventoryChanges = []; // We might need a dispatch for inventory too

            // Excavator
            if (machines.excavator > 0) {
                goldGain += Math.floor(machines.excavator * 5 * multiplier);
                // Chance for Abyss Dust
                if (Math.random() < 0.2 * machines.excavator) {
                    // Logic for adding item would be complex in a pure loop
                    // Simplified: We'll handle passive item gains via specific actions later
                    // or add a "ADD_ITEM" action
                }
            }

            // Dispatch Tick
            if (goldGain > 0) {
                dispatch({ type: 'ADD_GOLD', payload: goldGain });
            }

            // Bank Interest
            // if (machines.bank > 0) ... (logic moved to separate faster loop or handled here)

        }, 10000); // 10s loop

        return () => clearInterval(loop);
    }, [state.machines, dispatch]);
}
