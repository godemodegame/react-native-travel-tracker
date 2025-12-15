import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { CountryWithStatus } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface StatsScreenProps {
  countries: CountryWithStatus[];
  onClose?: () => void;
}

export const StatsScreen: React.FC<StatsScreenProps> = ({ countries, onClose }) => {
  const { colors } = useTheme();

  const stats = useMemo(() => {
    const visited = countries.filter((c) => c.status === 'visited');
    const wishlist = countries.filter((c) => c.status === 'wishlist');

    // Count total visits
    const totalVisits = visited.reduce((sum, country) => {
      return sum + (country.visitDates?.length || 0);
    }, 0);

    // Group by region
    const regionStats: Record<string, { visited: number; total: number; wishlist: number }> = {};
    countries.forEach((country) => {
      if (!regionStats[country.region]) {
        regionStats[country.region] = { visited: 0, total: 0, wishlist: 0 };
      }
      regionStats[country.region].total++;
      if (country.status === 'visited') {
        regionStats[country.region].visited++;
      }
      if (country.status === 'wishlist') {
        regionStats[country.region].wishlist++;
      }
    });

    // Sort regions by visited count
    const sortedRegions = Object.entries(regionStats)
      .sort(([, a], [, b]) => b.visited - a.visited)
      .map(([region, data]) => ({
        region,
        ...data,
        percentage: ((data.visited / data.total) * 100).toFixed(1),
      }));

    // Transportation stats
    const transportationStats: Record<string, number> = {
      plane: 0,
      train: 0,
      car: 0,
      bus: 0,
    };

    visited.forEach((country) => {
      country.visitDates?.forEach((visit) => {
        if (visit.transportation) {
          transportationStats[visit.transportation]++;
        }
      });
    });

    // Most visited countries
    const mostVisited = [...visited]
      .sort((a, b) => (b.visitDates?.length || 0) - (a.visitDates?.length || 0))
      .slice(0, 5);

    return {
      totalCountries: countries.length,
      visitedCount: visited.length,
      wishlistCount: wishlist.length,
      visitedPercentage: ((visited.length / countries.length) * 100).toFixed(1),
      totalVisits,
      regionStats: sortedRegions,
      transportationStats,
      mostVisited,
    };
  }, [countries]);

  const styles = createStyles(colors);

  const transportationEmojis: Record<string, string> = {
    plane: '✈️',
    train: '🚂',
    car: '🚗',
    bus: '🚌',
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.visitedCount}</Text>
              <Text style={styles.statLabel}>Visited</Text>
              <Text style={styles.statSubLabel}>{stats.visitedPercentage}% of world</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalVisits}</Text>
              <Text style={styles.statLabel}>Total Visits</Text>
              <Text style={styles.statSubLabel}>All trips</Text>
            </View>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.wishlistCount}</Text>
              <Text style={styles.statLabel}>Wishlist</Text>
              <Text style={styles.statSubLabel}>Want to visit</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {stats.totalCountries - stats.visitedCount}
              </Text>
              <Text style={styles.statLabel}>Not Visited</Text>
              <Text style={styles.statSubLabel}>To explore</Text>
            </View>
          </View>
        </View>

        {/* Most Visited Countries */}
        {stats.mostVisited.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Visited Countries</Text>
            {stats.mostVisited.map((country) => (
              <View key={country.code} style={styles.countryItem}>
                <Text style={styles.flag}>{country.flag}</Text>
                <View style={styles.countryInfo}>
                  <Text style={styles.countryName}>{country.name}</Text>
                  <Text style={styles.countryRegion}>{country.region}</Text>
                </View>
                <View style={styles.visitBadge}>
                  <Text style={styles.visitBadgeText}>
                    {country.visitDates?.length || 0} visits
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Transportation Stats */}
        {stats.totalVisits > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transportation</Text>
            <View style={styles.transportGrid}>
              {Object.entries(stats.transportationStats).map(([type, count]) => (
                count > 0 && (
                  <View key={type} style={styles.transportCard}>
                    <Text style={styles.transportEmoji}>
                      {transportationEmojis[type]}
                    </Text>
                    <Text style={styles.transportCount}>{count}</Text>
                    <Text style={styles.transportLabel}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </View>
                )
              ))}
            </View>
          </View>
        )}

        {/* Regions Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Regions</Text>
          {stats.regionStats.map((region) => (
            <View key={region.region} style={styles.regionItem}>
              <View style={styles.regionHeader}>
                <Text style={styles.regionName}>{region.region}</Text>
                <Text style={styles.regionPercentage}>{region.percentage}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${region.percentage}%` },
                  ]}
                />
              </View>
              <View style={styles.regionStats}>
                <Text style={styles.regionStat}>
                  ✓ {region.visited} visited
                </Text>
                {region.wishlist > 0 && (
                  <Text style={styles.regionStat}>
                    ★ {region.wishlist} wishlist
                  </Text>
                )}
                <Text style={styles.regionStat}>
                  {region.total} total
                </Text>
              </View>
            </View>
          ))}
        </View>
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
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
    marginBottom: 2,
  },
  statSubLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  flag: {
    fontSize: 32,
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
  countryRegion: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  visitBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  visitBadgeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  transportCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  transportEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  transportCount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  transportLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  regionItem: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  regionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  regionName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  regionPercentage: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  regionStats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  regionStat: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
