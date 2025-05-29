
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  small?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message, small }) => {
  const spinnerSize = small ? "w-5 h-5" : "w-8 h-8";
  const textSize = small ? "text-sm" : "text-md";

  if (small && !message) { // For inline button usage
    return (
        <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-t-2 border-sky-200`}></div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center py-8 text-slate-300">
      <div className={`animate-spin rounded-full ${spinnerSize} border-b-2 border-t-2 border-sky-400`}></div>
      {message && <p className={`mt-3 ${textSize}`}>{message}</p>}
    </div>
  );
};
    