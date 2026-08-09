// Initial Mock Patient Profile & Medical Records Dataset

export const FAMILY_PROFILES = [
  {
    id: "PAT-884920",
    role: "self",
    name: "Alex Morgan",
    relation: "Self (Primary User)",
    dob: "1992-04-12",
    age: 34,
    gender: "Non-Binary / They",
    bloodType: "O Positive (O+)",
    height: "5 ft 10 in (178 cm)",
    weight: "168 lbs (76.2 kg)",
    emergencyContact: {
      name: "Jordan Morgan",
      relation: "Spouse",
      phone: "+1 (555) 234-5678"
    },
    allergies: [
      { name: "Penicillin", severity: "Severe (Anaphylaxis)", dateNoted: "2018-05-10" },
      { name: "Latex", severity: "Moderate (Hives)", dateNoted: "2020-11-04" }
    ],
    activeMedications: [
      "Albuterol Sulfate Inhaler 90mcg (2 puffs PRN wheezing)"
    ],
    chronicConditions: [
      { condition: "Mild Asthma", diagnosed: "2016", status: "Managed" },
      { condition: "Mild Dyslipidemia", diagnosed: "2024", status: "Monitoring" }
    ],
    organDonor: true,
    primaryPhysician: "Dr. Sarah Jenkins, MD (Internal Medicine - Mayo Clinic)",
    insuranceProvider: "BlueCross BlueShield Premier #BC-994812"
  },
  {
    id: "PAT-E-774910",
    role: "parent",
    name: "Eleanor Morgan",
    relation: "Mother (Elderly Parent - 72 Y/O)",
    dob: "1954-08-22",
    age: 72,
    gender: "Female",
    bloodType: "A Positive (A+)",
    height: "5 ft 4 in (162 cm)",
    weight: "142 lbs (64.4 kg)",
    emergencyContact: {
      name: "Alex Morgan",
      relation: "Child / Caregiver",
      phone: "+1 (555) 884-9102"
    },
    allergies: [
      { name: "Sulfa Drugs", severity: "Severe (Rash/Shortness of Breath)", dateNoted: "2010-03-15" }
    ],
    activeMedications: [
      "Lisinopril 10mg Daily (Hypertension)",
      "Metformin 500mg Twice Daily (Type 2 Diabetes)"
    ],
    chronicConditions: [
      { condition: "Hypertension", diagnosed: "2012", status: "Managed" },
      { condition: "Type 2 Diabetes", diagnosed: "2018", status: "Controlled" }
    ],
    organDonor: true,
    primaryPhysician: "Dr. Robert Vance, MD (Geriatrics Specialist)",
    insuranceProvider: "Medicare Part B Gold #MED-449102"
  },
  {
    id: "PAT-L-992140",
    role: "child",
    name: "Liam Morgan",
    relation: "Son (Child - 6 Y/O)",
    dob: "2020-03-10",
    age: 6,
    gender: "Male",
    bloodType: "O Positive (O+)",
    height: "3 ft 8 in (112 cm)",
    weight: "44 lbs (20 kg)",
    emergencyContact: {
      name: "Alex Morgan",
      relation: "Parent",
      phone: "+1 (555) 884-9102"
    },
    allergies: [
      { name: "Peanuts", severity: "Moderate (Hives)", dateNoted: "2022-06-10" }
    ],
    activeMedications: [],
    chronicConditions: [],
    organDonor: false,
    primaryPhysician: "Dr. Emily Thorne, MD (Pediatrics)",
    insuranceProvider: "BlueCross BlueShield Family #BC-994812"
  }
];

export const INITIAL_PATIENT_PROFILE = FAMILY_PROFILES[0];

export const INITIAL_RECORDS = [
  {
    id: "REC-2026-D01",
    title: "Diabetes Report - HbA1c (Ramesh Kumar)",
    type: "lab",
    category: "Lab Result",
    date: "2026-07-15",
    facility: "Metabolic & Diabetes Care Center",
    orderingDoctor: "Dr. K. Sharma, Endocrinologist",
    urgency: "warning",
    summary: "Result: 7.8% (Elevated). Reference: <5.7% Normal, 5.7–6.4% Pre-diabetes, ≥6.5% Diabetes.",
    labMetrics: [
      { name: "HbA1c (Glycated Hemoglobin)", value: 7.8, unit: "%", minRef: 4.0, maxRef: 5.7, status: "high", description: "Reference: < 5.7% Normal, 5.7–6.4% Pre-diabetes, ≥ 6.5% Diabetes" }
    ],
    aiTranslation: "Blood sugar control needs improvement. Doctor's Advice: Recommend low-carb diet, daily walking, and Metformin 500 mg twice daily.",
    tags: ["Diabetes", "HbA1c", "Elevated", "Metformin"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-D02",
    title: "Blood Pressure Monitoring Report (Priya Nair)",
    type: "lab",
    category: "Vitals & Cardiology",
    date: "2026-06-20",
    facility: "Cardiology Health Center",
    orderingDoctor: "Dr. A. Menon, Cardiologist",
    urgency: "warning",
    summary: "Average BP: 148/92 mmHg (Stage 1 Hypertension). Reference: Normal < 120/80 mmHg.",
    labMetrics: [
      { name: "Systolic Blood Pressure", value: 148, unit: "mmHg", minRef: 90, maxRef: 120, status: "high", description: "Normal < 120 mmHg" },
      { name: "Diastolic Blood Pressure", value: 92, unit: "mmHg", minRef: 60, maxRef: 80, status: "high", description: "Normal < 80 mmHg" }
    ],
    aiTranslation: "Stage 1 Hypertension detected (148/92 mmHg). Doctor's Advice: Reduce salt intake, practice yoga, continue Amlodipine 5 mg daily.",
    tags: ["Hypertension", "Blood Pressure", "Cardiology", "Amlodipine"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-D03",
    title: "Cancer Screening - Chest CT Scan (Arjun Menon)",
    type: "scan",
    category: "Radiology & Imaging",
    date: "2026-05-10",
    facility: "Pulmonary & Diagnostic Radiology",
    orderingDoctor: "Dr. S. Nair, Pulmonologist",
    urgency: "warning",
    summary: "Small nodule detected in left lung (5 mm). No evidence of metastasis.",
    imagingDetails: {
      modality: "Chest CT Scan",
      bodyPart: "Left Lung",
      radiologist: "Dr. R. Varma, MD",
      findings: "Small nodule detected in left lung (5 mm). No evidence of metastasis.",
      impression: "Follow-up scan recommended in 6 months.",
      imageType: "ct",
      scanLayers: 4
    },
    aiTranslation: "A small 5 mm nodule was found in the left lung with no signs of cancer spreading. Doctor's Advice: Follow-up scan in 6 months. Avoid smoking and maintain regular checkups.",
    tags: ["CT Scan", "Lung Nodule", "Cancer Screening", "Oncology"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-D04",
    title: "General Health Panel - Lipid Profile (Kavitha S)",
    type: "lab",
    category: "Lab Result",
    date: "2026-07-01",
    facility: "General Diagnostic Pathology Lab",
    orderingDoctor: "Dr. M. Patel, General Physician",
    urgency: "warning",
    summary: "Total Cholesterol: 230 mg/dL (High), LDL: 160 mg/dL (High), HDL: 42 mg/dL (Low).",
    labMetrics: [
      { name: "Total Cholesterol", value: 230, unit: "mg/dL", minRef: 125, maxRef: 200, status: "high", description: "Target < 200 mg/dL" },
      { name: "LDL (Bad Cholesterol)", value: 160, unit: "mg/dL", minRef: 0, maxRef: 100, status: "high", description: "Target < 100 mg/dL" },
      { name: "HDL (Good Cholesterol)", value: 42, unit: "mg/dL", minRef: 50, maxRef: 90, status: "low", description: "Target > 50 mg/dL" }
    ],
    aiTranslation: "Your lipid panel shows high cholesterol and high LDL ('bad' cholesterol). Doctor's Advice: Recommend statin therapy, balanced diet, and regular exercise.",
    tags: ["Lipid Profile", "Cholesterol", "LDL", "Statin Therapy"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-001",
    title: "Comprehensive Lipid & Metabolic Panel",
    type: "lab",
    category: "Lab Result",
    date: "2026-06-18",
    facility: "Quest Diagnostics Labs",
    orderingDoctor: "Dr. Sarah Jenkins, MD",
    urgency: "warning",
    summary: "Elevated Total Cholesterol & LDL. Normal glucose and kidney markers.",
    labMetrics: [
      { name: "Total Cholesterol", value: 215, unit: "mg/dL", minRef: 125, maxRef: 200, status: "high", description: "Combined measure of HDL and LDL cholesterol in your blood." },
      { name: "LDL (Bad Cholesterol)", value: 138, unit: "mg/dL", minRef: 0, maxRef: 100, status: "high", description: "Low-Density Lipoprotein. High levels can build plaque in arteries." },
      { name: "HDL (Good Cholesterol)", value: 52, unit: "mg/dL", minRef: 40, maxRef: 90, status: "normal", description: "High-Density Lipoprotein. Helps remove bad cholesterol from blood." },
      { name: "Triglycerides", value: 135, unit: "mg/dL", minRef: 0, maxRef: 150, status: "normal", description: "Type of fat in your blood used for energy." },
      { name: "HbA1c (Glycated Hb)", value: 5.6, unit: "%", minRef: 4.0, maxRef: 5.7, status: "normal", description: "Average blood sugar levels over the past 3 months." }
    ],
    aiTranslation: "Your blood test shows overall good kidney function and healthy blood sugar. However, your LDL ('bad') cholesterol is slightly elevated at 138 mg/dL (target is under 100 mg/dL). Increasing dietary fiber and aerobic exercise is recommended.",
    tags: ["Cholesterol", "Lipids", "Blood Test", "Routine"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-002",
    title: "Lumbar Spine MRI (T1 & T2 Weighted)",
    type: "scan",
    category: "Radiology & Imaging",
    date: "2026-04-10",
    facility: "Metropolitan Advanced Imaging Center",
    orderingDoctor: "Dr. Marcus Vance, Orthopedic Specialist",
    urgency: "normal",
    summary: "Minor L4-L5 disc bulge without nerve root compression. Intact vertebral alignment.",
    imagingDetails: {
      modality: "MRI (1.5 Tesla)",
      bodyPart: "Lumbar Spine",
      radiologist: "Dr. Elena Rostova, MD",
      findings: "L1-L3 normal disc height and signal. L4-L5 demonstrates mild concentric disc bulge with slight posterior annular tear. No significant spinal canal stenosis.",
      impression: "Mild L4-L5 degenerative disc disease without nerve impingement.",
      imageType: "mri",
      scanLayers: 4
    },
    aiTranslation: "The MRI scan of your lower back shows a minor bulge in the disc between the L4 and L5 vertebrae. Crucially, it is NOT pressing on any spinal nerves. Core exercises recommended.",
    tags: ["MRI", "Spine", "Back Pain", "Radiology"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-003",
    title: "Albuterol Sulfate Inhaler 90mcg (Ventolin HFA)",
    type: "prescription",
    category: "Prescription",
    date: "2026-02-14",
    facility: "CVS Pharmacy #4910",
    prescriber: "Dr. Sarah Jenkins, MD",
    urgency: "normal",
    prescriptionData: {
      drugName: "Albuterol Sulfate (Ventolin HFA)",
      dosage: "90 mcg/actuation",
      instructions: "Inhale 2 puffs every 4-6 hours as needed for shortness of breath or wheezing.",
      quantity: "8.5g inhaler (200 actuations)",
      refillsLeft: 3,
      refillDueDate: "2026-08-14",
      rxNumber: "RX-7749102",
      active: true
    },
    aiTranslation: "Albuterol is a fast-acting bronchodilator. It relaxes muscles in the airways and increases airflow to your lungs during asthma flares.",
    tags: ["Asthma", "Inhaler", "Respiratory"],
    attachmentUrl: null
  },
  {
    id: "REC-2026-004",
    title: "Digital Chest Radiograph (2 Views PA/Lateral)",
    type: "scan",
    category: "Radiology & Imaging",
    date: "2025-11-20",
    facility: "St. Jude Medical Center Radiology",
    orderingDoctor: "Dr. Sarah Jenkins, MD",
    urgency: "normal",
    imagingDetails: {
      modality: "Digital X-Ray",
      bodyPart: "Chest / Lungs",
      radiologist: "Dr. Aris Thorne, MD",
      findings: "Lungs are clear of focal consolidation, effusion, or pneumothorax. Cardiomediastinal silhouette is normal.",
      impression: "Normal 2-view chest radiograph. No acute cardiopulmonary abnormality.",
      imageType: "xray",
      scanLayers: 2
    },
    aiTranslation: "Your chest X-ray came back completely clear! Lungs have no signs of infection or fluid, and your heart size is healthy and normal.",
    tags: ["X-Ray", "Chest", "Lungs"],
    attachmentUrl: null
  },
  {
    id: "REC-2025-005",
    title: "Tdap (Tetanus, Diphtheria, Pertussis) & COVID Booster",
    type: "immunization",
    category: "Immunization",
    date: "2025-09-05",
    facility: "Walgreens Pharmacy #1042",
    administrator: "PharmD Rachel Chang",
    urgency: "normal",
    vaccineData: {
      vaccines: [
        { name: "Tdap (Adacel)", manufacturer: "Sanofi Pasteur", lotNumber: "C8841-A", site: "Left Deltoid" },
        { name: "COVID-19 mRNA Updated", manufacturer: "Pfizer-BioNTech", lotNumber: "FL-9921", site: "Right Deltoid" }
      ],
      nextDueDate: "2035-09-05 (Tdap booster due in 10 yrs)"
    },
    aiTranslation: "You received protection against Tetanus, Diphtheria, Pertussis (Whooping Cough), and updated COVID strains. Next Tdap booster due in 2035.",
    tags: ["Vaccine", "Tdap", "Immunization"],
    attachmentUrl: null
  }
];

export const INITIAL_VITALS_TRENDS = [
  { date: "2025-01-10", sysBP: 122, diaBP: 80, hba1c: 5.7, ldl: 142, hr: 72, weight: 172 },
  { date: "2025-05-15", sysBP: 120, diaBP: 78, hba1c: 5.6, ldl: 140, hr: 70, weight: 170 },
  { date: "2025-09-20", sysBP: 118, diaBP: 76, hba1c: 5.5, ldl: 136, hr: 68, weight: 169 },
  { date: "2026-01-12", sysBP: 116, diaBP: 75, hba1c: 5.6, ldl: 135, hr: 66, weight: 167 },
  { date: "2026-06-18", sysBP: 118, diaBP: 76, hba1c: 5.6, ldl: 138, hr: 68, weight: 168 }
];

export const CONNECTED_PROVIDERS = [
  { id: "epic", name: "Epic MyChart Network", category: "Hospital Network", status: "connected", lastSync: "2026-08-05 14:20" },
  { id: "quest", name: "Quest Diagnostics Direct", category: "Lab & Pathology", status: "connected", lastSync: "2026-06-18 09:15" },
  { id: "cerner", name: "Oracle Cerner Health", category: "EHR System", status: "available", lastSync: null },
  { id: "cvs", name: "CVS Pharmacy Rx", category: "Pharmacy Network", status: "connected", lastSync: "2026-02-14 11:40" }
];
