import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Footer() {

  const handleNavigateToMap = () => {
    router.push('/map');
  }

  const handleNavigateToNames = () => {
    router.push('/');
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigateToNames()}>
        <Text style={styles.buttonText}>Name</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => handleNavigateToMap()}>
        <Text style={styles.buttonText}>Map</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
    backgroundColor: '#6a5f5fff',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#6189efff',
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  }
})
