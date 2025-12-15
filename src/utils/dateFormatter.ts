import { VisitDate, DateGranularity } from '../types';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const formatDate = (
  date: { year: number; month?: number; day?: number },
  granularity: DateGranularity
): string => {
  if (granularity === 'year') {
    return date.year.toString();
  }

  if (granularity === 'month' && date.month !== undefined) {
    return `${MONTHS[date.month - 1]} ${date.year}`;
  }

  if (granularity === 'day' && date.month !== undefined && date.day !== undefined) {
    return `${MONTHS[date.month - 1]} ${date.day}, ${date.year}`;
  }

  return date.year.toString();
};

export const formatVisitDate = (visit: VisitDate): string => {
  const arrival = formatDate(visit.arrivalDate, visit.granularity);

  if (!visit.departureDate) {
    return arrival;
  }

  const departure = formatDate(visit.departureDate, visit.granularity);

  // If same year/month/day, show only once
  if (arrival === departure) {
    return arrival;
  }

  return `${arrival} - ${departure}`;
};

export const getCurrentYear = () => new Date().getFullYear();

export const getYearRange = (startYear: number = 1950) => {
  const currentYear = getCurrentYear();
  const years: number[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year);
  }
  return years;
};
