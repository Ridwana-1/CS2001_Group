/**
 * ProtectedRoute Component
 * @author Sultan Jurabekov
 * @functionality Route protection component that:
 * - Checks user authentication status
 * - Redirects unauthorized users
 * - Handles loading states
 * - Manages route access control
 * @created February 12, 2024
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        // Verify token by making a request to profile endpoint
        await api.get('/auth/profile');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;