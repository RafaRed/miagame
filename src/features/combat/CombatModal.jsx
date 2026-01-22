import React, { useEffect, useRef } from 'react';
import { useGameState } from '../../context/GameContext';
import { Sword, Shield, Footprints } from 'lucide-react';

export default function CombatModal() {
    const { state, dispatch } = useGameState();
    const { inCombat, currentMonster, combatLog } = state.status;
    const logRef = useRef(null);

    // Scroll log
    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [combatLog]);

    // Check Win/Loss conditions
    useEffect(() => {
        // Ensure monster exists before checking HP
        if (currentMonster && currentMonster.hp <= 0) {
            const timer = setTimeout(() => {
                dispatch({ type: 'COMBAT_WIN', payload: { gold: 100 } });
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [currentMonster?.hp, dispatch]);

    const handleAttack = () => {
        dispatch({ type: 'COMBAT_ROUND', payload: { action: 'ATTACK' } });
    };

    const handleFlee = () => {
        if (Math.random() > 0.5) {
            dispatch({ type: 'COMBAT_FLEE' });
        } else {
            dispatch({ type: 'COMBAT_ROUND', payload: { action: 'WAIT' } });
        }
    };

    if (!inCombat || !currentMonster) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-shake">
            <div className="max-w-xl w-full bg-abyss-900 border-2 border-red-900 rounded-lg p-6 shadow-[0_0_50px_rgba(220,38,38,0.3)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-serif text-red-500 animate-pulse">{currentMonster.name}</h2>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs uppercase">Poder do Abismo</p>
                        <p className="text-xl font-mono text-red-400">{currentMonster.power}</p>
                    </div>
                </div>

                {/* Visual Representation (HP Bars) */}
                <div className="space-y-6 mb-8">
                    {/* Monster HP */}
                    <div>
                        <div className="flex justify-between text-xs text-red-300 font-bold mb-1">
                            <span>INIMIGO</span>
                            <span>{currentMonster.hp} / {currentMonster.maxHp}</span>
                        </div>
                        <div className="h-4 bg-red-950 rounded-full overflow-hidden border border-red-900">
                            <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${(currentMonster.hp / currentMonster.maxHp) * 100}%` }}></div>
                        </div>
                    </div>

                    {/* Combat Log */}
                    <div ref={logRef} className="h-32 bg-black/50 rounded border border-slate-800 p-3 overflow-y-auto text-xs font-mono space-y-1 text-slate-300">
                        {combatLog.map((log, i) => (
                            <div key={i} className="border-l-2 border-slate-700 pl-2">{log}</div>
                        ))}
                    </div>

                    {/* Player HP */}
                    <div>
                        <div className="flex justify-between text-xs text-emerald-300 font-bold mb-1">
                            <span>VOCÊ</span>
                            <span>{state.player.hp} / {state.player.maxHp}</span>
                        </div>
                        <div className="h-4 bg-emerald-950 rounded-full overflow-hidden border border-emerald-900">
                            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${(state.player.hp / state.player.maxHp) * 100}%` }}></div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleAttack}
                        className="bg-red-800 hover:bg-red-700 text-white font-bold py-4 rounded border-b-4 border-red-950 active:border-b-0 active:translate-y-1 transition text-xl flex items-center justify-center gap-2"
                    >
                        <Sword /> ATACAR
                    </button>
                    <button
                        onClick={handleFlee}
                        className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-4 rounded border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition flex items-center justify-center gap-2"
                    >
                        <Footprints /> FUGIR
                    </button>
                </div>
            </div>
        </div>
    );
}
