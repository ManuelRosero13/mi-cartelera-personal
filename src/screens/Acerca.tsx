import { useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartelera } from '../context/CarteleraContext';
import { Boton } from '../components/Boton';
import { TmdbLogo } from '../components/TmdbLogo';
import { mensajeAuth } from '../services/authValidation';
export function Acerca() {
  const { sesion, salir } = useCartelera();
  const [ocupado, setOcupado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function cerrar() {
    setOcupado(true); setError(null);
    try { await salir(); } catch (fallo: unknown) { setError(mensajeAuth(fallo)); }
    finally { setOcupado(false); }
  }
  async function visitarTmdb() {
    try { await Linking.openURL('https://www.themoviedb.org'); }
    catch { setError('No se pudo abrir TMDB en el navegador.'); }
  }
  return <SafeAreaView edges={['bottom']} style={styles.safe}><ScrollView contentContainerStyle={styles.content}>
    <Text style={styles.title}>Mi Cartelera Personal</Text>
    <Text style={styles.version}>Versión 1.0.0 · Proyecto académico</Text>
    <Text style={styles.text}>Descubre películas y series y organiza tu lista privada con estados, calificaciones y comentarios.</Text>
    <Text style={styles.heading}>Créditos</Text>
    <Text style={styles.text}>Los datos del catálogo y las imágenes se obtienen de The Movie Database.</Text>
    <View style={styles.logo}><TmdbLogo /></View>
    <Text style={styles.notice}>This product uses the TMDB API but is not endorsed or certified by TMDB.</Text>
    <Boton titulo="Visitar TMDB" secundario onPress={() => { void visitarTmdb(); }} />
    <Text style={styles.heading}>Tu cuenta</Text>
    <Text style={styles.text}>{sesion.tipo === 'exito' ? sesion.usuario?.email : ''}</Text>
    <Text style={styles.text}>Tu lista se guarda en tu cuenta. Este dispositivo conserva una copia para consultarla sin conexión; guardar cambios requiere internet.</Text>
    {error && <Text accessibilityRole="alert" style={styles.error}>{error}</Text>}
    <Boton titulo="Cerrar sesión" ocupado={ocupado} onPress={() => { void cerrar(); }} />
  </ScrollView></SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, content: { padding: 28 }, title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800' }, version: { color: '#B6AAFF', fontSize: 14, marginTop: 12 }, heading: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginTop: 30 }, text: { color: '#C1C6D8', fontSize: 16, lineHeight: 25, marginTop: 14 }, notice: { color: '#E8EAF2', fontSize: 15, lineHeight: 24 }, logo: { marginVertical: 24 }, error: { color: '#FFB4AB', marginTop: 16 } });
