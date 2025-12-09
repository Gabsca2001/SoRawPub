import React from 'react';
import Image from 'next/image';
import styles from './BentoSection.module.scss';

export default function BentoSection() {

    const handleScrollToMenu = () => {
        // Cerca l'elemento con id "menu" (che hai definito in IndexPage)
        const menuSection = document.getElementById('menu');

        if (menuSection) {
            // scrollIntoView è intelligente e funziona anche dentro i contenitori con overflow
            menuSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* --- SLIDE 1: PHILOSOPHY --- */}
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
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={styles.btnIcon} // Classe opzionale se vuoi controllarlo meglio
                        >
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg></button>
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

                    {/* 4. ARTEMIDE (Desktop Only - duplicato qui per layout desktop, nascosto mobile) */}
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

            {/* --- SLIDE 2: MIXOLOGY --- */}
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

                    {/* 8. BOX IBRIDO: FICO D'INDIA (Desktop) / ARTEMIDE (Mobile) */}
                    <div className={`${styles.item} ${styles.symbolBox} ${styles.bgDarkGreen} ${styles.mobileCompact}`}>
                        {/* SVG FICO (Solo Desktop: classe mobileHidden aggiunta) */}
                        <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animFloat} ${styles.mobileHidden}`}>
                            <ellipse cx="20" cy="24" rx="8" ry="12" fill="none" stroke="currentColor" strokeWidth="2" />
                            <ellipse cx="10" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-25 10 18)" />
                            <ellipse cx="30" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(25 30 18)" />
                            <circle cx="20" cy="10" r="2.5" fill="currentColor" />
                        </svg>

                        {/* IMMAGINE ARTEMIDE (Solo Mobile: classe desktopHidden aggiunta) */}
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
        </>
    );
}