import React, { useState, useEffect } from "react";
import { 
    View, 
    Text, 
    TextInput, 
    StyleSheet, 
    Alert,
    TouchableOpacity,
    SafeAreaView,
    Switch,
    Dimensions,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator,
    StatusBar
} from "react-native";
import { addExpense, categorizeExpense } from "../services/api";
import { auth } from "../config/firebase";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';



export default function AddExpenseScreen({ navigation }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [user, setUser] = useState(null);
    const [isIncome, setIsIncome] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (!user) {
                navigation.replace("Login");
            } else {
                setUser(user);
            }
        });

        return unsubscribe;
    }, []);

    const handleCategorization = async () => {
        if (!description) return Alert.alert("Error", "Enter a description");
        const result = await categorizeExpense(description);
        setCategory(result);
    };

    const handleAddTransaction = async () => {
        if (!description || !amount) {
            return Alert.alert("Error", "All fields are required");
        }

        try {
            const finalAmount = isIncome ? 
                Math.abs(parseFloat(amount)) : 
                -Math.abs(parseFloat(amount));

            await addExpense(
                description, 
                finalAmount, 
                category || (isIncome ? "Income" : "Other")
            );
            
            Alert.alert(
                "Success", 
                `${isIncome ? "Income" : "Expense"} added successfully!`
            );
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", error.message);
        }
    };

    if (!user) return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00B386" />
            <Text style={styles.loadingText}>Loading...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
            >
                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>
                            Add {isIncome ? 'Income' : 'Expense'}
                        </Text>
                        <Text style={styles.headerSubtitle}>
                            Track your financial flow
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <View style={styles.switchContainer}>
                            <TouchableOpacity 
                                style={[
                                    styles.switchButton,
                                    !isIncome && styles.switchButtonActive
                                ]}
                                onPress={() => setIsIncome(false)}
                            >
                                <Text style={[
                                    styles.switchText,
                                    !isIncome && styles.switchTextActive
                                ]}>Expense</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[
                                    styles.switchButton,
                                    isIncome && styles.switchButtonActive
                                ]}
                                onPress={() => setIsIncome(true)}
                            >
                                <Text style={[
                                    styles.switchText,
                                    isIncome && styles.switchTextActive
                                ]}>Income</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.amountContainer}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="0.00"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="What's this for?"
                                placeholderTextColor="#666"  
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.categoryButton}
                            onPress={handleCategorization}
                        >
                            <Text style={styles.categoryButtonText}>
                                {category ? category : 'Select Category'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={[
                                styles.submitButton,
                                { backgroundColor: isIncome ? '#00B386' : '#FF6B6B' }
                            ]}
                            onPress={handleAddTransaction}
                        >
                            <Text style={styles.submitButtonText}>
                                Add {isIncome ? 'Income' : 'Expense'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: wp('4%'),
        paddingBottom: hp('12%'), // Added padding for bottom navigation
    },
    header: {
        marginTop: hp('2%'),
        marginBottom: hp('4%'),
    },
    headerTitle: {
        fontSize: wp('7%'),
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: hp('1%'),
    },
    headerSubtitle: {
        fontSize: wp('4%'),
        color: '#94A3B8',
    },
    card: {
        backgroundColor: '#1E293B',
        borderRadius: wp('5%'),
        padding: wp('5%'),
        width: wp('92%'),
        alignSelf: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#6EE7B7',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    switchContainer: {
        flexDirection: 'row',
        backgroundColor: '#94A3B8',
        borderRadius: wp('3%'),
        padding: wp('1%'),
        marginBottom: hp('3%'),
    },
    switchButton: {
        flex: 1,
        paddingVertical: hp('1.5%'),
        alignItems: 'center',
        borderRadius: wp('2.5%'),
    },
    switchButtonActive: {
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    switchText: {
        fontSize: wp('4%'),
        color: '#666',
        fontWeight: '500',
    },
    switchTextActive: {
        color: '#00B386',
        fontWeight: '600',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp('4%'),
    },
    currencySymbol: {
        fontSize: wp('10%'),
        color: '#94A3B8',
        marginRight: wp('2%'),
    },
    amountInput: {
        fontSize: wp('10%'),
        color: '#999',
        minWidth: wp('40%'),
        textAlign: 'center',
    },
    inputGroup: {
        marginBottom: hp('3%'),
    },
    label: {
        fontSize: wp('4%'),
        color: '#94A3B8',
        marginBottom: hp('1%'),
    },
    input: {
        backgroundColor: '#94A3B8',
        borderRadius: wp('3%'),
        padding: wp('4%'),
        fontSize: wp('4%'),
        color: '#F8FAFC',
    },
    categoryButton: {
        backgroundColor: '#94A3B8',
        borderRadius: wp('3%'),
        padding: wp('4%'),
        alignItems: 'center',
        marginBottom: hp('3%'),
    },
    categoryButtonText: {
        fontSize: wp('4%'),
        color: '#666',
        fontWeight: '500',
    },
    submitButton: {
        borderRadius: wp('3%'),
        padding: wp('4%'),
        alignItems: 'center',
        marginTop: hp('1.5%'),
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: hp('2%'),
        fontSize: wp('4%'),
        color: '#666',
    },
    '@media (min-width: 768px)': {
        card: {
            width: wp('80%'),
            maxWidth: 600,
        },
        headerTitle: {
            fontSize: wp('5%'),
        },
        headerSubtitle: {
            fontSize: wp('3%'),
        },
        amountInput: {
            fontSize: wp('8%'),
        },
        currencySymbol: {
            fontSize: wp('8%'),
        },
    },
    '@media (min-width: 1024px)': {
        card: {
            width: wp('70%'),
            maxWidth: 800,
        },
        amountInput: {
            fontSize: wp('6%'),
        },
        currencySymbol: {
            fontSize: wp('6%'),
        },
    },
});

