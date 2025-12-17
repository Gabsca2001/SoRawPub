import MenuSection from "@/components/MenuSection";
import { getMenuData } from "@/lib/getMenu";

export const revalidate = 3600; 

export default async function MenuPage() {
  // 1. Fetch dei dati lato server (non consuma letture per ogni utente grazie alla cache)
  const menuItems = await getMenuData();

  return (
    <main>
      {/* 2. Passiamo i dati pronti al componente Client */}
      <MenuSection initialMenuItems={menuItems} />
    </main>
  );
}