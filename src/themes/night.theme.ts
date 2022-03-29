import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const NightTheme: Theme = {
    night: {
        name: 'night',
        type: ThemeType.Dark,
        colors: {
            primary: '#38bdf8',
            secondary: '#818cf8',
            accent: '#f471b5',
            neutral: '#1e293b',
            'neutral-focus': '#273449',
            'base-100': '#0f172a',
            info: '#0ca5e9',
            success: '#2dd4bf',
            warning: '#f4bf50',
            error: '#fb7085',
        },
    },
};
