import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import Toast from "react-native-toast-message";
import OfertasScreen from './src/screens/OfertasScreen';
import PerfilScreen from './src/screens/PerfilScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ 
          animation: 'fade',
          animationDuration: 150, // ← DURACIÓN EXPLÍCITA
          gestureEnabled: true,   // ← HABILITAR GESTOS
          gestureDirection: 'horizontal', // ← DIRECCIÓN DEL GESTO
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Inicio'}} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        <Stack.Screen name="Ofertas" component={OfertasScreen} options={{ title: 'Ofertas' }} />
        <Stack.Screen name="Perfil" component={PerfilScreen} options={{ title: 'Perfil' }} />
      </Stack.Navigator>

      {/* El Toast debe estar montado aquí */}
      <Toast />
    </NavigationContainer>
  );
}