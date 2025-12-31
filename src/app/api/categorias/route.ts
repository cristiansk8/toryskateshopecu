// /app/api/categorias/route.ts
import { NextResponse } from 'next/server';
import api from '@/lib/woocommerce'; // usa el cliente que ya tienes

export async function GET() {
  try {
    const response = await api.get('products/categories', {
      per_page: 8,
      hide_empty: true,
      parent: 0
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 });
  }
}
