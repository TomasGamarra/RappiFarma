import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput ,ScrollView} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';


export default function OfertasScreen( { navigation }) {
  return (
    <View style={styles.container}>
      {/* ------------------- BARRA SUPERIOR ------------------- */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          {/* Spacer para ordenar iconos */}
          <View style={{ flex: 1 }}/>
        </View>
        


        <View style={styles.centerSection}>
          <TouchableOpacity style={styles.logoButton}>
            <Text style={styles.logoText}>RappiFarma</Text>
          </TouchableOpacity>
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

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>
        
        {/* SECCIÓN DE FILTROS */}
        <View style={styles.filtersSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color={theme.colors.textMuted} />
            <TextInput 
              placeholder="Buscar farmacias..."
              placeholderTextColor={theme.colors.textMuted}
              style={styles.searchInput}
            />
          </View>
          
          <View style={styles.filterChips}>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Cercanas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>24 horas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterChipText}>Descuentos</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SECCIÓN DE OFERTAS */}
        <View style={styles.offersHeader}>
          <Text style={styles.offersText}>Recibiste 4 ofertas</Text>
        </View>

        {/* LISTA DE FARMACIAS */}
        <ScrollView 
          style={styles.pharmaciesList}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity style={styles.pharmacyCard}>
            <View style={styles.pharmacyIcon}>
              <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>Farmacia ABC</Text>
              <Text style={styles.pharmacyDetails}>24h • 1.2 km • Envío gratis</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.pharmacyCard}>
            <View style={styles.pharmacyIcon}>
              <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>Farmacia XYZ</Text>
              <Text style={styles.pharmacyDetails}>Abierto • 0.8 km • 15% descuento</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.pharmacyCard}>
            <View style={styles.pharmacyIcon}>
              <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>Farmacia 24/7</Text>
              <Text style={styles.pharmacyDetails}>24h • 0.5 km • Delivery express</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.pharmacyCard}>
            <View style={styles.pharmacyIcon}>
              <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.pharmacyInfo}>
              <Text style={styles.pharmacyName}>FarmaPlus</Text>
              <Text style={styles.pharmacyDetails}>Abierto • 1.8 km • 20% descuento</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/*-------------BARRA INFERIOR----------*/}
      <View style={styles.bottomBar}>
        <View style={styles.leftSection}>     
          <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.replace('Home')}>
            <Ionicons name="home-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.iconTextSecondary}>Home</Text>
          </TouchableOpacity>
      
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.iconTextSecondary}>Perfil</Text>
          </TouchableOpacity>
        </View>
      
      {/* Spacer para ordenar iconos */}
        <View style={{ flex: 1 }}/>  
      
        <View style={styles.rightSection}>                
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.navigate('Ofertas')}>
              <Ionicons name="time-sharp" size={32} color={theme.colors.primary} />
              <Text style={styles.iconTextPrimary}>Ofertas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.iconTextSecondary}>Ajustes</Text>
          </TouchableOpacity>      
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background2,
    justifyContent: 'space-between',

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
    alignItems: 'flex-start',
    justifyContent: 'space-around',
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
    justifyContent: 'space-around',

  },
  logoText: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  filtersSection: {
    marginBottom: theme.spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background2,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchInput: {
    flex: 1, 
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    backgroundColor: theme.colors.primary + '15', // Color con transparencia
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '30',
  },
  filterChipText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  offersHeader: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  offersText: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  pharmaciesList: {
    flex: 1,
  },
  pharmacyCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.background2,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  pharmacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  pharmacyInfo: {
    flex: 1,
  },
  pharmacyName: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  pharmacyDetails: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textMuted,
  },
   logoButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
   iconButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderColor: theme.colors.background,
    position: 'relative',
  },
  iconTextSecondary: {
    fontSize: theme.typography.fontSize.small,
    marginTop: 2 , //Espacio entre icono y texto del icono
    color: theme.colors.textMuted
  },
  iconTextPrimary: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: 2 , //Espacio entre icono y texto del icono
    color: theme.colors.primary 
   },
});