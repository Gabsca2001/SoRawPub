import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Dichiariamo le variabili con il loro Tipo corretto
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Logica di inizializzazione
if (getApps().length > 0) {
  // Se l'app esiste già, usala
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app, "sorawdb");
} else if (firebaseConfig.apiKey) {
  // Se non esiste ma abbiamo la chiave, inizializzala
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app, "sorawdb");
} else {
  // CASO SPECIALE (Build Time):
  // Se siamo in fase di build e non ci sono le chiavi, impostiamo a "null" 
  // ma mentiamo a TypeScript dicendo "as any" per non far rompere le altre pagine (come BookingsTab)
  app = null as any;
  auth = null as any;
  db = null as any;
}

export { app, auth, db };