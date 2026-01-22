import React, { useState } from 'react';
import { useGameState } from '../../context/GameContext';
import {
    ShoppingBag, Pickaxe, Battery, Zap, ArrowUpCircle, Coins, Package, Eye,
    Cog, Wind, Bone, Hexagon, Cross, Drumstick, Utensils, Box, Shapes, Sun, Hammer, Compass, Gavel,
    Heart, Triangle, X, Anchor
} from 'lucide-react';
import { ITEMS } from '../../lib/constants';

const IconMap = {
    'cog': Cog, 'wind': Wind, 'bone': Bone, 'bread-slice': Utensils, 'first-aid': Cross,
    'drumstick': Drumstick, 'utensils': Utensils, 'box': Box, 'shapes': Shapes, 'sun': Sun,
    'hammer': Hammer, 'compass': Compass, 'gavel': Gavel,
    'heart': Heart, 'triangle': Triangle, 'zap': Zap
};

const UPGRADES = [
    { id: 'excavator', name: 'Escavadeira', icon: Pickaxe, desc: 'Gera Ouro e Pó passivamente.', basePrice: 500, multiplier: 250 },
    { id: 'refinery', name: 'Refinaria', icon: ArrowUpCircle, desc: 'Transforma Sucata em Relíquias.', basePrice: 3000, multiplier: 2000 },
    { id: 'generator', name: 'Gerador', icon: Zap, desc: 'Aumenta eficiência global.', basePrice: 5000, multiplier: 5000 },
    { id: 'balloon', name: 'Balão de Entrega', icon: Package, desc: 'Vende itens comuns auto.', basePrice: 1200, multiplier: 600 },
];

export default function ShopPanel({ onClose }) {
    const { state, dispatch } = useGameState();
    const [tab, setTab] = useState('supplies');

    const getPrice = (u) => u.basePrice + ((state.machines[u.id] || 0) * u.multiplier);

    const buyUpgrade = (u) => {
        const price = getPrice(u);
        if (state.resources.gold >= price) {
            dispatch({ type: 'BUY_UPGRADE', payload: { id: u.id, cost: price } });
        }
    };

    const buyItem = (item) => {
        if (state.resources.gold >= item.price) {
            dispatch({ type: 'BUY_ITEM', payload: { item, cost: item.price } });
        }
    };

    const sellItem = (idx) => {
        const item = ITEMS.find(i => i.id === state.inventory[idx]);
        dispatch({ type: 'SELL_ITEM', payload: { index: idx, gold: Math.floor(item.price * 0.5) } });
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 animate-fade-in">
            {/* Main Modal Container - Fixed size for better desktop view */}
            <div className="w-full max-w-4xl h-[85vh] bg-abyss-950 border border-amber-900/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                    <Anchor size={300} className="text-amber-500" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-4 md:px-6 bg-black/40 border-b border-amber-900/20 shrink-0 z-10">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-relic-gold to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/20 shrink-0">
                            <ShoppingBag className="text-white" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-xl font-serif font-bold text-slate-100 tracking-wide">Mercado do Abismo</h2>
                            <p className="text-[10px] text-amber-500 font-mono tracking-wider uppercase hidden sm:block">Posto Oficial de Comércio</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] md:text-[10px] uppercase text-slate-500 font-bold">Patrimônio</span>
                            <span className="text-base md:text-lg font-mono text-relic-gold font-bold text-shadow-glow">{state.resources.gold} Orth</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-red-900/80 text-slate-400 hover:text-white flex items-center justify-center transition border border-transparent hover:border-red-500/50"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Navigation Tabs - Force equal width to fit all */}
                <div className="grid grid-cols-4 border-b border-slate-800/50 bg-black/20 shrink-0">
                    <TabButton active={tab === 'supplies'} onClick={() => setTab('supplies')} icon={ShoppingBag} label="Loja" />
                    <TabButton active={tab === 'upgrades'} onClick={() => setTab('upgrades')} icon={Battery} label="Maq." />
                    <TabButton active={tab === 'appraisal'} onClick={() => setTab('appraisal')} icon={Eye} label="Avaliar" />
                    <TabButton active={tab === 'sell'} onClick={() => setTab('sell')} icon={Coins} label="Vender" />
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-3 md:p-6 scrollbar-custom bg-gradient-to-b from-transparent to-black/30 relative z-0">

                    {tab === 'supplies' && (
                        <div className="animate-slide-up max-w-3xl mx-auto">
                            <div className="grid grid-cols-1 gap-3">
                                {ITEMS.filter(i => i.type === 'consumable' || i.type === 'equip').map(item => {
                                    const Icon = IconMap[item.icon] || Box;
                                    const canAfford = state.resources.gold >= item.price;

                                    return (
                                        <div key={item.id} className="group bg-slate-900/60 border border-slate-800 rounded-lg p-3 hover:bg-slate-800 hover:border-relic-gold/30 transition-all flex flex-row items-center gap-4 relative overflow-hidden">
                                            {/* Icon Box */}
                                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center ${item.color} shadow-inner shrink-0`}>
                                                <Icon size={24} />
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-1">
                                                    <h3 className="text-sm md:text-base font-bold text-slate-100 truncate">{item.name}</h3>
                                                    <span className="text-[10px] md:text-xs font-mono text-relic-gold font-bold bg-black/40 px-2 py-0.5 rounded border border-white/5 shrink-0 ml-2">
                                                        {item.price} O
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 whitespace-normal leading-relaxed">{item.desc}</p>

                                                {/* Effects Tags */}
                                                {item.effect && (
                                                    <div className="flex gap-1 flex-wrap mt-1">
                                                        {Object.entries(item.effect).map(([key, val]) => (
                                                            <span key={key} className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 uppercase tracking-wide border border-slate-700/50">
                                                                {key === 'hp' ? 'HP' : key === 'hunger' ? 'FOME' : key} {val > 0 ? '+' : ''}{val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Buy Button */}
                                            <button
                                                onClick={() => buyItem(item)}
                                                disabled={!canAfford}
                                                className={`h-full min-h-[50px] px-3 md:px-5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2 shrink-0 border
                                                    ${canAfford
                                                        ? 'bg-relic-gold text-black border-relic-gold hover:bg-amber-400'
                                                        : 'bg-transparent text-slate-600 border-slate-800 cursor-not-allowed'}`}
                                            >
                                                <ShoppingBag size={14} />
                                                <span className="hidden sm:inline">{canAfford ? 'Comprar' : '---'}</span>
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {tab === 'upgrades' && (
                        <div className="max-w-3xl mx-auto space-y-4 animate-slide-up">
                            <div className="grid grid-cols-1 gap-3">
                                {UPGRADES.map(u => {
                                    const price = getPrice(u);
                                    const level = state.machines[u.id] || 0;
                                    const canAfford = state.resources.gold >= price;

                                    return (
                                        <div key={u.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 md:p-4 flex flex-row items-center gap-4 hover:border-indigo-500/40 transition group relative">
                                            <div className="w-14 h-14 rounded-xl bg-indigo-950/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 group-hover:scale-105 transition duration-500">
                                                <u.icon size={28} />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                                                    <h3 className="text-base font-bold text-slate-100 truncate">{u.name}</h3>
                                                    <span className="bg-indigo-900/40 text-indigo-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-indigo-500/30 w-fit whitespace-nowrap">
                                                        Nível {level}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 line-clamp-2 md:line-clamp-1">{u.desc}</p>
                                            </div>

                                            <button
                                                onClick={() => buyUpgrade(u)}
                                                disabled={!canAfford}
                                                className={`px-4 py-2 rounded-lg font-bold transition-all relative z-10 shrink-0 flex flex-col items-center min-w-[80px]
                                                    ${canAfford
                                                        ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
                                            >
                                                <span className="text-[10px] uppercase tracking-wider">Melhorar</span>
                                                <span className="text-xs">{price} O</span>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {tab === 'appraisal' && (
                        <div className="flex flex-col items-center justify-center min-h-[400px] animate-slide-up">
                            <div className="w-20 h-20 rounded-full bg-purple-900/10 border border-purple-500/30 flex items-center justify-center mb-4">
                                <Eye size={32} className="text-purple-400" />
                            </div>
                            <h3 className="text-xl font-serif text-slate-200 mb-2">Avaliador de Relíquias</h3>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full max-w-4xl mt-6">
                                {state.inventory.map((itemEntry, idx) => {
                                    const itemId = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
                                    const count = typeof itemEntry === 'string' ? 1 : (itemEntry.count || 1);
                                    const item = ITEMS.find(i => i.id === itemId);
                                    if (item?.type !== 'relic_raw') return null;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => dispatch({ type: 'APPRAISE_ITEM', payload: { index: idx } })}
                                            className="bg-slate-800/50 p-3 rounded-lg border border-purple-500/20 hover:border-purple-400 hover:bg-slate-800 transition flex flex-col items-center text-center group relative"
                                        >
                                            <div className="w-12 h-12 bg-black/30 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition relative">
                                                <Package size={24} className="text-slate-500 group-hover:text-purple-300" />
                                                {count > 1 && (
                                                    <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold px-1 rounded border border-slate-600">
                                                        x{count}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="font-bold text-slate-300 text-xs mb-1 truncate w-full">{item.name}</span>
                                            <span className="text-[10px] text-purple-400">50 Orth</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {!state.inventory.some(entry => {
                                const id = typeof entry === 'string' ? entry : entry.id;
                                return ITEMS.find(i => i.id === id)?.type === 'relic_raw';
                            }) && (
                                    <div className="text-slate-600 text-sm mt-4">
                                        Nenhuma relíquia para avaliar.
                                    </div>
                                )}
                        </div>
                    )}

                    {tab === 'sell' && (
                        <div className="animate-slide-up max-w-6xl mx-auto">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {state.inventory.map((itemEntry, idx) => {
                                    const itemId = typeof itemEntry === 'string' ? itemEntry : itemEntry.id;
                                    const count = typeof itemEntry === 'string' ? 1 : (itemEntry.count || 1);
                                    const item = ITEMS.find(i => i.id === itemId);
                                    const Icon = item ? (IconMap[item.icon] || Box) : Box;

                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                const sellId = typeof state.inventory[idx] === 'string' ? state.inventory[idx] : state.inventory[idx].id;
                                                const sellItemObj = ITEMS.find(i => i.id === sellId);
                                                dispatch({ type: 'SELL_ITEM', payload: { index: idx, gold: Math.floor((sellItemObj?.price || 0) * 0.5) } });
                                            }}
                                            className="group bg-slate-900/40 p-3 rounded-lg border border-slate-800 hover:border-red-500/50 hover:bg-red-900/10 transition-all flex flex-col items-center relative"
                                            title={`${item?.name}\n${item?.desc || ''}\nPreço: ${Math.floor((item?.price || 0) * 0.5)} Orth`}
                                        >
                                            <div className={`p-3 rounded-full bg-black/30 mb-2 ${item?.color} group-hover:scale-110 transition relative`}>
                                                <Icon size={20} />
                                                {count > 1 && (
                                                    <span className="absolute -bottom-1 -right-1 bg-black text-white text-[9px] font-bold px-1 rounded border border-slate-600">
                                                        x{count}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-center w-full min-w-0">
                                                <p className="text-xs font-bold text-slate-300 w-full truncate">{item?.name || '???'}</p>
                                                <p className="text-[10px] text-emerald-400 font-mono mt-0.5">+{Math.floor((item?.price || 0) * 0.5)} O</p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                            {state.inventory.length === 0 && (
                                <div className="py-20 flex flex-col items-center justify-center text-slate-600">
                                    <p>Mochila vazia.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 px-1 py-3 border-b-2 transition-all duration-300 w-full
                ${active
                    ? 'border-relic-gold text-relic-gold bg-amber-900/10 shadow-[inner_0_0_10px_rgba(245,158,11,0.1)]'
                    : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'}`}
        >
            <Icon size={16} className={active ? 'text-relic-gold' : ''} />
            <span className={`text-[10px] md:text-sm ${active ? 'font-bold' : 'font-medium'} truncate max-w-full`}>{label}</span>
        </button>
    );
}
