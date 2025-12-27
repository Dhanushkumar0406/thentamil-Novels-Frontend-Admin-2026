import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.scss';

/**
 * Admin Header Component
 *
 * Top navigation bar for admin dashboard featuring:
 * - Mobile menu toggle
 * - User profile dropdown
 * - Logout functionality
 */

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/novels');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.email) return 'AD';
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className={styles.header}>
      {/* Mobile menu button */}
      <button
        className={styles.menuButton}
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <span className={styles.hamburger}>☰</span>
      </button>

      {/* Page title - can be made dynamic based on route */}
      <div className={styles.titleContainer}>
        <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      </div>

      {/* Right section - User profile */}
      <div className={styles.rightSection}>
        {/* User profile dropdown */}
        <div className={styles.profileContainer}>
          <button
            className={styles.profileButton}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            aria-label="User menu"
          >
            <div className={styles.avatar}>
              {getUserInitials()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.email?.split('@')[0] || 'Admin'}
              </span>
              <span className={styles.userRole}>
                {user?.role || 'ADMIN'}
              </span>
            </div>
            <span className={styles.chevron}>▼</span>
          </button>

          {/* Dropdown menu */}
          {showProfileMenu && (
            <>
              <div
                className={styles.dropdownOverlay}
                onClick={() => setShowProfileMenu(false)}
              />
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownEmail}>{user?.email}</p>
                  <span className={styles.dropdownRole}>{user?.role || 'ADMIN'}</span>
                </div>

                <div className={styles.dropdownDivider} />

                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/novels');
                  }}
                >
                  <span className={styles.dropdownIcon}>🏠</span>
                  <span>Main Site</span>
                </button>

                <div className={styles.dropdownDivider} />

                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                >
                  <span className={styles.dropdownIcon}>🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
