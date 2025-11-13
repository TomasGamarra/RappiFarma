import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import BottomNavigation from '../components/BottomNavigation';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNotifications } from '../contexts/NotificationsContext'; // ✅ IMPORTAR

const ProfileScreen = ({ navigation }) => {
  // ✅ USAR CONTEXTO
  const {
    notificationsCount,
    openNotificationsModal
  } = useNotifications();

  const [userData, setUserData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    dni: ''
  });
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          navigation.replace('Login');
          return;
        }

        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData({
            nombre: data.nombre || 'Nombre',
            apellido: data.apellido || 'Apellido',
            telefono: data.telefono || 'Agregar teléfono',
            direccion: data.direccion || 'Agregar dirección',
            dni: data.dni || 'Agregar DNI'
          });
        }
      } catch (error) {
        console.error('Error al obtener datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async (field, value) => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      await updateDoc(doc(db, 'users', currentUser.uid), {
        [field]: value
      });

      setUserData(prev => ({ ...prev, [field]: value }));
      setEditingField(null);
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudieron guardar los datos');
    }
  };

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        navigation.replace('Home');
        break;
      case 'profile':
        // Ya estamos en perfil
        break;
      case 'scan':
        navigation.replace('Home');
        break;
      case 'ofertas':
        navigation.replace('Ofertas');
        break;
      case 'notifications':
        openNotificationsModal(); // ✅ USAR FUNCIÓN DEL CONTEXTO
        break;
      default:
        navigation.replace('Home');
    }
  };

  const handleLogout = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  const EditableField = ({ label, field, value, icon, editable = true }) => (
    <TouchableOpacity
      style={styles.fieldContainer}
      onPress={() => editable && setEditingField(field)}
      disabled={!editable}
    >
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>

      {editingField === field ? (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={(text) => setUserData(prev => ({ ...prev, [field]: text }))}
          onBlur={() => handleSave(field, userData[field])}
          autoFocus
        />
      ) : (
        <Text style={[styles.fieldValue, !editable && styles.nonEditableField]}>
          {value}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header Simple - Ahora editable */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData.nombre.charAt(0)}{userData.apellido.charAt(0)}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <TouchableOpacity>
            <Text style={styles.userName}>{userData.nombre}</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.userLastName}>{userData.apellido}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Información Personal */}
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información Personal</Text>

          <EditableField
            label="DNI"
            field="dni"
            value={userData.dni}
            icon="card-outline"
            editable={false}
          />

          <EditableField
            label="Teléfono"
            field="telefono"
            value={userData.telefono}
            icon="call-outline"
            editable={false}
          />

          <EditableField
            label="Dirección"
            field="direccion"
            value={userData.direccion}
            icon="location-outline"
            editable={false}
          />
        </View>

        {/* Cerrar Sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNavigation 
        currentScreen="profile" 
        onNavigate={handleNavigation} 
        notificationsCount={notificationsCount} // ✅ DEL CONTEXTO
      />
    </View>
  );
};

// ... (los estilos se mantienen igual)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textMuted,
  },
  header: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  userLastName: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  fieldContainer: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    fontWeight: '500',
  },
  fieldValue: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.textMuted,
  },
  nonEditableField: {
    color: theme.colors.textMuted,
    fontStyle: 'normal',
  },
  input: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.text,
    backgroundColor: theme.colors.background2,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
  },
  logoutText: {
    fontSize: theme.typography.fontSize.medium,
    color: theme.colors.error,
    fontWeight: '500',
    marginLeft: theme.spacing.sm,
  },
});

export default ProfileScreen;