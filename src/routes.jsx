import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages';
import Header from './component/header';
import '../src/assets/style/public.css';
import Footer from './component/footer';
import About from './pages/about';
import Prodcut from './pages/prodcut';
import Contact from './pages/contact';
import Faq from './pages/faq';
import ProdcutView from './pages/prodcut-view';
import ScrollToTop from './component/scrool-totop';
import Profile from './component/profile';
import NotFound from './pages/not-found';

function HomeRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/product' element={<Prodcut />} />
        <Route path='/product-view' element={<ProdcutView />} />
        <Route path='/faq' element={<Faq />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/profile' element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default HomeRoutes
