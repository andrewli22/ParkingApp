import { useThemeStyles } from '@/utils/themeStyles';
import React, { useContext, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../contexts/ThemeContext';

export default function FeedbackScreen() {
  const themeStyle = useThemeStyles();
  const { theme, toggleTheme } = useContext(ThemeContext);

  // User inputs
  const [name, setName] = useState<String>('');
  const [email, setEmail] = useState<String>('');
  const [feedback, setFeedback] = useState<String>('');

  return (
    <View style={[styles.container, themeStyle.background, { flex: 1 }]}>
      <View style={{ flexDirection:'row', justifyContent: 'center', marginHorizontal: 20, marginTop: 20}}>
        <Text style={[themeStyle.textColor, { fontSize: 15, textAlign: 'center' }]}>Please provide your feedback below</Text>
      </View>
      <View style={{ gap:10, marginHorizontal: 20 }}>
        <TextInput
          placeholder='Name'
          placeholderTextColor={themeStyle.textColor.color}
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor]}
          onChangeText={setName}
        />
        <TextInput
          placeholder='Email address'
          placeholderTextColor={themeStyle.textColor.color}
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor]}
          onChangeText={setEmail}
          />
        <TextInput
          key={theme}
          multiline
          placeholder='Enter feedback'
          placeholderTextColor={themeStyle.textColor.color}
          style={[styles.textInputStyles, themeStyle.borderColor, themeStyle.textColor, { height: 200 }]}
          onChangeText={setFeedback}
        />
      </View>
      <TouchableOpacity style={[styles.submitButtonContainer, { marginHorizontal: 20 }]}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
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