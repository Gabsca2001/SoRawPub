'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import styles from './admin.module.scss';

// --- ICONE SVG COMPONENTS (Per non installare librerie extra) ---
const IconUsers = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconMenu = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>;
const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

// Tipi dati
interface Reservation {
  id: string;
  name: string;
  date: string;
  timeSlot: string;
  guests: string;
  phone: string;
  email?: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
}

export default function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'bookings' | 'menu'>('bookings');
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stato form Menu (Toggle visibilità)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', category: 'cocktail', description: '' });

  // 1. Protezione Rotta
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // 2. Fetch Dati
  const fetchData = async () => {
    try {
        const qBookings = query(collection(db, "bookings"), orderBy("date", "desc"));
        const bookingsSnap = await getDocs(qBookings);
        setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));

        const qMenu = query(collection(db, "menu"));
        const menuSnap = await getDocs(qMenu);
        setMenuItems(menuSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    } catch (e) {
        console.error("Errore fetch", e);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // 3. Logica Menu
  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newDish.name || !newDish.price) return;
    
    await addDoc(collection(db, "menu"), newDish);
    setNewDish({ name: '', price: '', category: 'cocktail', description: '' });
    setIsFormOpen(false); // Chiude il form dopo l'aggiunta
    fetchData(); 
  };

  const handleDeleteDish = async (id: string) => {
    if(confirm('Confermi l\'eliminazione?')) {
      await deleteDoc(doc(db, "menu", id));
      fetchData();
    }
  };

  // 4. Filtro Ricerca
  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.date.includes(searchTerm)
  );

  const filteredMenu = menuItems.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || !user) return <div className={styles.loadingScreen}>Loading...</div>;

  return (
    <div className={styles.dashboardLayout}>
      
      {/* SIDEBAR / NAVBAR (Mobile Responsive) */}
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

      {/* MAIN CONTENT */}
      <main className={styles.mainContent}>
        
        {/* HEADER AREA: Titolo + Ricerca */}
        <header className={styles.topHeader}>
            <div>
                <h1>{activeTab === 'bookings' ? 'Gestione Prenotazioni' : 'Gestione Menu'}</h1>
                <p className={styles.subtitle}>
                    {activeTab === 'bookings' 
                        ? `Hai ${filteredBookings.length} prenotazioni in lista` 
                        : `Hai ${filteredMenu.length} elementi nel menu`
                    }
                </p>
            </div>
            <div className={styles.actions}>
                <div className={styles.searchBar}>
                    <IconSearch />
                    <input 
                        type="text" 
                        placeholder="Cerca..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {activeTab === 'menu' && (
                    <button className={styles.primaryBtn} onClick={() => setIsFormOpen(!isFormOpen)}>
                        <IconPlus /> Nuovo Piatto
                    </button>
                )}
            </div>
        </header>

        {/* --- VIEW: PRENOTAZIONI --- */}
        {activeTab === 'bookings' && (
            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Slot</th>
                            <th>Cliente</th>
                            <th>Ospiti</th>
                            <th>Contatto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((b) => (
                            <tr key={b.id}>
                                <td><span className={styles.dateBadge}>{b.date}</span></td>
                                <td className={styles.highlight}>{b.timeSlot}</td>
                                <td>
                                    <div className={styles.clientName}>{b.name}</div>
                                    <div className={styles.clientEmail}>{b.email || '-'}</div>
                                </td>
                                <td>{b.guests} pax</td>
                                <td><a href={`tel:${b.phone}`} className={styles.phoneLink}>{b.phone}</a></td>
                            </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr><td colSpan={5} className={styles.emptyState}>Nessun risultato trovato</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        {/* --- VIEW: MENU --- */}
        {activeTab === 'menu' && (
            <div className={styles.menuGridContainer}>
                
                {/* Form a scomparsa */}
                {isFormOpen && (
                    <div className={styles.dishFormCard}>
                        <h3>Nuovo Elemento</h3>
                        <form onSubmit={handleAddDish}>
                            <div className={styles.formRow}>
                                <input 
                                    placeholder="Nome (es. Negroni)" 
                                    value={newDish.name} 
                                    onChange={e => setNewDish({...newDish, name: e.target.value})} 
                                    required
                                />
                                <input 
                                    placeholder="Prezzo (es. 12€)" 
                                    value={newDish.price} 
                                    onChange={e => setNewDish({...newDish, price: e.target.value})} 
                                    required
                                />
                            </div>
                            <select 
                                value={newDish.category}
                                onChange={e => setNewDish({...newDish, category: e.target.value})}
                            >
                                <option value="cocktail">Cocktail</option>
                                <option value="wine">Vini</option>
                                <option value="food">Food</option>
                            </select>
                            <textarea 
                                placeholder="Descrizione ingredienti..." 
                                value={newDish.description} 
                                onChange={e => setNewDish({...newDish, description: e.target.value})} 
                            />
                            <div className={styles.formActions}>
                                <button type="button" onClick={() => setIsFormOpen(false)}>Annulla</button>
                                <button type="submit" className={styles.saveBtn}>Salva Elemento</button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Griglia Cards */}
                <div className={styles.cardsGrid}>
                    {filteredMenu.map(item => (
                        <div key={item.id} className={styles.menuCard}>
                            <div className={styles.cardHeader}>
                                <span className={`${styles.catBadge} ${styles[item.category]}`}>{item.category}</span>
                                <button onClick={() => handleDeleteDish(item.id)} className={styles.iconBtn}>
                                    <IconTrash />
                                </button>
                            </div>
                            <h4>{item.name}</h4>
                            <p className={styles.desc}>{item.description}</p>
                            <div className={styles.priceTag}>{item.price}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>
    </div>
  );
}