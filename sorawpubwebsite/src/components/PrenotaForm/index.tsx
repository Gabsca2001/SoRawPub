'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import styles from './PrenotaForm.module.scss';

// Struttura dati
interface ReservationData {
    date: string;
    guests: number;
    timeSlot: string;
    name: string;
    phone: string;
    email: string;
    notes: string;
}

// Struttura per gestire gli errori di validazione
interface FormErrors {
    [key: string]: string;
}

// Stati possibili del form
type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

export default function PrenotaForm() {

    // Data di oggi per il default e la validazione
    const today = new Date().toISOString().split('T')[0];

    // Stato Dati
    const [formData, setFormData] = useState<ReservationData>({
        date: today,
        guests: 2,
        timeSlot: '',
        name: '',
        phone: '',
        email: '',
        notes: ''
    });

    // Stato Errori (per mostrare messaggi sotto i campi)
    const [errors, setErrors] = useState<FormErrors>({});

    // Stato Invio
    const [status, setStatus] = useState<FormStatus>('idle');

    const [showModal, setShowModal] = useState(false);

    const timeSlots: string[] = [
        '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
    ];

    // --- 1. FUNZIONE DI SANITIZZAZIONE ---
    const sanitizeInput = (input: string) => {
        return input.replace(/<[^>]*>?/gm, '').trim();
    };

    // --- 2. FUNZIONE DI VALIDAZIONE ---
    const validateForm = (data: ReservationData): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!data.name || data.name.length < 2) {
            newErrors.name = "Inserisci un nome valido.";
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            newErrors.email = "Inserisci un'email valida.";
            isValid = false;
        }

        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!data.phone || !phoneRegex.test(data.phone)) {
            newErrors.phone = "Inserisci un numero di telefono valido.";
            isValid = false;
        }

        if (data.date < today) {
            newErrors.date = "Non puoi prenotare nel passato.";
            isValid = false;
        }

        if (!data.timeSlot) {
            newErrors.timeSlot = "Seleziona un orario.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Gestore input
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const incrementGuests = () => {
        setFormData(prev => ({ ...prev, guests: prev.guests + 1 }));
    };

    const decrementGuests = () => {
        setFormData(prev => ({
            ...prev,
            guests: prev.guests > 1 ? prev.guests - 1 : 1
        }));
    };

    const handleCloseModal = () => {
        setShowModal(false);
        // Opzionale: resettare lo status a 'idle' se vuoi permettere un nuovo invio immediato
        // setStatus('idle'); 
    };

    // --- GESTORE SUBMIT (CON TIMEOUT E DEBUG) ---
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 1. Sanitizzazione
        const cleanData: ReservationData = {
            date: formData.date,
            guests: formData.guests,
            timeSlot: sanitizeInput(formData.timeSlot),
            name: sanitizeInput(formData.name),
            phone: sanitizeInput(formData.phone),
            email: sanitizeInput(formData.email),
            notes: sanitizeInput(formData.notes)
        };

        // 2. Validazione
        if (!validateForm(cleanData)) return;

        setStatus('submitting');
        console.log("Tentativo invio a Firebase (Collezione: bookings)...");

        try {
            // 3. Creiamo un Timer che esplode dopo 10 secondi se Firebase non risponde
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Timeout: Il server non risponde. Controlla la tua connessione internet o firewall.")), 10000)
            );

            const firebaseData = {
                ...cleanData,
                guests: String(cleanData.guests), // Salva come stringa su Firebase
                createdAt: serverTimestamp(),
                status: 'pending'
            };

            // 4. La chiamata reale a Firebase
            const firebasePromise = addDoc(collection(db, "prenotazioni"), firebaseData);

            // 5. Gara: chi finisce prima vince via Promise.race
            // Se Firebase è bloccato, vincerà il timeoutPromise e lancerà l'errore
            await Promise.race([firebasePromise, timeoutPromise]);

            console.log("Prenotazione salvata con successo!");
            setStatus('success');

            // Reset form
            setFormData({
                date: today,
                guests: 2,
                timeSlot: '',
                name: '',
                phone: '',
                email: '',
                notes: ''
            });
            setErrors({});

            setShowModal(true);

        } catch (error: any) {
            console.error("ERRORE SALVATAGGIO:", error);
            setStatus('error');

            // Mostra un alert visibile all'utente con il motivo tecnico
            alert("Impossibile completare la prenotazione:\n" + error.message);
        }
    };

    return (
        <section className={styles.reservationSection} id="reservation">
            <div className={styles.container}>

                <div className={styles.header}>
                    <span className={styles.subtitle}>Book your table</span>
                    <h2 className={styles.title}>Prenota un'Esperienza</h2>
                    <p className={styles.description}>
                        Assicurati un posto per il tuo racconto liquido.
                        Per tavoli superiori a 8 persone, contattaci direttamente.
                    </p>
                    <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '1rem' }}>
                        * Campi obbligatori
                    </p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>

                    {/* RIGA 1 */}
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="date">Giorno *</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                required
                                min={today}
                                value={formData.date}
                                onChange={handleChange}
                                className={errors.date ? styles.inputError : ''}
                            />
                            {errors.date && <span className={styles.errorText}>{errors.date}</span>}
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Ospiti *</label>
                            <div className={styles.guestCounter}>
                                <button
                                    type="button"
                                    className={styles.counterBtn}
                                    onClick={decrementGuests}
                                    disabled={formData.guests <= 1}
                                >
                                    -
                                </button>
                                <span className={styles.guestValue}>
                                    {formData.guests} {formData.guests === 1 ? 'Persona' : 'Persone'}
                                </span>
                                <button
                                    type="button"
                                    className={styles.counterBtn}
                                    onClick={incrementGuests}
                                >
                                    +
                                </button>
                            </div>
                            {formData.guests > 8 && (
                                <span className={styles.infoText}>Per gruppi numerosi contattaci.</span>
                            )}
                        </div>
                    </div>

                    {/* RIGA 2 */}
                    <div className={styles.inputGroup}>
                        <label className={errors.timeSlot ? styles.textError : ''}>Orario Preferito *</label>
                        <div className={styles.slotsContainer}>
                            {timeSlots.map((slot) => (
                                <label
                                    key={slot}
                                    className={`${styles.slotLabel} ${formData.timeSlot === slot ? styles.selected : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="timeSlot"
                                        value={slot}
                                        checked={formData.timeSlot === slot}
                                        onChange={handleChange}
                                        className={styles.hiddenRadio}
                                    />
                                    <span>{slot}</span>
                                </label>
                            ))}
                        </div>
                        {errors.timeSlot && <span className={styles.errorText}>{errors.timeSlot}</span>}
                    </div>

                    {/* RIGA 3 */}
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Nome Completo *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Mario Rossi"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? styles.inputError : ''}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="phone">Telefono *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="+39 333 ..."
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className={errors.phone ? styles.inputError : ''}
                            />
                            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                        </div>
                    </div>

                    {/* RIGA 4 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="esempio@email.com"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : ''}
                        />
                        {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>

                    {/* RIGA 5 */}
                    <div className={styles.inputGroup}>
                        <label htmlFor="notes">Note / Allergie</label>
                        <textarea
                            id="notes"
                            name="notes"
                            placeholder="Segnala intolleranze, allergie o richieste speciali..."
                            rows={3}
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={styles.submitBtn}
                        disabled={status === 'submitting' || status === 'success'}
                    >
                        {status === 'submitting' ? 'Invio in corso...' :
                            status === 'success' ? 'Prenotazione Inviata' :
                                status === 'error' ? 'Errore. Riprova.' : 'Conferma Prenotazione'}
                    </button>

                    {status === 'success' && (
                        <div className={styles.successMessage}>
                            Grazie! Richiesta di prenotazione inviata con successo.
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ color: '#ff6b6b', marginTop: '1rem', textAlign: 'center' }}>
                            Si è verificato un errore durante l'invio.
                        </div>
                    )}
                </form>

                {showModal && (
                    <div className={styles.modalOverlay} onClick={handleCloseModal}>
                        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                            <div className={styles.modalIcon}>
                                ✅
                            </div>
                            <h3 className={styles.modalTitle}>Richiesta Inviata!</h3>
                            <p className={styles.modalText}>
                                Grazie <strong>{formData.name}</strong>, abbiamo ricevuto la tua richiesta.
                            </p>
                            <div className={styles.modalWarningBox}>
                                <p>
                                    <strong>Attenzione:</strong> La prenotazione è in attesa di conferma.
                                    Riceverai una <u>email</u> o un <u>messaggio</u> solo se la richiesta verrà accettata dallo staff.
                                </p>
                            </div>
                            <button className={styles.modalCloseBtn} onClick={handleCloseModal}>
                                Ho capito, grazie
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}