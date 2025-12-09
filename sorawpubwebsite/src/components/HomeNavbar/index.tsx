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

    // --- SCROLL TO SECTION FUNCTION ---
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault(); // Prevent default browser anchor behavior
        
        const scroller = document.getElementById('main-scroller');
        const element = document.getElementById(id);

        if (scroller && element) {
            // Option A: Smooth scroll specifically within the container
            // This calculates the top position of the element relative to the container
            // Since sections are 100vh, this is usually just index * windowHeight
            
            // element.scrollIntoView works well for scroll-snap containers
            element.scrollIntoView({ behavior: 'smooth' }); 
        }
        
        setIsOpen(false); // Close mobile menu if open
    };

    // --- SCROLL LOGIC (Auto-Hide) ---
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
        return () => {
            target.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

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
                
                {/* --- 1. LEFT LINKS --- */}
                <nav className={styles.navGroup}>
                    <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Home</a>
                    <a href="#chi-siamo" onClick={(e) => scrollToSection(e, 'chi-siamo')}>Chi Siamo</a>
                </nav>

                {/* --- 2. LOGO --- */}
                <div className={styles.logoCenter}>
                    <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>
                        <img
                            src="/logo-desktop-png.png"
                            alt="So Raw Pub Logo"
                        />
                    </a>
                </div>

                {/* --- 3. RIGHT LINKS --- */}
                <nav className={styles.navGroup}>
                    <a href="#menu" onClick={(e) => scrollToSection(e, 'menu')}>Menù</a>
                    <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contatti</a>
                </nav>

                {/* --- 4. HAMBURGER --- */}
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

            {/* --- 5. MOBILE MENU --- */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <a href="#home" onClick={(e) => scrollToSection(e, 'home')}>Home</a>
                <a href="#chi-siamo" onClick={(e) => scrollToSection(e, 'chi-siamo')}>Chi Siamo</a>
                <a href="#menu" onClick={(e) => scrollToSection(e, 'menu')}>Menù</a>
                <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')}>Contatti</a>
            </div>
        </header>
    );
}