import React from 'react';
import { useGameState } from '../../context/GameContext';
import { Skull, Gift, Eye } from 'lucide-react';

export default function EventModal() {
    const { state, dispatch } = useGameState();
    const event = state.status.currentEvent;

    if (!event) return null;

    const handleClose = () => {
        dispatch({ type: 'CLEAR_EVENT' });
    };

    const handleAction = () => {
        // Handle specific event logic (Accept loot, Start combat)
        if (event.type === 'LOOT') {
            dispatch({ type: 'BUY_ITEM', payload: { item: event.data, cost: 0 } }); // Free item
            // dispatch({ type: 'ADD_LOG', payload: ... })
        }
        if (event.type === 'COMBAT') {
            dispatch({ type: 'COMBAT_START', payload: event.data });
        }
        handleClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-abyss-900 border border-slate-600 p-6 rounded-lg max-w-md w-full shadow-2xl relative text-center">
                <div className="mb-4 flex justify-center text-relic-gold">
                    {event.type === 'COMBAT' && <Skull size={48} className="animate-pulse" />}
                    {event.type === 'LOOT' && <Gift size={48} className="animate-bounce" />}
                    {event.type === 'INTERACTION' && <Eye size={64} className="text-purple-400 drop-shadow-glow animate-pulse" />}
                    {event.type === 'FLAVOR' && <Eye size={48} className="opacity-50" />}
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-2 uppercase tracking-widest">
                    {event.type === 'COMBAT' ? 'Perigo!' : event.type === 'LOOT' ? 'Descoberta!' : event.type === 'INTERACTION' ? event.data.name : '...'}
                </h3>

                <p className="text-slate-300 mb-6 italic">"{event.text}"</p>

                {event.type === 'COMBAT' && (
                    <div className="bg-red-900/30 p-2 rounded mb-4 border border-red-900/50">
                        <p className="text-red-300 font-bold">{event.data.name}</p>
                        <p className="text-xs text-red-400">Poder: {event.data.power}</p>
                    </div>
                )}

                <div className="flex gap-2 justify-center flex-wrap">
                    {event.type === 'INTERACTION' ? (
                        event.data.options.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    dispatch({ type: 'INTERACT_NPC', payload: { npcId: event.data.id, optionId: opt.id, cost: opt.cost, reward: opt.reward } });
                                    handleClose();
                                }}
                                className="bg-purple-900 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition border border-purple-500 flex flex-col items-center min-w-[120px]"
                                title={opt.text}
                            >
                                <span className="text-sm">{opt.label}</span>
                                <span className="text-[10px] text-purple-300 md:block hidden">{opt.costLabel}</span>
                            </button>
                        ))
                    ) : (
                        event.type !== 'FLAVOR' && (
                            <button
                                onClick={handleAction}
                                className="bg-slate-100 hover:bg-white text-slate-900 font-bold py-2 px-6 rounded transition"
                            >
                                {event.type === 'COMBAT' ? 'LUTAR' : 'PEGAR'}
                            </button>
                        )
                    )}

                    <button
                        onClick={handleClose}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold py-2 px-6 rounded transition border border-slate-700"
                    >
                        {event.type === 'COMBAT' ? 'FUGIR' : event.type === 'INTERACTION' ? 'SAIR' : 'IGNORAR'}
                    </button>
                </div>
            </div>
        </div>
    );
}
