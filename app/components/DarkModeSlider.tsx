import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Switch, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function DarkModeSlider(props: DrawerContentComponentProps) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: theme === 'dark' ? '#fff' : '#000', }}>Dark Mode</Text>
        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={theme === 'dark' ? '#f5dd4b' : '#f4f3f4'}
          value={theme === 'dark'}
          onValueChange={toggleTheme}
        />
      </View>
    </DrawerContentScrollView>
  );
}