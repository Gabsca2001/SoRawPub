'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './GallerySection.module.scss';

// --- DEFINIZIONE TIPI ---
// Definisce le possibili dimensioni delle celle nella griglia
type GridSpan = '' | 'wide' | 'tall' | 'big';

interface GalleryItem {
    id: number;
    src: string;
    alt: string;
    span: GridSpan;
}

// --- DATI (Tipizzati) ---
const GALLERY_IMAGES: GalleryItem[] = [
    { id: 1, src: '/img1.jpeg', alt: 'Raw Atmosphere Main Room', span: 'big' },
    { id: 2, src: '/img2.jpeg', alt: 'Cocktail Detail', span: '' },
    { id: 3, src: '/WhatsApp Image 2025-11-28 at 15.13.50 (3).jpeg', alt: 'Artemis Illustration', span: 'tall' },
    { id: 4, src: '/img44.jpg', alt: 'Textures and Materials', span: 'wide' },
    { id: 5, src: '/WhatsApp Image 2025-11-28 at 15.13.52 (2).jpeg', alt: 'Branding Detail', span: '' },
    { id: 6, src: '/Screenshot 2025-12-07 190930.png', alt: 'Interior Wide Shot', span: 'wide' },
    { id: 7, src: '/WhatsApp Image 2025-11-28 at 15.13.55.jpeg', alt: 'Symbol Element', span: '' },
    { id: 8, src: '/img1.jpeg', alt: 'Bar Counter Detail', span: 'tall' },
];

export default function GallerySection() {
    // Stato tipizzato: può essere una stringa (URL immagine) o null (nessuna selezione)
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const openModal = (imgSrc: string) => {
        setSelectedImage(imgSrc);
        // Blocca lo scroll del body quando il modale è aperto
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        setSelectedImage(null);
        if (typeof document !== 'undefined') {
            document.body.style.overflow = 'unset';
        }
    };

    return (
        <section className={styles.gallerySection} id="gallery">
            <div className={styles.container}>
                
                {/* HEADER */}
                <div className={styles.header}>
                    <span className={styles.subtitle}>Visual Journey</span>
                    <h2>L'Atmosfera</h2>
                    <p>Un'immersione visiva nei dettagli che rendono unico il nostro spazio. Dove la materia grezza incontra il design.</p>
                </div>

                {/* MASONRY GRID */}
                <div className={styles.galleryGrid}>
                    {GALLERY_IMAGES.map((item) => (
                        <div 
                            key={item.id} 
                            // Accesso dinamico alle classi CSS basato sulla proprietà span
                            // In TS con CSS Modules, questo funziona se la classe esiste
                            className={`${styles.gridItem} ${item.span ? styles[item.span] : ''}`}
                            onClick={() => openModal(item.src)}
                        >
                            <div className={styles.imageWrapper}>
                                <Image 
                                    src={item.src} 
                                    alt={item.alt}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className={styles.thumbImg}
                                />
                                {/* Overlay Hover */}
                                <div className={styles.hoverOverlay}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

            {/* MODAL LIGHTBOX */}
            {selectedImage && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    {/* e.stopPropagation evita che cliccando sull'immagine si chiuda il modale */}
                    <div className={styles.modalContent} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={closeModal}>✕</button>
                        <Image 
                            src={selectedImage} 
                            alt="Gallery Fullscreen" 
                            fill 
                            className={styles.fullImg}
                            priority // Carica con priorità alta per evitare flickering
                        />
                    </div>
                </div>
            )}
        </section>
    );
}