import React, { useState } from 'react';
import { 
  FlaskConical, Pill, Image as ImageIcon, Syringe, FileText, 
  AlertTriangle, Calendar, Building2, User, ChevronRight, 
  Sparkles, Eye, Trash2, Filter, AlertCircle, ShieldAlert,
  FolderHeart, Activity, UploadCloud, Share2
} from 'lucide-react';
import { TRANSLATIONS } from '../services/i18n';

export default function TimelineView({
  records,
  patientProfile,
  searchTerm,
  currentLang,
  elderMode,
  onSelectRecord,
  onOpenDicoms,
  onDeleteRecord,
  onOpenNewRecord,
  onOpenEmergency,
  onOpenSync,
  onOpenShare
}) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [onlyWarnings, setOnlyWarnings] = useState(false);
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const filteredRecords = records.filter((rec) => {
    if (selectedCategory !== 'all' && rec.type !== selectedCategory) {
      return false;
    }
    if (onlyWarnings && rec.urgency !== 'warning') {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const titleMatch = rec.title?.toLowerCase().includes(q);
      const facilityMatch = rec.facility?.toLowerCase().includes(q);
      const tagMatch = rec.tags?.some(t => t.toLowerCase().includes(q));
      const labMatch = rec.labMetrics?.some(m => m.name.toLowerCase().includes(q));
      const doctorMatch = (rec.orderingDoctor || rec.prescriber || rec.author || '').toLowerCase().includes(q);
      return titleMatch || facilityMatch || tagMatch || labMatch || doctorMatch;
    }

    return true;
  });

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'lab': return { class: 'badge-lab', icon: FlaskConical, label: t.labs };
      case 'prescription': return { class: 'badge-prescription', icon: Pill, label: t.prescriptions };
      case 'scan': return { class: 'badge-scan', icon: ImageIcon, label: t.scans };
      case 'immunization': return { class: 'badge-immunization', icon: Syringe, label: t.vaccines };
      default: return { class: 'badge-note', icon: FileText, label: t.notes };
    }
  };

  return (
    <div style={{ ...styles.container, fontSize: elderMode ? '1.1rem' : '0.9rem' }}>
      {/* 4 Big Primary Hero Dashboard Buttons */}
      <div style={styles.heroGrid} className="hero-grid">
        <button
          onClick={() => setSelectedCategory('all')}
          style={styles.heroCardPrimary}
          className="hero-card"
        >
          <FolderHeart size={elderMode ? 32 : 26} color="#ffffff" />
          <span style={styles.heroText}>{t.myRecords} ({records.length})</span>
        </button>

        <button
          onClick={onOpenEmergency}
          style={styles.heroCardDanger}
          className="hero-card"
        >
          <Activity size={elderMode ? 32 : 26} color="#ffffff" />
          <span style={styles.heroText}>{t.emergencyCard}</span>
        </button>

        <button
          onClick={onOpenSync}
          style={styles.heroCardCyan}
          className="hero-card"
        >
          <UploadCloud size={elderMode ? 32 : 26} color="#ffffff" />
          <span style={styles.heroText}>{t.uploadScan}</span>
        </button>

        <button
          onClick={onOpenShare}
          style={styles.heroCardIndigo}
          className="hero-card"
        >
          <Share2 size={elderMode ? 32 : 26} color="#ffffff" />
          <span style={styles.heroText}>{t.sharePass}</span>
        </button>
      </div>

      {/* Patient Profile Summary Banner */}
      <div style={styles.patientBanner} className="glass-panel patient-banner">
        <div style={styles.patientBannerLeft}>
          <div style={styles.avatarCircle}>
            {patientProfile.name.charAt(0)}
          </div>
          <div>
            <div style={styles.patientNameRow}>
              <h2 style={{ fontSize: elderMode ? '1.4rem' : '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                {patientProfile.name}
              </h2>
              <span style={styles.bloodTypeBadge}>{patientProfile.bloodType}</span>
              {patientProfile.organDonor && (
                <span style={styles.donorBadge}>❤️ {t.organDonor}</span>
              )}
            </div>
            <p style={{ fontSize: elderMode ? '0.95rem' : '0.8rem', color: 'var(--text-secondary)' }}>
              Age {patientProfile.age} • DOB {patientProfile.dob} • {patientProfile.height}
            </p>
          </div>
        </div>

        <div style={styles.allergySection}>
          <div style={styles.allergyHeader}>
            <ShieldAlert size={15} color="var(--accent-crimson)" />
            <span>{t.allergies}:</span>
          </div>
          <div style={styles.allergyBadges}>
            {patientProfile.allergies?.map((all, i) => (
              <span key={i} style={styles.allergyBadge}>
                ⚠️ {all.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div style={styles.filterToolbar}>
        <div style={styles.categoryPills} className="category-scroll-container">
          <button
            style={selectedCategory === 'all' ? styles.pillActive : styles.pill}
            onClick={() => setSelectedCategory('all')}
          >
            {t.allRecords} ({records.length})
          </button>
          <button
            style={selectedCategory === 'lab' ? styles.pillActive : styles.pill}
            onClick={() => setSelectedCategory('lab')}
          >
            <FlaskConical size={14} /> {t.labs}
          </button>
          <button
            style={selectedCategory === 'prescription' ? styles.pillActive : styles.pill}
            onClick={() => setSelectedCategory('prescription')}
          >
            <Pill size={14} /> {t.prescriptions}
          </button>
          <button
            style={selectedCategory === 'scan' ? styles.pillActive : styles.pill}
            onClick={() => setSelectedCategory('scan')}
          >
            <ImageIcon size={14} /> {t.scans}
          </button>
          <button
            style={selectedCategory === 'immunization' ? styles.pillActive : styles.pill}
            onClick={() => setSelectedCategory('immunization')}
          >
            <Syringe size={14} /> {t.vaccines}
          </button>
        </div>

        <label style={styles.warningToggleLabel}>
          <input
            type="checkbox"
            checked={onlyWarnings}
            onChange={(e) => setOnlyWarnings(e.target.checked)}
            style={{ accentColor: 'var(--accent-amber)' }}
          />
          <AlertTriangle size={15} color={onlyWarnings ? 'var(--accent-amber)' : 'var(--text-muted)'} />
          <span style={{ fontSize: elderMode ? '0.95rem' : '0.85rem', color: onlyWarnings ? 'var(--accent-amber)' : 'var(--text-secondary)' }}>
            Requires Attention Only
          </span>
        </label>
      </div>

      {/* Timeline List */}
      {filteredRecords.length === 0 ? (
        <div style={styles.emptyState} className="glass-panel">
          <Filter size={36} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-primary)' }}>No medical records match your criteria</h3>
          <button
            onClick={onOpenNewRecord}
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
          >
            + Add Health Record
          </button>
        </div>
      ) : (
        <div style={styles.timelineList}>
          {filteredRecords.map((rec) => {
            const badgeInfo = getBadgeStyle(rec.type);
            const IconComp = badgeInfo.icon;

            return (
              <div key={rec.id} style={styles.recordCard} className="glass-panel">
                <div style={styles.cardHeader}>
                  <div style={styles.cardHeaderLeft}>
                    <span className={`badge ${badgeInfo.class}`}>
                      <IconComp size={12} /> {badgeInfo.label}
                    </span>
                    {rec.urgency === 'warning' && (
                      <span style={styles.warningTag}>
                        <AlertCircle size={12} /> Needs Attention
                      </span>
                    )}
                  </div>
                  <div style={styles.cardDate}>
                    <Calendar size={13} color="var(--text-muted)" />
                    <span>{rec.date}</span>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  <h3 style={{ fontSize: elderMode ? '1.25rem' : '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {rec.title}
                  </h3>
                  <div style={styles.facilityRow}>
                    <Building2 size={14} color="var(--text-muted)" />
                    <span>{rec.facility}</span>
                    {(rec.orderingDoctor || rec.prescriber || rec.author) && (
                      <>
                        <span style={{ margin: '0 4px', color: 'var(--text-muted)' }}>•</span>
                        <User size={14} color="var(--text-muted)" />
                        <span>{rec.orderingDoctor || rec.prescriber || rec.author}</span>
                      </>
                    )}
                  </div>

                  <p style={{ fontSize: elderMode ? '1.05rem' : '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {rec.summary || rec.aiTranslation}
                  </p>
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.tagsGroup}>
                    {rec.tags?.map((t, idx) => (
                      <span key={idx} style={styles.tag}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      onClick={() => onSelectRecord(rec)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: elderMode ? '10px 16px' : '6px 12px' }}
                    >
                      <Sparkles size={14} color="var(--accent-emerald)" />
                      <span>Details</span>
                      <ChevronRight size={14} />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      style={styles.deleteBtn}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '8px'
  },
  heroCardPrimary: {
    padding: '16px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s ease'
  },
  heroCardDanger: {
    padding: '16px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
    transition: 'all 0.2s ease'
  },
  heroCardCyan: {
    padding: '16px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
    transition: 'all 0.2s ease'
  },
  heroCardIndigo: {
    padding: '16px',
    borderRadius: '14px',
    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    border: 'none',
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.3)',
    transition: 'all 0.2s ease'
  },
  heroText: {
    fontSize: '0.95rem',
    fontWeight: '800',
    letterSpacing: '-0.2px'
  },
  patientBanner: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '14px',
    background: 'var(--bg-card)'
  },
  patientBannerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  avatarCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  patientNameRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexWrap: 'wrap'
  },
  bloodTypeBadge: {
    padding: '2px 8px',
    borderRadius: '99px',
    background: 'rgba(239, 68, 68, 0.15)',
    color: 'var(--accent-crimson)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    fontSize: '0.75rem',
    fontWeight: '700'
  },
  donorBadge: {
    padding: '2px 8px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--accent-emerald)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    fontSize: '0.72rem',
    fontWeight: '600'
  },
  allergySection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '4px'
  },
  allergyHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: 600
  },
  allergyBadges: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap'
  },
  allergyBadge: {
    padding: '3px 8px',
    borderRadius: '6px',
    background: 'rgba(239, 68, 68, 0.12)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.25)',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  filterToolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    flexWrap: 'wrap'
  },
  categoryPills: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    overflowX: 'auto',
    paddingBottom: '2px'
  },
  pill: {
    padding: '7px 12px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.8rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  },
  pillActive: {
    padding: '7px 12px',
    borderRadius: '99px',
    background: 'var(--accent-emerald)',
    border: '1px solid var(--accent-emerald)',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  },
  warningToggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  emptyState: {
    padding: '36px 20px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  recordCard: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  warningTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 7px',
    borderRadius: '99px',
    background: 'rgba(245, 158, 11, 0.15)',
    color: 'var(--accent-amber)',
    fontSize: '0.7rem',
    fontWeight: '700'
  },
  cardDate: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.78rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  facilityRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    paddingTop: '8px',
    borderTop: '1px solid var(--border-color)'
  },
  tagsGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  tag: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)'
  },
  cardActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  deleteBtn: {
    padding: '5px 8px',
    borderRadius: 'var(--radius-md)',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  }
};
