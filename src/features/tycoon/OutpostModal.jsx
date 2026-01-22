import React from 'react';
import { useGameState } from '../../context/GameContext';
import { Store, Flame, Box, Bot, ChevronUp, AlertTriangle } from 'lucide-react';
import { ITEMS } from '../../lib/constants';

export default function OutpostModal({ onClose }) {
    const { state, dispatch } = useGameState();
    const depthKey = Math.floor(state.player.depth);
    const outpost = state.outposts ? state.outposts[depthKey] : null;

    if (!outpost) return null;

    const handleRefuel = (type) => {
        // Dispatch REFUEL action
        // For MVP we can just dispatch generic action or specific
        dispatch({ type: 'REFUEL_OUTPOST', payload: { depth: depthKey, fuelType: type } });
    };

    const handleCollect = () => {
        dispatch({ type: 'COLLECT_OUTPOST', payload: { depth: depthKey } });
    };

    const handleInstall = () => {
        dispatch({ type: 'INSTALL_AUTOMATON', payload: { depth: depthKey } });
    };

    const hasAutomatonItem = state.inventory.some(i => i.id === 'clockwork_automaton');
    const hasFuelCan = state.inventory.some(i => i.id === 'fuel_canister');
    const hasScrap = state.inventory.some(i => i.id === 'scrap');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="max-w-md w-full bg-slate-900 border-2 border-indigo-500 rounded-lg p-6 shadow-[0_0_50px_rgba(99,102,241,0.2)]">

                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-indigo-900 pb-4">
                    <h2 className="text-2xl font-serif text-indigo-400 flex items-center gap-2">
                        <Store /> Entreposto ({outpost.depth}m)
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">FECHAR</button>
                </div>

                {/* Status */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-800 p-4 rounded border border-slate-700">
                        <div className="text-xs text-slate-400 uppercase mb-1">Combustível</div>
                        <div className="flex items-end gap-2 text-amber-500 font-mono text-xl">
                            <Flame size={24} className={outpost.fuel > 0 ? "animate-pulse" : "text-slate-600"} />
                            {outpost.fuel} <span className="text-xs text-slate-500 mb-1">unidades</span>
                        </div>
                        <div className="mt-2 flex gap-1">
                            <button
                                onClick={() => handleRefuel('scrap')}
                                disabled={!hasScrap}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-[10px] py-1 rounded text-white"
                                title="+10 Fuel (1 Sucata)"
                            >
                                +Sucata
                            </button>
                            <button
                                onClick={() => handleRefuel('canister')}
                                disabled={!hasFuelCan}
                                className="flex-1 bg-amber-900 hover:bg-amber-800 disabled:opacity-30 text-[10px] py-1 rounded text-amber-200"
                                title="+100 Fuel (1 Galão)"
                            >
                                +Galão
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800 p-4 rounded border border-slate-700">
                        <div className="text-xs text-slate-400 uppercase mb-1">Automação</div>
                        {outpost.automaton ? (
                            <div className="text-emerald-400 flex items-center gap-2">
                                <Bot size={20} /> ATIVO
                            </div>
                        ) : (
                            <div>
                                <div className="text-slate-500 flex items-center gap-2 mb-2">
                                    <Bot size={20} /> INATIVO
                                </div>
                                <button
                                    onClick={handleInstall}
                                    disabled={!hasAutomatonItem}
                                    className="w-full bg-cyan-900 hover:bg-cyan-800 disabled:opacity-30 text-[10px] py-1 rounded text-cyan-200"
                                >
                                    Instalar Autômato
                                </button>
                            </div>
                        )}
                        <p className="text-[9px] text-slate-500 mt-2 leading-tight">
                            Minera recursos automaticamente se houver combustível.
                        </p>
                    </div>
                </div>

                {/* Storage */}
                <div className="bg-slate-800/50 rounded border border-slate-700 p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2"><Box size={14} /> Armazém Local</h3>
                        <button
                            onClick={handleCollect}
                            disabled={!outpost.storage || outpost.storage.length === 0}
                            className="bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-emerald-100 text-xs px-3 py-1 rounded flex items-center gap-1"
                        >
                            <ChevronUp size={12} /> COLETAR TUDO
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                        {outpost.storage && outpost.storage.length > 0 ? (
                            outpost.storage.map((slot, i) => {
                                const item = ITEMS.find(it => it.id === slot.id);
                                return (
                                    <div key={i} className="bg-slate-900 aspect-square rounded flex flex-col items-center justify-center border border-slate-800 relative group" title={item?.name}>
                                        <div className={`w-6 h-6 rounded-full ${item?.color || 'bg-slate-700'}`}></div>
                                        <span className="text-[10px] text-slate-400 mt-1">x{slot.count}</span>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-span-4 text-center text-xs text-slate-600 py-4">Vazio</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
