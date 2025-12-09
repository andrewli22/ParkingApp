import 'dotenv/config';

export default {
  expo: {
    owner: 'b3ef',
    name: 'ParkingApp',
    slug: 'ParkingApp',
    scheme: 'parkingapp',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.b3ef.parkingapp',
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff'
      },
      edgeToEdgeEnabled: true,
      package: 'com.b3ef.parkingapp',
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      }
    },
    web: {
      bundler: 'metro',
      output: 'static'
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff'
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: '5780fbe1-0b2b-4887-a5ce-4498e6703f2b'
      }
    },
    updates: {
      url: 'https://u.expo.dev/5780fbe1-0b2b-4887-a5ce-4498e6703f2b'
    },
    runtimeVersion: '1.0.0'
  },
};