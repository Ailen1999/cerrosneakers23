import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import PrivateRoute from './components/auth/PrivateRoute';

// Admin Pages
import Dashboard from './pages/Dashboard';
import ProductsPage from './pages/ProductsPage';
import CreateProductPage from './pages/CreateProductPage';
import EditProductPage from './pages/EditProductPage';
import CarouselAdminPage from './pages/admin/CarouselAdminPage';
import CarouselFormPage from './pages/admin/CarouselFormPage';
import OrdersPage from './pages/OrdersPage';
import CreateOrderPage from './pages/CreateOrderPage';
import ConfigPage from './pages/admin/ConfigPage';

// Customer Store Pages
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import HelpCenterPage from './pages/HelpCenterPage';
import NotFoundPage from './pages/NotFoundPage';

import './index.css';

import { Toaster } from 'react-hot-toast';
import { ConfigProvider } from './contexts/ConfigContext';

function App() {
  return (
    <ConfigProvider>
      <AuthProvider>
        <Toaster position="top-right" />
        <Router>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Customer Store Routes (Public) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/producto/:id" element={<ProductDetailPage />} />
          <Route path="/ayuda" element={<HelpCenterPage />} />
          
          {/* Admin Routes (Protected) */}
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
          <Route path="/admin/products/create" element={<PrivateRoute><CreateProductPage /></PrivateRoute>} />
          <Route path="/admin/products/edit/:id" element={<PrivateRoute><EditProductPage /></PrivateRoute>} />
          
          {/* Carousel Admin Routes (Protected) */}
          <Route path="/admin/carousel" element={<PrivateRoute><CarouselAdminPage /></PrivateRoute>} />
          <Route path="/admin/carousel/create" element={<PrivateRoute><CarouselFormPage /></PrivateRoute>} />
          <Route path="/admin/carousel/edit/:id" element={<PrivateRoute><CarouselFormPage /></PrivateRoute>} />

          {/* Orders Admin Routes (Protected) */}
          <Route path="/admin/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
          <Route path="/admin/orders/new" element={<PrivateRoute><CreateOrderPage /></PrivateRoute>} />
          
          <Route path="/admin/config" element={<PrivateRoute><ConfigPage /></PrivateRoute>} />
          
          {/* 404 Not Found */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ConfigProvider>
  );
}

export default App;
