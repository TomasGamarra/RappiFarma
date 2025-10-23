import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { theme } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Aquí iría la lógica de login
        console.log('Email:', email, 'Password:', password);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Iniciar Sesión</Text>

            {/* Email */}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Password */}
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.inputWithIcon}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.iconButton}
                >
                    <Ionicons
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={22}
                        color={theme.colors.textMuted}
                    />
                </Pressable>
            </View>



            {/* Botón Login */}
            <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
            </Pressable>

            {/* Registro */}
            <View style={styles.registerContainer}>
                <Text>No tenés cuenta? </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate('RegisterScreen')}
                >
                    <Text style={styles.registerText}>Registrate</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
        justifyContent: 'center',
    },
    title: {
        fontSize: theme.typography.fontSize.title,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.xl,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: theme.colors.textMuted,
        borderRadius: theme.borderRadius.sm,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.text,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    showButton: {
        marginLeft: theme.spacing.sm,
    },
    showButtonText: {
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.bold,
    },
    loginButton: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.md,
        marginTop: theme.spacing.lg,
        alignItems: 'center',
    },
    loginButtonText: {
        color: theme.colors.background,
        fontWeight: theme.typography.fontWeight.bold,
        fontSize: theme.typography.fontSize.medium,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    registerText: {
        color: theme.colors.secondary,
        fontWeight: theme.typography.fontWeight.bold,
    }, inputWrapper: {
        position: 'relative',
        marginBottom: theme.spacing.md,
    },

    inputWithIcon: {
        borderWidth: 1,
        borderColor: theme.colors.textMuted,
        borderRadius: theme.borderRadius.sm,
        paddingVertical: theme.spacing.md,
        paddingLeft: theme.spacing.md,
        paddingRight: 40, // 🔹 deja espacio para el icono a la derecha
        fontSize: theme.typography.fontSize.medium,
        color: theme.colors.text,
    },

    iconButton: {
        position: 'absolute',
        right: theme.spacing.md,
        top: '50%',
        transform: [{ translateY: -12 }], // 🔹 centra el ojo verticalmente
    }

});
