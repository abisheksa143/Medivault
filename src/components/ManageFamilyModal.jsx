import React, { useState } from 'react';
import { X, Users, UserPlus, Edit3, Check, Save, User, ShieldAlert, Phone } from 'lucide-react';
import SmartDobPicker from './SmartDobPicker';

export default function ManageFamilyModal({ familyProfiles, activeProfile, onUpdateProfiles, onSelectProfile, elderMode = false, onClose }) {
  const [editingId, setEditingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Edit Form State
  const [editName, setEditName] = useState('');
  const [editRelation, setEditRelation] = useState('');
  const [editDob, setEditDob] = useState('1992-04-12');
  const [editAge, setEditAge] = useState(34);
  const [editBloodType, setEditBloodType] = useState('O Positive (O+)');
  const [editPhysician, setEditPhysician] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');

  const handleStartEdit = (profile) => {
    setEditingId(profile.id);
    setEditName(profile.name);
    setEditRelation(profile.relation || '');
    setEditDob(profile.dob);
    setEditAge(profile.age);
    setEditBloodType(profile.bloodType);
    setEditPhysician(profile.primaryPhysician || '');
    setEditContactName(profile.emergencyContact?.name || '');
    setEditContactPhone(profile.emergencyContact?.phone || '');
  };

  const handleSaveEdit = (profileId) => {
    const updatedProfiles = familyProfiles.map(p => {
      if (p.id === profileId) {
        return {
          ...p,
          name: editName,
          relation: editRelation,
          dob: editDob,
          age: Number(editAge),
          bloodType: editBloodType,
          primaryPhysician: editPhysician,
          emergencyContact: {
            ...p.emergencyContact,
            name: editContactName,
            phone: editContactPhone
          }
        };
      }
      return p;
    });

    onUpdateProfiles(updatedProfiles);

    const currentActive = updatedProfiles.find(p => p.id === activeProfile.id);
    if (currentActive) {
      onSelectProfile(currentActive);
    }

    setEditingId(null);
  };

  const handleAddNewMember = (e) => {
    e.preventDefault();
    const newMember = {
      id: `PAT-FAM-${Math.floor(1000 + Math.random() * 9000)}`,
      role: 'family',
      name: editName || 'New Family Member',
      relation: editRelation || 'Family Member',
      dob: editDob || '1960-01-01',
      age: Number(editAge) || 65,
      gender: 'Other',
      bloodType: editBloodType,
      height: "5 ft 8 in",
      weight: "150 lbs",
      emergencyContact: {
        name: editContactName || "Alex Morgan",
        relation: "Family",
        phone: editContactPhone || "+1 (555) 884-9102"
      },
      allergies: [],
      activeMedications: [],
      chronicConditions: [],
      organDonor: true,
      primaryPhysician: editPhysician || "Dr. Family Physician"
    };

    const updatedProfiles = [...familyProfiles, newMember];
    onUpdateProfiles(updatedProfiles);
    onSelectProfile(newMember);
    setShowAddForm(false);
    setEditingId(null);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '740px' }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={styles.headerIcon}>
              <Users size={24} color="var(--accent-cyan)" />
            </div>
            <div>
              <h2 style={styles.title}>Manage Family Profiles & Names</h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Elder-Friendly Date of Birth Picker with Voice Input & Auto Age Calculation
              </p>
            </div>
          </div>

          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.modalBody}>
          <div style={styles.topActions}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Family Members ({familyProfiles.length})
            </span>
            <button
              onClick={() => {
                setShowAddForm(true);
                setEditingId('NEW');
                setEditName('');
                setEditRelation('Parent / Elderly');
                setEditDob('1954-08-22');
                setEditAge(72);
              }}
              className="btn btn-primary btn-sm"
            >
              <UserPlus size={15} /> + Add Family Member
            </button>
          </div>

          {/* Add New Profile Form */}
          {showAddForm && (
            <form onSubmit={handleAddNewMember} style={styles.editFormBox} className="glass-panel">
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '10px' }}>
                Add New Family Member Profile
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arthur R. Morgan"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={styles.input}
                  />
                </div>
                <div>
                  <label style={styles.label}>Relationship</label>
                  <input
                    type="text"
                    placeholder="e.g. Father / Elderly Parent"
                    value={editRelation}
                    onChange={(e) => setEditRelation(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              {/* Elder-Friendly Smart DOB Picker */}
              <div style={{ marginTop: '10px' }}>
                <SmartDobPicker
                  value={editDob}
                  onChange={(newDobStr, newAgeVal) => {
                    setEditDob(newDobStr);
                    setEditAge(newAgeVal);
                  }}
                  label="Date of Birth"
                  elderMode={elderMode}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                <div>
                  <label style={styles.label}>Blood Group</label>
                  <select
                    value={editBloodType}
                    onChange={(e) => setEditBloodType(e.target.value)}
                    style={styles.select}
                  >
                    <option value="O Positive (O+)">O Positive (O+)</option>
                    <option value="A Positive (A+)">A Positive (A+)</option>
                    <option value="B Positive (B+)">B Positive (B+)</option>
                    <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                    <option value="O Negative (O-)">O Negative (O-)</option>
                    <option value="A Negative (A-)">A Negative (A-)</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Primary Physician</label>
                  <input
                    type="text"
                    value={editPhysician}
                    onChange={(e) => setEditPhysician(e.target.value)}
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Profile
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* List of Existing Family Profiles */}
          <div style={styles.profilesList}>
            {familyProfiles.map((p) => {
              const isSelected = activeProfile.id === p.id;
              const isEditing = editingId === p.id;

              return (
                <div key={p.id} style={isSelected ? styles.profileCardActive : styles.profileCard} className="glass-panel">
                  {!isEditing ? (
                    <div style={styles.profileCardRow}>
                      <div style={styles.profileInfo}>
                        <div style={styles.avatarCircle}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                              {p.name}
                            </h3>
                            {isSelected && <span style={styles.activeBadge}>Active Vault</span>}
                          </div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {p.relation} • Date of Birth: {p.dob} (Age {p.age}) • {p.bloodType}
                          </p>
                          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Physician: {p.primaryPhysician} • Contact: {p.emergencyContact?.name} ({p.emergencyContact?.phone})
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!isSelected && (
                          <button
                            onClick={() => onSelectProfile(p)}
                            className="btn btn-outline-emerald btn-sm"
                          >
                            Switch To Profile
                          </button>
                        )}

                        <button
                          onClick={() => handleStartEdit(p)}
                          className="btn btn-secondary btn-sm"
                          title="Edit Name & Date of Birth"
                        >
                          <Edit3 size={15} /> Edit Name & Date of Birth
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Inline Edit Profile Form with Smart DOB Picker */
                    <div style={styles.editFormBox}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '8px' }}>
                        Editing Profile: {p.name}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                          <label style={styles.label}>Full Name</label>
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            style={styles.input}
                          />
                        </div>
                        <div>
                          <label style={styles.label}>Relationship</label>
                          <input
                            type="text"
                            value={editRelation}
                            onChange={(e) => setEditRelation(e.target.value)}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      {/* Elder-Friendly Smart DOB Picker */}
                      <div style={{ marginTop: '10px' }}>
                        <SmartDobPicker
                          value={editDob}
                          onChange={(newDobStr, newAgeVal) => {
                            setEditDob(newDobStr);
                            setEditAge(newAgeVal);
                          }}
                          label="Date of Birth"
                          elderMode={elderMode}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px' }}>
                        <div>
                          <label style={styles.label}>Blood Group</label>
                          <select
                            value={editBloodType}
                            onChange={(e) => setEditBloodType(e.target.value)}
                            style={styles.select}
                          >
                            <option value="O Positive (O+)">O Positive (O+)</option>
                            <option value="A Positive (A+)">A Positive (A+)</option>
                            <option value="B Positive (B+)">B Positive (B+)</option>
                            <option value="AB Positive (AB+)">AB Positive (AB+)</option>
                            <option value="O Negative (O-)">O Negative (O-)</option>
                            <option value="A Negative (A-)">A Negative (A-)</option>
                          </select>
                        </div>
                        <div>
                          <label style={styles.label}>Primary Physician</label>
                          <input
                            type="text"
                            value={editPhysician}
                            onChange={(e) => setEditPhysician(e.target.value)}
                            style={styles.input}
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button onClick={() => handleSaveEdit(p.id)} className="btn btn-primary btn-sm">
                          Save Name & Changes
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn btn-secondary btn-sm">
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
    gap: '16px'
  },
  topActions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  profilesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  profileCard: {
    padding: '16px 20px',
    borderRadius: '14px'
  },
  profileCardActive: {
    padding: '16px 20px',
    borderRadius: '14px',
    borderColor: 'var(--accent-emerald)',
    background: 'rgba(16, 185, 129, 0.06)'
  },
  profileCardRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap'
  },
  profileInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  avatarCircle: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
    color: '#fff',
    fontSize: '1.3rem',
    fontWeight: '800',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activeBadge: {
    fontSize: '0.68rem',
    padding: '2px 8px',
    borderRadius: '99px',
    background: 'rgba(16, 185, 129, 0.2)',
    color: 'var(--accent-emerald)',
    fontWeight: '800'
  },
  editFormBox: {
    padding: '16px',
    borderRadius: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '700',
    color: 'var(--text-muted)'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.85rem'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    background: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
    outline: 'none',
    fontSize: '0.85rem'
  }
};
