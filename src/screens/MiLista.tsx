import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCartelera } from '../context/CarteleraContext';
import { Boton } from '../components/Boton';
import { TarjetaObra } from '../components/TarjetaObra';
import { obtenerConfiguracion } from '../services/tmdbService';
import { ETIQUETA_ESTADO, type ConfiguracionImagenes, type RutasPila } from '../types';
export function MiLista() {
  const { lista, recargarLista } = useCartelera();
  const navigation = useNavigation<NativeStackNavigationProp<RutasPila>>();
  const [config, setConfig] = useState<ConfiguracionImagenes | null>(null);
  useEffect(() => {
    let activo = true;
    void obtenerConfiguracion().then(datos => { if (activo) setConfig(datos); }).catch(() => {});
    return () => { activo = false; };
  }, []);
  if (lista.tipo === 'cargando') return <View style={styles.center}><ActivityIndicator color="#B6AAFF" /><Text style={styles.text}>Cargando tu lista…</Text></View>;
  if (lista.tipo === 'error') return <View style={styles.center}><Text accessibilityRole="alert" style={styles.text}>{lista.mensaje}</Text><Boton titulo="Reintentar" onPress={recargarLista} /></View>;
  return <SafeAreaView edges={['bottom']} style={styles.safe}><FlatList data={lista.datos} keyExtractor={item => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<Text style={styles.heading}>Tus obras guardadas · {lista.datos.length}</Text>} ListEmptyComponent={<Text style={styles.text}>Tu lista está vacía. Busca una película o serie y agrégala desde su ficha.</Text>} renderItem={({ item }) => <View><Text style={styles.state}>{ETIQUETA_ESTADO[item.estado]}</Text><TarjetaObra obra={item} config={config} onPress={() => navigation.navigate('Detalle', { tipo: item.tipo, id: item.tmdbId })} /></View>} ListFooterComponent={<Boton titulo="Actualizar lista" secundario onPress={recargarLista} />} /></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, center: { flex: 1, backgroundColor: '#101322', justifyContent: 'center', padding: 28 }, content: { padding: 20 }, text: { color: '#C1C6D8', fontSize: 16, lineHeight: 25, marginTop: 16 }, heading: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 20 }, state: { color: '#B6AAFF', fontSize: 14, marginBottom: 6 } });
