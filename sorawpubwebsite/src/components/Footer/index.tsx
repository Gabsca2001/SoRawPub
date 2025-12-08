import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.scss';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                
                {/* 1. TOP SECTION: CTA & BIG LOGO */}
                <div className={styles.topSection}>
                    <div className={styles.ctaBox}>
                        <h2 className={styles.ctaTitle}>Ready to taste?</h2>
                        <Link href="/prenota" className={styles.ctaBtn}>
                            Prenota un Tavolo
                        </Link>
                    </div>
                    <div className={styles.bigLogoText}>SO RAW</div>
                </div>

                {/* 2. GRID SECTION: INFO */}
                <div className={styles.gridInfo}>
                    
                    {/* COL 1: LOGO & ABOUT */}
                    <div className={styles.col}>
                        <div className={styles.brand}>
                            <Image 
                                src="/logo-desktop-png.png" 
                                alt="So Raw Pub Logo" 
                                width={80} 
                                height={80} 
                                className={styles.logoImg}
                            />
                            <p className={styles.payoff}>
                                Cocktails, Food &<br/> Good Vibes in Sicily.
                            </p>
                        </div>
                    </div>

                    {/* COL 2: NAVIGATION */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Esplora</h4>
                        <nav className={styles.navLinks}>
                            <Link href="/">Home</Link>
                            <Link href="/menu">Menu</Link>
                            <Link href="/events">Eventi</Link>
                            <Link href="/chi-siamo">Chi Siamo</Link>
                        </nav>
                    </div>

                    {/* COL 3: CONTACTS */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Contatti</h4>
                        <address className={styles.address}>
                            <p>Piazza Giuseppe Verdi 12</p>
                            <p>90047 Partinico (PA)</p>
                            <Link href="tel:+390911234567" className={styles.contactLink}>
                                +39 091 1234567
                            </Link>
                            <Link href="mailto:info@sorawpub.com" className={styles.contactLink}>
                                info@sorawpub.com
                            </Link>
                        </address>
                    </div>

                    {/* COL 4: HOURS & SOCIAL */}
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Orari</h4>
                        <ul className={styles.hoursList}>
                            <li><span>Lun - Gio:</span> 18:00 - 01:00</li>
                            <li><span>Ven - Dom:</span> 18:00 - 02:00</li>
                        </ul>
                        <div className={styles.socials}>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">TW</a>
                        </div>
                    </div>

                </div>

                {/* 3. BOTTOM BAR */}
                <div className={styles.bottomBar}>
                    <p>&copy; {currentYear} So Raw Pub. P.IVA 1234567890</p>
                    <div className={styles.credits}>
                        <span>Designed by </span>
                        <a href="#" className={styles.devLink}>Gabriele Scamardo</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}