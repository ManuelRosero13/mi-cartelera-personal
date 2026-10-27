import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Obra, ConfiguracionImagenes } from '../types';
import { urlImagen } from '../services/tmdbService';
export function TarjetaObra({ obra, config }: { obra: Obra; config: ConfiguracionImagenes | null }) {
  const [fallo, setFallo] = useState(false);
  const uri = urlImagen(obra.posterPath, config);
  return <View style={styles.card}>
    {uri && !fallo ? <Image accessibilityLabel={`Póster de ${obra.titulo}`} source={{ uri }} style={styles.poster} onError={() => setFallo(true)} /> : <View style={[styles.poster, styles.placeholder]}><Text style={styles.meta}>Sin póster</Text></View>}
    <View style={styles.info}><Text style={styles.title}>{obra.titulo}</Text><Text style={styles.meta}>{obra.tipo === 'movie' ? 'Película' : 'Serie'} · {obra.anio || 'Año no disponible'}</Text></View>
  </View>;
}
const styles = StyleSheet.create({ card: { flexDirection: 'row', backgroundColor: '#20253B', borderRadius: 14, padding: 12, gap: 14, marginBottom: 12 }, poster: { width: 74, height: 111, borderRadius: 8 }, placeholder: { backgroundColor: '#343B55', justifyContent: 'center', alignItems: 'center' }, info: { flex: 1, justifyContent: 'center', gap: 10 }, title: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' }, meta: { color: '#C1C6D8', fontSize: 14, textAlign: 'left' } });
