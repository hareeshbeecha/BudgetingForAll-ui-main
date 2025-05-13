import React, { useEffect, useState, useCallback,useRef } from "react";
import { 
    View, 
    Text, 
    FlatList, 
    StyleSheet, 
    Alert, 
    Image, 
    ActivityIndicator, 
    TouchableOpacity,
    Dimensions,
    Platform,
    SafeAreaView,
    StatusBar,
    Animated
} from "react-native";
import { fetchExpenses } from "../services/api";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width } = Dimensions.get('window');
const scale = width / 375;

const normalize = (size) => Math.round(scale * size);

const getFinancialHealthMessage = (income, expenses, balance) => {
    // Calculate expense to income ratio
    const expenseRatio = expenses / income;
    
    // Calculate savings ratio
    const savingsRatio = balance / income;

    if (income === 0) {
        return {
            message: "Please add your income to see your financial health",
            color: "#8F90A6"
        };
    }

    // High risk conditions
    if (expenseRatio >= 0.9) {
        return {
            message: "Warning: Your expenses are very close to your income!",
            color: "#FF6B6B"
        };
    }

    // Moderate risk conditions
    if (expenseRatio >= 0.7) {
        return {
            message: "Consider reducing your expenses to improve savings",
            color: "#FFB86C"
        };
    }

    // Good financial health
    if (savingsRatio >= 0.3) {
        return {
            message: "Excellent! You're maintaining healthy savings",
            color: "#4ADE80"
        };
    }

    // Default moderate condition
    return {
        message: "Your financial health is stable",
        color: "#8F90A6"
    };
};

const formatDate = (timestamp) => {
    if (timestamp?._seconds) {
        return new Date(timestamp._seconds * 1000).toLocaleString("en-US", {
            month: "long",
            day: "numeric",
        });
    }
    return "Invalid Date";
};

const categoryIcons = {
    Salary: require("../assets/salary.png"),
    Groceries: require("../assets/groceries.png"),
    Rent: require("../assets/rent.png"),
    transport: require("../assets/transport.png"),
    Default: require("../assets/default.png"),
};



export default function CardComponents() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [totalIncome, setTotalIncome] = useState(0);
    const [balance, setBalance] = useState(0);
    const [showAllTransactions, setShowAllTransactions] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(100)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;


    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            })
        ]).start();
    }, []);


    useEffect(() => {
        loadExpenses();
    }, []);

    const getDisplayedTransactions = () => {
        if (showAllTransactions) {
            return expenses;
        }
        return expenses.slice(0, 3);
    };

    const calculateTotals = (data) => {
        const totals = data.reduce((acc, item) => {
            if (item.amount < 0) {
                acc.expenses += Math.abs(item.amount);
            } else {
                acc.income += item.amount;
            }
            return acc;
        }, { expenses: 0, income: 0 });
        
        totals.balance = totals.income - totals.expenses;
        return totals;
    };

    const loadExpenses = async () => {
        try {
            setError(null);
            setLoading(true);
            const data = await fetchExpenses();
            
            if (!Array.isArray(data)) {
                throw new Error("Invalid data format from API");
            }

            const totals = calculateTotals(data);
            setExpenses(data);
            setTotalExpenses(totals.expenses);
            setTotalIncome(totals.income);
            setBalance(totals.balance);
        } catch (error) {
            console.error("Error fetching expenses:", error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        loadExpenses().finally(() => setRefreshing(false));
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.amount < 0 ? '#2A2F4F' : '#1F3B4D' }]}>
                <Image 
                    source={categoryIcons[item.category] || categoryIcons.Default} 
                    style={[styles.icon, { tintColor: item.amount < 0 ? '#FF6B6B' : '#4ADE80' }]} 
                />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.description }</Text>
                <Text style={styles.date}>{formatDate(item.date)}</Text>
            </View>
            <View style={styles.amountContainer}>
            <Text style={[styles.amount, item.amount < 0 ? styles.expense : styles.income]}>
                {item.amount < 0 ? '-' : '+'}₹{Math.abs(item.amount).toLocaleString()}
            </Text>
            <Text style={styles.category}>{item.category}</Text>
        </View>
        </View>
    );

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <TouchableOpacity onPress={loadExpenses} style={styles.retryButton}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const healthStatus = getFinancialHealthMessage(totalIncome, totalExpenses, balance);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#151729" />
            
            
            <Animated.View style={[
                styles.header,
                {
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }
            ]}>
                <Text style={styles.welcomeText}>Welcome Back</Text>
                <Text style={styles.subTitle}>Financial Dashboard</Text>
            </Animated.View>

         
            <Animated.View style={[
                styles.balanceCard,
                {
                    opacity: fadeAnim,
                    transform: [
                        { scale: scaleAnim },
                        { translateY: slideAnim }
                    ]
                }
            ]}>
                <View style={styles.balanceRow}>
                    <View>
                        <Text style={styles.balanceLabel}>Total Balance</Text>
                        <Text style={styles.balanceAmount}>₹{balance.toLocaleString()}</Text>
                    </View>
                    <View>
                        <Text style={styles.balanceLabel}>Total Expenses</Text>
                        <Text style={styles.expenseAmount}>₹{totalExpenses.toLocaleString()}</Text>
                    </View>
                </View>
                <Text style={[styles.healthText, { color: healthStatus.color }]}>
                    {healthStatus.message}
                </Text>
            </Animated.View>

           
            <Animated.View style={[
    styles.transactionsContainer,
    {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
    }
]}>
    <View style={styles.transactionHeader}>
    <Text style={styles.sectionTitle}>
        {showAllTransactions ? 'All Transactions' : 'Recent Transactions'}
    </Text>
    <TouchableOpacity 
        onPress={() => setShowAllTransactions(!showAllTransactions)}
        style={styles.seeAllButton}
    >
        <Text style={styles.seeAllText}>
            {showAllTransactions ? 'Show Less' : 'See All'}
        </Text>
    </TouchableOpacity>
</View>
    
    {loading ? (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4ADE80" />
        </View>
    ) : (
        <FlatList
            data={getDisplayedTransactions()}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <Text style={styles.emptyText}>No transactions found</Text>
            }
        />
    )}
</Animated.View>
        </SafeAreaView>
    
    );
}

const styles = StyleSheet.create({
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp('2%'),
    },
    seeAllButton: {
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('3%'),
        backgroundColor: '#1E2032',
        borderRadius: wp('3%'),
        borderWidth: 1,
        borderColor: '#4ADE80',
    },
    seeAllText: {
        color: '#4ADE80',
        fontSize: wp('3.5%'),
        fontWeight: '500',
    },
    amountContainer: {
        alignItems: 'flex-end',
        minWidth: wp('25%'), // Ensure consistent width
        marginLeft: wp('2%'),
    },
    category: {
        color: '#8F90A6',
        fontSize: wp('3.5%'),
    },
    amount: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
        marginBottom: hp('0.5%'), // Add space between amount and category
    },
    healthText: {
        fontSize: wp('3.5%'),
        fontWeight: '500',
        marginTop: hp('1%'),
    },
    container: {
        flex: 1,
        backgroundColor: '#151729',
    },
    header: {
        padding: wp('5%'),
        paddingTop: hp('2%'),
    },
    welcomeText: {
        color: '#FFFFFF',
        fontSize: wp('8%'),
        fontWeight: 'bold',
    },
    subTitle: {
        color: '#8F90A6',
        fontSize: wp('4%'),
        marginTop: hp('1%'),
    },
    balanceCard: {
        margin: wp('5%'),
        padding: wp('5%'),
        backgroundColor: '#1E2032',
        borderRadius: wp('5%'),
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: hp('2%'),
    },
    balanceLabel: {
        color: '#8F90A6',
        fontSize: wp('3.5%'),
        marginBottom: hp('1%'),
    },
    balanceAmount: {
        color: '#4ADE80',
        fontSize: wp('6%'),
        fontWeight: 'bold',
    },
    expenseAmount: {
        color: '#FF6B6B',
        fontSize: wp('6%'),
        fontWeight: 'bold',
    },
    healthText: {
        color: '#8F90A6',
        fontSize: wp('3.5%'),
    },
    transactionsContainer: {
        flex: 1,
        padding: wp('5%'),
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: wp('6%'),
        fontWeight: 'bold',
        marginBottom: hp('2%'),
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Ensure proper spacing
        backgroundColor: '#1E2032',
        padding: wp('4%'),
        borderRadius: wp('4%'),
        marginBottom: hp('1.5%'),
    },
    iconContainer: {
        padding: wp('3%'),
        borderRadius: wp('3%'),
        marginRight: wp('4%'),
    },
    icon: {
        width: wp('6%'),
        height: wp('6%'),
    },
    transactionDetails: {
        flex: 1,
        marginRight: wp('2%'),
    },
    transactionTitle: {
        fontSize: wp('4%'),
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: hp('0.5%'),
    },
    date: {
        color: '#8F90A6',
        fontSize: wp('3.5%'),
    },
    amount: {
        fontSize: wp('4%'),
        fontWeight: 'bold',
    },
    income: {
        color: '#4ADE80',
    },
    expense: {
        color: '#FF6B6B',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: wp('5%'),
        backgroundColor: '#151729',
    },
    errorText: {
        fontSize: wp('4%'),
        color: '#FF6B6B',
        marginBottom: hp('2%'),
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#4ADE80',
        paddingVertical: hp('1.5%'),
        paddingHorizontal: wp('6%'),
        borderRadius: wp('2%'),
    },
    retryText: {
        color: '#151729',
        fontSize: wp('4%'),
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: wp('4%'),
        color: '#8F90A6',
        marginTop: hp('3%'),
    },
});