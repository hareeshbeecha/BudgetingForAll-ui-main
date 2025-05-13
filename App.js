import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, TouchableOpacity, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./config/firebase";
import Icon from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

// Import Screens
import HomeScreen from "./screens/HomeScreen";
import ExpensesScreen from "./screens/ExpensesScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import AIChatScreen from "./screens/AIChatScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SplashScreen from './screens/SplashScreen';
import NotificationsScreen from "./screens/NotificationsScreen"; 

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import FireScreen from "./screens/FireScreen";

// New Profile Screens
import EditProfileScreen from "./screens/EditProfileScreen";
import SecurityScreen from "./screens/SecurityScreen";
import SettingsScreen from "./screens/SettingsScreen";
import HelpScreen from "./screens/HelpScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Function to Add Notifications Button in the Header
function screenOptionsWithNotification({ navigation, route }) {
    return {
        headerRight: () => (
            <TouchableOpacity style={styles.notificationBtn} onPress={() => navigation.navigate("Notifications")}>
                <Icon name="bell" size={22} color="#6EE7B7" />
            </TouchableOpacity>
        ),
        headerLeft: () => (
            <View style={styles.headerLeft}>
                <Icon name={getHeaderIcon(route.name)} size={22} color="#6EE7B7" />
                <Text style={styles.headerTitle}>{route.name}</Text>
            </View>
        ),
        headerStyle: styles.header,
        headerTitle: '',
    };
}

const getHeaderIcon = (routeName) => ({
    Home: "home",
    "Expenses Analytics": "pie-chart",
    Expenses: "credit-card",
    "Ask AI": "cpu",
    Profile: "user",
    Fire: "trending-up",
    Notifications: "bell"
}[routeName] || "circle");

// ✅ Bottom Tab Navigator with Notifications Button
function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route, navigation }) => ({
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    if (route.name === "Home") iconName = "home";
                    else if (route.name === "Expenses") iconName = "credit-card";
                    else if (route.name === "Expenses Analytics") iconName = "pie-chart";
                    else if (route.name === "Ask AI") iconName = "message-circle";
                    else if (route.name === "Profile") iconName = "user";
                    else if (route.name === "Fire") iconName = "trending-up";

                    return (
                        <View style={[styles.tabIconWrapper, focused && styles.tabIconActive]}>
                            <Icon name={iconName} size={24} color={focused ? "#6EE7B7" : "#94A3B8"} />
                        </View>
                    );
                },
                tabBarShowLabel: true,
                tabBarStyle: {
                    ...styles.tabBar,
                    backgroundColor: "#1E293B",
                    borderTopLeftRadius: 25,
                    borderTopRightRadius: 25,
                    position: "absolute",
                    height: 75,
                },
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarActiveTintColor: "#6EE7B7",
                tabBarInactiveTintColor: "#94A3B8",
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Expenses Analytics" component={ExpensesScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Expenses" component={AddExpenseScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Ask AI" component={AIChatScreen} options={screenOptionsWithNotification} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
            <Tab.Screen name="Fire" component={FireScreen} options={screenOptionsWithNotification} />
        </Tab.Navigator>
    );
}

// ✅ Profile Stack Navigator (Includes Edit Profile, Security, etc.)
function ProfileStackNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Profile" component={ProfileScreen} options={screenOptionsWithNotification} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
        </Stack.Navigator>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [splashComplete, setSplashComplete] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            console.log("Auth state changed:", user);
            setUser(user);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading || !splashComplete) {
        return <SplashScreen onAnimationComplete={() => setSplashComplete(true)} />;
    }

    return (
        <NavigationContainer>
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#0F172A',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: '#6EE7B7',
                headerTitleStyle: {
                    color: '#F8FAFC',
                    fontSize: wp('5%'),
                    fontWeight: '600',
                },
                cardStyle: { backgroundColor: '#0F172A' },
            }}
        >
            {user ? (
                <>
                    <Stack.Screen 
                        name="Tabs" 
                        component={BottomTabs} 
                        options={{ headerShown: false }} 
                    />
                    <Stack.Screen 
                        name="Notifications" 
                        component={NotificationsScreen}
                        options={{
                            headerBackTitleVisible: false,
                            headerTitleAlign: 'center',
                        }} 
                    />
                </>
            ) : (
                <>
                    <Stack.Screen 
                        name="Login" 
                        component={LoginScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen 
                        name="Signup" 
                        component={SignupScreen}
                        options={{
                            headerBackTitleVisible: false,
                            headerTransparent: true,
                            headerTitle: '',
                            headerTintColor: '#6EE7B7',
                        }} 
                    />
                </>
            )}
        </Stack.Navigator>
    </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F172A",
    },
    tabBar: {
        backgroundColor: "#1E293B",
        borderTopWidth: 0,
        height: 84,
        paddingBottom: 24,
        paddingTop: 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    tabIconWrapper: {
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 24,
    },
    tabIconActive: {
        backgroundColor: "rgba(110, 231, 183, 0.66)",
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: "500",
        marginTop: 7,
    },
    header: {
        backgroundColor: "#0F172A",
        height: 70,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 16,
    },
    headerTitle: {
        color: "#F8FAFC",
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 12,
    },
    notificationBtn: {
        marginRight: 16,
        padding: 8,
    },
});
