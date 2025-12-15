import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { VisitDate, DateGranularity, TransportationType } from '../types';
import { DatePicker } from './DatePicker';
import { formatVisitDate } from '../utils/dateFormatter';
import { useTheme } from '../theme/ThemeContext';

interface DateModalProps {
  visible: boolean;
  countryName: string;
  visitDates: VisitDate[];
  onClose: () => void;
  onAddDate: (visit: Omit<VisitDate, 'id'>) => void;
  onDeleteDate: (id: string) => void;
}

const TRANSPORTATION_OPTIONS: { value: TransportationType; label: string; emoji: string }[] = [
  { value: 'plane', label: 'Plane', emoji: '✈️' },
  { value: 'train', label: 'Train', emoji: '🚂' },
  { value: 'car', label: 'Car', emoji: '🚗' },
  { value: 'bus', label: 'Bus', emoji: '🚌' },
];

export const DateModal: React.FC<DateModalProps> = ({
  visible,
  countryName,
  visitDates,
  onClose,
  onAddDate,
  onDeleteDate,
}) => {
  const { colors } = useTheme();

  const [arrivalDate, setArrivalDate] = useState<{
    year: number;
    month?: number;
    day?: number;
  } | null>(null);

  const [departureDate, setDepartureDate] = useState<{
    year: number;
    month?: number;
    day?: number;
  } | null>(null);

  const [note, setNote] = useState('');
  const [showDeparture, setShowDeparture] = useState(false);
  const [transportation, setTransportation] = useState<TransportationType | undefined>(undefined);

  const handleAdd = () => {
    if (!arrivalDate) return;

    const granularity: DateGranularity = arrivalDate.day
      ? 'day'
      : arrivalDate.month
      ? 'month'
      : 'year';

    onAddDate({
      arrivalDate,
      departureDate: showDeparture ? departureDate || undefined : undefined,
      granularity,
      transportation,
      note: note.trim() || undefined,
    });

    // Reset form
    setArrivalDate(null);
    setDepartureDate(null);
    setNote('');
    setShowDeparture(false);
    setTransportation(undefined);
  };

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Visit Dates</Text>
              <Text style={styles.countryName}>{countryName}</Text>
            </View>

            {/* Existing Dates List */}
            <View style={styles.datesList}>
              <Text style={styles.sectionTitle}>Your Visits:</Text>
              {visitDates.length === 0 ? (
                <Text style={styles.emptyText}>No dates added</Text>
              ) : (
                visitDates.map((visit) => {
                  const transportInfo = TRANSPORTATION_OPTIONS.find(t => t.value === visit.transportation);
                  return (
                    <View key={visit.id} style={styles.dateItem}>
                      <View style={styles.dateInfo}>
                        <View style={styles.dateHeader}>
                          <Text style={styles.dateText}>{formatVisitDate(visit)}</Text>
                          {transportInfo && (
                            <Text style={styles.transportBadge}>
                              {transportInfo.emoji} {transportInfo.label}
                            </Text>
                          )}
                        </View>
                        {visit.note && <Text style={styles.noteText}>{visit.note}</Text>}
                      </View>
                      <TouchableOpacity
                        onPress={() => onDeleteDate(visit.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </View>

            {/* Add New Visit Form */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Add New Visit:</Text>

              {/* Arrival Date Picker */}
              <DatePicker
                label="Arrival Date"
                onDateSelect={setArrivalDate}
                initialDate={arrivalDate || undefined}
              />

              {/* Toggle Departure Date */}
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={() => setShowDeparture(!showDeparture)}
              >
                <Text style={styles.toggleButtonText}>
                  {showDeparture ? '✓ Include departure date' : '+ Add departure date (optional)'}
                </Text>
              </TouchableOpacity>

              {/* Departure Date Picker */}
              {showDeparture && (
                <DatePicker
                  label="Departure Date"
                  onDateSelect={setDepartureDate}
                  initialDate={departureDate || undefined}
                />
              )}

              {/* Transportation Selector */}
              <View style={styles.transportationSection}>
                <Text style={styles.selectorLabel}>Transportation (optional):</Text>
                <View style={styles.transportationOptions}>
                  {TRANSPORTATION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.transportOption,
                        transportation === option.value && styles.transportOptionSelected,
                      ]}
                      onPress={() =>
                        setTransportation(
                          transportation === option.value ? undefined : option.value
                        )
                      }
                    >
                      <Text style={styles.transportEmoji}>{option.emoji}</Text>
                      <Text
                        style={[
                          styles.transportLabel,
                          transportation === option.value && styles.transportLabelSelected,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Note Input */}
              <TextInput
                style={styles.input}
                placeholder="Note (optional)"
                value={note}
                onChangeText={setNote}
                placeholderTextColor="#999"
                multiline
              />

              {/* Add Button */}
              <TouchableOpacity
                style={[styles.addButton, !arrivalDate && styles.addButtonDisabled]}
                onPress={handleAdd}
                disabled={!arrivalDate}
              >
                <Text style={styles.addButtonText}>Add Visit</Text>
              </TouchableOpacity>
            </View>

            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  scrollContainer: {
    maxHeight: '90%',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  modal: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: colors.surface,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  countryName: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 4,
  },
  datesList: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textTertiary,
    padding: 20,
    fontSize: 15,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  dateInfo: {
    flex: 1,
  },
  dateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  dateText: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  transportBadge: {
    fontSize: 12,
    backgroundColor: colors.primary,
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontWeight: '500',
  },
  noteText: {
    fontSize: 15,
    color: colors.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: colors.error,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  formSection: {
    padding: 16,
  },
  toggleButton: {
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  toggleButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background,
    color: colors.text,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 17,
    marginBottom: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderLight,
  },
  addButton: {
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: colors.textTertiary,
    opacity: 0.5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: colors.surface,
    padding: 16,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  closeButtonText: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  transportationSection: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 10,
    fontWeight: '500',
  },
  transportationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  transportOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  transportOptionSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  transportEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  transportLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  transportLabelSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});
