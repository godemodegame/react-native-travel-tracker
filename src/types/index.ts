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
