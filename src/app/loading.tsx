export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Cargando...</h2>
        <p className="text-gray-600">Por favor espera un momento</p>
      </div>
    </div>
  );
}
