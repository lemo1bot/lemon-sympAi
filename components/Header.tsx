
import React from 'react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const commonButtonClass = "px-4 py-3 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 rounded-md";
  const activeButtonClass = "bg-sky-500 text-white shadow-lg";
  const inactiveButtonClass = "bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white";

  return (
    <header className="bg-slate-800 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-sky-400 mr-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.015h-.008v-.015Zm0-9.915h.008v.015h-.008V12Zm0-3.75h.008v.015h-.008V8.25Z" />
            </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-sky-400 tracking-tight">Lemon Symp <span className="text-sky-600">AI</span></h1>
          </div>
          <nav className="flex space-x-2 sm:space-x-3">
            <button
              onClick={() => setActiveTab(ActiveTab.DescribeSymptom)}
              className={`${commonButtonClass} ${activeTab === ActiveTab.DescribeSymptom ? activeButtonClass : inactiveButtonClass}`}
            >
              Describe Symptoms
            </button>
            <button
              onClick={() => setActiveTab(ActiveTab.ScanSymptom)}
              className={`${commonButtonClass} ${activeTab === ActiveTab.ScanSymptom ? activeButtonClass : inactiveButtonClass}`}
            >
              Scan with Camera
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};