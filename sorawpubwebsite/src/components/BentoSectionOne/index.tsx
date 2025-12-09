'use client';

import React from 'react';
import Image from 'next/image';
import styles from './BentoSection.module.scss';

export default function BentoSectionOne() {
  const handleScrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.bentoSlide}>
      <div className={styles.gridContainer}>

        {/* 1. TESTO VERTICALE */}
        <div className={`${styles.item} ${styles.textCardVertical} ${styles.col2} ${styles.row2}`}>
          <div>
            <span className={styles.decoNumber}>01</span>
            <h3>Racconto <br /> Liquido</h3>
            <p>
              Ogni drink è un racconto liquido, un'opera d'arte creata
              con ingredienti autentici della Sicilia.
            </p>
          </div>
          <button
            className={styles.arrowBtn}
            onClick={handleScrollToMenu}
            aria-label='Vai al menù'
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.btnIcon}
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {/* 2. RENDER */}
        <div className={`${styles.item} ${styles.row2} ${styles.mobileOrder1}`}>
          <Image
            src="/img1.jpeg"
            alt="Interior"
            fill
            className={styles.image}
          />
          <div className={styles.overlayText} style={{ fontSize: '3rem' }}>RAW</div>
        </div>

        {/* 3. COPPA MARTINI */}
        <div className={`${styles.item} ${styles.symbolBox} ${styles.bgPrimary} ${styles.mobileCompact}`}>
          <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animTilt}`}>
            <path d="M5 8 L20 24 L35 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 8 C5 6 35 6 35 8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
            <path d="M8 11 L20 22 L32 11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <path d="M20 24 L20 36" stroke="currentColor" strokeWidth="2" />
            <path d="M12 36 L28 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="20" y1="24" x2="26" y2="16" stroke="currentColor" strokeWidth="1" />
            <circle cx="26" cy="16" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* 4. ARTEMIDE (Desktop Only) */}
        <div className={`${styles.item} ${styles.mobileHidden}`}>
          <Image
            src="/WhatsApp Image 2025-11-28 at 15.13.50 (3).jpeg"
            alt="Artemis"
            fill
            className={styles.image}
          />
        </div>

      </div>
    </div>
  );
}
