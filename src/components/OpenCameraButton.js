import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';

export default function OpenCameraButton({
  onPick,
  icon = <Ionicons name="camera-outline" size={28} color="#fff" />, // ícono por defecto
  color = theme.colors.primary,           // color primario
  size = 70, // tamaño por defecto (70x70)
  style,      // para pasar estilos adicionales al botón
  textStyle,  // para pasar estilos adicionales al texto
  textColor = theme.colors.background,   // color del fondo
  borderRadius = theme.borderRadius.md,  // borde redondeado por defecto
}) {
  const handlePress = async () => {
    // 1) pedir permiso
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Habilitá la cámara en Ajustes.');
      return;
    }

    // 2) abrir cámara
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false,
    });

    // 3) devolver resultado si no se canceló
    if (!result.canceled && result.assets?.length) {
      onPick?.(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {icon}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6, // sombra en Android
    shadowColor: '#000', // sombra en iOS
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
});
