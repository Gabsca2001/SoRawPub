'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '@/lib/firebase'; // Importa la tua istanza db
import styles from './MenuSection.module.scss';

// Importa il JSON delle categorie
import categoriesData from '@/data/categories.json';

// Definisci l'interfaccia per un elemento del menu (utile per TypeScript/chiarezza)
interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
  description: string;
  image?: string | null;
}

// Immagine di Default (Atmosfera)
const DEFAULT_IMAGE = '/img44.jpg';

export default function MenuSection() {
  // Stato per i piatti scaricati da Firebase
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  
  // Stato per il caricamento
  const [loading, setLoading] = useState(true);

  // Imposta la prima categoria del JSON come attiva di default
  const [activeCategory, setActiveCategory] = useState(categoriesData[0]?.id || '');
  
  const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
  const [mobileModalImg, setMobileModalImg] = useState<string | null>(null);

  // --- FETCH DATI DA FIREBASE ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        // Assicurati che la tua collezione su Firestore si chiami "menu"
        // Se si chiama diversamente (es. "products"), cambia la stringa qui sotto
        const querySnapshot = await getDocs(collection(db, "menu"));
        
        const fetchedData: MenuItem[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as MenuItem[];

        setMenuItems(fetchedData);
      } catch (error) {
        console.error("Errore nel recupero del menu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Filtra i piatti in base alla categoria attiva
  const filteredItems = menuItems.filter(item => item.category === activeCategory);

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

          {/* MENU CATEGORIE (Dal JSON) */}
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
            {loading ? (
              // Semplice stato di loading
              <p style={{ padding: '20px', color: '#888' }}>Caricamento menu in corso...</p>
            ) : filteredItems.length > 0 ? (
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
              // Messaggio se la categoria è vuota
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
              key={previewImage} // Key forza il re-render per l'animazione se presente nel CSS
              src={previewImage}
              alt="Menu Preview"
              fill
              className={styles.previewImg}
              priority
              style={{ objectFit: 'cover' }} // Assicura che l'immagine copra bene l'area
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