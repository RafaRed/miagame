import { useEffect } from 'react';
import { useGameState } from '../context/GameContext';
import { ITEMS } from '../lib/constants';

export function useGameLoop() {
    const { state, dispatch } = useGameState();

    useEffect(() => {
        const loop = setInterval(() => {
            // Tycoon Logic
            const machines = state.machines;
            const multiplier = 1 + (machines.generator || 0) * 0.2;

            let goldGain = 0;

            // Excavator
            if (machines.excavator > 0) {
                // Base 5 gold per excavator per tick
                goldGain += Math.floor(machines.excavator * 5 * multiplier);
            }

            // Bank Interest (1% of current gold per Bank level)
            if (machines.bank > 0 && state.resources.gold > 0) {
                const interestWrapper = Math.floor(state.resources.gold * (0.01 * machines.bank));
                goldGain += Math.min(interestWrapper, 1000); // Cap interest to prevent runaway
            }

            // Dispatch Tick
            dispatch({ type: 'TICK_PASSIVE', payload: { gold: goldGain } });

        }, 5000); // 5s loop for economy

        return () => clearInterval(loop);
    }, [state.machines, state.resources.gold]); // Optimized deps

    // Fast loop for visuals/combat/curse (100ms)
    useEffect(() => {
        const fastLoop = setInterval(() => {
            // Dispatch fast tick if there is anything to update (like curse)
            // We can read state inside dispatch usually or via ref, but here we just blindly dispatch 
            // and let reducer decide if it needs to update (optimization: check state first if possible, but context state is in scope)
            // To avoid spamming dispatch if intensity is 0, we can check state.
            if (state.status.curseIntensity > 0) {
                dispatch({ type: 'TICK_FAST' });
            }
        }, 200); // 200ms = 5 updates/sec. 100 -> 0 in 20 ticks (4s) if decay is 5.

        return () => clearInterval(fastLoop);
    }, [state.status.curseIntensity, dispatch]);
}
