import { useThemeStyles } from '@/utils/themeStyles';
import { router } from 'expo-router';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fetchPinnedCarparks, handleStoreCarparks, removePinnedCarpark } from '../../utils/storage';
import { CarParkDataType, SectionDataType } from '../../utils/types';
import { fetchAllCarparks } from '@/utils/api';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';

export default function HomeScreen() {
  const [allCarparks, setAllCarparks] = useState<Record<string, string>>({});
  const [pinnedCarparks, setPinnedCarparks] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(true);

  // Get device theme
  const { theme } = useTheme();
  const themeStyle = useThemeStyles();

  // Fetch all carparks only once on mount
  useEffect(() => {
    const fetchCarparks = async () => {
      try {
        setIsLoading(true);
        const carparks: Record<string, string> = await fetchAllCarparks();
        // Remove historical data and clean names
        const cleanedData = Object.entries(carparks)
          .slice(5)
          .reduce((acc, [key, value]) => {
            acc[key] = value.slice(12);
            return acc;
          }, {} as Record<string, string>);
        setAllCarparks(cleanedData);
      } catch (e) {
        console.error('Error fetching carparks:', e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCarparks();
  }, []);

  // Fetch pinned carparks only once on mount
  useEffect(() => {
    const getPinnedCP = async () => {
      try {
        const res = await fetchPinnedCarparks();
        setPinnedCarparks(res || {});
      } catch (e) {
        console.error('Error fetching pinned carparks:', e);
      }
    };
    getPinnedCP();
  }, []);

  // Cache processed carpark list so it only recalculates allCarparks or pinnedCarparks change
  const sectionData = useMemo(() => {
    if (isLoading || Object.keys(allCarparks).length === 0) return [];

    // Filter out pinned carparks from the main list
    const unpinnedEntries = Object.entries(allCarparks)
      .filter(([id]) => !(id in pinnedCarparks));

    // Group by first letter
    const grouped = unpinnedEntries.reduce((acc, [id, name]) => {
      const firstLetter = name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push({ id, name });
      return acc;
    }, {} as Record<string, CarParkDataType[]>);

    // Convert to section data and sort
    const sections: SectionDataType[] = Object.entries(grouped)
      .map(([title, data]) => ({ 
        title, 
        data: data.sort((a, b) => a.name.localeCompare(b.name)) 
      }))
      .sort((a, b) => a.title.localeCompare(b.title));

    // Add pinned section at the top if there are pinned carparks
    if (Object.keys(pinnedCarparks).length > 0) {
      const pinnedSection: SectionDataType = {
        title: 'Pinned',
        data: Object.entries(pinnedCarparks)
          .map(([id, name]) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name))
      };
      sections.unshift(pinnedSection);
    }

    return sections;
  }, [allCarparks, pinnedCarparks, isLoading]);

  const handlePinCarpark = useCallback(async (id: string, carpark: string) => {
    try {
      setPinnedCarparks(prev => ({ ...prev, [id]: carpark }));
      
      // Update AsyncStorage
      await handleStoreCarparks({ id, carpark });
    } catch (error) {
      console.error('Error pinning carpark:', error);
      setPinnedCarparks(prev => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const handleUnpinCarpark = useCallback(async (id: string) => {
    const originalValue = pinnedCarparks[id];
    
    try {
      setPinnedCarparks(prev => {
        const { [id]: removed, ...rest } = prev;
        return rest;
      });
      
      // Update AsyncStorage
      await removePinnedCarpark(id);
    } catch (error) {
      console.error('Error unpinning carpark:', error);
      setPinnedCarparks(prev => ({ ...prev, [id]: originalValue }));
    }
  }, [pinnedCarparks]);

  const handleCarparkPress = useCallback((item: CarParkDataType) => {
    router.push(`/carpark/${item.id}?facilityName=${encodeURIComponent(item.name)}`);
  }, []);

  const renderItem = useCallback(({ item, section }: { item: CarParkDataType; section: SectionDataType }) => (
    <TouchableOpacity onPress={() => handleCarparkPress(item)}>
      <View style={styles.carParkItemRow}>
        <Text style={[styles.textSize, themeStyle.textColor]}>{item.name}</Text>
        <View style={styles.pinned}>
          {section.title === 'Pinned' ? (
            <TouchableOpacity onPress={() => handleUnpinCarpark(item.id)}>
              <FontAwesome name="star" size={24} color="gold" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => handlePinCarpark(item.id, item.name)}>
              <FontAwesome name="star-o" size={24} color={themeStyle.textColor.color} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), [themeStyle, handlePinCarpark, handleUnpinCarpark, handleCarparkPress]);

  const renderSectionHeader = useCallback(({ section: { title } }: { section: { title: string } }) => (
    <View style={[styles.sectionHeader, themeStyle.sectionHeader]}>
      <Text style={[styles.sectionHeaderText, themeStyle.textColor]}>{title}</Text>
    </View>
  ), [themeStyle]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, themeStyle.background]}>
        <View style={styles.loadingContainer}>
          <Text style={themeStyle.textColor}>Loading carparks...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, themeStyle.background]} edges={['bottom']}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} />
      <SectionList
        style={styles.carParkListContainer}
        sections={sectionData}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
      />
      <Footer />
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
    padding: 12,
    marginBottom: 0,
    marginHorizontal: 5
  },
  sectionHeader: {
    width: '100%',
    padding: 4,
    backgroundColor: '#e6e6fa'
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600'
  },
  textSize: {
    fontSize: 15
  },
  pinned: {
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});