'use client';

import React from 'react';
import Image from 'next/image';
import styles from './BentoSection.module.scss';

export default function BentoSectionTwo() {
  return (
    <div className={styles.bentoSlide}>
      <div className={styles.gridContainer}>

        {/* 5. LIMONE */}
        <div className={`${styles.item} ${styles.symbolBox} ${styles.bgGold} ${styles.mobileCompact}`}>
          <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animSpin}`}>
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
            <circle cx="20" cy="20" r="2" fill="currentColor" />
            <g stroke="currentColor" strokeWidth="1" opacity="0.8">
              <line x1="20" y1="2" x2="20" y2="18" /> <line x1="20" y1="22" x2="20" y2="38" />
              <line x1="2" y1="20" x2="18" y2="20" /> <line x1="22" y1="20" x2="38" y2="20" />
              <line x1="7" y1="7" x2="18" y2="18" /> <line x1="33" y1="33" x2="22" y2="22" />
              <line x1="33" y1="7" x2="22" y2="18" /> <line x1="7" y1="33" x2="18" y2="22" />
            </g>
          </svg>
        </div>

        {/* 6. TESTO ORIZZONTALE */}
        <div className={`${styles.item} ${styles.textCardHorizontal} ${styles.col2}`}>
          <h4>History & Modernity</h4>
          <p>
            Dimentica l'ordinario. Un viaggio sensoriale che unisce
            la storia dei nostri muri in pietra all'eleganza moderna.
          </p>
        </div>

        {/* 7. LOGO (Desktop Only) */}
        <div className={`${styles.item} ${styles.mobileHidden}`}>
          <Image
            src="/img2.jpeg"
            alt="Logo"
            fill
            className={styles.image}
          />
        </div>

        {/* 8. BOX IBRIDO: FICO D'INDIA / ARTEMIDE MOBILE */}
        <div className={`${styles.item} ${styles.symbolBox} ${styles.bgLightGreen} ${styles.mobileCompact}`}>
          <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animFloat} ${styles.mobileHidden}`}>
            <ellipse cx="20" cy="24" rx="8" ry="12" fill="none" stroke="currentColor" strokeWidth="2" />
            <ellipse cx="10" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-25 10 18)" />
            <ellipse cx="30" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(25 30 18)" />
            <circle cx="20" cy="10" r="2.5" fill="currentColor" />
          </svg>

          <Image
            src="/WhatsApp Image 2025-11-28 at 15.13.50 (3).jpeg"
            alt="Artemis Mobile"
            fill
            className={`${styles.image} ${styles.desktopHidden}`}
          />
        </div>

        {/* 9. PATTERN */}
        <div className={`${styles.item} ${styles.col2}`}>
          <Image
            src="/img44.jpg"
            alt="Pattern"
            fill
            className={styles.image}
          />
          <div className={styles.overlayText}>RAW</div>
        </div>

        {/* 10. SHAKER */}
        <div className={`${styles.item} ${styles.symbolBox} ${styles.bgCream} ${styles.mobileCompact}`}>
          <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animPulse}`} style={{ color: '#001a13' }}>
            <path d="M12 6 L28 6 L30 12 L10 12 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M10 12 L30 12 L28 34 C28 36 26 38 20 38 C14 38 12 36 12 34 Z" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="17" y="2" width="6" height="4" rx="1" fill="currentColor" />
            <line x1="11" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
          </svg>
        </div>

      </div>
    </div>
  );
}
