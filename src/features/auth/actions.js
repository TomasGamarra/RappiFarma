import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function signUp(dni, password, nombre, apellido) {
  const fakeEmail = `${dni}@rappifarma.com`;
  const { user } = await createUserWithEmailAndPassword(auth, fakeEmail, password);

  await setDoc(doc(db, 'users', user.uid), {
    dni,
    nombre,
    apellido,
    // Campos adicionales opcionales
    domicilio: "",
    telefono: "",
    numeroBeneficiario: "",
    direccion: "",
    historialCompras: [],
    fotoCarnetURL: null, // se subirá más adelante
    createdAt: serverTimestamp(),
  });

  return user;
}


export async function signIn(dni, password) {
  const fakeEmail = `${dni}@rappifarma.com`;
  const { user } = await signInWithEmailAndPassword(auth, fakeEmail, password);
  return user;
}

export function logOut() { return signOut(auth); }
export function onAuthState(cb) { return onAuthStateChanged(auth, cb); }


