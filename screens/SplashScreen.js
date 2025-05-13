import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
    Platform,
    Image
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather } from '@expo/vector-icons';
const { width, height } = Dimensions.get('window');

const SplashScreen = ({ onAnimationComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.3)).current;
    const titleMoveAnim = useRef(new Animated.Value(50)).current;
    
    useEffect(() => {
        const animationTimeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(titleMoveAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                
                setTimeout(() => {
                    onAnimationComplete();
                }, 1000); 
            });
        }, 500); 

        return () => clearTimeout(animationTimeout);
    }, [fadeAnim, scaleAnim, titleMoveAnim, onAnimationComplete]);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
            
            <Animated.View style={[
    styles.logoContainer,
    {
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }]
    }
]}>
    <View style={[styles.iconCircle, { width: width * 0.5, height: width * 0.5 }]}>
    <Image
        source={require('../assets/LOGO.png')}
        style={[styles.logo, { width: '120%', height: '120%' }]}
        resizeMode="contain"
    />
</View>
</Animated.View>

            <Animated.View style={[
                styles.textContainer,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: titleMoveAnim }]
                }
            ]}>
                <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTextNut}>NUT</Text>
                            <Animated.View>
                                <Text style={styles.headerTextShell}>SHELL</Text>
                            </Animated.View>
                        </View>
                
                <Text style={styles.tagline}>Your Money, Your Mastery</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    iconCircle: {
        borderRadius: width * 0.25, // Ensures it remains a circle
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0', // Optional background
    },
    logo: {
        alignSelf: 'center',
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
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: hp('4%'),
    },
    iconCircle: {
        width: wp('30%'),
        height: wp('30%'),
        borderRadius: wp('15%'),
        backgroundColor: 'rgba(110, 231, 183, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(110, 231, 183, 0.3)',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: wp('12%'),
        fontWeight: 'bold',
        color: '#F8FAFC',
        letterSpacing: wp('0.5%'),
    },
    subtitle: {
        fontSize: wp('8%'),
        fontWeight: '600',
        color: '#6EE7B7',
        marginTop: hp('-1%'),
    },
    tagline: {
        fontSize: wp('4%'),
        color: '#94A3B8',
        marginTop: hp('2%'),
        letterSpacing: wp('0.2%'),
    },
});

export default SplashScreen;