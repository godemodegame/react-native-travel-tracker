import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { CountryWithStatus, TransportationType } from '../types';
import { formatVisitDate } from '../utils/dateFormatter';
import { useTheme } from '../theme/ThemeContext';

interface CountryDetailScreenProps {
  country: CountryWithStatus;
  onClose: () => void;
  onOpenDates: () => void;
}

const TRANSPORTATION_INFO: Record<TransportationType, { label: string; emoji: string }> = {
  plane: { label: 'Plane', emoji: '✈️' },
  train: { label: 'Train', emoji: '🚂' },
  car: { label: 'Car', emoji: '🚗' },
  bus: { label: 'Bus', emoji: '🚌' },
};

export const CountryDetailScreen: React.FC<CountryDetailScreenProps> = ({
  country,
  onClose,
  onOpenDates,
}) => {
  const { colors } = useTheme();

  const visitCount = country.visitDates?.length || 0;
  const sortedVisits = [...(country.visitDates || [])].sort((a, b) => {
    const dateA = new Date(a.arrivalDate.year, (a.arrivalDate.month || 1) - 1, a.arrivalDate.day || 1);
    const dateB = new Date(b.arrivalDate.year, (b.arrivalDate.month || 1) - 1, b.arrivalDate.day || 1);
    return dateB.getTime() - dateA.getTime();
  });

  const getStatusBadge = () => {
    switch (country.status) {
      case 'visited':
        return { text: 'Visited', color: colors.success };
      case 'wishlist':
        return { text: 'Want to Visit', color: colors.warning };
      default:
        return { text: 'Not Visited', color: colors.textTertiary };
    }
  };

  const statusBadge = getStatusBadge();
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Country Info */}
        <View style={styles.countryHeader}>
          <Text style={styles.flag}>{country.flag}</Text>
          <View style={styles.countryInfo}>
            <Text style={styles.countryName}>{country.name}</Text>
            <Text style={styles.region}>{country.region}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusBadge.color }]}>
              <Text style={styles.statusBadgeText}>{statusBadge.text}</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        {country.status === 'visited' && visitCount > 0 && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{visitCount}</Text>
                <Text style={styles.statLabel}>Total Visits</Text>
              </View>
            </View>
          </View>
        )}

        {/* Travel History */}
        {country.status === 'visited' && (
          <View style={styles.historySection}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Travel History</Text>
              <TouchableOpacity onPress={onOpenDates} style={styles.manageButton}>
                <Text style={styles.manageButtonText}>Manage</Text>
              </TouchableOpacity>
            </View>

            {visitCount === 0 ? (
              <View style={styles.emptyHistory}>
                <Text style={styles.emptyText}>No visits recorded yet</Text>
                <TouchableOpacity onPress={onOpenDates} style={styles.addFirstButton}>
                  <Text style={styles.addFirstButtonText}>+ Add Your First Visit</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.visitsList}>
                {sortedVisits.map((visit) => {
                  const transportInfo = visit.transportation
                    ? TRANSPORTATION_INFO[visit.transportation]
                    : null;

                  return (
                    <View key={visit.id} style={styles.visitCard}>
                      <View style={styles.visitHeader}>
                        <Text style={styles.visitDate}>{formatVisitDate(visit)}</Text>
                        {transportInfo && (
                          <View style={styles.transportBadge}>
                            <Text style={styles.transportText}>
                              {transportInfo.emoji} {transportInfo.label}
                            </Text>
                          </View>
                        )}
                      </View>
                      {visit.note && (
                        <Text style={styles.visitNote}>"{visit.note}"</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}

        {/* Wishlist Message */}
        {country.status === 'wishlist' && (
          <View style={styles.wishlistSection}>
            <Text style={styles.wishlistEmoji}>⭐️</Text>
            <Text style={styles.wishlistTitle}>On Your Wishlist</Text>
            <Text style={styles.wishlistText}>
              You want to visit {country.name}. Mark it as visited when you go!
            </Text>
          </View>
        )}

        {/* Not Visited Message */}
        {country.status === 'none' && (
          <View style={styles.notVisitedSection}>
            <Text style={styles.notVisitedEmoji}>🌍</Text>
            <Text style={styles.notVisitedTitle}>Not Visited Yet</Text>
            <Text style={styles.notVisitedText}>
              Add {country.name} to your wishlist or mark it as visited.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  countryHeader: {
    backgroundColor: colors.surface,
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  flag: {
    fontSize: 80,
    marginBottom: 16,
  },
  countryInfo: {
    alignItems: 'center',
  },
  countryName: {
    fontSize: 34,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  region: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statsSection: {
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  manageButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statBox: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
    minWidth: 120,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  statNumber: {
    fontSize: 36,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  historySection: {
    backgroundColor: colors.surface,
    padding: 20,
    marginTop: 8,
  },
  emptyHistory: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 17,
    color: colors.textTertiary,
    marginBottom: 16,
  },
  addFirstButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  visitsList: {
    gap: 12,
  },
  visitCard: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  visitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visitDate: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  transportBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  transportText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  visitNote: {
    fontSize: 15,
    color: colors.textSecondary,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  wishlistSection: {
    backgroundColor: colors.surface,
    padding: 40,
    marginTop: 8,
    alignItems: 'center',
  },
  wishlistEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  wishlistTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.warning,
    marginBottom: 12,
  },
  wishlistText: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  notVisitedSection: {
    backgroundColor: colors.surface,
    padding: 40,
    marginTop: 8,
    alignItems: 'center',
  },
  notVisitedEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  notVisitedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textTertiary,
    marginBottom: 12,
  },
  notVisitedText: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
