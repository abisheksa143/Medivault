import React from 'react';
import { 
  FolderHeart, PlusCircle, Activity, ShieldAlert, Stethoscope 
} from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';

export default function BottomMobileNav({
  currentLang,
  onOpenTimeline,
  onOpenNewRecord,
  onOpenVitals,
  onOpenEmergency,
  onOpenDiseaseCare
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  return (
    <nav className="mobile-bottom-nav">
      <button 
        onClick={onOpenTimeline}
        className="mobile-nav-item"
        title={t.myRecords}
      >
        <FolderHeart size={20} color="var(--accent-emerald)" />
        <span>{t.myRecords || 'Records'}</span>
      </button>

      <button 
        onClick={onOpenNewRecord}
        className="mobile-nav-item mobile-nav-add"
        title={t.addRecord}
      >
        <div className="mobile-add-circle">
          <PlusCircle size={24} color="#ffffff" />
        </div>
        <span>{t.addRecord || 'Add'}</span>
      </button>

      <button 
        onClick={onOpenVitals}
        className="mobile-nav-item"
        title={t.vitalsAnalytics}
      >
        <Activity size={20} color="var(--accent-cyan)" />
        <span>{t.vitalsAnalytics || 'Vitals'}</span>
      </button>

      <button 
        onClick={onOpenEmergency}
        className="mobile-nav-item"
        title={t.emergencyCard}
      >
        <ShieldAlert size={20} color="var(--accent-crimson)" />
        <span>{t.emergencyCard || 'Emergency'}</span>
      </button>

      <button 
        onClick={onOpenDiseaseCare}
        className="mobile-nav-item"
        title={t.diseaseCare}
      >
        <Stethoscope size={20} color="var(--accent-indigo)" />
        <span>{t.diseaseCare || 'Care'}</span>
      </button>
    </nav>
  );
}
