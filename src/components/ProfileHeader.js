import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const ProfileHeader = ({ usuario }) => {
  // Evitamos errores si usuario aún no está cargado
  if (!usuario) return null;

  const nombre = usuario.nombre || '';
  const apellido = usuario.apellido || '';

  // Iniciales: primera letra de nombre y apellido
  const iniciales = `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase();

  // Mostrar solo la parte del email antes del @ (en tu caso, el DNI)
  const dni = usuario.email?.split('@')[0] || '';

  return (
    <View style={styles.headerContainer}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{iniciales}</Text>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{`${nombre} ${apellido}`}</Text>
        <Text style={styles.userEmail}>{dni}</Text>
        <Text style={styles.memberSince}>{usuario.miembroDesde}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: theme.typography.fontSize.title,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  memberSince: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textMuted,
  },
});

export default ProfileHeader;
