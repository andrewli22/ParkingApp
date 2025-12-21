import { Drawer } from 'expo-router/drawer';
import React, { useContext } from 'react';
import DarkModeSlider from '../components/DarkModeSlider';
import { ThemeContext } from '../contexts/ThemeContext';

export default function DrawerLayout() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <Drawer
      drawerContent={props => <DarkModeSlider {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#fff',
        },
        drawerLabelStyle: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
        headerStyle: {
          backgroundColor: theme === 'dark' ? '#121212' : '#fff',
        },
        headerTintColor: theme === 'dark' ? '#fff' : '#000',
      }}
    >
      <Drawer.Screen
        name='index'
        options={{
          drawerLabel: 'Home',
          title: 'Carpark',
        }}
      />
      <Drawer.Screen
        name='feedback'
        options={{
          drawerLabel: 'Feedback',
          title: 'Feedback',
        }}
      />
      <Drawer.Screen
        name='issues'
        options={{
          drawerLabel: 'Report an issue',
          title: 'Report an Issue',
        }}
      />
    </Drawer>
  );
};