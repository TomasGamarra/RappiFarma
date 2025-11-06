import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const OptionItem = ({ icon, title, onPress, isLast = false }) => {
  return (
    <TouchableOpacity style={[styles.optionItem, isLast && styles.lastItem]} onPress={onPress}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} style={styles.optionIcon} />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
    </TouchableOpacity>
  );
};

const OptionsList = ({ secciones, onOptionPress }) => {
  return (
    <ScrollView style={styles.optionsContainer}>
      {secciones.map((seccion, index) => (
        <View key={seccion.titulo} style={styles.section}>
          <Text style={styles.sectionTitle}>{seccion.titulo}</Text>
          <View style={styles.sectionContent}>
            {seccion.opciones.map((opcion, opcionIndex) => (
              <OptionItem
                key={opcion.title}
                icon={opcion.icon}
                title={opcion.title}
                onPress={() => onOptionPress(opcion)}
                isLast={opcionIndex === seccion.opciones.length - 1}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    flex: 1,
    backgroundColor: theme.colors.background2,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  sectionContent: {
    backgroundColor: theme.colors.background,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: theme.spacing.md,
    width: 24,
  },
  optionText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
  },
});

export default OptionsList;