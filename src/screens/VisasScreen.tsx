import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Visa, CountryWithStatus } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface VisasScreenProps {
  visas: Visa[];
  countries: CountryWithStatus[];
  onClose?: () => void;
  onAddVisa?: () => void;
  onDeleteVisa?: (visaId: string) => void;
}

export const VisasScreen: React.FC<VisasScreenProps> = ({
  visas,
  countries,
  onClose,
  onAddVisa,
  onDeleteVisa,
}) => {
  const { colors } = useTheme();

  const visaStats = useMemo(() => {
    const now = new Date();
    const activeVisas = visas.filter((visa) => {
      const expiryDate = new Date(
        visa.expiryDate.year,
        visa.expiryDate.month - 1,
        visa.expiryDate.day
      );
      return expiryDate >= now;
    });

    const expiredVisas = visas.filter((visa) => {
      const expiryDate = new Date(
        visa.expiryDate.year,
        visa.expiryDate.month - 1,
        visa.expiryDate.day
      );
      return expiryDate < now;
    });

    // Group active visas by country
    const visasByCountry = activeVisas.map((visa) => {
      const country = countries.find((c) => c.code === visa.countryCode);
      const expiryDate = new Date(
        visa.expiryDate.year,
        visa.expiryDate.month - 1,
        visa.expiryDate.day
      );
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const remainingDays = visa.maxStayDays - visa.totalDaysUsed;

      return {
        ...visa,
        country,
        daysUntilExpiry,
        remainingDays,
      };
    });

    // Sort by urgency (expiring soon or running out of days)
    visasByCountry.sort((a, b) => {
      const urgencyA = Math.min(a.daysUntilExpiry, a.remainingDays);
      const urgencyB = Math.min(b.daysUntilExpiry, b.remainingDays);
      return urgencyA - urgencyB;
    });

    return {
      active: visasByCountry,
      expired: expiredVisas,
      total: visas.length,
    };
  }, [visas, countries]);

  const styles = createStyles(colors);

  const getVisaTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      tourist: 'Tourist',
      business: 'Business',
      work: 'Work',
      student: 'Student',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 7) return colors.error;
    if (days <= 30) return colors.warning;
    return colors.success;
  };

  const formatDate = (date: { year: number; month: number; day: number }) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `${monthNames[date.month - 1]} ${date.day}, ${date.year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Visas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => onAddVisa && onAddVisa()}
        >
          <Text style={styles.addButtonText}>+ Add Visa</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{visaStats.active.length}</Text>
              <Text style={styles.statLabel}>Active Visas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{visaStats.expired.length}</Text>
              <Text style={styles.statLabel}>Expired</Text>
            </View>
          </View>
        </View>

        {/* Active Visas */}
        {visaStats.active.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Visas</Text>
            {visaStats.active.map((visa) => (
              <View key={visa.id} style={styles.visaCard}>
                <View style={styles.visaHeader}>
                  <View style={styles.countryInfo}>
                    <Text style={styles.flag}>{visa.country?.flag || '🌍'}</Text>
                    <View style={styles.countryDetails}>
                      <Text style={styles.countryName}>
                        {visa.country?.name || 'Unknown Country'}
                      </Text>
                      <Text style={styles.visaType}>
                        {getVisaTypeLabel(visa.type)} Visa
                      </Text>
                    </View>
                  </View>
                  <View style={styles.badgesContainer}>
                    {visa.isSchengen && (
                      <View style={styles.schengenBadge}>
                        <Text style={styles.schengenText}>🇪🇺 Schengen</Text>
                      </View>
                    )}
                    {visa.multipleEntry && (
                      <View style={styles.multiEntryBadge}>
                        <Text style={styles.multiEntryText}>Multiple Entry</Text>
                      </View>
                    )}
                  </View>
                </View>

                {visa.isSchengen && (
                  <View style={styles.schengenInfo}>
                    <Text style={styles.schengenInfoText}>
                      ✓ Valid for all Schengen countries (not just {visa.country?.name})
                    </Text>
                    <Text style={styles.schengenInfoText}>
                      ✓ Days counted across ALL Schengen countries combined
                    </Text>
                  </View>
                )}

                <View style={styles.divider} />

                {/* Remaining Days */}
                <View style={styles.daysContainer}>
                  <View style={styles.daysStat}>
                    <Text
                      style={[
                        styles.daysNumber,
                        { color: getUrgencyColor(visa.remainingDays) },
                      ]}
                    >
                      {visa.remainingDays}
                    </Text>
                    <Text style={styles.daysLabel}>Days Remaining</Text>
                    <Text style={styles.daysSubLabel}>
                      {visa.totalDaysUsed} of {visa.maxStayDays} used
                    </Text>
                  </View>

                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              (visa.totalDaysUsed / visa.maxStayDays) * 100
                            }%`,
                            backgroundColor:
                              visa.remainingDays <= 7
                                ? colors.error
                                : visa.remainingDays <= 30
                                ? colors.warning
                                : colors.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.divider} />

                {/* Dates */}
                <View style={styles.datesContainer}>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Issued</Text>
                    <Text style={styles.dateValue}>
                      {formatDate(visa.issueDate)}
                    </Text>
                  </View>
                  <View style={styles.dateInfo}>
                    <Text style={styles.dateLabel}>Expires</Text>
                    <Text
                      style={[
                        styles.dateValue,
                        { color: getUrgencyColor(visa.daysUntilExpiry) },
                      ]}
                    >
                      {formatDate(visa.expiryDate)}
                    </Text>
                    <Text style={styles.dateSubLabel}>
                      {visa.daysUntilExpiry} days left
                    </Text>
                  </View>
                </View>

                {visa.note && (
                  <>
                    <View style={styles.divider} />
                    <View style={styles.noteContainer}>
                      <Text style={styles.noteLabel}>Note</Text>
                      <Text style={styles.noteText}>{visa.note}</Text>
                    </View>
                  </>
                )}

                {onDeleteVisa && (
                  <>
                    <View style={styles.divider} />
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => onDeleteVisa(visa.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete Visa</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active visas</Text>
              <Text style={styles.emptySubText}>
                Add your visas to track expiration dates and remaining days
              </Text>
            </View>
          </View>
        )}

        {/* Expired Visas */}
        {visaStats.expired.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Expired Visas ({visaStats.expired.length})
            </Text>
            <Text style={styles.sectionSubtitle}>
              These visas are no longer valid
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
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
    },
    addButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      marginTop: 12,
    },
    addButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
      textAlign: 'center',
    },
    content: {
      flex: 1,
    },
    section: {
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
    sectionSubtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginTop: -8,
      marginBottom: 12,
    },
    statsGrid: {
      flexDirection: 'row',
      gap: 12,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLight,
    },
    statNumber: {
      fontSize: 36,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: 4,
      letterSpacing: -0.5,
    },
    statLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    visaCard: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLight,
    },
    visaHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    countryInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    flag: {
      fontSize: 40,
      marginRight: 12,
    },
    countryDetails: {
      flex: 1,
    },
    countryName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    visaType: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    badgesContainer: {
      gap: 6,
      alignItems: 'flex-end',
    },
    schengenBadge: {
      backgroundColor: '#003399',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    schengenText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    schengenInfo: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginBottom: 12,
    },
    schengenInfoText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '500',
    },
    multiEntryBadge: {
      backgroundColor: colors.primary,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    multiEntryText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '600',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.borderLight,
      marginVertical: 16,
    },
    daysContainer: {
      marginBottom: 16,
    },
    daysStat: {
      alignItems: 'center',
      marginBottom: 12,
    },
    daysNumber: {
      fontSize: 48,
      fontWeight: '700',
      letterSpacing: -1,
    },
    daysLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginTop: 4,
    },
    daysSubLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    progressBarContainer: {
      paddingHorizontal: 8,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.borderLight,
      borderRadius: 4,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    datesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    dateInfo: {
      alignItems: 'center',
    },
    dateLabel: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: '500',
      marginBottom: 4,
    },
    dateValue: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    dateSubLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    noteContainer: {
      marginBottom: 8,
    },
    noteLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    noteText: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.textTertiary,
      marginBottom: 8,
    },
    emptySubText: {
      fontSize: 14,
      color: colors.textTertiary,
      textAlign: 'center',
    },
    deleteButton: {
      backgroundColor: colors.error,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    deleteButtonText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '600',
    },
  });
