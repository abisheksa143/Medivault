import React, { useState } from 'react';
import { 
  Sparkles, AlertCircle, Watch, Heart, Activity, 
  ChevronDown, ChevronUp, Eye, Mic, Camera, Bell 
} from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';

export default function AiHealthSummaryCard({
  records,
  patientProfile,
  elderMode,
  currentLang,
  toggleElderMode,
  onOpenVoiceAssistant,
  onOpenCameraScanner
}) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const labCount = records.filter(r => r.type === 'lab').length;
  const scanCount = records.filter(r => r.type === 'scan').length;
  const rxCount = records.filter(r => r.type === 'prescription').length;

  return (
    <div style={{ ...styles.container, fontSize: elderMode ? '1.15rem' : '0.92rem' }} className="glass-panel">
      {/* Progressive Disclosure Simple 1-Sentence Summary */}
      <div style={styles.progressiveHeader}>
        <div style={styles.summaryTextGroup}>
          <Sparkles size={20} color="var(--accent-emerald)" />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
            You have {rxCount} medications, {labCount} lab tests, and {scanCount} scans this year.
          </span>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '4px' }}
        >
          <span>{expanded ? "Hide Details" : "View Details"}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Expanded Progressive Details */}
      {expanded && (
        <div style={styles.expandedContent}>
          {/* Plain English Sub-Tabs */}
          <div style={styles.tabsRow}>
            <button
              style={activeTab === 'overview' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('overview')}
            >
              <Sparkles size={14} color={activeTab === 'overview' ? '#10b981' : 'var(--text-muted)'} />
              <span>{t.healthOverview}</span>
            </button>

            <button
              style={activeTab === 'watch' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('watch')}
            >
              <Watch size={14} color={activeTab === 'watch' ? '#06b6d4' : 'var(--text-muted)'} />
              <span>{t.liveWatchData}</span>
            </button>

            <button
              style={activeTab === 'alerts' ? styles.tabActive : styles.tab}
              onClick={() => setActiveTab('alerts')}
            >
              <Bell size={14} color={activeTab === 'alerts' ? '#f59e0b' : 'var(--text-muted)'} />
              <span>{t.healthReminder}</span>
            </button>
          </div>

          {/* Details Body */}
          {activeTab === 'overview' && (
            <div style={styles.tabBody}>
              <p style={{ lineHeight: '1.6', color: 'var(--text-primary)' }}>
                📊 <strong>{t.healthOverview}:</strong> Kidney function and blood sugar levels are healthy. Total cholesterol is slightly elevated at 215 mg/dL.
              </p>
            </div>
          )}

          {activeTab === 'watch' && (
            <div style={styles.tabBody}>
              <div style={styles.wearableRow}>
                <span>❤️ Heart Rate: <strong style={{ fontFamily: 'var(--font-mono)' }}>68 bpm</strong> (Normal)</span>
                <span style={{ margin: '0 8px' }}>•</span>
                <span>🩸 Blood Sugar: <strong style={{ fontFamily: 'var(--font-mono)' }}>98 mg/dL</strong> (Fasting)</span>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div style={styles.tabBody}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)' }}>
                <AlertCircle size={16} />
                <strong>{t.healthReminder}:</strong> Annual cholesterol checkup with {patientProfile.primaryPhysician} is recommended.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '16px 20px',
    marginBottom: '20px',
    background: 'var(--bg-card)',
    borderRadius: '16px',
    border: '1px solid var(--border-color)'
  },
  progressiveHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '12px'
  },
  summaryTextGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  expandedContent: {
    marginTop: '14px',
    paddingTop: '12px',
    borderTop: '1px solid var(--border-color)'
  },
  tabsRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '10px'
  },
  tab: {
    padding: '6px 12px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  tabActive: {
    padding: '6px 12px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid var(--text-primary)',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  tabBody: {
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)'
  },
  wearableRow: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.88rem'
  }
};
