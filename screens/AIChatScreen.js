import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { getFinancialAdvice } from "../services/api";
import Markdown from "react-native-markdown-display";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const {height, width} = Dimensions.get('window');
const isIphoneX = () => {
  const dimen = Dimensions.get('window');
  return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 780 || dimen.width === 780)
      || (dimen.height === 812 || dimen.width === 812)
      || (dimen.height === 844 || dimen.width === 844)
      || (dimen.height === 896 || dimen.width === 896)
      || (dimen.height === 926 || dimen.width === 926))
  );
};
const MessageType = {
  QUESTION: "question",
  RESPONSE: "response",
};

const createMessage = (content, type) => ({
  id: Date.now(),
  content,
  type,
  timestamp: new Date(),
});

const SuggestedQuestion = ({ text, onPress }) => (
  <TouchableOpacity style={styles.suggestionButton} onPress={onPress}>
    <Text style={styles.suggestionIcon}>✨</Text>
    <Text style={styles.suggestionText}>{text}</Text>
  </TouchableOpacity>
);

export default function AIChatScreen() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [messageStatus, setMessageStatus] = useState("");
  const [messages, setMessages] = useState([]);

  const formatDate = (date) => {
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAskAI = async (question) => {
    const queryText = question || input;
    if (!queryText) return;

    try {
      setLoading(true);
      setCurrentQuestion(queryText);
      setMessageStatus("sent");

      // Add user question to messages
      const questionMessage = createMessage(queryText, MessageType.QUESTION);
      setMessages((prevMessages) => [...prevMessages, questionMessage]);

      const advice = await getFinancialAdvice(queryText);

      if (advice) {
        // Add AI response to messages
        const responseMessage = createMessage(advice, MessageType.RESPONSE);
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
        setLastUpdated(new Date());
        console.log("Messages updated:", [
          ...messages,
          questionMessage,
          responseMessage,
        ]); // Debug log
      } else {
        setMessageStatus("error");
      }
    } catch (error) {
      setMessageStatus("error");
      console.error("Error getting response:", error);
    } finally {
      setLoading(false);
      setInput("");
      setTimeout(() => setMessageStatus(""), 3000);
    }
  };

  const suggestedQuestions = [
    "How can I save money?",
    "What's a good budget for a student?",
    "Plan my Finance",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.title}>Hello, Ask Me{"\n"}Financial Advice...</Text>
        <Text style={styles.subtitle}>
          Last updated : {formatDate(lastUpdated)}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {!messages.length && !loading && (
          <View style={styles.suggestionsContainer}>
            {suggestedQuestions.map((question, index) => (
              <SuggestedQuestion
                key={index}
                text={question}
                onPress={() => handleAskAI(question)}
              />
            ))}
          </View>
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.type === MessageType.QUESTION
                ? styles.questionContainer
                : styles.responseContainer,
            ]}
          >
            {message.type === MessageType.QUESTION ? (
              <Text style={styles.questionText}>{message.content}</Text>
            ) : (
              <View style={styles.responseWrapper}>
                <ScrollView
                  style={styles.responseScroll}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                >
                  <Markdown style={markdownStyles}>{message.content}</Markdown>
                </ScrollView>
              </View>
            )}
          </View>
        ))}

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.loadingText}>Getting your answer...</Text>
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Image
            source={{
              uri: "https://img.icons8.com/material-outlined/24/microphone.png",
            }}
            style={{ width: 24, height: 24 ,tintColor: "#94A3B8"}}
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask me financial advice..."
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleAskAI()}
        >
          <Image
            source={{ uri: "https://img.icons8.com/ios-filled/50/sent.png" }}
            style={{ width: 24, height: 24,tintColor: "#6EE7B7" }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const markdownStyles = {
  body: {
      color: '#F8FAFC',
      fontSize: wp('4%'),
      flex: 1,
  },
  heading1: {
      fontSize: wp('6%'),
      color: '#6EE7B7',
      fontWeight: 'bold',
      marginVertical: hp('1.5%'),
  },
  heading2: {
      fontSize: wp('5%'),
      color: '#6EE7B7',
      fontWeight: 'bold',
      marginVertical: hp('1%'),
  },
  paragraph: {
      fontSize: wp('4%'),
      lineHeight: hp('3%'),
      marginVertical: hp('1%'),
      flexWrap: 'wrap',
  },
  list: {
      marginVertical: hp('1%'),
  },
  listItem: {
      marginVertical: hp('0.5%'),
  },
  listUnorderedItemIcon: {
      fontSize: wp('4%'),
      color: '#6EE7B7',
  },
  code_inline: {
      backgroundColor: '#1E293B',
      padding: wp('1%'),
      borderRadius: wp('1%'),
      fontFamily: 'monospace',
  },
  code_block: {
      backgroundColor: '#1E293B',
      padding: wp('2.5%'),
      borderRadius: wp('2%'),
      fontFamily: 'monospace',
      marginVertical: hp('1%'),
  },
  blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#6EE7B7',
      paddingLeft: wp('2.5%'),
      marginLeft: wp('2.5%'),
      marginVertical: hp('1%'),
  },
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#0F172A',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      paddingBottom: isIphoneX() ? 34 : 0,
  },
  scrollContainer: {
      flex: 1,
      width: '100%',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: hp('20%'), 
    paddingHorizontal: wp('4%'),
},
  header: {
      marginTop: hp('2%'),
      marginBottom: hp('4%'),
      paddingHorizontal: wp('4%'),
  },
  title: {
      fontSize: wp('7%'),
      fontWeight: 'bold',
      marginBottom: hp('1%'),
      color: '#F8FAFC',
  },
  subtitle: {
      color: '#94A3B8',
      fontSize: wp('3%'),
  },
  suggestionsContainer: {
      gap: hp('1.5%'),
      marginBottom: hp('3%'),
  },
  suggestionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1E293B',
      padding: wp('4%'),
      borderRadius: wp('5%'),
      shadowColor: '#000',
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  suggestionIcon: {
      marginRight: wp('2%'),
      fontSize: wp('4%'),
      color: "#6EE7B7",
  },
  suggestionText: {
      fontSize: wp('4%'),
      color: '#F8FAFC',
  },
  messageContainer: {
      marginVertical: hp('1%'),
      marginHorizontal: wp('2%'),
      maxWidth: wp('85%'), // Increased max width
    minWidth: wp('50%'), // Added minimum width
  },
  questionContainer: {
      backgroundColor: '#1E293B',
      padding: wp('4%'),
      borderRadius: wp('4%'),
      alignSelf: 'flex-end',
  },
  responseContainer: {
    backgroundColor: '#1E293B',
    padding: wp('4%'),
    borderRadius: wp('4%'),
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow content to wrap
    flex: 1, // Take available space
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionText: {
      fontSize: wp('4%'),
      color: '#6EE7B7',
      fontWeight: '500',
  },
  responseScroll: {
      maxHeight: hp('40%'),
      marginVertical: hp('1%'),
  },
  inputContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? hp('10%') : hp('12%'), 
    left: wp('4%'),
    right: wp('4%'),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    padding: wp('3%'),
    borderRadius: wp('6%'),
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
},
  input: {
      flex: 1,
      fontSize: wp('4%'),
      marginHorizontal: wp('2%'),
      color: '#F8FAFC',
  },
  iconButton: {
      padding: wp('2%'),
  },
  sendButton: {
      padding: wp('2%'),

  },
  loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: hp('12%'),
  },
  loadingText: {
      marginTop: hp('1%'),
      fontSize: wp('4%'),
      color: '#666',
  },
  bottomPadding: {
    height: hp('15%'), 
},
'@media (min-width: 768px)': {
      container: {
          maxWidth: wp('80%'),
          alignSelf: 'center',
      },
      title: {
          fontSize: wp('5%'),
      },
      messageContainer: {
          maxWidth: wp('60%'),
      },
      inputContainer: {
        maxWidth: wp('80%'),
        alignSelf: 'center',
        bottom: hp('12%'), // Adjusted for tablets
    },
  },
  '@media (min-width: 1024px)': {
      container: {
          maxWidth: wp('70%'),
      },
      messageContainer: {
          maxWidth: wp('50%'),
      },
      inputContainer: {
        maxWidth: wp('70%'),
        bottom: hp('12%'), // Adjusted for desktop
    },
  },
});

