import { Link } from 'react-router-dom';

function FeatureCards() {
  return (
    <section className="container mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-auto md:h-[600px]">
        
        {/* Card 1: Mujer (Tall, Span 1 col) */}
        <div className="group relative overflow-hidden h-[400px] md:h-full lg:col-span-1">
          <img 
            src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1000&auto=format&fit=crop" 
            alt="Colección Mujer" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs uppercase tracking-widest mb-2 font-medium">Colección 2024</p>
            <h3 className="font-display text-3xl font-bold mb-4">Mujer</h3>
            <Link to="/?gender=mujer" className="inline-block border-b border-white pb-1 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity">
              Ver Todo
            </Link>
          </div>
        </div>

        {/* Card 2: Hombre (Tall, Span 1 col) */}
        <div className="group relative overflow-hidden h-[400px] md:h-full lg:col-span-1">
          <img 
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1000&auto=format&fit=crop" 
            alt="Colección Hombre" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="text-xs uppercase tracking-widest mb-2 font-medium">Nuevos Estilos</p>
            <h3 className="font-display text-3xl font-bold mb-4">Hombre</h3>
            <Link to="/?gender=hombre" className="inline-block border-b border-white pb-1 text-sm tracking-widest uppercase hover:opacity-80 transition-opacity">
              Ver Todo
            </Link>
          </div>
        </div>

        {/* Column 3: Stacked Cards */}
        <div className="flex flex-col gap-6 lg:col-span-1 h-auto md:h-full">
          
          {/* Card 3: Zapatos (Half height) */}
          <div className="group relative overflow-hidden h-[300px] md:h-1/2 bg-surface-light dark:bg-surface-dark flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000&auto=format&fit=crop" 
              alt="Calzado" 
              className="w-4/5 h-auto object-contain transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 drop-shadow-xl"
            />
            <div className="absolute bottom-6 left-6">
               <h3 className="font-display text-2xl font-bold text-black dark:text-white mb-1">Calzado</h3>
               <Link to="/?category=calzado" className="text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                 Explorar
               </Link>
            </div>
          </div>

          {/* Card 4: Accesorios/Bolsos (Half height, Colored) */}
          <div className="group relative overflow-hidden h-[300px] md:h-1/2 bg-[#536B78] flex items-center p-8">
            <div className="relative z-10">
              <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Edición Limitada</p>
              <h3 className="font-display text-3xl font-bold text-white mb-6">Bolsos &<br/>Accesorios</h3>
              <Link 
                to="/?category=indumentaria" 
                className="bg-white text-black px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors inline-block"
              >
                Comprar
              </Link>
            </div>
            {/* Abstract decorative circle */}
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default FeatureCards;
