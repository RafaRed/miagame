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
        <div className="absolute inset-0 z-40 bg-abyss-950/95 backdrop-blur-xl flex flex-col animate-fade-in">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-abyss-900">
                <h2 className="text-relic-gold font-serif text-2xl flex items-center gap-2">
                    <StoreIcon state={state} /> Posto de Troca
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white font-bold p-2">FECHAR</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-700 bg-black/20">
                <TabButton active={tab === 'supplies'} onClick={() => setTab('supplies')} icon={ShoppingBag}>Suprimentos</TabButton>
                <TabButton active={tab === 'upgrades'} onClick={() => setTab('upgrades')} icon={Battery}>Maquinário</TabButton>
                <TabButton active={tab === 'appraisal'} onClick={() => setTab('appraisal')} icon={SearchLikeIcon}>Avaliar</TabButton>
                <TabButton active={tab === 'sell'} onClick={() => setTab('sell')} icon={Coins}>Vender</TabButton>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
                {tab === 'supplies' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {ITEMS.filter(i => i.type === 'consumable' || i.type === 'equip').map(item => {
                            const Icon = IconMap[item.icon] || Box;
                            return (
                                <div key={item.id} className="bg-slate-800 p-3 rounded border border-slate-600 flex justify-between items-center group hover:border-relic-gold transition relative overflow-hidden">
                                    <div className="flex items-center gap-3 relative z-10">
                                        <div className={`w-10 h-10 rounded bg-slate-900 flex items-center justify-center ${item.color} shadow-lg`}>
                                            <Icon size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200 text-sm">{item.name}</p>
                                            <p className="text-[10px] text-slate-400 max-w-[120px] leading-tight">{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => buyItem(item)}
                                        className="bg-slate-700 hover:bg-relic-gold hover:text-black py-1 px-3 rounded text-xs font-mono font-bold transition disabled:opacity-50 relative z-10"
                                        disabled={state.resources.gold < item.price}
                                    >
                                        {item.price} O
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {tab === 'upgrades' && (
                    <div className="space-y-3">
                        {UPGRADES.map(u => {
                            const price = getPrice(u);
                            const level = state.machines[u.id] || 0;
                            return (
                                <div key={u.id} className="bg-slate-800 p-4 rounded border border-slate-600 flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded bg-indigo-900/50 flex items-center justify-center text-indigo-400">
                                            <u.icon />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-100 flex items-center gap-2">
                                                {u.name} <span className="text-xs bg-indigo-900 px-2 rounded-full text-indigo-300">Lvl {level}</span>
                                            </h3>
                                            <p className="text-xs text-slate-400">{u.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => buyUpgrade(u)}
                                        disabled={state.resources.gold < price}
                                        className="bg-indigo-700 hover:bg-indigo-600 disabled:bg-slate-700 disabled:text-slate-500 text-white py-2 px-4 rounded font-bold transition flex flex-col items-end"
                                    >
                                        <span className="text-sm">Melhorar</span>
                                        <span className="text-[10px] opacity-75">{price} O</span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                {tab === 'appraisal' && (
                    <div className="space-y-4">
                        <div className="bg-indigo-900/20 p-4 rounded border border-indigo-500/30 text-center mb-4">
                            <h3 className="text-indigo-300 font-bold mb-1">Avaliador de Relíquias</h3>
                            <p className="text-xs text-slate-400">Traga "Relíquias Sujas" para revelar seu verdadeiro valor. Custo: 50 Orth.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {state.inventory.map((itemId, idx) => {
                                const item = ITEMS.find(i => i.id === itemId);
                                if (item?.type !== 'relic_raw') return null;

                                return (
                                    <div key={idx} className="bg-slate-800 p-3 rounded border border-indigo-900/50 flex flex-col items-center gap-2">
                                        <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center text-slate-500">
                                            <Package size={24} />
                                        </div>
                                        <div className="text-center">
                                            <p className="font-bold text-sm text-slate-200">{item.name}</p>
                                            <p className="text-[10px] text-slate-500">Não Identificado</p>
                                        </div>
                                        <button
                                            onClick={() => dispatch({ type: 'APPRAISE_ITEM', payload: { index: idx } })}
                                            disabled={state.resources.gold < 50}
                                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold py-2 rounded"
                                        >
                                            AVALIAR (50 O)
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                        {!state.inventory.some(id => ITEMS.find(i => i.id === id)?.type === 'relic_raw') && (
                            <p className="text-center text-slate-500 py-10">Você não possui relíquias sujas.</p>
                        )}
                    </div>
                )}

                {tab === 'sell' && (
                    <div className="grid grid-cols-3 gap-2">
                        {state.inventory.map((itemId, idx) => {
                            const item = ITEMS.find(i => i.id === itemId);
                            const Icon = item ? (IconMap[item.icon] || Box) : Box;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => sellItem(idx)}
                                    className="bg-slate-800 p-2 rounded border border-slate-700 hover:bg-slate-700 hover:border-red-400 flex flex-col items-center gap-1 group transition relative"
                                >
                                    <div className={`${item?.color || 'text-slate-500'} p-2 rounded bg-slate-900/50 group-hover:bg-slate-900 transition`}>
                                        <Icon size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold truncate w-full text-center text-slate-300">{item?.name || 'Desconhecido'}</span>
                                    <span className="text-[10px] text-green-400 bg-green-900/20 px-1 rounded font-mono">+{Math.floor((item?.price || 0) * 0.5)} O</span>
                                </button>
                            );
                        })}
                        {state.inventory.length === 0 && <p className="col-span-3 text-center text-slate-500 italic py-8">Mochila vazia.</p>}
                    </div>
                )}
            </div>

            <div className="p-3 bg-abyss-950 border-t border-slate-800 text-right">
                <span className="text-slate-400 mr-2">Saldo:</span>
                <span className="text-relic-gold font-bold font-mono text-xl">{state.resources.gold} O</span>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, icon: Icon, children }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold uppercase transition ${active ? 'text-relic-gold bg-slate-800/50 border-b-2 border-relic-gold' : 'text-slate-500 hover:text-slate-300'}`}
        >
            <Icon size={16} /> {children}
        </button>
    );
}

const SearchLikeIcon = Eye;
const StoreIcon = () => <ShoppingBag className="text-relic-gold" />;
