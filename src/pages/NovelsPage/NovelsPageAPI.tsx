import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../translations';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import novelService from '../../services/API/novelService';
import styles from './NovelsPage.module.scss';

// Import novel card images
import thenmozhiCard from '../../assets/images/Novel Card/Thenmozhi Card.jpg';
import swethaCard from '../../assets/images/Novel Card/swetha card.jpg';
import mohanaCard from '../../assets/images/Novel Card/Mohana card.jpg';

// Image mapping
const imageMap = {
  '/assets/images/Novel Card/Thenmozhi Card.jpg': thenmozhiCard,
  '/assets/images/Novel Card/swetha card.jpg': swethaCard,
  '/assets/images/Novel Card/Mohana card.jpg': mohanaCard
};

const NovelsPageAPI = () => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [novels, setNovels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language];

  // Fetch novels from API
  useEffect(() => {
    const fetchNovels = async () => {
      try {
        setLoading(true);
        const response = await novelService.getAllNovels();
        setNovels(response.novels || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching novels:', err);
        setError('Failed to load novels. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNovels();
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  const handleNovelClick = (novelId: string) => {
    navigate(`/novel/${novelId}`);
  };

  return (
    <div className={styles.novelsContainer}>
      <Header onLoginClick={handleLoginClick} />
      <Carousel />

      {/* Novels Content - Shows either Loading, Error, or Loaded State */}
      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <p>{language === 'tamil' ? 'ஏற்றுகிறது...' : 'Loading...'}</p>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              {language === 'tamil' ? 'மீண்டும் முயற்சிக்கவும்' : 'Retry'}
            </button>
          </div>
        ) : (
          <>
            {/* Continue Reading Section */}
            {novels.length > 0 && (
              <div className={styles.continueReadingSection}>
                <h2 className={styles.sectionHeader}>
                  Continue Reading
                </h2>
                <div className={styles.horizontalScroll}>
                  {novels.slice(0, 4).map(novel => (
                    <div className={styles.continueCard} key={novel._id} onClick={() => handleNovelClick(novel._id)}>
                      <div className={styles.continueCardImage}>
                        {novel.coverImage && (imageMap as any)[novel.coverImage] ? (
                          <img
                            src={(imageMap as any)[novel.coverImage]}
                            alt={novel.title}
                            className={styles.continueImage}
                          />
                        ) : (
                          <div className={styles.continuePlaceholder}>
                            <span>📖</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Novels Grid Section */}
            <div className={styles.grid}>
              {novels.map(novel => (
                <div className={styles.novelCard} key={novel._id} onClick={() => handleNovelClick(novel._id)}>
                  <div className={styles.cardImage}>
                    {novel.coverImage && (imageMap as any)[novel.coverImage] ? (
                      <img
                        src={(imageMap as any)[novel.coverImage]}
                        alt={novel.title}
                        className={styles.novelImage}
                      />
                    ) : (
                      <span className={styles.placeholder}>Novel Cover</span>
                    )}
                  </div>
                  <h3 className={styles.novelTitle}>
                    {novel.title}
                  </h3>
                  <p className={styles.novelAuthor}>by {novel.author}</p>
                  <div className={styles.novelStats}>
                    <span>📖 {novel.totalChapters} {language === 'tamil' ? 'அத்தியாயங்கள்' : 'Chapters'}</span>
                    <span>👁️ {novel.stats?.views || 0}</span>
                  </div>
                  <button
                    className={styles.readNowButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNovelClick(novel._id);
                    }}
                  >
                    {language === 'tamil' ? 'இப்போது படியுங்கள்' : 'READ NOW'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPageAPI;
