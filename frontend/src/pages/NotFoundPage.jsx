import { Link } from 'react-router-dom';
import CustomerLayout from '../components/common/CustomerLayout';

function NotFoundPage() {
  return (
    <CustomerLayout>
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="font-display text-6xl font-bold mb-4 text-black dark:text-white">404</h1>
          <h2 className="font-display text-2xl mb-6 text-gray-600 dark:text-gray-400">Producto no encontrado</h2>
          <p className="mb-8 text-gray-500 dark:text-gray-400">
            Lo sentimos, el producto que buscas no existe o ya no está disponible.
          </p>
          <Link
            to="/"
            className="inline-block bg-black dark:bg-white text-white dark:text-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:opacity-80 transition-opacity"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    </CustomerLayout>
  );
}

export default NotFoundPage;
