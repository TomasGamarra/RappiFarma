// features/requests/actions.js
import { auth, db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { uploadToCloudinary } from "./uploadCloudinary";

export async function createRequestWithPhoto({ imageUri }) {
  const user = auth.currentUser;
  if (!user) throw new Error("NOT_AUTHENTICATED");

  // 1) Subir imagen a Cloudinary
  const imageUrl = await uploadToCloudinary(imageUri);

  // 2) Crear documento en Firestore
  const reqRef = await addDoc(collection(db, "requests"), {
    userId: user.uid,
    images: [imageUrl],
    status: "pendiente",
    createdAt: serverTimestamp(),
  });

  return { requestId: reqRef.id, imageUrl };
}
