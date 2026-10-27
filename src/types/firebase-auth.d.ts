import 'firebase/auth';
import type { Persistence } from 'firebase/auth';
import type AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase exporta esta función en su implementación React Native, pero sus
// declaraciones generales omiten el export. Metro selecciona la versión nativa.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: Pick<typeof AsyncStorage, 'getItem' | 'setItem' | 'removeItem'>): Persistence;
}
