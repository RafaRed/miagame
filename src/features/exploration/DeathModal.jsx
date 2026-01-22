import React from 'react';
import { useGameState } from '../../context/GameContext';
import { Skull } from 'lucide-react';

export default function DeathModal() {
    const { state, dispatch } = useGameState();

    if (!state.status.isDead) return null;

    const handleRespawn = () => {
        dispatch({ type: 'RESPAWN' });
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-fade-in p-8 text-center bg-[url('https://images.unsplash.com/photo-1629814249584-bd4d53cf0e7d?auto=format&fit=crop&q=80')] bg-cover bg-center before:content-[''] before:absolute before:inset-0 before:bg-black/90">
            <div className="relative z-10 flex flex-col items-center">
                <Skull size={80} className="text-red-600 mb-6 animate-pulse" />
                <h1 className="text-5xl font-serif text-red-600 font-bold mb-2 uppercase tracking-[0.2em] font-shadow-lg">Você Morreu</h1>
                <p className="text-slate-400 text-lg mb-8 italic max-w-lg">
                    "O Abismo não perdoa. Sua jornada termina aqui... por enquanto."
                </p>

                <div className="bg-red-950/20 p-4 rounded border border-red-900/50 mb-8 w-full max-w-sm">
                    <div className="flex justify-between text-slate-300 text-sm mb-2">
                        <span>Profundidade Alcançada:</span>
                        <span className="text-red-400 font-mono">{state.player.depth}m</span>
                    </div>
                    <div className="flex justify-between text-slate-300 text-sm">
                        <span>Ouro Perdido:</span>
                        <span className="text-red-400 font-mono">{Math.floor(state.resources.gold * 0.5)}</span>
                    </div>
                </div>

                <button
                    onClick={handleRespawn}
                    className="group relative px-8 py-3 bg-transparent overflow-hidden rounded-lg font-bold text-slate-200 transition-all hover:text-white border border-red-800 hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                >
                    <div className="absolute inset-0 w-0 bg-gradient-to-r from-red-600/20 to-transparent transition-all duration-[250ms] ease-out group-hover:w-full"></div>
                    <span className="relative flex items-center gap-2 uppercase tracking-widest text-sm">
                        Renascer na Superfície
                    </span>
                </button>
            </div>
        </div>
    );
}
