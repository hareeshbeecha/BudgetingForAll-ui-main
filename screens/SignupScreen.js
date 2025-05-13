import React, { useState, useRef, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    Alert, 
    StyleSheet, 
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions
} from "react-native";
import { auth, createUserWithEmailAndPassword } from "../config/firebase";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function SignupScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;

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
            })
        ]).start();
    }, []);

    const handlePressIn = () => {
        Animated.spring(scaleValue, {
            toValue: 0.95,
            tension: 40,
            friction: 3,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
        }).start();
    };

    const handleInputFocus = () => {
        Animated.timing(inputFocusAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleInputBlur = () => {
        Animated.timing(inputFocusAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const handleSignup = async () => {
        if (!fullName.trim()) {
            Alert.alert("Error", "Please enter your full name");
            return;
        }
        if (!email.trim()) {
            Alert.alert("Error", "Please enter your email");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Error", "Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match!");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("Success", "Account Created!");
            navigation.replace("Home");
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <Animated.View
                    style={[
                        styles.content,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <View style={styles.headerContainer}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoTextNut}>NUT</Text>
                            <Text style={styles.logoTextShell}>SHELL</Text>
                        </View>
                        <Text style={styles.heading}>Join NUTSHELL Today!</Text>
                        <Text style={styles.signupTitle}>Create Account</Text>
                    </View>

                    <Animated.View
                        style={[
                            styles.formContainer,
                            {
                                transform: [{ scale: scaleValue }],
                                shadowOpacity: inputFocusAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.2, 0.4]
                                })
                            }
                        ]}
                    >
                        <Text style={styles.inputLabel}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor="#94A3B8"
                            value={fullName}
                            onChangeText={setFullName}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <Text style={styles.inputLabel}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor="#94A3B8"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <Text style={styles.inputLabel}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Create a password"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <Text style={styles.inputLabel}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm your password"
                            placeholderTextColor="#94A3B8"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                        />

                        <TouchableOpacity
                            style={styles.signupButton}
                            onPress={handleSignup}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                        >
                            <Animated.Text 
                                style={[
                                    styles.signupButtonText,
                                    { transform: [{ scale: scaleValue }] }
                                ]}
                            >
                                Create Account
                            </Animated.Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.googleButton}
                            onPress={() => Alert.alert("Info", "Google Sign Up Coming Soon")}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                        >
                            <View style={styles.googleButtonContent}>
                                <Text style={styles.googleButtonText}>
                                    Continue with Google
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>
                                Already have an account?{' '}
                                <Text 
                                    style={styles.loginLink}
                                    onPress={() => navigation.navigate("Login")}
                                >
                                    Log In
                                </Text>
                            </Text>
                        </View>

                        <Text style={styles.termsText}>
                            By signing up, you agree to our{' '}
                            <Text style={styles.link}>Terms of Service</Text> and{' '}
                            <Text style={styles.link}>Privacy Policy</Text>
                        </Text>
                    </Animated.View>
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>

        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: hp('4%'),
    },
    content: {
        flex: 1,
        padding: wp('5%'),
        paddingTop: Platform.OS === 'ios' ? hp('7%') : hp('5%'),
        alignItems: 'center',
    },
    headerContainer: {
        marginBottom: hp('4%'),
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        flexDirection: 'row',
        marginBottom: hp('2.5%'),
        alignItems: 'center',
    },
    logoTextNut: {
        fontSize: wp('9%'),
        fontWeight: "800",
        color: "#F8FAFC",
        letterSpacing: wp('0.5%'),
        textShadowColor: 'rgba(248, 250, 252, 0.2)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    logoTextShell: {
        fontSize: wp('9%'),
        fontWeight: "800",
        color: '#6EE7B7',
        letterSpacing: wp('0.5%'),
        textShadowColor: 'rgba(110, 231, 183, 0.4)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 8,
    },
    heading: {
        fontSize: wp('4.5%'),
        color: "#94A3B8",
        marginBottom: hp('1%'),
        textAlign: 'center',
    },
    signupTitle: {
        fontSize: wp('8%'),
        fontWeight: "800",
        color: "#F8FAFC",
        marginBottom: hp('2.5%'),
        textAlign: 'center',
        textShadowColor: 'rgba(248, 250, 252, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
    formContainer: {
        backgroundColor: '#1E293B',
        padding: wp('6%'),
        borderRadius: wp('6%'),
        width: '100%',
        shadowColor: '#6EE7B7',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 5,
        borderWidth: 1,
        borderColor: 'rgba(110, 231, 183, 0.1)',
    },
    inputLabel: {
        color: "#94A3B8",
        fontSize: wp('4%'),
        fontWeight: "500",
        marginBottom: hp('1%'),
        letterSpacing: wp('0.2%'),
    },
    input: {
        height: hp('7%'),
        backgroundColor: "#334155",
        borderRadius: wp('3%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('2.5%'),
        color: "#F8FAFC",
        fontSize: wp('4%'),
        borderWidth: 1,
        borderColor: 'rgba(110, 231, 183, 0.1)',
    },
    signupButton: {
        backgroundColor: '#6EE7B7',
        height: hp('7%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1.5%'),
        marginBottom: hp('2%'),
        shadowColor: '#6EE7B7',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    signupButtonText: {
        color: '#0F172A',
        fontSize: wp('4.5%'),
        fontWeight: '600',
        letterSpacing: wp('0.2%'),
    },
    googleButton: {
        backgroundColor: '#334155',
        height: hp('7%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: hp('3%'),
        borderWidth: 1,
        borderColor: 'rgba(110, 231, 183, 0.2)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    googleButtonText: {
        color: '#F8FAFC',
        fontSize: wp('4%'),
        fontWeight: '500',
        letterSpacing: wp('0.2%'),
    },
    loginContainer: {
        alignItems: 'center',
        marginBottom: hp('3%'),
        paddingVertical: hp('1%'),
    },
    loginText: {
        fontSize: wp('4%'),
        color: "#94A3B8",
        letterSpacing: wp('0.1%'),
    },
    loginLink: {
        color: '#6EE7B7',
        fontWeight: '600',
    },
    termsText: {
        fontSize: wp('3.5%'),
        textAlign: "center",
        color: "#94A3B8",
        lineHeight: hp('2.5%'),
        paddingHorizontal: wp('2%'),
    },
    link: {
        color: '#6EE7B7',
        fontWeight: '500',
    },
    '@media (min-width: 768px)': {
        content: {
            paddingHorizontal: wp('10%'),
        },
        formContainer: {
            maxWidth: wp('80%'),
            padding: wp('5%'),
            borderRadius: wp('4%'),
        },
        logoTextNut: {
            fontSize: wp('7%'),
        },
        logoTextShell: {
            fontSize: wp('7%'),
        },
        input: {
            fontSize: wp('3.5%'),
            height: hp('6%'),
            marginBottom: hp('2%'),
        },
        signupTitle: {
            fontSize: wp('6%'),
            marginBottom: hp('3%'),
        },
        heading: {
            fontSize: wp('4%'),
            marginBottom: hp('1.5%'),
        },
        signupButton: {
            height: hp('6%'),
            marginTop: hp('2%'),
        },
        googleButton: {
            height: hp('6%'),
        },
        loginContainer: {
            marginTop: hp('2%'),
        },
        termsText: {
            fontSize: wp('3%'),
            lineHeight: hp('2.2%'),
        },
    },
    '@media (min-width: 1024px)': {
        content: {
            paddingHorizontal: wp('15%'),
        },
        formContainer: {
            maxWidth: wp('60%'),
            padding: wp('4%'),
        },
        logoTextNut: {
            fontSize: wp('6%'),
        },
        logoTextShell: {
            fontSize: wp('6%'),
        },
        input: {
            fontSize: wp('3%'),
            height: hp('5.5%'),
        },
        signupButton: {
            height: hp('5.5%'),
        },
        googleButton: {
            height: hp('5.5%'),
        },
    },
    '@media (min-width: 1280px)': {
        formContainer: {
            maxWidth: wp('50%'),
        },
        input: {
            fontSize: wp('2.5%'),
        },
        signupButtonText: {
            fontSize: wp('3%'),
        },
        googleButtonText: {
            fontSize: wp('3%'),
        },
    },
});
