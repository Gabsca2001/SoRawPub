'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './MenuSection.module.scss';

// --- CATEGORIE ESTESE ---
const MENU_CATEGORIES = [
    { id: 'signatures', label: 'Signature Cocktails' },
    { id: 'classics', label: 'Classic Twists' },
    { id: 'raw_fish', label: 'Raw Bar & Fish' },
    { id: 'tapas', label: 'Tapas & Taglieri' },
    { id: 'burgers', label: 'Gourmet Burgers' },
    { id: 'wines', label: 'Vini Naturali' },
    { id: 'beers', label: 'Birre Artigianali' },
];

// --- DATABASE MENU ESTESO ---
const MENU_ITEMS = [
    // --- SIGNATURE COCKTAILS ---
    { id: 101, category: 'signatures', name: 'Bernard Red', price: '18', description: 'Gin infuso al rosmarino, vermouth rosso, bitter al cioccolato di Modica.', image: '/img1.jpeg' },
    { id: 102, category: 'signatures', name: 'So Raw Negroni', price: '16', description: 'La nostra versione invecchiata in botte di rovere per 40 giorni.', image: '/img2.jpeg' },
    { id: 103, category: 'signatures', name: 'Etna Magma', price: '15', description: 'Mezcal, sciroppo di peperoncino, lime, sale vulcanico.', image: null },
    { id: 104, category: 'signatures', name: 'Ortigia Sunset', price: '16', description: 'Vodka, succo d\'arancia rossa, sciroppo di fiori di sambuco, prosecco.', image: '/img1.jpeg' },
    { id: 105, category: 'signatures', name: 'Mandarino Sour', price: '14', description: 'Gin siciliano, mandarino tardivo, albume, limone.', image: null },
    { id: 106, category: 'signatures', name: 'Pistachio Mule', price: '15', description: 'Vodka al pistacchio, ginger beer, lime, granella.', image: '/img44.jpg' },

    // --- CLASSIC TWISTS ---
    { id: 201, category: 'classics', name: 'Sicilian Spritz', price: '12', description: 'Amaro Amara, soda, prosecco, scorza d\'arancia.', image: null },
    { id: 202, category: 'classics', name: 'Old Fashioned Raw', price: '14', description: 'Bourbon, zucchero di canna grezzo, angostura, affumicatura al legno di ulivo.', image: '/img2.jpeg' },
    { id: 203, category: 'classics', name: 'Espresso Martini 2.0', price: '13', description: 'Vodka, caffè espresso locale, liquore alla nocciola.', image: null },
    { id: 204, category: 'classics', name: 'Basil Smash', price: '14', description: 'Gin, basilico fresco del nostro orto, limone, zucchero.', image: null },

    // --- RAW BAR & FISH ---
    { id: 301, category: 'raw_fish', name: 'Tartare di Tonno', price: '22', description: 'Tonno rosso del Mediterraneo, capperi di Pantelleria, scorza di limone.', image: '/img1.jpeg' },
    { id: 302, category: 'raw_fish', name: 'Gambero Rosso Mazara', price: '28', description: '6 pezzi di gambero rosso serviti su ghiaccio con emulsione agli agrumi.', image: '/img44.jpg' },
    { id: 303, category: 'raw_fish', name: 'Carpaccio di Spada', price: '20', description: 'Pesce spada affumicato a freddo, pepe rosa, olio EVO.', image: null },
    { id: 304, category: 'raw_fish', name: 'Ostriche (1pz)', price: '4.50', description: 'Ostriche fresche servite con vinaigrette allo scalogno.', image: null },
    { id: 305, category: 'raw_fish', name: 'Plateau Royale', price: '60', description: 'Selezione dello chef: tartare, gamberi, scampi e ostriche (per 2 persone).', image: '/img1.jpeg' },
    { id: 306, category: 'raw_fish', name: 'Ceviche Sicula', price: '24', description: 'Pescato del giorno marinato in lime, cipolla rossa di Tropea, peperoncino.', image: null },

    // --- TAPAS & TAGLIERI ---
    { id: 401, category: 'tapas', name: 'Tagliere So Raw', price: '26', description: 'Selezione premium di salumi dei Nebrodi e formaggi Ragusani.', image: '/img44.jpg' },
    { id: 402, category: 'tapas', name: 'Bruschette Miste', price: '12', description: '4 pezzi: Pomodoro e basilico, Stracciatella e alici, Patè di olive, Caponata.', image: null },
    { id: 403, category: 'tapas', name: 'Panelle Gourmet', price: '8', description: 'Frittelle di ceci con limone e pepe nero.', image: null },
    { id: 404, category: 'tapas', name: 'Polpette di Sarde', price: '14', description: 'Sarde, pinoli, uvetta, servite con salsa agrodolce.', image: '/img1.jpeg' },
    { id: 405, category: 'tapas', name: 'Patate al Tartufo', price: '9', description: 'Patate fritte fresche con fonduta di parmigiano e tartufo nero.', image: null },

    // --- BURGERS ---
    { id: 501, category: 'burgers', name: 'The Classic', price: '16', description: 'Bun artigianale, manzo 200g, cheddar, lattuga, pomodoro, salsa Raw.', image: '/img2.jpeg' },
    { id: 502, category: 'burgers', name: 'Sicilian King', price: '19', description: 'Manzo, crema di pistacchio, burrata, mortadella grigliata.', image: '/img44.jpg' },
    { id: 503, category: 'burgers', name: 'Crispy Chicken', price: '15', description: 'Pollo fritto croccante, salsa bbq, coleslaw, cetriolini.', image: null },
    { id: 504, category: 'burgers', name: 'Veggie Truffle', price: '17', description: 'Burger di ceci e lenticchie, crema al tartufo, rucola.', image: null },

    // --- VINI ---
    { id: 601, category: 'wines', name: 'Etna Rosso DOC', price: '32', description: 'Nerello Mascalese, note di frutti rossi e cenere.', image: null },
    { id: 602, category: 'wines', name: 'Grillo Bio', price: '28', description: 'Fresco, sapido, sentori di agrumi.', image: null },
    { id: 603, category: 'wines', name: 'Catarratto Macerato', price: '35', description: 'Orange wine naturale, complesso e strutturato.', image: '/img2.jpeg' },
    { id: 604, category: 'wines', name: 'Calice del Giorno', price: '8', description: 'Chiedi al personale la selezione del giorno.', image: null },

    // --- BIRRE ---
    { id: 701, category: 'beers', name: 'Ipa della Costa', price: '8', description: 'Artigianale siciliana, ambrata, note tropicali.', image: null },
    { id: 702, category: 'beers', name: 'Messina Cristalli di Sale', price: '6', description: 'Lager non filtrata con cristalli di sale di Sicilia.', image: null },
    { id: 703, category: 'beers', name: 'Rossa Vulcanica', price: '9', description: 'Doppio malto, note di caramello e tostatura.', image: null },
];

// Immagine di Default (Atmosfera)
const DEFAULT_IMAGE = '/img44.jpg';

export default function MenuSection() {
    const [activeCategory, setActiveCategory] = useState('signatures');
    const [previewImage, setPreviewImage] = useState(DEFAULT_IMAGE);
    const [mobileModalImg, setMobileModalImg] = useState(null);

    const filteredItems = MENU_ITEMS.filter(item => item.category === activeCategory);

    // Gestione Desktop
    const handleDesktopHover = (img) => {
        setPreviewImage(img || DEFAULT_IMAGE);
    };

    // Gestione Mobile
    const handleItemClick = (img) => {
        if (typeof window !== 'undefined' && window.innerWidth <= 1024 && img) {
            setMobileModalImg(img);
        }
    };

    const goToNextSection = () => {
        // Cerca il contenitore principale
        const scroller = document.getElementById('main-scroller');
        // Cerca la sezione successiva (Gallery) tramite il suo ID
        const nextSection = document.getElementById('gallery');
        
        if (scroller && nextSection) {
            // Calcola la posizione top della gallery relativa al contenitore
            const topPos = nextSection.offsetTop;
            // Scrolla il contenitore principale (non il menu interno)
            scroller.scrollTo({ top: topPos, behavior: 'smooth' });
        }
    };

    return (
        <section className={styles.menuSection} id="menu">

            <div className={styles.splitLayout}>

                {/* 1. COLONNA SINISTRA (Lista Menu Scrollabile) */}
                <div className={styles.leftColumn}>

                    <div className={styles.header}>
                        <span className={styles.subtitle}>Taste Experience</span>
                        <h2>Il Menù</h2>
                    </div>

                    {/* CATEGORY SLIDER (Sticky & Scrollable) */}
                    <div className={styles.categoryWrapper}>
                        {MENU_CATEGORIES.map((cat) => (
                            <button
                                key={cat.id}
                                className={`${styles.categoryBtn} ${activeCategory === cat.id ? styles.active : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* LISTA MENU */}
                    <div className={styles.menuList}>
                        {filteredItems.map((item) => (
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
                                            {/* ICONA CAMERA MOBILE */}
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
                        ))}

                        <div className={styles.nextSectionHint} onClick={goToNextSection}>
                            <span className={styles.hintText}>Scopri la Gallery</span>
                            <div className={styles.hintArrow}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
                                </svg>
                            </div>
                        </div>

                        {/* Spazio finale abbondante per scrollare comodamente fino all'ultimo elemento */}
                        <div className={styles.spacer}></div>
                    </div>
                </div>

                {/* 2. COLONNA DESTRA (Desktop Preview) */}
                <div className={styles.rightColumn}>
                    <div className={styles.imageFrame}>
                        <Image
                            key={previewImage}
                            src={previewImage}
                            alt="Menu Preview"
                            fill
                            className={styles.previewImg}
                            priority
                        />
                        <div className={styles.overlayGradient}></div>
                    </div>
                </div>

            </div>

            {/* MODAL MOBILE */}
            {mobileModalImg && (
                <div className={styles.modalOverlay} onClick={() => setMobileModalImg(null)}>
                    <div className={styles.modalContent}>
                        <Image src={mobileModalImg} alt="Detail" fill className={styles.modalImg} />
                        <button className={styles.closeBtn}>✕</button>
                    </div>
                </div>
            )}
        </section>
    );
}