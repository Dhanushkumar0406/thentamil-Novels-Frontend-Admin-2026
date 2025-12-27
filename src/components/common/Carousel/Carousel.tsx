import React from 'react';
import styles from './Carousel.module.scss';

// Import images with correct relative path
import swethaImg from '../../../assets/images/prathilipi/swetha swe.jpg';
import mohanaImg from '../../../assets/images/prathilipi/mohanamozhi.jpg';
import thenImg from '../../../assets/images/prathilipi/thenmozhi.jpg';

interface Author {
  name: string;
  image: string;
  link: string;
}

const Carousel: React.FC = () => {
  const authors: Author[] = [
    {
      name: 'Swetha swe',
      image: swethaImg,
      link: 'https://tamil.pratilipi.com/user/%F0%9F%92%99swetha%F0%9F%92%99-8cuvz20w13'
    },
    {
      name: 'Thenmozhi',
      image: thenImg,
      link: 'https://tamil.pratilipi.com/user/%E2%9C%8D%EF%B8%8F%E0%AE%A4%E0%AF%87%E0%AE%A9%E0%AF%8D%E0%AE%AE%E0%AF%8A%E0%AE%B4%E0%AE%BF-%E2%9C%8D%EF%B8%8F-34-thenmozhi-34-u0958h9i3f?utm_campaign=authorprofile_share&utm_source=ios'
    },
    {
      name: 'Mohanaamozhi',
      image: mohanaImg,
      link: 'https://tamil.pratilipi.com/user/%E2%9C%8D%EF%B8%8F-%E0%AE%AE%E0%AF%8B%E0%AE%95%E0%AE%A9%E0%AE%BE-%E2%9C%8D%EF%B8%8F-697n99g2nt'
    }
  ];

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselTrack}>
          <div className={styles.carouselSlide}>
            <div className={styles.slideContentWrapper}>
              {/* Title */}
              <h2 className={styles.carouselTitle}>
                Follow us on Pratilipi for more stories!
              </h2>

              {/* Authors Grid */}
              <div className={styles.authorsGrid}>
                {authors.map((author, index) => (
                  <a
                    key={index}
                    href={author.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.authorCard}
                  >
                    <div className={styles.authorImageWrapper}>
                      <img
                        src={author.image}
                        alt={author.name}
                        className={styles.authorImage}
                      />
                    </div>
                    <h3 className={styles.authorName}>{author.name}</h3>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
