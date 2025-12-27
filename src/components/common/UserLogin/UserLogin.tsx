import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './UserLogin.module.scss';

interface UserLoginProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserLogin: React.FC<UserLoginProps> = ({ isOpen, onClose }) => {
  const { login, signup, authenticate } = useAuth(); // Added authenticate
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authAction, setAuthAction] = useState<'login' | 'signup' | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setAuthAction(null);

    try {
      if (isLogin) {
        // Use unified authentication for login
        const result = await authenticate({
          username: formData.username || formData.email,
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          setAuthAction(result.action || 'login');
          onClose();
          // Reset form
          setFormData({ username: '', email: '', password: '', confirmPassword: '', name: '' });

          // ROLE-BASED REDIRECT: ADMIN/EDITOR → dashboard, USER → novels
          const user = result.data?.user;
          if (user && (user.role === 'ADMIN' || user.role === 'EDITOR')) {
            // Redirect admin/editor to dashboard
            navigate('/admin/dashboard');
          } else {
            // Redirect regular users to novels page
            navigate('/novels');
          }
        } else {
          setError(result.error || 'Authentication failed');
        }
      } else {
        // Signup validation
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        // Use unified authentication for signup
        const result = await authenticate({
          username: formData.username || formData.email.split('@')[0],
          email: formData.email,
          password: formData.password,
          displayName: formData.name,
        });

        if (result.success) {
          setAuthAction(result.action || 'signup');
          onClose();
          // Reset form
          setFormData({ username: '', email: '', password: '', confirmPassword: '', name: '' });
        } else {
          setError(result.error || 'Authentication failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.label}>Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={styles.input}
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={styles.input}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.footer}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <button type="button" onClick={() => setIsLogin(false)} className={styles.switchButton}>
                Sign up here
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button type="button" onClick={() => setIsLogin(true)} className={styles.switchButton}>
                Login here
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
