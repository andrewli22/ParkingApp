// app/_layout.tsx (Root Layout)
import { Stack } from 'expo-router';
import ThemeProvider from './contexts/ThemeContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name='(drawer)' options={{ headerShown: false }} />
          <Stack.Screen
            name='carpark/[id]'
            options={{
              headerShown: true,
              title: 'Carpark Details' // Will be overridden by the screen
            }}
          />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}