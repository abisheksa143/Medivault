import React, { useState } from 'react';
import { X, PlusCircle, FlaskConical, Pill, Image as ImageIcon, Syringe, FileText } from 'lucide-react';

export default function NewRecordModal({ onAddRecord, onClose }) {
  const [type, setType] = useState('lab');
  const [title, setTitle] = useState('');
  const [facility, setFacility] = useState('');
  const [doctor, setDoctor] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [urgency, setUrgency] = useState('normal');
  const [summary, setSummary] = useState('');
  const [aiTranslation, setAiTranslation] = useState('');

  // Lab specific fields
  const [metricName, setMetricName] = useState('Hemoglobin A1c');
  const [metricValue, setMetricValue] = useState('5.7');
  const [metricUnit, setMetricUnit] = useState('%');

  const handleSubmit = (e) => {
    e.preventDefault();

    const categoryMap = {
      lab: 'Lab Result',
      prescription: 'Prescription',
      scan: 'Radiology & Imaging',
      immunization: 'Immunization',
      note: 'Doctor Note'
    };

    const newRec = {
      id: `REC-MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      title: title || 'New Health Record',
      type: type,
      category: categoryMap[type],
      date: date,
      facility: facility || 'Local Medical Clinic',
      orderingDoctor: doctor || 'Dr. Self-Reported',
      urgency: urgency,
      summary: summary || 'Patient entered health record.',
      aiTranslation: aiTranslation || summary || 'Recorded in offline health wallet.',
      tags: ["Manual Entry", categoryMap[type]],
      attachmentUrl: null
    };

    if (type === 'lab') {
      newRec.labMetrics = [
        {
          name: metricName,
          value: Number(metricValue) || 0,
          unit: metricUnit,
          minRef: 4.0,
          maxRef: 5.7,
          status: urgency === 'warning' ? 'high' : 'normal',
          description: 'Manually logged biomarker value.'
        }
      ];
    }

    onAddRecord(newRec);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PlusCircle size={22} color="var(--accent-emerald)" />
            <h2 style={styles.title}>Add Record to Health Wallet</h2>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.formBody}>
          {/* Record Type Selection */}
          <div style={styles.formGroup}>
            <label style={styles.label}>Record Category</label>
            <div style={styles.typeGrid}>
              {[
                { id: 'lab', label: 'Lab Result', icon: FlaskConical },
                { id: 'prescription', label: 'Prescription', icon: Pill },
                { id: 'scan', label: 'Imaging / Scan', icon: ImageIcon },
                { id: 'immunization', label: 'Vaccine', icon: Syringe },
                { id: 'note', label: 'Doctor Note', icon: FileText }
              ].map((item) => {
                const IconComp = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    style={type === item.id ? styles.typeBtnActive : styles.typeBtn}
                    onClick={() => setType(item.id)}
                  >
                    <IconComp size={14} /> {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Record Title / Test Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Blood Panel, Amoxicillin 500mg, Chest X-Ray"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Hospital / Clinic / Lab</label>
              <input
                type="text"
                placeholder="e.g. Quest Diagnostics"
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Physician Name</label>
              <input
                type="text"
                placeholder="e.g. Dr. Sarah Jenkins"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date of Record</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Status Flag</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                style={styles.select}
              >
                <option value="normal">Normal / Standard</option>
                <option value="warning">Requires Attention / Out of Range</option>
              </select>
            </div>
          </div>

          {/* Lab Specific Quick Values */}
          {type === 'lab' && (
            <div style={styles.labQuickBox}>
              <label style={styles.label}>Lab Biomarker & Result</label>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Metric Name (e.g. HbA1c)"
                  value={metricName}
                  onChange={(e) => setMetricName(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={metricValue}
                  onChange={(e) => setMetricValue(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="text"
                  placeholder="Unit (% / mg/dL)"
                  value={metricUnit}
                  onChange={(e) => setMetricUnit(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>
          )}

          <div style={styles.formGroup}>
            <label style={styles.label}>Summary / Clinical Notes</label>
            <textarea
              rows={2}
              placeholder="Key findings or dosage instructions..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>AI Plain-English Translation (Optional)</label>
            <textarea
              rows={2}
              placeholder="Simple explanation of what this means for day-to-day health..."
              value={aiTranslation}
              onChange={(e) => setAiTranslation(e.target.value)}
              style={styles.textarea}
            />
          </div>

          <div style={{ marginTop: '12px', display: 'flex', gap: '10px' }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Save to Offline Wallet
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
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
  title: {
    fontSize: '1.2rem',
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
  formBody: {
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: '700',
    color: 'var(--text-primary)'
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px'
  },
  typeBtn: {
    padding: '8px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  typeBtnActive: {
    padding: '8px',
    borderRadius: '8px',
    background: 'var(--accent-emerald)',
    border: '1px solid var(--accent-emerald)',
    color: '#ffffff',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  input: {
    padding: '9px 12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.88rem'
  },
  select: {
    padding: '9px 12px',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.88rem'
  },
  textarea: {
    padding: '9px 12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-sans)',
    resize: 'vertical'
  },
  labQuickBox: {
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  }
};
