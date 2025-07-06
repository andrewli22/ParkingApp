import { useThemeStyles } from '@/utils/themeStyles';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../contexts/ThemeContext';


export default function CarparkScreen() {
  // Get device theme
  const { theme, toggleTheme } = useContext(ThemeContext);
  const themeStyle = useThemeStyles();

  // Get carpark name
  const params = useLocalSearchParams();
  const facilityName = String(params.facilityName || '');

  const [refreshing, setRefreshing] = useState(false);
  const [spots, setSpots] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const pieData = [
    {value: total , color: '#FF2E2E'},
    {value: spots-total, color: '#00D100'},
  ];

  // Refresh screen when user scrolls down screen
  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);
  //   setTimeout(() => {
  //     setRefreshing(false);
  //     fetchCarParks();
  //   }, 1000);
  // }, []);

  // Fetch carpark information
  // const fetchCarParks = () => {
  //   try{
  //     fetch(URL+`/carpark?facility=${params.id}`, {
  //       headers: {
  //         'Authorization': `apikey ${API_KEY}`,
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         setTotal(Number(data.occupancy.total));
  //         setSpots(Number(data.spots));
  //       });
  //   } catch (e) {
  //     console.error(e)
  //   }
  // };

  // useEffect(() => {
  //   fetchCarParks();
  // }, [])
  
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
        }} 
      />
      <SafeAreaView style={[styles.container, themeStyle.background]} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          // refreshControl={
          //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          // }
        >
          <View>
            <Text style={[themeStyle.textColor, { fontSize: 25 }]}>Number of spots available</Text>
          </View>
          <View style={styles.pieChart}>
            <View style={styles.pieTextContainer}>
              <Text style={[styles.pieText, themeStyle.textColor]}>{spots - total} / {spots}</Text>
            </View>
            <PieChart
              donut
              radius={150}
              innerRadius={130}
              data={pieData}
              backgroundColor={theme === 'light' ? '#f2f2f2' : 'black'}
            />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChart: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 50
  },
  pieText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 40
  },
  pieTextContainer: {
    zIndex: 1,
    position: 'absolute',
    top: 310
  }
});