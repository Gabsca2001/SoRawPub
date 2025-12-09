'use client';
import Hero from "@/components/Hero";
import BentoSectionOne from "@/components/BentoSectionOne";
import BentoSectionTwo from "@/components/BentoSectionTwo";
import { PageLayout } from "@/components/layouts/PageLayout";
import styles from './Home.module.scss';
import { Footer } from "@/components/Footer";
import GallerySection from '@/components/GallerySection';
import MenuTeaserSection from "@/components/MenuTeaserSection";
// ⛔️ Non usiamo più il MenuSection qui
// import MenuSection from '@/components/MenuSection';

export default function IndexPage() {
    return (
        <PageLayout>
            <div className={styles.snapContainer} id="main-scroller">

                {/* 1. HERO */}
                <div className={styles.section} id="home">
                    <Hero />
                </div>

                {/* 2. BENTO SLIDE 1 */}
                <div id="chi-siamo" className={styles.section}>
                    <BentoSectionOne />
                </div>

                {/* 3. BENTO SLIDE 2 */}
                <div id="chi-siamo-2" className={styles.section}>
                    <BentoSectionTwo />
                </div>

                {/* 4. SEZIONE TEASER MENÙ (usa il nuovo componente) */}
                <div className={styles.section} id="menu">
                    <MenuTeaserSection />
                </div>

                {/* 5. GALLERY */}
                <div className={styles.section} id="gallery">
                    <GallerySection />
                </div>

                {/* 6. FOOTER */}
                <div className={styles.section} id="contact">
                    <Footer />
                </div>

            </div>
        </PageLayout>
    );
}
