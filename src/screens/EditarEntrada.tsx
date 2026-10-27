import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCartelera } from '../context/CarteleraContext';
import { Boton } from '../components/Boton';
import { Selector } from '../components/Selector';
import { mensajeLista } from '../services/listaModel';
import { ETIQUETA_ESTADO, type EstadoVisto, type ItemLista, type RutasPila } from '../types';
type Props = NativeStackScreenProps<RutasPila, 'Editar'>;
export function EditarEntrada({ route, navigation }: Props) {
  const { lista } = useCartelera();
  const pantallaActiva = useRef(true);
  useEffect(() => { pantallaActiva.current = true; return () => { pantallaActiva.current = false; }; }, []);
  const item = lista.tipo === 'exito' ? lista.datos.find(entrada => entrada.id === route.params.id) : undefined;
  if (!item) return <View style={styles.center}><Text style={styles.text}>{lista.tipo === 'error' ? lista.mensaje : lista.tipo === 'cargando' ? 'Cargando entrada…' : 'Esta obra ya no está en tu lista.'}</Text><Boton titulo="Volver a Mi lista" onPress={() => navigation.goBack()} /></View>;
  return <Formulario key={item.id} item={item} volver={() => { if (pantallaActiva.current) navigation.goBack(); }} />;
}
function Formulario({ item, volver }: { item: ItemLista; volver: () => void }) {
  const { actualizar, eliminar, sinConexion } = useCartelera();
  const [estado, setEstado] = useState(item.estado);
  const [nota, setNota] = useState<number | null>(item.calificacionPersonal);
  const [comentario, setComentario] = useState(item.comentario);
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState('');
  const bloqueo = useRef(false);
  const activo = useRef(true);
  useEffect(() => { activo.current = true; return () => { activo.current = false; }; }, []);
  async function ejecutar(borrar: boolean) {
    if (bloqueo.current) return;
    bloqueo.current = true; setOcupado(true); setError('');
    try {
      if (borrar) await eliminar(item.id);
      else await actualizar(item.id, { estado, calificacionPersonal: estado === 'vista' ? nota : null, comentario });
      // La confirmación puede retirar el formulario antes de resolver la promesa.
      volver();
    } catch (fallo: unknown) { if (activo.current) setError(mensajeLista(fallo)); }
    finally { bloqueo.current = false; if (activo.current) setOcupado(false); }
  }
  function confirmarBorrado() {
    Alert.alert('Quitar de Mi lista', `¿Quieres quitar “${item.titulo}”? Se eliminarán tu calificación y comentario.`, [{ text: 'Cancelar', style: 'cancel' }, { text: 'Quitar', style: 'destructive', onPress: () => { void ejecutar(true); } }]);
  }
  return <SafeAreaView edges={['bottom']} style={styles.safe}><KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <Text style={styles.title}>{item.titulo}</Text>{sinConexion && <Text accessibilityRole="alert" style={styles.text}>Sin conexión. Puedes consultar esta entrada; los cambios requieren internet.</Text>}
    <Text style={styles.label}>Estado</Text>
    <Selector<EstadoVisto> opciones={(['por_ver','viendo','vista'] as const).map(valor => ({ valor, etiqueta: ETIQUETA_ESTADO[valor] }))} valor={estado} disabled={ocupado} cambiar={valor => { setEstado(valor); if (valor !== 'vista') setNota(null); }} />
    <Text style={styles.label}>Mi calificación</Text>
    <Text style={styles.text}>{estado === 'vista' ? 'Elige de 1 a 5, o déjala sin calificar.' : 'Solo puedes calificar una obra marcada como Vista. Al cambiar a otro estado se elimina la calificación.'}</Text>
    <Selector opciones={[{ valor: 'sin', etiqueta: 'Sin nota' }, ...[1,2,3,4,5].map(n => ({ valor: String(n), etiqueta: `${n} ★` }))]} valor={nota === null ? 'sin' : String(nota)} disabled={ocupado || estado !== 'vista'} cambiar={valor => setNota(valor === 'sin' ? null : Number(valor))} />
    <Text style={styles.label}>Comentario</Text>
    <TextInput accessibilityLabel="Comentario personal" multiline maxLength={500} editable={!ocupado} value={comentario} onChangeText={setComentario} placeholder="¿Qué te pareció?" placeholderTextColor="#9098AE" style={styles.input} />
    <Text style={styles.text}>{comentario.length}/500 caracteres</Text>
    {!!error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Boton titulo="Guardar cambios" ocupado={ocupado} onPress={() => { void ejecutar(false); }} />
    <Boton titulo="Quitar de Mi lista" secundario ocupado={ocupado} onPress={confirmarBorrado} />
  </ScrollView></KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, center: { flex: 1, backgroundColor: '#101322', padding: 24, justifyContent: 'center' }, content: { padding: 24 }, title: { color: '#FFFFFF', fontSize: 27, fontWeight: '700' }, label: { color: '#FFFFFF', fontSize: 19, fontWeight: '600', marginTop: 24 }, text: { color: '#C1C6D8', fontSize: 15, lineHeight: 23, marginTop: 8 }, input: { minHeight: 140, textAlignVertical: 'top', backgroundColor: '#20253B', borderWidth: 1, borderColor: '#4C536D', borderRadius: 12, padding: 14, color: '#FFFFFF', marginTop: 12, fontSize: 16 }, error: { color: '#FFB4AB', fontSize: 16, marginTop: 16 } });


