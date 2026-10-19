import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-700 border-red-600',
    info: 'bg-blue-600 border-blue-500',
  };

  const icons = { success: '✓', error: '✕', info: 'ℹ' };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg border shadow-2xl text-white font-medium text-sm max-w-sm animate-slide-in ${colors[type]}`}
    >
      <span className="text-lg">{icons[type]}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
};

export default Toast;
