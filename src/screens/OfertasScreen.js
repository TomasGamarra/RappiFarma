
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import BottomNavigation from '../components/BottomNavigation';


export default function OfertasScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('monto');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "offers"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const offersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(offersData);
      setLoading(false);
    }, (error) => {
      console.error("Error al escuchar cambios en ofertas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Funciones para manejar aceptar/rechazar ofertas
  const handleAccept = (offer) => {
    console.log('Oferta aceptada:', offer);
    // Aquí va tu lógica para aceptar la oferta
  };

  const handleReject = (offer) => {
    console.log('Oferta rechazada:', offer);
    // Aquí va tu lógica para rechazar la oferta
  };

  // Ordenamiento justo antes de renderizar
  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'monto') return a.monto - b.monto;
    if (sortBy === 'tiempoEspera') return a.tiempoEspera - b.tiempoEspera;
    return 0;
  });

  // Navegación del Bottom Navigation
  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'scan':
        navigation.navigate('Home'); // Redirigir al home para escanear
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

      {/* CONTENIDO PRINCIPAL */}
      <View style={styles.content}>

        {/* ------------------- SECCIÓN DE FILTROS ------------------- */}
        {!loading && (<>
          {/* BOTÓN DE FILTRO */}
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowSortMenu(!showSortMenu)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Filtrar</Text>
          </TouchableOpacity>

          {/* MENÚ DE SELECCIÓN */}
          {showSortMenu && (
            <View style={styles.sortMenu}>
              <TouchableOpacity
                onPress={() => { setSortBy('monto'); setShowSortMenu(false); }}
              >
                <Text style={{ fontWeight: 'bold', color: theme.colors.text, paddingVertical: 4 }}>
                  Ordenar por Monto
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => { setSortBy('tiempoEspera'); setShowSortMenu(false); }}
              >
                <Text style={{ fontWeight: 'bold', color: theme.colors.text, paddingVertical: 4 }}>
                  Ordenar por Tiempo
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
        )}

        {/* SECCIÓN DE OFERTAS */}
        <Text style={styles.offersText}>
          {loading ? "Cargando ofertas..." : `Recibiste ${offers.length} oferta${offers.length !== 1 ? "s" : ""}`}
        </Text>


        {/* LISTA DE FARMACIAS */}
        <ScrollView
          style={styles.pharmaciesList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 15 }}
        >
          {loading ? (
            <Text style={{ textAlign: "center", color: theme.colors.textMuted }}>
              Cargando ofertas...
            </Text>
          ) : offers.length === 0 ? (
            <Text style={{ textAlign: "center", color: theme.colors.textMuted }}>
              Aún no hay ofertas disponibles. Recibirás una notificación cuando lleguen
            </Text>
          ) : (

            sortedOffers.map((offer) => (
              <View key={offer.id} style={styles.pharmacyCard}>
                <View style={styles.pharmacyIcon}>
                  <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.pharmacyInfo}>
                  <Text style={styles.pharmacyName}>{offer.farmacia}</Text>
                  <Text style={styles.pharmacyDetails}>
                    {offer.direccion} • ${offer.monto} • {offer.tiempoEspera} min
                  </Text>
                  <Text style={styles.productText}>{offer.nombreProducto}</Text>
                </View>

                {/* Botones de acción */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAccept(offer)}
                  >
                    <Ionicons name="checkmark" size={28} color="green" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleReject(offer)}
                  >
                    <Ionicons name="close" size={28} color="red" />
                  </TouchableOpacity>
                </View>

              </View>
            ))

          )}

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
  offersHeader: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  offersText: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
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
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  filterButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    zIndex: 1000,
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  filterButtonText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.small,
  },
  sortMenu: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    elevation: 5,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
    borderWidth: 1,
    borderColor: theme.colors.background2,
  },
  sortOption: {
    paddingVertical: theme.spacing.sm,
  },
  sortOptionText: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    fontSize: theme.typography.fontSize.medium,
  },
  pharmaciesList: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.sm,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  loadingText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.medium,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.fontSize.small,
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
    marginBottom: 2,
  },
  productText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  acceptButton: {
    backgroundColor: '#e6ffe6',
  },
  rejectButton: {
    backgroundColor: '#ffe6e6',
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
    marginTop: 2, //Espacio entre icono y texto del icono
    color: theme.colors.textMuted
  },
  iconTextPrimary: {
    fontSize: theme.typography.fontSize.small,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: 2, //Espacio entre icono y texto del icono
    color: theme.colors.primary
  },
  filterButton: {

    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.md,
    zIndex: 1000,

  },
  sortMenu: {
    position: 'absolute',
    top: 50, // debajo del botón
    right: 10,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    elevation: 5,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 1000,
  },
  actionButtons: {
    flexDirection: 'row',          // ← los coloca horizontalmente
    alignItems: 'center',
    justifyContent: 'flex-end',    // los alinea a la derecha del card
    gap: 10,                       // espacio entre los botones (RN 0.71+)
  },

  actionButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },

  acceptButton: {
    backgroundColor: '#e6ffe6', // fondo suave verde
  },

  rejectButton: {
    backgroundColor: '#ffe6e6', // fondo suave rojo
  },
});