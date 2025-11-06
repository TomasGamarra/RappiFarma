import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import BottomNavigation from '../components/BottomNavigation';

const OfertasScreen = ({ navigation }) => {
  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'scan':
        // Redirigir al home para escanear
        navigation.navigate('Home');
        break;
      case 'ofertas':
        // Ya estamos en ofertas
        break;
      case 'settings':
        navigation.navigate('Ajustes');
        break;
      default:
        navigation.navigate('Home');
    }
  };

  // Datos de ejemplo para ofertas
  const ofertas = [
    { id: 1, farmacia: 'Farmacia ABC', descuento: '20%', descripcion: 'En productos seleccionados' },
    { id: 2, farmacia: 'Farmacia XYZ', descuento: '15%', descripcion: 'En tu primera compra' },
    { id: 3, farmacia: 'FarmaPlus', descuento: '10%', descripcion: 'Envío gratis + descuento' },
  ];

  return (
    <View style={styles.container}>
      {/* Barra Superior */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}/>
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.logoText}>Ofertas</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={28} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenido Principal */}
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Ofertas Disponibles</Text>
        <Text style={styles.subtitle}>Encuentra las mejores promociones en farmacias cercanas</Text>
        
        {ofertas.map((oferta) => (
          <View key={oferta.id} style={styles.ofertaCard}>
            <View style={styles.ofertaHeader}>
              <Text style={styles.farmaciaNombre}>{oferta.farmacia}</Text>
              <View style={styles.descuentoBadge}>
                <Text style={styles.descuentoText}>{oferta.descuento}</Text>
              </View>
            </View>
            <Text style={styles.ofertaDescripcion}>{oferta.descripcion}</Text>
            <TouchableOpacity style={styles.verOfertaButton}>
              <Text style={styles.verOfertaText}>Ver oferta</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Navigation - SIN scanComponent */}
      <BottomNavigation 
        currentScreen="ofertas" 
        onNavigate={handleNavigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background2,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
    elevation: 4,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  logoText: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  iconButton: {
    padding: theme.spacing.sm,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  ofertaCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background2,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  ofertaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  farmaciaNombre: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  descuentoBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  descuentoText: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  ofertaDescripcion: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.md,
  },
  verOfertaButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  verOfertaText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.small,
  },
});

export default OfertasScreen;