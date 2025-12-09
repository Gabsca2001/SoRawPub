'use client';

import Link from 'next/link';
import styles from './MenuTeaserSection.module.scss';

export default function MenuTeaserSection() {
  return (
    <section className={styles.menuTeaser}>
      <span className={styles.menuTeaserSubtitle}>Taste Experience</span>
      <h2 className={styles.menuTeaserTitle}>Il nostro Menù</h2>

      <p className={styles.menuTeaserText}>
        Signature cocktails, raw bar, tapas e cucina contemporanea.
        Scopri tutte le proposte nella pagina dedicata.
      </p>

      <Link href="/menu" className={styles.menuTeaserButton}>
        Vai al menù
      </Link>
    </section>
  );
}
