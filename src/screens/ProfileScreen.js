import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import OptionsList from '../components/OptionsList';
import BottomNavigation from '../components/BottomNavigation';
import PersonalDataModal from '../components/modals/PersonalDataModal';
import AddressesModal from '../components/modals/AddressesModal';
import PaymentMethodsModal from '../components/modals/PaymentMethodsModal';

const ProfileScreen = ({ navigation }) => {
  // Estados para los modales
  const [activeModal, setActiveModal] = useState(null);
  
  // Datos del usuario
  const [userData, setUserData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+54 11 1234-5678',
    fechaNacimiento: '15/03/1990',
    miembroDesde: 'Miembro desde Octubre 2024',
  });

  const [addresses, setAddresses] = useState([
    {
      id: '1',
      nombre: 'Casa',
      direccion: 'Av. Corrientes 1234',
      ciudad: 'Buenos Aires',
      codigoPostal: '1043',
      esPrincipal: true
    },
    {
      id: '2',
      nombre: 'Trabajo',
      direccion: 'Av. Santa Fe 567',
      ciudad: 'Buenos Aires',
      codigoPostal: '1059',
      esPrincipal: false
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      tipo: 'tarjeta',
      numero: '**** **** **** 1234',
      nombreTitular: 'JUAN PEREZ',
      fechaVencimiento: '12/25',
      cvv: '***',
      esPrincipal: true
    }
  ]);

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
        { id: 'addresses', icon: 'location-outline', title: 'Direcciones' },
        { id: 'payments', icon: 'card-outline', title: 'Métodos de pago' },
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
        // Aquí podrías abrir otro modal para el historial
        console.log('Abrir historial');
        break;
      case 'orders':
        navigation.navigate('MisPedidos');
        break;
      case 'logout':
        console.log('Cerrar sesión');
        navigation.navigate('Login');
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
        // Ya estamos en perfil
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

  return (
    <View style={styles.container}>
      <ProfileHeader usuario={userData} />
      <ProfileStats estadisticas={estadisticas} />
      <OptionsList 
        secciones={seccionesOpciones} 
        onOptionPress={handleOptionPress} 
      />
      
      {/* Modales */}
      <PersonalDataModal
        visible={activeModal === 'personal'}
        onClose={() => setActiveModal(null)}
        userData={userData}
        onSave={handleSavePersonalData}
      />
      
      <AddressesModal
        visible={activeModal === 'addresses'}
        onClose={() => setActiveModal(null)}
        addresses={addresses}
        onSave={handleSaveAddresses}
      />
      
      <PaymentMethodsModal
        visible={activeModal === 'payments'}
        onClose={() => setActiveModal(null)}
        paymentMethods={paymentMethods}
        onSave={handleSavePaymentMethods}
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