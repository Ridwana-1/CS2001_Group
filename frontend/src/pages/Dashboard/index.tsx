import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ChatInterface from '../../components/chat/ChatInterface';
import { useTheme } from '../../contexts/ThemeContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие токена в URL
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Сохраняем токен
      localStorage.setItem('token', token);
      // Очищаем URL от токена
      window.history.replaceState({}, document.title, '/dashboard');
    }

    // Проверяем наличие токена в localStorage
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      navigate('/login');
      return;
    }

    setIsLoading(false);
  }, [navigate, location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <Routes>
        <Route path="/*" element={<ChatInterface />} />
      </Routes>
    </div>
  );
};

export default Dashboard;