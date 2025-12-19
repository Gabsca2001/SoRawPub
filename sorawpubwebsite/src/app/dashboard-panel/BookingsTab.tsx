'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, updateDoc, doc, query } from 'firebase/firestore';
import styles from './admin.module.scss';

// --- ICONE SVG ---
const IconSearch = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const IconCalendar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconHistory = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>;
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const IconClose = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconMail = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

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

// Interfaccia per il Modale di Cambio Stato
interface StatusModalData {
  isOpen: boolean;
  booking: Reservation | null;
  newStatus: string;
}

export default function BookingsTab() {
  const [allBookings, setAllBookings] = useState<Reservation[]>([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  // STATO PER IL MODALE DI CONFERMA STATO
  const [statusModal, setStatusModal] = useState<StatusModalData>({
    isOpen: false,
    booking: null,
    newStatus: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const [year, month, day] = dateString.split('-');
    return `${day}-${month}-${year}`;
  };

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, "prenotazioni")); 
      const snap = await getDocs(q);
      const rawData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
      setAllBookings(rawData);
    } catch (e) {
      console.error("Errore fetch bookings", e);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // 1. Trigger iniziale: apre il modale invece di aggiornare subito
  const initiateStatusChange = (booking: Reservation, newStatus: string) => {
    setStatusModal({
      isOpen: true,
      booking: booking,
      newStatus: newStatus
    });
  };

  // 2. Conferma Azione: Aggiorna DB + Invia Email
  const handleConfirmStatusChange = async () => {
    const { booking, newStatus } = statusModal;
    if (!booking) return;

    setIsUpdating(true);

    try {
      // A. Aggiorna Firestore
      await updateDoc(doc(db, "prenotazioni", booking.id), { status: newStatus });
      
      // B. Aggiorna UI locale
      setAllBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: newStatus as any } : b));

      // C. Invia Email (se c'è l'indirizzo)
      if (booking.email) {
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: booking.email,
            name: booking.name,
            date: formatDate(booking.date),
            time: booking.timeSlot,
            guests: booking.guests,
            status: newStatus // 'confirmed' o 'cancelled'
          })
        });

        if (!response.ok) throw new Error("Errore invio email");
        console.log("Email inviata con successo");
      }

      // Chiudi modale
      setStatusModal({ isOpen: false, booking: null, newStatus: '' });

    } catch (error) {
      console.error(error);
      alert("Stato aggiornato, ma errore nell'invio dell'email.");
    } finally {
      setIsUpdating(false);
    }
  };

  // --- LOGICA FILTRI E ORDINAMENTO ---
  const today = new Date().toISOString().split('T')[0];

  const filteredList = allBookings.filter(b => {
    const nameSafe = (b.name || '').toLowerCase();
    const emailSafe = (b.email || '').toLowerCase();
    const searchSafe = searchTerm.toLowerCase();
    const matchesText = nameSafe.includes(searchSafe) || emailSafe.includes(searchSafe);
    const matchesDate = filterDate ? b.date === filterDate : true;
    return matchesText && matchesDate;
  });

  const upcoming = filteredList.filter(b => b.date >= today);
  const past = filteredList.filter(b => b.date < today);

  upcoming.sort((a, b) => a.date !== b.date ? a.date.localeCompare(b.date) : a.timeSlot.localeCompare(b.timeSlot));
  past.sort((a, b) => a.date !== b.date ? b.date.localeCompare(a.date) : b.timeSlot.localeCompare(a.timeSlot));

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
                    {/* MODIFICA: L'onChange ora chiama initiateStatusChange */}
                    <select 
                        value={b.status || 'pending'} 
                        onChange={(e) => initiateStatusChange(b, e.target.value)}
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

      <h3 className={styles.sectionTitle}><IconCalendar /> In Arrivo</h3>
      <BookingsTable data={upcoming} emptyMessage="Nessuna prenotazione futura." />

      <div className={styles.historySection}>
        <h3 className={styles.sectionTitle} style={{ opacity: 0.7 }}><IconHistory /> Storico Passato</h3>
        <BookingsTable data={past} emptyMessage="Nessuna prenotazione passata." />
      </div>

      {/* MODAL PER LE NOTE */}
      {selectedNote && (
        <div className={styles.modalOverlay} onClick={() => setSelectedNote(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={() => setSelectedNote(null)}><IconClose /></button>
                <h3>Nota Cliente</h3>
                <p>{selectedNote}</p>
            </div>
        </div>
      )}

      {/* NUOVO MODAL: CONFERMA CAMBIO STATO */}
      {statusModal.isOpen && statusModal.booking && (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent} style={{ maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ marginBottom: '1rem', color: '#666' }}>
                    <IconMail />
                </div>
                <h3>Aggiorna Stato e Invia Email</h3>
                <p>
                    Stai per cambiare lo stato della prenotazione di <strong>{statusModal.booking.name}</strong> in:
                </p>
                <div className={`${styles.statusBadge} ${styles[statusModal.newStatus]}`} style={{ display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', margin: '1rem 0', fontWeight: 'bold' }}>
                    {statusModal.newStatus === 'confirmed' ? 'CONFERMATA' : statusModal.newStatus === 'cancelled' ? 'CANCELLATA' : 'ATTESA'}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                    Verrà inviata automaticamente una email di notifica all'indirizzo: <br/>
                    <u>{statusModal.booking.email || 'Nessuna email presente'}</u>
                </p>
                
                <div className={styles.modalActions} style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button 
                        className={styles.btnSecondary} 
                        onClick={() => setStatusModal({ ...statusModal, isOpen: false })}
                        disabled={isUpdating}
                    >
                        Annulla
                    </button>
                    <button 
                        className={styles.btnPrimary} 
                        onClick={handleConfirmStatusChange}
                        disabled={isUpdating}
                        style={{ backgroundColor: statusModal.newStatus === 'confirmed' ? '#4caf50' : '#f44336', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        {isUpdating ? 'Invio in corso...' : 'Conferma e Invia'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </>
  );
}