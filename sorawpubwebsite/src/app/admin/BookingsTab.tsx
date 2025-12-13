'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import styles from './admin.module.scss';

// --- ICONE SVG NATIVE (No librerie esterne) ---
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconHistory = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>;
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

interface Reservation {
  id: string;
  name: string;
  date: string;
  timeSlot: string;
  guests: string;
  phone: string;
  email?: string;
  notes?: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}

export default function BookingsTab() {
  const [allBookings, setAllBookings] = useState<Reservation[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "prenotazioni")); 
      const snap = await getDocs(q);
      // Mapping sicuro dei dati
      const rawData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setAllBookings(rawData);
    } catch (e) {
      console.error("Errore fetch bookings", e);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "prenotazioni", id), { status: newStatus });
      setAllBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
    } catch (error) { alert("Errore aggiornamento stato"); }
  };

  // --- LOGICA FILTRI E ORDINAMENTO ---
  const today = new Date().toISOString().split('T')[0];

  const filteredList = allBookings.filter(b => {
    // FIX: Gestione sicura di valori undefined/null
    const nameSafe = (b.name || '').toLowerCase();
    const emailSafe = (b.email || '').toLowerCase();
    const searchSafe = searchTerm.toLowerCase();

    const matchesText = nameSafe.includes(searchSafe) || emailSafe.includes(searchSafe);
    const matchesDate = filterDate ? b.date === filterDate : true;
    
    return matchesText && matchesDate;
  });

  // Dividi in due gruppi
  const upcoming = filteredList.filter(b => b.date >= today);
  const past = filteredList.filter(b => b.date < today);

  // Ordina "In Arrivo": CRESCENTE (Prima oggi, poi domani...)
  upcoming.sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.timeSlot.localeCompare(b.timeSlot);
  });

  // Ordina "Storico": DECRESCENTE (Prima ieri, poi l'altro ieri...)
  past.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.timeSlot.localeCompare(a.timeSlot);
  });

  // Componente Tabella Riutilizzabile
  const BookingsTable = ({ data, emptyMessage }: { data: Reservation[], emptyMessage: string }) => (
    <div className={styles.tableContainer}>
        <div className={styles.tableScroll}> 
            <table className={styles.dataTable}>
            <thead>
                <tr>
                <th>Data & Ora</th>
                <th>Cliente</th>
                <th>Ospiti</th>
                <th>Stato</th>
                <th>Note</th>
                <th>Contatto</th>
                </tr>
            </thead>
            <tbody>
                {data.map((b) => (
                <tr key={b.id}>
                    <td>
                    <div className={styles.dateTime}>
                        <span className={styles.dateText}>{formatDate(b.date)}</span>
                        <span className={styles.timeHighlight}>{b.timeSlot}</span>
                    </div>
                    </td>
                    <td>
                    <div className={styles.clientName}>{b.name || 'Sconosciuto'}</div>
                    <div className={styles.clientEmail}>{b.email || '-'}</div>
                    </td>
                    <td><div className={styles.paxBadge}>{b.guests} pax</div></td>
                    <td>
                    <select 
                        value={b.status || 'pending'} 
                        onChange={(e) => handleStatusChange(b.id, e.target.value)}
                        className={`${styles.statusSelect} ${styles[b.status || 'pending']}`}
                    >
                        <option value="pending">🟡 Attesa</option>
                        <option value="confirmed">🟢 Confermata</option>
                        <option value="cancelled">🔴 Cancellata</option>
                    </select>
                    </td>
                    <td>
                    {b.notes ? (
                        <div 
                            className={styles.notesAlert} 
                            onClick={() => setSelectedNote(b.notes || '')}
                            title="Clicca per leggere la nota completa"
                        >
                            <span className={styles.alertIcon}><IconAlert /></span>
                            <span className={styles.noteContent}>{b.notes}</span>
                        </div>
                    ) : <span className={styles.noNotes}>-</span>}
                    </td>
                    <td><a href={`tel:${b.phone}`} className={styles.phoneLink}>{b.phone}</a></td>
                </tr>
                ))}
                {data.length === 0 && (
                    <tr><td colSpan={6} className={styles.emptyState}>{emptyMessage}</td></tr>
                )}
            </tbody>
            </table>
        </div>
    </div>
  );

  return (
    <>
      <header className={styles.topHeader}>
        <div>
          <h1>Gestione Prenotazioni</h1>
          <p className={styles.subtitle}>
            In arrivo: <b>{upcoming.length}</b> | Storico: <b>{past.length}</b>
          </p>
        </div>
        <div className={styles.actions}>
          <div className={styles.searchBar}>
            <IconSearch />
            <input 
              type="text" 
              placeholder="Cerca cliente..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
            />
          </div>
          <div className={styles.dateFilter}>
            <IconCalendar />
            <input 
              type="date" 
              value={filterDate} 
              onChange={e => setFilterDate(e.target.value)} 
              className={styles.dateInput} 
            />
            {filterDate && <button onClick={() => setFilterDate('')} className={styles.resetBtn}>✕</button>}
          </div>
        </div>
      </header>

      {/* TABELLA 1: IN ARRIVO */}
      <h3 className={styles.sectionTitle}>
        <IconCalendar /> In Arrivo
      </h3>
      <BookingsTable data={upcoming} emptyMessage="Nessuna prenotazione futura." />

      {/* TABELLA 2: STORICO (Solo se necessario) */}
      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle} style={{ opacity: 0.7 }}>
            <IconHistory /> Storico Passato
        </h3>
        <BookingsTable data={past} emptyMessage="Nessuna prenotazione passata." />
      </div>

      {/* MODAL PER LE NOTE */}
      {selectedNote && (
        <div className={styles.modalOverlay} onClick={() => setSelectedNote(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={() => setSelectedNote(null)}>
                    <IconClose />
                </button>
                <h3>Nota Cliente</h3>
                <p>{selectedNote}</p>
            </div>
        </div>
      )}
    </>
  );
}