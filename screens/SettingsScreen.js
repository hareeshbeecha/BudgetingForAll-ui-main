import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";

export default function SettingsScreen() {
    const [darkMode, setDarkMode] = React.useState(true);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>App Settings</Text>
            <View style={styles.settingRow}>
                <Text style={styles.settingText}>Dark Mode</Text>
                <Switch value={darkMode} onValueChange={(value) => setDarkMode(value)} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F172A" },
    header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
    settingRow: { flexDirection: "row", justifyContent: "space-between", width: "80%", padding: 10 },
    settingText: { fontSize: 16, color: "#fff" },
});
