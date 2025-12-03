import React, { useEffect, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Footer from './components/Footer';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { locations } from '../locations';

interface Carpark {
  facilityId: string,
  latitude: number,
  longitude: number,
  suburb: string
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const handleMarkerPress = (carpark: Carpark) => {
    router.push(`/carpark/${carpark.facilityId}?facilityName=${encodeURIComponent(carpark.suburb)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text>{errorMsg}</Text>
          </View>
        ) : (
          <MapView
            style={styles.map}
            initialRegion={location ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            } : {
              latitude: -33.8688,
              longitude: 151.2093,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton
          >
            {
              locations.map((marker, index) => (
                <Marker key={index} coordinate={marker} onPress={() => handleMarkerPress(marker)} />
              ))
            }
          </MapView>
        )}
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  map: {
    flex: 1,
    marginBottom: 10
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
