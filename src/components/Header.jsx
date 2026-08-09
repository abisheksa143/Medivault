import React from 'react';
import { 
  ShieldCheck, Search, Activity, RefreshCw, LineChart, 
  Share2, Lock, Sun, Moon, PlusCircle, HardDriveDownload, Bell, Users, Globe, Eye, Stethoscope, Edit3 
} from 'lucide-react';
import { TRANSLATIONS, LANGUAGES_LIST } from '../services/i18n';

export default function Header({
  searchTerm,
  setSearchTerm,
  activeProfile,
  familyProfiles,
  onSwitchProfile,
  onOpenManageFamily,
  currentLang,
  onChangeLang,
  elderMode,
  toggleElderMode,
  onOpenEmergency,
  onOpenSync,
  onOpenVitals,
  onOpenShare,
  onOpenNotifications,
  onOpenDiseaseCare,
  onOpenNewRecord,
  onLock,
  onExport,
  theme,
  toggleTheme
}) {
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    if (val && val !== currentLang) {
      onChangeLang(val);
    }
  };

  const handleProfileSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'MANAGE') {
      onOpenManageFamily();
    } else {
      const selected = familyProfiles.find(p => p.id === val);
      if (selected) onSwitchProfile(selected);
    }
  };

  return (
    <header style={styles.header} className="glass-panel app-header">
      <div style={styles.leftGroup} className="header-left">
        <div style={styles.logoGroup}>
          <div style={styles.logoBadge}>
            <ShieldCheck size={24} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={styles.logoText}>
              {t.appTitle}
            </div>
            <div style={styles.offlineStatus}>
              <span className="pulse-green" />
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                {t.encryptedOffline}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Switcher & Edit Family Option */}
        <div style={styles.profileSelectWrapper}>
          <Users size={14} color="var(--accent-cyan)" />
          <select
            value={activeProfile.id}
            onChange={handleProfileSelectChange}
            style={styles.profileSelect}
            title="Switch Profile or Edit Family Names"
          >
            {familyProfiles.map((p) => (
              <option key={p.id} value={p.id} style={{ background: '#0f172a', color: '#f8fafc' }}>
                👤 {p.name} ({p.role === 'self' ? 'Self' : p.role === 'parent' ? 'Mother' : 'Child'})
              </option>
            ))}
            <option value="MANAGE" style={{ background: '#0f172a', color: '#10b981', fontWeight: 'bold' }}>
              ⚙️ Manage & Edit Family Names...
            </option>
          </select>

          <button
            onClick={onOpenManageFamily}
            style={styles.editNameIconBtn}
            title="Edit Family Member Names"
          >
            <Edit3 size={13} color="var(--accent-cyan)" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.centerSearch} className="header-search">
        <div style={styles.searchWrapper}>
          <Search size={15} color="var(--text-muted)" style={styles.searchIcon} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          {searchTerm && (
            <button style={styles.clearBtn} onClick={() => setSearchTerm('')}>
              ×
            </button>
          )}
        </div>
      </div>

      {/* Right Header Bar Actions */}
      <div style={styles.rightActions} className="header-actions">
        <button
          onClick={onOpenDiseaseCare}
          className="btn btn-secondary btn-sm"
          title="Disease-Specific Care Workspaces"
        >
          <Stethoscope size={15} color="var(--accent-cyan)" />
          <span>{t.diseaseCare}</span>
        </button>

        <button
          onClick={toggleElderMode}
          className={elderMode ? "btn btn-cyan btn-sm" : "btn btn-secondary btn-sm"}
          title="Toggle Large Fonts & High Contrast for Elderly Users"
        >
          <Eye size={15} />
          <span>{elderMode ? "Elder Mode ON" : t.elderMode}</span>
        </button>

        <button
          onClick={onOpenNotifications}
          className="btn btn-secondary btn-sm"
          style={{ position: 'relative' }}
        >
          <Bell size={15} color="var(--accent-amber)" />
          <span style={styles.notifBadge}>3</span>
        </button>

        {/* Immediate Language Selector */}
        <div style={styles.langSelectWrapper}>
          <Globe size={14} color="var(--accent-emerald)" />
          <select
            value={currentLang}
            onChange={handleLanguageChange}
            onInput={handleLanguageChange}
            style={styles.langSelect}
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code} style={{ background: '#0f172a', color: '#f8fafc' }}>
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={toggleTheme}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px' }}
        >
          {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#6366f1" />}
        </button>

        <button
          onClick={onLock}
          className="btn btn-secondary btn-sm"
          style={{ padding: '8px' }}
        >
          <Lock size={15} color="var(--accent-crimson)" />
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    padding: '12px 20px',
    borderRadius: '0 0 16px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    sticky: 'top',
    top: 0,
    zIndex: 100,
    marginBottom: '20px',
    background: 'var(--bg-card)',
    borderBottom: '1px solid var(--border-color)'
  },
  leftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logoBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    fontSize: '1.2rem',
    fontWeight: '800',
    letterSpacing: '-0.3px',
    color: 'var(--text-primary)'
  },
  offlineStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '2px'
  },
  profileSelectWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px',
    borderRadius: '8px',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)'
  },
  profileSelect: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer'
  },
  editNameIconBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center'
  },
  centerSearch: {
    flex: 1,
    maxWidth: '240px'
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '8px 32px 8px 34px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'var(--font-sans)'
  },
  clearBtn: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.1rem',
    cursor: 'pointer'
  },
  rightActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  notifBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'var(--accent-amber)',
    color: '#000',
    fontSize: '0.65rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  langSelectWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)'
  },
  langSelect: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer'
  }
};
