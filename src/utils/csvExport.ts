import { VisitDate, CountryStatus } from '../types';
import { Platform } from 'react-native';

// Conditional imports for native platforms
let FileSystem: any;
let Sharing: any;

if (Platform.OS !== 'web') {
  FileSystem = require('expo-file-system');
  Sharing = require('expo-sharing');
}

export interface ExportData {
  countryStatuses: Record<string, CountryStatus>;
  visitDates: Record<string, VisitDate[]>;
}

/**
 * Converts travel data to CSV format
 */
export const convertToCSV = (data: ExportData): string => {
  const rows: string[] = [];

  // CSV Header
  rows.push('Country Code,Status,Visit ID,Arrival Year,Arrival Month,Arrival Day,Departure Year,Departure Month,Departure Day,Granularity,Transportation,Note');

  // Process each country
  Object.entries(data.countryStatuses).forEach(([countryCode, status]) => {
    const visits = data.visitDates[countryCode] || [];

    if (visits.length === 0) {
      // Country with status but no visits
      rows.push(`${countryCode},${status},,,,,,,,,`);
    } else {
      // Country with visits
      visits.forEach((visit) => {
        const arrivalYear = visit.arrivalDate.year;
        const arrivalMonth = visit.arrivalDate.month || '';
        const arrivalDay = visit.arrivalDate.day || '';

        const departureYear = visit.departureDate?.year || '';
        const departureMonth = visit.departureDate?.month || '';
        const departureDay = visit.departureDate?.day || '';

        const transportation = visit.transportation || '';
        const note = visit.note ? `"${visit.note.replace(/"/g, '""')}"` : '';

        rows.push(
          `${countryCode},${status},${visit.id},${arrivalYear},${arrivalMonth},${arrivalDay},${departureYear},${departureMonth},${departureDay},${visit.granularity},${transportation},${note}`
        );
      });
    }
  });

  return rows.join('\n');
};

/**
 * Parses CSV content and returns travel data
 */
export const parseCSV = (csvContent: string): ExportData | null => {
  try {
    const lines = csvContent.trim().split('\n');

    if (lines.length < 2) {
      throw new Error('CSV file is empty or invalid');
    }

    // Skip header row
    const dataLines = lines.slice(1);

    const countryStatuses: Record<string, CountryStatus> = {};
    const visitDates: Record<string, VisitDate[]> = {};

    dataLines.forEach((line, index) => {
      if (!line.trim()) return;

      // Simple CSV parsing (handles quoted notes)
      const parts: string[] = [];
      let current = '';
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          parts.push(current);
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current);

      if (parts.length < 12) {
        console.warn(`Line ${index + 2} has insufficient columns, skipping`);
        return;
      }

      const [
        countryCode,
        status,
        visitId,
        arrivalYear,
        arrivalMonth,
        arrivalDay,
        departureYear,
        departureMonth,
        departureDay,
        granularity,
        transportation,
        note,
      ] = parts.map(p => p.trim());

      // Validate country code and status
      if (!countryCode || !status) {
        console.warn(`Line ${index + 2} missing country code or status, skipping`);
        return;
      }

      if (!['none', 'visited', 'wishlist'].includes(status)) {
        console.warn(`Line ${index + 2} has invalid status: ${status}, skipping`);
        return;
      }

      countryStatuses[countryCode] = status as CountryStatus;

      // If there's visit data, parse it
      if (visitId && arrivalYear) {
        const visit: VisitDate = {
          id: visitId,
          arrivalDate: {
            year: parseInt(arrivalYear, 10),
            month: arrivalMonth ? parseInt(arrivalMonth, 10) : undefined,
            day: arrivalDay ? parseInt(arrivalDay, 10) : undefined,
          },
          granularity: (granularity || 'year') as 'year' | 'month' | 'day',
        };

        // Add departure date if present
        if (departureYear) {
          visit.departureDate = {
            year: parseInt(departureYear, 10),
            month: departureMonth ? parseInt(departureMonth, 10) : undefined,
            day: departureDay ? parseInt(departureDay, 10) : undefined,
          };
        }

        // Add transportation if present
        if (transportation && ['plane', 'train', 'car', 'bus'].includes(transportation)) {
          visit.transportation = transportation as 'plane' | 'train' | 'car' | 'bus';
        }

        // Add note if present (remove surrounding quotes and unescape)
        if (note) {
          visit.note = note.replace(/^"/, '').replace(/"$/, '').replace(/""/g, '"');
        }

        if (!visitDates[countryCode]) {
          visitDates[countryCode] = [];
        }
        visitDates[countryCode].push(visit);
      }
    });

    return { countryStatuses, visitDates };
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return null;
  }
};

/**
 * Exports travel data to CSV file
 */
export const exportToCSV = async (data: ExportData): Promise<boolean> => {
  try {
    console.log('exportToCSV called, Platform.OS:', Platform.OS);
    const csvContent = convertToCSV(data);
    console.log('CSV content generated, length:', csvContent.length);
    const fileName = `travel-history-${new Date().toISOString().split('T')[0]}.csv`;
    console.log('File name:', fileName);

    if (Platform.OS === 'web') {
      console.log('Web platform detected, creating download link');
      // Check if we're in a browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        console.error('Browser environment not available');
        return false;
      }

      // Web export using download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      console.log('Blob created:', blob.size, 'bytes');

      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      console.log('URL created:', url);

      link.href = url;
      link.download = fileName;
      link.style.display = 'none';

      document.body.appendChild(link);
      console.log('Link appended to body, clicking...');
      link.click();
      console.log('Link clicked');

      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        console.log('Cleanup completed');
      }, 100);

      return true;
    } else {
      // Mobile export using pre-imported modules
      const fileUri = (FileSystem.documentDirectory || '') + fileName;
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri);
        return true;
      } else {
        console.error('Sharing is not available on this device');
        return false;
      }
    }
  } catch (error) {
    console.error('Error exporting CSV:', error);
    return false;
  }
};

/**
 * Imports travel data from CSV file
 * On web, accepts File object from input
 * On mobile, accepts file URI
 */
export const importFromCSV = async (fileOrUri: File | string): Promise<ExportData | null> => {
  try {
    console.log('importFromCSV called, Platform.OS:', Platform.OS);
    console.log('fileOrUri type:', typeof fileOrUri);
    console.log('fileOrUri instanceof File:', fileOrUri instanceof File);

    let csvContent: string;

    if (Platform.OS === 'web' && fileOrUri instanceof File) {
      // Web import
      console.log('Reading file as text...');
      csvContent = await fileOrUri.text();
      console.log('File read successfully, length:', csvContent.length);
    } else if (typeof fileOrUri === 'string') {
      // Mobile import using pre-imported module
      csvContent = await FileSystem.readAsStringAsync(fileOrUri, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } else {
      console.error('Invalid file or URI type:', typeof fileOrUri);
      throw new Error('Invalid file or URI provided');
    }

    console.log('Parsing CSV content...');
    const result = parseCSV(csvContent);
    console.log('Parse result:', result ? 'success' : 'failed');
    return result;
  } catch (error) {
    console.error('Error importing CSV:', error);
    return null;
  }
};
