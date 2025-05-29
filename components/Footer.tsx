
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-slate-400 py-6 shadow-inner mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs sm:text-sm">
          <strong>Disclaimer:</strong> This tool provides general information and is not a substitute for
          professional medical advice, diagnosis, or treatment. Always seek the advice of your
          physician or other qualified health provider with any questions you may have regarding a
          medical condition. Never disregard professional medical advice or delay in seeking it
          because of something you have read or seen on this application.
        </p>
        <p className="text-xs mt-2">© {new Date().getFullYear()} Lemon Symp AI. For informational purposes only.</p>
      </div>
    </footer>
  );
};