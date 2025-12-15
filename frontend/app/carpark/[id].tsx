import { useThemeStyles } from '@/utils/themeStyles';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../contexts/ThemeContext';
import { fetchCarparkById } from '@/utils/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { showLocation } from 'react-native-map-link';
import { locations } from '../../locations';

export default function CarparkScreen() {
  // Get device theme
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeStyle = useThemeStyles();

  // Get carpark name
  const params = useLocalSearchParams();
  const facilityName = String(params.facilityName || '');
  const facilityId = String(params.id || '');

  const [refreshing, setRefreshing] = useState(false);
  const [spots, setSpots] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Calculate percentages for better visualization of small segments
  const occupiedPercent = Math.round((total / spots) * 100);
  const vacantPercent = 100 - occupiedPercent;
  
  const pieData = [
    {value: occupiedPercent, color: '#FF2E2E'},
    {value: vacantPercent, color: '#00D100'},
  ];


  // Refresh screen when user scrolls down screen
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchCarparkById(facilityId);
      setSpots(data.spots);
      setTotal(data.occupancy.total);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(`Error fetching carpark ${facilityId}`);
    }
    setRefreshing(false);
  }, [facilityId]);

  // Fetch carpark information
  useEffect(() => {
    const fetchCarpark = async () => {
      try {
        const data = await fetchCarparkById(facilityId);
        setSpots(data.spots);
        setTotal(data.occupancy.total);
        setLastUpdated(new Date());
      } catch (e) {
        console.error(`Error fetching carpark ${facilityId}`)
      }
    }
    fetchCarpark();
  }, [])

  // Update current time every 5 seconds to refresh the "time ago" display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Format last updated time
  const formatLastUpdated = (date: Date | null) => {
    if (!date) return 'Never updated';

    const diffInSeconds = Math.floor((currentTime.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 10) return 'Just now';
    if (diffInSeconds < 60) return `${diffInSeconds} second${diffInSeconds > 1 ? 's' : ''} ago`;

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
  };

  const handleGetDirections = (id: string) => {
    let lat = 0;
    let long = 0;
    for (const loc of locations) {
      if (loc.facilityId == id) {
        lat = loc.latitude;
        long = loc.longitude;
      }
    }
    showLocation({
      latitude: lat,
      longitude: long,
      title: facilityName
    })
  };
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: facilityName || 'Carpark Details',
          headerShown: true,
          headerStyle: {
            backgroundColor: theme === 'dark' ? '#121212' : '#fff',
          },
          headerTintColor: theme === 'dark' ? '#fff' : '#000',
          headerBackTitle: 'Back'
        }} 
      />
      <SafeAreaView style={[styles.container, themeStyle.background]} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Carpark Information */}
          <View style={styles.topSection}>
            <View style={{ marginVertical: 50 }}>
              <Text style={[themeStyle.textColor, { fontSize: 25 }]}>Number of spots available</Text>
            </View>
            <View style={styles.chartContainer}>
              <PieChart
                donut
                radius={150}
                innerRadius={130}
                data={pieData}
                backgroundColor={theme === 'light' ? '#f2f2f2' : 'black'}
                strokeWidth={2}
                strokeColor={theme === 'light' ? '#fff' : '#121212'}
              />
              <View style={styles.chartTextContainer}>
                <Text style={[styles.chartMainNumber, themeStyle.textColor]}>{spots - total < 0 ? 0 : spots - total}</Text>
                <Text style={[styles.chartSubText, themeStyle.textColor]}>Vacant Spots</Text>
                <Text style={[styles.chartPercentage, themeStyle.textColor]}>{vacantPercent < 0 ? 0 : vacantPercent}% available</Text>
              </View>
            </View>

            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={styles.legendDotGreen} />
                <Text style={[styles.legendText, themeStyle.textColor]}>Vacant: {spots - total < 0 ? 0 : spots - total}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotRed} />
                <Text style={[styles.legendText, themeStyle.textColor]}>Occupied: {total}</Text>
              </View>
            </View>
            <View style={styles.lastUpdatedContainer}>
              <View style={styles.updateRow}>
                <Text style={[styles.clockIcon, themeStyle.textColor]}>
                  <MaterialIcons name="update" size={18} color="black" />
                </Text>
                <Text style={[styles.lastUpdatedText, themeStyle.textColor]}>
                  Updated: {formatLastUpdated(lastUpdated)}
                </Text>
              </View>
            </View>
          </View>
          {/* Get Directions Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.submitButtonContainer} onPress={() => handleGetDirections(facilityId)}>
              <Text style={styles.buttonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  topSection: {
    alignItems: 'center',
  },
  bottomSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartMainNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chartSubText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 4,
  },
  chartPercentage: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
    opacity: 0.7,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    paddingHorizontal: 20,
    marginTop: 30
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendDotGreen: {
    width: 20,
    height: 20,
    borderRadius: '100%',
    backgroundColor: '#00D100',
    marginRight: 8,
  },
  legendDotRed: {
    width: 20,
    height: 20,
    borderRadius: '100%',
    backgroundColor: '#FF2E2E',
    marginRight: 8,
  },
  legendText: {
    fontSize: 17,
    fontWeight: '500',
  },
  lastUpdatedContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  updateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  lastUpdatedText: {
    fontSize: 15,
    opacity: 0.6,
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
});