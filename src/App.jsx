import React from 'react';
import { GameProvider } from './context/GameContext';
import GameLayout from './components/layout/GameLayout';
import { useGameLoop } from './hooks/useGameLoop';
import { useFirebase } from './hooks/useFirebase';

// Features
import StatusPanel from './features/exploration/StatusPanel';
import VisualPanel from './features/exploration/VisualPanel';
import SocialPanel from './features/social/SocialPanel';
import LoginScreen from './components/auth/LoginScreen';
import EventModal from './features/exploration/EventModal';
import CombatModal from './features/combat/CombatModal';
import DeathModal from './features/exploration/DeathModal';

function GameContent() {
  // Initialize hooks inside Provider
  useGameLoop();
  const { user, loading, loginWithGoogle } = useFirebase();

  if (loading) return <div className="h-screen bg-abyss-950 flex items-center justify-center text-relic-gold font-mono animate-pulse">Carregando Abismo...</div>;

  if (!user) {
    return <LoginScreen onLogin={loginWithGoogle} />;
  }

  return (
    <>
      <GameLayout
        leftPanel={<StatusPanel />}
        centerPanel={<VisualPanel />}
        rightPanel={<SocialPanel />}
      />
      <EventModal />
      <CombatModal />
      <DeathModal />
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}

export default App;
