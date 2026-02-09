import { useState, useCallback } from 'react';

let toastId = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++toastId;
    const toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  return { toasts, showToast, removeToast };
}

function Toast({ toast, onClose }) {
  const typeStyles = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    warning: 'bg-yellow-600 text-white',
  };

  const icons = {
    success: 'done',
    error: 'error',
    info: 'info',
    warning: 'warning',
  };

  return (
    <div
      className={`flex items-center gap-3 px-6 py-4 shadow-lg ${
        typeStyles[toast.type]
      } animate-slideIn min-w-[300px] max-w-md`}
    >
      <span className="material-symbols-outlined text-2xl">
        {icons[toast.type]}
      </span>
      <p className="flex-1 font-medium">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="hover:opacity-75 transition-opacity"
      >
        <span className="material-symbols-outlined text-xl">close</span>
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <div className="fixed top-0 right-0 z-50 p-6 space-y-4 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={onClose} />
        ))}
      </div>
    </div>
  );
}
