import React, { useState, useEffect } from 'react';
import styles from './Navbar2.module.scss';

export default function Navbar2() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            <nav className={styles.navbar}>
                <div className={styles.container}>
                    
                    {/* LOGO */}
                    <div className={styles.logoContainer}>
                        <a href="/" onClick={() => setIsOpen(false)}>
                            <img
                                src="/logo-desktop-png.png"
                                alt="So Raw Logo"
                            />
                        </a>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className={styles.desktopMenu}>
                        <a href="/">Home</a>
                        <a href="/menu">Menu</a>
                        <a href="/events">Events</a>
                        <a href="/contact">Contact</a>
                    </div>

                    {/* HAMBURGER (Mobile) */}
                    <button 
                        className={styles.hamburger} 
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {/* Animazione CSS semplice per l'hamburger gestita qui o via classi */}
                        <span style={{ transform: isOpen ? 'rotate(45deg) translate(5px, 6px)' : 'none' }} />
                        <span style={{ opacity: isOpen ? 0 : 1 }} />
                        <span style={{ transform: isOpen ? 'rotate(-45deg) translate(5px, -6px)' : 'none', width: isOpen ? '2rem' : '2rem' }} />
                    </button>
                </div>
            </nav>

            {/* MOBILE FULLSCREEN OVERLAY */}
            <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
                <a href="/" onClick={() => setIsOpen(false)}>Home</a>
                <a href="/menu" onClick={() => setIsOpen(false)}>Menu</a>
                <a href="/events" onClick={() => setIsOpen(false)}>Events</a>
                <a href="/contact" onClick={() => setIsOpen(false)}>Contact</a>
            </div>
        </>
    );
}