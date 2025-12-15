export type CountryStatus = 'none' | 'visited' | 'wishlist';

export type DateGranularity = 'year' | 'month' | 'day';

export type TransportationType = 'plane' | 'train' | 'car' | 'bus';

export interface VisitDate {
  id: string;
  arrivalDate: {
    year: number;
    month?: number;
    day?: number;
  };
  departureDate?: {
    year: number;
    month?: number;
    day?: number;
  };
  granularity: DateGranularity;
  transportation?: TransportationType;
  note?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  region: string;
}

export interface CountryWithStatus extends Country {
  status: CountryStatus;
  visitDates?: VisitDate[];
}

export type VisaType = 'tourist' | 'business' | 'work' | 'student' | 'other';

export interface Visa {
  id: string;
  countryCode: string; // Country that issued the visa
  type: VisaType;
  isSchengen: boolean; // If true, valid for all Schengen countries
  issueDate: {
    year: number;
    month: number;
    day: number;
  };
  expiryDate: {
    year: number;
    month: number;
    day: number;
  };
  maxStayDays: number; // Maximum days allowed per entry or total
  totalDaysUsed: number; // Days spent - for Schengen, this is across ALL Schengen countries
  multipleEntry: boolean;
  note?: string;
}
