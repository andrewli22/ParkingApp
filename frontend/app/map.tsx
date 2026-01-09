import React, { useEffect, useMemo, useRef, useState } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from './components/Footer';
import * as Location from 'expo-location';
import { locations } from '../locations';
import { useTheme } from './contexts/ThemeContext';
import { useThemeStyles } from '@/utils/themeStyles';
import { mapDarkStyle } from '@/utils/mapStyles';
import { fetchCarparkOccupancy } from '@/utils/api';
import { showLocation } from 'react-native-map-link';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

interface Carpark {
  facilityId: string,
  latitude: number,
  longitude: number,
  suburb: string
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [occupancy, setOccupancy] = useState<Record<string, {'available': number, 'total': number, 'spots': number}>>({});
  const [selectCarpark, setSelectCarpark] = useState<Carpark>();

  const { theme } = useTheme();
  const themeStyle = useThemeStyles();
  
  const snapPoints = useMemo(() => ['30%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);

        if (mapRef.current) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }, 0);
        }
      } catch (error) {
        setErrorMsg('Error getting location');
        console.error('Location error:', error);
      }
    };
    fetchLocation();
  }, []);

  useEffect(() => {
    const fetchOccupancy = async () => {
      try {
        const res = await fetchCarparkOccupancy();
        setOccupancy(res);
      } catch (error) {
        console.log(error);
      }
    }
    fetchOccupancy();
  }, []);

  const handleMarkerPress = (carpark: Carpark) => {
    setSelectCarpark(carpark);
    bottomSheetRef.current?.expand();
  };

  const getMarkerColour = (total: number, spots: number) => {
    const occupiedPercent = Math.round((total / spots) * 100);
    const vacantPercent = 100 - occupiedPercent;
    if (vacantPercent >= 75) {
      return '#3ab600ff';
    } else if (10 < vacantPercent && vacantPercent < 75) {
      return '#ffa600ff';
    } else {
      return '#ff0000ff';
    }
  };

  const handleGetDirections = (latitude: number, longitude: number, name: string) => {
    showLocation({
      latitude: latitude,
      longitude: longitude,
      title: name,
      googleForceLatLon: true,
      alwaysIncludeGoogle: true
    })
  }

  return (
    <SafeAreaView style={[styles.container, themeStyle.background]}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
        {errorMsg ? (
          <View style={styles.errorContainer}>
            <Text>{errorMsg}</Text>
          </View>
        ) : (
          <MapView
            key={theme}
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: -33.8688,
              longitude: 151.2093,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
            provider={PROVIDER_GOOGLE}
            showsMyLocationButton
            customMapStyle={theme === 'dark' ? mapDarkStyle : undefined}
          >
            {
              locations.map((marker) => {
                const data = occupancy[marker.facilityId];
                const available = data?.available;
                const total = data?.total || 0;
                const spots = data?.spots || 1;
                const color = data ? getMarkerColour(total, spots) : '#999';

                return (
                  <Marker
                    key={marker.facilityId}
                    coordinate={marker}
                    onPress={() => handleMarkerPress(marker)}
                  >
                    <View style={styles.markerContainer}>
                      <View style={[styles.markerBubble, { backgroundColor: color }]}>
                        <Text style={styles.markerText}>
                          {available !== undefined ? available : '...'}
                        </Text>
                      </View>
                      <View style={styles.arrowContainer}>
                        <View style={styles.markerArrowBorder} />
                        <View style={[styles.markerArrow, { borderTopColor: color }]} />
                      </View>
                    </View>
                  </Marker>
                );
              })
            }
          </MapView>
        )}
      <Footer />
      <BottomSheet
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: theme === 'dark' ? 'white' : 'black' }}
        backgroundStyle={themeStyle.background}
      >
        <BottomSheetView style={styles.bottomSheetcontentContainer}>
          <View style={{ alignItems: 'center' }}>
            <Text style={[themeStyle.textColor, { fontSize: 18, fontWeight: 'bold' }]}>
              {selectCarpark?.suburb || 'Carpark Details'}
            </Text>
            {selectCarpark && occupancy[selectCarpark.facilityId] && (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 25, color: getMarkerColour(occupancy[selectCarpark.facilityId].total, occupancy[selectCarpark.facilityId].spots), marginTop: 8, marginBottom: 15 }}>
                  {occupancy[selectCarpark.facilityId].available} Vacant Spots
                </Text>
                <Text style={[themeStyle.textColor, { fontSize: 16 }]}>
                  Total: {occupancy[selectCarpark.facilityId].spots}
                </Text>
              </View>
            )}
          </View>
          <View style={{ width: '100%', marginBottom: 40 }}>
            <TouchableOpacity
              style={styles.submitButtonContainer}
              onPress={() => selectCarpark && handleGetDirections(selectCarpark.latitude, selectCarpark.longitude, selectCarpark.suburb)}
            >
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetView>
      </BottomSheet>
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
  markerContainer: {
    alignItems: 'center',
  },
  markerBubble: {
    padding: 3,
    paddingHorizontal: 3,
    borderRadius: '30%',
    borderBottomColor: 'transparent'
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12
  },
  arrowContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  markerArrowBorder: {
    position: 'absolute',
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    transform: [{ translateY: -0.1 }],
    zIndex: 1,
  },
  markerArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ translateY: -2 }],
    zIndex: 2,
  },
  bottomSheetcontentContainer: {
    padding: 10,
    height: '100%',
    flex: 1,
    justifyContent: 'space-between'
  },
  submitButtonContainer: {
    backgroundColor: '#34ceff',
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 15
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 16
  }
});
