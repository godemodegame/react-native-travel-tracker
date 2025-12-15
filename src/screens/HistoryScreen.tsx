import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { CountryWithStatus, VisitDate, TransportationType } from '../types';
import { formatVisitDate } from '../utils/dateFormatter';
import { useTheme } from '../theme/ThemeContext';

const TRANSPORTATION_INFO: Record<TransportationType, { label: string; emoji: string }> = {
  plane: { label: 'Plane', emoji: '✈️' },
  train: { label: 'Train', emoji: '🚂' },
  car: { label: 'Car', emoji: '🚗' },
  bus: { label: 'Bus', emoji: '🚌' },
};

interface HistoryScreenProps {
  countries: CountryWithStatus[];
  onClose?: () => void;
}

interface HistoryEntry {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  region: string;
  visit: VisitDate;
  sortDate: Date;
}

const getDateForSorting = (date: { year: number; month?: number; day?: number }): Date => {
  return new Date(date.year, (date.month || 1) - 1, date.day || 1);
};

export const HistoryScreen: React.FC<HistoryScreenProps> = ({ countries, onClose }) => {
  const { colors } = useTheme();

  const historyEntries = useMemo(() => {
    const entries: HistoryEntry[] = [];

    countries.forEach((country) => {
      if (country.status === 'visited' && country.visitDates) {
        country.visitDates.forEach((visit) => {
          entries.push({
            id: `${country.code}-${visit.id}`,
            countryCode: country.code,
            countryName: country.name,
            flag: country.flag,
            region: country.region,
            visit,
            sortDate: getDateForSorting(visit.arrivalDate),
          });
        });
      }
    });

    // Sort by date, most recent first
    return entries.sort((a, b) => b.sortDate.getTime() - a.sortDate.getTime());
  }, [countries]);

  const totalVisits = historyEntries.length;
  const uniqueCountries = new Set(historyEntries.map((e) => e.countryCode)).size;

  const renderHistoryItem = ({ item }: { item: HistoryEntry }) => {
    const transportInfo = item.visit.transportation
      ? TRANSPORTATION_INFO[item.visit.transportation]
      : null;

    // Debug log
    if (__DEV__) {
      console.log('Visit:', item.countryName, 'Transportation:', item.visit.transportation, 'Info:', transportInfo);
    }

    return (
      <View style={styles.historyItem}>
        <View style={styles.dateSection}>
          <Text style={styles.dateText}>{formatVisitDate(item.visit)}</Text>
          {transportInfo && (
            <Text style={styles.transportBadge}>
              {transportInfo.emoji} {transportInfo.label}
            </Text>
          )}
        </View>
        <View style={styles.countrySection}>
          <View style={styles.countryHeader}>
            <Text style={styles.flag}>{item.flag}</Text>
            <View style={styles.countryInfo}>
              <Text style={styles.countryName}>{item.countryName}</Text>
              <Text style={styles.region}>{item.region}</Text>
            </View>
          </View>
          {item.visit.note && (
            <Text style={styles.note}>"{item.visit.note}"</Text>
          )}
        </View>
      </View>
    );
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Travel History</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{totalVisits}</Text>
          <Text style={styles.statLabel}>Total Visits</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{uniqueCountries}</Text>
          <Text style={styles.statLabel}>Countries</Text>
        </View>
      </View>

      {/* Timeline */}
      {historyEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No travel history yet</Text>
          <Text style={styles.emptySubtext}>
            Mark countries as visited and add dates to see your timeline
          </Text>
        </View>
      ) : (
        <FlatList
          data={historyEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderHistoryItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.4,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  dateSection: {
    backgroundColor: colors.primaryLight,
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  transportBadge: {
    fontSize: 12,
    backgroundColor: colors.primary,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
  },
  countrySection: {
    padding: 16,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 36,
    marginRight: 12,
  },
  countryInfo: {
    flex: 1,
  },
  countryName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  region: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  note: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 12,
    paddingLeft: 48,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textTertiary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
