import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminApi, Novel, Chapter } from '../../../api';
import DataTable from '../../../components/admin/DataTable/DataTable';
import styles from './ChapterManagement.module.scss';

interface NovelData extends Novel {
  [key: string]: unknown;
}

interface ChapterData extends Chapter {
  [key: string]: unknown;
}

const ChapterList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const novelIdParam = searchParams.get('novelId');

  const [novels, setNovels] = useState<NovelData[]>([]);
  const [selectedNovelId, setSelectedNovelId] = useState<string>(novelIdParam || '');
  const [chapters, setChapters] = useState<ChapterData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNovels();
  }, []);

  // Update selectedNovelId when URL parameter changes
  useEffect(() => {
    if (novelIdParam && novelIdParam !== selectedNovelId) {
      setSelectedNovelId(novelIdParam);
    }
  }, [novelIdParam]);

  useEffect(() => {
    if (selectedNovelId) {
      fetchChapters();
    } else {
      setChapters([]);
    }
  }, [selectedNovelId]);

  const fetchNovels = async () => {
    try {
      const response = await adminApi.novels.getAll({ page: 1, limit: 100 });
      setNovels(response.items as NovelData[]);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to load novels';
      console.error('Fetch novels error:', err);
      setError(errorMessage);
    }
  };

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminApi.chapters.getAll({
        novelId: selectedNovelId,
        page: 1,
        limit: 100
      });

      setChapters(response.items as ChapterData[]);

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to load chapters';
      console.error('Fetch chapters error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleNovelChange = (novelId: string) => {
    setSelectedNovelId(novelId);
    setSearchParams(novelId ? { novelId } : {});
  };

  const handleDelete = async (chapter: ChapterData) => {
    if (!window.confirm(`Delete chapter "${chapter.title}"?`)) return;

    try {
      await adminApi.chapters.delete(String(chapter.id));
      fetchChapters();
      alert('Chapter deleted successfully');

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to delete chapter';
      console.error('Delete error:', err);
      alert(errorMessage);
    }
  };

  const columns = [
    {
      key: 'chapterNumber',
      label: '#',
      render: (value: unknown) => <span className={styles.chapterNum}>{String(value)}</span>
    },
    { key: 'title', label: 'Title' },
    {
      key: 'createdAt',
      label: 'Created',
      render: (value: unknown) => new Date(String(value)).toLocaleDateString()
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      render: (value: unknown) => new Date(String(value)).toLocaleDateString()
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Chapter Management</h1>
          <p className={styles.subtitle}>Manage chapters for each novel</p>
        </div>
      </div>

      <div className={styles.controls}>
        <select
          value={selectedNovelId}
          onChange={(e) => handleNovelChange(e.target.value)}
          className={styles.novelSelect}
          aria-label="Select a novel"
        >
          <option value="">Select a novel...</option>
          {novels.map(novel => (
            <option key={novel.id} value={novel.id}>{novel.title}</option>
          ))}
        </select>

        {selectedNovelId && (
          <button
            type="button"
            className={styles.createButton}
            onClick={() => navigate(`/admin/chapters/create?novelId=${selectedNovelId}`)}
          >
            <span>➕</span> Add Chapter
          </button>
        )}
      </div>

      {selectedNovelId ? (
        loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading chapters...</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={chapters}
            emptyMessage="No chapters found. Add your first chapter!"
            actions={(chapter: unknown) => (
              <>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.edit}`}
                  onClick={() => navigate(`/admin/chapters/edit/${(chapter as ChapterData).id}`)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.delete}`}
                  onClick={() => handleDelete(chapter as ChapterData)}
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          />
        )
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📖</div>
          <p>Please select a novel to manage its chapters</p>
        </div>
      )}
    </div>
  );
};

export default ChapterList;
