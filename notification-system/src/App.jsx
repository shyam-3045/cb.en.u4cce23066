import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import {QueryClient , QueryClientProvider} from "@tanstack/react-query"
import { HomePage } from './pages/HomePage'

const queryClient = new QueryClient()

function App() {
  

  return (
    <QueryClientProvider client={queryClient}>
      <HomePage/>
    </QueryClientProvider>
  )
}

export default App
