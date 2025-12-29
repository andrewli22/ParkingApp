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
      buildNumber: "10",
      bundleIdentifier: 'com.b3ef.parkingapp',
      icon: {
        light: './assets/icons/ios-light.png',
        dark: './assets/icons/ios-dark.png',
        tinted: './assets/icons/ios-tinted.png'
      },
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY
      },
      infoPlist: {
        NSLocationWhenInUseUsageDescription: 'This app needs access to your location to show nearby parking spots on the map.',
        NSLocationAlwaysAndWhenInUseUsageDescription: 'This app needs access to your location to show nearby parking spots on the map.',
        ITSAppUsesNonExemptEncryption: false
      }
    },
    android: {
      adaptiveIcon: {
        backgroundColor: '#ffffff',
        foregroundImage: './assets/icons/adaptive-icon.png'
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
          backgroundColor: '#FFFFFF',
          image: './assets/icons/splash-icon-light.png',
          dark: {
            image: './assets/icons/splash-icon-light.png',
            backgroundColor: '#000000'
          },
          imageWidth: 200
        },
      ],
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      apiBaseUrl: process.env.API_BASE_URL,
      eas: {
        projectId: process.env.PROJECT_ID
      }
    },
    updates: {
      url: process.env.EXPO_URL
    },
    runtimeVersion: '1.0.0'
  },
};