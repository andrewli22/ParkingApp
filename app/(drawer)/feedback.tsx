import React from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function FeedbackScreen() {
  
  return (
    <View style={styles.container}>
      <View style={{ flexDirection:'row', justifyContent: 'center' }}>
        <Text style={{ fontSize: 20, textAlign: 'center' }}>Please provide your feedback below.</Text>
      </View>
      <TextInput
        placeholder="Name"
        style={styles.textInputStyles}
      />
      <TextInput
        placeholder="Email address"
        style={styles.textInputStyles}
        />
      <TextInput
        multiline
        placeholder="Enter feedback"
        style={[styles.textInputStyles, { height: 200 }]}
      />
      <TouchableOpacity style={styles.submitButtonContainer}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    marginHorizontal: 40,
    marginTop: 20,
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