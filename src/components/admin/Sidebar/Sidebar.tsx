import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';

/**
 * Admin Sidebar Component
 *
 * Provides navigation for the admin dashboard with:
 * - Dashboard overview
 * - Novel management
 * - Chapter management
 *
 * Uses NavLink for active route highlighting
 */

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: '📊',
      label: 'Dashboard',
      description: 'Overview & Stats'
    },
    {
      path: '/admin/novels',
      icon: '📚',
      label: 'Novels',
      description: 'Manage novels'
    },
    {
      path: '/admin/chapters',
      icon: '📖',
      label: 'Chapters',
      description: 'Manage chapters'
    }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Logo/Brand */}
        <div className={styles.brand}>
          <h2 className={styles.brandTitle}>Admin Panel</h2>
          <p className={styles.brandSubtitle}>தமிழ் நாவல்கள்</p>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.nav}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.path} className={styles.menuItem}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.menuLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={onClose}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <div className={styles.labelContainer}>
                    <span className={styles.label}>{item.label}</span>
                    <span className={styles.description}>{item.description}</span>
                  </div>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Back to Main Site */}
        <div className={styles.footer}>
          <NavLink to="/novels" className={styles.backLink}>
            <span className={styles.icon}>🏠</span>
            <span className={styles.label}>Back to Main Site</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
