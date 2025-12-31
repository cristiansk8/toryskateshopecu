import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-6">😞</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 mb-8">
            Lo sentimos, el producto que buscas no existe o ya no está disponible.
          </p>
          <div className="space-x-4">
            <Link
              href="/productos"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Ver todos los productos
            </Link>
            <Link
              href="/"
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
