import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../../api/auth";
import "./index.css";
import ThemeToggle from "../../components/ThemeToggle";
import { useTheme } from "../../contexts/ThemeContext";
import "../../styles/ThemeColors.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email });
      const response = await loginUser(email, password);
      console.log('Login response:', response);
      if (response) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user', JSON.stringify(response.user));
        
        console.log('Login successful, navigating to dashboard');
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      let errorMessage = "An error occurred during login. Please try again.";
      
      if (err.message.includes("User not found")) {
        errorMessage = "No account found with this email. Please check your email or register.";
      } else if (err.message.includes("Incorrect password")) {
        errorMessage = "The password you entered is incorrect. Please try again.";
      } else if (err.message.includes("Google Sign-In")) {
        errorMessage = "This account was created using Google. Please use Google Sign-In instead.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className={`registration-container ${theme === 'dark' ? 'dark-mode' : ''}`}>
      <div className="registration-content">
        <div className="flex justify-between items-center">
          <h1 className="registration-title">Welcome Back</h1>
          <ThemeToggle />
        </div>
        <p className="registration-subtitle">Sign in to continue</p>

        {error && (
          <div className="error-message" role="alert">
            <div className="error-icon">⚠️</div>
            <div className="error-text">{error}</div>
          </div>
        )}

        <form className="form-container" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input with Eye Icon inside */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="/reset-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`proceed-button ${!isFormValid || isLoading ? 'disabled' : ''}`}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center mt-6">
          <span className="text-secondary">Don't have an account? </span>
          <Link to="/register" className="text-blue-500 font-medium hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
