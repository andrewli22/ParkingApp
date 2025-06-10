import { useContext } from 'react';
import { ThemeContext } from '../app/contexts/ThemeContext';

/**
 * Helper function to update the style of page when toggling between Dark / Light mode
 * @returns 
 */

export const useThemeStyles = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return {
    background: { backgroundColor: isDark ? 'black' : '#f2f2f2' },
    textColor: { color: isDark ? 'white' : 'black' },
    sectionHeader: { backgroundColor: isDark ? '#3e4444' : '#b2b2b2' },
  };
}