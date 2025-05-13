import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import Slider from "@react-native-community/slider";
import { LineChart } from "react-native-chart-kit";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Feather } from '@expo/vector-icons';

const { height, width } = Dimensions.get("window");
const isIphoneX = () => {
  const dimen = Dimensions.get("window");
  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimen.height === 780 || dimen.width === 780) ||
      (dimen.height === 812 || dimen.width === 812) ||
      (dimen.height === 844 || dimen.width === 844) ||
      (dimen.height === 896 || dimen.width === 896) ||
      (dimen.height === 926 || dimen.width === 926))
  );
};

const FireScreen = () => {
  // State management
  const [age, setAge] = useState(28);
  const [income, setIncome] = useState(700000);
  const [expense, setExpense] = useState(400000);
  const [savingsRate, setSavingsRate] = useState(30);
  const [investmentReturn, setInvestmentReturn] = useState(7);
  const [withdrawalRate, setWithdrawalRate] = useState(4);
  const [fireTarget, setFireTarget] = useState(0);
  const [progress, setProgress] = useState(0);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Calculate FIRE target
    const annualSavings = (income * savingsRate) / 100;
    const fireGoal = (expense * 100) / withdrawalRate;
    const yearsToFire = fireGoal / annualSavings;

    setFireTarget(yearsToFire + age);
    setProgress((annualSavings / fireGoal) * 100);
  }, [income, expense, savingsRate, withdrawalRate]);

  // Sample Data for Projections
  const chartData = Array.from({ length: 20 }, (_, i) => ({
    year: age + i,
    netWorth: ((income * savingsRate) / 100) * i * Math.pow(1 + investmentReturn / 100, i),
  }));

  const HeaderTitle = () => (
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTextNut}>FIRE</Text>
      <Animated.View>
        <Text style={styles.headerTextShell}>PLANNER</Text>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <HeaderTitle />
          <View style={styles.iconContainer}>
            <Feather name="trending-up" size={wp('8%')} color="#6EE7B7" />
          </View>
        </Animated.View>

        {/* Rest of the component remains the same */}
        {/* Inputs */}
        <Animated.View
          style={[
            styles.gradientCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.label}>Current Age</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(age)}
            onChangeText={(val) => setAge(Number(val))}
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Annual Income</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(income)}
            onChangeText={(val) => setIncome(Number(val))}
            placeholderTextColor="#94A3B8"
          />

          <Text style={styles.label}>Annual Expenses</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(expense)}
            onChangeText={(val) => setExpense(Number(val))}
            placeholderTextColor="#94A3B8"
          />
        </Animated.View>

        {/* Sliders */}
        <Animated.View
          style={[
            styles.gradientCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.label}>Savings Rate: {savingsRate}%</Text>
          <Slider
            value={savingsRate}
            onValueChange={setSavingsRate}
            minimumValue={10}
            maximumValue={80}
            step={1}
            style={styles.slider}
            minimumTrackTintColor="#6EE7B7"
            maximumTrackTintColor="#334155"
            thumbTintColor="#6EE7B7"
          />

          <Text style={styles.label}>Investment Return Rate: {investmentReturn}%</Text>
          <Slider
            value={investmentReturn}
            onValueChange={setInvestmentReturn}
            minimumValue={3}
            maximumValue={15}
            step={1}
            style={styles.slider}
            minimumTrackTintColor="#6EE7B7"
            maximumTrackTintColor="#334155"
            thumbTintColor="#6EE7B7"
          />
        </Animated.View>

        {/* Results */}
        <Animated.View
          style={[
            styles.resultCard,
            { 
              opacity: fadeAnim, 
              transform: [
                { translateY: slideAnim },
                { scale: pulseAnim }
              ] 
            },
          ]}
        >
          <Text style={styles.resultText}>Target FIRE Age</Text>
          <Text style={styles.resultNumber}>{Math.round(fireTarget)}</Text>
          <Text style={styles.resultSubtext}>years old</Text>
        </Animated.View>

        {/* Chart */}
        <Animated.View
          style={[
            styles.chartCard,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.chartTitle}>Net Worth Projection</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={{
                labels: chartData.map((d) => d.year),
                datasets: [{ data: chartData.map((d) => d.netWorth) }],
              }}
              width={width * 1.2}
              height={220}
              yAxisLabel="₹"
              chartConfig={{
                backgroundColor: "#1E293B",
                backgroundGradientFrom: "#1E293B",
                backgroundGradientTo: "#334155",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(110, 231, 183, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(248, 250, 252, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#6EE7B7",
                },
              }}
              bezier
              style={styles.chart}
            />
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: isIphoneX() ? 34 : 0,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: wp('4%'),
    paddingBottom: hp('10%'),
  },
  header: {
    marginTop: hp('4%'),
    marginBottom: hp('3%'),
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: wp('2%'),
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
  iconContainer: {
    marginTop: hp('2%'),
    padding: wp('4%'),
    backgroundColor: 'rgba(110, 231, 183, 0.1)',
    borderRadius: wp('8%'),
  },
  gradientCard: {
    padding: wp('6%'),
    marginBottom: hp('2%'),
    backgroundColor: '#1E293B',
    borderRadius: wp('6%'),
    shadowColor: '#6EE7B7',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: {
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
  slider: {
    marginBottom: hp('3%'),
  },
  resultCard: {
    padding: wp('6%'),
    marginVertical: hp('2%'),
    backgroundColor: '#1E293B',
    borderRadius: wp('6%'),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(110, 231, 183, 0.3)',
  },
  resultText: {
    color: "#94A3B8",
    fontSize: wp('4.5%'),
    fontWeight: '500',
  },
  resultNumber: {
    color: "#6EE7B7",
    fontSize: wp('12%'),
    fontWeight: '800',
    marginVertical: hp('1%'),
  },
  resultSubtext: {
    color: "#94A3B8",
    fontSize: wp('4%'),
  },
  chartCard: {
    padding: wp('4%'),
    backgroundColor: '#1E293B',
    borderRadius: wp('6%'),
    marginTop: hp('2%'),
  },
  chartTitle: {
    color: "#94A3B8",
    fontSize: wp('4.5%'),
    fontWeight: '500',
    marginBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
  },
  chart: {
    marginVertical: hp('1%'),
    borderRadius: wp('4%'),
  },
});

export default FireScreen;