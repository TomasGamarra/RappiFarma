import { View, StyleSheet } from 'react-native';
import OpenCameraButton from '../components/OpenCameraButton';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <OpenCameraButton onPick={(asset) => console.log('Foto:', asset.uri)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
