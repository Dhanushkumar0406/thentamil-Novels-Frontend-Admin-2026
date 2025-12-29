import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import Header from '../../components/layout/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useReadingProgress } from '../../context/ReadingProgressContext';
import { translations } from '../../translations';
import { publicApi, Chapter, Novel, ChapterNavigation } from '../../api';
import styles from './ChapterPage.module.scss';

const ChapterPage = () => {
  const { novelId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language: userLanguage } = useLanguage();
  const { updateProgress, completeNovel } = useReadingProgress();
  const [chapterData, setChapterData] = useState<Chapter | null>(null);
  const [novelData, setNovelData] = useState<Novel | null>(null);
  const [navigation, setNavigation] = useState<ChapterNavigation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const t = translations[userLanguage];

  const handleLoginClick = () => {
    // Handle login if needed
  };

  const handleBack = useCallback(() => {
    navigate(`/novel/${novelId}`);
  }, [novelId, navigate]);

  const handlePreviousChapter = useCallback(() => {
    if (navigation?.previous?.id) {
      navigate(`/novel/${novelId}/chapter/${navigation.previous.id}`);
    }
  }, [navigation, novelId, navigate]);

  const handleNextChapter = useCallback(() => {
    if (navigation?.next?.id) {
      navigate(`/novel/${novelId}/chapter/${navigation.next.id}`);
    }
  }, [navigation, novelId, navigate]);

  // Load chapter data, novel data, and navigation from API
  useEffect(() => {
    const loadChapterData = async () => {
      if (!chapterId || !novelId) {
        setError('Invalid chapter or novel ID');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [chapter, novel, nav] = await Promise.all([
          publicApi.chapters.getById(chapterId),
          publicApi.novels.getById(novelId),
          publicApi.chapters.getNavigation(chapterId),
        ]);

        setChapterData(chapter);
        setNovelData(novel);
        setNavigation(nav);

      } catch (err: unknown) {
        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Failed to load chapter';
        setError(errorMessage);
        console.error('Error fetching chapter:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChapterData();

    return () => {
      if (chapterId) {
        publicApi.chapters.getById;
        publicApi.chapters.getNavigation;
      }
    };
  }, [novelId, chapterId]);

  // Scroll to top when chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [chapterId]);

  // Update reading progress when chapter changes
  useEffect(() => {
    if (chapterData && novelData && novelId && chapterId) {
      updateProgress(novelId, Number(chapterId));

      // Check if this is the last chapter
      if (!navigation?.next && novelData) {
        // Mark as complete when reaching the last chapter
        completeNovel(novelId, novelData.title, novelData.coverImage, novelData.author);
      }
    }
  }, [chapterData, novelData, navigation, novelId, chapterId, updateProgress, completeNovel]);

  // Handle loading and not found states
  if (loading) {
    return (
      <div className={styles.chapterContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.content}>
          <div className={styles.chapterContent}>
            <h1 className={styles.chapterTitle}>{t.chapter.loading}</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error || !chapterData || !novelData) {
    return (
      <div className={styles.chapterContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.content}>
          <button type="button" className={styles.backButton} onClick={handleBack}>
            {t.chapter.back}
          </button>
          <div className={styles.chapterContent}>
            <h1 className={styles.chapterTitle}>{error || t.chapter.notFound}</h1>
            <p className={styles.placeholder}>{t.chapter.comingSoon}</p>
          </div>
        </div>
      </div>
    );
  }

  const showPrevButton = navigation?.previous !== null;
  const showNextButton = navigation?.next !== null;
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index} className={styles.paragraph}>
        {paragraph}
      </p>
    ));
  };

  return (
    <div className={styles.chapterContainer}>
      <Header onLoginClick={handleLoginClick} />

      <div className={styles.content}>
        <button type="button" className={styles.backButton} onClick={handleBack}>
          {t.chapter.back}
        </button>

        <div className={styles.chapterContent}>
          {/* Novel Title Heading */}
          <h1 className={styles.novelTitle}>{novelData.title}</h1>

          {/* Chapter Header */}
          <h2 className={styles.chapterHeading}>
            {t.chapter.title || 'Chapter'} {chapterData.chapterNumber}: {chapterData.title}
          </h2>

          <div className={styles.storyContent}>
            {formatContent(chapterData.content)}
          </div>

          {/* Chapter Navigation */}
          <div className={styles.chapterNavigation}>
            {showPrevButton ? (
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePreviousChapter}
              >
                {t.chapter.previous}
              </button>
            ) : (
              <div></div>
            )}

            {showNextButton ? (
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNextChapter}
              >
                {t.chapter.next}
              </button>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
