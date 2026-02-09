import React from 'react';

function ErrorMessage({ message, type = 'error', onClose, autoDismiss = 0 }) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    if (autoDismiss > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  if (!isVisible) return null;

  const styles = {
    error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30',
    warning: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-900/30',
    info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/30',
  };

  const icons = {
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 border rounded-sm ${styles[type]}`}>
      <span className="material-symbols-outlined text-[20px]">{icons[type]}</span>
      <p className="flex-1 text-sm font-medium">{message}</p>
      {onClose && (
        <button onClick={onClose} className="hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
