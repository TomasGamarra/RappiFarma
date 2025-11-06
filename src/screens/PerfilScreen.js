// Esta home es de Rama-Fede
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import OpenCameraButton from '../components/OpenCameraButton'; // 👈 tu botón cámara
import ButtonPrimary from '../components/ButtonPrimary'; // 👈 tu botón genérico
import { theme } from '../styles/theme';
import Toast from "react-native-toast-message";
import { createRequestWithPhoto } from "../features/requests/actions";



export default function PerfilScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* ------------------- BARRA SUPERIOR ------------------- */}
      <View style={styles.topBar}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.logoText}>Perfil</Text>
          </TouchableOpacity>

        {/* Spacer para ordenar iconos */}
          <View style={{ flex: 1 }}/>
        </View>

        <View style={styles.centerSection}>
            <TouchableOpacity style={styles.logoButton}>
                <View style={{ flex: 1 }}/>
            </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton}>
            <View style={{ flex: 1 }}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={28} color={theme.colors.primary} />
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
      </View>

      {/* ------------------- BARRA INFERIOR ------------------- */}
      <View style={styles.bottomBar}>
        <View style={styles.leftSection}>
          
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => navigation.replace('Home')}>
            <Ionicons name="home-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.iconTextSecondary}>Home</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="person-circle" size={32} color={theme.colors.primary} />
            <Text style={styles.iconTextPrimary}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Ícono central: abre la cámara */}
        <View style={styles.centerSection}>
          <View style={styles.cameraButtonWrapper}>
            <OpenCameraButton
             onPick={async (asset) => {
                try {
                  const { requestId } = await createRequestWithPhoto({ imageUri: asset.uri });
                  Toast.show({ type: "success", text1: "Receta enviada", text2: `Solicitud: ${requestId}` });
                  navigation.replace('Ofertas');
                } catch (e) {
                  Toast.show({ type: "error", text1: "No se pudo enviar la receta", text2: e.message || "" });
                }
              }}
            icon={<Ionicons name="scan-outline" size={32} color="#fff" />} //Color del dibujito
            color={theme.colors.primary} // color tipo Mercado Libre
            size={70}
            />
          </View>
        </View>

        <View style={styles.rightSection}>
          
          <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.replace('Ofertas')}>
            <Ionicons name="time-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.iconTextSecondary}>Ofertas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings-outline" size={32} color={theme.colors.textMuted} />
            <Text style={styles.iconTextSecondary}>Ajustes</Text>
          </TouchableOpacity>

        </View>
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
    borderBottomColor: theme.colors.background2,
    elevation: 4,
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
//Sectores ordenados
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
//-------------
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderColor: theme.colors.background,
    position: 'relative',
  },
  iconButton: {
    alignItems: 'center',
    padding: theme.spacing.sm,
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
  cameraButtonWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    
  },
  iconTextCenter: {
    fontSize: theme.typography.fontSize.small,
    marginTop: 4,
  },
});
