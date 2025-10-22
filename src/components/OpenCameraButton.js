import { Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function OpenCameraButton({ title = 'Abrir cámara', onPick }) {
  const handlePress = async () => {
    // 1) pedir permiso
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Habilitá la cámara en Ajustes.');
      return;
    }
    // 2) abrir cámara
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false
    });
    // 3) devolver resultado si no se canceló
    if (!result.canceled && result.assets?.length) {
      onPick?.(result.assets[0]); // { uri, width, height, etc. }
    }
  };

  return <Button title={title} onPress={handlePress} />;
}
