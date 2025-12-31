// src/app/api/user/getUserActiveCategories.ts

export interface UserActiveCategory {
    categoryId: string;
    name: string;
    selected: boolean;
    createdAt: string;
  }
  
  export default async function getUserActiveCategories(): Promise<UserActiveCategory[]> {
    const email = process.env.userEmail;
  
    if (!email) {
      console.error("Falta la variable de entorno userEmail");
      return [];
    }
  
    try {
      const res = await fetch(`https://vendetiyo.vercel.app/api/cat?email=${email}`, {
        cache: 'no-cache'
      });
  
      if (!res.ok) {
        throw new Error(`Error al obtener categorías activas del usuario: ${res.status}`);
      }
  
      const data: UserActiveCategory[] = await res.json();
  
      // Filtrar solo las que están seleccionadas
      return data.filter(cat => cat.selected);
    } catch (error) {
      console.error("Error al consumir el endpoint de categorías activas:", error);
      return [];
    }
  }
  