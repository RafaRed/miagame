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
    const { state, dispatch } = useGameState();
    const depth = state.player.depth;

    const currentLayer = LAYERS.find(l => depth >= l.min && depth <= l.max) || LAYERS[0];

    const handleUseItem = (itemEntry, idx) => {
        const itemId = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
        const item = ITEMS.find(i => i.id === itemId);
        if (!item) return;

        if (item.type === 'consumable') {
            dispatch({ type: 'USE_ITEM', payload: { item, index: idx } });
        } else if (item.type === 'equip') {
            dispatch({ type: 'EQUIP_ITEM', payload: { item, index: idx } });
        }
    };

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

            {/* Inventory Strip (Hotbar) */}
            <div className="absolute bottom-0 w-full z-20 bg-abyss-900/95 border-t border-slate-800 p-2 h-20 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.8)] backdrop-blur px-4">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Mochila (Clique para usar)</span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {state.inventory.map((itemEntry, idx) => { // Fixed mapping variable name
                        const itemId = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
                        const itemDef = ITEMS.find(i => i.id === itemId);
                        if (!itemDef) return null;

                        const Icon = IconMap[itemDef.icon] || Box;
                        const tooltip = `${itemDef.name}\n${itemDef.desc}\n${itemDef.effect ? JSON.stringify(itemDef.effect) : ''}`;
                        const isInteractive = itemDef.type === 'consumable' || itemDef.type === 'equip';

                        return (
                            <button
                                key={idx}
                                onClick={() => handleUseItem(itemEntry, idx)}
                                disabled={!isInteractive}
                                className={`w-10 h-10 shrink-0 rounded bg-slate-800 border border-slate-700 flex items-center justify-center ${itemDef.color} relative group 
                                    ${isInteractive ? 'hover:border-white cursor-pointer active:scale-95' : 'cursor-default opacity-80'} transition-all`}
                                title={tooltip}
                            >
                                <Icon size={20} />
                                {itemDef.type === 'consumable' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>}
                                {itemDef.type === 'equip' && <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>}
                                {(typeof item === 'object' && item.count > 1) && <span className="absolute bottom-0 right-0 text-[10px] bg-black/80 px-1 rounded-tl text-white font-mono">{item.count}</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Visual Effects Layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>
    );
}
