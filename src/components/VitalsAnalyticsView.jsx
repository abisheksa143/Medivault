import React, { useState } from 'react';
import { 
  X, Activity, Heart, LineChart, TrendingUp, TrendingDown, 
  PlusCircle, AlertCircle, Calendar, CheckCircle2 
} from 'lucide-react';

export default function VitalsAnalyticsView({ vitalsHistory, onAddVital, onClose }) {
  const [selectedMetric, setSelectedMetric] = useState('bp');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Vital Form State
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [sysBP, setSysBP] = useState(120);
  const [diaBP, setDiaBP] = useState(80);
  const [hba1c, setHba1c] = useState(5.6);
  const [ldl, setLdl] = useState(135);
  const [hr, setHr] = useState(70);
  const [weight, setWeight] = useState(168);

  const latest = vitalsHistory[vitalsHistory.length - 1] || {};

  const handleSaveVital = (e) => {
    e.preventDefault();
    onAddVital({
      date: newDate,
      sysBP: Number(sysBP),
      diaBP: Number(diaBP),
      hba1c: Number(hba1c),
      ldl: Number(ldl),
      hr: Number(hr),
      weight: Number(weight)
    });
    setShowAddModal(false);
  };

  // Helper to render interactive SVG Trend Chart
  const renderChart = () => {
    const width = 640;
    const height = 220;
    const padding = 40;

    let points = [];
    let yMin = 0;
    let yMax = 100;
    let labelUnit = '';

    if (selectedMetric === 'bp') {
      yMin = 60;
      yMax = 160;
      labelUnit = 'mmHg';
      points = vitalsHistory.map((v, i) => ({
        x: padding + (i * (width - padding * 2)) / (vitalsHistory.length - 1 || 1),
        ySys: height - padding - ((v.sysBP - yMin) / (yMax - yMin)) * (height - padding * 2),
        yDia: height - padding - ((v.diaBP - yMin) / (yMax - yMin)) * (height - padding * 2),
        date: v.date,
        valText: `${v.sysBP}/${v.diaBP}`
      }));
    } else if (selectedMetric === 'ldl') {
      yMin = 90;
      yMax = 170;
      labelUnit = 'mg/dL';
      points = vitalsHistory.map((v, i) => ({
        x: padding + (i * (width - padding * 2)) / (vitalsHistory.length - 1 || 1),
        y: height - padding - ((v.ldl - yMin) / (yMax - yMin)) * (height - padding * 2),
        date: v.date,
        valText: `${v.ldl} mg/dL`
      }));
    } else if (selectedMetric === 'hba1c') {
      yMin = 4.0;
      yMax = 7.0;
      labelUnit = '%';
      points = vitalsHistory.map((v, i) => ({
        x: padding + (i * (width - padding * 2)) / (vitalsHistory.length - 1 || 1),
        y: height - padding - ((v.hba1c - yMin) / (yMax - yMin)) * (height - padding * 2),
        date: v.date,
        valText: `${v.hba1c}%`
      }));
    } else {
      // Heart Rate
      yMin = 50;
      yMax = 100;
      labelUnit = 'bpm';
      points = vitalsHistory.map((v, i) => ({
        x: padding + (i * (width - padding * 2)) / (vitalsHistory.length - 1 || 1),
        y: height - padding - ((v.hr - yMin) / (yMax - yMin)) * (height - padding * 2),
        date: v.date,
        valText: `${v.hr} bpm`
      }));
    }

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Horizontal grid lines */}
        {[0, 0.33, 0.66, 1].map((pct, idx) => {
          const y = padding + pct * (height - padding * 2);
          const valLabel = Math.round(yMax - pct * (yMax - yMin));
          return (
            <g key={idx}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
              <text x={padding - 8} y={y + 4} fill="var(--text-muted)" fontSize="10" textAnchor="end" fontFamily="var(--font-mono)">
                {valLabel}
              </text>
            </g>
          );
        })}

        {/* BP Dual Line */}
        {selectedMetric === 'bp' ? (
          <>
            {/* Systolic Line */}
            <path
              d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.ySys}`).join(' ')}
              fill="none"
              stroke="var(--accent-crimson)"
              strokeWidth="3"
            />
            {/* Diastolic Line */}
            <path
              d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yDia}`).join(' ')}
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth="3"
            />
            {/* Data Circles */}
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.ySys} r="5" fill="var(--accent-crimson)" stroke="#fff" strokeWidth="2" />
                <circle cx={p.x} cy={p.yDia} r="5" fill="var(--accent-cyan)" stroke="#fff" strokeWidth="2" />
                <text x={p.x} y={height - 10} fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                  {p.date.substring(5)}
                </text>
              </g>
            ))}
          </>
        ) : (
          /* Single Line Chart */
          <>
            <path
              d={points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
              fill="none"
              stroke="var(--accent-emerald)"
              strokeWidth="3"
            />
            {points.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="var(--accent-emerald)" stroke="#fff" strokeWidth="2" />
                <text x={p.x} y={p.y - 12} fill="var(--accent-emerald)" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--font-mono)">
                  {p.valText}
                </text>
                <text x={p.x} y={height - 10} fill="var(--text-muted)" fontSize="10" textAnchor="middle" fontFamily="var(--font-mono)">
                  {p.date.substring(5)}
                </text>
              </g>
            ))}
          </>
        )}
      </svg>
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <LineChart size={24} color="var(--accent-cyan)" />
            </div>
            <div>
              <h2 style={styles.title}>Vitals & Health Metrics Analytics</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Longitudinal tracking of Blood Pressure, HbA1c, LDL & Resting Heart Rate.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> Log Vital Reading
            </button>
            <button onClick={onClose} style={styles.closeBtn}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div style={styles.modalBody}>
          {/* Quick Metrics Summary Cards */}
          <div style={styles.cardsGrid}>
            <div
              style={selectedMetric === 'bp' ? styles.metricCardActive : styles.metricCard}
              onClick={() => setSelectedMetric('bp')}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Blood Pressure</span>
                <Heart size={16} color="var(--accent-crimson)" />
              </div>
              <div style={styles.cardVal}>{latest.sysBP}/{latest.diaBP} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>mmHg</span></div>
              <div style={styles.cardTrend}>
                <TrendingDown size={14} color="var(--accent-emerald)" /> Optimal Range (&lt;120/80)
              </div>
            </div>

            <div
              style={selectedMetric === 'ldl' ? styles.metricCardActive : styles.metricCard}
              onClick={() => setSelectedMetric('ldl')}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>LDL Cholesterol</span>
                <Activity size={16} color="var(--accent-amber)" />
              </div>
              <div style={styles.cardVal}>{latest.ldl} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>mg/dL</span></div>
              <div style={styles.cardTrendWarning}>
                <TrendingUp size={14} color="var(--accent-amber)" /> Mild Elevation (&gt;100)
              </div>
            </div>

            <div
              style={selectedMetric === 'hba1c' ? styles.metricCardActive : styles.metricCard}
              onClick={() => setSelectedMetric('hba1c')}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>HbA1c Blood Sugar</span>
                <LineChart size={16} color="var(--accent-emerald)" />
              </div>
              <div style={styles.cardVal}>{latest.hba1c}%</div>
              <div style={styles.cardTrend}>
                <CheckCircle2 size={14} color="var(--accent-emerald)" /> Normal (&lt;5.7%)
              </div>
            </div>

            <div
              style={selectedMetric === 'hr' ? styles.metricCardActive : styles.metricCard}
              onClick={() => setSelectedMetric('hr')}
            >
              <div style={styles.cardHeader}>
                <span style={styles.cardTitle}>Resting Heart Rate</span>
                <Activity size={16} color="var(--accent-cyan)" />
              </div>
              <div style={styles.cardVal}>{latest.hr} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>bpm</span></div>
              <div style={styles.cardTrend}>
                <CheckCircle2 size={14} color="var(--accent-emerald)" /> Healthy Resting Pace
              </div>
            </div>
          </div>

          {/* SVG Graph Container */}
          <div style={styles.chartContainer} className="glass-panel">
            <div style={styles.chartHeader}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                {selectedMetric === 'bp' && 'Blood Pressure Trend (Systolic & Diastolic)'}
                {selectedMetric === 'ldl' && 'LDL Cholesterol History (mg/dL)'}
                {selectedMetric === 'hba1c' && 'HbA1c Glycated Hemoglobin History (%)'}
                {selectedMetric === 'hr' && 'Resting Heart Rate Trend (bpm)'}
              </h3>
              {selectedMetric === 'bp' && (
                <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--accent-crimson)', fontWeight: 600 }}>● Systolic (Top)</span>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>● Diastolic (Bottom)</span>
                </div>
              )}
            </div>

            <div style={{ marginTop: '16px' }}>
              {renderChart()}
            </div>
          </div>

          {/* Add Vital Reading Sub-Modal */}
          {showAddModal && (
            <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
                <div style={styles.header}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Log New Vitals Reading</h3>
                  <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}>
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSaveVital} style={styles.formBody}>
                  <div style={styles.formGroup}>
                    <label>Reading Date</label>
                    <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required style={styles.input} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={styles.formGroup}>
                      <label>Systolic BP (mmHg)</label>
                      <input type="number" value={sysBP} onChange={(e) => setSysBP(e.target.value)} required style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                      <label>Diastolic BP (mmHg)</label>
                      <input type="number" value={diaBP} onChange={(e) => setDiaBP(e.target.value)} required style={styles.input} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={styles.formGroup}>
                      <label>LDL Cholesterol (mg/dL)</label>
                      <input type="number" value={ldl} onChange={(e) => setLdl(e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                      <label>HbA1c (%)</label>
                      <input type="number" step="0.1" value={hba1c} onChange={(e) => setHba1c(e.target.value)} style={styles.input} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={styles.formGroup}>
                      <label>Resting HR (bpm)</label>
                      <input type="number" value={hr} onChange={(e) => setHr(e.target.value)} style={styles.input} />
                    </div>
                    <div style={styles.formGroup}>
                      <label>Weight (lbs)</label>
                      <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} style={styles.input} />
                    </div>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                      Save Reading
                    </button>
                    <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </form>
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
    background: 'rgba(6, 182, 212, 0.12)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
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
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
    gap: '12px'
  },
  metricCard: {
    padding: '16px',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  metricCardActive: {
    padding: '16px',
    borderRadius: '14px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid var(--accent-cyan)',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(6, 182, 212, 0.2)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cardTitle: {
    fontSize: '0.82rem',
    color: 'var(--text-secondary)',
    fontWeight: '600'
  },
  cardVal: {
    fontSize: '1.4rem',
    fontWeight: '800',
    fontFamily: 'var(--font-mono)',
    color: 'var(--text-primary)',
    marginTop: '6px'
  },
  cardTrend: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--accent-emerald)',
    marginTop: '4px',
    fontWeight: '600'
  },
  cardTrendWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '0.75rem',
    color: 'var(--accent-amber)',
    marginTop: '4px',
    fontWeight: '600'
  },
  chartContainer: {
    padding: '24px'
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  input: {
    padding: '9px 12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.9rem'
  }
};
