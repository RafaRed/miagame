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

const RecentLogs = () => {
    const { state } = useGameState();
    const logs = state.status.logs || [];
    const recentLogs = logs.slice(0, 4);

    const getLogColor = (text) => {
        if (text.includes('Item:') || text.includes('encontrou')) return 'border-cyan-400 text-cyan-100 bg-cyan-950/40';
        if (text.includes('Inimigo:') || text.includes('dano') || text.includes('bloqueia')) return 'border-red-500 text-red-100 bg-red-950/40';
        if (text.includes('Maldição')) return 'border-purple-500 text-purple-100 bg-purple-950/40';
        return 'border-slate-500/50 text-slate-200 bg-black/40';
    };

    return (
        <div className="absolute bottom-24 left-4 z-20 w-3/4 md:w-1/3 pointer-events-none flex flex-col gap-1.5">
            {recentLogs.map((log, i) => (
                <div key={i} className={`text-[10px] sm:text-xs font-mono font-bold tracking-wide px-3 py-1.5 rounded-sm border-l-4 backdrop-blur-[2px] shadow-sm animate-fade-in-left ${getLogColor(log)} transition-all`}>
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

    const curseIntensity = state.status.curseIntensity || 0;

    // Calculate visual effects based on Layer
    const layerIndex = LAYERS.indexOf(currentLayer);
    const i = curseIntensity / 100; // Normalized 0-1

    let filterStyle = '';
    let vignetteColor = 'rgba(128, 0, 128, 0.5)'; // Default Purple

    if (layerIndex <= 1) { // Layers 1-2: Mild Dizziness
        filterStyle = `blur(${i * 6}px) hue-rotate(${i * 15}deg) saturate(${1 - i * 0.2})`;
        vignetteColor = `rgba(200, 100, 200, ${i})`;
    } else if (layerIndex <= 3) { // Layers 3-4: Vertigo & Hallucinations
        filterStyle = `blur(${i * 4}px) hue-rotate(${i * 120}deg) contrast(${1 + i * 0.5})`;
        vignetteColor = `rgba(255, 50, 50, ${i})`; // Reddish for bleeding
    } else if (layerIndex === 4) { // Layer 5: Sensory Deprivation
        filterStyle = `blur(${i * 8}px) brightness(${1 - i * 0.8}) grayscale(${i})`;
        vignetteColor = `rgba(0, 0, 0, ${i})`; // Darkness
    } else { // Layer 6+: Loss of Humanity
        filterStyle = `blur(${i * 10}px) invert(${i * 0.2}) contrast(${1 + i * 2})`;
        vignetteColor = `rgba(255, 255, 255, ${i})`; // Whiteout/Transcendence
    }

    return (
        <div className="relative flex-1 flex flex-col h-full overflow-hidden bg-black">
            {/* Background Layer with Effects */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-200" // Faster transition for wobble
                style={{
                    backgroundImage: `url(${currentLayer.img})`,
                    filter: filterStyle,
                    transform: i > 0.5 ? `scale(${1 + i * 0.05})` : 'scale(1)' // Slight pulse
                }}
            />

            {/* Curse Vignette Overlay */}
            {curseIntensity > 0 && (
                <div
                    className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-200"
                    style={{
                        background: `radial-gradient(circle, transparent 20%, ${vignetteColor})`,
                    }}
                ></div>
            )}

            {/* Visual Effects Layer (Gradient) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0"></div>

            {/* HUD Elements (Safe from blur) */}

            {/* Depth HUD */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
                <div className="text-4xl font-bold font-mono text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    <span>{depth}</span>m
                </div>
                <div className="text-emerald-400 text-xs font-bold uppercase bg-black/50 px-2 rounded backdrop-blur-sm border border-emerald-500/30">
                    {currentLayer.name}
                </div>
            </div>

            {/* Game Log (HUD) */}
            <RecentLogs />

            {/* Inventory Strip (Hotbar) */}
            <div className="absolute bottom-0 w-full z-20 bg-abyss-900/95 border-t border-slate-800 p-2 h-20 flex flex-col shadow-[0_-5px_20px_rgba(0,0,0,0.8)] backdrop-blur px-4 pointer-events-auto">
                <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider mb-1">Mochila (Clique para usar)</span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {state.inventory.map((itemEntry, idx) => {
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
                                {((typeof itemEntry === 'object' && itemEntry.count > 1) || false) && (
                                    <span className="absolute bottom-0 right-0 text-[10px] bg-black/80 px-1 rounded-tl text-white font-mono font-bold">
                                        {itemEntry.count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
