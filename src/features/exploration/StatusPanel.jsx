import React, { useState } from 'react';
import { useGameState } from '../../context/GameContext';
import { ArrowDown, ArrowUp, Hammer, Store, Book } from 'lucide-react';
import ShopPanel from '../tycoon/ShopPanel';
import CraftingPanel from '../inventory/CraftingPanel';
import RelicBookModal from '../encyclopedia/RelicBookModal';
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
    const [showBook, setShowBook] = useState(false);

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

    // Whistle Logic
    const getWhistleRank = (depth) => {
        if (depth < 1350) return { name: "Apito Vermelho", color: "bg-red-500", shadow: "shadow-red-500/50" };
        if (depth < 2600) return { name: "Apito Azul", color: "bg-blue-600", shadow: "shadow-blue-600/50" };
        if (depth < 7000) return { name: "Apito da Lua", color: "bg-purple-600", shadow: "shadow-purple-600/50" };
        if (depth < 12000) return { name: "Apito Preto", color: "bg-slate-900", shadow: "shadow-black/50" };
        return { name: "Apito Branco", color: "bg-white", shadow: "shadow-white/50" };
    };

    const whistle = getWhistleRank(state.player.maxDepth); // Rank based on deepest achievement

    const handleDescend = () => {
        dispatch({ type: 'DESCEND', payload: { amount: 50, cost: 2 } }); // Double distance, reasonable cost

        // Trigger Event
        const event = generateEvent(state.player.depth + 50);
        if (event.type === 'LOOT' || event.type === 'RELIC') { // Handle Relic event type
            dispatch({ type: 'LOOT_FOUND', payload: { item: event.data } });
        } else if (event.type === 'FLAVOR') {
            dispatch({ type: 'ADD_LOG', payload: event.text });
        } else if (event.type === 'COMBAT' || event.type === 'INTERACTION') {
            dispatch({ type: 'TRIGGER_EVENT', payload: event });
        }
    };

    const handleAscend = () => {
        if (state.player.depth <= 0) return;

        // Curse Logic scaled by Depth
        // Layer 1 (0-1350): Minimal damage (Nausea)
        // Layer 2+: Real damage
        let damage = 0;
        const depth = state.player.depth;

        if (depth < 1350) damage = Math.floor(Math.random() * 3); // 0-2
        else if (depth < 2600) damage = Math.floor(Math.random() * 5) + 5; // 5-10
        else damage = Math.floor(Math.random() * 10) + 10; // 10-20

        dispatch({ type: 'ASCEND', payload: { amount: 50, cost: 2 } }); // Slower climb but fair hunger

        if (damage > 0) {
            dispatch({ type: 'TAKE_DAMAGE', payload: damage });
            dispatch({ type: 'ADD_LOG', payload: `A Maldição do Abismo te atinge! -${damage} HP` });
        } else {
            dispatch({ type: 'ADD_LOG', payload: `Você sobe com tontura leve.` });
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Player Info */}
            <div className={`flex items-center gap-3 mb-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 relative group transition hover:border-slate-500`}>
                <div className={`w-10 h-10 rounded-full ${whistle.color} flex items-center justify-center shadow-[0_0_15px_currentColor] ${whistle.shadow} transition-all duration-500 border border-white/20`}>
                    <span className={`text-[10px] font-bold uppercase ${whistle.name === 'Apito Branco' ? 'text-slate-900' : 'text-white'}`}>
                        {whistle.name.split(' ')[1][0]}
                    </span>
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
                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">{whistle.name}</span>
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
            <div className="mt-auto grid grid-cols-4 gap-2">
                <button
                    onClick={handleDescend}
                    className="col-span-4 bg-gradient-to-r from-blue-800 to-indigo-900 hover:from-blue-700 hover:to-indigo-800 p-3 rounded-lg font-bold shadow-lg border-b-4 border-indigo-950 active:border-b-0 active:translate-y-1 transition group relative overflow-hidden flex items-center justify-center gap-2 text-white"
                >
                    <ArrowDown size={16} /> MERGULHAR
                </button>
                <button
                    onClick={handleAscend}
                    className="col-span-2 bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-xs font-bold border-b-4 border-slate-950 active:border-b-0 active:translate-y-1 transition text-rose-300 flex items-center justify-center gap-1"
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
                    onClick={() => setShowBook(true)}
                    className="bg-amber-900 hover:bg-amber-800 p-2 rounded-lg text-xs font-bold border-b-4 border-amber-950 active:border-b-0 active:translate-y-1 transition text-amber-200 flex items-center justify-center gap-1"
                    title="Enciclopédia"
                >
                    <Book size={14} />
                </button>
                <button
                    onClick={() => setShowShop(true)}
                    disabled={state.player.depth > 0}
                    className={`col-span-4 p-2 rounded-lg text-xs font-bold border-b-4 active:border-b-0 active:translate-y-1 transition flex items-center justify-center gap-2 ${state.player.depth > 0
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
            {showBook && <RelicBookModal onClose={() => setShowBook(false)} />}
        </div>
    );
}
