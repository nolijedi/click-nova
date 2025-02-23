import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { GameProvider } from './contexts/GameContext'
import { Toaster } from 'sonner'
import './index.css'

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GameProvider>
      <App />
      <Toaster position="top-right" richColors />
    </GameProvider>
  </React.StrictMode>,
)
