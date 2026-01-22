import React, { useState } from 'react';
import { useGameState } from '../../context/GameContext';
import { ArrowDown, ArrowUp, Hammer, Store } from 'lucide-react';
import ShopPanel from '../tycoon/ShopPanel';
import CraftingPanel from '../inventory/CraftingPanel';
import { generateEvent } from '../../utils/eventSystem';

const ProgressBar = ({ value, max, color, label, icon }) => {
    const percentage = Math.max(0, Math.min(100, (value / max) * 100));
    return (
        <div className="mb-2">
            <div className="flex justify-between text-[10px] mb-1 font-bold uppercase tracking-wider">
                <span className={`${color} flex items-center gap-1`}>{icon} {label}</span>
                <span className="text-slate-400">{Math.ceil(value)}/{max}</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden shadow-inner border border-slate-900 relative">
                <div
                    className={`h-full transition-all duration-300 ${label === 'Saúde' ? 'bg-rose-600' : 'bg-amber-500'} shadow-[0_0_10px_currentColor]`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default function StatusPanel() {
    const { state, dispatch } = useGameState();
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");

    const [showShop, setShowShop] = useState(false);
    const [showCrafting, setShowCrafting] = useState(false);

    const handleStartEdit = () => {
        setTempName(state.player.name);
        setIsEditingName(true);
    };

    const handleNameSubmit = () => {
        if (tempName.trim()) {
            dispatch({ type: 'SET_NAME', payload: tempName.trim() });
        }
        setIsEditingName(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleNameSubmit();
        } else if (e.key === 'Escape') {
            setIsEditingName(false);
        }
    };

    const handleDescend = () => {
        dispatch({ type: 'DESCEND', payload: { amount: 10, cost: 2 } });

        // Trigger Event
        const event = generateEvent(state.player.depth + 10);
        if (event.type === 'LOOT') {
            dispatch({ type: 'LOOT_FOUND', payload: { item: event.data } });
            // dispatch({ type: 'ADD_LOG', payload: `Você encontrou ${event.data.name}!` }); // Reducer already handles this
        } else if (event.type === 'FLAVOR') {
            dispatch({ type: 'ADD_LOG', payload: event.text });
        } else if (event.type === 'COMBAT') {
            dispatch({ type: 'TRIGGER_EVENT', payload: event });
        } else if (event.type === 'RELIC') {
            dispatch({ type: 'LOOT_FOUND', payload: { item: event.data } }); // Treat relic as regular loot for now to skip modal
            // dispatch({ type: 'TRIGGER_EVENT', payload: event });
        }
    };

    const handleAscend = () => {
        if (state.player.depth <= 0) return;

        // Curse Logic
        const damage = Math.floor(Math.random() * 5) + 5; // Base damage
        dispatch({ type: 'TAKE_DAMAGE', payload: damage });
        dispatch({ type: 'ADD_LOG', payload: `A Maldição do Abismo te atinge! -${damage} HP` });

        dispatch({ type: 'ASCEND', payload: { amount: 50 } });
    };
    return (
        <div className="flex flex-col h-full">
            {/* Player Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 relative group transition hover:border-slate-500">
                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center shadow-[0_0_10px_red]">
                    <span className="text-white text-xs font-bold">R</span>
                </div>
                <div className="flex-1 overflow-hidden">
                    {isEditingName ? (
                        <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            onBlur={handleNameSubmit}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            maxLength={12}
                            className="bg-slate-900 text-white font-bold text-lg border-b border-indigo-500 outline-none w-full px-1"
                        />
                    ) : (
                        <h2
                            onClick={handleStartEdit}
                            className="font-bold text-lg text-slate-100 truncate cursor-pointer hover:text-indigo-400 transition-colors"
                            title="Clique para alterar nome"
                        >
                            {state.player.name}
                        </h2>
                    )}
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Apito Vermelho</span>
                </div>
            </div>

            {/* Stats */}
            <div className="space-y-3 mb-4 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                <ProgressBar value={state.player.hp} max={state.player.maxHp} color="text-rose-500" label="Saúde" icon="♥" />
                <ProgressBar value={state.player.hunger} max={state.player.maxHunger} color="text-amber-500" label="Fome" icon="♨" />

                <div className="grid grid-cols-2 gap-2 pt-2 mt-1">
                    <div className="bg-slate-900 p-2 rounded text-center border border-slate-800">
                        <span className="block text-slate-500 text-[10px] uppercase">Poder</span>
                        <span className="font-bold text-slate-200 text-sm">10 CP</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded text-center border border-slate-800">
                        <span className="block text-slate-500 text-[10px] uppercase">Orth</span>
                        <span className="font-bold text-relic-gold text-sm">{state.resources.gold}</span>
                    </div>
                </div>
            </div>

            {/* Tycoon Summary */}
            <div className="mb-4 bg-slate-800/50 rounded-lg p-3 border border-indigo-900/30">
                <h4 className="text-[10px] uppercase font-bold text-indigo-400 mb-2">Base Tycoon</h4>
                <div className="text-xs space-y-1 text-slate-400">
                    <div className="flex justify-between">
                        <span>Escavadeiras</span>
                        <span className="text-white">{state.machines.excavator}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Refinarias</span>
                        <span className="text-white">{state.machines.refinery}</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-auto grid grid-cols-2 gap-2">
                <button
                    onClick={handleDescend}
                    className="col-span-2 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 p-3 rounded-lg font-bold shadow-lg border-b-4 border-indigo-950 active:border-b-0 active:translate-y-1 transition group relative overflow-hidden flex items-center justify-center gap-2 text-white"
                >
                    <ArrowDown size={16} /> MERGULHAR
                </button>
                <button
                    onClick={handleAscend}
                    className="bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-xs font-bold border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition text-rose-300 flex items-center justify-center gap-1"
                >
                    <ArrowUp size={14} /> SUBIR
                </button>
                <button
                    onClick={() => setShowCrafting(true)}
                    className="bg-purple-900 hover:bg-purple-800 p-2 rounded-lg text-xs font-bold border-b-4 border-purple-950 active:border-b-0 active:translate-y-1 transition text-purple-200 flex items-center justify-center gap-1"
                >
                    <Hammer size={14} />
                </button>
                <button
                    onClick={() => setShowShop(true)}
                    disabled={state.player.depth > 0}
                    className={`col-span-2 p-2 rounded-lg text-xs font-bold border-b-4 active:border-b-0 active:translate-y-1 transition flex items-center justify-center gap-2 ${state.player.depth > 0
                        ? 'bg-slate-800 text-slate-500 border-slate-900 cursor-not-allowed opacity-50'
                        : 'bg-amber-800 hover:bg-amber-700 text-amber-100 border-amber-950'
                        }`}
                    title={state.player.depth > 0 ? "Apenas na superfície (0m)" : "Acessar Loja"}
                >
                    <Store size={14} /> LOJA {state.player.depth > 0 && <span>(SUPERFÍCIE APENAS)</span>}
                </button>
            </div>

            {showShop && <ShopPanel onClose={() => setShowShop(false)} />}
            {showCrafting && <CraftingPanel onClose={() => setShowCrafting(false)} />}
        </div >
    );
}
