import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import ToastNotification from './components/ToastNotification';
import EvidenceDetailModal from './components/EvidenceDetailModal';

// Pages
import Dashboard from './pages/Dashboard';
import RegisterEvidence from './pages/RegisterEvidence';
import VerifyIntegrity from './pages/VerifyIntegrity';
import CustodyHistory from './pages/CustodyHistory';
import EvidenceRepository from './pages/EvidenceRepository';
import SecurityAccess from './pages/SecurityAccess';
import BlockchainRecords from './pages/BlockchainRecords';
import AboutProject from './pages/AboutProject';

import { initializeStorageIfNeeded } from './services/evidenceService';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [preselectedEvidenceId, setPreselectedEvidenceId] = useState(null);
  const [selectedDetailEvidence, setSelectedDetailEvidence] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initialize seed demo data in localStorage if empty
  useEffect(() => {
    initializeStorageIfNeeded();
  }, []);

  const addNotification = ({ type = 'info', title = '', message = '' }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setNotifications((prev) => [{ id, type, title, message }, ...prev]);
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Navigation shortcuts with preselection
  const handleVerifyEvidence = (evidenceId) => {
    setPreselectedEvidenceId(evidenceId);
    setActivePage('verify');
  };

  const handleTransferEvidence = (evidenceId) => {
    setPreselectedEvidenceId(evidenceId);
    setActivePage('custody');
  };

  const handleViewDetails = (evidence) => {
    setSelectedDetailEvidence(evidence);
  };

  const handleResetData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container" key={refreshTrigger}>
      {/* Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Topbar
          activePage={activePage}
          setIsMobileOpen={setIsMobileOpen}
          onResetData={handleResetData}
          onNotify={addNotification}
        />

        <main className="content-area">
          {activePage === 'dashboard' && (
            <Dashboard
              onNavigate={setActivePage}
              onViewDetails={handleViewDetails}
              onVerifyEvidence={handleVerifyEvidence}
              onTransferEvidence={handleTransferEvidence}
              onNotify={addNotification}
            />
          )}

          {activePage === 'register' && (
            <RegisterEvidence
              onNavigate={setActivePage}
              onViewDetails={handleViewDetails}
              onNotify={addNotification}
            />
          )}

          {activePage === 'verify' && (
            <VerifyIntegrity
              preselectedId={preselectedEvidenceId}
              onNotify={addNotification}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'custody' && (
            <CustodyHistory
              preselectedId={preselectedEvidenceId}
              onNotify={addNotification}
            />
          )}

          {activePage === 'repository' && (
            <EvidenceRepository
              onViewDetails={handleViewDetails}
              onVerify={handleVerifyEvidence}
              onTransfer={handleTransferEvidence}
              onNavigate={setActivePage}
              onNotify={addNotification}
            />
          )}

          {activePage === 'security' && <SecurityAccess />}

          {activePage === 'blockchain' && (
            <BlockchainRecords onNotify={addNotification} />
          )}

          {activePage === 'about' && <AboutProject />}
        </main>
      </div>

      {/* Detail Modal */}
      {selectedDetailEvidence && (
        <EvidenceDetailModal
          evidence={selectedDetailEvidence}
          onClose={() => setSelectedDetailEvidence(null)}
          onNavigateToVerify={handleVerifyEvidence}
          onNavigateToTransfer={handleTransferEvidence}
          onNotify={addNotification}
        />
      )}

      {/* Toast Notification Container */}
      <ToastNotification
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}
