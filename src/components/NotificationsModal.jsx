import React, { useState } from 'react';
import { 
  X, Bell, Clock, Pill, Calendar, AlertCircle, 
  CheckCircle2, PlusCircle, Trash2, Volume2 
} from 'lucide-react';

export default function NotificationsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('reminders');

  // Reminders List State
  const [reminders, setReminders] = useState([
    {
      id: 1,
      title: "Ventolin Albuterol Inhaler",
      type: "medicine",
      time: "08:00 AM",
      frequency: "Daily (2 Puffs)",
      active: true,
      nextDue: "Tomorrow at 08:00 AM"
    },
    {
      id: 2,
      title: "Follow-up Cardiology Visit with Dr. Jenkins",
      type: "appointment",
      time: "10:30 AM",
      frequency: "One-time",
      active: true,
      nextDue: "June 25, 2026 at 10:30 AM"
    },
    {
      id: 3,
      title: "Fast 8-Hours for Upcoming Lipid Panel Test",
      type: "lab_prep",
      time: "10:00 PM",
      frequency: "One-time",
      active: true,
      nextDue: "Night before test"
    }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newType, setNewType] = useState('medicine');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleActive = (id) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const handleDelete = (id) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!newTitle) return;
    const newRem = {
      id: Date.now(),
      title: newTitle,
      type: newType,
      time: newTime,
      frequency: "Daily Scheduled",
      active: true,
      nextDue: `Today at ${newTime}`
    };
    setReminders([newRem, ...reminders]);
    setNewTitle('');
    setShowAddForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <Bell size={22} color="var(--accent-amber)" />
            </div>
            <div>
              <h2 style={styles.title}>Health Reminders & Notifications</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Medicine Schedules, Doctor Appointments & Lab Prep Alerts
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={styles.modalBody}>
          <div style={styles.topActions}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Active Schedules ({reminders.filter(r => r.active).length})
            </span>
            <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary btn-sm">
              <PlusCircle size={15} /> + Add Reminder
            </button>
          </div>

          {/* Add Reminder Inline Form */}
          {showAddForm && (
            <form onSubmit={handleAddReminder} style={styles.addForm} className="glass-panel">
              <h4 style={{ fontSize: '0.9rem', color: 'var(--accent-cyan)', marginBottom: '8px' }}>Create New Health Alert</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Reminder Title (e.g. Take Amoxicillin 500mg)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                  style={styles.input}
                />
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  required
                  style={styles.input}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} style={styles.select}>
                  <option value="medicine">💊 Medicine Reminder</option>
                  <option value="appointment">📅 Doctor Appointment</option>
                  <option value="lab_prep">🧪 Lab Test Prep</option>
                </select>

                <button type="submit" className="btn btn-cyan btn-sm">
                  Save Alert
                </button>
              </div>
            </form>
          )}

          {/* List of Reminders */}
          <div style={styles.remindersList}>
            {reminders.map((item) => (
              <div key={item.id} style={item.active ? styles.reminderCard : styles.reminderCardInactive}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={styles.iconCircle}>
                    {item.type === 'medicine' && <Pill size={18} color="var(--accent-emerald)" />}
                    {item.type === 'appointment' && <Calendar size={18} color="var(--accent-cyan)" />}
                    {item.type === 'lab_prep' && <AlertCircle size={18} color="var(--accent-amber)" />}
                  </div>

                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {item.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      ⏰ {item.time} • {item.frequency} ({item.nextDue})
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Active Toggle Switch */}
                  <label style={styles.switch}>
                    <input
                      type="checkbox"
                      checked={item.active}
                      onChange={() => handleToggleActive(item.id)}
                    />
                    <span style={styles.slider} />
                  </label>

                  <button onClick={() => handleDelete(item.id)} style={styles.deleteBtn}>
                    <Trash2 size={15} color="var(--text-muted)" />
                  </button>
                </div>
              </div>
            ))}
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
  headerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
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
    gap: '16px'
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  addForm: {
    padding: '16px',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  input: {
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.85rem'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.85rem'
  },
  remindersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  reminderCard: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  reminderCardInactive: {
    padding: '14px 18px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    opacity: 0.5
  },
  iconCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  switch: {
    position: 'relative',
    display: 'inline-block',
    width: '38px',
    height: '20px'
  },
  slider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#334155',
    borderRadius: '99px',
    transition: '0.3s'
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  }
};
