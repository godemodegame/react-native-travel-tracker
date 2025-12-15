import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CountryWithStatus, CountryStatus } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface CountryCardProps {
  country: CountryWithStatus;
  onStatusChange: (code: string, status: CountryStatus) => void;
  onOpenDates: (code: string) => void;
  onPress?: (code: string) => void;
}

export const CountryCard: React.FC<CountryCardProps> = ({ country, onStatusChange, onOpenDates, onPress }) => {
  const { colors } = useTheme();

  const getStatusColor = () => {
    switch (country.status) {
      case 'visited':
        return colors.success;
      case 'wishlist':
        return colors.warning;
      default:
        return colors.border;
    }
  };

  const getNextStatus = (): CountryStatus => {
    switch (country.status) {
      case 'none':
        return 'visited';
      case 'visited':
        return 'wishlist';
      case 'wishlist':
        return 'none';
    }
  };

  const getStatusText = () => {
    switch (country.status) {
      case 'visited':
        return '✓ Visited';
      case 'wishlist':
        return '★ Wishlist';
      default:
        return 'Mark';
    }
  };

  const visitCount = country.visitDates?.length || 0;
  const styles = createStyles(colors);

  const cardContent = (
    <>
      <View style={styles.info}>
        <Text style={styles.flag}>{country.flag}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{country.name}</Text>
          <View style={styles.subInfo}>
            <Text style={styles.region}>{country.region}</Text>
            {country.status === 'visited' && visitCount > 0 && (
              <Text style={styles.visitCount}>📅 {visitCount} time(s)</Text>
            )}
          </View>
        </View>
      </View>
      <View style={styles.buttons}>
        {country.status === 'visited' && (
          <TouchableOpacity
            style={styles.datesButton}
            onPress={(e) => {
              e.stopPropagation();
              onOpenDates(country.code);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.datesButtonText}>📅</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.statusButton, { backgroundColor: getStatusColor() }]}
          onPress={(e) => {
            e.stopPropagation();
            onStatusChange(country.code, getNextStatus());
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPress(country.code)}
        activeOpacity={0.7}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      {cardContent}
    </View>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 36,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  subInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  region: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  visitCount: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
    marginLeft: 8,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  datesButton: {
    backgroundColor: colors.info,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  datesButtonText: {
    fontSize: 18,
  },
  statusButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 85,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
