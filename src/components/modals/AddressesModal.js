import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

const AddressesModal = ({ visible, onClose, addresses, onSave }) => {
  const [addressList, setAddressList] = useState(addresses);

  if (!visible) return null;

  const addNewAddress = () => {
    setAddressList([
      ...addressList,
      {
        id: Date.now().toString(),
        nombre: '',
        direccion: '',
        ciudad: '',
        codigoPostal: '',
        esPrincipal: false
      }
    ]);
  };

  const updateAddress = (id, field, value) => {
    setAddressList(addressList.map(addr => 
      addr.id === id ? { ...addr, [field]: value } : addr
    ));
  };

  const deleteAddress = (id) => {
    setAddressList(addressList.filter(addr => addr.id !== id));
  };

  const setAsPrimary = (id) => {
    setAddressList(addressList.map(addr => ({
      ...addr,
      esPrincipal: addr.id === id
    })));
  };

  const handleSave = () => {
    onSave(addressList);
    onClose();
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Mis Direcciones</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {addressList.map((address, index) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressTitle}>
                  Dirección {index + 1} {address.esPrincipal && '(Principal)'}
                </Text>
                <View style={styles.addressActions}>
                  {!address.esPrincipal && (
                    <TouchableOpacity 
                      onPress={() => setAsPrimary(address.id)}
                      style={styles.primaryButton}
                    >
                      <Ionicons name="star-outline" size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity 
                    onPress={() => deleteAddress(address.id)}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={16} color={theme.colors.error} />
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Nombre (Casa, Trabajo, etc.)"
                value={address.nombre}
                onChangeText={(text) => updateAddress(address.id, 'nombre', text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Dirección completa"
                value={address.direccion}
                onChangeText={(text) => updateAddress(address.id, 'direccion', text)}
              />
              <View style={styles.rowInputs}>
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Ciudad"
                  value={address.ciudad}
                  onChangeText={(text) => updateAddress(address.id, 'ciudad', text)}
                />
                <TextInput
                  style={[styles.input, styles.halfInput]}
                  placeholder="Código Postal"
                  value={address.codigoPostal}
                  onChangeText={(text) => updateAddress(address.id, 'codigoPostal', text)}
                />
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addButton} onPress={addNewAddress}>
            <Ionicons name="add" size={20} color={theme.colors.primary} />
            <Text style={styles.addButtonText}>Agregar nueva dirección</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar direcciones</Text>
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
  width: '95%',  // ← MÁS ANCHO PARA PANTALLAS PEQUEÑAS
  maxHeight: '80%',
  maxWidth: 400,  // ← LÍMITE PARA TABLETS
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
  addressCard: {
    backgroundColor: theme.colors.background2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  addressTitle: {
    fontSize: theme.typography.fontSize.medium,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  addressActions: {
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
    borderColor: theme.colors.background2,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.fontSize.medium,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.sm,
  },
  rowInputs: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  },
  halfInput: {
  width: '48%',
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

export default AddressesModal;