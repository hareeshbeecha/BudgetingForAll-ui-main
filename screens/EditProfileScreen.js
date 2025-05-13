import React, { useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";

export default function EditProfileScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Text style={styles.header}>Edit Profile</Text>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#ccc" />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#ccc" />
            <TouchableOpacity style={styles.button} onPress={() => alert("Profile Updated!")}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
    header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    input: { width: "80%", padding: 12, borderWidth: 1, borderColor: "#6EE7B7", borderRadius: 8, color: "#fff", marginBottom: 15 },
    button: { backgroundColor: "#6EE7B7", padding: 12, borderRadius: 8, width: "80%", alignItems: "center" },
    buttonText: { color: "#0F172A", fontWeight: "bold" },
});
