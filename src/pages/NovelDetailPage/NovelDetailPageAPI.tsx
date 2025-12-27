import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import Header from '../../components/layout/Header/Header';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import { Novel, Chapter } from '../../types';
import styles from './NovelDetailPageAPI.module.scss';

// Import images
import thenmozhiCard from '../../assets/images/Novel Card/Thenmozhi Card.jpg';
import swethaCard from '../../assets/images/Novel Card/swetha card.jpg';
import mohanaCard from '../../assets/images/Novel Card/Mohana card.jpg';
import thenmozhiChapterImage from '../../assets/images/episodes_card/Thenmozhi_episodes.jpg';
import swethaChapterImage from '../../assets/images/episodes_card/swetha swe episodes.jpg';
import mohanaChapterImage from '../../assets/images/episodes_card/Mohanamozhi episodes.jpg';

// Image mappings
const coverImageMap = {
  '/assets/images/Novel Card/Thenmozhi Card.jpg': thenmozhiCard,
  '/assets/images/Novel Card/swetha card.jpg': swethaCard,
  '/assets/images/Novel Card/Mohana card.jpg': mohanaCard
};

const chapterImageMap = {
  'Thenmozhi': thenmozhiChapterImage,
  'Swetha Swe': swethaChapterImage,
  'Mohanaamozhi': mohanaChapterImage
};

const NovelDetailPageAPI = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [novel, setNovel] = useState<Novel | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper functions to safely extract string values from potentially multilingual content
  const getNovelTitle = (novel: Novel | null): string => {
    if (!novel) return '';
    if (typeof novel.title === 'string') return novel.title;
    return novel.title?.[language] || novel.title?.tamil || novel.title?.english || '';
  };

  const getNovelDescription = (novel: Novel | null): string => {
    if (!novel) return '';
    if (typeof novel.description === 'string') return novel.description;
    return novel.description?.[language] || novel.description?.tamil || novel.description?.english || '';
  };

  const getChapterTitle = (chapter: Chapter): string => {
    if (typeof chapter.title === 'string') return chapter.title;
    return chapter.title?.[language] || chapter.title?.tamil || chapter.title?.english || `Chapter ${chapter.chapterNumber}`;
  };

  // Fetch novel and chapters from API
  useEffect(() => {
    const fetchNovelData = async () => {
      try {
        setLoading(true);

        // Fetch novel details
        const novelResponse = await novelService.getNovelById(id);
        setNovel(novelResponse.novel);

        // Fetch chapters
        const chaptersResponse = await novelService.getNovelChapters(id);
        setChapters(chaptersResponse.chapters || []);

        setError(null);
      } catch (err) {
        console.error('Error fetching novel data:', err);
        setError('Failed to load novel details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchNovelData();
    }
  }, [id]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleChapterClick = (chapterId) => {
    navigate(`/novel/${id}/chapter/${chapterId}`);
  };

  const handleContinueReading = () => {
    if (chapters.length > 0) {
      navigate(`/novel/${id}/chapter/${chapters[0]._id}`);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      handleLoginClick();
      return;
    }

    try {
      await novelService.bookmarkNovel(id);
      // Optionally show success message
      alert(language === 'tamil' ? 'புக்மார்க் சேர்க்கப்பட்டது' : 'Bookmarked successfully');
    } catch (err) {
      console.error('Error bookmarking novel:', err);
      alert(language === 'tamil' ? 'பிழை ஏற்பட்டது' : 'Error occurred');
    }
  };

  const handleLike = async () => {
    if (!user) {
      handleLoginClick();
      return;
    }

    try {
      await novelService.likeNovel(id);
      // Optionally update UI to reflect like
      setNovel(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          likes: (prev.stats?.likes || 0) + 1
        }
      }));
    } catch (err) {
      console.error('Error liking novel:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.novelDetailContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.loading}>
          <p>{language === 'tamil' ? 'ஏற்றுகிறது...' : 'Loading...'}</p>
        </div>
      </div>
    );
  }

  if (error || !novel) {
    return (
      <div className={styles.novelDetailContainer}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.error}>
          <p>{error || 'Novel not found'}</p>
          <button onClick={() => navigate('/novels')}>
            {language === 'tamil' ? 'நாவல்களுக்குத் திரும்பு' : 'Back to Novels'}
          </button>
        </div>
      </div>
    );
  }

  const chapterImage = chapterImageMap[novel.author] || thenmozhiChapterImage;
  const coverImage = coverImageMap[novel.coverImage] || thenmozhiCard;

  return (
    <div className={styles.novelDetailContainer}>
      <Header onLoginClick={handleLoginClick} />

      <div className={styles.content}>
        {/* Novel Header Section */}
        <div className={styles.novelHeader}>
          <div className={styles.imageSection}>
            <img src={coverImage} alt={getNovelTitle(novel)} className={styles.novelImage} />
          </div>

          <div className={styles.infoSection}>
            {/* Title */}
            <h1 className={styles.novelTitle}>{getNovelTitle(novel)}</h1>

            {/* Author */}
            <div className={styles.authorSection}>
              <span className={styles.author}>{novel.author}</span>
            </div>

            {/* Genres/Tags */}
            <div className={styles.genres}>
              <span className={styles.genreTag}>{novel.genre}</span>
              {novel.tags?.slice(0, 3).map((tag, index) => (
                <span key={index} className={styles.genreTag}>{tag}</span>
              ))}
            </div>

            {/* Stats */}
            <div className={styles.stats}>
              <span>👁️ {novel.stats?.views || 0}</span>
              <span>❤️ {novel.stats?.likes || 0}</span>
              <span>🔖 {novel.stats?.bookmarks || 0}</span>
              <span>📖 {novel.totalChapters} {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'}</span>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionButtons}>
              <button className={styles.readButton} onClick={handleContinueReading}>
                {language === 'tamil' ? 'படிக்கத் தொடங்கு' : 'Start Reading'}
              </button>
              <button className={styles.bookmarkButton} onClick={handleBookmark}>
                🔖 {language === 'tamil' ? 'புக்மார்க்' : 'Bookmark'}
              </button>
              <button className={styles.likeButton} onClick={handleLike}>
                ❤️ {language === 'tamil' ? 'விரும்பு' : 'Like'}
              </button>
            </div>
          </div>
        </div>

        {/* Story Summary Section */}
        <div className={styles.storySection}>
          <h2 className={styles.sectionTitle}>
            {language === 'tamil' ? 'கதை சுருக்கம்' : 'Story Summary'}
          </h2>
          <div className={styles.storyContent}>
            <p className={styles.description}>
              {getNovelDescription(novel)}
            </p>
          </div>
        </div>

        {/* Chapters Section */}
        <div className={styles.chaptersSection}>
          <h2 className={styles.sectionTitle}>
            {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'} [{chapters.length}]
          </h2>
          <div className={styles.chaptersList}>
            {chapters.map((chapter) => (
              <div
                key={chapter._id}
                className={styles.chapterCard}
                onClick={() => handleChapterClick(chapter._id)}
              >
                <div className={styles.chapterImageWrapper}>
                  <img
                    src={chapterImage}
                    alt={getChapterTitle(chapter)}
                    className={styles.chapterImage}
                  />
                </div>
                <h3 className={styles.chapterTitle}>
                  {getChapterTitle(chapter)}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelDetailPageAPI;
