import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HelpScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Need Help?</Text>
            <Text style={styles.info}>📩 Contact Support: support@nutshell.com</Text>
            <Text style={styles.info}>📜 Read FAQ</Text>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Submit a Ticket</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
    header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    info: { fontSize: 16, color: "#ccc", marginTop: 10 },
    button: { marginTop: 20, backgroundColor: "#6EE7B7", padding: 12, borderRadius: 8 },
    buttonText: { color: "#0F172A", fontWeight: "bold" },
});
