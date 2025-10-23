// Importar módulos base
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuración de tu proyecto (lo que te dio Firebase)
const firebaseConfig = {
  apiKey: 'AIzaSyDsXQ9gO0j425j0d1DrmIW_40MT4K0xH-k',
  authDomain: 'rappifarma-eed8f.firebaseapp.com',
  projectId: 'rappifarma-eed8f',
  storageBucket: 'rappifarma-eed8f.firebasestorage.app',
  messagingSenderId: '103121382199',
  appId: '1:103121382199:web:a9daaa2ecc07e649b488b2',
  measurementId: 'G-TRSPWZTQDC'
};

// Inicializar app de Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que vas a usar
export const auth = getAuth(app);
export const db = getFirestore(app);
