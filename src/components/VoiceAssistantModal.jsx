import React, { useState, useEffect } from 'react';
import { X, Mic, MicOff, Sparkles, CheckCircle2, AlertCircle, Volume2 } from 'lucide-react';

export default function VoiceAssistantModal({ onExecuteCommand, onClose }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Click microphone and speak a command...');

  useEffect(() => {
    startSpeechRecognition();
  }, []);

  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setFeedback("Speech Recognition API not supported in browser. Use sample command buttons below.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback("Listening... Speak now.");
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        processCommand(text);
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setFeedback(`Voice input error: ${event.error}. Try clicking sample commands below.`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      setIsListening(false);
      setFeedback("Voice assistant ready. Try sample commands below.");
    }
  };

  const processCommand = (cmdText) => {
    const text = cmdText.toLowerCase();
    if (text.includes("blood test") || text.includes("lab") || text.includes("cholesterol")) {
      setFeedback("✅ Executing: Filtering last blood test & lab results...");
      setTimeout(() => {
        onExecuteCommand({ action: 'filter_labs' });
        onClose();
      }, 1000);
    } else if (text.includes("prescription") || text.includes("medicine") || text.includes("add")) {
      setFeedback("✅ Executing: Opening Add Prescription / Record Form...");
      setTimeout(() => {
        onExecuteCommand({ action: 'open_new_record' });
        onClose();
      }, 1000);
    } else if (text.includes("emergency") || text.includes("qr") || text.includes("card")) {
      setFeedback("✅ Executing: Launching Emergency ID Passcard...");
      setTimeout(() => {
        onExecuteCommand({ action: 'open_emergency' });
        onClose();
      }, 1000);
    } else if (text.includes("vitals") || text.includes("chart") || text.includes("blood pressure")) {
      setFeedback("✅ Executing: Opening Vitals Analytics...");
      setTimeout(() => {
        onExecuteCommand({ action: 'open_vitals' });
        onClose();
      }, 1000);
    } else {
      setFeedback(`Recognized: "${cmdText}". Try saying "Show my last blood test" or "Open emergency pass".`);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px', textAlign: 'center' }}>
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="var(--accent-emerald)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>MediVault Voice Assistant</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        <div style={styles.modalBody}>
          <div style={styles.micCircle} onClick={startSpeechRecognition}>
            <Mic size={36} color={isListening ? '#ef4444' : '#10b981'} className={isListening ? 'pulse-green' : ''} />
          </div>

          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, marginTop: '12px' }}>
            {isListening ? "Listening for Voice Commands..." : "Click Mic to Speak"}
          </p>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {feedback}
          </p>

          {transcript && (
            <div style={styles.transcriptBox}>
              🗣️ "{transcript}"
            </div>
          )}

          <div style={styles.divider} />

          <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Sample Voice Commands (Click to Test):
          </h4>

          <div style={styles.sampleGrid}>
            <button
              onClick={() => processCommand("Show my last blood test")}
              className="btn btn-secondary btn-sm"
            >
              💬 "Show my last blood test"
            </button>
            <button
              onClick={() => processCommand("Add my prescription")}
              className="btn btn-secondary btn-sm"
            >
              💬 "Add my prescription"
            </button>
            <button
              onClick={() => processCommand("Open emergency pass")}
              className="btn btn-secondary btn-sm"
            >
              💬 "Open emergency pass"
            </button>
            <button
              onClick={() => processCommand("Show blood pressure vitals")}
              className="btn btn-secondary btn-sm"
            >
              💬 "Show blood pressure vitals"
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  header: {
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--border-color)'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '4px'
  },
  modalBody: {
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  micCircle: {
    width: '76px',
    height: '76px',
    borderRadius: '50%',
    background: 'rgba(16, 185, 129, 0.1)',
    border: '2px solid rgba(16, 185, 129, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
  },
  transcriptBox: {
    marginTop: '12px',
    padding: '8px 14px',
    borderRadius: '8px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    fontSize: '0.88rem',
    color: 'var(--accent-cyan)',
    fontStyle: 'italic'
  },
  divider: {
    width: '100%',
    height: '1px',
    background: 'var(--border-color)',
    margin: '16px 0'
  },
  sampleGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%'
  }
};
