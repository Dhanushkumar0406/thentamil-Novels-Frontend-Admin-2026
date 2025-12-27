import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../../services/API/adminMockService';
import StatCard from '../../../components/admin/StatCard/StatCard';
import styles from './AdminDashboard.module.scss';
import { DashboardStats } from '../../../types';

/**
 * AdminDashboard Component
 *
 * Main dashboard overview page showing:
 * - Key statistics (novels, chapters, users, subscriptions)
 * - Recent activity (optional)
 *
 * INTEGRATION POINT:
 * - Replace getDashboardStats() call with real API endpoint
 * - Currently using mock data from adminMockService.js
 */

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

      // TODO: Replace with real API call
      const response = await getDashboardStats();

      if (response.success) {
        setStats(response.data);
      } else {
        setError('Failed to load dashboard statistics');
      }
    } catch (err) {
      console.error('Dashboard stats error:', err);
      setError('An error occurred while loading statistics');
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
        <button className={styles.retryButton} onClick={fetchDashboardStats}>
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
        <button className={styles.refreshButton} onClick={fetchDashboardStats}>
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
          title="Subscriptions"
          value={stats.totalSubscriptions}
          icon="⭐"
          color="orange"
        />
      </div>

      {/* Recent Activity Section (Optional) */}
      {stats.recentActivity && stats.recentActivity.length > 0 && (
        <div className={styles.activitySection}>
          <h2 className={styles.sectionTitle}>Recent Activity</h2>
          <div className={styles.activityList}>
            {stats.recentActivity.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>📝</div>
                <div className={styles.activityContent}>
                  <p className={styles.activityAction}>{activity.action}</p>
                  <p className={styles.activityTime}>
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
