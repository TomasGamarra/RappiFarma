import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const PaymentMethodsModal = ({ visible, onClose, paymentMethods, onSave, modalWidth = '95%' }) => {
  const [paymentList, setPaymentList] = useState(paymentMethods);
  const [showCVV, setShowCVV] = useState({});

  if (!visible) return null;

  const addNewPayment = () => {
    setPaymentList([
      ...paymentList,
      {
        id: Date.now().toString(),
        tipo: 'tarjeta',
        nombre: '',
        numero: '',
        nombreTitular: '',
        fechaVencimiento: '',
        cvv: '',
        esPrincipal: false
      }
    ]);
  };

  const updatePayment = (id, field, value) => {
    setPaymentList(paymentList.map(payment => 
      payment.id === id ? { ...payment, [field]: value } : payment
    ));
  };

  const deletePayment = (id) => {
    setPaymentList(paymentList.filter(payment => payment.id !== id));
  };

  const setAsPrimary = (id) => {
    setPaymentList(paymentList.map(payment => ({
      ...payment,
      esPrincipal: payment.id === id
    })));
  };

  const toggleShowCVV = (id) => {
    setShowCVV(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatCardNumber = (text) => {
    // Remover todos los espacios existentes
    const cleaned = text.replace(/\s+/g, '');
    // Agrupar en bloques de 4 caracteres
    const matched = cleaned.match(/.{1,4}/g);
    return matched ? matched.join(' ') : cleaned;
  };

  const handleCardNumberChange = (id, text) => {
    const formatted = formatCardNumber(text);
    updatePayment(id, 'numero', formatted);
  };

  const handleSave = () => {
    onSave(paymentList);
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={[styles.modalContainer, { width: modalWidth }]}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Métodos de Pago</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {paymentList.map((payment, index) => (
            <View key={payment.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentType}>
                  <Ionicons 
                    name={payment.tipo === 'tarjeta' ? 'card-outline' : 'wallet-outline'} 
                    size={20} 
                    color={theme.colors.primary} 
                  />
                  <Text style={styles.paymentTitle}>
                    {payment.tipo === 'tarjeta' ? 'Tarjeta' : 'Billetera'} {index + 1}
                    {payment.esPrincipal && ' (Principal)'}
                  </Text>
                </View>
                <View style={styles.paymentActions}>
                  {!payment.esPrincipal && (
                    <TouchableOpacity 
                      onPress={() => setAsPrimary(payment.id)}
                      style={styles.primaryButton}
                    >
                      <Ionicons name="star-outline" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={() => deletePayment(payment.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Nombre de la tarjeta (Ej: Visa Principal)"
                value={payment.nombre}
                onChangeText={(text) => updatePayment(payment.id, 'nombre', text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Número de tarjeta"
                value={payment.numero}
                onChangeText={(text) => handleCardNumberChange(payment.id, text)}
                keyboardType="numeric"
                maxLength={19} // 16 dígitos + 3 espacios
              />

              <TextInput
                style={styles.input}
                placeholder="Nombre del titular como aparece en la tarjeta"
                value={payment.nombreTitular}
                onChangeText={(text) => updatePayment(payment.id, 'nombreTitular', text)}
                autoCapitalize="characters"
              />

              {/* SECCIÓN CORREGIDA - Fecha y CVV */}
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="MM/AA"
                  value={payment.fechaVencimiento}
                  onChangeText={(text) => updatePayment(payment.id, 'fechaVencimiento', text)}
                  maxLength={5}
                />
                
                <View style={styles.cvvContainer}>
                  <TextInput
                    style={styles.cvvInput}
                    placeholder="CVV"
                    value={payment.cvv}
                    onChangeText={(text) => updatePayment(payment.id, 'cvv', text)}
                    keyboardType="numeric"
                    secureTextEntry={!showCVV[payment.id]}
                    maxLength={4}
                  />
                  <TouchableOpacity 
                    style={styles.showCvvButton}
                    onPress={() => toggleShowCVV(payment.id)}
                  >
                    <Ionicons 
                      name={showCVV[payment.id] ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color={theme.colors.textMuted} 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.securityNote}>
                <Ionicons name="shield-checkmark-outline" size={16} color={theme.colors.primary} />
                <Text style={styles.securityText}>
                  Tus datos están protegidos con encriptación de seguridad
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addNewPayment}>
            <Ionicons name="add" size={20} color={theme.colors.primary} />
            <Text style={styles.addButtonText}>Agregar método de pago</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar métodos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    maxHeight: '80%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background2,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.large,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  paymentCard: {
    backgroundColor: theme.colors.background2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  paymentType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  primaryButton: {
    padding: theme.spacing.xs,
  },
  deleteButton: {
    padding: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border || theme.colors.background2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.medium,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.sm,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  halfInput: {
    flex: 1,
    minWidth: 0,
  },
  cvvContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 0,
    position: 'relative',
  },
  cvvInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border || theme.colors.background2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    paddingRight: 50,
    fontSize: theme.typography.fontSize.medium,
    backgroundColor: theme.colors.background,
    minWidth: 0,
  },
  showCvvButton: {
    position: 'absolute',
    right: theme.spacing.sm,
    padding: theme.spacing.sm,
    zIndex: 1,
  },
  securityNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary + '10',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  securityText: {
    fontSize: theme.typography.fontSize.small,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  addButtonText: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
    marginLeft: theme.spacing.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background2,
  },
  cancelButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.textMuted,
  },
  cancelButtonText: {
    color: theme.colors.textMuted,
    fontWeight: theme.typography.fontWeight.medium,
  },
  saveButton: {
    flex: 1,
    padding: theme.spacing.md,
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary,
  },
  saveButtonText: {
    color: theme.colors.background,
    fontWeight: theme.typography.fontWeight.bold,
  },
});

export default PaymentMethodsModal;