
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, getDocs, doc, deleteDoc, updateDoc, setDoc, collectionGroup, documentId } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { auth } from '../lib/firebase';
import BottomNavigation from '../components/BottomNavigation';


export default function OfertasScreen({ navigation }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('monto');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);


  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "offers"),
      where("userId", "==", user.uid),
      where("state", "==", "Pendiente")
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


  //comentario inutil

  // Ordenamiento justo antes de renderizar
  const sortedOffers = [...offers].sort((a, b) => {
    if (sortBy === 'monto') return a.preciototal - b.preciototal;
    if (sortBy === 'tiempoEspera') return a.tiempoEspera - b.tiempoEspera;
    return 0;
  });


  // Navegación del Bottom Navigation
  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        navigation.replace('Home');
        break;
      case 'profile':
        navigation.replace('Profile');
        break;
      case 'scan':
        navigation.replace('Home'); // Redirigir al home para escanear
        break;
      case 'ofertas':
        // Ya estamos en ofertas
        break;
      case 'settings':
        navigation.replace('Ajustes');
        break;
      default:
        navigation.replace('Home');
    }
  };

  const handleAccept = async (selectedOffer) => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) throw new Error("NO_AUTH");
      const rid = String(selectedOffer?.requestId || "");

      // 0) Aceptar la oferta elegida
      await updateDoc(doc(db, "offers", selectedOffer.id), {
        state: "Aceptada",
        envioState: "En preparación",
      });

      // 1) Recolectar TODOS los IDs de farmacias desde /users
      const qPharms = query(collection(db, "users"), where("role", "==", "farmacia"));
      const phSnap = await getDocs(qPharms);
      const farmaciaIds = phSnap.docs.map(d => String(d.id));

      // 2) Traer ofertas pendientes del usuario y borrarlas excepto la aceptada
      const qPend = query(
        collection(db, "offers"),
        where("userId", "==", uid),
        where("state", "==", "Pendiente")
      );
      const pendSnap = await getDocs(qPend);
      await Promise.all(
        pendSnap.docs.map(d => d.id !== selectedOffer.id
          ? deleteDoc(doc(db, "offers", d.id))
          : Promise.resolve())
      );

      // 3) Borrar punteros en /inbox/{farmaciaId}/requests/{requestId}
      if (rid) {
        await Promise.all(
          farmaciaIds.map(fid =>
            deleteDoc(doc(db, "inbox", fid, "requests", rid))
              .catch(e => console.warn(`No se pudo borrar inbox/${fid}/requests/${rid}:`, e?.code || e?.message))
          )
        );
      }

      // 4) Borrar la request raíz
      if (rid) {
        await deleteDoc(doc(db, "requests", rid));
      }

      Alert.alert("✅ Oferta aceptada", "Se confirmó tu pedido.");
      setOffers([]);
    } catch (error) {
      console.error("Error al aceptar oferta:", error);
      Alert.alert("Error", "No se pudo aceptar la oferta. Intenta de nuevo.");
    }
  };




  const handleReject = async (offer) => {
    try {
      await deleteDoc(doc(db, "offers", offer.id));
    } catch (error) {
      console.error("Error al eliminar oferta:", error);
      Alert.alert("Error", "No se pudo rechazar la oferta. Intenta nuevamente.");
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
          <View style={{ flex: 1 }} />
        </View>

        <View style={styles.centerSection}>
          <Text style={styles.logoText}>Ofertas</Text>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color={theme.colors.primary} />
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
              <TouchableOpacity key={offer.id} style={styles.pharmacyCard} onPress={() => setSelectedOffer(offer)}>
                <View style={styles.pharmacyIcon}>
                  <Ionicons name="medical-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.pharmacyInfo}>
                  <Text style={styles.pharmacyName}>{offer.farmacia}</Text>
                  <Text style={styles.pharmacyDetails}>
                    {offer.direccion} • ${offer.preciototal} • {offer.tiempoEspera} min
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

              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
      {/* ------------------- MODAL DE DETALLE DE OFERTA ------------------- */}
      <Modal
        visible={!!selectedOffer}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOffer(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalle de la oferta</Text>

            {selectedOffer && (
              <ScrollView>
                <Text style={styles.farmaciaName}> Dirección: {selectedOffer.direccion}</Text>
                <Text style={styles.farmaciaName}> Farmacia: {selectedOffer.farmacia}</Text>
                <Text style={styles.farmaciaName}> Total: ${selectedOffer.preciototal}</Text>
                <Text style={styles.farmaciaName}> Tiempo estimado: {selectedOffer.tiempoEspera || 'N/D'} min</Text>

                <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 20, marginBottom: theme.spacing.md, textAlign: 'center' }}>Medicamentos</Text>
                {selectedOffer.medicamentos?.map((m, i) => (
                  <Text style={styles.farmaciaName} key={i}>
                    • {m.nombreydosis} (x{m.cantidad}) - Precio unitario = ${m.subtotal / m.cantidad}
                  </Text>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOffer(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BOTTOM NAVIGATION ACTUALIZADO */}
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
    gap: 10,
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
    backgroundColor: '#e6ffe6',
  },
  rejectButton: {
    backgroundColor: '#ffe6e6',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    width: '90%',
    maxHeight: '80%',
    elevation: 5,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  farmaciaName: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  closeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
});