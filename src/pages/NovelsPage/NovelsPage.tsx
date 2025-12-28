import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import styles from './NovelsPage.module.scss';
import NovelsCard from '../../components/NovelsCard/NovelsCard';

const NovelsPage = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [season, setSeason] = useState('winter');

  // Set seasonal background
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setSeason('spring');
    else if (month >= 6 && month <= 8) setSeason('summer');
    else if (month >= 9 && month <= 11) setSeason('fall');
    else setSeason('winter');
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginModalOpen(false);
  };

  // Continue Reading Novels Data
  const continueReadingNovels = [
    {
      id: 1,
      title: 'தாள்பாட்டும் தேவதை',
      author: 'தென்மொழி',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=500&fit=crop',
      novelUrl: '/novel/thaalpaattum-devadhai',
    },
    {
      id: 2,
      title: 'ராட்சசனே',
      author: 'ஸ்வேதா',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop',
      novelUrl: '/novel/raatchasane',
    },
    {
      id: 3,
      title: 'கனவு காதல்',
      author: 'தென்மொழி',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
      novelUrl: '/novel/kanavu-kaadhal',
    },
    {
      id: 4,
      title: 'நிலவு ராகம்',
      author: 'மோகனா மொழி',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop',
      novelUrl: '/novel/nilavu-raagam',
    },
    {
      id: 5,
      title: 'தாள்பாட்டும் தேவதை',
      author: 'தென்மொழி',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=400&h=500&fit=crop',
      novelUrl: '/novel/thaalpaattum-devadhai',
    },
    {
      id: 6,
      title: 'ராட்சசனே',
      author: 'ஸ்வேதா',
      image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=500&fit=crop',
      novelUrl: '/novel/raatchasane',
    },
    {
      id: 7,
      title: 'கனவு காதல்',
      author: 'தென்மொழி',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
      novelUrl: '/novel/kanavu-kaadhal',
    },
    {
      id: 8,
      title: 'நிலவு ராகம்',
      author: 'மோகனா மொழி',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&h=500&fit=crop',
      novelUrl: '/novel/nilavu-raagam',
    },
  ];

  // Popular Novels Data
  const ongoingNovels = [
    {
      id: 1,
      title: 'காதல் மழை',
      author: 'ரமணி',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop',
      novelUrl: '/novel/kaadhal-mazhai',
    },
    {
      id: 2,
      title: 'இதயம் பேசுதே',
      author: 'கவிதா',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=500&fit=crop',
      novelUrl: '/novel/idhayam-pesuthe',
    },
    {
      id: 3,
      title: 'வானம் வசப்படும்',
      author: 'பிரியா',
      image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=500&fit=crop',
      novelUrl: '/novel/vaanam-vasappadum',
    },
    {
      id: 4,
      title: 'உன்னை நினைத்து',
      author: 'அருண்',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=500&fit=crop',
      novelUrl: '/novel/unnai-ninaithu',
    },
    {
      id: 5,
      title: 'மௌன ராகம்',
      author: 'சுரேஷ்',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=500&fit=crop',
      novelUrl: '/novel/mouna-raagam',
    },
    {
      id: 6,
      title: 'நெஞ்சில் ஓர் ஆலயம்',
      author: 'மீனா',
      image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=500&fit=crop',
      novelUrl: '/novel/nenjil-or-aalayam',
    },
  ];

  // Trending Novels Data
  const completedNovels = [
    {
      id: 1,
      title: 'உயிரே உறவே',
      author: 'வசந்த்',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop',
      novelUrl: '/novel/uyire-urave',
    },
    {
      id: 2,
      title: 'காற்றில் வரும் கீதம்',
      author: 'நித்யா',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop',
      novelUrl: '/novel/kaatril-varum-geetham',
    },
    {
      id: 3,
      title: 'மனதில் உறையும் மொழி',
      author: 'சங்கர்',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop',
      novelUrl: '/novel/manathil-uraiyum-mozhi',
    },
    {
      id: 4,
      title: 'இரவின் குரல்',
      author: 'லதா',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop',
      novelUrl: '/novel/iravin-kural',
    },
    {
      id: 5,
      title: 'பூக்கள் சொல்லும் கதை',
      author: 'ராஜேஷ்',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop',
      novelUrl: '/novel/pookkal-sollum-kathai',
    },
  ];

  return (
    <div className={`${styles.novelsContainer} ${styles[season]}`}>
      <Header onLoginClick={handleLoginClick} />
      <Carousel />
      <NovelsCard sectionTitle="Continue Reading" novels={continueReadingNovels} />
      <NovelsCard sectionTitle="Ongoing Novels" novels={ongoingNovels} />
      <NovelsCard sectionTitle="Completed Novels" novels={completedNovels} />

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPage;
