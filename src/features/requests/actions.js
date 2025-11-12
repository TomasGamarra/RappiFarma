// features/requests/actions.js
import { auth, db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
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
  const userId = user.uid; // ← clave

  // 1) Normalizar imágenes y subir
  const uris = Array.isArray(imageUri) ? imageUri : [imageUri];
  if (!uris.length) throw new Error("Debés adjuntar al menos una imagen.");

  const imageUrls = [];
  for (const uri of uris) {
    const url = await uploadToCloudinary(uri);
    if (!url) throw new Error("Fallo al subir una imagen.");
    imageUrls.push(url);
  }

  // 2) Calcular expiración
  const nowMs = Date.now();
  const expiresAt = Timestamp.fromMillis(
    nowMs + Math.max(1, windowMinutes) * 60 * 1000
  );

  // 3) Datos del usuario
  const userSnap = await getDoc(doc(db, "users", userId));
  if (!userSnap.exists()) throw new Error("No se encontró el documento del usuario en Firestore.");
  const userData = userSnap.data();
  if (!userData.direccion) throw new Error("No se encontró la dirección del usuario. Por favor completala en tu perfil.");
  const address = userData.direccion;

  // 4) Descubrir farmacias destino
  const q = query(collection(db, "users"), where("role", "==", "farmacia"));
  const qs = await getDocs(q);
  const farmaciaUids = qs.docs.map(d => d.id);
  if (farmaciaUids.length === 0) throw new Error("No hay farmacias habilitadas.");

  // 5) Batch: request + inbox pointers
  const batch = writeBatch(db);
  const reqRef = doc(collection(db, "requests"));
  const requestId = reqRef.id;
  const createdAt = serverTimestamp();

  // 5.a) Master request
  batch.set(reqRef, {
    userId,         // ← usar la variable
    createdAt,
    expiresAt,
    images: imageUrls,
    direccion: address,
    notes,
    state: "Abierto",
  });

  // 5.b) Fan-out a inbox de farmacias
  const thumb = imageUrls[0] ?? null;
  const userName = [userData?.nombre, userData?.apellido].filter(Boolean).join(" ").trim() || null;

  for (const farmaciaUid of farmaciaUids) {
    const ptrRef = doc(db, "inbox", farmaciaUid, "requests", requestId);
    batch.set(ptrRef, {
      requestId,
      createdAt,
      thumb,
      userName,
      direccion: address,
      userId,       // ← dueñx del pedido para reglas y limpieza
      // opcional: ownerId: userId,
    }, { merge: true });
  }

  // 6) Commit
  await batch.commit();

  return { requestId, images: imageUrls };
}
