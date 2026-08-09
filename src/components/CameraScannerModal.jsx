import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, RefreshCw, CheckCircle2, Sparkles, Image as ImageIcon } from 'lucide-react';

export default function CameraScannerModal({ onAddRecord, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);

  const videoRef = useRef(null);

  useEffect(() => {
    startCameraStream();
    return () => stopCameraStream();
  }, []);

  const startCameraStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    } catch (e) {
      console.log("Camera access fallback to simulated viewfinder:", e);
    }
  };

  const stopCameraStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const handleCapturePhoto = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setCaptured(true);

      const parsedRx = {
        id: `REC-CAM-${Math.floor(1000 + Math.random() * 9000)}`,
        title: "Amoxicillin / Clavulanate 875mg (Camera Scanned)",
        type: "prescription",
        category: "Prescription",
        date: new Date().toISOString().split('T')[0],
        facility: "Walgreen Pharmacy Rx #4891",
        prescriber: "Dr. Robert Vance, MD",
        urgency: "normal",
        summary: "Paper prescription captured via mobile camera. 1 tablet twice daily with meals.",
        prescriptionData: {
          drugName: "Amoxicillin / Clavulanate 875-125mg",
          dosage: "875mg Tablet",
          instructions: "Take 1 tablet every 12 hours for 10 days for bacterial infection.",
          quantity: "20 Tablets",
          refillsLeft: 1,
          refillDueDate: "2026-09-01",
          rxNumber: "RX-CAM-889102",
          active: true
        },
        aiTranslation: "Amoxicillin is an antibiotic prescribed to clear bacterial infections. Finish the full 10-day course even if feeling better early.",
        tags: ["Camera Scan", "Prescription", "Antibiotic"],
        attachmentUrl: null
      };

      setScannedResult(parsedRx);
      onAddRecord(parsedRx);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Camera size={20} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Phone Camera Record Scanner</h3>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Viewfinder Area */}
        <div style={styles.modalBody}>
          {!captured ? (
            <div style={styles.viewfinderBox}>
              <video ref={videoRef} autoPlay playsInline muted style={styles.videoStream} />
              
              {/* Overlay Laser Scan Frame */}
              <div style={styles.targetFrame}>
                <div style={styles.frameCornerTL} />
                <div style={styles.frameCornerTR} />
                <div style={styles.frameCornerBL} />
                <div style={styles.frameCornerBR} />
                {scanning && <div style={styles.laserLine} />}
              </div>

              <p style={styles.cameraInstructions}>
                Align paper prescription, lab report or vaccine card inside frame
              </p>

              <button
                onClick={handleCapturePhoto}
                className="btn btn-primary"
                style={{ marginTop: '16px', width: '100%' }}
                disabled={scanning}
              >
                {scanning ? (
                  <>
                    <RefreshCw size={16} className="spin" />
                    <span>Running Optical OCR Scan...</span>
                  </>
                ) : (
                  <>
                    <Camera size={16} />
                    <span>Capture & Convert to Digital Record</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div style={styles.successBox}>
              <CheckCircle2 size={48} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginTop: '8px' }}>
                Paper Prescription Digitized!
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Extracted: <strong>{scannedResult?.title}</strong>
              </p>
              <div style={styles.extractedDetailsCard}>
                <p>• <strong>Doctor:</strong> {scannedResult?.prescriber}</p>
                <p>• <strong>Instructions:</strong> {scannedResult?.prescriptionData?.instructions}</p>
                <p>• <strong>Refills Left:</strong> {scannedResult?.prescriptionData?.refillsLeft}</p>
              </div>

              <button onClick={onClose} className="btn btn-primary" style={{ marginTop: '14px', width: '100%' }}>
                Done (Saved to Wallet)
              </button>
            </div>
          )}
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
    padding: '20px'
  },
  viewfinderBox: {
    position: 'relative',
    width: '100%',
    height: '320px',
    borderRadius: '16px',
    background: '#04070f',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  videoStream: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  targetFrame: {
    position: 'absolute',
    width: '260px',
    height: '180px',
    border: '1px stroke rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    pointerEvents: 'none'
  },
  frameCornerTL: {
    position: 'absolute', top: 0, left: 0, width: '20px', height: '20px',
    borderTop: '3px solid var(--accent-emerald)', borderLeft: '3px solid var(--accent-emerald)'
  },
  frameCornerTR: {
    position: 'absolute', top: 0, right: 0, width: '20px', height: '20px',
    borderTop: '3px solid var(--accent-emerald)', borderRight: '3px solid var(--accent-emerald)'
  },
  frameCornerBL: {
    position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px',
    borderBottom: '3px solid var(--accent-emerald)', borderLeft: '3px solid var(--accent-emerald)'
  },
  frameCornerBR: {
    position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px',
    borderBottom: '3px solid var(--accent-emerald)', borderRight: '3px solid var(--accent-emerald)'
  },
  laserLine: {
    position: 'absolute', left: 0, right: 0, height: '2px',
    background: 'var(--accent-emerald)', boxShadow: '0 0 10px var(--accent-emerald)',
    animation: 'laserScan 1.2s infinite ease-in-out'
  },
  cameraInstructions: {
    position: 'absolute', bottom: '60px', fontSize: '0.78rem', color: '#fff',
    background: 'rgba(0, 0, 0, 0.6)', padding: '4px 12px', borderRadius: '99px'
  },
  successBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px 0'
  },
  extractedDetailsCard: {
    marginTop: '12px',
    padding: '12px 16px',
    borderRadius: '10px',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    width: '100%',
    textAlign: 'left',
    fontSize: '0.85rem'
  }
};
