import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const LemonadeTheme: Theme = {
    lemonade: {
        name: 'lemonade',
        type: ThemeType.Light,
        colors: {
            primary: '#519903',
            secondary: '#e9e92e',
            accent: '#f7f9ca',
            neutral: '#191a3f',
            'base-100': '#ffffff',
            info: '#c8e1e7',
            success: '#def29f',
            warning: '#f7e589',
            error: '#f2b6b5',
        },
    },
};
