import React from 'react';

export default function LoginScreen({ onLogin }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyss-950 bg-[url('https://images.unsplash.com/photo-1516664923281-705a69772d1f?q=80&w=2070')] bg-cover bg-center">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

            <div className="relative bg-abyss-900/90 p-8 rounded-lg shadow-2xl border border-slate-600 max-w-md w-full text-center backdrop-blur-md">
                <h1 className="text-5xl text-relic-gold mb-2 fantasy-font tracking-widest drop-shadow-md animate-pulse-gold">ABISMO</h1>
                <p className="text-slate-400 mb-8 text-sm uppercase tracking-wide">Explore. Construa. Sobreviva.</p>

                <div className="space-y-4">
                    <button
                        onClick={onLogin}
                        className="w-full bg-slate-100 hover:bg-white text-slate-900 font-bold py-3 px-4 rounded transition shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Entrar com Google
                    </button>

                    <p className="text-xs text-slate-500 mt-4">
                        Ao entrar, você concorda com os riscos de descer ao Abismo.
                    </p>
                </div>
            </div>
        </div>
    );
}
