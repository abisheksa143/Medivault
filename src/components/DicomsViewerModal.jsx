import React, { useState, useRef, useEffect } from 'react';
import { 
  X, ZoomIn, ZoomOut, RotateCcw, Sun, Eye, Contrast, 
  Layers, Sliders, Info, ShieldCheck 
} from 'lucide-react';

export default function DicomsViewerModal({ record, onClose }) {
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [invert, setInvert] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [currentSlice, setCurrentSlice] = useState(1);

  const canvasRef = useRef(null);

  const isMri = record?.imagingDetails?.imageType === 'mri' || record?.title?.toLowerCase().includes('mri');

  useEffect(() => {
    drawScanCanvas();
  }, [zoom, brightness, contrast, invert, showAnnotations, currentSlice, isMri]);

  const drawScanCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = invert ? '#ffffff' : '#050810';
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Apply CSS filter simulation via canvas filter or custom render
    const brightnessVal = brightness / 100;
    const contrastVal = contrast / 100;

    if (isMri) {
      // Draw Lumbar Spine MRI
      drawLumbarSpineMri(ctx, width, height, brightnessVal, contrastVal, invert, currentSlice);
    } else {
      // Draw Chest X-Ray
      drawChestXray(ctx, width, height, brightnessVal, contrastVal, invert);
    }

    ctx.restore();

    // Draw Annotations Overlay
    if (showAnnotations) {
      drawAnnotationsOverlay(ctx, width, height, isMri);
    }
  };

  const drawLumbarSpineMri = (ctx, w, h, b, c, inv, slice) => {
    const mainColor = inv ? 'rgba(0,0,0,' : 'rgba(255,255,255,';
    const bgContrastColor = inv ? 'rgba(50,50,50,' : 'rgba(200,200,200,';

    // Spine Column background shadow
    ctx.fillStyle = `${mainColor}${0.1 * b * c})`;
    ctx.fillRect(w / 2 - 40, 40, 80, h - 80);

    // Draw Vertebrae L1 to L5
    const vertebrae = [
      { name: 'L1', y: 70 },
      { name: 'L2', y: 130 },
      { name: 'L3', y: 190 },
      { name: 'L4', y: 250 },
      { name: 'L5', y: 310 }
    ];

    vertebrae.forEach((v) => {
      // Bone block
      ctx.fillStyle = `${mainColor}${0.75 * b * c})`;
      ctx.beginPath();
      ctx.roundRect(w / 2 - 35, v.y, 70, 42, 6);
      ctx.fill();

      ctx.strokeStyle = `${bgContrastColor}${0.4 * b})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Intervertebral Disc
      if (v.name !== 'L5') {
        const discY = v.y + 42;
        const isBulgeDisc = v.name === 'L4';
        
        ctx.fillStyle = isBulgeDisc 
          ? (inv ? 'rgba(220, 38, 38, 0.8)' : 'rgba(239, 68, 68, 0.8)')
          : `${mainColor}${0.45 * b * c})`;

        ctx.beginPath();
        if (isBulgeDisc) {
          // Bulging disc extending posterior (right side)
          ctx.ellipse(w / 2 + 5, discY + 8, 38 + slice * 2, 8, 0, 0, Math.PI * 2);
        } else {
          ctx.ellipse(w / 2, discY + 8, 32, 7, 0, 0, Math.PI * 2);
        }
        ctx.fill();
      }
    });

    // Spinal Cord / Cerebrospinal Fluid line
    ctx.strokeStyle = inv ? 'rgba(2, 132, 199, 0.8)' : 'rgba(56, 189, 248, 0.8)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(w / 2 + 42, 50);
    ctx.lineTo(w / 2 + 42, h - 60);
    ctx.stroke();
  };

  const drawChestXray = (ctx, w, h, b, c, inv) => {
    const boneColor = inv ? 'rgba(30,30,30,' : 'rgba(240,240,240,';
    const lungColor = inv ? 'rgba(230,230,230,' : 'rgba(20,25,35,';

    // Rib cage outer contour
    ctx.fillStyle = `${lungColor}${0.95 * b})`;
    ctx.beginPath();
    ctx.ellipse(w / 2 - 70, h / 2, 55, 120, 0, 0, Math.PI * 2);
    ctx.ellipse(w / 2 + 70, h / 2, 55, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cardiac Silhouette (Heart)
    ctx.fillStyle = `${boneColor}${0.5 * b * c})`;
    ctx.beginPath();
    ctx.ellipse(w / 2 - 15, h / 2 + 25, 45, 55, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();

    // Clavicles & Spine column
    ctx.fillStyle = `${boneColor}${0.8 * b * c})`;
    ctx.fillRect(w / 2 - 10, 40, 20, h - 80);

    // Ribs arches
    ctx.strokeStyle = `${boneColor}${0.45 * b * c})`;
    ctx.lineWidth = 6;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(w / 2 - 70, 90 + i * 35, 50, 0.2, Math.PI - 0.2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(w / 2 + 70, 90 + i * 35, 50, 0.2, Math.PI - 0.2);
      ctx.stroke();
    }
  };

  const drawAnnotationsOverlay = (ctx, w, h, isMriScan) => {
    ctx.save();
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#10b981';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;

    if (isMriScan) {
      // Vertebrae Labels L1-L5
      const labels = [
        { text: 'L1 Vertebra', y: 90 },
        { text: 'L2 Vertebra', y: 150 },
        { text: 'L3 Vertebra', y: 210 },
        { text: 'L4 Disc Bulge (Target)', y: 270, highlight: true },
        { text: 'L5 Vertebra', y: 330 }
      ];

      labels.forEach((lbl) => {
        ctx.fillStyle = lbl.highlight ? '#ef4444' : '#10b981';
        ctx.strokeStyle = lbl.highlight ? '#ef4444' : '#10b981';

        ctx.beginPath();
        ctx.moveTo(w / 2 - 35, lbl.y);
        ctx.lineTo(w / 2 - 100, lbl.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(w / 2 - 35, lbl.y, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillText(lbl.text, w / 2 - 210, lbl.y + 4);
      });

      // Scale Marker
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`FOV: 24cm • Slice ${currentSlice}/4 • T2 Sagittal`, 20, h - 20);
    } else {
      // Chest X-Ray Annotations
      ctx.fillText('Right Lung Field [Clear]', 40, 140);
      ctx.fillText('Left Lung Field [Clear]', w - 180, 140);

      // Cardiac Measurement Line
      ctx.strokeStyle = '#06b6d4';
      ctx.beginPath();
      ctx.moveTo(w / 2 - 50, h / 2 + 35);
      ctx.lineTo(w / 2 + 25, h / 2 + 35);
      ctx.stroke();

      ctx.fillStyle = '#06b6d4';
      ctx.fillText('CTR: 0.44 (Normal)', w / 2 - 40, h / 2 + 52);
    }

    ctx.restore();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ background: '#080c16' }}>
        {/* Radiology DICOM Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.dicomTag}>
              <span className="badge badge-scan">DICOM 3.0 Standard Viewer</span>
              <span style={styles.monoText}>{record?.id}</span>
            </div>
            <h2 style={styles.title}>{record?.title}</h2>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Radiology Control Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.toolGroup}>
            <button onClick={() => setZoom(z => Math.min(z + 0.2, 2.5))} className="btn btn-secondary btn-sm" title="Zoom In">
              <ZoomIn size={15} />
            </button>
            <button onClick={() => setZoom(z => Math.max(z - 0.2, 0.6))} className="btn btn-secondary btn-sm" title="Zoom Out">
              <ZoomOut size={15} />
            </button>
            <button onClick={() => { setZoom(1); setBrightness(100); setContrast(100); setInvert(false); }} className="btn btn-secondary btn-sm" title="Reset View">
              <RotateCcw size={15} />
            </button>
            <span style={styles.toolDivider} />

            <button
              onClick={() => setInvert(!invert)}
              className={invert ? "btn btn-cyan btn-sm" : "btn btn-secondary btn-sm"}
              title="Invert Image (Negative View)"
            >
              <Contrast size={15} /> Negative Invert
            </button>

            <button
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={showAnnotations ? "btn btn-outline-emerald btn-sm" : "btn btn-secondary btn-sm"}
              title="Toggle Anatomical Labels"
            >
              <Eye size={15} /> Annotations
            </button>
          </div>

          {/* Brightness & Contrast Sliders */}
          <div style={styles.toolGroupRight}>
            <div style={styles.sliderBox}>
              <Sun size={14} color="var(--text-muted)" />
              <input
                type="range"
                min="40"
                max="180"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                style={styles.rangeInput}
              />
            </div>
            <div style={styles.sliderBox}>
              <Sliders size={14} color="var(--text-muted)" />
              <input
                type="range"
                min="40"
                max="180"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                style={styles.rangeInput}
              />
            </div>
          </div>
        </div>

        {/* Main Canvas Canvas Display */}
        <div style={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={720}
            height={420}
            style={styles.canvas}
          />
        </div>

        {/* Footer Slice Selector & Findings */}
        <div style={styles.footer}>
          {isMri && (
            <div style={styles.sliceRow}>
              <Layers size={15} color="var(--accent-emerald)" />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Sagittal Slice Layer: <strong>{currentSlice} / 4</strong>
              </span>
              <input
                type="range"
                min="1"
                max="4"
                value={currentSlice}
                onChange={(e) => setCurrentSlice(Number(e.target.value))}
                style={{ width: '120px', accentColor: 'var(--accent-emerald)' }}
              />
            </div>
          )}

          <div style={styles.findingsSummary}>
            <Info size={15} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <strong>Impression:</strong> {record?.imagingDetails?.impression || 'Normal imaging scan. No acute pathology observed.'}
            </span>
          </div>
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
  dicomTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px'
  },
  monoText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--text-muted)'
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
  toolbar: {
    padding: '12px 24px',
    background: 'rgba(255, 255, 255, 0.02)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap'
  },
  toolGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  toolGroupRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  toolDivider: {
    width: '1px',
    height: '20px',
    background: 'var(--border-color)',
    margin: '0 4px'
  },
  sliderBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  rangeInput: {
    width: '80px',
    accentColor: 'var(--accent-cyan)',
    cursor: 'pointer'
  },
  canvasContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
    background: '#04070f'
  },
  canvas: {
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '100%',
    boxShadow: '0 12px 32px rgba(0,0,0,0.6)'
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap'
  },
  sliceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  findingsSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  }
};
