import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const userStr = params.get('user');
    const redirectPath = params.get('redirect');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));

        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to the specified path or dashboard
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Failed to parse user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, location]);

  return (
    <div className="auth-callback-container">
      <div className="loading-spinner"></div>
      <p>Completing authentication, please wait...</p>
    </div>
  );
};

export default AuthCallback;