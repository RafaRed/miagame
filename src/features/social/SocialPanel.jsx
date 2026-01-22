import React, { useEffect, useState } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, push, serverTimestamp, limitToLast, query } from 'firebase/database';
import { useGameState } from '../../context/GameContext';
import { MessageSquare, Users, Radio } from 'lucide-react';

export default function SocialPanel() {
    const { state, dispatch } = useGameState();
    const [players, setPlayers] = useState([]);
    const [chat, setChat] = useState([]);
    const [msg, setMsg] = useState('');

    // Listen to Players
    useEffect(() => {
        const q = query(ref(db, 'public/players'), limitToLast(50));
        return onValue(q, (snap) => {
            const data = snap.val();
            if (data) setPlayers(Object.entries(data).map(([uid, val]) => ({ uid, ...val })));
        });
    }, []);

    // Listen to Chat
    useEffect(() => {
        const q = query(ref(db, 'public/chat'), limitToLast(20));
        return onValue(q, (snap) => {
            const data = snap.val();
            if (data) setChat(Object.values(data));
        });
    }, []);

    const sendChat = (e) => {
        e.preventDefault();
        if (!msg.trim()) return;
        push(ref(db, 'public/chat'), {
            sender: state.player.name,
            text: msg,
            timestamp: serverTimestamp()
        });
        setMsg('');
    };

    const handleBeacon = () => {
        const cost = 500;
        if (state.resources.gold < cost) {
            // dispatch({ type: 'ADD_LOG', payload: "Ouro insuficiente para sinalizador." }); // Need dispatch here, but context only exposes state?
            // Ah, useGameState exposes dispatch.
            // dispatch({ type: 'ADD_LOG', payload: "Ouro insuficiente." });
            alert("Ouro insuficiente!"); // Simple alert for now as I don't want to wire dispatch just for log inside this component yet if not easy
            return;
        }

        if (confirm(`Gastar ${cost} Orth para disparar um Sinalizador?`)) {
            // Deduct Gold - we need dispatch for this. 
            // Warning: SocialPanel needs dispatch from useGameState.
            // Check line 8: const { state } = useGameState(); -> Need to destructure dispatch too.
            // But I can't change line 8 easily here without seeing it. 
            // I'll update the component to include dispatch.
            push(ref(db, 'public/chat'), {
                sender: "SISTEMA",
                text: `SINALIZADOR: ${state.player.name} precisa de ajuda na camada ${state.player.depth}m!`,
                timestamp: serverTimestamp(),
                isSystem: true
            });
            dispatch({ type: 'ADD_GOLD', payload: -cost }); // We need to add ADD_GOLD to reducer handling negative? Yes it adds payload.
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/50">
            {/* Header */}
            <div className="p-3 bg-slate-800 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700 flex justify-between items-center">
                <span>Rede do Abismo</span>
                <span className="text-green-500 animate-pulse text-[10px] flex items-center gap-1">
                    <Radio size={10} /> Online
                </span>
            </div>

            {/* Player List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-900/30">
                {players.map(p => (
                    <div key={p.uid} className="bg-slate-800 p-2 rounded text-[10px] flex justify-between items-center border border-slate-700">
                        <div>
                            <span className="text-slate-200 font-bold">{p.name}</span>
                            <span className="text-purple-400 ml-1">Lvl {p.level}</span>
                        </div>
                        <span className="text-cyan-400 font-mono">{p.depth}m</span>
                    </div>
                ))}
            </div>

            {/* Chat */}
            <div className="h-64 border-t border-slate-800 flex flex-col bg-slate-950">
                <div className="flex-1 overflow-y-auto p-2 text-[10px] space-y-1.5 font-mono">
                    {chat.map((c, i) => (
                        <div key={i} className="break-words">
                            <span className={`font-bold ${c.isSystem ? 'text-yellow-400' : 'text-blue-400'}`}>{c.sender}:</span> <span className="text-slate-300">{c.text}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={sendChat} className="p-2 bg-slate-800 flex gap-1 border-t border-slate-700">
                    <input
                        type="text"
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        className="flex-1 bg-slate-700 text-white rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 border-none placeholder-slate-500"
                        placeholder="Mensagem..."
                    />
                    <button type="submit" className="bg-blue-700 text-white px-3 rounded text-xs hover:bg-blue-600 transition">
                        <MessageSquare size={12} />
                    </button>
                </form>
            </div>
            {/* SOS Button */}
            <div className="p-4 border-t border-slate-700 bg-abyss-950/50">
                <button
                    onClick={handleBeacon}
                    className="w-full bg-red-800 hover:bg-red-700 p-3 rounded font-bold text-white border-b-4 border-red-950 active:border-b-0 active:translate-y-1 transition flex items-center justify-center gap-2 animate-pulse"
                >
                    <span className="text-xl">⚡</span> DISPARAR SINALIZADOR
                </button>
                <p className="text-[10px] text-center text-slate-500 mt-2">Custo: 500 Orth. Alerta jogadores globais.</p>
            </div>
        </div>
    );
}
