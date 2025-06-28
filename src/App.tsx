import "./App.css";

import "nes.css/css/nes.min.css";
import { WelcomePage } from "./components/pages/welcome-page";
import { useState } from "react";
import { GamePage } from "./components/pages/game-page";
import { TView } from "./types";

function App() {
  const [view, setView] = useState<TView>('welcome');

  return (
    <main
      className="app-container"
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      {view === 'welcome' && <WelcomePage onPlay={() => setView('game')} />}
      {view === 'game' && <GamePage />}
    </main>
  );
}

export default App;
