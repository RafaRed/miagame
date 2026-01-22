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
            if (goldGain > 0) {
                dispatch({ type: 'TICK_PASSIVE', payload: { gold: goldGain } });
            }

        }, 5000); // 5s loop for faster feedback

        return () => clearInterval(loop);
    }, [state.machines, dispatch]);
}
