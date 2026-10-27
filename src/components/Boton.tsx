import { Pressable, StyleSheet, Text, ActivityIndicator } from 'react-native';
export function Boton({ titulo, onPress, ocupado = false, secundario = false }: { titulo: string; onPress: () => void; ocupado?: boolean; secundario?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled: ocupado, busy: ocupado }} disabled={ocupado} onPress={onPress} style={({ pressed }) => [styles.button, secundario && styles.secondary, (pressed || ocupado) && { opacity: 0.6 }]}>
    {ocupado ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.label}>{titulo}</Text>}
  </Pressable>;
}
const styles = StyleSheet.create({ button: { minHeight: 48, backgroundColor: '#6750C6', borderRadius: 12, alignItems: 'center', justifyContent: 'center', padding: 14, marginTop: 14 }, secondary: { backgroundColor: '#282D45' }, label: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', textAlign: 'center' } });
