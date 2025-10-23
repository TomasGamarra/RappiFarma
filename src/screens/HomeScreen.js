import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import OpenCameraButton from '../components/OpenCameraButton'; // 👈 tu botón cámara
import ButtonPrimary from '../components/ButtonPrimary'; // 👈 tu botón genérico
import { theme } from '../styles/theme';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* ------------------- BARRA SUPERIOR ------------------- */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="menu-outline" size={28} color= {theme.colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoButton}>
          <Text style={styles.logoText}>RappiFarma</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
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
      </View>

      {/* ------------------- BARRA INFERIOR ------------------- */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={32} color={theme.colors.primary} />
          <Text style={styles.iconText}>Perfil</Text>
        </TouchableOpacity>

        {/* Ícono central: abre la cámara */}
        <View style={styles.cameraButtonWrapper}>
          <OpenCameraButton
            onPick={(asset) => console.log('📷 Foto tomada:', asset.uri)}
            icon={<Ionicons name="scan-outline" size={32} color="#fff" />} //Nose q hace este color
            color={theme.colors.primary} // color tipo Mercado Libre
            size={70}
          />
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={32} color={theme.colors.primary} />
          <Text style={styles.iconText}>Ajustes</Text>
        </TouchableOpacity>
      </View>

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
    borderBottomColor: theme.colors.background,
    elevation: 4,
  },
  logoButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.medium,
    marginTop: 10,
    color: theme.colors.textMuted,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderColor: theme.colors.background,
  },
  iconButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  iconText: {
    fontSize: theme.typography.fontSize.small,
    marginTop: 2 , //Espacio entre icono y texto del icono
  },
  cameraButtonWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  iconTextCenter: {
    fontSize: theme.typography.fontSize.small,
    marginTop: 4,
  },
});
