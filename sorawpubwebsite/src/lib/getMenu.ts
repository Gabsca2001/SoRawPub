import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

// Definiamo l'interfaccia qui per condividerla
export interface MenuItem {
  id: string;
  category: string;
  name: string;
  price: string;
  description: string;
  image?: string | null;
}

export async function getMenuData(): Promise<MenuItem[]> {
  try {

    console.log("Fetching menu data from Firestore...");
    const q = query(collection(db, "menu"));
    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MenuItem[];

    return data;
  } catch (error) {
    console.error("Errore recupero menu server-side:", error);
    return [];
  }
}