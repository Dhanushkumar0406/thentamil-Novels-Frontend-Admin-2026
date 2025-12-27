import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import AdminHeader from '../AdminHeader/AdminHeader';
import styles from './AdminLayout.module.scss';

/**
 * AdminLayout Component
 *
 * Main layout wrapper for all admin pages featuring:
 * - Responsive sidebar navigation
 * - Top header with user profile
 * - Main content area for nested routes
 *
 * This layout is used by all admin routes via React Router's <Outlet />
 */

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar navigation */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Top header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Page content - rendered by nested routes */}
        <main className={styles.pageContent}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
