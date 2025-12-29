import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, Novel } from '../../../api';
import DataTable from '../../../components/admin/DataTable/DataTable';
import styles from './NovelManagement.module.scss';

interface NovelData extends Novel {
  [key: string]: unknown;
}

const NovelList = () => {
  const navigate = useNavigate();
  const [novels, setNovels] = useState<NovelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchNovels();
  }, [searchQuery, statusFilter]);

  const fetchNovels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.novels.getAll({
        search: searchQuery,
        status: statusFilter as 'ONGOING' | 'COMPLETED' | 'HIATUS' | '',
        page: 1,
        limit: 100
      });

      setNovels(response.items as NovelData[]);

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to load novels';
      console.error('Fetch novels error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (novel: NovelData) => {
    navigate(`/admin/novels/edit/${novel.id}`);
  };

  const handleDelete = async (novel: NovelData) => {
    // Confirm before deleting
    if (!window.confirm(`Are you sure you want to delete "${novel.title}"?`)) {
      return;
    }

    try {
      await adminApi.novels.delete(String(novel.id));

      // Refresh the list
      fetchNovels();
      alert('Novel deleted successfully');

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to delete novel';
      console.error('Delete novel error:', err);
      alert(errorMessage);
    }
  };

  const handleViewChapters = (novel: NovelData) => {
    navigate(`/admin/chapters?novelId=${novel.id}`);
  };

  // Table columns definition
  const columns = [
    {
      key: 'title',
      label: 'Title',
      render: (value: unknown) => <span className={styles.novelTitle}>{String(value)}</span>
    },
    {
      key: 'author',
      label: 'Author'
    },
    {
      key: 'genre',
      label: 'Genre',
      render: (value: unknown) => (
        <span className={styles.categoryBadge}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'totalChapters',
      label: 'Chapters',
      render: (value: unknown) => <span className={styles.chapterCount}>{value || 0}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: unknown) => (
        <span className={`${styles.statusBadge} ${styles[String(value)?.toLowerCase()]}`}>
          {String(value)}
        </span>
      )
    },
    {
      key: 'updatedAt',
      label: 'Last Updated',
      render: (value: unknown) => new Date(String(value)).toLocaleDateString()
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading novels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Novel Management</h1>
          <p className={styles.subtitle}>
            Manage all novels in the platform
          </p>
        </div>
        <button
          type="button"
          className={styles.createButton}
          onClick={() => navigate('/admin/novels/create')}
        >
          <span className={styles.buttonIcon}>➕</span>
          <span>Create Novel</span>
        </button>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search novels by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={styles.filterSelect}
          aria-label="Filter by status"
        >
          <option value="">All Status</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="HIATUS">Hiatus</option>
        </select>

        <button
          type="button"
          className={styles.refreshButton}
          onClick={fetchNovels}
          title="Refresh"
        >
          🔄
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className={styles.errorBanner}>
          <span className={styles.errorIcon}>⚠️</span>
          <span>{error}</span>
          <button type="button" onClick={fetchNovels} className={styles.retryLink}>
            Retry
          </button>
        </div>
      )}

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={novels}
        emptyMessage="No novels found. Create your first novel to get started!"
        actions={(novel: unknown) => (
          <>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.view}`}
              onClick={() => handleViewChapters(novel as NovelData)}
              title="View Chapters"
            >
              📖
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.edit}`}
              onClick={() => handleEdit(novel as NovelData)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              type="button"
              className={`${styles.actionButton} ${styles.delete}`}
              onClick={() => handleDelete(novel as NovelData)}
              title="Delete"
            >
              🗑️
            </button>
          </>
        )}
      />

      {/* Results count */}
      {novels.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.resultsCount}>
            Showing {novels.length} {novels.length === 1 ? 'novel' : 'novels'}
          </p>
        </div>
      )}
    </div>
  );
};

export default NovelList;
