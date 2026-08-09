import React, { useState } from 'react';
import { 
  X, Stethoscope, CheckCircle2, Send, AlertTriangle, MessageSquare, PhoneCall, Award 
} from 'lucide-react';

export default function DoctorConsultationModal({ record, patientProfile, onClose }) {
  const [selectedDoctor, setSelectedDoctor] = useState('dr-jenkins');
  const [patientNote, setPatientNote] = useState('');
  const [consultType, setConsultType] = useState('review');
  const [submitted, setSubmitted] = useState(false);

  const doctorsList = [
    {
      id: 'dr-jenkins',
      name: 'Dr. Sarah Jenkins, MD',
      specialty: 'Internal Medicine & Primary Care',
      hospital: 'Mayo Clinic Health System',
      license: 'MD-884920 (Verified)',
      rating: '4.9 ★',
      availability: 'Available Today'
    },
    {
      id: 'dr-sharma',
      name: 'Dr. K. Sharma, MD',
      specialty: 'Endocrinology & Diabetes Specialist',
      hospital: 'Metabolic Care Center',
      license: 'MD-774102 (Verified)',
      rating: '4.95 ★',
      availability: 'Next slot: Tomorrow 10:00 AM'
    },
    {
      id: 'dr-menon',
      name: 'Dr. A. Menon, MD',
      specialty: 'Cardiology & Hypertension',
      hospital: 'Cardiology Health Institute',
      license: 'MD-991823 (Verified)',
      rating: '4.88 ★',
      availability: 'Available Today'
    }
  ];

  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Modal Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <Stethoscope size={24} color="#ffffff" />
            </div>
            <div>
              <h2 style={styles.title}>Collaborate with a Real Doctor</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Get certified medical review & human doctor verification for your report.
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {submitted ? (
          <div style={styles.successBox}>
            <CheckCircle2 size={54} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: '12px 0 6px 0' }}>
              Consultation Request Sent!
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '420px' }}>
              Your selected physician has been securely notified. You will receive certified doctor notes and sign-off within 2–4 hours.
            </p>
            <div style={styles.docBadgeRow}>
              <Award size={16} color="var(--accent-emerald)" />
              <span>Verified Doctor Review Pending</span>
            </div>
            <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '16px' }}>
              Done & Return to Vault
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest} style={styles.modalBody}>
            {/* Safety Disclaimer Banner */}
            <div style={styles.disclaimerBanner}>
              <AlertTriangle size={18} color="var(--accent-amber)" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                <strong>AI Safety Protocol:</strong> AI summary suggestions are for informational reference only. Real licensed physicians evaluate your actual lab values and medical history before issuing treatment plans.
              </span>
            </div>

            {/* Attached Report Preview */}
            {record && (
              <div style={styles.reportCard}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  Attached Report for Doctor Review
                </span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '2px' }}>
                  {record.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Date: {record.date} • Facility: {record.facility}
                </div>
              </div>
            )}

            {/* Service Type Selection */}
            <div style={styles.section}>
              <label style={styles.sectionLabel}>Select Consultation Type</label>
              <div style={styles.typeGrid}>
                <button
                  type="button"
                  style={consultType === 'review' ? styles.typeBtnActive : styles.typeBtn}
                  onClick={() => setConsultType('review')}
                >
                  <MessageSquare size={16} color={consultType === 'review' ? '#10b981' : 'var(--text-muted)'} />
                  <span>Report Sign-off & Notes</span>
                </button>

                <button
                  type="button"
                  style={consultType === 'second_opinion' ? styles.typeBtnActive : styles.typeBtn}
                  onClick={() => setConsultType('second_opinion')}
                >
                  <Stethoscope size={16} color={consultType === 'second_opinion' ? '#06b6d4' : 'var(--text-muted)'} />
                  <span>Second Opinion</span>
                </button>

                <button
                  type="button"
                  style={consultType === 'video' ? styles.typeBtnActive : styles.typeBtn}
                  onClick={() => setConsultType('video')}
                >
                  <PhoneCall size={16} color={consultType === 'video' ? '#6366f1' : 'var(--text-muted)'} />
                  <span>1-on-1 Video Visit</span>
                </button>
              </div>
            </div>

            {/* Select Real Doctor */}
            <div style={styles.section}>
              <label style={styles.sectionLabel}>Choose Verified Physician</label>
              <div style={styles.doctorList}>
                {doctorsList.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.id)}
                    style={selectedDoctor === doc.id ? styles.docCardActive : styles.docCard}
                  >
                    <div style={styles.docHeader}>
                      <div>
                        <span style={styles.docName}>{doc.name}</span>
                        <span style={styles.docLicense}>{doc.license}</span>
                      </div>
                      <span style={styles.ratingBadge}>{doc.rating}</span>
                    </div>
                    <div style={styles.docSub}>{doc.specialty} • {doc.hospital}</div>
                    <div style={styles.availText}>⏱️ {doc.availability}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Question / Notes to Doctor */}
            <div style={styles.section}>
              <label style={styles.sectionLabel}>Specific Questions for the Doctor (Optional)</label>
              <textarea
                rows={3}
                placeholder="e.g. Please check if my HbA1c 7.8% requires doubling my Metformin dose or if diet changes are enough."
                value={patientNote}
                onChange={(e) => setPatientNote(e.target.value)}
                style={styles.textarea}
              />
            </div>

            {/* Modal Actions */}
            <div style={styles.footer}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ gap: '8px' }}>
                <Send size={16} /> Send to Real Doctor for Review
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: 'var(--text-primary)'
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer'
  },
  modalBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  disclaimerBanner: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  reportCard: {
    padding: '12px 16px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)'
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sectionLabel: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: 'var(--text-primary)'
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px'
  },
  typeBtn: {
    padding: '10px 8px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: 600,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  typeBtnActive: {
    padding: '10px 8px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(16, 185, 129, 0.15)',
    border: '1px solid var(--accent-emerald)',
    color: 'var(--text-primary)',
    fontSize: '0.78rem',
    fontWeight: 700,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer'
  },
  doctorList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  docCard: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  docCardActive: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid var(--accent-emerald)',
    cursor: 'pointer'
  },
  docHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  docName: {
    fontSize: '0.92rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
    marginRight: '8px'
  },
  docLicense: {
    fontSize: '0.72rem',
    color: 'var(--accent-emerald)',
    fontFamily: 'var(--font-mono)'
  },
  ratingBadge: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#fbbf24',
    background: 'rgba(245, 158, 11, 0.15)',
    padding: '2px 8px',
    borderRadius: '99px'
  },
  docSub: {
    fontSize: '0.78rem',
    color: 'var(--text-secondary)',
    marginTop: '2px'
  },
  availText: {
    fontSize: '0.74rem',
    color: 'var(--accent-cyan)',
    marginTop: '4px',
    fontWeight: 600
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    fontFamily: 'var(--font-sans)',
    outline: 'none',
    resize: 'vertical'
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '8px'
  },
  successBox: {
    padding: '36px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  docBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.82rem',
    color: 'var(--accent-emerald)',
    fontWeight: 600,
    marginTop: '12px'
  }
};
