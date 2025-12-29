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
    background: { backgroundColor: isDark ? 'black' : 'white' },
    textColor: { color: isDark ? 'white' : 'black' },
    sectionHeader: { backgroundColor: isDark ? '#2a2a2aff' : '#e1e1e1ff' },
    borderColor: { borderColor: isDark ? 'white' : 'black' },
  };
}