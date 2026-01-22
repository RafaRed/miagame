import React, { useState } from 'react';
import { useGameState } from '../../context/GameContext';
import {
    ShoppingBag, Pickaxe, Battery, Zap, ArrowUpCircle, Coins, Package, Eye,
    Cog, Wind, Bone, Hexagon, Cross, Drumstick, Utensils, Box, Shapes, Sun, Hammer, Compass, Gavel
} from 'lucide-react';
import { ITEMS } from '../../lib/constants';

const IconMap = {
    'cog': Cog, 'wind': Wind, 'bone': Bone, 'bread-slice': Hexagon, 'first-aid': Cross,
    'drumstick': Drumstick, 'utensils': Utensils, 'box': Box, 'shapes': Shapes, 'sun': Sun,
    'hammer': Hammer, 'compass': Compass, 'gavel': Gavel
};

const UPGRADES = [
    { id: 'excavator', name: 'Escavadeira', icon: Pickaxe, desc: 'Gera Ouro e Pó passivamente.', basePrice: 500, multiplier: 250 },
    { id: 'refinery', name: 'Refinaria', icon: ArrowUpCircle, desc: 'Transforma Sucata em Relíquias.', basePrice: 3000, multiplier: 2000 },
    { id: 'generator', name: 'Gerador', icon: Zap, desc: 'Aumenta eficiência global.', basePrice: 5000, multiplier: 5000 },
    { id: 'balloon', name: 'Balão de Entrega', icon: Package, desc: 'Vende itens comuns auto.', basePrice: 1200, multiplier: 600 },
];

export default function ShopPanel({ onClose }) {
    const { state, dispatch } = useGameState();
    const [tab, setTab] = useState('supplies'); // supplies, upgrades, sell

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
        <div className="absolute inset-0 z-40 bg-abyss-950/95 backdrop-blur-2xl flex animate-fade-in overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="w-20 md:w-64 bg-black/40 border-r border-slate-800 flex flex-col items-center md:items-stretch py-6">
                <div className="mb-8 px-4 flex items-center justify-center md:justify-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-relic-gold to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/50">
                        <ShoppingBag className="text-white" size={20} />
                    </div>
                    <span className="hidden md:block font-serif text-xl font-bold text-slate-100 tracking-wide">Mercado</span>
                </div>

                <div className="flex-1 space-y-2 px-2">
                    <NavButton active={tab === 'supplies'} onClick={() => setTab('supplies')} icon={ShoppingBag} label="Suprimentos" />
                    <NavButton active={tab === 'upgrades'} onClick={() => setTab('upgrades')} icon={Battery} label="Maquinário" />
                    <NavButton active={tab === 'appraisal'} onClick={() => setTab('appraisal')} icon={SearchLikeIcon} label="Avaliação" />
                    <NavButton active={tab === 'sell'} onClick={() => setTab('sell')} icon={Coins} label="Vender" />
                </div>

                <div className="p-4 border-t border-slate-800 bg-black/20">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                        <span className="text-[10px] uppercase text-slate-500 font-bold">Saldo</span>
                        <span className="text-relic-gold font-mono font-bold text-lg">{state.resources.gold} O</span>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Header / Close */}
                <div className="absolute top-4 right-4 z-10">
                    <button onClick={onClose} className="bg-black/50 hover:bg-red-900/80 text-slate-400 hover:text-white p-2 rounded-full transition border border-slate-700 hover:border-red-500">
                        <Cross size={20} className="rotate-45" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 scrollbar-hide">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl font-serif text-slate-100 mb-2 border-b border-slate-800 pb-4 flex items-center gap-3">
                            {tab === 'supplies' && <> <ShoppingBag className="text-emerald-500" /> Suprimentos Essenciais </>}
                            {tab === 'upgrades' && <> <Zap className="text-amber-500" /> Tecnologias </>}
                            {tab === 'appraisal' && <> <Eye className="text-purple-500" /> Avaliador de Relíquias </>}
                            {tab === 'sell' && <> <Coins className="text-blue-500" /> Venda de Itens </>}
                        </h2>

                        {/* Tab Content Injection */}
                        <div className="mt-6 animate-slide-up">
                            {/* ... (Existing logic logic reused directly below to fit context) ... */}
                            {tab === 'supplies' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {ITEMS.filter(i => i.type === 'consumable' || i.type === 'equip').map(item => {
                                        const Icon = IconMap[item.icon] || Box;
                                        return (
                                            <div key={item.id} className="bg-slate-900/60 p-5 rounded-xl border border-slate-800 hover:border-relic-gold/50 group transition hover:shadow-xl hover:shadow-amber-900/10 hover:-translate-y-1 relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition transform group-hover:scale-125">
                                                    <Icon size={64} />
                                                </div>
                                                <div className="flex items-start justify-between mb-4 relative z-10">
                                                    <div className={`w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center ${item.color} shadow-lg ring-1 ring-white/10`}>
                                                        <Icon size={24} />
                                                    </div>
                                                    <span className="font-mono text-relic-gold font-bold bg-amber-950/30 px-2 py-1 rounded text-xs border border-amber-900/50">{item.price} O</span>
                                                </div>
                                                <div className="mb-4 relative z-10">
                                                    <h3 className="font-bold text-slate-100 text-lg">{item.name}</h3>
                                                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => buyItem(item)}
                                                    className="w-full py-2 rounded bg-slate-800 hover:bg-relic-gold hover:text-black font-bold text-xs uppercase tracking-wider transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={state.resources.gold < item.price}
                                                >
                                                    Comprar
                                                </button>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}

                            {tab === 'upgrades' && (
                                <div className="grid grid-cols-1 gap-4">
                                    {UPGRADES.map(u => {
                                        const price = getPrice(u);
                                        const level = state.machines[u.id] || 0;
                                        return (
                                            <div key={u.id} className="bg-slate-900/60 p-6 rounded-xl border border-slate-800 flex items-center gap-6 hover:border-indigo-500/50 transition relative overflow-hidden group">
                                                <div className="hidden md:flex w-16 h-16 rounded-2xl bg-indigo-950/30 items-center justify-center text-indigo-400 group-hover:text-indigo-300 transition shadow-inner">
                                                    <u.icon size={32} />
                                                </div>
                                                <div className="flex-1 z-10">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-xl font-bold text-slate-100">{u.name}</h3>
                                                        <span className="bg-indigo-900/50 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-800">NÍVEL {level}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-400">{u.desc}</p>
                                                </div>
                                                <button
                                                    onClick={() => buyUpgrade(u)}
                                                    disabled={state.resources.gold < price}
                                                    className="relative z-10 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg font-bold shadow-lg shadow-indigo-900/20 transition group-hover:shadow-indigo-500/20"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-xs uppercase tracking-wider">Melhorar</span>
                                                        <span className="text-[10px] opacity-80">{price} Orth</span>
                                                    </div>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {tab === 'appraisal' && (
                                <div className="bg-slate-900/40 rounded-2xl border border-slate-800 p-8 text-center min-h-[400px] flex flex-col items-center">
                                    <div className="w-20 h-20 rounded-full bg-purple-900/20 flex items-center justify-center mb-6 border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                                        <Eye size={40} className="text-purple-400" />
                                    </div>
                                    <h3 className="text-2xl font-serif text-slate-200 mb-2">Serviço de Avaliação</h3>
                                    <p className="text-slate-400 max-w-md mx-auto mb-10">
                                        "Nem tudo o que brilha é ouro, mas algumas pedras escondem segredos do fundo do Abismo."
                                    </p>
                                    <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {state.inventory.map((itemId, idx) => {
                                            const item = ITEMS.find(i => i.id === itemId);
                                            if (item?.type !== 'relic_raw') return null;
                                            return (
                                                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-purple-500/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition group cursor-pointer" onClick={() => dispatch({ type: 'APPRAISE_ITEM', payload: { index: idx } })}>
                                                    <div className="w-12 h-12 mx-auto bg-slate-900 rounded-lg flex items-center justify-center text-slate-600 mb-3 group-hover:scale-110 transition">
                                                        <Package size={24} />
                                                    </div>
                                                    <p className="font-bold text-slate-300 text-sm mb-2">{item.name}</p>
                                                    <span className="text-[10px] font-bold bg-purple-900/50 text-purple-300 px-2 py-1 rounded">Custo: 50 O</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {!state.inventory.some(id => ITEMS.find(i => i.id === id)?.type === 'relic_raw') && (
                                        <div className="flex flex-col items-center justify-center h-40 opacity-30">
                                            <Package size={48} className="mb-2" />
                                            <p>Nenhuma relíquia para avaliar.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {tab === 'sell' && (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                    {state.inventory.map((itemId, idx) => {
                                        const item = ITEMS.find(i => i.id === itemId);
                                        const Icon = item ? (IconMap[item.icon] || Box) : Box;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => sellItem(idx)}
                                                className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 hover:border-red-500 hover:bg-slate-800 transition group flex flex-col items-center gap-2 relative overflow-hidden"
                                            >
                                                <div className={`p-3 rounded-full bg-slate-900/50 ${item?.color} group-hover:scale-110 transition`}>
                                                    <Icon size={20} />
                                                </div>
                                                <div className="text-center w-full">
                                                    <p className="text-xs font-bold text-slate-300 truncate w-full">{item?.name || '???'}</p>
                                                    <p className="text-[10px] text-green-400 font-mono mt-1">+{Math.floor((item?.price || 0) * 0.5)} O</p>
                                                </div>
                                            </button>
                                        )
                                    })}
                                    {state.inventory.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-slate-600">
                                            <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
                                            <p>Sua mochila está vazia.</p>
                                            <p className="text-xs mt-2">Explore para encontrar itens para vender.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function NavButton({ active, onClick, icon: Icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-center md:justify-start gap-4 p-3 md:px-6 rounded-lg transition-all duration-200 group ${active ? 'bg-relic-gold text-abyss-950 font-bold shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
        >
            <Icon size={20} className={active ? 'scale-110' : 'group-hover:scale-110 transition-transform'} />
            <span className={`hidden md:block text-sm ${active ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </button>
    );
}

const StoreIcon = () => null; // Deprecated in new design
