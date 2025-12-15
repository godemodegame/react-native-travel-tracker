import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Country } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface CountrySelectorProps {
  visible: boolean;
  countries: Country[];
  onClose: () => void;
  onSelect: (countryCode: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  visible,
  countries,
  onClose,
  onSelect,
}) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) {
      return countries;
    }
    const query = searchQuery.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(query));
  }, [countries, searchQuery]);

  const handleSelect = (countryCode: string) => {
    onSelect(countryCode);
    setSearchQuery('');
    onClose();
  };

  const styles = createStyles(colors);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Select Country</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search country..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textTertiary}
            autoFocus
          />
        </View>

        {/* Countries List */}
        <ScrollView style={styles.content}>
          {filteredCountries.map((country) => (
            <TouchableOpacity
              key={country.code}
              style={styles.countryItem}
              onPress={() => handleSelect(country.code)}
            >
              <Text style={styles.flag}>{country.flag}</Text>
              <View style={styles.countryInfo}>
                <Text style={styles.countryName}>{country.name}</Text>
                <Text style={styles.countryRegion}>{country.region}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {filteredCountries.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No countries found</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    title: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.text,
    },
    cancelButton: {
      fontSize: 17,
      color: colors.primary,
    },
    placeholder: {
      width: 60,
    },
    searchContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: colors.background,
    },
    searchInput: {
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 10,
      fontSize: 17,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLight,
    },
    content: {
      flex: 1,
    },
    countryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
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
      fontWeight: '500',
      color: colors.text,
    },
    countryRegion: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    emptyContainer: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 17,
      color: colors.textTertiary,
    },
  });
