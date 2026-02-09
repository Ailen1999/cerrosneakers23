import { useEffect } from 'react';

function SizeGuideModal({ isOpen, onClose }) {
  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeData = [
    { bra: '33', mer: '34', cm: '21.6' },
    { bra: '34', mer: '35', cm: '22.6' },
    { bra: '35', mer: '36', cm: '23.3' },
    { bra: '36', mer: '37', cm: '23.9' },
    { bra: '37', mer: '38', cm: '24.6' },
    { bra: '38', mer: '39', cm: '25.3' },
    { bra: '39', mer: '40', cm: '25.9' },
    { bra: '40', mer: '41', cm: '26.6' },
    { bra: '41', mer: '42', cm: '28.0' },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#1E1E1E] w-full max-w-2xl mx-4 rounded-none shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-black dark:bg-white text-white dark:text-black px-8 py-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold uppercase tracking-wider">Guía de Talles</h2>
          <button 
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 text-center">
            Tabla de conversión de talles de calzado
          </p>

          {/* Size Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-black dark:border-white">
                  <th className="text-left py-4 px-4 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    🇧🇷 BRA
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    🇦🇷 ARG/MER
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white">
                    📏 CM (Medida)
                  </th>
                </tr>
              </thead>
              <tbody>
                {sizeData.map((row, index) => (
                  <tr 
                    key={index}
                    className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <td className="py-3 px-4 text-lg font-medium text-gray-900 dark:text-white">
                      {row.bra}
                    </td>
                    <td className="py-3 px-4 text-lg font-medium text-gray-900 dark:text-white">
                      {row.mer}
                    </td>
                    <td className="py-3 px-4 text-lg font-medium text-gray-900 dark:text-white">
                      {row.cm} cm
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Note */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 border-l-4 border-black dark:border-white">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong className="text-black dark:text-white">💡 Consejo:</strong> Para obtener tu talle correcto, mide la longitud de tu pie en centímetros y utiliza la columna "CM" como referencia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeGuideModal;
