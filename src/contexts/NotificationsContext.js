import React, { createContext, useContext, useState, useRef } from 'react';

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [allNotifications, setAllNotifications] = useState([]);
  const readNotificationsRef = useRef(new Set());

  // Función para actualizar notificaciones
  const handleNotificationsUpdate = (count, notifications) => {
    setNotificationsCount(count);
    setAllNotifications(notifications || []);
  };

  // Función para marcar como leída
  const markNotificationAsRead = (notificationId) => {
    readNotificationsRef.current.add(notificationId);
    
    setAllNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    
    // Actualizar contador
    const updatedCount = allNotifications.filter(n => !n.read && n.id !== notificationId).length;
    setNotificationsCount(updatedCount);
  };

  // Función para abrir modal
  const openNotificationsModal = () => {
    setNotificationsModalVisible(true);
  };

  // Función para cerrar modal
  const closeNotificationsModal = () => {
    setNotificationsModalVisible(false);
  };

  const value = {
    // Estados
    notificationsModalVisible,
    notificationsCount,
    allNotifications,
    
    // Funciones
    handleNotificationsUpdate,
    markNotificationAsRead,
    openNotificationsModal,
    closeNotificationsModal,
    
    // Ref persistente
    readNotificationsRef
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return context;
};