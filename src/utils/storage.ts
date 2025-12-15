import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountryStatus, VisitDate } from '../types';

const STORAGE_KEYS = {
  COUNTRY_STATUSES: '@travel_tracker:country_statuses',
  VISIT_DATES: '@travel_tracker:visit_dates',
};

export const storage = {
  // Save country statuses
  async saveCountryStatuses(statuses: Record<string, CountryStatus>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.COUNTRY_STATUSES, JSON.stringify(statuses));
    } catch (error) {
      console.error('Error saving country statuses:', error);
    }
  },

  // Load country statuses
  async loadCountryStatuses(): Promise<Record<string, CountryStatus>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.COUNTRY_STATUSES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading country statuses:', error);
      return {};
    }
  },

  // Save visit dates
  async saveVisitDates(dates: Record<string, VisitDate[]>): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.VISIT_DATES, JSON.stringify(dates));
    } catch (error) {
      console.error('Error saving visit dates:', error);
    }
  },

  // Load visit dates
  async loadVisitDates(): Promise<Record<string, VisitDate[]>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.VISIT_DATES);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading visit dates:', error);
      return {};
    }
  },

  // Clear all data
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.COUNTRY_STATUSES,
        STORAGE_KEYS.VISIT_DATES,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },
};
