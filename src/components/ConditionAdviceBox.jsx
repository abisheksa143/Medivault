import React from 'react';
import { Utensils, XCircle, CheckCircle2, Activity, Sparkles, ShieldAlert } from 'lucide-react';

export const CONDITION_ADVICE_DATABASE = {
  diabetes: {
    title: "Diabetes & Blood Sugar Care",
    tag: "#Diabetes",
    color: "#10b981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    borderColor: "rgba(16, 185, 129, 0.3)",
    foodsToEat: ["Millets & oats (high fiber)", "Leafy green vegetables & broccoli", "Lentils, chickpeas & legumes", "Nuts & seeds (almonds, chia)"],
    foodsToAvoid: ["Sweets & refined sugar", "Soda, fruit juices & sugary drinks", "White bread, maida & polished rice", "Deep-fried snacks"],
    exercises: ["30 minutes daily brisk walking", "Light resistance & band exercises", "Post-meal 10-minute short walks"]
  },
  hypertension: {
    title: "Blood Pressure & Heart Care",
    tag: "#Hypertension",
    color: "#06b6d4",
    bgColor: "rgba(6, 182, 212, 0.1)",
    borderColor: "rgba(6, 182, 212, 0.3)",
    foodsToEat: ["Potassium-rich foods (bananas, spinach)", "Garlic & beetroot juice", "Whole grains & unsalted seeds", "Low-fat dairy & yogurt"],
    foodsToAvoid: ["High-salt foods & extra table salt", "Pickles, papads & processed sauces", "Canned soups & salty chips", "Excess caffeine & alcohol"],
    exercises: ["Pranayama & deep breathing exercises", "Yoga (Anulom Vilom, Shavasana)", "30-45 minutes moderate walking"]
  },
  cholesterol: {
    title: "Lipids & Heart Health",
    tag: "#Lipids",
    color: "#f59e0b",
    bgColor: "rgba(245, 158, 11, 0.1)",
    borderColor: "rgba(245, 158, 11, 0.3)",
    foodsToEat: ["Soluble fiber (oats, barley, apples)", "Omega-3 rich foods (walnuts, flaxseeds)", "Olive oil & avocado", "Green tea"],
    foodsToAvoid: ["Deep-fried foods & trans fats", "Butter, ghee & heavy cream", "High-fat red meats", "Bakery items & palm oil"],
    exercises: ["Aerobic exercises & cycling", "45 minutes brisk walking 4x a week", "Stair climbing & swimming"]
  },
  cancer: {
    title: "Cancer Recovery & Immunity Care",
    tag: "#Cancer",
    color: "#6366f1",
    bgColor: "rgba(99, 102, 241, 0.1)",
    borderColor: "rgba(99, 102, 241, 0.3)",
    foodsToEat: ["High-protein foods (eggs, tofu, lentils)", "Antioxidant-rich berries & pomegranates", "Cooked vegetables & warm soups", "Turmeric & ginger tea"],
    foodsToAvoid: ["Processed & ultra-processed meats", "Raw or unpasteurized foods", "Excess refined sugar", "Alcohol & tobacco/smoking"],
    exercises: ["Gentle stretching & range of motion", "Light 15-minute daily walks", "Guided relaxation & deep breathing"]
  }
};

export default function ConditionAdviceBox({ tags = [], labMetrics = [], title = "" }) {
  // Determine matched conditions
  const matchedAdviceList = [];

  const textToSearch = (title + " " + tags.join(" ")).toLowerCase();

  // Check lab values if available
  const hasHighSugar = labMetrics?.some(m => m.name.toLowerCase().includes("hba1c") || m.name.toLowerCase().includes("glucose")) && labMetrics.some(m => m.status === 'high');
  const hasHighBP = labMetrics?.some(m => m.name.toLowerCase().includes("pressure") || m.name.toLowerCase().includes("systolic") || m.name.toLowerCase().includes("diastolic")) && labMetrics.some(m => m.status === 'high');
  const hasHighLipids = labMetrics?.some(m => m.name.toLowerCase().includes("cholesterol") || m.name.toLowerCase().includes("ldl")) && labMetrics.some(m => m.status === 'high');

  if (textToSearch.includes("diabet") || textToSearch.includes("hba1c") || textToSearch.includes("sugar") || hasHighSugar) {
    matchedAdviceList.push(CONDITION_ADVICE_DATABASE.diabetes);
  }
  if (textToSearch.includes("hypertens") || textToSearch.includes("pressure") || textToSearch.includes("bp") || hasHighBP) {
    matchedAdviceList.push(CONDITION_ADVICE_DATABASE.hypertension);
  }
  if (textToSearch.includes("cholesterol") || textToSearch.includes("lipid") || textToSearch.includes("ldl") || hasHighLipids) {
    matchedAdviceList.push(CONDITION_ADVICE_DATABASE.cholesterol);
  }
  if (textToSearch.includes("cancer") || textToSearch.includes("nodule") || textToSearch.includes("tumor") || textToSearch.includes("ct scan")) {
    matchedAdviceList.push(CONDITION_ADVICE_DATABASE.cancer);
  }

  // Fallback to diabetes & cholesterol if no direct match but has warning
  if (matchedAdviceList.length === 0) {
    matchedAdviceList.push(CONDITION_ADVICE_DATABASE.diabetes);
  }

  return (
    <div style={styles.container}>
      {matchedAdviceList.map((advice, index) => (
        <div 
          key={index} 
          style={{ 
            ...styles.card, 
            background: advice.bgColor, 
            borderColor: advice.borderColor 
          }}
        >
          {/* Card Header */}
          <div style={styles.cardHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color={advice.color} />
              <h4 style={{ ...styles.cardTitle, color: advice.color }}>
                Condition-Specific Advice: {advice.title}
              </h4>
            </div>
            <span style={{ ...styles.tagBadge, color: advice.color, borderColor: advice.borderColor }}>
              {advice.tag}
            </span>
          </div>

          {/* 3 Pillars: Foods to Eat, Foods to Avoid, Exercises */}
          <div style={styles.grid} className="condition-advice-grid">
            {/* Foods to Eat */}
            <div style={styles.columnEat}>
              <div style={styles.columnHeader}>
                <CheckCircle2 size={16} color="#10b981" />
                <span style={{ color: '#34d399', fontWeight: 700 }}>✅ Foods to Eat</span>
              </div>
              <ul style={styles.list}>
                {advice.foodsToEat.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div style={styles.columnAvoid}>
              <div style={styles.columnHeader}>
                <XCircle size={16} color="#ef4444" />
                <span style={{ color: '#f87171', fontWeight: 700 }}>❌ Foods to Avoid</span>
              </div>
              <ul style={styles.list}>
                {advice.foodsToAvoid.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Recommended Exercises */}
            <div style={styles.columnExercise}>
              <div style={styles.columnHeader}>
                <Activity size={16} color="#06b6d4" />
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>🏃 Physical Exercises</span>
              </div>
              <ul style={styles.list}>
                {advice.exercises.map((item, i) => (
                  <li key={i} style={styles.listItem}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginTop: '12px'
  },
  card: {
    padding: '16px 18px',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid',
    backdropFilter: 'blur(10px)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px'
  },
  cardTitle: {
    fontSize: '0.98rem',
    fontWeight: 800
  },
  tagBadge: {
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '3px 10px',
    borderRadius: '99px',
    border: '1px solid',
    background: 'rgba(0, 0, 0, 0.2)',
    fontFamily: 'var(--font-mono)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px'
  },
  columnEat: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.2)'
  },
  columnAvoid: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.2)'
  },
  columnExercise: {
    padding: '12px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(6, 182, 212, 0.08)',
    border: '1px solid rgba(6, 182, 212, 0.2)'
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.84rem',
    marginBottom: '8px'
  },
  list: {
    paddingLeft: '16px',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  listItem: {
    fontSize: '0.78rem',
    color: 'var(--text-primary)',
    lineHeight: '1.4'
  }
};
