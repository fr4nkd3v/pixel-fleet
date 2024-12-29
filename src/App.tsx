import "./App.css";

import "nes.css/css/nes.min.css";
// import { WelcomePage } from "./pages/WelcomePage";
import { GamePage } from "./components/pages/game-page";

function App() {
  return (
    <main className="app-container">
      <GamePage />
    </main>
  );
}

export default App;
