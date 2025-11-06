import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import OpenCameraButton from '../components/OpenCameraButton';
import ButtonPrimary from '../components/ButtonPrimary';
import BottomNavigation from '../components/BottomNavigation';
import { theme } from '../styles/theme';
import Toast from "react-native-toast-message";
import { createRequestWithPhoto } from "../features/requests/actions";

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

  return (
    <View style={styles.container}>
      {/* ------------------- BARRA SUPERIOR ------------------- */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="menu-outline" size={28} color={theme.colors.primary} />
          </TouchableOpacity>

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

      {/* ------------------- CONTENIDO PRINCIPAL ------------------- */}
      <View style={styles.content}>
        <Text style={styles.title}>🏪 Bienvenido</Text>
        <Text style={styles.subtitle}>Cuidate en casa con RappiFarma</Text>

        <ButtonPrimary
          title="Enviar pedido"
          onPress={() => console.log('Pedido enviado')}
          style={{ marginTop: 20 }}
        />

        {/* Opcional: Botón de cámara adicional en el contenido */}
        <View style={styles.cameraButtonContainer}>
          <OpenCameraButton
            onPick={handleScan}
            icon={<Ionicons name="scan-outline" size={32} color="#fff" />}
            color={theme.colors.primary}
            size={70}
          />
          <Text style={styles.cameraButtonText}>Escanear receta</Text>
        </View>
      </View>

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
});