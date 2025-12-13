'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query } from 'firebase/firestore';
import styles from './admin.module.scss';

const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;

interface MenuItem {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
}

export default function MenuTab() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newDish, setNewDish] = useState({ name: '', price: '', category: 'cocktail', description: '' });

  const fetchMenu = async () => {
    try {
      const q = query(collection(db, "menu"));
      const snap = await getDocs(q);
      setMenuItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    } catch (e) {
      console.error("Errore fetch menu", e);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleAddDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newDish.name || !newDish.price) return;
    await addDoc(collection(db, "menu"), newDish);
    setNewDish({ name: '', price: '', category: 'cocktail', description: '' });
    setIsFormOpen(false);
    fetchMenu();
  };

  const handleDeleteDish = async (id: string) => {
    if(confirm('Eliminare questo piatto?')) {
      await deleteDoc(doc(db, "menu", id));
      fetchMenu();
    }
  };

  const filteredMenu = menuItems.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className={styles.topHeader}>
        <div>
          <h1>Gestione Menu</h1>
          <p className={styles.subtitle}>Hai {filteredMenu.length} elementi nel menu</p>
        </div>
        <div className={styles.actions}>
            <div className={styles.searchBar}>
                <IconSearch />
                <input type="text" placeholder="Cerca..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <button className={styles.primaryBtn} onClick={() => setIsFormOpen(!isFormOpen)}>
                <IconPlus /> Nuovo Piatto
            </button>
        </div>
      </header>

      <div className={styles.menuGridContainer}>
        {isFormOpen && (
            <div className={styles.dishFormCard}>
                <h3>Nuovo Elemento</h3>
                <form onSubmit={handleAddDish}>
                    <div className={styles.formRow}>
                        <input placeholder="Nome" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} required />
                        <input placeholder="Prezzo" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} required />
                    </div>
                    <select value={newDish.category} onChange={e => setNewDish({...newDish, category: e.target.value})}>
                        <option value="cocktail">Cocktail</option>
                        <option value="wine">Vini</option>
                        <option value="food">Food</option>
                    </select>
                    <textarea placeholder="Descrizione..." value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} />
                    <div className={styles.formActions}>
                        <button type="button" onClick={() => setIsFormOpen(false)}>Annulla</button>
                        <button type="submit" className={styles.saveBtn}>Salva</button>
                    </div>
                </form>
            </div>
        )}

        <div className={styles.cardsGrid}>
            {filteredMenu.map(item => (
                <div key={item.id} className={styles.menuCard}>
                    <div className={styles.cardHeader}>
                        <span className={`${styles.catBadge} ${styles[item.category]}`}>{item.category}</span>
                        <button onClick={() => handleDeleteDish(item.id)} className={styles.iconBtn}><IconTrash /></button>
                    </div>
                    <h4>{item.name}</h4>
                    <p className={styles.desc}>{item.description}</p>
                    <div className={styles.priceTag}>{item.price}</div>
                </div>
            ))}
        </div>
      </div>
    </>
  );
}