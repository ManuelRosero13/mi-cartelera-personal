import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Boton } from '../components/Boton';
import { useCartelera } from '../context/CarteleraContext';
import { mensajeAuth, validarFormulario } from '../services/authValidation';
export function Login() {
  const { ingresar, registrar } = useCartelera();
  const [registro, setRegistro] = useState(false);
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const enviando = useRef(false);
  async function enviar() {
    if (enviando.current) return;
    const validacion = validarFormulario(correo, clave, registro, confirmacion);
    setError(validacion);
    if (validacion) return;
    enviando.current = true;
    setOcupado(true);
    try { await (registro ? registrar : ingresar)(correo, clave); }
    catch (fallo: unknown) { setError(mensajeAuth(fallo)); }
    finally { enviando.current = false; setOcupado(false); }
  }
  return <SafeAreaView style={styles.safe}>
    <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <Text style={styles.brand}>MI CARTELERA PERSONAL</Text>
        <Text style={styles.title}>{registro ? 'Crea tu cuenta' : 'Bienvenido de nuevo'}</Text>
        <Text style={styles.subtitle}>Tus películas y series, en un solo lugar.</Text>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput accessibilityLabel="Correo electrónico" style={styles.input} value={correo} onChangeText={setCorreo} editable={!ocupado} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" placeholder="nombre@correo.com" placeholderTextColor="#9098AE" />
        <Text style={styles.label}>Contraseña</Text>
        <TextInput key={registro ? 'nueva' : 'actual'} accessibilityLabel="Contraseña" style={styles.input} value={clave} onChangeText={setClave} editable={!ocupado} secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete={registro ? 'new-password' : 'current-password'} placeholder={registro ? 'Al menos 6 caracteres' : 'Tu contraseña'} placeholderTextColor="#9098AE" />
        {registro && <><Text style={styles.label}>Confirmar contraseña</Text><TextInput accessibilityLabel="Confirmar contraseña" style={styles.input} value={confirmacion} onChangeText={setConfirmacion} editable={!ocupado} secureTextEntry autoCapitalize="none" autoCorrect={false} autoComplete="new-password" /></>}
        {error && <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
        <Boton titulo={registro ? 'Crear cuenta' : 'Iniciar sesión'} ocupado={ocupado} onPress={() => { void enviar(); }} />
        <Boton titulo={registro ? 'Ya tengo cuenta' : 'Crear una cuenta'} secundario ocupado={ocupado} onPress={() => { setRegistro(!registro); setError(null); setClave(''); setConfirmacion(''); }} />
      </ScrollView>
    </KeyboardAvoidingView>
  </SafeAreaView>;
}
const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#101322' }, content: { flexGrow: 1, justifyContent: 'center', padding: 28 }, brand: { color: '#B6AAFF', fontSize: 12, letterSpacing: 2, fontWeight: '700' }, title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 18 }, subtitle: { color: '#C1C6D8', fontSize: 16, marginTop: 12, marginBottom: 20 }, label: { color: '#E8EAF2', marginTop: 16, marginBottom: 8, fontSize: 16 }, input: { minHeight: 50, borderRadius: 12, borderWidth: 1, borderColor: '#4C536D', backgroundColor: '#20253B', color: '#FFFFFF', padding: 14, fontSize: 16 }, error: { color: '#FFB4AB', fontSize: 15, marginTop: 16 } });
