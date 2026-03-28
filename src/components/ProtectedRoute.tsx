import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  superAdminOnly?: boolean;
  staffOnly?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  superAdminOnly = false, 
  staffOnly = false 
}: ProtectedRouteProps) {
  const { user, loading, isAdmin, isSuperAdmin, isStaff, isCashier } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-600/20 border-t-orange-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;
  
  if (isCashier && location.pathname !== '/cashier') {
    return <Navigate to="/cashier" replace />;
  }

  if (adminOnly && !isAdmin) return <Navigate to="/" />;
  if (superAdminOnly && !isSuperAdmin) return <Navigate to="/" />;
  if (staffOnly && !isStaff) return <Navigate to="/" />;

  return <>{children}</>;
}
