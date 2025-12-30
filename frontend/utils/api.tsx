import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

// Fetch all the carparks
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

// Fetch carpark by ID
export const fetchCarparkById = async (id: string) => {
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

// Fetch Carpark Occupancy
export const fetchCarparkOccupancy = async () => {
  try {
    const data = await fetch(`${BASE_URL}/carparks/occupancy`).then((res) => res.json());
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// Send feedback email
export const sendFeedback = async (subject: string, message: string) => {
  try {
    const response = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject: subject, message: message })
    })
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to send review: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}