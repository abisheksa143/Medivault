import React, { useState } from 'react';
import { 
  X, Activity, Heart, Wind, Stethoscope, Ribbon, Brain, ShieldCheck, 
  TrendingDown, TrendingUp, CheckCircle2, AlertTriangle, Utensils, Pill, 
  Calendar, Award, Sparkles 
} from 'lucide-react';

import ConditionAdviceBox from './ConditionAdviceBox';

export default function DiseaseCareCenterModal({ patientProfile, onClose }) {
  const [activeCondition, setActiveCondition] = useState('diabetes');

  // Adherence state simulation
  const [adherenceLogged, setAdherenceLogged] = useState(true);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <Stethoscope size={24} color="var(--accent-emerald)" />
            </div>
            <div>
              <h2 style={styles.title}>Disease-Specific Care & Health Center</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Tailored Condition Workspaces • Food Guidance • Adherence • Specialized Insights
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Condition Selector Tabs */}
        <div style={styles.conditionTabs}>
          {[
            { id: 'diabetes', label: 'Diabetes Care', icon: Activity, color: '#06b6d4' },
            { id: 'cardio', label: 'Heart & BP', icon: Heart, color: '#ef4444' },
            { id: 'respiratory', label: 'Asthma & Lung', icon: Wind, color: '#10b981' },
            { id: 'kidney_liver', label: 'Kidney & Liver', icon: Stethoscope, color: '#f59e0b' },
            { id: 'cancer', label: 'Oncology Care', icon: Ribbon, color: '#ec4899' },
            { id: 'neuro', label: 'Neurological', icon: Brain, color: '#8b5cf6' },
            { id: 'preventive', label: 'General Preventive', icon: ShieldCheck, color: '#3b82f6' }
          ].map((item) => {
            const IconComp = item.icon;
            const isSelected = activeCondition === item.id;
            return (
              <button
                key={item.id}
                style={isSelected ? { ...styles.condTabActive, borderColor: item.color } : styles.condTab}
                onClick={() => setActiveCondition(item.id)}
              >
                <IconComp size={15} color={isSelected ? item.color : 'var(--text-muted)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Condition Workspace Body */}
        <div style={styles.modalBody}>
          {/* Dynamic Condition-Specific Advice Box (Foods to Eat, Foods to Avoid, Exercises) */}
          <ConditionAdviceBox 
            tags={[
              activeCondition === 'diabetes' ? 'Diabetes' :
              activeCondition === 'cardio' ? 'Hypertension' :
              activeCondition === 'cancer' ? 'Cancer' : 'Lipids'
            ]}
            title={activeCondition}
          />
          {/* 1. DIABETES CARE WORKSPACE */}
          {activeCondition === 'diabetes' && (
            <div style={styles.workspaceContainer}>
              {/* Smart AI Insight Box */}
              <div style={styles.aiInsightBox}>
                <Sparkles size={20} color="var(--accent-emerald)" />
                <div>
                  <h4 style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', fontWeight: 700 }}>
                    AI Diabetes Insight: 10% Glucose Improvement
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    "Your average fasting blood sugar is <strong>98 mg/dL</strong> (down 10% this month). 0 dangerous hypoglycemic dips detected in the past 30 days."
                  </p>
                </div>
              </div>

              {/* Grid 2 Columns */}
              <div style={styles.twoColumnGrid}>
                {/* Column 1: Food & Nutrition Guidance */}
                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Utensils size={16} color="var(--accent-cyan)" />
                    <span>Diabetic Food & Nutrition Guidance</span>
                  </h4>
                  <div style={styles.nutritionList}>
                    <div style={styles.foodGood}>
                      <strong>🟢 Recommended Meals:</strong> Low-carb spinach omelet, avocado salad, grilled salmon, quinoa bowl.
                    </div>
                    <div style={styles.foodAvoid}>
                      <strong>🔴 Foods to Avoid:</strong> Sugary sodas, white bread, refined pastries, high-fructose juices.
                    </div>
                  </div>
                </div>

                {/* Column 2: Insulin & Medication Adherence */}
                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Pill size={16} color="var(--accent-emerald)" />
                    <span>Medication & Insulin Adherence</span>
                  </h4>
                  <div style={styles.adherenceBox}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Monthly Dose Adherence</span>
                      <strong style={{ fontSize: '1.1rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>96% On-Time</strong>
                    </div>

                    <div style={styles.adherenceStatusRow}>
                      <span style={{ fontSize: '0.82rem' }}>Today's Scheduled Insulin / Metformin:</span>
                      <button
                        onClick={() => setAdherenceLogged(!adherenceLogged)}
                        className={adherenceLogged ? "btn btn-primary btn-sm" : "btn btn-secondary btn-sm"}
                      >
                        <CheckCircle2 size={14} />
                        <span>{adherenceLogged ? "Dose Logged ✓" : "Mark Taken"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctor & HbA1c Checkup Recommendation */}
              <div style={styles.recommendationBanner}>
                <Calendar size={18} color="var(--accent-cyan)" />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  <strong>Endocrinologist Alert:</strong> Next quarterly HbA1c blood test is due in 3 weeks. Recommended Doctor: <strong>Dr. Sarah Jenkins, MD</strong>.
                </span>
              </div>
            </div>
          )}

          {/* 2. CARDIOVASCULAR WORKSPACE */}
          {activeCondition === 'cardio' && (
            <div style={styles.workspaceContainer}>
              <div style={styles.aiInsightBox}>
                <TrendingDown size={20} color="var(--accent-emerald)" />
                <div>
                  <h4 style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', fontWeight: 700 }}>
                    Cardiovascular Progress: BP Down 5 Points
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    "Your average Blood Pressure is down to <strong>118/76 mmHg</strong> this month. Rest heart rate remains optimal at 68 bpm."
                  </p>
                </div>
              </div>

              <div style={styles.twoColumnGrid}>
                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Heart size={16} color="var(--accent-crimson)" />
                    <span>Heart-Healthy Lifestyle Plan</span>
                  </h4>
                  <ul style={styles.bulletList}>
                    <li>🧂 <strong>Low-Sodium Diet:</strong> Keep daily salt intake under 1,500 mg.</li>
                    <li>🏃 <strong>Aerobic Walking:</strong> 30 minutes daily brisk walk target (Completed 5/7 days).</li>
                    <li>🍷 Limit alcohol and maintain consistent sleep hygiene.</li>
                  </ul>
                </div>

                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Pill size={16} color="var(--accent-emerald)" />
                    <span>BP Medication Tracker</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Lisinopril 10mg — Taken daily at 08:00 AM.
                  </p>
                  <span style={styles.badgeSuccess}>✓ 100% Weekly Adherence</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. ASTHMA & RESPIRATORY WORKSPACE */}
          {activeCondition === 'respiratory' && (
            <div style={styles.workspaceContainer}>
              <div style={styles.aiInsightBox}>
                <Wind size={20} color="var(--accent-cyan)" />
                <div>
                  <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', fontWeight: 700 }}>
                    Respiratory Status: Well Controlled
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    "Albuterol inhaler usage averaged 1.2 puffs/week. No severe acute flare-ups recorded in the past 60 days."
                  </p>
                </div>
              </div>

              <div style={styles.twoColumnGrid}>
                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Wind size={16} color="var(--accent-emerald)" />
                    <span>Trigger Avoidance & Breathing Guide</span>
                  </h4>
                  <ul style={styles.bulletList}>
                    <li>🌿 High pollen count forecasted today — keep windows closed.</li>
                    <li>🧘 Practice 4-7-8 diaphragmatic breathing exercises twice daily.</li>
                    <li>💨 Pre-medicate 15 mins before cold-weather exercise.</li>
                  </ul>
                </div>

                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Activity size={16} color="var(--accent-cyan)" />
                    <span>Peak Flow & Inhaler Refill Tracker</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Ventolin HFA 90mcg: <strong>142 / 200 actuations remaining</strong>.
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Refill due date: August 14, 2026.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 4. KIDNEY & LIVER WORKSPACE */}
          {activeCondition === 'kidney_liver' && (
            <div style={styles.workspaceContainer}>
              <div style={styles.aiInsightBox}>
                <Stethoscope size={20} color="var(--accent-amber)" />
                <div>
                  <h4 style={{ color: 'var(--accent-amber)', fontSize: '0.95rem', fontWeight: 700 }}>
                    Renal & Hepatic Marker Stability
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    "Serum Creatinine <strong>0.9 mg/dL</strong> (Normal) • ALT / AST Liver Enzymes within healthy baseline."
                  </p>
                </div>
              </div>

              <div style={styles.cardBox} className="glass-panel">
                <h4 style={styles.cardHeaderTitle}>
                  <ShieldCheck size={16} color="var(--accent-emerald)" />
                  <span>Hydration & Diet Restrictions</span>
                </h4>
                <ul style={styles.bulletList}>
                  <li>💧 Drink at least 2.5 Liters of water daily to maintain renal clearance.</li>
                  <li>🚫 Avoid over-the-counter NSAIDs (Ibuprofen) without consulting physician.</li>
                  <li>🥦 Monitor protein intake to avoid excess renal strain.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 5. ONCOLOGY / CANCER CARE WORKSPACE */}
          {activeCondition === 'cancer' && (
            <div style={styles.workspaceContainer}>
              <div style={styles.aiInsightBox}>
                <Ribbon size={20} color="#ec4899" />
                <div>
                  <h4 style={{ color: '#ec4899', fontSize: '0.95rem', fontWeight: 700 }}>
                    Oncology Treatment & Scan Center
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Organize chemotherapy schedules, biopsy findings, tumor scan comparisons, and nutrition support.
                  </p>
                </div>
              </div>

              <div style={styles.twoColumnGrid}>
                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Calendar size={16} color="#ec4899" />
                    <span>Therapy Cycles & Scans</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    • Annual Follow-up MRI: <strong>Clear / Stable</strong><br />
                    • Next Routine Surveillance Scan: November 2026
                  </p>
                </div>

                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Utensils size={16} color="var(--accent-emerald)" />
                    <span>Oncology Nutrition Support</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    High-protein smoothies, ginger tea for nausea management, hydrated meal plans.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 6. NEUROLOGICAL WORKSPACE */}
          {activeCondition === 'neuro' && (
            <div style={styles.workspaceContainer}>
              <div style={styles.aiInsightBox}>
                <Brain size={20} color="#8b5cf6" />
                <div>
                  <h4 style={{ color: '#8b5cf6', fontSize: '0.95rem', fontWeight: 700 }}>
                    Neurological Care & Caregiver Hub
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Track cognitive exercise routines, physical therapy sessions, and caregiver access.
                  </p>
                </div>
              </div>

              <div style={styles.cardBox} className="glass-panel">
                <h4 style={styles.cardHeaderTitle}>
                  <Brain size={16} color="#8b5cf6" />
                  <span>Cognitive Memory Exercises & Notes</span>
                </h4>
                <ul style={styles.bulletList}>
                  <li>🧩 Daily 15-minute memory puzzle completed.</li>
                  <li>👨‍👩‍👧 Caregiver Access Enabled for: <strong>Jordan Morgan (Spouse)</strong>.</li>
                  <li>💊 Pill dispenser alarm active for morning/evening doses.</li>
                </ul>
              </div>
            </div>
          )}

          {/* 7. GENERAL PREVENTIVE HEALTH WORKSPACE */}
          {activeCondition === 'preventive' && (
            <div style={styles.workspaceContainer}>
              <div style={styles.aiInsightBox}>
                <ShieldCheck size={20} color="#3b82f6" />
                <div>
                  <h4 style={{ color: '#3b82f6', fontSize: '0.95rem', fontWeight: 700 }}>
                    Preventive Health & Vaccination Tracker
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Annual health checkup reminders, immunization schedules, and wellness targets.
                  </p>
                </div>
              </div>

              <div style={styles.twoColumnGrid}>
                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <CheckCircle2 size={16} color="var(--accent-emerald)" />
                    <span>Vaccination Status</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    • Tdap Booster: Up to date (Next due 2035)<br />
                    • COVID mRNA Booster: Up to date (Sept 2025)
                  </p>
                </div>

                <div style={styles.cardBox} className="glass-panel">
                  <h4 style={styles.cardHeaderTitle}>
                    <Award size={16} color="var(--accent-amber)" />
                    <span>Annual Wellness Goals</span>
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    • Annual Physical Exam: Scheduled<br />
                    • Dental Checkup: Completed (May 2026)
                  </p>
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
  conditionTabs: {
    display: 'flex',
    gap: '6px',
    padding: '12px 24px',
    overflowX: 'auto',
    background: 'rgba(0, 0, 0, 0.2)',
    borderBottom: '1px solid var(--border-color)'
  },
  condTab: {
    padding: '8px 14px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.82rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  },
  condTabActive: {
    padding: '8px 14px',
    borderRadius: '99px',
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1.5px solid var(--accent-cyan)',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    whiteSpace: 'nowrap'
  },
  modalBody: {
    padding: '24px'
  },
  workspaceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  aiInsightBox: {
    padding: '16px 20px',
    borderRadius: '14px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '14px'
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px'
  },
  cardBox: {
    padding: '18px 20px',
    borderRadius: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  cardHeaderTitle: {
    fontSize: '0.92rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  nutritionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '0.85rem'
  },
  foodGood: {
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(16, 185, 129, 0.1)',
    color: 'var(--text-primary)'
  },
  foodAvoid: {
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: 'var(--text-primary)'
  },
  adherenceBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  adherenceStatusRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '6px',
    padding: '10px 12px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.03)'
  },
  recommendationBanner: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  bulletList: {
    paddingLeft: '18px',
    fontSize: '0.85rem',
    lineHeight: '1.7',
    color: 'var(--text-secondary)'
  },
  badgeSuccess: {
    display: 'inline-block',
    fontSize: '0.75rem',
    padding: '4px 10px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--accent-emerald)',
    fontWeight: '700'
  }
};
