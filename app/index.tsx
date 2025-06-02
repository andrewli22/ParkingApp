import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_KEY } from '../config';
import { URL } from '../utils/api';
import { fetchPinnedCarparks, handleStoreCarparks, removePinnedCarpark } from '../utils/storage';
import { CarParkDataType, SectionDataType } from '../utils/types';

export default function HomeScreen() {
  const [data, setData] = useState<SectionDataType[]>([]);
  const [pinnedCarparks, setPinnedCarparks] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const fetchCarparks = async () => {
      try {
        const response = await fetch(URL+'/carpark', {
          headers: {
            'Authorization': `apikey ${API_KEY}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch carparks: ${response.statusText}`);
        }

        const carparks: Record<string, string> = await response.json();
        // Remove historical data and filter out pinned carparks
        const cleanedData = Object.entries(carparks).slice(5)
          .filter(([id]) => !(id in pinnedCarparks))
          .map(([key, value]) => [key, value.slice(12)]);
        
        // Convert data to sectionList data structure then sort titles
        const sectionedData: SectionDataType[] = convertToSectionData(groupData(cleanedData));
        sectionedData.sort((a, b) => (a.title.localeCompare(b.title)))

        // Add the pinned carparks at the top of the list so it gets rendered first in the list
        sectionedData.unshift(transformData(Object.entries(pinnedCarparks)))

        setData(sectionedData);
      } catch (e) {
        console.error(e)
      }
    };
    fetchCarparks();
  }, []);

  // Group data by first letter of carpark name
  const groupData = (data: string[][]) => {
    return data.reduce((acc, [id, carpark]) => {
      const firstLetter = carpark.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({ id, name: carpark });
      return acc;
    }, {} as Record<string, CarParkDataType[]>);
  };
  
  // convert to appropriate data structure to render sectionList
  const convertToSectionData = (groupedData: Record<string, CarParkDataType[]>) => {
    return Object.entries(groupedData).map(([title, data]) => ({ title, data }));
  };

  const transformData = (pinnedCP: string[][]) => {
    return {
      title: 'Pinned',
      data: pinnedCP.map((cp) => ({
        id: cp[0],
        name: cp[1]
      }))
    };
  }

  useEffect(() => {
    const getPinnedCP = async () => {
      const res = await fetchPinnedCarparks();
      setPinnedCarparks(res);
    }
    getPinnedCP();
  }, [])

  const handlePinCarpark = async (id: string, carpark: string) => {
    await handleStoreCarparks({ id, carpark });
    setData((prevData) => {
      const newCarpark = { 'id': id, 'name': carpark };
      const sourceSection = carpark.charAt(0);
      
      // Create new array with all updates at once
      return (prevData.map(section => {
        switch (section.title) {
          case sourceSection:
            // Remove from original section
            return {
              ...section,
              data: section.data.filter((cp) => cp.id !== id)
            };
            
          case 'Pinned':
            // Add to pinned section
            return {
              ...section,
              data: [...section.data, newCarpark]
            };
            
          default:
            return section;
        }
      }));
    });
  }

  const handleUnpinCarpark = async (id: string, carpark: string) => {
    await removePinnedCarpark(id);
    setData((prevData) => {
      const sourceSection = carpark.charAt(0);
      const unpinnedCarpark = { 'id': id, 'name': carpark }
      return (
        prevData.map((section) => {
          switch(section.title) {
            // Add to corresponding section
            case sourceSection:
              return {
                ...section,
                data: [...section.data, unpinnedCarpark]
              }
            // Remove from pinned section
            case 'Pinned':
              return {
                ...section,
                data: section.data.filter((cp) => cp.id !== id)
              }
            default:
              return section
          }
        })
      )
    })
  }

  const handleCarparkPress = (item: CarParkDataType) => {
    router.push({
      pathname: '/carpark/[id]',
      params: {
        id: item.id,
        facilityName: item.name
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
        <SectionList
          style={styles.carParkListContainer}
          sections={data.filter((section) => section.data.length > 0)}
          renderItem={({ item, section }) => (
            <TouchableOpacity
              onPress={() => handleCarparkPress(item)}
            >
              <View style={styles.carParkItemRow}>
                <Text style={styles.textSize}>{item.name}</Text>
                {section.title === 'Pinned' ? 
                  (
                    <Button 
                      title='Unpin'
                      onPress={() => handleUnpinCarpark(item.id, item.name)}
                    />
                  )
                  :
                  (
                    <Button 
                      title='Pin'
                      onPress={() => handlePinCarpark(item.id, item.name)}
                    />
                  )
                }
              </View>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title }}) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{title}</Text>
            </View>
          )}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  carParkListContainer: {
    width: '100%',
    marginBottom: 10,
  },
  carParkItemRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginBottom: 0,
    marginHorizontal: 5
  },
  sectionHeader: {
    width: '100%',
    padding: 3,
    backgroundColor: '#e6e6fa'
  },
  sectionHeaderText: {
    // textDecorationLine: 'underline'
  },
  textSize: {
    fontSize: 15
  }
});