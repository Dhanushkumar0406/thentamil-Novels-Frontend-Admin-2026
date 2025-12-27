import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getChaptersByNovel, deleteChapter, getAllNovelsAdmin } from '../../../services/API/adminMockService';
import DataTable from '../../../components/admin/DataTable/DataTable';
import styles from './ChapterManagement.module.scss';

/**
 * ChapterList Component
 * Display and manage chapters for a selected novel
 * INTEGRATION: Replace API calls with real endpoints
 */

interface NovelData {
  id: string | number;
  title: string;
  [key: string]: any;
}

interface ChapterData {
  id: string | number;
  chapter_number: number;
  name: string;
  title: string;
  chapter_type: string;
  status: string;
  [key: string]: any;
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
      const response = await getAllNovelsAdmin();
      if (response.success) {
        setNovels(response.data.novels);
      }
    } catch (err) {
      console.error('Fetch novels error:', err);
    }
  };

  const fetchChapters = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getChaptersByNovel(selectedNovelId);
      if (response.success) {
        setChapters(response.data.chapters);
      } else {
        setError('Failed to load chapters');
      }
    } catch (err) {
      console.error('Fetch chapters error:', err);
      setError('An error occurred while loading chapters');
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
      const response = await deleteChapter(chapter.id);
      if (response.success) {
        fetchChapters();
        alert('Chapter deleted');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete chapter');
    }
  };

  const columns = [
    {
      key: 'chapter_number',
      label: '#',
      render: (value: any) => <span className={styles.chapterNum}>{value}</span>
    },
    { key: 'name', label: 'Name' },
    { key: 'title', label: 'Title' },
    {
      key: 'chapter_type',
      label: 'Type',
      render: (value: any) => <span className={styles.typeBadge}>{value}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: any) => (
        <span className={`${styles.statusBadge} ${styles[value?.toLowerCase()]}`}>{value}</span>
      )
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
            actions={(chapter: any) => (
              <>
                <button
                  className={`${styles.actionButton} ${styles.edit}`}
                  onClick={() => navigate(`/admin/chapters/edit/${chapter.id}`)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className={`${styles.actionButton} ${styles.delete}`}
                  onClick={() => handleDelete(chapter)}
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
