/**
 * UserSearch Component
 * @author Sultan Jurabekov
 * @functionality User search modal component that handles:
 * - Real-time user search by name or email
 * - Debounced search to prevent excessive API calls
 * - User selection for starting new chats
 * - Loading states and error handling
 * - Responsive design with mobile support
 */

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import api from '../../api/axios';
import styles from '../../styles/InputDesign.module.css';
import { getAvatarByEmail } from '../../utils/avatars';
import { useTheme } from '../../contexts/ThemeContext';

interface User {
  id: string;
  email: string;
  fullname: string;
  avatar?: string;
}

interface UserSearchProps {
  onClose: () => void;
  onSelect: (user: User) => void;
}

const UserSearch: React.FC<UserSearchProps> = ({ onClose, onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Небольшая задержка для дебаунса
        const timer = setTimeout(async () => {
          const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
          setResults(response.data.users || []);
          setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
      } catch (err) {
        console.error('Error searching users:', err);
        setError('Failed to search users. Please try again.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className={`${styles.searchModal} ${theme === 'dark' ? 'dark' : ''}`}>
      <div className={styles.searchContainer}>
        <div className={styles.searchInputContainer}>
          <FaSearch className={styles.searchIcon} />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name or email"
            className={styles.searchInputIOS}
          />
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>

      <div className={styles.searchResults}>
        {loading ? (
          <div className="p-4 text-center">
            <div className="inline-block w-6 h-6 border-2 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Searching...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-500">{error}</div>
        ) : !query.trim() ? (
          <div className="p-4 text-center text-gray-500">Start typing to search users</div>
        ) : results.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          results.map((user) => (
            <div
              key={user.id}
              className={styles.searchResultItem}
              onClick={() => onSelect(user)}
            >
              <img
                src={user.avatar || getAvatarByEmail(user.email)}
                alt={user.fullname}
                className={styles.searchResultAvatar}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getAvatarByEmail(user.email);
                }}
              />
              <div className={styles.searchResultInfo}>
                <div className={styles.searchResultName}>{user.fullname}</div>
                <div className={styles.searchResultEmail}>{user.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserSearch;