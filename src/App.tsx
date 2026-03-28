/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './AuthContext';
import { CartProvider } from './CartContext';
import { NotificationProvider } from './components/NotificationProvider';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import Checkout from './pages/Checkout';
import OrderTracking from './pages/OrderTracking';
import CustomerOrders from './pages/CustomerOrders';
import Dashboard from './pages/Dashboard';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import AdminSpecials from './pages/AdminSpecials';
import AdminSettings from './pages/AdminSettings';
import Cashier from './pages/Cashier';

import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/menu" element={<Layout><Menu /></Layout>} />
                <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
                <Route path="/orders" element={<ProtectedRoute><Layout><CustomerOrders /></Layout></ProtectedRoute>} />
                <Route path="/order/:id" element={<Layout><OrderTracking /></Layout>} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute adminOnly><Layout admin><Dashboard /></Layout></ProtectedRoute>} />
                <Route path="/admin/menu" element={<ProtectedRoute adminOnly><Layout admin><AdminMenu /></Layout></ProtectedRoute>} />
                <Route path="/admin/orders" element={<ProtectedRoute adminOnly><Layout admin><AdminOrders /></Layout></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute superAdminOnly><Layout admin><AdminUsers /></Layout></ProtectedRoute>} />
                <Route path="/admin/reports" element={<ProtectedRoute adminOnly><Layout admin><AdminReports /></Layout></ProtectedRoute>} />
                <Route path="/admin/specials" element={<ProtectedRoute adminOnly><Layout admin><AdminSpecials /></Layout></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute superAdminOnly><Layout admin><AdminSettings /></Layout></ProtectedRoute>} />
                <Route path="/cashier" element={<ProtectedRoute staffOnly><Cashier /></ProtectedRoute>} />
              </Routes>
              <Toaster 
                position="bottom-right" 
                visibleToasts={3}
                toastOptions={{ 
                  duration: 5000, 
                  style: { 
                    padding: '8px 12px',
                    fontSize: '11px',
                    borderRadius: '10px',
                    maxWidth: '280px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  } 
                }} 
              />
            </NotificationProvider>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

