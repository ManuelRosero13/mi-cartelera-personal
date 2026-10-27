import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CarteleraProvider, useCartelera } from './src/context/CarteleraContext';
import { Boton } from './src/components/Boton';
import { Login } from './src/screens/Login';
import { Inicio } from './src/screens/Inicio';
import { Buscar } from './src/screens/Buscar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RutasPila } from './src/types';
import { DetalleTmdb } from './src/screens/DetalleTmdb';
const Stack = createNativeStackNavigator<RutasPila>();
const Tabs = createBottomTabNavigator<{ Buscar: undefined; Cuenta: undefined }>();
function Pantallas() {
  return <Tabs.Navigator screenOptions={{ headerStyle: { backgroundColor: '#101322' }, headerTintColor: '#FFFFFF', tabBarStyle: { backgroundColor: '#20253B' }, tabBarActiveTintColor: '#C4B8FF', tabBarInactiveTintColor: '#C1C6D8', tabBarItemStyle: { minHeight: 44 } }}>
    <Tabs.Screen name="Buscar" component={Buscar} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>⌕</Text> }} />
    <Tabs.Screen name="Cuenta" component={Inicio} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 22 }}>●</Text> }} />
  </Tabs.Navigator>;
}
function Navegacion() {
  const { sesion, reintentar } = useCartelera();
  if (sesion.tipo === 'cargando') return <View style={styles.center}><ActivityIndicator size="large" color="#B6AAFF" /><Text style={styles.text}>Recuperando tu sesión…</Text></View>;
  if (sesion.tipo === 'error') return <View style={styles.center}><Text accessibilityRole="alert" style={styles.text}>{sesion.mensaje}</Text><Boton titulo="Reintentar" onPress={reintentar} /></View>;
  return <NavigationContainer theme={DarkTheme}><Stack.Navigator screenOptions={{ headerShown: false }}>{sesion.usuario ? <Stack.Group><Stack.Screen name="Inicio" component={Pantallas} /><Stack.Screen name="Detalle" component={DetalleTmdb} options={{ headerShown: true, title: 'Detalle', headerStyle: { backgroundColor: '#101322' }, headerTintColor: '#FFFFFF' }} /></Stack.Group> : <Stack.Screen name="Login" component={Login} />}</Stack.Navigator></NavigationContainer>;
}
export default function App() {
  return <SafeAreaProvider><CarteleraProvider><StatusBar style="light" /><Navegacion /></CarteleraProvider></SafeAreaProvider>;
}
const styles = StyleSheet.create({ center: { flex: 1, backgroundColor: '#101322', justifyContent: 'center', padding: 28 }, text: { color: '#FFFFFF', marginTop: 16, fontSize: 17, textAlign: 'center' } });



