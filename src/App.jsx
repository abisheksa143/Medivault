import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TimelineView from './components/TimelineView';
import LockScreen from './components/LockScreen';
import RecordDetailModal from './components/RecordDetailModal';
import DicomsViewerModal from './components/DicomsViewerModal';
import EmergencyPassModal from './components/EmergencyPassModal';
import VitalsAnalyticsView from './components/VitalsAnalyticsView';
import ProviderSyncModal from './components/ProviderSyncModal';
import ShareAccessModal from './components/ShareAccessModal';
import NotificationsModal from './components/NotificationsModal';
import NewRecordModal from './components/NewRecordModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import CameraScannerModal from './components/CameraScannerModal';
import AiHealthSummaryCard from './components/AiHealthSummaryCard';
import DiseaseCareCenterModal from './components/DiseaseCareCenterModal';
import ManageFamilyModal from './components/ManageFamilyModal';
import BottomMobileNav from './components/BottomMobileNav';
import DoctorConsultationModal from './components/DoctorConsultationModal';
import { StorageService } from './services/storageService';

export default function App() {
  // App Security Lock State
  const [isLocked, setIsLocked] = useState(true);
  const [pinCode, setPinCode] = useState("1234");

  // Health Data State
  const [patientProfile, setPatientProfile] = useState({});
  const [familyProfiles, setFamilyProfiles] = useState([]);
  const [records, setRecords] = useState([]);
  const [vitalsHistory, setVitalsHistory] = useState([]);
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Language & Family Profile State
  const [currentLang, setCurrentLang] = useState('en');
  const [elderMode, setElderMode] = useState(false);

  // Modals & Drawers State
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dicomRecord, setDicomRecord] = useState(null);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showDiseaseCareModal, setShowDiseaseCareModal] = useState(false);
  const [showManageFamilyModal, setShowManageFamilyModal] = useState(false);
  const [showNewRecordModal, setShowNewRecordModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [consultRecord, setConsultRecord] = useState(null);

  // Theme State
  const [theme, setTheme] = useState('dark');

  // Initial load from offline local vault
  useEffect(() => {
    const prof = StorageService.getProfile();
    const fam = StorageService.getFamilyProfiles();
    const recs = StorageService.getRecords();
    const vitals = StorageService.getVitals();
    const provs = StorageService.getProviders();
    const pin = StorageService.getPinCode();
    const savedTheme = StorageService.getTheme();
    const savedLang = StorageService.getLanguage();

    setPatientProfile(prof);
    setFamilyProfiles(fam);
    setRecords(recs);
    setVitalsHistory(vitals);
    setProviders(provs);
    setPinCode(pin);
    setTheme(savedTheme);
    setCurrentLang(savedLang);

    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    StorageService.setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const handleSwitchProfile = (newProfile) => {
    setPatientProfile(newProfile);
    StorageService.saveProfile(newProfile);
  };

  const handleUpdateFamilyProfiles = (updatedProfiles) => {
    setFamilyProfiles(updatedProfiles);
    StorageService.saveFamilyProfiles(updatedProfiles);
  };

  const handleChangeLang = (newLang) => {
    setCurrentLang(newLang);
    StorageService.setLanguage(newLang);
  };

  // Record Actions
  const handleAddRecord = (newRec) => {
    const updated = StorageService.addRecord(newRec);
    setRecords(updated);
  };

  const handleDeleteRecord = (recordId) => {
    if (confirm("Are you sure you want to delete this record from your offline vault?")) {
      const updated = StorageService.deleteRecord(recordId);
      setRecords(updated);
    }
  };

  const handleAddVital = (newVital) => {
    const updated = StorageService.addVitalPoint(newVital);
    setVitalsHistory(updated);
  };

  const handleToggleSync = (providerId) => {
    const updated = StorageService.toggleProviderSync(providerId);
    setProviders(updated);
  };

  const handleExportBackup = () => {
    StorageService.exportVaultJSON();
  };

  const handleExecuteVoiceCommand = (command) => {
    if (command.action === 'filter_labs') {
      setSearchTerm('Lab');
    } else if (command.action === 'open_new_record') {
      setShowNewRecordModal(true);
    } else if (command.action === 'open_emergency') {
      setShowEmergencyModal(true);
    } else if (command.action === 'open_vitals') {
      setShowVitalsModal(true);
    }
  };

  return (
    <>
      {/* PIN Security Lock Screen */}
      {isLocked ? (
        <LockScreen
          correctPin={pinCode}
          onUnlock={() => setIsLocked(false)}
          onOpenEmergencyPass={() => setShowEmergencyModal(true)}
          currentLang={currentLang}
          onChangeLang={handleChangeLang}
        />
      ) : (
        <div style={styles.appWrapper} className="app-wrapper">
          {/* Main Top Header */}
          <Header
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeProfile={patientProfile}
            familyProfiles={familyProfiles}
            onSwitchProfile={handleSwitchProfile}
            onOpenManageFamily={() => setShowManageFamilyModal(true)}
            currentLang={currentLang}
            onChangeLang={handleChangeLang}
            elderMode={elderMode}
            toggleElderMode={() => setElderMode(!elderMode)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
            onOpenSync={() => setShowSyncModal(true)}
            onOpenVitals={() => setShowVitalsModal(true)}
            onOpenShare={() => setShowShareModal(true)}
            onOpenNotifications={() => setShowNotificationsModal(true)}
            onOpenDiseaseCare={() => setShowDiseaseCareModal(true)}
            onOpenNewRecord={() => setShowNewRecordModal(true)}
            onLock={() => setIsLocked(true)}
            onExport={handleExportBackup}
            theme={theme}
            toggleTheme={toggleTheme}
          />

          {/* Core App Main Area */}
          <main style={styles.mainContainer}>
            {/* Progressive Disclosure Health Summary */}
            <AiHealthSummaryCard
              records={records}
              patientProfile={patientProfile}
              elderMode={elderMode}
              currentLang={currentLang}
              toggleElderMode={() => setElderMode(!elderMode)}
              onOpenVoiceAssistant={() => setShowVoiceModal(true)}
              onOpenCameraScanner={() => setShowCameraModal(true)}
            />

            {/* 4 Big Primary Hero Buttons & Timeline Feed */}
            <TimelineView
              records={records}
              patientProfile={patientProfile}
              searchTerm={searchTerm}
              currentLang={currentLang}
              elderMode={elderMode}
              onSelectRecord={(rec) => setSelectedRecord(rec)}
              onOpenDicoms={(rec) => setDicomRecord(rec)}
              onDeleteRecord={handleDeleteRecord}
              onOpenNewRecord={() => setShowNewRecordModal(true)}
              onOpenEmergency={() => setShowEmergencyModal(true)}
              onOpenSync={() => setShowSyncModal(true)}
              onOpenShare={() => setShowShareModal(true)}
            />
          </main>

          {/* Mobile Bottom Navigation Bar (Visible on mobile screens < 768px) */}
          <BottomMobileNav
            currentLang={currentLang}
            onOpenTimeline={() => setSearchTerm('')}
            onOpenNewRecord={() => setShowNewRecordModal(true)}
            onOpenVitals={() => setShowVitalsModal(true)}
            onOpenEmergency={() => setShowEmergencyModal(true)}
            onOpenDiseaseCare={() => setShowDiseaseCareModal(true)}
          />
        </div>
      )}

      {/* Modals & Overlays */}
      {selectedRecord && (
        <RecordDetailModal
          record={selectedRecord}
          currentLang={currentLang}
          onClose={() => setSelectedRecord(null)}
          onOpenDicoms={(rec) => setDicomRecord(rec)}
          onOpenDoctorConsultation={(rec) => setConsultRecord(rec)}
        />
      )}

      {consultRecord && (
        <DoctorConsultationModal
          record={consultRecord}
          patientProfile={patientProfile}
          onClose={() => setConsultRecord(null)}
        />
      )}

      {dicomRecord && (
        <DicomsViewerModal
          record={dicomRecord}
          onClose={() => setDicomRecord(null)}
        />
      )}

      {showEmergencyModal && (
        <EmergencyPassModal
          patientProfile={patientProfile}
          onClose={() => setShowEmergencyModal(false)}
        />
      )}

      {showVitalsModal && (
        <VitalsAnalyticsView
          vitalsHistory={vitalsHistory}
          onAddVital={handleAddVital}
          onClose={() => setShowVitalsModal(false)}
        />
      )}

      {showSyncModal && (
        <ProviderSyncModal
          providers={providers}
          onToggleSync={handleToggleSync}
          onAddRecord={handleAddRecord}
          onClose={() => setShowSyncModal(false)}
        />
      )}

      {showShareModal && (
        <ShareAccessModal
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          onClose={() => setShowNotificationsModal(false)}
        />
      )}

      {showDiseaseCareModal && (
        <DiseaseCareCenterModal
          patientProfile={patientProfile}
          onClose={() => setShowDiseaseCareModal(false)}
        />
      )}

      {showManageFamilyModal && (
        <ManageFamilyModal
          familyProfiles={familyProfiles}
          activeProfile={patientProfile}
          onUpdateProfiles={handleUpdateFamilyProfiles}
          onSelectProfile={handleSwitchProfile}
          elderMode={elderMode}
          onClose={() => setShowManageFamilyModal(false)}
        />
      )}

      {showVoiceModal && (
        <VoiceAssistantModal
          onExecuteCommand={handleExecuteVoiceCommand}
          onClose={() => setShowVoiceModal(false)}
        />
      )}

      {showCameraModal && (
        <CameraScannerModal
          onAddRecord={handleAddRecord}
          onClose={() => setShowCameraModal(false)}
        />
      )}

      {showNewRecordModal && (
        <NewRecordModal
          onAddRecord={handleAddRecord}
          onClose={() => setShowNewRecordModal(false)}
        />
      )}
    </>
  );
}

const styles = {
  appWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 16px 40px 16px'
  },
  mainContainer: {
    flex: 1
  }
};
