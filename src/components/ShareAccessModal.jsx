import React, { useState } from 'react';
import { 
  X, Share2, Clock, ShieldCheck, Copy, Check, 
  Eye, Lock, KeyRound, AlertCircle 
} from 'lucide-react';

export default function ShareAccessModal({ onClose }) {
  const [expiry, setExpiry] = useState('15m');
  const [copied, setCopied] = useState(false);

  // Privacy Scope toggles
  const [scopes, setScopes] = useState({
    labs: true,
    scans: true,
    rx: true,
    vaccines: true,
    notes: false // Default off for doctor notes
  });

  const accessPin = "884-910";
  const shareUrl = `https://medivault.app/consult/${accessPin}?exp=${expiry}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleScope = (key) => {
    setScopes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <Share2 size={24} color="var(--accent-indigo)" />
            </div>
            <div>
              <h2 style={styles.title}>Granular Doctor Access Link</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Generate temporary, self-destructing access pass for consultation.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Expiration selector */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>
              <Clock size={15} color="var(--accent-amber)" /> Access Link Expiration Time
            </label>
            <div style={styles.expiryGrid}>
              {[
                { id: '15m', label: '15 Minutes' },
                { id: '1h', label: '1 Hour' },
                { id: '24h', label: '24 Hours' }
              ].map(item => (
                <button
                  key={item.id}
                  style={expiry === item.id ? styles.expiryBtnActive : styles.expiryBtn}
                  onClick={() => setExpiry(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scope Privacy checklist */}
          <div style={styles.section}>
            <label style={styles.sectionLabel}>
              <ShieldCheck size={15} color="var(--accent-emerald)" /> Select Records Included in Pass
            </label>
            <div style={styles.scopeList}>
              <label style={styles.scopeItem}>
                <input type="checkbox" checked={scopes.labs} onChange={() => toggleScope('labs')} />
                <span>Lab & Blood Results (CBC, Lipid Panel)</span>
              </label>

              <label style={styles.scopeItem}>
                <input type="checkbox" checked={scopes.scans} onChange={() => toggleScope('scans')} />
                <span>Radiology & DICOM Scans (X-Rays, MRIs)</span>
              </label>

              <label style={styles.scopeItem}>
                <input type="checkbox" checked={scopes.rx} onChange={() => toggleScope('rx')} />
                <span>Active Prescriptions & Dosage</span>
              </label>

              <label style={styles.scopeItem}>
                <input type="checkbox" checked={scopes.vaccines} onChange={() => toggleScope('vaccines')} />
                <span>Immunization History</span>
              </label>

              <label style={styles.scopeItem}>
                <input type="checkbox" checked={scopes.notes} onChange={() => toggleScope('notes')} />
                <span style={{ color: !scopes.notes ? 'var(--text-muted)' : 'inherit' }}>
                  Doctor Clinical SOAP Notes (Restricted)
                </span>
              </label>
            </div>
          </div>

          {/* Generated Link Box */}
          <div style={styles.linkBox}>
            <div style={styles.pinHeader}>
              <span>Temporary Doctor Access PIN:</span>
              <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', color: 'var(--accent-cyan)' }}>
                {accessPin}
              </strong>
            </div>

            <div style={styles.inputGroup}>
              <input
                type="text"
                readOnly
                value={shareUrl}
                style={styles.urlInput}
              />
              <button onClick={handleCopy} className="btn btn-primary btn-sm">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)'
  },
  headerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(99, 102, 241, 0.12)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px'
  },
  modalBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sectionLabel: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  expiryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  expiryBtn: {
    padding: '9px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  expiryBtnActive: {
    padding: '9px',
    borderRadius: '8px',
    background: 'var(--accent-indigo)',
    border: '1px solid var(--accent-indigo)',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  scopeList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)'
  },
  scopeItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '0.85rem',
    cursor: 'pointer'
  },
  linkBox: {
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  pinHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)'
  },
  inputGroup: {
    display: 'flex',
    gap: '8px'
  },
  urlInput: {
    flex: 1,
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid var(--border-color)',
    color: 'var(--accent-cyan)',
    fontSize: '0.82rem',
    fontFamily: 'var(--font-mono)',
    outline: 'none'
  }
};
