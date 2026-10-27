import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartelera } from '../context/CarteleraContext';
import { Boton } from '../components/Boton';
import { mensajeAuth } from '../services/authValidation';
export function Inicio() {
  const { sesion, salir } = useCartelera();
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function cerrar() {
    setOcupado(true); setError(null);
    try { await salir(); } catch (fallo: unknown) { setError(mensajeAuth(fallo)); }
    finally { setOcupado(false); }
  }
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Ya estás dentro</Text>
    <Text style={styles.text}>{sesion.tipo === 'exito' ? sesion.usuario?.email : ''}</Text>
    <Text style={styles.text}>Tu sesión queda guardada en este dispositivo. La búsqueda y tu lista personal llegarán en los siguientes pasos.</Text>
    {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Boton titulo="Cerrar sesión" ocupado={ocupado} onPress={() => { void cerrar(); }} />
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, content: { flexGrow: 1, justifyContent: 'center', padding: 28 }, title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' }, text: { color: '#C1C6D8', fontSize: 17, lineHeight: 26, marginTop: 20 }, error: { color: '#FFB4AB', marginTop: 16 } });
