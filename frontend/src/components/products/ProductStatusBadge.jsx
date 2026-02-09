function ProductStatusBadge({ status }) {
  const statusConfig = {
    'in-stock': {
      text: 'En Stock',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text_color: 'text-green-700 dark:text-green-400',
      border: 'border-green-100 dark:border-green-900/30',
      dot: 'bg-green-500',
    },
    'out-of-stock': {
      text: 'Agotado',
      bg: 'bg-gray-50 dark:bg-gray-800',
      text_color: 'text-gray-500 dark:text-gray-400',
      border: 'border-gray-200 dark:border-gray-700',
      dot: 'bg-gray-400',
    },
    'low-stock': {
      text: 'Bajo Stock',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text_color: 'text-orange-700 dark:text-orange-400',
      border: 'border-orange-100 dark:border-orange-900/30',
      dot: 'bg-orange-500',
    },
  };

  const config = statusConfig[status] || statusConfig['in-stock'];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${config.bg} ${config.text_color} ${config.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`}></span>
      {config.text}
    </span>
  );
}

export default ProductStatusBadge;
