import { useState, useEffect } from 'react';
import { adminApi, DashboardStats } from '../../../api';
import StatCard from '../../../components/admin/StatCard/StatCard';
import styles from './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await adminApi.dashboard.getStats();
      setStats(data);

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to load dashboard statistics';
      console.error('Dashboard stats error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>⚠️</div>
        <h2 className={styles.errorTitle}>Failed to Load Dashboard</h2>
        <p className={styles.errorMessage}>{error}</p>
        <button type="button" className={styles.retryButton} onClick={fetchDashboardStats}>
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (!stats) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyIcon}>📊</div>
        <h2 className={styles.emptyTitle}>No Data Available</h2>
        <p className={styles.emptyMessage}>Dashboard statistics are not available at the moment.</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard Overview</h1>
          <p className={styles.subtitle}>
            Welcome to the admin panel. Here's your platform overview.
          </p>
        </div>
        <button type="button" className={styles.refreshButton} onClick={fetchDashboardStats}>
          <span className={styles.refreshIcon}>🔄</span>
          <span>Refresh</span>
        </button>
      </div>

      {/* Statistics Grid */}
      <div className={styles.statsGrid}>
        <StatCard
          title="Total Novels"
          value={stats.totalNovels}
          icon="📚"
          color="black"
        />
        <StatCard
          title="Total Chapters"
          value={stats.totalChapters}
          icon="📖"
          color="Golden"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="purple"
        />
        <StatCard
          title="Total Views"
          value={stats.totalViews}
          icon="👁️"
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <a href="/admin/novels/create" className={styles.actionCard}>
            <span className={styles.actionIcon}>➕</span>
            <span className={styles.actionLabel}>Create Novel</span>
          </a>
          <a href="/admin/chapters" className={styles.actionCard}>
            <span className={styles.actionIcon}>📝</span>
            <span className={styles.actionLabel}>Manage Chapters</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
