import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { CountryWithStatus } from '../types';

interface WorldMapProps {
  countries: CountryWithStatus[];
  colors: any;
}

// World map that resembles actual geographic layout
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

  const renderRegion = (region: string, additionalStyles?: any) => {
    const color = getRegionColor(region);
    const stats = getRegionStats(region);

    return (
      <View
        style={[
          styles.region,
          {
            backgroundColor: color,
            borderColor: colors.border
          },
          additionalStyles
        ]}
      >
        {stats.visited > 0 && (
          <Text style={styles.regionLabel}>{stats.visited}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.mapContainer}>
      {/* World Map - Geographic Layout */}
      <View style={styles.worldMap}>
        {/* Row 1: Northern regions (Arctic) */}
        <View style={styles.mapRow}>
          <View style={styles.spacer} />
          {renderRegion('Northern America', { width: 90, height: 35 })}
          <View style={styles.spacer} />
          {renderRegion('Northern Europe', { width: 50, height: 35 })}
          {renderRegion('Northern Asia', { width: 110, height: 35 })}
        </View>

        {/* Row 2: North temperate - Americas left, Eurasia right */}
        <View style={styles.mapRow}>
          {renderRegion('Northern America', { width: 100, height: 50 })}
          <View style={{ width: 30 }} />
          {renderRegion('Western Europe', { width: 40, height: 50 })}
          {renderRegion('Eastern Europe', { width: 50, height: 50 })}
          {renderRegion('Central Asia', { width: 60, height: 50 })}
          {renderRegion('Eastern Asia', { width: 70, height: 50 })}
        </View>

        {/* Row 3: Mid-latitude - Caribbean, Mediterranean, Middle East, Asia */}
        <View style={styles.mapRow}>
          {renderRegion('Central America', { width: 35, height: 40 })}
          {renderRegion('Caribbean', { width: 40, height: 40 })}
          <View style={{ width: 20 }} />
          {renderRegion('Southern Europe', { width: 50, height: 40 })}
          {renderRegion('Western Asia', { width: 50, height: 40 })}
          {renderRegion('Southern Asia', { width: 60, height: 40 })}
          {renderRegion('Eastern Asia', { width: 50, height: 40 })}
        </View>

        {/* Row 4: Tropics - Africa and Southeast Asia */}
        <View style={styles.mapRow}>
          {renderRegion('South America', { width: 70, height: 55 })}
          <View style={{ width: 30 }} />
          {renderRegion('Northern Africa', { width: 80, height: 55 })}
          {renderRegion('Western Asia', { width: 40, height: 55 })}
          {renderRegion('Southern Asia', { width: 50, height: 55 })}
          {renderRegion('Southeastern Asia', { width: 70, height: 55 })}
        </View>

        {/* Row 5: Central Africa and Indonesia/Philippines */}
        <View style={styles.mapRow}>
          {renderRegion('South America', { width: 65, height: 50 })}
          <View style={{ width: 35 }} />
          {renderRegion('Western Africa', { width: 60, height: 50 })}
          {renderRegion('Central Africa', { width: 70, height: 50 })}
          {renderRegion('Eastern Africa', { width: 60, height: 50 })}
          <View style={{ width: 20 }} />
          {renderRegion('Southeastern Asia', { width: 55, height: 50 })}
        </View>

        {/* Row 6: Southern Africa and Australia */}
        <View style={styles.mapRow}>
          {renderRegion('South America', { width: 55, height: 45 })}
          <View style={{ width: 60 }} />
          {renderRegion('Southern Africa', { width: 60, height: 45 })}
          {renderRegion('Eastern Africa', { width: 50, height: 45 })}
          <View style={{ width: 50 }} />
          {renderRegion('Australia and Oceania', { width: 90, height: 45 })}
        </View>

        {/* Row 7: Southern tip */}
        <View style={styles.mapRow}>
          <View style={styles.spacer} />
          {renderRegion('South America', { width: 40, height: 35 })}
          <View style={{ width: 80 }} />
          {renderRegion('Southern Africa', { width: 45, height: 35 })}
          <View style={{ width: 120 }} />
          {renderRegion('Australia and Oceania', { width: 70, height: 35 })}
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
    padding: 8,
    alignItems: 'center',
  },
  worldMap: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  mapRow: {
    flexDirection: 'row',
    marginBottom: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  region: {
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  spacer: {
    width: 40,
  },
  regionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  legend: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
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
