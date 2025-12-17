'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuSection.module.scss';
import categoriesData from '@/data/categories.json';
import { MenuItem } from '@/lib/getMenu'; // Importiamo il tipo dal file lib

// Props attese dal server
interface MenuSectionProps {
  initialMenuItems: MenuItem[];
}

const DEFAULT_IMAGE = '/img44.jpg';

export default function MenuSection({ initialMenuItems }: MenuSectionProps) {
  // Imposta la prima categoria del JSON come attiva di default
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]?.id || '');
  
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
  const [mobileModalImg, setMobileModalImg] = useState<string | null>(null);

  // OTTIMIZZAZIONE: useMemo ricalcola il filtro solo se cambia la categoria o i dati.
  // Non serve più useEffect o stati di loading, i dati sono già qui!
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter(item => item.category === activeCategory);
  }, [initialMenuItems, activeCategory]);

  const handleDesktopHover = (img: string | null | undefined) => {
    setPreviewImage(img || DEFAULT_IMAGE);
  };

  const handleItemClick = (img: string | null | undefined) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024 && img) {
      setMobileModalImg(img);
    }
  };

  return (
    <section className={styles.menuSection} id="menu">
      <div className={styles.splitLayout}>

        {/* COLONNA SINISTRA */}
        <div className={styles.leftColumn}>

          {/* pulsante back */}
          <div className={styles.backRow}>
            <Link href="/" className={styles.backButton}>
              <span className={styles.backIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </span>
              <span>Home</span>
            </Link>
          </div>

          <div className={styles.header}>
            <span className={styles.subtitle}>Taste Experience</span>
            <h2>Il Menù</h2>
          </div>

          {/* MENU CATEGORIE */}
          <div className={styles.categoryWrapper}>
            {categoriesData.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* LISTA PIATTI */}
          <div className={styles.menuList}>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`${styles.menuItem} ${!item.image ? styles.noImage : ''}`}
                  onMouseEnter={() => handleDesktopHover(item.image)}
                  onClick={() => handleItemClick(item.image)}
                >
                  <div className={styles.itemMain}>
                    <div className={styles.namePriceRow}>
                      <div className={styles.nameGroup}>
                        <h3 className={styles.itemName}>{item.name}</h3>
                        {item.image && (
                          <span className={styles.mobilePhotoIcon}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                              <circle cx="12" cy="13" r="4" />
                            </svg>
                          </span>
                        )}
                      </div>

                      <span className={styles.line}></span>
                      <span className={styles.price}>€ {item.price}</span>
                    </div>

                    <p className={styles.description}>{item.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ padding: '20px', fontStyle: 'italic', opacity: 0.6 }}>
                Nessun elemento in questa sezione.
              </p>
            )}

            <div className={styles.spacer}></div>
          </div>
        </div>

        {/* COLONNA DESTRA (Immagine Preview) */}
        <div className={styles.rightColumn}>
          <div className={styles.imageFrame}>
            <Image
              key={previewImage} // Key forza l'animazione al cambio immagine
              src={previewImage}
              alt="Menu Preview"
              fill
              className={styles.previewImg}
              priority={true} // Carica subito l'immagine principale
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.overlayGradient}></div>
          </div>
        </div>

      </div>

      {/* MODALE MOBILE */}
      {mobileModalImg && (
        <div className={styles.modalOverlay} onClick={() => setMobileModalImg(null)}>
          <div className={styles.modalContent}>
            <Image 
              src={mobileModalImg} 
              alt="Detail" 
              fill 
              className={styles.modalImg} 
              style={{ objectFit: 'cover' }}
            />
            <button className={styles.closeBtn}>✕</button>
          </div>
        </div>
      )}
    </section>
  );
}