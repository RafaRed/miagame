import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database';
import { Trophy, Coins, ArrowDown } from 'lucide-react';
import { getWhistleRank } from '../../lib/constants';

export default function LeaderboardModal({ onClose }) {
    const [players, setPlayers] = useState([]);
    const [sortBy, setSortBy] = useState('maxDepth'); // maxDepth | gold

    useEffect(() => {
        const q = query(ref(db, 'public/players'), limitToLast(50));
        return onValue(q, (snap) => {
            const data = snap.val();
            if (data) {
                const arr = Object.entries(data)
                    .map(([uid, val]) => ({ uid, ...val }))
                    .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0))
                    .slice(0, 10);
                setPlayers(arr);
            }
        });
    }, [sortBy]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 w-full max-w-md rounded-lg border border-yellow-700 shadow-2xl flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="p-4 border-b border-yellow-800 bg-slate-950 flex justify-between items-center">
                    <h2 className="text-yellow-500 font-bold uppercase tracking-widest flex items-center gap-2">
                        <Trophy size={18} /> Ranking do Abismo
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">✕</button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setSortBy('maxDepth')}
                        className={`flex-1 p-3 text-xs font-bold uppercase flex items-center justify-center gap-1 ${sortBy === 'maxDepth' ? 'bg-cyan-900/20 text-cyan-400 border-b-2 border-cyan-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <ArrowDown size={12} /> Profundidade
                    </button>
                    <button
                        onClick={() => setSortBy('gold')}
                        className={`flex-1 p-3 text-xs font-bold uppercase flex items-center justify-center gap-1 ${sortBy === 'gold' ? 'bg-yellow-900/20 text-yellow-400 border-b-2 border-yellow-500' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        <Coins size={12} /> Riqueza
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-900/50 space-y-2">
                    {players.map((p, idx) => {
                        const whistle = getWhistleRank(p.maxDepth || 0);
                        const isFirst = idx === 0;
                        return (
                            <div
                                key={p.uid}
                                className={`p-3 rounded border flex items-center gap-3 transition ${isFirst ? 'bg-yellow-900/30 border-yellow-600 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-slate-800 border-slate-700'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isFirst ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-400'}`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-200 font-bold">{p.name}</span>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded ${whistle.color} ${whistle.color === 'bg-white' ? 'text-black' : 'text-white'}`}>
                                            {whistle.name}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-slate-500">Lvl {p.level || 1}</div>
                                </div>
                                <div className="text-right">
                                    {sortBy === 'maxDepth' ? (
                                        <span className="text-cyan-400 font-mono font-bold">{p.maxDepth || 0}m</span>
                                    ) : (
                                        <span className="text-yellow-400 font-mono font-bold">{p.gold || 0} 🪙</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
