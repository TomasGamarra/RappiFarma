// src/components/PasswordInput.js
import { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons"; // los iconos estos son compatibles con web y móvil
import { theme } from "../styles/theme";

export default function PasswordInput({ value, onChangeText, placeholder }) {
    const [secureText, setSecureText] = useState(true);

    const toggleSecureText = () => { //voy invirtiendo ver o no
        setSecureText(!secureText);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textMuted}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureText}
            />
            <TouchableOpacity style={styles.icon} onPress={toggleSecureText}>
                <MaterialCommunityIcons
                    name={secureText ? "eye-off" : "eye"}
                    size={24}
                    color={theme.colors.textMuted}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        position: "relative",
        marginBottom: 15,
    },
    input: {
        width: "100%",
        height: 50,
        borderColor: theme.colors.secondary,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingRight: 40, // espacio para el icono
        color: theme.colors.text,
    },
    icon: {
        position: "absolute",
        right: 10,
        top: 13,
    },
});