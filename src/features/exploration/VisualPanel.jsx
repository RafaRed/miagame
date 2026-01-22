import React from 'react';
import { useGameState } from '../../context/GameContext';
import { LAYERS, ITEMS } from '../../lib/constants';
import {
    Cog, Wind, Bone, Hexagon, Cross, Drumstick, Utensils, Box, Shapes, Sun, Hammer, Compass, Gavel
} from 'lucide-react';

const IconMap = {
    'cog': Cog, 'wind': Wind, 'bone': Bone, 'bread-slice': Hexagon, 'first-aid': Cross,
    'drumstick': Drumstick, 'utensils': Utensils, 'box': Box, 'shapes': Shapes, 'sun': Sun,
    'hammer': Hammer, 'compass': Compass, 'gavel': Gavel
};

// Log component
const GameLog = () => {
    const { state } = useGameState();
    return (
        <div className="flex-1 p-4 pt-24 overflow-y-auto space-y-2 z-10 flex flex-col-reverse scroll-smooth mask-image-b pb-24 scrollbar-hide">
            {state.status.logs?.map((log, i) => (
                <div key={i} className="p-3 rounded bg-abyss-900/90 border-l-2 border-emerald-500 text-slate-300 text-xs shadow-lg backdrop-blur-md animate-fade-in">
                    {log}
                </div>
            ))}
        </div>
    );
};

export default function VisualPanel() {
    const { state } = useGameState();
    const depth = state.player.depth;

    const currentLayer = LAYERS.find(l => depth >= l.min && depth <= l.max) || LAYERS[0];

    return (
        <div
            className="relative flex-1 flex flex-col h-full overflow-hidden bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${currentLayer.img})` }}
        >
            {/* Depth HUD */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                <div className="text-4xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    <span>{depth}</span>m
                </div>
                <div className="text-emerald-400 text-xs font-bold uppercase bg-black/50 px-2 rounded backdrop-blur-sm border border-emerald-500/30">
                    {currentLayer.name}
                </div>
            </div>

            {/* Game Log */}
            <GameLog />

            {/* Inventory Strip Placeholder */}
            <div className="absolute bottom-0 w-full z-20 bg-abyss-900/95 border-t border-slate-800 p-2 h-20 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.8)] backdrop-blur px-4">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Mochila</span>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {state.inventory.map((item, idx) => {
                        const itemId = typeof item === 'string' ? item : item.id;
                        const itemDef = ITEMS.find(i => i.id === itemId);
                        if (!itemDef) return null;

                        const Icon = IconMap[itemDef.icon] || Box;
                        const tooltip = `${itemDef.name}\n${itemDef.desc}\n${itemDef.effect ? JSON.stringify(itemDef.effect) : ''}`;

                        return (
                            <div key={idx} className={`w-10 h-10 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center ${itemDef.color} relative group cursor-help`} title={tooltip}>
                                <Icon size={20} />
                                {itemDef.type === 'consumable' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
                                {(typeof item === 'object' && item.count > 1) && <span className="absolute bottom-0 right-0 text-[10px] bg-black/80 px-1 rounded-tl text-white font-mono">{item.count}</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Visual Effects Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>
    );
}
