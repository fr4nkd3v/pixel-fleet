// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'

import "nes.css/css/nes.min.css";
// import { WelcomePage } from './pages/WelcomePage';
import { GamePage } from './pages/GamePage';

function App() {
  return (
    <main className='app-container'>
      <GamePage />
    </main>
  )
}

export default App
