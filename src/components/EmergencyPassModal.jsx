import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Activity, QrCode, ShieldAlert, Heart, Phone, 
  Printer, Download, CheckCircle2, User, Lock, AlertCircle, Pill 
} from 'lucide-react';

export default function EmergencyPassModal({ patientProfile, onClose }) {
  const [paramedicMode, setParamedicMode] = useState(false);
  const qrCanvasRef = useRef(null);

  useEffect(() => {
    drawQrCodeCanvas();
  }, [patientProfile]);

  const drawQrCodeCanvas = () => {
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#000000';
    const gridSize = 19;
    const cellSize = size / gridSize;

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const isTopLeft = r < 7 && c < 7;
        const isTopRight = r < 7 && c >= gridSize - 7;
        const isBottomLeft = r >= gridSize - 7 && c < 7;

        if (isTopLeft || isTopRight || isBottomLeft) {
          const isOuterBorder = 
            r === 0 || r === 6 || c === 0 || c === 6 ||
            r === gridSize - 1 || r === gridSize - 7 || c === gridSize - 1 || c === gridSize - 7;
          const isInnerSquare = 
            (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
            (r >= 2 && r <= 4 && c >= gridSize - 5 && c <= gridSize - 3) ||
            (r >= gridSize - 5 && r >= gridSize - 3 && c >= 2 && c <= 4);

          if (isOuterBorder || isInnerSquare) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        } else {
          if ((r * 13 + c * 37) % 3 === 0 || (r + c) % 5 === 0) {
            ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          }
        }
      }
    }

    ctx.fillStyle = '#10b981';
    ctx.fillRect(size / 2 - 12, size / 2 - 12, 24, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✚', size / 2, size / 2 + 5);
  };

  const handlePrintCard = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ background: '#0b0f19' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={styles.headerIcon}>
              <Activity size={22} color="var(--accent-crimson)" />
            </div>
            <div>
              <h2 style={styles.title}>Universal Emergency ID Passcard</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Paramedic Accessible • Blood Group • Allergies • Active Medications
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Paramedic Simulation Toggle */}
        <div style={styles.modeToggleBar}>
          <button
            style={!paramedicMode ? styles.modeBtnActive : styles.modeBtn}
            onClick={() => setParamedicMode(false)}
          >
            Digital Wallet Pass View
          </button>
          <button
            style={paramedicMode ? styles.modeBtnActiveDanger : styles.modeBtn}
            onClick={() => setParamedicMode(true)}
          >
            <Activity size={15} /> Simulate Paramedic QR Scan Mode
          </button>
        </div>

        <div style={styles.modalBody}>
          {!paramedicMode ? (
            /* Digital Wallet Card View */
            <div style={styles.walletPassContainer}>
              <div style={styles.passCard}>
                {/* Top Bar */}
                <div style={styles.passTopBar}>
                  <div style={styles.passBrand}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>MediVault</span>
                    <span style={styles.passType}>EMERGENCY ID</span>
                  </div>
                  <div style={styles.passBloodBadge}>
                    BLOOD TYPE: {patientProfile.bloodType}
                  </div>
                </div>

                {/* Patient Details & QR */}
                <div style={styles.passMainRow}>
                  <div style={styles.passAvatar}>
                    {patientProfile.name.charAt(0)}
                  </div>
                  <div style={styles.passNameDetails}>
                    <h3 style={styles.passPatientName}>{patientProfile.name}</h3>
                    <p style={styles.passSubMeta}>
                      DOB: {patientProfile.dob} (Age {patientProfile.age}) • {patientProfile.height}
                    </p>
                    {patientProfile.organDonor && (
                      <span style={styles.passDonorBadge}>❤️ Organ Donor</span>
                    )}
                  </div>

                  <div style={styles.qrBox}>
                    <canvas ref={qrCanvasRef} width={100} height={100} style={styles.qrCanvas} />
                    <span style={styles.qrCaption}>Scan for Offline EHR</span>
                  </div>
                </div>

                {/* Severe Allergies */}
                <div style={styles.passAllergiesBox}>
                  <div style={styles.passSectionTitle}>
                    <ShieldAlert size={16} color="#ef4444" />
                    <span>CRITICAL SEVERE ALLERGIES</span>
                  </div>
                  <div style={styles.passAllergyTags}>
                    {patientProfile.allergies?.map((all, i) => (
                      <div key={i} style={styles.passAllergyPill}>
                        🚨 <strong>{all.name}</strong> ({all.severity})
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Medications List */}
                <div style={styles.passMedicationBox}>
                  <div style={styles.passSectionTitleMed}>
                    <Pill size={16} color="var(--accent-emerald)" />
                    <span>CURRENT ACTIVE MEDICATIONS</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                    {patientProfile.activeMedications && patientProfile.activeMedications.length > 0 ? (
                      patientProfile.activeMedications.map((med, idx) => (
                        <div key={idx} style={{ marginTop: '4px' }}>
                          💊 <strong>{med}</strong>
                        </div>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>No chronic daily prescription medications.</span>
                    )}
                  </div>
                </div>

                {/* Emergency Contact & Physician */}
                <div style={styles.passFooterGrid}>
                  <div style={styles.passFooterCard}>
                    <span style={styles.footerLabel}>Emergency Contact</span>
                    <span style={styles.footerVal}>{patientProfile.emergencyContact?.name} ({patientProfile.emergencyContact?.relation})</span>
                    <span style={styles.footerPhone}><Phone size={12} /> {patientProfile.emergencyContact?.phone}</span>
                  </div>
                  <div style={styles.passFooterCard}>
                    <span style={styles.footerLabel}>Primary Physician</span>
                    <span style={styles.footerVal}>{patientProfile.primaryPhysician}</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div style={styles.passActions}>
                <button onClick={handlePrintCard} className="btn btn-secondary">
                  <Printer size={16} />
                  <span>Print Medical Badge / Save PDF</span>
                </button>
                <button
                  onClick={() => alert("Digital Wallet Pass downloaded! (.pkpass / Google Wallet standard)")}
                  className="btn btn-primary"
                >
                  <Download size={16} />
                  <span>Add to Apple / Google Wallet</span>
                </button>
              </div>
            </div>
          ) : (
            /* Paramedic View */
            <div style={styles.paramedicScanView}>
              <div style={styles.paramedicBanner}>
                <CheckCircle2 size={24} color="var(--accent-emerald)" />
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Paramedic Offline Emergency Record Decrypted
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Data extracted directly from encrypted QR payload on local responder device.
                  </p>
                </div>
              </div>

              <div style={styles.emergencyDataList}>
                <div style={styles.dataGroup}>
                  <h4>Patient Identifier</h4>
                  <p><strong>Name:</strong> {patientProfile.name} • <strong>DOB:</strong> {patientProfile.dob}</p>
                  <p><strong>Blood Group:</strong> <span style={{ color: 'var(--accent-crimson)', fontWeight: 800 }}>{patientProfile.bloodType}</span></p>
                </div>

                <div style={styles.dataGroupAlert}>
                  <h4 style={{ color: 'var(--accent-crimson)' }}>🚨 Known Allergies</h4>
                  <ul>
                    {patientProfile.allergies?.map((a, i) => (
                      <li key={i}><strong>{a.name}</strong> - {a.severity}</li>
                    ))}
                  </ul>
                </div>

                <div style={styles.dataGroup}>
                  <h4>Active Prescriptions & Dosage</h4>
                  {patientProfile.activeMedications?.map((m, i) => (
                    <p key={i}>• {m}</p>
                  ))}
                </div>

                <div style={styles.dataGroup}>
                  <h4>Emergency Contact & Next of Kin</h4>
                  <p>{patientProfile.emergencyContact?.name} ({patientProfile.emergencyContact?.relation}): <strong>{patientProfile.emergencyContact?.phone}</strong></p>
                </div>
              </div>
            </div>
          )}
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
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
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
  modeToggleBar: {
    display: 'flex',
    gap: '8px',
    padding: '12px 24px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid var(--border-color)'
  },
  modeBtn: {
    flex: 1,
    padding: '8px 14px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.85rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  modeBtnActive: {
    flex: 1,
    padding: '8px 14px',
    borderRadius: '8px',
    background: 'var(--accent-emerald)',
    border: '1px solid var(--accent-emerald)',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  modeBtnActiveDanger: {
    flex: 1,
    padding: '8px 14px',
    borderRadius: '8px',
    background: 'var(--accent-crimson)',
    border: '1px solid var(--accent-crimson)',
    color: '#ffffff',
    fontSize: '0.85rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  modalBody: {
    padding: '24px'
  },
  walletPassContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center'
  },
  passCard: {
    width: '100%',
    maxWidth: '560px',
    borderRadius: '20px',
    background: 'linear-gradient(145deg, #131a2b 0%, #0d121f 100%)',
    border: '1.5px solid rgba(239, 68, 68, 0.4)',
    padding: '24px',
    boxShadow: '0 12px 32px rgba(239, 68, 68, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  passTopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    paddingBottom: '12px'
  },
  passBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-primary)'
  },
  passType: {
    fontSize: '0.65rem',
    padding: '2px 6px',
    borderRadius: '4px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: 'var(--accent-crimson)',
    fontWeight: '800'
  },
  passBloodBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.9rem',
    fontWeight: '800',
    color: 'var(--accent-crimson)',
    background: 'rgba(239, 68, 68, 0.15)',
    padding: '4px 10px',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  passMainRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  },
  passAvatar: {
    width: '54px',
    height: '54px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#fff',
    fontSize: '1.6rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  passNameDetails: {
    flex: 1
  },
  passPatientName: {
    fontSize: '1.3rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  passSubMeta: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  passDonorBadge: {
    display: 'inline-block',
    fontSize: '0.72rem',
    padding: '2px 8px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--accent-emerald)',
    fontWeight: '700',
    marginTop: '6px'
  },
  qrBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px'
  },
  qrCanvas: {
    borderRadius: '8px',
    border: '2px solid #ffffff'
  },
  qrCaption: {
    fontSize: '0.65rem',
    color: 'var(--text-muted)'
  },
  passAllergiesBox: {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)'
  },
  passMedicationBox: {
    padding: '12px 16px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)'
  },
  passSectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--accent-crimson)',
    letterSpacing: '0.5px',
    marginBottom: '6px'
  },
  passSectionTitleMed: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--accent-emerald)',
    letterSpacing: '0.5px',
    marginBottom: '4px'
  },
  passAllergyTags: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  passAllergyPill: {
    padding: '4px 10px',
    borderRadius: '6px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: '#fca5a5',
    fontSize: '0.8rem'
  },
  passFooterGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  passFooterCard: {
    padding: '10px 14px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column'
  },
  footerLabel: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)'
  },
  footerVal: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginTop: '2px'
  },
  footerPhone: {
    fontSize: '0.78rem',
    color: 'var(--accent-cyan)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '4px',
    fontFamily: 'var(--font-mono)'
  },
  passActions: {
    display: 'flex',
    gap: '12px'
  },
  paramedicScanView: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  paramedicBanner: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)'
  },
  emergencyDataList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  dataGroup: {
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    fontSize: '0.88rem'
  },
  dataGroupAlert: {
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    fontSize: '0.88rem'
  }
};
