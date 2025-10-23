import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function signUp(email, password) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', user.uid), { email, createdAt: serverTimestamp() });
  return user;
}
export async function signIn(email, password) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}
export function logOut() { return signOut(auth); }
export function onAuthState(cb) { return onAuthStateChanged(auth, cb); }
