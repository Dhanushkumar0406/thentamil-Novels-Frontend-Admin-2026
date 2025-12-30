import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import styles from './NovelsPage.module.scss';
import NovelsCard from '../../components/NovelsCard/NovelsCard';
import { publicApi, Novel } from '../../api';

interface NovelCardData {
  id: number;
  title: string;
  author: string;
  image: string;
  novelUrl: string;
}

const NovelsPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [season, setSeason] = useState('winter');

  const [continueReadingNovels, setContinueReadingNovels] = useState<NovelCardData[]>([]);
  const [ongoingNovels, setOngoingNovels] = useState<NovelCardData[]>([]);
  const [completedNovels, setCompletedNovels] = useState<NovelCardData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else if (month >= 9 && month <= 11) setSeason('fall');
    else setSeason('winter');
    setError(null);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchNovels = async () => {
      try {
        setLoading(true);
        setError(null);

        const [ongoingResponse, completedResponse] = await Promise.all([
          publicApi.novels.getAll({ status: 'ONGOING', page: 1, limit: 6 }),
          publicApi.novels.getAll({ status: 'COMPLETED', page: 1, limit: 5 }),
        ]);

        // Only update state if component is still mounted
        if (!isMounted) return;

        const mapNovelToCard = (novel: Novel): NovelCardData => ({
          id: Number(novel.id),
          title: novel.title,
          author: novel.author,
          image: novel.coverImage,
          novelUrl: `/novel/${novel.id}`,
        });

        setOngoingNovels(ongoingResponse.items.map(mapNovelToCard));
        setCompletedNovels(completedResponse.items.map(mapNovelToCard));

        const continueReading = ongoingResponse.items.slice(0, 8).map(mapNovelToCard);
        setContinueReadingNovels(continueReading);

      } catch (err: unknown) {
        // Only update error state if component is still mounted
        if (!isMounted) return;

        const errorMessage = err && typeof err === 'object' && 'message' in err
          ? String(err.message)
          : 'Failed to load novels';
        setError(null);
        console.error('Error fetching novels:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchNovels();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  if (error) {
    return (
      <div className={`${styles.novelsContainer} ${styles[season]}`}>
        <Header onLoginClick={handleLoginClick} />
        <div className={styles.errorMessage}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.novelsContainer} ${styles[season]}`}>
      <Header onLoginClick={handleLoginClick} />
      <Carousel />

      {true ? (
        <div className={styles.loadingMessage}>
          Loading novels...
        </div>
      ) : (
        <>
          {continueReadingNovels.length > 0 && (
            <NovelsCard sectionTitle="Continue Reading" novels={continueReadingNovels} />
          )}
          {ongoingNovels.length > 0 && (
            <NovelsCard sectionTitle="Ongoing Novels" novels={ongoingNovels} />
          )}
          {completedNovels.length > 0 && (
            <NovelsCard sectionTitle="Completed Novels" novels={completedNovels} />
          )}
        </>
      )}

      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPage;
