import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import './index.css'
import Home from './pages'
import Header from './component/header'
import '../src/assets/style/public.css'
import Footer from './component/footer'
import About from './pages/about'
import Prodcut from './pages/prodcut'
import Contact from './pages/contact'
import Faq from './pages/faq'
function App() {  
  return (
    <Router>
     <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/product' element={<Prodcut />} />
        <Route path="faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </Router>
  )
}

export default App
