import React, { useState } from 'react';
import { useGameState } from '../../context/GameContext';
import { ITEMS } from '../../lib/constants';
import { X, Book, Lock, Search } from 'lucide-react';
import {
    Cog, Wind, Bone, Hexagon, Cross, Drumstick, Utensils, Box, Shapes, Sun, Hammer, Compass, Gavel,
    Zap, Triangle, Heart, Battery
} from 'lucide-react';

const IconMap = {
    'cog': Cog, 'wind': Wind, 'bone': Bone, 'bread-slice': Hexagon, 'first-aid': Cross,
    'drumstick': Drumstick, 'utensils': Utensils, 'box': Box, 'shapes': Shapes, 'sun': Sun,
    'hammer': Hammer, 'compass': Compass, 'gavel': Gavel,
    'zap': Zap, 'triangle': Triangle, 'heart': Heart, 'battery': Battery, 'book': Book
};

export default function RelicBookModal({ onClose }) {
    const { state } = useGameState();
    const foundIds = state.stats.foundRelicIds || [];
    const [filter, setFilter] = useState('all');

    // Filter Items Logic
    const allRelics = ITEMS.filter(i => i.type !== 'material' && i.type !== 'consumable'); // Show significant items

    // Sort logic: Found items first, then by rarity
    const sortedRelics = [...allRelics].sort((a, b) => {
        const aFound = foundIds.includes(a.id);
        const bFound = foundIds.includes(b.id);
        if (aFound && !bFound) return -1;
        if (!aFound && bFound) return 1;
        return (a.rarity || 10) - (b.rarity || 10);
    });

    const completionPercentage = Math.round((foundIds.length / ITEMS.length) * 100);

    return (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
            <div className="w-full max-w-5xl h-[85vh] bg-[#1a1410] border border-amber-900/50 rounded-lg shadow-2xl flex flex-col overflow-hidden relative">

                {/* Book Decoration */}
                <div className="absolute inset-0 border-[2px] border-amber-900/30 m-2 rounded pointer-events-none"></div>
                <div className="absolute top-0 bottom-0 left-12 w-[1px] bg-amber-900/20 shadow-[0_0_10px_black] hidden md:block"></div>

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-[#120a05] border-b border-amber-900/40 shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-950/50 rounded-lg border border-amber-900/50">
                            <Book className="text-amber-500" size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif text-amber-100 tracking-wider">Enciclopédia do Abismo</h2>
                            <p className="text-xs text-amber-700 font-mono uppercase tracking-widest">Compêndio de Artefatos & Descobertas</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <span className="block text-[10px] text-amber-800 uppercase font-bold">Progresso</span>
                            <span className="text-xl font-mono text-amber-500">{completionPercentage}%</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-amber-950/50 hover:bg-red-900/50 text-amber-700 hover:text-red-400 flex items-center justify-center transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-custom bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-repeat">
                    <div className="grid grid-cols-1 gap-4">
                        {sortedRelics.map((item) => {
                            const isFound = foundIds.includes(item.id);
                            const Icon = IconMap[item.icon] || Box;

                            return (
                                <div
                                    key={item.id}
                                    className={`relative p-4 rounded border transition-all duration-500 group
                                        ${isFound
                                            ? 'bg-[#1e1814]/80 border-amber-900/40 hover:border-amber-600/50 shadow-lg'
                                            : 'bg-black/40 border-slate-900 opacity-60 grayscale'}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`w-16 h-16 rounded bg-black/50 flex items-center justify-center shrink-0 border border-white/5 
                                            ${isFound ? item.color : 'text-slate-700'} shadow-inner`}>
                                            {isFound ? (
                                                <Icon size={32} />
                                            ) : (
                                                <Lock size={24} className="text-slate-800" />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            {isFound ? (
                                                <>
                                                    <h3 className="text-lg font-serif text-amber-100 font-bold truncate">{item.name}</h3>
                                                    <div className="flex gap-2 mb-2">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded border 
                                                            ${item.rarity <= 1 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                item.rarity <= 2 ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                                    'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                                            {item.rarity === 0 ? 'AUBADE' : item.rarity === 1 ? 'LENDÁRIO' : item.rarity === 2 ? 'RARO' : 'COMUM'}
                                                        </span>
                                                        <span className="text-[10px] text-amber-800 px-1.5 py-0.5 font-mono">{item.price} Orth</span>
                                                    </div>
                                                    <p className="text-xs text-amber-200/70 italic leading-relaxed font-serif">"{item.desc}"</p>
                                                    {item.effect && (
                                                        <div className="mt-2 text-[10px] text-emerald-600/80 font-mono uppercase">
                                                            Efeito: {JSON.stringify(item.effect).replace(/["{}]/g, '').replace(/:/g, ' +')}
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-lg font-serif text-slate-700 font-bold">???</h3>
                                                    <p className="text-xs text-slate-800 italic mt-1">Este artefato ainda não foi documentado.</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {!isFound && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            {/* Optional overlay for locked items */}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
