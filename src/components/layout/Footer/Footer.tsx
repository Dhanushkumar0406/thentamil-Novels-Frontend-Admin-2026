import React, { useState } from 'react';
import { SOCIAL_LINKS } from '../../../utils/constants';
import YouTubeModal from '../../common/Modal/YouTubeModal';
import gmailLogo from '../../../assets/images/social/gmail-logo.png';
import facebookLogo from '../../../assets/images/social/facebook-logo.png';
import instagramLogo from '../../../assets/images/social/instagram-logo.png';
import youtubeLogo from '../../../assets/images/social/youtube-logo.png';
import logo from '../../../assets/images/brand/TTM NOVRLS.png';
import styles from './Footer.module.scss';

const Footer: React.FC = () => {
  const [showYouTubeModal, setShowYouTubeModal] = useState(false);

  const handleYouTubeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setShowYouTubeModal(true);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerTop}>
          {/* Logo on the left */}
          <div className={styles.footerLeft}>
            <img src={logo} alt="TTM Novels Logo" className={styles.footerLogo} />
          </div>

          {/* Follow Us - Centered */}
          <div className={styles.followSection}>
            <h3 className={styles.followTitle}>Follow Us</h3>
            <div className={styles.socialIcons}>
              <a href={SOCIAL_LINKS.EMAIL} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <img src={gmailLogo} alt="Gmail" />
              </a>

              <a href={SOCIAL_LINKS.FACEBOOK} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <img src={facebookLogo} alt="Facebook" />
              </a>

              <a href={SOCIAL_LINKS.INSTAGRAM} target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <img src={instagramLogo} alt="Instagram" />
              </a>

              <a href="#" onClick={handleYouTubeClick} className={styles.socialIcon}>
                <img src={youtubeLogo} alt="YouTube" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={styles.copyright}>
          © 2026 தேன்தமிழமுது. All rights reserved.
        </div>
      </div>

      {/* YouTube Modal */}
      <YouTubeModal isOpen={showYouTubeModal} onClose={() => setShowYouTubeModal(false)} />
    </footer>
  );
};

export default Footer;
