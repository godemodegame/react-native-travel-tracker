import { Platform } from 'react-native';
import { CountryStatus, VisitDate } from '../types';

const STORAGE_KEYS = {
  COUNTRY_STATUSES: '@travel_tracker:country_statuses',
  VISIT_DATES: '@travel_tracker:visit_dates',
};

// Web storage implementation using localStorage
const webStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  async multiRemove(keys: string[]): Promise<void> {
    try {
      keys.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Storage adapter that works on both native and web
const storageAdapter = Platform.OS === 'web' ? webStorage : webStorage;

export const storage = {
  // Save country statuses
  async saveCountryStatuses(statuses: Record<string, CountryStatus>): Promise<void> {
    try {
      await storageAdapter.setItem(STORAGE_KEYS.COUNTRY_STATUSES, JSON.stringify(statuses));
    } catch (error) {
      console.error('Error saving country statuses:', error);
    }
  },

  // Load country statuses
  async loadCountryStatuses(): Promise<Record<string, CountryStatus>> {
    try {
      const data = await storageAdapter.getItem(STORAGE_KEYS.COUNTRY_STATUSES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading country statuses:', error);
      return {};
    }
  },

  // Save visit dates
  async saveVisitDates(dates: Record<string, VisitDate[]>): Promise<void> {
    try {
      await storageAdapter.setItem(STORAGE_KEYS.VISIT_DATES, JSON.stringify(dates));
    } catch (error) {
      console.error('Error saving visit dates:', error);
    }
  },

  // Load visit dates
  async loadVisitDates(): Promise<Record<string, VisitDate[]>> {
    try {
      const data = await storageAdapter.getItem(STORAGE_KEYS.VISIT_DATES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading visit dates:', error);
      return {};
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await storageAdapter.multiRemove([
        STORAGE_KEYS.COUNTRY_STATUSES,
        STORAGE_KEYS.VISIT_DATES,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
