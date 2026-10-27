import NetInfo from '@react-native-community/netinfo';
import { AppState } from 'react-native';
export function observarConexion(cambio: (conectado: boolean | null) => void): () => void {
  let activo = true;
  const cancelar = NetInfo.addEventListener(estado => {
    if (activo) cambio(estado.isConnected === false || estado.isInternetReachable === false ? false : estado.isConnected === true && estado.isInternetReachable === true ? true : null);
  });
  const app = AppState.addEventListener('change', estado => {
    if (estado === 'active') void NetInfo.refresh().catch(() => {});
  });
  return () => { activo = false; cancelar(); app.remove(); };
}
