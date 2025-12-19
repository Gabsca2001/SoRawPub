'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';

export default function LoginPage() {
  const { user, login, loading } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // NUOVO STATO: Gestisce la visibilità della password
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard-panel');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // DEBUG: Verifichiamo che il click funzioni e i dati ci siano
    console.log("Tentativo di login in corso con email:", email);

    try {
      await login(email, password);
      // Se arrivi qui, il login ha funzionato
      console.log("Login effettuato con successo!");
    } catch (err: any) {
      // --- QUI C'È LA MAGIA ---
      // Stampiamo l'oggetto errore completo per vedere cosa succede davvero
      console.error("Dettagli completi errore:", err);
      console.log("Codice errore:", err.code);
      console.log("Messaggio errore:", err.message);
      // ------------------------

      if (err.code === 'auth/invalid-credential') {
        setError('Email o password errati.');
      } else {
        // Aggiungiamo il messaggio tecnico all'errore visibile per aiutarti subito
        setError(`Si è verificato un errore: ${err.message || 'Sconosciuto'}`);
      }
    }
  };

  if (loading) return null;

  return (
    <div className={styles.loginContainer}>
      <div className={styles.card}>
        <h1>Area Riservata</h1>
        <p>Inserisci le credenziali di staff.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Wrapper per Input Password + Occhio */}
          <div className={styles.inputGroup}>
            <div className={styles.passwordWrapper}>
              <input
                // Cambia tipo dinamicamente
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button" // Importante: evita il submit del form
                className={styles.eyeBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostra password"
              >
                {showPassword ? (
                  // Icona Occhio Aperto (Mostra)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  // Icona Occhio Sbarrato (Nascondi)
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button type="submit" className={styles.loginBtn}>
            Entra
          </button>
        </form>
      </div>
    </div>
  );
}