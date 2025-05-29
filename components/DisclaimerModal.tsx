
import React from 'react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
      <div className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg w-full border border-sky-700">
        <h2 className="text-2xl sm:text-3xl font-bold text-sky-400 mb-4">Welcome to Lemon Symp AI</h2>
        <p className="text-slate-300 mb-3 text-sm sm:text-base">
          This application provides AI-generated information for educational purposes only.
          It is <strong>not a substitute for professional medical advice, diagnosis, or treatment.</strong>
        </p>
        <p className="text-slate-300 mb-6 text-sm sm:text-base">
          Always seek the advice of your physician or other qualified health provider with any questions
          you may have regarding a medical condition. Never disregard professional medical advice or
          delay in seeking it because of something you have read or seen on this application.
        </p>
        <button
          onClick={onAccept}
          className="w-full px-6 py-3 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition-colors focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50"
        >
          I Understand and Accept
        </button>
         <p className="text-xs text-slate-500 mt-4 text-center">
          By clicking "I Understand and Accept", you acknowledge that you have read and understood this disclaimer.
        </p>
      </div>
    </div>
  );
};