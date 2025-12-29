import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/layout/Header/Header';
import TotalChaptersSection from '../../components/TotalChaptersSection/TotalChaptersSection';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import styles from './NovelDetailPage.module.scss';
import { publicApi, Novel, Chapter } from '../../api';

interface ChapterCardData {
  id: number;
  chapterNumber: number;
  title: string;
  date: string;
  readTime: string;
  views: string;
  image: string;
  chapterUrl: string;
}

const NovelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<ChapterCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNovelData = async () => {
      if (!id) {
        setError('Invalid novel ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [novelData, chaptersData] = await Promise.all([
          publicApi.novels.getById(id),
          publicApi.chapters.getAll({ novelId: id, page: 1, limit: 100 }),
        ]);

        setNovel(novelData);

        const formattedChapters: ChapterCardData[] = chaptersData.items.map((chapter: Chapter) => ({
          id: Number(chapter.id),
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          date: new Date(chapter.createdAt).toLocaleDateString('ta-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }),
          readTime: `${Math.ceil(chapter.content.length / 1000)} min read`,
          views: '0 பார்வைகள்',
          image: novelData.coverImage,
          chapterUrl: `/novel/${id}/chapter/${chapter.id}`,
        }));

        setChapters(formattedChapters);

      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Failed to load novel details';
        setError(errorMessage);
        console.error('Error fetching novel:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNovelData();

    return () => {
      if (id) {
        publicApi.novels.getById;
        publicApi.chapters.getAll;
      }
    };
  }, [id]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleStartReading = () => {
    if (chapters.length > 0) {
      navigate(chapters[0].chapterUrl);
    }
  };

  const handleLike = () => {
    console.log('Liked');
  };

  const handleBookmark = () => {
    console.log('Bookmarked');
  };

  if (loading) {
    return (
      <div className={styles.novelDetailContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.loadingMessage}>
          Loading novel details...
        </div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className={styles.novelDetailContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.errorMessage}>
          {error || 'Novel not found'}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.novelDetailContainer}>
      <Header onLoginClick={handleLoginClick} />

      <section className={styles.novelBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.coverImageWrapper}>
            <img
              src={novel.coverImage}
              alt={novel.title}
              className={styles.coverImage}
            />
          </div>

          <div className={styles.novelInfo}>
            <h1 className={styles.novelTitle}>{novel.title}</h1>

            <p className={styles.authorName}>எழுதியவர் {novel.author}</p>

            <div className={styles.statsRow}>
              <span className={styles.statusBadge}>{novel.status}</span>
              <span className={styles.statItem}>{novel.totalChapters} அத்தியாயங்கள்</span>
              <span className={styles.statItem}>{novel.totalViews.toLocaleString()} பார்வைகள்</span>
              <span className={styles.statItem}>{novel.genre}</span>
            </div>

            <p className={styles.description}>{novel.description}</p>

            <div className={styles.actionButtons}>
              <button type="button" className={styles.startReadingBtn} onClick={handleStartReading}>
                <span className={styles.playIcon}>▶</span>
                Read Now
              </button>
              <button type="button" className={styles.likeBtn} onClick={handleLike}>
                <span className={styles.icon}>👍</span>
              </button>
              <button type="button" className={styles.bookmarkBtn} onClick={handleBookmark}>
                <span className={styles.icon}>+</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <TotalChaptersSection
        totalChapters={novel.totalChapters}
        chapters={chapters}
      />

      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelDetailPage;
