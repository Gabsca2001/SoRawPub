'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  User 
} from 'firebase/auth';
import { auth } from '../lib/firebase'; // Questo può essere null durante la build

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>; 
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- FIX 1: Controllo di sicurezza ---
    // Se auth è null (es. durante la build o chiavi mancanti), fermiamo il caricamento
    if (!auth) {
      console.warn("Firebase Auth non inizializzato (Mancano le chiavi API o siamo in fase di build).");
      setLoading(false); 
      return;
    }

    // Se auth esiste, procediamo con il listener normale
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    // --- FIX 2: Controllo prima del login ---
    if (!auth) {
        throw new Error("Servizio di autenticazione non disponibile (Auth è null).");
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Login fallito", error);
      throw error; 
    }
  };

  const logout = async () => {
     // --- FIX 3: Controllo prima del logout ---
     if (auth) {
         await signOut(auth);
     }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);