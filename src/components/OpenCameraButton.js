import React from 'react';
import { Pressable, Text, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';

export default function OpenCameraButton({
  title = 'Abrir cámara',
  onPick,
  style,      // para pasar estilos adicionales al botón
  textStyle,  // para pasar estilos adicionales al texto
  color = theme.colors.primary,           // color de fondo por defecto
  textColor = theme.colors.background,   // color del texto por defecto
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
    <Pressable
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: color, borderRadius },
        style, // estilos adicionales que pueda pasar el usuario
      ]}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
