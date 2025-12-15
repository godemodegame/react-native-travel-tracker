import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { CountryWithStatus } from '../types';

interface WorldMapProps {
  countries: CountryWithStatus[];
  colors: any;
}

// Simplified SVG world map with major regions
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

  // Simplified world map paths (major regions)
  const regionPaths = {
    'Northern America': 'M150,80 L250,80 L280,120 L270,180 L220,200 L170,190 L140,150 Z',
    'Central America': 'M200,200 L230,200 L235,220 L225,230 L205,225 Z',
    'Caribbean': 'M240,210 L270,210 L275,225 L265,230 L245,225 Z',
    'South America': 'M220,230 L280,240 L290,310 L270,380 L240,390 L220,370 L210,300 Z',

    'Northern Europe': 'M480,70 L540,65 L560,85 L550,110 L520,105 L485,95 Z',
    'Western Europe': 'M470,110 L510,105 L520,140 L500,155 L475,145 Z',
    'Southern Europe': 'M510,145 L560,140 L570,165 L555,175 L520,170 Z',
    'Eastern Europe': 'M560,90 L620,85 L640,130 L620,155 L570,150 L565,110 Z',

    'Northern Africa': 'M470,185 L600,180 L620,220 L610,260 L480,265 L465,230 Z',
    'Western Africa': 'M460,265 L520,262 L525,310 L510,340 L470,335 Z',
    'Central Africa': 'M520,265 L580,263 L590,310 L575,345 L525,343 Z',
    'Eastern Africa': 'M590,220 L630,218 L640,290 L625,350 L595,345 L585,270 Z',
    'Southern Africa': 'M510,345 L590,343 L595,380 L575,410 L535,415 L515,395 Z',

    'Western Asia': 'M600,165 L660,160 L675,200 L665,220 L615,215 Z',
    'Central Asia': 'M640,135 L720,130 L740,165 L725,185 L665,180 Z',
    'Southern Asia': 'M665,220 L735,215 L755,265 L740,290 L680,285 Z',
    'Southeastern Asia': 'M740,270 L810,265 L835,305 L825,335 L770,340 L745,315 Z',
    'Eastern Asia': 'M730,130 L810,120 L840,180 L830,230 L760,235 L735,195 Z',
    'Northern Asia': 'M640,40 L820,35 L840,90 L825,115 L730,120 L640,110 Z',

    'Australia and Oceania': 'M780,350 L870,345 L885,395 L870,430 L810,435 L785,410 Z',
  };

  return (
    <View style={styles.mapContainer}>
      <View style={styles.svgContainer}>
        <Svg width="100%" height="100%" viewBox="0 0 1000 500" style={styles.svg}>
          <G>
            {Object.entries(regionPaths).map(([region, path]) => (
              <Path
                key={region}
                d={path}
                fill={getRegionColor(region)}
                stroke={colors.border}
                strokeWidth="1"
              />
            ))}
          </G>
        </Svg>
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
  svgContainer: {
    width: '100%',
    maxWidth: 600,
    aspectRatio: 2,
    backgroundColor: 'transparent',
  },
  svg: {
    backgroundColor: 'transparent',
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
