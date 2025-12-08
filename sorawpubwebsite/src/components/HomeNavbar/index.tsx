'use client';
import React, { useState, useEffect } from 'react';
import styles from './HomeNavbar.module.scss';

export default function HomeNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // --- LOGICA SCROLL (Specifica per container 100vh) ---
    useEffect(() => {
        // Cerchiamo il contenitore che ha l'overflow-y: scroll
        const scroller = document.getElementById('main-scroller');
        
        // Se non esiste (fallback), usiamo window
        const target = scroller || window;

        const controlNavbar = () => {
            // Se è un elemento HTML prendiamo scrollTop, altrimenti scrollY
            const currentScrollY = scroller ? scroller.scrollTop : window.scrollY;

            // Logica: Se scrollo giù E ho superato i 100px -> Nascondi
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                // Se scrollo su -> Mostra
                setIsVisible(true);
            }

            // Aggiorna l'ultima posizione conosciuta
            setLastScrollY(currentScrollY);
        };

        // Aggiungiamo l'ascoltatore all'elemento specifico
        target.addEventListener('scroll', controlNavbar);

        // Pulizia
        return () => {
            target.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    // Blocca interazione background quando menu mobile è aperto
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <header 
            className={`${styles.navbar} ${!isVisible ? styles.hidden : ''}`}
        >
            <div className={styles.container}>
                
                {/* --- 1. LINK SINISTRA --- */}
                <nav className={styles.navGroup}>
                    <a href="/">Home</a>
                    <a href="/menu">Menu</a>
                </nav>

                {/* --- 2. LOGO CENTRALE --- */}
                <div className={styles.logoCenter}>
                    <a href="/" onClick={() => setIsOpen(false)}>
                        <img
                            src="/logo-desktop-png.png"
                            alt="So Raw Pub Logo"
                        />
                    </a>
                </div>

                {/* --- 3. LINK DESTRA --- */}
                <nav className={styles.navGroup}>
                    <a href="/events">Eventi</a>
                    <a href="/contact">Contatti</a>
                </nav>

                {/* --- 4. HAMBURGER (Mobile) --- */}
                <button 
                    className={styles.hamburger} 
                    onClick={toggleMenu}
                    aria-label="Toggle menu"
                >
                    <span style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }} />
                    <span style={{ opacity: isOpen ? '0' : '1', transform: isOpen ? 'translateX(20px)' : 'translateX(0)' }} />
                    <span style={{ transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)' }} />
                </button>
            </div>

            {/* --- 5. MOBILE MENU FULLSCREEN --- */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <a href="/" onClick={() => setIsOpen(false)}>Home</a>
                <a href="/menu" onClick={() => setIsOpen(false)}>Menu</a>
                <a href="/events" onClick={() => setIsOpen(false)}>Eventi</a>
                <a href="/contact" onClick={() => setIsOpen(false)}>Contatti</a>
            </div>
        </header>
    );
}