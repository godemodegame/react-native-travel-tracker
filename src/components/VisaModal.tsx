import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';
import { Visa, VisaType } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface VisaModalProps {
  visible: boolean;
  countryCode: string;
  countryName: string;
  existingVisa?: Visa;
  onClose: () => void;
  onSave: (visa: Omit<Visa, 'id'>) => void;
}

export const VisaModal: React.FC<VisaModalProps> = ({
  visible,
  countryCode,
  countryName,
  existingVisa,
  onClose,
  onSave,
}) => {
  const { colors } = useTheme();
  const today = new Date();

  const [visaType, setVisaType] = useState<VisaType>(existingVisa?.type || 'tourist');
  const [issueYear, setIssueYear] = useState(
    existingVisa?.issueDate.year.toString() || today.getFullYear().toString()
  );
  const [issueMonth, setIssueMonth] = useState(
    existingVisa?.issueDate.month.toString() || (today.getMonth() + 1).toString()
  );
  const [issueDay, setIssueDay] = useState(
    existingVisa?.issueDate.day.toString() || today.getDate().toString()
  );

  const [expiryYear, setExpiryYear] = useState(
    existingVisa?.expiryDate.year.toString() || (today.getFullYear() + 1).toString()
  );
  const [expiryMonth, setExpiryMonth] = useState(
    existingVisa?.expiryDate.month.toString() || (today.getMonth() + 1).toString()
  );
  const [expiryDay, setExpiryDay] = useState(
    existingVisa?.expiryDate.day.toString() || today.getDate().toString()
  );

  const [maxStayDays, setMaxStayDays] = useState(
    existingVisa?.maxStayDays.toString() || '90'
  );
  const [totalDaysUsed, setTotalDaysUsed] = useState(
    existingVisa?.totalDaysUsed.toString() || '0'
  );
  const [multipleEntry, setMultipleEntry] = useState(existingVisa?.multipleEntry ?? true);
  const [isSchengen, setIsSchengen] = useState(existingVisa?.isSchengen ?? false);
  const [note, setNote] = useState(existingVisa?.note || '');

  const handleSave = () => {
    const visa: Omit<Visa, 'id'> = {
      countryCode,
      type: visaType,
      isSchengen,
      issueDate: {
        year: parseInt(issueYear),
        month: parseInt(issueMonth),
        day: parseInt(issueDay),
      },
      expiryDate: {
        year: parseInt(expiryYear),
        month: parseInt(expiryMonth),
        day: parseInt(expiryDay),
      },
      maxStayDays: parseInt(maxStayDays),
      totalDaysUsed: parseInt(totalDaysUsed),
      multipleEntry,
      note: note.trim() || undefined,
    };

    onSave(visa);
    onClose();
  };

  const visaTypes: { value: VisaType; label: string }[] = [
    { value: 'tourist', label: 'Tourist' },
    { value: 'business', label: 'Business' },
    { value: 'work', label: 'Work' },
    { value: 'student', label: 'Student' },
    { value: 'other', label: 'Other' },
  ];

  const styles = createStyles(colors);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>
            {existingVisa ? 'Edit Visa' : 'Add Visa'} - {countryName}
          </Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Visa Type */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Visa Type</Text>
            <View style={styles.typeGrid}>
              {visaTypes.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.typeButton,
                    visaType === type.value && styles.typeButtonActive,
                  ]}
                  onPress={() => setVisaType(type.value)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      visaType === type.value && styles.typeButtonTextActive,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Issue Date */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issue Date</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={issueYear}
                  onChangeText={setIssueYear}
                  keyboardType="number-pad"
                  placeholder="2024"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Month</Text>
                <TextInput
                  style={styles.input}
                  value={issueMonth}
                  onChangeText={setIssueMonth}
                  keyboardType="number-pad"
                  placeholder="1-12"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Day</Text>
                <TextInput
                  style={styles.input}
                  value={issueDay}
                  onChangeText={setIssueDay}
                  keyboardType="number-pad"
                  placeholder="1-31"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>

          {/* Expiry Date */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expiry Date</Text>
            <View style={styles.dateRow}>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Year</Text>
                <TextInput
                  style={styles.input}
                  value={expiryYear}
                  onChangeText={setExpiryYear}
                  keyboardType="number-pad"
                  placeholder="2025"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Month</Text>
                <TextInput
                  style={styles.input}
                  value={expiryMonth}
                  onChangeText={setExpiryMonth}
                  keyboardType="number-pad"
                  placeholder="1-12"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>Day</Text>
                <TextInput
                  style={styles.input}
                  value={expiryDay}
                  onChangeText={setExpiryDay}
                  keyboardType="number-pad"
                  placeholder="1-31"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>

          {/* Stay Duration */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Stay Duration</Text>
            {isSchengen && (
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  ℹ️ For Schengen visas, count days spent in ALL Schengen countries combined
                </Text>
              </View>
            )}
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Max Days Allowed</Text>
                <TextInput
                  style={styles.input}
                  value={maxStayDays}
                  onChangeText={setMaxStayDays}
                  keyboardType="number-pad"
                  placeholder="90"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>
                  Days Used{isSchengen ? ' (All Schengen)' : ''}
                </Text>
                <TextInput
                  style={styles.input}
                  value={totalDaysUsed}
                  onChangeText={setTotalDaysUsed}
                  keyboardType="number-pad"
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>
            </View>
          </View>

          {/* Schengen Visa */}
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Schengen Visa</Text>
                <Text style={styles.switchSubtitle}>
                  Valid for all Schengen countries (not just {countryName})
                </Text>
              </View>
              <Switch
                value={isSchengen}
                onValueChange={setIsSchengen}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>

          {/* Multiple Entry */}
          <View style={styles.section}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.sectionTitle}>Multiple Entry</Text>
                <Text style={styles.switchSubtitle}>
                  Can you enter multiple times?
                </Text>
              </View>
              <Switch
                value={multipleEntry}
                onValueChange={setMultipleEntry}
                trackColor={{ false: colors.borderLight, true: colors.primary }}
                thumbColor={colors.surface}
              />
            </View>
          </View>

          {/* Note */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={note}
              onChangeText={setNote}
              placeholder="Add any additional information..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>
      </View>
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
      color: colors.textSecondary,
    },
    saveButton: {
      fontSize: 17,
      fontWeight: '600',
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    section: {
      backgroundColor: colors.surface,
      padding: 16,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    typeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    typeButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderLight,
    },
    typeButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
    },
    typeButtonTextActive: {
      color: '#fff',
    },
    dateRow: {
      flexDirection: 'row',
      gap: 8,
    },
    dateInput: {
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      gap: 12,
    },
    halfInput: {
      flex: 1,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
      marginBottom: 6,
    },
    input: {
      backgroundColor: colors.background,
      color: colors.text,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      fontSize: 15,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.borderLight,
    },
    textArea: {
      minHeight: 100,
      paddingTop: 12,
    },
    switchRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    switchSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 4,
    },
    infoBox: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 12,
    },
    infoText: {
      fontSize: 13,
      color: colors.primary,
      lineHeight: 18,
    },
  });
