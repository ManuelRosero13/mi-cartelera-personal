import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CarteleraProvider, useCartelera } from './src/context/CarteleraContext';
import { Boton } from './src/components/Boton';
import { Login } from './src/screens/Login';
import { Inicio } from './src/screens/Inicio';
type Rutas = { Login: undefined; Inicio: undefined };
const Stack = createNativeStackNavigator<Rutas>();
function Navegacion() {
  const { sesion, reintentar } = useCartelera();
  if (sesion.tipo === 'cargando') return <View style={styles.center}><ActivityIndicator size="large" color="#B6AAFF" /><Text style={styles.text}>Recuperando tu sesión…</Text></View>;
  if (sesion.tipo === 'error') return <View style={styles.center}><Text accessibilityRole="alert" style={styles.text}>{sesion.mensaje}</Text><Boton titulo="Reintentar" onPress={reintentar} /></View>;
  return <NavigationContainer theme={DarkTheme}><Stack.Navigator screenOptions={{ headerShown: false }}>{sesion.usuario ? <Stack.Screen name="Inicio" component={Inicio} /> : <Stack.Screen name="Login" component={Login} />}</Stack.Navigator></NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><CarteleraProvider><StatusBar style="light" /><Navegacion /></CarteleraProvider></SafeAreaProvider>;
}
const styles = StyleSheet.create({ center: { flex: 1, backgroundColor: '#101322', justifyContent: 'center', padding: 28 }, text: { color: '#FFFFFF', marginTop: 16, fontSize: 17, textAlign: 'center' } });
