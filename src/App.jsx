import { useState } from 'react'
import { Route, Routes } from 'react-router'
import StartSide from './pages/StartSide'
import './App.css'

function App() {
  

  return (
    <Routes>
      <Route path="/" element={<StartSide />} />
      
    </Routes>
  )
}

export default App
