'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './MenuSection.module.scss';
import categoriesData from '@/data/categories.json';
import { MenuItem } from '@/lib/getMenu';

// Icone SVG leggere per Menu e Chiudi
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const IconClose = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

interface MenuSectionProps {
  initialMenuItems: MenuItem[];
}

const DEFAULT_IMAGE = '/img44.jpg';

export default function MenuSection({ initialMenuItems }: MenuSectionProps) {
  // Stati
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]?.id || '');
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
  const [mobileModalImg, setMobileModalImg] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filtro Dati (Cache)
  const filteredItems = useMemo(() => {
    return initialMenuItems.filter((item) => item.category === activeCategory);
  }, [initialMenuItems, activeCategory]);

  // Handlers
  const handleDesktopHover = (img: string | null | undefined) => {
    setPreviewImage(img || DEFAULT_IMAGE);
  };

  const handleItemClick = (img: string | null | undefined) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024 && img) {
      setMobileModalImg(img);
    }
  };

  const handleCategorySelect = (id: string) => {
    setActiveCategory(id);
    setIsMobileMenuOpen(false); // Chiude il menu dopo il click su mobile
    
    // Opzionale: scrolla in alto la lista piatti quando cambi categoria
    const listElement = document.getElementById('menu-list-container');
    if(listElement) listElement.scrollTop = 0;
  };

  const activeCategoryLabel = categoriesData.find(c => c.id === activeCategory)?.label;

  return (
    <section className={styles.menuSection} id="menu">
      <div className={styles.splitLayout}>
        
        {/* --- COLONNA SINISTRA (Contenuto Scrollabile) --- */}
        <div className={styles.leftColumn} id="menu-list-container">
          
          {/* Header Mobile: Solo pulsante Back */}
          <div className={styles.mobileHeaderRow}>
            <Link href="/" className={styles.backButton}>
              <span className={styles.backIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </span>
              <span>Home</span>
            </Link>
          </div>

          {/* 🔥 TASTO MENU GALLEGGIANTE (Fisso in basso) 🔥 */}
          <button 
            className={styles.mobileMenuToggle} 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <IconMenu /> <span>Menu</span>
          </button>

          {/* Titolo Sezione */}
          <div className={styles.header}>
            <span className={styles.subtitle}>Taste Experience</span>
            <h2>Il Menù</h2>
          </div>

          {/* --- MENU CATEGORIE (DRAWER LATERALE) --- */}
          <div className={`${styles.categoryContainer} ${isMobileMenuOpen ? styles.open : ''}`}>
            
            {/* Sfondo scuro cliccabile */}
            <div className={styles.backdrop} onClick={() => setIsMobileMenuOpen(false)}></div>

            {/* Pannello Laterale */}
            <div className={styles.categorySidebar}>
                {/* Header interno al cassetto */}
                <div className={styles.sidebarHeader}>
                    <h3>Categorie</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)} className={styles.closeMenuBtn}>
                        <IconClose />
                    </button>
                </div>

                {/* Lista Categorie Scrollabile */}
                <div className={styles.categoryWrapper}>
                    {categoriesData.map((cat) => (
                    <button
                        key={cat.id}
                        className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                        onClick={() => handleCategorySelect(cat.id)}
                    >
                        {cat.label}
                    </button>
                    ))}
                </div>
            </div>
          </div>

          <div className={styles.currentCategoryTitle}>
             <span className={styles.decoLine}></span>
             <h3>{activeCategoryLabel}</h3>
             <span className={styles.decoLine}></span>
          </div>

          {/* --- LISTA PIATTI --- */}
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

        {/* --- COLONNA DESTRA (Preview Desktop) --- */}
        <div className={styles.rightColumn}>
          <div className={styles.imageFrame}>
            <Image
              key={previewImage}
              src={previewImage}
              alt="Menu Preview"
              fill
              className={styles.previewImg}
              priority={true}
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.overlayGradient}></div>
          </div>
        </div>

      </div>

      {/* --- MODALE FOTO (Solo Mobile) --- */}
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