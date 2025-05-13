import React, { useEffect, useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    SafeAreaView ,
    Platform, StatusBar
} from "react-native";
import { auth } from "../config/firebase";
import CardComponents from "../components/cardComponets";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function HomeScreen({ navigation }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace("Login");
            } else {
                setLoading(false);
            }
        });

        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <CardComponents />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#151729',
        marginBottom: hp('4%'), // Adjusted for bottom navigation
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    content: {
        flex: 1,
        paddingHorizontal: wp('0%'),
        paddingBottom: hp('2%'),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        fontSize: wp('4%'),
        color: '#666',
        marginTop: hp('1%'),
    },
    buttonContainer: {
        padding: wp('4%'),
        gap: hp('1.5%'),
    },
    button: {
        padding: wp('4%'),
        borderRadius: wp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: hp('6%'),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        color: 'white',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    addButton: {
        backgroundColor: '#4CAF50',
    },
    aiButton: {
        backgroundColor: '#1976D2',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
    },
    '@media (min-width: 768px)': {
        content: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
        button: {
            maxWidth: wp('60%'),
            alignSelf: 'center',
        },
        buttonText: {
            fontSize: wp('3.5%'),
        },
    },
    '@media (min-width: 1024px)': {
        content: {
            maxWidth: wp('70%'),
        },
        button: {
            maxWidth: wp('50%'),
        },
    },
});

