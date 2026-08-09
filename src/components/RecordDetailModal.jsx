import React, { useState } from 'react';
import { 
  X, Sparkles, Building2, Calendar, User, FlaskConical, Pill, 
  Image as ImageIcon, Syringe, FileText, CheckCircle2, AlertTriangle, 
  Eye, FileCode, ShieldCheck 
} from 'lucide-react';

import { TRANSLATIONS } from '../services/i18n';
import ConditionAdviceBox from './ConditionAdviceBox';

export default function RecordDetailModal({ record, currentLang = 'en', onClose, onOpenDicoms, onOpenDoctorConsultation }) {
  const [activeTab, setActiveTab] = useState('detail');
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  if (!record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.recordCategoryTag}>
              <span className={`badge badge-${record.type}`}>
                {record.category}
              </span>
              <span style={styles.recordIdText}>{record.id}</span>
            </div>
            <h2 style={styles.modalTitle}>{record.title}</h2>
            <div style={styles.metaRow}>
              <Building2 size={14} color="var(--text-muted)" />
              <span>{record.facility}</span>
              <span style={{ margin: '0 4px' }}>•</span>
              <Calendar size={14} color="var(--text-muted)" />
              <span>{record.date}</span>
              {(record.orderingDoctor || record.prescriber || record.author) && (
                <>
                  <span style={{ margin: '0 4px' }}>•</span>
                  <User size={14} color="var(--text-muted)" />
                  <span>{record.orderingDoctor || record.prescriber || record.author}</span>
                </>
              )}
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={styles.tabNav}>
          <button
            style={activeTab === 'detail' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('detail')}
          >
            <FileText size={15} /> {t.officialRecord || "Official Medical Record"}
          </button>

          <button
            style={activeTab === 'ai' ? styles.tabActiveAi : styles.tab}
            onClick={() => setActiveTab('ai')}
          >
            <Sparkles size={15} color="var(--accent-emerald)" /> {t.aiTranslator || "AI Jargon Translator"}
          </button>

          <button
            style={activeTab === 'audit' ? styles.tabActive : styles.tab}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={15} /> {t.fhirAudit || "FHIR Audit & Source"}
          </button>
        </div>

        {/* Tab Body */}
        <div style={styles.modalBody}>
          {activeTab === 'detail' && (
            <div style={styles.tabContent}>
              {/* Lab Results Detailed Range Meter */}
              {record.labMetrics && (
                <div style={styles.labSection}>
                  <h3 style={styles.sectionHeader}>{t.biomarkers || "Biomarkers & Reference Ranges"}</h3>
                  <div style={styles.metricsList}>
                    {record.labMetrics.map((metric, idx) => {
                      const isHigh = metric.status === 'high';
                      const isLow = metric.status === 'low';
                      
                      // Calculate percentage position for reference slider visualizer
                      const min = metric.minRef || 0;
                      const max = metric.maxRef || metric.value * 1.5;
                      const range = max - min || 100;
                      const percent = Math.min(Math.max(((metric.value - min) / range) * 100, 5), 95);

                      return (
                        <div key={idx} style={styles.metricCard}>
                          <div style={styles.metricCardTop}>
                            <div>
                              <div style={styles.metricTitleRow}>
                                <span style={styles.metricTitle}>{metric.name}</span>
                                {isHigh && <span style={styles.statusBadgeHigh}>HIGH</span>}
                                {isLow && <span style={styles.statusBadgeLow}>LOW</span>}
                                {!isHigh && !isLow && <span style={styles.statusBadgeNormal}>NORMAL</span>}
                              </div>
                              <p style={styles.metricDesc}>{metric.description}</p>
                            </div>
                            <div style={styles.metricValueLarge}>
                              {metric.value} <span style={styles.unitText}>{metric.unit}</span>
                            </div>
                          </div>

                          {/* Reference Visualizer Meter */}
                          <div style={styles.meterContainer}>
                            <div style={styles.meterTrack}>
                              <div
                                style={{
                                  ...styles.meterIndicatorPin,
                                  left: `${percent}%`,
                                  backgroundColor: isHigh ? 'var(--accent-crimson)' : 'var(--accent-emerald)'
                                }}
                              />
                            </div>
                            <div style={styles.meterLabels}>
                              <span>Min Ref: {metric.minRef} {metric.unit}</span>
                              <span>Max Ref: {metric.maxRef} {metric.unit}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Radiology & Imaging Details */}
              {record.imagingDetails && (
                <div style={styles.imagingSection}>
                  <h3 style={styles.sectionHeader}>{t.radiologyReport || "Radiology Report & Findings"}</h3>
                  <div style={styles.findingsBox} className="glass-panel">
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Modality:</strong> {record.imagingDetails.modality} • <strong>Target:</strong> {record.imagingDetails.bodyPart}
                    </p>
                    <p style={{ marginBottom: '8px' }}>
                      <strong>Radiologist Findings:</strong> {record.imagingDetails.findings}
                    </p>
                    <p style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      <strong>Clinical Impression:</strong> {record.imagingDetails.impression}
                    </p>
                  </div>

                  <div style={{ marginTop: '16px' }}>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenDicoms(record);
                      }}
                      className="btn btn-cyan"
                    >
                      <Eye size={18} />
                      <span>{t.launchDicom || "Launch Interactive DICOM & Radiology Scan Viewer"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Prescription Data */}
              {record.prescriptionData && (
                <div style={styles.rxSection}>
                  <h3 style={styles.sectionHeader}>{t.rxDetails || "Digital Prescription Details"}</h3>
                  <div style={styles.rxGrid}>
                    <div style={styles.rxCard}>
                      <span style={styles.rxLabel}>{t.medication || "Medication"}</span>
                      <span style={styles.rxVal}>{record.prescriptionData.drugName}</span>
                    </div>
                    <div style={styles.rxCard}>
                      <span style={styles.rxLabel}>{t.dosage || "Dosage & Frequency"}</span>
                      <span style={styles.rxVal}>{record.prescriptionData.dosage}</span>
                    </div>
                    <div style={styles.rxCard}>
                      <span style={styles.rxLabel}>{t.instructions || "Instructions"}</span>
                      <span style={styles.rxVal}>{record.prescriptionData.instructions}</span>
                    </div>
                    <div style={styles.rxCard}>
                      <span style={styles.rxLabel}>{t.rxNumber || "Rx Number"}</span>
                      <span style={styles.rxValMono}>{record.prescriptionData.rxNumber}</span>
                    </div>
                    <div style={styles.rxCard}>
                      <span style={styles.rxLabel}>{t.refills || "Refills Remaining"}</span>
                      <span style={styles.rxValEmphasis}>{record.prescriptionData.refillsLeft} refills</span>
                    </div>
                    <div style={styles.rxCard}>
                      <span style={styles.rxLabel}>{t.nextRefill || "Next Refill Date"}</span>
                      <span style={styles.rxVal}>{record.prescriptionData.refillDueDate}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Vaccine Data */}
              {record.vaccineData && (
                <div style={styles.vacSection}>
                  <h3 style={styles.sectionHeader}>{t.immunizationRecord || "Immunization Records"}</h3>
                  {record.vaccineData.vaccines.map((v, i) => (
                    <div key={i} style={styles.vacCard}>
                      <div style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{v.name}</div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        Manufacturer: {v.manufacturer} • Lot #: <code>{v.lotNumber}</code> • Site: {v.site}
                      </div>
                    </div>
                  ))}
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Next due milestone: {record.vaccineData.nextDueDate}
                  </p>
                </div>
              )}

              {/* Doctor Note */}
              {record.doctorNote && (
                <div style={styles.noteSection}>
                  <h3 style={styles.sectionHeader}>Clinical SOAP Note</h3>
                  <div style={styles.soapBox}>
                    <p><strong>Subjective:</strong> {record.doctorNote.subjective}</p>
                    <p><strong>Objective:</strong> {record.doctorNote.objective}</p>
                    <p><strong>Assessment:</strong> {record.doctorNote.assessment}</p>
                    <p><strong>Plan:</strong> {record.doctorNote.plan}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI Plain-English Explainer Tab */}
          {activeTab === 'ai' && (
            <div style={styles.aiBox}>
              <div style={styles.aiHeader}>
                <Sparkles size={24} color="var(--accent-emerald)" />
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Medical Jargon AI Translator</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Powered by Medical Knowledge Graph - Translating complex lab terms & clinical notes into clear everyday language.
                  </p>
                </div>
              </div>

              <div style={styles.aiCard}>
                <h4 style={{ color: 'var(--accent-emerald)', marginBottom: '8px' }}>What this record means for you:</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-primary)' }}>
                  {record.aiTranslation}
                </p>
              </div>

              {/* Condition-Specific Diet & Lifestyle Advice Box */}
              <ConditionAdviceBox
                tags={record.tags || []}
                labMetrics={record.labMetrics || []}
                title={record.title}
              />

              <div style={styles.actionItemsBox}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '8px', color: 'var(--accent-cyan)' }}>
                  Suggested Next Steps & Questions for Doctor:
                </h4>
                <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  <li>Keep a digital copy of this record for your upcoming annual checkup.</li>
                  <li>Ask your doctor if lifestyle modifications or follow-up tests are needed in 6 months.</li>
                  <li>Ensure your offline wallet emergency card stays updated with any prescription changes.</li>
                </ul>

                {onOpenDoctorConsultation && (
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', marginTop: '14px', gap: '8px' }}
                    onClick={() => {
                      onClose();
                      onOpenDoctorConsultation(record);
                    }}
                  >
                    👨‍⚕️ Send Report to Real Doctor for Review
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Audit & FHIR Tab */}
          {activeTab === 'audit' && (
            <div style={styles.auditBox}>
              <div style={styles.auditHeader}>
                <CheckCircle2 size={20} color="var(--accent-emerald)" />
                <span>Verified FHIR R4 Health Data Exchange Record</span>
              </div>
              <div style={styles.jsonPreview}>
                <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
{JSON.stringify({
  resourceType: record.type === 'lab' ? "Observation" : record.type === 'prescription' ? "MedicationRequest" : "DiagnosticReport",
  id: record.id,
  status: "final",
  code: { text: record.title },
  subject: { reference: "Patient/PAT-884920", display: "Alex Morgan" },
  effectiveDateTime: record.date,
  performer: [{ display: record.facility }],
  digitalSignatureHash: "sha256:8f4a9b2c1d3e5f6a7b8c9d0e1f2a3b4c5d6e7f8a"
}, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  modalHeader: {
    padding: '24px 28px 16px 28px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)'
  },
  recordCategoryTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '6px'
  },
  recordIdText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  modalTitle: {
    fontSize: '1.4rem',
    fontWeight: '800',
    color: 'var(--text-primary)'
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    marginTop: '6px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '6px',
    borderRadius: '50%'
  },
  tabNav: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0 28px',
    borderBottom: '1px solid var(--border-color)',
    background: 'rgba(0, 0, 0, 0.1)'
  },
  tab: {
    padding: '12px 18px',
    border: 'none',
    background: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.88rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '2px solid transparent'
  },
  tabActive: {
    padding: '12px 18px',
    border: 'none',
    background: 'none',
    color: 'var(--accent-emerald)',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '2px solid var(--accent-emerald)'
  },
  tabActiveAi: {
    padding: '12px 18px',
    border: 'none',
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--accent-emerald)',
    fontSize: '0.88rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    borderBottom: '2px solid var(--accent-emerald)'
  },
  modalBody: {
    padding: '24px 28px'
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  sectionHeader: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '14px'
  },
  labSection: {},
  metricsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  metricCard: {
    padding: '16px 20px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)'
  },
  metricCardTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px'
  },
  metricTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  metricTitle: {
    fontWeight: '700',
    fontSize: '0.98rem',
    color: 'var(--text-primary)'
  },
  metricDesc: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  metricValueLarge: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap'
  },
  unitText: {
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
    fontWeight: '500'
  },
  statusBadgeHigh: {
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(239, 68, 68, 0.2)',
    color: 'var(--accent-crimson)',
    fontSize: '0.7rem',
    fontWeight: '800'
  },
  statusBadgeLow: {
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(245, 158, 11, 0.2)',
    color: 'var(--accent-amber)',
    fontSize: '0.7rem',
    fontWeight: '800'
  },
  statusBadgeNormal: {
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--accent-emerald)',
    fontSize: '0.7rem',
    fontWeight: '800'
  },
  meterContainer: {
    marginTop: '14px'
  },
  meterTrack: {
    position: 'relative',
    height: '6px',
    borderRadius: '99px',
    background: 'linear-gradient(90deg, #10b981 0%, #10b981 60%, #ef4444 100%)',
    opacity: 0.8
  },
  meterIndicatorPin: {
    position: 'absolute',
    top: '-5px',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #ffffff',
    transform: 'translateX(-50%)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
  },
  meterLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    marginTop: '6px',
    fontFamily: 'var(--font-mono)'
  },
  imagingSection: {},
  findingsBox: {
    padding: '16px 20px',
    fontSize: '0.9rem',
    lineHeight: '1.6'
  },
  rxSection: {},
  rxGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '12px'
  },
  rxCard: {
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column'
  },
  rxLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
  },
  rxVal: {
    fontSize: '0.9rem',
    fontWeight: '600',
    color: 'var(--text-primary)',
    marginTop: '2px'
  },
  rxValMono: {
    fontSize: '0.85rem',
    fontFamily: 'var(--font-mono)',
    color: 'var(--accent-cyan)',
    marginTop: '2px'
  },
  rxValEmphasis: {
    fontSize: '0.95rem',
    fontWeight: '800',
    color: 'var(--accent-emerald)',
    marginTop: '2px'
  },
  vacSection: {},
  vacCard: {
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(245, 158, 11, 0.08)',
    border: '1px solid rgba(245, 158, 11, 0.25)',
    marginBottom: '10px'
  },
  noteSection: {},
  soapBox: {
    padding: '16px 20px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    fontSize: '0.9rem',
    lineHeight: '1.6'
  },
  aiBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    borderRadius: '14px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)'
  },
  aiCard: {
    padding: '20px',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)'
  },
  actionItemsBox: {
    padding: '16px 20px',
    borderRadius: '14px',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)'
  },
  auditBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  auditHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: 'var(--accent-emerald)',
    fontWeight: '700'
  },
  jsonPreview: {
    padding: '16px',
    borderRadius: '12px',
    background: '#090d16',
    border: '1px solid var(--border-color)',
    color: '#38bdf8',
    overflowX: 'auto'
  }
};
