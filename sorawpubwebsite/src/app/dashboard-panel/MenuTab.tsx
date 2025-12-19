'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
// Aggiunto updateDoc agli import
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import styles from './admin.module.scss';
import categoriesData from '@/data/categories.json';

// Icone
const IconSearch = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconPlus = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const IconFilter = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
// Nuova Icona Edit
const IconEdit = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

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
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Stato per tracciare se stiamo modificando un elemento (contiene l'ID)
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newDish, setNewDish] = useState({ 
    name: '', 
    price: '', 
    category: categoriesData[0].id, 
    description: '' 
  });

  const fetchMenu = async () => {
    try {
      const q = query(collection(db, "menu"));
      const snap = await getDocs(q);
      setMenuItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem)));
    } catch (e) {
      console.error("Errore fetch menu", e);
    }
  };

  useEffect(() => { fetchMenu(); }, []);

  // UNICA FUNZIONE PER SALVARE (CREA O AGGIORNA)
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newDish.name || !newDish.price) return;

    try {
        if (editingId) {
            // LOGICA MODIFICA
            const dishRef = doc(db, "menu", editingId);
            await updateDoc(dishRef, newDish);
        } else {
            // LOGICA CREAZIONE
            await addDoc(collection(db, "menu"), newDish);
        }

        // Reset form
        setNewDish({ name: '', price: '', category: categoriesData[0].id, description: '' });
        setEditingId(null);
        setIsFormOpen(false);
        fetchMenu();

    } catch (error) {
        console.error("Errore salvataggio:", error);
        alert("Errore durante il salvataggio.");
    }
  };

  // AVVIA MODIFICA
  const handleEditClick = (item: MenuItem) => {
    setNewDish({
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description
    });
    setEditingId(item.id);
    setIsFormOpen(true);
    // Scrolla in alto verso il form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ANNULLA
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setNewDish({ name: '', price: '', category: categoriesData[0].id, description: '' });
  };

  const handleDeleteDish = async (id: string) => {
    if(confirm('Eliminare questo piatto?')) {
      await deleteDoc(doc(db, "menu", id));
      fetchMenu();
    }
  };

  const getCategoryLabel = (catId: string) => {
    const category = categoriesData.find(c => c.id === catId);
    return category ? category.label : catId;
  };

  const filteredMenu = menuItems.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <header className={styles.topHeader}>
        <div>
          <h1>Gestione Menu</h1>
          <p className={styles.subtitle}>
             Visualizzando {filteredMenu.length} piatti
          </p>
        </div>
        <div className={styles.actions}>
            <div className={styles.searchBar}>
                <IconSearch />
                <input 
                  type="text" 
                  placeholder="Cerca piatto..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                />
            </div>

            <div className={styles.filterWrapper}>
                <IconFilter />
                <select 
                  value={filterCategory} 
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={styles.filterSelect}
                >
                    <option value="all">Tutte le categorie</option>
                    {categoriesData.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                </select>
            </div>

            <button className={styles.primaryBtn} onClick={() => { setIsFormOpen(!isFormOpen); setEditingId(null); }}>
                <IconPlus /> Nuovo
            </button>
        </div>
      </header>

      <div className={styles.menuContainer}>
        
        {/* FORM (Dinamico per Creazione o Modifica) */}
        {isFormOpen && (
            <div className={styles.dishFormCard}>
                <h3>{editingId ? 'Modifica Piatto' : 'Nuovo Piatto'}</h3>
                <form onSubmit={handleSaveDish}>
                    <div className={styles.formRow}>
                        <input placeholder="Nome Piatto" value={newDish.name} onChange={e => setNewDish({...newDish, name: e.target.value})} required />
                        <input placeholder="Prezzo (es. €12)" value={newDish.price} onChange={e => setNewDish({...newDish, price: e.target.value})} required />
                    </div>
                    <select value={newDish.category} onChange={e => setNewDish({...newDish, category: e.target.value})}>
                        {categoriesData.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                    <textarea placeholder="Descrizione ingredienti..." value={newDish.description} onChange={e => setNewDish({...newDish, description: e.target.value})} />
                    <div className={styles.formActions}>
                        <button type="button" onClick={handleCancel}>Annulla</button>
                        <button type="submit" className={styles.saveBtn}>
                            {editingId ? 'Aggiorna' : 'Salva'}
                        </button>
                    </div>
                </form>
            </div>
        )}

        {/* TABELLA */}
        <div className={styles.tableScroll}>
            <table className={styles.menuTable}>
                <thead>
                    <tr>
                        <th style={{width: '25%'}}>Nome</th>
                        <th style={{width: '15%'}}>Categoria</th>
                        <th style={{width: '35%'}}>Descrizione</th>
                        <th style={{width: '10%'}}>Prezzo</th>
                        <th style={{width: '15%', textAlign: 'center'}}>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMenu.map(item => (
                        <tr key={item.id}>
                            <td className={styles.nameCell}>{item.name}</td>
                            <td>
                                <span className={styles.catBadge}>
                                    {getCategoryLabel(item.category)}
                                </span>
                            </td>
                            <td className={styles.descCell} title={item.description}>
                                {item.description || '-'}
                            </td>
                            <td className={styles.priceCell}>{item.price}</td>
                            <td style={{textAlign: 'center'}}>
                                <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                                    {/* PULSANTE MODIFICA */}
                                    <button 
                                        onClick={() => handleEditClick(item)} 
                                        className={styles.editBtn}
                                        title="Modifica"
                                    >
                                        <IconEdit />
                                    </button>
                                    
                                    {/* PULSANTE ELIMINA */}
                                    <button 
                                        onClick={() => handleDeleteDish(item.id)} 
                                        className={styles.deleteBtn}
                                        title="Elimina"
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredMenu.length === 0 && (
                        <tr>
                            <td colSpan={5} className={styles.emptyState}>
                                Nessun piatto trovato con questi filtri.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </>
  );
}