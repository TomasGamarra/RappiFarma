import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import OpenCameraButton from '../components/OpenCameraButton';
import ButtonPrimary from '../components/ButtonPrimary';
import BottomNavigation from '../components/BottomNavigation';
import { theme } from '../styles/theme';
import Toast from "react-native-toast-message";
import { createRequestWithPhoto } from "../features/requests/actions";
import { Dimensions } from 'react-native';

  const { widthPantalla } = Dimensions.get('window');
export default function HomeScreen({ navigation }) {




  const handleScan = async (asset) => {
    try {
      const { requestId } = await createRequestWithPhoto({ imageUri: asset.uri });
      Toast.show({
        type: "success",
        text1: "Receta enviada",
        text2: `Solicitud: ${requestId}`
      });
      navigation.replace('Ofertas');
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "No se pudo enviar la receta",
        text2: e.message || ""
      });
    }
  };

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        // Ya estamos en home
        break;
      case 'profile':
        navigation.navigate('Profile');
        break;
      case 'scan':
        // La funcionalidad de escaneo está en el OpenCameraButton del BottomNavigation
        break;
      case 'ofertas':
        navigation.navigate('Ofertas');
        break;
      case 'settings':
        navigation.navigate('Ajustes');
        break;
      default:
        navigation.navigate('Home');
    }
  };

  // Componente de escaneo para el BottomNavigation
  const ScanButtonComponent = (
    <OpenCameraButton
      onPick={handleScan}
      icon={<Ionicons name="scan-outline" size={28} color="#fff" />}
      color={theme.colors.primary}
      size={60}
      style={styles.scanButton}
    />
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'offers'),
      where('userId', '==', user.uid),
      where('state', 'in', ['Aceptada', 'En preparación', 'Listo para envío', 'Enviando', 'Entregado'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(userOrders);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const getBadgeStyle = (state) => {
    switch (state) {
      case 'En preparación':
        return { backgroundColor: 'rgba(255,165,0,0.12)' }; // naranja tenue
      case 'Listo para envío':
        return { backgroundColor: 'rgba(0,123,255,0.08)' }; // celeste tenue
      case 'Enviando':
        return { backgroundColor: 'rgba(103,58,183,0.08)' }; // morado tenue
      case 'Entregado':
        return { backgroundColor: 'rgba(40,167,69,0.08)' }; // verde tenue
      default:
        return { backgroundColor: 'rgba(0,0,0,0.04)' };
    }
  };

  const getStateTextColor = (state) => {
    switch (state) {
      case 'En preparación': return { color: 'orange' };
      case 'Listo para envío': return { color: '#007bff' };
      case 'Enviando': return { color: '#6f42c1' };
      case 'Entregado': return { color: '#28a745' };
      default: return { color: theme.colors.textMuted };
    }
  };

  const renderOrder = ({ item }) => {
    const visibleState = item.state === "Aceptada" ? item.envioState || "En preparación" : item.state;


    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => setSelectedOrder(item)}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.farmaciaName} numberOfLines={1}>{item.farmacia}</Text>

          <View style={[styles.stateBadge, getBadgeStyle(visibleState)]}>
            <Text style={[styles.orderStateText, getStateTextColor(visibleState)]}>
              {visibleState}
            </Text>
          </View>
        </View>

        <Text style={styles.orderAddress} numberOfLines={2}>Direccion: {item.direccion}</Text>

        <View style={styles.orderFooter}>
          <Text style={styles.orderPrice}>💰 ${parseFloat(item.preciototal).toFixed(1)}</Text>
          <Text style={styles.orderTime}>⏱ {item.tiempoEspera || 'N/D'}</Text>
        </View>
      </TouchableOpacity>
    );
  };




  return (
    <View style={styles.container}>
      {/* ------------------- BARRA SUPERIOR ------------------- */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

          <View style={{ flex: 1 }} />
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

      {/* ------------------- CONTENIDO PRINCIPAL ------------------- */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : orders.length === 0 ? (
          <>
            <Text style={styles.title}>🏪 Bienvenido</Text>
            <Text style={styles.subtitle}>Cuidate en casa con RappiFarma</Text>
            <Text style={styles.subtitle}>No hay pedidos actualmente.</Text>
          </>
        ) : (
          <>
            <Text style={styles.titlePedidos}>Pedidos</Text>
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrder}
              contentContainerStyle={{ 
              paddingBottom: 100,
              paddingHorizontal: 0  // ✅ Sin padding horizontal extra
              }}
              style={{ width: '100%' }}  // ✅ Ocupa todo el ancho
            />
          </>
        )}
      </View>


      {/* ------------------- MODAL DE DETALLE ------------------- */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Detalle del pedido</Text>

            {selectedOrder && (
              <ScrollView>
                <Text style={styles.farmaciaName}> Dirección: {selectedOrder.direccion}</Text>
                <Text style={styles.farmaciaName}> Farmacia: {selectedOrder.farmacia}</Text>
                <Text style={styles.farmaciaName}> Total: ${selectedOrder.preciototal}</Text>
                <Text style={styles.farmaciaName}> Tiempo estimado: {selectedOrder.tiempoEspera || 'N/D'} min</Text>
                <Text style={styles.farmaciaName}> Estado: {selectedOrder.state === "Aceptada"
                  ? selectedOrder.envioState || "En preparación"
                  : selectedOrder.state}</Text>

                <Text style={{ marginTop: 20, fontWeight: 'bold', fontSize: 20, marginBottom: 5 }}>Medicamentos:</Text>
                {selectedOrder.medicamentos?.map((m, i) => (
                  <Text style={styles.farmaciaName} key={i}>• {m.nombreydosis} (x{m.cantidad}) - Precio unitario = ${m.subtotal / m.cantidad}</Text>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedOrder(null)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* ------------------- BARRA INFERIOR CON SCAN FUNCIONAL ------------------- */}
      <BottomNavigation
        currentScreen="home"
        onNavigate={handleNavigation}
        scanComponent={ScanButtonComponent}
      />

      <StatusBar style="auto" />
    </View>
  );
}

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

  logoButton: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },

  /* --- Título principal (cuando no hay pedidos) --- */
  title: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },

  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },

  /* --- Título "Pedidos" --- */
  titlePedidos: {
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.text,  // negro
    textAlign: 'center',
    marginTop: 18,             // más separado de la barra superior
    marginBottom: 12,
  },

  cameraButtonContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },

  cameraButtonText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },

  scanButton: {
    marginTop: -theme.spacing.lg,
  },

  iconButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
  },

  /* --- Cada pedido (card) --- */
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginHorizontal: 16,  // ✅ Esto hace que se adapte al ancho
    width: 'auto',         // ✅ Se ajusta automáticamente
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    minHeight: 110,
    justifyContent: 'center',
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',     // centra verticalmente el estado
    marginBottom: 10,
  },

  farmaciaName: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
    flex: 1,
    marginRight: 10,
  },

  /* --- Badge de estado --- */
  stateBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
  },

  orderStateText: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },

  orderAddress: {
    color: theme.colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },

  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },

  orderTime: {
    fontSize: 15,
    color: theme.colors.textMuted,
  },

  /* --- Modal de detalle --- */
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '80%',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  closeButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
});
