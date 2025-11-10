import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { theme } from '../styles/theme';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import OptionsList from '../components/OptionsList';
import BottomNavigation from '../components/BottomNavigation';
import PersonalDataModal from '../components/modals/PersonalDataModal';
import AddressesModal from '../components/modals/AddressesModal';
import PaymentMethodsModal from '../components/modals/PaymentMethodsModal';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const { width: screenWidth } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  // Estados para los modales
  const [activeModal, setActiveModal] = useState(null);

  const [userData, setUserData] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);


  const estadisticas = {
    pedidos: 12,
    direcciones: addresses.length,
    rating: 4.9,
  };

  const seccionesOpciones = [
    {
      titulo: 'Información personal',
      opciones: [
        { id: 'personal', icon: 'person-outline', title: 'Datos personales' },
        { id: 'addresses', icon: 'location-outline', title: 'Dirección' },
        { id: 'payments', icon: 'card-outline', title: 'Método de pago' },
        { id: 'history', icon: 'time-outline', title: 'Historial' },
        { id: 'orders', icon: 'receipt-outline', title: 'Mis pedidos' },
        { id: 'reminders', icon: 'notifications-outline', title: 'Recordatorios de recetas' },
      ],
    },
    {
      titulo: 'Seguridad',
      opciones: [
        { id: 'security', icon: 'shield-checkmark-outline', title: 'Seguridad y privacidad' },
        { id: 'logout', icon: 'log-out-outline', title: 'Cerrar sesión', isDestructive: true },
      ],
    },
  ];

  const handleOptionPress = (opcion) => {
    switch (opcion.id) {
      case 'personal':
        setActiveModal('personal');
        break;
      case 'addresses':
        setActiveModal('addresses');
        break;
      case 'payments':
        setActiveModal('payments');
        break;
      case 'history':
        console.log('Abrir historial');
        break;
      case 'orders':
        navigation.navigate('MisPedidos');
        break;
      case 'logout':
        console.log('Cerrar sesión');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        break;
      default:
        console.log('Opción:', opcion.title);
    }
  };

  const handleNavigation = (screen) => {
    switch (screen) {
      case 'home':
        navigation.navigate('Home');
        break;
      case 'profile':
        break;
      case 'scan':
        navigation.navigate('Home');
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

  const handleSavePersonalData = (newData) => {
    setUserData(newData);
  };

  const handleSaveAddresses = (newAddresses) => {
    setAddresses(newAddresses);
  };

  const handleSavePaymentMethods = (newPayments) => {
    setPaymentMethods(newPayments);
  };

  // Determinar tamaño de modal basado en ancho de pantalla
  const getModalWidth = () => {
    if (screenWidth < 375) return '95%';  // Muy pequeño
    if (screenWidth < 414) return '90%';  // Pequeño
    return '85%';  // Normal/grande
  };

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
            nombre: data.nombre || '',
            email: data.email || currentUser.email,
            telefono: data.telefono || '',
            fechaNacimiento: data.fechaNacimiento || '',
            miembroDesde: data.miembroDesde || '',
            apellido: data.apellido || ''
          });

          setAddresses(data.addresses || []);
          setPaymentMethods(data.paymentMethods || []);
        } else {
          console.log('No se encontró el documento del usuario');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text }}>Cargando perfil...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <ProfileHeader usuario={userData} />

      <OptionsList
        secciones={seccionesOpciones}
        onOptionPress={handleOptionPress}
      />

      {/* Modales con width dinámico */}
      <PersonalDataModal
        visible={activeModal === 'personal'}
        onClose={() => setActiveModal(null)}
        userData={userData}
        onSave={handleSavePersonalData}
        modalWidth={getModalWidth()}
      />

      <AddressesModal
        visible={activeModal === 'addresses'}
        onClose={() => setActiveModal(null)}
        addresses={addresses}
        onSave={handleSaveAddresses}
        modalWidth={getModalWidth()}
      />

      <PaymentMethodsModal
        visible={activeModal === 'payments'}
        onClose={() => setActiveModal(null)}
        paymentMethods={paymentMethods}
        onSave={handleSavePaymentMethods}
        modalWidth={getModalWidth()}
      />

      <BottomNavigation
        currentScreen="profile"
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
});

export default ProfileScreen;