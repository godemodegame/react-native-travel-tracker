import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CountryWithStatus } from '../types';

interface WorldMapProps {
  countries: CountryWithStatus[];
  colors: any;
}

// Simplified world map using regional blocks
export const WorldMap: React.FC<WorldMapProps> = ({ countries, colors }) => {
  const getRegionStats = (region: string) => {
    const regionCountries = countries.filter((c) => c.region === region);
    const visited = regionCountries.filter((c) => c.status === 'visited').length;
    const wishlist = regionCountries.filter((c) => c.status === 'wishlist').length;
    const total = regionCountries.length;

    return { visited, wishlist, total };
  };

  const getRegionColor = (region: string) => {
    const stats = getRegionStats(region);
    if (stats.visited > 0) {
      const intensity = Math.min(stats.visited / stats.total, 1);
      return `rgba(0, 122, 255, ${0.3 + intensity * 0.7})`;
    }
    if (stats.wishlist > 0) {
      return colors.primaryLight;
    }
    return colors.borderLight;
  };

  const renderRegion = (region: string, style: any, label?: string) => {
    const stats = getRegionStats(region);
    const color = getRegionColor(region);

    return (
      <View style={[style, { backgroundColor: color, borderColor: colors.border }]}>
        {label && stats.visited > 0 && (
          <Text style={styles.regionLabel}>{stats.visited}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.mapContainer}>
      {/* World Map Grid */}
      <View style={styles.worldGrid}>
        {/* Row 1 - Northern regions */}
        <View style={styles.row}>
          {renderRegion('Northern Europe', styles.northernEurope, '1')}
          {renderRegion('Eastern Europe', styles.easternEurope, '2')}
          {renderRegion('Northern Asia', styles.northernAsia, '3')}
        </View>

        {/* Row 2 - Mid-latitude regions */}
        <View style={styles.row}>
          {renderRegion('Western Europe', styles.westernEurope, '4')}
          {renderRegion('Southern Europe', styles.southernEurope, '5')}
          {renderRegion('Western Asia', styles.westernAsia, '6')}
          {renderRegion('Central Asia', styles.centralAsia, '7')}
          {renderRegion('Eastern Asia', styles.easternAsia, '8')}
        </View>

        {/* Row 3 - Africa and South Asia */}
        <View style={styles.row}>
          {renderRegion('Northern Africa', styles.northernAfrica, '9')}
          {renderRegion('Western Africa', styles.westernAfrica, '10')}
          {renderRegion('Eastern Africa', styles.easternAfrica, '11')}
          {renderRegion('Southern Asia', styles.southernAsia, '12')}
          {renderRegion('Southeastern Asia', styles.southeasternAsia, '13')}
        </View>

        {/* Row 4 - Southern regions */}
        <View style={styles.row}>
          {renderRegion('Southern Africa', styles.southernAfrica, '14')}
          {renderRegion('Australia and Oceania', styles.oceania, '15')}
        </View>

        {/* Row 5 - Americas */}
        <View style={styles.row}>
          {renderRegion('Northern America', styles.northernAmerica, '16')}
          {renderRegion('Central America', styles.centralAmerica, '17')}
          {renderRegion('Caribbean', styles.caribbean, '18')}
        </View>

        {/* Row 6 - South America */}
        <View style={styles.row}>
          {renderRegion('South America', styles.southAmerica, '19')}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Visited</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primaryLight }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Wishlist</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.borderLight }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Not visited</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    padding: 16,
    alignItems: 'center',
  },
  worldGrid: {
    width: '100%',
    maxWidth: 400,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  // Region styles - sizes approximate geographic area
  northernEurope: {
    flex: 2,
    height: 30,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  easternEurope: {
    flex: 2,
    height: 30,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  northernAsia: {
    flex: 4,
    height: 30,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  westernEurope: {
    flex: 1.5,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  southernEurope: {
    flex: 1.5,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  westernAsia: {
    flex: 1.5,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralAsia: {
    flex: 2,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  easternAsia: {
    flex: 2,
    height: 35,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  northernAfrica: {
    flex: 2,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  westernAfrica: {
    flex: 1.5,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  easternAfrica: {
    flex: 1.5,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  southernAsia: {
    flex: 2,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  southeasternAsia: {
    flex: 2,
    height: 35,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  southernAfrica: {
    flex: 2,
    height: 35,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  oceania: {
    flex: 3,
    height: 35,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  northernAmerica: {
    flex: 3,
    height: 40,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centralAmerica: {
    flex: 1,
    height: 40,
    marginRight: 4,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caribbean: {
    flex: 1,
    height: 40,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  southAmerica: {
    flex: 2,
    height: 45,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  regionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 13,
  },
});
