import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Boton } from '../components/Boton';
import { obtenerConfiguracion, obtenerDetalle, urlImagen } from '../services/tmdbService';
import type { ConfiguracionImagenes, DetalleObra, EstadoPeticion, RutasPila } from '../types';
export function DetalleTmdb({ route }: NativeStackScreenProps<RutasPila, 'Detalle'>) {
  const { tipo, id } = route.params;
  const [estado, setEstado] = useState<EstadoPeticion<DetalleObra>>({ tipo: 'cargando' });
  const [config, setConfig] = useState<ConfiguracionImagenes | null>(null);
  const [intento, setIntento] = useState(0);
  const [falloImagen, setFalloImagen] = useState(false);
  const [aviso, setAviso] = useState('');
  useEffect(() => {
    let activo = true;
    setEstado({ tipo: 'cargando' }); setFalloImagen(false); setAviso(''); setConfig(null);
    void obtenerDetalle(tipo, id).then(datos => {
      if (activo) setEstado({ tipo: 'exito', datos });
    }).catch((error: unknown) => {
      if (activo) setEstado({ tipo: 'error', mensaje: error instanceof Error ? error.message : 'No se pudo cargar la ficha.' });
    });
    void obtenerConfiguracion().then(datos => { if (activo) setConfig(datos); }).catch(() => {
      if (activo) setAviso('No se pudo cargar el póster. El resto de la ficha sigue disponible.');
    });
    return () => { activo = false; };
  }, [tipo, id, intento]);
  if (estado.tipo === 'cargando') return <View style={styles.center}><ActivityIndicator color="#B6AAFF" size="large" /><Text style={styles.text}>Cargando ficha…</Text></View>;
  if (estado.tipo === 'error') return <View style={styles.center}><Text accessibilityRole="alert" style={styles.text}>{estado.mensaje}</Text><Boton titulo="Reintentar" onPress={() => setIntento(value => value + 1)} /></View>;
  const obra = estado.datos;
  const uri = urlImagen(obra.posterPath, config, true);
  return <SafeAreaView edges={['bottom']} style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    {uri && !falloImagen ? <Image accessibilityLabel={`Póster de ${obra.titulo}`} source={{ uri }} style={styles.poster} resizeMode="contain" onError={() => setFalloImagen(true)} /> : <View style={[styles.poster, styles.placeholder]}><Text style={styles.text}>Póster no disponible</Text></View>}
    {!!aviso && <Text style={styles.text}>{aviso}</Text>}
    <Text style={styles.title}>{obra.titulo}</Text>
    <Text style={styles.text}>{obra.tipo === 'movie' ? 'Película' : 'Serie'} · {obra.anio || 'Año no disponible'}</Text>
    <Text style={styles.rating}>{obra.calificacionTmdb === null ? 'TMDB · Sin calificaciones' : `TMDB · ${obra.calificacionTmdb.toFixed(1)} / 10`}</Text>
    <Text style={styles.heading}>Sinopsis</Text><Text style={styles.text}>{obra.sinopsis}</Text>
    <Text style={styles.heading}>Elenco</Text>
    {obra.elenco.length ? obra.elenco.map((actor, index) => <View key={`${actor.id}_${index}`} style={styles.actor}><Text style={styles.name}>{actor.nombre}</Text><Text style={styles.text}>{actor.personaje}</Text></View>) : <Text style={styles.text}>No hay información del elenco disponible.</Text>}
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, center: { flex: 1, backgroundColor: '#101322', justifyContent: 'center', padding: 28, gap: 16 }, content: { padding: 24 }, poster: { width: '100%', maxWidth: 300, aspectRatio: 2 / 3, alignSelf: 'center', borderRadius: 16 }, placeholder: { backgroundColor: '#20253B', alignItems: 'center', justifyContent: 'center' }, title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 24 }, text: { color: '#C1C6D8', fontSize: 16, lineHeight: 25, marginTop: 8 }, rating: { color: '#D3C9FF', fontWeight: '700', fontSize: 18, marginTop: 16 }, heading: { color: '#FFFFFF', fontWeight: '700', fontSize: 22, marginTop: 28 }, actor: { borderBottomWidth: 1, borderBottomColor: '#343B55', paddingVertical: 12 }, name: { color: '#FFFFFF', fontSize: 17, fontWeight: '600' } });
