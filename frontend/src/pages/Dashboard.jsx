import MainLayout from '../components/layout/MainLayout';
import { useConfig } from '../contexts/ConfigContext';

function Dashboard() {
  const { config } = useConfig();
  const logoUrl = config?.logo_url || '/logo.png';

  return (
    <MainLayout pageTitle="Dashboard" fullWidth={true}>
      <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-white dark:bg-black">
        {/* Full Background Logo - Expansion style */}
        <div className="absolute inset-0 z-0 opacity-[0.08] dark:opacity-[0.12] pointer-events-none">
          <img 
            src={logoUrl} 
            alt="" 
            className="w-full h-full object-cover filter grayscale blur-[1px] dark:invert"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center gap-4 px-10">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-black dark:text-white uppercase max-w-4xl leading-none drop-shadow-sm">
            Bienvenido al Panel de Administración
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold whitespace-nowrap">
            Selecciona una opción del menú lateral para comenzar a gestionar tu tienda.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
