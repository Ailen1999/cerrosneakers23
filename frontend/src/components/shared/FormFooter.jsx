function FormFooter({ onCancel, onSave, saveText = 'Guardar', cancelText = 'Cancelar', disabled = false }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1E1E1E] border-t border-gray-200 dark:border-gray-800 z-40">
      <div className="max-w-7xl mx-auto px-8 py-6 flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-8 py-3 border-2 border-gray-300 dark:border-gray-700 text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all"
          disabled={disabled}
        >
          {cancelText}
        </button>
        <button
          type="submit"
          onClick={onSave}
          className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-sm font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          disabled={disabled}
        >
          {saveText}
        </button>
      </div>
    </div>
  );
}

export default FormFooter;
