import React, { useState } from 'react';
import { 
  X, RefreshCw, Building2, CheckCircle2, UploadCloud, 
  FileText, Sparkles, Database, ShieldCheck, AlertCircle, ArrowRight 
} from 'lucide-react';

export default function ProviderSyncModal({ providers, onToggleSync, onAddRecord, onClose }) {
  const [syncingId, setSyncingId] = useState(null);

  // Document OCR Uploader state
  const [uploading, setUploading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [uploadedRecord, setUploadedRecord] = useState(null);

  const handleSyncClick = (providerId) => {
    setSyncingId(providerId);
    setTimeout(() => {
      onToggleSync(providerId);
      setSyncingId(null);
    }, 1200);
  };

  const handleSimulateDocumentScan = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setScanProgress(10);
    setUploadedRecord(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          finishOcrExtraction(file.name);
          return 100;
        }
        return prev + 25;
      });
    }, 300);
  };

  const finishOcrExtraction = (fileName) => {
    setTimeout(() => {
      setUploading(false);
      // Construct extracted mock record
      const parsedRecord = {
        id: `REC-OCR-${Math.floor(1000 + Math.random() * 9000)}`,
        title: fileName.replace(/\.[^/.]+$/, "") || "Uploaded Clinical Document",
        type: "lab",
        category: "Lab Result",
        date: new Date().toISOString().split('T')[0],
        facility: "Metro Health Diagnostics (OCR Scanned)",
        orderingDoctor: "Dr. Evelyn Vance, MD",
        urgency: "normal",
        summary: `Extracted from ${fileName} via MediVault On-Device OCR Scanner. All markers within normal limits.`,
        labMetrics: [
          { name: "Fasting Blood Sugar", value: 88, unit: "mg/dL", minRef: 70, maxRef: 99, status: "normal", description: "Fasting glucose extracted via OCR." },
          { name: "Vitamin D (25-OH)", value: 34, unit: "ng/mL", minRef: 30, maxRef: 100, status: "normal", description: "Vitamin D level in blood." }
        ],
        aiTranslation: "This document shows healthy blood sugar levels (88 mg/dL) and adequate Vitamin D levels (34 ng/mL).",
        tags: ["OCR Scan", "PDF Import", "Lab"],
        attachmentUrl: null
      };

      setUploadedRecord(parsedRecord);
      onAddRecord(parsedRecord);
    }, 400);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <RefreshCw size={24} color="var(--accent-emerald)" />
            </div>
            <div>
              <h2 style={styles.title}>Provider Sync & Document Import</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                FHIR R4 Hospital Aggregator & On-Device OCR Scanner
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.modalBody}>
          {/* Section 1: Connected Hospital Portals */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <Building2 size={18} color="var(--accent-emerald)" />
              <span>Connected EHR & Health Portals</span>
            </h3>

            <div style={styles.providerGrid}>
              {providers.map((p) => {
                const isConn = p.status === 'connected';
                const isSyncing = syncingId === p.id;

                return (
                  <div key={p.id} style={isConn ? styles.providerCardConnected : styles.providerCard}>
                    <div style={styles.providerInfo}>
                      <div style={styles.providerIconCircle}>
                        <Database size={18} color={isConn ? 'var(--accent-emerald)' : 'var(--text-muted)'} />
                      </div>
                      <div>
                        <h4 style={styles.providerName}>{p.name}</h4>
                        <p style={styles.providerCat}>{p.category}</p>
                        {isConn && (
                          <span style={styles.syncTime}>Last Synced: {p.lastSync}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleSyncClick(p.id)}
                      className={isConn ? "btn btn-secondary btn-sm" : "btn btn-outline-emerald btn-sm"}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <>
                          <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                          <span>Syncing...</span>
                        </>
                      ) : isConn ? (
                        <>
                          <CheckCircle2 size={14} color="var(--accent-emerald)" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <span>+ Connect</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Document Drag & Drop OCR Scanner */}
          <div style={styles.section} className="glass-panel">
            <h3 style={styles.sectionTitle}>
              <UploadCloud size={18} color="var(--accent-cyan)" />
              <span>Smart Document Upload & Laser OCR Scanner</span>
            </h3>

            <div style={styles.uploadBox}>
              <input
                type="file"
                id="docUploadInput"
                accept=".pdf,.png,.jpg,.jpeg,.dicom"
                onChange={handleSimulateDocumentScan}
                style={{ display: 'none' }}
              />

              {uploading ? (
                <div style={styles.scanningProgressState}>
                  <div style={styles.laserBeam} />
                  <Sparkles size={32} color="var(--accent-cyan)" className="spin" />
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '12px' }}>
                    Scanning Medical Document ({scanProgress}%)
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                    Running AI OCR parsing on lab metrics, dates, and physician notes...
                  </p>
                </div>
              ) : uploadedRecord ? (
                <div style={styles.successState}>
                  <CheckCircle2 size={36} color="var(--accent-emerald)" />
                  <h4 style={{ color: 'var(--text-primary)', marginTop: '8px' }}>
                    Successfully Extracted & Added to Wallet!
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Record Title: <strong>{uploadedRecord.title}</strong>
                  </p>
                  <button
                    onClick={() => setUploadedRecord(null)}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '12px' }}
                  >
                    + Scan Another Document
                  </button>
                </div>
              ) : (
                <label htmlFor="docUploadInput" style={styles.uploadLabel}>
                  <UploadCloud size={40} color="var(--accent-cyan)" />
                  <span style={styles.uploadTitle}>
                    Click or Drag & Drop Medical Report / Prescription Image / PDF
                  </span>
                  <span style={styles.uploadSubtitle}>
                    Automatic text extraction for lab values, doctor signatures & dates (Supported: PDF, JPG, PNG, DICOM)
                  </span>
                  <span className="btn btn-cyan btn-sm" style={{ marginTop: '12px' }}>
                    Choose Local File
                  </span>
                </label>
              )}
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
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
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
    gap: '24px'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    padding: '20px',
    borderRadius: '14px'
  },
  sectionTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  providerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '12px'
  },
  providerCard: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px'
  },
  providerCardConnected: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.06)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px'
  },
  providerInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  providerIconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  providerName: {
    fontSize: '0.9rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  providerCat: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  syncTime: {
    fontSize: '0.68rem',
    color: 'var(--accent-emerald)',
    display: 'block',
    marginTop: '2px',
    fontFamily: 'var(--font-mono)'
  },
  uploadBox: {
    border: '2px dashed var(--border-color)',
    borderRadius: '14px',
    padding: '36px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  uploadLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  uploadTitle: {
    fontSize: '0.98rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  uploadSubtitle: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)'
  },
  scanningProgressState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0'
  },
  laserBeam: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '2px',
    background: 'var(--accent-cyan)',
    boxShadow: '0 0 12px var(--accent-cyan)',
    animation: 'laserScan 1.5s infinite ease-in-out'
  },
  successState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 0'
  }
};
