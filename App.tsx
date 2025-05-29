
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CameraScanner } from './components/CameraScanner';
import { SymptomDescriber } from './components/SymptomDescriber';
import { DisclaimerModal } from './components/DisclaimerModal';
import { ActiveTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.DescribeSymptom);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(false);

  useEffect(() => {
    const accepted = localStorage.getItem('disclaimerAccepted');
    if (accepted === 'true') {
      setDisclaimerAccepted(true);
    }
  }, []);

  const handleAcceptDisclaimer = () => {
    localStorage.setItem('disclaimerAccepted', 'true');
    setDisclaimerAccepted(true);
  };

  if (!disclaimerAccepted) {
    return <DisclaimerModal onAccept={handleAcceptDisclaimer} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 text-slate-100">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === ActiveTab.ScanSymptom && <CameraScanner />}
        {activeTab === ActiveTab.DescribeSymptom && <SymptomDescriber />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
    