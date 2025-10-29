// features/requests/uploadCloudinary.js
import { Platform } from "react-native";

const CLOUD_NAME = "divguelho";                 // <- tu cloud_name real
const UPLOAD_PRESET = "RappiFarma";    // <- tu upload preset unsigned exacto

export async function uploadToCloudinary(imageUri) {
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const data = new FormData();

  if (Platform.OS === "web") {
    // En web, la uri suele ser blob: o data: — convertimos a Blob explícitamente
    const res = await fetch(imageUri);
    const blob = await res.blob();
    data.append("file", blob, "photo.jpg");
  } else {
    // En móvil (Expo/React Native) alcanza con { uri, type, name }
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
  }

  // Preset UNSIGNED (no lleva api_secret)
  data.append("upload_preset", UPLOAD_PRESET);

  // (Opcional) forzar carpeta si no la seteaste en el preset:
  // data.append("folder", "rappifarma");

  const res = await fetch(endpoint, { method: "POST", body: data });

  // Si falla, Cloudinary manda JSON con { error: { message } }
  let json;
  try {
    json = await res.json();
  } catch (_) {
    throw new Error(`Cloudinary respondió ${res.status} sin JSON`);
  }

  if (!res.ok) {
    const msg = json?.error?.message || `HTTP ${res.status}`;
    // Log útil para debugging
    console.error("Cloudinary upload error:", msg, json);
    throw new Error(msg);
  }

  return json.secure_url; // URL pública https
}
