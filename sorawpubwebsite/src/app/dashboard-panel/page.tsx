'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './admin.module.scss';

// Importiamo i sotto-componenti
import BookingsTab from './BookingsTab';
import MenuTab from './MenuTab';

// Icone Sidebar
const IconUsers = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconMenu = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>;

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'bookings' | 'menu'>('bookings');

  // Protezione Rotta
  useEffect(() => {
    if (!loading && !user) router.push('/wp-admin-login-so-raw');
  }, [user, loading, router]);

  if (loading || !user) return <div className={styles.loadingScreen}>Loading...</div>;

  return (
    <div className={styles.dashboardLayout}>
      
      {/* SIDEBAR */}
      <nav className={styles.navbar}>
        <div className={styles.brand}>
             <span className={styles.logoText}>SO RAW</span>
             <span className={styles.badge}>ADMIN</span>
        </div>
        
        <div className={styles.navLinks}>
            <button 
                className={activeTab === 'bookings' ? styles.active : ''} 
                onClick={() => setActiveTab('bookings')}
            >
                <IconUsers /> <span>Prenotazioni</span>
            </button>
            <button 
                className={activeTab === 'menu' ? styles.active : ''} 
                onClick={() => setActiveTab('menu')}
            >
                <IconMenu /> <span>Menu & Drink</span>
            </button>
        </div>

        <div className={styles.navFooter}>
            <div className={styles.userAvatar}>
                {user.email?.charAt(0).toUpperCase()}
            </div>
            <button onClick={() => logout()} className={styles.logoutBtn}>Esci</button>
        </div>
      </nav>

      {/* MAIN CONTENT - Renderizza il componente in base al Tab */}
      <main className={styles.mainContent}>
        {activeTab === 'bookings' ? <BookingsTab /> : <MenuTab />}
      </main>

    </div>
  );
}