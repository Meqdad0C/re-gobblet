import ReactDOM from 'react-dom/client'
import App from '@/App.tsx'
import './index.css'
import GameProvider from './contexts/game-context.tsx'
import OptionsProvider from './contexts/options-context.tsx'
import React from 'react'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <GameProvider>
      <OptionsProvider>
        <App />
      </OptionsProvider>
    </GameProvider>
)
