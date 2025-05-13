import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Dimensions
} from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const NotificationItem = ({ title, message, time, type = "info" }) => (
    <TouchableOpacity style={styles.notificationItem}>
        <View style={styles.iconContainer}>
            <Ionicons 
                name={type === "info" ? "information-circle" : "notifications"} 
                size={wp('6%')} 
                color="#6EE7B7" 
            />
        </View>
        <View style={styles.contentContainer}>
            <Text style={styles.notificationTitle}>{title}</Text>
            <Text style={styles.notificationMessage}>{message}</Text>
            <Text style={styles.timeText}>{time}</Text>
        </View>
    </TouchableOpacity>
);

export default function NotificationsScreen() {
    const notifications = [
       
        {
            id: 1,
            title: "New Feature",
            message: "Try our new AI financial advisor",
            time: "5h ago",
            type: "info"
        },
        
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Notifications</Text>
                <Text style={styles.subtitle}>Stay updated with your finances</Text>
            </View>

            <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <NotificationItem 
                            key={notification.id}
                            {...notification}
                        />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons 
                            name="notifications-off-outline" 
                            size={wp('15%')} 
                            color="#94A3B8" 
                        />
                        <Text style={styles.emptyText}>No notifications yet</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F172A',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    header: {
        padding: wp('5%'),
        paddingTop: Platform.OS === 'ios' ? hp('2%') : hp('4%'),
    },
    headerTitle: {
        fontSize: wp('8%'),
        fontWeight: 'bold',
        color: '#F8FAFC',
        marginBottom: hp('1%'),
    },
    subtitle: {
        fontSize: wp('4%'),
        color: '#94A3B8',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: wp('4%'),
        paddingBottom: hp('4%'),
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#1E293B',
        borderRadius: wp('4%'),
        padding: wp('4%'),
        marginBottom: hp('2%'),
        shadowColor: '#6EE7B7',
        shadowOffset: {
            width: 0,
            height: hp('0.5%'),
        },
        shadowOpacity: 0.1,
        shadowRadius: wp('2%'),
        elevation: 3,
    },
    iconContainer: {
        width: wp('12%'),
        height: wp('12%'),
        borderRadius: wp('6%'),
        backgroundColor: 'rgba(110, 231, 183, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: wp('4%'),
    },
    contentContainer: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: wp('4.5%'),
        fontWeight: '600',
        color: '#F8FAFC',
        marginBottom: hp('0.5%'),
    },
    notificationMessage: {
        fontSize: wp('4%'),
        color: '#94A3B8',
        marginBottom: hp('1%'),
    },
    timeText: {
        fontSize: wp('3.5%'),
        color: '#64748B',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('20%'),
    },
    emptyText: {
        fontSize: wp('4.5%'),
        color: '#94A3B8',
        marginTop: hp('2%'),
    },
    '@media (min-width: 768px)': {
        container: {
            maxWidth: wp('80%'),
            alignSelf: 'center',
        },
        headerTitle: {
            fontSize: wp('6%'),
        },
        notificationItem: {
            maxWidth: wp('70%'),
            alignSelf: 'center',
        },
    }
});

