import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function SecurityScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Security Settings</Text>
            <Text style={styles.info}>🔒 Two-Factor Authentication (Coming Soon!)</Text>
            <Text style={styles.info}>🔑 Password Reset Options</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
    header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    info: { fontSize: 16, color: "#ccc", marginTop: 10 },
});
