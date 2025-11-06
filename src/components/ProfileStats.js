import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const StatItem = ({ numero, label }) => {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{numero}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

const ProfileStats = ({ estadisticas }) => {
  return (
    <View style={styles.statsContainer}>
      <StatItem numero={estadisticas.pedidos} label="Pedidos" />
      <StatItem numero={estadisticas.direcciones} label="Dirección" />
      <StatItem numero={estadisticas.rating} label="Rating" />
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textMuted,
  },
});

export default ProfileStats;