import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_KEY } from '../../config';
import { URL } from '../../utils/api';


export default function CarparkScreen() {
  const params = useLocalSearchParams();
  const facilityName = String(params.facilityName || '');

  const [refreshing, setRefreshing] = useState(false);
  const [spots, setSpots] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const pieData = [
    {value: total , color: '#FF2E2E'},
    {value: spots-total, color: '#00D100'},
  ];

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      fetchCarParks();
    }, 1000);
  }, []);

  const fetchCarParks = () => {
    try{
      fetch(URL+`/carpark?facility=${params.id}`, {
        headers: {
          'Authorization': `apikey ${API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
        .then((res) => res.json())
        .then((data) => {
          setTotal(Number(data.occupancy.total));
          setSpots(Number(data.spots));
        });
    } catch (e) {
      console.error(e)
    }
  };

  useEffect(() => {
    fetchCarParks();
  }, [])
  
  return (
    <>
      <Stack.Screen 
        options={{ 
          title: facilityName || 'Carpark Details',
          headerShown: true 
        }} 
      />
      <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View>
            <Text style={{ fontSize: 25 }}>Number of spots available</Text>
          </View>
          <View style={styles.pieChart}>
            <View style={styles.pieTextContainer}>
              <Text style={styles.pieText}>{spots - total} / {spots}</Text>
            </View>
            <PieChart
              donut
              radius={150}
              innerRadius={130}
              data={pieData}
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