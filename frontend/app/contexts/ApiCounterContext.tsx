import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ApiCounterContextType {
  apiCallCount: number;
  incrementApiCall: () => void;
  resetApiCallCount: () => void;
  getApiCallCount: () => number;
}

export const ApiCounterContext = createContext<ApiCounterContextType>({
  apiCallCount: 0,
  incrementApiCall: () => {},
  resetApiCallCount: () => {},
  getApiCallCount: () => 0,
});

interface ApiCounterProviderProps {
  children: ReactNode;
}

export default function ApiCounterProvider({ children }: ApiCounterProviderProps) {
  const [apiCallCount, setApiCallCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const API_COUNTER_KEY = '@api_call_count';

  // Load saved count when component mounts
  useEffect(() => {
    loadApiCallCount();
  }, []);

  // Save count to AsyncStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      saveApiCallCount(apiCallCount);
    }
  }, [apiCallCount, isLoaded]);

  // Load count from AsyncStorage
  const loadApiCallCount = async () => {
    try {
      const savedCount = await AsyncStorage.getItem(API_COUNTER_KEY);
      if (savedCount !== null) {
        setApiCallCount(parseInt(savedCount, 10));
      }
    } catch (error) {
      console.error('Error loading API call count:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  // Save count to AsyncStorage
  const saveApiCallCount = async (count: number) => {
    try {
      await AsyncStorage.setItem(API_COUNTER_KEY, count.toString());
    } catch (error) {
      console.error('Error saving API call count:', error);
    }
  };

  // Increment the API call counter
  const incrementApiCall = () => {
    setApiCallCount((prev) => prev + 1);
  };

  // Reset the counter to 0
  const resetApiCallCount = async () => {
    setApiCallCount(0);
    try {
      await AsyncStorage.removeItem(API_COUNTER_KEY);
    } catch (error) {
      console.error('Error resetting API call count:', error);
    }
  };

  // Get current count (helper function)
  const getApiCallCount = () => {
    return apiCallCount;
  };

  return (
    <ApiCounterContext.Provider 
      value={{ 
        apiCallCount, 
        incrementApiCall, 
        resetApiCallCount, 
        getApiCallCount 
      }}
    >
      {children}
    </ApiCounterContext.Provider>
  );
}

// Custom hook to use the API counter context
export function useApiCounter() {
  const context = useContext(ApiCounterContext);
  if (!context) {
    throw new Error('useApiCounter must be used within an ApiCounterProvider');
  }
  return context;
}