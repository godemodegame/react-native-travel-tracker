import { CountryStatus, VisitDate } from '../types';

export const mockCountryStatuses: Record<string, CountryStatus> = {
  'US': 'visited',
  'FR': 'visited',
  'JP': 'visited',
  'IT': 'visited',
  'ES': 'visited',
  'TH': 'visited',
  'GB': 'wishlist',
  'DE': 'wishlist',
  'AU': 'wishlist',
  'BR': 'wishlist',
  'CA': 'visited',
  'MX': 'visited',
  'TR': 'visited',
  'GR': 'visited',
  'PT': 'visited',
};

export const mockVisitDates: Record<string, VisitDate[]> = {
  'US': [
    {
      id: '1',
      arrivalDate: { year: 2019, month: 6, day: 15 },
      departureDate: { year: 2019, month: 6, day: 30 },
      granularity: 'day',
      transportation: 'car',
      note: 'Road trip across California',
    },
    {
      id: '2',
      arrivalDate: { year: 2022, month: 12, day: 20 },
      departureDate: { year: 2023, month: 1, day: 5 },
      granularity: 'day',
      transportation: 'plane',
      note: 'New York for New Year',
    },
  ],
  'FR': [
    {
      id: '3',
      arrivalDate: { year: 2018, month: 7 },
      departureDate: { year: 2018, month: 7 },
      granularity: 'month',
      transportation: 'plane',
      note: 'Paris summer vacation',
    },
    {
      id: '4',
      arrivalDate: { year: 2020, month: 2, day: 14 },
      departureDate: { year: 2020, month: 2, day: 21 },
      granularity: 'day',
      transportation: 'train',
      note: "Valentine's Day in Paris",
    },
  ],
  'JP': [
    {
      id: '5',
      arrivalDate: { year: 2021, month: 3, day: 1 },
      departureDate: { year: 2021, month: 3, day: 21 },
      granularity: 'day',
      transportation: 'plane',
      note: 'Tokyo, Kyoto, Osaka trip',
    },
  ],
  'IT': [
    {
      id: '6',
      arrivalDate: { year: 2019, month: 9 },
      granularity: 'month',
      transportation: 'train',
      note: 'Rome and Florence',
    },
  ],
  'ES': [
    {
      id: '7',
      arrivalDate: { year: 2017, month: 8, day: 10 },
      departureDate: { year: 2017, month: 8, day: 24 },
      granularity: 'day',
      transportation: 'plane',
      note: 'Barcelona and Madrid',
    },
  ],
  'TH': [
    {
      id: '8',
      arrivalDate: { year: 2020 },
      granularity: 'year',
      transportation: 'plane',
      note: 'Bangkok trip',
    },
  ],
  'CA': [
    {
      id: '9',
      arrivalDate: { year: 2018, month: 11 },
      departureDate: { year: 2018, month: 11 },
      granularity: 'month',
      transportation: 'plane',
      note: 'Vancouver and Toronto',
    },
  ],
  'MX': [
    {
      id: '10',
      arrivalDate: { year: 2019, month: 12, day: 25 },
      departureDate: { year: 2020, month: 1, day: 2 },
      granularity: 'day',
      transportation: 'plane',
      note: 'Cancun Christmas vacation',
    },
  ],
  'TR': [
    {
      id: '11',
      arrivalDate: { year: 2021, month: 6 },
      granularity: 'month',
      transportation: 'bus',
      note: 'Istanbul',
    },
  ],
  'GR': [
    {
      id: '12',
      arrivalDate: { year: 2022, month: 7, day: 5 },
      departureDate: { year: 2022, month: 7, day: 19 },
      granularity: 'day',
      transportation: 'plane',
      note: 'Athens and Greek islands',
    },
  ],
  'PT': [
    {
      id: '13',
      arrivalDate: { year: 2023, month: 4 },
      granularity: 'month',
      note: 'Lisbon',
    },
  ],
};
