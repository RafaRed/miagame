import React, { useEffect, useState } from 'react';
import { useGameState } from '../../context/GameContext';
import { useFirebase } from '../../hooks/useFirebase';
import { db } from '../../lib/firebase';
import { ref, onValue, limitToLast, query } from 'firebase/database';
import { Coins, Tag, RefreshCw } from 'lucide-react';
import { ITEMS } from '../../lib/constants';

export default function MarketPanel({ onClose }) {
    const { state, dispatch } = useGameState();
    const { listMarketItem, buyMarketItem, cancelMarketListing, user } = useFirebase();
    const [listings, setListings] = useState([]);
    const [view, setView] = useState('buy'); // buy | sell
    const [sellPrice, setSellPrice] = useState(100);

    // Listen to Market
    useEffect(() => {
        const q = query(ref(db, 'public/market'), limitToLast(50));
        return onValue(q, (snap) => {
            const data = snap.val();
            if (data) {
                const arr = Object.entries(data).map(([id, val]) => ({ id, ...val }));
                setListings(arr.reverse());
            } else {
                setListings([]);
            }
        });
    }, []);

    const handleBuy = async (listing) => {
        if (state.resources.gold < listing.price) {
            dispatch({ type: 'ADD_LOG', payload: "Ouro insuficiente!" });
            return;
        }

        const success = await buyMarketItem(listing.id, listing);
        if (success) {
            dispatch({ type: 'BUY_MARKET_ITEM', payload: { cost: listing.price, item: listing.item } });
        } else {
            dispatch({ type: 'ADD_LOG', payload: "Falha na compra. Item já vendido?" });
        }
    };

    const handleCancel = async (listing) => {
        const success = await cancelMarketListing(listing.id);
        if (success) {
            dispatch({ type: 'CANCEL_MARKET_ITEM', payload: { item: listing.item } });
        } else {
            dispatch({ type: 'ADD_LOG', payload: "Erro ao cancelar." });
        }
    };

    const handleSell = async (item, index) => {
        if (sellPrice <= 0) return;
        await listMarketItem(item, sellPrice);
        dispatch({ type: 'SELL_MARKET_ITEM', payload: { index } });
        setView('buy'); // Switch back to market view
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 w-full max-w-md rounded-lg border border-yellow-700 shadow-2xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-4 border-b border-yellow-800 bg-slate-950 flex justify-between items-center">
                    <h2 className="text-yellow-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Tag size={18} /> Mercado Negro
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setView('buy')}
                        className={`flex-1 p-3 text-xs font-bold uppercase ${view === 'buy' ? 'bg-yellow-900/20 text-yellow-500 border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Comprar
                    </button>
                    <button
                        onClick={() => setView('sell')}
                        className={`flex-1 p-3 text-xs font-bold uppercase ${view === 'sell' ? 'bg-yellow-900/20 text-yellow-500 border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Vender
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50">
                    {view === 'buy' ? (
                        <div className="space-y-2">
                            {listings.length === 0 && <p className="text-center text-slate-500 text-xs py-8">Mercado vazio.</p>}
                            {listings.map(l => (
                                <div key={l.id} className="bg-slate-800 p-2 rounded border border-slate-700 flex justify-between items-center group hover:border-yellow-500/50 transition">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded bg-slate-900 flex items-center justify-center border border-slate-800`}>
                                            <span className="text-xs font-bold text-slate-400">?</span>
                                        </div>
                                        <div>
                                            <div className="text-slate-200 font-bold text-sm">{l.item.name}</div>
                                            <div className="text-slate-500 text-[10px]">Vendedor: {l.sellerName}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => l.sellerName === state.player.name ? handleCancel(l) : handleBuy(l)}
                                        className={`px-3 py-1 rounded border text-xs font-bold transition disabled:opacity-50 disabled:cursor-not-allowed
                                            ${l.sellerName === state.player.name
                                                ? 'bg-red-900/50 border-red-700 text-red-300 hover:bg-red-900'
                                                : 'bg-yellow-900 border-yellow-700 text-yellow-200 hover:bg-yellow-800'
                                            }`}
                                    >
                                        {l.sellerName === state.player.name ? 'CANCELAR' : `${l.price} 🪙`}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-slate-950 p-3 rounded border border-slate-800">
                                <label className="text-[10px] uppercase text-slate-500 font-bold block mb-2">Definir Preço (Orth)</label>
                                <input
                                    type="number"
                                    value={sellPrice}
                                    onChange={(e) => setSellPrice(Number(e.target.value))}
                                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-yellow-500 font-bold focus:outline-none focus:border-yellow-500"
                                    min="1"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {state.inventory.map((item, idx) => {
                                    const itemDef = ITEMS.find(i => i.id === item.id) || item;
                                    return (
                                        <div key={idx} className="bg-slate-800 p-2 rounded border border-slate-700 flex flex-col gap-2">
                                            <div className="font-bold text-slate-300 text-xs">{itemDef.name}</div>
                                            <button
                                                onClick={() => handleSell(itemDef, idx)}
                                                className="w-full bg-indigo-900 text-indigo-200 py-1 rounded text-[10px] font-bold hover:bg-indigo-800"
                                            >
                                                VENDER
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
