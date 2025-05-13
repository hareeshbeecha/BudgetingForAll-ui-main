import React, { useEffect, useState, useCallback, useRef } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    Animated,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
    Platform,
    TouchableOpacity
} from "react-native";
import { LineChart, PieChart, BarChart } from "react-native-chart-kit";
import { fetchExpenses } from "../services/api";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768;

const TIME_FILTERS = {
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year'
};

export default function ExpensesScreen() {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [categoryData, setCategoryData] = useState([]);
    const [monthlyData, setMonthlyData] = useState({
        expenses: [],
        labels: []
    });
    const [activeFilter, setActiveFilter] = useState(TIME_FILTERS.MONTH);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(hp('10%'))).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        loadExpenses();
        startAnimations();
    }, []);

    const startAnimations = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 45,
                useNativeDriver: true,
            })
        ]).start();
    };

    const processExpenseData = (data) => {
        const filteredData = filterExpensesByTime(data, activeFilter);
        // Calculate total expenses
        const total = filteredData.reduce((acc, curr) => 
            curr.amount < 0 ? acc + Math.abs(curr.amount) : acc, 0
        );
        setTotalExpenses(total);

        // Process category data
        const categories = filteredData.reduce((acc, curr) => {
            if (curr.amount < 0) {
                const category = curr.category;
                acc[category] = (acc[category] || 0) + Math.abs(curr.amount);
            }
            return acc;
        }, {});

        const timeBasedExpenses = filteredData.reduce((acc, curr) => {
            if (curr.amount < 0) {
                const date = new Date(curr.date._seconds * 1000);
                let timeKey;
                
                switch (activeFilter) {
                    case TIME_FILTERS.DAY:
                        timeKey = date.getHours().toString().padStart(2, '0') + ':00';
                        break;
                    case TIME_FILTERS.WEEK:
                        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                        timeKey = days[date.getDay()];
                        break;
                    case TIME_FILTERS.MONTH:
                        timeKey = date.getDate().toString();
                        break;
                    case TIME_FILTERS.YEAR:
                        timeKey = date.toLocaleString('default', { month: 'short' });
                        break;
                    default:
                        timeKey = date.toLocaleString('default', { month: 'short' });
                }
                acc[timeKey] = (acc[timeKey] || 0) + Math.abs(curr.amount);
            }
            return acc;
        }, {});

        // Create pie chart data
        const pieData = Object.entries(categories).map(([name, value], index) => ({
            name,
            value,
            color: getChartColors()[index],
            legendFontColor: "#FFFFFF",
            legendFontSize: wp('3%')
        }));
        setCategoryData(pieData);

        // Process monthly data
        const monthlyExpenses = filteredData.reduce((acc, curr) => {
            if (curr.amount < 0) {
                const date = new Date(curr.date._seconds * 1000);
                const month = date.toLocaleString('default', { month: 'short' });
                acc[month] = (acc[month] || 0) + Math.abs(curr.amount);
            }
            return acc;
        }, {});

        let sortedLabels = Object.keys(timeBasedExpenses);
    if (activeFilter === TIME_FILTERS.WEEK) {
        const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        sortedLabels.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
    }

        setMonthlyData({
            expenses: sortedLabels.map(label => timeBasedExpenses[label]),
            labels: sortedLabels
        });
    };

    const filterExpensesByTime = (data, filter) => {
        const now = new Date();
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
    
        return data.filter(expense => {
            const expenseDate = new Date(expense.date._seconds * 1000);
            
            switch (filter) {
                case TIME_FILTERS.DAY:
                    const expenseStart = new Date(expenseDate);
                    expenseStart.setHours(0, 0, 0, 0);
                    return expenseStart.getTime() === todayStart.getTime();
    
                case TIME_FILTERS.WEEK:
                    const startOfWeek = new Date(now);
                    startOfWeek.setDate(now.getDate() - now.getDay());  // Move to last Sunday
                    startOfWeek.setHours(0, 0, 0, 0);
    
                    const endOfWeek = new Date(startOfWeek);
                    endOfWeek.setDate(startOfWeek.getDate() + 6);  // Move to Saturday
                    endOfWeek.setHours(23, 59, 59, 999);
    
                    return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
    
                case TIME_FILTERS.MONTH:
                    return (
                        expenseDate.getMonth() === now.getMonth() &&
                        expenseDate.getFullYear() === now.getFullYear()
                    );
    
                case TIME_FILTERS.YEAR:
                    return expenseDate.getFullYear() === now.getFullYear();
    
                default:
                    return true;
            }
        });
    };
    

    useEffect(() => {
        if (expenses.length > 0) {
            processExpenseData(expenses);
        }
    }, [activeFilter,expenses]);
    
    // Add this component for the filter buttons
    const TimeFilterButtons = () => (
        <View style={styles.filterContainer}>
            {Object.values(TIME_FILTERS).map((filter) => (
                <TouchableOpacity
                    key={filter}
                    style={[
                        styles.filterButton,
                        activeFilter === filter && styles.filterButtonActive
                    ]}
                    onPress={() => setActiveFilter(filter)}
                >
                    <Text style={[
                        styles.filterButtonText,
                        activeFilter === filter && styles.filterButtonTextActive
                    ]}>
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const getChartColors = () => [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', 
        '#D4A5A5', '#4ADE80', '#F7D794', '#778BEB', '#786FA6'
    ];

    const loadExpenses = async () => {
        try {
            const data = await fetchExpenses();
            setExpenses(data);
            processExpenseData(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const commonChartConfig = {
        backgroundColor: "#1E2032",
        backgroundGradientFrom: "#1E2032",
        backgroundGradientTo: "#1E2032",
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        useShadowColorFromDataset: false,
        propsForLabels: {
            fontSize: wp('3%'),
            fontWeight: '600',
        },
        propsForDots: {
            r: wp('1%'),
            strokeWidth: wp('0.5%'),
            stroke: "#4ADE80"
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4ADE80" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header */}
                <Animated.View style={[
                    styles.header,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }]
                    }
                ]}>

                    <Text style={styles.headerTitle}>Expense Analytics</Text>
                    <Text style={styles.headerSubtitle}>
                        Total Expenses: ₹{totalExpenses.toLocaleString()}
                    </Text>
                    <TimeFilterButtons />
                </Animated.View>

                

                {/* Charts Grid */}
                <View style={styles.chartsGrid}>
                    {/* Pie Chart */}
                    <Animated.View style={[
                        styles.card,
                        styles.chartCard,
                        {
                            opacity: fadeAnim,
                            transform: [
                                { scale: scaleAnim },
                                { translateY: slideAnim }
                            ]
                        }
                    ]}>
                        <Text style={styles.cardTitle}>Expense Distribution</Text>
                        <PieChart
    data={categoryData}
    width={isTablet ? wp('42%') : wp('85%')}
    height={hp('30%')}
    chartConfig={commonChartConfig}
    accessor="value"
    backgroundColor="transparent"
    paddingLeft={wp('4%')}
    center={[wp('2%'), 0]}
    absolute
    hasLegend={true}
    legendStyle={{
        color: '#FFFFFF',
        fontSize: wp('3%'),
        
    }}
/>
                    </Animated.View>

                    {/* Line Chart */}
                    <Animated.View style={[
                        styles.card,
                        styles.chartCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}>
                        <Text style={styles.cardTitle}>
    {activeFilter === TIME_FILTERS.DAY && "Hourly Trend"}
    {activeFilter === TIME_FILTERS.WEEK && "Daily Trend"}
    {activeFilter === TIME_FILTERS.MONTH && "Monthly Trend"}
    {activeFilter === TIME_FILTERS.YEAR && "Yearly Trend"}
</Text>
                        <LineChart
    data={{
        labels: monthlyData.labels,
        datasets: [{
            data: monthlyData.expenses,
            color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
            strokeWidth: 2
        }]
    }}
    width={isTablet ? wp('42%') : wp('85%')}
    height={hp('30%')}
    chartConfig={commonChartConfig}
    bezier
    style={styles.chart}
    withInnerLines={false}
    withOuterLines={true}
    withDots={true}
    withShadow={false}
    yAxisInterval={1}
/>
                    </Animated.View>

                    {/* Bar Chart */}
                    <Animated.View style={[
                        styles.card,
                        styles.chartCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}>
                        <Text style={styles.cardTitle}>Category Comparison</Text>
                        <BarChart
                            data={{
                                labels: categoryData.map(cat => cat.name),
                                datasets: [{
                                    data: categoryData.map(cat => cat.value)
                                }]
                            }}
                            width={isTablet ? wp('90%') : wp('90%')}
                            height={hp('30%')}
                            chartConfig={{
                                ...commonChartConfig,
                                barPercentage: 0.7,
                            }}
                            style={styles.chart}
                            showValuesOnTopOfBars
                            fromZero
                        />
                    </Animated.View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp('2%'),
        paddingHorizontal: wp('1%'),
        gap: wp('2%'),
    },
    filterButton: {
        paddingVertical: hp('1%'),
        paddingHorizontal: wp('4%'),
        borderRadius: wp('5%'),
        backgroundColor: '#1E2032',
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.1)',
        minWidth: wp('18%'),
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#4ADE80',
        borderColor: '#4ADE80',
    },
    filterButtonText: {
        color: '#8F90A6',
        fontSize: wp('3.5%'),
        fontWeight: '600',
    },
    filterButtonTextActive: {
        color: '#151729',
    },
    container: {
        flex: 1,
        backgroundColor: "#151729",
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: hp('5%'),
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#151729",
    },
    header: {
        padding: wp('5%'),
        paddingTop: Platform.OS === 'ios' ? hp('2%') : hp('4%'),
    },
    headerTitle: {
        color: "#FFFFFF",
        fontSize: wp('8%'),
        fontWeight: "bold",
        lineHeight: hp('5%'),
    },
    headerSubtitle: {
        color: "#8F90A6",
        fontSize: wp('4%'),
        marginTop: hp('1%'),
    },
    chartsGrid: {
        flex: 1,
        alignItems: 'center',
        padding: wp('4%'),
        gap: hp('2%'),
    },
    card: {
        backgroundColor: "#1E2032",
        borderRadius: wp('5%'),
        padding: wp('4%'),
        marginBottom: hp('2%'),
        width: isTablet ? wp('45%') : wp('90%'),
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.1)',
        ...Platform.select({
            ios: {
                shadowColor: "#4ADE80",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    chartCard: {
        minHeight: hp('40%'),
        justifyContent: 'space-between',
    },
    cardTitle: {
        color: "#FFFFFF",
        fontSize: wp('5%'),
        fontWeight: "bold",
        marginBottom: hp('2%'),
    },
    chart: {
        marginVertical: hp('2%'),
        borderRadius: wp('4%'),
        alignSelf: 'center',
    }
});