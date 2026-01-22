import React from 'react';
import { useGameState } from '../../context/GameContext';
import { LAYERS } from '../../lib/constants';

export default function GameLayout({ leftPanel, centerPanel, rightPanel }) {
    const { state } = useGameState();
    const depth = state.player.depth;

    // Determine current layer for background
    const currentLayer = LAYERS.find(l => depth >= l.min && depth <= l.max) || LAYERS[0];

    return (
        <div className={`relative flex h-screen w-full overflow-hidden ${currentLayer.bg} transition-colors duration-1000`}>
            {/* Background Overlay for depth effect */}
            <div className="absolute inset-0 bg-black/30 pointer-events-none" />

            {/* Main Container */}
            <div className="relative z-10 flex w-full h-full backdrop-blur-sm">

                {/* Left Panel: Status & Tycoon */}
                <aside className="w-full md:w-1/3 lg:w-1/4 h-full bg-abyss-900/90 border-r border-slate-800/50 flex flex-col p-4 shadow-2xl backdrop-blur-md overflow-hidden">
                    {leftPanel}
                </aside>

                {/* Center Panel: Visuals & Log */}
                <main className="flex-1 h-full relative flex flex-col min-w-0">
                    {centerPanel}
                </main>

                {/* Right Panel: Social */}
                <aside className="hidden md:flex w-72 h-full bg-abyss-900/90 border-l border-slate-800/50 flex-col z-20 shadow-2xl backdrop-blur-md">
                    {rightPanel}
                </aside>

            </div>

            {/* Mobile Nav / Overlay logic could go here */}
        </div>
    );
}
