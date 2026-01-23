import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../lib/firebase';
import { ref, onValue, push, serverTimestamp, limitToLast, query } from 'firebase/database';
import { useGameState } from '../../context/GameContext';
import { MessageSquare, Users, Radio, Trophy } from 'lucide-react';
import LeaderboardModal from './LeaderboardModal';

export default function SocialPanel() {
    const { state, dispatch } = useGameState();
    const [players, setPlayers] = useState([]);
    const [chat, setChat] = useState([]);
    const [msg, setMsg] = useState('');
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    const stateRef = useRef(state);
    useEffect(() => { stateRef.current = state; }, [state]);

    // Listen to Players - single subscription, no re-subscribe
    useEffect(() => {
        const q = query(ref(db, 'public/players'), limitToLast(20));
        const unsub = onValue(q, (snap) => {
            const data = snap.val();
            if (data) {
                const arr = Object.entries(data)
                    .map(([uid, val]) => ({ uid, ...val }))
                    .sort((a, b) => b.depth - a.depth);
                setPlayers(arr);

                // Calculate Resonance using ref
                const myDepth = stateRef.current.player.depth;
                const myName = stateRef.current.player.name;
                const nearbyCount = arr.filter(p =>
                    Math.abs(p.depth - myDepth) < 200 && p.name !== myName
                ).length;
                dispatch({ type: 'UPDATE_RESONANCE', payload: nearbyCount });
            }
        });
        return () => unsub();
    }, [dispatch]); // Only dispatch dependency

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

        // Prevent spam/empty
        const cleanMsg = msg.trim().slice(0, 100);

        push(ref(db, 'public/chat'), {
            sender: state.player.name,
            text: cleanMsg,
            depth: state.player.depth, // Show depth in chat
            timestamp: serverTimestamp()
        });
        setMsg('');
    };

    const handleBeacon = () => {
        const cost = 500;
        if (state.resources.gold < cost) {
            dispatch({ type: 'ADD_LOG', payload: "Ouro insuficiente para sinalizador." });
            return;
        }

        if (window.confirm(`Gastar ${cost} Orth para disparar um Sinalizador?`)) {
            dispatch({ type: 'ADD_GOLD', payload: -cost });
            push(ref(db, 'public/chat'), {
                sender: "SISTEMA",
                text: `SINALIZADOR: ${state.player.name} precisa de ajuda na camada ${state.player.depth}m!`,
                depth: state.player.depth,
                timestamp: serverTimestamp(),
                isSystem: true
            });
            dispatch({ type: 'ADD_LOG', payload: "Sinalizador disparado!" });
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
                <button
                    onClick={() => setShowLeaderboard(true)}
                    className="ml-2 bg-yellow-900/40 text-yellow-500 border border-yellow-700/50 rounded px-2 py-0.5 hover:bg-yellow-900/60 transition flex items-center gap-1"
                    title="Ranking de Profundidade"
                >
                    <Trophy size={10} />
                </button>
            </div>

            {/* Player List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-900/30">
                {players.map(p => {
                    // Check local proximity for Duo
                    const isClose = Math.abs(p.depth - state.player.depth) < 300;
                    return (
                        <div key={p.uid} className="bg-slate-800 p-2 rounded text-[10px] flex justify-between items-center border border-slate-700">
                            <div>
                                <span className="text-slate-200 font-bold">{p.name}</span>
                                <span className="text-purple-400 ml-1">Lvl {p.level}</span>
                                {isClose && p.uid !== 'me' && (
                                    <button
                                        onClick={() => dispatch({ type: 'SET_DUO_ID', payload: p.uid })}
                                        className="ml-2 bg-indigo-700 hover:bg-indigo-600 text-[8px] px-1 rounded text-white"
                                        title="Solicitar Vínculo"
                                    >
                                        DUO
                                    </button>
                                )}
                            </div>
                            <span className={`font-mono ${isClose ? 'text-emerald-400 font-bold' : 'text-cyan-400'}`}>{p.depth}m</span>
                        </div>
                    );
                })}
            </div>

            {/* Chat */}
            <div className="h-64 border-t border-slate-800 flex flex-col bg-slate-950">
                <div className="flex-1 overflow-y-auto p-2 text-[10px] space-y-2 font-mono" id="chat-box">
                    {chat.map((c, i) => (
                        <div key={i} className={`break-words ${c.isSystem ? 'bg-yellow-900/10 p-1 rounded border border-yellow-900/30' : ''}`}>
                            <span className="text-[9px] text-slate-500 mr-1">[{c.depth}m]</span>
                            <span className={`font-bold ${c.isSystem ? 'text-yellow-400' : 'text-cyan-400'}`}>{c.sender}:</span>
                            <span className={`text-slate-300 ml-1 ${c.isSystem ? 'text-yellow-100 italic' : ''}`}>{c.text}</span>
                        </div>
                    ))}
                    <div ref={(el) => el?.scrollIntoView({ behavior: "smooth" })}></div>
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
            {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
        </div>
    );
}
