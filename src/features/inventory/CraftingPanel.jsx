import React, { useState } from 'react';
import { useGameState } from '../../context/GameContext';
import {
    Hammer, Backpack, Utensils,
    Cog, Wind, Bone, Hexagon, Cross, Drumstick, Box, Shapes, Sun, Compass, Gavel
} from 'lucide-react';
import { ITEMS, RECIPES } from '../../lib/constants';

const IconMap = {
    'cog': Cog, 'wind': Wind, 'bone': Bone, 'bread-slice': Hexagon, 'first-aid': Cross,
    'drumstick': Drumstick, 'utensils': Utensils, 'box': Box, 'shapes': Shapes, 'sun': Sun,
    'hammer': Hammer, 'compass': Compass, 'gavel': Gavel, 'heart': Utensils, 'triangle': Shapes, 'zap': Wind
};

export default function CraftingPanel({ onClose }) {
    const { state, dispatch } = useGameState();
    const [tab, setTab] = useState('inventory');

    const canCraft = (recipe) => {
        const counts = {};
        state.inventory.forEach(item => {
            const id = typeof item === 'string' ? item : item.id;
            const qty = typeof item === 'string' ? 1 : (item.count || 1);
            counts[id] = (counts[id] || 0) + qty;
        });
        return Object.entries(recipe.req).every(([id, count]) => (counts[id] || 0) >= count);
    };

    const handleCraft = (recipe) => {
        if (canCraft(recipe)) {
            dispatch({ type: 'CRAFT_ITEM', payload: { recipe } });
        }
    };

    const handleUse = (itemEntry, idx) => {
        const itemId = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
        const item = ITEMS.find(i => i.id === itemId);
        if (item && item.type === 'consumable') {
            dispatch({ type: 'USE_ITEM', payload: { item, index: idx } });
        }
    };

    return (
        <div className="absolute inset-0 z-40 bg-abyss-950/95 backdrop-blur-xl flex flex-col animate-fade-in text-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-purple-900 flex justify-between items-center bg-purple-950/20">
                <h2 className="text-purple-300 font-serif text-2xl flex items-center gap-2">
                    <Hammer className="text-purple-400" /> Oficina & Mochila
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-2">FECHAR</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-black/20">
                <button
                    onClick={() => setTab('inventory')}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold transition ${tab === 'inventory' ? 'text-purple-300 border-b-2 border-purple-400 bg-white/5' : 'text-slate-500'}`}
                >
                    <Backpack size={18} /> Mochila
                </button>
                <button
                    onClick={() => setTab('crafting')}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 font-bold transition ${tab === 'crafting' ? 'text-purple-300 border-b-2 border-purple-400 bg-white/5' : 'text-slate-500'}`}
                >
                    <Hammer size={18} /> Criação
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {tab === 'inventory' && (
                    <div className="grid grid-cols-2 gap-3">
                        {state.inventory.map((itemEntry, idx) => {
                            const itemId = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
                            const count = typeof itemEntry === 'string' ? 1 : (itemEntry.count || 1);
                            const item = ITEMS.find(i => i.id === itemId);
                            if (!item) return null;
                            const Icon = IconMap[item.icon] || Box;

                            return (
                                <div key={idx} className="bg-slate-800 p-3 rounded border border-slate-700 flex flex-col gap-2 group relative">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded bg-slate-900 flex items-center justify-center shrink-0 ${item.color} relative`}>
                                            <Icon size={18} />
                                            {count > 1 && (
                                                <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold px-1 rounded border border-slate-600">
                                                    x{count}
                                                </span>
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-sm whitespace-normal leading-tight" title={item.name}>{item.name}</p>
                                            <p className="text-[10px] text-slate-400 whitespace-normal mt-0.5 leading-relaxed">{item.desc} {item.effect ? `(${JSON.stringify(item.effect).replace(/["{}]/g, '').replace(/:/g, ': ')})` : ''}</p>
                                        </div>
                                    </div>
                                    {item.type === 'consumable' && (
                                        <button
                                            onClick={() => handleUse(itemEntry, idx)}
                                            className="w-full bg-slate-700 hover:bg-emerald-700 text-xs py-1 rounded font-bold transition flex items-center justify-center gap-1"
                                        >
                                            <Utensils size={10} /> USAR
                                        </button>
                                    )}
                                    {item.type === 'equip' && (
                                        <button
                                            onClick={() => dispatch({ type: 'EQUIP_ITEM', payload: { item, index: idx } })}
                                            className="w-full bg-slate-700 hover:bg-blue-700 text-xs py-1 rounded font-bold transition flex items-center justify-center gap-1"
                                        >
                                            <Hammer size={10} /> EQUIPAR
                                        </button>
                                    )}
                                    {item.type === 'relic_raw' && (
                                        <div className="w-full bg-slate-800 text-slate-500 text-[10px] text-center border-t border-slate-700 pt-1 mt-1">
                                            Avalie na Loja
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {state.inventory.length === 0 && <p className="text-center text-slate-500 col-span-2 py-10">Mochila vazia.</p>}
                    </div>
                )}

                {tab === 'crafting' && (
                    <div className="space-y-4">
                        {RECIPES.map((recipe, i) => {
                            const resItem = ITEMS.find(it => it.id === recipe.res);
                            const craftable = canCraft(recipe);
                            return (
                                <div key={i} className={`bg-slate-800 p-3 rounded border ${craftable ? 'border-slate-600' : 'border-slate-800 opacity-60'} flex justify-between items-center`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded bg-slate-900 flex items-center justify-center ${resItem?.color}`}>
                                            <div className="font-bold">R</div>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-200">{resItem?.name}</h4>
                                            <div className="flex gap-2 text-[10px] text-slate-400 mt-1">
                                                {Object.entries(recipe.req).map(([reqId, count]) => {
                                                    const reqItem = ITEMS.find(it => it.id === reqId);
                                                    return (
                                                        <span key={reqId} className="bg-slate-900 px-1 rounded border border-slate-700">
                                                            {count}x {reqItem?.name}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCraft(recipe)}
                                        disabled={!craftable}
                                        className="bg-purple-700 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-2 px-4 rounded text-xs transition"
                                    >
                                        CRIAR
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
