import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/InputDesign.module.css';
import api from '../../api/axios';
import { getAvatarByEmail } from '../../utils/avatars';

interface User {
  id: string;
  email: string;
  fullname: string;
  avatar?: string;
}

const Settings = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/users/me');
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Burger Menu */}
      <div className={styles.burgerMenu}>
        <img
          src={user?.avatar || getAvatarByEmail(user?.email || '')}
          alt="Profile"
          className={styles.burgerAvatar}
          onClick={handleBack}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-[80px] border-b border-[#E5E5E5] flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-semibold">Settings</h1>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Profile Section */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E5E5]">
              <h2 className="text-lg font-semibold mb-4">Profile</h2>
              <div className="flex items-center space-x-4">
                <img
                  src={user?.avatar || getAvatarByEmail(user?.email || '')}
                  alt="Profile"
                  className="w-[70px] h-[70px] rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold">{user?.fullname}</h3>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E5E5]">
              <h2 className="text-lg font-semibold mb-4">Account</h2>
              <div className="space-y-4">
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit Profile
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Notifications
                </button>
              </div>
            </div>

            {/* Appearance Settings */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E5E5]">
              <h2 className="text-lg font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Theme
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Chat Background
                </button>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E5E5]">
              <h2 className="text-lg font-semibold mb-4">Privacy</h2>
              <div className="space-y-4">
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Privacy Settings
                </button>
                <button className="w-full text-left py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                  Blocked Users
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg p-6 border border-[#E5E5E5]">
              <button className="w-full text-red-500 font-medium py-3 px-4 rounded-lg hover:bg-red-50 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;