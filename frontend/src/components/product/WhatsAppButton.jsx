import { openWhatsApp } from '../../utils/whatsappHelpers';

function WhatsAppButton({ product, disabled = false }) {
  const handleClick = () => {
    if (!disabled) {
      openWhatsApp(product);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full bg-black text-white py-4 px-6 text-sm uppercase tracking-widest font-bold 
        flex items-center justify-center gap-2 transition-all
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-gray-800 dark:hover:bg-gray-700'}
      `}
    >
      <span className="material-symbols-outlined text-lg">chat</span>
      {disabled ? 'Producto Agotado' : 'Comprar por WhatsApp'}
    </button>
  );
}

export default WhatsAppButton;
