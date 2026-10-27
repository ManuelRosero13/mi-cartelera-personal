import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Boton } from '../components/Boton';
import { TarjetaObra } from '../components/TarjetaObra';
import { buscar, obtenerConfiguracion } from '../services/tmdbService';
import type { ConfiguracionImagenes, EstadoPeticion, PaginaBusqueda } from '../types';
export function Buscar() {
  const [texto, setTexto] = useState('');
  const [consulta, setConsulta] = useState('');
  const [pagina, setPagina] = useState(1);
  const [estado, setEstado] = useState<EstadoPeticion<PaginaBusqueda> | null>(null);
  const [config, setConfig] = useState<ConfiguracionImagenes | null>(null);
  const [aviso, setAviso] = useState('');
  const secuencia = useRef(0);
  const lista = useRef<FlatList>(null);
  useEffect(() => () => { secuencia.current += 1; }, []);
  async function consultar(titulo: string, numero = 1) {
    const id = ++secuencia.current;
    const limpio = titulo.trim();
    setConsulta(limpio); setPagina(numero); setAviso('');
    if (!limpio) { setEstado(null); return; }
    Keyboard.dismiss(); setEstado({ tipo: 'cargando' });
    const imagenes = obtenerConfiguracion().then(value => {
      if (id === secuencia.current) setConfig(value);
    }).catch(() => { if (id === secuencia.current) setAviso('Las imágenes no están disponibles. Puedes volver a buscar para reintentarlo.'); });
    try {
      const datos = await buscar(limpio, numero);
      if (id === secuencia.current) { setEstado({ tipo: 'exito', datos }); lista.current?.scrollToOffset({ offset: 0, animated: false }); }
    } catch (error: unknown) {
      if (id === secuencia.current) setEstado({ tipo: 'error', mensaje: error instanceof Error ? error.message : 'No se pudo completar la búsqueda.' });
    }
    await imagenes;
  }
  return <SafeAreaView edges={['bottom']} style={styles.safe}>
    <View style={styles.header}>
      <Text style={styles.title}>Tu próxima historia</Text>
      <TextInput accessibilityLabel="Buscar película o serie" value={texto} onChangeText={setTexto} onSubmitEditing={() => { void consultar(texto); }} returnKeyType="search" placeholder="Título de película o serie" placeholderTextColor="#9098AE" style={styles.input} autoCorrect={false} maxLength={200} />
      <Boton titulo="Buscar" onPress={() => { void consultar(texto); }} />
      {!!aviso && <Text style={styles.text}>{aviso}</Text>}
    </View>
    {!estado && <Text style={styles.message}>Busca un título para descubrir películas y series.</Text>}
    {estado?.tipo === 'cargando' && <View style={styles.header}><ActivityIndicator color="#B6AAFF" /><Text style={styles.message}>Buscando…</Text></View>}
    {estado?.tipo === 'error' && <View style={styles.header}><Text accessibilityRole="alert" style={styles.message}>{estado.mensaje}</Text><Boton titulo="Reintentar" onPress={() => { void consultar(consulta, pagina); }} /></View>}
    {estado?.tipo === 'exito' && <FlatList ref={lista} data={estado.datos.resultados} keyExtractor={obra => `${obra.tipo}_${obra.tmdbId}`} contentContainerStyle={styles.results} renderItem={({ item }) => <TarjetaObra obra={item} config={config} />} ListEmptyComponent={<Text style={styles.message}>{estado.datos.totalPaginas > 1 ? 'No hay películas ni series en esta página. Prueba otra página.' : 'No encontramos películas ni series. Prueba con otro título.'}</Text>} ListFooterComponent={<View>
      {estado.datos.totalPaginas > 0 && <Text style={styles.message}>Página {estado.datos.pagina} de {estado.datos.totalPaginas}</Text>}
      {estado.datos.pagina > 1 && <Boton titulo="Página anterior" secundario onPress={() => { void consultar(consulta, estado.datos.pagina - 1); }} />}
      {estado.datos.pagina < estado.datos.totalPaginas && <Boton titulo="Página siguiente" onPress={() => { void consultar(consulta, estado.datos.pagina + 1); }} />}
    </View>} />}
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, header: { padding: 20 }, title: { color: '#FFFFFF', fontSize: 26, fontWeight: '800', marginBottom: 16 }, input: { minHeight: 50, backgroundColor: '#20253B', borderRadius: 12, borderWidth: 1, borderColor: '#4C536D', padding: 14, color: '#FFFFFF', fontSize: 16 }, text: { color: '#C1C6D8', marginTop: 10 }, message: { color: '#C1C6D8', textAlign: 'center', padding: 16, fontSize: 16 }, results: { paddingHorizontal: 20, paddingBottom: 24 } });
