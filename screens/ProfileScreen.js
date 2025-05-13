import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
  ScrollView,
  Dimensions,
} from "react-native";
import { auth, signOut } from "../config/firebase";
import { Ionicons } from "@expo/vector-icons";
import profileImage from "../assets/profile.png";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export default function ProfileScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const slideAnim = useRef(new Animated.Value(hp("5%"))).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Success", "Logged Out!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile Image */}
      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Image source={profileImage} style={styles.profileImage} />
      </Animated.View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.profileContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <Text style={styles.userName}>John Smith</Text>
          <Text style={styles.userId}>
            ID: {auth.currentUser?.email || "25030024"}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.menuContainer, { opacity: fadeAnim }]}>
          <MenuItem
            icon="person-outline"
            text="Edit Profile"
            onPress={() => navigation.navigate("EditProfile")}
          />
          <MenuItem
            icon="shield-checkmark-outline"
            text="Security"
            onPress={() => navigation.navigate("Security")}
          />
          <MenuItem
            icon="settings-outline"
            text="Settings"
            onPress={() => navigation.navigate("Settings")}
          />
          <MenuItem
            icon="help-circle-outline"
            text="Help"
            onPress={() => navigation.navigate("Help")}
          />
          <MenuItem
            icon="log-out-outline"
            text="Logout"
            onPress={handleLogout}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const MenuItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <Ionicons
      name={icon}
      size={isTablet ? wp("5%") : wp("6%")}
      color="#6EE7B7"
    />
    <Text style={styles.menuText}>{text}</Text>
    <Ionicons
      name="chevron-forward-outline"
      size={isTablet ? wp("4%") : wp("5%")}
      color="#94A3B8"
    />
  </TouchableOpacity>
);

// Update animation values in the main component

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: hp("2%"),
  },
  header: {
    backgroundColor: "#1E293B",
    height: hp("18%"),
    borderBottomLeftRadius: wp("8%"),
    borderBottomRightRadius: wp("8%"),
    alignItems: "center",
    justifyContent: "center",
    paddingTop: hp("4%"),
    shadowColor: "#6EE7B7",
    shadowOffset: { width: 0, height: hp("1%") },
    shadowOpacity: 0.1,
    shadowRadius: wp("6%"),
    elevation: 5,
  },
  profileImage: {
    width: isTablet ? wp("20%") : wp("28%"),
    height: isTablet ? wp("20%") : wp("28%"),
    borderRadius: isTablet ? wp("10%") : wp("14%"),
    borderWidth: wp("0.8%"),
    borderColor: "#6EE7B7",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: hp("2%"),
    width: isTablet ? wp("60%") : wp("90%"),
    alignSelf: "center",
  },
  userName: {
    fontSize: isTablet ? wp("4%") : wp("5.5%"),
    fontWeight: "700",
    color: "#F8FAFC",
  },
  userId: {
    fontSize: isTablet ? wp("2.5%") : wp("3.5%"),
    color: "#94A3B8",
    marginTop: hp("1%"),
  },
  menuContainer: {
    marginTop: hp("2%"),
    paddingHorizontal: wp("5%"),
    width: isTablet ? wp("70%") : wp("100%"),
    alignSelf: "center",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1E293B",
    padding: wp("4%"),
    borderRadius: wp("4%"),
    marginVertical: hp("1%"),
    shadowColor: "#6EE7B7",
    shadowOffset: { width: 0, height: hp("0.5%") },
    shadowOpacity: 0.1,
    shadowRadius: wp("3%"),
    elevation: 5,
  },
  menuText: {
    fontSize: isTablet ? wp("3%") : wp("4%"),
    color: "#F8FAFC",
    marginLeft: wp("4%"),
    flex: 1,
  },
});
