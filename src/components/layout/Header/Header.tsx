import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { translations } from '../../../translations';
import logo from '../../../assets/images/brand/TTM NOVRLS.png';
import styles from './Header.module.scss';

interface HeaderProps {
  onLoginClick?: () => void; // Made optional since we'll handle navigation internally
}

const Header: React.FC<HeaderProps> = ({ onLoginClick }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [showLanguage, setShowLanguage] = useState(false);

  const _t = translations[language];

  // Close dropdown when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target as Node)) {
        setIsLanguageDropdownOpen(false);
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsLanguageDropdownOpen(false);
      }
    };

    if (isLanguageDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isLanguageDropdownOpen]);

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsUserDropdownOpen(!isUserDropdownOpen);
    } else {
      // Use the prop callback if provided, otherwise navigate to login
      if (onLoginClick) {
        onLoginClick();
      } else {
        navigate('/login');
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  const scrollToFooter = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  };

  const _toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const _toggleLanguageDropdown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
  };

  const _handleLanguageChange = (lang: 'tamil' | 'english') => {
    changeLanguage(lang);
    setIsLanguageDropdownOpen(false);
    // Force re-render by scrolling to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* TOP ROW - Logo, Nav & Profile */}
          <div className={styles.topRow}>
            {/* LEFT - Logo & Navigation */}
            <div className={styles.leftSection}>
              <img src={logo} alt="Logo" className={styles.logo} onClick={() => navigate('/')} />

              <nav className={styles.desktopNav}>
                <span className={styles.navItem} onClick={() => navigate('/')}>Home</span>
                <span className={styles.navItem} onClick={() => navigate('/about')}>About us</span>
                <span className={styles.navItem} onClick={scrollToFooter}>Contact</span>
              </nav>
            </div>

            {/* RIGHT - Profile & Hamburger */}
            <div className={styles.rightSection}>
              {/* PROFILE/AUTH */}
              <div className={styles.userWrapper} ref={userDropdownRef}>
                <button
                  type="button"
                  className={styles.profileCircle}
                  onClick={handleAuthClick}
                  aria-label={isAuthenticated ? 'User menu' : 'Login'}
                >
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4" />
                    <path d="M5.5 21a6.5 6.5 0 0 1 13 0" />
                  </svg>
                </button>

                {isAuthenticated && isUserDropdownOpen && (
                  <div className={styles.userDropdown}>
                    <div className={styles.userInfo}>
                      <span className={styles.userName}>{user?.name}</span>
                      <span className={styles.userEmail}>{user?.email}</span>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    <button onClick={() => { navigate('/profile'); setIsUserDropdownOpen(false); }}>
                      Profile
                    </button>
                    {user?.role === 'ADMIN' && (
                      <button onClick={() => { navigate('/admin/dashboard'); setIsUserDropdownOpen(false); }}>
                        Admin Dashboard
                      </button>
                    )}
                    <div className={styles.dropdownDivider}></div>
                    <button onClick={handleLogout} className={styles.logoutButton}>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* HAMBURGER */}
              <button type="button" className={styles.hamburger} onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu">
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>

          {/* BOTTOM ROW - Theme, Language & Search */}
          <div className={styles.bottomRow}>
            <div className={styles.iconGroup}>
              {/* THEME TOGGLE */}
              <button
                type="button"
                className={styles.iconCircle}
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                )}
              </button>

              {/* SEARCH BAR WITH LANGUAGE */}
              <div className={styles.searchWrapper}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                  {/* LANGUAGE DROPDOWN INSIDE SEARCH */}
                  <div className={styles.langWrapper} ref={languageDropdownRef}>
                    <button
                      type="button"
                      className={styles.langIconButton}
                      onClick={(e) => {
                        e.preventDefault();
                        setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
                      }}
                      aria-label="Language"
                    >
                      <svg viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    </button>

                    {isLanguageDropdownOpen && (
                      <div className={styles.langDropdown}>
                        <span
                          className={language === 'tamil' ? styles.activeLanguage : ''}
                          onClick={() => {
                            changeLanguage('tamil');
                            setIsLanguageDropdownOpen(false);
                          }}
                        >
                          தமிழ் (Tamil)
                        </span>
                        <span
                          className={language === 'english' ? styles.activeLanguage : ''}
                          onClick={() => {
                            changeLanguage('english');
                            setIsLanguageDropdownOpen(false);
                          }}
                        >
                          English
                        </span>
                      </div>
                    )}
                  </div>

                  <svg viewBox="0 0 24 24" className={styles.searchIcon}>
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    placeholder={language === 'tamil' ? 'தேடுக...' : 'Search...'}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className={styles.clearButton}
                      onClick={() => setSearchQuery('')}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <span onClick={() => { navigate('/'); setIsMenuOpen(false); }}>Home</span>
            <span onClick={() => { navigate('/about'); setIsMenuOpen(false); }}>About us</span>
            <span onClick={() => { scrollToFooter(); setIsMenuOpen(false); }}>Contact</span>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
