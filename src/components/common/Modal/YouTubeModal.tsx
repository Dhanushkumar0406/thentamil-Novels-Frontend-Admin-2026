import React from 'react';
import { ModalProps } from '../../../types';
import { YOUTUBE_CHANNELS } from '../../../utils/constants';
import youtubeLogo from '../../../assets/images/social/youtube-logo.png';
import styles from './YouTubeModal.module.scss';

const YouTubeModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>YouTube Channels</h2>
          <button className={styles.modalClose} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          {YOUTUBE_CHANNELS.map((channel, index) => (
            <a
              key={index}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.channelLink}
            >
              <img src={youtubeLogo} alt="YouTube" className={styles.channelIcon} />
              <span className={styles.channelName}>{channel.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default YouTubeModal;
