'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Footer.module.scss';

export function Footer() {
    const [year, setYear] = useState(2024);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                
                {/* INTESTAZIONE: Logo e CTA */}
                <div className={styles.headerRow}>
                    <div className={styles.logoBlock}>
                        <h2 className={styles.logoText}>SO RAW</h2>
                        <span className={styles.logoSub}>COCKTAIL & BAR</span>
                    </div>
                    <Link href="/prenota" className={styles.reserveBtn}>
                        Prenota Tavolo
                    </Link>
                </div>

                {/* GRIGLIA PRINCIPALE */}
                <div className={styles.gridWrapper}>
                    
                    {/* BLOCCO 1: DOVE SIAMO + MAPPA */}
                    <div className={styles.gridCol}>
                        <h3 className={styles.colTitle}>Location</h3>
                        <div className={styles.locationBox}>
                            <address>
                                Piazza Giuseppe Verdi 12<br />
                                90047 Partinico (PA)
                            </address>
                            {/* Riquadro Mappa Integrato */}
                            <div className={styles.miniMap}>
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d751.7507360299768!2d13.117405069601292!3d38.046824454374914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x13198dae714cfb8f%3A0x6c0f24bd6be51665!2sPiazza%20Giuseppe%20Verdi%2C%2012%2C%2090047%20Partinico%20PA!5e1!3m2!1sit!2sit!4v1765817165049!5m2!1sit!2sit" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                            <a 
                                href="https://www.google.com/maps/dir//Piazza+Giuseppe+Verdi,+12,+90047+Partinico+PA" 
                                target="_blank" 
                                className={styles.mapLink}
                            >
                                Ottieni indicazioni →
                            </a>
                        </div>
                    </div>

                    {/* BLOCCO 2: CONTATTI & ORARI */}
                    <div className={styles.gridCol}>
                        <div className={styles.infoGroup}>
                            <h3 className={styles.colTitle}>Contatti</h3>
                            <Link href="tel:+390911234567" className={styles.infoLink}>+39 091 123 4567</Link>
                            <Link href="mailto:info@sorawpub.com" className={styles.infoLink}>info@sorawpub.com</Link>
                        </div>
                        
                        <div className={styles.infoGroup}>
                            <h3 className={styles.colTitle}>Opening Hours</h3>
                            <ul className={styles.hours}>
                                <li><span>Lun - Gio</span> 18:00 — 01:00</li>
                                <li><span>Ven - Dom</span> 18:00 — 02:00</li>
                            </ul>
                        </div>
                    </div>

                    {/* BLOCCO 3: NAVIGAZIONE & SOCIAL */}
                    <div className={`${styles.gridCol} ${styles.navCol}`}>
                        <h3 className={styles.colTitle}>Menu</h3>
                        <nav className={styles.navLinks}>
                            <Link href="/">Home</Link>
                            <Link href="/menu">Food & Drinks</Link>
                            <Link href="/wp-admin-login-so-raw">Staff Login</Link>
                        </nav>
                        
                        <div className={styles.socialGroup}>
                            <h3 className={styles.colTitle}>Follow Us</h3>
                            <div className={styles.socialLinks}>
                                <a href="https://www.instagram.com/so_raw_cocktailbar/">Instagram</a>
                                <a href="#">Facebook</a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* BOTTOM BAR */}
                <div className={styles.bottomRow}>
                    <p suppressHydrationWarning className={styles.copy}>
                        © {year} So Raw Pub • P.IVA <span>0732</span> <span>6980</span> <span>823</span>
                    </p>
                    <p className={styles.credits}>
                        Dev by <a href="#">Gabriele Scamardo</a>
                    </p>
                </div>

            </div>
        </footer>
    );
}