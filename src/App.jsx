import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './index.css';
import '../src/assets/style/public.css';

import Header from './component/header';
import Footer from './component/footer';
import ScrollToTop from './component/scrool-totop';
import Profile from './component/profile';
import Home from './pages';
import About from './pages/about';
import Product from './pages/prodcut';
import ProductView from './pages/prodcut-view';
import Contact from './pages/contact';
import Faq from './pages/faq';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product-view" element={<ProductView />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
