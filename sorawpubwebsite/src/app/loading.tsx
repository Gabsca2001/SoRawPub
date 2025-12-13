import React from 'react';
import Image from 'next/image';
import styles from './loading.module.scss';

export default function Loading() {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.logoContainer}>
                <Image 
                    src="/logo-desktop-png.png" // Controlla che il nome file sia esatto
                    alt="So Raw Loading"
                    width={150} // Larghezza desiderata (o usa fill se preferisci container fisso)
                    height={150} // Altezza proporzionata (Nextjs la calcola auto se width è settato e height è auto nel css)
                    className={styles.pulsingLogo}
                    priority // Importante: carica l'immagine immediatamente
                />
            </div>
        </div>
    );
}