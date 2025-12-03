import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router, usePathname } from 'expo-router';

export default function Footer() {
  const pathname = usePathname();

  const handleNavigateToMap = () => {
    router.push('/map');
  }

  const handleNavigateToNames = () => {
    router.back();
  }

  const isNameActive = pathname === '/';
  const isMapActive = pathname === '/map';

  return (
    <View style={styles.container}>
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.leftButton,
            isNameActive && styles.activeButton
          ]}
          onPress={() => handleNavigateToNames()}
        >
          <Text style={[styles.buttonText, isNameActive && styles.activeButtonText]}>Name</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            styles.rightButton,
            isMapActive && styles.activeButton
          ]}
          onPress={() => handleNavigateToMap()}
        >
          <Text style={[styles.buttonText, isMapActive && styles.activeButtonText]}>Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#d1d1d1',
    borderRadius: 8,
    overflow: 'hidden',
    padding: 2,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: 'transparent',
    borderRadius: 6
  },
  leftButton: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  rightButton: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  activeButton: {
    backgroundColor: '#2f7df6',
  },
  buttonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  activeButtonText: {
    color: '#fff',
  }
})