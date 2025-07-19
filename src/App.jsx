import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import './index.css'
import Home from './pages'
import Header from './component/header'
import '../src/assets/style/public.css'
function App() {  
  return (
    <BrowserRouter>
     <Header />
      <Routes>
        <Route index element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
