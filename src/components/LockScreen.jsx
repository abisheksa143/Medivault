import React, { useState } from 'react';
import { ShieldCheck, Lock, KeyRound, AlertCircle, Fingerprint, Activity, Globe } from 'lucide-react';
import { LANGUAGES_LIST, TRANSLATIONS } from '../services/i18n';

export default function LockScreen({ onUnlock, onOpenEmergencyPass, correctPin, currentLang, onChangeLang }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleLanguageChange = (e) => {
    const val = e.target.value;
    if (val && val !== currentLang) {
      onChangeLang(val);
    }
  };

  const handleKeyPress = (num) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      if (newPin.length === 4) {
        if (newPin === correctPin) {
          onUnlock();
        } else {
          setError(true);
          setTimeout(() => {
            setPin('');
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card} className="glass-panel">
        {/* Top Language Picker at Login */}
        <div style={styles.loginLangRow}>
          <Globe size={14} color="var(--accent-emerald)" />
          <select
            value={currentLang}
            onChange={handleLanguageChange}
            onInput={handleLanguageChange}
            style={styles.loginLangSelect}
          >
            {LANGUAGES_LIST.map((lang) => (
              <option key={lang.code} value={lang.code} style={{ background: '#0f172a', color: '#f8fafc' }}>
                {lang.native} ({lang.name})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <ShieldCheck size={36} color="var(--accent-emerald)" />
          </div>
          <h1 style={styles.title}>{t.appTitle}</h1>
          <p style={styles.subtitle}>{t.subtitle}</p>
        </div>

        <div style={styles.statusBadge}>
          <Lock size={14} color="var(--accent-cyan)" />
          <span>{t.encryptedOffline}</span>
        </div>

        {/* PIN Dots */}
        <div style={{ ...styles.dotsContainer, animation: error ? 'shake 0.4s ease' : 'none' }}>
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              style={{
                ...styles.dot,
                background: index < pin.length ? (error ? 'var(--accent-crimson)' : 'var(--accent-emerald)') : 'rgba(255,255,255,0.1)',
                borderColor: index < pin.length ? (error ? 'var(--accent-crimson)' : 'var(--accent-emerald)') : 'rgba(255,255,255,0.2)',
                boxShadow: index < pin.length && !error ? '0 0 10px var(--accent-emerald)' : 'none'
              }}
            />
          ))}
        </div>

        {error && (
          <div style={styles.errorText}>
            <AlertCircle size={14} /> Incorrect PIN Code (Demo PIN: <strong>{correctPin}</strong>)
          </div>
        )}

        {/* Keypad */}
        <div style={styles.keypad}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              style={styles.keyBtn}
              onClick={() => handleKeyPress(num.toString())}
            >
              {num}
            </button>
          ))}
          <button style={styles.keyBtnAux} onClick={() => onUnlock()}>
            <Fingerprint size={22} color="var(--accent-cyan)" />
          </button>
          <button style={styles.keyBtn} onClick={() => handleKeyPress('0')}>
            0
          </button>
          <button style={styles.keyBtnAux} onClick={handleDelete}>
            ⌫
          </button>
        </div>

        <div style={styles.footerDivider} />

        <div style={styles.emergencyContainer}>
          <button
            style={styles.emergencyBtn}
            onClick={onOpenEmergencyPass}
            className="btn btn-danger"
          >
            <Activity size={18} />
            <span>{t.paramedicMode}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'radial-gradient(circle at 50% 30%, #131c31 0%, #0b0f19 100%)',
    padding: '20px'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '28px 28px 36px 28px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    position: 'relative'
  },
  loginLangRow: {
    alignSelf: 'flex-end',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px',
    padding: '4px 10px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)'
  },
  loginLangSelect: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.8rem',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer'
  },
  header: {
    marginBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  iconCircle: {
    width: '64px',
    height: '64px',
    borderRadius: '20px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: 'var(--text-primary)'
  },
  subtitle: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '4px'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '5px 12px',
    borderRadius: '99px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    color: 'var(--accent-cyan)',
    fontSize: '0.75rem',
    fontWeight: '600',
    marginBottom: '24px'
  },
  dotsContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  },
  dot: {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '1.5px solid transparent',
    transition: 'all 0.2s ease'
  },
  errorText: {
    color: 'var(--accent-crimson)',
    fontSize: '0.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px'
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '14px',
    width: '100%',
    maxWidth: '280px',
    marginTop: '12px'
  },
  keyBtn: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '1.4rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    transition: 'all 0.15s ease'
  },
  keyBtnAux: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto'
  },
  footerDivider: {
    width: '100%',
    height: '1px',
    background: 'var(--border-color)',
    margin: '24px 0 18px 0'
  },
  emergencyContainer: {
    width: '100%'
  },
  emergencyBtn: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '0.85rem'
  }
};
