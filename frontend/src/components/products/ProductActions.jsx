function ProductActions({ onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
        title="Editar"
      >
        <span className="material-symbols-outlined notranslate text-[20px]">edit</span>
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
        title="Eliminar"
      >
        <span className="material-symbols-outlined notranslate text-[20px]">delete</span>
      </button>
    </div>
  );
}

export default ProductActions;
