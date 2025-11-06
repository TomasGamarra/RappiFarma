// features/requests/actions.js
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  addDoc,
  collection,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { uploadToCloudinary } from "./uploadCloudinary";

export async function createRequestWithPhoto({
  imageUri,
  notes = "",
  windowMinutes = 20,
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("NO_AUTENTICADO");

  // normalizo a array
  const uris = Array.isArray(imageUri) ? imageUri : [imageUri];
  if (!uris.length) throw new Error("Debés adjuntar al menos una imagen.");

  // 1) Subir imágenes a Cloudinary
  const imageUrls = [];
  for (const uri of uris) {
    const url = await uploadToCloudinary(uri);
    if (!url) throw new Error("Fallo al subir una imagen.");
    imageUrls.push(url);
  }

  // 2) Timestamps
  const nowMs = Date.now();
  const expiresAt = Timestamp.fromMillis(
    nowMs + Math.max(1, windowMinutes) * 60 * 1000
  );

  // 3) Traer la dirección del usuario desde Firestore
  const userSnap = await getDoc(doc(db, "users", user.uid));
  if (!userSnap.exists()) {
    throw new Error("No se encontró el documento del usuario en Firestore.");
  }
  const userData = userSnap.data();
  if (!userData.direccion) {
    throw new Error("No se encontró la dirección del usuario. Por favor completala en tu perfil.");
  }
  const address = userData.direccion; 

  // 4) Crear documento del request
  const docRef = await addDoc(collection(db, "requests"), {
    userId: user.uid,
    createdAt: serverTimestamp(),
    expiresAt,
    images: imageUrls,
    direccion: address,   
  });

  return { requestId: docRef.id, images: imageUrls };
}