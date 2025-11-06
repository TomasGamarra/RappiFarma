import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const NavItem = ({ icon, label, isActive, onPress, isScanButton = false, scanComponent }) => {
  if (isScanButton) {
    return (
      <View style={styles.scanButtonContainer}>
        {scanComponent ? (
          // Si hay un componente de escaneo personalizado, lo mostramos
          React.cloneElement(scanComponent, {
            style: [styles.scanButton, scanComponent.props.style]
          })
        ) : (
          // Si no, mostramos el botón por defecto (no funcional)
          <View style={styles.scanButton}>
            <View style={[styles.scanButtonCircle, styles.scanButtonDisabled]}>
              <Ionicons name={icon} size={28} color={theme.colors.textMuted} />
            </View>
            <Text style={styles.scanButtonTextDisabled}>
              {label}
            </Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress}>
      <Ionicons 
        name={icon} 
        size={theme.typography.fontSize.large} 
        color={isActive ? theme.colors.primary : theme.colors.textMuted} 
      />
      <Text style={[
        styles.navLabel,
        isActive ? styles.navLabelActive : styles.navLabelInactive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const BottomNavigation = ({ currentScreen, onNavigate, scanComponent }) => {
  const navItems = [
    { id: 'home', icon: 'home-outline', label: 'Home' },
    { id: 'profile', icon: 'person-outline', label: 'Perfil' },
    { id: 'scan', icon: 'scan-outline', label: 'Escanear', isScanButton: true },
    { id: 'ofertas', icon: 'pricetag-outline', label: 'Ofertas' },
    { id: 'settings', icon: 'settings-outline', label: 'Ajustes' },
  ];

  return (
    <View style={styles.navContainer}>
      {navItems.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={currentScreen === item.id}
          isScanButton={item.isScanButton}
          onPress={() => onNavigate(item.id)}
          scanComponent={item.isScanButton ? scanComponent : null}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start', // Cambiado para mejor alineación
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm, // Aumentado para consistencia
    borderTopWidth: 1,
    borderTopColor: theme.colors.background2,
    shadowColor: theme.colors.text,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 8,
    minHeight: 70, // Altura mínima consistente
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    flex: 1,
    minHeight: 50, // Altura mínima para items
  },
  scanButtonContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start', // Alineación consistente
    flex: 1,
    minHeight: 70, // Misma altura que los otros items
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -theme.spacing.lg, // Mismo margen siempre
  },
  scanButtonCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: theme.colors.background,
  },
  scanButtonDisabled: {
    backgroundColor: theme.colors.background2,
    borderColor: theme.colors.background2,
    shadowColor: theme.colors.textMuted,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  scanButtonText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  scanButtonTextDisabled: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  navLabel: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.medium,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  navLabelActive: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  navLabelInactive: {
    color: theme.colors.textMuted,
  },
});

export default BottomNavigation;