import { useThemeStyles } from '@/utils/themeStyles';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Switch, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function DarkModeSlider(props: DrawerContentComponentProps) {
  const { theme, toggleTheme } = useTheme();
  const themeStyle = useThemeStyles();

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <View style={{ paddingHorizontal: 16, paddingTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={[themeStyle.textColor, { fontSize: 14, fontWeight: '500' }]}>Dark Mode</Text>
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