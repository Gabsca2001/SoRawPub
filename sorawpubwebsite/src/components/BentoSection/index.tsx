import React from 'react';
import Image from 'next/image';
import styles from './BentoSection.module.scss';

export default function BentoSection() {
    return (
        <>
            {/* --- SLIDE 1: PHILOSOPHY (100vh) --- */}
            <div className={styles.bentoSlide}>
                <div className={styles.gridContainer}>
                    
                    {/* Col 1-2: Testo Verticale (ORA PIÙ LARGO -> 2 Colonne) */}
                    <div className={`${styles.item} ${styles.textCardVertical} ${styles.col2} ${styles.row2}`}>
                        <div>
                            <span className={styles.decoNumber}>01</span>
                            <h3>Racconto <br/> Liquido</h3>
                            <p>
                                Ogni drink è un racconto liquido, un'opera d'arte creata 
                                con ingredienti autentici della Sicilia.
                            </p>
                        </div>
                        <button className={styles.arrowBtn}>→</button>
                    </div>

                    {/* Col 3: Render (ORA PIÙ STRETTO -> 1 Colonna) */}
                    <div className={`${styles.item} ${styles.row2}`}>
                        <Image 
                            src="/img1.jpeg" 
                            alt="Interior"
                            fill
                            className={styles.image}
                        />
                         <div className={styles.overlayText} style={{fontSize: '3rem'}}>RAW</div>
                    </div>

                    {/* Col 4, Riga 1: Coppa Martini */}
                    <div className={`${styles.item} ${styles.symbolBox} ${styles.bgPrimary}`}>
                        <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animTilt}`}>
                            <path d="M5 8 L20 24 L35 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M5 8 C5 6 35 6 35 8" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                            <path d="M8 11 L20 22 L32 11" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.7"/>
                            <path d="M20 24 L20 36" stroke="currentColor" strokeWidth="2"/>
                            <path d="M12 36 L28 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            <line x1="20" y1="24" x2="26" y2="16" stroke="currentColor" strokeWidth="1"/>
                            <circle cx="26" cy="16" r="2" fill="currentColor"/>
                        </svg>
                    </div>

                    {/* Col 4, Riga 2: Artemide */}
                    <div className={styles.item}>
                        <Image 
                            src="/WhatsApp Image 2025-11-28 at 15.13.50 (3).jpeg" 
                            alt="Artemis"
                            fill
                            className={styles.image}
                        />
                    </div>

                </div>
            </div>

            {/* --- SLIDE 2: RIMANE INVARIATA --- */}
            <div className={styles.bentoSlide}>
                <div className={styles.gridContainer}>
                    {/* ... copia il contenuto della slide 2 precedente ... */}
                    {/* Riga 1, Col 1: Limone */}
                    <div className={`${styles.item} ${styles.symbolBox} ${styles.bgGold}`}>
                        <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animSpin}`}>
                            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2,2" opacity="0.6"/>
                            <circle cx="20" cy="20" r="2" fill="currentColor"/>
                            <g stroke="currentColor" strokeWidth="1" opacity="0.8">
                                <line x1="20" y1="2" x2="20" y2="18"/> <line x1="20" y1="22" x2="20" y2="38"/>
                                <line x1="2" y1="20" x2="18" y2="20"/> <line x1="22" y1="20" x2="38" y2="20"/>
                                <line x1="7" y1="7" x2="18" y2="18"/> <line x1="33" y1="33" x2="22" y2="22"/>
                                <line x1="33" y1="7" x2="22" y2="18"/> <line x1="7" y1="33" x2="18" y2="22"/>
                            </g>
                        </svg>
                    </div>

                    {/* Riga 1, Col 2-3: Testo Orizzontale */}
                    <div className={`${styles.item} ${styles.textCardHorizontal} ${styles.col2}`}>
                        <h4>History & Modernity</h4>
                        <p>
                            Dimentica l'ordinario. Un viaggio sensoriale che unisce 
                            la storia dei nostri muri in pietra all'eleganza moderna.
                        </p>
                    </div>

                    {/* Riga 1, Col 4: Logo */}
                    <div className={styles.item}>
                         <Image 
                            src="/img2.jpeg" 
                            alt="Logo"
                            fill
                            className={styles.image}
                        />
                    </div>

                    {/* Riga 2, Col 1: Fico d'India */}
                    <div className={`${styles.item} ${styles.symbolBox} ${styles.bgDarkGreen}`}>
                         <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animFloat}`}>
                            <ellipse cx="20" cy="24" rx="8" ry="12" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <ellipse cx="10" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(-25 10 18)"/>
                            <ellipse cx="30" cy="18" rx="5" ry="7" fill="none" stroke="currentColor" strokeWidth="1.5" transform="rotate(25 30 18)"/>
                            <circle cx="20" cy="10" r="2.5" fill="currentColor"/>
                        </svg>
                    </div>

                    {/* Riga 2, Col 2-3: Pattern Collage */}
                    <div className={`${styles.item} ${styles.col2}`}>
                        <Image 
                            src="/img44.jpg" 
                            alt="Pattern"
                            fill
                            className={styles.image}
                        />
                        <div className={styles.overlayText}>RAW</div>
                    </div>

                    {/* Riga 2, Col 4: Shaker */}
                    <div className={`${styles.item} ${styles.symbolBox} ${styles.bgCream}`}>
                        <svg viewBox="0 0 40 40" className={`${styles.icon} ${styles.animPulse}`} style={{color: '#001a13'}}>
                            <path d="M12 6 L28 6 L30 12 L10 12 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <path d="M10 12 L30 12 L28 34 C28 36 26 38 20 38 C14 38 12 36 12 34 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
                            <rect x="17" y="2" width="6" height="4" rx="1" fill="currentColor"/>
                            <line x1="11" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
}