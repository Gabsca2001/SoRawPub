'use client';
import BentoSection from "@/components/BentoSection";
import Hero from "@/components/Hero";
import { PageLayout } from "@/components/layouts/PageLayout";
import styles from './Home.module.scss';
import { Footer } from "@/components/Footer";
import MenuSection from '@/components/MenuSection';
import GallerySection from '@/components/GallerySection';

export default function IndexPage() {
    return (
        <PageLayout>
            <div className={styles.snapContainer} id="main-scroller">

                <div className={styles.section} id="home">
                    <Hero />
                </div>

                <div id="chi-siamo" className={styles.section}>
                    <BentoSection />
                </div>

                <div className={`${styles.section} ${styles.menuScrollable}`} id="menu">
                    <MenuSection />
                </div>

                <div className={styles.section} id="gallery">
                    <GallerySection />
                </div>

                <div className={styles.section} id="contact">
                    <Footer />
                </div>

            </div>
        </PageLayout>
    );
}
