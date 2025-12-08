'use client';
import BentoSection from "@/components/BentoSection";
import Hero from "@/components/Hero";
// Note: PageLayout might need adjustment if it adds padding/margins.
// If PageLayout is just a wrapper for Navbar/Footer, it's fine, 
// but ensure it doesn't restrict height.
import { PageLayout } from "@/components/layouts/PageLayout";
import styles from './Home.module.scss';
import { Footer } from "@/components/Footer";
import MenuSection from '@/components/MenuSection';
import GallerySection from '@/components/GallerySection';

export default function IndexPage() {
    return (
        <PageLayout>
            {/* The Snap Container acts as the main scrollable area */}
            <div className={styles.snapContainer} id="main-scroller">

                {/* SECTION 1: HERO */}
                <div className={styles.section}>
                    <Hero />
                </div>

                {/* SECTION 2: BENTO GRID */}
                {/* BentoSection needs to fit within 100vh. 
                       If content is too long, it might get cut off or need internal scrolling.
                       For a clean snap effect, BentoSection ideally fits the screen.
                    */}
                <BentoSection />

                <div className={`${styles.section} ${styles.menuScrollable}`}>
                    <MenuSection />
                </div>

                <div className={styles.section}>
                    <GallerySection />
                </div>

                {/* Optional: Add more sections here following the same pattern */}
                <div className={styles.section}>
                    <Footer />
                </div>
            </div>
        </PageLayout>
    );
}