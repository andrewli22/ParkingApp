import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig.extra.apiBaseUrl;

export const fetchAllCarparks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/carparks`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch carparks: ${response.statusText}`);
    }

    const carparks = await response.json();
    return carparks;
  } catch (error) {
    console.error('API error fetching carparks:', error);
    throw error;
  }
};

export const fetchCarparkById = async (id: string) => {
  console.log(id);
  try {
    const response = await fetch(`${BASE_URL}/carparks/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch carpark ${id}: ${response.statusText}`);
    }

    const carpark = await response.json();
    return carpark;
  } catch (error) {
    console.error(`API error fetching carpark ${id}:`, error);
    throw error;
  }
};