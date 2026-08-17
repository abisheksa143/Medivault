import React, { useState } from 'react';
import { 
  Sparkles, AlertCircle, Watch, Heart, Activity, 
  ChevronDown, ChevronUp, Eye, Mic, Camera, Bell, Pill, FlaskConical, ImageIcon 
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
      {/* Top Summary Header with Color-Coded Metrics Badges */}
      <div style={styles.progressiveHeader}>
        <div style={styles.summaryLeftGroup}>
          <div style={styles.aiBadgeIcon}>
            <Sparkles size={20} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={styles.metricsPillsRow}>
              {/* Color-Coded Metric 1: Medications */}
              <div style={styles.metricPillRx} title="Active Medications">
                <Pill size={15} color="#06b6d4" />
                <span>Medications: <strong>{rxCount}</strong></span>
              </div>

              {/* Color-Coded Metric 2: Lab Tests */}
              <div style={styles.metricPillLab} title="Lab Reports">
                <FlaskConical size={15} color="#10b981" />
                <span>Lab Tests: <strong>{labCount}</strong></span>
              </div>

              {/* Color-Coded Metric 3: Scans & X-Rays */}
              <div style={styles.metricPillScan} title="Imaging & Scans">
                <ImageIcon size={15} color="#f43f5e" />
                <span>Scans: <strong>{scanCount}</strong></span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your health history summary is up to date for 2026.
            </p>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="btn btn-secondary btn-sm"
          style={{ gap: '6px' }}
        >
          <span>{expanded ? t.hideDetails : t.viewDetails}</span>
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
  summaryLeftGroup: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  aiBadgeIcon: {
    width: '38px',
    height: '38px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px'
  },
  metricsPillsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  metricPillRx: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '99px',
    background: 'rgba(6, 182, 212, 0.12)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    fontWeight: '600'
  },
  metricPillLab: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    fontWeight: '600'
  },
  metricPillScan: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '99px',
    background: 'rgba(244, 63, 94, 0.12)',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    fontWeight: '600'
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
