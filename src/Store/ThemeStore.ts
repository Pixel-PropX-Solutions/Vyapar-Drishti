import { Appearance } from 'react-native';
import { MMKV } from 'react-native-mmkv';

const ThemeStore = new MMKV({ id: 'theme-storage' });

export function useThemeStore() {
    return {
        getTheme: () => {
            const storedTheme = ThemeStore.getString('theme');
            if (storedTheme === 'dark' || storedTheme === 'light') {
                return storedTheme;
            }
            return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
        },
        setTheme: (theme: 'light' | 'dark') => ThemeStore.set('theme', theme),

        getPrimaryColor: () => ThemeStore.getString('primaryColor') || '#000000',
        setPrimaryColor: (color: string) => ThemeStore.set('primaryColor', color),

        getSecondaryColor: () => ThemeStore.getString('secondaryColor') || '#FFFFFF',
        setSecondaryColor: (color: string) => ThemeStore.set('secondaryColor', color),

        getPrimaryBackgroundColor: () => ThemeStore.getString('primaryBackgroundColor') || '#FFFFFF',
        setPrimaryBackgroundColor: (color: string) => ThemeStore.set('primaryBackgroundColor', color),

        getSecondaryBackgroundColor: () => ThemeStore.getString('secondaryBackgroundColor') || '#F0F0F0',
        setSecondaryBackgroundColor: (color: string) => ThemeStore.set('secondaryBackgroundColor', color),
    };
}

export default ThemeStore;
