import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { signUp } from '../features/auth/actions';

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const mapFirebaseError = (code) => {
    switch (code) {
      case 'auth/invalid-email': return 'DNI inválido.';
      case 'auth/missing-password': return 'Ingresá tu contraseña.';
      case 'auth/weak-password': return 'Contraseña muy débil.';
      case 'auth/email-already-in-use': return 'Este DNI ya está registrado.';
      default: return 'Error al registrarse.';
    }
  };

  const handleRegister = async () => {
    setError('');

    const nombreVal = nombre.trim();
    const apellidoVal = apellido.trim();
    const dniVal = dni.trim();
    const passwordVal = password;

    setNombre('');
    setApellido('');
    setDni('');
    setPassword('');

    if (!nombreVal || !apellidoVal || !dniVal) {
      return setError('Completá nombre, apellido y DNI.');
    }
    if (!passwordVal) {
      return setError('Ingresá tu contraseña.');
    }

    try {
      setLoading(true);
      await signUp(dniVal, passwordVal, nombreVal, apellidoVal);
      navigation.replace('Login');
    } catch (e) {
      setError(mapFirebaseError(e?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrarse</Text>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />

      <TextInput
        style={styles.input}
        placeholder="DNI"
        value={dni}
        onChangeText={setDni}
        keyboardType="numeric"
      />

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.inputWithIcon}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconButton}>
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={22}
            color={theme.colors.textMuted}
          />
        </Pressable>
      </View>

      <Pressable
        style={[styles.loginButton, loading && { opacity: 0.7 }]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color={theme.colors.background} />
          : <Text style={styles.loginButtonText}>Registrar</Text>}
      </Pressable>

      <View style={styles.registerContainer}>
        <Text>¿Ya tenés cuenta? </Text>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <Text style={styles.registerText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: theme.spacing.lg, justifyContent: 'center' },
  title: { fontSize: theme.typography.fontSize.title, fontWeight: theme.typography.fontWeight.bold, color: theme.colors.primary, marginBottom: theme.spacing.xl, textAlign: 'center' },
  errorText: { color: theme.colors.danger, textAlign: 'center', marginBottom: theme.spacing.sm },
  input: { borderWidth: 1, borderColor: theme.colors.textMuted, borderRadius: theme.borderRadius.sm, padding: theme.spacing.md, marginBottom: theme.spacing.md, fontSize: theme.typography.fontSize.medium, color: theme.colors.text },
  inputWrapper: { position: 'relative', marginBottom: theme.spacing.md },
  inputWithIcon: { borderWidth: 1, borderColor: theme.colors.textMuted, borderRadius: theme.borderRadius.sm, paddingVertical: theme.spacing.md, paddingLeft: theme.spacing.md, paddingRight: 40, fontSize: theme.typography.fontSize.medium, color: theme.colors.text },
  iconButton: { position: 'absolute', right: theme.spacing.md, top: '50%', transform: [{ translateY: -12 }] },
  loginButton: { backgroundColor: theme.colors.primary, borderRadius: theme.borderRadius.md, paddingVertical: theme.spacing.md, marginTop: theme.spacing.lg, alignItems: 'center' },
  loginButtonText: { color: theme.colors.background, fontWeight: theme.typography.fontWeight.bold, fontSize: theme.typography.fontSize.medium },
  registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: theme.spacing.md },
  registerText: { color: theme.colors.secondary, fontWeight: theme.typography.fontWeight.bold },
});
