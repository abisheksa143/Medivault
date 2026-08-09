import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Mic, MicOff, Check, Sparkles } from 'lucide-react';

export default function SmartDobPicker({ value, onChange, label = "Date of Birth", elderMode = false }) {
  const initialDate = value ? new Date(value) : new Date();
  const currentYear = new Date().getFullYear();
  const today = new Date();

  const [selectedDay, setSelectedDay] = useState(initialDate.getDate() || 12);
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth() || 3); // 0-indexed
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear() || 1992);
  const [mode, setMode] = useState('dropdowns'); // 'dropdowns' | 'calendar'
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState('');

  // Month Names
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const yearsArray = Array.from({ length: currentYear - 1919 }, (_, i) => currentYear - i);

  // Age Auto-calculation
  const calculateAge = (year, month, day) => {
    let age = today.getFullYear() - year;
    const m = today.getMonth() - month;
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }
    return Math.max(0, age);
  };

  const computedAge = calculateAge(selectedYear, selectedMonth, selectedDay);

  useEffect(() => {
    const formattedMonth = (selectedMonth + 1).toString().padStart(2, '0');
    const formattedDay = selectedDay.toString().padStart(2, '0');
    const dateStr = `${selectedYear}-${formattedMonth}-${formattedDay}`;
    if (onChange) {
      onChange(dateStr, computedAge);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  // Voice Input Speech Recognition for Senior Accessibility
  const handleStartVoiceDateInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setIsListening(true);
    setVoiceFeedback('Listening... Speak your birth date (e.g., "12 November 1992")');

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      setVoiceFeedback(`Heard: "${transcript}"`);
      setIsListening(false);

      // Parse Voice Date String: e.g. "12 november 1992" or "november 12 1992"
      let foundYear = null;
      let foundMonth = null;
      let foundDay = null;

      // Extract Year (4 digits)
      const yearMatch = transcript.match(/\b(19\d{2}|20\d{2})\b/);
      if (yearMatch) {
        foundYear = parseInt(yearMatch[0], 10);
      }

      // Extract Month
      MONTHS.forEach((m, idx) => {
        if (transcript.includes(m.toLowerCase())) {
          foundMonth = idx;
        }
      });

      // Extract Day (1 to 31)
      const numberMatches = transcript.match(/\b([1-9]|[12]\d|3[01])(st|nd|rd|th)?\b/g);
      if (numberMatches) {
        numberMatches.forEach(numStr => {
          const cleanNum = parseInt(numStr, 10);
          if (cleanNum >= 1 && cleanNum <= 31 && cleanNum !== foundYear) {
            foundDay = cleanNum;
          }
        });
      }

      // Apply recognized fields
      if (foundYear) setSelectedYear(foundYear);
      if (foundMonth !== null) setSelectedMonth(foundMonth);
      if (foundDay) setSelectedDay(foundDay);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setVoiceFeedback('Could not hear clearly. Please try again or tap the dropdowns.');
    };

    recognition.start();
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear()
    );
  };

  return (
    <div style={elderMode ? styles.containerElder : styles.container}>
      <div style={styles.headerRow}>
        <label style={elderMode ? styles.labelElder : styles.label}>
          <Calendar size={elderMode ? 20 : 15} color="var(--accent-cyan)" /> Date of Birth
        </label>

        {/* Calculated Age Display */}
        <span style={elderMode ? styles.ageBadgeElder : styles.ageBadge}>
          🎂 Age: <strong>{computedAge} years</strong>
        </span>
      </div>

      {/* Voice Input Button for Senior Users */}
      <div style={styles.voiceRow}>
        <button
          type="button"
          onClick={handleStartVoiceDateInput}
          className={isListening ? "btn btn-danger btn-sm pulse-red" : "btn btn-cyan btn-sm"}
          style={elderMode ? { padding: '10px 16px', fontSize: '0.95rem' } : {}}
        >
          {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          <span>{isListening ? "Listening..." : "🎙️ Speak Date (Voice Input)"}</span>
        </button>

        {voiceFeedback && (
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontStyle: 'italic' }}>
            {voiceFeedback}
          </span>
        )}
      </div>

      {/* Mode Switcher Buttons */}
      <div style={styles.modeBar}>
        <button
          type="button"
          style={mode === 'dropdowns' ? (elderMode ? styles.modeBtnActiveElder : styles.modeBtnActive) : (elderMode ? styles.modeBtnElder : styles.modeBtn)}
          onClick={() => setMode('dropdowns')}
        >
          Dropdowns (Day | Month | Year)
        </button>
        <button
          type="button"
          style={mode === 'calendar' ? (elderMode ? styles.modeBtnActiveElder : styles.modeBtnActive) : (elderMode ? styles.modeBtnElder : styles.modeBtn)}
          onClick={() => setMode('calendar')}
        >
          Full Calendar View
        </button>
      </div>

      {/* 1. SEPARATE DROPDOWNS VIEW WITH LARGE ELDER TAP TARGETS */}
      {mode === 'dropdowns' && (
        <div style={styles.dropdownsGrid}>
          {/* Day Dropdown */}
          <div style={styles.fieldBox}>
            <span style={elderMode ? styles.fieldLabelElder : styles.fieldLabel}>Day</span>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(Number(e.target.value))}
              style={elderMode ? styles.selectElder : styles.select}
            >
              {daysArray.map(d => (
                <option key={d} value={d} style={styles.optionStyle}>{d}</option>
              ))}
            </select>
          </div>

          {/* Month Dropdown */}
          <div style={styles.fieldBox}>
            <span style={elderMode ? styles.fieldLabelElder : styles.fieldLabel}>Month</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              style={elderMode ? styles.selectElder : styles.select}
            >
              {MONTHS.map((m, idx) => (
                <option key={idx} value={idx} style={styles.optionStyle}>{m}</option>
              ))}
            </select>
          </div>

          {/* Year Dropdown with Quick Jump */}
          <div style={styles.fieldBox}>
            <span style={elderMode ? styles.fieldLabelElder : styles.fieldLabel}>Year (Jump)</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              style={elderMode ? styles.selectElder : styles.select}
            >
              {yearsArray.map(y => (
                <option key={y} value={y} style={styles.optionStyle}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* 2. FULL CALENDAR VIEW WITH HIGHLIGHTED TODAY */}
      {mode === 'calendar' && (
        <div style={styles.calendarContainer} className="glass-panel">
          <div style={styles.calNavHeader}>
            <button
              type="button"
              onClick={() => {
                if (selectedMonth === 0) {
                  setSelectedMonth(11);
                  setSelectedYear(y => y - 1);
                } else {
                  setSelectedMonth(m => m - 1);
                }
              }}
              style={styles.calNavBtn}
            >
              <ChevronLeft size={20} />
            </button>

            <span style={{ fontWeight: 800, fontSize: elderMode ? '1.1rem' : '0.92rem' }}>
              {MONTHS[selectedMonth]} {selectedYear}
            </span>

            <button
              type="button"
              onClick={() => {
                if (selectedMonth === 11) {
                  setSelectedMonth(0);
                  setSelectedYear(y => y + 1);
                } else {
                  setSelectedMonth(m => m + 1);
                }
              }}
              style={styles.calNavBtn}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Calendar Grid Days */}
          <div style={styles.calDaysGrid}>
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d, i) => (
              <span key={i} style={elderMode ? styles.calDayHeaderElder : styles.calDayHeader}>{d}</span>
            ))}
            {daysArray.map(d => {
              const isSelected = d === selectedDay;
              const todayFlag = isToday(d);

              let btnStyle = styles.calDayBtn;
              if (isSelected) btnStyle = styles.calDayBtnActive;
              else if (todayFlag) btnStyle = styles.calDayBtnToday;

              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setSelectedDay(d);
                    setMode('dropdowns');
                  }}
                  style={elderMode ? { ...btnStyle, padding: '12px 6px', fontSize: '1rem', minHeight: '44px' } : btnStyle}
                  title={todayFlag ? "Today's Date" : ""}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    padding: '14px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)'
  },
  containerElder: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '18px',
    borderRadius: '16px',
    background: 'rgba(255, 255, 255, 0.06)',
    border: '2px solid var(--accent-cyan)'
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  labelElder: {
    fontSize: '1.1rem',
    fontWeight: '800',
    color: 'var(--text-primary)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  ageBadge: {
    fontSize: '0.8rem',
    padding: '4px 10px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.15)',
    color: 'var(--accent-emerald)',
    fontWeight: '700'
  },
  ageBadgeElder: {
    fontSize: '1rem',
    padding: '6px 14px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.25)',
    color: 'var(--accent-emerald)',
    fontWeight: '800'
  },
  voiceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '2px'
  },
  modeBar: {
    display: 'flex',
    gap: '6px'
  },
  modeBtn: {
    flex: 1,
    padding: '6px',
    borderRadius: '6px',
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  modeBtnElder: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    background: 'transparent',
    border: '1.5px solid var(--border-color)',
    color: 'var(--text-secondary)',
    fontSize: '0.92rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  modeBtnActive: {
    flex: 1,
    padding: '6px',
    borderRadius: '6px',
    background: 'var(--accent-cyan)',
    border: '1px solid var(--accent-cyan)',
    color: '#ffffff',
    fontSize: '0.78rem',
    fontWeight: '700',
    cursor: 'pointer'
  },
  modeBtnActiveElder: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    background: 'var(--accent-cyan)',
    border: '1.5px solid var(--accent-cyan)',
    color: '#ffffff',
    fontSize: '0.92rem',
    fontWeight: '800',
    cursor: 'pointer'
  },
  dropdownsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr 1.5fr',
    gap: '8px',
    marginTop: '4px'
  },
  fieldBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  fieldLabel: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)'
  },
  fieldLabelElder: {
    fontSize: '0.9rem',
    color: 'var(--text-primary)',
    fontWeight: '700'
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    outline: 'none',
    cursor: 'pointer'
  },
  selectElder: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    background: 'rgba(15, 23, 42, 0.95)',
    border: '2px solid var(--accent-cyan)',
    color: '#ffffff',
    fontSize: '1.1rem',
    fontWeight: '700',
    outline: 'none',
    cursor: 'pointer',
    minHeight: '48px'
  },
  optionStyle: {
    background: '#0f172a',
    color: '#f8fafc'
  },
  calendarContainer: {
    padding: '14px',
    borderRadius: '12px',
    marginTop: '4px'
  },
  calNavHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '10px'
  },
  calNavBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '6px'
  },
  calDaysGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
    textAlign: 'center'
  },
  calDayHeader: {
    fontSize: '0.72rem',
    color: 'var(--text-muted)',
    fontWeight: '700'
  },
  calDayHeaderElder: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
    fontWeight: '800'
  },
  calDayBtn: {
    padding: '8px',
    borderRadius: '6px',
    background: 'rgba(255, 255, 255, 0.04)',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    cursor: 'pointer'
  },
  calDayBtnActive: {
    padding: '8px',
    borderRadius: '6px',
    background: 'var(--accent-emerald)',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.82rem',
    fontWeight: '800',
    cursor: 'pointer'
  },
  calDayBtnToday: {
    padding: '8px',
    borderRadius: '6px',
    background: 'rgba(6, 182, 212, 0.25)',
    border: '1.5px solid var(--accent-cyan)',
    color: 'var(--accent-cyan)',
    fontSize: '0.82rem',
    fontWeight: '800',
    cursor: 'pointer'
  }
};
