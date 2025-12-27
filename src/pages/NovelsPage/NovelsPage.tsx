import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header/Header';
import Carousel from '../../components/common/Carousel/Carousel';
import UserLogin from '../../components/common/UserLogin/UserLogin';
import styles from './NovelsPage.module.scss';

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

  return (
    <div className={`${styles.novelsContainer} ${styles[season]}`}>
      <Header onLoginClick={handleLoginClick} />
      <Carousel />

      {/* User Login Modal */}
      <UserLogin isOpen={isLoginModalOpen} onClose={handleCloseLogin} />
    </div>
  );
};

export default NovelsPage;
