import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import Toast from "react-native-toast-message";
import { theme } from "../styles/theme";
import PasswordInput from "../components/PasswordInput";
import { signIn } from "../features/auth/actions";

export default function LoginScreen({ navigation }) {
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const d = dni.trim();
    const pass = password;

    /*   if (!d) {
        Toast.show({ type: "error", text1: "Ingresá tu DNI" });
        return;
      }
      if (!pass || pass.length < 6) {
        Toast.show({ type: "error", text1: "La contraseña debe tener al menos 6 caracteres." });
        return;
      } */

    try {
      setLoading(true);
      await signIn(d, pass);
      Toast.show({ type: "success", text1: "Login exitoso" });
      navigation.replace("Home");
    } catch (e) {
      const map = {
        "auth/invalid-credential": "Credenciales inválidas",
        "auth/user-not-found": "Usuario no encontrado",
        "auth/wrong-password": "Contraseña incorrecta",
        "auth/too-many-requests": "Demasiados intentos. Probá más tarde",
      };
      Toast.show({ type: "error", text1: map[e?.code] || "Complete DNI y contraseña" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Image
          source={require("../../assets/adaptive-icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>RappiFarma</Text>
        <Text style={styles.subtitle}>Ingresá tus datos para acceder a tu cuenta</Text>

        <Text style={styles.Text}>DNI</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 12345678"
          placeholderTextColor={theme.colors.textMuted}
          value={dni}
          onChangeText={setDni}
          keyboardType="numeric"
        />

        <Text style={styles.Text}>Contraseña</Text>
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "..." : "Iniciar sesión"}</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>
          ¿No tenés cuenta?
          <TouchableOpacity onPress={() => navigation.replace("Register")}>
            <Text style={styles.registerLink}> Registrate</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: theme.colors.background3, padding: 20,
  },
  formContainer: {
    width: "30%", minWidth: 350, justifyContent: "center",
    backgroundColor: theme.colors.background, borderRadius: 20, padding: 25,
    shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
  },
  title: { fontSize: 25, color: theme.colors.primary, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  logo: { width: 150, height: 150, marginBottom: 10, alignSelf: "center", transform: [{ translateX: -20 }] },
  subtitle: { fontSize: 15, color: theme.colors.textMuted, marginBottom: 20, textAlign: "center" },
  Text: { color: theme.colors.text, fontWeight: "bold", textAlign: "left", marginBottom: 2 },
  input: {
    width: "100%", height: 50, borderColor: theme.colors.secondary, borderWidth: 1,
    borderRadius: 10, paddingHorizontal: 10, marginBottom: 15,
  },
  button: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 10, width: "40%", alignSelf: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", alignSelf: "center" },
  registerText: { marginTop: 15, color: theme.colors.text, textAlign: "center" },
  registerLink: { color: theme.colors.primary, fontWeight: "bold" },
});
