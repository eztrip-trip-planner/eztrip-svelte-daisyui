import { ThemeType } from './theme-type.enum';
import type { Theme } from './theme.interface';

export const HalloweenTheme: Theme = {
    halloween: {
        name: 'halloween',
        type: ThemeType.Dark,
        colors: {
            primary: '#f28c18',
            'primary-content': '#131616',
            secondary: '#6d3a9c',
            accent: '#51a800',
            neutral: '#1b1d1d',
            'base-100': '#212121',
            info: '#2563eb',
            success: '#16a34a',
            warning: '#d97706',
            error: '#dc2626',
        },
    },
};
