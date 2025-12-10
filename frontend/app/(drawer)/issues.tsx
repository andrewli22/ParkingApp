import { useThemeStyles } from '@/utils/themeStyles';
import React, { useContext, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';
import FeedbackScreen from './feedback';
import { sendFeedback } from '@/utils/api';

export default function IssuesScreen() {
  const data = [
    'The error that you saw',
    'Which screen you saw the error',
    'What you did that led to the error'
  ]
  const themeStyle = useThemeStyles();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [name, setName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [issue, setIssue] = useState<string>('');

  const handleSendIssue = async () => {
    try {
      await sendFeedback(name, `BUG: ${subject}`, issue);
      Alert.alert(
        'Success',
        'Issue successfully. A team member will review it soon!',
        [{ text: 'OK', onPress: () => {
          setName('');
          setSubject('');
          setIssue('');
        }}]
      );
    } catch (error) {
      console.error('API error sending feedback - frontend', error);
    }
  }

  return (
    <View style={[themeStyle.background, { flex: 1 }]}>
      {/* Information on reporting issue */}
      <View style={{ margin: 20 }}>
        <Text style={[themeStyle.textColor, { fontSize: 15, marginBottom: 10 }]}>Please include as much detail as possible to help diagnose and resolve the issue. Such as:</Text>
        <View>
          <FlatList
            data={data}
            renderItem={({ item }) => {
              return (
                <View style={{ marginBottom: 5 }}>
                  <Text style={[themeStyle.textColor, { fontSize: 15 }]}>{`\u2022 ${item}`}</Text>
                </View>
              )
            }}
          />
        </View>
      </View>
      {/* User Inputs */}
      <View style={{ marginHorizontal: 20 }}>
        <TextInput
          placeholderTextColor={themeStyle.textColor.color}
          placeholder="Name"
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor, { marginBottom: 10 }]}
          onChangeText={setName}
          value={name}
          />
        <TextInput
          placeholderTextColor={themeStyle.textColor.color}
          placeholder="Subject"
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor, { marginBottom: 10 }]}
          onChangeText={setSubject}
          value={subject}
          />
        {/* FIX ISSUE
          Issue: Text Colour not updating based on theme
          Curr Soln: Use key which re-renders on change, text is not preserved, users will have to type text again but colour updates correctly
          */}
        <TextInput
          key={theme}
          placeholderTextColor={themeStyle.textColor.color}
          multiline
          placeholder="Describe the issue"
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor, { height: 200, marginBottom: 10 }]}
          onChangeText={setIssue}
          value={issue}
        />
        <TouchableOpacity style={styles.submitButtonContainer} onPress={() => handleSendIssue()}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
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