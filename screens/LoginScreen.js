import React, { useState, useEffect, useRef } from "react";
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
    ActivityIndicator
} from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: "436010534471-1qfjnd9tjklcn8qs3hujg9tadddia9br.apps.googleusercontent.com",
    });

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleValue = useRef(new Animated.Value(1)).current;
    const inputFocusAnim = useRef(new Animated.Value(0)).current;

    // Initial animations
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

    // Auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) navigation.replace("Home");
        });
        return unsubscribe;
    }, []);

    // Google sign in response handler
    useEffect(() => {
        if (response?.type === "success") {
            handleGoogleSignIn(response.params.id_token);
        }
    }, [response]);

    // Animation handlers
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

    // Auth handlers
    const handleEmailLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async (idToken) => {
        setIsLoading(true);
        try {
            const credential = GoogleAuthProvider.credential(idToken);
            await signInWithCredential(auth, credential);
        } catch (error) {
            Alert.alert("Error", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const HeaderTitle = () => (
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTextNut}>NUT</Text>
            <Animated.View>
                <Text style={styles.headerTextShell}>SHELL</Text>
            </Animated.View>
        </View>
    );

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
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
                <View style={styles.header}>
                    <HeaderTitle />
                    <Text style={styles.subHeaderText}>Welcome Back</Text>
                </View>

                <Animated.View 
                    style={[
                        styles.gradientCard,
                        {
                            transform: [{ scale: scaleValue }],
                            shadowOpacity: inputFocusAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.2, 0.4]
                            })
                        }
                    ]}
                >
                    <Text style={styles.labelText}>Email</Text>
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
                        editable={!isLoading}
                    />
                    <Text style={styles.labelText}>Password</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#94A3B8"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        editable={!isLoading}
                    />
                    <TouchableOpacity 
                        style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                        onPress={handleEmailLogin}
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        disabled={isLoading}
                    >
                        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
                            {isLoading ? (
                                <ActivityIndicator color="#0F172A" />
                            ) : (
                                <Text style={styles.loginButtonText}>Log In</Text>
                            )}
                        </Animated.View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "Password reset feature coming soon!")}>
                        <Text style={styles.forgotPassword}>Forgot Password?</Text>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity 
                        style={[styles.socialButton, styles.googleButton]}
                        onPress={() => promptAsync()}
                        disabled={isLoading}
                    >
                        <Text style={styles.socialButtonText}>Google</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.socialButton, styles.facebookButton]}
                        onPress={() => Alert.alert("Coming Soon", "Facebook login coming soon!")}
                        disabled={isLoading}
                    >
                        <Text style={styles.socialButtonText}>Facebook</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.noAccountContainer}>
                    <Text style={styles.noAccountText}>Don't have an account?</Text>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate("Signup")}
                        disabled={isLoading}
                        style={styles.signUpButton}
                    >
                        <Text style={styles.signUpText}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </KeyboardAvoidingView>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
    },
    content: {
        flex: 1,
        padding: wp('5%'),
    },
    header: {
        marginTop: hp('8%'),
        marginBottom: hp('4%'),
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTextNut: {
        color: "#F8FAFC",
        fontSize: wp('9%'),
        fontWeight: "800",
        letterSpacing: 1,
    },
    headerTextShell: {
        fontSize: wp('9%'),
        fontWeight: "800",
        letterSpacing: 1,
        color: '#6EE7B7',
        textShadowColor: 'rgba(110, 231, 183, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    subHeaderText: {
        color: "#94A3B8",
        fontSize: wp('4.5%'),
        marginTop: hp('1%'),
    },
    gradientCard: {
        padding: wp('6%'),
        borderRadius: wp('6%'),
        backgroundColor: '#1E293B',
        shadowColor: '#6EE7B7',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowRadius: 12,
        elevation: 5,
    },
    labelText: {
        color: "#94A3B8",
        fontSize: wp('4%'),
        marginBottom: hp('1%'),
        fontWeight: '500',
    },
    input: {
        height: hp('7%'),
        backgroundColor: "#334155",
        borderRadius: wp('3%'),
        paddingHorizontal: wp('4%'),
        marginBottom: hp('2.5%'),
        color: "#F8FAFC",
        fontSize: wp('4%'),
    },
    loginButton: {
        backgroundColor: '#6EE7B7',
        borderRadius: wp('4%'),
        height: hp('7%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('1.5%'),
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#0F172A',
        fontSize: wp('4.5%'),
        fontWeight: '600',
    },
    forgotPassword: {
        color: '#94A3B8',
        fontSize: wp('3.8%'),
        textAlign: 'center',
        marginTop: hp('2%'),
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('3%'),
        paddingHorizontal: wp('1.5%'),
    },
    socialButton: {
        flex: 1,
        marginHorizontal: wp('1.5%'),
        height: hp('7%'),
        borderRadius: wp('4%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleButton: {
        backgroundColor: '#818CF8',
    },
    facebookButton: {
        backgroundColor: '#1877F2',
    },
    socialButtonText: {
        color: '#F8FAFC',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    noAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('3%'),
    },
    noAccountText: {
        color: '#94A3B8',
        fontSize: wp('4%'),
    },
    signUpButton: {
        marginLeft: wp('2%'),
    },
    signUpText: {
        color: '#6EE7B7',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    '@media (min-width: 768px)': {
        content: {
            paddingHorizontal: wp('10%'),
        },
        gradientCard: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
        headerTextNut: {
            fontSize: wp('7%'),
        },
        headerTextShell: {
            fontSize: wp('7%'),
        },
        input: {
            fontSize: wp('3.5%'),
            height: hp('6%'),
        },
        socialButtonsContainer: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
    },
    '@media (min-width: 1024px)': {
        content: {
            paddingHorizontal: wp('15%'),
        },
        gradientCard: {
            maxWidth: wp('60%'),
        },
        headerTextNut: {
            fontSize: wp('6%'),
        },
        headerTextShell: {
            fontSize: wp('6%'),
        },
        socialButtonsContainer: {
            maxWidth: wp('60%'),
        },
    },
});