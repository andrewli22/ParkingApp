import { Drawer } from 'expo-router/drawer';
import React from 'react';
import DarkModeSlider from '../components/DarkModeSlider';

export default function DrawerLayout() {
  return (
    <Drawer drawerContent={props => <DarkModeSlider {...props} />}>
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Home',
          title: 'Car Parks',
        }}
      />
      <Drawer.Screen
        name="feedback"
        options={{
          drawerLabel: 'Feedback',
          title: 'Feedback',
        }}
      />
    </Drawer>
  );
};