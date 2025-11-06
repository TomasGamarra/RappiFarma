// Datos de ejemplo para el perfil
export const mockUserData = {
  usuario: {
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    miembroDesde: 'Miembro desde Octubre 2024',
    telefono: '+1 234 567 8900',
    avatar: null, // o URL de la imagen
  },
  estadisticas: {
    pedidos: 12,
    direcciones: 2,
    rating: 4.9,
  },
  seccionesOpciones: [
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
  ],
};

export const navigationItems = [
  { id: 'home', icon: 'home-outline', label: 'Inicio' },
  { id: 'scan', icon: 'scan-outline', label: 'Escanear' },
  { id: 'orders', icon: 'receipt-outline', label: 'Pedidos' },
  { id: 'profile', icon: 'person-outline', label: 'Perfil' },
  { id: 'settings', icon: 'settings-outline', label: 'Ajustes' },
];