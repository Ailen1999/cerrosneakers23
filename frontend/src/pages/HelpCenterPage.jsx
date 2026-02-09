import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useConfig } from '../contexts/ConfigContext';

const HelpCenterPage = () => {
  const { config } = useConfig();
  const navigate = useNavigate();
  const whatsappNumber = config?.whatsapp_number || '5491166204042';

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola! Tengo una duda sobre Envíos/Pagos/Cambios.");
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-black dark:text-white transition-colors duration-300 min-h-screen font-display">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-6 md:px-20 lg:px-40 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            {config?.logo_url ? (
              <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center p-1.5 shadow-md border border-white/10">
                <img 
                  src={config.logo_url} 
                  alt={config.store_name} 
                  className="max-h-full max-w-full object-contain invert-0" 
                />
              </div>
            ) : (
              <div className="size-6 text-black dark:text-white">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
            )}
            <h2 className="text-lg font-extrabold tracking-tighter uppercase">{config?.store_name || 'Cerro Sneakers'}</h2>
          </div>
          <button 
            onClick={() => window.close()} 
            className="group flex items-center justify-center h-10 w-10 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </header>

        <main className="flex-1 px-6 md:px-20 lg:px-40 py-16 max-w-7xl mx-auto w-full">
          {/* Headline */}
          <div className="mb-16">
            <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-4 text-black dark:text-white">AYUDA</h1>
            <div className="h-1 w-20 bg-primary"></div>
          </div>

          {/* Accordion Section */}
          <div className="flex flex-col">
            {/* ENVÍOS */}
            <details className="group py-8 border-t border-black dark:border-gray-800" open>
              <summary className="flex cursor-pointer items-center justify-between gap-6 outline-none list-none">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase group-hover:pl-2 transition-all duration-300">Envíos</h2>
                <div className="text-black dark:text-white transition-transform duration-300 group-open:rotate-180">
                  <span className="material-symbols-outlined text-3xl">expand_more</span>
                </div>
              </summary>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-black/70 dark:text-white/70 leading-relaxed">
                <div className="space-y-4">
                  <p className="font-bold text-black dark:text-white">TIEMPOS DE ENTREGA</p>
                  <p>Realizamos envíos a todo el país a través de nuestra red logística premium para asegurar que tus sneakers lleguen en perfectas condiciones.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>CABA y GBA: 2 a 4 días hábiles.</li>
                    <li>Resto del país: 5 a 8 días hábiles.</li>
                    <li>Tierra del Fuego: 10 a 15 días hábiles.</li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <p className="font-bold text-black dark:text-white">COSTOS Y SEGUIMIENTO</p>
                  <p>El costo de envío se calcula al finalizar la compra. Ofrecemos envío gratuito en compras superiores a $150.000.</p>
                  <p>Una vez despachado el pedido, recibirás un correo con el código de seguimiento para monitorear tu paquete en tiempo real.</p>
                </div>
              </div>
            </details>

            {/* MEDIOS DE PAGO */}
            <details className="group py-8 border-t border-black dark:border-gray-800">
              <summary className="flex cursor-pointer items-center justify-between gap-6 outline-none list-none">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase group-hover:pl-2 transition-all duration-300">Medios de Pago</h2>
                <div className="text-black dark:text-white transition-transform duration-300 group-open:rotate-180">
                  <span className="material-symbols-outlined text-3xl">expand_more</span>
                </div>
              </summary>
              <div className="mt-8 text-black/70 dark:text-white/70 leading-relaxed max-w-3xl">
                <p className="mb-6">Aceptamos las principales tarjetas de crédito y débito del país. Trabajamos con plataformas de pago seguras para garantizar la protección de tus datos.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 border border-black/10 dark:border-white/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary mb-3">credit_card</span>
                    <p className="font-bold text-black dark:text-white mb-2">Cuotas</p>
                    <p className="text-sm">Hasta 3 cuotas sin interés con tarjetas bancarias.</p>
                  </div>
                  <div className="p-6 border border-black/10 dark:border-white/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary mb-3">account_balance</span>
                    <p className="font-bold text-black dark:text-white mb-2">Transferencia</p>
                    <p className="text-sm">15% de descuento directo pagando vía transferencia.</p>
                  </div>
                  <div className="p-6 border border-black/10 dark:border-white/10 rounded-lg">
                    <span className="material-symbols-outlined text-primary mb-3">wallet</span>
                    <p className="font-bold text-black dark:text-white mb-2">Billeteras</p>
                    <p className="text-sm">Mercado Pago y otras billeteras virtuales disponibles.</p>
                  </div>
                </div>
              </div>
            </details>

            {/* CAMBIOS Y DEVOLUCIONES */}
            <details className="group py-8 border-t border-b border-black dark:border-gray-800">
              <summary className="flex cursor-pointer items-center justify-between gap-6 outline-none list-none">
                <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase group-hover:pl-2 transition-all duration-300">Cambios y Devoluciones</h2>
                <div className="text-black dark:text-white transition-transform duration-300 group-open:rotate-180">
                  <span className="material-symbols-outlined text-3xl">expand_more</span>
                </div>
              </summary>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-black/70 dark:text-white/70 leading-relaxed">
                <div className="space-y-4">
                  <p className="font-bold text-black dark:text-white">POLÍTICA DE SATISFACCIÓN</p>
                  <p>Si no estás conforme con tu compra, podés solicitar el cambio o devolución dentro de los 30 días corridos desde que recibiste el producto.</p>
                  <p>El producto debe estar en las mismas condiciones en que fue recibido: sin uso, con etiquetas originales y en su caja original.</p>
                </div>
                <div className="space-y-4">
                  <p className="font-bold text-black dark:text-white">¿CÓMO INICIAR EL PROCESO?</p>
                  <p>1. Envianos un mensaje a través de nuestro botón de contacto abajo.</p>
                  <p>2. Indicá tu número de pedido y el motivo del cambio.</p>
                  <p>3. Te enviaremos una etiqueta de correo para que puedas despachar el producto sin costo (primer cambio gratis).</p>
                </div>
              </div>
            </details>
          </div>

          {/* Action Panel */}
          <div className="mt-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl border border-black/10 dark:border-white/10 bg-background-light dark:bg-white/5 p-8 shadow-sm">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <p className="text-2xl font-extrabold tracking-tight">¿Todavía tenés dudas?</p>
              </div>
              <button 
                onClick={handleWhatsAppClick}
                className="group flex min-w-[200px] items-center justify-center gap-3 overflow-hidden rounded-full h-14 px-8 bg-[#25D366] text-white text-base font-bold transition-transform hover:scale-105 active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>Contactanos</span>
              </button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 md:px-20 lg:px-40 py-10 flex flex-col md:flex-row justify-between items-center text-xs text-black/40 dark:text-white/30 uppercase tracking-widest gap-4">
          <p>© 2024 Cerro Sneakers. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a className="hover:text-primary transition-colors" href="https://www.instagram.com/cerrosneakers23/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a className="hover:text-primary transition-colors" href="#">Términos</a>
            <a className="hover:text-primary transition-colors" href="#">Privacidad</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HelpCenterPage;
