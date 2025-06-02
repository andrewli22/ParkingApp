import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Car Parks',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="carpark/[id]" 
        options={{ 
          title: 'Car Park Details',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
