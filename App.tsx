import { useState, useMemo } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  SectionList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { CountryWithStatus, CountryStatus, VisitDate } from './src/types';
import { countries } from './src/data/countries';
import { CountryCard } from './src/components/CountryCard';
import { DateModal } from './src/components/DateModal';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { CountryDetailScreen } from './src/screens/CountryDetailScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { mockCountryStatuses, mockVisitDates } from './src/data/mockTravelData';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';

type TabType = 'all' | 'visited' | 'wishlist';
type ScreenType = 'countries' | 'history' | 'stats';

// Use mock data only in development mode
const isDevelopment = __DEV__;

function AppContent() {
  const { colors, isDark } = useTheme();

  const [countryStatuses, setCountryStatuses] = useState<Record<string, CountryStatus>>(
    isDevelopment ? mockCountryStatuses : {}
  );
  const [visitDates, setVisitDates] = useState<Record<string, VisitDate[]>>(
    isDevelopment ? mockVisitDates : {}
  );
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [activeScreen, setActiveScreen] = useState<ScreenType>('countries');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [showCountryDetail, setShowCountryDetail] = useState(false);

  const countriesWithStatus: CountryWithStatus[] = useMemo(() => {
    return countries.map((country) => ({
      ...country,
      status: countryStatuses[country.code] || 'none',
      visitDates: visitDates[country.code] || [],
    }));
  }, [countryStatuses, visitDates]);

  const handleStatusChange = (code: string, status: CountryStatus) => {
    setCountryStatuses((prev) => ({
      ...prev,
      [code]: status,
    }));
  };

  const handleOpenDates = (code: string) => {
    setSelectedCountryCode(code);
    setIsDateModalVisible(true);
  };

  const handleOpenCountryDetail = (code: string) => {
    setSelectedCountryCode(code);
    setShowCountryDetail(true);
  };

  const handleAddDate = (visit: Omit<VisitDate, 'id'>) => {
    if (!selectedCountryCode) return;

    const newVisit: VisitDate = {
      ...visit,
      id: Date.now().toString(),
    };

    setVisitDates((prev) => ({
      ...prev,
      [selectedCountryCode]: [...(prev[selectedCountryCode] || []), newVisit],
    }));
  };

  const handleDeleteDate = (dateId: string) => {
    if (!selectedCountryCode) return;

    setVisitDates((prev) => ({
      ...prev,
      [selectedCountryCode]: (prev[selectedCountryCode] || []).filter(
        (visit) => visit.id !== dateId
      ),
    }));
  };

  const selectedCountry = countriesWithStatus.find(
    (c) => c.code === selectedCountryCode
  );

  const filteredCountries = useMemo(() => {
    let filtered = countriesWithStatus;

    // Filter by tab
    if (activeTab === 'visited') {
      filtered = filtered.filter((c) => c.status === 'visited');
    } else if (activeTab === 'wishlist') {
      filtered = filtered.filter((c) => c.status === 'wishlist');
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((c) => c.name.toLowerCase().includes(query));
    }

    return filtered;
  }, [countriesWithStatus, activeTab, searchQuery]);

  const groupedCountries = useMemo(() => {
    const groups: Record<string, CountryWithStatus[]> = {};

    filteredCountries.forEach((country) => {
      if (!groups[country.region]) {
        groups[country.region] = [];
      }
      groups[country.region].push(country);
    });

    return Object.keys(groups)
      .sort()
      .map((region) => ({
        title: region,
        data: groups[region],
      }));
  }, [filteredCountries]);

  const stats = useMemo(() => {
    const visited = countriesWithStatus.filter((c) => c.status === 'visited').length;
    const wishlist = countriesWithStatus.filter((c) => c.status === 'wishlist').length;
    return { visited, wishlist, total: countries.length };
  }, [countriesWithStatus]);

  const renderTab = (tab: TabType, label: string, count?: number) => {
    const isActive = activeTab === tab;
    return (
      <TouchableOpacity
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => setActiveTab(tab)}
        activeOpacity={0.7}
      >
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>
          {label}
          {count !== undefined && ` (${count})`}
        </Text>
      </TouchableOpacity>
    );
  };

  // Show country detail screen if active
  if (showCountryDetail && selectedCountry) {
    return (
      <CountryDetailScreen
        country={selectedCountry}
        onClose={() => setShowCountryDetail(false)}
        onOpenDates={() => {
          setShowCountryDetail(false);
          setIsDateModalVisible(true);
        }}
      />
    );
  }

  const styles = createStyles(colors);

  // Render main content based on active screen
  const renderMainContent = () => {
    switch (activeScreen) {
      case 'history':
        return (
          <HistoryScreen
            countries={countriesWithStatus}
            onClose={() => setActiveScreen('countries')}
          />
        );
      case 'stats':
        return (
          <StatsScreen
            countries={countriesWithStatus}
            onClose={() => setActiveScreen('countries')}
          />
        );
      case 'countries':
      default:
        return renderCountriesScreen();
    }
  };

  const renderCountriesScreen = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🌍 My Travels</Text>
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats.visited}</Text>
            <Text style={styles.statLabel}>Visited</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{stats.wishlist}</Text>
            <Text style={styles.statLabel}>Want to Visit</Text>
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search country..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textTertiary}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {renderTab('all', 'All', filteredCountries.length)}
        {renderTab('visited', 'Visited', stats.visited)}
        {renderTab('wishlist', 'Wishlist', stats.wishlist)}
      </View>

      {/* Country List */}
      <SectionList
        sections={groupedCountries}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <CountryCard
            country={item}
            onStatusChange={handleStatusChange}
            onOpenDates={handleOpenDates}
            onPress={handleOpenCountryDetail}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No countries found</Text>
          </View>
        }
      />
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Main Content */}
      {renderMainContent()}

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabBarItem}
          onPress={() => setActiveScreen('countries')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabBarIcon,
            activeScreen === 'countries' && styles.tabBarIconActive
          ]}>
            🌍
          </Text>
          <Text style={[
            styles.tabBarLabel,
            activeScreen === 'countries' && styles.tabBarLabelActive
          ]}>
            Countries
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarItem}
          onPress={() => setActiveScreen('history')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabBarIcon,
            activeScreen === 'history' && styles.tabBarIconActive
          ]}>
            📖
          </Text>
          <Text style={[
            styles.tabBarLabel,
            activeScreen === 'history' && styles.tabBarLabelActive
          ]}>
            History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBarItem}
          onPress={() => setActiveScreen('stats')}
          activeOpacity={0.7}
        >
          <Text style={[
            styles.tabBarIcon,
            activeScreen === 'stats' && styles.tabBarIconActive
          ]}>
            📊
          </Text>
          <Text style={[
            styles.tabBarLabel,
            activeScreen === 'stats' && styles.tabBarLabelActive
          ]}>
            Statistics
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Modal */}
      {selectedCountry && (
        <DateModal
          visible={isDateModalVisible}
          countryName={selectedCountry.name}
          visitDates={selectedCountry.visitDates || []}
          onClose={() => setIsDateModalVisible(false)}
          onAddDate={handleAddDate}
          onDeleteDate={handleDeleteDate}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

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
    paddingVertical: 8,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.primary,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 17,
    color: colors.textTertiary,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  tabBarIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  tabBarIconActive: {
    opacity: 1,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  tabBarLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
