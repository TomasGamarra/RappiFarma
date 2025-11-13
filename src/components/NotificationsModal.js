// components/NotificationsModal.js
import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { collection, query, where, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

const NotificationsModal = ({ visible, onClose, onNotificationsUpdate }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const previousOffersRef = useRef([]);

  useEffect(() => {
    if (!visible) return;

    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    console.log("🔔 Escuchando notificaciones para usuario:", user.uid);

    // Query para ofertas del usuario
    const offersQuery = query(
      collection(db, 'offers'),
      where('userId', '==', user.uid),
      orderBy('timeStamp', 'desc')
    );

    const unsubscribe = onSnapshot(offersQuery, async (snapshot) => {
      try {
        const offersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("📦 Ofertas recibidas:", offersData.length);
        
        // Generar notificaciones basadas en el estado actual
        const generatedNotifications = await generateNotificationsFromOffers(offersData);
        
        // Detectar cambios y generar notificaciones nuevas
        const newChangeNotifications = detectStateChanges(previousOffersRef.current, offersData);
        
        // Combinar notificaciones
        const allNotifications = [...newChangeNotifications, ...generatedNotifications];
        
        // Eliminar duplicados y ordenar por timestamp
        const uniqueNotifications = removeDuplicateNotifications(allNotifications);
        uniqueNotifications.sort((a, b) => {
          const timeA = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
          const timeB = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
          return timeB - timeA;
        });

        console.log("📢 Notificaciones totales:", uniqueNotifications.length);
        
        setNotifications(uniqueNotifications);
        
        // Notificar a las screens sobre las notificaciones no leídas
        if (onNotificationsUpdate) {
          const unreadCount = uniqueNotifications.filter(n => !n.read).length;
          onNotificationsUpdate(unreadCount, uniqueNotifications);
        }
        
        setLoading(false);
        previousOffersRef.current = offersData;
        
      } catch (error) {
        console.error("❌ Error procesando notificaciones:", error);
        setLoading(false);
      }
    }, (error) => {
      console.error("❌ Error en snapshot:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [visible]);

  // Función para generar notificaciones desde las ofertas actuales
  const generateNotificationsFromOffers = async (offers) => {
    const notifications = [];
    
    for (const offer of offers) {
      let notification = null;
      
      switch (offer.state) {
        case 'Pendiente':
          notification = {
            id: `offer_${offer.id}`,
            type: 'nueva_oferta',
            farmaciaNombre: offer.farmacia || 'Farmacia',
            timestamp: offer.timeStamp || offer.timestamp || new Date(),
            message: `Te llegó una oferta de "${offer.farmacia || 'una farmacia'}"`,
            read: false,
            priority: 1,
            offerId: offer.id
          };
          break;
          
        case 'Entregado':
          notification = {
            id: `delivered_${offer.id}`,
            type: 'pedido_entregado',
            farmaciaNombre: offer.farmacia || 'Farmacia',
            timestamp: offer.timeStamp || offer.timestamp || new Date(),
            message: `¡Tu pedido de ${offer.farmacia || 'la farmacia'} ha sido entregado!`,
            read: false,
            priority: 2,
            offerId: offer.id
          };
          break;
          
        case 'Rechazada':
          // Buscar información del rechazo si está disponible
          const rejectionReason = offer.rejectionReason || 'No se especificó motivo';
          notification = {
            id: `rejected_${offer.id}`,
            type: 'rechazo',
            farmaciaNombre: offer.farmacia || 'Farmacia',
            timestamp: offer.timeStamp || offer.timestamp || new Date(),
            message: `${offer.farmacia || 'Una farmacia'} rechazó tu receta: ${rejectionReason}`,
            read: false,
            priority: 1,
            offerId: offer.id
          };
          break;
          
        case 'Enviando':
          notification = {
            id: `shipping_${offer.id}`,
            type: 'info',
            farmaciaNombre: offer.farmacia || 'Farmacia',
            timestamp: offer.timeStamp || offer.timestamp || new Date(),
            message: `Tu pedido de ${offer.farmacia || 'la farmacia'} está en camino`,
            read: false,
            priority: 3,
            offerId: offer.id
          };
          break;
      }
      
      if (notification) {
        notifications.push(notification);
      }
    }
    
    return notifications;
  };

  // Función para detectar cambios de estado
  const detectStateChanges = (previousOffers, currentOffers) => {
    const newNotifications = [];
    
    currentOffers.forEach(currentOffer => {
      const previousOffer = previousOffers.find(prev => prev.id === currentOffer.id);
      
      if (!previousOffer) return; // No notificar para ofertas nuevas (ya se manejan arriba)
      
      // Detectar cambio a "Entregado"
      if (previousOffer.state !== 'Entregado' && currentOffer.state === 'Entregado') {
        newNotifications.push({
          id: `change_delivered_${currentOffer.id}_${Date.now()}`,
          type: 'pedido_entregado',
          farmaciaNombre: currentOffer.farmacia || 'Farmacia',
          timestamp: new Date(),
          message: `¡Tu pedido de ${currentOffer.farmacia || 'la farmacia'} ha sido entregado!`,
          read: false,
          priority: 2,
          offerId: currentOffer.id
        });
      }
      
      // Detectar cambio a "Rechazada"
      if (previousOffer.state !== 'Rechazada' && currentOffer.state === 'Rechazada') {
        const rejectionReason = currentOffer.rejectionReason || 'No se especificó motivo';
        newNotifications.push({
          id: `change_rejected_${currentOffer.id}_${Date.now()}`,
          type: 'rechazo',
          farmaciaNombre: currentOffer.farmacia || 'Farmacia',
          timestamp: new Date(),
          message: `${currentOffer.farmacia || 'Una farmacia'} rechazó tu receta: ${rejectionReason}`,
          read: false,
          priority: 1,
          offerId: currentOffer.id
        });
      }
    });
    
    return newNotifications;
  };

  // Eliminar notificaciones duplicadas
  const removeDuplicateNotifications = (notifications) => {
    const seen = new Set();
    return notifications.filter(notification => {
      // Usar offerId + type como clave única para evitar duplicados
      const key = `${notification.offerId}_${notification.type}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'nueva_oferta':
        return <Ionicons name="pricetag" size={20} color="#4CAF50" />;
      case 'pedido_entregado':
        return <Ionicons name="checkmark-done" size={20} color="#2196F3" />;
      case 'rechazo':
        return <Ionicons name="close-circle" size={20} color="#FF3B30" />;
      case 'info':
        return <Ionicons name="information-circle" size={20} color="#FF9800" />;
      default:
        return <Ionicons name="notifications" size={20} color={theme.colors.primary} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    let date;
    try {
      if (timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        date = new Date(timestamp);
      }
    } catch (error) {
      console.error("Error formateando timestamp:", error);
      return '';
    }
    
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    if (diffDays < 7) return `Hace ${diffDays} d`;
    
    return date.toLocaleDateString('es-ES');
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    
    // Actualizar el contador después de marcar como leído
    if (onNotificationsUpdate) {
      const updatedUnreadCount = notifications.filter(n => !n.read && n.id !== notificationId).length;
      onNotificationsUpdate(updatedUnreadCount, notifications);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.notificationsModalContent}>
          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notificaciones</Text>
            <TouchableOpacity 
              style={styles.closeNotificationsButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.notificationsList}>
            {loading ? (
              <View style={styles.emptyNotifications}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.emptyNotificationsText}>Cargando notificaciones...</Text>
              </View>
            ) : notifications.length === 0 ? (
              <View style={styles.emptyNotifications}>
                <Ionicons name="notifications-off-outline" size={48} color={theme.colors.textMuted} />
                <Text style={styles.emptyNotificationsText}>Sin notificaciones</Text>
                <Text style={styles.emptyNotificationsSubtext}>
                  Aquí aparecerán tus notificaciones cuando tengas ofertas o pedidos
                </Text>
              </View>
            ) : (
              <View style={styles.notificationsContainer}>
                {notifications.map((notification) => (
                  <TouchableOpacity 
                    key={notification.id} 
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.unreadNotification
                    ]}
                    onPress={() => markAsRead(notification.id)}
                  >
                    <View style={styles.notificationIcon}>
                      {renderNotificationIcon(notification.type)}
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationMessage}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {formatTimestamp(notification.timestamp)}
                      </Text>
                    </View>
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Los estilos se mantienen igual...
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationsModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    height: '70%',
    overflow: 'hidden',
  },
  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  notificationsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  closeNotificationsButton: {
    padding: 4,
  },
  notificationsList: {
    flex: 1,
  },
  emptyNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyNotificationsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyNotificationsSubtext: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  notificationsContainer: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'flex-start',
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: '#e3f2fd',
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },
});

export default NotificationsModal;