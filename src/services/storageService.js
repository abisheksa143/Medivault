import { INITIAL_PATIENT_PROFILE, FAMILY_PROFILES, INITIAL_RECORDS, INITIAL_VITALS_TRENDS, CONNECTED_PROVIDERS } from './mockData';

const KEYS = {
  PROFILE: 'medivault_profile_v1',
  FAMILY_LIST: 'medivault_family_list_v1',
  RECORDS: 'medivault_records_v1',
  VITALS: 'medivault_vitals_v1',
  PROVIDERS: 'medivault_providers_v1',
  PIN_CODE: 'medivault_pin_code_v1',
  SECURITY_ENABLED: 'medivault_security_enabled_v1',
  THEME: 'medivault_theme_v1',
  LANG: 'medivault_lang_v1'
};

function encryptData(data) {
  return JSON.stringify(data);
}

function decryptData(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse local storage health vault data:", e);
    return null;
  }
}

export const StorageService = {
  getPinCode() {
    return localStorage.getItem(KEYS.PIN_CODE) || "1234";
  },
  setPinCode(pin) {
    localStorage.setItem(KEYS.PIN_CODE, pin);
  },

  // Family Profiles
  getFamilyProfiles() {
    const data = decryptData(localStorage.getItem(KEYS.FAMILY_LIST));
    if (!data || !Array.isArray(data)) {
      this.saveFamilyProfiles(FAMILY_PROFILES);
      return FAMILY_PROFILES;
    }
    return data;
  },
  saveFamilyProfiles(profiles) {
    localStorage.setItem(KEYS.FAMILY_LIST, encryptData(profiles));
  },

  getProfile() {
    const data = decryptData(localStorage.getItem(KEYS.PROFILE));
    if (!data) {
      this.saveProfile(INITIAL_PATIENT_PROFILE);
      return INITIAL_PATIENT_PROFILE;
    }
    return data;
  },
  saveProfile(profile) {
    localStorage.setItem(KEYS.PROFILE, encryptData(profile));
  },

  // Records
  getRecords() {
    const data = decryptData(localStorage.getItem(KEYS.RECORDS));
    if (!data || !Array.isArray(data)) {
      this.saveRecords(INITIAL_RECORDS);
      return INITIAL_RECORDS;
    }
    
    // Auto-merge new requested reports if missing from active local cache
    let updated = [...data];
    let changed = false;
    INITIAL_RECORDS.forEach(initRec => {
      if (!updated.some(r => r.id === initRec.id)) {
        updated.unshift(initRec);
        changed = true;
      }
    });
    if (changed) {
      this.saveRecords(updated);
    }
    return updated;
  },
  saveRecords(records) {
    localStorage.setItem(KEYS.RECORDS, encryptData(records));
  },
  addRecord(newRecord) {
    const records = this.getRecords();
    const updated = [newRecord, ...records];
    this.saveRecords(updated);
    return updated;
  },
  deleteRecord(recordId) {
    const records = this.getRecords();
    const updated = records.filter(r => r.id !== recordId);
    this.saveRecords(updated);
    return updated;
  },

  // Vitals
  getVitals() {
    const data = decryptData(localStorage.getItem(KEYS.VITALS));
    if (!data || !Array.isArray(data)) {
      this.saveVitals(INITIAL_VITALS_TRENDS);
      return INITIAL_VITALS_TRENDS;
    }
    return data;
  },
  saveVitals(vitals) {
    localStorage.setItem(KEYS.VITALS, encryptData(vitals));
  },
  addVitalPoint(vitalPoint) {
    const vitals = this.getVitals();
    const updated = [...vitals, vitalPoint];
    this.saveVitals(updated);
    return updated;
  },

  // Providers
  getProviders() {
    const data = decryptData(localStorage.getItem(KEYS.PROVIDERS));
    if (!data || !Array.isArray(data)) {
      this.saveProviders(CONNECTED_PROVIDERS);
      return CONNECTED_PROVIDERS;
    }
    return data;
  },
  saveProviders(providers) {
    localStorage.setItem(KEYS.PROVIDERS, encryptData(providers));
  },
  toggleProviderSync(providerId) {
    const providers = this.getProviders();
    const updated = providers.map(p => {
      if (p.id === providerId) {
        const isConn = p.status === 'connected';
        return {
          ...p,
          status: isConn ? 'available' : 'connected',
          lastSync: isConn ? null : new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return p;
    });
    this.saveProviders(updated);
    return updated;
  },

  // Theme & Language
  getTheme() {
    return localStorage.getItem(KEYS.THEME) || 'dark';
  },
  setTheme(theme) {
    localStorage.setItem(KEYS.THEME, theme);
  },

  getLanguage() {
    return localStorage.getItem(KEYS.LANG) || 'en';
  },
  setLanguage(lang) {
    localStorage.setItem(KEYS.LANG, lang);
  },

  exportVaultJSON() {
    const vault = {
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      profile: this.getProfile(),
      familyProfiles: this.getFamilyProfiles(),
      records: this.getRecords(),
      vitals: this.getVitals(),
      providers: this.getProviders()
    };
    const jsonStr = JSON.stringify(vault, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medivault_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
};
