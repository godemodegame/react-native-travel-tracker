import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { DateGranularity } from '../types';
import { getYearRange } from '../utils/dateFormatter';

interface DatePickerProps {
  onDateSelect: (date: {
    year: number;
    month?: number;
    day?: number;
  }) => void;
  label: string;
  initialDate?: {
    year: number;
    month?: number;
    day?: number;
  };
}

const MONTHS = [
  { value: 1, label: 'Jan' },
  { value: 2, label: 'Feb' },
  { value: 3, label: 'Mar' },
  { value: 4, label: 'Apr' },
  { value: 5, label: 'May' },
  { value: 6, label: 'Jun' },
  { value: 7, label: 'Jul' },
  { value: 8, label: 'Aug' },
  { value: 9, label: 'Sep' },
  { value: 10, label: 'Oct' },
  { value: 11, label: 'Nov' },
  { value: 12, label: 'Dec' },
];

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};

export const DatePicker: React.FC<DatePickerProps> = ({
  onDateSelect,
  label,
  initialDate,
}) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(initialDate?.year || currentYear);
  const [month, setMonth] = useState<number | undefined>(initialDate?.month);
  const [day, setDay] = useState<number | undefined>(initialDate?.day);

  const years = getYearRange();
  const daysInMonth = month ? getDaysInMonth(year, month) : 31;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleYearSelect = (selectedYear: number) => {
    setYear(selectedYear);
    setMonth(undefined);
    setDay(undefined);
    onDateSelect({ year: selectedYear });
  };

  const handleMonthSelect = (selectedMonth: number) => {
    setMonth(selectedMonth);
    setDay(undefined);
    onDateSelect({ year, month: selectedMonth });
  };

  const handleDaySelect = (selectedDay: number) => {
    setDay(selectedDay);
    onDateSelect({ year, month: month!, day: selectedDay });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      {/* Year Selector */}
      <View style={styles.selectorSection}>
        <Text style={styles.selectorLabel}>Year:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {years.map((y) => (
            <TouchableOpacity
              key={y}
              style={[styles.option, year === y && styles.selectedOption]}
              onPress={() => handleYearSelect(y)}
            >
              <Text style={[styles.optionText, year === y && styles.selectedOptionText]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Month Selector */}
      {year && (
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Month (optional):</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {MONTHS.map((m) => (
              <TouchableOpacity
                key={m.value}
                style={[styles.option, month === m.value && styles.selectedOption]}
                onPress={() => handleMonthSelect(m.value)}
              >
                <Text
                  style={[styles.optionText, month === m.value && styles.selectedOptionText]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Day Selector */}
      {month && (
        <View style={styles.selectorSection}>
          <Text style={styles.selectorLabel}>Day (optional):</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {days.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.option, day === d && styles.selectedOption]}
                onPress={() => handleDaySelect(d)}
              >
                <Text style={[styles.optionText, day === d && styles.selectedOptionText]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Selected Date Display */}
      <View style={styles.selectedDateContainer}>
        <Text style={styles.selectedDateLabel}>Selected:</Text>
        <Text style={styles.selectedDate}>
          {year}
          {month && ` / ${String(month).padStart(2, '0')}`}
          {day && ` / ${String(day).padStart(2, '0')}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectorSection: {
    marginBottom: 12,
  },
  selectorLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  scrollView: {
    maxHeight: 50,
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  option: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: '#667eea',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: '600',
  },
  selectedDateContainer: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  selectedDateLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  selectedDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
});
