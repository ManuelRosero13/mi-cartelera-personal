import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>TU PRÓXIMA HISTORIA</Text>
      <Text style={styles.title}>Mi Cartelera Personal</Text>
      <Text style={styles.description}>
        Un lugar para las películas y series que quieres ver.
      </Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Estamos comenzando</Text>
        <Text style={styles.cardText}>
          La base de la app está lista. El siguiente paso será crear tu cuenta e iniciar sesión.
        </Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101322',
    justifyContent: 'center',
    padding: 28,
  },
  eyebrow: { color: '#AFA4FF', fontSize: 12, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', marginTop: 16 },
  description: { color: '#C1C6D8', fontSize: 18, lineHeight: 27, marginTop: 16 },
  card: { backgroundColor: '#20253B', borderRadius: 20, padding: 24, marginTop: 36 },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  cardText: { color: '#C1C6D8', fontSize: 16, lineHeight: 24 },
});
