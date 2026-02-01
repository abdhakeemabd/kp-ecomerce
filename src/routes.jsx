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
import Cart from './pages/cart';
import NotFound from './pages/not-found';
import { AdminProvider } from './context/AdminContext';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { ProductProvider } from './context/ProductContext';
import AdminLogin from './pages/admin/AdminLogin';
import NewAdminDashboard from './pages/admin/NewAdminDashboard';
import NewAdminProducts from './pages/admin/NewAdminProducts';
import NewAdminOrders from './pages/admin/NewAdminOrders';
import NewAdminDelivery from './pages/admin/NewAdminDelivery';
import NewAdminContacts from './pages/admin/NewAdminContacts';
import OrderDetails from './pages/admin/OrderDetails';
import ProtectedRoute from './component/ProtectedRoute';
import AdminRedirect from './component/AdminRedirect';

// Layout wrapper for public pages
function PublicLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

function HomeRoutes() {
  return (
    <AdminProvider>
      <UserProvider>
        <ProductProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
            <Routes>
              {/* Admin Routes - No Header/Footer */}
              <Route path='/admin' element={<AdminRedirect />} />
              <Route path='/admin/login' element={<AdminLogin />} />
              <Route 
                path='/admin/dashboard' 
                element={
                  <ProtectedRoute>
                    <NewAdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/admin/products' 
                element={
                  <ProtectedRoute>
                    <NewAdminProducts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/admin/orders' 
                element={
                  <ProtectedRoute>
                    <NewAdminOrders />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/admin/orders/:orderId' 
                element={
                  <ProtectedRoute>
                    <OrderDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/admin/delivery' 
                element={
                  <ProtectedRoute>
                    <NewAdminDelivery />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path='/admin/contacts' 
                element={
                  <ProtectedRoute>
                    <NewAdminContacts />
                  </ProtectedRoute>
                } 
              />

              {/* Public Routes - With Header/Footer */}
              <Route path='/' element={<PublicLayout><Home /></PublicLayout>} />
              <Route path='/about' element={<PublicLayout><About /></PublicLayout>} />
              <Route path='/product' element={<PublicLayout><Prodcut /></PublicLayout>} />
              <Route path='/product-view/:id' element={<PublicLayout><ProdcutView /></PublicLayout>} />
              <Route path='/cart' element={<PublicLayout><Cart /></PublicLayout>} />
              <Route path='/faq' element={<PublicLayout><Faq /></PublicLayout>} />
              <Route path='/contact' element={<PublicLayout><Contact /></PublicLayout>} />
              <Route path='/profile' element={<PublicLayout><Profile /></PublicLayout>} />
              <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  </AdminProvider>
  )
}

export default HomeRoutes
