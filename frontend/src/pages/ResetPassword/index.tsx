/**
 * ResetPassword Page Component
 * @author Sultan Jurabekov
 * @functionality Password reset page that handles:
 * - Email input for OTP request
 * - OTP verification
 * - New password setup
 * - Error handling
 * - Success notifications
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import styles from '../../styles/InputDesign.module.css';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/request-reset', { email });
      setSuccess('OTP has been sent to your email');
      setOtpSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        email,
        otp,
        newPassword: password,
      });

      setSuccess('Password has been reset successfully');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.div1}>
      <div className={styles.div2}>
        <div className={styles.div3}>
          <div className={styles.div4}>
            <h1 className={styles.h1}>Reset Password</h1>
            <p className={styles.p}>
              {otpSent 
                ? 'Enter the OTP sent to your email and set a new password'
                : 'Enter your email to receive an OTP'}
            </p>
          </div>
          {!otpSent ? (
            <form onSubmit={handleRequestOTP} className={styles.form}>
              <div className={styles.div5}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className={styles.form}>
              <div className={styles.div5}>
                <label htmlFor="otp" className={styles.label}>
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.div5}>
                <label htmlFor="password" className={styles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  required
                  minLength={6}
                />
              </div>
              <div className={styles.div5}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  required
                  minLength={6}
                />
              </div>
              {error && <p className={styles.error}>{error}</p>}
              {success && <p className={styles.success}>{success}</p>}
              <button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword; 