'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from './HomeNavbar.module.scss';

export default function HomeNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const pathname = usePathname();
    const router = useRouter();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    // --- 1. GENERAZIONE HREF ---
    const getHref = (target: string) => {
        if (target.startsWith('/')) {
            return target;
        }
        return pathname === '/' ? `#${target}` : `/#${target}`;
    };

    // --- 2. GESTIONE NAVIGAZIONE ---
    const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
        e.preventDefault();
        setIsOpen(false);

        // CASO A: È una PAGINA reale (es. "/menu" o "/prenota")
        if (target.startsWith('/')) {
            router.push(target);
            return;
        }

        // CASO B: È un'ANCORA (es. "home" o "contact")
        if (pathname === '/') {
            const element = document.getElementById(target);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
            window.history.pushState(null, '', `#${target}`);
        } else {
            router.push(`/#${target}`);
        }
    };

    // --- 3. SCROLL ALL'ARRIVO ---
    useEffect(() => {
        if (pathname === '/' && window.location.hash) {
            const id = window.location.hash.substring(1);
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [pathname]);

    // --- LOGICA AUTO-HIDE ---
    useEffect(() => {
        const scroller = document.getElementById('main-scroller');
        const target = scroller || window;

        const controlNavbar = () => {
            const currentScrollY = scroller ? scroller.scrollTop : window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        target.addEventListener('scroll', controlNavbar);
        return () => target.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    }, [isOpen]);

    return (
        <header className={`${styles.navbar} ${!isVisible ? styles.hidden : ''}`}>
            <div className={styles.container}>
                
                {/* --- SINISTRA: Home, Menù --- */}
                <nav className={styles.navGroup}>
                    <a href={getHref('home')} onClick={(e) => handleNavigation(e, 'home')}>
                        Home
                    </a>
                    {/* Menù è una Pagina */}
                    <a href={getHref('/menu')} onClick={(e) => handleNavigation(e, '/menu')}>
                        Menù
                    </a>
                </nav>

                {/* --- CENTRO: Logo --- */}
                <div className={styles.logoCenter}>
                    <a href={getHref('home')} onClick={(e) => handleNavigation(e, 'home')}>
                        <img src="/logo-desktop-png.png" alt="So Raw Pub Logo" />
                    </a>
                </div>

                {/* --- DESTRA: Prenota, Contatti --- */}
                <nav className={styles.navGroup}>
                    {/* Prenota è una Pagina (assumo tu abbia creato /prenota) */}
                    <a href={getHref('/prenota')} onClick={(e) => handleNavigation(e, '/prenota')}>
                        Prenota
                    </a>
                    {/* Contatti è un'Ancora in Home */}
                    <a href={getHref('contact')} onClick={(e) => handleNavigation(e, 'contact')}>
                        Contatti
                    </a>
                </nav>

                {/* --- HAMBURGER --- */}
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

            {/* --- MOBILE MENU --- */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <a href={getHref('home')} onClick={(e) => handleNavigation(e, 'home')}>Home</a>
                <a href={getHref('/menu')} onClick={(e) => handleNavigation(e, '/menu')}>Menù</a>
                <a href={getHref('/prenota')} onClick={(e) => handleNavigation(e, '/prenota')}>Prenota</a>
                <a href={getHref('contact')} onClick={(e) => handleNavigation(e, 'contact')}>Contatti</a>
            </div>
        </header>
    );
}