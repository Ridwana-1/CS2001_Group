/**
 * Settings Page Component
 * @author Sultan Jurabekov
 * @functionality User settings page that handles:
 * - User profile display and management
 * - Theme switching (dark/light mode)
 * - Account management
 * - Logout functionality
 * - Responsive design with mobile support
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from '../../styles/InputDesign.module.css';
import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/ThemeColors.css';
import { FaCog, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import useAvatar from '../../hooks/useAvatar';

const Settings: React.FC = () => {
  const [user, setUser] = useState<{
    id: string;
    fullname: string;
    email: string;
    avatar?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBurgerMenu, setShowBurgerMenu] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);
  const avatarPath = useAvatar(user?.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowBurgerMenu(false);
      }
    };

    if (showBurgerMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showBurgerMenu]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/auth/profile');
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error logging out:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Burger Menu */}
      <div ref={menuRef} className={styles.burgerMenu}>
        <img
          src={avatarPath}
          alt="Profile"
          className={styles.burgerAvatar}
          onClick={() => setShowBurgerMenu(!showBurgerMenu)}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || '')}&background=random`;
          }}
        />

        {/* Burger Menu Dropdown */}
        {showBurgerMenu && (
          <div className={styles.menuDropdown}>
            <div className={styles.menuItem} onClick={() => navigate('/dashboard')}>
              <FaCog />
              <span>Chats</span>
            </div>
            <div className={styles.menuItem} onClick={toggleTheme}>
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div
              className={`${styles.menuItem} ${styles.danger}`}
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>

      <div className={styles.settingsContainer}>
        <h1 className={styles.settingsTitle}>Settings</h1>

        <div className={styles.settingsSection}>
          <h2 className={styles.settingsSectionTitle}>Profile</h2>
          <div className={styles.profileInfo}>
            <div className={styles.avatarContainer}>
              <img
                src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || '')}&background=random`}
                alt="Profile"
                className={styles.avatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || '')}&background=random`;
                }}
              />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.fullname}</p>
              <p className={styles.userEmail}>{user?.email}</p>
            </div>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h2 className={styles.settingsSectionTitle}>Appearance</h2>
          <div className={styles.themeToggle}>
            <span className={styles.themeLabel}>Dark Mode</span>
            <button
              onClick={toggleTheme}
              className={styles.themeButton}
            >
              {theme === 'dark' ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        <div className={styles.settingsSection}>
          <h2 className={styles.settingsSectionTitle}>Account</h2>
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;