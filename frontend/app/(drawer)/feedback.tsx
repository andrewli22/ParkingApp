import { useThemeStyles } from '@/utils/themeStyles';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import { sendFeedback } from '@/utils/api';

export default function FeedbackScreen() {
  const themeStyle = useThemeStyles();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // User inputs
  const [subject, setSubject] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSendFeedback = async () => {
    setErrorMessage('');
    try {
      await sendFeedback(`FEEDBACK: ${subject}`, feedback);
      Alert.alert(
        'Success',
        'Thank you for your feedback. A team member will review it soon!',
        [{ text: 'OK', onPress: () => {
          setSubject('');
          setFeedback('');
        }}]
      );
    } catch (error) {
      console.error('API error sending feedback - frontend', error);
      setErrorMessage('Failed to send feedback. Please try again.');
    }
  }

  return (
    <View style={[styles.container, themeStyle.background, { flex: 1 }]}>
      <View style={{ flexDirection:'row', justifyContent: 'center', marginHorizontal: 20, marginTop: 10}}>
        <Text style={[themeStyle.textColor, { fontSize: 15, textAlign: 'center', marginBottom: 15 }]}>Please provide your feedback below</Text>
      </View>
      <View style={{ marginHorizontal: 20 }}>
        <TextInput
          placeholder='Enter Subject'
          placeholderTextColor={themeStyle.textColor.color}
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor, { marginBottom: 10 }]}
          onChangeText={setSubject}
          value={subject}
          />
        <TextInput
          key={theme}
          multiline
          placeholder='Enter feedback'
          placeholderTextColor={themeStyle.textColor.color}
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor, { height: 200, marginBottom: 10 }]}
          onChangeText={setFeedback}
          value={feedback}
        />
      </View>
      <TouchableOpacity style={[styles.submitButtonContainer, { marginHorizontal: 20 }]} onPress={() => handleSendFeedback()}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      {/* Error message */}
      {errorMessage && (
        <Text style={[{ color: 'red', textAlign: 'center', marginTop: 10 }]}>
          {errorMessage}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  textInputStyles: {
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
  submitButtonContainer: {
    backgroundColor: '#34ceff',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16
  }
})