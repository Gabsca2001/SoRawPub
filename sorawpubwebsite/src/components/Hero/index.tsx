import styles from './Hero.module.scss';
import Link from 'next/link';

export default function Hero() {

    const handleScrollDown = () => {
        window.scrollTo({
            top: window.innerHeight, 
            behavior: 'smooth'
        });
    };

    return (
        <div className={styles.hero}>
            
            {/* 1. VIDEO DI SFONDO */}
            <video 
                className={styles.videoBackground} 
                autoPlay 
                loop 
                muted 
                playsInline // Importante per iOS
            >
                <source src="/hero-video.mp4" type="video/mp4" />
                {/* Fallback se il video non va */}
                Your browser does not support the video tag.
            </video>

            {/* 2. VELO SCURO (Overlay) */}
            <div className={styles.darkOverlay}></div>

            {/* 3. CONTENUTO (Sopra al video) */}
            <div className={styles.contentContainer}>
       
                <div className={styles.ctaContainer}>
                    <a href="/prenota" className={`${styles.btn} ${styles.btnPrimary}`}>
                        Prenota Ora
                    </a>
                    <Link href="/menu" className={`${styles.btn} ${styles.btnSecondary}`}>
                        Scopri Menu
                    </Link>
                </div>

            </div>

            {/* Scroll Indicator */}
            <div className={styles.scrollIndicator} onClick={handleScrollDown}>
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
                <div className={styles.arrow}></div>
            </div>
        </div>
    );
}